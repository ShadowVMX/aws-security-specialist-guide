# AWS Certified Security — Specialty (SCS-C02) — Guía interactiva

Guía de estudio personal para el examen **AWS Certified Security — Specialty**, organizada por los dominios oficiales del examen. Cada módulo combina teoría estructurada, diagramas interactivos, comandos CLI/JSON reales y un quiz de práctica.

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
| 1. IAM & Gestión de Identidades | ~16% | ✅ Completo |
| 2. Threat Detection & Incident Response | ~22% | ⏳ Pendiente |
| 3. Security Logging & Monitoring | ~18% | ⏳ Pendiente |
| 4. Infrastructure Security | ~24% | ⏳ Pendiente |
| 5. Data Protection | ~18% | ⏳ Pendiente |
| 6. Management & Security Governance | ~2% | ⏳ Pendiente |

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
