CS.registerFlashcards("2.1", [
  { front: "Give **three** differences between a static and a dynamic data structure.", back: "Static: size fixed at compile time · contiguous memory, direct access · may overflow or waste memory.\nDynamic: size changes at run time · memory from the heap, nodes linked by pointers · no overflow until heap full, but slower access and pointer overhead." },
  { front: "What is the **heap**?", back: "A pool of free memory from which dynamic data structures are allocated space at run time (and to which it is returned when no longer needed)." },
  { front: "Python open modes: what do `r`, `w`, `a`, `rb`, `wb` do?", back: "`r` read · `w` write (creates or **overwrites**) · `a` append to end · `rb`/`wb` read/write a **binary** file (bytes, not str)." },
  { front: "Give two uses of text files and two uses of binary files.", back: "Text: CSV data, config/log files, source code.\nBinary: images/audio/video, executables, packed numeric data, saved game state." },
  { front: "Why is a binary file usually smaller than a text file holding the same numbers?", back: "Each number is stored in a fixed number of bytes (e.g. 4 for a 32-bit integer) instead of one byte per digit character plus separators." },
  { front: "Steps to insert a new node after node `p` in a linked list.", back: "1. Create the node and store the data.\n2. `new.next ← p.next`\n3. `p.next ← new`\n(Step 2 must come before step 3.)" },
  { front: "How do you delete the node after `prev` in a linked list?", back: "`prev.next ← prev.next.next` — the node is bypassed and its memory returned to the heap. Deleting the first node: `head ← head.next`." },
  { front: "Array vs linked list: which is faster for (a) access to item n, (b) inserting in the middle?", back: "(a) Array — direct access by index.\n(b) Linked list — change two pointers; an array must shuffle later items." },
  { front: "How do you visit every element of a 2-D array `grid` with R rows and C columns?", back: "Nested loops: `FOR r ← 0 TO R-1` then inside `FOR c ← 0 TO C-1`, using `grid[r][c]`." },
  { front: "Array vs record: what is the key difference?", back: "Array: many items of the **same** type, accessed by index. Record: a fixed set of **named fields** that can have **different** types." },
]);
