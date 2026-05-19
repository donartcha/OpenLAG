# OpenLAG Project Specification v0.1

## 1. OpenLAG Philosophy

OpenLAG (Open Living Architecture Graph) is an Architecture as Code system designed to represent the traceable state of the technical knowledge of an evolving software system.

Its main purpose is not to generate static documentation or impose rigid processes, but to allow technical teams to:
- visualize relationships between artifacts,
- understand the impact of changes,
- detect traceability gaps,
- maintain living documentation,
- and evolve complex systems in an observable way.

OpenLAG starts from a fundamental premise:
> Documentation is never completely finished, but it can be observable, versionable, and verifiable.

### What it does NOT try to solve
OpenLAG does NOT intend to:
- replace Jira,
- replace Confluence,
- replace enterprise ALM tools,
- impose documentary bureaucracy,
- perfectly model the entire organization,
- or act as an "absolute source of truth".

OpenLAG represents partial, incremental, and changing knowledge.

### Architecture as Code
In OpenLAG, architecture is modeled as versionable artifacts defined using structured Markdown.

Each artifact:
- possesses identity,
- relationships,
- status,
- temporal context,
- and traceability.

Architecture ceases to be a static image and becomes a navigable and evolutionary graph.

### Living Architectural Graph
OpenLAG transforms documents and relationships into a navigable semantic graph that reflects:
- requirements,
- decisions,
- implementations,
- validations,
- risks,
- changes,
- and dependencies.

The graph evolves alongside the software.

### Fundamental Principles
- Make gaps visible.
- Documentation evolves alongside the software.
- Artifacts represent partial and changing knowledge.
- Traceability is progressive.
- Validation must adapt to the development context.
- The system must tolerate uncertainty and refactors.
- Linting should help, not block unnecessarily.

## 2. Semantic Layer Model

OpenLAG classifies artifacts into different semantic layers (Layers) to understand at what level of abstraction they operate and what kind of relationships are valid between them.

### Layer Taxonomy
1. **Business Layer**: Defines what should be built and why. (Purpose: Align business; Limits: Does not dictate implementation; Artifacts: `PROJECT`, `EPIC`, `FEATURE`, `REQUIREMENT`).
2. **Architecture Layer**: Defines the design and technical boundaries of the system. (Purpose: Design and constraints; Artifacts: `DESIGN`, `DECISION`, `API`, `COMPONENT`).
3. **Implementation Layer**: Models code, tests, and their traceability. (Purpose: Concrete code; Artifacts: `CODE_ENTITY`, `TEST_CASE`, `DATABASE_ENTITY`, `CHANGE`, `BUG`).
4. **Operations Layer**: Models infrastructure, deployment, and runtime health. (Purpose: Observability and delivery; Artifacts: `INFRASTRUCTURE`, `DEPLOYMENT`, `MONITORING`, `INCIDENT`).
5. **Documentation Layer**: All transversal additional knowledge. (Purpose: Context; Artifacts: `GLOSSARY_TERM`, `DOCUMENTATION`).

### Ownership Model
The OpenLAG engine supports assigning semantic responsibility (Ownership) with different roles:
- `owner`: The main responsible party (person).
- `team`: The owning team.
- `maintainers`: Array of active contributors.
- `reviewers`: Array of business/technical validators.
- `steward`: Responsible for the governance and quality of the artifact.

### Relation Strength Model
Relationships are cataloged according to a semantic weight to filter visual noise and impact:
- **Strong**: Critical relationship and direct coupling (`IMPLEMENTS`, `TESTS`, `DEPENDS_ON`, `BLOCKS`, `FIXES`, `DEFINES`, `VALIDATES`, `REPLACES`).
- **Medium**: Descriptive or flow relationship (`DERIVES_FROM`, `USES`, `IMPACTS`, `JUSTIFIES`, `BREAKS`, `REFINES`, `DEPLOYS`, `MONITORS`).
- **Weak**: Loose and strictly semantic relationship (`RELATES_TO`, `DOCUMENTS`).

### Relation Category Model
The 18 official OpenLAG relationships are grouped by their semantic purpose in the system:
- **TRACEABILITY**: Relationships defining validation and documentary coverage (`IMPLEMENTS`, `TESTS`, `VALIDATES`, `REFINES`, `FIXES`).
- **STRUCTURAL**: Relationships defining structure and hierarchies (`DEPENDS_ON`, `USES`).
- **BEHAVIORAL**: Relationships defining behavior and flow in code (`DEFINES`, `BREAKS`).
- **OPERATIONAL**: Relationships occurring in infrastructure and runtime (`DEPLOYS`, `MONITORS`, `IMPACTS`, `BLOCKS`).
- **SEMANTIC**: Descriptive, abstraction, or historical relationships (`RELATES_TO`, `DOCUMENTS`, `REPLACES`, `JUSTIFIES`, `DERIVES_FROM`).

## 3. Official Project Structure

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
The `versions/` directory controls the life cycle, grouping the defining files over time.

#### Version Artifacts (VERSION)
Defined in individual markdown files within `docs/versions/` (e.g., `v-1.md`). It defines the global timeline and iterations of the system. Artifacts must have `type: VERSION`. In addition to their specific fields (`id`, `name`, `timestamp`, `parentVersion`), as traceability and structural quality are required, they **must** specify common fields such as `layer`, `title`, `description`, `ownership` (minimum `owner` and `team`), and `relations`.

Example of its structure:

```yaml
---
id: v-1
type: VERSION
name: "1.0.0"
timestamp: "2026-05-06"
parentVersion: null
layer: DOCUMENTATION
title: "Project Release v1.0.0"
description: "Initial stable release of the project architecture and features."
ownership:
  owner: pcaro
  team: architecture
relations:
  - type: DOCUMENTS
    to: req-func-1
---
```

#### Component and Library Artifacts (SYSTEM_VERSION)
File for artifacts in separate files within `docs/versions/` (e.g., `sv-db-1.md`) documenting versions of components or external libraries of the system. Artifacts here have the type `SYSTEM_VERSION` and contain attributes like `component`, `version`, and `releaseDate`. They must also include the common structural fields to avoid *linter* warnings.

```yaml
---
id: sv-db-1
type: SYSTEM_VERSION
component: "PostgreSQL Database"
version: "15.2"
releaseDate: "2023-05-06"
layer: OPERATIONS
title: "PostgreSQL Database Engine"
description: "Primary relational data storage system."
ownership:
  owner: pcaro
  team: architecture
relations:
  - type: RELATES_TO
    to: arch-overview
---
```

### relations/
Directory where rules and multiplicities of relationships governing the graph are formally defined using individual YAML files (e.g.: `IMPLEMENTS.yaml`, `USES.yaml`).

### changes/
Directory for artifacts documenting architectural changes, major refactors, or structural bug fixes. Artifacts have the type `CHANGE`, attributes like `changeType`, `versionFrom`, `versionTo`, and an `affects` list detailing which other artifacts or system versions the changes apply to.

Supported change types (`changeType`) are:
- **ERROR**: Correction of failures or critical technical debt.
- **FEATURE**: New capabilities with architectural impact.
- **EVOLUTION**: Gradual improvements, security, or compliance updates.
- **REFACTOR**: Restructurings without altering external behavior.
- **ADAPTATION**: Adjustments for new integrations or environment constraints.

### requirements/
Contains functional and non-functional requirements.

### epics/
High-level groupings of features or domains.

### features/
Specific implementable features.

### decisions/
Relevant architectural or technical decisions.

### design/
Technical designs, diagrams, and internal structures.

### code/
Traceable representations of code entities.

### tests/
Test cases and validations.

### risks/
Technical, operational, or architectural risks.

### changes/
History of relevant changes.

### glossary/
Shared terms and domain semantics.

### architecture/
Cross-cutting system documentation.

## 4. Official Artifact Types

### Base Artifacts
- **PROJECT**: Represents the complete system.
- **EPIC**: High-level functional or business grouping.
- **FEATURE**: Concrete feature derived from an EPIC.
- **REQUIREMENT**: Functional or technical need.
- **BUSINESS_RULE**: Restriction or expected domain behavior.
- **USE_CASE**: Use case describing a user-system interaction.
- **DESIGN**: Technical or architectural design.
- **DECISION**: Persistent or historical technical decision.
- **CODE_ENTITY**: Element implemented in code. Examples: class, module, endpoint, service, component, script.
- **TEST_CASE**: Validation or verifiable test case (minor groupings or occurrences must be mapped to a real test case or suppressed).
- **CHANGE**: Registered functional or technical change.
- **BUG**: Identified defect.
- **RISK**: Known risk.
- **GLOSSARY_TERM**: Shared domain concept.
- **COMPONENT**: Architectural subset of the system.
- **API**: Integration contract.
- **DATABASE_ENTITY**: Persistent entity.
- **DOCUMENTATION**: Descriptive or reference element.
- **INCIDENT**: Incident or outage registered in production or runtime environment.
- **INFRASTRUCTURE**: Physical or cloud component.
- **DEPLOYMENT**: Deployed instance or deployment configuration.
- **MONITORING**: Observability element, alert, or dashboard.
- **MAINTENANCE**: Maintenance or operations task.

### Temporal Artifacts
- **VERSION**: Represents a state or milestone of the project over time.
- **SYSTEM_VERSION**: Specific version of an external or system component or library.

## 5. Official Statuses

```text
draft
in_progress
ready
closed
deprecated
```

### draft
Initial or incomplete knowledge.
Allows:
- missing relationships,
- pending implementations,
- missing tests.

### in_progress
Active work.
The system may issue warnings but not block.

### ready
Sufficiently traceable state.
Should possess reasonable consistency.

### closed
Completed artifact.
Must possess strong traceability:
- implementation,
- validation,
- complete relationships.

### deprecated
Legacy or replaced element.
Should not block unless critical inconsistencies exist.

## 6. Formal Relation Contracts

Relationships are defined by explicit contracts ensuring architectural consistency. These contracts are defined in individual YAML files within the `/docs/relations/` folder.

The design of relationships obeys a consistent, maintainable semantic model aligned with the Architecture as Code philosophy.

### Relation Support Levels

Relation support in OpenLAG is divided into levels to manage cognitive complexity and evolutionary flexibility:

1. **Mandatory Core Relations:** Obligatory. They form the minimum basis for tracing the "why" of things.
2. **Official Optional Relations:** Optional. Useful for modeling the "how" and deployment of software in a structured way.
3. **Custom Relations:** Definable by the user for specific internal cases, documenting them in `/docs/relations/`.

### Mandatory Core Relations Contracts

These relations are the official and mandatory subset of OpenLAG. They are the only ones generated by default to favor adoption. They form the minimum basis for tracing the "why" of things.

| Relation | Allowed From | Allowed To | Category | Strength | Semantic Validation Rule |
|---|---|---|---|---|---|
| **IMPLEMENTS** | `CODE_ENTITY` | `REQUIREMENT`, `FEATURE`, `BUG`, `API` | `TRACEABILITY` | `STRONG` | Every `CODE_ENTITY` must directly implement a logic requirement, business feature, or fix a documented bug, validating the absence of orphaned code. |
| **TESTS** | `TEST_CASE` | `CODE_ENTITY`, `REQUIREMENT`, `FEATURE`, `BUG`, `USE_CASE` | `TRACEABILITY` | `STRONG` | Every `TEST_CASE` must verify something concrete, ensuring the existence of tests that guarantee the correct operation of the system. |
| **REFINES** | `EPIC`, `FEATURE`, `REQUIREMENT` | `EPIC`, `FEATURE`, `REQUIREMENT` | `TRACEABILITY` | `MEDIUM` | Breaks down functional/business artifacts into more concrete ones. The from must be of a lower granularity than the to (e.g., FEATURE refines EPIC). |
| **FIXES** | `CODE_ENTITY`, `CHANGE`, `DECISION` | `BUG`, `INCIDENT` | `TRACEABILITY` | `STRONG` | Connects fixes, changes, or decisions that directly remediate a defect or incident. |
| **DOCUMENTS** | `DOCUMENTATION` | (Any) | `SEMANTIC` | `WEAK` | Connects documentation artifacts with the entities they describe. |
| **JUSTIFIES** | `DECISION` | `DESIGN`, `REQUIREMENT`, `FEATURE`, `CODE_ENTITY`, `ARCHITECTURE` | `SEMANTIC` | `MEDIUM` | Connects design/architectural decisions with what they justify or directly impact. |

### Official Optional Relations

These relations mainly describe operability and infrastructure ("HOW" things operate), rather than justification (the "WHY"). They can be added manually in `/docs/relations/` if the project needs this modeling.

- **DEPENDS_ON**: Architectural and packaging coupling. Ideally inferred synthetically.
- **USES**: Invocation or flow at runtime.
- **DEPLOYS**: Instantiation of components or release in infrastructure.
- **MONITORS**: Observability relationship.
- **IMPACTS / BLOCKS / BREAKS**: Description of failures or impediments.
- **REPLACES**: Useful for modeling evolution/history.
- **DERIVES_FROM**: Generic conceptual evolution relationship.
- **VALIDATES**: Empirical/human relationship (Manual QA) as opposed to TESTS.
- **DEFINES**: For entities establishing glossaries or norms.
- **CALLS / IMPORTS**: Traceability purely at the code level of components.
- **RELATES_TO**: (DISCOURAGED) Highly prone to semantic pollution general use. Requires rationale if used.

### Default Init Behavior

The initialization command (`npx openlag init` or `npm run init` if exposed) generates **only Mandatory Core Relations**.

The goal is to reduce cognitive complexity for new projects. Teams can progressively incorporate `Official Optional Relations` by copying the specifications as their documentary model matures; thus avoiding overwhelming teams with more than 18 options from day one.

### Human Relations vs Synthetic Relations

OpenLAG conceptually distinguishes the source and responsibility of relationships:

**Human Relations (Manual)**
Relationships requiring analysis, intent, and human intervention:
- `IMPLEMENTS`, `TESTS`, `REFINES`, `FIXES`, `JUSTIFIES`, `DOCUMENTS`.
These relationships justify *why* things happen in the software lifecycle and form the Mandatory Core set.

**Synthetic Relations (Automatically Inferred)**
Structural or operational relationships that, ideally, come from code analysis or external tooling (though they can be manual transitively):
- `DEPENDS_ON`, `CALLS`, `IMPORTS`, `USES`, `DEPLOYS`.
These relationships indicate *how* things operate. There is no requirement to maintain them manually at the start of the project.

### Anti-Waste Criterion & Governance
OpenLAG prohibits "open dynamic relations" to safeguard the graph from semantic pollution (where "related" is used as a wildcard excuse and muddies visual understanding). Any necessary extra relationship must be defined using new `.yaml` files in the `/docs/relations/` directory. These will pass scrutiny as local rules of the graph.

The `RELATES_TO` relationship is considered **DISCOURAGED**. Its excessive or unjustified use destroys the graph's value, turning it into an incomprehensible swarm (semantic pollution). By default, it is not generated when initializing a project.

To use this relationship, the contract must be explicitly generated using `npx openlag init --all` (or created manually in `/docs/relations/RELATES_TO.yaml`). When a developer uses this relationship in the Frontmatter of a Markdown artifact, it is recommended to strictly justify it by providing context through a `rationale` field or detailing the motivation for the connection within the document body, demonstrating that no relationship with a greater semantic weight (like `IMPLEMENTS`, `DEPENDS_ON`, or `USES`) fit that particular scenario.

### types of restriction
- **VALID**: Standard and correct relationship.
- **ALLOWED**: Permitted, but not recommended.
- **DISCOURAGED**: Bad practice, will generate `warn` in development, `error` in release.
- **INVALID**: Prohibited, will generate immediate `error`.

### Artifact Structure vs Semantics
While relationships (graph rules) are formally defined in `/docs/relations/*.yaml`, **Artifacts (ArtifactTypes)** belong to the static core validated by OpenLAG (`ArtifactRegistry`).
The actual project documentation should NEVER be artificially compressed into technical YAML files.
It is required that artifacts persist as **human-readable Markdown files (`.md`)** distributed in semantic directories (`/requirements`, `/features`, `/design`, `/code`). Thus, the *Architecture as Code* philosophy is kept legible directly in Git repositories.

### Severity per Profile
- **feature**: Only `error` on `INVALID` rules.
- **develop**: `warn` on `DISCOURAGED` rules, `error` on `INVALID`.
- **release**: `error` on `DISCOURAGED` and `INVALID` rules.

## 7. Official Markdown Format

```yaml
---
id: REQ-001
type: REQUIREMENT
subType: Auth
status: draft
layer: BUSINESS
title: Generate graph-data.json
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
    to: CODE-001
---
```

### Mandatory Fields
- `id`
- `type`
- `status`
- `title`

### Optional Fields
- `layer` (The value of `layer` is always implicitly derived by the `type` field based on the semantic layer taxonomy. It is only allowed to be defined as a manual *override* but is discouraged or subject to strict validation).
- `subType` (Optional. Semantic sub-domain classification or purely taxonomic specialization of an artifact [e.g., `Database`, `Microservice`]. It should not be attributed explicit UI actions in the contract).
- `ownership` (can include `owner`, `team`, `domain`, `maintainers`, `reviewers`, `steward`)
- `tags`
- `version`
- `relations` (each relation must declare its `type` and `to`. The values `strength` and `category` are intrinsic to the relation type contract, and adding them manually is considered an advanced "override" disabled by default).
- `description`
- `references`

### Conventions
- Unique IDs.
- Mandatory YAML Frontmatter.
- Free Markdown below the structured block.

## 8. ID Conventions

```text
REQ-001
CODE-023
TEST-004
DEC-002
BUG-018
```

### Rules
- IDs must be unique.
- IDs should not be reused.
- IDs must be temporally stable.
- The prefix defines the logical type.

## 9. Evolution Model

OpenLAG models living systems.

Typical evolution:
```text
Idea
 → draft
 → in_progress
 → ready
 → closed
 → deprecated
```

Traceability increases progressively.
Immediate completeness is not expected.
Gaps represent pending knowledge, not necessarily errors.

## 10. Linter Semantics

### Profiles
```text
feature
develop
release
```

### feature
Relaxed.
Only blocks severe structural errors.

### develop
Intermediate.
Detects debt and gaps.

### release
Strict.
Requires strong traceability.

### Philosophy
The linter doesn't aim to punish, it aims to make visible.

### Typical errors
- Duplicated IDs.
- Broken relations.
- Invalid YAML.
- Non-existent types.

### Typical Warnings
- Requirements without a test.
- Code without traceability.
- Incomplete relations.

## 11. Orphaned Artifacts

An orphan is an artifact without meaningful relations.

Examples:
- requirement without implementation,
- test without target,
- code without justification.

Orphans:
- can be normal in `draft`,
- represent risk in `release`.

## 12. Impact Analysis

OpenLAG allows answering:
- What does this change break?
- What depends on this component?
- What requirements does this module implement?
- What tests validate this functionality?

Impact is calculated by traversing the graph's relationships.

## 13. Versioning and Timeline

OpenLAG models:
- snapshots,
- releases,
- temporal inheritance,
- historical evolution.

Versions form a navigable temporal tree.

Artifacts can:
- persist,
- change,
- be replaced,
- or disappear.

## 14. Graph Scalability and Exploration Model

OpenLAG is designed under the Offline-First and Static-by-Default principle (pure Architecture as Code hostable on S3, GitHub Pages, or Netlify). However, when projects grow substantially, attempting to visualize the entire system at once is not cognitively useful and causes severe performance issues in the frontend.

Therefore, OpenLAG adopts the following scalability rules through a "Subgraph Exploration" model:

### Fundamental Principles
- **The Complete Graph is a Knowledge Base, NOT a Mandatory Interface**: OpenLAG processes, validates, and stores the total `GraphState`, but does not promise or attempt to visually render it all at once.
- **Subgraph Projection & Focus Mode**: The user explores controlled projected views (Subgraphs). By default, the visual experience is based on selecting a focal artifact and expanding the neighborhood to a configured depth (`depth = 1` or `2`). Unrequested sub-branches are aggressively cropped.
- **Semantic Graph Visualization Engine**: OpenLAG has evolved from being a simple "Document Graph Explorer" into a visual "Software Lifecycle Visualization Engine". The base graph is immovable, but visualization and ordering are done dynamically through the *Ordering Strategy Registry* depending on the perspective (default: Lifecycle Strategy).
- **Weak Relation Hiding**: Diffuse or semantic relations (`RELATES_TO`, `DOCUMENTS`, or others categorized as `WEAK`) increase noise by introducing cross-dependencies without critical architectural impact. They will be hidden by default in the UI (they can be explicitly activated using filters if transversal traceability analysis is required).
- **Hub Collapsing (Tolerance Thresholds)**: There are hard rendering limits (`MAX_RENDER_NODES = 150`, `MAX_RENDER_EDGES = 300`). If a subgraph exceeds these generated thresholds (e.g., a massive project with hundreds of features pointing to a single `Auth` component), the visualization will safely truncate the graph and alert the user, suggesting the use of a depth/Layer filter.
- **Semantic Slice Analysis**: The Impact Engine no longer visually traverses all nodes; instead, it performs controlled queries directly on the GraphQL/TypeScript structural index built in the browser's memory before rendering the solution.

### Visualization Strategies (Semantic Projection)

The portal allows visualizing artifacts under different "Ordering and Grouping Strategies," resolving the graph from different professional perspectives without modifying the graph itself.

1. **Lifecycle Strategy (Default)**: Visualization in natural evolutionary order: VISION → PROJECT → VERSION → EPIC → REQUIREMENT → USE_CASE → DECISION → DESIGN → COMPONENT → FEATURE → CODE_ENTITY → TEST_CASE → RISK → CHANGE → CHANGELOG.
2. **Implementation Strategy**: Order of implementation (DECISION → DESIGN → COMPONENT → FEATURE → CODE_ENTITY → TEST_CASE).
3. **Validation Strategy**: Traceability of tests and validations (REQUIREMENT → FEATURE → TEST_CASE → BUG → CHANGE → INCIDENT).
4. **Architecture / Governance / Release / Domains**: Additional projections that emphasize or isolate segments according to analytical purposes or policies.

### Evolution of Static Graph Data (`graph-data.json`)
- **Phase 1 (Current)**: Single `graph-data.json` + **GraphQueryLayer in Frontend**. All indices (`artifactsById`, `relationsBySource`) are computed in local static memory to then derive the subgraphs consumed by the UI.
- **Phase 2 (Static Fragmentation)**: Optional decomposition by compiling the generator into static fragments (`/slices/*.json` or `/versions/*.json`) to avoid monolithic downloads.
- **Phase 3 (Future Optional Backend)**: Deployment of a transient Engine/BFF only used when the base model grossly exceeds 10,000 artifacts with ultra-asynchronous use, vectorial searches, roles and permissions, interactive mutations on Graph DB. It will remain **100% optional**; OpenLAG must continue to work without a Backend as a premise.

## 15. CI/CD Integration

The OpenLAG CLI is designed to integrate into continuous integration pipelines.

### `check` Command
The `openlag check` command is the recommended standard for CI, as it groups:
1. Type validation (TypeScript).
2. Source code linting (ESLint).
3. Architectural validation (OpenLAG Lint).

### GitHub Actions Example:

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

### Recommended Usage
- Validate PRs using `openlag check`.
- Detect documentary drift.
- Show progressive traceability debt.
- Avoid structural inconsistencies before merge.

## 16. Conceptual Roadmap

#### Phase 1: Core and Tooling (Completed/In Progress)
- **Robust Parser**: Centralized extraction of Markdown and YAML data.
- **Official CLI**: Unified interface (`openlag`) for manipulation and visualization.
- **Extensible Linting**: Validation engine with severity profiles.
- **Stable Generation**: Optimized data pipeline for the portal.

#### Phase 2: Advanced Capabilities (Next step)
- **Extensibility Layer**: Plugins to customize linting rules and artifact types.
- **Query API**: Programmatic interface to extract metrics from the graph.
- **Deep Temporal Analysis**: Automatic comparison between graph versions.

#### Phase 3: Scalability (Vision)
- **Optional Backend**: Persistence in graph databases for massive repositories.
- **AI Assistants**: Integration with language models to suggest traceability and detect inconsistencies.
- **Automatic Generation**: Bridges between real code and architecture documentation.

## 17. Final Philosophy

OpenLAG does not attempt to represent an absolute truth.
It attempts to represent the observable and traceable state of the technical knowledge of an evolving system.

The goal is not achieving documentary perfection.

The goal is to:
- reduce uncertainty,
- increase understanding,
- improve traceability,
- and make the actual evolution of the software visible.
