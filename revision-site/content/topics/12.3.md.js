CS.registerTopic({ id: "12.3", title: "Lists in functional programming" }, function () {/*

:::objectives
- Describe a list as a **head** (an element) joined to a **tail** (a list), and recognise the **empty list** `[]`.
- Apply the AQA list operations: **return head**, **return tail**, **test for empty**, **return length**, **construct an empty list**, **prepend** an item and **append** an item, in Haskell and Python.
- Explain the difference between **prepend** (`:`) and **append** (`++`), including their types.
- Use **pattern matching** on `[]` and `(x:xs)` to write **recursive** list functions (sum, length, reverse, map) and trace them call by call.
- Explain why lists are **immutable** in functional programming and what that means for "adding" to a list.
:::

:::quick At a glance
- A list is either **empty** `[]` or a **head** (first element) followed by a **tail** (the rest, which is itself a list).
- `[1,2,3]` is shorthand for `1 : (2 : (3 : []))`. The tail of a one-item list is `[]`.
- `head [4,5,6]` → `4` (an **element**). `tail [4,5,6]` → `[5,6]` (a **list**).
- `null xs` tests for empty; `length xs` counts elements; `[]` constructs an empty list.
- **Prepend**: `x : xs` puts one **item** on the front. **Append**: `xs ++ [x]` joins two **lists**, so a single item must go in brackets.
- Lists are **immutable**: these operations return **new** lists; the original is unchanged.
- Recursive list functions match `[]` (base case) and `(x:xs)` (general case: do something with `x`, recurse on `xs`).
- Lists in Haskell must hold items of the **same type**. A `String` is a list of `Char`.
:::

:::keyterms
List :: A data structure that is either empty or consists of a head and a tail, where the head is an element and the tail is a list. :: A chain: first item plus the rest.
Head :: The first element of a non-empty list. :: The front item.
Tail :: The list containing every element except the head; the tail of a one-element list is the empty list. :: Everything after the first item (still a list).
Empty list :: A list containing no elements, written []. :: Nothing in it.
Prepend :: Add an item to the front of a list, giving a new list whose head is that item; in Haskell the : operator. :: Stick one on the front.
Append :: Join one list onto the end of another, giving a new list; in Haskell the ++ operator. :: Stick a list on the back.
Cons (:) :: The operator that constructs a list from a head element and a tail list. :: The glue between head and tail.
Pattern matching :: Selecting which equation of a function to use by matching the argument's form, e.g. [] or (x:xs). :: Different rules for empty and non-empty lists.
Recursion :: A function defined in terms of itself, with a base case that stops the recursion. :: Solve the small version, repeat.
Immutable :: Cannot be changed once created; operations return new values. :: Never edited, only copied.
:::

## A list is a head and a tail

In functional programming a list is defined **recursively**:

> A list is either the **empty list** `[]`, or a **head** (one element) attached to a **tail** (which is another list).

So `[3,6,12]` really means `3 : [6,12]`, which means `3 : (6 : [12])`, which means `3 : (6 : (12 : []))`. Every list ends in `[]`.

:::figure The list [3,6,12]: each cell holds a head and a pointer to its tail. The last tail is the empty list.
<svg class="diagram" viewBox="0 0 640 190" role="img" aria-label="Three linked cells holding 3, 6 and 12, ending in the empty list, with the head and tail labelled">
  <defs><marker id="arr131" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="14">
    <rect x="40" y="70" width="60" height="44" fill="#7c9aff" fill-opacity="0.4" stroke="currentColor"/><text x="70" y="97" text-anchor="middle" font-weight="bold">3</text>
    <rect x="100" y="70" width="40" height="44" fill="none" stroke="currentColor"/><circle cx="120" cy="92" r="4" fill="currentColor"/>
    <line x1="124" y1="92" x2="198" y2="92" stroke="currentColor" marker-end="url(#arr131)"/>
    <rect x="200" y="70" width="60" height="44" fill="#5fd3a0" fill-opacity="0.3" stroke="currentColor"/><text x="230" y="97" text-anchor="middle">6</text>
    <rect x="260" y="70" width="40" height="44" fill="none" stroke="currentColor"/><circle cx="280" cy="92" r="4" fill="currentColor"/>
    <line x1="284" y1="92" x2="358" y2="92" stroke="currentColor" marker-end="url(#arr131)"/>
    <rect x="360" y="70" width="60" height="44" fill="#5fd3a0" fill-opacity="0.3" stroke="currentColor"/><text x="390" y="97" text-anchor="middle">12</text>
    <rect x="420" y="70" width="40" height="44" fill="none" stroke="currentColor"/><circle cx="440" cy="92" r="4" fill="currentColor"/>
    <line x1="444" y1="92" x2="518" y2="92" stroke="currentColor" marker-end="url(#arr131)"/>
    <rect x="520" y="70" width="60" height="44" rx="10" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="550" y="97" text-anchor="middle" font-family="monospace">[]</text>
    <path d="M40,60 L40,50 L140,50 L140,60" fill="none" stroke="currentColor"/><text x="90" y="40" text-anchor="middle">head = 3</text>
    <path d="M200,126 L200,136 L580,136 L580,126" fill="none" stroke="currentColor"/><text x="390" y="156" text-anchor="middle">tail = [6,12]  (a list)</text>
    <text x="320" y="182" text-anchor="middle" font-size="12" font-family="monospace">[3,6,12] = 3 : (6 : (12 : []))</text>
  </g>
</svg>
:::

:::trap Head is an element; tail is a list
- `head [3,6,12]` is `3`, **not** `[3]`.
- `tail [3,6,12]` is `[6,12]`, **not** `12`. The tail is everything except the head, and it is always a **list**.
- `tail [12]` is `[]` (an empty list), not an error.
- `head []` and `tail []` **are** errors: an empty list has no head.
:::

Haskell lists are **homogeneous**: every element has the same type. `[1, 2, 3]` is `[Integer]`; `["cat", "dog"]` is `[String]`; `[1, "cat"]` is a type error. A `String` is just `[Char]`, so `"cat"` is `['c','a','t']` and all list operations work on strings.

## The AQA list operations

The specification lists seven operations you must be able to describe and apply.

| Operation | Haskell | Example | Result | Python equivalent |
|---|---|---|---|---|
| Return head of list | `head xs` | `head [4,5,6]` | `4` | `xs[0]` |
| Return tail of list | `tail xs` | `tail [4,5,6]` | `[5,6]` | `xs[1:]` |
| Test for empty list | `null xs` | `null []` | `True` | `len(xs) == 0` or `not xs` |
| Return length of list | `length xs` | `length [4,5,6]` | `3` | `len(xs)` |
| Construct an empty list | `[]` | `xs = []` | `[]` | `[]` |
| Prepend an item | `x : xs` | `3 : [4,5,6]` | `[3,4,5,6]` | `[x] + xs` |
| Append an item | `xs ++ [x]` | `[4,5,6] ++ [7]` | `[4,5,6,7]` | `xs + [x]` |

```haskell GHCi session
ghci> xs = [20, 3, 51, 6]
ghci> head xs
20
ghci> tail xs
[3,51,6]
ghci> null xs
False
ghci> null []
True
ghci> length xs
4
ghci> 5 : xs
[5,20,3,51,6]
ghci> xs ++ [99]
[20,3,51,6,99]
ghci> xs
[20,3,51,6]
```

The last line shows **immutability**: after prepending and appending, `xs` is unchanged. Each operation built a **new** list.

```python Python equivalents
xs = [20, 3, 51, 6]
print(xs[0])          # head    -> 20
print(xs[1:])         # tail    -> [3, 51, 6]
print(len(xs) == 0)   # null    -> False
print(len(xs))        # length  -> 4
empty = []            # construct an empty list
print([5] + xs)       # prepend -> [5, 20, 3, 51, 6]
print(xs + [99])      # append  -> [20, 3, 51, 6, 99]
print(xs)             # unchanged: [20, 3, 51, 6]
```

### Prepend versus append

| | Prepend `:` | Append `++` |
|---|---|---|
| Left side | one **element** | a **list** |
| Right side | a **list** | a **list** |
| Type | `a -> [a] -> [a]` | `[a] -> [a] -> [a]` |
| Example | `1 : [2,3]` → `[1,2,3]` | `[1,2] ++ [3]` → `[1,2,3]` |
| Cost | instant: one new cell pointing at the old list | must copy the whole left-hand list |

```haskell
ghci> 1 : 2 : [3,4]          -- : groups to the right: 1 : (2 : [3,4])
[1,2,3,4]
ghci> "c" : ["a", "t"]       -- a String onto a list of Strings
["c","a","t"]
ghci> 'c' : "at"             -- a Char onto a String
"cat"
ghci> [1,3] ++ [5,7] ++ [9]
[1,3,5,7,9]
```

:::trap Type errors with : and ++
- `[1,2] ++ 3` is a **type error**: `++` needs a list on both sides. Write `[1,2] ++ [3]`. (Your Isaac notes show `my_list ++ 99` giving a result; that line would not compile.)
- `[1,2] : 3` is a type error: `:` needs the element on the **left**.
- `['c','a'] ++ 't'` fails because `'t'` is a `Char`, not a `[Char]`. Use `"t"` or `['t']`.
- The slides write prepend as `[10] ++ C`. That works (it appends two lists), but the dedicated prepend operator is `:`, as in `10 : c`. Haskell list names must also start with a lower-case letter.
:::

### Getting at items deeper in the list

Combine `head` and `tail`, working from the **inside out**:

```text
head (tail (tail [20,3,51,6]))
= head (tail [3,51,6])
= head [51,6]
= 51
```

## Pattern matching on lists

Instead of calling `head` and `tail`, Haskell functions usually **pattern match**. A list argument matches one of:

- `[]`: the empty list (the **base case**).
- `(x:xs)`: a non-empty list; `x` is bound to the **head** and `xs` to the **tail**. Read `xs` as "the rest of the x's". The brackets are compulsory.
- `[x]`: a list with exactly one element (sometimes useful).

Equations are tried **top to bottom**, and the first match is used.

## Recursive list functions, line by line

There are no loops in functional programming, so processing every element means **recursion**: handle the head, recurse on the tail, stop at `[]`.

### Length

```haskell
myLength :: [a] -> Int
myLength []     = 0                  -- base case: empty list has length 0
myLength (x:xs) = 1 + myLength xs    -- count the head, then the tail
```

- Line 1: takes a list of **any** type `a`, returns an `Int`.
- Line 2: the base case; an empty list has length 0.
- Line 3: a non-empty list is 1 (for the head) plus the length of the tail.

:::example myLength [3,6,12]
| Call | Argument | Pattern matched | Returns |
|---|---|---|---|
| 1 | `[3,6,12]` | `(x:xs)`, x = 3 | `1 + myLength [6,12]` = 1 + 2 = **3** |
| 2 | `[6,12]` | `(x:xs)`, x = 6 | `1 + myLength [12]` = 1 + 1 = 2 |
| 3 | `[12]` | `(x:xs)`, x = 12 | `1 + myLength []` = 1 + 0 = 1 |
| 4 | `[]` | `[]` (base case) | 0 |

Calls go **down** the table; the return values are worked out coming back **up**, as each stack frame is popped.
:::

{{trace:12.3-1}}

### Sum

```haskell
mySum :: [Integer] -> Integer
mySum []     = 0
mySum (x:xs) = x + mySum xs
```

```text
mySum [2,4,6]
= 2 + mySum [4,6]
= 2 + (4 + mySum [6])
= 2 + (4 + (6 + mySum []))
= 2 + (4 + (6 + 0))
= 12
```

### Reverse

```haskell
myReverse :: [a] -> [a]
myReverse []     = []
myReverse (x:xs) = myReverse xs ++ [x]   -- reverse the tail, put the head at the end
```

Note `[x]`: the head is an **element**, so it must be wrapped in a list before `++`.

```text
myReverse [1,2,3]
= myReverse [2,3] ++ [1]
= (myReverse [3] ++ [2]) ++ [1]
= ((myReverse [] ++ [3]) ++ [2]) ++ [1]
= (([] ++ [3]) ++ [2]) ++ [1]
= ([3] ++ [2]) ++ [1]
= [3,2] ++ [1]
= [3,2,1]
```

{{trace:12.3-2}}

### Map, written yourself

```haskell
myMap :: (a -> b) -> [a] -> [b]
myMap _ []     = []
myMap f (x:xs) = f x : myMap f xs        -- apply f to the head, prepend to the mapped tail
```

```text
myMap (*2) [1,2,3]
= 2 : myMap (*2) [2,3]
= 2 : (4 : myMap (*2) [3])
= 2 : (4 : (6 : myMap (*2) []))
= 2 : (4 : (6 : []))
= [2,4,6]
```

### Append an item to the end, recursively

```haskell
addToEnd :: a -> [a] -> [a]
addToEnd y []     = [y]
addToEnd y (x:xs) = x : addToEnd y xs
```

`addToEnd 5 [1,2]` = `1 : addToEnd 5 [2]` = `1 : (2 : addToEnd 5 [])` = `1 : (2 : [5])` = `[1,2,5]`. It has to walk the **whole list** to reach the end, which is why adding to the front is cheaper.

### The same functions in Python

```python Recursive list functions in a functional style
def my_length(xs):
    if not xs:                      # [] : base case
        return 0
    return 1 + my_length(xs[1:])    # (x:xs)

def my_sum(xs):
    if not xs:
        return 0
    return xs[0] + my_sum(xs[1:])

def my_reverse(xs):
    if not xs:
        return []
    return my_reverse(xs[1:]) + [xs[0]]

def my_map(f, xs):
    if not xs:
        return []
    return [f(xs[0])] + my_map(f, xs[1:])

print(my_length([3, 6, 12]))              # 3
print(my_sum([2, 4, 6]))                  # 12
print(my_reverse([1, 2, 3]))              # [3, 2, 1]
print(my_map(lambda x: x * 2, [1, 2, 3])) # [2, 4, 6]
```

:::trap Recursion on lists
- **Always write the `[]` case.** Without it the function crashes when it reaches the end ("Non-exhaustive patterns").
- **Put the base case first**, or at least make sure patterns can't overlap in the wrong order.
- `(x:xs)` needs **brackets**: `myLength x:xs = …` is a syntax error.
- In `myReverse`, `myReverse xs ++ x` is a type error: `x` is an element, so write `[x]`.
- The Isaac note says `reverse_list` "returns an integer". It returns a **list**: its type is `[a] -> [a]`.
:::

### Try it

{{tool:haskell-list-lab}}

:::exam
- **"Describe how a list is represented in functional programming"** (2 marks): a list is a **head** (an element) followed by a **tail** (a list); a list may be **empty** `[]`.
- **"State the result of …"** questions on `head`, `tail`, `null`, `length`, `:` and `++`: watch whether the answer is an **element** or a **list** and use square brackets accordingly.
- **Writing a recursive list function**: type signature (1), base case for `[]` (1), general case with `(x:xs)` (1), correct recursive call on `xs` (1).
- **Tracing**: show each call with its argument and what it returns, as in the tables above.
:::

:::challenge
1. Write `myLast :: [a] -> a` that returns the last element of a non-empty list, using the patterns `[x]` and `(x:xs)`.
2. Write `count :: Eq a => a -> [a] -> Int` that counts how many times an item appears in a list.
3. `myReverse` uses `++`, which copies the left list each time. Write a faster version using a helper with an accumulator: `rev acc [] = acc`, `rev acc (x:xs) = …`.
4. What does `head (tail "Haskell") : tail (tail "ab")` evaluate to? Check the types carefully.
:::

:::recap
- A list is `[]` or **head : tail**; head = element, tail = list. `[1,2,3]` = `1 : (2 : (3 : []))`.
- `head`, `tail`, `null`, `length`, `[]`, prepend `x : xs`, append `xs ++ [x]`.
- `:` puts an **element** on the front; `++` joins two **lists**.
- Lists are **immutable**: operations return new lists. Lists are **homogeneous**; a String is a list of Char.
- `head []` and `tail []` are errors; `tail [x]` is `[]`.
- Recursive functions: base case `[]`, general case `(x:xs)` recursing on `xs`. Trace calls down, returns up.
:::

:::related
- [12.2 Map, filter and fold](#/topic/12.2)
- [12.1 The functional programming paradigm](#/topic/12.1)
- [1.6 Stack frames and recursion](#/topic/1.6)
- [2.1 Data structures, arrays and lists](#/topic/2.1)
:::

*/});
