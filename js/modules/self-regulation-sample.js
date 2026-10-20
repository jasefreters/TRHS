/* Sample self-regulation elective. To be replaced by the school's own module documents. */
RP.registerModule({
  id: "self-regulation",
  title: "Self-regulation",
  icon: "🧘",
  sample: true,
  about: "Learn how to notice your warning signs and use strategies to stay in control when things get hard.",
  items: [
    {
      type: "read", title: "What is self-regulation?",
      text: `Self-regulation means managing your feelings, thoughts and actions, so you can **respond** to a situation instead of just **reacting** to it.

Everyone feels angry, frustrated or upset sometimes. Those feelings are normal. Self-regulation is about what you do next.`
    },
    { type: "scale", q: "Check in: how are you feeling right now?", labels: ["Calm", "Okay", "A bit wound up", "Upset", "Very upset"] },
    {
      type: "read", title: "Your warning signs",
      text: `Your body usually gives you clues before you lose control. These are your **warning signs**. They might be:
- a fast heartbeat
- feeling hot or red in the face
- clenched fists or a tight jaw
- talking louder or faster

Noticing your warning signs early gives you time to choose what to do.`
    },
    { type: "mc", q: "Which of these is a warning sign that you might be getting angry?", choices: ["Feeling sleepy", "Clenched fists and a fast heartbeat", "Laughing at a joke", "Feeling hungry"], answer: 1 },
    {
      type: "read", title: "Strategies that help",
      text: `When you notice your warning signs, try one of these:
- **Box breathing**: breathe in for 4, hold for 4, breathe out for 4, hold for 4. Repeat.
- **Ask for a break**: "Can I have a minute?"
- **Count down** slowly from 10.
- **Talk to someone** you trust.`
    },
    { type: "mc", q: "Box breathing: breathe in for 4, hold for 4, breathe out for 4, then…", choices: ["hold for 4", "breathe in for 10", "stand up", "start again straight away"], answer: 0 },
    { type: "mc", q: "Someone bumps you in the canteen line and your drink spills. What's a helpful first step?", choices: ["Push them back", "Yell at them", "Take a slow breath before you say anything", "Throw the drink"], answer: 2 },
    { type: "mc", q: "Your teacher asks you to move seats and you feel annoyed. Which response helps you stay in control?", choices: ["Refuse loudly", "Say \"Can I have a minute?\", then move", "Walk out of the room", "Ignore the teacher"], answer: 1 },
    { type: "scale", q: "How confident are you that you could use one of these strategies next time?", labels: ["Not yet", "A little", "Fairly", "Very"] }
  ]
});
