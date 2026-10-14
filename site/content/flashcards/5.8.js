CS.registerFlashcards("5.8", [
  { front: "Three reasons to compress files", back: "Less storage; faster transmission/download; less bandwidth; enables streaming." },
  { front: "Lossless vs lossy (one line each + examples)", back: "Lossless: exact reconstruction (ZIP, PNG, FLAC, RLE). Lossy: data permanently removed, much smaller (JPEG, MP3, MP4)." },
  { front: "RLE of AAAAABBBCD", back: "5A3B1C1D" },
  { front: "When does RLE work badly?", back: "Few/short runs (e.g. photos): each value still needs a count, so the file may grow." },
  { front: "Dictionary compression in three steps", back: "Find repeated patterns → give each a short code in a dictionary → replace occurrences with codes (store the dictionary too)." },
  { front: "Caesar cipher encrypt/decrypt formulae", back: "Encrypt: (pos + key) MOD 26. Decrypt: (pos − key) MOD 26." },
  { front: "Why the Caesar cipher is weak", back: "Only 25 keys (brute force); letter frequencies preserved (frequency analysis)." },
  { front: "XOR truth table", back: "0⊕0 = 0, 0⊕1 = 1, 1⊕0 = 1, 1⊕1 = 0. (P ⊕ K) ⊕ K = P." },
  { front: "Four conditions for Vernam perfect security", back: "Key truly random; at least as long as the message; used only once; kept secret." },
  { front: "Computational security", back: "Cannot be cracked in a reasonable time with available computing power, though possible in theory (e.g. AES, RSA)." },
]);
