/* Teacher dashboard: create student codes, plan each student's two days, and follow progress live. */
(function () {
  const api = RP.connect(true);
  const h = RP.h;
  const $ = s => document.querySelector(s);
  const app = () => $("#app");
  const electives = () => Object.values(RP.MODULES).filter(m => !m.hidden && !m.teacherLed);
  const ledModules = () => Object.values(RP.MODULES).filter(m => !m.hidden && m.teacherLed);

  let view = { name: "board" };
  let visits = [];         // active visits on the board
  let visit = null;        // visit open in the plan editor
  let allStudents = [];    // everyone, for the All students list
  let student = null;      // student open on their record page
  const filters = { q: "", year: "", status: "", from: "" };
  let staffing = {};       // today's staffing: { slot: "Ms Smith" }
  const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const loadStaffing = async () => { try { staffing = await api.getStaffing(todayIso()); } catch (e) { staffing = {}; } };
  let pick = null;         // palette item chosen for click-to-place
  let dragging = false;
  let unsubscribe = null;

  // ---------------------------------------------------------------- login
  function renderLogin(message) {
    $("#nav").innerHTML = "";
    app().innerHTML = `
      <div class="entry">
        <form class="entry-card" data-login>
          <span class="entry-logo">${RP.logo(120)}</span>
          <h1>Teacher login</h1>
          <label class="field">School email <input type="email" name="email" autocomplete="username" required></label>
          <label class="field">Password
            <span class="pw-wrap"><input type="password" name="password" autocomplete="current-password" required><button type="button" class="pw-toggle" data-show-pw aria-label="Show password" aria-pressed="false">👁 Show</button></span>
          </label>
          <button class="btn primary big" type="submit">Log in</button>
          <p class="error" aria-live="polite">${h(message || "")}</p>
          <p class="muted small"><a href="index.html">Back to the student view</a></p>
        </form>
      </div>`;
    const form = $("[data-login]");
    form.email.focus();
    $("[data-show-pw]").onclick = e => {
      const show = form.password.type === "password";
      form.password.type = show ? "text" : "password";
      e.currentTarget.textContent = show ? "🙈 Hide" : "👁 Show";
      e.currentTarget.setAttribute("aria-pressed", show);
      e.currentTarget.setAttribute("aria-label", show ? "Hide password" : "Show password");
      form.password.focus();
    };
    form.onsubmit = async e => {
      e.preventDefault();
      const err = form.querySelector(".error");
      err.textContent = "Logging in…";
      try { await api.signIn(form.email.value.trim(), form.password.value); enter(); }
      catch (ex) {
        err.textContent = /invalid/i.test(ex.message)
          ? "That email and password don't match a teacher login. Check for typing mistakes, Caps Lock, or a password the browser filled in for you."
          : ex.message;
      }
    };
  }

  let watchingSignOut = false;
  async function enter() {
    if (!watchingSignOut) {
      watchingSignOut = true;
      api.onSignedOut(() => { if (unsubscribe) unsubscribe(); unsubscribe = null; renderLogin("You've been logged out. Please log in again."); });
    }
    renderNav();
    if (unsubscribe) unsubscribe();
    unsubscribe = api.subscribe(() => scheduleReload());
    show({ name: "board" });
  }

  function renderNav() {
    const laptop = laptopCode();
    $("#nav").innerHTML = `
      <button class="nav-btn" data-nav="board">In the program</button>
      <button class="nav-btn" data-nav="all">All students</button>
      <button class="nav-btn" data-nav="new">New student</button>
      <button class="nav-btn" data-nav="runsheet">Run sheet</button>
      <button class="nav-btn" data-nav="reports">Reports</button>
      <button class="nav-btn" data-nav="guides">Session guides</button>
      ${laptop ? `<span class="laptop-note">This laptop: ${h(RP.formatCode(laptop))} <button class="link-btn" data-clear-laptop>Clear</button></span>` : ""}
      <span class="laptop-note" data-who></span>
      <button class="nav-btn lock" data-lock>Lock</button>`;
    api.currentEmail().then(email => { const w = $("[data-who]"); if (w && email) w.textContent = email; }).catch(() => {});
    $("#nav").querySelectorAll("[data-nav]").forEach(b => b.onclick = () => show({ name: b.dataset.nav }));
    $("[data-lock]").onclick = async () => { await api.signOut(); if (unsubscribe) unsubscribe(); unsubscribe = null; renderLogin(); };
    const clear = $("[data-clear-laptop]");
    if (clear) clear.onclick = () => { clearLaptop(); renderNav(); };
    $("#nav").querySelectorAll("[data-nav]").forEach(b => b.classList.toggle("active", b.dataset.nav === view.name ||
      (["plan", "student", "print", "individual"].includes(view.name) && b.dataset.nav === (view.from === "board" ? "board" : "all"))));
  }

  function laptopCode() { try { return JSON.parse(localStorage.getItem("rp-code")); } catch (e) { return null; } }
  function clearLaptop() {
    ["rp-code", "rp-plan-cache", "rp-outbox", "rp-cert"].forEach(k => localStorage.removeItem(k));
    Object.keys(localStorage).filter(k => k.startsWith("rp-answers:")).forEach(k => localStorage.removeItem(k));
  }

  // ---------------------------------------------------------------- routing and live updates
  function updateNotice() {
    const n = $("#notice");
    if (!n) return;
    n.hidden = !api.needsUpdate && !api.needsUpdate3;
    $("#notice-text").innerHTML = api.needsUpdate
      ? "Pause, follow-up surveys and staffing need <code>supabase/update-2.sql</code>, then <code>supabase/update-3.sql</code>, to be run in the Supabase SQL Editor."
      : "Changing session times, and RIOT worksheets on laptops, need <code>supabase/update-3.sql</code> to be run once in the Supabase SQL Editor.";
  }

  async function show(v) {
    view = v; pick = null;
    RP.speech.stop();
    renderNav();
    try {
      if (v.name === "board") { [visits] = await Promise.all([api.listActive(), loadStaffing()]); renderBoard(); }
      else if (v.name === "plan") { [visit, visits] = await Promise.all([api.getVisit(v.visitId), api.listActive(), loadStaffing()]); renderPlan(); }
      else if (v.name === "individual") { [visit] = await Promise.all([api.getVisit(v.visitId), loadStaffing()]); renderIndividual(); }
      else if (v.name === "runsheet") { const date = v.date || todayIso(); const [vs, st] = await Promise.all([api.listActive(), api.getStaffing(date)]); visits = vs; renderRunsheet(date, st); }
      else if (v.name === "reports") { allStudents = await api.listAll(); renderReports(); }
      else if (v.name === "new") renderNew();
      else if (v.name === "guides") renderGuides();
      else if (v.name === "all") { allStudents = await api.listAll(); renderAll(); }
      else if (v.name === "student") { student = await api.getStudent(v.studentId); renderStudent(); }
      else if (v.name === "print") { student = await api.getStudent(v.studentId); renderPrint(); }
    } catch (ex) { failed(ex); }
    updateNotice();
  }

  // If the login has gone (expired, or logged out elsewhere), the database treats requests as
  // coming from someone not logged in and its security rules refuse them. Ask to log in again.
  const isLoginError = ex => /Not logged in|JWT|auth|401|row-level security/i.test(ex.message || "");
  async function failed(ex) {
    if (isLoginError(ex)) {
      let staff = false;
      try { staff = await api.isStaff(); } catch (e) { /* treat as logged out */ }
      if (!staff) { renderLogin("Your login has expired. Please log in again."); return; }
    }
    app().innerHTML = `<div class="page"><div class="card error-card"><h2>Something went wrong</h2><p>${h(ex.message)}</p><button class="btn primary" data-retry>Try again</button></div></div>`;
    $("[data-retry]").onclick = () => show(view);
  }

  let reloadTimer = null;
  function scheduleReload() {
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(reload, 400);
  }
  async function reload() {
    if (dragging || document.querySelector("dialog[open]")) return scheduleReload();
    try {
      if (view.name === "board") { [visits] = await Promise.all([api.listActive(), loadStaffing()]); renderBoard(); }
      else if (view.name === "plan") { [visit, visits] = await Promise.all([api.getVisit(view.visitId), api.listActive(), loadStaffing()]); renderPlan(); }
      else if (view.name === "individual") {
        visit = await api.getVisit(view.visitId);
        // Don't redraw over a return plan the staff member is filling in.
        if (!updateLive() && !document.querySelector("[data-plan-field]")) renderIndividual();
      }
      else if (view.name === "student") { student = await api.getStudent(view.studentId); renderStudent(); }
    } catch (ex) { /* try again on the next change or poll */ }
  }

  // ---------------------------------------------------------------- helpers
  const sessionsFor = (v, day) => v.sessions.filter(s => s.day === day).sort((a, b) => a.slot - b.slot);
  const at = (v, day, slot) => v.sessions.find(s => s.day === day && s.slot === slot);
  const titleOf = s => RP.sessionTitle(s);
  // A student's timetable for a day (their own times if staff changed them), and their slot now.
  const ttOf = (v, day) => RP.timetableFor(v.times, day);
  const nowOf = v => RP.currentSlot(ttOf(v, v.current_day));
  const ledTitle = s => /^Teacher-led/i.test(titleOf(s)) ? titleOf(s) : "Teacher-led: " + titleOf(s);
  const teacherTicks = s => ["group", "one_to_one"].includes(s.kind) || RP.isCustom(s);
  const individualsOn = (v, day) => v.sessions.filter(s => s.day === day && (s.kind === "one_to_one" || RP.isLedModule(s))).sort((a, b) => a.slot - b.slot);

  // Individual sessions in the same slot today as another student's: the teacher can't do both.
  function clashes(v) {
    const out = {};
    individualsOn(v, v.current_day).filter(s => s.slot <= RP.LAST_SLOT).forEach(s => {
      const others = visits.filter(o => o.id !== v.id && !o.paused && o.kind !== "followup").filter(o => { const x = at(o, o.current_day, s.slot); return x && x.kind === "one_to_one"; });
      if (others.length) out[s.slot] = others.map(o => RP.formatCode(o.student.code));
    });
    return out;
  }
  // Individual sessions expected for a day (review on Day 1, success plan on Day 2) that aren't in the plan.
  const missingIndividual = (v, day) => (RP.INDIVIDUAL_SESSIONS || []).filter(x => x.day === day && !v.sessions.some(s => s.day === day && s.activity === x.id));

  function statusText(s) {
    if (s.kind === "independent" && !s.activity) return "Empty";
    if (s.kind === "debrief" || s.kind === "intro" || s.kind === "survey") return s.status === "done" ? "Survey done" + (s.result && s.result.survey ? ` · ${s.result.total}/${s.result.max || 50}` : "") : s.status === "in_progress" ? "Survey started" : "Survey not done";
    if (s.status === "done") return "Done" + (s.result && RP.resultText(s.result) ? " · " + RP.resultText(s.result) : "");
    if (s.status === "in_progress") return "In progress";
    return "Not started";
  }

  async function setDone(s, done) {
    await api.updateSession(s.id, { status: done ? "done" : "not_started", completed_at: done ? new Date().toISOString() : null });
  }

  // ---------------------------------------------------------------- board
  function renderBoard() {
    const now = RP.currentSlot();
    const programs = visits.filter(v => v.kind !== "followup");
    const followups = visits.filter(v => v.kind === "followup");
    const helpCount = visits.filter(v => v.help_requested_at).length;
    document.title = (helpCount ? `(${helpCount}) ` : "") + "Teacher | Reset Program";

    // One click to tick the current group session for everyone, and present it on the projector.
    let bulk = "", present = "";
    if (typeof now === "number") {
      const due = programs.filter(v => !v.paused).map(v => at(v, v.current_day, nowOf(v))).filter(s => s && s.kind === "group" && s.status !== "done");
      if (due.length) {
        const names = [...new Set(due.map(titleOf))].join(" / ");
        bulk = `<button class="btn primary" data-bulk>Tick “${h(names)}” done for ${due.length} student${due.length > 1 ? "s" : ""}</button>`;
      }
      const ids = [...new Set(programs.map(v => at(v, v.current_day, nowOf(v))).filter(s => s && s.kind === "group")
        .map(s => RP.isRiot(s) ? (s.state && s.state.lesson ? "riot:" + s.state.lesson : null) : s.activity).filter(Boolean))];
      present = ids.map(id => [id, presentable(id)]).filter(([, g]) => g && g.slides)
        .map(([id, g]) => `<button class="btn" data-present="${id}">Present: ${h(g.title)}</button>`).join("");
    }
    const staffNow = typeof now === "number" && staffing[now] ? staffing[now] : "";

    app().innerHTML = `
      <div class="page">
        <div class="page-head">
          <div>
            <h1>Students in the program</h1>
            <p class="muted staff-now">${typeof now === "number" ? `Session ${now} (${RP.formatTime(RP.slotTimes(now).start)}) · Staff: <strong>${h(staffNow || "not set")}</strong> · <button class="link-btn" data-go-runsheet>Run sheet</button>` : ""}</p>
          </div>
          <div class="page-actions">${present}${bulk}<button class="btn" data-go-new>New student</button></div>
        </div>
        ${programs.length ? `<div class="board">${programs.map(card).join("")}</div>` :
          `<div class="card empty"><p>No students in the program right now.</p><button class="btn primary" data-go-new>Add a new student</button> <button class="btn" data-go-lookup>Find a returning student</button></div>`}
        ${followups.length ? `<h2 class="section-title">Follow-up surveys open</h2><div class="board">${followups.map(followupCard).join("")}</div>` : ""}
      </div>`;

    app().querySelectorAll("[data-go-new]").forEach(b => b.onclick = () => show({ name: "new" }));
    const gl = $("[data-go-lookup]"); if (gl) gl.onclick = () => show({ name: "all" });
    const rs = $("[data-go-runsheet]"); if (rs) rs.onclick = () => show({ name: "runsheet" });
    app().querySelectorAll("[data-present]").forEach(b => b.onclick = () => showPresent(b.dataset.present));
    const bb = $("[data-bulk]");
    if (bb) bb.onclick = async () => {
      bb.disabled = true;
      for (const v of programs.filter(v => !v.paused)) {
        const s = at(v, v.current_day, now);
        if (s && s.kind === "group" && s.status !== "done") await setDone(s, true);
      }
      reload();
    };

    app().querySelectorAll("[data-card]").forEach(el => {
      const v = visits.find(v => v.id === el.dataset.card);
      const on = (sel, fn) => { const b = el.querySelector(sel); if (b) b.onclick = fn; };
      on("[data-plan]", () => show({ name: "plan", visitId: v.id, from: "board" }));
      on("[data-record-page]", () => show({ name: "student", studentId: v.student.id, from: "board" }));
      on("[data-clear-help]", async () => { await api.updateVisit(v.id, { help_requested_at: null }); reload(); });
      on("[data-day2]", async () => { if (confirm(`Move ${RP.formatCode(v.student.code)} to Day 2?`)) { await api.updateVisit(v.id, { current_day: 2 }); reload(); } });
      on("[data-laptop]", () => toStudentView(v.student.code));
      on("[data-finish]", () => finish(v));
      on("[data-pause]", () => setPaused(v, !v.paused));
      el.querySelectorAll("[data-preview]").forEach(b => b.onclick = () => previewModule(b.dataset.preview));
      el.querySelectorAll("[data-ind]").forEach(b => b.onclick = () => show({ name: "individual", visitId: v.id, sessionId: b.dataset.ind, from: "board" }));
      el.querySelectorAll("[data-tick]").forEach(b => b.onclick = async () => {
        const s = v.sessions.find(s => s.id === b.dataset.tick);
        b.disabled = true; await setDone(s, s.status !== "done"); reload();
      });
    });
  }

  async function setPaused(v, paused) {
    const msg = paused
      ? `Pause the program for ${RP.formatCode(v.student.code)}? Their code will show "paused" until you resume it, for example if they're away.`
      : `Resume the program for ${RP.formatCode(v.student.code)}?`;
    if (!confirm(msg)) return;
    try { await api.updateVisit(v.id, { paused }); reload(); } catch (ex) { alert(ex.message); }
  }

  function followupCard(v) {
    const s = v.sessions.find(x => x.kind === "survey");
    return `
      <article class="stu-card followup" data-card="${v.id}">
        <header><div class="code">${h(RP.formatCode(v.student.code))}</div><div class="muted">Follow-up</div></header>
        <div class="row">${s && s.status === "done" ? `<span class="ok-text">✓ Survey done · ${s.result ? s.result.total + "/" + (s.result.max || 50) : ""}</span>` : `<span class="muted">${s && s.status === "in_progress" ? "Survey started" : "Survey not started"}</span>`}</div>
        <footer>
          <button class="btn small" data-record-page>Record</button>
          <button class="btn small" data-laptop>Student view on this laptop</button>
          <button class="btn small danger" data-finish>Close follow-up</button>
        </footer>
      </article>`;
  }

  function card(v) {
    const tt = ttOf(v, v.current_day), now = RP.currentSlot(tt);
    const day = sessionsFor(v, v.current_day);
    const mini = day.filter(s => s.slot <= RP.LAST_SLOT).map(s => {
      const t = RP.slotTimes(s.slot, tt);
      const icon = s.status === "done" ? "✓" : s.status === "in_progress" ? "•" : "";
      return `<span class="mini k-${s.kind} st-${s.status}${now === s.slot ? " now" : ""}" title="${h(RP.formatTime(t.start) + " " + titleOf(s) + ": " + statusText(s))}">${icon}</span>`;
    }).join("");
    const cur = typeof now === "number" ? at(v, v.current_day, now) : null;
    const inds = individualsOn(v, v.current_day);
    const clash = clashes(v);
    const finished = v.sessions.filter(s => s.kind === "independent" && s.status === "done");
    const missing = RP.missingCore(v.sessions);
    return `
      <article class="stu-card${v.help_requested_at ? " needs-help" : ""}${v.paused ? " paused" : ""}" data-card="${v.id}">
        ${v.help_requested_at ? `<div class="help-banner">Needs help <button class="btn small" data-clear-help>Clear</button></div>` : ""}
        ${v.paused ? `<div class="paused-banner">Paused <button class="btn small" data-pause>Resume</button></div>` : ""}
        <header>
          <div class="code">${h(RP.formatCode(v.student.code))}</div>
          <div class="muted">${v.student.year_level ? "Year " + v.student.year_level + " · " : ""}<strong>Day ${v.current_day}</strong></div>
        </header>
        <div class="mini-day" aria-label="Today's sessions">${mini}</div>
        ${readyLine(v)}
        <div class="now-line">${cur ? `<span class="muted">Now:</span> ${h(titleOf(cur))} <span class="muted">· ${h(statusText(cur))}</span>
          ${teacherTicks(cur) ? `<button class="btn small" data-tick="${cur.id}">${cur.status === "done" ? "Undo tick" : "Tick done"}</button>` : ""}
          ${cur.kind === "independent" && cur.activity && RP.MODULES[cur.activity] ? `<button class="btn small" data-preview="${h(cur.activity)}">View module</button>` : ""}
          ${watchable(cur) && cur.status !== "not_started" && !RP.isLedModule(cur) ? `<button class="btn small" data-ind="${cur.id}">See answers</button>` : ""}` :
          `<span class="muted">${typeof now === "object" && now.brk ? h(now.brk) : "Outside program hours"}</span>`}</div>
        ${inds.length ? inds.map(one => {
          const t = RP.slotTimes(one.slot, tt);
          return `<div class="row"><button class="link-btn" data-ind="${one.id}">${t ? RP.formatTime(t.start) + " " : ""}${h(ledTitle(one))}</button>
            <button class="btn small${one.status === "done" ? " ok" : ""}" data-tick="${one.id}">${one.status === "done" ? "✓ Done" : "Mark done"}</button>
            ${t && staffing[one.slot] ? `<span class="muted">with ${h(staffing[one.slot])}</span>` : ""}
            ${clash[one.slot] ? `<span class="warn">Clashes with ${h(clash[one.slot].join(", "))}</span>` : ""}</div>`;
        }).join("") : `<div class="row"><span class="warn">No teacher-led session planned for today</span></div>`}
        ${finished.length ? `<div class="row results"><span class="muted">Finished:</span> ${finished.map(s => `${h(titleOf(s))}${s.result && RP.resultText(s.result) ? ` <span class="muted">(${h(RP.resultText(s.result))})</span>` : ""}`).join(", ")}</div>` : ""}
        <div class="row core">${missing.length ? `<span class="muted">Core still to do:</span> ${missing.map(g => h(g.title)).join(", ")}` : `<span class="ok-text">✓ All core group sessions done</span>`}</div>
        <footer>
          <button class="btn primary small" data-plan>Daily schedule</button>
          <button class="btn small" data-record-page>Record</button>
          ${v.current_day === 1 ? `<button class="btn small" data-day2>Move to Day 2</button>` : ""}
          <button class="btn small" data-laptop>Student view on this laptop</button>
          ${v.paused ? "" : `<button class="btn small" data-pause>Pause</button>`}
          <button class="btn small danger" data-finish>Finish program</button>
        </footer>
      </article>`;
  }

  // The morning ready-to-learn check: traffic light and anything they don't have.
  function readyLine(v) {
    const intro = v.sessions.find(s => s.day === v.current_day && s.kind === "intro" && s.result && s.result.ready);
    if (!intro) return "";
    const r = intro.result.ready;
    const light = RP.READY_LIGHTS.find(l => l.id === r.light);
    const missing = RP.READY_ITEMS.filter(x => (r.missing || []).includes(x.id)).map(x => x.label.toLowerCase());
    return `<div class="row ready-line">${light ? `<span class="dot dot-${r.light}" aria-hidden="true"></span> ${h(light.label)}` : `<span class="muted">Ready check done</span>`}${missing.length ? ` · <span class="warn">No: ${h(missing.join(", "))}</span>` : ""}</div>`;
  }

  async function finish(v) {
    if (v.kind === "followup") {
      if (!confirm(`Close the follow-up survey for ${RP.formatCode(v.student.code)}? Their code will stop working again.`)) return;
      await api.updateVisit(v.id, { active: false, help_requested_at: null });
      return view.name === "board" ? reload() : show(view);
    }
    const missing = RP.missingCore(v.sessions);
    const msg = `Finish the program for ${RP.formatCode(v.student.code)}?\n\nTheir code will stop working on the laptops. Their record is kept for next time.` +
      (missing.length ? `\n\nCore group sessions not ticked: ${missing.map(g => g.title).join(", ")}.` : "");
    if (!confirm(msg)) return;
    await api.updateVisit(v.id, { active: false, help_requested_at: null });
    if (view.name === "plan" && view.from !== "student") show({ name: "board" }); else reload();
  }

  async function toStudentView(code) {
    if (!confirm(`Open the student view for ${RP.formatCode(code)} on this laptop?\n\nThis logs you out. To come back, click "Teacher" and log in again.`)) return;
    clearLaptop();
    localStorage.setItem("rp-code", JSON.stringify(RP.normaliseCode(code)));
    await api.signOut();
    location.href = "index.html";
  }

  // ---------------------------------------------------------------- new student
  function renderNew() {
    app().innerHTML = `
      <div class="page narrow">
        <h1>New student</h1>
        <form class="card form" data-new>
          <label class="field">Year level
            <select name="year"><option value="">Not set</option>${[7, 8, 9, 10, 11, 12].map(y => `<option value="${y}">Year ${y}</option>`).join("")}</select>
          </label>
          <label class="field">Today's group session rotation
            <select name="rotation">${Object.keys(RP.ROTATIONS).map(r => `<option value="${r}">Rotation ${r}: ${rotationSummary(r)}</option>`).join("")}</select>
          </label>
          <p class="muted">Their Day 1 uses today's rotation and Day 2 uses the other one, so they get every group module. The other sessions start empty for you to fill in on their daily schedule.</p>
          <p class="muted">No names are stored. The website makes a code; write it next to the student's name on your offline list.</p>
          <button class="btn primary big" type="submit">Create code</button>
          <p class="error" aria-live="polite"></p>
        </form>
      </div>`;
    const form = $("[data-new]");
    form.onsubmit = async e => {
      e.preventDefault();
      const btn = form.querySelector("button"); btn.disabled = true;
      try {
        const r1 = form.rotation.value, keys = Object.keys(RP.ROTATIONS);
        const r2 = keys[(keys.indexOf(r1) + 1) % keys.length];
        const student = await api.createStudent(form.year.value ? Number(form.year.value) : null);
        const visitId = await api.startVisit(student.id, RP.buildDay(1, r1).concat(RP.buildDay(2, r2)));
        renderCreated(student, visitId);
      } catch (ex) {
        if (isLoginError(ex)) return failed(ex);
        btn.disabled = false; form.querySelector(".error").textContent = ex.message;
      }
    };
  }

  function rotationSummary(r) {
    return Object.values(RP.ROTATIONS[r]).map(id => RP.groupSession(id).title).join(", ");
  }

  function renderCreated(student, visitId) {
    app().innerHTML = `
      <div class="page narrow">
        <div class="card created">
          <p>The student's code is</p>
          <div class="big-code">${h(RP.formatCode(student.code))}</div>
          <p><strong>Write this code next to the student's name on your offline list now.</strong> The website doesn't know their name, so this is the only way to match them up later.</p>
          <div class="actions"><button class="btn primary big" data-setup>Set up their daily schedule</button></div>
        </div>
      </div>`;
    $("[data-setup]").onclick = () => show({ name: "plan", visitId, from: "board" });
  }

  // ---------------------------------------------------------------- summaries
  const latestVisit = st => (st.visits || []).filter(v => v.kind !== "followup").sort((a, b) => b.start_date.localeCompare(a.start_date) || b.created_at.localeCompare(a.created_at))[0];
  const visitsNewestFirst = st => (st.visits || []).slice().sort((a, b) => b.start_date.localeCompare(a.start_date) || b.created_at.localeCompare(a.created_at));

  function summary(v) {
    const done = v.sessions.filter(s => s.status === "done");
    const results = id => done.filter(s => s.activity === id).map(s => RP.resultText(s.result) || "done").join("; ");
    const core = RP.GROUP_SESSIONS.filter(g => g.core);
    return {
      independent: done.filter(s => s.kind === "independent" && s.activity && !["numeracy", "literacy"].includes(s.activity)).map(titleOf),
      numeracy: results("numeracy"),
      literacy: results("literacy"),
      coreDone: core.filter(g => done.some(s => s.kind === "group" && s.activity === g.id)).length,
      coreTotal: core.length,
      ones: done.filter(s => s.kind === "one_to_one").length,
      onesPlanned: v.sessions.filter(s => s.kind === "one_to_one").length,
      surveys: surveyTotals(v)
    };
  }
  // "3 independent · 1/2 teacher-led"
  const individualText = sum => `${sum.independent.length} independent · ${sum.ones}/${sum.onesPlanned} teacher-led`;

  // Survey totals out of 50 in a program: { d1am: 28, d1pm: 31, ... }.
  function surveyTotals(v) {
    const out = {};
    v.sessions.forEach(x => { const id = RP.surveyResultId(x.result); if (id && x.status === "done") out[id] = x.result.total; });
    return out;
  }
  // "28 → 39 (+11)": first and last survey of the program.
  function surveyText(sum) {
    const ids = RP.SURVEY_ORDER.filter(id => id !== "followup" && sum.surveys[id] != null);
    if (!ids.length) return "";
    const a = sum.surveys[ids[0]], b = sum.surveys[ids[ids.length - 1]];
    if (ids.length === 1) return `${RP.SURVEY_SHORT[ids[0]]} ${a}`;
    return `${a} → ${b} (${b - a >= 0 ? "+" : ""}${b - a})`;
  }

  function answerTitle(s) {
    const id = RP.surveyIdFor(s);
    if (id && RP.SURVEYS[id]) return RP.SURVEYS[id].title + (s.result && s.result.survey ? ` (${s.result.total}/${s.result.max || 50})` : "");
    return titleOf(s) + (s.result && s.result.levelTitle ? ` (${s.result.levelTitle})` : "");
  }

  function statusLabel(v) {
    if (!v) return `<span class="muted">No program</span>`;
    if (v.kind === "followup") return v.active ? `<span class="tag">Follow-up survey open</span>` : `<span class="tag done-tag">Follow-up</span>`;
    if (v.active && v.paused) return `<span class="tag paused-tag">Paused</span>`;
    return v.active ? `<span class="tag">In program · Day ${v.current_day}</span>` : `<span class="tag done-tag">Finished</span>`;
  }

  // ---------------------------------------------------------------- all students
  function filtered() {
    const q = RP.normaliseCode(filters.q);
    return allStudents.filter(st => {
      const v = latestVisit(st);
      if (q && !st.code.includes(q)) return false;
      if (filters.year && String(st.year_level || "") !== filters.year) return false;
      if (filters.status === "active" && !(st.visits || []).some(x => x.active)) return false;
      if (filters.status === "finished" && (!v || (st.visits || []).some(x => x.active))) return false;
      if (filters.from && (!v || v.start_date < filters.from)) return false;
      return true;
    });
  }

  function renderAll() {
    app().innerHTML = `
      <div class="page">
        <div class="page-head">
          <h1>All students</h1>
          <div class="page-actions"><button class="btn" data-csv>Download spreadsheet</button><button class="btn" data-old>Delete old records</button><button class="btn primary" data-go-new>New student</button></div>
        </div>
        <form class="card warn-card old-records" data-old-form hidden onsubmit="return false">
          <h2>Delete old records</h2>
          <p>Permanently deletes every student whose most recent program or follow-up started before this date, with all their programs, answers and surveys. Students in the program now are never deleted. Download the spreadsheet first if you want to keep a copy.</p>
          <div class="actions">
            <label class="field inline">Started before <input type="date" name="before"></label>
            <button class="btn" data-old-find>Find</button>
            <span data-old-count class="muted"></span>
            <button class="btn danger" data-old-delete hidden>Delete</button>
          </div>
        </form>
        <form class="card filters" data-filters onsubmit="return false">
          <label class="field">Code <input name="q" class="code-input small" maxlength="9" autocomplete="off" placeholder="Search" value="${h(filters.q)}"></label>
          <label class="field">Year <select name="year"><option value="">All</option>${[7, 8, 9, 10, 11, 12].map(y => `<option value="${y}"${filters.year === String(y) ? " selected" : ""}>Year ${y}</option>`).join("")}</select></label>
          <label class="field">Status <select name="status">
            <option value="">All</option>
            <option value="active"${filters.status === "active" ? " selected" : ""}>In the program now</option>
            <option value="finished"${filters.status === "finished" ? " selected" : ""}>Finished</option>
          </select></label>
          <label class="field">Program started on or after <input type="date" name="from" value="${h(filters.from)}"></label>
          <button class="link-btn" type="button" data-reset-filters>Clear filters</button>
        </form>
        <div id="records"></div>
      </div>`;
    const form = $("[data-filters]");
    form.q.oninput = () => { form.q.value = RP.formatCode(form.q.value); filters.q = form.q.value; renderRecords(); };
    ["year", "status", "from"].forEach(k => form[k].onchange = () => { filters[k] = form[k].value; renderRecords(); });
    $("[data-reset-filters]").onclick = () => { Object.keys(filters).forEach(k => filters[k] = ""); renderAll(); };
    $("[data-go-new]").onclick = () => show({ name: "new" });
    $("[data-csv]").onclick = downloadCsv;
    const oldForm = $("[data-old-form]");
    let oldList = [];
    $("[data-old]").onclick = () => { oldForm.hidden = !oldForm.hidden; };
    $("[data-old-find]").onclick = () => {
      const before = oldForm.before.value;
      if (!before) { oldForm.before.focus(); return; }
      oldList = allStudents.filter(st => {
        const vs = st.visits || [];
        if (vs.some(v => v.active)) return false;
        const last = vs.map(v => v.start_date).sort().pop() || st.created_at.slice(0, 10);
        return last < before;
      });
      $("[data-old-count]").textContent = `${oldList.length} student${oldList.length === 1 ? "" : "s"} found.`;
      const del = $("[data-old-delete]");
      del.hidden = !oldList.length;
      del.textContent = `Delete ${oldList.length} student${oldList.length === 1 ? "" : "s"}`;
    };
    $("[data-old-delete]").onclick = async () => {
      if (!confirm(`Permanently delete ${oldList.length} student${oldList.length === 1 ? "" : "s"} and all their records? This can't be undone.`)) return;
      const typed = prompt('Type DELETE to confirm:');
      if (typed !== "DELETE") { alert("Nothing was deleted."); return; }
      try {
        for (const st of oldList) { await api.deleteStudent(st.id); if (laptopCode() === st.code) clearLaptop(); }
        show({ name: "all" });
      } catch (ex) { failed(ex); }
    };
    renderRecords();
  }

  function renderRecords() {
    const list = filtered();
    const programs = list.reduce((n, st) => n + (st.visits || []).length, 0);
    $("#records").innerHTML = `
      <p class="muted">${list.length} student${list.length === 1 ? "" : "s"} · ${programs} program${programs === 1 ? "" : "s"}${list.length < allStudents.length ? ` (filtered from ${allStudents.length})` : ""}. Click a student to see their full record.</p>
      ${list.length ? `
      <div class="table-wrap"><table class="records">
        <thead><tr><th>Code</th><th>Year</th><th>Latest program</th><th>Status</th><th>Programs</th><th>Group modules</th><th>Individual sessions</th><th>Literacy</th><th>Survey start → end</th></tr></thead>
        <tbody>${list.map(st => {
          const v = latestVisit(st), sum = v ? summary(v) : null;
          return `<tr data-student="${st.id}" tabindex="0">
            <td class="code-cell">${h(RP.formatCode(st.code))}</td>
            <td>${st.year_level || ""}</td>
            <td>${v ? RP.formatDate(v.start_date) : ""}</td>
            <td>${statusLabel(v && (st.visits.find(x => x.active) || v))}</td>
            <td>${(st.visits || []).length}</td>
            <td>${sum ? `${sum.coreDone}/${sum.coreTotal}` : ""}</td>
            <td${sum && sum.independent.length ? ` title="${h(sum.independent.join(", "))}"` : ""}>${sum ? h(individualText(sum)) : ""}</td>
            <td>${sum ? h(sum.literacy) : ""}</td>
            <td>${sum ? h(surveyText(sum)) : ""}</td>
          </tr>`;
        }).join("")}</tbody>
      </table></div>` : `<div class="card empty"><p>No students match.</p></div>`}`;
    $("#records").querySelectorAll("[data-student]").forEach(tr => {
      const open = () => show({ name: "student", studentId: tr.dataset.student, from: "all" });
      tr.onclick = open;
      tr.onkeydown = e => { if (e.key === "Enter") open(); };
    });
  }

  // One row per program, for matching to names offline and for reports.
  function downloadCsv() {
    const rows = [["Code", "Year level", "Program start", "Status", "Current day", "Independent sessions completed", "Literacy", "Numeracy", "Core group modules", "Teacher-led sessions done",
      ...RP.SURVEY_ORDER.map(id => `Survey ${RP.SURVEY_SHORT[id]} (/50)`), "Survey change (D1 start to D2 end)"]];
    filtered().forEach(st => visitsNewestFirst(st).forEach(v => {
      const sum = summary(v);
      rows.push([RP.formatCode(st.code), st.year_level || "", v.start_date, v.kind === "followup" ? "Follow-up" : v.paused && v.active ? "Paused" : v.active ? "In program" : "Finished", v.active ? v.current_day : "",
        sum.independent.join("; "), sum.literacy, sum.numeracy, `${sum.coreDone}/${sum.coreTotal}`, `${sum.ones}/${sum.onesPlanned}`,
        ...RP.SURVEY_ORDER.map(id => sum.surveys[id] == null ? "" : sum.surveys[id]),
        sum.surveys.d1am != null && sum.surveys.d2pm != null ? sum.surveys.d2pm - sum.surveys.d1am : ""]);
    }));
    const csv = rows.map(r => r.map(c => /[",\n]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : c).join(",")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
    a.download = `reset-program-records-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
  }

  // ---------------------------------------------------------------- one student's record
  function renderStudent() {
    if (!student) { app().innerHTML = `<div class="page"><div class="card empty"><p>That student has been deleted.</p><button class="btn" data-back>All students</button></div></div>`; $("[data-back]").onclick = () => show({ name: "all" }); return; }
    const st = student, list = visitsNewestFirst(st), active = list.find(v => v.active);
    app().innerHTML = `
      <div class="page">
        <div class="page-head">
          <div>
            <button class="link-btn" data-back>← ${view.from === "board" ? "In the program" : "All students"}</button>
            <h1>${h(RP.formatCode(st.code))}</h1>
          </div>
          <div class="page-actions">
            <label class="field inline">Year level
              <select data-year><option value="">Not set</option>${[7, 8, 9, 10, 11, 12].map(y => `<option value="${y}"${st.year_level === y ? " selected" : ""}>Year ${y}</option>`).join("")}</select>
            </label>
            ${active ? "" : `<label class="field inline">Today's rotation <select data-rot>${Object.keys(RP.ROTATIONS).map(r => `<option>${r}</option>`).join("")}</select></label>
              <button class="btn primary" data-restart>Start a new program</button>
              ${list.some(v => v.kind !== "followup") ? `<button class="btn" data-followup title="About 4–6 weeks after they go back to class">Start follow-up survey</button>` : ""}`}
            <button class="btn danger" data-delete-student>Delete student</button>
          </div>
        </div>
        <p class="muted">First seen ${RP.formatDate(st.created_at)} · ${list.length} program${list.length === 1 ? "" : "s"}. Written answers appear once a module is finished.</p>
        ${list.length ? list.map(programCard).join("") : `<div class="card empty"><p>No programs yet.</p></div>`}
      </div>`;

    $("[data-back]").onclick = () => show({ name: view.from === "board" ? "board" : "all" });
    $("[data-year]").onchange = async e => { await api.updateStudent(st.id, { year_level: e.target.value ? Number(e.target.value) : null }); reload(); };
    const restart = $("[data-restart]");
    if (restart) restart.onclick = async () => {
      restart.disabled = true;
      const r1 = $("[data-rot]").value, keys = Object.keys(RP.ROTATIONS);
      const r2 = keys[(keys.indexOf(r1) + 1) % keys.length];
      try { const id = await api.startVisit(st.id, RP.buildDay(1, r1).concat(RP.buildDay(2, r2))); show({ name: "plan", visitId: id, from: "student", studentId: st.id }); }
      catch (ex) { restart.disabled = false; failed(ex); }
    };
    const fu = $("[data-followup]");
    if (fu) fu.onclick = async () => {
      if (!confirm(`Open the follow-up survey for ${RP.formatCode(st.code)}? Their code will work again, showing only the survey. Close it from the dashboard when they've done it.`)) return;
      fu.disabled = true;
      try {
        await api.startVisit(st.id, [{ day: 1, slot: 1, kind: "survey", activity: "followup", title: "Follow-up survey" }], { kind: "followup" });
        reload();
      } catch (ex) { fu.disabled = false; alert(ex.message); }
    };
    $("[data-delete-student]").onclick = async () => {
      const typed = prompt(`This permanently deletes ${RP.formatCode(st.code)} and every program and result they have. It can't be undone.\n\nType the code to confirm:`);
      if (typed == null) return;
      if (RP.normaliseCode(typed) !== st.code) { alert("The code didn't match, so nothing was deleted."); return; }
      try {
        await api.deleteStudent(st.id);
        if (laptopCode() === st.code) clearLaptop();
        show({ name: "all" });
      } catch (ex) { failed(ex); }
    };

    app().querySelectorAll("[data-program]").forEach(el => {
      const v = list.find(x => x.id === el.dataset.program);
      const on = (sel, fn) => { const b = el.querySelector(sel); if (b) b.onclick = fn; };
      on("[data-edit]", () => show({ name: "plan", visitId: v.id, from: "student", studentId: st.id }));
      on("[data-certs]", () => show({ name: "print", what: "certs", visitId: v.id, studentId: st.id, from: view.from }));
      on("[data-record]", () => show({ name: "print", what: "record", visitId: v.id, studentId: st.id, from: view.from }));
      on("[data-reopen]", async () => {
        if (!confirm("Reopen this program? Their code will work on the laptops again.")) return;
        try { await api.updateVisit(v.id, { active: true }); reload(); }
        catch (ex) { alert(/unique|duplicate/i.test(ex.message) ? "This student already has a program running. Finish that one first." : ex.message); }
      });
      on("[data-finish]", () => finish(Object.assign({ student: st }, v)));
      on("[data-pause]", () => setPaused(Object.assign({ student: st }, v), !v.paused));
      on("[data-delete-program]", async () => {
        if (!confirm(`Delete the program starting ${RP.formatDate(v.start_date)}? Its plan, ticks and results are removed permanently. The student stays on the list.`)) return;
        try { await api.deleteVisit(v.id); reload(); } catch (ex) { failed(ex); }
      });
    });
  }

  function programCard(v) {
    if (v.kind === "followup") {
      const fs = v.sessions.find(x => x.kind === "survey");
      return `
        <section class="card program" data-program="${v.id}">
          <div class="program-head">
            <h2>Follow-up survey ${RP.formatDate(v.start_date)} ${statusLabel(v)}</h2>
            <div class="page-actions">
              ${v.active ? `<button class="btn small" data-finish>Close follow-up</button>` : ""}
              <button class="btn small danger" data-delete-program>Delete</button>
            </div>
          </div>
          ${fs && fs.status === "done" ? `<p>Score <strong>${fs.result.total}/${fs.result.max || 50}</strong></p>${answerBlock(fs, false)}` : `<p class="muted">Not done yet.</p>`}
        </section>`;
    }
    const sum = summary(v);
    const certDays = [1, 2].filter(d => RP.dayModules(v.sessions, d).length);
    const answered = v.sessions.filter(s => ["independent", "debrief", "intro", "survey"].includes(s.kind) && s.status === "done" && s.state && s.state.responses && s.state.responses.length)
      .sort((a, b) => a.day - b.day || a.slot - b.slot);
    const anyActive = (student.visits || []).some(x => x.active);
    const dayList = day => `
      <div class="record-day">
        <h3>Day ${day}</h3>
        <ol class="record-list">${sessionsFor(v, day).map(s => {
          const t = RP.slotTimes(s.slot, ttOf(v, day));
          return `<li class="${s.status === "done" ? "is-done" : ""}">
            <span class="time">${t ? RP.formatTime(t.start) : "Any time"}</span>
            <span class="r-title">${h(titleOf(s))} <span class="muted">· ${h(RP.kindLabel(s))}</span></span>
            <span class="r-status">${s.status === "done" ? "✓ " : ""}${h(statusText(s))}</span>
          </li>`;
        }).join("")}</ol>
      </div>`;
    return `
      <section class="card program" data-program="${v.id}">
        <div class="program-head">
          <h2>Program starting ${RP.formatDate(v.start_date)} ${statusLabel(v)}</h2>
          <div class="page-actions">
            <button class="btn small primary" data-edit>Edit program</button>
            <button class="btn small" data-certs ${certDays.length ? "" : "disabled"}>Print certificates${certDays.length ? ` (${certDays.length})` : ""}</button>
            <button class="btn small" data-record>Print program record</button>
            ${v.active ? `<button class="btn small" data-pause>${v.paused ? "Resume" : "Pause"}</button><button class="btn small" data-finish>Finish program</button>` : (anyActive ? "" : `<button class="btn small" data-reopen>Reopen</button>`)}
            <button class="btn small danger" data-delete-program>Delete program</button>
          </div>
        </div>
        <div class="program-summary">
          <span><span class="muted">Group modules</span> ${sum.coreDone}/${sum.coreTotal}</span>
          <span><span class="muted">Individual sessions</span> ${h(individualText(sum))}</span>
          <span><span class="muted">Literacy</span> ${h(sum.literacy || "–")}</span>
          ${Object.keys(sum.surveys).length ? `<span><span class="muted">Surveys</span> ${RP.SURVEY_ORDER.filter(id => sum.surveys[id] != null).map(id => `${h(RP.SURVEY_SHORT[id])} <strong>${sum.surveys[id]}</strong>`).join(" · ")}</span>` : ""}
          ${sum.independent.length ? `<span><span class="muted">Independent</span> ${h(sum.independent.join(", "))}</span>` : ""}
        </div>
        ${answered.length ? `<div class="answers">
          <h3>Written answers and surveys</h3>
          ${answered.map(s => `<details class="answer-block"><summary>${h(answerTitle(s))} <span class="muted">· submitted ${RP.formatDate(s.completed_at || s.updated_at)}</span></summary>${RP.worksheetRows(s.state.responses)}</details>`).join("")}
        </div>` : ""}
        <details><summary>Day-by-day</summary><div class="record-days">${dayList(1)}${dayList(2)}</div></details>
      </section>`;
  }

  // ---------------------------------------------------------------- individual sessions
  // Everything the staff member needs for one student's individual session, from what the
  // student has already submitted. Notes are kept in Sentral, not here.
  const responsesOf = (v, pred) => v.sessions.filter(x => x.status === "done" && pred(x) && x.state && x.state.responses && x.state.responses.length)
    .sort((a, b) => a.day - b.day || a.slot - b.slot);
  const surveyIn = (v, id) => v.sessions.find(x => x.status === "done" && RP.surveyResultId(x.result) === id);
  const answerBlock = (s, open) => `<details class="answer-block"${open ? " open" : ""}><summary>${h(answerTitle(s))} <span class="muted">· ${RP.formatDate(s.completed_at || s.updated_at)}</span></summary>${RP.worksheetRows(s.state.responses)}</details>`;
  // Find an answer in a module's responses by the start of its prompt.
  function answerFor(v, activity, prompt) {
    const s = v.sessions.find(x => x.activity === activity && x.status === "done" && x.state && x.state.responses);
    if (!s) return "";
    const want = prompt.replace(/\*\*/g, "");
    for (const sec of s.state.responses) for (const r of sec.rows) if (r.label.replace(/\*\*/g, "").startsWith(want)) return r.text || "";
    return "";
  }

  function renderIndividual() {
    const v = visit, s = v && v.sessions.find(x => x.id === view.sessionId);
    if (!s) { show({ name: "board" }); return; }
    if (watchable(s)) return renderLedModule(v, s);
    const ind = RP.individualSession(s.activity);
    const t = RP.slotTimes(s.slot, ttOf(v, s.day));
    const staff = t && s.day === v.current_day ? staffing[s.slot] : "";
    let info = "";
    const surveys = ids => ids.map(id => surveyIn(v, id)).filter(Boolean);
    const shown = list => list.length ? list.map(x => answerBlock(x, false)).join("") : `<p class="muted">Nothing submitted yet.</p>`;
    // The independent version of a plan, opened first: its answers once the student finishes it.
    const plan = (id, name) => {
      const done = responsesOf(v, x => x.activity === id);
      if (done.length) return `<h3>Their ${h(name)} (independent)</h3>${done.map(x => answerBlock(x, true)).join("")}`;
      const started = v.sessions.find(x => x.activity === id);
      return `<h3>Their ${h(name)} (independent)</h3><p class="muted">${started ? `Not finished yet. Their answers appear here when they finish ${h(name)} on their laptop${started.status === "in_progress" ? " (they've started it)" : ""}.` : `Not on their schedule. Drag the independent ${h(name)} into a session before this one, or go through it together on their laptop.`}</p>`;
    };
    if (s.activity === "ind-review") {
      info = `${plan("reset-plan", "My Reset Plan")}
        <h3>Surveys</h3>${shown(surveys(["d1am", "d1pm"]))}
        <h3>Other module answers</h3>${shown(responsesOf(v, x => ["module-1", "my-chain"].includes(x.activity)))}`;
    } else if (s.activity === "ind-success" || s.activity === "ind-return-meeting") {
      info = `${plan("module-6", "My Return Plan")}
        <h3>Surveys</h3>${shown(surveys(["d1am", "d1pm", "d2am", "d2pm"]))}
        <h3>Other module answers</h3>${shown(responsesOf(v, x => ["reset-plan", "goal-builder", "asking-for-help", "attendance", "my-chain"].includes(x.activity)))}`;
    } else {
      info = `<h3>Surveys</h3>${shown(surveys(RP.SURVEY_ORDER))}`;
    }
    const back = view.from === "board" ? "In the program" : "Plan";
    app().innerHTML = `
      <div class="page">
        <div class="no-print">
          <button class="link-btn" data-back>← ${back}</button>
          <div class="page-head">
            <div>
              <h1>${h(titleOf(s))}</h1>
              <p class="muted">${h(RP.formatCode(v.student.code))}${v.student.year_level ? ` · Year ${v.student.year_level}` : ""} · Day ${s.day}${t ? ` · ${RP.formatTime(t.start)}–${RP.formatTime(t.end)}` : ""}${staff ? ` · with <strong>${h(staff)}</strong>` : ""}</p>
            </div>
            <div class="page-actions"><button class="btn${s.status === "done" ? " ok" : " primary"}" data-tick>${s.status === "done" ? "✓ Done (undo)" : "Mark done"}</button></div>
          </div>
          ${ind && ind.guide ? `<details class="card guide" open><summary><h2>How to run it</h2></summary><div class="guide-body">${RP.md(ind.guide)}</div></details>` : ""}
          <div class="card">${info}</div>
        </div>
        ${s.activity === "ind-success" || s.activity === "ind-return-meeting" ? returnPlan(v) : ""}
      </div>`;
    $("[data-back]").onclick = () => view.from === "board" ? show({ name: "board" }) : show({ name: "plan", visitId: v.id, from: view.from });
    $("[data-tick]").onclick = async () => { await setDone(s, s.status !== "done"); show(view); };
    const rp = $("[data-print-plan]");
    if (rp) bindReturnPlan(rp);
  }

  // The Student Return to Class Plan (the independent My Return Plan module), printed to sign in
  // the teacher-led My Return Plan session and again for the return from suspension meeting. It
  // follows the module's sections and starts from the student's submitted answers; staff can tick,
  // untick and edit it together with the student. Nothing typed here is saved.
  function planBlocks(v) {
    const m = RP.MODULES["module-6"];
    const done = v.sessions.find(x => x.activity === "module-6" && x.status === "done" && x.state && x.state.responses);
    const rows = done ? done.state.responses.flatMap(sec => sec.rows) : [];
    const answer = label => { const r = rows.find(x => x.label === label); return r ? r.text || "" : ""; };
    const blocks = [];
    let section = null, n = 0;
    m.items.forEach(it => {
      if (it.section && it.section !== section) { section = it.section; blocks.push({ type: "heading", text: section }); }
      if (it.type === "write") {
        if (it.q) blocks.push({ type: "note", text: it.q });
        it.prompts.forEach(p => blocks.push({ type: "text", id: "f" + n++, label: p, value: answer(p) }));
      } else if (it.type === "select") {
        const picked = answer(it.q).split("; ").filter(Boolean);
        const other = picked.filter(x => !it.options.includes(x)).join("; ");
        blocks.push({ type: "ticks", id: "f" + n++, label: it.q, options: it.options.map(o => ({ text: o, on: picked.includes(o) })), other: it.other ? other : null });
      }
    });
    return { blocks, submitted: !!done };
  }

  function returnPlan(v) {
    const { blocks, submitted } = planBlocks(v);
    const edit = b => {
      if (b.type === "heading") return `<h3 class="plan-section">${h(b.text)}</h3>`;
      if (b.type === "note") return `<div class="plan-note">${RP.md(b.text)}</div>`;
      if (b.type === "text") return `<label class="field">${RP.inlineMd(b.label)}<textarea rows="2" data-plan-field="${b.id}">${h(b.value)}</textarea></label>`;
      return `<fieldset class="plan-ticks"><legend>${RP.inlineMd(b.label)}</legend>
        ${b.options.map((o, k) => `<label class="field inline"><input type="checkbox" data-plan-tick="${b.id}:${k}"${o.on ? " checked" : ""}> ${h(o.text)}</label>`).join("")}
        ${b.other != null ? `<label class="field inline">Other: <input data-plan-other="${b.id}" value="${h(b.other)}" maxlength="200"></label>` : ""}
      </fieldset>`;
    };
    return `
      <div class="card no-print">
        <h2>Student Return to Class Plan</h2>
        <p class="muted">${submitted ? "Filled in from their My Return Plan answers." : "They haven't submitted My Return Plan yet, so fill it in together."} Go through it together, change anything you agree on, then print it (or save it as a PDF) to sign. <strong>Nothing typed here is saved</strong>, so print it before you leave this page.</p>
        <label class="field">Student's name (for printing only) <input data-plan-name maxlength="40" autocomplete="off"></label>
        ${blocks.map(edit).join("")}
        <div class="actions"><button class="btn primary" data-print-plan>Print to sign</button></div>
      </div>
      <div class="print-area return-plan" data-plan-print></div>`;
  }

  function bindReturnPlan(button) {
    const { blocks } = planBlocks(visit);
    const out = $("[data-plan-print]");
    const name = $("[data-plan-name]");
    const draw = () => {
      out.innerHTML = `
        <div class="ws-head">
          <div><div class="cert-school">Thomas Reddall High School · Reset Program</div><h2>Student Return to Class Plan</h2></div>
          <div class="ws-meta">Name: <strong>${h(name.value.trim()) || "&nbsp;"}</strong><br>${RP.longDate(new Date().toISOString())}</div>
        </div>
        ${blocks.map(b => {
          if (b.type === "heading") return `<h3 class="plan-section">${h(b.text)}</h3>`;
          if (b.type === "note") return `<div class="plan-note">${RP.md(b.text)}</div>`;
          if (b.type === "text") return `<div class="ws-row"><div class="ws-label">${RP.inlineMd(b.label)}</div><div class="ws-answer">${h(b.value) || "&nbsp;"}</div></div>`;
          return `<div class="ws-row"><div class="ws-label">${RP.inlineMd(b.label)}</div><ul class="plan-tick-list">${b.options.map(o => `<li class="${o.on ? "on" : ""}">${o.on ? "☑" : "☐"} ${h(o.text)}</li>`).join("")}${b.other != null ? `<li class="${b.other ? "on" : ""}">${b.other ? "☑" : "☐"} Other: ${h(b.other) || "____________________"}</li>` : ""}</ul></div>`;
        }).join("")}
        <p>I will aim to:</p>
        <ul>${RP.RETURN_PLAN_COMMITMENT.map(x => `<li>${h(x)}</li>`).join("")}</ul>
        <div class="sheet-sign"><span>Student: ______________________</span><span>Staff: ______________________</span><span>Parent/carer: ______________________</span><span>Date: ____________</span></div>
        <p class="cert-motto">"Focusing on our Future"</p>`;
    };
    const byId = id => blocks.find(b => b.id === id);
    name.oninput = draw;
    app().querySelectorAll("[data-plan-field]").forEach(t => t.oninput = () => { byId(t.dataset.planField).value = t.value; draw(); });
    app().querySelectorAll("[data-plan-tick]").forEach(c => c.onchange = () => { const [id, k] = c.dataset.planTick.split(":"); byId(id).options[Number(k)].on = c.checked; draw(); });
    app().querySelectorAll("[data-plan-other]").forEach(t => t.oninput = () => { byId(t.dataset.planOther).other = t.value; draw(); });
    button.onclick = () => { if (!name.value.trim()) { name.focus(); name.classList.add("wrong"); setTimeout(() => name.classList.remove("wrong"), 600); return; } window.print(); };
    draw();
  }

  // ---------------------------------------------------------------- teacher-led modules
  // A teacher-led module (e.g. Understanding Truancy) runs on the student's laptop; this page shows
  // what they're up to and their answers as they type, with a prompt for staff on each activity, a
  // Sentral checklist and a staff check-in to print. Nothing typed on this page is saved.
  const staffCheckins = {}; // by session id, kept while the dashboard is open
  // The module a session runs: an independent module, or a RIOT lesson done on the laptop.
  function moduleFor(s) {
    if (RP.isRiot(s)) {
      const st = s.state || {}, L = RP.riotLesson(st.lesson);
      if (!L) return null;
      return st.format === "pdf" ? { id: L.id, title: `RIOT ${L.fullTitle} (PDF)`, booklet: true, books: [{ subjects: [{ id: "lesson" + L.n, title: L.fullTitle }] }] } : RP.MODULES[L.id];
    }
    return s.kind === "independent" && s.activity ? RP.MODULES[s.activity] || null : null;
  }
  // Sessions staff can follow live: any module on the laptop.
  const watchable = s => !!moduleFor(s) && !(RP.isRiot(s) && (s.state || {}).format === "paper");
  const liveItems = (m, st) => m.levels ? ((m.levels.find(l => l.level === st.level) || { items: [] }).items).map(it => RP.atLevel(it, st.level)) : m.items.filter(it => st.full || !it.extra);
  function ledAnswers(m, s, i) {
    const st = s.state || {}, it = liveItems(m, st)[i];
    const a = (st.draft || {})[i];
    const dash = `<span class="muted">—</span>`;
    if (it.type === "write") return `<div class="live-rows">${it.prompts.map((p, k) => `<div class="ws-row"><div class="ws-label">${RP.inlineMd(p)}</div><div class="ws-answer">${a && a[k] ? h(a[k]) : dash}</div></div>`).join("")}</div>`;
    if (it.type === "select") {
      const picked = a ? a.picked.slice().sort((x, y) => x - y).map(k => it.options[k]).concat(a.other && a.other.trim() ? ["Other: " + a.other.trim()] : []) : [];
      return `<ul class="plan-tick-list">${it.options.map(o => `<li class="${picked.includes(o) ? "on" : ""}">${picked.includes(o) ? "☑" : "☐"} ${h(o)}</li>`).join("")}${picked.filter(x => /^Other: /.test(x)).map(x => `<li class="on">☑ ${h(x)}</li>`).join("")}</ul>`;
    }
    if (["mc", "sort", "order", "match", "input"].includes(it.type)) {
      const ft = (st.firstTry || {})[i];
      return `<p class="${ft === true ? "ok-text" : ft === false ? "warn" : "muted"}">${ft === true ? "✓ Right first time" : ft === false ? "Needed another go (worth talking about)" : "Not answered yet"}</p>`;
    }
    return "";
  }
  function ledLive(v, s) {
    const m = moduleFor(s), st = s.state || {};
    if (s.status === "done") {
      const ok = (s.result && s.result.byTeacher) ? "Marked done by a teacher." : `Finished ${RP.formatDate(s.completed_at || s.updated_at)}.`;
      return `<p class="ok-text">✓ ${h(ok)}</p>${s.state && s.state.responses && s.state.responses.length ? RP.worksheetRows(s.state.responses) : ""}`;
    }
    if (m.booklet) {
      // Suspension Booklet or a RIOT PDF: the subjects they've opened and what they've typed.
      const subs = m.books.flatMap(b => b.subjects).filter(x => (st.subjects || {})[x.id] || (st.draft || {})[x.id]);
      if (!subs.length) return `<p class="muted">They haven't started yet. This page updates as they work.</p>`;
      return subs.map(x => `<h3>${h(x.title)} <span class="tag">${(st.subjects || {})[x.id] === "completed" ? "finished" : "started"}</span></h3>
        ${((st.draft || {})[x.id] || []).filter(r => r.where || r.text).map(r => `<div class="ws-row"><div class="ws-label">${h(r.where || "Answer")}</div><div class="ws-answer">${h(r.text) || "&nbsp;"}</div></div>`).join("") || `<p class="muted">Nothing typed yet.</p>`}`).join("");
    }
    if (s.status === "not_started" || st.index == null) return `<p class="muted">They haven't started yet. On their laptop, they open <strong>${h(m.title)}</strong> from their plan and press Start. This page updates as they work.</p>`;
    const items = liveItems(m, st);
    if (!items.length) return `<p class="muted">They're choosing a level.</p>`;
    const at = Math.min(st.index, items.length - 1);
    return `<p><strong>On page ${at + 1} of ${items.length}${m.levels ? ` (Level ${st.level})` : ""}:</strong> ${h(items[at].title || (items[at].q || "").replace(/\*\*/g, "").slice(0, 80))} <a href="#live-${at}" class="link-btn">Jump to it</a></p>
      <ol class="live-items">${items.map((it, i) => i > st.index ? "" : `
        <li id="live-${i}" class="live-item${i === at ? " current" : ""}">
          <div class="live-title">${h(it.title || "")}${it.q ? `<div class="live-q">${RP.inlineMd(it.q.split("\n\n").pop())}</div>` : ""}</div>
          ${ledAnswers(m, s, i)}
          ${it.talk ? `<p class="live-talk"><strong>Talk about it:</strong> ${RP.inlineMd(it.talk)}</p>` : ""}
        </li>`).join("")}</ol>`;
  }
  function updateLive() {
    const el = $("[data-live]");
    const s = visit && visit.sessions.find(x => x.id === view.sessionId);
    if (!el || !s || !watchable(s)) return false;
    el.innerHTML = ledLive(visit, s);
    $("[data-live-print]").innerHTML = ledLive(visit, s);
    return true;
  }
  function renderLedModule(v, s) {
    const m = moduleFor(s), led = !!m.teacherLed;
    const t = RP.slotTimes(s.slot, ttOf(v, s.day));
    const staff = t && s.day === v.current_day ? staffing[s.slot] : "";
    const c = staffCheckins[s.id] || (staffCheckins[s.id] = { attendance: "", positive: "", negative: "", checkin: "", completed: "" });
    const back = view.from === "board" ? "In the program" : "Daily schedule";
    app().innerHTML = `
      <div class="page">
        <div class="no-print">
          <button class="link-btn" data-back>← ${back}</button>
          <div class="page-head">
            <div>
              <h1>${led ? "Teacher-led: " : ""}${h(m.title)}</h1>
              <p class="muted">${h(RP.formatCode(v.student.code))}${v.student.year_level ? ` · Year ${v.student.year_level}` : ""} · Day ${s.day}${t ? ` · ${RP.formatTime(t.start)}–${RP.formatTime(t.end)}` : ""}${staff ? ` · with <strong>${h(staff)}</strong>` : ""}</p>
            </div>
            <div class="page-actions">${RP.MODULES[m.id] ? `<button class="btn" data-preview="${h(m.id)}">Preview the module</button>` : ""}${led || RP.isRiot(s) ? `<button class="btn${s.status === "done" ? " ok" : " primary"}" data-tick>${s.status === "done" ? "✓ Done (undo)" : "Mark done"}</button>` : ""}</div>
          </div>
          ${m.guide ? `<details class="card guide" open><summary><h2>How to run it</h2></summary><div class="guide-body">${RP.md(m.guide)}</div></details>` : ""}
          <div class="${led ? "led-layout" : ""}">
            <section class="card"><h2>What they're doing <span class="tag">live</span></h2><div data-live>${ledLive(v, s)}</div></section>
            ${led ? `<aside class="card led-staff">
              <h2>Staff check-in</h2>
              <p class="muted small">Not saved: print it, or record it in Sentral.</p>
              <label class="field">Sentral attendance this term <input data-c="attendance" value="${h(c.attendance)}" maxlength="80" placeholder="e.g. 82%, 6 partial absences"></label>
              <label class="field">Positive entries <input data-c="positive" value="${h(c.positive)}" maxlength="120"></label>
              <label class="field">Negative entries <input data-c="negative" value="${h(c.negative)}" maxlength="120"></label>
              <label class="field">Staff check-in <textarea rows="4" data-c="checkin" maxlength="1500">${h(c.checkin)}</textarea></label>
              <fieldset class="plan-ticks"><legend>Module completed</legend>
                <label class="field inline"><input type="radio" name="completed" value="Yes"${c.completed === "Yes" ? " checked" : ""}> Yes</label>
                <label class="field inline"><input type="radio" name="completed" value="Requires further support"${c.completed === "Requires further support" ? " checked" : ""}> Requires further support</label>
              </fieldset>
              <label class="field">Student's name (for printing only) <input data-led-name maxlength="40" autocomplete="off"></label>
              <div class="actions"><button class="btn primary" data-led-print>Print</button></div>
            </aside>` : ""}
          </div>
        </div>
        <div class="print-only led-print">
          <div class="ws-head"><div><div class="cert-school">Thomas Reddall High School · Reset Program</div><h2>${h(m.title)}</h2></div>
            <div class="ws-meta">Name: <strong data-led-name-out>&nbsp;</strong><br>${RP.longDate(new Date().toISOString())}</div></div>
          <div data-live-print>${ledLive(v, s)}</div>
          ${led ? `<h3 class="plan-section">Staff check-in</h3><div data-c-out></div>` : ""}
        </div>
      </div>`;
    const drawStaff = () => {
      if (!led) return;
      $("[data-c-out]").innerHTML = [["Sentral attendance this term", c.attendance], ["Positive entries", c.positive], ["Negative entries", c.negative], ["Staff check-in", c.checkin], ["Module completed", c.completed]]
        .map(([l, x]) => `<div class="ws-row"><div class="ws-label">${h(l)}</div><div class="ws-answer">${h(x) || "&nbsp;"}</div></div>`).join("");
    };
    app().querySelectorAll("[data-c]").forEach(inp => inp.oninput = () => { c[inp.dataset.c] = inp.value; drawStaff(); });
    app().querySelectorAll("input[name=completed]").forEach(r => r.onchange = () => { c.completed = r.value; drawStaff(); });
    const name = $("[data-led-name]");
    if (name) name.oninput = () => { $("[data-led-name-out]").textContent = name.value.trim() || " "; };
    const pr = $("[data-led-print]"); if (pr) pr.onclick = () => window.print();
    $("[data-back]").onclick = () => view.from === "board" ? show({ name: "board" }) : show({ name: "plan", visitId: v.id, from: view.from });
    const tk = $("[data-tick]"); if (tk) tk.onclick = async () => { await setDone(s, s.status !== "done"); show(view); };
    app().querySelectorAll("[data-preview]").forEach(b => b.onclick = () => previewModule(b.dataset.preview));
    drawStaff();
  }

  // ---------------------------------------------------------------- run sheet
  // Who's staffing each session, and what every student is doing, for printing.
  function renderRunsheet(date, staff) {
    const progs = visits.filter(v => v.kind !== "followup");
    const isToday = date === todayIso();
    const cell = (v, slot) => {
      if (v.paused) return `<td class="muted">Paused</td>`;
      const x = at(v, v.current_day, slot);
      if (!x) return "<td></td>";
      const own = RP.slotTimes(slot, ttOf(v, v.current_day)), usual = RP.slotTimes(slot);
      const moved = own && usual && own.start !== usual.start ? `<span class="muted">${RP.formatTime(own.start)}</span> ` : "";
      return `<td class="rs-${x.kind}">${moved}${h(x.kind === "one_to_one" ? ledTitle(x) : titleOf(x))}</td>`;
    };
    app().innerHTML = `
      <div class="page wide runsheet-page">
        <div class="page-head">
          <div><h1>Run sheet</h1><p class="muted no-print">Type who's running each session. It saves as you go. Students are shown as they are today.</p></div>
          <div class="page-actions no-print">
            <label class="field inline">Date <input type="date" data-date value="${date}"></label>
            <button class="btn primary" data-print-rs>Print</button>
          </div>
        </div>
        <div class="print-only"><strong>Reset Program run sheet · ${RP.formatDate(date)}</strong></div>
        ${api.needsUpdate ? `<div class="card warn-card"><p>Staffing can't be saved until <code>supabase/update-2.sql</code> has been run in Supabase.</p></div>` : ""}
        <div class="table-wrap"><table class="records runsheet">
          <thead><tr><th>Time</th><th>Staff</th>${progs.map(v => `<th>${h(RP.formatCode(v.student.code))}<br><span class="muted">Day ${v.current_day}</span></th>`).join("")}</tr></thead>
          <tbody>${RP.TIMETABLE.map(t => t.brk
            ? `<tr class="rs-break"><td>${RP.formatTime(t.start)}</td><td colspan="${progs.length + 1}">${h(t.brk)}</td></tr>`
            : `<tr><td class="rs-time">${RP.formatTime(t.start)}–${RP.formatTime(t.end)}</td>
                <td><input class="rs-staff" data-staff="${t.slot}" value="${h(staff[t.slot] || "")}" maxlength="80" placeholder="Staff member" aria-label="Staff for ${RP.formatTime(t.start)}"><span class="print-only">${h(staff[t.slot] || "")}</span></td>
                ${progs.map(v => cell(v, t.slot)).join("")}</tr>`).join("")}</tbody>
        </table></div>
        ${progs.length ? "" : `<p class="muted">No students in the program right now.</p>`}
        ${isToday ? "" : `<p class="muted">Showing ${RP.formatDate(date)}. Student plans are shown as they are today.</p>`}
      </div>`;
    $("[data-date]").onchange = e => show({ name: "runsheet", date: e.target.value || todayIso() });
    $("[data-print-rs]").onclick = () => window.print();
    let timers = {};
    app().querySelectorAll("[data-staff]").forEach(inp => inp.oninput = () => {
      const slot = Number(inp.dataset.staff);
      inp.nextElementSibling.textContent = inp.value;
      clearTimeout(timers[slot]);
      timers[slot] = setTimeout(async () => {
        try { await api.setStaffing(date, slot, inp.value.trim()); inp.classList.add("saved"); setTimeout(() => inp.classList.remove("saved"), 800); if (isToday) staffing[slot] = inp.value.trim(); }
        catch (ex) { alert(ex.message); }
      }, 500);
    });
  }

  // ---------------------------------------------------------------- reports
  const reportFilter = { from: "", to: "" };
  function programsInRange() {
    const out = [];
    allStudents.forEach(st => (st.visits || []).filter(v => v.kind !== "followup").forEach(v => {
      if (reportFilter.from && v.start_date < reportFilter.from) return;
      if (reportFilter.to && v.start_date > reportFilter.to) return;
      const fu = (st.visits || []).filter(x => x.kind === "followup").map(x => surveyIn(x, "followup")).filter(Boolean)[0];
      out.push({ st, v, fu });
    }));
    return out.sort((a, b) => a.v.start_date.localeCompare(b.v.start_date));
  }
  const mean = xs => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
  const fmt = (x, d = 1) => x == null ? "–" : (Math.round(x * 10 ** d) / 10 ** d).toString();

  function reportData() {
    const rows = programsInRange().map(r => {
      const res = {};
      RP.SURVEY_ORDER.forEach(id => { const x = id === "followup" ? r.fu : surveyIn(r.v, id); if (x) res[id] = x; });
      return Object.assign(r, { res });
    });
    const both = rows.filter(r => r.res.d1am && r.res.d2pm);
    const perQ = RP.SURVEY_STATEMENTS.map((q, k) => {
      const pre = mean(both.map(r => r.res.d1am.result.ratings[k]).filter(Boolean));
      const post = mean(both.map(r => r.res.d2pm.result.ratings[k]).filter(Boolean));
      return { q, pre, post, change: pre != null && post != null ? post - pre : null };
    });
    const avgBy = id => mean(rows.map(r => r.res[id] && r.res[id].result.total).filter(x => x != null));
    const answersTo = (id, prompt) => rows.map(r => r.res[id] && r.res[id].state && r.res[id].state.responses)
      .filter(Boolean).flatMap(secs => secs.flatMap(sec => sec.rows)).filter(x => x.label === prompt && x.text).map(x => x.text);
    return {
      rows, both, perQ, avgBy,
      pre: mean(both.map(r => r.res.d1am.result.total)), post: mean(both.map(r => r.res.d2pm.result.total)),
      completedPrograms: rows.filter(r => !r.v.active).length,
      helpful: answersTo("d2pm", "Which part of the program was most helpful to you?"),
      support: answersTo("d2pm", "What additional support, if any, would help you at school?")
    };
  }

  function renderReports() {
    const d = reportData();
    const improved = d.perQ.filter(x => x.change != null).sort((a, b) => b.change - a.change).slice(0, 3);
    const pct = d.rows.length ? Math.round(100 * d.both.length / d.rows.length) : 0;
    app().innerHTML = `
      <div class="page">
        <div class="page-head">
          <h1>Reports</h1>
          <div class="page-actions no-print">
            <button class="btn" data-dl-summary>Download summary</button>
            <button class="btn" data-dl-responses>Download all survey responses</button>
            <button class="btn primary" data-print-report>Print</button>
          </div>
        </div>
        <form class="card filters no-print" onsubmit="return false">
          <label class="field">Programs started from <input type="date" name="from" value="${h(reportFilter.from)}"></label>
          <label class="field">to <input type="date" name="to" value="${h(reportFilter.to)}"></label>
          <span class="muted">Use the term's start and end dates for a term report.</span>
        </form>
        <div class="stat-grid">
          <div class="stat"><div class="stat-num">${d.rows.length}</div><div class="stat-label">programs started</div></div>
          <div class="stat"><div class="stat-num">${d.completedPrograms}</div><div class="stat-label">finished</div></div>
          <div class="stat"><div class="stat-num">${pct}%</div><div class="stat-label">did the first and last survey (${d.both.length})</div></div>
          <div class="stat"><div class="stat-num">${fmt(d.pre)} → ${fmt(d.post)}</div><div class="stat-label">average score out of 50, Day 1 start → Day 2 end</div></div>
          <div class="stat"><div class="stat-num">${d.pre != null ? (d.post - d.pre >= 0 ? "+" : "") + fmt(d.post - d.pre) : "–"}</div><div class="stat-label">average change</div></div>
        </div>
        <div class="card">
          <h2>Average score by survey</h2>
          <p>${RP.SURVEY_ORDER.map(id => `${h(RP.SURVEY_SHORT[id])}: <strong>${fmt(d.avgBy(id))}</strong> <span class="muted">(${d.rows.filter(r => r.res[id]).length})</span>`).join(" · ")}</p>
          <p class="muted">Scores are self-reported confidence and understanding. A higher score doesn't by itself prove behaviour has changed; look at attendance and further suspensions too.</p>
        </div>
        <div class="card">
          <h2>Change per question <span class="muted">(students who did both the Day 1 start and Day 2 end surveys)</span></h2>
          ${improved.length ? `<p>Most improved: ${improved.map(x => `<strong>${h(x.q)}</strong> (${x.change >= 0 ? "+" : ""}${fmt(x.change)})`).join("; ")}</p>` : ""}
          <div class="table-wrap"><table class="records"><thead><tr><th>Statement</th><th>Day 1 start</th><th>Day 2 end</th><th>Change</th></tr></thead>
          <tbody>${d.perQ.map((x, k) => `<tr><td>${k + 1}. ${h(x.q)}</td><td>${fmt(x.pre)}</td><td>${fmt(x.post)}</td><td>${x.change == null ? "–" : (x.change >= 0 ? "+" : "") + fmt(x.change)}</td></tr>`).join("")}</tbody></table></div>
        </div>
        <div class="card">
          <h2>Each student</h2>
          <div class="table-wrap"><table class="records"><thead><tr><th>Code</th><th>Year</th><th>Started</th>${RP.SURVEY_ORDER.map(id => `<th>${h(RP.SURVEY_SHORT[id])}</th>`).join("")}<th>Change</th></tr></thead>
          <tbody>${d.rows.map(r => `<tr data-student="${r.st.id}"><td class="code-cell">${h(RP.formatCode(r.st.code))}</td><td>${r.st.year_level || ""}</td><td>${RP.formatDate(r.v.start_date)}</td>
            ${RP.SURVEY_ORDER.map(id => `<td>${r.res[id] ? r.res[id].result.total : ""}</td>`).join("")}
            <td>${r.res.d1am && r.res.d2pm ? (r.res.d2pm.result.total - r.res.d1am.result.total >= 0 ? "+" : "") + (r.res.d2pm.result.total - r.res.d1am.result.total) : ""}</td></tr>`).join("")}</tbody></table></div>
        </div>
        <div class="card">
          <h2>Most helpful part of the program</h2>
          ${d.helpful.length ? `<ul>${d.helpful.map(x => `<li>${h(x)}</li>`).join("")}</ul>` : `<p class="muted">No answers yet.</p>`}
          <h2>Additional support students asked for</h2>
          ${d.support.length ? `<ul>${d.support.map(x => `<li>${h(x)}</li>`).join("")}</ul>` : `<p class="muted">No answers yet.</p>`}
        </div>
      </div>`;
    const form = app().querySelector(".filters");
    ["from", "to"].forEach(k => form[k].onchange = () => { reportFilter[k] = form[k].value; renderReports(); });
    app().querySelectorAll("[data-student]").forEach(tr => tr.onclick = () => show({ name: "student", studentId: tr.dataset.student, from: "all" }));
    $("[data-print-report]").onclick = () => window.print();
    $("[data-dl-summary]").onclick = () => {
      const rows = [["Measure", "Value"],
        ["Programs started", d.rows.length], ["Programs finished", d.completedPrograms],
        ["Did Day 1 start and Day 2 end surveys", d.both.length], ["% did both", pct + "%"],
        ["Average score Day 1 start (/50)", fmt(d.pre)], ["Average score Day 2 end (/50)", fmt(d.post)],
        ["Average change", d.pre != null ? fmt(d.post - d.pre) : ""],
        ...RP.SURVEY_ORDER.map(id => [`Average score ${RP.SURVEY_SHORT[id]} (/50)`, fmt(d.avgBy(id))]),
        [], ["Statement", "Day 1 start", "Day 2 end", "Change"],
        ...d.perQ.map(x => [x.q, fmt(x.pre, 2), fmt(x.post, 2), x.change == null ? "" : fmt(x.change, 2)]),
        [], ["Most helpful part of the program"], ...d.helpful.map(x => [x]),
        [], ["Additional support students asked for"], ...d.support.map(x => [x])];
      downloadRows(rows, `reset-program-report-${reportFilter.from || "all"}-to-${reportFilter.to || todayIso()}.csv`);
    };
    $("[data-dl-responses]").onclick = () => {
      const prompts = [...new Set(RP.SURVEY_ORDER.flatMap(id => RP.SURVEYS[id].items.filter(it => it.type === "write").flatMap(it => it.prompts)))];
      const rows = [["Code", "Year level", "Program start", "Survey", "Completed", "Total (/50)", ...RP.SURVEY_STATEMENTS.map((q, k) => `Q${k + 1} ${q}`), ...prompts]];
      d.rows.forEach(r => RP.SURVEY_ORDER.forEach(id => {
        const x = r.res[id]; if (!x) return;
        const written = {};
        (x.state && x.state.responses || []).forEach(sec => sec.rows.forEach(row => { written[row.label] = row.text; }));
        rows.push([RP.formatCode(r.st.code), r.st.year_level || "", r.v.start_date, RP.SURVEY_SHORT[id], (x.completed_at || x.updated_at || "").slice(0, 10), x.result.total,
          ...RP.SURVEY_STATEMENTS.map((q, k) => x.result.ratings[k] || ""), ...prompts.map(p => written[p] || "")]);
      }));
      downloadRows(rows, `reset-program-survey-responses-${todayIso()}.csv`);
    };
  }

  function downloadRows(rows, filename) {
    const csv = rows.map(r => r.map(c => /[",\n]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : c).join(",")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
    a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
  }

  // ---------------------------------------------------------------- present view
  // A group session's slides on the projector, with a countdown timer for the staff member.
  // A RIOT lesson is presented as "riot:N", in a theme like the original RIOT slides.
  function presentable(id) {
    const m = /^riot:(\d)$/.exec(id || "");
    if (m) { const L = RP.riotLesson(m[1]); return L && { title: `RIOT ${L.fullTitle}`, slides: L.slides, riot: true }; }
    return RP.groupSession(id);
  }
  function riotSlide(sl) {
    if (sl.cover) return `<div class="riot-cover"><div class="riot-badge">RESILIENCE<br>IN OUR<br>TEENS</div><h1>${h(sl.title)}</h1><p>${h(sl.points[0])}</p></div>`;
    if (sl.intentions) return `<h1>${h(sl.title)}</h1><div class="riot-cols"><div><h2>Students will:</h2><ul>${sl.points.map(p => `<li>${RP.inlineMd(p)}</li>`).join("")}</ul></div><div><h2>Success criteria. Students will be able to:</h2><ul>${sl.criteria.map(p => `<li>${RP.inlineMd(p)}</li>`).join("")}</ul></div></div>`;
    return `<h1>${h(sl.title)}</h1>
      ${sl.boxes ? `<div class="riot-boxes">${sl.points.map(p => `<div class="riot-box">${RP.inlineMd(p)}</div>`).join("")}</div>`
        : sl.points && sl.points.length ? `<ul class="${sl.activity ? "riot-activity" : ""}">${sl.points.map((p, i) => `<li${sl.activity && i === 0 ? ` class="riot-q"` : ""}>${RP.inlineMd(p)}</li>`).join("")}</ul>` : ""}
      ${sl.note ? `<p class="present-note">${RP.inlineMd(sl.note)}</p>` : ""}`;
  }
  function showPresent(id) {
    const g = presentable(id);
    if (!g || !g.slides) return;
    let k = 0, left = 0, ticking = null;
    const box = document.createElement("div");
    box.className = "present" + (g.riot ? " riot-theme" : "");
    document.body.appendChild(box);
    const draw = () => {
      const sl = g.slides[k];
      const mm = String(Math.floor(left / 60)).padStart(1, "0"), ss = String(left % 60).padStart(2, "0");
      box.innerHTML = `
        <div class="present-top">
          <span class="present-brand">${RP.logo(44, "#ffffff")}<span>${h(g.title)}</span></span>
          <span class="present-timer${left && left <= 60 ? " soon" : ""}">${left ? `${mm}:${ss}` : ""}
            <button data-t="300">+5 min</button><button data-t="60">+1 min</button><button data-t="0">${ticking ? "Stop" : "Clear"}</button></span>
          <span>${k + 1} / ${g.slides.length} <button data-close>Close ✕</button></span>
        </div>
        <div class="present-slide">${g.riot ? riotSlide(sl) : `
          <h1>${h(sl.title)}</h1>
          ${sl.points && sl.points.length ? `<ul>${sl.points.map(p => `<li>${RP.inlineMd(p)}</li>`).join("")}</ul>` : ""}
          ${sl.note ? `<p class="present-note">${RP.inlineMd(sl.note)}</p>` : ""}`}
        </div>
        <div class="present-nav"><button data-prev ${k === 0 ? "disabled" : ""}>← Back</button><span class="present-motto">${g.riot ? "RIOT · Resilience in our Teens · " : ""}"Focusing on our Future"</span><button data-next ${k === g.slides.length - 1 ? "disabled" : ""}>Next →</button></div>`;
      box.querySelector("[data-prev]").onclick = () => { if (k > 0) { k--; draw(); } };
      box.querySelector("[data-next]").onclick = () => { if (k < g.slides.length - 1) { k++; draw(); } };
      box.querySelector("[data-close]").onclick = close;
      box.querySelectorAll("[data-t]").forEach(b => b.onclick = () => {
        const add = Number(b.dataset.t);
        if (!add) { clearInterval(ticking); ticking = null; left = 0; draw(); return; }
        left += add;
        if (!ticking) ticking = setInterval(() => { left = Math.max(0, left - 1); if (!left) { clearInterval(ticking); ticking = null; } draw(); }, 1000);
        draw();
      });
    };
    const keys = e => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { if (k < g.slides.length - 1) { k++; draw(); } e.preventDefault(); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { if (k > 0) { k--; draw(); } e.preventDefault(); }
      if (e.key === "Escape") close();
    };
    function close() {
      clearInterval(ticking);
      document.removeEventListener("keydown", keys);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      box.remove();
    }
    document.addEventListener("keydown", keys);
    draw();
    if (box.requestFullscreen) box.requestFullscreen().catch(() => {});
  }

  // ---------------------------------------------------------------- session guides
  function renderGuides() {
    const when = id => Object.keys(RP.ROTATIONS).map(r => {
      const slot = Object.keys(RP.ROTATIONS[r]).find(k => RP.ROTATIONS[r][k] === id);
      return slot ? `Rotation ${r}, ${RP.formatTime(RP.slotTimes(Number(slot)).start)}` : null;
    }).filter(Boolean).join(" · ");
    const guide = (title, tags, about, body, actions) => `
      <details class="card guide">
        <summary><h2>${h(title)}</h2> ${tags}</summary>
        ${actions ? `<div class="actions no-print">${actions}</div>` : ""}
        ${about ? `<p class="guide-about"><strong>Students see:</strong> ${RP.inlineMd(about)}</p>` : ""}
        <div class="guide-body">${RP.md(body || "No guide yet.")}</div>
      </details>`;
    // RIOT: every lesson's run sheet, slides and condensed worksheet.
    const riotGuide = (g, when) => `
      <details class="card guide">
        <summary><h2>${h(g.title)}</h2> <span class="tag core">core</span> ${when ? `<span class="tag">${h(when)}</span>` : ""} <span class="tag">8 lessons</span></summary>
        <p class="guide-about"><strong>Students see:</strong> ${RP.inlineMd(g.about)}</p>
        <div class="guide-body">${RP.md(g.guide)}</div>
        ${RP.RIOT.map(L => `
          <section class="riot-lesson">
            <h3>${h(L.fullTitle)}</h3>
            <div class="actions no-print">
              <button class="btn small primary" data-present="riot:${L.n}">Present the slides</button>
              <a class="btn small" href="riot-worksheet.html?lesson=${L.n}" target="_blank" rel="noopener">Print worksheet</a>
              <a class="btn small" href="${RP.riotPdf(L.n)}" target="_blank" rel="noopener">Worksheet PDF</a>
              <button class="btn small" data-preview="${L.id}">Try it on the laptop</button>
            </div>
            <details><summary><strong>Run sheet (25 minutes)</strong></summary><div class="guide-body">${RP.md(L.guide)}</div></details>
            <details><summary><strong>Slides</strong> <span class="muted">(${L.slides.length})</span></summary><ol class="riot-slide-list">${L.slides.map(sl => `<li>${h(sl.title)}</li>`).join("")}</ol></details>
            <details><summary><strong>Worksheet</strong></summary>${RP.riotWorksheetMarkup(L)}</details>
          </section>`).join("")}
      </details>`;
    app().innerHTML = `
      <div class="page narrow">
        <div class="page-head"><h1>Session guides</h1><div class="page-actions"><button class="btn" data-print-guides>Print all</button></div></div>
        <div class="card">
          <p>Every day is made of <strong>modules</strong>. <strong>Group modules</strong> are run by one staff member with up to five students, laptops closed. <strong>Individual modules</strong> are either <strong>independent</strong> (on the laptop, at the student's own pace) or <strong>teacher-led</strong> (one-on-one with a staff member).</p>
        </div>
        <details class="card guide" open>
          <summary><h2>The Thomas Reddall Lesson Routine</h2> <span class="tag">every group module</span></summary>
          <p>Every group module follows these eight steps in about 31 minutes. Use made-up examples; never ask a student to share their own incident in front of the group. Tick the module done for everyone on the dashboard when it ends.</p>
          <ol class="routine">${RP.LESSON_ROUTINE.map(r => `<li><strong>${h(r.step)}.</strong> ${h(r.does)} <span class="muted">Purpose: ${h(r.purpose)}</span></li>`).join("")}</ol>
          <div class="guide-body">${RP.md(RP.SCHOOL_COMMITMENT)}</div>
          <p class="no-print"><a href="img/lesson-routine.jpg" target="_blank" rel="noopener">Open the lesson routine poster</a></p>
        </details>
        <h2 class="section-title">Group modules</h2>
        ${RP.GROUP_SESSIONS.filter(g => !g.movement && !g.retired).map(g => g.riot ? riotGuide(g, when(g.id)) : guide(g.title,
          `${g.core ? `<span class="tag core">core</span>` : ""} ${when(g.id) ? `<span class="tag">${h(when(g.id))}</span>` : `<span class="tag">not in a rotation</span>`}`, g.about, g.guide,
          g.slides ? `<button class="btn small" data-present="${g.id}">Present on the projector</button>` : "")).join("")}
        <h2 class="section-title">Teacher-led sessions</h2>
        <div class="card"><p>Drag these into an empty session on a student's daily schedule. The other students keep working on their own. You can only be with one student at a time, so the daily schedule and dashboard warn you about clashes.</p></div>
        ${(RP.INDIVIDUAL_SESSIONS || []).map(x => guide(x.title, x.day ? `<span class="tag">Day ${x.day}</span>` : `<span class="tag">Either day</span>`, x.about, x.guide)).join("")}
        ${ledModules().map(m => guide(m.title, `<span class="tag">Either day</span> <span class="tag">on the student's laptop</span>`, m.about, m.guide, `<button class="btn small" data-preview="${h(m.id)}">Preview the module</button>`)).join("")}
        <h2 class="section-title">Independent modules</h2>
        <div class="card"><p>Students do these on the laptop. Click one to see every page and question, with the answers.</p>
          <div class="module-list">${electives().map(m => `<button class="btn small" data-preview="${h(m.id)}">${m.icon ? m.icon + " " : ""}${h(m.title)}</button>`).join("")}</div></div>
        <h2 class="section-title">Movement breaks</h2>
        <div class="card"><p>Every group module has a brain break built in. Use these when students need a break at other times.</p></div>
        ${RP.GROUP_SESSIONS.filter(g => g.movement).map(g => guide(g.title.replace(/^Movement:\s*/, ""), "", "", g.guide)).join("")}
      </div>`;
    $("[data-print-guides]").onclick = () => { app().querySelectorAll("details.guide").forEach(d => d.open = true); window.print(); };
    app().querySelectorAll("[data-present]").forEach(b => b.onclick = () => showPresent(b.dataset.present));
    app().querySelectorAll("[data-preview]").forEach(b => b.onclick = () => previewModule(b.dataset.preview));
  }

  // A pop-up showing an independent module two ways: running exactly as students see it (nothing
  // is saved), and as a list of every page and question with the answers.
  function previewModule(id, tab) {
    const m = RP.MODULES[id];
    if (!m) return;
    const box = document.createElement("dialog");
    box.className = "preview-dialog";
    box.innerHTML = `
      <div class="preview-head">
        <h2>${m.icon ? m.icon + " " : ""}${h(m.title)}</h2>
        <div class="preview-tabs" role="tablist">
          <button class="btn small" data-tab="try" role="tab">Try it as a student</button>
          <button class="btn small" data-tab="list" role="tab">Questions and answers</button>
        </div>
        <button class="btn ghost" data-close>Close ✕</button>
      </div>
      <p class="muted small preview-note" data-preview-note>Preview: this is what students see. Nothing is saved, and Save and close closes the preview.</p>
      <div class="preview-body" data-preview-body></div>`;
    document.body.appendChild(box);
    const body = box.querySelector("[data-preview-body]");
    const show = which => {
      RP.speech.stop();
      box.querySelectorAll("[data-tab]").forEach(b => { const on = b.dataset.tab === which; b.classList.toggle("primary", on); b.setAttribute("aria-selected", on); });
      box.querySelector("[data-preview-note]").hidden = which === "list";
      if (which === "list") { body.className = "preview-body"; body.innerHTML = RP.previewModule(m); return; }
      body.className = "preview-body preview-try";
      let saved = {};
      const restart = () => show("try");
      RP.Player.open({
        el: body, module: m, session: { id: "preview", status: "not_started", state: null },
        answers: { get: () => saved, set: a => { saved = a; } },
        save: () => {},
        onExit: () => box.close(),
        onFinish: (result, state, worksheet) => RP.Player.finished(body, Object.assign({ title: m.title, date: RP.longDate(new Date().toISOString()), worksheet, justFinished: true }, result), restart)
      });
    };
    box.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => show(b.dataset.tab));
    box.querySelector("[data-close]").onclick = () => box.close();
    box.addEventListener("close", () => { RP.speech.stop(); box.remove(); });
    box.addEventListener("click", e => { if (e.target === box) box.close(); });
    box.showModal();
    show(tab || "try");
  }

  // ---------------------------------------------------------------- printing
  function renderPrint() {
    const v = student && (student.visits || []).find(x => x.id === view.visitId);
    if (!v) { show({ name: "all" }); return; }
    // One certificate per day; written answers from that day's independent modules can go after it.
    const certs = [1, 2].map(day => {
      const done = v.sessions.filter(s => s.day === day && s.status === "done");
      const first = done.map(s => s.completed_at || s.updated_at).filter(Boolean).sort()[0];
      return { id: "day" + day, day, modules: RP.dayModules(v.sessions, day), date: RP.longDate(first || v.start_date),
        answers: done.filter(s => s.kind === "independent" && s.state && s.state.responses && s.state.responses.length).sort((a, b) => a.slot - b.slot) };
    }).filter(c => c.modules.length);
    const isCerts = view.what === "certs";
    app().innerHTML = `
      <div class="page print-page">
        <div class="card no-print">
          <button class="link-btn" data-back>← Back to ${h(RP.formatCode(student.code))}</button>
          <h1>${isCerts ? "Print certificates" : "Print program record"}</h1>
          <label class="field">Student's name <input data-name maxlength="40" autocomplete="off"></label>
          <p class="muted">The name is only used for printing. It isn't saved.</p>
          ${isCerts && certs.some(c => c.answers.length) ? `<label class="field inline"><input type="checkbox" data-with-answers checked> Include their written answers after each certificate</label>` : ""}
          ${isCerts ? `<div class="cert-picks">${certs.map(c => `<label class="field inline"><input type="checkbox" data-pick="${c.id}" checked> Day ${c.day} <span class="muted">(${c.modules.length} module${c.modules.length === 1 ? "" : "s"})</span></label>`).join("")}</div>` : ""}
          <div class="actions"><button class="btn primary" data-print>Print or save as PDF</button></div>
        </div>
        <div class="print-area">
          ${isCerts ? certs.map(c => `<div class="print-cert" data-cert="${c.id}">${RP.dayCertificateMarkup(c)}${c.answers.map(s => `<div class="print-answers">${RP.worksheetMarkup({ title: titleOf(s), date: RP.longDate(s.completed_at || s.updated_at), worksheet: s.state.responses })}</div>`).join("")}</div>`).join("")
            : recordSheet(v)}
        </div>
      </div>`;
    $("[data-back]").onclick = () => show({ name: "student", studentId: student.id, from: view.from });
    const name = $("[data-name]");
    name.oninput = () => app().querySelectorAll("[data-cert-name], [data-record-name], [data-ws-name]").forEach(e => { e.textContent = name.value.trim() || " "; });
    const withAnswers = $("[data-with-answers]");
    if (withAnswers) withAnswers.onchange = () => app().querySelectorAll(".print-answers").forEach(e => { e.hidden = !withAnswers.checked; });
    name.focus();
    app().querySelectorAll("[data-pick]").forEach(c => c.onchange = () => { app().querySelector(`[data-cert="${c.dataset.pick}"]`).hidden = !c.checked; });
    $("[data-print]").onclick = () => {
      if (!name.value.trim()) { name.focus(); name.classList.add("wrong"); setTimeout(() => name.classList.remove("wrong"), 600); return; }
      window.print();
    };
  }

  function recordSheet(v) {
    const sum = summary(v);
    const day = d => `
      <table class="sheet-table">
        <thead><tr><th colspan="3">Day ${d}</th></tr></thead>
        <tbody>${sessionsFor(v, d).map(s => {
          const t = RP.slotTimes(s.slot, ttOf(v, d));
          return `<tr><td>${t ? RP.formatTime(t.start) : "Any time"}</td><td>${h(titleOf(s))}<br><span class="muted">${h(RP.kindLabel(s))}</span></td><td>${s.status === "done" ? "✓ " : ""}${h(statusText(s))}</td></tr>`;
        }).join("")}</tbody>
      </table>`;
    const missing = RP.missingCore(v.sessions);
    return `
      <div class="record-sheet">
        <div class="ws-head">
          <div><div class="cert-school">Thomas Reddall High School · Reset Program</div><h2>Program record</h2></div>
          <div class="ws-meta">Name: <strong data-record-name>&nbsp;</strong><br>Code: ${h(RP.formatCode(student.code))}${student.year_level ? ` · Year ${student.year_level}` : ""}<br>Program started ${RP.formatDate(v.start_date)}${v.active ? "" : " · finished"}</div>
        </div>
        <div class="sheet-summary">
          <div><strong>Group modules:</strong> ${sum.coreDone} of ${sum.coreTotal}${missing.length ? ` (not done: ${h(missing.map(g => g.title).join(", "))})` : ""}</div>
          <div><strong>Independent sessions completed:</strong> ${sum.independent.length ? h(sum.independent.join(", ")) : "none"}</div>
          <div><strong>Literacy:</strong> ${h(sum.literacy || "not completed")}</div>
          <div><strong>Teacher-led sessions:</strong> ${sum.ones} of ${sum.onesPlanned} done</div>
          ${Object.keys(sum.surveys).length ? `<div><strong>Surveys (out of 50):</strong> ${RP.SURVEY_ORDER.filter(id => sum.surveys[id] != null).map(id => `${h(RP.SURVEY_SHORT[id])} ${sum.surveys[id]}`).join(" · ")}</div>` : ""}
        </div>
        <div class="sheet-days">${day(1)}${day(2)}</div>
        <div class="sheet-sign"><span>Teacher: ______________________</span><span>Signature: ______________________</span><span>Date: ____________</span></div>
      </div>`;
  }

  // ---------------------------------------------------------------- plan editor
  function rotationOf(v, day) {
    const groups = {};
    sessionsFor(v, day).forEach(s => { if (s.kind === "group") groups[s.slot] = s.activity; });
    const match = Object.keys(RP.ROTATIONS).find(r => JSON.stringify(RP.ROTATIONS[r]) === JSON.stringify(groups));
    return match || "custom";
  }

  function renderPlan() {
    if (!visit) { app().innerHTML = `<div class="page"><p>That program has ended.</p></div>`; return; }
    const v = visit;
    const chip = (type, id, title, extra) => `<button class="chip t-${type}${pick && pick.type === type && pick.id === id ? " picked" : ""}" draggable="true" data-type="${type}" data-id="${h(id)}">${h(title)}${extra || ""}</button>`;
    const missing = RP.missingCore(v.sessions);

    app().innerHTML = `
      <div class="page wide">
        <div class="page-head">
          <div>
            <button class="link-btn" data-back>← ${view.from === "student" ? "Student record" : "In the program"}</button>
            <h1>${h(RP.formatCode(v.student.code))} ${v.student.year_level ? `<span class="muted">· Year ${v.student.year_level}</span>` : ""} ${v.active ? "" : `<span class="tag done-tag">Finished program</span>`}</h1>
          </div>
          <div class="page-actions">
            <label class="field inline">Today is their
              <select data-current>${[1, 2].map(d => `<option value="${d}"${v.current_day === d ? " selected" : ""}>Day ${d}</option>`).join("")}</select>
            </label>
            <button class="btn" data-record-page>Student record</button>
            ${v.active ? `<button class="btn" data-laptop>Student view on this laptop</button><button class="btn danger" data-finish>Finish program</button>` : `<button class="btn" data-reopen>Reopen program</button>`}
          </div>
        </div>
        <h2 class="schedule-title">Daily schedule</h2>
        <p class="muted">${pick ? `<strong>Click a session to place “${h(pick.title)}”.</strong> <button class="link-btn" data-unpick>Cancel</button>` : "Drag a module onto a session, or click a module and then click a session. 👁 shows what's in a module."}
          ${missing.length ? ` <span class="warn">Core group modules not done yet: ${missing.map(g => h(g.title)).join(", ")}.</span>` : ""}</p>
        ${planWarnings(v)}
        <div class="plan-layout">
          <aside class="palette">
            <h3>Individual: independent <span class="muted">(on the laptop)</span></h3>
            ${electives().map(m => `<div class="chip-row">${chip("elective", m.id, m.title, m.sample ? ` <span class="tag">sample</span>` : "")}<button class="chip-view" data-preview="${h(m.id)}" title="See what's in ${h(m.title)}" aria-label="Preview ${h(m.title)}">👁</button></div>`).join("")}
            <h3>Individual: teacher-led <span class="muted">(with a staff member)</span></h3>
            ${(RP.INDIVIDUAL_SESSIONS || []).map(x => chip("individual", x.id, x.title, x.day ? ` <span class="tag">Day ${x.day}</span>` : "")).join("")}
            ${ledModules().map(m => `<div class="chip-row">${chip("elective", m.id, m.title)}<button class="chip-view" data-preview="${h(m.id)}" title="See what's in ${h(m.title)}" aria-label="Preview ${h(m.title)}">👁</button></div>`).join("")}
            <h3>Group modules <span class="muted">(change only if you need to)</span></h3>
            ${RP.GROUP_SESSIONS.filter(g => !g.movement && !g.retired).map(g => chip("group", g.id, g.title, g.core ? ` <span class="tag core">core</span>` : g.optional ? ` <span class="tag">optional</span>` : "")).join("")}
            <h3>Other</h3>
            ${chip("custom", "custom", "Other (type what it is)")}
            ${chip("morning", "morning", "Morning session (check-in)")}
            ${chip("debrief", "debrief", "Afternoon debrief (survey)")}
            ${chip("free", "free", "Free choice")}
            ${chip("clear", "clear", "Empty (choose later)")}
          </aside>
          <div class="plan-days">${[1, 2].map(day => planDay(v, day)).join("")}</div>
        </div>
      </div>`;

    const record = () => show({ name: "student", studentId: v.student.id, from: "all" });
    $("[data-back]").onclick = () => view.from === "student" ? record() : show({ name: "board" });
    $("[data-record-page]").onclick = record;
    const lap = $("[data-laptop]"); if (lap) lap.onclick = () => toStudentView(v.student.code);
    const fin = $("[data-finish]"); if (fin) fin.onclick = () => finish(v);
    const reo = $("[data-reopen]");
    if (reo) reo.onclick = async () => {
      if (!confirm("Reopen this program? Their code will work on the laptops again.")) return;
      try { await api.updateVisit(v.id, { active: true }); reload(); }
      catch (ex) { alert(/unique|duplicate/i.test(ex.message) ? "This student already has a program running. Finish that one first." : ex.message); }
    };
    $("[data-current]").onchange = async e => { await api.updateVisit(v.id, { current_day: Number(e.target.value) }); reload(); };
    const un = $("[data-unpick]"); if (un) un.onclick = () => { pick = null; renderPlan(); };

    // Palette: drag, or click to pick.
    app().querySelectorAll(".chip").forEach(c => {
      const item = { type: c.dataset.type, id: c.dataset.id, title: c.textContent.replace(/\s*(sample|core|optional)\s*$/i, "").trim() };
      c.ondragstart = e => { dragging = true; e.dataTransfer.setData("text/plain", JSON.stringify(item)); e.dataTransfer.effectAllowed = "copy"; };
      c.ondragend = () => { dragging = false; };
      c.onclick = () => { pick = pick && pick.type === item.type && pick.id === item.id ? null : item; renderPlan(); };
    });

    // Session slots: drop targets.
    app().querySelectorAll("[data-drop]").forEach(el => {
      const [day, slot] = el.dataset.drop.split(":").map(Number);
      el.ondragover = e => { e.preventDefault(); el.classList.add("over"); };
      el.ondragleave = () => el.classList.remove("over");
      el.ondrop = e => {
        e.preventDefault(); el.classList.remove("over"); dragging = false;
        try { place(day, slot, JSON.parse(e.dataTransfer.getData("text/plain"))); } catch (ex) { /* not one of ours */ }
      };
      el.onclick = e => { if (pick && !e.target.closest("button, select")) place(day, slot, pick); };
    });

    app().querySelectorAll("[data-tick]").forEach(b => b.onclick = async () => {
      const s = v.sessions.find(s => s.id === b.dataset.tick);
      b.disabled = true; await setDone(s, s.status !== "done"); reload();
    });
    app().querySelectorAll("[data-preview]").forEach(b => b.onclick = e => { e.stopPropagation(); previewModule(b.dataset.preview); });
    app().querySelectorAll(".plan-days [data-present]").forEach(b => b.onclick = e => { e.stopPropagation(); showPresent(b.dataset.present); });
    app().querySelectorAll("[data-riot-lesson], [data-riot-format]").forEach(sel => sel.onchange = () => setRiot(v, sel));
    app().querySelectorAll("[data-open-ind]").forEach(b => b.onclick = () => show({ name: "individual", visitId: v.id, sessionId: b.dataset.openInd, from: view.from }));
    app().querySelectorAll("[data-mark]").forEach(b => b.onclick = async () => {
      const s = v.sessions.find(s => s.id === b.dataset.mark);
      if (!confirm(`Mark "${titleOf(s)}" as done? Use this if they completed it another way, such as on paper.`)) return;
      b.disabled = true;
      await api.updateSession(s.id, { status: "done", completed_at: new Date().toISOString(), result: Object.assign({}, s.result || {}, { byTeacher: true }) });
      reload();
    });
    app().querySelectorAll("[data-reset]").forEach(b => b.onclick = async () => {
      const s = v.sessions.find(s => s.id === b.dataset.reset);
      if (!confirm(`Let them start "${titleOf(s)}" again? Their progress, result and written answers for it will be cleared.`)) return;
      await api.updateSession(s.id, { status: "not_started", result: null, state: null, completed_at: null }); reload();
    });
    app().querySelectorAll("[data-full]").forEach(sel => sel.onchange = async () => {
      const s = v.sessions.find(s => s.id === sel.dataset.full);
      const st = Object.assign({}, s.state || {});
      if (sel.value) st.full = true; else delete st.full;
      await api.updateSession(s.id, { state: Object.keys(st).length ? st : null }); reload();
    });
    app().querySelectorAll("[data-level]").forEach(sel => sel.onchange = async () => {
      const s = v.sessions.find(s => s.id === sel.dataset.level);
      await api.updateSession(s.id, { state: sel.value ? { level: Number(sel.value) } : null }); reload();
    });
    app().querySelectorAll("[data-apply]").forEach(b => b.onclick = () => applyRotation(Number(b.dataset.apply), b.previousElementSibling.value));
    app().querySelectorAll("[data-times]").forEach(b => b.onclick = () => editTimes(v, Number(b.dataset.times)));
  }

  function planWarnings(v) {
    const notes = [];
    const clash = v.active ? clashes(v) : {};
    Object.keys(clash).forEach(slot => notes.push(`Today's teacher-led session at ${RP.formatTime(RP.slotTimes(Number(slot), ttOf(v, v.current_day)).start)} clashes with ${clash[slot].join(", ")}. You can only be with one student at a time.`));
    [1, 2].forEach(day => missingIndividual(v, day).forEach(x => notes.push(`Day ${day} doesn't have the teacher-led "${x.title}" session yet. Drag it into an empty session.`)));
    return notes.length ? `<div class="card warn-card">${notes.map(n => `<p>⚠ ${h(n)}</p>`).join("")}</div>` : "";
  }

  function planDay(v, day) {
    const tt = ttOf(v, day), now = RP.currentSlot(tt);
    const rot = rotationOf(v, day);
    const rows = tt.map(t => {
      if (t.brk) return `<li class="plan-brk"><span class="time">${RP.formatTime(t.start)}</span>${h(t.brk)}</li>`;
      const s = at(v, day, t.slot);
      return s ? slotRow(s, t, day === v.current_day && now === t.slot) : "";
    }).join("");
    const one = at(v, day, RP.ONE_TO_ONE_SLOT);
    return `
      <section class="plan-day${day === v.current_day ? " today" : ""}">
        <div class="plan-day-head">
          <h2>Day ${day}${day === v.current_day ? ` <span class="tag">Today</span>` : ""}</h2>
          <span class="field inline small">Group modules
            <select>${Object.keys(RP.ROTATIONS).map(r => `<option value="${r}"${r === rot ? " selected" : ""}>Rotation ${r}</option>`).join("")}${rot === "custom" ? `<option value="custom" selected>Custom</option>` : ""}</select>
            <button class="btn small" data-apply="${day}">Apply</button>
          </span>
          <button class="btn small${v.times && v.times[day] ? " changed" : ""}" data-times="${day}" title="Change this day's session times">${v.times && v.times[day] ? "⏱ Changed times" : "⏱ Times"}</button>
        </div>
        <ol class="plan-list">${rows}</ol>
        ${one ? slotRow(one, null, false) : ""}
      </section>`;
  }

  function slotRow(s, t, isNow) {
    const fixed = s.slot === RP.ONE_TO_ONE_SLOT;
    const m = s.kind === "independent" && s.activity && RP.MODULES[s.activity];
    let controls = "";
    if (RP.isRiot(s)) {
      const st = s.state || {}, fmt = st.format || "paper";
      controls = `<select class="small" data-riot-lesson="${s.id}" aria-label="RIOT lesson"><option value="">Choose the lesson</option>${RP.RIOT.map(L => `<option value="${L.n}"${st.lesson === L.n ? " selected" : ""}>${h(L.fullTitle)}</option>`).join("")}</select>
        <select class="small" data-riot-format="${s.id}" aria-label="Worksheet format">${RP.RIOT_FORMATS.map(f => `<option value="${f.id}"${fmt === f.id ? " selected" : ""}${f.id !== "paper" && api.needsUpdate3 ? " disabled" : ""}>${h(f.label)}${f.id !== "paper" && api.needsUpdate3 ? " (needs database update 3)" : ""}</option>`).join("")}</select>
        ${st.lesson ? `<button class="btn small" data-present="riot:${st.lesson}">Present</button>` : ""}
        ${st.lesson && fmt !== "paper" && s.status !== "not_started" ? `<button class="btn small" data-open-ind="${s.id}">Answers</button>` : ""}`;
    }
    if (teacherTicks(s)) {
      controls += `${s.kind === "one_to_one" ? `<button class="btn small" data-open-ind="${s.id}">Open</button>` : ""}<button class="btn small${s.status === "done" ? " ok" : ""}" data-tick="${s.id}">${s.status === "done" ? "✓ Done" : "Mark done"}</button>`;
    } else if (m) {
      controls = `${m.teacherLed ? `<button class="btn small" data-open-ind="${s.id}">Open</button>` : s.status !== "not_started" ? `<button class="btn small" data-open-ind="${s.id}" title="See their answers as they go">Answers</button>` : ""}<button class="btn small" data-preview="${h(m.id)}" title="See what's in this module" aria-label="View module">👁</button>`;
      if (s.status === "not_started" && m.items && m.items.some(it => it.extra)) {
        controls += `<select class="small" data-full="${s.id}" aria-label="Version"><option value="">Standard version</option><option value="1"${s.state && s.state.full ? " selected" : ""}>Full version (${m.items.filter(it => it.extra).length} extra page${m.items.filter(it => it.extra).length > 1 ? "s" : ""})</option></select>`;
      }
      if (s.status === "not_started" && m.levels) {
        const lv = s.state && s.state.level;
        controls += `<select class="small" data-level="${s.id}" aria-label="Suggested level"><option value="">Level: student picks</option>${m.levels.map(l => `<option value="${l.level}"${lv === l.level ? " selected" : ""}>Suggest ${h(l.title)}${l.staff ? ` (${h(l.staff.replace(/, from.*$/, ""))})` : ""}</option>`).join("")}</select>`;
      }
      if (s.status !== "done") controls += `<button class="btn small" data-mark="${s.id}" title="For example, if they did it on paper">Mark done</button>`;
      if (s.status !== "not_started") controls += `<button class="btn small" data-reset="${s.id}">Let them redo</button>`;
    }
    return `
      <li class="plan-slot k-${s.kind}${isNow ? " now" : ""}${fixed ? " fixed" : " droppable"}${pick && !fixed ? " pickable" : ""}" ${fixed ? "" : `data-drop="${s.day}:${s.slot}"`}>
        <span class="time">${t ? RP.formatTime(t.start) : "Any time"}</span>
        <span class="slot-text">
          <span class="slot-title">${h(titleOf(s))}</span>
          <span class="slot-kind">${h(RP.kindLabel(s))} · ${h(statusText(s))}</span>
        </span>
        <span class="slot-controls">${controls}</span>
      </li>`;
  }

  // Change a day's session times (e.g. Tuesday's shorter bell times, or a shorter session). Saved
  // with the student's program; the student's laptop and the dashboard use them.
  function editTimes(v, day) {
    const presets = RP.TIMETABLE_PRESETS || [];
    const box = document.createElement("dialog");
    box.className = "times-dialog";
    const rowsHtml = tt => tt.map((t, i) => `<tr><td>${t.brk ? h(t.brk) : `Session ${t.slot}`}</td>
      <td><input type="time" data-start="${i}" value="${t.start}" required></td><td><input type="time" data-end="${i}" value="${t.end}" required></td></tr>`).join("");
    box.innerHTML = `
      <form method="dialog" data-times-form>
        <h2>Day ${day} times</h2>
        <p class="muted">Change when each session starts and ends, for example on a day with shorter bell times. The student's laptop follows these times.</p>
        <div class="actions">${["Normal times"].concat(presets.map(p => p.name)).map((n, k) => `<button type="button" class="btn small" data-preset="${k}">${h(n)}</button>`).join("")}</div>
        <table class="records times-table"><thead><tr><th></th><th>Starts</th><th>Ends</th></tr></thead><tbody data-rows>${rowsHtml(ttOf(v, day))}</tbody></table>
        ${day === v.current_day ? `<label class="field inline"><input type="checkbox" data-everyone> Use these times for everyone else in the program today too</label>` : ""}
        <p class="error" aria-live="polite"></p>
        <div class="actions"><button class="btn primary" type="submit">Save</button><button class="btn ghost" type="button" data-cancel>Cancel</button></div>
      </form>`;
    document.body.appendChild(box);
    const err = box.querySelector(".error");
    box.querySelectorAll("[data-preset]").forEach(b => b.onclick = () => {
      const k = Number(b.dataset.preset);
      box.querySelector("[data-rows]").innerHTML = rowsHtml(k === 0 ? RP.TIMETABLE : presets[k - 1].times);
    });
    box.querySelector("[data-cancel]").onclick = () => box.close();
    box.addEventListener("close", () => box.remove());
    box.querySelector("[data-times-form]").onsubmit = async e => {
      e.preventDefault();
      const tt = RP.TIMETABLE.map((t, i) => Object.assign({}, t, { start: box.querySelector(`[data-start="${i}"]`).value, end: box.querySelector(`[data-end="${i}"]`).value }));
      for (let i = 0; i < tt.length; i++) {
        if (!tt[i].start || !tt[i].end || RP.toMinutes(tt[i].start) >= RP.toMinutes(tt[i].end)) { err.textContent = `Check ${tt[i].brk || "Session " + tt[i].slot}: it has to start before it ends.`; return; }
        if (i && RP.toMinutes(tt[i].start) < RP.toMinutes(tt[i - 1].end)) { err.textContent = `${tt[i].brk || "Session " + tt[i].slot} starts before the one before it ends.`; return; }
      }
      const normal = JSON.stringify(tt.map(t => [t.start, t.end])) === JSON.stringify(RP.TIMETABLE.map(t => [t.start, t.end]));
      const withDay = (times, d) => { const out = Object.assign({}, times || {}); if (normal) delete out[d]; else out[d] = tt; return Object.keys(out).length ? out : null; };
      try {
        await api.updateVisit(v.id, { times: withDay(v.times, day) });
        const all = box.querySelector("[data-everyone]");
        if (all && all.checked) for (const o of visits.filter(o => o.id !== v.id && o.kind !== "followup")) await api.updateVisit(o.id, { times: withDay(o.times, o.current_day) });
        box.close();
        [visit, visits] = await Promise.all([api.getVisit(visit.id), api.listActive()]); renderPlan();
      } catch (ex) { err.textContent = ex.message; }
    };
    box.showModal();
  }

  // Choose a RIOT lesson or worksheet format, and offer the same to the other students in that
  // RIOT session today.
  async function setRiot(v, sel) {
    const s = v.sessions.find(x => x.id === (sel.dataset.riotLesson || sel.dataset.riotFormat));
    const st = Object.assign({ format: "paper" }, s.state || {});
    const key = sel.dataset.riotLesson ? "lesson" : "format";
    const value = key === "lesson" ? (sel.value ? Number(sel.value) : null) : sel.value;
    let patch = { state: Object.assign({}, st, { [key]: value }) };
    if (s.status !== "not_started") {
      if (!confirm(`They've already started this RIOT lesson. Change it? Their progress on it will be cleared.`)) { renderPlan(); return; }
      patch = { status: "not_started", result: null, completed_at: null, state: { lesson: patch.state.lesson, format: patch.state.format } };
    }
    try {
      await api.updateSession(s.id, patch);
      const others = s.day === v.current_day ? visits.filter(o => o.id !== v.id && !o.paused && o.kind !== "followup")
        .map(o => at(o, o.current_day, s.slot)).filter(x => x && RP.isRiot(x) && x.status === "not_started") : [];
      const L = RP.riotLesson(patch.state.lesson), f = RP.RIOT_FORMATS.find(x => x.id === patch.state.format);
      if (others.length && L && confirm(`Use ${L.fullTitle} (${f.label}) for the other ${others.length} student${others.length > 1 ? "s" : ""} with RIOT at ${RP.formatTime(RP.slotTimes(s.slot, ttOf(v, s.day)).start)} today?`)) {
        for (const x of others) await api.updateSession(x.id, { state: Object.assign({}, x.state || {}, { lesson: patch.state.lesson, format: patch.state.format }) });
      }
      [visit, visits] = await Promise.all([api.getVisit(visit.id), api.listActive()]); renderPlan();
    } catch (ex) { failed(ex); }
  }

  async function place(day, slot, item) {
    const s = at(visit, day, slot);
    if (!s || slot === RP.ONE_TO_ONE_SLOT) return;
    let patch, moveFrom = null;
    if (item.type === "elective") patch = { kind: "independent", activity: item.id, title: RP.MODULES[item.id].title };
    else if (item.type === "group") patch = { kind: "group", activity: item.id, title: RP.groupSession(item.id).title };
    else if (item.type === "individual") patch = { kind: "one_to_one", activity: item.id, title: RP.individualSession(item.id).title };
    else if (item.type === "free") patch = { kind: "free", activity: null, title: "Free choice" };
    else if (item.type === "custom") {
      const name = prompt("What will this session be? Students will see this and be told they won't need their laptop.", RP.isCustom(s) ? s.title : "");
      if (name == null || !name.trim()) { pick = null; renderPlan(); return; }
      patch = { kind: "free", activity: "custom", title: name.trim().slice(0, 80) };
    }
    else if (item.type === "morning" || item.type === "debrief") {
      // Move the morning session (social story, check-in and survey), e.g. for a late arrival, or
      // the afternoon debrief (survey), e.g. for a return meeting at the end of the day.
      const kind = item.type === "morning" ? "intro" : "debrief", name = item.type === "morning" ? "morning session" : "afternoon debrief";
      patch = { kind, activity: null, title: item.type === "morning" ? "Morning session" : "Afternoon debrief" };
      moveFrom = visit.sessions.find(x => x.day === day && x.kind === kind && x.slot !== slot) || null;
      const T = x => RP.formatTime(RP.slotTimes(x, ttOf(visit, day)).start);
      if (moveFrom && !confirm(`Move the ${name} from ${T(moveFrom.slot)} to ${T(slot)} on Day ${day}? ${T(moveFrom.slot)} will become empty.` +
        (moveFrom.status !== "not_started" ? `\n\nThey've already started the ${name} survey; it will start again.` : ""))) { pick = null; renderPlan(); return; }
    }
    else patch = { kind: "independent", activity: null, title: "Empty" };
    if (s.kind === patch.kind && s.activity === patch.activity && !RP.isCustom(patch)) { pick = null; renderPlan(); return; }
    if (s.kind === "debrief" && patch.kind !== "debrief" && !visit.sessions.some(x => x.day === day && x.kind === "debrief" && x.id !== s.id) &&
      !confirm(`This replaces the afternoon debrief (end-of-day survey and certificate) on Day ${day}. To keep it, drag "Afternoon debrief" to another time first.\n\nReplace it anyway?`)) { pick = null; renderPlan(); return; }
    if (s.kind === "intro" && patch.kind !== "intro" && !visit.sessions.some(x => x.day === day && x.kind === "intro" && x.id !== s.id) &&
      !confirm(`This replaces the morning session (check-in and survey) on Day ${day}. To keep it, drag "Morning session" to a later time first.\n\nReplace it anyway?`)) { pick = null; renderPlan(); return; }
    // Group modules follow the room's rotation, so changing one needs a second check.
    if (s.kind === "group" || patch.kind === "group") {
      const t = RP.slotTimes(slot, ttOf(visit, day));
      const what = s.kind === "group" ? `This replaces the group module "${titleOf(s)}" at ${RP.formatTime(t.start)} on Day ${day} with "${patch.kind === "independent" && !patch.activity ? "Empty" : patch.title}".`
        : `This puts the group module "${patch.title}" at ${RP.formatTime(t.start)} on Day ${day}, replacing "${titleOf(s)}".`;
      if (!confirm(`Are you sure? ${what}\n\nGroup modules follow the room's rotation, so only change one if you need to.`)) { pick = null; renderPlan(); return; }
    }
    if (s.status !== "not_started" && !confirm(`"${titleOf(s)}" has already been started. Replace it? Its progress will be cleared.`)) return;
    Object.assign(patch, { status: "not_started", result: null, state: null, completed_at: null });
    pick = null;
    try {
      if (moveFrom) await api.updateSession(moveFrom.id, { kind: "independent", activity: null, title: "Empty", status: "not_started", result: null, state: null, completed_at: null });
      await api.updateSession(s.id, patch); [visit, visits] = await Promise.all([api.getVisit(visit.id), api.listActive()]); renderPlan(); }
    catch (ex) { failed(ex); }
  }

  async function applyRotation(day, rotation) {
    if (!RP.ROTATIONS[rotation]) return;
    const target = RP.buildDay(day, rotation);
    const changes = [];
    for (const row of target) {
      if (row.slot === RP.FIRST_SLOT || row.slot === RP.LAST_SLOT || row.slot === RP.ONE_TO_ONE_SLOT) continue;
      const s = at(visit, day, row.slot);
      if (!s) continue;
      if (row.kind === "group" && (s.kind !== "group" || s.activity !== row.activity)) changes.push([s, row]);
      if (row.kind !== "group" && s.kind === "group") changes.push([s, row]);
    }
    if (!changes.length) return;
    const started = changes.filter(([s]) => s.status !== "not_started");
    if (!confirm(`Use Rotation ${rotation} group sessions for Day ${day}? ${changes.length} session${changes.length > 1 ? "s" : ""} will change.` +
      (started.length ? `\n\nThis clears progress on: ${started.map(([s]) => titleOf(s)).join(", ")}.` : ""))) return;
    try {
      for (const [s, row] of changes) {
        await api.updateSession(s.id, { kind: row.kind, activity: row.activity, title: row.title, status: "not_started", result: null, state: null, completed_at: null });
      }
      visit = await api.getVisit(visit.id); renderPlan();
    } catch (ex) { failed(ex); }
  }

  // ---------------------------------------------------------------- start
  document.addEventListener("keydown", e => { if (e.key === "Escape" && pick) { pick = null; renderPlan(); } });
  setInterval(() => { if (view.name === "board" || view.name === "plan") reload(); }, 30000);
  setInterval(() => { if (view.name === "individual" && document.querySelector("[data-live]")) reload(); }, 8000); // follow a teacher-led module
  if (api.demo) $("#demo-banner").hidden = false;
  (async () => {
    try { if (await api.isStaff()) enter(); else renderLogin(); }
    catch (ex) { renderLogin(); }
  })();
})();
