# Ralph Loop State

> This file is the handoff document between chat/agent sessions.
> The agent MUST read this file at the start of every new session.
> The agent MUST update this file before ending a session or when significant progress is made.

## Project

**Name:** Drone Web — Catalog Storefront API Design
**Repo:** drone-web (`c:\dev\repos\drone-web`)
**Branch:** `addr-catalog-management` (current branch; v2 artifacts are active workstream)
**Goal:** Design APIs for a mechatronic/drone ecommerce platform using the ADDR (Align-Define-Design-Refine) process by James Higginbotham

## Current Phase

**Phase:** ADDR Catalog Management v2 — Post-ADDR wrap-up (local only)
**Status:** Define v2, Design v2, Refine v2, and post-ADDR EventModel outputs are complete and validated under `design/catalog-management-v2/addr/{define,design,refine}/` and `design/catalog-management-v2/eventmodel/`. EventModel was regenerated from ADDR artifacts using the new ADDR-native skill, enriched with detailed GWT, then reshaped to split `STATE_CHANGE` and `STATE_VIEW` slices. Push remains intentionally deferred.
**Blockers:** None

## What Was Just Completed (this session)

- [x] Added ADDR-native EventModel skill at `.cursor/skills/addr-2-eventmodel/SKILL.md`
- [x] Regenerated `design/catalog-management-v2/eventmodel/config.json` and `high-level-analysis.json` from ADDR artifacts (`align/*`, `define/api-profiles.md`, `design/api-design.md`, `refine/*-api.yaml`) with operation-derived inventory
- [x] Enriched all 39 `STATE_CHANGE` slices with more detailed GIVEN/WHEN/THEN (authorization context, mutation preconditions, request/response contract references)
- [x] Backed up the prior EventModel run as:
  - `design/catalog-management-v2/eventmodel/config.backup-2026-02-26.json`
  - `design/catalog-management-v2/eventmodel/high-level-analysis.backup-2026-02-26.json`
- [x] Restructured EventModel topology to split slices for tooling compatibility:
  - 39 `STATE_CHANGE` slices (command + domain event)
  - 39 `STATE_VIEW` slices (event-derived read models)
- [x] Validated final `config.json` against `.cursor/skills/legacy-system-2-eventmodel/schema.json` (`ajv-cli` pass)

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

1. **Verify downstream import/render behavior** (Miro tooling) on the split-slice EventModel and adjust edge directionality only if required by importer behavior
2. **Run a final end-to-end local review** across ADDR + EventModel artifacts for naming and consistency polish
3. **Finalize local commit hygiene** so the branch is ready for a later push/PR window
4. **Wait for explicit approval** before any push or PR actions

## Decision Source

All formal decisions are recorded only in `.ralph/agent/decisions.md`.

## Important Context

- **ADDR prompts:** `design/addr-ai-prompts.md` contains the full ADDR prompt guide from launchany/addr-ai-prompts. Ralph MUST follow these prompts for each phase.
- **Domain:** Mechatronic product ecommerce — drones, motors, ESCs, flight controllers, sensors, frames, batteries, FPV gear
- **Personas:** Professional Integrator, Fleet Procurement Buyer, Casual Browser, Partner System (NO hobbyist)
- **AsyncAPI:** AsyncAPI 3.0 specs produced for all integration events (for future Event Catalog integration)
- **Integration events vs domain events:** Only state-changing events with cross-boundary relevance are published as integration events. Internal domain events stay within their bounded context.
- **3 API boundaries:** Catalog Storefront API (JS1-JS5), Component Compatibility API (JS4), Partner Catalog Syndication API (JS6)
- **Catalog Management strategy:** Keep v1 as baseline; build v2 as sibling run with temporary Event Storming deferral in Align (`boundary-map.md` + `eventmodel-mapping.md`) before EventModel JSON generation. Reintroduce Event Storming when approach/tooling matures.
- **Git remote:** `origin` → `https://github.com/cjjohansen/drone-web.git` (push via token auth embedded in URL)
- **Style guide:** Based on ADDR prompts — RESTful, offset pagination, RFC 9457 errors, RFC 3339 dates, UUIDs, plural nouns, functional endpoints via POST
- **Validation tooling:** `@redocly/cli lint` for OpenAPI, `@asyncapi/cli validate` for AsyncAPI

## Files to Know

| File | Purpose |
|------|---------|
| `.ralph/STATE.md` | This file — session handoff |
| `.ralph/agent/decisions.md` | Decision log (D-001 through D-033) |
| `.ralph/agent/learnings.md` | Persistent memory — mistakes and patterns (LRN-001 through LRN-024) |
| `.ralph/tasks/addr-process.md` | ADDR Catalog Storefront task tracking (complete) |
| `.ralph/tasks/addr-catalog-management.md` | ADDR Catalog Management v1 task tracking (baseline preserved) |
| `.ralph/tasks/addr-catalog-management-v2.md` | ADDR Catalog Management v2 task tracking (active) |
| `.ralph/specs/catalog-storefront.md` | Catalog Storefront product spec — what we're building |
| `design/addr-ai-prompts.md` | ADDR prompt guide (shared, from launchany) |
| `design/catalog-storefront/addr/` | Catalog Storefront ADDR deliverables (complete) |
| `design/catalog-management/addr/` | Catalog Management ADDR deliverables (v1 baseline) |
| `design/catalog-management-v2/addr/` | Catalog Management ADDR deliverables (active run) |
| `design/catalog-management-v2/addr/define/` | Catalog Management v2 Define deliverables (complete, Design input) |
| `design/style-guide.md` | API design style guide (shared across all domains) |
| `design/catalog-storefront/addr/align/event-storming.drawio` | Big Picture Event Storming diagram |
| `.cursor/rules/ralph-loop.mdc` | Cursor rule — Ralph Loop session management |
| `.cursor/rules/addr-process.mdc` | Cursor rule — ADDR methodology conventions |
| `.cursor/rules/git-conventions.mdc` | Cursor rule — Git auth and branching |
| `.cursor/skills/event-storming/SKILL.md` | Event Storming domain knowledge skill |
| `.cursor/skills/event-storming-drawio/SKILL.md` | Event Storming draw.io generation skill |
| `.cursor/skills/legacy-system-2-eventmodel/SKILL.md` | Event Modeling skill — generate Event Model JSON |
| `.cursor/skills/addr-2-eventmodel/SKILL.md` | ADDR-native EventModel generation skill (artifacts-first) |
| `.cursor/skills/ralph-loop-governance/SKILL.md` | Ralph file governance skill — single-source decision logging |
