/* Literacy: Vocabulary. Levels 1–5 follow NSW Stages 1–5. */
RP.registerModule({
  id: "literacy-vocab",
  title: "Literacy: Vocabulary",
  icon: "🔤",
  about: "Word meanings, opposites, word parts and choosing the best word. Check each answer as you go.",
  levels: [
    {
      level: 1, title: "Level 1", about: "Same and opposite",
      items: [
        { type: "mc", q: "Which word means the same as **big**?", choices: ["small", "large", "slow", "cold"], answer: 1 },
        { type: "mc", q: "What is the opposite of **hot**?", choices: ["warm", "sunny", "cold", "red"], answer: 2 },
        { type: "match", q: "Match each word to its opposite.", pairs: [
          { left: "up", right: "down" }, { left: "happy", right: "sad" }, { left: "fast", right: "slow" }, { left: "open", right: "closed" }
        ] },
        { type: "sort", q: "Is each word a thing (noun) or an action (verb)?", buckets: ["Thing", "Action"], cards: [
          { text: "dog", bucket: 0 }, { text: "chair", bucket: 0 }, { text: "apple", bucket: 0 },
          { text: "run", bucket: 1 }, { text: "jump", bucket: 1 }, { text: "eat", bucket: 1 }
        ] },
        { type: "mc", q: "I ___ to school every day.", choices: ["walk", "table", "green", "happy"], answer: 0 },
        { type: "input", q: "What is the opposite of **yes**?", answer: "no", text: true },
        { type: "mc", q: "Which word means the same as **shut**?", choices: ["close", "open", "push", "look"], answer: 0 }
      ]
    },
    {
      level: 2, title: "Level 2", about: "Synonyms and compound words",
      items: [
        { type: "match", q: "Match each word to a word that means the same.", pairs: [
          { left: "begin", right: "start" }, { left: "shout", right: "yell" }, { left: "quick", right: "fast" }, { left: "angry", right: "cross" }
        ] },
        { type: "mc", q: "The puppy was **tiny**. Tiny means…", choices: ["very small", "very loud", "very old", "very fast"], answer: 0 },
        { type: "input", q: "foot + ball = ?", answer: "football", text: true },
        { type: "input", q: "sun + flower = ?", answer: "sunflower", text: true },
        { type: "sort", q: "Is each word a noun, a verb or an adjective (describing word)?", buckets: ["Noun", "Verb", "Adjective"], cards: [
          { text: "teacher", bucket: 0 }, { text: "school", bucket: 0 },
          { text: "write", bucket: 1 }, { text: "laugh", bucket: 1 },
          { text: "bright", bucket: 2 }, { text: "noisy", bucket: 2 }
        ] },
        { type: "mc", q: "What is the opposite of **brave**?", choices: ["strong", "scared", "kind", "tall"], answer: 1 },
        { type: "mc", q: "Which word best fits? \"The test was really ___, so I asked for help.\"", choices: ["easy", "tricky", "yellow", "quiet"], answer: 1 }
      ]
    },
    {
      level: 3, title: "Level 3", about: "Prefixes, suffixes and context",
      items: [
        { type: "mc", q: "The prefix **un-** in \"unhappy\" means…", choices: ["very", "not", "again", "before"], answer: 1 },
        { type: "input", q: "Which word means \"to read again\"?", answer: "reread", accept: ["re-read"], text: true },
        { type: "sort", q: "Does the prefix mean \"not\" or \"again\"?", buckets: ["Not", "Again"], cards: [
          { text: "unfair", bucket: 0 }, { text: "dislike", bucket: 0 }, { text: "impossible", bucket: 0 },
          { text: "rewrite", bucket: 1 }, { text: "replay", bucket: 1 }, { text: "rebuild", bucket: 1 }
        ] },
        { type: "mc", q: "\"Careless\" means…", choices: ["full of care", "without care", "caring again", "able to care"], answer: 1, explain: "The suffix -less means \"without\"." },
        { type: "mc", q: "\"The task was **challenging**, but I finished it.\" Challenging means…", choices: ["boring", "difficult", "short", "funny"], answer: 1 },
        { type: "match", q: "Match each word to its meaning.", pairs: [
          { left: "furious", right: "very angry" }, { left: "exhausted", right: "very tired" }, { left: "enormous", right: "very big" }, { left: "terrified", right: "very scared" }
        ] },
        { type: "input", q: "Add a suffix to make **hope** mean \"full of hope\".", answer: "hopeful", text: true }
      ]
    },
    {
      level: 4, title: "Level 4", about: "Word roots, context and tone",
      items: [
        { type: "match", q: "Match each word part to its meaning.", pairs: [
          { left: "bio (biology)", right: "life" }, { left: "tele (telephone)", right: "far" }, { left: "port (transport)", right: "carry" }, { left: "graph (autograph)", right: "write" }
        ] },
        { type: "mc", q: "\"The coach's feedback was **constructive**.\" Constructive means…", choices: ["harsh and unfair", "helpful and meant to improve things", "very long", "about building houses"], answer: 1 },
        { type: "sort", q: "Does each word sound positive or negative?", buckets: ["Positive", "Negative"], cards: [
          { text: "confident", bucket: 0 }, { text: "determined", bucket: 0 }, { text: "curious", bucket: 0 },
          { text: "arrogant", bucket: 1 }, { text: "stubborn", bucket: 1 }, { text: "nosy", bucket: 1 }
        ] },
        { type: "mc", q: "In an assignment, **evaluate** means…", choices: ["copy it out", "judge how good or useful something is", "draw a picture", "list the facts only"], answer: 1 },
        { type: "mc", q: "In an assignment, **compare** means…", choices: ["show how things are alike and different", "say which one you like", "describe one thing", "add things up"], answer: 0 },
        { type: "mc", q: "Which word is the most precise? \"She ___ across the finish line, arms in the air.\"", choices: ["went", "moved", "sprinted", "did"], answer: 2 },
        { type: "input", q: "What is the noun form of **decide**? (A ___ was made.)", answer: "decision", text: true }
      ]
    },
    {
      level: 5, title: "Level 5", about: "Idioms, register and nuance",
      items: [
        { type: "mc", q: "\"I'll just have to **bite the bullet** and apologise.\" This means…", choices: ["eat something hard", "do something difficult you've been avoiding", "get angry", "give up"], answer: 1 },
        { type: "match", q: "Match each idiom to its meaning.", pairs: [
          { left: "on thin ice", right: "close to being in trouble" },
          { left: "the last straw", right: "the final annoyance before losing patience" },
          { left: "break the ice", right: "start a conversation in an awkward situation" },
          { left: "a blessing in disguise", right: "something that seemed bad but turned out good" }
        ] },
        { type: "sort", q: "Is each phrase formal or informal?", buckets: ["Formal", "Informal"], cards: [
          { text: "I would like to request an extension.", bucket: 0 },
          { text: "Thank you for your consideration.", bucket: 0 },
          { text: "Please find my assignment attached.", bucket: 0 },
          { text: "Can I get more time?", bucket: 1 },
          { text: "Cheers for that.", bucket: 1 },
          { text: "Here's my stuff.", bucket: 1 }
        ] },
        { type: "mc", q: "An **ambiguous** instruction is one that…", choices: ["is very short", "could have more than one meaning", "is written in capitals", "is always ignored"], answer: 1 },
        { type: "mc", q: "Which word has the strongest meaning?", choices: ["dislike", "disapprove", "loathe", "mind"], answer: 2 },
        { type: "mc", q: "\"The principal's decision was **controversial**.\" This means…", choices: ["everyone agreed with it", "people strongly disagreed about it", "it was made quickly", "it was secret"], answer: 1 },
        { type: "input", q: "Write the adjective form of **responsibility**. (She is very ___.)", answer: "responsible", text: true }
      ]
    }
  ]
});
