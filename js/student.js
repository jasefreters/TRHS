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
    if (!$("#day-pane")) { start(); return; }
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
  const bySlot = slot => today().find(s => s.slot === slot);

  // ---------------------------------------------------------------- code entry
  function renderEntry(message) {
    document.body.classList.remove("has-plan");
    $("#app").innerHTML = `
      <div class="entry">
        <div class="entry-card">
          ${RP.sunburst(96, "#2e7fd1")}
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
    document.body.classList.add("has-plan");
    $("#app").innerHTML = `
      <aside class="day-pane" id="day-pane"></aside>
      <main class="main-pane" id="main"></main>`;
    const now = RP.currentSlot();
    clockSlot = now;
    selected = slotForClock(now);
    renderSidebar();
    if (mode === "plan") renderMain();
    updateHelp();
    flush();
  }

  function slotForClock(now) {
    if (typeof now === "number") return now;
    if (now === "before") return RP.FIRST_SLOT;
    if (now === "after") return RP.LAST_SLOT;
    const after = RP.TIMETABLE.find(t => t.slot && RP.toMinutes(t.start) >= RP.toMinutes(now.end));
    return after ? after.slot : RP.LAST_SLOT;
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
    const now = RP.currentSlot();
    const rows = RP.TIMETABLE.map(t => {
      if (t.brk) {
        const isNow = now === t;
        return `<li class="brk${isNow ? " now" : ""}"><span class="time">${RP.formatTime(t.start)}</span><span>${h(t.brk)}</span>${isNow ? `<span class="now-tag">Now</span>` : ""}</li>`;
      }
      const s = bySlot(t.slot);
      if (!s) return "";
      const title = s.kind === "independent" && s.activity && RP.MODULES[s.activity] ? RP.MODULES[s.activity].title : s.title;
      return `
        <li>
          <button class="slot k-${s.kind}${selected === t.slot ? " selected" : ""}${now === t.slot ? " now" : ""}${s.status === "done" ? " is-done" : ""}" data-slot="${t.slot}">
            <span class="time">${RP.formatTime(t.start)}</span>
            <span class="slot-text"><span class="slot-title">${h(title)}</span><span class="slot-kind">${h(RP.KIND_LABEL[s.kind])}</span></span>
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
      ${one ? `
        <button class="slot k-one_to_one oneone${selected === RP.ONE_TO_ONE_SLOT ? " selected" : ""}" data-slot="${RP.ONE_TO_ONE_SLOT}">
          <span class="time">Any time</span>
          <span class="slot-text"><span class="slot-title">${h(one.title)}</span><span class="slot-kind">Your teacher will come and get you</span></span>
          ${statusIcon(one)}
        </button>` : ""}
      <p class="offline" id="offline" ${offline ? "" : "hidden"}>Not connected. Your work is saved on this laptop and will send when the internet is back.</p>`;
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
    const times = RP.slotTimes(s.slot);
    const when = times ? `${RP.formatTime(times.start)} – ${RP.formatTime(times.end)}` : "";
    const head = (title, kind) => `
      <div class="session-head k-${s.kind}">
        <span class="kind-chip">${h(kind || RP.KIND_LABEL[s.kind])}</span>
        <h1>${h(title)}</h1>
        ${when ? `<div class="when">${when}</div>` : ""}
      </div>`;
    const doneNote = s.status === "done" ? `<p class="done-note">✓ Done</p>` : "";
    let html = "";

    if (s.kind === "intro") {
      html = head("Morning session", "Whole group") + `
        <div class="card story">${RP.md(RP.CONTENT.story[plan.current_day])}</div>
        <div class="card laptop-away">${RP.md(RP.CONTENT.morning)}</div>
        <div class="actions">${s.status === "done" ? doneNote : `<button class="btn primary big" data-read>I've read this</button>`}</div>`;
    } else if (s.kind === "group") {
      const g = RP.groupSession(s.activity);
      html = head(s.title, g && g.module ? `Group · Module ${g.module} movement` : "Group") +
        `<div class="card laptop-away big-note"><div class="laptop-icon" aria-hidden="true">💻 ➜ 👥</div>${RP.md(RP.CONTENT.group)}</div>
        ${g && g.about ? `<div class="card">${RP.md(g.about)}</div>` : ""}${doneNote}`;
    } else if (s.kind === "debrief") {
      html = head("Afternoon debrief", "Whole group") + `<div class="card laptop-away big-note"><div class="laptop-icon" aria-hidden="true">💻 ➜ 👥</div>${RP.md(RP.CONTENT.debrief)}</div>${doneNote}`;
    } else if (s.kind === "one_to_one") {
      html = head(s.title, "1:1") + `<div class="card">${RP.md(RP.ONE_TO_ONE[plan.current_day].about)}</div>
        <p class="muted">There's no set time. Keep working on your activities and your teacher will come and get you.</p>${doneNote}`;
    } else if (s.kind === "free" || (s.kind === "independent" && !s.activity && allElectivesDone())) {
      html = head(RP.CONTENT.freeChoice.title, "Free choice") + `<div class="card">${RP.md(RP.CONTENT.freeChoice.text)}</div>`;
    } else if (s.kind === "independent" && !s.activity) {
      html = head("Elective", "On your own") + `<div class="card">${RP.md(RP.CONTENT.unassigned)}</div>`;
    } else if (s.kind === "independent") {
      const m = RP.MODULES[s.activity];
      if (!m) {
        html = head(s.title) + `<div class="card">This activity isn't available on this website yet. Press <strong>I need help</strong>.</div>`;
      } else if (s.status === "done") {
        html = head(m.title, "On your own") + `
          <div class="card finished">
            <p class="done-note big">✓ Finished${s.result && RP.resultText(s.result) ? ` · ${h(RP.resultText(s.result))}` : ""}</p>
            <div class="actions"><button class="btn primary" data-cert>View my certificate${s.state && s.state.responses && s.state.responses.length ? " and answers" : ""}</button></div>
          </div>
          ${allElectivesDone() ? `<div class="card"><h2>${h(RP.CONTENT.freeChoice.title)}</h2>${RP.md(RP.CONTENT.freeChoice.text)}</div>` : `<p class="muted">Pick your next activity from the plan on the left.</p>`}`;
      } else {
        html = head(m.title, "On your own") + `
          <div class="card module-card">
            ${m.icon ? `<div class="module-icon" aria-hidden="true">${m.icon}</div>` : ""}
            <div>${RP.md(m.about || "")}</div>
            <div class="actions"><button class="btn primary big" data-start>${s.status === "in_progress" ? "Keep going" : "Start"}</button></div>
          </div>`;
      }
    }
    main.innerHTML = `<div class="session">${html}</div>`;

    const read = main.querySelector("[data-read]");
    if (read) read.onclick = () => { queueSave(s.id, "done"); renderSidebar(); renderMain(); };
    const go = main.querySelector("[data-start]");
    if (go) go.onclick = () => openModule(s);
    const cert = main.querySelector("[data-cert]");
    if (cert) cert.onclick = () => { mode = "cert"; renderSidebar(); showCertificate(certFor(s)); };
  }

  function allElectivesDone() {
    return today().filter(s => s.kind === "independent" && s.activity).every(s => s.status === "done");
  }

  // ---------------------------------------------------------------- electives
  function openModule(s) {
    mode = "module";
    const m = RP.MODULES[s.activity];
    if (s.status === "not_started") queueSave(s.id, "in_progress", null, s.state || {});
    renderSidebar();
    const answersKey = "rp-answers:" + s.id;
    RP.Player.open({
      el: $("#main"), module: m, session: s,
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
        showCertificate(Object.assign(certFor(s), { justFinished: true }));
      }
    });
  }

  function certFor(s) {
    const m = RP.MODULES[s.activity];
    return Object.assign({
      title: m ? m.title : s.title,
      date: RP.longDate(s.completed_at || new Date().toISOString()),
      worksheet: (s.state && s.state.responses) || []
    }, s.result || {});
  }

  function showCertificate(cert) {
    RP.Player.certificate($("#main"), cert, () => {
      mode = "plan";
      renderSidebar(); renderMain();
    });
  }

  // ---------------------------------------------------------------- help button and clock
  function updateHelp() {
    const b = $("#help");
    if (!b) return;
    b.hidden = !plan;
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
    const now = RP.currentSlot();
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
