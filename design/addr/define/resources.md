# Catalog Storefront — API Resources

> **Phase:** ADDR — Define
> **Status:** Draft

---

## Catalog API — Resources

### Product

| Property | Description |
|----------|-------------|
| productId | Unique identifier |
| name | Product display name |
| description | Full product description |
| shortDescription | Brief summary for listings |
| brand | Manufacturer or brand name |
| sku | Stock keeping unit |
| status | active, discontinued, backorder |
| images | List of product image references |
| specifications | Key-value pairs of technical specs (voltage, KV, weight, thrust, dimensions, etc.) |
| categories | List of category references |
| pricing | Current price, volume discounts, active promotions |
| availability | In stock, backorder, discontinued, quantity available |
| compatibleWith | List of product references known to be compatible |
| relatedProducts | List of similar alternative product references |
| frequentlyBoughtWith | List of commonly co-purchased product references |
| createdDate | When the product was added to catalog |
| updatedDate | When the product was last modified |

**Relationships:** belongs to one or more Categories; has zero or more Reviews; has zero or more TechnicalDocuments

### Category

| Property | Description |
|----------|-------------|
| categoryId | Unique identifier |
| name | Category display name |
| description | Category description |
| parentCategory | Reference to parent category (null for root) |
| childCategories | List of child category references |
| facets | Available filter facets for this category |
| productCount | Number of products in this category |
| sortOrder | Display ordering |

**Relationships:** has zero or more child Categories; contains zero or more Products

### Review

| Property | Description |
|----------|-------------|
| reviewId | Unique identifier |
| productId | Reference to reviewed product |
| rating | Numeric rating |
| title | Review title |
| body | Review content |
| author | Reviewer display name |
| verifiedPurchase | Whether reviewer purchased the product |
| createdDate | When the review was submitted |

**Relationships:** belongs to one Product

### TechnicalDocument

| Property | Description |
|----------|-------------|
| documentId | Unique identifier |
| productId | Reference to associated product |
| title | Document title |
| type | datasheet, cad-file, compliance-certificate, manual |
| format | PDF, STEP, DXF, etc. |
| url | Download reference |
| fileSize | Size of the document |

**Relationships:** belongs to one Product

### SearchResult

| Property | Description |
|----------|-------------|
| query | Original search query |
| totalResults | Total matching products |
| filters | Applied filters |
| sortBy | Applied sort field |
| products | List of matching product summaries |

### Suggestion

| Property | Description |
|----------|-------------|
| query | Partial query text |
| suggestedTerms | List of suggested search terms |
| suggestedCategories | List of matching category references |
| suggestedProducts | List of matching product references |

### ComparisonMatrix

| Property | Description |
|----------|-------------|
| products | List of products being compared |
| sharedSpecifications | Specs present in all compared products with their values |
| differingSpecifications | Specs that differ between compared products |

---

## Compatibility API — Resources

### CompatibilityCheck

| Property | Description |
|----------|-------------|
| checkId | Unique identifier |
| components | List of product references submitted for checking |
| status | pass, fail, partial |
| incompatibilities | List of incompatibility details |
| checkedDate | When the check was performed |

**Relationships:** references one or more Products (from Catalog); contains zero or more Incompatibilities

### Incompatibility

| Property | Description |
|----------|-------------|
| componentA | First conflicting component reference |
| componentB | Second conflicting component reference |
| rule | Description of the violated rule |
| type | voltage-mismatch, current-exceeded, physical-fit, protocol-mismatch |
| severity | error, warning |
| suggestedReplacements | List of compatible alternative product references |

### CompatibilityRule

| Property | Description |
|----------|-------------|
| ruleId | Unique identifier |
| name | Rule display name |
| description | What the rule validates |
| componentTypeA | First component type (e.g., motor) |
| componentTypeB | Second component type (e.g., ESC) |
| constraint | The compatibility constraint definition |

---

## Partner Catalog API — Resources

### CatalogFeed

| Property | Description |
|----------|-------------|
| feedId | Unique identifier |
| generatedDate | When the feed was generated |
| productCount | Number of products in the feed |
| format | Feed format (JSON) |
| products | List of partner product representations |

### PartnerProduct (projection)

| Property | Description |
|----------|-------------|
| productId | Unique identifier |
| name | Product display name |
| brand | Manufacturer or brand name |
| sku | Stock keeping unit |
| description | Product description |
| specifications | Key-value pairs of technical specs |
| categories | List of category names |
| pricing | Current price information |
| availability | Stock status and quantity |
| images | List of product image references |
| updatedDate | Last modification date |

### BatchAvailability

| Property | Description |
|----------|-------------|
| productId | Product identifier |
| status | in-stock, backorder, discontinued |
| quantityAvailable | Available quantity |
| estimatedRestockDate | When backorder items are expected |

### BatchPricing

| Property | Description |
|----------|-------------|
| productId | Product identifier |
| basePrice | Standard price |
| volumeDiscounts | Tiered pricing for quantities |
| activePromotions | Current promotional pricing |
| currency | Price currency |
