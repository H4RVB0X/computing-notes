CS.registerTopic({ id: "4.1", title: "Problem solving, algorithms and abstraction" }, function () {/*

:::objectives
- Solve simple **logic problems** systematically and **check** a solution against every condition.
- Define an **algorithm** and express one in AQA pseudocode using **sequence**, **assignment**, **selection** and **iteration**, then convert it to Python.
- **Hand-trace** an algorithm in a trace table, and argue that a program is **correct** and **efficient** using logical reasoning, test data and user feedback.
- Define and give examples of every type of **abstraction** on the spec: representational, generalisation/categorisation, procedural, functional, data and problem abstraction (reduction), plus **information hiding**.
- Explain **decomposition**, **composition** and **automation**.
:::

:::quick At a glance
- An **algorithm** is a **sequence of steps that can be followed to complete a task** and that always **terminates**.
- Algorithms are built from four constructs: **sequence**, **assignment**, **selection** (IF) and **iteration** (loops).
- **Hand-tracing** = running the algorithm on paper in a **trace table**, one row per change.
- **Abstraction** = removing unnecessary detail. **Representational**: keep only what matters (Tube map). **Generalisation/categorisation**: group things by common features ("is a kind of").
- **Information hiding**: hide all details of an object that do not contribute to its essential characteristics (e.g. private attributes behind public methods).
- **Procedural abstraction**: a procedure represents a *computational method* (the pattern, not the specific values). **Functional abstraction**: the *method* itself is hidden; you only see inputs and output.
- **Data abstraction**: how data is represented is hidden, so new types (stack, queue) can be built from existing ones. **Problem abstraction/reduction**: strip details until the problem becomes one **already solved**.
- **Decomposition**: break a problem into sub-problems. **Composition**: combine procedures/data into compound ones. **Automation**: put the models into action as algorithms, data structures and code.
:::

:::keyterms
Algorithm :: A sequence of steps that can be followed to complete a task and that always terminates. :: A precise recipe that finishes.
Hand-trace :: Executing an algorithm manually, recording the values of variables and outputs after each step, usually in a trace table. :: Being the computer, on paper.
Abstraction :: The process of removing unnecessary details from a problem so that only the essential features remain. :: Ignore what doesn't matter.
Representational abstraction :: A representation arrived at by removing unnecessary details. :: A simplified model, like the Tube map.
Abstraction by generalisation :: Grouping by common characteristics to arrive at a hierarchical relationship of the "is a kind of" type. :: Spotting that a spaniel is a kind of dog.
Information hiding :: The process of hiding all details of an object that do not contribute to its essential characteristics. :: Users see the interface, not the insides.
Procedural abstraction :: Abstracting a calculation into a procedure that represents a computational method, independent of the actual values used. :: Turn "area of this board" into "area of any rectangle".
Functional abstraction :: The result of a procedural abstraction is a function in which the particular computation method is hidden. :: A black box: inputs in, answer out.
Data abstraction :: Details of how data are actually represented are hidden, allowing new kinds of data objects to be constructed from previously defined types. :: Use a stack without caring if it's an array or linked list.
Problem abstraction (reduction) :: Removing details until the problem is represented in a way that is possible to solve because it reduces to one that has already been solved. :: "This is just a shortest-path problem."
Decomposition :: Breaking a problem into a number of sub-problems, each of which accomplishes an identifiable task and may itself be further subdivided. :: Divide the job into chunks.
Composition :: Building a solution by combining procedures to form compound procedures, and combining data objects to form compound data such as a tree. :: Assemble the chunks.
Automation :: Putting models (abstractions of real-world objects or phenomena) into action to solve problems, by creating algorithms, implementing them in code and data structures, and executing the code. :: Make the computer actually do it.
:::

## Solving logic problems

A logic problem gives you **facts (premises)** and asks what must follow. The skill AQA wants is to **develop** a solution and then **check** it against every condition.

:::steps A reliable method
1. List every condition as a separate, short statement.
2. List the possible cases (often a small table of True/False combinations).
3. Test each case against **every** condition and cross out any that break one.
4. Check the survivor(s) against the original wording, not your summary.
:::

:::example Knights and knaves
Knights always tell the truth; knaves always lie. **A** says: "B is a knave." **B** says: "A and I are both knights." What are A and B?

| A is a knight? | B is a knight? | A's claim "B is a knave" | Consistent with A? | B's claim "both knights" | Consistent with B? |
|---|---|---|---|---|---|
| T | T | False | ✗ (a knight said something false) | | |
| T | F | True | ✓ | False | ✓ (a knave said something false) |
| F | T | False | ✓ | False | ✗ (a knight said something false) |
| F | F | True | ✗ (a knave said something true) | | |

Only one row survives: **A is a knight, B is a knave.** Checking: A truthfully says B is a knave; B lies by claiming both are knights. ✓
:::

The same exhaustive check is easy to automate. This is **automation** of a logical model:

```python Brute-force check of every case
from itertools import product

for a_knight, b_knight in product([True, False], repeat=2):
    a_claim = not b_knight              # A: "B is a knave"
    b_claim = a_knight and b_knight     # B: "we are both knights"
    # a knight's claim must be true; a knave's claim must be false
    if a_claim == a_knight and b_claim == b_knight:
        print("A knight:", a_knight, "| B knight:", b_knight)
# A knight: True | B knight: False
```

:::tip Turning words into algebra
"If one person moves from table 2 to table 1, table 1 has twice as many; if one moves from table 1 to table 2, they are equal." Let table 1 = a and table 2 = b. Then a + 1 = 2(b − 1) and a − 1 = b + 1. The second gives a = b + 2; substituting, b + 3 = 2b − 2, so **b = 5, a = 7**. Check: 8 = 2 × 4 ✓ and 6 = 6 ✓. Removing the story and keeping the equations is itself an abstraction.
:::

## Algorithms

:::definition Algorithm (AQA)
A **sequence of steps that can be followed to complete a task** and that **always terminates**.
:::

Every algorithm can be written with four constructs:

| Construct | Meaning | AQA pseudocode |
|---|---|---|
| **Sequence** | steps run one after another, in order | one line after another |
| **Assignment** | a value is stored in a variable | `total ← total + x` |
| **Selection** | a choice of path depending on a condition | `IF … THEN … ELSE … ENDIF` |
| **Iteration** | steps repeated | `FOR … ENDFOR`, `WHILE … ENDWHILE`, `REPEAT … UNTIL` |

### From problem to pseudocode to Python

**Problem:** given a list of test marks, count how many are passes (40 or more) and find the highest mark.

::::tabs
:::tab AQA pseudocode
```pseudocode
marks ← [35, 62, 48, 29]
passes ← 0
highest ← marks[0]
FOR i ← 0 TO LEN(marks) - 1
    IF marks[i] ≥ 40 THEN
        passes ← passes + 1
    ENDIF
    IF marks[i] > highest THEN
        highest ← marks[i]
    ENDIF
ENDFOR
OUTPUT passes
OUTPUT highest
```
:::
:::tab Python
```python
marks = [35, 62, 48, 29]
passes = 0
highest = marks[0]
for i in range(len(marks)):      # FOR i ← 0 TO LEN(marks) - 1
    if marks[i] >= 40:
        passes = passes + 1
    if marks[i] > highest:
        highest = marks[i]
print(passes)    # 2
print(highest)   # 62
```
:::
::::

Converting is mostly mechanical: `←` becomes `=`, `FOR i ← 0 TO n - 1` becomes `for i in range(n)` (Python's `range` **excludes** its end value), `ENDIF`/`ENDFOR` become the end of the indented block, `OUTPUT` becomes `print`.

{{trace:4.1-1}}

## Hand-tracing and arguing correctness

A **trace table** has a column for each variable (and for conditions and output). Add a new row whenever a value changes. Tracing finds **logic errors** that a quick read misses.

:::example Euclid's algorithm for the highest common factor
```pseudocode
SUBROUTINE hcf(a, b)
    WHILE b ≠ 0
        r ← a MOD b
        a ← b
        b ← r
    ENDWHILE
    RETURN a
ENDSUBROUTINE
```
Trace of `hcf(48, 18)`:

| Step | a | b | b ≠ 0? | r |
|---|---|---|---|---|
| start | 48 | 18 | True | |
| 1 | 18 | 12 | True | 48 MOD 18 = 12 |
| 2 | 12 | 6 | True | 18 MOD 12 = 6 |
| 3 | 6 | 0 | False | 12 MOD 6 = 0 |
| return | **6** | | | |

Check: 48 = 6 × 8 and 18 = 6 × 3, and 8 and 3 share no factor, so 6 is right.
:::

{{trace:4.1-2}}

### Arguing that a program is correct and efficient

The spec asks you to **articulate how a program works**, arguing for its **correctness** and **efficiency** using **logical reasoning**, **test data** and **user feedback**.

| Evidence | For Euclid's algorithm |
|---|---|
| **Logical reasoning** | Any number that divides both a and b also divides a MOD b, so the HCF never changes from one iteration to the next. b gets strictly smaller each time and can't go below 0, so the loop **must terminate**. When b = 0, HCF(a, 0) = a. |
| **Test data** | Normal (48, 18 → 6), boundary (7, 7 → 7; 5, 0 → 5), and a case where a < b (18, 48: the first pass simply swaps them). |
| **Efficiency** | Trying every number from the smaller value downwards takes up to n steps. Euclid takes only a handful of iterations even for huge numbers (it is logarithmic: see [4.6](#/topic/4.6)). |
| **User feedback** | Does the program do what users actually need (e.g. handle negative inputs, give clear messages)? |

```python Euclid in Python, with tests
def hcf(a, b):
    while b != 0:
        a, b = b, a % b
    return a

assert hcf(48, 18) == 6
assert hcf(18, 48) == 6      # a < b still works
assert hcf(7, 7) == 7
assert hcf(5, 0) == 5        # boundary: b already 0
print("all tests passed")
```

:::trap
- A trace table records values **after each step**, in order. Don't jump to the final answer; the marks are for the rows.
- "It works because I tested it" is weak. Testing shows the presence of bugs, not their absence. Combine tests with a **reason** why it always works and always **terminates**.
- An algorithm must **terminate**. A set of steps that can loop forever is not an algorithm by the AQA definition.
:::

## Abstraction

**Abstraction** means removing unnecessary detail so you can focus on what matters for the problem. AQA names several kinds; learn a definition **and** an example for each.

### Representational abstraction

A model formed by **removing unnecessary details**. The London Underground map keeps stations, lines and connections, and throws away distances, bends and streets, because the purpose is to plan a route. A flight simulator models a plane's mass and engine thrust but not the seat fabric.

### Abstraction by generalisation (categorisation)

Grouping things by their **common characteristics** into a hierarchy of **"is a kind of"** relationships. A cocker spaniel *is a kind of* dog; a dog *is a kind of* mammal. In OOP this becomes inheritance ([1.8](#/topic/1.8)). It also works on problems: "this timetabling task is a kind of graph-colouring problem".

### Information hiding

**Hiding all details of an object that do not contribute to its essential characteristics.** A class exposes public methods (its **interface**) and keeps its attributes private. Drivers use pedals and a steering wheel without knowing how the brakes work. Because the inside is hidden, it can be **changed without breaking** the code that uses it.

### Procedural abstraction

A procedure that represents a **computational method**: the **pattern** of the calculation, not specific values.

::::tabs
:::tab Before
```python
def chopping_board_area():
    # tied to one board, one set of numbers
    return 30 * 45

print(chopping_board_area())   # 1350
```
:::
:::tab After procedural abstraction
```python
def rectangle_area(length, width):
    # the method of calculating ANY rectangle's area
    return length * width

print(rectangle_area(30, 45))  # 1350
print(rectangle_area(2, 7))    # 14
```
:::
::::

### Functional abstraction

Go one step further: the user of the function sees only its **name, inputs and output**. The **particular computation method is hidden**. You call Python's `sorted(xs)` or `math.sqrt(x)` without knowing the algorithm inside (Python's sort is in fact Timsort). It's a **black box**.

### Data abstraction

**How data is actually represented is hidden**, which lets you build **new kinds of data objects from previously defined types**. A **stack** is defined by `push`, `pop` and `peek`, whether it's built from an array or a linked list. A queue can be built from two stacks; a graph from a dictionary of lists.

```python Data abstraction: users of Stack never touch the list inside
class Stack:
    def __init__(self):
        self._items = []          # representation hidden (could be a linked list)
    def push(self, x):
        self._items.append(x)
    def pop(self):
        return self._items.pop()
    def is_empty(self):
        return len(self._items) == 0

s = Stack()
s.push(3); s.push(8)
print(s.pop(), s.is_empty())   # 8 False
```

### Problem abstraction (reduction)

**Remove details until the problem is represented in a way that is possible to solve, because it reduces to one that has already been solved.** "Plan the cheapest delivery route between depots" becomes "find the shortest path in a weighted graph", which [Dijkstra's algorithm](#/topic/3.6) already solves. Spotting that a problem is a known *intractable* one (like the travelling salesman problem) is just as useful, because it tells you to use a heuristic.

:::trap Textbook definitions to avoid
The textbook Q&A in your notes gives definitions that would lose marks:
- "Procedural abstraction is the concept that all solutions can be broken down into procedures." That describes **decomposition**. Procedural abstraction means a procedure represents a **computational method**, independent of the specific values.
- "Functional abstraction focuses on common functions." The key idea is that **the computation method is hidden**.
- "Information hiding is similar to data abstraction." Related, but the AQA definition is **hiding all details of an object that do not contribute to its essential characteristics**. Quote it.
- **Abstraction removes detail; information hiding hides detail that still exists** (it is still there, behind the interface).
:::

| Type | One-line definition | Example |
|---|---|---|
| Representational | remove unnecessary detail | Tube map |
| Generalisation | group by common features: "is a kind of" | Spaniel → Dog → Mammal |
| Information hiding | hide details not essential to the object | private attributes, public methods |
| Procedural | procedure = a computational method | `rectangle_area(l, w)` |
| Functional | the computation method is hidden | calling `sqrt(x)` |
| Data | representation of data hidden; build new types from old | stack via array or linked list |
| Problem (reduction) | reduce to an already-solved problem | delivery routes → shortest path |

## Decomposition, composition and automation

**Decomposition** breaks a problem into sub-problems, each accomplishing an **identifiable task**, which may themselves be broken down further. A **hierarchy chart** shows this (top-down design).

:::figure Decomposition of a school library system: each box is an identifiable task; the leaves are small enough to code as one subroutine.
<svg class="diagram" viewBox="0 0 680 230" role="img" aria-label="Hierarchy chart: Library system splits into Members, Loans and Catalogue; each splits into two smaller tasks">
  <g font-family="inherit" font-size="13">
    <rect x="270" y="10" width="140" height="36" rx="6" fill="#7c9aff" fill-opacity="0.35" stroke="currentColor"/><text x="340" y="33" text-anchor="middle" font-weight="bold">Library system</text>
    <line x1="340" y1="46" x2="340" y2="66" stroke="currentColor"/><line x1="110" y1="66" x2="570" y2="66" stroke="currentColor"/>
    <line x1="110" y1="66" x2="110" y2="86" stroke="currentColor"/><line x1="340" y1="66" x2="340" y2="86" stroke="currentColor"/><line x1="570" y1="66" x2="570" y2="86" stroke="currentColor"/>
    <rect x="50" y="86" width="120" height="34" rx="6" fill="#5fd3a0" fill-opacity="0.3" stroke="currentColor"/><text x="110" y="108" text-anchor="middle">Members</text>
    <rect x="280" y="86" width="120" height="34" rx="6" fill="#5fd3a0" fill-opacity="0.3" stroke="currentColor"/><text x="340" y="108" text-anchor="middle">Loans</text>
    <rect x="510" y="86" width="120" height="34" rx="6" fill="#5fd3a0" fill-opacity="0.3" stroke="currentColor"/><text x="570" y="108" text-anchor="middle">Catalogue</text>
    <line x1="110" y1="120" x2="110" y2="140" stroke="currentColor"/><line x1="55" y1="140" x2="165" y2="140" stroke="currentColor"/>
    <line x1="55" y1="140" x2="55" y2="160" stroke="currentColor"/><line x1="165" y1="140" x2="165" y2="160" stroke="currentColor"/>
    <line x1="340" y1="120" x2="340" y2="140" stroke="currentColor"/><line x1="285" y1="140" x2="395" y2="140" stroke="currentColor"/>
    <line x1="285" y1="140" x2="285" y2="160" stroke="currentColor"/><line x1="395" y1="140" x2="395" y2="160" stroke="currentColor"/>
    <line x1="570" y1="120" x2="570" y2="140" stroke="currentColor"/><line x1="515" y1="140" x2="625" y2="140" stroke="currentColor"/>
    <line x1="515" y1="140" x2="515" y2="160" stroke="currentColor"/><line x1="625" y1="140" x2="625" y2="160" stroke="currentColor"/>
    <rect x="5" y="160" width="100" height="44" rx="6" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="55" y="178" text-anchor="middle" font-size="12">Add</text><text x="55" y="194" text-anchor="middle" font-size="12">member</text>
    <rect x="115" y="160" width="100" height="44" rx="6" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="165" y="178" text-anchor="middle" font-size="12">Validate</text><text x="165" y="194" text-anchor="middle" font-size="12">card</text>
    <rect x="235" y="160" width="100" height="44" rx="6" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="285" y="178" text-anchor="middle" font-size="12">Issue</text><text x="285" y="194" text-anchor="middle" font-size="12">book</text>
    <rect x="345" y="160" width="100" height="44" rx="6" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="395" y="178" text-anchor="middle" font-size="12">Calculate</text><text x="395" y="194" text-anchor="middle" font-size="12">fine</text>
    <rect x="465" y="160" width="100" height="44" rx="6" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="515" y="178" text-anchor="middle" font-size="12">Search</text><text x="515" y="194" text-anchor="middle" font-size="12">title</text>
    <rect x="575" y="160" width="100" height="44" rx="6" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="625" y="178" text-anchor="middle" font-size="12">Add</text><text x="625" y="194" text-anchor="middle" font-size="12">book</text>
    <text x="340" y="224" text-anchor="middle" font-size="12">Decomposition reads top → down; composition builds bottom → up</text>
  </g>
</svg>
:::

**Composition** is the reverse: **combining procedures to form compound procedures**, and **combining data objects to form compound data**. `issue_book` might call `validate_card`, `search_title` and `update_loans`. A record combines fields; a **tree** combines nodes, each of which is a record holding data and pointers.

**Automation** is putting the models into action: **creating algorithms**, **implementing them in code and data structures**, and **executing the code**. Abstraction decides *what* to model; automation makes the computer *do* it. A weather forecast is a model of the atmosphere (abstraction); running it on a supercomputer every six hours is automation.

:::why Why computer scientists care
Abstraction makes big problems **thinkable**. Decomposition makes them **shareable** (different programmers take different modules) and **testable** (each module tested on its own). Information hiding makes them **maintainable** (change the inside of a module without breaking the rest).
:::

:::exam
- **Definitions (1–2 marks)** are mark-scheme wording: learn the keyterm phrases exactly. "Removing unnecessary detail" and "is a kind of" are the trigger phrases.
- **"Explain how abstraction could be used in this scenario"**: name the type, then say **what is removed or hidden** in *this* scenario and **why it doesn't matter** for the problem.
- **Trace tables**: one row per change, columns for every variable and output, conditions shown as True/False.
- **"Explain why this algorithm is correct / terminates"**: say what stays true each iteration, and what changes so the loop must eventually stop.
- **Convert pseudocode to code**: keep variable names the same; watch loop ranges (inclusive in AQA `FOR`, exclusive end in Python `range`).
:::

:::challenge
1. Three suspects: A says "B did it", B says "C did it", C says "B is lying". Exactly one tells the truth. Who did it? Write a Python brute-force check.
2. Decompose "run a school sports day" into at least three levels. Mark one place where composition happens.
3. Write `hcf` recursively. Argue that it terminates.
4. For a sat-nav, list three details removed by representational abstraction and one example of problem reduction.
:::

:::recap
- **Algorithm**: a sequence of steps to complete a task that always terminates; built from sequence, assignment, selection and iteration.
- Check logic problems by testing **every case against every condition**.
- **Hand-trace** with a trace table; argue correctness with reasoning, test data and user feedback.
- Abstractions: **representational** (remove detail), **generalisation** ("is a kind of"), **procedural** (computational method), **functional** (method hidden), **data** (representation hidden), **problem reduction** (reduce to a solved problem).
- **Information hiding**: hide details not essential to the object.
- **Decomposition** splits; **composition** combines; **automation** turns models into running code.
:::

:::related
- [1.2 Sequence, selection and iteration](#/topic/1.2)
- [1.8 Object-oriented programming](#/topic/1.8) — information hiding and inheritance
- [2.3 Stacks](#/topic/2.3) — an abstract data type
- [3.6 Dijkstra's shortest path algorithm](#/topic/3.6) — a solved problem to reduce to
- [4.6 Big-O notation](#/topic/4.6) — measuring efficiency
- [13.1 Analysis, design, implementation, testing and evaluation](#/topic/13.1)
:::

*/});
