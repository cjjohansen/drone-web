# Ralph Loop State

> This file is the handoff document between chat/agent sessions.
> The agent MUST read this file at the start of every new session.
> The agent MUST update this file before ending a session or when significant progress is made.

## Project

**Name:** Drone Web — Catalog Storefront API Design
**Repo:** drone-web (`/mnt/c/dev/repos/drone-web`)
**Branch:** `main`
**Goal:** Design a Catalog Storefront API for a mechatronic/drone ecommerce platform using the ADDR (Align-Define-Design-Refine) process by James Higginbotham

## Current Phase

**Phase:** ADDR Define — validated, ready to commit
**Status:** Define validated (4 findings: 2 applied, 1 dropped, 1 deferred). Ready for git commit + push on addr-define-phase branch.
**Blockers:** None

## What Was Just Completed

### Align Phase (VALIDATED)
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

### Define Phase (VALIDATED)
- [x] 3 API boundaries identified using DDD principles
- [x] 14 resources modeled with properties and relationships
- [x] 19 API operations profiled with participants, events, characteristics
- [x] Sequence diagrams for all 6 job stories (Mermaid format)
- [x] Integration model: async event-driven, no synchronous cross-boundary calls

## What Comes Next

1. **Git commit + push** Define phase (addr-define-phase branch)
3. **Design phase** — HTTP methods, resource paths, style guidelines, high-level API design tables
4. **Refine phase** — OpenAPI 3.1 specs, AsyncAPI 3.0 specs (for Event Catalog), README examples, Mermaid diagrams, Postman collections

## Key Decisions

| ID | Decision | Date |
|----|----------|------|
| D-001–D-004 | Align phase decisions (see agent/decisions.md) | 2026-02-14 |
| D-005–D-008 | Define phase decisions (see agent/decisions.md) | 2026-02-14 |

## Important Context

- **ADDR prompts:** `design/addr/addr-ai-prompts.md` contains the full ADDR prompt guide from launchany/addr-ai-prompts. Ralph MUST follow these prompts for each phase.
- **Domain:** Mechatronic product ecommerce — drones, motors, ESCs, flight controllers, sensors, frames, batteries, FPV gear
- **Personas:** Professional Integrator, Fleet Procurement Buyer, Casual Browser, Partner System (NO hobbyist)
- **AsyncAPI:** Refine phase will produce AsyncAPI 3.0 specs for all domain events (for future Event Catalog integration)
- **3 API boundaries:** Catalog Storefront API (JS1-JS5), Component Compatibility API (JS4), Partner Catalog Syndication API (JS6)
- **Git remote:** `origin` → `https://github.com/cjjohansen/drone-web.git` (push via token auth)

## Files to Know

| File | Purpose |
|------|---------|
| `.ralph/STATE.md` | This file — session handoff |
| `.ralph/agent/decisions.md` | Decision log (D-001 through D-008) |
| `.ralph/agent/learnings.md` | Persistent memory — mistakes and patterns |
| `.ralph/tasks/addr-process.md` | ADDR phase task tracking |
| `.ralph/specs/catalog-storefront.md` | Catalog Storefront product spec — what we're building |
| `design/addr/addr-ai-prompts.md` | ADDR prompt guide (from launchany) |
| `design/addr/align/README.md` | Align phase overview |
| `design/addr/align/personas.md` | 4 personas with job story mapping |
| `design/addr/align/job-stories.md` | 6 unifying job stories |
| `design/addr/align/activity-steps.md` | 23 activity steps |
| `design/addr/align/validation.md` | Align phase validation report |
| `design/addr/define/README.md` | Define phase overview |
| `design/addr/define/boundaries.md` | 3 API boundaries with DDD rationale |
| `design/addr/define/resources.md` | 14 resources with properties |
| `design/addr/define/api-profiles.md` | 19 operations with events and characteristics |
| `design/addr/define/sequence-diagrams.md` | Mermaid diagrams for all 6 job stories |
| `design/addr/align/event-storming.drawio` | Big Picture Event Storming diagram (organic Brandolini layout with split patterns) |
| `.cursor/skills/event-storming/SKILL.md` | Event Storming domain knowledge skill |
| `.cursor/skills/event-storming-drawio/SKILL.md` | Event Storming draw.io generation skill |
| `.cursor/skills/event-storming-drawio/_drawio-engine.js` | Reusable Node.js engine for programmatic drawio generation |
| `design/addr/align/big-picture-event-storming.drawio` | Reference layout file (user's hand-crafted organic Brandolini layout) |
