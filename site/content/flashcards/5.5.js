CS.registerFlashcards("5.5", [
  { front: "AQA floating point format", back: "Two's complement mantissa with the point after the first bit (−1 . ½ ¼ ⅛ …) × 2^(two's complement exponent)." },
  { front: "Normalised mantissa: what does it start with?", back: "Positive: 01 (0.1…). Negative: 10 (1.0…)." },
  { front: "Two reasons for normalisation", back: "Maximum precision (no wasted leading bits) and a unique representation of each value." },
  { front: "Shift the mantissa left k places: what happens to the exponent?", back: "Subtract k (the mantissa doubled k times, so the exponent must undo it)." },
  { front: "Absolute and relative error formulae", back: "Absolute = |true − stored|. Relative = absolute ÷ true (× 100 for %)." },
  { front: "Fixed vs floating point: range, precision, speed", back: "Float: larger range, precision varies with size, slower. Fixed: small range, constant precision, faster/simpler." },
  { front: "Overflow vs underflow", back: "Overflow: result too large in magnitude (exponent too big). Underflow: result too close to 0 (exponent too negative), stored as 0." },
  { front: "Largest / smallest positive, 8-bit mantissa + 4-bit exponent", back: "Largest 01111111 0111 = 127. Smallest positive 01000000 1000 = 1/512." },
  { front: "Mantissa bits vs exponent bits", back: "More mantissa bits → more precision. More exponent bits → more range." },
  { front: "Correct value of 1010000 11111 (7-bit mantissa, 5-bit exponent)", back: "−0.75 × 2⁻¹ = −0.375 (not 5/8)." },
]);
