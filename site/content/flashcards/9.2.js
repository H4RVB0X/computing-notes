CS.registerFlashcards("9.2", [
  { front: "Physical star v logical bus in one sentence each", back: "Physical star: each device has its own cable to a central switch/hub. Logical bus: every transmission reaches every device on a shared medium, one at a time." },
  { front: "Hub v switch", back: "Hub repeats every signal out of every port (logical bus, collisions). Switch learns MAC addresses per port and forwards each frame only to its destination (no collisions)." },
  { front: "Steps of CSMA/CD", back: "Listen → when idle transmit → monitor for collision → if collision send jam signal and stop → wait random time → retry" },
  { front: "Steps of CSMA/CA with RTS/CTS", back: "Listen → if busy random back-off → if idle send RTS → receive CTS (others stay silent) → transmit → receive ACK (no ACK → back off and resend)" },
  { front: "What is the hidden node problem?", back: "Two devices in range of the WAP but not of each other can't sense each other's transmissions, so both transmit and collide at the WAP. RTS/CTS fixes it." },
  { front: "Three ways to secure a WiFi network", back: "WPA2/WPA3 encryption with a strong key · disable SSID broadcast · MAC address allow list (plus change default admin password, update firmware)" },
  { front: "Components needed for a wireless network", back: "Wireless network adapter (NIC) in each device · wireless access point · router to reach other networks/the Internet" },
  { front: "Two advantages of client-server over peer-to-peer", back: "Central security/access rights and accounts · central automated backups · central software management · scales to many users" },
  { front: "Two advantages of peer-to-peer over client-server", back: "Cheap, no server to buy · simple, no network manager · no single point of failure" },
]);
