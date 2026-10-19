# A-Level Computer Science Revision Site (AQA 7517)

A complete, interactive revision website for the AQA A-Level Computer Science specification. I designed it and built it with an AI coding agent: I wrote the requirements and quality bar, and directed and reviewed the work. Every page, question and tool was produced by Claude Code agents and then checked by automated tests and independent AI reviewers.

**Live site:** https://h4rvb0x.github.io/computing-notes/

![Dashboard](docs/images/dashboard.png)

## What's in it

| | |
|---|---|
| **79 pages of notes** | Every section of the AQA 7517 specification. Each page has learning objectives, key terms (mark-scheme wording plus plain English), worked examples, diagrams, "Marks are lost here" boxes, exam technique and a recap |
| **283 / 283 spec points** | Each mapped to the page that teaches it ([COVERAGE.md](COVERAGE.md)) |
| **1,585 quiz questions** | Multiple choice, short answer, true/false, ordering and spot-the-bug, all with explanations |
| **595 exam-style questions** | Self-marked against mark schemes, including 33 levelled 6/9/12-mark questions |
| **Extended-answer trainer** | For each levelled question, mark three example answers yourself, then see the examiner's level, mark and comment, and write your own |
| **60 Python coding problems** | Paper 1 Section B style, run in the browser with Pyodide against 373 visible and hidden tests, with hints and model answers |
| **My mistakes** | Every wrong answer comes back after 1, 3 and 7 days until you've got it right each time |
| **700+ flashcards** | Spaced repetition (Leitner boxes) |
| **89 trace-table challenges** | Checked cell by cell |
| **41 interactive tools** | Including an AQA assembly simulator, fetch–decode–execute stepper, logic-gate simulator, Boolean simplifier, SQL playground, floating-point explorer, Dijkstra/A* visualiser, Turing machine, FSM and regex tools, subnet calculator and a TLS handshake demo |
| **Paper 1 skeleton section** | For the 2027 "Piles O' Tiles" program: a method-by-method code tour, 18 documented bugs, 58 Section C questions, 21 Section D modification tasks with tested model answers, and a faithful in-browser port of the game |
| **Study tools** | Progress tracking, weakest-topic suggestions, a timed mixed mock, a spec checklist, search, dark/light mode, mobile layout, per-page reset and a "don't save on this device" mode |
| **Installable and offline** | Add to Home Screen on a phone; a service worker saves the whole site for offline use |
| **Accounts (optional)** | Google sign-in with Firebase; progress is merged across devices. Off until configured ([docs/SETUP.md](docs/SETUP.md)) |
| **Report a mistake** | On every question and page, to a Google Form, GitHub issue or the database |

<p>
  <img src="docs/images/topic-dark.png" width="49%" alt="Topic page in dark mode">
  <img src="docs/images/tool.png" width="49%" alt="Piles O' Tiles console tool">
</p>

## How it was built: AI-assisted engineering

This project is mainly an exercise in **directing AI agents to build something large and correct**, rather than writing every line by hand.

**My role**
- Defined the product: what a textbook replacement needs, the page template, question types, tools, accessibility, offline use and the quality bar.
- Supplied the source material (my class notes, kept private and not in this repo) and the exam-board constraints, and made the design decisions: logo, privacy, memory controls, hosting.
- Ran the build: reviewed reports, re-prioritised, and kept the work inside a limited usage budget (at most two agents at a time).

**How the AI work was organised**
- **Specification first.** A written content contract ([docs/CONTENT_SPEC.md](docs/CONTENT_SPEC.md)) gave every agent the same formats and quality rules.
- **Parallel agents.** Claude Code sub-agents each owned a section of the course or a group of tools, working in the same repository.
- **Verification over trust.** No content was accepted on the AI's word:
  - Every Python example is executed, and its output is compared with what the page shows (188 examples).
  - Every quiz key, trace and mark scheme was recomputed with code: Python, `sqlite3`, `re`, logic identities checked against every input, an AQA assembly interpreter.
  - The skeleton-program console was **differentially tested** against the real Python program: 61 scripted runs with identical output.
  - Every coding problem's model answer passes its tests in real Python *and* in the in-browser runner, and a separate agent solved each problem from the task wording alone to catch unclear tasks.
  - The cloud-sync merge rules have their own unit tests.
  - A Playwright smoke test opens all 475 routes (desktop and mobile) and fails on any console error, missing tool or horizontal scroll.
- **Independent review.** Every page was re-checked by a separate reviewer agent that hadn't written it. About 25 errors were caught and fixed, for example a wrong Amdahl's-law figure, AQA's definition of image resolution, and a logic puzzle with two answers.
- **Source correction.** Mistakes found in the original notes (textbook, slides, online resources) are corrected on the pages and flagged for students.
- **Continuous checks.** A GitHub Actions workflow re-runs the validators on every push before deploying.

**What went wrong, and how it was caught**
- **The quizzes gave answers away.** Using the site, I noticed the correct option was often just the longest one, a known habit of AI-written multiple choice. I had it measured: a correct option more than 15% longer than every wrong one counts as a giveaway, and the share of questions where the answer is the longest option should stay near chance (25%). 281 questions were rewritten, options are now shuffled every time, and CI fails if the bias comes back. The same rule shaped the extended-answer examples: in over half the questions a lower-level answer is at least as long as the top one, so length never signals the level.
- **A bug that had been there since the start.** While testing a data migration, the exam page's "self-marked total" turned out to join numbers together as text once a mark-scheme box was ticked. It was fixed and covered by a test.
- **Over-confident facts.** An independent review of the extended-answer examples tightened several legal claims (what the PSTI Act and the Automated Vehicles Act actually say), corrected a timeline and moved one example answer that had been put in the wrong level.

## Tech

- Plain **HTML, CSS and vanilla JavaScript**: no framework, no build step, no dependencies. It runs from `file://` or any static host.
- **Python in the browser:** Pyodide (CPython compiled to WebAssembly) in a Web Worker, so a runaway loop can be stopped without freezing the page.
- **PWA:** a web app manifest and a network-first service worker.
- **Optional Firebase** (Auth + Firestore), loaded only when configured. Progress merges with per-field rules (max, or, newest wins, "gone" markers), and security rules limit each user to their own document.
- A hash-based single-page router; content is written as **Markdown inside JS files** with a small custom renderer (callouts, tabs, steps, inline SVG diagrams, embedded tools).
- Progress is stored in `localStorage`, with export/import.
- Python and Node scripts handle validation, coverage generation and end-to-end testing.

```
site/        the website (this folder is what GitHub Pages publishes)
  index.html, css/, js/          app shell, router, renderer, quiz/flashcard/trace/code engines, sync
  content/                       sections.js (site map + spec points), topics, quizzes, exams, flashcards, traces, problems
  tools/                         one file per interactive tool
  sw.js, manifest.webmanifest    offline app
scripts/     build_manifest, check_content, check_ids, check_problems, check_quiz_balance, check_sync_merge,
             run_python_snippets, build_coverage, smoke_test
firebase/    Firestore security rules
docs/        setup guide, authoring guide, developer guide, coverage notes, screenshots
COVERAGE.md  every AQA spec point → page → status
```

## Run it locally

Open `site/index.html` in a browser. No server needed. Code practice, offline install and accounts need the site served over http, for example by running `python3 -m http.server` inside `site/`.

To check content after editing, from the repository root:

```bash
python3 scripts/build_manifest.py      # after adding files
python3 scripts/check_content.py       # schema, links, required blocks
python3 scripts/run_python_snippets.py # run every Python example
python3 scripts/check_problems.py      # run every coding problem's model answer against its tests
python3 scripts/build_coverage.py      # regenerate COVERAGE.md
node scripts/check_ids.js              # unique stable question ids
node scripts/smoke_test.js             # needs the playwright npm package
```

See [docs/DEVELOPING.md](docs/DEVELOPING.md) for how to add pages, questions and tools.

## Deploying to GitHub Pages

1. Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main`. The workflow in `.github/workflows/pages.yml` validates the content, then publishes `site/`.

[docs/SETUP.md](docs/SETUP.md) also covers the mistake-report form and switching on accounts.

## Roadmap

- Switch on accounts for the class (the code is built; it needs a Firebase project, see [docs/SETUP.md](docs/SETUP.md)).
- A native iOS app (Capacitor) with daily "mistakes due" notifications.
- More code-practice problems, especially Paper 1 Section D-style changes to a provided program.

## Notes

- Not affiliated with or endorsed by AQA. Specification references are for revision purposes.
- The Paper 1 skeleton section is based on AQA's 2027 preliminary material, which is intended for candidates at the centre.
