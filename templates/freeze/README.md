# OpenLAG Freeze Templates

Freeze templates are presentation skins for the frozen document model. They may change layout, typography, density, navigation, and color, but they must not decide which artifacts, relations, or sections are exported.

## Templates

- `freeze-template.html`: default professional documentation template.
- `technical-manual.html`: dense developer and architecture manual with persistent navigation.
- `executive-brief.html`: metrics-first stakeholder brief with reduced visual noise.
- `audit-dossier.html`: formal traceability dossier for governance and audit review.
- `knowledge-map.html`: navigation-first knowledge map for architecture exploration.

## Selection

An export profile can select a template:

```yaml
template:
  id: technical-manual
  path: templates/freeze/technical-manual.html
```

The CLI can override it:

```bash
openlag freeze --profile architecture --format html --template audit-dossier
openlag freeze --profile architecture --format pdf --template executive-brief
openlag freeze --profile architecture --format html --template templates/freeze/knowledge-map.html
```

When `--output` is provided, a path with an extension is treated as the target file. A path without an extension is treated as a directory and receives the standard `openlag-<profile>-<template>.<format>` filename.

```bash
openlag freeze --profile architecture --format html --output exports
openlag freeze --profile architecture --format pdf --template audit-dossier --output exports/audit.pdf
```

## Required Placeholders

Templates must keep `data-template` placeholders for branding, cover, summary, profile, document, executive summary, and footer values. The renderer replaces them from the canonical `FreezeTemplateContext`.

Templates must keep `data-template-src="branding.logo"` for logo assets.

## Required Slots

Templates must keep these slots:

- `openlag.tableOfContents`
- `openlag.sidebarNavigation`
- `openlag.sections`
- `openlag.artifacts`
- `openlag.relations`
- `openlag.technicalMetadata`

Slots are rendered by shared OpenLAG code. Do not add artifact filtering, relation filtering, ordering, profile logic, or business copy decisions inside templates. Keep those decisions in `docs/contracts/export-profiles/*.yaml`.

## Offline Bundles

Source templates contain only these placeholders:

```html
/* __OPENLAG_INLINE_MARKED_BUNDLE__ */
/* __OPENLAG_INLINE_MERMAID_BUNDLE__ */
```

OpenLAG injects Marked and Mermaid bundles in memory during export. Bundles are written only to generated output files in the command directory or the explicit `--output` path; they must never be committed into source templates.

## Safe Customization

You may edit CSS, layout wrappers, typography, section placement, branding placement, and print styles.

Do not remove required placeholders, required slots, `<meta charset="utf-8">`, vendor placeholders, runtime scripts, or `@media print` rules.
