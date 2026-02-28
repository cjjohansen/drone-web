# Task: ADDR Catalog Management API (write side)

**Status:** paused (baseline preserved; superseded by v2 run)
**Priority:** high
**Created:** 2026-02-20
**Branch:** `addr-catalog-management`
**Prompts:** `design/addr-ai-prompts.md`
**Depends on:** ADDR Catalog Storefront (complete — see `addr-process.md`)

## Context

The Catalog Storefront ADDR run designed the read-side APIs (search, browse, evaluate, compare, partner syndication). This task covers the write-side: catalog management commands, approval workflows, pricing rules, inventory management, and the admin operations that feed the storefront.

The existing storefront artifacts inform this work:
- 3 read-side API boundaries already defined (Catalog Storefront, Component Compatibility, Partner Catalog)
- 7 integration events already specified in AsyncAPI
- Style guide established in `design/style-guide.md`

## Subtasks

### Align Phase (VALIDATED)
- [x] Read ADDR prompts for Align phase (`design/addr-ai-prompts.md`)
- [x] Review storefront Align artifacts for reusable context
- [x] Define write-side personas (Catalog Manager, Pricing Analyst, Inventory Controller, Category Manager, Compatibility Engineer)
- [x] Compose unifying job stories (JS1–JS6)
- [x] Expand job stories into activities and activity steps (38 steps)
- [x] Event Storming for command side (36 events, 4 pivotal, 7 subdomains, 21 integration events)
- [x] Validate Align artifacts (2 findings, both applied — see validation.md)
- [x] Package Align deliverable
- [ ] Git commit + push Align phase

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
