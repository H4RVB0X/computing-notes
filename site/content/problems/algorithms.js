/* Python coding practice: searching, sorting, graph and tree algorithms
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "linear-search",
    title: "Linear search",
    topic: "3.4",
    difficulty: 1,
    task: `Write a function \`linear_search(items, target)\` that checks the items of the list **one at a time, from the start**, and returns the index of the **first** item equal to \`target\`, or \`-1\` if it isn't there.

Don't use \`in\`, \`.index()\` or \`.find()\`. Your code should only define the function.

\`\`\`python
print(linear_search([5, 3, 9, 3], 3))    # 1
print(linear_search([5, 3, 9, 3], 7))    # -1
\`\`\``,
    starter: `def linear_search(items, target):
    return -1
`,
    tests: [
      { name: "example from the question", code: "print(linear_search([5, 3, 9, 3], 3))\nprint(linear_search([5, 3, 9, 3], 7))", expect: "1\n-1" },
      { name: "first item", code: "print(linear_search([\"cat\", \"dog\"], \"cat\"))", expect: "0" },
      { name: "last item", code: "print(linear_search([1, 2, 3, 4, 5], 5))", expect: "4", hidden: true },
      { name: "empty list", code: "print(linear_search([], 1))", expect: "-1", hidden: true },
      { name: "unsorted strings", code: "print(linear_search([\"pear\", \"apple\", \"fig\", \"fig\"], \"fig\"))", expect: "2", hidden: true }
    ],
    hints: [
      "Loop over the indices: `for i in range(len(items)):`.",
      "As soon as `items[i] == target`, `return i`. Only return -1 **after** the loop has finished."
    ],
    solution: `def linear_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
`,
    explain: `**Approach.** Compare each item in turn; stop at the first match. Returning inside the loop gives the *first* occurrence and avoids needless comparisons.

**Complexity.** Worst case (not present, or last) n comparisons: **O(n)**. Best case 1 comparison. It works on **unsorted** data, which is its big advantage over binary search.

**Common mistakes**
- \`else: return -1\` inside the loop, so only the first item is ever checked.
- Using \`for item in items\` and then needing the index: either use \`range(len(items))\` or \`enumerate\`.

**Exam note.** \`items.index(target)\` does the same search internally; questions that ask you to *write* a linear search want the loop.`
  },
  {
    id: "binary-search",
    title: "Binary search (show the midpoints)",
    topic: "3.4",
    difficulty: 2,
    task: `Write a function \`binary_search(items, target)\` that searches the **sorted** list \`items\` using an iterative binary search and returns the index of \`target\`, or \`-1\` if it isn't there.

To show your method, the function must \`print\` \`Checking index <mid>\` each time it examines a midpoint. Use exactly this version of the algorithm:

- \`low\` starts at 0 and \`high\` at \`len(items) - 1\`
- while \`low <= high\`: \`mid = (low + high) // 2\`; if \`items[mid]\` is the target return \`mid\`; if it is less than the target set \`low = mid + 1\`, otherwise set \`high = mid - 1\`.

Your code should only define the function.

\`\`\`python
items = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(binary_search(items, 23))
# Checking index 4
# Checking index 7
# Checking index 5
# 5
\`\`\``,
    tests: [
      { name: "example from the question", code: "items = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(binary_search(items, 23))", expect: "Checking index 4\nChecking index 7\nChecking index 5\n5" },
      { name: "first item", code: "items = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(binary_search(items, 2))", expect: "Checking index 4\nChecking index 1\nChecking index 0\n0" },
      { name: "last item", code: "items = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(binary_search(items, 91))", expect: "Checking index 4\nChecking index 7\nChecking index 8\nChecking index 9\n9", hidden: true },
      { name: "not present", code: "items = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(binary_search(items, 50))", expect: "Checking index 4\nChecking index 7\nChecking index 5\nChecking index 6\n-1", hidden: true },
      { name: "empty list", code: "print(binary_search([], 5))", expect: "-1", hidden: true },
      { name: "one item", code: "print(binary_search([7], 7))\nprint(binary_search([7], 3))", expect: "Checking index 0\n0\nChecking index 0\n-1", hidden: true },
      { name: "found at the first midpoint", code: "print(binary_search([\"ant\", \"bee\", \"cat\", \"dog\", \"eel\"], \"cat\"))", expect: "Checking index 2\n2", hidden: true }
    ],
    hints: [
      "Set `low = 0` and `high = len(items) - 1` before a `while low <= high:` loop.",
      "Print the midpoint straight after calculating it: `print(\"Checking index \" + str(mid))`.",
      "Return -1 after the loop: if `low` passes `high`, the search space is empty."
    ],
    solution: `def binary_search(items, target):
    low = 0
    high = len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        print("Checking index " + str(mid))
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
`,
    explain: `**Approach.** Each comparison with the middle item discards half of the remaining list, so the search space goes 10 → 5 → 2 → 1. That's why the list **must be sorted**.

**Complexity.** At most ⌊log₂ n⌋ + 1 comparisons: **O(log n)**. A million items need about 20 comparisons; a linear search could need a million.

**Why \`mid + 1\` and \`mid - 1\`?** \`items[mid]\` has already been checked. Writing \`low = mid\` can loop forever when \`low\` and \`high\` are next to each other.

**Common mistakes:** \`while low < high\` (misses the last remaining item, so a one-item list fails); \`mid = (low + high) / 2\` (a float can't be an index).

The printed midpoints let these tests check you used *this* algorithm. A real binary search wouldn't print anything.`
  },
  {
    id: "bubble-sort",
    title: "Bubble sort, pass by pass",
    topic: "3.5",
    difficulty: 2,
    task: `Write a program that sorts whole numbers into ascending order using **bubble sort**.

- Ask for the numbers separated by spaces (prompt \`Enter numbers: \`). If nothing is entered, output \`No numbers\` and stop.
- In each pass, compare each pair of neighbouring items from the start of the list and swap them if they're in the wrong order.
- After **every** pass, output the list as numbers separated by single spaces.
- Stop after a pass in which **no swaps** were made (that pass is output too), then output \`Passes: <number of passes>\`.

**Do not** use \`sort()\` or \`sorted()\`.

\`\`\`text
Enter numbers: 5 1 4 2 8
1 4 2 5 8
1 2 4 5 8
1 2 4 5 8
Passes: 3
\`\`\``,
    tests: [
      { name: "example from the question", input: "5 1 4 2 8\n", expect: "1 4 2 5 8\n1 2 4 5 8\n1 2 4 5 8\nPasses: 3" },
      { name: "already sorted: one pass", input: "1 2 3\n", expect: "1 2 3\nPasses: 1" },
      { name: "reverse order", input: "4 3 2 1\n", expect: "3 2 1 4\n2 1 3 4\n1 2 3 4\n1 2 3 4\nPasses: 4", hidden: true },
      { name: "one number", input: "7\n", expect: "7\nPasses: 1", hidden: true },
      { name: "duplicates", input: "2 1 2 1\n", expect: "1 2 1 2\n1 1 2 2\n1 1 2 2\nPasses: 3", hidden: true },
      { name: "negative numbers", input: "0 -3 10 -1\n", expect: "-3 0 -1 10\n-3 -1 0 10\n-3 -1 0 10\nPasses: 3", hidden: true },
      { name: "empty input", input: "\n", expect: "No numbers", hidden: true }
    ],
    hints: [
      "Use a Boolean `swapped`. Loop `while swapped:` and set `swapped = False` at the start of each pass.",
      "Inside a pass: `for i in range(len(items) - 1):` compare `items[i]` with `items[i + 1]`; swap with `items[i], items[i + 1] = items[i + 1], items[i]` and set `swapped = True`.",
      "Print the list after each pass with `\" \".join(...)` of the numbers converted to strings."
    ],
    solution: `text = input("Enter numbers: ")
if text.strip() == "":
    print("No numbers")
else:
    items = []
    for part in text.split():
        items.append(int(part))

    passes = 0
    swapped = True
    while swapped:
        swapped = False
        for i in range(len(items) - 1 - passes):
            if items[i] > items[i + 1]:
                temp = items[i]
                items[i] = items[i + 1]
                items[i + 1] = temp
                swapped = True
        passes = passes + 1
        line = []
        for n in items:
            line.append(str(n))
        print(" ".join(line))
    print("Passes: " + str(passes))
`,
    explain: `**Approach.** Each pass "bubbles" the largest remaining item to the end. The \`swapped\` flag gives the *improved* bubble sort: as soon as a whole pass makes no swaps, the list is sorted and we stop — so an already sorted list takes one pass.

**Further improvement.** After pass k the last k items are in their final places, so each pass can stop k items earlier (\`len(items) - 1 - passes\` in the model answer). It saves comparisons but doesn't change the printed lists.

**Complexity.** Worst case (reverse order) about n²/2 comparisons: **O(n²)**. Best case with the flag: n − 1 comparisons, **O(n)**.

**Swapping.** Python's \`a, b = b, a\` is neat; in the exam (and pseudocode) use a temporary variable, as in the model answer.

**Honesty note.** \`sorted()\` would give the right final list but not the pass-by-pass output — and in the exam, using it when asked to implement bubble sort scores no marks.`
  },
  {
    id: "insertion-sort",
    title: "Insertion sort, step by step",
    topic: "3.5",
    difficulty: 2,
    task: `Write a program that sorts whole numbers into ascending order using **insertion sort**.

- Ask for the numbers separated by spaces (prompt \`Enter numbers: \`). You may assume at least one number is entered.
- For each position \`i\` from 1 to the end: take the item at \`i\` and move it left, past every larger item, into its correct place among the items before it.
- After each step output \`After step <i>: \` followed by the list (numbers separated by single spaces).
- Finally output \`Sorted: \` followed by the sorted list.

**Do not** use \`sort()\` or \`sorted()\`.

\`\`\`text
Enter numbers: 5 2 4 6 1 3
After step 1: 2 5 4 6 1 3
After step 2: 2 4 5 6 1 3
After step 3: 2 4 5 6 1 3
After step 4: 1 2 4 5 6 3
After step 5: 1 2 3 4 5 6
Sorted: 1 2 3 4 5 6
\`\`\``,
    tests: [
      { name: "example from the question", input: "5 2 4 6 1 3\n", expect: "After step 1: 2 5 4 6 1 3\nAfter step 2: 2 4 5 6 1 3\nAfter step 3: 2 4 5 6 1 3\nAfter step 4: 1 2 4 5 6 3\nAfter step 5: 1 2 3 4 5 6\nSorted: 1 2 3 4 5 6" },
      { name: "already sorted", input: "1 2 3\n", expect: "After step 1: 1 2 3\nAfter step 2: 1 2 3\nSorted: 1 2 3" },
      { name: "one number: no steps", input: "9\n", expect: "Sorted: 9", hidden: true },
      { name: "equal items are not moved past each other", input: "3 3 1\n", expect: "After step 1: 3 3 1\nAfter step 2: 1 3 3\nSorted: 1 3 3", hidden: true },
      { name: "negative numbers", input: "0 -2 5 -7\n", expect: "After step 1: -2 0 5 -7\nAfter step 2: -2 0 5 -7\nAfter step 3: -7 -2 0 5\nSorted: -7 -2 0 5", hidden: true },
      { name: "reverse order", input: "4 3 2 1\n", expect: "After step 1: 3 4 2 1\nAfter step 2: 2 3 4 1\nAfter step 3: 1 2 3 4\nSorted: 1 2 3 4", hidden: true }
    ],
    hints: [
      "For each `i` from 1: `current = items[i]` and `j = i - 1`.",
      "`while j >= 0 and items[j] > current:` shift `items[j]` one place right (`items[j + 1] = items[j]`) and decrease `j`.",
      "After the while loop, put `current` into the gap: `items[j + 1] = current`. Then print the step."
    ],
    solution: `def show(items):
    parts = []
    for n in items:
        parts.append(str(n))
    return " ".join(parts)


items = []
for part in input("Enter numbers: ").split():
    items.append(int(part))

for i in range(1, len(items)):
    current = items[i]
    j = i - 1
    while j >= 0 and items[j] > current:
        items[j + 1] = items[j]
        j = j - 1
    items[j + 1] = current
    print("After step " + str(i) + ": " + show(items))
print("Sorted: " + show(items))
`,
    explain: `**Approach.** The left part of the list is always sorted. Each step takes the next item and slides larger items one place right until the gap is in the right place, like sorting a hand of cards.

**Why \`items[j] > current\` (strictly greater)?** Equal items stop the shifting, so equal values keep their original order: insertion sort is **stable**.

**Complexity.** Worst case (reverse order) **O(n²)** comparisons and shifts; best case (already sorted) only one comparison per step, **O(n)**. It's fast on nearly sorted data.

**Spec note.** AQA 7517 names bubble sort and merge sort; insertion sort isn't listed, but it often appears as an unfamiliar algorithm to trace in Paper 1, so practise reading it.

**Common mistakes:** checking \`items[j] > current\` before \`j >= 0\` (with \`j = -1\`, Python silently reads the *last* item); swapping instead of shifting (works, but does more assignments).`
  },
  {
    id: "merge-sort",
    title: "Merge sort",
    topic: "3.5",
    difficulty: 3,
    task: `Write two functions.

1. \`merge(left, right)\` takes two lists that are each already sorted and returns **one new sorted list** containing all their items. Do this by repeatedly comparing the front items of the two lists, not by sorting.
2. \`merge_sort(items)\` returns a **new** sorted list (ascending) and must be **recursive**: a list of 0 or 1 items is already sorted; otherwise split it in half, merge-sort each half, and merge the results. It must **not** change the list passed in.

Don't use \`sort()\` or \`sorted()\`. Your code should only define the functions.

\`\`\`python
print(merge([1, 4, 9], [2, 3, 10]))         # [1, 2, 3, 4, 9, 10]
print(merge_sort([38, 27, 43, 3, 9, 82, 10]))  # [3, 9, 10, 27, 38, 43, 82]
\`\`\``,
    tests: [
      { name: "merge from the question", code: "print(merge([1, 4, 9], [2, 3, 10]))", expect: "[1, 2, 3, 4, 9, 10]" },
      { name: "merge_sort from the question", code: "print(merge_sort([38, 27, 43, 3, 9, 82, 10]))", expect: "[3, 9, 10, 27, 38, 43, 82]" },
      { name: "merge with an empty list", code: "print(merge([], [1]))\nprint(merge([5, 6], []))\nprint(merge([], []))", expect: "[1]\n[5, 6]\n[]", hidden: true },
      { name: "merge with one list used up first", code: "print(merge([1, 2, 3], [7, 8, 9]))", expect: "[1, 2, 3, 7, 8, 9]", hidden: true },
      { name: "empty and single lists", code: "print(merge_sort([]))\nprint(merge_sort([5]))", expect: "[]\n[5]", hidden: true },
      { name: "duplicates and negatives", code: "print(merge_sort([3, 1, -4, 3, 1]))", expect: "[-4, 1, 1, 3, 3]", hidden: true },
      { name: "original list is not changed", code: "a = [3, 1, 2]\nb = merge_sort(a)\nprint(a, b)", expect: "[3, 1, 2] [1, 2, 3]", hidden: true },
      { name: "merge_sort is recursive", code: "calls = 0\n_original = merge_sort\ndef merge_sort(*args):\n    global calls\n    calls = calls + 1\n    return _original(*args)\n_original([4, 3, 2, 1])\nprint(\"recursive\" if calls > 0 else \"not recursive: the function never calls itself\")", expect: "recursive", hidden: true },
      { name: "strings sort too", code: "print(merge_sort([\"dog\", \"ant\", \"cat\", \"bee\"]))", expect: "['ant', 'bee', 'cat', 'dog']", hidden: true }
    ],
    hints: [
      "`merge`: keep an index into each list. While both have items left, append the smaller front item and move that index on. Then append whatever is left of either list.",
      "`merge_sort`: base case `if len(items) <= 1: return items[:]` (a copy). Otherwise `mid = len(items) // 2`, sort `items[:mid]` and `items[mid:]` recursively, and return `merge(...)` of the two results.",
      "Slicing (`items[:mid]`) makes new lists, so the original is never changed."
    ],
    solution: `def merge(left, right):
    result = []
    i = 0
    j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i = i + 1
        else:
            result.append(right[j])
            j = j + 1
    while i < len(left):
        result.append(left[i])
        i = i + 1
    while j < len(right):
        result.append(right[j])
        j = j + 1
    return result


def merge_sort(items):
    if len(items) <= 1:
        return items[:]
    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])
    return merge(left, right)
`,
    explain: `**Divide and conquer.** Split the list in half repeatedly until every sub-list has one item (trivially sorted), then merge pairs of sorted lists back together. All the comparing happens in \`merge\`.

**Merging.** Only the front items need comparing, because each list is already sorted. When one list runs out, the rest of the other is already in order and is copied across — forgetting this step is the most common bug.

**Complexity.** The list can be halved log₂ n times, and each level of merging handles all n items: **O(n log n)** in every case. The cost is extra memory, because new lists are created (O(n) space), unlike bubble sort which sorts in place.

**\`<=\` in merge** takes from the left list when items are equal, which keeps merge sort **stable**.

**Exam tip.** You may be asked to show the split and merge stages for a short list: draw the tree of halves, then the merges back up.`
  },
  {
    id: "bfs-graph",
    title: "Breadth-first search",
    topic: "3.1",
    difficulty: 3,
    task: `A graph is stored as an **adjacency list**: a dictionary mapping each vertex to a list of its neighbours.

\`\`\`python
g = {"A": ["B", "C"], "B": ["A", "D", "E"], "C": ["A", "F"],
     "D": ["B"], "E": ["B", "F"], "F": ["C", "E"]}
\`\`\`

Write two functions that use a **queue**.

1. \`bfs(graph, start)\` returns a list of the vertices in the order a breadth-first traversal from \`start\` visits them. Neighbours are added in the order they appear in the adjacency list. Each vertex is visited once.
2. \`path_length(graph, start, goal)\` returns the **fewest edges** on a path from \`start\` to \`goal\` (0 if they're the same vertex), or \`-1\` if there is no path.

Your code should only define the functions.

\`\`\`python
print(bfs(g, "A"))              # ['A', 'B', 'C', 'D', 'E', 'F']
print(path_length(g, "D", "F")) # 3
\`\`\``,
    tests: [
      { name: "bfs from the question", code: "g = {\"A\": [\"B\", \"C\"], \"B\": [\"A\", \"D\", \"E\"], \"C\": [\"A\", \"F\"], \"D\": [\"B\"], \"E\": [\"B\", \"F\"], \"F\": [\"C\", \"E\"]}\nprint(bfs(g, \"A\"))", expect: "['A', 'B', 'C', 'D', 'E', 'F']" },
      { name: "path_length from the question", code: "g = {\"A\": [\"B\", \"C\"], \"B\": [\"A\", \"D\", \"E\"], \"C\": [\"A\", \"F\"], \"D\": [\"B\"], \"E\": [\"B\", \"F\"], \"F\": [\"C\", \"E\"]}\nprint(path_length(g, \"D\", \"F\"))", expect: "3" },
      { name: "bfs from another vertex", code: "g = {\"A\": [\"B\", \"C\"], \"B\": [\"A\", \"D\", \"E\"], \"C\": [\"A\", \"F\"], \"D\": [\"B\"], \"E\": [\"B\", \"F\"], \"F\": [\"C\", \"E\"]}\nprint(bfs(g, \"D\"))", expect: "['D', 'B', 'A', 'E', 'C', 'F']", hidden: true },
      { name: "disconnected graph", code: "h = {\"A\": [\"B\"], \"B\": [\"A\"], \"C\": []}\nprint(bfs(h, \"A\"))\nprint(bfs(h, \"C\"))", expect: "['A', 'B']\n['C']", hidden: true },
      { name: "path lengths", code: "g = {\"A\": [\"B\", \"C\"], \"B\": [\"A\", \"D\", \"E\"], \"C\": [\"A\", \"F\"], \"D\": [\"B\"], \"E\": [\"B\", \"F\"], \"F\": [\"C\", \"E\"]}\nprint(path_length(g, \"A\", \"F\"))\nprint(path_length(g, \"E\", \"E\"))\nprint(path_length(g, \"F\", \"E\"))", expect: "2\n0\n1", hidden: true },
      { name: "no path", code: "h = {\"A\": [\"B\"], \"B\": [\"A\"], \"C\": []}\nprint(path_length(h, \"A\", \"C\"))", expect: "-1", hidden: true },
      { name: "directed graph", code: "d = {\"S\": [\"T\", \"U\"], \"T\": [\"V\"], \"U\": [\"V\"], \"V\": []}\nprint(bfs(d, \"S\"))\nprint(path_length(d, \"S\", \"V\"))\nprint(path_length(d, \"V\", \"S\"))", expect: "['S', 'T', 'U', 'V']\n2\n-1", hidden: true }
    ],
    hints: [
      "Start with `queue = [start]` and `visited = [start]`. While the queue isn't empty, remove the **front** item (`queue.pop(0)`) and add it to the result.",
      "For each neighbour of that vertex that is not yet in `visited`, add it to `visited` **and** to the back of the queue.",
      "For `path_length`, store each discovered vertex's distance in a dictionary: `dist[neighbour] = dist[current] + 1`."
    ],
    solution: `def bfs(graph, start):
    visited = [start]
    queue = [start]
    order = []
    while len(queue) > 0:
        current = queue.pop(0)
        order.append(current)
        for neighbour in graph[current]:
            if neighbour not in visited:
                visited.append(neighbour)
                queue.append(neighbour)
    return order


def path_length(graph, start, goal):
    dist = {start: 0}
    queue = [start]
    while len(queue) > 0:
        current = queue.pop(0)
        if current == goal:
            return dist[current]
        for neighbour in graph[current]:
            if neighbour not in dist:
                dist[neighbour] = dist[current] + 1
                queue.append(neighbour)
    return -1
`,
    explain: `**Approach.** BFS explores the graph in "rings": first the start, then all its neighbours, then their neighbours, and so on. A **queue** (FIFO) produces exactly that order, because vertices discovered earlier are processed earlier.

**Mark when discovered.** Adding a vertex to \`visited\` as it joins the queue stops it being queued twice. (Marking when it leaves the queue also works if you skip already-visited vertices, but the queue gets longer.)

**Shortest paths.** In an *unweighted* graph BFS reaches every vertex by the fewest possible edges, which is why \`path_length\` works. For weighted graphs you need Dijkstra's algorithm.

**DFS contrast (exam favourite).** Swap the queue for a **stack** (or recursion) and you get depth-first search, which goes as deep as possible before backtracking. BFS: shortest path in unweighted graphs; DFS: navigating a maze, detecting cycles.

**Complexity.** Each vertex and edge is processed once: O(V + E) with an adjacency list.`
  },
  {
    id: "dijkstra",
    title: "Dijkstra's shortest path",
    topic: "3.6",
    difficulty: 3,
    task: `A weighted graph is stored as a dictionary of dictionaries: \`graph[u][v]\` is the weight of the edge from \`u\` to \`v\`.

\`\`\`python
graph = {"A": {"B": 4, "C": 2}, "B": {"A": 4, "C": 1, "D": 5},
         "C": {"A": 2, "B": 1, "D": 8, "E": 10}, "D": {"B": 5, "C": 8, "E": 2, "F": 6},
         "E": {"C": 10, "D": 2, "F": 2}, "F": {"D": 6, "E": 2}}
\`\`\`

Write two functions using **Dijkstra's algorithm**.

1. \`dijkstra(graph, start)\` returns a dictionary giving the shortest distance from \`start\` to **every** vertex in the graph. Vertices that can't be reached have the value \`None\`.
2. \`shortest_path(graph, start, goal)\` returns the shortest route as a list of vertices from \`start\` to \`goal\`, or an empty list if there is no route. (There are no ties in the tests.)

All weights are positive whole numbers. Your code should only define the functions (you may add helpers). Don't import any modules.

\`\`\`python
d = dijkstra(graph, "A")
print(d["F"])                             # 12
print(shortest_path(graph, "A", "F"))     # ['A', 'C', 'B', 'D', 'E', 'F']
\`\`\``,
    tests: [
      { name: "example from the question", code: "graph = {\"A\": {\"B\": 4, \"C\": 2}, \"B\": {\"A\": 4, \"C\": 1, \"D\": 5}, \"C\": {\"A\": 2, \"B\": 1, \"D\": 8, \"E\": 10}, \"D\": {\"B\": 5, \"C\": 8, \"E\": 2, \"F\": 6}, \"E\": {\"C\": 10, \"D\": 2, \"F\": 2}, \"F\": {\"D\": 6, \"E\": 2}}\nd = dijkstra(graph, \"A\")\nprint(d[\"F\"])\nprint(shortest_path(graph, \"A\", \"F\"))", expect: "12\n['A', 'C', 'B', 'D', 'E', 'F']" },
      { name: "all distances from A", code: "graph = {\"A\": {\"B\": 4, \"C\": 2}, \"B\": {\"A\": 4, \"C\": 1, \"D\": 5}, \"C\": {\"A\": 2, \"B\": 1, \"D\": 8, \"E\": 10}, \"D\": {\"B\": 5, \"C\": 8, \"E\": 2, \"F\": 6}, \"E\": {\"C\": 10, \"D\": 2, \"F\": 2}, \"F\": {\"D\": 6, \"E\": 2}}\nd = dijkstra(graph, \"A\")\nfor v in sorted(d):\n    print(v, d[v])", expect: "A 0\nB 3\nC 2\nD 8\nE 10\nF 12" },
      { name: "all distances from F", code: "graph = {\"A\": {\"B\": 4, \"C\": 2}, \"B\": {\"A\": 4, \"C\": 1, \"D\": 5}, \"C\": {\"A\": 2, \"B\": 1, \"D\": 8, \"E\": 10}, \"D\": {\"B\": 5, \"C\": 8, \"E\": 2, \"F\": 6}, \"E\": {\"C\": 10, \"D\": 2, \"F\": 2}, \"F\": {\"D\": 6, \"E\": 2}}\nd = dijkstra(graph, \"F\")\nfor v in sorted(d):\n    print(v, d[v])", expect: "A 12\nB 9\nC 10\nD 4\nE 2\nF 0", hidden: true },
      { name: "unreachable vertex is None", code: "g2 = {\"S\": {\"T\": 7}, \"T\": {}, \"U\": {\"S\": 1}}\nd = dijkstra(g2, \"S\")\nfor v in sorted(d):\n    print(v, d[v])", expect: "S 0\nT 7\nU None", hidden: true },
      { name: "paths in a directed graph", code: "g2 = {\"S\": {\"T\": 7}, \"T\": {}, \"U\": {\"S\": 1}}\nprint(shortest_path(g2, \"U\", \"T\"))\nprint(shortest_path(g2, \"S\", \"U\"))\nprint(shortest_path(g2, \"S\", \"S\"))", expect: "['U', 'S', 'T']\n[]\n['S']", hidden: true },
      { name: "longer direct edge is not used", code: "graph = {\"A\": {\"B\": 4, \"C\": 2}, \"B\": {\"A\": 4, \"C\": 1, \"D\": 5}, \"C\": {\"A\": 2, \"B\": 1, \"D\": 8, \"E\": 10}, \"D\": {\"B\": 5, \"C\": 8, \"E\": 2, \"F\": 6}, \"E\": {\"C\": 10, \"D\": 2, \"F\": 2}, \"F\": {\"D\": 6, \"E\": 2}}\nprint(shortest_path(graph, \"A\", \"B\"))\nprint(shortest_path(graph, \"D\", \"C\"))", expect: "['A', 'C', 'B']\n['D', 'B', 'C']", hidden: true }
    ],
    hints: [
      "Keep `dist` (every vertex starts at `None`, the start at 0), `previous` (which vertex we came from) and a list of `unvisited` vertices.",
      "Each round: pick the unvisited vertex with the **smallest known** distance (skip `None`s). If there isn't one, stop. Mark it visited, then for each neighbour, if `dist[current] + weight` is better than the neighbour's distance, update `dist` and `previous`.",
      "For the path, follow `previous` back from the goal to the start, then reverse the list."
    ],
    solution: `def run_dijkstra(graph, start):
    dist = {}
    previous = {}
    for v in graph:
        dist[v] = None
        previous[v] = None
    dist[start] = 0
    unvisited = list(graph.keys())
    while len(unvisited) > 0:
        current = None
        for v in unvisited:
            if dist[v] is not None and (current is None or dist[v] < dist[current]):
                current = v
        if current is None:
            break
        unvisited.remove(current)
        for neighbour, weight in graph[current].items():
            new_distance = dist[current] + weight
            if dist[neighbour] is None or new_distance < dist[neighbour]:
                dist[neighbour] = new_distance
                previous[neighbour] = current
    return dist, previous


def dijkstra(graph, start):
    dist, previous = run_dijkstra(graph, start)
    return dist


def shortest_path(graph, start, goal):
    dist, previous = run_dijkstra(graph, start)
    if dist[goal] is None:
        return []
    path = [goal]
    while path[-1] != start:
        path.append(previous[path[-1]])
    path.reverse()
    return path
`,
    explain: `**Approach.** Dijkstra's algorithm repeatedly takes the closest unvisited vertex: its distance is now final, because every other route would have to go through a vertex that is already at least as far away (this is why weights must not be negative). Then it *relaxes* each edge out of that vertex, improving neighbours' distances where possible.

**Tracing from A.** A(0) → C(2): B becomes 3, D 10, E 12 → B(3): D becomes 8 → D(8): E becomes 10, F 14 → E(10): F becomes 12 → F(12). Note the direct edge A–B (4) loses to A–C–B (3).

**Recording the path.** Store the \`previous\` vertex whenever a distance improves; following it backwards from the goal rebuilds the route.

**Complexity.** This simple version scans the unvisited list each time: O(V²). A priority queue (\`heapq\`) makes it O((V + E) log V); that's how routers (OSPF) and sat-navs do it.

**Exam tip.** In Paper 1 you trace it in a table of vertices with their current shortest distance and previous vertex. Cross out vertices as they become visited.`
  },
  {
    id: "rpn-evaluate",
    title: "Evaluate Reverse Polish notation",
    topic: "3.3",
    difficulty: 3,
    task: `Write a program that evaluates an expression in **Reverse Polish notation** using a **stack**.

- Ask for the expression (prompt \`Enter an RPN expression: \`). Tokens are separated by spaces. A token is either a whole number (possibly negative, like \`-3\`) or one of the operators \`+\`, \`-\`, \`*\`.
- Process the tokens left to right. A number is pushed on to the stack. An operator pops the top two values (the first popped is the **right-hand** operand), applies the operator and pushes the result.
- After processing **each** token, output \`Stack: \` followed by the stack as a Python list, bottom first, e.g. \`Stack: [5, 3]\` (that's what \`print("Stack:", stack)\` gives).
- At the end, if exactly one value is left, output \`Result: <value>\`.
- Output \`Invalid expression\` and stop if an operator needs two values but there are fewer, if a token isn't a number or an operator, or if the stack does not end with exactly one value.

\`\`\`text
Enter an RPN expression: 6 2 - 3 *
Stack: [6]
Stack: [6, 2]
Stack: [4]
Stack: [4, 3]
Stack: [12]
Result: 12
\`\`\``,
    tests: [
      { name: "example from the question", input: "6 2 - 3 *\n", expect: "Stack: [6]\nStack: [6, 2]\nStack: [4]\nStack: [4, 3]\nStack: [12]\nResult: 12" },
      { name: "simple addition", input: "3 4 +\n", expect: "Stack: [3]\nStack: [3, 4]\nStack: [7]\nResult: 7" },
      { name: "longer expression", input: "5 1 2 + 4 * + 3 -\n", expect: "Stack: [5]\nStack: [5, 1]\nStack: [5, 1, 2]\nStack: [5, 3]\nStack: [5, 3, 4]\nStack: [5, 12]\nStack: [17]\nStack: [17, 3]\nStack: [14]\nResult: 14", hidden: true },
      { name: "not enough operands", input: "4 +\n", expect: "Stack: [4]\nInvalid expression", hidden: true },
      { name: "too many values left", input: "1 2\n", expect: "Stack: [1]\nStack: [1, 2]\nInvalid expression", hidden: true },
      { name: "empty expression", input: "\n", expect: "Invalid expression", hidden: true },
      { name: "unknown token", input: "10 2 x\n", expect: "Stack: [10]\nStack: [10, 2]\nInvalid expression", hidden: true },
      { name: "negative number token", input: "-3 2 *\n", expect: "Stack: [-3]\nStack: [-3, 2]\nStack: [-6]\nResult: -6", hidden: true },
      { name: "operand order for subtraction", input: "2 3 4 * -\n", expect: "Stack: [2]\nStack: [2, 3]\nStack: [2, 3, 4]\nStack: [2, 12]\nStack: [-10]\nResult: -10", hidden: true }
    ],
    hints: [
      "Use a list as the stack: `stack.append(x)` is push and `stack.pop()` is pop.",
      "A token is a number if `token.lstrip(\"-\").isdigit()` and it isn't just `-`. Check for operators first.",
      "For `-`: `right = stack.pop()`, `left = stack.pop()`, push `left - right`. Use a flag (or `break`) to stop when the expression is invalid."
    ],
    solution: `tokens = input("Enter an RPN expression: ").split()
stack = []
valid = True
for token in tokens:
    if not valid:
        break
    if token in ["+", "-", "*"]:
        if len(stack) < 2:
            valid = False
        else:
            right = stack.pop()
            left = stack.pop()
            if token == "+":
                stack.append(left + right)
            elif token == "-":
                stack.append(left - right)
            else:
                stack.append(left * right)
    elif token.lstrip("-").isdigit():
        stack.append(int(token))
    else:
        valid = False
    if valid:
        print("Stack:", stack)

if valid and len(stack) == 1:
    print("Result: " + str(stack[0]))
else:
    print("Invalid expression")
`,
    explain: `**Approach.** RPN puts operators *after* their operands, so no brackets or precedence rules are needed: \`5 1 2 + 4 * + 3 -\` is \`5 + (1 + 2) × 4 − 3\`. A stack holds the operands waiting for an operator.

**Operand order.** The first value popped is the right-hand operand. \`2 3 4 * -\` is 2 − 12 = −10, not 12 − 2. Mixing these up is the classic mistake, and it only shows with \`-\` (and \`/\`).

**Validity.** A well-formed expression never pops an empty stack and leaves exactly one value. Each number adds one item and each binary operator removes one net, so a valid expression has one more number than operators.

**Why it matters.** RPN is easy for machines to evaluate in one left-to-right pass with a stack, which is why it is used by interpreters and stack-based virtual machines (e.g. bytecode) and some calculators.`
  },
  {
    id: "bst-traversals",
    title: "Binary search tree traversals",
    topic: "3.2",
    difficulty: 3,
    task: `Write a program that builds a **binary search tree** of words and outputs its traversals.

- Ask for words separated by spaces (prompt \`Enter words: \`) and insert them into the tree **in the order given**. Smaller words (alphabetically, using \`<\`) go left, larger go right. A word that is already in the tree is ignored.
- If no words were entered, output \`Tree is empty\`. Otherwise output four lines:
  - \`Pre-order: \` then the words in pre-order (node, left, right)
  - \`In-order: \` then in-order (left, node, right)
  - \`Post-order: \` then post-order (left, right, node)
  - \`Height: \` then the number of levels in the tree (a single node has height 1).

Words are separated by single spaces. Use recursion for the traversals.

\`\`\`text
Enter words: m f t b h p w
Pre-order: m f b h t p w
In-order: b f h m p t w
Post-order: b h f p w t m
Height: 3
\`\`\``,
    tests: [
      { name: "example from the question", input: "m f t b h p w\n", expect: "Pre-order: m f b h t p w\nIn-order: b f h m p t w\nPost-order: b h f p w t m\nHeight: 3" },
      { name: "a chain to the left", input: "c b a\n", expect: "Pre-order: c b a\nIn-order: a b c\nPost-order: a b c\nHeight: 3" },
      { name: "one word", input: "apple\n", expect: "Pre-order: apple\nIn-order: apple\nPost-order: apple\nHeight: 1", hidden: true },
      { name: "empty input", input: "\n", expect: "Tree is empty", hidden: true },
      { name: "duplicates ignored", input: "d b d f b\n", expect: "Pre-order: d b f\nIn-order: b d f\nPost-order: b f d\nHeight: 2", hidden: true },
      { name: "a chain to the right", input: "ant bee cat dog\n", expect: "Pre-order: ant bee cat dog\nIn-order: ant bee cat dog\nPost-order: dog cat bee ant\nHeight: 4", hidden: true },
      { name: "unbalanced tree", input: "kiwi fig lime apple grape pear plum\n", expect: "Pre-order: kiwi fig apple grape lime pear plum\nIn-order: apple fig grape kiwi lime pear plum\nPost-order: apple grape fig plum pear lime kiwi\nHeight: 4", hidden: true }
    ],
    hints: [
      "Use a `Node` class with `word`, `left` and `right` (the last two start as `None`). Insert recursively: if the word is smaller go left, if larger go right, and create a new node when you reach `None`.",
      "Pre-order: visit the node, then traverse left, then right. Each traversal can append to a list that you join at the end.",
      "Height of `None` is 0; otherwise it is 1 + the larger of the left and right heights."
    ],
    solution: `class Node:
    def __init__(self, word):
        self.word = word
        self.left = None
        self.right = None


def insert(node, word):
    if node is None:
        return Node(word)
    if word < node.word:
        node.left = insert(node.left, word)
    elif word > node.word:
        node.right = insert(node.right, word)
    return node


def pre_order(node, out):
    if node is not None:
        out.append(node.word)
        pre_order(node.left, out)
        pre_order(node.right, out)


def in_order(node, out):
    if node is not None:
        in_order(node.left, out)
        out.append(node.word)
        in_order(node.right, out)


def post_order(node, out):
    if node is not None:
        post_order(node.left, out)
        post_order(node.right, out)
        out.append(node.word)


def height(node):
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))


root = None
for word in input("Enter words: ").split():
    root = insert(root, word)

if root is None:
    print("Tree is empty")
else:
    for name, traversal in [("Pre-order", pre_order), ("In-order", in_order), ("Post-order", post_order)]:
        out = []
        traversal(root, out)
        print(name + ": " + " ".join(out))
    print("Height: " + str(height(root)))
`,
    explain: `**Building the tree.** Each new word starts at the root and goes left or right at every node until it finds an empty place. The shape depends on the insertion order: \`ant bee cat dog\` makes a tree that is really a linked list (height 4), so searching it is O(n) rather than O(log n).

**Traversals.** They differ only in *when* the node is visited:
- **Pre-order** (node first): copying a tree; prefix (Polish) notation for expression trees.
- **In-order** (node in the middle): outputs a BST's contents **in sorted order**. That's the quickest check that your insert works.
- **Post-order** (node last): deleting a tree; producing Reverse Polish notation from an expression tree.

**Recursion.** Each traversal is three lines because the left and right subtrees are themselves trees. The base case is an empty subtree (\`None\`).

**Exam tip.** To trace by hand, draw a dot on the left (pre), bottom (in) or right (post) of each node and walk round the outside of the tree anticlockwise from the root, writing each node as you pass its dot.`
  }
]);
