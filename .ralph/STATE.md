# Ralph Loop State

> This file is the handoff document between chat/agent sessions.
> The agent MUST read this file at the start of every new session.
> The agent MUST update this file before ending a session or when significant progress is made.

## Project

**Name:** Drone Web — Catalog Storefront API Design
**Repo:** drone-web (`/mnt/c/dev/repos/drone-web`)
**Branch:** `addr-design-phase-2`
**Goal:** Design a Catalog Storefront API for a mechatronic/drone ecommerce platform using the ADDR (Align-Define-Design-Refine) process by James Higginbotham

## Current Phase

**Phase:** ADDR Design — in progress (Ralph Loop autonomous run)
**Status:** Style guide created. API design tables for all 3 boundaries drafted. Validating now.
**Blockers:** None

## What Was Just Completed

### Align Phase (VALIDATED + COMMITTED)
- [x] 4 personas defined (Professional Integrator, Fleet Procurement Buyer, Casual Browser, Partner System)
- [x] 6 unifying job stories (JS1–JS6) covering full storefront experience
- [x] 23 activity steps grouped into activities (was 24 — removed pagination step)
- [x] Hobbyist Builder persona removed (D-001) — platform targets professional/enterprise
- [x] Big Picture Event Storming: 40 domain events, 4 pivotal events (was 5 — downgraded Comparison Matrix Generated)
- [x] Event Storming skills created (`.cursor/skills/event-storming/` and `.cursor/skills/event-storming-drawio/`)
- [x] **Validation completed** — 6 findings, all resolved (see `design/addr/align/validation.md`)
  - D-009: Downgraded "Comparison Matrix Generated" from pivotal
  - D-010: Filled persona matrix gaps (Casual Browser+JS1, Fleet Buyer+JS5)
  - D-011: Removed pagination as activity step
  - Enriched filter and availability descriptions
- [x] Git committed and pushed

### Define Phase (VALIDATED + COMMITTED)
- [x] 3 API boundaries identified using DDD principles
- [x] 14 resources modeled with properties and relationships
- [x] 19 API operations profiled with participants, events, characteristics
- [x] Sequence diagrams for all 6 job stories (Mermaid format)
- [x] Integration model: async event-driven, no synchronous cross-boundary calls
- [x] Distinguished integration events from internal domain events
- [x] Git committed and pushed

### Design Phase (IN PROGRESS)
- [x] Style guide created (`design/addr/design/style-guide.md`)
- [x] High-level API design table — Catalog API (14 operations)
- [x] High-level API design table — Compatibility API (2 operations)
- [x] High-level API design table — Partner Catalog API (3 operations)
- [x] Design decisions recorded (D-016, D-017, D-018)
- [ ] Validate Design artifacts
- [ ] Package Design deliverable (README) + commit + push

## What Comes Next

1. **Validate Design phase** — cross-reference against Define profiles + style guide
2. **Commit + push Design phase** on `addr-design-phase-2` branch
3. **Refine phase** — OpenAPI 3.1 specs, AsyncAPI 3.0 specs (for integration events), README examples, Mermaid diagrams, Postman collections

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

## Important Context

- **ADDR prompts:** `design/addr/addr-ai-prompts.md` contains the full ADDR prompt guide from launchany/addr-ai-prompts. Ralph MUST follow these prompts for each phase.
- **Domain:** Mechatronic product ecommerce — drones, motors, ESCs, flight controllers, sensors, frames, batteries, FPV gear
- **Personas:** Professional Integrator, Fleet Procurement Buyer, Casual Browser, Partner System (NO hobbyist)
- **AsyncAPI:** Refine phase will produce AsyncAPI 3.0 specs for all integration events (for future Event Catalog integration)
- **Integration events vs domain events:** Only state-changing events with cross-boundary relevance are published as integration events. Internal domain events stay within their bounded context.
- **3 API boundaries:** Catalog Storefront API (JS1-JS5), Component Compatibility API (JS4), Partner Catalog Syndication API (JS6)
- **Git remote:** `origin` → `https://github.com/cjjohansen/drone-web.git` (push via token auth)
- **Style guide:** Based on ADDR prompts — RESTful, offset pagination, RFC 9457 errors, RFC 3339 dates, UUIDs, plural nouns, functional endpoints via POST

## Files to Know

| File | Purpose |
|------|---------|
| `.ralph/STATE.md` | This file — session handoff |
| `.ralph/agent/decisions.md` | Decision log (D-001 through D-015+) |
| `.ralph/agent/learnings.md` | Persistent memory — mistakes and patterns |
| `.ralph/tasks/addr-process.md` | ADDR phase task tracking |
| `.ralph/specs/catalog-storefront.md` | Catalog Storefront product spec — what we're building |
| `design/addr/addr-ai-prompts.md` | ADDR prompt guide (from launchany) |
| `design/addr/design/style-guide.md` | API design style guide |
| `design/addr/design/api-design.md` | High-level API design tables (all 3 boundaries) |
| `design/addr/align/` | Align phase deliverables |
| `design/addr/define/` | Define phase deliverables |
| `design/addr/design/` | Design phase deliverables (in progress) |
| `design/addr/align/event-storming.drawio` | Big Picture Event Storming diagram (organic Brandolini layout with split patterns) |
| `.cursor/skills/event-storming/SKILL.md` | Event Storming domain knowledge skill |
| `.cursor/skills/event-storming-drawio/SKILL.md` | Event Storming draw.io generation skill |
| `.cursor/skills/event-storming-drawio/_drawio-engine.js` | Reusable Node.js engine for programmatic drawio generation |
| `design/addr/align/big-picture-event-storming.drawio` | Reference layout file (user's hand-crafted organic Brandolini layout) |
