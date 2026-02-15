# Catalog Storefront — High-Level API Design

> **Phase:** ADDR — Design
> **Status:** Draft
> **Style Guide:** [style-guide.md](style-guide.md)

---

## Catalog Storefront API

**Base Path:** `/catalog/v1`

| HTTP Method | Resource Path | Operation Name | Description | Request | Response (Success) | Response (Error) |
|-------------|--------------|----------------|-------------|---------|-------------------|-----------------|
| POST | /catalog/v1/products/search | searchProducts() | Search the catalog using keywords and parametric filters | Body: `{ query, filters: { categoryId, specifications, priceRange, brand, status }, sort, offset, limit }` | `200 OK` — `{ totalResults, products: [{ productId, name, shortDescription, brand, pricing, availability, images }], offset, limit }` | `400` invalid filters |
| POST | /catalog/v1/products/autocomplete | getAutocompleteSuggestions() | Get search suggestions as query is typed | Body: `{ query, limit }` | `200 OK` — `{ suggestedTerms, suggestedCategories: [{ categoryId, name }], suggestedProducts: [{ productId, name }] }` | `400` missing query |
| GET | /catalog/v1/products/{productId} | getProduct() | Retrieve full product details | Path: `productId` | `200 OK` — Full Product representation | `404` product not found |
| GET | /catalog/v1/products/{productId}/pricing | getProductPricing() | Retrieve current pricing for a product | Path: `productId` | `200 OK` — `{ productId, basePrice, volumeDiscounts, activePromotions, currency }` | `404` product not found |
| GET | /catalog/v1/products/{productId}/availability | getProductAvailability() | Check product stock status | Path: `productId` | `200 OK` — `{ productId, status, quantityAvailable, estimatedRestockDate }` | `404` product not found |
| GET | /catalog/v1/products/{productId}/reviews | getProductReviews() | Retrieve reviews for a product | Path: `productId`; Query: `sort, offset, limit` | `200 OK` — `{ totalResults, averageRating, reviews: [{ reviewId, rating, title, body, author, verifiedPurchase, createdDate }], offset, limit }` | `404` product not found |
| GET | /catalog/v1/products/{productId}/documents | getProductDocuments() | Retrieve technical documents for a product | Path: `productId`; Query: `type` (optional filter) | `200 OK` — `[{ documentId, title, type, format, url, fileSize }]` | `404` product not found |
| GET | /catalog/v1/products/{productId}/compatible | getCompatibleProducts() | Retrieve products compatible with a given product | Path: `productId`; Query: `offset, limit` | `200 OK` — `{ totalResults, products: [Product summary], offset, limit }` | `404` product not found |
| GET | /catalog/v1/products/{productId}/similar | getSimilarProducts() | Retrieve similar alternatives | Path: `productId`; Query: `offset, limit` | `200 OK` — `{ totalResults, products: [Product summary], offset, limit }` | `404` product not found |
| GET | /catalog/v1/products/{productId}/frequently-bought-together | getFrequentlyBoughtTogether() | Retrieve commonly co-purchased products | Path: `productId`; Query: `limit` | `200 OK` — `[Product summary]` | `404` product not found |
| POST | /catalog/v1/products/compare | compareProducts() | Compare specs of multiple products side by side | Body: `{ productIds: [uuid] }` (2–5 products) | `200 OK` — `{ products, sharedSpecifications, differingSpecifications }` | `400` fewer than 2 or more than 5 products; `404` product not found |
| GET | /catalog/v1/categories | getCategoryTree() | Retrieve category hierarchy | Query: `parentCategoryId` (optional, null for root) | `200 OK` — `[{ categoryId, name, description, childCategories, productCount, sortOrder }]` | — |
| GET | /catalog/v1/categories/{categoryId}/products | getCategoryProducts() | Retrieve products in a category | Path: `categoryId`; Query: `filters, sort, offset, limit` | `200 OK` — `{ totalResults, products: [Product summary], offset, limit }` | `404` category not found |
| GET | /catalog/v1/categories/{categoryId}/facets | getCategoryFacets() | Retrieve available filter facets for a category | Path: `categoryId` | `200 OK` — `[{ name, type, values, range }]` | `404` category not found |

---

## Component Compatibility API

**Base Path:** `/compatibility/v1`

| HTTP Method | Resource Path | Operation Name | Description | Request | Response (Success) | Response (Error) |
|-------------|--------------|----------------|-------------|---------|-------------------|-----------------|
| POST | /compatibility/v1/checks | checkCompatibility() | Validate a set of components for compatibility | Body: `{ productIds: [uuid] }` (2+ products) | `201 Created` — `{ checkId, components, status, incompatibilities: [{ componentA, componentB, rule, type, severity }], checkedDate }` | `400` fewer than 2 components; `404` product not found; `422` unrecognized component type |
| GET | /compatibility/v1/checks/{checkId}/replacements/{productId} | getCompatibleReplacements() | Get alternatives that resolve an incompatibility | Path: `checkId`, `productId` | `200 OK` — `[{ productId, name, brand, specifications, pricing }]` | `404` check or product not found |

---

## Partner Catalog Syndication API

**Base Path:** `/partner-catalog/v1`

| HTTP Method | Resource Path | Operation Name | Description | Request | Response (Success) | Response (Error) |
|-------------|--------------|----------------|-------------|---------|-------------------|-----------------|
| GET | /partner-catalog/v1/feed | getCatalogFeed() | Retrieve bulk catalog data | Query: `lastUpdatedSince` (RFC 3339, optional for incremental), `offset, limit` | `200 OK` — `{ feedId, generatedDate, productCount, products: [PartnerProduct], offset, limit }` | `400` invalid date format |
| POST | /partner-catalog/v1/availability | getBatchAvailability() | Check availability for multiple products | Body: `{ productIds: [uuid] }` | `200 OK` — `[{ productId, status, quantityAvailable, estimatedRestockDate }]` | `400` empty product list; `404` product not found |
| POST | /partner-catalog/v1/pricing | getBatchPricing() | Retrieve pricing for multiple products | Body: `{ productIds: [uuid] }` | `200 OK` — `[{ productId, basePrice, volumeDiscounts, activePromotions, currency }]` | `400` empty product list; `404` product not found |

---

## Design Decisions

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
