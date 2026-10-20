# Reset Program

Thomas Reddall High School's two-day Reset Program (pre- and post-suspension). Each student has their own laptop for the day. The website shows them their plan and walks them through it, so one teacher can run group sessions, 1:1s and different independent activities for several students at once.

**Live site:** https://jasefreters.github.io/TRHS/ (after GitHub Pages is turned on, see below)

- Student view: `index.html`
- Teacher dashboard: `teacher.html` (or click **Teacher** in the corner of the student view)

## How a day works

1. **Teacher sets up a student.** On the dashboard, click **New student**. The website makes an 8-character code such as `K7Q3-M2XD`. Write it next to the student's name on your offline list; the website never stores names.
2. **Plan the two days.** Each day has 10 sessions (below). The group sessions come from the room's rotation. Drag electives onto the other sessions, or click an elective and then click a session. You can suggest a starting level for numeracy and literacy.
3. **Hand over the laptop.** Click **Student view on this laptop**. This logs the teacher out and opens the student's plan. (Or the student types their code on the student view.)
4. **The student follows the plan.** The left pane shows the day, with the current session highlighted by the clock and a tick next to each finished part. Group sessions tell them to put the laptop aside. Electives run on the laptop, save as they go and survive a reload. Finishing an elective shows a certificate once: the student types their name (never saved) and prints or saves it as a PDF.
5. **Teacher follows along.** The dashboard updates live: each student's sessions, results, missing core group sessions and **I need help** requests. Tick group sessions for everyone in one click. Mark the 1:1 done after you've had it.
6. **Day 2 and finishing.** Click **Move to Day 2** the next morning. At the end, **Finish program** turns the code off. The record stays, so a returning student's history (electives done, levels and scores) shows up under **Returning student**.

## Timetable

| Session | Time | |
| --- | --- | --- |
| 1 | 8:20–8:50 | Morning session (whole group) |
| 2 | 8:50–9:23 | P1 |
| 3, 4 | 9:23–9:55, 9:55–10:26 | P2 split in two |
| | 10:26–10:56 | Recess |
| 5, 6 | 10:56–11:23, 11:23–11:50 | P3 split in two |
| 7, 8 | 11:50–12:26, 12:26–1:02 | P4 split in two |
| | 1:02–1:32 | Lunch |
| 9 | 1:32–2:05 | P5 |
| 10 | 2:05–2:35 | Afternoon debrief (whole group) |

The 1:1 has no set time: the teacher pulls the student out during independent work.

## Changing things

- **Timetable, group sessions, rotations, 1:1 topics:** [`js/config.js`](js/config.js). Mark a group session `core: true` if every student must do it across their two days.
- **Words students see** (social stories, group and debrief messages, free choice): [`js/content.js`](js/content.js).
- **Electives:** one file each in [`js/modules/`](js/modules). Copy an existing one, give it a new `id`, and add a `<script>` line for it in both `index.html` and `teacher.html`. An elective has either `items`, or `levels` that each have `items`. Item types:
  - `read`: a page of text (`title`, `text`)
  - `mc`: multiple choice (`q`, `choices`, `answer` = index of the right choice, optional `explain`)
  - `input`: type an answer (`q`, `answer`, optional `accept` list, `prefix`, `suffix`, `text: true` for a word answer)
  - `scale`: rate yourself, no right answer and nothing saved (`q`, `labels`)

  The current numeracy, literacy and self-regulation electives are samples, to be replaced with the school's modules.

Text can use `**bold**`, blank lines between paragraphs and `- ` at the start of a line for lists.

## Trying it out

Open the site with `?demo=1` on the end (for example `teacher.html?demo=1`) to use a pretend database that lives only in that browser. Any email and password log in. `?demo=0` turns it off. You can also add `&time=10:00` to see the day as it looks at a different time.

## Privacy

- No names or personal details are stored. Students are random codes; the code-to-name list stays offline with staff.
- Students don't log in. Their code only opens their own plan, and only while their program is active.
- Teachers log in with Supabase accounts. Only emails on the staff list in the database can see anything.
- The database records which sessions are done, elective scores and levels, and where a student is up to inside an elective. It doesn't save free-text answers.
- This repository and the website are public, so never put student information in them.

## Setting up (already done once)

1. Create a Supabase project in the Sydney region.
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql) with the teachers' emails in its last line.
3. Under **Authentication**, turn off new sign-ups and add each teacher as a user.
4. Put the project URL and publishable key in `js/config.js`.
5. In GitHub, go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, and save.

To add a teacher later: create them under **Authentication → Users**, then in **SQL Editor** run `insert into public.staff (email) values ('their.email@det.nsw.edu.au');`.
