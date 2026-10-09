CS.registerFlashcards("2.2", [
  { front: "Circular queue: pseudocode for **add(item)** (with a size counter).", back: "IF size = MAX THEN error\nELSE rear ← (rear + 1) MOD MAX; q[rear] ← item; size ← size + 1" },
  { front: "Circular queue: pseudocode for **remove()**.", back: "IF size = 0 THEN error\nELSE item ← q[front]; front ← (front + 1) MOD MAX; size ← size − 1; RETURN item" },
  { front: "Linear queue: tests for empty and full.", back: "Empty: size = 0 (or front > rear). Full: rear = MAX − 1 — even if slots at the start are free." },
  { front: "Circular queue: tests for empty and full (size counter).", back: "Empty: size = 0. Full: size = MAX." },
  { front: "Why use a circular queue rather than a linear queue?", back: "A linear queue cannot reuse space freed at the front, so it 'fills up' with empty slots. A circular queue wraps its pointers with MOD to reuse them, keeping add/remove O(1)." },
  { front: "Priority queue: rule for equal priorities?", back: "Equal-priority items leave in FIFO order — a new item goes **behind** every item of the same or higher priority." },
  { front: "Two array implementations of a priority queue.", back: "1. Insert in priority order on add, remove from front (fast remove).\n2. Add at rear, search for highest priority on remove (fast add)." },
  { front: "Give four uses of queues.", back: "Print spooler · keyboard buffer · process scheduling · network/packet buffers · BFS · simulations" },
  { front: "MAX = 5, rear = 4. Where does the next item go in a circular queue?", back: "Index 0, because (4 + 1) MOD 5 = 0 (as long as the queue is not full)." },
]);
