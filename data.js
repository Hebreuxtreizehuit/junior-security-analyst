// Customize freely: edit titles, lessons, flashcards, quiz, labs.
// Keep IDs stable so progress tracking doesn't break.

window.APP_DATA = {
  appName: "Junior Security Analyst",
  checklist: [
    {
      id: "logs-alerts",
      title: "Analyze logs and explain alerts",
      level: "foundation",
      why: "SOC work starts with triage: you must read logs, understand signals, and explain what happened.",
      lessons: [
        {
          id: "la-1",
          title: "Log basics: what you’re looking at",
          minutes: 12,
          content: `
<h4>Goal</h4>
<p>Recognize common log fields and what they mean.</p>
<div class="callout"><b>Key fields:</b> timestamp, source, destination, user, action, status, protocol, process, hash, URL.</div>
<h4>Practice</h4>
<ul>
  <li>Find: <b>who</b> did it, <b>what</b> happened, <b>where</b> it came from, <b>when</b>, and <b>impact</b>.</li>
  <li>Write 2 sentences: “This alert fired because …; evidence shows …”</li>
</ul>
`
        },
        {
          id: "la-2",
          title: "Alert triage: true positive vs false positive",
          minutes: 14,
          content: `
<h4>Goal</h4>
<p>Explain alerts clearly using evidence.</p>
<ul>
  <li>Start with: <b>What triggered</b> the alert?</li>
  <li>Then: <b>What evidence supports it</b> (logs, endpoint, network)?</li>
  <li>Then: <b>What to do next</b> (contain, escalate, close)?</li>
</ul>
<div class="callout"><b>Analyst sentence template:</b> “Alert X indicates Y. Evidence: A, B, C. Likely cause: Z. Next steps: 1,2.”</div>
`
        },
        {
          id: "la-3",
          title: "Write a clean alert explanation (mini-report)",
          minutes: 10,
          content: `
<h4>Goal</h4>
<p>Turn noisy data into a short explanation.</p>
<ul>
  <li>1 line summary</li>
  <li>3 bullets evidence</li>
  <li>1 line recommendation</li>
</ul>
`
        }
      ]
    },

    {
      id: "phishing",
      title: "Investigate phishing emails",
      level: "foundation",
      why: "Phishing is the #1 entry point in many organizations.",
      lessons: [
        {
          id: "ph-1",
          title: "Phishing checklist: what to look for",
          minutes: 12,
          content: `
<h4>Indicators</h4>
<ul>
  <li>Sender mismatch (display name vs domain)</li>
  <li>Urgency + pressure</li>
  <li>Unexpected attachment or link</li>
  <li>Lookalike domains / weird URL paths</li>
</ul>
<div class="callout"><b>Deliverable:</b> “Likely phishing because … (3 reasons).”</div>
`
        },
        {
          id: "ph-2",
          title: "Headers: the parts that matter",
          minutes: 14,
          content: `
<h4>Focus fields</h4>
<ul>
  <li><b>From</b>, <b>Reply-To</b>, <b>Return-Path</b></li>
  <li><b>Received</b> chain (mail hops)</li>
  <li><b>SPF/DKIM/DMARC</b> results (pass/fail)</li>
</ul>
<p>Goal: explain if the sender is spoofed and whether the message path is suspicious.</p>
`
        },
        {
          id: "ph-3",
          title: "Triage decision: user safety + escalation",
          minutes: 10,
          content: `
<ul>
  <li>Decide: block, quarantine, reset password, user awareness, escalate.</li>
  <li>Capture: IOCs (domain, URL, hash, sender).</li>
</ul>
`
        }
      ]
    },

    {
      id: "wireshark",
      title: "Use Wireshark confidently",
      level: "intermediate",
      why: "Network visibility is crucial for validating what actually happened on the wire.",
      lessons: [
        {
          id: "ws-1",
          title: "What Wireshark is for (and what it isn’t)",
          minutes: 10,
          content: `
<ul>
  <li>See protocols, endpoints, DNS, TLS handshakes, suspicious connections.</li>
  <li>Answer: “Who talked to whom, when, how, and how much?”</li>
</ul>
<div class="callout"><b>Tip:</b> Start broad, then filter down.</div>
`
        },
        {
          id: "ws-2",
          title: "Filters that every analyst should know",
          minutes: 15,
          content: `
<ul>
  <li><b>ip.addr == x.x.x.x</b> (host involvement)</li>
  <li><b>dns</b> (domain lookups)</li>
  <li><b>http</b> or <b>tls</b> (web traffic)</li>
  <li><b>tcp.port == 443</b> (port focus)</li>
</ul>
<p>Goal: be able to explain a suspicious conversation clearly.</p>
`
        }
      ]
    },

    {
      id: "vuln-scans",
      title: "Run vulnerability scans",
      level: "intermediate",
      why: "Vuln scanning helps find weaknesses before attackers do.",
      lessons: [
        {
          id: "vs-1",
          title: "Vulnerability scanning basics",
          minutes: 12,
          content: `
<ul>
  <li>What a scan does: detects exposures/misconfigurations, suggests fixes.</li>
  <li>Key output: severity, affected asset, evidence, remediation.</li>
</ul>
<div class="callout"><b>Analyst mindset:</b> prioritize by risk + exposure + business impact.</div>
`
        },
        {
          id: "vs-2",
          title: "Communicate findings without panic",
          minutes: 10,
          content: `
<ul>
  <li>Be factual: what is vulnerable, proof, how to fix, urgency.</li>
  <li>Separate “scan finding” from “confirmed exploit”.</li>
</ul>
`
        }
      ]
    },

    {
      id: "incident-reports",
      title: "Write incident reports",
      level: "foundation",
      why: "Reports are how you prove value, transfer knowledge, and support decisions.",
      lessons: [
        {
          id: "ir-1",
          title: "Incident report structure (simple & strong)",
          minutes: 12,
          content: `
<ul>
  <li><b>Summary</b> (what happened, impact)</li>
  <li><b>Timeline</b> (key events)</li>
  <li><b>Evidence</b> (logs, IOCs)</li>
  <li><b>Actions taken</b></li>
  <li><b>Recommendations</b></li>
</ul>
<div class="callout"><b>Rule:</b> write so a non-technical manager understands.</div>
`
        },
        {
          id: "ir-2",
          title: "Timelines and IOCs",
          minutes: 10,
          content: `
<p>Timeline = timestamps + actions. IOCs = domains, IPs, hashes, filenames, user accounts involved.</p>
`
        }
      ]
    },

    {
      id: "automation",
      title: "Automate small tasks",
      level: "intermediate",
      why: "Automation saves time: parsing logs, extracting indicators, formatting reports.",
      lessons: [
        {
          id: "au-1",
          title: "Where automation helps in SOC work",
          minutes: 10,
          content: `
<ul>
  <li>Extract domains/IPs/hashes from text</li>
  <li>Normalize timestamps</li>
  <li>Create report templates</li>
  <li>Quick lookups and enrichment</li>
</ul>
`
        },
        {
          id: "au-2",
          title: "Small scripts mindset",
          minutes: 10,
          content: `
<div class="callout"><b>Pick a repeat task:</b> if you do it 3 times, automate it.</div>
<ul>
  <li>Input → process → output</li>
  <li>Keep it simple and readable</li>
  <li>Log errors</li>
</ul>
`
        }
      ]
    },

    {
      id: "attack-lifecycle",
      title: "Understand attack lifecycles",
      level: "foundation",
      why: "You’ll triage faster when you know the attacker’s steps and objectives.",
      lessons: [
        {
          id: "al-1",
          title: "Lifecycle overview",
          minutes: 12,
          content: `
<ul>
  <li>Recon → Initial access → Execution → Persistence → Privilege escalation</li>
  <li>Defense evasion → Credential access → Discovery → Lateral movement</li>
  <li>Collection → Exfiltration → Impact</li>
</ul>
<div class="callout"><b>Goal:</b> map evidence to a stage and propose next steps.</div>
`
        },
        {
          id: "al-2",
          title: "Map evidence to stages",
          minutes: 10,
          content: `
<ul>
  <li>New admin account created → persistence / privilege escalation</li>
  <li>Unusual DNS to random domains → command & control possibility</li>
  <li>Large outbound transfers → exfiltration possibility</li>
</ul>
`
        }
      ]
    }
  ],

  roleBullets: [
    "Explain alerts using evidence from logs and context",
    "Investigate suspicious emails and extract indicators",
    "Validate network activity and answer ‘who talked to whom’",
    "Prioritize vulnerabilities by risk and communicate remediation",
    "Write clear incident summaries, timelines, and recommendations",
    "Automate repetitive SOC tasks to save time",
    "Map evidence to attack stages to guide response"
  ],

  learningPath: [
    "Analyze logs and explain alerts",
    "Investigate phishing emails",
    "Understand attack lifecycles",
    "Write incident reports",
    "Use Wireshark confidently",
    "Run vulnerability scans",
    "Automate small tasks"
  ],

  flashcards: [
    { deck: "Logs", front: "What’s the difference between an alert and evidence?", back: "Alert = signal/rule fired. Evidence = data that supports/refutes the alert (logs, endpoint, network)." },
    { deck: "Phishing", front: "Which header fields help detect spoofing?", back: "From/Reply-To/Return-Path + Received chain + SPF/DKIM/DMARC results." },
    { deck: "Network", front: "What question should Wireshark help you answer first?", back: "Who talked to whom, when, over what protocol/port, and how much data." },
    { deck: "Vuln", front: "What makes a vuln high priority?", back: "High severity + exposed asset + exploitability + business impact." },
    { deck: "IR", front: "Top 5 sections of an incident report?", back: "Summary, Timeline, Evidence/IOCs, Actions taken, Recommendations." },
    { deck: "Automation", front: "What SOC tasks are good to automate first?", back: "Repeatable tasks: IOC extraction, formatting reports, timestamp conversion, quick lookups." },
    { deck: "Lifecycle", front: "Why map evidence to an attack stage?", back: "It predicts attacker goals and helps choose the next defensive action." }
  ],

  quiz: [
    {
      id: "q1",
      q: "An alert triggers for multiple failed logins followed by a successful one. What is the best analyst next step?",
      choices: [
        "Close it immediately because a login succeeded",
        "Check the source IP, target account, time pattern, and any MFA/geo anomalies",
        "Delete the user account",
        "Restart the firewall"
      ],
      answerIndex: 1,
      explain: "Triage needs evidence: who/where/when + context like MFA, geo, and account activity."
    },
    {
      id: "q2",
      q: "A user reports an email with an urgent tone and a link. What should you capture first?",
      choices: [
        "Only the email subject",
        "The sender display name only",
        "IOCs: sender address/domain, link URL, any attachment name/hash, and header results",
        "Nothing, just tell the user to ignore it"
      ],
      answerIndex: 2,
      explain: "Capture indicators early so you can block/quarantine and prevent spread."
    },
    {
      id: "q3",
      q: "You see unusual DNS queries to random-looking domains. Which attack stage could this suggest?",
      choices: [
        "Printing problems",
        "Potential command-and-control / beaconing behavior",
        "Normal browsing always",
        "Disk defragmentation"
      ],
      answerIndex: 1,
      explain: "Random domains and patterns can indicate beaconing; confirm with context and traffic."
    }
  ],

  labs: [
    {
      id: "lab-logs",
      title: "Lab: Explain an alert using a mini template",
      skillId: "logs-alerts",
      steps: [
        "Pick any alert example (or your own training data).",
        "Write: 1-line summary, 3 evidence bullets, 1 recommendation.",
        "Add a short timeline: T0 alert fired → T1 evidence checked → T2 decision.",
        "Mark complete."
      ]
    },
    {
      id: "lab-phish",
      title: "Lab: Phishing triage write-up",
      skillId: "phishing",
      steps: [
        "Write 3 phishing indicators from a sample email (real or practice).",
        "List IOCs you would extract (domain/URL/sender).",
        "Decide action: block/quarantine/escalate and why.",
        "Mark complete."
      ]
    },
    {
      id: "lab-ir",
      title: "Lab: Incident report skeleton",
      skillId: "incident-reports",
      steps: [
        "Create headings: Summary, Timeline, Evidence/IOCs, Actions, Recommendations.",
        "Write 2–3 lines per section for a simple scenario.",
        "Keep it readable for non-technical readers.",
        "Mark complete."
      ]
    }
  ]
};
