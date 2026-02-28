# ADDR Decision Log

> Tracks key decisions, rationale, and open questions across all ADDR phases.

---

## Align Phase Decisions

### D-001: Removed Hobbyist Builder persona
**Date:** 2026-02-14
**Decision:** Removed the Hobbyist Builder persona to focus on professional/enterprise use cases.
**Rationale:** The platform targets professional integrators, fleet procurement buyers, and partner systems. Hobbyist needs (community reviews, hobby projects) would dilute the focus. The Professional Integrator persona absorbs the technical browsing and discovery needs.

### D-002: Added Fleet Procurement Buyer persona
**Date:** 2026-02-14
**Decision:** Added a Fleet Procurement Buyer persona representing government agencies, defense organizations, and large enterprises purchasing at scale.
**Rationale:** Fleet-scale procurement has distinct context — formal processes, compliance documentation, volume pricing, standardized configurations — that differs from individual professional integrators.

### D-003: Kept Casual Browser persona
**Date:** 2026-02-14
**Decision:** Retained the Casual Browser persona for users exploring without a specific project.
**Rationale:** Even in a professional platform, new visitors and researchers need to browse and discover. This persona ensures the category browsing (JS5) and product evaluation (JS2) flows remain accessible.

### D-004: 6 unifying job stories cover the full storefront
**Date:** 2026-02-14
**Decision:** JS1 (Discovery), JS2 (Evaluation), JS3 (Comparison), JS4 (Compatibility), JS5 (Browsing), JS6 (Partner Access).
**Rationale:** These 6 stories cover the complete catalog storefront experience from search to partner syndication. Broad enough to be unifying, specific enough to drive activity steps.

---

## Define Phase Decisions

### D-005: Three API boundaries identified
**Date:** 2026-02-14
**Decision:** Catalog Storefront API, Component Compatibility API, Partner Catalog Syndication API.
**Rationale:** Applied DDD bounded context principles. Each boundary has distinct language, invariants, participants, and scaling needs. No synchronous cross-boundary calls required. Integration via async domain events.

### D-006: Compatibility as a separate boundary
**Date:** 2026-02-14
**Decision:** Separated compatibility checking from the main Catalog API.
**Rationale:** Compatibility has distinct language ("validate," "mismatch," "replacement"), cross-product invariants (not a property of a single product), and independent lifecycle (new rules without catalog changes). It reads product specs from a local cache updated via events.

### D-007: Partner API as a separate boundary
**Date:** 2026-02-14
**Decision:** Separated partner catalog access from the storefront Catalog API.
**Rationale:** Partners have different consumption patterns (bulk/batch vs. interactive), different SLAs and rate limits, machine consumers vs. human, and a simplified data projection. Isolating partner load protects storefront performance.

### D-008: AsyncAPI specs for domain events
**Date:** 2026-02-14
**Decision:** The Refine phase will produce AsyncAPI 3.0 specs alongside OpenAPI specs for all emitted domain events.
**Rationale:** Domain events are first-class integration artifacts. AsyncAPI specs will feed into Event Catalog for event discovery and governance across boundaries.

---

## Align Phase Validation Decisions

### D-009: Downgraded "Comparison Matrix Generated" from pivotal
**Date:** 2026-02-14
**Decision:** Removed pivotal status from "Comparison Matrix Generated" event. Pivotal events reduced from 5 to 4.
**Rationale:** Fails key pivotal event heuristics — no cascading cross-boundary impact, no policies depend on it, comparison state is ephemeral. Better understood as an evaluation step, not a phase transition. Validated against Brandolini methodology and event storming skill.

### D-010: Filled persona-job story matrix gaps
**Date:** 2026-02-14
**Decision:** Added JS1 (Product Discovery) to Casual Browser and JS5 (Catalog Browsing) to Fleet Procurement Buyer.
**Rationale:** Casual browsers do search the catalog (it's often their entry point). Fleet procurement officers browse categories when evaluating new suppliers. Both mappings were missing from the matrix.

### D-011: Removed "Page through results" activity step
**Date:** 2026-02-14
**Decision:** Removed pagination as a distinct activity step. Activity steps reduced from 24 to 23.
**Rationale:** Pagination is an API-level concern (cursor/offset), not a meaningful user goal. No user says "I want to page through results." Pagination will be addressed as an API design detail in the Design phase. Per Higginbotham Ch 5 — activity steps represent user intent, not implementation.

---

## Align Phase — Event Storming Tooling

### D-012: Reusable draw.io generation engine
**Date:** 2026-02-14
**Decision:** Created `_drawio-engine.js` as a reusable Node.js module for programmatic draw.io generation. Stored in `.cursor/skills/event-storming-drawio/`.
**Rationale:** Generating draw.io diagrams required iterative refinement. Rewriting ~200 lines of boilerplate (styles, helpers, XML wrapping) each iteration was wasteful. A persistent engine module encapsulates all shared logic; temporary `_gen_*.js` scripts only define layout data and are deleted after use.

### D-013: Consolidated event-storming drawio versions
**Date:** 2026-02-14
**Decision:** Deleted all intermediate versions (1-4, plus copies). Renamed `event-storming-5.drawio` to `event-storming.drawio`. Moved engine to skills folder. Deleted all temporary scripts (`_gen_es5.js`, `_fix_legend2.js`).
**Rationale:** Only the latest refined diagram matters. Intermediate versions were iterative experiments. The reference file `big-picture-event-storming.drawio` is kept as the user's hand-crafted layout target.

---

## Define Phase Validation Decisions

### D-014: Query events are analytics, not domain events
**Date:** 2026-02-15
**Decision:** Read/query operations in the Catalog API do not emit domain events. Tracking query patterns (Catalog Searched, Product Details Viewed) is an analytics/telemetry concern belonging to a separate domain.
**Rationale:** Domain events represent state changes that other bounded contexts need to react to. Read operations don't change state. The event storming already classified these as "Query Events (observational)" vs "Command Events (state-changing)."

### D-015: Partners use only the Partner Catalog API
**Date:** 2026-02-15
**Decision:** Removed "Partner" from Catalog API participant lists. Partners access data exclusively through the Partner Catalog Syndication API.
**Rationale:** The Partner Catalog API (D-007) exists specifically for different consumption patterns (bulk/batch), different SLAs, and data projections. Listing Partner on both APIs contradicted the boundary separation.

---

## Design Phase Decisions

### D-016: Search and compare as functional POST endpoints
**Date:** 2026-02-15
**Decision:** `searchProducts()`, `getAutocompleteSuggestions()`, `compareProducts()`, `getBatchAvailability()`, and `getBatchPricing()` use `POST` despite being read operations.
**Rationale:** Per style guide rule 3 — functional endpoints that accept complex filter objects or lists of identifiers in the body must use `POST`. Search queries may contain PII (per security rule 9). Batch operations send arrays of UUIDs that exceed practical URL length limits.

### D-017: Compatibility check returns 201 Created
**Date:** 2026-02-15
**Decision:** `checkCompatibility()` returns `201 Created` with the full CompatibilityCheck resource.
**Rationale:** A compatibility check creates a new resource (the check result with a `checkId`). The check is unsafe (it creates state) and the result is addressable for subsequent replacement lookups.

### D-018: Sub-resource paths for product relationships
**Date:** 2026-02-15
**Decision:** Pricing, availability, reviews, documents, compatible products, similar products, and frequently-bought-together are sub-resources under `/products/{productId}/`.
**Rationale:** These are naturally subordinate to a product. Sub-resource paths make the hierarchy explicit and allow independent caching, pagination, and access control per concern.

---

## Refine Phase Decisions

### D-019: UUID standardization for example IDs
**Date:** 2026-02-20
**Decision:** Replaced human-readable example IDs (`prod-001`, `rev-001`, `doc-001`, etc.) with valid UUID v4 values across all OpenAPI, AsyncAPI, Postman, and documentation artifacts. Kept `categoryId` as human-readable slugs and `feedId` as composite strings.
**Rationale:** Redocly CLI linting flagged 15+ warnings because example values didn't conform to the `format: uuid` declared in schemas. The UUID/string split follows a natural boundary: system-generated opaque identifiers use UUIDs, admin-curated or composite identifiers remain human-readable strings. 166 replacements across 8 files.

### D-020: Added license and missing example fields
**Date:** 2026-02-20
**Decision:** Added `license: { name: Proprietary }` to all 3 OpenAPI specs. Added missing `productId` fields to nested pricing, availability, review, and document examples. Added `400` response to `getCategoryTree`.
**Rationale:** Resolved all remaining Redocly recommended-ruleset warnings. All 3 OpenAPI specs now pass with zero warnings.

### D-021: Redocly CLI adopted for OpenAPI validation
**Date:** 2026-02-20
**Decision:** Adopted `@redocly/cli` as the primary OpenAPI linter, replacing `swagger-cli validate`.
**Rationale:** Redocly provides deeper linting (300+ rules including example validation, security best practices, and style enforcement) compared to swagger-cli's basic schema validation. swagger-cli missed 19 warnings that Redocly caught.

---

## Folder Structure Decisions

### D-022: Domain-scoped ADDR folder structure
**Date:** 2026-02-20
**Decision:** Restructured `design/addr/` into domain-specific folders: `design/catalog-storefront/addr/` and `design/catalog-management/addr/`. Promoted `addr-ai-prompts.md` to `design/` as a shared methodology reference.
**Rationale:** With multiple ADDR runs (storefront read side, admin write side), artifacts would collide in a flat `design/addr/` structure (duplicate filenames like `personas.md`, `validation.md`). Each domain gets its own folder with `addr/` inside containing the 4 phase folders, keeping the methodology explicit while isolating each run's deliverables. The shared prompts file sits at `design/` level since it's used across all runs.

### D-023: Shared API style guide
**Date:** 2026-02-20
**Decision:** Promoted `style-guide.md` from `design/catalog-storefront/addr/design/` to `design/style-guide.md` as a shared, platform-wide style guide.
**Rationale:** The style guide contains platform-level conventions (URL structure, pagination, error handling, data formatting, security) that must be consistent across all API boundaries. Allowing per-domain copies would risk drift. The admin ADDR Design phase will extend the shared guide with write-side patterns (idempotency, optimistic concurrency, bulk operations) rather than forking it.

---

## Railway DrawIO Decisions

### D-024: Piece-list DSL with fail-fast collision checks
**Date:** 2026-02-20
**Decision:** Added a reusable piece-list DSL to `.cursor/skills/railway-drawio/_railway-engine.js`:
- `dsl(x, y, heading).add(...).build(options)`
- `buildTrackFromList(x, y, heading, pieces, options)`
Both validate collision constraints after each piece placement and throw on illegal layouts.
**Rationale:** Users requested a LEGO-like workflow where tracks are laid in sequence from a known start pose and each placement can be accepted/rejected immediately as legal/illegal. A list DSL makes layouts declarative and reusable, while fail-fast collision checks enforce geometric validity during construction.

---

## Catalog Management v2 Decisions

### D-025: Preserve v1 run and temporarily defer Event Storming in sibling v2 Align
**Date:** 2026-02-25
**Decision:** Keep `design/catalog-management/addr/` as the baseline historical run and create a new sibling run at `design/catalog-management-v2/addr/` for revised work. For v2 Align, temporarily defer Event Storming and use a boundary-first decomposition (`boundary-map.md`) plus explicit EventModel slice mapping (`eventmodel-mapping.md`).
**Rationale:** Preserving v1 avoids loss of context and supports auditability/comparison. Temporary deferral allows progress while Event Storming approach/tooling matures; Event Storming remains the intended long-term Align artifact and will be reintroduced when mature.

### D-026: `STATE.md` tracks exactly one active plan
**Date:** 2026-02-25
**Decision:** Treat `.ralph/STATE.md` as a single-agent handoff document that tracks one active plan at a time. Historical or parallel initiatives are listed as baseline/reference only unless an explicit manager/coordinator layer is introduced.
**Rationale:** Single-plan tracking reduces ambiguity, avoids conflicting "current" directives, and keeps handoff context crisp for the next session.

### D-027: Split Product Lifecycle, Documentation, and Category Management in v2 Align
**Date:** 2026-02-25
**Decision:** In Catalog Management v2 Align, explicitly separate Product Lifecycle Management, Technical Documentation Management, and Category/Faceting Management into distinct boundaries, with additional explicit boundaries for Catalog Governance Workflow and Bulk Ingestion.
**Rationale:** Each area has distinct invariants, ownership, and change cadence. Explicit separation improves API boundary definition and creates a cleaner mapping to EventModel slice types.

### D-028: Close Align v2 using boundary-first artifacts and move to Define
**Date:** 2026-02-25
**Decision:** Accept the Align v2 deliverable set in `design/catalog-management-v2/addr/align/` (`README.md`, `personas.md`, `job-stories.md`, `activity-steps.md`, `boundary-map.md`, `eventmodel-mapping.md`, `validation.md`) as complete and transition the active plan to Define.
**Rationale:** The artifacts provide sufficient boundary clarity, command/state-change mapping, and validation coverage to proceed into API boundary profiling without blocking on Event Storming maturity.

### D-029: Keep Governance and Bulk Ingestion as explicit Define boundaries in v2
**Date:** 2026-02-25
**Decision:** In Catalog Management v2 Define, retain `Catalog Governance API` and `Bulk Ingestion API` as explicit first-class boundaries instead of merging them into Product Lifecycle or domain-specific admin APIs.
**Rationale:** Governance and ingestion both carry distinct invariants and reliability requirements (approval policy consistency, batch replay/idempotency, operational scaling) that would be diluted and duplicated if embedded in other boundaries. Keeping them explicit improves autonomy, auditability, and clearer event contracts to read-side consumers.

### D-030: Standardize write-side command reliability conventions in shared style guide
**Date:** 2026-02-25
**Decision:** Extend `design/style-guide.md` with write-side conventions requiring `Idempotency-Key` on retry-prone command POST operations, `If-Match` for optimistic concurrency on mutable resources, and `202 Accepted` for asynchronous command submissions with trackable job/request resources.
**Rationale:** Catalog Management v2 is command-heavy with long-running and retry-prone operations (repricing, ingestion replay, lifecycle and governance transitions). A shared reliability contract reduces duplicate per-API decisions and keeps behavior consistent across all write-side boundaries.

### D-031: Refine v2 packaging uses per-boundary OpenAPI specs and a consolidated admin Postman collection
**Date:** 2026-02-26
**Decision:** For Catalog Management v2 Refine, generate one OpenAPI 3.1 file per write-side boundary (8 files total), one AsyncAPI 3.0 integration-event contract, and a single consolidated Postman collection grouped by boundary.
**Rationale:** Per-boundary OpenAPI files preserve bounded-context ownership and make validation/debugging localized, while one consolidated Postman collection simplifies exploratory testing across cross-boundary admin workflows.

### D-032: Add a dedicated ADDR-to-EventModel skill and derive slice inventory from artifacts
**Date:** 2026-02-26
**Decision:** Added `.cursor/skills/addr-2-eventmodel/SKILL.md` and made ADDR artifacts (`align/*`, `define/api-profiles.md`, `design/api-design.md`, `refine/*-api.yaml`) the source of truth for EventModel generation. Slice counts are derived from operation classification during generation, not hardcoded.
**Rationale:** The legacy-system EventModel skill is code-first and does not align with this ADDR-first workflow. A dedicated skill prevents mixing integration transport contracts with domain event modeling and keeps generation reproducible from design artifacts.

### D-033: Use split EventModel topology for write-side flows (STATE_CHANGE then STATE_VIEW)
**Date:** 2026-02-26
**Decision:** For Catalog Management v2 EventModel, represent each mutating operation as a `STATE_CHANGE` slice containing command+event only, followed by a separate `STATE_VIEW` slice for event-derived read model projection.
**Rationale:** Split topology better matches Event Modeling semantics for event-to-projection flow and improves interoperability with visualization/import tools that expect state changes and views as distinct slices.

---

## Ralph Loop / JTBD Drone Web Decisions

### D-034: Switch single active plan to JTBD Drone Web
**Date:** 2026-02-26
**Decision:** Set the active Ralph Loop workstream to JTBD Drone Web and retargeting for Drone Web, tracked in `.ralph/tasks/jtbd-droneweb.md` and `.ralph/specs/jtbd-droneweb.md`. Treat Catalog Management v2 work as baseline/reference until explicitly re-activated.
**Rationale:** Ralph governance requires exactly one active plan in `STATE.md`. The current user directive prioritizes anonymized JTBD deliverables and mapping quality over further ADDR/EventModel progression.

### D-035: Use realistic pseudonyms instead of generic persona labels
**Date:** 2026-02-26
**Decision:** Replace direct personal names with stable placeholder tokens and mapped pseudonyms using the canonical dictionary (for example, `source-persona-name` -> `mapped-persona-name`) rather than ad hoc labels.
**Rationale:** Placeholder-token mapping preserves anonymity, traceability, and consistency across all artifacts while avoiding exposure of source case identifiers.

### D-036: Include producer-informed domain enrichment in mapping design
**Date:** 2026-02-26
**Decision:** Extend mapping work beyond strict anonymization to include generic producer-informed terminology (portfolio, business unit, product family, and related catalog/ERP concepts) expressed through source placeholders (for example, `source-portfolio-name`).
**Rationale:** Enrichment improves cross-domain reuse while placeholder tokens prevent leaking source-case specifics.

---

## Open Questions

| ID | Phase | Question | Status |
|----|-------|----------|--------|
| OQ-001 | Align | Should "Save to Wishlist" be part of the storefront or account/cart domain? | Open |
| OQ-002 | Align | Should "Recently Viewed" be API-driven or client-side only? | Open |
| OQ-003 | Align | Are partner feeds in scope for the storefront API or a separate syndication API? | Resolved → D-007 |
| OQ-004 | Define | Should compatibility rules be managed via admin API or config files? | Open |
| OQ-005 | Define | Should Partner Catalog API support webhooks for catalog changes? | Open |
| OQ-006 | Define | Should product reviews support helpfulness voting in this scope? | Open |
| OQ-007 | Refine | Standardize event naming: prose (event storming) vs dot notation (API profiles/AsyncAPI) | Open |
