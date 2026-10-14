CS.registerFlashcards("5.2", [
  { front: "Hex digits A–F: what are their denary values?", back: "A = 10, B = 11, C = 12, D = 13, E = 14, F = 15" },
  { front: "8-bit binary place values (left → right)?", back: "128, 64, 32, 16, 8, 4, 2, 1" },
  { front: "Hex place values for 4 digits (left → right)?", back: "4096, 256, 16, 1" },
  { front: "Denary → binary by repeated division: which remainder is the MSB?", back: "The **last** one. Read the remainders from bottom to top." },
  { front: "Binary → hex: from which end do you group the bits?", back: "From the **right** (LSB), in fours; pad the left group with zeros." },
  { front: "Why does one hex digit equal exactly four bits?", back: "Because 16 = 2⁴: four bits give exactly the 16 possible values 0–15." },
  { front: "Give four places hexadecimal is used.", back: "Memory addresses, colour codes (#FFA500), MAC addresses, IPv6 addresses (also hex dumps/machine code, Unicode code points)." },
  { front: "Two reasons hex is used instead of binary (exam wording).", back: "Shorter so easier for humans to read/remember; fewer errors when copying. (Easy to convert because 1 digit = 4 bits.) NOT 'saves memory'." },
]);
