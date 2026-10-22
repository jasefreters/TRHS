/* Attendance and Truancy: why students miss class, what it costs, and a plan to be there. Stands alone. */
RP.registerModule({
  id: "attendance",
  title: "Attendance and Truancy",
  icon: "🏫",
  about: `**Why every day counts.** Why students sometimes skip class or school, what it really costs, and a plan to help you be there.

About 25 minutes.`,
  items: [
    {
      type: "read", title: "What is truancy?",
      text: `**Truancy** (or wagging) means missing school or class without a good reason and without permission. It includes:
- staying home when you're not sick
- leaving school during the day
- being at school but skipping a lesson, or turning up very late on purpose

Everyone has reasons. This module helps you think about yours and what could help.`
    },
    {
      type: "select", title: "Reasons",
      q: "These are some reasons students miss class. Choose any that sometimes fit you, or none. Your teacher will read your answers.",
      options: ["Being with friends", "Avoiding a subject I find hard", "Behind in my work", "Problems with another student", "Problems with a teacher", "Feeling worried or anxious", "Tired from staying up late", "Things going on at home", "Feeling bored", "Feeling unsafe or picked on"],
      other: true
    },
    {
      type: "read", title: "It adds up",
      text: `Missing **one day a fortnight** doesn't sound like much. But a school year has about **40 weeks**.

Skipping one lesson a day adds up too: that's a whole subject you barely go to.`
    },
    {
      type: "mc", q: "If you miss **1 day every fortnight**, how many days is that in a school year of about 40 weeks?",
      choices: ["5 days", "10 days", "20 days", "40 days"], answer: 2,
      explain: "40 weeks is 20 fortnights, so 20 days. That's 4 whole school weeks."
    },
    {
      type: "input", q: "That's 20 days a year. How many days would that be from Year 7 to the end of Year 10 (4 years)?",
      answer: "80", suffix: "days",
      explain: "80 days is 16 school weeks: almost half a year of school."
    },
    {
      type: "sort", q: "What can happen when you miss class? Sort each one.",
      buckets: ["Straight away", "Later on"],
      cards: [
        { text: "Missing the teacher's instructions", bucket: 0 },
        { text: "Not knowing what to do in the next lesson", bucket: 0 },
        { text: "Your parent or carer gets a call or message", bucket: 0 },
        { text: "Gaps in learning that build up", bucket: 1 },
        { text: "Failing or missing assessment tasks", bucket: 1 },
        { text: "Fewer choices for courses and jobs", bucket: 1 }
      ]
    },
    {
      type: "read", title: "What the school has to do",
      text: `Schools have to check every absence. If a student misses class or school without a good reason:
- the school contacts their parent or carer
- they may meet with the Year Adviser, Head Teacher or Deputy Principal to make a plan
- if it keeps happening, the school can involve the **Home School Liaison Officer**, who works with families to improve attendance

In NSW, parents and carers have a legal responsibility to make sure their child goes to school. If attendance doesn't improve, families can face legal action.`
    },
    {
      type: "story", title: "Period 5",
      start: "start",
      nodes: {
        start: { text: "It's B2. Your friends say they're skipping period 5 maths and going to the shops. You're behind in maths and you don't want to go.", choices: [
          { label: "Go with them", to: "go" },
          { label: "Say \"Nah, I'll see you after school\" and go to maths", to: "class" },
          { label: "Go to maths, but tell the teacher you're lost", to: "help" }
        ] },
        go: { text: "The school notices you're missing and calls home. Next lesson you're even further behind.", choices: [
          { label: "Talk to your teacher about catching up", to: "help" },
          { label: "Skip the next lesson too", to: "worse" }
        ] },
        worse: { end: "bad", text: "Each lesson you miss makes the next one harder, and it becomes a pattern. Try a different path." },
        class: { end: "good", text: "It's a tough lesson, but you're there. Your friends don't mind, and you don't have a phone call home to deal with tonight." },
        help: { end: "good", text: "Your teacher shows you where to start and gives you a catch-up sheet. Next lesson is a bit easier." }
      }
    },
    {
      type: "match", q: "Match each reason to something that could help instead.",
      pairs: [
        { left: "Behind in my work", right: "Ask the teacher for a catch-up plan" },
        { left: "Problems with another student", right: "Talk to the Year Adviser or Head Teacher Wellbeing" },
        { left: "Feeling worried about a class", right: "See the school counsellor or a teacher I trust" },
        { left: "Friends want me to skip", right: "Say no, and see them at the break" },
        { left: "Too tired to get up", right: "Phone out of the bedroom at night" }
      ]
    },
    {
      type: "write", title: "My attendance plan",
      prompts: [
        "One thing that makes it hard to get to class is…",
        "One thing that would help me get there is…",
        "If I feel like skipping, I can talk to…",
        "My attendance goal for the next two weeks is…"
      ]
    },
    {
      type: "read", title: "Key message",
      text: `**Every day counts.** Being there, even when it's hard, keeps you on track and keeps your options open. If something is stopping you from getting to class, tell someone: there is help.`
    }
  ]
});
