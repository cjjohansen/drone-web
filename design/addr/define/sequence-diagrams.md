# Catalog Storefront — Sequence Diagrams

> **Phase:** ADDR — Define
> **Status:** Draft

---

## JS1: Product Discovery

```mermaid
sequenceDiagram
    actor Customer
    participant Catalog as Catalog API

    Customer->>Catalog: getAutocompleteSuggestions(partialQuery)
    Catalog-->>Customer: suggested terms, categories, products

    Customer->>Catalog: searchProducts(query, filters, sort, offset, limit)
    Catalog-->>Customer: search results with product summaries

    Customer->>Catalog: searchProducts(query, updatedFilters, sort, offset, limit)
    Catalog-->>Customer: narrowed search results

    Customer->>Catalog: searchProducts(query, filters, newSort, offset, limit)
    Catalog-->>Customer: re-sorted results

    Customer->>Catalog: searchProducts(query, filters, sort, nextOffset, limit)
    Catalog-->>Customer: next page of results
```

## JS2: Product Evaluation

```mermaid
sequenceDiagram
    actor Customer
    participant Catalog as Catalog API

    Customer->>Catalog: getProduct(productId)
    Catalog-->>Customer: full product details (specs, descriptions, images)

    Customer->>Catalog: getProductDocuments(productId)
    Catalog-->>Customer: datasheets, CAD files, compliance certificates

    Customer->>Catalog: getProductPricing(productId)
    Catalog-->>Customer: pricing, volume discounts, promotions

    Customer->>Catalog: getProductAvailability(productId)
    Catalog-->>Customer: stock status, quantity, restock date

    Customer->>Catalog: getProductReviews(productId, offset, limit)
    Catalog-->>Customer: ratings and reviews

    Customer->>Catalog: getCompatibleProducts(productId)
    Catalog-->>Customer: compatible products list

    Customer->>Catalog: getSimilarProducts(productId)
    Catalog-->>Customer: similar alternatives

    Customer->>Catalog: getFrequentlyBoughtTogether(productId)
    Catalog-->>Customer: frequently bought together products
```

## JS3: Product Comparison

```mermaid
sequenceDiagram
    actor Customer
    participant Catalog as Catalog API

    Customer->>Catalog: compareProducts([productId1, productId2, productId3])
    Catalog-->>Customer: comparison matrix (shared + differing specs)
```

## JS4: Compatibility Verification

```mermaid
sequenceDiagram
    actor Customer
    participant Compat as Compatibility API

    Customer->>Compat: checkCompatibility([motorId, escId, propellerId, batteryId])
    Compat-->>Customer: check result (pass/fail, incompatibility details)

    alt Incompatibilities found
        Customer->>Compat: getCompatibleReplacements(checkId, incompatibleProductId)
        Compat-->>Customer: list of compatible replacement products
    end
```

## JS5: Catalog Browsing

```mermaid
sequenceDiagram
    actor Customer
    participant Catalog as Catalog API

    Customer->>Catalog: getCategoryTree()
    Catalog-->>Customer: full category hierarchy

    Customer->>Catalog: getCategoryFacets(categoryId)
    Catalog-->>Customer: available filter facets (KV range, shaft diameter, weight, etc.)

    Customer->>Catalog: getCategoryProducts(categoryId, filters, sort, offset, limit)
    Catalog-->>Customer: products in category
```

## JS6: Partner Catalog Access

```mermaid
sequenceDiagram
    actor Partner as Partner System
    participant Feed as Partner Catalog API

    Partner->>Feed: getCatalogFeed(lastUpdatedSince, offset, limit)
    Feed-->>Partner: bulk product catalog data

    Partner->>Feed: getBatchAvailability([productId1, productId2, ...])
    Feed-->>Partner: availability status per product

    Partner->>Feed: getBatchPricing([productId1, productId2, ...])
    Feed-->>Partner: pricing per product
```
