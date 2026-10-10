CS.registerFlashcards("5.7", [
  { front: "Bitmap file size formula", back: "width × height × colour depth (bits) → ÷ 8 for bytes. Plus metadata." },
  { front: "Sound file size formula", back: "sampling rate × sample resolution × seconds × channels (bits) → ÷ 8 for bytes." },
  { front: "ADC: three stages", back: "Sample (measure amplitude at regular intervals) → quantise (round to nearest level) → encode (store as n-bit binary)." },
  { front: "Uses of an ADC and a DAC", back: "ADC: analogue sensors, microphones, camera sensors. DAC: playing digital audio through speakers/headphones, driving analogue devices." },
  { front: "Nyquist's theorem", back: "Sampling rate ≥ 2 × highest frequency. CD: 44.1 kHz for hearing up to ~20 kHz." },
  { front: "Typical bitmap metadata", back: "Width, height, colour depth (essential); format, date/time, camera settings, GPS location." },
  { front: "Typical vector object properties", back: "Object type, coordinates, size/radius, fill colour, line colour, line width, line style." },
  { front: "Vector vs bitmap: one line each", back: "Vector: scales perfectly, small for simple shapes, not for photos. Bitmap: any image incl. photos, pixelates when enlarged, large." },
  { front: "MIDI event messages (examples)", back: "Note on, note off, pitch, velocity, program change (instrument), control change (volume, sustain), tempo/timing." },
  { front: "Advantages of MIDI", back: "Tiny files; easy to edit notes/tempo/key; change instrument; convert to sheet music; devices interoperate." },
]);
