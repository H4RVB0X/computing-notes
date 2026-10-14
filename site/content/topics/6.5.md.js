CS.registerTopic({ id: "6.5", title: "Boolean algebra" }, function () {/*

:::objectives
- State and use the Boolean identities: identity, null (annulment), idempotent, complement, double negation, commutative, associative, distributive and absorption.
- State **De Morgan's laws** and apply them, including to expressions with more than two terms.
- **Simplify** Boolean expressions step by step, naming the law used at each step.
- Check a simplification (or prove an identity) with a **truth table**.
- Explain why simplifying expressions matters for real circuits.
:::

:::quick At a glance
- Treat **AND like multiply** and **OR like add**, but watch the differences: **A + A = A**, **A + 1 = 1**, and **A + B.C = (A + B).(A + C)**.
- Key identities: A.1 = A, A + 0 = A, A.0 = 0, A + 1 = 1, A.A = A, A + A = A, A.<span style='text-decoration:overline'>A</span> = 0, A + <span style='text-decoration:overline'>A</span> = 1, ¬¬A = A.
- **Absorption**: A + A.B = A and A.(A + B) = A. Very useful: **A + <span style='text-decoration:overline'>A</span>.B = A + B**.
- **De Morgan**: <span style='text-decoration:overline'>A + B</span> = <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span> and <span style='text-decoration:overline'>A.B</span> = <span style='text-decoration:overline'>A</span> + <span style='text-decoration:overline'>B</span>. **Break the bar, change the operator.**
- Strategy: remove big bars with De Morgan → expand brackets → tidy with complement/idempotent/identity → factorise and absorb.
- Every step: write the new expression **and the law used**. Check the final answer with a truth table.
:::

:::keyterms
Boolean algebra :: A system of algebra in which variables take only the values 0 and 1, combined with the operators AND, OR and NOT. :: Algebra for true/false.
Boolean identity :: A rule stating that two Boolean expressions are equal for every combination of input values. :: A law you can use to swap one expression for another.
De Morgan's laws :: The rules NOT(A OR B) = (NOT A) AND (NOT B), and NOT(A AND B) = (NOT A) OR (NOT B). :: Break the bar, change the sign.
Commutative law :: The order of the operands does not matter: A.B = B.A and A + B = B + A. :: Swap them round.
Associative law :: Operands joined by the same operator can be regrouped: (A.B).C = A.(B.C) and (A + B) + C = A + (B + C). :: Move the brackets.
Distributive law :: A.(B + C) = A.B + A.C, and also A + B.C = (A + B).(A + C). :: Expand or factorise brackets.
Absorption law :: A + A.B = A and A.(A + B) = A. :: The bigger term swallows the smaller one.
Complement law :: A.¬A = 0 and A + ¬A = 1. :: Something and its opposite.
Idempotent law :: A.A = A and A + A = A. :: Repeating a variable changes nothing.
Double negation :: ¬¬A = A. :: Two NOTs cancel.
Simplification :: Rewriting a Boolean expression as an equivalent expression with fewer terms or operators. :: Same logic, fewer gates.
:::

## Why simplify?

Every operator in an expression becomes a **gate** in the circuit. An equivalent but shorter expression means:

- **fewer gates**, so the circuit is **cheaper** and takes **less space** on the chip;
- **less power** used and **less heat** produced;
- **faster** operation, because signals pass through fewer gates (less propagation delay).

<svg class="diagram" viewBox="0 0 620 125" role="img" aria-label="Simplifying A + NOT A AND B to A + B replaces three gates with a single OR gate">
<g font-family="inherit">
<text x="10" y="18" font-size="13" text-anchor="start" font-weight="700">Before: Q = A + ¬A.B  (3 gates)</text>
<text x="10" y="55" font-size="14" text-anchor="start" >A</text>
<text x="10" y="105" font-size="14" text-anchor="start" >B</text>
<g transform="translate(80,40)"><path d="M0,4 L34,20 L0,36 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/><circle cx="38" cy="20" r="4" fill="none" stroke="currentColor" stroke-width="2"/></g>
<g transform="translate(160,70)"><path d="M0,0 H28 A20,20 0 0 1 28,40 H0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g>
<g transform="translate(270,40)"><path d="M0,0 Q18,20 0,40 Q34,40 52,20 Q34,0 0,0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g>
<path d="M25,50 L55,50" fill="none" stroke="currentColor" stroke-width="1.6"/>
<circle cx="55" cy="50" r="3.2" fill="currentColor"/>
<path d="M55,50 L55,60 L80,60" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M55,50 L55,30 L240,30 L240,50 L277,50" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M122,60 L140,60 L140,80 L160,80" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M25,100 L160,100" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M208,90 L250,90 L250,70 L277,70" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M322,60 L350,60" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="356" y="65" font-size="14" text-anchor="start" >Q</text>
<text x="400" y="18" font-size="13" text-anchor="start" font-weight="700">After: Q = A + B  (1 gate)</text>
<text x="400" y="55" font-size="14" text-anchor="start" >A</text>
<text x="400" y="85" font-size="14" text-anchor="start" >B</text>
<g transform="translate(480,40)"><path d="M0,0 Q18,20 0,40 Q34,40 52,20 Q34,0 0,0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g>
<path d="M415,50 L487,50" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M415,80 L440,80 L440,70 L487,70" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M532,60 L580,60" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="586" y="65" font-size="14" text-anchor="start" >Q</text>
</g>
</svg>
The two circuits above give **exactly** the same output for every input. Boolean algebra is how you prove that without building both.

### Notation on this page

- AQA papers use **A.B** (AND), **A + B** (OR) and an **overbar** for NOT: <span style='text-decoration:overline'>A</span>, <span style='text-decoration:overline'>A.B</span>.
- In longer working this page writes NOT as **¬** (so ¬(A.B) means <span style='text-decoration:overline'>A.B</span>), because nested bars are hard to show on screen. They mean exactly the same thing. In the exam, write bars as the paper does and be careful about their length.
- **Precedence**: brackets (and bars) first, then NOT, then AND, then OR. So A + B.C means A + (B.C).

## The Boolean identities

| Law | AND form | OR form | Why it is true |
|---|---|---|---|
| **Identity** | A.1 = A | A + 0 = A | ANDing with 1 / ORing with 0 lets A through unchanged |
| **Null** (annulment) | A.0 = 0 | A + 1 = 1 | A 0 forces AND to 0; a 1 forces OR to 1 |
| **Idempotent** | A.A = A | A + A = A | A combined with itself is just A |
| **Complement** | A.<span style='text-decoration:overline'>A</span> = 0 | A + <span style='text-decoration:overline'>A</span> = 1 | Exactly one of A, <span style='text-decoration:overline'>A</span> is 1 |
| **Double negation** | ¬¬A = A | | Inverting twice returns the original |
| **Commutative** | A.B = B.A | A + B = B + A | Order does not matter |
| **Associative** | (A.B).C = A.(B.C) | (A + B) + C = A + (B + C) | Grouping does not matter (same operator) |
| **Distributive** | A.(B + C) = A.B + A.C | A + B.C = (A + B).(A + C) | Expand/factorise; the OR form has **no** equivalent in ordinary algebra |
| **Absorption** | A.(A + B) = A | A + A.B = A | If A is 1 the result is 1; if A is 0 the result is 0, whatever B is |
| **De Morgan** | <span style='text-decoration:overline'>A.B</span> = <span style='text-decoration:overline'>A</span> + <span style='text-decoration:overline'>B</span> | <span style='text-decoration:overline'>A + B</span> = <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span> | See below |

### Two derived results worth memorising

| Result | Proof in one line |
|---|---|
| **A + <span style='text-decoration:overline'>A</span>.B = A + B** | = (A + <span style='text-decoration:overline'>A</span>).(A + B) [distributive] = 1.(A + B) [complement] = A + B [identity] |
| **A.(<span style='text-decoration:overline'>A</span> + B) = A.B** | = A.<span style='text-decoration:overline'>A</span> + A.B [distributive] = 0 + A.B [complement] = A.B [identity] |

And the XOR expansion: **A ⊕ B = A.<span style='text-decoration:overline'>B</span> + <span style='text-decoration:overline'>A</span>.B**, and its inverse **<span style='text-decoration:overline'>A ⊕ B</span> = A.B + <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span>** (the "equivalence" function).

:::trap Ordinary algebra habits that lose marks
- **A + A = A**, not 2A. **A.A = A**, not A<sup>2</sup>.
- **A + 1 = 1**, not "A + 1". **A.0 = 0**.
- **A.<span style='text-decoration:overline'>A</span> = 0** and **A + <span style='text-decoration:overline'>A</span> = 1**: do not leave these in your answer.
- The OR-distributive law **A + B.C = (A + B).(A + C)** looks wrong to a maths student, but it is true in Boolean algebra (check it with a truth table).
- The class notes contain the slip "A.1 simplifies to A (as 1.A = 1)". **1.A = A** (identity law), not 1.
:::

## De Morgan's laws

:::definition De Morgan's laws
- **<span style='text-decoration:overline'>A + B</span> = <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span>**   (NOR is the same as AND of the inverted inputs)
- **<span style='text-decoration:overline'>A.B</span> = <span style='text-decoration:overline'>A</span> + <span style='text-decoration:overline'>B</span>**   (NAND is the same as OR of the inverted inputs)
:::

**Recipe: "break the bar, change the operator".**
1. Break the long bar into separate bars over each term.
2. Change the operator underneath: AND ↔ OR.
3. Leave any brackets around groups in place.

They extend to any number of terms: **<span style='text-decoration:overline'>A.B.C</span> = <span style='text-decoration:overline'>A</span> + <span style='text-decoration:overline'>B</span> + <span style='text-decoration:overline'>C</span>** and **<span style='text-decoration:overline'>A + B + C</span> = <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span>.<span style='text-decoration:overline'>C</span>**.

### Proof by truth table

Two expressions are equal if their columns are identical for every row.

| A | B | <span style='text-decoration:overline'>A</span> | <span style='text-decoration:overline'>B</span> | A + B | <span style='text-decoration:overline'>A + B</span> | <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span> |
|---|---|---|---|---|---|---|
| 0 | 0 | 1 | 1 | 0 | **1** | **1** |
| 0 | 1 | 1 | 0 | 1 | **0** | **0** |
| 1 | 0 | 0 | 1 | 1 | **0** | **0** |
| 1 | 1 | 0 | 0 | 1 | **0** | **0** |

The last two columns match, so <span style='text-decoration:overline'>A + B</span> = <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span>. Now prove the second law yourself:

{{trace:6.5-1}}

### Applying De Morgan to bigger expressions

Work on **one bar at a time**, starting with the **longest** (outermost) bar, and keep groups bracketed.

:::example ¬(A + B.C)
1. The top-level operator under the bar is **+**, joining A and (B.C).
2. Break the bar and change + to . : **¬A.¬(B.C)**   [De Morgan]
3. Break the remaining bar over B.C and change . to + : **¬A.(¬B + ¬C)**   [De Morgan]

Keep the brackets in step 3: ¬A.¬B + ¬C would be a different expression.
:::

:::trap De Morgan mistakes
- Inverting the terms but **forgetting to change the operator**: ¬(A.B) is **not** ¬A.¬B.
- Changing the operator but **forgetting to invert** each term.
- Applying De Morgan **inside** a group before dealing with the outer bar, and then losing track of what is inverted.
- Dropping brackets: ¬(A + B.C) = ¬A.(¬B + ¬C), **not** ¬A.¬B + ¬C.
- A textbook answer in your notes describes De Morgan as "negating all possible solutions so only NAND or NOR gates are used". The laws themselves are just the two equalities above; building circuits from one gate type is one **use** of them.
:::

## How to simplify: a strategy

:::steps
1. **Remove long bars** with De Morgan (outermost first). Remove double bars with double negation.
2. **Expand brackets** with the distributive law.
3. **Tidy**: replace A.A with A, A.<span style='text-decoration:overline'>A</span> with 0, A + <span style='text-decoration:overline'>A</span> with 1, X.0 with 0, X + 0 with X, X.1 with X.
4. **Factorise** common terms (distributive) and look for **X + <span style='text-decoration:overline'>X</span> = 1**.
5. **Absorb**: any term that contains another whole term ORed with it disappears (A + A.B = A).
6. Use the derived result **A + <span style='text-decoration:overline'>A</span>.B = A + B** where it fits.
7. **Check** with a truth table (or the tool below): the original and your answer must match on every row.
:::

:::tip Spot the shortcut first
Before expanding, look for absorption and the derived results. (A + B).(A + <span style='text-decoration:overline'>B</span>) is A in one step by the OR-distributive law (A + B.<span style='text-decoration:overline'>B</span> = A + 0 = A), but six lines if you expand everything.
:::

## Fully worked simplifications

Each step names the law used. Cover the right-hand side and try them first.

:::example 1. Simplify A.B + A.<span style='text-decoration:overline'>B</span>
| Step | Expression | Law |
|---|---|---|
| | A.B + A.¬B | |
| 1 | A.(B + ¬B) | distributive (factorise A) |
| 2 | A.1 | complement |
| 3 | **A** | identity |
:::

:::example 2. Simplify A + <span style='text-decoration:overline'>A</span>.B
| Step | Expression | Law |
|---|---|---|
| | A + ¬A.B | |
| 1 | (A + ¬A).(A + B) | distributive (OR form) |
| 2 | 1.(A + B) | complement |
| 3 | **A + B** | identity |

One of the textbook answers in your notes gives this as "B". Check A = 1, B = 0: A + ¬A.B = 1 + 0 = 1, but B = 0. The correct answer is **A + B**.
:::

:::example 3. Simplify (A + B).(A + <span style='text-decoration:overline'>B</span>)
| Step | Expression | Law |
|---|---|---|
| | (A + B).(A + ¬B) | |
| 1 | A.A + A.¬B + B.A + B.¬B | distributive (expand) |
| 2 | A + A.¬B + A.B + 0 | idempotent, commutative, complement |
| 3 | A + A.¬B + A.B | identity (X + 0 = X) |
| 4 | A + A.B | absorption (A + A.¬B = A) |
| 5 | **A** | absorption |

Shortcut: (A + B).(A + ¬B) = A + B.¬B [distributive, OR form] = A + 0 [complement] = A [identity].
:::

:::example 4. Simplify ¬(¬A.¬B)
| Step | Expression | Law |
|---|---|---|
| | ¬(¬A.¬B) | |
| 1 | ¬¬A + ¬¬B | De Morgan |
| 2 | **A + B** | double negation |

This is why "NOT each input, then NAND" makes an OR gate.
:::

:::example 5. Simplify ¬(A + ¬B).C
| Step | Expression | Law |
|---|---|---|
| | ¬(A + ¬B).C | |
| 1 | ¬A.¬¬B.C | De Morgan |
| 2 | **¬A.B.C** | double negation |
:::

:::example 6. Simplify X.Y + X.Y.Z + X.<span style='text-decoration:overline'>Y</span>
| Step | Expression | Law |
|---|---|---|
| | X.Y + X.Y.Z + X.¬Y | |
| 1 | X.Y + X.¬Y | absorption (X.Y + X.Y.Z = X.Y) |
| 2 | X.(Y + ¬Y) | distributive (factorise X) |
| 3 | X.1 | complement |
| 4 | **X** | identity |
:::

:::example 7. Show that <span style='text-decoration:overline'>A.B</span>.(A + B) = A ⊕ B
| Step | Expression | Law |
|---|---|---|
| | ¬(A.B).(A + B) | |
| 1 | (¬A + ¬B).(A + B) | De Morgan |
| 2 | ¬A.A + ¬A.B + ¬B.A + ¬B.B | distributive (expand) |
| 3 | 0 + ¬A.B + A.¬B + 0 | complement, commutative |
| 4 | A.¬B + ¬A.B | identity, commutative |
| 5 | **A ⊕ B** | definition of XOR |

So an XOR gate can be built from an OR, a NAND and an AND gate.
:::

:::example 8. Simplify <span style='text-decoration:overline'>A + B</span> + <span style='text-decoration:overline'>A</span>.B
| Step | Expression | Law |
|---|---|---|
| | ¬(A + B) + ¬A.B | |
| 1 | ¬A.¬B + ¬A.B | De Morgan |
| 2 | ¬A.(¬B + B) | distributive (factorise ¬A) |
| 3 | ¬A.1 | complement |
| 4 | **¬A** | identity |
:::

:::example 9. From your worksheet: simplify ¬(A + B.¬A)
| Step | Expression | Law |
|---|---|---|
| | ¬(A + B.¬A) | |
| 1 | ¬(A + ¬A.B) | commutative |
| 2 | ¬((A + ¬A).(A + B)) | distributive (OR form) |
| 3 | ¬(1.(A + B)) | complement |
| 4 | ¬(A + B) | identity |
| 5 | **¬A.¬B** | De Morgan |

The answer is A NOR B, matching the worksheet's truth-table method.
:::

:::example 10. The truth table from 6.4: simplify <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span>.C + <span style='text-decoration:overline'>A</span>.B.C + A.<span style='text-decoration:overline'>B</span>.C
| Step | Expression | Law |
|---|---|---|
| | ¬A.¬B.C + ¬A.B.C + A.¬B.C | |
| 1 | ¬A.C.(¬B + B) + A.¬B.C | commutative, distributive (factorise ¬A.C) |
| 2 | ¬A.C.1 + A.¬B.C | complement |
| 3 | ¬A.C + A.¬B.C | identity |
| 4 | C.(¬A + A.¬B) | commutative, distributive (factorise C) |
| 5 | C.(¬A + ¬B) | derived result X + ¬X.Y = X + Y, with X = ¬A (so ¬X = A, by double negation) |
| 6 | **C.¬(A.B)** | De Morgan |

Circuit: one NAND gate and one AND gate instead of eight gates.
:::

:::example 11. Stretch: show that (A + B).(<span style='text-decoration:overline'>A</span> + C) = A.C + <span style='text-decoration:overline'>A</span>.B
| Step | Expression | Law |
|---|---|---|
| | (A + B).(¬A + C) | |
| 1 | A.¬A + A.C + B.¬A + B.C | distributive (expand) |
| 2 | 0 + A.C + ¬A.B + B.C | complement, commutative |
| 3 | A.C + ¬A.B + B.C.(A + ¬A) | identity (X + 0 = X; X.1 = X) and complement (1 = A + ¬A) |
| 4 | A.C + ¬A.B + A.B.C + ¬A.B.C | distributive, commutative |
| 5 | **A.C + ¬A.B** | absorption twice (A.C + A.C.B = A.C; ¬A.B + ¬A.B.C = ¬A.B) |

The B.C term is redundant (it is called the *consensus* term). You can verify every row in the trace challenge below.
:::

{{trace:6.5-2}}

## Checking with truth tables (and code)

If two expressions give the same output for **every** combination of inputs, they are equivalent. With n variables that is 2<sup>n</sup> rows, which a few lines of Python can check for you:

```python
from itertools import product

def equivalent(f, g, n):
    """True if f and g give the same output for all 2**n input rows."""
    return all(f(*row) == g(*row) for row in product([False, True], repeat=n))

# Example 2: A + not A.B  ==  A + B ?
print(equivalent(lambda a, b: a or (not a and b), lambda a, b: a or b, 2))
# De Morgan: not(A and B)  ==  not A or not B ?
print(equivalent(lambda a, b: not (a and b), lambda a, b: (not a) or (not b), 2))
# A common mistake: not(A and B)  ==  not A and not B ?
print(equivalent(lambda a, b: not (a and b), lambda a, b: (not a) and (not b), 2))
```
```output
True
True
False
```

### Try it: Boolean simplifier

Enter an expression to see its truth table and a minimal form, or enter two expressions to check they are equivalent.

{{tool:boolean-simplifier}}

{{trace:6.5-3}}

## Common mistakes (summary)

:::trap
- **Dropping a bar** or shortening it: <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span> and <span style='text-decoration:overline'>A.B</span> are different (the first is NOR, the second NAND).
- **Not stating the law** used at each step. Many mark schemes give marks per correct step *with* its justification.
- **Expanding when absorption would finish it.** Look for A + A.X patterns first.
- **Stopping too early**: an answer like A.1 or A + 0 or A + A.B is not fully simplified.
- **Skipping steps**: doing two laws at once is fine only if you name both.
- **Misreading precedence**: A + B.C is A + (B.C), not (A + B).C.
- Several textbook answers in the notes (e.g. "A + Ā.B = B" and "B.(Ā + B) = B.Ā") are wrong when checked by truth table. B.(¬A + B) = B by absorption. **Always check with a truth table.**
:::

:::collapse Optional extra (not on the AQA specification): Karnaugh maps
A **Karnaugh map** is a grid version of a truth table, ordered so neighbouring cells differ in one variable (Gray code: 00, 01, 11, 10). You group adjacent 1s in rectangles of size 1, 2, 4 or 8; each group gives a product term where only the unchanging variables appear.

For Example 10 (rows 001, 011, 101 are 1):

| A \ BC | 00 | 01 | 11 | 10 |
|---|---|---|---|---|
| **0** | 0 | 1 | 1 | 0 |
| **1** | 0 | 1 | 0 | 0 |

- Group (A=0, BC=01) with (A=0, BC=11): A = 0 and C = 1 throughout, B changes → **¬A.C**.
- Group (A=0, BC=01) with (A=1, BC=01): B = 0, C = 1 throughout, A changes → **¬B.C**.
- Q = ¬A.C + ¬B.C = C.(¬A + ¬B) = C.¬(A.B), the same as the algebra.

AQA questions ask you to use **Boolean identities and De Morgan's laws**, so use algebra in the exam unless told otherwise. A K-map is a good way to **check** your answer.
:::

:::exam
- **"Simplify, showing your working"** (2–4 marks): typically one mark per correct step plus one for the final answer. Write each line under the last with the **law named**.
- **"Use De Morgan's laws to…"**: you must visibly apply De Morgan (break the bar, change the operator) even if you can see the answer.
- **"Prove … using a truth table"**: include intermediate columns and point out that the two final columns are **identical**.
- **"Explain why simplification is useful"**: fewer gates → cheaper, smaller, less power/heat, faster.
- Answers that are equivalent but not fully simplified usually lose the final mark: finish with the **shortest** form.
:::

:::challenge
1. Simplify (A + B).(A + C) and explain which law gives the answer in one step.
2. Prove, using algebra, that A ⊕ B ⊕ B = A. What does this mean for the [Vernam cipher](#/topic/5.8)?
3. Express A + B using **only NOR** operations and prove it with De Morgan's laws.
4. Simplify ¬(A.B + ¬C) and draw the circuits before and after.
:::

:::recap
- AND ≈ multiply, OR ≈ add, but A + A = A, A + 1 = 1 and A + B.C = (A + B).(A + C).
- Identity, null, idempotent, complement, double negation, commutative, associative, distributive, absorption.
- Derived: A + ¬A.B = A + B; A.(¬A + B) = A.B; A ⊕ B = A.¬B + ¬A.B.
- De Morgan: ¬(A + B) = ¬A.¬B, ¬(A.B) = ¬A + ¬B; break the bar, change the operator, outermost bar first.
- Strategy: remove bars → expand → tidy → factorise → absorb → check with a truth table.
- Simpler expression = fewer gates = cheaper, cooler, faster circuit.
:::

:::related
- [6.4 Logic gates and circuits](#/topic/6.4)
- [R.2 Boolean algebra and logic reference](#/topic/R.2)
- [1.3 Arithmetic, relational and Boolean operators](#/topic/1.3)
- [5.8 Compression and encryption](#/topic/5.8) — XOR in the Vernam cipher
:::

*/});
