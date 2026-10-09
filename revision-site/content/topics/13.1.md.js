CS.registerTopic({ id: "13.1", title: "Analysis, design, implementation, testing and evaluation" }, function () {/*

:::objectives
- Describe what happens at each stage of a systematic approach: **analysis, design, implementation, testing, evaluation**.
- Explain how requirements are established **by interaction with the intended users**, and what a **data model** is.
- Compare a **waterfall** (linear) approach with **prototyping / agile** (iterative) approaches, and say when each suits.
- Choose and justify **normal (typical), boundary and erroneous** test data, and complete a test table.
- Explain the purpose of **acceptance testing** and distinguish it from other kinds of testing.
- State and apply the **criteria for evaluating** a computer system.
:::

:::quick At a glance
- **Analysis**: define the problem, establish **requirements** with the **intended users** (interviews, questionnaires, observation, existing documents), build a **data model**.
- **Design**: plan the **data structures**, **algorithms**, **modular structure** (hierarchy chart) and **user interface** *before* building.
- **Implementation**: turn the models and algorithms into **data structures and code**; iterate, solving the **critical path** first.
- **Testing**: use **normal**, **boundary** and **erroneous** data; then **acceptance testing** with the intended users against the specification.
- **Evaluation**: judge the system against its **requirements**, plus effectiveness, usability, reliability, efficiency, maintainability and user feedback.
- **Waterfall** = stages in order, each signed off. **Agile / prototyping** = short repeated cycles with users giving feedback on working versions.
- Requirements are **discovered**, not guessed: the spec says "by interaction with the intended users".
:::

:::keyterms
Analysis :: The stage in which the problem is defined, the requirements of the system are established by interaction with the intended users and a data model is created. :: Work out exactly what is needed before deciding how.
Requirements specification :: A document listing the agreed, measurable requirements (objectives) a solution must meet. :: The checklist the finished system is judged against.
Data model :: An abstract representation of the data a system holds and the relationships between items, e.g. an entity relationship diagram or class diagram. :: A map of what data exists and how it links.
Prototype :: An early, incomplete working model of a system (or part of it) shown to users to clarify requirements or test a design. :: A rough version to get feedback on.
Agile approach :: An iterative approach in which the solution is developed in short cycles, each producing working software that is reviewed with users so requirements can change. :: Build a bit, show it, adjust, repeat.
Waterfall model :: A linear approach in which each stage is completed and signed off before the next begins. :: One stage at a time, no going back (in theory).
Hierarchy chart :: A diagram showing how a problem is broken into modules (subroutines) and sub-modules in a top-down structure. :: A family tree of the program's parts.
Critical path :: The parts of the solution that everything else depends on, so must be built first; the longest chain of dependent tasks, which sets the minimum project time. :: The bits that hold everything else up.
Normal (typical) data :: Valid data, well within range, that the program should accept and process correctly. :: Ordinary sensible input.
Boundary data :: Data at the edges of the valid range (the largest and smallest valid values), usually tested together with the values just outside them. :: The values right on the limits.
Erroneous data :: Data that is invalid (wrong type or outside the valid range) and should be rejected. :: Rubbish input that should be refused.
Acceptance testing :: Testing carried out by or with the intended users to confirm the system meets the requirements specification before it is accepted. :: The client tries it and signs it off.
Black-box testing :: Testing based only on inputs and expected outputs, without looking at the code. :: Test what it does, not how.
White-box testing :: Testing that uses knowledge of the code's internal structure, e.g. making sure every path through it is executed. :: Test every route through the code.
:::

## The big picture: why be systematic?

Most failed software projects do not fail because the code is wrong. They fail because the **wrong thing was built**: requirements were guessed, misunderstood or changed and nobody noticed.

A systematic approach breaks development into stages so that each question is answered at the right time:

| Stage | The question it answers | Typical output |
|---|---|---|
| **Analysis** | *What* is the problem and what must the solution do? | Requirements specification, data model |
| **Design** | *How* will the solution work? | Data structures, algorithms, hierarchy chart, UI designs |
| **Implementation** | Build it | Working code and data structures |
| **Testing** | Does it work, and does it do what was asked? | Test plan, test evidence, acceptance sign-off |
| **Evaluation** | How *well* does it meet the need, and what next? | Evaluation against requirements, user feedback, improvements |

:::spec
Section 4.13 can be examined in the written papers (this site files it under Paper 2; check the current AQA specification for which paper assesses it). The spec says "be aware" for most of it, so questions are usually short (1–4 marks): define a stage, name a requirements-gathering method, choose test data, explain acceptance testing. The same stages structure your [NEA project](#/topic/14.1).
:::

:::figure The waterfall model: each stage feeds the next; dashed arrows show going back when a problem is found
<svg class="diagram" viewBox="0 0 700 270" role="img" aria-label="Waterfall model: five stages stepping down from analysis to evaluation, with dashed arrows going back up">
  <defs><marker id="arr131" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="14">
    <rect x="20" y="20" width="140" height="40" rx="6" fill="#7c9aff" fill-opacity="0.35" stroke="currentColor"/><text x="90" y="45" text-anchor="middle" fill="currentColor">Analysis</text>
    <rect x="150" y="65" width="140" height="40" rx="6" fill="#7cd4ff" fill-opacity="0.35" stroke="currentColor"/><text x="220" y="90" text-anchor="middle" fill="currentColor">Design</text>
    <rect x="280" y="110" width="140" height="40" rx="6" fill="#7cffb2" fill-opacity="0.3" stroke="currentColor"/><text x="350" y="135" text-anchor="middle" fill="currentColor">Implementation</text>
    <rect x="410" y="155" width="140" height="40" rx="6" fill="#ffd37c" fill-opacity="0.35" stroke="currentColor"/><text x="480" y="180" text-anchor="middle" fill="currentColor">Testing</text>
    <rect x="540" y="200" width="140" height="40" rx="6" fill="#ff9a7c" fill-opacity="0.35" stroke="currentColor"/><text x="610" y="225" text-anchor="middle" fill="currentColor">Evaluation</text>
    <path d="M160 40 H220 V65" fill="none" stroke="currentColor" marker-end="url(#arr131)"/>
    <path d="M290 85 H350 V110" fill="none" stroke="currentColor" marker-end="url(#arr131)"/>
    <path d="M420 130 H480 V155" fill="none" stroke="currentColor" marker-end="url(#arr131)"/>
    <path d="M550 175 H610 V200" fill="none" stroke="currentColor" marker-end="url(#arr131)"/>
    <path d="M150 95 H60 V60" fill="none" stroke="currentColor" stroke-dasharray="5 4" marker-end="url(#arr131)"/>
    <path d="M280 140 H190 V105" fill="none" stroke="currentColor" stroke-dasharray="5 4" marker-end="url(#arr131)"/>
    <path d="M410 185 H320 V150" fill="none" stroke="currentColor" stroke-dasharray="5 4" marker-end="url(#arr131)"/>
    <text x="20" y="200" font-size="13" fill="currentColor">Solid: stage complete,</text>
    <text x="20" y="218" font-size="13" fill="currentColor">signed off, move on.</text>
    <text x="20" y="242" font-size="13" fill="currentColor">Dashed: going back is possible</text>
    <text x="20" y="260" font-size="13" fill="currentColor">but expensive.</text>
  </g>
</svg>
:::

## Analysis

Analysis answers **what** the system must do. The spec lists three jobs: **define the problem**, **establish the requirements** by talking to the intended users, and **create a data model**.

### Defining the problem

- Who has the problem, what currently happens, and what goes wrong with it?
- What is **in scope** (the system will do it) and **out of scope** (it won't)?
- What are the **constraints**: budget, deadline, hardware, the users' IT skill, laws such as data protection?

### Establishing requirements with the intended users

The spec is specific: requirements are established **by interaction with the intended users**. The developer is not the expert on the problem; the user is.

| Method | Strengths | Weaknesses |
|---|---|---|
| **Interview** | Detailed answers; can ask follow-up questions; good for a few key users | Time-consuming; answers can be vague or biased; one person's view |
| **Questionnaire / survey** | Reaches many users quickly; easy to analyse; anonymous answers can be more honest | Fixed questions, no follow-up; low response rates; users may misread questions |
| **Observation** | See what *really* happens, including workarounds users forget to mention | People behave differently when watched; time-consuming; may not see rare events |
| **Examining existing documents / system** | Shows the actual data, forms, reports and volumes | Documents may be out of date; doesn't show problems or what users want |

Requirements are often split into:

- **Functional requirements**: what the system must *do* ("calculate the league table from entered results").
- **Non-functional requirements**: qualities it must have ("load any screen in under 2 seconds", "usable by a Year 7 pupil", "store passwords hashed").

Good requirements are **specific and measurable**, so testing and evaluation can later say *yes* or *no* to each one.

### Creating a data model

A **data model** is an abstraction of the data the system needs: what entities (things) exist, what attributes they have, and how they relate.

- **Entity relationship diagrams** for database-backed systems. See [10.1](#/topic/10.1).
- **Class diagrams** for object-oriented designs. See [1.8](#/topic/1.8).
- **Data flow diagrams** to show where data comes from, how it is processed and where it goes.

Modelling the data early forces questions out into the open: "Can a player be in two teams?" is much cheaper to answer now than after the database is built.

### Prototyping and agile in analysis

Users often cannot say what they want until they see something. A **prototype** (paper sketch, clickable mock-up or rough program) is shown to users; their reaction **clarifies the requirements**. That is why the spec mentions prototyping/agile under analysis, not only under implementation.

:::trap
- "The requirements are decided by the programmer" scores nothing. The spec wording is **established by interaction with the intended users**: say *who* and *how* (interview, questionnaire, observation, existing documents).
- A data model is **not** the program's code or the user interface. It describes the **data and its relationships**.
- Do not confuse **analysis** (what is needed) with **design** (how it will be done). Choosing a hash table is design; finding out that users need to search by surname is analysis.
:::

## Design

Design answers **how** the solution will work, *before* it is built. The spec names four things to design:

1. **Data structures** for the data model: arrays, records, files, database tables (normalised), classes, hash tables, graphs. Include field names, data types, sizes and keys.
2. **Algorithms**: the key processing in pseudocode or flowcharts, e.g. how the league table is sorted or how fixtures are generated.
3. **Modular structure**: break the problem down top-down into subroutines/modules with clear interfaces (parameters and return values). Shown as a **hierarchy chart**.
4. **The human user interface**: screen layouts (wireframes), navigation between screens, input methods, validation messages, accessibility.

:::figure Hierarchy chart: top-down decomposition of a library system into modules
<svg class="diagram" viewBox="0 0 700 215" role="img" aria-label="Hierarchy chart with Library system at the top, three modules below and two sub-modules under each">
  <g font-family="inherit" font-size="13" fill="none" stroke="currentColor">
    <line x1="350" y1="51" x2="115" y2="90"/><line x1="350" y1="51" x2="350" y2="90"/><line x1="350" y1="51" x2="585" y2="90"/>
    <line x1="115" y1="126" x2="60" y2="165"/><line x1="115" y1="126" x2="170" y2="165"/>
    <line x1="350" y1="126" x2="295" y2="165"/><line x1="350" y1="126" x2="405" y2="165"/>
    <line x1="585" y1="126" x2="530" y2="165"/><line x1="585" y1="126" x2="640" y2="165"/>
    <rect x="275" y="15" width="150" height="36" rx="6" fill="#7c9aff" fill-opacity="0.35"/>
    <rect x="40" y="90" width="150" height="36" rx="6" fill="#7cd4ff" fill-opacity="0.3"/>
    <rect x="275" y="90" width="150" height="36" rx="6" fill="#7cd4ff" fill-opacity="0.3"/>
    <rect x="510" y="90" width="150" height="36" rx="6" fill="#7cd4ff" fill-opacity="0.3"/>
    <rect x="10" y="165" width="100" height="36" rx="6"/><rect x="120" y="165" width="100" height="36" rx="6"/>
    <rect x="245" y="165" width="100" height="36" rx="6"/><rect x="355" y="165" width="100" height="36" rx="6"/>
    <rect x="480" y="165" width="100" height="36" rx="6"/><rect x="590" y="165" width="100" height="36" rx="6"/>
  </g>
  <g font-family="inherit" font-size="13" fill="currentColor" text-anchor="middle">
    <text x="350" y="38">Library system</text>
    <text x="115" y="113">Manage members</text><text x="350" y="113">Manage loans</text><text x="585" y="113">Reports</text>
    <text x="60" y="188">Add member</text><text x="170" y="188">Edit member</text>
    <text x="295" y="188">Issue book</text><text x="405" y="188">Return book</text>
    <text x="530" y="188">Overdue list</text><text x="640" y="188">Popular books</text>
  </g>
</svg>
:::

:::why
Why design first? Changing a design costs minutes; changing code costs hours; changing a delivered system costs days and money. Design also lets a team split work: once the module interfaces are fixed, different people can build different modules at the same time.
:::

### Designing the user interface (HCI)

Good interface design follows a few principles you can name in an answer:

- **Consistency**: same layout, colours and button positions on every screen.
- **Know the user**: language, reading age, IT confidence, accessibility needs (contrast, font size, screen readers, keyboard use).
- **Feedback**: tell users what happened ("Saved", "Mark must be 0–100").
- **Prevent errors**: drop-downs, date pickers and validation instead of free text; confirm before deleting.
- **Minimise effort**: fewest clicks for the most common tasks; sensible defaults.

### Design can be iterative too

The spec says design "can be an iterative process involving a prototyping/agile approach". In practice you design a part, build a prototype of it, show users, and refine the design. The design is never truly "finished" until the system is.

## Implementation

Implementation means turning the **models and algorithms into data structures and code** (instructions) that a computer can execute.

- The **data model** becomes tables, files, records, classes or arrays.
- The **algorithms** become subroutines in a programming language.
- The **modular structure** becomes the program's files, classes and subroutines.

### Iterative development and the critical path

The spec says the final solution "may be arrived at using an iterative process employing prototyping/an agile approach with a **focus on solving the critical path first**".

- The **critical path** is the core part of the solution that everything else depends on. In a booking system: storing and retrieving bookings. The colour scheme is *not* on the critical path.
- Build it **first**, so that every iteration delivers something that actually works and can be shown to users.
- In project management, the critical path is also the **longest chain of tasks that depend on each other**; any delay to a task on it delays the whole project. Both readings lead to the same advice: do the essential, dependency-heavy work first.

:::example Planning increments for a school library system
| Iteration | Delivered (working) | Why this order |
|---|---|---|
| 1 | Book and member records stored and retrieved from the database | Everything else depends on the data (critical path) |
| 2 | Issue and return a book; loans recorded | Core purpose of the system |
| 3 | Overdue report; search by title/author | Uses data that now exists |
| 4 | Login, email reminders, styling | Valuable but nothing depends on them |

After each iteration the librarian uses the working version and gives feedback, which may change iterations 3 and 4.
:::

## Waterfall versus iterative approaches

| | Waterfall | Prototyping / agile |
|---|---|---|
| Shape | Linear: each stage finished and signed off before the next | Repeated short cycles (iterations / sprints) |
| Requirements | Fixed at the start | Expected to change; refined after each cycle |
| User involvement | Mostly at the start (analysis) and end (acceptance) | Continuous: users review every working version |
| When working software appears | Near the end | Early, then improved each cycle |
| Documentation | Heavy, formal; good for contracts and audits | Lighter; working software valued more |
| Risk | Misunderstood requirements found late, so expensive to fix | Problems found early; risk of scope creep and less predictable cost/end date |
| Suits | Stable, well-understood requirements; safety-critical or regulated systems; fixed-price contracts | Unclear or changing requirements; users available to give feedback; small teams |

:::figure An agile cycle: every loop produces a working increment that users review
<svg class="diagram" viewBox="0 0 700 280" role="img" aria-label="Agile cycle of plan, design, build, test and review with user, arranged in a loop around a working increment">
  <defs><marker id="arr131b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" stroke="currentColor">
    <ellipse cx="350" cy="25" rx="52" ry="18" fill="#7c9aff" fill-opacity="0.35"/>
    <ellipse cx="464" cy="103" rx="52" ry="18" fill="#7cd4ff" fill-opacity="0.35"/>
    <ellipse cx="421" cy="237" rx="52" ry="18" fill="#7cffb2" fill-opacity="0.3"/>
    <ellipse cx="279" cy="237" rx="52" ry="18" fill="#ffd37c" fill-opacity="0.35"/>
    <ellipse cx="236" cy="103" rx="52" ry="18" fill="#ff9a7c" fill-opacity="0.35"/>
    <line x1="378" y1="44" x2="436" y2="84" marker-end="url(#arr131b)"/>
    <line x1="458" y1="122" x2="427" y2="218" marker-end="url(#arr131b)"/>
    <line x1="367" y1="237" x2="333" y2="237" marker-end="url(#arr131b)"/>
    <line x1="273" y1="218" x2="242" y2="122" marker-end="url(#arr131b)"/>
    <line x1="264" y1="84" x2="322" y2="44" marker-end="url(#arr131b)"/>
    <rect x="290" y="125" width="120" height="44" rx="8" fill="none" stroke-dasharray="4 3"/>
  </g>
  <g font-family="inherit" font-size="13" fill="currentColor" text-anchor="middle">
    <text x="350" y="30">Plan</text><text x="464" y="108">Design</text><text x="421" y="242">Build</text>
    <text x="279" y="242">Test</text><text x="236" y="108">Review with user</text>
    <text x="350" y="144">Working</text><text x="350" y="161">increment</text>
    <text x="600" y="130">Each loop is one</text><text x="600" y="148">iteration (sprint),</text><text x="600" y="166">often 1–4 weeks</text>
    <text x="95" y="190">Feedback can change</text><text x="95" y="208">the requirements</text><text x="95" y="226">for the next loop</text>
  </g>
</svg>
:::

:::collapse Beyond the spec: spiral and RAD (useful context, not named in 7517)
- **Spiral model**: repeated loops of *plan → risk analysis → engineering → evaluation*; each loop explicitly identifies and reduces the biggest risk. Suits large, high-risk projects.
- **Rapid application development (RAD)**: build prototypes quickly (often with reusable components and tools), get user feedback in workshops, and time-box each phase. Suits projects where speed matters and users are available.
- **Extreme programming (XP)**: an agile method with pair programming, test-first development and very frequent releases.
- The spec only asks you to be aware of **prototyping/agile** versus a stage-by-stage approach, so in the written exam that is the comparison to make.
:::

:::trap
- Agile does **not** mean "no planning" or "no documentation". It means planning and documenting in smaller, repeated chunks.
- Waterfall is not "wrong". It suits stable, well-specified or safety-critical projects. A good answer says **when** each suits.
- "Iterative" means *repeating a cycle and improving*, not "uses loops in the code".
:::

## Testing

The spec says the implementation must be **tested for the presence of errors** using **normal (typical), boundary and erroneous** data, and must undergo **acceptance testing** with the intended users.

:::note Testing shows the presence of errors, not their absence
A test that passes only proves the program worked *for that input*. You cannot test every possible input, so test data is **selected** to give the best chance of finding errors: typical values, the edges where mistakes cluster, and invalid values.
:::

### The three types of test data

| Type | Definition | Expected behaviour | Example (valid range 1–6) |
|---|---|---|---|
| **Normal (typical)** | Sensible valid data well inside the range | Accepted and processed correctly | 3 |
| **Boundary** | Values at the **edges** of the valid range, plus the values just outside | Edge values accepted; just-outside values rejected | 1 and 6 (accept); 0 and 7 (reject) |
| **Erroneous** | Invalid data: wrong type or outside the range | Rejected with a helpful message, no crash | "three", 2.5, −40, blank |

:::trap Boundary data: say exactly which values
- The boundary values are the **largest and smallest valid values** (e.g. 1 and 6). Many students only give the invalid side (0 and 7). Give both, and **say which should be accepted and which rejected**.
- Mark schemes sometimes call the just-outside values "boundary (invalid)" and sometimes "erroneous". If you label them "boundary — should be rejected" you are safe either way.
- Boundaries exist **inside** a range too: if 40 is the pass mark, test 39 and 40.
- Erroneous data is not just "big numbers": include **wrong data types** (text in a number field) and **missing data** (blank).
:::

### Worked example: building a test table

:::example Test plan for a grading subroutine
**Specification:** `grade(mark)` accepts a **whole number from 0 to 100**. It returns "Distinction" for 70 or more, "Pass" for 40 to 69, "Fail" below 40, and "Invalid" for anything else.

**Step 1: find every boundary.** The valid range has edges at **0** and **100**. There are two internal boundaries: **40** (Fail/Pass) and **70** (Pass/Distinction).

**Step 2: pick values either side of each boundary.** 0 and −1; 100 and 101; 39 and 40; 69 and 70.

**Step 3: add typical values** from each output category (one Fail, one Pass, one Distinction).

**Step 4: add erroneous values** of the wrong type: text, a decimal.

**Step 5: write the expected result for every test *before* running it.**

| No. | Purpose | Data | Type | Expected | Actual |
|---|---|---|---|---|---|
| 1 | typical pass | 55 | normal | Pass | Pass ✓ |
| 2 | typical distinction | 82 | normal | Distinction | Distinction ✓ |
| 3 | typical fail | 23 | normal | Fail | Fail ✓ |
| 4 | lowest valid mark | 0 | boundary | Fail | Fail ✓ |
| 5 | highest valid mark | 100 | boundary | Distinction | Distinction ✓ |
| 6 | just below pass mark | 39 | boundary | Fail | Fail ✓ |
| 7 | pass mark | 40 | boundary | Pass | Pass ✓ |
| 8 | just below distinction | 69 | boundary | Pass | Pass ✓ |
| 9 | distinction mark | 70 | boundary | Distinction | Distinction ✓ |
| 10 | just above range | 101 | erroneous (invalid boundary) | Invalid | Invalid ✓ |
| 11 | just below range | −1 | erroneous (invalid boundary) | Invalid | Invalid ✓ |
| 12 | wrong type (text) | "forty" | erroneous | Invalid | Invalid ✓ |
| 13 | wrong type (decimal) | 45.5 | erroneous | Invalid | Invalid ✓ |

The "Actual" column is filled in **after** running each test. If actual ≠ expected, the test has *found an error* (which is a successful test). Fix the code, then **re-run all the tests** (regression testing) in case the fix broke something else.
:::

::::tabs
:::tab AQA pseudocode
```pseudocode
SUBROUTINE grade(mark)
    # assumes mark has already been checked to be an integer
    IF mark < 0 OR mark > 100 THEN
        RETURN "Invalid"
    ENDIF
    IF mark ≥ 70 THEN
        RETURN "Distinction"
    ENDIF
    IF mark ≥ 40 THEN
        RETURN "Pass"
    ENDIF
    RETURN "Fail"
ENDSUBROUTINE
```
:::
:::tab Python with an automated test table
```python
def grade(mark):
    """Return the grade for a whole-number mark out of 100."""
    if type(mark) is not int:          # rejects text, decimals and True/False
        return "Invalid"
    if mark < 0 or mark > 100:
        return "Invalid"
    if mark >= 70:
        return "Distinction"
    if mark >= 40:
        return "Pass"
    return "Fail"

# (test no., data, type, expected)
test_plan = [
    (1, 55, "normal", "Pass"), (2, 82, "normal", "Distinction"), (3, 23, "normal", "Fail"),
    (4, 0, "boundary", "Fail"), (5, 100, "boundary", "Distinction"),
    (6, 39, "boundary", "Fail"), (7, 40, "boundary", "Pass"),
    (8, 69, "boundary", "Pass"), (9, 70, "boundary", "Distinction"),
    (10, 101, "erroneous", "Invalid"), (11, -1, "erroneous", "Invalid"),
    (12, "forty", "erroneous", "Invalid"), (13, 45.5, "erroneous", "Invalid"),
]
for number, data, kind, expected in test_plan:
    actual = grade(data)
    result = "PASS" if actual == expected else "FAIL"
    print(f"{number:>2} {data!r:>7} {kind:<9} {expected:<11} {actual:<11} {result}")
```
```output
 1      55 normal    Pass        Pass        PASS
 2      82 normal    Distinction Distinction PASS
 3      23 normal    Fail        Fail        PASS
 4       0 boundary  Fail        Fail        PASS
 5     100 boundary  Distinction Distinction PASS
 6      39 boundary  Fail        Fail        PASS
 7      40 boundary  Pass        Pass        PASS
 8      69 boundary  Pass        Pass        PASS
 9      70 boundary  Distinction Distinction PASS
10     101 erroneous Invalid     Invalid     PASS
11      -1 erroneous Invalid     Invalid     PASS
12 'forty' erroneous Invalid     Invalid     PASS
13    45.5 erroneous Invalid     Invalid     PASS
```
:::
::::

Now try it yourself: trace the pseudocode for a set of test marks. Leave a cell blank if that condition is never evaluated (the subroutine has already returned).

{{trace:13.1-1}}

### Ways of testing

| Kind | What it means | Who / when |
|---|---|---|
| **Unit testing** | Test each module/subroutine on its own | Developer, during implementation |
| **Integration testing** | Test that modules work together (data passed correctly between them) | Developer, as modules are combined |
| **System testing** | Test the whole system against the requirements | Developer / test team, when complete |
| **Black-box testing** | Choose tests from the specification: inputs and expected outputs only | Anyone; no code knowledge needed |
| **White-box testing** | Choose tests from the code so that every path/branch runs at least once; includes dry runs with trace tables | Developer |
| **Acceptance testing** | The intended users test the system with real tasks and data to confirm it meets the specification | End users / client, before the system is accepted |
| **Alpha / beta testing** | Alpha: in-house testing of a near-complete product. Beta: release to a limited group of real users outside the company | Mostly for commercial software |

### Why acceptance testing matters

Developer testing checks that the program **works**. Acceptance testing checks that it is **the right program**.

- Only the intended users can confirm the system **meets their requirements** in practice, with **real data** and **real tasks**.
- Users find problems developers miss: confusing screens, missing steps in their workflow, wrong assumptions about how they work.
- It is the formal point at which the client **agrees the specification has been met** (sign-off), which matters for contracts and payment.
- Problems found now are still cheaper to fix than after the system goes live.

:::trap
- Acceptance testing is **not** "testing whether the program accepts the input". It is testing by the **intended users** to see whether the system is **acceptable** against the **specification**.
- A test that reveals an error is a **successful** test. A test plan where every test passes first time usually means the tests were too easy.
- Always write the **expected** result before running the test. A test with no expected result proves nothing.
:::

## Evaluation

The spec says: "know the criteria for evaluating a computer system". Evaluation asks **how well** the finished system solves the original problem, and what should change.

| Criterion | Question to ask | Evidence |
|---|---|---|
| **Meets the requirements / objectives** | Is each requirement in the specification fully, partly or not met? | Test results, acceptance testing |
| **Functionality / correctness** | Does it produce correct results for all valid inputs? | Test plan, comparison with known answers |
| **Effectiveness** | Does it actually solve the problem for the user (saves time, fewer errors)? | Before/after comparison, user feedback |
| **Usability** | Can the intended users use it easily with little training? | Observation, user feedback, time to complete tasks |
| **Reliability / robustness** | Does it handle invalid input and unexpected events without crashing or losing data? | Erroneous data tests, error handling |
| **Efficiency / performance** | Is it fast enough with realistic data volumes; does it use resources sensibly? | Timings, algorithm complexity |
| **Maintainability** | Could another programmer understand, fix and extend it? | Modular structure, comments, meaningful names, documentation |
| **Security** | Is data protected (access control, validation, encryption)? | Login tests, SQL injection tests |
| **Compatibility / portability** | Does it run on the users' hardware and software? | Testing on target machines |
| **Cost and time** | Was it delivered on time and within budget? | Project plan |

A good evaluation is **honest and evidence-based**: it refers to specific test results and user comments, explains *why* any requirement was not met, and proposes realistic improvements.

:::exam
- **"State two methods of establishing requirements"** (2): interview, questionnaire, observation, examining existing documents. One word each is usually fine for "state".
- **"Describe" a stage** (2–4): say what is *produced* (requirements spec, data model, hierarchy chart, test plan) and *who* is involved (intended users).
- **Test data questions**: give an actual **value**, the **type**, and whether it should be **accepted or rejected**. For boundary, give both edges of the range.
- **"Explain why acceptance testing is needed"**: link to *intended users*, *meets the specification/requirements*, *real data*, and *sign-off*.
- **Compare waterfall and agile** (4–9): make *paired* points (requirements fixed vs changing; user involved at ends vs throughout; working software late vs early) and finish with **when each suits**.
- **Evaluation criteria**: name the criterion and say how it would be measured.
:::

:::challenge
1. A cinema app lets users book 1–10 seats for a showing with 120 seats, of which some are already booked. List every boundary you would test, including boundaries that depend on the number of seats remaining.
2. You are building a system for a GP surgery that must comply with strict data regulations, but the receptionists are unsure what screens they want. Argue for a hybrid approach that uses waterfall for some parts and agile for others.
3. Write a Python `valid_date(day, month, year)` function and a test plan for it. How many boundaries does February create?
:::

:::recap
- **Analysis**: define the problem, establish requirements **with the intended users** (interviews, questionnaires, observation, documents), create a **data model**.
- **Design**: data structures, algorithms, **modular structure** (hierarchy chart), **user interface**; can be iterative.
- **Implementation**: models and algorithms become data structures and code; iterate, **critical path first**.
- **Testing**: **normal**, **boundary** (edges and just outside) and **erroneous** (wrong type/out of range) data; expected result written first.
- **Acceptance testing**: intended users confirm the system meets the **specification**.
- **Evaluation criteria**: meets requirements, effectiveness, usability, reliability, efficiency, maintainability, security, user feedback.
- **Waterfall** suits fixed requirements; **agile/prototyping** suits unclear or changing requirements with available users.
:::

:::related
- [14.1 NEA overview, choosing a project and analysis](#/topic/14.1)
- [14.2 NEA design, development, testing and evaluation](#/topic/14.2)
- [4.1 Problem solving, algorithms and abstraction](#/topic/4.1)
- [1.7 Structured programming and hierarchy charts](#/topic/1.7)
- [10.1 Data modelling and ER diagrams](#/topic/10.1)
- [1.4 Exception handling](#/topic/1.4)
:::

*/});
