/* Python coding practice: strings — string handling and ciphers
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "vowel-count",
    title: "Count the vowels",
    topic: "1.4",
    difficulty: 1,
    task: `Write a program that asks the user to enter some text (prompt \`Enter some text: \`) and outputs \`Vowels: \` followed by the number of vowels in it.

The vowels are \`a\`, \`e\`, \`i\`, \`o\` and \`u\`, in **either** upper or lower case.

\`\`\`text
Enter some text: Hello World
Vowels: 3
\`\`\``,
    tests: [
      { name: "example from the question", input: "Hello World\n", expect: "Vowels: 3" },
      { name: "capital vowels count too", input: "AEIOU aeiou\n", expect: "Vowels: 10" },
      { name: "no vowels", input: "rhythm\n", expect: "Vowels: 0", hidden: true },
      { name: "empty input", input: "\n", expect: "Vowels: 0", hidden: true },
      { name: "longer sentence", input: "Programming in Python\n", expect: "Vowels: 5", hidden: true }
    ],
    hints: [
      "Loop over the string one character at a time: `for ch in text:`.",
      "Convert each character with `.lower()` and test `if ch in \"aeiou\":`."
    ],
    solution: `text = input("Enter some text: ")
count = 0
for ch in text:
    if ch.lower() in "aeiou":
        count = count + 1
print("Vowels: " + str(count))
`,
    explain: `**Approach.** Iterate over every character, count those that are vowels. Converting to lower case first means you only need to test five letters, not ten.

**Edge cases.** An empty string gives a loop that runs zero times, so the count is 0 with no special code. \`y\` is not counted (the question defines the vowels).

**Common mistakes**
- \`if ch == "a" or "e" or "i" ...\` — always true in Python, because \`"e"\` on its own is a non-empty (truthy) string. Use \`in\`, or compare each one: \`ch == "a" or ch == "e" ...\`.
- Forgetting upper-case vowels.`
  },
  {
    id: "palindrome-check",
    title: "Palindrome checker",
    topic: "1.4",
    difficulty: 1,
    task: `A palindrome reads the same forwards and backwards. Write a program that asks for some text (prompt \`Enter some text: \`) and outputs:

- \`Palindrome\` if it is a palindrome, **ignoring spaces and upper/lower case**
- \`Not a palindrome\` otherwise
- \`No text entered\` if the text is empty or contains only spaces.

\`\`\`text
Enter some text: Never odd or even
Palindrome
\`\`\``,
    tests: [
      { name: "example from the question", input: "Never odd or even\n", expect: "Palindrome" },
      { name: "mixed case word", input: "Racecar\n", expect: "Palindrome" },
      { name: "not a palindrome", input: "hello\n", expect: "Not a palindrome" },
      { name: "single letter", input: "a\n", expect: "Palindrome", hidden: true },
      { name: "two different letters", input: "ab\n", expect: "Not a palindrome", hidden: true },
      { name: "empty input", input: "\n", expect: "No text entered", hidden: true },
      { name: "only spaces", input: "   \n", expect: "No text entered", hidden: true },
      { name: "nearly a palindrome", input: "Step on no petz\n", expect: "Not a palindrome", hidden: true }
    ],
    hints: [
      "First build a cleaned string: lower case, with the spaces removed (`text.lower().replace(\" \", \"\")`).",
      "Compare the first character with the last, the second with the second-to-last, and so on — or compare the cleaned string with its reverse."
    ],
    solution: `text = input("Enter some text: ")
cleaned = ""
for ch in text.lower():
    if ch != " ":
        cleaned = cleaned + ch

if cleaned == "":
    print("No text entered")
else:
    is_palindrome = True
    left = 0
    right = len(cleaned) - 1
    while left < right and is_palindrome:
        if cleaned[left] != cleaned[right]:
            is_palindrome = False
        left = left + 1
        right = right - 1
    if is_palindrome:
        print("Palindrome")
    else:
        print("Not a palindrome")
`,
    explain: `**Approach.** Clean the text (lower case, no spaces), then compare characters from both ends moving inwards. As soon as a pair differs it is not a palindrome. Only \`len // 2\` comparisons are needed.

**Shortcut.** \`cleaned == cleaned[::-1]\` (compare with the reversed string) is perfectly good Python and passes the tests. Being able to write the two-pointer loop matters when a question asks you to use iteration, or in pseudocode where there is no slicing shortcut.

**Edge cases.** Check for empty text **after** removing spaces, otherwise \`"   "\` would be reported as a palindrome. A single character is a palindrome.

**Common mistake.** Forgetting the case conversion, so \`Racecar\` fails because \`R\` ≠ \`r\`.`
  },
  {
    id: "password-rules",
    title: "Password rules",
    topic: "1.4",
    difficulty: 2,
    task: `Write a program that asks the user to choose a password (prompt \`Enter a password: \`). A valid password has:

1. at least 8 characters
2. at least one upper-case letter
3. at least one lower-case letter
4. at least one digit.

For each rule that is broken, output one message, **in this order**:
\`Too short\`, \`Needs an uppercase letter\`, \`Needs a lowercase letter\`, \`Needs a digit\`.

If any rule was broken, ask again. When a valid password is entered, output \`Password accepted\`.

\`\`\`text
Enter a password: abc
Too short
Needs an uppercase letter
Needs a digit
Enter a password: Password1
Password accepted
\`\`\``,
    tests: [
      { name: "example from the question", input: "abc\nPassword1\n", expect: "Too short\nNeeds an uppercase letter\nNeeds a digit\nPassword accepted" },
      { name: "valid first time", input: "Secure99\n", expect: "Password accepted" },
      { name: "long enough but no capital or digit", input: "abcdefgh\nAbcdefg1\n", expect: "Needs an uppercase letter\nNeeds a digit\nPassword accepted" },
      { name: "empty password breaks every rule", input: "\nABCDEFGH1\nAbc1efg\nAbc1efgh\n", expect: "Too short\nNeeds an uppercase letter\nNeeds a lowercase letter\nNeeds a digit\nNeeds a lowercase letter\nToo short\nPassword accepted", hidden: true },
      { name: "digits only, then letters only", input: "12345678\nAAAAaaaa\nAAAAaaa9\n", expect: "Needs an uppercase letter\nNeeds a lowercase letter\nNeeds a digit\nPassword accepted", hidden: true },
      { name: "exactly 8 characters with symbols", input: "aB3$%^&*\n", expect: "Password accepted", hidden: true }
    ],
    hints: [
      "Use Boolean flags: `has_upper = False` etc., then loop over the characters setting them with `ch.isupper()`, `ch.islower()`, `ch.isdigit()`.",
      "Wrap everything in `while not valid:` and set `valid = True` only when no message was printed."
    ],
    solution: `valid = False
while not valid:
    password = input("Enter a password: ")
    has_upper = False
    has_lower = False
    has_digit = False
    for ch in password:
        if ch.isupper():
            has_upper = True
        elif ch.islower():
            has_lower = True
        elif ch.isdigit():
            has_digit = True
    valid = True
    if len(password) < 8:
        print("Too short")
        valid = False
    if not has_upper:
        print("Needs an uppercase letter")
        valid = False
    if not has_lower:
        print("Needs a lowercase letter")
        valid = False
    if not has_digit:
        print("Needs a digit")
        valid = False
print("Password accepted")
`,
    explain: `**Approach.** One pass over the characters sets three Boolean flags. Then four **separate** \`if\` statements (not \`elif\`) report every broken rule, because the question wants all the messages, not just the first.

**Without string methods.** \`"A" <= ch <= "Z"\` or \`65 <= ord(ch) <= 90\` also test for a capital letter; AQA questions sometimes expect the character-code version.

**Common mistakes**
- Using \`elif\` for the messages, so only one is printed.
- Testing \`password.isupper()\` (true only if *every* cased letter is a capital) instead of checking each character.
- \`len(password) <= 8\` — rejects a valid 8-character password. The hidden tests include exactly 8.`
  },
  {
    id: "hangman",
    title: "Hangman",
    topic: "1.4",
    difficulty: 2,
    task: `Write a two-player Hangman game.

1. Player 1 enters a secret word in lower case (prompt \`Enter the secret word: \`). You may assume it is valid.
2. Player 2 has **6 lives** and guesses one letter at a time (prompt \`Guess a letter: \`).
   - If the guess is not exactly one lower-case letter \`a\`–\`z\`, output \`Enter one letter\` (no life lost).
   - If the letter has been guessed before, output \`Already guessed\` (no life lost).
   - Otherwise it is a new guess. If the letter is not in the word, lose a life and output \`Wrong! Lives left: <lives>\`. Then output the word with every unguessed letter shown as \`_\` (no spaces), e.g. \`_a_\`.
3. After a new guess, if every letter has been revealed output \`You win!\` and stop; if lives reach 0, output \`You lose! The word was <word>\` and stop.

\`\`\`text
Enter the secret word: cat
Guess a letter: a
_a_
Guess a letter: x
Wrong! Lives left: 5
_a_
Guess a letter: t
_at
Guess a letter: c
cat
You win!
\`\`\``,
    tests: [
      { name: "example from the question", input: "cat\na\nx\nt\nc\n", expect: "_a_\nWrong! Lives left: 5\n_a_\n_at\ncat\nYou win!" },
      { name: "repeated letters revealed together", input: "moon\no\nm\nn\n", expect: "_oo_\nmoo_\nmoon\nYou win!" },
      { name: "invalid and repeated guesses", input: "dog\nA\ndo\n\nd\nd\no\ng\n", expect: "Enter one letter\nEnter one letter\nEnter one letter\nd__\nAlready guessed\ndo_\ndog\nYou win!", hidden: true },
      { name: "player 2 loses", input: "hi\na\nb\nc\nd\ne\nf\n", expect: "Wrong! Lives left: 5\n__\nWrong! Lives left: 4\n__\nWrong! Lives left: 3\n__\nWrong! Lives left: 2\n__\nWrong! Lives left: 1\n__\nWrong! Lives left: 0\n__\nYou lose! The word was hi", hidden: true },
      { name: "repeated wrong letter costs one life", input: "ab\nz\nz\na\nb\n", expect: "Wrong! Lives left: 5\n__\nAlready guessed\na_\nab\nYou win!", hidden: true }
    ],
    hints: [
      "Keep a list `guessed` of letters tried so far. Build the display each time: for each letter of the word, add it if it is in `guessed`, else add `_`.",
      "Validate with `len(guess) == 1 and \"a\" <= guess <= \"z\"`.",
      "The game loop runs `while lives > 0 and not won:`. You have won when the display contains no `_`."
    ],
    solution: `word = input("Enter the secret word: ")
guessed = []
lives = 6
won = False
while lives > 0 and not won:
    guess = input("Guess a letter: ")
    if len(guess) != 1 or not ("a" <= guess <= "z"):
        print("Enter one letter")
    elif guess in guessed:
        print("Already guessed")
    else:
        guessed.append(guess)
        if guess not in word:
            lives = lives - 1
            print("Wrong! Lives left: " + str(lives))
        display = ""
        for letter in word:
            if letter in guessed:
                display = display + letter
            else:
                display = display + "_"
        print(display)
        if "_" not in display:
            won = True
            print("You win!")
        elif lives == 0:
            print("You lose! The word was " + word)
`,
    explain: `**Approach.** Store the *guessed letters* rather than the display; rebuild the display string from the word each time. That automatically reveals every copy of a repeated letter (\`moon\`).

**Validation order matters.** Check "is it one letter?" first, then "already guessed?", and only then treat it as a new guess. Invalid or repeated guesses must not cost a life.

**Common mistakes**
- Replacing only the first occurrence of a letter.
- Losing a life for a repeated wrong guess (the hidden test checks this).
- Checking \`guess.isalpha()\` alone: \`"A"\` would be accepted, but the question says lower case only.`
  },
  {
    id: "caesar-cipher",
    title: "Caesar cipher",
    topic: "5.8",
    difficulty: 2,
    task: `Write a program that encrypts a message with a Caesar cipher.

- Ask for the message (prompt \`Enter the message: \`) and the shift (prompt \`Enter the shift: \`), a whole number that may be negative or bigger than 26.
- Each letter is moved \`shift\` places along the alphabet, wrapping round from \`Z\` to \`A\`. **Upper-case letters stay upper case and lower-case stay lower case.**
- Any other character (space, digit, punctuation) is unchanged.
- Output the encrypted message on its own line.

Use \`ord()\` and \`chr()\`.

\`\`\`text
Enter the message: Hello, World!
Enter the shift: 3
Khoor, Zruog!
\`\`\``,
    tests: [
      { name: "example from the question", input: "Hello, World!\n3\n", expect: "Khoor, Zruog!" },
      { name: "wraps round the end of the alphabet", input: "xyz\n3\n", expect: "abc" },
      { name: "negative shift", input: "ABC abc\n-1\n", expect: "ZAB zab", hidden: true },
      { name: "shift bigger than 26", input: "Attack at dawn\n29\n", expect: "Dwwdfn dw gdzq", hidden: true },
      { name: "shift of 26 changes nothing", input: "Zebra-123\n26\n", expect: "Zebra-123", hidden: true },
      { name: "empty message", input: "\n5\n", expect: "", hidden: true },
      { name: "shift of -27", input: "b\n-27\n", expect: "a", hidden: true }
    ],
    hints: [
      "For a lower-case letter: position = `ord(ch) - ord(\"a\")` (0–25). New position = `(position + shift) % 26`. New letter = `chr(new + ord(\"a\"))`.",
      "Do the same with `ord(\"A\")` for capitals, and add any other character unchanged.",
      "Python's `%` always gives a result from 0 to 25 for `% 26`, even for negative numbers, so negative shifts work automatically."
    ],
    solution: `message = input("Enter the message: ")
shift = int(input("Enter the shift: "))
result = ""
for ch in message:
    if "a" <= ch <= "z":
        result = result + chr((ord(ch) - ord("a") + shift) % 26 + ord("a"))
    elif "A" <= ch <= "Z":
        result = result + chr((ord(ch) - ord("A") + shift) % 26 + ord("A"))
    else:
        result = result + ch
print(result)
`,
    explain: `**Approach.** Convert each letter to a position 0–25, add the shift, wrap with \`MOD 26\`, convert back. Doing the arithmetic on positions (not raw character codes) is what makes wrap-around and large/negative shifts work.

**Why not \`chr(ord(ch) + shift)\`?** \`ord("z") + 3\` is 125, which is \`}\` — no wrap-around. A common fix is \`if code > ord("z"): code -= 26\`, but that breaks for shifts above 26 or below −26.

**Exam link.** The Caesar cipher is a substitution cipher with only 25 useful keys, so it falls to a brute-force attack or frequency analysis (try *Crack a Caesar cipher*). Decryption is just encryption with \`-shift\`.

**Common mistake.** Shifting spaces and punctuation, or losing the capital letters.`
  },
  {
    id: "vernam-cipher",
    title: "Vernam cipher (XOR)",
    topic: "5.8",
    difficulty: 2,
    task: `The Vernam cipher combines each character of the plaintext with the character in the same position of the key using **XOR** on their character codes.

Write a program that:

- asks for the plaintext (prompt \`Enter the plaintext: \`) and the key (prompt \`Enter the key: \`)
- if the key is **shorter** than the plaintext, outputs \`Key too short\` and asks for the key again (until it is long enough)
- outputs the ciphertext as the denary character codes, separated by single spaces
- then decrypts the ciphertext with the same key and outputs \`Decrypted: \` followed by the result.

In Python, \`^\` is the bitwise XOR operator.

\`\`\`text
Enter the plaintext: HI
Enter the key: AB
9 11
Decrypted: HI
\`\`\``,
    tests: [
      { name: "example from the question", input: "HI\nAB\n", expect: "9 11\nDecrypted: HI" },
      { name: "three letters", input: "CAT\ndog\n", expect: "39 46 51\nDecrypted: CAT" },
      { name: "key too short at first", input: "abc\nk\nkey\n", expect: "Key too short\n10 7 26\nDecrypted: abc", hidden: true },
      { name: "key equal to the plaintext gives zeros", input: "Hi!\nHi!\n", expect: "0 0 0\nDecrypted: Hi!", hidden: true },
      { name: "key longer than the plaintext is fine", input: "A\nAZ\n", expect: "0\nDecrypted: A", hidden: true }
    ],
    hints: [
      "XOR two characters with `ord(p) ^ ord(k)`. Keep the codes in a list.",
      "Join the codes with `\" \".join(...)` after converting each to a string.",
      "Decrypting is the same operation again: `chr(code ^ ord(k))`, because (P XOR K) XOR K = P."
    ],
    solution: `plaintext = input("Enter the plaintext: ")
key = input("Enter the key: ")
while len(key) < len(plaintext):
    print("Key too short")
    key = input("Enter the key: ")

codes = []
for i in range(len(plaintext)):
    codes.append(ord(plaintext[i]) ^ ord(key[i]))

text_codes = []
for c in codes:
    text_codes.append(str(c))
print(" ".join(text_codes))

decrypted = ""
for i in range(len(codes)):
    decrypted = decrypted + chr(codes[i] ^ ord(key[i]))
print("Decrypted: " + decrypted)
`,
    explain: `**Approach.** Pair each plaintext character with the key character at the same index, XOR their codes. \`H\` (72 = 1001000) XOR \`A\` (65 = 1000001) = 0001001 = 9.

**Why output numbers?** XOR results are often control codes (0–31) that don't print as visible characters, so showing denary codes is clearer.

**Why it decrypts.** XOR is its own inverse: (P ⊕ K) ⊕ K = P ⊕ (K ⊕ K) = P ⊕ 0 = P.

**Exam link.** The Vernam cipher is only *perfectly secure* when the key is truly random, at least as long as the message, and used only once (a one-time pad). That is why the key length check matters. Ciphertext then gives no statistical information, unlike the Caesar cipher.`
  },
  {
    id: "run-length-encoding",
    title: "Run-length encoding",
    topic: "5.8",
    difficulty: 2,
    task: `Run-length encoding (RLE) replaces each run of repeated characters with the run length followed by the character, so \`AAABBC\` becomes \`3A2B1C\`.

Write a program that asks for a string of letters (prompt \`Enter the data: \`) and outputs its RLE encoding. If nothing is entered, output \`Nothing to encode\`.

\`\`\`text
Enter the data: WWWWWWWWWWWWB
12W1B
\`\`\``,
    tests: [
      { name: "example from the question", input: "WWWWWWWWWWWWB\n", expect: "12W1B" },
      { name: "short runs", input: "AAABBC\n", expect: "3A2B1C" },
      { name: "single character", input: "A\n", expect: "1A", hidden: true },
      { name: "empty input", input: "\n", expect: "Nothing to encode", hidden: true },
      { name: "no repeats at all", input: "ABAB\n", expect: "1A1B1A1B", hidden: true },
      { name: "one long run", input: "ZZZZ\n", expect: "4Z", hidden: true },
      { name: "run at the end", input: "xyyyyy\n", expect: "1x5y", hidden: true }
    ],
    hints: [
      "Keep the current character and a count. Loop from the second character: if it matches, add 1 to the count; if not, write out the count and character, then start a new run.",
      "Don't forget to write out the **last** run after the loop ends."
    ],
    solution: `data = input("Enter the data: ")
if data == "":
    print("Nothing to encode")
else:
    result = ""
    current = data[0]
    count = 1
    for i in range(1, len(data)):
        if data[i] == current:
            count = count + 1
        else:
            result = result + str(count) + current
            current = data[i]
            count = 1
    result = result + str(count) + current
    print(result)
`,
    explain: `**Approach.** Walk through the string keeping track of the current run. When the character changes, the run is complete: append \`count + character\` and start a new run. After the loop the final run hasn't been written yet, so append it.

**Common mistakes**
- Forgetting the final run (\`AAABBC\` → \`3A2B\`).
- Starting the loop at index 0 and comparing with \`data[i - 1]\`: at \`i = 0\` that is \`data[-1]\`, the *last* character.
- Crashing on empty input with \`data[0]\` (\`IndexError\`).

**Exam link.** RLE is *lossless* compression. It works well for data with long runs (simple bitmaps) and can make data *larger* when there are no runs (\`ABAB\` → \`1A1B1A1B\`, twice the size).`
  },
  {
    id: "caesar-crack",
    title: "Crack a Caesar cipher",
    topic: "5.8",
    difficulty: 3,
    task: `In English, \`e\` is the most common letter. Write a program that cracks a Caesar cipher by **frequency analysis**:

1. Ask for the ciphertext (prompt \`Enter the ciphertext: \`).
2. Count how often each letter occurs, treating upper and lower case as the same.
3. Assume the most common letter is the encryption of \`e\`. If several letters are equally common, use the one that comes **first in the alphabet**.
4. Work out the shift used (a number from 0 to 25) and output \`Shift: <shift>\`.
5. Decrypt with that shift (keeping case; other characters unchanged) and output \`Plaintext: <text>\`.

If the ciphertext contains no letters, output \`No letters found\` only.

\`\`\`text
Enter the ciphertext: Phhw ph khuh
Shift: 3
Plaintext: Meet me here
\`\`\``,
    tests: [
      { name: "example from the question", input: "Phhw ph khuh\n", expect: "Shift: 3\nPlaintext: Meet me here" },
      { name: "longer message", input: "Xofob ofob vokfo dro uoic robo!\n", expect: "Shift: 10\nPlaintext: Never ever leave the keys here!" },
      { name: "shift of 0", input: "eeek\n", expect: "Shift: 0\nPlaintext: eeek", hidden: true },
      { name: "shift of 25 with capitals", input: "Rdudm FQDDM sqddr\n", expect: "Shift: 25\nPlaintext: Seven GREEN trees", hidden: true },
      { name: "tie broken alphabetically", input: "ab\n", expect: "Shift: 22\nPlaintext: ef", hidden: true },
      { name: "no letters", input: "123 !?\n", expect: "No letters found", hidden: true }
    ],
    hints: [
      "Use a list of 26 counts: `counts[ord(ch.lower()) - ord(\"a\")] += 1` for each letter.",
      "Find the index of the largest count, scanning from 0 upwards and only replacing the best when a count is strictly bigger — that breaks ties alphabetically.",
      "If the most common letter is at position `p`, the shift is `(p - 4) % 26` (e is position 4). Decrypt by shifting each letter by `-shift`."
    ],
    solution: `def shift_letter(ch, shift):
    if "a" <= ch <= "z":
        return chr((ord(ch) - ord("a") + shift) % 26 + ord("a"))
    if "A" <= ch <= "Z":
        return chr((ord(ch) - ord("A") + shift) % 26 + ord("A"))
    return ch


ciphertext = input("Enter the ciphertext: ")
counts = [0] * 26
for ch in ciphertext.lower():
    if "a" <= ch <= "z":
        counts[ord(ch) - ord("a")] += 1

best = 0
for i in range(1, 26):
    if counts[i] > counts[best]:
        best = i

if counts[best] == 0:
    print("No letters found")
else:
    shift = (best - 4) % 26
    print("Shift: " + str(shift))
    plaintext = ""
    for ch in ciphertext:
        plaintext = plaintext + shift_letter(ch, -shift)
    print("Plaintext: " + plaintext)
`,
    explain: `**Approach.** Build a frequency table of 26 counts, find the most frequent letter, and assume it stands for \`e\`. If ciphertext \`h\` (position 7) is plaintext \`e\` (position 4), the shift was 7 − 4 = 3. \`% 26\` keeps the answer in 0–25 (for \`a\`, 0 − 4 = −4 → 22).

**Tie-breaking.** Scanning from \`a\` to \`z\` and replacing only on a *strictly greater* count keeps the earliest letter. Using \`>=\` would pick the last one instead.

**Limitations (exam point).** Frequency analysis needs enough text to be reliable: short or unusual messages may have a different most common letter. It works because a Caesar cipher is a *mono-alphabetic substitution*: each plaintext letter always maps to the same ciphertext letter, so letter frequencies survive encryption. A Vernam cipher with a random one-time key hides them completely.`
  }
]);
