CS.registerTrace({
  id: "1.6-1", topic: "1.6", title: "factorial(4): calls going down, returns coming up", lang: "pseudocode",
  code: "SUBROUTINE factorial(n)\n    IF n <= 1 THEN\n        RETURN 1\n    ELSE\n        RETURN n * factorial(n - 1)\n    ENDIF\nENDSUBROUTINE\n\nOUTPUT factorial(4)",
  columns: ["Call number", "n", "n <= 1?", "Frames on stack (for factorial)", "Return value"],
  prefill: [["1", "", "", "", ""], ["2", "", "", "", ""], ["3", "", "", "", ""], ["4", "", "", "", ""], ["3", "", "", "", ""], ["2", "", "", "", ""], ["1", "", "", "", ""]],
  rows: [["1", "4", "False", "1", ""], ["2", "3", "False", "2", ""], ["3", "2", "False", "3", ""], ["4", "1", "True", "4", "1"], ["3", "2", "", "3", "2"], ["2", "3", "", "2", "6"], ["1", "4", "", "1", "24"]],
  instructions: "Rows 1–4 are the calls going down. Rows 5–7 are the returns as the stack unwinds (the n <= 1? cell is blank because the test is not repeated). 'Frames on stack' counts factorial frames while that row happens, including the current one. Write True/False.",
  hint: "On the way back, each call completes `n * (value just returned)` using its own n from its frame.",
});
CS.registerTrace({
  id: "1.6-2", topic: "1.6", title: "Output before and after a recursive call", lang: "pseudocode",
  code: "SUBROUTINE mystery(n)\n    IF n > 0 THEN\n        OUTPUT n\n        mystery(n - 2)\n        OUTPUT n * 10\n    ENDIF\nENDSUBROUTINE\n\nmystery(5)",
  columns: ["Active call", "n", "OUTPUT"],
  prefill: [["mystery(5)", "", ""], ["mystery(3)", "", ""], ["mystery(1)", "", ""], ["mystery(-1)", "", ""], ["mystery(1)", "", ""], ["mystery(3)", "", ""], ["mystery(5)", "", ""]],
  rows: [["mystery(5)", "5", "5"], ["mystery(3)", "3", "3"], ["mystery(1)", "1", "1"], ["mystery(-1)", "-1", ""], ["mystery(1)", "1", "10"], ["mystery(3)", "3", "30"], ["mystery(5)", "5", "50"]],
  instructions: "Each row is a moment when the named call is running. Write what it outputs at that moment (blank if nothing).",
  hint: "The first OUTPUT happens on the way down; the second only happens after the inner call has completely finished.",
  note: "Full output in order: 5 3 1 10 30 50. The base case here is n ≤ 0, where nothing happens.",
});
CS.registerTrace({
  id: "1.6-3", topic: "1.6", title: "fib(4): the order in which calls return", lang: "pseudocode",
  code: "SUBROUTINE fib(n)\n    IF n < 2 THEN\n        RETURN n\n    ELSE\n        RETURN fib(n - 1) + fib(n - 2)\n    ENDIF\nENDSUBROUTINE\n\nOUTPUT fib(4)",
  intro: "The left call `fib(n - 1)` is evaluated completely before the right call `fib(n - 2)` starts. Fill in the **return value** of each call in the order the calls **finish**.",
  columns: ["Call that finishes", "Return value"],
  prefill: [["fib(1)", ""], ["fib(0)", ""], ["fib(2)", ""], ["fib(1)", ""], ["fib(3)", ""], ["fib(1)", ""], ["fib(0)", ""], ["fib(2)", ""], ["fib(4)", ""]],
  rows: [["fib(1)", "1"], ["fib(0)", "0"], ["fib(2)", "1"], ["fib(1)", "1"], ["fib(3)", "2"], ["fib(1)", "1"], ["fib(0)", "0"], ["fib(2)", "1"], ["fib(4)", "3"]],
  hint: "Base cases: fib(0) = 0 and fib(1) = 1. Draw the call tree first.",
  note: "9 calls in total, but never more than 4 fib frames on the stack at once.",
});
