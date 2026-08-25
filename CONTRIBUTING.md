# Contribuir / Contributing

*(English version below)*

## Español

Este repo es una guía de estudio personal, pero está abierta a contribuciones. Para mantener la calidad y que el historial tenga contexto, se sigue un flujo estricto:

### Flujo de trabajo

1. **Abre un Issue primero.** Usa una de las plantillas (error de contenido, contenido nuevo, o bug de la web). No se aceptan PRs que no partan de un issue — así queda documentado el *por qué* del cambio, no solo el *qué*.
2. Espera a que el issue se discuta/apruebe brevemente antes de ponerte a escribir, sobre todo si es contenido nuevo grande (un módulo entero, por ejemplo) — evita trabajo duplicado o que se rechace por no encajar con el resto de la guía.
3. Haz un fork, crea una rama descriptiva (`fix/iam-kms-typo`, `content/detective-diagram`...).
4. Haz tus cambios. Si tocas contenido técnico, **enlaza la fuente oficial** (documentación de AWS, o de Azure si es una comparativa) en el issue o en la propia PR.
5. Si editas un módulo en español, actualiza también su equivalente en inglés bajo `en/` (o indica claramente en la PR por qué no aplica).
6. Abre la Pull Request usando la plantilla, referenciando el issue con `Closes #123`.
7. `main` está protegida: hace falta pasar por PR y al menos 1 review aprobado antes de mergear. No se admite push directo a `main`.

### Validar antes de abrir la PR

Sin build step, pero sí conviene validar sintaxis antes de subir cambios:

```bash
# Sintaxis de cualquier quiz-data.js que hayas tocado
node -c modules/<modulo>/quiz-data.js

# Que cada pregunta tenga un índice "correct" válido
node -e "
const fs=require('fs');
const src=fs.readFileSync('modules/<modulo>/quiz-data.js','utf8');
const data=new Function(src + '; return QUIZ_DATA;')();
data.forEach((q,i)=>{ if(q.correct<0||q.correct>=q.options.length) console.log('BAD INDEX', i, q.tag); });
"
```

Y abre el HTML modificado directamente en el navegador para comprobar que el quiz, los diagramas interactivos y los enlaces del sidebar siguen funcionando.

### Qué NO hace falta

- No hay npm, no hay build, no hay linter obligatorio — es HTML/CSS/JS plano.
- No hace falta escribir en inglés perfecto en el issue; el mantenedor puede pulir la redacción en review.

---

## English

This repo is a personal study guide, but it's open to contributions. To keep quality high and give the history context, it follows a strict workflow:

### Workflow

1. **Open an Issue first.** Use one of the templates (content error, new content, or web bug). PRs that don't originate from an issue won't be accepted — this documents the *why* of a change, not just the *what*.
2. Wait for the issue to get a brief discussion/approval before writing, especially for large new content (an entire module, for example) — this avoids duplicated work or a PR being rejected for not fitting the rest of the guide.
3. Fork the repo, create a descriptive branch (`fix/iam-kms-typo`, `content/detective-diagram`...).
4. Make your changes. If you touch technical content, **link the official source** (AWS docs, or Azure docs for comparisons) in the issue or the PR itself.
5. If you edit a Spanish module, also update its English counterpart under `en/` (or clearly state in the PR why it doesn't apply).
6. Open the Pull Request using the template, referencing the issue with `Closes #123`.
7. `main` is protected: PRs require at least 1 approved review before merging. Direct pushes to `main` are not allowed.

### Validate before opening the PR

No build step, but do validate syntax before submitting:

```

Desde ahora hay dos herramientas que hacen esto por ti, y son las que debes
ejecutar antes de abrir la PR / There are now two tools that do this for you,
and they are what you should run before opening the PR:

```bash
# Estructura del banco, paridad ES/EN y sesgos de las preguntas.
# Bank structure, ES/EN parity and question biases.
node tools/audit-questions.js

# Enlaces externos vivos (necesita salida a internet sin proxy).
# External links still alive (needs unproxied internet access).
./tools/check-links.sh
```
bash
# Syntax of any quiz-data.js you touched
node -c modules/<module>/quiz-data.js

# Every question has a valid "correct" index
node -e "
const fs=require('fs');
const src=fs.readFileSync('modules/<module>/quiz-data.js','utf8');
const data=new Function(src + '; return QUIZ_DATA;')();
data.forEach((q,i)=>{ if(q.correct<0||q.correct>=q.options.length) console.log('BAD INDEX', i, q.tag); });
"
```

And open the modified HTML directly in a browser to confirm the quiz, interactive diagrams, and sidebar links still work.

### What you DON'T need

- No npm, no build step, no mandatory linter — it's plain HTML/CSS/JS.
- Your issue doesn't need to be written in perfect English or Spanish; the maintainer can polish wording during review.
