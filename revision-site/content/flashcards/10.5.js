CS.registerFlashcards("10.5", [
  { front: "Name the four concurrency control methods in the AQA spec.", back: "Record locks · serialisation · timestamp ordering · commitment ordering" },
  { front: "Describe the lost update in 4 steps.", back: "T1 reads value · T2 reads same value · T1 writes its update · T2 writes its update, overwriting T1's → T1's update is lost" },
  { front: "Record locking: how and drawback?", back: "Record locked while one transaction updates it; others wait until it is released. Drawback: **deadlock** (and waiting)." },
  { front: "Timestamp ordering: how?", back: "Each transaction gets a timestamp when it starts; conflicting operations must happen in timestamp order; a transaction that would break the order is aborted and restarted." },
  { front: "Commitment ordering: how?", back: "An algorithm works out a safe order in which to commit conflicting transactions, based on their dependencies/impact, so they cannot interfere; avoids deadlock." },
  { front: "Serialisation: how?", back: "Transactions are not allowed to overlap; the outcome is as if they ran one at a time." },
  { front: "Give four advantages of a client-server database.", back: "Simultaneous multi-user access · one consistent central copy · central security/access control · central backup and concurrency control" },
]);
