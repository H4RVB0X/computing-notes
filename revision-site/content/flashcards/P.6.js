CS.registerFlashcards("P.6", [
  { front: "Section B: what are 07.1 and 07.2?", back: "07.1: your complete program code. 07.2: screenshot of the specified test showing inputs and outputs." },
  { front: "Validation pattern for an integer in a range.", back: "N = 0\nwhile N < lo or N > hi:\n    try: N = int(input(prompt))\n    except ValueError: N = 0" },
  { front: "Last digit / remove last digit / digit sum.", back: "n % 10 ; n // 10 ; loop adding n % 10 then n //= 10 until n is 0" },
  { front: "Binary → denary without int(x, 2).", back: "Value = 0; for each bit left to right: Value = Value * 2 + int(bit)" },
  { front: "Denary → 8-bit binary without bin().", back: "8 times: Bits = str(n % 2) + Bits; n = n // 2" },
  { front: "Caesar shift one letter.", back: "chr((ord(ch) − base + shift) % 26 + base), base = ord('A') or ord('a')" },
  { front: "Luhn algorithm.", back: "From the right, double every second digit (subtract 9 if over 9), add all digits; valid if total % 10 == 0." },
  { front: "Five habits that protect Section B marks.", back: "Exact prompts · validation loops · build-and-run in steps · exact output format · run the stated test inputs in order." },
]);
