CS.registerFlashcards("P.5", [
  { front: "Section D part .1 vs part .2.", back: ".1: every changed method in full + new methods/classes (marks per feature). .2: screenshot of the named test showing inputs and outputs." },
  { front: "The four edits for a new menu option.", back: "Menu line in __DisplayMenu · elif in PlayGame's inner loop · new private method in Game · add the letter to any valid-choice list." },
  { front: "Why can't a subclass of Game use self.__Board?", back: "Name mangling: inside Game it is _Game__Board; in the subclass it becomes _Sub__Board, which doesn't exist → AttributeError." },
  { front: "Subclass constructor template.", back: "def __init__(self, N, S):\n    super().__init__(N, S)\n    self._Extra = …" },
  { front: "Index → (x, y) for the skeleton.", back: "x = index % GridSize + 1 ; y = index // GridSize + 1" },
  { front: "Safe workflow for each Section D question.", back: "Read the test first · save a working copy · smallest change that runs · run after every step · run the exact test · paste full methods." },
  { front: "Where does a new attribute go?", back: "In the class that owns the data: tiles → Tile, pile contents/bonus → Pile, score/matches → Player, game flow → Game." },
  { front: "Validation in Section D always means…", back: "A loop that re-prompts until valid (try/except for type + a range check), with a message for each error." },
]);
