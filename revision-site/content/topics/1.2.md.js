CS.registerTopic({ id: "1.2", title: "Sequence, selection and iteration" }, function () {/*

:::objectives
- Describe the three basic programming constructs: **sequence**, **selection** and **iteration**.
- Write selection with `IF … THEN … ELSE IF … ELSE … ENDIF`, including **nested selection**, and know when a CASE/match statement is cleaner.
- Distinguish **definite** (count-controlled) and **indefinite** (condition-controlled) iteration, and indefinite loops with the condition at the **start** (WHILE) or the **end** (REPEAT … UNTIL).
- Write and trace **nested iteration**, counting exactly how many times the inner body runs.
- Choose **meaningful identifiers** and explain why they matter.
:::

:::quick At a glance
- **Sequence**: statements run one after another in the order written. Order matters.
- **Selection**: a **condition** (Boolean expression) decides which block runs: `IF`, `ELSE IF`, `ELSE`, or CASE/match.
- **Iteration**: a block is **repeated**. **Definite** = number of repetitions known before the loop starts (`FOR`). **Indefinite** = repeats until a condition changes (`WHILE`, `REPEAT … UNTIL`).
- **WHILE**: condition tested at the **start**; body may run **zero** times; loops while condition **True**.
- **REPEAT … UNTIL**: condition tested at the **end**; body runs **at least once**; loops until condition **True** (i.e. while it is False).
- **Nested** = a construct inside another. Inner FOR of m inside outer FOR of n runs the body **n × m** times.
- **Meaningful identifiers** make code self-documenting: easier to read, debug and maintain, especially in a team.
:::

:::keyterms
Sequence :: Statements executed one after another in the order in which they are written. :: Do this, then this, then this.
Selection :: A construct in which a condition is evaluated to decide which of two or more blocks of code is executed. :: A fork in the road.
Iteration :: The repetition of a block of statements. :: A loop.
Condition :: A Boolean expression that evaluates to True or False and controls selection or iteration. :: The yes/no question.
Definite iteration :: Iteration where the number of repetitions is known before the loop starts; also called count-controlled. :: "Do this 10 times."
Indefinite iteration :: Iteration that repeats until (or while) a condition is met, so the number of repetitions is not known in advance; also called condition-controlled. :: "Keep going until the password is right."
Pre-condition loop :: An indefinite loop with the condition tested at the start (WHILE), so the body may not execute at all. :: Check first, then maybe do.
Post-condition loop :: An indefinite loop with the condition tested at the end (REPEAT … UNTIL), so the body always executes at least once. :: Do once, then check.
Nested structure :: A selection or iteration structure placed inside another selection or iteration structure. :: A loop inside a loop, or an IF inside an IF.
Infinite loop :: A loop whose terminating condition is never met, so it never ends. :: Stuck going round forever.
Rogue (sentinel) value :: A special input value that is not valid data and is used to signal the end of input to a loop. :: Type −1 to stop.
Meaningful identifier :: A name for a variable, constant or subroutine that describes its purpose. :: `totalCost`, not `x`.
:::

## The three constructs

Every algorithm, however complicated, is built from just three control structures. This is the core idea of **structured programming** (see [1.7](#/topic/1.7)).

<svg class="diagram" viewBox="0 0 660 250" role="img" aria-label="Three flowcharts: sequence as three boxes in a line, selection as a diamond splitting into two boxes, iteration as a diamond with an arrow looping back">
  <defs><marker id="arr12" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <text x="100" y="20" text-anchor="middle" stroke="none" font-weight="bold">Sequence</text>
    <rect x="55" y="35" width="90" height="34" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="100" y="57" text-anchor="middle" stroke="none">A</text>
    <line x1="100" y1="69" x2="100" y2="95" marker-end="url(#arr12)"/>
    <rect x="55" y="97" width="90" height="34" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="100" y="119" text-anchor="middle" stroke="none">B</text>
    <line x1="100" y1="131" x2="100" y2="157" marker-end="url(#arr12)"/>
    <rect x="55" y="159" width="90" height="34" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="100" y="181" text-anchor="middle" stroke="none">C</text>

    <text x="330" y="20" text-anchor="middle" stroke="none" font-weight="bold">Selection</text>
    <polygon points="330,35 385,70 330,105 275,70" fill="#f0b429" fill-opacity="0.3"/><text x="330" y="74" text-anchor="middle" stroke="none">cond?</text>
    <line x1="275" y1="70" x2="250" y2="70"/><line x1="250" y1="70" x2="250" y2="130" marker-end="url(#arr12)"/>
    <text x="258" y="62" stroke="none" font-size="12">True</text>
    <line x1="385" y1="70" x2="410" y2="70"/><line x1="410" y1="70" x2="410" y2="130" marker-end="url(#arr12)"/>
    <text x="388" y="62" stroke="none" font-size="12">False</text>
    <rect x="210" y="132" width="80" height="34" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="250" y="154" text-anchor="middle" stroke="none">then-block</text>
    <rect x="370" y="132" width="80" height="34" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="410" y="154" text-anchor="middle" stroke="none">else-block</text>
    <line x1="250" y1="166" x2="250" y2="200"/><line x1="410" y1="166" x2="410" y2="200"/>
    <line x1="250" y1="200" x2="410" y2="200"/><line x1="330" y1="200" x2="330" y2="230" marker-end="url(#arr12)"/>

    <text x="560" y="20" text-anchor="middle" stroke="none" font-weight="bold">Iteration (WHILE)</text>
    <polygon points="560,35 615,70 560,105 505,70" fill="#f0b429" fill-opacity="0.3"/><text x="560" y="74" text-anchor="middle" stroke="none">cond?</text>
    <line x1="560" y1="105" x2="560" y2="130" marker-end="url(#arr12)"/><text x="566" y="122" stroke="none" font-size="12">True</text>
    <rect x="520" y="132" width="80" height="34" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="560" y="154" text-anchor="middle" stroke="none">body</text>
    <line x1="520" y1="149" x2="490" y2="149"/><line x1="490" y1="149" x2="490" y2="70"/><line x1="490" y1="70" x2="503" y2="70" marker-end="url(#arr12)"/>
    <line x1="615" y1="70" x2="645" y2="70"/><line x1="645" y1="70" x2="645" y2="230" marker-end="url(#arr12)"/>
    <text x="620" y="62" stroke="none" font-size="12">False</text>
    <text x="645" y="246" text-anchor="middle" stroke="none" font-size="12">exit</text>
  </g>
</svg>

## Sequence

**Sequence** means statements run in the order they are written. It sounds trivial, but the order is part of the algorithm: swap two lines and the result changes.

```python Order matters
width = 3
height = 5
area = width * height     # must come AFTER width and height are assigned
print(area)               # 15
```

:::example Swapping two variables: why order matters
To swap `a` and `b` you need a temporary variable, and the three assignments must be in this order:

| Step | Statement | a | b | temp |
|---|---|---|---|---|
| start | | 4 | 9 | |
| 1 | `temp ← a` | 4 | 9 | 4 |
| 2 | `a ← b` | 9 | 9 | 4 |
| 3 | `b ← temp` | 9 | 4 | 4 |

If you wrote `a ← b` then `b ← a`, both would end up as 9: the original value of `a` is lost at the first step.
:::

## Selection

**Selection** uses a **condition**, a Boolean expression, to choose which code to run. The condition is usually built from relational operators (`=`, `≠`, `<`, `>`, `≤`, `≥`) and Boolean operators (`AND`, `OR`, `NOT`), covered in [1.3](#/topic/1.3).

::::tabs
:::tab AQA pseudocode
```pseudocode
hour ← 15
IF hour < 12 THEN
    OUTPUT "Good morning"
ELSE IF hour < 18 THEN
    OUTPUT "Good afternoon"
ELSE IF hour < 22 THEN
    OUTPUT "Good evening"
ELSE
    OUTPUT "Good night"
ENDIF
```
:::
:::tab Python
```python
hour = 15
if hour < 12:
    print("Good morning")
elif hour < 18:
    print("Good afternoon")
elif hour < 22:
    print("Good evening")
else:
    print("Good night")
# Good afternoon
```
:::
::::

The conditions are checked **top to bottom** and **only the first True branch runs**. With `hour = 15`, `15 < 12` is False, `15 < 18` is True, so "Good afternoon" is output and the remaining tests are never evaluated.

:::trap
- **Order of ELSE IF tests matters.** If you test `hour < 22` before `hour < 18`, every afternoon hour would print "Good evening". Put the most restrictive test first.
- **Separate IFs are not the same as ELSE IF.** Three independent `IF` statements are all evaluated; several could be True and several outputs appear.
- Use `=` for comparison in pseudocode and `==` in Python. `if x = 5:` is a syntax error in Python.
:::

### Nested selection

**Nested selection** puts an IF inside another IF. The inner condition is only tested if the outer branch is taken.

::::tabs
:::tab AQA pseudocode
```pseudocode
age ← 19
salary ← 14000
hasGuarantor ← True
IF age >= 21 THEN
    IF salary > 15000 THEN
        OUTPUT "You can rent the flat"
    ELSE
        OUTPUT "Salary too low"
    ENDIF
ELSE IF age >= 18 THEN
    IF hasGuarantor THEN
        OUTPUT "Contact guarantor"
    ELSE
        OUTPUT "You need a guarantor"
    ENDIF
ELSE
    OUTPUT "Too young to rent"
ENDIF
```
:::
:::tab Python
```python
age = 19
salary = 14000
has_guarantor = True
if age >= 21:
    if salary > 15000:
        print("You can rent the flat")
    else:
        print("Salary too low")
elif age >= 18:
    if has_guarantor:
        print("Contact guarantor")
    else:
        print("You need a guarantor")
else:
    print("Too young to rent")
# Contact guarantor
```
:::
::::

With age 19, the salary test is **never evaluated**: only the `age >= 18` branch's inner IF runs. Nesting expresses "this question only makes sense if that one was answered yes".

### CASE / match statements

When one variable is compared against several **fixed values**, a CASE statement is clearer than a ladder of ELSE IFs.

::::tabs
:::tab Python (3.10+)
```python
def menu(option):
    match option:
        case 1:
            return "New game"
        case 2:
            return "Load game"
        case 3 | 4:
            return "Settings"
        case _:
            return "Invalid option"

print(menu(2))   # Load game
print(menu(4))   # Settings
print(menu(9))   # Invalid option
```
:::
:::tab VB.NET
```text
Select Case option
    Case 1
        Console.WriteLine("New game")
    Case 2
        Console.WriteLine("Load game")
    Case 3, 4
        Console.WriteLine("Settings")
    Case Else
        Console.WriteLine("Invalid option")
End Select
```
:::
::::

## Iteration

**Iteration** repeats a block of statements. There are two families.

| | Definite (count-controlled) | Indefinite (condition-controlled) |
|---|---|---|
| Number of repetitions | known **before** the loop starts | not known in advance |
| Controlled by | a counter between fixed bounds | a condition |
| Constructs | `FOR i ← 1 TO 10` | `WHILE … ENDWHILE`, `REPEAT … UNTIL` |
| Example | print the 7 times table | keep asking until a valid password is entered |

### Definite iteration: FOR

::::tabs
:::tab AQA pseudocode
```pseudocode
FOR i ← 1 TO 5
    OUTPUT i * i
ENDFOR
# 1 4 9 16 25

FOR i ← 10 TO 0 STEP -2
    OUTPUT i
ENDFOR
# 10 8 6 4 2 0

FOR name IN ["Ali", "Bea"]
    OUTPUT name
ENDFOR
```
:::
:::tab Python
```python
for i in range(1, 6):          # 1 to 5: the stop value is EXCLUSIVE
    print(i * i, end=" ")      # 1 4 9 16 25
print()
for i in range(10, -1, -2):    # 10 down to 0
    print(i, end=" ")          # 10 8 6 4 2 0
print()
for name in ["Ali", "Bea"]:    # "for each" style
    print(name)
```
:::
::::

:::trap
- AQA pseudocode `FOR i ← 1 TO 5` **includes** 5 (5 iterations). Python `range(1, 5)` **stops before** 5 (4 iterations). To get 1 to 5 in Python, write `range(1, 6)`.
- A loop over an array of length n uses `FOR i ← 0 TO LEN(arr) - 1`. Writing `TO LEN(arr)` goes one past the end: an index-out-of-range error.
:::

### Indefinite iteration: condition at the start (WHILE)

A **WHILE** loop tests its condition **before** each pass. If the condition is False at the start, the body runs **zero times**.

::::tabs
:::tab AQA pseudocode
```pseudocode
total ← 0
mark ← USERINPUT
WHILE mark ≠ -1
    total ← total + mark
    mark ← USERINPUT
ENDWHILE
OUTPUT total
```
:::
:::tab Python
```python
# Using a list in place of keyboard input so the example runs
inputs = [12, 7, 30, -1]
k = 0
total = 0
mark = inputs[k]
while mark != -1:          # -1 is the rogue (sentinel) value
    total += mark
    k += 1
    mark = inputs[k]
print(total)               # 49
```
:::
::::

Notice the pattern: **read once before the loop**, then **read again as the last line of the body**. That way the rogue value −1 is tested before it is ever added to the total.

### Indefinite iteration: condition at the end (REPEAT … UNTIL)

A **REPEAT … UNTIL** loop runs the body **first**, then tests. It always runs **at least once** and **stops when the condition becomes True**.

::::tabs
:::tab AQA pseudocode
```pseudocode
REPEAT
    OUTPUT "Enter a number from 1 to 10"
    n ← USERINPUT
UNTIL n >= 1 AND n <= 10
```
:::
:::tab Python
```python
# Python has no REPEAT...UNTIL, so use while True + break
attempts = [0, 14, 7]       # simulated user input
k = 0
while True:
    n = attempts[k]
    k += 1
    if 1 <= n <= 10:        # the UNTIL condition
        break
print("Accepted", n, "after", k, "attempts")   # Accepted 7 after 3 attempts
```
:::
:::tab VB.NET
```text
Do
    Console.WriteLine("Enter a number from 1 to 10")
    n = Console.ReadLine()
Loop Until n >= 1 And n <= 10
```
:::
::::

| | WHILE (pre-condition) | REPEAT … UNTIL (post-condition) |
|---|---|---|
| Condition tested | at the **start** | at the **end** |
| Minimum number of runs | **0** | **1** |
| Keeps looping when condition is | **True** | **False** |
| Best for | processing input that might be empty | menus, validation where you must ask once |

:::trap
- The two loops use **opposite** logic. `WHILE password ≠ "turing"` and `REPEAT … UNTIL password = "turing"` do the same job. Students often keep the same condition when converting, which inverts the behaviour.
- "**Indefinite**" does **not** mean "infinite". It means the number of iterations is not known in advance. An infinite loop is a bug (or a deliberate game loop).
- Any WHILE loop that is meant to end must **change something the condition depends on** inside the body, or it will never terminate.
:::

### Converting between loop types

Every FOR loop can be written as a WHILE loop with an explicit counter. Examiners like asking you to do this.

::::tabs
:::tab FOR
```pseudocode
FOR i ← 1 TO num
    OUTPUT i
ENDFOR
```
:::
:::tab WHILE equivalent
```pseudocode
i ← 1
WHILE i <= num
    OUTPUT i
    i ← i + 1
ENDWHILE
```
:::
:::tab REPEAT equivalent
```pseudocode
i ← 1
REPEAT
    OUTPUT i
    i ← i + 1
UNTIL i > num
# Not identical: if num = 0 this still outputs 1, the FOR outputs nothing
```
:::
::::

## Nested iteration

**Nested iteration** is a loop inside a loop. For each single pass of the outer loop, the inner loop runs **all the way through**.

::::tabs
:::tab AQA pseudocode
```pseudocode
FOR row ← 1 TO 3
    line ← ""
    FOR col ← 1 TO 4
        line ← line + INT_TO_STRING(row * col) + " "
    ENDFOR
    OUTPUT line
ENDFOR
```
:::
:::tab Python
```python
for row in range(1, 4):
    line = ""
    for col in range(1, 5):
        line += str(row * col) + " "
    print(line)
```
```output
1 2 3 4 
2 4 6 8 
3 6 9 12 
```
:::
::::

The inner body runs **3 × 4 = 12** times. If the inner bound depends on the outer variable (e.g. `FOR col ← 1 TO row`), count carefully: 1 + 2 + 3 = 6 times.

:::example Nested loops over a 2D array: find the largest value and where it is
```python
scores = [[45, 71, 34],
          [23, 82, 57],
          [18, 31, 53]]
best = scores[0][0]
best_r, best_c = 0, 0
for r in range(len(scores)):
    for c in range(len(scores[r])):
        if scores[r][c] > best:      # nested selection inside nested iteration
            best = scores[r][c]
            best_r, best_c = r, c
print(best, best_r, best_c)          # 82 1 1
```
Trace of the changes to `best`:

| r | c | scores[r][c] | > best? | best |
|---|---|---|---|---|
| | | | | 45 |
| 0 | 0 | 45 | No | 45 |
| 0 | 1 | 71 | Yes | 71 |
| 0 | 2 | 34 | No | 71 |
| 1 | 0 | 23 | No | 71 |
| 1 | 1 | 82 | Yes | 82 |
| 1 | 2 | 57 | No | 82 |
| 2 | 0..2 | 18, 31, 53 | No | 82 |
:::

{{trace:1.2-1}}

{{trace:1.2-2}}

{{trace:1.2-3}}

## Meaningful identifier names

An **identifier** is the name you give a variable, constant, subroutine or class. **Meaningful** identifiers describe what the thing **is** or **does**.

| Poor | Better | Why |
|---|---|---|
| `x` | `totalCost` | says what is stored |
| `d` | `daysUntilDeadline` | includes the unit and meaning |
| `proc1()` | `calculateVAT()` | subroutine names start with a verb |
| `flag` | `isValidPassword` | Boolean names read as a yes/no question |
| `l` | `length` | `l` looks like `1` |

Why it matters (exam reasons):

- The code becomes **self-documenting**, so fewer comments are needed.
- Other programmers (and you, months later) can **understand and maintain** it more quickly.
- **Bugs are easier to spot**: `totalCost ← totalCost - discount` reads correctly; `t ← t - d` hides mistakes.
- In a **team**, consistent naming reduces misunderstandings when modules are combined.

Single-letter names are acceptable for short-lived **loop counters** (`i`, `j`) because the convention is universally understood.

:::exam
- **"Explain the difference between a WHILE loop and a REPEAT … UNTIL loop"** (2–3 marks): WHILE tests the condition **at the start**, REPEAT **at the end** (1); so a REPEAT loop always executes **at least once** but a WHILE loop **may not execute at all** (1); WHILE repeats while the condition is True, REPEAT until it becomes True (1).
- **"Explain the difference between definite and indefinite iteration"**: definite = number of repetitions **known before the loop starts**; indefinite = repeats until a **condition** is met, so the number is not known in advance.
- **"Rewrite using a WHILE loop"**: initialise the counter before the loop, test it in the WHILE, increment it as the last line of the body.
- **Trace tables**: one row each time a variable changes; write OUTPUT in its own column; check loop bounds (inclusive in pseudocode) twice.
- **"Why use meaningful identifiers?"**: easier to read/understand, easier to debug/maintain, especially by other programmers.
:::

:::challenge
1. Write a program that prints a right-angled triangle of `*` with `n` rows using nested FOR loops. Then do it with a single loop and string multiplication. Which is clearer?
2. FizzBuzz with a twist: for 1 to 30, print "Fizz" for multiples of 3, "Buzz" for 5, "FizzBuzz" for both. Why must the "both" test come first in an ELSE IF chain?
3. Rewrite a REPEAT … UNTIL input-validation loop as a WHILE loop. What extra line do you need before the loop?
4. How many times does the inner body run in `FOR i ← 1 TO n` / `FOR j ← i TO n`? Find a formula in terms of n.
:::

:::recap
- **Sequence**: order of statements matters. **Selection**: a condition chooses a branch; only the first True ELSE IF branch runs. **Iteration**: repetition.
- **Definite** (FOR) = repetitions known in advance; **indefinite** (WHILE, REPEAT) = controlled by a condition.
- **WHILE**: test at start, 0 or more runs, loops while True. **REPEAT … UNTIL**: test at end, 1 or more runs, loops until True.
- AQA `FOR i ← 1 TO 5` includes 5; Python `range(1, 6)` gives 1–5.
- **Nested** loops: inner runs fully for each outer pass (n × m times for fixed bounds).
- **Meaningful identifiers**: self-documenting, easier to debug and maintain, better for teams.
:::

:::related
- [1.1 Data types, variables and constants](#/topic/1.1)
- [1.3 Arithmetic, relational and Boolean operators](#/topic/1.3) — building conditions
- [1.7 Programming paradigms and structured programming](#/topic/1.7)
- [3.5 Sorting algorithms](#/topic/3.5) — nested loops in action
:::

*/});
