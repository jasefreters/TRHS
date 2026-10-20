/* Module 3: My Triggers and Anger Cycle. Focus: RAGE – Recognising Angry and Guilty Emotions. */
RP.registerModule({
  id: "module-3",
  title: "Module 3: Triggers and Anger",
  icon: "⚡",
  score: false,
  about: `**RAGE: Recognising Angry and Guilty Emotions.** Work out what triggers you, map your anger cycle and practise Stop, Think, Choose.

About 25–30 minutes.`,
  items: [
    {
      type: "read", title: "Feelings and actions",
      text: `Anger is a normal feeling. What matters is what we **do** with it.

In this module you'll look at what triggers you, how anger builds up, and how to put a pause between feeling an emotion and choosing an action.

**I can feel angry without acting aggressively. I can pause and choose my response.**`
    },
    {
      type: "select", title: "What triggers me?",
      q: "Choose **three** situations that can make you feel angry or frustrated.",
      options: [
        "Feeling disrespected or embarrassed",
        "Being corrected by a teacher",
        "Conflict with peers",
        "Feeling misunderstood or treated unfairly",
        "Being told no or having a limit set",
        "Feeling overwhelmed by schoolwork or things outside school"
      ],
      other: true, pick: 3
    },
    {
      type: "read", title: "The anger cycle",
      text: `Anger usually follows a pattern:

**Trigger → Thoughts → Feelings → Actions → Consequences**

Here's an example:
- **Trigger:** A peer makes a comment about me.
- **Thoughts:** "They are trying to embarrass me."
- **Feelings:** Angry, embarrassed and frustrated.
- **Actions:** I yell and threaten the peer.
- **Consequences:** The situation escalates, learning stops and there may be disciplinary consequences.

If you change your thoughts or your actions, you can change the consequences.`
    },
    {
      type: "order", q: "Put this anger cycle in the right order, from the trigger to the consequences.",
      cards: [
        "Someone pushes past me in the line.",
        "I think: \"They did that on purpose.\"",
        "I feel angry and disrespected.",
        "I shove them back.",
        "We both end up in trouble and I miss lunch."
      ]
    },
    {
      type: "mc", q: "In the example (a peer makes a comment about me), which is a better **alternative response**?",
      choices: [
        "Yell louder so they know I'm serious.",
        "Walk away, use a calm response or get support from a staff member.",
        "Wait and get them back later.",
        "Make a comment about them in front of everyone."
      ],
      answer: 1
    },
    {
      type: "write", title: "My anger cycle",
      q: "Think of a situation that made you angry and map it out.",
      prompts: [
        "**Trigger:** What happened?",
        "**Thoughts:** What did I tell myself?",
        "**Feelings:** What did I feel?",
        "**Actions:** What did I do?",
        "**Consequences:** What happened next?",
        "**Alternative response:** What could I do instead next time?"
      ]
    },
    {
      type: "read", title: "Stop, Think, Choose",
      text: `A simple way to put a pause between feeling and acting:

1. **STOP:** Notice the warning signs.
2. **THINK:** What could happen if I react immediately?
3. **CHOOSE:** What response is most likely to help me get a better outcome?`
    },
    {
      type: "write", title: "Scenario",
      q: "A peer makes a disrespectful comment during class.",
      prompts: [
        "My immediate reaction would be…",
        "What I might feel, physically and emotionally…",
        "What could happen if I react without thinking…",
        "A more helpful response would be…",
        "Who I could approach for support…"
      ]
    },
    {
      type: "write", title: "Stop, Think, Choose: my turn",
      q: "Use Stop, Think, Choose for a situation you might face at school.",
      prompts: [
        "The situation:",
        "**STOP:** My warning signs would be…",
        "**THINK:** If I reacted straight away, this could happen…",
        "**CHOOSE:** The response that would help me most is…"
      ]
    },
    {
      type: "read", title: "Key message",
      text: `**I cannot always control what other people do, but I can practise controlling how I respond.**`
    }
  ]
});
