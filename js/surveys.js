/*
  Surveys, from the school's TRHS Post-Suspension Program survey. Students do one at the start
  (morning session) and end (afternoon debrief) of each day, and a follow-up a few weeks after
  returning to class. Every survey has the same 10 rating statements, so change can be measured.
  Surveys done at the same time are the same length, because Day 1 and Day 2 students do them
  together. Answers are saved with the session when submitted, linked to the student's code only.
*/
window.RP = window.RP || {};

RP.SURVEY_STATEMENTS = [
  "I can recognise when I am starting to feel angry, frustrated or overwhelmed.",
  "I understand what situations or things can trigger my anger.",
  "I know strategies I can use to calm myself down when I am upset.",
  "I can stop and think before reacting when I am angry.",
  "I understand how my choices and behaviour can affect other people.",
  "I can take responsibility for my actions and learn from my mistakes.",
  "I can think of different ways to handle conflict or difficult situations.",
  "I feel confident that I can make positive choices when I return to class.",
  "I know which staff member or trusted adult I can approach if I need help at school.",
  "I feel confident that I can manage challenges and get back on track at school."
];

(function () {
  const PRIVACY = "Please don't write anyone's name, or details that could identify you or anyone else.";
  const intro = (title, text) => ({ type: "read", title, text: `${text}\n\n**There are no right or wrong answers.** It isn't a test. Your answers go to your teacher and help make the program better. ${PRIVACY}` });
  const ratings = { type: "rating", title: "How much do you agree?", q: "Choose one number for each statement.", low: "Strongly disagree", high: "Strongly agree", statements: RP.SURVEY_STATEMENTS };
  const write = (title, prompts) => ({ type: "write", title, prompts });
  const survey = (id, title, items) => ({ id, survey: id, score: false, title, items });

  RP.SURVEYS = {
    d1am: survey("d1am", "Day 1 morning survey", [
      intro("Day 1 morning survey", "Welcome to the Reset Program. This survey helps us understand how you're feeling at the start."),
      ratings,
      write("Starting today", [
        "What's one thing you'd like to get out of today?",
        "Is there anything that would help you feel more comfortable in the Hub today?"
      ])
    ]),
    d2am: survey("d2am", "Day 2 morning survey", [
      intro("Day 2 morning survey", "Welcome back. This survey helps us understand how you're feeling at the start of Day 2."),
      ratings,
      write("Starting today", [
        "What's one thing you want to focus on today?",
        "What's one thing from yesterday that you want to keep using?"
      ])
    ]),
    d1pm: survey("d1pm", "Day 1 afternoon survey", [
      intro("Day 1 afternoon survey", "Think about today. This survey helps us understand how you're going."),
      ratings,
      write("About you and today", [
        "What is one thing that can make you feel angry, frustrated or overwhelmed at school?",
        "What do you usually do when you feel this way?",
        "What is one thing you would like to improve or work on while completing this program?",
        "What was the best part of today?",
        "What's one goal for tomorrow?"
      ])
    ]),
    d2pm: survey("d2pm", "Day 2 afternoon survey", [
      intro("Day 2 afternoon survey", "Think about what you have learned during the program. Your answers help us understand what was useful and what support students may need in the future."),
      ratings,
      write("Reflecting on the program", [
        "What is one thing you learned about yourself?",
        "What is one strategy you could use next time you feel angry or overwhelmed?",
        "What is one thing you plan to do differently when you return to class?",
        "Which part of the program was most helpful to you?",
        "What additional support, if any, would help you at school?"
      ])
    ]),
    followup: survey("followup", "Follow-up survey", [
      intro("Follow-up survey", "It's been a few weeks since you finished the Reset Program. This survey helps us see how things are going back in class."),
      ratings,
      write("Since you went back to class", [
        "What has gone well since you went back to class?",
        "Which strategy have you used, and how did it go?",
        "What has been hard?",
        "What extra support, if any, would help you now?"
      ])
    ])
  };

  RP.SURVEY_ORDER = ["d1am", "d1pm", "d2am", "d2pm", "followup"];
  RP.SURVEY_SHORT = { d1am: "D1 start", d1pm: "D1 end", d2am: "D2 start", d2pm: "D2 end", followup: "Follow-up" };

  // Which survey a session holds: the morning session and debrief hold that day's surveys;
  // a follow-up program has a single "survey" session.
  RP.surveyIdFor = function (s) {
    if (s.kind === "intro") return "d" + s.day + "am";
    if (s.kind === "debrief") return "d" + s.day + "pm";
    if (s.kind === "survey") return s.activity;
    return null;
  };
  // Saved survey results: { survey: "d1am", ratings: [...], total, max }. Older results stored the
  // end-of-day survey as survey: 1 or 2.
  RP.surveyResultId = r => (r && r.survey ? (typeof r.survey === "number" ? "d" + r.survey + "pm" : r.survey) : null);
})();
