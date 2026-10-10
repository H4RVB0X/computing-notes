CS.registerExam("4.3", [
  { marks: 1, q: "State what is meant by the **cardinality** of a finite set.", scheme: ["The number of elements in the set"] },
  { marks: 2, q: "List the elements of: (a) {x | x ∈ ℕ ∧ x < 5} (b) {x² | x ∈ ℕ ∧ 1 ≤ x ≤ 4}", scheme: ["(a) {0, 1, 2, 3, 4}", "(b) {1, 4, 9, 16}"] },
  { marks: 3, q: "A = {2, 4, 6, 8} and B = {4, 8, 12}. State: (a) A ∪ B (b) A ∩ B (c) A \\ B", scheme: ["(a) {2, 4, 6, 8, 12}", "(b) {4, 8}", "(c) {2, 6}"] },
  { marks: 2, q: "P = {r, s} and Q = {1, 2, 3}. Write out P × Q and state its cardinality.", scheme: ["{(r, 1), (r, 2), (r, 3), (s, 1), (s, 2), (s, 3)} as ordered pairs", "Cardinality 6"] },
  { marks: 2, q: "Explain the difference between a **subset** and a **proper subset**.", scheme: ["A is a subset of B if every element of A is also in B (A may equal B)", "A is a proper subset of B if it is a subset and A ≠ B / B contains at least one element not in A"] },
  { marks: 2, q: "Explain why the set of integers ℤ is described as **countably infinite**.", scheme: ["It has an infinite number of elements", "Its elements can be put into a one-to-one correspondence with the natural numbers / listed in a sequence that reaches every integer (e.g. 0, 1, −1, 2, −2, …)"] },
  { marks: 3, q: "Describe the set {0ⁿ1ⁿ | n ≥ 1} and give **three** strings that belong to it.", scheme: ["Strings of n 0s followed by n 1s / the same number of 0s and 1s with all 0s before all 1s", "n is at least 1 (so the empty string is not included)", "Three of 01, 0011, 000111, 00001111"] },
]);
