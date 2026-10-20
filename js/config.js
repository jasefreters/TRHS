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
// The 1:1 with the teacher has no fixed time: the teacher pulls the student out during
// independent work. It is stored as slot 11.
RP.ONE_TO_ONE_SLOT = 11;

// Teacher-led sessions. "core" ones must be done at least once across a student's two days;
// the dashboard shows any that are still missing. "about" is shown on the student's screen.
// The six movement sessions are the physical-activity half of each module.
RP.GROUP_SESSIONS = [
  { id: "move-1", module: 1, title: "Starting Point Circuit", core: true,
    about: `Stationary cycling, marching, step-ups or squats. Choose a starting level you can manage and finish the circuit safely.

Think about:
- What helped you keep going?
- What would you change if you did this activity again?
- What is one small step you can take to make your return to school successful?` },
  { id: "move-2", module: 2, title: "Boxing and Breathing", core: true,
    about: `Jab, cross, step back and reset, in short rounds with rests. Between rounds, notice your breathing, heart rate and muscle tension.

Think about:
- What changes did I notice in my body while exercising?
- How can I recognise when my emotions are escalating?
- What can I do to calm myself before reacting?` },
  { id: "move-3", module: 3, title: "Stop-Start Agility", core: true,
    about: `Move between the cones and respond to "go", "slow" and "stop". Practise pausing, breathing and resetting before you continue.

Think about: a peer makes a disrespectful comment during class. What would your first reaction be, and what would be a more helpful response?` },
  { id: "move-4", module: 4, title: "Fitness Circuit", core: true,
    about: `Star jumps or marching, squats, wall push-ups, step-ups, agility ladder or brisk walking: 30 seconds on, 30 seconds rest.

Think about:
- What helps me keep going when something is difficult?
- What are my signs that I need a break?
- What healthy strategies help me reset?` },
  { id: "move-5", module: 5, title: "Coordination Challenge", core: true,
    about: `Complete the course by following a sequence of instructions, then plan and improve your approach.

Think about: what choices were available in a past conflict, what the consequences of each were, and who could have been affected.` },
  { id: "move-6", module: 6, title: "Walk and Stretch", core: true,
    about: `A short walk, then gentle stretching and a cool-down.

Think about:
- One behaviour I want to improve
- One strategy I'll use when I feel angry
- One person I can speak to when I need help` },
  { id: "t-red", title: "T-RED expectations", core: false },
  { id: "code-of-conduct", title: "Student Code of Conduct", core: false }
];

// The room runs a two-day rotation, so students on their Day 1 and Day 2 share the same group
// sessions. Each rotation says which group session runs in which slot.
RP.ROTATIONS = {
  A: { 2: "move-1", 5: "move-2", 8: "move-3" },
  B: { 2: "move-4", 5: "move-5", 8: "move-6" }
};

// Electives filled in when a student is created (teachers can change them). Modules 1–3 on
// Day 1 and 4–6 on Day 2, so the Return-to-School Plan comes last.
RP.DEFAULT_ELECTIVES = {
  1: { 3: "module-1", 4: "numeracy", 6: "module-2", 7: "literacy", 9: "module-3" },
  2: { 3: "module-4", 4: "numeracy", 6: "module-5", 7: "literacy", 9: "module-6" }
};

RP.ONE_TO_ONE = {
  1: { title: "1:1 with your teacher", about: "How you came to the Reset Program, your learning support plan and your goals." },
  2: { title: "1:1 with your teacher", about: "Getting ready to go back to class: your Reset & Reconnect Plan and who can help you." }
};
