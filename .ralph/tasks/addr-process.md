# Task: ADDR API Design Process

**Status:** in_progress
**Priority:** high
**Created:** 2026-02-14
**Prompts:** `design/addr/addr-ai-prompts.md`

## Subtasks

### Align Phase (VALIDATED + COMMITTED)
- [x] Define personas
- [x] Compose unifying job stories (JS1–JS6)
- [x] Expand job stories into activities and activity steps
- [x] Validate Align artifacts (6 findings, all resolved — see validation.md)
- [x] Package Align deliverable
- [x] Event Storming drawio refined and cleaned up (consolidated to event-storming.drawio)
- [x] Git commit + push Align phase

### Define Phase (VALIDATED + COMMITTED)
- [x] Identify candidate API boundaries (DDD principles)
- [x] Assess boundary consolidation
- [x] Identify API resources per boundary
- [x] Generate API profiles per boundary
- [x] Validate API profiles — 4 findings (2 applied, 1 dropped, 1 deferred)
- [x] Generate sequence diagrams for each job story
- [x] Package Define deliverable
- [x] Git commit + push Define phase

### Design Phase (VALIDATED + COMMITTED)
- [x] Establish design style guidelines (`design/addr/design/style-guide.md`)
- [x] Produce API design — Catalog API (14 operations)
- [x] Produce API design — Compatibility API (2 operations)
- [x] Produce API design — Partner Catalog API (3 operations)
- [x] Validate Design artifacts — all 19 ops covered, style guide compliant (see validation.md)
- [x] Design decisions recorded (D-016, D-017, D-018)
- [x] Package Design deliverable (README + api-design.md + style-guide.md + validation.md)
- [x] Git commit + push Design phase

### Refine Phase (RE-VALIDATED WITH REDOCLY)
- [x] Generate OpenAPI 3.1 spec — Catalog Storefront API (14 ops, validated with swagger-cli)
- [x] Generate OpenAPI 3.1 spec — Component Compatibility API (2 ops, validated)
- [x] Generate OpenAPI 3.1 spec — Partner Catalog Syndication API (3 ops, validated)
- [x] Generate AsyncAPI 3.0 spec — 7 integration events (validated with @asyncapi/cli)
- [x] Generate README request/response examples for each job story (api-examples.md)
- [x] Generate Mermaid sequence diagrams with HTTP semantics (sequence-diagrams.md)
- [x] Generate Postman collections for all 3 APIs
- [x] Validate Refine artifacts — all specs pass CLI validation
- [x] Package Refine deliverable (README + validation.md)
- [x] Redocly re-validation — 19 warnings found and resolved (D-019, D-020, D-021)
- [x] UUID standardization — 166 replacements across 8 files
- [x] Cursor rules + Event Modeling skill created
- [ ] Git commit + push Refine phase
