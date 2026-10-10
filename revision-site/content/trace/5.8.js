CS.registerTrace({
  id: "5.8-1",
  topic: "5.8",
  title: "Run length encoding: RLE(\"AAABCC\")",
  lang: "pseudocode",
  code: "text ← \"AAABCC\"\noutput ← \"\"\ncount ← 1\nFOR i ← 1 TO LEN(text) - 1\n    IF text[i] = text[i - 1] THEN\n        count ← count + 1\n    ELSE\n        output ← output + INT_TO_STRING(count) + text[i - 1]\n        count ← 1\n    ENDIF\nENDFOR\noutput ← output + INT_TO_STRING(count) + text[LEN(text) - 1]\nOUTPUT output",
  intro: "One row per pass of the FOR loop, then a final row for the line after the loop.",
  columns: ["i", "text[i]", "text[i − 1]", "count", "output"],
  prefill: [["1", "", "", "", ""], ["2", "", "", "", ""], ["3", "", "", "", ""], ["4", "", "", "", ""], ["5", "", "", "", ""], ["after loop", "—", "—", "", ""]],
  rows: [
    ["1", "A", "A", "2", ""],
    ["2", "A", "A", "3", ""],
    ["3", "B", "A", "1", "3A"],
    ["4", "C", "B", "1", "3A1B"],
    ["5", "C", "C", "2", "3A1B"],
    ["after loop", "—", "—", "2", "3A1B2C"],
  ],
  instructions: "Show count and output after each pass. Leave output blank while it is still the empty string.",
  hint: "When the character changes, the finished run (count + previous character) is appended and count resets to 1.",
  note: "OUTPUT: **3A1B2C**. Six characters became six: RLE only saves space when runs are long.",
});

CS.registerTrace({
  id: "5.8-2",
  topic: "5.8",
  title: "Caesar cipher: encrypt ZEBRA with key 3",
  lang: "text",
  code: "position: A = 0, B = 1, … Z = 25\ncipher position = (position + key) MOD 26",
  columns: ["Plaintext letter", "Position", "(position + 3) MOD 26", "Ciphertext letter"],
  prefill: [["Z", "", "", ""], ["E", "", "", ""], ["B", "", "", ""], ["R", "", "", ""], ["A", "", "", ""]],
  rows: [
    ["Z", "25", "2", "C"],
    ["E", "4", "7", "H"],
    ["B", "1", "4", "E"],
    ["R", "17", "20", "U"],
    ["A", "0", "3", "D"],
  ],
  hint: "Z + 3 wraps round: (25 + 3) MOD 26 = 2 = C.",
  note: "Ciphertext: **CHEUD**. To decrypt, use (position − 3) MOD 26.",
});

CS.registerTrace({
  id: "5.8-3",
  topic: "5.8",
  title: "Vernam cipher: encrypt CAT with key DOG",
  lang: "text",
  code: "ASCII: A = 65, C = 67, D = 68, G = 71, O = 79, T = 84\nciphertext bit = plaintext bit XOR key bit",
  columns: ["Plaintext", "Plaintext (8-bit binary)", "Key", "Key (8-bit binary)", "Ciphertext (binary)"],
  prefill: [["C", "", "D", "", ""], ["A", "", "O", "", ""], ["T", "", "G", "", ""]],
  rows: [
    ["C", "01000011", "D", "01000100", "00000111"],
    ["A", "01000001", "O", "01001111", "00001110"],
    ["T", "01010100", "G", "01000111", "00010011"],
  ],
  hint: "XOR: equal bits give 0, different bits give 1.",
  note: "Ciphertext in hex: 07 0E 13. XOR each byte with the same key again to recover C A T.",
});
