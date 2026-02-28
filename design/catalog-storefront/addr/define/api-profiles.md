# Catalog Storefront — API Profiles

> **Phase:** ADDR — Define
> **Status:** Draft

---

## Catalog API

**Name:** Catalog Storefront API
**Description:** Provides product discovery, browsing, evaluation, and comparison capabilities for the mechatronic product catalog.

| Operation Name | Description | Participants | Resource(s) | Emitted Events | Operation Characteristics | Operation Details |
|----------------|-------------|--------------|-------------|----------------|--------------------------|-------------------|
| searchProducts() | Search the catalog using keywords and parametric filters | Customer | SearchResult, Product | — | safe, sync | Request: query text, filters (category, specs, price range), sort field, sort direction, offset, limit. Response: search results with product summaries, total count |
| getAutocompleteSuggestions() | Get search suggestions as query is typed | Customer | Suggestion | — | safe, sync | Request: partial query text, limit. Response: suggested terms, categories, products |
| getProduct() | Retrieve full product details | Customer | Product | — | safe, sync | Request: productId. Response: full product representation including specs, descriptions, images |
| getProductPricing() | Retrieve current pricing for a product | Customer | Product | — | safe, sync | Request: productId. Response: base price, volume discounts, active promotions |
| getProductAvailability() | Check product stock status | Customer | Product | — | safe, sync | Request: productId. Response: availability status, quantity, estimated restock |
| getProductReviews() | Retrieve reviews for a product | Customer | Review | — | safe, sync | Request: productId, offset, limit, sort. Response: list of reviews, average rating, total count |
| getProductDocuments() | Retrieve technical documents for a product | Customer | TechnicalDocument | — | safe, sync | Request: productId, document type filter. Response: list of technical documents |
| getCompatibleProducts() | Retrieve products compatible with a given product | Customer | Product | — | safe, sync | Request: productId, offset, limit. Response: list of compatible products |
| getSimilarProducts() | Retrieve similar alternatives | Customer | Product | — | safe, sync | Request: productId, offset, limit. Response: list of similar products |
| getFrequentlyBoughtTogether() | Retrieve commonly co-purchased products | Customer | Product | — | safe, sync | Request: productId, limit. Response: list of frequently bought together products |
| compareProducts() | Compare specs of multiple products side by side | Customer | ComparisonMatrix | — | safe, sync | Request: list of productIds (2-5). Response: comparison matrix with shared and differing specs |
| getCategoryTree() | Retrieve category hierarchy | Customer | Category | — | safe, sync | Request: parentCategoryId (optional, null for root). Response: category tree or subtree |
| getCategoryProducts() | Retrieve products in a category | Customer | Product, Category | — | safe, sync | Request: categoryId, filters, sort, offset, limit. Response: list of products, total count |
| getCategoryFacets() | Retrieve available filter facets for a category | Customer | Category | — | safe, sync | Request: categoryId. Response: list of facets with value ranges |

---

## Compatibility API

**Name:** Component Compatibility API
**Description:** Validates mechatronic component compatibility and suggests replacements for incompatible parts.

| Operation Name | Description | Participants | Resource(s) | Emitted Events | Operation Characteristics | Operation Details |
|----------------|-------------|--------------|-------------|----------------|--------------------------|-------------------|
| checkCompatibility() | Validate a set of components for compatibility | Customer | CompatibilityCheck, Incompatibility | CompatibilityCheck.Completed | unsafe, sync | Request: list of productIds (2+). Response: check result with pass/fail status, list of incompatibilities with details |
| getCompatibleReplacements() | Get alternatives that resolve an incompatibility | Customer | Product, Incompatibility | — | safe, sync | Request: checkId, incompatible productId. Response: list of compatible replacement products |

---

## Partner Catalog API

**Name:** Partner Catalog Syndication API
**Description:** Provides partner systems with bulk access to catalog data, availability, and pricing for syndication and integration.

| Operation Name | Description | Participants | Resource(s) | Emitted Events | Operation Characteristics | Operation Details |
|----------------|-------------|--------------|-------------|----------------|--------------------------|-------------------|
| getCatalogFeed() | Retrieve bulk catalog data | Partner | CatalogFeed, PartnerProduct | CatalogFeed.Accessed | safe, sync | Request: lastUpdatedSince (optional, for incremental), offset, limit. Response: feed with product data |
| getBatchAvailability() | Check availability for multiple products | Partner | BatchAvailability | — | safe, sync | Request: list of productIds. Response: availability status per product |
| getBatchPricing() | Retrieve pricing for multiple products | Partner | BatchPricing | — | safe, sync | Request: list of productIds. Response: pricing per product |
