CS.registerFlashcards("1.2", [
  { front: "The three basic programming constructs.", back: "Sequence, selection, iteration." },
  { front: "WHILE vs REPEAT … UNTIL: where is the condition tested and minimum runs?", back: "WHILE: at the start, may run **0** times, loops while True.\nREPEAT: at the end, runs **at least once**, loops until True." },
  { front: "Definite vs indefinite iteration.", back: "Definite (count-controlled, FOR): number of repetitions known before the loop starts. Indefinite (condition-controlled, WHILE/REPEAT): repeats until a condition is met." },
  { front: "How many times does the body of `FOR i ← 1 TO 4` / `FOR j ← 1 TO 5` run?", back: "4 × 5 = 20" },
  { front: "Python equivalent of AQA `FOR i ← 1 TO 10`.", back: "`for i in range(1, 11):` (the stop value is exclusive)" },
  { front: "How do you get REPEAT … UNTIL behaviour in Python?", back: "`while True:` … body … `if condition: break`" },
  { front: "Pattern for a WHILE loop with a rogue value.", back: "Read the first value **before** the loop; test it in the WHILE; process it; read the next value as the **last** line of the body." },
  { front: "Why does the order of ELSE IF tests matter?", back: "Only the first True branch runs, so a broader test placed first will capture cases meant for a narrower one later." },
  { front: "Four reasons to use meaningful identifiers.", back: "Self-documenting/readable · easier to debug · easier to maintain · easier for teams to share code" },
]);
