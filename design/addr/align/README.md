# ADDR Align Phase — Catalog Storefront

**Domain:** Mechatronic Product Ecommerce (Drones & Components)
**Subdomain:** Catalog Storefront
**Status:** Draft — awaiting review

## Summary

6 unifying job stories covering the full storefront experience:

| ID | Job Story | Key Outcome |
|----|-----------|-------------|
| JS1 | Product Discovery | Find products by specs and keywords |
| JS2 | Product Evaluation | Deep-dive into a product's fit for purpose |
| JS3 | Product Comparison | Side-by-side technical comparison |
| JS4 | Compatibility Verification | Validate a multi-component build |
| JS5 | Catalog Browsing | Explore by category hierarchy |
| JS6 | Partner Catalog Access | Programmatic catalog data retrieval |

## Artifacts

- [Personas](personas.md) — 4 personas with goals, context, and job story mapping
- [Job Stories](job-stories.md) — 6 unifying job stories in WHEN/I WANT TO/SO I CAN format
- [Activity Steps](activity-steps.md) — 23 activity steps grouped into activities
- [Event Storming](event-storming.md) — 40 domain events, 4 pivotal events, swimlanes, hotspots
- [Validation](validation.md) — Cross-reference validation against ADDR prompts and Higginbotham methodology

## Requirements Input

Business requirements, scope, and context are documented in the product spec:

- [Catalog Storefront Product Spec](../../../.ralph/specs/catalog-storefront.md)

## Open Questions

1. Should "Save to Wishlist" be part of the storefront or the account/cart domain?
2. Should "Recently Viewed" be API-driven or client-side only?
3. Are partner feeds (JS6) in scope for the storefront API or a separate syndication API?

## Next Phase

Define phase: Identify API boundaries, compose API profiles, model resources, and diagram workflows.
