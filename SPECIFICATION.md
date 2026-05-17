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
Las relaciones ahora definen un peso semántico para filtrar el ruido visual e impacto:
- **Strong**: (Fuerte) Relación crítica y de acoplamiento directo (`IMPLEMENTS`, `TESTS`, `DEPENDS_ON`, `BLOCKS`, `BREAKS`, `DEFINES`, `VALIDATES`, `REPLACES`).
- **Medium**: (Media) Relación descriptiva o de flujo (`DERIVES_FROM`, `USES`, `IMPACTS`, `JUSTIFIES`, `REFINES`, `MONITORS`).
- **Weak**: (Débil) Relación laxa y estrictamente semántica (`RELATES_TO`, `DOCUMENTS`).

### Relation Category Model
Las relaciones también se pueden agrupar por su propósito en el sistema:
- **STRUCTURAL**: Relaciones que definen la estructura (ej. DEPENDS_ON, REFINES, IMPLEMENTS, REPLACES).
- **BEHAVIORAL**: Relaciones que definen el comportamiento y el flujo (ej. USES, DEFINES).
- **OPERATIONAL**: Relaciones que ocurren en tiempo de ejecución (ej. IMPACTS, MONITORS, DEPLOYS, BREAKS, BLOCKS).
- **SEMANTIC**: Relaciones descriptivas o de abstracción (ej. DERIVES_FROM, RELATES_TO, DOCUMENTS, JUSTIFIES).
- **TRACEABILITY**: Relaciones que definen validación y corrección (ej. TESTS, VALIDATES, FIXES).

## 3. Estructura Oficial de Proyecto

```text
docs/
 ├── project-manifest.md
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

### project-manifest.md
Es el manifiesto central del proyecto que controla el ciclo de vida. Define la línea temporal e iteraciones del grafo arquitectónico en formato YAML.

1. **Versions**: Define las versiones (iteraciones temporales) globales del sistema (incluye identificador, nombre, fecha y la versión padre).

Ejemplo de su estructura:

```markdown
## Versions
```yaml
- id: v-1
  name: 1.0.0
  timestamp: "2026-05-06"
  parentVersion: null
```
```

### system-versions/
Directorio para artefactos que documentan versiones de componentes o librerías externas del sistema. Los artefactos aquí tienen el type `SYSTEM_VERSION` y contienen atributos como `component`, `version`, y `releaseDate`.

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

## 5. Relaciones Oficiales

- **IMPLEMENTS**: Indica implementación de un requisito o diseño.
- **TESTS**: Indica validación de otro artefacto.
- **DEPENDS_ON**: Dependencia funcional o técnica.
- **DERIVES_FROM**: Herencia o derivación conceptual.
- **RELATES_TO**: Relación semántica débil.
- **IMPACTS**: Indica impacto potencial.
- **BLOCKS**: Bloqueo funcional o técnico.
- **FIXES**: Corrección de defecto.
- **USES**: Consumo de otro artefacto.
- **DEFINES**: Define estructura o comportamiento.
- **VALIDATES**: Valida cumplimiento.
- **DOCUMENTS**: Describe o documenta.
- **REPLACES**: Sustituye un artefacto anterior.
- **JUSTIFIES**: Justificación o fundamento de una decisión técnica.
- **BREAKS**: Indica que un artefacto o cambio rompe la funcionalidad de otro.
- **REFINES**: Detalla, especifica o divide a otro artefacto.
- **DEPLOYS**: Indica que una infraestructura o pipeline despliega a otro componente.
- **MONITORS**: Un elemento observa la telemetría, salud o estado de otro artefacto.

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

Ejemplo GitHub Actions:

```yaml
name: OpenLAG Lint

on:
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - run: npm install
      - run: npm run lint:openlag
```

### Uso recomendado
- Validar PRs.
- Detectar drift documental.
- Mostrar deuda progresiva.
- Evitar inconsistencias estructurales.

## 15. Roadmap Conceptual

### Corto Plazo
- parser robusto,
- linting extensible,
- generación estable,
- tests.

### Medio Plazo
- backend opcional,
- API de consultas,
- métricas,
- análisis temporal.

### Largo Plazo
- graph database,
- visualización distribuida,
- generación automática,
- asistentes IA opcionales.

### Separación Importante
Las capacidades IA futuras:
- NO forman parte del núcleo actual,
- NO deben asumirse como implementadas,
- y deben mantenerse desacopladas.

## 16. Filosofía Final

OpenLAG no intenta representar una verdad absoluta.
Intenta representar el estado observable y trazable del conocimiento técnico de un sistema en evolución.

El objetivo no es alcanzar perfección documental.

El objetivo es:
- reducir incertidumbre,
- aumentar comprensión,
- mejorar trazabilidad,
- y hacer visible la evolución real del software.
