# ADDR Define Phase — Catalog Storefront

**Domain:** Mechatronic Product Ecommerce (Drones & Components)
**Subdomain:** Catalog Storefront
**Status:** Validated

## Summary

3 API boundaries identified, 19 operations defined, 14 resources modeled across the Catalog Storefront domain.

### API Boundaries

| Boundary | Description | Job Stories | Operations |
|----------|-------------|-------------|------------|
| **Catalog Storefront API** | Product discovery, browsing, evaluation, comparison | JS1, JS2, JS3, JS5 | 14 |
| **Component Compatibility API** | Component compatibility checks and replacements | JS4 | 2 |
| **Partner Catalog Syndication API** | Bulk catalog data, batch availability, batch pricing | JS6 | 3 |

### Integration Model

- **Pattern:** Asynchronous, event-driven. No synchronous cross-boundary calls.
- **Events published by Catalog API:** Product.Created, Product.Updated, Product.Discontinued, Product.PriceChanged, Product.AvailabilityChanged, Category.Created, Category.Updated
- **Consumed by Compatibility API:** Product.Created, Product.Updated, Product.Discontinued
- **Consumed by Partner Catalog API:** Product.Created, Product.Updated, Product.PriceChanged, Product.AvailabilityChanged

## Artifacts

- [API Boundaries](boundaries.md) — 3 boundaries with DDD rationale, integration model, pitfalls
- [API Resources](resources.md) — 14 resources with properties and relationships
- [API Profiles](api-profiles.md) — 19 operations with participants, events, characteristics
- [Sequence Diagrams](sequence-diagrams.md) — Mermaid diagrams for all 6 job stories
- [Validation](validation.md) — Cross-reference validation against ADDR prompts and Higginbotham methodology

## Open Questions

1. Should compatibility rules be managed via an admin API or configuration files?
2. Should the Partner Catalog API support webhook notifications for catalog changes (in addition to polling)?
3. Should product reviews support helpfulness voting in this scope?

## Input Artifacts

- [Align Phase — Job Stories](../align/job-stories.md)
- [Align Phase — Activity Steps](../align/activity-steps.md)

## Next Phase

Design phase: Map operations to HTTP methods, define resource paths, establish style guidelines, produce high-level API design tables.
