/* Python coding practice: A level Programming Booklet, Part 1 – Strings
   Exercises from the class programming booklet, made precise enough to test automatically.
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "bk-reverse-case",
    title: "Reverse the case (booklet)",
    topic: "1.4",
    difficulty: 1,
    task: `Given a string, create a **function** \`ReverseCase(text)\` that **returns** the string with the case reversed: every lower-case letter becomes upper case, and every upper-case letter becomes lower case. Anything that isn't a letter (spaces, digits, punctuation) stays as it is.

Your code should only define the function: no \`input()\` and no \`print()\`. The tests call it, for example:

\`\`\`python
print(ReverseCase("Happy Birthday"))   # hAPPY bIRTHDAY
print(ReverseCase("MANY THANKS"))      # many thanks
print(ReverseCase("sPoNtAnEoUs"))      # SpOnTaNeOuS
\`\`\``,
    starter: `def ReverseCase(text):
    result = ""
    # build the result one character at a time
    return result
`,
    tests: [
      { name: "Happy Birthday", code: "print(ReverseCase(\"Happy Birthday\"))", expect: "hAPPY bIRTHDAY" },
      { name: "MANY THANKS", code: "print(ReverseCase(\"MANY THANKS\"))", expect: "many thanks" },
      { name: "sPoNtAnEoUs", code: "print(ReverseCase(\"sPoNtAnEoUs\"))", expect: "SpOnTaNeOuS" },
      { name: "digits and punctuation are unchanged", code: "print(ReverseCase(\"Room 101, Floor 2!\"))", expect: "rOOM 101, fLOOR 2!", hidden: true },
      { name: "empty string", code: "print(repr(ReverseCase(\"\")))", expect: "''", hidden: true },
      { name: "returns rather than prints", code: "r = ReverseCase(\"abc\")\nprint(r == \"ABC\")", expect: "True", hidden: true }
    ],
    hints: [
      "Loop over the characters: `for ch in text:` and build up a new string.",
      "`ch.isupper()` and `ch.islower()` tell you which case a letter is; `ch.lower()` and `ch.upper()` convert it. Anything else is added unchanged."
    ],
    solution: `def ReverseCase(text):
    result = ""
    for ch in text:
        if ch.isupper():
            result = result + ch.lower()
        elif ch.islower():
            result = result + ch.upper()
        else:
            result = result + ch
    return result
`,
    explain: `**Approach.** Strings are immutable, so build a new one: for each character, add its opposite-case version (or the character itself if it isn't a letter) and return the result.

**Shortcut.** Python has \`text.swapcase()\`, which does exactly this and passes the tests. Writing the loop yourself is the point of the exercise, and it is what you'd do in pseudocode, where there's no such method.

**Another way.** Using character codes: upper-case letters are 65–90 and lower case 97–122, so \`chr(ord(ch) + 32)\` turns \`A\` into \`a\`. This only works for A–Z, which is all you need here.

**Common mistakes**
- Using \`if\` / \`if\` instead of \`if\` / \`elif\`: a letter changed to lower case by the first \`if\` is then changed straight back by the second.
- Printing the result instead of returning it.`
  },
  {
    id: "bk-count-all",
    title: "Count letters and digits (booklet)",
    topic: "1.4",
    difficulty: 1,
    task: `Write a **function** \`count_all(text)\` that takes a string and calculates the number of **letters** and the number of **digits** in it. Return the result as a string in exactly this format (the booklet calls it an "anonymous type in string format", which is how C# displays one):

\`\`\`text
{ LETTERS = 10, DIGITS = 0 }
\`\`\`

Spaces, punctuation and other symbols are not counted. Letters means A–Z and a–z.

Your code should only define the function. Examples:

\`\`\`python
print(count_all("Hello World"))   # { LETTERS = 10, DIGITS = 0 }
print(count_all("H3ll0 Wor1d"))   # { LETTERS = 7, DIGITS = 3 }
print(count_all("149990"))        # { LETTERS = 0, DIGITS = 6 }
\`\`\``,
    starter: `def count_all(text):
    letters = 0
    digits = 0

    return ""
`,
    tests: [
      { name: "Hello World", code: "print(count_all(\"Hello World\"))", expect: "{ LETTERS = 10, DIGITS = 0 }" },
      { name: "H3ll0 Wor1d", code: "print(count_all(\"H3ll0 Wor1d\"))", expect: "{ LETTERS = 7, DIGITS = 3 }" },
      { name: "149990", code: "print(count_all(\"149990\"))", expect: "{ LETTERS = 0, DIGITS = 6 }" },
      { name: "empty string", code: "print(count_all(\"\"))", expect: "{ LETTERS = 0, DIGITS = 0 }", hidden: true },
      { name: "symbols are not counted", code: "print(count_all(\"A-Level 2027!!\"))", expect: "{ LETTERS = 6, DIGITS = 4 }", hidden: true },
      { name: "returns a string", code: "r = count_all(\"ab1\")\nprint(type(r) == str, r)", expect: "True { LETTERS = 2, DIGITS = 1 }", hidden: true }
    ],
    hints: [
      "Keep two counters. For each character, `ch.isalpha()` is `True` for a letter and `ch.isdigit()` is `True` for a digit.",
      "Build the answer with concatenation: `\"{ LETTERS = \" + str(letters) + \", DIGITS = \" + str(digits) + \" }\"`. Watch the spaces inside the braces.",
      "If you use an f-string, braces must be doubled: `f\"{{ LETTERS = {letters}, DIGITS = {digits} }}\"`."
    ],
    solution: `def count_all(text):
    letters = 0
    digits = 0
    for ch in text:
        if ch.isalpha():
            letters = letters + 1
        elif ch.isdigit():
            digits = digits + 1
    return "{ LETTERS = " + str(letters) + ", DIGITS = " + str(digits) + " }"
`,
    explain: `**Approach.** One pass through the string with two counters, then build the result string.

**About the format.** The booklet's expected output is how C# prints an *anonymous type* (\`new { LETTERS = 10, DIGITS = 0 }\`). Python has no anonymous types, so we return that text exactly. In real Python you'd more naturally return a tuple \`(10, 0)\` or a dictionary \`{"LETTERS": 10, "DIGITS": 0}\`.

**Common mistakes**
- Missing the spaces just inside the braces: \`{LETTERS = 10, DIGITS = 0}\` doesn't match.
- Writing \`f"{ LETTERS = {letters} ...}"\`: in an f-string a single \`{\` starts an expression, so it's a syntax error. Double the literal braces (\`{{\` and \`}}\`) or use concatenation.
- Counting spaces as letters: \`"Hello World"\` has 11 characters but only 10 letters.`
  },
  {
    id: "bk-pangram",
    title: "Pangram checker (booklet)",
    topic: "1.4",
    difficulty: 2,
    task: `"The quick brown fox jumps over the lazy dog": note how all 26 letters of the English alphabet are used in the sentence. A sentence like this is called a **pangram**.

Write a program that takes a series of strings, one per line, and for each one prints \`True\` if it is a pangram or \`False\` if it is not.

- Keep reading lines until the user enters an **empty line**; then stop (print nothing for the empty line).
- Upper and lower case count as the same letter. Spaces, digits and punctuation are ignored.

\`\`\`text
> The quick brown fox jumps over the lazy dog
True
> Hello world
False
>
\`\`\`

(The \`> \` is the input prompt; prompts can be anything you like.)`,
    tests: [
      { name: "example from the question", input: "The quick brown fox jumps over the lazy dog\nHello world\n\n", expect: "True\nFalse" },
      { name: "upper case pangram", input: "PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS\n\n", expect: "True" },
      { name: "no sentences at all", input: "\n", expect: "" },
      { name: "one letter missing (no s)", input: "The quick brown fox jumped over the lazy dog\n\n", expect: "False", hidden: true },
      { name: "punctuation and digits ignored", input: "Sphinx of black quartz, judge my vow!\n12345\nabcdefghijklmnopqrstuvwxyz\n\n", expect: "True\nFalse\nTrue", hidden: true },
      { name: "letters repeated many times", input: "aaaa bbbb cccc\nHow vexingly quick daft zebras jump\n\n", expect: "False\nTrue", hidden: true }
    ],
    hints: [
      "Use a `while` loop: read a line before the loop, and read the next one at the end of the loop body. Stop when the line is `\"\"`.",
      "To test one sentence, convert it to lower case and check every letter of `\"abcdefghijklmnopqrstuvwxyz\"` is `in` it.",
      "As soon as one letter is missing it can't be a pangram, so you can stop checking."
    ],
    solution: `def is_pangram(sentence):
    sentence = sentence.lower()
    for letter in "abcdefghijklmnopqrstuvwxyz":
        if letter not in sentence:
            return False
    return True

line = input("> ")
while line != "":
    print(is_pangram(line))
    line = input("> ")
`,
    explain: `**Approach.** Loop over the 26 letters (not over the sentence) and check each one appears in the lower-cased sentence. Returning \`False\` at the first missing letter saves time.

**Reading until a blank line.** This is a *rogue value* (sentinel) loop: read once before the loop, process, then read again at the bottom. That way the empty line is never processed.

**Other ways.** \`set(sentence.lower()) >= set("abcdefghijklmnopqrstuvwxyz")\` uses set superset; or count the distinct letters and compare with 26 (being careful to ignore spaces and punctuation).

**Common mistakes**
- Counting the *length* of the sentence or the number of letters: a pangram can repeat letters.
- Forgetting the case conversion, so the capital \`T\` in "The" doesn't count as \`t\`.
- Printing \`true\` (lower case). Printing a Boolean in Python gives \`True\`/\`False\`.`
  },
  {
    id: "bk-ascii-subtract",
    title: "Subtract ASCII values (booklet)",
    topic: "5.6",
    difficulty: 1,
    task: `Create a program that takes two words, converts each one to an ASCII value, and subtracts the values from each other.

The "ASCII value" of a word is the **sum of the ASCII codes of its characters**. For example \`cat\` is 99 + 97 + 116 = 312.

- Ask for the first word, then the second word.
- Output three lines: each word's ASCII value, then the first value minus the second, exactly like this:

\`\`\`text
First word: cat
Second word: dog
cat = 312
dog = 314
Difference = -2
\`\`\`

The difference can be negative or zero. An empty word has the value 0.`,
    tests: [
      { name: "example from the question", input: "cat\ndog\n", expect: "cat = 312\ndog = 314\nDifference = -2" },
      { name: "positive difference", input: "Hello\nHi\n", expect: "Hello = 500\nHi = 177\nDifference = 323" },
      { name: "single letters: capital vs lower case", input: "A\na\n", expect: "A = 65\na = 97\nDifference = -32", hidden: true },
      { name: "same word", input: "abc\nabc\n", expect: "abc = 294\nabc = 294\nDifference = 0", hidden: true },
      { name: "capital letters have smaller codes", input: "Zebra\napple\n", expect: "Zebra = 500\napple = 530\nDifference = -30", hidden: true }
    ],
    hints: [
      "`ord(ch)` gives the character code of one character, e.g. `ord(\"a\")` is 97.",
      "Write a function `ascii_value(word)` that loops over the word adding up `ord(ch)`, then call it for both words."
    ],
    solution: `def ascii_value(word):
    total = 0
    for ch in word:
        total = total + ord(ch)
    return total

first = input("First word: ")
second = input("Second word: ")
value1 = ascii_value(first)
value2 = ascii_value(second)
print(first + " = " + str(value1))
print(second + " = " + str(value2))
print("Difference = " + str(value1 - value2))
`,
    explain: `**Approach.** \`ord()\` converts a character to its code (and \`chr()\` goes the other way). Summing the codes gives a number for the whole word; a function avoids writing the loop twice.

**Interpreting the booklet.** "Converts this to an ASCII value" is ambiguous for a word of several letters; adding the codes is the usual reading. Python strings actually hold Unicode, but for the characters on a keyboard the Unicode code point is the same as the ASCII code.

**Things to notice.** Capital letters (65–90) have smaller codes than lower case (97–122), so \`Zebra\` is worth less than \`apple\` even though \`Z\` comes later in the alphabet. That is also why \`"Zebra" < "apple"\` is \`True\` in Python.

**Common mistake.** \`print(first + " = " + value1)\` fails with a \`TypeError\`: convert numbers with \`str()\` before joining them to strings.`
  },
  {
    id: "bk-morse-code",
    title: "Morse code encoder (booklet)",
    topic: "1.4",
    difficulty: 2,
    task: `Create a program that asks the user to enter a string and encodes it into Morse code, using \`.\` and \`-\` notation.

- Put a **single space** between the codes for each character.
- Each space between words is replaced with the \`|\` (pipe) character, which is separated from the codes either side by a single space like any other character.
- Upper and lower case letters are encoded the same way.

You may assume the input contains only letters, digits and single spaces between words (no leading or trailing spaces). The table is in the starter code.

\`\`\`text
Enter a message: SOS
... --- ...
Enter a message: Hi Mum
.... .. | -- ..- --
\`\`\``,
    starter: `MORSE = {
    "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.",
    "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..",
    "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.",
    "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-",
    "Y": "-.--", "Z": "--..",
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
    "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----."
}

message = input("Enter a message: ")
`,
    tests: [
      { name: "SOS", input: "SOS\n", expect: "... --- ..." },
      { name: "two words, mixed case", input: "Hi Mum\n", expect: ".... .. | -- ..- --" },
      { name: "single letter", input: "e\n", expect: "." },
      { name: "digits", input: "007\n", expect: "----- ----- --...", hidden: true },
      { name: "three words", input: "A Level CS\n", expect: ".- | .-.. . ...- . .-.. | -.-. ...", hidden: true },
      { name: "all letters", input: "the quick brown fox jumps over the lazy dog\n", expect: "- .... . | --.- ..- .. -.-. -.- | -... .-. --- .-- -. | ..-. --- -..- | .--- ..- -- .--. ... | --- ...- . .-. | - .... . | .-.. .- --.. -.-- | -.. --- --.", hidden: true }
    ],
    hints: [
      "Convert the message to upper case first so you only need one dictionary entry per letter.",
      "Build a list of codes: for each character, append `\"|\"` if it's a space, otherwise `MORSE[ch]`.",
      "`\" \".join(codes)` puts exactly one space between the items, with none at the start or end."
    ],
    solution: `MORSE = {
    "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.",
    "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..",
    "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.",
    "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-",
    "Y": "-.--", "Z": "--..",
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
    "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----."
}

message = input("Enter a message: ")
codes = []
for ch in message.upper():
    if ch == " ":
        codes.append("|")
    else:
        codes.append(MORSE[ch])
print(" ".join(codes))
`,
    explain: `**Approach.** A dictionary maps each character to its code, so encoding is one lookup per character. Treat the space as just another "character" whose code is \`|\`, then join everything with single spaces.

**Why a dictionary?** Looking a key up in a dictionary (a hash table underneath) takes about the same time however many entries there are. The alternative, two parallel lists and a linear search, is slower and easier to get wrong.

**Reading the booklet's rule.** "Use a normal space for gaps between each character" and "spaces between words should be replaced with |" together give \`.... .. | -- ..- --\`: the word gap becomes \`|\` and it is spaced like any other symbol.

**Common mistakes**
- Building the string with \`result = result + code + " "\` leaves a trailing space. That would actually pass here (trailing spaces are ignored), but a leading space would not. \`join\` avoids both.
- Forgetting \`.upper()\`, which gives a \`KeyError\` for lower-case letters.`
  },
  {
    id: "bk-green-bottles",
    title: "Ten green bottles (booklet)",
    topic: "1.2",
    difficulty: 2,
    task: `Create a program that prints the lyrics to the song "Ten Green Bottles" **in as few lines of code as possible**: use a loop, not 40 \`print\` statements.

So that it can be tested, the program first asks how many bottles to start with: a whole number from 1 to 10 (you may assume the input is valid). Entering 10 prints the whole song.

Each verse has four lines, with **one blank line between verses**. Numbers are written in words, with a capital letter at the start of a line. Use \`bottle\` (singular) for one, and \`no green bottles\` at the end:

\`\`\`text
How many bottles? 2
Two green bottles hanging on the wall,
Two green bottles hanging on the wall,
And if one green bottle should accidentally fall,
There'll be one green bottle hanging on the wall.

One green bottle hanging on the wall,
One green bottle hanging on the wall,
And if one green bottle should accidentally fall,
There'll be no green bottles hanging on the wall.
\`\`\``,
    tests: [
      { name: "two bottles (example)", input: "2\n", expect: "Two green bottles hanging on the wall,\nTwo green bottles hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be one green bottle hanging on the wall.\n\nOne green bottle hanging on the wall,\nOne green bottle hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be no green bottles hanging on the wall." },
      { name: "the whole song (10)", input: "10\n", expect: "Ten green bottles hanging on the wall,\nTen green bottles hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be nine green bottles hanging on the wall.\n\nNine green bottles hanging on the wall,\nNine green bottles hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be eight green bottles hanging on the wall.\n\nEight green bottles hanging on the wall,\nEight green bottles hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be seven green bottles hanging on the wall.\n\nSeven green bottles hanging on the wall,\nSeven green bottles hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be six green bottles hanging on the wall.\n\nSix green bottles hanging on the wall,\nSix green bottles hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be five green bottles hanging on the wall.\n\nFive green bottles hanging on the wall,\nFive green bottles hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be four green bottles hanging on the wall.\n\nFour green bottles hanging on the wall,\nFour green bottles hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be three green bottles hanging on the wall.\n\nThree green bottles hanging on the wall,\nThree green bottles hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be two green bottles hanging on the wall.\n\nTwo green bottles hanging on the wall,\nTwo green bottles hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be one green bottle hanging on the wall.\n\nOne green bottle hanging on the wall,\nOne green bottle hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be no green bottles hanging on the wall." },
      { name: "one bottle", input: "1\n", expect: "One green bottle hanging on the wall,\nOne green bottle hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be no green bottles hanging on the wall.", hidden: true },
      { name: "three bottles", input: "3\n", expect: "Three green bottles hanging on the wall,\nThree green bottles hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be two green bottles hanging on the wall.\n\nTwo green bottles hanging on the wall,\nTwo green bottles hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be one green bottle hanging on the wall.\n\nOne green bottle hanging on the wall,\nOne green bottle hanging on the wall,\nAnd if one green bottle should accidentally fall,\nThere'll be no green bottles hanging on the wall.", hidden: true }
    ],
    hints: [
      "Store the number words in a list so that `words[n]` is the word for n: `[\"no\", \"one\", \"two\", ..., \"ten\"]`.",
      "Loop `for n in range(start, 0, -1):`. Each verse uses n and n − 1.",
      "Write a small function that returns `\"bottle\"` when the number is 1 and `\"bottles\"` otherwise. `.capitalize()` gives the capital letter at the start of a line.",
      "Print the blank line *before* every verse except the first, so there is no blank line at the very start."
    ],
    solution: `WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]

def bottles(n):
    if n == 1:
        return WORDS[n] + " green bottle"
    return WORDS[n] + " green bottles"

start = int(input("How many bottles? "))
for n in range(start, 0, -1):
    if n != start:
        print()
    line = bottles(n).capitalize() + " hanging on the wall,"
    print(line)
    print(line)
    print("And if one green bottle should accidentally fall,")
    print("There'll be " + bottles(n - 1) + " hanging on the wall.")
`,
    explain: `**Approach.** Everything that repeats goes in a loop counting down from the start number. A list of words turns a number into its name, and a small function handles the one awkward bit, the singular "bottle".

**Fewest lines of code.** The idea behind the booklet task is *iteration* and avoiding repetition: a song with 40 lines needs only a handful of statements. Very short "clever" one-liners are possible, but readable code with a loop and a helper function is what earns marks.

**Edge cases.** The last verse says "no green bottles" (plural with "no"), and the verses for 2 and 1 need "one green bottle". \`WORDS[0]\` being \`"no"\` handles the last line with no special case.

**Common mistakes**
- A blank line after every verse including the last is fine (trailing blank lines are ignored), but a blank line at the very start is not.
- \`"one".upper()\` gives \`ONE\`; you want \`.capitalize()\` (or \`word[0].upper() + word[1:]\`).`
  },
  {
    id: "bk-uncensor",
    title: "Uncensor a string (booklet)",
    topic: "1.4",
    difficulty: 1,
    task: `Someone has attempted to censor my strings by replacing every vowel with a \`*\`, l\\*k\\* th\\*s. Luckily, I've been able to find the vowels that were removed.

Write a **function** \`uncensor(text, vowels)\` that, given a censored string and a string of the censored vowels **in order**, **returns** the original uncensored string. The first \`*\` is replaced by the first vowel, the second \`*\` by the second, and so on.

You may assume the number of \`*\` characters equals the length of \`vowels\`.

Your code should only define the function. Examples:

\`\`\`python
print(uncensor("Wh*r* d*d my v*w*ls g*?", "eeioeo"))   # Where did my vowels go?
print(uncensor("abcd", ""))                            # abcd
print(uncensor("*PP*RC*S*", "UEAE"))                   # UPPERCASE
\`\`\``,
    starter: `def uncensor(text, vowels):
    return text
`,
    tests: [
      { name: "Where did my vowels go?", code: "print(uncensor(\"Wh*r* d*d my v*w*ls g*?\", \"eeioeo\"))", expect: "Where did my vowels go?" },
      { name: "nothing censored", code: "print(uncensor(\"abcd\", \"\"))", expect: "abcd" },
      { name: "UPPERCASE", code: "print(uncensor(\"*PP*RC*S*\", \"UEAE\"))", expect: "UPPERCASE" },
      { name: "every character censored", code: "print(uncensor(\"***\", \"aei\"))", expect: "aei", hidden: true },
      { name: "empty string", code: "print(repr(uncensor(\"\", \"\")))", expect: "''", hidden: true },
      { name: "longer sentence", code: "print(uncensor(\"Th* q**ck br*wn f*x j*mps *v*r th* l*zy d*g\", \"euioouoeeao\"))", expect: "The quick brown fox jumps over the lazy dog", hidden: true }
    ],
    hints: [
      "Keep an index into `vowels`, starting at 0.",
      "Loop over `text`. When the character is `*`, add `vowels[index]` to the result and add 1 to the index; otherwise add the character itself."
    ],
    solution: `def uncensor(text, vowels):
    result = ""
    index = 0
    for ch in text:
        if ch == "*":
            result = result + vowels[index]
            index = index + 1
        else:
            result = result + ch
    return result
`,
    explain: `**Approach.** Walk through the censored text with a second pointer into the vowel string. Each \`*\` consumes the next vowel.

**Why not \`replace\`?** \`text.replace("*", v, 1)\` in a loop over the vowels also works (the third argument replaces only the first match), but it rescans the string every time. One pass with an index is simpler to reason about and is what you'd write in pseudocode.

**Common mistakes**
- \`text.replace("*", vowels)\` puts the *whole* vowel string in place of every star.
- Using the position in \`text\` as the index into \`vowels\`: the two strings have different lengths, so you need a separate counter.`
  },
  {
    id: "bk-smooth-sentence",
    title: "Smooth sentences (booklet)",
    topic: "1.4",
    difficulty: 2,
    task: `Carlos is a huge fan of something he calls **smooth sentences**.

A smooth sentence is one where the last letter of each word is identical to the first letter of the following word. It is not case sensitive, so \`A\` is the same as \`a\`.

"Carlos swam masterfully" is a smooth sentence because "Carlos" ends with an "s" and "swam" begins with an "s", and "swam" ends with an "m" and "masterfully" begins with an "m".

Create a **function** \`IsSmooth(sentence)\` that **returns** \`True\` if the sentence is smooth and \`False\` if it is not. Words are separated by single spaces and contain only letters. A sentence of just one word counts as smooth.

Your code should only define the function. Examples:

\`\`\`python
print(IsSmooth("Marta appreciated deep perpendicular right trapezoids"))   # True
print(IsSmooth("Someone is outside the doorway"))                          # False
print(IsSmooth("She eats super righteously"))                              # True
\`\`\``,
    starter: `def IsSmooth(sentence):
    words = sentence.split(" ")

    return True
`,
    tests: [
      { name: "Marta appreciated...", code: "print(IsSmooth(\"Marta appreciated deep perpendicular right trapezoids\"))", expect: "True" },
      { name: "Someone is outside...", code: "print(IsSmooth(\"Someone is outside the doorway\"))", expect: "False" },
      { name: "She eats super righteously", code: "print(IsSmooth(\"She eats super righteously\"))", expect: "True" },
      { name: "Carlos swam masterfully (capital C, lower s)", code: "print(IsSmooth(\"Carlos swam masterfully\"))", expect: "True", hidden: true },
      { name: "case is ignored", code: "print(IsSmooth(\"TOP Pot TIGER rat\"))", expect: "True", hidden: true },
      { name: "only the last pair breaks it", code: "print(IsSmooth(\"Ted dances slowly yesterday\"))\nprint(IsSmooth(\"Ted dances slowly today\"))", expect: "True\nFalse", hidden: true },
      { name: "one word", code: "print(IsSmooth(\"Hello\"))", expect: "True", hidden: true },
      { name: "returns a Boolean", code: "print(type(IsSmooth(\"ab bc\")) == bool)", expect: "True", hidden: true }
    ],
    hints: [
      "Split the sentence into a list of words with `sentence.lower().split(\" \")`.",
      "Compare each word with the next one: `for i in range(len(words) - 1):` then `words[i][-1]` and `words[i + 1][0]`.",
      "Return `False` as soon as a pair doesn't match; return `True` after the loop."
    ],
    solution: `def IsSmooth(sentence):
    words = sentence.lower().split(" ")
    for i in range(len(words) - 1):
        if words[i][-1] != words[i + 1][0]:
            return False
    return True
`,
    explain: `**Approach.** Split into words, then check each *adjacent pair*: last letter of word i against first letter of word i + 1. A list of n words has n − 1 pairs, hence \`range(len(words) - 1)\`.

**Edge cases.** With one word the loop runs zero times and the function returns \`True\`. Lower-casing the whole sentence first deals with "Carlos" / "swam" type pairs.

**True vs true.** The booklet (written for C#) shows \`true\`/\`false\`. Python's Boolean values are \`True\` and \`False\`, and the function should return those values, not the strings \`"True"\` or \`"true"\`.

**Common mistakes**
- \`range(len(words))\` goes one too far: \`words[i + 1]\` raises an \`IndexError\` on the last word.
- Returning \`True\` inside the loop as soon as one pair matches, without checking the rest.`
  }
]);
