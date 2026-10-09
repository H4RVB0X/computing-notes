CS.registerFlashcards("9.1", [
  { front: "Give **four** reasons why serial links have replaced parallel links for external connections.", back: "No skew · much less crosstalk · can be clocked faster so higher bit rate · works over longer distances · fewer wires so cheaper, thinner cables and smaller connectors" },
  { front: "Formula linking baud rate and bit rate", back: "bit rate = baud rate × bits per signal change, where bits per change = log₂(number of signal levels)" },
  { front: "How many bits per signal change with 2, 4, 8, 16 levels?", back: "1, 2, 3, 4 (because 2¹, 2², 2³, 2⁴)" },
  { front: "Purpose of the **start bit** (two points)", back: "Signals the arrival of data / wakes the receiver; synchronises the receiver's clock with the sender for that character." },
  { front: "Purpose of the **stop bit** (two points)", back: "Marks the end of the character and returns the line to idle so the next start bit can be seen; gives the receiver time to process the data." },
  { front: "Even parity: what parity bit goes with 1100101?", back: "1100101 has four 1s (even), so the parity bit is **0**." },
  { front: "Skew vs crosstalk in one line each", back: "Skew: bits sent together on parallel wires arrive at different times. Crosstalk: a signal in one wire interferes with a neighbouring wire." },
  { front: "Latency vs bandwidth", back: "Latency = delay before the first effect (a time). Bandwidth = capacity of the channel; bit rate is directly proportional to it." },
  { front: "Synchronous vs asynchronous: which is more efficient for large transfers and why?", back: "Synchronous: there are no start/stop bits for each character, so almost all transmitted bits are data." },
]);
