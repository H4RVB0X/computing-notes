CS.registerFlashcards("P.3", [
  { front: "Typo in the filename: what happens and why?", back: "LoadGame fails → returns MaxScore = 0 → Main has unpacked it → default game with MaxScore 0 → first match wins." },
  { front: "Partial load bug", back: "Half-loaded lists are returned, then defaults are **appended**: e.g. 16 + 36 = 52 piles (7×7 shown), 3 players, MaxScore 0." },
  { front: "Coordinate bugs", back: "Letters → ValueError crash. 0/negative → wraps to the end of the list. x too big → next row. y too big → IndexError." },
  { front: "Menu bug", back: "Only uppercase T/B/D/S work; anything else silently redisplays the menu." },
  { front: "End-of-game bugs", back: "Draw prints nothing (no else). Only Players[0] and Players[1] are compared, though turns work for any number." },
  { front: "Unused features", back: "`_Bonus` (no getter, never read) and `__TurnsSinceMatch` (counted, reset, never acted on)." },
  { front: "Design weaknesses", back: "O(n) stack at the list's front; single-character board display; non-square boards truncated by int(√n); bare except hides the cause." },
  { front: "Two checks every coordinate fix needs", back: "**Type** (try/except ValueError) and **range** (1 ≤ x, y ≤ self.__GridSize), inside a loop that re-prompts." },
]);
