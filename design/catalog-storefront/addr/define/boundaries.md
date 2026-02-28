# Catalog Storefront — API Boundaries

> **Subdomain:** Catalog Storefront
> **Phase:** ADDR — Define
> **Status:** Draft

---

## Boundary Identification

Applying DDD principles (Bounded Contexts, Aggregate design, autonomy, domain events) to the Catalog Storefront job stories and activity steps, we identify the following API boundaries.

### Boundaries Table

| Boundary Name | Boundary Description | Job Story(s) |
|---------------|---------------------|---------------|
| **Catalog API** | Product catalog management — search, browse, filter, product details, categories, pricing, availability, reviews, technical documents, and suggestions | JS1, JS2, JS3, JS5 |
| **Compatibility API** | Component compatibility verification — validate multi-component builds, identify incompatibilities, suggest compatible replacements | JS4 |
| **Partner Catalog API** | Partner-facing catalog data syndication — bulk catalog feeds, batch availability checks, batch pricing retrieval | JS6 |

---

## A. Recommended API / Bounded Context Boundaries

### 1. Catalog API

- **Purpose / Responsibility:** Serves the core storefront experience — discovering, browsing, evaluating, and comparing mechatronic products
- **Core Entities / Aggregates:**
  - Product (aggregate root): specs, descriptions, images, pricing, availability
  - Category: hierarchy, facets
  - Review: ratings, buyer reviews
  - TechnicalDocument: datasheets, CAD files, compliance certificates
- **Key Invariants:**
  - A product must belong to at least one category
  - Pricing must always be present for a listed product
  - Availability status must be current (in stock, backorder, discontinued)
  - Reviews are tied to a specific product
- **Why separate:** This is the primary consumer-facing context. It owns product data, search, and browsing — the core language of "discovery" and "evaluation"
- **Expected API responsibilities:**
  - Inputs: search queries, filters, product IDs, category IDs, comparison sets
  - Outputs: product listings, product details, category trees, facets, comparison matrices, suggestions, reviews, documents, pricing, availability

### 2. Compatibility API

- **Purpose / Responsibility:** Validates that a set of mechatronic components work together — voltage, current, physical fit, protocol compatibility
- **Core Entities / Aggregates:**
  - CompatibilityCheck (aggregate root): component set, validation result
  - CompatibilityRule: constraints between component types (e.g., motor voltage must match ESC voltage range)
- **Key Invariants:**
  - A compatibility check requires at least two components
  - Compatibility rules are enforced atomically within a single check
  - Replacement suggestions must satisfy the same constraints
- **Why separate:**
  - **Distinct language:** "compatibility," "component set," "voltage mismatch," "replacement" vs. "product," "category," "search"
  - **Different invariants:** Compatibility rules are cross-product constraints, not product-level data
  - **Independent lifecycle:** Compatibility rules evolve independently of catalog content (new rules can be added without changing product data)
  - **Isolated change:** Compatibility logic can be updated, tested, and scaled independently
- **Expected API responsibilities:**
  - Inputs: list of component identifiers
  - Outputs: pass/fail status, incompatibility details, compatible replacement suggestions

### 3. Partner Catalog API

- **Purpose / Responsibility:** Provides partner systems with programmatic, bulk access to catalog data — different consumption patterns than the storefront
- **Core Entities / Aggregates:**
  - CatalogFeed (aggregate root): bulk product data export
  - Product (read projection): simplified view of catalog product for syndication
- **Key Invariants:**
  - Feed data must reflect current catalog state
  - Partner access is read-only — no mutations
  - Batch queries must support a set of product identifiers
- **Why separate:**
  - **Different participants:** Partner systems vs. human shoppers
  - **Different consumption patterns:** Bulk/batch retrieval vs. interactive browsing
  - **Different language:** "feed," "export," "batch pricing" vs. "search," "browse," "compare"
  - **Model-to-model translation:** Partners receive a simplified projection of product data, not the full storefront representation
  - **Independent scaling:** Feed generation can be heavy; isolating it prevents impact on storefront performance
- **Expected API responsibilities:**
  - Inputs: feed parameters, product ID sets
  - Outputs: bulk catalog data, batch availability, batch pricing

---

## B. Boundary Rationale

| Principle | Application |
|-----------|-------------|
| **Linguistic differences** | Catalog speaks "search, browse, compare, review." Compatibility speaks "validate, mismatch, replacement." Partner speaks "feed, export, batch." |
| **Consistency requirements** | Catalog maintains product data consistency. Compatibility maintains rule consistency. Neither requires synchronous calls to the other during operations. |
| **Autonomy** | Each boundary owns its data and can evolve independently. |
| **Event-driven integration** | Catalog publishes integration events (a curated subset of its internal domain events); Compatibility and Partner consume them to stay current. |
| **Aggregate independence** | Product, CompatibilityCheck, and CatalogFeed are independent aggregates with their own transactional boundaries. |

---

## C. Integration Model Between Boundaries

```
┌──────────────┐     Product.Updated      ┌─────────────────────┐
│              │     Product.Created      │                     │
│  Catalog API │ ──────────────────────►  │  Compatibility API  │
│              │     Product.Discontinued │                     │
└──────────────┘                          └─────────────────────┘
       │
       │  Product.Updated
       │  Product.Created
       │  Product.PriceChanged
       │  Product.AvailabilityChanged
       ▼
┌──────────────────────┐
│                      │
│  Partner Catalog API │
│                      │
└──────────────────────┘
```

- **Integration events published by Catalog API:** Product.Created, Product.Updated, Product.Discontinued, Product.PriceChanged, Product.AvailabilityChanged, Category.Created, Category.Updated
- **Integration events consumed by Compatibility API:** Product.Created, Product.Updated, Product.Discontinued (to keep component data current for validation)
- **Integration events consumed by Partner Catalog API:** Product.Created, Product.Updated, Product.PriceChanged, Product.AvailabilityChanged (to keep feed data current)
- **Pattern:** Asynchronous, event-driven integration. No synchronous cross-boundary calls. Internal domain events (e.g., Catalog Searched, Product Details Viewed) stay within their bounded context and are not published.
- **ACL:** Partner Catalog API translates Catalog product representations into partner-friendly projections

---

## D. Pitfalls to Avoid

| Pitfall | Mitigation |
|---------|------------|
| **Distributed monolith** | No synchronous cross-boundary calls. Compatibility reads product specs from its own local cache, updated via events. |
| **Chatty network calls** | Partner API provides bulk endpoints, not per-product calls. |
| **Cross-boundary invariants** | Compatibility rules reference product specs locally, not via remote calls. |
| **Tight coupling** | Each boundary has its own data store and can be deployed independently. |
| **Shared domain models** | Partner API uses a simplified projection, not the Catalog's internal model. |

---

## Boundary Consolidation Assessment

**Should any boundaries be combined?**

We considered combining Catalog + Compatibility into a single boundary. However:
- Compatibility has distinct language, rules, and lifecycle
- Compatibility checks are cross-product operations (not a property of a single product)
- Keeping them separate allows the compatibility engine to evolve independently (new component types, new rule types)

We considered combining Catalog + Partner Catalog. However:
- Partners have fundamentally different consumption patterns (bulk vs. interactive)
- Partner API serves machine consumers with different SLAs and rate limits
- Isolating partner load protects storefront performance

**Conclusion:** Three boundaries is the right balance for this domain. All three serve distinct participants with distinct language and patterns.
