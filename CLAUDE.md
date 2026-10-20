# Reset Program: guidance for changes

Static site on GitHub Pages (`main`, root) with a Supabase database. Plain HTML/CSS/JS, no build step. `index.html` is the student laptop view, `teacher.html` the dashboard. Settings in `js/config.js`, student-facing words in `js/content.js`, electives in `js/modules/`, database in `supabase/schema.sql`. See `README.md` for how the program runs.

## Decisions made by the staff

- **No personal information in the database or the repo.** Students are random 8-character codes; staff keep the code-to-name list offline. Never add name or email fields. Module written answers are stored at staff request (see below); ask before storing any other free text. The certificate name is typed on the page and never saved.
- **Students don't log in.** Their code is the key, used only through the `student_*` database functions. Teachers log in with Supabase Auth and must be listed in `public.staff`.
- **Day shape:** 10 sessions. Session 1 (8:20–8:50) is the whole-group morning session with the social story; session 10 (2:05–2:35) is the whole-group afternoon debrief with the end-of-day survey; sessions 2–9 are half-periods for group sessions, independent electives and individual sessions.
- **Two-day rotation:** the room alternates group-session rotations, so students on Day 1 and Day 2 share group sessions. Every core group session must be done within the student's two days, so **each group session and each independent module must stand alone**: there's no guaranteed order.
- **Group sessions** (max 5 students, 1 staff member; run sheets in `RP.GROUP_SESSIONS[].guide`, shown on the dashboard's Session guides page): T-RED Values, RIOT (two standalone sessions, one per rotation), Wellbeing, Self-Regulation, Student Code of Conduct, Chain Analysis. Rotation A runs four, B three. In group sessions use made-up examples; never ask a student to share their own incident.
- **Individual sessions** are dragged into a slot by the teacher (kind `one_to_one`, `RP.INDIVIDUAL_SESSIONS`): Day 1 review of plans, goals and Sentral; Day 2 success plan; learning and support check. One student at a time: the plan editor and board warn about clashes. Older plans may still have an untimed 1:1 in slot 11.
- **Movement breaks** (boxing, circuits…) are on hold while the staff work out how to run them. They stay in the plan editor palette but aren't in the rotations or core.
- **End-of-day surveys** (`js/surveys.js`): Day 1 = pre survey, Day 2 = post survey, from the school's TRHS survey. The 10 ratings are saved in the debrief session's `result` (`ratings`, `total`) and the written answers in `state.responses`, so Day 1 → Day 2 change shows on records and in the spreadsheet.
- **Electives are done independently** on the laptop, so the teacher is free for 1:1s. Group sessions tell students to put the laptop aside; the teacher ticks them off.
- A finished elective can't be redone unless the teacher clicks **Let them redo**.
- **Records kept for returning students:** electives finished, level and score, group sessions done.
- **Written answers go to the teacher once submitted.** `write` and `select` answers stay on the laptop while the student works, then are saved with the module when it's finished (`sessions.state.responses`), locked, and shown on the student's certificate page and the teacher's record page. Students are told their teacher will read them. Prompts stay optional, as the staff notes ask not to force disclosure.
- **Certificates can be reopened** by the student from their plan, and reprinted by teachers. Names are typed at print time and never saved.
- **Independent modules** are as interactive as possible (sort, order, select, rating, breathing, chain-writing, scenarios). `module-1`…`module-6` are the reflection halves of the school's module documents; `my-chain`, `tred-values` and `code-of-conduct-check` are built from the school's Chain Analysis video, T-RED presentations and the Department's Student Code of Conduct. Keep the school's wording when editing them.
- **Branding:** colours from the school's colour hierarchy (maroon, light blue and dark navy primary; royal blue secondary; greys). The colour hierarchy image is a palette guide only: **never use it as a logo or picture on the site.** The logo is the sun rising over an open book (`RP.logo`, drawn as SVG). Motto: "Focusing on our Future".

## Before publishing

- Run the flows in a browser with `?demo=1` (teacher creates a student, plans the day, student completes an elective and gets the certificate). Check every answer in new elective content yourself.
- Changes to the database go in a new SQL file under `supabase/` for staff to run in the SQL Editor; keep `schema.sql` as the full current setup.
- Publishing: commit to `main` on `jasefreters/TRHS`. Bump the `?v=` number on every script and stylesheet tag in `index.html` and `teacher.html` so browsers load the new files straight away.
