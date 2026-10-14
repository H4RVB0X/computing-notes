CS.registerTopic({ id: "3.5", title: "Sorting algorithms" }, function () {/*

:::objectives
- Describe and trace **bubble sort** pass by pass, counting comparisons and swaps.
- Explain the two standard improvements: the **swap flag** (stop early) and **shrinking each pass**.
- Derive bubble sort's time complexity: **O(n²)** worst/average, **O(n)** best with the flag.
- Describe and trace **merge sort** as split-then-merge, and draw the split/merge diagram.
- Derive merge sort's time complexity **O(n log n)** and compare it with bubble sort, including space use.
- Choose a sorting algorithm for a given situation.
:::

:::quick At a glance
- **Bubble sort**: repeatedly step through the list comparing **adjacent pairs**, swapping any in the wrong order. After pass k, the k largest items are in their final places at the end.
- **Swap flag**: if a whole pass makes **no swaps**, the list is sorted, so stop. **Shrinking**: each pass can stop one place earlier.
- Bubble sort: worst/average **O(n²)** (about n²/2 comparisons), best **O(n)** with the flag, **O(1)** extra memory (in place).
- **Merge sort**: **divide and conquer**. Split the list in half repeatedly until every sublist has one item, then **merge** pairs of sorted sublists by repeatedly taking the smaller front item.
- Merge sort: **O(n log n)** in **every** case (log₂ n levels × n work per level), but needs **O(n)** extra memory.
- Bubble sort is fine for small or nearly sorted lists; merge sort is far faster for large lists.
:::

:::keyterms
Bubble sort :: A sorting algorithm that repeatedly passes through a list, comparing adjacent items and swapping them if they are in the wrong order, until a pass makes no swaps. :: Swap neighbours until nothing moves.
Pass :: One complete traversal through the (unsorted part of the) list during a bubble sort. :: One trip from the start to the end.
Swap flag :: A Boolean set to False at the start of each pass and True when a swap is made; if it is still False at the end of a pass the list is sorted and the algorithm stops. :: "Did anything move?" If not, stop.
Merge sort :: A divide-and-conquer sorting algorithm that splits a list into single-item sublists and then repeatedly merges pairs of sorted sublists until one sorted list remains. :: Split right down, then zip back together in order.
Merge :: Combining two sorted lists into one sorted list by repeatedly comparing their first items and moving the smaller into the result. :: Zip two sorted piles together.
Divide and conquer :: A problem-solving approach that breaks a problem into smaller subproblems of the same type, solves them, and combines the solutions. :: Break it up, solve the pieces, glue them back.
In-place sort :: A sort that needs only a constant amount of extra memory beyond the list itself. :: Sorts inside the original array.
Stable sort :: A sort that keeps items with equal keys in their original relative order. :: Ties stay in the order they arrived.
:::

## Bubble sort

### How one pass works

Compare items 0 and 1; swap if the left one is bigger. Then compare 1 and 2, then 2 and 3, and so on to the end. The largest value is carried along like a bubble rising to the top, so **after one pass the largest item is at the end**.

:::example First pass on `45, 32, 2, 78, 5, 9` (ZigZag question 1)
| j | Compare | Swap? | List after |
|---|---|---|---|
| 0 | 45 > 32 | yes | 32, 45, 2, 78, 5, 9 |
| 1 | 45 > 2 | yes | 32, 2, 45, 78, 5, 9 |
| 2 | 45 > 78? | no | 32, 2, 45, 78, 5, 9 |
| 3 | 78 > 5 | yes | 32, 2, 45, 5, 78, 9 |
| 4 | 78 > 9 | yes | 32, 2, 45, 5, 9, **78** |

5 comparisons, 4 swaps. 78 is now in its final place.
:::

### The whole sort, pass by pass

Exam questions usually ask for the list **after each pass**. With the swap flag and shrinking passes:

:::example Bubble sort of `45, 32, 2, 78, 5, 9`
| Pass | List after the pass | Comparisons | Swaps | swapped flag |
|---|---|---|---|---|
| start | 45, 32, 2, 78, 5, 9 | | | |
| 1 | 32, 2, 45, 5, 9, **78** | 5 | 4 | True |
| 2 | 2, 32, 5, 9, **45, 78** | 4 | 3 | True |
| 3 | 2, 5, 9, **32, 45, 78** | 3 | 2 | True |
| 4 | 2, 5, 9, 32, 45, 78 | 2 | 0 | **False → stop** |

Total: **14 comparisons, 9 swaps, 4 passes.** Without the flag the algorithm would do a 5th pass for nothing. Without shrinking every pass would make 5 comparisons (20 in total).
:::

:::trap
- The list is sorted after pass 3, but the algorithm only **knows** it is sorted after a pass with **no swaps**. So pass 4 is still needed, and must be shown.
- A pass is a whole trip through the list, not a single swap. "Show the list after each pass" means one line per pass.
- Compare **adjacent** items only. Bubble sort never compares item 0 with item 4.
- The swap needs a **temporary variable**: `temp ← a[j]`, `a[j] ← a[j+1]`, `a[j+1] ← temp`. Writing `a[j] ← a[j+1]` then `a[j+1] ← a[j]` copies the same value twice.
:::

### Code

::::tabs
:::tab AQA pseudocode
```pseudocode
SUBROUTINE bubbleSort(a)
    n ← LEN(a)
    swapped ← True
    passNum ← 0
    WHILE swapped = True
        swapped ← False
        FOR j ← 0 TO n - 2 - passNum
            IF a[j] > a[j + 1] THEN
                temp ← a[j]
                a[j] ← a[j + 1]
                a[j + 1] ← temp
                swapped ← True
            ENDIF
        ENDFOR
        passNum ← passNum + 1
    ENDWHILE
ENDSUBROUTINE
```
:::
:::tab Python
```python
def bubble_sort(a):
    n = len(a)
    swapped = True
    pass_num = 0
    while swapped:
        swapped = False
        comparisons = swaps = 0
        for j in range(n - 1 - pass_num):     # shrink by one each pass
            comparisons += 1
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swaps += 1
                swapped = True
        pass_num += 1
        print(f"pass {pass_num}: {a}  comparisons={comparisons} swaps={swaps}")
    return a

bubble_sort([45, 32, 2, 78, 5, 9])
# pass 1: [32, 2, 45, 5, 9, 78]  comparisons=5 swaps=4
# pass 2: [2, 32, 5, 9, 45, 78]  comparisons=4 swaps=3
# pass 3: [2, 5, 9, 32, 45, 78]  comparisons=3 swaps=2
# pass 4: [2, 5, 9, 32, 45, 78]  comparisons=2 swaps=0
```
:::
:::tab Basic version (no improvements)
```python
def bubble_sort_basic(a):
    n = len(a)
    for p in range(n - 1):            # always n - 1 passes
        for j in range(n - 1):        # always n - 1 comparisons
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a

print(bubble_sort_basic([5, 4, 3, 2, 1]))   # [1, 2, 3, 4, 5] after (n-1)² = 16 comparisons
```
:::
::::

{{trace:3.5-1}}

### Time complexity of bubble sort

Count the comparisons (the basic operation).

- **Worst case** (list in reverse order): passes make n − 1, n − 2, …, 2, 1 comparisons. Total = **n(n − 1) / 2**. For n = 5 that is 10 comparisons and 10 swaps. The dominant term is n²/2, so it is **O(n²)**. (The basic version does (n − 1)² comparisons: still O(n²).)
- **Average case**: also **O(n²)**.
- **Best case** (already sorted) **with the swap flag**: one pass, n − 1 comparisons, no swaps, stop: **O(n)**. Without the flag the best case is still O(n²).
- **Space**: sorts in place with one `temp` variable: **O(1)** extra memory.

Doubling n makes bubble sort about **four times** slower. For 1,000,000 items that is roughly 5 × 10¹¹ comparisons.

{{trace:3.5-2}}

## Merge sort

Merge sort uses **divide and conquer**:

1. **Divide**: split the list in half, and keep splitting each half until every sublist has **one item** (a one-item list is already sorted).
2. **Conquer and combine**: **merge** pairs of sublists back together, in order, until one sorted list is left.

### Merging two sorted lists

Look at the **front** item of each list, move the **smaller** into the result, and repeat. When one list is empty, copy the rest of the other list across (it is already in order).

:::example Merge `2, 32, 45, 78` with `5, 9, 23, 38`
| Compare | Take | Result so far |
|---|---|---|
| 2 vs 5 | 2 | 2 |
| 32 vs 5 | 5 | 2, 5 |
| 32 vs 9 | 9 | 2, 5, 9 |
| 32 vs 23 | 23 | 2, 5, 9, 23 |
| 32 vs 38 | 32 | 2, 5, 9, 23, 32 |
| 45 vs 38 | 38 | 2, 5, 9, 23, 32, 38 |
| right list empty | 45, 78 copied | **2, 5, 9, 23, 32, 38, 45, 78** |

6 comparisons to merge 8 items. Merging never needs more than (total items − 1) comparisons.
:::

### The full split-and-merge diagram

:::figure Merge sort of `45, 32, 2, 78, 5, 9, 38, 23` (ZigZag question 2). Blue rows split; green rows merge.
<svg class="diagram" viewBox="0 0 640 380" role="img" aria-label="Merge sort of 45, 32, 2, 78, 5, 9, 38, 23: three levels of splitting into single items, then three levels of merging into sorted lists, ending 2, 5, 9, 23, 32, 38, 45, 78">
  <g font-size="14" font-family="inherit" text-anchor="middle" fill="currentColor">
    <text x="40" y="36" font-size="12">start</text>
    <rect x="97" y="9" width="402" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="122" y="34">45</text>
    <text x="172" y="34">32</text>
    <text x="222" y="34">2</text>
    <text x="272" y="34">78</text>
    <text x="322" y="34">5</text>
    <text x="372" y="34">9</text>
    <text x="422" y="34">38</text>
    <text x="472" y="34">23</text>
    <text x="40" y="88" font-size="12">split 1</text>
    <rect x="97" y="61" width="202" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="122" y="86">45</text>
    <text x="172" y="86">32</text>
    <text x="222" y="86">2</text>
    <text x="272" y="86">78</text>
    <rect x="309" y="61" width="202" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="334" y="86">5</text>
    <text x="384" y="86">9</text>
    <text x="434" y="86">38</text>
    <text x="484" y="86">23</text>
    <text x="40" y="140" font-size="12">split 2</text>
    <rect x="97" y="113" width="102" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="122" y="138">45</text>
    <text x="172" y="138">32</text>
    <rect x="209" y="113" width="102" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="234" y="138">2</text>
    <text x="284" y="138">78</text>
    <rect x="321" y="113" width="102" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="346" y="138">5</text>
    <text x="396" y="138">9</text>
    <rect x="433" y="113" width="102" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="458" y="138">38</text>
    <text x="508" y="138">23</text>
    <text x="40" y="192" font-size="12">split 3</text>
    <rect x="97" y="165" width="52" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="122" y="190">45</text>
    <rect x="159" y="165" width="52" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="184" y="190">32</text>
    <rect x="221" y="165" width="52" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="246" y="190">2</text>
    <rect x="283" y="165" width="52" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="308" y="190">78</text>
    <rect x="345" y="165" width="52" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="370" y="190">5</text>
    <rect x="407" y="165" width="52" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="432" y="190">9</text>
    <rect x="469" y="165" width="52" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="494" y="190">38</text>
    <rect x="531" y="165" width="52" height="40" rx="7" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="556" y="190">23</text>
    <text x="40" y="244" font-size="12">merge 1</text>
    <rect x="97" y="217" width="102" height="40" rx="7" fill="#22c55e" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="122" y="242">32</text>
    <text x="172" y="242">45</text>
    <rect x="209" y="217" width="102" height="40" rx="7" fill="#22c55e" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="234" y="242">2</text>
    <text x="284" y="242">78</text>
    <rect x="321" y="217" width="102" height="40" rx="7" fill="#22c55e" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="346" y="242">5</text>
    <text x="396" y="242">9</text>
    <rect x="433" y="217" width="102" height="40" rx="7" fill="#22c55e" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="458" y="242">23</text>
    <text x="508" y="242">38</text>
    <text x="40" y="296" font-size="12">merge 2</text>
    <rect x="97" y="269" width="202" height="40" rx="7" fill="#22c55e" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="122" y="294">2</text>
    <text x="172" y="294">32</text>
    <text x="222" y="294">45</text>
    <text x="272" y="294">78</text>
    <rect x="309" y="269" width="202" height="40" rx="7" fill="#22c55e" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="334" y="294">5</text>
    <text x="384" y="294">9</text>
    <text x="434" y="294">23</text>
    <text x="484" y="294">38</text>
    <text x="40" y="348" font-size="12">merge 3</text>
    <rect x="97" y="321" width="402" height="40" rx="7" fill="#22c55e" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="122" y="346">2</text>
    <text x="172" y="346">5</text>
    <text x="222" y="346">9</text>
    <text x="272" y="346">23</text>
    <text x="322" y="346">32</text>
    <text x="372" y="346">38</text>
    <text x="422" y="346">45</text>
    <text x="472" y="346">78</text>
    <line x1="80" y1="212" x2="620" y2="212" stroke="currentColor" stroke-dasharray="5 5" stroke-opacity="0.5"/>
  </g>
</svg>
:::

With an **odd** number of items, one half gets the extra item. Either convention is accepted as long as you are consistent; the code below (and Isaac) puts the extra item in the **left** half, so `9, 3, 10, 2, 8, 5, 1` splits into `9, 3, 10, 2` and `8, 5, 1`.

::::tabs
:::tab AQA pseudocode
```pseudocode
SUBROUTINE mergeSort(items)
    IF LEN(items) ≤ 1 THEN
        RETURN items
    ENDIF
    mid ← (LEN(items) + 1) DIV 2
    left ← mergeSort(items[0 .. mid - 1])
    right ← mergeSort(items[mid .. LEN(items) - 1])
    RETURN merge(left, right)
ENDSUBROUTINE

SUBROUTINE merge(left, right)
    result ← []
    i ← 0
    j ← 0
    WHILE i < LEN(left) AND j < LEN(right)
        IF left[i] ≤ right[j] THEN
            result.append(left[i])
            i ← i + 1
        ELSE
            result.append(right[j])
            j ← j + 1
        ENDIF
    ENDWHILE
    append the remaining items of left (from i) to result
    append the remaining items of right (from j) to result
    RETURN result
ENDSUBROUTINE
```
:::
:::tab Python
```python
def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:          # <= keeps the sort stable
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])              # one of these is empty
    result.extend(right[j:])
    return result

def merge_sort(items, depth=0):
    if len(items) <= 1:
        return items                     # base case
    mid = (len(items) + 1) // 2          # extra item goes left
    left = merge_sort(items[:mid], depth + 1)
    right = merge_sort(items[mid:], depth + 1)
    merged = merge(left, right)
    print("  " * depth + f"merge {left} + {right} -> {merged}")
    return merged

print(merge_sort([45, 32, 2, 78, 5, 9, 38, 23]))
# [2, 5, 9, 23, 32, 38, 45, 78]
```
:::
::::

:::note The recursive order is different from the diagram
The diagram shows all the splitting first and then all the merging, level by level. The recursive code actually sorts the **whole left half first** (split, split, merge, merge) before it touches the right half. The result is identical; only the order of the work differs. In an exam, the level-by-level diagram is what is expected unless you are asked to trace the code.
:::

{{trace:3.5-3}}

### Time complexity of merge sort

- **Splitting**: halving n items down to single items takes **log₂ n** levels.
- **Merging**: at each level every one of the n items is moved once into a merged list, with at most one comparison each: about **n** operations per level.
- Total ≈ n × log₂ n → **O(n log n)**.

It always splits all the way down and merges all the way up, so the complexity is **O(n log n) in the best, average and worst case**. For n = 8: 3 levels × up to 8 operations. For 1,000,000 items: about 20 levels × 1,000,000 ≈ 2 × 10⁷ operations, compared with about 5 × 10¹¹ for bubble sort.

**Space**: merging needs a new list to hold the merged items, so merge sort needs **O(n)** extra memory (plus the recursion stack). Bubble sort needs O(1).

## Try it: sorting visualiser

Run bubble sort and merge sort on the same data. Compare the comparison and swap counters, especially on reversed and already-sorted lists.

{{tool:sorting-visualiser}}

## Bubble sort vs merge sort

| | Bubble sort | Merge sort |
|---|---|---|
| Approach | repeated passes swapping adjacent items | divide and conquer: split, then merge |
| Time: worst / average | O(n²) | O(n log n) |
| Time: best | O(n) with swap flag (already sorted) | O(n log n) |
| Extra memory | O(1), in place | O(n) for the merged lists |
| Recursive? | no (iterative) | usually yes |
| Stable? | yes | yes (if `≤` is used when merging) |
| Easy to code? | very | harder |

### Applications: which one when?

- **Bubble sort**: very small lists; lists that are **almost sorted** (the flag lets it finish in one or two passes); checking whether a list is already sorted (one pass, O(n)); devices with very little memory; teaching.
- **Merge sort**: **large data sets**; sorting **linked lists** (no random access needed); **external sorting** of files too large for RAM (sort chunks, then merge them from disk); whenever guaranteed O(n log n) and stability matter. Python's built-in sort (Timsort) is based on merge sort.

:::trap
- The sorting textbook says merge sort "breaks the list into eight lists, then compares the first two lists". The detail that earns marks: it splits **in halves repeatedly**, and the merge step **compares the first items of two sorted lists and moves the smaller** into the new list.
- Merge sort's complexity is the same in all cases. Do not say "merge sort is O(n) on sorted data".
- "Bubble sort is O(n²)" is the worst case. If asked for the best case, the answer depends on whether the swap flag is used.
:::

:::exam
- **"Show the list after each pass"** (bubble sort): one line per pass, including the final pass with no swaps. Typically 1 mark per correct pass.
- **"Show the stages of a merge sort"**: draw the split levels and the merge levels as in the diagram. Marks are usually for the final merge levels.
- **"Explain why merge sort is more efficient"** (3–4 marks): O(n log n) vs O(n²); splitting takes log n levels; each level does about n work; bubble sort may need n passes of n comparisons; so for large n merge sort does far fewer comparisons.
- **"Evaluate"/"Compare"**: mention **memory** (merge sort O(n) extra, bubble sort in place) and **best case** (bubble sort O(n) on sorted data with the flag).
:::

:::challenge
1. Count the comparisons bubble sort and merge sort make on lists of 10, 100 and 1,000 random numbers. Plot the results against n² and n log₂ n.
2. Modify bubble sort to sort into **descending** order. Which single character changes?
3. Write an iterative ("bottom-up") merge sort that merges sublists of size 1, then 2, then 4…
4. Explain why `<=` rather than `<` in `merge` makes merge sort **stable**, using records with equal keys.
:::

:::recap
- Bubble sort: compare and swap **adjacent** items; after each pass the next largest item is in place.
- Swap flag: stop after a pass with **no swaps**. Shrinking: each pass makes one fewer comparison.
- Bubble sort: **O(n²)** worst/average, **O(n)** best with the flag, **O(1)** extra memory.
- Merge sort: split in halves to single items, then merge pairs by taking the smaller front item.
- Merge sort: **O(n log n)** in all cases (log n levels × n per level), **O(n)** extra memory.
- `45, 32, 2, 78, 5, 9` bubble sorts in 4 passes: `32 2 45 5 9 78` → `2 32 5 9 45 78` → `2 5 9 32 45 78` → no swaps.
:::

:::related
- [3.4 Searching algorithms](#/topic/3.4) — binary search needs sorted data
- [4.6 Classification of algorithms](#/topic/4.6) — Big-O and comparing complexities
- [1.6 Recursion](#/topic/1.6) — merge sort is recursive
:::

*/});
