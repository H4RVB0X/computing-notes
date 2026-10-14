CS.registerTrace({
  id: "1.5-1", topic: "1.5", title: "Locals with the same name in two subroutines", lang: "python",
  code: "def triple(n):\n    amount = n * 3\n    return amount\n\ndef main():\n    amount = 10\n    result = triple(amount) + triple(2)\n    print(amount, result)\n\nmain()",
  columns: ["Executing", "n", "amount (in triple)", "amount (in main)", "result", "OUTPUT"],
  prefill: [["main", "", "", "", "", ""], ["triple", "", "", "", "", ""], ["triple", "", "", "", "", ""], ["main", "", "", "", "", ""]],
  rows: [["main", "", "", "10", "", ""], ["triple", "10", "30", "", "", ""], ["triple", "2", "6", "", "", ""], ["main", "", "", "", "36", "10 36"]],
  instructions: "Each row shows the values set while the named subroutine was executing. Leave a cell blank if that variable is not set on that row (a local of another subroutine cannot be set).",
  hint: "Each call to triple gets its own n and amount. Changing triple's amount never touches main's amount.",
});
CS.registerTrace({
  id: "1.5-2", topic: "1.5", title: "A function that calls another function in a loop", lang: "pseudocode",
  code: "SUBROUTINE square(x)\n    RETURN x * x\nENDSUBROUTINE\n\nSUBROUTINE sumSquares(n)\n    total ← 0\n    FOR i ← 1 TO n\n        total ← total + square(i)\n    ENDFOR\n    RETURN total\nENDSUBROUTINE\n\nOUTPUT sumSquares(3)",
  columns: ["n", "i", "x", "total", "OUTPUT"],
  rows: [["3", "", "", "0", ""], ["", "1", "1", "1", ""], ["", "2", "2", "5", ""], ["", "3", "3", "14", ""], ["", "", "", "", "14"]],
  instructions: "First row = the call sumSquares(3) and its initialisation. Then one row per pass of the FOR loop (x is square's parameter for that call). Final row = OUTPUT.",
  hint: "square(i) returns i × i: 1, 4, 9.",
});
