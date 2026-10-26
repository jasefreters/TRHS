/*
  Saves each RIOT lesson's worksheet (riot-worksheet.html?lesson=N) as a PDF in resources/riot/,
  for the "PDF on laptop" format. Run it after changing js/riot.js:
    python3 -m http.server 8765      (in the repo root, in another terminal)
    node tools/riot-pdfs.js
  Needs Playwright (npm install playwright).
*/
const { chromium } = require("playwright");
const path = require("path");
const BASE = process.env.BASE || "http://localhost:8765/";
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (let n = 1; n <= 8; n++) {
    await page.goto(`${BASE}riot-worksheet.html?lesson=${n}`);
    await page.waitForSelector(".riot-sheet");
    const out = path.join(__dirname, "..", "resources", "riot", `riot-lesson-${n}.pdf`);
    await page.pdf({ path: out, format: "A4", printBackground: true, margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" } });
    console.log("saved", path.relative(process.cwd(), out));
  }
  await browser.close();
})();
