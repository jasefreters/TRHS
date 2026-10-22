/* Literacy: Grammar and Sentences. Levels 1–5 follow NSW Stages 1–5. */
RP.registerModule({
  id: "literacy-grammar",
  title: "Literacy: Grammar and Sentences",
  hidden: true, // used inside the Literacy module (literacy.js); kept so older plans still work
  icon: "🧩",
  about: "Build sentences, join ideas, use the right tense and put paragraphs in order.",
  levels: [
    {
      level: 1, title: "Level 1", about: "Building simple sentences",
      items: [
        { type: "order", q: "Put the words in order to make a sentence.", cards: ["The", "dog", "ran", "fast."] },
        { type: "mc", q: "Which one is a sentence?", choices: ["the big red", "The cat sat on the mat.", "on the mat", "ran and"], answer: 1 },
        { type: "sort", q: "Is it telling or asking?", buckets: ["Telling", "Asking"], cards: [
          { text: "I like pizza.", bucket: 0 }, { text: "It is raining.", bucket: 0 },
          { text: "Do you like pizza?", bucket: 1 }, { text: "Is it raining?", bucket: 1 }
        ] },
        { type: "mc", q: "Pick the doing word: \"The bird ___ in the sky.\"", choices: ["blue", "flies", "tree", "happy"], answer: 1 },
        { type: "mc", q: "Which word joins the ideas? \"I have a cat ___ a dog.\"", choices: ["and", "the", "is", "on"], answer: 0 },
        { type: "order", q: "Put the words in order to make a question.", cards: ["Can", "I", "have", "a", "drink?"] }
      ]
    },
    {
      level: 2, title: "Level 2", about: "Joining words and tense",
      items: [
        { type: "mc", q: "Which joining word fits best? \"I was hungry, ___ I ate an apple.\"", choices: ["but", "so", "or", "because"], answer: 1 },
        { type: "mc", q: "Which joining word fits best? \"I wanted to play, ___ it was raining.\"", choices: ["so", "and", "but", "because"], answer: 2 },
        { type: "input", q: "Yesterday I ___ to the shop. (walk)", answer: "walked", text: true },
        { type: "mc", q: "Which word fits? \"The dogs ___ barking.\"", choices: ["is", "are", "am", "was"], answer: 1 },
        { type: "sort", q: "Is each verb in the past or present?", buckets: ["Past", "Present"], cards: [
          { text: "jumped", bucket: 0 }, { text: "ate", bucket: 0 }, { text: "went", bucket: 0 },
          { text: "jumps", bucket: 1 }, { text: "eats", bucket: 1 }, { text: "goes", bucket: 1 }
        ] },
        { type: "order", q: "Put the words in order.", cards: ["After", "school,", "we", "played", "soccer."] }
      ]
    },
    {
      level: 3, title: "Level 3", about: "Better sentences and paragraphs",
      items: [
        { type: "mc", q: "Which sentence joins the ideas best? \"It was cold. We went swimming.\"", choices: ["It was cold we went swimming.", "Although it was cold, we went swimming.", "It was cold because we went swimming.", "It was cold, swimming."], answer: 1 },
        { type: "input", q: "Change to past tense: \"She runs to school.\" (Type the whole sentence.)", answer: "She ran to school.", accept: ["She ran to school"], text: true },
        { type: "mc", q: "Which word is an adverb (tells how)? \"He spoke quietly to his friend.\"", choices: ["He", "spoke", "quietly", "friend"], answer: 2 },
        { type: "mc", q: "Which pronoun fits? \"Mia and I went to the shop. ___ bought bread.\"", choices: ["Us", "We", "Them", "Her"], answer: 1 },
        { type: "order", q: "Put the sentences in order to make a paragraph.", cards: [
          "Making a sandwich is easy.",
          "First, take two slices of bread.",
          "Next, spread on butter and add your fillings.",
          "Finally, put the slices together and cut it in half."
        ] },
        { type: "mc", q: "Which is the best opening for a recount of a school excursion?", choices: ["The end.", "Last Tuesday, our class went to the museum.", "Museums are buildings.", "I like dogs."], answer: 1 }
      ]
    },
    {
      level: 4, title: "Level 4", about: "Clauses, fragments and topic sentences",
      items: [
        { type: "sort", q: "Is it a complete sentence or a fragment?", buckets: ["Complete sentence", "Fragment"], cards: [
          { text: "The bell rang.", bucket: 0 }, { text: "We packed up our books.", bucket: 0 }, { text: "Although I tried my best, I didn't finish.", bucket: 0 },
          { text: "Because I was late.", bucket: 1 }, { text: "Running down the hall.", bucket: 1 }, { text: "After the lesson ended.", bucket: 1 }
        ] },
        { type: "mc", q: "Which sentence is in the active voice?", choices: ["The window was broken by the ball.", "The ball broke the window.", "The window had been broken.", "Mistakes were made."], answer: 1 },
        { type: "mc", q: "Which is the topic sentence of this paragraph? \"Exercise improves your mood. It releases chemicals that make you feel good. It can also help you sleep.\"", choices: ["Exercise improves your mood.", "It releases chemicals that make you feel good.", "It can also help you sleep."], answer: 0 },
        { type: "mc", q: "Which word best starts the second sentence? \"Phones can be useful. ___, they can also be distracting.\"", choices: ["Therefore", "However", "Firstly", "Because"], answer: 1 },
        { type: "order", q: "Put the sentences in order to make a paragraph.", cards: [
          "School uniforms have several benefits.",
          "Firstly, they make getting ready in the morning quicker.",
          "Secondly, they help students feel part of the school.",
          "For these reasons, uniforms are worth keeping."
        ] },
        { type: "input", q: "Fix this fragment by joining it to a sentence: \"Because I was tired.\" + \"I went to bed early.\" (Start with \"I\".)", answer: "I went to bed early because I was tired.", accept: ["I went to bed early because I was tired"], text: true }
      ]
    },
    {
      level: 5, title: "Level 5", about: "Modality, cohesion and persuasive structure",
      items: [
        { type: "sort", q: "Is each word high or low modality (how certain it sounds)?", buckets: ["High modality", "Low modality"], cards: [
          { text: "must", bucket: 0 }, { text: "definitely", bucket: 0 }, { text: "certainly", bucket: 0 },
          { text: "might", bucket: 1 }, { text: "possibly", bucket: 1 }, { text: "could", bucket: 1 }
        ] },
        { type: "match", q: "Match each connective to its job.", pairs: [
          { left: "however", right: "shows a contrast" },
          { left: "therefore", right: "shows a result" },
          { left: "furthermore", right: "adds another point" },
          { left: "for example", right: "introduces evidence" }
        ] },
        { type: "order", q: "Put this persuasive paragraph in order (PEEL: point, evidence, explanation, link).", cards: [
          "Schools should start later in the morning.",
          "Research shows teenagers' body clocks shift later in adolescence.",
          "This means early starts leave many students tired and unable to focus.",
          "A later start would help students learn and behave better."
        ] },
        { type: "mc", q: "Why might a writer use the passive voice: \"Mistakes were made\"?", choices: ["To make the sentence longer", "To avoid saying who made the mistakes", "Because it's always more correct", "To add a question"], answer: 1 },
        { type: "mc", q: "Which sentence has a consistent (parallel) structure?", choices: ["I like reading, to swim and running.", "I like reading, swimming and running.", "I like to read, swimming and run.", "I like read, swim and running."], answer: 1 },
        { type: "mc", q: "Which sentence is most suitable for a formal essay?", choices: ["Heaps of kids reckon phones are bad.", "Many students believe phones can be distracting.", "Phones are, like, totally bad.", "Everyone knows phones suck."], answer: 1 }
      ]
    }
  ]
});
