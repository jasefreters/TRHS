/*
  Understanding Truancy: a teacher-led module from the Learning Support Teacher. Keep the wording.
  The student works through it on their laptop while a staff member sits with them. "teacherLed"
  puts it with the teacher-led sessions on the daily schedule; "live" sends the student's answers
  to the teacher's page as they type, so the staff member can follow along and talk about each
  activity ("talk" on an item is a prompt for staff only). The teacher's page also has a Sentral
  checklist and a staff check-in to print; nothing typed there is saved.
*/
RP.registerModule({
  id: "understanding-truancy",
  title: "Understanding Truancy",
  icon: "🚪",
  teacherLed: true,
  live: true,
  score: false,
  about: `**Purpose:** To understand why students avoid class, recognise the impact of truancy, and develop practical strategies for making better choices.

You'll do this with a staff member. They can see your answers as you go and will talk through them with you.`,
  guide: `**About 30–45 minutes, one-on-one.** The student works on their laptop; this page shows each answer as they type it, so you can follow along and talk about it. A prompt for each activity is shown with it below.
- **Before you start, look up in Sentral:** this term's attendance (whole days and partial), unexplained absences and truancy entries, and positive and negative entries. Use them in the conversation, not as a gotcha. Notes and follow-up go in Sentral, not here.
- Remind the student they don't have to share personal information they're not comfortable with.
- At the end, complete the **staff check-in** and print the student's answers if you want a copy.`,
  items: [
    {
      type: "read", title: "Understanding Truancy",
      text: `**Purpose:** To understand why students avoid class, recognise the impact of truancy, and develop practical strategies for making better choices.

**Learning intentions.** By completing this module, I will:
- Identify learning and social reasons why students avoid class.
- Recognise how peer pressure, emotions and avoidance can influence my decisions.
- Understand the short-term and long-term consequences of truancy.
- Identify strategies that can help me attend class and engage in learning.

**Instructions:** Complete each activity independently. Tick the options that apply to you, read the scenarios carefully and answer honestly. You are not expected to share personal information you are uncomfortable disclosing.`,
      talk: "Go through the learning intentions together. Check how they're feeling about doing this, and remind them they don't have to share anything they're not comfortable with."
    },
    {
      type: "read", title: "Activity 1: What is truancy?",
      text: `Truancy occurs when a student misses class or school without permission or an approved reason. It can include deliberately staying away from lessons, wandering around the school, hiding in the toilets or avoiding a particular teacher or subject.

Sometimes students avoid class because learning feels difficult. Other times, they are worried about friendships, want to fit in with a group or simply do not feel like attending.

Understanding the reason is important, but it does not remove our responsibility to make safe choices and seek help when needed.`,
      talk: "Share what Sentral shows about their attendance, calmly and factually. Ask: does that match how you see it?"
    },
    {
      type: "sort", q: "**What can truancy look like?** Which behaviours could be examples of truancy?",
      buckets: ["Could be truancy", "Not truancy"],
      cards: [
        { text: "Staying in the playground instead of going to class.", bucket: 0 },
        { text: "Asking a teacher for help because I do not understand the work.", bucket: 1 },
        { text: "Wandering around school to avoid a particular lesson.", bucket: 0 },
        { text: "Staying with friends when the bell has gone.", bucket: 0 },
        { text: "Attending the Hub with permission and following an agreed support plan.", bucket: 1 },
        { text: "Hiding in the toilets to avoid class.", bucket: 0 },
        { text: "Telling a trusted staff member that I am worried about a lesson.", bucket: 1 }
      ]
    },
    { type: "write", title: "Activity 1: Reflection", prompts: ["Why might a student choose to avoid a lesson rather than attend it?"] },
    {
      type: "select", title: "Activity 2: Why do students truant?",
      q: "There is not always one reason why a student avoids class. Sometimes several things happen at once.\n\n**A. Learning-related reasons.** Students may avoid class because they:",
      options: ["Do not understand the work.", "Feel embarrassed about asking for help.", "Have missed previous lessons and feel too far behind.", "Find the work boring or do not see its purpose.", "Are worried about getting answers wrong.", "Have difficulty concentrating or getting started.", "Feel overwhelmed by the amount of work.", "Are worried about being judged by their teacher."],
      talk: "Which of the learning reasons did they tick? Are any of them true for particular subjects for them?"
    },
    { type: "write", title: "Activity 2: Think about it", prompts: ["Avoiding a difficult lesson might provide temporary relief, but what could happen if the student continues to avoid it?"] },
    {
      type: "select", title: "Activity 2: Why do students truant?",
      q: "**B. Social and emotional reasons.** Students may avoid class because they:",
      options: ["Want to stay with their friends.", "Feel pressured by peers to skip class.", "Worry that friends will make fun of them for attending class.", "Are experiencing friendship problems or conflict.", "Feel anxious, embarrassed or uncomfortable.", "Want to avoid a disagreement with another student.", "Want attention or acceptance from a group.", "Feel angry or frustrated and do not want to engage."],
      talk: "Which social reasons stood out? Listen for friendship problems, conflict or anxiety that might need wellbeing follow-up."
    },
    { type: "write", title: "Activity 2: Think about it", prompts: ["Why might a student find it difficult to attend class when their friends are encouraging them to stay away?"] },
    {
      type: "write", title: "Activity 2C: My understanding",
      q: "You do not need to disclose personal experiences. Consider which reasons might affect students at school.\n\n**Which three reasons do you think are most likely to contribute to truancy?**",
      prompts: ["Reason 1", "Reason 2", "Reason 3", "Can a student experience both learning difficulties and peer pressure at the same time? Explain your answer."]
    },
    {
      type: "read", title: "Activity 3: The truancy cycle",
      text: `Truancy can become a habit because avoiding class often makes a difficult feeling go away temporarily. However, the problem usually remains and can become harder to manage.

**How the cycle works**
- **1. Trigger:** The student feels overwhelmed by work, worries about peers or does not want to attend a lesson.
- **2. Avoidance:** The student skips class, wanders around school or stays with friends.
- **3. Short-term relief:** The student temporarily avoids the difficult work, uncomfortable feeling or social situation.
- **4. Consequences:** The student misses learning, falls further behind, receives follow-up consequences or develops a pattern of missed lessons.
- **5. Bigger problem:** Returning to class feels even harder, making further avoidance more tempting.

↻ The cycle can repeat.`,
      talk: "Draw the cycle together. Ask: where could someone step out of it?"
    },
    { type: "order", q: "Put the truancy cycle in order.", cards: ["Trigger", "Avoidance", "Short-term relief", "Consequences", "Bigger problem"] },
    {
      type: "write", title: "Activity 3: Identify the cycle",
      q: "Jordan finds Mathematics difficult. When the bell rings, Jordan's friends encourage them to stay outside. Jordan agrees and feels relieved about avoiding the lesson. Later, Jordan struggles to complete the work because important instructions were missed. The next Mathematics lesson feels even more difficult, so Jordan considers skipping again.\n\n**Key message:** Something can feel easier in the moment but make life harder later.",
      prompts: ["What was Jordan's trigger?", "What did Jordan do to avoid class?", "What was the short-term benefit?", "What was the longer-term consequence?", "What could Jordan do differently next lesson?"]
    },
    {
      type: "read", title: "Activity 4: Peer pressure — your choices matter",
      text: `Peer pressure happens when other people influence us to behave in a particular way. It can be direct, such as someone telling you to skip class, or indirect, such as worrying that your friends will judge you for attending.

Wanting to belong is normal. However, you are still responsible for your own decisions, even when friends are involved.

**Scenario 1: "Come on, skip with us!"** The bell rings. Your friends tell you that the next lesson is boring and encourage you to stay with them. They say, "Don't be a try-hard. Everyone is skipping."`,
      talk: "Practise the responses out loud. Role-play the friend so they can try saying it."
    },
    { type: "mc", q: "Scenario 1. **1. What type of pressure is happening?**", choices: ["Learning pressure", "Peer pressure", "Pressure from a teacher"], answer: 1 },
    { type: "write", title: "Scenario 1", prompts: ["2. What might make this situation difficult?"] },
    {
      type: "sort", q: "Scenario 1. **3. What could happen if you skip the lesson?**",
      buckets: ["Could happen", "Not true"],
      cards: [
        { text: "I might miss important learning.", bucket: 0 },
        { text: "I might feel accepted by my friends in the short term.", bucket: 0 },
        { text: "I could have difficulty completing future work.", bucket: 0 },
        { text: "There will definitely be no consequences.", bucket: 1 }
      ]
    },
    {
      type: "write", title: "Scenario 1",
      q: "**4. Write a response that allows you to make your own choice without starting an argument.**\n\nExample: \"I'm going to class. I'll see you at break.\"",
      prompts: ["My response:"]
    },
    {
      type: "write", title: "Scenario 2: \"If you're my friend, stay with me.\"",
      q: "A friend is upset and refuses to attend class. They ask you to stay with them. You are worried that going to class will upset your friend or make them angry with you.",
      prompts: ["1. Why might you feel torn between your friend and attending class?", "2. What is a helpful response that supports your friend without joining them in avoiding class?"]
    },
    {
      type: "sort", q: "Scenario 2. **3. Who could you contact if your friend genuinely needs support?**",
      buckets: ["I could contact", "Not a good option"],
      cards: [
        { text: "Year Adviser", bucket: 0 },
        { text: "Wellbeing Hub staff", bucket: 0 },
        { text: "Classroom teacher", bucket: 0 },
        { text: "Another trusted staff member", bucket: 0 },
        { text: "No one — I must solve the problem myself", bucket: 1 }
      ],
      explain: "**Remember:** You can care about a friend without making the same choices as them. If someone is genuinely distressed or unsafe, seek help from a trusted adult."
    },
    {
      type: "mc", q: "**Scenario 3: \"Everyone will think I'm stupid.\"** You find the work difficult. Your friends are outside, and you worry that going into class and asking for help will make you look incapable.\n\n**1. Is this mainly a learning concern, a social concern or both?**",
      choices: ["Learning concern", "Social concern", "Both"], answer: 2
    },
    { type: "write", title: "Scenario 3", prompts: ["2. What is one thing you could tell yourself to challenge this worry?", "3. What is one action you could take to get help with the work?"] },
    {
      type: "video", title: "Activity 5: Video reflection", youtube: "tYf9srotoX8",
      text: `**Truancy: It's not Too Late to Change: Student Voice** (Seattle Public Schools). Students talk about missing school and the choices that helped them get back on track.

While watching, think about the choices people make, the factors that influence their behaviour and the possible consequences of those choices.

If the video is unavailable, ask staff for an alternative rather than skipping this activity.`,
      talk: "Watch it together if you can. Ask which student's story felt most real to them."
    },
    {
      type: "write", title: "Activity 5: Video reflection",
      prompts: [
        "1. What is one important message you took from the video?",
        "2. What did the video make you think about in relation to choices and consequences?",
        "3. How might a person's friends influence their decisions?",
        "4. What is one strategy a student could use when they feel like avoiding class?",
        "5. What is one thing a student could do differently to improve their attendance or participation?"
      ]
    },
    {
      type: "write", title: "Activity 6: Choices and consequences",
      q: "Every choice can have immediate and longer-term consequences. Recognising these consequences can help us make more informed decisions. For each situation, write the immediate outcome and the possible longer-term outcome.",
      prompts: [
        "A student skips class because the work is difficult. **Immediate outcome:**",
        "A student skips class because the work is difficult. **Possible longer-term outcome:**",
        "A student stays with friends instead of attending class. **Immediate outcome:**",
        "A student stays with friends instead of attending class. **Possible longer-term outcome:**",
        "A student enters class but refuses to attempt any work. **Immediate outcome:**",
        "A student enters class but refuses to attempt any work. **Possible longer-term outcome:**",
        "A student tells the teacher they are struggling and asks for help. **Immediate outcome:**",
        "A student tells the teacher they are struggling and asks for help. **Possible longer-term outcome:**",
        "A student attends class even though their friends are skipping. **Immediate outcome:**",
        "A student attends class even though their friends are skipping. **Possible longer-term outcome:**"
      ],
      talk: "Link the long-term outcomes to what Sentral shows: what has the pattern of missed lessons meant for them so far?"
    },
    {
      type: "write", title: "Activity 6: Reflection",
      q: "**Remember:** Students may need different types of support, but support and accountability can work together. Understanding the reason for avoidance helps identify a better response.",
      prompts: ["Which choice is most likely to help a student improve their situation over time? Why?", "Does understanding why someone truants mean they should not be held accountable for their choices? Explain your answer."]
    },
    {
      type: "match", q: "**Activity 7: Build your response toolkit.** When you feel like avoiding class, having a plan can make it easier to choose a different response. Match the problem with a helpful strategy.",
      pairs: [
        { left: "Struggling with the work", right: "Ask the teacher to explain the first step." },
        { left: "Feeling overwhelmed", right: "Break the task into smaller sections." },
        { left: "Worried about what friends think", right: "Remind myself that I can make my own choices." },
        { left: "Angry or frustrated", right: "Use an agreed regulation strategy and seek support." },
        { left: "Worried about a conflict", right: "Speak to a trusted staff member rather than avoiding every lesson." },
        { left: "Behind in my learning", right: "Ask what work is most important to complete first." },
        { left: "Tempted to stay with friends", right: "Go to class and reconnect with friends at break." },
        { left: "Unsure where I am supposed to be", right: "Check my timetable or ask a staff member." }
      ]
    },
    {
      type: "select", title: "Activity 7: Build your response toolkit",
      q: "Tick the strategies you think would be useful.",
      options: ["Ask the teacher to explain the first step.", "Break the task into smaller sections.", "Remind myself that I can make my own choices.", "Use an agreed regulation strategy and seek support.", "Speak to a trusted staff member rather than avoiding every lesson.", "Ask what work is most important to complete first.", "Go to class and reconnect with friends at break.", "Check my timetable or ask a staff member."],
      talk: "Which strategies did they tick? Agree on one they'll try first, and who they'll go to."
    },
    {
      type: "write", title: "My personal response toolkit",
      q: "Choose three strategies that you could realistically use when you feel like avoiding class.",
      prompts: ["Strategy 1:", "Strategy 2:", "Strategy 3:"]
    },
    {
      type: "write", title: "Practise what you could say",
      q: "Complete the sentences.",
      prompts: ["If I do not understand the work, I could say:", "If my friends pressure me to skip class, I could say:", "If I feel upset or overwhelmed, I could tell:"]
    },
    {
      type: "sort", q: "**Activity 8: Myth or fact?** Read each statement and decide whether it is a myth or a fact.",
      buckets: ["Myth", "Fact"],
      cards: [
        { text: "If I find work difficult, avoiding class will help me catch up.", bucket: 0 },
        { text: "Peer pressure can influence whether someone attends class.", bucket: 1 },
        { text: "Asking for help is a strategy for dealing with difficult work.", bucket: 1 },
        { text: "If my friends skip class, I have to skip as well.", bucket: 0 },
        { text: "Missing lessons can make it harder to understand future learning.", bucket: 1 },
        { text: "I can be a good friend without copying every decision they make.", bucket: 1 }
      ]
    },
    { type: "write", title: "Activity 8: Myth or fact?", prompts: ["Choose one statement you would like to explain further. Why is it important for students to understand this?"] },
    {
      type: "write", title: "Activity 9: Moving forward",
      q: "You have explored learning difficulties, peer pressure, the truancy cycle, consequences and practical strategies. Complete the following reflection.",
      prompts: [
        "1. One thing I understand better about truancy is:",
        "2. One reason a student might avoid class is:",
        "3. One consequence of regularly missing lessons is:",
        "4. One strategy I could use instead of avoiding class is:",
        "5. One person at school I could approach for support is:",
        "6. What is one thing you want staff to understand about why students sometimes avoid class?"
      ],
      talk: "Read question 6 together and take it seriously: it's their chance to tell staff what's getting in the way."
    },
    {
      type: "write", title: "Final reflection: Accountability and support",
      q: "Read the following statement:\n\n**\"I cannot always control how difficult a lesson feels, what my friends say or how other people behave. However, I can work towards making choices that help me move forward. If I need help, I can seek support rather than continuing to avoid the problem.\"**",
      prompts: ["In your own words, explain what this statement means to you."]
    },
    {
      type: "select", title: "Completion check",
      q: "Tick the ones you can do.",
      options: ["I can identify learning-related reasons for truancy.", "I can identify social reasons, including peer pressure.", "I understand how avoidance can make problems harder over time.", "I can identify strategies to help me attend and engage in class.", "I know who I can approach for support."],
      talk: "Go through the completion check together, then fill in the staff check-in on this page."
    }
  ]
});
