/* Python coding practice: simulations, games and state machines
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "dice-game",
    title: "Dice game (Section B style)",
    topic: "P.6",
    difficulty: 2,
    task: `Two players play a 3-round dice game. So that the game can be tested, the dice values are **typed in** rather than generated randomly.

In each round, player 1 takes a turn and then player 2. In a turn:

1. Enter two dice values (prompts \`Die 1: \` and \`Die 2: \`). Each must be a whole number from 1 to 6; otherwise output \`Invalid roll\` and ask for that die again.
2. The points are the total of the two dice. If the total is **even**, add 10; if it is **odd**, subtract 5.
3. If the two dice are the same (a double), enter one more die (prompt \`Bonus die: \`, validated the same way) and add its value to the points.
4. Add the points to the player's score, but a score can never go below 0.

After both players have had their turn, output \`Round <r>: Player 1 has <score1>, Player 2 has <score2>\`.

After 3 rounds output \`Player 1 wins\`, \`Player 2 wins\` or \`Draw\`.

\`\`\`text
Die 1: 3
Die 2: 4
Die 1: 2
Die 2: 2
Bonus die: 5
Round 1: Player 1 has 2, Player 2 has 19
...
\`\`\``,
    starter: `def get_die(prompt):
    # input and validate one die value, returning it as an integer
    return int(input(prompt))


scores = [0, 0]
for round_number in range(1, 4):
    for player in range(2):
        d1 = get_die("Die 1: ")
        d2 = get_die("Die 2: ")
        # work out the points and update scores[player]

    # output the scores for this round

# output the winner
`,
    tests: [
      { name: "example from the question", input: "3\n4\n2\n2\n5\n6\n6\n1\n1\n2\n1\n2\n5\n1\n", expect: "Round 1: Player 1 has 2, Player 2 has 19\nRound 2: Player 1 has 25, Player 2 has 17\nRound 3: Player 1 has 23, Player 2 has 33\nPlayer 2 wins" },
      { name: "scores can't go below zero", input: "1\n2\n1\n4\n2\n1\n3\n4\n2\n3\n1\n2\n", expect: "Round 1: Player 1 has 0, Player 2 has 0\nRound 2: Player 1 has 0, Player 2 has 2\nRound 3: Player 1 has 0, Player 2 has 0\nDraw" },
      { name: "invalid rolls, including the bonus die", input: "0\n7\n6\nx\n6\n9\n3\n6\n5\n4\n4\n2\n6\n6\n6\n1\n1\n1\n3\n5\n", expect: "Invalid roll\nInvalid roll\nInvalid roll\nInvalid roll\nRound 1: Player 1 has 25, Player 2 has 6\nRound 2: Player 1 has 45, Player 2 has 34\nRound 3: Player 1 has 58, Player 2 has 52\nPlayer 1 wins", hidden: true },
      { name: "identical games draw", input: "2\n4\n2\n4\n2\n4\n2\n4\n2\n4\n2\n4\n", expect: "Round 1: Player 1 has 16, Player 2 has 16\nRound 2: Player 1 has 32, Player 2 has 32\nRound 3: Player 1 has 48, Player 2 has 48\nDraw", hidden: true },
      { name: "blank and decimal inputs are invalid", input: "\n2.5\n3\n4\n3\n4\n3\n4\n3\n4\n3\n4\n3\n4\n", expect: "Invalid roll\nInvalid roll\nRound 1: Player 1 has 2, Player 2 has 2\nRound 2: Player 1 has 4, Player 2 has 4\nRound 3: Player 1 has 6, Player 2 has 6\nDraw", hidden: true }
    ],
    hints: [
      "Write a function `get_die(prompt)` with a validation loop and `try`/`except ValueError`, and use it for all three dice.",
      "Keep both scores in a list `scores = [0, 0]` so the same code works for either player.",
      "Points: `total = d1 + d2`; `if total % 2 == 0: points = total + 10` else `points = total - 5`. Then `scores[player] = max(0, scores[player] + points)`."
    ],
    solution: `def get_die(prompt):
    while True:
        try:
            value = int(input(prompt))
            if 1 <= value <= 6:
                return value
        except ValueError:
            pass
        print("Invalid roll")


scores = [0, 0]
for round_number in range(1, 4):
    for player in range(2):
        d1 = get_die("Die 1: ")
        d2 = get_die("Die 2: ")
        total = d1 + d2
        if total % 2 == 0:
            points = total + 10
        else:
            points = total - 5
        if d1 == d2:
            points = points + get_die("Bonus die: ")
        scores[player] = scores[player] + points
        if scores[player] < 0:
            scores[player] = 0
    print("Round " + str(round_number) + ": Player 1 has " + str(scores[0]) + ", Player 2 has " + str(scores[1]))

if scores[0] > scores[1]:
    print("Player 1 wins")
elif scores[1] > scores[0]:
    print("Player 2 wins")
else:
    print("Draw")
`,
    explain: `**Structure.** Nested definite loops (rounds, then players) around one turn's logic. Storing the scores in a list indexed by player means the turn code is written once, not twice. A \`get_die\` subroutine with its own validation loop is reused for all three dice.

**Order of the rules.** Apply even/odd to the two-dice total first, then add the bonus die, then clamp at 0. Clamping *after* each turn (not at the end of the game) is what "a score can never go below 0" means; the second test checks it.

**Typed-in dice.** Real games use \`random.randint(1, 6)\`. Replacing random input with typed input (or a fixed seed) is a standard way to make a program **testable**, and Section B questions often do the same.

**Common mistakes:** validating only the first die; forgetting the bonus-die validation; printing the round result inside the player loop (twice per round).`
  },
  {
    id: "minesweeper",
    title: "Minesweeper numbers",
    topic: "2.1",
    difficulty: 2,
    task: `A Minesweeper board is a grid in which \`*\` is a mine and \`.\` is an empty square. Write a program that replaces every empty square with the number of mines in the (up to) **8** squares around it.

- Ask for the number of rows (prompt \`Rows: \`), then each row as a string (prompts \`Row 1: \`, \`Row 2: \`, …). All rows have the same length. You may assume the input is valid.
- Store the board in a 2-D list and output the finished board, one row per line, with mines still shown as \`*\`.

Squares at the edges have fewer neighbours: don't look outside the grid.

\`\`\`text
Rows: 3
Row 1: *..
Row 2: ...
Row 3: .*.
*10
221
1*1
\`\`\``,
    tests: [
      { name: "example from the question", input: "3\n*..\n...\n.*.\n", expect: "*10\n221\n1*1" },
      { name: "one row", input: "1\n*.*\n", expect: "*2*" },
      { name: "a single empty square", input: "1\n.\n", expect: "0", hidden: true },
      { name: "all mines", input: "2\n**\n**\n", expect: "**\n**", hidden: true },
      { name: "bigger board", input: "4\n....\n.*..\n....\n...*\n", expect: "1110\n1*10\n1121\n001*", hidden: true },
      { name: "one column", input: "5\n.\n*\n.\n*\n.\n", expect: "1\n*\n2\n*\n1", hidden: true }
    ],
    hints: [
      "For each square `(r, c)`, loop `dr` and `dc` over -1, 0, 1 (skipping 0, 0) and look at `(r + dr, c + dc)`.",
      "Before reading a neighbour, check `0 <= r + dr < rows` and `0 <= c + dc < cols`. (A negative index wouldn't crash in Python: it would silently wrap round to the other side!)"
    ],
    solution: `rows = int(input("Rows: "))
board = []
for r in range(rows):
    board.append(list(input("Row " + str(r + 1) + ": ")))
cols = len(board[0])

for r in range(rows):
    line = ""
    for c in range(cols):
        if board[r][c] == "*":
            line = line + "*"
        else:
            count = 0
            for dr in [-1, 0, 1]:
                for dc in [-1, 0, 1]:
                    nr = r + dr
                    nc = c + dc
                    if (dr != 0 or dc != 0) and 0 <= nr < rows and 0 <= nc < cols:
                        if board[nr][nc] == "*":
                            count = count + 1
            line = line + str(count)
    print(line)
`,
    explain: `**Approach.** Visit every square (two nested loops), and for each empty square visit its neighbours (two more nested loops over the offsets −1, 0, +1). Counting into a separate output avoids changing the board while you're still reading it.

**Bounds checking.** This is the key skill in grid problems — the skeleton programs are full of it. In Python \`board[-1]\` is the **last** row, so forgetting the check doesn't crash; it silently counts mines from the opposite edge. The hidden one-column test catches that.

**Common mistakes:** counting the square itself (forgetting to skip offset 0, 0); mixing up rows and columns on a non-square board; writing the counts into \`board\` and then reading digits as if they were squares.`
  },
  {
    id: "game-of-life",
    title: "Conway's Game of Life",
    topic: "2.1",
    difficulty: 3,
    task: `In Conway's Game of Life each square of a grid is alive (\`#\`) or dead (\`.\`). Every generation, all squares change **at the same time**:

- a live square with 2 or 3 live neighbours stays alive; otherwise it dies
- a dead square with exactly 3 live neighbours becomes alive.

Neighbours are the (up to) 8 surrounding squares; squares outside the grid count as dead.

Write a program that asks for the number of generations (prompt \`Generations: \`), the number of rows (prompt \`Rows: \`) and then each row (prompts \`Row 1: \`, … ), all the same length. Then, for each generation from 1, output \`Generation <n>:\` followed by the grid.

\`\`\`text
Generations: 2
Rows: 5
Row 1: .....
Row 2: ..#..
Row 3: ..#..
Row 4: ..#..
Row 5: .....
Generation 1:
.....
.....
.###.
.....
.....
Generation 2:
.....
..#..
..#..
..#..
.....
\`\`\``,
    tests: [
      { name: "example from the question (blinker)", input: "2\n5\n.....\n..#..\n..#..\n..#..\n.....\n", expect: "Generation 1:\n.....\n.....\n.###.\n.....\n.....\nGeneration 2:\n.....\n..#..\n..#..\n..#..\n....." },
      { name: "a block never changes", input: "1\n4\n....\n.##.\n.##.\n....\n", expect: "Generation 1:\n....\n.##.\n.##.\n...." },
      { name: "a lonely cell dies", input: "1\n1\n#\n", expect: "Generation 1:\n.", hidden: true },
      { name: "block in a corner", input: "2\n2\n##\n##\n", expect: "Generation 1:\n##\n##\nGeneration 2:\n##\n##", hidden: true },
      { name: "zero generations", input: "0\n2\n#.\n.#\n", expect: "", hidden: true },
      { name: "glider, 4 generations", input: "4\n6\n.#....\n..#...\n###...\n......\n......\n......\n", expect: "Generation 1:\n......\n#.#...\n.##...\n.#....\n......\n......\nGeneration 2:\n......\n..#...\n#.#...\n.##...\n......\n......\nGeneration 3:\n......\n.#....\n..##..\n.##...\n......\n......\nGeneration 4:\n......\n..#...\n...#..\n.###..\n......\n......", hidden: true },
      { name: "birth at the edge", input: "1\n2\n.#.\n.##\n", expect: "Generation 1:\n.##\n.##", hidden: true }
    ],
    hints: [
      "Write a function `count_neighbours(grid, r, c)` that checks the 8 surrounding squares, skipping any outside the grid.",
      "Build a **new** grid for the next generation from the old one; don't change the old grid while you are still counting from it.",
      "After each generation replace the old grid with the new one, then output it."
    ],
    solution: `def count_neighbours(grid, r, c):
    count = 0
    for dr in [-1, 0, 1]:
        for dc in [-1, 0, 1]:
            if dr == 0 and dc == 0:
                continue
            nr = r + dr
            nc = c + dc
            if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]):
                if grid[nr][nc] == "#":
                    count = count + 1
    return count


def next_generation(grid):
    new_grid = []
    for r in range(len(grid)):
        row = []
        for c in range(len(grid[0])):
            n = count_neighbours(grid, r, c)
            if grid[r][c] == "#" and (n == 2 or n == 3):
                row.append("#")
            elif grid[r][c] == "." and n == 3:
                row.append("#")
            else:
                row.append(".")
        new_grid.append(row)
    return new_grid


generations = int(input("Generations: "))
rows = int(input("Rows: "))
grid = []
for r in range(rows):
    grid.append(list(input("Row " + str(r + 1) + ": ")))

for g in range(1, generations + 1):
    grid = next_generation(grid)
    print("Generation " + str(g) + ":")
    for row in grid:
        print("".join(row))
`,
    explain: `**The key idea: double buffering.** Every square must be updated using the *old* generation. If you change squares in place, later squares count neighbours that have already changed, and patterns like the blinker go wrong. Build a new grid, then swap.

**Decomposition.** \`count_neighbours\` and \`next_generation\` are small, testable subroutines; the main program just reads input and loops over generations.

**Checking your work.** Known patterns are great test data: a *block* is a still life, a *blinker* has period 2, and a *glider* moves one square diagonally every 4 generations.

**Exam link.** This is a model of a simple *cellular automaton* and is the same "grid + neighbours + rules" structure as many skeleton programs. Bounds checking (no wrap-around here) is where most bugs are.`
  },
  {
    id: "fsm-multiple-of-3",
    title: "FSM: multiples of 3 in binary",
    topic: "4.2",
    difficulty: 3,
    task: `This finite state machine reads a binary number one bit at a time, **left to right**, and accepts it if the number is a multiple of 3. The state is the remainder so far. \`S0\` is both the start state and the only accepting state.

| Current state | Input 0 | Input 1 |
|---|---|---|
| S0 | S0 | S1 |
| S1 | S2 | S0 |
| S2 | S1 | S2 |

Write a program that:

- stores the transition table in a **dictionary** (for example with keys like \`("S1", "0")\`)
- asks for a binary string (prompt \`Enter a binary string: \`)
- outputs \`Invalid input\` if the string contains anything other than \`0\` and \`1\`
- otherwise outputs the states visited, starting with \`S0\`, separated by \` -> \`, then \`Accepted\` or \`Rejected\`.

An empty string is valid: the machine stays in \`S0\`.

\`\`\`text
Enter a binary string: 110
S0 -> S1 -> S0 -> S0
Accepted
\`\`\``,
    tests: [
      { name: "example from the question (6)", input: "110\n", expect: "S0 -> S1 -> S0 -> S0\nAccepted" },
      { name: "5 is rejected", input: "101\n", expect: "S0 -> S1 -> S2 -> S2\nRejected" },
      { name: "empty string", input: "\n", expect: "S0\nAccepted", hidden: true },
      { name: "9 is accepted", input: "1001\n", expect: "S0 -> S1 -> S2 -> S1 -> S0\nAccepted", hidden: true },
      { name: "invalid character", input: "12\n", expect: "Invalid input", hidden: true },
      { name: "15 is accepted", input: "1111\n", expect: "S0 -> S1 -> S0 -> S1 -> S0\nAccepted", hidden: true },
      { name: "2 is rejected", input: "10\n", expect: "S0 -> S1 -> S2\nRejected", hidden: true },
      { name: "leading zeros", input: "0011\n", expect: "S0 -> S0 -> S0 -> S1 -> S0\nAccepted", hidden: true }
    ],
    hints: [
      "`transitions = {(\"S0\", \"0\"): \"S0\", (\"S0\", \"1\"): \"S1\", ...}` — six entries.",
      "Start with `state = \"S0\"` and a list `visited = [\"S0\"]`. For each bit: `state = transitions[(state, bit)]` and append it.",
      "Validate the whole string before you start, so nothing else is output for invalid input."
    ],
    solution: `TRANSITIONS = {
    ("S0", "0"): "S0", ("S0", "1"): "S1",
    ("S1", "0"): "S2", ("S1", "1"): "S0",
    ("S2", "0"): "S1", ("S2", "1"): "S2",
}
ACCEPTING = ["S0"]

bits = input("Enter a binary string: ")
valid = True
for ch in bits:
    if ch != "0" and ch != "1":
        valid = False

if not valid:
    print("Invalid input")
else:
    state = "S0"
    visited = [state]
    for bit in bits:
        state = TRANSITIONS[(state, bit)]
        visited.append(state)
    print(" -> ".join(visited))
    if state in ACCEPTING:
        print("Accepted")
    else:
        print("Rejected")
`,
    explain: `**Why it works.** Reading one more bit doubles the number so far and adds the bit: n → 2n + b. So the new remainder is (2 × old remainder + b) MOD 3. From remainder 1, reading 0 gives 2 (S1 → S2); reading 1 gives 3 MOD 3 = 0 (S1 → S0). The states only need to remember the remainder, not the whole number — which is why a machine with **finite** memory can do it.

**Table-driven code.** Storing the transition table as data (a dictionary keyed on (state, input)) means the same loop can run *any* FSM: change the table, not the code. That's exactly how a state transition table in the exam maps to a program.

**Exam links.** An FSM with no output that accepts or rejects strings is a *finite state automaton*; the set of strings it accepts is a **regular language**, so there is also a regular expression for binary multiples of 3. Mealy machines add an output on each transition.`
  }
]);
