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
// the dashboard shows any that are still missing.
RP.GROUP_SESSIONS = [
  { id: "t-red", title: "T-RED expectations", core: true },
  { id: "riot", title: "RIOT", core: true },
  { id: "wellbeing", title: "Wellbeing", core: true },
  { id: "self-regulation-group", title: "Self-regulation", core: true },
  { id: "code-of-conduct", title: "Student Code of Conduct", core: true },
  { id: "problem-solving", title: "Problem-solving", core: false }
];

// The room runs a two-day rotation, so students on their Day 1 and Day 2 share the same group
// sessions. Each rotation says which group session runs in which slot; the other slots are
// for electives.
RP.ROTATIONS = {
  A: { 2: "t-red", 5: "riot", 8: "wellbeing" },
  B: { 2: "code-of-conduct", 5: "self-regulation-group", 8: "problem-solving" }
};

RP.ONE_TO_ONE = {
  1: { title: "1:1 with your teacher", about: "How you came to the Reset Program, your learning support plan and your goals." },
  2: { title: "1:1 with your teacher", about: "Getting ready to go back to class: your Reset & Reconnect Plan and who can help you." }
};
