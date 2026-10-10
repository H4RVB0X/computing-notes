CS.registerTopic({ id: "P.1", title: "Paper 1 overview and exam strategy" }, function () {/*

:::objectives
- Know the **shape of Paper 1** (7517/1D, Python): four sections, 100 marks, 2 hours 30 minutes, on screen.
- Use the **Electronic Answer Document (EAD)** mark totals to predict what each question slot will be.
- Know exactly **how Section D code and screenshot answers are marked**, and the habits that protect those marks.
- Plan your **time** so the 50 skeleton-program marks get the attention they deserve.
:::

:::quick At a glance
- **Paper 1** = 100 marks, 2 h 30 min ≈ **1.5 minutes per mark**. Taken on screen; answers go into the EAD.
- **Section A (37)** theory · **Section B (13)** write a new program · **Section C (13)** questions about the skeleton · **Section D (37)** modify the skeleton.
- **Half the paper (C + D = 50 marks) is the skeleton program**, which you can study in advance. This is the most predictable half of any A-level paper you will sit.
- Section D answers have **two parts**: `.1` the code (paste **every changed method in full**) and `.2` a **screenshot of the named test**.
- A partial answer **still scores**: marks go to individual features. Never leave a Section D slot blank.
:::

:::note About this add-on
This section is built from AQA's **2027 Paper 1 preliminary material**: the skeleton program, `game1.txt`, the EAD (7517/1D) and the EAD advice, plus your class prep page. Every bug and model answer here was **re-run against the real skeleton**. The preliminary material is for candidates at your centre only, so **keep this site private** (the repository is private; don't share the link outside your class).
:::

:::keyterms
Skeleton program :: The program supplied by AQA in advance as preliminary material, which Sections C and D of Paper 1 are based on. :: The code you get to study before the exam.
Preliminary material :: The documentation released before the exam (description of the scenario, the skeleton program and data files) that candidates study in advance. :: Everything AQA gives you early.
Electronic Answer Document (EAD) :: The document in which candidates type or paste their answers in the on-screen exam. :: Your answer file.
Evidence :: The code and screenshots pasted into the EAD to show what you did and that it works. :: Proof for the examiner.
:::

## The paper, section by section

The EAD's "Leave blank" boxes carry each question's total, and they add up to exactly **100**. That tells you the shape of the paper before you see it.

<svg class="diagram" viewBox="0 0 640 130" role="img" aria-label="Paper 1 split: Section A 37 marks, Section B 13, Section C 13, Section D 37">
  <g font-size="14" font-family="inherit">
    <rect x="10" y="20" width="229" height="60" rx="6" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="124" y="46" text-anchor="middle" font-weight="700">A · 37 marks</text><text x="124" y="66" text-anchor="middle" font-size="12">theory (Q01–Q06)</text>
    <rect x="239" y="20" width="80" height="60" rx="6" fill="#35d4bd" fill-opacity="0.3" stroke="currentColor"/>
    <text x="279" y="46" text-anchor="middle" font-weight="700">B · 13</text><text x="279" y="66" text-anchor="middle" font-size="12">new program</text>
    <rect x="319" y="20" width="80" height="60" rx="6" fill="#ffa94d" fill-opacity="0.35" stroke="currentColor"/>
    <text x="359" y="46" text-anchor="middle" font-weight="700">C · 13</text><text x="359" y="66" text-anchor="middle" font-size="12">read skeleton</text>
    <rect x="399" y="20" width="231" height="60" rx="6" fill="#f06595" fill-opacity="0.3" stroke="currentColor"/>
    <text x="514" y="46" text-anchor="middle" font-weight="700">D · 37 marks</text><text x="514" y="66" text-anchor="middle" font-size="12">modify skeleton (Q12–Q15)</text>
    <line x1="319" y1="95" x2="630" y2="95" stroke="currentColor"/><line x1="319" y1="89" x2="319" y2="101" stroke="currentColor"/><line x1="630" y1="89" x2="630" y2="101" stroke="currentColor"/>
    <text x="474" y="118" text-anchor="middle" font-size="12" font-weight="700">50 marks on the skeleton program</text>
  </g>
</svg>

## Question-by-question map

Predictions are based on the EAD's mark totals and the number of answer parts. Treat them as likely, not certain.

| Q | Parts | Marks | Section | What it will almost certainly be |
|---|---|---|---|---|
| 01 | 4 | 6 | A | Theory: short-answer parts; 01.3 has a multi-row answer (likely a table) |
| 02 | 4 | 6 | A | Theory: short-answer parts |
| 03 | 2 | 6 | A | Theory: 03.1 has extra rows (trace table or diagram) |
| 04 | 6 | 8 | A | Theory: six short parts, 1–2 marks each |
| 05 | 3 | 9 | A | Theory: longer explanation or algorithm |
| 06 | 1 | 2 | A | Theory: one short question |
| 07 | 2 | 13 | B | Write a new program (07.1) and screenshot a test (07.2) |
| 08 | 1 | 2 | C | Skeleton: name/identify something (an identifier or OOP feature) |
| 09 | 2 | 3 | C | Skeleton: identify + explain |
| 10 | 3 | 6 | C | Skeleton: explain design choices, trace, or class relationships |
| 11 | 1 | 2 | C | Skeleton: explain one thing |
| 12 | 2 | 6 | D | Small modification + test (validation, menu, message) |
| 13 | 2 | 7 | D | Small–medium modification + test |
| 14 | 2 | 11 | D | Medium modification, often a new method + menu option |
| 15 | 2 | 13 | D | Largest modification: new class/subclass or file handling |

## How Section D answers are marked

::::columns
:::note Part .1 — the code
- Paste **every changed method in full**, plus any new class or method. The EAD advice says "every line and the full length of every line".
- Paste **from your IDE** so the indentation survives. Changed formatting that alters how Python runs can cost marks.
- Marks go to **individual features**: a correct loop, a correct condition, a correct message, a new method in the right class. A partial answer still scores.
:::
|||
:::note Part .2 — the test screenshot
- Run **exactly** the test the question describes, with the inputs it names.
- The capture must show the **inputs and the outputs**. Resize it so it is readable.
- Usually 1–2 marks. They are the **cheapest marks on the paper**, so never skip them, even if your code is incomplete.
:::
::::

:::trap Exam traps in Section D
- **If your change breaks the program, the screenshot mark goes.** Save a working copy before each question and test as you go. Don't write all four Section D answers and then run once.
- **Pasting only the lines you changed.** The examiner needs the whole method to see it in context. Paste the full method.
- **Hard-coding values.** Use `self.__GridSize`, not 6 — `game1` is 4×4, and examiners often test with a different file.
- **Changing the wording of messages.** If the question gives a message, copy it character for character, including punctuation.
- **Testing with your own inputs.** The screenshot must use the inputs the question names, in that order.
:::

## Timing plan

| Section | Marks | Suggested time | Why |
|---|---|---|---|
| A | 37 | 45–50 min | Theory you can answer from memory; don't over-write 1-mark answers |
| B | 13 | 20 min | Build in small steps, run often |
| C | 13 | 15 min | You already know this code — be precise and quick |
| D | 37 | 60–65 min | Most marks per minute for well-prepared candidates |
| Check | — | 5 min | Make sure every screenshot is pasted and readable |

:::tip A sensible order
Many students do **Section D first** while they are fresh (it is the most practised and highest-value section), then C, then B, then A. Whatever order you choose, decide it **before** the exam and practise it in a timed mock. The EAD lets you answer in any order.
:::

:::steps Before every Section D question
1. Read the whole question, including the test. Underline exact messages and names.
2. Find the method(s) to change. Know the code well enough to go straight there (see [P.2](#/topic/P.2)).
3. Save a backup copy of the working program.
4. Make the change in small steps; run after each.
5. Run the **exact** test; screenshot inputs and outputs.
6. Paste every changed/new method **in full** into `.1`, and the screenshot into `.2`.
:::

## Section A and Section B in brief

- **Section A** comes from the Paper 1 content: programming, data structures, algorithms and theory of computation. Topics that recur: trace tables, FSMs and Mealy machines, Turing machines, regular expressions, BNF and syntax diagrams, RPN, graph and tree traversal, Dijkstra, Big-O, sorting and searching, stacks, queues and hash tables, recursion and the call stack, class diagrams, halting problem. Each links to its full page on this site: start from [Section 1](#/section/1), [2](#/section/2), [3](#/section/3) and [4](#/section/4).
- **Section B** is a short standalone program from a specification (07.1, most of the marks) plus a test screenshot (07.2). Marks reward each working feature separately: input, validation loop, core logic, correct output format. Practise on [P.6](#/topic/P.6).

:::exam
- In Section C, "**identify**" wants the **exact identifier** (and a line number helps); "**explain**" wants **what** the code does **and why**, tied to the actual code.
- In Section D, an incomplete but **runnable** answer with a screenshot usually beats a complete-looking answer that crashes.
- Theory answers: one creditworthy point per mark. A 2-mark "explain" needs two distinct points.
:::

:::recap
- 100 marks: **A 37 · B 13 · C 13 · D 37**. Half the paper is the skeleton.
- Section D: paste **whole methods**, screenshot the **exact** test, test as you go, keep a backup.
- Copy given messages exactly; never hard-code the grid size.
- Plan your section order and timings before the day.
:::

:::related
- [P.2 The game and the code](#/topic/P.2)
- [P.3 Bugs, weaknesses and unused features](#/topic/P.3)
- [P.5 Section D: practice modifications](#/topic/P.5)
- [R.3 Exam technique and command words](#/topic/R.3)
:::

*/});
