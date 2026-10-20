/* Python coding practice: Paper 1 Section D practice on the AQA 2027 skeleton program "Piles O' Tiles" (P.5).
   One problem per P.5 modification task that has a model answer. The starter is the real skeleton; the
   solution is the skeleton with the P.5 model answer applied (potPatch fails loudly if an edit doesn't match).
   eofOk: the game never ends on its own, so running out of test input ends the program cleanly.
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
const POT_SKELETON = `#Skeleton Program code for the AQA A Level Paper 1 Summer 2027 examination
#this code should be used in conjunction with the Preliminary Material
#written by the AQA Programmer Team
#developed in the Python 3.9 programming environment

import math

def Main():
    Board = []
    Players = []
    Discard = []
    TurnsSinceMatch = 0
    WhoseTurn = 0
    MaxScore = 10
    FILE_EXTENSION = ".txt"
    FileName = input("Enter filename to load or just press Enter to play the default game: ") + FILE_EXTENSION
    UseDataFromFile = False
    if FileName != FILE_EXTENSION:
        UseDataFromFile, Board, Players, Discard, MaxScore, WhoseTurn, TurnsSinceMatch = LoadGame(FileName)   
        if UseDataFromFile == False:
            print("Setting up default game")
    if UseDataFromFile == False:
        Players.append(Player("Player 1", 0))
        Players.append(Player("Player 2", 0))
        for Count in range(1, 37):
            P = Pile(3, 0)
            P.Add(Tile("A", 1))
            P.Add(Tile("B", 2))
            P.Add(Tile("A", 1))
            Board.append(P)
    ThisGame = Game(Board, Players, Discard, WhoseTurn, MaxScore, TurnsSinceMatch)
    ThisGame.PlayGame()
    input()

def LoadGame(FileName):
    Board = []
    Players = []
    Discard = []
    MaxScore = 0
    WhoseTurn = 0
    TurnsSinceMatch = 0
    try:
        with open(FileName) as File:
            LineFromFile = File.readline()
            BoardSize = int(LineFromFile)
            for i in range(1, BoardSize + 1):
                LineFromFile = File.readline()
                Items = LineFromFile.split(",")
                PileSize = len(Items) // 2
                P = Pile(PileSize, int(Items[0]))
                for TileNo in range(len(Items) - 2, -1, -2):
                    P.Add(Tile(Items[TileNo], int(Items[TileNo + 1])))
                Board.append(P)
            LineFromFile = File.readline()
            NoOfPlayers = int(LineFromFile)
            for i in range (1, NoOfPlayers + 1):
                LineFromFile = File.readline()
                Items = LineFromFile.split(",")
                Players.append(Player(Items[0], int(Items[1])))
            LineFromFile = File.readline()
            Items = LineFromFile.split(",")
            for i in range(0, len(Items) - 1, 2):
                Discard.append(Tile(Items[i], int(Items[i + 1])))
            LineFromFile = File.readline()
            MaxScore = int(LineFromFile)
            LineFromFile = File.readline()
            WhoseTurn = int(LineFromFile)
            LineFromFile = File.readline()
            TurnsSinceMatch = int(LineFromFile)
    except:
        print("File not loaded")
        return False, Board, Players, Discard, MaxScore, WhoseTurn, TurnsSinceMatch
    return True, Board, Players, Discard, MaxScore, WhoseTurn, TurnsSinceMatch

class Game():
    def __init__(self, B, P, D, WT, MS, TSM):
        self.__Board = B
        self.__Players = P
        self.__Discard = D
        self.__WhoseTurn = WT
        self.__MaxScore = MS
        self.__TurnsSinceMatch = TSM
        self.__GameOver = False
        self.__GridSize = int(math.sqrt(len(self.__Board)))

    def PlayGame(self):
        while self.__GameOver == False:
            Choice = ""
            while Choice != "T":
                self.__DisplayMenu()
                Choice = self.__GetChoice()
                if Choice == "B":
                    self.__DisplayBoard()
                elif Choice == "D":
                    self.__DisplayDiscard()
                elif Choice == "S":
                    self.__DisplayScores()
            Pile1 = self.__ChoosePile()
            Pile2 = self.__ChoosePile()
            while Pile1 == Pile2:
                Pile2 = self.__ChoosePile()
            self.__TurnsSinceMatch += 1
            if self.__Board[Pile1].Empty() == False and self.__Board[Pile2].Empty() == False:
                if self.__Board[Pile1].GetSymbolOfTopTile() == self.__Board[Pile2].GetSymbolOfTopTile():
                    self.__TurnsSinceMatch = 0
                    Tile1 = self.__Board[Pile1].Remove()
                    Tile2 = self.__Board[Pile2].Remove()
                    self.__Discard.append(Tile1)
                    self.__Discard.append(Tile2)
                    ScoreIncrease = 0
                    ScoreIncrease += Tile1.GetPoints() + Tile2.GetPoints()
                    self.__Players[self.__WhoseTurn].ChangeScore(ScoreIncrease)
                    print(f"{self.__Players[self.__WhoseTurn].GetName()}, you had two matching {Tile1.GetSymbol()} tiles; your score has increased by {ScoreIncrease}")
                else:
                    print("You did not find a matching pair.")
                    print(f"The first pile you chose had a {self.__Board[Pile1].GetSymbolOfTopTile()}")
                    print(f"The second pile you chose had a {self.__Board[Pile2].GetSymbolOfTopTile()}")
            else:
                print("You chose an empty pile")
            print()
            self.__UpdateWhoseTurn()
            self.__GameOver = self.__MaxScoreReached() or self.__NoMoreTilesLeft()
        if self.__Players[0].GetScore() > self.__Players[1].GetScore():
            print(f"{self.__Players[0].GetName()} has won!")
        elif self.__Players[1].GetScore() > self.__Players[0].GetScore():
            print(f"{self.__Players[1].GetName()} has won!")

    def __DisplayScores(self):
        print()
        for P in self.__Players:
            print(f"{P.GetName()}: has a score of {P.GetScore()}")
        print()

    def __DisplayMenu(self):
        print()
        print()
        print("MENU")
        print("B. Display the board")
        print("D. Display the discard")
        print("T. Take turn")
        print("S. Display scores")
        print()

    def __GetChoice(self):
        Choice = input(f"{self.__Players[self.__WhoseTurn].GetName()}, enter your choice: ")
        return Choice

    def __DisplayBoard(self):
        for y in range (self.__GridSize, 0, -1):
            print(f"{y}|", end="")
            for x in range(1, self.__GridSize + 1):
                print(self.__Board[self.__GetIndex(x, y)].GetNumberOfTiles(), end="")
            print()
        print("  ", end="")
        for x in range(1, self.__GridSize + 1):
            print("-", end="")
        print()
        print("  ", end="")
        for x in range (1, self.__GridSize + 1):
            print(x, end="")
        print()

    def __DisplayDiscard(self):
        print()
        print()
        print("Discard: ", end="")
        if len(self.__Discard) == 0:
            print("Empty")
        else:
            print(self.__Discard[0].GetSymbol(), end="")
            Count = 1
            while Count < len(self.__Discard):
                print(f", {self.__Discard[Count].GetSymbol()}", end="")
                Count += 1
        print()
        print()

    def __ChoosePile(self):
        x = 0
        y = 0
        x = int(input("Enter x coordinate: "))
        y = int(input("Enter y coordinate: "))
        return self.__GetIndex(x, y)

    def __GetIndex(self, x, y):
        return x - 1 + ((y - 1) * self.__GridSize)

    def __UpdateWhoseTurn(self):
        self.__WhoseTurn = (self.__WhoseTurn + 1) % len(self.__Players)

    def __NoMoreTilesLeft(self):
        for P in self.__Board:
            if P.Empty() == False:
                return False
        return True

    def __MaxScoreReached(self):
        for P in self.__Players:
            if P.GetScore() >= self.__MaxScore:
                return True
        return False

class Tile():
    def __init__(self, S, P):
        self._Symbol = S
        self._Points = P

    def GetPoints(self):
        return self._Points

    def GetSymbol(self):
        return self._Symbol

class Player():
    def __init__(self, N, S):
        self._Name = N
        self._Score = S

    def GetScore(self):
        return self._Score

    def GetName(self):
        return self._Name

    def ChangeScore(self, Change):
        self._Score += Change

class Pile():
    def __init__(self, M, B):
        self._Tiles = []
        self._Max = M
        self._Bonus = B

    def Add(self, T):
        if len(self._Tiles) < self._Max:
            self._Tiles.insert(0, T)

    def GetSymbolOfTopTile(self):
        return self._Tiles[0].GetSymbol()

    def Remove(self):
        Temp = self._Tiles[0]
        self._Tiles.pop(0)
        return Temp

    def Empty(self):
        if len(self._Tiles) == 0:
            return True
        else:
            return False

    def GetNumberOfTiles(self):
        return len(self._Tiles)

if __name__ == "__main__":
    Main()
`;

const POT_GAME1 = `16
2,A,1,E,1,H,3,J,2
0,E,1,Q,4,K,4,J,2,J,2
0,O,1,E,1,H,3
0,O,1,E,1,H,3
0,A,1,E,1,H,3
0,A,1,H,1,H,3
0,E,1,E,1,H,3
0,A,1,Q,4,F,3
0,U,1,E,1,H,3
0,A,1,E,1,H,3
4,U,5,E,1,K,4
2,A,1,K,4,H,3
0,A,1,E,1,K,1
0,R,1,K,3,H,3
0,R,1,F,3,K,7
0,A,1,E,1,H,3
2
Boris,0
Poppy,0

15
0
0
`;

(function () {
  // Apply [old, new] edits to the skeleton; every old text must occur exactly once.
  function potPatch(edits) {
    let src = POT_SKELETON;
    edits.forEach(function (e) {
      const n = src.split(e[0]).length - 1;
      if (n !== 1) throw new Error("pot-section-d: edit text found " + n + " times: " + e[0].slice(0, 60));
      src = src.replace(e[0], function () { return e[1]; });
    });
    return src;
  }
  const potFiles = function (extra) { return Object.assign({ "game1.txt": POT_GAME1 }, extra || {}); };

  CS.registerProblems([
    {
    id: "pot-d-menu",
    title: "Accept lowercase and reject invalid menu choices",
    topic: "P.5",
    difficulty: 2,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 1.** *Likely size: Q12-size · ~5 marks*

Change **\`Game.__GetChoice\`** so that:
- lowercase input is accepted (\`t\` works like \`T\`), and
- anything that isn't B, D, T or S prints the message below and asks again, with the same prompt, until the choice is valid.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`That is not a valid menu option\`

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Default game. Enter \`x\`, then \`t\`, then (1,1) and (2,1).`,
    starter: POT_SKELETON,
    files: potFiles(),
    tests: [
      { name: "Screenshot test: x, then t, then a match", input: "\nx\nt\n1\n1\n2\n1\n", expect: "That is not a valid menu option\nPlayer 1, you had two matching A tiles; your score has increased by 2" },
      { name: "lowercase b, d and s work", input: "\nb\nd\ns\n", expect: "6|333333\nDiscard: Empty\nPlayer 1: has a score of 0", hidden: true },
      { name: "several invalid choices in a row (including an empty line)", input: "\n\nQ\ntt\nT\n1\n1\n2\n1\n", expect: "That is not a valid menu option\nThat is not a valid menu option\nThat is not a valid menu option\nPlayer 1, you had two matching A tiles; your score has increased by 2", hidden: true },
      { name: "capital letters still work as before", input: "game1\nS\nT\n1\n1\n1\n2\n", expect: "Boris: has a score of 0\nBoris, you had two matching A tiles; your score has increased by 2", hidden: true }
    ],
    hints: [
      `\`.upper()\` on the input fixes the case problem.`,
      `Loop \`while Choice not in [...]\`, re-prompting **inside** the loop. Copy the original prompt exactly.`
    ],
    answer: `**Game.__GetChoice (replace the whole method)**

\`\`\`python
    def __GetChoice(self):
        Choice = input(f"{self.__Players[self.__WhoseTurn].GetName()}, enter your choice: ").upper()
        while Choice not in ["B", "D", "T", "S"]:
            print("That is not a valid menu option")
            Choice = input(f"{self.__Players[self.__WhoseTurn].GetName()}, enter your choice: ").upper()
        return Choice
\`\`\``,
    solution: potPatch([
      [`    def __GetChoice(self):
        Choice = input(f"{self.__Players[self.__WhoseTurn].GetName()}, enter your choice: ")
        return Choice
`,
       `    def __GetChoice(self):
        Choice = input(f"{self.__Players[self.__WhoseTurn].GetName()}, enter your choice: ").upper()
        while Choice not in ["B", "D", "T", "S"]:
            print("That is not a valid menu option")
            Choice = input(f"{self.__Players[self.__WhoseTurn].GetName()}, enter your choice: ").upper()
        return Choice
`]
    ]),
    explain: `**Why it works.** \`.upper()\` is applied to every input, so \`t\` becomes \`T\` before any comparison. The \`while Choice not in [...]\` loop re-prompts until the choice is valid, so \`PlayGame\` never sees a bad letter.

**Common mistakes.**
- Validating with an \`if\` instead of a loop: a second invalid entry gets through.
- Forgetting \`.upper()\` on the *second* \`input\` inside the loop, so \`x\` then \`t\` is still rejected.
- Changing the prompt text. Copy it exactly.

**What the examiner looks for.** The \`.upper()\`, a loop with the right condition, the message, re-prompting inside the loop, and the whole method pasted. In the exam you must also show the screenshot test (\`x\`, then \`t\`) with the inputs and the message visible.`
  },
    {
    id: "pot-d-loadfix",
    title: "Fix the failed-load bug",
    topic: "P.5",
    difficulty: 2,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 2.** *Likely size: Q12-size · ~4 marks*

When a file fails to load, \`LoadGame\` returns \`False\` together with whatever it had read so far (and \`MaxScore\` 0). Change **\`Main\`** so that after a failed load the default game starts properly: an empty board and empty player and discard lists before the defaults are added, \`MaxScore\` 10, \`WhoseTurn\` 0 and \`TurnsSinceMatch\` 0.

Keep the existing messages (\`File not loaded\`, \`Setting up default game\`). No new messages are needed.

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Enter \`wrong\` as the filename (there is no \`wrong.txt\`), Player 1 matches (1,1)+(2,1), then chooses \`S\`. The game must still be running and show both scores. (Unfixed, the game ends after this match with "Player 1 has won!".)`,
    starter: POT_SKELETON,
    files: potFiles({ "broken.txt": `4
2,A,1
0,A,1
this line is not a pile
0,B,1
2
Amy,0
Ben,0

10
0
0
` }),
    tests: [
      { name: "Screenshot test: failed load, a match, then S", input: "wrong\nT\n1\n1\n2\n1\nS\n", expect: "File not loaded\nSetting up default game\nPlayer 1, you had two matching A tiles; your score has increased by 2\nPlayer 1: has a score of 2\nPlayer 2: has a score of 0" },
      { name: "the game keeps going after several matches", input: "nofile\nT\n1\n1\n2\n1\nT\n3\n1\n4\n1\nT\n5\n1\n6\n1\nS\n", expect: "Player 1, you had two matching A tiles; your score has increased by 2\nPlayer 2, you had two matching A tiles; your score has increased by 2\nPlayer 1, you had two matching A tiles; your score has increased by 2\nPlayer 1: has a score of 4\nPlayer 2: has a score of 2", hidden: true },
      { name: "a file that breaks half-way leaves no extra piles", input: "broken\nB\n", expect: "File not loaded\nSetting up default game\n6|333333\n1|333333", hidden: true },
      { name: "loading game1 still works", input: "game1\nS\nT\n1\n1\n1\n2\n", expect: "Boris: has a score of 0\nPoppy: has a score of 0\nBoris, you had two matching A tiles; your score has increased by 2", hidden: true }
    ],
    hints: [
      `The problem is the unpacking line in \`Main\`: the default values are overwritten even when loading fails.`,
      `Reset all six values inside the existing \`if UseDataFromFile == False:\` block that prints "Setting up default game".`
    ],
    answer: `**Main (extend the 'Setting up default game' block)**

\`\`\`python
        if UseDataFromFile == False:
            print("Setting up default game")
            Board = []
            Players = []
            Discard = []
            MaxScore = 10
            WhoseTurn = 0
            TurnsSinceMatch = 0
\`\`\``,
    solution: potPatch([
      [`        if UseDataFromFile == False:
            print("Setting up default game")
`,
       `        if UseDataFromFile == False:
            print("Setting up default game")
            Board = []
            Players = []
            Discard = []
            MaxScore = 10
            WhoseTurn = 0
            TurnsSinceMatch = 0
`]
    ]),
    explain: `**Why it works.** \`LoadGame\` returns its local lists even when it fails, so \`Main\`'s unpacking overwrites the defaults with half-read data and \`MaxScore\` 0. Resetting all six values inside the \`if UseDataFromFile == False:\` block puts back exactly what a default game needs, before the 36 default piles and two players are added.

**Common mistakes.**
- Resetting only \`MaxScore\`: a file that breaks half-way still leaves its piles on the board (a hidden test checks this).
- Putting the reset in the *second* \`if UseDataFromFile == False:\` block **after** the piles are appended, which wipes the default board.

**What the examiner looks for.** Each value reset in the right place, and the whole of \`Main\` pasted. In the exam you must also show the screenshot test: the failed load, the match, and the scores still being displayed.`
  },
    {
    id: "pot-d-validate",
    title: "Validate the pile coordinates",
    topic: "P.5",
    difficulty: 2,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 3.** *Likely size: Q12-size · ~6 marks*

Change **\`Game.__ChoosePile\`** so it keeps asking until the user enters two whole numbers that are both between 1 and the grid size (\`self.__GridSize\`: 6 for the default game, 4 for game1).
- Read x and then y with \`int(input(...))\` as now, with the same prompts.
- If a coordinate is not a whole number, print the first message below straight away and start again from x.
- If both are whole numbers but either is outside 1 to the grid size, print the second message and start again from x.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`Coordinates must be whole numbers\`
- \`Coordinates must be between 1 and <grid size>\` (e.g. Coordinates must be between 1 and 6)

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Default game. Choose \`T\`, enter \`a\`, then x = \`1\`, y = \`9\`, then (1,1) and (2,1).`,
    starter: POT_SKELETON,
    files: potFiles(),
    tests: [
      { name: "Screenshot test: a letter, then y = 9, then a match", input: "\nT\na\n1\n9\n1\n1\n2\n1\n", expect: "Coordinates must be whole numbers\nCoordinates must be between 1 and 6\nPlayer 1, you had two matching A tiles; your score has increased by 2" },
      { name: "game1 is 4 × 4: 5 and 0 are rejected", input: "game1\nT\n5\n1\n0\n2\n1\n1\n1\n2\n", expect: "Coordinates must be between 1 and 4\nCoordinates must be between 1 and 4\nBoris, you had two matching A tiles; your score has increased by 2", hidden: true },
      { name: "a letter for y, a decimal and a negative number", input: "\nT\n1\nb\n1.5\n-1\n1\n1\n1\n2\n1\n", expect: "Coordinates must be whole numbers\nCoordinates must be whole numbers\nCoordinates must be between 1 and 6\nPlayer 1, you had two matching A tiles; your score has increased by 2", hidden: true },
      { name: "valid coordinates work first time", input: "game1\nT\n2\n1\n3\n1\nT\n4\n4\n4\n2\n", expect: "You did not find a matching pair.\nThe first pile you chose had a E\nThe second pile you chose had a O\nPoppy, you had two matching A tiles; your score has increased by 2", hidden: true }
    ],
    hints: [
      `You need a loop around both inputs, plus \`try/except ValueError\` to catch letters.`,
      `Use \`self.__GridSize\` for the upper bound. Don't hard-code 6, because game1 is 4 × 4. A Boolean flag such as \`Valid\` makes the loop clear.`
    ],
    answer: `**Game.__ChoosePile (replace the whole method)**

\`\`\`python
    def __ChoosePile(self):
        Valid = False
        while not Valid:
            try:
                x = int(input("Enter x coordinate: "))
                y = int(input("Enter y coordinate: "))
                if 1 <= x <= self.__GridSize and 1 <= y <= self.__GridSize:
                    Valid = True
                else:
                    print(f"Coordinates must be between 1 and {self.__GridSize}")
            except ValueError:
                print("Coordinates must be whole numbers")
        return self.__GetIndex(x, y)
\`\`\``,
    solution: potPatch([
      [`    def __ChoosePile(self):
        x = 0
        y = 0
        x = int(input("Enter x coordinate: "))
        y = int(input("Enter y coordinate: "))
        return self.__GetIndex(x, y)
`,
       `    def __ChoosePile(self):
        Valid = False
        while not Valid:
            try:
                x = int(input("Enter x coordinate: "))
                y = int(input("Enter y coordinate: "))
                if 1 <= x <= self.__GridSize and 1 <= y <= self.__GridSize:
                    Valid = True
                else:
                    print(f"Coordinates must be between 1 and {self.__GridSize}")
            except ValueError:
                print("Coordinates must be whole numbers")
        return self.__GetIndex(x, y)
`]
    ]),
    explain: `**Why it works.** The \`try\` catches the \`ValueError\` that \`int()\` raises for \`a\`, \`1.5\` or an empty line, and the range check uses \`self.__GridSize\`, so it works for any square board. The \`Valid\` flag only becomes \`True\` when both coordinates pass, so the loop asks again after either kind of error.

**Common mistakes.**
- Hard-coding 6: game1 is 4 × 4 (a hidden test uses it).
- \`if\` instead of \`while\`: a second bad entry gets through.
- A bare \`except:\`. Catch \`ValueError\` only. (Here a bare \`except:\` would also swallow the signal that ends each test, so the test would time out.)
- Checking \`x\` and \`y\` with \`or\` the wrong way round: both must be in range.

**What the examiner looks for.** A loop, the exception handling, a range check using the grid size, both messages, and the whole method. In the exam you must also show the screenshot test with the bad inputs and both messages visible.`
  },
    {
    id: "pot-d-winner",
    title: "Announce a draw, for any number of players",
    topic: "P.5",
    difficulty: 2,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 4.** *Likely size: Q12/13-size · ~6 marks*

Replace the end-of-game check (the final \`if\`/\`elif\` in **\`Game.PlayGame\`**) so it works for **any number of players**:
- if one player has the highest score, print \`<name> has won!\` as now;
- if the highest score is shared, print the draw message below, with the names of **everyone** on the highest score in player order, joined by \` and \`.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`<name> has won!\`
- \`It is a draw between <names> on <score> points\` (e.g. It is a draw between Amy and Ben on 2 points, or It is a draw between Amy and Ben and Cal on 4 points)

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Load \`d\` (a 4-pile game, provided as \`d.txt\`). Amy matches (1,1)+(2,1), Ben matches (1,2)+(2,2). Every tile has gone, so the game ends.`,
    starter: POT_SKELETON,
    files: potFiles({ "d.txt": `4
0,A,1
0,A,1
0,B,1
0,B,1
2
Amy,0
Ben,0

10
0
0
`, "three.txt": `4
0,A,1
0,A,1
0,B,1
0,B,1
3
Amy,0
Ben,0
Cal,5

10
0
0
`, "part.txt": `4
0,A,1
0,A,1
0,B,1
0,B,1
3
Amy,0
Ben,0
Cal,1

10
0
0
`, "win.txt": `4
0,A,1
0,A,1
0,B,1
0,B,1
2
Amy,1
Ben,0

10
0
0
` }),
    tests: [
      { name: "Screenshot test: Amy and Ben draw", input: "d\nT\n1\n1\n2\n1\nT\n1\n2\n2\n2\n", expect: "Ben, you had two matching B tiles; your score has increased by 2\nIt is a draw between Amy and Ben on 2 points" },
      { name: "three players: the third player wins", input: "three\nT\n1\n1\n2\n1\nT\n1\n2\n2\n2\n", expect: "Ben, you had two matching B tiles; your score has increased by 2\nCal has won!", hidden: true },
      { name: "three players: two of them draw", input: "part\nT\n1\n1\n2\n1\nT\n1\n2\n2\n2\n", expect: "Ben, you had two matching B tiles; your score has increased by 2\nIt is a draw between Amy and Ben on 2 points", hidden: true },
      { name: "a normal two-player win still works", input: "win\nT\n1\n1\n2\n1\nT\n1\n2\n2\n2\n", expect: "Ben, you had two matching B tiles; your score has increased by 2\nAmy has won!", hidden: true }
    ],
    hints: [
      `Two passes: find the highest score, then collect every player who has it.`,
      `If the collected list has length 1 it's a win; otherwise it's a draw. \`' and '.join(...)\` builds the names.`
    ],
    answer: `**Game.PlayGame (replace the final if/elif)**

\`\`\`python
        HighScore = self.__Players[0].GetScore()
        for P in self.__Players:
            if P.GetScore() > HighScore:
                HighScore = P.GetScore()
        Winners = []
        for P in self.__Players:
            if P.GetScore() == HighScore:
                Winners.append(P.GetName())
        if len(Winners) == 1:
            print(f"{Winners[0]} has won!")
        else:
            print(f"It is a draw between {' and '.join(Winners)} on {HighScore} points")
\`\`\``,
    solution: potPatch([
      [`        if self.__Players[0].GetScore() > self.__Players[1].GetScore():
            print(f"{self.__Players[0].GetName()} has won!")
        elif self.__Players[1].GetScore() > self.__Players[0].GetScore():
            print(f"{self.__Players[1].GetName()} has won!")
`,
       `        HighScore = self.__Players[0].GetScore()
        for P in self.__Players:
            if P.GetScore() > HighScore:
                HighScore = P.GetScore()
        Winners = []
        for P in self.__Players:
            if P.GetScore() == HighScore:
                Winners.append(P.GetName())
        if len(Winners) == 1:
            print(f"{Winners[0]} has won!")
        else:
            print(f"It is a draw between {' and '.join(Winners)} on {HighScore} points")
`]
    ]),
    explain: `**Why it works.** The first loop finds the highest score among **all** players; the second collects everyone with that score. One name means a win; more than one means a draw. Nothing depends on there being exactly two players.

**Common mistakes.**
- Starting \`HighScore\` at 0: fine here, but it breaks if scores can go negative. Starting from the first player's score is safer.
- Only comparing \`Players[0]\` and \`Players[1]\`, or printing the draw message when *any* two players tie rather than the top two.
- Forgetting the original prints nothing at all for a draw: that is the bug being fixed.

**What the examiner looks for.** A loop to find the maximum, a loop (or list) to collect the winners, the win/draw decision, and the exact messages. In the exam you must also show the screenshot test ending in the draw message.`
  },
    {
    id: "pot-d-extra",
    title: "Extra turn after a match",
    topic: "P.5",
    difficulty: 2,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 5.** *Likely size: Q13-size · ~5 marks*

Change **\`Game.PlayGame\`** so that a player who finds a matching pair takes another turn. After the match (at the end of the turn, after the blank line) print the message below, and **don't** move on to the next player. After a turn without a match, play passes to the next player as now.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`<name> found a pair and takes another turn\` (e.g. Player 1 found a pair and takes another turn)

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Default game: Player 1 matches (1,1)+(2,1).`,
    starter: POT_SKELETON,
    files: potFiles(),
    tests: [
      { name: "Screenshot test: Player 1 matches", input: "\nT\n1\n1\n2\n1\n", expect: "Player 1, you had two matching A tiles; your score has increased by 2\nPlayer 1 found a pair and takes another turn" },
      { name: "a match keeps the turn, a miss passes it on", input: "\nT\n1\n1\n2\n1\nT\n1\n1\n3\n1\nT\n3\n1\n4\n1\n", expect: "Player 1 found a pair and takes another turn\nYou did not find a matching pair.\nPlayer 2, you had two matching A tiles; your score has increased by 2\nPlayer 2 found a pair and takes another turn", hidden: true },
      { name: "the extra turn's points go to the same player", input: "\nT\n1\n1\n2\n1\nT\n3\n1\n4\n1\nS\n", expect: "Player 1 found a pair and takes another turn\nPlayer 1, you had two matching A tiles; your score has increased by 2\nPlayer 1: has a score of 4\nPlayer 2: has a score of 0", hidden: true },
      { name: "a miss still passes the turn (game1)", input: "game1\nT\n2\n1\n3\n1\nT\n1\n1\n1\n2\n", expect: "You did not find a matching pair.\nPoppy, you had two matching A tiles; your score has increased by 2", hidden: true }
    ],
    hints: [
      `Track whether this turn found a match with a local Boolean, reset at the start of every turn.`,
      `Only call \`__UpdateWhoseTurn()\` when there was no match.`
    ],
    answer: `**Game.PlayGame (just before \`self.__TurnsSinceMatch += 1\`)**

\`\`\`python
            Matched = False
            self.__TurnsSinceMatch += 1
\`\`\`

**Game.PlayGame (match branch)**

\`\`\`python
                    self.__TurnsSinceMatch = 0
                    Matched = True
                    Tile1
\`\`\`

**Game.PlayGame (end of the turn)**

\`\`\`python
            print()
            if Matched:
                print(f"{self.__Players[self.__WhoseTurn].GetName()} found a pair and takes another turn")
            else:
                self.__UpdateWhoseTurn()
\`\`\``,
    solution: potPatch([
      [`            self.__TurnsSinceMatch += 1
`,
       `            Matched = False
            self.__TurnsSinceMatch += 1
`],
      [`                    self.__TurnsSinceMatch = 0
`,
       `                    self.__TurnsSinceMatch = 0
                    Matched = True
`],
      [`            print()
            self.__UpdateWhoseTurn()
`,
       `            print()
            if Matched:
                print(f"{self.__Players[self.__WhoseTurn].GetName()} found a pair and takes another turn")
            else:
                self.__UpdateWhoseTurn()
`]
    ]),
    explain: `**Why it works.** \`Matched\` is reset to \`False\` at the start of every turn and set to \`True\` only in the match branch. At the end of the turn, \`__UpdateWhoseTurn()\` is only called when there was no match, so the same player goes again.

**Common mistakes.**
- Setting \`Matched = False\` once, before the outer loop: after the first match it stays \`True\` for ever.
- Using a \`Game\` attribute when a local variable is enough (not wrong, but more to explain).
- Printing the message before the score message, or for the wrong player (print it **before** changing the turn).

**What the examiner looks for.** The flag being initialised, set in the match branch, the condition around \`__UpdateWhoseTurn()\`, and the message. In the exam you must also show the screenshot test with the message after the match.`
  },
    {
    id: "pot-d-stalemate",
    title: "End the game after 10 turns without a match",
    topic: "P.5",
    difficulty: 2,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 6.** *Likely size: Q13-size · ~5 marks*

\`self.__TurnsSinceMatch\` is already counted (incremented every turn, reset to 0 by a match) but nothing uses it. Change **\`Game.PlayGame\`** so that when it reaches 10, the message below is printed and the game ends (the existing winner check then runs as normal).

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`No match in the last 10 turns - the game is over\`

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Default game: Player 1 matches (1,1)+(2,1), then the players choose (1,1)+(3,1) ten times (B against A each time).`,
    starter: POT_SKELETON,
    files: potFiles({ "stale.txt": `16
2,A,1,E,1,H,3,J,2
0,E,1,Q,4,K,4,J,2,J,2
0,O,1,E,1,H,3
0,O,1,E,1,H,3
0,A,1,E,1,H,3
0,A,1,H,1,H,3
0,E,1,E,1,H,3
0,A,1,Q,4,F,3
0,U,1,E,1,H,3
0,A,1,E,1,H,3
4,U,5,E,1,K,4
2,A,1,K,4,H,3
0,A,1,E,1,K,1
0,R,1,K,3,H,3
0,R,1,F,3,K,7
0,A,1,E,1,H,3
2
Boris,0
Poppy,0

15
0
8
` }),
    tests: [
      { name: "Screenshot test: a match then ten misses", input: "\nT\n1\n1\n2\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\n", expect: "You did not find a matching pair.\nNo match in the last 10 turns - the game is over\nPlayer 1 has won!" },
      { name: "a match resets the count", input: "\nT\n1\n1\n2\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n4\n1\n5\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nT\n1\n1\n3\n1\nS\n", expect: "Player 1, you had two matching A tiles; your score has increased by 2\nPlayer 1, you had two matching A tiles; your score has increased by 2\nPlayer 1: has a score of 4\nPlayer 2: has a score of 0", hidden: true },
      { name: "the count loaded from the file is used (8 + 2 misses)", input: "stale\nT\n2\n1\n3\n1\nT\n2\n1\n3\n1\n", expect: "You did not find a matching pair.\nYou did not find a matching pair.\nNo match in the last 10 turns - the game is over", hidden: true }
    ],
    hints: [
      `The counter already works (it is incremented every turn and reset on a match). You only need to act on it.`,
      `Check it where \`__GameOver\` is set, before the other two conditions.`
    ],
    answer: `**Game.PlayGame (replace the GameOver line)**

\`\`\`python
            if self.__TurnsSinceMatch >= 10:
                print("No match in the last 10 turns - the game is over")
                self.__GameOver = True
            else:
                self.__GameOver = self.__MaxScoreReached() or self.__NoMoreTilesLeft()
\`\`\``,
    solution: potPatch([
      [`            self.__GameOver = self.__MaxScoreReached() or self.__NoMoreTilesLeft()
`,
       `            if self.__TurnsSinceMatch >= 10:
                print("No match in the last 10 turns - the game is over")
                self.__GameOver = True
            else:
                self.__GameOver = self.__MaxScoreReached() or self.__NoMoreTilesLeft()
`]
    ]),
    explain: `**Why it works.** The check runs at the end of every turn, where \`__GameOver\` is set. When the counter reaches 10 it prints the message and sets \`__GameOver\`, so the outer loop stops and the normal winner check runs. Otherwise the usual two conditions decide.

**Common mistakes.**
- Writing \`self.__GameOver = True\` and then letting the next line overwrite it with \`self.__MaxScoreReached() or ...\` (the game never ends).
- Using a new counter instead of \`__TurnsSinceMatch\`, which also ignores the value loaded from the file (a hidden test loads 8).
- Counting all misses ever, instead of misses since the last match.

**What the examiner looks for.** The comparison with 10, the message, ending the game, and keeping the old end conditions. In the exam you must also show the screenshot test ending with the message and the winner.`
  },
    {
    id: "pot-d-bonus",
    title: "Use the pile bonus",
    topic: "P.5",
    difficulty: 2,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 7.** *Likely size: Q13-size · ~6 marks*

Each pile has a bonus (\`_Bonus\`, the first number on each pile line of the file) that the skeleton never uses. When a matching pair is found, add the bonus of **both** piles to the score increase (so the existing message shows the bigger total).
- Add a getter **\`GetBonus\`** to **\`Pile\`**.
- Change the match branch of **\`Game.PlayGame\`**.

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Load \`game1\`; Boris chooses (1,1) [bonus 2] and (1,2) [bonus 0], so the score increases by 4.`,
    starter: POT_SKELETON,
    files: potFiles(),
    tests: [
      { name: "Screenshot test: game1, (1,1) and (1,2)", input: "game1\nT\n1\n1\n1\n2\n", expect: "Boris, you had two matching A tiles; your score has increased by 4" },
      { name: "bonuses from two piles", input: "game1\nT\n1\n1\n4\n3\nT\n3\n3\n1\n3\nS\n", expect: "Boris, you had two matching A tiles; your score has increased by 6\nPoppy, you had two matching U tiles; your score has increased by 10\nBoris: has a score of 6\nPoppy: has a score of 10", hidden: true },
      { name: "piles with no bonus score as before", input: "\nT\n1\n1\n2\n1\nS\n", expect: "Player 1, you had two matching A tiles; your score has increased by 2\nPlayer 1: has a score of 2", hidden: true }
    ],
    hints: [
      `\`Pile\` has no way to read \`_Bonus\` from outside, so add a getter first.`,
      `Add the bonuses to \`ScoreIncrease\` **before** \`ChangeScore\` is called. (A variant awards the bonus only when a pile is emptied: see the new task below.)`
    ],
    answer: `**Pile (new method after GetNumberOfTiles)**

\`\`\`python
    def GetNumberOfTiles(self):
        return len(self._Tiles)

    def GetBonus(self):
        return self._Bonus
\`\`\`

**Game.PlayGame (match branch)**

\`\`\`python
                    ScoreIncrease += Tile1.GetPoints() + Tile2.GetPoints()
                    ScoreIncrease += self.__Board[Pile1].GetBonus() + self.__Board[Pile2].GetBonus()
\`\`\``,
    solution: potPatch([
      [`    def GetNumberOfTiles(self):
        return len(self._Tiles)
`,
       `    def GetNumberOfTiles(self):
        return len(self._Tiles)

    def GetBonus(self):
        return self._Bonus
`],
      [`                    ScoreIncrease += Tile1.GetPoints() + Tile2.GetPoints()
`,
       `                    ScoreIncrease += Tile1.GetPoints() + Tile2.GetPoints()
                    ScoreIncrease += self.__Board[Pile1].GetBonus() + self.__Board[Pile2].GetBonus()
`]
    ]),
    explain: `**Why it works.** \`_Bonus\` is protected, so \`Game\` reads it through the new \`GetBonus\` method. Both bonuses are added to \`ScoreIncrease\` **before** \`ChangeScore\` is called, so the score and the message agree.

**Common mistakes.**
- Reading \`self.__Board[Pile1]._Bonus\` directly from \`Game\`: it works in Python, but it breaks encapsulation and loses the "getter in the right class" mark.
- Adding the bonus after \`ChangeScore\`, so the message and the score disagree.
- Adding only one pile's bonus.

**What the examiner looks for.** The getter in \`Pile\`, the bonuses added to the increase, and the whole changed method(s). In the exam you must also show the screenshot test with the increase of 4.`
  },
    {
    id: "pot-d-peek",
    title: "Peek power-up (costs 1 point)",
    topic: "P.5",
    difficulty: 3,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 8.** *Likely size: Q13/14-size · ~8 marks*

Add menu option **P**. The player chooses a pile (with the usual coordinate prompts) and is shown its top symbol, at a cost of 1 point.
- Refuse (without asking for a pile) if the player has less than 1 point.
- Don't charge for an empty pile.
- Peeking doesn't use up the turn: the menu comes back afterwards.

You need a menu line in **\`Game.__DisplayMenu\`**, an \`elif\` in **\`Game.PlayGame\`**, and a new method **\`Game.__Peek\`**.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`P. Peek at a pile (costs 1 point)\` (the menu line)
- \`You need at least 1 point to peek\`
- \`The top tile is <symbol>\`
- \`That pile is empty - no points taken\`

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Default game. Player 1 chooses \`P\` with 0 points (refused), then matches (1,1)+(2,1); Player 2 matches (3,1)+(4,1); Player 1 peeks at (3,3), then chooses \`S\`.`,
    starter: POT_SKELETON,
    files: potFiles({ "pk.txt": `4
0
0,A,1
0,B,1,C,1
0,A,1
2
Amy,3
Ben,0

10
0
0
` }),
    tests: [
      { name: "Screenshot test: refused, then a paid peek", input: "\nP\nT\n1\n1\n2\n1\nT\n3\n1\n4\n1\nP\n3\n3\nS\n", expect: "You need at least 1 point to peek\nPlayer 1, you had two matching A tiles; your score has increased by 2\nPlayer 2, you had two matching A tiles; your score has increased by 2\nThe top tile is A\nPlayer 1: has a score of 1\nPlayer 2: has a score of 2" },
      { name: "the menu shows the new option", input: "\nS\n", expect: "P. Peek at a pile (costs 1 point)\nPlayer 1: has a score of 0", hidden: true },
      { name: "an empty pile is free, and peeking doesn't remove the tile", input: "pk\nP\n1\n1\nP\n2\n1\nS\nT\n2\n1\n2\n2\n", expect: "That pile is empty - no points taken\nThe top tile is A\nAmy: has a score of 2\nAmy, you had two matching A tiles; your score has increased by 2", hidden: true },
      { name: "normal turns still work (game1: a miss, then a match)", input: "game1\nT\n2\n1\n3\n1\nT\n1\n1\n1\n2\nS\n", expect: "You did not find a matching pair.\nPoppy, you had two matching A tiles; your score has increased by 2\nBoris: has a score of 0\nPoppy: has a score of 2", hidden: true }
    ],
    hints: [
      `New private method \`__Peek\` in \`Game\`; reuse \`__ChoosePile\`.`,
      `\`ChangeScore(-1)\` works because \`ChangeScore\` adds its argument. Remember the menu text **and** the \`elif\`.`
    ],
    answer: `**Game.PlayGame (menu handling)**

\`\`\`python
                elif Choice == "S":
                    self.__DisplayScores()
                elif Choice == "P":
                    self.__Peek()
\`\`\`

**Game.__DisplayMenu (new line)**

\`\`\`python
        print("S. Display scores")
        print("P. Peek at a pile (costs 1 point)")
\`\`\`

**Game (new method, above __DisplayScores)**

\`\`\`python
    def __Peek(self):
        CurrentPlayer = self.__Players[self.__WhoseTurn]
        if CurrentPlayer.GetScore() < 1:
            print("You need at least 1 point to peek")
        else:
            PileNo = self.__ChoosePile()
            if self.__Board[PileNo].Empty():
                print("That pile is empty - no points taken")
            else:
                CurrentPlayer.ChangeScore(-1)
                print(f"The top tile is {self.__Board[PileNo].GetSymbolOfTopTile()}")

    def __DisplayScores(self):
\`\`\``,
    solution: potPatch([
      [`                elif Choice == "S":
                    self.__DisplayScores()
`,
       `                elif Choice == "S":
                    self.__DisplayScores()
                elif Choice == "P":
                    self.__Peek()
`],
      [`        print("S. Display scores")
`,
       `        print("S. Display scores")
        print("P. Peek at a pile (costs 1 point)")
`],
      [`    def __DisplayScores(self):
`,
       `    def __Peek(self):
        CurrentPlayer = self.__Players[self.__WhoseTurn]
        if CurrentPlayer.GetScore() < 1:
            print("You need at least 1 point to peek")
        else:
            PileNo = self.__ChoosePile()
            if self.__Board[PileNo].Empty():
                print("That pile is empty - no points taken")
            else:
                CurrentPlayer.ChangeScore(-1)
                print(f"The top tile is {self.__Board[PileNo].GetSymbolOfTopTile()}")

    def __DisplayScores(self):
`]
    ]),
    explain: `**Why it works.** \`__Peek\` checks the score first, so a player with 0 points is never asked for a pile. It reuses \`__ChoosePile\` for the coordinates, checks \`Empty()\` before reading the top tile (which would crash on an empty pile), and only then charges with \`ChangeScore(-1)\`. The tile isn't removed, and the inner menu loop carries on until \`T\`.

**Common mistakes.**
- Forgetting the menu line or the \`elif\`: the method can never be called.
- Charging before checking for an empty pile, or calling \`GetSymbolOfTopTile()\` on an empty pile (\`IndexError\`).
- Using \`Remove()\` to look at the tile, which takes it off the pile.

**What the examiner looks for.** The menu line, the \`elif\`, the new method in \`Game\`, the score check, the empty check, the charge and the message. In the exam you must also show the screenshot test: the refusal, the peek, and the scores afterwards.`
  },
    {
    id: "pot-d-save",
    title: "Save the game to a file",
    topic: "P.5",
    difficulty: 3,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 9.** *Likely size: Q14-size · ~11 marks*

Add menu option **V** that asks for a filename, adds \`.txt\`, saves the game in the same format as game1.txt (so it can be loaded again), then prints a confirmation.

The file format, in the order \`LoadGame\` reads it:
1. the number of piles, then one line per pile: its bonus, then \`symbol,points\` for each tile **from the top down** (e.g. \`2,A,1,E,1,H,3,J,2\`; an empty pile is just its bonus);
2. the number of players, then one \`name,score\` line each;
3. the discard as \`symbol,points,symbol,points…\` with no trailing comma (an **empty line** if the discard is empty);
4. \`MaxScore\`, \`WhoseTurn\` and \`TurnsSinceMatch\`, one per line.

You need a menu line, an \`elif\`, a new method in **\`Game\`** and (recommended) a method in **\`Pile\`** that builds a pile's line, so \`Game\` doesn't touch \`Pile\`'s protected data.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`V. Save game\` (the menu line)
- \`Enter filename to save to: \` (the prompt; not checked)
- \`Game saved to <name>.txt\` (e.g. Game saved to saved1.txt)

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Load \`game1\`, Boris matches (1,1)+(1,2), Poppy chooses \`V\` and saves as \`saved1\`. A second visible test loads \`quick.txt\`, saves as \`out\`, plays until someone wins, then reloads \`out.txt\` with the skeleton's own \`LoadGame\` and prints what it read.`,
    starter: POT_SKELETON,
    files: potFiles({ "quick.txt": `4
1,A,1,C,2
0,A,1
0,B,3
0,B,3,D,1
2
Amy,4
Ben,1
C,2,E,1
5
1
2
`, "end.txt": `4
0,A,1
0,A,1
0,B,1
0,B,1
2
Amy,0
Ben,0

2
0
0
` }),
    tests: [
      { name: "Screenshot test: game1, a match, then save as saved1", input: "game1\nT\n1\n1\n1\n2\nV\nsaved1\n", expect: "Boris, you had two matching A tiles; your score has increased by 2\nGame saved to saved1.txt" },
      { name: "the saved file loads again with LoadGame", input: "quick\nV\nout\nT\n1\n1\n2\n1\nT\n1\n2\n2\n2\n\n", code: `Loaded, B, P, D, MS, WT, TSM = LoadGame("out.txt")
print("Loaded:", Loaded)
for Pl in B:
    print("Pile: bonus", Pl._Bonus, "tiles", " ".join(T.GetSymbol() + str(T.GetPoints()) for T in Pl._Tiles))
print("Players:", ", ".join(f"{Q.GetName()} {Q.GetScore()}" for Q in P))
print("Discard:", ", ".join(T.GetSymbol() + str(T.GetPoints()) for T in D))
print("MaxScore", MS, "WhoseTurn", WT, "TurnsSinceMatch", TSM)`, expect: "Game saved to out.txt\nAmy has won!\nLoaded: True\nPile: bonus 1 tiles A1 C2\nPile: bonus 0 tiles A1\nPile: bonus 0 tiles B3\nPile: bonus 0 tiles B3 D1\nPlayers: Amy 4, Ben 1\nDiscard: C2, E1\nMaxScore 5 WhoseTurn 1 TurnsSinceMatch 2" },
      { name: "the menu shows the new option", input: "\nS\n", expect: "V. Save game\nPlayer 1: has a score of 0", hidden: true },
      { name: "an empty discard, and saving mid-game", input: "end\nV\nstart\nT\n1\n1\n2\n1\n\n", code: `Loaded, B, P, D, MS, WT, TSM = LoadGame("start.txt")
print("Loaded:", Loaded, "piles", len(B), "discard", len(D))
print("Tops:", " ".join(Pl.GetSymbolOfTopTile() for Pl in B))
print("Players:", ", ".join(f"{Q.GetName()} {Q.GetScore()}" for Q in P))
print("MaxScore", MS, "WhoseTurn", WT, "TurnsSinceMatch", TSM)`, expect: "Game saved to start.txt\nAmy has won!\nLoaded: True piles 4 discard 0\nTops: A A B B\nPlayers: Amy 0, Ben 0\nMaxScore 2 WhoseTurn 0 TurnsSinceMatch 0", hidden: true },
      { name: "normal turns still work (game1: a miss, then a match)", input: "game1\nT\n2\n1\n3\n1\nT\n1\n1\n1\n2\nS\n", expect: "You did not find a matching pair.\nPoppy, you had two matching A tiles; your score has increased by 2\nBoris: has a score of 0\nPoppy: has a score of 2", hidden: true }
    ],
    hints: [
      `Each pile line is the bonus, then symbol,points from the top tile down. A \`Pile\` method that builds this string keeps the protected data inside \`Pile\`.`,
      `Write the lines in the order \`LoadGame\` reads them. Avoid a trailing comma on the discard line, and write an empty line if the discard is empty.`
    ],
    answer: `**Pile (new method after GetNumberOfTiles)**

\`\`\`python
    def GetNumberOfTiles(self):
        return len(self._Tiles)

    def GetSaveString(self):
        Line = str(self._Bonus)
        for T in self._Tiles:
            Line += f",{T.GetSymbol()},{T.GetPoints()}"
        return Line
\`\`\`

**Game.PlayGame (menu handling)**

\`\`\`python
                elif Choice == "S":
                    self.__DisplayScores()
                elif Choice == "V":
                    self.__SaveGame()
\`\`\`

**Game.__DisplayMenu (new line)**

\`\`\`python
        print("S. Display scores")
        print("V. Save game")
\`\`\`

**Game (new method, above __DisplayScores)**

\`\`\`python
    def __SaveGame(self):
        FileName = input("Enter filename to save to: ") + ".txt"
        with open(FileName, "w") as File:
            File.write(f"{len(self.__Board)}\\n")
            for P in self.__Board:
                File.write(P.GetSaveString() + "\\n")
            File.write(f"{len(self.__Players)}\\n")
            for P in self.__Players:
                File.write(f"{P.GetName()},{P.GetScore()}\\n")
            DiscardLine = ""
            for T in self.__Discard:
                if DiscardLine != "":
                    DiscardLine += ","
                DiscardLine += f"{T.GetSymbol()},{T.GetPoints()}"
            File.write(DiscardLine + "\\n")
            File.write(f"{self.__MaxScore}\\n")
            File.write(f"{self.__WhoseTurn}\\n")
            File.write(f"{self.__TurnsSinceMatch}\\n")
        print(f"Game saved to {FileName}")

    def __DisplayScores(self):
\`\`\``,
    solution: potPatch([
      [`    def GetNumberOfTiles(self):
        return len(self._Tiles)
`,
       `    def GetNumberOfTiles(self):
        return len(self._Tiles)

    def GetSaveString(self):
        Line = str(self._Bonus)
        for T in self._Tiles:
            Line += f",{T.GetSymbol()},{T.GetPoints()}"
        return Line
`],
      [`                elif Choice == "S":
                    self.__DisplayScores()
`,
       `                elif Choice == "S":
                    self.__DisplayScores()
                elif Choice == "V":
                    self.__SaveGame()
`],
      [`        print("S. Display scores")
`,
       `        print("S. Display scores")
        print("V. Save game")
`],
      [`    def __DisplayScores(self):
`,
       `    def __SaveGame(self):
        FileName = input("Enter filename to save to: ") + ".txt"
        with open(FileName, "w") as File:
            File.write(f"{len(self.__Board)}\\n")
            for P in self.__Board:
                File.write(P.GetSaveString() + "\\n")
            File.write(f"{len(self.__Players)}\\n")
            for P in self.__Players:
                File.write(f"{P.GetName()},{P.GetScore()}\\n")
            DiscardLine = ""
            for T in self.__Discard:
                if DiscardLine != "":
                    DiscardLine += ","
                DiscardLine += f"{T.GetSymbol()},{T.GetPoints()}"
            File.write(DiscardLine + "\\n")
            File.write(f"{self.__MaxScore}\\n")
            File.write(f"{self.__WhoseTurn}\\n")
            File.write(f"{self.__TurnsSinceMatch}\\n")
        print(f"Game saved to {FileName}")

    def __DisplayScores(self):
`]
    ]),
    explain: `**Why it works.** The file is written in exactly the order \`LoadGame\` reads it. \`Pile._Tiles[0]\` is the top tile and \`LoadGame\` adds tiles from the end of each line, so writing the tiles from index 0 onwards puts the top tile first again. Building the discard line with a separator only *between* items avoids a trailing comma, and an empty discard still gets its (empty) line so the next three numbers stay in place.

**Common mistakes.**
- Writing the tiles in the wrong order (the reloaded piles come back upside down).
- Leaving out the empty discard line, so \`MaxScore\` is read from the wrong line and the load fails.
- Forgetting \`"\\n"\` at the end of each line, or forgetting to add \`.txt\`.
- Reading \`P._Tiles\` from \`Game\` instead of adding a \`Pile\` method (loses the encapsulation mark).

**What the examiner looks for.** The menu line and \`elif\`, the new method(s) in the right classes, each section of the file in the right order, and the confirmation message. In the exam you must also show the screenshot test **and** evidence that the saved file loads (restart, load \`saved1\`, display the board, discard and scores).`
  },
    {
    id: "pot-d-computer",
    title: "A computer player with a memory",
    topic: "P.5",
    difficulty: 3,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 10.** *Likely size: Q15-size · ~13 marks*

Create a **\`ComputerPlayer\`** subclass of **\`Player\`** (call \`super().__init__\`). Player 2 in the default game should be \`ComputerPlayer("Computer", 0)\`.
- On the computer's turn there is no menu: it chooses two piles itself, prints the message below, and the turn carries on as normal (match or no match).
- It remembers every symbol revealed in a non-matching turn, and forgets piles whose top tiles are removed by a match.
- It picks a remembered pair if it knows one, otherwise two different random non-empty piles.

So that the auto-check can test the memory, give \`ComputerPlayer\` these methods (pile numbers are indexes into the board list, 0 to \`len(Board) - 1\`):
- \`Remember(PileIndex, Symbol)\` and \`Forget(PileIndex)\`;
- \`ChoosePiles(Board)\`, which returns the two pile indexes it will play.

\`Game\` must tell every computer player what was revealed (remember both piles on a miss, forget both on a match). You'll need \`import random\`.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`Computer chose (<x>, <y>) and (<x>, <y>)\` (the coordinates as Python prints a tuple, e.g. Computer chose (4, 3) and (5, 6))

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Default game: Player 1 matches (1,1)+(2,1); the computer then plays automatically. Its choice is random, so the test only checks that it announced its move.`,
    starter: POT_SKELETON,
    files: potFiles(),
    tests: [
      { name: "Screenshot test: Player 1 matches, then the computer plays", input: "\nT\n1\n1\n2\n1\n", expect: "Player 1, you had two matching A tiles; your score has increased by 2\nComputer chose (" },
      { name: "after the computer's turn it is Player 1's turn again", input: "\nT\n1\n1\n2\n1\nS\n", expect: "Player 1, you had two matching A tiles; your score has increased by 2\nComputer chose (\nPlayer 1: has a score of 2\nComputer: has a score of", hidden: true },
      { name: "ComputerPlayer's memory (a failed load leaves MaxScore 0, so this game ends after one turn and the check code runs)", input: "nofile\nT\n1\n1\n2\n1\n\n", code: `C = ComputerPlayer("Robot", 0)
print("ComputerPlayer is a Player:", isinstance(C, Player), C.GetName(), C.GetScore())
Board = []
for i in range(16):
    NewPile = Pile(3, 0)
    NewPile.Add(Tile("A", 1))
    Board.append(NewPile)
C.Remember(3, "K")
C.Remember(5, "B")
C.Remember(9, "K")
print("Known pair chosen:", sorted(C.ChoosePiles(Board)))
C.Forget(9)
Small = []
for i in range(4):
    Small.append(Pile(3, 0))
Small[1].Add(Tile("A", 1))
Small[2].Add(Tile("B", 1))
print("No known pair, only piles 1 and 2 are not empty:", sorted(C.ChoosePiles(Small)))`, expect: "Player 1 has won!\nComputerPlayer is a Player: True Robot 0\nKnown pair chosen: [3, 9]\nNo known pair, only piles 1 and 2 are not empty: [1, 2]", hidden: true }
    ],
    hints: [
      `Inherit with \`class ComputerPlayer(Player)\` and call \`super().__init__\`. A dictionary of pile index → symbol is a good memory.`,
      `\`Game\` must tell computer players what was revealed (remember on a miss; forget both piles on a match because their top tiles change). Use \`isinstance\` to decide whether to show the menu. Convert index → (x, y) with \`%\` and \`//\` to print its choice.`
    ],
    answer: `**Top of file**

\`\`\`python
import math
import random
\`\`\`

**Main (second player)**

\`\`\`python
        Players.append(ComputerPlayer("Computer", 0))
\`\`\`

**Game.PlayGame (start of the outer loop: replace the menu loop and pile choice)**

\`\`\`python
            CurrentPlayer = self.__Players[self.__WhoseTurn]
            if isinstance(CurrentPlayer, ComputerPlayer):
                Pile1, Pile2 = CurrentPlayer.ChoosePiles(self.__Board)
                print(f"{CurrentPlayer.GetName()} chose {self.__GetCoordinates(Pile1)} and {self.__GetCoordinates(Pile2)}")
            else:
                Choice = ""
                while Choice != "T":
                    self.__DisplayMenu()
                    Choice = self.__GetChoice()
                    if Choice == "B":
                        self.__DisplayBoard()
                    elif Choice == "D":
                        self.__DisplayDiscard()
                    elif Choice == "S":
                        self.__DisplayScores()
                Pile1 = self.__ChoosePile()
                Pile2 = self.__ChoosePile()
                while Pile1 == Pile2:
                    Pile2 = self.__ChoosePile()
\`\`\`

**Game.PlayGame (match branch)**

\`\`\`python
                    self.__TurnsSinceMatch = 0
                    self.__TellComputers(Pile1, Pile2, False)
                    Tile1 = self.__Board[Pile1].Remove()
\`\`\`

**Game.PlayGame (no-match branch)**

\`\`\`python
                else:
                    self.__TellComputers(Pile1, Pile2, True)
                    print("You did not find a matching pair.")
\`\`\`

**Game (two new methods, above __DisplayScores)**

\`\`\`python
    def __TellComputers(self, Pile1, Pile2, Remember):
        for P in self.__Players:
            if isinstance(P, ComputerPlayer):
                if Remember:
                    P.Remember(Pile1, self.__Board[Pile1].GetSymbolOfTopTile())
                    P.Remember(Pile2, self.__Board[Pile2].GetSymbolOfTopTile())
                else:
                    P.Forget(Pile1)
                    P.Forget(Pile2)

    def __GetCoordinates(self, Index):
        return (Index % self.__GridSize + 1, Index // self.__GridSize + 1)

    def __DisplayScores(self):
\`\`\`

**New class (place above class Pile)**

\`\`\`python
class ComputerPlayer(Player):
    def __init__(self, N, S):
        super().__init__(N, S)
        self._Memory = {}

    def Remember(self, PileIndex, Symbol):
        self._Memory[PileIndex] = Symbol

    def Forget(self, PileIndex):
        if PileIndex in self._Memory:
            del self._Memory[PileIndex]

    def ChoosePiles(self, Board):
        SeenAt = {}
        for PileIndex in self._Memory:
            Symbol = self._Memory[PileIndex]
            if Symbol in SeenAt:
                return SeenAt[Symbol], PileIndex
            SeenAt[Symbol] = PileIndex
        NonEmpty = []
        for i in range(len(Board)):
            if not Board[i].Empty():
                NonEmpty.append(i)
        if len(NonEmpty) >= 2:
            return tuple(random.sample(NonEmpty, 2))
        return tuple(random.sample(range(len(Board)), 2))

class Pile():
\`\`\``,
    solution: potPatch([
      [`import math
`,
       `import math
import random
`],
      [`        Players.append(Player("Player 2", 0))
`,
       `        Players.append(ComputerPlayer("Computer", 0))
`],
      [`            Choice = ""
            while Choice != "T":
                self.__DisplayMenu()
                Choice = self.__GetChoice()
                if Choice == "B":
                    self.__DisplayBoard()
                elif Choice == "D":
                    self.__DisplayDiscard()
                elif Choice == "S":
                    self.__DisplayScores()
            Pile1 = self.__ChoosePile()
            Pile2 = self.__ChoosePile()
            while Pile1 == Pile2:
                Pile2 = self.__ChoosePile()
`,
       `            CurrentPlayer = self.__Players[self.__WhoseTurn]
            if isinstance(CurrentPlayer, ComputerPlayer):
                Pile1, Pile2 = CurrentPlayer.ChoosePiles(self.__Board)
                print(f"{CurrentPlayer.GetName()} chose {self.__GetCoordinates(Pile1)} and {self.__GetCoordinates(Pile2)}")
            else:
                Choice = ""
                while Choice != "T":
                    self.__DisplayMenu()
                    Choice = self.__GetChoice()
                    if Choice == "B":
                        self.__DisplayBoard()
                    elif Choice == "D":
                        self.__DisplayDiscard()
                    elif Choice == "S":
                        self.__DisplayScores()
                Pile1 = self.__ChoosePile()
                Pile2 = self.__ChoosePile()
                while Pile1 == Pile2:
                    Pile2 = self.__ChoosePile()
`],
      [`                    self.__TurnsSinceMatch = 0
`,
       `                    self.__TurnsSinceMatch = 0
                    self.__TellComputers(Pile1, Pile2, False)
`],
      [`                else:
                    print("You did not find a matching pair.")
`,
       `                else:
                    self.__TellComputers(Pile1, Pile2, True)
                    print("You did not find a matching pair.")
`],
      [`    def __DisplayScores(self):
`,
       `    def __TellComputers(self, Pile1, Pile2, Remember):
        for P in self.__Players:
            if isinstance(P, ComputerPlayer):
                if Remember:
                    P.Remember(Pile1, self.__Board[Pile1].GetSymbolOfTopTile())
                    P.Remember(Pile2, self.__Board[Pile2].GetSymbolOfTopTile())
                else:
                    P.Forget(Pile1)
                    P.Forget(Pile2)

    def __GetCoordinates(self, Index):
        return (Index % self.__GridSize + 1, Index // self.__GridSize + 1)

    def __DisplayScores(self):
`],
      [`class Pile():
`,
       `class ComputerPlayer(Player):
    def __init__(self, N, S):
        super().__init__(N, S)
        self._Memory = {}

    def Remember(self, PileIndex, Symbol):
        self._Memory[PileIndex] = Symbol

    def Forget(self, PileIndex):
        if PileIndex in self._Memory:
            del self._Memory[PileIndex]

    def ChoosePiles(self, Board):
        SeenAt = {}
        for PileIndex in self._Memory:
            Symbol = self._Memory[PileIndex]
            if Symbol in SeenAt:
                return SeenAt[Symbol], PileIndex
            SeenAt[Symbol] = PileIndex
        NonEmpty = []
        for i in range(len(Board)):
            if not Board[i].Empty():
                NonEmpty.append(i)
        if len(NonEmpty) >= 2:
            return tuple(random.sample(NonEmpty, 2))
        return tuple(random.sample(range(len(Board)), 2))

class Pile():
`]
    ]),
    explain: `**Why it works.** \`ComputerPlayer\` inherits the name and score from \`Player\` and adds a dictionary of pile index → symbol. \`PlayGame\` uses \`isinstance\` to skip the menu for a computer, and \`__TellComputers\` keeps every computer's memory up to date: a miss reveals two symbols, a match changes both tops, so those memories are dropped. \`ChoosePiles\` scans the memory for a symbol seen twice before falling back to random non-empty piles.

**Common mistakes.**
- Forgetting \`super().__init__(N, S)\`, so the computer has no name or score.
- Never forgetting matched piles: the computer then "remembers" tiles that have gone and keeps missing.
- Choosing the same pile twice, or an empty pile, at random.
- Putting the memory in \`Game\` instead of in the \`ComputerPlayer\` that owns it.

**What the examiner looks for.** The subclass and \`super()\` call, the memory attribute and its methods, \`isinstance\` in \`PlayGame\`, the automatic choice, the printed coordinates and the use of remembered pairs. In the exam you must also show the screenshot test: the computer playing automatically, printing its choices (with \`random.seed\` for a repeatable screenshot, as P.5 suggests).`
  },
    {
    id: "pot-d-wild",
    title: "Wild tiles (inheritance + polymorphism)",
    topic: "P.5",
    difficulty: 3,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 11.** *Likely size: Q15-size · ~12 marks*

A tile with symbol \`*\` in a game file is a **wild tile** that matches any symbol.
- Create a **\`WildTile\`** subclass of **\`Tile\`** whose symbol is \`*\`.
- Give **\`Tile\`** a method **\`Matches(OtherTile)\`** that returns whether this tile matches another (same symbol, or the other tile is wild). **\`WildTile\` overrides it** to always return \`True\`.
- In **\`LoadGame\`**, create a \`WildTile\` for a \`*\` and a normal \`Tile\` otherwise.
- In **\`Game.PlayGame\`**, decide whether the two top tiles match by calling \`Matches\` (you'll need a way to get a pile's top tile).

The existing messages don't change: a wild match prints the normal "you had two matching" message.

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Load \`w\` (provided as \`w.txt\`): Amy chooses (1,1) [the wild tile] and (2,1) [an A]; then Ben chooses \`D\`.`,
    starter: POT_SKELETON,
    files: potFiles({ "w.txt": `4
0,*,0,C,1
0,A,1
0,B,1
0,C,1
2
Amy,0
Ben,0

10
0
0
`, "w1.txt": `4
0,*,0,C,1
0,A,1
0,B,1
0,C,1
2
Amy,0
Ben,0

1
0
0
` }),
    tests: [
      { name: "Screenshot test: the wild tile matches an A", input: "w\nT\n1\n1\n2\n1\nD\n", expect: "Amy, you had two matching\ntiles; your score has increased by 1\nDiscard: *, A" },
      { name: "the wild tile chosen second, then a normal pair", input: "w\nT\n2\n1\n1\n1\nT\n1\n1\n4\n1\nD\n", expect: "tiles; your score has increased by 1\nBen, you had two matching C tiles; your score has increased by 2\nDiscard: A, *, C, C", hidden: true },
      { name: "different normal symbols still don't match", input: "w\nT\n2\n1\n1\n2\n", expect: "You did not find a matching pair.\nThe first pile you chose had a A\nThe second pile you chose had a B", hidden: true },
      { name: "WildTile and Matches (w1.txt ends after one match, so the check code runs)", input: "w1\nT\n1\n1\n2\n1\n\n", code: `print("WildTile is a subclass of Tile:", issubclass(WildTile, Tile))
print("WildTile overrides Matches:", WildTile.Matches is not Tile.Matches)
Loaded, B, P, D, MS, WT, TSM = LoadGame("w.txt")
Wild = B[0]._Tiles[0]
print("A * in the file is loaded as a WildTile:", isinstance(Wild, WildTile), Wild.GetSymbol())
print("wild-A", Wild.Matches(Tile("A", 1)), "A-wild", Tile("A", 1).Matches(Wild), "A-A", Tile("A", 1).Matches(Tile("A", 2)), "A-B", Tile("A", 1).Matches(Tile("B", 1)))`, expect: "Amy has won!\nWildTile is a subclass of Tile: True\nWildTile overrides Matches: True\nA * in the file is loaded as a WildTile: True *\nwild-A True A-wild True A-A True A-B False", hidden: true }
    ],
    hints: [
      `Give \`Tile\` a \`Matches(OtherTile)\` method; \`WildTile\` **overrides** it to always return True. That's where the polymorphism marks are.`,
      `Normal tiles must also match when the **other** tile is wild. \`Pile\` needs a \`GetTopTile()\` so \`Game\` can call \`Matches\` on the tile object.`
    ],
    answer: `**LoadGame (tile-reading loop)**

\`\`\`python
                for TileNo in range(len(Items) - 2, -1, -2):
                    if Items[TileNo] == "*":
                        P.Add(WildTile(int(Items[TileNo + 1])))
                    else:
                        P.Add(Tile(Items[TileNo], int(Items[TileNo + 1])))
\`\`\`

**Game.PlayGame (comparison line)**

\`\`\`python
                if self.__Board[Pile1].GetTopTile().Matches(self.__Board[Pile2].GetTopTile()):
\`\`\`

**Tile (new method) and the WildTile subclass**

\`\`\`python
    def GetSymbol(self):
        return self._Symbol

    def Matches(self, OtherTile):
        return self._Symbol == OtherTile.GetSymbol() or OtherTile.GetSymbol() == "*"

class WildTile(Tile):
    def __init__(self, P):
        super().__init__("*", P)

    def Matches(self, OtherTile):
        return True
\`\`\`

**Pile (new method after GetSymbolOfTopTile)**

\`\`\`python
    def GetSymbolOfTopTile(self):
        return self._Tiles[0].GetSymbol()

    def GetTopTile(self):
        return self._Tiles[0]
\`\`\``,
    solution: potPatch([
      [`                for TileNo in range(len(Items) - 2, -1, -2):
                    P.Add(Tile(Items[TileNo], int(Items[TileNo + 1])))
`,
       `                for TileNo in range(len(Items) - 2, -1, -2):
                    if Items[TileNo] == "*":
                        P.Add(WildTile(int(Items[TileNo + 1])))
                    else:
                        P.Add(Tile(Items[TileNo], int(Items[TileNo + 1])))
`],
      [`                if self.__Board[Pile1].GetSymbolOfTopTile() == self.__Board[Pile2].GetSymbolOfTopTile():
`,
       `                if self.__Board[Pile1].GetTopTile().Matches(self.__Board[Pile2].GetTopTile()):
`],
      [`    def GetSymbol(self):
        return self._Symbol
`,
       `    def GetSymbol(self):
        return self._Symbol

    def Matches(self, OtherTile):
        return self._Symbol == OtherTile.GetSymbol() or OtherTile.GetSymbol() == "*"

class WildTile(Tile):
    def __init__(self, P):
        super().__init__("*", P)

    def Matches(self, OtherTile):
        return True
`],
      [`    def GetSymbolOfTopTile(self):
        return self._Tiles[0].GetSymbol()
`,
       `    def GetSymbolOfTopTile(self):
        return self._Tiles[0].GetSymbol()

    def GetTopTile(self):
        return self._Tiles[0]
`]
    ]),
    explain: `**Why it works.** \`Game\` asks the first tile \`Matches(other)\` without knowing which class it is: a normal \`Tile\` runs its own rule (same symbol, or the other one is wild) and a \`WildTile\` runs the overriding version (always \`True\`). That is **polymorphism**: one call, different behaviour depending on the object's class. \`LoadGame\` decides the class once, when the tile is created.

**Common mistakes.**
- Only \`WildTile.Matches\` returns \`True\`, so a normal tile chosen **first** against a wild one doesn't match (a hidden test chooses the wild tile second).
- Writing \`if Symbol == "*"\` checks in \`Game\` instead of overriding: it works, but loses the polymorphism marks.
- Forgetting \`super().__init__("*", P)\` in \`WildTile\`.
- Comparing tiles with \`==\` (that compares objects, not symbols).

**What the examiner looks for.** The subclass with \`super()\`, \`Matches\` in \`Tile\` and the override in \`WildTile\`, the change in \`LoadGame\`, the getter in \`Pile\`, and the call in \`PlayGame\`. In the exam you must also show the screenshot test with the wild match and the discard.`
  },
    {
    id: "pot-d-points",
    title: "A match needs equal points as well as the same symbol",
    topic: "P.5",
    difficulty: 2,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 12.** *Likely size: Q12/13-size · ~6 marks*

Change the rules so two tiles only match if they have the same symbol **and** the same points value (U1 no longer matches U5). When there is no match, show the points of both tiles as well as their symbols, using the messages below instead of the current two lines.
- Add a getter **\`GetPointsOfTopTile\`** to **\`Pile\`**.
- Change the comparison and the no-match messages in **\`Game.PlayGame\`**.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`You did not find a matching pair.\` (unchanged)
- \`The first pile you chose had a <symbol> worth <points>\`
- \`The second pile you chose had a <symbol> worth <points>\`

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Load \`game1\`. Boris chooses (3,3) [U5] and (1,3) [U1]; Poppy chooses (1,1) and (1,2) [A1 and A1].`,
    starter: POT_SKELETON,
    files: potFiles({ "pts.txt": `4
0,K,4
0,K,4
0,K,3
0,A,1
2
Amy,0
Ben,0

20
0
0
` }),
    tests: [
      { name: "Screenshot test: U5 and U1 don't match, A1 and A1 do", input: "game1\nT\n3\n3\n1\n3\nT\n1\n1\n1\n2\n", expect: "You did not find a matching pair.\nThe first pile you chose had a U worth 5\nThe second pile you chose had a U worth 1\nPoppy, you had two matching A tiles; your score has increased by 2" },
      { name: "different symbols with the same points", input: "game1\nT\n2\n1\n3\n1\n", expect: "You did not find a matching pair.\nThe first pile you chose had a E worth 1\nThe second pile you chose had a O worth 1", hidden: true },
      { name: "K4 and K3 don't match, K4 and K4 do", input: "pts\nT\n1\n1\n1\n2\nT\n1\n1\n2\n1\n", expect: "The first pile you chose had a K worth 4\nThe second pile you chose had a K worth 3\nBen, you had two matching K tiles; your score has increased by 8", hidden: true },
      { name: "normal turns still work (game1: a miss, then a match)", input: "game1\nT\n2\n1\n3\n1\nT\n1\n1\n1\n2\nS\n", expect: "You did not find a matching pair.\nPoppy, you had two matching A tiles; your score has increased by 2\nBoris: has a score of 0\nPoppy: has a score of 2", hidden: true }
    ],
    hints: [
      `\`Pile\` can only tell you the top tile's symbol. Add a matching getter for its points.`,
      `Build the condition from two Boolean variables (\`SameSymbol\`, \`SamePoints\`); it is easier to read and to mark than one very long line.`
    ],
    answer: `**Pile (new method after GetSymbolOfTopTile)**

\`\`\`python
    def GetSymbolOfTopTile(self):
        return self._Tiles[0].GetSymbol()

    def GetPointsOfTopTile(self):
        return self._Tiles[0].GetPoints()
\`\`\`

**Game.PlayGame (comparison line)**

\`\`\`python
                SameSymbol = self.__Board[Pile1].GetSymbolOfTopTile() == self.__Board[Pile2].GetSymbolOfTopTile()
                SamePoints = self.__Board[Pile1].GetPointsOfTopTile() == self.__Board[Pile2].GetPointsOfTopTile()
                if SameSymbol and SamePoints:
\`\`\`

**Game.PlayGame (no-match messages)**

\`\`\`python
                    print(f"The first pile you chose had a {self.__Board[Pile1].GetSymbolOfTopTile()} worth {self.__Board[Pile1].GetPointsOfTopTile()}")
                    print(f"The second pile you chose had a {self.__Board[Pile2].GetSymbolOfTopTile()} worth {self.__Board[Pile2].GetPointsOfTopTile()}")
\`\`\``,
    solution: potPatch([
      [`    def GetSymbolOfTopTile(self):
        return self._Tiles[0].GetSymbol()
`,
       `    def GetSymbolOfTopTile(self):
        return self._Tiles[0].GetSymbol()

    def GetPointsOfTopTile(self):
        return self._Tiles[0].GetPoints()
`],
      [`                if self.__Board[Pile1].GetSymbolOfTopTile() == self.__Board[Pile2].GetSymbolOfTopTile():
`,
       `                SameSymbol = self.__Board[Pile1].GetSymbolOfTopTile() == self.__Board[Pile2].GetSymbolOfTopTile()
                SamePoints = self.__Board[Pile1].GetPointsOfTopTile() == self.__Board[Pile2].GetPointsOfTopTile()
                if SameSymbol and SamePoints:
`],
      [`                    print(f"The first pile you chose had a {self.__Board[Pile1].GetSymbolOfTopTile()}")
                    print(f"The second pile you chose had a {self.__Board[Pile2].GetSymbolOfTopTile()}")
`,
       `                    print(f"The first pile you chose had a {self.__Board[Pile1].GetSymbolOfTopTile()} worth {self.__Board[Pile1].GetPointsOfTopTile()}")
                    print(f"The second pile you chose had a {self.__Board[Pile2].GetSymbolOfTopTile()} worth {self.__Board[Pile2].GetPointsOfTopTile()}")
`]
    ]),
    explain: `**Why it works.** \`Pile\` only exposed the top tile's symbol, so the new getter exposes its points the same way. Two named Booleans (\`SameSymbol\`, \`SamePoints\`) make the new rule easy to read, and the \`if\` needs both.

**Common mistakes.**
- Using \`or\` instead of \`and\`.
- Reaching into \`Pile._Tiles\` from \`Game\` instead of adding a getter (loses the encapsulation mark).
- Changing the message wording beyond adding \` worth <points>\`.

**What the examiner looks for.** The new getter in \`Pile\`, the combined condition, the changed messages, and the whole changed method(s). In the exam you must also show the screenshot test: U5 against U1 failing, then A1 against A1 matching.`
  },
    {
    id: "pot-d-penalty",
    title: "Penalty for choosing an empty pile",
    topic: "P.5",
    difficulty: 2,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 13.** *Likely size: Q12-size · ~4 marks*

If a player chooses an empty pile, they lose 1 point, but a score can never go below 0. Replace the "You chose an empty pile" message in **\`Game.PlayGame\`** with one of the two messages below, saying which happened. Choosing two empty piles still costs only 1 point.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`You chose an empty pile - you lose 1 point\`
- \`You chose an empty pile - you have no points to lose\`

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Load \`e\` (provided as \`e.txt\`; pile (1,1) starts empty). Amy chooses (1,1)+(2,1); Ben matches (2,1)+(1,2); Amy chooses (2,2)+(1,1); Ben chooses (1,1)+(2,2); Amy chooses \`S\`.`,
    starter: POT_SKELETON,
    files: potFiles({ "e.txt": `4
0
0,A,1
0,A,1
0,B,1
2
Amy,0
Ben,0

10
0
0
`, "pen.txt": `4
0
0
0,A,1
0,B,1
2
Amy,2
Ben,0

10
0
0
` }),
    tests: [
      { name: "Screenshot test: penalties with and without points", input: "e\nT\n1\n1\n2\n1\nT\n2\n1\n1\n2\nT\n2\n2\n1\n1\nT\n1\n1\n2\n2\nS\n", expect: "You chose an empty pile - you have no points to lose\nBen, you had two matching A tiles; your score has increased by 2\nYou chose an empty pile - you have no points to lose\nYou chose an empty pile - you lose 1 point\nAmy: has a score of 0\nBen: has a score of 1" },
      { name: "never below 0, and two empty piles cost only 1 point", input: "pen\nT\n1\n1\n2\n1\nT\n1\n1\n1\n2\nT\n2\n1\n2\n2\nT\n1\n1\n2\n2\nT\n1\n1\n2\n2\nS\n", expect: "You chose an empty pile - you lose 1 point\nYou chose an empty pile - you have no points to lose\nYou chose an empty pile - you lose 1 point\nYou chose an empty pile - you have no points to lose\nYou chose an empty pile - you have no points to lose\nAmy: has a score of 0\nBen: has a score of 0", hidden: true },
      { name: "normal turns are unchanged", input: "game1\nT\n2\n1\n3\n1\nT\n1\n1\n1\n2\nS\n", expect: "You did not find a matching pair.\nPoppy, you had two matching A tiles; your score has increased by 2\nBoris: has a score of 0\nPoppy: has a score of 2", hidden: true }
    ],
    hints: [
      `Only the \`else\` branch that prints "You chose an empty pile" needs to change.`,
      `Check \`GetScore() > 0\` before calling \`ChangeScore(-1)\`.`
    ],
    answer: `**Game.PlayGame (replace the empty-pile else branch)**

\`\`\`python
            else:
                CurrentPlayer = self.__Players[self.__WhoseTurn]
                if CurrentPlayer.GetScore() > 0:
                    CurrentPlayer.ChangeScore(-1)
                    print("You chose an empty pile - you lose 1 point")
                else:
                    print("You chose an empty pile - you have no points to lose")
\`\`\``,
    solution: potPatch([
      [`            else:
                print("You chose an empty pile")
`,
       `            else:
                CurrentPlayer = self.__Players[self.__WhoseTurn]
                if CurrentPlayer.GetScore() > 0:
                    CurrentPlayer.ChangeScore(-1)
                    print("You chose an empty pile - you lose 1 point")
                else:
                    print("You chose an empty pile - you have no points to lose")
`]
    ]),
    explain: `**Why it works.** Only the \`else\` branch that handles an empty pile changes. It checks the current player's score **before** subtracting, so a score of 0 is never reduced, and it uses \`ChangeScore(-1)\` because \`ChangeScore\` adds its argument.

**Common mistakes.**
- Subtracting first and then setting negative scores back to 0 (works, but clumsier and easy to get wrong).
- Using \`>= 0\` instead of \`> 0\`, which takes a player from 0 to -1.
- Penalising the wrong player: use \`self.__WhoseTurn\`, and don't change the turn before the penalty.

**What the examiner looks for.** The condition on the score, the \`ChangeScore(-1)\` call, both messages, and the whole method. In the exam you must also show the screenshot test with both messages and the final scores.`
  },
    {
    id: "pot-d-players",
    title: "Choose the number of players and their names",
    topic: "P.5",
    difficulty: 3,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 14.** *Likely size: Q13-size · ~7 marks*

In the **default game** (in **\`Main\`**), ask how many players there are and then ask for each player's name, instead of using "Player 1" and "Player 2".
- The number of players must be a whole number from 2 to 4: otherwise print the message below and ask again.
- A name that is empty or only spaces is asked for again.
- Loading a file doesn't ask these questions.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`How many players (2-4)? \` (the prompt; not checked)
- \`Please enter a whole number from 2 to 4\`
- \`Enter the name of player <n>: \` (the prompt; not checked)

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Default game. Enter \`5\` (rejected), then \`3\`, then \`Amy\`, \`Ben\`, \`Cal\`. Amy matches (1,1)+(2,1), Ben matches (3,1)+(4,1), then Cal chooses \`S\`.`,
    starter: POT_SKELETON,
    files: potFiles(),
    tests: [
      { name: "Screenshot test: 5 rejected, then three players", input: "\n5\n3\nAmy\nBen\nCal\nT\n1\n1\n2\n1\nT\n3\n1\n4\n1\nS\n", expect: "Please enter a whole number from 2 to 4\nAmy, you had two matching A tiles; your score has increased by 2\nBen, you had two matching A tiles; your score has increased by 2\nAmy: has a score of 2\nBen: has a score of 2\nCal: has a score of 0" },
      { name: "letters and 1 are rejected; blank names are asked again", input: "\ntwo\n1\n4\nAmy\n\n   \nBen\nCal\nDee\nS\n", expect: "Please enter a whole number from 2 to 4\nPlease enter a whole number from 2 to 4\nAmy: has a score of 0\nBen: has a score of 0\nCal: has a score of 0\nDee: has a score of 0", hidden: true },
      { name: "two players take turns as before", input: "\n2\nAnn\nBob\nT\n1\n1\n2\n1\nT\n3\n1\n4\n1\nT\n5\n1\n6\n1\nS\n", expect: "Ann, you had two matching A tiles; your score has increased by 2\nBob, you had two matching A tiles; your score has increased by 2\nAnn, you had two matching A tiles; your score has increased by 2\nAnn: has a score of 4\nBob: has a score of 2", hidden: true },
      { name: "loading game1 doesn't ask for players", input: "game1\nS\n", expect: "Boris: has a score of 0\nPoppy: has a score of 0", hidden: true }
    ],
    hints: [
      `Replace the two \`Players.append(...)\` lines in \`Main\` with a validation loop for the count, then a FOR loop for the names.`,
      `Wrap \`int(input(...))\` in \`try/except ValueError\` so letters are rejected, and set the count to an invalid value in the \`except\` so the loop repeats. Combine with the **winner** task, because the original end-of-game check only compares two players.`
    ],
    answer: `**Main (replace the two Players.append lines)**

\`\`\`python
        NoOfPlayers = 0
        while NoOfPlayers < 2 or NoOfPlayers > 4:
            try:
                NoOfPlayers = int(input("How many players (2-4)? "))
            except ValueError:
                NoOfPlayers = 0
            if NoOfPlayers < 2 or NoOfPlayers > 4:
                print("Please enter a whole number from 2 to 4")
        for i in range(1, NoOfPlayers + 1):
            Name = input(f"Enter the name of player {i}: ")
            while Name.strip() == "":
                Name = input("A name cannot be blank. Enter the name: ")
            Players.append(Player(Name, 0))
\`\`\``,
    solution: potPatch([
      [`        Players.append(Player("Player 1", 0))
        Players.append(Player("Player 2", 0))
`,
       `        NoOfPlayers = 0
        while NoOfPlayers < 2 or NoOfPlayers > 4:
            try:
                NoOfPlayers = int(input("How many players (2-4)? "))
            except ValueError:
                NoOfPlayers = 0
            if NoOfPlayers < 2 or NoOfPlayers > 4:
                print("Please enter a whole number from 2 to 4")
        for i in range(1, NoOfPlayers + 1):
            Name = input(f"Enter the name of player {i}: ")
            while Name.strip() == "":
                Name = input("A name cannot be blank. Enter the name: ")
            Players.append(Player(Name, 0))
`]
    ]),
    explain: `**Why it works.** The count loop keeps going while the number is outside 2–4, and the \`except ValueError\` turns letters into an invalid count so the same loop repeats. A FOR loop then asks for each name, with an inner loop that rejects blank names (\`.strip()\` catches names that are only spaces). Everything else already works for any number of players because \`__UpdateWhoseTurn\` uses \`len(self.__Players)\`.

**Common mistakes.**
- Converting with \`int()\` outside a \`try\`, so \`two\` crashes the program.
- Checking \`Name == ""\` only, so a name of spaces gets through.
- Asking for players even when a file is loaded (the code must be inside the default-game branch).
- Forgetting that the original end-of-game check compares only two players: combine with the **winner** task for a complete answer.

**What the examiner looks for.** Validation loops for the count and the names, the exception handling, a loop creating the players, and the whole of \`Main\`. In the exam you must also show the screenshot test: 5 rejected, three names, and the scores.`
  },
    {
    id: "pot-d-matched",
    title: "Show each player's matched symbols",
    topic: "P.5",
    difficulty: 3,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 15.** *Likely size: Q13-size · ~7 marks*

When scores are displayed, also show the symbols of the pairs each player has matched, in the order they were matched. Under each player's score line print one of the lines below (indented by three spaces, like the model answer; the check ignores the indent).
- Store the list in **\`Player\`** (a new attribute set in the constructor), with a method to add to it and a getter.
- Call the new method from the match branch of **\`Game.PlayGame\`**, and change **\`Game.__DisplayScores\`**.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`Pairs matched: <symbols joined by ", ">\` (e.g. Pairs matched: A, A)
- \`No pairs matched yet\`

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Default game. Player 1 matches (1,1)+(2,1), Player 2 matches (1,1)+(2,1), Player 1 matches (3,1)+(4,1), then Player 2 chooses \`S\`.`,
    starter: POT_SKELETON,
    files: potFiles(),
    tests: [
      { name: "Screenshot test: three matches, then S", input: "\nT\n1\n1\n2\n1\nT\n1\n1\n2\n1\nT\n3\n1\n4\n1\nS\n", expect: "Player 1: has a score of 4\nPairs matched: A, A\nPlayer 2: has a score of 4\nPairs matched: B" },
      { name: "before any match", input: "\nS\n", expect: "Player 1: has a score of 0\nNo pairs matched yet\nPlayer 2: has a score of 0\nNo pairs matched yet", hidden: true },
      { name: "game1: each player has their own list", input: "game1\nT\n1\n1\n1\n2\nT\n2\n1\n3\n1\nT\n3\n3\n1\n3\nS\n", expect: "Boris, you had two matching U tiles; your score has increased by 6\nBoris: has a score of 8\nPairs matched: A, U\nPoppy: has a score of 0\nNo pairs matched yet", hidden: true },
      { name: "normal turns still work (game1: a miss, then a match)", input: "game1\nT\n2\n1\n3\n1\nT\n1\n1\n1\n2\nS\n", expect: "You did not find a matching pair.\nPoppy, you had two matching A tiles; your score has increased by 2\nBoris: has a score of 0\nPoppy: has a score of 2", hidden: true }
    ],
    hints: [
      `This data belongs to the player, so add a list attribute to \`Player\` (in the constructor) with a method to add to it and a getter.`,
      `Call the new \`Player\` method in the match branch of \`PlayGame\`, then change \`__DisplayScores\`. Don't make the list a \`Game\` attribute.`
    ],
    answer: `**Player (replace the constructor and add two methods)**

\`\`\`python
    def __init__(self, N, S):
        self._Name = N
        self._Score = S
        self._Matched = []

    def AddMatch(self, Symbol):
        self._Matched.append(Symbol)

    def GetMatched(self):
        return self._Matched
\`\`\`

**Game.PlayGame (match branch, after ChangeScore)**

\`\`\`python
                    self.__Players[self.__WhoseTurn].ChangeScore(ScoreIncrease)
                    self.__Players[self.__WhoseTurn].AddMatch(Tile1.GetSymbol())
\`\`\`

**Game.__DisplayScores (replace the whole method)**

\`\`\`python
    def __DisplayScores(self):
        print()
        for P in self.__Players:
            print(f"{P.GetName()}: has a score of {P.GetScore()}")
            if len(P.GetMatched()) == 0:
                print("   No pairs matched yet")
            else:
                print(f"   Pairs matched: {', '.join(P.GetMatched())}")
        print()
\`\`\``,
    solution: potPatch([
      [`    def __init__(self, N, S):
        self._Name = N
        self._Score = S
`,
       `    def __init__(self, N, S):
        self._Name = N
        self._Score = S
        self._Matched = []

    def AddMatch(self, Symbol):
        self._Matched.append(Symbol)

    def GetMatched(self):
        return self._Matched
`],
      [`                    self.__Players[self.__WhoseTurn].ChangeScore(ScoreIncrease)
`,
       `                    self.__Players[self.__WhoseTurn].ChangeScore(ScoreIncrease)
                    self.__Players[self.__WhoseTurn].AddMatch(Tile1.GetSymbol())
`],
      [`    def __DisplayScores(self):
        print()
        for P in self.__Players:
            print(f"{P.GetName()}: has a score of {P.GetScore()}")
        print()
`,
       `    def __DisplayScores(self):
        print()
        for P in self.__Players:
            print(f"{P.GetName()}: has a score of {P.GetScore()}")
            if len(P.GetMatched()) == 0:
                print("   No pairs matched yet")
            else:
                print(f"   Pairs matched: {', '.join(P.GetMatched())}")
        print()
`]
    ]),
    explain: `**Why it works.** The matched symbols belong to a player, so they live in \`Player\`, created empty in the constructor (one list **per object**). \`PlayGame\` records the symbol at the moment of the match, and \`__DisplayScores\` asks each player for its list through the getter.

**Common mistakes.**
- Making the list a class attribute (\`_Matched = []\` outside \`__init__\`), so every player shares one list (a hidden test checks Poppy's list is empty).
- Keeping the lists in \`Game\`, which loses the "right class" mark.
- Printing the Python list (\`['A', 'A']\`) instead of joining it with \`", "\`.

**What the examiner looks for.** The attribute in the constructor, the add method and getter in \`Player\`, the call in the match branch, and the changed display. In the exam you must also show the screenshot test with both players' pairs.`
  },
    {
    id: "pot-d-sortdiscard",
    title: "Display the discard in alphabetical order (own sort)",
    topic: "P.5",
    difficulty: 2,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 16.** *Likely size: Q13-size · ~6 marks*

When the discard is displayed (menu option D, in **\`Game.__DisplayDiscard\`**), show the symbols in **alphabetical order**, in the same format as now (\`Discard: A, A, B\`). Write your own sort (insertion or bubble): do **not** use \`sort()\` or \`sorted()\`. The order of the discard list itself must not change.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`Discard: <symbols in alphabetical order, joined by ", ">\` (e.g. Discard: A, A, A, A, B, B)
- \`Discard: Empty\` (unchanged)

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Default game. Player 1 matches (1,1)+(2,1) [A], Player 2 matches (1,1)+(2,1) [B], Player 1 matches (3,1)+(4,1) [A], then Player 2 chooses \`D\`. Unsorted, the discard is A, A, B, B, A, A.`,
    starter: POT_SKELETON,
    files: potFiles(),
    tests: [
      { name: "Screenshot test: A, A, B, B, A, A sorted", input: "\nT\n1\n1\n2\n1\nT\n1\n1\n2\n1\nT\n3\n1\n4\n1\nD\n", expect: "Discard: A, A, A, A, B, B" },
      { name: "game1: four different symbols", input: "game1\nT\n3\n1\n4\n1\nT\n1\n1\n1\n2\nT\n3\n3\n1\n3\nT\n3\n1\n4\n1\nD\n", expect: "Discard: A, A, E, E, O, O, U, U", hidden: true },
      { name: "displaying twice gives the same answer", input: "game1\nT\n3\n1\n4\n1\nT\n1\n1\n1\n2\nD\nD\n", expect: "Discard: A, A, O, O\nDiscard: A, A, O, O", hidden: true },
      { name: "an empty discard is unchanged", input: "\nD\n", expect: "Discard: Empty", hidden: true }
    ],
    hints: [
      `Copy the symbols into a new list first, so you sort strings and leave \`__Discard\` alone.`,
      `Insertion sort: for each item from index 1, shift larger items one place right, then drop the item into the gap. \`", ".join(...)\` prints the result with commas.`
    ],
    answer: `**Game.__DisplayDiscard (replace the whole method)**

\`\`\`python
    def __DisplayDiscard(self):
        print()
        print()
        print("Discard: ", end="")
        if len(self.__Discard) == 0:
            print("Empty")
        else:
            Symbols = []
            for T in self.__Discard:
                Symbols.append(T.GetSymbol())
            for i in range(1, len(Symbols)):
                Current = Symbols[i]
                j = i - 1
                while j >= 0 and Symbols[j] > Current:
                    Symbols[j + 1] = Symbols[j]
                    j -= 1
                Symbols[j + 1] = Current
            print(", ".join(Symbols), end="")
        print()
        print()
\`\`\``,
    solution: potPatch([
      [`        else:
            print(self.__Discard[0].GetSymbol(), end="")
            Count = 1
            while Count < len(self.__Discard):
                print(f", {self.__Discard[Count].GetSymbol()}", end="")
                Count += 1
`,
       `        else:
            Symbols = []
            for T in self.__Discard:
                Symbols.append(T.GetSymbol())
            for i in range(1, len(Symbols)):
                Current = Symbols[i]
                j = i - 1
                while j >= 0 and Symbols[j] > Current:
                    Symbols[j + 1] = Symbols[j]
                    j -= 1
                Symbols[j + 1] = Current
            print(", ".join(Symbols), end="")
`]
    ]),
    explain: `**Why it works.** The symbols are copied into a new list first, so sorting never touches \`__Discard\`. Insertion sort takes each item in turn, shifts larger items one place right, and drops it into the gap; \`", ".join(...)\` prints the result in the original format.

**Common mistakes.**
- Sorting \`self.__Discard\` itself (it holds \`Tile\` objects, so comparing them crashes, and the task says its order must not change).
- An off-by-one in the inner loop, so the first item is never compared.
- Using \`sort()\` or \`sorted()\`, which scores nothing for the algorithm in a "write your own sort" question.

**What the examiner looks for.** A copy of the symbols, a correct hand-written sort (nested loops, comparison, shift or swap), the output format, and the whole method. In the exam you must also show the screenshot test with the sorted discard.`
  },
    {
    id: "pot-d-symbols",
    title: "Count the symbols left on the board (dictionary)",
    topic: "P.5",
    difficulty: 3,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 17.** *Likely size: Q14-size · ~9 marks*

Add menu option **C** that displays how many tiles of each symbol are still on the board, one symbol per line in **alphabetical order**, as \`<symbol>: <count>\`. Only symbols still on the board are listed.
- Add a method to **\`Pile\`** that returns the symbols in the pile (its tiles are protected).
- Use a **dictionary** (symbol → count) in a new method in **\`Game\`**.
- Add the menu line and the \`elif\`.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`C. Count the symbols left\` (the menu line)
- \`<symbol>: <count>\` (e.g. A: 8)

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Load \`game1\` and choose \`C\`. Then match (1,1)+(1,2) and Poppy chooses \`C\` again.`,
    starter: POT_SKELETON,
    files: potFiles({ "sym.txt": `4
0,Z,1
0,Z,1
0,M,2,Z,1
0
2
Amy,0
Ben,0

10
0
0
` }),
    tests: [
      { name: "Screenshot test: game1 before and after a match", input: "game1\nC\nT\n1\n1\n1\n2\nC\n", expect: "A: 8\nE: 12\nF: 2\nH: 12\nJ: 3\nK: 6\nO: 2\nQ: 2\nR: 2\nU: 2\nBoris, you had two matching A tiles; your score has increased by 2\nA: 6\nE: 12\nF: 2\nH: 12\nJ: 3\nK: 6\nO: 2\nQ: 2\nR: 2\nU: 2" },
      { name: "the default game", input: "\nC\n", expect: "C. Count the symbols left\nA: 72\nB: 36", hidden: true },
      { name: "alphabetical order and emptied piles", input: "sym\nC\nT\n1\n1\n2\n1\nC\n", expect: "M: 1\nZ: 3\nAmy, you had two matching Z tiles; your score has increased by 2\nM: 1\nZ: 1", hidden: true },
      { name: "normal turns still work (game1: a miss, then a match)", input: "game1\nT\n2\n1\n3\n1\nT\n1\n1\n1\n2\nS\n", expect: "You did not find a matching pair.\nPoppy, you had two matching A tiles; your score has increased by 2\nBoris: has a score of 0\nPoppy: has a score of 2", hidden: true }
    ],
    hints: [
      `\`Pile\` keeps its tiles protected, so add a method that returns a list of the symbols in the pile.`,
      `Use a dictionary: symbol → count. If the symbol is already a key add 1, otherwise set it to 1. Loop over \`sorted(Counts)\` to print in order. Add the menu line and the \`elif\`.`
    ],
    answer: `**Pile (new method after GetNumberOfTiles)**

\`\`\`python
    def GetNumberOfTiles(self):
        return len(self._Tiles)

    def GetSymbols(self):
        Symbols = []
        for T in self._Tiles:
            Symbols.append(T.GetSymbol())
        return Symbols
\`\`\`

**Game.PlayGame (menu handling)**

\`\`\`python
                elif Choice == "S":
                    self.__DisplayScores()
                elif Choice == "C":
                    self.__DisplaySymbolCounts()
\`\`\`

**Game.__DisplayMenu (new line)**

\`\`\`python
        print("S. Display scores")
        print("C. Count the symbols left")
\`\`\`

**Game (new method, above __DisplayScores)**

\`\`\`python
    def __DisplaySymbolCounts(self):
        Counts = {}
        for P in self.__Board:
            for Symbol in P.GetSymbols():
                if Symbol in Counts:
                    Counts[Symbol] += 1
                else:
                    Counts[Symbol] = 1
        print()
        for Symbol in sorted(Counts):
            print(f"{Symbol}: {Counts[Symbol]}")
        print()

    def __DisplayScores(self):
\`\`\``,
    solution: potPatch([
      [`    def GetNumberOfTiles(self):
        return len(self._Tiles)
`,
       `    def GetNumberOfTiles(self):
        return len(self._Tiles)

    def GetSymbols(self):
        Symbols = []
        for T in self._Tiles:
            Symbols.append(T.GetSymbol())
        return Symbols
`],
      [`                elif Choice == "S":
                    self.__DisplayScores()
`,
       `                elif Choice == "S":
                    self.__DisplayScores()
                elif Choice == "C":
                    self.__DisplaySymbolCounts()
`],
      [`        print("S. Display scores")
`,
       `        print("S. Display scores")
        print("C. Count the symbols left")
`],
      [`    def __DisplayScores(self):
`,
       `    def __DisplaySymbolCounts(self):
        Counts = {}
        for P in self.__Board:
            for Symbol in P.GetSymbols():
                if Symbol in Counts:
                    Counts[Symbol] += 1
                else:
                    Counts[Symbol] = 1
        print()
        for Symbol in sorted(Counts):
            print(f"{Symbol}: {Counts[Symbol]}")
        print()

    def __DisplayScores(self):
`]
    ]),
    explain: `**Why it works.** \`Pile.GetSymbols\` hands out copies of the symbols without exposing the tile list. The dictionary starts empty; for each symbol it adds 1 if the key exists, otherwise creates it with 1. Looping over \`sorted(Counts)\` gives the keys in alphabetical order.

**Common mistakes.**
- Only counting each pile's **top** tile.
- \`Counts[Symbol] += 1\` without creating the key first (\`KeyError\`).
- Printing the dictionary itself (\`{'A': 8, ...}\`) instead of one line per symbol.
- Forgetting the menu line or the \`elif\`.

**What the examiner looks for.** The \`Pile\` method, the dictionary with the "exists / doesn't exist" logic, the sorted output, the menu line and \`elif\`, and each changed method in full. In the exam you must also show the screenshot test with both sets of counts.`
  },
    {
    id: "pot-d-bonusempty",
    title: "Bonus only when a pile is emptied",
    topic: "P.5",
    difficulty: 2,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 18.** *Likely size: Q13-size · ~6 marks*

A pile's bonus (\`_Bonus\`, the first number on each pile line of the file) is only awarded to the player whose match **empties** that pile. When that happens, add the bonus to the score increase and print the message below (only for a bonus greater than 0).
- Add a getter **\`GetBonus\`** to **\`Pile\`**.
- Change the match branch of **\`Game.PlayGame\`** (after both tiles have been removed).

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`You emptied a pile with a bonus of <bonus>\` (e.g. You emptied a pile with a bonus of 3)

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Load \`b\` (provided as \`b.txt\`). Amy matches (1,1)+(2,1) [pile (1,1) has bonus 3 and becomes empty]; Ben matches (2,1)+(1,2) [both emptied, bonus 0]; Amy chooses \`S\`.`,
    starter: POT_SKELETON,
    files: potFiles({ "b.txt": `4
3,A,1
0,A,1,B,1
0,B,1
0,C,1
2
Amy,0
Ben,0

10
0
0
`, "be2.txt": `4
2,A,1
5,A,2
0,B,1
0,B,1
2
Amy,0
Ben,0

20
0
0
` }),
    tests: [
      { name: "Screenshot test: a bonus of 3 when (1,1) is emptied", input: "b\nT\n1\n1\n2\n1\nT\n2\n1\n1\n2\nS\n", expect: "You emptied a pile with a bonus of 3\nBen, you had two matching B tiles; your score has increased by 2\nAmy: has a score of 5\nBen: has a score of 2" },
      { name: "two bonuses at once", input: "be2\nT\n1\n1\n2\n1\nS\n", expect: "You emptied a pile with a bonus of 2\nYou emptied a pile with a bonus of 5\nAmy: has a score of 10", hidden: true },
      { name: "no bonus while the pile still has tiles", input: "game1\nT\n1\n1\n1\n2\nS\n", expect: "Boris, you had two matching A tiles; your score has increased by 2\nBoris: has a score of 2", hidden: true }
    ],
    hints: [
      `You still need the \`GetBonus\` getter from the bonus task.`,
      `After both \`Remove()\` calls, check \`Empty()\` on each pile. A loop over \`[Pile1, Pile2]\` avoids writing the same code twice.`
    ],
    answer: `**Pile (new method after GetNumberOfTiles)**

\`\`\`python
    def GetNumberOfTiles(self):
        return len(self._Tiles)

    def GetBonus(self):
        return self._Bonus
\`\`\`

**Game.PlayGame (match branch)**

\`\`\`python
                    ScoreIncrease += Tile1.GetPoints() + Tile2.GetPoints()
                    for PileNo in [Pile1, Pile2]:
                        if self.__Board[PileNo].Empty() and self.__Board[PileNo].GetBonus() > 0:
                            ScoreIncrease += self.__Board[PileNo].GetBonus()
                            print(f"You emptied a pile with a bonus of {self.__Board[PileNo].GetBonus()}")
\`\`\``,
    solution: potPatch([
      [`    def GetNumberOfTiles(self):
        return len(self._Tiles)
`,
       `    def GetNumberOfTiles(self):
        return len(self._Tiles)

    def GetBonus(self):
        return self._Bonus
`],
      [`                    ScoreIncrease += Tile1.GetPoints() + Tile2.GetPoints()
`,
       `                    ScoreIncrease += Tile1.GetPoints() + Tile2.GetPoints()
                    for PileNo in [Pile1, Pile2]:
                        if self.__Board[PileNo].Empty() and self.__Board[PileNo].GetBonus() > 0:
                            ScoreIncrease += self.__Board[PileNo].GetBonus()
                            print(f"You emptied a pile with a bonus of {self.__Board[PileNo].GetBonus()}")
`]
    ]),
    explain: `**Why it works.** By the time the bonus is checked, both tiles have been removed, so \`Empty()\` tells you whether *this* match emptied the pile. Looping over \`[Pile1, Pile2]\` applies the same rule to both piles without repeating code, and the bonus is added to \`ScoreIncrease\` before \`ChangeScore\`.

**Common mistakes.**
- Checking \`Empty()\` before the tiles are removed (no pile is ever empty then).
- Awarding the bonus on every match from that pile (the plain **bonus** task), which a hidden test catches.
- Adding the bonus after \`ChangeScore\`, so the score and the message disagree.

**What the examiner looks for.** The getter in \`Pile\`, the empty check after removal, both piles checked, the bonus added, and the message. In the exam you must also show the screenshot test with the bonus message and the scores.`
  },
    {
    id: "pot-d-align",
    title: "Line up the board display for 10+ tiles and big grids",
    topic: "P.5",
    difficulty: 2,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 19.** *Likely size: Q13-size · ~6 marks*

**\`Game.__DisplayBoard\`** prints every count and axis label as a single character, so a pile of 10+ tiles or a grid wider than 9 misaligns. Rewrite it so every column has the same width. Use exactly this layout, so the auto-check can compare it:
- \`LabelWidth\` = the number of digits in the grid size; \`Width\` = the larger of \`LabelWidth\` and the number of digits in the biggest pile.
- Each row: the y label right-aligned in \`LabelWidth\` characters, then \`|\`, then each count right-aligned in \`Width\` characters **followed by one space**.
- Then \`LabelWidth + 1\` spaces and a line of \`(Width + 1) × grid size\` dashes.
- Then \`LabelWidth + 1\` spaces and each x label right-aligned in \`Width\` characters followed by one space.

For game1 (4 × 4, all piles under 10) a row looks like \`4|3 3 3 3 \`.

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Load \`big\` (provided as \`big.txt\`: the default game on a 10 × 10 board, the same as changing \`range(1, 37)\` to \`range(1, 101)\` in P.5's version of this test). Player 1 matches (10,10)+(9,10), then Player 2 chooses \`B\`.`,
    starter: POT_SKELETON,
    files: potFiles({ "big.txt": `100
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
0,A,1,B,2,A,1
2
Player 1,0
Player 2,0

10
0
0
`, "tall.txt": `4
0,A,1,C,1,C,1,C,1,C,1,C,1,C,1,C,1,C,1,C,1,C,1,C,1
0,A,1
0,B,1
0,B,1
2
Amy,0
Ben,0

10
0
0
` }),
    tests: [
      { name: "Screenshot test: a 10 × 10 board", input: "big\nT\n10\n10\n9\n10\nB\n", expect: "Player 1, you had two matching A tiles; your score has increased by 2\n10| 3  3  3  3  3  3  3  3  2  2\n 9| 3  3  3  3  3  3  3  3  3  3\n 2| 3  3  3  3  3  3  3  3  3  3\n 1| 3  3  3  3  3  3  3  3  3  3\n   ------------------------------\n    1  2  3  4  5  6  7  8  9 10" },
      { name: "a pile of 12 tiles on a 2 × 2 board", input: "tall\nB\nT\n1\n1\n2\n1\nB\n", expect: "2| 1  1\n1|12  1\n  ------\n   1  2\nAmy, you had two matching A tiles; your score has increased by 2\n2| 1  1\n1|11  0", hidden: true },
      { name: "game1: small board, small piles", input: "game1\nB\n", expect: "4|3 3 3 3\n3|3 3 3 3\n2|3 3 3 3\n1|4 5 3 3\n  --------\n  1 2 3 4", hidden: true },
      { name: "matching still works", input: "game1\nT\n1\n1\n1\n2\n", expect: "Boris, you had two matching A tiles; your score has increased by 2", hidden: true }
    ],
    hints: [
      `Work out a column width first: the number of digits in the grid size or in the biggest pile, whichever is larger.`,
      `Use a format width: \`f"{value:>{Width}}"\` right-aligns \`value\` in \`Width\` characters. Pad the row labels the same way so \`9|\` lines up under \`10|\`.`
    ],
    answer: `**Game.__DisplayBoard (replace the whole method)**

\`\`\`python
    def __DisplayBoard(self):
        LabelWidth = len(str(self.__GridSize))
        Width = LabelWidth
        for P in self.__Board:
            if len(str(P.GetNumberOfTiles())) > Width:
                Width = len(str(P.GetNumberOfTiles()))
        for y in range(self.__GridSize, 0, -1):
            print(f"{y:>{LabelWidth}}|", end="")
            for x in range(1, self.__GridSize + 1):
                print(f"{self.__Board[self.__GetIndex(x, y)].GetNumberOfTiles():>{Width}} ", end="")
            print()
        print(" " * (LabelWidth + 1), end="")
        print("-" * ((Width + 1) * self.__GridSize))
        print(" " * (LabelWidth + 1), end="")
        for x in range(1, self.__GridSize + 1):
            print(f"{x:>{Width}} ", end="")
        print()
\`\`\``,
    solution: potPatch([
      [`    def __DisplayBoard(self):
        for y in range (self.__GridSize, 0, -1):
            print(f"{y}|", end="")
            for x in range(1, self.__GridSize + 1):
                print(self.__Board[self.__GetIndex(x, y)].GetNumberOfTiles(), end="")
            print()
        print("  ", end="")
        for x in range(1, self.__GridSize + 1):
            print("-", end="")
        print()
        print("  ", end="")
        for x in range (1, self.__GridSize + 1):
            print(x, end="")
        print()
`,
       `    def __DisplayBoard(self):
        LabelWidth = len(str(self.__GridSize))
        Width = LabelWidth
        for P in self.__Board:
            if len(str(P.GetNumberOfTiles())) > Width:
                Width = len(str(P.GetNumberOfTiles()))
        for y in range(self.__GridSize, 0, -1):
            print(f"{y:>{LabelWidth}}|", end="")
            for x in range(1, self.__GridSize + 1):
                print(f"{self.__Board[self.__GetIndex(x, y)].GetNumberOfTiles():>{Width}} ", end="")
            print()
        print(" " * (LabelWidth + 1), end="")
        print("-" * ((Width + 1) * self.__GridSize))
        print(" " * (LabelWidth + 1), end="")
        for x in range(1, self.__GridSize + 1):
            print(f"{x:>{Width}} ", end="")
        print()
`]
    ]),
    explain: `**Why it works.** The width is worked out once, from the biggest number that will be printed in a column (a count or an x label), and every value is then printed with \`f"{value:>{Width}}"\`, which right-aligns it in exactly that many characters. Row labels get their own width so \`9|\` lines up under \`10|\`.

**Common mistakes.**
- Only allowing for the grid size, so a 12-tile pile still pushes its row out of line.
- Using \`len(self.__Board)\` (the number of piles) instead of the number of **tiles** in the biggest pile.
- Padding the counts but not the axis labels or the dashes.

**What the examiner looks for.** The width calculation, the formatted counts, labels and dashes, and the whole method. In the exam you must also show the screenshot test on the 10 × 10 board with the columns lined up.`
  },
    {
    id: "pot-d-endtop",
    title: "Rewrite Pile so the end of the list is the top",
    topic: "P.5",
    difficulty: 2,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 20.** *Likely size: Q13-size · ~5 marks*

\`Pile\` uses \`insert(0, …)\` and \`pop(0)\`, which shift every element (O(n)). Rewrite **\`Pile\`** to use the **end** of the list \`self._Tiles\` as the top of the stack, without changing how anything outside \`Pile\` behaves (the output of every game must be identical). Keep the attribute name \`_Tiles\`.

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Load \`game1\`. Boris matches (1,1)+(1,2); Poppy chooses (2,1)+(3,1); Boris chooses \`D\` then \`B\`. The output must be identical to the unchanged skeleton's. A second visible test plays a short game (\`end.txt\`) and then checks that the top tile really is at the end of \`_Tiles\`.`,
    starter: POT_SKELETON,
    files: potFiles({ "end.txt": `4
0,A,1
0,A,1
0,B,1
0,B,1
2
Amy,0
Ben,0

2
0
0
` }),
    tests: [
      { name: "Screenshot test: output identical to the original", input: "game1\nT\n1\n1\n1\n2\nT\n2\n1\n3\n1\nD\nB\n", expect: "Boris, you had two matching A tiles; your score has increased by 2\nYou did not find a matching pair.\nThe first pile you chose had a E\nThe second pile you chose had a O\nDiscard: A, A\n4|3333\n3|3333\n2|2333\n1|3533\n  ----\n  1234" },
      { name: "the top is the END of _Tiles (end.txt ends after one match, so the check code runs)", input: "end\nT\n1\n1\n2\n1\n\n", code: `P = Pile(3, 0)
P.Add(Tile("X", 1))
P.Add(Tile("Y", 2))
print("Last item in _Tiles:", P._Tiles[-1].GetSymbol())
print("Top tile:", P.GetSymbolOfTopTile())
T = P.Remove()
print("Removed:", T.GetSymbol(), "- left:", [t.GetSymbol() for t in P._Tiles])`, expect: "Amy has won!\nLast item in _Tiles: Y\nTop tile: Y\nRemoved: Y - left: ['X']" },
      { name: "loading game1: every top tile is the same, and full piles ignore extra tiles", input: "end\nT\n1\n1\n2\n1\n\n", code: `Loaded, B, Pl, D, MS, WT, TSM = LoadGame("game1.txt")
print("Tops:", " ".join(p.GetSymbolOfTopTile() for p in B))
print("Tops are at the end:", all(p._Tiles[-1].GetSymbol() == p.GetSymbolOfTopTile() for p in B))
Full = Pile(2, 0)
for s in "PQR":
    Full.Add(Tile(s, 1))
print("Full pile:", Full.GetNumberOfTiles(), Full.GetSymbolOfTopTile())`, expect: "Tops: A E O O A A E A U A U A A R R A\nTops are at the end: True\nFull pile: 2 Q", hidden: true },
      { name: "a longer default game is unchanged", input: "\nT\n1\n1\n2\n1\nT\n1\n1\n2\n1\nT\n1\n1\n2\n1\nT\n1\n1\n2\n1\nD\nB\n", expect: "Player 1, you had two matching A tiles; your score has increased by 2\nPlayer 2, you had two matching B tiles; your score has increased by 4\nPlayer 1, you had two matching A tiles; your score has increased by 2\nYou chose an empty pile\nDiscard: A, A, B, B, A, A\n1|003333", hidden: true }
    ],
    hints: [
      `Only \`Add\`, \`GetSymbolOfTopTile\` and \`Remove\` touch the position of the top. \`Empty\` and \`GetNumberOfTiles\` don't care.`,
      `\`append\` pushes, \`pop()\` with no argument pops the last item, and \`[-1]\` peeks at it. \`LoadGame\` still works because it only calls \`Add\`.`
    ],
    answer: `**Pile (replace Add, GetSymbolOfTopTile and Remove)**

\`\`\`python
    def Add(self, T):
        if len(self._Tiles) < self._Max:
            self._Tiles.append(T)

    def GetSymbolOfTopTile(self):
        return self._Tiles[-1].GetSymbol()

    def Remove(self):
        return self._Tiles.pop()
\`\`\``,
    solution: potPatch([
      [`    def Add(self, T):
        if len(self._Tiles) < self._Max:
            self._Tiles.insert(0, T)

    def GetSymbolOfTopTile(self):
        return self._Tiles[0].GetSymbol()

    def Remove(self):
        Temp = self._Tiles[0]
        self._Tiles.pop(0)
        return Temp
`,
       `    def Add(self, T):
        if len(self._Tiles) < self._Max:
            self._Tiles.append(T)

    def GetSymbolOfTopTile(self):
        return self._Tiles[-1].GetSymbol()

    def Remove(self):
        return self._Tiles.pop()
`]
    ]),
    explain: `**Why it works.** Only \`Add\`, \`GetSymbolOfTopTile\` and \`Remove\` care where the top is. \`append\` pushes onto the end, \`[-1]\` peeks at it and \`pop()\` with no argument removes it, all O(1). \`Empty\` and \`GetNumberOfTiles\` don't depend on the order, and \`LoadGame\` only calls \`Add\`, so it still builds the same piles.

**Common mistakes.**
- Changing \`Add\` but not \`GetSymbolOfTopTile\` (or the other way round), so the wrong tile is shown or removed.
- Reversing the order in \`LoadGame\` as well, which flips every pile twice.
- Forgetting that \`Add\` must still ignore tiles once the pile is full.

**What the examiner looks for.** The three methods rewritten consistently, and evidence that behaviour hasn't changed. In the exam you must also show the screenshot test, which for a refactoring task means output **identical** to the unmodified program.`
  },
    {
    id: "pot-d-shuffle",
    title: "Shuffle the board (costs 2 points)",
    topic: "P.5",
    difficulty: 3,
    eofOk: true,
    match: "contains",
    task: `**Section D practice: P.5 task 21.** *Likely size: Q14-size · ~8 marks*

Add menu option **X**. If the current player has at least 2 points, take 2 points and shuffle the positions of the piles on the board (each pile keeps its own tiles); otherwise refuse with a message. Either way the menu comes back (shuffling doesn't use up the turn).

You need a menu line in **\`Game.__DisplayMenu\`**, an \`elif\` in **\`Game.PlayGame\`**, a new method in **\`Game\`**, and \`import random\`. Don't seed the random generator: the tests don't depend on where the piles end up.

**Exact text** (the tests look for these, character for character; \`<…>\` stands for a value):

- \`X. Shuffle the board (costs 2 points)\` (the menu line)
- \`You need at least 2 points to shuffle the board\`
- \`The board has been shuffled\`

**How the auto-check works.** Your program will be run with scripted inputs, like the screenshot test in the exam. Each line of a test's input answers one \`input()\`, starting with the filename prompt (an empty line means the default game). The game never finishes on its own, so when a test runs out of inputs the program simply stops there and the output so far is checked. Only **printed** text is checked (not the prompts you pass to \`input()\`), and only the key lines that prove your change works, so the menu and blank lines don't matter. **▶ Run** uses the visible test's inputs: edit them to try your own cases.

**Visible test:** Load \`game1\`; Boris chooses \`X\` (refused), then matches (1,1)+(1,2); Poppy chooses (2,1)+(3,1); Boris chooses \`B\`, \`X\`, \`B\`, \`S\`.`,
    starter: POT_SKELETON,
    files: potFiles({ "shuf.txt": `4
0,A,1,A,1,A,1
0,A,1
0,A,1,A,1
0,A,1,A,1,A,1,A,1
2
Amy,2
Ben,0

10
0
0
` }),
    tests: [
      { name: "Screenshot test: refused, then a shuffle that costs 2 points", input: "game1\nX\nT\n1\n1\n1\n2\nT\n2\n1\n3\n1\nB\nX\nB\nS\n", expect: "You need at least 2 points to shuffle the board\nBoris, you had two matching A tiles; your score has increased by 2\nThe board has been shuffled\nBoris: has a score of 0\nPoppy: has a score of 0" },
      { name: "the menu shows the option; a refusal costs nothing and keeps the turn", input: "\nX\nT\n1\n1\n2\n1\nX\nS\n", expect: "X. Shuffle the board (costs 2 points)\nYou need at least 2 points to shuffle the board\nPlayer 1, you had two matching A tiles; your score has increased by 2\nYou need at least 2 points to shuffle the board\nPlayer 1: has a score of 2\nPlayer 2: has a score of 0", hidden: true },
      { name: "after a shuffle the piles still work", input: "shuf\nX\nS\nT\n1\n1\n2\n1\nT\n1\n2\n2\n2\nS\n", expect: "The board has been shuffled\nAmy: has a score of 0\nAmy, you had two matching A tiles; your score has increased by 2\nBen, you had two matching A tiles; your score has increased by 2\nAmy: has a score of 2\nBen: has a score of 2", hidden: true },
      { name: "normal turns still work (game1: a miss, then a match)", input: "game1\nT\n2\n1\n3\n1\nT\n1\n1\n1\n2\nS\n", expect: "You did not find a matching pair.\nPoppy, you had two matching A tiles; your score has increased by 2\nBoris: has a score of 0\nPoppy: has a score of 2", hidden: true }
    ],
    hints: [
      `\`random.shuffle(list)\` shuffles a list in place. You need \`import random\` at the top.`,
      `Shuffle \`self.__Board\` itself: the piles move, but each pile keeps its own tiles. For a test you can repeat, add \`random.seed(1)\` temporarily so the shuffle is the same every run.`
    ],
    answer: `**Top of file**

\`\`\`python
import math
import random
\`\`\`

**Game.PlayGame (menu handling)**

\`\`\`python
                elif Choice == "S":
                    self.__DisplayScores()
                elif Choice == "X":
                    self.__ShuffleBoard()
\`\`\`

**Game.__DisplayMenu (new line)**

\`\`\`python
        print("S. Display scores")
        print("X. Shuffle the board (costs 2 points)")
\`\`\`

**Game (new method, above __DisplayScores)**

\`\`\`python
    def __ShuffleBoard(self):
        CurrentPlayer = self.__Players[self.__WhoseTurn]
        if CurrentPlayer.GetScore() < 2:
            print("You need at least 2 points to shuffle the board")
        else:
            CurrentPlayer.ChangeScore(-2)
            random.shuffle(self.__Board)
            print("The board has been shuffled")

    def __DisplayScores(self):
\`\`\``,
    solution: potPatch([
      [`import math
`,
       `import math
import random
`],
      [`                elif Choice == "S":
                    self.__DisplayScores()
`,
       `                elif Choice == "S":
                    self.__DisplayScores()
                elif Choice == "X":
                    self.__ShuffleBoard()
`],
      [`        print("S. Display scores")
`,
       `        print("S. Display scores")
        print("X. Shuffle the board (costs 2 points)")
`],
      [`    def __DisplayScores(self):
`,
       `    def __ShuffleBoard(self):
        CurrentPlayer = self.__Players[self.__WhoseTurn]
        if CurrentPlayer.GetScore() < 2:
            print("You need at least 2 points to shuffle the board")
        else:
            CurrentPlayer.ChangeScore(-2)
            random.shuffle(self.__Board)
            print("The board has been shuffled")

    def __DisplayScores(self):
`]
    ]),
    explain: `**Why it works.** \`random.shuffle\` rearranges \`self.__Board\` in place. The board is a list of \`Pile\` objects, so the piles move but each keeps its own tiles and bonus. The score check comes first, and \`ChangeScore(-2)\` takes the cost.

**Common mistakes.**
- Shuffling a **copy** of the board (\`random.shuffle(list(self.__Board))\`), which changes nothing.
- Shuffling the tiles between piles instead of the piles.
- Forgetting \`import random\`, the menu line or the \`elif\`.
- Charging even when the shuffle is refused.

**What the examiner looks for.** The menu line, the \`elif\`, the new method in \`Game\`, the score check, the cost, the shuffle and the messages. In the exam you must also show the screenshot test; add \`random.seed(1)\` temporarily so your screenshot is repeatable.`
  }
  ]);
})();
