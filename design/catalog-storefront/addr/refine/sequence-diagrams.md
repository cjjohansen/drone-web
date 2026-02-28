# Catalog Storefront — Sequence Diagrams (HTTP)

> **Phase:** ADDR — Refine
> **Format:** Mermaid sequence diagrams with HTTP methods and status codes
>
> **Note:** Product and check IDs are abbreviated for diagram readability. See the OpenAPI specs for full UUID examples.

---

## JS1: Product Discovery

```mermaid
sequenceDiagram
    actor User as Professional Integrator
    participant API as Catalog API

    User->>API: POST /products/autocomplete { query: "brus" }
    API-->>User: 200 OK { suggestedTerms, suggestedCategories, suggestedProducts }

    User->>API: POST /products/search { query: "brushless motor 2207", filters, sort, offset, limit }
    API-->>User: 200 OK { totalResults: 47, products: [...], offset, limit }

    Note over User,API: User refines search with additional filters

    User->>API: POST /products/search { query: "brushless motor 2207", filters: { kvRating: {min:1700}, voltage: "6S" } }
    API-->>User: 200 OK { totalResults: 12, products: [...] }
```

---

## JS2: Product Evaluation

```mermaid
sequenceDiagram
    actor User as Professional Integrator
    participant API as Catalog API

    User->>API: GET /products/prod-001
    API-->>User: 200 OK { productId, name, specs, pricing, availability, ... }

    User->>API: GET /products/prod-001/documents?type=datasheet
    API-->>User: 200 OK [{ documentId, title, type, url }]

    User->>API: GET /products/prod-001/pricing
    API-->>User: 200 OK { basePrice: 18.99, volumeDiscounts: [...] }

    User->>API: GET /products/prod-001/availability
    API-->>User: 200 OK { status: "in-stock", quantityAvailable: 342 }

    User->>API: GET /products/prod-001/reviews?sort=rating&limit=5
    API-->>User: 200 OK { averageRating: 4.6, reviews: [...] }

    User->>API: GET /products/prod-001/compatible?limit=5
    API-->>User: 200 OK { totalResults: 12, products: [...] }

    User->>API: GET /products/prod-001/similar?limit=5
    API-->>User: 200 OK { totalResults: 8, products: [...] }

    User->>API: GET /products/prod-001/frequently-bought-together?limit=5
    API-->>User: 200 OK [{ productId, name, pricing }]
```

---

## JS3: Product Comparison

```mermaid
sequenceDiagram
    actor User as Fleet Procurement Buyer
    participant API as Catalog API

    Note over User,API: User has identified 3 candidate motors from JS1/JS2

    User->>API: POST /products/compare { productIds: ["prod-001", "prod-002", "prod-003"] }
    API-->>User: 200 OK { products, sharedSpecifications, differingSpecifications }

    Note over User,API: User decides based on comparison matrix
```

---

## JS4: Compatibility Verification

```mermaid
sequenceDiagram
    actor User as Professional Integrator
    participant CatalogAPI as Catalog API
    participant CompAPI as Compatibility API

    Note over User,CompAPI: User has selected components for a build

    User->>CompAPI: POST /checks { productIds: ["prod-001", "prod-010", "prod-020", "prod-030"] }
    CompAPI-->>User: 201 Created { checkId: "chk-001", status: "fail", incompatibilities: [{componentA, componentB, rule, type}] }

    Note over User,CompAPI: ESC voltage mismatch detected

    User->>CompAPI: GET /checks/chk-001/replacements/prod-020
    CompAPI-->>User: 200 OK [{ productId: "prod-021", name: "T-Motor F45A 6S", ... }]

    Note over User,CatalogAPI: User evaluates the replacement

    User->>CatalogAPI: GET /products/prod-021
    CatalogAPI-->>User: 200 OK { full product details }

    User->>CompAPI: POST /checks { productIds: ["prod-001", "prod-010", "prod-021", "prod-030"] }
    CompAPI-->>User: 201 Created { checkId: "chk-002", status: "pass", incompatibilities: [] }
```

---

## JS5: Catalog Browsing

```mermaid
sequenceDiagram
    actor User as Casual Browser
    participant API as Catalog API

    User->>API: GET /categories
    API-->>User: 200 OK [{ categoryId: "cat-motors", name: "Motors", childCategories: [...] }, ...]

    User->>API: GET /categories/cat-motors-brushless/facets
    API-->>User: 200 OK [{ name: "kvRating", type: "range" }, { name: "voltage", type: "enum" }]

    User->>API: GET /categories/cat-motors-brushless/products?sort=price&offset=0&limit=10
    API-->>User: 200 OK { totalResults: 78, products: [...] }

    Note over User,API: User clicks into a product from the listing

    User->>API: GET /products/prod-001
    API-->>User: 200 OK { full product details }
```

---

## JS6: Partner Catalog Access

```mermaid
sequenceDiagram
    actor Partner as Partner System
    participant API as Partner Catalog API

    Partner->>API: GET /feed?lastUpdatedSince=2026-02-01T00:00:00Z&limit=100
    API-->>Partner: 200 OK { feedId, generatedDate, products: [...], offset, limit }

    Note over Partner,API: Partner checks availability for specific products

    Partner->>API: POST /availability { productIds: ["prod-001", "prod-010", "prod-020"] }
    API-->>Partner: 200 OK [{ productId, status, quantityAvailable }]

    Partner->>API: POST /pricing { productIds: ["prod-001", "prod-010"] }
    API-->>Partner: 200 OK [{ productId, basePrice, volumeDiscounts, currency }]
```
