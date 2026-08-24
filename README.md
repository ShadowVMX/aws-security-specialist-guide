# AWS Certified Security — Specialty (SCS-C03) — Guía interactiva

🇪🇸 Español (este documento) · 🇬🇧 [English](en/index.html) — la guía completa está disponible en ambos idiomas, con un selector ES/EN en cada página.

Guía de estudio personal para el examen **AWS Certified Security — Specialty**, organizada por los dominios oficiales del examen. Cada módulo combina teoría estructurada, diagramas interactivos, comandos CLI/JSON reales y un quiz de práctica.

> **Nota de versión:** el examen SCS-C02 se retiró el 1 dic. 2025. Desde el 2 dic. 2025 el único examen vigente es **SCS-C03** ([exam guide oficial](https://docs.aws.amazon.com/aws-certification/latest/security-specialty-03/security-specialty-03.html)), con dominios reestructurados respecto a SCS-C02. Esta guía sigue la numeración y pesos de SCS-C03.

Sin frameworks ni build step: HTML/CSS/JS plano. Clona el repo y abre `index.html` en el navegador.

## Cómo usarla

```bash
git clone <tu-repo> aws-security-specialist-guide
cd aws-security-specialist-guide
```

Abre `index.html` haciendo doble clic, o sirve la carpeta con cualquier servidor estático simple:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Progreso

| Dominio | Peso examen | Estado |
|---|---|---|
| 1. Detection | 16% | ✅ Completo |
| 2. Incident Response | 14% | ✅ Completo |
| 3. Infrastructure Security | 18% | ✅ Completo |
| 4. Identity and Access Management | 20% | ✅ Completo |
| 5. Data Protection | 18% | ✅ Completo |
| 6. Security Foundations & Governance | 14% | ✅ Completo |

## Estructura

```
index.html                 → hub ES con las tarjetas de todos los dominios
en/index.html               → hub EN (mismo contenido, en inglés)
assets/css/style.css       → estilos compartidos (tema claro/oscuro automático)
assets/js/app.js           → interacción de diagramas + sidebar activa (ES y EN)
assets/js/quiz.js          → motor de quiz — textos de interfaz en español
assets/js/quiz.en.js       → mismo motor — textos de interfaz en inglés
modules/<dominio>/
  index.html                → contenido del módulo en español
  quiz-data.js               → preguntas del quiz (español)
en/modules/<dominio>/
  index.html                → mismo módulo, traducido al inglés
  quiz-data.js               → mismas preguntas, traducidas
```

Cada página en español enlaza a su gemela en `en/` (y viceversa) vía el selector ES/EN de la barra superior.

Para añadir un módulo nuevo: duplica `modules/iam/` como plantilla, sustituye el contenido y el array `QUIZ_DATA`, activa la tarjeta correspondiente en `index.html` (quitar `disabled`, poner `status ready`, enlazar el `href`), y haz lo mismo bajo `en/` con la traducción al inglés.

## Contribuir

Este repo acepta contribuciones, pero con un flujo estricto: **toda Pull Request debe partir de un Issue ya abierto**, y `main` está protegida (requiere PR + review antes de mergear). Antes de tocar nada, lee **[CONTRIBUTING.md](CONTRIBUTING.md)** — ahí está el flujo completo (en español e inglés) y el script de validación que hay que correr antes de abrir la PR.

---
*Guía de estudio personal — no es material oficial de AWS.*
