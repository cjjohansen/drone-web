# Catalog Management v2 — Align Phase

> **Domain:** Catalog Management (write side)
> **Methodology:** ADDR (Align-Define-Design-Refine)
> **Status:** Draft (v2 baseline)
> **Depends on:** Catalog Storefront Align (`design/catalog-storefront/addr/align/`) and Catalog Management v1 Align (`design/catalog-management/addr/align/`)

## Overview

Catalog Management v2 preserves the original v1 run and introduces a boundary-first Align approach focused on service ownership, state-change intent, and event-flow readiness.

For this run, Event Storming is **temporarily deferred** while the approach/tooling matures. Instead, Align produces:

- a boundary decomposition artifact (`boundary-map.md`)
- a deterministic EventModel bridge (`eventmodel-mapping.md`)

This preserves momentum into Define while keeping a clear path to reintroduce Event Storming later.

## Deliverables

| File | Description |
|------|-------------|
| [personas.md](personas.md) | Write-side personas for catalog administration |
| [job-stories.md](job-stories.md) | 6 unifying job stories (JS1-JS6) mapped to boundary ownership |
| [activity-steps.md](activity-steps.md) | Command-oriented activity steps with state change and downstream impact |
| [boundary-map.md](boundary-map.md) | Candidate subdomains, ownership, invariants, interfaces, and overlap checks |
| [eventmodel-mapping.md](eventmodel-mapping.md) | Mapping from Align activities to EventModel slice types |
| [validation.md](validation.md) | Align v2 validation report and findings |

## Scope Notes

- v1 artifacts in `design/catalog-management/addr/` are baseline references and remain unchanged.
- v2 is the active run in `design/catalog-management-v2/addr/`.
- Decision and rationale tracking lives in `.ralph/agent/decisions.md` (single source of truth).
