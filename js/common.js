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

RP.KIND_LABEL = {
  intro: "Whole group", debrief: "Whole group", group: "Group", independent: "On your own",
  free: "Free choice", one_to_one: "Individual", break: "Break"
};

// A fresh day using one of the rotations: fixed morning and debrief, the rotation's group
// sessions, and the default electives in the free slots. Individual sessions are dragged in by
// the teacher, so they're not placed here (they'd clash between students).
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
        : { day, slot, kind: "independent", activity: null, title: "Elective" });
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
