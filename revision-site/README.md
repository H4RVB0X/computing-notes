# AQA A-Level Computer Science (7517) — revision site

A complete, offline revision site covering every section of the AQA 7517 specification (Papers 1 and 2) plus
the NEA. Notes, worked examples, quizzes, exam-style questions with mark schemes, flashcards with spaced
repetition, trace-table challenges and interactive tools — all in plain HTML/CSS/JS.

## Open it

Double-click **`revision-site/index.html`** (or drag it into a browser). No server, no build step, no internet.
Works in Chrome, Edge, Firefox and Safari. Progress (quiz scores, flashcard boxes, checklist ticks, mock history)
is saved in the browser's localStorage for that file; use **Progress & settings → Export** to back it up.

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

Page ids are the numbers you see in the sidebar (`1.1` … `14.2`, `R.1` … `R.3`).

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
python3 dev/run_python_snippets.py   # runs every ```python block in the notes
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
