# JTBD Drone Web — Product Spec

> **Domain:** Discovery / Research Artifacts
> **Subdomain:** JTBD Documentation
> **Status:** Draft

---

## 1. Overview

Create a JTBD Drone Web copy of source-case materials into `Specs/Case/JTBD` while preserving structure, intent, and workshop usability.

---

## 2. Goals

- Remove direct personal and organization identifiers.
- Replace source-specific names with placeholder-token mappings and generic domain terms.
- Keep JTBD semantics intact (when / I want / so I can).
- Maintain file parity and folder structure with source material.

---

## 3. Non-Goals

- No edits to source files in the source corpus folder.
- No changes to prioritization, impact/frequency scoring, or persona intent.
- No major re-authoring of research conclusions.

---

## 4. Scope

### In Scope
- All markdown files in the source corpus, including `personas/`.
- Consistent term mapping across all target copies.
- Light wording normalization for generic product-catalog context alignment.

### Out of Scope
- New JTBD interviews or net-new personas.
- Event model generation from these documents.

---

## 5. Mapping Principles

- One source term maps to one target term consistently.
- Use placeholder-token labels in mapping governance:
  - `source-persona-name`
  - `source-organization-name`
  - `source-system-name`
  - `source-business-unit-name`
  - `source-portfolio-name`
- Preserve role and process meaning after transformation.
- Prefer generic domain terminology for portfolio/unit labels.
- Keep a transparent mapping list in the target README.

---

## 6. Acceptance Criteria

- Every source markdown file has a corresponding target copy.
- No known sensitive terms remain after verification scan.
- Mapping is consistent across all files.
- Documents remain readable and ready for workshop use.

---

## 7. References

- Source: source corpus folder
- Target: `Specs/Case/JTBD/`
- Task tracking: `.ralph/tasks/jtbd-droneweb.md`

