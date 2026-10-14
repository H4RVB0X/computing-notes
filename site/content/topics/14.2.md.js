CS.registerTopic({ id: "14.2", title: "NEA design, development, testing and evaluation" }, function () {/*

:::objectives
- Produce a **documented design** covering overall structure, data, algorithms, user interface, validation and security.
- Write a **technical solution** whose code shows Group A techniques used sensibly, with an excellent coding style.
- Explain what **completeness** means and how to evidence it.
- Build a **test plan mapped to your objectives** and evidence normal, boundary and erroneous testing efficiently.
- Write an honest **evaluation** against every objective, using **independent end-user feedback**, and suggest realistic improvements.
- Avoid the common pitfalls that cost marks, using the self-review checklists.
:::

:::quick At a glance
- **Design (12)**: hierarchy chart · ER diagram + normalised tables / class diagrams · pseudocode for the **key complex** algorithms · annotated **wireframes** · validation · file/DB design · security. It must match the final code.
- **Technical solution (42)**: full code listing + a **guide** to where the Group A skills are + evidence it works. Completeness (15) = how many objectives are met; techniques (27) = Group level + coding style.
- **Coding style**: meaningful names, comments, modules with clear interfaces, local not global, constants, exception handling, defensive programming.
- **Testing (8)**: a **test plan mapped to objectives**; representative **normal/boundary/erroneous** evidence; **video with timestamps** beats 200 screenshots; show **robustness**.
- **Evaluation (4)**: each objective → met/partly/not + **evidence reference**; **independent** feedback from the end user, quoted and discussed; specific improvements.
- **Honesty wins**: an explained partial success is credible; an unsupported "all objectives fully met" is not.
:::

:::keyterms
Documented design :: A description of how all the key aspects of the solution are structured: data, algorithms, modules and interface, sufficient for a third party to understand the solution. :: The blueprint, written so someone else could follow it.
Wireframe :: A simple annotated sketch of a screen layout showing the position and purpose of each control. :: A labelled drawing of each screen.
Data dictionary :: A table describing each data item: name, data type, size/format, validation and example. :: The spec sheet for every field.
Completeness :: The extent to which the technical solution meets the requirements (objectives) set out in the analysis. :: How much of what you promised actually works.
Coding style :: The characteristics of the code that make it readable and maintainable, judged as basic, good or excellent by AQA. :: How professional the code looks.
Defensive programming :: Writing code that anticipates and safely handles invalid input and unexpected conditions instead of failing. :: Assume things will go wrong and cope.
Exception handling :: Detecting run-time errors and transferring control to code that deals with them so the program can recover. :: Catching crashes before they happen.
Robustness :: The ability of a system to keep working correctly when given invalid data or unexpected conditions. :: It doesn't fall over.
Test plan :: A table of planned tests listing the purpose, objective tested, test data, type of data and expected result, with actual results and evidence references added after testing. :: The list of checks you'll run, with proof.
Independent feedback :: Comments on the finished solution from the end user (not the student), gathered after they have used it. :: What the user actually thought.
Loose coupling :: Modules interact only through their interfaces (parameters and return values), not shared global data. :: Change one part without breaking others.
Cohesion :: The degree to which a module does a single, well-defined job. :: Each subroutine does one thing.
:::

## Documented design (12 marks)

The top band asks for a design that "fully or nearly fully" describes **how all or almost all of the key aspects** of the solution are structured. Key words: **all**, **key** and **structured**.

:::note Design written after prototyping is allowed
AQA calls it the *documented* design, and the descriptor refers to how the solution is "to be structured / is structured". So you may prototype first and document the design afterwards, as long as it is **accurate** to the final code. Check this with your teacher.
:::

### What to include

| Part | What it contains | Tip |
|---|---|---|
| **Overall system design** | Hierarchy chart of modules; system flowchart or diagram of how components interact (UI, logic, database, files, server) | Label modules with the subroutine/class names you actually use |
| **Data design** | ER diagram; **normalised** table definitions (fields, types, keys, foreign keys); data dictionary; file structures; class diagrams with attributes, methods, inheritance/composition | Show why it is in 3NF; show sample data |
| **Algorithm design** | Pseudocode or flowcharts for the **key, complex** routines (scheduling, sorting, traversal, recursion, SQL queries) | Do not pad with pseudocode for "open the menu" |
| **User interface design** | Annotated **wireframes** for each screen; navigation map; how the design meets the user's needs (from the analysis) | Annotate *why* (font size for older users, colour contrast…) |
| **Validation design** | For each input: the check (range, type, length, format, presence, lookup) and the error message | Feeds straight into your test plan |
| **Security and integrity** | Login, **hashed + salted** passwords, access levels, **parameterised queries** against SQL injection, backups, referential integrity | Link to user requirements and data protection |
| **Link to objectives** | A table: objective → which module/screen/algorithm delivers it | Shows completeness of the design |

### Data design example: league manager

:::figure ER diagram for the league manager (crow's foot marks the "many" end)
<svg class="diagram" viewBox="0 0 640 280" role="img" aria-label="ER diagram: Team one-to-many Player, Team one-to-many Fixture as home and as away, Fixture one-to-many Goal, Player one-to-many Goal">
  <g font-family="inherit" font-size="14" stroke="currentColor" fill="none">
    <rect x="40" y="40" width="140" height="44" rx="4" fill="#7c9aff" fill-opacity="0.3"/>
    <rect x="40" y="200" width="140" height="44" rx="4" fill="#7c9aff" fill-opacity="0.3"/>
    <rect x="420" y="40" width="140" height="44" rx="4" fill="#7c9aff" fill-opacity="0.3"/>
    <rect x="420" y="200" width="140" height="44" rx="4" fill="#7c9aff" fill-opacity="0.3"/>
    <line x1="110" y1="84" x2="110" y2="200"/><line x1="110" y1="185" x2="98" y2="200"/><line x1="110" y1="185" x2="122" y2="200"/>
    <line x1="180" y1="54" x2="420" y2="54"/><line x1="405" y1="54" x2="420" y2="46"/><line x1="405" y1="54" x2="420" y2="62"/>
    <line x1="180" y1="72" x2="420" y2="72"/><line x1="405" y1="72" x2="420" y2="64"/><line x1="405" y1="72" x2="420" y2="80"/>
    <line x1="490" y1="84" x2="490" y2="200"/><line x1="490" y1="185" x2="478" y2="200"/><line x1="490" y1="185" x2="502" y2="200"/>
    <line x1="180" y1="222" x2="420" y2="222"/><line x1="405" y1="222" x2="420" y2="214"/><line x1="405" y1="222" x2="420" y2="230"/>
  </g>
  <g font-family="inherit" font-size="14" fill="currentColor" text-anchor="middle">
    <text x="110" y="67">Team</text><text x="110" y="227">Player</text>
    <text x="490" y="67">Fixture</text><text x="490" y="227">Goal</text>
    <text x="300" y="48" font-size="12">is home team in</text><text x="300" y="90" font-size="12">is away team in</text>
    <text x="60" y="145" font-size="12">has</text><text x="530" y="145" font-size="12">has</text>
    <text x="300" y="242" font-size="12">scores</text>
  </g>
</svg>
:::

The normalised tables (primary keys underlined in your report; here marked PK/FK):

| Table | Fields |
|---|---|
| Team | TeamID (PK), Name, AgeGroup, HomeGround |
| Player | PlayerID (PK), FirstName, Surname, DateOfBirth, TeamID (FK → Team) |
| Fixture | FixtureID (PK), RoundNo, MatchDate, HomeTeamID (FK → Team), AwayTeamID (FK → Team), HomeGoals, AwayGoals |
| Goal | GoalID (PK), FixtureID (FK → Fixture), PlayerID (FK → Player), Minute |

Every non-key field depends on the key, the whole key and nothing but the key, so the design is in **third normal form**. See [10.3](#/topic/10.3). This is a "complex data model in a database" (Group A): several interlinked tables, including two relationships between the same pair of entities.

### Algorithm design example: generating fixtures

The key algorithm is the **round-robin "circle method"**: fix one team, rotate the rest one place each round. With *n* teams (a dummy "bye" is added if *n* is odd) there are *n* − 1 rounds, and every pair meets exactly once. This is a **complex user-defined scheduling algorithm** (Group A).

::::tabs
:::tab AQA pseudocode (design)
```pseudocode
SUBROUTINE roundRobin(teams)
    IF LEN(teams) < 2 THEN
        RETURN error "A league needs at least two teams"
    ENDIF
    pool ← copy of teams
    IF LEN(pool) MOD 2 = 1 THEN
        append BYE to pool
    ENDIF
    n ← LEN(pool)
    rounds ← empty list
    FOR r ← 0 TO n - 2
        fixtures ← empty list
        FOR i ← 0 TO (n DIV 2) - 1
            home ← pool[i]
            away ← pool[n - 1 - i]
            IF home ≠ BYE AND away ≠ BYE THEN
                IF r MOD 2 = 0 THEN
                    append (home, away) to fixtures
                ELSE
                    append (away, home) to fixtures
                ENDIF
            ENDIF
        ENDFOR
        append fixtures to rounds
        pool ← [pool[0], pool[n - 1]] + pool[1 .. n - 2]
    ENDFOR
    RETURN rounds
ENDSUBROUTINE
```
:::
:::tab Python (implementation)
```python
BYE = None   # dummy opponent used when the number of teams is odd

def round_robin(teams):
    """Return a list of rounds; each round is a list of (home, away) fixtures.
    Circle method: keep the first team fixed and rotate the others one place."""
    if len(teams) < 2:
        raise ValueError("A league needs at least two teams")
    pool = list(teams)
    if len(pool) % 2 == 1:
        pool.append(BYE)
    n = len(pool)
    rounds = []
    for round_no in range(n - 1):
        fixtures = []
        for i in range(n // 2):
            home, away = pool[i], pool[n - 1 - i]
            if home is not BYE and away is not BYE:
                # swap home/away on alternate rounds so no team is always at home
                fixtures.append((home, away) if round_no % 2 == 0 else (away, home))
        rounds.append(fixtures)
        pool = [pool[0], pool[-1]] + pool[1:-1]   # rotate all but the first team
    return rounds

for number, fixtures in enumerate(round_robin(["Ash", "Birch", "Cedar", "Deal"]), start=1):
    print("Round", number, fixtures)
```
```output
Round 1 [('Ash', 'Deal'), ('Birch', 'Cedar')]
Round 2 [('Cedar', 'Ash'), ('Birch', 'Deal')]
Round 3 [('Ash', 'Birch'), ('Cedar', 'Deal')]
```
:::
::::

This produces a **single** round-robin (each pair meets once). Objective 4.1 asks for a **double** round-robin, so the scheduler then appends the same rounds again with home and away swapped. Notice the design and the code match line for line. That is what "documented design" means: a moderator can read the pseudocode and find the same logic in your listing.

### User interface design

- Draw a **wireframe for every screen** (paper sketches scanned in are fine) and **annotate** each control: what it does, what validation applies, why it is placed there.
- Include a **navigation diagram** (which screen leads to which).
- Link choices to the **user's needs** found in the analysis: "the secretary uses a tablet at the ground, so buttons are at least 48 px high".
- If you showed a prototype to the user, include their feedback and what you changed.

:::trap Design marks lost here
- **Design that does not match the code**: different table names, algorithms that were never built.
- **Pseudocode only for trivial routines** (menus, button clicks) while the complex algorithm is described in one sentence.
- **No data design detail**: an ER diagram but no field types, keys or explanation of normalisation.
- Screenshots of the **finished program** pasted in as "UI design" with no annotation or reasoning.
- Missing **security** and **validation** design when the system stores personal data.
:::

:::collapse Self-review checklist: documented design
- [ ] Hierarchy chart / system overview using the real module and class names.
- [ ] ER diagram **and** full table definitions (field, type, size, PK, FK), with normalisation explained; or class diagram(s) with attributes, methods and relationships.
- [ ] Data dictionary / file structure descriptions.
- [ ] Pseudocode or flowcharts for **every key complex algorithm**, matching the final code.
- [ ] Key SQL queries designed (joins, parameters, aggregates).
- [ ] Annotated wireframes for every screen plus a navigation map, justified by user needs.
- [ ] Validation table for every input.
- [ ] Security: authentication, password hashing, access levels, SQL injection prevention, backups.
- [ ] Table linking each objective to the part of the design that meets it.
:::

## Technical solution (42 marks)

### What evidence to submit

- The **complete code listing**, normally as an appendix, with a **contents list** and **page/line numbers**.
- A short **overview of the code**: what each file/class/module does.
- A **skills map**: a table pointing the moderator to where each Group A technique is (e.g. "Recursion: `TreeNode.insert`, listing p. 34"). Do not make the marker hunt.
- **Evidence the program works**: usually provided through the testing section (video/screenshots), which also supports completeness.

:::example Skills map (league manager)
| Technique | Group | Where in the code | Why it is needed |
|---|---|---|---|
| Complex data model: 4 linked tables, two relationships Team→Fixture | A | `schema.sql`, `database.py` lines 1–60 | Stores teams, players, fixtures and goals without redundancy |
| Cross-table parameterised SQL with aggregate functions | A | `database.py` `top_scorers()`, `league_table()` | Goal counts and league table from several tables |
| Complex user-defined algorithm (round-robin scheduling) | A | `scheduler.py` `round_robin()` | Core objective 4.1 |
| Merge sort with multi-key comparison | A | `sorting.py` `merge_sort()` | Orders table by points, goal difference, goals scored (objective 6.2) |
| OOP: classes, inheritance, composition, polymorphism | A | `models.py` `Person` → `Player`, `Referee`; `League` contains `Team`s | Models the domain |
:::

### What completeness means (15 marks)

Completeness is judged **against your own objectives**. A system that "meets almost all of the requirements" is in the top band.

- Your objectives must cover the **complex parts**, otherwise "complete" means little.
- Every objective must be **demonstrably met**, through testing evidence that refers to it.
- Unfinished features should be **removed or disabled cleanly**, not left as buttons that crash.
- Do not quietly **delete hard objectives** late on. If an objective was dropped, record why (user's decision, with evidence) in the evaluation.

### Showing Group A skills in code: two examples

:::example Cross-table, parameterised, aggregate SQL (Group A)
```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE Team   (TeamID INTEGER PRIMARY KEY, Name TEXT NOT NULL);
CREATE TABLE Player (PlayerID INTEGER PRIMARY KEY, Name TEXT NOT NULL,
                     TeamID INTEGER NOT NULL REFERENCES Team(TeamID));
CREATE TABLE Goal   (GoalID INTEGER PRIMARY KEY,
                     PlayerID INTEGER NOT NULL REFERENCES Player(PlayerID));
INSERT INTO Team VALUES (1, 'Ash'), (2, 'Birch');
INSERT INTO Player VALUES (1, 'Sam', 1), (2, 'Priya', 1), (3, 'Leo', 2);
INSERT INTO Goal (PlayerID) VALUES (1), (1), (2), (3), (1);
""")

def top_scorers(team_name):
    """Goals per player for one team, highest first."""
    sql = """SELECT Player.Name, COUNT(Goal.GoalID) AS Goals
             FROM Team JOIN Player ON Player.TeamID = Team.TeamID
                       JOIN Goal   ON Goal.PlayerID = Player.PlayerID
             WHERE Team.Name = ?
             GROUP BY Player.PlayerID
             ORDER BY Goals DESC"""
    return db.execute(sql, (team_name,)).fetchall()

print(top_scorers("Ash"))              # [('Sam', 3), ('Priya', 1)]
print(top_scorers("Ash' OR '1'='1"))   # [] - the ? placeholder blocks SQL injection
```
The `?` placeholder passes the value **separately** from the SQL text, so input can never change the query. That is both a Group A technique and a security feature to mention in your design.
:::

:::example Defensive programming and exception handling (excellent coding style)
```python
MIN_GOALS, MAX_GOALS = 0, 30     # constants: limits agreed with the end user

def parse_goals(text):
    """Convert the text typed into the 'goals' box to an int, or raise ValueError
    with a message the secretary can understand."""
    cleaned = text.strip()
    if cleaned == "":
        raise ValueError("Please enter the number of goals.")
    try:
        goals = int(cleaned)
    except ValueError:
        raise ValueError(f"'{cleaned}' is not a whole number.") from None
    if not MIN_GOALS <= goals <= MAX_GOALS:
        raise ValueError(f"Goals must be between {MIN_GOALS} and {MAX_GOALS}.")
    return goals

for attempt in ["3", " 0 ", "30", "31", "two", ""]:
    try:
        print(repr(attempt), "->", parse_goals(attempt))
    except ValueError as error:
        print(repr(attempt), "-> rejected:", error)
```
```output
'3' -> 3
' 0 ' -> 0
'30' -> 30
'31' -> rejected: Goals must be between 0 and 30.
'two' -> rejected: 'two' is not a whole number.
'' -> rejected: Please enter the number of goals.
```
:::

:::collapse Coding style checklist (aim for "excellent")
- [ ] **Meaningful identifiers** everywhere (`goal_difference`, not `gd2` or `x`).
- [ ] **Comments** explain *why*, and every subroutine/class has a header comment (purpose, parameters, return value).
- [ ] **Modular**: each subroutine does one job (**cohesive**), typically under ~30 lines.
- [ ] Modules talk through **parameters and return values** (**loosely coupled**); **minimal globals**.
- [ ] Related subroutines grouped into **classes or files** with a clear purpose.
- [ ] **Constants** for fixed values (limits, file names, colours), no "magic numbers".
- [ ] **Consistent** indentation, naming convention and layout throughout.
- [ ] **File paths parameterised** (no hard-coded `C:\Users\me\...`).
- [ ] **Managed type casting** with checks (`int()` inside `try`).
- [ ] **Defensive programming**: validate all input, check for missing files/empty results/division by zero.
- [ ] **Exception handling** that recovers with a helpful message rather than crashing or silently ignoring errors.
- [ ] No dead code, commented-out blocks or debugging prints left in.
:::

:::trap Technical solution marks lost here
- **Library calls instead of your own algorithm** (`sorted()`, `networkx.shortest_path`) for the techniques you are claiming.
- **Code you did not write** (tutorials, AI tools, friends) without acknowledgement: no credit, and a potential malpractice issue.
- One enormous file with global variables and 300-line subroutines: caps coding style.
- No guide to the code, so the moderator cannot find your Group A work.
- Features that crash when used: hurts completeness and testing.
:::

## Testing (8 marks)

The top band wants "clear evidence, in the form of **carefully selected representative samples**, that **thorough** testing has been carried out", demonstrating **robustness** and that the **requirements have been achieved**.

### The test plan

Map every test to an **objective**. This proves completeness and makes the evaluation easy.

| Test | Objective | Purpose | Test data | Type | Expected result | Actual result | Evidence |
|---|---|---|---|---|---|---|---|
| 4.1a | 4.1 | Fixtures for an even number of teams | 4 teams | normal | 6 rounds (3 + the same 3 reversed), 2 fixtures each; each pair meets twice, once at each ground | As expected | Video 2, 01:12 |
| 4.1b | 4.1 | Odd number of teams | 5 teams | normal | 10 rounds (5 + 5 reversed), one team has a bye each round | As expected | Video 2, 02:05 |
| 4.1c | 4.1 | Smallest league allowed | 3 teams | boundary | 6 rounds (3 + 3 reversed), 1 fixture each | As expected | Video 2, 02:50 |
| 4.1d | 4.1 | Below minimum | 1 team | boundary (invalid) | Message "A league needs at least two teams"; no fixtures created | Crashed: IndexError → fixed, re-tested ✓ | Video 2, 03:30; fix log 7 |
| 5.2a | 5.2 | Goals entry | 3 | normal | Accepted, table updates | As expected | Video 3, 00:40 |
| 5.2b | 5.2 | Goals entry, upper limit | 30 / 31 | boundary | 30 accepted; 31 rejected with message | As expected | Video 3, 01:05 |
| 5.2c | 5.2 | Goals entry, wrong type | "two", blank | erroneous | Rejected with message; nothing saved | As expected | Video 3, 01:30 |

### Producing the evidence efficiently

- **Screen-record videos** of test runs and put **timestamps** in the plan. Moderators accept video; it is faster than hundreds of screenshots.
- Choose a **representative sample** in the written report: one clear screenshot per *type* of test per feature, not every keypress.
- Show **what changed**: when a test fails, record the fix and **re-test** (this is good evidence, not an admission of failure).
- **Automated unit tests** (e.g. Python `assert` or `unittest`) for algorithms are strong evidence. Show the test code and its output.
- Test **robustness**: missing or corrupt files, empty database, very large inputs, the network/database being unavailable, rapid repeated clicks.
- Test the **algorithm's correctness** against hand-worked results (e.g. check every pair plays exactly once).

```python
from itertools import combinations

def round_robin(teams):
    pool = list(teams) + ([None] if len(teams) % 2 else [])
    n, rounds = len(pool), []
    for _ in range(n - 1):
        rounds.append([(pool[i], pool[n - 1 - i]) for i in range(n // 2)
                       if pool[i] is not None and pool[n - 1 - i] is not None])
        pool = [pool[0], pool[-1]] + pool[1:-1]
    return rounds

# Automated test: for 2..16 teams, every pair meets exactly once and nobody plays twice in a round
for size in range(2, 17):
    teams = [f"T{k}" for k in range(size)]
    rounds = round_robin(teams)
    played = [frozenset(f) for r in rounds for f in r]
    assert sorted(map(sorted, played)) == sorted(map(sorted, map(frozenset, combinations(teams, 2))))
    for r in rounds:
        in_round = [t for f in r for t in f]
        assert len(in_round) == len(set(in_round))
print("All round-robin tests passed for 2 to 16 teams")
```

:::trap Testing marks lost here
- Only **normal** data tested; no boundary or erroneous tests, so robustness is not shown.
- Tests **not linked to objectives**, so they do not show that requirements are met.
- **Expected results missing** or written after the event to match what happened.
- Hundreds of near-identical screenshots, but the complex algorithm is never tested.
- Claims "test passed" with **no evidence** reference.
:::

:::collapse Self-review checklist: testing
- [ ] Every objective has at least one test; complex objectives have several.
- [ ] Normal, boundary (both sides) and erroneous data used for every input.
- [ ] Expected results written before testing.
- [ ] Every test has an evidence reference (figure number or video timestamp).
- [ ] Failed tests recorded with the fix and the re-test.
- [ ] Robustness tests: missing files, empty data, invalid states.
- [ ] Algorithm correctness tested against hand-worked or automated checks.
- [ ] Video links work and are accessible to the moderator (check the format your school requires).
:::

## Evaluation (4 marks)

Only 4 marks, but they depend on **evidence**. The top band asks for full consideration of **how well the outcome meets all of its requirements**, **independent feedback** of a useful and realistic nature that is **evaluated and discussed**, and detailed consideration of how the outcome **could be improved**.

### 1. Assess every objective

| Objective | Met? | Evidence | Comment |
|---|---|---|---|
| 4.1 Double round-robin for 3–16 teams | Fully | Tests 4.1a–d; automated test | Too-few-teams input now rejected cleanly after the fix found by test 4.1d |
| 5.3 Email fixtures to team managers | Partly | Test 5.3a | Emails send, but only one recipient per team; the secretary wanted two |
| 7.1 Pitch booking clash detection | Not met | — | Dropped after meeting on 12 Feb: the council changed its booking system (email from user, Appendix F) |

### 2. Independent end-user feedback

- Give the finished system to the **end user** to use for **real tasks**, ideally without you steering them.
- Gather feedback in a form that is **clearly theirs**: a signed and dated letter, an email, a completed questionnaire, or a recorded interview transcript.
- Ask **specific questions** tied to the objectives, plus open questions ("What would stop you using this every week?").
- **Quote** the feedback in the report, then **respond** to it: do you agree? what caused the issue? how would you fix it?

### 3. Improvements and extensions

- Be **specific and realistic**: "Allow two contacts per team by changing the Team–Contact relationship to one-to-many and looping over contacts in `send_fixtures()`", not "add more features".
- Link improvements to **feedback** and to **objectives not fully met**.
- Mention what you would do **differently in the process** (e.g. earlier prototype of the results screen).

:::trap Evaluation marks lost here
- "All objectives were fully met" with no evidence, contradicted by the testing section.
- "Feedback" written by the student, or a one-line "It's great, thanks!" with no discussion.
- Vague improvements ("make it look nicer", "add more features").
- Ignoring objectives that were not met. **Honesty is credited**; hiding gaps is not.
:::

:::collapse Self-review checklist: evaluation
- [ ] Every objective listed with fully/partly/not met and an evidence reference.
- [ ] Reasons given for anything partly or not met.
- [ ] Independent feedback from the end user, clearly attributable, dated, after real use.
- [ ] Feedback quoted and discussed point by point.
- [ ] Specific, realistic improvements linked to feedback and unmet objectives.
:::

## Common pitfalls across the whole project

| Pitfall | Consequence | Fix |
|---|---|---|
| Project too simple | Techniques capped in a low band | Choose a problem that needs Group A techniques (see [14.1](#/topic/14.1)) |
| Project too big | Low completeness | Define a core (critical path) and treat the rest as extensions |
| No real user | Weak analysis dialogue and no independent feedback | Find a real user before you start |
| Vague objectives | Testing and evaluation can't show requirements met | SMART, numbered objectives |
| Design written last, not matching code | Design marks lost | Keep design and code in step; update the document |
| Leaving write-up to the end | Rushed, thin documentation | Write each section as you go |
| No guide to the code | Moderator misses Group A work | Skills map with page references |
| Unacknowledged code (including AI-generated) | No credit; possible malpractice | Acknowledge every source; write the assessed parts yourself |

:::collapse Final submission checklist
- [ ] Title page, contents page, page numbers, figure numbers.
- [ ] Analysis, documented design, technical solution (overview + skills map + listing), testing, evaluation, appendices.
- [ ] Code listing complete, readable font, line numbers, matching the final program.
- [ ] All videos/links referenced and accessible in the format your school requires.
- [ ] All sources acknowledged (code, images, libraries, AI tools).
- [ ] Candidate record form / authentication signed as your school requires.
- [ ] Proof-read: could a third party follow it from start to finish?
:::

:::exam
**Writing for the moderator**
- **Signpost**: headings that mirror the five assessed sections; refer to objective numbers everywhere.
- **Evidence over claims**: every "this works" needs a test reference; every "complex" needs a code reference.
- **Explain decisions**: why a hash table, why 3NF, why this algorithm. Justification is what separates top-band design from a description.

**How this links to the written exams:** a question on test data or evaluation criteria is easier when you can picture your own test plan and evaluation table (see [13.1](#/topic/13.1)).
:::

:::challenge
1. Draw the hierarchy chart for your own project using the actual names of your subroutines and classes. Which module is the most tightly coupled, and how could you loosen it?
2. Write a skills map for your project. If the "Group" column has no A entries, what could you change?
3. Write a test plan of at least ten tests for one objective of your project, covering normal, boundary and erroneous data, with expected results.
:::

:::recap
- **Design (12)**: structure, data (ER + normalised tables / class diagrams), key algorithms in pseudocode, annotated wireframes, validation, security; must match the code.
- **Technical solution (42)**: listing + overview + **skills map**; completeness against objectives (15); techniques at Group A + excellent coding style (27).
- **Excellent coding style**: cohesive, loosely coupled modules; grouped by purpose; defensive programming; good exception handling (plus all of good and basic).
- **Testing (8)**: plan mapped to objectives; normal/boundary/erroneous; robustness; representative evidence with video timestamps; failures fixed and re-tested.
- **Evaluation (4)**: each objective with evidence; independent, attributable user feedback discussed; specific improvements; honesty.
:::

:::related
- [14.1 NEA overview, choosing a project and analysis](#/topic/14.1)
- [13.1 Analysis, design, implementation, testing and evaluation](#/topic/13.1)
- [10.3 Normalisation](#/topic/10.3)
- [10.4 SQL](#/topic/10.4)
- [1.4 Exception handling](#/topic/1.4)
- [1.8 Object-oriented programming](#/topic/1.8)
:::

*/});
