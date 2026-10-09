CS.registerFlashcards("13.1", [
  { front: "Name the five stages of the systematic approach to problem solving in the AQA spec.", back: "Analysis → design → implementation → testing → evaluation" },
  { front: "Give four methods of establishing requirements with the intended users.", back: "Interviews · questionnaires/surveys · observation of current working · examining existing documents/system (also: showing prototypes)" },
  { front: "What four things does the spec say should be designed before construction?", back: "Data structures (for the data model) · algorithms · modular structure · the human user interface" },
  { front: "The valid range is 1 to 50. Give normal, boundary and erroneous test data.", back: "Normal: e.g. 25 (accept)\nBoundary: 1 and 50 (accept); 0 and 51 (reject)\nErroneous: e.g. \"ten\", 7.5, blank, −300 (reject)" },
  { front: "What is the purpose of acceptance testing?", back: "The intended users test the system with real data and tasks to confirm it meets the requirements specification, before they accept (sign off) the system." },
  { front: "Waterfall vs agile: three paired differences.", back: "Requirements fixed at start vs refined each iteration · users involved at start/end vs throughout · working software at the end vs early and often" },
  { front: "What does 'solve the critical path first' mean in implementation?", back: "Build the core parts that everything else depends on first, so each iteration delivers working functionality and delays to essential work are avoided." },
  { front: "List six criteria for evaluating a computer system.", back: "Meets requirements · effectiveness · usability · reliability/robustness · efficiency/performance · maintainability (also security, compatibility, cost/time, user feedback)" },
  { front: "Unit vs integration vs system testing?", back: "Unit: each module alone · Integration: modules working together · System: the whole system against the requirements" },
  { front: "Black-box vs white-box testing?", back: "Black-box: tests chosen from the specification (inputs/expected outputs) without seeing the code. White-box: tests chosen from the code so every path is executed." },
]);
