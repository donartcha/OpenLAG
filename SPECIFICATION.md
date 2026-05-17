# OpenLAG Project Specification v0.1

## 1. Filosofía de OpenLAG

OpenLAG (Open Living Architecture Graph) es un sistema de Architecture as Code diseñado para representar el estado trazable del conocimiento técnico de un sistema software en evolución.

Su propósito principal no es generar documentación estática ni imponer procesos rígidos, sino permitir que equipos técnicos puedan:
- visualizar relaciones entre artefactos,
- comprender impacto de cambios,
- detectar huecos de trazabilidad,
- mantener documentación viva,
- y evolucionar sistemas complejos de forma observable.

OpenLAG parte de una premisa fundamental:
> La documentación nunca está completamente terminada, pero sí puede ser observable, versionable y verificable.

### Qué NO intenta resolver
OpenLAG NO pretende:
- reemplazar Jira,
- reemplazar Confluence,
- sustituir herramientas ALM empresariales,
- imponer burocracia documental,
- modelar perfectamente toda la organización,
- ni actuar como una “fuente absoluta de verdad”.

OpenLAG representa conocimiento parcial, incremental y cambiante.

### Architecture as Code
En OpenLAG, la arquitectura se modela como artefactos versionables definidos mediante Markdown estructurado.

Cada artefacto:
- posee identidad,
- relaciones,
- estado,
- contexto temporal,
- y trazabilidad.

La arquitectura deja de ser una imagen estática y pasa a convertirse en un grafo navegable y evolutivo.

### Grafo Arquitectónico Vivo
OpenLAG transforma documentos y relaciones en un grafo semántico navegable que refleja:
- requisitos,
- decisiones,
- implementaciones,
- validaciones,
- riesgos,
- cambios,
- y dependencias.

El grafo evoluciona junto al software.

### Principios Fundamentales
- Hacer visibles los huecos.
- La documentación evoluciona junto al software.
- Los artefactos representan conocimiento parcial y cambiante.
- La trazabilidad es progresiva.
- La validación debe adaptarse al contexto del desarrollo.
- El sistema debe tolerar incertidumbre y refactors.
- El linting debe ayudar, no bloquear innecesariamente.

## 2. Semantic Layer Model

OpenLAG clasifica los artefactos en diferentes capas semánticas (Layers) para entender en qué nivel de abstracción operan y qué tipo de relaciones son válidas entre ellos.

### Taxonomía de Capas
1. **Business Layer**: Define qué se debe construir y por qué. (Propósito: Alinear negocio; Límites: No dicta implementación; Artefactos: `PROJECT`, `EPIC`, `FEATURE`, `REQUIREMENT`).
2. **Architecture Layer**: Define el diseño y los límites técnicos del sistema. (Propósito: Diseño y restricciones; Artefactos: `DESIGN`, `DECISION`, `API`, `COMPONENT`).
3. **Implementation Layer**: Modela el código, los tests y su trazabilidad. (Propósito: Código concreto; Artefactos: `CODE_ENTITY`, `TEST_CASE`, `DATABASE_ENTITY`, `CHANGE`, `BUG`).
4. **Operations Layer**: Modela la infraestructura, el despliegue y la salud en tiempo de ejecución. (Propósito: Observabilidad y entrega; Artefactos: `INFRASTRUCTURE`, `DEPLOYMENT`, `MONITORING`, `INCIDENT`).
5. **Documentation Layer**: Todo el conocimiento adicional transversal. (Propósito: Contexto; Artefactos: `GLOSSARY_TERM`, `DOCUMENTATION`).

### Ownership Model
El motor de OpenLAG soporta asignación de responsabilidad semántica (Ownership) con distintos roles:
- `owner`: El principal responsable (persona).
- `team`: El equipo propietario.
- `maintainers`: Array de contribuidores activos.
- `reviewers`: Array de validadores de negocio/técnicos.
- `steward`: Responsable de gobernanza y calidad del artefacto.

### Relation Strength Model
Las relaciones se catalogan según un peso semántico para filtrar el ruido visual e impacto:
- **Strong**: (Fuerte) Relación crítica y de acoplamiento directo (`IMPLEMENTS`, `TESTS`, `DEPENDS_ON`, `BLOCKS`, `FIXES`, `DEFINES`, `VALIDATES`, `REPLACES`).
- **Medium**: (Media) Relación descriptiva o de flujo (`DERIVES_FROM`, `USES`, `IMPACTS`, `JUSTIFIES`, `BREAKS`, `REFINES`, `DEPLOYS`, `MONITORS`).
- **Weak**: (Débil) Relación laxa y estrictamente semántica (`RELATES_TO`, `DOCUMENTS`).

### Relation Category Model
Las 18 relaciones oficiales de OpenLAG se agrupan por su propósito semántico en el sistema:
- **TRACEABILITY**: Relaciones que definen validación y cobertura documental (`IMPLEMENTS`, `TESTS`, `VALIDATES`, `REFINES`, `FIXES`).
- **STRUCTURAL**: Relaciones que definen la estructura y jerarquías (`DEPENDS_ON`, `USES`).
- **BEHAVIORAL**: Relaciones que definen el comportamiento y el flujo en código (`DEFINES`, `BREAKS`).
- **OPERATIONAL**: Relaciones que ocurren en infraestructura y tiempo de ejecución (`DEPLOYS`, `MONITORS`, `IMPACTS`, `BLOCKS`).
- **SEMANTIC**: Relaciones descriptivas, de abstracción o históricas (`RELATES_TO`, `DOCUMENTS`, `REPLACES`, `JUSTIFIES`, `DERIVES_FROM`).

## 3. Estructura Oficial de Proyecto

```text
docs/
 ├── versions/
 ├── relations/
 ├── requirements/
 ├── epics/
 ├── features/
 ├── decisions/
 ├── design/
 ├── code/
 ├── tests/
 ├── risks/
 ├── changes/
 ├── glossary/
 └── architecture/
```

### versions/
El directorio `versions/` controla el ciclo de vida, agrupando los archivos definitorios del tiempo.

#### versions.md
Define la línea temporal global e iteraciones del sistema en formato YAML Frontmatter o múltiple bloque YAML. Los artefactos deben tener el `type: VERSION`. Define identificador (`id`), `name`, `timestamp` y la posible versión padre (`parentVersion`).

Ejemplo de su estructura:

```yaml
---
id: v-1
type: VERSION
name: "1.0.0"
timestamp: "2026-05-06"
parentVersion: null
---
```

#### components-versions.md
Archivo para artefactos que documentan versiones de componentes o librerías externas del sistema. Los artefactos aquí tienen el type `SYSTEM_VERSION` y contienen atributos como `component`, `version`, y `releaseDate`.

```yaml
---
id: sv-db-1
type: SYSTEM_VERSION
component: "PostgreSQL Database"
version: "15.2"
releaseDate: "2023-05-06"
---
```

### relations/
Directorio donde se definen formalmente las reglas y multiplicidades de las relaciones que rigen el grafo mediante archivos YAML individuales (ej: `IMPLEMENTS.yaml`, `USES.yaml`).

### changes/
Directorio para artefactos que documentan cambios arquitectónicos, refactors importantes, o bug fixes estructurales. Los artefactos tienen el type `CHANGE`, atributos como `changeType`, `versionFrom`, `versionTo`, y una lista `affects` detallando a qué otros artefactos o versiones de sistema aplican los cambios.

Los tipos de cambio (`changeType`) soportados son:
- **ERROR**: Corrección de fallos o deuda técnica crítica.
- **FEATURE**: Nuevas capacidades con impacto en la arquitectura.
- **EVOLUTION**: Mejoras graduales, seguridad o actualizaciones de cumplimiento.
- **REFACTOR**: Reestructuraciones sin alterar el comportamiento externo.
- **ADAPTATION**: Ajustes para nuevas integraciones o restricciones del entorno.

### requirements/
Contiene requisitos funcionales y no funcionales.

### epics/
Agrupaciones de alto nivel de funcionalidades o dominios.

### features/
Funcionalidades específicas implementables.

### decisions/
Decisiones arquitectónicas o técnicas relevantes.

### design/
Diseños técnicos, diagramas y estructuras internas.

### code/
Representaciones trazables de entidades de código.

### tests/
Casos de prueba y validaciones.

### risks/
Riesgos técnicos, operativos o arquitectónicos.

### changes/
Historial de cambios relevantes.

### glossary/
Términos compartidos y semántica del dominio.

### architecture/
Documentación transversal del sistema.

## 3. Tipos Oficiales de Artefacto

- **PROJECT**: Representa el sistema completo.
- **EPIC**: Agrupación funcional o de negocio de alto nivel.
- **FEATURE**: Funcionalidad concreta derivada de un EPIC.
- **REQUIREMENT**: Necesidad funcional o técnica.
- **BUSINESS_RULE**: Restricción o comportamiento esperado del dominio.
- **USE_CASE**: Caso de uso que describe una interacción usuario-sistema.
- **DESIGN**: Diseño técnico o arquitectónico.
- **DECISION**: Decisión técnica persistente o histórica.
- **CODE_ENTITY**: Elemento implementado en código. Ejemplos: clase, módulo, endpoint, servicio, componente, script.
- **TEST_CASE**: Caso de validación verificable.
- **CHANGE**: Cambio funcional o técnico registrado.
- **BUG**: Defecto identificado.
- **RISK**: Riesgo conocido.
- **GLOSSARY_TERM**: Concepto compartido del dominio.
- **COMPONENT**: Subconjunto arquitectónico del sistema.
- **API**: Contrato de integración.
- **DATABASE_ENTITY**: Entidad persistente.
- **TEST**: Agrupación u ocurrencia genérica de validación.
- **DOCUMENTATION**: Elemento descriptivo o de referencia.
- **INCIDENT**: Incidencia o caída registrada en producción o entorno de ejecución.
- **INFRASTRUCTURE**: Componente físico o cloud.
- **DEPLOYMENT**: Instancia desplegada o configuración de despliegue.
- **MONITORING**: Elemento de observabilidad, alerta o dashboard.
- **MAINTENANCE**: Tarea de mantenimiento u operación.

## 4. Estados Oficiales

```text
draft
in_progress
ready
closed
deprecated
```

### draft
Conocimiento inicial o incompleto.
Permite:
- relaciones faltantes,
- implementaciones pendientes,
- tests ausentes.

### in_progress
Trabajo activo.
El sistema puede emitir warnings pero no bloquear.

### ready
Estado suficientemente trazable.
Debe poseer coherencia razonable.

### closed
Artefacto completado.
Debe poseer trazabilidad fuerte:
- implementación,
- validación,
- relaciones completas.

### deprecated
Elemento legado o reemplazado.
No debería bloquear salvo inconsistencias críticas.

## 5. Formal Relation Contracts

Las relaciones se definen mediante contratos explícitos que garantizan la coherencia arquitectónica. Estos contratos se definen en archivos YAML individuales dentro de la carpeta `/docs/relations/`. 

El diseño de las relaciones obedece a un modelo semántico coherente, mantenible y alineado con la filosofía Architecture as Code.

### Relation Support Levels

El soporte de relaciones en OpenLAG se divide en niveles para gestionar la complejidad cognitiva y la flexibilidad evolutiva:

1. **Mandatory Core Relations:** Obligatorias. Forman la base mínima para rastrear el "por qué" de las cosas.
2. **Official Optional Relations:** Opcionales. Útiles para modelar el "cómo" y el despliegue del software de forma estructurada. 
3. **Custom Relations:** Definibles por el usuario para casos internos específicos, documentándolas en `/docs/relations/`.

### Mandatory Core Relations

Estas relaciones son el subconjunto oficial y obligatorio de OpenLAG. Son las únicas generadas por defecto para favorecer la adopción.

| Relation | Origin | Category | Default Strength | Purpose |
|---|---|---|---|---|
| IMPLEMENTS | Human | TRACEABILITY | STRONG | Conecta implementación con necesidad funcional/técnica. |
| TESTS | Human | TRACEABILITY | STRONG | Conecta tests con comportamiento validado. |
| REFINES | Human | TRACEABILITY | MEDIUM | Descompone artefactos en otros más concretos. |
| FIXES | Human | TRACEABILITY | STRONG | Conecta correcciones con bugs. |
| DOCUMENTS | Human | SEMANTIC | WEAK | Conecta documentación con el artefacto descrito. |
| JUSTIFIES | Human | SEMANTIC | MEDIUM | Conecta decisiones con aquello que justifican. |

### Official Optional Relations

Estas relaciones describen principalmente la operatividad e infraestructura ("CÓMO" operan las cosas), en lugar de la justificación (el "POR QUÉ"). Pueden añadirse manualmente en `/docs/relations/` si el proyecto necesita este modelado.

- **DEPENDS_ON**: Acoplamiento arquitectónico y de empaquetado. Idealmente inferido sintéticamente.
- **USES**: Invocación o flujo en tiempo de ejecución.
- **DEPLOYS**: Instanciación de componentes o release en infraestructura.
- **MONITORS**: Relación de observabilidad.
- **IMPACTS / BLOCKS / BREAKS**: Descripción de averías o impedimentos.
- **REPLACES**: Útil para modelar evolución/histórico.
- **DERIVES_FROM**: Relación genérica de evolución conceptual.
- **VALIDATES**: Relación empírica/humana (QA Manual) a diferencia de TESTS.
- **DEFINES**: Para entidades que instauran glosarios o normas.
- **CALLS / IMPORTS**: Trazabilidad puramente a nivel de código de componentes.
- **RELATES_TO**: (DISCOURAGED) Uso genérico altamente propenso a polución semántica. Requiere rationale si se emplea.

### Default Init Behavior

El comando de inicialización (`npx openlag init` o `npm run init` si está expuesto) genera **únicamente Mandatory Core Relations**.

El objetivo es reducir la complejidad cognitiva para nuevos proyectos. Los equipos pueden incorporar `Official Optional Relations` progresivamente copiando las especificaciones según madure su modelo documental; evitando así agobiar a los equipos con más de 18 opciones desde el día uno.

### Human Relations vs Synthetic Relations

OpenLAG distingue conceptualmente el origen y la responsabilidad de las relaciones:

**Human Relations (Manuales)**
Relaciones que requieren de análisis, intención e intervención humana:
- `IMPLEMENTS`, `TESTS`, `REFINES`, `FIXES`, `JUSTIFIES`, `DOCUMENTS`.
Estas relaciones justifican *por qué* suceden las cosas en el ciclo de vida del software y conforman el set Mandatory Core.

**Synthetic Relations (Inferidas automáticamente)**
Relaciones estructurales u operativas que, idealmente, provienen de análisis de código o tooling externo (aunque pueden ser manuales de forma transitiva):
- `DEPENDS_ON`, `CALLS`, `IMPORTS`, `USES`, `DEPLOYS`.
Estas relaciones indican *cómo* operan las cosas. No se exige mantenerlas manualmente al inicio del proyecto.

### Criterio Anti-Desperdicio & Gobernanza
OpenLAG prohíbe las "relaciones dinámicas abiertas" para salvaguardar el grafo frente a la polución semántica (donde "related" se usa como excusa comodín y enrarece el entendimiento visual). Toda relación necesaria extra debe definirse mediante nuevos archivos `.yaml` en el directorio `/docs/relations/`. Estos pasarán escrutinio como reglas locales del grafo.

La relación `RELATES_TO` se considera **DISCOURAGED**. Su uso excesivo o injustificado destruye el valor del grafo, convirtiéndolo en un enjambre incomprensible (polución semántica). Por defecto, no se genera al inicializar un proyecto.

Para utilizar esta relación, el contrato debe ser explícitamente generado usando `npx openlag init --all` (o creado manualmente en `/docs/relations/RELATES_TO.yaml`). Cuando un desarrollador utilice esta relación en el Frontmatter de un artefacto Markdown, se recomienda justificarla estrictamente aportando contexto mediante un campo `rationale` o detallando la motivación de la conexión dentro del cuerpo del documento, demostrando que ninguna relación con mayor peso semántico (como `IMPLEMENTS`, `DEPENDS_ON`, o `USES`) encajaba en ese escenario particular.

### Tipos de Restricción
- **VALID**: Relación estándar y correcta.
- **ALLOWED**: Permitida, pero no recomendada.
- **DISCOURAGED**: Mala práctica, generará `warn` en desarrollo, `error` en release.
- **INVALID**: Prohibida, generará `error` inmediato.

### Estructura de Artefactos vs Semántica
Mientras las relaciones (reglas del grafo) se definen formalmente en `/docs/relations/*.yaml`, los **Artefactos (ArtifactTypes)** pertenecen al núcleo estático validado por OpenLAG (`ArtifactRegistry`).
La documentación real del proyecto NUNCA debe comprimirse artificialmente en archivos YAML técnicos.
Se exige que los artefactos persistan como **archivos Markdown legibles por humanos (`.md`)** distribuidos en directorios semánticos (`/requirements`, `/features`, `/design`, `/code`). Así, se mantiene la filosofía *Architecture as Code* legible directamente en repositorios de Git.

### Severidad por Perfil
- **feature**: Solo `error` en reglas `INVALID`.
- **develop**: `warn` en reglas `DISCOURAGED`, `error` en `INVALID`.
- **release**: `error` en reglas `DISCOURAGED` e `INVALID`.

## 6. Formato Oficial Markdown

```yaml
---
id: REQ-001
type: REQUIREMENT
status: draft
layer: BUSINESS
title: Generar graph-data.json
version: v1
ownership:
  owner: dony
  team: architecture
  maintainers:
    - backend-team
tags:
  - parser
  - graph
relations:
  - type: IMPLEMENTS
    target: CODE-001
    strength: STRONG
    category: TRACEABILITY
---
```

### Campos Obligatorios
- `id`
- `type`
- `status`
- `title`

### Campos Opcionales
- `layer`
- `ownership` (puede incluir `owner`, `team`, `domain`, `maintainers`, `reviewers`, `steward`)
- `tags`
- `version`
- `relations` (cada relación puede tener `strength` y `category`)
- `description`
- `references`

### Convenciones
- IDs únicos.
- Frontmatter YAML obligatorio.
- Markdown libre debajo del bloque estructurado.

## 7. Convenciones de IDs

```text
REQ-001
CODE-023
TEST-004
DEC-002
BUG-018
```

### Reglas
- IDs deben ser únicos.
- IDs no deben reutilizarse.
- IDs deben ser estables temporalmente.
- El prefijo define el tipo lógico.

## 8. Modelo de Evolución

OpenLAG modela sistemas vivos.

La evolución típica:
```text
Idea
 → draft
 → in_progress
 → ready
 → closed
 → deprecated
```

La trazabilidad aumenta progresivamente.
No se espera completitud inmediata.
Los huecos representan conocimiento pendiente, no necesariamente errores.

## 9. Semántica del Linter

### Profiles
```text
feature
develop
release
```

### feature
Relajado.
Solo bloquea errores estructurales graves.

### develop
Intermedio.
Detecta deuda y huecos.

### release
Estricto.
Exige trazabilidad fuerte.

### Filosofía
El linter no busca castigar, busca visibilizar.

### Errores típicos
- IDs duplicados.
- relaciones rotas.
- YAML inválido.
- tipos inexistentes.

### Warnings típicos
- requisitos sin test.
- código sin trazabilidad.
- relaciones incompletas.

## 10. Artefactos Huérfanos

Un huérfano es un artefacto sin relaciones significativas.

Ejemplos:
- requisito sin implementación,
- test sin objetivo,
- código sin justificación.

Los huérfanos:
- pueden ser normales en `draft`,
- representan riesgo en `release`.

## 11. Análisis de Impacto

OpenLAG permite responder:
- ¿Qué rompe este cambio?
- ¿Qué depende de este componente?
- ¿Qué requisitos implementa este módulo?
- ¿Qué tests validan esta funcionalidad?

El impacto se calcula recorriendo relaciones del grafo.

## 12. Versionado y Línea Temporal

OpenLAG modela:
- snapshots,
- releases,
- herencia temporal,
- evolución histórica.

Las versiones forman un árbol temporal navegable.

Los artefactos pueden:
- persistir,
- cambiar,
- reemplazarse,
- o desaparecer.

## 13. Escalabilidad y Limitaciones

### Limitaciones actuales
- JSON global completo en frontend.
- Carga total en memoria.
- Grafos grandes degradan renderizado.

### Riesgos
- OOM frontend.
- Demasiadas relaciones.
- SVG/Canvas complejos.

### Evoluciones futuras posibles
- backend opcional.
- graph database.
- lazy loading.
- paginación de nodos.

## 14. Integración CI/CD

La CLI de OpenLAG está diseñada para integrarse en pipelines de integración continua.

### Comando `check`
El comando `openlag check` es el estándar recomendado para CI, ya que agrupa:
1. Validación de tipos (TypeScript).
2. Lint de código fuente (ESLint).
3. Validación arquitectónica (OpenLAG Lint).

### Ejemplo GitHub Actions:

```yaml
name: OpenLAG Guard

on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npx openlag check
```

### Uso recomendado
- Validar PRs mediante `openlag check`.
- Detectar drift documental.
- Mostrar deuda progresiva de trazabilidad.
- Evitar inconsistencias estructurales antes de merge.

### 15. Roadmap Conceptual

#### Fase 1: Núcleo y Tooling (Completado/En curso)
- **Parser Robusto**: Extracción centralizada de datos Markdown y YAML.
- **CLI Oficial**: Interfaz unificada (`openlag`) para manipulación y visualización.
- **Linting Extensible**: Motor de validación con perfiles de severidad.
- **Generación Estable**: Pipeline de datos optimizado para el portal.

#### Fase 2: Capacidades Avanzadas (Próximo paso)
- **Capa de Extensibilidad**: Plugins para customizar reglas de linting y tipos de artefactos.
- **API de Consultas**: Interfaz programática para extraer métricas del grafo.
- **Análisis Temporal Profundo**: Comparativa automática entre versiones del grafo.

#### Fase 3: Escalabilidad (Visión)
- **Backend Opcional**: Persistencia en bases de datos de grafos para repositorios masivos.
- **Asistentes IA**: Integración con modelos de lenguaje para sugerir trazabilidad y detectar inconsistencias.
- **Generación Automática**: Puentes entre código real y documentación de arquitectura.

## 16. Filosofía Final

OpenLAG no intenta representar una verdad absoluta.
Intenta representar el estado observable y trazable del conocimiento técnico de un sistema en evolución.

El objetivo no es alcanzar perfección documental.

El objetivo es:
- reducir incertidumbre,
- aumentar comprensión,
- mejorar trazabilidad,
- y hacer visible la evolución real del software.
