#!/usr/bin/env node
/* Flags multiple-choice questions whose correct option gives itself away by being longer than the others.
 *
 * A question is FLAGGED when the correct option is more than 15% longer (in visible characters) than the
 * longest wrong option. Per file, the share of MCQs whose answer is the longest option at all should stay
 * near chance: files with 8+ MCQs are warned if it is above 40% or below 15% ("never the longest" is also a tell).
 *
 * Usage:  node scripts/check_quiz_balance.js            summary for every quiz file
 *         node scripts/check_quiz_balance.js 7.5 P.3    list the flagged questions in those files
 * Exit code 1 if any question is flagged (so CI can enforce it).
 */
const vm = require("vm"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "site");
const visible = (s) => String(s).replace(/[`*_]/g, "").replace(/\s+/g, " ").trim();
const only = process.argv.slice(2);

let flaggedTotal = 0, mcqTotal = 0, longestTotal = 0;
const rows = [];
for (const f of fs.readdirSync(path.join(root, "content", "quizzes")).sort()) {
  const ctx = { console, CS: { quizzes: {} } };
  ctx.CS.registerQuiz = (id, qs) => (ctx.CS.quizzes[id] = (ctx.CS.quizzes[id] || []).concat(qs));
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, "content", "quizzes", f), "utf8"), ctx);
  for (const [id, qs] of Object.entries(ctx.CS.quizzes)) {
    let mcq = 0, longest = 0;
    const flagged = [];
    qs.forEach((q, n) => {
      if (q.type !== "mcq" || Array.isArray(q.answer)) return;
      mcq++;
      const L = q.options.map((o) => visible(o).length);
      const a = L[q.answer];
      const maxWrong = Math.max(...L.filter((_, i) => i !== q.answer));
      if (a >= maxWrong) longest++;
      if (a > maxWrong * 1.15) flagged.push({ n: n + 1, a, maxWrong, q: visible(q.q).slice(0, 90) });
    });
    mcqTotal += mcq; longestTotal += longest; flaggedTotal += flagged.length;
    rows.push({ id, mcq, longest, flagged });
  }
}
for (const r of rows) {
  if (only.length && !only.includes(r.id)) continue;
  const pct = r.mcq ? Math.round((100 * r.longest) / r.mcq) : 0;
  const skew = r.mcq >= 8 && (pct > 40 || pct < 15) ? (pct > 40 ? "  ⚠ answer too often the longest" : "  ⚠ answer almost never the longest (also a tell)") : "";
  if (only.length || r.flagged.length || skew)
    console.log(`${r.id.padEnd(5)} MCQs ${String(r.mcq).padStart(3)} · answer longest ${String(pct).padStart(3)}% · flagged ${r.flagged.length}${skew}`);
  if (only.length) r.flagged.forEach((x) => console.log(`   Q${x.n}: answer ${x.a} chars vs longest wrong ${x.maxWrong} — ${x.q}`));
}
console.log(`\nTOTAL: ${mcqTotal} single-answer MCQs · answer is longest in ${Math.round((100 * longestTotal) / mcqTotal)}% (chance ≈ 25%) · flagged ${flaggedTotal}`);
process.exit(flaggedTotal ? 1 : 0);
