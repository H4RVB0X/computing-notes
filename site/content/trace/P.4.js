CS.registerTrace({
  id: "P.4-1", topic: "P.4", title: "Six turns of game1", lang: "text",
  intro: "Load **game1** (Boris and Poppy, MaxScore 15, Boris starts). The six turns below choose these piles, as (x,y). Use the board in [P.2](#/topic/P.2) (top tile first) and remember that a matched pile's top tile is removed. Fill in the top symbols, whether they match, the points added and the state after each turn.",
  code: "Turn 1: (1,1) and (1,2)\nTurn 2: (2,1) and (3,2)\nTurn 3: (3,1) and (4,1)\nTurn 4: (1,1) and (2,2)\nTurn 5: (1,1) and (2,1)\nTurn 6: (3,3) and (1,3)",
  columns: ["Turn", "Player", "Top symbols", "Match? (Y/N)", "Points added", "Boris", "Poppy", "TurnsSinceMatch"],
  prefill: [
    ["1", "", "", "", "", "", "", ""], ["2", "", "", "", "", "", "", ""], ["3", "", "", "", "", "", "", ""],
    ["4", "", "", "", "", "", "", ""], ["5", "", "", "", "", "", "", ""], ["6", "", "", "", "", "", "", ""],
  ],
  rows: [
    ["1", "Boris", "A,A", "Y", "2", "2", "0", "0"],
    ["2", "Poppy", "E,E", "Y", "2", "2", "2", "0"],
    ["3", "Boris", "O,O", "Y", "2", "4", "2", "0"],
    ["4", "Poppy", "E,A", "N", "0", "4", "2", "1"],
    ["5", "Boris", "E,Q", "N", "0", "4", "2", "2"],
    ["6", "Poppy", "U,U", "Y", "6", "4", "8", "0"],
  ],
  instructions: "Write top symbols as first,second (e.g. A,A). Write Y or N for a match and 0 points for no match. Boris, Poppy and TurnsSinceMatch are the values after the turn.",
  hint: "After turn 1 the top of (1,1) is E (its A has gone). (3,3) holds U5 and (1,3) holds U1: only the symbol has to match.",
  note: "Verified by running the skeleton: the program printed `Poppy, you had two matching U tiles; your score has increased by 6`, and the discard was `A, A, E, E, O, O, U, U`.",
});
CS.registerTrace({
  id: "P.4-2", topic: "P.4", title: "__UpdateWhoseTurn with three players", lang: "text",
  intro: "A game file has 4 piles (bottom row first): `0,A,1,B,2` / `0,A,1,B,2` / `0,B,2,A,1` / `0,B,2`, three players **Amy, Ben, Cy** (all 0), an empty discard, MaxScore 10, **WhoseTurn 1** and TurnsSinceMatch 0. Grid size is 2. Trace four turns.",
  code: "Turn 1: (1,1) and (2,1)\nTurn 2: (1,2) and (2,2)\nTurn 3: (1,1) and (2,1)\nTurn 4: (1,2) and (1,1)\n\nself.__WhoseTurn = (self.__WhoseTurn + 1) % len(self.__Players)",
  columns: ["Turn", "WhoseTurn before", "Player", "Outcome (match / no match / empty)", "Points", "WhoseTurn after"],
  prefill: [["1", "", "", "", "", ""], ["2", "", "", "", "", ""], ["3", "", "", "", "", ""], ["4", "", "", "", "", ""]],
  rows: [
    ["1", "1", "Ben", "match", "2", "2"],
    ["2", "2", "Cy", "match", "4", "0"],
    ["3", "0", "Amy", "match", "4", "1"],
    ["4", "1", "Ben", "empty", "0", "2"],
  ],
  hint: "Index 0 is (1,1), 1 is (2,1), 2 is (1,2), 3 is (2,2). (2 + 1) % 3 = 0.",
  note: "Verified: after these turns the scores are Amy 4, Ben 2, Cy 4 and the board shows `2|10` and `1|00`. Pile (1,2) keeps a single A that can never be matched, so this game never ends.",
});
CS.registerTrace({
  id: "P.4-3", topic: "P.4", title: "__DisplayBoard after six turns", lang: "python",
  intro: "After the six turns of trace P.4-1 it is Boris's turn, and he chooses **B**. Write each line that `__DisplayBoard` prints, exactly (no spaces between the digits). The last two lines really start with two spaces; the checker ignores spaces, so you can leave them out.",
  code: "for y in range (self.__GridSize, 0, -1):\n    print(f\"{y}|\", end=\"\")\n    for x in range(1, self.__GridSize + 1):\n        print(self.__Board[self.__GetIndex(x, y)].GetNumberOfTiles(), end=\"\")\n    print()\nprint(\"  \", end=\"\")\nfor x in range(1, self.__GridSize + 1):\n    print(\"-\", end=\"\")\nprint()\nprint(\"  \", end=\"\")\nfor x in range (1, self.__GridSize + 1):\n    print(x, end=\"\")\nprint()",
  columns: ["Output line", "Printed"],
  prefill: [["1", ""], ["2", ""], ["3", ""], ["4", ""], ["5", ""], ["6", ""]],
  rows: [["1", "4|3333"], ["2", "3|2323"], ["3", "2|2323"], ["4", "1|3422"], ["5", "----"], ["6", "1234"]],
  instructions: "Type each printed line (the leading two spaces on lines 5 and 6 can be left out).",
  hint: "Start counts: row 1 is 4533, rows 2–4 are 3333. Each matched pile loses one tile: (1,1), (1,2), (2,1), (3,2), (3,1), (4,1), (3,3), (1,3).",
  note: "Verified output: `4|3333`, `3|2323`, `2|2323`, `1|3422`, `  ----`, `  1234`.",
});
