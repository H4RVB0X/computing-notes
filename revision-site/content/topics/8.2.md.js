CS.registerTopic({ id: "8.2", title: "Legislation and the challenges for legislators" }, function () {/*

:::objectives
- State the purpose and main provisions of the **Computer Misuse Act 1990** (and its 2006 and 2015 additions).
- Explain the **Data Protection Act 2018** and **UK GDPR**: the seven principles, the rights of data subjects, the lawful bases for processing and the role of the **ICO**.
- Explain how the **Copyright, Designs and Patents Act 1988** protects software, and how licences (including open source) work.
- Describe the **Investigatory Powers Act 2016**, the **Equality Act 2010**, the **Freedom of Information Act 2000** and the **Online Safety Act 2023**, and say which law applies to a given scenario.
- Be aware of newer laws: the **Data (Use and Access) Act 2025** and the **EU AI Act**.
- Discuss the **challenges facing legislators** in the digital age with specific, current examples.
:::

:::quick At a glance
- **Computer Misuse Act 1990**: offences of (1) **unauthorised access** to computer material, (2) unauthorised access **with intent** to commit or facilitate further offences, (3) **unauthorised acts with intent to impair** a computer (originally "unauthorised modification"); plus **making/supplying hacking tools** (2006) and acts causing **serious damage** (2015).
- **Data Protection Act 2018 + UK GDPR**: personal data must be processed lawfully, fairly and transparently; for specified purposes; minimised; accurate; not kept longer than necessary; secure; with **accountability**. Data subjects have rights (access, rectification, erasure, portability, objection, rights about automated decisions…). Regulated by the **ICO**.
- **Copyright, Designs and Patents Act 1988**: software is protected automatically as a literary work; copying, distributing or adapting without a **licence** is infringement.
- **Investigatory Powers Act 2016**: the legal framework for state interception, communications data and hacking; warrants need a **"double lock"** (Secretary of State + Judicial Commissioner). Replaced most of **RIPA 2000**, though RIPA's power to demand encryption keys remains.
- **Equality Act 2010**: no discrimination; **reasonable adjustments**, so websites and software must be accessible to disabled people.
- **Freedom of Information Act 2000**: anyone can request recorded information held by **public authorities**; reply within **20 working days**, subject to exemptions.
- **Online Safety Act 2023**: duties on platforms to tackle illegal content and protect children, enforced by **Ofcom**.
- **Challenges for legislators**: pace of change, global reach and jurisdiction, enforcement, encryption v law enforcement, defining harm, innovation v protection, anonymity, AI accountability.
:::

:::keyterms
Computer Misuse Act 1990 :: UK law that makes unauthorised access to computer material, unauthorised access with intent to commit further offences, and unauthorised acts that impair a computer criminal offences. :: The anti-hacking law.
Data Protection Act 2018 :: UK law that, together with UK GDPR, governs how personal data must be processed and gives individuals rights over their data. :: The rules for handling information about people.
UK GDPR :: The UK's retained version of the EU General Data Protection Regulation, setting out the principles, lawful bases and data subject rights for processing personal data. :: The main rulebook for personal data, kept after Brexit.
Data controller :: The person or organisation that determines the purposes and means of processing personal data. :: Whoever decides why and how the data is used.
Data subject :: The identified or identifiable living individual to whom personal data relates. :: The person the data is about.
Information Commissioner's Office (ICO) :: The UK's independent regulator for data protection and freedom of information, with powers to investigate, issue enforcement notices and fine. :: The data watchdog.
Copyright, Designs and Patents Act 1988 :: UK law that gives creators automatic rights over original works, including software, controlling copying, distribution and adaptation. :: You cannot copy someone else's work (or code) without permission.
Software licence :: A legal agreement granting permission to use, copy or modify software under specified conditions. :: The rules you agree to when you install software.
Investigatory Powers Act 2016 :: UK law setting out and limiting the powers of public bodies to intercept communications, obtain communications data and carry out equipment interference, with judicial oversight. :: The rules for when the state can spy on communications.
Equality Act 2010 :: UK law that prohibits discrimination on the basis of protected characteristics and requires reasonable adjustments for disabled people. :: No unfair treatment, and services must be usable by disabled people.
Freedom of Information Act 2000 :: UK law giving the public a right to request recorded information held by public authorities, subject to exemptions. :: You can ask public bodies what they know.
Online Safety Act 2023 :: UK law placing duties on online platforms and search services to reduce illegal and harmful content, especially for children, enforced by Ofcom. :: Makes platforms responsible for keeping users safe.
Jurisdiction :: The geographical area and legal system within which a court or regulator has authority. :: Whose laws apply, and where.
:::

## The legal landscape at a glance

:::figure Which law protects what?
<svg class="diagram" viewBox="0 0 680 300" role="img" aria-label="UK computing laws grouped by what they protect">
  <g font-family="inherit" font-size="13">
    <rect x="10" y="10" width="210" height="130" rx="10" fill="#ff6b6b" fill-opacity="0.25" stroke="currentColor"/>
    <text x="115" y="34" text-anchor="middle" font-weight="bold">Systems</text>
    <text x="115" y="58" text-anchor="middle">Computer Misuse Act 1990</text>
    <text x="115" y="80" text-anchor="middle" font-size="11">hacking, malware, DoS</text>
    <text x="115" y="104" text-anchor="middle" font-size="11">(+ PSTI Act 2022:</text>
    <text x="115" y="120" text-anchor="middle" font-size="11">no default IoT passwords)</text>
    <rect x="235" y="10" width="210" height="130" rx="10" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="340" y="34" text-anchor="middle" font-weight="bold">Personal data</text>
    <text x="340" y="58" text-anchor="middle">Data Protection Act 2018</text>
    <text x="340" y="78" text-anchor="middle">+ UK GDPR</text>
    <text x="340" y="100" text-anchor="middle" font-size="11">amended by Data (Use and</text>
    <text x="340" y="116" text-anchor="middle" font-size="11">Access) Act 2025; PECR (cookies)</text>
    <rect x="460" y="10" width="210" height="130" rx="10" fill="#ffb347" fill-opacity="0.3" stroke="currentColor"/>
    <text x="565" y="34" text-anchor="middle" font-weight="bold">Creative work</text>
    <text x="565" y="58" text-anchor="middle">Copyright, Designs and</text>
    <text x="565" y="78" text-anchor="middle">Patents Act 1988</text>
    <text x="565" y="104" text-anchor="middle" font-size="11">software, music, images,</text>
    <text x="565" y="120" text-anchor="middle" font-size="11">licences, open source</text>
    <rect x="10" y="155" width="210" height="135" rx="10" fill="#c38dff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="115" y="179" text-anchor="middle" font-weight="bold">State powers</text>
    <text x="115" y="203" text-anchor="middle">Investigatory Powers Act 2016</text>
    <text x="115" y="225" text-anchor="middle" font-size="11">interception, comms data,</text>
    <text x="115" y="241" text-anchor="middle" font-size="11">bulk powers (amended 2024)</text>
    <text x="115" y="263" text-anchor="middle" font-size="11">RIPA 2000 Part III: keys</text>
    <rect x="235" y="155" width="210" height="135" rx="10" fill="#5fd38d" fill-opacity="0.3" stroke="currentColor"/>
    <text x="340" y="179" text-anchor="middle" font-weight="bold">Fairness and openness</text>
    <text x="340" y="203" text-anchor="middle">Equality Act 2010</text>
    <text x="340" y="221" text-anchor="middle" font-size="11">accessibility, algorithmic bias</text>
    <text x="340" y="247" text-anchor="middle">Freedom of Information</text>
    <text x="340" y="265" text-anchor="middle">Act 2000</text>
    <rect x="460" y="155" width="210" height="135" rx="10" fill="#4dd0e1" fill-opacity="0.3" stroke="currentColor"/>
    <text x="565" y="179" text-anchor="middle" font-weight="bold">Online content</text>
    <text x="565" y="203" text-anchor="middle">Online Safety Act 2023</text>
    <text x="565" y="225" text-anchor="middle" font-size="11">Ofcom; illegal content,</text>
    <text x="565" y="241" text-anchor="middle" font-size="11">children's safety</text>
    <text x="565" y="263" text-anchor="middle" font-size="11">Malicious Comms Act 1988</text>
  </g>
</svg>
:::

:::trap Your class slides are out of date: learn the current versions
- **Data Protection Act 1984/1998 and the "eight principles"** have been replaced. The current law is the **Data Protection Act 2018 with UK GDPR**, which has **seven** principles (including the new **accountability** principle). The old "not transferred outside the EU" principle is now handled by separate rules on international transfers.
- **RIPA 2000** is no longer the main surveillance law. The **Investigatory Powers Act 2016** replaced RIPA's rules on interception and communications data. Parts of RIPA survive, notably **Part III**, which lets the authorities demand an encryption key or decrypted data.
- The Isaac page lists a right to "restrict the portability of data". The real right is the **right to data portability**: to *obtain and reuse* your data, e.g. move it to another provider.
- **British Airways was not fined £183m.** That was the ICO's *notice of intent* in 2019; the final fine (2020) was **£20m**. Marriott's proposed £99m became **£18.4m**. Quote the final figures, or just say "fined millions".
:::

## Computer Misuse Act 1990

Passed after the *R v Gold and Schifreen* case (1988), in which two men who had accessed BT's Prestel system using a password they had seen could not be convicted of any existing offence. The law had a gap, so Parliament created specific computer offences.

| Section | Offence | Example | Maximum sentence |
|---|---|---|---|
| **s1** | **Unauthorised access to computer material** | Logging in with someone else's password "just to look"; guessing a teacher's password. | 2 years |
| **s2** | Unauthorised access **with intent to commit or facilitate further offences** | Hacking a bank account in order to transfer money (fraud). | 5 years |
| **s3** | **Unauthorised acts with intent to impair**, or reckless as to impairing, the operation of a computer (originally "unauthorised modification of computer material") | Planting a virus or ransomware; deleting files; a **denial of service** attack. | 10 years |
| **s3ZA** (added by Serious Crime Act **2015**) | Unauthorised acts causing, or creating a risk of, **serious damage** (to human welfare, the environment, the economy or national security) | Attacking a power station's control systems or the NHS. | 14 years, or **life** if the damage is to human welfare or national security |
| **s3A** (added by Police and Justice Act **2006**) | **Making, supplying or obtaining articles** (e.g. malware, hacking tools) for use in the offences above | Selling a botnet or a password-cracking kit for criminal use. | 2 years |

:::note What changed in 2006 and 2015
- **2006 (Police and Justice Act):** rewrote s3 so it clearly covers **denial of service attacks**, which modify nothing but still impair a system; raised the s1 maximum from 6 months to 2 years; added s3A on hacking tools.
- **2015 (Serious Crime Act):** added s3ZA for attacks on **critical national infrastructure**, and extended jurisdiction so UK nationals can be prosecuted for offences committed abroad.
:::

:::trap
- The key word is **unauthorised**. An employee who uses their own login to look at records they are not permitted to view *can* commit an s1 offence: authorisation is about what you are allowed to access, not whether you have a password.
- **Motive is not a defence.** "I was only testing their security" does not make unauthorised access legal. Penetration testers need **written permission** first. (Campaigners have long called for a public-interest defence for security researchers; check whether this has changed by the time you sit the exam.)
- Do not write "the Computer Misuse Act stops hacking". Say it makes specific acts **criminal offences** that can be prosecuted.
:::

## Data Protection Act 2018 and UK GDPR

The **Data Protection Act 2018 (DPA 2018)** works alongside the **UK GDPR** (the EU's General Data Protection Regulation as retained in UK law after Brexit). UK GDPR sets out the main rules; the DPA 2018 adds UK-specific detail, exemptions, rules for law enforcement and intelligence processing, and some criminal offences.

### Who's who

- **Data subject:** the living individual the data is about.
- **Data controller:** decides why and how data is processed (e.g. your school).
- **Data processor:** processes data on the controller's behalf (e.g. the cloud company hosting the school's records).
- **Personal data:** any information relating to an identified or identifiable living person: name, email, location data, IP address, online identifiers.
- **Special category data:** extra protection for racial or ethnic origin, political opinions, religious or philosophical beliefs, trade union membership, genetic data, biometric data used for identification, health, sex life or sexual orientation. Criminal offence data has its own safeguards.

### The seven principles (UK GDPR Article 5)

| # | Principle | Plain English | Breach example |
|---|---|---|---|
| 1 | **Lawfulness, fairness and transparency** | Have a lawful basis, don't mislead, tell people what you do. | Hidden tracking with no privacy notice. |
| 2 | **Purpose limitation** | Collect for specified, explicit purposes; don't reuse for incompatible ones. | A bank sells loan customers' details to a car dealer. |
| 3 | **Data minimisation** | Adequate, relevant and limited to what is necessary. | A gym app asking for your religion. |
| 4 | **Accuracy** | Accurate and kept up to date; fix errors. | A credit file wrongly showing a default. |
| 5 | **Storage limitation** | Kept no longer than necessary. | Keeping CVs of rejected applicants for 10 years. |
| 6 | **Integrity and confidentiality (security)** | Appropriate security against unauthorised access, loss or damage. | An unencrypted laptop of patient records left on a train. |
| 7 | **Accountability** | The controller must be responsible for, and able to **demonstrate**, compliance. | No records of processing, no data protection impact assessment for risky processing. |

:::tip Memory hook
**L**azy **P**eople **M**ake **A**wful **S**andwiches **In** **A**fternoons: **L**awful/fair/transparent, **P**urpose, **M**inimisation, **A**ccuracy, **S**torage, **I**ntegrity/confidentiality, **A**ccountability.
:::

### The six lawful bases (Article 6)

Every processing activity needs at least one:

1. **Consent** — freely given, specific, informed and unambiguous; as easy to withdraw as to give. (In the UK a child must be 13 or over to consent to online services themselves.)
2. **Contract** — needed to fulfil a contract with the person (e.g. a delivery address for an order).
3. **Legal obligation** — needed to comply with the law (e.g. payroll data for HMRC).
4. **Vital interests** — needed to protect someone's life.
5. **Public task** — needed for a task in the public interest or official functions (e.g. a state school's education records).
6. **Legitimate interests** — needed for the organisation's legitimate interests, balanced against the individual's rights (e.g. basic fraud prevention).

:::trap
"Data protection law means you always need consent." **Wrong.** Consent is only one of six lawful bases and is often not the most appropriate one. An employer processes payroll data under contract and legal obligation, not consent.
:::

### Rights of the data subject

| Right | What it means |
|---|---|
| **To be informed** | Be told what is collected, why, how long it is kept, and who it is shared with (privacy notice). |
| **Of access** (subject access request, SAR) | Get a copy of your data, normally free, within **one month** (extendable by two months for complex requests). |
| **To rectification** | Have inaccurate data corrected. |
| **To erasure** ("right to be forgotten") | Have data deleted in certain circumstances, e.g. no longer needed or consent withdrawn. |
| **To restrict processing** | Limit how data is used while, say, accuracy is disputed. |
| **To data portability** | Receive your data in a machine-readable format and move it to another provider. |
| **To object** | Object to processing, e.g. an absolute right to stop direct marketing. |
| **Rights related to automated decision-making and profiling** | Safeguards when significant decisions are made solely by automated means: the right to information, to human intervention and to contest the decision. |

### Enforcement: the ICO

- The **Information Commissioner's Office** investigates complaints, audits organisations, issues enforcement notices and fines.
- Maximum fines: the higher of **£17.5 million or 4% of annual worldwide turnover** for the most serious breaches.
- Controllers must report a personal data breach that poses a risk to people's rights to the ICO **within 72 hours** of becoming aware of it.
- The DPA 2018 creates criminal offences, e.g. knowingly or recklessly obtaining or disclosing personal data without the controller's consent, and re-identifying de-identified data.
- Examples: British Airways **£20m** (2020) and Marriott **£18.4m** (2020) for security failures; TikTok **£12.7m** (2023) for processing children's data without parental consent.

:::note Data (Use and Access) Act 2025 (newer; check the details)
This Act received Royal Assent in **June 2025** and amends UK GDPR, the DPA 2018 and PECR (the cookie rules). Its provisions are being brought into force **in stages** through 2025–2026, so check the current position. To the best of my knowledge it:
- replaces the ICO with an **Information Commission** (a board-led body rather than a single commissioner);
- adds **"recognised legitimate interests"** (such as crime prevention and safeguarding) that do not need a balancing test;
- relaxes the rules on **solely automated decision-making**, allowing it more widely provided safeguards exist (information, human review, the right to contest), with stricter limits for special category data;
- lets some low-risk cookies (such as basic analytics) be set without consent, and raises PECR fines to UK GDPR levels;
- says subject access searches must be "reasonable and proportionate".

The seven principles and the core rights above are **unchanged**, so your exam answers on them remain correct.
:::

## Copyright, Designs and Patents Act 1988

- **Copyright is automatic.** The moment an original work is recorded (written, coded, drawn, recorded), it is protected. No registration or © symbol is required.
- **Software is protected as a literary work** (source code and object code), as are the design materials for a program. Copyright in a literary work lasts for the author's life plus **70 years**. For a **computer-generated work** with no human author, UK law treats the person who made the arrangements for its creation as the author, and protection lasts 50 years.
- **Infringement** includes: copying software, distributing copies, adapting it, renting it out, and making it available online without permission. Using pirated software, file-sharing films or music, and copying code from a repository whose licence forbids it are typical examples.
- **Permitted acts** for a lawful user of software include making a necessary **back-up copy** and decompiling only as needed to achieve interoperability.
- **Ideas are not protected, only their expression.** Two programmers can write different code for the same algorithm. In the UK, software "as such" generally cannot be **patented**, though inventions with a technical effect that use software can be.

### Licences, open source and the like

| Licence type | What you may do | Example |
|---|---|---|
| **Proprietary / commercial** | Use under strict terms (number of devices, no copying, no reverse engineering); source code closed. | Microsoft Office, Adobe Photoshop |
| **Freeware** | Use free of charge, but source closed and redistribution restricted. | Many free games and utilities |
| **Shareware / trial** | Try free for a period or with limited features, then pay. | Trial versions of software |
| **Open source, permissive** | Use, modify and redistribute, even in closed products, keeping the copyright notice. | MIT, BSD, Apache licences (e.g. React, Python's licence) |
| **Open source, copyleft** | Use, modify and redistribute, but derived works must be released under the same licence with source. | GNU GPL (e.g. Linux kernel) |
| **Creative Commons** | Reuse of creative works (images, text) under chosen conditions (attribution, non-commercial, share-alike). | Wikipedia text (CC BY-SA) |

:::trap
- **"Open source" does not mean "no copyright".** Open-source licences *depend on* copyright: the author owns the code and grants permissions under conditions. Ignore the conditions (e.g. using GPL code in a closed product) and you infringe.
- **Free to download ≠ free to copy.** Freeware is still copyrighted.
- Copying a *small* amount of code can still infringe if it is a substantial part in quality, not just quantity.
:::

:::note AI and copyright: an unsettled area
Generative AI models are trained on huge amounts of copyrighted material. The UK's text-and-data-mining exception only covers **non-commercial research**. The UK government consulted in 2024–25 on a broader exception with an "opt-out" for rights holders, which creative industries strongly opposed; at the time of writing the policy was **not settled**. The courts are also involved: in *Getty Images v Stability AI* (High Court, 2025) Getty's main copyright claims did not succeed, but the judgment left the wider question of AI training in the UK open. This is a live example of law lagging behind technology.
:::

## Investigatory Powers Act 2016

Often nicknamed the **"Snooper's Charter"**. It brought the state's surveillance powers into one Act after the Snowden revelations (2013) showed powers being used under unclear older laws.

- **Interception warrants:** to read the content of communications (calls, emails, messages).
- **Communications data:** the "who, when, where, how" of communications (metadata), not content. Telecoms providers can be required to **retain** communications data, including **internet connection records** (which services a device connected to), for up to **12 months**.
- **Equipment interference:** lawful hacking of devices by police and intelligence agencies.
- **Bulk powers:** bulk interception, bulk acquisition of communications data and bulk personal datasets, available to the intelligence agencies (GCHQ, MI5, MI6).
- **Technical capability notices:** can require providers to maintain the ability to give assistance, including removing encryption **they themselves applied**, where this is technically feasible and reasonable.
- **Safeguards:** most warrants need a **"double lock"**: approval by a **Secretary of State** and then by an independent **Judicial Commissioner**. The **Investigatory Powers Commissioner** oversees use of the powers.
- **Investigatory Powers (Amendment) Act 2024:** loosened rules for bulk datasets with a "low expectation of privacy" and added notices requiring tech companies to inform the Home Office of planned changes that could affect lawful access.

:::example Encryption and the IPA in the news
In early 2025 Apple withdrew its **Advanced Data Protection** (end-to-end encrypted iCloud backups) for new UK users, reportedly after receiving a technical capability notice seeking access to encrypted data. It is a clear example of the clash between **privacy and security** and between **national law and global products**: a back door built for one government would weaken security for every user.
:::

:::trap
Students often write that RIPA was "repealed". It was **largely replaced** by the IPA 2016 for interception and communications data, but parts of RIPA, including **Part III** (the power to require someone to disclose an encryption key or decrypted data, with refusal being a criminal offence), remain in force. Safest wording: "The IPA 2016 replaced most of RIPA 2000."
:::

## Equality Act 2010

- Prohibits **direct and indirect discrimination** on the basis of **protected characteristics**: age, disability, gender reassignment, marriage and civil partnership, pregnancy and maternity, race, religion or belief, sex, sexual orientation.
- **Reasonable adjustments:** service providers and employers must make reasonable adjustments so disabled people are not at a substantial disadvantage. For computing this means **accessible websites, apps and software**: screen-reader compatibility, captions, keyboard navigation, sufficient colour contrast, resizable text.
- Public sector websites and apps must also meet the **Public Sector Bodies Accessibility Regulations 2018** (based on the WCAG standard).
- **Algorithmic bias link:** an automated system that disadvantages a protected group (e.g. a CV filter that downgrades women) can amount to **indirect discrimination**, even if nobody intended it. Public bodies also have a **Public Sector Equality Duty** to consider equality impacts, which the court in *Bridges* (2020) found South Wales Police had not done for facial recognition.

## Freedom of Information Act 2000

- Gives **anyone** (any nationality, any age) the right to request **recorded information** held by **public authorities**: government departments, councils, the NHS, police, state schools, universities.
- The authority must respond within **20 working days**: confirm whether it holds the information and, if so, provide it unless an exemption applies.
- **Exemptions** include national security, information that would prejudice law enforcement, **personal data** about other people, commercially sensitive information, and requests that would exceed the **cost limit**.
- It does **not** apply to private companies. Requests for your **own** personal data are subject access requests under data protection law, not FOI.
- Scotland has its own equivalent (FOI (Scotland) Act 2002).
- **Why it matters for computing:** journalists have used FOI to reveal how public bodies use algorithms, facial recognition and data sharing, which supports **transparency and accountability**.

:::trap
Two classic confusions: (1) FOI is about information held by **public bodies**, not "any information about anything"; (2) asking a company for the data it holds **about you** is a subject access request under **UK GDPR**, not an FOI request.
:::

## Online Safety Act 2023

- Places **duties of care** on **user-to-user services** (social media, forums, messaging, gaming chat) and **search services**, including those based abroad that have UK users.
- **Illegal content duties:** assess risks and quickly remove illegal content (terrorism, child sexual abuse material, fraud, threats, incitement). These duties came into force in March 2025.
- **Children's safety duties:** prevent children from encountering harmful content (pornography, self-harm, suicide, eating disorder content), including **"highly effective" age assurance**. Enforced from July 2025.
- The largest platforms have further duties (transparency, user empowerment tools, protecting news and democratic content).
- **Ofcom** is the regulator. It can fine up to **£18 million or 10% of qualifying worldwide revenue**, whichever is greater, and in serious cases ask courts to block services. Senior managers can face criminal liability for failing to comply with information requests.
- Created new criminal offences, including **cyberflashing**, sending **false communications** intended to cause harm, **threatening communications**, encouraging **serious self-harm**, and sharing **intimate images without consent** (including deepfakes). Offensive messages may also fall under the **Malicious Communications Act 1988**.
- **Controversy:** a power for Ofcom to require "accredited technology" to detect child abuse material could, critics argue, undermine **end-to-end encryption**. The government said it would only be used when technically feasible. Age checks raised privacy concerns, and **VPN downloads surged** in the UK when they began in July 2025.

## Other laws worth a sentence

:::columns
**UK**
- **Privacy and Electronic Communications Regulations (PECR) 2003:** consent for cookies and marketing emails/texts ("cookie law").
- **Malicious Communications Act 1988:** offence of sending grossly offensive, threatening or indecent messages.
- **Product Security and Telecommunications Infrastructure Act 2022:** since April 2024, consumer connected devices cannot ship with universal default passwords.
- **Automated Vehicles Act 2024:** makes the authorised company, not the user-in-charge, responsible for how a self-driving vehicle drives.
- **Digital Markets, Competition and Consumers Act 2024:** lets the CMA impose conduct rules on the biggest tech firms.
|||
**EU (affects UK companies selling into the EU)**
- **EU GDPR:** still applies to UK organisations offering services to people in the EU.
- **EU AI Act** (Regulation 2024/1689): the first comprehensive AI law. In force from August 2024, phased in: bans on "unacceptable risk" AI (e.g. social scoring by public authorities, most real-time remote biometric identification in public by police) from February 2025; general-purpose AI model duties from August 2025; most **high-risk** obligations (e.g. AI for recruitment, credit scoring, education) were scheduled for August 2026–27, though the EU proposed delays in late 2025, so **check the current dates**. Fines up to €35m or 7% of global turnover.
- **Digital Services Act:** duties on online platforms, similar in spirit to the UK Online Safety Act.
:::

:::note The UK's approach to AI
The UK has **no single AI Act**. Its approach (set out in 2023) asks existing regulators (ICO, Ofcom, CMA, FCA, MHRA…) to apply five principles to AI in their sectors: safety, transparency, fairness, accountability, and contestability. Contrast this "**pro-innovation**, sector-led" approach with the EU's "**risk-based**, horizontal" Act: it is a good illustration of the innovation v protection challenge below.
:::

:::example Which law applies? Work through a scenario
**Scenario:** A sixth-former guesses the school network administrator's password, logs in, downloads a spreadsheet of staff home addresses, shares it in a group chat, then installs a key-logger he bought online on the admin's PC.

1. **Guessing the password and logging in:** unauthorised access to computer material → **Computer Misuse Act s1**.
2. **Buying the key-logger for that purpose:** obtaining an article for use in a CMA offence → **CMA s3A**.
3. **Installing the key-logger:** an unauthorised act that impairs the operation of the computer / the reliability of data → **CMA s3** (and the access to capture further passwords could be **s2** if intended to facilitate further offences).
4. **Taking and sharing staff addresses:** knowingly obtaining and disclosing personal data without the controller's consent → criminal offence under the **DPA 2018**.
5. **The school's position:** as data controller, it must have **appropriate security** (principle 6). If the password was weak and shared, the school may have breached UK GDPR and must assess whether to report the breach to the **ICO within 72 hours**.
6. **If the chat messages were threatening** towards staff: **Online Safety Act 2023** / **Malicious Communications Act 1988** offences.
:::

## Challenges facing legislators in the digital age

This is a named spec point and a favourite 9/12-mark question. For each challenge: **what** it is, **why** technology causes it, a **specific example**, and (for depth) **how legislators try to respond**.

<svg class="diagram" viewBox="0 0 680 140" role="img" aria-label="Technology moves faster than law: an idea becomes a product in months, law takes years">
  <defs><marker id="arr82" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13">
    <text x="10" y="30" font-weight="bold">Technology</text>
    <line x1="110" y1="25" x2="660" y2="25" stroke="currentColor" marker-end="url(#arr82)"/>
    <circle cx="160" cy="25" r="6" fill="#ff6b6b" fill-opacity="0.6" stroke="currentColor"/><text x="160" y="48" text-anchor="middle" font-size="11">idea</text>
    <circle cx="250" cy="25" r="6" fill="#ff6b6b" fill-opacity="0.6" stroke="currentColor"/><text x="250" y="48" text-anchor="middle" font-size="11">launch</text>
    <circle cx="340" cy="25" r="6" fill="#ff6b6b" fill-opacity="0.6" stroke="currentColor"/><text x="340" y="48" text-anchor="middle" font-size="11">100m users</text>
    <text x="10" y="100" font-weight="bold">Law</text>
    <line x1="110" y1="95" x2="660" y2="95" stroke="currentColor" marker-end="url(#arr82)"/>
    <circle cx="340" cy="95" r="6" fill="#7c9aff" fill-opacity="0.6" stroke="currentColor"/><text x="340" y="118" text-anchor="middle" font-size="11">harm noticed</text>
    <circle cx="470" cy="95" r="6" fill="#7c9aff" fill-opacity="0.6" stroke="currentColor"/><text x="470" y="118" text-anchor="middle" font-size="11">consultation, bill</text>
    <circle cx="620" cy="95" r="6" fill="#7c9aff" fill-opacity="0.6" stroke="currentColor"/><text x="620" y="118" text-anchor="middle" font-size="11">Act in force</text>
    <text x="500" y="58" text-anchor="middle" font-size="12">the gap: months for tech, years for law</text>
  </g>
</svg>

| Challenge | Why it's hard | Example |
|---|---|---|
| **1. Pace of change** | Legislation takes years (consultation, drafting, debate, commencement); technology changes in months. Laws written for one technology can be outdated or too specific. | The Computer Misuse Act was written in 1990 and needed amending in 2006 to clearly cover denial of service. The Online Safety Act took about five years from the 2019 White Paper to the first duties in force; generative AI and deepfakes exploded in the meantime. |
| **2. Global reach and jurisdiction** | The internet ignores borders. Data, servers, companies and criminals may be in different countries with different laws. Something illegal in the UK may be legal where it is hosted. | Ransomware gangs operating from countries that will not extradite; Clearview AI disputing that the ICO had jurisdiction over it; Ofcom's early enforcement against overseas sites that refuse to engage. |
| **3. Enforcement** | Even with good law, regulators lack resources and technical expertise; crimes are high-volume and low-value; evidence is volatile and spread across providers. | Most online fraud is never prosecuted. Age checks can be bypassed with a VPN. Fines may be small compared with the profits of large tech firms. |
| **4. Encryption v law enforcement** | End-to-end encryption protects everyone, including criminals. A "back door" for police is a weakness that criminals and hostile states could also exploit. | Apple v FBI (San Bernardino iPhone, 2016); Apple withdrawing Advanced Data Protection in the UK (2025); the encryption controversy around the Online Safety Act; police infiltration of the criminal EncroChat network (2020). |
| **5. Defining harm** | Speech that is "legal but harmful" (misinformation, content promoting eating disorders) is hard to define without restricting legitimate free expression. Harm differs for adults and children. | The original Online Safety Bill's "legal but harmful" duties for adults were dropped after free speech objections and replaced with user empowerment tools. |
| **6. Innovation v protection** | Strict rules protect people but may push investment and start-ups elsewhere; weak rules leave people exposed. | The UK's light-touch, sector-led AI approach v the EU AI Act; debates over the EU proposing to delay parts of its own Act. |
| **7. Anonymity and attribution** | Tor, VPNs, cryptocurrency and fake accounts make it hard to identify who is responsible. Removing anonymity would endanger whistleblowers, abuse victims and dissidents. | The dark web markets; calls for identity verification on social media versus protecting vulnerable users. |
| **8. AI accountability and liability** | Who is responsible when an AI system causes harm: the developer, the deployer, the user, or the data supplier? Machine-learning decisions can be hard to explain. | Self-driving car crashes (answered in the UK by the Automated Vehicles Act 2024); a hospital AI that misprioritises patients; biased recruitment tools; the Post Office Horizon scandal showed the danger of the legal presumption that computer evidence is reliable. |
| **9. Balancing rights** | Privacy, security, free expression and protection from harm conflict; any law favours some over others. | Investigatory Powers Act bulk powers v privacy; the Bridges ruling on facial recognition. |

:::why
Why can't Parliament just write "technology-neutral" laws? It tries: the Data Protection Act talks about "processing" rather than particular technologies, which is why its principles have aged well. But broad wording creates **uncertainty** (does this law apply to my product?) and leaves courts and regulators to fill in the detail. Narrow wording is clearer but goes out of date. That tension is itself a good point for an essay.
:::

:::tip How legislators respond (use these for balance and depth)
- **Technology-neutral, principle-based laws** (UK GDPR principles) rather than rules for specific gadgets.
- **Regulators with powers to update codes of practice** quickly (ICO codes, Ofcom codes) without new Acts.
- **International cooperation:** the Council of Europe Budapest Convention on Cybercrime; mutual legal assistance treaties; data adequacy agreements.
- **Extraterritorial reach:** laws that apply to any company serving UK or EU users (Online Safety Act, GDPR, EU AI Act). This creates the "Brussels effect", where global firms adopt the strictest standard everywhere.
- **Sandboxes:** regulators let firms test innovations under supervision before full rules apply.
- **Fines based on global turnover** so penalties are meaningful for huge companies.
:::

:::exam
- **"State the law that…"**: give the full name and year (e.g. "Computer Misuse Act 1990"). The name is usually the mark.
- **"Explain how the Data Protection Act 2018 protects…"**: name a **specific principle or right** and apply it to the scenario ("The data should be kept only as long as necessary, so the school should delete…").
- **"Describe the offences under the CMA"**: the three original offences, in examiner wording: *unauthorised access to computer material*; *unauthorised access with intent to commit or facilitate further offences*; *unauthorised modification of computer material / unauthorised acts with intent to impair*.
- **"Discuss the challenges facing legislators"** (9/12 marks): choose 4–5 challenges, give each a **specific example**, explain **why** technology causes it, mention a **response** and its limits, and conclude (e.g. "the greatest challenge is jurisdiction because…"). See [8.3](#/topic/8.3).
- In a broad ethics essay, the **legal** strand earns credit when you **apply** a law, not when you list them all.
:::

:::challenge
1. Find out what the ICO's most recent large fine was for, and which UK GDPR principle had been breached.
2. Should security researchers have a legal defence under the Computer Misuse Act? Write the strongest argument for and against.
3. Make a one-page "which law?" decision tree: given a scenario, which question do you ask first?
4. Compare the UK and EU approaches to regulating AI. Which better balances innovation and protection, and why?
:::

:::recap
- **CMA 1990**: s1 unauthorised access; s2 with intent to commit further offences; s3 unauthorised acts to impair (incl. DoS, malware); s3A hacking tools (2006); s3ZA serious damage (2015).
- **DPA 2018 + UK GDPR**: 7 principles (lawful/fair/transparent, purpose limitation, minimisation, accuracy, storage limitation, security, accountability); 6 lawful bases; rights incl. access (1 month), erasure, portability, automated decisions; ICO; fines up to £17.5m/4%; 72-hour breach reporting. Amended by the **Data (Use and Access) Act 2025**.
- **CDPA 1988**: automatic copyright; software = literary work; licences (proprietary, freeware, open source permissive/copyleft, Creative Commons).
- **IPA 2016**: interception, communications data, equipment interference, bulk powers; double lock; replaced most of RIPA 2000.
- **Equality Act 2010**: reasonable adjustments → accessible tech; indirect discrimination by algorithms. **FOI 2000**: public authorities, 20 working days, exemptions.
- **Online Safety Act 2023**: Ofcom; illegal content and children's safety duties; fines up to £18m/10%.
- **Challenges**: pace of change, jurisdiction, enforcement, encryption, defining harm, innovation v protection, anonymity, AI accountability, balancing rights.
:::

:::related
- [8.1 Moral, ethical, legal and cultural issues](#/topic/8.1)
- [8.3 Writing extended discursive answers](#/topic/8.3)
- [9.4 Internet security](#/topic/9.4)
- [5.8 Compression and encryption](#/topic/5.8)
:::

*/});
