CS.registerFlashcards("5.4", [
  { front: "Binary addition rules", back: "0+0=0 · 0+1=1 · 1+1=0 carry 1 · 1+1+1=1 carry 1" },
  { front: "Unsigned range for n bits", back: "0 to 2ⁿ − 1 (8 bits: 0 to 255)" },
  { front: "Two's complement range for n bits", back: "−2ⁿ⁻¹ to 2ⁿ⁻¹ − 1 (8 bits: −128 to 127)" },
  { front: "Two ways to negate a two's complement number", back: "1. Invert all bits, add 1.\n2. From the right, copy up to and including the first 1, then invert the rest." },
  { front: "How do you subtract using two's complement?", back: "a − b = a + (−b): negate b, add, discard the carry out of the MSB." },
  { front: "How do you spot two's complement overflow?", back: "Two positives give a negative, or two negatives give a positive (sign bit changes). Mixed signs never overflow." },
  { front: "Binary long multiplication method", back: "For each 1 in the multiplier write the multiplicand shifted left by that bit's position; for each 0 write 0. Add the partial products." },
  { front: "−1, −128 and +127 in 8-bit two's complement", back: "−1 = 11111111 · −128 = 10000000 · +127 = 01111111" },
  { front: "Sign extension", back: "Copy the MSB into new left-hand bits: 1011 (−5) → 11111011 (−5)." },
]);
