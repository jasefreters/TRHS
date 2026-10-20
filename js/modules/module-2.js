/* Module 2: Understanding My Brain and Emotions. Focus: RIOT – Amazing Brain and Managing Feelings. */
RP.registerModule({
  id: "module-2",
  title: "Module 2: My Brain and Emotions",
  icon: "🧠",
  score: false,
  about: `**RIOT: Amazing Brain and Managing Feelings.** Learn what happens in your brain and body when emotions get intense, spot your warning signs and build your regulation toolkit.

About 25–30 minutes.`,
  items: [
    {
      type: "read", title: "Your amazing brain",
      text: `When you feel threatened, frustrated or overwhelmed, your brain and body can move into a **heightened state of alert**. This makes it harder to pause, think through consequences and choose a response.

The **hand model of the brain** shows this. Make a fist with your thumb tucked inside:
- Your **wrist and palm** are the brain stem, which keeps you alive and reacts to danger.
- Your **thumb** is the emotional part of your brain.
- Your **fingers**, folded over the top, are the thinking part, which helps you stop, think and make good choices.

When emotions get really strong, it's like your fingers lift up: you **"flip your lid"**. The thinking part loses touch with the rest, so it's much harder to stay in control.

[Watch: Hand Model of the Brain (YouTube)](https://www.youtube.com/watch?v=Kx7PCzg0CGE). Check with your teacher before you watch it.`
    },
    {
      type: "mc", q: "In the hand model of the brain, what does **\"flipping your lid\"** mean?",
      choices: [
        "You feel tired and want to sleep.",
        "Strong emotions take over and the thinking part of your brain can't help you stop and think.",
        "You are thinking very clearly.",
        "You are about to fall asleep in class."
      ],
      answer: 1
    },
    {
      type: "read", title: "Fight, flight and freeze",
      text: `When your brain senses a threat, your body gets ready to protect you in one of three ways:
- **Fight**: arguing, yelling, pushing or hitting.
- **Flight**: getting away, like walking out, running off or avoiding.
- **Freeze**: shutting down, going blank, not being able to move or speak.

These reactions are automatic. Learning to notice them early gives you the chance to choose what to do.`
    },
    {
      type: "sort", q: "Sort these reactions into **fight**, **flight** or **freeze**.",
      buckets: ["Fight", "Flight", "Freeze"],
      cards: [
        { text: "Yelling at someone", bucket: 0 },
        { text: "Pushing someone away", bucket: 0 },
        { text: "Walking out of class", bucket: 1 },
        { text: "Hiding in the toilets", bucket: 1 },
        { text: "Going blank and not answering", bucket: 2 },
        { text: "Feeling stuck and unable to move", bucket: 2 }
      ]
    },
    {
      type: "select", q: "What happens to **your** body when you get angry? Choose all that are true for you.",
      options: ["Heart racing", "Muscles tightening", "Voice getting louder", "Feeling hot or red in the face", "Clenched fists or jaw", "Breathing faster", "Shaking", "Feeling sick in the stomach"],
      other: true
    },
    {
      type: "write", title: "When I feel overwhelmed",
      prompts: [
        "What happens to my thinking when I feel overwhelmed?",
        "How can I recognise that I am starting to lose control?"
      ]
    },
    {
      type: "write", title: "My emotional warning signs",
      prompts: [
        "**Thoughts:** What do I tell myself when I get angry or frustrated?",
        "**Body:** What physical changes do I notice?",
        "**Feelings:** What emotions am I experiencing?",
        "**Behaviour:** What do I start doing when I am escalating?"
      ]
    },
    {
      type: "breathe", title: "Try it: box breathing",
      text: `Slow breathing tells your body it's safe, so your thinking brain can switch back on. Follow the dot around the square: **breathe in** for 4, **hold** for 4, **breathe out** for 4, **hold** for 4.`,
      rounds: 3
    },
    {
      type: "select", title: "My regulation toolkit",
      q: "Choose **three** strategies to practise when emotions become intense.",
      options: [
        "Slow breathing",
        "Grounding using the five senses",
        "Taking a brief, agreed-upon break",
        "Getting a drink of water",
        "Speaking to a trusted staff member",
        "Using positive self-talk",
        "Moving away from a conflict when safe to do so"
      ],
      pick: 3
    },
    {
      type: "write", title: "Reflection",
      prompts: ["Which strategy could help me before I reach my breaking point?"]
    },
    {
      type: "read", title: "Key message",
      text: `**Emotions are normal.** Learning to recognise them early gives us more opportunities to choose how we respond.`
    }
  ]
});
