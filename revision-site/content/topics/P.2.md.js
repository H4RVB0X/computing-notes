CS.registerTopic({ id: "P.2", title: "The game and the code: a method-by-method tour" }, function () {/*

:::objectives
- Explain the **rules** of Piles O' Tiles and where each rule lives in the code.
- Draw and explain the **class diagram**: aggregation, private (`__`) vs protected (`_`) attributes, encapsulation.
- Trace the **program flow** from `Main()` to the winner message.
- Explain the purpose of **every method** and the design decisions behind it (the "why").
- Read and write the **game file format**, and trace how `LoadGame` builds each pile.
- Convert between **(x, y) coordinates and list indices** in both directions.
:::

:::quick At a glance
- A square grid of **piles**; each pile is a **stack** of face-down tiles (symbol + points). Pick two different piles: same top symbol → both go to the **discard** and you score their points; different → both symbols are printed.
- Game ends when someone reaches **MaxScore** or every pile is empty. Highest score wins (only Players 0 and 1 are compared!).
- Classes: **Game** (private `__` attributes) has **Piles**, **Players** and a discard list of **Tiles**. **Pile**, **Player**, **Tile** use protected `_` attributes. No inheritance yet.
- The 2-D board is a **1-D list** in row order: `index = x - 1 + (y - 1) * GridSize`. Reverse: `x = index % GridSize + 1`, `y = index // GridSize + 1`.
- A pile's top tile is **`_Tiles[0]`**: `insert(0, …)` pushes, `pop(0)` pops. `LoadGame` reads each line **backwards** so the first tile in the file ends up on top.
- Two things are stored but **never used**: `_Bonus` and `__TurnsSinceMatch`. Expect Section D to use them.
:::

:::keyterms
Aggregation :: An association where one class contains references to objects of another class that can exist independently of it (shown with a hollow diamond). :: "Has-a", but the parts live on without the whole.
Composition :: An association where the contained objects are created and destroyed with the containing object (filled diamond). :: "Has-a" where the parts die with the whole.
Private attribute :: An attribute that can only be accessed by methods of its own class. In Python, a double underscore triggers name mangling (`__Board` becomes `_Game__Board`). :: Only Game's own methods can touch `__Board`.
Protected attribute :: An attribute accessible within its class and its subclasses. Python marks it by convention with a single underscore. :: Subclasses can use `_Score` directly.
Encapsulation :: Bundling data with the methods that operate on it and controlling access to the data through those methods. :: Change the score only via `ChangeScore`.
Row-major order :: Storing a 2-D grid in a 1-D list one row after another. :: Row 1, then row 2, then row 3…
Name mangling :: Python's renaming of `__attr` inside a class to `_ClassName__attr`, which stops subclasses accidentally overriding or reading it. :: Why a subclass of Game can't see `self.__Board`.
:::

## The rules in 30 seconds

- A square grid of **piles**. Each pile is a stack of face-down tiles; each tile has an uppercase **symbol** and a **points** value.
- On your turn, choose **two different piles**. Their top tiles are revealed.
- **Same symbol** → both tiles go to the **discard** and you score the sum of their points. **Different** → the tiles stay where they are, and both symbols are printed for everyone to see (so good memory pays off).
- The game ends when a player reaches **MaxScore** or **every pile is empty**. The highest score wins.

:::why Why does the default game always match on the first turn?
`Main` builds 36 piles, each with `Add(A1)`, `Add(B2)`, `Add(A1)`. Because `Add` inserts at index 0, each pile ends up **A (top), B, A**. So every pile's top tile is A, and any two piles match: the first player always scores 2.
:::

## Class diagram

<svg class="diagram" viewBox="0 0 680 400" role="img" aria-label="Class diagram: Game aggregates Pile, Player and Tile (discard); Pile aggregates Tile">
  <g font-size="12.5" font-family="inherit">
    <rect x="230" y="10" width="220" height="178" rx="6" fill="#f06595" fill-opacity="0.14" stroke="currentColor"/>
    <text x="340" y="30" text-anchor="middle" font-weight="700" font-size="14">Game</text>
    <line x1="230" y1="38" x2="450" y2="38" stroke="currentColor"/>
    <text x="240" y="55">- __Board : list of Pile</text><text x="240" y="71">- __Players : list of Player</text><text x="240" y="87">- __Discard : list of Tile</text><text x="240" y="103">- __WhoseTurn, __MaxScore,</text><text x="250" y="119" font-size="11.5">__TurnsSinceMatch, __GridSize, __GameOver</text>
    <line x1="230" y1="127" x2="450" y2="127" stroke="currentColor"/>
    <text x="240" y="144">+ PlayGame()</text><text x="240" y="160">- __ChoosePile(), __GetIndex(x, y)</text><text x="240" y="176">- __Display…(), __MaxScoreReached()…</text>
    <rect x="10" y="250" width="190" height="130" rx="6" fill="#35d4bd" fill-opacity="0.16" stroke="currentColor"/>
    <text x="105" y="270" text-anchor="middle" font-weight="700" font-size="14">Player</text>
    <line x1="10" y1="278" x2="200" y2="278" stroke="currentColor"/>
    <text x="20" y="295"># _Name : string</text><text x="20" y="311"># _Score : integer</text>
    <line x1="10" y1="319" x2="200" y2="319" stroke="currentColor"/>
    <text x="20" y="336">+ GetName(), GetScore()</text><text x="20" y="352">+ ChangeScore(Change)</text>
    <rect x="245" y="250" width="190" height="140" rx="6" fill="#7c9aff" fill-opacity="0.16" stroke="currentColor"/>
    <text x="340" y="270" text-anchor="middle" font-weight="700" font-size="14">Pile</text>
    <line x1="245" y1="278" x2="435" y2="278" stroke="currentColor"/>
    <text x="255" y="295"># _Tiles : list of Tile</text><text x="255" y="311"># _Max, # _Bonus : integer</text>
    <line x1="245" y1="319" x2="435" y2="319" stroke="currentColor"/>
    <text x="255" y="336">+ Add(T), Remove(), Empty()</text><text x="255" y="352">+ GetSymbolOfTopTile()</text><text x="255" y="368">+ GetNumberOfTiles()</text>
    <rect x="490" y="250" width="180" height="120" rx="6" fill="#ffa94d" fill-opacity="0.2" stroke="currentColor"/>
    <text x="580" y="270" text-anchor="middle" font-weight="700" font-size="14">Tile</text>
    <line x1="490" y1="278" x2="670" y2="278" stroke="currentColor"/>
    <text x="500" y="295"># _Symbol : string</text><text x="500" y="311"># _Points : integer</text>
    <line x1="490" y1="319" x2="670" y2="319" stroke="currentColor"/>
    <text x="500" y="336">+ GetSymbol()</text><text x="500" y="352">+ GetPoints()</text>
    <path d="M262 188 l-7 8 l7 8 l7 -8 z" style="fill:var(--surface)" stroke="currentColor"/>
    <line x1="262" y1="204" x2="105" y2="250" stroke="currentColor"/>
    <text x="150" y="222" font-size="11">1 … 2..*</text>
    <path d="M340 188 l-7 8 l7 8 l7 -8 z" style="fill:var(--surface)" stroke="currentColor"/>
    <line x1="340" y1="204" x2="340" y2="250" stroke="currentColor"/>
    <text x="346" y="232" font-size="11">1 … *</text>
    <path d="M430 188 l-7 8 l7 8 l7 -8 z" style="fill:var(--surface)" stroke="currentColor"/>
    <line x1="430" y1="204" x2="575" y2="250" stroke="currentColor"/>
    <text x="510" y="218" font-size="11">discard 1 … *</text>
    <path d="M435 320 l8 -7 l8 7 l-8 7 z" style="fill:var(--surface)" stroke="currentColor"/>
    <line x1="451" y1="320" x2="490" y2="320" stroke="currentColor"/>
    <text x="452" y="312" font-size="11">0..*</text>
  </g>
</svg>

- **Aggregation, not composition.** The piles and players are created in `Main` (or `LoadGame`) and passed into `Game`'s constructor. Tiles move from a pile to the discard, so they outlive the pile they started in. Hollow diamonds are the defensible answer.
- **`__` vs `_`.** `Game` uses double underscores: its attributes are **private** and Python name-mangles `self.__Board` to `self._Game__Board`. `Tile`, `Player` and `Pile` use a single underscore: **protected** by convention, so a subclass can use them. That is a strong hint that Section D may ask for a **subclass** of one of these three.
- **No inheritance exists yet.** Every attribute is reached through a getter (or a method like `ChangeScore`): that is **encapsulation**.

:::trap
- **Don't call the relationships composition** just because Game "has" piles. Composition means the parts are created inside and die with the whole; here they are created outside and passed in.
- **Private methods too.** `__ChoosePile`, `__DisplayBoard` and friends are private methods: they can only be called from inside `Game` (as `self.__ChoosePile()`). If you write a **subclass of Game**, it cannot call them by that name.
- `_Score` is protected **by convention only**. Python doesn't enforce it — but saying "Python does not enforce it" is a good extra point, not a reason to call it public.
:::

## Program flow

:::steps From start-up to the winner
1. `Main()` asks for a filename and appends `".txt"`. Pressing Enter gives `".txt"`, which equals `FILE_EXTENSION`, so loading is skipped.
2. Otherwise `LoadGame()` returns **7 values** as a tuple: a success flag plus the six pieces of game state.
3. If loading was skipped or failed, `Main` builds the **default game**: 2 players and 36 piles of `Pile(3, 0)`, each holding A1, B2, A1 (top = A).
4. `Game(...)` stores everything and works out `__GridSize = int(math.sqrt(len(Board)))`; then `PlayGame()` loops `while self.__GameOver == False`.
5. Each turn: menu loop until `"T"` → choose 2 **different** piles → `__TurnsSinceMatch += 1` → empty check → compare symbols → score or reveal → `__UpdateWhoseTurn()` → `__GameOver = __MaxScoreReached() or __NoMoreTilesLeft()`.
6. After the loop, the scores of `Players[0]` and `Players[1]` are compared and a winner printed (nothing on a draw).
:::

{{tool:pot-console}}

## What each part does, and why it's written that way

Open one at a time. The **Exam angle** line is what Section C tends to ask. Line numbers refer to the full skeleton at the bottom of this page.

:::collapse Main() — lines 8–33
Sets up the game state, optionally loads a file, otherwise builds the default 6×6 game, then starts it.

- `FileName != FILE_EXTENSION` is how it spots "user just pressed Enter": the input was empty, so the name is only `".txt"`.
- Unpacking 7 return values in one line means a **failed** load still overwrites `MaxScore` etc. with LoadGame's own defaults (`MaxScore = 0`). That is a real bug (see [P.3](#/topic/P.3)).
- `for Count in range(1, 37)` runs 36 times → 36 piles → 6×6. Each pile gets A1, B2, A1; with insert-at-front the order becomes **A (top), B, A**.
- `input()` at the end just keeps a console window open.

**Exam angle:** name the constant (`FILE_EXTENSION` — a constant by naming convention only; Python doesn't enforce it). Explain why the default game always matches on the first turn.
:::

:::collapse LoadGame(FileName) — lines 35–73
Reads the text file line by line with `readline()`, building `Pile`, `Tile` and `Player` objects.

- The whole read sits inside `try` with a **bare** `except`, so any error (file missing, bad number, too few lines) prints "File not loaded". Robust, but it hides the real cause.
- `int()` ignores the trailing newline, so `int("2\n")` is fine.
- Pile tiles are read with `range(len(Items) - 2, -1, -2)`: **backwards in pairs**, because `Add` inserts at the front. Net effect: first symbol in the file = top tile.
- `PileSize = len(Items) // 2` sets the pile's maximum to its starting number of tiles (the bonus is the odd one out, which `//` discards).
- The discard uses `range(0, len(Items) - 1, 2)`. The `- 1` makes the blank line work: `"\n".split(",")` gives `['\n']`, length 1, so the loop runs 0 times. Without the `- 1` it would try `Items[1]` and crash into the except.

**Exam angle:** why is the loop backwards? Why `// 2`? What is the purpose of the exception handling? Give one type of error it catches (`FileNotFoundError`, `ValueError`, `IndexError`).
:::

:::collapse Game.__init__ — lines 76–84
Stores state in private attributes and calculates the grid size.

- `int(math.sqrt(len(self.__Board)))` assumes a **square** board. A board of 20 piles gives `GridSize` 4: piles 16–19 aren't displayed, but you can still reach them with y = 5.
- `__GameOver` isn't a parameter: it always starts `False`.

**Exam angle:** what does the double underscore do? (Private; name mangling to `_Game__Board`.) Why calculate `GridSize` rather than store it in the file? (It can't disagree with the number of piles; one less thing to keep consistent.)
:::

:::collapse Game.PlayGame — lines 86–126
The main game loop: menu, pile choice, comparison, scoring, turn change, end check, winner.

- The inner `while Choice != "T"` loop is the menu. Only **uppercase** T ends it. Any other input just redisplays the menu with no error.
- `while Pile1 == Pile2` stops a player picking one pile twice. Without it, a tile would "match" itself and `Remove` would run twice on one pile. (It re-asks with **no message**.)
- `__TurnsSinceMatch += 1` happens before the check, then is reset to 0 on a match.
- The **empty-pile check comes before** `GetSymbolOfTopTile()`, which would raise `IndexError` on an empty list.
- `ScoreIncrease = 0` then `+=` looks redundant. It is scaffolding for adding more to the score later (the bonus?).
- The winner check only compares `Players[0]` and `Players[1]` and prints **nothing on a draw**.

**Exam angle:** explain why the empty check comes first. Identify the condition-controlled loops. What is printed if the scores are level?
:::

:::collapse __DisplayBoard — lines 148–161
Prints the grid top row first (y counts down), each cell as the number of tiles in that pile.

- `range(self.__GridSize, 0, -1)` runs y from the top down so (1,1) ends up **bottom-left**, like a maths graph.
- `end=""` keeps a row on one line. Each count is printed as one character, so a pile of 10+ tiles or a grid wider than 9 breaks the alignment.

**Exam angle:** write down exactly what is displayed for game1 at the start: rows `4|3333`, `3|3333`, `2|3333`, `1|4533`, then `  ----` and `  1234`.
:::

:::collapse __DisplayDiscard — lines 163–176
Prints the discard as comma-separated symbols, or "Empty".

- Prints item 0 first, then `", " + symbol` for the rest, so there's **no trailing comma**: a common pattern for joining a list by hand.

**Exam angle:** rewrite the `while` as a `for` loop (`for Count in range(1, len(self.__Discard)):`). Why is item 0 printed separately?
:::

:::collapse __ChoosePile / __GetIndex — lines 178–186
Read x and y, convert to a 1-D list index using row-major order.

- The 2-D grid is stored as a **1-D list**. Row y starts at index `(y - 1) * GridSize`.
- No validation: letters crash with `ValueError`; 0 gives a **negative index**, which Python wraps to the end of the list (verified: (0,1) on the default board takes from pile (6,6)).
- The `x = 0` and `y = 0` lines are redundant: both are immediately overwritten.

**Exam angle:** calculate the index of a given pile. Explain what happens with (0,1). Explain why a 1-D list was used (simpler to loop over in `__NoMoreTilesLeft`; only one index to store per pile).
:::

:::collapse __UpdateWhoseTurn — lines 188–189
`(WhoseTurn + 1) % len(Players)`

- Modulo wraps the turn back to 0 after the last player, so it works for **any** number of players. The winner code doesn't, which is inconsistent.

**Exam angle:** trace with 3 players starting at 0: 0 → 1 → 2 → 0.
:::

:::collapse __NoMoreTilesLeft / __MaxScoreReached — lines 191–201
Linear searches that **return as soon as the answer is known**.

- First non-empty pile → `False`; first player at or over MaxScore → `True`.
- `>=` not `>`: reaching MaxScore exactly ends the game.

**Exam angle:** name a method that returns a Boolean. Time complexity: O(n) in the number of piles / players.
:::

:::collapse Tile and Player — lines 203–226
Simple data classes with getters; `Player` also has `ChangeScore`.

- No setters for name or symbol: those values never change after instantiation.
- `ChangeScore` **adds** a change rather than setting a score, so a negative change works (useful for penalties).

**Exam angle:** identify an example of encapsulation. State what a constructor is and give its line (e.g. `def __init__(self, S, P):` at line 204).
:::

:::collapse Pile — lines 228–253
A **stack** of tiles with a maximum size and a bonus.

- Top of stack = **index 0**. `insert(0, T)` = push; `pop(0)` = pop. Both shift every other element: O(n). Using the **end** of the list (`append` / `pop()`) would be O(1).
- `Add` silently **ignores** a tile when full. No error, no return value.
- `GetSymbolOfTopTile` and `Remove` assume the pile isn't empty; callers must check `Empty()` first.
- `_Bonus` has no getter and is never used.

**Exam angle:** what data structure is a pile? Why? (LIFO: only the top tile can be removed.) Suggest a more efficient implementation and justify it.
:::

## The game file, decoded

`game1.txt` lists piles **bottom row first, left to right**, so file line = pile index + 2.

| Line(s) | game1.txt | Meaning |
|---|---|---|
| 1 | `16` | Number of piles. GridSize = int(√16) = 4 |
| 2–17 | `2,A,1,E,1,H,3,J,2` | Bonus, then symbol,points pairs, **top tile first**. PileSize = len(Items) // 2, so the pile's max = its starting tile count |
| 18 | `2` | Number of players |
| 19–20 | `Boris,0` | Name, score (one line per player) |
| 21 | *(blank)* | Discard as symbol,points pairs. Blank = empty discard |
| 22 | `15` | MaxScore |
| 23 | `0` | WhoseTurn (index into Players, so Boris starts) |
| 24 | `0` | TurnsSinceMatch |

{{tool:pot-board}}

:::note Facts about game1 worth knowing (checked by running it)
- **51 tiles** worth **107 points** in total.
- Counts: A 8, E 12, H 12, K 6, J 3, F 2, O 2, Q 2, R 2, U 2.
- **J appears 3 times** (odd), so one J can never be matched. `__NoMoreTilesLeft()` can never be true and the game can only end through **MaxScore (15)**.
- Same symbol, different points: U1 vs U5, H1 vs H3, K1/K3/K4/K7. Matching only checks the **symbol**.
- Bonuses: (1,1) = 2, (3,3) = 4, (4,3) = 2. The skeleton never uses them.
- Vowels are always 1 point. Pile (2,1) has 5 tiles; everything else has 3 or 4.
:::

:::example Trace LoadGame on one pile line
Line `4,U,5,E,1,K,4` (pile (3,3)).

1. `Items = ["4","U","5","E","1","K","4\n"]` — 7 elements.
2. `PileSize = 7 // 2 = 3`; `P = Pile(3, int("4"))`, so `_Max = 3`, `_Bonus = 4`.
3. `range(5, -1, -2)` gives TileNo = 5, 3, 1.
4. TileNo 5: `Add(Tile("K", 4))` → `_Tiles = [K4]`.
5. TileNo 3: `Add(Tile("E", 1))` inserts at 0 → `[E1, K4]`.
6. TileNo 1: `Add(Tile("U", 5))` → `[U5, E1, K4]`. **U is on top**, the first tile in the file.

**Why backwards?** Reading forwards with insert-at-0 would leave the *last* tile in the file on top — the reverse of the file's order.
:::

## Coordinates and indices

`__GetIndex(x, y)` returns `x - 1 + (y - 1) * GridSize`. The `- 1`s convert **1-based** coordinates into a **0-based** index.

:::example Worked conversions
- game1 (GridSize 4), pile (3, 2): 3 − 1 + (2 − 1) × 4 = **6**.
- Default game (GridSize 6), pile (3, 2): 3 − 1 + 1 × 6 = **8**.
- Reverse, index 10 on game1: x = 10 % 4 + 1 = **3**, y = 10 // 4 + 1 = **3** → pile (3, 3).
- Default game, (0, 1): 0 − 1 + 0 = **−1** → Python's last element → pile (6, 6). No crash, wrong pile.
- Default game, (7, 1): 7 − 1 + 0 = 6 → pile (1, 2). Silent wrap.
- Default game, (1, 9): 0 + 8 × 6 = 48 ≥ 36 → **IndexError**.
:::

{{trace:P.2-1}}

## The full skeleton

:::collapse Show all 256 lines (AQA preliminary material — keep private)
```python nocheck
#Skeleton Program code for the AQA A Level Paper 1 Summer 2027 examination
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
```
:::

:::exam
- **"Explain why…"** questions about the skeleton want the **mechanism**: "because `Add` inserts at index 0, the last tile added ends up on top, so reading backwards leaves the first tile in the file on top".
- Quote **identifiers exactly** (`__GetIndex`, `GetSymbolOfTopTile`) and give **line numbers** when asked to identify something.
- For class-relationship questions, name the relationship (**aggregation**), say **which way** it goes and **why** (objects created outside and passed in / can exist independently).
:::

:::challenge
1. Without running it: what does `__DisplayBoard` print for game1 after Boris matches (1,1) with (1,2)? Then check with the console above.
2. A file has 9 piles. What is GridSize? Which pile is index 5?
3. Why can a subclass of `Pile` use `self._Tiles`, but a subclass of `Game` cannot use `self.__Board`?
4. Find every place that assumes there are exactly two players. Which method already copes with any number?
:::

:::recap
- Game ◇— Pile / Player / Tile (discard): **aggregation**. Pile ◇— Tile.
- `__` = private (name-mangled); `_` = protected by convention → subclass candidates.
- Pile = **stack** with top at index 0; `LoadGame` reads tiles backwards so the file's first tile is on top.
- `index = x − 1 + (y − 1) × GridSize`; reverse with `%` and `//`.
- game1: 51 tiles, 107 points, 3 Js → can only end via MaxScore 15.
:::

:::related
- [P.3 Bugs, weaknesses and unused features](#/topic/P.3)
- [P.4 Section C: questions about the skeleton](#/topic/P.4)
- [1.8 Object-oriented programming](#/topic/1.8)
- [2.3 Stacks](#/topic/2.3)
:::

*/});
