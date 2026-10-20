/* T-RED Values in Action: Thrive, Represent, Excel, Deliver. Built from the school's T-RED presentations. Stands alone. */
RP.registerModule({
  id: "tred-values",
  title: "T-RED Values in Action",
  icon: "⭐",
  score: false,
  about: `**Thrive, Represent, Excel, Deliver.** Explore our school values, what they look like in real life, and set a goal you can deliver on.

About 25–30 minutes.`,
  items: [
    {
      type: "read", title: "What are values?",
      text: `Our values are what we think of as important. Everybody has their own idea of what is valuable to them: friendship, education, family, sport, music, and lots more.

At school, our values guide us on our learning journey. Thomas Reddall's values are **T-RED**:
- **Thrive:** to grow, develop and be successful in learning and in life. Building resilience and wellbeing.
- **Represent:** to show the values of our school and community in everything we do. Taking pride in being part of the school.
- **Excel:** to perform at your highest potential. It takes planning, effort and practice, not just talent.
- **Deliver:** to meet goals, keep commitments and make an impact. Actually doing what you said you'd do.`
    },
    {
      type: "sort", q: "Each value has three key words. Sort them under the right value.",
      buckets: ["Thrive", "Represent", "Excel", "Deliver"],
      cards: [
        { text: "Resilience", bucket: 0 },
        { text: "Aspiration", bucket: 0 },
        { text: "Belonging", bucket: 0 },
        { text: "Collaborate", bucket: 1 },
        { text: "Compliance", bucket: 1 },
        { text: "Respect", bucket: 1 },
        { text: "High expectations", bucket: 2 },
        { text: "Determination", bucket: 2 },
        { text: "Preparation", bucket: 2 },
        { text: "Commitment", bucket: 3 },
        { text: "Punctuality", bucket: 3 },
        { text: "Participation", bucket: 3 }
      ]
    },
    {
      type: "sort", q: "Which value does each action show best?",
      buckets: ["Thrive", "Represent", "Excel", "Deliver"],
      cards: [
        { text: "Keeping going after a bad lesson", bucket: 0 },
        { text: "Wearing my uniform with pride", bucket: 1 },
        { text: "Behaving well on an excursion", bucket: 1 },
        { text: "Practising a skill until I get better", bucket: 2 },
        { text: "Handing my assessment in on time", bucket: 3 },
        { text: "Doing what I promised I'd do", bucket: 3 }
      ]
    },
    {
      type: "read", title: "Represent: Martin at the aquarium",
      text: `Martin is a student on a school excursion at an aquarium when he begins swearing loudly. His teachers have asked him to stop, but he continues. He is also rude to the staff at the aquarium.`
    },
    {
      type: "write", title: "Martin at the aquarium",
      prompts: [
        "What thoughts might the aquarium staff now have about Martin's school?",
        "What could Martin have done to leave a positive impression on the aquarium staff?"
      ]
    },
    {
      type: "mc", q: "To **excel** at something, what does it take?",
      choices: [
        "Natural talent. You either have it or you don't.",
        "Planning, effort and lots of practice over time.",
        "Luck.",
        "Being better than everyone else straight away."
      ],
      answer: 1,
      explain: "We often only see sports stars, artists and musicians after they've got good. We don't see the hours of practice behind it."
    },
    {
      type: "write", title: "Thrive: my goals",
      prompts: [
        "Three goals I could set, inside or outside of school:",
        "Pick one. How could I achieve it? (For example: practising for 30 minutes a day)"
      ]
    },
    {
      type: "write", title: "Deliver: my promise",
      prompts: [
        "One goal I know I can deliver on when I go back to class:",
        "My plan to achieve it, and the promise I'm making to myself:"
      ]
    },
    {
      type: "read", title: "Key message",
      text: `**Thrive, Represent, Excel, Deliver.** The values aren't just words on a wall. They're choices you make every day, and every day is a new chance to show them.`
    }
  ]
});
