CS.registerTopic({ id: "3.3", title: "Reverse Polish notation" }, function () {/*

:::objectives
- Explain the difference between **infix**, **prefix (Polish)** and **postfix (Reverse Polish)** notation.
- Convert simple **infix → RPN** by bracketing, by an expression tree, and with an **operator stack** (shunting-yard).
- Convert **RPN → infix** using a stack.
- **Evaluate** an RPN expression with a stack, showing the stack after every token.
- Explain **why** RPN is used (no brackets, no precedence rules, one left-to-right pass with a stack) and **where** (compilers, stack machines, bytecode, some calculators).
:::

:::quick At a glance
- **Infix**: operator *between* operands, `3 + 4`. Needs brackets and precedence (BIDMAS).
- **RPN / postfix**: operator *after* its operands, `3 4 +`. **No brackets, no precedence rules needed.**
- **Evaluate RPN**: read left to right. Operand → **push**. Operator → **pop two**, apply (**second popped is the left operand**), **push the result**. The answer is the last item on the stack.
- **Infix → RPN**: operands go straight to the output **in the same order**; operators wait on a stack and are output when a lower-or-equal precedence operator or a `)` arrives; pop everything left at the end.
- RPN = **post-order** traversal of the expression tree.
- Used by compilers/interpreters to generate stack-based code (e.g. Java bytecode on the JVM operand stack), stack-based languages (PostScript, Forth) and HP calculators.
:::

:::keyterms
Infix notation :: A notation in which each binary operator is written between its two operands, e.g. 3 + 4. :: The normal way humans write sums.
Reverse Polish notation (RPN) :: A postfix notation in which each operator follows its operands, so that no brackets are needed, e.g. 3 4 +. :: The operator comes after the numbers.
Postfix notation :: Another name for Reverse Polish notation. :: Same thing as RPN.
Prefix (Polish) notation :: A notation in which each operator precedes its operands, e.g. + 3 4. :: The operator comes first.
Operand :: A value (or variable) that an operator acts on. :: The numbers.
Operator :: A symbol for an operation to be carried out on operands, e.g. + − × ÷ ^. :: The maths symbols.
Operator precedence :: The rules that decide which operator is applied first in infix notation when there are no brackets. :: BIDMAS.
Shunting-yard algorithm :: Dijkstra's algorithm for converting infix to postfix, using a stack to hold operators until they can be output. :: The operator-stack method.
:::

## Three ways to write the same calculation

| Infix | Prefix (Polish) | Postfix (Reverse Polish) |
|---|---|---|
| `3 + 4` | `+ 3 4` | `3 4 +` |
| `(5 + 6) * 3` | `* + 5 6 3` | `5 6 + 3 *` |
| `5 + 6 * 3` | `+ 5 * 6 3` | `5 6 3 * +` |
| `(10 - 5) * (5 + 4)` | `* - 10 5 + 5 4` | `10 5 - 5 4 + *` |

Two things to notice:

- The **operands stay in the same order** in every notation. Only the operators move.
- The second and third rows have **different meanings in infix only because of brackets**. In RPN they are simply different sequences; there is no ambiguity, so brackets are never needed.

:::why Why bother with RPN?
- **No brackets** and **no precedence rules**: the order of the tokens *is* the order of evaluation.
- It can be evaluated in **one left-to-right pass** using a **stack**, with no backtracking or look-ahead. That is simple and fast for a machine.
- It maps directly onto **stack-based machine code**: `push 5, push 6, add, push 3, multiply`. Compilers and interpreters convert infix expressions in source code to postfix form when they generate code; the Java Virtual Machine's bytecode and Python's bytecode both work on an operand stack this way.
- Humans prefer infix because we were taught it and can see the structure; machines prefer postfix because it removes the parsing problem.
:::

:::trap
Your RPN textbook answer says postfix is used because "the operators are placed in one register and the operands in another". That is **not** a reason you can give for marks. The creditworthy reasons are: **no brackets needed, no need for precedence rules, can be evaluated left to right using a stack, simpler/faster for a computer (interpreter/compiler) to evaluate**.
:::

## Evaluating RPN with a stack

:::steps The evaluation algorithm
1. Read the next token, left to right.
2. If it is an **operand**, **push** it.
3. If it is an **operator**, **pop** the top item (this is the **right** operand), **pop** again (this is the **left** operand), calculate `left operator right` and **push** the result.
4. When there are no tokens left, the single item on the stack is the answer.
:::

:::example Evaluate `5 1 2 + 4 * + 3 -`
| Token | Action | Stack (bottom → top) |
|---|---|---|
| 5 | push | 5 |
| 1 | push | 5, 1 |
| 2 | push | 5, 1, 2 |
| + | pop 2, pop 1; `1 + 2 = 3`; push | 5, 3 |
| 4 | push | 5, 3, 4 |
| * | pop 4, pop 3; `3 × 4 = 12`; push | 5, 12 |
| + | pop 12, pop 5; `5 + 12 = 17`; push | 17 |
| 3 | push | 17, 3 |
| - | pop 3, pop 17; `17 − 3 = 14`; push | 14 |

**Result: 14.** The equivalent infix is `5 + (1 + 2) * 4 - 3`.
:::

:::trap Order of operands
For `-` and `/` the order matters. The **first** item popped is the **right-hand** operand. `8 2 -` pops 2 then 8 and calculates `8 − 2 = 6`, not `2 − 8`. A quick check: the operands must stay in their **original left-to-right order**.
:::

::::tabs
:::tab AQA pseudocode
```pseudocode
SUBROUTINE evaluateRPN(tokens)
    stack ← empty stack
    FOR EACH token IN tokens
        IF token is an operand THEN
            push(token)
        ELSE
            right ← pop()
            left ← pop()
            IF token = "+" THEN push(left + right) ENDIF
            IF token = "-" THEN push(left - right) ENDIF
            IF token = "*" THEN push(left * right) ENDIF
            IF token = "/" THEN push(left / right) ENDIF
        ENDIF
    ENDFOR
    RETURN pop()
ENDSUBROUTINE
```
:::
:::tab Python
```python
def evaluate_rpn(expression):
    stack = []
    for token in expression.split():
        if token in ("+", "-", "*", "/", "^"):
            right = stack.pop()          # first pop = right operand
            left = stack.pop()
            if token == "+": stack.append(left + right)
            elif token == "-": stack.append(left - right)
            elif token == "*": stack.append(left * right)
            elif token == "/": stack.append(left / right)
            else: stack.append(left ** right)
        else:
            stack.append(float(token))
        print(f"{token:>4}  stack: {stack}")
    return stack.pop()

print(evaluate_rpn("5 1 2 + 4 * + 3 -"))   # 14.0
```
:::
::::

Each token is handled once with a constant number of stack operations, so evaluation is **O(n)** for n tokens.

{{trace:3.3-2}}

## Converting infix → RPN

### Method 1: bracket and move (quick by hand)

1. Fully bracket the expression according to precedence: `7 + 8 * 6` → `(7 + (8 * 6))`.
2. Move each operator to just before its closing bracket: `(7 (8 6 *) +)`.
3. Delete the brackets: **`7 8 6 * +`**.

### Method 2: expression tree

Draw the expression tree (operators at internal nodes, operands at leaves), then do a **post-order** traversal. See [3.2 Tree traversal](#/topic/3.2).

### Method 3: the operator stack (shunting-yard)

This is the algorithm a compiler uses, and the one on your class slides.

:::steps Shunting-yard rules (left-to-right)
1. **Operand** → write it straight to the **output**.
2. **`(`** → push it onto the operator stack.
3. **`)`** → pop operators to the output until you reach `(`; pop and discard the `(`.
4. **Operator** → while the top of the stack is an operator of **higher or equal** precedence (and not `(`), pop it to the output. Then push the new operator.
5. **End of expression** → pop all remaining operators to the output.
:::

Precedence: `^` highest, then `*` `/`, then `+` `-`. (`^` is right-associative, so for `^` only pop strictly higher.)

:::example Class-slide example: `((300 + 23) * (43 - 21)) / (84 + 21)`
| Token | Rule | Operator stack (bottom → top) | Output |
|---|---|---|---|
| ( | push | ( | |
| ( | push | ( ( | |
| 300 | operand | ( ( | 300 |
| + | push | ( ( + | 300 |
| 23 | operand | ( ( + | 300 23 |
| ) | pop to `(` | ( | 300 23 + |
| * | push | ( * | 300 23 + |
| ( | push | ( * ( | 300 23 + |
| 43 | operand | ( * ( | 300 23 + 43 |
| - | push | ( * ( - | 300 23 + 43 |
| 21 | operand | ( * ( - | 300 23 + 43 21 |
| ) | pop to `(` | ( * | 300 23 + 43 21 - |
| ) | pop to `(` | (empty) | 300 23 + 43 21 - * |
| / | push | / | 300 23 + 43 21 - * |
| ( | push | / ( | … |
| 84 | operand | / ( | … 84 |
| + | push | / ( + | … 84 |
| 21 | operand | / ( + | … 84 21 |
| ) | pop to `(` | / | 300 23 + 43 21 - * 84 21 + |
| end | pop all | (empty) | **300 23 + 43 21 - * 84 21 + /** |

Check by evaluating: `323 × 22 = 7106`, `84 + 21 = 105`, `7106 ÷ 105 ≈ 67.68`, the same as the infix.
:::

The slide example never needed rule 4 because every operator was inside brackets. This one does:

:::example `3 + 4 * 2` and `4 * 7 + 12`
**`3 + 4 * 2`**: `+` is pushed. When `*` arrives the top is `+` (lower precedence), so nothing is popped and `*` is pushed on top. At the end pop `*` then `+`. Output: **`3 4 2 * +`** (= 11).

**`4 * 7 + 12`**: `*` is pushed. When `+` arrives the top is `*` (**higher**), so `*` is popped to the output first, then `+` is pushed. Output: **`4 7 * 12 +`** (= 40).
:::

::::tabs
:::tab Python: shunting-yard
```python
PREC = {"^": 3, "*": 2, "/": 2, "+": 1, "-": 1}

def to_rpn(infix):
    output, ops = [], []
    for tok in infix.replace("(", " ( ").replace(")", " ) ").split():
        if tok == "(":
            ops.append(tok)
        elif tok == ")":
            while ops[-1] != "(":
                output.append(ops.pop())
            ops.pop()                                  # discard "("
        elif tok in PREC:
            while ops and ops[-1] != "(" and (PREC[ops[-1]] > PREC[tok] or
                    (PREC[ops[-1]] == PREC[tok] and tok != "^")):
                output.append(ops.pop())
            ops.append(tok)
        else:
            output.append(tok)                         # operand
    while ops:
        output.append(ops.pop())
    return " ".join(output)

print(to_rpn("((300 + 23) * (43 - 21)) / (84 + 21)"))  # 300 23 + 43 21 - * 84 21 + /
print(to_rpn("(a + b) * c - d / e"))                   # a b + c * d e / -
print(to_rpn("3 + 4 * 2"))                             # 3 4 2 * +
```
:::
::::

{{trace:3.3-1}}

## Converting RPN → infix

Use the evaluation algorithm, but push **expressions** instead of numbers. When an operator arrives, pop the right and left expressions and push `(left operator right)`.

:::example `2 3 * 4 5 / -` → infix
| Token | Stack (bottom → top) |
|---|---|
| 2 | 2 |
| 3 | 2, 3 |
| * | (2 * 3) |
| 4 | (2 * 3), 4 |
| 5 | (2 * 3), 4, 5 |
| / | (2 * 3), (4 / 5) |
| - | ((2 * 3) - (4 / 5)) |

Answer: **`(2 * 3) - (4 / 5)`** (outer brackets dropped). Remove brackets only where precedence makes them redundant; when in doubt, keep them.
:::

:::trap
- A valid RPN expression with only binary operators always has **exactly one more operand than operators**. Your RPN textbook asks you to convert `24 6 / 3 2 + 2 /`, which has five operands but only three operators: evaluating it leaves **two** values on the stack, so it is not a complete expression. The textbook's answer "(24 / 6) / (3 + 2)" does not match it. The class-slide version `24 6 / 3 2 + 2 / +` is complete and equals `24 / 6 + (3 + 2) / 2 = 6.5`.
- Never reorder the operands when converting: `8 2 -` is `8 - 2`, not `2 - 8`.
:::

## Try it: RPN tool

Type an infix expression to watch the operator stack and output build up, or type RPN to watch it being evaluated.

{{tool:rpn-tool}}

:::collapse Answers to the class and ZigZag practice questions
**RPN → infix**: `4 6 +` = `4 + 6` · `8 2 -` = `8 - 2` · `4 9 + 6 *` = `(4 + 9) * 6` · `10 4 7 + *` = `10 * (4 + 7)` = 110 · `3 9 + 4 2 - *` = `(3 + 9) * (4 - 2)` = 24 · `12 4 / 2 +` = `12 / 4 + 2` = 5 · `4 4 * 2 2 * +` = `4 * 4 + 2 * 2` = 20 · `24 6 / 3 2 + 2 / +` = `24 / 6 + (3 + 2) / 2` = 6.5.

**Infix → RPN**: `4 + 3` = `4 3 +` · `56 - 40` = `56 40 -` · `5 * (5 - 3)` = `5 5 3 - *` · `(6 / 3) + (6 + 2)` = `6 3 / 6 2 + +` · `(18 - 8) * (30 + 20)` = `18 8 - 30 20 + *` · `3 * (4 - 2)` = `3 4 2 - *` · `(3 - 4) * 2` = `3 4 - 2 *` · `(5 * 4) - 3` = `5 4 * 3 -` · `(6 * 3) / (2 + 4)` = `6 3 * 2 4 + /`.

**Evaluate**: `3 4 + 2 *` = 14 · `4 7 * 12 +` = 40.
:::

:::exam
- **Convert** questions are usually 1 mark each and all-or-nothing. Check your answer by evaluating both versions with simple numbers.
- **"Evaluate using a stack" / "show the stack contents"**: draw the stack after **every** token. Marks are for the intermediate states, not just the answer.
- **"Explain why RPN is used"** (2–3 marks): no brackets; no precedence rules; evaluated left to right using a stack; simpler for an interpreter/compiler; maps to stack-based instructions.
- **"Where is it used"**: compilers/interpreters generating code for expressions, stack machines/bytecode (JVM), PostScript, some calculators.
:::

:::challenge
1. Extend the Python evaluator to reject invalid RPN (too few operands for an operator, or more than one value left at the end).
2. Convert `2 ^ 3 ^ 2` to RPN. Why must `^` be treated as right-associative? (Answer: `2 3 2 ^ ^` = 512.)
3. Write an RPN → fully bracketed infix converter in Python.
4. Convert `7 + 8 * 3 ^ 2 + 4` to RPN and evaluate it (Isaac's example: `7 8 3 2 ^ * + 4 +` = 83).
:::

:::recap
- Infix `a + b`, prefix `+ a b`, postfix/RPN `a b +`. Operands never change order.
- RPN needs **no brackets and no precedence rules** and is evaluated left to right with a **stack**.
- Evaluate: operand → push; operator → pop right, pop left, push `left op right`.
- Infix → RPN: bracket-and-move, expression tree post-order, or the operator stack (shunting-yard).
- Shunting-yard: operands to output; `(` push; `)` pop to `(`; operator pops higher-or-equal first; pop all at end.
- Used in compilers/interpreters, stack machines and bytecode, stack-based languages, some calculators.
:::

:::related
- [2.3 Stacks](#/topic/2.3)
- [3.2 Tree traversal](#/topic/3.2) — expression trees and post-order
- [6.3 Program translators](#/topic/6.3) — compilers and interpreters
:::

*/});
