CS.registerTrace({
  id: "4.4-1",
  topic: "4.4",
  title: "Which strings match a*b+c?(d|e)?",
  lang: "text",
  code: "a*b+c?(d|e)",
  columns: ["String", "Matches? (Yes/No)"],
  prefill: [["bd", ""], ["abce", ""], ["aabbbe", ""], ["ad", ""], ["bcde", ""], ["bbbcd", ""], ["ace", ""], ["abcc d", ""]],
  rows: [["bd", "Yes"], ["abce", "Yes"], ["aabbbe", "Yes"], ["ad", "No"], ["bcde", "No"], ["bbbcd", "Yes"], ["ace", "No"], ["abcc d", "No"]],
  instructions: "A string matches only if the WHOLE string is in the set described by the expression. Write Yes or No.",
  hint: "Every match needs at least one b, at most one c, and must end in exactly one d or e.",
});
CS.registerTrace({
  id: "4.4-2",
  topic: "4.4",
  title: "FSM for (a|b)c*de*: trace bccde",
  lang: "text",
  code: "Start: S0    Accepting: S2\nS0 --a--> S1     S0 --b--> S1\nS1 --c--> S1     S1 --d--> S2\nS2 --e--> S2\n(any other symbol: reject)\n\nInput: bccde",
  columns: ["Step", "Current state", "Input", "Next state"],
  prefill: [["1", "S0", "b", ""], ["2", "", "c", ""], ["3", "", "c", ""], ["4", "", "d", ""], ["5", "", "e", ""], ["Accepted?", "", "", ""]],
  rows: [["1", "S0", "b", "S1"], ["2", "S1", "c", "S1"], ["3", "S1", "c", "S1"], ["4", "S1", "d", "S2"], ["5", "S2", "e", "S2"], ["Accepted?", "", "", "Yes"]],
  instructions: "Fill in the states for each symbol. In the last row write Yes or No in the Next state column.",
});
