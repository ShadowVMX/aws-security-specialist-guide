#!/usr/bin/env node
/**
 * The SC-100 content outline, transcribed from the official study guide
 * (Exam SC-100: Microsoft Cybersecurity Architect, skills measured as of
 * 28 July 2026, learn.microsoft.com).
 *
 * Same contract as the other guides in this folder: this file is data, and
 * everything that claims to follow the exam reads from here.
 *
 * Two things differ from the AWS guide and are deliberate:
 *
 *  - Microsoft publishes weights as a RANGE (20-25%), not a single number.
 *    `weight` keeps the midpoint for arithmetic and `weightLabel` keeps what
 *    Microsoft actually prints, which is what the pages show.
 *  - Every task statement starts with "Design", "Evaluate" or "Specify".
 *    This is an architect exam: it asks which design fits a requirement, not
 *    which blade configures a setting. The questions must read that way too.
 */
"use strict";

const DOMAINS = [
  {
    id: "1",
    module: "best-practices",
    name: "Design solutions that align with security best practices and priorities",
    nameEs: "Diseño alineado con buenas prácticas y prioridades",
    weight: 22.5,
    weightLabel: "20-25%",
    tasks: [
      {
        id: "1.1",
        title:
          "Design a resiliency strategy for ransomware and other attacks based on Microsoft Security Best Practices",
        titleEs:
          "Diseñar una estrategia de resiliencia frente a ransomware y otros ataques",
        skills: [
          {
            id: "1.1.1",
            match: /resiliencia|resilienc|activos? crític|business-critical|priorizar amenaza/i,
            text: "Design a security strategy to support business resiliency goals, including identifying and prioritizing threats to business-critical assets",
            textEs: "Diseñar una estrategia de seguridad que sostenga los objetivos de resiliencia del negocio, identificando y priorizando amenazas a los activos críticos",
          },
          {
            id: "1.1.2",
            match: /\bbcdr\b|continuidad de negocio|business continuity|disaster recovery|copia de seguridad|backup/i,
            text: "Design solutions for business continuity and disaster recovery (BCDR), including secure backup and restore for hybrid and multicloud environments",
            textEs: "Diseñar continuidad de negocio y recuperación ante desastres (BCDR), con copia y restauración seguras en entornos híbridos y multinube",
          },
          {
            id: "1.1.3",
            match: /ransomware/i,
            text: "Design solutions for mitigating ransomware attacks, including prioritization of BCDR and privileged access",
            textEs: "Diseñar la mitigación de ransomware, priorizando BCDR y el acceso privilegiado",
          },
          {
            id: "1.1.4",
            match: /actualizaciones de seguridad|security update|parche|patch/i,
            text: "Evaluate solutions for security updates",
            textEs: "Evaluar soluciones de actualizaciones de seguridad",
          },
        ],
      },
      {
        id: "1.2",
        title:
          "Design solutions that align with the Microsoft Cybersecurity Reference Architectures (MCRA) and Microsoft Cloud Security Benchmark (MCSB)",
        titleEs:
          "Diseñar alineado con las arquitecturas de referencia (MCRA) y el benchmark de seguridad en la nube (MCSB)",
        skills: [
          {
            id: "1.2.1",
            match: /\bmcra\b|reference architect|arquitectura de referencia|capacidades y controles/i,
            text: "Design solutions that align with best practices for cybersecurity capabilities and controls",
            textEs: "Diseñar soluciones alineadas con las buenas prácticas de capacidades y controles de ciberseguridad",
          },
          {
            id: "1.2.2",
            match: /insider|amenaza interna|cadena de suministro|supply chain/i,
            text: "Design solutions that align with best practices for protecting against insider, external, and supply chain attacks",
            textEs: "Diseñar protección frente a amenaza interna, externa y de cadena de suministro",
          },
          {
            id: "1.2.3",
            match: /\bmcsb\b|cloud security benchmark/i,
            text: "Design AI solutions that align to the Microsoft Cloud Security Benchmark",
            textEs: "Diseñar soluciones de IA alineadas con el Microsoft Cloud Security Benchmark",
          },
          {
            id: "1.2.4",
            match: /zero trust|confianza cero/i,
            text: "Design solutions that align with the Zero Trust adoption framework",
            textEs: "Diseñar soluciones alineadas con el marco de adopción de Zero Trust",
          },
        ],
      },
      {
        id: "1.3",
        title:
          "Design solutions that align with the Microsoft Cloud Adoption Framework for Azure (CAF) and the Azure Well-Architected Framework",
        titleEs:
          "Diseñar alineado con el Cloud Adoption Framework (CAF) y el Well-Architected Framework",
        skills: [
          {
            id: "1.3.1",
            match: /adopción segura de ia|secure ai adoption|estrategia de ia/i,
            text: "Design a strategy for secure AI adoption",
            textEs: "Diseñar una estrategia de adopción segura de IA",
          },
          {
            id: "1.3.2",
            match: /\bcaf\b|cloud adoption framework|well-architected/i,
            text: "Design a new or evaluate an existing strategy for security and governance based on CAF and the Azure Well-Architected Framework",
            textEs: "Diseñar o evaluar una estrategia de seguridad y gobierno basada en CAF y en el Well-Architected Framework",
          },
          {
            id: "1.3.3",
            match: /\bcaf\b|cloud adoption framework|well-architected|gobierno y seguridad/i,
            text: "Recommend solutions for security and governance based on CAF and the Azure Well-Architected Framework",
            textEs: "Recomendar soluciones de seguridad y gobierno basadas en CAF y Well-Architected",
          },
          {
            id: "1.3.4",
            match: /landing zone/i,
            text: "Design solutions for implementing and governing security by using Azure landing zones",
            textEs: "Diseñar la implantación y el gobierno de la seguridad con Azure landing zones",
          },
          {
            id: "1.3.5",
            match: /devsecops|pipeline|ciclo de desarrollo/i,
            text: "Design a DevSecOps process that aligns with best practices in CAF",
            textEs: "Diseñar un proceso DevSecOps alineado con las buenas prácticas del CAF",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    module: "operations-identity",
    name: "Design security operations, identity, and compliance capabilities",
    nameEs: "Operaciones de seguridad, identidad y cumplimiento",
    weight: 27.5,
    weightLabel: "25-30%",
    tasks: [
      {
        id: "2.1",
        title:
          "Design solutions for security operations",
        titleEs:
          "Diseñar las capacidades de operaciones de seguridad",
        skills: [
          {
            id: "2.1.1",
            match: /\bxdr\b|\bsiem\b|sentinel|defender xdr/i,
            text: "Design a solution for detection and response that includes extended detection and response (XDR) and security information and event management (SIEM)",
            textEs: "Diseñar detección y respuesta con XDR y SIEM",
          },
          {
            id: "2.1.2",
            match: /purview audit|log analytics|workspace|retenci|auditoría centraliz|centralized logging|nivel de tabla/i,
            text: "Design a solution for centralized logging and auditing, including Microsoft Purview Audit",
            textEs: "Diseñar registro y auditoría centralizados, incluido Microsoft Purview Audit",
          },
          {
            id: "2.1.3",
            match: /azure arc|multinube|multicloud|híbrid|hybrid/i,
            text: "Design monitoring to support hybrid and multicloud environments",
            textEs: "Diseñar la monitorización de entornos híbridos y multinube",
          },
          {
            id: "2.1.4",
            match: /\bsoar\b|playbook|regla de automatización|automation rule|logic app/i,
            text: "Design a solution for security orchestration and automated response (SOAR), including Microsoft Sentinel and Microsoft Defender XDR",
            textEs: "Diseñar orquestación y respuesta automatizada (SOAR) con Microsoft Sentinel y Defender XDR",
          },
          {
            id: "2.1.5",
            match: /caza de amenazas|threat hunting|respuesta a incidentes|incident response|plan de respuesta/i,
            text: "Design and evaluate security workflows, including incident response, threat hunting, and incident management",
            textEs: "Diseñar y evaluar flujos de trabajo de seguridad: respuesta a incidentes, caza de amenazas y gestión del incidente",
          },
          {
            id: "2.1.6",
            match: /mitre|att&ck|cobertura de detección|detection coverage/i,
            text: "Design and evaluate threat detection coverage by using MITRE ATT&CK matrices, including Enterprise, Mobile, and industrial control systems (ICS)",
            textEs: "Diseñar y evaluar la cobertura de detección con las matrices MITRE ATT&CK: Enterprise, Mobile e ICS",
          },
        ],
      },
      {
        id: "2.2",
        title:
          "Design solutions for identity and access management",
        titleEs:
          "Diseñar la gestión de identidades y accesos",
        skills: [
          {
            id: "2.2.1",
            match: /agent id|identidad de agente|agente de ia|ai agent/i,
            text: "Design a solution for agent identities using Microsoft Entra Agent ID and conditional access policies",
            textEs: "Diseñar identidades de agente con Microsoft Entra Agent ID y políticas de acceso condicional",
          },
          {
            id: "2.2.2",
            match: /\bsaas\b|\bpaas\b|\biaas\b|defender for cloud apps|private access|política de sesión/i,
            text: "Design a solution for access to SaaS, PaaS, IaaS, hybrid/on-premises, and multicloud resources, including identity, networking, and application controls",
            textEs: "Diseñar el acceso a recursos SaaS, PaaS, IaaS, híbridos y multinube, con controles de identidad, red y aplicación",
          },
          {
            id: "2.2.3",
            match: /hash de contraseñas|password hash|pass-through|\bpta\b|federaci|ad fs|entra connect/i,
            text: "Design a solution for Microsoft Entra ID, including hybrid and multi-cloud environments",
            textEs: "Diseñar la solución de Microsoft Entra ID, incluidos entornos híbridos y multinube",
          },
          {
            id: "2.2.4",
            match: /\bb2b\b|identidades externas|external identit|verified id|cross-tenant|descentraliz/i,
            text: "Design a solution for external identities, including business-to-business (B2B) and decentralized identity",
            textEs: "Diseñar identidades externas: B2B e identidad descentralizada",
          },
          {
            id: "2.2.5",
            match: /acceso condicional|conditional access|continuous access|\bcae\b|riesgo de|protected action|fuerza de autenticación|authentication strength/i,
            text: "Design a modern authentication and authorization strategy, including Conditional Access, continuous access evaluation, risk scoring, and protected actions",
            textEs: "Diseñar autenticación y autorización modernas: acceso condicional, evaluación continua de acceso, puntuación de riesgo y acciones protegidas",
          },
          {
            id: "2.2.6",
            match: /zero trust|confianza cero|cuenta de emergencia|emergency access/i,
            text: "Validate the alignment of Conditional Access policies with a Zero Trust strategy",
            textEs: "Validar que las políticas de acceso condicional encajan con la estrategia Zero Trust",
          },
          {
            id: "2.2.7",
            match: /\bad ds\b|active directory|\blaps\b|administrador local|local administrator/i,
            text: "Specify requirements to harden Active Directory Domain Services (AD DS)",
            textEs: "Especificar los requisitos para endurecer Active Directory Domain Services",
          },
          {
            id: "2.2.8",
            match: /key vault|managed hsm|identidad administrada|managed identit|secreto|certificad/i,
            text: "Design a solution to manage secrets, keys, and certificates",
            textEs: "Diseñar la gestión de secretos, claves y certificados",
          },
        ],
      },
      {
        id: "2.3",
        title:
          "Design solutions for securing privileged access",
        titleEs:
          "Diseñar la protección del acceso privilegiado",
        skills: [
          {
            id: "2.3.1",
            match: /enterprise access model|separación de planos|plano de control|tier|nivel 0/i,
            text: "Design a solution for assigning and delegating privileged roles by using the enterprise access model",
            textEs: "Diseñar la asignación y delegación de roles privilegiados con el enterprise access model",
          },
          {
            id: "2.3.2",
            match: /\bpim\b|privileged identity|entitlement management|paquete de acceso|access package/i,
            text: "Evaluate the security and governance of Microsoft Entra ID, including Privileged Identity Management (PIM), entitlement management, and access reviews",
            textEs: "Evaluar la seguridad y el gobierno de Entra ID: PIM, entitlement management y revisiones de acceso",
          },
          {
            id: "2.3.3",
            match: /dcsync|golden ticket|kerberoast|pass-the-hash|defender for identity|\bgmsa\b/i,
            text: "Evaluate the security and governance of Active Directory Domain Services (AD DS), including resilience to common attacks",
            textEs: "Evaluar la seguridad y el gobierno de AD DS, incluida su resistencia a los ataques habituales",
          },
          {
            id: "2.3.4",
            match: /tenant|cuenta de emergencia|emergency access|break.?glass/i,
            text: "Design a solution for securing the administration of cloud tenants, including SaaS and multicloud infrastructure and platforms",
            textEs: "Diseñar la administración segura de tenants en la nube, incluidas plataformas SaaS y multinube",
          },
          {
            id: "2.3.5",
            match: /permissions management|\bciem\b|permisos sin usar|unused permission|exceso de permiso/i,
            text: "Design a solution for cloud infrastructure entitlement management",
            textEs: "Diseñar la gestión de permisos de infraestructura en la nube (CIEM)",
          },
          {
            id: "2.3.6",
            match: /access review|revisi(ón|ones) de acceso|recertific/i,
            text: "Evaluate an access review management solution",
            textEs: "Evaluar una solución de gestión de revisiones de acceso",
          },
          {
            id: "2.3.7",
            match: /\bpaw\b|estaci(ón|ones) .{0,20}privilegiad|privileged access workstation|bastion/i,
            text: "Design a solution for secure workstations for privileged access, including remote access",
            textEs: "Diseñar estaciones de trabajo seguras para acceso privilegiado, incluido el acceso remoto",
          },
        ],
      },
      {
        id: "2.4",
        title:
          "Design solutions for regulatory compliance",
        titleEs:
          "Diseñar el cumplimiento normativo",
        skills: [
          {
            id: "2.4.1",
            match: /requisito.{0,20}normativ|compliance requirement|requisito.{0,15}control|traducir.{0,20}control|demostrar\w*.{0,25}auditor|requirement into.{0,20}control/i,
            text: "Translate compliance requirements into security controls",
            textEs: "Traducir requisitos de cumplimiento en controles de seguridad",
          },
          {
            id: "2.4.2",
            match: /purview|etiquetas de confidencialidad|sensitivity label|prevención de pérdida|\bdlp\b|retención/i,
            text: "Design a solution to address compliance requirements by using Microsoft Purview",
            textEs: "Diseñar la cobertura de requisitos de cumplimiento con Microsoft Purview",
          },
          {
            id: "2.4.3",
            match: /azure policy|iniciativa|deny|deployifnotexists|audit\b/i,
            text: "Design Azure Policy solutions to address security and compliance requirements",
            textEs: "Diseñar soluciones con Azure Policy para requisitos de seguridad y cumplimiento",
          },
          {
            id: "2.4.4",
            match: /cumplimiento normativo|regulatory compliance|secure score|iso 27001|\bpci\b|\bnist\b|\bcis\b/i,
            text: "Evaluate and validate alignment with regulatory standards and benchmarks by using Microsoft Defender for Cloud",
            textEs: "Evaluar y validar el alineamiento con estándares y benchmarks con Microsoft Defender for Cloud",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    module: "infrastructure",
    name: "Design security solutions for infrastructure",
    nameEs: "Soluciones de seguridad para infraestructura",
    weight: 27.5,
    weightLabel: "25-30%",
    tasks: [
      {
        id: "3.1",
        title:
          "Design solutions for security posture management in hybrid and multicloud environments",
        titleEs:
          "Diseñar la gestión de la postura de seguridad en entornos híbridos y multinube",
        skills: [
          {
            id: "3.1.1",
            match: /defender for cloud|\bmcsb\b|postura/i,
            text: "Evaluate security posture by using Microsoft Defender for Cloud, including the Microsoft Cloud Security Benchmark (MCSB)",
            textEs: "Evaluar la postura de seguridad con Defender for Cloud y el MCSB",
          },
          {
            id: "3.1.2",
            match: /secure score/i,
            text: "Evaluate security posture by using Microsoft Secure Score",
            textEs: "Evaluar la postura de seguridad con Microsoft Secure Score",
          },
          {
            id: "3.1.3",
            match: /postura.{0,25}(híbrid|multinube|multicloud)|defender for cloud.{0,30}multi/i,
            text: "Design integrated security posture management solutions that include Microsoft Defender for Cloud in hybrid and multi-cloud environments",
            textEs: "Diseñar una gestión de postura integrada con Defender for Cloud en entornos híbridos y multinube",
          },
          {
            id: "3.1.4",
            match: /workload protection|plan(es)? de protección|cloud workload/i,
            text: "Select cloud workload protection solutions in Microsoft Defender for Cloud",
            textEs: "Elegir los planes de protección de cargas de trabajo de Defender for Cloud",
          },
          {
            id: "3.1.5",
            match: /azure arc/i,
            text: "Design a solution for integrating hybrid and multicloud environments by using Azure Arc",
            textEs: "Diseñar la integración de entornos híbridos y multinube con Azure Arc",
          },
          {
            id: "3.1.6",
            match: /\beasm\b|superficie de ataque externa|external attack surface/i,
            text: "Design a solution for Microsoft Defender External Attack Surface Management (Defender EASM)",
            textEs: "Diseñar la gestión de superficie de ataque externa con Defender EASM",
          },
          {
            id: "3.1.7",
            match: /exposure management|ruta de ataque|attack path|reducción de superficie/i,
            text: "Specify requirements and priorities for a posture management process that uses Microsoft Security Exposure Management attack paths, attack surface reduction, security insights, and initiatives",
            textEs: "Especificar requisitos y prioridades de un proceso de gestión de postura con Security Exposure Management: rutas de ataque, reducción de superficie, insights e iniciativas",
          },
        ],
      },
      {
        id: "3.2",
        title:
          "Specify requirements for securing server and client endpoints",
        titleEs:
          "Especificar los requisitos para proteger servidores y equipos cliente",
        skills: [
          {
            id: "3.2.1",
            match: /servidor|server/i,
            text: "Specify security requirements for servers, including multiple platforms and operating systems",
            textEs: "Especificar requisitos de seguridad para servidores en varias plataformas y sistemas operativos",
          },
          {
            id: "3.2.2",
            match: /dispositivo móvil|mobile device|intune|endpoint/i,
            text: "Specify security requirements for mobile devices and clients, including endpoint protection, hardening, and configuration",
            textEs: "Especificar requisitos para móviles y clientes: protección de endpoint, endurecimiento y configuración",
          },
          {
            id: "3.2.3",
            match: /\biot\b|embebid|embedded/i,
            text: "Specify security requirements for IoT devices and embedded systems",
            textEs: "Especificar requisitos de seguridad para dispositivos IoT y sistemas embebidos",
          },
          {
            id: "3.2.4",
            match: /\bot\b|\bics\b|defender for iot|control industrial/i,
            text: "Evaluate solutions for securing operational technology (OT) and industrial control systems (ICS) by using Microsoft Defender for IoT",
            textEs: "Evaluar la protección de tecnología operacional (OT) y sistemas de control industrial (ICS) con Defender for IoT",
          },
          {
            id: "3.2.5",
            match: /línea base|baseline/i,
            text: "Specify security baselines for server and client endpoints",
            textEs: "Especificar líneas base de seguridad para servidores y clientes",
          },
          {
            id: "3.2.6",
            match: /\blaps\b/i,
            text: "Evaluate Windows Local Administrator Password Solution (Windows LAPS) solution",
            textEs: "Evaluar Windows LAPS como solución de contraseñas de administrador local",
          },
        ],
      },
      {
        id: "3.3",
        title:
          "Specify requirements for securing SaaS, PaaS, and IaaS services",
        titleEs:
          "Especificar los requisitos para proteger servicios SaaS, PaaS e IaaS",
        skills: [
          {
            id: "3.3.1",
            match: /línea base|baseline|\bsaas\b|\bpaas\b|\biaas\b/i,
            text: "Specify security baselines for SaaS, PaaS, and IaaS services",
            textEs: "Especificar líneas base de seguridad para servicios SaaS, PaaS e IaaS",
          },
          {
            id: "3.3.2",
            match: /\biot\b/i,
            text: "Specify security requirements for IoT workloads",
            textEs: "Especificar requisitos de seguridad para cargas de trabajo IoT",
          },
          {
            id: "3.3.3",
            match: /carga web|web workload|\bwaf\b|app service/i,
            text: "Specify security requirements for web workloads",
            textEs: "Especificar requisitos de seguridad para cargas web",
          },
          {
            id: "3.3.4",
            match: /contenedor|container/i,
            text: "Specify security requirements for containers",
            textEs: "Especificar requisitos de seguridad para contenedores",
          },
          {
            id: "3.3.5",
            match: /kubernetes|\baks\b|orquestaci/i,
            text: "Specify security requirements for container orchestration",
            textEs: "Especificar requisitos de seguridad para la orquestación de contenedores",
          },
          {
            id: "3.3.6",
            match: /azure ai|servicios de ia|ai service/i,
            text: "Evaluate solutions that include Azure AI services security",
            textEs: "Evaluar soluciones que incluyan la seguridad de los servicios de IA de Azure",
          },
        ],
      },
      {
        id: "3.4",
        title:
          "Evaluate solutions for network security and Security Service Edge (SSE)",
        titleEs:
          "Evaluar soluciones de seguridad de red y Security Service Edge (SSE)",
        skills: [
          {
            id: "3.4.1",
            match: /diseño de red|network design|segmentaci/i,
            text: "Evaluate network designs to align with security requirements and best practices",
            textEs: "Evaluar diseños de red frente a los requisitos de seguridad y las buenas prácticas",
          },
          {
            id: "3.4.2",
            match: /internet access|secure web gateway|\bswg\b/i,
            text: "Evaluate solutions that use Microsoft Entra Internet Access as a secure web gateway",
            textEs: "Evaluar soluciones que usan Entra Internet Access como pasarela web segura",
          },
          {
            id: "3.4.3",
            match: /internet access|cross-tenant|servicios de microsoft/i,
            text: "Evaluate solutions that use Microsoft Entra Internet Access for Microsoft Services, including cross-tenant configurations",
            textEs: "Evaluar Entra Internet Access para servicios de Microsoft, incluidas configuraciones entre tenants",
          },
          {
            id: "3.4.4",
            match: /private access/i,
            text: "Evaluate solutions that use Microsoft Entra Private Access",
            textEs: "Evaluar soluciones que usan Microsoft Entra Private Access",
          },
        ],
      },
    ],
  },
  {
    id: "4",
    module: "apps-data",
    name: "Design security solutions for applications and data",
    nameEs: "Soluciones de seguridad para aplicaciones y datos",
    weight: 22.5,
    weightLabel: "20-25%",
    tasks: [
      {
        id: "4.1",
        title:
          "Evaluate solutions for securing Microsoft 365",
        titleEs:
          "Evaluar soluciones para proteger Microsoft 365",
        skills: [
          {
            id: "4.1.1",
            match: /secure score|productividad|collaboration|colaboraci/i,
            text: "Evaluate security posture for productivity and collaboration workloads by using metrics, including Microsoft Secure Score",
            textEs: "Evaluar la postura de las cargas de productividad y colaboración con métricas, incluido Secure Score",
          },
          {
            id: "4.1.2",
            match: /defender for office|defender for cloud apps/i,
            text: "Evaluate solutions that include Microsoft Defender for Office 365 and Microsoft Defender for Cloud Apps",
            textEs: "Evaluar soluciones con Defender for Office 365 y Defender for Cloud Apps",
          },
          {
            id: "4.1.3",
            match: /intune|gestión de dispositivos|device management/i,
            text: "Evaluate device management solutions that include Microsoft Intune",
            textEs: "Evaluar la gestión de dispositivos con Microsoft Intune",
          },
          {
            id: "4.1.4",
            match: /purview|microsoft 365/i,
            text: "Evaluate solutions for securing data in Microsoft 365 by using Microsoft Purview",
            textEs: "Evaluar la protección del dato en Microsoft 365 con Microsoft Purview",
          },
          {
            id: "4.1.5",
            match: /copilot/i,
            text: "Evaluate data security and compliance controls in Microsoft Copilot for Microsoft 365 services",
            textEs: "Evaluar los controles de seguridad y cumplimiento del dato en Microsoft Copilot para Microsoft 365",
          },
        ],
      },
      {
        id: "4.2",
        title:
          "Design solutions for securing applications",
        titleEs:
          "Diseñar la protección de las aplicaciones",
        skills: [
          {
            id: "4.2.1",
            match: /portafolio|portfolio|postura.{0,20}aplicaci/i,
            text: "Evaluate the security posture of existing application portfolios",
            textEs: "Evaluar la postura de seguridad de un portafolio de aplicaciones existente",
          },
          {
            id: "4.2.2",
            match: /modelado de amenazas|threat model/i,
            text: "Evaluate threats to business-critical applications by using threat modeling",
            textEs: "Evaluar amenazas a aplicaciones críticas mediante modelado de amenazas",
          },
          {
            id: "4.2.3",
            match: /ciclo de vida|lifecycle/i,
            text: "Design and implement a full lifecycle strategy for application security",
            textEs: "Diseñar una estrategia de seguridad de aplicaciones para todo el ciclo de vida",
          },
          {
            id: "4.2.4",
            match: /proceso de desarrollo|development process|\bsdl\b|devsecops/i,
            text: "Design and implement standards and practices for securing the application development process",
            textEs: "Diseñar estándares y prácticas que aseguren el proceso de desarrollo",
          },
          {
            id: "4.2.5",
            match: /requisitos de seguridad de la aplicaci|application security requirement/i,
            text: "Map technologies to application security requirements",
            textEs: "Asociar tecnologías concretas a los requisitos de seguridad de la aplicación",
          },
          {
            id: "4.2.6",
            match: /identidad(es)? de carga de trabajo|workload identit|identidad administrada|managed identit/i,
            text: "Design a solution for workload identities to authenticate and access Azure resources",
            textEs: "Diseñar identidades de carga de trabajo para autenticarse y acceder a recursos de Azure",
          },
          {
            id: "4.2.7",
            match: /api management|\bapi\b/i,
            text: "Design a solution for API management and security",
            textEs: "Diseñar la gestión y la seguridad de las APIs",
          },
          {
            id: "4.2.8",
            match: /\bwaf\b|web application firewall/i,
            text: "Design solutions that secure applications by using Azure Web Application Firewall (WAF)",
            textEs: "Diseñar la protección de aplicaciones con Azure Web Application Firewall",
          },
        ],
      },
      {
        id: "4.3",
        title:
          "Design solutions for securing an organization's data",
        titleEs:
          "Diseñar la protección del dato de la organización",
        skills: [
          {
            id: "4.3.1",
            match: /descubrimiento|discovery|clasificaci|classification/i,
            text: "Evaluate solutions for data discovery and classification",
            textEs: "Evaluar soluciones de descubrimiento y clasificación del dato",
          },
          {
            id: "4.3.2",
            match: /priorizar|priorit|amenazas? (sobre el|al) dato/i,
            text: "Specify priorities for mitigating threats to data",
            textEs: "Priorizar la mitigación de amenazas sobre el dato",
          },
          {
            id: "4.3.3",
            match: /key vault|cifrado|encryption/i,
            text: "Evaluate solutions for encryption of data at rest and in transit, including Azure Key Vault and infrastructure encryption",
            textEs: "Evaluar el cifrado del dato en reposo y en tránsito, incluidos Azure Key Vault y el cifrado de infraestructura",
          },
          {
            id: "4.3.4",
            match: /cargas de ia|ai workload|dato.{0,20}\bia\b/i,
            text: "Design security for data used in AI workloads",
            textEs: "Diseñar la seguridad del dato que consumen las cargas de IA",
          },
          {
            id: "4.3.5",
            match: /azure sql|synapse|cosmos/i,
            text: "Design a security solution for data in Azure workloads, including Azure SQL, Azure Synapse Analytics, and Azure Cosmos DB",
            textEs: "Diseñar la seguridad del dato en cargas de Azure: Azure SQL, Synapse y Cosmos DB",
          },
          {
            id: "4.3.6",
            match: /azure storage|almacenamiento/i,
            text: "Design a security solution for data in Azure Storage",
            textEs: "Diseñar la seguridad del dato en Azure Storage",
          },
          {
            id: "4.3.7",
            match: /defender for storage|defender for database/i,
            text: "Design a security solution that includes Microsoft Defender for Storage and Microsoft Defender for Databases",
            textEs: "Diseñar una solución que incluya Defender for Storage y Defender for Databases",
          },
        ],
      },
    ],
  },
];

// Microsoft does not publish an in-scope/out-of-scope service list for SC-100
// the way AWS does for SCS-C03, so there is nothing to check against here.
const IN_SCOPE_SERVICES = [];
const OUT_OF_SCOPE = [];

// Content the July 2026 revision added or reworked. An architect who studied
// with material from before that date has not seen these.
const NEW_IN_2026 = ["1.2.3", "1.3.1", "2.2.1", "3.3.6", "4.1.5", "4.3.4"];

const GUIDE_EDITION = {
  es: "SC-100 (guía oficial, skills medidos a 28 jul. 2026)",
  en: "SC-100 (official skills outline, skills measured as of 28 Jul 2026)",
};

function allSkills() {
  const out = [];
  DOMAINS.forEach((d) =>
    d.tasks.forEach((t) =>
      t.skills.forEach((s) => out.push({ ...s, domain: d, task: t }))
    )
  );
  return out;
}

module.exports = {
  DOMAINS,
  IN_SCOPE_SERVICES,
  OUT_OF_SCOPE,
  NEW_IN_C03: NEW_IN_2026,
  GUIDE_EDITION,
  allSkills,
};
