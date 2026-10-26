/*
  RIOT (Resilience in our Teens): "Reducing anxiety & building resilience thinking skills".
  Eight lessons condensed from the school's RIOT PowerPoints and student workbook to fit a
  25-minute group module. Keep the RIOT wording when editing.

  Each lesson has:
    - intentions / criteria: learning intentions and success criteria
    - teach: the teaching slides (title, points, note; "boxes: true" shows points as RIOT callouts)
    - items: the worksheet activities. Students do them on paper, as a PDF on their laptop, or
      interactively on their laptop (the format is chosen on the daily schedule). An item with
      "act" is a worksheet exercise and gets a matching slide, so the slides and worksheets match.
    - guide: the 25-minute run sheet for staff.
  The printable worksheets are riot-worksheet.html?lesson=N; tools/riot-pdfs.js saves them as PDFs
  in resources/riot/ for the "PDF on laptop" format.
*/
window.RP = window.RP || {};

RP.RIOT_FORMATS = [
  { id: "paper", label: "Paper worksheet", student: "Your teacher will give you a printed worksheet." },
  { id: "pdf", label: "PDF on laptop", student: "Open the worksheet on your laptop and type your answers. The lesson slides are next to it, so you can follow along." },
  { id: "interactive", label: "Interactive on laptop", student: "Work through the activities on your laptop. The lesson slides are next to them, so you can follow along." }
];

RP.RIOT = [
  {
    n: 1, title: "Embrace the power within you",
    intentions: ["Understand our school's reasons for undertaking RIOT.", "Know a definition of wellbeing, and resilience.", "Understand how anxiety can develop."],
    criteria: ["Explain why their school is doing the RIOT project.", "Give a definition of wellbeing and resilience.", "Explain how anxiety can develop over time."],
    guide: `**25 minutes.** Slides on the projector; worksheets on paper, as a PDF or on laptops.
- **2 min:** title and learning intentions.
- **5 min:** RIOT and mental health. Read the WHO definition, then students do **Exercise 1** (what mental health means to them).
- **8 min:** resilience: the tree with strong roots. **Exercise 2** (words for resilience and what makes their roots stronger), then **Exercise 3** (aspects they're good at and need to work on).
- **5 min:** signs of low resilience. **Exercise 4** sort.
- **5 min:** resilience is learnt, and avoiding things can make anxiety worse. Recap.
*Optional if time:* Rachel Platten, *Fight Song* ([YouTube](https://www.youtube.com/watch?v=xo1VInw-SKc)).`,
    teach: [
      { title: "Introduction to R.I.O.T", boxes: true, points: ["This series of lessons is not about creating a perfect world where there'll be no stress or anxiety.", "It's not about controlling the world; it's about controlling our preparation for life's events and our self-management when they occur.", "We are working to increase our coping capacities so that we manage the regular stresses of life and school."] },
      { title: "What is 'mental health'?", points: ["The World Health Organisation (WHO) defines mental health as a state of wellbeing that enables a person to cope with the stresses of life, realise their abilities, learn and work well, and contribute to their community (2022)."], note: "What does mental health mean to you? How is it related to wellbeing?" },
      { title: "Resilience", points: ["A resilient person is like a tree with strong roots.", "A tree with strong roots can withstand the most violent storm, but the tree can't grow roots just as the storm appears."] },
      { title: "Signs of low resilience", points: ["**Emotional and behavioural:** we may be more irritable and moody, lack motivation or feel drained, and overreact to small stressors.", "**Physical:** trouble sleeping, feeling tired a lot, aches and pains, getting sick more often.", "**Mental and cognitive:** trouble concentrating or remembering, finding it hard to adapt to change, feeling stuck or helpless."] },
      { title: "Resilience is not genetic!", boxes: true, points: ["Resilience is learnt and developed.", "The opposite can also be said: we can learn unhelpful ways to manage stress and anxious feelings.", "Avoiding experiences can make anxiety worse. If we develop a habit of avoiding things that cause discomfort, this can result in more and more avoidance."] }
    ],
    items: [
      {
        type: "write", act: "Exercise: Wellbeing", at: 1,
        q: "The World Health Organisation (WHO) defines mental health as a state of wellbeing that enables a person to cope with the stresses of life, realise their abilities, learn and work well, and contribute to their community (2022).",
        prompts: ["What does mental health mean to you? How do you know you are in good mental health?", "What are the signs that someone is looking after their mental health?"]
      },
      {
        type: "write", act: "Exercise: Resilience", at: 2,
        q: "**A tree with strong roots can withstand the most violent storm, but the tree can't grow roots just as the storm appears.**",
        prompts: ["What is your understanding of resilience? What are some words or phrases that are connected to the idea of resilience?", "What are some of the things that could make your roots stronger and make you a more resilient person?"]
      },
      {
        type: "write", act: "Exercise: Aspects of resilience", at: 2,
        prompts: ["Aspects of resilience I'm good at.", "Aspects of resilience I might need to work on."]
      },
      {
        type: "sort", act: "Exercise: Signs of low resilience", at: 3,
        q: "Sort each sign of low resilience.",
        buckets: ["Emotional and behavioural", "Physical", "Mental and cognitive"],
        cards: [
          { text: "Being irritable and moody", bucket: 0 },
          { text: "Overreacting to small stressors", bucket: 0 },
          { text: "Trouble sleeping", bucket: 1 },
          { text: "Getting sick more often", bucket: 1 },
          { text: "Trouble concentrating", bucket: 2 },
          { text: "Feeling stuck or helpless", bucket: 2 }
        ]
      }
    ]
  },
  {
    n: 2, title: "RIOT",
    intentions: ["Understand the RIOT goals and limitations.", "Understand the expectations for students.", "Know about locus of control and circle of control."],
    criteria: ["Explain the expectations teachers have of students.", "Be able to identify internal locus of control and external locus of control thinking.", "Complete a circle of control diagram."],
    guide: `**25 minutes.**
- **2 min:** recap and learning intentions.
- **3 min:** RIOT simplified (three boxes).
- **8 min:** locus of control. Explain internal and external, then **Exercise 1**: sort the six statements together, one at a time.
- **7 min:** circle of control. **Exercise 2** sort, then students add their own.
- **5 min:** what staff expect: "have a go". **Exercise 3**.
*Optional if time:* Katy Perry, *Roar* ([YouTube](https://www.youtube.com/watch?v=CevxZvSJLk8)); stories of resilience: Malala Yousafzai and Bethany Hamilton.`,
    teach: [
      { title: "Let's recap", points: ["Deep roots can help the tree withstand the storms. Similarly, learning a set of skills can help us to better manage stress and anxiety.", "Most anxious behaviour is able to be managed.", "We can learn skills to become more resilient."] },
      { title: "RIOT simplified", boxes: true, points: ["RIOT is not about creating a perfect world where there will be no anxious feelings or diagnosed anxiety.", "It's not about controlling the world; it's about controlling ourselves and our reactions to events.", "RIOT strategies help us to increase our coping capacities so that we will manage the regular stresses in our lives so we can live well."] },
      { title: "How locus of control connects to resilience", points: ["Locus of control is the degree to which people believe they have control over the outcomes of their lives.", "An **internal** locus of control means you believe your own actions, efforts and abilities determine events.", "An **external** locus of control means you believe external forces like luck, fate or other people are responsible for what happens.", "Resilient people are more likely to cultivate an internal locus of control."] },
      { title: "What staff expect to see and hear", points: ["We want you to try and 'have a go', even when you don't want to or think you can't.", "\"I know it's tricky and makes me feel uncomfortable, but I'll give it a go.\"", "Ask for assistance or ask questions rather than just say \"I can't do it\".", "You can say \"I have anxious feelings\" rather than \"I have anxiety\" (unless it's formally diagnosed)."], note: "Sometimes you just need to keep swimming." }
    ],
    items: [
      {
        type: "sort", act: "Exercise: Locus of control", at: 2,
        q: "Is each statement **internal** or **external** locus of control?",
        buckets: ["Internal (I)", "External (E)"],
        cards: [
          { text: "Our team lost because our defence wasn't strong enough. We need to work on this in training.", bucket: 0 },
          { text: "I got a B on my Science test because I reviewed the topic questions.", bucket: 0 },
          { text: "I only got a C for that assessment because Ms Sampson doesn't like me.", bucket: 1 },
          { text: "I didn't get into the basketball team because I'm unlucky.", bucket: 1 },
          { text: "I was selected for captain because I am committed and I treat all team members with respect.", bucket: 0 },
          { text: "I can't go on the excursion because Mr Cross wouldn't take my late permission slip.", bucket: 1 }
        ]
      },
      {
        type: "sort", act: "Exercise: Circle of control", at: 2,
        q: "Complete the circle of control: things I can control, things I can't control.",
        buckets: ["Things I can control", "Things I can't control"],
        cards: [
          { text: "My effort", bucket: 0 },
          { text: "How I respond", bucket: 0 },
          { text: "Asking for help", bucket: 0 },
          { text: "The weather", bucket: 1 },
          { text: "Other people's opinions", bucket: 1 },
          { text: "The family I was born into", bucket: 1 }
        ]
      },
      {
        type: "write", act: "Exercise: My circle of control", at: 3,
        q: "There are numerous things that are beyond our control. But there are aspects of life we can take some control over. Recognising this means you can put your effort where you are most likely to have some effect.",
        prompts: ["Things in my life I can control:", "Things in my life I can't control:", "What does 'having a go' look like for me?"]
      }
    ]
  },
  {
    n: 3, title: "Managing feelings, managing stress",
    intentions: ["Learn that labelling feelings is a first step to managing them.", "Understand some of the challenges facing adolescents.", "Understand the metaphor of the stress bucket."],
    criteria: ["Name a range of feelings.", "List some of the challenges faced by young people and the strategies that help.", "Complete the stress bucket diagram."],
    guide: `**25 minutes.**
- **2 min:** recap and learning intentions.
- **4 min:** **Exercise 1**: name as many emotions as you can in 60 seconds. Point out we have more words for negative feelings.
- **4 min:** our brains are wired for negative thoughts; emotions come and go; the 90-second rule. **Exercise 2**.
- **4 min:** anxious feelings versus an anxiety condition. **Exercise 3**.
- **8 min:** the stress bucket. **Exercise 4**.
- **3 min:** grounding (5-4-3-2-1) together.`,
    teach: [
      { title: "Let's recap", points: ["The RIOT project can help us learn ways to manage stress and deal with anxious feelings.", "Resilient people are more likely to cultivate an internal locus of control.", "We need to show a willingness to 'have a go'."] },
      { title: "Our brains are wired for negative thoughts", points: ["Early humans needed to be sensitive to threats and dangers in order to survive.", "Negative views tend to stick and be hard to change. It takes effort to see the 'upside' of things.", "Emotions are not permanent; they come and go. We do not need to act on every emotion."] },
      { title: "90 second emotion processing", boxes: true, points: ["A person's reaction to something in their environment causes a 90 second chemical process in the body.", "After 90 seconds, any remaining emotional response is a choice.", "If we learn to pause, we can respond, rather than react."], note: "Harvard brain scientist Dr Jill Bolte Taylor" },
      { title: "What is anxiety?", points: ["Anxiety is more than feeling worried.", "Feeling anxious is a common response to being under pressure. Usually, these feelings pass once the stressful situation has passed.", "An anxiety condition is when the anxious feelings don't go away and they may not have a clear cause."] },
      { title: "The stress bucket", points: ["Stress pours into our bucket: school, friends, family, sleep, pressure.", "When the bucket is full, it overflows.", "We can turn on some taps (rest, self care, enjoyable activities, exercise) to let stress out."] },
      { title: "Grounding: 5-4-3-2-1", points: ["5 things you can see", "4 things you can feel", "3 things you can hear", "2 things you can smell", "1 thing you can taste"], note: "Practise this while breathing slowly. It helps empty some water from your stress bucket." }
    ],
    items: [
      { type: "write", act: "Exercise: Emotions", at: 0, prompts: ["Brainstorm as many emotions as you can in 60 seconds."] },
      { type: "mc", act: "Exercise: 90 seconds", at: 2, q: "According to Dr Jill Bolte Taylor, after how long is the body's chemical reaction to an emotion over, so that any remaining response is a choice?", choices: ["About 10 seconds", "About 90 seconds", "About 10 minutes", "About a day"], answer: 1 },
      { type: "mc", act: "Exercise: What is anxiety?", at: 3, q: "Which describes an **anxiety condition**, rather than everyday anxious feelings?", choices: ["Feeling nervous before a test, then fine afterwards", "Anxious feelings that don't go away, and may not have a clear cause", "Feeling worried when trying something new", "Feeling nervous before speaking in front of a group"], answer: 1 },
      {
        type: "write", act: "Exercise: Stress bucket", at: 4,
        q: "Stress pours into our bucket. When it's full, it overflows. Taps let the stress out.",
        prompts: ["Things that fill my stress bucket:", "My taps: things that help empty my bucket:", "What advice would you give a friend who was worried or feeling anxious?"]
      }
    ]
  },
  {
    n: 4, title: "The amazing brain",
    intentions: ["Learn that different areas of the brain have different functions.", "Understand that the adolescent brain is still developing.", "Learn the difference between a reaction and a response."],
    criteria: ["Name the three main sections of the brain that contribute to anxiety.", "Be able to name and practise at least two calming strategies."],
    guide: `**25 minutes.**
- **2 min:** recap and learning intentions.
- **6 min:** three parts of the brain and the hand model (everyone makes the fist). **Exercise 1** match.
- **5 min:** fight, flight or freeze. **Exercise 2**.
- **4 min:** practise box breathing together (**Exercise 3**).
- **8 min:** **Exercise 4**: Plan in my pocket.
*Optional:* Dan Siegel's hand model of the brain ([YouTube](https://www.youtube.com/watch?v=FTnCMxEnnv8)).`,
    teach: [
      { title: "Let's recap", points: ["By identifying and tracking our emotions, we can become better at managing them.", "Many young people are concerned about school and study, relationships and mental health.", "The idea of a stress bucket can help us know what to do when we are overwhelmed."] },
      { title: "Our brain is amazing: three important parts", points: ["**Brain stem:** keeps us alive and reacts to danger.", "**Limbic system, including the amygdala:** the emotional part and the brain's alarm system. It triggers fight, flight or freeze.", "**Prefrontal cortex:** the 'smart part' that stops, thinks and chooses. It is still developing in teenagers."] },
      { title: "A hand model of the brain", points: ["Make a fist with your thumb tucked inside.", "Wrist and palm: the brain stem. Thumb: the limbic system. Fingers: the cortex.", "When emotions get very strong, we 'flip our lid': the fingers lift and the thinking part loses touch."] },
      { title: "Fight, flight or freeze", points: ["Heart racing, fast breathing, tense muscles, hot face, butterflies in the belly.", "It's a false alarm when there's no real danger.", "Practising calming strategies when you are NOT in 'fight or flight' mode means you can more easily use them when you need them."] }
    ],
    items: [
      {
        type: "match", act: "Exercise: Three parts of the brain", at: 2,
        q: "Match each part of the brain to what it does.",
        pairs: [
          { left: "Brain stem", right: "Keeps us alive and reacts to danger" },
          { left: "Amygdala (limbic system)", right: "The alarm system that triggers fight, flight or freeze" },
          { left: "Prefrontal cortex", right: "The smart part that stops, thinks and chooses" }
        ]
      },
      { type: "write", act: "Exercise: Fight, flight or freeze", at: 3, prompts: ["What can happen to our body during the fight, flight or freeze response?", "Think about a time when you were in 'fight, flight or freeze' mode. What did you do? How did you return to calm? (You don't have to share this.)"] },
      { type: "breathe", act: "Exercise: Practise guided mindfulness", at: 3, text: "It is important to practise these skills when we are not in a crisis moment so that when something happens and our amygdala is firing, we can easily draw on them. Try three rounds of box breathing.", rounds: 3 },
      { type: "write", act: "Exercise: Plan in my pocket", at: 3, prompts: ["Some things that make me feel anxious are…", "When I feel anxious, I feel this in my body…", "When I feel anxious, I have these thoughts…", "When I feel anxious, I do these things…"] },
      {
        type: "select", act: "Exercise: Plan in my pocket: my skills", at: 3,
        q: "Choose the skills you'll use when you feel anxious.",
        options: ["Take 3 deep breaths", "Practise mindfulness", "Tense and relax your muscles", "Count from 1 to 100", "Find a trusted person to talk to", "Listen to music", "Take a break in your safe place", "Exercise, run or jog", "Stretching", "Use encouraging self-talk", "Think of 3 things you are grateful for", "Challenge unhelpful thoughts"],
        other: true
      }
    ]
  },
  {
    n: 5, title: "Faulty thinking and what to do about it",
    intentions: ["Understand different kinds of faulty thinking.", "Learn some strategies for countering faulty thinking.", "Recognise that we can develop unhelpful patterns in our thinking."],
    criteria: ["Identify and explain at least three kinds of faulty thinking.", "Explain the link between an event, our interpretation and an emotion.", "Challenge faulty thinking by 'taking a thought to court'."],
    guide: `**25 minutes.**
- **2 min:** recap and learning intentions.
- **5 min:** thinking matters (Epictetus); the cortex can get things wrong; event → interpretation → feeling.
- **6 min:** the five cognitive distortions. **Exercise 1** match.
- **6 min:** **Exercise 2**: Claude and Sara's dad. Name the faulty thinking and what a friend could say.
- **6 min:** taking a thought to court. **Exercise 3**: turn negative thoughts into helpful ones.`,
    teach: [
      { title: "Let's recap", points: ["In our brains, the limbic system, including the amygdala, reacts to threat.", "The cortex can help us respond more rationally.", "Box breathing and mindfulness can help us return to calm."] },
      { title: "Thinking matters", boxes: true, points: ["\"It's not things that upset us, but our judgments about things.\" (Epictetus)", "The way we think about things makes the difference.", "The cortex is driven by words and logic. Sometimes it makes errors, and this can lead to faulty thinking."] },
      { title: "Common cognitive distortions", points: ["**Emotional reasoning:** \"I feel it, so it must be true.\"", "**Discounting the positive:** good things \"don't count\".", "**Mind reading:** assuming we know what others think.", "**All or nothing thinking:** seeing things as all good or all bad.", "**Catastrophising:** expecting the worst."] },
      { title: "Understanding the pattern", points: ["Cognitive distortions are often our first or automatic thoughts.", "An event occurs → we interpret the event (sometimes incorrectly or without enough evidence) → we experience a feeling."] },
      { title: "Take the thought to court", points: ["What is your evidence for this thought?", "What is the evidence against it?", "What might be another way to look at this?", "What would I tell a friend?"], note: "We need to practise challenging unhelpful thoughts. Over time, negative thoughts come up less often." }
    ],
    items: [
      {
        type: "match", act: "Exercise: Cognitive distortions or faulty thinking", at: 2,
        q: "Match each kind of faulty thinking to an example.",
        pairs: [
          { left: "Emotional reasoning", right: "\"I feel stupid, so I must be stupid.\"" },
          { left: "Discounting the positive", right: "\"I only passed because the test was easy.\"" },
          { left: "Mind reading", right: "\"Everyone in class thinks I'm weird.\"" },
          { left: "All or nothing thinking", right: "\"If I don't get full marks, I've failed.\"" },
          { left: "Catastrophising", right: "\"If I get this wrong, my whole year is ruined.\"" }
        ]
      },
      {
        type: "mc", act: "Exercise: Scenarios: Claude", at: 3,
        q: "**Scenario 1: Claude.** Claude's teacher is walking around the classroom checking on student work and Claude has his emails open. The teacher asks Claude to get back to his classwork, without realising Claude was getting a link to the shared research document from his research partner. Claude decides then and there that the teacher hates him.\n\nWhat is Claude's faulty thinking?",
        choices: ["Mind reading", "Discounting the positive", "Emotional reasoning"], answer: 0
      },
      {
        type: "mc", act: "Exercise: Scenarios: Sara's dad", at: 3,
        q: "**Scenario 2: Sara's dad.** Sara's dad is waiting for her to get home from a party. She is being driven by a friend he knows, but not very well. The curfew is 11pm and it's now 11.30pm. Sara's dad starts panicking and assumes the kids have been in a car accident.\n\nWhat is Sara's dad's faulty thinking?",
        choices: ["All or nothing thinking", "Catastrophising", "Mind reading"], answer: 1
      },
      { type: "write", act: "Exercise: Turning negative thoughts into positive ones", at: 4, q: "If you were a friend, what could you say to challenge their thinking? Then write 3 negative thoughts and turn them into more helpful ones.", prompts: ["What could you say to Claude?", "Negative thought 1 → more helpful thought", "Negative thought 2 → more helpful thought", "Negative thought 3 → more helpful thought"] }
    ]
  },
  {
    n: 6, title: "Facing our fears",
    intentions: ["Learn strategies for facing fears.", "Know how and when to use calming (arousal reduction) techniques to lower the fear response."],
    criteria: ["Demonstrate some arousal reduction techniques.", "Complete an exposure ladder."],
    guide: `**25 minutes.**
- **2 min:** recap and learning intentions.
- **3 min:** **Exercise 1**: name as many common fears as you can in 60 seconds.
- **4 min:** the amygdala and our fear response; gradual exposure is like building a by-pass.
- **3 min:** practise box breathing before starting a ladder.
- **5 min:** Riley's 'Have a go' ladder: **Exercise 2** order.
- **8 min:** **Exercise 3**: make your own ladder (or use Noah, Evie or Claudia), then consequences and benefits.`,
    teach: [
      { title: "Let's recap", points: ["The cortex, which uses words and logic, can get things wrong.", "Cognitive distortions are types of faulty thinking where we tend to focus on the negative.", "We can challenge faulty thinking and change the way we feel about something."] },
      { title: "The amygdala and our fear response", points: ["The amygdala links emotional experiences to learning and memory.", "To reset the amygdala, we need to create new connections in the brain.", "Exposing your amygdala to fears gradually is like building a by-pass on a highway."] },
      { title: "Before you start: calm yourself", boxes: true, points: ["When we expose ourselves to a fear gradually, we build new connections in the brain.", "We need to know how to calm ourselves as we work through the steps: box breathing, mindfulness, muscle relaxation, picturing a calm place."] },
      { title: "Graded exposure: the 'Have a go' ladder", points: ["We can push back against avoidance by using a step ladder to gradually face our fears.", "Start with the step that scares you least.", "Stay on a step until your fear rating is 3 or below, then move up.", "Making changes takes time: it can take days or weeks on a step."] }
    ],
    items: [
      { type: "write", act: "Exercise: Fears", at: 0, prompts: ["What are some common fears that some people have?"] },
      {
        type: "order", act: "Exercise: Riley's 'Have a go' ladder", at: 3,
        q: "Riley would like to improve his social skills. Put his ladder in order, from the step he fears least to the step he fears most.",
        cards: [
          "Practise saying 'Hi! How are you?' with a friend.",
          "Make eye contact and say 'Hi' to one person he knows every day.",
          "Make a comment to a classmate (e.g. 'Have a good weekend.').",
          "Ask a classmate a quick question (e.g. 'Is the Maths quiz this Friday?').",
          "Approach a classmate during break and ask if he can join in their game."
        ]
      },
      {
        type: "write", act: "Exercise: My 'Have a go' ladder", at: 3,
        q: "Create your own 'Have a go' ladder for a fear or a problem you would like to deal with. If you can't think of one, try one of these: Noah is too nervous to give a talk in front of the class. Evie is so afraid of bees, she won't do sport on the oval. Claudia hates eating in front of people, so she usually eats nothing at school.",
        prompts: ["Goal:", "Step 1 (least scary), and fear rating out of 10", "Step 2, and fear rating", "Step 3, and fear rating", "Step 4 (most scary), and fear rating"]
      },
      { type: "write", act: "Exercise: Facing fears", at: 3, prompts: ["What are some short-term (say, over the next 6 months) consequences of not facing my fears?", "What are some long-term (the rest of my life) benefits of facing my fears?"] }
    ]
  },
  {
    n: 7, title: "Mind maintenance",
    intentions: ["Learn strategies for maintaining their mental wellbeing.", "Understand the importance of mental wellbeing in managing stress and emotional overload."],
    criteria: ["Set up some mind maintenance routines and expectations."],
    guide: `**25 minutes.**
- **2 min:** recap and learning intentions.
- **5 min:** six factors that contribute to mental wellbeing; mind maintenance tips.
- **5 min:** **Exercise 1**: self-check (stars) and one change.
- **5 min:** the teenage brain is under construction; ways to manage strong emotions. **Exercise 2**.
- **6 min:** **Exercise 3**: my mood boosting activities.
- **2 min:** seek help if you need to; useful apps (Smiling Mind, Calm).`,
    teach: [
      { title: "Let's recap", points: ["Gradual exposure to a fear can build new connections in the brain.", "It can take some time to change our experience of a situation or thing that scares us.", "We can use 'Have a go' ladders to reduce our fears."] },
      { title: "What contributes to our mental wellbeing?", points: ["**Sleep:** 8 to 10 hours a night; screens away two hours before bed.", "**Exercise:** a daily walk, a sport or a club.", "**Healthy eating:** healthy meals and plenty of water.", "**Social engagement:** time with supportive friends and family.", "**Limit unhealthy screen time:** set limits for social media and games.", "**Relax and recharge:** reading, music, getting out in nature."] },
      { title: "The teenage brain is under construction", points: ["The amygdala becomes bigger and more reactive in teens, especially in emotional or social situations.", "The prefrontal cortex, which handles impulse control and decision-making, may not be fully developed until your mid 20s.", "So practising our emotional regulation skills is important: 'use it or lose it'."] },
      { title: "Ways to manage strong emotions", points: ["Pause for 90 seconds before responding.", "Square breathing, meditation or visualisation.", "Distract yourself with a hobby.", "Talk to a supportive person.", "Calming music, drawing or writing, a walk or a run.", "When calm, try problem solving."], note: "If you get stuck in unhelpful emotions, get help from a counsellor or talk to your doctor." }
    ],
    items: [
      {
        type: "slider", act: "Exercise: Mental wellbeing self-check", at: 1,
        q: "Give yourself a rating from one to five stars for how well you are managing each factor.",
        sliders: [
          { label: "Sleep", min: 1, max: 5, left: "1 star", right: "5 stars" },
          { label: "Exercise", min: 1, max: 5, left: "1 star", right: "5 stars" },
          { label: "Social engagement", min: 1, max: 5, left: "1 star", right: "5 stars" },
          { label: "Screen time", min: 1, max: 5, left: "1 star", right: "5 stars" },
          { label: "Relax and recharge", min: 1, max: 5, left: "1 star", right: "5 stars" },
          { label: "Healthy eating", min: 1, max: 5, left: "1 star", right: "5 stars" }
        ]
      },
      { type: "write", act: "Exercise: One change", at: 1, prompts: ["What is one change you could make to improve your mental wellbeing?"] },
      {
        type: "select", act: "Exercise: Managing strong emotions", at: 3,
        q: "Which ways could help you or a classmate manage strong emotions?",
        options: ["Pause for 90 seconds", "Square breathing", "Meditation or visualisation", "Do a hobby", "Talk to a supportive person", "Listen to calming music", "Draw or write about my feelings", "Go for a walk or a run", "Problem solve once I'm calm"],
        other: true
      },
      { type: "write", act: "Exercise: My mood boosting activities", at: 3, q: "Create your own list of mood boosting activities. Ideas: gardening, music, drama, volunteering, creative projects, nature walks, dance, journaling, yoga.", prompts: ["1.", "2.", "3.", "4.", "5."] }
    ]
  },
  {
    n: 8, title: "Problem-solving and recap",
    intentions: ["Learn the steps to problem-solving.", "Revise key concepts from the lessons.", "Create a plan for building my resilience at school."],
    criteria: ["Be able to demonstrate the steps of problem-solving.", "Recognise and explain key concepts of RIOT.", "Produce a 'Student plan' for being more resilient at school."],
    guide: `**25 minutes.**
- **2 min:** recap and learning intentions.
- **4 min:** problem-solving and resilience; the steps. **Exercise 1** order.
- **8 min:** **Exercise 2**: practise with a scenario.
- **5 min:** key concepts from the RIOT lessons; the T-RED student resilience action plan.
- **6 min:** **Exercise 3**: reflection.`,
    teach: [
      { title: "Let's recap", points: ["Mental wellbeing is improved when we manage our sleep, diet, exercise, screen time, social connections and relaxation.", "Teenage brains are under construction and are not fully connected until around our mid 20s.", "We can manage our moods by choosing actions that reduce our arousal, calm our minds and allow us to problem solve."] },
      { title: "Problem-solving and resilience", boxes: true, points: ["Problem-solving is a proactive way of responding to a stressful situation.", "Problem-solving gives us a sense of control and reduces stress.", "Problem-solving focuses on action."] },
      { title: "Key concepts from RIOT", points: ["Resilience can be built over time, like a tree developing deep roots.", "We need to identify and track emotions before we can manage them.", "The amygdala is the brain's alarm system; the prefrontal cortex is the rational, logical part.", "We need to challenge faulty thinking, and we can face fears with a 'Have a go' ladder.", "Sleep, food, exercise, friends, limited screen time and relaxing all help our mental wellbeing."] },
      { title: "Final thoughts", boxes: true, points: ["You are in charge of the person you become.", "It can take time and practice to develop resilience skills.", "We get stronger as we do hard things and meet life's challenges."], note: "\"Focusing on our Future\"" }
    ],
    items: [
      {
        type: "order", act: "Exercise: The steps to problem-solving", at: 1,
        q: "Put the steps to problem-solving in order.",
        cards: ["Define the problem.", "Think about what you want: your goal or outcome.", "Brainstorm solutions.", "Select a solution that best fits your goal and is likely to work.", "Implement the solution.", "Evaluate the results."]
      },
      {
        type: "write", act: "Exercise: Practise your problem-solving", at: 1,
        q: "**Scenario.** My friend is angry with me because I didn't meet her at lunch to work on our project, which is due in two days. I planned to go, but I had to help a student who was injured and then forgot to meet her because I was still in the sick bay. When I realised, I rushed to the library, but she had already left. I feel upset because I didn't mean to ignore her and I'm worried about our friendship and the project.",
        prompts: ["Define the problem", "What is the solution?"]
      },
      {
        type: "write", act: "Exercise: Reflection", at: 2,
        prompts: ["Three key ideas I have learnt from the RIOT lessons:", "What is one action you can take today to improve your mental wellbeing?", "Write a message to yourself to remind you how you can be a more resilient person."]
      }
    ]
  }
];

(function () {
  const firstLine = s => String(s || "").split("\n\n").pop();
  // The slide for a worksheet exercise, built from the activity itself so they always match.
  function activitySlide(it, k) {
    const pts = [];
    if (it.type === "write") { if (it.q) pts.push(firstLine(it.q)); it.prompts.forEach(p => pts.push(p)); }
    else if (it.type === "sort") { pts.push(it.q); pts.push(it.buckets.join("  |  ")); it.cards.forEach(c => pts.push(c.text)); }
    else if (it.type === "order") { pts.push(it.q); it.cards.slice().sort().forEach(c => pts.push(c)); }
    else if (it.type === "match") { pts.push(it.q); it.pairs.forEach(p => pts.push(p.left)); }
    else if (it.type === "mc") { pts.push(firstLine(it.q)); it.choices.forEach(c => pts.push(c)); }
    else if (it.type === "select") { pts.push(it.q); }
    else if (it.type === "slider") { pts.push(it.q); it.sliders.forEach(s => pts.push(s.label + ": ☆☆☆☆☆")); }
    else if (it.type === "breathe") { pts.push(it.text); pts.push("Breathe in for 4 · hold for 4 · out for 4 · hold for 4"); }
    return { title: it.act, points: pts, note: `On your worksheet or laptop: Exercise ${k}`, activity: true };
  }
  RP.RIOT.forEach(L => {
    L.id = "riot-lesson-" + L.n;
    L.fullTitle = `Lesson ${L.n}: ${L.title}`;
    // Number the exercises.
    let k = 0;
    L.items.forEach(it => { if (it.act) { k++; it.title = it.title || `Exercise ${k}: ${it.act.replace(/^Exercise: /, "")}`; it.actNo = k; } });
    const acts = L.items.filter(it => it.act).map(it => activitySlide(it, it.actNo));
    // Slides: title, intentions, the teaching slides with each exercise after the slide before it.
    L.slides = [
      { title: `Lesson ${L.n}: ${L.title}`, points: ["Reducing anxiety & building resilience thinking skills"], cover: true },
      { title: `Lesson ${L.n} learning intentions`, points: L.intentions, criteria: L.criteria, intentions: true }
    ];
    // Each exercise's slide follows the teaching slide it belongs to ("at", counting from 0).
    const exercises = L.items.filter(it => it.act);
    L.teach.forEach((t, i) => {
      L.slides.push(t);
      exercises.forEach((it, j) => { if (it.at === i) L.slides.push(acts[j]); });
    });
    exercises.forEach((it, j) => { if (it.at == null || it.at >= L.teach.length) L.slides.push(acts[j]); });
    // The interactive version is a module (hidden from the independent list).
    RP.registerModule({
      id: L.id, title: `RIOT ${L.fullTitle}`, icon: "🌳", riot: L.n, hidden: true, score: false,
      about: `**${L.fullTitle}.** Work through the activities. The lesson slides are next to them: read each slide, then do the exercise.`,
      items: [{ type: "read", title: L.fullTitle, text: `**Learning intentions.** We will:\n${L.intentions.map(x => "- " + x).join("\n")}\n\n**Success criteria.** I can:\n${L.criteria.map(x => "- " + x).join("\n")}` }].concat(L.items)
    });
  });
  RP.riotLesson = n => RP.RIOT.find(L => L.n === Number(n));
  RP.riotPdf = n => `resources/riot/riot-lesson-${n}.pdf`;
})();

// The printable worksheet for a lesson, laid out like the RIOT student workbook.
RP.riotWorksheetMarkup = function (L) {
  const h = RP.h, md = RP.md, inline = RP.inlineMd;
  const lines = n => `<div class="rs-lines">${"<div></div>".repeat(n)}</div>`;
  const letters = "ABCDEFGH";
  const body = it => {
    if (it.type === "write") return `${it.q ? md(it.q) : ""}${it.prompts.map(p => `<p class="rs-prompt">${inline(p)}</p>${lines(it.prompts.length > 3 ? 2 : 3)}`).join("")}`;
    if (it.type === "sort") return `<p>${inline(it.q)}</p><table class="rs-table"><thead><tr><th>Statement</th>${it.buckets.map(b => `<th>${h(b)}</th>`).join("")}</tr></thead>
      <tbody>${it.cards.map(c => `<tr><td>${h(c.text)}</td>${it.buckets.map(() => `<td class="rs-tick">☐</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    if (it.type === "order") return `<p>${inline(it.q)} Number them 1 to ${it.cards.length}.</p><table class="rs-table">${it.cards.slice().sort().map(c => `<tr><td class="rs-num"></td><td>${h(c)}</td></tr>`).join("")}</table>`;
    if (it.type === "match") {
      const rights = it.pairs.map(p => p.right).sort();
      return `<p>${inline(it.q)} Write the letter next to each one.</p><div class="rs-match"><table class="rs-table">${it.pairs.map(p => `<tr><td>${h(p.left)}</td><td class="rs-num"></td></tr>`).join("")}</table>
        <ol class="rs-letters" type="A">${rights.map(r => `<li>${h(r)}</li>`).join("")}</ol></div>`;
    }
    if (it.type === "mc") return `${md(it.q)}<ul class="rs-boxes">${it.choices.map(c => `<li>☐ ${h(c)}</li>`).join("")}</ul>`;
    if (it.type === "select") return `<p>${inline(it.q)}</p><ul class="rs-boxes rs-cols">${it.options.map(o => `<li>☐ ${h(o)}</li>`).join("")}${it.other ? `<li>☐ Other: ________________</li>` : ""}</ul>`;
    if (it.type === "slider") return `<p>${inline(it.q)}</p><table class="rs-table">${it.sliders.map(s => `<tr><td>${h(s.label)}</td><td class="rs-stars">☆ ☆ ☆ ☆ ☆</td></tr>`).join("")}</table>`;
    if (it.type === "breathe") return `<p>${inline(it.text)}</p><p class="rs-prompt">Box breathing: breathe in for 4, hold for 4, breathe out for 4, hold for 4.</p>`;
    return "";
  };
  return `
    <div class="riot-sheet">
      <div class="rs-head"><span class="rs-badge">RIOT</span><h1>LESSON ${L.n}: ${h(L.title)}</h1></div>
      <table class="rs-li"><thead><tr><th>LEARNING INTENTIONS</th><th>SUCCESS CRITERIA</th></tr></thead>
        <tbody><tr><td><p>Students will:</p><ul>${L.intentions.map(x => `<li>${h(x)}</li>`).join("")}</ul></td>
        <td><p>Students will be able to:</p><ul>${L.criteria.map(x => `<li>${h(x)}</li>`).join("")}</ul></td></tr></tbody></table>
      ${L.items.map(it => `<section class="rs-ex">
        ${it.act ? `<div class="rs-ex-head"><span class="rs-ex-label">EXERCISE ${it.actNo}</span><span class="rs-ex-title">${h(it.act.replace(/^Exercise: /, "").toUpperCase())}</span></div>` : ""}
        ${body(it)}</section>`).join("")}
      <p class="rs-foot">Reducing anxiety &amp; building resilience thinking skills · Thomas Reddall High School</p>
    </div>`;
};

// One RIOT slide, in the RIOT theme. Used by the Present view on the projector, the slides panel
// next to a student's worksheet, and riot-slides.html.
RP.riotSlideMarkup = function (sl) {
  const h = RP.h, inline = RP.inlineMd;
  if (sl.cover) return `<div class="riot-cover"><div class="riot-badge">RESILIENCE<br>IN OUR<br>TEENS</div><h1>${h(sl.title)}</h1><p>${h(sl.points[0])}</p></div>`;
  if (sl.intentions) return `<h1>${h(sl.title)}</h1><div class="riot-cols"><div><h2>Students will:</h2><ul>${sl.points.map(p => `<li>${inline(p)}</li>`).join("")}</ul></div><div><h2>Success criteria. Students will be able to:</h2><ul>${sl.criteria.map(p => `<li>${inline(p)}</li>`).join("")}</ul></div></div>`;
  return `<h1>${h(sl.title)}</h1>
    ${sl.boxes ? `<div class="riot-boxes">${sl.points.map(p => `<div class="riot-box">${inline(p)}</div>`).join("")}</div>`
      : sl.points && sl.points.length ? `<ul class="${sl.activity ? "riot-activity" : ""}">${sl.points.map((p, i) => `<li${sl.activity && i === 0 ? ` class="riot-q"` : ""}>${inline(p)}</li>`).join("")}</ul>` : ""}
    ${sl.note ? `<p class="present-note">${inline(sl.note)}</p>` : ""}`;
};

// The answers to a lesson's worksheet, for staff (Session guides, and riot-worksheet.html?answers=1).
// Open questions have no single answer, so they show the ideas from the slide they follow.
RP.riotAnswersMarkup = function (L) {
  const h = RP.h, inline = RP.inlineMd;
  const ideas = it => {
    const t = L.teach[it.at];
    return t && t.points && t.points.length ? `<p class="muted">Students' own answers. Ideas from the slide <em>${h(t.title)}</em>:</p><ul>${t.points.map(p => `<li>${inline(p)}</li>`).join("")}</ul>` : `<p class="muted">Students' own answers.</p>`;
  };
  const body = it => {
    if (it.type === "sort") return `<table class="rs-table"><thead><tr>${it.buckets.map(b => `<th>${h(b)}</th>`).join("")}</tr></thead><tbody><tr>${it.buckets.map((b, k) => `<td><ul>${it.cards.filter(c => c.bucket === k).map(c => `<li>${h(c.text)}</li>`).join("")}</ul></td>`).join("")}</tr></tbody></table>`;
    if (it.type === "order") return `<ol>${it.cards.map(c => `<li>${h(c)}</li>`).join("")}</ol>`;
    if (it.type === "match") return `<ul>${it.pairs.map(p => `<li><strong>${h(p.left)}</strong> → ${h(p.right)}</li>`).join("")}</ul>`;
    if (it.type === "mc") return `<p><strong>${h(it.choices[it.answer])}</strong></p>${it.explain ? `<p>${inline(it.explain)}</p>` : ""}`;
    if (it.type === "breathe") return `<p class="muted">A breathing practice: nothing to mark.</p>`;
    if (it.type === "slider") return `<p class="muted">Students rate themselves: no right answer.</p>`;
    return ideas(it);
  };
  return `<div class="riot-answers">${L.items.filter(it => it.act).map(it => `
    <section class="rs-ex"><div class="rs-ex-head"><span class="rs-ex-label">EXERCISE ${it.actNo}</span><span class="rs-ex-title">${h(it.act.replace(/^Exercise: /, "").toUpperCase())}</span></div>
      ${it.type === "mc" || it.type === "sort" || it.type === "order" || it.type === "match" ? `<p class="muted">${inline(String(it.q || "").split("\n\n").pop())}</p>` : ""}
      ${body(it)}</section>`).join("")}</div>`;
};

// A small slide viewer (Back / Next) for a lesson's slides, drawn into el. Returns go(k) and
// toExercise(n), which shows the slide for worksheet exercise n.
RP.riotSlides = function (el, L, start) {
  let k = start || 0;
  const draw = () => {
    el.innerHTML = `
      <div class="riot-viewer riot-theme">
        <div class="present-slide">${RP.riotSlideMarkup(L.slides[k])}</div>
        <div class="riot-viewer-nav"><button class="btn small" data-sl-prev ${k === 0 ? "disabled" : ""}>← Back</button>
          <span>Slide ${k + 1} of ${L.slides.length}</span>
          <button class="btn small" data-sl-next ${k === L.slides.length - 1 ? "disabled" : ""}>Next →</button></div>
      </div>`;
    el.querySelector("[data-sl-prev]").onclick = () => go(k - 1);
    el.querySelector("[data-sl-next]").onclick = () => go(k + 1);
  };
  const go = n => { k = Math.max(0, Math.min(L.slides.length - 1, n)); draw(); };
  const toExercise = n => { const i = L.slides.findIndex(sl => sl.activity && sl.note && new RegExp(`Exercise ${n}$`).test(sl.note)); if (i >= 0 && i !== k) go(i); };
  draw();
  return { go, toExercise };
};
