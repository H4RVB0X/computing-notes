CS.registerFlashcards("7.5", [
  { front: "How does a barcode reader work?", back: "Light/laser shines on the code → **white spaces reflect, black bars absorb** → photo-sensor turns reflected light into **pulses** → binary → digits → **check digit** verified." },
  { front: "Laser vs CCD vs camera barcode readers", back: "**Laser**: rotating mirror sweeps beam, reads at a distance (supermarkets). **CCD**: row of sensors, no moving parts, short range. **Camera/imager**: photographs the code, reads **2D/QR** and damaged codes." },
  { front: "Digital camera: light to file", back: "Lens → **sensor (CCD/CMOS)** photosites, charge ∝ intensity → **Bayer filter** gives R/G/B → **ADC** → image processor (demosaic, compress) → flash memory card." },
  { front: "CCD vs CMOS", back: "**CCD**: charge shifted row by row to one output; low noise, more power, dearer. **CMOS**: amplifier per photosite; cheaper, **low power**, faster — used in phones." },
  { front: "Laser printer stages", back: "1 **charge** drum · 2 **laser** changes charge where the image is · 3 **toner** attracted to image areas · 4 **charged paper** pulls toner off · 5 **fuser** heat + pressure · 6 **clean** drum." },
  { front: "Passive vs active RFID", back: "**Passive**: no battery, powered by **induction** from the reader's field; cm to a few m; cheap, tiny. **Active**: own **battery**, transmits itself; up to ~100 m+; bigger, dearer." },
  { front: "Why is secondary storage needed?", back: "RAM is **volatile**, **small** and **expensive per GB**. Secondary storage is **non-volatile**, high capacity and cheap, for keeping programs and files, backups, archives and transport." },
  { front: "HDD average access time", back: "**Seek time** (move head to track) + **rotational latency** (wait for sector; average = half a revolution) + transfer time. 7,200 rpm → 8.33 ms per revolution → **4.17 ms** average latency." },
  { front: "CD vs DVD vs Blu-ray", back: "CD **780 nm** infrared, 700 MB · DVD **650 nm** red, 4.7 GB · Blu-ray **405 nm** blue-violet, 25 GB per layer. Shorter wavelength → smaller pits → more data." },
  { front: "SSD: pages, blocks, wear levelling", back: "NAND flash; electrons trapped in **floating gates**. Read/write by **page** (only to empty pages); erase by **block**. **Wear levelling** spreads writes because cells have limited write/erase cycles." },
]);
