/* Python coding practice: subroutines, functions and recursion
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "is-prime",
    title: "Prime number function",
    topic: "1.5",
    difficulty: 1,
    task: `Write a **function** \`is_prime(n)\` that **returns** \`True\` if the whole number \`n\` is prime and \`False\` otherwise.

A prime number has exactly two factors: 1 and itself. So 2, 3, 5, 7 are prime; 0, 1 and negative numbers are not.

Your code should only define the function: no \`input()\` and no \`print()\`. The tests call your function, for example:

\`\`\`python
print(is_prime(7))     # True
print(is_prime(9))     # False
\`\`\``,
    starter: `def is_prime(n):
    return False
`,
    tests: [
      { name: "7 is prime", code: "print(is_prime(7))", expect: "True" },
      { name: "9 is not prime", code: "print(is_prime(9))", expect: "False" },
      { name: "2 is the smallest prime", code: "print(is_prime(2))", expect: "True" },
      { name: "1 is not prime", code: "print(is_prime(1))", expect: "False", hidden: true },
      { name: "0 and negatives", code: "print(is_prime(0))\nprint(is_prime(-7))", expect: "False\nFalse", hidden: true },
      { name: "square of a prime", code: "print(is_prime(25))", expect: "False", hidden: true },
      { name: "7 x 13", code: "print(is_prime(91))", expect: "False", hidden: true },
      { name: "primes below 30", code: "print([n for n in range(30) if is_prime(n)])", expect: "[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]", hidden: true }
    ],
    hints: [
      "Deal with `n < 2` first: return `False`.",
      "Try every divisor `d` from 2 upwards. If `n % d == 0`, return `False` straight away.",
      "You only need to try divisors while `d * d <= n`. If none divide, return `True` after the loop."
    ],
    solution: `def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d = d + 1
    return True
`,
    explain: `**Approach.** Trial division. Any factor bigger than √n pairs with one smaller than √n, so checking divisors up to √n is enough: \`while d * d <= n\`. Return \`False\` as soon as a divisor is found and \`True\` only after the loop has checked them all.

**Function vs procedure.** A *function* returns a value to the calling routine; it doesn't print it. That makes it reusable: the last test builds a list of primes with your function. If your function printed \`True\`, the caller would get \`None\` back.

**Common mistakes**
- Returning \`True\` inside the loop as soon as one divisor fails (\`else: return True\`), so 9 is reported prime after only testing 2.
- Forgetting 0, 1 and negatives.
- \`while d * d < n\` (strict) wrongly says 25 is prime.`
  },
  {
    id: "recursive-factorial",
    title: "Recursive factorial",
    topic: "1.6",
    difficulty: 1,
    task: `The factorial of a whole number n ≥ 0 is n! = n × (n − 1) × … × 2 × 1, and 0! = 1.

Write a **recursive** function \`factorial(n)\` that returns n!. It must call itself; one of the tests checks this.

Your code should only define the function. Example calls:

\`\`\`python
print(factorial(5))    # 120
print(factorial(0))    # 1
\`\`\``,
    starter: `def factorial(n):
    # base case: when can you answer straight away?

    # general case: call factorial with a smaller value
    pass
`,
    tests: [
      { name: "5!", code: "print(factorial(5))", expect: "120" },
      { name: "0! is 1 (base case)", code: "print(factorial(0))", expect: "1" },
      { name: "1!", code: "print(factorial(1))", expect: "1", hidden: true },
      { name: "20! (big integer)", code: "print(factorial(20))", expect: "2432902008176640000", hidden: true },
      { name: "the function is recursive", code: "calls = 0\n_original = factorial\ndef factorial(*args):\n    global calls\n    calls = calls + 1\n    return _original(*args)\n_original(4)\nprint(\"recursive\" if calls > 0 else \"not recursive: the function never calls itself\")", expect: "recursive", hidden: true }
    ],
    hints: [
      "Base case: if `n == 0`, return 1.",
      "General case: `return n * factorial(n - 1)`."
    ],
    solution: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)
`,
    explain: `**Approach.** A recursive subroutine needs a **base case** that returns without recursing (0! = 1) and a **general case** that calls itself with a value *closer to the base case* (n! = n × (n − 1)!).

**How it runs.** \`factorial(3)\` pushes a stack frame and calls \`factorial(2)\`, which calls \`factorial(1)\`, which calls \`factorial(0)\` → 1. Then the frames unwind: 1 × 1 = 1, 2 × 1 = 2, 3 × 2 = 6. Each frame stores its own \`n\` and its return address.

**Common mistakes**
- No base case (or one that is never reached, e.g. a negative argument) → infinite recursion → *stack overflow* (\`RecursionError\` in Python).
- \`return n * factorial(n)\` — doesn't move towards the base case.
- Printing inside the function instead of returning.

**How the hidden test checks recursion.** It wraps your function so every call through the name \`factorial\` is counted. A loop version makes no such calls.`
  },
  {
    id: "towers-of-hanoi",
    title: "Towers of Hanoi",
    topic: "1.6",
    difficulty: 3,
    task: `In the Towers of Hanoi puzzle, n discs (1 = smallest) start on peg \`A\` and must be moved to peg \`C\`, using \`B\` as a spare. Only one disc moves at a time and a bigger disc may never go on a smaller one.

Write a program with a **recursive** subroutine that solves the puzzle:

- Ask for the number of discs (prompt \`Number of discs: \`). It must be a whole number from 1 to 8; otherwise output \`Enter a number from 1 to 8\` and ask again (you may assume whole numbers are entered).
- Output every move as \`Move disc <d> from <peg> to <peg>\`, in order.
- Finally output \`Total moves: <m>\`.

Use the standard recursive solution: to move n discs from source to target, move n − 1 discs from source to spare, move disc n from source to target, then move n − 1 discs from spare to target.

\`\`\`text
Number of discs: 2
Move disc 1 from A to B
Move disc 2 from A to C
Move disc 1 from B to C
Total moves: 3
\`\`\``,
    tests: [
      { name: "example from the question", input: "2\n", expect: "Move disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nTotal moves: 3" },
      { name: "one disc", input: "1\n", expect: "Move disc 1 from A to C\nTotal moves: 1" },
      { name: "three discs", input: "3\n", expect: "Move disc 1 from A to C\nMove disc 2 from A to B\nMove disc 1 from C to B\nMove disc 3 from A to C\nMove disc 1 from B to A\nMove disc 2 from B to C\nMove disc 1 from A to C\nTotal moves: 7" },
      { name: "validation", input: "0\n9\n2\n", expect: "Enter a number from 1 to 8\nEnter a number from 1 to 8\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nTotal moves: 3", hidden: true },
      { name: "four discs", input: "4\n", expect: "Move disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 3 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 4 from A to C\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 3 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nTotal moves: 15", hidden: true },
      { name: "eight discs", input: "8\n", expect: "Move disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 3 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 4 from A to C\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 3 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 5 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 3 from C to A\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 4 from C to B\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 3 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 6 from A to C\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 3 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 4 from B to A\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 3 from C to A\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 5 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 3 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 4 from A to C\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 3 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 7 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 3 from C to A\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 4 from C to B\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 3 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 5 from C to A\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 3 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 4 from B to A\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 3 from C to A\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 6 from C to B\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 3 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 4 from A to C\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 3 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 5 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 3 from C to A\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 4 from C to B\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 3 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 8 from A to C\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 3 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 4 from B to A\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 3 from C to A\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 5 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 3 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 4 from A to C\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 3 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 6 from B to A\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 3 from C to A\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 4 from C to B\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 3 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 5 from C to A\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 3 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 4 from B to A\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 3 from C to A\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 7 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 3 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 4 from A to C\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 3 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 5 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 3 from C to A\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 4 from C to B\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 3 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 6 from A to C\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 3 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 4 from B to A\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 3 from C to A\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 5 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nMove disc 3 from A to B\nMove disc 1 from C to A\nMove disc 2 from C to B\nMove disc 1 from A to B\nMove disc 4 from A to C\nMove disc 1 from B to C\nMove disc 2 from B to A\nMove disc 1 from C to A\nMove disc 3 from B to C\nMove disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nTotal moves: 255", hidden: true }
    ],
    hints: [
      "Define `hanoi(n, source, target, spare)`. Base case: `n == 0` does nothing.",
      "General case: `hanoi(n - 1, source, spare, target)`, print the move of disc `n`, then `hanoi(n - 1, spare, target, source)`.",
      "Count the moves by having `hanoi` **return** how many moves it made (0 for the base case, otherwise both recursive counts + 1)."
    ],
    solution: `def hanoi(n, source, target, spare):
    if n == 0:
        return 0
    moves = hanoi(n - 1, source, spare, target)
    print("Move disc " + str(n) + " from " + source + " to " + target)
    moves = moves + 1
    moves = moves + hanoi(n - 1, spare, target, source)
    return moves


discs = int(input("Number of discs: "))
while discs < 1 or discs > 8:
    print("Enter a number from 1 to 8")
    discs = int(input("Number of discs: "))
total = hanoi(discs, "A", "C", "B")
print("Total moves: " + str(total))
`,
    explain: `**Why recursion fits.** To move the biggest disc, everything above it must first be out of the way on the spare peg. That's the *same* problem with one fewer disc, just with the pegs' roles swapped, which is exactly what a recursive call does.

**Counting moves.** Returning the count from each call avoids a global variable: moves(n) = moves(n − 1) + 1 + moves(n − 1) = 2ⁿ − 1. So 8 discs need 255 moves and 64 discs would need about 1.8 × 10¹⁹, an exponential-time O(2ⁿ) algorithm.

**Common mistakes**
- Passing the pegs in the wrong order in one of the recursive calls (outputs look plausible but break the rules: trace n = 2 to check).
- A base case of \`n == 1\` that prints but forgets to return 1, so the total is wrong.

**Exam link.** Each call adds a stack frame holding \`n\`, the three pegs and the return address; the maximum depth here is n + 1 frames.`
  },
  {
    id: "permutations",
    title: "All permutations (recursion)",
    topic: "1.6",
    difficulty: 3,
    task: `Write a program that outputs every arrangement (permutation) of some letters.

- Ask for the letters (prompt \`Enter some letters: \`). They must be 1 to 6 lower-case letters, **all different**. Otherwise output \`Enter 1 to 6 different letters\` and ask again.
- Output every permutation, one per line, in **alphabetical order**, then \`Total: <n>\`.

Use a **recursive** subroutine. Do **not** use \`itertools\`.

\`\`\`text
Enter some letters: cba
abc
acb
bac
bca
cab
cba
Total: 6
\`\`\``,
    tests: [
      { name: "example from the question", input: "cba\n", expect: "abc\nacb\nbac\nbca\ncab\ncba\nTotal: 6" },
      { name: "two letters", input: "ba\n", expect: "ab\nba\nTotal: 2" },
      { name: "one letter", input: "z\n", expect: "z\nTotal: 1", hidden: true },
      { name: "validation: repeats, empty, too long", input: "aab\n\nabcdefg\ncat\n", expect: "Enter 1 to 6 different letters\nEnter 1 to 6 different letters\nEnter 1 to 6 different letters\nact\natc\ncat\ncta\ntac\ntca\nTotal: 6", hidden: true },
      { name: "four letters", input: "dcba\n", expect: "abcd\nabdc\nacbd\nacdb\nadbc\nadcb\nbacd\nbadc\nbcad\nbcda\nbdac\nbdca\ncabd\ncadb\ncbad\ncbda\ncdab\ncdba\ndabc\ndacb\ndbac\ndbca\ndcab\ndcba\nTotal: 24", hidden: true },
      { name: "six letters gives 720", input: "fedcba\n", expect: "abcdef\nabcdfe\nabcedf\nabcefd\nabcfde\nabcfed\nabdcef\nabdcfe\nabdecf\nabdefc\nabdfce\nabdfec\nabecdf\nabecfd\nabedcf\nabedfc\nabefcd\nabefdc\nabfcde\nabfced\nabfdce\nabfdec\nabfecd\nabfedc\nacbdef\nacbdfe\nacbedf\nacbefd\nacbfde\nacbfed\nacdbef\nacdbfe\nacdebf\nacdefb\nacdfbe\nacdfeb\nacebdf\nacebfd\nacedbf\nacedfb\nacefbd\nacefdb\nacfbde\nacfbed\nacfdbe\nacfdeb\nacfebd\nacfedb\nadbcef\nadbcfe\nadbecf\nadbefc\nadbfce\nadbfec\nadcbef\nadcbfe\nadcebf\nadcefb\nadcfbe\nadcfeb\nadebcf\nadebfc\nadecbf\nadecfb\nadefbc\nadefcb\nadfbce\nadfbec\nadfcbe\nadfceb\nadfebc\nadfecb\naebcdf\naebcfd\naebdcf\naebdfc\naebfcd\naebfdc\naecbdf\naecbfd\naecdbf\naecdfb\naecfbd\naecfdb\naedbcf\naedbfc\naedcbf\naedcfb\naedfbc\naedfcb\naefbcd\naefbdc\naefcbd\naefcdb\naefdbc\naefdcb\nafbcde\nafbced\nafbdce\nafbdec\nafbecd\nafbedc\nafcbde\nafcbed\nafcdbe\nafcdeb\nafcebd\nafcedb\nafdbce\nafdbec\nafdcbe\nafdceb\nafdebc\nafdecb\nafebcd\nafebdc\nafecbd\nafecdb\nafedbc\nafedcb\nbacdef\nbacdfe\nbacedf\nbacefd\nbacfde\nbacfed\nbadcef\nbadcfe\nbadecf\nbadefc\nbadfce\nbadfec\nbaecdf\nbaecfd\nbaedcf\nbaedfc\nbaefcd\nbaefdc\nbafcde\nbafced\nbafdce\nbafdec\nbafecd\nbafedc\nbcadef\nbcadfe\nbcaedf\nbcaefd\nbcafde\nbcafed\nbcdaef\nbcdafe\nbcdeaf\nbcdefa\nbcdfae\nbcdfea\nbceadf\nbceafd\nbcedaf\nbcedfa\nbcefad\nbcefda\nbcfade\nbcfaed\nbcfdae\nbcfdea\nbcfead\nbcfeda\nbdacef\nbdacfe\nbdaecf\nbdaefc\nbdafce\nbdafec\nbdcaef\nbdcafe\nbdceaf\nbdcefa\nbdcfae\nbdcfea\nbdeacf\nbdeafc\nbdecaf\nbdecfa\nbdefac\nbdefca\nbdface\nbdfaec\nbdfcae\nbdfcea\nbdfeac\nbdfeca\nbeacdf\nbeacfd\nbeadcf\nbeadfc\nbeafcd\nbeafdc\nbecadf\nbecafd\nbecdaf\nbecdfa\nbecfad\nbecfda\nbedacf\nbedafc\nbedcaf\nbedcfa\nbedfac\nbedfca\nbefacd\nbefadc\nbefcad\nbefcda\nbefdac\nbefdca\nbfacde\nbfaced\nbfadce\nbfadec\nbfaecd\nbfaedc\nbfcade\nbfcaed\nbfcdae\nbfcdea\nbfcead\nbfceda\nbfdace\nbfdaec\nbfdcae\nbfdcea\nbfdeac\nbfdeca\nbfeacd\nbfeadc\nbfecad\nbfecda\nbfedac\nbfedca\ncabdef\ncabdfe\ncabedf\ncabefd\ncabfde\ncabfed\ncadbef\ncadbfe\ncadebf\ncadefb\ncadfbe\ncadfeb\ncaebdf\ncaebfd\ncaedbf\ncaedfb\ncaefbd\ncaefdb\ncafbde\ncafbed\ncafdbe\ncafdeb\ncafebd\ncafedb\ncbadef\ncbadfe\ncbaedf\ncbaefd\ncbafde\ncbafed\ncbdaef\ncbdafe\ncbdeaf\ncbdefa\ncbdfae\ncbdfea\ncbeadf\ncbeafd\ncbedaf\ncbedfa\ncbefad\ncbefda\ncbfade\ncbfaed\ncbfdae\ncbfdea\ncbfead\ncbfeda\ncdabef\ncdabfe\ncdaebf\ncdaefb\ncdafbe\ncdafeb\ncdbaef\ncdbafe\ncdbeaf\ncdbefa\ncdbfae\ncdbfea\ncdeabf\ncdeafb\ncdebaf\ncdebfa\ncdefab\ncdefba\ncdfabe\ncdfaeb\ncdfbae\ncdfbea\ncdfeab\ncdfeba\nceabdf\nceabfd\nceadbf\nceadfb\nceafbd\nceafdb\ncebadf\ncebafd\ncebdaf\ncebdfa\ncebfad\ncebfda\ncedabf\ncedafb\ncedbaf\ncedbfa\ncedfab\ncedfba\ncefabd\ncefadb\ncefbad\ncefbda\ncefdab\ncefdba\ncfabde\ncfabed\ncfadbe\ncfadeb\ncfaebd\ncfaedb\ncfbade\ncfbaed\ncfbdae\ncfbdea\ncfbead\ncfbeda\ncfdabe\ncfdaeb\ncfdbae\ncfdbea\ncfdeab\ncfdeba\ncfeabd\ncfeadb\ncfebad\ncfebda\ncfedab\ncfedba\ndabcef\ndabcfe\ndabecf\ndabefc\ndabfce\ndabfec\ndacbef\ndacbfe\ndacebf\ndacefb\ndacfbe\ndacfeb\ndaebcf\ndaebfc\ndaecbf\ndaecfb\ndaefbc\ndaefcb\ndafbce\ndafbec\ndafcbe\ndafceb\ndafebc\ndafecb\ndbacef\ndbacfe\ndbaecf\ndbaefc\ndbafce\ndbafec\ndbcaef\ndbcafe\ndbceaf\ndbcefa\ndbcfae\ndbcfea\ndbeacf\ndbeafc\ndbecaf\ndbecfa\ndbefac\ndbefca\ndbface\ndbfaec\ndbfcae\ndbfcea\ndbfeac\ndbfeca\ndcabef\ndcabfe\ndcaebf\ndcaefb\ndcafbe\ndcafeb\ndcbaef\ndcbafe\ndcbeaf\ndcbefa\ndcbfae\ndcbfea\ndceabf\ndceafb\ndcebaf\ndcebfa\ndcefab\ndcefba\ndcfabe\ndcfaeb\ndcfbae\ndcfbea\ndcfeab\ndcfeba\ndeabcf\ndeabfc\ndeacbf\ndeacfb\ndeafbc\ndeafcb\ndebacf\ndebafc\ndebcaf\ndebcfa\ndebfac\ndebfca\ndecabf\ndecafb\ndecbaf\ndecbfa\ndecfab\ndecfba\ndefabc\ndefacb\ndefbac\ndefbca\ndefcab\ndefcba\ndfabce\ndfabec\ndfacbe\ndfaceb\ndfaebc\ndfaecb\ndfbace\ndfbaec\ndfbcae\ndfbcea\ndfbeac\ndfbeca\ndfcabe\ndfcaeb\ndfcbae\ndfcbea\ndfceab\ndfceba\ndfeabc\ndfeacb\ndfebac\ndfebca\ndfecab\ndfecba\neabcdf\neabcfd\neabdcf\neabdfc\neabfcd\neabfdc\neacbdf\neacbfd\neacdbf\neacdfb\neacfbd\neacfdb\neadbcf\neadbfc\neadcbf\neadcfb\neadfbc\neadfcb\neafbcd\neafbdc\neafcbd\neafcdb\neafdbc\neafdcb\nebacdf\nebacfd\nebadcf\nebadfc\nebafcd\nebafdc\nebcadf\nebcafd\nebcdaf\nebcdfa\nebcfad\nebcfda\nebdacf\nebdafc\nebdcaf\nebdcfa\nebdfac\nebdfca\nebfacd\nebfadc\nebfcad\nebfcda\nebfdac\nebfdca\necabdf\necabfd\necadbf\necadfb\necafbd\necafdb\necbadf\necbafd\necbdaf\necbdfa\necbfad\necbfda\necdabf\necdafb\necdbaf\necdbfa\necdfab\necdfba\necfabd\necfadb\necfbad\necfbda\necfdab\necfdba\nedabcf\nedabfc\nedacbf\nedacfb\nedafbc\nedafcb\nedbacf\nedbafc\nedbcaf\nedbcfa\nedbfac\nedbfca\nedcabf\nedcafb\nedcbaf\nedcbfa\nedcfab\nedcfba\nedfabc\nedfacb\nedfbac\nedfbca\nedfcab\nedfcba\nefabcd\nefabdc\nefacbd\nefacdb\nefadbc\nefadcb\nefbacd\nefbadc\nefbcad\nefbcda\nefbdac\nefbdca\nefcabd\nefcadb\nefcbad\nefcbda\nefcdab\nefcdba\nefdabc\nefdacb\nefdbac\nefdbca\nefdcab\nefdcba\nfabcde\nfabced\nfabdce\nfabdec\nfabecd\nfabedc\nfacbde\nfacbed\nfacdbe\nfacdeb\nfacebd\nfacedb\nfadbce\nfadbec\nfadcbe\nfadceb\nfadebc\nfadecb\nfaebcd\nfaebdc\nfaecbd\nfaecdb\nfaedbc\nfaedcb\nfbacde\nfbaced\nfbadce\nfbadec\nfbaecd\nfbaedc\nfbcade\nfbcaed\nfbcdae\nfbcdea\nfbcead\nfbceda\nfbdace\nfbdaec\nfbdcae\nfbdcea\nfbdeac\nfbdeca\nfbeacd\nfbeadc\nfbecad\nfbecda\nfbedac\nfbedca\nfcabde\nfcabed\nfcadbe\nfcadeb\nfcaebd\nfcaedb\nfcbade\nfcbaed\nfcbdae\nfcbdea\nfcbead\nfcbeda\nfcdabe\nfcdaeb\nfcdbae\nfcdbea\nfcdeab\nfcdeba\nfceabd\nfceadb\nfcebad\nfcebda\nfcedab\nfcedba\nfdabce\nfdabec\nfdacbe\nfdaceb\nfdaebc\nfdaecb\nfdbace\nfdbaec\nfdbcae\nfdbcea\nfdbeac\nfdbeca\nfdcabe\nfdcaeb\nfdcbae\nfdcbea\nfdceab\nfdceba\nfdeabc\nfdeacb\nfdebac\nfdebca\nfdecab\nfdecba\nfeabcd\nfeabdc\nfeacbd\nfeacdb\nfeadbc\nfeadcb\nfebacd\nfebadc\nfebcad\nfebcda\nfebdac\nfebdca\nfecabd\nfecadb\nfecbad\nfecbda\nfecdab\nfecdba\nfedabc\nfedacb\nfedbac\nfedbca\nfedcab\nfedcba\nTotal: 720", hidden: true }
    ],
    hints: [
      "Sort the letters first (`sorted(word)` gives a list), so the permutations come out in alphabetical order.",
      "Recursive idea: `permute(prefix, remaining)`. If `remaining` is empty, `prefix` is a complete permutation. Otherwise, for each letter in `remaining` (in order), call `permute(prefix + letter, remaining without that letter)`.",
      "Collect the results in a list (or return them) so you can count them for the total."
    ],
    solution: `def valid(word):
    if len(word) < 1 or len(word) > 6:
        return False
    for i in range(len(word)):
        if not ("a" <= word[i] <= "z"):
            return False
        if word[i] in word[i + 1:]:
            return False
    return True


def permute(prefix, remaining, results):
    if remaining == "":
        results.append(prefix)
    else:
        for i in range(len(remaining)):
            permute(prefix + remaining[i], remaining[:i] + remaining[i + 1:], results)


word = input("Enter some letters: ")
while not valid(word):
    print("Enter 1 to 6 different letters")
    word = input("Enter some letters: ")

results = []
permute("", "".join(sorted(word)), results)
for p in results:
    print(p)
print("Total: " + str(len(results)))
`,
    explain: `**Approach.** Choose the first letter in every possible way; for each choice, the rest is the same problem with one fewer letter. Base case: no letters left, so the prefix is a finished permutation. Starting from sorted letters and choosing them in order makes the output alphabetical with no extra sorting.

**Size of the output.** n different letters give n! permutations: 6 letters give 720. That growth is why the input is limited — the algorithm is O(n!) and 10 letters would already produce 3,628,800 lines.

**Common mistakes**
- Removing a letter with \`remaining.replace(letter, "")\` — fine for distinct letters but wrong once letters repeat; slicing out index \`i\` is safer.
- Forgetting to validate repeats, which would produce duplicate lines.

**Honesty note.** \`itertools.permutations\` would pass these tests, but the point is the recursion. Exam questions on recursion ask you to trace exactly this kind of call tree.`
  }
]);
