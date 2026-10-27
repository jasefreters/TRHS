/*
  Runs an independent elective: choose a level (if the module has levels), work through the
  items one at a time, then show the student's answers. Certificates come at the end of the day.

  Item types:
    { type: "read", title, text }                          a page to read
    { type: "mc", q, choices: [...], answer: 0, explain }    multiple choice (answer is the index)
    { type: "input", q, answer: "42", accept: [...], explain }  type an answer
    { type: "sort", q, buckets: [...], cards: [{ text, bucket }], explain }  tap cards into groups
    { type: "order", q, cards: [...in the right order], explain }  put cards in order
    { type: "scale", q, labels: [...] }                    rate yourself (no right answer, not kept)
    { type: "select", q, options: [...], pick: 3, other: true }  choose what fits you
    { type: "write", title, q, prompts: [...], chain: true }  write your own answers (chain: drawn as
                                                           linked steps, for chain analysis)
    { type: "rating", title, q, statements: [...], low, high }  rate each statement 1–5 (surveys)
    { type: "breathe", title, text, rounds: 3 }            guided box breathing (4 in, 4 hold, 4 out, 4 hold)
    { type: "match", q, pairs: [{ left, right }], explain } drag (or tap) each answer onto its match
    { type: "bodymap", q }                                 tap where on your body you feel it
    { type: "story", title, start, nodes: { id: { text, choices: [{ label, to }], end: "good"|"bad" } } }
                                                           choose-your-path story
    { type: "slider", title, q, sliders: [{ label, min, max, left, right, unit }] }  rate on sliders
    { type: "tiles", title, q, parts: ["text", { options: ["tile" | { text, warn }] }, ...] }
                                                           build a sentence from word tiles
    { type: "video", title, youtube: "id", text }          a short video, with a summary if it won't play
    { type: "ready", title }                               morning ready-to-learn check (surveys only)

  Only modules with "levels" (Literacy) have a reading level. Within them, items can have "easy"
  (replacement fields for levels 1–2) and read items "more" (extra text for levels 4–5).

  What students choose in "select" and write in "write" stays on the laptop while they work. When
  they finish the module it is saved with the module (state.responses) for the teacher to read,
  and shown on the finished page.
*/
window.RP = window.RP || {};

RP.Player = (function () {
  const h = s => RP.h(s);
  const scored = it => ["mc", "input", "sort", "order", "match"].includes(it.type);
  const BODY_AREAS = [
    { id: "head", label: "Head" }, { id: "face", label: "Face and jaw" }, { id: "throat", label: "Throat" },
    { id: "shoulders", label: "Shoulders" }, { id: "chest", label: "Chest and heart" }, { id: "stomach", label: "Stomach" },
    { id: "hands", label: "Hands and fists" }, { id: "legs", label: "Legs and feet" }
  ];
  const inlineMd = RP.inlineMd;

  // "extra" items are left out of the standard (shorter) version of a module; staff can choose the
  // full version on the daily schedule (state.full).
  function itemsFor(module, level, readingLevel, full) {
    let items = module.items;
    if (module.levels) items = (module.levels.find(l => l.level === level) || module.levels[0]).items;
    items = items.filter(it => full || !it.extra).map(it => RP.atLevel(it, readingLevel));
    if (readingLevel === 5 && module.deeper) {
      const deeper = { type: "write", title: "Think deeper", prompts: module.deeper };
      items = items.length && items[items.length - 1].type === "read" ? items.slice(0, -1).concat(deeper, items.slice(-1)) : items.concat(deeper);
    }
    return items;
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

  // A simple front-on figure; each area is tappable.
  function bodySvg(picked) {
    const area = (id, shape) => `<g class="body-area${picked.includes(id) ? " picked" : ""}" data-area="${id}" role="button" aria-label="${(BODY_AREAS.find(b => b.id === id) || {}).label}">${shape}</g>`;
    return `<svg class="body-svg" viewBox="0 0 200 400" aria-hidden="false">
      ${area("legs", '<path d="M72 255 L68 385 L92 385 L98 265 Z"/><path d="M128 255 L132 385 L108 385 L102 265 Z"/>')}
      ${area("stomach", '<path d="M66 175 Q100 170 134 175 L130 255 Q100 265 70 255 Z"/>')}
      ${area("chest", '<path d="M60 105 Q100 95 140 105 L136 175 Q100 170 64 175 Z"/>')}
      ${area("shoulders", '<path d="M40 112 Q50 92 82 88 L118 88 Q150 92 160 112 L140 108 Q100 96 60 108 Z"/>')}
      ${area("hands", '<path d="M40 112 L60 108 L56 210 L38 210 Z"/><path d="M160 112 L140 108 L144 210 L162 210 Z"/><circle cx="46" cy="226" r="14"/><circle cx="154" cy="226" r="14"/>')}
      ${area("throat", '<rect x="88" y="66" width="24" height="22" rx="6"/>')}
      ${area("face", '<path d="M76 38 Q100 30 124 38 Q124 66 100 70 Q76 66 76 38 Z"/>')}
      ${area("head", '<path d="M72 36 Q74 4 100 4 Q126 4 128 36 Q100 26 72 36 Z"/>')}
    </svg>`;
  }

  /*
    opts: { el, module, session, answers: { get(), set(obj) }, save(status, result, state), onExit(), onFinish(result, state, worksheet) }
    state saved on the session: { level, index, firstTry: { [index]: true|false } }
  */
  function open(opts) {
    if (opts.module.booklet) return openBooklet(opts);
    const { el, module, session } = opts;
    let state = Object.assign({}, session.state || {});
    if (state.firstTry == null) state.firstTry = {};
    const answers = (opts.answers && opts.answers.get()) || {};
    // Every module (not surveys) also sends the answers so far with its progress, so staff can
    // follow along as the student types (the teacher's "See answers" page).
    const live = module.live !== false && !module.survey;
    let liveTimer = null;
    const keepAnswers = () => {
      if (opts.answers) opts.answers.set(answers);
      if (live) { clearTimeout(liveTimer); liveTimer = setTimeout(persist, 1500); }
    };
    let tries = 0;

    function persist() {
      if (live) { clearTimeout(liveTimer); state.draft = answers; }
      opts.save("in_progress", null, state);
    }
    // Only modules with levels (Literacy) have a reading level; others use their standard text.
    function readingLevel() { return module.levels ? state.level : null; }

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
      const items = state.index != null ? itemsFor(module, state.level, readingLevel(), state.full) : null;
      const pct = items ? Math.round((state.index / items.length) * 100) : 0;
      return `
        <div class="player-head">
          <div>
            <div class="player-title">${h(module.title)}${state.level && module.levels ? ` <span class="muted">· ${h(levelTitle(state.level))}</span>` : ""}</div>
            ${items ? `<div class="progress" aria-label="Progress"><div style="width:${pct}%"></div></div>` : ""}
          </div>
          ${RP.speech.button()}
          <button class="btn ghost" data-exit>Save and close</button>
        </div>`;
    }
    // The most recent reading before this question, so students can look back at it.
    function lastReading() {
      if (state.index == null) return null;
      const items = itemsFor(module, state.level, readingLevel(), state.full);
      for (let i = Math.min(state.index, items.length) - 1; i >= 0; i--) if (items[i].type === "read") return items[i];
      return null;
    }
    function bindHeader() {
      el.querySelector("[data-exit]").onclick = () => { RP.speech.stop(); keepAnswers(); persist(); opts.onExit(); };
      RP.speech.bind(el, () => el.querySelector(".player-body"));
      const items = state.index != null ? itemsFor(module, state.level, readingLevel(), state.full) : [];
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
      const items = itemsFor(module, state.level, readingLevel(), state.full);
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
          <div class="${it.chain ? "chain" : ""}">
          ${it.prompts.map((p, k) => `<label class="field write${it.chain ? " link" : ""}"><span>${inlineMd(p)}</span><textarea rows="${it.chain ? 2 : 3}" data-write="${k}" maxlength="1500">${h(a[k] || "")}</textarea></label>`).join("")}
          </div>
          <p class="muted small">You can leave any box blank. When you finish the module, your answers are sent to your teacher.</p>
          <div class="actions"><button class="btn primary" data-next>Next</button></div>`;
      }
      if (it.type === "match") {
        order = shuffled(it.pairs.length);
        placed = {};
        body = `${count}<h2 class="q">${RP.md(it.q)}</h2>
          <p class="muted">Drag each answer onto its match, or tap an answer and then tap where it goes.</p>
          <div class="tile-bank" data-bank></div>
          <div class="match-list">${it.pairs.map((p, k) => `
            <div class="match-row"><div class="match-left">${h(p.left)}</div><div class="match-drop" data-drop-at="${k}"></div></div>`).join("")}</div>
          <div class="feedback" aria-live="polite"></div>${checkActions}`;
      } else if (it.type === "bodymap") {
        const a = answers[i] || (answers[i] = []);
        body = `${it.title ? `<h2>${h(it.title)}</h2>` : ""}<h2 class="q">${RP.md(it.q)}</h2>
          <p class="muted">Tap all the places that fit. Tap again to undo.</p>
          <div class="bodymap">${bodySvg(a)}
            <div class="bodymap-list">${BODY_AREAS.map(b => `<button class="choice${a.includes(b.id) ? " picked" : ""}" data-area="${b.id}" aria-pressed="${a.includes(b.id)}">${h(b.label)}</button>`).join("")}</div>
          </div>
          <div class="actions"><button class="btn primary" data-next>Next</button></div>`;
      } else if (it.type === "story") {
        const a = answers[i] || (answers[i] = { path: [], node: it.start, ended: false });
        body = `${it.title ? `<h2>${h(it.title)}</h2>` : ""}<div class="story" data-story></div>
          <div class="actions"><button class="btn ghost" data-restart hidden>Try a different path</button><button class="btn primary" data-next>Next</button></div>`;
      } else if (it.type === "slider") {
        const a = answers[i] || (answers[i] = it.sliders.map(sl => Math.round(((sl.min || 0) + (sl.max || 10)) / 2)));
        body = `${it.title ? `<h2>${h(it.title)}</h2>` : ""}${it.q ? `<p class="q-small">${RP.inlineMd(it.q)}</p>` : ""}
          <div class="sliders">${it.sliders.map((sl, k) => `
            <label class="slider-row">
              <span class="slider-label">${RP.inlineMd(sl.label)}</span>
              <span class="slider-track">
                <span class="slider-end">${h(sl.left || String(sl.min || 0))}</span>
                <input type="range" min="${sl.min || 0}" max="${sl.max || 10}" step="${sl.step || 1}" value="${a[k]}" data-slider="${k}">
                <span class="slider-end">${h(sl.right || String(sl.max || 10))}</span>
              </span>
              <output class="slider-value" data-slider-out="${k}">${a[k]}${sl.unit ? " " + h(sl.unit) : ""}</output>
            </label>`).join("")}</div>
          <div class="actions"><button class="btn primary" data-next>Next</button></div>`;
      } else if (it.type === "tiles") {
        const a = answers[i] || (answers[i] = { picks: {} });
        body = `${it.title ? `<h2>${h(it.title)}</h2>` : ""}${it.q ? `<p class="q-small">${RP.inlineMd(it.q)}</p>` : ""}
          <div class="tile-sentence" data-sentence></div>
          <div class="tile-bank" data-tiles></div>
          <div class="feedback" aria-live="polite"></div>
          <div class="actions"><button class="btn primary" data-next>Next</button></div>`;
      } else if (it.type === "video") {
        body = `${it.title ? `<h2>${h(it.title)}</h2>` : ""}
          <div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(it.youtube)}?rel=0&modestbranding=1" title="${h(it.title || "Video")}" allow="encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>
          ${it.text ? `<details class="video-summary"><summary>Can't watch it? Read what it says</summary><div class="reading">${RP.md(it.text)}</div></details>` : ""}
          <div class="actions"><button class="btn primary" data-next>Next</button></div>`;
      }
      if (it.type === "ready") {
        const a = answers[i] || (answers[i] = { light: null, have: {} });
        body = `<h2>${h(it.title || "Ready to learn?")}</h2>
          <p class="q-small">How ready to learn do you feel right now?</p>
          <div class="traffic" role="group" aria-label="Traffic light">${RP.READY_LIGHTS.map(l => `
            <button class="light light-${l.id}${a.light === l.id ? " picked" : ""}" data-light="${l.id}" aria-pressed="${a.light === l.id}"><span class="lamp" aria-hidden="true"></span>${h(l.label)}</button>`).join("")}</div>
          <ul class="ready-list">${RP.READY_ITEMS.map(x => `
            <li><span>${h(x.q)}</span><span class="yesno" role="group" aria-label="${h(x.q)}">
              <button class="rate${a.have[x.id] === true ? " picked" : ""}" data-have="${x.id}:1" aria-pressed="${a.have[x.id] === true}">Yes</button>
              <button class="rate${a.have[x.id] === false ? " picked" : ""}" data-have="${x.id}:0" aria-pressed="${a.have[x.id] === false}">No</button>
            </span></li>`).join("")}</ul>
          <p class="muted small">If you said no to anything, your teacher will help you sort it out.</p>
          <div class="actions"><button class="btn primary" data-next>Next</button></div>`;
      }
      if (it.type === "rating") {
        const a = answers[i] || (answers[i] = []);
        body = `${it.title ? `<h2>${h(it.title)}</h2>` : ""}<p>${RP.inlineMd(it.q || "")}</p>
          <p class="muted rating-key"><strong>1</strong> = ${h(it.low || "Strongly disagree")} · <strong>5</strong> = ${h(it.high || "Strongly agree")}</p>
          <ol class="rating-list">${it.statements.map((st, k) => `
            <li class="rating-row">
              <span class="rating-text">${h(st)}</span>
              <span class="rating-buttons" role="group" aria-label="${h(st)}">${[1, 2, 3, 4, 5].map(v => `<button class="rate${a[k] === v ? " picked" : ""}" data-rate="${k}:${v}" aria-pressed="${a[k] === v}">${v}</button>`).join("")}</span>
            </li>`).join("")}</ol>
          <p class="muted" data-rating-left></p>
          <div class="actions"><button class="btn primary" data-next>Next</button></div>`;
      } else if (it.type === "breathe") {
        body = `${it.title ? `<h2>${h(it.title)}</h2>` : ""}<div class="reading">${RP.md(it.text || "")}</div>
          <div class="breathe">
            <div class="breathe-box"><div class="breathe-dot" data-dot></div><div class="breathe-label" data-phase>Ready?</div></div>
            <div class="breathe-count" data-count>${it.rounds || 3} rounds of 16 seconds</div>
          </div>
          <div class="actions"><button class="btn" data-breathe>Start</button><button class="btn primary" data-next>Next</button></div>`;
      }
      el.innerHTML = `<div class="player">${header()}<div class="player-body" data-item="${i}">${body}</div></div>`;
      bindHeader();

      const next = el.querySelector("[data-next]");
      const fb = el.querySelector(".feedback");
      const revealNext = () => { next.hidden = false; next.focus(); };
      next.onclick = () => { RP.speech.stop(); keepAnswers(); state.index++; persist(); showItem(); };

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

      if (it.type === "match") {
        const bank = el.querySelector("[data-bank]");
        const check = el.querySelector("[data-check]");
        let chosen = null;
        const tile = k => `<button class="tile${chosen === k ? " chosen" : ""}" draggable="true" data-tile="${k}">${h(it.pairs[k].right)}</button>`;
        const draw = (marks) => {
          bank.innerHTML = order.filter(k => !Object.values(placed).includes(k)).map(tile).join("") || `<span class="muted">All placed.</span>`;
          el.querySelectorAll("[data-drop-at]").forEach(d => {
            const at = Number(d.dataset.dropAt);
            d.innerHTML = at in placed ? tile(placed[at]) : `<span class="muted">Drop here</span>`;
            d.classList.toggle("ready", chosen != null && next.hidden);
            d.classList.remove("right", "wrong");
            if (marks && at in marks) d.classList.add(marks[at] ? "right" : "wrong");
          });
          check.disabled = Object.keys(placed).length < it.pairs.length;
          el.querySelectorAll("[data-tile]").forEach(t => {
            t.onclick = e => { e.stopPropagation(); if (!next.hidden) return; const k = Number(t.dataset.tile); chosen = chosen === k ? null : k; draw(); };
            t.ondragstart = e => { e.dataTransfer.setData("text/plain", t.dataset.tile); };
          });
        };
        const put = (at, k) => {
          Object.keys(placed).forEach(x => { if (placed[x] === k) delete placed[x]; });
          placed[at] = k; chosen = null; draw();
        };
        el.querySelectorAll("[data-drop-at]").forEach(d => {
          const at = Number(d.dataset.dropAt);
          d.onclick = () => { if (chosen != null && next.hidden) put(at, chosen); };
          d.ondragover = e => { if (next.hidden) e.preventDefault(); };
          d.ondrop = e => { e.preventDefault(); const k = Number(e.dataTransfer.getData("text/plain")); if (!isNaN(k)) put(at, k); };
        });
        bank.ondragover = e => e.preventDefault();
        bank.ondrop = e => { e.preventDefault(); const k = Number(e.dataTransfer.getData("text/plain")); Object.keys(placed).forEach(x => { if (placed[x] === k) delete placed[x]; }); draw(); };
        check.onclick = () => {
          const marks = {};
          it.pairs.forEach((p, k) => { marks[k] = placed[k] === k; });
          if (Object.values(marks).every(Boolean)) { right(); draw(marks); return; }
          draw(marks); wrong(tries === 0 ? "Some aren't matched yet. They'll go back so you can try again." : null);
          setTimeout(() => { Object.keys(marks).forEach(k => { if (!marks[k]) delete placed[k]; }); if (next.hidden) draw(); }, 1200);
        };
        el.querySelector("[data-show]").onclick = e => {
          state.firstTry[i] = false;
          it.pairs.forEach((p, k) => { placed[k] = k; });
          check.hidden = true; e.target.hidden = true; revealNext();
          const marks = {}; it.pairs.forEach((p, k) => { marks[k] = true; }); draw(marks);
          fb.className = "feedback"; fb.innerHTML = "Here's how they match." + explain();
        };
        draw();
      }

      if (it.type === "bodymap") {
        const a = answers[i];
        const toggle = id => {
          const at = a.indexOf(id);
          if (at >= 0) a.splice(at, 1); else a.push(id);
          el.querySelectorAll(`[data-area="${id}"]`).forEach(x => { x.classList.toggle("picked", at < 0); if (x.tagName === "BUTTON") x.setAttribute("aria-pressed", at < 0); });
          keepAnswers();
        };
        el.querySelectorAll("[data-area]").forEach(x => x.addEventListener("click", () => toggle(x.dataset.area)));
      }

      if (it.type === "story") {
        const a = answers[i];
        const box = el.querySelector("[data-story]"), restart = el.querySelector("[data-restart]");
        const draw = () => {
          const node = it.nodes[a.node];
          box.innerHTML = `
            ${a.path.map(p => `<div class="story-past"><div class="reading">${RP.md(it.nodes[p.from].text)}</div><div class="story-chose">You chose: <strong>${h(p.label)}</strong></div></div>`).join("")}
            <div class="story-now${node.end ? " end-" + node.end : ""}">
              <div class="reading">${RP.md(node.text)}</div>
              ${node.end ? `<p class="story-outcome">${node.end === "good" ? "✓ That worked out well." : "That didn't go so well. Want to try a different choice?"}</p>`
                : `<div class="choices">${node.choices.map((c, k) => `<button class="choice" data-path="${k}">${h(c.label)}</button>`).join("")}</div>`}
            </div>`;
          if (node.end) a.ended = true;
          next.disabled = !a.ended;
          restart.hidden = !node.end;
          box.querySelectorAll("[data-path]").forEach(b => b.onclick = () => {
            const c = node.choices[Number(b.dataset.path)];
            a.path.push({ from: a.node, label: c.label });
            a.node = c.to; keepAnswers(); draw();
          });
        };
        restart.onclick = () => { a.path = []; a.node = it.start; keepAnswers(); draw(); };
        draw();
      }

      if (it.type === "slider") {
        const a = answers[i];
        el.querySelectorAll("[data-slider]").forEach(r => r.oninput = () => {
          const k = Number(r.dataset.slider), sl = it.sliders[k];
          a[k] = Number(r.value);
          el.querySelector(`[data-slider-out="${k}"]`).textContent = a[k] + (sl.unit ? " " + sl.unit : "");
          keepAnswers();
        });
      }

      if (it.type === "tiles") {
        const a = answers[i];
        const blanks = it.parts.map((p, k) => typeof p === "string" ? null : k).filter(k => k != null);
        let active = blanks.find(k => a.picks[k] == null);
        if (active == null) active = blanks[0];
        const optText = o => typeof o === "string" ? o : o.text;
        const draw = () => {
          el.querySelector("[data-sentence]").innerHTML = it.parts.map((p, k) => typeof p === "string" ? h(p)
            : `<button class="blank${k === active ? " active" : ""}${a.picks[k] != null ? " filled" : ""}" data-blank="${k}">${a.picks[k] != null ? h(optText(p.options[a.picks[k]])) : "______"}</button>`).join("");
          const part = it.parts[active];
          el.querySelector("[data-tiles]").innerHTML = part.options.map((o, j) => `<button class="tile${a.picks[active] === j ? " chosen" : ""}" data-pick="${j}">${h(optText(o))}</button>`).join("");
          next.disabled = blanks.some(k => a.picks[k] == null);
          el.querySelectorAll("[data-blank]").forEach(b => b.onclick = () => { active = Number(b.dataset.blank); draw(); });
          el.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => {
            const o = part.options[Number(b.dataset.pick)];
            a.picks[active] = Number(b.dataset.pick);
            a.sentence = it.parts.map((p, k) => typeof p === "string" ? p : (a.picks[k] != null ? optText(p.options[a.picks[k]]) : "___")).join("");
            keepAnswers();
            fb.className = "feedback" + (o.warn ? " bad" : "");
            fb.textContent = o.warn || "";
            if (!o.warn) { const nextBlank = blanks.find(k => a.picks[k] == null); if (nextBlank != null) active = nextBlank; }
            draw();
          });
        };
        draw();
      }

      if (it.type === "rating") {
        const a = answers[i];
        const update = () => {
          const left = it.statements.length - it.statements.filter((st, k) => a[k]).length;
          el.querySelector("[data-rating-left]").textContent = left ? `${left} still to answer.` : "All answered.";
          next.disabled = left > 0;
          keepAnswers();
        };
        el.querySelectorAll("[data-rate]").forEach(b => b.onclick = () => {
          const [k, v] = b.dataset.rate.split(":").map(Number);
          a[k] = v;
          b.parentElement.querySelectorAll(".rate").forEach(x => { x.classList.toggle("picked", x === b); x.setAttribute("aria-pressed", x === b); });
          update();
        });
        update();
      }

      if (it.type === "breathe") {
        const phases = ["Breathe in", "Hold", "Breathe out", "Hold"], seconds = 4, rounds = it.rounds || 3;
        const dot = el.querySelector("[data-dot]"), label = el.querySelector("[data-phase]"), count = el.querySelector("[data-count]");
        const start = el.querySelector("[data-breathe]");
        let timer = null;
        start.onclick = () => {
          clearInterval(timer);
          let t = 0;
          const total = rounds * phases.length * seconds;
          const step = () => {
            if (!document.body.contains(dot)) { clearInterval(timer); return; }
            if (t >= total) { clearInterval(timer); label.textContent = "Well done"; count.textContent = "How do you feel now?"; dot.className = "breathe-dot"; start.textContent = "Again"; return; }
            const phase = Math.floor(t / seconds) % 4;
            label.textContent = phases[phase];
            count.textContent = `${seconds - (t % seconds)} · round ${Math.floor(t / (seconds * 4)) + 1} of ${rounds}`;
            dot.className = "breathe-dot p" + phase;
            t++;
          };
          step();
          timer = setInterval(step, 1000);
          start.textContent = "Restart";
        };
      }

      if (it.type === "ready") {
        const a = answers[i];
        el.querySelectorAll("[data-light]").forEach(b => b.onclick = () => {
          a.light = b.dataset.light; keepAnswers();
          el.querySelectorAll("[data-light]").forEach(x => { const on = x === b; x.classList.toggle("picked", on); x.setAttribute("aria-pressed", on); });
        });
        el.querySelectorAll("[data-have]").forEach(b => b.onclick = () => {
          const [id, v] = b.dataset.have.split(":");
          a.have[id] = v === "1"; keepAnswers();
          b.parentNode.querySelectorAll("[data-have]").forEach(x => { const on = x === b; x.classList.toggle("picked", on); x.setAttribute("aria-pressed", on); });
        });
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
        if (it.type === "rating") {
          return { heading: it.title || "", rows: it.statements.map((st, k) => ({ label: st, text: a && a[k] ? `${a[k]} / 5` : "" })) };
        }
        if (it.type === "bodymap") {
          return { heading: it.title || "", rows: [{ label: it.q, text: (a || []).map(id => (BODY_AREAS.find(b => b.id === id) || {}).label).filter(Boolean).join("; ") }] };
        }
        if (it.type === "story") {
          return { heading: it.title || "", rows: [{ label: "The choices I made", text: a && a.path.length ? a.path.map(p => p.label).join(" → ") : "" }] };
        }
        if (it.type === "slider") {
          return { heading: it.title || "", rows: it.sliders.map((sl, k) => ({ label: sl.label, text: a ? `${a[k]}${sl.unit ? " " + sl.unit : ""} (${sl.left || sl.min || 0} → ${sl.right || sl.max || 10})` : "" })) };
        }
        if (it.type === "tiles") {
          return { heading: it.title || "", rows: [{ label: it.q || "My sentence", text: (a && a.sentence) || "" }] };
        }
        if (it.type === "ready") {
          const r = RP.readyResult(a);
          return { heading: it.title || "Ready to learn", rows: [{ label: "How ready I feel", text: r.light ? RP.READY_LIGHTS.find(l => l.id === r.light).label : "" }].concat(RP.READY_ITEMS.map(x => ({ label: x.q, text: r.have.includes(x.id) ? "Yes" : r.missing.includes(x.id) ? "No" : "" }))) };
        }
        if (it.type === "select") {
          const chosen = a ? a.picked.slice().sort((x, y) => x - y).map(k => it.options[k]).concat(a.other.trim() ? [a.other.trim()] : []) : [];
          return { heading: it.title || "", rows: [{ label: it.q, text: chosen.join("; ") }] };
        }
        return null;
      }).filter(Boolean);
    }

    function finish() {
      const items = itemsFor(module, state.level, readingLevel(), state.full);
      const result = {};
      if (module.score !== false) {
        result.outOf = items.filter(scored).length;
        result.score = items.map((it, i) => scored(it) && state.firstTry[i] === true).filter(Boolean).length;
      }
      if (module.levels) { result.level = state.level; result.levelTitle = levelTitle(state.level); }
      if (readingLevel()) result.readingLevel = readingLevel();
      if (module.survey) {
        const ri = items.findIndex(it => it.type === "rating");
        const ratings = ri >= 0 ? items[ri].statements.map((st, k) => (answers[ri] || [])[k] || null) : [];
        Object.assign(result, { survey: module.survey, ratings, total: ratings.reduce((n, v) => n + (v || 0), 0), max: ratings.length * 5 });
      }
      const ready = items.findIndex(it => it.type === "ready");
      if (ready >= 0) result.ready = RP.readyResult(answers[ready]);
      // Literacy and Numeracy: finished a level? Offer the next one (in the same session).
      const next = module.levels && !opts.preview && module.levels.find(l => l.level === state.level + 1);
      if (module.levels) {
        result.levels = (state.levelsDone || []).concat([{ level: state.level, levelTitle: levelTitle(state.level), score: result.score, outOf: result.outOf }]);
      }
      if (next && !state.stopped) return offerNext(result, items, next);
      clearTimeout(liveTimer);
      delete state.draft;
      opts.onFinish(result, state, worksheet(items));
    }

    function offerNext(result, items, next) {
      el.innerHTML = `<div class="player">${header()}<div class="player-body" data-item="next">
        <h2>You finished ${h(levelTitle(state.level))}!</h2>
        ${result.outOf ? `<p class="next-score"><strong>${result.score} out of ${result.outOf}</strong> correct first time.</p>` : ""}
        <p>Want a challenge? Try ${h(next.title)}.</p>
        <div class="actions"><button class="btn primary big" data-next-level>Try ${h(next.title)}</button><button class="btn" data-stop>I'm finished</button></div>
      </div></div>`;
      bindHeader();
      el.querySelector("[data-next-level]").onclick = () => {
        state.levelsDone = result.levels;
        state.level = next.level; state.index = 0; state.firstTry = {};
        persist(); showItem();
      };
      el.querySelector("[data-stop]").onclick = () => {
        state.stopped = true;
        clearTimeout(liveTimer);
        delete state.draft;
        opts.onFinish(result, state, worksheet(items));
      };
    }

    if (module.levels && state.index == null) chooseLevel();
    else { if (state.index == null) state.index = 0; showItem(); }
  }

  /*
    The Suspension Booklet: a list of subjects. Opening one marks it started; the student types
    answers (page or question, and the answer) and can mark it finished. Typed answers stay on the
    laptop until they finish for the day, like other modules; which subjects were started and
    finished is saved as they go (state.subjects), so it shows on the day certificate either way.
  */
  const USING = [
    { id: "online", label: "The booklet on this laptop" },
    { id: "paper", label: "A paper copy" },
    { id: "own", label: "The booklet from my suspension" }
  ];
  function openBooklet(opts) {
    const { el, module, session } = opts;
    const state = Object.assign({ subjects: {} }, session.state || {});
    const answers = (opts.answers && opts.answers.get()) || {};
    let liveTimer = null;
    const persist = () => { clearTimeout(liveTimer); state.draft = answers; opts.save("in_progress", null, state); };
    const keep = () => { if (opts.answers) opts.answers.set(answers); clearTimeout(liveTimer); liveTimer = setTimeout(persist, 1500); };
    const statusTag = id => state.subjects[id] === "completed" ? `<span class="tag done-tag">Finished</span>` : state.subjects[id] === "started" ? `<span class="tag">Started</span>` : "";
    const head = () => `
      <div class="player-head">
        <div><div class="player-title">${h(module.title)}${state.current ? ` <span class="muted">· ${h(subject(state.current).title)}</span>` : ""}</div></div>
        ${RP.speech.button()}
        <button class="btn ghost" data-exit>Save and close</button>
      </div>`;
    const book = () => module.books.find(b => b.id === state.book) || module.books[0];
    const subject = id => book().subjects.find(x => x.id === id);
    const bind = () => {
      el.querySelector("[data-exit]").onclick = () => { RP.speech.stop(); keep(); persist(); opts.onExit(); };
      RP.speech.bind(el, () => el.querySelector(".player-body"));
    };

    function menu() {
      state.current = null;
      const started = Object.keys(state.subjects).length;
      el.innerHTML = `<div class="player">${head()}<div class="player-body" data-booklet="menu">
        ${module.books.length > 1 ? `<h2>Which year's booklet?</h2>
        <div class="choices">${module.books.map(b => `<button class="choice${book().id === b.id ? " picked" : ""}" data-book="${b.id}">${h(b.title)}</button>`).join("")}</div>` : ""}
        <h2>Which booklet are you using?</h2>
        <div class="choices booklet-using">${USING.map(u => `<button class="choice${state.using === u.id ? " picked" : ""}" data-using="${u.id}" aria-pressed="${state.using === u.id}">${h(u.label)}</button>`).join("")}</div>
        <h2>Choose a subject</h2>
        <div class="subject-grid">${book().subjects.map(x => `<button class="subject-card" data-subject="${x.id}"><span class="subject-name">${h(x.title)}</span>${statusTag(x.id)}</button>`).join("")}</div>
        <div class="actions"><button class="btn primary" data-finish ${started ? "" : "disabled"}>I'm finished for today</button></div>
        <p class="muted small">${started ? "When you finish for today, your answers are sent to your teacher." : "Choose a subject to start."}</p>
      </div></div>`;
      bind();
      el.querySelectorAll("[data-book]").forEach(b => b.onclick = () => { state.book = b.dataset.book; persist(); menu(); });
      el.querySelectorAll("[data-using]").forEach(b => b.onclick = () => { state.using = b.dataset.using; persist(); menu(); });
      el.querySelectorAll("[data-subject]").forEach(b => b.onclick = () => openSubject(b.dataset.subject));
      el.querySelector("[data-finish]").onclick = finishBooklet;
    }

    function openSubject(id) {
      const sub = subject(id);
      state.current = id;
      if (!state.subjects[id]) state.subjects[id] = "started";
      persist();
      const rows = answers[id] || (answers[id] = [{ where: "", text: "" }]);
      const draw = () => {
        el.innerHTML = `<div class="player">${head()}<div class="player-body" data-booklet="${id}">
          <h2>${h(sub.title)}</h2>
          ${sub.pdf && state.using !== "paper" && state.using !== "own" ? `<div class="booklet-pdf"><iframe src="${h(sub.pdf)}" title="${h(sub.title)} booklet"></iframe><p><a href="${h(sub.pdf)}" target="_blank" rel="noopener">Open the booklet in a new tab</a></p></div>`
            : `<p class="muted">${sub.pdf ? "" : "There isn't an online copy of this booklet yet. "}Use your paper booklet, and type your answers here.</p>`}
          <p>Type the page or question number, then your answer. Add as many answers as you need.</p>
          <div class="booklet-rows">${rows.map((r, k) => `
            <div class="booklet-row">
              <label class="field">Page or question <input data-where="${k}" maxlength="40" value="${h(r.where)}" autocomplete="off"></label>
              <label class="field">My answer <textarea rows="3" data-text="${k}" maxlength="3000">${h(r.text)}</textarea></label>
            </div>`).join("")}</div>
          <div class="actions">
            <button class="btn" data-add>+ Add another answer</button>
            ${module.single ? `<button class="btn primary" data-finish>I'm finished</button>` : `<button class="btn" data-back>Back to subjects</button>
            <button class="btn primary" data-done-subject>${state.subjects[id] === "completed" ? "✓ Finished (undo)" : "I've finished this subject"}</button>`}
          </div>
        </div></div>`;
        bind();
        el.querySelectorAll("[data-where]").forEach(t => t.oninput = () => { rows[Number(t.dataset.where)].where = t.value; keep(); });
        el.querySelectorAll("[data-text]").forEach(t => t.oninput = () => { rows[Number(t.dataset.text)].text = t.value; keep(); });
        el.querySelector("[data-add]").onclick = () => { rows.push({ where: "", text: "" }); keep(); draw(); const last = el.querySelectorAll("[data-where]"); last[last.length - 1].focus(); };
        if (module.single) { el.querySelector("[data-finish]").onclick = () => { state.subjects[id] = "completed"; finishBooklet(); }; return; }
        el.querySelector("[data-back]").onclick = () => { keep(); menu(); };
        el.querySelector("[data-done-subject]").onclick = () => {
          state.subjects[id] = state.subjects[id] === "completed" ? "started" : "completed";
          keep(); persist();
          if (state.subjects[id] === "completed") menu(); else draw();
        };
      };
      draw();
    }

    function finishBooklet() {
      if (opts.answers) opts.answers.set(answers);
      clearTimeout(liveTimer);
      delete state.draft;
      const using = USING.find(u => u.id === state.using);
      const worksheet = book().subjects.filter(x => state.subjects[x.id]).map(x => ({
        heading: `${x.title} (${state.subjects[x.id] === "completed" ? "finished" : "started"})`,
        rows: (answers[x.id] || []).filter(r => r.where.trim() || r.text.trim()).map(r => ({ label: r.where.trim() || "Answer", text: r.text.trim() }))
      }));
      if (!module.single) worksheet.unshift({ heading: "Booklet", rows: [{ label: "Booklet", text: book().title }].concat(using ? [{ label: "I used", text: using.label }] : []) });
      opts.onFinish(module.single ? {} : { subjects: Object.assign({}, state.subjects) }, state, worksheet);
    }

    // A single worksheet (a RIOT lesson PDF) skips the subject list.
    if (module.single) { state.using = state.using || "online"; openSubject(book().subjects[0].id); }
    else if (state.current && subject(state.current)) openSubject(state.current); else menu();
  }

  // Shown straight after finishing a module, and again whenever the student opens a finished one:
  // their answers (if any) to save or email. Certificates are given at the end of each day.
  function finished(el, info, onDone) {
    const sheet = info.worksheet && info.worksheet.length ? info.worksheet : null;
    el.innerHTML = `
      <div class="cert-wrap">
        <div class="cert-controls no-print">
          <h2>${info.justFinished ? "Well done! You finished" : "You finished"} ${h(info.title)}${info.justFinished ? "." : ""}</h2>
          ${info.outOf ? `<p><strong>${info.score} out of ${info.outOf}</strong> correct first time.</p>` : ""}
          <p class="muted">${sheet ? "Your answers have been sent to your teacher. " : ""}It will be on your certificate at the end of the day.</p>
          ${sheet ? `<label class="field">Type your name to keep a copy of your answers <input data-name autocomplete="off" maxlength="40"></label>
            <p class="muted small">Your name isn't saved anywhere.</p>` : ""}
          <div class="actions">
            ${sheet ? `<button class="btn" data-print>Save as PDF</button><a class="btn" data-email href="${RP.mailtoFor(info)}">Email</a>` : ""}
            <button class="btn primary" data-done>Back to my plan</button>
          </div>
        </div>
        ${sheet ? RP.worksheetMarkup(info) : ""}
      </div>`;
    bindName(el, !!sheet);
    el.querySelector("[data-done]").onclick = onDone;
  }

  // The end-of-day certificate, listing every module finished that day.
  function dayCertificate(el, cert, onDone) {
    el.innerHTML = `
      <div class="cert-wrap">
        <div class="cert-controls no-print">
          <h2>${cert.complete ? "Your Reset Program certificate" : `Your certificate for Day ${h(cert.day)}`}</h2>
          <label class="field">Type your name for your certificate <input data-name autocomplete="off" maxlength="40"></label>
          <p class="muted">Your name isn't saved anywhere. To keep a copy, choose <strong>Save as PDF</strong> (then "Save as PDF" or "Save to Google Drive"), or <strong>Email</strong> it.</p>
          <div class="actions">
            <button class="btn primary" data-print>Save as PDF</button>
            <a class="btn" data-email href="${RP.dayMailto(cert)}">Email</a>
            <button class="btn ghost" data-done>Back to my plan</button>
          </div>
        </div>
        ${RP.dayCertificateMarkup(cert)}
      </div>`;
    bindName(el, true);
    el.querySelector("[data-done]").onclick = onDone;
  }

  function bindName(el, needed) {
    const name = el.querySelector("[data-name]");
    if (!name) return;
    const out = el.querySelector("[data-cert-name]"), wsName = el.querySelector("[data-ws-name]");
    name.oninput = () => { if (out) out.textContent = name.value.trim() || " "; if (wsName) wsName.textContent = name.value.trim(); };
    name.focus();
    const print = el.querySelector("[data-print]");
    if (print) print.onclick = () => {
      if (needed && !name.value.trim()) { name.focus(); name.classList.add("wrong"); setTimeout(() => name.classList.remove("wrong"), 600); return; }
      window.print();
    };
  }

  return { open, finished, dayCertificate };
})();
