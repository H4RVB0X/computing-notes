CS.registerTrace({
  id: "1.4-1", topic: "1.4", title: "Caesar shift with character codes", lang: "pseudocode",
  code: "word ← \"ZAP\"\nout ← \"\"\nFOR i ← 0 TO LEN(word) - 1\n    c ← CHAR_TO_CODE(SUBSTRING(i, i, word)) - 65\n    c ← (c + 3) MOD 26\n    out ← out + CODE_TO_CHAR(c + 65)\nENDFOR\nOUTPUT out",
  intro: "`CHAR_TO_CODE('A')` = 65 and the capitals A–Z have codes 65–90. `SUBSTRING(i, i, word)` is the single character at index i.",
  columns: ["i", "c (after line 4)", "c (after line 5)", "out", "OUTPUT"],
  prefill: [["0", "", "", "", ""], ["1", "", "", "", ""], ["2", "", "", "", ""], ["", "", "", "", ""]],
  rows: [["0", "25", "2", "C", ""], ["1", "0", "3", "CD", ""], ["2", "15", "18", "CDS", ""], ["", "", "", "", "CDS"]],
  instructions: "One row per pass of the loop. Write strings without quotation marks. The last row is for the OUTPUT only.",
  hint: "'Z' is 90, so c = 25; (25 + 3) MOD 26 = 2, which is 'C'. 'P' is 80.",
});
