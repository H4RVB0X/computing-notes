CS.registerFlashcards("5.6", [
  { front: "ASCII codes for '0', 'A' and 'a'", back: "'0' = 48, 'A' = 65, 'a' = 97 (lower = upper + 32)" },
  { front: "Character '5' vs number 5 in binary", back: "'5' = ASCII 53 = 0110101. 5 = 101 (pure binary)." },
  { front: "Three reasons Unicode was introduced", back: "ASCII only 128/256 characters; other languages/scripts and symbols/emoji needed; one international standard for the web (extended ASCII versions clashed)." },
  { front: "UTF-8 vs UTF-16 vs UTF-32", back: "UTF-8: 1–4 bytes, ASCII-compatible. UTF-16: 2 or 4 bytes. UTF-32: fixed 4 bytes." },
  { front: "What can a single parity bit NOT do?", back: "Detect an even number of bit errors; locate or correct an error." },
  { front: "Majority voting: pros and cons", back: "Pro: corrects single errors without re-sending. Con: triples the data; fails if 2 of 3 copies are wrong." },
  { front: "ISBN-13 check digit method", back: "Weights 1,3,1,3… on 12 digits; total; check = (10 − total MOD 10) MOD 10." },
  { front: "Modulo-11 check digit method", back: "Weights increase from 2 at the rightmost data digit; total MOD 11 = r; check = 11 − r (0 if r = 0, X for 10). Verify: weighted total incl. check digit MOD 11 = 0." },
  { front: "Which error check corrects; which only detect?", back: "Majority voting corrects. Parity, checksums and check digits only detect." },
]);
