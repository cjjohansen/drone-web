# Ralph Loop State

> This file is the handoff document between chat/agent sessions.
> The agent MUST read this file at the start of every new session.
> The agent MUST update this file before ending a session or when significant progress is made.

## Project

**Name:** Drone Web — Catalog Storefront API Design
**Repo:** drone-web (`c:\dev\repos\drone-web`)
**Branch:** `addr-catalog-management`
**Goal:** Design APIs for a mechatronic/drone ecommerce platform using the ADDR (Align-Define-Design-Refine) process by James Higginbotham

## Current Phase

**Phase:** ADDR Catalog Storefront — COMPLETE. Next: ADDR Catalog Administration (write side)
**Status:** All 4 ADDR phases for the read-side Catalog Storefront are done. Refine finalization pushed via PR #6 (pending merge to main).
**Blockers:** None

## What Was Just Completed (this session)

- [x] Reworked railway skill to fixed LEGO/BRIO-style pieces (turnout/merger, 45° bends, branch sleepers)
- [x] Moved race artifacts into `.cursor/skills/railway-drawio/` (`example-race.js`, `example-race.drawio`)
- [x] Added `README.md` component catalog and refreshed `SKILL.md`
- [x] Added legend rendering in race example and tuned spacing/placement
- [x] Tuned outer loop geometry to avoid overlap and support x/y widening controls
- [x] Added fail-fast collision checking in example generation
- [x] Added reusable piece-list DSL + per-piece collision checks in engine:
  - `dsl(x, y, heading).add(...).build(opts)`
  - `buildTrackFromList(x, y, heading, pieces, opts)`

## ADDR Catalog Storefront Summary (COMPLETE)

### Align Phase (VALIDATED + COMMITTED)
- 4 personas, 6 job stories (JS1–JS6), 23 activity steps
- Big Picture Event Storming: 40 domain events, 4 pivotal events
- Event Storming skills created
- Validated (6 findings resolved) — see `design/catalog-storefront/addr/align/validation.md`

### Define Phase (VALIDATED + COMMITTED)
- 3 API boundaries (Catalog Storefront, Component Compatibility, Partner Catalog)
- 14 resources, 19 API operations profiled
- Sequence diagrams for all 6 job stories
- Async event-driven integration model

### Design Phase (VALIDATED + COMMITTED)
- Style guide, API design tables for all 3 boundaries (19 operations)
- Decisions D-016 through D-018

### Refine Phase (VALIDATED + PUSHED via PR #6)
- OpenAPI 3.1 specs for all 3 APIs (validated with Redocly CLI — zero warnings)
- AsyncAPI 3.0 spec — 7 integration events (validated with @asyncapi/cli)
- Postman collections, request/response examples, sequence diagrams
- UUID standardization (D-019), license/example fixes (D-020), Redocly adoption (D-021)
- Cursor rules and Event Modeling skill created

## What Comes Next

1. **ADDR Catalog Management** — 2nd ADDR run for the write side (commands, approval workflows, pricing rules, inventory management). Task: `.ralph/tasks/addr-catalog-management.md`
2. **Event Modeling** — generate Event Model JSON from specs using `legacy-system-2-eventmodel` skill (separate task, after Catalog Admin ADDR completes)

## Key Decisions

| ID | Decision | Date |
|----|----------|------|
| D-001–D-004 | Align phase decisions (see agent/decisions.md) | 2026-02-14 |
| D-005–D-008 | Define phase decisions (see agent/decisions.md) | 2026-02-14 |
| D-009–D-013 | Align validation + tooling decisions | 2026-02-14 |
| D-014–D-015 | Define validation decisions | 2026-02-15 |
| D-016 | Search and compare as functional POST endpoints | 2026-02-15 |
| D-017 | Compatibility check returns 201 Created | 2026-02-15 |
| D-018 | Sub-resource paths for product relationships | 2026-02-15 |
| D-019 | UUID standardization for example IDs | 2026-02-20 |
| D-020 | Added license and missing example fields | 2026-02-20 |
| D-021 | Redocly CLI adopted for OpenAPI validation | 2026-02-20 |
| D-022 | Domain-scoped ADDR folder structure | 2026-02-20 |
| D-023 | Shared API style guide | 2026-02-20 |
| D-024 | Piece-list DSL with fail-fast collision checks | 2026-02-20 |

## Important Context

- **ADDR prompts:** `design/addr-ai-prompts.md` contains the full ADDR prompt guide from launchany/addr-ai-prompts. Ralph MUST follow these prompts for each phase.
- **Domain:** Mechatronic product ecommerce — drones, motors, ESCs, flight controllers, sensors, frames, batteries, FPV gear
- **Personas:** Professional Integrator, Fleet Procurement Buyer, Casual Browser, Partner System (NO hobbyist)
- **AsyncAPI:** AsyncAPI 3.0 specs produced for all integration events (for future Event Catalog integration)
- **Integration events vs domain events:** Only state-changing events with cross-boundary relevance are published as integration events. Internal domain events stay within their bounded context.
- **3 API boundaries:** Catalog Storefront API (JS1-JS5), Component Compatibility API (JS4), Partner Catalog Syndication API (JS6)
- **Git remote:** `origin` → `https://github.com/cjjohansen/drone-web.git` (push via token auth embedded in URL)
- **Style guide:** Based on ADDR prompts — RESTful, offset pagination, RFC 9457 errors, RFC 3339 dates, UUIDs, plural nouns, functional endpoints via POST
- **Validation tooling:** `@redocly/cli lint` for OpenAPI, `@asyncapi/cli validate` for AsyncAPI

## Files to Know

| File | Purpose |
|------|---------|
| `.ralph/STATE.md` | This file — session handoff |
| `.ralph/agent/decisions.md` | Decision log (D-001 through D-024) |
| `.ralph/agent/learnings.md` | Persistent memory — mistakes and patterns (LRN-001 through LRN-018) |
| `.ralph/tasks/addr-process.md` | ADDR Catalog Storefront task tracking (complete) |
| `.ralph/tasks/addr-catalog-management.md` | ADDR Catalog Management task tracking (current) |
| `.ralph/specs/catalog-storefront.md` | Catalog Storefront product spec — what we're building |
| `design/addr-ai-prompts.md` | ADDR prompt guide (shared, from launchany) |
| `design/catalog-storefront/addr/` | Catalog Storefront ADDR deliverables (complete) |
| `design/catalog-management/addr/` | Catalog Management ADDR deliverables (current) |
| `design/style-guide.md` | API design style guide (shared across all domains) |
| `design/catalog-storefront/addr/align/event-storming.drawio` | Big Picture Event Storming diagram |
| `.cursor/rules/ralph-loop.mdc` | Cursor rule — Ralph Loop session management |
| `.cursor/rules/addr-process.mdc` | Cursor rule — ADDR methodology conventions |
| `.cursor/rules/git-conventions.mdc` | Cursor rule — Git auth and branching |
| `.cursor/skills/event-storming/SKILL.md` | Event Storming domain knowledge skill |
| `.cursor/skills/event-storming-drawio/SKILL.md` | Event Storming draw.io generation skill |
| `.cursor/skills/legacy-system-2-eventmodel/SKILL.md` | Event Modeling skill — generate Event Model JSON |
