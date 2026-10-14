(function () {
const L12_81 = (topic) => [
  { band: "1", marks: "1-3", score: 2, desc: "A few relevant points about " + topic + ", mostly stated rather than explained. Little or no structure; no line of reasoning." },
  { band: "2", marks: "4-6", score: 5, desc: "Some relevant points with limited explanation. Covers only one or two of the required areas or is largely one-sided. Limited attempt at a line of reasoning." },
  { band: "3", marks: "7-9", score: 8, desc: "Developed points across most required areas, or all areas with some only brief. Some specific examples. A line of reasoning is followed, with some balance." },
  { band: "4", marks: "10-12", score: 11, desc: "A coherent, relevant, substantiated and logically structured response covering **all** required areas in depth, applied to the scenario, balanced, with specific examples, reaching a justified conclusion." },
];
CS.registerExam("8.1", [
  { marks: 2, q: "Explain the difference between a **moral** issue and an **ethical** issue in the context of computing.", scheme: ["A moral issue concerns an individual's own judgement / conscience about what is right or wrong", "An ethical issue concerns the standards / values shared by society or a profession (e.g. a professional code of conduct)"], guidance: "Accept a clear example illustrating each in place of the definition." },
  { marks: 3, q: "Describe **three** ways in which digital technology has increased the capacity to **monitor behaviour**.", scheme: ["CCTV / live facial recognition can identify and track people automatically and continuously", "Mobile phones / apps record location data / location history", "Cookies / tracking pixels / device fingerprinting track browsing across websites", "Workplace / school monitoring software logs keystrokes, screenshots or productivity", "Smart devices (speakers, doorbells, IoT) record audio / video / usage", "Card payments / loyalty schemes record purchases, time and place"], maxPoints: 3, guidance: "One mark per distinct method, described (not just named)." },
  { marks: 4, q: "Explain how software and algorithms can **embed moral and cultural values**. Use an example in your answer.", scheme: ["Developers choose what the algorithm optimises / its objective, which is a value judgement (e.g. engagement over wellbeing)", "Training data reflects past decisions, so historical bias / discrimination is reproduced", "Choice of features / proxies (e.g. postcode, school results) determines who is advantaged", "Defaults and assumptions about what is 'normal' (names, languages, appearance) reflect the culture of the designers", "Example correctly applied, e.g. Amazon recruitment tool penalising women; 2020 A-level algorithm downgrading students from lower-performing schools; facial recognition less accurate for some groups"], maxPoints: 4, guidance: "Max 3 without a relevant example." },
  { marks: 4, q: "Explain why the **scale** at which software is used creates the potential for both great good and great harm. Give one example of each.", scheme: ["Software can be copied at near-zero cost / runs identically on millions of devices / updates pushed to all users at once", "So one design decision or error is multiplied across all users before it can be noticed", "Example of good at scale, e.g. open-source software, free online education, accessibility features, mobile banking", "Example of harm at scale, e.g. CrowdStrike 2024 outage, WannaCry, Post Office Horizon, biased algorithm applied to every applicant"] },
  { marks: 6, q: "A supermarket introduces a loyalty app that tracks customers' purchases and location in store, and offers personalised prices. Explain the **opportunities** and **risks** of this for customers and for the supermarket.", scheme: ["Opportunity (customers): personalised offers / lower prices for regular customers", "Opportunity (supermarket): better stock forecasting / less waste / customer loyalty", "Opportunity: targeted marketing more efficient than mass marketing", "Risk: sensitive inferences from purchases (health, pregnancy, religion)", "Risk: data breach exposes personal shopping habits / location", "Risk: function creep / data shared with third parties such as insurers or advertisers", "Risk: price discrimination against customers without the app / digital divide (older or poorer customers)", "Risk: must comply with UK GDPR (purpose limitation, transparency, security) or face ICO action"], maxPoints: 6, guidance: "Max 4 if only opportunities or only risks are covered." },
  { marks: 12, q: "A city council plans to install a network of cameras with **live facial recognition** across its town centre to identify people on police watchlists. Discuss the **moral, ethical, legal and cultural** issues the council should consider.", levels: L12_81("live facial recognition"), points: [
    "Benefits: faster identification of wanted suspects / missing or vulnerable people; deterrence; reassurance for public and businesses; efficient use of police resources",
    "Ethical: accuracy and bias — studies (e.g. Gender Shades 2018) found higher error rates for some groups, so misidentification and unfair stops fall unevenly",
    "Ethical: mass surveillance of innocent people; 'nothing to hide' argument and its weaknesses (presumption of innocence, data misuse, breaches)",
    "Ethical: function creep — expansion from serious crime to minor offences, protest monitoring, commercial use",
    "Legal: biometric data is special category data under UK GDPR / DPA 2018 — needs lawful basis, DPIA, security, retention limits (delete non-matches)",
    "Legal: R (Bridges) v South Wales Police 2020 — use ruled unlawful due to too much discretion, deficient DPIA, failure of public sector equality duty",
    "Legal: Equality Act 2010 / public sector equality duty to check for discriminatory impact",
    "Moral: individual officers / councillors must decide whether they are comfortable relying on automated matches; human confirmation before acting",
    "Cultural: chilling effect on protest / free association; changes relationship between public and police; normalisation of being watched; citizens may avoid town centre",
    "Accountability: who decides watchlist criteria, independent oversight, transparency (publish policy; FOI requests)",
    "Justified conclusion, e.g. acceptable only if limited to serious crime, tested for bias, overseen independently, non-matches deleted immediately"
  ], guidance: "To reach Level 4 all four areas (moral, ethical, legal, cultural) must be addressed in depth and applied to the council scenario, with a justified conclusion." },
  { marks: 9, q: "Discuss the **environmental** impact of the widespread use of digital technology, including the responsibilities of computer scientists.", levels: [
    { band: "1", marks: "1-3", score: 2, desc: "A few relevant points, mostly stated, e.g. 'computers use electricity'. Little explanation or balance." },
    { band: "2", marks: "4-6", score: 5, desc: "Some explained points, but limited in range or one-sided (e.g. only negatives). Few specific examples." },
    { band: "3", marks: "7-9", score: 8, desc: "A well-structured, balanced discussion of negative and positive impacts with specific examples, including the role/responsibility of computer scientists, leading to a justified conclusion." },
  ], points: [
    "E-waste: tens of millions of tonnes a year, small fraction formally recycled; exported and processed unsafely; toxic materials",
    "Raw materials: mining rare earths / cobalt; environmental and human cost",
    "Planned obsolescence / short software support / unrepairable devices",
    "Data centres: large and growing electricity demand (AI); water for cooling",
    "Cryptocurrency proof-of-work energy use; contrast Ethereum's move to proof-of-stake",
    "Positive: smart grids / smart meters; climate modelling; satellite monitoring; route optimisation; video calls reducing travel; paperless working",
    "Responsibility: efficient algorithms and code; efficient hardware; renewable-powered data centres; designing for longevity and repair; reporting energy use",
    "Justified conclusion weighing the net impact"
  ] },
]);
})();
