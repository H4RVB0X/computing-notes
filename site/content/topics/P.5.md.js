CS.registerTopic({ id: "P.5", title: "Section D: practice modifications" }, function () {/*

:::objectives
- Know how Section D answers are marked: **part .1** (your changed code) and **part .2** (a screenshot of a named test).
- Find the place to change in the skeleton quickly, and change it without breaking anything else.
- Use OOP correctly in a modification: new methods in the right class, subclasses with `super().__init__`, `isinstance`, and the **name-mangling** trap with `__` attributes.
- Complete each practice modification **unaided**, test it with the exact inputs given, and compare with a model answer that has been run against the real skeleton.
:::

:::quick At a glance
- Section D = Q12–Q15, **37 marks**, roughly 6, 7, 11 and 13 marks. Each question has **.1 code** and **.2 test screenshot**.
- **.1**: paste **every method you changed, in full**, plus any new method or class. Marks go to **individual features** (a loop, a condition, a message, a method in the right class), so partial answers score.
- **.2**: run **exactly** the test the question describes; the screenshot must show the **inputs and the outputs**. Cheap marks: never skip them.
- **Save a working copy** before each question and **run after every small change**.
- New behaviour goes in the class that **owns the data**: tile rules in `Tile`, pile contents in `Pile`, scores in `Player`, game flow in `Game`.
- `Game`'s attributes are **private** (`__Board` → `_Game__Board`); a subclass of `Game` cannot see them. `Tile`, `Player` and `Pile` use `_` (protected), so subclassing them is easy.
- Every model answer and test output on this page was produced by running the modified skeleton.
:::

:::keyterms
Modification :: A change to the skeleton program's code to add or alter functionality, as specified by the question. :: What Section D asks you to do.
Evidence of testing :: A screenshot showing the program being run with the inputs specified in the question and the resulting outputs. :: Proof it works.
Name mangling :: Python's renaming of an attribute written with two leading underscores inside class C to _C__name, so it cannot be accessed by that name from outside the class or from a subclass. :: Why `self.__Board` vanishes in a subclass.
isinstance :: A built-in function that returns True if an object is an instance of a given class or of one of its subclasses. :: "Is this player a computer?"
super() :: A function that gives access to the superclass's methods from a subclass, used to call the superclass constructor or an overridden method. :: "Do what my parent does first."
Getter (accessor) :: A method that returns the value of a protected or private attribute. :: The approved way to read hidden data.
Refactoring :: Changing the internal structure of code without changing its external behaviour. :: Same outputs, better code.
:::

{{tool:pot-console}}

## How Section D is marked

| Part | What you submit | What earns marks |
|---|---|---|
| **.1 code** | every changed method **in full**, every new method and class | one mark per correct feature: the loop, the condition, the message text, the new method in the **right class**, the call to it, the menu line… |
| **.2 test** | a screenshot of the test the question describes | the named **inputs** visible **and** the expected **outputs** visible |

- **Paste from your IDE**, so indentation survives. "Every line and the full length of every line" must be visible.
- **Partial credit is real.** A loop with the right condition but a wrong message still scores the loop and the condition marks.
- **The test mark needs a running program.** If your change crashes, you lose the screenshot mark even if most of the code is right.

:::trap
- **Don't paste only the lines you changed.** The mark scheme asks for the whole method; examiners need to see where your lines sit.
- **Don't change the prompts or messages** the question gives you. Copy them character for character, including capitals and punctuation.
- **Don't write all four answers and then run once.** If Q15 breaks the program, your Q12–Q14 screenshots go with it. Keep a working copy per question.
- **Don't hard-code 6 or 36.** game1 is a 4 × 4 board. Use `self.__GridSize` and `len(self.__Board)`.
:::

## Workflow in the exam

:::steps Do this for every Section D question
1. **Read the whole question**, including the test in part .2. The test tells you exactly what must work.
2. **Save a copy** of the current working program (e.g. `skeleton_q13.py`).
3. **Find the place** to change (table below). Note every method you will touch.
4. **Make the smallest change that runs**, and run it. Then add the next feature and run again.
5. **Run the test** in part .2 with the exact inputs, and screenshot the console.
6. **Paste every changed method in full** into the EAD, then the screenshot.
:::

### Where things happen in the skeleton

| You need to change… | Look in | Search for |
|---|---|---|
| the default game (players, piles) | `Main` | `Players.append` |
| reading the game file | `LoadGame` | `File.readline` |
| the menu and what each option does | `Game.PlayGame` (inner loop) and `Game.__DisplayMenu` | `Choice ==` |
| choosing piles / coordinates | `Game.__ChoosePile`, `Game.__GetIndex` | `Enter x coordinate` |
| matching and scoring | `Game.PlayGame` (outer loop) | `GetSymbolOfTopTile() ==` |
| whose turn it is | `Game.__UpdateWhoseTurn` | `% len(self.__Players)` |
| how the game ends / who wins | `__MaxScoreReached`, `__NoMoreTilesLeft`, end of `PlayGame` | `has won` |
| what a tile, player or pile knows | `Tile`, `Player`, `Pile` | `def __init__` |

The fastest search is for a **message the program prints**: if the question mentions "You did not find a matching pair", Ctrl+F that text.

### OOP pitfalls in modifications

**1. Put new data and methods in the class that owns them.** A list of a player's matched symbols belongs in `Player`; a pile's bonus getter belongs in `Pile`. Examiners award "method added to the correct class".

**2. Name mangling.** Inside `Game`, `self.__Board` is really stored as `self._Game__Board`. A subclass of `Game` cannot use `self.__Board`:

```python nocheck
class TimedGame(Game):
    def CountPiles(self):
        return len(self.__Board)     # looks for _TimedGame__Board

# AttributeError: 'TimedGame' object has no attribute '_TimedGame__Board'
```

So **extend `Game` by editing it**, not by subclassing it. `Tile`, `Player` and `Pile` use one underscore (`_Score`), which is only a convention, so their subclasses can use the attributes directly.

**3. Subclass constructors must call the parent's.**

```python nocheck
class ComputerPlayer(Player):
    def __init__(self, N, S):
        super().__init__(N, S)       # sets _Name and _Score
        self._Memory = {}            # then the new attribute
```

**4. Use `isinstance` to treat a subclass differently**: `if isinstance(CurrentPlayer, ComputerPlayer):`. It is also True for subclasses of `ComputerPlayer`.

**5. Prefer overriding to `if` chains.** If wild tiles match anything, give `Tile` a `Matches` method and **override** it in `WildTile`. That is the polymorphism the mark scheme looks for.

:::example Adding a menu option: the four edits every time
Most medium questions add a menu option. You always need:

1. A line in `__DisplayMenu`: `print("P. Peek at a pile (costs 1 point)")`.
2. An `elif` in the inner loop of `PlayGame`: `elif Choice == "P": self.__Peek()`.
3. The new private method in `Game` (above `__DisplayScores` keeps it tidy).
4. If you've done the **menu** task, add the letter to the list of valid choices in `__GetChoice` too.

Forgetting step 1 or 2 is the most common lost mark: the method is perfect but can never be called.
:::

## Practice modifications from your prep page

Try each one in your IDE before opening anything. Open **Hint 1** only when stuck, then **Hint 2**, and the model answer last. Tick the matching spec point in the checklist only when you did it **unaided** and your test output matched.

### 1. Accept lowercase and reject invalid menu choices

*Likely size: Q12-size · ~5 marks* · spec point `P.5-menu`

Modify `__GetChoice` so lowercase input is accepted and anything that isn't B, D, T or S shows "That is not a valid menu option" and asks again.

> In the console above, open **Modifications** and switch on **menu** to see the intended behaviour before you write any code.

:::collapse Hint 1
`.upper()` on the input fixes the case problem.
:::

:::collapse Hint 2
Loop `while Choice not in [...]`, re-prompting **inside** the loop. Copy the original prompt exactly.
:::

:::collapse Model answer
**Game.__GetChoice (replace the whole method)**

```python nocheck
    def __GetChoice(self):
        Choice = input(f"{self.__Players[self.__WhoseTurn].GetName()}, enter your choice: ").upper()
        while Choice not in ["B", "D", "T", "S"]:
            print("That is not a valid menu option")
            Choice = input(f"{self.__Players[self.__WhoseTurn].GetName()}, enter your choice: ").upper()
        return Choice
```

:::

:::collapse Test to screenshot
Default game. Enter `x`, then `t`, then (1,1) and (2,1).

Expected output (each input appears after its prompt):

```output
Enter filename to load or just press Enter to play the default game:
Player 1, enter your choice: x
That is not a valid menu option
Player 1, enter your choice: t
Enter x coordinate: 1
Enter y coordinate: 1
Enter x coordinate: 2
Enter y coordinate: 1
Player 1, you had two matching A tiles; your score has increased by 2
```

:::

### 2. Fix the failed-load bug

*Likely size: Q12-size · ~4 marks* · spec point `P.5-loadfix`

When a file fails to load, the default game should start with MaxScore 10 and empty lists, not with whatever `LoadGame` returned.

> In the console above, open **Modifications** and switch on **loadfix** to see the intended behaviour before you write any code.

:::collapse Hint 1
The problem is the unpacking line in `Main`: the default values are overwritten even when loading fails.
:::

:::collapse Hint 2
Reset all six values inside the existing `if UseDataFromFile == False:` block that prints "Setting up default game".
:::

:::collapse Model answer
**Main (extend the 'Setting up default game' block)**

```python nocheck
        if UseDataFromFile == False:
            print("Setting up default game")
            Board = []
            Players = []
            Discard = []
            MaxScore = 10
            WhoseTurn = 0
            TurnsSinceMatch = 0
```

:::

:::collapse Test to screenshot
Enter `wrong` as the filename, match (1,1)+(2,1), then choose `S`. (Unfixed, the game would end after this match with "Player 1 has won!".)

Expected output (each input appears after its prompt):

```output
Enter x coordinate: 2
Enter y coordinate: 1
Player 1, you had two matching A tiles; your score has increased by 2
Player 2, enter your choice: S
Player 1: has a score of 2
Player 2: has a score of 0
```

:::

### 3. Validate the pile coordinates

*Likely size: Q12-size · ~6 marks* · spec point `P.5-validate`

Modify `__ChoosePile` so it keeps asking until the user enters two whole numbers that are both between 1 and the grid size. Show a suitable message for each kind of error.

> In the console above, open **Modifications** and switch on **validate** to see the intended behaviour before you write any code.

:::collapse Hint 1
You need a loop around both inputs, plus `try/except ValueError` to catch letters.
:::

:::collapse Hint 2
Use `self.__GridSize` for the upper bound. Don't hard-code 6, because game1 is 4 × 4. A Boolean flag such as `Valid` makes the loop clear.
:::

:::collapse Model answer
**Game.__ChoosePile (replace the whole method)**

```python nocheck
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
```

:::

:::collapse Test to screenshot
Default game. Choose `T`, enter `a`, then x = `1`, y = `9`, then (1,1) and (2,1).

Expected output (each input appears after its prompt):

```output
Enter filename to load or just press Enter to play the default game:
Player 1, enter your choice: T
Enter x coordinate: a
Coordinates must be whole numbers
Enter x coordinate: 1
Enter y coordinate: 9
Coordinates must be between 1 and 6
Enter x coordinate: 1
Enter y coordinate: 1
Enter x coordinate: 2
Enter y coordinate: 1
Player 1, you had two matching A tiles; your score has increased by 2
```

:::

### 4. Announce a draw, for any number of players

*Likely size: Q12/13-size · ~6 marks* · spec point `P.5-winner`

Replace the end-of-game check so it works for any number of players and prints "It is a draw between …" when the highest score is shared.

> In the console above, open **Modifications** and switch on **winner** to see the intended behaviour before you write any code.

:::collapse Hint 1
Two passes: find the highest score, then collect every player who has it.
:::

:::collapse Hint 2
If the collected list has length 1 it's a win; otherwise it's a draw. `' and '.join(...)` builds the names.
:::

:::collapse Model answer
**Game.PlayGame (replace the final if/elif)**

```python nocheck
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
```

:::

:::collapse Test to screenshot
Save the 4-pile file below as `d.txt`. Load `d`; Amy matches (1,1)+(2,1), Ben matches (1,2)+(2,2).

```text
4
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
```

Expected output (each input appears after its prompt):

```output
Enter x coordinate: 2
Enter y coordinate: 2
Ben, you had two matching B tiles; your score has increased by 2
It is a draw between Amy and Ben on 2 points
```

:::

### 5. Extra turn after a match

*Likely size: Q13-size · ~5 marks* · spec point `P.5-extra`

A player who finds a matching pair takes another turn, with a message saying so.

> In the console above, open **Modifications** and switch on **extra** to see the intended behaviour before you write any code.

:::collapse Hint 1
Track whether this turn found a match with a local Boolean, reset at the start of every turn.
:::

:::collapse Hint 2
Only call `__UpdateWhoseTurn()` when there was no match.
:::

:::collapse Model answer
**Game.PlayGame (just before `self.__TurnsSinceMatch += 1`)**

```python nocheck
            Matched = False
            self.__TurnsSinceMatch += 1
```

**Game.PlayGame (match branch)**

```python nocheck
                    self.__TurnsSinceMatch = 0
                    Matched = True
                    Tile1
```

**Game.PlayGame (end of the turn)**

```python nocheck
            print()
            if Matched:
                print(f"{self.__Players[self.__WhoseTurn].GetName()} found a pair and takes another turn")
            else:
                self.__UpdateWhoseTurn()
```

:::

:::collapse Test to screenshot
Default game: match (1,1)+(2,1).

Expected output (each input appears after its prompt):

```output
Enter x coordinate: 2
Enter y coordinate: 1
Player 1, you had two matching A tiles; your score has increased by 2
Player 1 found a pair and takes another turn
```

:::

### 6. End the game after 10 turns without a match

*Likely size: Q13-size · ~5 marks* · spec point `P.5-stalemate`

Use `TurnsSinceMatch`: if 10 turns pass with no match, print a message and end the game.

> In the console above, open **Modifications** and switch on **stalemate** to see the intended behaviour before you write any code.

:::collapse Hint 1
The counter already works (it is incremented every turn and reset on a match). You only need to act on it.
:::

:::collapse Hint 2
Check it where `__GameOver` is set, before the other two conditions.
:::

:::collapse Model answer
**Game.PlayGame (replace the GameOver line)**

```python nocheck
            if self.__TurnsSinceMatch >= 10:
                print("No match in the last 10 turns - the game is over")
                self.__GameOver = True
            else:
                self.__GameOver = self.__MaxScoreReached() or self.__NoMoreTilesLeft()
```

:::

:::collapse Test to screenshot
Default game: match (1,1)+(2,1), then choose (1,1)+(3,1) ten times (B against A each time).

Expected output (each input appears after its prompt):

```output
You did not find a matching pair.
The first pile you chose had a B
The second pile you chose had a A
No match in the last 10 turns - the game is over
Player 1 has won!
```

:::

### 7. Use the pile bonus

*Likely size: Q13-size · ~6 marks* · spec point `P.5-bonus`

When a matching pair is found, add the bonus of both piles to the score increase.

> In the console above, open **Modifications** and switch on **bonus** to see the intended behaviour before you write any code.

:::collapse Hint 1
`Pile` has no way to read `_Bonus` from outside, so add a getter first.
:::

:::collapse Hint 2
Add the bonuses to `ScoreIncrease` **before** `ChangeScore` is called. (A variant awards the bonus only when a pile is emptied: see the new task below.)
:::

:::collapse Model answer
**Pile (new method after GetNumberOfTiles)**

```python nocheck
    def GetNumberOfTiles(self):
        return len(self._Tiles)

    def GetBonus(self):
        return self._Bonus
```

**Game.PlayGame (match branch)**

```python nocheck
                    ScoreIncrease += Tile1.GetPoints() + Tile2.GetPoints()
                    ScoreIncrease += self.__Board[Pile1].GetBonus() + self.__Board[Pile2].GetBonus()
```

:::

:::collapse Test to screenshot
Load `game1`, choose (1,1) [bonus 2] and (1,2) [bonus 0].

Expected output (each input appears after its prompt):

```output
Enter y coordinate: 2
Boris, you had two matching A tiles; your score has increased by 4
```

:::

### 8. Peek power-up (costs 1 point)

*Likely size: Q13/14-size · ~8 marks* · spec point `P.5-peek`

Add menu option P. The player chooses a pile and is shown its top symbol, at a cost of 1 point. Refuse if they have less than 1 point; don't charge for an empty pile.

> In the console above, open **Modifications** and switch on **peek** to see the intended behaviour before you write any code.

:::collapse Hint 1
New private method `__Peek` in `Game`; reuse `__ChoosePile`.
:::

:::collapse Hint 2
`ChangeScore(-1)` works because `ChangeScore` adds its argument. Remember the menu text **and** the `elif`.
:::

:::collapse Model answer
**Game.PlayGame (menu handling)**

```python nocheck
                elif Choice == "S":
                    self.__DisplayScores()
                elif Choice == "P":
                    self.__Peek()
```

**Game.__DisplayMenu (new line)**

```python nocheck
        print("S. Display scores")
        print("P. Peek at a pile (costs 1 point)")
```

**Game (new method, above __DisplayScores)**

```python nocheck
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
```

:::

:::collapse Test to screenshot
Default game. Player 1 chooses `P` with 0 points (refused), matches (1,1)+(2,1); Player 2 matches (3,1)+(4,1); Player 1 peeks at (3,3), then `S`.

Expected output (each input appears after its prompt):

```output
Enter filename to load or just press Enter to play the default game:
Player 1, enter your choice: P
You need at least 1 point to peek
Player 1, enter your choice: T
Enter x coordinate: 1
Enter y coordinate: 1
Enter x coordinate: 2
Enter y coordinate: 1
Player 1, you had two matching A tiles; your score has increased by 2
Player 2, enter your choice: T
Enter x coordinate: 3
Enter y coordinate: 1
Enter x coordinate: 4
Enter y coordinate: 1
Player 2, you had two matching A tiles; your score has increased by 2
Player 1, enter your choice: P
Enter x coordinate: 3
Enter y coordinate: 3
The top tile is A
Player 1, enter your choice: S
Player 1: has a score of 1
Player 2: has a score of 2
```

:::

### 9. Save the game to a file

*Likely size: Q14-size · ~11 marks* · spec point `P.5-save`

Add menu option V that asks for a filename and saves the game in the same format as game1.txt, so it can be loaded again.

> In the console above, open **Modifications** and switch on **save** to see the intended behaviour before you write any code.

:::collapse Hint 1
Each pile line is the bonus, then symbol,points from the top tile down. A `Pile` method that builds this string keeps the protected data inside `Pile`.
:::

:::collapse Hint 2
Write the lines in the order `LoadGame` reads them. Avoid a trailing comma on the discard line, and write an empty line if the discard is empty.
:::

:::collapse Model answer
**Pile (new method after GetNumberOfTiles)**

```python nocheck
    def GetNumberOfTiles(self):
        return len(self._Tiles)

    def GetSaveString(self):
        Line = str(self._Bonus)
        for T in self._Tiles:
            Line += f",{T.GetSymbol()},{T.GetPoints()}"
        return Line
```

**Game.PlayGame (menu handling)**

```python nocheck
                elif Choice == "S":
                    self.__DisplayScores()
                elif Choice == "V":
                    self.__SaveGame()
```

**Game.__DisplayMenu (new line)**

```python nocheck
        print("S. Display scores")
        print("V. Save game")
```

**Game (new method, above __DisplayScores)**

```python nocheck
    def __SaveGame(self):
        FileName = input("Enter filename to save to: ") + ".txt"
        with open(FileName, "w") as File:
            File.write(f"{len(self.__Board)}\n")
            for P in self.__Board:
                File.write(P.GetSaveString() + "\n")
            File.write(f"{len(self.__Players)}\n")
            for P in self.__Players:
                File.write(f"{P.GetName()},{P.GetScore()}\n")
            DiscardLine = ""
            for T in self.__Discard:
                if DiscardLine != "":
                    DiscardLine += ","
                DiscardLine += f"{T.GetSymbol()},{T.GetPoints()}"
            File.write(DiscardLine + "\n")
            File.write(f"{self.__MaxScore}\n")
            File.write(f"{self.__WhoseTurn}\n")
            File.write(f"{self.__TurnsSinceMatch}\n")
        print(f"Game saved to {FileName}")

    def __DisplayScores(self):
```

:::

:::collapse Test to screenshot
Load `game1`, match (1,1)+(1,2), choose `V` and save as `saved1`.

Expected output (each input appears after its prompt):

```output
Boris, you had two matching A tiles; your score has increased by 2
Poppy, enter your choice: V
Enter filename to save to: saved1
Game saved to saved1.txt
```

Then restart the **original** skeleton, enter `saved1` and choose `B`, `D`, `S`. It must load your file:

```output
Enter filename to load or just press Enter to play the default game: saved1
Poppy, enter your choice: B
4|3333
3|3333
2|2333
1|3533
  ----
  1234
Poppy, enter your choice: D
Discard: A, A
Poppy, enter your choice: S
Boris: has a score of 2
Poppy: has a score of 0
```

:::

### 10. A computer player with a memory

*Likely size: Q15-size · ~13 marks* · spec point `P.5-computer`

Create a `ComputerPlayer` subclass of `Player`. It remembers every symbol revealed in a non-matching turn. On its turn it picks a known pair if it has one, otherwise two random non-empty piles. Player 2 in the default game should be the computer.

:::collapse Hint 1
Inherit with `class ComputerPlayer(Player)` and call `super().__init__`. A dictionary of pile index → symbol is a good memory.
:::

:::collapse Hint 2
`Game` must tell computer players what was revealed (remember on a miss; forget both piles on a match because their top tiles change). Use `isinstance` to decide whether to show the menu. Convert index → (x, y) with `%` and `//` to print its choice.
:::

:::collapse Model answer
**Top of file**

```python nocheck
import math
import random
```

**Main (second player)**

```python nocheck
        Players.append(ComputerPlayer("Computer", 0))
```

**Game.PlayGame (start of the outer loop: replace the menu loop and pile choice)**

```python nocheck
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
```

**Game.PlayGame (match branch)**

```python nocheck
                    self.__TurnsSinceMatch = 0
                    self.__TellComputers(Pile1, Pile2, False)
                    Tile1 = self.__Board[Pile1].Remove()
```

**Game.PlayGame (no-match branch)**

```python nocheck
                else:
                    self.__TellComputers(Pile1, Pile2, True)
                    print("You did not find a matching pair.")
```

**Game (two new methods, above __DisplayScores)**

```python nocheck
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
```

**New class (place above class Pile)**

```python nocheck
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
```

:::

:::collapse Test to screenshot
For a repeatable screenshot, temporarily add `random.seed(3)` under `import random`. Default game. Player 1 enters (1,1)+(2,1), (1,1)+(2,1), (3,1)+(4,1), (1,1)+(3,1) and (2,2)+(3,2) on successive turns; the computer plays automatically in between.

Expected output (each input appears after its prompt):

```output
Enter filename to load or just press Enter to play the default game:
Player 1, enter your choice: T
Enter x coordinate: 1
Enter y coordinate: 1
Enter x coordinate: 2
Enter y coordinate: 1
Player 1, you had two matching A tiles; your score has increased by 2
Computer chose (4, 3) and (5, 6)
Computer, you had two matching A tiles; your score has increased by 2
Player 1, enter your choice: T
Enter x coordinate: 1
Enter y coordinate: 1
Enter x coordinate: 2
Enter y coordinate: 1
Player 1, you had two matching B tiles; your score has increased by 4
Computer chose (3, 2) and (6, 4)
Computer, you had two matching A tiles; your score has increased by 2
Player 1, enter your choice: T
Enter x coordinate: 3
Enter y coordinate: 1
Enter x coordinate: 4
Enter y coordinate: 1
Player 1, you had two matching A tiles; your score has increased by 2
Computer chose (1, 6) and (5, 1)
Computer, you had two matching A tiles; your score has increased by 2
Player 1, enter your choice: T
Enter x coordinate: 1
Enter y coordinate: 1
Enter x coordinate: 3
Enter y coordinate: 1
You did not find a matching pair.
The first pile you chose had a A
The second pile you chose had a B
Computer chose (1, 1) and (1, 6)
You did not find a matching pair.
The first pile you chose had a A
The second pile you chose had a B
Player 1, enter your choice: T
Enter x coordinate: 2
Enter y coordinate: 2
Enter x coordinate: 3
Enter y coordinate: 2
You did not find a matching pair.
The first pile you chose had a A
The second pile you chose had a B
Computer chose (3, 1) and (1, 6)
Computer, you had two matching B tiles; your score has increased by 4
Computer has won!
```

Random choices differ without the seed. The marks are for the computer playing automatically, printing its coordinates and using remembered pairs (see its later match on (3,1) and (1,6)).

:::

### 11. Wild tiles (inheritance + polymorphism)

*Likely size: Q15-size · ~12 marks* · spec point `P.5-wild`

A tile with symbol `*` in a file is a wild tile that matches any symbol. Create a `WildTile` subclass of `Tile` and change the matching so it uses a polymorphic `Matches` method.

:::collapse Hint 1
Give `Tile` a `Matches(OtherTile)` method; `WildTile` **overrides** it to always return True. That's where the polymorphism marks are.
:::

:::collapse Hint 2
Normal tiles must also match when the **other** tile is wild. `Pile` needs a `GetTopTile()` so `Game` can call `Matches` on the tile object.
:::

:::collapse Model answer
**LoadGame (tile-reading loop)**

```python nocheck
                for TileNo in range(len(Items) - 2, -1, -2):
                    if Items[TileNo] == "*":
                        P.Add(WildTile(int(Items[TileNo + 1])))
                    else:
                        P.Add(Tile(Items[TileNo], int(Items[TileNo + 1])))
```

**Game.PlayGame (comparison line)**

```python nocheck
                if self.__Board[Pile1].GetTopTile().Matches(self.__Board[Pile2].GetTopTile()):
```

**Tile (new method) and the WildTile subclass**

```python nocheck
    def GetSymbol(self):
        return self._Symbol

    def Matches(self, OtherTile):
        return self._Symbol == OtherTile.GetSymbol() or OtherTile.GetSymbol() == "*"

class WildTile(Tile):
    def __init__(self, P):
        super().__init__("*", P)

    def Matches(self, OtherTile):
        return True
```

**Pile (new method after GetSymbolOfTopTile)**

```python nocheck
    def GetSymbolOfTopTile(self):
        return self._Tiles[0].GetSymbol()

    def GetTopTile(self):
        return self._Tiles[0]
```

:::

:::collapse Test to screenshot
Save the file below as `w.txt`. Load `w`; Amy chooses (1,1) [the wild tile] and (2,1) [an A]; then Ben chooses `D`.

```text
4
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
```

Expected output (each input appears after its prompt):

```output
Enter filename to load or just press Enter to play the default game: w
Amy, enter your choice: T
Enter x coordinate: 1
Enter y coordinate: 1
Enter x coordinate: 2
Enter y coordinate: 1
Amy, you had two matching * tiles; your score has increased by 1
Ben, enter your choice: D
Discard: *, A
```

The message says "two matching * tiles" because it prints `Tile1.GetSymbol()`. Printing the non-wild symbol instead would be a sensible extra.

:::


## New practice modifications

These go beyond the prep page. Same routine: attempt, hints, model answer, test.

### 12. A match needs equal points as well as the same symbol

*Likely size: Q12/13-size · ~6 marks* · spec point `P.5-points`

Change the rules so two tiles only match if they have the same symbol **and** the same points value (U1 no longer matches U5). When there is no match, show the points of both tiles as well as their symbols.

:::collapse Hint 1
`Pile` can only tell you the top tile's symbol. Add a matching getter for its points.
:::

:::collapse Hint 2
Build the condition from two Boolean variables (`SameSymbol`, `SamePoints`); it is easier to read and to mark than one very long line.
:::

:::collapse Model answer
**Pile (new method after GetSymbolOfTopTile)**

```python nocheck
    def GetSymbolOfTopTile(self):
        return self._Tiles[0].GetSymbol()

    def GetPointsOfTopTile(self):
        return self._Tiles[0].GetPoints()
```

**Game.PlayGame (comparison line)**

```python nocheck
                SameSymbol = self.__Board[Pile1].GetSymbolOfTopTile() == self.__Board[Pile2].GetSymbolOfTopTile()
                SamePoints = self.__Board[Pile1].GetPointsOfTopTile() == self.__Board[Pile2].GetPointsOfTopTile()
                if SameSymbol and SamePoints:
```

**Game.PlayGame (no-match messages)**

```python nocheck
                    print(f"The first pile you chose had a {self.__Board[Pile1].GetSymbolOfTopTile()} worth {self.__Board[Pile1].GetPointsOfTopTile()}")
                    print(f"The second pile you chose had a {self.__Board[Pile2].GetSymbolOfTopTile()} worth {self.__Board[Pile2].GetPointsOfTopTile()}")
```

:::

:::collapse Test to screenshot
Load `game1`. Boris chooses (3,3) [U5] and (1,3) [U1]; Poppy chooses (1,1) and (1,2) [A1 and A1].

Expected output (each input appears after its prompt):

```output
Poppy, enter your choice: T
Enter x coordinate: 1
Enter y coordinate: 1
Enter x coordinate: 1
Enter y coordinate: 2
Poppy, you had two matching A tiles; your score has increased by 2
```

:::

### 13. Penalty for choosing an empty pile

*Likely size: Q12-size · ~4 marks* · spec point `P.5-penalty`

If a player chooses an empty pile, they lose 1 point, but a score can never go below 0. Show a message saying which happened.

:::collapse Hint 1
Only the `else` branch that prints "You chose an empty pile" needs to change.
:::

:::collapse Hint 2
Check `GetScore() > 0` before calling `ChangeScore(-1)`.
:::

:::collapse Model answer
**Game.PlayGame (replace the empty-pile else branch)**

```python nocheck
            else:
                CurrentPlayer = self.__Players[self.__WhoseTurn]
                if CurrentPlayer.GetScore() > 0:
                    CurrentPlayer.ChangeScore(-1)
                    print("You chose an empty pile - you lose 1 point")
                else:
                    print("You chose an empty pile - you have no points to lose")
```

:::

:::collapse Test to screenshot
Save the file below as `e.txt` (the first pile line is just a bonus of `0`, so that pile starts empty). Load `e`. Amy chooses (1,1)+(2,1); Ben matches (2,1)+(1,2); Amy chooses (2,2)+(1,1); Ben chooses (1,1)+(2,2); Amy chooses `S`.

```text
4
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
```

Expected output (each input appears after its prompt):

```output
Enter filename to load or just press Enter to play the default game: e
Amy, enter your choice: T
Enter x coordinate: 1
Enter y coordinate: 1
Enter x coordinate: 2
Enter y coordinate: 1
You chose an empty pile - you have no points to lose
Ben, enter your choice: T
Enter x coordinate: 2
Enter y coordinate: 1
Enter x coordinate: 1
Enter y coordinate: 2
Ben, you had two matching A tiles; your score has increased by 2
Amy, enter your choice: T
Enter x coordinate: 2
Enter y coordinate: 2
Enter x coordinate: 1
Enter y coordinate: 1
You chose an empty pile - you have no points to lose
Ben, enter your choice: T
Enter x coordinate: 1
Enter y coordinate: 1
Enter x coordinate: 2
Enter y coordinate: 2
You chose an empty pile - you lose 1 point
Amy, enter your choice: S
Amy: has a score of 0
Ben: has a score of 1
```

:::

### 14. Choose the number of players and their names

*Likely size: Q13-size · ~7 marks* · spec point `P.5-players`

In the default game, ask how many players there are (2 to 4, validated) and then ask for each player's name (not blank) instead of using "Player 1" and "Player 2".

:::collapse Hint 1
Replace the two `Players.append(...)` lines in `Main` with a validation loop for the count, then a FOR loop for the names.
:::

:::collapse Hint 2
Wrap `int(input(...))` in `try/except ValueError` so letters are rejected, and set the count to an invalid value in the `except` so the loop repeats. Combine with the **winner** task, because the original end-of-game check only compares two players.
:::

:::collapse Model answer
**Main (replace the two Players.append lines)**

```python nocheck
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
```

:::

:::collapse Test to screenshot
Default game. Enter `5` (rejected), then `3`, then `Amy`, `Ben`, `Cal`. Amy matches (1,1)+(2,1), Ben matches (3,1)+(4,1), then Cal chooses `S`.

Expected output (each input appears after its prompt):

```output
Enter filename to load or just press Enter to play the default game:
How many players (2-4)? 5
Please enter a whole number from 2 to 4
How many players (2-4)? 3
Enter the name of player 1: Amy
Enter the name of player 2: Ben
Enter the name of player 3: Cal
Amy, enter your choice: T
Enter x coordinate: 1
Enter y coordinate: 1
Enter x coordinate: 2
Enter y coordinate: 1
Amy, you had two matching A tiles; your score has increased by 2
Ben, enter your choice: T
Enter x coordinate: 3
Enter y coordinate: 1
Enter x coordinate: 4
Enter y coordinate: 1
Ben, you had two matching A tiles; your score has increased by 2
Cal, enter your choice: S
Amy: has a score of 2
Ben: has a score of 2
Cal: has a score of 0
```

:::

### 15. Show each player's matched symbols

*Likely size: Q13-size · ~7 marks* · spec point `P.5-matched`

When scores are displayed, also show the symbols of the pairs each player has matched, e.g. "Pairs matched: A, A", or "No pairs matched yet".

:::collapse Hint 1
This data belongs to the player, so add a list attribute to `Player` (in the constructor) with a method to add to it and a getter.
:::

:::collapse Hint 2
Call the new `Player` method in the match branch of `PlayGame`, then change `__DisplayScores`. Don't make the list a `Game` attribute.
:::

:::collapse Model answer
**Player (replace the constructor and add two methods)**

```python nocheck
    def __init__(self, N, S):
        self._Name = N
        self._Score = S
        self._Matched = []

    def AddMatch(self, Symbol):
        self._Matched.append(Symbol)

    def GetMatched(self):
        return self._Matched
```

**Game.PlayGame (match branch, after ChangeScore)**

```python nocheck
                    self.__Players[self.__WhoseTurn].ChangeScore(ScoreIncrease)
                    self.__Players[self.__WhoseTurn].AddMatch(Tile1.GetSymbol())
```

**Game.__DisplayScores (replace the whole method)**

```python nocheck
    def __DisplayScores(self):
        print()
        for P in self.__Players:
            print(f"{P.GetName()}: has a score of {P.GetScore()}")
            if len(P.GetMatched()) == 0:
                print("   No pairs matched yet")
            else:
                print(f"   Pairs matched: {', '.join(P.GetMatched())}")
        print()
```

:::

:::collapse Test to screenshot
Default game. Player 1 matches (1,1)+(2,1), Player 2 matches (1,1)+(2,1), Player 1 matches (3,1)+(4,1), then Player 2 chooses `S`.

Expected output (each input appears after its prompt):

```output
Player 1, you had two matching A tiles; your score has increased by 2
Player 2, enter your choice: S
Player 1: has a score of 4
   Pairs matched: A, A
Player 2: has a score of 4
   Pairs matched: B
```

:::

### 16. Display the discard in alphabetical order (own sort)

*Likely size: Q13-size · ~6 marks* · spec point `P.5-sortdiscard`

When the discard is displayed, show the symbols in alphabetical order. Write your own sort (insertion or bubble); do not use `sort()` or `sorted()`. The order of the discard list itself must not change.

:::collapse Hint 1
Copy the symbols into a new list first, so you sort strings and leave `__Discard` alone.
:::

:::collapse Hint 2
Insertion sort: for each item from index 1, shift larger items one place right, then drop the item into the gap. `", ".join(...)` prints the result with commas.
:::

:::collapse Model answer
**Game.__DisplayDiscard (replace the whole method)**

```python nocheck
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
```

:::

:::collapse Test to screenshot
Default game. Player 1 matches (1,1)+(2,1) [A], Player 2 matches (1,1)+(2,1) [B], Player 1 matches (3,1)+(4,1) [A], then Player 2 chooses `D`. Unsorted, the discard is A, A, B, B, A, A.

Expected output (each input appears after its prompt):

```output
Player 2, enter your choice: D
Discard: A, A, A, A, B, B
```

:::

### 17. Count the symbols left on the board (dictionary)

*Likely size: Q14-size · ~9 marks* · spec point `P.5-symbols`

Add menu option C that displays how many tiles of each symbol are still on the board, one symbol per line in alphabetical order.

:::collapse Hint 1
`Pile` keeps its tiles protected, so add a method that returns a list of the symbols in the pile.
:::

:::collapse Hint 2
Use a dictionary: symbol → count. If the symbol is already a key add 1, otherwise set it to 1. Loop over `sorted(Counts)` to print in order. Add the menu line and the `elif`.
:::

:::collapse Model answer
**Pile (new method after GetNumberOfTiles)**

```python nocheck
    def GetNumberOfTiles(self):
        return len(self._Tiles)

    def GetSymbols(self):
        Symbols = []
        for T in self._Tiles:
            Symbols.append(T.GetSymbol())
        return Symbols
```

**Game.PlayGame (menu handling)**

```python nocheck
                elif Choice == "S":
                    self.__DisplayScores()
                elif Choice == "C":
                    self.__DisplaySymbolCounts()
```

**Game.__DisplayMenu (new line)**

```python nocheck
        print("S. Display scores")
        print("C. Count the symbols left")
```

**Game (new method, above __DisplayScores)**

```python nocheck
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
```

:::

:::collapse Test to screenshot
Load `game1` and choose `C`. Then match (1,1)+(1,2) and choose `C` again.

Expected output (each input appears after its prompt):

```output
Enter filename to load or just press Enter to play the default game: game1
Boris, enter your choice: C
A: 8
E: 12
F: 2
H: 12
J: 3
K: 6
O: 2
Q: 2
R: 2
U: 2
Boris, enter your choice: T
Enter x coordinate: 1
Enter y coordinate: 1
Enter x coordinate: 1
Enter y coordinate: 2
Boris, you had two matching A tiles; your score has increased by 2
Poppy, enter your choice: C
A: 6
E: 12
F: 2
H: 12
J: 3
K: 6
O: 2
Q: 2
R: 2
U: 2
```

:::

### 18. Bonus only when a pile is emptied

*Likely size: Q13-size · ~6 marks* · spec point `P.5-bonusempty`

A pile's bonus is only awarded to the player whose match **empties** that pile. Show a message when a bonus is won.

:::collapse Hint 1
You still need the `GetBonus` getter from the bonus task.
:::

:::collapse Hint 2
After both `Remove()` calls, check `Empty()` on each pile. A loop over `[Pile1, Pile2]` avoids writing the same code twice.
:::

:::collapse Model answer
**Pile (new method after GetNumberOfTiles)**

```python nocheck
    def GetNumberOfTiles(self):
        return len(self._Tiles)

    def GetBonus(self):
        return self._Bonus
```

**Game.PlayGame (match branch)**

```python nocheck
                    ScoreIncrease += Tile1.GetPoints() + Tile2.GetPoints()
                    for PileNo in [Pile1, Pile2]:
                        if self.__Board[PileNo].Empty() and self.__Board[PileNo].GetBonus() > 0:
                            ScoreIncrease += self.__Board[PileNo].GetBonus()
                            print(f"You emptied a pile with a bonus of {self.__Board[PileNo].GetBonus()}")
```

:::

:::collapse Test to screenshot
Save the file below as `b.txt`. Load `b`. Amy matches (1,1)+(2,1) [pile (1,1) has bonus 3 and becomes empty]; Ben matches (2,1)+(1,2) [both emptied, bonus 0].

```text
4
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
```

Expected output (each input appears after its prompt):

```output
Ben, enter your choice: T
Enter x coordinate: 2
Enter y coordinate: 1
Enter x coordinate: 1
Enter y coordinate: 2
Ben, you had two matching B tiles; your score has increased by 2
```

:::

### 19. Line up the board display for 10+ tiles and big grids

*Likely size: Q13-size · ~6 marks* · spec point `P.5-align`

`__DisplayBoard` prints every count and axis label as a single character, so a pile of 10+ tiles or a grid wider than 9 misaligns. Rewrite it so every column has the same width.

:::collapse Hint 1
Work out a column width first: the number of digits in the grid size or in the biggest pile, whichever is larger.
:::

:::collapse Hint 2
Use a format width: `f"{value:>{Width}}"` right-aligns `value` in `Width` characters. Pad the row labels the same way so `9|` lines up under `10|`.
:::

:::collapse Model answer
**Game.__DisplayBoard (replace the whole method)**

```python nocheck
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
```

:::

:::collapse Test to screenshot
Temporarily change `range(1, 37)` in Main to `range(1, 101)` (a 10 × 10 default board). Start the default game, match (10,10)+(9,10), then choose `B`.

Expected output (each input appears after its prompt):

```output
Player 1, you had two matching A tiles; your score has increased by 2
Player 2, enter your choice: B
10| 3  3  3  3  3  3  3  3  2  2
 9| 3  3  3  3  3  3  3  3  3  3
 8| 3  3  3  3  3  3  3  3  3  3
 7| 3  3  3  3  3  3  3  3  3  3
 6| 3  3  3  3  3  3  3  3  3  3
 5| 3  3  3  3  3  3  3  3  3  3
 4| 3  3  3  3  3  3  3  3  3  3
 3| 3  3  3  3  3  3  3  3  3  3
 2| 3  3  3  3  3  3  3  3  3  3
 1| 3  3  3  3  3  3  3  3  3  3
   ------------------------------
    1  2  3  4  5  6  7  8  9 10
```

:::

### 20. Rewrite Pile so the end of the list is the top

*Likely size: Q13-size · ~5 marks* · spec point `P.5-endtop`

`Pile` uses `insert(0, …)` and `pop(0)`, which shift every element (O(n)). Rewrite it to use the **end** of the list as the top of the stack, without changing how anything outside `Pile` behaves.

:::collapse Hint 1
Only `Add`, `GetSymbolOfTopTile` and `Remove` touch the position of the top. `Empty` and `GetNumberOfTiles` don't care.
:::

:::collapse Hint 2
`append` pushes, `pop()` with no argument pops the last item, and `[-1]` peeks at it. `LoadGame` still works because it only calls `Add`.
:::

:::collapse Model answer
**Pile (replace Add, GetSymbolOfTopTile and Remove)**

```python nocheck
    def Add(self, T):
        if len(self._Tiles) < self._Max:
            self._Tiles.append(T)

    def GetSymbolOfTopTile(self):
        return self._Tiles[-1].GetSymbol()

    def Remove(self):
        return self._Tiles.pop()
```

:::

:::collapse Test to screenshot
Load `game1`. Boris matches (1,1)+(1,2); Poppy chooses (2,1)+(3,1); Boris chooses `D` then `B`. Run the **unchanged** skeleton with the same inputs: the output must be identical.

Expected output (each input appears after its prompt):

```output
Enter x coordinate: 3
Enter y coordinate: 1
You did not find a matching pair.
The first pile you chose had a E
The second pile you chose had a O
Boris, enter your choice: D
Discard: A, A
Boris, enter your choice: B
4|3333
3|3333
2|2333
1|3533
  ----
  1234
```

This is a refactoring task, so the evidence is that the output is **identical** to the unmodified program (checked: it is).

:::

### 21. Shuffle the board (costs 2 points)

*Likely size: Q14-size · ~8 marks* · spec point `P.5-shuffle`

Add menu option X. If the current player has at least 2 points, take 2 points and shuffle the positions of the piles on the board; otherwise refuse with a message.

:::collapse Hint 1
`random.shuffle(list)` shuffles a list in place. You need `import random` at the top.
:::

:::collapse Hint 2
Shuffle `self.__Board` itself: the piles move, but each pile keeps its own tiles. For a test you can repeat, add `random.seed(1)` temporarily so the shuffle is the same every run.
:::

:::collapse Model answer
**Top of file**

```python nocheck
import math
import random
```

**Game.PlayGame (menu handling)**

```python nocheck
                elif Choice == "S":
                    self.__DisplayScores()
                elif Choice == "X":
                    self.__ShuffleBoard()
```

**Game.__DisplayMenu (new line)**

```python nocheck
        print("S. Display scores")
        print("X. Shuffle the board (costs 2 points)")
```

**Game (new method, above __DisplayScores)**

```python nocheck
    def __ShuffleBoard(self):
        CurrentPlayer = self.__Players[self.__WhoseTurn]
        if CurrentPlayer.GetScore() < 2:
            print("You need at least 2 points to shuffle the board")
        else:
            CurrentPlayer.ChangeScore(-2)
            random.shuffle(self.__Board)
            print("The board has been shuffled")

    def __DisplayScores(self):
```

:::

:::collapse Test to screenshot
For a repeatable screenshot, temporarily add `random.seed(1)` under `import random`. Load `game1`; Boris chooses `X` (refused), then matches (1,1)+(1,2); Poppy chooses (2,1)+(3,1); Boris chooses `B`, `X`, `B`, `S`.

Expected output (each input appears after its prompt):

```output
Enter filename to load or just press Enter to play the default game: game1
Boris, enter your choice: X
You need at least 2 points to shuffle the board
Boris, enter your choice: T
Enter x coordinate: 1
Enter y coordinate: 1
Enter x coordinate: 1
Enter y coordinate: 2
Boris, you had two matching A tiles; your score has increased by 2
Poppy, enter your choice: T
Enter x coordinate: 2
Enter y coordinate: 1
Enter x coordinate: 3
Enter y coordinate: 1
You did not find a matching pair.
The first pile you chose had a E
The second pile you chose had a O
Boris, enter your choice: B
4|3333
3|3333
2|2333
1|3533
  ----
  1234
Boris, enter your choice: X
The board has been shuffled
Boris, enter your choice: B
4|3332
3|3335
2|3333
1|3333
  ----
  1234
Boris, enter your choice: S
Boris: has a score of 0
Poppy: has a score of 0
```

:::


## More ideas (no model answer, on purpose)

- When a player chooses an empty pile, return the last two discarded tiles to random piles as a penalty (watch each pile's `_Max` limit).
- **Undo** the last turn: store what you need before the turn (which piles, which tiles, whose turn, the score change) and reverse it.
- A **hint** option H that shows how many tiles each chosen pile has had removed so far (needs a counter in `Pile`).
- Let the user choose **MaxScore** at the start of the default game (validated, 5 to 50).
- On loading, check that the number of piles is a **square number**; if not, show "Board must be square" and use the default game.
- Show "You must choose two different piles" when the same pile is chosen twice (see [P.3](#/topic/P.3)).
- A `DoubleTile` subclass of `Tile` whose points are doubled, stored in the file as a lower-case symbol.
- Append the winner and their score to a **high-score file** at the end of the game, and add a menu option to display it.
- A smarter `ComputerPlayer` that never picks a pile it knows is empty, or an "easy" computer that forgets older memories.
- When a pair does not match, print the coordinates of the piles as well as the symbols.

:::exam
- **Mark size guides scope.** A 5–6 mark question is usually one method; 11–13 marks means a new method or class **plus** changes in two or three other places.
- **Name things exactly as the question does.** If it says "create a method called `GetBonus`", the method must be called `GetBonus`.
- **Messages count.** Copy them exactly from the question; if none is given, write a clear one.
- **Validation always means a loop**, not a single `if`: keep asking until the input is valid.
- **Screenshot**: show the inputs the question names, in that order, and enough output to prove the feature works (the changed message or score).
:::

:::challenge
1. Combine **players**, **winner** and **matched** so a 3-player game announces "It is a draw between Amy and Cal on 4 points" and lists everyone's pairs.
2. Make the **computer** player work with **wild** tiles: what should it remember when it sees a `*`?
3. Combine **save** with **bonusempty**: does your save file still load correctly after a bonus pile has been emptied?
4. Time yourself: pick any 6-mark task and finish it, tested, in 9 minutes (1.5 minutes per mark).
:::

:::recap
- Section D: **.1** every changed method in full (marks per feature), **.2** a screenshot showing the named inputs and outputs.
- Save a working copy, change a little, run, repeat.
- Find code fast by searching for printed messages; put new code in the class that owns the data.
- `Game`'s `__` attributes are name-mangled, so don't subclass `Game`; subclass `Tile`, `Player` or `Pile` and call `super().__init__`.
- Menu option = menu line + `elif` + new method (+ valid-choice list).
- Every model answer here was run against the real skeleton: if your output differs from the test output shown, find out why.
:::

:::related
- [P.2 The game and the code](#/topic/P.2)
- [P.3 Bugs, weaknesses and unused features](#/topic/P.3)
- [P.6 Section B: writing a new program](#/topic/P.6)
- [1.8 Object-oriented programming](#/topic/1.8)
:::

*/});
