/* Module 4: Stress, Faulty Thinking and Problem-Solving. Focus: RIOT – Stress Bucket, Locus of Control and Faulty Thinking. */
RP.registerModule({
  id: "module-4",
  title: "Module 4: Stress and Thinking",
  icon: "🪣",
  score: false,
  deeper: ["What's one tap you could use every day, not just when things go wrong?"],
  about: `**RIOT: Stress Bucket, Locus of Control and Faulty Thinking.** See how stress builds up, check unhelpful thoughts, and sort out what you can and can't control.

About 25–30 minutes.`,
  items: [
    {
      type: "read", title: "My stress bucket",
      easy: { text: `Imagine you carry a bucket. Stress fills it: school, friends, family, not enough sleep.

If it gets too full, it **overflows**. That's when people snap.

Healthy things like talking, moving or music are **taps**. They let some stress out.` },
      text: `Imagine you carry a bucket. Stress pours in from lots of places: school, friendships, family, not enough sleep, other people's expectations and other pressures.

If the bucket fills up and nothing lets the stress out, it **overflows**. That's often when people snap, shut down or do things they regret.

Healthy strategies are like **taps** on the bucket. They let some of the stress out before it overflows.`
    },
    {
      type: "select", title: "What's in my bucket?",
      q: "What is filling your bucket at the moment? Choose all that fit.",
      options: ["Schoolwork", "Friendships", "Family", "Not enough sleep", "Other people's expectations", "Being in trouble at school", "Sport, work or other commitments", "Money"],
      other: true
    },
    {
      type: "slider", title: "How full is my bucket?",
      sliders: [{ label: "My stress bucket right now", min: 0, max: 10, left: "Empty", right: "Overflowing" }]
    },
    {
      type: "write", title: "My stress bucket",
      prompts: [
        "What are my early signs that my bucket is getting full?",
        "What helps me release some of that stress?",
        "Who can I talk to before things become too much?"
      ]
    },
    {
      type: "read", title: "Check the thought",
      easy: { text: `Thoughts change how we feel. Some thoughts make things worse:
- "Everyone is against me."
- "If I walk away, I look weak."

Checking a thought means asking: **is it really true?**` },
      text: `Our thoughts affect how we feel and what we do. Some thoughts are **unhelpful**: they make a situation feel worse than it is. For example:
- "Everyone is against me."
- "The teacher is picking on me."
- "If I walk away, I look weak."
- "I have already ruined everything, so it doesn't matter what I do now."

Checking a thought means asking whether it's really true, and whether there's a more helpful way to see things.`
    },
    {
      type: "mc", q: "Thought: **\"If I walk away, I look weak.\"** Which is a more helpful thought?",
      choices: [
        "I have to win every argument.",
        "Walking away takes strength, and it keeps me out of trouble.",
        "Everyone will laugh at me forever.",
        "I'll get them back later."
      ],
      answer: 1
    },
    {
      type: "write", title: "Check the thought: my turn",
      q: "Choose one of the thoughts above, or one of your own, and check it.",
      prompts: [
        "The thought:",
        "What evidence supports this thought?",
        "Is there another way to interpret the situation?",
        "What would I tell a friend who had this thought?",
        "A more helpful thought I could use is…"
      ]
    },
    {
      type: "sort", q: "What can I control? Sort each card.",
      buckets: ["I can control", "I can't fully control"],
      cards: [
        { text: "My words and actions", bucket: 0 },
        { text: "Whether I ask for help", bucket: 0 },
        { text: "How I respond to feedback", bucket: 0 },
        { text: "Whether I attempt my work", bucket: 0 },
        { text: "Whether I use my regulation strategies", bucket: 0 },
        { text: "Other people's opinions", bucket: 1 },
        { text: "What someone else says or does", bucket: 1 },
        { text: "Every decision made by another person", bucket: 1 },
        { text: "What has already happened", bucket: 1 }
      ]
    },
    {
      type: "write", title: "Reflection",
      prompts: ["What is one thing within my control that I can change when I return to class?"]
    },
    {
      type: "read", title: "Key message",
      text: `**I cannot change everything happening around me, but I can take steps to influence what happens next.**`
    }
  ]
});
