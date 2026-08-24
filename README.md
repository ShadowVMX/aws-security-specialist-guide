# AWS Certified Security — Specialty (SCS-C03) — Guía interactiva

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
| 1. Detection | 16% | ⏳ Pendiente |
| 2. Incident Response | 14% | ⏳ Pendiente |
| 3. Infrastructure Security | 18% | ⏳ Pendiente |
| 4. Identity and Access Management | 20% | ✅ Completo |
| 5. Data Protection | 18% | ✅ Completo |
| 6. Security Foundations & Governance | 14% | ⏳ Pendiente |

## Estructura

```
index.html                 → hub con las tarjetas de todos los dominios
assets/css/style.css       → estilos compartidos (tema claro/oscuro automático)
assets/js/app.js           → interacción de diagramas + sidebar activa
assets/js/quiz.js          → motor de quiz genérico reutilizable
modules/<dominio>/
  index.html                → contenido del módulo
  quiz-data.js               → preguntas del quiz de ese módulo
```

Para añadir un módulo nuevo: duplica `modules/iam/` como plantilla, sustituye el contenido y el array `QUIZ_DATA`, y activa la tarjeta correspondiente en `index.html` (quitar `disabled`, poner `status ready`, enlazar el `href`).

---
*Guía de estudio personal — no es material oficial de AWS.*
