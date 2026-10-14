CS.registerTopic({ id: "4.7", title: "Limits of computation and the halting problem" }, function () {/*

:::objectives
- Explain how both **algorithmic complexity** and **hardware** limit what can be computed in practice.
- Classify problems as **tractable** or **intractable**, and explain how **heuristics** are used for intractable problems.
- Know that some problems are **non-computable**: no algorithm can solve them, however fast the computer.
- **Describe** the **halting problem** and explain its **significance** for computation, including the idea behind Turing's proof.
:::

:::quick At a glance
- **Tractable** problem: has a **polynomial-time (or better)** solution, e.g. O(n), O(n²), O(n³). Sorting and searching are tractable.
- **Intractable** problem: **no polynomial-time solution** is known; only exponential or worse, e.g. the travelling salesman problem (brute force is O(n!)).
- Intractable ≠ unsolvable: an intractable problem **can** be solved for small n, it just takes impractically long for large n.
- **Heuristics** give a **good-enough** answer in reasonable (polynomial) time, without guaranteeing the best one: e.g. nearest neighbour for TSP.
- **Hardware** limits (processor speed, memory, time available) matter, but faster hardware barely helps an exponential algorithm: 1000× faster lets you handle only about **n + 10** for O(2ⁿ).
- Some problems are **non-computable**: no algorithm exists at all.
- **The halting problem**: is there a program that can decide, for **any** program and **any** input, whether that program will eventually **halt**? Turing proved in 1936 that **no such program can exist**.
- Significance: there are **limits to computation** that no hardware or cleverness can overcome; some problems cannot be solved algorithmically.
:::

:::keyterms
Tractable problem :: A problem that has a polynomial (or less) time solution. :: Solvable in a reasonable time even for large inputs.
Intractable problem :: A problem that can be solved in theory but has no polynomial (or less) time solution; the only known algorithms are exponential or worse. :: Solvable, but would take far too long for big inputs.
Heuristic :: A rule-of-thumb approach that finds an approximate, good-enough solution in a reasonable time, without guaranteeing the optimal one. :: A sensible shortcut that is usually close enough.
Computable problem :: A problem for which an algorithm exists that will solve every instance in a finite number of steps. :: A computer could solve it, given enough time.
Non-computable (unsolvable) problem :: A problem for which no algorithm can exist that solves every instance of it. :: No program could ever solve it in general.
Halting problem :: The unsolvable problem of determining whether any given program will eventually halt (stop) when run with a particular input. :: You can't write a program that predicts whether any program finishes.
Proof by contradiction :: Proving a statement by assuming the opposite and showing that this assumption leads to a logical impossibility. :: Show the alternative is impossible.
Travelling salesman problem (TSP) :: Find the shortest route that visits every one of a set of towns exactly once and returns to the start. :: The classic intractable problem.
:::

## Two kinds of limit

What a computer can do in practice is limited by **two** things:

1. **Hardware**: processor speed, number of processors, memory and storage, and the time we are prepared to wait.
2. **Algorithmic complexity**: how fast the work grows with n (see [4.6](#/topic/4.6)).

Hardware improves every year; complexity does not care. Here is the time needed at a billion (10⁹) basic operations per second:

| n | O(n²) | O(2ⁿ) | O(n!) |
|---|---|---|---|
| 10 | 0.1 microseconds | ≈ 1 microsecond | ≈ 3.6 milliseconds |
| 20 | 0.4 microseconds | ≈ 1 millisecond | ≈ **77 years** |
| 50 | 2.5 microseconds | ≈ **13 days** | ≈ 10⁴⁸ years |
| 100 | 10 microseconds | ≈ **4 × 10¹³ years** | ≈ 3 × 10¹⁴¹ years |

The universe is about 1.4 × 10¹⁰ years old.

:::why Why doesn't a faster computer fix this?
Suppose a computer **1000× faster** arrives. In the same time:
- an **O(n²)** algorithm can handle an input about √1000 ≈ **32 times** larger;
- an **O(2ⁿ)** algorithm can handle an input only about **10 items** larger, because 2¹⁰ ≈ 1000.

So for exponential algorithms, better hardware barely moves the limit. Algorithmic complexity is the real barrier.
:::

## Tractable and intractable problems

| | Tractable | Intractable |
|---|---|---|
| Definition | a **polynomial-time (or better)** algorithm exists | **no** polynomial-time algorithm is known (exponential or worse) |
| Complexity | O(1), O(log n), O(n), O(n log n), O(n²), O(nᵏ) | O(2ⁿ), O(kⁿ), O(n!) |
| Large inputs? | solvable in a reasonable time | impractical: only small n can be solved exactly |
| Examples | searching, sorting, shortest path (Dijkstra), checking a timetable for clashes | travelling salesman, finding the best school timetable, brute-forcing a long encryption key, packing items optimally |

:::figure Classifying problems
<svg class="diagram" viewBox="0 0 560 250" role="img" aria-label="Nested sets: all problems contains computable problems, which contains tractable problems. Intractable problems are computable but outside tractable. Non-computable problems such as the halting problem are outside the computable set.">
  <rect x="10" y="10" width="540" height="230" rx="16" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <text x="26" y="34" font-size="14" font-weight="700">All problems</text>
  <rect x="30" y="48" width="350" height="180" rx="14" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/>
  <text x="46" y="70" font-size="14" font-weight="700">Computable (an algorithm exists)</text>
  <rect x="50" y="84" width="160" height="128" rx="12" fill="#35d4bd" fill-opacity="0.3" stroke="currentColor"/>
  <text x="130" y="110" font-size="14" font-weight="700" text-anchor="middle">Tractable</text>
  <text x="130" y="130" font-size="12" text-anchor="middle">polynomial time</text>
  <text x="130" y="152" font-size="12" text-anchor="middle">sorting, searching,</text>
  <text x="130" y="168" font-size="12" text-anchor="middle">shortest path</text>
  <text x="295" y="110" font-size="14" font-weight="700" text-anchor="middle">Intractable</text>
  <text x="295" y="130" font-size="12" text-anchor="middle">exponential or worse</text>
  <text x="295" y="152" font-size="12" text-anchor="middle">travelling salesman</text>
  <text x="295" y="168" font-size="12" text-anchor="middle">→ use heuristics</text>
  <text x="465" y="110" font-size="14" font-weight="700" text-anchor="middle">Non-computable</text>
  <text x="465" y="130" font-size="12" text-anchor="middle">no algorithm can exist</text>
  <text x="465" y="152" font-size="12" text-anchor="middle">the halting problem</text>
</svg>
:::

:::trap Marks are lost here
- The textbook answer "intractable because they cannot be solved in a time which is practical with current processing power" is too vague for the marks. Use the definition: **no polynomial-time (or better) algorithm exists/is known**. It is about the **algorithm's growth**, not today's hardware.
- **Intractable is not the same as unsolvable.** The travelling salesman problem can be solved exactly for 10 towns. The halting problem cannot be solved by any algorithm at all.
- A problem is tractable if **some** polynomial algorithm exists. Sorting with a silly O(n!) method doesn't make sorting intractable.
:::

## The travelling salesman problem and heuristics

**TSP:** visit every town exactly once and return home by the **shortest** route. Brute force tries every ordering: with n towns and a fixed start there are (n − 1)! orders, so (n − 1)!/2 different routes if direction doesn't matter. 25 towns give about **3.1 × 10²³** routes.

A **heuristic** trades accuracy for speed. The **nearest neighbour** heuristic: from where you are, always go to the **closest town you haven't visited yet**; when all are visited, return home. It runs in O(n²) time, but the route may not be the shortest.

:::example Brute force vs nearest neighbour, five towns
Distances:

| | A | B | C | D | E |
|---|---|---|---|---|---|
| **A** | – | 2 | 9 | 10 | 7 |
| **B** | 2 | – | 6 | 4 | 3 |
| **C** | 9 | 6 | – | 8 | 5 |
| **D** | 10 | 4 | 8 | – | 9 |
| **E** | 7 | 3 | 5 | 9 | – |

**Nearest neighbour from A:**
1. From A the closest unvisited town is **B** (2). Total 2.
2. From B: C 6, D 4, **E 3** → go to E. Total 5.
3. From E: **C 5**, D 9 → go to C. Total 10.
4. From C: only **D** is left (8). Total 18.
5. Return D → A (10). Total **28**. Route A B E C D A.

**Brute force** checks all (5 − 1)!/2 = **12** distinct routes and finds A B D C E A: 2 + 4 + 8 + 5 + 7 = **26**.

The heuristic was fast and only 2 longer (about 8% worse), but **not optimal**. For 50 towns brute force is hopeless, while nearest neighbour still finishes instantly.
:::

{{trace:4.7-1}}

```python Brute force (O(n!)) against the nearest-neighbour heuristic
from itertools import permutations

# distances between five towns (symmetric)
D = {"AB": 2, "AC": 9, "AD": 10, "AE": 7, "BC": 6,
     "BD": 4, "BE": 3, "CD": 8, "CE": 5, "DE": 9}

def dist(x, y):
    return D.get(x + y) or D[y + x]

def length(route):                       # route returns to its start
    return sum(dist(route[i], route[(i + 1) % len(route)]) for i in range(len(route)))

def brute_force(towns):                  # O(n!) - tries every order
    start, rest = towns[0], towns[1:]
    best = min(permutations(rest), key=lambda p: length(start + "".join(p)))
    return start + "".join(best)

def nearest_neighbour(towns):            # heuristic - O(n^2)
    route = towns[0]
    while len(route) < len(towns):
        here = route[-1]
        nxt = min((t for t in towns if t not in route), key=lambda t: dist(here, t))
        route += nxt
    return route

for name, r in [("brute force", brute_force("ABCDE")), ("nearest neighbour", nearest_neighbour("ABCDE"))]:
    print(name, r + r[0], length(r))
```
```output
brute force ABDCEA 26
nearest neighbour ABECDA 28
```

Other heuristic ideas you may meet: **A\*** uses an estimate of the remaining distance to guide its search ([3.6](#/topic/3.6)); greedy algorithms; and methods such as simulated annealing that improve a route bit by bit.

## Problems with no algorithm at all

Some problems are worse than intractable: they are **non-computable**. No algorithm can exist that solves every case, however much time or memory it is given. The most famous example is the **halting problem**.

### The halting problem

When you run a program with some input, it either **halts** (finishes) or runs **forever**.

```pseudocode
# Program 1: halts             # Program 2: never halts
X ← 0                          X ← 1
REPEAT                         REPEAT
  OUTPUT X                       OUTPUT X
  X ← X + 2                      X ← X + 2
UNTIL X = 6                    UNTIL X = 6
# outputs 0, 2, 4              # outputs 1, 3, 5, 7, 9, … forever: X is never 6
```

For these two it's easy to tell. The **halting problem** asks:

> Is it possible to write a program that, given **any** program and **any** input, decides whether that program will eventually halt?

Why not just **run it and see**? If it stops, you know it halts. But if it is still running after an hour, or a year, you can't tell whether it is in an infinite loop or about to finish.

In 1936 **Alan Turing** proved that **no such program can exist**. The halting problem is **unsolvable** (non-computable).

### The idea behind the proof (by contradiction)

You only need to **describe** the halting problem for AQA, not prove it, but the proof idea helps you explain its significance.

1. **Assume** a program `halts(P, I)` exists that always correctly returns True if program P halts on input I, and False if it runs forever.
2. Build a new program `trouble(P)` that uses it:

```pseudocode
SUBROUTINE trouble(P)
  IF halts(P, P) THEN          # would P halt if given its own code as input?
    WHILE True                 # ...then loop forever
    ENDWHILE
  ELSE
    RETURN                     # ...otherwise halt
  ENDIF
ENDSUBROUTINE
```

3. Now run **trouble(trouble)**: feed `trouble` its own code.
   - If `halts(trouble, trouble)` says **True** (it halts), then `trouble` **loops forever**. Contradiction.
   - If it says **False** (it runs forever), then `trouble` **halts**. Contradiction.
4. Either way `halts` gave the wrong answer, so the assumption was false: **`halts` cannot exist**.

:::figure trouble(trouble) does the opposite of whatever halts predicts
<svg class="diagram" viewBox="0 0 560 170" role="img" aria-label="Diagram: trouble asks halts whether trouble halts on itself. If the answer is halts, trouble loops forever; if the answer is loops forever, trouble halts. Both outcomes contradict the prediction.">
  <defs><marker id="arr47" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <rect x="10" y="55" width="170" height="60" rx="10" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
  <text x="95" y="80" font-size="13" text-anchor="middle" font-weight="700">halts(trouble,</text>
  <text x="95" y="98" font-size="13" text-anchor="middle" font-weight="700">trouble)?</text>
  <g stroke="currentColor" stroke-width="1.5" fill="none" marker-end="url(#arr47)"><path d="M180,72 L300,40"/><path d="M180,98 L300,130"/></g>
  <text x="225" y="44" font-size="12">"True: it halts"</text>
  <text x="215" y="140" font-size="12">"False: it loops"</text>
  <rect x="300" y="18" width="250" height="44" rx="10" fill="#ff7a7a" fill-opacity="0.22" stroke="currentColor"/>
  <text x="425" y="45" font-size="13" text-anchor="middle">so trouble loops forever ✗</text>
  <rect x="300" y="108" width="250" height="44" rx="10" fill="#ff7a7a" fill-opacity="0.22" stroke="currentColor"/>
  <text x="425" y="135" font-size="13" text-anchor="middle">so trouble halts ✗</text>
</svg>
:::

### Why it matters (significance)

- It proves that **some problems cannot be solved by any algorithm**, regardless of hardware, programming language or time available. There are **limits to computation**.
- It was proved in 1936, **before practical computers existed**, using the Turing machine as a model ([4.8](#/topic/4.8)).
- In practice: no tool can check **every** program for infinite loops, and no compiler can guarantee to detect all programs that will hang. Tools work on special cases or give "don't know" answers.
- Many other questions about programs ("will this program ever output X?", "do these two programs do the same thing?") can be shown to be unsolvable by **reducing** them to the halting problem.

:::trap Marks are lost here
- The halting problem is **not** "we can't tell whether a particular program halts". For many specific programs we can. It says there is no **general** algorithm that works for **all** programs and inputs.
- Don't say "it would just take too long": it is **impossible**, not slow. That is the difference between **non-computable** and **intractable**.
- AQA asks you to **describe** it and its significance; a full proof isn't required, but "proof by contradiction, Turing, 1936" is useful context.
:::

:::exam
- **"Explain what is meant by an intractable problem"** (2 marks): a problem that can be solved / is computable, but for which **no polynomial-time (or better) algorithm** exists; so it cannot be solved in a reasonable time for large inputs.
- **"Explain how a heuristic approach could be used"** (2–3 marks): name it (e.g. nearest neighbour), say it gives an **approximate/good-enough** solution in **reasonable (polynomial) time**, and that it **does not guarantee the optimal** solution.
- **"Describe the halting problem"** (2 marks): the problem of determining whether **any** program will eventually halt for a **given input**, **without running it**; it has been proved that **no algorithm** can do this for all programs.
- **"Explain the significance of the halting problem"** (1–2 marks): it shows that **some problems cannot be solved algorithmically / are non-computable**, so there are limits to what computers can do, regardless of hardware.
- **"Explain the limits imposed by hardware"**: processor speed, memory and storage limit the size of problem that can be solved in a practical time, but for exponential algorithms faster hardware only increases the solvable n slightly.
:::

:::challenge
1. A computer is 1 000 000× faster. How much larger an input can an O(2ⁿ) algorithm now handle in the same time? And an O(n³) one?
2. Run nearest neighbour on the five-town table starting from **C**. Is the route the same length as starting from A?
3. Write a program that halts for some inputs and not others. Can you prove which inputs make it halt?
4. Explain why "run it for a really long time and see" can never decide the halting problem.
:::

:::recap
- Limits come from **hardware** (speed, memory, time) and from **algorithmic complexity**; for exponential algorithms better hardware barely helps.
- **Tractable**: polynomial time or better. **Intractable**: no polynomial-time solution; solvable only for small n.
- **Heuristics** (e.g. nearest neighbour for TSP) give good-enough answers quickly but aren't guaranteed optimal.
- **Non-computable** problems have **no algorithm at all**.
- **Halting problem**: no program can decide for every program and input whether it halts (Turing, 1936, proof by contradiction).
- Significance: some problems **cannot be solved algorithmically**; there are fundamental limits to computation.
:::

:::related
- [4.6 Big-O notation and classification of algorithms](#/topic/4.6)
- [4.8 Turing machines](#/topic/4.8)
- [3.6 Dijkstra's shortest path algorithm](#/topic/3.6)
:::

*/});
