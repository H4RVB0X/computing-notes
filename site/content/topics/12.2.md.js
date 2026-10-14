CS.registerTopic({ id: "12.2", title: "Writing functional programs: map, filter and fold" }, function () {/*

:::objectives
- Use **GHCi** to evaluate Haskell expressions and load your own `.hs` files.
- Write simple Haskell functions with **type signatures**, **pattern matching**, **guards**, `if … then … else`, **recursion** and **lambda** expressions.
- Explain what a **higher-order function** is and use **map**, **filter** and **fold** (`foldl`, `foldr`, `foldl1`, `foldr1`) correctly.
- Evaluate fold expressions **step by step**, and explain why `foldl` and `foldr` give different answers for operators like `-`.
- Write equivalent code in Python using `map`, `filter`, `functools.reduce` and list comprehensions.
:::

:::quick At a glance
- A **higher-order function** takes a function as an argument and/or returns a function.
- **map f xs** applies `f` to **every** element: `map (*2) [1,2,3]` → `[2,4,6]`. Same length out as in.
- **filter p xs** keeps the elements for which predicate `p` is `True`: `filter even [1..6]` → `[2,4,6]`.
- **fold** (reduce) combines a list into **one value** using a function and a starting value: `foldl (+) 0 [1,2,3]` → `6`.
- **foldl** works from the **left**: `((10 - 1) - 2) - 3` = 4. **foldr** works from the **right**: `1 - (2 - (3 - 10))` = −8.
- `foldl1` / `foldr1` use the first/last element as the starting value (error on an empty list).
- Haskell function call: `f x y` (no brackets or commas). Type signature: `f :: Int -> Int -> Int`.
- Python: `list(map(f, xs))`, `list(filter(p, xs))`, `functools.reduce(f, xs, start)` (a **left** fold), or list comprehensions.
:::

:::keyterms
Higher-order function :: A function that takes a function as an argument or returns a function as a result, or both. :: A function that works on other functions.
map :: A higher-order function that applies a given function to each element of a list, returning a list of the results. :: Do the same thing to every item.
filter :: A higher-order function that returns a list of the elements of a list that satisfy a given predicate (condition). :: Keep only the items that pass the test.
fold (reduce) :: A higher-order function that reduces a list to a single value by repeatedly applying a combining function to an accumulator and each element, starting from an initial value. :: Squash a list down to one answer.
Predicate :: A function that returns a Boolean value; used by filter to decide which elements to keep. :: A yes/no test.
Accumulator :: The value carried through a fold, holding the result so far. :: The running total.
Lambda expression :: An anonymous (unnamed) function written inline, e.g. \x -> x * 2 in Haskell. :: A throwaway function with no name.
Guard :: A Boolean condition in a Haskell function definition, written after |, that selects which expression gives the result. :: Haskell's tidy version of IF/ELSE IF.
Pattern matching :: Defining a function by several equations, each matching a different form of argument, checked from top to bottom. :: Different rules for different shaped inputs.
GHCi :: The interactive interpreter for the Glasgow Haskell Compiler, used to evaluate expressions and load source files. :: The Haskell prompt you type into.
:::

## Getting started with Haskell (GHCi)

Haskell is the functional language AQA uses for examples. You can type expressions straight into **GHCi**, or write functions in a file such as `funcs.hs` and load it.

| Command | Short | What it does |
|---|---|---|
| `ghci` | | start the interpreter (prompt `ghci>`) |
| `:load funcs.hs` | `:l` | load your file |
| `:reload` | `:r` | reload after editing the file |
| `:type expr` | `:t` | show the type of an expression |
| `:quit` | `:q` | leave GHCi |

```haskell GHCi session
ghci> 4 ^ 7
16384
ghci> [1..8]
[1,2,3,4,5,6,7,8]
ghci> :t not
not :: Bool -> Bool
ghci> :t map
map :: (a -> b) -> [a] -> [b]
```

:::note
The Isaac page in your notes gives `4 ^ 7` as `16328`. The correct value is 4<sup>7</sup> = **16384**.
:::

## Defining functions

### Type signature then equations

```haskell funcs.hs
-- type signature: name :: argument types -> result type
square :: Integer -> Integer
square x = x * x

-- two arguments: the LAST type is the result
power :: Integer -> Integer -> Integer
power x y = x ^ y

-- if ... then ... else (the else is compulsory)
isMagic :: Integer -> Bool
isMagic x = if x == 3 then True else False
```

```haskell
ghci> :l funcs.hs
ghci> square 7
49
ghci> power 2 10
1024
ghci> isMagic 6
False
```

Rules worth knowing:

- Function and value names start with a **lower-case** letter; types (`Integer`, `Int`, `Bool`, `Char`, `String`, `Float`, `Double`) start with **upper case**.
- Arguments are separated by **spaces**, not commas: `power 2 10`, not `power(2, 10)`.
- `--` starts a comment.
- A name can only be defined **once**: values are immutable.

### Guards

Guards are Haskell's version of `IF … ELSE IF … ELSE`. They are checked **top to bottom**; `otherwise` catches everything else.

```haskell
grade :: Int -> Char
grade mark
  | mark >= 70 = 'A'
  | mark >= 50 = 'B'
  | mark >= 40 = 'C'
  | otherwise  = 'U'
```

`grade 55` → the first guard is False, the second (`55 >= 50`) is True, so the result is `'B'`.

### `where` for local definitions

```haskell
bmiCategory :: Double -> Double -> String
bmiCategory weight height
  | bmi < 18.5 = "Underweight"
  | bmi < 25   = "Healthy"
  | otherwise  = "Overweight"
  where bmi = weight / height ^ 2
```

### Pattern matching

A function can be defined by several equations, one per pattern. The first pattern that matches is used, and `_` matches anything.

```haskell
describe :: Char -> String
describe 'a' = "Apple"
describe 'b' = "Boat"
describe _   = "Something else"
```

### Recursion instead of loops

There are no loops in Haskell (a loop needs a counter that changes). Repetition uses **recursion**: a **base case** that stops, and a **general case** that calls the function on a smaller problem.

```haskell
factorial :: Integer -> Integer
factorial 0 = 1                        -- base case
factorial n = n * factorial (n - 1)    -- general case
```

:::example Evaluating factorial 4
```text
factorial 4
= 4 * factorial 3
= 4 * (3 * factorial 2)
= 4 * (3 * (2 * factorial 1))
= 4 * (3 * (2 * (1 * factorial 0)))
= 4 * (3 * (2 * (1 * 1)))         -- base case reached
= 4 * (3 * (2 * 1))
= 4 * (3 * 2)
= 4 * 6
= 24
```
:::

### Lambdas and operator sections

A **lambda** is an unnamed function: `\x -> x * x` means "the function that takes x and returns x × x". The backslash stands in for the Greek letter λ.

A **section** is an operator with one side filled in, which gives a one-argument function:

| Section | Means | Example |
|---|---|---|
| `(*2)` | `\x -> x * 2` | `(*2) 5` → `10` |
| `(+1)` | `\x -> x + 1` | |
| `(>5)` | `\x -> x > 5` | a predicate for filter |
| `(2^)` | `\x -> 2 ^ x` | `(2^) 3` → `8` |
| `(^2)` | `\x -> x ^ 2` | `(^2) 3` → `9` |
| `(subtract 1)` | `\x -> x - 1` | `(subtract 1) 5` → `4` |

:::trap
- `(-1)` is the **number** minus one, not "subtract one". Use `(subtract 1)` or `\x -> x - 1`.
- The slides write `FILTER >5 C`. In real Haskell the operator section needs brackets and list names must be lower case: `filter (>5) c`.
- Haskell `if` must have an `else`. There is no "if without else" because every expression has to produce a value.
:::

## Higher-order functions: map, filter and fold

The specification requires you to **use** map, filter and reduce/fold. All three take a **function as an argument**, which is exactly what makes them higher-order.

### map

```haskell
map :: (a -> b) -> [a] -> [b]
```

**map** applies a function to **every element** of a list and returns the list of results. Output length = input length.

```haskell
ghci> map (*2) [1,2,3,4]
[2,4,6,8]
ghci> map (\x -> x * x) [1,2,3]
[1,4,9]
ghci> map even [1,2,3]
[False,True,False]
ghci> map (`div` 2) [10,7,4]
[5,3,2]
```

How it evaluates: `map (*2) [1,2,3]` = `[(*2) 1, (*2) 2, (*2) 3]` = `[2,4,6]`.

### filter

```haskell
filter :: (a -> Bool) -> [a] -> [a]
```

**filter** takes a **predicate** (a function returning `Bool`) and keeps only the elements for which it returns `True`. Order is kept; the list can only get shorter (or stay the same).

```haskell
ghci> filter even [1..10]
[2,4,6,8,10]
ghci> filter (>5) [1,9,3,7,5]
[9,7]
ghci> filter (\x -> x `mod` 3 == 0) [1..10]
[3,6,9]
ghci> filter (/= ' ') "a b c"
"abc"
```

### fold (reduce)

A **fold** reduces a list to a **single value**. It needs three things: a **combining function** of two arguments, a **starting value** for the accumulator, and the **list**.

```haskell
foldl :: (b -> a -> b) -> b -> [a] -> b    -- acc on the LEFT of f
foldr :: (a -> b -> b) -> b -> [a] -> b    -- acc on the RIGHT of f
```

(In current GHC the types say `Foldable t => … t a` instead of `[a]`; for lists they mean exactly the above.)

| Fold | Brackets | `foldl (+) 0 [1,2,3]` |
|---|---|---|
| **foldl** | from the **left**: `((start ⊕ x1) ⊕ x2) ⊕ x3` | `((0+1)+2)+3 = 6` |
| **foldr** | from the **right**: `x1 ⊕ (x2 ⊕ (x3 ⊕ start))` | `1+(2+(3+0)) = 6` |

For `+` and `*` both give the same answer (they are associative and commutative). For `-`, `/` or `^` they **differ**.

:::example foldl (-) 10 [1,2,3]: every step
foldl takes the accumulator and the **next item from the left**, applies `acc - x`, and carries on.

| Step | acc | x | acc − x |
|---|---|---|---|
| 1 | 10 | 1 | 9 |
| 2 | 9 | 2 | 7 |
| 3 | 7 | 3 | **4** |

```text
foldl (-) 10 [1,2,3]
= foldl (-) (10 - 1) [2,3]
= foldl (-) 9 [2,3]
= foldl (-) (9 - 2) [3]
= foldl (-) 7 [3]
= foldl (-) (7 - 3) []
= 4                        -- empty list: return the accumulator
```
So `foldl (-) 10 [1,2,3]` = `((10 - 1) - 2) - 3` = **4**.
:::

:::example foldr (-) 10 [1,2,3]: every step
foldr puts the starting value at the **right-hand end** and works back towards the front, computing `x - acc`.

```text
foldr (-) 10 [1,2,3]
= 1 - foldr (-) 10 [2,3]
= 1 - (2 - foldr (-) 10 [3])
= 1 - (2 - (3 - foldr (-) 10 []))
= 1 - (2 - (3 - 10))       -- empty list: use the start value
= 1 - (2 - (-7))
= 1 - 9
= -8
```

| Step (innermost first) | x | acc | x − acc |
|---|---|---|---|
| 1 | 3 | 10 | −7 |
| 2 | 2 | −7 | 9 |
| 3 | 1 | 9 | **−8** |
:::

{{trace:12.2-1}}

{{trace:12.2-2}}

### foldl1 and foldr1

These use the **first** (foldl1) or **last** (foldr1) element as the starting value, so there is no separate start argument. They crash on an empty list.

```haskell
ghci> foldl1 (-) [10,2,3]      -- (10 - 2) - 3
5
ghci> foldr1 (-) [10,2,3]      -- 10 - (2 - 3)
11
ghci> foldr1 max [3,9,2,7]
9
ghci> foldl1 (+) []
*** Exception: Prelude.foldl1: empty list
```

(The exact wording of the exception message varies between GHC versions.)

:::trap Folds
- **Learn the bracket shapes**: foldl = `((s ⊕ a) ⊕ b) ⊕ c`; foldr = `a ⊕ (b ⊕ (c ⊕ s))`. For `-` they give different answers.
- **Don't forget the starting value**: `foldl (+) 0 xs`, not `foldl (+) xs`. The textbook answer `fold (+) [2,4,6,8,10]` is not valid Haskell; use `foldl (+) 0 [2,4,6,8,10]` or `foldr1 (+) [2,4,6,8,10]`.
- **The textbook trace of that fold is wrong**: it goes 2, 6, 14, 24, skipping the 6. The correct running totals are 2, 6, 12, 20, **30**.
- In `foldl` the combining function takes **(acc, item)**; in `foldr` it takes **(item, acc)**. This matters for lambdas: `foldl (\acc x -> acc + x*x) 0 [1,2,3]` = 14.
:::

## Combining higher-order functions

Real programs chain these together. Read from the **inside out** (right to left).

:::example Sum of the squares of the odd numbers from 1 to 10
```haskell
ghci> sum (map (^2) (filter odd [1..10]))
165
```
1. `filter odd [1..10]` → `[1,3,5,7,9]`
2. `map (^2) [1,3,5,7,9]` → `[1,9,25,49,81]`
3. `sum [1,9,25,49,81]` → `165` (`sum` is itself a fold: `foldl (+) 0`)
:::

{{trace:12.2-3}}

The same pipeline using composition (see [12.1](#/topic/12.1)):

```haskell
sumOddSquares :: [Integer] -> Integer
sumOddSquares = sum . map (^2) . filter odd
```

### Python equivalents

Python is not a pure functional language, but it has all three higher-order functions.

::::tabs
:::tab Haskell
```haskell
marks :: [Int]
marks = [45, 72, 58, 91, 33]

passed  = filter (>= 50) marks        -- [72,58,91]
boosted = map (+5) marks              -- [50,77,63,96,38]
total   = foldl (+) 0 marks           -- 299
highest = foldr1 max marks            -- 91
```
:::
:::tab Python (map / filter / reduce)
```python
from functools import reduce

marks = [45, 72, 58, 91, 33]

passed = list(filter(lambda m: m >= 50, marks))
boosted = list(map(lambda m: m + 5, marks))
total = reduce(lambda acc, m: acc + m, marks, 0)   # a LEFT fold
highest = reduce(max, marks)                       # like foldl1

print(passed)    # [72, 58, 91]
print(boosted)   # [50, 77, 63, 96, 38]
print(total)     # 299
print(highest)   # 91

# folds with subtraction
print(reduce(lambda acc, x: acc - x, [1, 2, 3], 10))            # foldl: 4
print(reduce(lambda acc, x: x - acc, reversed([1, 2, 3]), 10))  # foldr: -8
```
:::
:::tab Python (comprehensions)
```python
marks = [45, 72, 58, 91, 33]

passed = [m for m in marks if m >= 50]        # filter
boosted = [m + 5 for m in marks]              # map
print(passed, boosted)  # [72, 58, 91] [50, 77, 63, 96, 38]

# sum (map (^2) (filter odd [1..10]))
print(sum([x ** 2 for x in range(1, 11) if x % 2 == 1]))   # 165
```
:::
::::

:::trap Python gotchas
- `map` and `filter` return **iterators** in Python 3, not lists. Wrap them in `list(...)` to see the values.
- `functools.reduce(f, xs, start)` is a **left** fold, and `f` takes `(acc, item)`. There is no built-in `foldr`.
- `reduce` with no start value on an empty list raises a `TypeError`, just as `foldl1` fails in Haskell.
:::

### How map, filter and fold are defined

They are ordinary recursive functions. Seeing the definitions shows exactly how they evaluate (names changed so they don't clash with the built-ins).

```haskell
myMap :: (a -> b) -> [a] -> [b]
myMap _ []     = []
myMap f (x:xs) = f x : myMap f xs

myFilter :: (a -> Bool) -> [a] -> [a]
myFilter _ [] = []
myFilter p (x:xs)
  | p x       = x : myFilter p xs
  | otherwise = myFilter p xs

myFoldl :: (b -> a -> b) -> b -> [a] -> b
myFoldl _ acc []     = acc
myFoldl f acc (x:xs) = myFoldl f (f acc x) xs

myFoldr :: (a -> b -> b) -> b -> [a] -> b
myFoldr _ acc []     = acc
myFoldr f acc (x:xs) = f x (myFoldr f acc xs)
```

`(x:xs)` splits a list into its **head** `x` and **tail** `xs`; see [12.3](#/topic/12.3).

### Try it

{{tool:haskell-list-lab}}

:::exam
- **"Write a Haskell expression"** questions: use correct syntax: `map (*3) xs`, `filter (>10) xs`, `foldl (+) 0 xs`. Brackets round sections; a start value for `foldl`/`foldr`.
- **"State the output of …"**: work inside-out and show intermediate lists; method marks are often available.
- **"Explain what is meant by a higher-order function"** (1–2 marks): a function that takes a function as an argument **or** returns a function as a result. Give map/filter/fold as examples.
- **Describe map / filter / fold** (1 mark each): map applies a function to every element, returning a new list; filter returns the elements that satisfy a condition/predicate; fold reduces a list to a single value by recursively applying a function, starting from an initial value.
- Folds with `-`: write the full bracketed expression before calculating.
:::

:::challenge
1. Evaluate by hand: `foldl (\acc x -> acc * 10 + x) 0 [1,2,3]`. What does this fold do in general?
2. Write `countIf :: (a -> Bool) -> [a] -> Int` using `filter` and `length`, then again using only `foldr`.
3. Show that `foldr (:) [] xs` returns `xs` unchanged, but `foldl (\acc x -> x : acc) [] xs` reverses it.
4. Write a Haskell function using guards that returns `"Fizz"`, `"Buzz"`, `"FizzBuzz"` or the number as a string (use `show`), then `map` it over `[1..15]`.
:::

:::recap
- Haskell: `name :: Type -> Type`, then equations; arguments separated by spaces; guards with `|` and `otherwise`; `where` for local names; recursion instead of loops; `\x -> …` lambdas.
- **map f xs**: apply f to every element (same length).
- **filter p xs**: keep elements where p is True.
- **foldl f s xs**: `((s ⊕ x1) ⊕ x2) …`; **foldr f s xs**: `x1 ⊕ (x2 ⊕ (… ⊕ s))`. Same for `+`/`*`, different for `-`.
- `foldl (-) 10 [1,2,3]` = 4; `foldr (-) 10 [1,2,3]` = −8.
- `foldl1` / `foldr1` use an end element as the start value; empty list = error.
- Python: `list(map(...))`, `list(filter(...))`, `functools.reduce` (left fold), comprehensions.
:::

:::related
- [12.1 The functional programming paradigm](#/topic/12.1)
- [12.3 Lists in functional programming](#/topic/12.3)
- [1.6 Recursion](#/topic/1.6)
- [11.1 Big Data](#/topic/11.1) — map and reduce at scale
:::

*/});
