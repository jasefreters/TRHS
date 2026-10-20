/* Study Skills: getting organised, focusing and catching up. Stands alone. */
RP.registerModule({
  id: "study-skills",
  title: "Study Skills",
  icon: "📚",
  score: false,
  about: `**Get organised and catch up.** Learn how to start a big task, stay focused, and make a plan for the work you've missed.

About 25–30 minutes.`,
  deeper: ["What's one study habit that already works for you, and why does it work?"],
  items: [
    {
      type: "read", title: "Working smarter",
      text: `Missing school can leave you with a pile of work, and that can feel overwhelming. A few study skills make it much easier:
- **Break it down:** big tasks become small steps.
- **Plan it:** write due dates in a planner or calendar.
- **Focus in blocks:** work for about 25 minutes, then take a short break.
- **Cut distractions:** phone away, somewhere quiet.
- **Ask early:** if you're stuck, ask your teacher before the due date.`,
      easy: {
        text: `Lots of work can feel too much. These help:
- Break big jobs into small steps.
- Write due dates down.
- Work for 25 minutes, then take a short break.
- Put your phone away.
- Ask for help early.`
      }
    },
    {
      type: "order", q: "Put the steps for starting an assignment in order.",
      cards: [
        "Read the task and the marking guidelines.",
        "Highlight exactly what you have to do.",
        "Break it into small steps.",
        "Make a timeline up to the due date.",
        "Start the first small step.",
        "Ask for feedback on a draft."
      ]
    },
    {
      type: "match", q: "Match each strategy to what it helps with.",
      pairs: [
        { left: "A planner or calendar", right: "Remembering due dates" },
        { left: "25-minute work blocks with short breaks", right: "Staying focused" },
        { left: "Phone in another room", right: "Fewer distractions" },
        { left: "Flashcards", right: "Remembering facts for tests" },
        { left: "Explaining it to someone else", right: "Checking you really understand" }
      ]
    },
    {
      type: "mc", q: "You have a big assignment due in two weeks. What's the best plan?",
      choices: [
        "Wait until the night before. You work better under pressure.",
        "Break it into small parts and do a bit each day.",
        "Do it all in one go this weekend and never check it.",
        "Hope it gets cancelled."
      ],
      answer: 1
    },
    {
      type: "select", q: "What distracts me most when I'm trying to work? Choose all that fit.",
      options: ["My phone", "Games", "Noise", "Friends", "Being tired", "Not understanding the work"],
      other: true
    },
    {
      type: "slider", title: "My study habits",
      sliders: [
        { label: "How organised I am", min: 0, max: 10, left: "Not at all", right: "Very" },
        { label: "How easily I get distracted", min: 0, max: 10, left: "Hardly ever", right: "All the time" }
      ]
    },
    {
      type: "write", title: "My catch-up plan",
      prompts: [
        "Work I've missed or have coming up:",
        "What I'll do first:",
        "When and where I'll do it:",
        "Who I'll check in with (a role, not a name):"
      ]
    },
    {
      type: "read", title: "Key message",
      text: `**Small steps, every day.** A plan turns a pile of work into something you can actually get through.`
    }
  ]
});
