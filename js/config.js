/*
  Reset Program settings. Edit this file to change the timetable, group sessions or rotations.
*/
window.RP = window.RP || {};

// Supabase project. The publishable key is meant to be public; never put the secret key here.
RP.SUPABASE_URL = "https://zaotkcxrwwqlvzsrdwpe.supabase.co";
RP.SUPABASE_KEY = "sb_publishable_n2dLf_pN3wzMDqQNf-M5xQ_abfXr24U";

// The school day. Sessions 1 and 10 are the whole-group morning session and afternoon debrief;
// sessions 2–9 are half-periods. Every session ends with a school bell or at the middle of a period
// (P1 8:20–9:23, P2 9:23–10:26, B1 10:26–10:56, P3 10:56–11:59, P4 11:59–1:02, B2 1:02–1:32,
// P5 1:32–2:35).
RP.TIMETABLE = [
  { slot: 1, start: "08:20", end: "08:50", period: "P1" },
  { slot: 2, start: "08:50", end: "09:23", period: "P1" },
  { slot: 3, start: "09:23", end: "09:55", period: "P2" },
  { slot: 4, start: "09:55", end: "10:26", period: "P2" },
  { brk: "B1", start: "10:26", end: "10:56" },
  { slot: 5, start: "10:56", end: "11:27", period: "P3" },
  { slot: 6, start: "11:27", end: "11:59", period: "P3" },
  { slot: 7, start: "11:59", end: "12:30", period: "P4" },
  { slot: 8, start: "12:30", end: "13:02", period: "P4" },
  { brk: "B2", start: "13:02", end: "13:32" },
  { slot: 9, start: "13:32", end: "14:03", period: "P5" },
  { slot: 10, start: "14:03", end: "14:35", period: "P5" }
];
RP.FIRST_SLOT = 1;
RP.LAST_SLOT = 10;
// Older plans kept the 1:1 as an untimed slot 11. New plans drag individual sessions into a
// session slot instead (see RP.INDIVIDUAL_SESSIONS).
RP.ONE_TO_ONE_SLOT = 11;

// The Thomas Reddall Lesson Routine. Every group module follows these eight steps, squeezed into a
// half-period (about 31 minutes). Shown on the Session guides page.
RP.LESSON_ROUTINE = [
  { step: "Entry procedure", does: "Students enter calmly and begin the lesson routine promptly: greeting at the door, seating, equipment check, clear start expectations.", purpose: "Creates psychological safety, calm transitions and readiness for learning." },
  { step: "Do Now activity", does: "A short, purposeful task straight away: visible on entry, needs little explanation, activates prior knowledge.", purpose: "Reduces downtime, increases focus and establishes learning momentum." },
  { step: "Lesson intention and success criteria", does: "What students are learning, why it matters and what success looks like. Clear, achievable and referred to throughout.", purpose: "Provides clarity, direction and achievable learning goals." },
  { step: "Explicit teaching / content delivery", does: "Explicit instruction, worked examples, modelling, guided practice and checking for understanding.", purpose: "Supports clarity, engagement and student success in learning tasks." },
  { step: "Brain break", does: "A brief regulation or engagement activity: movement, stretching, brief partner discussion, mindfulness or breathing.", purpose: "Supports attention, regulation, focus and re-engagement in learning." },
  { step: "Continued learning / content application", does: "Independent work, collaborative tasks, practice and application, with teacher feedback, active supervision and consistent reinforcement of learning behaviours.", purpose: "Strengthens understanding and promotes sustained engagement." },
  { step: "Recap and reflection", does: "Review key learning and check for understanding: retrieval questions, student reflection, class summary, revisiting the success criteria.", purpose: "Consolidates learning and reinforces key concepts." },
  { step: "Exit procedure", does: "A calm, orderly exit: pack up, room reset, positive acknowledgment. Students leave (or go back to their laptops) only when directed.", purpose: "Supports calm transitions and reinforces predictable expectations." }
];
RP.SCHOOL_COMMITMENT = `At Thomas Reddall High School, consistent lesson routines are part of our commitment to helping all students:
- **Thrive** through safe and predictable learning environments
- **Represent** through respectful and responsible learning behaviours
- **Excel** through active engagement in learning
- **Deliver** through consistent routines and expectations

**Consistency across classrooms supports both wellbeing and academic success and ensures all students experience calm, structured and supportive learning environments every lesson, every day.**`;

// Group modules (max 5 students, 1 staff member). "core" ones must be done at least once across a
// student's two days; the dashboard shows any still missing. "about" is shown on the student's
// screen; "guide" is the teacher's run sheet (Session guides page), written in the eight steps of
// the lesson routine; "slides" are shown in the dashboard's Present view on the projector. Each
// session must make sense on its own: students start on either rotation. RIOT, Wellbeing and
// Self-Regulation will be rebuilt from the RIOT program materials when they're uploaded.
const RIOT_NOTE = "**To be updated:** this session will be rebuilt from the RIOT (Resilience in our Teens) materials once they're uploaded. Until then, use this outline.";
// Steps 1 and 8 are the same for every group module.
const ENTRY = "**1. Entry (1 min).** Laptops closed and to the side. Greet each student by name, seats in a circle or around one table, butcher's paper and markers ready.";
const EXIT = "**8. Exit (1 min).** Thank each student for one specific thing they did well. Put the butcher's paper on the wall. Students go back to their laptops when you say so. Tick the session done for everyone on the dashboard.";
RP.GROUP_SESSIONS = [
  {
    id: "t-red", title: "T-RED Values", core: true,
    about: `Our school values: **Thrive, Represent, Excel, Deliver**. What each one means and what it looks like at school.`,
    guide: `**Learning intention:** we are learning what our school values mean. **Success criteria:** I can explain each value in my own words and give a school example of one. Staff-led discussion and butcher's paper; no games (those were for orientation day). **Materials:** the Present view, butcher's paper divided into four (T, R, E, D), markers.

${ENTRY}

**2. Do Now (4 min).** On the slide: "What's one thing you think is important? Write it on a sticky note or the corner of the butcher's paper." (friendship, family, sport, music…). Share around the circle; passing is fine.

**3. Intention and success criteria (1 min).** Read them from the slide.

**4. Explicit teaching (8 min).** Go through Thrive, Represent, Excel and Deliver (slides). For each, give the meaning and one school example. Discuss Martin at the aquarium: what will the aquarium staff think of his school?

**5. Brain break (2 min).** Stand up. "Show me Excel": everyone does 10 slow squats or wall push-ups, counting together. Then shake out arms and legs and sit back down.

**6. Application (8 min).** Butcher's paper in four quarters. Students take a marker each and write, in each quarter, what that value **looks like** and **sounds like** in a classroom, the playground and online. Rotate the paper every 2 minutes so everyone adds to every value.

**7. Recap (4 min).** Read the key words on the review slide. Each student points to one thing on the paper and says which value they'll focus on when they go back to class (check against the success criteria).

${EXIT}`,
    slides: [
      { title: "T-RED Values", points: ["Thrive", "Represent", "Excel", "Deliver"] },
      { title: "Do Now", points: ["What's one thing you think is important?", "Write it down. We'll share around the circle."] },
      { title: "Today", points: ["**We are learning** what our school values mean.", "**I can** explain each value in my own words.", "**I can** give a school example of one value."] },
      { title: "Thrive", points: ["To grow, develop and be successful at school and in life.", "Building resilience and looking after your wellbeing.", "Setting goals, planning how to reach them and sticking to the plan."], note: "Ask: what helps you keep going when school gets hard?" },
      { title: "Represent", points: ["To show our school's values in everything we do.", "Taking pride in being part of the school.", "Uniform, behaviour on excursions and sport days, how we treat people."], note: "Ask: how can you represent the school well?" },
      { title: "Martin at the aquarium", points: ["Martin is on a school excursion at an aquarium. He starts swearing loudly.", "His teachers ask him to stop, but he keeps going. He's also rude to the aquarium staff.", "What might the aquarium staff now think about Martin's school?", "What could Martin have done to leave a positive impression?"] },
      { title: "Excel", points: ["To perform at your highest potential.", "Excelling doesn't happen overnight. It takes planning, effort and practice."], note: "Ask: what's something you got better at by practising?" },
      { title: "Deliver", points: ["To meet goals, keep commitments and make an impact.", "When we say we'll do something, we actually do it."], note: "Ask: what does Deliver look like at school? (e.g. handing in assessments on time)" },
      { title: "Brain break: show me Excel", points: ["Stand up", "10 slow squats or wall push-ups, counting together", "Shake it out and sit down"] },
      { title: "Butcher's paper", points: ["Four quarters: T, R, E, D", "What does each value look like and sound like…", "…in class? In the playground? Online?"], note: "Swap every 2 minutes." },
      { title: "Review", points: ["Thrive: resilience, aspiration, belonging", "Represent: collaborate, compliance, respect", "Excel: high expectations, determination, preparation", "Deliver: commitment, punctuality, participation"], note: "Which value will you focus on when you go back to class?" }
    ]
  },
  {
    id: "riot-1", title: "RIOT: My Amazing Brain and Stress", core: true,
    about: `Resilience in our Teens. What happens in your brain and body when stress builds up, and how to bring it back down.`,
    guide: `${RIOT_NOTE}

Stands alone: some students will have done *RIOT: Thinking Traps and Problem-Solving* first, some not. **Learning intention:** we are learning what stress does to our brain and body. **Success criteria:** I can explain "flipping your lid" and name one healthy way to let stress out. **Materials:** butcher's paper with a big bucket drawn on it, markers, a clear cup and water jug (optional).

${ENTRY}

**2. Do Now (4 min).** On the slide: "Think of a character on TV or in sport who lost their cool. What did it look like?" Quick share.

**3. Intention and success criteria (1 min).** Read them from the slide.

**4. Explicit teaching (8 min).** Hand model of the brain: everyone makes the fist; show "flipping your lid". Fight, flight and freeze: students describe what each looks like at school. Link to body signs: heart, face, fists, voice.

**5. Brain break (2 min).** Five slow breaths together, then tense every muscle for 5 seconds and let go. Do it twice.

**6. Application (8 min).** Stress bucket on butcher's paper. Students write things that can fill **a teenager's** bucket inside it (keep it general; no one has to share their own). Then they draw "taps" at the bottom and write healthy ways to let stress out. Discuss: what happens when the bucket overflows?

**7. Recap (4 min).** Retrieval questions: what does the thumb stand for? What are the three Fs? Each student names one tap they'll use this week.

${EXIT}`,
    slides: [
      { title: "RIOT: My Amazing Brain and Stress", points: ["Resilience in our Teens"] },
      { title: "Do Now", points: ["Think of someone on TV or in sport who lost their cool.", "What did it look like?"] },
      { title: "Today", points: ["**We are learning** what stress does to our brain and body.", "**I can** explain \"flipping your lid\".", "**I can** name one healthy way to let stress out."] },
      { title: "Your amazing brain", points: ["Make a fist with your thumb tucked inside.", "Wrist and palm: the brain stem (keeps you alive, reacts to danger).", "Thumb: the emotional part.", "Fingers: the thinking part (stop, think, choose)."] },
      { title: "Flipping your lid", points: ["When emotions get really strong, the fingers lift up.", "The thinking part loses touch with the rest.", "That's when it's hard to stop and think."] },
      { title: "Fight, flight or freeze", points: ["Fight: arguing, yelling, pushing", "Flight: walking out, running off, avoiding", "Freeze: going blank, shutting down"] },
      { title: "Brain break", points: ["Five slow breaths together", "Tense every muscle for 5 seconds… and let go", "Twice"] },
      { title: "The stress bucket", points: ["What can fill a teenager's bucket? Write it inside.", "Draw taps at the bottom: healthy ways to let stress out.", "What happens when it overflows?"] },
      { title: "Recap", points: ["What does the thumb stand for?", "What are the three Fs?", "One tap I'll use this week"] }
    ]
  },
  {
    id: "riot-2", title: "RIOT: Thinking Traps and Problem-Solving", core: true,
    about: `Resilience in our Teens. Spot unhelpful thinking, work out what's in your control, and solve problems step by step.`,
    guide: `${RIOT_NOTE}

Stands alone: some students will have done *RIOT: My Amazing Brain and Stress* first, some not. **Learning intention:** we are learning to check our thoughts and solve problems step by step. **Success criteria:** I can turn an unhelpful thought into a more helpful one, and use the five problem-solving steps. **Materials:** butcher's paper with a big circle drawn on it, statement cards, markers.

${ENTRY}

**2. Do Now (4 min).** On the slide: four thinking traps. Thumbs up if you've ever heard someone think one of these.

**3. Intention and success criteria (1 min).** Read them from the slide.

**4. Explicit teaching (8 min).** Model checking a thought out loud with "If I walk away, I look weak": evidence for, evidence against, what would I tell a friend, a more helpful thought. Then the five problem-solving steps on the board with a made-up school problem.

**5. Brain break (2 min).** "Inside or outside": stand up; you call out things (the weather, my effort, what others say, my words…). Hands on head if it's in my control, hands out wide if it isn't.

**6. Application (8 min).** Circle of control on butcher's paper. Students stick or write the statement cards inside (my words, asking for help, effort, using strategies) or outside (others' opinions, what's already happened). Then in pairs, they take a thinking trap card and write a more helpful thought beside the circle.

**7. Recap (4 min).** Students say the five steps back in order. Each student reads out one helpful thought from the paper.

${EXIT}`,
    slides: [
      { title: "RIOT: Thinking Traps and Problem-Solving", points: ["Resilience in our Teens"] },
      { title: "Do Now: thinking traps", points: ["\"Everyone is against me.\"", "\"The teacher is picking on me.\"", "\"If I walk away, I look weak.\"", "\"I've already ruined everything.\""], note: "Thumbs up if you've heard someone think one of these." },
      { title: "Today", points: ["**We are learning** to check our thoughts and solve problems step by step.", "**I can** turn an unhelpful thought into a more helpful one.", "**I can** use the five problem-solving steps."] },
      { title: "Check the thought", points: ["What's the evidence for it?", "Is there another way to see it?", "What would I tell a friend?", "What's a more helpful thought?"] },
      { title: "Solving a problem", points: ["1. What's the problem?", "2. What are my options?", "3. What could happen with each?", "4. Choose one and try it.", "5. How did it go?"] },
      { title: "Brain break: inside or outside?", points: ["Hands on head: in my control", "Hands out wide: not in my control"] },
      { title: "What can I control?", points: ["Inside: my words and actions, asking for help, my effort, using my strategies.", "Outside: other people's opinions, what others say or do, what's already happened."], note: "Sort the cards onto the butcher's paper circle." },
      { title: "Recap", points: ["Say the five steps in order.", "Read out one helpful thought."] }
    ]
  },
  {
    id: "wellbeing", title: "Wellbeing", core: true,
    about: `What keeps you well: sleep, food, movement, connection and having people to talk to.`,
    guide: `${RIOT_NOTE}

**Learning intention:** we are learning what keeps us well. **Success criteria:** I can name the parts of wellbeing and choose one small, realistic change. **Materials:** butcher's paper with a big wellbeing wheel drawn on it (sleep, food, movement, screens, friends and family, fun, feeling safe, people to talk to), markers.

${ENTRY}

**2. Do Now (4 min).** On the slide: "How has your week been, out of 10?" Students show it on their fingers (can pass).

**3. Intention and success criteria (1 min).** Read them from the slide.

**4. Explicit teaching (7 min).** Go through the wheel. For each area, one fact and one question (e.g. teenagers need 8–10 hours of sleep; what time do most teenagers go to sleep?).

**5. Brain break (3 min).** Walk and stretch: walk a lap of the room, then reach up high, touch your toes and roll your shoulders.

**6. Application (8 min).** Students walk around the butcher's paper wheel and write one realistic small change for each area (phone out of the bedroom, breakfast before school, a walk after school…). Then each student puts a tick next to the idea they'll try (privately on a sticky note if they prefer).

**7. Recap (4 min).** Read out the ideas. Each student names (to themselves or out loud) one adult at school and one outside school they can talk to.

${EXIT}

**Watch for:** anything a student says or writes that needs follow-up; follow wellbeing procedures.`,
    slides: [
      { title: "Wellbeing", points: ["What keeps you well?"] },
      { title: "Do Now", points: ["How has your week been, out of 10?", "Show it on your fingers."] },
      { title: "Today", points: ["**We are learning** what keeps us well.", "**I can** name the parts of wellbeing.", "**I can** choose one small, realistic change."] },
      { title: "The wellbeing wheel", points: ["Sleep", "Food", "Movement", "Screens", "Friends and family", "Fun", "Feeling safe", "People to talk to"] },
      { title: "Brain break: walk and stretch", points: ["Walk a lap of the room", "Reach up high", "Touch your toes", "Roll your shoulders"] },
      { title: "Small changes", points: ["Write one small, realistic change for each area.", "e.g. phone out of the bedroom, breakfast before school, a walk after school", "Tick the one you'll try."] },
      { title: "My support network", points: ["One adult at school I can talk to", "One person outside school I can talk to"] }
    ]
  },
  {
    id: "self-regulation", title: "Self-Regulation", core: true,
    about: `Notice your warning signs early and practise strategies that help you stay in control.`,
    guide: `${RIOT_NOTE}

**Learning intention:** we are learning to notice our warning signs and calm down early. **Success criteria:** I can name my warning signs and two strategies that work for me. **Materials:** colour cards (blue, green, yellow, red), butcher's paper with four columns in the same colours, markers.

${ENTRY}

**2. Do Now (4 min).** Colour check-in: each student holds up the colour that matches how they feel now. All colours are okay.

**3. Intention and success criteria (1 min).** Read them from the slide.

**4. Explicit teaching (6 min).** The four colours and what each looks like. Model noticing your own warning signs ("When I'm getting to yellow, my jaw goes tight…").

**5. Brain break (4 min).** Practise for real: box breathing (3 rounds), then 5-4-3-2-1 grounding. Model it yourself; students join in more when the adult does too.

**6. Application (8 min).** On the butcher's paper, students write what body, thoughts and actions look like in each colour (green → yellow → red), then strategies that move someone back to green. Each student rates the strategies you practised: helpful, maybe, not for me.

**7. Recap (4 min).** Each student finishes the sentence "When I notice ___, I'll ___" out loud or on a sticky note.

${EXIT}`,
    slides: [
      { title: "Self-Regulation", points: ["Staying in control when things get hard"] },
      { title: "Do Now: what colour are you?", points: ["Blue: tired, flat, low", "Green: calm and ready", "Yellow: wound up, frustrated", "Red: out of control"] },
      { title: "Today", points: ["**We are learning** to notice our warning signs and calm down early.", "**I can** name my warning signs.", "**I can** name two strategies that work for me."] },
      { title: "Warning signs", points: ["Body: heart racing, hot face, fists", "Thoughts: \"This isn't fair\", \"I'm done\"", "Actions: louder voice, pacing, refusing"] },
      { title: "Brain break: box breathing", points: ["Breathe in for 4", "Hold for 4", "Breathe out for 4", "Hold for 4"], note: "Three rounds together." },
      { title: "5-4-3-2-1 grounding", points: ["5 things you can see", "4 things you can feel", "3 things you can hear", "2 things you can smell", "1 thing you can taste"] },
      { title: "Butcher's paper", points: ["Green → yellow → red: body, thoughts, actions", "What moves someone back to green?"] },
      { title: "My calm plan", points: ["When I notice ___, I'll ___."] }
    ]
  },
  {
    id: "code-of-conduct", title: "Student Code of Conduct", core: true,
    about: `The NSW Department of Education Student Code of Conduct: **be respectful, be responsible, be safe**.`,
    guide: `**Learning intention:** we are learning what the Student Code of Conduct asks of us. **Success criteria:** I can sort the Code into respect, responsibility and safety, and choose a good response to a school scenario. **Materials:** the Department's *Student code of conduct* (one page), "I will…" statement cards, butcher's paper with three headings (Respect everyone, Be responsible, Be safe), scenario cards, markers.

${ENTRY}

**2. Do Now (4 min).** On the slide: "Why do you think every school has rules?" Students write one reason on a sticky note and stick it up.

**3. Intention and success criteria (1 min).** Read them from the slide.

**4. Explicit teaching (7 min).** Read the opening ("In NSW public schools everyone belongs…"). The Code applies on and off site and online. Go through the three parts (slides). Link "To keep everyone safe, I must not…" to why suspensions happen, without singling out any student's incident.

**5. Brain break (2 min).** Stand up, swap seats with someone, and do 10 shoulder rolls.

**6. Application (9 min).** Students sort the "I will…" cards onto the butcher's paper under the three headings, then check against the Code. Then scenarios: for each card, which part of the Code is involved and what would a good choice be? Ideas: a mean group-chat post, a friend offering a vape, being late most days, an argument in the canteen line, a teacher's instruction you think is unfair. Write the good choices on the paper.

**7. Recap (3 min).** Quick quiz: name one thing under each heading. Each student names one thing from the Code they'll focus on when they return.

${EXIT}`,
    slides: [
      { title: "Student Code of Conduct", points: ["In NSW public schools everyone belongs and strives for the highest standards of learning."] },
      { title: "Do Now", points: ["Why do you think every school has rules?", "Write one reason on a sticky note."] },
      { title: "Today", points: ["**We are learning** what the Student Code of Conduct asks of us.", "**I can** sort the Code into respect, responsibility and safety.", "**I can** choose a good response to a school scenario."] },
      { title: "The Code applies…", points: ["to all NSW public school students", "at school and on school activities, on and off site", "online, too"] },
      { title: "Respect everyone", points: ["Listen and speak respectfully", "Let others focus on their learning", "Value and include everyone and treat them fairly", "Care for our school environment", "Wear the school uniform correctly and with pride"] },
      { title: "Be responsible", points: ["Attend every day you can, on time, ready to learn", "Follow school and class rules and routines", "Use technology safely and for learning", "Do your work, try your best, ask for help", "Learn from mistakes and try to improve"] },
      { title: "Be safe", points: ["Follow the instructions of teachers and staff", "Respect others' space, privacy and belongings", "Speak up if anyone feels unsafe or is treated unfairly", "Resolve differences calmly and fairly"] },
      { title: "To keep everyone safe, I must not…", points: ["treat anyone unfairly because of who they are", "be violent, hurt, threaten, harass or bully anyone, including online", "bring weapons, drugs, alcohol, vapes or tobacco to school"], note: "Staff will take action to keep everyone safe. This may include suspension." },
      { title: "Brain break", points: ["Stand up", "Swap seats with someone", "10 shoulder rolls"] },
      { title: "What would you do?", points: ["A mean photo gets posted in a group chat.", "A friend offers you a vape at lunch.", "A teacher gives an instruction you think is unfair."], note: "Which part of the Code? What's a good choice? Write it on the paper." },
      { title: "My part", points: ["One thing from the Code I'll focus on when I go back to class"] }
    ]
  },
  {
    id: "classroom-expectations", title: "Classroom Expectations", core: true,
    about: `What's expected in class, and why. The Thomas Reddall Lesson Routine, so you know what happens in every lesson.`,
    guide: `**Learning intention:** we are learning the Thomas Reddall Lesson Routine and what's expected at each step. **Success criteria:** I can name the steps of the lesson routine and say what I do at each one. **Materials:** the Present view, butcher's paper with the eight steps down the side and two columns (Looks like, Sounds like), markers.

${ENTRY} Model the entry procedure on purpose and tell students that's what you did.

**2. Do Now (4 min).** On the slide: "What's the first thing you should do when you walk into a classroom?" Students write their answer, then share.

**3. Intention and success criteria (1 min).** Read them from the slide. Point out that this is step 3 of the routine.

**4. Explicit teaching (8 min).** The eight steps of the lesson routine (slides), with the purpose of each. For entry and Do Now, model a good and a not-so-good example (staff only) and have students say which is which.

**5. Brain break (2 min).** Point out it's step 5! Stand, stretch up high, then a 30-second "silent statue" to practise settling back down.

**6. Application (8 min).** Students fill in the butcher's paper: what each step looks like and sounds like from the student's side. Then tricky moments: what could you do when you're asked to move seats, you don't understand the work, or someone's annoying you?

**7. Recap (4 min).** Cover the step names and have students say them in order. Each student picks the step that will make the biggest difference for them.

**8. Exit (1 min).** Model a calm exit routine and name it. Thank each student for one specific thing. Students go back to their laptops when you say so. Tick the session done.`,
    slides: [
      { title: "Classroom Expectations", points: ["The Thomas Reddall Lesson Routine"] },
      { title: "Do Now", points: ["What's the first thing you should do when you walk into a classroom?"] },
      { title: "Today", points: ["**We are learning** the Thomas Reddall Lesson Routine.", "**I can** name the steps of the routine.", "**I can** say what I do at each step."] },
      { title: "Every lesson, every day", points: ["1. Entry procedure", "2. Do Now activity", "3. Lesson intention and success criteria", "4. Explicit teaching", "5. Brain break", "6. Continued learning", "7. Recap and reflection", "8. Exit procedure"] },
      { title: "1–2. Entry and Do Now", points: ["Walk in calmly; go to your seat", "Equipment out: book, pen, laptop charged", "Start the Do Now straight away"], note: "Why: a calm start and no downtime." },
      { title: "3–4. Intention and teaching", points: ["Know what you're learning and what success looks like", "Eyes on the speaker; follow instructions the first time", "Have a go at the worked examples"] },
      { title: "5. Brain break", points: ["A short movement, stretch or breathing activity", "Then settle straight back to work"], note: "Stand, stretch up high, then 30 seconds of silent statue." },
      { title: "6. Continued learning", points: ["Work on your own or with others", "Try the work, even if it's hard", "Hand up to ask for help"] },
      { title: "7–8. Recap and exit", points: ["Answer the recap questions", "Pack up when you're told", "Leave only when the teacher says"] },
      { title: "Tricky moments", points: ["You're asked to move seats.", "You don't understand the work.", "Someone keeps annoying you."], note: "What could you do instead of reacting?" },
      { title: "My focus", points: ["Which step will make the biggest difference for me?"] }
    ]
  },
  {
    id: "chain-analysis", title: "Chain Analysis", core: true,
    about: `Big reactions don't come out of nowhere. Spot the small steps (the links in the chain) that lead up to a behaviour, and where you could break the chain.`,
    guide: `A DBT skill. Use a **made-up example**; students do their own chain privately (the *My Chain* module or a teacher-led session). **Learning intention:** we are learning that behaviour is the end of a chain of smaller steps. **Success criteria:** I can name the links in a chain and say where it could be broken. **Materials:** paper strips, markers, tape, scissors, butcher's paper.

${ENTRY}

**2. Do Now (4 min).** On the slide: "Jay got sent out of class. What might have happened before that?" Students write two guesses.

**3. Intention and success criteria (1 min).** Read them from the slide.

**4. Explicit teaching (6 min).** A behaviour is the end of a chain: vulnerabilities → trigger → thoughts → feelings and body → urges and actions → behaviour → consequences. Read Jay's morning.

**5. Brain break (2 min).** Stand in a line and pass a squeeze (or a high five) down the "chain" and back. Then sit.

**6. Application (10 min).** Students write one of Jay's links per paper strip and loop them into a paper chain. Then they take turns cutting a link and saying what Jay could have done differently at that point (eat breakfast, take a breath, ask to talk after class…). Write the chain breakers on the butcher's paper.

**7. Recap (4 min).** Name the links in order. Each student picks one chain breaker they could use.

${EXIT}

**Keep it safe:** don't ask students to share their own incident in the group.`,
    slides: [
      { title: "Chain Analysis", points: ["Big reactions don't come out of nowhere."] },
      { title: "Do Now", points: ["Jay got sent out of class.", "What might have happened before that? Write two guesses."] },
      { title: "Today", points: ["**We are learning** that behaviour is the end of a chain of smaller steps.", "**I can** name the links in a chain.", "**I can** say where the chain could be broken."] },
      { title: "Every behaviour is the end of a chain", points: ["Vulnerabilities: tired, hungry, stressed", "Trigger: what happened just before", "Thoughts → feelings and body → urges and actions", "The behaviour", "Consequences"] },
      { title: "Jay's morning", points: ["Up until 2am gaming. No breakfast.", "Phone taken in period 1.", "Asked to move seats in front of his friends.", "Thinks: \"They always pick on me.\" Face goes hot.", "Argues, then swears. Sent out of class."] },
      { title: "Brain break: pass it down the chain", points: ["Stand in a line", "Pass a high five down the chain and back"] },
      { title: "Build it, then break it", points: ["One link per paper strip", "Cut a link: what could Jay do instead at that point?"] },
      { title: "Chain breakers", points: ["Sleep and breakfast", "Notice warning signs early", "Slow breathing", "Ask for a minute", "\"Can we talk after class?\"", "Talk to someone you trust"], note: "Each student picks one chain breaker." }
    ]
  },
  {
    id: "rage-recap", title: "RAGE Recap", core: false, optional: true,
    about: `A recap of what you've learned about anger: what sets it off, how it builds, and what you can do to stay in control.`,
    guide: `**Optional.** Swap it in for another group module when it suits the group (drag it onto the group module on each student's daily schedule). **To be updated** with the school's RAGE materials; until then use this outline. **Learning intention:** we are recapping how anger works and what helps. **Success criteria:** I can name my triggers and warning signs, and two strategies that help me stay in control. **Materials:** butcher's paper with a big iceberg drawn on it, markers, sticky notes.

${ENTRY}

**2. Do Now (4 min).** On the slide: "Anger is normal. It's what we do with it that matters. True or false?" Students write a reason and share.

**3. Intention and success criteria (1 min).** Read them from the slide.

**4. Explicit teaching (7 min).** The anger iceberg: anger is the tip; underneath are feelings like embarrassment, hurt, worry, unfairness, tiredness. The anger cycle: trigger → warning signs → explosion → after. Use a made-up example ("Sam gets laughed at when he answers a question…").

**5. Brain break (2 min).** Shake it out: shake hands, arms, legs for 10 seconds each, then three slow breaths.

**6. Application (9 min).** On the butcher's paper iceberg, students write feelings that can hide under anger (below the water) and the things people do when angry (above it). Then on sticky notes, strategies that cool anger down; sort them into "in the moment" and "afterwards".

**7. Recap (3 min).** Each student names one trigger to watch for and one strategy they'll use.

${EXIT}`,
    slides: [
      { title: "RAGE Recap", points: ["How anger works, and what helps"] },
      { title: "Do Now", points: ["\"Anger is normal. It's what we do with it that matters.\"", "True or false? Why?"] },
      { title: "Today", points: ["**We are recapping** how anger works and what helps.", "**I can** name my triggers and warning signs.", "**I can** name two strategies that help me stay in control."] },
      { title: "The anger iceberg", points: ["Anger is the tip you can see.", "Underneath: embarrassed, hurt, worried, treated unfairly, tired, hungry…"] },
      { title: "The anger cycle", points: ["Trigger", "Warning signs", "Explosion", "Afterwards"], note: "Where is the easiest place to step in?" },
      { title: "Brain break: shake it out", points: ["Hands, arms, legs: 10 seconds each", "Three slow breaths"] },
      { title: "Butcher's paper", points: ["Below the water: feelings that hide under anger", "Above the water: what people do when angry", "Sticky notes: what cools anger down?"] },
      { title: "Recap", points: ["One trigger I'll watch for", "One strategy I'll use"] }
    ]
  },
  // Movement breaks: written resources staff can pull out when students need a break (Session
  // guides page). Each group module also has a brain break built in. They aren't planned into the
  // day; the entries stay here so older plans that used them still show a title.
  { id: "move-1", movement: true, title: "Movement: Starting Point Circuit", core: false, about: "Stationary cycling, marching, step-ups or squats at a level you can manage.",
    guide: "**3–5 minutes, any space.** 30 seconds each, at a level each student can manage: march on the spot, step-ups on a low step, sit-to-stand from a chair, wall push-ups. Rest 30 seconds and repeat once. Finish with three slow breaths." },
  { id: "move-2", movement: true, title: "Movement: Boxing and Breathing", core: false, about: "Jab, cross, step back and reset in short rounds, noticing your breathing and heart rate.",
    guide: "**3–5 minutes, arm's length apart, no contact.** Shadow boxing in 30-second rounds: jab, cross, step back, reset. Between rounds, hands on chest: notice the heartbeat and take three slow breaths. Three rounds. Talk about how the body calms down after effort." },
  { id: "move-3", movement: true, title: "Movement: Stop-Start Agility", core: false, about: "Move between cones and respond to go, slow and stop, practising the pause.",
    guide: "**5 minutes, outside or a clear space, cones optional.** Students walk or jog between two points. Call **go**, **slow** and **stop** (freeze for 3 seconds). Mix up the timing. Link it to self-regulation: practising the pause before reacting." },
  { id: "move-4", movement: true, title: "Movement: Fitness Circuit", core: false, about: "30 seconds on, 30 seconds rest: star jumps, squats, wall push-ups, step-ups.",
    guide: "**5 minutes.** 30 seconds on, 30 seconds rest: star jumps (or marching), squats, wall push-ups, step-ups. Students choose their own pace. Finish with a stretch." },
  { id: "move-5", movement: true, title: "Movement: Coordination Challenge", core: false, about: "Follow a sequence of instructions around a course, then plan a better route.",
    guide: "**5 minutes.** Call a sequence for students to follow: \"touch the door, three star jumps, touch the window, walk back\". Add a step each round. Then a student calls the sequence for the group." },
  { id: "move-6", movement: true, title: "Movement: Walk and Stretch", core: false, about: "A short walk, then gentle stretching and a cool-down.",
    guide: "**5–10 minutes, with a staff member.** A walk around the oval or quad, then stretches: reach up high, touch toes, shoulder rolls, calf stretch against a wall. Good for a student who needs time out of the room." }
];

// The room runs a two-day rotation, so students on their Day 1 and Day 2 share the same group
// sessions. Group modules are at the same times on both rotations: 8:50, 9:55, 11:27 and 12:30.
RP.ROTATIONS = {
  A: { 2: "t-red", 4: "riot-1", 6: "wellbeing", 8: "chain-analysis" },
  B: { 2: "code-of-conduct", 4: "riot-2", 6: "classroom-expectations", 8: "self-regulation" }
};

// Teacher-led sessions: an individual module with a staff member, one student at a time. Teachers
// drag them into an empty session; the other students keep working on their own. Who runs it is
// whoever is on the staffing for that session (run sheet). "day" is the day it's expected on (the
// plan editor reminds you), or null for either day.
RP.INDIVIDUAL_SESSIONS = [
  {
    id: "ind-review", day: 1, title: "Teacher-led: My Reset Plan",
    about: `Time with a staff member, just the two of you. You'll go through your Reset Plan together: what happened, your current plans and goals, and what you'd like to get out of the Reset Program.`,
    guide: `**Day 1, about 25–30 minutes.** Best after the student has done the independent **My Reset Plan** module: the session page shows their answers once they've finished it, with their Day 1 surveys and Module 1 and My Chain answers. If they haven't finished it, ask them to, or go through it together on their laptop.
- Check in: how are they feeling about being here? Check the morning ready-to-learn answers (breakfast, lunch, equipment).
- Go through the Sentral incident(s) together. Hear the student's side; focus on understanding, not blame.
- Review the current learning support plan (LSP), behaviour or wellbeing plans, and previous goals: what's working, what isn't?
- Note any learning or wellbeing needs to follow up (notes go in Sentral, not here).
- Agree 1–2 things to focus on during the program.`
  },
  {
    id: "ind-success", day: 2, title: "Teacher-led: My Return Plan",
    about: `Time with a staff member to write your plan for going back to class: your warning signs, your strategies, your goals, and the staff who will support you.`,
    guide: `**Day 2, about 30 minutes.** Best after the student has done the independent **My Return Plan** module (the Student Return to Class Plan): the plan on the session page fills in from their answers. Go through it together, change anything you agree on, then print it to sign. It's brought to the return from suspension meeting. Nothing typed on the page is saved, so print it (or save it as a PDF) before you leave the page.
- **Section 1, What have I learnt? (5 min):** the strategies they chose, and which one they'll use first.
- **Section 2, Student Code of Conduct (5 min):** the respect, responsibility and safety commitments they ticked, and what they'll do if they're frustrated or disagree with a teacher.
- **Section 3, My goal (5 min):** one goal for the first week, and how they'll know it's working.
- **Section 4, Support (10 min):** go through the supports they ticked and agree which are appropriate (SLSO, self-regulation card, Year Adviser or Head Teacher check-ins, RAGE, NASCA and so on). Untick any that aren't.
- **Section 5, My first week back (3 min):** what success looks like and what they'll do after a difficult lesson.
- **Section 6, Commitment (2 min):** read it together, then print and sign.`
  },
  {
    id: "ind-return-meeting", day: null, title: "Return from suspension meeting",
    about: `A meeting about going back to class. It may include your parent or carer and school staff. You'll talk about your return plan and the support you'll have.`,
    guide: `**About 30 minutes, usually at the end of Day 2 or the morning they return.** With the student, their parent or carer (in person or by phone), and the Deputy Principal or Head Teacher as the school requires. Have the printed *Return to class plan* ready (the session page can print it again).
- **Welcome:** the purpose is a positive, planned return, not to go over the incident again.
- **The student shares their plan:** strategies, goals and who they'll go to for support.
- **Agree supports:** check-ins, adjustments, catch-up work, how staff and home will communicate.
- **Next steps:** the review date, and who will follow up. Everyone signs the plan.
- Record the meeting in Sentral as the school requires; no notes are kept on this website.`
  },
  {
    id: "ind-classwork", day: null, title: "Classwork and assessment check-in",
    about: `Time with a staff member to look at the classwork and assessments you've missed or have coming up, and make a plan to catch up.`,
    guide: `**Either day, about 25–30 minutes.**
- Check the student's classes for missed work and upcoming assessment tasks (due dates, extensions or illness/misadventure if relevant).
- Prioritise: what's due first, what can be caught up in the program's independent sessions?
- Make a simple catch-up plan with the student and agree who they'll check in with in each class.`
  },
  {
    id: "ind-testing", day: null, title: "Learning and support check",
    about: `Time with a staff member to check how you're going with your learning, so the right support can be put in place when you go back to class.`,
    guide: `**Either day, about 25–30 minutes.** Run the school's learning and support screening (this varies). Results are recorded in the school's usual systems, not on this website.`
  }
];

// Independent sessions are left empty when a student is created; staff fill them in on the daily
// schedule. List module ids here (in order, into that day's free sessions) to pre-fill them.
RP.DEFAULT_ELECTIVES = { 1: [], 2: [] };

// Older plans only: the 1:1 stored as slot 11.
RP.ONE_TO_ONE = {
  1: { title: "1:1 with your teacher", about: "How you came to the Reset Program, your learning support plan and your goals." },
  2: { title: "1:1 with your teacher", about: "Getting ready to go back to class: your Reset & Reconnect Plan and who can help you." }
};
