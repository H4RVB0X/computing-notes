(function () {
  const L12 = [
    { band: "1", marks: "1-3", score: 2, desc: "A few relevant points, mostly listed or asserted, with little or no explanation. No clear structure or line of reasoning." },
    { band: "2", marks: "4-6", score: 5, desc: "Some relevant points with some explanation, but narrow (only one or two of the required areas) or largely one-sided. Limited attempt at a line of reasoning; few specific examples." },
    { band: "3", marks: "7-9", score: 8, desc: "A line of reasoning is followed. Developed points covering most of the required areas (or all, with some brief). Some specific examples and some balance; a conclusion may be present but not fully justified." },
    { band: "4", marks: "10-12", score: 11, desc: "A coherent, relevant, substantiated and logically structured response. **All** required areas covered in depth and applied to the scenario, balanced with counter-arguments, specific examples/legislation, and a justified conclusion." },
  ];
  const L9 = [
    { band: "1", marks: "1-3", score: 2, desc: "A few relevant points, mostly stated, with little explanation or structure." },
    { band: "2", marks: "4-6", score: 5, desc: "Some explained points, but limited in range or depth or one-sided; limited reasoning." },
    { band: "3", marks: "7-9", score: 8, desc: "A logically structured, balanced response with developed points and specific examples covering the required areas, leading to a justified conclusion." },
  ];
  CS.registerExam("8.3", [
    { marks: 12, q: "Many homes now have **smart speakers** that respond to voice commands. Discuss the **moral, ethical, legal and cultural** issues raised by their use.", levels: L12, points: [
      "Benefits: convenience; accessibility for blind, elderly or physically disabled users; home automation; information and companionship",
      "Ethical/privacy: always-listening microphones; accidental activations record private conversations; recordings reviewed by human contractors; profiling for advertising",
      "Ethical: children's voices and data collected; children may not understand; Children's Code / age-appropriate design",
      "Legal: UK GDPR — transparency, purpose limitation, data minimisation, retention limits, security; voice may be biometric data; right of access/erasure",
      "Legal: police requests for recordings as evidence (IPA 2016 / warrants); hacking of devices (Computer Misuse Act); PSTI Act 2022 bans default passwords",
      "Moral: individuals deciding whether to record guests/visitors without their knowledge; developers' responsibility for privacy-by-default design",
      "Cultural: changing family interaction and how children learn and ask questions; normalising surveillance in the home; dominance of a few platforms and languages/accents recognised poorly",
      "Justified conclusion, e.g. benefits outweigh risks if users control retention, mute is easy, data minimised and not used for unrelated advertising"
    ], guidance: "Level 4 requires all four areas, applied to smart speakers, with a justified conclusion." },
    { marks: 12, q: "Discuss the **moral, ethical, legal and cultural** issues associated with the introduction of **fully autonomous (self-driving) vehicles** on public roads.", levels: L12, points: [
      "Benefits: most collisions involve human error → potential to save lives; independence for elderly/disabled people; smoother traffic, lower emissions; productivity during journeys",
      "Ethical: programmed trade-offs in unavoidable collisions embed values (who is protected?); cultural variation (Moral Machine study)",
      "Ethical/accountability: who is responsible when a crash happens — manufacturer, software developer, owner? Uber 2018 fatality in Arizona (safety driver prosecuted)",
      "Legal: Automated Vehicles Act 2024 — authorised self-driving entity responsible; user-in-charge immune from driving offences while self-driving",
      "Legal: hacking a vehicle is a CMA offence (s3/s3ZA); location and journey data is personal data under UK GDPR",
      "Moral: engineers deciding whether a system is safe enough to release; pressure of commercial deadlines; BCS duty to public interest",
      "Economic/ethical: job losses for taxi, lorry and delivery drivers; need for retraining",
      "Cultural: changing relationship with cars and driving, town planning, trust in machines; digital divide in access",
      "Justified conclusion"
    ] },
    { marks: 9, q: "Some governments want technology companies to give law enforcement access to **end-to-end encrypted** messages. Discuss the arguments for and against this.", levels: L9, points: [
      "For: helps prevent and investigate terrorism, child sexual abuse and organised crime; criminals 'going dark'; evidence for prosecutions",
      "For: existing legal frameworks (IPA 2016 warrants, double lock; RIPA Part III key disclosure) could provide oversight",
      "Against: a back door for police is a vulnerability others (criminals, hostile states) can exploit — weakens security for everyone",
      "Against: protects journalists, whistleblowers, abuse victims, dissidents under repressive regimes; chilling effect",
      "Against: criminals can switch to other tools/apps, so the measure mainly affects law-abiding users",
      "Examples: Apple v FBI (San Bernardino, 2016); Apple withdrawing Advanced Data Protection in the UK (2025); WhatsApp/Signal threats to leave the UK over the Online Safety Act; police infiltration of EncroChat (2020)",
      "Jurisdiction: global products; one country's demand affects users worldwide",
      "Justified conclusion, e.g. targeted device access with judicial warrants preferable to weakening encryption for all"
    ] },
    { marks: 12, q: "Discuss the impact of **social media platforms** on individuals and society, including the **responsibilities** of the computer scientists who design them.", levels: L12, points: [
      "Positive: connection and community; voice for marginalised groups; rapid information in emergencies; small businesses and creators",
      "Monitoring and profiling for targeted advertising; data harvesting (Cambridge Analytica 2018, up to 87m users; £500,000 ICO fine)",
      "Algorithms optimised for engagement embed values; amplify outrage/extreme content; filter bubbles and echo chambers",
      "Misinformation/disinformation spread at scale (e.g. 2024 Southport riots); deepfakes",
      "Health: persuasive design (infinite scroll, streaks); links to anxiety, sleep, body image in young people; Molly Russell inquest (2022)",
      "Legal: Online Safety Act 2023 — illegal content and children's safety duties, Ofcom fines up to £18m/10%; UK GDPR / Children's Code; TikTok £12.7m fine (2023)",
      "Free speech v protection from harm; who decides what is removed; moderation at scale",
      "Responsibilities of designers: BCS Code (public interest), safety by design, privacy by default, transparency, not exploiting psychological weaknesses",
      "Justified conclusion"
    ] },
    { marks: 9, q: "The NHS wants to share **anonymised** patient records with technology companies to develop AI diagnostic tools. Discuss the issues this raises.", levels: L9, points: [
      "Benefits: earlier and more accurate diagnosis; research into treatments; reduced workload for clinicians; NHS data is a uniquely large, valuable dataset",
      "Re-identification risk: 'anonymised' data can be matched with other data to identify individuals",
      "Legal: health data is special category data; UK GDPR lawful basis, transparency, security, data minimisation; DPIA",
      "Trust and consent: patients may object to commercial use; opt-outs; transparency about which companies and why",
      "Ethical: private companies profiting from public data; fair return to the NHS",
      "Bias: if data is unrepresentative, tools may perform worse for some groups",
      "Accountability: who is liable if an AI-assisted diagnosis is wrong — company, clinician or NHS?",
      "Security of shared data; data breaches",
      "Justified conclusion, e.g. acceptable in a secure environment where data does not leave NHS control, with independent oversight and public transparency"
    ] },
    { marks: 12, q: "A company plans to replace many of its customer service staff with an **AI chatbot** and to use software to monitor the productivity of the remaining staff. Discuss the **moral, ethical, legal and cultural** issues.", levels: L12, points: [
      "Benefits: 24/7 service, lower costs, shorter waiting times, staff freed from repetitive queries",
      "Ethical: job losses and inequality; retraining and redeployment; gains to owners rather than workers",
      "Ethical: chatbot errors/hallucinations; customers misled; vulnerable or less digitally confident customers excluded (digital divide); need for human escalation",
      "Ethical/legal: workplace monitoring — proportionality, transparency, lawful basis under UK GDPR; staff informed; data minimisation",
      "Legal: Equality Act 2010 — chatbot must be accessible; reasonable adjustments; productivity metrics may disadvantage disabled staff (indirect discrimination)",
      "Legal: automated decisions about staff (e.g. dismissal based on metrics) — rights around solely automated decisions",
      "Moral: managers' and developers' responsibility for decisions affecting livelihoods; BCS public interest duty",
      "Cultural: erosion of trust and morale; chilling effect; changing expectations of customer service; normalising algorithmic management",
      "Justified conclusion"
    ] },
    { marks: 3, q: "Describe **three** features of an extended response that would place it in the **top level** of an AQA levels-of-response mark scheme.", scheme: ["Covers all the areas named in the question (e.g. moral, ethical, legal and cultural)", "Points are developed / explained in depth with consequences, not just listed", "Uses specific, relevant examples / legislation applied to the scenario", "Balanced: considers both benefits and risks / counter-arguments", "A coherent, logically structured line of reasoning", "A justified conclusion that weighs the arguments"], maxPoints: 3 },
  ]);
})();
