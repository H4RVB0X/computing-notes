# Developer guide

A complete, offline revision site covering every section of the AQA 7517 specification (Papers 1 and 2) plus
the NEA. Notes, worked examples, quizzes, exam-style questions with mark schemes, flashcards with spaced
repetition, trace-table challenges and interactive tools — all in plain HTML/CSS/JS.

## What's inside

| | Count |
|---|---|
| Pages of notes (sections 1–14, reference R.1–R.3, Piles O' Tiles P.1–P.6) | 79 |
| AQA spec points mapped (see `COVERAGE.md`) | 283, all covered |
| Quiz questions (MCQ, short answer, true/false, ordering, spot-the-error) | 1,585 |
| Exam-style questions with self-marking mark schemes | 595 |
| Levelled (6/9/12-mark) questions with example answers per level | 33 |
| Python coding problems / automatic tests (incl. 21 auto-checked Section D tasks, 24 from the class booklet) | 105 / 597 |
| Flashcards (plus every key term automatically) | 700 |
| Trace-table challenges | 89 |
| Interactive tools | 41 |

**Paper 1 skeleton: Piles O' Tiles (section P).** Built from the 2027 preliminary material and the class prep page:
- P.1–P.4: paper strategy, a method-by-method code tour, the bugs and weaknesses, and 58 Section C questions.
- P.5: 21 Section D modification tasks with hints, tested model answers and screenshot tests.
- P.6: 10 Section B practice programs.
- `pot-console`: a faithful in-browser copy of the game (matched against the real Python in 61 test runs), with switches for the model-answer fixes.

The preliminary material is for candidates at the centre only. Keep the site link within the class.

## Open it

Double-click **`site/index.html`** (or drag it into a browser). No server, no build step, no internet.
Works in Chrome, Edge, Firefox and Safari. Progress (quiz scores, flashcard boxes, checklist ticks, mock history)
is saved in the browser's localStorage for that file; use **Progress & settings → Export** to back it up.

**Memory controls.**
- Each page has a *Reset my progress on this page* button at the bottom.
- *Progress & settings* has a **Save my progress on this device** switch. When it's off, nothing is written to the browser, which is handy on shared school PCs.
- *Progress & settings* also has Export, Import and Reset all.

**Features that need the live site (or a local server).** Browsers block these from `file://`. To try them locally, run `python3 -m http.server` inside `site/`:
- installing as an app and offline mode (`sw.js`, `manifest.webmanifest`)
- code practice (Python runs in a Web Worker with Pyodide, loaded from jsDelivr on first use)
- accounts and sync (Firebase; switched off until `js/config.js` is filled in, see `docs/SETUP.md`).

**Hosting on GitHub Pages.** The site is static, so Pages can serve the `site/` folder as is. A Pages site is publicly reachable even when the repository is private.

Keyboard: `/` focuses search · in flashcards `space` flips, `1` = not yet, `2` = got it.

## How it is organised

```
site/
├── index.html              the app shell (sidebar, header, routing)
├── css/style.css           all styling, light + dark themes
├── js/                     engine (no content in here)
│   ├── core.js             registries, localStorage, progress tracking, utilities
│   ├── markdown.js         the Markdown + directive renderer used for notes
│   ├── highlight.js        syntax highlighting (Python, AQA pseudocode, Haskell, SQL, assembly…)
│   ├── app.js              router and page views (dashboard, topic, tools, checklist, glossary…)
│   ├── quiz.js             quizzes, exam-style self-marking, mixed mock mode
│   ├── flashcards.js       Leitner spaced repetition
│   ├── trace.js            trace-table challenges
│   ├── review.js           My mistakes deck (spaced re-asking of wrong answers) and "Report a mistake" links
│   ├── levels.js           extended-answer trainer: mark example answers to levelled questions
│   ├── code.js             code practice pages, test checking, the small code editor
│   ├── py-worker.js        Web Worker that runs Python with Pyodide (same test rules as check_problems.py)
│   ├── sync.js             optional Google sign-in + Firestore sync, and the progress merge rules
│   ├── config.js           settings: report form, Firebase project (see docs/SETUP.md)
│   └── search.js           site-wide search
├── sw.js                   service worker: saves the site for offline use (network first)
├── manifest.webmanifest    makes the site installable; icons in icons/
├── content/
│   ├── sections.js         THE SITE MAP: sections → pages → AQA spec points (drives sidebar, checklist, COVERAGE.md)
│   ├── manifest.js         auto-generated list of files to load (python3 scripts/build_manifest.py)
│   ├── topics/<id>.md.js   notes for each page, written in Markdown inside a JS comment
│   ├── quizzes/<id>.js     quiz questions
│   ├── exam/<id>.js        exam-style questions + mark schemes
│   ├── flashcards/<id>.js  extra flashcards (key terms become cards automatically)
│   ├── trace/<id>.js       trace-table challenges
│   └── problems/<group>.js coding problems with tests (code practice)
└── tools/<id>.js           one interactive tool per file

firebase/firestore.rules    database security rules for accounts

scripts/                    build and check scripts (see below) — not published
docs/                       CONTENT_SPEC.md (authoring guide), this file, SETUP.md (Pages, report form, Firebase), coverage notes
.github/workflows/pages.yml checks the site, then deploys site/ to GitHub Pages
```

Page ids are the numbers you see in the sidebar (`1.1` … `14.2`, `R.1` … `R.3`, `P.1` … `P.6`).

## Adding or editing notes

1. Open `content/topics/<id>.md.js`. Everything between `/*` and `*/` is Markdown — edit it like a text file.
   Callout boxes are written as `:::tip` … `:::` (types: definition, example, trap, tip, challenge, exam, note,
   collapse, tabs, steps, columns). See `CONTENT_SPEC.md` for the complete syntax, with examples.
2. Save and refresh the browser. That's it.

To add a brand-new page:
1. Add it to the right section in `content/sections.js` (id, title, spec, specPoints).
2. Create `content/topics/<id>.md.js` (copy `2.3.md.js` as a template), and optionally quiz/exam/flashcards/trace files.
3. Run `python3 scripts/build_manifest.py` (or add the file paths to `content/manifest.js` by hand).

To add quiz questions: edit `content/quizzes/<id>.js` — the question formats are documented in `CONTENT_SPEC.md §3`.

**Question ids.** Every quiz and exam question gets a stable id from its topic and a hash of its text (`2.3/q-1x9k2a`). Progress, My mistakes and reports use it. Reordering questions or rewording the options is safe. Changing the question text gives the question a new id, which loses saved progress on that one question. To keep the id while rewording, add `id: "<the old id>"` to the question. `node scripts/check_ids.js` catches duplicates.

**Extended-answer examples.** A levelled exam question (`levels: [...]`) needs `exemplars: [{ level, mark, answer, comment }]`, one per band, to appear in the trainer. Keep lengths honest: a long answer that only describes should sit low, so length never gives the level away.

**Coding problems.** `content/problems/<group>.js` calls `CS.registerProblems([...])`. Each problem has `id`, `title`, `topic`, `difficulty`, `task`, `tests: [{ name, input, code, expect, hidden }]`, `hints` and `solution` (optionally `starter`, `files`, `match`, `explain`). `python3 scripts/check_problems.py` runs every model solution against its tests with real Python, using exactly the rules the browser uses: `input()` prompts aren't checked, outputs are compared line by line ignoring trailing spaces, and there's a 2-second limit.

## Checking your edits

```bash
python3 scripts/build_manifest.py        # rescan content/ and tools/ and rewrite manifest.js
python3 scripts/check_content.py         # validates every file: schema, balanced blocks, links, trace shapes
python3 scripts/run_python_snippets.py   # runs every Python example and checks it against its output block
node scripts/smoke_test.js               # headless Chromium: visits every page/tool and reports console errors
node scripts/check_quiz_balance.js       # flags MCQs whose correct option is noticeably the longest
python3 scripts/build_coverage.py        # regenerates ../COVERAGE.md from sections.js + the content folders
python3 scripts/check_problems.py        # runs every coding problem's model answer against its tests
node scripts/check_ids.js                # every question has a unique stable id
node scripts/check_sync_merge.js         # unit tests for the cloud-sync merge rules
```
(`node scripts/smoke_test.js` needs the `playwright` npm package; the other scripts need only Python 3.)

## Progress data

Stored under the key `cs-revision-v1` in localStorage. **Progress & settings** lets you export it as JSON,
import it on another device, or reset everything. When accounts are on, a merged copy lives in Firestore
(`users/{uid}`); the merge rules are in `js/sync.js` and tested by `scripts/check_sync_merge.js`.

## Sources

The notes were written against the AQA 7517 specification and the student's own course materials (kept privately; not in this repository)
(teacher slides, Isaac Computer Science pages and question sheets), with known errors in those materials
corrected and flagged in the relevant pages. `../COVERAGE.md` maps every spec point to its page.
