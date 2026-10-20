/* Code of Conduct Check: the NSW Department of Education Student Code of Conduct. Stands alone. */
RP.registerModule({
  id: "code-of-conduct-check",
  title: "Code of Conduct Check",
  icon: "🏫",
  score: false,
  deeper: ["Why do you think the Code covers what students do online, even outside school?"],
  about: `**Respect everyone, be responsible, be safe.** Get to know the NSW Student Code of Conduct and what it looks like in real situations.

About 25 minutes.`,
  items: [
    {
      type: "read", title: "The Student Code of Conduct",
      easy: { text: `The Code is the set of rules for all NSW public school students, at school and **online**.

It has three parts:
- **Respect everyone**
- **Be responsible**
- **Be safe**` },
      text: `**In NSW public schools everyone belongs and strives for the highest standards of learning.**

The Code is for all NSW public school students. It applies to all school activities, on and off the school site, **including online**.

I follow the Code by being **respectful, responsible and safe**, and by following teacher and staff directions:
- **Respect everyone:** being considerate and understanding so everyone feels welcome and included.
- **Be responsible:** being careful with our actions so everyone can learn and get along.
- **Be safe:** caring for yourself and others so everyone can be safe in our school.`
    },
    {
      type: "sort", q: "Sort these \"I will…\" statements from the Code into the right part.",
      buckets: ["Respect everyone", "Be responsible", "Be safe"],
      cards: [
        { text: "Listen and speak respectfully", bucket: 0 },
        { text: "Let others focus on their learning", bucket: 0 },
        { text: "Value and include everyone and treat them fairly", bucket: 0 },
        { text: "Arrive to school and class on time, ready to learn", bucket: 1 },
        { text: "Use technology safely and for learning", bucket: 1 },
        { text: "Learn from the mistakes I make and try to improve", bucket: 1 },
        { text: "Follow the instructions of teachers and school staff", bucket: 2 },
        { text: "Respect others' space, privacy and belongings", bucket: 2 },
        { text: "Resolve differences calmly and fairly", bucket: 2 }
      ]
    },
    {
      type: "read", title: "To keep everyone safe, I must not:",
      easy: { text: `You must not:
- treat people unfairly because of who they are
- hurt, threaten or bully anyone (online too)
- bring weapons, drugs, alcohol or vapes to school

If you do, it can lead to suspension.` },
      text: `- treat anyone unfairly because of who they are or what makes them different from me
- be violent, hurt, threaten, harass or bully anyone, including through phones, devices, computers, online or social media
- bring weapons, illegal drugs, alcohol, vapes, e-cigarettes or tobacco to school.

If I do these things, staff will take action to keep everyone safe and able to learn. This may include suspension.`
    },
    {
      type: "mc", q: "Someone in your group chat posts a mean photo of a classmate and everyone starts commenting. What does the Code say?",
      choices: [
        "It's fine. It's not at school.",
        "The Code applies online too. Don't join in, and tell a trusted adult.",
        "Only the person who posted it is responsible.",
        "Delete the chat and pretend you never saw it."
      ],
      answer: 1,
      explain: "Bullying and harassment through phones and social media are covered by the Code, even outside school hours."
    },
    {
      type: "mc", q: "A friend offers you a vape in the toilets at lunch. Which part of the Code is this about?",
      choices: ["Respect everyone", "Be responsible", "Be safe", "None of them"],
      answer: 2,
      explain: "Vapes and e-cigarettes are on the \"must not bring\" list under Be safe."
    },
    {
      type: "mc", q: "A teacher gives you an instruction that you think is unfair. What's the best choice under the Code?",
      choices: [
        "Argue loudly until they change their mind.",
        "Ignore it and do what you want.",
        "Follow the instruction, then calmly ask to talk about it after class.",
        "Walk out of the room."
      ],
      answer: 2,
      explain: "Following staff directions is part of being safe. You can still raise your concern respectfully afterwards."
    },
    {
      type: "select", q: "Which part of the Code do you find hardest to follow?",
      options: ["Respect everyone", "Be responsible", "Be safe"],
      other: true
    },
    {
      type: "write", title: "Me and the Code",
      prompts: [
        "When I go back to class, **respect** will look like…",
        "When I go back to class, **being responsible** will look like…",
        "When I go back to class, **being safe** will look like…"
      ]
    },
    {
      type: "read", title: "Key message",
      text: `Teachers and school staff help you learn, make good choices and stay safe. **Follow the rules, support others, respect their rights, and share your ideas** to make our school a great place to learn and belong.`
    }
  ]
});
