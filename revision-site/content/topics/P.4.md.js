CS.registerTopic({ id: "P.4", title: "Section C: questions about the skeleton" }, function () {/*

:::objectives
- Know what **Section C** of Paper 1 looks like: Q08 to Q11, about **13 marks**, all about reading the skeleton program.
- Answer **identify**, **state**, **explain**, **describe** and **trace** questions on the skeleton with exact identifiers and line numbers.
- Use precise **OOP and data-structure vocabulary** and point to where each idea appears in *Piles O' Tiles*.
- Predict the program's **output** for given inputs and files, including the edge cases AQA likes (empty piles, odd file lines, three players).
- Write full-mark 3-mark and 6-mark answers, and spot the habits that cost marks.
:::

:::quick At a glance
- Section C = **Q08 (2), Q09 (3), Q10 (6), Q11 (2)** in the EAD: 13 marks, about 20 minutes. No coding, no screenshots.
- **Identify / State / Name / Give** = quote the **exact identifier** or line, spelled as in the code (`__GetIndex`, not "the get index function").
- **Explain** = **what** the code does **+ why**, tied to specific lines. One mark per distinct, code-specific point.
- **Trace / What is output** = work it out line by line; copy the program's **exact text**, spaces and punctuation included.
- Vocabulary that scores: aggregation, encapsulation, private/protected, name mangling, instantiation, constructor, stack/LIFO, 1-D list in row-major order, exception handling, condition-/count-controlled loop, local variable, parameter, return value, Boolean method, MOD wrap-around.
- Every behaviour claim on this page was checked by running the real skeleton. Use the console below to check your own predictions.
:::

:::keyterms
Section C :: The part of Paper 1 (Q08–Q11, 13 marks) in which questions are asked about the preliminary-material skeleton program without modifying it. :: Read-the-code questions.
Identifier :: The name given to a variable, constant, subroutine, class or attribute in a program. :: Its exact name in the code.
Local variable :: A variable declared inside a subroutine that exists only while that subroutine is running and can only be accessed within it. :: `Items` in `LoadGame`.
Parameter :: A variable named in a subroutine's definition that receives a value (argument) when the subroutine is called. :: `Change` in `ChangeScore(self, Change)`.
Return value :: The value passed back to the caller by a function when it finishes. :: What `__GetIndex` hands back.
Instantiation :: Creating an object (an instance) of a class, which calls the class's constructor. :: `Tile(Items[TileNo], ...)` makes a new tile.
Constructor :: The method that initialises a new object's attributes when it is instantiated; `__init__` in Python. :: Sets up `_Tiles`, `_Max`, `_Bonus`.
Condition-controlled loop :: A loop that repeats until (or while) a condition is met, so the number of iterations is not known in advance. :: `while Choice != "T"`.
Count-controlled loop :: A loop that repeats a fixed number of times. :: `for Count in range(1, 37)`.
Exception handling :: Code that detects run-time errors (exceptions) and responds to them instead of letting the program crash. :: The `try`/`except` in `LoadGame`.
:::

## What Section C is

The Electronic Answer Document (EAD) gives the slots away. Section C is four questions, all on the skeleton program, all answered in words, not code.

| Question | EAD marks | Typical demand |
|---|---|---|
| **Q08** | 2 | Identify or name something: an identifier, an OOP feature, a loop type |
| **Q09** | 3 | Identify + explain, or a short trace |
| **Q10** | 6 | Explain a design decision, the class relationships, or a longer trace (often several parts) |
| **Q11** | 2 | Explain one thing: why a line is there, what happens with an unusual input |

You have the code on screen in the exam. The marks go to students who **use it**: quote identifiers, give line numbers, run the program to check output.

:::tip Run it, don't guess
In the real exam you can run the skeleton. If a question asks "what is output when…", **type those inputs in and copy the output**. Practise that habit with the console below (it is a faithful port of the skeleton, bugs included).
:::

{{tool:pot-console}}

## Command words for code questions

| Command word | What earns the mark | Example on *Piles O' Tiles* |
|---|---|---|
| **State / Name / Identify / Give** | The exact identifier, value or line. No explanation needed (none is credited). | "Identify a method that returns a Boolean": `Empty` (Pile, line 246). |
| **Describe** | What happens, in order, with the key details. | Describe what `__ChoosePile` does: reads x, reads y, converts both with `int`, returns `__GetIndex(x, y)`. |
| **Explain** | What happens **and why**, linked to the code. Each mark is a separate reason or consequence. | Explain why the empty-pile check is first: `GetSymbolOfTopTile` reads `_Tiles[0]`, which raises `IndexError` on an empty list. |
| **Trace / What is output** | Exact values or text, step by step. | `4|3333` … `1|4533`, then `  ----`, then `  1234`. |
| **Suggest** | A sensible idea that fits this code, not a general one. | Suggest a more efficient stack: use the end of the list (`append`/`pop()`). |

:::trap Marks are lost here
- **Vague names.** "The function that gets the index" scores nothing; `__GetIndex` scores. Copy identifiers exactly, including underscores and capitals.
- **Generic textbook answers.** "Encapsulation means hiding data" is not enough. Say **which** attributes are hidden and **which** methods give controlled access (`_Score` only changes via `ChangeScore`).
- **Answering "what" when asked "why".** "It checks if the pile is empty" describes; "…because `GetSymbolOfTopTile` would raise an `IndexError` on an empty list" explains.
- **Approximate output.** If the program prints `Boris: has a score of 2` (with that odd colon), write exactly that.
- **Repeating one idea in different words.** Each mark needs a *new* point.
:::

## Vocabulary map: every term, located in the skeleton

| Term | Where it appears | Line(s) |
|---|---|---|
| **Class / object** | `Game`, `Tile`, `Player`, `Pile` are classes; `ThisGame`, `P` are objects | 75, 203, 214, 228; 26, 31 |
| **Constructor** | `__init__` in each class | 76, 204, 215, 229 |
| **Instantiation** | `P = Pile(3, 0)`; `Tile(Items[TileNo], int(Items[TileNo + 1]))`; `Game(Board, Players, ...)` | 26, 52, 31 |
| **Aggregation** | `Game` holds lists of `Pile`, `Player`, `Tile` objects created outside it (in `Main`/`LoadGame`) and passed in | 31, 76–79 |
| **Encapsulation** | Attributes accessed only through methods: `GetScore`, `GetName`, `ChangeScore`, `GetSymbol`… | 219–226, 208–212 |
| **Private (`__`) / name mangling** | `self.__Board` is stored as `_Game__Board`; Game's helper methods (`__GetIndex` etc.) are private too | 77–84, 128–201 |
| **Protected (`_`)** | `_Tiles`, `_Max`, `_Bonus`, `_Symbol`, `_Points`, `_Name`, `_Score` | 205–232 |
| **Getter (accessor)** | `GetPoints`, `GetSymbol`, `GetScore`, `GetName`, `GetNumberOfTiles` | 208–223, 252 |
| **Method returning a Boolean** | `Empty`, `__NoMoreTilesLeft`, `__MaxScoreReached` | 246, 191, 197 |
| **Stack (LIFO)** | `Pile`: `insert(0, T)` pushes, `pop(0)` pops, top = `_Tiles[0]` | 234–244 |
| **1-D list in row-major order** | `__Board`; `__GetIndex` returns `x - 1 + ((y - 1) * GridSize)` | 185–186 |
| **MOD wrap-around** | `(self.__WhoseTurn + 1) % len(self.__Players)` | 189 |
| **Exception handling** | `try` … bare `except:` around the whole file read | 42, 70–72 |
| **Condition-controlled loops** | `while self.__GameOver == False`, `while Choice != "T"`, `while Pile1 == Pile2`, `while Count < len(...)` | 87, 89, 100, 172 |
| **Count-controlled loops** | `for Count in range(1, 37)`, `for TileNo in range(len(Items) - 2, -1, -2)`, `for x in range(1, GridSize + 1)` | 25, 51, 151 |
| **Local variables** | `Items`, `PileSize`, `BoardSize`, `LineFromFile` (LoadGame); `ScoreIncrease`, `Pile1`, `Choice` (PlayGame); `Temp` (Remove) | 44–69, 88–111, 242 |
| **Parameters** | `FileName` (LoadGame), `x, y` (`__GetIndex`), `Change` (`ChangeScore`), `T` (`Add`), `M, B` (Pile constructor) | 35, 185, 225, 234, 229 |
| **Constant (by convention)** | `FILE_EXTENSION = ".txt"`: upper case, never reassigned; Python does not enforce it | 15 |
| **Tuple return / multiple assignment** | `LoadGame` returns 7 values; `Main` unpacks them in one statement | 19, 72–73 |
| **f-string** | `print(f"{...GetName()}, you had two matching ...")` | 113 |
| **File handling** | `with open(FileName) as File:` then `File.readline()` | 43–69 |

:::note Global variables
There are **none**. Everything in `Main` is local to `Main` and is passed to `Game` as arguments. That is a good design point to make: no subroutine can change game state except through parameters or object methods.
:::

## Worked answer: a 3-mark explain question

:::example Q: Explain why `LoadGame` uses `range(0, len(Items) - 1, 2)` when it reads the discard line. [3]
**Model answer**
1. The discard line holds symbol,points **pairs**, so the loop steps by **2**: `i` is the position of a symbol and `i + 1` its points (line 63).
2. When the discard is empty, the line is just `"\n"`, which splits into `['\n']`, a list of length 1. `range(0, 0, 2)` is empty, so **no tiles are read** and the empty discard loads correctly.
3. Without the `- 1`, the loop would run with `i = 0` and try to read `Items[1]`, raising an `IndexError`; the bare `except` would then print **"File not loaded"** and the whole load would fail.

**Marking commentary**
- Point 1 earns the "pairs / step 2" mark. Point 2 earns the "empty discard" mark. Point 3 earns the "what would go wrong" mark.
- Note what is **not** there: no definition of `range`, no general talk about loops. Every sentence is about *this* line.
- A side effect worth knowing (verified): a discard line with an odd number of items such as `A,1,B` loads only **A**; the dangling `B` is silently ignored because the range stops early.
:::

## Worked answer: a 6-mark explain question

:::example Q: Explain how the skeleton program decides when a game is over and who has won. Identify one weakness in this part of the program. [6]
**Model answer**
1. `PlayGame` repeats its turn loop **while `self.__GameOver == False`** (line 87), a condition-controlled loop.
2. At the end of every turn (line 122), `__GameOver` is set to `self.__MaxScoreReached() or self.__NoMoreTilesLeft()`.
3. `__MaxScoreReached` loops through `__Players` and **returns True as soon as one player's score is `>=` `__MaxScore`** (line 199), so reaching the maximum exactly ends the game.
4. `__NoMoreTilesLeft` loops through `__Board` and **returns False at the first non-empty pile**; it returns True only if every `Pile.Empty()` is True.
5. After the loop, the winner is found by comparing **only `Players[0]` and `Players[1]`** with `>` and printing `"<name> has won!"` (lines 123–126).
6. Weakness: if the two scores are **equal nothing is printed**, and with **three or more players** a third player who reaches MaxScore is never announced (verified: Cy reaching 11 with MaxScore 10 ends the game with no winner message).

**Marking commentary**
- Six separate, code-specific points for six marks. Each names an identifier or a line.
- Points 3 and 4 show understanding of **early return** inside a loop, a frequent mark-scheme phrase.
- Alternative weaknesses that would score: game1 can never empty because there are **3 J tiles**; a failed load sets MaxScore to **0** so the game ends after one turn; `>=` vs `>` would change whether reaching the target exactly wins.
- A weak answer ("it checks if someone has won and then says who won") would get 1 mark at most.
:::

## Tracing questions

AQA often gives a short sequence of inputs and asks for the output or for values of variables. Work through these three: each one was produced by running the skeleton.

{{trace:P.4-1}}

{{trace:P.4-2}}

{{trace:P.4-3}}

:::trap Tracing traps on this program
- `TurnsSinceMatch` is incremented **before** the checks (line 102), so a turn on an **empty pile** still adds 1 (verified: "You chose an empty pile", TurnsSinceMatch 0 → 1), and the turn still passes to the next player.
- On a non-match, **no score line** is printed and `ScoreIncrease` is never created that turn.
- Matching compares **symbols only**: U5 with U1 scores **6** in game1.
- Negative coordinates do not crash: `(0, 0)` on game1 gives index −5, which Python treats as `__Board[11]`, pile **(4, 3)**.
:::

## Edge cases worth knowing (all verified)

| Situation | What actually happens |
|---|---|
| Pile line `0,A,1,B` (odd number of items) | `int("B\n")` raises `ValueError` → "File not loaded" → "Setting up default game". The piles already read are **kept** and 36 default piles are appended. For pile (3,4): 14 + 36 = 50 piles, int(√50) = 7, so a 7×7 board is shown; corrupting an earlier pile gives a smaller board (e.g. pile (1,2): 4 + 36 = 40 → 6×6). |
| Discard line `A,1,` (trailing comma) | Loads one A tile; `Discard: A`. |
| Discard line `A,1,B` | Loads one A tile; the B is ignored. |
| MaxScore line not a number | Same partial-load bug: 16 + 36 = 52 piles (7×7 shown) and **four** players: Boris, Poppy, Player 1, Player 2. |
| A pile line with more tiles than its maximum | Impossible from a file: `PileSize = len(Items) // 2` *is* the tile count. (If `Add` is called on a full pile it silently does nothing.) |
| Three players in the file | Turn order works for any number (MOD), but only Players 0 and 1 are compared at the end. |
| Score reaches MaxScore exactly | Game ends: `>=` on line 199. |
| Letter typed for a coordinate | `ValueError: invalid literal for int() with base 10: 'a'`: the program crashes. |
| Same pile chosen twice | The second choice is asked for again, with no message. |

:::exam
- **2-mark identify** questions: give the identifier *and*, if asked, the class it belongs to. Two different examples when asked for two.
- **3-mark explain** questions: three distinct points, each tied to a line. A good shape is *what it does → why it is needed → what would go wrong without it*.
- **6-mark** questions: plan 6–7 points in the margin first; use line numbers; finish with a weakness or consequence if the question allows.
- **Trace** questions: write exact output. When the console shows an odd format (`Boris: has a score of 2`), copy it faithfully.
- Use the vocabulary map above. Words like *aggregation*, *instantiation*, *row-major*, *LIFO*, *early return*, *name mangling* are what mark schemes contain.
- Practise with the exam questions for this page: 50+ questions grouped by category, each with a mark scheme.
:::

:::challenge
1. Draw a hierarchy chart for the methods of `Game`, showing which methods call which.
2. Add a `WildTile` subclass of `Tile` to the class diagram. What does inheritance give it, and which attributes can it use directly?
3. What is the worst-case time complexity of `__NoMoreTilesLeft` on an *n*-pile board, and when does it hit the best case?
4. Write a game file in which the second player wins on the first turn. Check it in the console.
:::

:::recap
- Section C: Q08–Q11, 2/3/6/2 marks, all about the skeleton, answered in prose.
- Identify = exact identifier; explain = what + why, tied to the code; trace = exact output.
- Know where every OOP and data-structure idea lives in the code, with line numbers.
- Check every "what happens if" by running the program; copy outputs exactly.
- Common edge cases: empty pile, negative coordinates, odd file lines, partial loads, three players, MaxScore reached exactly.
:::

:::related
- [P.2 The game and the code: a method-by-method tour](#/topic/P.2)
- [P.3 Bugs, weaknesses and unused features](#/topic/P.3)
- [P.5 Section D: practice modifications](#/topic/P.5)
- [1.8 Object-oriented programming](#/topic/1.8)
- [2.3 Stacks](#/topic/2.3)
:::

*/});
