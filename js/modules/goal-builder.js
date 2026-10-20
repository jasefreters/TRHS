/* Goal Builder: SMART goals, ending in a goal card the student can save. Stands alone. */
RP.registerModule({
  id: "goal-builder",
  title: "Goal Builder",
  icon: "🎯",
  score: false,
  about: `**Set a goal you'll actually reach.** Learn what makes a goal SMART, then build your own goal card to take back to class.

About 25 minutes.`,
  deeper: ["What might get in the way of your goal, and what will you do if it does?"],
  items: [
    {
      type: "read", title: "SMART goals",
      text: `A good goal is **SMART**:
- **S**pecific: clear about exactly what you'll do.
- **M**easurable: you can tell when you've done it.
- **A**chievable: realistic for you right now.
- **R**elevant: it matters to you.
- **T**ime-bound: it has a deadline.

"Do better at school" isn't SMART. "Hand in my English draft by Friday and ask for feedback" is.`,
      easy: {
        text: `A good goal is **SMART**:
- **S**pecific: exactly what you'll do
- **M**easurable: you can tell when it's done
- **A**chievable: you can really do it
- **R**elevant: it matters to you
- **T**ime-bound: it has a date`
      }
    },
    {
      type: "match", q: "Match each SMART letter to what it means.",
      pairs: [
        { left: "S: Specific", right: "Clear about exactly what you'll do" },
        { left: "M: Measurable", right: "You can tell when you've done it" },
        { left: "A: Achievable", right: "Realistic for you right now" },
        { left: "R: Relevant", right: "It matters to you" },
        { left: "T: Time-bound", right: "It has a deadline" }
      ]
    },
    {
      type: "sort", q: "Is each goal SMART, or not yet?",
      buckets: ["SMART", "Not SMART yet"],
      cards: [
        { text: "Hand in my English draft by Friday", bucket: 0 },
        { text: "Be on time to every class next week", bucket: 0 },
        { text: "Ask for a break before I get to red, every time this week", bucket: 0 },
        { text: "Be good", bucket: 1 },
        { text: "Never get in trouble again", bucket: 1 },
        { text: "Be the best in the class at everything", bucket: 1 }
      ]
    },
    {
      type: "mc", q: "Which goal is the most SMART?",
      choices: [
        "Do better at school.",
        "Get 100% on every test this year.",
        "Finish my science worksheet by Thursday and ask my teacher to check it.",
        "Try harder."
      ],
      answer: 2
    },
    {
      type: "write", title: "Build my goal",
      prompts: [
        "**S** What exactly do I want to do?",
        "**M** How will I know I've done it?",
        "**A** Why is it realistic for me?",
        "**R** Why does it matter to me?",
        "**T** By when?"
      ]
    },
    {
      type: "select", q: "Who could help me reach it? Choose any that fit.",
      options: ["A class teacher", "My year adviser", "The learning support team", "Hub staff", "Someone at home", "A friend"],
      other: true
    },
    {
      type: "slider", q: "How confident am I that I'll reach my goal?",
      sliders: [{ label: "Confidence", min: 0, max: 10, left: "Not at all", right: "Very" }]
    },
    {
      type: "read", title: "Your goal card",
      text: `Your goal is on your answers page at the end. **Save it as a PDF** or **email** it to yourself so you can look at it when you're back in class.

**Key message:** a goal without a plan is just a wish. Make it SMART, and tell someone who can help.`
    }
  ]
});
