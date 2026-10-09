CS.registerTopic({ id: "1.6", title: "Stack frames and recursion" }, function () {/*

:::objectives
- Explain how a **stack frame** on the **call stack** stores the **return address**, **parameters** and **local variables** of each subroutine call.
- Describe exactly what is **pushed** when a subroutine is called and **popped** when it returns.
- Define **recursion**, the **base case** and the **general case**, and explain the mechanism that makes recursion work.
- Trace a recursive subroutine with a trace table **and** with stack-frame diagrams, including a branching (tree) recursion such as Fibonacci.
- Solve simple problems recursively and compare recursion with iteration.
:::

:::quick At a glance
- The **call stack** is a LIFO area of memory holding one **stack frame** per **active** subroutine call.
- A stack frame holds: the **return address** (where to continue in the caller), the **parameters** (values passed in) and the **local variables**. It may also hold saved register values.
- **Call** → a new frame is **pushed**. **Return** → the frame is **popped**, the return value is passed back and execution resumes at the saved return address.
- **Recursion**: a subroutine that **calls itself**. It needs a **base case** (stops the recursion, no recursive call) and a **general case** (calls itself on a **smaller** version of the problem that moves towards the base case).
- Every recursive call gets **its own frame**, so each level keeps its own copy of `n` and its locals: that is the mechanism that makes recursion work.
- No base case, or one that is never reached → frames keep being pushed until memory runs out: **stack overflow**.
- Recursion: shorter, more natural for recursive structures (trees, divide and conquer). Iteration: less memory, usually faster, no overflow risk.
:::

:::keyterms
Call stack :: A stack (LIFO) data structure in memory that stores information about the active subroutines of a running program. :: The pile of "where was I?" notes.
Stack frame :: The block of data pushed onto the call stack for each subroutine call, holding the return address, parameters and local variables. :: One note on the pile, for one call.
Return address :: The address of the instruction in the calling routine to which execution returns when the called subroutine finishes. :: Where to carry on afterwards.
Active subroutine :: A subroutine that has been called but has not yet finished executing. :: Started, not finished.
Recursion :: A technique in which a subroutine calls itself, solving a problem by solving smaller instances of the same problem. :: Defining something in terms of itself.
Recursive subroutine :: A subroutine that contains a call to itself. :: It calls its own name.
Base case :: The terminating situation in a recursive subroutine that is solved directly without a further recursive call. :: The smallest problem, answered straight away.
General case :: The situation in which the subroutine calls itself with a version of the problem that is closer to the base case. :: "Do a bit, then hand the rest to yourself."
Stack overflow :: An error that occurs when the call stack runs out of space, typically because recursion is too deep or never reaches its base case. :: The pile hits the ceiling.
Unwinding :: The process of returning from each recursive call in turn, popping frames and combining the returned values. :: Coming back up the stairs.
:::

## What happens when a subroutine is called

When the program calls a subroutine, five things must happen:

1. The **arguments** must be passed to the subroutine's **parameters**.
2. The **state of the caller** must be saved, in particular **where to come back to**.
3. Space must be made for the subroutine's **local variables**.
4. The subroutine runs and possibly produces a **return value**.
5. The caller's state is restored and execution continues **immediately after the call**.

All of this is managed by the **call stack** (a stack exactly as in [2.3 Stacks](#/topic/2.3)). Each call pushes a **stack frame**; each return pops one.

### What is in a stack frame

| Field | What it holds | Why it is needed |
|---|---|---|
| **Return address** | the address of the next instruction in the **caller** | so execution can resume in the right place after the call |
| **Parameters** | the values passed in as arguments | so the subroutine has its inputs, separate from the caller's variables |
| **Local variables** | space for every variable declared in the subroutine | so each call has its own private variables, discarded on return |
| (saved registers) | e.g. contents of the accumulator/status register | so the caller's working values survive the call |

:::example Stack frames for a simple call
```pseudocode
1  SUBROUTINE main()
2      num1 ← 12
3      num2 ← 6
4      calcProduct(num1, num2)
5      OUTPUT "Done"
6  ENDSUBROUTINE
7
8  SUBROUTINE calcProduct(n1, n2)
9      product ← n1 * n2
10     OUTPUT product
11 ENDSUBROUTINE
```

<svg class="diagram" viewBox="0 0 640 240" role="img" aria-label="Call stack while calcProduct is running: bottom frame for main holds locals num1 12 and num2 6; top frame for calcProduct holds return address line 5, parameters n1 12 and n2 6 and local product 72">
  <defs><marker id="arr16a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <rect x="160" y="20" width="280" height="110" rx="6" fill="#f0b429" fill-opacity="0.3"/>
    <text x="172" y="40" stroke="none" font-weight="bold">Frame: calcProduct(12, 6)</text>
    <g stroke="none" font-family="monospace" font-size="12">
      <text x="180" y="62">return address: line 5 of main</text>
      <text x="180" y="84">parameters:  n1 = 12, n2 = 6</text>
      <text x="180" y="106">local:       product = 72</text>
    </g>
    <rect x="160" y="130" width="280" height="80" rx="6" fill="#7c9aff" fill-opacity="0.3"/>
    <text x="172" y="150" stroke="none" font-weight="bold">Frame: main()</text>
    <g stroke="none" font-family="monospace" font-size="12">
      <text x="180" y="172">return address: (operating system)</text>
      <text x="180" y="194">locals:      num1 = 12, num2 = 6</text>
    </g>
    <line x1="520" y1="40" x2="448" y2="40" marker-end="url(#arr16a)"/>
    <text x="525" y="44" stroke="none">top of stack</text>
    <text x="300" y="232" text-anchor="middle" stroke="none" font-size="12">bottom of call stack (first call) — stack grows upwards</text>
  </g>
</svg>

1. `main` is called: its frame is pushed with space for `num1`, `num2`.
2. Line 4 calls `calcProduct`. A new frame is pushed holding the **return address (line 5)**, the parameters **n1 = 12, n2 = 6** and space for the local **product**.
3. `calcProduct` runs: `product ← 72`, outputs 72.
4. `calcProduct` ends: its frame is **popped**. The return address says "line 5 of main", so execution continues there and outputs "Done".
5. `main` ends: its frame is popped; the stack is empty and the program finishes.
:::

:::note Return address "half-way through a line"
If the call is part of an expression, e.g. `pay ← calcPay(h, r)`, the return address is **part-way through that line**: the assignment still has to happen with the returned value. In machine code that line is several instructions, and the return address points at the instruction after the call.
:::

:::trap
- A stack frame stores the return address, parameters **and** local variables: name **all three** in a "describe" question. Saying only "the stack stores the return address" usually gets 1 mark out of 3.
- The return address is the address in the **caller** to go back to, **not** the address of the subroutine being called.
- Frames are removed in the **reverse** order to which they were added (LIFO). The most recently called subroutine always finishes first.
:::

## Recursion

A **recursive subroutine** is one that **calls itself**. It solves a problem by reducing it to a **smaller instance of the same problem**.

Every correct recursive subroutine has:

- a **base case**: a condition under which it returns an answer **directly**, with **no recursive call**;
- a **general (recursive) case**: it calls itself with arguments that are **closer to the base case**;
- the guarantee that, from any valid starting value, the base case **will be reached**.

### Factorial

`n! = n × (n − 1) × … × 1`, so `n! = n × (n − 1)!` with `1! = 1` (and `0! = 1`).

::::tabs
:::tab AQA pseudocode
```pseudocode
SUBROUTINE factorial(n)
    IF n <= 1 THEN                      # base case
        RETURN 1
    ELSE                                # general case
        RETURN n * factorial(n - 1)
    ENDIF
ENDSUBROUTINE

OUTPUT factorial(4)                     # 24
```
:::
:::tab Python
```python
def factorial(n):
    if n <= 1:                  # base case
        return 1
    return n * factorial(n - 1) # general case: smaller problem

print(factorial(4))   # 24
print(factorial(10))  # 3628800
```
:::
:::tab Iterative version
```python
def factorial_iter(n):
    result = 1
    for i in range(2, n + 1):
        result = result * i
    return result

print(factorial_iter(4))   # 24
```
:::
::::

### How it really works: frames for factorial(4)

The multiplication `n * factorial(n - 1)` **cannot finish** until the inner call returns. So each call's frame waits on the stack, holding its own `n`.

<svg class="diagram" viewBox="0 0 680 300" role="img" aria-label="Call stack for factorial 4 at its deepest point: four frames for n equals 4, 3, 2 and 1, each with a return address; on the right the values 1, 2, 6 and 24 are returned as frames are popped">
  <defs><marker id="arr16b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <text x="40" y="20" stroke="none" font-weight="bold">Call stack at its deepest point</text>
    <rect x="40" y="30" width="300" height="52" rx="6" fill="#f0b429" fill-opacity="0.35"/>
    <text x="52" y="50" stroke="none" font-weight="bold">factorial(1)  ← base case</text>
    <text x="52" y="70" stroke="none" font-family="monospace" font-size="12">n = 1 · return to: mid-line in factorial(2)</text>
    <rect x="40" y="86" width="300" height="52" rx="6" fill="#7c9aff" fill-opacity="0.3"/>
    <text x="52" y="106" stroke="none" font-weight="bold">factorial(2)</text>
    <text x="52" y="126" stroke="none" font-family="monospace" font-size="12">n = 2 · return to: mid-line in factorial(3)</text>
    <rect x="40" y="142" width="300" height="52" rx="6" fill="#7c9aff" fill-opacity="0.3"/>
    <text x="52" y="162" stroke="none" font-weight="bold">factorial(3)</text>
    <text x="52" y="182" stroke="none" font-family="monospace" font-size="12">n = 3 · return to: mid-line in factorial(4)</text>
    <rect x="40" y="198" width="300" height="52" rx="6" fill="#7c9aff" fill-opacity="0.3"/>
    <text x="52" y="218" stroke="none" font-weight="bold">factorial(4)</text>
    <text x="52" y="238" stroke="none" font-family="monospace" font-size="12">n = 4 · return to: OUTPUT in main</text>
    <rect x="40" y="254" width="300" height="34" rx="6" fill="none"/>
    <text x="52" y="276" stroke="none">main program</text>
    <g stroke="none" font-size="13">
      <text x="400" y="60">returns 1</text>
      <text x="400" y="116">returns 2 × 1 = 2</text>
      <text x="400" y="172">returns 3 × 2 = 6</text>
      <text x="400" y="228">returns 4 × 6 = 24</text>
      <text x="400" y="276">OUTPUT 24</text>
    </g>
    <line x1="390" y1="66" x2="390" y2="104" marker-end="url(#arr16b)"/>
    <line x1="390" y1="122" x2="390" y2="160" marker-end="url(#arr16b)"/>
    <line x1="390" y1="178" x2="390" y2="216" marker-end="url(#arr16b)"/>
    <line x1="390" y1="234" x2="390" y2="264" marker-end="url(#arr16b)"/>
    <text x="560" y="150" stroke="none" font-size="12" text-anchor="middle">unwinding:</text>
    <text x="560" y="166" stroke="none" font-size="12" text-anchor="middle">pop a frame,</text>
    <text x="560" y="182" stroke="none" font-size="12" text-anchor="middle">pass value down</text>
  </g>
</svg>

:::example Full trace of factorial(4)
| Step | Event | Stack (bottom → top) | n in current frame | Value returned |
|---|---|---|---|---|
| 1 | call factorial(4) | main, f(4) | 4 | |
| 2 | 4 ≤ 1? No → call factorial(3) | main, f(4), f(3) | 3 | |
| 3 | 3 ≤ 1? No → call factorial(2) | main, f(4), f(3), f(2) | 2 | |
| 4 | 2 ≤ 1? No → call factorial(1) | main, f(4), f(3), f(2), f(1) | 1 | |
| 5 | 1 ≤ 1? **Yes, base case** → return 1, pop | main, f(4), f(3), f(2) | 2 | 1 |
| 6 | f(2) completes 2 × 1 → return 2, pop | main, f(4), f(3) | 3 | 2 |
| 7 | f(3) completes 3 × 2 → return 6, pop | main, f(4) | 4 | 6 |
| 8 | f(4) completes 4 × 6 → return 24, pop | main | | 24 |

Key points: **four** frames for factorial exist at once (step 4–5); each has its **own n**; the work is done on the way **back** (unwinding), not on the way down.
:::

{{tool:call-stack-visualiser}}

{{trace:1.6-1}}

### Output before or after the recursive call?

Where the OUTPUT is placed relative to the recursive call changes the order completely.

::::tabs
:::tab Before the call (counts down)
```python
def countdown(n):
    if n <= 0:
        print("Lift off")
    else:
        print(n)          # output on the way DOWN
        countdown(n - 1)

countdown(3)
```
```output
3
2
1
Lift off
```
:::
:::tab After the call (counts up)
```python
def countup(n):
    if n > 0:
        countup(n - 1)
        print(n)          # output on the way BACK UP (unwinding)

countup(3)
```
```output
1
2
3
```
:::
::::

{{trace:1.6-2}}

## Tree recursion: Fibonacci

Some subroutines call themselves **more than once**. The Fibonacci numbers are 0, 1, 1, 2, 3, 5, 8, …: each is the sum of the previous two.

::::tabs
:::tab AQA pseudocode
```pseudocode
SUBROUTINE fib(n)
    IF n < 2 THEN              # two base cases: fib(0)=0, fib(1)=1
        RETURN n
    ELSE
        RETURN fib(n - 1) + fib(n - 2)
    ENDIF
ENDSUBROUTINE
```
:::
:::tab Python
```python
calls = 0
def fib(n):
    global calls
    calls += 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(4), calls)    # 3 9
calls = 0
print(fib(10), calls)   # 55 177
```
:::
::::

The calls form a **tree**. The left branch is fully evaluated (depth-first) before the right branch starts.

<svg class="diagram" viewBox="0 0 660 270" role="img" aria-label="Call tree for fib 4: fib 4 calls fib 3 and fib 2; fib 3 calls fib 2 and fib 1; each fib 2 calls fib 1 and fib 0. Return values shown beside each node; 9 calls in total">
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <g stroke-width="1.2">
      <line x1="330" y1="40" x2="190" y2="100"/><line x1="330" y1="40" x2="500" y2="100"/>
      <line x1="190" y1="100" x2="110" y2="165"/><line x1="190" y1="100" x2="270" y2="165"/>
      <line x1="500" y1="100" x2="450" y2="165"/><line x1="500" y1="100" x2="560" y2="165"/>
      <line x1="110" y1="165" x2="60" y2="230"/><line x1="110" y1="165" x2="160" y2="230"/>
    </g>
    <g>
      <rect x="290" y="24" width="80" height="30" rx="14" fill="#f0b429" fill-opacity="0.45"/><text x="330" y="44" text-anchor="middle" stroke="none">fib(4)</text>
      <rect x="150" y="85" width="80" height="30" rx="14" fill="#7c9aff" fill-opacity="0.35"/><text x="190" y="105" text-anchor="middle" stroke="none">fib(3)</text>
      <rect x="460" y="85" width="80" height="30" rx="14" fill="#7c9aff" fill-opacity="0.35"/><text x="500" y="105" text-anchor="middle" stroke="none">fib(2)</text>
      <rect x="70" y="150" width="80" height="30" rx="14" fill="#7c9aff" fill-opacity="0.35"/><text x="110" y="170" text-anchor="middle" stroke="none">fib(2)</text>
      <rect x="230" y="150" width="80" height="30" rx="14" fill="none"/><text x="270" y="170" text-anchor="middle" stroke="none">fib(1)</text>
      <rect x="410" y="150" width="80" height="30" rx="14" fill="none"/><text x="450" y="170" text-anchor="middle" stroke="none">fib(1)</text>
      <rect x="520" y="150" width="80" height="30" rx="14" fill="none"/><text x="560" y="170" text-anchor="middle" stroke="none">fib(0)</text>
      <rect x="20" y="215" width="80" height="30" rx="14" fill="none"/><text x="60" y="235" text-anchor="middle" stroke="none">fib(1)</text>
      <rect x="120" y="215" width="80" height="30" rx="14" fill="none"/><text x="160" y="235" text-anchor="middle" stroke="none">fib(0)</text>
    </g>
    <g stroke="none" font-size="12" font-weight="bold">
      <text x="376" y="44">= 3</text><text x="236" y="105">= 2</text><text x="546" y="105">= 1</text><text x="156" y="170">= 1</text>
      <text x="316" y="170">= 1</text><text x="496" y="170">= 1</text><text x="606" y="170">= 0</text><text x="66" y="262" text-anchor="middle">= 1</text><text x="160" y="262" text-anchor="middle">= 0</text>
    </g>
    <text x="640" y="250" text-anchor="end" stroke="none" font-size="12">9 calls · plain boxes are base cases</text>
  </g>
</svg>

- The **maximum depth** of the stack is only 4 frames for fib(4) (e.g. fib(4) → fib(3) → fib(2) → fib(1)), because each branch's frames are popped before the next branch starts.
- But the **number of calls** explodes: fib(2) is worked out **twice**, and fib(30) needs over 2.6 million calls. Naive tree recursion can be hugely inefficient; storing results already calculated (memoisation) or using iteration fixes it.

{{trace:1.6-3}}

## Solving problems recursively

The recipe from the teacher's slides, made precise:

:::steps Writing a recursive subroutine
1. **Find the general case**: express the answer for size n in terms of the answer for a smaller size (n − 1, n DIV 2, the rest of a list…).
2. **Find the base case(s)**: the smallest input(s) whose answer you know without recursion. It must contain **no recursive call**.
3. **Check progress**: every general-case call must move **towards** the base case, and every valid input must eventually reach it.
4. **Write the IF**: test for the base case **first**, otherwise do the general case.
5. **Trace a small example** to check.
:::

:::example More recursive solutions
```python
def sum_to(n):                 # 1 + 2 + ... + n (triangular numbers)
    if n == 1:
        return 1
    return n + sum_to(n - 1)

def sum_digits(n):             # 4072 -> 4 + 0 + 7 + 2
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)

def is_palindrome(s):          # two base cases
    if len(s) <= 1:
        return True
    if s[0] != s[-1]:
        return False
    return is_palindrome(s[1:-1])

def power(base, exp):          # base ** exp for exp >= 0
    if exp == 0:
        return 1
    return base * power(base, exp - 1)

print(sum_to(5), sum_digits(4072), is_palindrome("racecar"), is_palindrome("rocket"), power(2, 10))
# 15 13 True False 1024
```
:::

:::collapse Tower of Hanoi (from your recursion presentation)
Move n discs from peg A to peg C using B, never placing a larger disc on a smaller one.

- **Base case**: 1 disc → move it directly.
- **General case**: move n − 1 discs A → B (using C); move the largest disc A → C; move n − 1 discs B → C (using A).

```python
moves = []
def hanoi(n, source, target, spare):
    if n == 1:
        moves.append(source + "->" + target)
    else:
        hanoi(n - 1, source, spare, target)
        moves.append(source + "->" + target)
        hanoi(n - 1, spare, target, source)

hanoi(3, "A", "C", "B")
print(len(moves), moves)
# 7 ['A->C', 'A->B', 'C->B', 'A->C', 'B->A', 'B->C', 'A->C']
```
n discs need 2<sup>n</sup> − 1 moves. The iterative solution is far harder to write: a good example of where recursion is the natural approach.
:::

### Stack overflow

If the base case is missing, wrong, or skipped, the subroutine keeps calling itself. Each call pushes another frame; the call stack has a **finite** size, so eventually there is no room: **stack overflow**, and the program crashes.

```python
import sys
print(sys.getrecursionlimit())     # 1000 by default in CPython

def no_base(n):
    return no_base(n - 1)          # no base case!

try:
    no_base(5)
except RecursionError as e:
    print("Crashed:", e)           # Crashed: maximum recursion depth exceeded
```

:::trap
- **Base case must not recurse**, and the general case must **move towards** it. `factorial(n)` that calls `factorial(n + 1)`, or a base case `n = 0` reached only from even n with a step of 2, will overflow.
- A recursive subroutine call is **not** a loop. Each call creates a **new frame with new copies** of parameters and locals; nothing is overwritten.
- One online source calls the base case a "rogue value or sentinel value". Don't use those words for it: a rogue value is a special **input** that ends a loop (see [1.2](#/topic/1.2)). Say **base case** or **terminating condition**.
- "Every recursive algorithm can be written iteratively" is true, but the iterative version may need an explicit stack of its own (e.g. tree traversal).
:::

## Recursion vs iteration

| | Recursion | Iteration |
|---|---|---|
| Code | often shorter, closer to the mathematical definition | can be longer for naturally recursive problems |
| Natural for | trees, graphs (DFS), divide-and-conquer (merge sort, binary search), Hanoi | simple repetition, processing a list once |
| Memory | a new **stack frame per call**: O(depth) extra memory | constant extra memory for a simple loop |
| Speed | slower: overhead of pushing/popping frames | usually faster |
| Risk | **stack overflow** if too deep or no base case | infinite loop if the condition never changes |
| Debugging | harder to trace: many simultaneous activations | easier to trace |

:::exam
- **"Explain how a stack frame is used when a subroutine is called"** (3–4 marks): a frame is **pushed** onto the call stack when the subroutine is called (1); it stores the **return address** (1), the **parameters** (1) and the **local variables** (1); when the subroutine ends the frame is **popped** and execution resumes at the return address (1).
- **"Explain what is meant by a recursive subroutine"**: a subroutine that **calls itself** (1); it has a **base case** that terminates the recursion (1).
- **"Why must a recursive subroutine have a base case?"**: otherwise it never stops calling itself; frames are pushed until the stack runs out of memory: **stack overflow**.
- **"Explain why recursion uses more memory than iteration"**: each recursive call pushes a **new stack frame** (return address, parameters, locals) that stays on the stack until that call returns.
- **Trace tables for recursion**: number the calls, write each call's parameter on its own row going down, and the return values coming back up in reverse order. Write the OUTPUT column in the order outputs actually happen.
:::

:::challenge
1. Write a recursive binary search on a sorted list (see [3.4](#/topic/3.4)). What are the base cases? What is the maximum stack depth for 1,000 items?
2. Add memoisation to `fib` with a dictionary. How many calls does fib(30) make now?
3. Write a recursive function that returns the number of nodes in a binary tree stored as nested tuples `(left, value, right)`.
4. Rewrite `countup(n)` iteratively, and then rewrite an in-order tree traversal iteratively using your own stack. Which was harder, and why?
:::

:::recap
- The **call stack** holds one **frame** per active call: **return address, parameters, local variables** (plus saved registers).
- Call = push frame; return = pop frame, pass back value, resume at return address. LIFO, so the latest call finishes first.
- **Recursion** = subroutine calls itself; needs a **base case** (no recursive call) and a **general case** that moves towards it.
- Each recursive call has its **own frame**, so its own copies of variables; results are combined while **unwinding**.
- No/unreachable base case → **stack overflow**.
- Tree recursion (fib) can make a huge number of calls even though stack depth stays small.
- Recursion: elegant, natural for recursive structures; costs memory and time; iteration is leaner.
:::

:::related
- [2.3 Stacks](#/topic/2.3) — the data structure behind the call stack
- [1.5 Subroutines, parameters and scope](#/topic/1.5)
- [3.2 Tree traversal](#/topic/3.2) and [3.5 Sorting algorithms](#/topic/3.5) — recursion in action
- [3.4 Searching algorithms](#/topic/3.4) — recursive binary search
:::

*/});
