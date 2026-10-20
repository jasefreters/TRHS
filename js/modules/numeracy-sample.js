/* Sample numeracy elective with three levels. To be replaced by the Daily Dash-style activities. */
RP.registerModule({
  id: "numeracy",
  title: "Numeracy",
  icon: "🔢",
  sample: true,
  about: "Work through a set of maths questions at your level. Check each answer as you go. You can have more than one try.",
  levels: [
    {
      level: 1, title: "Level 1", about: "Whole numbers and times tables",
      items: [
        { type: "input", q: "6 × 7 = ?", answer: "42" },
        { type: "input", q: "345 + 278 = ?", answer: "623" },
        { type: "mc", q: "Which number is the largest?", choices: ["0.5", "0.45", "0.405", "0.054"], answer: 0, explain: "0.5 is the same as 0.500, which is bigger than 0.450, 0.405 and 0.054." },
        { type: "input", q: "1000 − 368 = ?", answer: "632" },
        { type: "input", q: "A pack has 8 pencils. How many pencils are in 6 packs?", answer: "48", suffix: "pencils" },
        { type: "mc", q: "What is half of 90?", choices: ["40", "45", "50", "55"], answer: 1 }
      ]
    },
    {
      level: 2, title: "Level 2", about: "Fractions, decimals, percentages and money",
      items: [
        { type: "input", q: "What is 3/4 of 20?", answer: "15" },
        { type: "input", q: "12.5 + 7.75 = ?", answer: "20.25" },
        { type: "mc", q: "Which fraction is equal to 0.25?", choices: ["1/2", "1/4", "2/5", "1/25"], answer: 1 },
        { type: "input", q: "What is 25% of 80?", answer: "20" },
        { type: "input", q: "Movie tickets cost $14.50 each. How much do 4 tickets cost?", answer: "58", accept: ["58.00"], prefix: "$" },
        { type: "input", q: "144 ÷ 12 = ?", answer: "12" }
      ]
    },
    {
      level: 3, title: "Level 3", about: "Integers, equations, area and percentages",
      items: [
        { type: "input", q: "−5 + 12 = ?", answer: "7" },
        { type: "input", q: "Solve 3x + 4 = 19. What is x?", answer: "5", prefix: "x =" },
        { type: "input", q: "A rectangle is 8 cm long and 6.5 cm wide. What is its area?", answer: "52", suffix: "cm²" },
        { type: "mc", q: "Write 18/24 in simplest form.", choices: ["6/8", "3/4", "9/12", "2/3"], answer: 1, explain: "Divide the top and bottom by 6." },
        { type: "input", q: "A $60 jacket is 30% off. What is the sale price?", answer: "42", accept: ["42.00"], prefix: "$" },
        { type: "input", q: "What is the mean (average) of 4, 7, 9 and 12?", answer: "8", explain: "4 + 7 + 9 + 12 = 32, and 32 ÷ 4 = 8." }
      ]
    }
  ]
});
