# Task: ADDR Catalog Management API v2 (write side)

**Status:** in_progress
**Priority:** high
**Created:** 2026-02-25
**Branch:** `addr-catalog-management-v2`
**Prompts:** `design/addr-ai-prompts.md`
**Depends on:** ADDR Catalog Storefront (complete — see `addr-process.md`), ADDR Catalog Management v1 (kept as baseline)

## Context

The Catalog Storefront ADDR run designed the read-side APIs (search, browse, evaluate, compare, partner syndication). This v2 task covers the write-side: catalog management commands, approval workflows, pricing rules, inventory management, and the admin operations that feed the storefront.

This run preserves the original Catalog Management ADDR artifacts as a baseline and executes a new sibling run focused on clearer service boundaries/subdomains and practical real-life workflow tradeoffs.

The existing storefront artifacts inform this work:
- 3 read-side API boundaries already defined (Catalog Storefront, Component Compatibility, Partner Catalog)
- 7 integration events already specified in AsyncAPI
- Style guide established in `design/style-guide.md`

## Subtasks

### Align Phase (COMPLETE; EVENT STORMING TEMPORARILY DEFERRED)
- [x] Read ADDR prompts for Align phase (`design/addr-ai-prompts.md`)
- [x] Review storefront Align artifacts for reusable context
- [x] Review Catalog Management v1 Align artifacts as baseline/reference
- [x] Define/refine write-side personas for v2
- [x] Compose/refine unifying job stories (JS1–JS6)
- [x] Expand job stories into activities and activity steps (command intent and business outcomes)
- [x] Map job stories and activities to candidate subdomains/service boundaries
- [x] Create `boundary-map.md` (ownership, interfaces, invariants, overlap/gap checks)
- [x] Create `eventmodel-mapping.md` (STATE_CHANGE / STATE_VIEW / AUTOMATION candidates)
- [x] Validate Align v2 artifacts and package deliverable
- [x] Git commit Align phase
- [ ] Git push Align phase

### Define Phase
- [ ] Identify candidate admin API boundaries (may extend or add to existing 3)
- [ ] Assess boundary consolidation with existing storefront boundaries
- [ ] Identify API resources per admin boundary
- [ ] Generate API profiles per boundary (command operations, state-changing events)
- [ ] Validate API profiles
- [ ] Generate sequence diagrams for admin job stories
- [ ] Package Define deliverable
- [ ] Git commit + push Define phase

### Design Phase
- [ ] Reuse/extend existing style guide for write operations (idempotency, optimistic concurrency, etc.)
- [ ] Produce API design tables for admin boundaries
- [ ] Record design decisions
- [ ] Validate Design artifacts
- [ ] Package Design deliverable
- [ ] Git commit + push Design phase

### Refine Phase
- [ ] Generate OpenAPI 3.1 specs for admin APIs (validate with Redocly CLI)
- [ ] Generate AsyncAPI 3.0 specs for command-side events (validate with @asyncapi/cli)
- [ ] Generate request/response examples for admin job stories
- [ ] Generate Mermaid sequence diagrams with HTTP semantics
- [ ] Generate Postman collections for admin APIs
- [ ] Validate all specs — zero warnings
- [ ] Package Refine deliverable
- [ ] Git commit + push Refine phase

### Event Modeling (Post-ADDR)
- [ ] Generate EventModel `config.json` from Align v2 + refined API flows
- [ ] Generate `high-level-analysis.json`
- [ ] Validate slice/dependency rules against EventModel schema expectations
- [ ] Package EventModel outputs and references
