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
// student's screen; "guide" is the teacher's run sheet (Session guides page); "slides" are shown
// in the dashboard's Present view on the projector. Each session must make sense on its own:
// students start on either rotation. RIOT, Wellbeing and Self-Regulation will be rebuilt from the
// RIOT program materials when they're uploaded.
const RIOT_NOTE = "**To be updated:** this session will be rebuilt from the RIOT (Resilience in our Teens) materials once they're uploaded. Until then, use this outline.";
RP.GROUP_SESSIONS = [
  {
    id: "t-red", title: "T-RED Values", core: true,
    about: `Our school values: **Thrive, Represent, Excel, Deliver**. Your teacher will go through what each value means and what it looks like at school.`,
    guide: `**Aim:** students can explain Thrive, Represent, Excel and Deliver and give a school example of each. Discussion only, no practical activities. **Materials:** the Present view (built from the two T-RED presentations), whiteboard.

- **5 min: what are values?** Values are what we think is important. Each student names one thing they value (friendship, family, sport, music…).
- **5 min: Thrive.** Grow, develop and succeed in learning and life: resilience, wellbeing, a positive learning environment. Ask: what helps you keep going when school gets hard?
- **5 min: Represent.** Show the school's values in everything you do: uniform, behaviour on excursions and sport days, how you treat people. Discuss the Martin at the aquarium scenario.
- **5 min: Excel.** Perform at your highest potential. It takes planning, effort and practice, not just talent. Ask: what's something you've got better at with practice?
- **5 min: Deliver.** Meet goals, keep commitments, do what you said you'd do (assessments on time, promises).
- **5 min: review.** Match the key words to each value (slide), then each student says which value they'll focus on when they return to class.`,
    slides: [
      { title: "T-RED Values", points: ["Thrive", "Represent", "Excel", "Deliver"] },
      { title: "What are values?", points: ["Values are what we think of as important.", "Everybody has their own: friendship, education, family, sport, music, art…", "At school, our values guide us to be the best version of ourselves."], note: "Ask: what's one thing you value?" },
      { title: "Thrive", points: ["To grow, develop and be successful at school and in life.", "Building resilience and looking after your wellbeing.", "Setting goals, planning how to reach them and sticking to the plan."], note: "Ask: what helps you keep going when school gets hard?" },
      { title: "Represent", points: ["To show our school's values in everything we do.", "Taking pride in being part of the school.", "Uniform, behaviour on excursions and sport days, how we treat people."], note: "Ask: how can you represent the school well?" },
      { title: "Martin at the aquarium", points: ["Martin is on a school excursion at an aquarium. He starts swearing loudly.", "His teachers ask him to stop, but he keeps going. He's also rude to the aquarium staff.", "What might the aquarium staff now think about Martin's school?", "What could Martin have done to leave a positive impression?"] },
      { title: "Excel", points: ["To perform at your highest potential.", "Excelling doesn't happen overnight. It takes planning, effort and practice.", "We see athletes, musicians and artists after they've got good, not the hours of practice behind it."], note: "Ask: what's something you got better at by practising?" },
      { title: "Deliver", points: ["To meet goals, keep commitments and make an impact.", "Deliver on it: actually do it!", "When we say we'll do something, make a promise, make a plan or set a goal."], note: "Ask: what does Deliver look like at school? (e.g. handing in assessments on time)" },
      { title: "Review", points: ["Thrive: resilience, aspiration, belonging", "Represent: collaborate, compliance, respect", "Excel: high expectations, determination, preparation", "Deliver: commitment, punctuality, participation"], note: "Each student: which value will you focus on when you go back to class?" }
    ]
  },
  {
    id: "riot-1", title: "RIOT: My Amazing Brain and Stress", core: true,
    about: `Resilience in our Teens. Learn what happens in your brain and body when stress and emotions build up, and how to bring them back down.`,
    guide: `${RIOT_NOTE}

Stands alone: some students will have done *RIOT: Thinking Traps and Problem-Solving* first, some not. **Materials:** a clear cup or bucket, water jug, small paper "stress" cards, a towel.

- **5 min: hand model of the brain.** Everyone makes the fist model; show "flipping your lid". Ask: when have you seen someone flip their lid on TV or in sport?
- **8 min: fight, flight, freeze.** Students describe what each looks like at school. Link to body signs: heart, face, fists, voice.
- **10 min: stress bucket.** Each student writes 2–3 things that fill their bucket on cards (keep it general if they prefer) and drops them in, while you pour water. Then each names a "tap" (healthy release) and you pour some out. Talk about what happens when it overflows.
- **5 min: one tap I'll use.** Each student picks one tap for this week.`,
    slides: [
      { title: "RIOT: My Amazing Brain and Stress", points: ["Resilience in our Teens"] },
      { title: "Your amazing brain", points: ["Make a fist with your thumb tucked inside.", "Wrist and palm: the brain stem (keeps you alive, reacts to danger).", "Thumb: the emotional part.", "Fingers: the thinking part (stop, think, choose)."] },
      { title: "Flipping your lid", points: ["When emotions get really strong, the fingers lift up.", "The thinking part loses touch with the rest.", "That's when it's hard to stop and think."], note: "Ask: when have you seen someone flip their lid on TV or in sport?" },
      { title: "Fight, flight or freeze", points: ["Fight: arguing, yelling, pushing", "Flight: walking out, running off, avoiding", "Freeze: going blank, shutting down"] },
      { title: "The stress bucket", points: ["Stress pours in: school, friends, family, sleep, pressure.", "When the bucket is full, it overflows.", "Taps let stress out: healthy ways to reset."] },
      { title: "My tap", points: ["What's one tap you'll use this week?"] }
    ]
  },
  {
    id: "riot-2", title: "RIOT: Thinking Traps and Problem-Solving", core: true,
    about: `Resilience in our Teens. Spot unhelpful thinking, work out what's in your control, and practise solving problems step by step.`,
    guide: `${RIOT_NOTE}

Stands alone: some students will have done *RIOT: My Amazing Brain and Stress* first, some not. **Materials:** a rope or hoop (circle of control), statement cards, whiteboard.

- **5 min: thinking traps.** Read out thoughts ("Everyone's against me", "If I walk away I look weak", "I've ruined everything"). Students hold up thumbs if they've heard or thought it.
- **8 min: check the thought.** As a group, take one thought: evidence for, evidence against, what would you tell a friend, a more helpful thought.
- **8 min: circle of control.** Lay the rope on the floor. Students place statement cards inside (my words, asking for help, effort, using strategies) or outside (others' opinions, what's already happened).
- **8 min: problem-solving steps.** Model on the board with a school scenario: what's the problem → options → consequences of each → choose → check how it went.`,
    slides: [
      { title: "RIOT: Thinking Traps and Problem-Solving", points: ["Resilience in our Teens"] },
      { title: "Thinking traps", points: ["\"Everyone is against me.\"", "\"The teacher is picking on me.\"", "\"If I walk away, I look weak.\"", "\"I've already ruined everything.\""], note: "Thumbs up if you've ever thought one of these." },
      { title: "Check the thought", points: ["What's the evidence for it?", "Is there another way to see it?", "What would I tell a friend?", "What's a more helpful thought?"] },
      { title: "What can I control?", points: ["Inside: my words and actions, asking for help, my effort, using my strategies.", "Outside: other people's opinions, what others say or do, what's already happened."] },
      { title: "Solving a problem", points: ["1. What's the problem?", "2. What are my options?", "3. What could happen with each?", "4. Choose one and try it.", "5. How did it go?"] }
    ]
  },
  {
    id: "wellbeing", title: "Wellbeing", core: true,
    about: `What keeps you well: sleep, food, movement, connection and having people to talk to. You'll check in on your own wellbeing and pick one small change.`,
    guide: `${RIOT_NOTE}

**Materials:** printed wellbeing wheel (sleep, food, movement, screens, friends and family, fun, feeling safe, people to talk to), pens.

- **5 min: check-in.** Each student rates their week out of 10 (can pass).
- **10 min: wellbeing wheel.** Each student shades how well each area is going for them (private, not shared unless they want to).
- **8 min: small changes.** As a group, brainstorm one realistic idea per area (e.g. phone out of the bedroom, breakfast before school). Each student picks one to try.
- **5 min: my support network.** Students name (to themselves or on paper) one adult at school and one outside school they can talk to.

**Watch for:** anything a student says or writes that needs follow-up; follow wellbeing procedures.`,
    slides: [
      { title: "Wellbeing", points: ["What keeps you well?"] },
      { title: "Check in", points: ["How has your week been, out of 10?"] },
      { title: "The wellbeing wheel", points: ["Sleep", "Food", "Movement", "Screens", "Friends and family", "Fun", "Feeling safe", "People to talk to"] },
      { title: "Small changes", points: ["Pick one area. What's one small, realistic change?", "e.g. phone out of the bedroom, breakfast before school, a walk after school"] },
      { title: "My support network", points: ["One adult at school I can talk to", "One person outside school I can talk to"] }
    ]
  },
  {
    id: "self-regulation", title: "Self-Regulation", core: true,
    about: `Notice your warning signs early and practise strategies that help you stay in control, such as breathing, grounding and taking a break.`,
    guide: `${RIOT_NOTE}

**Materials:** colour cards (blue = low, green = calm/ready, yellow = wound up, red = out of control), strategy cards.

- **5 min: colour check-in.** Each student holds up the colour that matches how they feel now. All colours are okay.
- **8 min: warning signs.** Group list on the board: what do you notice in your body, thoughts and actions as you move from green to yellow to red?
- **12 min: practise together.** Run three strategies for real: box breathing (4-4-4-4, 3 rounds), 5-4-3-2-1 grounding, and tense-and-release muscles. After each, students rate it: helpful, maybe, not for me.
- **5 min: my calm plan.** Each student picks their top two strategies and when they'll use them ("When I notice ___, I'll ___").

**Tip:** model the strategies yourself; students join in more when the adult does it too.`,
    slides: [
      { title: "Self-Regulation", points: ["Staying in control when things get hard"] },
      { title: "Check in: what colour are you?", points: ["Blue: tired, flat, low", "Green: calm and ready", "Yellow: wound up, frustrated", "Red: out of control"] },
      { title: "Warning signs", points: ["Body: heart racing, hot face, fists", "Thoughts: \"This isn't fair\", \"I'm done\"", "Actions: louder voice, pacing, refusing"] },
      { title: "Box breathing", points: ["Breathe in for 4", "Hold for 4", "Breathe out for 4", "Hold for 4"], note: "Do three rounds together." },
      { title: "5-4-3-2-1 grounding", points: ["5 things you can see", "4 things you can feel", "3 things you can hear", "2 things you can smell", "1 thing you can taste"] },
      { title: "My calm plan", points: ["When I notice ___, I'll ___."] }
    ]
  },
  {
    id: "code-of-conduct", title: "Student Code of Conduct", core: true,
    about: `The NSW Department of Education Student Code of Conduct: **be respectful, be responsible, be safe**. What it means and what it looks like at our school.`,
    guide: `**Materials:** the Department's *Student code of conduct* (one page), statement cards cut from it, three headings (Respect everyone, Be responsible, Be safe), scenario cards.

- **5 min: why a Code?** Read the opening ("In NSW public schools everyone belongs…"). It applies on and off site and online.
- **10 min: card sort.** Students sort the "I will…" statements under the three headings together, then check against the Code.
- **10 min: scenarios.** For each card, which part of the Code is involved and what would a good choice be? Ideas: a mean group-chat post, a friend offering a vape, being late most days, an argument in the canteen line, a teacher's instruction you think is unfair.
- **5 min: my part.** Each student names one thing from the Code they'll focus on when they return.

**Note:** link "To keep everyone safe, I must not…" to why suspensions happen, without singling out any student's incident.`,
    slides: [
      { title: "Student Code of Conduct", points: ["In NSW public schools everyone belongs and strives for the highest standards of learning."] },
      { title: "The Code applies…", points: ["to all NSW public school students", "at school and on school activities, on and off site", "online, too"] },
      { title: "Respect everyone", points: ["Listen and speak respectfully", "Let others focus on their learning", "Value and include everyone and treat them fairly", "Care for our school environment", "Wear the school uniform correctly and with pride"] },
      { title: "Be responsible", points: ["Attend every day you can, on time, ready to learn", "Follow school and class rules and routines", "Use technology safely and for learning", "Do your work, try your best, ask for help", "Learn from mistakes and try to improve"] },
      { title: "Be safe", points: ["Follow the instructions of teachers and staff", "Respect others' space, privacy and belongings", "Speak up if anyone feels unsafe or is treated unfairly", "Resolve differences calmly and fairly"] },
      { title: "To keep everyone safe, I must not…", points: ["treat anyone unfairly because of who they are", "be violent, hurt, threaten, harass or bully anyone, including online", "bring weapons, drugs, alcohol, vapes or tobacco to school"], note: "Staff will take action to keep everyone safe. This may include suspension." },
      { title: "What would you do?", points: ["A mean photo gets posted in a group chat.", "A friend offers you a vape at lunch.", "A teacher gives an instruction you think is unfair."], note: "Which part of the Code? What's a good choice?" },
      { title: "My part", points: ["One thing from the Code I'll focus on when I go back to class"] }
    ]
  },
  {
    id: "classroom-expectations", title: "Classroom Expectations", core: true,
    about: `What's expected in class, and why: being on time and ready, listening, following instructions, asking for help, and respectful words.`,
    guide: `**Aim:** explicit teaching of the behaviour expected in classrooms, so students know exactly what success looks like when they return. Discussion and modelling, no practical activities. **Materials:** the Present view, whiteboard.

- **5 min: why expectations?** Everyone learns better when the routines are clear and predictable.
- **15 min: the expectations.** Go through each slide. For each: what it looks like, what it sounds like, and why it matters. Model a good and a not-so-good example (staff only), and have students say which is which.
- **5 min: tricky moments.** What could you do when you're asked to move seats, you don't understand the work, or someone's annoying you?
- **5 min: my focus.** Each student picks the one expectation that will make the biggest difference for them.`,
    slides: [
      { title: "Classroom Expectations", points: ["Knowing exactly what success looks like in class"] },
      { title: "Arrive on time and ready", points: ["On time to every class", "Equipment out: book, pen, laptop charged", "Uniform on, phone away"], note: "Looks like / sounds like / why it matters" },
      { title: "Enter and settle", points: ["Walk in calmly", "Go to your seat (or the seat you're given)", "Start the warm-up or wait quietly for instructions"] },
      { title: "Listen and follow instructions", points: ["Eyes on the speaker", "Follow instructions the first time", "If you disagree, follow it first and ask to talk after class"] },
      { title: "Have a go and ask for help", points: ["Try the work, even if it's hard", "Hand up, or use the class signal, to ask for help", "Ask a classmate quietly if that's allowed"] },
      { title: "Respectful words and actions", points: ["Speak respectfully to teachers and classmates", "Keep hands, feet and objects to yourself", "Leave other people's things alone"] },
      { title: "Tricky moments", points: ["You're asked to move seats.", "You don't understand the work.", "Someone keeps annoying you."], note: "What could you do instead of reacting?" },
      { title: "My focus", points: ["Which expectation will make the biggest difference for me?"] }
    ]
  },
  {
    id: "chain-analysis", title: "Chain Analysis", core: true,
    about: `Big reactions don't come out of nowhere. Learn to spot the small steps (the links in the chain) that lead up to a behaviour, and where you could break the chain.`,
    guide: `A DBT skill. Use a **made-up example** in the group; students do their own chain privately (the *My Chain* module or an individual session). **Materials:** paper strips, markers, tape, scissors.

- **5 min: the idea.** A behaviour is the end of a chain: vulnerabilities → trigger → thoughts → feelings and body → urges and actions → behaviour → consequences.
- **12 min: build a paper chain.** Read the example ("Jay": up until 2am, no breakfast, phone taken in period 1, asked to move seats in front of friends, thinks "they always pick on me", face goes hot, argues, swears, sent out). Students write one link per paper strip and loop them into a chain.
- **8 min: break the chain.** Students take turns cutting a link and saying what Jay could have done differently at that point (eat breakfast, take a breath, ask to talk after class…).
- **5 min: chain breakers.** Each student picks one skill they could use to break their own chains.

**Keep it safe:** don't ask students to share their own incident in the group.`,
    slides: [
      { title: "Chain Analysis", points: ["Big reactions don't come out of nowhere."] },
      { title: "Every behaviour is the end of a chain", points: ["Vulnerabilities: tired, hungry, stressed", "Trigger: what happened just before", "Thoughts → feelings and body → urges and actions", "The behaviour", "Consequences"] },
      { title: "Jay's morning", points: ["Up until 2am gaming. No breakfast.", "Phone taken in period 1.", "Asked to move seats in front of his friends.", "Thinks: \"They always pick on me.\" Face goes hot.", "Argues, then swears. Sent out of class."], note: "Write one link per paper strip and build the chain." },
      { title: "Break the chain", points: ["Every link is a chance to do something different.", "Which link would you cut? What could Jay do instead?"] },
      { title: "Chain breakers", points: ["Sleep and breakfast", "Notice warning signs early", "Slow breathing", "Ask for a minute", "\"Can we talk after class?\"", "Talk to someone you trust"], note: "Each student picks one chain breaker." }
    ]
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
// sessions. Group sessions are at the same times on both rotations: 8:50, 9:55, 11:23 and 12:26.
RP.ROTATIONS = {
  A: { 2: "t-red", 4: "riot-1", 6: "wellbeing", 8: "chain-analysis" },
  B: { 2: "code-of-conduct", 4: "riot-2", 6: "classroom-expectations", 8: "self-regulation" }
};

// Individual sessions with a staff member. Teachers drag them into an independent slot; the other
// students keep working on their own. Only one student can have one at a time. Who runs it is
// whoever is on the staffing for that session (run sheet).
RP.INDIVIDUAL_SESSIONS = [
  {
    id: "ind-review", day: 1, title: "Individual: Review of plans, goals and Sentral",
    about: `Time with a staff member, just the two of you. You'll look at what happened, your current plans and goals, and what you'd like to get out of the Reset Program.`,
    guide: `**Day 1, about 25–30 minutes.** The session page shows the student's Day 1 morning survey and, once they've done them, their Module 1 and My Chain answers.
- Check in: how are they feeling about being here?
- Go through the Sentral incident(s) together. Hear the student's side; focus on understanding, not blame.
- Review the current learning support plan (LSP), behaviour or wellbeing plans, and previous goals: what's working, what isn't?
- Note any learning or wellbeing needs to follow up (notes go in Sentral, not here).
- Agree 1–2 things to focus on during the program.`
  },
  {
    id: "ind-success", day: 2, title: "Individual: My success plan",
    about: `Time with a staff member to put together your plan for going back to class: your strategies, your goals, and the staff you can go to for support.`,
    guide: `**Day 2, about 25–30 minutes.** The session page shows the student's Module 6 answers (if done) and their surveys, and prints a *Return to class plan* to sign.
- Have the student identify **strategies** (2–3) they'll use when they notice warning signs.
- Set **goals** (1–2) that are specific and realistic for the first two weeks back.
- Name **staff they can approach** for support, and how they'll ask.
- Agree what staff will do to support them, and how the return-to-class meeting will run.`
  },
  {
    id: "ind-classwork", day: null, title: "Individual: Classwork and assessment check-in",
    about: `Time with a staff member to look at the classwork and assessments you've missed or have coming up, and make a plan to catch up.`,
    guide: `**Either day, about 25–30 minutes.**
- Check the student's classes for missed work and upcoming assessment tasks (due dates, extensions or illness/misadventure if relevant).
- Prioritise: what's due first, what can be caught up during the program's independent sessions?
- Make a simple catch-up plan with the student and agree who they'll check in with in each class.`
  },
  {
    id: "ind-testing", day: null, title: "Individual: Learning and support check",
    about: `Time with a staff member to check how you're going with your learning, so the right support can be put in place when you go back to class.`,
    guide: `**Either day, about 25–30 minutes.** Run the school's learning and support screening (this varies). Results are recorded in the school's usual systems, not on this website.`
  }
];

// Electives filled in when a student is created, in order, into that day's free independent
// slots (8:50 morning, 9:23, 10:56, 11:50, 1:32 minus group sessions). If a day has fewer slots,
// the last item is kept. Teachers drag individual sessions over one of these.
RP.DEFAULT_ELECTIVES = {
  1: ["module-1", "literacy-reading", "module-2", "healthy-habits"],
  2: ["my-chain", "say-it-better", "goal-builder", "module-6"]
};

// Older plans only: the 1:1 stored as slot 11.
RP.ONE_TO_ONE = {
  1: { title: "1:1 with your teacher", about: "How you came to the Reset Program, your learning support plan and your goals." },
  2: { title: "1:1 with your teacher", about: "Getting ready to go back to class: your Reset & Reconnect Plan and who can help you." }
};
