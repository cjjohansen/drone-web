# ADDR Define Phase — Catalog Management v2

**Domain:** Mechatronic Product Ecommerce (Write Side)  
**Subdomain:** Catalog Management v2  
**Status:** Validated

## Summary

8 admin API boundaries identified, 42 operations profiled, and 24 resources modeled for write-side catalog management.

### API Boundaries

| Boundary | Description | Job Stories | Operations |
|----------|-------------|-------------|------------|
| **Product Lifecycle API** | Product master data and lifecycle transitions | JS1 | 7 |
| **Technical Documentation API** | Document upload, association, versioning, retirement | JS2 | 5 |
| **Pricing and Promotions API** | Base pricing, discount tiers, promotions, repricing | JS3 | 5 |
| **Inventory and Availability API** | Quantity, restock, lead-time, backorder, suspension | JS4 | 6 |
| **Category and Faceting API** | Taxonomy hierarchy, assignment, and facet controls | JS5 | 7 |
| **Compatibility Rules API** | Compatibility rule and component group lifecycle | JS6 | 5 |
| **Catalog Governance API** | Approval workflow and publication gates for high-risk writes | JS1, JS3, JS6 | 4 |
| **Bulk Ingestion API** | Asynchronous import batches with replay support | JS1 | 3 |

### Integration Model

- **Pattern:** Asynchronous, event-driven integration between write boundaries and existing read-side APIs.
- **Governance:** High-risk mutations flow through `Catalog Governance API` before publication.
- **Read-side relationship:** No boundary merges with storefront read APIs; integration remains event-based to preserve read/write separation.

## Artifacts

- [API Boundaries](boundaries.md) — boundary tables, DDD rationale, consolidation assessment
- [API Resources](resources.md) — resource properties and relationships for all boundaries
- [API Profiles](api-profiles.md) — operation profiles with participants, events, characteristics, and details
- [Sequence Diagrams](sequence-diagrams.md) — Mermaid flows for JS1 through JS6
- [Validation](validation.md) — Define checklist and findings/dispositions

## Input Artifacts

- [Align Phase — README](../align/README.md)
- [Align Phase — Personas](../align/personas.md)
- [Align Phase — Job Stories](../align/job-stories.md)
- [Align Phase — Activity Steps](../align/activity-steps.md)
- [Align Phase — Boundary Map](../align/boundary-map.md)
- [Align Phase — EventModel Mapping](../align/eventmodel-mapping.md)

## Open Questions

1. Should `Catalog Governance API` approval decisions remain synchronous for all high-risk changes, or should critical paths allow asynchronous decision workflows?
2. Should bulk ingestion approvals be mandatory for all batches, or only for batches that target protected product families or large repricing scopes?

## Next Phase

Design phase: map Define operations to HTTP methods and resource paths, extend write-side style guidance (idempotency and concurrency), and produce high-level API design tables for each boundary.
