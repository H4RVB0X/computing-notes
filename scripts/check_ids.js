#!/usr/bin/env node
/* Checks that every quiz and exam question has a unique stable id.
 *
 * Ids are stamped in js/core.js from the topic and a hash of the question text (and code), so two questions
 * with identical text in one topic would collide. Progress, the mistakes deck and reports all key on these ids.
 * Fix a collision by giving one of the questions an explicit `id: "<topic>/q-something"`.
 *
 * Usage:  node scripts/check_ids.js      exit code 1 on any duplicate
 */
const vm = require("vm"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "site");
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "js", "core.js"), "utf8"), ctx);
for (const dir of ["quizzes", "exam"])
  for (const f of fs.readdirSync(path.join(root, "content", dir)).sort())
    vm.runInContext(fs.readFileSync(path.join(root, "content", dir, f), "utf8"), ctx, { filename: dir + "/" + f });

const seen = new Map();
let total = 0, dupes = 0;
for (const reg of [ctx.CS.quizzes, ctx.CS.exams])
  for (const qs of Object.values(reg))
    qs.forEach((q, n) => {
      total++;
      if (seen.has(q.id)) {
        dupes++;
        console.log(`DUPLICATE ${q.id}: "${String(q.q).slice(0, 70)}" (also used by "${String(seen.get(q.id).q).slice(0, 70)}")`);
      } else seen.set(q.id, q);
    });
console.log(`${total} questions, ${seen.size} unique ids, ${dupes} duplicate(s)`);
process.exit(dupes ? 1 : 0);
