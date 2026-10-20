/* Literacy: Spelling and Punctuation. Levels 1–5 follow NSW Stages 1–5. */
RP.registerModule({
  id: "literacy-spelling",
  title: "Literacy: Spelling and Punctuation",
  icon: "✏️",
  about: "Spot the right spelling, fix punctuation, and use apostrophes and commonly confused words correctly.",
  levels: [
    {
      level: 1, title: "Level 1", about: "Common words, capitals and full stops",
      items: [
        { type: "mc", q: "Which word is spelled correctly?", choices: ["sed", "said", "sayd", "sedd"], answer: 1 },
        { type: "mc", q: "Which word is spelled correctly?", choices: ["thay", "thei", "they", "thy"], answer: 2 },
        { type: "mc", q: "Which sentence is written correctly?", choices: ["my dog is called rex.", "My dog is called Rex.", "my Dog is called rex", "My dog is called rex"], answer: 1, explain: "Sentences start with a capital letter, names have capitals, and sentences end with a full stop." },
        { type: "mc", q: "Which mark goes at the end? \"Where are you going___\"", choices: [". (full stop)", "? (question mark)", ", (comma)", "! (exclamation mark)"], answer: 1 },
        { type: "input", q: "Fill the gap to spell the animal that says \"meow\": c _ t", answer: "cat", accept: ["a"], text: true },
        { type: "sort", q: "Does the word need a capital letter?", buckets: ["Needs a capital", "No capital"], cards: [
          { text: "sydney", bucket: 0 }, { text: "monday", bucket: 0 }, { text: "sam", bucket: 0 },
          { text: "table", bucket: 1 }, { text: "run", bucket: 1 }, { text: "dog", bucket: 1 }
        ] },
        { type: "mc", q: "Which word is spelled correctly?", choices: ["becos", "becuase", "because", "becawse"], answer: 2 }
      ]
    },
    {
      level: 2, title: "Level 2", about: "Plurals, contractions and lists",
      items: [
        { type: "input", q: "Write the plural of **baby** (one baby, two ___).", answer: "babies", text: true },
        { type: "input", q: "Write the plural of **box**.", answer: "boxes", text: true },
        { type: "input", q: "Write the short form (contraction) of **do not**.", answer: "don't", accept: ["don’t"], text: true },
        { type: "mc", q: "Which word fits? \"___ going to the park after school.\"", choices: ["Their", "There", "They're"], answer: 2, explain: "They're = they are." },
        { type: "mc", q: "Which sentence uses commas correctly in a list?", choices: ["I need a pen, a ruler, and, a book.", "I need a pen, a ruler and a book.", "I need, a pen a ruler and a book.", "I need a pen a ruler, and a book"], answer: 1 },
        { type: "mc", q: "Which word is spelled correctly?", choices: ["frend", "freind", "friend", "frende"], answer: 2 },
        { type: "match", q: "Match each pair of words to its contraction.", pairs: [
          { left: "I am", right: "I'm" }, { left: "can not", right: "can't" }, { left: "it is", right: "it's" }, { left: "we will", right: "we'll" }
        ] }
      ]
    },
    {
      level: 3, title: "Level 3", about: "Apostrophes, its/it's and tricky words",
      items: [
        { type: "mc", q: "Which sentence is correct?", choices: ["Its raining outside.", "It's raining outside.", "Its' raining outside."], answer: 1, explain: "It's = it is." },
        { type: "mc", q: "Which sentence is correct?", choices: ["The dog wagged it's tail.", "The dog wagged its tail.", "The dog wagged its' tail."], answer: 1, explain: "Its (no apostrophe) means \"belonging to it\"." },
        { type: "mc", q: "\"The girls' bags were on the bus.\" How many girls are there?", choices: ["One girl", "More than one girl"], answer: 1, explain: "The apostrophe after the s shows the bags belong to more than one girl." },
        { type: "input", q: "Write the past tense of **teach**. (Yesterday she ___ us.)", answer: "taught", text: true },
        { type: "mc", q: "Which is spelled correctly?", choices: ["necessary", "neccessary", "necesary", "nesessary"], answer: 0 },
        { type: "mc", q: "Which sentence uses speech marks correctly?", choices: ["\"Come here, said Mum.\"", "\"Come here,\" said Mum.", "Come here, \"said Mum.\"", "\"Come here\" said, Mum."], answer: 1 },
        { type: "sort", q: "Is each word spelled correctly?", buckets: ["Correct", "Incorrect"], cards: [
          { text: "separate", bucket: 0 }, { text: "different", bucket: 0 }, { text: "beautiful", bucket: 0 },
          { text: "definately", bucket: 1 }, { text: "tommorow", bucket: 1 }, { text: "untill", bucket: 1 }
        ] }
      ]
    },
    {
      level: 4, title: "Level 4", about: "Affect/effect, possessives and dialogue",
      items: [
        { type: "mc", q: "Which word fits? \"Lack of sleep can ___ your mood.\"", choices: ["affect", "effect"], answer: 0, explain: "Affect is usually the verb (the action); effect is usually the noun (the result)." },
        { type: "mc", q: "Which word fits? \"The new rule had a big ___ on the school.\"", choices: ["affect", "effect"], answer: 1 },
        { type: "mc", q: "Which is correct for the results of many students?", choices: ["The student's results were great.", "The students' results were great.", "The students results' were great."], answer: 1 },
        { type: "input", q: "Spell this word correctly: **recieve**", answer: "receive", text: true },
        { type: "mc", q: "Which line of dialogue is punctuated correctly?", choices: ["\"I'm ready\" she said.", "\"I'm ready,\" she said.", "\"I'm ready.\" She said.", "I'm ready, \"she said\"."], answer: 1 },
        { type: "sort", q: "Is each word spelled correctly?", buckets: ["Correct", "Incorrect"], cards: [
          { text: "accommodate", bucket: 0 }, { text: "occasion", bucket: 0 }, { text: "rhythm", bucket: 0 },
          { text: "seperate", bucket: 1 }, { text: "goverment", bucket: 1 }, { text: "wierd", bucket: 1 }
        ] },
        { type: "mc", q: "Where does the comma go? \"When the bell rang the students packed up.\"", choices: ["After \"When\"", "After \"rang\"", "After \"students\"", "No comma is needed"], answer: 1, explain: "The comma goes after the opening clause: \"When the bell rang, the students packed up.\"" }
      ]
    },
    {
      level: 5, title: "Level 5", about: "Semicolons, colons and confusable words",
      items: [
        { type: "mc", q: "Which sentence uses a semicolon correctly?", choices: ["I was tired; so I went to bed.", "I was tired; I went to bed early.", "I was; tired and went to bed.", "I was tired and; went to bed."], answer: 1, explain: "A semicolon joins two complete sentences that are closely related." },
        { type: "mc", q: "Which sentence uses a colon correctly?", choices: ["You will need: three things a pen, a ruler and a calculator.", "You will need three things: a pen, a ruler and a calculator.", "You: will need three things, a pen, a ruler and a calculator."], answer: 1 },
        { type: "mc", q: "Which word fits? \"The school ___ spoke at the assembly.\"", choices: ["principal", "principle"], answer: 0 },
        { type: "mc", q: "Which word fits? \"Honesty is an important ___.\"", choices: ["principal", "principle"], answer: 1 },
        { type: "mc", q: "Which word fits? \"She gave him a ___ on his work.\"", choices: ["complement", "compliment"], answer: 1 },
        { type: "input", q: "Spell this word correctly: **embarass**", answer: "embarrass", text: true },
        { type: "mc", q: "Which is the best way to fix this run-on sentence? \"I was late the bus didn't come.\"", choices: ["I was late, the bus didn't come.", "I was late because the bus didn't come.", "I was late the bus, didn't come.", "I was late the bus didn't come!"], answer: 1 }
      ]
    }
  ]
});
