/* Module 1: My Reset – Reflecting and Moving Forward. Focus: wellbeing, accountability and re-engagement. */
RP.registerModule({
  id: "module-1",
  title: "Module 1: My Reset",
  icon: "🔄",
  score: false,
  about: `**Reflecting and moving forward.** A chance to look back on what happened, think about your choices and decide what you want to do differently.

About 25–30 minutes. There are no wrong answers.`,
  items: [
    {
      type: "read", title: "Welcome to Module 1",
      text: `This module is a safe place to think about your suspension, the choices you made and what you want to do differently.

You only need to share what you're comfortable with. You can leave any question blank.

When you finish the module, your answers are sent to your teacher, who will talk them through with you in your 1:1. Please don't write other students' names.`
    },
    { type: "scale", q: "Check-in: how are you feeling about being back at school?", labels: ["Worried", "Unsure", "Okay", "Ready", "Good"] },
    {
      type: "write", title: "Check-in",
      prompts: [
        "What has been on your mind since your suspension?",
        "What would help you feel supported today?",
        "What would you like to be different moving forward?"
      ]
    },
    {
      type: "read", title: "Reflecting on the situation",
      text: `Thinking about what happened can help you make different choices next time. It's not about blame.

Take your time with the next two pages. Answer as honestly as you can, and skip anything you're not ready to write about. You can talk about it with your teacher instead.`
    },
    {
      type: "write", title: "Reflecting on the situation (part 1)",
      prompts: [
        "What happened before the situation escalated?",
        "What was I thinking and feeling at the time?",
        "What choices did I make?"
      ]
    },
    {
      type: "write", title: "Reflecting on the situation (part 2)",
      prompts: [
        "What were the consequences of those choices?",
        "How might my actions have affected other people?",
        "What could I do differently if a similar situation happened again?"
      ]
    },
    {
      type: "mc", q: "Which statement matches the big idea of this module?",
      choices: [
        "A mistake defines who you are.",
        "Taking responsibility and making different choices can help you move forward.",
        "It's best not to think about what happened.",
        "You have to fix everything at once."
      ],
      answer: 1,
      explain: "Returning to school is a chance to start again. You don't need to be perfect or fix everything at once. Start with one achievable step."
    },
    {
      type: "write", title: "My reset",
      q: "Complete these statements.",
      prompts: [
        "One thing I have learned from this experience is…",
        "One choice I would change is…",
        "One thing I want to improve at school is…",
        "One person who can support me is…"
      ]
    },
    {
      type: "read", title: "Key message",
      text: `**A mistake does not define who you are.** Taking responsibility and making different choices can help you move forward.

Next you'll see your certificate and your answers.`
    }
  ]
});
