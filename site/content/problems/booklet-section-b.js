/* Python coding practice: A level Programming Booklet, Part 3 – A Level Section B
   Section B-style "write a new program" exercises from the class programming booklet,
   made precise enough to test automatically.
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "bk-bouncy-numbers",
    title: "Bouncy numbers (booklet)",
    topic: "P.6",
    difficulty: 2,
    task: `Write a program that gets the user to enter an integer. It should keep doing this until they enter a value **greater than 0** (just ask again, with no other output; you may assume whole numbers are entered).

The program should then tell the user if they have entered a **perfectly bouncy** number, a **bouncy** number or a number that is **not bouncy**.

- An **increasing** number is one where each digit is greater than or equal to the previous digit.
- A **decreasing** number is one where each digit is less than or equal to the previous digit.
- A **bouncy** number is a number that is not an increasing number and not a decreasing number.
- A **perfectly bouncy** number is a bouncy number in which the number of digits that are followed by a larger digit is equal to the number of digits that are followed by a smaller digit.

Output exactly one of these (with the number in place of \`n\`):
\`n is a perfectly bouncy number\`, \`n is a bouncy number\`, \`n is not a bouncy number\`.

Examples:
- 13578 is not a bouncy number because it is an increasing number.
- 973 is not a bouncy number because it is a decreasing number.
- 98657 is a bouncy number.
- 1111 is not a bouncy number because it is both an increasing number and a decreasing number.
- 13421 is a perfectly bouncy number as exactly two digits are followed by a larger digit and there are also exactly two digits followed by a smaller digit.
- 1829361 is a perfectly bouncy number (three and three).
- 13333331 is a perfectly bouncy number (one and one).

\`\`\`text
Enter a number: -5
Enter a number: 13421
13421 is a perfectly bouncy number
\`\`\``,
    tests: [
      { name: "13421 after an invalid entry", input: "-5\n13421\n", expect: "13421 is a perfectly bouncy number" },
      { name: "98657 is bouncy", input: "98657\n", expect: "98657 is a bouncy number" },
      { name: "13578 is increasing", input: "13578\n", expect: "13578 is not a bouncy number" },
      { name: "973 is decreasing", input: "973\n", expect: "973 is not a bouncy number", hidden: true },
      { name: "1111 is both", input: "1111\n", expect: "1111 is not a bouncy number", hidden: true },
      { name: "1829361", input: "1829361\n", expect: "1829361 is a perfectly bouncy number", hidden: true },
      { name: "13333331 (repeated digits)", input: "13333331\n", expect: "13333331 is a perfectly bouncy number", hidden: true },
      { name: "single digit after 0 and negatives", input: "0\n-100\n0\n7\n", expect: "7 is not a bouncy number", hidden: true },
      { name: "1210 is bouncy but not perfectly", input: "1210\n", expect: "1210 is a bouncy number", hidden: true },
      { name: "120 is perfectly bouncy", input: "120\n", expect: "120 is a perfectly bouncy number", hidden: true }
    ],
    hints: [
      "Validation loop: read a number, then `while number <= 0:` read it again.",
      "Turn the number into a string so you can look at its digits: compare `digits[i]` with `digits[i + 1]` for every `i` from 0 to `len(digits) - 2`.",
      "Count `ups` (digit followed by a larger one) and `downs` (followed by a smaller one). The number is increasing if `downs == 0` and decreasing if `ups == 0`.",
      "So: not bouncy if `ups == 0 or downs == 0`; otherwise perfectly bouncy if `ups == downs`, else bouncy."
    ],
    solution: `number = int(input("Enter a number: "))
while number <= 0:
    number = int(input("Enter a number: "))

digits = str(number)
ups = 0
downs = 0
for i in range(len(digits) - 1):
    if digits[i] < digits[i + 1]:
        ups = ups + 1
    elif digits[i] > digits[i + 1]:
        downs = downs + 1

if ups == 0 or downs == 0:
    print(str(number) + " is not a bouncy number")
elif ups == downs:
    print(str(number) + " is a perfectly bouncy number")
else:
    print(str(number) + " is a bouncy number")
`,
    explain: `**Approach.** One pass over adjacent pairs of digits gives two counts: \`ups\` and \`downs\` (equal neighbours count as neither). Everything follows from those:
- increasing ⇔ no downs; decreasing ⇔ no ups
- bouncy ⇔ at least one up **and** at least one down
- perfectly bouncy ⇔ bouncy and \`ups == downs\`.

**Comparing digit characters.** \`"3" < "7"\` compares character codes, which are in the same order as the digit values, so there's no need to convert each digit with \`int()\` (though doing so is fine).

**Edge cases.** A single digit has no pairs, so \`ups == downs == 0\` and it is not bouncy. 1111 is likewise not bouncy. 13333331 is perfectly bouncy because the run of 3s adds nothing to either count.

**Common mistakes**
- Checking \`ups == downs\` first: 1111 has 0 ups and 0 downs and would be reported as perfectly bouncy.
- Treating "greater than or equal" as "greater than" in the increasing test, so 1111 or 13333331 are misclassified.
- Looping to \`len(digits)\` instead of \`len(digits) - 1\` (\`IndexError\` on \`digits[i + 1]\`).`
  },
  {
    id: "bk-valid-string",
    title: "Valid string checker (booklet)",
    topic: "P.6",
    difficulty: 2,
    task: `Write a program that gets the user to enter a string. It should keep getting the user to enter a string until they enter a valid string. Each time they enter a string, output \`String is valid\` or \`String is not valid\`.

For a string to be valid:
- it must be between **five and seven** characters in length (inclusive)
- it must consist only of **uppercase letters** (A–Z)
- it must contain only **unique** characters (no character appears in the string more than once)
- the **sum of the ASCII codes** of the characters in the string must be between **420 and 600** (inclusive).

\`\`\`text
Enter a string: ABCDE
String is not valid
Enter a string: VWXYZ
String is valid
\`\`\`

(\`ABCDE\` breaks only the last rule: 65 + 66 + 67 + 68 + 69 = 335.)`,
    tests: [
      { name: "example from the question", input: "ABCDE\nVWXYZ\n", expect: "String is not valid\nString is valid" },
      { name: "valid first time (sum exactly 420)", input: "RSTUV\n", expect: "String is valid" },
      { name: "too short, then too long", input: "TUVW\nTUVWXYZA\nTUVWX\n", expect: "String is not valid\nString is not valid\nString is valid" },
      { name: "lower case and a digit", input: "tuvwx\nTUV1X\nTUVWX\n", expect: "String is not valid\nString is not valid\nString is valid", hidden: true },
      { name: "repeated letter", input: "TUVWW\nZYXWV\n", expect: "String is not valid\nString is valid", hidden: true },
      { name: "sums just outside 420 and 600", input: "QRSTU\nSTUVWXY\nRSTUVWX\n", expect: "String is not valid\nString is not valid\nString is valid", hidden: true },
      { name: "empty string and spaces", input: "\nTU VWX\nZYXWVUT\nAZYXWVU\n", expect: "String is not valid\nString is not valid\nString is not valid\nString is valid", hidden: true }
    ],
    hints: [
      "Write a function `is_valid(s)` that returns `False` as soon as any rule is broken, and `True` at the end.",
      "Upper-case letters only: check **each character** with `\"A\" <= ch <= \"Z\"`. Don't use `s.isupper()` on the whole string: `\"TUV1X\".isupper()` is `True`.",
      "Unique characters: for each character, `s.count(ch)` must be 1. Or compare `len(set(s))` with `len(s)`.",
      "ASCII sum: add up `ord(ch)` for every character."
    ],
    solution: `def is_valid(s):
    if len(s) < 5 or len(s) > 7:
        return False
    total = 0
    for ch in s:
        if ch < "A" or ch > "Z":
            return False
        if s.count(ch) > 1:
            return False
        total = total + ord(ch)
    return 420 <= total <= 600

valid = False
while not valid:
    s = input("Enter a string: ")
    valid = is_valid(s)
    if valid:
        print("String is valid")
    else:
        print("String is not valid")
`,
    explain: `**Approach.** Put the four rules in a Boolean function and loop until it returns \`True\`, printing a message every time. Checking the length first means the other loops never run on a silly-length string.

**Boundary values.** The tests use the edges of each range, which is exactly what you should do in your own testing (and what Section B evidence asks for): 4, 5, 7 and 8 characters; sums of 415, 420, 595 and 602. \`RSTUV\` sums to exactly 420 and is valid; \`QRSTU\` sums to 415 and isn't.

**Upper-case check.** \`ch.isupper()\` is \`True\` only for upper-case letters, so it also works, but \`s.isupper()\` on the *whole* string is a trap: \`"TUV1X".isupper()\` is \`True\` because it only needs at least one cased character and no lower-case ones.

**Common mistakes**
- Using \`<\` instead of \`<=\` at the boundaries.
- Printing the message once after the loop instead of for every attempt.
- Forgetting that the empty string must be rejected (the length rule does this).`
  },
  {
    id: "bk-swap-vowels",
    title: "Reverse the vowels (booklet)",
    topic: "P.6",
    difficulty: 2,
    task: `Write a program that asks the user to enter a string. It should then change the order of the vowels in the string and display the result.

If there are n vowels in the string, the 1st vowel should swap with the nth vowel, the 2nd vowel should swap with the (n−1)th vowel, and so on. The letters a, e, i, o and u are the only vowels. You may assume the string will only contain lowercase letters.

Output just the new string.

Examples:
- \`horse\` → \`herso\`
- \`goose\` → \`geoso\`
- \`pinkfairyarmadillo\` → \`ponkfiaryarmidalli\`
- \`nakedmolerat\` → \`nakedmolerat\`
- \`lynx\` → \`lynx\`
- \`pig\` → \`pig\`

\`\`\`text
Enter a string: horse
herso
\`\`\``,
    tests: [
      { name: "horse", input: "horse\n", expect: "herso" },
      { name: "goose", input: "goose\n", expect: "geoso" },
      { name: "pinkfairyarmadillo", input: "pinkfairyarmadillo\n", expect: "ponkfiaryarmidalli" },
      { name: "nakedmolerat (vowels are a palindrome)", input: "nakedmolerat\n", expect: "nakedmolerat", hidden: true },
      { name: "lynx (no vowels)", input: "lynx\n", expect: "lynx", hidden: true },
      { name: "pig (one vowel)", input: "pig\n", expect: "pig", hidden: true },
      { name: "all vowels", input: "aeiou\n", expect: "uoiea", hidden: true },
      { name: "queueing", input: "queueing\n", expect: "qieueung", hidden: true }
    ],
    hints: [
      "First collect the vowels in order into a list: for `horse` that's `[\"o\", \"e\"]`.",
      "Then build the result: go through the string again and, every time you meet a vowel, use the vowels from the **end** of the list instead (`vowels.pop()` removes and returns the last one).",
      "Or use two pointers, one from each end, that move inwards to the next vowel and swap (convert the string to a list first, since strings can't be changed)."
    ],
    solution: `text = input("Enter a string: ")
vowels = []
for ch in text:
    if ch in "aeiou":
        vowels.append(ch)

result = ""
for ch in text:
    if ch in "aeiou":
        result = result + vowels.pop()
    else:
        result = result + ch
print(result)
`,
    explain: `**Approach.** Swapping the 1st with the nth vowel, the 2nd with the (n−1)th and so on is the same as **reversing the order of the vowels** while leaving the consonants in place. So collect the vowels, then put them back in reverse order. \`pop()\` takes from the end of the list, which is exactly the reverse order (the list is being used as a stack).

**Two-pointer version** (closer to the wording of the question):
\`\`\`python
chars = list(text)
left, right = 0, len(chars) - 1
while left < right:
    if chars[left] not in "aeiou":
        left += 1
    elif chars[right] not in "aeiou":
        right -= 1
    else:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
print("".join(chars))
\`\`\`

**Edge cases.** No vowels or a single vowel gives the string unchanged; an odd number of vowels leaves the middle one where it is.

**Common mistake.** Swapping all the way through instead of stopping half way, which swaps every pair twice and gives back the original string.`
  },
  {
    id: "bk-harshad-numbers",
    title: "The nth Harshad number (booklet)",
    topic: "P.6",
    difficulty: 2,
    task: `A **Harshad number** is a positive integer which is exactly divisible by the sum of its digits. The first twelve Harshad numbers are 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12 and 18.

- 36 is a Harshad number. The digits of 36 are 3 and 6; their sum is 9 and 36 is exactly divisible by 9 (36 ÷ 9 = 4).
- 300 is a Harshad number. The sum of its digits is 3 and 300 is exactly divisible by 3.
- 15 is not a Harshad number. The sum of its digits is 6 and 15 is not exactly divisible by 6.

Write a program that asks the user to enter a number, n, and then calculates and displays the **nth** Harshad number (just the number). You may assume n is a whole number of at least 1.

\`\`\`text
Enter n: 12
18
\`\`\``,
    tests: [
      { name: "12th is 18", input: "12\n", expect: "18" },
      { name: "1st is 1", input: "1\n", expect: "1" },
      { name: "13th is 20", input: "13\n", expect: "20" },
      { name: "10th is 10", input: "10\n", expect: "10", hidden: true },
      { name: "50th", input: "50\n", expect: "153", hidden: true },
      { name: "100th", input: "100\n", expect: "372", hidden: true },
      { name: "1000th", input: "1000\n", expect: "5652", hidden: true }
    ],
    hints: [
      "Write a function `digit_sum(k)` that adds up the digits of `k` (for example by looping over `str(k)`).",
      "Count upwards from 1 with a variable `k`. Each time `k % digit_sum(k) == 0`, add 1 to a counter.",
      "Stop when the counter reaches n; `k` is then the answer."
    ],
    solution: `def digit_sum(k):
    total = 0
    for digit in str(k):
        total = total + int(digit)
    return total

n = int(input("Enter n: "))
count = 0
k = 0
while count < n:
    k = k + 1
    if k % digit_sum(k) == 0:
        count = count + 1
print(k)
`,
    explain: `**Approach.** There's no formula for Harshad numbers, so test the positive integers one at a time, counting the ones that pass, until you have found n of them.

**Loop design.** Increment \`k\` *at the start* of the loop body: when the loop ends, \`k\` is the number that made the count reach n. If you increment at the end instead, \`k\` is one too big and you'd need to subtract 1.

**Digit sum.** Either loop over \`str(k)\` and add \`int(digit)\`, or use arithmetic: \`k % 10\` is the last digit and \`k // 10\` removes it.

**Common mistakes**
- Off-by-one: printing the count, or \`k + 1\`.
- Starting \`k\` at 0 and testing it: \`0 % 0\` raises \`ZeroDivisionError\`.`
  }
]);
