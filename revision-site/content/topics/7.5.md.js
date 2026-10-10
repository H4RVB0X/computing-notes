CS.registerTopic({ id: "7.5", title: "External hardware devices" }, function () {/*

:::objectives
- Explain the **principles of operation** of a **barcode reader**, **digital camera**, **laser printer** and **RFID** system, and judge when each is **suitable**.
- Explain the **need for secondary storage**.
- Describe how a **hard disk**, an **optical disc** and a **solid-state drive (SSD)** store and retrieve data.
- **Compare** storage devices on capacity, speed, cost per GB, durability and portability.
- **Choose and justify** a storage device for a given scenario.
:::

:::quick At a glance
- **Barcode reader**: light shines on the code; **dark bars reflect little, white spaces reflect a lot**; a photo-sensor turns the reflected light into a pattern of pulses → binary → digits (checked with the **check digit**). Laser, CCD and camera-based readers; **2D/QR codes need an image sensor (camera)**.
- **Digital camera**: lens focuses light onto a **sensor (CCD or CMOS)** — a grid of **photosites** that produce a charge proportional to light intensity. A **Bayer filter** gives each photosite a red, green or blue filter; an **ADC** digitises; processing makes each pixel's RGB value.
- **Laser printer**: **charge the drum** → **laser** discharges the image areas → charged **toner** sticks to those areas → **charged paper** pulls the toner off → **fuser** (heat + pressure) melts it on → drum cleaned.
- **RFID**: tag = **chip + antenna**. **Passive** tags have **no battery**: the reader's field **induces a current** in the tag's coil, powering it to send its data back (cm to a few m). **Active** tags have a **battery** and transmit themselves (up to ~100 m+). **No line of sight** needed.
- **Secondary storage** is **non-volatile**, **high-capacity** and **cheap per GB**: main memory is volatile, small and expensive.
- **HDD**: magnetised spots on spinning **platters**, read/write **heads** on an arm; **access time = seek time + rotational latency**. Cheap, big, but moving parts.
- **Optical**: laser reads **pits and lands** on a spiral track; reflection changes = data. Shorter wavelength (CD 780 nm → DVD 650 nm → Blu-ray 405 nm) → smaller pits → more capacity.
- **SSD**: **NAND flash**, electrons trapped in **floating gates**; read/write in **pages**, erase in **blocks**; **wear levelling**; no moving parts → fast, robust, but dearer per GB.
:::

:::keyterms
Barcode reader :: An input device that shines light onto a barcode and detects the reflected light, converting the pattern of bars and spaces into a digital code. :: Turns stripes into a number by measuring reflected light.
QR code :: A two-dimensional matrix barcode that stores data in both directions, holding more data and including error correction; read by an image sensor. :: A square barcode a phone camera can read.
Image sensor (CCD/CMOS) :: A grid of light-sensitive photosites, each generating an electrical charge proportional to the intensity of light falling on it. :: The chip in a camera that measures light at each pixel.
Bayer filter :: A mosaic of red, green and blue filters over the photosites (twice as many green), so each photosite measures one colour's intensity. :: A colour grid that lets a light-intensity sensor see colour.
Analogue-to-digital converter (ADC) :: A circuit that samples an analogue signal (e.g. voltage from a photosite) and converts it into a binary value. :: Turns a smooth voltage into a number.
Toner :: Fine, dry, electrically charged powder used by laser printers instead of liquid ink. :: Laser printer "ink" powder.
Fuser :: Heated rollers in a laser printer that melt and press toner permanently onto the paper. :: The hot bit that sticks the toner on.
RFID :: Radio-frequency identification: a system in which a reader uses radio waves to read data from (and sometimes write data to) a tag containing a microchip and an antenna. :: Reading a tag by radio, without needing to see it.
Passive RFID tag :: A tag with no power source of its own; it is powered by electromagnetic induction from the reader's radio field. :: A tag that "borrows" power from the reader.
Active RFID tag :: A tag with its own battery that transmits its own signal, giving a much longer range. :: A tag that shouts its own ID.
Secondary storage :: Non-volatile storage, not directly accessed by the processor, used to store programs and data permanently. :: Where files live when the power is off.
Seek time / rotational latency :: Seek time is the time for an HDD's head to move to the correct track; rotational latency is the time waiting for the required sector to rotate under the head. :: Time to move the arm + time to wait for the disk to spin round.
Pits and lands :: Microscopic depressions (pits) and flat areas (lands) along an optical disc's spiral track, which reflect a laser differently. :: Bumps and flats that the laser reads.
NAND flash memory :: Non-volatile memory in which data is stored as charge trapped in floating-gate (or charge-trap) transistors, read and written in pages and erased in blocks. :: The chips in SSDs, USB sticks and phones.
Wear levelling :: An SSD controller technique that spreads writes evenly across all blocks so that no cells wear out early. :: Sharing the writing out so no part wears out first.
:::

## Barcode readers

A **1D barcode** (e.g. EAN-13 on groceries) encodes digits as a pattern of **black bars and white spaces of different widths**. **Guard bars** at the start, middle and end give the reader reference points, and the last digit is a **check digit** used to detect misreads (see [5.6](#/topic/5.6)).

### How it works

:::steps Reading a barcode
1. A **light source** (LED or laser) illuminates the barcode.
2. **White spaces reflect** most of the light; **black bars absorb** it and reflect little.
3. A **photoelectric sensor** (photodiode, or a row of sensors) detects the reflected light and produces a **voltage**: high for white, low for black.
4. The changing voltage forms a pattern of **electrical pulses** whose lengths match the widths of the bars and spaces.
5. This is converted to **binary** and decoded into the digits; the **check digit** is recalculated to confirm the read was correct.
6. The code is sent to the computer, which looks it up (e.g. product name and price in a database). A beep or green light confirms success.
:::

### Types of reader

| Type | How it works | Pros | Cons / typical use |
|---|---|---|---|
| **Pen / wand** | LED + single photodiode dragged across the code | very cheap | must touch the code at a steady speed; old systems |
| **Laser scanner** | a laser beam is swept across the code by a **rotating mirror** | reads from a distance (tens of cm) and at many angles; fast | moving parts; can't read 2D codes. **Supermarket checkouts** |
| **CCD (linear imager)** | a row of LEDs lights the whole code; a row of hundreds of sensors captures it at once | no moving parts, robust, cheap | short range. Shop counters, libraries |
| **Camera-based (2D imager)** | takes a **photo** of the code and decodes it with software | reads **1D and 2D/QR codes**, damaged or screen-displayed codes | more processing. Phones, boarding passes, tickets |

### 2D codes (QR)

A **QR code** stores data in **both directions** (a grid of black and white squares), so it holds far more — up to 7,089 digits or 4,296 alphanumeric characters — compared with ~13 digits for EAN-13. It has three large **position markers** so it can be read at any angle, and **error-correction** data so it still reads when partly damaged.

Because the data is 2D, a single laser line **can't** read it: it needs an **image sensor** (a camera).

:::tip
Barcodes hold an **identifier**, not the price. The price comes from the database lookup, so prices can change without reprinting the barcode.
:::

## Digital cameras

:::figure Inside a digital camera: lens, Bayer filter, sensor, ADC, processor, memory card
<svg class="diagram" viewBox="0 0 680 210" role="img" aria-label="Light passes through the lens onto a Bayer filter and image sensor; the analogue signal goes to an ADC, then an image processor, then is stored on a memory card.">
  <defs><marker id="arr75" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-size="13" font-family="inherit">
    <text x="20" y="95" font-weight="700">light</text>
    <line x1="20" y1="105" x2="70" y2="105" stroke="currentColor" stroke-width="2" marker-end="url(#arr75)"/>
    <ellipse cx="90" cy="105" rx="14" ry="50" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="90" y="178" text-anchor="middle">lens</text>
    <line x1="106" y1="105" x2="148" y2="105" stroke="currentColor" stroke-width="2" marker-end="url(#arr75)"/>
    <g>
      <rect x="150" y="45" width="30" height="30" fill="#ff7a7a" fill-opacity="0.55" stroke="currentColor"/><rect x="180" y="45" width="30" height="30" fill="#69db7c" fill-opacity="0.55" stroke="currentColor"/>
      <rect x="150" y="75" width="30" height="30" fill="#69db7c" fill-opacity="0.55" stroke="currentColor"/><rect x="180" y="75" width="30" height="30" fill="#4dabf7" fill-opacity="0.55" stroke="currentColor"/>
      <rect x="150" y="105" width="30" height="30" fill="#ff7a7a" fill-opacity="0.55" stroke="currentColor"/><rect x="180" y="105" width="30" height="30" fill="#69db7c" fill-opacity="0.55" stroke="currentColor"/>
      <rect x="150" y="135" width="30" height="30" fill="#69db7c" fill-opacity="0.55" stroke="currentColor"/><rect x="180" y="135" width="30" height="30" fill="#4dabf7" fill-opacity="0.55" stroke="currentColor"/>
      <text x="165" y="65" text-anchor="middle" font-size="12">R</text><text x="195" y="65" text-anchor="middle" font-size="12">G</text><text x="165" y="95" text-anchor="middle" font-size="12">G</text><text x="195" y="95" text-anchor="middle" font-size="12">B</text>
    </g>
    <text x="180" y="30" text-anchor="middle" font-size="12">Bayer filter on sensor</text><text x="180" y="186" text-anchor="middle" font-size="12">(CCD or CMOS photosites)</text>
    <line x1="212" y1="105" x2="268" y2="105" stroke="currentColor" stroke-width="2" marker-end="url(#arr75)"/><text x="240" y="98" text-anchor="middle" font-size="11">analogue</text>
    <rect x="270" y="80" width="90" height="50" rx="8" fill="#ffd43b" fill-opacity="0.3" stroke="currentColor"/><text x="315" y="110" text-anchor="middle" font-weight="700">ADC</text>
    <line x1="360" y1="105" x2="398" y2="105" stroke="currentColor" stroke-width="2" marker-end="url(#arr75)"/><text x="380" y="98" text-anchor="middle" font-size="11">binary</text>
    <rect x="400" y="70" width="130" height="70" rx="8" fill="#b197fc" fill-opacity="0.3" stroke="currentColor"/><text x="465" y="98" text-anchor="middle" font-weight="700">Image processor</text><text x="465" y="118" text-anchor="middle" font-size="11">demosaic, adjust,</text><text x="465" y="132" text-anchor="middle" font-size="11">compress (JPEG)</text>
    <line x1="530" y1="105" x2="568" y2="105" stroke="currentColor" stroke-width="2" marker-end="url(#arr75)"/>
    <rect x="570" y="75" width="95" height="60" rx="8" fill="#35d4bd" fill-opacity="0.25" stroke="currentColor"/><text x="617" y="100" text-anchor="middle" font-weight="700">Memory</text><text x="617" y="118" text-anchor="middle" font-weight="700">card (flash)</text>
  </g>
</svg>
:::

:::steps How a digital camera captures an image
1. The shutter opens and the **lens focuses** light onto the **image sensor**.
2. The sensor is a grid of millions of **photosites**. Each converts light into an **electrical charge proportional to the light's intensity** (brighter → more charge).
3. Photosites only measure brightness, not colour, so a **Bayer filter** sits over them: each photosite has a **red, green or blue** filter (twice as many green, because our eyes are most sensitive to green).
4. The charge (an **analogue** voltage) from each photosite is converted to a **binary** value by an **analogue-to-digital converter (ADC)**.
5. The **image processor** works out a full RGB value for every pixel from each photosite and its neighbours (**demosaicing**), adjusts colour/brightness and usually **compresses** the image (e.g. JPEG).
6. The file is stored on **flash memory** (a memory card or internal storage).
:::

### CCD versus CMOS sensors

| | **CCD** (charge-coupled device) | **CMOS** (complementary metal-oxide semiconductor) |
|---|---|---|
| Read-out | charges are **shifted row by row** to one output amplifier and ADC | **each photosite has its own amplifier**; read out directly (often with many ADCs) |
| Quality | traditionally lower noise, very uniform | now very close; slightly more noise historically |
| Power | **higher** | **lower** (good for battery devices) |
| Speed | slower read-out | **faster** (video, burst shots) |
| Cost | more expensive to make | **cheaper** (same process as other chips) |
| Typical use | scientific/astronomy imaging, older cameras | **phones**, most modern cameras |

:::example Resolution and file size
A camera sensor produces images **4000 × 3000** pixels.
1. Resolution = 4000 × 3000 = **12,000,000 pixels = 12 megapixels**.
2. Uncompressed with 24-bit colour (3 bytes per pixel): 12,000,000 × 3 = **36,000,000 bytes = 36 MB**.
3. That's why cameras compress to JPEG: a typical photo becomes a few MB.
:::

```python Camera image size
width, height = 4000, 3000
bytes_per_pixel = 3          # 24-bit colour
pixels = width * height
print(pixels / 1_000_000, "megapixels")       # 12.0 megapixels
print(pixels * bytes_per_pixel / 1_000_000, "MB uncompressed")  # 36.0 MB uncompressed
```

## Laser printers

A laser printer builds a whole page as a pattern of **static electric charge** on a **photosensitive drum**, then uses that charge to place powdered **toner**.

:::figure Laser printer: the steps around the drum
<svg class="diagram" viewBox="0 0 680 330" role="img" aria-label="Rotating drum with stations around it: 1 charge, 2 laser writes image, 3 toner applied, 4 transfer to charged paper, 5 fuser melts toner, 6 drum cleaned and discharged.">
  <g font-size="13" font-family="inherit">
    <circle cx="300" cy="150" r="80" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor" stroke-width="2"/>
    <text x="300" y="146" text-anchor="middle" font-weight="700">photosensitive</text><text x="300" y="164" text-anchor="middle" font-weight="700">drum</text>
    <path d="M300,55 A95,95 0 0 1 390,120" fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#arr75)"/><text x="360" y="62" font-size="11">rotates</text>
    <rect x="160" y="40" width="110" height="34" rx="8" fill="#ffd43b" fill-opacity="0.3" stroke="currentColor"/><text x="215" y="62" text-anchor="middle">1 Charge drum</text>
    <rect x="420" y="70" width="140" height="34" rx="8" fill="#ff7a7a" fill-opacity="0.25" stroke="currentColor"/><text x="490" y="92" text-anchor="middle">2 Laser writes image</text>
    <line x1="420" y1="96" x2="372" y2="118" stroke="#e03131" stroke-width="2.5"/>
    <rect x="420" y="160" width="140" height="34" rx="8" fill="#b197fc" fill-opacity="0.3" stroke="currentColor"/><text x="490" y="182" text-anchor="middle">3 Toner applied</text>
    <rect x="80" y="160" width="140" height="34" rx="8" fill="#35d4bd" fill-opacity="0.25" stroke="currentColor"/><text x="150" y="182" text-anchor="middle">6 Clean + discharge</text>
    <line x1="80" y1="245" x2="560" y2="245" stroke="currentColor" stroke-width="4"/><text x="90" y="238" font-size="12">paper →</text>
    <rect x="250" y="255" width="120" height="34" rx="8" fill="#ffd43b" fill-opacity="0.3" stroke="currentColor"/><text x="310" y="277" text-anchor="middle">4 Transfer</text>
    <text x="310" y="306" text-anchor="middle" font-size="11">(paper charged to pull toner)</text>
    <rect x="470" y="255" width="150" height="34" rx="8" fill="#ff7a7a" fill-opacity="0.25" stroke="currentColor"/><text x="545" y="277" text-anchor="middle">5 Fuser: heat + press</text>
  </g>
</svg>
:::

:::steps How a laser printer prints a page
1. **Charge**: the drum is given a uniform **electrostatic charge** (e.g. negative) by a charged roller or corona wire.
2. **Write**: a **laser** beam, steered by a rotating mirror, scans across the drum line by line. Where it hits, the drum's photosensitive coating **loses its charge** — so the drum now holds an invisible "charge image" of the page.
3. **Develop**: **toner** particles, given the **same charge** as the drum, are repelled by the still-charged areas and **stick only to the discharged (image) areas**.
4. **Transfer**: the paper is given a **strong opposite (positive) charge**, so as it passes under the drum it **pulls the toner off** onto the paper.
5. **Fuse**: the paper passes through the **fuser** — **heated rollers** melt the toner and **press** it into the fibres so it doesn't smudge.
6. **Clean**: any leftover toner is scraped off and the drum is **discharged** (by a lamp), ready for the next page.

A **colour** laser printer repeats this with four toners: **cyan, magenta, yellow and black (CMYK)**.
:::

:::trap
Textbooks disagree about the **signs** of the charges (some say the toner sticks to the charged areas). Examiners credit the **principle**: drum **charged** → laser **changes the charge** where the image is → **toner attracted** to the image areas → **paper charged** to attract the toner → **heat fuses** it. Don't waste time on positive vs negative unless the question asks.
:::

**Characteristics and suitability**

- **Fast** (prints a whole page at a time; tens of pages per minute), **quiet**, **sharp text**.
- **Low cost per page** and toner lasts thousands of pages, but **higher purchase price**, needs to warm up, and is less good at photographs than inkjet.
- Best for: **offices, schools — high-volume text printing**.

## RFID (radio-frequency identification)

An RFID system has two parts:

- a **tag** (or transponder): a **microchip** storing a unique ID and maybe more data, connected to an **antenna** (a coil);
- a **reader**: a radio **transceiver** with its own antenna, connected to a computer.

### How a passive tag works

:::steps Reading a passive RFID tag
1. The **reader** transmits radio waves, creating an alternating **electromagnetic field** around its antenna.
2. When a tag comes into range, the field **induces a current** in the tag's coil (**electromagnetic induction**). This is the tag's only power source.
3. The current powers the **chip**, which reads its stored data.
4. The tag sends its data back by **modulating** the signal (altering how it reflects/loads the reader's field).
5. The reader **decodes** the signal and passes the data to the computer. (Read/write tags can also have data written to them.)
:::

**Active** tags contain a **battery** and transmit their own signal, so they are bigger, cost more and have a limited battery life — but can be read from much further away.

| | **Passive** | **Active** |
|---|---|---|
| Power | from the reader by **induction** | own **battery** |
| Range | ~10 cm (LF 125 kHz, e.g. pet microchips) · up to ~1 m (HF 13.56 MHz, e.g. contactless cards; NFC only a few cm) · up to ~10 m (UHF ~900 MHz, warehouses) | up to ~100 m or more |
| Size / cost | tiny, cheap (pence) | larger, more expensive |
| Lifetime | almost unlimited | until the battery runs out |
| Uses | contactless bank/travel cards, library books, stock labels, pet chips, passports | vehicle toll tags, tracking shipping containers, high-value equipment |

### Barcode versus RFID

| | Barcode | RFID |
|---|---|---|
| Line of sight | **needed** | **not needed** (reads through packaging) |
| Items at once | one at a time | **many tags at once** (each has a unique ID) |
| Data | fixed when printed | can be **read/write**; more data |
| Durability | easily scratched, dirtied | robust, can be embedded |
| Cost | almost free to print | each tag costs money |
| Problems | damage, poor print | interference from **metal/liquids**; **privacy** (tags read without the owner knowing), cloning/skimming |

## The need for secondary storage

Main memory (RAM) is where running programs and data live, but it can't do everything:

- **RAM is volatile**: its contents are **lost when the power is switched off**. Programs, documents and the OS itself must survive power-off.
- RAM has **limited capacity** and is **expensive per GB** compared with secondary storage.
- We also need storage that can be **removed or transported**, used for **backups** and **archives**, or shared.

So **secondary storage** is **non-volatile**, **high-capacity** and **low cost per GB**. Data is loaded from secondary storage into main memory when it is needed, because the processor can only access main memory directly.

:::trap
- **A hard disk is not main memory.** Your slides list "typical use: PC computer main memory" for hard disks and SSDs — that's wrong. They are **secondary storage**; main memory is RAM (and ROM).
- **Units**: a DVD holds **4.7 GB** (gigabytes), not "2.7 Gb". Capital **B** = bytes, small **b** = bits.
:::

## Hard disk drives (HDD)

:::figure A hard disk: platters, tracks, sectors and the read/write head
<svg class="diagram" viewBox="0 0 680 280" role="img" aria-label="Top view of a disk platter divided into concentric tracks and sectors, with an actuator arm carrying a read/write head over one track; the platter spins on a spindle.">
  <g font-size="13" font-family="inherit">
    <circle cx="200" cy="140" r="120" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor" stroke-width="2"/>
    <circle cx="200" cy="140" r="95" fill="none" stroke="currentColor" stroke-opacity="0.6"/>
    <circle cx="200" cy="140" r="70" fill="none" stroke="currentColor" stroke-opacity="0.6"/>
    <circle cx="200" cy="140" r="45" fill="none" stroke="currentColor" stroke-opacity="0.6"/>
    <circle cx="200" cy="140" r="10" fill="currentColor" fill-opacity="0.5"/>
    <line x1="200" y1="20" x2="200" y2="95" stroke="currentColor" stroke-opacity="0.6"/>
    <line x1="285" y1="55" x2="252" y2="88" stroke="currentColor" stroke-opacity="0.6"/>
    <line x1="320" y1="140" x2="270" y2="140" stroke="currentColor" stroke-opacity="0.6"/>
    <path d="M200,45 A95,95 0 0 1 267,73 L250,90 A70,70 0 0 0 200,70 Z" fill="#ff7a7a" fill-opacity="0.45" stroke="currentColor"/>
    <line x1="520" y1="250" x2="262" y2="98" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
    <circle cx="520" cy="250" r="12" fill="currentColor" fill-opacity="0.4" stroke="currentColor"/>
    <rect x="252" y="88" width="16" height="12" fill="#ffd43b" stroke="currentColor"/>
    <text x="350" y="40" font-weight="700">sector (on a track)</text><line x1="348" y1="44" x2="240" y2="64" stroke="currentColor"/>
    <text x="380" y="110" font-weight="700">read/write head</text><line x1="378" y1="106" x2="270" y2="94" stroke="currentColor"/>
    <text x="545" y="245">actuator arm</text>
    <text x="40" y="275">track = one ring</text>
    <text x="215" y="275">spindle spins the platters</text>
  </g>
</svg>
:::

### Principles of operation

- One or more rigid **platters**, coated with a **magnetic material**, spin on a **spindle** at a constant speed (typically **5,400–7,200 rpm**; servers up to **15,000 rpm**).
- Each surface has a **read/write head** on an **actuator arm**. The heads float a few **nanometres above** the surface on a cushion of air; they never touch it.
- Each surface is divided into concentric **tracks**, and each track into **sectors** (the smallest unit read or written).
- **Writing**: the head's electromagnet **magnetises** tiny regions of the surface in one of two directions (polarities) to represent **1s and 0s**.
- **Reading**: as the magnetised regions pass under the head they **induce small currents** (or change its resistance), which are detected as the bits.

### Access time

To read a sector the drive must:

1. **Seek**: move the arm so the head is over the right **track** → **seek time**.
2. **Wait** for the right **sector** to rotate under the head → **rotational latency** (on average, **half a revolution**).
3. **Transfer** the data.

:::example Average rotational latency
A disk spins at **7,200 rpm**.
1. Revolutions per second = 7,200 ÷ 60 = 120.
2. Time for one revolution = 1 ÷ 120 s = **8.33 ms**.
3. Average rotational latency = half a revolution = **4.17 ms**.
4. With an average seek time of 9 ms, average access time ≈ 9 + 4.17 ≈ **13 ms** (plus a tiny transfer time). Compare an SSD at about **0.1 ms**.

At 15,000 rpm the average latency falls to 60 ÷ 15,000 ÷ 2 = **2 ms** — one reason servers use faster-spinning disks.
:::

```python HDD rotational latency
def avg_latency_ms(rpm):
    one_rev_ms = 60 / rpm * 1000
    return one_rev_ms / 2

for rpm in [5400, 7200, 15000]:
    print(rpm, "rpm:", round(avg_latency_ms(rpm), 2), "ms")
```

```output
5400 rpm: 5.56 ms
7200 rpm: 4.17 ms
15000 rpm: 2.0 ms
```

**Characteristics**: very **high capacity** (several TB) at the **lowest cost per GB**; but **moving parts** make it slower (especially random access), noisier, more power-hungry and vulnerable to **shock** (a knock while running can make a head crash). Files that are **fragmented** across the disk are slower to read because of the extra seeks.

**Suitable for**: bulk storage — desktop data drives, servers, **CCTV recorders**, **backups**, network attached storage.

## Optical discs (CD, DVD, Blu-ray)

### Principles of operation

- The disc is **polycarbonate plastic** with a thin **reflective (aluminium) layer**. Data lies along a **single spiral track** running from the **centre outwards** (not concentric rings like an HDD).
- Along the track are microscopic **pits** and flat **lands**.
- **Reading**: a **low-power laser** is shone onto the spinning disc. Light hitting a land is reflected straight back to a **photodiode**; at the edges of a pit the light is scattered/cancelled, so **less light** returns. The drive detects these changes in reflected light and converts them to **binary**. (Strictly, a **change** between pit and land represents a 1 and no change a 0.)
- **Writing (CD-R / DVD-R)**: a **higher-power laser** "burns" spots into a **dye layer**, making them non-reflective — like pits. This can't be undone (**write once, read many**).
- **Rewriting (RW)**: the recording layer is a **phase-change alloy**. The laser heats spots to switch them between a **reflective crystalline** state and a **dull amorphous** state, which **can be reversed**, so the disc can be erased and rewritten.

:::why Why does Blu-ray hold so much more?
The laser's **wavelength** limits how small a spot it can focus to. A **shorter wavelength** → smaller spot → **smaller pits and tracks packed closer together** → more data on the same-sized disc.

| Format | Laser | Wavelength | Capacity (single layer) |
|---|---|---|---|
| CD | infrared | **780 nm** | **700 MB** |
| DVD | red | **650 nm** | **4.7 GB** (8.5 GB dual-layer) |
| Blu-ray | **blue-violet** | **405 nm** | **25 GB** (50 GB dual-layer) |
:::

**Characteristics**: cheap to mass-produce, light and portable; **ROM** discs can't be altered (good for distribution and legal archives). But **low capacity**, **slow** access (seek along a spiral), easily **scratched**, and drives are disappearing from new computers.

**Suitable for**: distributing films, games and music; long-term archive copies; Blu-ray for HD/4K films.

## Solid-state drives (SSD)

An SSD has **no moving parts**. It is a **controller** chip plus banks of **NAND flash memory**, the same non-volatile memory used in USB sticks, memory cards and phones.

### Principles of operation

- Each memory cell is a transistor with an extra, **electrically insulated "floating gate"** (modern drives use a similar **charge-trap** layer).
- **Writing (programming)**: a high voltage forces electrons **through the insulator** onto the floating gate, where they stay **trapped** even with the power off — that's why flash is **non-volatile**.
- **Reading**: the trapped charge changes the voltage at which the transistor switches on, so the controller can tell a **charged cell (0)** from an **uncharged cell (1)**. (Multi-level cells store 2–4 bits per cell using several charge levels.)
- Cells are grouped into **pages** (typically 4–16 KB), and pages into **blocks** (typically 128–256 pages).

:::figure NAND flash: pages inside blocks
<svg class="diagram" viewBox="0 0 680 170" role="img" aria-label="Two blocks of NAND flash, each made of several pages. Reads and writes happen a page at a time; erasing clears a whole block.">
  <g font-size="13" font-family="inherit">
    <rect x="20" y="20" width="290" height="120" rx="10" fill="none" stroke="currentColor" stroke-width="2"/><text x="30" y="40" font-weight="700">Block 0</text>
    <rect x="370" y="20" width="290" height="120" rx="10" fill="none" stroke="currentColor" stroke-width="2"/><text x="380" y="40" font-weight="700">Block 1</text>
    <g>
      <rect x="35" y="50" width="60" height="34" rx="4" fill="#69db7c" fill-opacity="0.45" stroke="currentColor"/><text x="65" y="72" text-anchor="middle" font-size="11">valid</text>
      <rect x="102" y="50" width="60" height="34" rx="4" fill="#ff7a7a" fill-opacity="0.45" stroke="currentColor"/><text x="132" y="72" text-anchor="middle" font-size="11">stale</text>
      <rect x="169" y="50" width="60" height="34" rx="4" fill="#69db7c" fill-opacity="0.45" stroke="currentColor"/><text x="199" y="72" text-anchor="middle" font-size="11">valid</text>
      <rect x="236" y="50" width="60" height="34" rx="4" fill="#ff7a7a" fill-opacity="0.45" stroke="currentColor"/><text x="266" y="72" text-anchor="middle" font-size="11">stale</text>
      <rect x="35" y="94" width="60" height="34" rx="4" fill="#69db7c" fill-opacity="0.45" stroke="currentColor"/><text x="65" y="116" text-anchor="middle" font-size="11">valid</text>
      <rect x="102" y="94" width="60" height="34" rx="4" fill="none" stroke="currentColor"/><text x="132" y="116" text-anchor="middle" font-size="11">empty</text>
      <rect x="169" y="94" width="60" height="34" rx="4" fill="none" stroke="currentColor"/><text x="199" y="116" text-anchor="middle" font-size="11">empty</text>
      <rect x="236" y="94" width="60" height="34" rx="4" fill="none" stroke="currentColor"/><text x="266" y="116" text-anchor="middle" font-size="11">empty</text>
    </g>
    <g>
      <rect x="385" y="50" width="60" height="34" rx="4" fill="none" stroke="currentColor"/><rect x="452" y="50" width="60" height="34" rx="4" fill="none" stroke="currentColor"/><rect x="519" y="50" width="60" height="34" rx="4" fill="none" stroke="currentColor"/><rect x="586" y="50" width="60" height="34" rx="4" fill="none" stroke="currentColor"/>
      <rect x="385" y="94" width="60" height="34" rx="4" fill="none" stroke="currentColor"/><rect x="452" y="94" width="60" height="34" rx="4" fill="none" stroke="currentColor"/><rect x="519" y="94" width="60" height="34" rx="4" fill="none" stroke="currentColor"/><rect x="586" y="94" width="60" height="34" rx="4" fill="none" stroke="currentColor"/>
      <text x="515" y="40" font-size="11">all pages erased (empty)</text>
    </g>
    <text x="20" y="162" font-size="12">Each small box is a page. Read/write: one page at a time, only into empty pages. Erase: a whole block at once.</text>
  </g>
</svg>
:::

### Pages, blocks and updating data

- Data is **read** and **written** a **page** at a time, but a page can only be written if it is **empty (erased)**.
- Erasing works only on a **whole block**.
- So an SSD **can't overwrite** a page in place. To change data it **writes the new version to an empty page** and marks the old page **stale (invalid)**.
- Later, **garbage collection** copies the still-valid pages from a block to a fresh block, then **erases** the old block so it can be reused.
- This is why SSDs can **slow down when nearly full**: there are few empty pages, so more copying and erasing must happen during writes.

### Wear and wear levelling

Every **erase/write cycle** slightly damages the insulator, so each cell survives only a **limited number of cycles** (thousands to ~100,000, depending on type). The controller uses **wear levelling**: it spreads writes **evenly across all blocks** (tracking how often each has been erased) so no area wears out early. Drives also keep spare blocks to replace worn ones.

**Characteristics**: very **fast**, especially random access (no seek time or rotational latency — every page is reached electronically in about the same time); **silent**; **low power**; **light**; **shock-resistant**. But **more expensive per GB** than HDD, **limited write endurance**, and data can slowly leak if left unpowered for years.

**Suitable for**: the **operating system and applications** drive, **laptops**, **tablets and phones**, servers needing fast random reads (databases).

:::trap
- An SSD is **not RAM**, even though both are "chips". Flash is **non-volatile** secondary storage; RAM is volatile main memory.
- "SSD uses programmable ROM" (textbook Q1) is too vague: say **NAND flash memory** storing charge in **floating-gate transistors**.
- A page is **not** a single cell, and a block is **not** "a row of cells": a **page** is a group of cells (KBs) and a **block** is a group of pages.
:::

## Comparing secondary storage

| | **HDD** | **SSD** | **Optical (Blu-ray)** |
|---|---|---|---|
| Capacity | **highest**: typically 1–20+ TB | high: typically 256 GB – 8 TB | low: 25–100 GB per disc |
| Access speed | medium: ~10 ms access, ~100–250 MB/s | **fastest**: ~0.1 ms access, 500 MB/s – 7 GB/s | **slowest** |
| Cost per GB | **lowest** | higher | low for mass-produced discs, but small capacity |
| Durability | moving parts; damaged by knocks while running | **no moving parts**; very robust, but limited write cycles | scratches; heat/sunlight damage dye layers |
| Portability | heavier, needs care | **light, small** | very light, but needs a drive |
| Noise / power | audible, more power | silent, low power | drive is noisy when spinning |

### Choosing storage: scenarios

:::collapse Scenario 1: a student's lightweight laptop
**SSD.** It is carried around (shock-resistant, no moving parts), runs on battery (low power), and the OS and apps load much faster. Capacity of 512 GB–1 TB is plenty; cloud storage can supplement it.
:::

:::collapse Scenario 2: a security company recording 30 days of CCTV from 50 cameras
**Large HDDs** (e.g. in a NAS/RAID). Huge capacity is needed at the lowest cost per GB; footage is written **sequentially**, so the HDD's slower random access doesn't matter. Drives stay in one place, so shock isn't an issue.
:::

:::collapse Scenario 3: a film studio selling a 4K film to customers
**Blu-ray** (optical). Cheap to **mass-produce** by pressing, can't be altered, needs high capacity (50–100 GB) and plays in standard players. (Many films now stream, but discs remain for collectors and areas with poor broadband.)
:::

:::collapse Scenario 4: an online shop's database server handling thousands of small queries per second
**SSD.** Lots of **random reads** of small records: no seek time or rotational latency makes access far faster. Higher cost per GB is justified by performance.
:::

:::collapse Scenario 5: a school backing up its whole network every night and keeping copies off-site
**External HDDs** (or tape, or cloud). Large capacity at low cost; backups are written sequentially; drives can be taken **off-site** to protect against fire or theft. Rotate several drives.
:::

:::collapse Scenario 6: a photographer shooting on location
**Flash memory cards** in the camera, then a **portable SSD** for copies: small, light, robust when carried, fast enough for large RAW files.
:::

:::exam
- **"Describe the principles of operation of…"** (3–6 marks): give the physical **steps in order**, using the key words. For a laser printer: drum charged, laser discharges image areas, toner attracted, paper charged, fuser heats. For an SSD: NAND flash, floating gate traps electrons, pages and blocks, write to empty page/erase block, wear levelling.
- **"Explain why X is suitable for…"**: link a **characteristic** to the **scenario's need**: "an SSD has no moving parts, **so** it is less likely to be damaged when the laptop is carried".
- **Comparison questions**: compare **like with like** ("HDDs have a **higher capacity per £** than SSDs"), not one-sided lists.
- **RFID vs barcode**: the winning point is usually "**no line of sight needed**" and "**many items read at once**".
- Don't quote exact capacities as if fixed; **relative** comparisons (HDD > SSD > optical for capacity per £) earn the marks.
:::

:::challenge
1. A 2D barcode is printed on a crumpled boarding pass. Why might a camera-based reader succeed where a laser scanner fails?
2. Calculate the average rotational latency of a 10,000 rpm disk. Why does latency matter less for streaming one large video file than for loading thousands of small files?
3. Explain why an SSD's controller must keep a mapping table from the "logical" block addresses the OS uses to the physical pages where data actually lives.
4. Suggest why contactless bank cards deliberately use a **very short** range even though RFID can work over metres.
:::

:::recap
- **Barcode reader**: light → reflected more by spaces than bars → photo-sensor → pulses → binary → check digit. Laser / CCD / camera; **QR codes need a camera**.
- **Digital camera**: lens → **CCD/CMOS** photosites (charge ∝ intensity) with a **Bayer filter** → **ADC** → processor (demosaic, compress) → flash card. CMOS = cheaper, lower power.
- **Laser printer**: charge drum → laser writes charge image → toner attracted → charged paper pulls toner → **fuser** heats → clean.
- **RFID**: chip + antenna; **passive** powered by **induction** (short range), **active** has a battery (long range); **no line of sight**, many tags at once.
- **Secondary storage** is needed because RAM is **volatile, small and expensive**.
- **HDD**: magnetic platters, heads, tracks/sectors; access = **seek + rotational latency**; cheapest per GB.
- **Optical**: laser reads **pits/lands** on a spiral; shorter wavelength → more capacity (700 MB → 4.7 GB → 25 GB).
- **SSD**: NAND flash, **floating gates**, pages/blocks, **wear levelling**; fastest, robust, dearer per GB.
:::

:::related
- [7.1 Internal hardware components and buses](#/topic/7.1)
- [7.4 Interrupts and processor performance](#/topic/7.4)
- [5.7 Images and sound](#/topic/5.7)
- [5.6 Character coding and error checking](#/topic/5.6)
- [6.1 Hardware, software and the operating system](#/topic/6.1)
:::

*/});
