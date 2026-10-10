CS.registerTrace({
  id: "P.2-1",
  topic: "P.2",
  title: "LoadGame builds a pile",
  lang: "python",
  intro: "Trace the tile-reading loop of `LoadGame` for the file line `0,R,1,F,3,K,7` (pile (3,4) of game1). Write `_Tiles` top first, as symbol+points with commas, e.g. `[F3, K7]`.",
  code: "Items = LineFromFile.split(\",\")\nPileSize = len(Items) // 2\nP = Pile(PileSize, int(Items[0]))\nfor TileNo in range(len(Items) - 2, -1, -2):\n    P.Add(Tile(Items[TileNo], int(Items[TileNo + 1])))",
  columns: ["Step", "TileNo", "Items[TileNo]", "Items[TileNo + 1]", "_Tiles after Add"],
  prefill: [
    ["1", "", "", "", ""],
    ["2", "", "", "", ""],
    ["3", "", "", "", ""],
  ],
  rows: [
    ["1", "5", "K", "7", "[K7]"],
    ["2", "3", "F", "3", "[F3, K7]"],
    ["3", "1", "R", "1", "[R1, F3, K7]"],
  ],
  instructions: "Items has 7 elements, so PileSize = 3 and the range starts at 5. Spaces are ignored when checking.",
  hint: "`range(5, -1, -2)` gives 5, 3, 1. `Add` inserts at index 0, so each new tile goes on **top**.",
  note: "R, the first tile in the file, ends up on top. _Max = 3 and _Bonus = 0.",
});
