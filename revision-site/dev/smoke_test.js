// Headless smoke test: visit every route, record console errors, click through quiz/flashcards/tools.
const { chromium } = require("playwright");
const path = require("path");
const SITE = "file://" + path.resolve(process.argv[2] || "/home/user/computing-notes/revision-site/index.html");
const SHOT = process.argv[3] || require("os").tmpdir();
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push("[console] " + m.text()); });
  page.on("pageerror", (e) => errors.push("[pageerror] " + e.message));
  await page.goto(SITE, { waitUntil: "load" });
  await page.waitForFunction(() => window.CS && Object.keys(window.CS.topics || {}).length >= 0 && document.querySelectorAll('#nav .nav-group').length > 0, null, { timeout: 15000 });
  const routes = JSON.parse(await page.evaluate(() => {
    const r = ["#/", "#/tools", "#/flashcards", "#/mock", "#/checklist", "#/glossary", "#/progress", "#/search/stack"];
    CS.allTopicIds().forEach((id) => { if (CS.topics[id]) r.push("#/topic/" + id); if (CS.quizzes[id]) r.push("#/quiz/" + id); if (CS.exams[id]) r.push("#/exam/" + id); if (CS.flashcards[id] || CS.topics[id]) r.push("#/flashcards/" + id); if (CS.tracesByTopic[id]) r.push("#/trace/" + id); });
    Object.keys(CS.tools).forEach((t) => r.push("#/tool/" + t));
    return JSON.stringify(r);
  }));
  const report = [];
  for (const r of routes) {
    const before = errors.length;
    await page.evaluate((h) => { location.hash = h; }, r);
    await page.waitForTimeout(120);
    const text = await page.evaluate(() => document.getElementById("content").innerText.slice(0, 80).replace(/\s+/g, " "));
    const missing = await page.evaluate(() => Array.from(document.querySelectorAll(".tool-missing")).map((x) => x.textContent));
    const wrongs = await page.evaluate(() => Array.from(document.querySelectorAll(".err")).map((x) => x.textContent));
    report.push({ route: r, errors: errors.slice(before), text, missing, toolErrors: wrongs });
  }
  // interact: quiz — answer every question using DOM-type detection
  await page.evaluate(() => { location.hash = "#/quiz/2.3"; });
  await page.waitForTimeout(150);
  await page.click("button:has-text('Start quiz')");
  for (let i = 0; i < 40; i++) {
    const q = await page.$(".quiz-q");
    if (!q) break;
    if (await q.$(".order-list")) { await (await q.$("button:has-text('Check order')")).click(); }
    else if (await q.$(".code-lines")) { await (await q.$(".code-lines .cl")).click(); }
    else if (await q.$("input[type=text]")) { await (await q.$("input[type=text]")).fill("underflow"); await (await q.$("button:has-text('Check')")).click(); }
    else if (await q.$(".opt")) { await (await q.$(".opt")).click(); const multi = await q.$("button:has-text('Check answer')"); if (multi) await multi.click(); }
    await page.waitForTimeout(40);
    const fb = await q.$(".feedback");
    if (!fb) { console.log("no feedback on question", i + 1); break; }
    const next = await page.$("button:has-text('Next question'), button:has-text('See results')");
    if (!next) break;
    await next.click();
    await page.waitForTimeout(40);
  }
  const quizEnd = await page.evaluate(() => document.querySelector(".quiz-summary") ? document.querySelector(".quiz-summary .big").textContent : "no summary");
  // flashcards
  await page.evaluate(() => { location.hash = "#/flashcards/2.3"; });
  await page.waitForTimeout(100);
  await page.click("text=Practise all cards");
  await page.click(".flashcard");
  await page.click("text=Got it");
  const flashOk = await page.evaluate(() => !!document.querySelector(".flashcard"));
  // trace
  await page.evaluate(() => { location.hash = "#/trace/2.3"; });
  await page.waitForTimeout(100);
  await page.click("text=Show answers");
  await page.click("text=Check");
  // tool
  await page.evaluate(() => { location.hash = "#/tool/stack-demo"; });
  await page.waitForTimeout(100);
  await page.fill(".tool input[type=text]", "7");
  await page.click(".tool button:has-text('Push')");
  await page.click(".tool button:has-text('Pop')");
  const toolLog = await page.evaluate(() => document.querySelector(".tool .output").textContent.split("\n")[0]);
  // screenshots
  await page.evaluate(() => { location.hash = "#/topic/2.3"; });
  await page.waitForTimeout(200);
  await page.screenshot({ path: SHOT + "/topic-light.png", fullPage: false });
  await page.evaluate(() => CS.prefs.toggleTheme());
  await page.waitForTimeout(100);
  await page.screenshot({ path: SHOT + "/topic-dark.png", fullPage: false });
  await page.evaluate(() => { location.hash = "#/"; });
  await page.waitForTimeout(200);
  await page.screenshot({ path: SHOT + "/home.png" });
  await page.setViewportSize({ width: 390, height: 800 });
  await page.evaluate(() => { location.hash = "#/topic/2.3"; });
  await page.waitForTimeout(200);
  await page.screenshot({ path: SHOT + "/topic-mobile.png" });
  const bad = report.filter((r) => r.errors.length || r.missing.length || r.toolErrors.length);
  console.log("routes visited:", report.length);
  console.log("quiz summary:", quizEnd, "| flashcards ok:", flashOk, "| tool log:", toolLog);
  if (bad.length) { console.log("PROBLEMS:"); bad.forEach((b) => console.log(JSON.stringify(b))); }
  else console.log("No console errors, no missing tools.");
  const hs = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log("mobile horizontal scroll:", hs);
  await browser.close();
})().catch((e) => { console.error("TEST FAILED", e); process.exit(1); });
