CS.registerTopic({ id: "R.3", title: "Exam technique and command words" }, function () {/*

:::objectives
- Know what each AQA **command word** demands and how much to write for it.
- Understand how **points-based** and **levels-of-response** mark schemes work, and how 1–12-mark questions are allocated.
- Know the structure of **Paper 1** (on-screen, skeleton program) and **Paper 2** (written), and manage your time.
- Use reliable methods for **trace tables**, **writing code/pseudocode** and **algorithm** questions.
- Plan and write a **9- or 12-mark extended response** that reaches the top level.
:::

:::quick At a glance
- **State / Give / Name / Identify**: recall, no explanation. **Describe**: what it is or does. **Explain**: *why* or *how*, with reasons ("because…", "so that…").
- **Compare**: similarities *and/or* differences, as **paired** points. **Discuss**: different sides. **Evaluate**: weigh up and **reach a judgement**. **Justify**: give reasons for a choice.
- **Marks tell you how much to write**: roughly one creditworthy point per mark on points-based questions.
- **Levels of response** (typically 9 or 12 marks): marked holistically on **coverage, depth, technical accuracy and line of reasoning**.
- **Paper 1**: on-screen, 2 h 30, 100 marks, 40%, programming + skeleton program. **Paper 2**: written, 2 h 30, 100 marks, 40%.
- **About 1.5 minutes per mark** on both papers.
- Trace tables: **one row per change**, follow the code literally, never skip a line.
:::

:::keyterms
Command word :: The instruction word at the start of a question (State, Describe, Explain…) that tells you what kind of answer is required. :: The word that says what to do.
Points-based mark scheme :: A mark scheme listing creditworthy points, each worth one mark, up to the total. :: One mark per correct point.
Levels of response :: A mark scheme in which the whole answer is placed in a level using descriptors of quality, then given a mark within that level. :: Marked as a whole, by quality.
Indicative content :: The list of relevant points a levels-of-response answer might include; not a checklist, and other valid points are credited. :: Ideas the examiner expects to see.
Line of reasoning :: A logically connected, structured argument in which each point follows from and supports the previous ones. :: An argument that flows and builds.
Skeleton program :: The program supplied in advance for Paper 1, which questions in the exam ask you to analyse and modify. :: The pre-release code you study before Paper 1.
Preliminary material :: The information released in advance of Paper 1 describing the skeleton program's context. :: The pre-release brief.
Electronic Answer Document (EAD) :: The document into which Paper 1 answers, code and screenshots are typed or pasted. :: Your on-screen answer file.
Trace table :: A table recording the values of variables (and outputs) as an algorithm is executed by hand, line by line. :: A step-by-step record of a dry run.
:::

:::note Check the current AQA documents
Paper structures and mark allocations below reflect the AQA 7517 specification as best known when written. Details such as the number of sections, the exact split of marks and the release date of the preliminary material can change. **Check the current AQA specification, specimen papers and your teacher's guidance.**
:::

## Command words

:::figure The command-word ladder: each step up demands more than the one below
<svg class="diagram" viewBox="0 0 680 260" role="img" aria-label="Staircase of command words from State, needing recall only, up to Evaluate, needing both sides and a judgement">
  <defs><marker id="arrR3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" fill="currentColor">
    <rect x="20" y="185" width="125" height="65" rx="4" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/>
    <text x="82" y="205" text-anchor="middle" font-weight="bold" font-size="13">State / Give</text>
    <text x="82" y="223" text-anchor="middle" font-size="11">recall a fact</text>
    <rect x="150" y="145" width="125" height="105" rx="4" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/>
    <text x="212" y="165" text-anchor="middle" font-weight="bold" font-size="13">Describe</text>
    <text x="212" y="183" text-anchor="middle" font-size="11">what it is</text>
    <text x="212" y="197" text-anchor="middle" font-size="11">or what it does</text>
    <rect x="280" y="105" width="125" height="145" rx="4" fill="#7c9aff" fill-opacity="0.35" stroke="currentColor"/>
    <text x="342" y="125" text-anchor="middle" font-weight="bold" font-size="13">Explain</text>
    <text x="342" y="143" text-anchor="middle" font-size="11">why or how,</text>
    <text x="342" y="157" text-anchor="middle" font-size="11">with reasons</text>
    <rect x="410" y="65" width="125" height="185" rx="4" fill="#7c9aff" fill-opacity="0.45" stroke="currentColor"/>
    <text x="472" y="85" text-anchor="middle" font-weight="bold" font-size="13">Compare</text>
    <text x="472" y="103" text-anchor="middle" font-size="11">paired similarities</text>
    <text x="472" y="117" text-anchor="middle" font-size="11">and differences</text>
    <rect x="540" y="25" width="125" height="225" rx="4" fill="#7c9aff" fill-opacity="0.55" stroke="currentColor"/>
    <text x="602" y="45" text-anchor="middle" font-weight="bold" font-size="13">Evaluate</text>
    <text x="602" y="63" text-anchor="middle" font-size="11">both sides</text>
    <text x="602" y="77" text-anchor="middle" font-size="11">+ a judgement</text>
    <line x1="30" y1="40" x2="330" y2="40" stroke="currentColor" marker-end="url(#arrR3)"/>
    <text x="30" y="28" font-size="12">each step up: more depth, reasoning and length</text>
  </g>
</svg>
:::

Read the command word **first**. It decides the shape of the answer more than the topic does.

| Command word | What it demands | Mini example (and a creditworthy answer) |
|---|---|---|
| **State / Give / Name** | Recall a fact. No explanation needed. | *State the purpose of the MAR.* "Holds the address of the memory location to be read from or written to." |
| **Identify** | Pick out or name something from information given (code, diagram, scenario). | *Identify a local variable in Figure 2.* "`count`" |
| **Define** | Give the precise meaning of a term. | *Define an algorithm.* "A sequence of steps that can be followed to complete a task and that always terminates." |
| **Describe** | Set out the characteristics or the steps of something. *What* it is / *what* happens. | *Describe a stack.* "Items are added and removed at the same end, the top; last in, first out." |
| **Explain** | Give reasons or causes: *why* or *how*. Use "because", "so", "which means". | *Explain why a binary search is faster than a linear search on a sorted list.* "Each comparison halves the remaining items, so at most log<sub>2</sub> n comparisons are needed instead of up to n." |
| **Outline** | A brief description of the main points. | *Outline the fetch stage.* "PC copied to MAR; instruction fetched into MBR; PC incremented; MBR copied to CIR." |
| **Compare** | Similarities **and/or** differences, linked to both items. | *Compare RAM and ROM.* "RAM is volatile **whereas** ROM is non-volatile; RAM can be written to **whereas** ROM is read-only." |
| **Discuss** | Present key points about different aspects, **for and against**, with reasoning. | *Discuss the use of facial recognition by police.* Benefits, risks, legal and ethical issues, with reasons. |
| **Evaluate** | Weigh strengths and weaknesses against evidence and **reach a judgement**. | *Evaluate the use of a hash table here.* …"Overall, a hash table is suitable because lookups dominate and the data size is predictable." |
| **Justify** | Support a choice or conclusion with reasons/evidence. | *Justify your choice of test data.* "21 is boundary data because it is the largest valid age…" |
| **Suggest** | Apply knowledge to an unfamiliar context; more than one answer may be acceptable. | *Suggest why the program crashes when the file is empty.* "Division by the record count, which is zero." |
| **Calculate** | Work out a numerical answer. **Show your working**. | *Calculate the file size.* "1024 × 768 × 24 = 18 874 368 bits = 2 359 296 bytes" |
| **Write** | Produce program code or pseudocode (or an expression, e.g. SQL, BNF). | *Write an SQL query to…* `SELECT Name FROM Student WHERE Year = 13;` |
| **Complete** | Fill in a table, diagram or code that is partly given. | *Complete the truth table.* |
| **Trace** | Follow an algorithm's execution and record the values, usually in a given table. | *Trace the algorithm with input 6.* |
| **Draw / Label** | Produce or annotate a diagram using standard notation. | *Draw an ER diagram.* |
| **Convert / Show** | Change between forms; "show" means include every step that gets you there. | *Show that 0.1011 × 2<sup>3</sup> is 5.5.* |

:::trap Command word mistakes
- **Describing when asked to explain**: "A hash table stores data in buckets" describes. "…so items can be found in close to constant time because the address is calculated from the key" explains.
- **Compare with two separate lists**: write paired points using **whereas**, **but**, **more/less than**.
- **Evaluate or discuss with no conclusion**: the top level needs a judgement or a balanced conclusion.
- **State with a paragraph**: wastes time and can introduce a contradiction that cancels the mark.
:::

## How questions are marked

### Points-based questions (1–8 marks)

- The mark scheme lists **creditworthy points**; each correct, distinct point earns one mark up to the total.
- A rough guide: **one mark per point**, and for "explain" questions the reason itself is usually the mark.
- Repeating the same idea in different words earns **one** mark.
- **Contradictions** can cancel a mark ("RAM is volatile… RAM keeps data when the power is off").
- Mark schemes include "**A.**" (accept), "**R.**" (reject), "**I.**" (ignore) and "**MAX**" notes. A correct answer the scheme did not list can still be credited if it is valid.

| Marks | Typical expectation |
|---|---|
| 1 | One fact, value or term |
| 2 | Two distinct points, or a point plus its explanation |
| 3–4 | Three or four distinct points; for code: each step (initialise, loop, condition, output) is a mark |
| 5–8 | Longer explanations, larger code tasks, or multi-step calculations; marks for each correct step |

### Levels-of-response questions (typically 9 or 12 marks)

The answer is read **as a whole** and placed in a **level**, then a mark within the level. Examiners consider:

- **Coverage**: have you addressed **every part** of the question (e.g. "legal *and* ethical", "advantages *and* disadvantages")?
- **Depth**: are points developed (consequence, example, reason), not just listed?
- **Technical accuracy** and correct terminology.
- **Line of reasoning**: is it coherent, logically structured and substantiated, leading to a conclusion where asked?

On **Paper 2**, the discursive questions on the **consequences of uses of computing** (moral, ethical, legal, cultural) are usually levels-of-response, but technical topics can be too. See [8.3 Writing extended discursive answers](#/topic/8.3).

:::collapse Typical levels descriptor (paraphrased; check the current mark schemes)
| Level | Marks (9-mark question) | Descriptor |
|---|---|---|
| 3 | 7–9 | A line of reasoning has been followed to produce a coherent, relevant, substantiated and logically structured response. The response covers all the areas indicated in the question, with sufficient detail in most of them to show a good level of understanding. Technical terms are used accurately. |
| 2 | 4–6 | A line of reasoning is present, with some structure. The response covers at least two of the areas indicated, with some detail in at least one, showing reasonable understanding. |
| 1 | 1–3 | A few relevant points, with little or no structure or development. Understanding is limited. |
| 0 | 0 | Nothing worthy of credit. |

12-mark questions use the same idea with four levels (typically 1–3, 4–6, 7–9, 10–12).
:::

## Worked levelled answer

:::example A 9-mark question marked against the levels
**Question.** A supermarket chain plans to use the purchase histories collected through its loyalty card scheme to predict customers' life events (such as pregnancy or illness) and send them targeted offers. **Discuss the ethical, legal and moral issues** that this raises. *[9 marks]*

**Indicative content (examiner's list):** consent and whether customers understand how data is used · UK GDPR / Data Protection Act 2018: purpose limitation, lawful basis, special category data (health) · right to object to profiling / direct marketing · accuracy of predictions and harm from false inferences · revealing sensitive information to other household members · power imbalance between company and customer · benefits: relevant offers, lower prices, customer value · security of large datasets and breach risk.

**Answer A (Level 2, 5 marks)**

> The supermarket could break the Data Protection Act if it uses data without permission. People might not like being targeted with offers. It could also be good for customers because they get offers they want. The data could be hacked, which would be bad. It is unethical to predict if someone is pregnant.

*Examiner commentary:* covers legal, ethical and a benefit, so at least two areas. Points are relevant but **undeveloped**: no explanation of *which* principle is broken, *why* targeting is harmful, or *how* the issues weigh up. Little line of reasoning, no conclusion. Level 2, low-to-mid: **5**.

**Answer B (Level 3, 9 marks)**

> **Legal.** Under UK GDPR and the Data Protection Act 2018, personal data must be collected for specified purposes and processed lawfully. Customers joined the scheme for discounts, so inferring health conditions or pregnancy may be a new purpose they did not consent to. Health data is special category data, which needs explicit consent, and customers have the right to object to profiling for direct marketing. The supermarket would need clear consent and an easy opt-out.

> **Ethical.** Even if legal, predictions can be wrong or intrusive. A mailing about baby products could reveal a pregnancy to other people in the household before the customer chose to tell them, causing real harm. Customers are unlikely to understand how much can be inferred from their shopping, so there is a power imbalance: the company benefits from knowledge the customer did not knowingly give.

> **Moral and benefits.** Some customers would value relevant offers and lower prices, and the scheme is voluntary. However, the more sensitive the inference, the greater the duty of care, including keeping such a large dataset secure, because a breach would expose highly personal information.

> **Conclusion.** Targeting based on everyday purchases is acceptable with informed consent, but predicting sensitive life events crosses a line unless customers explicitly opt in. The supermarket should limit profiling to non-sensitive categories, explain it clearly and offer an easy opt-out.

*Examiner commentary:* **all three areas** covered with developed points (legal principle → application → consequence); accurate terminology (special category data, purpose limitation, right to object); balanced, with benefits; a **clear line of reasoning** to a justified conclusion. Level 3, top: **9**.
:::

:::steps Planning a 9- or 12-mark answer (about 1–2 minutes of planning)
1. **Underline the areas** the question names (e.g. ethical, legal, moral; advantages and disadvantages).
2. **List 2–3 points per area**, each with a "because/so" development and, where possible, an example from the scenario.
3. **Order** the points so each section builds on the last.
4. **Write in paragraphs** with a short heading or topic sentence per area.
5. **Finish with a judgement** that follows from what you wrote (essential for "evaluate"; strongly advisable for "discuss").
:::

## The papers

| | **Paper 1 (7517/1)** | **Paper 2 (7517/2)** |
|---|---|---|
| Format | **On-screen** exam: answers typed into an Electronic Answer Document; you write and run code in your chosen language | **Written** exam |
| Time / marks / weight | 2 h 30 min · 100 marks · 40% | 2 h 30 min · 100 marks · 40% |
| Content (check) | Programming; data structures; algorithms; theory of computation (spec 4.1–4.4) | Data representation; computer systems; organisation and architecture; consequences; networking; databases; big data; functional programming (spec 4.5–4.12 per the school's course overview) |
| Advance material | **Preliminary material and a skeleton program** released before the exam | None |
| Structure (typical; check) | Section A short questions and programming; Section B write a program; Section C questions on the skeleton program; Section D modify the skeleton program | Compulsory short-answer and extended-answer questions, including levels-of-response questions |

The **NEA** is the remaining **20%** ([14.1](#/topic/14.1)).

:::tip Preparing for the skeleton program
- Run it, play with it, and **read every subroutine**. Draw a hierarchy chart of how the subroutines call each other.
- List the **data structures** and what each holds; note any classes and inheritance.
- Predict modifications ("add validation to…", "add a new option that…") and **practise implementing them** under time pressure.
- In the exam, paste **all requested code and screenshots** into the EAD: unevidenced work earns nothing.
:::

## Time management

- Both papers: **150 minutes for 100 marks ≈ 1.5 minutes per mark**. A 4-mark question deserves about 6 minutes; a 9-mark question about 13–14 minutes including planning.
- **Paper 1**: protect the time for the programming sections (B and D), which carry many marks. Do not spend 20 minutes polishing a 3-mark theory answer.
- **Paper 2**: do not let one calculation eat 10 minutes; mark it, move on, come back.
- Leave **5–10 minutes** to check: units, unanswered parts, code evidence pasted, "show your working" shown.

## Question types: methods that work

### Trace tables

1. Write the **initial values** of every variable before the first line runs.
2. Follow the code **literally, one line at a time**, including loop condition checks.
3. **New row only when a value changes** (or follow the layout the table gives you exactly).
4. For loops, check the condition **every time**, including the final check that ends the loop.
5. Record **OUTPUT** in the output column at the moment it happens.
6. Watch for `DIV`/`MOD`, integer vs real division, and string vs number comparisons.

See the trace challenges throughout the site, e.g. [2.3 Stacks](#/topic/2.3).

### Writing code or pseudocode

- **Read the whole question** and note every requirement; tick them off as you write.
- Use the **identifiers** the question gives.
- Structure: **initialise → input/validate → loop with correct condition → process → output/return**.
- Indent consistently and close every block; any clear language or pseudocode is accepted unless the question says otherwise. See [R.1](#/topic/R.1).
- **Dry-run with the question's example data** before moving on.
- Paper 1: **test your program**, and screenshot exactly the tests asked for.

### Algorithm and "explain how" questions

- Name the **data structure** and the **key steps** in order; mention termination conditions (e.g. "until the list is empty / the item is found").
- For efficiency questions, give the **Big-O** and **why** (e.g. "halves the search space each comparison").

### Calculation questions

- **Show working** with units at every step. Method marks are available even if the final answer is wrong.
- Check powers of two (2<sup>10</sup> = 1024) vs powers of ten (kilo = 1000) as the question requires.

## Common ways marks are lost

| Mistake | Fix |
|---|---|
| Answering the question you hoped for, not the one asked | Underline the command word and the key nouns |
| Generic answers ("it is faster", "more efficient", "easier") | Say faster *at what* and *why*, in the scenario's context |
| One-sided "discuss" or no conclusion to "evaluate" | Plan both sides; finish with a justified judgement |
| Not using the scenario | Quote names/details from the question in your answer |
| Missing initialisation, off-by-one loop bounds | Dry-run your code with the given data |
| Missing evidence in Paper 1 | Paste code **and** screenshots into the EAD after each question |
| Running out of time on a low-mark question | 1.5 minutes per mark; move on and return |
| Contradicting yourself | One clear statement per point; don't hedge both ways |

:::exam
- **Before writing**: command word → marks → number of points → which parts of the question each point answers.
- **Short answers**: precise technical vocabulary scores; vague everyday language does not.
- **Long answers**: structured paragraphs, developed points, scenario-specific, ending with a judgement.
- **Code**: correct logic first, clear syntax second; any clear form is accepted.
:::

:::challenge
1. Take any 4-mark "explain" question from a past paper. Write a "describe" answer and an "explain" answer to it, and identify which sentences would score.
2. Write a 12-mark plan (in under 3 minutes) for: *"Discuss the impact of automation and artificial intelligence on employment."*
3. Mark Answer A above up to Level 3 by rewriting it, adding only developments and a conclusion.
:::

:::recap
- **State/Give/Identify** = recall; **Describe** = what; **Explain** = why/how; **Compare** = paired similarities/differences; **Discuss** = sides with reasoning; **Evaluate** = weigh up and judge; **Justify** = reasons for a choice.
- Points-based: about one mark per distinct, correct point. Levels-based: coverage, depth, accuracy, line of reasoning.
- Paper 1: on-screen, skeleton program, 2 h 30, 100 marks, 40%. Paper 2: written, 2 h 30, 100 marks, 40%. NEA 20%.
- About 1.5 minutes per mark; leave time to check.
- Trace literally; code with initialise → loop → process → output; show working on calculations.
:::

:::related
- [8.3 Writing extended discursive answers](#/topic/8.3)
- [R.1 AQA pseudocode and Python reference](#/topic/R.1)
- [13.1 Analysis, design, implementation, testing and evaluation](#/topic/13.1)
- [14.1 NEA overview](#/topic/14.1)
:::

*/});
