CS.registerTrace({
  id: "12.3-1",
  topic: "12.3",
  title: "Recursive length of a list",
  lang: "haskell",
  code: "myLength :: [a] -> Int\nmyLength []     = 0\nmyLength (x:xs) = 1 + myLength xs\n\n-- trace: myLength [3,6,12]",
  columns: ["Call", "Argument", "Case (base / recursive)", "Value returned"],
  prefill: [["1", "[3,6,12]", "", ""], ["2", "", "", ""], ["3", "", "", ""], ["4", "", "", ""]],
  rows: [
    ["1", "[3,6,12]", "recursive", "3"],
    ["2", "[6,12]", "recursive", "2"],
    ["3", "[12]", "recursive", "1"],
    ["4", "[]", "base", "0"],
  ],
  instructions: "For each call write the list it receives (e.g. [6,12]), whether the base case ([]) or the recursive case ((x:xs)) is used, and the value that call finally returns.",
  hint: "Each recursive call receives the tail of the previous argument. Work the returned values out from the bottom row upwards: 0, then 1 + 0, …",
});
CS.registerTrace({
  id: "12.3-2",
  topic: "12.3",
  title: "Recursive reverse of a list",
  lang: "haskell",
  code: "myReverse :: [a] -> [a]\nmyReverse []     = []\nmyReverse (x:xs) = myReverse xs ++ [x]\n\n-- trace: myReverse [1,2,3]",
  columns: ["Call", "Argument", "Head x", "Value returned"],
  prefill: [["1", "[1,2,3]", "", ""], ["2", "", "", ""], ["3", "", "", ""], ["4", "", "", ""]],
  rows: [
    ["1", "[1,2,3]", "1", "[3,2,1]"],
    ["2", "[2,3]", "2", "[3,2]"],
    ["3", "[3]", "3", "[3]"],
    ["4", "[]", "", "[]"],
  ],
  instructions: "Write lists with square brackets and commas. Leave the Head cell blank for the empty list (it has no head).",
  hint: "Call 3 returns myReverse [] ++ [3] = [] ++ [3] = [3]. Call 2 returns [3] ++ [2].",
});
