CS.registerTopic({ id: "5.8", title: "Compression and encryption" }, function () {/*

:::objectives
- Explain **why** images, sound and other files are compressed.
- Distinguish **lossless** and **lossy** compression and give the advantages and disadvantages of each.
- Apply **run length encoding (RLE)** and **dictionary-based** compression to data, and explain when they work well or badly.
- Define **encryption**, **cipher**, **plaintext**, **ciphertext** and **key**.
- Encrypt and decrypt with the **Caesar cipher**, and explain why it is **easily cracked**.
- Encrypt and decrypt with the **Vernam cipher** (one-time pad) using XOR, state the conditions for **perfect security**, and compare it with ciphers that rely on **computational security**.
:::

:::quick At a glance
- **Compression** reduces file size → less **storage**, faster **transmission**, less **bandwidth**, enables **streaming**.
- **Lossless**: the original is restored **exactly** (RLE, dictionary methods, PNG, ZIP, FLAC). Needed for text, programs, data.
- **Lossy**: some data is **permanently removed** (JPEG, MP3, MP4); much smaller files, but quality is reduced and cannot be recovered.
- **RLE**: replace a **run** of identical values with **count + value**: AAAAABBB → 5A3B. Bad when there are few runs.
- **Dictionary**: store each repeated pattern (word/sequence) **once** in a dictionary and replace occurrences with **short codes**. The dictionary must be stored too.
- **Encryption**: turning **plaintext** into **ciphertext** with a **cipher** (algorithm) and a **key**, so only someone with the key can read it.
- **Caesar**: shift every letter by the key. Only **25 useful keys** → brute force; letter patterns survive → **frequency analysis**.
- **Vernam**: XOR each bit of the message with a key that is **truly random, at least as long as the message, used once, kept secret** → **perfect security**.
- **Computational security** (e.g. AES, RSA): breakable in principle but **not in a reasonable time** with available computing power.
:::

:::keyterms
Compression :: The process of reducing the number of bits needed to represent data. :: Making files smaller.
Lossless compression :: Compression in which no data is lost: the original file can be reconstructed exactly. :: Squash it and get back exactly what you started with.
Lossy compression :: Compression that permanently removes some data, usually data that people are less likely to notice; the original cannot be reconstructed exactly. :: Throw away detail you probably won't miss.
Run length encoding (RLE) :: A lossless method that replaces a run of consecutive identical data values with a single value and a count. :: "Five As" instead of "AAAAA".
Dictionary-based compression :: A lossless method that stores repeated patterns in a dictionary and replaces each occurrence in the data with a shorter reference code. :: Give common words a short code number.
Encryption :: The process of converting plaintext into ciphertext, using a cipher and a key, so that it cannot be understood by anyone who does not have the key. :: Scrambling a message so only the right person can read it.
Plaintext :: The original, readable message before encryption (or after decryption). :: The secret before scrambling.
Ciphertext :: The encrypted, unreadable form of a message. :: The scrambled version.
Cipher :: An algorithm used to encrypt and decrypt data. :: The method.
Key :: The value used by a cipher to determine exactly how the plaintext is transformed. :: The setting for the method.
Perfect security :: A cipher has perfect security if the ciphertext gives no information about the plaintext, so it cannot be cracked however much computing power is available. :: Mathematically uncrackable.
Computational security :: A cipher is computationally secure if it cannot be cracked in a reasonable amount of time with the computing resources available, even though it could be in principle. :: Crackable in theory, but not before the universe ends.
:::

## Why compress?

Images, sound and video files are large (see [5.7](#/topic/5.7)): one uncompressed 3-minute CD-quality song is about 32 MB, and one uncompressed 12-megapixel photo is 36 MB.

Compression gives:
- **Less storage space** needed (more photos on a phone, smaller backups).
- **Faster transmission** and downloads/uploads, using less **bandwidth** (and less mobile data).
- **Streaming** of music and video in real time becomes possible.
- Lower costs for storage and data transfer; web pages load faster.

The cost: **processing time** to compress and decompress, and (for lossy) **loss of quality**.

## Lossless vs lossy

| | Lossless | Lossy |
|---|---|---|
| What happens | redundancy is encoded more efficiently; **nothing is lost** | data judged less important is **permanently removed** |
| After decompression | **identical** to the original | an **approximation** of the original |
| Typical size reduction | modest (often 2:1 or less) | large (often 10:1 or more) |
| Examples | RLE, dictionary (LZW), **ZIP**, **PNG**, GIF, **FLAC** | **JPEG**, **MP3**, AAC, **MP4** (H.264) video |
| Use when | every bit matters: **text, source code, executables, spreadsheets, medical images** | small file matters more than perfection: **photos on the web, streamed music and video** |

:::columns
**Lossless**
- ✔ Original recovered exactly: essential for text and programs.
- ✔ Can be compressed and decompressed repeatedly with no degradation.
- ✘ Files stay relatively large.
|||
**Lossy**
- ✔ Much smaller files: faster to send, more fit in storage.
- ✔ Removes detail humans barely notice (sounds outside hearing range or masked by louder sounds; fine colour variation).
- ✘ Quality reduced; lost data **cannot** be recovered.
- ✘ Re-compressing repeatedly makes quality worse.
:::

:::trap Lossy is never used for text or programs
Losing a single bit of a program or a bank statement would corrupt it. In the exam, a lossy answer for "a text document / program / database" scores zero. Also: "lossless means no compression" is wrong; it means **no data is lost**.
:::

## Run length encoding (RLE)

RLE replaces each **run** of identical consecutive values with **one copy of the value and a count**.

:::example RLE of a string
`CCCCCLLLLLQQQPPPP` (17 characters)

Runs: 5 × C, 5 × L, 3 × Q, 4 × P → **5C5L3Q4P** (8 characters).
:::

:::example RLE of a 1-bit bitmap, row by row
| Row | Pixels | RLE (count, value) |
|---|---|---|
| 1 | 1 1 0 1 1 | 2×1, 1×0, 2×1 |
| 2 | 1 1 0 1 1 | 2×1, 1×0, 2×1 |
| 3 | 0 0 0 0 0 | 5×0 |
| 4 | 1 1 0 1 1 | 2×1, 1×0, 2×1 |
| 5 | 1 1 0 1 1 | 2×1, 1×0, 2×1 |

Row 3 compresses well (five pixels → one pair). The other rows have short runs, so they barely shrink: each needs three (count, value) pairs.
:::

:::example Binary RLE with fixed-size fields
Stream: 110001110011100 → runs 2(1) 3(0) 3(1) 2(0) 3(1) 2(0).

Storing each run as a 1-bit value + 2-bit count needs 6 × 3 = 18 bits, **more** than the original 15. RLE only wins when runs are **long**.
:::

- **Good for**: images with large areas of one colour (icons, simple graphics, scanned text, cartoons), data with long repeats.
- **Bad for**: photographs and natural sound, where neighbouring values rarely repeat exactly; RLE can then make the file **bigger** (ABCD → 1A1B1C1D doubles it).

{{trace:5.8-1}}

## Dictionary-based compression

Instead of looking for **runs**, a dictionary method looks for patterns (words or bit sequences) that **repeat anywhere** in the file.

1. Build a **dictionary**: each distinct pattern gets a short code.
2. Replace every occurrence of a pattern in the data with its code.
3. Store/transmit the **dictionary along with** the compressed data, so the receiver can decode it.

:::example Dictionary compression of bit patterns (from your class notes)
Data (32 bits): `1011 0011 0011 1111 0011 1111 1011 0011`

Only three different 4-bit patterns occur:

| Pattern | Code |
|---|---|
| 1011 | 00 |
| 0011 | 01 |
| 1111 | 10 |

Compressed: `00 01 01 10 01 10 00 01` = **16 bits** (half the size), plus the dictionary.
:::

:::example Dictionary compression of words
Text: `TO BE OR NOT TO BE` (18 characters × 8 bits = **144 bits** in ASCII).

| Word | Code |
|---|---|
| TO | 00 |
| BE | 01 |
| OR | 10 |
| NOT | 11 |

Compressed (spaces implied between words): 00 01 10 11 00 01 = **12 bits** + the dictionary.
For a long document, frequently repeated words such as "the" save a great deal.
:::

:::trap Don't forget the dictionary
The dictionary is part of the cost. For a short message it can outweigh the saving. Practical methods (e.g. **LZW**, used in GIF and ZIP-style formats) **build the dictionary as they go**, so the decoder can rebuild it from the data and it need not be sent separately.
:::

:::collapse Beyond the AQA specification: Huffman coding
Huffman coding gives **frequent** symbols **short** codes and rare symbols long ones (lossless).

For `ABRACADABRA`: A×5, B×2, R×2, C×1, D×1. Repeatedly join the two least frequent nodes into a tree:
C+D → 2; B+R → 4; (CD)+(BR) → 6; A+6 → 11.

Codes: **A = 0**, C = 100, D = 101, B = 110, R = 111.

Size: 5×1 + 2×3 + 2×3 + 1×3 + 1×3 = **23 bits**, compared with 88 bits in 8-bit ASCII. No code is a prefix of another, so the bit stream decodes unambiguously. *Not required for AQA, but it appears in the compression tool.*
:::

{{tool:compression-tool}}

::::tabs
:::tab Python
```python
def rle(text):
    """Run length encode: 'AAAB' -> '3A1B'."""
    if not text:
        return ""
    out, count = "", 1
    for i in range(1, len(text)):
        if text[i] == text[i - 1]:
            count += 1
        else:
            out += str(count) + text[i - 1]
            count = 1
    return out + str(count) + text[-1]

print(rle("CCCCCLLLLLQQQPPPP"))   # 5C5L3Q4P
print(rle("ABCD"))                # 1A1B1C1D  (bigger!)

words = "TO BE OR NOT TO BE".split()
dictionary = {w: i for i, w in enumerate(dict.fromkeys(words))}
print(dictionary)                  # {'TO': 0, 'BE': 1, 'OR': 2, 'NOT': 3}
print([dictionary[w] for w in words])   # [0, 1, 2, 3, 0, 1]
```
:::
:::tab AQA pseudocode
```pseudocode
SUBROUTINE RLE(text)
    output ← ""
    count ← 1
    FOR i ← 1 TO LEN(text) - 1
        IF text[i] = text[i - 1] THEN
            count ← count + 1
        ELSE
            output ← output + INT_TO_STRING(count) + text[i - 1]
            count ← 1
        ENDIF
    ENDFOR
    output ← output + INT_TO_STRING(count) + text[LEN(text) - 1]
    RETURN output
ENDSUBROUTINE
```
:::
::::

## Encryption: the vocabulary

> **Encryption** is the process of converting **plaintext** into **ciphertext** using a **cipher** and a **key**, so that it cannot be understood by anyone without the key. **Decryption** reverses it.

:::figure Encryption and decryption with a shared (symmetric) key
<svg class="diagram" viewBox="0 0 660 150" role="img" aria-label="Plaintext goes through an encryption cipher with a key to give ciphertext, which is sent and then decrypted with the key back to plaintext">
  <defs><marker id="arr58" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor">
    <rect x="10" y="50" width="100" height="44" rx="8" fill="#5fc9a8" fill-opacity="0.25" stroke="currentColor"/><text x="60" y="70" text-anchor="middle">Plaintext</text><text x="60" y="86" text-anchor="middle" font-family="monospace">HELLO</text>
    <rect x="150" y="50" width="100" height="44" rx="8" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="200" y="76" text-anchor="middle">Encrypt</text>
    <rect x="290" y="50" width="100" height="44" rx="8" fill="#e07a9b" fill-opacity="0.25" stroke="currentColor"/><text x="340" y="70" text-anchor="middle">Ciphertext</text><text x="340" y="86" text-anchor="middle" font-family="monospace">KHOOR</text>
    <rect x="430" y="50" width="100" height="44" rx="8" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="480" y="76" text-anchor="middle">Decrypt</text>
    <rect x="570" y="50" width="80" height="44" rx="8" fill="#5fc9a8" fill-opacity="0.25" stroke="currentColor"/><text x="610" y="70" text-anchor="middle">Plaintext</text><text x="610" y="86" text-anchor="middle" font-family="monospace">HELLO</text>
    <line x1="110" y1="72" x2="148" y2="72" stroke="currentColor" marker-end="url(#arr58)"/>
    <line x1="250" y1="72" x2="288" y2="72" stroke="currentColor" marker-end="url(#arr58)"/>
    <line x1="390" y1="72" x2="428" y2="72" stroke="currentColor" marker-end="url(#arr58)"/>
    <line x1="530" y1="72" x2="568" y2="72" stroke="currentColor" marker-end="url(#arr58)"/>
    <text x="200" y="125" text-anchor="middle">key (shift 3)</text><line x1="200" y1="112" x2="200" y2="96" stroke="currentColor" marker-end="url(#arr58)"/>
    <text x="480" y="125" text-anchor="middle">same key</text><line x1="480" y1="112" x2="480" y2="96" stroke="currentColor" marker-end="url(#arr58)"/>
    <text x="340" y="30" text-anchor="middle">sent over an insecure channel (an eavesdropper sees only this)</text>
  </g>
</svg>
:::

- **Cipher** = the algorithm (e.g. "shift every letter"). **Key** = the setting (e.g. "by 3").
- A good cipher stays secure even when the attacker **knows the algorithm**: only the key is secret.

## The Caesar cipher

Each letter is **shifted** a fixed number of places along the alphabet; the **key** is the shift. Letters wrap round from Z to A. It is a **substitution cipher**: every A becomes the same ciphertext letter, and so on.

| Plain | A | B | C | D | E | … | W | X | Y | Z |
|---|---|---|---|---|---|---|---|---|---|---|
| Cipher (key 3) | D | E | F | G | H | … | Z | A | B | C |

:::example Encrypt COMPUTING with key 3
C→F, O→R, M→P, P→S, U→X, T→W, I→L, N→Q, G→J → **FRPSXWLQJ**

Using letter positions (A = 0): cipher = (position + key) MOD 26. For example U = 20, (20 + 3) MOD 26 = 23 = X.
:::

:::example Decrypt UGEWTG (key: right shift of 2)
Shift each letter **back** 2: U→S, G→E, E→C, W→U, T→R, G→E → **SECURE**.
Decryption: plain = (position − key) MOD 26.
:::

:::example Decrypt EOHWFKOHB (key: right shift of 3)
E→B, O→L, H→E, W→T, F→C, K→H, O→L, H→E, B→Y → **BLETCHLEY**.
:::

{{trace:5.8-2}}

### Why the Caesar cipher is easily cracked

1. **Brute force**: there are only **25 useful keys** (a shift of 26 gives the plaintext back). Trying them all by hand takes minutes and by computer microseconds; the one that produces readable text is the answer.
2. **Frequency analysis**: each plaintext letter always maps to the **same** ciphertext letter, so letter frequencies survive. In English, **E** is the most common letter, then T and A. If **H** is the most common ciphertext letter, the shift is probably 3 (E → H).
3. Word patterns survive too: one-letter words are probably A or I; repeated short words are probably THE, AND.

:::trap "It's weak because the key is short"
Be specific: "only 25 possible keys so all can be tried (**brute force**)" **and/or** "the same plaintext letter always gives the same ciphertext letter, so **frequency analysis** reveals the key". Each is a separate mark.
:::

## The Vernam cipher (one-time pad)

The Vernam cipher combines each bit of the plaintext with the corresponding bit of the **key** using **XOR** (⊕).

| A | B | A ⊕ B |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

XOR has a magic property: **(P ⊕ K) ⊕ K = P**. XORing with the same key **twice** returns the original, so the **same operation and key** both encrypt and decrypt.

:::example Encrypt HELLO with the key PLUTO (8-bit ASCII)
Step 1, the first letter in full: H = 72, P = 80.

| Bit | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Plaintext H | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 |
| Key P | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 |
| **H ⊕ P** | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 |

Each column: equal bits → 0, different bits → 1. So the first ciphertext byte is **00011000** (24, hex 18).

All five letters:

| | H | E | L | L | O |
|---|---|---|---|---|---|
| Plaintext | 01001000 | 01000101 | 01001100 | 01001100 | 01001111 |
| Key (P L U T O) | 01010000 | 01001100 | 01010101 | 01010100 | 01001111 |
| **Ciphertext** | **00011000** | **00001001** | **00011001** | **00011000** | **00000000** |

In hex: 18 09 19 18 00. Many ciphertext bytes are not printable characters, so exam answers are given in **binary or hex**.
:::

:::example Decrypt the first byte
Ciphertext 00011000 ⊕ key P 01010000 = **01001000** = 72 = **H** ✓. Same operation, same key.
:::

{{trace:5.8-3}}

:::note A careless key leaks information
Above, the key letter O was used to encrypt the plaintext letter O, giving 00000000. A real one-time pad uses **random** bytes, not words, which is one reason this example key (PLUTO) would never be used in practice.
:::

### Conditions for perfect security

The Vernam cipher has **perfect security** only if the key is:

1. **Truly random** (not generated by a predictable algorithm),
2. **At least as long as the plaintext** (no repeated key),
3. **Used only once** (then destroyed: a "one-time" pad),
4. **Kept secret**, shared only by sender and receiver.

:::why Why is it perfectly secure?
Because the key is random and as long as the message, **every possible plaintext** of that length could have produced the ciphertext with *some* key, and all are **equally likely**. Trying every key (brute force) produces every possible message: "ATTACK AT DAWN" and "RETREAT AT TEN" alike, with nothing to tell you which is right. There are **no patterns** in the ciphertext, so frequency analysis is useless. No amount of computing power helps: this is a mathematical guarantee, not a matter of time.
:::

:::trap Reusing the key destroys the security
If the same key encrypts two messages, C₁ ⊕ C₂ = P₁ ⊕ P₂: the key cancels out and the two plaintexts can be teased apart. "One-time" is not optional.
:::

## Vernam vs computational security

Most real systems (AES for data, RSA and Diffie–Hellman for keys, see [9.4](#/topic/9.4)) use ciphers that are **computationally secure**: they **could** be broken in principle (e.g. by trying every 256-bit key, or factorising a huge number), but doing so would take far longer than the information stays valuable, even with the fastest computers.

| | Vernam (one-time pad) | Computationally secure ciphers |
|---|---|---|
| Security | **Perfect**: unbreakable even with unlimited computing power | Secure only because cracking would take an **infeasible amount of time** |
| Key | random, as long as the message, used once | short, fixed length (e.g. 256 bits), reused for many messages |
| Key distribution | very hard: a huge key must be delivered **securely in advance** | manageable: keys can be exchanged using public-key methods |
| Random keys | **true randomness** is hard and slow to generate in volume | pseudo-random keys acceptable |
| Future risk | none: faster computers don't help | faster computers / new algorithms (e.g. quantum computing) may break them |
| Practical use | rare: very high-security diplomatic/military links | almost everything: HTTPS, Wi-Fi, banking, messaging |

:::trap "Computationally secure" does not mean "uncrackable"
It means "cannot be cracked **in a reasonable time** with **current** resources". Only the one-time pad is mathematically uncrackable, and only when all four key conditions are met.
:::

{{tool:cipher-tool}}

::::tabs
:::tab Python
```python
def caesar(text, key):
    out = ""
    for ch in text.upper():
        if ch.isalpha():
            out += chr((ord(ch) - 65 + key) % 26 + 65)
        else:
            out += ch
    return out

def vernam(data, key):
    """XOR each character code with the matching key character code."""
    assert len(key) >= len(data), "key must be at least as long as the message"
    return [ord(d) ^ ord(k) for d, k in zip(data, key)]

print(caesar("COMPUTING", 3))      # FRPSXWLQJ
print(caesar("UGEWTG", -2))        # SECURE
cipher = vernam("HELLO", "PLUTO")
print([format(c, "08b") for c in cipher])
print("".join(chr(c ^ ord(k)) for c, k in zip(cipher, "PLUTO")))   # HELLO
```
:::
:::tab AQA pseudocode
```pseudocode
SUBROUTINE CaesarEncrypt(plaintext, key)
    ciphertext ← ""
    FOR i ← 0 TO LEN(plaintext) - 1
        pos ← CHAR_TO_CODE(plaintext[i]) - 65
        newPos ← (pos + key) MOD 26
        ciphertext ← ciphertext + CODE_TO_CHAR(newPos + 65)
    ENDFOR
    RETURN ciphertext
ENDSUBROUTINE
```
:::
::::

:::exam
- **"Explain why images/sound are compressed" (2):** reduce file size → less storage; faster to transmit/download/stream, less bandwidth.
- **Lossy vs lossless (2–4):** define both (data permanently removed vs reconstructed exactly), then give an advantage of each **with an example** of when it is appropriate.
- **RLE/dictionary application:** show the encoded result precisely; if asked "why might RLE increase the size", say "few/short runs, so each value needs a count added".
- **Caesar weakness (2):** brute force over 25 keys **and** frequency analysis.
- **Vernam perfect security (3–4):** list the key conditions (random, ≥ message length, used once, secret) and explain that the ciphertext contains no patterns / every plaintext is equally likely, so brute force/frequency analysis cannot work.
- **Compare Vernam with computational security (4–6):** perfect vs time-based security; key length/distribution and randomness problems for Vernam; computational ciphers practical but may become breakable with more computing power.
:::

:::challenge
1. Design an RLE scheme for 8-bit greyscale images that never makes a file bigger than 1 byte more than the original. (Hint: an escape/flag byte.)
2. Encrypt your name with a Caesar shift and give it to a friend without the key. Time how long brute force takes them.
3. Show, using XOR, that if the same Vernam key K encrypts P₁ and P₂, an attacker can compute P₁ ⊕ P₂ without knowing K.
4. Why does compressing data **before** encrypting it make sense, but compressing **after** encrypting achieve almost nothing?
:::

:::recap
- Compress to save storage and transmission time/bandwidth. Lossless = exact (text, programs); lossy = smaller but approximate (photos, music, video).
- RLE: runs → count + value; great for long runs, worse than useless for none.
- Dictionary: repeated patterns → short codes; the dictionary is stored too.
- Encryption: plaintext → ciphertext with a cipher (algorithm) and key.
- Caesar: shift by key; cracked by brute force (25 keys) and frequency analysis.
- Vernam: P ⊕ K = C, C ⊕ K = P. Perfect security if the key is truly random, ≥ message length, used once, secret.
- Computational security: breakable in theory, not in reasonable time; practical and used everywhere.
:::

:::related
- [5.7 Images and sound](#/topic/5.7)
- [5.6 Character coding and error checking](#/topic/5.6)
- [9.4 Network security and encryption](#/topic/9.4)
- [6.4 Logic gates (XOR)](#/topic/6.4)
:::

*/});
