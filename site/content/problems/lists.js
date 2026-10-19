/* Python coding practice: lists and two-dimensional lists
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "list-stats",
    title: "Largest, smallest and mean",
    topic: "2.1",
    difficulty: 1,
    task: `Write a program that asks for a list of whole numbers separated by commas (prompt \`Enter numbers separated by commas: \`), stores them in a list and outputs three lines:

- \`Largest: \` and the largest number
- \`Smallest: \` and the smallest number
- \`Mean: \` and the mean, rounded with \`round(mean, 2)\` and output as Python prints it (so \`18.0\`, \`6.5\`, \`1.67\`).

Find these with a loop: **do not** use \`max()\`, \`min()\` or \`sum()\`. If nothing is entered, output \`No numbers entered\`.

\`\`\`text
Enter numbers separated by commas: 4,8,15,16,23,42
Largest: 42
Smallest: 4
Mean: 18.0
\`\`\``,
    tests: [
      { name: "example from the question", input: "4,8,15,16,23,42\n", expect: "Largest: 42\nSmallest: 4\nMean: 18.0" },
      { name: "one number", input: "7\n", expect: "Largest: 7\nSmallest: 7\nMean: 7.0" },
      { name: "negative numbers", input: "-5,0,5\n", expect: "Largest: 5\nSmallest: -5\nMean: 0.0", hidden: true },
      { name: "mean needs rounding", input: "1,2,2\n", expect: "Largest: 2\nSmallest: 1\nMean: 1.67", hidden: true },
      { name: "largest first", input: "10,3\n", expect: "Largest: 10\nSmallest: 3\nMean: 6.5", hidden: true },
      { name: "empty input", input: "\n", expect: "No numbers entered", hidden: true }
    ],
    hints: [
      "`text.split(\",\")` gives a list of strings; convert each with `int()` into a new list.",
      "Start `largest` and `smallest` at the **first item** of the list (not 0), then compare with each item in turn."
    ],
    solution: `text = input("Enter numbers separated by commas: ")
if text == "":
    print("No numbers entered")
else:
    numbers = []
    for part in text.split(","):
        numbers.append(int(part))
    largest = numbers[0]
    smallest = numbers[0]
    total = 0
    for n in numbers:
        if n > largest:
            largest = n
        if n < smallest:
            smallest = n
        total = total + n
    mean = total / len(numbers)
    print("Largest: " + str(largest))
    print("Smallest: " + str(smallest))
    print("Mean: " + str(round(mean, 2)))
`,
    explain: `**Approach.** Split the string into parts, convert each to an integer, then one pass over the list keeps a running largest, smallest and total.

**Initialise from the data.** Starting \`largest = 0\` fails when every number is negative; starting \`smallest = 0\` fails when every number is positive. Using \`numbers[0]\` always works.

**Edge case.** \`"".split(",")\` is \`[""]\`, and \`int("")\` crashes — that's why empty input is checked first.

**Exam note.** \`max()\`, \`min()\` and \`sum()\` are fine in real code, but questions often ask you to write the loop to show you understand the algorithm.`
  },
  {
    id: "vector-dot-product",
    title: "Dot product of two vectors",
    topic: "2.8",
    difficulty: 1,
    task: `A vector can be stored as a list of numbers. The **dot product** of **A** = [a₀, a₁, …] and **B** = [b₀, b₁, …] is a₀b₀ + a₁b₁ + …

Write a program that asks for two vectors as whole numbers separated by commas (prompts \`Enter vector A: \` and \`Enter vector B: \`).

- If they have different numbers of components, output \`Vectors must be the same size\`.
- Otherwise output \`Dot product: \` followed by the dot product.

\`\`\`text
Enter vector A: 1,2,3
Enter vector B: 4,5,6
Dot product: 32
\`\`\``,
    tests: [
      { name: "example from the question", input: "1,2,3\n4,5,6\n", expect: "Dot product: 32" },
      { name: "perpendicular vectors", input: "3,4\n4,-3\n", expect: "Dot product: 0" },
      { name: "different sizes", input: "1,2\n1,2,3\n", expect: "Vectors must be the same size", hidden: true },
      { name: "one component", input: "7\n-2\n", expect: "Dot product: -14", hidden: true },
      { name: "zero vector", input: "0,0,0\n5,6,7\n", expect: "Dot product: 0", hidden: true }
    ],
    hints: [
      "Turn each input into a list of integers with `split(\",\")` and `int()`.",
      "Loop over the indices `for i in range(len(a)):` and add `a[i] * b[i]` to a total."
    ],
    solution: `def to_vector(text):
    vector = []
    for part in text.split(","):
        vector.append(int(part))
    return vector


a = to_vector(input("Enter vector A: "))
b = to_vector(input("Enter vector B: "))
if len(a) != len(b):
    print("Vectors must be the same size")
else:
    total = 0
    for i in range(len(a)):
        total = total + a[i] * b[i]
    print("Dot product: " + str(total))
`,
    explain: `**Approach.** Multiply matching components and add. Both lists are indexed with the same \`i\`, so they must be the same length — checking that first avoids an \`IndexError\`.

**Why it matters (spec 4.2.8).** The dot product is used to find the angle between two vectors: **A**·**B** = |**A**||**B**| cos θ. A dot product of 0 means the vectors are at right angles (perpendicular), as in the second test.

**Representation.** A vector can be held as a list (1-D array) or as a dictionary mapping index → value (good for sparse vectors with lots of zeros).`
  },
  {
    id: "row-column-totals",
    title: "Row and column totals (2D list)",
    topic: "2.1",
    difficulty: 2,
    task: `Write a program that reads a table of whole numbers into a **two-dimensional list** and outputs its totals.

1. Ask for the number of rows (prompt \`Number of rows: \`). You may assume it is at least 1.
2. For each row ask for the numbers separated by spaces (prompts \`Row 1: \`, \`Row 2: \`, …). Every row has the same number of values.
3. Output \`Row <n> total: <total>\` for each row, then \`Column totals: \` followed by each column total separated by single spaces, then \`Grand total: <total>\`.

\`\`\`text
Number of rows: 2
Row 1: 1 2 3
Row 2: 4 5 6
Row 1 total: 6
Row 2 total: 15
Column totals: 5 7 9
Grand total: 21
\`\`\``,
    starter: `rows = int(input("Number of rows: "))
grid = []
for r in range(rows):
    line = input("Row " + str(r + 1) + ": ")
    row = []
    for part in line.split():
        row.append(int(part))
    grid.append(row)

# grid is now a list of rows, e.g. [[1, 2, 3], [4, 5, 6]]
# output the totals here
`,
    tests: [
      { name: "example from the question", input: "2\n1 2 3\n4 5 6\n", expect: "Row 1 total: 6\nRow 2 total: 15\nColumn totals: 5 7 9\nGrand total: 21" },
      { name: "a single value", input: "1\n10\n", expect: "Row 1 total: 10\nColumn totals: 10\nGrand total: 10" },
      { name: "negative numbers", input: "3\n1 -1\n2 -2\n3 -3\n", expect: "Row 1 total: 0\nRow 2 total: 0\nRow 3 total: 0\nColumn totals: 6 -6\nGrand total: 0", hidden: true },
      { name: "one column", input: "4\n5\n6\n7\n8\n", expect: "Row 1 total: 5\nRow 2 total: 6\nRow 3 total: 7\nRow 4 total: 8\nColumn totals: 26\nGrand total: 26", hidden: true },
      { name: "one row", input: "1\n1 2 3 4 5\n", expect: "Row 1 total: 15\nColumn totals: 1 2 3 4 5\nGrand total: 15", hidden: true }
    ],
    hints: [
      "`grid[r][c]` is row `r`, column `c`. The number of columns is `len(grid[0])`.",
      "Row totals: outer loop over rows, inner loop over columns. Column totals: swap the loops — outer over columns, inner over rows.",
      "Build the column totals as strings in a list and print `\"Column totals: \" + \" \".join(...)`."
    ],
    solution: `rows = int(input("Number of rows: "))
grid = []
for r in range(rows):
    line = input("Row " + str(r + 1) + ": ")
    row = []
    for part in line.split():
        row.append(int(part))
    grid.append(row)

grand = 0
for r in range(len(grid)):
    total = 0
    for c in range(len(grid[r])):
        total = total + grid[r][c]
    grand = grand + total
    print("Row " + str(r + 1) + " total: " + str(total))

column_totals = []
for c in range(len(grid[0])):
    total = 0
    for r in range(len(grid)):
        total = total + grid[r][c]
    column_totals.append(str(total))
print("Column totals: " + " ".join(column_totals))
print("Grand total: " + str(grand))
`,
    explain: `**Approach.** A 2-D list is a list of rows. Nested loops visit every element: for row totals the **outer** loop is the row; for column totals the **outer** loop is the column, so each inner loop runs down one column.

**Grand total.** Adding up the row totals (or the column totals) gives the grand total — a useful self-check when tracing.

**Common mistakes**
- Mixing up \`grid[r][c]\` and \`grid[c][r]\`; with a non-square table this gives an \`IndexError\`.
- Starting \`total = 0\` outside the outer loop, so each row's total includes the previous rows.
- Off-by-one in the output: rows are numbered from 1 for the user but indexed from 0 in Python.`
  },
  {
    id: "cinema-seats",
    title: "Cinema seat booking",
    topic: "2.1",
    difficulty: 2,
    task: `A small cinema has 5 rows (\`A\` to \`E\`) of 8 seats (\`1\` to \`8\`). Use a **2-D list** to record which seats are booked.

Repeatedly ask for a seat (prompt \`Enter a seat (e.g. B4) or Q to quit: \`):

- A valid seat is a row letter \`A\`–\`E\` (upper or lower case) followed by a seat number \`1\`–\`8\`. Anything else: output \`Invalid seat\`.
- If the seat is already booked, output \`Seat already booked\`.
- Otherwise book it and output \`Seat <seat> booked\`, with the row letter in capitals (e.g. \`Seat B2 booked\`).
- \`Q\` or \`q\` stops the loop.

Then output the seating plan, one line per row: the row letter, a space, then 8 characters, \`X\` for booked and \`.\` for free. Finally output \`Seats booked: <n>\`.

\`\`\`text
Enter a seat (e.g. B4) or Q to quit: B4
Seat B4 booked
Enter a seat (e.g. B4) or Q to quit: A1
Seat A1 booked
Enter a seat (e.g. B4) or Q to quit: B4
Seat already booked
Enter a seat (e.g. B4) or Q to quit: Q
A X.......
B ...X....
C ........
D ........
E ........
Seats booked: 2
\`\`\``,
    tests: [
      { name: "example from the question", input: "B4\nA1\nB4\nQ\n", expect: "Seat B4 booked\nSeat A1 booked\nSeat already booked\nA X.......\nB ...X....\nC ........\nD ........\nE ........\nSeats booked: 2" },
      { name: "quit straight away (lower case q)", input: "q\n", expect: "A ........\nB ........\nC ........\nD ........\nE ........\nSeats booked: 0" },
      { name: "invalid seats", input: "F1\nA9\nA0\nhello\n\nA10\nb2\nQ\n", expect: "Invalid seat\nInvalid seat\nInvalid seat\nInvalid seat\nInvalid seat\nInvalid seat\nSeat B2 booked\nA ........\nB .X......\nC ........\nD ........\nE ........\nSeats booked: 1", hidden: true },
      { name: "corner seats", input: "E8\na1\nA1\nQ\n", expect: "Seat E8 booked\nSeat A1 booked\nSeat already booked\nA X.......\nB ........\nC ........\nD ........\nE .......X\nSeats booked: 2", hidden: true },
      { name: "whole row", input: "C1\nC2\nC3\nC4\nC5\nC6\nC7\nC8\nq\n", expect: "Seat C1 booked\nSeat C2 booked\nSeat C3 booked\nSeat C4 booked\nSeat C5 booked\nSeat C6 booked\nSeat C7 booked\nSeat C8 booked\nA ........\nB ........\nC XXXXXXXX\nD ........\nE ........\nSeats booked: 8", hidden: true }
    ],
    hints: [
      "Create the grid with a loop: `seats = []`, then append `[False] * 8` five times. (Don't use `[[False] * 8] * 5` — all five rows would be the same list!)",
      "Row index: `\"ABCDE\".index(letter)`. Check the rest of the input is digits with `.isdigit()` before converting it, and that the number is 1–8.",
      "To print a row, build a string of `X`/`.` with a loop over the 8 seats."
    ],
    solution: `ROWS = "ABCDE"
seats = []
for r in range(5):
    seats.append([False] * 8)

count = 0
choice = input("Enter a seat (e.g. B4) or Q to quit: ").upper()
while choice != "Q":
    valid = False
    if len(choice) >= 2 and choice[0] in ROWS and choice[1:].isdigit():
        number = int(choice[1:])
        if 1 <= number <= 8:
            valid = True
    if not valid:
        print("Invalid seat")
    else:
        row = ROWS.index(choice[0])
        if seats[row][number - 1]:
            print("Seat already booked")
        else:
            seats[row][number - 1] = True
            count = count + 1
            print("Seat " + choice + " booked")
    choice = input("Enter a seat (e.g. B4) or Q to quit: ").upper()

for r in range(5):
    line = ROWS[r] + " "
    for s in range(8):
        if seats[r][s]:
            line = line + "X"
        else:
            line = line + "."
    print(line)
print("Seats booked: " + str(count))
`,
    explain: `**Approach.** A 5 × 8 grid of Booleans. The user's seat code is converted to indices: letter → row 0–4 with \`"ABCDE".index\`, number → column with \`number - 1\`.

**Validation order.** Check the length and that the letter is in \`ABCDE\` **before** indexing, and check \`.isdigit()\` **before** \`int()\`, so nothing can crash. \`A10\` passes \`isdigit\` but fails the 1–8 range check.

**The aliasing trap.** \`[[False] * 8] * 5\` makes five references to *one* row list, so booking A1 would also book B1, C1… Build each row separately.

**Common mistakes:** forgetting \`- 1\` when converting seat numbers to indices; counting a repeat booking; printing \`Seat b2 booked\` because the input wasn't converted to capitals.`
  },
  {
    id: "noughts-and-crosses-winner",
    title: "Noughts and crosses: who won?",
    topic: "2.1",
    difficulty: 2,
    task: `A noughts-and-crosses board is entered as three rows (prompts \`Row 1: \`, \`Row 2: \`, \`Row 3: \`), each exactly 3 characters: \`X\`, \`O\` or \`.\` (empty). Store it in a 2-D list.

Output exactly one of:

- \`X wins\` or \`O wins\` if that player has three in a row (horizontally, vertically or diagonally)
- \`Draw\` if no one has won and the board is full
- \`Game not finished\` otherwise.

You may assume the input is valid and at most one player has three in a row.

\`\`\`text
Row 1: XXX
Row 2: OO.
Row 3: ...
X wins
\`\`\``,
    tests: [
      { name: "example from the question", input: "XXX\nOO.\n...\n", expect: "X wins" },
      { name: "full board, no winner", input: "XOX\nXOO\nOXX\n", expect: "Draw" },
      { name: "column win", input: "XO.\nXO.\n.OX\n", expect: "O wins", hidden: true },
      { name: "main diagonal", input: "X.O\n.XO\n..X\n", expect: "X wins", hidden: true },
      { name: "other diagonal", input: "XXO\nXO.\nO..\n", expect: "O wins", hidden: true },
      { name: "empty board", input: "...\n...\n...\n", expect: "Game not finished", hidden: true },
      { name: "win on a full board is not a draw", input: "XOX\nOXO\nOXX\n", expect: "X wins", hidden: true },
      { name: "unfinished, no winner", input: "XO.\n.X.\n..O\n", expect: "Game not finished", hidden: true }
    ],
    hints: [
      "Write a function `has_won(board, player)` that returns True if any row, column or diagonal is all `player`.",
      "Check all 8 lines: 3 rows, 3 columns, 2 diagonals (`board[i][i]` and `board[i][2 - i]`).",
      "Only decide between `Draw` and `Game not finished` after checking both players for a win."
    ],
    solution: `def has_won(board, player):
    for i in range(3):
        if board[i][0] == player and board[i][1] == player and board[i][2] == player:
            return True
        if board[0][i] == player and board[1][i] == player and board[2][i] == player:
            return True
    if board[0][0] == player and board[1][1] == player and board[2][2] == player:
        return True
    if board[0][2] == player and board[1][1] == player and board[2][0] == player:
        return True
    return False


board = []
for r in range(3):
    board.append(list(input("Row " + str(r + 1) + ": ")))

if has_won(board, "X"):
    print("X wins")
elif has_won(board, "O"):
    print("O wins")
else:
    full = True
    for row in board:
        if "." in row:
            full = False
    if full:
        print("Draw")
    else:
        print("Game not finished")
`,
    explain: `**Approach.** A function that checks all eight winning lines for one player, called once for X and once for O. Only if neither has won do you look for empty squares to choose between \`Draw\` and \`Game not finished\`.

**Indexing the diagonals.** Main diagonal: (0,0), (1,1), (2,2) → \`board[i][i]\`. Other diagonal: (0,2), (1,1), (2,0) → \`board[i][2 - i]\`.

**Common mistakes**
- Checking for a full board first, so a win on the last move is reported as a draw (hidden test).
- Forgetting one of the diagonals.
- \`board[i][0] == board[i][1] == board[i][2]\` without checking it isn't \`.\` — three empty squares would count as a win.

**Decomposition.** Splitting the problem into \`has_won\` and a "board full" check is exactly the kind of structure examiners reward in Section B/D answers.`
  },
  {
    id: "trace-inversions",
    title: "Trace then implement: nested loops",
    topic: "1.2",
    difficulty: 2,
    task: `Here is an algorithm in AQA pseudocode. Remember that an AQA \`FOR\` loop **includes** its end value.

\`\`\`pseudocode
A ← the whole numbers typed by the user, separated by spaces
Count ← 0
FOR i ← 0 TO LEN(A) - 2
  FOR j ← i + 1 TO LEN(A) - 1
    IF A[i] > A[j] THEN
      OUTPUT A[i] + " > " + A[j]
      Count ← Count + 1
    ENDIF
  ENDFOR
ENDFOR
OUTPUT "Count: " + Count
\`\`\`

**(a)** Trace the algorithm by hand for the input \`4 1 3 2\` and predict its exact output.

**(b)** Implement it in Python (prompt \`Enter numbers: \`), matching the output format exactly.

**(c)** Think about it: what does \`Count\` tell you about the list? (See the explanation once you've solved it.)

\`\`\`text
Enter numbers: 3 1 2
3 > 1
3 > 2
Count: 2
\`\`\``,
    tests: [
      { name: "example from the question", input: "3 1 2\n", expect: "3 > 1\n3 > 2\nCount: 2" },
      { name: "the trace in part (a)", input: "4 1 3 2\n", expect: "4 > 1\n4 > 3\n4 > 2\n3 > 2\nCount: 4" },
      { name: "already in order", input: "1 2 3\n", expect: "Count: 0", hidden: true },
      { name: "one number: outer loop runs zero times", input: "5\n", expect: "Count: 0", hidden: true },
      { name: "reverse order", input: "3 2 1\n", expect: "3 > 2\n3 > 1\n2 > 1\nCount: 3", hidden: true },
      { name: "equal values are not counted", input: "2 2\n", expect: "Count: 0", hidden: true },
      { name: "negative numbers", input: "-1 -5 0\n", expect: "-1 > -5\nCount: 1", hidden: true }
    ],
    hints: [
      "AQA `FOR i ← 0 TO n` is Python `for i in range(0, n + 1)`. So `0 TO LEN(A) - 2` becomes `range(len(a) - 1)`.",
      "The inner loop `j ← i + 1 TO LEN(A) - 1` is `range(i + 1, len(a))`.",
      "Python can't add an integer to a string, so build the output with `str(a[i]) + \" > \" + str(a[j])`."
    ],
    solution: `a = []
for part in input("Enter numbers: ").split():
    a.append(int(part))

count = 0
for i in range(len(a) - 1):
    for j in range(i + 1, len(a)):
        if a[i] > a[j]:
            print(str(a[i]) + " > " + str(a[j]))
            count = count + 1
print("Count: " + str(count))
`,
    explain: `**Trace for \`4 1 3 2\`.** i = 0 compares 4 with 1, 3, 2 → three outputs. i = 1 compares 1 with 3, 2 → none. i = 2 compares 3 with 2 → \`3 > 2\`. Count = 4.

**Translating FOR loops.** AQA \`FOR i ← a TO b\` includes \`b\`; Python \`range(a, b)\` stops *before* \`b\`. So the end value always needs \`+ 1\`: \`0 TO LEN(A) - 2\` → \`range(0, len(a) - 1)\`. This is the most common translation error in Section B.

**(c) What is Count?** It counts the *inversions*: pairs that are in the wrong order. 0 means the list is already sorted, and it equals the number of swaps a bubble sort would make. The nested loops make about n²/2 comparisons, so this algorithm is O(n²).

**Edge case.** With one number, \`range(0)\` is empty, so only \`Count: 0\` is output.`
  }
]);
