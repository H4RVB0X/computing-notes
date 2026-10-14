CS.registerFlashcards("1.4", [
  { front: "AQA SUBSTRING vs Python slice vs VB Substring.", back: "AQA `SUBSTRING(start, end, s)` end inclusive · Python `s[start:end+1]` stop exclusive · VB `s.Substring(start, length)`." },
  { front: "The four AQA string↔number conversion functions.", back: "STRING_TO_INT, STRING_TO_REAL, INT_TO_STRING, REAL_TO_STRING" },
  { front: "Codes: 'A', 'a', '0'.", back: "65, 97, 48. Lower = upper + 32." },
  { front: "Python try clauses and when each runs.", back: "try: risky code · except: if matching exception · else: if no exception · finally: always" },
  { front: "Where does execution continue after an exception is handled?", back: "After the whole try/except structure — not at the line that failed. Wrap in a loop to retry." },
  { front: "What is a seed?", back: "The starting value of a pseudo-random number generator; same seed → same sequence." },
  { front: "Four uses of random numbers.", back: "Games, simulations/modelling, test data, random sampling (also cryptography with a secure generator)." },
  { front: "Python `random.randint(1, 6)` vs VB `rng.Next(1, 6)`.", back: "randint includes 6 (1–6). VB Next excludes the upper bound (1–5)." },
]);
