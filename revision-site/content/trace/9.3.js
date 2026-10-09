CS.registerTrace({
  id: "9.3-1", topic: "9.3", title: "A packet's TTL counting down hop by hop", lang: "pseudocode",
  code: "nextHop ← {\"R1\": \"R2\", \"R2\": \"R5\", \"R5\": \"R7\", \"R7\": \"DEST\"}\nttl ← 4\nat ← \"R1\"\ndelivered ← False\ndropped ← False\nWHILE NOT delivered AND NOT dropped\n    ttl ← ttl - 1\n    IF ttl = 0 THEN\n        dropped ← True\n        OUTPUT \"discarded at \" + at\n    ELSE\n        at ← nextHop[at]\n        IF at = \"DEST\" THEN\n            delivered ← True\n            OUTPUT \"delivered\"\n        ENDIF\n    ENDIF\nENDWHILE",
  intro: "Each pass of the loop is one router (`at`) handling the packet: it decrements the TTL, discards the packet if the TTL has reached 0, and otherwise forwards it to the next hop from its routing table.",
  columns: ["Pass", "ttl", "at", "OUTPUT"],
  prefill: [["start", "4", "R1", ""], ["1", "", "", ""], ["2", "", "", ""], ["3", "", "", ""], ["4", "", "", ""]],
  rows: [["start", "4", "R1", ""], ["1", "3", "R2", ""], ["2", "2", "R5", ""], ["3", "1", "R7", ""], ["4", "0", "R7", "discarded at R7"]],
  instructions: "Fill in ttl and at after each pass of the WHILE loop, and any OUTPUT.",
  hint: "R7 receives the packet with ttl = 1. It decrements it to 0 before it can forward it.",
  note: "The packet was one hop from its destination but was discarded. With an initial TTL of 5 it would have been delivered. Real systems start with a TTL such as 64 so this only happens to packets stuck in a routing loop.",
});
