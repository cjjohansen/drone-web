# Catalog Management v2 — EventModel Mapping

> **Purpose:** Deterministic bridge from Align artifacts to EventModel slices while Event Storming is temporarily deferred.

## Slice Mapping Rules

- Write mutations map to `STATE_CHANGE`.
- User-facing read projections map to `STATE_VIEW`.
- Policy/background processing maps to `AUTOMATION`.
- Naming uses business terms only (commands = verbs, events = past tense, read models = nouns).

## Job Story to Slice Candidates

| Job Story | Slice Type | Candidate Title | Command | Event | Read Model |
|-----------|------------|-----------------|---------|-------|------------|
| JS1 | STATE_CHANGE | Create Product | Create Product | Product Created | Product Summary |
| JS1 | STATE_CHANGE | Update Product Specs | Update Product Specifications | Product Specification Updated | Product Summary |
| JS1 | STATE_CHANGE | Discontinue Product | Discontinue Product | Product Discontinued | Product Lifecycle Status |
| JS1 | AUTOMATION | Process Import Batch | Apply Imported Product Record | Product Imported | Import Batch Results |
| JS2 | STATE_CHANGE | Publish Document Version | Publish Document Version | Document Version Published | Product Documents |
| JS2 | STATE_CHANGE | Retire Document | Retire Document | Document Retired | Product Documents |
| JS3 | STATE_CHANGE | Set Base Price | Set Base Price | Base Price Set | Product Pricing |
| JS3 | STATE_CHANGE | Start Promotion | Start Promotion | Promotion Started | Product Pricing |
| JS3 | AUTOMATION | Apply Group Repricing | Apply Price Adjustment | Product Group Repriced | Repricing Results |
| JS4 | STATE_CHANGE | Update Stock Position | Update Stock Quantity | Stock Quantity Updated | Inventory Snapshot |
| JS4 | STATE_CHANGE | Update Availability Policy | Update Availability State | Availability State Updated | Availability View |
| JS5 | STATE_CHANGE | Reorganize Category | Move Category | Category Moved | Category Tree |
| JS5 | STATE_CHANGE | Assign Product Category | Assign Product To Category | Product Category Assigned | Category Product Listing |
| JS6 | STATE_CHANGE | Create Compatibility Rule | Create Compatibility Rule | Compatibility Rule Created | Compatibility Rule Catalog |
| JS6 | STATE_CHANGE | Update Component Group | Update Component Group | Component Group Updated | Component Group Catalog |

## Initial Flow Skeleton (for `config.json`)

1. `STATE_VIEW` — Product Summary  
2. `STATE_CHANGE` — Create Product -> Product Created  
3. `STATE_VIEW` — Product Lifecycle Status  
4. `STATE_CHANGE` — Publish Document Version -> Document Version Published  
5. `STATE_VIEW` — Product Documents  
6. `STATE_CHANGE` — Set Base Price -> Base Price Set  
7. `STATE_VIEW` — Product Pricing  
8. `STATE_CHANGE` — Update Stock Quantity -> Stock Quantity Updated  
9. `STATE_VIEW` — Availability View  
10. `STATE_CHANGE` — Create Compatibility Rule -> Compatibility Rule Created

## Ambiguity Resolutions

- **Bulk import:** modeled as `AUTOMATION` with explicit import batch read model.
- **Approvals:** modeled as separate governance slices before externally visible changes.
- **Repricing:** modeled as `AUTOMATION` for product groups, not a single-record `STATE_CHANGE`.
- **Inventory updates:** maintain both quantity and availability views to support storefront downstream needs.
