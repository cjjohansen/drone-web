# Define Phase — Validation Report

> **Phase:** ADDR — Define
> **Validated:** 2026-02-15
> **Status:** All findings resolved

---

## Validation Approach

Cross-referenced all Define phase artifacts against:

1. **ADDR AI Prompts** ([launchany/addr-ai-prompts](https://github.com/launchany/addr-ai-prompts)) — the Define phase prompt checklist
2. **Principles of Web API Design** (James Higginbotham, Chapters 6–7) — methodology context for boundaries, resources, API profiles
3. **Align phase artifacts** — event storming, activity steps, personas for completeness checks

### Artifacts Validated

| Artifact | File | Result |
|----------|------|--------|
| API Boundaries | `boundaries.md` | Pass |
| API Resources | `resources.md` | Pass (after fix) |
| API Profiles | `api-profiles.md` | Pass (after fix) |
| Sequence Diagrams | `sequence-diagrams.md` | Pass |

---

## ADDR Prompt Checklist

| Requirement | Status |
|-------------|--------|
| Boundaries table (Name, Description, Job Stories) | Pass |
| Boundary rationale using DDD principles (Vernon) | Pass |
| Integration model (events published/consumed, ACL, async) | Pass |
| Pitfalls to avoid | Pass |
| Boundary consolidation assessment | Pass |
| API resources with properties and relationships | Pass (after F-002) |
| API profiles with all required columns | Pass (after F-004) |
| Emitted events for state-changing operations | Pass |
| Sequence diagrams for each job story (Mermaid) | Pass |
| No HTTP details (implementation-agnostic) | Pass |
| Business language, consumer-oriented | Pass |

### Activity Step Coverage

All 23 activity steps from the Align phase map to at least one API operation. No gaps found.

---

## Findings and Resolutions

### F-001: Query events are analytics, not domain events (dropped)

**Category:** Dropped during review
**Source:** ADDR prompts — "Emitted Events includes one or two events..."

**Issue:** Initially flagged that Catalog API safe operations lacked emitted events. However, read operations don't change domain state. Tracking query patterns (Catalog Searched, Product Details Viewed) is an analytics/telemetry concern — a separate domain, not something to embed in the storefront API profile.

**Resolution:** Dropped. The event storming already classifies these as "Query Events (observational)" separate from "Command Events (state-changing)." Emitted events in API profiles correctly reflect only state-changing domain events.

---

### F-002: Clarify value-object resource relationships

**Category:** Suggested (consistency)
**Source:** ADDR prompts — resource definitions should include relationships.

**Issue:** SearchResult, Suggestion, and ComparisonMatrix lacked "Relationships" annotations, while all other resources had them. These are computed/transient resources that don't own state but reference other resources.

**Resolution:** Added `Computed resource — references Products` (and Categories for Suggestion) to each.

---

### F-003: Standardize event naming convention (deferred to Refine)

**Category:** Noted — deferred
**Source:** Cross-referencing event storming with API profiles and boundaries.

**Issue:** Three different naming styles exist:
- Event storming: "Product Added to Catalog" (prose)
- boundaries.md: "Product.Created" (dot notation)
- api-profiles.md: "CompatibilityCheck.Completed" (dot notation)

Prose names are appropriate for event storming (workshop artifact). Dot notation is appropriate for API profiles (technical artifact). Both are valid in their context.

**Resolution:** Deferred to Refine phase. The AsyncAPI 3.0 specs will establish canonical event names that bridge both conventions. Added as open question OQ-007.

---

### F-004: Remove "Partner" from Catalog API participant lists

**Category:** Suggested (boundary integrity)
**Source:** Cross-referencing api-profiles.md with boundaries.md (D-007).

**Issue:** Four Catalog API operations listed "Customer, Partner" as participants: `searchProducts`, `getProduct`, `getProductPricing`, `getProductAvailability`. But the Partner Catalog API (D-007) was created specifically so partners use dedicated bulk endpoints with different SLAs, rate limits, and data projections. Listing Partner on both APIs contradicts the boundary separation.

**Resolution:** Removed "Partner" from the four Catalog API operations. Partners access data exclusively through the Partner Catalog API.

---

## Summary

| Category | Count | Action |
|----------|-------|--------|
| Dropped (not applicable) | 1 | F-001 — query events are analytics |
| Suggested (consistency) | 1 | F-002 — applied |
| Noted (deferred) | 1 | F-003 — deferred to Refine |
| Suggested (boundary integrity) | 1 | F-004 — applied |
| **Total** | **4** | **2 applied, 1 dropped, 1 deferred** |
