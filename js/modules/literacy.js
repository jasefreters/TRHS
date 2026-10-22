/*
  Literacy: one half-hour module that puts the four literacy parts together. Students choose a
  level (1–5, NSW Stages 1–5) and get, at that level: the reading passage and its first questions,
  then a few vocabulary, spelling and punctuation, and grammar questions. The questions themselves
  live in the four literacy-*.js files; change how many come from each part here.
*/
(function () {
  const PARTS = [
    { id: "literacy-reading", take: 5 },   // the passage plus its first 4 questions
    { id: "literacy-vocab", take: 3 },
    { id: "literacy-spelling", take: 3 },
    { id: "literacy-grammar", take: 3 }
  ];
  const levelOf = (id, n) => RP.MODULES[id].levels.find(l => l.level === n);
  RP.registerModule({
    id: "literacy",
    title: "Literacy",
    icon: "📖",
    about: "Read a short text and answer questions about it, then some questions on words, spelling and punctuation, and sentences. Choose the level that suits you. Use **Back to the text** to look at the reading again.\n\nAbout 30 minutes.",
    levels: [1, 2, 3, 4, 5].map(n => ({
      level: n,
      title: "Level " + n,
      about: levelOf("literacy-reading", n).about,
      items: PARTS.flatMap(p => levelOf(p.id, n).items.slice(0, p.take))
    }))
  });
})();
