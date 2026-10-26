/*
  Everything that talks to the database. RP.api uses Supabase, or a pretend database kept in
  this browser when the site is opened with ?demo=1 (for trying things out; ?demo=0 turns it off).
*/
window.RP = window.RP || {};

(function () {
  const SESSION_FIELDS = "id, visit_id, day, slot, kind, activity, title, status, result, state, updated_at, completed_at";

  function check({ data, error }) {
    if (error) throw new Error(error.message || "Database error");
    return data;
  }

  // ---------------------------------------------------------------- Supabase
  function supabaseApi(isTeacherPage) {
    const sb = supabase.createClient(RP.SUPABASE_URL, RP.SUPABASE_KEY, {
      auth: {
        // Teacher logins are kept in this browser (shared safely between tabs) until the teacher
        // locks the dashboard or opens a student view. The student page never keeps a login.
        persistSession: isTeacherPage,
        storageKey: "rp-teacher-auth"
      }
    });
    try { sessionStorage.removeItem("rp-teacher-auth"); } catch (e) { /* older versions kept it here */ }

    // Every teacher request needs a live login. Without one the database would treat the request
    // as coming from someone not logged in and quietly show nothing or refuse to save.
    async function requireLogin() {
      const { data } = await sb.auth.getSession();
      if (!data.session) throw new Error("Not logged in");
    }
    const teacher = fn => async (...args) => { await requireLogin(); return fn(...args); };

    // Until supabase/update-2.sql and update-3.sql have been run, the newer columns and tables
    // don't exist. Ask for what's there and note which update is needed.
    const missing = error => /does not exist|schema cache|Could not find/i.test(error.message || "");
    const missingV2 = error => /kind|paused|staffing/.test(error.message || "") && missing(error);
    const missingV3 = error => /times/.test(error.message || "") && missing(error);
    async function withV2(query) {
      if (!api.needsUpdate && !api.needsUpdate3) {
        const res = await query("kind, paused, times, ");
        if (!res.error || !(missingV3(res.error) || missingV2(res.error))) return res;
        api.needsUpdate3 = true;
      }
      if (!api.needsUpdate) {
        const res = await query("kind, paused, ");
        if (!res.error || !missingV2(res.error)) return res;
        api.needsUpdate = true;
      }
      return query("");
    }

    const api = {
      demo: false,
      needsUpdate: false,   // supabase/update-2.sql not run yet
      needsUpdate3: false,  // supabase/update-3.sql not run yet

      // Student (no login; the code is the key)
      studentLoad: async code => check(await sb.rpc("student_load", { p_code: code })),
      studentSave: async (code, sessionId, status, result, state) =>
        check(await sb.rpc("student_save", { p_code: code, p_session: sessionId, p_status: status, p_result: result || null, p_state: state || null })),
      studentHelp: async (code, on) => check(await sb.rpc("student_help", { p_code: code, p_on: on })),

      // Teacher
      async signIn(email, password) {
        check(await sb.auth.signInWithPassword({ email, password }));
        if (!(await this.isStaff())) {
          await sb.auth.signOut({ scope: "local" });
          throw new Error("This login isn't on the staff list. Ask whoever set up the database to add your email.");
        }
      },
      async isStaff() {
        const { data } = await sb.auth.getSession();
        if (!data.session) return false;
        return !!check(await sb.rpc("is_staff"));
      },
      async currentEmail() {
        const { data } = await sb.auth.getSession();
        return data.session ? data.session.user.email : null;
      },
      // "local" logs out this browser only. The default would log the teacher out on every
      // device, so setting up a student laptop would break the dashboard on the teacher's own.
      signOut: async () => { await sb.auth.signOut({ scope: "local" }); },
      onSignedOut(cb) {
        sb.auth.onAuthStateChange(event => { if (event === "SIGNED_OUT") cb(); });
      },

      // Columns added by supabase/update-2.sql. Until it's run, ask for the older set instead.
      listActive: teacher(async () => check(await withV2(v => sb.from("visits")
        .select(`id, start_date, current_day, help_requested_at, created_at, ${v}student:students(id, code, year_level), sessions(${SESSION_FIELDS})`)
        .eq("active", true).order("created_at")))),

      getVisit: teacher(async id => check(await withV2(v => sb.from("visits")
        .select(`id, student_id, start_date, current_day, active, help_requested_at, ${v}student:students(id, code, year_level), sessions(${SESSION_FIELDS})`)
        .eq("id", id).maybeSingle()))),

      findStudent: teacher(async code => check(await withV2(v => sb.from("students")
        .select(`id, code, year_level, created_at, visits(id, start_date, active, current_day, ${v}sessions(${SESSION_FIELDS}))`)
        .eq("code", RP.normaliseCode(code)).maybeSingle()))),

      listAll: teacher(async () => check(await withV2(v => sb.from("students")
        .select(`id, code, year_level, created_at, visits(id, start_date, active, current_day, created_at, ${v}sessions(${SESSION_FIELDS}))`)
        .order("created_at", { ascending: false })))),

      getStudent: teacher(async id => check(await withV2(v => sb.from("students")
        .select(`id, code, year_level, created_at, visits(id, start_date, active, current_day, created_at, ${v}sessions(${SESSION_FIELDS}))`)
        .eq("id", id).maybeSingle()))),

      // Who's running each session on a date: { slot: "Ms Smith" }.
      getStaffing: teacher(async date => {
        const { data, error } = await sb.from("staffing").select("slot, staff").eq("date", date);
        if (error) { if (missingV2(error)) { api.needsUpdate = true; return {}; } throw new Error(error.message); }
        const out = {}; data.forEach(r => { out[r.slot] = r.staff; }); return out;
      }),
      setStaffing: teacher(async (date, slot, staff) => {
        if (api.needsUpdate) throw new Error("Run supabase/update-2.sql in Supabase first.");
        check(await sb.from("staffing").upsert({ date, slot, staff: String(staff || "").slice(0, 80) }));
      }),

      updateStudent: teacher(async (id, patch) => check(await sb.from("students").update(patch).eq("id", id).select("id").single())),
      deleteStudent: teacher(async id => { const { error } = await sb.from("students").delete().eq("id", id); if (error) throw new Error(error.message); }),
      deleteVisit: teacher(async id => { const { error } = await sb.from("visits").delete().eq("id", id); if (error) throw new Error(error.message); }),

      createStudent: teacher(async yearLevel => check(await sb.from("students")
        .insert({ year_level: yearLevel || null }).select("id, code, year_level").single())),

      startVisit: teacher(async (studentId, rows, fields) => {
        if (fields && fields.kind && fields.kind !== "program" && api.needsUpdate) throw new Error("Run supabase/update-2.sql in Supabase first.");
        const visit = check(await sb.from("visits").insert(Object.assign({ student_id: studentId }, fields || {})).select("id").single());
        const { error } = await sb.from("sessions").insert(rows.map(r => Object.assign({ visit_id: visit.id }, r)));
        if (error) {
          await sb.from("visits").delete().eq("id", visit.id);
          throw new Error(error.message);
        }
        return visit.id;
      }),

      // Extra sessions staff add to a day on the daily schedule (e.g. three 20-minute sessions in a period).
      addSessions: teacher(async (visitId, rows) => {
        const { error } = await sb.from("sessions").insert(rows.map(r => Object.assign({ visit_id: visitId }, r)));
        if (error) throw new Error(error.message);
      }),
      deleteSession: teacher(async id => { const { error } = await sb.from("sessions").delete().eq("id", id); if (error) throw new Error(error.message); }),

      updateSession: teacher(async (id, patch) => check(await sb.from("sessions")
        .update(Object.assign({ updated_at: new Date().toISOString() }, patch)).eq("id", id).select(SESSION_FIELDS).single())),

      updateVisit: teacher(async (id, patch) => {
        if ("paused" in patch && api.needsUpdate) throw new Error("Run supabase/update-2.sql in Supabase first.");
        if ("times" in patch && api.needsUpdate3) throw new Error("Changing session times needs supabase/update-3.sql to be run in Supabase first.");
        return check(await sb.from("visits").update(patch).eq("id", id).select("id").single());
      }),

      subscribe(onChange) {
        const channel = sb.channel("rp-dashboard")
          .on("postgres_changes", { event: "*", schema: "public", table: "visits" }, onChange)
          .on("postgres_changes", { event: "*", schema: "public", table: "sessions" }, onChange)
          .subscribe();
        return () => sb.removeChannel(channel);
      }
    };
    return api;
  }

  // ---------------------------------------------------------------- Demo (this browser only)
  function demoApi() {
    const KEY = "rp-demo-db";
    const listeners = new Set();
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { students: [], visits: [], sessions: [] }; } catch (e) { return { students: [], visits: [], sessions: [] }; } };
    const store = db => { localStorage.setItem(KEY, JSON.stringify(db)); listeners.forEach(f => f()); };
    window.addEventListener("storage", e => { if (e.key === KEY) listeners.forEach(f => f()); });
    const clone = x => JSON.parse(JSON.stringify(x));
    const newCode = () => { const a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; let c = ""; for (let i = 0; i < 8; i++) c += a[Math.floor(Math.random() * a.length)]; return c; };
    const activeVisit = (db, code) => {
      const s = db.students.find(s => s.code === RP.normaliseCode(code));
      return s && db.visits.find(v => v.student_id === s.id && v.active);
    };
    const withSessions = (db, v) => Object.assign({}, v, {
      student: db.students.find(s => s.id === v.student_id),
      sessions: db.sessions.filter(s => s.visit_id === v.id)
    });
    let signedIn = sessionStorage.getItem("rp-demo-teacher");

    return {
      demo: true,
      async studentLoad(code) {
        const db = load(), v = activeVisit(db, code);
        if (!v) return null;
        return clone({
          current_day: v.current_day, help: !!v.help_requested_at, paused: !!v.paused, kind: v.kind || "program", times: v.times || null,
          sessions: db.sessions.filter(s => s.visit_id === v.id).sort((a, b) => a.day - b.day || a.slot - b.slot)
        });
      },
      async studentSave(code, sessionId, status, result, state) {
        const db = load(), v = activeVisit(db, code);
        const s = v && db.sessions.find(s => s.id === sessionId && s.visit_id === v.id &&
          (["intro", "independent", "free", "debrief", "survey"].includes(s.kind) || (s.kind === "group" && s.activity === "riot")) && s.status !== "done");
        if (!s) return false;
        if (status) s.status = status;
        if (result) s.result = result;
        if (state) s.state = state;
        s.updated_at = new Date().toISOString();
        if (status === "done") s.completed_at = s.updated_at;
        store(db);
        return true;
      },
      async studentHelp(code, on) {
        const db = load(), v = activeVisit(db, code);
        if (!v) return false;
        v.help_requested_at = on ? new Date().toISOString() : null;
        store(db);
        return true;
      },
      async signIn(email) { signedIn = email || "demo"; sessionStorage.setItem("rp-demo-teacher", signedIn); },
      async isStaff() { return !!signedIn; },
      async currentEmail() { return signedIn; },
      async signOut() { signedIn = null; sessionStorage.removeItem("rp-demo-teacher"); },
      onSignedOut() {},
      async listActive() {
        const db = load();
        return clone(db.visits.filter(v => v.active).sort((a, b) => a.created_at.localeCompare(b.created_at)).map(v => withSessions(db, v)));
      },
      async getVisit(id) { const db = load(), v = db.visits.find(v => v.id === id); return v ? clone(withSessions(db, v)) : null; },
      async findStudent(code) {
        const db = load(), s = db.students.find(s => s.code === RP.normaliseCode(code));
        if (!s) return null;
        return clone(Object.assign({}, s, { visits: db.visits.filter(v => v.student_id === s.id).map(v => withSessions(db, v)) }));
      },
      async listAll() {
        const db = load();
        return clone(db.students.slice().sort((a, b) => b.created_at.localeCompare(a.created_at))
          .map(s => Object.assign({}, s, { visits: db.visits.filter(v => v.student_id === s.id).map(v => withSessions(db, v)) })));
      },
      async getStudent(id) {
        const db = load(), s = db.students.find(s => s.id === id);
        return s ? clone(Object.assign({}, s, { visits: db.visits.filter(v => v.student_id === s.id).map(v => withSessions(db, v)) })) : null;
      },
      async updateStudent(id, patch) {
        const db = load(), s = db.students.find(s => s.id === id);
        if (!s) throw new Error("Student not found");
        Object.assign(s, patch); store(db); return { id };
      },
      async deleteStudent(id) {
        const db = load();
        const vids = db.visits.filter(v => v.student_id === id).map(v => v.id);
        db.sessions = db.sessions.filter(x => !vids.includes(x.visit_id));
        db.visits = db.visits.filter(v => v.student_id !== id);
        db.students = db.students.filter(s => s.id !== id);
        store(db);
      },
      async deleteVisit(id) {
        const db = load();
        db.sessions = db.sessions.filter(x => x.visit_id !== id);
        db.visits = db.visits.filter(v => v.id !== id);
        store(db);
      },
      async createStudent(yearLevel) {
        const db = load(), s = { id: RP.uuid(), code: newCode(), year_level: yearLevel || null, created_at: new Date().toISOString() };
        db.students.push(s); store(db); return clone(s);
      },
      async getStaffing(date) { const db = load(); return clone((db.staffing || {})[date] || {}); },
      async setStaffing(date, slot, staff) {
        const db = load(); db.staffing = db.staffing || {}; db.staffing[date] = db.staffing[date] || {};
        db.staffing[date][slot] = String(staff || "").slice(0, 80); store(db);
      },
      async startVisit(studentId, rows, fields) {
        const db = load();
        if (db.visits.some(v => v.student_id === studentId && v.active)) throw new Error("This student already has an active program.");
        const now = new Date().toISOString();
        const v = Object.assign({ id: RP.uuid(), student_id: studentId, start_date: now.slice(0, 10), current_day: 1, active: true, kind: "program", paused: false, help_requested_at: null, created_at: now }, fields || {});
        db.visits.push(v);
        rows.forEach(r => db.sessions.push(Object.assign({ id: RP.uuid(), visit_id: v.id, status: "not_started", result: null, state: null, updated_at: now, completed_at: null }, r)));
        store(db); return v.id;
      },
      async addSessions(visitId, rows) {
        const db = load(), now = new Date().toISOString();
        rows.forEach(r => db.sessions.push(Object.assign({ id: RP.uuid(), visit_id: visitId, status: "not_started", result: null, state: null, updated_at: now, completed_at: null }, r)));
        store(db);
      },
      async deleteSession(id) { const db = load(); db.sessions = db.sessions.filter(s => s.id !== id); store(db); },
      async updateSession(id, patch) {
        const db = load(), s = db.sessions.find(s => s.id === id);
        if (!s) throw new Error("Session not found");
        Object.assign(s, patch, { updated_at: new Date().toISOString() });
        store(db); return clone(s);
      },
      async updateVisit(id, patch) {
        const db = load(), v = db.visits.find(v => v.id === id);
        if (!v) throw new Error("Visit not found");
        if (patch.active && db.visits.some(o => o.id !== id && o.student_id === v.student_id && o.active)) {
          throw new Error('duplicate key value violates unique constraint "visits_one_active_per_student"');
        }
        Object.assign(v, patch); store(db); return { id };
      },
      subscribe(onChange) { listeners.add(onChange); return () => listeners.delete(onChange); }
    };
  }

  RP.connect = function (isTeacherPage) {
    RP.api = RP.isDemo() ? demoApi() : supabaseApi(isTeacherPage);
    return RP.api;
  };
})();
