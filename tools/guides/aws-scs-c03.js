#!/usr/bin/env node
/**
 * The SCS-C03 content outline, transcribed from the official exam guide
 * (AWS Certified Security - Specialty, Exam Guide SCS-C03, 2026 edition).
 *
 * This file is data, not opinion. Everything else in the repo that claims to
 * follow the exam — the domain weights, the simulator blueprint, the coverage
 * report — reads from here, so there is exactly one place to update when AWS
 * publishes a new guide.
 *
 * `match` is a regular expression used to find questions that plausibly cover
 * a skill. It finds gaps; it does not prove a question teaches the skill well.
 */
"use strict";

// Weights are the percentage of scored content AWS assigns to each domain.
const DOMAINS = [
  {
    id: "1",
    module: "detection",
    name: "Detection",
    nameEs: "Detección",
    weight: 16,
    tasks: [
      {
        id: "1.1",
        title: "Design and implement monitoring and alerting solutions for an AWS account or organization",
        titleEs:
          "Diseñar e implementar la monitorización y las alertas de una cuenta u organización",
        skills: [
          { id: "1.1.1", text: "Analyze workloads to determine monitoring requirements", textEs: "Analizar las cargas de trabajo para determinar qué hay que monitorizar", match: /requisitos de monitoriz|monitoring requirements|qué monitorizar|what to monitor/i },
          { id: "1.1.2", text: "Design and implement workload monitoring strategies (resource health checks)", textEs: "Diseñar e implementar estrategias de monitorización (por ejemplo, health checks de recursos)", match: /health check|estado del recurso|resource health|cloudwatch alarm|alarma de cloudwatch/i },
          { id: "1.1.3", text: "Aggregate security and monitoring events", textEs: "Agregar eventos de seguridad y de monitorización", match: /agrega|aggregat|centraliz|cross-region aggregation|eventbridge bus/i },
          { id: "1.1.4", text: "Create metrics, alerts, and dashboards (GuardDuty, Security Lake, Security Hub, Macie)", textEs: "Crear métricas, alertas y paneles que detecten datos y eventos anómalos (GuardDuty, Security Lake, Security Hub, Macie)", match: /guardduty|security hub|security lake|macie|dashboard|métrica|metric filter/i },
          { id: "1.1.5", text: "Automations for regular assessments (Config conformance packs, Security Hub, Systems Manager State Manager)", textEs: "Crear y mantener automatizaciones de evaluación e investigación periódicas (conformance packs de Config, Security Hub, State Manager)", match: /conformance pack|state manager|evaluación periódica|regular assessment/i },
        ],
      },
      {
        id: "1.2",
        title: "Design and implement logging solutions",
        titleEs:
          "Diseñar e implementar soluciones de logging",
        skills: [
          { id: "1.2.1", text: "Identify sources for log ingestion and storage based on requirements", textEs: "Identificar las fuentes de log a ingerir y almacenar según los requisitos", match: /fuente de log|log source|qué logs|which logs|ingesta de log|log ingestion/i },
          { id: "1.2.2", text: "Configure logging for AWS services and applications (organization trail, dedicated logging account, CloudWatch Logs agent)", textEs: "Configurar el logging de servicios y aplicaciones (trail de organización, cuenta dedicada de logs, agente de CloudWatch Logs)", match: /organization trail|trail de organiz|cuenta de logging|logging account|cloudwatch agent|agente de cloudwatch|log archive/i },
          { id: "1.2.3", text: "Implement log storage and log data lakes (Security Lake) and integrate with third-party tools", textEs: "Implementar almacenamiento y lagos de datos de logs (Security Lake) e integrarlos con herramientas de terceros", match: /security lake|data lake|lago de datos/i },
          { id: "1.2.4", text: "Use AWS services to analyze logs (CloudWatch Logs Insights, Athena, Security Hub findings)", textEs: "Analizar logs con servicios de AWS (CloudWatch Logs Insights, Athena, findings de Security Hub)", match: /logs insights|athena|analizar log|analyze log/i },
          { id: "1.2.5", text: "Normalize, parse, and correlate logs (OpenSearch Service, Lambda, Managed Grafana)", textEs: "Normalizar, parsear y correlacionar logs (OpenSearch Service, Lambda, Managed Grafana)", match: /opensearch|grafana|normaliz|correlacion|correlat/i },
          { id: "1.2.6", text: "Determine log sources based on network design (VPC Flow Logs, transit gateway flow logs, Route 53 Resolver logs)", textEs: "Elegir las fuentes de log según el diseño de red y las amenazas (VPC Flow Logs, transit gateway flow logs, logs de Route 53 Resolver)", match: /flow logs|resolver (query )?log|dns query log|log de consultas dns/i },
        ],
      },
      {
        id: "1.3",
        title: "Troubleshoot security monitoring, logging, and alerting solutions",
        titleEs:
          "Diagnosticar problemas de monitorización, logging y alertas de seguridad",
        skills: [
          { id: "1.3.1", text: "Analyze functionality, permissions and configuration of resources (Lambda logging, API Gateway logging, health checks, CloudFront logging)", textEs: "Analizar funcionalidad, permisos y configuración de los recursos (logging de Lambda, de API Gateway, health checks, logs de CloudFront)", match: /api gateway|cloudfront (standard |access )?log|lambda.*log|log.*lambda/i },
          { id: "1.3.2", text: "Remediate misconfiguration of resources (CloudWatch Agent, missing logs)", textEs: "Corregir configuraciones erróneas (agente de CloudWatch, logs que no llegan)", match: /no aparecen|faltan log|missing log|no llega|cloudwatch agent|troubleshoot/i },
        ],
      },
    ],
  },
  {
    id: "2",
    module: "incident-response",
    name: "Incident Response",
    nameEs: "Respuesta a incidentes",
    weight: 14,
    tasks: [
      {
        id: "2.1",
        title: "Design and test an incident response plan",
        titleEs:
          "Diseñar y probar un plan de respuesta a incidentes",
        skills: [
          { id: "2.1.1", text: "Design response plans and runbooks (Systems Manager OpsCenter, SageMaker AI notebooks)", textEs: "Diseñar planes de respuesta y runbooks (Systems Manager OpsCenter, notebooks de SageMaker AI)", match: /runbook|opscenter|playbook|plan de respuesta|response plan/i },
          { id: "2.1.2", text: "Configure services to be prepared for incidents (provisioning access, deploying tools, minimizing blast radius, Shield Advanced)", textEs: "Preparar los servicios para el incidente (provisionar acceso, desplegar herramientas, reducir el blast radius, Shield Advanced)", match: /blast radius|pre-?provision|pre-?aprovision|shield advanced|preparar|prepare/i },
          { id: "2.1.3", text: "Test and validate the effectiveness of an incident response plan (Fault Injection Service, Resilience Hub)", textEs: "Recomendar procedimientos para probar y validar el plan de respuesta (Fault Injection Service, Resilience Hub)", match: /fault injection|\bfis\b|resilience hub|tabletop|simulacro|game day/i },
          { id: "2.1.4", text: "Automatically remediate incidents (Systems Manager, Automated Forensics Orchestrator, Step Functions, Application Recovery Controller, Lambda)", textEs: "Remediar incidentes automáticamente (Systems Manager, Automated Forensics Orchestrator, Step Functions, Application Recovery Controller, Lambda)", match: /step functions|forensics orchestrator|application recovery controller|remediación automática|automatic(ally)? remediat/i },
        ],
      },
      {
        id: "2.2",
        title: "Respond to security events",
        titleEs:
          "Responder a eventos de seguridad",
        skills: [
          { id: "2.2.1", text: "Capture and store relevant system and application logs as forensic artifacts", textEs: "Capturar y almacenar logs de sistema y de aplicación como artefactos forenses", match: /artefacto forense|forensic artifact|cadena de custodia|chain of custody|snapshot.*ebs|memoria ram|memory dump/i },
          { id: "2.2.2", text: "Search and correlate logs for security events across applications and AWS services", textEs: "Buscar y correlacionar logs de eventos de seguridad entre aplicaciones y servicios", match: /correlacionar|correlate|buscar en los log|search.*log/i },
          { id: "2.2.3", text: "Validate findings from AWS security services to assess scope and impact", textEs: "Validar los findings de los servicios de seguridad para establecer alcance e impacto", match: /validar (el |los )?finding|validate.*finding|falso positivo|false positive|alcance e impacto|scope and impact/i },
          { id: "2.2.4", text: "Contain and eradicate threats, and recover resources (network containment, restoring backups)", textEs: "Contener y erradicar la amenaza y recuperar los recursos (contención de red, restauración de copias)", match: /contenc|contain|aislar|isolat|erradic|eradicat|restaurar|restore/i },
          { id: "2.2.5", text: "Conduct root cause analysis (Detective)", textEs: "Describir métodos de análisis de causa raíz (Amazon Detective)", match: /detective|causa raíz|root cause/i },
        ],
      },
    ],
  },
  {
    id: "3",
    module: "infrastructure-security",
    name: "Infrastructure Security",
    nameEs: "Seguridad de la infraestructura",
    weight: 18,
    tasks: [
      {
        id: "3.1",
        title: "Design, implement, and troubleshoot security controls for network edge services",
        titleEs:
          "Diseñar, implementar y depurar los controles de seguridad del perímetro de red",
        skills: [
          { id: "3.1.1", text: "Define and select edge security strategies based on anticipated threats", textEs: "Definir y elegir la estrategia de seguridad en el perímetro según las amenazas previstas", match: /edge|perímetro|ddos|shield|waf/i },
          { id: "3.1.2", text: "Implement network edge protection (CloudFront headers, WAF, IoT policies, OWASP Top 10, S3 CORS, Shield Advanced)", textEs: "Implementar la protección del perímetro (cabeceras de CloudFront, WAF, políticas de IoT, OWASP Top 10, CORS de S3, Shield Advanced)", match: /cloudfront|waf|iot|owasp|cors|shield/i },
          { id: "3.1.3", text: "Design edge controls and rules based on requirements (geography, geolocation, rate limiting, client fingerprinting)", textEs: "Diseñar reglas de perímetro según requisitos (geografía, geolocalización, rate limiting, fingerprinting de cliente)", match: /rate limit|geo|fingerprint|bot control/i },
          { id: "3.1.4", text: "Configure integrations with AWS edge services and third-party services (OCSF format, third-party WAF rules)", textEs: "Integrar los servicios de perímetro con terceros (ingesta en formato OCSF, reglas de WAF de terceros)", match: /ocsf|open cybersecurity|managed rule group|regla gestionada|third-party|de terceros/i },
        ],
      },
      {
        id: "3.2",
        title: "Design, implement, and troubleshoot security controls for compute workloads",
        titleEs:
          "Diseñar, implementar y depurar los controles de seguridad de las cargas de cómputo",
        skills: [
          { id: "3.2.1", text: "Design hardened EC2 AMIs and container images (Systems Manager, EC2 Image Builder)", textEs: "Diseñar AMIs e imágenes de contenedor endurecidas (Systems Manager, EC2 Image Builder)", match: /image builder|ami (hardened|endurecid|dorada|golden)|hardened ami|imagen dorada/i },
          { id: "3.2.2", text: "Apply instance profiles, service roles, and execution roles to authorize compute workloads", textEs: "Aplicar instance profiles, service roles y execution roles para autorizar las cargas de cómputo", match: /instance profile|perfil de instancia|execution role|rol de ejecución|service role|imdsv2/i },
          { id: "3.2.3", text: "Scan compute resources for known vulnerabilities (Inspector for images and Lambda, GuardDuty runtime monitoring)", textEs: "Escanear vulnerabilidades conocidas en el cómputo (Inspector sobre imágenes y Lambda, Runtime Monitoring de GuardDuty)", match: /inspector|runtime monitoring|monitorización en tiempo de ejecución|cve|vulnerabilidad/i },
          { id: "3.2.4", text: "Deploy patches across compute resources (Systems Manager Patch Manager, Inspector)", textEs: "Desplegar parches en la flota y validarlo de forma continua (Patch Manager, Amazon Inspector)", match: /patch manager|parche|patching|patch baseline/i },
          { id: "3.2.5", text: "Configure secure administrative access to compute resources (Session Manager, EC2 Instance Connect)", textEs: "Configurar acceso administrativo seguro al cómputo (Session Manager, EC2 Instance Connect)", match: /session manager|instance connect|acceso administrativo|bastion|bastión/i },
          { id: "3.2.6", text: "Configure security tools to discover and remediate vulnerabilities within a pipeline (Amazon Q Developer, CodeGuru Security)", textEs: "Configurar herramientas que descubran y remedien vulnerabilidades dentro del pipeline (Amazon Q Developer, CodeGuru Security)", match: /pipeline|amazon q|codeguru|ci\/cd|análisis estático|static analysis/i },
          { id: "3.2.7", text: "Implement protections and guardrails for generative AI applications (GenAI OWASP Top 10 for LLM Applications)", textEs: "Implementar protecciones y guardrails para aplicaciones de IA generativa (OWASP Top 10 para aplicaciones LLM)", match: /bedrock|guardrail|\bllm\b|ia generativa|generative ai|prompt injection/i },
        ],
      },
      {
        id: "3.3",
        title: "Design and troubleshoot network security controls",
        titleEs:
          "Diseñar y depurar los controles de seguridad de red",
        skills: [
          { id: "3.3.1", text: "Design and troubleshoot network controls to permit or prevent traffic (security groups, network ACLs, Network Firewall)", textEs: "Diseñar y depurar los controles que permiten o bloquean tráfico (security groups, network ACLs, Network Firewall)", match: /security group|network acl|\bnacl\b|network firewall/i },
          { id: "3.3.2", text: "Design secure connectivity between hybrid and multi-cloud networks (Site-to-Site VPN, Direct Connect, MACsec)", textEs: "Diseñar conectividad segura híbrida y multi-nube (Site-to-Site VPN, Direct Connect, MACsec)", match: /site-to-site|site to site|direct connect|macsec|híbrid|hybrid/i },
          { id: "3.3.3", text: "Determine security workload requirements for hybrid-to-AWS communication (Verified Access)", textEs: "Determinar los requisitos de comunicación entre el entorno híbrido y AWS (Verified Access)", match: /verified access|zero trust|confianza cero/i },
          { id: "3.3.4", text: "Design network segmentation (north/south and east/west protections, isolated subnets)", textEs: "Diseñar la segmentación de red (tráfico norte-sur y este-oeste, subredes aisladas)", match: /segmentac|segmentation|east-?west|north-?south|este-oeste|norte-sur|subredes? aislad|isolated subnet/i },
          { id: "3.3.5", text: "Identify unnecessary network access (Verified Access, Network Access Analyzer, Inspector network reachability)", textEs: "Identificar accesos de red innecesarios (Verified Access, Network Access Analyzer, findings de alcanzabilidad de Inspector)", match: /network access analyzer|reachability|alcanzabilidad|acceso innecesario|unnecessary (network )?access/i },
        ],
      },
    ],
  },
  {
    id: "4",
    module: "iam",
    name: "Identity and Access Management",
    nameEs: "Gestión de identidades y accesos",
    weight: 20,
    tasks: [
      {
        id: "4.1",
        title: "Design, implement, and troubleshoot authentication strategies",
        titleEs:
          "Diseñar, implementar y depurar las estrategias de autenticación",
        skills: [
          { id: "4.1.1", text: "Design identity solutions for human, application and system authentication (IAM Identity Center, Cognito, MFA, IdP integration)", textEs: "Diseñar soluciones de identidad para personas, aplicaciones y sistemas (IAM Identity Center, Cognito, MFA, integración con IdP)", match: /identity center|cognito|\bmfa\b|identity provider|proveedor de identidad|\bsaml\b|\boidc\b/i },
          { id: "4.1.2", text: "Configure mechanisms to issue temporary credentials (STS, S3 presigned URLs)", textEs: "Configurar la emisión de credenciales temporales (AWS STS, URLs prefirmadas de S3)", match: /\bsts\b|assumerole|credenciales temporales|temporary credentials|presigned|pre-?firmada/i },
          { id: "4.1.3", text: "Troubleshoot authentication issues (CloudTrail, Cognito, IAM Identity Center permission sets, Directory Service)", textEs: "Diagnosticar fallos de autenticación (CloudTrail, Cognito, permission sets de Identity Center, Directory Service)", match: /permission set|conjunto de permisos|directory service|managed microsoft ad|fallo de autenticación|authentication (issue|failure)/i },
        ],
      },
      {
        id: "4.2",
        title: "Design, implement, and troubleshoot authorization strategies",
        titleEs:
          "Diseñar, implementar y depurar las estrategias de autorización",
        skills: [
          { id: "4.2.1", text: "Design and evaluate authorization controls (Verified Permissions, IAM paths, IAM Roles Anywhere, resource policies, role trust policies)", textEs: "Diseñar y evaluar los controles de autorización (Verified Permissions, paths de IAM, IAM Roles Anywhere, políticas de recurso y de confianza)", match: /verified permissions|roles anywhere|iam path|\bpath\b.*iam|trust polic|política de confianza|resource polic|política de recurso/i },
          { id: "4.2.2", text: "Design attribute-based (ABAC) and role-based (RBAC) access control strategies", textEs: "Diseñar estrategias de control de acceso por atributos (ABAC) y por roles (RBAC)", match: /\babac\b|\brbac\b|basado en (atributos|etiquetas)|tag-based|principaltag|resourcetag/i },
          { id: "4.2.3", text: "Design and implement IAM policies following least privilege (permission boundaries, session policies)", textEs: "Diseñar e interpretar políticas IAM con mínimo privilegio (permission boundaries, session policies)", match: /permission boundar|límite de permisos|session polic|política de sesión|mínimo privilegio|least privilege/i },
          { id: "4.2.4", text: "Analyze authorization failures to determine causes or effects (IAM Policy Simulator, IAM Access Analyzer)", textEs: "Analizar fallos de autorización para determinar causas y efectos (Policy Simulator, IAM Access Analyzer)", match: /policy simulator|simulador de políticas|access analyzer|denegad|denied|evaluación de políticas|policy evaluation/i },
          { id: "4.2.5", text: "Investigate and correct unintended permissions or privileges (IAM Access Analyzer)", textEs: "Investigar y corregir permisos o privilegios concedidos sin querer (IAM Access Analyzer)", match: /access analyzer|acceso externo|external access|unused access|acceso sin usar|permisos no previstos/i },
        ],
      },
    ],
  },
  {
    id: "5",
    module: "data-protection",
    name: "Data Protection",
    nameEs: "Protección de datos",
    weight: 18,
    tasks: [
      {
        id: "5.1",
        title: "Design and implement controls for data in transit",
        titleEs:
          "Diseñar e implementar los controles del dato en tránsito",
        skills: [
          { id: "5.1.1", text: "Require encryption when connecting to resources (ELB security policies, TLS configurations)", textEs: "Exigir cifrado en la conexión a los recursos (políticas de seguridad de ELB, configuración de TLS)", match: /security polic.*(elb|load balancer)|política de seguridad.*(elb|balanceador)|\btls\b|mutual authentication|mtls/i },
          { id: "5.1.2", text: "Design secure and private access to resources (PrivateLink, VPC endpoints, Client VPN, Verified Access)", textEs: "Diseñar acceso privado y seguro a los recursos (PrivateLink, VPC endpoints, Client VPN, Verified Access)", match: /privatelink|vpc endpoint|endpoint de vpc|client vpn|verified access/i },
          { id: "5.1.3", text: "Design inter-resource encryption in transit (EMR, EKS, SageMaker AI inter-node encryption, Nitro encryption)", textEs: "Diseñar el cifrado en tránsito entre recursos (cifrado entre nodos de EMR, EKS y SageMaker AI, cifrado de Nitro)", match: /nitro|inter-?nod|entre nodos|\bemr\b|\beks\b|sagemaker/i },
        ],
      },
      {
        id: "5.2",
        title: "Design and implement controls for data at rest",
        titleEs:
          "Diseñar e implementar los controles del dato en reposo",
        skills: [
          { id: "5.2.1", text: "Design and configure data encryption at rest (CloudHSM vs KMS, client-side vs server-side)", textEs: "Diseñar el cifrado en reposo según requisitos (elegir entre CloudHSM y KMS, entre cifrado en cliente y en servidor)", match: /cloudhsm|\bkms\b|sse-|dsse|client-side|cifrado en el cliente/i },
          { id: "5.2.2", text: "Protect data integrity (S3 Object Lock, Glacier Vault Lock, versioning, code signing, file validation)", textEs: "Proteger la integridad del dato (S3 Object Lock, Glacier Vault Lock, versionado, firma de código, validación de ficheros)", match: /object lock|vault lock|versionado|versioning|code signing|firma de código|signer|log file validation|validación de integridad/i },
          { id: "5.2.3", text: "Design automatic lifecycle management and retention (S3 Lifecycle, Object Lock, EFS Lifecycle, FSx for Lustre backup policies)", textEs: "Diseñar la gestión automática del ciclo de vida y la retención (ciclo de vida de S3 y de EFS, Object Lock, copias de FSx for Lustre)", match: /lifecycle|ciclo de vida|retención|retention|\befs\b|\bfsx\b/i },
          { id: "5.2.4", text: "Design secure data replication and backup (Data Lifecycle Manager, AWS Backup, ransomware protection, DataSync)", textEs: "Diseñar replicación y copias de seguridad (Data Lifecycle Manager, AWS Backup, protección frente a ransomware, DataSync)", match: /aws backup|data lifecycle manager|ransomware|datasync|replicac|replicat|backup vault|bóveda/i },
        ],
      },
      {
        id: "5.3",
        title: "Design and implement controls to protect confidential data, credentials, secrets, and cryptographic key materials",
        titleEs:
          "Diseñar e implementar los controles que protegen datos confidenciales, credenciales, secretos y material criptográfico",
        skills: [
          { id: "5.3.1", text: "Design management and rotation of credentials and secrets (Secrets Manager)", textEs: "Diseñar la gestión y rotación de credenciales y secretos (Secrets Manager)", match: /secrets manager|rotación de (secreto|credencial)|rotat(e|ing) (secret|credential)|parameter store/i },
          { id: "5.3.2", text: "Manage and use imported key material (rotating imported key material, external key stores)", textEs: "Gestionar y usar material de clave importado (rotarlo, configurar almacenes de claves externos)", match: /material de clave importad|imported key material|external key store|almacén de claves externo|\bxks\b|byok/i },
          { id: "5.3.3", text: "Describe the differences between imported key material and AWS generated key material", textEs: "Describir las diferencias entre material de clave importado y material generado por AWS", match: /material de clave importad|imported key material|generad[oa] por aws|aws-generated|origin.*external|external.*origin/i },
          { id: "5.3.4", text: "Mask sensitive data (CloudWatch Logs data protection policies, SNS message data protection)", textEs: "Enmascarar datos sensibles (políticas de protección de datos de CloudWatch Logs y de mensajes de SNS)", match: /enmascara|mask|data protection polic|política de protección de datos|message data protection/i },
          { id: "5.3.5", text: "Create and manage encryption keys and certificates across one or multiple Regions (KMS customer managed keys, Private CA)", textEs: "Crear y gestionar claves y certificados en una o varias Regiones (KMS customer managed keys, Private CA)", match: /multi-region key|clave multi-?región|private ca|private certificate authority|\bacm\b|certificate manager/i },
        ],
      },
    ],
  },
  {
    id: "6",
    module: "governance",
    name: "Security Foundations and Governance",
    nameEs: "Fundamentos de seguridad y gobierno",
    weight: 14,
    tasks: [
      {
        id: "6.1",
        title: "Develop a strategy to centrally deploy and manage AWS accounts",
        titleEs:
          "Definir una estrategia para desplegar y gestionar las cuentas de AWS de forma centralizada",
        skills: [
          { id: "6.1.1", text: "Deploy and configure organizations by using AWS Organizations", textEs: "Desplegar y configurar la organización con AWS Organizations", match: /organizations|unidad organizativa|\bou\b|organizational unit/i },
          { id: "6.1.2", text: "Implement and manage Control Tower in new and existing environments, and deploy optional and custom controls", textEs: "Implantar y gestionar Control Tower en entornos nuevos y existentes, con controles opcionales y propios", match: /control tower|landing zone|guardrail de control tower|proactive control|control proactivo|drift/i },
          { id: "6.1.3", text: "Implement organization policies to manage permissions (SCPs, RCPs, AI service opt-out policies, declarative policies)", textEs: "Aplicar políticas de organización para gestionar permisos (SCPs, RCPs, opt-out de servicios de IA, políticas declarativas)", match: /\bscp\b|\brcp\b|opt-out|declarative|declarativa|tag polic|política de etiquet/i },
          { id: "6.1.4", text: "Centrally manage security services (delegated administrator accounts)", textEs: "Gestionar centralmente los servicios de seguridad (cuentas de administrador delegado)", match: /delegated administrator|administrador delegado/i },
          { id: "6.1.5", text: "Manage AWS account root user credentials (centralized root access, MFA, break-glass)", textEs: "Gestionar las credenciales del usuario raíz (acceso root centralizado, MFA, procedimientos break-glass)", match: /root|break-?glass|usuario raíz/i },
        ],
      },
      {
        id: "6.2",
        title: "Implement a secure and consistent deployment strategy for cloud resources",
        titleEs:
          "Implantar una estrategia de despliegue segura y consistente para los recursos en la nube",
        skills: [
          { id: "6.2.1", text: "Use infrastructure as code to deploy resources consistently (CloudFormation StackSets, third-party IaC, CloudFormation Guard, cfn-lint)", textEs: "Usar infraestructura como código para desplegar de forma consistente (StackSets, IaC de terceros, CloudFormation Guard, cfn-lint)", match: /stackset|cloudformation|cfn-lint|cfn guard|cloudformation guard|terraform|\biac\b/i },
          { id: "6.2.2", text: "Use tags to organize AWS resources into groups for management", textEs: "Usar etiquetas para agrupar y gestionar los recursos (departamento, centro de coste, entorno)", match: /etiquet|\btag\b|tagging|tag editor/i },
          { id: "6.2.3", text: "Deploy and enforce policies and configurations from a central source (Firewall Manager)", textEs: "Desplegar y aplicar políticas y configuraciones desde un punto central (Firewall Manager)", match: /firewall manager/i },
          { id: "6.2.4", text: "Securely share resources across AWS accounts (Service Catalog, Resource Access Manager)", textEs: "Compartir recursos entre cuentas de forma segura (Service Catalog, Resource Access Manager)", match: /service catalog|resource access manager|\bram\b|compartir recurso|share resource/i },
        ],
      },
      {
        id: "6.3",
        title: "Evaluate the compliance of AWS resources",
        titleEs:
          "Evaluar el cumplimiento de los recursos de AWS",
        skills: [
          { id: "6.3.1", text: "Create or enable rules to detect and remediate noncompliant resources and send notifications (AWS Config, Security Hub)", textEs: "Crear reglas que detecten y remedien recursos no conformes y notifiquen (AWS Config, Security Hub)", match: /aws config|regla de config|config rule|no conforme|noncompliant|remediación|remediation/i },
          { id: "6.3.2", text: "Use AWS audit services to collect and organize evidence (Audit Manager, Artifact)", textEs: "Usar los servicios de auditoría para recopilar y organizar evidencia (Audit Manager, AWS Artifact)", match: /audit manager|aws artifact|evidencia|evidence/i },
          { id: "6.3.3", text: "Use AWS services to evaluate architecture against best practices (Well-Architected Tool)", textEs: "Evaluar la arquitectura frente a las buenas prácticas de AWS (Well-Architected Tool)", match: /well-architected|trusted advisor/i },
        ],
      },
    ],
  },
];

// The In-Scope AWS Services list from the guide. A service AWS names here can
// appear in the exam, so one the guide lists and the bank never mentions is a
// question the student has never seen. Grouped as the guide groups them.
const IN_SCOPE_SERVICES = [
  ["Analytics", [
    ["Amazon Athena", /athena/i],
    ["Amazon OpenSearch Service", /opensearch/i],
  ]],
  ["Application Integration", [
    ["Amazon SNS", /\bsns\b|simple notification service/i],
    ["AWS Step Functions", /step functions/i],
  ]],
  ["Compute", [
    ["Amazon API Gateway", /api gateway/i],
    ["Amazon EC2", /\bec2\b/i],
    ["EC2 Image Builder", /image builder/i],
    ["EC2 Instance Connect", /instance connect/i],
    ["Amazon EKS", /\beks\b|kubernetes/i],
    ["Amazon EMR", /\bemr\b/i],
    ["AWS Lambda", /lambda/i],
    ["Amazon Data Lifecycle Manager", /data lifecycle manager|\bdlm\b/i],
  ]],
  ["Developer Tools", [
    ["AWS Fault Injection Service", /fault injection|\bfis\b/i],
  ]],
  ["Internet of Things", [
    ["AWS IoT Core", /iot core|política de iot|iot polic/i],
  ]],
  ["Machine Learning", [
    ["Amazon Bedrock", /bedrock/i],
    ["Amazon CodeGuru Security", /codeguru/i],
    ["Amazon Q Business", /amazon q business/i],
    ["Amazon Q Developer", /amazon q developer/i],
    ["Amazon SageMaker AI", /sagemaker/i],
  ]],
  ["Management and Governance", [
    ["AWS CloudFormation", /cloudformation/i],
    ["AWS CloudTrail", /cloudtrail/i],
    ["AWS CloudTrail Lake", /cloudtrail lake/i],
    ["Amazon CloudWatch", /cloudwatch/i],
    ["AWS Config", /aws config|config rule|regla de config/i],
    ["AWS Control Tower", /control tower/i],
    ["Amazon Managed Grafana", /grafana/i],
    ["AWS Organizations", /organizations/i],
    ["AWS Resilience Hub", /resilience hub/i],
    ["AWS Resource Access Manager", /resource access manager|aws ram/i],
    ["AWS Service Catalog", /service catalog/i],
    ["AWS Systems Manager", /systems manager/i],
    ["AWS Trusted Advisor", /trusted advisor/i],
    ["AWS User Notifications", /user notifications|notificaciones de usuario/i],
    ["AWS Well-Architected Tool", /well-architected tool|herramienta well-architected/i],
  ]],
  ["Networking and Content Delivery", [
    ["Amazon Application Recovery Controller", /application recovery controller/i],
    ["Amazon VPC", /\bvpc\b/i],
    ["Network Access Analyzer", /network access analyzer/i],
    ["Network ACLs", /network acl|\bnacl\b/i],
    ["Security groups", /security group|grupo de seguridad/i],
    ["VPC endpoints", /vpc endpoint|endpoint de vpc|privatelink/i],
    ["AWS Site-to-Site VPN", /site-?to-?site/i],
    ["Flow Logs", /flow logs/i],
    ["AWS Verified Access", /verified access/i],
    ["AWS Client VPN", /client vpn/i],
    ["Amazon CloudFront", /cloudfront/i],
    ["Amazon Verified Permissions", /verified permissions/i],
    ["Amazon Route 53 Resolver DNS Firewall", /dns firewall|route 53 resolver/i],
    ["AWS Direct Connect", /direct connect/i],
    ["Elastic Load Balancing", /load balancer|balanceador|\balb\b|\bnlb\b|elastic load balancing/i],
    ["AWS Transit Gateway", /transit gateway/i],
  ]],
  ["Security, Identity, and Compliance", [
    ["AWS Artifact", /aws artifact/i],
    ["AWS Audit Manager", /audit manager/i],
    ["AWS Certificate Manager", /certificate manager|\bacm\b/i],
    ["AWS CloudHSM", /cloudhsm/i],
    ["Amazon Cognito", /cognito/i],
    ["Amazon Detective", /detective/i],
    ["AWS Directory Service", /directory service|managed microsoft ad/i],
    ["AWS Firewall Manager", /firewall manager/i],
    ["Automated Forensics Orchestrator", /forensics orchestrator/i],
    ["Amazon GuardDuty", /guardduty/i],
    ["IAM", /\biam\b/i],
    ["AWS IAM Identity Center", /identity center/i],
    ["Amazon Inspector", /inspector/i],
    ["AWS KMS", /\bkms\b/i],
    ["Amazon Macie", /macie/i],
    ["AWS Network Firewall", /network firewall/i],
    ["AWS Private Certificate Authority", /private ca|private certificate authority/i],
    ["AWS Secrets Manager", /secrets manager/i],
    ["AWS Security Hub", /security hub/i],
    ["Amazon Security Lake", /security lake/i],
    ["AWS Shield / Shield Advanced", /shield/i],
    ["AWS STS", /\bsts\b|assumerole/i],
    ["AWS WAF", /\bwaf\b/i],
  ]],
  ["Storage and Data Management", [
    ["Amazon S3", /\bs3\b/i],
    ["AWS Backup", /aws backup/i],
    ["AWS DataSync", /datasync/i],
    ["Amazon EFS", /\befs\b/i],
    ["Amazon FSx for Lustre", /\bfsx\b/i],
  ]],
];

// AWS lists these as explicitly out of scope. A question whose correct answer
// is one of them teaches something the exam will not ask.
const OUT_OF_SCOPE = [
  { name: "AWS Payment Cryptography", match: /payment cryptography/i },
  { name: "Amazon MWAA / Apache Airflow", match: /\bmwaa\b|apache airflow/i },
];

// Content AWS added in SCS-C03 relative to SCS-C02. These are the skills most
// likely to be under-represented in material written for the previous exam.
const NEW_IN_C03 = ["2.2.3", "3.1.4", "3.2.7", "5.1.3", "5.3.3", "5.3.4", "5.3.5"];

const GUIDE_EDITION = {
  es: "SCS-C03 (guía oficial, edición 2026)",
  en: "SCS-C03 (official exam guide, 2026 edition)",
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
  NEW_IN_C03,
  GUIDE_EDITION,
  allSkills,
};
