/* Python coding practice: A level Programming Booklet, Part 5 – A Level Section D (arrays)
   Exercises from the class programming booklet, made precise enough to test automatically.
   Python has no fixed-size arrays, so a list stands in for an array throughout.
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "bk-static-names",
    title: "Five names in an array (booklet)",
    topic: "2.1",
    difficulty: 1,
    task: `Write a program that stores 5 names in a static array and writes the names to the screen.

- Create a list (Python's version of an array) called \`names\` holding exactly these five names, in this order: \`Ada\`, \`Alan\`, \`Grace\`, \`Linus\`, \`Tim\`.
- Then use a **loop** to output each name on its own line.

\`\`\`text
Ada
Alan
Grace
Linus
Tim
\`\`\`

Some tests run extra code after your program that looks at \`names\`, so use that exact variable name.`,
    tests: [
      { name: "writes the names", expect: "Ada\nAlan\nGrace\nLinus\nTim" },
      { name: "the array holds 5 items", code: "print(len(names))", expect: "Ada\nAlan\nGrace\nLinus\nTim\n5" },
      { name: "the third name is at index 2", code: "print(names[2])", expect: "Ada\nAlan\nGrace\nLinus\nTim\nGrace", hidden: true },
      { name: "names is a list in the right order", code: "print(names == [\"Ada\", \"Alan\", \"Grace\", \"Linus\", \"Tim\"])", expect: "Ada\nAlan\nGrace\nLinus\nTim\nTrue", hidden: true }
    ],
    hints: [
      "A list literal: `names = [\"Ada\", \"Alan\", ...]`.",
      "`for name in names:` then `print(name)`. Or loop over the indexes: `for i in range(len(names)):` and `print(names[i])`."
    ],
    solution: `names = ["Ada", "Alan", "Grace", "Linus", "Tim"]
for i in range(5):
    print(names[i])
`,
    explain: `**Approach.** Declare the array with its values, then iterate over it.

**Static vs dynamic.** A *static* data structure has a fixed size set when it is created (an array in C# or VB is like this). A *dynamic* structure can grow and shrink while the program runs. Python lists are dynamic, but if you never \`append\` or \`remove\`, a list behaves like a static array: fixed length, items accessed by index from 0.

**Two styles of loop.** \`for name in names:\` visits each item directly and is the usual Python style. \`for i in range(5):\` with \`names[i]\` mirrors pseudocode (\`FOR i ← 0 TO 4\`) and is useful when you need the position too.

**Common mistake.** \`for i in range(1, 6)\` skips index 0 and crashes on \`names[5]\`: there are 5 items, at indexes 0 to 4.`
  },
  {
    id: "bk-names-into-array",
    title: "Read names into an array (booklet)",
    topic: "2.1",
    difficulty: 1,
    task: `Write a program that asks the user for 5 names and writes each one into a space in an array.

- First create the array as a list of 5 empty strings: \`names = ["", "", "", "", ""]\` (or \`[""] * 5\`).
- Then use a loop to ask for each name and **store it at the next index** (\`names[0]\`, then \`names[1]\`, …), rather than using \`append\`.
- Finally output the whole array with \`print(names)\`.

\`\`\`text
Name 1: Ann
Name 2: Ben
Name 3: Cal
Name 4: Dee
Name 5: Eve
['Ann', 'Ben', 'Cal', 'Dee', 'Eve']
\`\`\`

Some tests run extra code after your program that looks at \`names\`.`,
    tests: [
      { name: "example from the question", input: "Ann\nBen\nCal\nDee\nEve\n", expect: "['Ann', 'Ben', 'Cal', 'Dee', 'Eve']" },
      { name: "still 5 spaces in the array", input: "Ann\nBen\nCal\nDee\nEve\n", code: "print(len(names))", expect: "['Ann', 'Ben', 'Cal', 'Dee', 'Eve']\n5" },
      { name: "names with spaces", input: "Mary Jane\nJo\nAl\nSam Lee\nKim\n", expect: "['Mary Jane', 'Jo', 'Al', 'Sam Lee', 'Kim']", hidden: true },
      { name: "a blank name stays empty", input: "Zoe\n\nYan\nXi\nWyn\n", code: "print(names[1] == \"\", names[4])", expect: "['Zoe', '', 'Yan', 'Xi', 'Wyn']\nTrue Wyn", hidden: true }
    ],
    hints: [
      "`for i in range(5):` gives the indexes 0 to 4.",
      "Inside the loop: `names[i] = input(\"Name \" + str(i + 1) + \": \")`. The prompt shows `i + 1` because people count from 1."
    ],
    solution: `names = [""] * 5
for i in range(5):
    names[i] = input("Name " + str(i + 1) + ": ")
print(names)
`,
    explain: `**Approach.** Create a fixed-size array first, then assign to each index in turn. This is how you'd do it in a language with static arrays, where you can't append, and it matches AQA pseudocode such as \`names[i] ← USERINPUT\`.

**Why not \`append\`?** \`names.append(name)\` on an empty list would give the same printed result. The task asks you to write into the existing spaces to practise indexing; if you did \`append\` to \`[""] * 5\` you'd end up with 10 items.

**Common mistakes**
- \`names = []\` followed by \`names[i] = ...\` raises \`IndexError\`: the space must exist before you can write into it.
- Showing \`Name 0:\` in the prompt (not tested, but users count from 1).`
  },
  {
    id: "bk-string-to-char-array",
    title: "String to a character array (booklet)",
    topic: "2.1",
    difficulty: 1,
    task: `Write a program that converts a string to a **char array**: an array holding each character of the string as a separate item.

- Ask the user for a string.
- Build a list called \`chars\` with one item per character, in order. Try doing it with a loop that appends each character (Python's \`list(text)\` is a shortcut you can use to check your answer).
- Output the array with \`print(chars)\`, then \`Length: \` and the number of characters.

\`\`\`text
Enter a string: hello
['h', 'e', 'l', 'l', 'o']
Length: 5
\`\`\``,
    tests: [
      { name: "hello", input: "hello\n", expect: "['h', 'e', 'l', 'l', 'o']\nLength: 5" },
      { name: "spaces are characters too", input: "Hi there\n", expect: "['H', 'i', ' ', 't', 'h', 'e', 'r', 'e']\nLength: 8" },
      { name: "empty string", input: "\n", expect: "[]\nLength: 0", hidden: true },
      { name: "digits and symbols", input: "A1-B2\n", expect: "['A', '1', '-', 'B', '2']\nLength: 5", hidden: true },
      { name: "chars can be indexed", input: "code\n", code: "print(chars[0], chars[-1])", expect: "['c', 'o', 'd', 'e']\nLength: 4\nc e", hidden: true }
    ],
    hints: [
      "Start with `chars = []` and loop `for ch in text:` appending each character.",
      "`len(chars)` gives the number of items."
    ],
    solution: `text = input("Enter a string: ")
chars = []
for ch in text:
    chars.append(ch)
print(chars)
print("Length: " + str(len(chars)))
`,
    explain: `**Approach.** A string is already a sequence of characters, so iterate over it and append each one to a new list. \`list(text)\` does the same in one step.

**Why would you want a char array?** Python strings are *immutable*: \`text[0] = "J"\` is an error. A list of characters can be changed in place (\`chars[0] = "J"\`), sorted, or swapped about, and then turned back into a string with \`"".join(chars)\`. In C# the equivalent is \`text.ToCharArray()\`.

**Note.** Python has no separate *char* type: each item is a string of length 1.

**Common mistake.** \`text.split()\` splits into *words*, not characters, and \`text.split("")\` is an error.`
  },
  {
    id: "bk-sort-ten-numbers",
    title: "Sort an array of 10 items (booklet)",
    topic: "3.5",
    difficulty: 2,
    task: `Write a program to sort an array of 10 items.

- Ask for 10 whole numbers, one at a time, and store them in a list.
- Sort the list into **ascending** order **without** using Python's \`sort()\` or \`sorted()\`: write the sort yourself. Any algorithm is fine; a **selection sort** or **insertion sort** is a good choice here (bubble sort has its own problem).
- Output the sorted numbers on one line, separated by single spaces.

\`\`\`text
Number 1: 5
Number 2: 3
Number 3: 9
Number 4: 1
Number 5: 7
Number 6: 2
Number 7: 8
Number 8: 6
Number 9: 4
Number 10: 0
0 1 2 3 4 5 6 7 8 9
\`\`\``,
    tests: [
      { name: "example from the question", input: "5\n3\n9\n1\n7\n2\n8\n6\n4\n0\n", expect: "0 1 2 3 4 5 6 7 8 9" },
      { name: "already sorted", input: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n", expect: "1 2 3 4 5 6 7 8 9 10" },
      { name: "reverse order", input: "100\n90\n80\n70\n60\n50\n40\n30\n20\n10\n", expect: "10 20 30 40 50 60 70 80 90 100", hidden: true },
      { name: "duplicates and negatives", input: "4\n-2\n4\n0\n-7\n4\n13\n-2\n0\n1\n", expect: "-7 -2 -2 0 0 1 4 4 4 13", hidden: true },
      { name: "numbers compared as numbers, not text", input: "9\n10\n100\n8\n11\n2\n20\n1\n3\n30\n", expect: "1 2 3 8 9 10 11 20 30 100", hidden: true }
    ],
    hints: [
      "Convert each input with `int()` as you read it, otherwise `\"10\"` sorts before `\"9\"`.",
      "Selection sort: for each position `i` from 0 to 8, find the index of the smallest item from position `i` to the end, then swap it into position `i`.",
      "To output: `print(\" \".join(str(n) for n in numbers))`, or build a string in a loop."
    ],
    solution: `numbers = []
for i in range(10):
    numbers.append(int(input("Number " + str(i + 1) + ": ")))

# selection sort
for i in range(len(numbers) - 1):
    smallest = i
    for j in range(i + 1, len(numbers)):
        if numbers[j] < numbers[smallest]:
            smallest = j
    numbers[i], numbers[smallest] = numbers[smallest], numbers[i]

output = ""
for n in numbers:
    output = output + str(n) + " "
print(output.strip())
`,
    explain: `**Approach (selection sort).** Repeatedly *select* the smallest item in the unsorted part and swap it to the front of that part. After pass i, the first i + 1 items are in their final places. It always makes about n²/2 comparisons, so it is O(n²), but it does at most n − 1 swaps.

**Insertion sort** is the other simple choice: take each item in turn and shuffle it left past the larger items before it. It is also O(n²) in the worst case but O(n) on an already-sorted list.

**Numbers vs text.** If you forget \`int()\`, the items are strings and are compared character by character: \`"100" < "9"\` because \`"1" < "9"\`. The last hidden test catches this.

**Common mistakes**
- Swapping inside the inner loop every time a smaller item is found (that's a different, slower algorithm, though it still sorts).
- Inner loop starting at \`i\` instead of \`i + 1\`, which is harmless but wasted work; starting at 0 is wrong.`
  },
  {
    id: "bk-count-array-items",
    title: "Number of items in an array (booklet)",
    topic: "2.1",
    difficulty: 1,
    task: `Write a program that outputs the number of items in an array.

- Ask the user to enter items one at a time and add each to a list. Stop when they enter an **empty line** (the empty line is not an item).
- Output \`Number of items: \` followed by how many items are in the list.

\`\`\`text
Item: apple
Item: banana
Item: cherry
Item:
Number of items: 3
\`\`\``,
    tests: [
      { name: "three items", input: "apple\nbanana\ncherry\n\n", expect: "Number of items: 3" },
      { name: "no items", input: "\n", expect: "Number of items: 0" },
      { name: "one item", input: "pear\n\n", expect: "Number of items: 1", hidden: true },
      { name: "duplicates all count", input: "a\na\na\nb\na\n\n", expect: "Number of items: 5", hidden: true },
      { name: "items with spaces", input: "ice cream\nhot dog\n\n", expect: "Number of items: 2", hidden: true }
    ],
    hints: [
      "Read the first item before a `while item != \"\":` loop; inside the loop, `append` it and read the next one.",
      "`len(items)` gives the number of items in a list."
    ],
    solution: `items = []
item = input("Item: ")
while item != "":
    items.append(item)
    item = input("Item: ")
print("Number of items: " + str(len(items)))
`,
    explain: `**Approach.** Build the list with a sentinel-controlled loop (stop on an empty line), then use \`len()\`, which returns the number of items in any list or string.

**Without \`len\`.** You could count with a loop (\`count = count + 1\` for each item); that's what \`len\` saves you from, and in pseudocode \`LEN(items)\` is allowed too.

**Common mistakes**
- Appending the empty line before checking it, giving a count one too high.
- Printing \`len(items) - 1\` to "fix" that instead of fixing the loop.`
  },
  {
    id: "bk-2d-array-x",
    title: "3 × 3 grid with an X (booklet)",
    topic: "2.1",
    difficulty: 1,
    task: `Create a 2D array (3 × 3) and set the grid position 0,1 to an \`"X"\`.

- Create a list of lists called \`grid\` with 3 rows and 3 columns, every cell holding \`"."\`.
- Set the cell at **row 0, column 1** to \`"X"\`, using \`grid[0][1]\`.
- Display the grid: one line per row (row 0 first), with a single space between the cells.

\`\`\`text
. X .
. . .
. . .
\`\`\`

Some tests run extra code after your program that uses \`grid\`. Each row must be a **separate** list, so changing one cell must not change any other row.`,
    tests: [
      { name: "displays the grid", expect: ". X .\n. . .\n. . ." },
      { name: "grid is a list of 3 rows of 3", code: "print(grid)", expect: ". X .\n. . .\n. . .\n[['.', 'X', '.'], ['.', '.', '.'], ['.', '.', '.']]" },
      { name: "the X is at row 0, column 1", code: "print(grid[0][1], grid[1][0])", expect: ". X .\n. . .\n. . .\nX .", hidden: true },
      { name: "rows are independent lists", code: "grid[2][2] = \"O\"\nprint(grid[0][2], grid[1][2], grid[2][2])", expect: ". X .\n. . .\n. . .\n. . O", hidden: true }
    ],
    hints: [
      "The easy safe way: write it out, `grid = [[\".\", \".\", \".\"], [\".\", \".\", \".\"], [\".\", \".\", \".\"]]`, or build each row inside a loop.",
      "Don't use `[[\".\"] * 3] * 3`: that makes three references to the **same** row, so setting `grid[0][1]` puts an X in every row.",
      "To display a row: `print(\" \".join(row))`."
    ],
    solution: `grid = []
for r in range(3):
    row = []
    for c in range(3):
        row.append(".")
    grid.append(row)

grid[0][1] = "X"

for row in grid:
    print(" ".join(row))
`,
    explain: `**Approach.** A 2D array in Python is a list of rows, each row a list. \`grid[r][c]\` first picks row r, then column c within it. Build each row as a *new* list so the rows are independent.

**The aliasing trap.** \`[["."] * 3] * 3\` looks right when printed, but the outer \`* 3\` copies the *reference* to one row three times. Then \`grid[0][1] = "X"\` changes "all three rows" because they are the same list, and the output has an X in every row. A list comprehension, \`[["."] * 3 for r in range(3)]\`, creates a new row each time and is fine.

**Row, column order.** Position "0,1" means row 0 (the top line) and column 1 (the middle). Always say which index is the row: it's a common source of bugs when a grid is displayed.`
  },
  {
    id: "bk-find-the-x",
    title: "Find the hidden X (booklet)",
    topic: "2.1",
    difficulty: 2,
    task: `Create a 2D array (5 × 5) and get the computer to randomly put an \`"X"\` in one of the spaces. Repeatedly ask the user to enter a row and column to guess the location. Output \`success\` when found.

So that the program can be tested, it first asks for a **game number**, used as the random seed:

1. Read the game number and call \`random.seed(game_number)\`.
2. Create a 5 × 5 list of lists filled with \`"."\`. Choose the hiding place with **exactly these two calls, in this order**, and put \`"X"\` there:
   \`\`\`python
   row = random.randint(0, 4)
   col = random.randint(0, 4)
   \`\`\`
3. Repeatedly ask for a guess: the row, then the column (you may assume whole numbers are entered). Rows and columns are numbered 0 to 4.
   - If either is outside 0–4, output \`Off the grid\`.
   - Otherwise, if that cell holds the X, output \`success\` and stop.
   - Otherwise output \`Not there\`.

\`\`\`text
Game number: 1
Row: 0
Column: 0
Not there
Row: 1
Column: 4
success
\`\`\``,
    starter: `import random

game_number = int(input("Game number: "))
random.seed(game_number)
`,
    tests: [
      { name: "game 1: found on the third guess", input: "1\n0\n0\n4\n1\n1\n4\n", expect: "Not there\nNot there\nsuccess" },
      { name: "game 2: found first time", input: "2\n0\n0\n", expect: "success" },
      { name: "game 7: off the grid guesses", input: "7\n1\n2\n5\n1\n-1\n1\n2\n1\n", expect: "Not there\nOff the grid\nOff the grid\nsuccess", hidden: true },
      { name: "game 14: a negative column is off the grid, not wrapped round", input: "14\n0\n-1\n0\n4\n", expect: "Off the grid\nsuccess", hidden: true },
      { name: "game 5: searching along the bottom row", input: "5\n4\n0\n4\n1\n4\n2\n", expect: "Not there\nNot there\nsuccess", hidden: true }
    ],
    hints: [
      "`grid = [[\".\"] * 5 for r in range(5)]` makes 5 separate rows.",
      "Use a Boolean `found = False` and `while not found:` around the guessing code.",
      "Check the range **before** indexing: in Python `grid[0][-1]` is the last cell of row 0, not an error, so a guess of -1 would otherwise be treated as column 4."
    ],
    solution: `import random

game_number = int(input("Game number: "))
random.seed(game_number)

grid = []
for r in range(5):
    grid.append(["."] * 5)
row = random.randint(0, 4)
col = random.randint(0, 4)
grid[row][col] = "X"

found = False
while not found:
    guess_row = int(input("Row: "))
    guess_col = int(input("Column: "))
    if guess_row < 0 or guess_row > 4 or guess_col < 0 or guess_col > 4:
        print("Off the grid")
    elif grid[guess_row][guess_col] == "X":
        print("success")
        found = True
    else:
        print("Not there")
`,
    explain: `**Approach.** Store the hidden X in the 2D array, then loop: read a guess, validate it, and look it up with \`grid[guess_row][guess_col]\`. The loop ends when the X is found.

**Why seed the random numbers?** \`random\` produces a *pseudo-random* sequence determined by its seed. Fixing the seed makes the hiding place repeatable, which is the only way an automatic test (or a teacher checking your screenshot) can know where the X is. In a real game you'd leave out \`random.seed\`.

**Validation and negative indexes.** Python allows negative indexes (\`-1\` is the last item), so without the range check a guess of column -1 silently looks at column 4. One hidden test checks this. In most other languages it would crash with an index-out-of-range error instead.

**Common mistakes**
- Generating the column before the row (a different hiding place from the tests).
- Mixing up row and column when indexing: \`grid[guess_col][guess_row]\`.`
  },
  {
    id: "bk-noughts-and-crosses",
    title: "Noughts and crosses game (booklet)",
    topic: "2.1",
    difficulty: 3,
    task: `*Exam question:* create the game noughts and crosses, using a **2D array of characters**.

- The board is a 3 × 3 list of lists, every cell \`"."\` to start with. \`X\` goes first, then players alternate.
- At the start of every turn, **display the board**: three lines, one per row, each row's three characters with no spaces (for example \`X.O\`).
- Ask for the row, then the column, each 0, 1 or 2 (you may assume whole numbers are entered; the prompt can say whose turn it is). If the position is off the board or the square is already taken, output \`Invalid move\` and ask the **same player** again (don't redisplay the board).
- After a valid move:
  - if that player now has three in a row (horizontally, vertically or diagonally), display the board and output \`X wins\` or \`O wins\`, then stop;
  - otherwise, if the board is full, display the board and output \`Draw\`, then stop.

\`\`\`text
...
...
...
X row: 1
X column: 1
...
.X.
...
O row: 1
O column: 1
Invalid move
O row: 0
O column: 0
O..
.X.
...
...
\`\`\``,
    tests: [
      { name: "X wins along the top row", input: "0\n0\n1\n0\n0\n1\n1\n1\n0\n2\n", expect: "...\n...\n...\nX..\n...\n...\nX..\nO..\n...\nXX.\nO..\n...\nXX.\nOO.\n...\nXXX\nOO.\n...\nX wins" },
      { name: "O wins down the middle column, after an invalid move", input: "0\n0\n0\n0\n0\n1\n2\n2\n1\n1\n1\n0\n2\n1\n", expect: "...\n...\n...\nX..\n...\n...\nInvalid move\nXO.\n...\n...\nXO.\n...\n..X\nXO.\n.O.\n..X\nXO.\nXO.\n..X\nXO.\nXO.\n.OX\nO wins" },
      { name: "a draw", input: "0\n0\n1\n1\n0\n1\n0\n2\n2\n0\n1\n0\n1\n2\n2\n1\n2\n2\n", expect: "...\n...\n...\nX..\n...\n...\nX..\n.O.\n...\nXX.\n.O.\n...\nXXO\n.O.\n...\nXXO\n.O.\nX..\nXXO\nOO.\nX..\nXXO\nOOX\nX..\nXXO\nOOX\nXO.\nXXO\nOOX\nXOX\nDraw", hidden: true },
      { name: "X wins on the diagonal; off-board moves rejected", input: "3\n0\n1\n-1\n0\n0\n0\n1\n1\n1\n0\n2\n2\n2\n", expect: "...\n...\n...\nInvalid move\nInvalid move\nX..\n...\n...\nXO.\n...\n...\nXO.\n.X.\n...\nXOO\n.X.\n...\nXOO\n.X.\n..X\nX wins", hidden: true },
      { name: "O wins on the other diagonal", input: "0\n0\n0\n2\n1\n0\n1\n1\n2\n2\n2\n0\n", expect: "...\n...\n...\nX..\n...\n...\nX.O\n...\n...\nX.O\nX..\n...\nX.O\nXO.\n...\nX.O\nXO.\n..X\nX.O\nXO.\nO.X\nO wins", hidden: true },
      { name: "win on the last square is a win, not a draw", input: "0\n0\n0\n1\n0\n2\n1\n0\n1\n1\n1\n2\n2\n1\n2\n0\n2\n2\n", expect: "...\n...\n...\nX..\n...\n...\nXO.\n...\n...\nXOX\n...\n...\nXOX\nO..\n...\nXOX\nOX.\n...\nXOX\nOXO\n...\nXOX\nOXO\n.X.\nXOX\nOXO\nOX.\nXOX\nOXO\nOXX\nX wins", hidden: true }
    ],
    hints: [
      "Write small subroutines: `display(board)`, `is_winner(board, player)` and `is_full(board)`.",
      "`is_winner` checks 8 lines: for each `i`, row i (`board[i][0] == board[i][1] == board[i][2] == player`) and column i, then the two diagonals.",
      "Get a valid move with a loop: keep asking while the row or column is outside 0–2 **or** the square isn't `\".\"`. Check the range first, so you never index outside the board.",
      "Switch players with `if player == \"X\": player = \"O\" else: player = \"X\"`. Check for a win *before* checking for a full board."
    ],
    solution: `def display(board):
    for row in board:
        print("".join(row))

def is_winner(board, p):
    for i in range(3):
        if board[i][0] == p and board[i][1] == p and board[i][2] == p:
            return True
        if board[0][i] == p and board[1][i] == p and board[2][i] == p:
            return True
    if board[0][0] == p and board[1][1] == p and board[2][2] == p:
        return True
    if board[0][2] == p and board[1][1] == p and board[2][0] == p:
        return True
    return False

def is_full(board):
    for row in board:
        if "." in row:
            return False
    return True

def get_move(board, player):
    while True:
        r = int(input(player + " row: "))
        c = int(input(player + " column: "))
        if 0 <= r <= 2 and 0 <= c <= 2 and board[r][c] == ".":
            return r, c
        print("Invalid move")

board = [["."] * 3 for i in range(3)]
player = "X"
game_over = False
while not game_over:
    display(board)
    r, c = get_move(board, player)
    board[r][c] = player
    if is_winner(board, player):
        display(board)
        print(player + " wins")
        game_over = True
    elif is_full(board):
        display(board)
        print("Draw")
        game_over = True
    elif player == "X":
        player = "O"
    else:
        player = "X"
`,
    explain: `**Approach.** Decompose the game into subroutines: display, get a valid move, check for a winner, check for a full board. The main loop then reads like the rules: show the board, get a move, place it, check for the end, swap players.

**The 2D array.** \`board[r][c]\` is row r, column c. Each row must be its own list (\`[["."] * 3 for i in range(3)]\`); \`[["."] * 3] * 3\` would make one row shared three times.

**Order of checks.** Check for a winner before checking for a full board: X can win by filling the last square (the last hidden test), and that is a win, not a draw. Only the player who just moved can have won, so only check them.

**Validation.** Check the range *before* looking at \`board[r][c]\`: a row of 3 would raise \`IndexError\`, and a row of -1 would silently look at the bottom row.

**Exam technique.** In Paper 1, a "create the game" question is marked on working, well-structured code, sensible identifiers and evidence of testing (screenshots of a win, a draw and an invalid move).`
  }
]);
