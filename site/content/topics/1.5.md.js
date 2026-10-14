CS.registerTopic({ id: "1.5", title: "Subroutines, parameters and scope" }, function () {/*

:::objectives
- Explain that a **subroutine** is a **named, out-of-line block of code** that is executed by **calling its name**.
- Distinguish **procedures** and **functions**, and write subroutines that **return values**.
- Use **parameters** and **arguments** to pass data through a subroutine's **interface**, and explain passing **by value** and **by reference**.
- Explain the **advantages of subroutines** in exam language.
- Explain **local variables** (exist only while the subroutine runs, accessible only inside it) and why using them is good practice; contrast them with **global variables**.
:::

:::quick At a glance
- A **subroutine** is a named block of code that performs a specific task, written **out of line** and run when its name is **called**. Control jumps to it, then **returns** to just after the call.
- **Procedure**: carries out a task, no return value. **Function**: **returns a value** to the calling routine, so it is used inside an expression.
- **Parameter** = the variable named in the subroutine definition. **Argument** = the actual value passed in the call. `area(5, 3)`: 5 and 3 are arguments; `w`, `h` are parameters.
- The **interface** = the subroutine's name, its parameters (number, order, types) and its return value. Callers only need the interface.
- **By value**: a copy is passed, so the original cannot change. **By reference**: the address is passed, so the subroutine can change the caller's variable.
- **Local variable**: declared inside a subroutine; exists **only while it runs**; visible **only inside it**. **Global**: declared outside; visible everywhere; exists for the whole run.
- Prefer locals: no unexpected side effects, same names reusable, memory freed, subroutines independent and testable.
- Advantages of subroutines: **reuse**, **decomposition**, **easier testing/debugging**, **team working**, **readability**, **maintainability**, **libraries**.
:::

:::keyterms
Subroutine :: A named 'out of line' block of code that performs a specific task and can be executed (called) by writing its name in a program statement. :: A mini-program with a name you can run whenever you like.
Procedure :: A subroutine that carries out a task but does not return a value to the calling routine. :: Does something.
Function :: A subroutine that returns a value to the calling routine. :: Works something out and hands it back.
Call :: A statement that transfers control to a subroutine, passing any arguments. :: "Go and run that now."
Parameter :: A variable listed in a subroutine's definition that receives a value when the subroutine is called. :: The named slot in the definition.
Argument :: The actual value (or variable) passed to a subroutine when it is called. :: What you put in the slot.
Interface :: The name, parameters (number, order, data types) and return value(s) of a subroutine, through which it communicates with the rest of the program. :: The plug: what goes in and what comes out.
Return value :: The value a function passes back to the point in the calling routine where it was called. :: The answer it hands back.
Pass by value :: A copy of the argument's value is passed; changes to the parameter do not affect the original variable. :: Photocopy.
Pass by reference :: The address of the argument is passed, so changes made to the parameter change the original variable. :: Give them the original.
Local variable :: A variable declared within a subroutine that exists only while the subroutine executes and can only be accessed within that subroutine. :: Lives and dies inside the subroutine.
Global variable :: A variable declared outside all subroutines that can be accessed from anywhere in the program and exists for the whole time the program runs. :: Visible to everybody, all the time.
Scope :: The part of a program in which a variable (or other identifier) can be accessed. :: Where a name is visible.
Side effect :: A change a subroutine makes to the program's state outside itself, e.g. modifying a global variable. :: An unadvertised change somewhere else.
:::

## What a subroutine is

A **subroutine** is a named block of code that performs one specific task. It is written **out of line**: separately from the main sequence of instructions. It runs only when it is **called** by writing its name.

<svg class="diagram" viewBox="0 0 640 240" role="img" aria-label="Main program on the left calls a subroutine on the right; control jumps out of line to the subroutine and returns to the line after the call">
  <defs><marker id="arr15" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <text x="40" y="22" stroke="none" font-weight="bold">Main program</text>
    <rect x="40" y="32" width="230" height="190" rx="6" fill="none"/>
    <g font-family="monospace" font-size="12" stroke="none">
      <text x="52" y="56">1  name ← USERINPUT</text>
      <text x="52" y="82">2  OUTPUT "Hello " + name</text>
      <text x="52" y="108" font-weight="bold">3  runQuiz()</text>
      <text x="52" y="134">4  OUTPUT "Quiz over"</text>
      <text x="52" y="160">5  ...</text>
    </g>
    <rect x="44" y="94" width="222" height="20" fill="#f0b429" fill-opacity="0.3" stroke="none"/>
    <text x="390" y="22" stroke="none" font-weight="bold">Subroutine (out of line)</text>
    <rect x="380" y="32" width="240" height="140" rx="6" fill="#7c9aff" fill-opacity="0.15"/>
    <g font-family="monospace" font-size="12" stroke="none">
      <text x="392" y="56">SUBROUTINE runQuiz()</text>
      <text x="392" y="82">  OUTPUT "Capital of Peru?"</text>
      <text x="392" y="108">  ans ← USERINPUT</text>
      <text x="392" y="134">  IF ans = "Lima" THEN ...</text>
      <text x="392" y="160">ENDSUBROUTINE</text>
    </g>
    <path d="M266,104 C320,104 330,52 376,52" fill="none" stroke-width="1.5" marker-end="url(#arr15)"/>
    <text x="300" y="70" stroke="none" font-size="12">1. call</text>
    <path d="M380,160 C320,170 320,130 272,130" fill="none" stroke-width="1.5" stroke-dasharray="5 3" marker-end="url(#arr15)"/>
    <text x="292" y="186" stroke="none" font-size="12">2. return to line 4</text>
  </g>
</svg>

When `runQuiz()` is called on line 3, the computer saves where it was (the **return address**), jumps to the subroutine, runs it, then returns to line 4. How the return address is stored is the subject of [1.6 Stack frames](#/topic/1.6).

### Procedures and functions

::::tabs
:::tab AQA pseudocode
```pseudocode
SUBROUTINE showMenu()                  # procedure: no return value
    OUTPUT "1: Play"
    OUTPUT "2: Quit"
ENDSUBROUTINE

SUBROUTINE area(w, h)                  # function: returns a value
    a ← w * h
    RETURN a
ENDSUBROUTINE

showMenu()                             # a call on its own
result ← area(5, 3)                    # a call inside an expression
OUTPUT result                          # 15
OUTPUT area(2, 4) + area(1, 1)         # 9
```
:::
:::tab Python
```python
def show_menu():                  # procedure (returns None)
    print("1: Play")
    print("2: Quit")

def area(w, h):                   # function
    a = w * h
    return a

show_menu()
result = area(5, 3)
print(result)                     # 15
print(area(2, 4) + area(1, 1))    # 9
```
:::
:::tab VB.NET
```text
Sub ShowMenu()
    Console.WriteLine("1: Play")
End Sub

Function Area(w As Integer, h As Integer) As Integer
    Return w * h
End Function
```
VB makes the difference explicit: `Sub` for procedures, `Function … As Type` for functions.
:::
::::

| | Procedure | Function |
|---|---|---|
| Returns a value? | No | **Yes**, via `RETURN` |
| How it is called | as a statement on its own: `showMenu()` | inside an expression: `x ← area(5, 3)` |
| Typical job | output, updating a file, drawing | calculating and returning a result |

Python technically only has functions (a "procedure" just returns `None`), but the concept still matters for the exam.

## Parameters, arguments and interfaces

**Parameters** let a subroutine work on **different data each time** it is called, without relying on global variables.

```pseudocode
SUBROUTINE compare(a, b)        # a and b are PARAMETERS
    IF a > b THEN
        OUTPUT a
    ELSE
        OUTPUT b
    ENDIF
ENDSUBROUTINE

compare(4, 5)                   # 4 and 5 are ARGUMENTS -> outputs 5
x ← 12
compare(x, 7)                   # x's value 12 and 7 are arguments -> outputs 12
```

Arguments are matched to parameters **by position**: the first argument goes into the first parameter, and so on. The number of arguments must match the number of parameters (unless the language supports defaults).

:::trap
- **Parameter vs argument** is a favourite 1-mark question. **Parameter** = in the **definition** (`a`, `b`). **Argument** = in the **call** (`4`, `5`). Memory hook: **A**rguments are the **A**ctual values.
- The argument's name does **not** have to match the parameter's name. `compare(x, 7)` works fine with parameters `a`, `b`.
- Order matters: `area(w, h)` called as `area(3, 5)` sets `w = 3`, `h = 5`.
:::

### The interface

A subroutine's **interface** is everything a caller needs to know to use it: its **identifier**, its **parameters** (how many, in what order, of what type) and what it **returns**. For `area(w, h)`: two numbers in, one number out.

Communicating **only through the interface** means:

- the caller does not need to know **how** the subroutine works (abstraction / information hiding);
- the subroutine's code can be **rewritten** (made faster, fixed) without changing any caller, as long as the interface stays the same;
- a subroutine can be **tested on its own** by calling it with chosen arguments.

### Passing by value and by reference

| | By value | By reference |
|---|---|---|
| What is passed | a **copy** of the value | the **address** (a reference to the original) |
| Can the subroutine change the caller's variable? | **No** | **Yes** |
| Use when | the subroutine only needs to read the data | the subroutine must update the caller's data, or the data is large |
| VB.NET keyword | `ByVal` (default) | `ByRef` |

::::tabs
:::tab VB.NET (explicit)
```text
Sub AddOneByVal(ByVal n As Integer)
    n = n + 1            ' changes the local copy only
End Sub
Sub AddOneByRef(ByRef n As Integer)
    n = n + 1            ' changes the caller's variable
End Sub

Dim x As Integer = 5
AddOneByVal(x)   ' x is still 5
AddOneByRef(x)   ' x is now 6
```
:::
:::tab Python (references to objects)
```python
# Python passes a reference to the OBJECT ("pass by assignment").
def add_one(n):
    n = n + 1             # rebinds the local name only; ints are immutable
    return n

def add_item(items):
    items.append("new")   # mutates the SAME list object the caller has

x = 5
add_one(x)
print(x)                  # 5  - behaves like by value

shopping = ["milk"]
add_item(shopping)
print(shopping)           # ['milk', 'new']  - behaves like by reference
```
:::
::::

:::note Python's rule in one sentence
Every argument is a reference to an object. If the subroutine **rebinds** the parameter (`n = ...`) the caller sees nothing; if it **mutates** a mutable object (`list.append`, `obj.score = ...`) the caller sees the change. See [1.1](#/topic/1.1) for why.
:::

## Returning values

A function sends a value back with `RETURN`. The call **evaluates to** that value, so it can be stored, printed or used in a larger expression.

:::example Functions calling functions
```python
import math

def square(length):
    return length * length

def hypotenuse(a, b):
    return math.sqrt(square(a) + square(b))

print(hypotenuse(3, 4))     # 5.0
```
1. `hypotenuse(3, 4)` is called: `a = 3`, `b = 4`.
2. `square(3)` is called and returns **9**.
3. `square(4)` is called and returns **16**.
4. `9 + 16 = 25`; `math.sqrt(25)` returns **5.0**.
5. `hypotenuse` returns 5.0 to the `print` statement.

Each call is a separate, short-lived **activation** with its own `length` variable.
:::

:::trap
- A `RETURN` **ends the subroutine immediately**; any lines after it in that path are never run.
- A function's return value is **lost** unless the call is used: `square(4)` on a line by itself computes 16 and throws it away.
- **Returning is not outputting.** `RETURN total` hands the value back to the caller; `OUTPUT total` displays it to the user. Exam questions that say "returns" want `RETURN`.
- Make sure **every path** through a function returns a value. A Python function that falls off the end returns `None`.
:::

## Local and global variables

**Scope** is where in a program an identifier can be used.

### Local variables

A **local variable** is declared **inside** a subroutine. It:

- **exists only while the subroutine is executing**: it is created when the subroutine is called and destroyed when it returns;
- is **accessible only within that subroutine**: other subroutines cannot see or change it.

Parameters behave as local variables too. Because each call gets **new** local variables (in its own [stack frame](#/topic/1.6)), two subroutines can both have a local called `amount` without interfering.

```python Locals with the same name do not interfere
def triple(n):
    amount = n * 3        # local to triple
    print(amount)

def quadruple(n):
    amount = n * 4        # a DIFFERENT local, also called amount
    print(amount)

def main():
    amount = 100          # local to main
    print(amount)
    triple(amount)
    quadruple(amount)
    print(amount)         # still 100

main()
```
```output
100
300
400
100
```

### Global variables

A **global variable** is declared outside all subroutines. It is **accessible from anywhere** in the program and **exists for the whole time the program runs**.

```python The global keyword
count = 0                    # global

def bad_increment():
    count = 1                # creates a NEW local; global unchanged

def increment():
    global count             # explicitly use the global
    count = count + 1

bad_increment()
increment()
increment()
print(count)                 # 2
```

### Local vs global

| | Local | Global |
|---|---|---|
| Declared | inside a subroutine | outside all subroutines (main program) |
| Accessible from | only that subroutine | anywhere in the program |
| Lifetime | only while the subroutine executes | the whole run of the program |
| Memory | allocated on the call stack, freed on return | kept for the whole run |
| Same name elsewhere? | allowed; independent | one shared variable |
| Risk | low | any subroutine can change it: hard-to-trace bugs |

### Why using local variables is good practice

1. **No unintended side effects**: a subroutine cannot accidentally change a value used elsewhere, so bugs stay contained.
2. **Self-contained subroutines**: everything a subroutine needs comes in through parameters and goes out through the return value, so it can be **tested independently** and **reused** in other programs.
3. **Names can be reused**: programmers in a team don't need to coordinate every variable name.
4. **Memory efficiency**: memory for locals is released when the subroutine ends.
5. **Easier debugging and maintenance**: you only need to read the subroutine to understand its variables.

Use globals sparingly: e.g. a **constant** used everywhere, or genuinely program-wide state such as settings. Global **constants** are fine because they cannot be changed.

:::trap
- If a local and a global have the **same name**, the local **hides (shadows)** the global inside that subroutine. Changing the local does not change the global.
- Don't say locals are "faster". Say they **avoid side effects**, **free memory when the subroutine ends**, and make subroutines **independent / reusable**.
:::

{{tool:call-stack-visualiser}}

{{trace:1.5-1}}

{{trace:1.5-2}}

## Why use subroutines?

These are the points that score on "Explain the advantages of using subroutines":

| Advantage | Explanation |
|---|---|
| **Reuse / less repetition** | Write once, call many times; the program is shorter and a fix is made in one place |
| **Decomposition** | A large problem is broken into smaller, manageable tasks (top-down design, [1.7](#/topic/1.7)) |
| **Easier testing and debugging** | Each subroutine can be tested on its own with known inputs |
| **Team working** | Different programmers can write different subroutines at the same time |
| **Readability** | Meaningful subroutine names make the main program read like a plan: `getInput()`, `calculateTotal()`, `printReceipt()` |
| **Libraries** | Well-tested subroutines can be stored and reused in other programs |
| **Abstraction** | Callers use the interface without knowing the implementation |

:::exam
- **"State what is meant by a subroutine"** (1–2 marks): a **named** block of code / **out of line** that performs a **specific task** and is run by **calling its name**.
- **"Explain the difference between a function and a procedure"**: a function **returns a value** to the calling routine; a procedure does not.
- **"Explain the difference between a parameter and an argument"**: parameter = variable in the subroutine **definition**; argument = actual **value passed in the call**.
- **"Explain why it is good practice to use local variables"** (2–3 marks): cannot be changed accidentally by other subroutines / no side effects; subroutines are self-contained so easier to test and reuse; memory is released when the subroutine ends; the same identifier can be reused in different subroutines.
- **Tracing**: give each subroutine's locals their own column (e.g. "amount in triple", "amount in main") so you never confuse them.
:::

:::challenge
1. Rewrite a program that uses three global variables so that it uses only parameters and return values. What did you have to change about each subroutine's interface?
2. Write `swap(a, b)` in Python. Why can't it swap two integers in the caller? How does `a, b = b, a` get round this?
3. Write a function `stats(numbers)` that returns the minimum, maximum and mean. How does Python let a function return three values?
4. Add a default parameter `places=2` to a rounding function. How does this change the interface?
:::

:::recap
- **Subroutine** = named, out-of-line block, run by calling its name; control returns to after the call.
- **Function** returns a value (use in an expression); **procedure** does not.
- **Parameters** in the definition; **arguments** in the call; matched by position. **Interface** = name + parameters + return.
- **By value** passes a copy; **by reference** passes an address so the original can change. Python passes object references.
- **Local** = inside a subroutine, exists only while it runs, accessible only there. **Global** = everywhere, whole run.
- Locals avoid side effects, free memory, allow name reuse, make subroutines independent and testable.
- Subroutines give reuse, decomposition, easier testing, teamwork, readability, libraries.
:::

:::related
- [1.6 Stack frames and recursion](#/topic/1.6) — what happens in memory during a call
- [1.7 Programming paradigms and structured programming](#/topic/1.7)
- [1.4 Strings, random numbers and exception handling](#/topic/1.4) — built-in subroutines
:::

*/});
