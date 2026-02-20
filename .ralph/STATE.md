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

**Phase:** ADDR Refine — re-validated with Redocly CLI, ready to commit
**Status:** All 4 ADDR phases complete. Refine artifacts re-validated with `@redocly/cli lint` (zero warnings). UUID standardization applied (D-019). Cursor rules and Event Modeling skill created.
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

### Design Phase (VALIDATED + COMMITTED)
- [x] Style guide created (`design/addr/design/style-guide.md`)
- [x] High-level API design table — Catalog API (14 operations)
- [x] High-level API design table — Compatibility API (2 operations)
- [x] High-level API design table — Partner Catalog API (3 operations)
- [x] Design decisions recorded (D-016, D-017, D-018)
- [x] Validate Design artifacts — all 19 ops covered, style guide compliant
- [x] Package Design deliverable + commit + push

### Refine Phase (RE-VALIDATED WITH REDOCLY)
- [x] OpenAPI 3.1 spec — Catalog Storefront API (14 operations, validated)
- [x] OpenAPI 3.1 spec — Component Compatibility API (2 operations, validated)
- [x] OpenAPI 3.1 spec — Partner Catalog Syndication API (3 operations, validated)
- [x] AsyncAPI 3.0 spec — 7 integration events (validated)
- [x] README request/response examples for all 6 job stories
- [x] Mermaid sequence diagrams with HTTP methods and status codes
- [x] Postman collections for all 3 APIs
- [x] Validation report — all specs pass CLI validation
- [x] **Redocly re-validation** — 19 warnings found and resolved (D-019, D-020, D-021)
- [x] UUID standardization — 166 replacements across 8 files (D-019)
- [x] Added license metadata + missing required fields in examples (D-020)
- [x] Installed `@redocly/cli` for ongoing validation (D-021)
- [x] Cursor rules created (ralph-loop, addr-process, git-conventions)
- [x] Event Modeling skill created (`legacy-system-2-eventmodel`)
- [ ] Git commit + push Refine phase

## What Comes Next

1. **Commit + push Refine phase** on `addr-design-phase-2` branch
2. **ADDR Catalog Storefront complete** — all 4 phases done
3. **ADDR Catalog Administration** — 2nd ADDR run for the write side (commands, approval workflows, pricing rules). Produces Event Model with rich STATE_CHANGE + AUTOMATION slices.
4. **Event Modeling** — generate Event Model JSON from specs using `legacy-system-2-eventmodel` skill

## Key Decisions

See `.ralph/agent/decisions.md` for all decisions (D-001 through D-021).

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
| `design/addr/design/` | Design phase deliverables |
| `design/addr/refine/` | Refine phase deliverables (OpenAPI, AsyncAPI, Postman, examples) |
| `design/addr/align/event-storming.drawio` | Big Picture Event Storming diagram (organic Brandolini layout with split patterns) |
| `.cursor/skills/event-storming/SKILL.md` | Event Storming domain knowledge skill |
| `.cursor/skills/event-storming-drawio/SKILL.md` | Event Storming draw.io generation skill |
| `.cursor/skills/event-storming-drawio/_drawio-engine.js` | Reusable Node.js engine for programmatic drawio generation |
| `design/addr/align/big-picture-event-storming.drawio` | Reference layout file (user's hand-crafted organic Brandolini layout) |
| `.cursor/rules/ralph-loop.mdc` | Cursor rule — Ralph Loop session management and back pressure checks |
| `.cursor/rules/addr-process.mdc` | Cursor rule — ADDR methodology conventions |
| `.cursor/skills/legacy-system-2-eventmodel/SKILL.md` | Event Modeling skill — generate Event Model JSON from system analysis |
