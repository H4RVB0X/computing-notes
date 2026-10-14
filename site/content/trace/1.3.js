CS.registerTrace({
  id: "1.3-1", topic: "1.3", title: "Denary to binary with DIV and MOD", lang: "pseudocode",
  code: "n ← 13\nbits ← \"\"\nWHILE n > 0\n    r ← n MOD 2\n    bits ← INT_TO_STRING(r) + bits\n    n ← n DIV 2\nENDWHILE\nOUTPUT bits",
  columns: ["n", "r", "bits", "OUTPUT"],
  rows: [["13", "", "", ""], ["6", "1", "1", ""], ["3", "0", "01", ""], ["1", "1", "101", ""], ["0", "1", "1101", ""], ["", "", "", "1101"]],
  instructions: "First row = values before the loop. Then one row per pass showing values at the END of the pass. Final row = OUTPUT. Write bits without quotation marks.",
  hint: "Each remainder is added to the **front** of the string, so the bits come out in the right order.",
});
