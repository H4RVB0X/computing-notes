#!/usr/bin/env node
/* Checks that every quiz and exam question has a unique stable id.
 *
 * Ids are stamped in js/core.js from the topic and a hash of the question text (and code), so two questions
 * with identical text in one topic would collide. Progress, the mistakes deck and reports all key on these ids.
 * Fix a collision by giving one of the questions an explicit `id: "<topic>/q-something"`.
 *
 * Also fails questions that lean on "the previous question", the notes, or a table/diagram they don't show.
 *
 * Usage:  node scripts/check_ids.js      exit code 1 on any duplicate or non-self-contained question
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

/* Each question must stand alone: quizzes are shuffled and mixed into mocks one question at a time, so a
 * question can't lean on "the previous question", the notes page, or a table/diagram it doesn't include. */
const leans = /\bprevious questions?\b|\b(in|from|on) the notes\b|\b(?:table|tables|diagram|graph|tree|code|program|FSM|database|grammar|figure)\s+(?:above|below)\b/i;
let lonely = 0;
for (const reg of [ctx.CS.quizzes, ctx.CS.exams])
  for (const qs of Object.values(reg))
    qs.forEach((q) => {
      const text = String(q.q);
      const shows = q.code || /\n\s*\|.*\|/.test(text) || /```/.test(text);
      if (leans.test(text) && !(shows && !/previous question|the notes/i.test(text))) {
        lonely++;
        console.log(`NOT SELF-CONTAINED ${q.id}: "${text.slice(0, 100)}"`);
      }
    });
console.log(`${lonely} question(s) refer to something they don't show`);
process.exit(dupes || lonely ? 1 : 0);
