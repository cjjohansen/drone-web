# Catalog Management v2 — High-Level API Design

> **Phase:** ADDR — Design
> **Status:** Draft
> **Style Guide:** [style-guide.md](../../../style-guide.md)

---

## Product Lifecycle API

**Base Path:** `/product-lifecycle/v1`

| HTTP Method | Resource Path | Operation Name | Description | Request | Response (Success) | Response (Error) |
|-------------|---------------|----------------|-------------|---------|--------------------|------------------|
| GET | /product-lifecycle/v1/products | searchProductsForManagement() | Query products for admin workflows | Query: `query`, `lifecycleState`, `brand`, `offset`, `limit`, `sort` | `200 OK` — `{ totalResults, products: [Product], offset, limit }` | `400` invalid filters |
| POST | /product-lifecycle/v1/products | createProduct() | Create product master record | Body: identity, naming, baseline specs | `201 Created` — Product | `400`, `409` duplicate sku |
| PATCH | /product-lifecycle/v1/products/{productId}/specifications | updateProductSpecifications() | Update technical specifications | Path: `productId`; Body: specification attributes; Header: `If-Match` | `200 OK` — Product | `400`, `404`, `412` |
| POST | /product-lifecycle/v1/products/{productId}/lifecycle-transitions | setProductLifecycleState() | Transition lifecycle state | Path: `productId`; Body: `{ targetState, reason }`; Header: `Idempotency-Key` | `201 Created` — ProductLifecycleTransition + Product | `400`, `404`, `409` invalid transition |
| PATCH | /product-lifecycle/v1/products/{productId} | updateProductAttributes() | Update non-spec product attributes | Path: `productId`; Body: changed attributes; Header: `If-Match` | `200 OK` — Product | `400`, `404`, `412` |
| POST | /product-lifecycle/v1/products/{productId}/discontinuations | discontinueProduct() | Mark product as discontinued | Path: `productId`; Body: discontinuation reason; Header: `Idempotency-Key` | `201 Created` — ProductLifecycleTransition + Product | `400`, `404`, `409` |
| PUT | /product-lifecycle/v1/products/{productId}/replacement | linkReplacementProduct() | Set replacement product link | Path: `productId`; Body: `{ replacementProductId, reasonCode }` | `200 OK` — ProductReplacementLink | `400`, `404`, `409` |

---

## Technical Documentation API

**Base Path:** `/technical-docs/v1`

| HTTP Method | Resource Path | Operation Name | Description | Request | Response (Success) | Response (Error) |
|-------------|---------------|----------------|-------------|---------|--------------------|------------------|
| POST | /technical-docs/v1/documents | uploadDocument() | Upload technical document artifact | Body: `{ productId, documentType, title, storageReference, checksum }`; Header: `Idempotency-Key` | `201 Created` — Document + initial DocumentVersion | `400`, `404`, `409` |
| PUT | /technical-docs/v1/products/{productId}/documents/{documentId} | associateDocumentToProduct() | Link document to product | Path: `productId`, `documentId`; Body: `{ isPrimary }` | `200 OK` — ProductDocumentLink | `400`, `404`, `409` |
| PATCH | /technical-docs/v1/documents/{documentId} | updateDocumentMetadata() | Update document metadata and tags | Path: `documentId`; Body: metadata attributes; Header: `If-Match` | `200 OK` — Document | `400`, `404`, `412` |
| POST | /technical-docs/v1/documents/{documentId}/versions | publishDocumentVersion() | Publish a new document version | Path: `documentId`; Body: `{ storageReference, checksum, versionNotes }`; Header: `Idempotency-Key` | `201 Created` — DocumentVersion + Document | `400`, `404`, `409` |
| POST | /technical-docs/v1/documents/{documentId}/retirements | retireDocument() | Retire obsolete document | Path: `documentId`; Body: `{ reason }`; Header: `Idempotency-Key` | `201 Created` — Document | `400`, `404`, `409` |

---

## Pricing and Promotions API

**Base Path:** `/pricing/v1`

| HTTP Method | Resource Path | Operation Name | Description | Request | Response (Success) | Response (Error) |
|-------------|---------------|----------------|-------------|---------|--------------------|------------------|
| PUT | /pricing/v1/price-book-entries/{productId}/base-price | setBasePrice() | Set base product price | Path: `productId`; Body: `{ basePrice, currency, effectiveFrom, effectiveTo }`; Header: `If-Match` (optional) | `200 OK` — PriceBookEntry | `400`, `404`, `409`, `412` |
| PUT | /pricing/v1/price-book-entries/{productId}/volume-tiers | setVolumeDiscountTiers() | Replace volume discount tiers | Path: `productId`; Body: `{ tiers: [VolumeTier] }`; Header: `If-Match` (optional) | `200 OK` — PriceBookEntry + tiers | `400`, `404`, `409`, `412` |
| POST | /pricing/v1/promotions | startPromotion() | Start promotion window | Body: scope, type/value, `startsAt`, `endsAt`; Header: `Idempotency-Key` | `201 Created` — PromotionWindow | `400`, `404`, `409` |
| POST | /pricing/v1/promotions/{promotionId}/cancellations | cancelPromotion() | Cancel active or scheduled promotion | Path: `promotionId`; Body: `{ reason }`; Header: `Idempotency-Key` | `201 Created` — PromotionWindow | `400`, `404`, `409` |
| POST | /pricing/v1/repricing-jobs | applyPriceAdjustment() | Queue scoped repricing job | Body: `{ scopeType, scopeReference, adjustmentType, adjustmentValue }`; Header: `Idempotency-Key` | `202 Accepted` — RepricingJob (`queued`) | `400`, `404`, `409` |

---

## Inventory and Availability API

**Base Path:** `/inventory/v1`

| HTTP Method | Resource Path | Operation Name | Description | Request | Response (Success) | Response (Error) |
|-------------|---------------|----------------|-------------|---------|--------------------|------------------|
| POST | /inventory/v1/inventory-positions/search | queryInventoryStatus() | Query inventory posture for admin review | Body: product/location/status filters, `offset`, `limit`, `sort` | `200 OK` — `{ totalResults, inventoryPositions: [InventoryPosition], offset, limit }` | `400` invalid filters |
| PUT | /inventory/v1/inventory-positions/{inventoryId}/quantity | updateStockQuantity() | Set on-hand quantity | Path: `inventoryId`; Body: `{ onHandQuantity, reason }`; Header: `If-Match` | `200 OK` — InventoryPosition | `400`, `404`, `409`, `412` |
| PUT | /inventory/v1/restock-plans/{productId} | setRestockDate() | Set expected restock plan | Path: `productId`; Body: `{ expectedDate, expectedQuantity, supplierReference }`; Header: `If-Match` (optional) | `200 OK` — RestockPlan | `400`, `404`, `409`, `412` |
| PATCH | /inventory/v1/availability-policies/{productId}/lead-time | updateLeadTime() | Update lead time | Path: `productId`; Body: `{ leadTimeDays }`; Header: `If-Match` | `200 OK` — AvailabilityPolicy | `400`, `404`, `412` |
| PATCH | /inventory/v1/availability-policies/{productId}/backorder-state | setBackorderState() | Enable or disable backorder | Path: `productId`; Body: `{ backorderEnabled, reason }`; Header: `If-Match` | `200 OK` — AvailabilityPolicy | `400`, `404`, `409`, `412` |
| POST | /inventory/v1/availability-policies/{productId}/suspensions | suspendProductAvailability() | Suspend product availability | Path: `productId`; Body: `{ reason }`; Header: `Idempotency-Key` | `201 Created` — AvailabilityPolicy | `400`, `404`, `409` |

---

## Category and Faceting API

**Base Path:** `/taxonomy/v1`

| HTTP Method | Resource Path | Operation Name | Description | Request | Response (Success) | Response (Error) |
|-------------|---------------|----------------|-------------|---------|--------------------|------------------|
| POST | /taxonomy/v1/categories | createCategory() | Create category node | Body: `{ parentCategoryId, name, slug, sortOrder }`; Header: `Idempotency-Key` | `201 Created` — Category | `400`, `404`, `409` duplicate slug |
| PATCH | /taxonomy/v1/categories/{categoryId} | updateCategory() | Update category metadata | Path: `categoryId`; Body: changed metadata; Header: `If-Match` | `200 OK` — Category | `400`, `404`, `412` |
| POST | /taxonomy/v1/categories/{categoryId}/moves | moveCategory() | Move category in hierarchy | Path: `categoryId`; Body: `{ newParentCategoryId, newPosition }`; Header: `Idempotency-Key` | `201 Created` — Category | `400`, `404`, `409` cycle detected |
| POST | /taxonomy/v1/categories/{categoryId}/retirements | retireCategory() | Retire category from active tree | Path: `categoryId`; Body: `{ reason }`; Header: `Idempotency-Key` | `201 Created` — Category | `400`, `404`, `409` |
| PUT | /taxonomy/v1/categories/{categoryId}/products/{productId} | assignProductToCategory() | Assign product to category | Path: `categoryId`, `productId`; Body: `{ assignmentType }` | `200 OK` — CategoryAssignment | `400`, `404`, `409` |
| DELETE | /taxonomy/v1/categories/{categoryId}/products/{productId} | removeProductFromCategory() | Remove product-category assignment | Path: `categoryId`, `productId` | `204 No Content` | `404`, `409` |
| PUT | /taxonomy/v1/categories/{categoryId}/facets | defineCategoryFacets() | Replace facet configuration for category | Path: `categoryId`; Body: `{ facets: [FacetDefinition] }`; Header: `If-Match` (optional) | `200 OK` — `{ categoryId, facets }` | `400`, `404`, `409`, `412` |

---

## Compatibility Rules API

**Base Path:** `/compatibility-rules/v1`

| HTTP Method | Resource Path | Operation Name | Description | Request | Response (Success) | Response (Error) |
|-------------|---------------|----------------|-------------|---------|--------------------|------------------|
| POST | /compatibility-rules/v1/compatibility-rules | createCompatibilityRule() | Create compatibility rule | Body: rule definition, component types, severity; Header: `Idempotency-Key` | `201 Created` — CompatibilityRule | `400`, `404`, `409` |
| PATCH | /compatibility-rules/v1/compatibility-rules/{ruleId} | updateCompatibilityRule() | Update compatibility rule | Path: `ruleId`; Body: changed fields; Header: `If-Match` | `200 OK` — CompatibilityRule | `400`, `404`, `412` |
| POST | /compatibility-rules/v1/compatibility-rules/{ruleId}/deactivations | deactivateCompatibilityRule() | Deactivate compatibility rule | Path: `ruleId`; Body: `{ reason }`; Header: `Idempotency-Key` | `201 Created` — CompatibilityRule | `400`, `404`, `409` |
| POST | /compatibility-rules/v1/component-groups | createComponentGroup() | Create component group | Body: metadata + initial members; Header: `Idempotency-Key` | `201 Created` — ComponentGroup | `400`, `404`, `409` |
| PATCH | /compatibility-rules/v1/component-groups/{componentGroupId} | updateComponentGroup() | Update component group membership | Path: `componentGroupId`; Body: member changes; Header: `If-Match` | `200 OK` — ComponentGroup | `400`, `404`, `412` |

---

## Catalog Governance API

**Base Path:** `/catalog-governance/v1`

| HTTP Method | Resource Path | Operation Name | Description | Request | Response (Success) | Response (Error) |
|-------------|---------------|----------------|-------------|---------|--------------------|------------------|
| POST | /catalog-governance/v1/approval-cases | submitApprovalCase() | Submit high-risk change for review | Body: `{ changeType, boundarySource, sourceReferenceId, riskLevel, rationale }`; Header: `Idempotency-Key` | `201 Created` — ApprovalCase | `400`, `404`, `409` |
| PUT | /catalog-governance/v1/approval-cases/{approvalCaseId}/reviewer-assignment | assignApprovalReviewer() | Assign reviewer to case | Path: `approvalCaseId`; Body: `{ reviewerId }` | `200 OK` — ApprovalCase | `400`, `404`, `409` |
| POST | /catalog-governance/v1/approval-cases/{approvalCaseId}/decisions | recordApprovalDecision() | Record approval decision | Path: `approvalCaseId`; Body: `{ decision, rationale }`; Header: `Idempotency-Key` | `201 Created` — ApprovalDecision + ApprovalCase | `400`, `404`, `409` decision already recorded |
| POST | /catalog-governance/v1/approval-cases/{approvalCaseId}/publication-gate-releases | releasePublicationGate() | Release publication gate | Path: `approvalCaseId`; Header: `Idempotency-Key` | `201 Created` — PublicationGate | `400`, `404`, `409` not approved |

---

## Bulk Ingestion API

**Base Path:** `/bulk-ingestion/v1`

| HTTP Method | Resource Path | Operation Name | Description | Request | Response (Success) | Response (Error) |
|-------------|---------------|----------------|-------------|---------|--------------------|------------------|
| POST | /bulk-ingestion/v1/import-batches | submitImportBatch() | Submit import batch for asynchronous processing | Body: `{ sourceSystem, submittedFileReference, submissionChecksum, totalItems }`; Header: `Idempotency-Key` | `202 Accepted` — ImportBatch (`queued`) | `400`, `409`, `422` |
| GET | /bulk-ingestion/v1/import-batches/{importBatchId}/results | getImportBatchResults() | Retrieve batch processing outcomes | Path: `importBatchId`; Query: `processingStatus`, `offset`, `limit` | `200 OK` — `{ importBatch, itemResults: [ImportItemResult], offset, limit }` | `400`, `404` |
| POST | /bulk-ingestion/v1/import-batches/{importBatchId}/replay-requests | replayFailedImportItems() | Replay failed import items | Path: `importBatchId`; Body: `{ itemKeys: [string] }`; Header: `Idempotency-Key` | `202 Accepted` — ImportReplayRequest (`queued`) | `400`, `404`, `409`, `422` |
