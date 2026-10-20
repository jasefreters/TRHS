/*
  Runs an independent elective: choose a level (if the module has levels), work through the
  items one at a time, then show a certificate once.

  Item types:
    { type: "read", title, text }                        a page to read
    { type: "mc", q, choices: [...], answer: 0, explain }  multiple choice (answer is the index)
    { type: "input", q, answer: "42", accept: [...], explain }  type an answer
    { type: "scale", q, labels: [...] }                  rate yourself (no right answer)
*/
window.RP = window.RP || {};

RP.Player = (function () {
  const h = s => RP.h(s);
  const scored = it => it.type === "mc" || it.type === "input";

  function itemsFor(module, level) {
    if (!module.levels) return module.items;
    const l = module.levels.find(l => l.level === level) || module.levels[0];
    return l.items;
  }

  function sameAnswer(given, item) {
    const clean = s => String(s).trim().toLowerCase().replace(/[$,\s]/g, "").replace(/\.$/, "");
    const g = clean(given);
    if (!g) return false;
    return [item.answer].concat(item.accept || []).some(a => {
      const c = clean(a);
      if (g === c) return true;
      const gn = Number(g), cn = Number(c);
      return !isNaN(gn) && !isNaN(cn) && Math.abs(gn - cn) < 1e-9;
    });
  }

  /*
    opts: { el, module, session, save(status, result, state), onExit(), onFinish(result) }
    state saved on the session: { level, index, firstTry: { [index]: true|false } }
  */
  function open(opts) {
    const { el, module, session } = opts;
    let state = Object.assign({}, session.state || {});
    if (state.firstTry == null) state.firstTry = {};
    let tries = 0;

    function persist() { opts.save("in_progress", null, state); }

    function chooseLevel() {
      const suggested = state.level;
      el.innerHTML = `
        <div class="player">
          ${header()}
          <div class="player-body">
            <h2>Choose your level</h2>
            ${suggested ? `<p>Your teacher suggests <strong>${h(levelTitle(suggested))}</strong>.</p>` : `<p>Pick the level that feels about right. If it's too easy or too hard, tell your teacher.</p>`}
            <div class="level-grid">
              ${module.levels.map(l => `
                <button class="level-card${l.level === suggested ? " suggested" : ""}" data-level="${l.level}">
                  <span class="level-name">${h(l.title)}</span>
                  <span class="level-about">${h(l.about || "")}</span>
                  ${l.level === suggested ? `<span class="tag">Suggested</span>` : ""}
                </button>`).join("")}
            </div>
          </div>
        </div>`;
      bindHeader();
      el.querySelectorAll("[data-level]").forEach(b => b.onclick = () => {
        state.level = Number(b.dataset.level);
        state.index = 0;
        state.firstTry = {};
        persist();
        showItem();
      });
    }

    function levelTitle(level) {
      const l = module.levels && module.levels.find(l => l.level === level);
      return l ? l.title : "";
    }

    function header() {
      const items = state.index != null ? itemsFor(module, state.level) : null;
      const pct = items ? Math.round((state.index / items.length) * 100) : 0;
      return `
        <div class="player-head">
          <div>
            <div class="player-title">${h(module.title)}${state.level && module.levels ? ` <span class="muted">· ${h(levelTitle(state.level))}</span>` : ""}</div>
            ${items ? `<div class="progress" aria-label="Progress"><div style="width:${pct}%"></div></div>` : ""}
          </div>
          <button class="btn ghost" data-exit>Save and close</button>
        </div>`;
    }
    // The most recent reading before this question, so students can look back at it.
    function lastReading() {
      if (state.index == null) return null;
      const items = itemsFor(module, state.level);
      for (let i = Math.min(state.index, items.length) - 1; i >= 0; i--) if (items[i].type === "read") return items[i];
      return null;
    }
    function bindHeader() {
      el.querySelector("[data-exit]").onclick = () => { persist(); opts.onExit(); };
      const items = state.index != null ? itemsFor(module, state.level) : [];
      const reading = items[state.index] && items[state.index].type !== "read" ? lastReading() : null;
      if (!reading) return;
      const head = el.querySelector(".player-head");
      const b = document.createElement("button");
      b.className = "btn ghost"; b.textContent = "Back to the text";
      head.insertBefore(b, head.lastElementChild);
      const panel = document.createElement("div");
      panel.className = "card reading look-back"; panel.hidden = true;
      panel.innerHTML = (reading.title ? `<h3>${h(reading.title)}</h3>` : "") + RP.md(reading.text);
      head.after(panel);
      b.onclick = () => { panel.hidden = !panel.hidden; b.textContent = panel.hidden ? "Back to the text" : "Hide the text"; };
    }

    function showItem() {
      const items = itemsFor(module, state.level);
      if (state.index >= items.length) return finish();
      const it = items[state.index];
      tries = 0;
      const n = items.filter(scored).length, done = items.slice(0, state.index).filter(scored).length;
      let body = "";
      if (it.type === "read") {
        body = `${it.title ? `<h2>${h(it.title)}</h2>` : ""}<div class="reading">${RP.md(it.text)}</div>
          <div class="actions"><button class="btn primary" data-next>Next</button></div>`;
      } else if (it.type === "mc") {
        body = `<div class="q-count">Question ${done + 1} of ${n}</div><h2 class="q">${RP.md(it.q)}</h2>
          <div class="choices">${it.choices.map((c, i) => `<button class="choice" data-choice="${i}">${h(c)}</button>`).join("")}</div>
          <div class="feedback" aria-live="polite"></div>
          <div class="actions"><button class="btn primary" data-next hidden>Next</button></div>`;
      } else if (it.type === "input") {
        body = `<div class="q-count">Question ${done + 1} of ${n}</div><h2 class="q">${RP.md(it.q)}</h2>
          <form class="answer-row" data-form>
            ${it.prefix ? `<span class="affix">${h(it.prefix)}</span>` : ""}
            <input class="answer" autocomplete="off" inputmode="${it.text ? "text" : "decimal"}" aria-label="Your answer">
            ${it.suffix ? `<span class="affix">${h(it.suffix)}</span>` : ""}
            <button class="btn primary" type="submit">Check</button>
          </form>
          <div class="feedback" aria-live="polite"></div>
          <div class="actions"><button class="btn ghost" data-show hidden>Show me the answer</button><button class="btn primary" data-next hidden>Next</button></div>`;
      } else if (it.type === "scale") {
        body = `<h2 class="q">${RP.md(it.q)}</h2>
          <div class="scale">${it.labels.map((l, i) => `<button class="choice" data-scale="${i}">${h(l)}</button>`).join("")}</div>
          <div class="actions"><button class="btn primary" data-next hidden>Next</button></div>`;
      }
      el.innerHTML = `<div class="player">${header()}<div class="player-body">${body}</div></div>`;
      bindHeader();

      const next = el.querySelector("[data-next]");
      const fb = el.querySelector(".feedback");
      const revealNext = () => { next.hidden = false; next.focus(); };
      next.onclick = () => { state.index++; persist(); showItem(); };

      const right = () => {
        if (!(state.index in state.firstTry)) state.firstTry[state.index] = tries === 0;
        fb.className = "feedback good";
        fb.innerHTML = "Correct!" + (it.explain ? " " + RP.md(it.explain).replace(/^<p>|<\/p>$/g, "") : "");
        revealNext();
      };
      const wrong = () => {
        tries++;
        state.firstTry[state.index] = false;
        fb.className = "feedback bad";
        fb.textContent = tries === 1 ? "Not quite. Have another go." : "Still not right. Try again, or look at the answer.";
        const show = el.querySelector("[data-show]");
        if (show && tries >= 2) show.hidden = false;
      };

      if (it.type === "mc") {
        el.querySelectorAll("[data-choice]").forEach(b => b.onclick = () => {
          if (!next.hidden) return;
          if (Number(b.dataset.choice) === it.answer) { b.classList.add("right"); el.querySelectorAll("[data-choice]").forEach(x => x.disabled = true); right(); }
          else { b.classList.add("wrong"); b.disabled = true; wrong(); }
        });
      }
      if (it.type === "input") {
        const input = el.querySelector(".answer");
        input.focus();
        el.querySelector("[data-form]").onsubmit = e => {
          e.preventDefault();
          if (!next.hidden) return;
          if (sameAnswer(input.value, it)) { input.classList.add("right"); input.disabled = true; right(); }
          else { input.classList.add("wrong"); setTimeout(() => input.classList.remove("wrong"), 600); wrong(); }
        };
        el.querySelector("[data-show]").onclick = e => {
          state.firstTry[state.index] = false;
          input.value = it.answer; input.disabled = true;
          fb.className = "feedback"; fb.innerHTML = "The answer is <strong>" + h(it.answer) + "</strong>." + (it.explain ? " " + RP.md(it.explain).replace(/^<p>|<\/p>$/g, "") : "");
          e.target.hidden = true; revealNext();
        };
      }
      if (it.type === "scale") {
        el.querySelectorAll("[data-scale]").forEach(b => b.onclick = () => {
          el.querySelectorAll("[data-scale]").forEach(x => x.classList.remove("picked"));
          b.classList.add("picked"); revealNext();
        });
      }
      if (it.type === "read") next.focus();
    }

    function finish() {
      const items = itemsFor(module, state.level);
      const outOf = items.filter(scored).length;
      const score = items.map((it, i) => scored(it) && state.firstTry[i] === true).filter(Boolean).length;
      const result = { score, outOf };
      if (module.levels) { result.level = state.level; result.levelTitle = levelTitle(state.level); }
      opts.onFinish(result, state);
    }

    if (module.levels && state.index == null) chooseLevel();
    else { if (state.index == null) state.index = 0; showItem(); }
  }

  // Shown once, straight after finishing. The name is typed here and never saved.
  function certificate(el, cert, onDone) {
    el.innerHTML = `
      <div class="cert-wrap">
        <div class="cert-controls no-print">
          <h2>Well done! You finished ${h(cert.title)}.</h2>
          <label class="field">Type your name for your certificate
            <input data-name autocomplete="off" maxlength="40">
          </label>
          <p class="muted">Your name only goes on this certificate. It isn't saved anywhere. This certificate only appears once, so print it or save it as a PDF now.</p>
          <div class="actions">
            <button class="btn primary" data-print>Print or save as PDF</button>
            <button class="btn ghost" data-done>I'm finished</button>
          </div>
        </div>
        <div class="certificate" id="certificate">
          <div class="cert-burst">${RP.sunburst(120, "#2e7fd1")}</div>
          <div class="cert-school">Thomas Reddall High School</div>
          <div class="cert-heading">Certificate of Completion</div>
          <div class="cert-small">This certificate is awarded to</div>
          <div class="cert-name" data-cert-name>&nbsp;</div>
          <div class="cert-small">for completing</div>
          <div class="cert-module">${h(cert.title)}${cert.levelTitle ? ` · ${h(cert.levelTitle)}` : ""}</div>
          ${cert.outOf ? `<div class="cert-score">${cert.score} out of ${cert.outOf} correct first time</div>` : ""}
          <div class="cert-foot"><span>Reset Program</span><span>${h(cert.date)}</span></div>
        </div>
      </div>`;
    const name = el.querySelector("[data-name]"), out = el.querySelector("[data-cert-name]");
    name.oninput = () => { out.textContent = name.value.trim() || " "; };
    name.focus();
    el.querySelector("[data-print]").onclick = () => {
      if (!name.value.trim()) { name.focus(); name.classList.add("wrong"); setTimeout(() => name.classList.remove("wrong"), 600); return; }
      window.print();
    };
    el.querySelector("[data-done]").onclick = () => {
      if (!confirm("Close the certificate? It won't appear again.")) return;
      onDone();
    };
  }

  return { open, certificate };
})();
