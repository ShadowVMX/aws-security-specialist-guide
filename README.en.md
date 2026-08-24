<p align="center">
  <img src="assets/img/banner.svg" width="100%" alt="AWS Certified Security - Specialty — Interactive Study Guide">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/exam-SCS--C03-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="SCS-C03">
  <img src="https://img.shields.io/badge/domains-6%2F6%20complete-3ECF8E?style=for-the-badge" alt="6/6 domains complete">
  <img src="https://img.shields.io/badge/practice%20questions-237-B892FF?style=for-the-badge" alt="237 practice questions">
  <img src="https://img.shields.io/badge/languages-ES%20%7C%20EN-4FA8FF?style=for-the-badge" alt="ES | EN">
  <img src="https://img.shields.io/badge/contributions-issue%20required-FF6B6B?style=for-the-badge" alt="Contributions require an issue">
  <img src="https://img.shields.io/badge/stack-HTML%2FCSS%2FJS-0b1220?style=for-the-badge" alt="Plain HTML/CSS/JS">
</p>

<p align="center">
  <a href="README.md">🇪🇸 Español</a> &nbsp;·&nbsp; <b>🇬🇧 English</b>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="index.html">🌐 Open guide (ES)</a> &nbsp;·&nbsp; <a href="en/index.html">🌐 Open guide (EN)</a>
</p>

<p align="center">
  An <b>interactive</b> study guide for the <b>AWS Certified Security — Specialty (SCS-C03)</b> exam.<br>
  Structured theory, clickable diagrams, real CLI/JSON commands, Azure comparisons, and 237 practice questions. No build step: plain HTML/CSS/JS.
</p>

<br>

> **📌 Version note:** the SCS-C02 exam retired on Dec. 1, 2025. Since Dec. 2, 2025, the only active exam is **SCS-C03** ([official exam guide](https://docs.aws.amazon.com/aws-certification/latest/security-specialty-03/security-specialty-03.html)), with restructured domains compared to SCS-C02. This guide follows SCS-C03's official domain numbering and weights.

## 🚀 How to use it

```bash
git clone https://github.com/ShadowVMX/aws-security-specialist-guide.git
cd aws-security-specialist-guide
```

Open `index.html` (Spanish) or `en/index.html` (English) by double-clicking it, or serve the folder with any simple static server:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## 📚 Domains (SCS-C03)

| # | Domain | Weight | Status |
|---|---|---|---|
| 1 | Detection | 16% | ✅ |
| 2 | Incident Response | 14% | ✅ |
| 3 | Infrastructure Security | 18% | ✅ |
| 4 | Identity and Access Management | 20% | ✅ |
| 5 | Data Protection | 18% | ✅ |
| 6 | Security Foundations & Governance | 14% | ✅ |

Every module includes: theory organized around the exam guide's official task statements, 1-2 interactive SVG diagrams, real CLI/JSON examples, Azure comparisons (where the mapping is reliable) or plain-language examples (where forcing the comparison would mislead), and a practice quiz with an explanation on every answer.

## 🗂️ Structure

```
index.html                 → ES hub with cards for all domains
en/index.html               → EN hub (same content, in English)
assets/
  css/style.css              → shared styles (automatic light/dark theme)
  img/banner.svg              → this README's banner
  js/app.js                   → diagram interaction + active sidebar
  js/quiz.js                  → quiz engine — UI strings in Spanish
  js/quiz.en.js                → same engine — UI strings in English
modules/<domain>/
  index.html                → module content (Spanish)
  quiz-data.js               → quiz questions (Spanish)
en/modules/<domain>/
  index.html                → same module, translated to English
  quiz-data.js               → same questions, translated
```

Every Spanish page links to its English twin under `en/` (and vice versa) via the ES/EN switch in the top bar.

## 🤝 How to contribute

This repo accepts contributions — with a **strict** workflow designed so every change is documented and verified before it touches `main`:

```
 1. Open an Issue           → template: bug / content error / new content
                                (github.com/ShadowVMX/aws-security-specialist-guide/issues/new/choose)
 2. Brief discussion        → especially for large new content (a whole module, etc.)
 3. Fork + branch           → fix/something-specific, content/something-new...
 4. Changes + official source → if you touch technical content, link the AWS/Azure doc backing it
 5. Open the PR             → mandatory template, with "Closes #123"
 6. Review + merge          → main is protected: PR + 1 approved review, no exceptions
```

**`main` has branch protection enabled**: no direct pushes, no force-push, no branch deletion. Every PR needs at least 1 approved review before it can be merged.

📋 Templates available when opening an issue: **[🐛 Web bug](.github/ISSUE_TEMPLATE/bug.md)** · **[📝 Content error](.github/ISSUE_TEMPLATE/content-error.md)** · **[✨ New content](.github/ISSUE_TEMPLATE/new-content.md)**

📖 Full workflow, validations to run before the PR, and checklist: **[CONTRIBUTING.md](CONTRIBUTING.md)**

<br>

<p align="center">
<sub>Personal study guide — not official AWS material. Content reviewed as of 2026.</sub>
</p>
