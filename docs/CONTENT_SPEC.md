# Content authoring guide (CONTENT_SPEC.md)

This site is plain HTML/CSS/JS, opened directly from `index.html` with no server and no build step.
All notes, quizzes, flashcards, exam questions, trace challenges and tools are **plain files** under
`content/` and `tools/`. This document is the contract every content file must follow.

**Audience:** a sixth-form student (AQA A-Level Computer Science 7517) with a short attention span who
dislikes walls of text. Target: every topic page is sufficient, on its own, to score A* on that topic.

**Voice:** friendly, direct, British English (`colour`, `organise`, `programme` only for TV; `program` for code).
No filler ("Great!", "Let's dive in"), no patronising, no hype. Explain the *why*, not just the *what*.
Use mark-scheme wording for definitions, then translate to plain English.

---

## 1. Where files go and how they load

```
site/
  index.html                 shell (do not edit for content)
  content/sections.js        site map: sections → topic ids/titles/spec points (do NOT add topics here without instruction)
  content/manifest.js        AUTO-GENERATED list of files to load — run  python3 scripts/build_manifest.py
  content/topics/<id>.md.js  notes for one topic (markdown inside a JS comment)
  content/quizzes/<id>.js    quiz questions for one topic
  content/exam/<id>.js       exam-style questions with mark schemes
  content/flashcards/<id>.js extra flashcards (key terms are ALSO turned into cards automatically)
  content/trace/<id>.js      trace-table challenges
  tools/<tool-id>.js         one interactive tool per file
  scripts/build_manifest.py      regenerate manifest.js
  scripts/check_content.py       validator — run it before you finish, fix every ERROR, read the WARNs
  scripts/run_python_snippets.py executes every ```python block in the topic files
  scripts/smoke_test.js          headless Chromium click-through (node scripts/smoke_test.js)
```

Topic ids (e.g. `2.3`, `R.1`) come from `content/sections.js`. The id in the file name must match the id
inside the file.

---

## 2. Topic notes: `content/topics/<id>.md.js`

The file is JavaScript, but the body is Markdown inside a block comment, so you can write freely
(backticks, `${}`, anything) — the only forbidden sequence inside the body is `*/`.

```js
CS.registerTopic({ id: "2.3", title: "Stacks" }, function () {/*

...markdown...

*/});
```

### 2.1 Required structure (in this order)

1. `:::objectives` … `:::`  — 4–7 bullets, plain English, "be able to…" verbs.
2. `:::quick At a glance` … `:::` — the one-screen summary shown in **Quick view** (6–10 bullets, bold the key words).
3. `:::keyterms` … `:::` — every key term for the topic (6–15). One per line: `Term :: mark-scheme definition :: plain English`.
4. The teaching body: `##` sections and `###` subsections. Build from intuition to formal detail. Every `##` section should be readable in ≤ 2 minutes: short paragraphs (≤ 4 sentences), bullets, tables, callouts, diagrams, code.
5. At least one `:::trap` ("Marks are lost here") box — ideally one per major section.
6. At least one `:::example` worked example **showing every step** (trace tables, binary working, etc.).
7. One `:::exam` box: how to answer 2/4/6/9/12-mark questions on this topic; what *State / Describe / Explain / Discuss / Evaluate* demand here.
8. `:::challenge` — 2–4 stretch tasks (no answers needed).
9. `:::recap` — 5–8 bullet summary.
10. `:::related` — links only where genuinely useful: `- [2.2 Queues](#/topic/2.2)`.

Length guide: 1,200–3,000 words of prose per page (code and diagrams extra). The validator warns under 900.

### 2.2 Markdown supported

- Headings `##`, `###`, `####` (never `#` — the page title is added automatically).
- `**bold**`, `*italic*`, `` `code` ``, `[text](#/topic/1.6)` internal links, `[text](https://…)` external.
- Bullets `- `, numbered `1. `, nesting by 2 spaces. Task lists `- [ ] text`.
- Tables with `|` (first row = header, second = `|---|---|`).
- Blockquotes `> `.
- Fenced code: ```` ```python ````, ```` ```pseudocode ````, ```` ```haskell ````, ```` ```sql ````, ```` ```asm ````, ```` ```bnf ````, ```` ```text ````, ```` ```output ````. Add a title after the language: ```` ```python Example: bubble sort ````.
- Raw HTML blocks are passed through when the line starts with `<svg`, `<div`, `<figure`, `<table`, `<details`.
- Superscripts/subscripts as HTML: `2<sup>n</sup>`, `x<sub>1</sub>`. Use real symbols where clear: `→ ← ≤ ≥ ≠ ∧ ∨ ¬ ⊕ ∈ ∪ ∩ ℕ ℤ ℚ ℝ Ø`.
- Write `<` with spaces round it in prose (`a < b`), or inside backticks. Never write `<b` or `<i` meaning "less than b".

### 2.3 Directive blocks (callouts)

```
:::definition Optional title
...
:::
```

Types: `definition` 📘 · `example` 🧮 (worked example) · `trap` ⚠️ ("Marks are lost here") · `tip` 💡 ·
`challenge` 🎯 · `exam` 📝 (exam technique) · `note` · `why` 🤔 · `history` · `link` · `maths` ·
`objectives` · `quick` · `keyterms` · `recap` · `related` · `spec` ("AQA spec says") ·
`collapse Title` (collapsible details) · `steps Title` (numbered steps — use an ordered list inside) ·
`columns` (split columns with a line containing only `|||`) · `figure Caption` (wrap an svg + caption).

Tabs (note the **four** colons on the container, three on each tab):
```
::::tabs
:::tab Python
```python
...
```
:::
:::tab AQA pseudocode
...
:::
::::
```

Rule for nesting any block inside another: the **outer** block uses more colons (`::::`), the inner uses `:::`.

### 2.4 Shortcodes

- `{{tool:tool-id}}` on its own line embeds an interactive tool (see §7). You may pass params: `{{tool:binary-converter bits=8}}`.
- `{{trace:2.3-1}}` embeds a trace challenge registered in `content/trace/`.
- `{{spec:4.2.3.1}}` inline badge with a spec reference.

Embed the relevant tools inside the notes at the point where they help (e.g. the sorting visualiser right
after the bubble sort explanation). If a tool is being built by someone else, still embed it by its agreed id;
the page shows a placeholder until the tool exists.

### 2.5 Diagrams (inline SVG)

Use inline SVG for anything spatial: architectures, data structures, FSMs, trees, graphs, layers, ER diagrams.

- Start with `<svg class="diagram" viewBox="0 0 W H" role="img" aria-label="...">` — **no `width`/`height` attributes** (it scales to the column).
- Use `stroke="currentColor"` and `fill="currentColor"` for lines/text so both light and dark themes work. For fills use translucent colours: `fill="#7c9aff" fill-opacity="0.35"`. Never use pure white or black fills.
- `font-family="inherit"`, `font-size` 12–16. Keep diagrams ≤ 700 wide in viewBox units.
- Arrowheads: define a `<marker>` with a **unique id per page** (e.g. `arr51`), reference with `marker-end="url(#arr51)"`.
- Keep SVG blocks tidy: each starts on a line beginning with `<svg` and ends on a line containing `</svg>`.
- Wrap in `:::figure Caption text` … `:::` when a caption helps.

### 2.6 Code

- Python 3 code must be **correct and runnable** (`scripts/run_python_snippets.py` executes it). Print outputs and show them as `# 42` comments or a following ```` ```output ```` block. Never call `input()` in a checked block; if you must, mark the fence ```` ```python nocheck ````.
- Pseudocode follows AQA style: `←` assignment, `IF … THEN … ELSE … ENDIF`, `WHILE … ENDWHILE`, `FOR i ← 0 TO 9 … ENDFOR`, `REPEAT … UNTIL`, `SUBROUTINE name(params) … ENDSUBROUTINE`, `RETURN`, `OUTPUT`, `USERINPUT`, `DIV`, `MOD`, `LEN()`, `POSITION()`, `SUBSTRING()`, 0-indexed arrays `a[0]`.
- When a construct matters for the exam, show **both** pseudocode and Python in a `::::tabs` block.
- Keep snippets short (≤ 30 lines) and focused.

### 2.7 Accuracy

Use the AQA 7517 specification wording. Where the student's own notes contain an error (your brief lists
known ones), teach the **correct** version and add a `:::trap` pointing out the common mistake. If a fact is
genuinely uncertain, say so in the page and in your final report rather than guessing.

---

## 3. Quizzes: `content/quizzes/<id>.js`

```js
CS.registerQuiz("2.3", [ {...}, {...} ]);
```
Write **18–25 questions** per topic: roughly 30% difficulty 1 (warm-up recall), 50% difficulty 2 (standard
exam level), 20% difficulty 3 (stretch/application). Mix the types. Every question needs `explain` (why the
right answer is right). For mcq, give `wrong` feedback for the plausible distractors.

Question objects (`q` and `explain` accept markdown, including fenced code):

```js
{ type: "mcq", difficulty: 2, q: "…", options: ["A", "B", "C", "D"], answer: 1,
  explain: "…", wrong: { 0: "why A is wrong", 2: "…", 3: "…" } }
// multi-select: answer: [0, 2]  (student must pick exactly those)
{ type: "truefalse", difficulty: 1, q: "True or false: …", answer: 0 /* 0 = True, 1 = False */, explain: "…" }
{ type: "short", difficulty: 2, q: "…", answers: ["accepted", "alternative"], explain: "…" }
// short answers are compared case-insensitively; numbers compare numerically; keep them to 1–3 words or a number
{ type: "spot", difficulty: 2, q: "Click the line with the error.", lang: "python", code: "line1\nline2\n…", answer: 3, fix: "what it should be", explain: "…" }
// answer = 1-based line number (or array of acceptable lines)
{ type: "order", difficulty: 2, q: "Put the steps in order.", items: ["first", "second", "third", "fourth"], explain: "…" }
// items listed in the CORRECT order; the site shuffles them
```

Options are shown in the order you write them (so you control distractor placement) unless `shuffle: true`.
Avoid "all of the above"/"none of the above". Make distractors reflect real misconceptions.

---

## 4. Exam-style questions: `content/exam/<id>.js`

```js
CS.registerExam("2.3", [
  { marks: 2, q: "Describe …", scheme: ["point 1", "point 2"], guidance: "optional note", model: "optional model answer (markdown)" },
  { marks: 6, q: "Explain …", scheme: ["p1","p2","p3","p4","p5","p6","p7"], maxPoints: 6 },     // any 6 of 7
  { marks: 9, q: "Discuss …", levels: [
      { band: "1", marks: "1-3", score: 2, desc: "…" }, { band: "2", marks: "4-6", score: 5, desc: "…" }, { band: "3", marks: "7-9", score: 8, desc: "…" } ],
    points: ["indicative content 1", "…"], guidance: "…" },
]);
```
Write **5–8 questions** per topic spanning 1–2, 3–4, 5–6 marks and (where the topic suits it) a 9- or
12-mark levelled question. Start each `q` with the command word (State/Describe/Explain/Discuss/Evaluate/
Compare/Calculate/Write/Convert/Complete/Draw). Mark-scheme points should read like real AQA mark schemes:
one creditworthy idea per point, in examiner language. Optional `code`/`lang` for a code stimulus.

---

## 5. Flashcards: `content/flashcards/<id>.js`

```js
CS.registerFlashcards("2.3", [ { front: "question or prompt", back: "answer (markdown ok)" }, … ]);
```
Every `:::keyterms` entry already becomes a card automatically, so add **6–12 extra** cards for processes,
algorithms, comparisons, formulae and "give three uses of …" style recall.

---

## 6. Trace challenges: `content/trace/<id>.js`

```js
CS.registerTrace({
  id: "3.5-1", topic: "3.5", title: "Bubble sort, one pass", lang: "pseudocode",
  code: "…",                       // the code to trace
  intro: "optional markdown shown above the code",
  columns: ["i", "j", "a[0]", "a[1]", "OUTPUT"],
  rows: [["0","0","5","3",""], …], // EXPECTED values, one array per row; "" = cell should be blank
  prefill: [["0","","","",""], …], // optional: values shown already (disabled); same shape as rows
  instructions: "optional override of the default instructions",
  hint: "optional markdown hint", note: "optional markdown shown underneath"
});
```
Write 1–3 per topic where tracing is examinable (programming, algorithms, theory of computation, FSMs,
Turing machines, assembly, SQL results). Embed with `{{trace:3.5-1}}` where it belongs in the notes.

---

## 7. Interactive tools: `tools/<tool-id>.js`

```js
CS.registerTool({
  id: "binary-converter",        // kebab-case, unique, used in {{tool:…}} and #/tool/…
  title: "Binary / denary / hex converter",
  section: "5", topic: "5.2",    // where it belongs
  icon: "🔢", desc: "one sentence",
  help: "markdown shown under the tool on its own page (how to use it, what to notice)",
  mount(el, params) { /* build the UI inside el; params from {{tool:id key=value}} */ }
});
```
Rules:
- Pure vanilla JS, no external libraries, no network. Everything inside `mount` (closures, no globals).
- `mount` may be called several times on the same page (embedded + full page); never rely on element ids being unique — create elements with `CS.util.el(tag, attrs, children)` and keep references.
- Use the helper classes in `css/style.css` (`.controls`, `.btn`, `.btn.primary`, `.btn.sm`, `.output`, `.steps-out`, `.cell`, `.cell.hl/.ok/.bad/.active/.dim`, `.bits`, `.bit`, `.two-col`, `.legend`, `.explain`, `.err`, `.ok-text`, `.table-wrap`, `.pill`). Canvas is fine (`<canvas>` inherits `.tool canvas` styling); re-read `getComputedStyle(document.documentElement).getPropertyValue("--text")` etc. for theme colours.
- Must work in both themes, at 360px width (controls wrap), with keyboard (real `<button>`s, labelled inputs).
- **Show the working.** Every tool should explain *what just happened* in exam language (e.g. a log line "pop(): not empty → item ← stack[2]"). Step controls (◀ ▶ ▶▶ Reset) for anything algorithmic, with a comparison/swap counter where relevant.
- Validate input and show a friendly `.err` message instead of throwing. Never let an exception escape `mount`.
- Keep each tool self-contained in one file ≤ ~600 lines. Test it with `node scripts/smoke_test.js`.

---

## 8. Before you finish (every agent)

```bash
# run from the repository root
python3 scripts/build_manifest.py          # picks up your new files
python3 scripts/check_content.py           # must report 0 errors for YOUR files; read the warnings
python3 scripts/run_python_snippets.py     # every python block must run
node scripts/smoke_test.js                 # no console errors on any route
```
Then report: files written, question counts, any spec points you could not cover confidently, and any
factual uncertainty (these go into COVERAGE.md).

---

## Appendix A — canonical tool ids (embed these with `{{tool:id}}`)

| Tool id | What it does | Lives in topic |
|---|---|---|
| `stack-demo` | push/pop/peek on an array stack (exists) | 2.3 |
| `queue-demo` | linear, circular and priority queues with front/rear pointers | 2.2 |
| `linked-list-demo` | insert/delete nodes, pointers redrawn | 2.1 |
| `hash-table-demo` | hashing, collisions, linear probing/rehash, chaining | 2.6 |
| `graph-explorer` | editable graph; adjacency matrix/list; BFS, DFS, Dijkstra, A* step-through | 2.4, 3.1, 3.6 |
| `tree-traversal` | build a BST, insert/search, pre/in/post-order animated | 2.5, 3.2, 3.4 |
| `vector-tool` | vector add, scalar multiply, dot product, convex combination, drawn | 2.8 |
| `sorting-visualiser` | bubble, insertion, merge, quick; step controls; comparison/swap counts | 3.5 |
| `searching-visualiser` | linear and binary search step-through with counts | 3.4 |
| `rpn-tool` | infix → RPN (shunting-yard steps) and RPN evaluation with a stack | 3.3 |
| `big-o-chart` | growth-rate comparison chart with adjustable n | 4.6 |
| `call-stack-visualiser` | recursion/subroutine calls as stack frames | 1.6, 1.5 |
| `haskell-list-lab` | evaluate simple map/filter/fold/head/tail expressions step by step | 12.2, 12.3 |
| `fsm-simulator` | editable FSM / Mealy machine, run input strings, transition table | 4.2, 4.4 |
| `turing-machine` | editable Turing machine with tape, step/run | 4.8 |
| `regex-tester` | test strings against a regular expression, explain the syntax | 4.4 |
| `bnf-checker` | enter production rules, test strings, show the derivation | 4.5 |
| `set-calculator` | union, intersection, difference, Cartesian product, cardinality | 4.3 |
| `base-converter` | denary ↔ binary ↔ hex with step-by-step working | 5.2 |
| `twos-complement` | represent negatives, add/subtract, overflow, ranges | 5.4 |
| `binary-adder` | unsigned addition and long multiplication with carries | 5.4 |
| `bitwise-ops` | AND/OR/XOR/NOT and logical shifts on bit patterns | 5.4, 7.3 |
| `floating-point` | mantissa/exponent explorer, normalisation, absolute/relative error, fixed point | 5.5 |
| `error-checking` | parity, majority voting, checksum, check digit calculators | 5.6 |
| `bitmap-editor` | draw a tiny bitmap and see bits, colour depth, file size | 5.7 |
| `sampling-demo` | sample a wave: rate, resolution, Nyquist, file size | 5.7 |
| `compression-tool` | RLE, dictionary compression and Huffman tree builder | 5.8 |
| `cipher-tool` | Caesar (with frequency analysis), Vernam XOR, public-key walkthrough | 5.8, 9.4 |
| `logic-gate-sim` | build/toggle circuits from an expression; presets: half adder, full adder, D-type | 6.4 |
| `boolean-simplifier` | truth table from an expression, minimal form, check two expressions are equivalent | 6.5 |
| `fde-stepper` | fetch-decode-execute cycle with registers and buses, step by step | 7.2 |
| `assembly-simulator` | run AQA assembly (LDR/STR/ADD/SUB/MOV/CMP/B*/AND/ORR/EOR/MVN/LSL/LSR/HALT) | 7.3 |
| `tcpip-layers` | packet encapsulation through the four layers, animated | 9.5 |
| `packet-switching` | packets routed across a network of routers and reassembled | 9.3 |
| `subnet-calculator` | IP AND mask in binary; network/host ids; same-subnet check | 9.6 |
| `handshake-demo` | TCP three-way handshake and HTTPS certificate exchange | 9.4, 9.5 |
| `dns-resolver` | how a domain name resolves to an IP address | 9.3 |
| `sql-playground` | run SELECT/INSERT/UPDATE/DELETE (with joins) on a sample database | 10.4 |
| `normalisation-walkthrough` | UNF → 1NF → 2NF → 3NF guided practice | 10.3 |
