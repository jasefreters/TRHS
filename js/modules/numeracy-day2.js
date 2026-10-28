/*
  Numeracy Day 2: about 30 minutes. Level N matches NSW Stage N (staff
  know this; it isn't shown anywhere on the site). Levels 2 and 3 come from The Daily Dash (numeracy-dash.js,
  built by tools/dash-numeracy.js); Levels 1, 4 and 5 are written here. Students and staff see only
  "Level N" and the "about" text.
*/
(function () {
  const dashLevels = day => [2, 3].filter(n => RP.DASH_NUMERACY && RP.DASH_NUMERACY[day][n])
    .map(n => ({ level: n, title: "Level " + n, about: "Mixed review", items: RP.DASH_NUMERACY[day][n] }));
RP.registerModule({
  id: "numeracy-day2",
  title: "Numeracy: Day 2",
  icon: "📏",
  about: "Maths questions at your level. Choose your level, then check each answer as you go. You can have more than one try.\n\nAbout 30 minutes.",
  levels: [
    {
      level: 1, title: "Level 1", about: "Time, length, mass, shapes and data",
      items: [
        { type: "mc", q: "Which is the longest?", choices: ["A pencil", "A bus", "A shoe", "A book"], answer: 1 },
        { type: "mc", q: "How many days are in a week?", choices: ["5", "6", "7", "10"], answer: 2 },
        { type: "mc", q: "Which time is **half past 3**?", choices: ["3:00", "3:30", "4:30", "3:15"], answer: 1 },
        { type: "mc", q: "Which day comes after Monday?", choices: ["Sunday", "Tuesday", "Wednesday", "Friday"], answer: 1 },
        { type: "input", q: "How many sides does a triangle have?", answer: "3", suffix: "sides" },
        { type: "input", q: "How many corners does a square have?", answer: "4", suffix: "corners" },
        { type: "mc", q: "Which shape has no corners?", choices: ["Square", "Triangle", "Circle", "Rectangle"], answer: 2 },
        { type: "mc", q: "Which one holds the most water?", choices: ["A cup", "A bucket", "A spoon", "A bottle cap"], answer: 1 },
        { type: "mc", q: "Which one is the heaviest?", choices: ["A feather", "A leaf", "A brick", "A sheet of paper"], answer: 2 },
        { type: "input", q: "In a class vote, 6 children like dogs best and 4 like cats best. How many children voted?", answer: "10", suffix: "children" },
        { type: "input", q: "6 children like dogs best and 4 like cats best. How many more like dogs than cats?", answer: "2", suffix: "more" },
        { type: "mc", q: "Which month comes after March?", choices: ["February", "April", "May", "June"], answer: 1 }
      ]
    },
  ].concat(dashLevels("day2"), [
    {
      level: 4, title: "Level 4", about: "Converting units, statistics, ratio and simple equations",
      items: [
        { type: "input", q: "Convert 2.5 km to metres.", answer: "2500", suffix: "m" },
        { type: "input", q: "Convert 350 cm to metres.", answer: "3.5", suffix: "m" },
        { type: "input", q: "A triangle has a base of 10 cm and a height of 6 cm. What is its area?", answer: "30", suffix: "cm²", explain: "Half of base × height: ½ × 10 × 6 = 30." },
        { type: "input", q: "Find the mean of 12, 15, 9, 20 and 14.", answer: "14", explain: "The total is 70, and 70 ÷ 5 = 14." },
        { type: "input", q: "Find the median of 3, 8, 5, 12, 7.", answer: "7", explain: "In order: 3, 5, 7, 8, 12. The middle one is 7." },
        { type: "input", q: "Find the range of 14, 22, 9, 30, 17.", answer: "21", explain: "30 − 9 = 21." },
        { type: "input", q: "Simplify the ratio 12 : 18. (Write it like 1:2.)", answer: "2:3", text: true },
        { type: "input", q: "A recipe uses 2 cups of flour for 12 biscuits. How many cups for 36 biscuits?", answer: "6", suffix: "cups" },
        { type: "input", q: "Solve x + 7 = 15.", answer: "8", prefix: "x =" },
        { type: "input", q: "Solve 3x = 27.", answer: "9", prefix: "x =" },
        { type: "mc", q: "A bus leaves at 10:45 and the trip takes 50 minutes. When does it arrive?", choices: ["11:25", "11:35", "11:45", "11:15"], answer: 1 },
        { type: "input", q: "What is the chance of rolling a 6 on a normal die? Write it as a fraction.", answer: "1/6", text: true },
        { type: "input", q: "A car travels 240 km in 3 hours. What is its average speed?", answer: "80", suffix: "km/h" }
      ]
    },
    {
      level: 5, title: "Level 5", about: "Circles, volume, Pythagoras, algebra and probability",
      items: [
        { type: "input", q: "Find the area of a circle with radius 5 cm, to the nearest whole number. (Use π ≈ 3.14.)", answer: "79", accept: ["78.5"], suffix: "cm²", explain: "3.14 × 5 × 5 = 78.5, which rounds to 79." },
        { type: "input", q: "Find the volume of a rectangular prism 4 cm × 5 cm × 6 cm.", answer: "120", suffix: "cm³" },
        { type: "input", q: "A right-angled triangle has shorter sides of 6 cm and 8 cm. How long is the hypotenuse?", answer: "10", suffix: "cm", explain: "6² + 8² = 36 + 64 = 100, and √100 = 10." },
        { type: "input", q: "Solve 2x + 5 = 17.", answer: "6", prefix: "x =" },
        { type: "input", q: "Solve 5(x − 2) = 30.", answer: "8", prefix: "x =" },
        { type: "input", q: "Expand 3(2a + 4).", answer: "6a+12", accept: ["12+6a"], text: true },
        { type: "input", q: "Simplify 4m + 3n − m + 2n.", answer: "3m+5n", accept: ["5n+3m"], text: true },
        { type: "input", q: "What is the gradient of the line through (1, 2) and (3, 8)?", answer: "3", explain: "Rise ÷ run = (8 − 2) ÷ (3 − 1) = 6 ÷ 2 = 3." },
        { type: "input", q: "$2000 earns 5% simple interest per year. How much interest after 3 years?", answer: "300", prefix: "$" },
        { type: "mc", q: "Two coins are flipped. What is the probability of getting two heads?", choices: ["1/2", "1/3", "1/4", "1/8"], answer: 2, explain: "The outcomes are HH, HT, TH, TT: one of four." },
        { type: "input", q: "The mean of five numbers is 12. Four of them are 10, 14, 9 and 15. What is the fifth?", answer: "12", explain: "The total must be 5 × 12 = 60, and 10 + 14 + 9 + 15 = 48." },
        { type: "input", q: "A 1.5 L bottle fills glasses of 250 mL. How many glasses?", answer: "6", suffix: "glasses" },
        { type: "input", q: "How many hours does it take to travel 150 km at 60 km/h?", answer: "2.5", suffix: "hours" }
      ]
    }
  ])
});
})();
