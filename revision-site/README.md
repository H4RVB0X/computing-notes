# AQA A-Level Computer Science (7517) — revision site

A complete, offline revision site covering every section of the AQA 7517 specification (Papers 1 and 2) plus
the NEA. Notes, worked examples, quizzes, exam-style questions with mark schemes, flashcards with spaced
repetition, trace-table challenges and interactive tools — all in plain HTML/CSS/JS.

## What's inside

| | Count |
|---|---|
| Pages of notes (sections 1–14, reference R.1–R.3, Piles O' Tiles P.1–P.6) | 79 |
| AQA spec points mapped (see `../COVERAGE.md`) | 283, all covered |
| Quiz questions (MCQ, short answer, true/false, ordering, spot-the-error) | 1,585 |
| Exam-style questions with self-marking mark schemes | 584 |
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

Double-click **`revision-site/index.html`** (or drag it into a browser). No server, no build step, no internet.
Works in Chrome, Edge, Firefox and Safari. Progress (quiz scores, flashcard boxes, checklist ticks, mock history)
is saved in the browser's localStorage for that file; use **Progress & settings → Export** to back it up.

**Memory controls.**
- Each page has a *Reset my progress on this page* button at the bottom.
- *Progress & settings* has a **Save my progress on this device** switch. When it's off, nothing is written to the browser, which is handy on shared school PCs.
- *Progress & settings* also has Export, Import and Reset all.

Accounts (cross-device sync) are not built yet. The proposed design (Firebase + Google sign-in) is in `docs/accounts-plan.md`.

**Hosting on GitHub Pages.** The site is static, so Pages can serve the `revision-site/` folder as is. A Pages site is publicly reachable even when the repository is private.

Keyboard: `/` focuses search · in flashcards `space` flips, `1` = not yet, `2` = got it.

## How it is organised

```
revision-site/
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
│   └── search.js           site-wide search
├── content/
│   ├── sections.js         THE SITE MAP: sections → pages → AQA spec points (drives sidebar, checklist, COVERAGE.md)
│   ├── manifest.js         auto-generated list of files to load (python3 dev/build_manifest.py)
│   ├── topics/<id>.md.js   notes for each page, written in Markdown inside a JS comment
│   ├── quizzes/<id>.js     quiz questions
│   ├── exam/<id>.js        exam-style questions + mark schemes
│   ├── flashcards/<id>.js  extra flashcards (key terms become cards automatically)
│   └── trace/<id>.js       trace-table challenges
├── tools/<id>.js           one interactive tool per file
├── dev/                    helper scripts (see below)
├── CONTENT_SPEC.md         the full authoring guide (formats, directives, quality bar)
└── README.md               this file
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
3. Run `python3 dev/build_manifest.py` (or add the file paths to `content/manifest.js` by hand).

To add quiz questions: edit `content/quizzes/<id>.js` — the question formats are documented in `CONTENT_SPEC.md §3`.

## Checking your edits

```bash
cd revision-site
python3 dev/build_manifest.py        # rescan content/ and tools/ and rewrite manifest.js
python3 dev/check_content.py         # validates every file: schema, balanced blocks, links, trace shapes
python3 dev/run_python_snippets.py   # runs every Python example and checks it against its output block
node dev/smoke_test.js               # headless Chromium: visits every page/tool and reports console errors
python3 dev/build_coverage.py        # regenerates ../COVERAGE.md from sections.js + the content folders
```
(`node dev/smoke_test.js` needs the `playwright` npm package; the other scripts need only Python 3.)

## Progress data

Stored under the key `cs-revision-v1` in localStorage. **Progress & settings** lets you export it as JSON,
import it on another device, or reset everything.

## Sources

The notes were written against the AQA 7517 specification and the student's own course materials in `../Notes/`
(teacher slides, Isaac Computer Science pages and question sheets), with known errors in those materials
corrected and flagged in the relevant pages. `../COVERAGE.md` maps every spec point to its page.
