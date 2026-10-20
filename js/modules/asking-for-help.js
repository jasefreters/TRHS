/* Asking for Help: who, when and how. Stands alone. */
RP.registerModule({
  id: "asking-for-help",
  title: "Asking for Help",
  icon: "🙋",
  score: false,
  about: `**Who, when and how.** Work out who you can go to at school, spot the right moment to ask, and practise what to say.

About 25 minutes.`,
  deeper: ["What makes asking for help hard sometimes? What could make it easier?"],
  items: [
    {
      type: "read", title: "Asking for help is a skill",
      text: `Lots of trouble at school starts with a problem nobody asked for help with: being stuck on work, being worried about something, or a conflict that's building.

Asking for help **early**, before things blow up, is a strength, not a weakness. It's also a skill: knowing **who** to ask, **when** to ask and **how** to say it.`,
      easy: {
        text: `Lots of trouble starts when nobody asks for help.

Asking for help **early** is a strength. You need to know **who** to ask, **when**, and **what to say**.`
      }
    },
    {
      type: "match", q: "Match each problem to someone who could help.",
      pairs: [
        { left: "I don't understand my maths work", right: "My maths teacher" },
        { left: "Someone is bullying me online", right: "My year adviser or a staff member I trust" },
        { left: "I've been feeling really down for a while", right: "The school counsellor or wellbeing team" },
        { left: "I'm feeling sick", right: "The front office or sick bay" },
        { left: "I'm behind on my assessments", right: "My class teacher or head teacher" }
      ]
    },
    {
      type: "story", title: "Stuck in class",
      start: "start",
      nodes: {
        start: { text: "You're in science and you don't understand the task. Everyone else seems to be working. You start to feel frustrated.", choices: [
          { label: "Put your hand up and say \"I'm stuck on question 2\"", to: "asked" },
          { label: "Start chatting to a friend instead", to: "chat" },
          { label: "Push the book away and say \"This is dumb\"", to: "angry" }
        ] },
        chat: { text: "Your teacher asks you to get back to work. You still don't know what to do.", choices: [
          { label: "Ask: \"Can you explain question 2 again?\"", to: "late" },
          { label: "Keep chatting", to: "trouble" }
        ] },
        angry: { text: "Your teacher comes over. You can feel your frustration rising.", choices: [
          { label: "Take a breath and say: \"Sorry. I'm stuck and frustrated.\"", to: "late" },
          { label: "Say: \"Leave me alone!\"", to: "trouble" }
        ] },
        asked: { text: "Your teacher explains it and you get going. Asking early saved a lot of stress.", end: "good" },
        late: { text: "It took a moment, but asking for help got you back on track.", end: "good" },
        trouble: { text: "You end up in trouble, and you still don't understand the work.", end: "bad" }
      }
    },
    {
      type: "tiles", title: "What to say",
      q: "Build a way to ask for help. Tap each gap, then tap a tile.",
      parts: [
        "Excuse me. I'm ",
        { options: ["stuck on", "confused about", "worried about"] },
        " ",
        { options: ["this question", "the assessment", "something that happened", "how I'm feeling"] },
        ". Could you ",
        { options: ["explain it again", "help me get started", "talk with me after class", "tell me who I should talk to"] },
        "?"
      ]
    },
    {
      type: "select", title: "My people",
      q: "Choose up to **three** staff you could go to at school (roles, not names).",
      options: ["A class teacher", "My year adviser", "Head Teacher Wellbeing", "The school counsellor", "A learning support teacher", "Hub staff", "Front office staff"],
      other: true, pick: 3
    },
    {
      type: "write", title: "My plan",
      prompts: ["A time when asking for help could make things better:", "What I'll say:"]
    },
    {
      type: "read", title: "Key message",
      text: `**Ask early, ask calmly, ask the right person.** Nobody can help with a problem they don't know about.`
    }
  ]
});
