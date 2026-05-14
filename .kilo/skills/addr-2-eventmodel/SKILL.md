---
name: addr-2-eventmodel
description: Generate EventModel artifacts from ADDR phase deliverables (Align/Define/Design/Refine). Use when the user asks to create or refresh EventModel slices from ADDR artifacts, API profiles, or OpenAPI files, and when domain commands/events/read models must be derived from API operations.
---

# ADDR to EventModel

Generate EventModel artifacts from ADDR design outputs, not from legacy code inspection.

## Purpose

Use this skill to build:

- `high-level-analysis.json` from ADDR boundaries, use cases, and operations
- `config.json` with EventModel slices (STATE_CHANGE, STATE_VIEW, AUTOMATION)

This skill is the default for ADDR-driven API projects where source-of-truth files are ADDR artifacts and OpenAPI specs.

## Source Inputs (Read in this order)

For a domain folder `design/{domain}/addr/`:

1. `align/job-stories.md`
2. `align/activity-steps.md`
3. `align/boundary-map.md` (if present)
4. `align/eventmodel-mapping.md` (if present)
5. `define/api-profiles.md`
6. `design/api-design.md`
7. `refine/*-api.yaml` (all boundary OpenAPI specs)
8. `refine/integration-events.yaml` (optional cross-check only)

## Non-Negotiable Rule

Do not confuse integration events with domain events.

- **Domain events** are emitted by command-side state changes inside a bounded context and are used in EventModel STATE_CHANGE slices.
- **Integration events** are publication contracts across boundaries/channels and are only used as a consistency cross-check.

When both exist, prioritize domain events from `define/api-profiles.md` and operation semantics in OpenAPI.

## Operation Classification

Build an operation inventory per bounded context/domain:

- `STATE_CHANGE` candidates:
  - `POST`, `PUT`, `PATCH`, `DELETE` operations that mutate state
  - `POST` commands marked unsafe/idempotent in API profiles
- `STATE_VIEW` candidates:
  - `GET` operations
  - query operations explicitly marked safe in API profiles (including safe `POST` query endpoints)
- `AUTOMATION` candidates:
  - async/background processing, replay, batch processors, scheduled jobs

For each state-changing operation, create one command/event pair:

- Command title: action verb phrase from operation intent (example: "Create Product")
- Event title: past-tense business event (example: "Product Created")

## Required Output Shape

For each `STATE_CHANGE` slice:

- Exactly 1 command
- At least 1 corresponding event
- Optional screen if previous slice is `STATE_VIEW`
- Specification follows: GIVEN ..., WHEN Command, THEN Event(s)

For each `STATE_VIEW` slice:

- At least 1 read model
- Optional screen if previous slice is `STATE_CHANGE`
- Specification follows: GIVEN Event(s), THEN ReadModel(s)

For each `AUTOMATION` slice:

- 1 processor + 1 command + 1+ events
- Never connect automation directly from event to command without an intermediate state view when the model requires visibility/state projection

## Naming Conventions

- Commands: imperative verb phrases (`Create Category`, `Record Approval Decision`)
- Events: past tense (`Category Created`, `Approval Decision Recorded`)
- Read models: nouns (`Category Tree`, `Approval Case Queue`)
- Processor: process noun (`Repricing Processor`)

Use business language only. Avoid infrastructure terms.

## Generation Workflow

1. Detect target domain from `design/{domain}/addr/`.
2. Read required ADDR artifacts and all `refine/*-api.yaml`.
3. Build a per-domain operation table:
   - state-changing operations
   - view operations
4. Generate one `STATE_CHANGE` slice per state-changing operation.
5. Generate/attach `STATE_VIEW` slices representing state derived from emitted domain events.
6. Add `AUTOMATION` slices for async/batch workflows where applicable.
7. Validate dependencies and slice completeness.
8. Write:
   - `design/{domain}/eventmodel/high-level-analysis.json`
   - `design/{domain}/eventmodel/config.json`

If output files already exist, update them in-place unless the user asks for versioned output.

## Derivation Rules from ADDR Artifacts

- Prefer `define/api-profiles.md` as canonical for operation intent and emitted event names.
- Use OpenAPI operation details to refine field names and command payloads.
- Use `align/eventmodel-mapping.md` to preserve intentional slice boundaries and flow ordering.
- Use `design/api-design.md` to resolve ambiguous aggregate ownership.

## Field Lineage Rule (Required)

Maintain continuous field lineage across the flow:

- `COMMAND -> EVENT -> READMODEL -> SCREEN/AUTOMATION -> COMMAND`

Rules:

1. Preserve field names when semantics are unchanged.
2. If a field is renamed or transformed, set `mapping` on the target field to the source field name.
3. Every business field in an event must come from:
   - an inbound command field, or
   - prior state/readmodel field, or
   - a clearly generated/system field.
4. Generated/system fields (for example IDs, timestamps, correlation IDs) are allowed to appear only in downstream elements and should be marked with:
   - `generated: true` (when applicable)
   - `idAttribute: true` for identity fields
5. Read models must trace back to one or more event fields (same name or explicit `mapping`).
6. For automation loops, command input fields must map from the automation trigger/read model/event context.

Do not emit placeholder fields like only `requestId`/`eventId` when richer ADDR/OpenAPI field data exists.

## Validation Checklist

Before final output:

- [ ] Every state-changing operation has a STATE_CHANGE slice
- [ ] Each STATE_CHANGE slice has 1 command and corresponding event(s)
- [ ] Every view operation maps to STATE_VIEW slice(s)
- [ ] Dependencies reference existing IDs only
- [ ] No circular dependencies
- [ ] Slice specs follow Given/When/Then patterns
- [ ] Names remain in business terminology
- [ ] Domain events and integration events are not merged
- [ ] Field lineage is traceable end-to-end (same-name or explicit `mapping`)
- [ ] Generated/system fields are explicitly marked and not mistaken for business input
- [ ] JSON is valid and parseable

## Output Contract

`high-level-analysis.json` should include:

- domain name
- bounded contexts
- use cases
- slice candidates grouped by use case
- notes about deferred/assumed artifacts

`config.json` should include:

- ordered slices across bounded contexts
- commands/events/readmodels/screens/processors
- specifications and actors
- aggregates and dependencies

