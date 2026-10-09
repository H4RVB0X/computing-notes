CS.registerTopic({ id: "4.5", title: "Backus-Naur Form and syntax diagrams" }, function () {/*

:::objectives
- Read **BNF** production rules and say exactly what each symbol (`::=`, `< >`, `|`) means.
- Decide whether a string is valid by building a **derivation** or a **parse tree**, and say where an invalid string fails.
- Write simple **production rules** of your own, including **recursive** rules for "one or more".
- Convert between BNF and **syntax diagrams** in both directions.
- Explain why BNF can describe languages that **regular expressions cannot** (anything that needs nesting or counting).
:::

:::quick At a glance
- **BNF** (Backus-Naur Form) is a **meta-language**: a notation for writing the **syntax rules** of another language as **production rules**.
- `<name>` is a **non-terminal** (it must be replaced using another rule); a plain symbol like `7` or `+` is a **terminal** (it appears in the final string).
- `::=` means "**is defined as**"; `|` means "**or**"; writing symbols **next to each other** means "followed by".
- **Recursion** gives "one or more": `<integer> ::= <digit> | <digit><integer>`.
- A string is valid if you can **derive** it from the start symbol, step by step, using the rules. A **parse tree** shows the same thing as a tree.
- **Syntax diagrams** show the same rules as a railway track: **rectangles** = non-terminals, **rounded boxes** = terminals, loops = repetition.
- BNF describes **context-free languages**. Every regular language is context-free, but not the other way round.
- BNF can handle **nesting / matching** (balanced brackets, aⁿbⁿ) because a rule can call itself **in the middle**. A regex/FSM has finitely many states, so it cannot count to an unlimited depth.
:::

:::keyterms
BNF (Backus-Naur Form) :: A formal meta-language used to describe the syntax of a (context-free) language as a set of production rules. :: A precise way of writing grammar rules for a language.
Meta-language :: A language used to describe another language. :: Words about words: BNF describes Python, it isn't Python.
Production rule :: A rule that defines a non-terminal symbol in terms of terminals and/or other non-terminals, written <name> ::= definition. :: One line of BNF.
Terminal symbol :: A symbol that cannot be broken down further and appears in strings of the language. :: A real character like 5 or +.
Non-terminal symbol :: A symbol, written in angle brackets, that is defined by a production rule and must be replaced until only terminals remain. :: A placeholder like <digit>.
Context-free language :: A language that can be described by a set of production rules (a context-free grammar) such as BNF; includes every regular language. :: The bigger family of languages that BNF can describe.
Recursive rule :: A production rule that is defined in terms of itself, e.g. <integer> ::= <digit> | <digit><integer>, allowing unlimited repetition or nesting. :: A rule that uses itself to say "and so on".
Derivation :: A sequence of steps, each replacing one non-terminal using a production rule, that turns the start symbol into a string. :: Showing your working to prove a string is valid.
Parse tree :: A tree showing how a string is derived from the start symbol: non-terminals are internal nodes, terminals are leaves. :: The derivation drawn as a family tree.
Syntax diagram :: A graphical representation of production rules in which rectangles represent non-terminals, rounded boxes represent terminals and arrows show the permitted paths. :: BNF drawn as a railway track.
:::

## Why another notation?

In [4.4](#/topic/4.4) you met **regular expressions**. They are great for simple patterns like postcodes, but they cannot describe the full syntax of a programming language. Programming languages have **nesting**: brackets inside brackets, `IF` inside `WHILE` inside `IF`, and the opening and closing parts must **match**.

**BNF** was devised by John Backus and Peter Naur around 1960 to define the syntax of the language ALGOL 60. Compiler writers still use it (or extended versions of it) today, because a precise grammar lets a program called a **parser** check syntax automatically.

:::figure Every regular language is context-free, but not every context-free language is regular
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="Venn diagram: the set of regular languages sits inside the larger set of context-free languages">
  <rect x="10" y="10" width="500" height="200" rx="18" fill="#7c9aff" fill-opacity="0.12" stroke="currentColor" stroke-width="1.5"/>
  <text x="30" y="38" font-size="15" font-weight="700">Context-free languages (BNF)</text>
  <text x="30" y="58" font-size="12">e.g. balanced brackets, aⁿbⁿ, arithmetic expressions, most programming-language syntax</text>
  <ellipse cx="200" cy="138" rx="150" ry="56" fill="#35d4bd" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/>
  <text x="200" y="132" font-size="15" font-weight="700" text-anchor="middle">Regular languages</text>
  <text x="200" y="152" font-size="12" text-anchor="middle">regex / FSM: a*b, (0|1)*1, postcodes</text>
  <text x="430" y="150" font-size="13" text-anchor="middle">aⁿbⁿ lives</text>
  <text x="430" y="168" font-size="13" text-anchor="middle">out here</text>
</svg>
:::

:::trap Marks are lost here
- Your slides say "BNF is an example of a context-free language". Strictly, BNF is a **notation (meta-language)** for writing **context-free grammars**; the languages it describes are context-free. Say "BNF can be used to define a context-free language".
- Another slide says BNF is needed because "regular expressions don't allow grouping". They do: `(ab)*` groups. The real reason is that regular expressions cannot express **unlimited nesting / matching counts** (see the last section).
:::

## BNF notation

| Symbol | Meaning | Example |
|---|---|---|
| `<…>` | a **non-terminal** (needs its own rule) | `<digit>` |
| `::=` | "is defined as" / "consists of" | `<sign> ::= + \| -` |
| `\|` | "or" (separates **alternatives**) | `0 \| 1` |
| symbols written next to each other | "followed by" (**concatenation**) | `<sign><integer>` |
| anything else | a **terminal**: it appears literally in the string | `+`, `7`, `KS4` |

A full set of rules for signed whole numbers:

```bnf Signed integers
<signed_integer> ::= <sign><integer> | <integer>
<sign>           ::= + | -
<integer>        ::= <digit> | <digit><integer>
<digit>          ::= 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
```

Read the first line aloud: "a signed integer **is defined as** a sign **followed by** an integer, **or** just an integer".

Every non-terminal used on the right-hand side must have its **own rule**, and every chain of rules must eventually end in terminals. That is what makes the grammar complete.

:::trap Marks are lost here
- **Pure BNF has no `{ }` or `[ ]`.** Your ZigZag slide lists `{ }` for optional elements: that is **Extended BNF (EBNF)**. In AQA BNF an optional part is written as two alternatives (`<sign><integer> | <integer>`) and repetition is written with **recursion**.
- `|` means **or**, never "and then". The textbook answer `<Car Reg> ::= <letter> | <letter> | <number> | …` is wrong: it says a registration is a *single* letter **or** a single number. "Followed by" is shown by writing symbols **next to each other**: `<letter><letter><number><number> <letter><letter><letter>`.
- Don't put terminals in angle brackets: `<+>` would be a non-terminal called "+" with no rule.
:::

## Recursion: "one or more"

How do you say "an integer is **one or more** digits" without writing `<digit> | <digit><digit> | <digit><digit><digit> | …` forever? Use a rule that refers to **itself**:

```bnf
<integer> ::= <digit> | <digit><integer>
```

- **Base case:** `<digit>`, a single digit, which stops the recursion.
- **General case:** `<digit><integer>`, a digit followed by a (shorter) integer.

So 472 is an integer because 4 is a digit and 72 is an integer, because 7 is a digit and 2 is an integer, because 2 is a digit (base case). This is exactly the recursion of [1.6](#/topic/1.6): each call deals with a smaller problem until the base case.

:::note Left or right recursion?
`<integer> ::= <digit> | <integer><digit>` (recursion on the **left**) describes exactly the same set of strings, and you may see it in mark schemes. Both are valid BNF. Left recursion is awkward only for a simple hand-written parser, which would call `<integer>` forever without reading anything. The checker below copes with both and warns you when it spots left recursion.
:::

## Checking a string: derivations and parse trees

To prove a string is valid, start from the **start symbol** and replace one non-terminal at a time (a **leftmost derivation** always replaces the leftmost one) until only terminals remain. If you reach the string, it is valid. If no choice of rules can produce it, it is invalid.

:::example Is -47 a valid signed_integer?
```text
<signed_integer>
⇒ <sign><integer>          rule: <signed_integer> ::= <sign><integer>  (it starts with a sign)
⇒ -<integer>               rule: <sign> ::= -
⇒ -<digit><integer>        rule: <integer> ::= <digit><integer>  (two digits left, so not the base case)
⇒ -4<integer>              rule: <digit> ::= 4
⇒ -4<digit>                rule: <integer> ::= <digit>  (one digit left: base case)
⇒ -47                      rule: <digit> ::= 7
```
Every non-terminal has gone and the result is exactly `-47`, so **-47 is valid**.
:::

The same derivation as a **parse tree**: the start symbol is the root, each rule application gives a node's children, and reading the **leaves left to right** spells the string.

:::figure Parse tree for -47
<svg class="diagram" viewBox="0 0 520 310" role="img" aria-label="Parse tree: signed_integer branches to sign and integer; sign gives minus; integer gives digit (4) and integer; that integer gives digit (7)">
  <g stroke="currentColor" stroke-width="1.4" stroke-opacity="0.6">
    <line x1="260" y1="40" x2="140" y2="85"/><line x1="260" y1="40" x2="360" y2="85"/>
    <line x1="140" y1="105" x2="140" y2="150"/>
    <line x1="360" y1="105" x2="290" y2="150"/><line x1="360" y1="105" x2="430" y2="150"/>
    <line x1="290" y1="170" x2="290" y2="215"/>
    <line x1="430" y1="170" x2="430" y2="215"/>
    <line x1="430" y1="235" x2="430" y2="275"/>
  </g>
  <g font-size="14" text-anchor="middle" font-family="inherit">
    <text x="260" y="32" fill="#4f74ff">&lt;signed_integer&gt;</text>
    <text x="140" y="100" fill="#4f74ff">&lt;sign&gt;</text>
    <text x="360" y="100" fill="#4f74ff">&lt;integer&gt;</text>
    <text x="140" y="168" font-weight="700" font-size="18">-</text>
    <text x="290" y="166" fill="#4f74ff">&lt;digit&gt;</text>
    <text x="430" y="166" fill="#4f74ff">&lt;integer&gt;</text>
    <text x="290" y="235" font-weight="700" font-size="18">4</text>
    <text x="430" y="231" fill="#4f74ff">&lt;digit&gt;</text>
    <text x="430" y="296" font-weight="700" font-size="18">7</text>
  </g>
</svg>
:::

### Spotting an invalid string

`12a` is **not** a signed_integer. Trying to derive it: `1` is a digit, `2` is a digit, but there is no rule that produces `a` (only `0`–`9` come from `<digit>`, and `<sign>` is only allowed at the **start**). The derivation gets stuck at position 3, so the string is invalid.

When an exam question asks "which of these strings are valid?", give the **reason** for each invalid one: e.g. "`4-2` is invalid because a sign may only appear before the first digit".

{{trace:4.5-1}}

### Try it

The checker below has the signed-integer rules loaded. Type your own strings, press **Check** and open **Show working** to see the leftmost derivation, parse tree, or the point of failure. Then try the other presets.

{{tool:bnf-checker preset=signed}}

## Writing your own production rules

Work **top-down**: write the rule for the whole thing first, then a rule for each non-terminal you used, until everything ends in terminals.

:::example A car registration in the format LLNN LLL
"Two letters, two digits, a space, three letters", e.g. `AB51 XYZ`.

```bnf
<registration> ::= <letter><letter><digit><digit><space><letter><letter><letter>
<letter>       ::= A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z
<digit>        ::= 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
<space>        ::= " "
```

- The fixed format means **no recursion** is needed: just concatenation.
- The space is a terminal; writing it in quotes (or as a named non-terminal like `<space>`) makes it visible.
- In an exam you may write `A | B | … | Z` for the letters if you make the meaning clear, but never use `…` in the checker: it needs every alternative.
:::

:::example A simple identifier
"An identifier starts with a letter and is followed by any number of letters or digits."

```bnf
<identifier> ::= <letter> | <letter><rest>
<rest>       ::= <letter> | <digit> | <letter><rest> | <digit><rest>
```

`<rest>` uses recursion for "one or more", and `<identifier> ::= <letter>` handles the one-letter case. Check `x2y`: `x` is a letter, `2y` is a `<digit><rest>`, `y` is a `<letter>`. Valid. `2x` fails at once: it must **start** with a letter.
:::

## Syntax diagrams

A **syntax diagram** shows exactly the same rules as a picture. Follow the arrows from left to right; any path you can travel spells a valid string.

| Shape | Meaning |
|---|---|
| rectangle | **non-terminal**: go and follow that diagram |
| rounded box / circle | **terminal**: this exact symbol appears |
| fork in the track | **alternatives** (BNF `\|`) |
| track that loops back | **repetition** (BNF recursion) |
| track that bypasses a box | **optional** item |

:::figure Syntax diagrams for integer and signed integer
<svg class="diagram" viewBox="0 0 520 290" role="img" aria-label="Syntax diagrams. Integer: a digit box with a track looping back so the digit can repeat. Signed integer: a fork with plus, minus or nothing, followed by an integer box.">
  <defs><marker id="arr45" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g fill="none" stroke="currentColor" stroke-width="1.6">
    <text x="10" y="22" font-size="14" font-weight="700" fill="currentColor" stroke="none">integer</text>
    <path d="M20,60 H170" marker-end="url(#arr45)"/>
    <rect x="170" y="42" width="110" height="36" fill="#7c9aff" fill-opacity="0.2"/>
    <path d="M280,60 H480" marker-end="url(#arr45)"/>
    <path d="M330,60 Q330,105 305,105 H145 Q120,105 120,80 V60"/>
    <path d="M232,100 L222,105 L232,110"/>
    <text x="225" y="65" font-size="14" text-anchor="middle" fill="currentColor" stroke="none">digit</text>
    <text x="225" y="125" font-size="12" text-anchor="middle" fill="currentColor" stroke="none">loop back: one or more digits</text>

    <text x="10" y="162" font-size="14" font-weight="700" fill="currentColor" stroke="none">signed integer</text>
    <path d="M20,220 H80"/>
    <path d="M80,220 Q80,180 110,180 H150" marker-end="url(#arr45)"/>
    <path d="M80,220 H150" marker-end="url(#arr45)"/>
    <path d="M80,220 Q80,262 110,262 H250 Q280,262 280,220"/>
    <rect x="150" y="164" width="50" height="32" rx="16" fill="#35d4bd" fill-opacity="0.25"/>
    <rect x="150" y="204" width="50" height="32" rx="16" fill="#35d4bd" fill-opacity="0.25"/>
    <path d="M200,180 H250 Q280,180 280,220"/>
    <path d="M200,220 H330" marker-end="url(#arr45)"/>
    <rect x="330" y="202" width="100" height="36" fill="#7c9aff" fill-opacity="0.2"/>
    <path d="M430,220 H500" marker-end="url(#arr45)"/>
    <text x="175" y="185" font-size="16" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none">+</text>
    <text x="175" y="225" font-size="16" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none">−</text>
    <text x="380" y="225" font-size="14" text-anchor="middle" fill="currentColor" stroke="none">integer</text>
    <text x="180" y="280" font-size="12" text-anchor="middle" fill="currentColor" stroke="none">bypass: the sign is optional</text>
  </g>
</svg>
:::

Converting between the two:

- **BNF → diagram:** one diagram per non-terminal; each alternative becomes a branch; a recursive alternative like `<digit><integer>` becomes a loop back to the start.
- **Diagram → BNF:** each fork becomes `|`; each loop becomes a recursive rule; a bypass becomes an alternative without that item.

:::trap Marks are lost here
- Using the **wrong shapes**: in AQA syntax diagrams non-terminals are **rectangles** and terminals are **rounded** (ellipses/circles). Mark schemes check this.
- Forgetting that a loop must go **back through** the box (so at least one digit is required). A loop that lets you skip the box entirely would allow the empty string.
:::

## Why BNF can do what regular expressions cannot

This is the second spec point, and a favourite 2–3 mark question.

Consider the language **aⁿbⁿ**: some a's followed by the **same number** of b's (`ab`, `aabb`, `aaabbb`, …). The same idea appears as **balanced brackets**: `(())` is fine, `(()` is not.

In BNF it takes one line:

```bnf
<s> ::= ab | a<s>b
```

The recursion happens **in the middle** of the rule, so every `a` added on the left forces a matching `b` on the right.

A regular expression **cannot** do this:

- `a*b*` also accepts `aab` and `abbb`: the counts don't match.
- `(ab)*` gives `abab`, which isn't the right shape.
- A regex is equivalent to a **finite state machine**. To check aⁿbⁿ for *any* n, the machine would have to **remember n**, which needs a different state for every possible count. With only finitely many states, there is always a bigger n it cannot count to.

::::tabs
:::tab Python
```python Recursive checkers that mirror the BNF rules
DIGITS = "0123456789"

def is_digit(s):
    return len(s) == 1 and s in DIGITS

def is_integer(s):
    # <integer> ::= <digit> | <digit><integer>
    if is_digit(s):
        return True
    return len(s) > 1 and is_digit(s[0]) and is_integer(s[1:])

def is_signed_integer(s):
    # <signed_integer> ::= <sign><integer> | <integer>
    if s[:1] in ("+", "-") and is_integer(s[1:]):
        return True
    return is_integer(s)

def is_anbn(s):
    # <s> ::= ab | a<s>b      (no regular expression can do this)
    if s == "ab":
        return True
    return len(s) > 2 and s[0] == "a" and s[-1] == "b" and is_anbn(s[1:-1])

for test in ["472", "-47", "12a", "--5"]:
    print(test, is_signed_integer(test))
for test in ["ab", "aaabbb", "aabbb", "abab"]:
    print(test, is_anbn(test))
```
```output
472 True
-47 True
12a False
--5 False
ab True
aaabbb True
aabbb False
abab False
```
:::
:::tab AQA pseudocode
```pseudocode
SUBROUTINE isANBN(s)
  IF s = "ab" THEN
    RETURN True
  ENDIF
  IF LEN(s) > 2 THEN
    IF SUBSTRING(0, 0, s) = "a" AND SUBSTRING(LEN(s) - 1, LEN(s) - 1, s) = "b" THEN
      RETURN isANBN(SUBSTRING(1, LEN(s) - 2, s))
    ENDIF
  ENDIF
  RETURN False
ENDSUBROUTINE
```
:::
::::

Each recursive call strips one `a` and one `b`. The recursion uses the call stack as unlimited memory, which is precisely what a finite state machine lacks.

Try the **"Expressions with brackets"** preset in the checker above: `(1+2)*3` and `((4))` are accepted, `(1+2` is rejected.

:::why Why does this matter for programming languages?
Every real language nests: brackets in expressions, blocks inside blocks, quotes inside function calls. A compiler's **syntax analysis** stage needs a grammar that can describe nesting to any depth, so language designers use BNF (or EBNF). Regular expressions are still used for the **lexical analysis** stage, which splits code into tokens like identifiers and numbers. See [6.2](#/topic/6.2).
:::

:::exam
- **"Explain why BNF can represent some languages that regular expressions cannot"** (2–3 marks): BNF allows **recursion**, so rules can be **nested to any depth** / used to match counts (e.g. balanced brackets, aⁿbⁿ). A regular expression is equivalent to an FSM, which has a **finite number of states** and so cannot remember/count an unlimited number of symbols.
- **"Is this string valid? Explain"**: either write out the derivation, or give the specific rule that the string breaks ("a sign can only appear at the start", "KS6 is not one of the alternatives for `<level>`").
- **"Write a production rule for …"**: use `::=`, angle brackets on non-terminals, `|` for alternatives, and **recursion** for "one or more". Check by deriving a sample string.
- **"Draw a syntax diagram"**: rectangles for non-terminals, rounded shapes for terminals, arrows, and a loop for recursion. Each BNF alternative is a separate branch.
- **"State the difference between a terminal and a non-terminal"** (2 marks): a terminal appears in the final string and cannot be broken down further; a non-terminal is defined by a production rule and must be replaced.
:::

:::challenge
1. Write BNF for a binary number with **no leading zeros** (so `0`, `1`, `10`, `1101` are valid but `01` is not). Test it in the checker.
2. Write BNF for balanced brackets, where `()`, `(())()` and the empty string are all valid. Why is the empty-string alternative needed?
3. Draw the syntax diagram for your identifier rules from the worked example.
4. A rule `<list> ::= <item> | <item>,<list>`: what strings does it produce if `<item> ::= a | b`? Write an equivalent regular expression. Why is a regex possible here but not for aⁿbⁿ?
:::

:::recap
- BNF is a **meta-language** for writing **production rules**; it defines **context-free** languages.
- `<non-terminal>` must be replaced; **terminals** appear in the string; `::=` is "is defined as", `|` is "or", adjacency is "followed by".
- **Recursion** gives "one or more": `<integer> ::= <digit> | <digit><integer>` (base case + general case).
- Check a string with a **derivation** (one replacement per step) or a **parse tree** (leaves read left to right).
- **Syntax diagrams**: rectangles = non-terminals, rounded = terminals, forks = alternatives, loops = repetition.
- No `{ }` / `[ ]` in pure BNF: optional = an extra alternative, repetition = recursion.
- BNF can describe **nesting and matched counts** (aⁿbⁿ, brackets); regex/FSMs cannot because they have **finitely many states**.
:::

:::related
- [4.4 Regular expressions and regular languages](#/topic/4.4)
- [4.2 Finite state machines](#/topic/4.2)
- [1.6 Recursion](#/topic/1.6)
- [6.2 Translators](#/topic/6.2): syntax analysis in a compiler
:::

*/});
