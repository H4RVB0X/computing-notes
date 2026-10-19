#!/usr/bin/env python3
"""Validate every content and tool file without a browser.

Checks: files parse as JS; every registered topic/quiz/exam/flashcard/trace id exists in
sections.js; quiz questions have valid schema; trace rows match columns; markdown
directive blocks are balanced; {{tool:}} and {{trace:}} shortcodes refer to registered ids;
internal links point at real topics; Python code blocks are counted.
Run:  python3 scripts/check_content.py   (exit code 1 if any ERROR)
"""
import json, os, re, subprocess, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent / "site"
NODE_SCRIPT = r"""
const vm = require("vm"); const fs = require("fs"); const path = require("path");
const root = process.env.SITE_ROOT;
const ctx = { console, Math, JSON, Date, parseInt, parseFloat, String, Number, Array, Object, RegExp, Error, Set, Map, isNaN, isFinite };
ctx.window = ctx; ctx.document = { createElement(){ return { style:{}, classList:{add(){},remove(){},toggle(){}}, appendChild(){}, append(){}, setAttribute(){}, addEventListener(){} }; }, addEventListener(){}, getElementById(){ return null; }, querySelectorAll(){ return []; } };
ctx.localStorage = { getItem(){ return null; }, setItem(){}, removeItem(){} };
vm.createContext(ctx);
const run = (f) => { try { vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f }); return null; } catch (e) { return e.message; } };
["js/core.js","js/highlight.js","js/markdown.js","content/sections.js"].forEach(f => { const e = run(path.join(root,f)); if (e) { console.log(JSON.stringify({fatal: f + ": " + e})); process.exit(0);} });
const CS = ctx.CS;
const manifestFile = path.join(root, "content/manifest.js");
vm.runInContext(fs.readFileSync(manifestFile, "utf8"), ctx);
const errors = [];
(CS.manifest || []).forEach(f => { const e = run(path.join(root, f)); if (e) errors.push("PARSE " + f + ": " + e); });
const out = { errors, topics: {}, quizzes: {}, exams: {}, flashcards: {}, traces: {}, tools: Object.keys(CS.tools), sections: CS.sections.map(s => ({ id: s.id, topics: s.topics.map(t => t.id) })) };
for (const id in CS.topics) { const t = CS.topics[id]; const ctx2 = { toc: [], keyterms: [] }; let html = ""; try { html = CS.markdown.render(t.md, ctx2); } catch (e) { errors.push("RENDER " + id + ": " + e.message); }
  out.topics[id] = { md: t.md, headings: ctx2.toc.map(x => x.text), keyterms: ctx2.keyterms.length, html }; }
for (const id in CS.quizzes) out.quizzes[id] = CS.quizzes[id];
for (const id in CS.exams) out.exams[id] = CS.exams[id];
for (const id in CS.flashcards) out.flashcards[id] = CS.flashcards[id];
for (const id in CS.traces) out.traces[id] = CS.traces[id];
console.log(JSON.stringify(out));
"""
res = subprocess.run(["node", "-e", NODE_SCRIPT], capture_output=True, text=True, env=dict(os.environ, SITE_ROOT=str(ROOT)))
if res.returncode != 0:
    print("node failed:", res.stderr[:2000]); sys.exit(1)
data = json.loads(res.stdout.strip().splitlines()[-1])
if "fatal" in data:
    print("FATAL:", data["fatal"]); sys.exit(1)
errors = list(data["errors"]); warnings = []
topic_ids = [t for s in data["sections"] for t in s["topics"]]
tools = set(data["tools"]); traces = set(data["traces"].keys())

def err(m): errors.append(m)
def warn(m): warnings.append(m)

for id in data["topics"]:
    if id not in topic_ids: err(f"topic {id} is registered but not listed in sections.js")
for id, t in data["topics"].items():
    md = t["md"]
    # balanced directives
    stack = []
    for n, line in enumerate(md.split("\n"), 1):
        m = re.match(r"^\s*(:{3,})\s*([A-Za-z][\w-]*)", line)
        c = re.match(r"^\s*(:{3,})\s*$", line)
        if m: stack.append((m.group(1), m.group(2), n))
        elif c:
            if stack and stack[-1][0] == c.group(1): stack.pop()
            else: err(f"{id}: closing {c.group(1)} on line {n} does not match an open block (stack={[(s[1], s[2]) for s in stack][-3:]})")
    if stack: err(f"{id}: unclosed directive blocks {[(s[1], s[2]) for s in stack]}")
    # fences balanced
    if md.count("\n```") % 2 == 1: err(f"{id}: odd number of ``` fences")
    for m in re.finditer(r"\{\{tool:([^\s}]+)", md):
        if m.group(1) not in tools: warn(f"{id}: references tool '{m.group(1)}' which is not registered (yet)")
    for m in re.finditer(r"\{\{trace:([^\s}]+)", md):
        if m.group(1) not in traces: err(f"{id}: references trace '{m.group(1)}' which is not registered")
    for m in re.finditer(r"\]\(#/topic/([^)#/]+)", md):
        if m.group(1) not in topic_ids: err(f"{id}: link to unknown topic '{m.group(1)}'")
    # required sections
    low = md.lower()
    for need, label in [(":::objectives", "objectives block"), (":::keyterms", "keyterms block"), (":::recap", "recap block"), (":::trap", "trap (marks are lost here) box"), (":::exam", "exam technique box"), (":::quick", "quick view block")]:
        if need not in low: warn(f"{id}: missing {label}")
    words = len(re.sub(r"<[^>]+>|```[\s\S]*?```", " ", md).split())
    if words < 900: warn(f"{id}: only ~{words} words — probably too thin for A* depth")
    if "<svg" not in low and "{{tool:" not in low: warn(f"{id}: no diagram (svg) or embedded tool")
    if t["keyterms"] < 4: warn(f"{id}: only {t['keyterms']} key terms")
    # wall-of-text check: paragraphs longer than 110 words
    for para in re.split(r"\n\s*\n", re.sub(r"```[\s\S]*?```|<svg[\s\S]*?</svg>", "", md)):
        if not para.strip().startswith(("-", "|", "#", ":", "<", "*", "1", "2", "3", "4", "5", "6", "7", "8", "9")) and len(para.split()) > 110:
            warn(f"{id}: paragraph of {len(para.split())} words starting '{para.strip()[:40]}…' — chunk it")

for id, qs in data["quizzes"].items():
    if id not in topic_ids: err(f"quiz {id}: unknown topic id")
    if len(qs) < 15: warn(f"quiz {id}: only {len(qs)} questions (aim 15-25)")
    for k, q in enumerate(qs):
        t = q.get("type", "mcq"); tag = f"quiz {id} Q{k+1}"
        if not q.get("q"): err(f"{tag}: missing q")
        if not q.get("explain"): warn(f"{tag}: missing explain")
        if t == "mcq":
            opts = q.get("options") or []
            if len(opts) < 3: err(f"{tag}: mcq needs ≥3 options")
            ans = q.get("answer"); al = ans if isinstance(ans, list) else [ans]
            if any((not isinstance(a, int)) or a < 0 or a >= len(opts) for a in al): err(f"{tag}: answer index out of range")
            if len(set(opts)) != len(opts): err(f"{tag}: duplicate options")
        elif t == "truefalse":
            if q.get("answer") not in (0, 1): err(f"{tag}: truefalse answer must be 0 (True) or 1 (False)")
        elif t == "short":
            if not (q.get("answers") or q.get("answer")): err(f"{tag}: short needs answers")
        elif t == "spot":
            lines = str(q.get("code", "")).split("\n"); ans = q.get("answer"); al = ans if isinstance(ans, list) else [ans]
            if not q.get("code"): err(f"{tag}: spot needs code")
            if any((not isinstance(a, int)) or a < 1 or a > len(lines) for a in al): err(f"{tag}: spot answer line out of range")
        elif t == "order":
            if len(q.get("items") or []) < 3: err(f"{tag}: order needs ≥3 items")
        else: err(f"{tag}: unknown type {t}")
        d = q.get("difficulty", 2)
        if d not in (1, 2, 3): err(f"{tag}: difficulty must be 1,2,3")

for id, qs in data["exams"].items():
    if id not in topic_ids: err(f"exam {id}: unknown topic id")
    if len(qs) < 4: warn(f"exam {id}: only {len(qs)} exam questions (aim 5-8)")
    for k, q in enumerate(qs):
        tag = f"exam {id} Q{k+1}"
        if not q.get("q") or not q.get("marks"): err(f"{tag}: needs q and marks")
        if not (q.get("scheme") or q.get("points") or q.get("levels")): err(f"{tag}: needs scheme/points/levels")
        if q.get("levels"):
            for lv in q["levels"]:
                if not all(x in lv for x in ("band", "marks", "desc", "score")): err(f"{tag}: each level needs band, marks, desc, score")
            if not q.get("exemplars"): err(f"{tag}: levelled question has no exemplars (one example answer per level is needed for the 12-marker trainer)")
        if q.get("exemplars"):
            if not q.get("levels"): err(f"{tag}: has exemplars but no levels")
            # band number -> (low, high) mark range, from marks like "1-3" or "1–3"
            ranges = {}
            for lv in q.get("levels") or []:
                m = re.match(r"^\s*(\d+)\s*[-–]\s*(\d+)\s*$", str(lv.get("marks", "")))
                if m: ranges[str(lv.get("band"))] = (int(m.group(1)), int(m.group(2)))
                else: err(f"{tag}: level band {lv.get('band')} has unreadable marks range '{lv.get('marks')}'")
            seen = []
            for n, ex in enumerate(q["exemplars"], 1):
                etag = f"{tag} exemplar {n}"
                missing_f = [x for x in ("level", "mark", "answer", "comment") if x not in ex or ex[x] in (None, "")]
                if missing_f: err(f"{etag}: missing {', '.join(missing_f)}"); continue
                lvl = str(ex["level"]); seen.append(lvl)
                if lvl not in ranges: err(f"{etag}: level {lvl} is not one of the question's bands {sorted(ranges)}"); continue
                lo, hi = ranges[lvl]
                if not isinstance(ex["mark"], int) or not (lo <= ex["mark"] <= hi): err(f"{etag}: mark {ex['mark']} is outside band {lvl} range {lo}-{hi}")
                if not isinstance(ex["answer"], str) or len(ex["answer"].split()) < 15: err(f"{etag}: answer is missing or too short to be a realistic response")
            if ranges and sorted(seen) != sorted(ranges):
                err(f"{tag}: exemplars must cover each band exactly once (bands {sorted(ranges)}, exemplars {sorted(seen)})")

for id, cs in data["flashcards"].items():
    if id not in topic_ids: err(f"flashcards {id}: unknown topic id")
    for c in cs:
        if not c.get("front") or not c.get("back"): err(f"flashcards {id}: card missing front/back")

for tid, tr in data["traces"].items():
    if tr.get("topic", tid.split("-")[0]) not in topic_ids: err(f"trace {tid}: unknown topic")
    cols = len(tr.get("columns") or [])
    if not cols or not tr.get("rows"): err(f"trace {tid}: needs columns and rows")
    for r, row in enumerate(tr.get("rows") or []):
        if len(row) != cols: err(f"trace {tid}: row {r+1} has {len(row)} cells, expected {cols}")
    for r, row in enumerate(tr.get("prefill") or []):
        if len(row) != cols: err(f"trace {tid}: prefill row {r+1} has {len(row)} cells, expected {cols}")

missing = [t for t in topic_ids if t not in data["topics"]]
print(f"Topics with content: {len(data['topics'])}/{len(topic_ids)}; quizzes: {len(data['quizzes'])}; exam sets: {len(data['exams'])}; flashcard sets: {len(data['flashcards'])}; traces: {len(data['traces'])}; tools: {len(tools)}")
if missing: print("No content yet for:", ", ".join(missing))
for w in warnings: print("WARN ", w)
for e in errors: print("ERROR", e)
print(f"{len(errors)} errors, {len(warnings)} warnings")
sys.exit(1 if errors else 0)
