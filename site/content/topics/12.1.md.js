CS.registerTopic({ id: "12.1", title: "The functional programming paradigm" }, function () {/*

:::objectives
- Describe the **functional programming paradigm** and its characteristics: pure functions, immutability, no side effects, recursion instead of loops, declarative style.
- Write and interpret a **function type** `f: A → B`, and use the terms **domain**, **co-domain** and **range** correctly.
- Explain what it means for a function to be a **first-class object**, and what **function application** is.
- Use AQA notation for **partial function application** of one-, two- and three-argument functions, e.g. `add: integer → integer → integer`.
- Compose functions with `∘` and evaluate `(f ∘ g)(x) = f(g(x))` correctly, in maths, Haskell and Python.
:::

:::quick At a glance
- In **functional programming**, a program is built from **functions** in the mathematical sense: each maps inputs to an output and does **nothing else** (no side effects).
- A **function type** is written `f: A → B`. **A = domain** (set of possible inputs), **B = co-domain** (set the outputs are chosen from). Both are subsets of objects of some data type.
- The **range** is the set of outputs actually produced: **range ⊆ co-domain**. They are not the same thing.
- Functions are **first-class objects**: they can be passed as arguments, returned as results and assigned to names.
- **Function application** = giving a function its arguments: `add 3 4` → `7`.
- **Partial application**: give a function *fewer* arguments than it takes and you get back a **new function** waiting for the rest. `add: integer → integer → integer`, so `add 3: integer → integer`.
- **Composition**: `(f ∘ g)(x) = f(g(x))`: **g is applied first**, then f. In Haskell: `(f . g) x`. Needs the co-domain of g to match the domain of f.
:::

:::keyterms
Functional programming :: A programming paradigm in which programs are constructed by applying and composing functions, which take arguments and return values without side effects. :: Programs made of maths-style functions joined together.
Function :: A rule that maps every element of its domain to exactly one element of its co-domain. :: Each input gives exactly one output.
Function type :: The description f: A → B of a function f that maps arguments of type A to results of type B. :: What goes in and what comes out.
Domain :: The set from which a function's input values (arguments) are chosen. :: Allowed inputs.
Co-domain :: The set from which a function's output values are chosen; not every member need be produced. :: Where outputs come from (the "type" of the output).
Range :: The set of values a function actually produces for its domain; a subset of the co-domain. :: The outputs you actually get.
First-class object :: An object that may appear in expressions, be assigned to a variable, be passed as an argument and be returned from a function call. :: Something you can pass around like any other value.
Function application :: The process of giving particular inputs (arguments) to a function to obtain its result. :: Calling the function.
Partial function application :: Applying a function to fewer arguments than it takes, which returns a new function that takes the remaining arguments. :: Fix some inputs now, get a function that wants the rest.
Function composition :: Combining two functions to form a new function: (f ∘ g)(x) = f(g(x)), where g is applied first. :: Plug the output of one function into another.
Higher-order function :: A function that takes a function as an argument or returns a function as its result, or both. :: A function that works with other functions.
Side effect :: A change to state outside a function, other than returning its result, e.g. modifying a global variable. :: A function sneakily changing something else.
Immutable :: Cannot be changed after it is created. :: Fixed once made.
:::

## What makes a language "functional"?

In **imperative** programming (Python, VB.NET as normally written) you give the computer a **sequence of instructions** that change **variables** step by step. In **functional programming** you describe **what** the result is, as functions of the inputs. Functional programming is a kind of **declarative** programming.

| Characteristic | What it means | Imperative contrast |
|---|---|---|
| **Pure functions** | Output depends **only** on the arguments | Result may depend on global variables |
| **No side effects** | A function changes nothing outside itself; it just returns a value | Procedures often update globals, files, parameters by reference |
| **Immutability** | Values never change once created; "adding" to a list makes a new list | `x ← x + 1` changes `x` |
| **Statelessness** | No changing program state to keep track of | Program state changes every line |
| **Recursion instead of loops** | Repetition is done by functions calling themselves | `FOR` / `WHILE` loops with counters |
| **Functions are first-class** | Functions passed and returned like data | Often not possible, or awkward |
| **Referential transparency** | Any call can be replaced by its value without changing the program | `random()` or `getTotal()` might differ each call |

:::why Why bother?
- **Easier to test and prove correct**: a pure function can be tested on its own; the same input always gives the same output.
- **Fewer bugs** from variables changing unexpectedly.
- **Safe to run in parallel**: order of evaluation doesn't matter, which is why FP suits [Big Data](#/topic/11.1).
- **Concise**: higher-order functions like `map` replace whole loops.
:::

```haskell Haskell: a value cannot be reassigned
myPi = 3.14
-- myPi = 4      -- compile error: Multiple declarations of 'myPi'

double :: Integer -> Integer
double x = x * 2   -- pure: depends only on x, changes nothing
```

## Function types: domain, co-domain and range

:::definition Function type (AQA)
A function `f` has a **function type** `f: A → B`, where **A** is the **domain** and **B** the **co-domain**. The domain and co-domain are always **subsets of objects in some data type**. A function maps each element of A to **exactly one** element of B.
:::

The AQA spec reads `f: A → B` as "f is a function **from** A **to** B". The type is part of the function's definition, just as a variable has a data type.

:::figure square: ℤ → ℤ. The co-domain is all integers; the range (highlighted) is only the perfect squares actually produced.
<svg class="diagram" viewBox="0 0 560 250" role="img" aria-label="Mapping diagram: domain values -2 to 2 map onto 4, 1, 0 inside a larger co-domain">
  <defs><marker id="arr121" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="14">
    <ellipse cx="120" cy="125" rx="70" ry="105" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/>
    <text x="120" y="16" text-anchor="middle" font-weight="bold">Domain (ℤ)</text>
    <text x="120" y="50" text-anchor="middle">−2</text><text x="120" y="88" text-anchor="middle">−1</text><text x="120" y="126" text-anchor="middle">0</text><text x="120" y="164" text-anchor="middle">1</text><text x="120" y="202" text-anchor="middle">2</text>
    <ellipse cx="420" cy="125" rx="90" ry="105" fill="#ffb86b" fill-opacity="0.15" stroke="currentColor"/>
    <text x="420" y="16" text-anchor="middle" font-weight="bold">Co-domain (ℤ)</text>
    <rect x="360" y="60" width="70" height="120" rx="12" fill="#5fd3a0" fill-opacity="0.35" stroke="currentColor" stroke-dasharray="4 3"/>
    <text x="395" y="198" text-anchor="middle" font-size="12">range</text>
    <text x="395" y="85" text-anchor="middle">4</text><text x="395" y="125" text-anchor="middle">1</text><text x="395" y="165" text-anchor="middle">0</text>
    <text x="470" y="80" text-anchor="middle">3</text><text x="470" y="125" text-anchor="middle">−5</text><text x="470" y="170" text-anchor="middle">2</text>
    <line x1="135" y1="46" x2="383" y2="80" stroke="currentColor" marker-end="url(#arr121)"/>
    <line x1="135" y1="84" x2="383" y2="121" stroke="currentColor" marker-end="url(#arr121)"/>
    <line x1="135" y1="122" x2="383" y2="161" stroke="currentColor" marker-end="url(#arr121)"/>
    <line x1="135" y1="160" x2="383" y2="123" stroke="currentColor" marker-end="url(#arr121)"/>
    <line x1="135" y1="198" x2="383" y2="84" stroke="currentColor" marker-end="url(#arr121)"/>
    <text x="280" y="242" text-anchor="middle" font-size="12">3, −5 and 2 are in the co-domain but no input maps to them</text>
  </g>
</svg>
:::

| Function | Type | Domain | Co-domain | Range |
|---|---|---|---|---|
| `square(x) = x²` | `square: ℤ → ℤ` | ℤ | ℤ | {0, 1, 4, 9, 16, …} |
| `isEven(n)` | `isEven: ℤ → Boolean` | ℤ | {True, False} | {True, False} |
| `length(s)` | `length: String → ℕ` | all strings | ℕ | ℕ |
| `sin(x)` | `sin: ℝ → ℝ` | ℝ | ℝ | real numbers from −1 to 1 |

:::trap Co-domain is not the range
The student slides say the co-domain is "called the range in A Level Maths". That is **imprecise**. The **co-domain** is the set outputs are *chosen from* (part of the type). The **range** is the set of outputs *actually produced*. **Range ⊆ co-domain**: for `square: ℤ → ℤ` the co-domain is every integer, but the range is only perfect squares. If the exam asks for the co-domain, give the **type/set in the function type** (e.g. "integers"), not the list of outputs.
:::

In Haskell the type is written with `::` and `->`:

```haskell
isEven :: Integer -> Bool
isEven n = n `mod` 2 == 0

initial :: String -> Char
initial name = head name
```

## Function application

**Function application** means applying a function to its arguments. In maths you write `add(3, 4)`; in Haskell you just put the arguments after the name, separated by spaces, no brackets or commas.

```haskell
add :: Integer -> Integer -> Integer
add x y = x + y

-- ghci> add 3 4
-- 7
```

AQA describes this two-argument function in two ways:

- `add: integer × integer → integer`: one argument that is a **pair** from the Cartesian product, e.g. `add(3, 4)`.
- `add: integer → integer → integer`: arguments taken **one at a time** (see partial application below).

:::trap
- In Haskell `add 3 4` is **not** "add applied to 3, then 4 is ignored". Application binds tightest and goes left to right: `add 3 4` means `(add 3) 4`.
- `double 3 + 1` is `(double 3) + 1 = 7`, not `double 4`. Use brackets: `double (3 + 1)`.
:::

## Functions as first-class objects

:::definition First-class object
An object that can **appear in expressions**, be **assigned to a variable**, be **passed as an argument** and be **returned from a function call**. In functional programming, **functions are first-class objects**. (Memory aid: **EVAC**: Expressions, Variables, Arguments, Calls.)
:::

A function that takes a function as an argument, or returns one, is a **higher-order function**. `map`, `filter` and `fold` are the ones on the spec ([12.2](#/topic/12.2)).

::::tabs
:::tab Haskell
```haskell
double :: Integer -> Integer
double x = x * 2

-- a function as an ARGUMENT: applyTwice takes a function f
applyTwice :: (Integer -> Integer) -> Integer -> Integer
applyTwice f x = f (f x)

-- a function as a RESULT: makeAdder returns a new function
makeAdder :: Integer -> (Integer -> Integer)
makeAdder n = \x -> x + n

-- ghci> applyTwice double 10
-- 40
-- ghci> (makeAdder 5) 2
-- 7
```
The brackets in `(Integer -> Integer) -> Integer -> Integer` say the **first argument is itself a function**.
:::
:::tab Python
```python
def double(x):
    return x * 2

def apply_twice(f, x):        # function as an argument
    return f(f(x))

def make_adder(n):            # function as a result
    return lambda x: x + n

twice = apply_twice           # function assigned to a name
print(twice(double, 10))      # 40
add5 = make_adder(5)
print(add5(2))                # 7
ops = [double, add5, abs]     # functions stored in a list
print([f(-3) for f in ops])   # [-6, 2, 3]
```
:::
::::

## Partial function application

In Haskell **every function really takes one argument at a time**. A two-argument function is a function that takes one argument and **returns a function** that takes the second.

:::definition AQA notation
`add: integer → integer → integer` is read as `add: integer → (integer → integer)`.
So `add 4` has type `integer → integer`: **a function that adds 4 to its argument**. The arrows associate to the **right**, so the brackets can be dropped.
:::

:::figure Partial application: supplying the first argument returns a new function that is still waiting for the second.
<svg class="diagram" viewBox="0 0 640 170" role="img" aria-label="add takes 4 and returns a new function add 4, which takes 10 and returns 14">
  <defs><marker id="arr122" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="14">
    <text x="30" y="88" text-anchor="middle">4</text>
    <line x1="42" y1="83" x2="98" y2="83" stroke="currentColor" marker-end="url(#arr122)"/>
    <rect x="100" y="45" width="170" height="76" rx="8" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="185" y="75" text-anchor="middle" font-weight="bold">add</text>
    <text x="185" y="100" text-anchor="middle" font-family="monospace" font-size="12">int → (int → int)</text>
    <line x1="270" y1="83" x2="338" y2="83" stroke="currentColor" marker-end="url(#arr122)"/>
    <rect x="340" y="45" width="150" height="76" rx="8" fill="#5fd3a0" fill-opacity="0.3" stroke="currentColor"/>
    <text x="415" y="75" text-anchor="middle" font-weight="bold">add 4</text>
    <text x="415" y="100" text-anchor="middle" font-family="monospace" font-size="12">int → int</text>
    <text x="415" y="30" text-anchor="middle">10</text>
    <line x1="415" y1="35" x2="415" y2="43" stroke="currentColor" marker-end="url(#arr122)"/>
    <line x1="490" y1="83" x2="558" y2="83" stroke="currentColor" marker-end="url(#arr122)"/>
    <text x="590" y="88" text-anchor="middle" font-weight="bold">14</text>
    <text x="320" y="155" text-anchor="middle" font-size="12">add 4 10  =  (add 4) 10  =  14</text>
  </g>
</svg>
:::

### One, two and three arguments

| Function type | Supply | Result type | What you get |
|---|---|---|---|
| `neg: integer → integer` (1 arg) | `neg 5` | `integer` | fully applied: `-5`. A one-argument function cannot be *partially* applied: one argument completes it |
| `add: integer → integer → integer` (2 args) | `add 4` | `integer → integer` | a function that adds 4 |
| | `add 4 10` | `integer` | `14` |
| `vol: integer → integer → integer → integer` (3 args) | `vol 2` | `integer → integer → integer` | a function of two more arguments |
| | `vol 2 3` | `integer → integer` | a function of one more argument |
| | `vol 2 3 4` | `integer` | `24` |

Read `vol: integer → integer → integer → integer` as `vol: integer → (integer → (integer → integer))`. Each argument you supply **removes one type from the front**.

::::tabs
:::tab Haskell
```haskell
add :: Int -> Int -> Int
add x y = x + y

addFour :: Int -> Int
addFour = add 4               -- partial application

vol :: Int -> Int -> Int -> Int
vol l w h = l * w * h

baseTwoByThree :: Int -> Int
baseTwoByThree = vol 2 3      -- 2 of 3 arguments fixed

-- ghci> addFour 10
-- 14
-- ghci> baseTwoByThree 4
-- 24
-- ghci> map (add 1) [1,2,3]
-- [2,3,4]
```
:::
:::tab Python
```python
from functools import partial

def add(x, y):
    return x + y

def vol(l, w, h):
    return l * w * h

add_four = partial(add, 4)          # fixes x = 4
base_2x3 = partial(vol, 2, 3)       # fixes l = 2, w = 3

print(add_four(10))     # 14
print(base_2x3(4))      # 24

# the same idea by hand, with a curried function
def add_curried(x):
    return lambda y: x + y
print(add_curried(4)(10))   # 14
```
:::
::::

:::note Currying
Turning a function that takes a tuple of arguments, `add: integer × integer → integer`, into one that takes them one at a time, `add: integer → integer → integer`, is called **currying** (after the logician Haskell Curry, who also gave Haskell its name). All Haskell functions are curried, which is what makes partial application automatic.
:::

:::trap Partial application returns a function, not a number
The textbook answer "partial application is f = a + b = 3" is **wrong**. Partial application does not calculate part of the expression. It **fixes some of the arguments** and **returns a new function** that waits for the rest.

For `f: integer → integer → integer → integer` with `f a b c = a + b - c`:
- `f 1` is a function `integer → integer → integer` (computing `1 + b - c`).
- `f 1 2` is a function `integer → integer` (computing `3 - c`).
- `f 1 2 3` is the **full application**: `0`.

In an exam, always state the **type of the new function** (e.g. "`f 1 2` has type integer → integer").
:::

## Function composition

:::definition Composition
Given `g: A → B` and `f: B → C`, the composition `f ∘ g: A → C` is defined by
**(f ∘ g)(x) = f(g(x))**.
**g is applied first**, then f is applied to the result. It only works if the **co-domain of g matches the domain of f**.
:::

:::figure (f ∘ g)(x): read right to left. x goes into g first; g's output goes into f.
<svg class="diagram" viewBox="0 0 620 130" role="img" aria-label="x flows into g, then into f, giving f of g of x">
  <defs><marker id="arr123" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="14">
    <text x="30" y="65" text-anchor="middle" font-weight="bold">x</text>
    <line x1="45" y1="60" x2="118" y2="60" stroke="currentColor" marker-end="url(#arr123)"/>
    <rect x="120" y="30" width="120" height="60" rx="8" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="180" y="58" text-anchor="middle" font-weight="bold">g</text><text x="180" y="78" text-anchor="middle" font-size="12">A → B</text>
    <line x1="240" y1="60" x2="338" y2="60" stroke="currentColor" marker-end="url(#arr123)"/><text x="290" y="50" text-anchor="middle" font-size="12">g(x)</text>
    <rect x="340" y="30" width="120" height="60" rx="8" fill="#5fd3a0" fill-opacity="0.3" stroke="currentColor"/><text x="400" y="58" text-anchor="middle" font-weight="bold">f</text><text x="400" y="78" text-anchor="middle" font-size="12">B → C</text>
    <line x1="460" y1="60" x2="528" y2="60" stroke="currentColor" marker-end="url(#arr123)"/>
    <text x="570" y="65" text-anchor="middle" font-weight="bold">f(g(x))</text>
    <text x="290" y="120" text-anchor="middle" font-size="12">f ∘ g : A → C  (the B's must match)</text>
  </g>
</svg>
:::

:::example Composing f(x) = x³ and g(x) = x + 3
**(f ∘ g)(x) = f(g(x))**
1. Apply g first: g(x) = x + 3.
2. Feed that into f: f(x + 3) = **(x + 3)³**.
3. Check with x = 2: g(2) = 5, f(5) = 125. And (2 + 3)³ = 125 ✓

**(g ∘ f)(x) = g(f(x))**
1. Apply f first: f(x) = x³.
2. Feed that into g: g(x³) = **x³ + 3**.
3. Check with x = 2: f(2) = 8, g(8) = 11. And 2³ + 3 = 11 ✓

So **f ∘ g ≠ g ∘ f** in general: composition is **not commutative**.
:::

:::trap The textbook has this backwards
The textbook answer says "f ∘ g becomes g(f(x)) = x³ + 3". **Wrong.** `x³ + 3` is **g ∘ f**. The rule is **(f ∘ g)(x) = f(g(x))**: the function written on the **right** is applied **first**. Read `∘` as "after": f ∘ g is "f after g".
:::

::::tabs
:::tab Haskell
```haskell
f :: Integer -> Integer
f x = x ^ 3

g :: Integer -> Integer
g x = x + 3

h :: Integer -> Integer
h = f . g          -- h x = f (g x)

-- ghci> (f . g) 2
-- 125
-- ghci> (g . f) 2
-- 11
-- ghci> h 2
-- 125
```
In Haskell `∘` is written `.`. The brackets in `(f . g) 2` are needed, because `f . g 2` would mean `f . (g 2)`.
:::
:::tab Python
```python
def f(x):
    return x ** 3

def g(x):
    return x + 3

def compose(outer, inner):
    return lambda x: outer(inner(x))   # (outer ∘ inner)(x)

f_after_g = compose(f, g)    # f ∘ g
g_after_f = compose(g, f)    # g ∘ f
print(f_after_g(2))   # 125
print(g_after_f(2))   # 11
```
:::
::::

### Types must line up

If `isPass: integer → Boolean` and `grade: Boolean → char`, then `grade ∘ isPass: integer → char` is valid: the co-domain of `isPass` (Boolean) is the domain of `grade`. But `isPass ∘ grade` is **not** valid: `grade` outputs a char, and `isPass` needs an integer.

```haskell
isPass :: Integer -> Bool
isPass mark = mark >= 55

grade :: Bool -> Char
grade True  = 'P'
grade False = 'F'

-- ghci> (grade . isPass) 35
-- 'F'
-- ghci> (grade . isPass) 72
-- 'P'
```

{{trace:12.1-1}}

:::exam
- **"State the domain and co-domain of f: integer → Boolean"** (2 marks): domain = integers; co-domain = Boolean (True/False). Don't give the range unless asked.
- **"Explain what is meant by a function being a first-class object"** (2 marks): it can be passed as an argument **and** returned as the result of a function call (also: assigned to a variable, used in expressions).
- **Partial application** questions give a type like `f: integer → integer → integer` and ask for the type of `f 3`: answer `integer → integer`, and say it is a **function**.
- **Composition**: write out `(f ∘ g)(x) = f(g(x))` first, then evaluate the **inner** function. State whether the composition is valid by comparing co-domain of the inner function with the domain of the outer.
- **"Describe two characteristics of functional programming"**: pick from no side effects, immutable data, stateless, recursion instead of iteration, functions as first-class objects, higher-order functions, and explain each in a sentence.
:::

:::challenge
1. `mult: integer → integer → integer → integer`. Write the types of `mult 2`, `mult 2 5` and `mult 2 5 3`, and the value of the last.
2. Given `f(x) = 2x` and `g(x) = x − 1`, find `(f ∘ g)(x)`, `(g ∘ f)(x)` and `(f ∘ f ∘ g)(4)`.
3. Is function composition **associative**? Test whether `(f ∘ g) ∘ h = f ∘ (g ∘ h)` with three functions of your choice.
4. Write a Python function `compose_all(*fs)` that composes any number of functions using `functools.reduce`.
:::

:::recap
- Functional programs are built from **pure functions**: no side effects, immutable data, stateless, recursion instead of loops, declarative.
- `f: A → B`: **A domain**, **B co-domain**; **range ⊆ co-domain** (outputs actually produced).
- Functions are **first-class objects**: arguments, results, assigned to names. Functions that take/return functions are **higher-order**.
- **Function application**: `add 3 4` = `(add 3) 4` = 7.
- **Partial application**: `add: integer → integer → integer`, `add 3: integer → integer`. Returns a **function**, never a partial number.
- **Composition**: `(f ∘ g)(x) = f(g(x))`, **g first**. Haskell `(f . g) x`. Not commutative. Co-domain of g must match domain of f.
:::

:::related
- [12.2 Map, filter and fold](#/topic/12.2)
- [12.3 Lists in functional programming](#/topic/12.3)
- [1.7 Programming paradigms](#/topic/1.7)
- [1.6 Recursion](#/topic/1.6)
- [11.1 Big Data](#/topic/11.1) — why FP suits distributed code
:::

*/});
