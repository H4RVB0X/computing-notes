CS.registerTrace({
  id: "10.5-1", topic: "10.5", title: "The lost update", lang: "text",
  intro: "A warehouse record holds **Stock = 20**. Transaction **T1** sells 6 items and transaction **T2** sells 4. They run concurrently **with no concurrency control**, interleaved as shown. Each transaction keeps its own local copy of the value it read.",
  code: "t1  T1: READ Stock\nt2  T2: READ Stock\nt3  T1: local ← local − 6\nt4  T2: local ← local − 4\nt5  T1: WRITE Stock ← local\nt6  T2: WRITE Stock ← local",
  columns: ["Time", "T1 local value", "T2 local value", "Stock in database"],
  prefill: [["t1", "", "", ""], ["t2", "", "", ""], ["t3", "", "", ""], ["t4", "", "", ""], ["t5", "", "", ""], ["t6", "", "", ""]],
  rows: [["t1", "20", "", "20"], ["t2", "20", "20", "20"], ["t3", "14", "20", "20"], ["t4", "14", "16", "20"], ["t5", "14", "16", "14"], ["t6", "14", "16", "16"]],
  instructions: "Fill in every cell with the value held at the end of that step. Leave a transaction's cell blank only before it has read anything.",
  hint: "Both transactions read 20 before either writes. Each then writes its own answer, so the last write wins.",
  note: "The final stock is 16, but 10 items have gone so it should be 10. T1's update (to 14) was **lost** because T2 read the record before T1 wrote. A record lock on Stock at t1 would have made T2 wait and read 14, giving 10.",
});
