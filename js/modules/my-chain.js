/* My Chain: independent chain analysis practice (DBT). Stands alone; the Chain Analysis group session isn't needed first. */
RP.registerModule({
  id: "my-chain",
  title: "My Chain",
  icon: "⛓️",
  score: false,
  deeper: ["Which link shows up most often in your chains? What could you do about it?"],
  about: `**Chain analysis.** Big reactions don't come out of nowhere. Work out the small steps that lead up to a behaviour, and where you could break the chain next time.

About 25–30 minutes.`,
  items: [
    {
      type: "read", title: "What is a chain analysis?",
      easy: { text: `A big reaction is the **last link in a chain**. Before it come lots of smaller links:
- things that made you tired or stressed
- what happened just before
- what you thought and felt
- what you did

**Change any link and the chain can break.**` },
      text: `A behaviour, like yelling, walking out or hitting something, is usually the **last link in a chain**. Lots of smaller things happen first:
- **Vulnerabilities:** things that made you more likely to react, like being tired, hungry, stressed or already upset.
- **Trigger:** what happened just before.
- **Thoughts:** what you told yourself.
- **Feelings and body:** what you felt and noticed in your body.
- **Urges and actions:** what you wanted to do, and the small things you did.
- **The behaviour:** the main thing that happened.
- **Consequences:** what happened next, straight away and later.

The good news: **if you change any link, the chain can break.**`
    },
    {
      type: "video", title: "Watch: the behaviour chain",
      youtube: "cOhcIi2w1gs",
      text: `A behaviour chain shows all the small steps that lead up to a big reaction: what made you vulnerable that day, what set it off, what you thought, what you felt in your body, what you wanted to do, and what happened in the end. Seeing the links helps you understand your feelings and spot the places where you could do something different next time.`
    },
    {
      type: "order", q: "Here is Jay's chain. Put the links in order, from the first to the last.",
      cards: [
        "Jay stays up until 2am gaming and skips breakfast.",
        "In class, the teacher asks Jay to move seats in front of his friends.",
        "Jay thinks: \"They're always picking on me.\"",
        "Jay feels embarrassed and angry. His face goes hot and his fists clench.",
        "Jay argues and refuses to move.",
        "Jay swears at the teacher.",
        "Jay is sent out of class and later suspended."
      ]
    },
    {
      type: "sort", q: "Which part of a chain is each of these?",
      buckets: ["Vulnerability", "Trigger", "Thoughts, feelings and body", "Behaviour", "Consequence"],
      cards: [
        { text: "Had an argument at home that morning", bucket: 0 },
        { text: "Didn't get much sleep", bucket: 0 },
        { text: "Someone laughs at my answer", bucket: 1 },
        { text: "\"Everyone thinks I'm dumb\"", bucket: 2 },
        { text: "Heart racing, jaw tight", bucket: 2 },
        { text: "Throwing a chair", bucket: 3 },
        { text: "Losing a friend's trust", bucket: 4 },
        { text: "A suspension", bucket: 4 }
      ]
    },
    {
      type: "mc", q: "Where could Jay have broken his chain?",
      choices: [
        "Only at the very start",
        "Only after he swore",
        "At any link along the way",
        "Nowhere. It was always going to happen."
      ],
      answer: 2,
      explain: "He could have eaten breakfast, taken a breath, asked to talk to the teacher after class, or moved and dealt with it later. Every link is a chance."
    },
    {
      type: "write", chain: true, title: "My chain",
      q: `Now map a chain of your own. It could be the situation that led to your suspension, or a different time you got really angry or upset. Only write what you're comfortable with. You can leave any link blank.`,
      prompts: [
        "**Vulnerabilities:** What made me more likely to react that day?",
        "**Trigger:** What happened just before?",
        "**Thoughts:** What did I tell myself?",
        "**Feelings and body:** What did I feel and notice in my body?",
        "**Urges and actions:** What did I want to do? What did I start doing?",
        "**The behaviour:** What was the main thing that happened?",
        "**Consequences:** What happened next, for me and for others?"
      ]
    },
    {
      type: "select", title: "Chain breakers",
      q: "Choose **three** chain breakers you could use next time.",
      options: [
        "Get enough sleep and eat before school",
        "Notice my body's warning signs early",
        "Take slow breaths",
        "Ask for a break or a minute outside",
        "Say \"Can we talk about this after class?\"",
        "Walk away from the conflict when it's safe",
        "Talk to a trusted staff member",
        "Use helpful self-talk: \"This isn't worth it\""
      ],
      other: true, pick: 3
    },
    { extra: true,
      type: "write", title: "Breaking my chain",
      prompts: [
        "Which link in my chain would be easiest to break next time?",
        "What would I do differently at that link?",
        "Is there anything I could do to repair what happened?"
      ]
    },
    {
      type: "read", title: "Key message",
      text: `**Behaviours are the end of a chain, not the start.** When you know your links, you can spot them early and break the chain before it gets to the big reaction.`
    }
  ]
});
