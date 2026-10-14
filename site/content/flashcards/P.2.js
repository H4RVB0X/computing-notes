CS.registerFlashcards("P.2", [
  { front: "Piles O' Tiles: what happens on a turn?", back: "Choose two **different** piles. Same top symbol → both tiles to the discard, score their points. Different → symbols are printed for everyone." },
  { front: "When does the game end?", back: "When a player reaches **MaxScore** (>=) or **every pile is empty**. Only Players[0] and Players[1] are compared for the winner; a draw prints nothing." },
  { front: "Game ↔ Pile/Player/Tile relationship", back: "**Aggregation** (hollow diamond): objects created in Main/LoadGame and passed into Game; tiles outlive their pile." },
  { front: "`__Board` vs `_Tiles`", back: "`__` = private, name-mangled to `_Game__Board`. `_` = protected by convention, usable by subclasses." },
  { front: "__GetIndex formula and its inverse", back: "index = x − 1 + (y − 1) × GridSize.\nx = index % GridSize + 1, y = index // GridSize + 1." },
  { front: "Where is the top of a Pile?", back: "`_Tiles[0]`. Push = `insert(0, T)`, pop = `pop(0)`. Both O(n); using the end of the list would be O(1)." },
  { front: "Why does LoadGame loop backwards over a pile line?", back: "`Add` inserts at index 0, so adding the last tile first leaves the **first tile in the file on top**." },
  { front: "What does `len(Items) // 2` give in LoadGame?", back: "The pile's `_Max` = its starting number of tiles (the bonus is the odd item that // discards)." },
  { front: "Why `range(0, len(Items) - 1, 2)` for the discard?", back: "A blank discard line splits to `['\\n']` (length 1), so the range is empty. Without −1 it would read Items[1] → IndexError → \"File not loaded\"." },
  { front: "game1 key facts", back: "16 piles (4×4), 51 tiles, 107 points, 3 Js (one can never match), MaxScore 15, bonuses at (1,1)=2, (3,3)=4, (4,3)=2." },
  { front: "Two stored values that are never used", back: "`_Bonus` (Pile) and `__TurnsSinceMatch` (Game). Expect Section D to use them." },
  { front: "Default game set-up", back: "2 players, 36 piles of Pile(3, 0) holding A, B, A (top = A), MaxScore 10. First turn always matches." },
]);
