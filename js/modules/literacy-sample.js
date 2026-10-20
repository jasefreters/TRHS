/* Sample literacy elective: a short reading with comprehension questions. */
RP.registerModule({
  id: "literacy",
  title: "Literacy",
  icon: "📖",
  sample: true,
  hidden: true, // replaced by the four literacy modules; kept so older plans still work
  about: "Read a short text, then answer questions about it. You can look back at the text at any time with the **Back to the text** button.",
  items: [
    {
      type: "read", title: "Moving your body and your mood",
      text: `Regular exercise does more than make your muscles stronger. When you are active, your brain releases chemicals called endorphins, which can lift your mood and help you feel calmer.

Exercise can also help you sleep better. People who are active during the day often fall asleep faster and wake up feeling more rested. Good sleep makes it easier to concentrate and to manage your feelings.

You don't need to play a sport to get these benefits. A brisk 20-minute walk, kicking a ball with friends or dancing in your room all count. The most important thing is to find something you enjoy, so you keep doing it.

Small amounts of exercise, done often, can make a big difference to your overall health.`
    },
    { type: "mc", q: "According to the text, what are endorphins?", choices: ["Chemicals your brain releases that can lift your mood", "A type of muscle", "A sport you can play with friends", "A kind of deep sleep"], answer: 0 },
    { type: "mc", q: "How can exercise help with sleep?", choices: ["It means you never feel tired", "Active people often fall asleep faster and wake more rested", "It makes you sleep all afternoon", "The text doesn't say"], answer: 1 },
    { type: "mc", q: "Why does the writer say it's important to find exercise you enjoy?", choices: ["So you win more games", "So it doesn't take long", "So you keep doing it", "So your friends join in"], answer: 2 },
    { type: "input", q: "Which word in the text describes a walk that is fast and energetic?", answer: "brisk", text: true },
    { type: "mc", q: "True or false: you have to play a sport to get the benefits of exercise.", choices: ["True", "False"], answer: 1, explain: "The text says a walk, kicking a ball or dancing all count." },
    { type: "mc", q: "What is the main idea of the text?", choices: ["Sport is the only good kind of exercise", "Exercise helps your body and your mind, and any activity you enjoy counts", "You need to exercise for hours every day", "Sleep is more important than exercise"], answer: 1 }
  ]
});
