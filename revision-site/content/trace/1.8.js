CS.registerTrace({
  id: "1.8-1", topic: "1.8", title: "Objects, references and an overridden method", lang: "python",
  code: "class Counter:\n    def __init__(self, start):\n        self.value = start\n    def step(self):\n        self.value = self.value + 1\n\nclass DoubleCounter(Counter):\n    def step(self):\n        self.value = self.value * 2\n\na = Counter(3)\nb = DoubleCounter(3)\nc = a\na.step()\nb.step()\nc.step()\nprint(a.value, b.value, c.value)",
  columns: ["Statement", "a.value", "b.value", "c.value", "OUTPUT"],
  prefill: [["after line 13 (c = a)", "", "", "", ""], ["a.step()", "", "", "", ""], ["b.step()", "", "", "", ""], ["c.step()", "", "", "", ""], ["print", "", "", "", ""]],
  rows: [["after line 13 (c = a)", "3", "3", "3", ""], ["a.step()", "4", "3", "4", ""], ["b.step()", "4", "6", "4", ""], ["c.step()", "5", "6", "5", ""], ["print", "5", "6", "5", "5 6 5"]],
  instructions: "Write the value of all three attributes on every row (not just the ones that change).",
  hint: "`c = a` does not create a new object. `b` is a DoubleCounter, so its overridden step() runs.",
});
