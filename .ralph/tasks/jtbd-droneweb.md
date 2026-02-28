# Task: JTBD Drone Web

**Status:** in_progress (implementation mostly complete)
**Priority:** high
**Created:** 2026-02-26
**Branch:** `addr-catalog-management`
**Depends on:** source corpus folder (current source baseline)

## Context

The source corpus contains identifying names and source-specific references. We need a clean JTBD Drone Web copy in `Specs/Case/JTBD` that remains faithful to original intent while using generic domain terminology and placeholder mappings.

## Subtasks

### Preparation
- [x] Create target folder baseline (`Specs/Case/JTBD`)
- [x] Draft anonymization strategy and RFC text
- [x] Research realistic drone portfolio naming from producer catalogs

### Mapping Design
- [x] Finalize canonical mapping dictionary using placeholder-token format:
  - `source-persona-name`
  - `source-organization-name`
  - `source-system-name`
  - `source-business-unit-name`
  - `source-portfolio-name`
- [x] Separate strict source-to-target mappings from generic domain-retarget mappings
- [x] Record approved mapping dictionary in `Specs/Case/JTBD/README.md`

### Corpus Transformation
- [x] Copy all source files to target folder with mirrored structure
- [x] Apply deterministic replacements across all copied files
- [ ] Add per-file transformation note/header where needed

### Validation
- [x] Verify file parity between source and target folders
- [x] Run residual token scan for known sensitive terms
- [x] Spot-check readability and JTBD semantic fidelity

### Finalization
- [x] Update task status and completion notes
- [ ] Prepare optional commit once content is approved

## Completion Notes (current run)

- Canonical mapping dictionary is published in `Specs/Case/JTBD/README.md`.
- JTBD Drone Web corpus now mirrors all source markdown files (plus target README).
- Replacement policy applied across corpus, including `cockpit` -> `control center`.
- Residual scan shows no remaining known source-case identifiers in target docs.

## Notes

- Source files must remain unchanged.
- Keep mapping consistent across all copied documents.
- Prefer placeholder-token references in governance/task docs.

