# Catalog Storefront — Product Spec

> **Domain:** Mechatronic Product Ecommerce
> **Subdomain:** Catalog Storefront
> **Status:** In progress — ADDR Define phase complete (draft)

---

## 1. Overview

Design a Catalog Storefront API for a mechatronic/drone ecommerce platform. The storefront enables professional buyers, fleet procurement officers, and partner systems to discover, evaluate, compare, and verify compatibility of drone components and complete systems.

**Scope:** Catalog browsing, search, product evaluation, comparison, compatibility verification, and partner data syndication. Shopping cart, checkout, and order management are out of scope for this subdomain.

---

## 2. Business Context

### Target Market
- Professional drone integrators (surveying, agriculture, inspection, delivery)
- Government/defense/enterprise fleet procurement (hundreds to thousands of units)
- Partner systems (marketplaces, resellers, price comparison sites)

### Product Types
Drones (complete systems), motors, ESCs (electronic speed controllers), flight controllers, sensors, frames, batteries, propellers, FPV gear, accessories.

### Key Differentiator
Deep technical specifications and **component compatibility verification** — buyers can validate that a motor, ESC, propeller, and battery will work together before ordering.

---

## 3. Personas

| Persona | Description | Primary Needs |
|---------|-------------|---------------|
| **Professional Integrator** | Engineer/technician building commercial drone systems | Search by exact specs, datasheets, compliance certs, compatibility checks |
| **Fleet Procurement Buyer** | Government/enterprise purchasing at fleet scale | Volume pricing, compliance docs, standardized fleet configurations |
| **Casual Browser** | Newcomer or researcher exploring the catalog | Category browsing, product descriptions, reviews |
| **Partner System** | External system consuming catalog data programmatically | Bulk feeds, batch availability, batch pricing |

Full persona details: `design/addr/align/personas.md`

---

## 4. Job Stories

| ID | WHEN | I WANT TO | SO I CAN |
|----|------|-----------|----------|
| JS1 | I need to find a component for my project | Search and filter by technical specs and categories | Quickly identify products that meet my requirements |
| JS2 | I have found candidate products | Review detailed specs, docs, and related products | Determine if a product is the right fit |
| JS3 | I'm deciding between similar products | Compare specs side by side | Make an informed decision based on technical merit |
| JS4 | I'm building a mechatronic system | Verify component compatibility | Avoid ordering parts that won't work together |
| JS5 | I'm exploring without a specific product in mind | Browse through a category hierarchy | Discover products and understand the range of options |
| JS6 | I'm a partner system needing product info | Retrieve catalog data, pricing, and availability | Display accurate product information in my system |

Full job stories: `design/addr/align/job-stories.md`
Activity steps (24): `design/addr/align/activity-steps.md`

---

## 5. API Architecture

### Boundaries

| API | Purpose | Job Stories | Operations |
|-----|---------|-------------|------------|
| **Catalog Storefront API** | Discovery, browsing, evaluation, comparison | JS1, JS2, JS3, JS5 | 14 |
| **Component Compatibility API** | Validate component compatibility, suggest replacements | JS4 | 2 |
| **Partner Catalog Syndication API** | Bulk catalog feeds, batch availability/pricing | JS6 | 3 |

### Integration Pattern
- Asynchronous, event-driven integration between boundaries
- No synchronous cross-boundary calls during domain operations
- Catalog API publishes domain events (Product.Created, Product.Updated, etc.)
- Compatibility and Partner APIs consume events to keep local data current

### Domain Events

| Event | Publisher | Consumers |
|-------|-----------|-----------|
| Product.Created | Catalog API | Compatibility API, Partner Catalog API |
| Product.Updated | Catalog API | Compatibility API, Partner Catalog API |
| Product.Discontinued | Catalog API | Compatibility API, Partner Catalog API |
| Product.PriceChanged | Catalog API | Partner Catalog API |
| Product.AvailabilityChanged | Catalog API | Partner Catalog API |
| Category.Created | Catalog API | — |
| Category.Updated | Catalog API | — |
| CompatibilityCheck.Completed | Compatibility API | — |
| CatalogFeed.Accessed | Partner Catalog API | — |

Full boundary details: `design/addr/define/boundaries.md`
Resources (14): `design/addr/define/resources.md`
API profiles (19 ops): `design/addr/define/api-profiles.md`
Sequence diagrams: `design/addr/define/sequence-diagrams.md`

---

## 6. ADDR Progress

| Phase | Status | Artifacts |
|-------|--------|-----------|
| **Align** | Complete | Personas, job stories, activity steps |
| **Define** | Draft — awaiting review | Boundaries, resources, API profiles, sequence diagrams |
| **Design** | Pending | High-level API design tables (HTTP methods, paths, request/response) |
| **Refine** | Pending | OpenAPI 3.1 specs, AsyncAPI 3.0 specs, README examples, Mermaid diagrams, Postman collections |

Task tracking: `.ralph/tasks/addr-process.md`

---

## 7. Technical Decisions

- AsyncAPI 3.0 specs will be produced for all domain events (for future Event Catalog integration)
- RESTful API design with style guidelines (defined in Design phase)
- 3 bounded contexts following DDD principles

Full decision log: `.ralph/agent/decisions.md`

---

## 8. Open Questions

| ID | Question | Status |
|----|----------|--------|
| OQ-001 | Should "Save to Wishlist" be part of the storefront or account/cart domain? | Open |
| OQ-002 | Should "Recently Viewed" be API-driven or client-side only? | Open |
| OQ-004 | Should compatibility rules be managed via admin API or config files? | Open |
| OQ-005 | Should Partner Catalog API support webhooks for catalog changes? | Open |
| OQ-006 | Should product reviews support helpfulness voting? | Open |

---

## 9. Future Scope (not in this subdomain)

- Shopping cart and checkout
- Order management and fulfillment
- Inventory management (internal)
- Customer accounts and authentication
- Wishlist / saved configurations
- Admin/catalog management APIs
