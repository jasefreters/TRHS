/* Module 5: Responsibility, Repair and Relationships. Focus: RAGE – Accountability, empathy and alternative responses. */
RP.registerModule({
  id: "module-5",
  title: "Module 5: Responsibility and Repair",
  icon: "🤝",
  score: false,
  about: `**RAGE: Accountability, empathy and alternative responses.** Think about who was affected, the difference between guilt and shame, and how to repair things.

About 25–30 minutes.`,
  items: [
    {
      type: "read", title: "Looking beyond myself",
      text: `What we do doesn't only affect us. Behaviour can affect:
- you
- peers and friendships
- teachers and other school staff
- the learning environment
- family members and the wider school community

Thinking about other people's point of view is the first step to repairing a situation.`
    },
    {
      type: "select", q: "Who may have been affected by what happened? Choose all that fit.",
      options: ["Me", "My friends", "Other students", "My teachers", "Other school staff", "My class's learning", "My family"],
      other: true
    },
    {
      type: "write", title: "Looking beyond myself",
      prompts: [
        "What impact might my actions have had on them?",
        "What could I do to help repair the situation?",
        "What would taking responsibility look like?"
      ]
    },
    {
      type: "read", title: "Guilt and shame",
      text: `**Guilt** can be a signal that we regret something we've done and want to make amends. It's about what we **did**: "I did something that hurt someone."

**Shame** makes us feel that we **are** bad: "I am a bad person." Shame can make it harder to change, because it feels like there's no point trying.

You can take responsibility for a poor choice without deciding you're a bad person.`
    },
    {
      type: "sort", q: "Is each thought about **guilt** (what I did) or **shame** (who I am)?",
      buckets: ["Guilt: what I did", "Shame: who I am"],
      cards: [
        { text: "I did something that hurt someone.", bucket: 0 },
        { text: "I made a poor choice and I want to fix it.", bucket: 0 },
        { text: "I regret what I said, and I'll apologise.", bucket: 0 },
        { text: "I am a bad person.", bucket: 1 },
        { text: "I always ruin everything.", bucket: 1 },
        { text: "There's no point trying. I'm just bad.", bucket: 1 }
      ]
    },
    {
      type: "write", title: "Guilt and shame",
      prompts: [
        "How can I take responsibility without putting myself down?",
        "How can I learn from what happened rather than repeat it?"
      ]
    },
    {
      type: "read", title: "Choosing a better response",
      text: `Here's a situation:

**You feel that a teacher has spoken to you unfairly in front of your peers. You become angry and want to argue.**`
    },
    {
      type: "mc", q: "Which response is most likely to help, in the moment?",
      choices: [
        "Argue back in front of the class.",
        "Walk out and slam the door.",
        "Take a breath, stay calm, and ask to talk to the teacher privately after class.",
        "Refuse to do any more work for the rest of the lesson."
      ],
      answer: 2,
      explain: "You can still raise your concern. Doing it calmly and privately makes it much more likely to be heard."
    },
    {
      type: "write", title: "Choosing a better response",
      q: "Think about the same situation.",
      prompts: [
        "An unhelpful response would be…",
        "The likely consequences would be…",
        "A more appropriate response would be…",
        "How I could raise my concern respectfully…",
        "Who I could approach for support if it isn't sorted out…"
      ]
    },
    {
      type: "read", title: "Key message",
      text: `**Taking responsibility is not about being perfect.** It is about recognising the impact of our actions and making an effort to do better.

Your teacher may talk with you about a restorative conversation or other ways to make amends.`
    }
  ]
});
