/*
  My Return Plan (independent): the Student Return to Class Plan from the Head Teacher Wellbeing/
  Learning Support. Keep the wording. Every item has a "section" so the teacher-led My Return Plan
  page can print the plan in the same sections, filled in from the student's answers.
  Write prompts and select questions are matched by their text, so change them carefully.
*/
(function () {
  const S1 = "Section 1: What Have I Learnt?";
  const S2 = "Section 2: My Return to Class – Student Code of Conduct";
  const S3 = "Section 3: My Personal Return to Class Goal";
  const S4 = "Section 4: What Support Can Help Me?";
  const S5 = "Section 5: My First Week Back";
  const S6 = "Section 6: My Commitment";
  RP.RETURN_PLAN_COMMITMENT = [
    "Be respectful towards others.",
    "Take responsibility for my learning and choices.",
    "Make safe decisions.",
    "Follow staff instructions.",
    "Use appropriate strategies and ask for help when needed."
  ];
  RP.registerModule({
    id: "module-6",
    title: "My Return Plan",
    icon: "🎯",
    score: false,
    about: `**Student Return to Class Plan.** Reflect on what you have learnt during the Reset Program and make a plan for returning to class successfully. Your teacher will go through it with you in your teacher-led Return Plan session.

About 30 minutes.`,
    items: [
      {
        type: "read", section: S1, title: "Student Return to Class Plan",
        text: `**Purpose:** This survey helps you reflect on what you have learnt during Reset & Reconnect and make a plan for returning to class successfully.

**${S1}**

Think about the modules, discussions and strategies you have worked through during The Reset Program in the Hub.`
      },
      {
        type: "write", section: S1, title: "What Have I Learnt?",
        q: "**1. What are three things you have learnt during this program?**",
        prompts: ["Something I have learnt", "Something else I have learnt", "A third thing I have learnt"]
      },
      {
        type: "write", section: S1, title: "What Have I Learnt?",
        prompts: ["2. What have you learnt about managing your behaviours, emotions or frustration?"]
      },
      {
        type: "select", section: S1, title: "What Have I Learnt?",
        q: "3. What strategies could help you make better choices when you are feeling angry, frustrated or overwhelmed?",
        options: ["Taking a moment to calm down", "Walking away from a disagreement appropriately", "Talking to a trusted staff member", "Asking for help", "Thinking about the consequences of my choices", "Using a regulation strategy", "Self regulation in the Hub"],
        other: true
      },
      {
        type: "write", section: S1, title: "What Have I Learnt?",
        prompts: [
          "4. Which strategy do you think will be most useful when you return to class, and why?",
          "5. What is one thing you want to do differently when you return to class?"
        ]
      },
      {
        type: "read", section: S2, title: "My Return to Class – Student Code of Conduct",
        text: `The NSW Department of Education Student Code of Conduct outlines three key expectations:

**RESPECT EVERYONE | BE RESPONSIBLE | BE SAFE**

These expectations help everyone learn and feel safe at school.`
      },
      {
        type: "select", section: S2, title: "A. Respect everyone",
        q: "A. RESPECT EVERYONE. When I return to class, I will:",
        options: ["Speak respectfully to teachers and other students.", "Allow others to learn without disruption.", "Listen when others are speaking.", "Treat others fairly and respect their personal space.", "Resolve disagreements calmly."]
      },
      { type: "write", section: S2, title: "A. Respect everyone", prompts: ["One way I will show respect in class is:"] },
      {
        type: "select", section: S2, title: "B. Be responsible",
        q: "B. BE RESPONSIBLE. When I return to class, I will:",
        options: ["Arrive at class on time and be ready to learn.", "Follow classroom routines and school expectations.", "Attempt the work set by my teacher.", "Ask for help when I need it.", "Take responsibility for my choices and learn from mistakes."]
      },
      { type: "write", section: S2, title: "B. Be responsible", prompts: ["One way I will take responsibility for my learning is:"] },
      {
        type: "select", section: S2, title: "C. Be safe",
        q: "C. BE SAFE. When I return to class, I will:",
        options: ["Follow the instructions of teachers and school staff.", "Keep my hands, feet and belongings to myself.", "Use respectful language, even when frustrated.", "Use agreed strategies to manage difficult situations.", "Ask for help if a situation is becoming difficult or unsafe."]
      },
      {
        type: "write", section: S2, title: "C. Be safe",
        q: "**Remember:** You can disagree with someone without being disrespectful. If you are having difficulty, you are expected to follow staff directions and seek support appropriately.",
        prompts: ["If I become frustrated or disagree with a teacher, I will:", "If I need support during a lesson, I can:"]
      },
      {
        type: "write", section: S3, title: "My Personal Return to Class Goal",
        q: "Choose one goal to focus on during your first week back.",
        prompts: ["My Goal", "How will I know I am making progress towards this goal?"]
      },
      {
        type: "read", section: S4, title: "What Support Can Help Me?",
        text: `There are different types of support available at school to help you manage challenges, engage in learning and make positive choices.

Tick the supports you think could help you when you return to class tomorrow. A staff member will discuss these options with you and help determine which supports are appropriate.`
      },
      {
        type: "select", section: S4, title: "A. Classroom and Learning Support",
        q: "A. Classroom and Learning Support",
        options: [
          "SLSO in-class support – Help to stay focused, understand instructions and engage with classwork.",
          "Breaking work into smaller steps – Help to get started and manage challenging tasks.",
          "Visual prompts or seating adjustments – Support to help me focus and stay on track.",
          "Adjusted classwork or assessment support – Appropriate adjustments to help me access learning.",
          "Help with literacy or numeracy – Access to additional learning programs where appropriate."
        ]
      },
      {
        type: "select", section: S4, title: "B. Self-Regulation and Behaviour Support",
        q: "B. Self-Regulation and Behaviour Support",
        options: [
          "Self-regulation card – Using my card in line with the agreed process when I need help managing my emotions.",
          "Sensory tools – Using appropriate tools to help me regulate and focus.",
          "Journalling or reflection activities – Helping me understand my emotions and make positive choices.",
          "Behaviour Specialist sessions with Nicole."
        ]
      },
      {
        type: "select", section: S4, title: "C. Wellbeing Support",
        q: "C. Wellbeing Support",
        options: [
          "Year Adviser check-ins – Regularly checking how I am going at school.",
          "Head Teacher check-ins – Support with school expectations, engagement and progress.",
          "Chloe – Accessing wellbeing support when needed.",
          "School Counsellor – Accessing support to work through difficulties, where appropriate.",
          "Check In Program – Participating in regular check-ins with an identified staff member.",
          "Breakfast Club / Toasties – Accessing food support at school if needed."
        ]
      },
      {
        type: "select", section: S4, title: "D. Targeted Programs",
        q: "D. Targeted Programs",
        options: [
          "RAGE Program – Participating in a program focused on managing anger and emotions.",
          "NASCA – Accessing the program where appropriate.",
          "Brenton – The Real Talk Program – Accessing targeted support where appropriate.",
          "Art Therapy – Exploring emotions and experiences through art, where available and appropriate.",
          "External support or referral – Connecting with an appropriate external service if needed."
        ]
      },
      {
        type: "select", section: S4, title: "E. Attendance and Engagement Support",
        q: "E. Attendance and Engagement Support",
        options: [
          "Year Adviser attendance check-ins – Support to improve my attendance and participation.",
          "Attendance meeting – Working with staff and my family to address attendance difficulties.",
          "Individual timetable adjustments – Considering changes to my timetable where appropriate.",
          "Careers or work pathway support – Exploring options that may help me engage with school and future goals."
        ]
      },
      {
        type: "write", section: S4, title: "F. My Personal Support Plan",
        q: "**1. Which three supports do you think would help you the most?**",
        prompts: ["First support", "Second support", "Third support"]
      },
      {
        type: "write", section: S4, title: "F. My Personal Support Plan",
        prompts: [
          "2. What situations might make it difficult for you to return to class successfully?",
          "3. What could you do if you begin to feel frustrated or disengaged in class?",
          "4. Which staff member could you approach for support?",
          "5. What is one thing staff could do to help you get back on track?"
        ]
      },
      {
        type: "write", section: S5, title: "My First Week Back",
        prompts: ["1. What is one thing you want to achieve during your first day back in class?"]
      },
      {
        type: "select", section: S5, title: "My First Week Back",
        q: "2. What will success look like for you?",
        options: ["Attending all my classes", "Arriving at class on time", "Following staff instructions", "Completing or attempting my classwork", "Managing frustration appropriately", "Avoiding conflict with other students", "Asking for help when needed"],
        other: true
      },
      {
        type: "write", section: S5, title: "My First Week Back",
        prompts: [
          "3. What will you do if you make a mistake or have a difficult lesson?",
          "4. What would you like to feel proud of at the end of your first week back?"
        ]
      },
      {
        type: "read", section: S6, title: "My Commitment",
        text: `I understand that returning to class is an opportunity to put the skills I have learnt into practice.

I will aim to:
${RP.RETURN_PLAN_COMMITMENT.map(x => "- " + x).join("\n")}

When you finish, your plan is sent to your teacher for your teacher-led Return Plan session. You can save a copy too.`
      }
    ]
  });
})();
