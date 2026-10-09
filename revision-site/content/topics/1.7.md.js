CS.registerTopic({ id: "1.7", title: "Programming paradigms and structured programming" }, function () {/*

:::objectives
- Explain what a **programming paradigm** is.
- Describe the characteristics of the **procedural** and **object-oriented** paradigms and compare them.
- Explain the **structured approach** to program design and construction: sequence, selection, iteration, subroutines, top-down design, no unrestricted GOTO.
- **Construct and interpret hierarchy charts** when designing programs.
- Explain the **advantages of the structured approach**.
:::

:::quick At a glance
- A **paradigm** is a style or approach to programming: how a problem is broken down and how code is organised.
- **Procedural** (an imperative paradigm): a program is a **sequence of instructions** grouped into **procedures/functions**; **data and the subroutines that act on it are separate**; designed **top-down**.
- **Object-oriented**: a program is a set of **objects** that **combine data (attributes) and behaviour (methods)**, created from **classes**; key ideas are **encapsulation, inheritance, polymorphism**; objects interact by **message passing**.
- **Structured programming**: build programs only from **sequence, selection and iteration**, in **blocks with one entry and one exit**, split into **subroutines/modules**, with **no unrestricted GOTO**.
- **Top-down design / stepwise refinement**: break the problem into sub-problems, then break those down, until each is a small, codeable task.
- A **hierarchy chart** shows that decomposition as a tree of modules: the whole program at the top, sub-tasks below.
- Advantages: easier to **read, test, debug, maintain**; **teams** can work in parallel; modules are **reusable**; fewer errors.
:::

:::keyterms
Programming paradigm :: A fundamental style or approach to programming that determines how a solution is structured and expressed. :: A way of thinking about writing code.
Imperative programming :: A paradigm in which a program is a sequence of statements that change the program's state, telling the computer how to solve the problem step by step. :: "Do this, then this."
Procedural programming :: An imperative paradigm in which the program is built from procedures/functions that are called in sequence, with data held separately from the subroutines that operate on it. :: Organise the code into subroutines.
Object-oriented programming (OOP) :: A paradigm in which a program is made of objects that encapsulate data (attributes) and the methods that operate on that data, and that interact by passing messages. :: Organise the code around things.
Structured programming :: An approach to program design and construction that uses only sequence, selection and iteration in blocks with single entry and exit points, decomposed into modules/subroutines, without unrestricted GOTO jumps. :: Tidy, nested blocks; no spaghetti.
Top-down design :: Breaking a problem down into smaller sub-problems, and those into smaller ones again, until each is simple enough to solve directly; also called stepwise refinement. :: Big job → smaller jobs → tiny jobs.
Stepwise refinement :: The process of repeatedly breaking each task of a design into more detailed sub-tasks. :: Zooming in one level at a time.
Hierarchy chart :: A diagram showing the modules of a program and how they are broken down into sub-modules, as a tree with the whole program at the top. :: A family tree of subroutines.
Module :: A self-contained part of a program, such as a subroutine or group of subroutines, that performs a specific task. :: A building block.
Spaghetti code :: Code whose flow of control jumps around unpredictably (typically through GOTO statements), making it very hard to follow. :: Tangled code.
:::

## What is a paradigm?

A **programming paradigm** is a **style of programming**: a way of organising the solution to a problem. The same problem can be solved in different paradigms, and many languages support several (Python and VB.NET both do procedural and OOP).

| Paradigm | Big idea | Example languages | Where in this course |
|---|---|---|---|
| **Procedural** (imperative) | sequences of instructions organised into subroutines | C, Pascal, BASIC, Python | this page |
| **Object-oriented** (imperative) | objects with attributes and methods, built from classes | Java, C#, VB.NET, Python | this page and [1.8](#/topic/1.8) |
| **Functional** (declarative) | programs are compositions of pure functions; no changing state | Haskell, F# | [12.1](#/topic/12.1) |
| **Declarative / logic** | describe **what** you want, not how | SQL, Prolog | [10.4](#/topic/10.4) |

## The procedural paradigm

### Characteristics

- The program is a **sequence of instructions** that are executed in order, changing the program's **state** (variables): it is **imperative**.
- Code is organised into **procedures and functions** (subroutines) that each carry out one task, with a **main** routine that calls them.
- **Data and subroutines are separate**: data is stored in variables and data structures, and is **passed into** subroutines as parameters (or held globally).
- Programs are designed **top-down**: start with the overall task and decompose it (hierarchy charts).
- Uses the structured constructs **sequence, selection, iteration** with **local and global** variables.

```python Procedural: data is separate from the subroutines that use it
def create_account(owner):
    return {"owner": owner, "balance": 0}

def deposit(account, amount):
    if amount > 0:
        account["balance"] += amount

def withdraw(account, amount):
    if 0 < amount <= account["balance"]:
        account["balance"] -= amount
        return True
    return False

acc = create_account("Priya")
deposit(acc, 100)
withdraw(acc, 30)
acc["balance"] = -999          # nothing stops other code doing this!
print(acc)                     # {'owner': 'Priya', 'balance': -999}
```

The last two lines show the weakness: **nothing protects the data**. Any part of the program can change `balance` directly and bypass the checks in `withdraw`.

## The object-oriented paradigm

### Characteristics

- The program is made of **objects** that model real-world (or conceptual) things.
- Each object **combines data (attributes) and behaviour (methods)** in one unit: **encapsulation**. Attributes are usually **private** and accessed only through public methods.
- Objects are created (**instantiated**) from **classes**, which act as blueprints.
- Classes can **inherit** attributes and methods from a parent class and **override** them: **inheritance** and **polymorphism**.
- Objects interact by **message passing**: calling each other's public methods.

```python Object-oriented: data and methods together, data protected
class Account:
    def __init__(self, owner):
        self.__owner = owner
        self.__balance = 0           # private: hidden inside the object

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount

    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            return True
        return False

    def get_balance(self):
        return self.__balance

acc = Account("Priya")
acc.deposit(100)
acc.withdraw(30)
print(acc.get_balance())             # 70
# acc.__balance = -999 would only create a NEW attribute; the real balance is untouched
```

Here the **only** way to change the balance is through `deposit` and `withdraw`, so the rules are always enforced. Full details of OOP are in [1.8](#/topic/1.8).

### Comparing the two

| | Procedural | Object-oriented |
|---|---|---|
| Unit of organisation | procedures / functions | classes and objects |
| Data and code | **separate**; data passed to subroutines | **combined** in objects (encapsulation) |
| Design approach | top-down decomposition of **tasks** ("what does the system **do**?") | identify **objects** and their interactions ("what **things** are in the system?") |
| Data protection | little: global or passed data can be changed anywhere | private attributes accessed only via methods |
| Reuse | libraries of subroutines | classes, **inheritance**, composition |
| Best suited to | smaller programs, scripts, algorithms with a clear sequence of steps, performance-critical code | large, complex systems with many interacting entities, GUIs, games, simulations; team projects |
| Drawbacks | harder to manage as programs grow; global state causes side-effect bugs | more design effort; can be larger and slower; inheritance misuse causes odd behaviour |

:::trap
- Don't say OOP "doesn't use procedures". Methods **are** procedures and functions, and OOP code still uses sequence, selection and iteration inside them. The difference is **how code and data are organised**.
- Procedural is **not** the same as "no subroutines". A procedural program is built **from** subroutines.
- "Procedural" and "structured/modular" are often used interchangeably at this level; structured programming is the discipline procedural programs follow.
:::

## Structured programming

### Where it came from

Early programs were long lists of instructions with **GOTO** jumps to line numbers. Flow of control leapt backwards and forwards, producing **spaghetti code** that even its author could not follow. In 1968 **Edsger Dijkstra** published *Go To Statement Considered Harmful*, arguing that every program could and should be built from just three control structures.

### The rules of the structured approach

1. Use only the three constructs **sequence, selection, iteration** (proved sufficient for any algorithm).
2. Each block (IF, loop, subroutine) has **one entry point and one exit point**; blocks **nest** inside each other.
3. **No unrestricted GOTO** jumps.
4. Decompose the problem **top-down** into **modules/subroutines**, each doing one task, communicating through **parameters and return values** with **local variables**.
5. Use **meaningful identifiers**, **indentation** and **comments** so the structure is visible.

## Top-down design and hierarchy charts

**Top-down design** starts with the whole problem and breaks it into a few major tasks; each task is refined into sub-tasks (**stepwise refinement**) until every box is simple enough to write as a single subroutine.

A **hierarchy chart** records the result:

- The **top box** is the whole program (or main module).
- Each box is a **module/subroutine**; the boxes beneath it are the sub-tasks it is broken into (the subroutines it calls).
- Boxes are normally read **left to right** in the order they run, but the chart **does not show detailed logic**: no conditions, loops or data flow (that is what flowcharts, pseudocode or structure charts with data couples are for).

:::figure Hierarchy chart for a program that produces a class's exam report
<svg class="diagram" viewBox="0 0 680 260" role="img" aria-label="Hierarchy chart: Exam report program at the top; below it Get marks, Process marks, Produce report; Get marks splits into Read file and Validate mark; Process marks splits into Calculate mean, Find highest and Assign grades; Produce report splits into Print table and Print summary">
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <rect x="260" y="10" width="160" height="38" rx="4" fill="#f0b429" fill-opacity="0.4"/><text x="340" y="34" text-anchor="middle" stroke="none" font-weight="bold">Exam report program</text>
    <line x1="340" y1="48" x2="340" y2="70"/><line x1="105" y1="70" x2="575" y2="70"/>
    <line x1="105" y1="70" x2="105" y2="90"/><line x1="340" y1="70" x2="340" y2="90"/><line x1="575" y1="70" x2="575" y2="90"/>
    <rect x="40" y="90" width="130" height="36" rx="4" fill="#7c9aff" fill-opacity="0.35"/><text x="105" y="113" text-anchor="middle" stroke="none">Get marks</text>
    <rect x="275" y="90" width="130" height="36" rx="4" fill="#7c9aff" fill-opacity="0.35"/><text x="340" y="113" text-anchor="middle" stroke="none">Process marks</text>
    <rect x="510" y="90" width="130" height="36" rx="4" fill="#7c9aff" fill-opacity="0.35"/><text x="575" y="113" text-anchor="middle" stroke="none">Produce report</text>
    <line x1="105" y1="126" x2="105" y2="150"/><line x1="55" y1="150" x2="155" y2="150"/><line x1="55" y1="150" x2="55" y2="170"/><line x1="155" y1="150" x2="155" y2="170"/>
    <rect x="10" y="170" width="90" height="44" rx="4" fill="none"/><text x="55" y="196" text-anchor="middle" stroke="none">Read file</text>
    <rect x="110" y="170" width="90" height="44" rx="4" fill="none"/><text x="155" y="190" text-anchor="middle" stroke="none">Validate</text><text x="155" y="206" text-anchor="middle" stroke="none">mark</text>
    <line x1="340" y1="126" x2="340" y2="150"/><line x1="245" y1="150" x2="435" y2="150"/><line x1="245" y1="150" x2="245" y2="170"/><line x1="340" y1="150" x2="340" y2="170"/><line x1="435" y1="150" x2="435" y2="170"/>
    <rect x="205" y="170" width="80" height="44" rx="4" fill="none"/><text x="245" y="190" text-anchor="middle" stroke="none">Calculate</text><text x="245" y="206" text-anchor="middle" stroke="none">mean</text>
    <rect x="300" y="170" width="80" height="44" rx="4" fill="none"/><text x="340" y="190" text-anchor="middle" stroke="none">Find</text><text x="340" y="206" text-anchor="middle" stroke="none">highest</text>
    <rect x="395" y="170" width="80" height="44" rx="4" fill="none"/><text x="435" y="190" text-anchor="middle" stroke="none">Assign</text><text x="435" y="206" text-anchor="middle" stroke="none">grades</text>
    <line x1="575" y1="126" x2="575" y2="150"/><line x1="530" y1="150" x2="625" y2="150"/><line x1="530" y1="150" x2="530" y2="170"/><line x1="625" y1="150" x2="625" y2="170"/>
    <rect x="490" y="170" width="80" height="44" rx="4" fill="none"/><text x="530" y="190" text-anchor="middle" stroke="none">Print</text><text x="530" y="206" text-anchor="middle" stroke="none">table</text>
    <rect x="585" y="170" width="80" height="44" rx="4" fill="none"/><text x="625" y="190" text-anchor="middle" stroke="none">Print</text><text x="625" y="206" text-anchor="middle" stroke="none">summary</text>
    <text x="340" y="245" text-anchor="middle" stroke="none" font-size="12">Level 0: whole program · Level 1: main tasks · Level 2: sub-tasks (each becomes one subroutine)</text>
  </g>
</svg>
:::

The chart maps directly onto code. Each box becomes a subroutine, and each parent calls its children:

```python Code that follows the hierarchy chart
def read_file():
    return [67, 45, 112, 82, 38]          # stands in for reading a real file

def validate_mark(m):
    return 0 <= m <= 100

def get_marks():
    return [m for m in read_file() if validate_mark(m)]

def calculate_mean(marks):
    return sum(marks) / len(marks)

def find_highest(marks):
    return max(marks)

def assign_grades(marks):
    return ["Pass" if m >= 40 else "Fail" for m in marks]

def process_marks(marks):
    return calculate_mean(marks), find_highest(marks), assign_grades(marks)

def produce_report(marks, mean, highest, grades):
    for m, g in zip(marks, grades):       # print table
        print(m, g)
    print(f"Mean {mean:.1f}, highest {highest}")   # print summary

marks = get_marks()
mean, highest, grades = process_marks(marks)
produce_report(marks, mean, highest, grades)
```
```output
67 Pass
45 Pass
82 Pass
38 Fail
Mean 58.0, highest 82
```

:::example Building a hierarchy chart from a description
**Task:** "A quiz program asks the player's name, then asks ten questions. For each question it shows the question, gets an answer, checks it and updates the score. At the end it shows the score and saves it to the high-score file."

1. **Level 0**: Quiz program.
2. **Level 1** (major stages in order): *Get player name* · *Run quiz* · *Finish game*.
3. **Level 2** under *Run quiz*: *Display question* · *Get answer* · *Check answer* · *Update score*. (The repetition ten times is **not** drawn; it is logic, not structure.)
4. **Level 2** under *Finish game*: *Display score* · *Save high score*.
5. Stop refining when each box is a single, clearly defined task you could code as one subroutine.
:::

:::trap
- A hierarchy chart is **not** a flowchart. Don't draw decision diamonds or arrows for loops; draw **boxes joined by lines**, top to bottom.
- Every box must be a **task** (verb phrase, e.g. "Validate mark"), not data ("Marks").
- Don't put the same detail at different levels. Each level should be a more detailed view of the one above.
:::

### Advantages of the structured approach

| Advantage | Why |
|---|---|
| **Easier to understand** | code flows top to bottom in nested blocks; meaningful module names act as documentation |
| **Easier to test and debug** | each module is small and can be **tested independently**; an error is located to one module |
| **Easier to maintain** | changes are made in one module without affecting others (if interfaces stay the same) |
| **Team development** | modules can be written **in parallel** by different programmers, shortening development time |
| **Reuse** | well-defined modules can be reused in other programs or stored in libraries |
| **Fewer errors / more reliable** | no GOTO jumps; single entry/exit blocks; local variables avoid side effects |
| **Manageable design** | top-down decomposition makes a large problem approachable and easier to estimate and plan |

:::exam
- **"Describe the structured approach to program design"** (3–4 marks): uses only sequence, selection and iteration (1); program broken down top-down into modules/subroutines (1); each module performs a single task (1); modules have one entry and one exit point / no GOTO (1); use of local variables and parameters (1).
- **"Explain the advantages of the structured approach"**: pick 3–4 from the table and **explain** each (advantage + consequence: "modules can be tested independently, **so** errors are easier to locate").
- **Hierarchy chart questions**: either draw one from a description (top box = program, decompose left-to-right in order), or read one ("Which subroutines does *Process marks* call?").
- **Paradigm comparison**: always contrast **how data is handled** (separate vs encapsulated) and **how the problem is decomposed** (tasks vs objects).
:::

:::challenge
1. Draw a hierarchy chart for a cash-machine program (insert card, verify PIN, choose transaction, withdraw/deposit/balance, return card). Then write the skeleton of each subroutine.
2. Rewrite the procedural `Account` code so it uses no global or shared dictionary at all. Is it still procedural? What did you lose compared with the class version?
3. Find an old BASIC program that uses GOTO. Rewrite part of it using only WHILE loops and IF statements.
4. For a game with many types of enemy, argue whether procedural or OOP is more suitable. Then argue the opposite case.
:::

:::recap
- **Paradigm** = an approach to structuring programs. **Procedural**: instructions in subroutines, data separate, top-down. **OOP**: objects combining data and methods from classes; encapsulation, inheritance, polymorphism; message passing.
- **Structured programming**: only sequence, selection, iteration; single-entry/single-exit blocks; no GOTO; modular, top-down.
- **Top-down design / stepwise refinement** produces a **hierarchy chart**: whole program at top, sub-tasks below, no logic shown.
- Advantages: readable, testable module by module, maintainable, team-friendly, reusable, fewer errors.
:::

:::related
- [1.5 Subroutines, parameters and scope](#/topic/1.5)
- [1.8 Object-oriented programming](#/topic/1.8)
- [12.1 Functional programming paradigm](#/topic/12.1)
- [13.1 Analysis, design, implementation, testing and evaluation](#/topic/13.1)
:::

*/});
