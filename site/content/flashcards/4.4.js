CS.registerFlashcards("4.4", [
  { front: "Meaning of * + ? | ( ) [ ] in a regex?", back: "`*` zero or more · `+` one or more · `?` zero or one · `|` or · `( )` group · `[abc]` any one of a, b, c." },
  { front: "Regex for: any binary string; starts with 1; ends with 0; 0s then 1s.", back: "`(0|1)*` · `1(0|1)*` · `(0|1)*0` · `0*1*`" },
  { front: "Why is `(01)*` not 'any combination of 0s and 1s'?", back: "It only allows repeats of the pair 01 (ε, 01, 0101, …). 'Any combination' is `(0|1)*`." },
  { front: "Precedence: how is `a|bc*` read?", back: "`a | (b(c*))`: `*` first, then concatenation, then `|`." },
  { front: "What is a regular language?", back: "One that can be represented by a regular expression; equivalently, recognised by an FSM." },
  { front: "Regex → FSM: how are `*`, `|` and concatenation drawn?", back: "`*` = a loop; `|` = alternative arrows (or one arrow labelled 'a, b'); concatenation = arrows in sequence through new states." },
  { front: "Regex for the FSM accepting strings ending in ab?", back: "`(a|b)*ab`" },
  { front: "Name two languages that are not regular.", back: "{0ⁿ1ⁿ | n ≥ 1}; correctly nested brackets (also palindromes). They need counting." },
  { front: "Python: match whole string vs find inside?", back: "`re.fullmatch(p, s)`: whole string (the AQA meaning). `re.search(p, s)`: anywhere in s." },
]);
