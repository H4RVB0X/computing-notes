CS.registerTopic({ id: "8.1", title: "Moral, ethical, legal and cultural issues" }, function () {/*

:::objectives
- Tell apart **moral**, **ethical**, **legal** and **cultural** issues, and use each word correctly in an answer.
- Explain how digital technology has transformed the capacity to **monitor behaviour**, **amass and analyse personal information**, and **distribute, publish, communicate and disseminate** it.
- Explain why computer scientists and software engineers have **power and responsibility**, and how **software and algorithms embed moral and cultural values**.
- Explain how the **scale** of software creates the potential for **great good and great harm**, with real examples.
- Discuss a catalogue of current issues (surveillance, misinformation, bias, automation, autonomous vehicles, environment, accessibility, culture, health, professional codes, hacking), giving balanced arguments.
- Apply a reusable **analysis framework** to any unseen scenario in a 9- or 12-mark question.
:::

:::quick At a glance
- **Moral** = individual conscience (is it right for *me*?). **Ethical** = society's shared standards and professional codes. **Legal** = what the law says. **Cultural** = effects on how groups live, communicate and create. Something can be legal but unethical, and vice versa.
- Digital tech has massively increased the capacity to **monitor** (CCTV, facial recognition, phone location, web tracking), **amass and analyse** (cheap storage, data brokers, machine learning, profiling) and **disseminate** (social media, instant global copying, leaks that can never be recalled).
- Those who design algorithms hold **power** and **responsibility**: their choices of data, objective and defaults are **value judgements** baked into code (e.g. the 2020 A-level grading algorithm, recruitment AI that penalised women).
- **Scale**: one engineer's code can run on billions of devices, so a single decision can do **great good** (contact tracing, free education, accessibility tools) or **great harm** (the Post Office Horizon scandal, the CrowdStrike outage, viral misinformation).
- Every issue has **stakeholders**, **benefits**, **risks** and **values in tension** (privacy v security, innovation v protection, free speech v harm).
- Framework for any scenario: **stakeholders → benefits → risks → values in tension → who decides (and who is accountable)**.
- Professional codes such as the **BCS Code of Conduct** (public interest; professional competence and integrity; duty to relevant authority; duty to the profession) guide ethical practice.
:::

:::keyterms
Moral issue :: A question of right and wrong judged by an individual's own conscience and principles. :: What *you* personally think is right.
Ethical issue :: A question of right and wrong judged against the shared standards of a society, group or profession. :: What society or your profession agrees is acceptable.
Legal issue :: A question of whether an action is permitted or prohibited by the law of a particular jurisdiction. :: Is it against the law here?
Cultural issue :: An effect of technology on the beliefs, behaviours, customs, languages and creative life of a group or society. :: How it changes the way people live together.
Personal data :: Any information relating to an identified or identifiable living individual. :: Anything that can be linked to a real, living person.
Profiling :: Automated processing of personal data to evaluate or predict aspects of a person such as behaviour, interests, health or reliability. :: A computer building a picture of what you are like and what you will do.
Algorithmic bias :: Systematic and unfair differences in the outcomes an algorithm produces for different groups, often inherited from training data or design choices. :: The system treats some groups worse, usually because of the data it learned from.
Function creep :: The gradual widening of the use of a technology or data beyond the purpose for which it was originally introduced. :: Collected for one thing, quietly used for others.
Digital divide :: The gap between people who have access to, and the skills to use, digital technology and those who do not. :: Who gets left behind online.
Digital footprint :: The trail of data a person leaves through their use of digital services, both actively shared and passively collected. :: Everything about you that is out there, including what you didn't realise you shared.
Stakeholder :: Any person or group affected by, or with an interest in, a system or decision. :: Everyone who wins or loses.
Data broker :: An organisation that collects personal data from many sources, combines it and sells or licenses it to others. :: Companies whose product is information about you.
Chilling effect :: The discouragement of legitimate behaviour (such as free expression) caused by the fear of being watched or penalised. :: People behave differently, and less freely, when they know they are watched.
:::

## Four words examiners care about

AQA asks you to show awareness of "current **individual (moral)**, **social (ethical)**, **legal** and **cultural** opportunities and risks of computing". Using the four words precisely is an easy way to look like a top-band candidate.

| Lens | Question it asks | Example: an employer reads staff emails |
|---|---|---|
| **Moral** (individual) | Do *I* think this is right? | A manager feels uneasy reading private messages even though she is allowed to. |
| **Ethical** (social) | Does society or my profession accept this? | Most people think blanket monitoring without telling staff is unacceptable; the BCS code stresses respect for privacy. |
| **Legal** | Does the law allow it? | Monitoring must have a lawful basis and be proportionate and transparent under UK GDPR. |
| **Cultural** | How does it change the way groups live? | A workplace culture of distrust; staff self-censor (a chilling effect). |

:::definition Legal is not the same as ethical
- **Legal but arguably unethical:** selling app users' location data to a data broker after burying consent in a 40-page privacy policy; zero-hours scheduling by algorithm; designing an app to be as addictive as possible.
- **Illegal but arguably ethical:** a security researcher accessing a system without permission to expose a flaw that endangers patients; a whistleblower leaking evidence of unlawful mass surveillance.
- Laws lag behind technology, so ethics often has to fill the gap until legislators catch up (see [8.2](#/topic/8.2)).
:::

:::trap
- Do not use "moral" and "ethical" as if they were interchangeable filler. In AQA wording **moral = individual**, **ethical = social**. One sentence that applies each correctly lifts an answer.
- "It's illegal" is not an ethical argument. If you name a law, say **what the law requires** and **why** that protects people.
- Avoid one-sided answers. Every issue in this topic has an **opportunity** as well as a **risk**: the spec literally says "opportunities and risks".
:::

## What digital technology has transformed

The specification makes a precise claim: developments in computer science have "dramatically altered the shape of communications and information flows in societies", enabling **massive transformations** in the capacity to do three things. Learn the three verbs.

<svg class="diagram" viewBox="0 0 680 250" role="img" aria-label="Three transformed capacities: monitor behaviour, amass and analyse personal information, distribute and disseminate it, feeding into each other">
  <defs><marker id="arr81" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="14">
    <rect x="10" y="40" width="200" height="130" rx="10" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="110" y="66" text-anchor="middle" font-weight="bold">1. Monitor behaviour</text>
    <text x="110" y="92" text-anchor="middle" font-size="12">CCTV, facial recognition</text>
    <text x="110" y="110" text-anchor="middle" font-size="12">phone location, cookies</text>
    <text x="110" y="128" text-anchor="middle" font-size="12">smart speakers, IoT</text>
    <text x="110" y="146" text-anchor="middle" font-size="12">workplace software</text>
    <rect x="240" y="40" width="200" height="130" rx="10" fill="#ffb347" fill-opacity="0.3" stroke="currentColor"/>
    <text x="340" y="66" text-anchor="middle" font-weight="bold">2. Amass and analyse</text>
    <text x="340" y="92" text-anchor="middle" font-size="12">cheap storage, cloud</text>
    <text x="340" y="110" text-anchor="middle" font-size="12">combining datasets</text>
    <text x="340" y="128" text-anchor="middle" font-size="12">machine learning, profiling</text>
    <text x="340" y="146" text-anchor="middle" font-size="12">data brokers</text>
    <rect x="470" y="40" width="200" height="130" rx="10" fill="#5fd38d" fill-opacity="0.3" stroke="currentColor"/>
    <text x="570" y="66" text-anchor="middle" font-weight="bold">3. Disseminate</text>
    <text x="570" y="92" text-anchor="middle" font-size="12">social media, sharing</text>
    <text x="570" y="110" text-anchor="middle" font-size="12">zero-cost global copying</text>
    <text x="570" y="128" text-anchor="middle" font-size="12">leaks and breaches</text>
    <text x="570" y="146" text-anchor="middle" font-size="12">permanent, unrecallable</text>
    <line x1="212" y1="105" x2="236" y2="105" stroke="currentColor" marker-end="url(#arr81)"/>
    <line x1="442" y1="105" x2="466" y2="105" stroke="currentColor" marker-end="url(#arr81)"/>
    <path d="M570,172 C570,225 110,225 110,174" fill="none" stroke="currentColor" stroke-dasharray="5 4" marker-end="url(#arr81)"/>
    <text x="340" y="242" text-anchor="middle" font-size="12">published data enables more monitoring (e.g. scraped photos train facial recognition)</text>
  </g>
</svg>

### 1. Monitoring behaviour

Watching people used to need a person to do the watching. Now sensors and software do it continuously, cheaply and automatically.

- **CCTV and live facial recognition (LFR):** the UK has one of the highest densities of CCTV in the world. Police forces (notably the Met and South Wales) use LFR vans that compare faces in a crowd against a watchlist in real time.
- **Location tracking:** phones report location to apps, operating systems and mobile networks. Location history can reveal religion (place of worship), health (clinic visits) and relationships.
- **Online tracking:** cookies, tracking pixels and device fingerprinting follow you across websites to build advertising profiles.
- **Workplace and school monitoring:** keystroke logging, screenshot capture, productivity scores, proctoring software that watches students through webcams.
- **Citizen surveillance:** smart doorbells and dashcams record neighbours and passers-by; footage is shared with police or posted online.

### 2. Amassing and analysing personal information

Storage is now so cheap that organisations keep everything "in case it's useful". Once data from different sources is **combined**, it reveals far more than any single dataset.

- **Inference:** a retailer's model can infer pregnancy from shopping patterns; "likes" can predict personality and political views. You never disclosed these facts; they were *calculated*.
- **Data brokers** buy and merge data from apps, loyalty cards, public records and credit agencies, then sell profiles.
- **Re-identification:** "anonymised" datasets can often be re-identified by matching them against other data (postcode + date of birth + sex identifies most people).
- **Opportunity:** the same techniques power medical research (e.g. analysing NHS records to find drug side-effects), fraud detection, and real-time traffic routing.

### 3. Distributing, publishing and disseminating

- **Speed and reach:** a post can reach millions in hours. In summer 2024, false claims about the identity of the Southport attacker spread online within hours and fed riots across England; several people were later jailed for posts inciting racial hatred.
- **Permanence:** copies spread across servers and screenshots; "deleting" rarely removes all of them.
- **Breaches:** a single breach can expose millions of records at once, and the data is then traded indefinitely.
- **Opportunity:** citizen journalism, whistleblowing, crowdfunding, open-access research, and the ability of marginalised groups to organise and be heard.

:::example Applying the three capacities to one scenario
**Scenario:** a supermarket introduces a loyalty app with personalised prices.

1. **Monitor:** the app logs every purchase, location visits to stores, and time spent looking at products in the app.
2. **Amass and analyse:** purchases are combined with demographic data; a model predicts willingness to pay and life events (new baby, new home, illness).
3. **Disseminate:** data is shared with "partners" (advertisers, possibly insurers); a breach could expose shopping habits that reveal health or religion.

**Opportunities:** lower prices for regular customers, less food waste through better forecasting, offers people genuinely want.
**Risks:** price discrimination against people who do not use the app (often older or poorer people, linking to the digital divide); sensitive inferences; function creep.
:::

:::trap
- Students describe surveillance only as "the government watching you". Much of the modern capacity is **commercial** (advertising, data brokers, insurers) and **peer-to-peer** (doorbells, social media). Mention all three.
- "If you have nothing to hide you have nothing to fear" is a weak argument to rely on. It reverses the presumption of innocence, ignores that data can be **wrong**, **breached** or **misused later** by a different government or company, and ignores the **chilling effect**.
:::

## Power, responsibility and embedded values

### Who holds the power?

The spec says computer scientists and software engineers "have power, as well as the responsibilities that go with it, in the algorithms that they devise and the code that they deploy". The power comes from three facts:

- **Decisions are automated.** A rule written once is applied to every case, without the discretion a human official might use.
- **Code is opaque.** Users, and often managers, cannot see how a decision was reached. Machine-learning models may not be explainable even to their creators.
- **Defaults shape behaviour.** Whatever the programmer makes the default (share location: on/off; autoplay: on/off) is what most people end up with.

### How algorithms embed moral and cultural values

There is no such thing as a "neutral" algorithm. Every design choice is a value judgement.

| Design choice | Hidden value judgement | Real example |
|---|---|---|
| **What the system optimises** | What counts as "success"? | Social feeds optimised for engagement promote outrage and extreme content because it holds attention. |
| **Which training data is used** | Whose past behaviour is the norm? | Amazon's experimental CV-screening tool (reported 2018) learned from a decade of mostly male hires and penalised CVs containing "women's"; it was scrapped. |
| **Which features are used** | What is relevant to judge someone on? | The 2020 A-level algorithm used each school's past results, so a bright student at a historically low-scoring school was capped. About 40% of teacher-assessed grades in England were lowered before the government U-turned. |
| **Thresholds and trade-offs** | Is a false positive or a false negative worse? | A fraud system tuned to catch every fraud wrongly freezes many innocent accounts. |
| **What is assumed "normal"** | Whose culture is the default? | Forms that require one first name and one surname; name fields that reject apostrophes (O'Neill) or non-Latin scripts; facial recognition trained mostly on lighter-skinned faces. |

:::why
Why does bias appear even if nobody intends it? Because machine learning finds patterns in **historical data**, and history contains discrimination. If a feature such as postcode correlates with ethnicity, a model can discriminate by **proxy** even when ethnicity is removed. Removing the protected attribute is not enough; you have to **test outcomes** for each group.
:::

:::example The Post Office Horizon scandal: power, responsibility and scale in one case
1. **The system:** Horizon, an accounting system supplied by Fujitsu, was installed in Post Office branches from 1999.
2. **The fault:** bugs caused it to show shortfalls in branch accounts that did not really exist.
3. **The harm:** the Post Office prosecuted over 900 sub-postmasters between 1999 and 2015 for theft and false accounting. People were jailed, bankrupted and some took their own lives.
4. **Why it happened:** English law presumed computer evidence was reliable unless shown otherwise, and the Post Office insisted the system was robust while knowing about bugs.
5. **Outcome:** a 2019 High Court judgment found Horizon contained bugs capable of causing the shortfalls; the Post Office (Horizon System) Offences Act 2024 quashed most of the convictions.
6. **Lessons for an essay:** the responsibility of developers and organisations to be **honest about defects**; the danger of trusting computer output over people; and a **legal** question (should the presumption that computers are reliable be changed?).
:::

### The issue of scale: great good and great harm

The spec says scale "creates potential for individual computer scientists and software engineers to produce great good, but with it comes the ability to cause great harm". The key idea: **software is copied at near-zero cost**, so a single decision is multiplied by millions.

:::columns
**Great good at scale**
- Free online learning (Khan Academy, Isaac Computer Science, Wikipedia) available to anyone with a connection.
- Open-source software (Linux, Python) underpins most of the internet and is free to use.
- Mobile money (M-Pesa in Kenya) gave millions of unbanked people access to financial services.
- Accessibility features (screen readers, live captions) built into every phone.
- Medical AI that screens scans for cancer and eye disease, helping overstretched clinicians.
|||
**Great harm at scale**
- **CrowdStrike, July 2024:** one faulty security update crashed about 8.5 million Windows machines worldwide, grounding flights and disrupting hospitals.
- **WannaCry, 2017:** ransomware spread to computers worldwide, including across the NHS, cancelling thousands of appointments.
- **Therac-25 (1985–87):** race conditions in radiation therapy software caused massive overdoses; patients died.
- Recommendation algorithms can push harmful content to vulnerable teenagers at scale.
- One poorly designed default (e.g. public sharing on by default) exposes millions of users.
:::

:::trap
Do not stop at "it affects lots of people". Explain the **mechanism** of scale: code is copied identically to every device, updates are pushed to everyone at once, and automated decisions are applied without human review. Then say what that means: a bug or a biased rule is **repeated millions of times** before anyone notices.
:::

## A reusable analysis framework

You will meet unseen scenarios in the exam (a smart city, a health app, an AI tutor, a drone delivery service). Use the same five questions every time. They generate the material for a balanced answer in two minutes of planning.

<svg class="diagram" viewBox="0 0 680 170" role="img" aria-label="Five-step framework: stakeholders, benefits, risks, values in tension, who decides">
  <defs><marker id="arr81b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13">
    <rect x="5" y="30" width="118" height="80" rx="10" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="64" y="60" text-anchor="middle" font-weight="bold">1 Stakeholders</text>
    <text x="64" y="82" text-anchor="middle" font-size="11">who is affected?</text>
    <rect x="143" y="30" width="118" height="80" rx="10" fill="#5fd38d" fill-opacity="0.3" stroke="currentColor"/>
    <text x="202" y="60" text-anchor="middle" font-weight="bold">2 Benefits</text>
    <text x="202" y="82" text-anchor="middle" font-size="11">for whom?</text>
    <rect x="281" y="30" width="118" height="80" rx="10" fill="#ff6b6b" fill-opacity="0.3" stroke="currentColor"/>
    <text x="340" y="60" text-anchor="middle" font-weight="bold">3 Risks</text>
    <text x="340" y="82" text-anchor="middle" font-size="11">to whom?</text>
    <rect x="419" y="30" width="118" height="80" rx="10" fill="#ffb347" fill-opacity="0.3" stroke="currentColor"/>
    <text x="478" y="60" text-anchor="middle" font-weight="bold">4 Values</text>
    <text x="478" y="82" text-anchor="middle" font-size="11">in tension</text>
    <rect x="557" y="30" width="118" height="80" rx="10" fill="#c38dff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="616" y="60" text-anchor="middle" font-weight="bold">5 Who decides?</text>
    <text x="616" y="82" text-anchor="middle" font-size="11">and who is liable?</text>
    <line x1="124" y1="70" x2="140" y2="70" stroke="currentColor" marker-end="url(#arr81b)"/>
    <line x1="262" y1="70" x2="278" y2="70" stroke="currentColor" marker-end="url(#arr81b)"/>
    <line x1="400" y1="70" x2="416" y2="70" stroke="currentColor" marker-end="url(#arr81b)"/>
    <line x1="538" y1="70" x2="554" y2="70" stroke="currentColor" marker-end="url(#arr81b)"/>
    <text x="340" y="145" text-anchor="middle" font-size="12">then weigh it up → a justified conclusion (often "acceptable IF these safeguards…")</text>
  </g>
</svg>

:::steps Using the framework
1. **Stakeholders.** List at least four: the users, the people affected who are *not* users (bystanders, non-customers), the organisation, its employees, developers, government/regulators, society as a whole, future generations.
2. **Benefits.** For each main stakeholder: efficiency, safety, cost, convenience, access, new opportunities. Be specific about *who* gains.
3. **Risks.** Privacy, security, bias, job loss, exclusion, misuse, over-reliance, environmental cost. Again: *to whom*, and how serious and likely.
4. **Values in tension.** Name the trade-off: privacy v security, convenience v privacy, innovation v protection, free expression v protection from harm, efficiency v fairness, individual choice v collective good.
5. **Who decides, and who is accountable?** The user (consent)? The company? The regulator (ICO, Ofcom)? Parliament? Who is liable when it goes wrong? Is there a human in the loop? Can decisions be explained and challenged?
:::

:::tip Lenses to check you have not missed anything
Run the four spec words over your plan: **moral** (individual conscience), **ethical** (society, professional codes), **legal** (which Act? see [8.2](#/topic/8.2)), **cultural** (how life and communities change). A strong answer touches at least three.
:::

## The issue catalogue

Each issue below gives the core tension, current examples, and arguments for and against. Open the ones you need; you will not need every example in one answer, but you need **two or three specific examples ready for each**.

### Privacy and surveillance

:::collapse CCTV, facial recognition, data brokers and tracking
**Core tension:** security and convenience v privacy and freedom.

| For (opportunities) | Against (risks) |
|---|---|
| CCTV deters crime and provides evidence; footage helps find missing people. | Mass monitoring of innocent people; the chilling effect on protest and free association. |
| Live facial recognition can locate wanted suspects quickly; police report arrests that would otherwise not happen. | Accuracy varies by group: the 2018 *Gender Shades* study found commercial systems misclassified darker-skinned women far more often than lighter-skinned men, so errors fall unevenly. |
| Location data helps emergency services find callers and planners understand traffic. | Function creep: data collected for one purpose is reused (e.g. number-plate data, smart-meter data, health data). |
| Targeted adverts fund free services. | Data brokers sell detailed profiles with little transparency; profiles can be used for manipulation or discrimination. |

**Examples to quote**
- *R (Bridges) v South Wales Police* (Court of Appeal, 2020): the force's use of live facial recognition was ruled **unlawful** because the legal framework left too much discretion, the data protection impact assessment was deficient, and the force had not checked for bias.
- **Clearview AI** scraped billions of facial images from the web to build a search tool sold to police; regulators in several countries, including the UK's ICO, took action against it.
- **Cambridge Analytica (2018):** data on up to 87 million Facebook users was harvested via a quiz app and used for political targeting; the ICO fined Facebook the maximum then available (£500,000).
:::

### Social media, misinformation and free expression

:::collapse Echo chambers, misinformation, deepfakes and content moderation
**Core tension:** free expression and open access v protection from harm.

- **Opportunities:** anyone can publish; campaigns and communities form quickly; information about emergencies spreads fast; marginalised voices are heard.
- **Risks:**
  - **Engagement-optimised algorithms** amplify sensational, divisive content (an embedded value, see above).
  - **Filter bubbles / echo chambers:** recommendation systems show people more of what they already believe.
  - **Misinformation** (false, shared in good faith) and **disinformation** (deliberately false): health myths during COVID-19, election interference, the 2024 Southport riots.
  - **Deepfakes:** realistic fake video and audio of politicians; non-consensual intimate deepfake images. Sharing such images is an offence under the Online Safety Act 2023.
  - **Cyberbullying and pile-ons**; anonymity can embolden abusers.
- **Who decides what is removed?** Platforms (private companies) moderate billions of posts, mostly by algorithm, with low-paid human moderators exposed to traumatic content. Too little moderation allows harm; too much threatens legitimate speech.
- **Legal angle:** the Online Safety Act 2023 gives Ofcom power to enforce duties on platforms (see [8.2](#/topic/8.2)).
:::

### Algorithmic bias and fairness

:::collapse Recruitment, policing, credit, welfare and education
**Core tension:** efficiency and consistency v fairness and accountability.

| Area | Benefit claimed | Problem observed |
|---|---|---|
| **Recruitment** | Screens thousands of CVs fast and "objectively". | Amazon's tool penalised women; video-interview analysis may disadvantage disabled or neurodivergent candidates. |
| **Policing** | Predictive policing targets patrols where crime is likely. | It learns from past arrest data, so over-policed areas get more patrols, more arrests, more data: a **feedback loop**. The US COMPAS reoffending score was found (ProPublica, 2016) to give more false "high risk" ratings to Black defendants. |
| **Credit and insurance** | Faster decisions; more data can include people with thin credit files. | Opaque decisions; proxies such as postcode can reproduce discrimination. |
| **Welfare and public services** | Targets help where it is needed; detects fraud. | In 2016 an algorithm in Arkansas, USA cut care hours for disabled people because it ignored conditions such as cerebral palsy; a court later halted it. The Dutch childcare benefits scandal wrongly accused thousands of families of fraud, with nationality used as a risk factor. |
| **Education** | Consistent standards across schools. | The 2020 A-level algorithm downgraded students from historically lower-performing schools. |

**Mitigations to suggest in an answer:** diverse and representative training data; testing outcomes for each group before and after deployment; **explainability** so a person can understand a decision; a **human in the loop** and a right to challenge (UK GDPR gives rights around solely automated decisions); independent audits.
:::

### AI and the automation of jobs

:::collapse Who wins and who loses from automation?
**Core tension:** productivity and new opportunity v job loss and inequality.

- **Opportunities:** automation removes dangerous, dull and repetitive work; AI assistants raise productivity in coding, writing and analysis; new jobs appear (data science, AI safety, maintenance of robots).
- **Risks:**
  - Routine cognitive jobs (data entry, call centres, translation, some paralegal and junior coding work) are now exposed, not just manual jobs.
  - Gains may go to the owners of technology rather than workers, widening inequality.
  - Workers displaced in one region may not have the skills for new jobs elsewhere; retraining takes time and money.
  - "Algorithmic management" in the gig economy: drivers and couriers are allocated work and rated by apps, sometimes deactivated without a human decision.
  - Hidden human labour: data labelling and content moderation outsourced to low-paid workers.
- **Balanced view:** past waves of technology created more jobs than they destroyed overall, but the transition was painful for individuals. Large forecasts (such as the World Economic Forum's) suggest more jobs created than displaced this decade, but in different roles needing different skills, which puts the emphasis on education and retraining.
:::

### Autonomous vehicles and accountability

:::collapse Self-driving cars: the accountability problem
**Core tension:** safety and mobility v accountability and trust.

- **Opportunities:** most road collisions involve human error, so well-designed automation could save many lives; independence for people who cannot drive (elderly, disabled); smoother traffic and lower emissions.
- **Risks:**
  - **Accountability:** if an automated car crashes, who is responsible: the "driver", the manufacturer, the software developer, the supplier of the map data?
  - In 2018 an Uber test vehicle in self-driving mode struck and killed a pedestrian in Arizona; the safety driver, not the company, was prosecuted.
  - **Ethical dilemmas in code:** how should the car weigh risks to its passengers against risks to pedestrians? Somebody must program a choice, which embeds values (the MIT "Moral Machine" survey found people in different cultures answered differently).
  - Security: vehicles can be hacked; huge amounts of location data are collected.
  - Jobs for professional drivers.
- **Legal response:** the UK's **Automated Vehicles Act 2024** makes the authorised company behind a self-driving system responsible for how it drives when self-driving is engaged, and protects the "user-in-charge" from prosecution for driving offences in that mode.
:::

### Environmental impact

:::collapse E-waste, data centres, crypto mining and green uses of computing
**Core tension:** the benefits of computing v its material and energy cost.

**Negative impacts**
- **E-waste:** the UN's Global E-waste Monitor estimated about 62 million tonnes of e-waste in 2022, with less than a quarter formally collected and recycled. Much is shipped to lower-income countries and processed unsafely, exposing workers to toxic metals.
- **Raw materials:** devices need rare earths and metals such as cobalt, linked to environmental damage and poor working conditions in mining.
- **Planned obsolescence:** short software support periods and sealed batteries push people to replace devices early.
- **Data centres:** use large amounts of electricity (the International Energy Agency estimated around 1.5% of global electricity in 2024, rising fast with AI) and, in many designs, large volumes of water for cooling. Training and running large AI models adds significantly to demand.
- **Cryptocurrency mining:** Bitcoin's proof-of-work uses electricity comparable to that of a medium-sized country. Ethereum's 2022 switch to proof-of-stake cut its energy use by over 99%, showing design choices matter.

**Positive impacts**
- Smart grids balance renewable energy supply and demand; smart meters and thermostats reduce waste.
- Climate modelling, satellite monitoring of deforestation, and route optimisation that saves fuel.
- Video calls replacing some travel; digital documents replacing paper.
- Right-to-repair rules, refurbishment and longer software support extend device life.

**Responsibility of computer scientists:** writing efficient code, choosing efficient algorithms and hardware, locating data centres near renewable energy, and designing for longevity.
:::

### Accessibility and the digital divide

:::collapse Inclusion, exclusion and "digital by default"
**Core tension:** the efficiency of moving services online v excluding people who cannot follow.

- **Opportunities:** screen readers, voice control, live captions, text-to-speech and eye tracking give disabled people independence; remote work and learning open opportunities to people who cannot travel.
- **The digital divide** has several dimensions: **access** (no device or broadband, poor rural coverage), **affordability** (data costs), **skills and confidence** (many older people), **disability** (inaccessible design).
- **Risks of "digital by default":** when banking, benefits, GP appointments and parking move online and branches close, people without access are excluded or pay more (the "poverty premium").
- **Globally:** a significant share of the world's population is still offline, so online-only services widen inequality between and within countries.
- **Responsibility:** design to accessibility standards (WCAG), keep non-digital routes for essential services, test with real users. In the UK the **Equality Act 2010** requires reasonable adjustments, and public sector websites must meet accessibility regulations.
:::

### Cultural impact: language, creativity, generative AI and copyright

:::collapse How technology changes culture
**Core tension:** cultural exchange and creative opportunity v homogenisation and loss of livelihood.

- **Language:** most web content and AI training data is English, so AI tools work best in English and dominant languages; smaller languages may be marginalised. On the other hand, machine translation and digital archives help preserve and revive minority languages (e.g. Welsh language technology projects).
- **Global culture:** streaming and social media spread cultures worldwide (K-pop, anime) but also concentrate attention on a few global platforms, pressuring local media.
- **Changing social norms:** online communication changes how people form relationships, protest, shop and work; "always on" culture blurs work and home.
- **Generative AI and creativity:**
  - **Opportunities:** anyone can create images, music and code; new art forms; faster prototyping.
  - **Risks:** models were trained on millions of copyrighted works, often without permission or payment; illustrators, voice actors and translators fear for their livelihoods; floods of low-quality AI content; questions about authorship (who owns an AI-generated image?).
  - **Legal angle:** UK copyright law and how it applies to AI training was still being contested in the courts and in government policy at the time of writing (see [8.2](#/topic/8.2)).
- **Cultural values in software:** whose calendar, names, gestures, emoji skin tones and moral norms are the default? Content moderation rules written in one country are applied worldwide.
:::

### Health and wellbeing

:::collapse Screen time, mental health and health technology
**Core tension:** connection and health benefits v addictive design and harm.

- **Risks:** persuasive design (infinite scroll, autoplay, streaks, variable rewards) is engineered to maximise time on the app; links between heavy social media use and anxiety, poor sleep and body-image issues in young people (research evidence is debated, but concern is strong). The 2022 inquest into the death of **Molly Russell** concluded that harmful online content had contributed to her death, which influenced the Online Safety Act. Other risks: repetitive strain injury, eye strain, sedentary lifestyles, gambling apps.
- **Opportunities:** online support communities; NHS app and telemedicine; fitness tracking; AI-assisted diagnosis; remote monitoring of patients at home; assistive technology.
- **Ethical design responses:** default time limits for children, turning off autoplay, removing like counts, age-appropriate design (the ICO's Children's Code).
:::

### Professional codes: the BCS Code of Conduct

The **BCS, The Chartered Institute for IT** sets a Code of Conduct for its members. It is the best answer to "what responsibilities do software engineers have?". It is organised under **four duties**:

| Duty | What it means in practice |
|---|---|
| **1. Public interest** | Have due regard for public health, privacy, security and wellbeing, and the environment; respect the rights of third parties; do not discriminate; promote equal access to IT. |
| **2. Professional competence and integrity** | Only take on work you are competent to do; keep your skills up to date; know and follow relevant legislation; accept honest criticism; avoid conflicts of interest; reject bribery. |
| **3. Duty to relevant authority** (employer or client) | Carry out work with due care and diligence; do not disclose confidential information without permission (except as required by law); do not misrepresent the performance of products. |
| **4. Duty to the profession** | Uphold the reputation of the profession; act with integrity towards other members; support fellow members' professional development. |

:::note Codes v laws
A professional code is **ethical**, not legal. Breaking it can lead to expulsion from the professional body, but not to prosecution. Its value is that it sets out what society should be able to expect from IT professionals, including in areas where the law is silent. The ACM (in the USA) has a similar Code of Ethics.
:::

### The hacker ethic v the law

:::collapse Hacking: curiosity, activism, security research and crime
**Core tension:** freedom of information and curiosity v property, privacy and security.

- **The hacker ethic** (described by Steven Levy, 1984) held that information should be free, access to computers should be unlimited, and authority should be mistrusted. Much early open-source and free software culture grew from this.
- **Types of hacker:** *white hat* (authorised penetration testers, bug bounty hunters), *grey hat* (unauthorised but without malicious intent, e.g. exposing a flaw), *black hat* (criminal), *hacktivist* (politically motivated, e.g. DDoS of government sites).
- **The law:** in the UK the **Computer Misuse Act 1990** makes **unauthorised** access an offence regardless of motive. Good intentions are not a defence, which campaigners argue deters legitimate security research.
- **Example:** Gary McKinnon, a UK hacker, accessed US military and NASA computers in 2001–02 looking for evidence of UFOs. The US sought his extradition for years; it was blocked by the Home Secretary in 2012 on health grounds.
- **Balance:** ethical hacking with permission strengthens security; bug bounty programmes give hackers a legal route; responsible disclosure gives companies time to fix flaws before they are made public.
:::

## Bringing it together

:::example Planning a discussion with the framework
**Question:** *A city council plans to install a network of cameras with live facial recognition across its town centre. Discuss the moral, ethical, legal and cultural issues.*

1. **Stakeholders:** residents, visitors, shop owners, police, council, people on watchlists, people misidentified, minority groups, the companies supplying the system.
2. **Benefits:** faster identification of wanted suspects and missing persons; deterrence; reassurance for shoppers; efficient use of police time.
3. **Risks:** misidentification (higher error rates for some groups leads to unfair stops); chilling effect on protest; function creep (from serious crime to minor offences or tracking protestors); data breach of biometric data; cost.
4. **Values in tension:** security v privacy; efficiency v fairness; collective safety v individual liberty.
5. **Who decides / accountable:** the council and police must have a clear legal basis (cf. *Bridges* 2020), a data protection impact assessment, published watchlist criteria, human confirmation before any stop, independent oversight.

**Conclusion (justified):** acceptable only if strictly limited to serious crime, independently tested for bias, overseen by a body outside the police, and with images of non-matches deleted immediately; otherwise the risks to liberty and fairness outweigh the benefits.
:::

:::exam
- **Command words:** *Discuss* = explore both sides and reach a judgement. *Explain* = give reasons (because… which means…). *Evaluate* = weigh up and decide.
- **2-mark "Explain one issue"**: name the issue + explain its consequence for a stakeholder (e.g. "Facial recognition may misidentify people from some ethnic groups more often (1) so innocent people may be stopped unfairly (1).").
- **9/12-mark questions** are marked with levels of response. The top band needs **breadth** (several issues across moral/ethical/legal/cultural), **depth** (developed points with specific examples), **balance** (benefits and risks) and a **line of reasoning** ending in a justified conclusion. Full method and model answers: [8.3](#/topic/8.3).
- Always tie points to the **scenario in the question**. A generic essay about privacy in general caps you in the middle band.
- Name **specific laws** when relevant (see [8.2](#/topic/8.2)), but legal points are only one strand; do not write the whole answer about the law.
:::

:::challenge
1. Choose an app you use daily. List what it monitors, what it could infer about you, and who it shares data with. Check its privacy policy: were you right?
2. "Algorithms are neutral; only the people using them are biased." Write a paragraph arguing against this, with two examples.
3. Apply the five-step framework to an AI tutor that personalises lessons for every school pupil in England. What is your conclusion, and what safeguards would you require?
4. Which is the greater environmental concern: the energy used by AI data centres or e-waste? Justify your view.
:::

:::recap
- **Moral** = individual; **ethical** = societal/professional; **legal** = the law; **cultural** = how groups live, communicate and create. Legal ≠ ethical.
- Digital technology has transformed the capacity to **monitor behaviour**, **amass and analyse personal information**, and **disseminate** it (commercial, state and peer-to-peer).
- Developers hold **power and responsibility**; algorithms **embed values** through objectives, training data, features, thresholds and defaults.
- **Scale** multiplies every decision: great good (open source, education, accessibility) and great harm (Horizon, CrowdStrike, WannaCry, biased algorithms).
- Framework: **stakeholders → benefits → risks → values in tension → who decides/accountable** → justified conclusion.
- Have two or three specific examples ready for: surveillance, misinformation, bias, automation, autonomous vehicles, environment, accessibility, culture/AI, health, professional codes, hacking.
- The **BCS Code of Conduct**: public interest; professional competence and integrity; duty to relevant authority; duty to the profession.
:::

:::related
- [8.2 Legislation and the challenges for legislators](#/topic/8.2)
- [8.3 Writing extended discursive answers](#/topic/8.3)
- [11.1 Big Data](#/topic/11.1)
- [9.4 Internet security](#/topic/9.4)
:::

*/});
