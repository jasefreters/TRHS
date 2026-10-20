/*
  Runs an independent elective: choose a level (if the module has levels), work through the
  items one at a time, then show a certificate once.

  Item types:
    { type: "read", title, text }                          a page to read
    { type: "mc", q, choices: [...], answer: 0, explain }    multiple choice (answer is the index)
    { type: "input", q, answer: "42", accept: [...], explain }  type an answer
    { type: "sort", q, buckets: [...], cards: [{ text, bucket }], explain }  tap cards into groups
    { type: "order", q, cards: [...in the right order], explain }  put cards in order
    { type: "scale", q, labels: [...] }                    rate yourself (no right answer, not kept)
    { type: "select", q, options: [...], pick: 3, other: true }  choose what fits you
    { type: "write", title, q, prompts: [...] }             write your own answers

  What students choose in "select" and write in "write" stays on the laptop while they work. When
  they finish the module it is saved with the module (state.responses) for the teacher to read,
  and shown with the certificate.
*/
window.RP = window.RP || {};

RP.Player = (function () {
  const h = s => RP.h(s);
  const scored = it => ["mc", "input", "sort", "order"].includes(it.type);
  const inlineMd = RP.inlineMd;

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

  function shuffled(n) {
    const a = [...Array(n).keys()];
    do {
      for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    } while (n > 1 && a.every((v, i) => v === i));
    return a;
  }

  /*
    opts: { el, module, session, answers: { get(), set(obj) }, save(status, result, state), onExit(), onFinish(result, state, worksheet) }
    state saved on the session: { level, index, firstTry: { [index]: true|false } }
  */
  function open(opts) {
    const { el, module, session } = opts;
    let state = Object.assign({}, session.state || {});
    if (state.firstTry == null) state.firstTry = {};
    const answers = (opts.answers && opts.answers.get()) || {};
    const keepAnswers = () => { if (opts.answers) opts.answers.set(answers); };
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
      el.querySelector("[data-exit]").onclick = () => { keepAnswers(); persist(); opts.onExit(); };
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
      const i = state.index;
      tries = 0;
      const n = items.filter(scored).length, done = items.slice(0, i).filter(scored).length;
      const count = module.score === false ? "" : `<div class="q-count">Question ${done + 1} of ${n}</div>`;
      const checkActions = `<div class="actions"><button class="btn primary" data-check>Check</button><button class="btn ghost" data-show hidden>Show me the answer</button><button class="btn primary" data-next hidden>Next</button></div>`;
      let body = "";
      // For sort and order: the current arrangement while the student works on it.
      let order = null, placed = null, chosenCard = null;

      if (it.type === "read") {
        body = `${it.title ? `<h2>${h(it.title)}</h2>` : ""}<div class="reading">${RP.md(it.text)}</div>
          <div class="actions"><button class="btn primary" data-next>Next</button></div>`;
      } else if (it.type === "mc") {
        body = `${count}<h2 class="q">${RP.md(it.q)}</h2>
          <div class="choices">${it.choices.map((c, k) => `<button class="choice" data-choice="${k}">${h(c)}</button>`).join("")}</div>
          <div class="feedback" aria-live="polite"></div>
          <div class="actions"><button class="btn primary" data-next hidden>Next</button></div>`;
      } else if (it.type === "input") {
        body = `${count}<h2 class="q">${RP.md(it.q)}</h2>
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
          <div class="scale">${it.labels.map((l, k) => `<button class="choice" data-scale="${k}">${h(l)}</button>`).join("")}</div>
          <p class="muted small">Just for you to think about. This isn't saved.</p>
          <div class="actions"><button class="btn primary" data-next hidden>Next</button></div>`;
      } else if (it.type === "sort") {
        order = shuffled(it.cards.length);
        placed = {};
        body = `${count}<h2 class="q">${RP.md(it.q)}</h2>
          <p class="muted">Tap a card, then tap the group it belongs in.</p>
          <div class="sort-pool" data-pool></div>
          <div class="sort-buckets">${it.buckets.map((b, k) => `<div class="bucket" data-bucket="${k}"><div class="bucket-title">${h(b)}</div><div class="bucket-cards"></div></div>`).join("")}</div>
          <div class="feedback" aria-live="polite"></div>${checkActions}`;
      } else if (it.type === "order") {
        order = shuffled(it.cards.length);
        body = `${count}<h2 class="q">${RP.md(it.q)}</h2>
          <p class="muted">Use the arrows to move each card into the right place.</p>
          <ol class="order-list" data-order></ol>
          <div class="feedback" aria-live="polite"></div>${checkActions}`;
      } else if (it.type === "select") {
        const a = answers[i] || (answers[i] = { picked: [], other: "" });
        body = `${it.title ? `<h2>${h(it.title)}</h2>` : ""}<h2 class="q">${RP.md(it.q)}</h2>
          ${it.pick ? `<p class="muted" data-count></p>` : `<p class="muted">Choose as many as you like.</p>`}
          <div class="select-grid">${it.options.map((o, k) => `<button class="choice${a.picked.includes(k) ? " picked" : ""}" data-opt="${k}" aria-pressed="${a.picked.includes(k)}">${h(o)}</button>`).join("")}</div>
          ${it.other ? `<label class="field other">Something else? <input data-other maxlength="120" value="${h(a.other)}"></label>` : ""}
          <div class="actions"><button class="btn primary" data-next>Next</button></div>`;
      } else if (it.type === "write") {
        const a = answers[i] || (answers[i] = []);
        body = `${it.title ? `<h2>${h(it.title)}</h2>` : ""}${it.q ? `<div class="reading">${RP.md(it.q)}</div>` : ""}
          ${it.prompts.map((p, k) => `<label class="field write"><span>${inlineMd(p)}</span><textarea rows="3" data-write="${k}" maxlength="1500">${h(a[k] || "")}</textarea></label>`).join("")}
          <p class="muted small">You can leave any box blank. When you finish the module, your answers are sent to your teacher.</p>
          <div class="actions"><button class="btn primary" data-next>Next</button></div>`;
      }
      el.innerHTML = `<div class="player">${header()}<div class="player-body">${body}</div></div>`;
      bindHeader();

      const next = el.querySelector("[data-next]");
      const fb = el.querySelector(".feedback");
      const revealNext = () => { next.hidden = false; next.focus(); };
      next.onclick = () => { keepAnswers(); state.index++; persist(); showItem(); };

      const explain = () => (it.explain ? " " + inlineMd(it.explain) : "");
      const right = () => {
        if (!(i in state.firstTry)) state.firstTry[i] = tries === 0;
        fb.className = "feedback good";
        fb.innerHTML = "Correct!" + explain();
        const check = el.querySelector("[data-check]"); if (check) check.hidden = true;
        const show = el.querySelector("[data-show]"); if (show) show.hidden = true;
        revealNext();
      };
      const wrong = (message) => {
        tries++;
        state.firstTry[i] = false;
        fb.className = "feedback bad";
        fb.textContent = message || (tries === 1 ? "Not quite. Have another go." : "Still not right. Try again, or look at the answer.");
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
          state.firstTry[i] = false;
          input.value = it.answer; input.disabled = true;
          fb.className = "feedback"; fb.innerHTML = "The answer is <strong>" + h(it.answer) + "</strong>." + explain();
          e.target.hidden = true; revealNext();
        };
      }
      if (it.type === "scale") {
        el.querySelectorAll("[data-scale]").forEach(b => b.onclick = () => {
          el.querySelectorAll("[data-scale]").forEach(x => x.classList.remove("picked"));
          b.classList.add("picked"); revealNext();
        });
      }

      if (it.type === "sort") {
        const pool = el.querySelector("[data-pool]");
        const check = el.querySelector("[data-check]");
        const cardBtn = k => `<button class="sort-card${chosenCard === k ? " chosen" : ""}" data-card="${k}">${h(it.cards[k].text)}</button>`;
        const draw = (marks) => {
          pool.innerHTML = order.filter(k => !(k in placed)).map(cardBtn).join("") || `<span class="muted">All cards placed.</span>`;
          el.querySelectorAll("[data-bucket]").forEach(b => {
            const bi = Number(b.dataset.bucket);
            b.querySelector(".bucket-cards").innerHTML = order.filter(k => placed[k] === bi).map(cardBtn).join("");
            b.classList.toggle("ready", chosenCard != null);
          });
          if (marks) el.querySelectorAll("[data-card]").forEach(c => c.classList.add(marks[c.dataset.card] ? "right" : "wrong"));
          check.disabled = Object.keys(placed).length < it.cards.length;
          el.querySelectorAll("[data-card]").forEach(c => c.onclick = e => {
            e.stopPropagation();
            if (!next.hidden) return;
            const k = Number(c.dataset.card);
            // With a card chosen, tapping a card already in a group places the chosen card there.
            if (chosenCard != null && chosenCard !== k && k in placed) { placed[chosenCard] = placed[k]; chosenCard = null; draw(); return; }
            chosenCard = chosenCard === k ? null : k;
            draw();
          });
        };
        el.querySelectorAll("[data-bucket]").forEach(b => b.onclick = () => {
          if (chosenCard == null || !next.hidden) return;
          placed[chosenCard] = Number(b.dataset.bucket);
          chosenCard = null; draw();
        });
        check.onclick = () => {
          const marks = {};
          it.cards.forEach((c, k) => { marks[k] = placed[k] === c.bucket; });
          if (Object.values(marks).every(Boolean)) { draw(marks); right(); el.querySelectorAll("[data-card]").forEach(c => c.disabled = true); return; }
          draw(marks);
          wrong(tries === 0 ? "Some cards are in the wrong group. They'll go back so you can try again." : null);
          setTimeout(() => { it.cards.forEach((c, k) => { if (!marks[k]) delete placed[k]; }); if (next.hidden) draw(); }, 1200);
        };
        el.querySelector("[data-show]").onclick = e => {
          state.firstTry[i] = false;
          it.cards.forEach((c, k) => { placed[k] = c.bucket; });
          chosenCard = null; draw();
          el.querySelectorAll("[data-card]").forEach(c => { c.classList.add("right"); c.disabled = true; });
          fb.className = "feedback"; fb.innerHTML = "Here's where each card goes." + explain();
          check.hidden = true; e.target.hidden = true; revealNext();
        };
        draw();
      }

      if (it.type === "order") {
        const list = el.querySelector("[data-order]");
        const check = el.querySelector("[data-check]");
        const draw = (marks) => {
          list.innerHTML = order.map((k, pos) => `
            <li class="order-card${marks ? (marks[pos] ? " right" : " wrong") : ""}">
              <span class="order-num">${pos + 1}</span>
              <span class="order-text">${h(it.cards[k])}</span>
              <span class="order-moves">
                <button class="btn small" data-up="${pos}" aria-label="Move up" ${pos === 0 || !next.hidden ? "disabled" : ""}>↑</button>
                <button class="btn small" data-down="${pos}" aria-label="Move down" ${pos === order.length - 1 || !next.hidden ? "disabled" : ""}>↓</button>
              </span>
            </li>`).join("");
          list.querySelectorAll("[data-up]").forEach(b => b.onclick = () => { const p = Number(b.dataset.up); [order[p - 1], order[p]] = [order[p], order[p - 1]]; draw(); });
          list.querySelectorAll("[data-down]").forEach(b => b.onclick = () => { const p = Number(b.dataset.down); [order[p + 1], order[p]] = [order[p], order[p + 1]]; draw(); });
        };
        check.onclick = () => {
          const marks = order.map((k, pos) => k === pos);
          if (marks.every(Boolean)) { right(); draw(marks); return; }
          draw(marks); wrong();
        };
        el.querySelector("[data-show]").onclick = e => {
          state.firstTry[i] = false;
          order = it.cards.map((c, k) => k);
          check.hidden = true; e.target.hidden = true; revealNext();
          draw(order.map(() => true));
          fb.className = "feedback"; fb.innerHTML = "Here's the right order." + explain();
        };
        draw();
      }

      if (it.type === "select") {
        const a = answers[i];
        const total = () => a.picked.length + (a.other.trim() ? 1 : 0);
        const update = () => {
          const c = el.querySelector("[data-count]");
          if (c) c.textContent = total() >= it.pick ? `You've chosen ${total()}.` : `Choose ${it.pick}. You've chosen ${total()} so far.`;
          next.disabled = !!it.pick && total() < it.pick;
          keepAnswers();
        };
        el.querySelectorAll("[data-opt]").forEach(b => b.onclick = () => {
          const k = Number(b.dataset.opt), at = a.picked.indexOf(k);
          if (at >= 0) a.picked.splice(at, 1);
          else if (it.pick && total() >= it.pick) { const c = el.querySelector("[data-count]"); c.textContent = `You can choose ${it.pick}. Tap one to un-choose it first.`; return; }
          else a.picked.push(k);
          b.classList.toggle("picked", at < 0); b.setAttribute("aria-pressed", at < 0);
          update();
        });
        const other = el.querySelector("[data-other]");
        if (other) other.oninput = () => { a.other = other.value; update(); };
        update();
      }

      if (it.type === "write") {
        const a = answers[i];
        el.querySelectorAll("[data-write]").forEach(t => t.oninput = () => { a[Number(t.dataset.write)] = t.value; keepAnswers(); });
        const first = el.querySelector("[data-write]"); if (first) first.focus();
      }
      if (it.type === "read") next.focus();
    }

    // Everything the student chose or wrote, for the printable worksheet.
    function worksheet(items) {
      return items.map((it, i) => {
        const a = answers[i];
        if (it.type === "write") return { heading: it.title || "", note: it.q ? it.q.split("\n")[0] : "", rows: it.prompts.map((p, k) => ({ label: p, text: (a && a[k]) || "" })) };
        if (it.type === "select") {
          const chosen = a ? a.picked.slice().sort((x, y) => x - y).map(k => it.options[k]).concat(a.other.trim() ? [a.other.trim()] : []) : [];
          return { heading: it.title || "", rows: [{ label: it.q, text: chosen.join("; ") }] };
        }
        return null;
      }).filter(Boolean);
    }

    function finish() {
      const items = itemsFor(module, state.level);
      const result = {};
      if (module.score !== false) {
        result.outOf = items.filter(scored).length;
        result.score = items.map((it, i) => scored(it) && state.firstTry[i] === true).filter(Boolean).length;
      }
      if (module.levels) { result.level = state.level; result.levelTitle = levelTitle(state.level); }
      opts.onFinish(result, state, worksheet(items));
    }

    if (module.levels && state.index == null) chooseLevel();
    else { if (state.index == null) state.index = 0; showItem(); }
  }

  // Shown straight after finishing, and again whenever the student opens a finished module.
  // The name is typed here and never saved.
  function certificate(el, cert, onDone) {
    const sheet = cert.worksheet && cert.worksheet.length ? cert.worksheet : null;
    el.innerHTML = `
      <div class="cert-wrap">
        <div class="cert-controls no-print">
          <h2>${cert.justFinished ? "Well done! You finished" : "Your certificate for"} ${h(cert.title)}${cert.justFinished ? "." : ""}</h2>
          <label class="field">Type your name for your certificate${sheet ? " and answers" : ""}
            <input data-name autocomplete="off" maxlength="40">
          </label>
          <p class="muted">Your name isn't saved anywhere. ${sheet ? "Your answers have been sent to your teacher. " : ""}You can come back to this page any time from your plan.</p>
          <div class="actions">
            <button class="btn primary" data-print>Print or save as PDF</button>
            <button class="btn ghost" data-done>Back to my plan</button>
          </div>
        </div>
        ${RP.certificateMarkup(cert)}
        ${sheet ? RP.worksheetMarkup(cert) : ""}
      </div>`;
    const name = el.querySelector("[data-name]"), out = el.querySelector("[data-cert-name]"), wsName = el.querySelector("[data-ws-name]");
    name.oninput = () => { out.textContent = name.value.trim() || " "; if (wsName) wsName.textContent = name.value.trim(); };
    name.focus();
    el.querySelector("[data-print]").onclick = () => {
      if (!name.value.trim()) { name.focus(); name.classList.add("wrong"); setTimeout(() => name.classList.remove("wrong"), 600); return; }
      window.print();
    };
    el.querySelector("[data-done]").onclick = onDone;
  }

  return { open, certificate };
})();
