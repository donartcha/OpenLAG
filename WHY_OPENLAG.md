# Why OpenLAG?

## The Problem: Knowledge Entropy in Software Systems

Software systems evolve rapidly. New features are merged, dependencies are updated, and architectures are refactored. However, the knowledge that explains *why* the system is built a certain way—its requirements, its architectural decisions, its constraints—rarely evolves at the same pace.

This creates **knowledge entropy**.

When documentation rots, traceability disappears. 
- A developer updates a microservice, but doesn't realize it breaks a regulatory requirement.
- A team writes hundreds of tests, but nobody knows if they actually validate the core business rules.
- Architectural boundaries erode because the original Architectural Decision Records (ADRs) are forgotten in a wiki.

## Why Documentation Rots

Documentation rots because it is disconnected from the reality of the codebase. When knowledge lives in wikis, Jira tickets, or isolated Markdown files, it is invisible to the tools that developers use daily (compilers, linters, CI/CD pipelines). 

Documentation is often written once and then abandoned.

## Why Traceability Disappears

Traceability is the ability to connect the dots: *Requirement -> Design -> Code -> Test*. 
In modern agile environments, traceability often disappears because the links between these artifacts are implicit. A Jira ticket mentions a feature, a PR mentions the ticket, and a test asserts some behavior, but there is no automated, persistent graph connecting them.

When traceability is lost, impact analysis becomes guesswork.

## Why Tests Without Intention Are Dangerous

We write tests to ensure our code works. But what does "works" mean? 
A test that asserts `2 + 2 = 4` passes, but if the business requirement was to calculate taxes, the test is useless. Tests without clear traceability to their originating requirements or features create a false sense of security. 

## Why Architecture-as-Code Matters

Architecture-as-Code treats architectural knowledge with the same rigor as source code. It is versioned, reviewed, and integrated into the development workflow. 

By defining artifacts (Requirements, Components, Tests) and the relations between them (Implements, Tests, Documents) in a declarative format, we transform static text into a structured knowledge graph.

## Why Governance Should Be Declarative

Governance—ensuring that a system complies with its rules and standards—is often a slow, manual, bureaucratic process. It happens after the fact, in lengthy review meetings.

Governance should be declarative. Teams should define their rules (e.g., "Every API Route must have an Owner," or "Domain models must not depend on Infrastructure") as contracts. The system should automatically evaluate the architecture against these rules and emit findings (GAPs, Violations).

## Why OpenLAG Focuses on Contracts and Relations

OpenLAG is not an AI that tries to magically understand your codebase. It is a **Semantic Governance Platform**.

It focuses on **Contracts** (Artifact Contracts, Relation Contracts, Rule Contracts) because contracts provide clear, verifiable semantics. By defining what artifacts exist and how they relate, OpenLAG allows you to:
1. Detect when the graph is broken (e.g., a component without an owner).
2. Emit persistent governance artifacts (GAPs) instead of transient lint warnings.
3. Perform explainable impact analysis.

OpenLAG ensures that as your software evolves, your documented knowledge evolves with it.
