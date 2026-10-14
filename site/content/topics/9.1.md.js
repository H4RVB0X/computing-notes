CS.registerTopic({ id: "9.1", title: "Communication methods and basics" }, function () {/*

:::objectives
- Define **serial** and **parallel** transmission and explain why serial has taken over for almost every external link.
- Explain **skew** and **crosstalk** and why they limit parallel links at high speed and over long distances.
- Define and compare **synchronous** and **asynchronous** transmission and state the purpose of **start** and **stop bits** (and parity bits).
- Define **baud rate**, **bit rate**, **bandwidth**, **latency** and **protocol** in mark-scheme wording.
- Calculate bit rate from baud rate when each signal change encodes more than one bit, and explain why bit rate is directly proportional to bandwidth.
:::

:::quick At a glance
- **Serial**: bits sent **one after another** down a **single** wire/channel. **Parallel**: several bits sent **simultaneously** down **several** parallel wires.
- Parallel suffers from **skew** (bits drift out of step) and **crosstalk** (interference between neighbouring wires), so it is limited to **short distances**.
- Serial is **cheaper** (fewer wires, smaller connectors), works over **longer distances** and can be clocked **much faster**, which is why USB, SATA, PCIe and Ethernet are serial.
- **Synchronous**: sender and receiver share a **clock signal**; data flows in a continuous, timed stream.
- **Asynchronous**: no shared clock; each character is framed by a **start bit** (wakes the receiver and synchronises its clock) and a **stop bit** (marks the end and gives the receiver time to process).
- **Baud rate** = signal changes per second. **Bit rate** = bits per second. With *n* bits per signal change, **bit rate = baud rate × n**.
- **Bandwidth**: bit rate is **directly proportional** to bandwidth. **Latency**: the **delay** between something starting and its first effect.
- **Protocol**: a **set of rules** relating to communication between devices.
:::

:::keyterms
Serial transmission :: Data is sent one bit at a time, one after another, along a single wire or channel. :: A single-file queue of bits.
Parallel transmission :: Several bits are sent simultaneously, each along its own wire, in a multi-wire link. :: A row of runners, one per lane.
Skew :: In parallel transmission, bits sent at the same moment arrive at slightly different times because the wires have slightly different properties. :: The runners drift out of line, so you can't tell which bits belong together.
Crosstalk :: Electromagnetic interference between adjacent wires, where the signal in one wire corrupts the signal in a neighbouring wire. :: Wires "overhearing" each other.
Synchronous transmission :: Data is transferred where the pulses are timed by a clock signal shared by (or recovered by) the sender and receiver. :: Both ends march to the same drumbeat.
Asynchronous transmission :: The arrival of data cannot be predicted by the receiver, so a start bit signals the arrival of each character and temporarily synchronises the receiver with the sender. :: Data turns up whenever; each chunk announces itself.
Start bit :: A bit sent before the data that signals its arrival, wakes the receiver and synchronises the receiver's clock for the duration of the character. :: "Here comes a byte, start your stopwatch."
Stop bit :: A bit (or bits) sent after the data, of opposite value to the start bit, that marks the end of the character and gives the receiver time to process it. :: "That's the lot, take a breath."
Baud rate :: The rate at which the signal on a line can change; one baud is one signal change per second. :: How many times per second the line changes state.
Bit rate :: The number of bits transmitted per second. :: How much data actually moves each second.
Bandwidth :: The range of signal frequencies a channel can carry; bit rate is directly proportional to bandwidth. :: The size of the pipe; a bigger pipe allows a higher bit rate.
Latency :: The time delay between the moment something is initiated and the moment its first effect begins. :: The lag before anything happens.
Protocol :: A set of rules relating to communication between devices. :: The agreed "language and manners" both ends must follow.
:::

## Why this matters

Every network topic you meet later (Ethernet, WiFi, TCP/IP) sits on top of these basics. The exam asks for **definitions** word for word, **comparisons** (serial v parallel, synchronous v asynchronous) and short **calculations** (baud rate to bit rate). They are easy marks if you are precise.

## Serial and parallel transmission

:::definition
- **Serial**: bits are sent **one after another** along a **single** wire (plus a return/ground wire).
- **Parallel**: **several bits are sent at the same time**, each along its **own** wire, e.g. 8 data wires carry one byte per clock tick.
:::

:::figure Serial sends a stream down one wire; parallel sends a byte at once across eight wires, where skew lets the bits drift out of step
<svg class="diagram" viewBox="0 0 680 300" role="img" aria-label="Serial transmission on one wire compared with parallel transmission on eight wires showing skew">
  <defs><marker id="arr91" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor">
    <text x="170" y="24" text-anchor="middle" font-size="15" font-weight="bold">Serial</text>
    <rect x="15" y="70" width="80" height="50" rx="6" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="55" y="100" text-anchor="middle">Sender</text>
    <rect x="250" y="70" width="80" height="50" rx="6" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="290" y="100" text-anchor="middle">Receiver</text>
    <line x1="95" y1="95" x2="248" y2="95" stroke="currentColor" stroke-width="2" marker-end="url(#arr91)"/>
    <text x="172" y="86" text-anchor="middle" font-family="monospace" font-size="14">1 0 1 1 0 0 1 0</text>
    <text x="172" y="145" text-anchor="middle">one wire, one bit at a time</text>
    <text x="172" y="180" text-anchor="middle" font-size="12">+ cheaper, fewer wires</text>
    <text x="172" y="198" text-anchor="middle" font-size="12">+ no skew, little crosstalk</text>
    <text x="172" y="216" text-anchor="middle" font-size="12">+ long distances, very high clock rates</text>
    <text x="510" y="24" text-anchor="middle" font-size="15" font-weight="bold">Parallel (8 wires)</text>
    <rect x="370" y="40" width="70" height="200" rx="6" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="405" y="145" text-anchor="middle">Sender</text>
    <rect x="595" y="40" width="75" height="200" rx="6" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="632" y="145" text-anchor="middle">Receiver</text>
    <g stroke="currentColor" stroke-width="1.5">
      <line x1="440" y1="55" x2="593" y2="55" marker-end="url(#arr91)"/>
      <line x1="440" y1="79" x2="593" y2="79" marker-end="url(#arr91)"/>
      <line x1="440" y1="103" x2="593" y2="103" marker-end="url(#arr91)"/>
      <line x1="440" y1="127" x2="593" y2="127" marker-end="url(#arr91)"/>
      <line x1="440" y1="151" x2="593" y2="151" marker-end="url(#arr91)"/>
      <line x1="440" y1="175" x2="593" y2="175" marker-end="url(#arr91)"/>
      <line x1="440" y1="199" x2="593" y2="199" marker-end="url(#arr91)"/>
      <line x1="440" y1="223" x2="593" y2="223" marker-end="url(#arr91)"/>
    </g>
    <g font-family="monospace" font-size="14">
      <text x="505" y="50">1</text><text x="513" y="74">0</text><text x="499" y="98">1</text><text x="521" y="122">1</text>
      <text x="508" y="146">0</text><text x="494" y="170">0</text><text x="511" y="194">1</text><text x="526" y="218">0</text>
    </g>
    <text x="510" y="265" text-anchor="middle">all 8 bits sent together…</text>
    <text x="510" y="285" text-anchor="middle">…but skew means they arrive at slightly different times</text>
  </g>
</svg>
:::

### Why parallel seemed faster, and why it lost

On paper, parallel is 8 (or 16, 32…) times faster than serial at the same clock rate: it moves a whole byte per tick. In practice two physical problems cap the clock rate and the cable length.

:::columns
**Skew**
- Each wire has slightly different length, resistance and capacitance, so bits sent together **arrive at slightly different times**.
- The receiver samples all wires on one clock tick. If a bit is late it gets read as part of the **next** byte.
- Skew gets **worse with distance** and matters **more at high clock rates**, because each bit's time slot is shorter.
|||
**Crosstalk**
- A changing current in one wire creates an electromagnetic field that **induces a signal in neighbouring wires**.
- Parallel cables pack many signal wires side by side, so there is lots of crosstalk.
- It gets **worse at higher frequencies** and over **longer** runs, corrupting data that then has to be re-sent.
:::

Serial has neither problem to the same degree: there is only one data wire per direction, so nothing can drift out of step with it, and far fewer neighbouring wires to interfere. That means a serial link can be **clocked much faster** than a parallel one. A fast serial link ends up moving more bits per second than a slower-clocked parallel bus.

:::why Why serial now dominates, even inside the box
- **Speed**: freed from skew, serial links run at gigabits per second (USB, SATA, PCI Express, Ethernet).
- **Cost and size**: fewer wires, thinner cables, smaller connectors with fewer pins, cheaper to make.
- **Distance**: serial works over long cables (and fibre), parallel only over centimetres to a few metres.
- **Examples of the switch**: parallel printer port → USB; PATA (IDE ribbon cable) → SATA; PCI → PCI Express (which uses independent serial *lanes*).
- Parallel is still used over **very short distances** where wires can be matched precisely, e.g. the data and address **buses on the motherboard and inside the processor**.
:::

| | Serial | Parallel |
|---|---|---|
| Wires for data | one (per direction) | several, e.g. 8, 16, 32 |
| Bits per clock tick | 1 | one per wire |
| Skew | none | yes, limits speed and length |
| Crosstalk | low | high (many adjacent wires) |
| Max practical distance | long (metres to kilometres) | short (centimetres to a few metres) |
| Cost | cheaper cable and connectors | more expensive |
| Typical uses today | USB, SATA, Ethernet, PCIe, fibre | internal buses on the motherboard/CPU |

:::trap
- "Parallel is faster" on its own **scores nothing** in a compare question. Say it can transfer more bits per clock tick **over short distances**, but skew and crosstalk stop it running at high clock rates or over long distances.
- **Skew ≠ crosstalk.** Skew is about **timing** (bits arriving at different times). Crosstalk is about **interference** (one wire corrupting another). Name the right one.
- Don't say serial "can't have errors". It can; it just doesn't suffer from skew and suffers far less crosstalk.
:::

## Synchronous and asynchronous transmission

This is about **timing**: how does the receiver know *when* to read each bit? It is a separate question from serial v parallel; you can have synchronous serial, asynchronous serial and synchronous parallel.

### Synchronous transmission

- The sender and receiver are kept in step by a **shared clock signal**: either a separate clock wire, or timing information carried within the data stream.
- Data flows as a **continuous stream** (often large blocks) at a constant rate; the receiver reads each bit on the clock tick.
- No start/stop bits per character, so **more of the transmission is useful data**: it is more efficient for large transfers.
- Used inside the computer (the **system clock** times the data, address and control buses) and on high-speed links.

### Asynchronous transmission

- There is **no shared clock**. Data is sent **whenever it is ready**, one character (typically 7 or 8 bits) at a time, with idle gaps between characters.
- Because the receiver cannot predict when data will arrive, each character is wrapped in a **frame**:
  - a **start bit** before the data,
  - the data bits (optionally followed by a **parity bit**),
  - one or more **stop bits** after the data.
- Between characters the line sits in its **idle** state (logic 1). The start bit is the opposite value (0), so the change from 1 to 0 is an unmistakable signal that data is coming.

:::figure Asynchronous frame for the character A (7-bit ASCII 1000001) with an even parity bit
<svg class="diagram" viewBox="0 0 680 210" role="img" aria-label="Signal waveform: idle high, start bit low, seven data bits 1000001, parity 0, stop bit high">
  <g font-family="inherit" font-size="13" fill="currentColor">
    <text x="12" y="64">1</text><text x="12" y="124">0</text>
    <line x1="25" y1="60" x2="660" y2="60" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="4 4"/>
    <line x1="25" y1="120" x2="660" y2="120" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="4 4"/>
    <rect x="80" y="40" width="50" height="100" fill="#ff9f7c" fill-opacity="0.3"/>
    <rect x="130" y="40" width="350" height="100" fill="#7c9aff" fill-opacity="0.2"/>
    <rect x="480" y="40" width="50" height="100" fill="#c58cff" fill-opacity="0.3"/>
    <rect x="530" y="40" width="50" height="100" fill="#6fd39a" fill-opacity="0.3"/>
    <polyline fill="none" stroke="currentColor" stroke-width="2.5" points="25,60 80,60 80,120 130,120 130,60 180,60 180,120 430,120 430,60 480,60 480,120 530,120 530,60 660,60"/>
    <g font-family="monospace" font-size="14" text-anchor="middle">
      <text x="105" y="34">0</text><text x="155" y="34">1</text><text x="205" y="34">0</text><text x="255" y="34">0</text><text x="305" y="34">0</text><text x="355" y="34">0</text><text x="405" y="34">0</text><text x="455" y="34">1</text><text x="505" y="34">0</text><text x="555" y="34">1</text>
    </g>
    <text x="50" y="160" text-anchor="middle">idle</text>
    <text x="105" y="160" text-anchor="middle">start</text>
    <text x="305" y="160" text-anchor="middle">7 data bits: 1000001 (A)</text>
    <text x="505" y="160" text-anchor="middle">parity</text>
    <text x="555" y="160" text-anchor="middle">stop</text>
    <text x="620" y="160" text-anchor="middle">idle</text>
    <text x="340" y="195" text-anchor="middle">10 bits on the line to deliver 7 bits of data; the 1→0 edge of the start bit starts the receiver's timing</text>
  </g>
</svg>
:::

:::definition Purpose of the start and stop bits (learn these)
- **Start bit**: signals the **arrival of data**, **wakes up the receiver** and **synchronises the receiver's clock** with the sender's for the duration of the character, so it samples each following bit at the right moment.
- **Stop bit**: signals the **end of the data**, returns the line to the idle state so the **next start bit can be detected**, and gives the receiver **time to process** (e.g. store) the character before the next one arrives.
:::

:::note Parity bits ride along in the same frame
With **even parity** the parity bit is chosen so the total number of 1s (data + parity) is even; with **odd parity**, odd. The receiver recounts: a mismatch means an error, so the character is re-sent. Parity detects any **single-bit** (any odd number of bit) errors but cannot detect two bits flipping, and cannot say *which* bit is wrong. More in [5.6](#/topic/5.6).
:::

::::tabs
:::tab Python
```python
def frame(char, parity="even"):
    """Build an asynchronous frame: start bit, 7-bit ASCII, parity bit, stop bit."""
    data = format(ord(char), "07b")          # 7-bit ASCII code
    ones = data.count("1")
    if parity == "even":
        p = "0" if ones % 2 == 0 else "1"
    else:  # odd parity
        p = "1" if ones % 2 == 0 else "0"
    return "0" + data + p + "1"              # start = 0, stop = 1

print(frame("A"))          # 0100000101
print(frame("C"))          # 0100001111
print(frame("C", "odd"))   # 0100001101
print(8 / 11)              # efficiency of 8 data bits in an 11-bit frame -> 0.727...
```
:::
:::tab AQA pseudocode
```pseudocode
data ← "1000011"
ones ← 0
FOR i ← 0 TO 6
    IF data[i] = "1" THEN
        ones ← ones + 1
    ENDIF
ENDFOR
IF ones MOD 2 = 0 THEN
    parity ← "0"
ELSE
    parity ← "1"
ENDIF
frame ← "0" + data + parity + "1"
OUTPUT frame
```
:::
::::

{{trace:9.1-1}}

| | Synchronous | Asynchronous |
|---|---|---|
| Timing | shared clock signal keeps both ends in step | no shared clock; receiver re-synchronised by each start bit |
| Unit of data | continuous stream / large blocks | one character at a time, with gaps |
| Extra bits | none per character | start + stop (+ parity) per character |
| Efficiency | higher, nearly all bits are data | lower, e.g. 8 data bits in a 10-bit frame = 80% |
| Typical use | buses inside the computer, high-speed links | simple low-speed links where data is sporadic, e.g. a basic serial port between a microcontroller and a PC |

:::trap
- Start and stop bits belong to **asynchronous** transmission. Saying synchronous uses them loses the mark.
- "The start bit synchronises the **clocks**" is the key phrase. "Tells the computer data is coming" alone is usually only half the mark.
- The stop bit is the **opposite** value to the start bit. If it weren't, the receiver couldn't see the next start bit arrive.
- Synchronous/asynchronous is **not** the same thing as parallel/serial. Don't mix the pairs up in a comparison.
:::

## Baud rate, bit rate, bandwidth and latency

### Baud rate and bit rate

- **Baud rate**: the number of **signal changes per second** (one baud = one change per second). Each distinct signal state is called a **symbol**.
- **Bit rate**: the number of **bits transmitted per second** (bps).

If the line only has two voltage levels, each symbol carries one bit, so bit rate = baud rate. But if the line can be set to **more than two levels**, each symbol can carry **several bits**:

| Signal levels | Bits per signal change | Because |
|---|---|---|
| 2 | 1 | 2<sup>1</sup> = 2 |
| 4 | 2 | 2<sup>2</sup> = 4 |
| 8 | 3 | 2<sup>3</sup> = 8 |
| 16 | 4 | 2<sup>4</sup> = 16 |

:::definition The relationship
**bit rate = baud rate × bits per signal change**, where bits per signal change = log<sub>2</sub>(number of levels).
So **bit rate can be higher than baud rate** when more than one bit is encoded in each signal change, and never lower (for a single channel).
:::

:::figure Multi-level signalling: four voltage levels, so each signal change carries 2 bits
<svg class="diagram" viewBox="0 0 680 240" role="img" aria-label="A signal using four voltage levels, each representing two bits; six symbols carry twelve bits">
  <g font-family="inherit" font-size="13" fill="currentColor">
    <text x="12" y="54" font-family="monospace">11 (7.5 V)</text>
    <text x="12" y="94" font-family="monospace">10 (5 V)</text>
    <text x="12" y="134" font-family="monospace">01 (2.5 V)</text>
    <text x="12" y="174" font-family="monospace">00 (0 V)</text>
    <g stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="4 4">
      <line x1="95" y1="50" x2="650" y2="50"/><line x1="95" y1="90" x2="650" y2="90"/><line x1="95" y1="130" x2="650" y2="130"/><line x1="95" y1="170" x2="650" y2="170"/>
    </g>
    <polyline fill="none" stroke="#7c9aff" stroke-width="3" points="100,90 190,90 190,50 280,50 280,170 370,170 370,130 460,130 460,50 550,50 550,90 640,90"/>
    <g font-family="monospace" font-size="15" text-anchor="middle">
      <text x="145" y="200">10</text><text x="235" y="200">11</text><text x="325" y="200">00</text><text x="415" y="200">01</text><text x="505" y="200">11</text><text x="595" y="200">10</text>
    </g>
    <text x="370" y="230" text-anchor="middle">6 symbols (signal states) carry 12 bits: bit rate = 2 × baud rate</text>
  </g>
</svg>
:::

:::example Worked example: baud rate to bit rate
**Q:** A line runs at 1200 baud. Each signal change can be one of **4** voltage levels. Calculate the bit rate.

1. Number of bits per signal change: 4 levels = 2<sup>2</sup>, so **2 bits** per change (00, 01, 10, 11).
2. bit rate = baud rate × bits per change = 1200 × 2 = **2400 bps**.

**Q2:** The same line is upgraded to **8** levels at the same baud rate. New bit rate?
1. 8 = 2<sup>3</sup>, so 3 bits per change.
2. 1200 × 3 = **3600 bps**.

**Q3 (reverse):** A link must carry 9600 bps using 16 signal levels. What baud rate is needed?
1. 16 = 2<sup>4</sup>, so 4 bits per change.
2. baud rate = bit rate ÷ bits per change = 9600 ÷ 4 = **2400 baud**.
:::

```python
import math

def bits_per_change(levels):
    return int(math.log2(levels))

def bit_rate(baud, levels):
    return baud * bits_per_change(levels)

print(bit_rate(1200, 4))     # 2400
print(bit_rate(1200, 8))     # 3600
print(9600 // bits_per_change(16))   # 2400 baud needed
```

:::why Why not just add more and more levels?
The more levels you squeeze into the same voltage range, the **closer together** they are, so a little noise can make one level look like its neighbour. More levels need a cleaner channel; that is the trade-off engineers balance.
:::

### Bandwidth

- **Bandwidth** is, formally, the **range of signal frequencies** a transmission medium can carry (measured in hertz). In everyday speech people use it to mean the **maximum data capacity** of a link.
- The AQA point to learn: **bit rate is directly proportional to bandwidth**. Double the bandwidth and you can (in principle) double the bit rate.
- Think of a motorway: bandwidth is the number of lanes (capacity); the bit rate is how much traffic is actually flowing, which can never exceed what the lanes allow.

### Latency

- **Latency** is the **time delay** between the moment something is initiated and the moment its first effect begins, e.g. between clicking a link and the first data arriving.
- Causes: the **distance** the signal travels (satellite links are notoriously laggy), the **number of devices/hops** it passes through (each router queues and processes packets), and **congestion**.
- Latency is **not** the same as bandwidth. A link can have huge bandwidth and still high latency (a lorry full of hard drives has enormous bandwidth but latency of hours!). Online gaming and video calls care about low latency; downloading a large file cares more about bandwidth.

:::trap
- **Baud rate is not bits per second.** It is signal changes per second. Only on a 2-level line are they equal.
- When asked for the **relationship between bit rate and bandwidth**, write "**directly proportional**". Vague answers like "linked" get nothing.
- Latency is a **delay** (a time), not a speed. Don't define it as "how fast data is sent".
:::

## Protocols

:::definition
A **protocol** is a **set of rules relating to communication between devices**.
:::

Why they are needed: devices from **different manufacturers**, running different software, must interpret the bits the same way. A protocol agrees things like:
- the **format** of the data (how a frame or packet is laid out, how many bits, what each field means),
- the **transmission speed** (bit/baud rate),
- **synchronous or asynchronous** timing, and serial or parallel,
- **error checking** (parity, checksums) and what to do when errors are found,
- how a connection is **started, maintained and ended** (handshaking).

You will meet many named protocols later: Ethernet and WiFi at the link layer ([9.2](#/topic/9.2)), IP and TCP ([9.5](#/topic/9.5)), HTTP, FTP, SMTP, POP3 and SSH at the application layer.

:::note Not on the AQA specification: baseband and broadband
Your school slides mention *baseband* (one signal uses the whole channel) and *broadband* (many channels share one cable at different frequencies). These terms are **not on the AQA 7517 specification**, so you will not be examined on them. Don't spend revision time there.
:::

:::exam
- **Define** questions (1 mark each): use the keyterm wording above. "Baud rate: the rate at which the signal on a line can change." "Latency: the time delay between something being initiated and its first effect."
- **"Explain why serial is used rather than parallel for a long cable"** (2–4 marks): name **skew** and explain it (bits arrive at different times, so become out of sync), name **crosstalk** (interference between adjacent wires), add **cost** (fewer wires) and **higher achievable clock rates**.
- **"Explain the purpose of the start and stop bits"** (2–4 marks): start bit → signals arrival of data / synchronises receiver clock; stop bit → signals end / gives the receiver time to process / allows the next start bit to be recognised.
- **Calculations**: always show bits per signal change (log<sub>2</sub> of levels) and then multiply. Include units (bps, baud).
- **"Explain the difference between baud rate and bit rate"**: definitions of both + "bit rate can be higher because more than one bit can be encoded in each signal change".
:::

:::challenge
1. USB 2.0 has a single differential data pair and no separate clock wire, yet is described as synchronous at the bit level. How can a receiver stay in step with no clock wire? (Research "clock recovery" or "NRZI with bit stuffing".)
2. A frame uses 1 start bit, 8 data bits, 1 parity bit and 2 stop bits. What percentage of the line's bit rate is useful data? How many characters per second can a 9600 bps line carry?
3. Why does a 5 GHz WiFi signal (more bandwidth) suit a crowded flat full of video streams, while a 2.4 GHz signal reaches further? Relate this to bandwidth and noise.
:::

:::recap
- Serial = one bit at a time on one wire; parallel = several bits at once on several wires.
- Parallel is limited by **skew** (timing drift) and **crosstalk** (interference); serial is cheaper, longer-range and can be clocked faster, so it dominates.
- Synchronous = shared clock, continuous stream, no start/stop bits. Asynchronous = no shared clock, each character framed by start and stop bits.
- Start bit: signals arrival and synchronises the receiver's clock. Stop bit: marks the end and gives time to process; opposite value to start bit.
- Baud rate = signal changes per second; bit rate = bits per second; **bit rate = baud × bits per change**.
- Bit rate is **directly proportional** to bandwidth. Latency = delay before the first effect. Protocol = set of rules for communication.
:::

:::related
- [5.6 Character coding and error checking](#/topic/5.6) — parity bits and checksums
- [7.1 Internal hardware components and buses](#/topic/7.1) — parallel buses inside the computer
- [9.2 Networking: topologies, types and wireless](#/topic/9.2)
- [9.5 TCP/IP, protocols, ports and sockets](#/topic/9.5)
:::

*/});
