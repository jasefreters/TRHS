# Reset Program: guidance for changes

Static site on GitHub Pages (`main`, root) with a Supabase database. Plain HTML/CSS/JS, no build step. `index.html` is the student laptop view, `teacher.html` the dashboard. Settings in `js/config.js`, student-facing words in `js/content.js`, electives in `js/modules/`, database in `supabase/schema.sql`. See `README.md` for how the program runs.

## Decisions made by the staff

- **No personal information in the database or the repo.** Students are random 8-character codes; staff keep the code-to-name list offline. Never add name, email or free-text fields that could identify a student without asking first. The certificate name is typed on the page and never saved.
- **Students don't log in.** Their code is the key, used only through the `student_*` database functions. Teachers log in with Supabase Auth and must be listed in `public.staff`.
- **Day shape:** 10 sessions. Session 1 (8:20–8:50) is the whole-group morning session with the social story; session 10 (2:05–2:35) is the whole-group afternoon debrief; sessions 2–9 are half-periods for group sessions and independent electives. The 1:1 has no fixed time (stored as slot 11).
- **Two-day rotation:** the room alternates group-session rotations, so students on Day 1 and Day 2 share group sessions. Every core group session must be done within the student's two days.
- **Electives are done independently** on the laptop, so the teacher is free for 1:1s. Group sessions tell students to put the laptop aside; the teacher ticks them off.
- **Certificates appear once**, straight after an elective is finished. A finished elective can't be redone unless the teacher clicks **Let them redo**.
- **Records kept for returning students:** electives finished, level and score, group sessions done.

## Before publishing

- Run the flows in a browser with `?demo=1` (teacher creates a student, plans the day, student completes an elective and gets the certificate). Check every answer in new elective content yourself.
- Changes to the database go in a new SQL file under `supabase/` for staff to run in the SQL Editor; keep `schema.sql` as the full current setup.
- Publishing: commit to `main` on `jasefreters/TRHS`.
