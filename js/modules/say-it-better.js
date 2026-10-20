/* Say It Better: assertive communication and "I" statements. Stands alone. */
RP.registerModule({
  id: "say-it-better",
  title: "Say It Better",
  icon: "💬",
  score: false,
  about: `**Getting heard without getting in trouble.** Learn the difference between passive, aggressive and assertive, build your own "I" statement, and practise what to say when things get tense.

About 25–30 minutes.`,
  deeper: [
    "Why do people usually listen more to calm, assertive words than to yelling?",
    "Think of someone you know who stays calm and assertive (don't write their name). What do they do or say?"
  ],
  items: [
    {
      type: "read", title: "Three ways to respond",
      text: `When something annoys or upsets us, we usually respond in one of three ways:
- **Passive:** keeping it all in, giving in, or saying nothing, then feeling bad later.
- **Aggressive:** yelling, blaming, insulting or threatening. You might get your way for a moment, but people stop listening and you end up in trouble.
- **Assertive:** saying what you feel and what you need, calmly and respectfully.

Assertive isn't weak. It's the way that's most likely to actually get you heard.`,
      easy: {
        text: `When something upsets us, we can:
- **Passive:** say nothing and keep it in.
- **Aggressive:** yell, blame or threaten.
- **Assertive:** say how you feel and what you need, calmly.

Assertive is the best way to be heard.`
      },
      more: `Assertive communication also respects the other person. You can disagree with a teacher or a friend and still be respectful. That's a skill adults use every day at work.`
    },
    {
      type: "sort", q: "Is each response passive, aggressive or assertive?",
      buckets: ["Passive", "Aggressive", "Assertive"],
      cards: [
        { text: "\"Whatever. I don't care.\"", bucket: 0 },
        { text: "Saying nothing and stewing about it all day", bucket: 0 },
        { text: "\"Get out of my way, idiot!\"", bucket: 1 },
        { text: "\"Shut up or you'll regret it.\"", bucket: 1 },
        { text: "\"I'm annoyed you took my seat. Can you move, please?\"", bucket: 2 },
        { text: "\"I don't get this. Can you explain it again?\"", bucket: 2 }
      ]
    },
    {
      type: "read", title: "\"I\" statements",
      text: `An **"I" statement** talks about how *you* feel, instead of blaming the other person.

**Blaming:** "You always pick on me!"
**"I" statement:** "I feel embarrassed when I'm moved in front of everyone. I need to talk about it after class."

The formula: **I feel** ___ **when** ___. **I need** ___.`,
      easy: {
        text: `An **"I" statement** says how you feel, without blaming.

Blaming: "You always pick on me!"
"I" statement: "I feel embarrassed when I'm moved in front of everyone."

Use: **I feel** ___ **when** ___. **I need** ___.`
      }
    },
    {
      type: "tiles", title: "Build an \"I\" statement",
      q: "Tap each gap, then tap a tile to fill it.",
      parts: [
        "I feel ",
        { options: ["frustrated", "embarrassed", "annoyed", "worried", { text: "like you're an idiot", warn: "That's an insult, not a feeling. Try a feeling word." }] },
        " when ",
        { options: ["I'm asked to move in front of everyone", "people talk over me", "my things get taken", { text: "you always pick on me", warn: "\"You always…\" sounds like blame. Describe what happened instead." }] },
        ". I need ",
        { options: ["a minute to calm down", "to talk about it after class", "help with the work", "you to ask me first"] },
        "."
      ]
    },
    {
      type: "mc", q: "Your teacher says, \"Phone away, please.\" Which reply is assertive?",
      easy: { q: "Teacher: \"Phone away, please.\" Which reply is calm and respectful?" },
      choices: [
        "\"Make me.\"",
        "\"Everyone else has theirs out!\"",
        "\"Okay. Could I check one message at recess? It's from home.\"",
        "Ignoring the teacher and keeping on scrolling"
      ],
      answer: 2,
      explain: "It follows the instruction first, then asks calmly for what you need."
    },
    {
      type: "story", title: "The seat swap",
      start: "start",
      nodes: {
        start: { text: "Your teacher asks you to move seats, in front of the whole class. You feel your face go hot.", choices: [
          { label: "Say loudly: \"Why me? This is so unfair!\"", to: "argue" },
          { label: "Take a breath, move, and ask to talk after class", to: "calm" },
          { label: "Refuse and put your head down", to: "refuse" }
        ] },
        argue: { text: "The class turns to look. Your teacher says, \"I've asked you once. Please move now.\" You feel even more embarrassed.", choices: [
          { label: "Keep arguing", to: "sentOut" },
          { label: "Stop, breathe, move, and say \"Can we talk after class?\"", to: "recovered" }
        ] },
        refuse: { text: "Your teacher comes over and quietly asks what's going on.", choices: [
          { label: "Say nothing", to: "stuck" },
          { label: "Say: \"I'm embarrassed. Can I move at the break instead?\"", to: "compromise" }
        ] },
        calm: { text: "You stayed in control. After class you explained how you felt, and your teacher listened.", end: "good" },
        recovered: { text: "You moved. After class your teacher explained you'd been moved to help another student, not as a punishment.", end: "good" },
        compromise: { text: "Your teacher agreed to a compromise. Saying how you felt made the difference.", end: "good" },
        sentOut: { text: "The argument gets louder and you're sent out. You never got to explain why you were upset.", end: "bad" },
        stuck: { text: "Nothing gets sorted, and you're marked as refusing to follow instructions.", end: "bad" }
      }
    },
    {
      type: "write", title: "My \"I\" statement",
      q: "Think of a situation where an \"I\" statement could help. Don't use any names.",
      prompts: ["The situation:", "My \"I\" statement (I feel… when… I need…):"]
    },
    {
      type: "read", title: "Key message",
      text: `**Calm, clear and respectful gets you heard.** You can disagree and still be respectful. That's what being assertive means.`
    }
  ]
});
