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
          <button class="btn primary big" type="submit">Log in</button>
          <p class="error" aria-live="polite">${h(message || "")}</p>
          <p class="muted small"><a href="index.html">Back to the student view</a></p>
        </form>
      </div>`;
    const form = $("[data-login]");
    form.email.focus();
    form.onsubmit = async e => {
      e.preventDefault();
      const err = form.querySelector(".error");
      err.textContent = "Logging in…";
      try { await api.signIn(form.email.value.trim(), form.password.value); enter(); }
      catch (ex) { err.textContent = /invalid/i.test(ex.message) ? "Email or password is wrong." : ex.message; }
    };
  }

  async function enter() {
    renderNav();
    if (unsubscribe) unsubscribe();
    unsubscribe = api.subscribe(() => scheduleReload());
    show({ name: "board" });
  }

  function renderNav() {
    const laptop = laptopCode();
    $("#nav").innerHTML = `
      <button class="nav-btn" data-nav="board">Students</button>
      <button class="nav-btn" data-nav="new">New student</button>
      <button class="nav-btn" data-nav="lookup">Returning student</button>
      ${laptop ? `<span class="laptop-note">This laptop: ${h(RP.formatCode(laptop))} <button class="link-btn" data-clear-laptop>Clear</button></span>` : ""}
      <button class="nav-btn lock" data-lock>Lock</button>`;
    $("#nav").querySelectorAll("[data-nav]").forEach(b => b.onclick = () => show({ name: b.dataset.nav }));
    $("[data-lock]").onclick = async () => { await api.signOut(); if (unsubscribe) unsubscribe(); unsubscribe = null; renderLogin(); };
    const clear = $("[data-clear-laptop]");
    if (clear) clear.onclick = () => { clearLaptop(); renderNav(); };
    $("#nav").querySelectorAll("[data-nav]").forEach(b => b.classList.toggle("active", b.dataset.nav === view.name || (view.name === "plan" && b.dataset.nav === "board")));
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
      else if (v.name === "lookup") renderLookup();
    } catch (ex) { failed(ex); }
  }

  function failed(ex) {
    if (/JWT|auth|401/i.test(ex.message)) { renderLogin("Your login has expired. Please log in again."); return; }
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
          `<div class="card empty"><p>No students in the program right now.</p><button class="btn primary" data-go-new>Add a new student</button> <button class="btn" data-go-lookup>Returning student</button></div>`}
      </div>`;

    app().querySelectorAll("[data-go-new]").forEach(b => b.onclick = () => show({ name: "new" }));
    const gl = $("[data-go-lookup]"); if (gl) gl.onclick = () => show({ name: "lookup" });
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
      el.querySelector("[data-plan]").onclick = () => show({ name: "plan", visitId: v.id });
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
    if (view.name === "plan") show({ name: "board" }); else reload();
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
      } catch (ex) { btn.disabled = false; form.querySelector(".error").textContent = ex.message; }
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
    $("[data-setup]").onclick = () => show({ name: "plan", visitId });
  }

  // ---------------------------------------------------------------- returning student
  function renderLookup(message, found) {
    app().innerHTML = `
      <div class="page narrow">
        <h1>Returning student</h1>
        <form class="card form inline" data-lookup>
          <label class="field">Student code <input name="code" class="code-input small" maxlength="9" autocomplete="off" placeholder="XXXX-XXXX"></label>
          <button class="btn primary" type="submit">Find</button>
        </form>
        <p class="error">${h(message || "")}</p>
        <div id="found"></div>
      </div>`;
    const form = $("[data-lookup]");
    form.code.oninput = () => { form.code.value = RP.formatCode(form.code.value); };
    form.code.focus();
    form.onsubmit = async e => {
      e.preventDefault();
      try {
        const s = await api.findStudent(form.code.value);
        if (!s) { renderLookup("No student has that code."); return; }
        renderHistory(s);
      } catch (ex) { failed(ex); }
    };
    if (found) renderHistory(found);
  }

  function renderHistory(s) {
    const visitsSorted = (s.visits || []).slice().sort((a, b) => b.start_date.localeCompare(a.start_date));
    const active = visitsSorted.find(v => v.active);
    $("#found").innerHTML = `
      <div class="card">
        <h2>${h(RP.formatCode(s.code))} ${s.year_level ? `<span class="muted">· Year ${s.year_level}</span>` : ""}</h2>
        ${visitsSorted.length ? visitsSorted.map(v => {
          const done = v.sessions.filter(x => x.status === "done");
          const el = done.filter(x => x.kind === "independent");
          const gr = done.filter(x => x.kind === "group");
          return `<div class="history">
            <h3>${RP.formatDate(v.start_date)} ${v.active ? `<span class="tag">In the program now</span>` : ""}</h3>
            <p><span class="muted">Electives finished:</span> ${el.length ? el.map(x => `${h(titleOf(x))}${x.result && RP.resultText(x.result) ? ` (${h(RP.resultText(x.result))})` : ""}`).join(", ") : "none"}</p>
            <p><span class="muted">Group sessions:</span> ${gr.length ? gr.map(x => h(x.title)).join(", ") : "none"}</p>
          </div>`;
        }).join("") : `<p class="muted">No previous programs.</p>`}
        <div class="actions">
          ${active ? `<button class="btn primary" data-open="${active.id}">Open their current plan</button>` :
            `<label class="field inline">Today's rotation <select data-rot>${Object.keys(RP.ROTATIONS).map(r => `<option>${r}</option>`).join("")}</select></label>
             <button class="btn primary" data-restart>Start a new program</button>`}
        </div>
      </div>`;
    const open = $("[data-open]");
    if (open) open.onclick = () => show({ name: "plan", visitId: open.dataset.open });
    const restart = $("[data-restart]");
    if (restart) restart.onclick = async () => {
      restart.disabled = true;
      const r1 = $("[data-rot]").value, keys = Object.keys(RP.ROTATIONS);
      const r2 = keys[(keys.indexOf(r1) + 1) % keys.length];
      try {
        const id = await api.startVisit(s.id, RP.buildDay(1, r1).concat(RP.buildDay(2, r2)));
        show({ name: "plan", visitId: id });
      } catch (ex) { restart.disabled = false; failed(ex); }
    };
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
            <button class="link-btn" data-back>← All students</button>
            <h1>${h(RP.formatCode(v.student.code))} ${v.student.year_level ? `<span class="muted">· Year ${v.student.year_level}</span>` : ""}</h1>
          </div>
          <div class="page-actions">
            <label class="field inline">Today is their
              <select data-current>${[1, 2].map(d => `<option value="${d}"${v.current_day === d ? " selected" : ""}>Day ${d}</option>`).join("")}</select>
            </label>
            <button class="btn" data-laptop>Student view on this laptop</button>
            ${v.active ? `<button class="btn danger" data-finish>Finish program</button>` : ""}
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

    $("[data-back]").onclick = () => show({ name: "board" });
    $("[data-laptop]").onclick = () => toStudentView(v.student.code);
    const fin = $("[data-finish]"); if (fin) fin.onclick = () => finish(v);
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
    app().querySelectorAll("[data-reset]").forEach(b => b.onclick = async () => {
      const s = v.sessions.find(s => s.id === b.dataset.reset);
      if (!confirm(`Let them start "${titleOf(s)}" again? Their progress and result for it will be cleared.`)) return;
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
