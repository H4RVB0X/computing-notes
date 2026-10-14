CS.registerTrace({
  id: "7.3-1",
  topic: "7.3",
  title: "Trace a loop in AQA assembly",
  lang: "asm",
  intro: "Trace this program. Each row is one pass through the loop body. Record **R1 after the ADD**, **R0 after the SUB**, and whether the `BGT` branch is taken (**Yes**/**No**).",
  code: "        MOV R0, #5\n        MOV R1, #0\nloop:   ADD R1, R1, R0\n        SUB R0, R0, #2\n        CMP R0, #0\n        BGT loop\n        STR R1, 50\n        HALT",
  columns: ["Pass", "R1 after ADD", "R0 after SUB", "BGT taken?"],
  prefill: [
    ["1", "", "", ""],
    ["2", "", "", ""],
    ["3", "", "", ""],
  ],
  rows: [
    ["1", "5", "3", "Yes"],
    ["2", "8", "1", "Yes"],
    ["3", "9", "-1", "No"],
  ],
  instructions: "Use a minus sign for negative numbers. The registers are signed.",
  hint: "`BGT loop` is only taken when R0 is **strictly** greater than 0 after the CMP. What is 1 − 2?",
  note: "The loop adds 5 + 3 + 1, so address 50 ends up holding **9** — the sum of the odd numbers from 5 down to 1.",
});
