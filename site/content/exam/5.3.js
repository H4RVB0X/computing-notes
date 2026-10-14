CS.registerExam("5.3", [
  { marks: 1, q: "State the number of different values that can be represented using 10 bits.", scheme: ["1024 / 2¹⁰"] },
  { marks: 2, q: "Explain the difference between a kilobyte and a kibibyte.", scheme: ["A kilobyte is 1000 / 10³ bytes (decimal prefix)", "A kibibyte is 1024 / 2¹⁰ bytes (binary prefix)"] },
  { marks: 2, q: "A company needs to give each of its 1500 products a unique binary code. Calculate the minimum number of bits needed. Show your working.", scheme: ["2¹⁰ = 1024 is not enough / 2¹¹ = 2048 is enough", "11 bits"] },
  { marks: 3, q: "A customer buys a hard drive advertised as 2 TB. When connected, the operating system reports its capacity as about 1.82 TiB. Explain why the two figures differ, showing a calculation to support your answer.", scheme: ["The manufacturer uses decimal prefixes: 2 TB = 2 × 10¹² bytes", "The operating system uses binary prefixes: 1 TiB = 2⁴⁰ bytes", "2 × 10¹² ÷ 2⁴⁰ ≈ 1.82 TiB, so no capacity is missing; the units differ"] },
  { marks: 2, q: "State what is meant by a bit and by a byte.", scheme: ["A bit is a binary digit (0 or 1) / the fundamental unit of information", "A byte is a group of 8 bits"] },
  { marks: 3, q: "Complete the table: give the power of 2 for kibi, mebi and gibi, and the power of 10 for kilo, mega and giga.", scheme: ["kibi = 2¹⁰ and kilo = 10³", "mebi = 2²⁰ and mega = 10⁶", "gibi = 2³⁰ and giga = 10⁹"] },
]);
