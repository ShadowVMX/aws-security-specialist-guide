<p align="center">
  <img src="assets/img/banner.svg" width="100%" alt="Guías de certificación en seguridad cloud — SCS-C03 y SC-100">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/examen-SCS--C03-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="SCS-C03">
  <img src="https://img.shields.io/badge/examen-SC--100-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white" alt="SC-100">
  <img src="https://img.shields.io/badge/preguntas-610-B892FF?style=for-the-badge" alt="610 preguntas">
  <img src="https://img.shields.io/badge/skills-151%2F151-3ECF8E?style=for-the-badge" alt="151 de 151 skills cubiertos">
  <img src="https://img.shields.io/badge/idiomas-ES%20%7C%20EN-0b1220?style=for-the-badge" alt="Español e inglés">
</p>

<p align="center">
  <b>🇪🇸 Español</b> &nbsp;·&nbsp; <a href="README.en.md">🇬🇧 English</a>
</p>

<h3 align="center">
  <a href="https://shadowvmx.github.io/">Abrir las guías →</a>
</h3>

<p align="center">
  <a href="https://shadowvmx.github.io/aws-scs-c03/">AWS SCS-C03</a>
  &nbsp;·&nbsp;
  <a href="https://shadowvmx.github.io/sc-100/">Microsoft SC-100</a>
  &nbsp;·&nbsp;
  <a href="https://shadowvmx.github.io/en/">English version</a>
</p>

---

## Descripción general

Guías de estudio interactivas para certificaciones de seguridad en la nube, cada una organizada por los dominios oficiales de su examen y sus *task statements*.

| Guía | Examen | Dominios | Skills | Preguntas | Simulacro |
|---|---|---|---|---|---|
| [AWS Certified Security — Specialty](https://shadowvmx.github.io/aws-scs-c03/) | SCS-C03 | 6 | 70 | 286 | 65 preguntas · 170 min |
| [Microsoft Cybersecurity Architect](https://shadowvmx.github.io/sc-100/) | SC-100 | 4 | 81 | 324 | 48 preguntas · 100 min |

Cada módulo combina teoría estructurada, las trampas más frecuentes del examen y un quiz con
explicación razonada en cada respuesta, y cita la página de documentación oficial que sostiene
cada explicación. La guía de AWS añade diagramas interactivos, ejemplos de AWS CLI y de políticas
JSON, y comparativas con Azure donde el mapeo es fiable.

Funciona en el navegador, sin instalación y sin cuentas: **el progreso se guarda en tu propio dispositivo**.

> **Nota sobre las versiones de examen**
>
> El examen SCS-C02 se retiró el 1 de diciembre de 2025. Desde el 2 de diciembre de 2025 la única versión vigente es **SCS-C03**, con los dominios reestructurados. Esa guía sigue la numeración y los pesos del [exam guide oficial](https://docs.aws.amazon.com/aws-certification/latest/security-specialty-03/security-specialty-03.html).
>
> La guía del **SC-100** sigue los skills medidos a 28 de julio de 2026. Microsoft publica los pesos como rangos (por ejemplo 25-30 %), y la guía imprime el rango literal y usa su punto medio para repartir las preguntas del simulacro.

## Empezar

No requiere instalación:

### [shadowvmx.github.io](https://shadowvmx.github.io/)

<details>
<summary>Ejecutarla en local</summary>

```bash
git clone https://github.com/ShadowVMX/aws-security-specialist-guide.git
cd aws-security-specialist-guide
python3 -m http.server 8000
# → http://localhost:8000
```

También puede abrirse `index.html` directamente desde el disco: no hay build step ni dependencias.

</details>

## Dominios de cada examen

Cada guía imprime los dominios, pesos y *task statements* de su propio examen.

### AWS Certified Security — Specialty (SCS-C03)

Los seis dominios y sus pesos provienen del exam guide oficial, edición 2026. Cada página de módulo
imprime las tareas y skills que le corresponden, con su numeración oficial, y cada
encabezado de teoría lleva el número de skill que cubre.

| # | Dominio | Peso | Preguntas |
|---|---|---|---|
| 1 | Detection | 16 % | 48 |
| 2 | Incident Response | 14 % | 44 |
| 3 | Infrastructure Security | 18 % | 49 |
| 4 | Identity and Access Management | 20 % | 54 |
| 5 | Data Protection | 18 % | 50 |
| 6 | Security Foundations & Governance | 14 % | 41 |

El simulacro reparte sus 65 preguntas con esos mismos pesos: 10 de Detection, 9 de
Incident Response, 12 de Infrastructure Security, 13 de IAM, 12 de Data Protection y
9 de Governance.

### Microsoft Cybersecurity Architect (SC-100)

Los cuatro dominios salen del study guide de Microsoft, con los skills medidos a
28 de julio de 2026. Microsoft publica los pesos como rangos, así que la tabla imprime el rango
y el simulacro reparte sus 48 preguntas por el punto medio.

| # | Dominio | Peso | Skills | Preguntas |
|---|---|---|---|---|
| 1 | Design solutions that align with security best practices and priorities | 20-25 % | 13 | 52 |
| 2 | Design security operations, identity, and compliance capabilities | 25-30 % | 25 | 100 |
| 3 | Design security solutions for infrastructure | 25-30 % | 23 | 92 |
| 4 | Design security solutions for applications and data | 20-25 % | 20 | 80 |

Microsoft no publica cuántas preguntas trae el examen —lo habitual son entre 40 y 60— y la nota
real es escalada sobre 1000, con 700 para aprobar. El simulacro usa 48 preguntas y un 70 % como
referencia de trabajo, no como equivalencia con la nota oficial.

Cada módulo de las dos guías incluye:

- Teoría organizada por los *task statements* oficiales, con su numeración
- El temario oficial del dominio impreso al final, para ir tachando contra la guía
- Diagramas SVG interactivos, navegables también con teclado
- Una sección con las trampas más frecuentes del examen
- Una sección de fuentes oficiales con la documentación en la que se apoya
- Un quiz con explicación razonada en cada respuesta

Y además, según la guía:

- **SCS-C03**: ejemplos de AWS CLI y de políticas JSON listos para leer y adaptar, y comparativas
  con Azure donde el mapeo es fiable
- **SC-100**: una sección de apertura con la mecánica que el examen da por sabida y que espera
  aprendida de AZ-500, SC-200 o SC-300

## Cómo estudiar

### Quiz por dominio

610 preguntas por idioma entre las dos guías —286 de AWS y 324 del SC-100—, con al menos cuatro
por cada skill oficial. Las de **respuesta múltiple** (`choose TWO`) se puntúan todo-o-nada, igual
que en el examen real.

| Función | Para qué sirve |
|---|---|
| Solo falladas | Repasar únicamente lo que aún no dominas |
| Filtro por tema | Centrarte en un servicio o concepto concreto |
| Barajar | Evitar memorizar la respuesta por su posición |
| Marcar con ★ | Apartar preguntas para volver a ellas |
| Reiniciar | Empezar de cero, por módulo o en toda la guía |

### Simulacro de examen

65 preguntas en 170 minutos en la guía de AWS, 48 en 100 minutos en la del SC-100, en ambos casos
con la mezcla oficial por dominio y sin corrección hasta entregar. Al terminar muestra la nota, el
desglose por dominio y la explicación de cada pregunta.

Entrena lo que un quiz por temas no entrena: **repartir el tiempo y decidir sin saber si vas acertando**.

### Seguimiento

La página principal de cada guía muestra cuánto llevas respondido, tu porcentaje de acierto y el
resultado del último simulacro. El progreso de cada certificación se guarda por separado, así que
estudiar una no borra lo de la otra.

### En el móvil

Pensada para estudiar en ratos muertos: índice desplegable en cada módulo, diagramas que se desplazan sin perder legibilidad y tema claro u oscuro según el del sistema.

## Contribuir

Las correcciones y aportaciones son bienvenidas. Consulta **[CONTRIBUTING.md](CONTRIBUTING.md)** para el proceso y los criterios de redacción.

Si detectas un error de contenido, [abre un issue](https://github.com/ShadowVMX/aws-security-specialist-guide/issues/new/choose) indicando el módulo y, a ser posible, la página de la documentación de AWS que lo respalda.

<br>

---

<p align="center">
<sub>
Guías de estudio independientes. No están afiliadas, patrocinadas ni respaldadas por Amazon Web Services ni por Microsoft.<br>
AWS y AWS Certified Security — Specialty son marcas de Amazon.com, Inc. o de sus filiales.<br>
Microsoft, Azure y Microsoft Cybersecurity Architect son marcas del grupo de empresas Microsoft.<br>
Contenido revisado en agosto de 2026.
</sub>
</p>
