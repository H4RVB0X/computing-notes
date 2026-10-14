CS.registerTopic({ id: "P.3", title: "Bugs, weaknesses and unused features" }, function () {/*

:::objectives
- Identify every **bug, missing validation and design weakness** AQA left in the skeleton.
- Explain the **cause** of each one in terms of the actual code, and what the user would **see**.
- Know the **fix** for each, so a Section D question about it is a quick win.
- Spot the **unused features** (`_Bonus`, `__TurnsSinceMatch`) that Section D is likely to bring to life.
:::

:::quick At a glance
- **Crashes:** letters for a coordinate (`ValueError`), y too large (`IndexError`).
- **Silent wrong behaviour:** 0 or negative coordinates wrap to the end of the list; x too large wraps to the next row; lowercase menu choices are ignored; same pile twice re-asks with no message.
- **Load bugs:** a typo in the filename sets **MaxScore to 0**, so the first match wins the game; a part-loaded file leaves junk that gets **merged** with the default game.
- **End-of-game bugs:** a draw prints nothing; only two players are ever compared.
- **Unused:** `_Bonus` and `__TurnsSinceMatch`. **Design weaknesses:** O(n) stack, single-character board display, non-square boards.
:::

:::keyterms
Validation :: Checking that input data is sensible and of the right type/range before it is used. :: Don't trust the user.
Robustness :: The ability of a program to cope with unexpected input or conditions without crashing or giving wrong results. :: It doesn't fall over.
Bare except :: An `except:` clause with no exception type, which catches every error. :: Catches everything — including the errors you'd want to know about.
Dead data :: Values that are stored and maintained but never used to affect behaviour. :: Code that does nothing (yet).
:::

## Every flaw is a possible Section D question

Each row marked ✔ was **reproduced by running the real skeleton** with scripted input.

| Issue | Cause | What actually happens | ✔ |
|---|---|---|---|
| Typo in the filename ends the game after one turn | `LoadGame` fails and returns `MaxScore = 0`; `Main` has already unpacked that into its own `MaxScore` | "File not loaded", default game starts, first match → "Player 1 has won!" (any score ≥ 0 reaches MaxScore) | ✔ |
| Partial load leaves junk behind | Board/Players lists are returned even when the `except` fires part-way through | Default piles and players are **appended** to the half-loaded ones. Breaking a player line in game1 gave **52 piles shown as 7×7** and **three players** (Boris, Player 1, Player 2) — and MaxScore 0 | ✔ |
| Non-numeric coordinate crashes | `int(input(...))` with no try/except | `ValueError: invalid literal for int() with base 10: 'a'` | ✔ |
| 0 or negative coordinates pick the wrong pile | Negative list indices count from the end in Python | (0,1) on the default board takes tiles from pile (6,6) | ✔ |
| x too large silently wraps; y too large crashes | No range check in `__ChoosePile` | x = 7, y = 1 on 6×6 → index 6 = pile (1,2). y = 9 → `IndexError` | ✔ |
| Lowercase menu input ignored | `Choice != "T"` is case-sensitive; no `else` branch | The menu just reappears with no message | ✔ |
| Same pile twice: no explanation | The loop just re-calls `__ChoosePile` | The player is asked for coordinates again with no message | ✔ |
| Draws print nothing | Only `>` comparisons, no `else` | Equal scores → game ends with no result line | ✔ |
| Winner only checks two players | Hard-coded `Players[0]` and `Players[1]` | A third player can never be announced the winner, though the turn order supports any number | ✔ |
| Bonus never used | `_Bonus` has no getter; nothing reads it | game1's +2 and +4 piles score the same as the others | ✔ |
| TurnsSinceMatch never used | Counted and reset but no rule depends on it | No effect on play (an empty-pile turn still counts) | ✔ |
| game1 can never empty | 3 J tiles: an odd count, so one J is always left | The game can only end via MaxScore | ✔ |
| Game can stall forever | Two tiles of a symbol stuck in the same pile can never pair; no stalemate rule | Infinite game if MaxScore is out of reach | |
| Board display breaks at 10+ | Counts and axis labels printed as single characters | Columns misalign for a pile of 10+ tiles or a grid wider than 9 | |
| Non-square boards | `int(math.sqrt(...))` truncates | 20 piles → 4×4 shown; 4 piles hidden but reachable with y = 5 | ✔ |
| A badly formed pile line | `int()` on a symbol, or `Items[TileNo + 1]` out of range | The **whole** load fails with "File not loaded" — the bare except gives no clue which line | ✔ |
| Inefficient stack | `insert(0)` and `pop(0)` | O(n) per push/pop instead of O(1) at the list's end | |
| Grammar: "had a A" | The message always uses "a" | "The first pile you chose had a A" / "had a E" | ✔ |

:::why Why would AQA leave bugs in?
The skeleton is designed to be **modified**. Every flaw is a ready-made Section D task ("add validation so that…", "fix the problem where…"), and every unused attribute is a hint that a rule using it is coming. Two unused features stand out: `_Bonus` is loaded and stored but never read, and `__TurnsSinceMatch` is counted, reset and loaded but never acted on. **AQA rarely includes dead data by accident.** Expect at least one Section D question to bring each one to life.
:::

Reproduce any row yourself in the console below (it runs a faithful copy of the skeleton, bugs included).

{{tool:pot-console}}

## The two load bugs, step by step

:::example Typo in the filename
1. User types `game` (missing the 1). `FileName = "game.txt"`.
2. `LoadGame` hits `FileNotFoundError` in `open` → bare `except` → prints "File not loaded" and returns `False, [], [], [], 0, 0, 0`.
3. `Main` unpacks all seven values **into its own variables**, so `MaxScore` is now **0** (its default of 10 has been overwritten).
4. `UseDataFromFile == False` → "Setting up default game" → default players and piles are added.
5. Player 1 matches two As (score 2). `__MaxScoreReached()`: 2 >= 0 → **True**. "Player 1 has won!" after one turn.

**Fix:** reset all six values inside the `if UseDataFromFile == False:` block that prints the message (see [P.5](#/topic/P.5)).
:::

:::example Partial load (verified with a broken player line)
1. game1's 16 piles load fine, then `int("x")` fails on a player's score.
2. The except returns the **partly filled** `Board` (16 piles) and `Players` (Boris only), with `MaxScore = 0`.
3. `Main` sees `False`, so it **appends** 2 default players and 36 default piles: **52 piles, 3 players**.
4. `GridSize = int(√52) = 7`, so a 7×7 board is shown with game1's piles in the first rows. Boris plays first.
5. MaxScore is 0, so the first match ends the game — and only `Players[0]` and `Players[1]` are compared.

**Fix:** the same reset in `Main` (clear the lists too), or have `LoadGame` return fresh empty lists on failure.
:::

## Fixes at a glance

::::tabs
:::tab Validate coordinates
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
:::tab Menu case
```python nocheck
    def __GetChoice(self):
        Choice = input(f"{self.__Players[self.__WhoseTurn].GetName()}, enter your choice: ").upper()
        while Choice not in ["B", "D", "T", "S"]:
            print("That is not a valid menu option")
            Choice = input(f"{self.__Players[self.__WhoseTurn].GetName()}, enter your choice: ").upper()
        return Choice
```
:::
:::tab Failed load
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
:::tab Same pile message
```python nocheck
            while Pile1 == Pile2:
                print("You must choose two different piles")
                Pile2 = self.__ChoosePile()
```
:::
::::

All four were run against the real skeleton (the first three come from your prep page's model answers; full task cards with tests are on [P.5](#/topic/P.5)).

:::trap
- **`int()` with try/except is not enough** — it stops the crash but not the out-of-range or zero/negative values. You need **both** a type check and a range check.
- **Range check against `self.__GridSize`, never 6.** game1 is 4×4.
- **`.upper()` must be applied before the comparison**, and the re-prompt must be **inside** the loop, or the loop never ends.
- When fixing the failed load, put the resets **inside** the block that prints "Setting up default game", otherwise you also wipe a successful load.
:::

:::exam
- "**Describe a problem with…**" — state what the user does, what the code does (name the line/method) and what goes wrong. Three short points usually cover 3 marks.
- "**Explain how the program could be made more robust**" — name the input, the check (type and range), and what happens on failure (message + re-prompt).
- If a question mentions the **bonus** or **TurnsSinceMatch**, you already know that nothing reads them: the work is adding a getter / a rule.
:::

:::challenge
1. Find a sequence of inputs on game1 that makes a player choose the same pile twice. What does the user see?
2. Which two methods would you change to make the game work properly for 3 or 4 players? What else would need to change in `Main`?
3. Design a test file that proves the "stall" problem: a pile where two tiles of the same symbol can never be matched.
4. Rewrite `Pile` to use the **end** of the list as the top. Which methods change? Which stay the same?
:::

:::recap
- Crashes: `ValueError` (letters), `IndexError` (y too big). Silent errors: negative/large x wrap, lowercase menu, same pile twice.
- Load: typo → MaxScore 0 → first match wins; partial load → merged junk (52 piles, 3 players).
- End: draws print nothing; only two players compared.
- Unused: `_Bonus`, `__TurnsSinceMatch`. Weak: O(n) stack, one-character display, non-square boards.
:::

:::related
- [P.2 The game and the code](#/topic/P.2)
- [P.5 Section D: practice modifications](#/topic/P.5)
- [1.4 Strings, random numbers and exception handling](#/topic/1.4)
- [2.3 Stacks](#/topic/2.3)
:::

*/});
