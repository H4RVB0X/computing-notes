CS.registerTrace({
  id: "3.5-1", topic: "3.5", title: "Bubble sort, pass by pass", lang: "pseudocode",
  intro: "Sort `45, 32, 2, 78, 5, 9` into ascending order using the improved bubble sort (swap flag and one fewer comparison each pass).",
  code: "swapped ← True\npassNum ← 0\nWHILE swapped = True\n    swapped ← False\n    FOR j ← 0 TO n - 2 - passNum\n        IF a[j] > a[j + 1] THEN\n            swap a[j] and a[j + 1]\n            swapped ← True\n        ENDIF\n    ENDFOR\n    passNum ← passNum + 1\nENDWHILE",
  columns: ["Pass", "List after the pass", "Comparisons", "Swaps", "swapped"],
  prefill: [["1", "", "", "", ""], ["2", "", "", "", ""], ["3", "", "", "", ""], ["4", "", "", "", ""]],
  rows: [["1", "32,2,45,5,9,78", "5", "4", "True"], ["2", "2,32,5,9,45,78", "4", "3", "True"], ["3", "2,5,9,32,45,78", "3", "2", "True"], ["4", "2,5,9,32,45,78", "2", "0", "False"]],
  instructions: "Write the list comma-separated. The swapped column is the value of the flag at the end of the pass (True/False).",
  hint: "Pass 1 carries 78 to the end. Pass 2 only needs to compare up to the item before 78.",
  note: "The list is sorted after pass 3, but the algorithm only knows that after pass 4 makes no swaps. Total: 14 comparisons, 9 swaps."
});
CS.registerTrace({
  id: "3.5-2", topic: "3.5", title: "Bubble sort: inside the first pass", lang: "pseudocode",
  intro: "Trace the **first pass** of a bubble sort on `a = [6, 2, 9, 4, 7]`.",
  code: "FOR j ← 0 TO 3\n    IF a[j] > a[j + 1] THEN\n        temp ← a[j]\n        a[j] ← a[j + 1]\n        a[j + 1] ← temp\n    ENDIF\nENDFOR",
  columns: ["j", "a[j]", "a[j+1]", "Swap?", "a after this step"],
  prefill: [["0", "", "", "", ""], ["1", "", "", "", ""], ["2", "", "", "", ""], ["3", "", "", "", ""]],
  rows: [["0", "6", "2", "yes", "2,6,9,4,7"], ["1", "6", "9", "no", "2,6,9,4,7"], ["2", "9", "4", "yes", "2,6,4,9,7"], ["3", "9", "7", "yes", "2,6,4,7,9"]],
  instructions: "a[j] and a[j+1] are the values compared at the start of the step (before any swap). Write yes/no, and the list comma-separated.",
  hint: "After j = 0 the list is 2, 6, 9, 4, 7, so at j = 1 you compare 6 with 9.",
  note: "4 comparisons, 3 swaps; 9 has bubbled to the end. Pass 2 gives 2, 4, 6, 7, 9 and pass 3 makes no swaps."
});
CS.registerTrace({
  id: "3.5-3", topic: "3.5", title: "Merge sort: the merges", lang: "text",
  intro: "Merge sort `38, 27, 43, 3, 9, 82, 10`. With 7 items the left half gets the extra item: `38, 27, 43, 3` and `9, 82, 10`; then `9, 82, 10` splits into `9, 82` and `10`. Fill in the result of each merge, in the order the recursive algorithm performs them.",
  code: "merge(left, right):\n    repeatedly compare the first items of left and right\n    move the smaller into the result\n    when one list is empty, copy the rest of the other",
  columns: ["Merge", "Left list", "Right list", "Merged result"],
  prefill: [["1", "38", "27", ""], ["2", "43", "3", ""], ["3", "27,38", "3,43", ""], ["4", "9", "82", ""], ["5", "9,82", "10", ""], ["6", "3,27,38,43", "9,10,82", ""]],
  rows: [["1", "38", "27", "27,38"], ["2", "43", "3", "3,43"], ["3", "27,38", "3,43", "3,27,38,43"], ["4", "9", "82", "9,82"], ["5", "9,82", "10", "9,10,82"], ["6", "3,27,38,43", "9,10,82", "3,9,10,27,38,43,82"]],
  instructions: "Write each merged list comma-separated, e.g. 27,38.",
  hint: "Merge 6: compare 3 with 9 (take 3), 27 with 9 (take 9), 27 with 10 (take 10), 27 with 82 (take 27)…",
  note: "Sorted: **3, 9, 10, 27, 38, 43, 82**. Merge 6 used 6 comparisons; the whole sort used 14."
});
