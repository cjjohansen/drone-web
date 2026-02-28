# Catalog Management v2 — API Boundaries

> **Subdomain:** Catalog Management (write side)
> **Phase:** ADDR — Define
> **Status:** Draft

---

## Boundary Identification

Using the Align v2 boundary map, job stories, and activity steps, the following candidate admin API boundaries are identified for Define.

### Candidate Boundaries Table

| Boundary Name | Boundary Description | Job Story(s) |
|---------------|----------------------|--------------|
| **Product Lifecycle API** | Owns product master record creation, lifecycle transitions, and replacement linkage | JS1 |
| **Technical Documentation API** | Owns technical document ingestion, versioning, and product-document associations | JS2 |
| **Pricing and Promotions API** | Owns base pricing, discount tiers, promotion windows, and group repricing | JS3 |
| **Inventory and Availability API** | Owns stock quantities, lead times, backorder state, and temporary availability suspension | JS4 |
| **Category and Faceting API** | Owns taxonomy hierarchy, product-category assignments, and facet configuration | JS5 |
| **Compatibility Rules API** | Owns compatibility rule and component group lifecycle | JS6 |
| **Catalog Governance API** | Owns approval workflow for high-risk catalog changes before external visibility | JS1, JS3, JS6 |
| **Bulk Ingestion API** | Owns import batch intake, validation, replay, and result tracking for large catalog updates | JS1 |

---

## A. Recommended API / Bounded Context Boundaries

### 1. Product Lifecycle API

- **Purpose / Responsibility:** Manage product lifecycle commands from draft creation through discontinuation.
- **Core Entities / Aggregates:** Product, ProductLifecycleTransition, ProductReplacementLink
- **Key Invariants:**
  - Product must have required identity and baseline attributes before activation.
  - Lifecycle transitions must follow an allowed state machine.
  - Discontinued products cannot transition back to active without explicit reactivation policy.
- **Why separate:** Product lifecycle invariants are distinct from documentation, pricing, and inventory invariants.
- **Expected API responsibilities:** Create/update product master data, lifecycle state changes, replacement linkage.

### 2. Technical Documentation API

- **Purpose / Responsibility:** Manage technical artifacts and version chains associated to products.
- **Core Entities / Aggregates:** Document, DocumentVersion, ProductDocumentLink
- **Key Invariants:**
  - Exactly one latest active version per document lineage.
  - Retired documents are not selectable as default active artifacts.
  - Product association must reference an existing product.
- **Why separate:** Document lifecycle is independent from product lifecycle and has unique versioning rules.
- **Expected API responsibilities:** Upload/associate documents, manage metadata, publish new versions, retire artifacts.

### 3. Pricing and Promotions API

- **Purpose / Responsibility:** Manage commercial pricing policy and campaign timing.
- **Core Entities / Aggregates:** PriceBookEntry, VolumeTier, PromotionWindow, RepricingJob
- **Key Invariants:**
  - Effective-date windows may not overlap for conflicting price records.
  - Volume tiers must be monotonic by quantity breakpoint.
  - Promotion cancellation preserves audit history.
- **Why separate:** Pricing rules are time-based and policy-heavy, with cadence distinct from product editing.
- **Expected API responsibilities:** Set base prices, configure discount tiers, start/cancel promotions, apply group repricing.

### 4. Inventory and Availability API

- **Purpose / Responsibility:** Manage fulfillment posture and stock-level truth.
- **Core Entities / Aggregates:** InventoryPosition, AvailabilityPolicy, RestockPlan
- **Key Invariants:**
  - Quantity updates must keep non-negative on-hand values unless explicit backorder policy is active.
  - Backorder state and lead-time posture must be coherent.
  - Suspended products cannot be reported as purchasable.
- **Why separate:** Operational stock updates require high-frequency writes and isolated scaling.
- **Expected API responsibilities:** Update quantities, restock expectations, lead times, backorder posture, and suspension state.

### 5. Category and Faceting API

- **Purpose / Responsibility:** Manage navigational taxonomy and filter model configuration.
- **Core Entities / Aggregates:** Category, CategoryAssignment, FacetDefinition
- **Key Invariants:**
  - Category graph must remain acyclic.
  - Product assignments must reference existing categories.
  - Facet definitions must be valid for assigned category scope.
- **Why separate:** Taxonomy has distinct governance and language from product/pricing/inventory concerns.
- **Expected API responsibilities:** Create/update/move/retire categories, assign/unassign products, define facets.

### 6. Compatibility Rules API

- **Purpose / Responsibility:** Manage technical compatibility knowledge used by compatibility checking.
- **Core Entities / Aggregates:** CompatibilityRule, ComponentGroup
- **Key Invariants:**
  - Rules must reference supported component attributes.
  - Rule activation/deactivation must preserve historical traceability.
  - Component group definitions must be structurally valid.
- **Why separate:** Compatibility knowledge evolves with engineering constraints independent of storefront data shape.
- **Expected API responsibilities:** Create/update/deactivate compatibility rules, define/update component groups.

### 7. Catalog Governance API

- **Purpose / Responsibility:** Orchestrate approval workflows for high-risk mutations.
- **Core Entities / Aggregates:** ApprovalCase, ApprovalDecision, PublicationGate
- **Key Invariants:**
  - High-risk changes must be approved before publication.
  - Approval decisions are immutable audit events.
  - Gate state must be explicit (pending, approved, rejected, expired).
- **Why separate:** Governance language and policy lifecycle cut across multiple admin domains.
- **Expected API responsibilities:** Submit changes for review, assign reviewers, approve/reject, expose case status.

### 8. Bulk Ingestion API

- **Purpose / Responsibility:** Support asynchronous high-volume import workflows.
- **Core Entities / Aggregates:** ImportBatch, ImportItemResult, ImportReplayRequest
- **Key Invariants:**
  - Batch execution state transitions are monotonic.
  - Failed items are traceable and replayable.
  - Import operations are idempotent per source item key.
- **Why separate:** Bulk ingest workload profile and reliability patterns differ from interactive admin commands.
- **Expected API responsibilities:** Submit batch, track status/results, replay failed items.

---

## B. Boundary Rationale

| Principle | Application |
|-----------|-------------|
| **Linguistic differences** | Lifecycle, documentation, pricing, inventory, taxonomy, compatibility, governance, and ingestion all use distinct business language. |
| **Consistency requirements** | Invariants are enforced inside each boundary (for example, price overlap checks are isolated from inventory updates). |
| **Autonomy** | Each boundary can evolve, test, and scale independently without synchronous command-time coupling. |
| **Event-driven integration** | Write-side boundaries publish state-change events; read-side storefront and partner projections consume them asynchronously. |
| **Aggregate independence** | Product, Document, PriceBookEntry, InventoryPosition, Category, CompatibilityRule, ApprovalCase, and ImportBatch are independent transactional roots. |

---

## C. Integration Model Between Write and Read Boundaries

- **Write-side publishers:** Product Lifecycle, Documentation, Pricing, Inventory, Category/Faceting, Compatibility Rules, Bulk Ingestion.
- **Cross-cutting gate:** Catalog Governance mediates externally visible high-risk changes.
- **Read-side consumers:** Catalog Storefront API, Component Compatibility API (read-side checker), Partner Catalog Syndication API.
- **Pattern:** asynchronous event-driven propagation; no synchronous read-side calls required to complete write-side mutations.
- **ACL usage:** read-side boundaries consume curated integration events and map them into projection-specific models.

---

## D. Pitfalls to Avoid

| Pitfall | Mitigation |
|---------|------------|
| **Distributed monolith behavior** | Avoid synchronous invariant checks across write boundaries; use local rules plus event propagation. |
| **Chatty orchestration** | Use bulk operations for import and repricing; avoid per-item external coordination loops. |
| **Cross-boundary invariant leakage** | Keep strong consistency rules inside aggregate boundaries only. |
| **Shared internal models** | Publish integration events as contracts; consumers keep independent projection models. |
| **Approval bypass** | Route high-risk operations through Catalog Governance before publication. |

---

## Boundary Consolidation Assessment

### Candidate combinations considered

1. **Merge Product Lifecycle + Technical Documentation**
   - Rejected: document version-chain invariants and storage concerns differ from product lifecycle transitions.
2. **Merge Pricing + Inventory**
   - Rejected: pricing policy cadence and inventory operational cadence differ; coupling would reduce autonomy.
3. **Merge Governance into each domain API**
   - Rejected: policy workflow would be duplicated and drift across teams.
4. **Merge Bulk Ingestion into Product Lifecycle**
   - Rejected: ingest workload requires asynchronous reliability and replay semantics not needed for interactive product edits.

### Relationship with existing storefront boundaries

- No write boundary should be merged with the existing read-side APIs (`Catalog Storefront`, `Component Compatibility`, `Partner Catalog Syndication`).
- Read-side boundaries remain consumer-query focused; write-side boundaries remain command and policy focused.
- Integration happens through curated state-change events, preserving read/write separation and independent scaling.

### Conclusion

Eight boundaries is intentional for v2 Define: six job-story-aligned command boundaries plus two explicit cross-cutting boundaries (Governance and Bulk Ingestion) required for policy and operational reliability.
