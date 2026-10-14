CS.registerTrace({
  id: "9.1-1", topic: "9.1", title: "Building an asynchronous frame with even parity", lang: "pseudocode",
  code: "data ← \"1000011\"\nones ← 0\nFOR i ← 0 TO 6\n    IF data[i] = \"1\" THEN\n        ones ← ones + 1\n    ENDIF\nENDFOR\nIF ones MOD 2 = 0 THEN\n    parity ← \"0\"\nELSE\n    parity ← \"1\"\nENDIF\nframe ← \"0\" + data + parity + \"1\"\nOUTPUT frame",
  intro: "The 7-bit ASCII code for **C** is `1000011`. Trace the algorithm that counts the 1s, chooses an **even** parity bit and wraps the data in a start bit (0) and stop bit (1).",
  columns: ["i", "data[i]", "ones", "parity", "OUTPUT"],
  prefill: [
    ["0", "", "", "", ""], ["1", "", "", "", ""], ["2", "", "", "", ""], ["3", "", "", "", ""],
    ["4", "", "", "", ""], ["5", "", "", "", ""], ["6", "", "", "", ""], ["", "", "", "", ""],
  ],
  rows: [
    ["0", "1", "1", "", ""], ["1", "0", "1", "", ""], ["2", "0", "1", "", ""], ["3", "0", "1", "", ""],
    ["4", "0", "1", "", ""], ["5", "1", "2", "", ""], ["6", "1", "3", "", ""], ["", "", "3", "1", "0100001111"],
  ],
  instructions: "Fill in one row per loop iteration. In the last row, record the final value of ones, the parity bit and the OUTPUT.",
  hint: "There are three 1s in 1000011. For even parity the total number of 1s including the parity bit must be even.",
  note: "The frame is 10 bits long: start (0) + 7 data bits + parity + stop (1). Only 7 of the 10 bits are data, so the line spends 30% of its bit rate on overhead.",
});
