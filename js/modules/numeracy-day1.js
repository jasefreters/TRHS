/*
  Numeracy Day 1: about 30 minutes. Each level is an NSW Stage: Level 1 = Stage 1 (Years 1–2)
  up to Level 5 = Stage 5 (Years 9–10). Levels 2 and 3 come from The Daily Dash (numeracy-dash.js,
  built by tools/dash-numeracy.js); Levels 1, 4 and 5 are written here.
*/
(function () {
  const STAGE = { 2: "Stage 2 (Years 3–4)", 3: "Stage 3 (Years 5–6)" };
  const dashLevels = day => [2, 3].filter(n => RP.DASH_NUMERACY && RP.DASH_NUMERACY[day][n])
    .map(n => ({ level: n, title: "Level " + n, about: STAGE[n] + ", from The Daily Dash", items: RP.DASH_NUMERACY[day][n] }));
RP.registerModule({
  id: "numeracy-day1",
  title: "Numeracy: Day 1",
  icon: "🔢",
  about: "Maths questions at your level. Choose your level, then check each answer as you go. You can have more than one try.\n\nAbout 30 minutes.",
  levels: [
    {
      level: 1, title: "Level 1", about: "Stage 1 (Years 1–2): adding, subtracting, place value and patterns",
      items: [
        { type: "input", q: "5 + 4 = ?", answer: "9" },
        { type: "input", q: "10 − 3 = ?", answer: "7" },
        { type: "input", q: "8 + 7 = ?", answer: "15" },
        { type: "mc", q: "Which number is 10 more than 34?", choices: ["35", "44", "24", "340"], answer: 1 },
        { type: "order", q: "Put these numbers in order from smallest to largest.", cards: ["19", "27", "45", "72"] },
        { type: "input", q: "What number comes next? 2, 4, 6, 8, ___", answer: "10" },
        { type: "mc", q: "In the number 56, what does the 5 stand for?", choices: ["5 ones", "5 tens", "5 hundreds", "56 ones"], answer: 1 },
        { type: "input", q: "Double 6 = ?", answer: "12" },
        { type: "input", q: "Half of 10 = ?", answer: "5" },
        { type: "input", q: "There are 3 bags with 5 apples in each bag. How many apples are there altogether?", answer: "15", suffix: "apples" },
        { type: "mc", q: "Which number is the same as 20 + 7?", choices: ["207", "27", "72", "9"], answer: 1 },
        { type: "input", q: "You have 20 cents and spend 5 cents. How much is left?", answer: "15", suffix: "cents" }
      ]
    },
  ].concat(dashLevels("day1"), [
    {
      level: 4, title: "Level 4", about: "Stage 4 (Years 7–8): Integers, decimals, fractions and percentages",
      items: [
        { type: "input", q: "15 × 12 = ?", answer: "180" },
        { type: "input", q: "1000 − 457 = ?", answer: "543" },
        { type: "input", q: "864 ÷ 4 = ?", answer: "216" },
        { type: "input", q: "−5 + 12 = ?", answer: "7" },
        { type: "input", q: "−3 − 6 = ?", answer: "-9", accept: ["−9"] },
        { type: "input", q: "Round 3.476 to one decimal place.", answer: "3.5" },
        { type: "mc", q: "Which number is the largest?", choices: ["0.7", "0.65", "0.072", "0.699"], answer: 0, explain: "0.7 is the same as 0.700." },
        { type: "input", q: "What is 25% of 80?", answer: "20" },
        { type: "input", q: "Write 3/5 as a percentage.", answer: "60", suffix: "%" },
        { type: "order", q: "Put these in order from smallest to largest.", cards: ["0.3", "2/5", "45%", "1/2"], explain: "0.3, then 2/5 = 0.4, then 45% = 0.45, then 1/2 = 0.5." },
        { type: "input", q: "A $60 hoodie is reduced by 10%. What is the sale price?", answer: "54", prefix: "$" },
        { type: "input", q: "3/4 of 28 = ?", answer: "21" },
        { type: "sort", q: "Is each number prime or composite?", buckets: ["Prime", "Composite"], cards: [{ text: "7", bucket: 0 }, { text: "11", bucket: 0 }, { text: "13", bucket: 0 }, { text: "9", bucket: 1 }, { text: "15", bucket: 1 }, { text: "21", bucket: 1 }] }
      ]
    },
    {
      level: 5, title: "Level 5", about: "Stage 5 (Years 9–10): Powers, order of operations, fractions and percentage change",
      items: [
        { type: "input", q: "2³ × 5 = ?", answer: "40" },
        { type: "input", q: "√144 = ?", answer: "12" },
        { type: "input", q: "−4 × −6 = ?", answer: "24" },
        { type: "input", q: "−36 ÷ 9 = ?", answer: "-4", accept: ["−4"] },
        { type: "input", q: "3 + 4 × (10 − 2) = ?", answer: "35", explain: "Brackets first (8), then multiply (32), then add." },
        { type: "mc", q: "Which is 45 000 in scientific notation?", choices: ["4.5 × 10³", "4.5 × 10⁴", "45 × 10³", "0.45 × 10⁵"], answer: 1, explain: "Scientific notation has one digit before the decimal point: 4.5 × 10 000." },
        { type: "input", q: "Increase $80 by 15%.", answer: "92", prefix: "$" },
        { type: "input", q: "A phone was $500 and is now $400. What is the percentage decrease?", answer: "20", suffix: "%" },
        { type: "input", q: "2/3 + 1/4 = ? (Write it as a fraction, like 5/6.)", answer: "11/12", text: true },
        { type: "input", q: "Simplify 18/24.", answer: "3/4", text: true },
        { type: "input", q: "What is the highest common factor (HCF) of 24 and 36?", answer: "12" },
        { type: "mc", q: "Which is the best estimate of 7.96 × 3.04?", choices: ["18", "21", "24", "27"], answer: 2, explain: "Round to 8 × 3 = 24." },
        { type: "input", q: "$1200 is shared in the ratio 1 : 3. How much is the larger share?", answer: "900", prefix: "$" }
      ]
    }
  ])
});
})();
