#!/usr/bin/env node
/* Unit tests for the progress merge used by cloud sync (site/js/sync.js).
 * Usage: node scripts/check_sync_merge.js   (exit code 1 on failure)
 */
const vm = require("vm"), fs = require("fs"), path = require("path"), assert = require("assert");
const root = path.join(__dirname, "..", "site");
const ctx = { console, location: { protocol: "file:" }, document: { addEventListener() {} } };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ["js/config.js", "js/core.js", "js/sync.js"]) vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx);
const merge = ctx.CS.sync.merge;
const plain = (x) => JSON.parse(JSON.stringify(x));
let n = 0;
const t = (name, fn) => {
  try { fn(); n++; } catch (e) { console.error("FAIL " + name + "\n  " + e.message); process.exitCode = 1; }
};

t("best scores and furthest reading win", () => {
  const m = plain(merge({ topics: { "1.1": { quizBest: 60, read: 1 } } }, { topics: { "1.1": { quizBest: 80, read: 0.4 }, "2.1": { quizBest: 50 } } }));
  assert.deepStrictEqual(m.topics, { "1.1": { quizBest: 80, read: 1 }, "2.1": { quizBest: 50 } });
});
t("checklist ticks are combined", () => {
  assert.deepStrictEqual(plain(merge({ checklist: { a: true, b: false } }, { checklist: { b: true, c: true } })).checklist, { a: true, b: true, c: true });
});
t("flashcard with more reviews wins", () => {
  const m = plain(merge({ flash: { c1: { box: 2, due: 5, seen: 3 } } }, { flash: { c1: { box: 1, due: 9, seen: 4 } } }));
  assert.deepStrictEqual(m.flash.c1, { box: 1, due: 9, seen: 4 });
});
t("ticked mark-scheme points combine element-wise", () => {
  assert.deepStrictEqual(plain(merge({ exam: { "1": { "7": { "x_pts": [1, 0, 0] } } } }, { exam: { "1": { "7": { "x_pts": [0, 0, 1] } } } })).exam["1"]["7"].x_pts, [1, 0, 1]);
});
t("histories are combined by time without duplicates", () => {
  const m = plain(merge({ mocks: [{ t: 1 }, { t: 3 }] }, { mocks: [{ t: 2 }, { t: 3 }] }));
  assert.deepStrictEqual(m.mocks.map((x) => x.t), [1, 2, 3]);
});
t("text: this device's wins unless it's empty", () => {
  assert.deepStrictEqual(plain(merge({ codeDrafts: { a: "mine", b: "" } }, { codeDrafts: { a: "theirs", b: "theirs" } })).codeDrafts, { a: "mine", b: "theirs" });
});
t("prefs are never taken from the cloud", () => {
  assert.deepStrictEqual(plain(merge({ prefs: { theme: "dark" } }, { prefs: { theme: "light", fontScale: 1.3 } })).prefs, { theme: "dark" });
});
t("a graduated mistake stays gone", () => {
  const m = plain(merge({ mistakes: {}, mistakesGone: { q1: 200 } }, { mistakes: { q1: { box: 2, at: 100 } } }));
  assert.deepStrictEqual(m.mistakes, {});
});
t("a mistake made again after graduating comes back", () => {
  const m = plain(merge({ mistakes: { q1: { box: 1, at: 300 } } }, { mistakesGone: { q1: 200 } }));
  assert.deepStrictEqual(Object.keys(m.mistakes), ["q1"]);
});
t("newest mistake entry wins", () => {
  const m = plain(merge({ mistakes: { q1: { box: 3, at: 100 } } }, { mistakes: { q1: { box: 1, at: 500 } } }));
  assert.strictEqual(m.mistakes.q1.box, 1);
});
t("a full reset beats an older cloud copy (prefs kept)", () => {
  const m = plain(merge({ syncEpoch: 50, prefs: { theme: "dark" } }, { syncEpoch: 0, topics: { "1.1": { quizBest: 90 } } }));
  assert.deepStrictEqual(m, { syncEpoch: 50, prefs: { theme: "dark" } });
});
t("a reset on another device wins over this device's older data", () => {
  const m = plain(merge({ topics: { "1.1": { quizBest: 90 } }, prefs: { theme: "dark" } }, { syncEpoch: 50 }));
  assert.deepStrictEqual(m, { syncEpoch: 50, prefs: { theme: "dark" } });
});
t("live update: incoming text wins", () => {
  assert.deepStrictEqual(plain(merge({ codeDrafts: { a: "old", b: "mine" } }, { codeDrafts: { a: "new", b: "" } }, true)).codeDrafts, { a: "new", b: "mine" });
});
t("live update still keeps best scores from this device", () => {
  assert.strictEqual(plain(merge({ topics: { x: { quizBest: 90 } } }, { topics: { x: { quizBest: 60 } } }, true)).topics.x.quizBest, 90);
});
t("merging is stable: merging the result again changes nothing", () => {
  const a = { topics: { x: { quizBest: 50, read: 1 } }, checklist: { p: true }, codeDrafts: { d: "x" } };
  const b = { topics: { x: { quizBest: 70 } }, checklist: { q: true }, codeDrafts: { d: "y" }, mistakes: { m: { box: 1, at: 5 } } };
  const m = plain(merge(a, b));
  assert.deepStrictEqual(plain(merge(m, b)), m);
  assert.deepStrictEqual(plain(merge(m, m)), m);
});
t("a device that never synced with this account is merged, not wiped by an old reset", () => {
  const m = plain(merge({ topics: { a: { quizBest: 90 } } }, { syncEpoch: 50, topics: { b: { quizBest: 70 } } }, { uid: "u1" }));
  assert.deepStrictEqual(m.topics, { a: { quizBest: 90 }, b: { quizBest: 70 } });
  assert.strictEqual(m.syncEpoch, 50);
});
t("a reset elsewhere still wins over a device that has synced with this account", () => {
  const m = plain(merge({ syncMeta: { uid: "u1" }, topics: { a: { quizBest: 90 } } }, { syncEpoch: 50 }, { uid: "u1" }));
  assert.deepStrictEqual(m, { syncEpoch: 50, syncMeta: { uid: "u1" } });
});
t("a copy last synced with a different account is merged, not replaced", () => {
  const m = plain(merge({ syncMeta: { uid: "other" }, topics: { a: { quizBest: 90 } } }, { syncEpoch: 50 }, { uid: "u1" }));
  assert.strictEqual(m.topics.a.quizBest, 90);
});
t("the newest text edit wins, whichever device it's on", () => {
  const local = { codeDrafts: { d: "old v1" }, textAt: { "codeDrafts.d": 100 } };
  const remote = { codeDrafts: { d: "newer v2" }, textAt: { "codeDrafts.d": 200 } };
  assert.strictEqual(plain(merge(local, remote)).codeDrafts.d, "newer v2");
  assert.strictEqual(plain(merge(remote, local)).codeDrafts.d, "newer v2");
});
t("clearing a draft (start again) beats the older draft in the cloud", () => {
  const m = plain(merge({ codeDrafts: { d: "" }, textAt: { "codeDrafts.d": 300 } }, { codeDrafts: { d: "my code" }, textAt: { "codeDrafts.d": 200 } }));
  assert.strictEqual(m.codeDrafts.d, "");
});
t("exam answers use their full path for edit times", () => {
  const path = "examAnswers.1.7.1.7/e-abc";
  const local = { examAnswers: { 1: { 7: { "1.7/e-abc": "first try" } } }, textAt: { [path]: 1 } };
  const remote = { examAnswers: { 1: { 7: { "1.7/e-abc": "better answer" } } }, textAt: { [path]: 2 } };
  assert.strictEqual(plain(merge(local, remote)).examAnswers[1][7]["1.7/e-abc"], "better answer");
});
t("syncMeta never leaves the device", () => {
  assert.deepStrictEqual(plain(merge({ syncMeta: { uid: "a" } }, { syncMeta: { uid: "b" } })).syncMeta, { uid: "a" });
});
t("merge with nothing in the cloud keeps everything", () => {
  const local = { topics: { "1.1": { quizBest: 10 } }, mistakes: { q: { box: 1, at: 1 } } };
  assert.deepStrictEqual(plain(merge(local, null)).topics, local.topics);
});
console.log(n + " merge tests passed");
