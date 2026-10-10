CS.registerTrace({
  id: "9.6-1", topic: "9.6", title: "Applying a /26 subnet mask octet by octet", lang: "pseudocode",
  code: "ip ← [192, 168, 1, 200]\nmask ← [255, 255, 255, 192]\nFOR i ← 0 TO 3\n    net[i] ← ip[i] AND mask[i]\n    host[i] ← ip[i] AND (255 - mask[i])\n    OUTPUT net[i], host[i]\nENDFOR",
  intro: "`255 - mask[i]` flips the 8 bits of the mask octet (e.g. 255 − 192 = 63 = 00111111), so ANDing with it keeps only the **host** bits. Work in binary: 200 = 11001000, 192 = 11000000.",
  columns: ["i", "ip[i]", "mask[i]", "net[i]", "host[i]"],
  prefill: [["0", "192", "255", "", ""], ["1", "168", "255", "", ""], ["2", "1", "255", "", ""], ["3", "200", "192", "", ""]],
  rows: [["0", "192", "255", "192", "0"], ["1", "168", "255", "168", "0"], ["2", "1", "255", "1", "0"], ["3", "200", "192", "192", "8"]],
  instructions: "Fill in net[i] and host[i] in denary for each pass of the loop.",
  hint: "Any octet AND 255 is unchanged; any octet AND 0 is 0. For the last octet: 11001000 AND 11000000 = 11000000; 11001000 AND 00111111 = 00001000.",
  note: "Network ID 192.168.1.192, host ID 8 (the 8th host on that /26 subnet). Check: 192 + 8 = 200.",
});
CS.registerTrace({
  id: "9.6-2", topic: "9.6", title: "Filling a NAT translation table", lang: "pseudocode",
  code: "publicIP ← \"203.0.113.5\"\nnextPort ← 40001\nFOR EACH outgoing packet p\n    key ← p.srcIP + \":\" + p.srcPort\n    IF key NOT IN natTable THEN\n        natTable[key] ← nextPort\n        nextPort ← nextPort + 1\n    ENDIF\n    p.srcIP ← publicIP\n    p.srcPort ← natTable[key]\nENDFOR",
  intro: "A home router performs NAT for four outgoing packets, in order. (Real routers also record the destination; this is simplified.)",
  columns: ["Packet", "Private source socket", "Already in table?", "Public source after NAT", "nextPort afterwards"],
  prefill: [["1", "192.168.1.10:50001", "", "", ""], ["2", "192.168.1.11:50001", "", "", ""], ["3", "192.168.1.10:50001", "", "", ""], ["4", "192.168.1.10:50002", "", "", ""]],
  rows: [["1", "192.168.1.10:50001", "No", "203.0.113.5:40001", "40002"], ["2", "192.168.1.11:50001", "No", "203.0.113.5:40002", "40003"], ["3", "192.168.1.10:50001", "Yes", "203.0.113.5:40001", "40003"], ["4", "192.168.1.10:50002", "No", "203.0.113.5:40003", "40004"]],
  instructions: "Write Yes or No for whether the key is already in the table, and the public source socket as IP:port.",
  hint: "Packet 3 belongs to the same connection as packet 1, so it reuses its existing mapping and nextPort does not change.",
  note: "A reply arriving at 203.0.113.5:40002 is translated back to 192.168.1.11:50001. Different devices using the same private port (packets 1 and 2) get different public ports, so replies are never confused.",
});
