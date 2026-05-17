# Plan Técnico — Refactor del Parser OpenLAG

## Objetivo
Refactorizar el parser para convertirlo en una frontera de confianza del sistema, manteniendo la filosofía de OpenLAG: documentación viva, parcial y evolutiva, pero nunca silenciosamente incorrecta.

## Problemas a resolver

1. El parser actual mezcla lectura, parsing, validación y construcción del grafo.
2. Existen errores silenciosos que pueden generar grafos incompletos.
3. La validación estructural no está suficientemente formalizada.
4. El sistema no diferencia bien entre errores críticos, artefactos inválidos y deuda documental.
5. El diseño debe quedar preparado para evolución futura sin sobredimensionarse.

## Arquitectura objetivo

Pipeline propuesto:

`Files` → `Parser` → `Schema Validation` → `Normalizer` → `GraphBuilder` → `Validation Pipeline` → `DiagnosticEngine` → `graph-data.json`

## Responsabilidades

### Parser
- Lee documentos.
- Extrae frontmatter.
- Parsea Markdown básico.
- Devuelve `RawDocument`.
- No construye grafo.
- No valida relaciones.

### Schema Validation
- Usa Zod.
- Valida campos obligatorios, enums y estructura.
- Clasifica errores de esquema.

### Normalizer
- Aplica defaults.
- Soporta aliases.
- Prepara compatibilidad con `schemaVersion`.
- Produce artefactos canónicos.

### GraphBuilder
- Consume solo artefactos normalizados.
- Construye nodos y relaciones.
- No lee archivos ni corrige datos.

### Validation Pipeline
Dividir conceptualmente en:
- `ReferenceValidator`: valida IDs, relaciones y referencias cruzadas.
- `SemanticValidator`: valida reglas semánticas entre tipos, capas y relaciones.
- `TemporalValidator`: valida versiones, herencia temporal y evolución.
- `OwnershipValidator`: valida owner, team, maintainers, reviewers y steward.

### DiagnosticEngine
- Agrega errores y warnings.
- Clasifica severidad.
- Produce salida CLI/JSON.

## Estrategia de errores

### CRITICAL (Abortan generación)
- YAML ilegible.
- Archivo corrupto.
- Frontmatter imposible de parsear.
- `schemaVersion` futura incompatible.

### INVALID (Excluyen artefacto)
- Tipo de artefacto inexistente.
- Status inválido.
- Campos obligatorios ausentes.
- Estructura inválida.

### DEGRADED (Incluyen artefacto con warning)
- Relaciones rotas.
- Ownership incompleto.
- Referencias pendientes.

### WARNING (Deuda documental)
- Requisito sin test.
- Código huérfano.
- Trazabilidad incompleta.

## schemaVersion

No debe ser obligatorio inicialmente.

- Ausente: asumir `legacy` y emitir warning.
- Desconocido: intentar normalización base y avisar.
- Futuro: error crítico.
- Migraciones: gestionadas en `Normalizer`.

## Markdown AST

Adoptar estrategia "AST-ready":

Primera fase:
- Extraer headings, links, bloques de código, y Mermaid básico.
- No explotar todavía validaciones avanzadas, pero el diseño debe permitir usarlas sin rehacer el parser.

## Cache incremental futura

Diseño compatible (no implementar todavía si complica el refactor):

- Fingerprint por documento.
- Separación documento / artefacto.
- Possibilidad de invalidación futura.

## Orden de implementación

1. Separar Parser y GraphBuilder.
2. Eliminar errores silenciosos.
3. Introducir Zod.
4. Introducir DiagnosticEngine.
5. Introducir Normalizer.
6. Introducir schemaVersion.
7. Preparar cache incremental.

## Criterios de aceptación

1. Ningún error de parsing se silencia.
2. Un documento inválido aparece en el reporte.
3. El grafo no incluye artefactos estructuralmente inválidos.
4. Las relaciones rotas se reportan claramente.
5. El comportamiento es determinista.
6. Los documentos legacy siguen funcionando.
7. El refactor no obliga a rediseñar todo OpenLAG.
