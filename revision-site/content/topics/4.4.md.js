CS.registerTopic({ id: "4.4", title: "Regular expressions and regular languages" }, function () {/*

:::objectives
- Explain that a **regular expression** is a way of **describing a set** of strings, written in a compact shorthand.
- Use the metacharacters `*`, `+`, `?`, `|`, `( )` and `[ ]` to **form** and **interpret** regular expressions, with correct precedence.
- Use regular expressions for **string matching and manipulation** (searching, validating, replacing) in Python.
- Describe the **relationship between regular expressions and FSMs**: write a regular expression for a given FSM and draw an FSM for a given regular expression.
- Define a **regular language** and give an example of a language that is not regular.
:::

:::quick At a glance
- A **regular expression** describes a **set of strings** (a language). The string "matches" if it is in that set.
- `a*` = **zero or more** a's. `a+` = **one or more**. `a?` = **zero or one** (optional). `a|b` = a **or** b. `( )` groups. `[abc]` = any one of a, b, c; `[a-z]` = any lower-case letter.
- Operators apply to the **single character or bracketed group just before them**: `ab*` = a then any number of b's; `(ab)*` = any number of "ab"s.
- Precedence: `*` `+` `?` bind tightest, then joining symbols together (concatenation), then `|` (loosest). `a|bc` = `a|(bc)`.
- A language is **regular** if it can be **represented by a regular expression**, equivalently if an **FSM** can recognise it.
- Every regular expression has an equivalent FSM and every FSM has an equivalent regular expression.
- Not every language is regular: {0ⁿ1ⁿ | n ≥ 1} and balanced brackets need **counting**, which neither a regex nor an FSM can do.
:::

:::keyterms
Regular expression :: A notation that describes a set of strings (a language) using characters and metacharacters such as *, +, ?, | and brackets. :: A pattern that defines which strings are allowed.
Metacharacter :: A character with a special meaning in a regular expression, such as *, +, ?, |, ( ) or [ ]. :: The symbols that aren't matched literally.
Kleene star (*) :: Zero or more repetitions of the preceding character or group. :: As many as you like, including none.
Plus (+) :: One or more repetitions of the preceding character or group. :: At least one.
Question mark (?) :: Zero or one occurrence of the preceding character or group. :: Optional.
Alternation (|) :: Matches either the expression on its left or the expression on its right. :: Or.
Character class [ ] :: Matches any one character from the set listed inside the brackets, e.g. [abc] or [0-9]. :: One character from this list.
Regular language :: A language that can be represented by a regular expression; equivalently, one that can be recognised by a finite state machine. :: A pattern an FSM can check.
Language :: A set of strings over a given alphabet. :: All the strings that count as valid.
Empty string (ε) :: The string containing no characters. :: "" (nothing at all).
:::

## A regular expression describes a set

The AQA spec says a regular expression is **"simply a way of describing a set"**. The expression `ab*` describes the set {a, ab, abb, abbb, …}. A string **matches** the expression if it is **in** that set.

Because many interesting sets are **infinite**, listing them is impossible. A regex is a finite shorthand for an infinite set, just like set comprehension in [4.3](#/topic/4.3).

## The metacharacters

| Metacharacter | Meaning | Example | Matches | Doesn't match |
|---|---|---|---|---|
| `*` | zero or more of the preceding item | `ab*c` | ac, abc, abbc | abd |
| `+` | one or more of the preceding item | `ab+c` | abc, abbbc | ac |
| `?` | zero or one of the preceding item | `ab?c` | ac, abc | abbc |
| `|` | alternation: left **or** right | `cat|dog` | cat, dog | catdog |
| `( )` | groups items so an operator applies to all of them | `(ab)+` | ab, abab | aba |
| `[ ]` | any **one** character from the list or range | `[abc]d`, `[0-9]` | ad, cd; 7 | abd |

:::note The empty string
The string with no characters is written **ε** (or `""`). `a*` matches ε. Isaac's table writes it as `{}`, but `{}` is the **empty set**, a set with no strings at all. ε is a **string** with no characters; the set {ε} has one element.
:::

### Precedence: what does each operator apply to?

1. `*`, `+`, `?` apply to the **single character or bracketed group immediately before them**.
2. Then symbols written next to each other are **joined** (concatenation).
3. `|` is applied **last**, so it splits the whole expression (or the whole group it's in) into two halves.

| Expression | Means | Set |
|---|---|---|
| `ab*` | a, then b* | {a, ab, abb, …} |
| `(ab)*` | (ab) repeated | {ε, ab, abab, …} |
| `a|bc` | a **or** bc | {a, bc} |
| `(a|b)c` | (a or b) then c | {ac, bc} |
| `a|b+c` | a **or** (one or more b's then c) | {a, bc, bbc, bbbc, …} |

:::trap Precedence errors in the textbook answers
- For `a|b+c` the textbook lists **b** as a match. It isn't: the right-hand side `b+c` must end in **c**. Correct examples: a, bc, bbbc.
- For `a*b*c` it lists aabbcc, aaa and bbb. None match: `a*b*c` must end in **exactly one c**. Correct examples: c, abc, bc, aabbc.
- `(01)*` does **not** mean "any combination of 0s and 1s". It means repeats of the **pair** 01: ε, 01, 0101, … (so 10 and 011 are not included). "Any combination of 0s and 1s" is **`(0|1)*`**.
- Likewise "binary strings that start with a 1" is **`1(0|1)*`**, not `1(01)*`.
:::

### Reading a regular expression: worked examples

:::example a*b+c?(d|e)
Read left to right:
1. `a*`: any number of a's, possibly none.
2. `b+`: at least one b.
3. `c?`: an optional single c.
4. `(d|e)`: exactly one d or e to finish.

| String | In the set? | Why |
|---|---|---|
| bd | ✓ | no a's, one b, no c, d |
| abce | ✓ | a, b, c, e |
| aabbbe | ✓ | aa, bbb, no c, e |
| ad | ✗ | needs at least one b |
| bcde | ✗ | only one of d/e allowed at the end |
| ace | ✗ | no b |
:::

{{trace:4.4-1}}

### Writing a regular expression from a description

| Description (alphabet {0, 1} unless stated) | Regular expression |
|---|---|
| any binary string, including ε | `(0|1)*` |
| starts with 1 | `1(0|1)*` |
| ends with 0 (even binary numbers) | `(0|1)*0` |
| starts and ends with 1, length at least 2 | `1(0|1)*1` |
| any number of 0s followed by any number of 1s | `0*1*` |
| contains 11 somewhere | `(0|1)*11(0|1)*` |
| starts with a, ends with a, at least one b in between (alphabet {a, b}) | `ab+a` |

There is often more than one correct answer: `ab+a`, `abb*a` and `ab*ba` all describe the same set. Check your answer with strings that **should** match **and** strings that **shouldn't**.

{{tool:regex-tester regex=1(0|1)*}}

## Regular expressions in programming

Regular expressions are used for **searching** text, **validating** input and **find-and-replace**. Real regex libraries add extras (`\d`, `{n,m}`, `.`), but the core is exactly the AQA set.

```python Matching, searching and replacing in Python
import re

# fullmatch: is the WHOLE string in the set the regex describes?
identifier = r"[a-zA-Z][a-zA-Z0-9_]*"
for name in ["total", "x1", "9lives", "my_var"]:
    print(name, bool(re.fullmatch(identifier, name)))
# total True / x1 True / 9lives False / my_var True

# search: does the pattern appear ANYWHERE in the string?
print(bool(re.search(r"ab+", "xxabbbyy")))      # True
print(bool(re.fullmatch(r"ab+", "xxabbbyy")))   # False

# manipulation: replace and extract
print(re.sub(r"colou?r", "shade", "colour and color"))   # shade and shade
print(re.findall(r"[0-9]+", "Room 12, floor 3"))         # ['12', '3']
```

:::trap Match vs contains
In AQA questions a string **matches** a regular expression only if the **whole** string is in the set. `ab+` does **not** match "xxabbbyy", even though "abbb" appears inside it. In Python, use `re.fullmatch` for the AQA meaning; `re.search` only checks whether it appears somewhere.
:::

## Regular expressions and FSMs

Regular expressions and FSMs are **two descriptions of the same thing**: for every regular expression there is an FSM that accepts exactly the same strings, and for every FSM there is a regular expression. The languages they describe are the **regular languages**.

:::definition Regular language (AQA)
A language is **regular** if it can be **represented by a regular expression**. Equivalently, it is regular if a **finite state machine** can recognise it.
:::

### From a regular expression to an FSM

Build the machine piece by piece from left to right:

| Regex piece | FSM piece |
|---|---|
| `ab` (concatenation) | a transition on a, then a transition on b, through a new state |
| `a|b` | two transitions (or one arrow labelled "a, b") between the same pair of states |
| `a*` | a **loop** on a from a state back to itself |
| `a+` | a transition on a into a state that also has a loop on a (`a+` = `aa*`) |
| `a?` | a transition on a, plus a route that skips it (in a deterministic FSM, usually an extra accepting state) |

:::figure FSM for the regular expression `(a|b)c*de*`. S2 is accepting.
<svg class="diagram" viewBox="0 0 600 190" role="img" aria-label="FSM: S0 to S1 on a or b, S1 loops on c, S1 to S2 on d, S2 loops on e">
  <defs><marker id="arr44a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="15">
    <line x1="30" y1="120" x2="90" y2="120" stroke="currentColor" marker-end="url(#arr44a)"/>
    <circle cx="120" cy="120" r="28" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/><text x="120" y="125" text-anchor="middle">S0</text>
    <circle cx="310" cy="120" r="28" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/><text x="310" y="125" text-anchor="middle">S1</text>
    <circle cx="500" cy="120" r="28" fill="#5fd3a0" fill-opacity="0.3" stroke="currentColor"/><circle cx="500" cy="120" r="23" fill="none" stroke="currentColor"/><text x="500" y="125" text-anchor="middle">S2</text>
    <line x1="148" y1="120" x2="280" y2="120" stroke="currentColor" marker-end="url(#arr44a)"/><text x="214" y="110" text-anchor="middle">a, b</text>
    <line x1="338" y1="120" x2="470" y2="120" stroke="currentColor" marker-end="url(#arr44a)"/><text x="404" y="110" text-anchor="middle">d</text>
    <path d="M 298,95 C 280,40 340,40 322,95" fill="none" stroke="currentColor" marker-end="url(#arr44a)"/><text x="310" y="42" text-anchor="middle">c</text>
    <path d="M 488,95 C 470,40 530,40 512,95" fill="none" stroke="currentColor" marker-end="url(#arr44a)"/><text x="500" y="42" text-anchor="middle">e</text>
    <text x="120" y="172" text-anchor="middle" font-size="12">(a|b)</text><text x="310" y="172" text-anchor="middle" font-size="12">c*</text><text x="404" y="172" text-anchor="middle" font-size="12">d</text><text x="500" y="172" text-anchor="middle" font-size="12">e*</text>
  </g>
</svg>
:::

:::example Tracing "bccde" through the FSM
S0 –b→ S1 –c→ S1 –c→ S1 –d→ S2 –e→ **S2**. Ends in the accepting state, so it is accepted, and `re.fullmatch(r"(a|b)c*de*", "bccde")` is also True. "acd" → S1, S1, S2: accepted. "ace" fails at e: S1 has no transition for e (the d is missing), so it is rejected.
:::

{{trace:4.4-2}}

### From an FSM to a regular expression

:::steps Method
1. Find the route(s) from the start state to each accepting state.
2. Write the label of each transition along the route, in order (concatenation).
3. A **loop** on a state becomes `*` on its label (`x*`); a loop that must happen at least once becomes `+`.
4. A choice of arrows between the same states becomes `|` (or a character class).
5. Two separate routes to acceptance become `route1|route2`.
6. Test with strings that should and shouldn't be accepted.
:::

:::example Two FSMs from [4.2](#/topic/4.2)
- **Ends in ab** (S0, S1, S2): any string of a's and b's, then a then b: **`(a|b)*ab`**.
- **Even number of 0s**: any number of 1s, then pairs of 0s with any 1s between and after: **`1*(01*01*)*`**.

Both were checked by computer against their FSMs on every string up to length 10: they accept exactly the same strings.
:::

{{tool:regex-tester regex=(a|b)*ab}}

## Beyond regular languages

A regular expression has **no way to count**: there is no operator for "the same number of 1s as 0s". An FSM has only a finite number of states. So some languages are **not regular**:

- {0ⁿ1ⁿ | n ≥ 1}: 01, 0011, 000111, …
- correctly nested brackets: (), (()), (()()), …
- palindromes such as abba, racecar.

`0*1*` is regular, but it also includes 0011**1** and 001, so it is not the same set as {0ⁿ1ⁿ}. These languages need a more powerful notation, **BNF** ([4.5](#/topic/4.5)), and a more powerful machine, a **Turing machine** ([4.8](#/topic/4.8)).

:::exam
- **"Which of these strings match?"**: go left to right through the expression, checking what each part consumes. A match must use the **whole** string.
- **"Describe the set of strings"**: say what it starts with, what repeats and how often (zero or more / one or more / optional), and what it ends with.
- **"Write a regular expression for …"**: test it against a string that should match and one that shouldn't. Brackets around alternations: `1(0|1)*`, not `10|1*`.
- **"Draw an FSM equivalent to this regex"**: start arrow, double circle(s), every arrow labelled; loops for `*`.
- **"Explain the relationship between regular expressions and FSMs"**: every regex can be represented by an FSM and vice versa; both define **regular languages**.
:::

:::challenge
1. Write a regex for binary strings that contain **no two consecutive 1s**. Draw the matching FSM.
2. Draw an FSM for `a(b|c)*d` and list five strings it accepts.
3. Is `(a|b)*` the same set as `a*|b*`? Find a string in one but not the other.
4. Explain why the language of palindromes over {a, b} is not regular.
:::

:::recap
- A regex **describes a set** of strings: `*` zero or more, `+` one or more, `?` optional, `|` or, `( )` group, `[ ]` one from a list.
- Operators apply to the item just before them; `|` has the lowest precedence.
- "Any binary string" is `(0|1)*`, **not** `(01)*`. A match must cover the whole string.
- Regex ↔ FSM: same power; both describe **regular languages**.
- A language is regular if a regular expression can represent it.
- Counting languages ({0ⁿ1ⁿ}, nested brackets) are **not** regular, so they need BNF.
:::

:::related
- [4.2 Finite state machines](#/topic/4.2)
- [4.3 Sets and the maths for regular expressions](#/topic/4.3)
- [4.5 Backus-Naur Form and syntax diagrams](#/topic/4.5)
- [6.3 Program translators](#/topic/6.3) — lexical analysis uses regular expressions
:::

*/});
