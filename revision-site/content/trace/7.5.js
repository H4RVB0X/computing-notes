CS.registerTrace({
  id: "7.5-1",
  topic: "7.5",
  title: "Hard disk access time",
  lang: "text",
  intro: "Complete the table for three hard disks. **Average rotational latency = half the time for one revolution.** Average access time = seek time + average rotational latency (ignore transfer time).\n\nGive **every** time in milliseconds **to exactly 2 decimal places**, typed as a number only (e.g. `8.33`, `4.00`). Give revolutions per second as a whole number (e.g. `120`).",
  code: "revolutions per second = rpm ÷ 60\ntime for one revolution (ms) = 1000 ÷ revolutions per second\naverage rotational latency (ms) = time for one revolution ÷ 2\naverage access time (ms) = seek time + average rotational latency",
  columns: ["Disk", "Revs per second", "One revolution (ms)", "Avg latency (ms)", "Avg access time (ms)"],
  prefill: [
    ["5,400 rpm, seek 10 ms", "", "", "", ""],
    ["7,200 rpm, seek 9 ms", "", "", "", ""],
    ["15,000 rpm, seek 4 ms", "", "", "", ""],
  ],
  rows: [
    ["5,400 rpm, seek 10 ms", "90", "11.11", "5.56", "15.56"],
    ["7,200 rpm, seek 9 ms", "120", "8.33", "4.17", "13.17"],
    ["15,000 rpm, seek 4 ms", "250", "4.00", "2.00", "6.00"],
  ],
  hint: "7,200 rpm: 7200 ÷ 60 = 120 revs/s → one revolution = 1000 ÷ 120 = 8.33 ms → average latency = 4.17 ms.",
  note: "Compare an SSD, whose access time is about 0.1 ms: no seek and no rotational latency, because there are no moving parts.",
});
