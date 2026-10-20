/* Healthy Habits Check: sleep, food, movement, screens and water. Stands alone. */
RP.registerModule({
  id: "healthy-habits",
  title: "Healthy Habits Check",
  icon: "🍎",
  score: false,
  about: `**Sleep, food, movement and screens.** Check in on your habits, see how they affect your mood and behaviour, and pick one small change.

About 25 minutes.`,
  deeper: ["How do your habits affect the way you behave at school?"],
  items: [
    {
      type: "read", title: "Habits and how you feel",
      text: `How you sleep, eat, move and use screens has a big effect on your mood, your focus and how easily you get angry.

When you're tired or hungry, your thinking brain has less energy, so it's harder to stay calm and make good choices. Small changes can make a real difference.`,
      easy: {
        text: `Sleep, food, moving and screens all change how you feel.

When you're tired or hungry, it's harder to stay calm. Small changes help.`
      },
      more: `Teenagers' body clocks shift later, so it feels natural to stay up late. But school still starts early, so late nights add up to a "sleep debt" that makes the whole week harder.`
    },
    {
      type: "slider", title: "My habits right now",
      q: "Be honest. There are no wrong answers.",
      sliders: [
        { label: "Hours of sleep on a school night", min: 4, max: 11, unit: "hours", left: "4", right: "11" },
        { label: "Days a week I eat breakfast", min: 0, max: 7, unit: "days", left: "0", right: "7" },
        { label: "Minutes I'm active each day", min: 0, max: 120, step: 15, unit: "min", left: "0", right: "120" },
        { label: "Hours on screens after 9pm", min: 0, max: 4, step: 0.5, unit: "hours", left: "0", right: "4+" },
        { label: "Glasses of water a day", min: 0, max: 10, unit: "glasses", left: "0", right: "10" }
      ]
    },
    {
      type: "match", q: "Match each habit to how it affects you.",
      pairs: [
        { left: "Not enough sleep", right: "Harder to concentrate and easier to get angry" },
        { left: "Skipping breakfast", right: "Low energy and grumpy by mid-morning" },
        { left: "Being active", right: "Less stress and a better mood" },
        { left: "Screens late at night", right: "Harder to fall asleep" },
        { left: "Drinking water", right: "Better focus and fewer headaches" }
      ]
    },
    {
      type: "mc", q: "About how much sleep do teenagers need each night?",
      choices: ["4 to 5 hours", "6 hours is plenty", "About 8 to 10 hours", "It doesn't matter"],
      answer: 2,
      explain: "Most teenagers need about 8 to 10 hours, and younger teens a bit more."
    },
    {
      type: "bodymap", q: "When I'm tired or hungry, where do I notice it in my body?"
    },
    {
      type: "select", q: "Choose **one** habit to work on.",
      options: ["Getting more sleep", "Eating breakfast", "Moving more", "Less screen time at night", "Drinking more water"],
      other: true, pick: 1
    },
    {
      type: "write", title: "My small change",
      prompts: ["What I'll do:", "When I'll start:", "What might get in the way, and what I'll do about it:"]
    },
    {
      type: "read", title: "Key message",
      text: `**Look after your body and it helps you look after your behaviour.** One small change, done every day, adds up.`
    }
  ]
});
