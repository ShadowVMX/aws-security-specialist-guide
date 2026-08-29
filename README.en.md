<p align="center">
  <img src="assets/img/banner.svg" width="100%" alt="Cloud security certification guides — SCS-C03 and SC-100">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/exam-SCS--C03-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="SCS-C03">
  <img src="https://img.shields.io/badge/exam-SC--100-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white" alt="SC-100">
  <img src="https://img.shields.io/badge/questions-621-B892FF?style=for-the-badge" alt="621 questions">
  <img src="https://img.shields.io/badge/skills-151%2F151-3ECF8E?style=for-the-badge" alt="151 of 151 skills covered">
  <img src="https://img.shields.io/badge/languages-ES%20%7C%20EN-0b1220?style=for-the-badge" alt="Spanish and English">
</p>

<p align="center">
  <a href="README.md">🇪🇸 Español</a> &nbsp;·&nbsp; <b>🇬🇧 English</b>
</p>

<h3 align="center">
  <a href="https://shadowvmx.github.io/en/">Open the guides →</a>
</h3>

<p align="center">
  <a href="https://shadowvmx.github.io/aws-scs-c03/en/">AWS SCS-C03</a>
  &nbsp;·&nbsp;
  <a href="https://shadowvmx.github.io/sc-100/en/">Microsoft SC-100</a>
  &nbsp;·&nbsp;
  <a href="https://shadowvmx.github.io/">Versión en español</a>
</p>

---

## Overview

Interactive study guides for cloud security certifications, each organized around its exam's official domains and task statements.

| Guide | Exam | Domains | Skills | Questions | Simulation |
|---|---|---|---|---|---|
| [AWS Certified Security — Specialty](https://shadowvmx.github.io/aws-scs-c03/en/) | SCS-C03 | 6 | 70 | 297 | 65 questions · 170 min |
| [Microsoft Cybersecurity Architect](https://shadowvmx.github.io/sc-100/en/) | SC-100 | 4 | 81 | 324 | 48 questions · 100 min |

Every module combines structured theory, the exam's most frequent traps and a quiz with a reasoned
explanation on every answer, and cites the official documentation page each explanation rests on.
The AWS guide adds interactive diagrams, AWS CLI and JSON policy examples, and Azure comparisons
where the mapping is reliable.

It runs in the browser, with no installation and no accounts: **your progress is saved on your own device**.

> **Note on the exam versions**
>
> The SCS-C02 exam retired on December 1, 2025. Since December 2, 2025 the only active version is **SCS-C03**, with restructured domains. That guide follows the numbering and weights of the [official exam guide](https://docs.aws.amazon.com/aws-certification/latest/security-specialty-03/security-specialty-03.html).
>
> The **SC-100** guide follows the skills as measured on July 28, 2026. Microsoft publishes weights as ranges (25-30%, for example), so the guide prints the literal range and uses its midpoint to distribute the simulation's questions.

## Getting started

No installation required:

### [shadowvmx.github.io/en](https://shadowvmx.github.io/en/)

<details>
<summary>Run it locally</summary>

```bash
git clone https://github.com/ShadowVMX/aws-security-specialist-guide.git
cd aws-security-specialist-guide
python3 -m http.server 8000
# → http://localhost:8000
```

You can also open `index.html` straight from disk: there is no build step and no dependencies.

</details>

## Domains of each exam

Each guide prints the domains, weights and task statements of its own exam.

### AWS Certified Security — Specialty (SCS-C03)

The six domains and their weights come from the official exam guide, 2026 edition. Every module
page prints the tasks and skills it covers, with their official numbering, and every
theory heading carries the skill number it addresses.

| # | Domain | Weight | Questions |
|---|---|---|---|
| 1 | Detection | 16% | 48 |
| 2 | Incident Response | 14% | 44 |
| 3 | Infrastructure Security | 18% | 49 |
| 4 | Identity and Access Management | 20% | 54 |
| 5 | Data Protection | 18% | 50 |
| 6 | Security Foundations & Governance | 14% | 41 |

The simulation draws its 65 questions with those same weights: 10 Detection, 9 Incident
Response, 12 Infrastructure Security, 13 IAM, 12 Data Protection and 9 Governance.

### Microsoft Cybersecurity Architect (SC-100)

The four domains come from Microsoft's study guide, with the skills as measured on
July 28, 2026. Microsoft publishes weights as ranges, so the table prints the range and the
simulation distributes its 48 questions by the midpoint.

| # | Domain | Weight | Skills | Questions |
|---|---|---|---|---|
| 1 | Design solutions that align with security best practices and priorities | 20-25% | 13 | 52 |
| 2 | Design security operations, identity, and compliance capabilities | 25-30% | 25 | 100 |
| 3 | Design security solutions for infrastructure | 25-30% | 23 | 92 |
| 4 | Design security solutions for applications and data | 20-25% | 20 | 80 |

Microsoft does not publish how many questions the exam carries — 40 to 60 is typical — and the
real score is scaled out of 1000, with 700 to pass. The simulation uses 48 questions and 70% as a
working reference, not as an equivalence with the official score.

Every module in both guides includes:

- Theory organized around the official task statements, with their numbering
- The domain's official content outline printed at the end, to tick off against the guide
- Interactive SVG diagrams, navigable by keyboard as well
- Code examples ready to read and adapt: AWS CLI and JSON policies in the AWS guide;
  KQL, Azure Policy, Azure CLI, PowerShell and T-SQL in the SC-100 one
- A section on the exam's most frequent traps
- An official sources section with the documentation it rests on
- A quiz with a reasoned explanation on every answer

And, depending on the guide:

- **SCS-C03**: Azure comparisons where the mapping is reliable
- **SC-100**: an opening section covering the mechanics the exam takes for granted and expects
  you to have learned from AZ-500, SC-200 or SC-300

## How to study

### Per-domain quiz

621 questions per language across both guides — 297 for AWS and 324 for SC-100 — with at least
four per official skill. **Multiple response** questions (`choose TWO`) are scored all-or-nothing,
exactly as in the real exam.

| Feature | What it's for |
|---|---|
| Wrong answers only | Review just what you haven't mastered |
| Topic filter | Focus on one service or concept |
| Shuffle | Avoid memorizing an answer by its position |
| Flag with ★ | Set questions aside to come back to |
| Reset | Start over, per module or across the guide |

### Exam simulation

65 questions in 170 minutes in the AWS guide, 48 in 100 minutes in the SC-100 one, both with the
official domain mix and no grading until you submit. Each ends with your score, the per-domain
breakdown and every explanation.

It trains what a topic quiz cannot: **pacing yourself and deciding without knowing how you're doing**.

### Tracking

Each guide's home page shows how much you've answered, your accuracy and your last simulation
result. Progress is stored separately per certification, so studying one never erases the other.

### On a phone

Built for studying in spare moments: a collapsible index in every module, diagrams that pan without losing legibility, and a light or dark theme that follows the system.

## Contributing

Corrections and contributions are welcome. See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the process and the writing criteria.

If you spot a content error, [open an issue](https://github.com/ShadowVMX/aws-security-specialist-guide/issues/new/choose) naming the module and, where possible, the AWS documentation page that backs it.

<br>

---

<p align="center">
<sub>
Independent study guides. Not affiliated with, sponsored by, or endorsed by Amazon Web Services or Microsoft.<br>
AWS and AWS Certified Security — Specialty are trademarks of Amazon.com, Inc. or its affiliates.<br>
Microsoft, Azure and Microsoft Cybersecurity Architect are trademarks of the Microsoft group of companies.<br>
Content reviewed in August 2026.
</sub>
</p>
