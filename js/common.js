/* Shared helpers for the student and teacher pages. */
window.RP = window.RP || {};

RP.MODULES = {};
RP.registerModule = function (m) { RP.MODULES[m.id] = m; };

// ---- Text ----
RP.h = function (s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};

// Paragraphs, "- " lists and **bold**.
RP.md = function (text) {
  const inline = s => RP.h(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return String(text || "").trim().split(/\n\s*\n/).map(block => {
    const lines = block.split("\n");
    if (lines.every(l => l.trim().startsWith("- "))) {
      return "<ul>" + lines.map(l => "<li>" + inline(l.trim().slice(2)) + "</li>").join("") + "</ul>";
    }
    const firstList = lines.findIndex(l => l.trim().startsWith("- "));
    if (firstList > 0 && lines.slice(firstList).every(l => l.trim().startsWith("- "))) {
      return "<p>" + inline(lines.slice(0, firstList).join(" ")) + "</p><ul>" +
        lines.slice(firstList).map(l => "<li>" + inline(l.trim().slice(2)) + "</li>").join("") + "</ul>";
    }
    return "<p>" + inline(lines.join(" ")) + "</p>";
  }).join("");
};

// ---- Codes ----
RP.normaliseCode = c => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
RP.formatCode = c => { const n = RP.normaliseCode(c); return n.length === 8 ? n.slice(0, 4) + "-" + n.slice(4) : n; };

// ---- Time ----
RP.toMinutes = hhmm => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
RP.formatTime = hhmm => { let [h, m] = hhmm.split(":").map(Number); if (h > 12) h -= 12; return h + ":" + String(m).padStart(2, "0"); };
RP.nowMinutes = () => {
  const forced = new URLSearchParams(location.search).get("time"); // e.g. ?time=10:00 for testing
  if (forced && /^\d{1,2}:\d{2}$/.test(forced)) return RP.toMinutes(forced);
  const d = new Date(); return d.getHours() * 60 + d.getMinutes();
};
RP.slotTimes = slot => RP.TIMETABLE.find(t => t.slot === slot);
// The slot running now: a number, "before", "after", or the break object.
RP.currentSlot = () => {
  const now = RP.nowMinutes();
  for (const t of RP.TIMETABLE) {
    if (now >= RP.toMinutes(t.start) && now < RP.toMinutes(t.end)) return t.brk ? t : t.slot;
  }
  return now < RP.toMinutes(RP.TIMETABLE[0].start) ? "before" : "after";
};
RP.todayLabel = () => new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
RP.formatDate = iso => new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });

// ---- Plans ----
RP.groupSession = id => RP.GROUP_SESSIONS.find(g => g.id === id);

// Everything in the day is a module: group modules, and individual modules, which are either
// independent (on the laptop) or teacher-led (one-on-one with a staff member).
RP.KIND_LABEL = {
  intro: "Whole group", debrief: "Whole group", group: "Group module", independent: "Independent",
  free: "Free choice", one_to_one: "Teacher-led", break: "Break", survey: "Survey"
};

// "Other" sessions: staff type what the session is (kind "free", activity "custom").
RP.isCustom = s => s.kind === "free" && s.activity === "custom";
// Teacher-led modules (module.teacherLed) are stored as independent sessions, because the
// student works through them on the laptop, but they're shown as teacher-led.
RP.isLedModule = s => s.kind === "independent" && !!(s.activity && RP.MODULES[s.activity] && RP.MODULES[s.activity].teacherLed);
RP.kindLabel = s => RP.isCustom(s) ? "Other" : RP.isLedModule(s) ? RP.KIND_LABEL.one_to_one : RP.KIND_LABEL[s.kind];

// The title to show for a planned session. Older plans saved teacher-led titles as "Individual: …".
RP.sessionTitle = function (s) {
  if (s.kind === "independent" && s.activity && RP.MODULES[s.activity]) return RP.MODULES[s.activity].title;
  if (s.kind === "independent" && !s.activity) return "Empty";
  if (s.kind === "free" && s.activity === "custom") return s.title;
  if (s.kind === "one_to_one") { const x = RP.individualSession(s.activity); return x ? x.title : String(s.title || "").replace(/^Individual:\s*/, ""); }
  return s.title;
};

// A fresh day using one of the rotations: fixed morning and debrief, the rotation's group
// modules, and the default electives (none, unless set in config.js) in the free slots.
// Teacher-led sessions are dragged in by the teacher, so they're not placed here.
RP.buildDay = function (day, rotation) {
  const groups = RP.ROTATIONS[rotation] || {};
  const free = [];
  for (let slot = RP.FIRST_SLOT + 1; slot < RP.LAST_SLOT; slot++) if (!groups[slot]) free.push(slot);
  let electives = ((RP.DEFAULT_ELECTIVES || {})[day] || []).filter(id => RP.MODULES[id]);
  if (electives.length > free.length) electives = electives.slice(0, free.length - 1).concat(electives.slice(-1));
  const rows = [];
  for (let slot = RP.FIRST_SLOT; slot <= RP.LAST_SLOT; slot++) {
    if (slot === RP.FIRST_SLOT) rows.push({ day, slot, kind: "intro", activity: null, title: "Morning session" });
    else if (slot === RP.LAST_SLOT) rows.push({ day, slot, kind: "debrief", activity: null, title: "Afternoon debrief" });
    else if (groups[slot]) rows.push({ day, slot, kind: "group", activity: groups[slot], title: RP.groupSession(groups[slot]).title });
    else {
      const id = electives[free.indexOf(slot)];
      rows.push(id ? { day, slot, kind: "independent", activity: id, title: RP.MODULES[id].title }
        : { day, slot, kind: "independent", activity: null, title: "Empty" });
    }
  }
  return rows;
};

RP.individualSession = id => (RP.INDIVIDUAL_SESSIONS || []).find(x => x.id === id);

// Core group sessions not yet done across both days.
RP.missingCore = function (sessions) {
  const done = new Set(sessions.filter(s => s.kind === "group" && s.status === "done").map(s => s.activity));
  return RP.GROUP_SESSIONS.filter(g => g.core && !done.has(g.id));
};

RP.resultText = function (r) {
  if (!r) return "";
  const parts = [];
  if (r.byTeacher && !r.outOf) return "marked done by teacher";
  if (r.survey) return `survey ${r.total}/${r.max || 50}`;
  if (r.subjects) return RP.subjectsText(r.subjects);
  if (r.levelTitle) parts.push(r.levelTitle);
  if (r.outOf) parts.push(r.score + "/" + r.outOf);
  return parts.join(", ");
};

RP.sunburst = function (size, colour) {
  let rays = "";
  for (let i = 0; i < 28; i++) {
    const a = (Math.PI * i) / 27, r1 = 9, r2 = i % 2 ? 19 : 23;
    const x1 = 24 - Math.cos(a) * r1, y1 = 26 - Math.sin(a) * r1, x2 = 24 - Math.cos(a) * r2, y2 = 26 - Math.sin(a) * r2;
    rays += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }
  return `<svg width="${size}" height="${size * 0.6}" viewBox="0 6 48 22" aria-hidden="true" fill="none" stroke="${colour || "currentColor"}" stroke-width="1.4" stroke-linecap="round">${rays}<path d="M17 26a7 7 0 0 1 14 0" stroke-width="2"/></svg>`;
};

RP.isDemo = function () {
  const p = new URLSearchParams(location.search).get("demo");
  try {
    if (p === "1") localStorage.setItem("rp-demo", "1");
    if (p === "0") localStorage.removeItem("rp-demo");
    return localStorage.getItem("rp-demo") === "1";
  } catch (e) { return p === "1"; }
};

RP.uuid = function () {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0; return (c === "x" ? r : (r & 3) | 8).toString(16);
  });
};

// Certificate markup, shared by the student page and the teacher's reprints. The name is typed
// on the page at print time and never saved.
RP.certificateMarkup = function (cert) {
  const h = RP.h;
  return `
    <div class="certificate">
      <div class="cert-burst">${RP.logo(130)}</div>
      <div class="cert-school">Thomas Reddall High School</div>
      <div class="cert-heading">Certificate of Completion</div>
      <div class="cert-small">This certificate is awarded to</div>
      <div class="cert-name" data-cert-name>&nbsp;</div>
      <div class="cert-small">for completing</div>
      <div class="cert-module">${h(cert.title)}${cert.levelTitle ? ` · ${h(cert.levelTitle)}` : ""}</div>
      ${cert.outOf ? `<div class="cert-score">${cert.score} out of ${cert.outOf} correct first time</div>` : ""}
      <div class="cert-motto">"Focusing on our Future"</div>
      <div class="cert-foot"><span>Reset Program</span><span>${h(cert.date)}</span></div>
    </div>`;
};
RP.longDate = iso => new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

RP.inlineMd = s => RP.md(s).replace(/^<p>|<\/p>$/g, "");

// A module's written answers: [{ heading, rows: [{ label, text }] }], saved with the module
// when the student finishes it. Used on the student's certificate page and the teacher's record.
RP.worksheetRows = function (sheet) {
  const h = RP.h;
  return (sheet || []).map(sec => `
    <section class="ws-section">
      ${sec.heading ? `<h3>${h(sec.heading)}</h3>` : ""}
      ${sec.rows.map(r => `<div class="ws-row"><div class="ws-label">${RP.inlineMd(r.label)}</div><div class="ws-answer">${r.text ? h(r.text) : `<span class="muted">(left blank)</span>`}</div></div>`).join("")}
    </section>`).join("");
};
RP.worksheetMarkup = function (cert) {
  const h = RP.h;
  return `
    <div class="worksheet">
      <div class="ws-head">
        <div><div class="cert-school">Thomas Reddall High School · Reset Program</div><h2>${h(cert.title)}: my answers</h2></div>
        <div class="ws-meta">Name: <strong data-ws-name>&nbsp;</strong><br>${h(cert.date)}</div>
      </div>
      ${RP.worksheetRows(cert.worksheet)}
    </div>`;
};

// School logo: the sun rising over an open book, drawn as lines so it stays sharp at any size.
RP.logo = function (size, colour) {
  let rays = "";
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI * (0.06 + 0.88 * i / 12), long = i % 2 === 0;
    const r1 = 17, r2 = long ? 44 : 31;
    const p = r => [(50 - Math.cos(a) * r).toFixed(1), (52 - Math.sin(a) * r).toFixed(1)];
    const [x1, y1] = p(r1), [x2, y2] = p(r2);
    rays += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  return `<svg class="logo" width="${size}" height="${Math.round(size * 0.72)}" viewBox="0 0 100 72" aria-hidden="true" fill="none" stroke="${colour || "currentColor"}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
    ${rays}
    <path d="M37 52a13 13 0 0 1 26 0"/>
    <path d="M10 58c14-6 28-6 40 3c12-9 26-9 40-3"/>
    <path d="M14 63c12-5 25-5 36 3c11-8 24-8 36-3"/>
    <path d="M5 62v4c15-5 30-4 45 4c15-8 30-9 45-4v-4"/>
  </svg>`;
};

// ---- Read aloud (Chrome's built-in speech; works on Chromebooks) ----
RP.speech = (function () {
  let speaking = null;
  const supported = "speechSynthesis" in window;
  function voice() {
    const vs = supported ? speechSynthesis.getVoices() : [];
    return vs.find(v => v.lang === "en-AU") || vs.find(v => v.lang === "en-GB") || vs.find(v => /^en/.test(v.lang)) || null;
  }
  function stop() {
    if (!supported) return;
    speechSynthesis.cancel();
    if (speaking) { speaking.textContent = "🔊 Read aloud"; speaking.classList.remove("on"); }
    speaking = null;
  }
  function say(text, btn) {
    if (!supported || !text.trim()) return;
    stop();
    const u = new SpeechSynthesisUtterance(text.replace(/\s+/g, " ").trim());
    const v = voice(); if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = 0.95;
    u.onend = () => { if (speaking === btn) stop(); };
    if (btn) { speaking = btn; btn.textContent = "⏹ Stop"; btn.classList.add("on"); }
    speechSynthesis.speak(u);
  }
  // The readable text of an element: headings, paragraphs, questions and choices, without buttons.
  function textOf(el) {
    const copy = el.cloneNode(true);
    copy.querySelectorAll("button:not(.choice):not(.level-card):not(.sort-card):not(.tile), input, textarea, select, .no-read, .actions").forEach(x => x.remove());
    return copy.innerText || copy.textContent || "";
  }
  return {
    supported, stop, say, textOf,
    button: () => supported ? `<button class="btn ghost read-aloud" data-read-aloud type="button">🔊 Read aloud</button>` : "",
    bind(root, getEl) {
      const b = root.querySelector("[data-read-aloud]");
      if (b) b.onclick = () => (speaking === b ? stop() : say(textOf(getEl()), b));
    }
  };
})();

// ---- Reading levels ----
// Only the Literacy module has levels (1–5, its own "levels"). Other modules use their standard
// text. Items can still give an "easy" version (levels 1–2) and read items "more" detail
// (levels 4–5), used if a module is ever opened at a reading level.
RP.atLevel = function (item, level) {
  let it = item;
  if (level && level <= 2 && item.easy) it = Object.assign({}, item, item.easy);
  if (level && level >= 4 && item.more && it.type === "read") it = Object.assign({}, it, { text: it.text + "\n\n" + item.more });
  return it;
};

// ---- Sending work (Chromebooks can't print; Save as PDF and email both work) ----
RP.mailtoFor = function (cert) {
  const lines = [`${cert.title}${cert.levelTitle ? " · " + cert.levelTitle : ""}`, cert.date];
  if (cert.outOf) lines.push(`${cert.score} out of ${cert.outOf} correct first time`);
  (cert.worksheet || []).forEach(sec => {
    lines.push("");
    if (sec.heading) lines.push(sec.heading.toUpperCase());
    sec.rows.forEach(r => lines.push(`${r.label.replace(/\*\*/g, "")}\n${r.text || "(left blank)"}`));
  });
  let body = lines.join("\n");
  if (body.length > 1800) body = body.slice(0, 1800) + "\n…";
  return `mailto:?subject=${encodeURIComponent("Reset Program: " + cert.title)}&body=${encodeURIComponent(body)}`;
};

// Suspension Booklet subjects: "English finished, Maths started".
RP.subjectsText = function (subjects) {
  const m = RP.MODULES["suspension-booklet"];
  return Object.keys(subjects || {}).map(id => {
    const sub = m && m.books.flatMap(b => b.subjects).find(x => x.id === id);
    return `${sub ? sub.title : id} ${subjects[id] === "completed" ? "finished" : "started"}`;
  }).join(", ");
};

// ---- End-of-day certificate ----
// One certificate per day, listing every module finished that day. Students get it after the
// afternoon survey (and any time from their plan); teachers can reprint it.
// A Suspension Booklet counts as soon as a subject is started, even if it isn't finished.
RP.dayModules = function (sessions, day) {
  const booklet = s => s.kind === "independent" && s.status === "in_progress" && s.state && s.state.subjects && Object.keys(s.state.subjects).length;
  return sessions.filter(s => s.day === day && ["group", "independent", "one_to_one", "free"].includes(s.kind) && (s.status === "done" || booklet(s)))
    .filter(s => s.kind !== "free" || s.activity === "custom")
    .sort((a, b) => a.slot - b.slot)
    .map(s => ({ title: RP.sessionTitle(s), kind: RP.kindLabel(s),
      result: s.kind !== "independent" ? "" : booklet(s) ? RP.subjectsText(s.state.subjects) : RP.resultText(s.result) }));
};
RP.dayCertificateMarkup = function (cert) {
  const h = RP.h;
  return `
    <div class="certificate day-cert">
      <div class="cert-burst">${RP.logo(110)}</div>
      <div class="cert-school">Thomas Reddall High School</div>
      <div class="cert-heading">Certificate of Completion</div>
      <div class="cert-small">This certificate is awarded to</div>
      <div class="cert-name" data-cert-name>&nbsp;</div>
      <div class="cert-small">for completing Day ${h(cert.day)} of the Reset Program</div>
      ${cert.modules.length ? `<ul class="cert-list">${cert.modules.map(m => `<li>${h(m.title)} <span class="cert-kind">${h(m.kind)}${m.result ? " · " + h(m.result) : ""}</span></li>`).join("")}</ul>`
        : `<div class="cert-small">No modules finished yet.</div>`}
      <div class="cert-motto">"Focusing on our Future"</div>
      <div class="cert-foot"><span>Reset Program</span><span>${h(cert.date)}</span></div>
    </div>`;
};
RP.dayMailto = function (cert) {
  const body = [`Reset Program: Day ${cert.day}`, cert.date, "", "Modules completed:", ...cert.modules.map(m => `- ${m.title} (${m.kind}${m.result ? ", " + m.result : ""})`)].join("\n");
  return `mailto:?subject=${encodeURIComponent("Reset Program: Day " + cert.day + " certificate")}&body=${encodeURIComponent(body)}`;
};

// ---- Teacher's preview of an independent module ----
// Every page and question, with the answers, so staff can see what a student is working on.
RP.previewModule = function (m) {
  const h = RP.h, md = RP.md, inline = RP.inlineMd;
  const item = (it, n) => {
    const head = t => `<div class="pv-type">${h(t)}</div>`;
    switch (it.type) {
      case "read": return `${head("Page")}${it.title ? `<h4>${h(it.title)}</h4>` : ""}${md(it.text)}`;
      case "mc": return `${head("Multiple choice")}<div class="pv-q">${inline(it.q)}</div><ol class="pv-choices" type="A">${it.choices.map((c, k) => `<li class="${k === it.answer ? "pv-right" : ""}">${h(c)}${k === it.answer ? " ✓" : ""}</li>`).join("")}</ol>${it.explain ? `<p class="muted">${h(it.explain)}</p>` : ""}`;
      case "input": return `${head("Type the answer")}<div class="pv-q">${inline(it.q)}</div><p class="pv-right">Answer: ${h((it.prefix || "") + it.answer + (it.suffix || ""))}${it.accept ? ` <span class="muted">(also: ${h(it.accept.join(", "))})</span>` : ""}</p>`;
      case "sort": return `${head("Sort into groups")}<div class="pv-q">${inline(it.q)}</div>${it.buckets.map((b, k) => `<p><strong>${h(b)}:</strong> ${it.cards.filter(c => c.bucket === k).map(c => h(c.text)).join("; ")}</p>`).join("")}`;
      case "order": return `${head("Put in order")}<div class="pv-q">${inline(it.q)}</div><ol>${it.cards.map(c => `<li>${h(c)}</li>`).join("")}</ol>`;
      case "match": return `${head("Match")}<div class="pv-q">${inline(it.q)}</div><ul>${it.pairs.map(p => `<li>${h(p.left)} → <strong>${h(p.right)}</strong></li>`).join("")}</ul>`;
      case "select": return `${head("Choose what fits you")}${it.title ? `<h4>${h(it.title)}</h4>` : ""}<div class="pv-q">${inline(it.q)}</div><p>${it.options.map(h).join(" · ")}${it.other ? " · (something else)" : ""}</p>`;
      case "write": return `${head("Written answers (optional)")}${it.title ? `<h4>${h(it.title)}</h4>` : ""}${it.q ? md(it.q) : ""}<ul>${it.prompts.map(p => `<li>${inline(p)}</li>`).join("")}</ul>`;
      case "slider": return `${head("Sliders")}${it.title ? `<h4>${h(it.title)}</h4>` : ""}<ul>${it.sliders.map(x => `<li>${h(x.label)} <span class="muted">(${h(x.left || x.min || 0)} → ${h(x.right || x.max || 10)})</span></li>`).join("")}</ul>`;
      case "bodymap": return `${head("Body map")}<div class="pv-q">${inline(it.q)}</div>`;
      case "story": return `${head("Choose-your-path story")}${it.title ? `<h4>${h(it.title)}</h4>` : ""}${Object.keys(it.nodes).map(k => { const nd = it.nodes[k]; return `<div class="pv-node"><p>${inline(nd.text)}${nd.end ? ` <span class="tag">${nd.end === "good" ? "good ending" : "try again"}</span>` : ""}</p>${nd.choices ? `<ul>${nd.choices.map(c => `<li>${h(c.label)}</li>`).join("")}</ul>` : ""}</div>`; }).join("")}`;
      case "tiles": return `${head("Build a sentence")}${it.title ? `<h4>${h(it.title)}</h4>` : ""}<p>${it.parts.map(p => typeof p === "string" ? h(p) : `[${p.options.map(o => h(typeof o === "string" ? o : o.text + (o.warn ? " ✗" : ""))).join(" / ")}]`).join(" ")}</p>`;
      case "video": return `${head("Video")}${it.title ? `<h4>${h(it.title)}</h4>` : ""}<p><a href="https://www.youtube.com/watch?v=${h(it.youtube)}" target="_blank" rel="noopener">Watch on YouTube</a></p>${it.text ? md(it.text) : ""}`;
      case "scale": return `${head("Quick check-in (not saved)")}<div class="pv-q">${inline(it.q)}</div><p>${it.labels.map(h).join(" · ")}</p>`;
      case "rating": return `${head("Rate 1–5")}<ol>${it.statements.map(x => `<li>${h(x)}</li>`).join("")}</ol>`;
      case "breathe": return `${head("Box breathing")}${it.title ? `<h4>${h(it.title)}</h4>` : ""}${it.text ? md(it.text) : ""}`;
      case "ready": return `${head("Ready to learn")}<p>Traffic light, then: ${RP.READY_ITEMS.map(x => h(x.label)).join(" · ")}</p>`;
      default: return head(it.type);
    }
  };
  const list = items => `<ol class="pv-items">${items.map((it, n) => `<li>${item(it, n)}</li>`).join("")}</ol>`;
  return `
    <div class="preview">
      ${m.about ? `<div class="pv-about">${md(m.about)}</div>` : ""}
      ${m.booklet ? m.books.map(b => `<h4>${h(b.title)}</h4><p>${b.subjects.map(x => x.pdf ? `<a href="${h(x.pdf)}" target="_blank" rel="noopener">${h(x.title)}</a>` : h(x.title)).join(" · ")}</p>`).join("") + `<p class="muted">Students choose a subject, type the page or question and their answer, and mark each subject started or finished.</p>`
        : m.levels ? m.levels.map(l => `<details class="pv-level"><summary><strong>${h(l.title)}</strong>${l.staff ? ` · ${h(l.staff)}` : ""} <span class="muted">${h(l.about || "")}</span></summary>${list(l.items)}</details>`).join("") : list(m.items)}
    </div>`;
};
