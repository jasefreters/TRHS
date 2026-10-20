/* Restorative Conversation Prep: getting ready to talk about what happened and make things right. Stands alone. */
RP.registerModule({
  id: "restorative-prep",
  title: "Restorative Conversation Prep",
  icon: "🔁",
  score: false,
  about: `**Getting ready to make things right.** Think through what happened, who was affected and what could help repair it, so you're ready if there's a restorative conversation.

About 25–30 minutes.`,
  deeper: ["What might the other person need to hear from you?"],
  items: [
    {
      type: "read", title: "What is a restorative conversation?",
      text: `A **restorative conversation** is a talk, with a staff member there to help, between the people involved in something that went wrong.

It's not about blame or punishment. It's about:
- understanding what happened from each side
- seeing who was affected and how
- working out what needs to happen to make things right
- agreeing how to stop it happening again.

It takes courage. Preparing first makes it much easier.`,
      easy: {
        text: `A **restorative conversation** is a talk with the people involved, with a staff member there to help.

It's not about blame. It's about:
- what happened
- who was hurt
- how to make it right
- how to stop it happening again.`
      },
      more: `Restorative practices are used in schools, workplaces and even courts. People who take part often say they feel better afterwards, because things finally get sorted out instead of hanging around.`
    },
    {
      type: "order", q: "Put the steps of a restorative conversation in order.",
      cards: [
        "Each person says what happened, from their point of view.",
        "Each person shares what they were thinking and feeling.",
        "Everyone talks about who was affected and how.",
        "Together, work out what needs to happen to make things right.",
        "Agree what will happen next time."
      ]
    },
    {
      type: "write", title: "Thinking it through",
      q: "These are the questions usually asked in a restorative conversation. Please don't use any names.",
      prompts: [
        "What happened, from my point of view?",
        "What was I thinking at the time?",
        "What have I thought about since?",
        "Who has been affected, and how?",
        "What do I need to do to make things right?"
      ]
    },
    {
      type: "mc", q: "Which of these is a real apology?",
      choices: [
        "\"Sorry, but you started it.\"",
        "\"Sorry you feel that way.\"",
        "\"I'm sorry I yelled at you. That wasn't okay, and next time I'll take a break.\"",
        "\"Fine, sorry. Happy now?\""
      ],
      answer: 2,
      explain: "A real apology owns what you did, doesn't blame the other person, and says what you'll do differently."
    },
    {
      type: "tiles", title: "Build an apology",
      q: "Tap each gap, then tap a tile to fill it.",
      parts: [
        "I'm sorry for ",
        { options: ["what I said", "what I did", "losing my temper", "the trouble I caused"] },
        ". I understand it ",
        { options: ["hurt you", "embarrassed you", "made class hard for everyone", { text: "wasn't a big deal", warn: "That makes it smaller than it was. A real apology owns the impact." }] },
        ". Next time I will ",
        { options: ["walk away and calm down", "ask for a break", "talk to someone first", "speak respectfully"] },
        "."
      ]
    },
    {
      type: "select", title: "Making amends",
      q: "Which of these could help make things right? Choose all that could work.",
      options: [
        "Apologising in person",
        "Writing an apology note",
        "Fixing or replacing something",
        "Helping out in the class or school",
        "Doing something kind",
        "Agreeing to a plan so it doesn't happen again"
      ],
      other: true
    },
    {
      type: "slider", q: "How ready do I feel to have a restorative conversation?",
      sliders: [{ label: "Ready to talk", min: 0, max: 10, left: "Not ready", right: "Ready" }]
    },
    {
      type: "read", title: "Key message",
      text: `**Making things right takes courage.** Owning what happened and listening to the other side is how trust gets rebuilt.`
    }
  ]
});
