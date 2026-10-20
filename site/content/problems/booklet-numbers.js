/* Python coding practice: A level Programming Booklet, Part 2 – Numbers
   Exercises from the class programming booklet, made precise enough to test automatically.
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "bk-arithmetic-quiz",
    title: "Primary school arithmetic quiz (booklet)",
    topic: "1.4",
    difficulty: 2,
    task: `A primary school teacher wants a program to test her students' basic arithmetic. It generates random questions (2 numbers only) using addition, subtraction, multiplication and division. It asks for the student's name and then asks ten questions, says whether each answer is correct, and gives a final score at the end.

So that every student in a class gets the same questions (and so the program can be tested), the teacher gives out a **quiz number**, which is used as the random **seed**.

1. Ask for the student's name, then the quiz number (a whole number). Call \`random.seed(quiz_number)\`.
2. For each of the 10 questions, generate it with **exactly these three calls, in this order**:
   \`\`\`python
   op = random.choice("+-*/")
   a = random.randint(1, 12)
   b = random.randint(1, 12)
   \`\`\`
   - \`+\` and \`*\`: the question is \`a + b\` or \`a * b\`.
   - \`-\`: if \`a\` is smaller than \`b\`, swap them first so the answer is never negative.
   - \`/\`: so that the answer is a whole number, the question is \`(a × b) / b\` and the answer is \`a\`.
3. **Print** the question (not in the \`input\` prompt, which isn't part of the output) as \`Question <n>: <x> <op> <y> = ?\`, then read the answer (you may assume a whole number is entered).
4. Output \`Correct\`, or \`Wrong, the answer was <answer>\`.
5. At the end output \`<name>, you scored <score> out of 10\`.

\`\`\`text
What is your name? Sam
Quiz number: 1
Question 1: 10 - 2 = ?
Your answer: 8
Correct
Question 2: 2 * 8 = ?
Your answer: 15
Wrong, the answer was 16
...
Sam, you scored 9 out of 10
\`\`\``,
    starter: `import random

name = input("What is your name? ")
quiz_number = int(input("Quiz number: "))
random.seed(quiz_number)
score = 0
`,
    tests: [
      { name: "quiz 1, all correct", input: "Sam\n1\n8\n16\n8\n4\n1\n10\n5\n8\n1\n20\n", expect: "Question 1: 10 - 2 = ?\nCorrect\nQuestion 2: 2 * 8 = ?\nCorrect\nQuestion 3: 88 / 11 = ?\nCorrect\nQuestion 4: 8 / 2 = ?\nCorrect\nQuestion 5: 7 / 7 = ?\nCorrect\nQuestion 6: 10 / 1 = ?\nCorrect\nQuestion 7: 60 / 12 = ?\nCorrect\nQuestion 8: 10 - 2 = ?\nCorrect\nQuestion 9: 1 * 1 = ?\nCorrect\nQuestion 10: 11 + 9 = ?\nCorrect\nSam, you scored 10 out of 10" },
      { name: "quiz 7, answering 0 every time", input: "Priya\n7\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n", expect: "Question 1: 3 * 7 = ?\nWrong, the answer was 21\nQuestion 2: 2 + 9 = ?\nWrong, the answer was 11\nQuestion 3: 6 + 10 = ?\nWrong, the answer was 16\nQuestion 4: 9 + 4 = ?\nWrong, the answer was 13\nQuestion 5: 2 + 7 = ?\nWrong, the answer was 9\nQuestion 6: 8 / 4 = ?\nWrong, the answer was 2\nQuestion 7: 9 + 7 = ?\nWrong, the answer was 16\nQuestion 8: 10 + 2 = ?\nWrong, the answer was 12\nQuestion 9: 11 - 11 = ?\nCorrect\nQuestion 10: 10 + 10 = ?\nWrong, the answer was 20\nPriya, you scored 1 out of 10" },
      { name: "quiz 42 (a subtraction that needs swapping)", input: "Alex\n42\n13\n16\n-10\n17\n3\n5\n12\n4\n3\n6\n", expect: "Question 1: 1 + 12 = ?\nCorrect\nQuestion 2: 4 * 4 = ?\nCorrect\nQuestion 3: 12 - 2 = ?\nWrong, the answer was 10\nQuestion 4: 10 + 7 = ?\nCorrect\nQuestion 5: 1 + 2 = ?\nCorrect\nQuestion 6: 9 - 4 = ?\nCorrect\nQuestion 7: 9 + 4 = ?\nWrong, the answer was 13\nQuestion 8: 32 / 8 = ?\nCorrect\nQuestion 9: 1 * 3 = ?\nCorrect\nQuestion 10: 30 / 5 = ?\nCorrect\nAlex, you scored 8 out of 10", hidden: true },
      { name: "quiz 2026", input: "Jo\n2026\n15\n14\n9\n10\n9\n7\n9\n11\n2\n43\n", expect: "Question 1: 6 + 9 = ?\nCorrect\nQuestion 2: 4 + 10 = ?\nCorrect\nQuestion 3: 90 / 9 = ?\nWrong, the answer was 10\nQuestion 4: 80 / 8 = ?\nCorrect\nQuestion 5: 10 - 1 = ?\nCorrect\nQuestion 6: 2 + 5 = ?\nCorrect\nQuestion 7: 8 + 1 = ?\nCorrect\nQuestion 8: 66 / 6 = ?\nCorrect\nQuestion 9: 7 - 5 = ?\nCorrect\nQuestion 10: 6 * 7 = ?\nWrong, the answer was 42\nJo, you scored 8 out of 10", hidden: true }
    ],
    hints: [
      "Put the whole question in a `for question in range(1, 11):` loop and keep a `score` variable that starts at 0.",
      "Make the three random calls in exactly the order given, before the `if` that decides what the question is. Calling them in a different order (or only calling `randint` for some operators) gives different questions from the tests.",
      "For division, change `a` to `a * b` before printing; the answer is then `a // b` (or just the old value of `a`)."
    ],
    solution: `import random

name = input("What is your name? ")
quiz_number = int(input("Quiz number: "))
random.seed(quiz_number)
score = 0
for question in range(1, 11):
    op = random.choice("+-*/")
    a = random.randint(1, 12)
    b = random.randint(1, 12)
    if op == "+":
        answer = a + b
    elif op == "-":
        if a < b:
            a, b = b, a
        answer = a - b
    elif op == "*":
        answer = a * b
    else:
        a = a * b
        answer = a // b
    print("Question " + str(question) + ": " + str(a) + " " + op + " " + str(b) + " = ?")
    reply = int(input("Your answer: "))
    if reply == answer:
        print("Correct")
        score = score + 1
    else:
        print("Wrong, the answer was " + str(answer))
print(name + ", you scored " + str(score) + " out of 10")
`,
    explain: `**Approach.** A counted loop of ten questions, a running score, and selection on the operator.

**Why a seed?** Computers generate *pseudo-random* numbers: a deterministic sequence that looks random, starting from a seed. The same seed always gives the same sequence, which is how a teacher could give the whole class the same quiz, and how the tests can predict your questions. Without \`random.seed\`, Python seeds from the clock and each run differs.

**Changes from the booklet.** The booklet just says "generate random questions". To make it testable, the random calls are fixed and the quiz number is added. Two sensible rules for primary pupils were added too: subtraction never goes negative, and division always comes out exactly (the question is built backwards from the answer).

**Common mistakes**
- Putting the question in the \`input()\` prompt only. It works on screen, but the tests (like an exam's evidence screenshot) need the question to be output.
- Using \`a / b\` for the answer: \`/\` gives a float (\`8.0\`), and \`8 == 8.0\` is \`True\`, but printing it shows \`8.0\`.
- Calling \`random.randint\` inside each branch, so the number of random calls depends on the operator and the sequence drifts.`
  },
  {
    id: "bk-logic-gates",
    title: "Logic gate calculator (booklet)",
    topic: "6.4",
    difficulty: 1,
    task: `Write a program that gives students the answer to logic gate questions. It should work for the logic gates \`OR\`, \`AND\`, \`XOR\`, \`NAND\` and \`NOR\`.

- Ask for the logic gate. Accept it in upper or lower case. If it isn't one of the five gates, output \`Unknown logic gate\` and ask for the gate again.
- Then ask for the first input and the second input (you may assume each is \`0\` or \`1\`).
- Output \`Result = \` followed by the output of the gate.

\`\`\`text
Enter logic gate : OR
Enter first input : 1
Enter second input : 0
Result = 1
\`\`\``,
    tests: [
      { name: "example from the question", input: "OR\n1\n0\n", expect: "Result = 1" },
      { name: "AND 1 1", input: "AND\n1\n1\n", expect: "Result = 1" },
      { name: "XOR 1 1", input: "XOR\n1\n1\n", expect: "Result = 0" },
      { name: "NAND 1 1", input: "NAND\n1\n1\n", expect: "Result = 0", hidden: true },
      { name: "NOR 0 0", input: "NOR\n0\n0\n", expect: "Result = 1", hidden: true },
      { name: "lower case gate name", input: "xor\n0\n1\n", expect: "Result = 1", hidden: true },
      { name: "AND 1 0", input: "AND\n1\n0\n", expect: "Result = 0", hidden: true },
      { name: "unknown gates first", input: "NOT\nXNOR\nnand\n0\n1\n", expect: "Unknown logic gate\nUnknown logic gate\nResult = 1", hidden: true },
      { name: "OR 0 0", input: "OR\n0\n0\n", expect: "Result = 0", hidden: true }
    ],
    hints: [
      "Read the gate with `.upper()` so `xor` and `XOR` are treated the same. Use a `while` loop that keeps asking until the gate is in the list `[\"OR\", \"AND\", \"XOR\", \"NAND\", \"NOR\"]`.",
      "Convert the inputs to integers. AND is 1 only when both are 1; OR is 1 when at least one is 1; XOR is 1 when they are different.",
      "NAND and NOR are just AND and OR with the answer inverted: `1 - result`."
    ],
    solution: `GATES = ["OR", "AND", "XOR", "NAND", "NOR"]

gate = input("Enter logic gate : ").upper()
while gate not in GATES:
    print("Unknown logic gate")
    gate = input("Enter logic gate : ").upper()
a = int(input("Enter first input : "))
b = int(input("Enter second input : "))

if gate == "AND" or gate == "NAND":
    if a == 1 and b == 1:
        result = 1
    else:
        result = 0
elif gate == "OR" or gate == "NOR":
    if a == 1 or b == 1:
        result = 1
    else:
        result = 0
else:
    if a != b:
        result = 1
    else:
        result = 0

if gate == "NAND" or gate == "NOR":
    result = 1 - result
print("Result = " + str(result))
`,
    explain: `**Approach.** Validate the gate name with a loop, then use selection. NAND and NOR are the inverses of AND and OR, so compute AND/OR first and invert at the end (\`1 - result\` turns 1 into 0 and 0 into 1).

**Other ways.** Python's bitwise operators work directly on 0 and 1: \`a & b\` (AND), \`a | b\` (OR), \`a ^ b\` (XOR). A dictionary of truth tables keyed by gate name is another neat approach.

**Check your truth tables.**

| A | B | AND | OR | XOR | NAND | NOR |
|---|---|-----|----|-----|------|-----|
| 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 | 1 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |

**Common mistakes**
- \`not a\` gives \`True\`/\`False\`, not \`1\`/\`0\`, so printing it shows \`Result = False\`.
- Comparing the strings \`"1"\` and \`"0"\` without converting, then using arithmetic on them.`
  },
  {
    id: "bk-array-of-multiples",
    title: "Array of multiples (booklet)",
    topic: "2.1",
    difficulty: 1,
    task: `Create a **function** \`ArrayOfMultiples(num, length)\` that takes two numbers as arguments and **returns** a list (array) of multiples of \`num\`, starting with \`num\` itself, until the list's length reaches \`length\`.

If \`length\` is 0, return an empty list.

Your code should only define the function. Examples:

\`\`\`python
print(ArrayOfMultiples(7, 5))     # [7, 14, 21, 28, 35]
print(ArrayOfMultiples(12, 10))   # [12, 24, 36, 48, 60, 72, 84, 96, 108, 120]
print(ArrayOfMultiples(17, 6))    # [17, 34, 51, 68, 85, 102]
\`\`\``,
    starter: `def ArrayOfMultiples(num, length):
    multiples = []

    return multiples
`,
    tests: [
      { name: "7, 5", code: "print(ArrayOfMultiples(7, 5))", expect: "[7, 14, 21, 28, 35]" },
      { name: "12, 10", code: "print(ArrayOfMultiples(12, 10))", expect: "[12, 24, 36, 48, 60, 72, 84, 96, 108, 120]" },
      { name: "17, 6", code: "print(ArrayOfMultiples(17, 6))", expect: "[17, 34, 51, 68, 85, 102]" },
      { name: "length 1", code: "print(ArrayOfMultiples(5, 1))", expect: "[5]", hidden: true },
      { name: "length 0", code: "print(ArrayOfMultiples(3, 0))", expect: "[]", hidden: true },
      { name: "negative number", code: "print(ArrayOfMultiples(-2, 4))", expect: "[-2, -4, -6, -8]", hidden: true },
      { name: "a long list", code: "r = ArrayOfMultiples(3, 100)\nprint(len(r), r[0], r[-1])", expect: "100 3 300", hidden: true }
    ],
    hints: [
      "Start with an empty list and loop `for i in range(1, length + 1):`.",
      "Each time round, `multiples.append(num * i)`."
    ],
    solution: `def ArrayOfMultiples(num, length):
    multiples = []
    for i in range(1, length + 1):
        multiples.append(num * i)
    return multiples
`,
    explain: `**Approach.** A counted loop from 1 to \`length\`, appending \`num × i\` each time. The loop runs exactly \`length\` times, so the list has the right length, and \`range(1, 1)\` is empty, so length 0 gives \`[]\` with no special case.

**Other ways.** A list comprehension: \`[num * i for i in range(1, length + 1)]\`. Or keep a running total and add \`num\` each time, which is how you'd do it without multiplication.

**Common mistakes**
- \`range(length)\` starts at 0, giving \`[0, 7, 14, ...]\`.
- \`range(1, length)\` stops one short.
- Printing the list inside the function instead of returning it.`
  },
  {
    id: "bk-gcd",
    title: "Greatest common divisor (booklet)",
    topic: "1.5",
    difficulty: 2,
    task: `Write a **function** \`gcd(a, b)\` that **returns** the greatest common divisor (GCD) of two positive integers: the largest whole number that divides exactly into both.

Don't use \`math.gcd\`. One hidden test uses very large numbers, so trying every possible divisor one by one will be too slow: use **Euclid's algorithm** (see the hints).

Your code should only define the function. Examples:

\`\`\`python
print(gcd(32, 8))    # 8
print(gcd(8, 12))    # 4
print(gcd(17, 13))   # 1
\`\`\``,
    starter: `def gcd(a, b):
    return 1
`,
    tests: [
      { name: "gcd(32, 8)", code: "print(gcd(32, 8))", expect: "8" },
      { name: "gcd(8, 12)", code: "print(gcd(8, 12))", expect: "4" },
      { name: "gcd(17, 13)", code: "print(gcd(17, 13))", expect: "1" },
      { name: "equal numbers", code: "print(gcd(12, 12))", expect: "12", hidden: true },
      { name: "one of them is 1", code: "print(gcd(1, 999))", expect: "1", hidden: true },
      { name: "gcd(1071, 462)", code: "print(gcd(1071, 462))", expect: "21", hidden: true },
      { name: "very large numbers", code: "print(gcd(2 ** 40, 6 ** 20))", expect: "1048576", hidden: true }
    ],
    hints: [
      "Euclid's algorithm: while `b` is not 0, replace `(a, b)` with `(b, a % b)`. When `b` reaches 0, the answer is `a`.",
      "In Python you can update both at once: `a, b = b, a % b`. Otherwise use a temporary variable.",
      "It can also be written recursively: `gcd(a, b)` is `a` if `b == 0`, otherwise `gcd(b, a % b)`."
    ],
    solution: `def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a
`,
    explain: `**Approach: Euclid's algorithm.** Any number that divides both \`a\` and \`b\` also divides \`a % b\` (the remainder), so gcd(a, b) = gcd(b, a mod b). The numbers shrink quickly and when the remainder is 0 the other number is the answer.

**Trace of gcd(1071, 462):**

| a | b | a % b |
|---|---|---|
| 1071 | 462 | 147 |
| 462 | 147 | 21 |
| 147 | 21 | 0 |
| 21 | 0 | |

**Why not try every divisor?** Counting down from the smaller number works for small inputs but for \`gcd(2 ** 40, 6 ** 20)\` it would need over a trillion steps. Euclid's algorithm needs a number of steps proportional to the number of *digits*, so it finishes instantly. (The order of \`a\` and \`b\` doesn't matter: if \`a < b\`, the first step just swaps them.)

**Common mistake.** Updating one variable before using its old value: \`a = b\` then \`b = a % b\` uses the *new* \`a\`. Use simultaneous assignment or a temporary variable.`
  }
]);
