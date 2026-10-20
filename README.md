# Reset Program

Thomas Reddall High School's two-day Reset Program (pre- and post-suspension), run in the Hub. Each student has a Chromebook for the day. The website shows them their plan and walks them through it, so one staff member can run group sessions, individual sessions and different independent activities for up to five students at once.

**Live site:** https://jasefreters.github.io/TRHS/

- Student view: `index.html`
- Teacher dashboard: `teacher.html` (or click **Teacher** in the corner of the student view)

## How a day works

1. **Set up a student.** On the dashboard, click **New student**. The website makes an 8-character code such as `K7Q3-M2XD`. Write it next to the student's name on your offline list; the website never stores names.
2. **Plan the two days.** Each day has 10 sessions (below). Group sessions come from the room's rotation, and a default set of independent modules fills the rest. Drag modules and **individual sessions** onto sessions, or click one and then click a session. The plan editor warns if two students have an individual session at the same time, and reminds you about each day's review or success plan.
3. **Staffing.** On the **Run sheet**, type who's running each session. Whoever is on for a session runs any individual session in it. Print the run sheet for the day.
4. **Hand over the laptop.** Click **Student view on this laptop**. This logs you out of that laptop only and opens the student's plan. (Or the student types their code.)
5. **The student follows the plan.** The left pane shows the day, with the current session marked "Now" and a tick next to each finished part.
   - Morning session: social story and the morning survey.
   - Group sessions: laptops to the side.
   - Independent modules: on the laptop, at a reading level the student chooses (1–5), with a **Read aloud** button on every page. Finishing one shows a certificate and their answers, which they can save as a PDF or email.
   - Breaks: go to recess and lunch as normal, back to the Hub afterwards.
   - Afternoon debrief: the afternoon survey.
6. **Follow along.** The dashboard updates live: each student's sessions, results, missing core group sessions, **I need help** requests and who's staffing now. Tick a group session done for everyone in one click, and **Present** it on the projector. Open an individual session to see the student's surveys and module answers; the Day 2 success plan prints a **Return to class plan** to sign.
7. **Day 2 and finishing.** Click **Move to Day 2** the next morning. **Pause** a program if a student is away. **Finish program** turns the code off. The record stays.
8. **Follow-up.** About 4–6 weeks after they return, open the student's record and click **Start follow-up survey**. Their code works again for the survey only.

## Timetable

| Session | Time | |
| --- | --- | --- |
| 1 | 8:20–8:50 | Morning session (whole group): social story and morning survey |
| 2 | 8:50–9:23 | Group session |
| 3 | 9:23–9:55 | Independent or individual |
| 4 | 9:55–10:26 | Group session |
| | 10:26–10:56 | Recess |
| 5 | 10:56–11:23 | Independent or individual |
| 6 | 11:23–11:50 | Group session |
| 7 | 11:50–12:26 | Independent or individual |
| 8 | 12:26–1:02 | Group session |
| | 1:02–1:32 | Lunch |
| 9 | 1:32–2:05 | Independent or individual |
| 10 | 2:05–2:35 | Afternoon debrief (whole group) and afternoon survey |

**Group sessions** run on a two-day rotation, so every student gets all eight across their two days whichever day they start. Each stands alone.

| Time | Rotation A | Rotation B |
| --- | --- | --- |
| 8:50 | T-RED Values | Student Code of Conduct |
| 9:55 | RIOT: My Amazing Brain and Stress | RIOT: Thinking Traps and Problem-Solving |
| 11:23 | Wellbeing | Classroom Expectations |
| 12:26 | Chain Analysis | Self-Regulation |

Run sheets and projector slides for each are on the dashboard's **Session guides** page. RIOT, Wellbeing and Self-Regulation are outlines until the RIOT materials are added. Movement breaks are on hold.

**Individual sessions:** *Review of plans, goals and Sentral* (Day 1), *My success plan* (Day 2), *Classwork and assessment check-in*, and *Learning and support check*. Notes and testing results stay in Sentral and the school's usual systems.

## Independent modules

All of these stand alone and can be done in any order:

- **Modules 1–6:** the reflection halves of the school's module documents.
- **My Chain** (chain analysis), **T-RED Values in Action**, **Code of Conduct Check**.
- **Say It Better**, **Online Conflict and Social Media**, **Restorative Conversation Prep**, **Growth Mindset**, **Goal Builder**, **Healthy Habits Check**, **Asking for Help**, **Study Skills**.
- **Literacy:** Reading; Vocabulary; Spelling and Punctuation; Grammar and Sentences. Each has levels 1–5 (NSW Stages 1–5).
- **Numeracy:** a sample for now, to be replaced with questions from The Daily Dash.

**Videos** (in Module 2, My Chain and Growth Mindset) are YouTube clips chosen by title and channel. Preview each one before students use it, and change any in its module file. Each has a written summary underneath in case it won't play.

## Surveys and reports

Students do a short survey at the **start and end of each day**, and a **follow-up** a few weeks after going back to class. Every survey has the same 10 rating statements from the school's TRHS survey (score out of 50), plus a few written questions. Surveys done at the same time are the same length, so Day 1 and Day 2 students finish together.

The **Reports** page shows, for any date range (for example a term):
- programs started and finished
- % who did the first and last survey
- average Day 1 start → Day 2 end scores and the change
- the change per statement and the most improved areas
- each student's scores, including the follow-up
- what students found most helpful, and what extra support they asked for

**Download summary** and **Download all survey responses** give spreadsheets.

## Records

**All students** lists everyone who has been through the program. Search by code, filter by year, status or date, **Download spreadsheet** (one row per program), or **Delete old records** (for example at the end of the year). Click a student for their record:

- **Each program:** shown day by day, with their written answers and surveys and the reading levels they chose.
- **Edit program:** opens the plan editor. **Mark done** records an elective done another way. **Let them redo** clears one.
- **Print certificates** (optionally with answers) and **Print program record**. You type the name when printing; it isn't saved.
- **Pause / Resume**, **Reopen**, **Start a new program**, **Start follow-up survey**.
- **Delete program** removes one program. **Delete student** removes everything about a student; you confirm by typing their code.

## Changing things

- **Timetable, group sessions (guides and slides), rotations, individual sessions, default modules:** [`js/config.js`](js/config.js).
- **Surveys:** [`js/surveys.js`](js/surveys.js).
- **Words students see** (social stories, group, debrief and break messages, free choice): [`js/content.js`](js/content.js).
- **Modules:** one file each in [`js/modules/`](js/modules). Copy an existing one, give it a new `id`, and add a `<script>` line for it in both `index.html` and `teacher.html`. A module has either `items`, or `levels` (each with `items`). Add `score: false` for reflection modules. Item types:
  - `read`: a page of text (`title`, `text`)
  - `mc`: multiple choice (`q`, `choices`, `answer` = index of the right choice, optional `explain`)
  - `input`: type an answer (`q`, `answer`, optional `accept`, `prefix`, `suffix`, `text: true` for a word answer)
  - `sort`: tap cards into groups (`q`, `buckets`, `cards` with the right `bucket`)
  - `order`: put cards in order (`q`, `cards` in the right order)
  - `match`: drag or tap each answer onto its match (`q`, `pairs` of `left` and `right`)
  - `select`: choose what fits you (`q`, `options`, optional `pick`, `other: true`)
  - `write`: the student's own answers (`title`, optional `q`, `prompts`; `chain: true` draws them as linked steps)
  - `slider`: rate on sliders (`sliders` with `label`, `min`, `max`, `left`, `right`, `unit`)
  - `bodymap`: tap where on the body you feel it (`q`)
  - `story`: choose-your-path (`start`, `nodes` with `text` and `choices`, or `end: "good"`/`"bad"`)
  - `tiles`: build a sentence from word tiles (`parts`: text and `{ options }`; an option can have a `warn` message)
  - `video`: a YouTube clip (`youtube` id, `text` summary)
  - `scale`: a quick check-in, not saved (`q`, `labels`)
  - `rating`: rate statements 1–5 (surveys)
  - `breathe`: guided box breathing

  **Reading levels:** any item can have `easy` (replacement text for levels 1–2), read items can have `more` (extra detail for levels 4–5), and a module can have `deeper` prompts (added for level 5). Level 1 reads each page aloud.

  Answers stay on the laptop while the student works, then are saved with the module when it's finished, locked, and shown to the student with their certificate and to staff on the record.

Text can use `**bold**`, blank lines between paragraphs, `- ` at the start of a line for lists, and `[text](https://link)`.

Updating the site: commit to `main`, and bump the `?v=` number on the script and stylesheet tags in both HTML files so browsers load the new files straight away.

## Trying it out

Open the site with `?demo=1` on the end (for example `teacher.html?demo=1`) to use a pretend database that lives only in that browser. Any email and password log in. `?demo=0` turns it off. Add `&time=10:00` to see the day as it looks at a different time.

## Privacy

- No names or personal details are stored. Students are random codes; the code-to-name list stays offline with staff.
- Students don't log in. Their code only opens their own plan, and only while their program (or follow-up) is open.
- Teachers log in with their own Supabase accounts. Only emails on the staff list can see anything.
- The database stores session ticks, scores and reading levels, written answers from finished modules, and survey answers, all linked to the code only. Students are told their teacher reads their answers, and survey and module questions ask them not to write names or identifying details. Everything is deleted with the program or the student, or with **Delete old records**.
- Staff names typed on the run sheet are stored so the dashboard can show who's running each session.
- This repository and the website are public, so never put student information in them.

## Setting up

1. Create a Supabase project in the Sydney region.
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql) with the teachers' emails in its last lines.
3. Under **Authentication**, turn off new sign-ups and add each teacher as a user (with **Auto confirm**).
4. Put the project URL and publishable key in `js/config.js`.
5. In GitHub, go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, and save.

**Database updates:** if your database was set up before staffing, pause and follow-up surveys were added, run [`supabase/update-2.sql`](supabase/update-2.sql) once in a new SQL Editor query. The dashboard shows a reminder until it's done.

**Adding a teacher:** create them under **Authentication → Users** (email, password, Auto confirm), then paste [`supabase/add-staff.sql`](supabase/add-staff.sql) into a new SQL Editor query, put in their email and run it. Each teacher logs in with their own email; logging out on one computer doesn't affect others.
