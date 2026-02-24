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
