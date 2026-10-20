/*
  Reset Program settings. Edit this file to change the timetable, group sessions or rotations.
*/
window.RP = window.RP || {};

// Supabase project. The publishable key is meant to be public; never put the secret key here.
RP.SUPABASE_URL = "https://zaotkcxrwwqlvzsrdwpe.supabase.co";
RP.SUPABASE_KEY = "sb_publishable_n2dLf_pN3wzMDqQNf-M5xQ_abfXr24U";

// The school day. Sessions 1 and 10 are the whole-group morning session and afternoon debrief;
// sessions 2–9 are the half-periods that teachers fill with group sessions and electives.
RP.TIMETABLE = [
  { slot: 1, start: "08:20", end: "08:50", period: "P1" },
  { slot: 2, start: "08:50", end: "09:23", period: "P1" },
  { slot: 3, start: "09:23", end: "09:55", period: "P2" },
  { slot: 4, start: "09:55", end: "10:26", period: "P2" },
  { brk: "Recess", start: "10:26", end: "10:56" },
  { slot: 5, start: "10:56", end: "11:23", period: "P3" },
  { slot: 6, start: "11:23", end: "11:50", period: "P3" },
  { slot: 7, start: "11:50", end: "12:26", period: "P4" },
  { slot: 8, start: "12:26", end: "13:02", period: "P4" },
  { brk: "Lunch", start: "13:02", end: "13:32" },
  { slot: 9, start: "13:32", end: "14:05", period: "P5" },
  { slot: 10, start: "14:05", end: "14:35", period: "P5" }
];
RP.FIRST_SLOT = 1;
RP.LAST_SLOT = 10;
// Older plans kept the 1:1 as an untimed slot 11. New plans drag individual sessions into a
// session slot instead (see RP.INDIVIDUAL_SESSIONS).
RP.ONE_TO_ONE_SLOT = 11;

// Teacher-led group sessions (max 5 students, 1 staff member). "core" ones must be done at least
// once across a student's two days; the dashboard shows any still missing. "about" is shown on the
// student's screen; "guide" is the teacher's run sheet on the dashboard's Session guides page.
// Each session must make sense on its own: students start on either rotation.
RP.GROUP_SESSIONS = [
  {
    id: "t-red", title: "T-RED Values", core: true,
    about: `Our school values: **Thrive, Represent, Excel, Deliver**. You'll work as a team on a challenge and talk about what each value looks like.`,
    guide: `**Aim:** students can explain Thrive, Represent, Excel and Deliver and give an example of each. **Materials:** the two T-RED presentations, 20 spaghetti sticks, 1 marshmallow, 1 m string, 1 m tape, T-RED value cards (Resilience, Aspiration, Belonging · Collaborate, Compliance, Respect · High expectations, Determination, Preparation · Commitment, Punctuality, Participation) and four headings.

- **5 min: what are values?** Slides 3–7 of *Lesson 1 – TRED Values* / *T-RED values presentation*. Each student names one thing they value.
- **8 min: Marshmallow Tower (Thrive).** All students as one team, 5 minutes to build the tallest free-standing tower with the marshmallow on top. Debrief: what happened when it fell? What helped the team keep going? That's resilience, part of Thrive.
- **7 min: values sort (Excel).** Students place the 12 value cards under the four headings together. Everyone must place at least two.
- **7 min: Martin at the aquarium (Represent).** Read the scenario (slide 9). What might the aquarium staff now think of Martin's school? What could Martin have done instead?
- **3 min: Deliver.** Each student says one thing they'll deliver on tomorrow or back in class.

**With fewer students:** do the tower in pairs or as a timed personal challenge. Bingo and Block Party need more players, so they're left out.`
  },
  {
    id: "riot-1", title: "RIOT: My Amazing Brain and Stress", core: true,
    about: `Resilience in our Teens. Learn what happens in your brain and body when stress and emotions build up, and how to bring them back down.`,
    guide: `Stands alone: some students will have done *RIOT: Thinking Traps and Problem-Solving* first, some not. **Materials:** a clear cup or bucket, water jug, small paper "stress" cards, a towel.

- **5 min: hand model of the brain.** Everyone makes the fist model; show "flipping your lid". Ask: when have you seen someone flip their lid on TV or in sport?
- **8 min: fight, flight, freeze.** Students act out (without contact) or describe what each looks like at school. Link to body signs: heart, face, fists, voice.
- **10 min: stress bucket.** Each student writes 2–3 things that fill their bucket on cards (keep it general if they prefer) and drops them in, while you pour water. Then each names a "tap" (healthy release) and you pour some out. Talk about what happens when it overflows.
- **5 min: one tap I'll use.** Each student picks one tap for this week.

**With one staff member:** keep cards anonymous if students are reluctant; read a few aloud yourself.`
  },
  {
    id: "riot-2", title: "RIOT: Thinking Traps and Problem-Solving", core: true,
    about: `Resilience in our Teens. Spot unhelpful thinking, work out what's in your control, and practise solving problems step by step.`,
    guide: `Stands alone: some students will have done *RIOT: My Amazing Brain and Stress* first, some not. **Materials:** a rope or hoop (circle of control), statement cards, whiteboard.

- **5 min: thinking traps.** Read out thoughts ("Everyone's against me", "If I walk away I look weak", "I've ruined everything"). Students hold up thumbs if they've heard or thought it.
- **8 min: check the thought.** In a pair or as a group, take one thought: evidence for, evidence against, what would you tell a friend, a more helpful thought.
- **8 min: circle of control.** Lay the rope on the floor. Students place statement cards inside (my words, asking for help, effort, using strategies) or outside (others' opinions, what's already happened).
- **8 min: problem-solving steps.** Model on the board with a school scenario: what's the problem → options → consequences of each → choose → check how it went.

**With one staff member:** you run the board; students take turns reading cards so everyone speaks.`
  },
  {
    id: "wellbeing", title: "Wellbeing", core: true,
    about: `What keeps you well: sleep, food, movement, connection and having people to talk to. You'll check in on your own wellbeing and pick one small change.`,
    guide: `**Materials:** printed wellbeing wheel (sleep, food, movement, screens, friends and family, fun, feeling safe, people to talk to), pens, a ball.

- **5 min: check-in circle.** Pass the ball; each student rates their week out of 10 (can pass).
- **10 min: wellbeing wheel.** Each student shades how well each area is going for them (private, not shared unless they want to).
- **8 min: small changes.** As a group, brainstorm one realistic idea per area (e.g. phone out of the bedroom, breakfast before school). Each student picks one to try.
- **5 min: my support network.** Students name (to themselves or on paper) one adult at school and one outside school they can talk to.

**Watch for:** anything a student says or writes that needs follow-up; record and follow wellbeing procedures.`
  },
  {
    id: "self-regulation", title: "Self-Regulation", core: true,
    about: `Notice your warning signs early and practise strategies that help you stay in control, such as breathing, grounding and taking a break.`,
    guide: `**Materials:** colour cards (blue = low, green = calm/ready, yellow = wound up, red = out of control), timer, strategy cards.

- **5 min: colour check-in.** Each student holds up the colour that matches how they feel now. Normalise all colours.
- **8 min: warning signs.** Group list on the board: what do you notice in your body, thoughts and actions as you move from green to yellow to red?
- **12 min: practise together.** Run three strategies for real: box breathing (4-4-4-4, 3 rounds), 5-4-3-2-1 grounding, and tense-and-release muscles. After each, students rate it: helpful, maybe, not for me.
- **5 min: my calm plan.** Each student picks their top two strategies and when they'll use them ("When I notice ___, I'll ___").

**Tip:** model the strategies yourself; students join in more when the adult does it too.`
  },
  {
    id: "code-of-conduct", title: "Student Code of Conduct", core: true,
    about: `The NSW Department of Education Student Code of Conduct: **be respectful, be responsible, be safe**. What it means and what it looks like at our school.`,
    guide: `**Materials:** the Department's *Student code of conduct* (one page), statement cards cut from it, three headings (Respect everyone, Be responsible, Be safe), scenario cards.

- **5 min: why a Code?** Read the opening ("In NSW public schools everyone belongs…"). It applies on and off site and online.
- **10 min: card sort.** Students sort the "I will…" statements under the three headings together, then check against the Code.
- **10 min: scenarios.** For each card, which part of the Code is involved and what would a good choice be? Ideas: a mean group-chat post, a friend offering a vape, being late most days, an argument in the canteen line, a teacher's instruction you think is unfair.
- **5 min: my part.** Each student names one thing from the Code they'll focus on when they return.

**Note:** link "To keep everyone safe, I must not…" to why suspensions happen, without singling out any student's incident.`
  },
  {
    id: "chain-analysis", title: "Chain Analysis", core: true,
    about: `Big reactions don't come out of nowhere. Learn to spot the small steps (the links in the chain) that lead up to a behaviour, and where you could break the chain.`,
    guide: `A DBT skill. Use a **made-up example** in the group; students do their own chain privately (the *My Chain* module or an individual session). **Materials:** paper strips, markers, tape, scissors, scenario cards. Video for staff or the group: [Chain analysis explained](https://youtu.be/cOhcIi2w1gs).

- **5 min: the idea.** A behaviour is the end of a chain: vulnerabilities → trigger → thoughts → feelings and body → urges and actions → behaviour → consequences.
- **12 min: build a paper chain.** Read the example ("Jay": up until 2am, no breakfast, phone taken in period 1, asked to move seats in front of friends, thinks "they always pick on me", face goes hot, argues, swears, sent out). Students write one link per paper strip and loop them into a chain.
- **8 min: break the chain.** Students take turns cutting a link and saying what Jay could have done differently at that point (eat breakfast, take a breath, ask to talk after class…).
- **5 min: chain breakers.** Each student picks one skill they could use to break their own chains.

**Keep it safe:** don't ask students to share their own incident in the group.`
  },
  // Movement breaks are being worked out. They stay available in the plan editor but aren't in
  // the rotations and aren't core.
  { id: "move-1", movement: true, title: "Movement: Starting Point Circuit", core: false, about: "Stationary cycling, marching, step-ups or squats at a level you can manage." },
  { id: "move-2", movement: true, title: "Movement: Boxing and Breathing", core: false, about: "Jab, cross, step back and reset in short rounds, noticing your breathing and heart rate." },
  { id: "move-3", movement: true, title: "Movement: Stop-Start Agility", core: false, about: "Move between cones and respond to go, slow and stop, practising the pause." },
  { id: "move-4", movement: true, title: "Movement: Fitness Circuit", core: false, about: "30 seconds on, 30 seconds rest: star jumps, squats, wall push-ups, step-ups." },
  { id: "move-5", movement: true, title: "Movement: Coordination Challenge", core: false, about: "Follow a sequence of instructions around a course, then plan a better route." },
  { id: "move-6", movement: true, title: "Movement: Walk and Stretch", core: false, about: "A short walk, then gentle stretching and a cool-down." }
];

// The room runs a two-day rotation, so students on their Day 1 and Day 2 share the same group
// sessions. Each rotation says which group session runs in which slot. A runs four, B three.
RP.ROTATIONS = {
  A: { 2: "t-red", 4: "riot-1", 6: "wellbeing", 8: "chain-analysis" },
  B: { 2: "code-of-conduct", 5: "riot-2", 8: "self-regulation" }
};

// Individual sessions with the teacher. Teachers drag them into an independent slot; the other
// students keep working on their own. Only one student can have one at a time.
RP.INDIVIDUAL_SESSIONS = [
  {
    id: "ind-review", day: 1, title: "Individual: Review of plans, goals and Sentral",
    about: `Time with your teacher, just the two of you. You'll look at what happened, your current plans and goals, and what you'd like to get out of the Reset Program.`,
    guide: `**Day 1, about 25–30 minutes.**
- Check in: how are they feeling about being here?
- Go through the Sentral incident(s) together. Hear the student's side; focus on understanding, not blame.
- Review the current learning support plan (LSP), behaviour or wellbeing plans, and previous goals: what's working, what isn't?
- Note any learning or wellbeing needs to follow up.
- Agree 1–2 things to focus on during the program.
- If they've done Module 1, their answers are on their record page.`
  },
  {
    id: "ind-success", day: 2, title: "Individual: My success plan",
    about: `Time with your teacher to put together your plan for going back to class: your strategies, your goals, and the staff you can go to for support.`,
    guide: `**Day 2, about 25–30 minutes.**
- Have the student identify **strategies** (2–3) they'll use when they notice warning signs.
- Set **goals** (1–2) that are specific and realistic for the first two weeks back.
- Name **staff they can approach** for support, and how they'll ask.
- Agree what staff will do to support them, and how the return-to-class meeting will run.
- If they've done Module 6, their plan answers are on their record page. Print them for the return meeting.`
  },
  {
    id: "ind-testing", day: null, title: "Individual: Learning and support check",
    about: `Time with your teacher to check how you're going with your learning, so the right support can be put in place when you go back to class.`,
    guide: `**Either day, about 25–30 minutes.** Run the school's learning and support screening (to be confirmed: e.g. reading, spelling and numeracy checks). Record results in the school's usual system.`
  }
];

// Electives filled in when a student is created, in order, into that day's free independent
// slots. If a day has fewer slots, the last item is kept (so the Return Plan stays on Day 2).
// Teachers change these in the plan editor.
RP.DEFAULT_ELECTIVES = {
  1: ["module-1", "tred-values", "module-2", "numeracy", "literacy"],
  2: ["my-chain", "code-of-conduct-check", "module-4", "literacy", "module-6"]
};

// Older plans only: the 1:1 stored as slot 11.
RP.ONE_TO_ONE = {
  1: { title: "1:1 with your teacher", about: "How you came to the Reset Program, your learning support plan and your goals." },
  2: { title: "1:1 with your teacher", about: "Getting ready to go back to class: your Reset & Reconnect Plan and who can help you." }
};
