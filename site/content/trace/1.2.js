CS.registerTrace({
  id: "1.2-1", topic: "1.2", title: "Nested FOR loops with a dependent inner bound", lang: "pseudocode",
  code: "total ← 0\nFOR i ← 1 TO 3\n    FOR j ← 1 TO i\n        total ← total + j\n    ENDFOR\n    OUTPUT total\nENDFOR",
  columns: ["i", "j", "total", "OUTPUT"],
  prefill: [["", "", "", ""], ["1", "1", "", ""], ["2", "1", "", ""], ["2", "2", "", ""], ["3", "1", "", ""], ["3", "2", "", ""], ["3", "3", "", ""]],
  rows: [["", "", "0", ""], ["1", "1", "1", "1"], ["2", "1", "2", ""], ["2", "2", "4", "4"], ["3", "1", "5", ""], ["3", "2", "7", ""], ["3", "3", "10", "10"]],
  instructions: "Each row is one pass of the inner loop. Write the OUTPUT on the row of the last inner pass for that value of i. Leave cells blank where nothing is output.",
  hint: "The inner loop runs i times, so 1 + 2 + 3 = 6 passes altogether. `total` is never reset.",
});
CS.registerTrace({
  id: "1.2-2", topic: "1.2", title: "WHILE loop that reverses the digits of a number", lang: "pseudocode",
  code: "n ← 4072\nrev ← 0\nWHILE n > 0\n    digit ← n MOD 10\n    rev ← rev * 10 + digit\n    n ← n DIV 10\nENDWHILE\nOUTPUT rev",
  columns: ["n", "digit", "rev", "OUTPUT"],
  rows: [["4072", "", "0", ""], ["407", "2", "2", ""], ["40", "7", "27", ""], ["4", "0", "270", ""], ["0", "4", "2704", ""], ["", "", "", "2704"]],
  instructions: "First row = values before the loop. Then one row per pass of the loop showing the values at the END of that pass. Last row = the OUTPUT.",
  hint: "`MOD 10` gives the last digit; `DIV 10` removes it. The loop stops when n reaches 0 (tested at the start).",
  note: "Notice the 0 digit: rev goes 27 → 270, which is why the answer is 2704 and not 274.",
});
CS.registerTrace({
  id: "1.2-3", topic: "1.2", title: "REPEAT … UNTIL with nested selection", lang: "pseudocode",
  code: "n ← 6\nsteps ← 0\nREPEAT\n    IF n MOD 2 = 0 THEN\n        n ← n DIV 2\n    ELSE\n        n ← 3 * n + 1\n    ENDIF\n    steps ← steps + 1\nUNTIL n = 1\nOUTPUT steps",
  columns: ["n", "steps", "OUTPUT"],
  rows: [["6", "0", ""], ["3", "1", ""], ["10", "2", ""], ["5", "3", ""], ["16", "4", ""], ["8", "5", ""], ["4", "6", ""], ["2", "7", ""], ["1", "8", ""], ["", "", "8"]],
  instructions: "First row = initial values. Then one row per pass of the REPEAT loop (values at the end of the pass). Final row = OUTPUT.",
  hint: "Even → halve. Odd → 3n + 1. The test `n = 1` happens after steps is incremented.",
});
