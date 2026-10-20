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
        // Teacher logins last only while this tab is open, and never on the student page.
        persistSession: isTeacherPage,
        storage: window.sessionStorage,
        storageKey: "rp-teacher-auth"
      }
    });

    return {
      demo: false,

      // Student (no login; the code is the key)
      studentLoad: async code => check(await sb.rpc("student_load", { p_code: code })),
      studentSave: async (code, sessionId, status, result, state) =>
        check(await sb.rpc("student_save", { p_code: code, p_session: sessionId, p_status: status, p_result: result || null, p_state: state || null })),
      studentHelp: async (code, on) => check(await sb.rpc("student_help", { p_code: code, p_on: on })),

      // Teacher
      async signIn(email, password) {
        check(await sb.auth.signInWithPassword({ email, password }));
        if (!(await this.isStaff())) {
          await sb.auth.signOut();
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
      signOut: async () => { await sb.auth.signOut(); },

      listActive: async () => check(await sb.from("visits")
        .select(`id, start_date, current_day, help_requested_at, created_at, student:students(id, code, year_level), sessions(${SESSION_FIELDS})`)
        .eq("active", true).order("created_at")),

      getVisit: async id => check(await sb.from("visits")
        .select(`id, student_id, start_date, current_day, active, help_requested_at, student:students(id, code, year_level), sessions(${SESSION_FIELDS})`)
        .eq("id", id).maybeSingle()),

      findStudent: async code => check(await sb.from("students")
        .select(`id, code, year_level, created_at, visits(id, start_date, active, current_day, sessions(${SESSION_FIELDS}))`)
        .eq("code", RP.normaliseCode(code)).maybeSingle()),

      listAll: async () => check(await sb.from("students")
        .select(`id, code, year_level, created_at, visits(id, start_date, active, current_day, created_at, sessions(${SESSION_FIELDS}))`)
        .order("created_at", { ascending: false })),

      getStudent: async id => check(await sb.from("students")
        .select(`id, code, year_level, created_at, visits(id, start_date, active, current_day, created_at, sessions(${SESSION_FIELDS}))`)
        .eq("id", id).maybeSingle()),

      updateStudent: async (id, patch) => check(await sb.from("students").update(patch).eq("id", id).select("id").single()),
      async deleteStudent(id) { const { error } = await sb.from("students").delete().eq("id", id); if (error) throw new Error(error.message); },
      async deleteVisit(id) { const { error } = await sb.from("visits").delete().eq("id", id); if (error) throw new Error(error.message); },

      createStudent: async yearLevel => check(await sb.from("students")
        .insert({ year_level: yearLevel || null }).select("id, code, year_level").single()),

      async startVisit(studentId, rows) {
        const visit = check(await sb.from("visits").insert({ student_id: studentId }).select("id").single());
        const { error } = await sb.from("sessions").insert(rows.map(r => Object.assign({ visit_id: visit.id }, r)));
        if (error) {
          await sb.from("visits").delete().eq("id", visit.id);
          throw new Error(error.message);
        }
        return visit.id;
      },

      updateSession: async (id, patch) => check(await sb.from("sessions")
        .update(Object.assign({ updated_at: new Date().toISOString() }, patch)).eq("id", id).select(SESSION_FIELDS).single()),

      updateVisit: async (id, patch) => check(await sb.from("visits").update(patch).eq("id", id).select("id").single()),

      subscribe(onChange) {
        const channel = sb.channel("rp-dashboard")
          .on("postgres_changes", { event: "*", schema: "public", table: "visits" }, onChange)
          .on("postgres_changes", { event: "*", schema: "public", table: "sessions" }, onChange)
          .subscribe();
        return () => sb.removeChannel(channel);
      }
    };
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
          current_day: v.current_day, help: !!v.help_requested_at,
          sessions: db.sessions.filter(s => s.visit_id === v.id).sort((a, b) => a.day - b.day || a.slot - b.slot)
        });
      },
      async studentSave(code, sessionId, status, result, state) {
        const db = load(), v = activeVisit(db, code);
        const s = v && db.sessions.find(s => s.id === sessionId && s.visit_id === v.id &&
          ["intro", "independent", "free", "debrief"].includes(s.kind) && s.status !== "done");
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
      async startVisit(studentId, rows) {
        const db = load();
        if (db.visits.some(v => v.student_id === studentId && v.active)) throw new Error("This student already has an active program.");
        const now = new Date().toISOString();
        const v = { id: RP.uuid(), student_id: studentId, start_date: now.slice(0, 10), current_day: 1, active: true, help_requested_at: null, created_at: now };
        db.visits.push(v);
        rows.forEach(r => db.sessions.push(Object.assign({ id: RP.uuid(), visit_id: v.id, status: "not_started", result: null, state: null, updated_at: now, completed_at: null }, r)));
        store(db); return v.id;
      },
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
