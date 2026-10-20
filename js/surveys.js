/*
  End-of-day surveys, done in the afternoon debrief. Day 1 is the "pre" survey and Day 2 the
  "post" survey from the school's TRHS Post-Suspension Program survey, so the 10 rating
  statements can be compared. Answers are saved with the debrief session when submitted.
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

RP.SURVEYS = {
  1: {
    id: "survey-1", survey: 1, score: false,
    title: "End of Day 1 survey",
    items: [
      {
        type: "read", title: "End of Day 1 survey",
        text: `This survey helps us understand how you are feeling and what you already know. **There are no right or wrong answers.** It isn't a test. Please answer honestly.

Your answers go to your teacher and help us make the program better.`
      },
      {
        type: "rating", title: "How much do you agree?",
        q: "Choose one number for each statement.",
        low: "Strongly disagree", high: "Strongly agree",
        statements: RP.SURVEY_STATEMENTS
      },
      {
        type: "write", title: "A few questions about you",
        prompts: [
          "What is one thing that can make you feel angry, frustrated or overwhelmed at school?",
          "What do you usually do when you feel this way?",
          "What is one thing you would like to improve or work on while completing this program?"
        ]
      }
    ]
  },
  2: {
    id: "survey-2", survey: 2, score: false,
    title: "End of Day 2 survey",
    items: [
      {
        type: "read", title: "End of Day 2 survey",
        text: `Think about what you have learned during the program. **Please answer honestly.** Your answers help us understand what was useful and what support students may need in the future.`
      },
      {
        type: "rating", title: "How much do you agree?",
        q: "Choose one number for each statement.",
        low: "Strongly disagree", high: "Strongly agree",
        statements: RP.SURVEY_STATEMENTS
      },
      {
        type: "write", title: "Reflecting on the program",
        prompts: [
          "What is one thing you learned about yourself?",
          "What is one strategy you could use next time you feel angry or overwhelmed?",
          "What is one thing you plan to do differently when you return to class?",
          "Which part of the program was most helpful to you?",
          "What additional support, if any, would help you at school?"
        ]
      }
    ]
  }
};
