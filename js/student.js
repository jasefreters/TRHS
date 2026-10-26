/* The student's laptop: their plan for the day down the left, the current session on the right. */
(function () {
  const api = RP.connect(false);
  const h = RP.h;
  const $ = s => document.querySelector(s);
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private window */ } }
  };

  let code = store.get("rp-code");
  let plan = null;          // { current_day, help, sessions }
  let selected = null;      // slot number shown on the right
  let mode = "plan";        // "plan" | "module" | "cert"
  let clockSlot = null;
  let offline = false;

  // ---------------------------------------------------------------- saving (survives reloads and dropouts)
  const OUTBOX = "rp-outbox";
  function queueSave(sessionId, status, result, state) {
    const box = store.get(OUTBOX) || {};
    const prev = box[sessionId] || {};
    box[sessionId] = {
      status: prev.status === "done" ? "done" : status,
      result: result || prev.result || null,
      state: state || prev.state || null
    };
    store.set(OUTBOX, box);
    const s = plan && plan.sessions.find(s => s.id === sessionId);
    if (s) Object.assign(s, { status: box[sessionId].status, result: box[sessionId].result || s.result, state: box[sessionId].state || s.state });
    flush();
  }
  let flushing = false, flushAgain = false;
  async function flush() {
    if (!code) return;
    if (flushing) { flushAgain = true; return; }
    flushing = true; flushAgain = false;
    try {
      const box = store.get(OUTBOX) || {};
      for (const id of Object.keys(box)) {
        const e = box[id];
        await api.studentSave(code, id, e.status, e.result, e.state);
        const now = store.get(OUTBOX) || {};
        if (JSON.stringify(now[id]) === JSON.stringify(e)) { delete now[id]; store.set(OUTBOX, now); }
      }
      setOffline(false);
    } catch (err) {
      setOffline(true);
      flushAgain = false; // offline: the timer and the "online" event will try again
    } finally {
      flushing = false;
      if (flushAgain) flush();
    }
  }
  function overlayOutbox(p) {
    const box = store.get(OUTBOX) || {};
    p.sessions.forEach(s => {
      const e = box[s.id];
      if (e && s.status !== "done") Object.assign(s, { status: e.status, result: e.result || s.result, state: e.state || s.state });
    });
    return p;
  }
  function setOffline(v) {
    offline = v;
    const el = $("#offline");
    if (el) el.hidden = !v;
  }

  // ---------------------------------------------------------------- loading
  async function refresh() {
    if (!code) return;
    try {
      const p = await api.studentLoad(code);
      setOffline(false);
      if (!p) { endCode("That code isn't active. Ask your teacher for your code."); return; }
      plan = overlayOutbox(p);
      store.set("rp-plan-cache", plan);
    } catch (err) {
      setOffline(true);
      if (!plan) plan = store.get("rp-plan-cache");
    }
    if (!plan) { renderEntry("Can't reach the internet. Check the connection and try again."); return; }
    if (plan.paused || plan.kind === "followup" || !$("#day-pane")) { if (mode === "plan") start(); return; }
    renderSidebar();
    if (mode === "plan") renderMain();
    updateHelp();
  }

  function endCode(message) {
    code = null; plan = null; mode = "plan";
    store.set("rp-code", null); store.set("rp-plan-cache", null); store.set(OUTBOX, null); store.set("rp-cert", null);
    clearAnswers();
    renderEntry(message);
  }

  function clearAnswers() {
    try { Object.keys(localStorage).filter(k => k.startsWith("rp-answers:")).forEach(k => localStorage.removeItem(k)); } catch (e) { /* private window */ }
  }

  const today = () => plan.sessions.filter(s => s.day === plan.current_day);
  // Today's times: changed on the daily schedule (e.g. Tuesday bell times), or the normal ones.
  const tt = () => RP.timetableFor(plan && plan.times, plan && plan.current_day);
  const bySlot = slot => today().find(s => s.slot === slot);

  // ---------------------------------------------------------------- code entry
  function renderEntry(message) {
    document.body.classList.remove("has-plan");
    $("#app").innerHTML = `
      <div class="entry">
        <div class="entry-card">
          <span class="entry-logo">${RP.logo(120)}</span>
          <h1>Welcome to the Reset Program</h1>
          <p>Type the code your teacher gave you.</p>
          <form data-entry>
            <input class="code-input" maxlength="9" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="XXXX-XXXX" aria-label="Your code">
            <button class="btn primary big" type="submit">Start</button>
          </form>
          <p class="error" aria-live="polite">${h(message || "")}</p>
        </div>
      </div>`;
    const input = $(".code-input");
    input.focus();
    input.oninput = () => { input.value = RP.formatCode(input.value); };
    $("[data-entry]").onsubmit = async e => {
      e.preventDefault();
      const c = RP.normaliseCode(input.value);
      const err = $(".entry .error");
      if (c.length !== 8) { err.textContent = "Your code has 8 letters and numbers."; return; }
      err.textContent = "Checking…";
      try {
        const p = await api.studentLoad(c);
        if (!p) { err.textContent = "That code isn't right. Check it with your teacher."; return; }
        code = c; store.set("rp-code", c);
        plan = p; store.set("rp-plan-cache", p);
        start();
      } catch (ex) { err.textContent = "Can't reach the internet. Check the connection and try again."; }
    };
  }

  // ---------------------------------------------------------------- layout
  function start() {
    if (plan.paused) { renderPaused(); return; }
    if (plan.kind === "followup") { renderFollowup(); return; }
    document.body.classList.add("has-plan");
    $("#app").innerHTML = `
      <aside class="day-pane" id="day-pane"></aside>
      <main class="main-pane" id="main"></main>`;
    const now = RP.currentSlot(tt());
    clockSlot = now;
    selected = slotForClock(now);
    renderSidebar();
    if (mode === "plan") renderMain();
    updateHelp();
    flush();
  }

  function renderPaused() {
    document.body.classList.remove("has-plan");
    $("#app").innerHTML = `
      <div class="entry"><div class="entry-card">
        <span class="entry-logo">${RP.logo(110)}</span>
        <h1>Your program is paused</h1>
        <p>Your teacher has paused your Reset Program for now. Please see a staff member in the Hub.</p>
      </div></div>`;
  }

  // A follow-up program is just the follow-up survey, a few weeks after going back to class.
  function renderFollowup() {
    document.body.classList.remove("has-plan");
    const s = plan.sessions.find(x => x.kind === "survey");
    if (!s) { renderPaused(); return; }
    $("#app").innerHTML = `
      <div class="page narrow"><div class="session" id="main">
        <div class="session-head k-debrief"><span class="kind-chip">Reset Program</span><h1>Follow-up survey</h1></div>
        <div class="card">${s.status === "done"
          ? `<p class="done-note">✓ Done. Thank you! You can close this page now.</p>`
          : `<p>It's been a few weeks since you finished the Reset Program. This short survey helps us see how things are going back in class. It takes about 5 minutes.</p>
             <div class="actions"><button class="btn primary big" data-survey>${s.status === "in_progress" ? "Keep going" : "Start the survey"}</button></div>`}</div>
      </div></div>`;
    const b = $("[data-survey]");
    if (b) b.onclick = () => openSurvey(s, () => renderFollowup());
  }

  function slotForClock(now) {
    if (typeof now === "number") return now;
    const slots = tt().filter(t => t.slot), last = slots[slots.length - 1].slot;
    if (now === "before") return slots[0].slot;
    if (now === "after") return last;
    const after = slots.find(t => RP.toMinutes(t.start) >= RP.toMinutes(now.end));
    return after ? after.slot : last;
  }

  function statusIcon(s) {
    if (!s) return "";
    if (s.status === "done") return `<span class="tick done" title="Done">✓</span>`;
    if (s.status === "in_progress") return `<span class="tick part" title="Started"></span>`;
    return `<span class="tick" title="Not done yet"></span>`;
  }

  function renderSidebar() {
    const pane = $("#day-pane");
    if (!pane || !plan) return;
    const now = RP.currentSlot(tt());
    const rows = tt().map(t => {
      if (t.brk) {
        const isNow = now === t;
        return `<li class="brk${isNow ? " now" : ""}"><span class="time">${RP.formatTime(t.start)}</span><span>${h(t.brk)}</span>${isNow ? `<span class="now-tag">Now</span>` : ""}</li>`;
      }
      const s = bySlot(t.slot);
      if (!s) return "";
      const title = RP.sessionTitle(s);
      return `
        <li>
          <button class="slot k-${s.kind}${selected === t.slot ? " selected" : ""}${now === t.slot ? " now" : ""}${s.status === "done" ? " is-done" : ""}" data-slot="${t.slot}">
            <span class="time">${RP.formatTime(t.start)}</span>
            <span class="slot-text"><span class="slot-title">${h(title)}</span><span class="slot-kind">${h(RP.kindLabel(s))}</span></span>
            ${now === t.slot ? `<span class="now-tag">Now</span>` : ""}
            ${statusIcon(s)}
          </button>
        </li>`;
    }).join("");
    const one = bySlot(RP.ONE_TO_ONE_SLOT);
    pane.innerHTML = `
      <div class="day-head">
        <div class="day-num">Day ${plan.current_day}</div>
        <div class="muted">${h(RP.todayLabel())}</div>
      </div>
      <ol class="day-list">${rows}</ol>
      <div class="cert-buttons">${[1, 2].filter(d => d <= plan.current_day).map(d => `<button class="btn small" data-day-cert="${d}">🏅 My Day ${d} certificate</button>`).join("")}</div>
      ${one ? `
        <button class="slot k-one_to_one oneone${selected === RP.ONE_TO_ONE_SLOT ? " selected" : ""}" data-slot="${RP.ONE_TO_ONE_SLOT}">
          <span class="time">Any time</span>
          <span class="slot-text"><span class="slot-title">${h(one.title)}</span><span class="slot-kind">Your teacher will come and get you</span></span>
          ${statusIcon(one)}
        </button>` : ""}
      <p class="offline" id="offline" ${offline ? "" : "hidden"}>Not connected. Your work is saved on this laptop and will send when the internet is back.</p>`;
    pane.querySelectorAll("[data-day-cert]").forEach(b => b.onclick = () => {
      if (mode === "module") return;
      mode = "cert"; renderSidebar(); showDayCertificate(Number(b.dataset.dayCert));
    });
    pane.querySelectorAll("[data-slot]").forEach(b => b.onclick = () => {
      if (mode === "module" || mode === "cert") return;
      selected = Number(b.dataset.slot);
      renderSidebar(); renderMain();
    });
  }

  // ---------------------------------------------------------------- the right-hand side
  function renderMain() {
    const main = $("#main");
    if (!main || !plan) return;
    const s = bySlot(selected);
    if (!s) { main.innerHTML = ""; return; }
    const times = RP.slotTimes(s.slot, tt());
    const when = times ? `${RP.formatTime(times.start)} – ${RP.formatTime(times.end)}` : "";
    const head = (title, kind) => `
      <div class="session-head k-${s.kind}">
        <span class="kind-chip">${h(kind || RP.kindLabel(s))}</span>
        <h1>${h(title)}</h1>
        ${when ? `<div class="when">${when}</div>` : ""}
      </div>`;
    const doneNote = s.status === "done" ? `<p class="done-note">✓ Done</p>` : "";
    const nowSlot = RP.currentSlot(tt());
    let html = typeof nowSlot === "object" && nowSlot.brk
      ? `<div class="card break-card">${RP.md(RP.CONTENT.breakTime(nowSlot.brk, RP.formatTime(nowSlot.end)))}</div>` : "";

    const surveyCard = (survey, intro) => survey ? `<div class="card survey-card">
          <h2>${h(survey.title)}</h2>
          ${s.status === "done"
            ? `<p class="done-note">✓ Done. Thank you for filling it in.</p>`
            : `${/^<p>/.test(intro) ? intro : `<p>${intro}</p>`}<p class="muted">About 5 minutes.</p>
               <div class="actions"><button class="btn primary big" data-survey>${s.status === "in_progress" ? "Keep going" : s.kind === "intro" ? "Start the check-in" : "Start the survey"}</button></div>`}
        </div>` : "";

    if (s.kind === "intro") {
      html += head("Morning session", "Whole group") + `
        <div class="card story">${RP.md(RP.CONTENT.story[plan.current_day])}</div>
        ${surveyCard(RP.SURVEYS[RP.surveyIdFor(s)], RP.md(RP.CONTENT.morning))}`;
    } else if (s.kind === "group" && RP.isRiot(s)) {
      // RIOT: the teacher chooses the lesson and how the worksheet is done.
      const L = RP.riotLesson((s.state || {}).lesson), fmt = RP.RIOT_FORMATS.find(f => f.id === (s.state || {}).format);
      const onLaptop = L && fmt && fmt.id !== "paper";
      html += head(L ? `RIOT ${L.fullTitle}` : "RIOT", "Group module") +
        (onLaptop ? "" : `<div class="card laptop-away big-note"><div class="laptop-icon" aria-hidden="true">💻 ➜ 👥</div>${RP.md(RP.CONTENT.group)}</div>`) +
        `<div class="card">${RP.md(RP.groupSession("riot").about)}${L && fmt ? `<p><strong>${h(fmt.student)}</strong></p>` : ""}
          ${onLaptop && s.status !== "done" ? `<div class="actions"><button class="btn primary big" data-riot>${s.status === "in_progress" ? "Keep going" : "Start"}</button></div>` : ""}
          ${s.status === "done" && s.state && s.state.responses && s.state.responses.length ? `<div class="actions"><button class="btn" data-cert>View my answers</button></div>` : ""}</div>${doneNote}`;
    } else if (s.kind === "group") {
      const g = RP.groupSession(s.activity);
      html += head(s.title, "Group module") +
        `<div class="card laptop-away big-note"><div class="laptop-icon" aria-hidden="true">💻 ➜ 👥</div>${RP.md(RP.CONTENT.group)}</div>
        ${g && g.about ? `<div class="card">${RP.md(g.about)}</div>` : ""}${doneNote}`;
    } else if (s.kind === "debrief") {
      html += head("Afternoon debrief", "Whole group") + `<div class="card">${RP.md(RP.CONTENT.debrief)}</div>
        ${surveyCard(RP.SURVEYS[RP.surveyIdFor(s)], "Your teacher will tell you when to start.")}
        ${s.status === "done" ? `<div class="card"><div class="actions"><button class="btn primary big" data-day-cert-main>🏅 My certificate for today</button></div></div>` : ""}`;
    } else if (s.kind === "one_to_one") {
      const ind = RP.individualSession(s.activity);
      html += head(RP.sessionTitle(s), "Teacher-led") +
        `<div class="card">${RP.md(ind ? ind.about : (RP.ONE_TO_ONE[s.day] || RP.ONE_TO_ONE[1]).about)}</div>
        <p class="muted">${s.slot === RP.ONE_TO_ONE_SLOT ? "Keep working and your teacher will come and get you." : "If your teacher is still busy, keep working on your last activity until they're ready."}</p>${doneNote}`;
    } else if (RP.isCustom(s)) {
      html += head(s.title, "Other") +
        `<div class="card laptop-away big-note"><div class="laptop-icon" aria-hidden="true">💻 ➜ 🚶</div><p>This session is <strong>${h(s.title)}</strong>.</p><p>You won't need your laptop. Put it to the side.</p></div>${doneNote}`;
    } else if (s.kind === "free" || (s.kind === "independent" && !s.activity && allElectivesDone())) {
      html += head(RP.CONTENT.freeChoice.title, "Free choice") + `<div class="card">${RP.md(RP.CONTENT.freeChoice.text)}</div>`;
    } else if (s.kind === "independent" && !s.activity) {
      html += head("Not chosen yet", "Independent") + `<div class="card">${RP.md(RP.CONTENT.unassigned)}</div>`;
    } else if (s.kind === "independent") {
      const m = RP.MODULES[s.activity];
      if (!m) {
        html += head(s.title) + `<div class="card">This activity isn't available on this website yet. Press <strong>I need help</strong>.</div>`;
      } else if (s.status === "done") {
        html += head(m.title, RP.kindLabel(s)) + `
          <div class="card finished">
            <p class="done-note big">✓ Finished${s.result && RP.resultText(s.result) ? ` · ${h(RP.resultText(s.result))}` : ""}</p>
            ${s.state && s.state.responses && s.state.responses.length ? `<div class="actions"><button class="btn primary" data-cert>View my answers</button></div>` : ""}
          </div>
          ${allElectivesDone() ? `<div class="card"><h2>${h(RP.CONTENT.freeChoice.title)}</h2>${RP.md(RP.CONTENT.freeChoice.text)}</div>` : `<p class="muted">Pick your next activity from the plan on the left.</p>`}`;
      } else {
        html += head(m.title, RP.kindLabel(s)) + `
          <div class="card module-card">
            ${m.icon ? `<div class="module-icon" aria-hidden="true">${m.icon}</div>` : ""}
            <div>${RP.md(m.about || "")}</div>
            <div class="actions"><button class="btn primary big" data-start>${s.status === "in_progress" ? "Keep going" : "Start"}</button></div>
          </div>`;
      }
    }
    main.innerHTML = `<div class="session"><div class="session-tools">${RP.speech.button()}</div>${html}</div>`;
    RP.speech.bind(main, () => main.querySelector(".session"));
    const rb = main.querySelector("[data-riot]");
    if (rb) rb.onclick = () => openRiot(s);
    const go = main.querySelector("[data-start]");
    if (go) go.onclick = () => openModule(s);
    const cert = main.querySelector("[data-cert]");
    if (cert) cert.onclick = () => { mode = "cert"; renderSidebar(); showFinished(certFor(s)); };
    const dc = main.querySelector("[data-day-cert-main]");
    if (dc) dc.onclick = () => { mode = "cert"; renderSidebar(); showDayCertificate(s.day); };
    const survey = main.querySelector("[data-survey]");
    if (survey) survey.onclick = () => openSurvey(s);
  }

  // A survey: the morning survey (morning session), end-of-day survey (debrief) or follow-up.
  // Answers are sent when it's submitted.
  function openSurvey(s, after) {
    mode = "module";
    const survey = RP.SURVEYS[RP.surveyIdFor(s)];
    if (s.status === "not_started") queueSave(s.id, "in_progress", null, s.state || {});
    renderSidebar();
    const answersKey = "rp-answers:" + s.id;
    RP.Player.open({
      el: $("#main"), module: survey, session: s,
      answers: { get: () => store.get(answersKey), set: a => store.set(answersKey, a) },
      save: (status, result, state) => queueSave(s.id, status, result, state),
      onExit: () => { mode = "plan"; if (after) after(); else { renderSidebar(); renderMain(); } },
      onFinish: (result, state, worksheet) => {
        queueSave(s.id, "done", result, Object.assign({}, state, { responses: worksheet }));
        store.set(answersKey, null);
        if (after) { mode = "plan"; after(); return; }
        // The end-of-day survey leads straight to the day's certificate.
        if (s.kind === "debrief") { mode = "cert"; renderSidebar(); showDayCertificate(s.day); return; }
        mode = "plan"; renderSidebar(); renderMain();
      }
    });
  }

  function allElectivesDone() {
    const planned = today().filter(s => s.kind === "independent" && s.activity);
    return planned.length > 0 && planned.every(s => s.status === "done");
  }

  // ---------------------------------------------------------------- independent modules
  // A RIOT group module done on the laptop: the interactive lesson, or the PDF with answer boxes.
  function openRiot(s) {
    const st = s.state || {}, L = RP.riotLesson(st.lesson);
    if (!L) return;
    const m = st.format === "pdf"
      ? { id: "riot-pdf", title: `RIOT ${L.fullTitle}`, booklet: true, single: true, score: false, riot: L.n,
          books: [{ id: "riot", title: "RIOT", subjects: [{ id: "lesson" + L.n, title: L.fullTitle, pdf: RP.riotPdf(L.n) }] }] }
      : RP.MODULES[L.id];
    openModule(s, m);
  }

  function openModule(s, module) {
    mode = "module";
    const m = module || RP.MODULES[s.activity];
    if (s.status === "not_started") queueSave(s.id, "in_progress", null, s.state || {});
    renderSidebar();
    const answersKey = "rp-answers:" + s.id;
    RP.Player.open({
      el: m.riot ? riotSplit(m) : $("#main"), module: m, session: s,
      // Written answers stay on this laptop while the student works; they're sent when the module is finished.
      answers: { get: () => store.get(answersKey), set: a => store.set(answersKey, a) },
      save: (status, result, state) => queueSave(s.id, status, result, state),
      onExit: () => { mode = "plan"; renderSidebar(); renderMain(); },
      onFinish: (result, state, worksheet) => {
        const finalState = Object.assign({}, state, worksheet.length ? { responses: worksheet } : {});
        queueSave(s.id, "done", result, finalState);
        s.completed_at = new Date().toISOString();
        store.set(answersKey, null);
        mode = "cert";
        renderSidebar();
        showFinished(Object.assign(certFor(s), { justFinished: true }));
      }
    });
  }

  // A RIOT lesson on the laptop: the worksheet next to the lesson's slides, so a student can work
  // through it on their own if no teacher is free. The slides follow the exercise they're on; they
  // can hide them or open them in a new tab. Returns the element the worksheet goes in.
  function riotSplit(m) {
    const L = RP.riotLesson(m.riot);
    let shown = true;
    try { shown = localStorage.getItem("rp-riot-slides") !== "hidden"; } catch (e) { /* private window */ }
    $("#main").innerHTML = `
      <div class="riot-split${shown ? "" : " slides-hidden"}">
        <div class="riot-work"></div>
        <aside class="riot-slides-panel" aria-label="Lesson slides">
          <div class="riot-slides-head"><strong>Lesson slides</strong>
            <span><a class="btn small" href="riot-slides.html?lesson=${L.n}" target="_blank" rel="noopener" data-slides-tab>Open in a new tab</a>
            <button class="btn small" data-slides-toggle>Hide slides</button></span></div>
          <div data-slides></div>
        </aside>
        <button class="btn small riot-slides-show" data-slides-show>Show the slides</button>
      </div>`;
    const split = $(".riot-split"), work = $(".riot-work");
    const viewer = RP.riotSlides($("[data-slides]"), L, 0);
    const setShown = v => { split.classList.toggle("slides-hidden", !v); try { localStorage.setItem("rp-riot-slides", v ? "shown" : "hidden"); } catch (e) { /* private window */ } };
    $("[data-slides-toggle]").onclick = () => setShown(false);
    $("[data-slides-show]").onclick = () => setShown(true);
    // Follow the student: show the slide for the exercise on screen.
    let last = null;
    new MutationObserver(() => {
      const body = work.querySelector(".player-body"), i = body ? Number(body.dataset.item) : NaN;
      const it = Number.isInteger(i) && m.items ? m.items[i] : null;
      const n = it && it.actNo;
      if (n && n !== last) { last = n; viewer.toExercise(n); $("[data-slides-tab]").href = `riot-slides.html?lesson=${L.n}&exercise=${n}`; }
    }).observe(work, { childList: true });
    return work;
  }

  function certFor(s) {
    return Object.assign({
      title: RP.sessionTitle(s),
      date: RP.longDate(s.completed_at || new Date().toISOString()),
      worksheet: (s.state && s.state.responses) || []
    }, s.result || {});
  }

  const backToPlan = () => { mode = "plan"; renderSidebar(); renderMain(); };
  function showFinished(info) { RP.Player.finished($("#main"), info, backToPlan); }
  function showDayCertificate(day) {
    const first = plan.sessions.find(x => x.day === day && x.kind === "intro");
    const date = day === plan.current_day ? new Date().toISOString() : (first && (first.completed_at || first.updated_at)) || new Date().toISOString();
    RP.Player.dayCertificate($("#main"), { day, date: RP.longDate(date), modules: RP.dayModules(plan.sessions, day, plan.times) }, backToPlan);
  }

  // ---------------------------------------------------------------- word help
  // Look up what a word means. Select a word on the page first to look it up straight away.
  // Only the word is sent (to a free online dictionary), nothing about the student.
  function wordHelp() {
    const picked = String(window.getSelection ? window.getSelection() : "").trim().split(/\s+/)[0] || "";
    let box = $("#word-help");
    if (!box) {
      box = document.createElement("dialog");
      box.id = "word-help"; box.className = "word-help";
      box.innerHTML = `
        <form method="dialog" class="word-form" data-word-form>
          <h2>What does it mean?</h2>
          <div class="answer-row"><input data-word autocomplete="off" spellcheck="true" maxlength="40" aria-label="Word to look up" placeholder="Type a word"><button class="btn primary" type="submit">Look up</button></div>
          <div class="word-result" data-word-result aria-live="polite"></div>
          <div class="actions"><button class="btn ghost" type="button" data-word-close>Close</button></div>
        </form>`;
      document.body.appendChild(box);
      box.querySelector("[data-word-close]").onclick = () => box.close();
      box.querySelector("[data-word-form]").onsubmit = e => { e.preventDefault(); lookUp(box.querySelector("[data-word]").value); };
    }
    const input = box.querySelector("[data-word]");
    input.value = picked.replace(/[^A-Za-z'-]/g, "");
    box.querySelector("[data-word-result]").innerHTML = "";
    box.showModal();
    input.focus();
    if (input.value) lookUp(input.value);
  }
  async function lookUp(raw) {
    const word = String(raw || "").trim().toLowerCase().replace(/[^a-z'-]/g, "");
    const out = $("[data-word-result]");
    if (!word) { out.innerHTML = `<p class="muted">Type one word.</p>`; return; }
    out.innerHTML = `<p class="muted">Looking up “${h(word)}”…</p>`;
    try {
      const res = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(word));
      if (res.status === 404) { out.innerHTML = `<p>Couldn't find “${h(word)}”. Check the spelling, or ask your teacher.</p>`; return; }
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const meanings = data.flatMap(e => e.meanings || []).slice(0, 3);
      out.innerHTML = `<h3>${h(data[0].word || word)}</h3>` + meanings.map(m => {
        const d = (m.definitions || [])[0] || {};
        return `<div class="word-meaning"><span class="tag">${h(m.partOfSpeech || "")}</span> ${h(d.definition || "")}${d.example ? `<div class="muted">e.g. “${h(d.example)}”</div>` : ""}</div>`;
      }).join("");
    } catch (e) {
      out.innerHTML = `<p>Can't look that up right now. Ask your teacher, or try again later.</p>`;
    }
  }
  const wh = $("#word-help-btn");
  if (wh) { wh.onmousedown = e => e.preventDefault(); wh.onclick = wordHelp; }

  // ---------------------------------------------------------------- help button and clock
  function updateHelp() {
    const b = $("#help");
    if (!b) return;
    b.hidden = !plan;
    const w = $("#word-help-btn"); if (w) w.hidden = !plan;
    const on = plan && plan.help;
    b.classList.toggle("on", !!on);
    b.textContent = on ? "Help is coming" : "I need help";
    document.body.classList.toggle("help-on", !!on);
  }
  $("#help").onclick = async () => {
    if (!plan) return;
    const on = !plan.help;
    plan.help = on; updateHelp();
    try { await api.studentHelp(code, on); } catch (e) { plan.help = !on; updateHelp(); alert("Couldn't reach your teacher's screen. Put your hand up instead."); }
  };

  function tick() {
    const d = new Date();
    $("#clock").textContent = d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" });
    if (!plan) return;
    const now = RP.currentSlot(tt());
    if (JSON.stringify(now) !== JSON.stringify(clockSlot)) {
      clockSlot = now;
      if (mode === "plan") { selected = slotForClock(now); renderMain(); }
      renderSidebar();
    }
  }

  if (api.demo) $("#demo-banner").hidden = false;
  setInterval(tick, 15000);
  setInterval(() => { if (code) { flush(); refresh(); } }, 20000);
  window.addEventListener("online", flush);
  tick();

  if (!code) renderEntry();
  else {
    plan = store.get("rp-plan-cache");
    if (plan) start();
    refresh();
  }
})();
