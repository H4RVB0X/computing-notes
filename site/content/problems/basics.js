/* Python coding practice: basics — selection, iteration, validation loops
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "digit-sum",
    title: "Digit sum",
    topic: "1.2",
    difficulty: 1,
    task: `Write a program that:

- asks the user to enter a whole number that is zero or more (prompt \`Enter a number: \`)
- outputs the **sum of its digits** on its own line.

Use arithmetic (\`% 10\` gives the last digit, \`// 10\` removes it) inside a loop. You may assume the input is a valid whole number ≥ 0.

\`\`\`text
Enter a number: 4072
13
\`\`\``,
    starter: `number = int(input("Enter a number: "))
total = 0
# add each digit of number to total here

print(total)
`,
    tests: [
      { name: "example from the question", input: "4072\n", expect: "13" },
      { name: "three digits", input: "123\n", expect: "6" },
      { name: "single digit", input: "7\n", expect: "7", hidden: true },
      { name: "zero", input: "0\n", expect: "0", hidden: true },
      { name: "all nines", input: "9999\n", expect: "36", hidden: true },
      { name: "zeros in the middle", input: "1000000\n", expect: "1", hidden: true }
    ],
    hints: [
      "`number % 10` is the last digit and `number // 10` is the number with that digit removed.",
      "Loop `while number > 0:` — add `number % 10` to the total, then set `number = number // 10`."
    ],
    solution: `number = int(input("Enter a number: "))
total = 0
while number > 0:
    total = total + number % 10
    number = number // 10
print(total)
`,
    explain: `**Approach.** \`number % 10\` (MOD) is the units digit; \`number // 10\` (DIV) chops it off. Repeat until nothing is left. Each pass moves one digit into the total, so the loop runs once per digit.

**Why \`while\`, not \`for\`?** You don't know in advance how many digits there are, so this is *indefinite iteration* with the condition at the start. For an input of \`0\` the loop never runs and the total correctly stays 0.

**Common mistakes**
- Using \`/\` instead of \`//\`: \`4072 / 10\` is \`407.2\`, so the "digits" become decimals and the total is nonsense.
- Forgetting to convert the input with \`int()\`.

**Alternative.** \`sum(int(d) for d in input())\` also works and would pass these tests, but questions that say "use MOD and DIV" expect the arithmetic method.`
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    topic: "1.2",
    difficulty: 1,
    task: `Write a program that asks for a whole number (prompt \`Enter a limit: \`) and then outputs every whole number from 1 up to and including that limit, one per line, except that:

- multiples of both 3 and 5 are replaced by \`FizzBuzz\`
- other multiples of 3 are replaced by \`Fizz\`
- other multiples of 5 are replaced by \`Buzz\`.

If the limit is less than 1, output nothing.

\`\`\`text
Enter a limit: 6
1
2
Fizz
4
Buzz
Fizz
\`\`\``,
    tests: [
      { name: "example from the question", input: "6\n", expect: "1\n2\nFizz\n4\nBuzz\nFizz" },
      { name: "up to 15", input: "15\n", expect: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
      { name: "limit of 1", input: "1\n", expect: "1", hidden: true },
      { name: "limit of 0 outputs nothing", input: "0\n", expect: "", hidden: true },
      { name: "ends on Buzz", input: "10\n", expect: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz", hidden: true }
    ],
    hints: [
      "`for i in range(1, limit + 1):` includes the limit itself.",
      "Test for FizzBuzz (`i % 15 == 0`, or divisible by 3 **and** 5) **first**, otherwise 15 is caught by the `Fizz` branch."
    ],
    solution: `limit = int(input("Enter a limit: "))
for i in range(1, limit + 1):
    if i % 3 == 0 and i % 5 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
`,
    explain: `**Approach.** A definite loop from 1 to the limit, with an \`if / elif / else\` chain inside it.

**Order matters.** The branches of an \`elif\` chain are tested top to bottom and only the first true one runs. 15 is a multiple of 3, so if the \`Fizz\` test came first, 15 would print \`Fizz\`. Put the most specific condition first.

**Common mistakes**
- \`range(1, limit)\` stops at \`limit − 1\` (off-by-one). "Up to and including" needs \`limit + 1\`.
- Using separate \`if\` statements instead of \`elif\`, which prints two lines for 15.

When the limit is 0 or negative, \`range(1, 1)\` is empty, so nothing is printed with no extra code needed.`
  },
  {
    id: "running-total",
    title: "Running total until zero",
    topic: "1.2",
    difficulty: 1,
    task: `Write a program that repeatedly asks the user to enter a whole number (prompt \`Enter a number (0 to stop): \`) until they enter \`0\`.

When \`0\` is entered, output:

- \`Total: \` followed by the sum of the numbers entered
- \`Count: \` followed by how many numbers were entered (**not** counting the final 0).

Numbers may be negative.

\`\`\`text
Enter a number (0 to stop): 5
Enter a number (0 to stop): 10
Enter a number (0 to stop): 3
Enter a number (0 to stop): 0
Total: 18
Count: 3
\`\`\``,
    tests: [
      { name: "example from the question", input: "5\n10\n3\n0\n", expect: "Total: 18\nCount: 3" },
      { name: "one number", input: "42\n0\n", expect: "Total: 42\nCount: 1" },
      { name: "zero straight away", input: "0\n", expect: "Total: 0\nCount: 0", hidden: true },
      { name: "negative numbers", input: "-4\n4\n2\n0\n", expect: "Total: 2\nCount: 3", hidden: true },
      { name: "total of zero but count of two", input: "7\n-7\n0\n", expect: "Total: 0\nCount: 2", hidden: true }
    ],
    hints: [
      "This is indefinite iteration: you don't know how many numbers will be entered. Use a `while` loop.",
      "Read the first number **before** the loop, and read the next number at the **end** of the loop body, so the 0 is never added or counted."
    ],
    solution: `total = 0
count = 0
number = int(input("Enter a number (0 to stop): "))
while number != 0:
    total = total + number
    count = count + 1
    number = int(input("Enter a number (0 to stop): "))
print("Total: " + str(total))
print("Count: " + str(count))
`,
    explain: `**Approach.** A *sentinel-controlled* loop: the value 0 is a rogue (sentinel) value that means "stop". Read once before the loop, then process-and-read inside it. This pattern makes sure the sentinel itself is never processed.

**Common mistakes**
- Reading the number at the top of the loop and adding it before checking, so the 0 is counted (\`Count: 4\`).
- Using \`while number > 0\`, which stops early when a negative number is entered.
- Concatenating an integer with a string: \`"Total: " + total\` is a \`TypeError\`. Use \`str(total)\` or \`print("Total:", total)\`.

**Exam tip.** AQA questions often say "until the user enters 0" — that is a cue for this read-before-loop pattern (or a \`while True\` loop with \`break\`).`
  },
  {
    id: "leap-year",
    title: "Leap year",
    topic: "1.3",
    difficulty: 1,
    task: `A year is a leap year if it is divisible by 4, **except** years divisible by 100, which are only leap years if they are also divisible by 400.

Write a program that asks for a year (prompt \`Enter a year: \`) and outputs either

- \`<year> is a leap year\` or
- \`<year> is not a leap year\`.

\`\`\`text
Enter a year: 2024
2024 is a leap year
\`\`\``,
    tests: [
      { name: "example from the question", input: "2024\n", expect: "2024 is a leap year" },
      { name: "ordinary year", input: "2023\n", expect: "2023 is not a leap year" },
      { name: "century, not a leap year", input: "1900\n", expect: "1900 is not a leap year", hidden: true },
      { name: "divisible by 400", input: "2000\n", expect: "2000 is a leap year", hidden: true },
      { name: "2100", input: "2100\n", expect: "2100 is not a leap year", hidden: true },
      { name: "1996", input: "1996\n", expect: "1996 is a leap year", hidden: true }
    ],
    hints: [
      "Use the modulus operator: `year % 4 == 0` is true when the year divides exactly by 4.",
      "One Boolean expression does it: `(year % 4 == 0 and year % 100 != 0) or year % 400 == 0`."
    ],
    solution: `year = int(input("Enter a year: "))
if (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:
    print(str(year) + " is a leap year")
else:
    print(str(year) + " is not a leap year")
`,
    explain: `**Approach.** Combine relational and Boolean operators: leap if (divisible by 4 AND NOT divisible by 100) OR divisible by 400.

**Check it with boundary cases.** 2024 ✔, 2023 ✘, 1900 ✘ (century), 2000 ✔ (divisible by 400). Testing only 2024 and 2023 would miss the century rule completely — choose test data that exercises every branch.

**Common mistakes**
- Only checking \`% 4\`, which wrongly makes 1900 a leap year.
- Missing brackets. In Python \`and\` binds tighter than \`or\`, so the brackets here are optional, but writing them shows the examiner your intention.`
  },
  {
    id: "validated-age",
    title: "Validated age",
    topic: "1.2",
    difficulty: 2,
    task: `Write a program that asks the user for their age (prompt \`Enter your age: \`).

The age must be a **whole number from 0 to 120 inclusive**:

- if the input is not a whole number, output \`That is not a whole number\` and ask again
- if it is a whole number outside the range, output \`Age must be between 0 and 120\` and ask again
- keep asking until a valid age is entered.

Then output \`You are <age> years old\` followed, on the next line, by \`Child\` (under 13), \`Teenager\` (13 to 17) or \`Adult\` (18 or over).

\`\`\`text
Enter your age: fifteen
That is not a whole number
Enter your age: 150
Age must be between 0 and 120
Enter your age: 15
You are 15 years old
Teenager
\`\`\``,
    starter: `age = int(input("Enter your age: "))
print("You are " + str(age) + " years old")
`,
    tests: [
      { name: "example from the question", input: "fifteen\n150\n15\n", expect: "That is not a whole number\nAge must be between 0 and 120\nYou are 15 years old\nTeenager" },
      { name: "valid first time", input: "18\n", expect: "You are 18 years old\nAdult" },
      { name: "negative then a decimal", input: "-1\n12.5\n12\n", expect: "Age must be between 0 and 120\nThat is not a whole number\nYou are 12 years old\nChild", hidden: true },
      { name: "lower boundary 0", input: "0\n", expect: "You are 0 years old\nChild", hidden: true },
      { name: "upper boundary 120, just over 121", input: "121\n120\n", expect: "Age must be between 0 and 120\nYou are 120 years old\nAdult", hidden: true },
      { name: "boundary 13 after empty input", input: "\n13\n", expect: "That is not a whole number\nYou are 13 years old\nTeenager", hidden: true },
      { name: "boundary 17", input: "17\n", expect: "You are 17 years old\nTeenager", hidden: true }
    ],
    hints: [
      "Wrap `int(input(...))` in `try ... except ValueError:` so text like `fifteen` does not crash the program.",
      "Use a loop such as `valid = False` / `while not valid:` and only set `valid = True` once the number is in range.",
      "After the loop: `if age < 13` → Child, `elif age < 18` → Teenager, `else` → Adult."
    ],
    solution: `valid = False
while not valid:
    try:
        age = int(input("Enter your age: "))
        if age < 0 or age > 120:
            print("Age must be between 0 and 120")
        else:
            valid = True
    except ValueError:
        print("That is not a whole number")

print("You are " + str(age) + " years old")
if age < 13:
    print("Child")
elif age < 18:
    print("Teenager")
else:
    print("Adult")
`,
    explain: `**Approach.** Two kinds of validation are needed: a **type check** (\`int()\` raises \`ValueError\` for \`fifteen\`, \`12.5\` or an empty string, which \`except\` catches) and a **range check**. Both live inside a loop so the user is asked *again* until the input is valid.

**Why a loop?** A single \`if\` only checks once; the second bad value would get through. Mark schemes give a separate mark for "validation repeated until valid".

**Boundaries.** Test 0, 120, −1 and 121 as well as normal values; 13 and 17/18 are the boundaries of the categories. \`age < 13\` then \`elif age < 18\` handles them without overlapping.

**Common mistakes**
- Putting the range check outside \`try\`, or catching every exception with a bare \`except:\` (hides real bugs).
- Writing \`if 0 < age < 120\` — that rejects the valid boundaries 0 and 120.`
  },
  {
    id: "guess-the-number",
    title: "Two-player guess the number",
    topic: "1.2",
    difficulty: 2,
    task: `Write a two-player guessing game.

1. Player 1 enters a secret number (prompt \`Player 1, enter the secret number: \`). It must be from 1 to 100; if it isn't, output \`Must be between 1 and 100\` and ask again. (You may assume whole numbers are entered.)
2. Player 2 then has **up to 7 guesses** (prompt \`Guess: \`). After each wrong guess output \`Too high\` or \`Too low\`.
3. If player 2 guesses correctly, output \`Correct! Guesses used: <n>\` and stop.
4. If the 7th guess is wrong, output (after its \`Too high\`/\`Too low\`) \`Out of guesses! The number was <secret>\`.

\`\`\`text
Player 1, enter the secret number: 42
Guess: 50
Too high
Guess: 25
Too low
Guess: 42
Correct! Guesses used: 3
\`\`\``,
    tests: [
      { name: "example from the question", input: "42\n50\n25\n42\n", expect: "Too high\nToo low\nCorrect! Guesses used: 3" },
      { name: "secret out of range first", input: "0\n101\n7\n7\n", expect: "Must be between 1 and 100\nMust be between 1 and 100\nCorrect! Guesses used: 1" },
      { name: "runs out of guesses", input: "1\n50\n40\n30\n20\n10\n5\n2\n", expect: "Too high\nToo high\nToo high\nToo high\nToo high\nToo high\nToo high\nOut of guesses! The number was 1", hidden: true },
      { name: "correct on the 7th guess", input: "64\n1\n2\n3\n4\n5\n6\n64\n", expect: "Too low\nToo low\nToo low\nToo low\nToo low\nToo low\nCorrect! Guesses used: 7", hidden: true },
      { name: "boundary 100", input: "100\n100\n", expect: "Correct! Guesses used: 1", hidden: true }
    ],
    hints: [
      "Validate the secret with a `while secret < 1 or secret > 100:` loop that prints the message and asks again.",
      "Use a counter for guesses and a Boolean `found`. Loop `while not found and guesses < 7:`.",
      "After the loop, if `found` is still False, print the out-of-guesses message."
    ],
    solution: `secret = int(input("Player 1, enter the secret number: "))
while secret < 1 or secret > 100:
    print("Must be between 1 and 100")
    secret = int(input("Player 1, enter the secret number: "))

guesses = 0
found = False
while not found and guesses < 7:
    guess = int(input("Guess: "))
    guesses = guesses + 1
    if guess == secret:
        found = True
    elif guess > secret:
        print("Too high")
    else:
        print("Too low")

if found:
    print("Correct! Guesses used: " + str(guesses))
else:
    print("Out of guesses! The number was " + str(secret))
`,
    explain: `**Approach.** Two loops in sequence: a validation loop for the secret, then a game loop with **two** stopping conditions (guessed it, or used 7 guesses). A Boolean flag records *why* the loop ended so the right message is printed afterwards.

**Edge cases.** Guessing correctly on the 7th go must count as a win, so the check for \`guess == secret\` happens before the loop condition is re-tested. The hidden tests check exactly this and the 1/100 boundaries.

**Common mistakes**
- \`while guesses <= 7\` gives 8 guesses (off-by-one).
- Printing \`Out of guesses\` inside the loop after every wrong guess.
- Using \`random.randint\` — fine in a real game, but this question has player 1 choose the number so it can be tested.`
  },
  {
    id: "menu-calculator",
    title: "Menu-driven calculator",
    topic: "1.2",
    difficulty: 2,
    task: `Write a menu-driven calculator. Repeatedly:

1. display a menu (any layout you like — the tests only check the result lines):
   \`1 Add\`, \`2 Subtract\`, \`3 Multiply\`, \`4 Divide\`, \`5 Quit\`
2. ask for a choice (prompt \`Choose an option: \`).

- For options 1–4, ask for two whole numbers (prompts \`First number: \` and \`Second number: \`) and output \`Result: <answer>\`. Divide means **integer division** (\`//\`). If the second number is 0 for a divide, output \`Cannot divide by zero\` instead.
- For option 5, output \`Goodbye\` and stop.
- For anything else, output \`Invalid option\` and show the menu again.

\`\`\`text
1 Add
2 Subtract
3 Multiply
4 Divide
5 Quit
Choose an option: 1
First number: 3
Second number: 4
Result: 7
1 Add
...
Choose an option: 5
Goodbye
\`\`\``,
    match: "contains",
    tests: [
      { name: "example from the question", input: "1\n3\n4\n5\n", expect: "Result: 7\nGoodbye" },
      { name: "multiply negative then divide", input: "3\n-2\n6\n4\n7\n2\n5\n", expect: "Result: -12\nResult: 3\nGoodbye" },
      { name: "divide by zero and an invalid option", input: "4\n5\n0\n9\n2\n10\n4\n5\n", expect: "Cannot divide by zero\nInvalid option\nResult: 6\nGoodbye", hidden: true },
      { name: "quit straight away", input: "5\n", expect: "Goodbye", hidden: true },
      { name: "text is an invalid option", input: "add\n\n2\n8\n8\n5\n", expect: "Invalid option\nInvalid option\nResult: 0\nGoodbye", hidden: true }
    ],
    hints: [
      "Read the choice as a **string** (`choice = input(...)`) and compare with `\"1\"`, `\"2\"`… so text like `add` doesn't crash the program.",
      "A `while True:` loop with `break` after `Goodbye`, or a `while choice != \"5\":` loop, both work.",
      "Only ask for the two numbers when the choice is 1, 2, 3 or 4."
    ],
    solution: `choice = ""
while choice != "5":
    print("1 Add")
    print("2 Subtract")
    print("3 Multiply")
    print("4 Divide")
    print("5 Quit")
    choice = input("Choose an option: ")
    if choice in ["1", "2", "3", "4"]:
        a = int(input("First number: "))
        b = int(input("Second number: "))
        if choice == "1":
            print("Result: " + str(a + b))
        elif choice == "2":
            print("Result: " + str(a - b))
        elif choice == "3":
            print("Result: " + str(a * b))
        elif b == 0:
            print("Cannot divide by zero")
        else:
            print("Result: " + str(a // b))
    elif choice == "5":
        print("Goodbye")
    else:
        print("Invalid option")
`,
    explain: `**Approach.** A loop that keeps showing the menu until the quit option is chosen, with selection inside it. Keeping the choice as a string means *any* input is handled safely; only valid options lead to numbers being read.

**Why check \`b == 0\` first?** \`a // 0\` raises \`ZeroDivisionError\` and crashes the program. Validate before you divide.

**Common mistakes**
- \`int(input(...))\` for the menu choice: typing \`add\` crashes the program.
- Asking for the two numbers before checking the option, so \`Invalid option\` or \`Quit\` still asks for numbers.
- Using \`/\`, which gives \`3.5\` rather than \`3\`.

These tests use *contains* matching: your menu text can look however you like, but each result line must appear in order.`
  },
  {
    id: "trace-halving",
    title: "Trace then implement: halving steps",
    topic: "1.2",
    difficulty: 1,
    task: `Here is an algorithm in AQA pseudocode.

\`\`\`pseudocode
Number ← USERINPUT
Steps ← 0
WHILE Number > 1
  IF Number MOD 2 = 0 THEN
    Number ← Number DIV 2
  ELSE
    Number ← Number - 1
  ENDIF
  Steps ← Steps + 1
  OUTPUT Number
ENDWHILE
OUTPUT "Steps: " + Steps
\`\`\`

**(a)** On paper, trace the algorithm with the input \`13\` and write down exactly what it outputs. Then check your prediction against the first test.

**(b)** Implement the algorithm in Python (prompt \`Enter a number: \`). Outputs must match the pseudocode exactly.

\`\`\`text
Enter a number: 6
3
2
1
Steps: 3
\`\`\``,
    tests: [
      { name: "example from the question", input: "6\n", expect: "3\n2\n1\nSteps: 3" },
      { name: "the trace in part (a)", input: "13\n", expect: "12\n6\n3\n2\n1\nSteps: 5" },
      { name: "input of 1: loop never runs", input: "1\n", expect: "Steps: 0", hidden: true },
      { name: "input of 0", input: "0\n", expect: "Steps: 0", hidden: true },
      { name: "power of two", input: "16\n", expect: "8\n4\n2\n1\nSteps: 4", hidden: true }
    ],
    hints: [
      "Trace table columns: `Number`, `Steps`, `OUTPUT`. 13 is odd, so the first step is 13 − 1 = 12.",
      "`MOD` is `%` and `DIV` is `//` in Python. The output happens **inside** the loop, after the change."
    ],
    solution: `number = int(input("Enter a number: "))
steps = 0
while number > 1:
    if number % 2 == 0:
        number = number // 2
    else:
        number = number - 1
    steps = steps + 1
    print(number)
print("Steps: " + str(steps))
`,
    explain: `**Trace for 13.**

| Number | Steps | OUTPUT |
|---|---|---|
| 13 | 0 | |
| 12 | 1 | 12 |
| 6 | 2 | 6 |
| 3 | 3 | 3 |
| 2 | 4 | 2 |
| 1 | 5 | 1 |
| | | Steps: 5 |

**Translating pseudocode.** \`←\` is \`=\`, \`MOD\` is \`%\`, \`DIV\` is \`//\`, \`WHILE … ENDWHILE\` is a \`while\` loop with an indented body. \`"Steps: " + Steps\` joins a string and an integer, which AQA pseudocode allows, but Python needs \`str(steps)\`.

**Edge case.** With 1 or 0 the condition \`Number > 1\` is false at the start, so the loop body never runs: a pre-condition (\`WHILE\`) loop can execute zero times. A \`REPEAT … UNTIL\` loop would always run at least once.`
  }
]);
