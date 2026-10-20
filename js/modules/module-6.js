/* Module 6: My Return-to-School Success Plan. Focus: wellbeing, resilience and future goals. */
RP.registerModule({
  id: "module-6",
  title: "Module 6: My Return Plan",
  icon: "🎯",
  score: false,
  about: `**My Return-to-School Success Plan.** Name your strengths, set your goals and make a support plan for going back to class. You'll print your plan to take to your 1:1 with your teacher.

About 25–30 minutes.`,
  items: [
    {
      type: "read", title: "Resilience",
      text: `**Resilience** is the ability to adapt, keep trying, ask for help and recover when things get difficult.

In this module you'll turn what you've learned in the Reset Program into a plan you can use back in class.`
    },
    {
      type: "select", title: "My strengths",
      q: "Choose **three** of your personal strengths.",
      options: ["Kind", "Funny", "Hard-working", "Loyal", "Creative", "Sporty", "Good with my hands", "Honest", "Brave", "A good listener", "Determined", "Helpful"],
      other: true, pick: 3
    },
    {
      type: "write", title: "My strengths",
      prompts: [
        "One challenge I have overcome is…",
        "One thing I am proud of is…",
        "One person who believes in my ability to succeed is…"
      ]
    },
    {
      type: "read", title: "Good goals",
      text: `Good goals are **specific** and **realistic**. "Be good" is hard to measure. These are better:
- "When I'm corrected, I'll use a calm response."
- "I'll attempt the set classwork in every lesson."
- "I'll ask for a break before my emotions escalate."`
    },
    {
      type: "mc", q: "Which goal is the most specific and realistic?",
      choices: [
        "Be good.",
        "Never get in trouble again.",
        "When I'm corrected in class, I'll take a breath and answer calmly.",
        "Get perfect marks in everything."
      ],
      answer: 2
    },
    {
      type: "write", title: "My school goals",
      prompts: [
        "**Behaviour:** One behaviour I want to improve is…",
        "**Learning:** One learning goal I will work towards is…",
        "**Wellbeing:** One strategy I will use when I feel overwhelmed is…"
      ]
    },
    {
      type: "write", title: "My support plan",
      prompts: [
        "My early warning signs are…",
        "When I notice these signs, I will…",
        "If I need help, I can approach…",
        "If conflict occurs, I can…",
        "One thing staff can do to support me is…",
        "One thing I will take responsibility for is…",
        "My first goal for the next two weeks is…"
      ]
    },
    {
      type: "write", title: "Final reflection",
      prompts: [
        "The most useful thing I learned was…",
        "Next time I feel angry or overwhelmed, I will…",
        "One thing I want my teachers to know is…",
        "One thing I want to achieve from here is…"
      ]
    },
    {
      type: "read", title: "Key message",
      text: `**Returning to school is an opportunity to reset, reconnect and put new strategies into practice.**

Next, print your certificate and your plan. Take your plan to your 1:1 with your teacher.`
    }
  ]
});
