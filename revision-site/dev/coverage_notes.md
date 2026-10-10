## How the content was checked

- Every page was written from the AQA 7517 specification and the notes in `Notes/`. Every worked example, trace table, quiz key and mark scheme was **recomputed with code** (Python, sqlite3, `re`, the real Piles O' Tiles skeleton, an AQA assembly interpreter) or traced by hand where code can't run (Haskell).
- An **independent reviewer** (not the author) re-checked every section. 7.1–7.3 and 11–14 are checked; 1–10 are checked except 7.4/7.5 and 10.x (in progress at the time of writing); R and P are in progress.
- Every runnable Python block on the site is executed by `dev/run_python_snippets.py`. Every page, quiz, exam set, flashcard deck, trace and tool is loaded by `dev/smoke_test.js` (Playwright, desktop and 360px mobile), which checks for console errors and missing tools.

## Gaps in the notes filled from own knowledge

- **Sections 13 (systematic approach) and 14 (NEA)**: the `Notes/` folder has no material for them. Both were written from the specification and AQA's published NEA criteria.
- **Reference pages R.1–R.3** (pseudocode ↔ Python, Boolean algebra, exam technique) and the **Piles O' Tiles** section (built from the class prep page and AQA's 2027 preliminary material) are additions.
- Smaller gaps filled across sections: assembly-language programs (7.3), interrupts and performance factors (7.4), REST/JSON/WebSockets (9.7), the Data (Use and Access) Act 2025 (8.2), Mealy machines and Turing machine traces (4.2, 4.8).

## Errors found in the notes (corrected on the site with "Marks are lost here" boxes)

These came up in **sections 1–12**: textbook, slides, Isaac and ZigZag material. Examples:
- **Data representation:** 101000011111 = −0.375, not 5/8; −7.5 = 10001000 0011; a 16-bit data bus is not "65356 bits".
- **Data structures:** the dot product is a scalar; post-order is depth-first, not breadth-first.
- **Theory of computation:** ℕ includes 0; set difference is not symmetric difference; `(01)*` should be `(0|1)*`.
- **Functional programming:** f ∘ g means f(g(x)).
- **SQL:** the textbook query answers have missing join conditions.
- **Consequences:** BA and Marriott fines were £20m and £18.4m, not the proposed £183m/£99m; DPA 1998 is replaced by DPA 2018; RIPA is largely replaced by IPA 2016.
- **Boolean algebra:** A + Ā.B = A + B, not B.
- **Searching:** binary search on 1,024 items needs up to 11 comparisons, not 10.
- **Programming:** −7 MOD 2 behaves differently in Python and VB.NET.

The full list is in each section's trap boxes.

## Uncertainties (flagged on the pages)

- **NEA (14.1):** the mark split (Analysis 9, Design 12, Completeness 15, Techniques 27, Testing 8, Evaluation 4) and the Group A/B/C technique tables were reproduced from memory. A reviewer confirmed them, but the page still says "check current AQA guidance".
- **Consequences (8.x):** law that is being phased in or is recent: the Data (Use and Access) Act 2025 commencement, the EU AI Act dates, Getty v Stability AI (2025), the UK Advanced Data Protection withdrawal ("reportedly"). Statistics (data-centre energy, e-waste) are approximate.
- **Pseudocode (1.x, R.1):** AQA has no official syntax for CASE, records, try/except or date handling, so these are labelled. `^` is used for exponent. SUBSTRING is taken as 0-indexed with the end included; students are told to follow the question's definition.
- **Data representation (5.x):**
  - kB = 1000 vs 1024 when a question doesn't say ("usually either, if consistent").
  - Relative error accepted as a ratio or a percentage.
  - UTF-8 is taught as 1–4 bytes, the modern standard.
- **Boolean notation (6.5):** overbars are recommended; whether AQA mark schemes explicitly accept ¬ is unconfirmed.
- **Networking (9.x):**
  - "Physical star, logical bus" is taught as the safe exam answer.
  - The AQA-style packet "trailer" is taught, with a note that IPv4 has none.
  - Bandwidth: both the frequency-range and capacity meanings are given.
  - Trace 9.7-1 uses PUT for a partial update, following the spec's CRUD mapping; strictly REST would use PATCH.
- **Databases (10.x):** commitment ordering is given in both the class-slide wording and the standard wording. Foreign keys are marked FK (AQA only requires the primary key to be underlined).
- **Big Data (11.1):** volume figures are rough estimates and worded as such.
- **Functional programming (12.x):** Haskell couldn't be run here. Every expression was evaluated by hand by two separate agents.
- **Data structures (2.x):** "open" and "closed" hashing are used in opposite senses by different sources, so the page tells students to describe the method. Bit-vector parity as a dot-product application is unconfirmed.
- **Theory of computation (4.x):** Mealy machines are written `input/output` (with a note that `input|output` also appears). The 4.7 timing table uses rounded orders of magnitude.
- **Algorithms (3.5):** Timsort is described as "based on merge sort", which is simplified; it's a merge/insertion hybrid.
- **Piles O' Tiles (P.x):**
  - `game1.txt` was rebuilt from the prep page. The first player is Boris (confirmed); the second, "Poppy", is inferred.
  - The question-slot predictions are based on the EAD mark totals.
  - The in-browser console treats filenames as case-sensitive (Linux behaviour); very large scores in a file lose precision beyond 2^53.

## Known limitations

- **Progress storage:** progress is stored per browser (localStorage). Use export/import to move it, or switch saving off on shared computers. There are no accounts yet; see `revision-site/docs/accounts-plan.md`.
- **Haskell:** the Haskell list lab supports whole numbers only (no strings, tuples or `let`).
- **SQL playground:** no subqueries and no LEFT JOIN.
- **Huffman:** ties may give a different tree from a mark scheme's, with the same total bits.
- **Piles O' Tiles:** the preliminary material is meant for candidates at the centre only. The repository is private, but a GitHub Pages site is publicly reachable by anyone with the link.
