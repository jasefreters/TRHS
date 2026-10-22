/* Literacy: Reading. Levels 1–5 follow NSW Stages 1–5. A passage, then questions about it. */
RP.registerModule({
  id: "literacy-reading",
  title: "Literacy: Reading",
  hidden: true, // used inside the Literacy module (literacy.js); kept so older plans still work
  icon: "📖",
  about: "Read a short text, then answer questions about it. Use **Back to the text** to look at it again, and **Read aloud** if you'd like to hear it.",
  levels: [
    {
      level: 1, title: "Level 1", about: "A short story",
      items: [
        { type: "read", title: "Max and the ball", text: `Max has a red ball. He kicks the ball to Sam.

The ball goes over the fence. Max is sad.

Sam gets the ball back. Max says, "Thank you, Sam!"

Max and Sam play again.` },
        { type: "mc", q: "What colour is the ball?", choices: ["Blue", "Red", "Green", "Yellow"], answer: 1 },
        { type: "mc", q: "Where does the ball go?", choices: ["Into the pool", "Up a tree", "Over the fence", "Under the car"], answer: 2 },
        { type: "mc", q: "How does Max feel when the ball goes over the fence?", choices: ["Happy", "Sad", "Sleepy", "Hungry"], answer: 1 },
        { type: "input", q: "Who gets the ball back?", answer: "Sam", text: true },
        { type: "mc", q: "What does Max say to Sam?", choices: ["\"Go away!\"", "\"Thank you, Sam!\"", "\"That's my ball.\"", "\"I'm going home.\""], answer: 1 },
        { type: "order", q: "Put the story in order.", cards: ["Max kicks the ball to Sam.", "The ball goes over the fence.", "Sam gets the ball back.", "Max says thank you."] }
      ]
    },
    {
      level: 2, title: "Level 2", about: "A story with a message",
      items: [
        { type: "read", title: "The school garden", text: `Every Friday, Class 4 works in the school garden. Mia waters the tomatoes and Leo pulls out the weeds.

Last week, they found a big green caterpillar eating the lettuce leaves. Instead of squashing it, Mia carefully moved it to a bush near the fence. "It needs food too," she said.

By the end of term, the class had picked enough tomatoes and lettuce to make a salad for the whole school assembly. Everyone said it was the best salad they had ever tasted.` },
        { type: "mc", q: "When does Class 4 work in the garden?", choices: ["Every Monday", "Every Friday", "Only in summer", "After school"], answer: 1 },
        { type: "mc", q: "What was the caterpillar eating?", choices: ["Tomatoes", "Lettuce leaves", "Weeds", "The fence"], answer: 1 },
        { type: "mc", q: "What did Mia do with the caterpillar?", choices: ["Squashed it", "Put it in a jar", "Moved it to a bush", "Gave it to Leo"], answer: 2 },
        { type: "mc", q: "Why did Mia move the caterpillar instead of squashing it?", choices: ["She was scared of it", "She thought it needed food too", "Leo told her to", "It was eating the tomatoes"], answer: 1 },
        { type: "input", q: "What did the class make at the end of term?", answer: "salad", accept: ["a salad"], text: true },
        { type: "mc", q: "In the story, \"carefully\" means…", choices: ["quickly", "in a gentle way, taking care", "angrily", "by accident"], answer: 1 },
        { type: "mc", q: "What is the best word to describe Mia?", choices: ["Kind", "Lazy", "Rude", "Bored"], answer: 0, explain: "She looked after the caterpillar instead of hurting it." }
      ]
    },
    {
      level: 3, title: "Level 3", about: "A sports story",
      items: [
        { type: "read", title: "The comeback", text: `At half time, the Eagles were losing by ten points. The players slumped on the bench, staring at the floor.

Coach Rivera didn't yell. Instead, she asked each player to name one thing they could do better. Jordan said he would stop rushing his shots. Priya said she would call for the ball more. Ali admitted he had stopped running back to defend.

In the second half, the Eagles played like a different team. They passed more, defended harder and talked to each other on the court. With ten seconds left, the scores were level. Priya called for the ball, Jordan passed it, and she sank a shot from the corner.

The Eagles won by two points. Afterwards, Coach Rivera said the win didn't come from talent. It came from honesty and effort.` },
        { type: "mc", q: "How many points were the Eagles losing by at half time?", choices: ["Two", "Five", "Ten", "Twenty"], answer: 2 },
        { type: "mc", q: "What did Coach Rivera do at half time?", choices: ["Yelled at the team", "Asked each player to name one thing they could do better", "Swapped all the players", "Told them to give up"], answer: 1 },
        { type: "mc", q: "The players \"slumped on the bench\". This suggests they felt…", choices: ["excited", "discouraged", "angry at each other", "sleepy"], answer: 1 },
        { type: "order", q: "Put the events in order.", cards: ["The Eagles are losing at half time.", "Each player says what they'll do better.", "The team passes more and defends harder.", "The scores are level with ten seconds left.", "Priya scores the winning shot."] },
        { type: "mc", q: "Who scored the winning shot?", choices: ["Jordan", "Ali", "Priya", "Coach Rivera"], answer: 2 },
        { type: "input", q: "By how many points did the Eagles win?", answer: "2", accept: ["two"] },
        { type: "mc", q: "What is the coach's main message?", choices: ["Talent is all that matters", "Honesty and effort can turn things around", "Always shoot from the corner", "Losing at half time means you'll lose"], answer: 1 }
      ]
    },
    {
      level: 4, title: "Level 4", about: "An information text",
      items: [
        { type: "read", title: "Why teenagers need more sleep", text: `Many teenagers find it hard to fall asleep before eleven o'clock at night, and even harder to wake up for school. This isn't laziness. During adolescence, the body releases melatonin, the hormone that makes us sleepy, later in the evening than it does in childhood. As a result, a teenager's natural sleep time shifts later.

Most teenagers need about eight to ten hours of sleep a night, but many get far less. When sleep is short, the parts of the brain that control attention, memory and emotions are affected. Tired teenagers can find it harder to concentrate in class, remember what they have learned and stay calm when they are frustrated.

Experts suggest some simple habits: keeping a regular bedtime, even on weekends; switching off screens at least an hour before bed, because their light can delay melatonin; and avoiding caffeine in the afternoon. Small changes like these can help teenagers feel more alert, focused and in control during the day.` },
        { type: "mc", q: "What is the main purpose of this text?", choices: ["To entertain with a funny story", "To explain why teenagers need sleep and how to get more", "To sell a sleep product", "To argue that school should start at lunchtime"], answer: 1 },
        { type: "mc", q: "According to the text, why do many teenagers find it hard to fall asleep early?", choices: ["They drink too much water", "Their bodies release melatonin later in the evening", "They aren't tired", "Their beds are uncomfortable"], answer: 1 },
        { type: "input", q: "Which word in the text means the time of life when a child is growing into an adult?", answer: "adolescence", text: true },
        { type: "sort", q: "Does each habit help sleep or make it harder?", buckets: ["Helps sleep", "Makes sleep harder"], cards: [
          { text: "A regular bedtime, even on weekends", bucket: 0 },
          { text: "Screens off an hour before bed", bucket: 0 },
          { text: "No caffeine in the afternoon", bucket: 0 },
          { text: "Scrolling on your phone in bed", bucket: 1 },
          { text: "An energy drink after school", bucket: 1 },
          { text: "Going to bed at very different times", bucket: 1 }
        ] },
        { type: "mc", q: "Which effect of too little sleep does the text mention?", choices: ["Growing taller", "Finding it harder to stay calm when frustrated", "Getting hungrier at night", "Forgetting your friends' names"], answer: 1 },
        { type: "mc", q: "Why does the writer say \"This isn't laziness\"?", choices: ["To challenge a common belief about teenagers", "To make teenagers feel guilty", "To describe how lazy people sleep", "To change the topic"], answer: 0 }
      ]
    },
    {
      level: 5, title: "Level 5", about: "A discussion text",
      items: [
        { type: "read", title: "Off and away: are phone bans working?", text: `In many Australian states, students must now keep their phones "off and away" for the whole school day. Supporters of the rule argue that it has transformed playgrounds. Instead of scrolling in silence, they say, students are talking, playing handball and actually looking at each other. Some teachers report fewer arguments that start online and spill into the classroom, and fewer lessons interrupted by notifications.

Critics are not convinced. They point out that phones are part of modern life and that schools should teach students to manage technology responsibly, rather than simply taking it away. Some parents also worry about not being able to contact their children during the day, especially in an emergency.

The truth may lie somewhere in between. A ban can remove distractions, but it cannot, on its own, teach the self-control that young people will need when the rules no longer apply. Perhaps the real test of the policy is not what happens between 9 am and 3 pm, but what happens after the final bell.` },
        { type: "mc", q: "What is the main purpose of this text?", choices: ["To tell a story about one student", "To present both sides of a debate and offer a balanced view", "To give instructions for using a phone", "To advertise a new phone"], answer: 1 },
        { type: "sort", q: "Is each point an argument for the ban or against it?", buckets: ["For the ban", "Against the ban"], cards: [
          { text: "Students talk and play more at breaks", bucket: 0 },
          { text: "Fewer online arguments spill into class", bucket: 0 },
          { text: "Fewer lessons are interrupted", bucket: 0 },
          { text: "Schools should teach responsible use instead", bucket: 1 },
          { text: "Parents can't easily contact their children", bucket: 1 }
        ] },
        { type: "mc", q: "In \"Critics are not convinced\", who are the critics?", choices: ["Teachers who mark work", "People who disagree with the rule", "Students who break the rule", "Film reviewers"], answer: 1 },
        { type: "mc", q: "\"Arguments that … spill into the classroom\" is an example of…", choices: ["a statistic", "figurative language", "a direct quote", "a question"], answer: 1, explain: "Arguments can't really spill like a liquid. It's a metaphor." },
        { type: "mc", q: "Which sentence is an opinion rather than a fact?", choices: ["\"Students must now keep their phones off and away.\"", "\"Some parents also worry about not being able to contact their children.\"", "\"The truth may lie somewhere in between.\"", "\"Phones are part of modern life.\""], answer: 2 },
        { type: "mc", q: "What does the writer suggest in the final paragraph?", choices: ["Phone bans should be removed straight away", "A ban removes distractions but doesn't teach self-control by itself", "Students should have phones in class", "Bans only matter after school"], answer: 1 },
        { type: "input", q: "Which three words in quotation marks describe the rule?", answer: "off and away", text: true }
      ]
    }
  ]
});
