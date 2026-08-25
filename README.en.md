<p align="center">
  <img src="assets/img/banner.svg" width="100%" alt="AWS Certified Security - Specialty — Interactive study guide">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/exam-SCS--C03-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="SCS-C03">
  <img src="https://img.shields.io/badge/domains-6%2F6-3ECF8E?style=for-the-badge" alt="6 of 6 domains">
  <img src="https://img.shields.io/badge/questions-262-B892FF?style=for-the-badge" alt="262 questions">
  <img src="https://img.shields.io/badge/simulation-65%20questions%20%C2%B7%20170%20min-4FA8FF?style=for-the-badge" alt="65-question, 170-minute simulation">
  <img src="https://img.shields.io/badge/languages-ES%20%7C%20EN-0b1220?style=for-the-badge" alt="Spanish and English">
</p>

<p align="center">
  <a href="README.md">🇪🇸 Español</a> &nbsp;·&nbsp; <b>🇬🇧 English</b>
</p>

<h3 align="center">
  <a href="https://shadowvmx.github.io/aws-security-specialist-guide/en/">Open the guide →</a>
</h3>

<p align="center">
  <a href="https://shadowvmx.github.io/aws-security-specialist-guide/en/exam/">Exam simulation</a>
  &nbsp;·&nbsp;
  <a href="https://shadowvmx.github.io/aws-security-specialist-guide/">Versión en español</a>
</p>

---

## Overview

An interactive study guide for the **AWS Certified Security — Specialty (SCS-C03)** exam, organized around the six official domains and their task statements.

Every module combines structured theory, interactive diagrams, real AWS CLI and JSON policy examples, Azure comparisons where the mapping is reliable, the exam's most frequent traps, and a quiz with a reasoned explanation on every answer.

It runs in the browser, with no installation and no accounts: **your progress is saved on your own device**.

> **Note on the exam version**
>
> The SCS-C02 exam retired on December 1, 2025. Since December 2, 2025 the only active version is **SCS-C03**, with restructured domains. This guide follows the numbering and weights of the [official exam guide](https://docs.aws.amazon.com/aws-certification/latest/security-specialty-03/security-specialty-03.html).

## Getting started

No installation required:

### [shadowvmx.github.io/aws-security-specialist-guide/en](https://shadowvmx.github.io/aws-security-specialist-guide/en/)

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

## Exam domains

| # | Domain | Weight | Questions |
|---|---|---|---|
| 1 | Detection | 16% | 40 |
| 2 | Incident Response | 14% | 41 |
| 3 | Infrastructure Security | 18% | 42 |
| 4 | Identity and Access Management | 20% | 53 |
| 5 | Data Protection | 18% | 46 |
| 6 | Security Foundations & Governance | 14% | 40 |

Every module includes:

- Theory organized around the exam guide's official task statements
- Interactive SVG diagrams, navigable by keyboard as well
- AWS CLI and JSON policy examples ready to read and adapt
- Azure comparisons where the mapping is reliable, or plain-language examples where forcing it would mislead
- A section on the exam's most frequent traps
- Links to the official AWS documentation it rests on
- A quiz with a reasoned explanation on every answer

## How to study

### Per-domain quiz

262 questions, 25 of them **multiple response** (`choose TWO`), scored all-or-nothing exactly as in the real exam.

| Feature | What it's for |
|---|---|
| Wrong answers only | Review just what you haven't mastered |
| Topic filter | Focus on one service or concept |
| Shuffle | Avoid memorizing an answer by its position |
| Flag with ★ | Set questions aside to come back to |
| Reset | Start over, per module or across the guide |

### Exam simulation

65 questions in 170 minutes, with the official domain mix and no grading until you submit. It ends with your score, the per-domain breakdown and every explanation.

It trains what a topic quiz cannot: **pacing yourself and deciding without knowing how you're doing**.

### Tracking

The home page shows how much you've answered, your accuracy and your last simulation result.

### On a phone

Built for studying in spare moments: a collapsible index in every module, diagrams that pan without losing legibility, and a light or dark theme that follows the system.

## Contributing

Corrections and contributions are welcome. See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the process and the writing criteria.

If you spot a content error, [open an issue](https://github.com/ShadowVMX/aws-security-specialist-guide/issues/new/choose) naming the module and, where possible, the AWS documentation page that backs it.

<br>

---

<p align="center">
<sub>
Independent study guide. Not affiliated with, sponsored by, or endorsed by Amazon Web Services.<br>
AWS and AWS Certified Security — Specialty are trademarks of Amazon.com, Inc. or its affiliates.<br>
Content reviewed in August 2026.
</sub>
</p>
