/* Teacher dashboard: create student codes, plan each student's two days, and follow progress live. */
(function () {
  const api = RP.connect(true);
  const h = RP.h;
  const $ = s => document.querySelector(s);
  const app = () => $("#app");
  const electives = () => Object.values(RP.MODULES);

  let view = { name: "board" };
  let visits = [];         // active visits on the board
  let visit = null;        // visit open in the plan editor
  let allStudents = [];    // everyone, for the All students list
  let student = null;      // student open on their record page
  const filters = { q: "", year: "", status: "", from: "" };
  let pick = null;         // palette item chosen for click-to-place
  let dragging = false;
  let unsubscribe = null;

  // ---------------------------------------------------------------- login
  function renderLogin(message) {
    $("#nav").innerHTML = "";
    app().innerHTML = `
      <div class="entry">
        <form class="entry-card" data-login>
          ${RP.sunburst(96, "#2e7fd1")}
          <h1>Teacher login</h1>
          <label class="field">School email <input type="email" name="email" autocomplete="username" required></label>
          <label class="field">Password <input type="password" name="password" autocomplete="current-password" required></label>
          <label class="field inline small"><input type="checkbox" data-show-pw> Show password</label>
          <button class="btn primary big" type="submit">Log in</button>
          <p class="error" aria-live="polite">${h(message || "")}</p>
          <p class="muted small"><a href="index.html">Back to the student view</a></p>
        </form>
      </div>`;
    const form = $("[data-login]");
    form.email.focus();
    $("[data-show-pw]").onchange = e => { form.password.type = e.target.checked ? "text" : "password"; };
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
      ${laptop ? `<span class="laptop-note">This laptop: ${h(RP.formatCode(laptop))} <button class="link-btn" data-clear-laptop>Clear</button></span>` : ""}
      <span class="laptop-note" data-who></span>
      <button class="nav-btn lock" data-lock>Lock</button>`;
    api.currentEmail().then(email => { const w = $("[data-who]"); if (w && email) w.textContent = email; }).catch(() => {});
    $("#nav").querySelectorAll("[data-nav]").forEach(b => b.onclick = () => show({ name: b.dataset.nav }));
    $("[data-lock]").onclick = async () => { await api.signOut(); if (unsubscribe) unsubscribe(); unsubscribe = null; renderLogin(); };
    const clear = $("[data-clear-laptop]");
    if (clear) clear.onclick = () => { clearLaptop(); renderNav(); };
    $("#nav").querySelectorAll("[data-nav]").forEach(b => b.classList.toggle("active", b.dataset.nav === view.name ||
      (["plan", "student", "print"].includes(view.name) && b.dataset.nav === (view.from === "board" ? "board" : "all"))));
  }

  function laptopCode() { try { return JSON.parse(localStorage.getItem("rp-code")); } catch (e) { return null; } }
  function clearLaptop() {
    ["rp-code", "rp-plan-cache", "rp-outbox", "rp-cert"].forEach(k => localStorage.removeItem(k));
    Object.keys(localStorage).filter(k => k.startsWith("rp-answers:")).forEach(k => localStorage.removeItem(k));
  }

  // ---------------------------------------------------------------- routing and live updates
  async function show(v) {
    view = v; pick = null;
    renderNav();
    try {
      if (v.name === "board") { visits = await api.listActive(); renderBoard(); }
      else if (v.name === "plan") { visit = await api.getVisit(v.visitId); renderPlan(); }
      else if (v.name === "new") renderNew();
      else if (v.name === "all") { allStudents = await api.listAll(); renderAll(); }
      else if (v.name === "student") { student = await api.getStudent(v.studentId); renderStudent(); }
      else if (v.name === "print") { student = await api.getStudent(v.studentId); renderPrint(); }
    } catch (ex) { failed(ex); }
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
      if (view.name === "board") { visits = await api.listActive(); renderBoard(); }
      else if (view.name === "plan") { visit = await api.getVisit(view.visitId); renderPlan(); }
      else if (view.name === "student") { student = await api.getStudent(view.studentId); renderStudent(); }
    } catch (ex) { /* try again on the next change or poll */ }
  }

  // ---------------------------------------------------------------- helpers
  const sessionsFor = (v, day) => v.sessions.filter(s => s.day === day).sort((a, b) => a.slot - b.slot);
  const at = (v, day, slot) => v.sessions.find(s => s.day === day && s.slot === slot);
  const titleOf = s => s.kind === "independent" && s.activity && RP.MODULES[s.activity] ? RP.MODULES[s.activity].title : s.title;
  const teacherTicks = s => ["intro", "group", "debrief", "one_to_one"].includes(s.kind);

  function statusText(s) {
    if (s.kind === "independent" && !s.activity) return "Not chosen yet";
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
    const helpCount = visits.filter(v => v.help_requested_at).length;
    document.title = (helpCount ? `(${helpCount}) ` : "") + "Teacher | Reset Program";

    // One click to tick the current whole-group or group session for everyone.
    let bulk = "";
    if (typeof now === "number") {
      const due = visits.map(v => at(v, v.current_day, now)).filter(s => s && ["intro", "group", "debrief"].includes(s.kind) && s.status !== "done");
      if (due.length) {
        const names = [...new Set(due.map(titleOf))].join(" / ");
        bulk = `<button class="btn primary" data-bulk>Tick “${h(names)}” done for ${due.length} student${due.length > 1 ? "s" : ""}</button>`;
      }
    }

    app().innerHTML = `
      <div class="page">
        <div class="page-head">
          <h1>Students in the program</h1>
          <div class="page-actions">${bulk}<button class="btn" data-go-new>New student</button></div>
        </div>
        ${visits.length ? `<div class="board">${visits.map(card).join("")}</div>` :
          `<div class="card empty"><p>No students in the program right now.</p><button class="btn primary" data-go-new>Add a new student</button> <button class="btn" data-go-lookup>Find a returning student</button></div>`}
      </div>`;

    app().querySelectorAll("[data-go-new]").forEach(b => b.onclick = () => show({ name: "new" }));
    const gl = $("[data-go-lookup]"); if (gl) gl.onclick = () => show({ name: "all" });
    const bb = $("[data-bulk]");
    if (bb) bb.onclick = async () => {
      bb.disabled = true;
      for (const v of visits) {
        const s = at(v, v.current_day, now);
        if (s && ["intro", "group", "debrief"].includes(s.kind) && s.status !== "done") await setDone(s, true);
      }
      reload();
    };

    app().querySelectorAll("[data-card]").forEach(el => {
      const v = visits.find(v => v.id === el.dataset.card);
      el.querySelector("[data-plan]").onclick = () => show({ name: "plan", visitId: v.id, from: "board" });
      el.querySelector("[data-record-page]").onclick = () => show({ name: "student", studentId: v.student.id, from: "board" });
      const help = el.querySelector("[data-clear-help]");
      if (help) help.onclick = async () => { await api.updateVisit(v.id, { help_requested_at: null }); reload(); };
      const d2 = el.querySelector("[data-day2]");
      if (d2) d2.onclick = async () => { if (confirm(`Move ${RP.formatCode(v.student.code)} to Day 2?`)) { await api.updateVisit(v.id, { current_day: 2 }); reload(); } };
      el.querySelector("[data-laptop]").onclick = () => toStudentView(v.student.code);
      el.querySelector("[data-finish]").onclick = () => finish(v);
      el.querySelectorAll("[data-tick]").forEach(b => b.onclick = async () => {
        const s = v.sessions.find(s => s.id === b.dataset.tick);
        b.disabled = true; await setDone(s, s.status !== "done"); reload();
      });
    });
  }

  function card(v) {
    const now = RP.currentSlot();
    const day = sessionsFor(v, v.current_day);
    const mini = day.filter(s => s.slot <= RP.LAST_SLOT).map(s => {
      const t = RP.slotTimes(s.slot);
      const icon = s.status === "done" ? "✓" : s.status === "in_progress" ? "•" : "";
      return `<span class="mini k-${s.kind} st-${s.status}${now === s.slot ? " now" : ""}" title="${h(RP.formatTime(t.start) + " " + titleOf(s) + ": " + statusText(s))}">${icon}</span>`;
    }).join("");
    const cur = typeof now === "number" ? at(v, v.current_day, now) : null;
    const one = at(v, v.current_day, RP.ONE_TO_ONE_SLOT);
    const finished = v.sessions.filter(s => s.kind === "independent" && s.status === "done");
    const missing = RP.missingCore(v.sessions);
    return `
      <article class="stu-card${v.help_requested_at ? " needs-help" : ""}" data-card="${v.id}">
        ${v.help_requested_at ? `<div class="help-banner">Needs help <button class="btn small" data-clear-help>Clear</button></div>` : ""}
        <header>
          <div class="code">${h(RP.formatCode(v.student.code))}</div>
          <div class="muted">${v.student.year_level ? "Year " + v.student.year_level + " · " : ""}<strong>Day ${v.current_day}</strong></div>
        </header>
        <div class="mini-day" aria-label="Today's sessions">${mini}</div>
        <div class="now-line">${cur ? `<span class="muted">Now:</span> ${h(titleOf(cur))} <span class="muted">· ${h(statusText(cur))}</span>
          ${teacherTicks(cur) ? `<button class="btn small" data-tick="${cur.id}">${cur.status === "done" ? "Undo tick" : "Tick done"}</button>` : ""}` :
          `<span class="muted">${typeof now === "object" && now.brk ? h(now.brk) : "Outside program hours"}</span>`}</div>
        ${one ? `<div class="row"><span>1:1 (Day ${v.current_day})</span> <button class="btn small${one.status === "done" ? " ok" : ""}" data-tick="${one.id}">${one.status === "done" ? "✓ Done" : "Mark done"}</button></div>` : ""}
        ${finished.length ? `<div class="row results"><span class="muted">Finished:</span> ${finished.map(s => `${h(titleOf(s))}${s.result && RP.resultText(s.result) ? ` <span class="muted">(${h(RP.resultText(s.result))})</span>` : ""}`).join(", ")}</div>` : ""}
        <div class="row core">${missing.length ? `<span class="muted">Core still to do:</span> ${missing.map(g => h(g.title)).join(", ")}` : `<span class="ok-text">✓ All core group sessions done</span>`}</div>
        <footer>
          <button class="btn primary small" data-plan>Plan &amp; ticks</button>
          <button class="btn small" data-record-page>Record</button>
          ${v.current_day === 1 ? `<button class="btn small" data-day2>Move to Day 2</button>` : ""}
          <button class="btn small" data-laptop>Student view on this laptop</button>
          <button class="btn small danger" data-finish>Finish program</button>
        </footer>
      </article>`;
  }

  async function finish(v) {
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
          <p class="muted">Their Day 1 uses today's rotation and Day 2 uses the other one, so they get every group session. You can change any session afterwards.</p>
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
          <div class="actions"><button class="btn primary big" data-setup>Set up their plan</button></div>
        </div>
      </div>`;
    $("[data-setup]").onclick = () => show({ name: "plan", visitId, from: "board" });
  }

  // ---------------------------------------------------------------- summaries
  const isModule = a => /^module-\d+$/.test(a || "");
  const latestVisit = st => (st.visits || []).slice().sort((a, b) => b.start_date.localeCompare(a.start_date) || b.created_at.localeCompare(a.created_at))[0];
  const visitsNewestFirst = st => (st.visits || []).slice().sort((a, b) => b.start_date.localeCompare(a.start_date) || b.created_at.localeCompare(a.created_at));

  function summary(v) {
    const done = v.sessions.filter(s => s.status === "done");
    const results = id => done.filter(s => s.activity === id).map(s => RP.resultText(s.result) || "done").join("; ");
    const core = RP.GROUP_SESSIONS.filter(g => g.core);
    return {
      modules: [...new Set(done.filter(s => s.kind === "independent" && isModule(s.activity)).map(s => Number(s.activity.split("-")[1])))].sort((a, b) => a - b),
      moduleCount: Object.keys(RP.MODULES).filter(isModule).length,
      numeracy: results("numeracy"),
      literacy: results("literacy"),
      other: done.filter(s => s.kind === "independent" && s.activity && !isModule(s.activity) && !["numeracy", "literacy"].includes(s.activity)).map(titleOf),
      coreDone: core.filter(g => done.some(s => s.kind === "group" && s.activity === g.id)).length,
      coreTotal: core.length,
      ones: done.filter(s => s.kind === "one_to_one").length
    };
  }

  function statusLabel(v) {
    if (!v) return `<span class="muted">No program</span>`;
    return v.active ? `<span class="tag">In program · Day ${v.current_day}</span>` : `<span class="tag done-tag">Finished</span>`;
  }

  function modulePills(sum) {
    let out = "";
    for (let n = 1; n <= sum.moduleCount; n++) out += `<span class="pill${sum.modules.includes(n) ? " on" : ""}" title="Module ${n}${sum.modules.includes(n) ? " done" : ""}">${n}</span>`;
    return `<span class="pills">${out}</span>`;
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
          <div class="page-actions"><button class="btn" data-csv>Download spreadsheet</button><button class="btn primary" data-go-new>New student</button></div>
        </div>
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
    renderRecords();
  }

  function renderRecords() {
    const list = filtered();
    const programs = list.reduce((n, st) => n + (st.visits || []).length, 0);
    $("#records").innerHTML = `
      <p class="muted">${list.length} student${list.length === 1 ? "" : "s"} · ${programs} program${programs === 1 ? "" : "s"}${list.length < allStudents.length ? ` (filtered from ${allStudents.length})` : ""}. Click a student to see their full record.</p>
      ${list.length ? `
      <div class="table-wrap"><table class="records">
        <thead><tr><th>Code</th><th>Year</th><th>Latest program</th><th>Status</th><th>Programs</th><th>Modules</th><th>Numeracy</th><th>Literacy</th><th>Core movement</th><th>1:1s</th></tr></thead>
        <tbody>${list.map(st => {
          const v = latestVisit(st), sum = v ? summary(v) : null;
          return `<tr data-student="${st.id}" tabindex="0">
            <td class="code-cell">${h(RP.formatCode(st.code))}</td>
            <td>${st.year_level || ""}</td>
            <td>${v ? RP.formatDate(v.start_date) : ""}</td>
            <td>${statusLabel(v && (st.visits.find(x => x.active) || v))}</td>
            <td>${(st.visits || []).length}</td>
            <td>${sum ? modulePills(sum) : ""}</td>
            <td>${sum ? h(sum.numeracy) : ""}</td>
            <td>${sum ? h(sum.literacy) : ""}</td>
            <td>${sum ? `${sum.coreDone}/${sum.coreTotal}` : ""}</td>
            <td>${sum ? `${sum.ones}/2` : ""}</td>
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
    const rows = [["Code", "Year level", "Program start", "Status", "Current day", "Modules completed", "Numeracy", "Literacy", "Other electives", "Core movement sessions", "1:1s done"]];
    filtered().forEach(st => visitsNewestFirst(st).forEach(v => {
      const sum = summary(v);
      rows.push([RP.formatCode(st.code), st.year_level || "", v.start_date, v.active ? "In program" : "Finished", v.active ? v.current_day : "",
        sum.modules.join(" "), sum.numeracy, sum.literacy, sum.other.join("; "), `${sum.coreDone}/${sum.coreTotal}`, `${sum.ones}/2`]);
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
              <button class="btn primary" data-restart>Start a new program</button>`}
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
      on("[data-delete-program]", async () => {
        if (!confirm(`Delete the program starting ${RP.formatDate(v.start_date)}? Its plan, ticks and results are removed permanently. The student stays on the list.`)) return;
        try { await api.deleteVisit(v.id); reload(); } catch (ex) { failed(ex); }
      });
    });
  }

  function programCard(v) {
    const sum = summary(v);
    const certs = v.sessions.filter(s => s.kind === "independent" && s.status === "done" && s.activity && RP.MODULES[s.activity]);
    const answered = certs.filter(s => s.state && s.state.responses && s.state.responses.length).sort((a, b) => a.day - b.day || a.slot - b.slot);
    const anyActive = (student.visits || []).some(x => x.active);
    const dayList = day => `
      <div class="record-day">
        <h3>Day ${day}</h3>
        <ol class="record-list">${sessionsFor(v, day).map(s => {
          const t = RP.slotTimes(s.slot);
          return `<li class="${s.status === "done" ? "is-done" : ""}">
            <span class="time">${t ? RP.formatTime(t.start) : "1:1"}</span>
            <span class="r-title">${h(titleOf(s))} <span class="muted">· ${h(RP.KIND_LABEL[s.kind])}</span></span>
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
            <button class="btn small" data-certs ${certs.length ? "" : "disabled"}>Print certificates${certs.length ? ` (${certs.length})` : ""}</button>
            <button class="btn small" data-record>Print program record</button>
            ${v.active ? `<button class="btn small" data-finish>Finish program</button>` : (anyActive ? "" : `<button class="btn small" data-reopen>Reopen</button>`)}
            <button class="btn small danger" data-delete-program>Delete program</button>
          </div>
        </div>
        <div class="program-summary">
          <span><span class="muted">Modules</span> ${modulePills(sum)}</span>
          <span><span class="muted">Numeracy</span> ${h(sum.numeracy || "–")}</span>
          <span><span class="muted">Literacy</span> ${h(sum.literacy || "–")}</span>
          <span><span class="muted">Core movement</span> ${sum.coreDone}/${sum.coreTotal}</span>
          <span><span class="muted">1:1s</span> ${sum.ones}/2</span>
          ${sum.other.length ? `<span><span class="muted">Other</span> ${h(sum.other.join(", "))}</span>` : ""}
        </div>
        ${answered.length ? `<div class="answers">
          <h3>Written answers</h3>
          ${answered.map(s => `<details class="answer-block"><summary>${h(titleOf(s))} <span class="muted">· submitted ${RP.formatDate(s.completed_at || s.updated_at)}</span></summary>${RP.worksheetRows(s.state.responses)}</details>`).join("")}
        </div>` : ""}
        <details><summary>Day-by-day</summary><div class="record-days">${dayList(1)}${dayList(2)}</div></details>
      </section>`;
  }

  // ---------------------------------------------------------------- printing
  function renderPrint() {
    const v = student && (student.visits || []).find(x => x.id === view.visitId);
    if (!v) { show({ name: "all" }); return; }
    const certs = v.sessions.filter(s => s.kind === "independent" && s.status === "done" && s.activity && RP.MODULES[s.activity])
      .sort((a, b) => a.day - b.day || a.slot - b.slot);
    const isCerts = view.what === "certs";
    app().innerHTML = `
      <div class="page print-page">
        <div class="card no-print">
          <button class="link-btn" data-back>← Back to ${h(RP.formatCode(student.code))}</button>
          <h1>${isCerts ? "Print certificates" : "Print program record"}</h1>
          <label class="field">Student's name <input data-name maxlength="40" autocomplete="off"></label>
          <p class="muted">The name is only used for printing. It isn't saved.</p>
          ${isCerts && certs.some(s => s.state && s.state.responses) ? `<label class="field inline"><input type="checkbox" data-with-answers checked> Include their written answers after each certificate</label>` : ""}
          ${isCerts ? `<div class="cert-picks">${certs.map(s => `<label class="field inline"><input type="checkbox" data-pick="${s.id}" checked> ${h(titleOf(s))}${s.result && RP.resultText(s.result) ? ` <span class="muted">(${h(RP.resultText(s.result))})</span>` : ""}</label>`).join("")}</div>` : ""}
          <div class="actions"><button class="btn primary" data-print>Print or save as PDF</button></div>
        </div>
        <div class="print-area">
          ${isCerts ? certs.map(s => {
            const cert = Object.assign({ title: titleOf(s), date: RP.longDate(s.completed_at || s.updated_at), worksheet: s.state && s.state.responses }, s.result || {});
            return `<div class="print-cert" data-cert="${s.id}">${RP.certificateMarkup(cert)}${cert.worksheet && cert.worksheet.length ? `<div class="print-answers">${RP.worksheetMarkup(cert)}</div>` : ""}</div>`;
          }).join("")
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
          const t = RP.slotTimes(s.slot);
          return `<tr><td>${t ? RP.formatTime(t.start) : "1:1"}</td><td>${h(titleOf(s))}<br><span class="muted">${h(RP.KIND_LABEL[s.kind])}</span></td><td>${s.status === "done" ? "✓ " : ""}${h(statusText(s))}</td></tr>`;
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
          <div><strong>Modules completed:</strong> ${sum.modules.length ? sum.modules.map(n => "Module " + n).join(", ") : "none"}</div>
          <div><strong>Numeracy:</strong> ${h(sum.numeracy || "not completed")} &nbsp; <strong>Literacy:</strong> ${h(sum.literacy || "not completed")}</div>
          ${sum.other.length ? `<div><strong>Other electives:</strong> ${h(sum.other.join(", "))}</div>` : ""}
          <div><strong>Core movement sessions:</strong> ${sum.coreDone} of ${sum.coreTotal}${missing.length ? ` (not done: ${h(missing.map(g => g.title).join(", "))})` : ""}</div>
          <div><strong>1:1s with teacher:</strong> ${sum.ones} of 2</div>
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
        <p class="muted">${pick ? `<strong>Click a session to place “${h(pick.title)}”.</strong> <button class="link-btn" data-unpick>Cancel</button>` : "Drag an activity onto a session, or click an activity and then click a session."}
          ${missing.length ? ` <span class="warn">Core group sessions not done yet: ${missing.map(g => h(g.title)).join(", ")}.</span>` : ""}</p>
        <div class="plan-layout">
          <aside class="palette">
            <h3>Electives <span class="muted">(on their own)</span></h3>
            ${electives().map(m => chip("elective", m.id, m.title, m.sample ? ` <span class="tag">sample</span>` : "")).join("")}
            <h3>Group sessions</h3>
            ${RP.GROUP_SESSIONS.map(g => chip("group", g.id, g.title, g.core ? ` <span class="tag core">core</span>` : "")).join("")}
            <h3>Other</h3>
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
      const item = { type: c.dataset.type, id: c.dataset.id, title: c.textContent.replace(/\s*(sample|core)\s*$/i, "").trim() };
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
    app().querySelectorAll("[data-level]").forEach(sel => sel.onchange = async () => {
      const s = v.sessions.find(s => s.id === sel.dataset.level);
      await api.updateSession(s.id, { state: sel.value ? { level: Number(sel.value) } : null }); reload();
    });
    app().querySelectorAll("[data-apply]").forEach(b => b.onclick = () => applyRotation(Number(b.dataset.apply), b.previousElementSibling.value));
  }

  function planDay(v, day) {
    const now = RP.currentSlot();
    const rot = rotationOf(v, day);
    const rows = RP.TIMETABLE.map(t => {
      if (t.brk) return `<li class="plan-brk"><span class="time">${RP.formatTime(t.start)}</span>${h(t.brk)}</li>`;
      const s = at(v, day, t.slot);
      return s ? slotRow(s, t, day === v.current_day && now === t.slot) : "";
    }).join("");
    const one = at(v, day, RP.ONE_TO_ONE_SLOT);
    return `
      <section class="plan-day${day === v.current_day ? " today" : ""}">
        <div class="plan-day-head">
          <h2>Day ${day}${day === v.current_day ? ` <span class="tag">Today</span>` : ""}</h2>
          <span class="field inline small">Group sessions
            <select>${Object.keys(RP.ROTATIONS).map(r => `<option value="${r}"${r === rot ? " selected" : ""}>Rotation ${r}</option>`).join("")}${rot === "custom" ? `<option value="custom" selected>Custom</option>` : ""}</select>
            <button class="btn small" data-apply="${day}">Apply</button>
          </span>
        </div>
        <ol class="plan-list">${rows}</ol>
        ${one ? slotRow(one, null, false) : ""}
      </section>`;
  }

  function slotRow(s, t, isNow) {
    const fixed = s.slot === RP.FIRST_SLOT || s.slot === RP.LAST_SLOT || s.slot === RP.ONE_TO_ONE_SLOT;
    const m = s.kind === "independent" && s.activity && RP.MODULES[s.activity];
    let controls = "";
    if (teacherTicks(s)) {
      controls = `<button class="btn small${s.status === "done" ? " ok" : ""}" data-tick="${s.id}">${s.status === "done" ? "✓ Done" : "Mark done"}</button>`;
    } else if (m) {
      if (s.status === "not_started" && m.levels) {
        const lv = s.state && s.state.level;
        controls = `<select class="small" data-level="${s.id}" aria-label="Suggested level"><option value="">Level: student picks</option>${m.levels.map(l => `<option value="${l.level}"${lv === l.level ? " selected" : ""}>Suggest ${h(l.title)}</option>`).join("")}</select>`;
      }
      if (s.status !== "done") controls += `<button class="btn small" data-mark="${s.id}" title="For example, if they did it on paper">Mark done</button>`;
      if (s.status !== "not_started") controls += `<button class="btn small" data-reset="${s.id}">Let them redo</button>`;
    }
    return `
      <li class="plan-slot k-${s.kind}${isNow ? " now" : ""}${fixed ? " fixed" : " droppable"}${pick && !fixed ? " pickable" : ""}" ${fixed ? "" : `data-drop="${s.day}:${s.slot}"`}>
        <span class="time">${t ? RP.formatTime(t.start) : "Any time"}</span>
        <span class="slot-text">
          <span class="slot-title">${h(titleOf(s))}</span>
          <span class="slot-kind">${h(RP.KIND_LABEL[s.kind])} · ${h(statusText(s))}</span>
        </span>
        <span class="slot-controls">${controls}</span>
      </li>`;
  }

  async function place(day, slot, item) {
    const s = at(visit, day, slot);
    if (!s || slot === RP.FIRST_SLOT || slot === RP.LAST_SLOT || slot === RP.ONE_TO_ONE_SLOT) return;
    let patch;
    if (item.type === "elective") patch = { kind: "independent", activity: item.id, title: RP.MODULES[item.id].title };
    else if (item.type === "group") patch = { kind: "group", activity: item.id, title: RP.groupSession(item.id).title };
    else if (item.type === "free") patch = { kind: "free", activity: null, title: "Free choice" };
    else patch = { kind: "independent", activity: null, title: "Elective" };
    if (s.kind === patch.kind && s.activity === patch.activity) { pick = null; renderPlan(); return; }
    if (s.status !== "not_started" && !confirm(`"${titleOf(s)}" has already been started. Replace it? Its progress will be cleared.`)) return;
    Object.assign(patch, { status: "not_started", result: null, state: null, completed_at: null });
    pick = null;
    try { await api.updateSession(s.id, patch); visit = await api.getVisit(visit.id); renderPlan(); }
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
  if (api.demo) $("#demo-banner").hidden = false;
  (async () => {
    try { if (await api.isStaff()) enter(); else renderLogin(); }
    catch (ex) { renderLogin(); }
  })();
})();
