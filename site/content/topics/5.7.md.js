CS.registerTopic({ id: "5.7", title: "Images and sound" }, function () {/*

:::objectives
- Explain how **bit patterns** can represent other forms of data, such as graphics and sound.
- Distinguish **analogue** and **digital** data and signals.
- Describe how an **ADC** (with sampling and quantisation) and a **DAC** work, and where each is used.
- Explain **bitmaps** (pixel, resolution, colour depth), calculate their **storage requirements**, and list typical **metadata**.
- Explain **vector graphics** (lists of objects and their properties), build one from **primitives**, and compare vectors with bitmaps.
- Describe digital sound (**sampling rate**, **sample resolution**, **Nyquist's theorem**), calculate **sound file sizes**, and explain **MIDI** and its advantages.
:::

:::quick At a glance
- The **same bit pattern** can mean a number, a character, a pixel colour or a sound sample: meaning depends on **how it is interpreted**.
- **Analogue** = continuously varying, any value in a range. **Digital** = discrete values (in a computer, binary).
- **ADC**: samples an analogue signal at regular intervals, **quantises** each sample to the nearest of 2ⁿ levels, outputs binary. Used with **analogue sensors** and microphones.
- **DAC**: turns binary values back into voltages to **reconstruct** an analogue waveform, e.g. to drive **speakers**.
- **Bitmap**: grid of **pixels**. **Size in pixels** = width × height. **Resolution** = dots (pixels) per inch. **Colour depth** = bits per pixel; 2ⁿ colours.
- **Bitmap size (bits) = width × height × colour depth** (+ metadata). Divide by 8 for bytes.
- **Vector**: a **drawing list** of objects (line, rectangle, circle, polygon…) with properties (coordinates, radius, fill colour, line colour, line width). Scales **without** losing quality.
- **Sound size (bits) = sampling rate × sample resolution × duration (s) × channels.**
- **Nyquist**: sample at **at least twice** the highest frequency to be reproduced.
- **MIDI** stores **event messages** (note on/off, pitch, velocity, instrument, timing), not the sound itself: tiny and easy to edit.
:::

:::keyterms
Analogue data :: Data that varies continuously and can take any value within a range. :: Smooth, like a dial.
Digital data :: Data represented by discrete values; in a computer, binary values. :: Steps, like a digital clock.
ADC :: Analogue-to-digital converter: samples an analogue signal at regular intervals and converts each measurement to a binary value. :: Turns a real-world wave into numbers.
DAC :: Digital-to-analogue converter: converts digital values into a corresponding analogue signal (voltage) to reconstruct the waveform. :: Turns numbers back into a wave.
Pixel :: Picture element: the smallest addressable element of a bitmapped image, a single colour. :: One dot of the image.
Resolution :: The number of dots per inch, where a dot is a pixel (AQA definition); often used loosely to mean the size in pixels. :: How densely packed the dots are.
Size in pixels :: The width of an image in pixels × its height in pixels. :: How many dots across × how many down.
Colour depth :: The number of bits used to represent the colour of each pixel; n bits give 2ⁿ colours. :: How many colours each dot can be.
Metadata :: Data about data: information stored with an image (e.g. width, height, colour depth) so that it can be displayed correctly. :: The image's label and settings.
Vector graphic :: An image represented as a list of geometric objects and their properties, from which the image is drawn. :: A recipe for drawing the picture.
Sampling rate :: The number of samples taken per second, measured in hertz (Hz). :: How often you measure.
Sample resolution :: The number of bits used to store each sample. :: How finely each measurement is recorded.
Nyquist's theorem :: To reproduce a signal accurately, it must be sampled at a rate of at least twice its highest frequency. :: Sample at least twice as fast as the fastest wobble.
MIDI :: Musical Instrument Digital Interface: a standard that represents music as event messages describing how notes are played, rather than as sampled sound. :: Sheet music for computers.
:::

## Bit patterns can mean anything

A computer only stores bits. **What they mean depends on how the program interprets them.**

| Bit pattern 01000001 interpreted as… | Meaning |
|---|---|
| unsigned integer | 65 |
| ASCII character | 'A' |
| 8-bit greyscale pixel | a dark-medium grey (65/255) |
| 8-bit sound sample | a wave height of 65 on a 0–255 scale |
| machine code | some instruction for a particular processor |

Images become bits by dividing the picture into **pixels** and storing a code for each pixel's colour. Sound becomes bits by **measuring** the wave many times a second and storing each measurement.

## Analogue and digital

| | Analogue | Digital |
|---|---|---|
| **Data** | continuously variable; any value within a range (temperature, sound pressure, light level) | discrete values from a fixed set (in a computer, binary numbers) |
| **Signal** | a voltage/current that varies **continuously**, mirroring the data | a voltage that switches between a small number of **discrete levels** (e.g. high = 1, low = 0) |

- **Data** is the information itself; a **signal** is the physical means of carrying it (electrical, radio, light).
- The real world is analogue. Computers are digital. So we need converters at the boundary.

:::trap Data versus signal
A question may ask about **both**. Analogue *data* can be sent as a digital *signal* (digitised music over the Internet), and digital data can travel on an analogue signal (a modem over a phone line). Define each separately: data = the information, signal = how it is transmitted.
:::

## ADC: analogue to digital

:::figure The journey of recorded sound: analogue → ADC → digital storage → DAC → analogue
<svg class="diagram" viewBox="0 0 680 150" role="img" aria-label="Microphone produces analogue signal, ADC converts to binary for storage and processing, DAC converts back to analogue for the speaker">
  <defs><marker id="arr57" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor">
    <rect x="10" y="45" width="100" height="50" rx="8" fill="#f0b45b" fill-opacity="0.25" stroke="currentColor"/><text x="60" y="75" text-anchor="middle">Microphone</text>
    <rect x="150" y="45" width="90" height="50" rx="8" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="195" y="75" text-anchor="middle" font-weight="bold">ADC</text>
    <rect x="280" y="45" width="120" height="50" rx="8" fill="#5fc9a8" fill-opacity="0.25" stroke="currentColor"/><text x="340" y="68" text-anchor="middle">Computer</text><text x="340" y="86" text-anchor="middle" font-family="monospace">0110 1011…</text>
    <rect x="440" y="45" width="90" height="50" rx="8" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="485" y="75" text-anchor="middle" font-weight="bold">DAC</text>
    <rect x="570" y="45" width="100" height="50" rx="8" fill="#f0b45b" fill-opacity="0.25" stroke="currentColor"/><text x="620" y="75" text-anchor="middle">Speaker</text>
    <line x1="110" y1="70" x2="148" y2="70" stroke="currentColor" marker-end="url(#arr57)"/>
    <line x1="240" y1="70" x2="278" y2="70" stroke="currentColor" marker-end="url(#arr57)"/>
    <line x1="400" y1="70" x2="438" y2="70" stroke="currentColor" marker-end="url(#arr57)"/>
    <line x1="530" y1="70" x2="568" y2="70" stroke="currentColor" marker-end="url(#arr57)"/>
    <text x="130" y="122" text-anchor="middle">analogue</text><text x="260" y="122" text-anchor="middle">digital</text>
    <text x="420" y="122" text-anchor="middle">digital</text><text x="550" y="122" text-anchor="middle">analogue</text>
  </g>
</svg>
:::

:::steps How an ADC works
1. An analogue **sensor or microphone** produces a continuously varying voltage.
2. **Sampling**: at regular time intervals (set by the **sampling rate**) the ADC measures the amplitude (voltage) of the signal.
3. **Quantisation**: each measurement is **rounded to the nearest** of the 2ⁿ available levels, where n is the **sample resolution**.
4. **Encoding**: each level is output as an n-bit binary number and stored.
:::

- Quantisation always loses some information (the **quantisation error**), and anything between samples is lost.
- **Higher sampling rate** → more samples, closer to the original shape. **Higher resolution** → more levels, each sample more accurate. Both increase file size.

:::example Quantise six samples with a 3-bit ADC (levels 0–7 for 0–7 V)
| Sample | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Voltage | 2.3 | 5.8 | 6.6 | 4.1 | 1.4 | 0.4 |
| Nearest level | 2 | 6 | 7 | 4 | 1 | 0 |
| 3-bit code | 010 | 110 | 111 | 100 | 001 | 000 |

The stored data is 010 110 111 100 001 000. Each sample has an error of up to ½ a level.
:::

{{trace:5.7-2}}

**Uses of ADCs:** any **analogue sensor** feeding a computer: temperature, light, pressure, humidity, accelerometers, a microphone, a digital camera's sensor, a heart-rate monitor.

## DAC: digital to analogue

A **DAC** takes a stream of binary values and outputs a voltage proportional to each, at the same rate they were sampled. The result is a **stepped** voltage that is then **smoothed (filtered)** to **reconstruct** an analogue waveform close to the original.

**Uses of DACs:** playing **digital audio** through **speakers or headphones** (in phones, sound cards, music players); also driving analogue motors and control devices.

:::trap The reconstructed wave is not identical
A DAC can only rebuild what was stored. Detail lost by sampling (between samples) and quantisation (rounding) is gone for good. Higher sampling rate and resolution make the copy closer.
:::

## Bitmapped graphics

A **bitmap** is a grid of **pixels**; each pixel's colour is stored as a binary code. The pixel codes are stored in order, row by row.

:::figure A 5 × 5 bitmap with a 2-bit colour depth (4 colours)
<svg class="diagram" viewBox="0 0 560 220" role="img" aria-label="Five by five grid of pixels with colours and their 2-bit codes, plus a colour key">
  <g font-family="monospace" font-size="12" fill="currentColor">
    <g stroke="currentColor">
      <rect x="20" y="20" width="36" height="36" fill="#9aa0a6" fill-opacity="0.5"/><rect x="56" y="20" width="36" height="36" fill="none"/><rect x="92" y="20" width="36" height="36" fill="none"/><rect x="128" y="20" width="36" height="36" fill="none"/><rect x="164" y="20" width="36" height="36" fill="#9aa0a6" fill-opacity="0.5"/>
      <rect x="20" y="56" width="36" height="36" fill="none"/><rect x="56" y="56" width="36" height="36" fill="#5fc9a8" fill-opacity="0.6"/><rect x="92" y="56" width="36" height="36" fill="none"/><rect x="128" y="56" width="36" height="36" fill="#5fc9a8" fill-opacity="0.6"/><rect x="164" y="56" width="36" height="36" fill="none"/>
      <rect x="20" y="92" width="36" height="36" fill="none"/><rect x="56" y="92" width="36" height="36" fill="none"/><rect x="92" y="92" width="36" height="36" fill="#7c9aff" fill-opacity="0.7"/><rect x="128" y="92" width="36" height="36" fill="none"/><rect x="164" y="92" width="36" height="36" fill="none"/>
      <rect x="20" y="128" width="36" height="36" fill="none"/><rect x="56" y="128" width="36" height="36" fill="#5fc9a8" fill-opacity="0.6"/><rect x="92" y="128" width="36" height="36" fill="none"/><rect x="128" y="128" width="36" height="36" fill="#5fc9a8" fill-opacity="0.6"/><rect x="164" y="128" width="36" height="36" fill="none"/>
      <rect x="20" y="164" width="36" height="36" fill="#9aa0a6" fill-opacity="0.5"/><rect x="56" y="164" width="36" height="36" fill="none"/><rect x="92" y="164" width="36" height="36" fill="none"/><rect x="128" y="164" width="36" height="36" fill="none"/><rect x="164" y="164" width="36" height="36" fill="#9aa0a6" fill-opacity="0.5"/>
    </g>
    <text x="230" y="42">01 00 00 00 01</text>
    <text x="230" y="78">00 10 00 10 00</text>
    <text x="230" y="114">00 00 11 00 00</text>
    <text x="230" y="150">00 10 00 10 00</text>
    <text x="230" y="186">01 00 00 00 01</text>
    <g font-family="inherit" font-size="13">
      <text x="420" y="42">00 white</text>
      <rect x="400" y="56" width="14" height="14" fill="#9aa0a6" fill-opacity="0.5" stroke="currentColor"/><text x="420" y="68">01 grey</text>
      <rect x="400" y="82" width="14" height="14" fill="#5fc9a8" fill-opacity="0.6" stroke="currentColor"/><text x="420" y="94">10 green</text>
      <rect x="400" y="108" width="14" height="14" fill="#7c9aff" fill-opacity="0.7" stroke="currentColor"/><text x="420" y="120">11 blue</text>
      <text x="400" y="160">25 pixels × 2 bits</text>
      <text x="400" y="180">= 50 bits ≈ 6.25 bytes</text>
    </g>
  </g>
</svg>
:::

### Resolution and colour depth

- **Size in pixels**: width × height, e.g. 1920 × 1080 = 2 073 600 pixels.
- **Resolution**: the AQA specification defines it as the number of **dots per inch**, where a dot is a pixel (ppi/dpi). It decides how sharp an image looks at a given physical size. In everyday speech (and some exam questions) "resolution" is also used to mean the size in pixels, so read the question carefully.
- **Colour depth**: bits per pixel. **n bits → 2ⁿ colours**: 1 bit → 2 (black and white), 8 bits → 256, 24 bits → about 16.7 million ("true colour": 8 bits each for red, green and blue).
- More pixels or more bits per pixel → better quality **and** a bigger file.

### Storage requirements

> **Size in bits = width (px) × height (px) × colour depth (bits)**

Then ÷ 8 for bytes, ÷ 1000 (or 1024) for kB (KiB), and so on. This ignores **metadata**, so real files are slightly larger.

:::example 800 × 600 image, 12-bit colour
800 × 600 = 480 000 pixels. × 12 = 5 760 000 bits. ÷ 8 = **720 000 bytes** = 720 kB.
:::

:::example 1024 × 768 image, 24-bit colour (8 bits per RGB channel)
1024 × 768 × 24 = 18 874 368 bits ÷ 8 = **2 359 296 bytes** ≈ **2.36 MB** (or 2.25 MiB).
(The textbook writes "2.36Mb": that would be megabits. It should be MB.)
:::

:::example 1920 × 1080, 24-bit
1920 × 1080 × 24 = 49 766 400 bits ÷ 8 = 6 220 800 bytes ≈ **6.22 MB**.
:::

:::example Working backwards: minimum colour depth
An image must use 200 different colours. 2⁷ = 128 is too few; 2⁸ = 256 is enough → colour depth **8 bits**.
:::

### Metadata

**Metadata** is data about the image, stored (usually in a **file header**) so the image can be displayed correctly. Typical examples:

- **width** and **height** in pixels, **colour depth** (needed to decode the pixel data),
- file format / compression used, colour palette,
- date and time created, camera make and settings, **geolocation** (GPS).

:::trap Width and height are essential metadata
Without the width, the decoder would not know where each row ends. If asked "why is metadata needed?", say: "so the software knows how to interpret the bits, e.g. the width, height and colour depth to reconstruct the grid".
:::

{{tool:bitmap-editor}}

## Vector graphics

A **vector graphic** stores a **list of objects** (a **drawing list**) and their **properties**. The image is **drawn from the list** each time it is displayed, at whatever size is needed.

| Object (primitive) | Typical properties |
|---|---|
| line | start and end coordinates, line colour, line width, line style (dashed…) |
| rectangle | top-left x, y, width, height, fill colour, line colour, line width |
| circle | centre x, y, radius, fill colour, line colour |
| ellipse | centre, two radii, fill colour |
| polygon / triangle | list of vertex coordinates, fill colour, line colour |
| text | position, font, size, colour |

:::example Build a simple vector graphic from primitives
A triangle with corners (1,1), (4,1), (1,4), filled grey, plus a circle:

```text
triangle  points=(1,1),(4,1),(1,4)  fill=grey  line=black  width=1
circle    centre=(6,6)  radius=2  fill=none  line=blue  width=3
```

The same idea in SVG (the web's vector format):

```xml
<svg viewBox="0 0 10 10">
  <polygon points="1,1 4,1 1,4" fill="grey" stroke="black" stroke-width="0.1"/>
  <circle cx="6" cy="6" r="2" fill="none" stroke="blue" stroke-width="0.3"/>
</svg>
```

To make it twice as big, the computer multiplies the coordinates and radius by 2 and redraws: no blur.
:::

## Vector vs bitmap

| | Bitmap | Vector |
|---|---|---|
| Stored as | colour code for every pixel | list of objects and properties |
| Scaling | **pixelates** when enlarged | **scales without loss** of quality |
| File size | depends on resolution × colour depth, not content | depends on the number of objects, not size |
| Best for | **photographs**, complex natural images with subtle colour changes | **logos, diagrams, icons, maps, fonts, CAD** |
| Editing | edit individual pixels | edit/move/recolour whole objects easily |
| Weakness | large files; cannot zoom far | unsuitable for photos; complex images slow to render |

:::trap "Vectors are always smaller"
Usually true for simple drawings, but a very complex vector image (thousands of objects) can be larger than a bitmap and slow to render. Give a reason with your comparison: "a logo made of a few shapes needs only a few properties, whereas a bitmap stores every pixel".
:::

## Digital sound

### Sampling

The ADC measures the sound wave's amplitude at regular intervals.

- **Sampling rate** (Hz): samples per second. CD audio = **44 100 Hz**; telephone speech ≈ 8000 Hz.
- **Sample resolution** (bits per sample): CD = **16 bits** → 65 536 levels.
- Higher rate → more of the wave's detail captured (higher frequencies). Higher resolution → each sample closer to the true amplitude (less quantisation error, wider dynamic range). Both → bigger files.

:::figure Sampling a wave: each dot is one sample, rounded to the nearest level
<svg class="diagram" viewBox="0 0 600 230" role="img" aria-label="A sine wave sampled at regular intervals with samples snapped to 8 quantisation levels">
  <g font-family="inherit" font-size="12" fill="currentColor">
    <g stroke="currentColor" stroke-opacity="0.25">
      <line x1="50" y1="20" x2="580" y2="20"/><line x1="50" y1="45" x2="580" y2="45"/><line x1="50" y1="70" x2="580" y2="70"/><line x1="50" y1="95" x2="580" y2="95"/><line x1="50" y1="120" x2="580" y2="120"/><line x1="50" y1="145" x2="580" y2="145"/><line x1="50" y1="170" x2="580" y2="170"/><line x1="50" y1="195" x2="580" y2="195"/>
    </g>
    <text x="20" y="24">111</text><text x="20" y="49">110</text><text x="20" y="74">101</text><text x="20" y="99">100</text><text x="20" y="124">011</text><text x="20" y="149">010</text><text x="20" y="174">001</text><text x="20" y="199">000</text>
    <path d="M50,107 C90,10 150,10 190,107 S290,205 330,107 S430,10 470,107 S550,205 580,150" fill="none" stroke="currentColor" stroke-width="2"/>
    <g fill="#e07a9b" stroke="currentColor">
      <circle cx="50" cy="120" r="5"/><circle cx="85" cy="45" r="5"/><circle cx="120" cy="20" r="5"/><circle cx="155" cy="45" r="5"/><circle cx="190" cy="95" r="5"/><circle cx="225" cy="170" r="5"/><circle cx="260" cy="195" r="5"/><circle cx="295" cy="170" r="5"/><circle cx="330" cy="120" r="5"/><circle cx="365" cy="45" r="5"/><circle cx="400" cy="20" r="5"/><circle cx="435" cy="45" r="5"/><circle cx="470" cy="95" r="5"/><circle cx="505" cy="170" r="5"/><circle cx="540" cy="195" r="5"/>
    </g>
    <text x="315" y="225" text-anchor="middle">time → (samples at a fixed interval = 1 / sampling rate)</text>
  </g>
</svg>
:::

### Nyquist's theorem

> To reproduce a signal accurately, the **sampling rate must be at least twice the highest frequency** in the signal.

- Human hearing reaches about **20 kHz**, so CDs sample at **44.1 kHz** (just over 2 × 20 kHz).
- A file sampled at **30 000 Hz** can faithfully contain frequencies up to **15 000 Hz**.
- Sampling too slowly loses the high frequencies (and can create false lower tones, called *aliasing*).

### Sound file size

> **Size in bits = sampling rate (Hz) × sample resolution (bits) × duration (s) × number of channels**

Mono = 1 channel, stereo = 2.

:::example Stereo music: 44 000 Hz, 16-bit, 300 s
44 000 × 16 × 300 × 2 = 422 400 000 bits ÷ 8 = **52 800 000 bytes** = 52 800 kB ≈ **52.8 MB**.
:::

:::example Working backwards: how long is the recording?
A stereo file is 600 kB (600 000 bytes), 8-bit samples at 16 000 Hz.
Bytes per second = 16 000 × 1 byte × 2 channels = 32 000. Duration = 600 000 ÷ 32 000 = **18.75 s**.
:::

:::example CD quality, 3 minutes
44 100 × 16 × 180 × 2 = 254 016 000 bits ÷ 8 = 31 752 000 bytes ≈ **31.8 MB**.
:::

{{trace:5.7-1}}

{{tool:sampling-demo}}

::::tabs
:::tab Python
```python
def bitmap_bytes(width, height, colour_depth):
    return width * height * colour_depth / 8

def sound_bytes(rate_hz, resolution_bits, seconds, channels=1):
    return rate_hz * resolution_bits * seconds * channels / 8

print(bitmap_bytes(800, 600, 12))           # 720000.0
print(sound_bytes(44_000, 16, 300, 2))      # 52800000.0
print(600_000 / sound_bytes(16_000, 8, 1, 2))  # 18.75 seconds
```
:::
:::tab AQA pseudocode
```pseudocode
SUBROUTINE SoundBytes(rate, resolution, seconds, channels)
    bits ← rate * resolution * seconds * channels
    RETURN bits / 8
ENDSUBROUTINE

OUTPUT SoundBytes(44000, 16, 300, 2)    # 52800000
```
:::
::::

## MIDI

**MIDI** (Musical Instrument Digital Interface) is a standard protocol that lets electronic instruments, controllers and computers communicate. A MIDI file **does not contain recorded sound**. It contains **event messages** that describe how to **play** the music; a synthesiser (hardware or software) generates the sound.

Typical **event messages**:
- **Note on / note off**: which note (pitch), on which **channel**, and the **velocity** (how hard, i.e. loudness).
- **Program change**: which **instrument** sound to use.
- **Control change**: volume, sustain pedal, vibrato, pan.
- **Timing/tempo** information so events happen at the right moments.

:::columns
**Advantages of MIDI**
- **Much smaller files** than sampled audio: a few bytes per note instead of tens of thousands of samples per second.
- **Easy to edit**: change individual notes, pitch, duration, tempo or key without re-recording.
- **Change instrument** at will: the same notes can be played as piano, strings or drums.
- Can be turned directly into **sheet music** (notation).
- Lets instruments and computers from different manufacturers **communicate**.
|||
**Disadvantages**
- Can't record **speech** or real acoustic performance (it is not sampled sound).
- Sound quality depends on the **synthesiser** playing it: the same file can sound different on different devices.
- Synthesised sound may sound less **realistic**.
:::

:::exam
- **Calculations (2–3 marks)**: write the formula, substitute with units, then convert units step by step. State whether you used 1000 or 1024.
- **"Explain how an ADC works" (3–4)**: samples at regular intervals → measures amplitude → quantises to nearest level/rounds → stores as n-bit binary.
- **"State Nyquist's theorem"**: "sample at **at least twice** the **highest frequency**". Then apply: max frequency = rate ÷ 2.
- **"Explain the effect of increasing the sample resolution/rate"**: quality closer to the original **and** larger file size: give both.
- **Vector vs bitmap**: always justify ("logo → vector because it must scale without pixelation").
- **MIDI**: name specific event messages (note on/off, velocity, instrument) and explain the file-size advantage.
:::

:::challenge
1. A 4K image is 3840 × 2160 pixels at 30-bit colour. How many MB is one frame? How many GB is one minute of uncompressed video at 60 frames per second?
2. Why do telephone systems sample at 8 kHz? What does that tell you about the highest frequency they transmit?
3. Write the drawing list (as SVG) for a simple house: a square, a triangle roof and a rectangular door.
4. A music producer records a singer and a drum machine. Which part could be stored as MIDI and which must be sampled? Why?
:::

:::recap
- Bits mean whatever the program interprets them as: numbers, text, pixels or samples.
- Analogue = continuous; digital = discrete. ADC: sample → quantise → encode. DAC: values → voltages → reconstructed wave.
- Bitmap size = width × height × colour depth (bits) + metadata; n bits → 2ⁿ colours.
- Vector = list of objects + properties; scales perfectly; best for logos/diagrams, not photos.
- Sound size = rate × resolution × seconds × channels (bits).
- Nyquist: sampling rate ≥ 2 × highest frequency.
- MIDI = event messages (note on/off, pitch, velocity, instrument): small, editable, quality depends on synthesiser.
:::

:::related
- [5.3 Units of information](#/topic/5.3)
- [5.8 Compression and encryption](#/topic/5.8)
- [7.5 External hardware devices](#/topic/7.5)
:::

*/});
