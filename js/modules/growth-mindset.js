/* Growth Mindset: "not yet" thinking (links to the T-RED value Excel). Stands alone. */
RP.registerModule({
  id: "growth-mindset",
  title: "Growth Mindset",
  icon: "🌱",
  score: false,
  about: `**The power of "yet".** Learn how your brain grows when things are hard, and swap fixed thinking for growth thinking.

About 25 minutes.`,
  deeper: ["Think of something you're good at now. How did you get good at it?"],
  items: [
    {
      type: "read", title: "Fixed or growth?",
      text: `People think about their abilities in two ways:
- **Fixed mindset:** "I'm just not good at this. You're either smart or you're not."
- **Growth mindset:** "I can't do this **yet**. I can get better with effort, good strategies and help."

Your brain is like a muscle. When you work at something hard, it builds new connections. Mistakes and struggle are part of how you learn, not proof that you can't.`,
      easy: {
        text: `**Fixed mindset:** "I'm not good at this. I never will be."
**Growth mindset:** "I can't do this **yet**. I can get better."

Your brain grows when you work at hard things. Mistakes help you learn.`
      },
      more: `This links to our school value **Excel**: performing at your highest potential. Nobody starts out excellent. Excelling comes from practice, feedback and not giving up.`
    },
    {
      type: "video", title: "Developing a growth mindset",
      youtube: "rUJkbWNnNy4",
      text: `People with a **fixed mindset** think their abilities can't change, so they avoid challenges and give up quickly. People with a **growth mindset** know they can improve, so they try hard things, learn from mistakes and keep going. Nobody is perfect. Mistakes are how everyone learns.`
    },
    {
      type: "sort", q: "Is each thought fixed or growth?",
      buckets: ["Fixed mindset", "Growth mindset"],
      cards: [
        { text: "\"I'm just not a maths person.\"", bucket: 0 },
        { text: "\"If I have to try hard, I must be dumb.\"", bucket: 0 },
        { text: "\"I give up. I'll never get it.\"", bucket: 0 },
        { text: "\"Some people are just smart.\"", bucket: 0 },
        { text: "\"I can't do this yet.\"", bucket: 1 },
        { text: "\"Mistakes help me learn.\"", bucket: 1 },
        { text: "\"I'll try a different strategy.\"", bucket: 1 },
        { text: "\"Feedback helps me get better.\"", bucket: 1 }
      ]
    },
    {
      type: "match", q: "Match each fixed thought to a growth version.",
      pairs: [
        { left: "\"I can't do this.\"", right: "\"I can't do this yet.\"" },
        { left: "\"This is too hard.\"", right: "\"This will take some time and effort.\"" },
        { left: "\"I made a mistake.\"", right: "\"Mistakes help me learn.\"" },
        { left: "\"I'm not good at this.\"", right: "\"What am I missing? Who can help me?\"" },
        { left: "\"I'll never be as good as them.\"", right: "\"I can learn from how they do it.\"" }
      ]
    },
    {
      type: "mc", q: "Top athletes and musicians mostly get good by…",
      choices: ["being born talented", "practising a lot over a long time", "luck", "never making mistakes"],
      answer: 1,
      explain: "We usually see them after they've got good, not the years of practice behind it."
    },
    {
      type: "slider", title: "How true is this for me?",
      sliders: [
        { label: "I believe I can get better at things I find hard", min: 0, max: 10, left: "Not true", right: "Very true" },
        { label: "I keep going when work gets hard", min: 0, max: 10, left: "Not true", right: "Very true" }
      ]
    },
    {
      type: "write", title: "Not yet",
      prompts: [
        "Something I can't do yet:",
        "What I'll do to get better at it:",
        "Who could help me (a role, like \"my maths teacher\", not a name):"
      ]
    },
    {
      type: "read", title: "Key message",
      text: `**"I can't do it" becomes "I can't do it yet."** Effort, good strategies and asking for help are how everyone gets better.`
    }
  ]
});
