CS.registerTopic({ id: "14.1", title: "NEA overview, choosing a project and analysis" }, function () {/*

:::objectives
- State how the NEA is assessed: **75 marks, 20% of the A-level**, split across analysis, documented design, technical solution, testing and evaluation.
- Explain why the **level of technical skill** (Group A/B/C techniques) sets a ceiling on your technical solution mark.
- Choose a project that has a **real end user** and **enough complexity** to reach the top band, without being too big to finish.
- Plan a realistic timeline with milestones, backups and version control.
- Write an analysis that a third party can follow: background, investigation with the user, research, modelling and **numbered, measurable objectives**.
:::

:::quick At a glance
- The NEA is the **computing practical project**: **75 marks**, **20%** of the A-level. Teacher-marked, **moderated by AQA**.
- Marks: **Analysis 9 · Documented design 12 · Technical solution 42** (completeness 15 + techniques used 27) **· Testing 8 · Evaluation 4**.
- The **technical solution is 56%** of the NEA. The *techniques* you use (Group A = top band) decide its ceiling.
- Pick a problem with a **real end user** you can talk to, and with **Group A** techniques built in naturally (complex database, OOP, graphs/trees, recursion, hashing, complex algorithms).
- The analysis must show requirements **arrived at through dialogue with the user** and ending in **numbered, specific, measurable objectives**.
- Objectives are the backbone: testing and evaluation are marked **against them**.
- Start early, back up constantly, keep a dated log, and acknowledge any code you did not write.
:::

:::keyterms
Non-exam assessment (NEA) :: The computing practical project, in which students use a systematic approach to solve or investigate a practical problem; 75 marks, 20% of the A-level. :: Your coursework project.
End user (client) :: The real person or group the solution is for, whose needs define the requirements. :: The person you are building it for.
Third party :: Someone other than the student and the end user, e.g. a moderator, who must be able to follow the report. :: Write it so a stranger understands.
Objective :: A numbered, specific, measurable requirement that the solution must meet. :: A testable promise about what the system will do.
SMART objective :: An objective that is Specific, Measurable, Achievable, Relevant and Time-bound (or Testable). :: Clear enough to test with yes/no.
Level of technical skill :: The demand of the data model and algorithms used in the solution, judged against AQA's Group A, B and C examples. :: How hard the techniques are.
Group A techniques :: The most demanding examples in AQA's technical skills table, e.g. complex database model, hash tables, graphs/trees, recursion, complex OOP, complex user-defined algorithms. :: Top-band techniques.
Moderation :: The process by which AQA samples teacher-marked projects and adjusts marks so standards match across centres. :: AQA checks your teacher's marking.
Authentication :: The student and teacher signing to confirm the work is the student's own. :: Proving you did it yourself.
Investigative project :: An NEA in which the student investigates a problem (e.g. comparing algorithms or modelling a system) rather than building a product for a client; still requires code and an intended recipient of the outcomes. :: A research-style project.
Scope :: The boundaries of what the solution will and will not do. :: What is in and what is out.
:::

:::note Check against the current AQA documents
Everything here reflects the AQA 7517 specification and NEA guidance as best known when written. Mark allocations are stable, but wording of level descriptors, the technical skills table and deadlines can change. **Always check the current AQA specification (section 5, non-exam assessment) and your school's NEA handbook.** Where this page says "check", it means it.
:::

## What the NEA is

- A **programming project** on a problem **you choose**, usually for a **real end user**.
- It follows the systematic approach from [13.1](#/topic/13.1): analysis → design → implementation → testing → evaluation.
- You submit a **written report** (the documentation) plus the **program code** and **evidence** of it working.
- Your teacher marks it using AQA's **levels of response** criteria; AQA **moderates** a sample from each school and may move every mark in the school up or down.
- It is worth **20%** of the A-level. Papers 1 and 2 are 40% each.

:::why
Why does moderation matter to you? Because your *teacher* cannot simply be generous. If the moderator cannot find evidence for a mark in your report, the mark is lost, and so may other students' marks in your school. **If it isn't documented, it didn't happen.**
:::

## How the 75 marks are split

:::figure The NEA mark scheme: the technical solution is over half of the marks
<svg class="diagram" viewBox="0 0 700 160" role="img" aria-label="Stacked bar of 75 marks: analysis 9, design 12, completeness 15, techniques 27, testing 8, evaluation 4">
  <g font-family="inherit" font-size="13" stroke="currentColor">
    <rect x="20" y="50" width="79.2" height="46" fill="#7c9aff" fill-opacity="0.35"/>
    <rect x="99.2" y="50" width="105.6" height="46" fill="#7cd4ff" fill-opacity="0.35"/>
    <rect x="204.8" y="50" width="132" height="46" fill="#7cffb2" fill-opacity="0.3"/>
    <rect x="336.8" y="50" width="237.6" height="46" fill="#7cffb2" fill-opacity="0.55"/>
    <rect x="574.4" y="50" width="70.4" height="46" fill="#ffd37c" fill-opacity="0.35"/>
    <rect x="644.8" y="50" width="35.2" height="46" fill="#ff9a7c" fill-opacity="0.35"/>
    <path d="M204.8 40 V30 H574.4 V40" fill="none"/>
  </g>
  <g font-family="inherit" font-size="14" fill="currentColor" text-anchor="middle">
    <text x="389.6" y="22">Technical solution: 42 marks (56%)</text>
    <text x="59.6" y="78">9</text><text x="152" y="78">12</text><text x="270.8" y="78">15</text>
    <text x="455.6" y="78">27</text><text x="609.6" y="78">8</text><text x="662.4" y="78">4</text>
    <text x="59.6" y="118" font-size="12">Analysis</text><text x="152" y="118" font-size="12">Design</text>
    <text x="270.8" y="118" font-size="12">Completeness</text><text x="455.6" y="118" font-size="12">Techniques used</text>
    <text x="609.6" y="118" font-size="12">Testing</text><text x="680" y="138" font-size="12" text-anchor="end">Evaluation</text>
  </g>
</svg>
:::

| Section | Marks | % of NEA | What earns the marks (top band, paraphrased) |
|---|---|---|---|
| **Analysis** | 9 | 12% | A fully scoped analysis of a **real problem** that a third party can understand; requirements arrived at **through dialogue with the intended users**; a full set of **specific, measurable objectives**; the problem **modelled** well enough to use later |
| **Documented design** | 12 | 16% | A full design describing **how all the key aspects** of the solution are (or will be) structured: data, algorithms, modules, interface |
| **Technical solution: completeness** | 15 | 20% | A system that meets **all or almost all** of the requirements (objectives) |
| **Technical solution: techniques used** | 27 | 36% | Techniques at **Group A** level, applied **sensibly to complex problems**, in a well-designed program with **excellent coding style** |
| **Testing** | 8 | 11% | **Carefully selected, representative** evidence that **thorough** testing shows the solution is **robust** and the **requirements are met** |
| **Evaluation** | 4 | 5% | How well **each requirement** is met; **independent end-user feedback**, discussed meaningfully; realistic **improvements** |
| **Total** | **75** | | |

:::collapse Level bands as commonly published (check against the current AQA specification)
| Section | Levels and mark ranges |
|---|---|
| Analysis (9) | L3 7–9 · L2 4–6 · L1 1–3 |
| Documented design (12) | L4 10–12 · L3 7–9 · L2 4–6 · L1 1–3 |
| Completeness (15) | L3 11–15 · L2 6–10 · L1 1–5 |
| Techniques used (27) | L3 19–27 · L2 10–18 · L1 1–9 |
| Testing (8) | L4 7–8 · L3 5–6 · L2 3–4 · L1 1–2 |
| Evaluation (4) | L2 3–4 · L1 1–2 |

These are the ranges as understood when this page was written. The teacher finds the **best-fit level** first, then the mark within it. The exact wording of each descriptor is in the AQA specification; read it alongside your own work.
:::

:::trap
- Coding style is **not** a separate section. It is judged **inside "techniques used"** (27 marks) together with the level of technical skill. Messy code with Group A techniques can still be pulled down within the band.
- The **design** is called "documented design": it can be written up **after** prototyping, as long as it accurately describes how the final solution is structured. A design that does not match the code loses credibility.
- Evaluation is only **4 marks**. Do not write 20 pages of it; spend the time on the technical solution and testing.
:::

## The level of technical skill: why your project choice matters most

The **techniques used** mark is decided by the **most demanding techniques you use appropriately**. AQA publishes a table of example techniques grouped A (most demanding), B and C. The group sets the band; quality and coding style set the mark within it.

:::note Label: check against the current AQA guidance
The tables below reproduce the AQA technical skills examples **as best known**. AQA's wording is "examples", so equivalent techniques are accepted. Confirm against the current specification before relying on any single item.
:::

### Table 1: examples of technical skill

| Group | Model (including data model/structure) | Algorithms |
|---|---|---|
| **A** | Complex data model in a database (e.g. several interlinked tables) · Hash tables, lists, stacks, queues, graphs, trees or structures of equivalent standard · Files organised for direct access · Complex scientific/mathematical/robotics/control/business model · Complex user-defined use of object-oriented programming (OOP), e.g. classes, inheritance, composition, polymorphism, interfaces · Complex client-server model | Cross-table parameterised SQL · Aggregate SQL functions · User/CASE-generated DDL script · Graph/tree traversal · List operations · Linked list maintenance · Stack/queue operations · Hashing · Advanced matrix operations · Recursive algorithms · Complex user-defined algorithms (e.g. optimisation, minimisation, scheduling, pattern matching) or equivalent difficulty · Merge sort or similarly efficient sort · Dynamic generation of objects based on complex user-defined use of OOP model · Server-side scripting using request and response objects and server-side extensions for a complex client-server model · Calling parallel functions |
| **B** | Simple data model in a database (e.g. two or three interlinked tables) · Multi-dimensional arrays · Dictionaries · Records · Text files · Files organised for sequential access | Single-table or non-parameterised SQL · Bubble sort · Binary search · Writing and reading from files · Simple user-defined algorithms (e.g. a range of mathematical/statistical calculations) · Generation of objects based on a simple OOP model · Server-side scripting using request and response objects and server-side extensions for a simple client-server model |
| **C** | Single-dimensional arrays · Appropriate choice of simple data types · Single-table database | Linear search · Simple mathematical calculations (e.g. average) · Non-SQL table access |

### Table 2: coding style characteristics

The categories are **cumulative**: "excellent" assumes everything in "good" and "basic" too.

| Style | Characteristics (as best known; check) |
|---|---|
| **Excellent** | Modules (subroutines) with appropriate interfaces · Loosely coupled modules (interact only through their interfaces) · Cohesive modules (each does one job) · Modules grouped by common purpose (e.g. classes, files) · Defensive programming · Good exception handling |
| **Good** | Well-designed user interface · Modularisation of code · Good use of local variables · Minimal use of global variables · Managed casting of types · Use of constants · Appropriate indentation · Self-documenting code · Consistent style throughout · File paths parameterised |
| **Basic** | Meaningful identifier names · Annotation (comments) used effectively where required |

:::trap The ceiling effect
- If the hardest thing in your project is a **single-table database and a linear search**, the techniques mark is capped in the **bottom band**, however beautiful the code. That is up to 27 marks gone at the choosing stage.
- Using a **library** call (e.g. `sorted()`, a graph library's `shortest_path()`) does **not** show you can do the algorithm. Write the Group A algorithm yourself if you want credit for it.
- One token Group A feature bolted on (a recursive function nobody needs) is weaker than Group A techniques used **sensibly to solve the problem**. The descriptor stresses *appropriate* use on *complex problems*.
:::

## Choosing a project

### What a good project has

- **A real end user** you can **meet several times**: a relative's business, a club, a teacher, a local charity, a department in school. They give the analysis its interviews and the evaluation its independent feedback.
- **A genuine problem** with data and processing in it, not just screens.
- **Group A techniques that arise naturally**: a relational database with several linked tables, a scheduling or optimisation algorithm, graph/tree structures, recursion, a proper OOP class hierarchy.
- **A manageable core**: you can describe the critical path in two sentences and build a working version of it by Christmas of Year 13.
- **Room to grow**: extra features for if things go well, which also become your "improvements" in the evaluation if they don't.

### Good, risky and weak project ideas

| Idea | Verdict | Why |
|---|---|---|
| League fixtures and results manager for a local junior football league (fixture scheduling algorithm, multi-table database, league table merge sort) | **Good** | Real user (league secretary); complex scheduling algorithm; several linked tables; clear objectives |
| Revision timetable generator for a sixth-form, scheduling around clashes and priorities | **Good** | Scheduling/optimisation algorithm; real users (students, teacher); measurable outputs |
| Route planner for a local delivery business using Dijkstra/A* on a road graph | **Good** | Graph structure + traversal; user with a real cost problem |
| A 2D platform game | **Risky** | Can be Group A (physics model, pathfinding AI, level as a graph) but often ends up as graphics and assets with simple logic; end user is vague |
| A website with a contact form and a few pages | **Weak** | Mostly front-end; little processing; techniques at Group C |
| Clone of a big app (e.g. a full social network) | **Weak** | Far too large to complete, so completeness suffers; no real user |
| Following a YouTube tutorial project | **Weak** | Not your own design; tutorial code earns no credit and may raise authenticity concerns |

:::tip The two-question test
1. *"Who exactly will use this, and can I talk to them next week?"*
2. *"Which Group A techniques will I need, and why does the problem need them?"*
If you cannot answer both in one sentence each, keep looking.
:::

:::collapse Investigative projects (less common)
AQA also allows **investigative** projects, for example comparing the performance of algorithms on real data, or simulating a system to answer a question. The same five sections apply: the "end user" becomes the **intended recipient of the outcomes** (someone who wants the answer), the technical solution is the code you wrote to carry out the investigation, and testing/evaluation are about whether the investigation's objectives were met. Discuss this with your teacher first: it is harder to evidence well.
:::

## Planning the project

Your school sets internal deadlines; AQA's deadline for schools to submit marks and samples is in **May of Year 13** (check the current date). A typical plan:

| When (typical) | Milestone | Evidence to keep |
|---|---|---|
| Summer term, Year 12 | Choose project; first interview with end user; research existing solutions | Interview notes/recording, screenshots of existing systems |
| End of Year 12 / September | Analysis finished: models and agreed objectives | Signed-off objectives (email from user) |
| September–October | Design of data, key algorithms, UI; prototype of the critical path | Prototype screenshots, user feedback |
| October–January | Iterative development; show the user working versions | Dated commits, logbook, feedback notes |
| January–February | Testing: test plan executed, video evidence, fixes | Test videos with timestamps, fix log |
| February–March | End-user acceptance testing and feedback; evaluation | Signed/dated feedback from user |
| March | Final report assembled, proof-read, code listing appended | Complete report |

:::steps Habits that save projects
1. **Version control** (e.g. Git) or at least dated backups in two places. Losing work is not a valid reason for a missing section.
2. Keep a **development log**: date, what you did, what broke, what you decided and why. It becomes your design/development narrative.
3. **Write as you go.** Documenting a section months later produces vague, unconvincing writing.
4. Record **user meetings** (with permission) or take notes and get the user to confirm them by email.
5. **Acknowledge every source**: tutorials, Stack Overflow answers, libraries, any AI assistance. Unacknowledged use of someone else's work (including AI-generated code) can be treated as malpractice under JCQ rules; acknowledged borrowed code simply earns no credit. Follow your school's policy.
:::

## Writing the analysis (9 marks)

The analysis must let a **third party** (the moderator) understand the problem as well as you do, and must end with objectives that everything else is measured against.

### 1. Background and problem definition

- Who the end user is, their organisation, and their role.
- What happens **now** (the current system, manual or computerised) and **what is wrong** with it, with specifics: "the secretary spends about 4 hours each season creating fixtures by hand and has twice scheduled a team to play two matches on the same day".
- Why a computer-based solution is appropriate.

### 2. Investigation with the end user

This is where "requirements arrived at by considering, **through dialogue**, the needs of the intended users" is evidenced.

- **Prepare questions** that dig into data, processing, volumes, outputs and frustrations.
- Include the **transcript or detailed notes** (in an appendix if long) and **summarise what you learned** from each answer.
- Hold a **follow-up** interview or show a **prototype**; record how the requirements changed. Dialogue means more than one exchange.
- Questionnaires or observation are useful extras, especially if there are many users.

:::example Interview questions that produce useful requirements
1. *Walk me through what you do from the start of the season to the end.* (process)
2. *What information do you keep about each team, player and match? Where?* (data model)
3. *Roughly how many teams, divisions, matches per season?* (volumes, boundaries for testing)
4. *What rules must fixtures follow?* (algorithm constraints: no team twice in a round, alternate home/away, pitch availability)
5. *What goes wrong most often?* (priorities)
6. *Who else needs to see the information, and on what devices?* (users, platform)
7. *How confident are the people who will use it with computers?* (HCI requirements)
8. *If the system did only one thing well, what should it be?* (critical path)
:::

### 3. Research of existing solutions

- Look at 2–3 existing products or similar systems. Include **screenshots** and say **what you will adopt** and **what you will avoid**, and why.
- Research the **algorithms and techniques** you might use (e.g. the round-robin "circle method" for fixtures, Dijkstra for routes), with references.
- Note any constraints: hardware the user has, data protection (UK GDPR / Data Protection Act 2018) if storing personal data.

### 4. Modelling the problem

"Problem sufficiently well modelled to be of use in subsequent stages." Pick the models that suit your project:

- **Entity relationship diagram** (and draft entity descriptions) for database projects. See [10.1](#/topic/10.1).
- **Data flow diagram** showing data sources, processes and outputs.
- **Class diagram** sketch for OOP projects. See [1.8](#/topic/1.8).
- **Graph/network** diagram, state diagram or mathematical model where relevant (e.g. the road network as a weighted graph).
- **Input–process–output** tables, or **use-case** descriptions of what each user does.

### 5. Objectives

The single most important part of the analysis. Number them hierarchically so tests and the evaluation can refer to them (e.g. "Objective 3.2").

:::columns
**Weak objectives**
- The system should be easy to use.
- The program will store player data.
- Make fixtures.
- It must be fast.
|||
**Strong (SMART) objectives**
- **3.1** The secretary must be able to add a team by entering a name (1–30 characters) and an age group selected from U9–U16; duplicates within an age group must be rejected with a message.
- **4.1** The system must generate a double round-robin fixture list for 3–16 teams in which every pair of teams plays exactly twice (once at each home ground) and no team plays twice in one round.
- **6.2** The league table must be recalculated within 2 seconds of a result being saved, ordered by points, then goal difference, then goals scored.
:::

For each objective, add a **one-line justification** linking it to the evidence ("from interview 1, Q4"). Separate **essential** objectives from **desirable** ones so the evaluation can show what was prioritised.

:::trap Analysis marks lost here
- **No real dialogue**: a single short interview with yes/no answers, or a "user" who is clearly invented.
- **Unmeasurable objectives** ("user-friendly", "efficient") that cannot be tested, which then weakens testing *and* evaluation.
- **Objectives about the code, not the user's needs** ("use a class") or objectives that are trivially small, missing the complex parts of the solution.
- **Research with no conclusions**: screenshots of other apps with no "so I will…".
- **No models**, or models that are not used later in the design.
- Objectives that **change silently**. If they change, show the dialogue that changed them.
:::

:::collapse Self-review checklist: analysis
- [ ] Background identifies the end user by role and explains the current system and its problems with specific examples.
- [ ] Evidence of dialogue: at least one detailed interview **plus** a follow-up or prototype feedback, with what was learned from each.
- [ ] Research of existing solutions with screenshots and clear conclusions ("adopt… avoid…").
- [ ] Research into the key algorithms/techniques, referenced.
- [ ] At least one useful model (ER diagram, DFD, class diagram, graph model) that the design will build on.
- [ ] Numbered, specific, measurable objectives covering **all** the functionality, including the complex parts.
- [ ] Each objective justified by reference to the user's needs.
- [ ] Scope and limitations stated (what the system will not do).
- [ ] Could a stranger understand the problem from this section alone?
- [ ] User has confirmed the objectives (email/signature, dated).
:::

:::exam
**How this links to Paper 2.** Section 4.13 questions (see [13.1](#/topic/13.1)) ask you to name requirement-gathering methods, explain acceptance testing and choose test data. Your NEA gives you real examples to quote: "in my project I used an interview because…".

**How the moderator reads your analysis**
- They look for the **dialogue**: real questions, real answers, and requirements that clearly came from them.
- They look for **measurable objectives**: they will later check your testing and evaluation against them.
- They look for a **model** that reappears in your design.
- Write for a **third party**: no unexplained jargon about the user's domain, no "as discussed".
:::

:::challenge
1. Write five SMART objectives for a project of your own. For each, write the test you would use to prove it has been met.
2. Take a weak project idea from the table above and redesign it so that at least two Group A techniques are genuinely needed.
3. Draft eight interview questions for your end user, labelling which part of the analysis each one feeds (data model, process, volumes, HCI, priorities).
:::

:::recap
- NEA: **75 marks, 20%**; teacher-marked, **AQA-moderated**; evidence must be in the report.
- **Analysis 9 · Design 12 · Technical solution 42 (completeness 15 + techniques 27) · Testing 8 · Evaluation 4**.
- The **techniques used** band is set by your **Group A/B/C** level, then refined by coding style (cumulative basic → good → excellent).
- Choose a **real end user** and a problem that **needs** Group A techniques, with a core you can finish.
- Plan milestones; use version control, a dev log, and acknowledge all sources.
- Analysis = background · dialogue with user · research · models · **numbered SMART objectives** with justification.
:::

:::related
- [13.1 Analysis, design, implementation, testing and evaluation](#/topic/13.1)
- [14.2 NEA design, development, testing and evaluation](#/topic/14.2)
- [10.1 Data modelling and ER diagrams](#/topic/10.1)
- [1.8 Object-oriented programming](#/topic/1.8)
- [3.6 Dijkstra's shortest path algorithm](#/topic/3.6)
:::

*/});
