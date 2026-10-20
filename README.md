# Reset Program

Thomas Reddall High School's two-day Reset Program (pre- and post-suspension). Each student has their own laptop for the day. The website shows them their plan and walks them through it, so one teacher can run group sessions, individual sessions and different independent activities for several students at once.

**Live site:** https://jasefreters.github.io/TRHS/ (after GitHub Pages is turned on, see below)

- Student view: `index.html`
- Teacher dashboard: `teacher.html` (or click **Teacher** in the corner of the student view)

## How a day works

1. **Teacher sets up a student.** On the dashboard, click **New student**. The website makes an 8-character code such as `K7Q3-M2XD`. Write it next to the student's name on your offline list; the website never stores names.
2. **Plan the two days.** Each day has 10 sessions (below). The group sessions come from the room's rotation. Drag electives onto the other sessions, or click an elective and then click a session. You can suggest a starting level for numeracy and literacy.
3. **Hand over the laptop.** Click **Student view on this laptop**. This logs the teacher out and opens the student's plan. (Or the student types their code on the student view.)
4. **The student follows the plan.** The left pane shows the day, with the current session highlighted by the clock and a tick next to each finished part. Group sessions tell them to put the laptop aside. Electives run on the laptop, save as they go and survive a reload. Finishing an elective shows a certificate (the student types their name, which is never saved) and, for the modules, their answers. They can reopen both from their plan at any time to print or save as a PDF.
5. **Teacher follows along.** The dashboard updates live: each student's sessions, results, missing core group sessions and **I need help** requests. Tick group sessions for everyone in one click. Mark individual sessions done after you've had them.
6. **Day 2 and finishing.** Click **Move to Day 2** the next morning. At the end, **Finish program** turns the code off. The record stays.

## Records

**All students** lists everyone who has been through the program, with their latest program, modules done, numeracy and literacy results, core group sessions, individual sessions and Day 1 → Day 2 survey scores. Search by code, filter by year, status or date, and **Download spreadsheet** (one row per program) to match codes to names offline.

Click a student to open their record:
- every program, day by day, and the **written answers** from each module they finished
- **Edit program** opens the plan editor, for current or finished programs. **Mark done** records an elective done another way, such as on paper. **Let them redo** clears one.
- **Print certificates** reprints any finished elective's certificate, optionally with the student's answers. **Print program record** prints a one-page summary for their file. You type the name when printing; it isn't saved.
- **Reopen** a program that was finished by mistake, or **Start a new program** for a returning student.
- **Delete program** removes one program. **Delete student** removes the student and everything about them; you confirm by typing their code.

## Timetable

| Session | Time | |
| --- | --- | --- |
| 1 | 8:20–8:50 | Morning session (whole group, social story) |
| 2 | 8:50–9:23 | P1 |
| 3, 4 | 9:23–9:55, 9:55–10:26 | P2 split in two |
| | 10:26–10:56 | Recess |
| 5, 6 | 10:56–11:23, 11:23–11:50 | P3 split in two |
| 7, 8 | 11:50–12:26, 12:26–1:02 | P4 split in two |
| | 1:02–1:32 | Lunch |
| 9 | 1:32–2:05 | P5 |
| 10 | 2:05–2:35 | Afternoon debrief (whole group) and end-of-day survey |

**Group sessions** (max 5 students, one staff member) run on a two-day rotation, so every student gets all of them across their two days whichever day they start:

| Rotation A | Rotation B |
| --- | --- |
| 8:50 T-RED Values | 8:50 Student Code of Conduct |
| 9:55 RIOT: My Amazing Brain and Stress | 10:56 RIOT: Thinking Traps and Problem-Solving |
| 11:23 Wellbeing | 12:26 Self-Regulation |
| 12:26 Chain Analysis | |

The other sessions are independent modules. Run sheets for every group session are on the dashboard's **Session guides** page.

**Individual sessions** are dragged into one of a student's independent sessions: *Review of plans, goals and Sentral* (Day 1), *My success plan* (Day 2) and *Learning and support check*. The dashboard warns if two students have one at the same time. Movement breaks are on hold for now.

**End-of-day surveys:** in the debrief, Day 1 students do the Day 1 (pre) survey and Day 2 students the Day 2 (post) survey. The 10 ratings give a score out of 50, and the change from Day 1 to Day 2 shows on the student's record and in the spreadsheet.

## Changing things

- **Timetable, group sessions and their guides, rotations, individual sessions, default electives:** [`js/config.js`](js/config.js).
- **Surveys:** [`js/surveys.js`](js/surveys.js). Mark a group session `core: true` if every student must do it across their two days.
- **Words students see** (social stories, group and debrief messages, free choice): [`js/content.js`](js/content.js).
- **Electives:** one file each in [`js/modules/`](js/modules). Copy an existing one, give it a new `id`, and add a `<script>` line for it in both `index.html` and `teacher.html`. An elective has either `items`, or `levels` that each have `items`. Add `score: false` for reflection modules (no score on the certificate). Item types:
  - `read`: a page of text (`title`, `text`)
  - `mc`: multiple choice (`q`, `choices`, `answer` = index of the right choice, optional `explain`)
  - `input`: type an answer (`q`, `answer`, optional `accept` list, `prefix`, `suffix`, `text: true` for a word answer)
  - `sort`: tap cards into groups (`q`, `buckets`, `cards` with the right `bucket` for each)
  - `order`: put cards in order (`q`, `cards` listed in the right order)
  - `scale`: rate yourself, no right answer and nothing saved (`q`, `labels`)
  - `select`: choose what fits you (`q`, `options`, optional `pick` = how many, `other: true` for "something else")
  - `write`: the student's own written answers (`title`, optional `q`, `prompts`; `chain: true` draws them as linked steps)
  - `rating`: rate statements 1–5 (`statements`, `low`, `high`), used in the surveys
  - `breathe`: guided box breathing (`text`, `rounds`)

  What students choose in `select` and write in `write` stays on the laptop while they work. When they finish the module it's sent with the module (in the session's `state.responses`), locked, and shown to the student with their certificate and to teachers on the student's record.

- **Modules:** [`module-1.js`](js/modules/module-1.js) to [`module-6.js`](js/modules/module-6.js) are the reflection halves of the school's module documents, rewritten so students can work through them on their own. [`my-chain.js`](js/modules/my-chain.js), [`tred-values.js`](js/modules/tred-values.js) and [`code-of-conduct-check.js`](js/modules/code-of-conduct-check.js) are built from the Chain Analysis video, the T-RED presentations and the Department's Student Code of Conduct. Every module stands alone. New students get a default set on each day (`RP.DEFAULT_ELECTIVES`), which teachers change in the plan editor.
- Numeracy and literacy are still samples, to be replaced.

Text can use `**bold**`, blank lines between paragraphs and `- ` at the start of a line for lists.

## Trying it out

Open the site with `?demo=1` on the end (for example `teacher.html?demo=1`) to use a pretend database that lives only in that browser. Any email and password log in. `?demo=0` turns it off. You can also add `&time=10:00` to see the day as it looks at a different time.

## Privacy

- No names or personal details are stored. Students are random codes; the code-to-name list stays offline with staff.
- Students don't log in. Their code only opens their own plan, and only while their program is active.
- Teachers log in with Supabase accounts. Only emails on the staff list in the database can see anything.
- The database records which sessions are done, elective scores and levels, where a student is up to inside an elective, and the written answers from each finished module. Students are told their teacher will read their answers and asked not to write other students' names. Answers are deleted with the program or the student.
- This repository and the website are public, so never put student information in them.

## Setting up (already done once)

1. Create a Supabase project in the Sydney region.
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql) with the teachers' emails in its last line.
3. Under **Authentication**, turn off new sign-ups and add each teacher as a user.
4. Put the project URL and publishable key in `js/config.js`.
5. In GitHub, go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, and save.

To add a teacher later: create them under **Authentication → Users**, then paste [`supabase/add-staff.sql`](supabase/add-staff.sql) into a new query in the **SQL Editor**, put in their email and run it.
