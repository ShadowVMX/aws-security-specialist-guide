<p align="center">
  <img src="assets/img/banner.svg" width="100%" alt="AWS Certified Security - Specialty — Guía de estudio interactiva">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/examen-SCS--C03-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="SCS-C03">
  <img src="https://img.shields.io/badge/dominios-6%2F6-3ECF8E?style=for-the-badge" alt="6 de 6 dominios">
  <img src="https://img.shields.io/badge/preguntas-286-B892FF?style=for-the-badge" alt="286 preguntas">
  <img src="https://img.shields.io/badge/simulacro-65%20preguntas%20%C2%B7%20170%20min-4FA8FF?style=for-the-badge" alt="Simulacro de 65 preguntas en 170 minutos">
  <img src="https://img.shields.io/badge/idiomas-ES%20%7C%20EN-0b1220?style=for-the-badge" alt="Español e inglés">
</p>

<p align="center">
  <b>🇪🇸 Español</b> &nbsp;·&nbsp; <a href="README.en.md">🇬🇧 English</a>
</p>

<h3 align="center">
  <a href="https://shadowvmx.github.io/aws-scs-c03/">Abrir la guía →</a>
</h3>

<p align="center">
  <a href="https://shadowvmx.github.io/aws-scs-c03/examen/">Simulacro de examen</a>
  &nbsp;·&nbsp;
  <a href="https://shadowvmx.github.io/aws-scs-c03/en/">English version</a>
</p>

---

## Descripción general

Guía de estudio interactiva para el examen **AWS Certified Security — Specialty (SCS-C03)**, organizada por los seis dominios oficiales y sus *task statements*.

Cada módulo combina teoría estructurada, diagramas interactivos, ejemplos reales de AWS CLI y de políticas JSON, comparativas con Azure donde el mapeo es fiable, las trampas más frecuentes del examen y un quiz con explicación razonada en cada respuesta.

Funciona en el navegador, sin instalación y sin cuentas: **el progreso se guarda en tu propio dispositivo**.

> **Nota sobre la versión del examen**
>
> El examen SCS-C02 se retiró el 1 de diciembre de 2025. Desde el 2 de diciembre de 2025 la única versión vigente es **SCS-C03**, con los dominios reestructurados. Esta guía sigue la numeración y los pesos del [exam guide oficial](https://docs.aws.amazon.com/aws-certification/latest/security-specialty-03/security-specialty-03.html).

## Empezar

No requiere instalación:

### [shadowvmx.github.io/aws-security-specialist-guide](https://shadowvmx.github.io/aws-scs-c03/)

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

## Dominios del examen

Los seis dominios, sus pesos y sus *task statements* provienen de la guía oficial
**AWS Certified Security – Specialty (SCS-C03)**, edición 2026. Cada página de módulo
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

Cada módulo incluye:

- Teoría organizada por los *task statements* oficiales del exam guide, con su numeración
- El temario oficial del dominio impreso al final, para ir tachando contra la guía
- Diagramas SVG interactivos, navegables también con teclado
- Ejemplos de AWS CLI y de políticas JSON listos para leer y adaptar
- Comparativas con Azure donde el mapeo es fiable, o ejemplos en lenguaje llano donde forzarlo induciría a error
- Una sección con las trampas más frecuentes del examen
- Enlaces a la documentación oficial de AWS en la que se apoya
- Un quiz con explicación razonada en cada respuesta

## Cómo estudiar

### Quiz por dominio

286 preguntas, 26 de ellas de **respuesta múltiple** (`choose TWO`), puntuadas todo-o-nada igual que en el examen real.

| Función | Para qué sirve |
|---|---|
| Solo falladas | Repasar únicamente lo que aún no dominas |
| Filtro por tema | Centrarte en un servicio o concepto concreto |
| Barajar | Evitar memorizar la respuesta por su posición |
| Marcar con ★ | Apartar preguntas para volver a ellas |
| Reiniciar | Empezar de cero, por módulo o en toda la guía |

### Simulacro de examen

65 preguntas en 170 minutos, con la mezcla oficial por dominio y sin corrección hasta entregar. Al terminar muestra la nota, el desglose por dominio y la explicación de cada pregunta.

Entrena lo que un quiz por temas no entrena: **repartir el tiempo y decidir sin saber si vas acertando**.

### Seguimiento

La página principal muestra cuánto llevas respondido, tu porcentaje de acierto y el resultado del último simulacro.

### En el móvil

Pensada para estudiar en ratos muertos: índice desplegable en cada módulo, diagramas que se desplazan sin perder legibilidad y tema claro u oscuro según el del sistema.

## Contribuir

Las correcciones y aportaciones son bienvenidas. Consulta **[CONTRIBUTING.md](CONTRIBUTING.md)** para el proceso y los criterios de redacción.

Si detectas un error de contenido, [abre un issue](https://github.com/ShadowVMX/aws-security-specialist-guide/issues/new/choose) indicando el módulo y, a ser posible, la página de la documentación de AWS que lo respalda.

<br>

---

<p align="center">
<sub>
Guía de estudio independiente. No está afiliada, patrocinada ni respaldada por Amazon Web Services.<br>
AWS y AWS Certified Security — Specialty son marcas de Amazon.com, Inc. o de sus filiales.<br>
Contenido revisado en agosto de 2026.
</sub>
</p>
