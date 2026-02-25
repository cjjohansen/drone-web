# Catalog Management v2 — API Resources

> **Phase:** ADDR — Define
> **Status:** Draft

---

## Product Lifecycle API — Resources

### Product

| Property | Description |
|----------|-------------|
| productId | Unique identifier for the product |
| sku | Internal stock keeping identifier |
| name | Product display name |
| shortDescription | Listing summary text |
| longDescription | Full technical/marketing description |
| brand | Manufacturer or brand |
| lifecycleState | draft, pending-approval, active, discontinued |
| replacementProductId | Optional successor product reference |
| technicalSpecifications | Structured technical attributes |
| createdBy | Actor that created the record |
| createdAt | Creation timestamp |
| updatedAt | Last update timestamp |

**Relationships:** has zero or more ProductLifecycleTransitions; may reference one replacement Product

### ProductLifecycleTransition

| Property | Description |
|----------|-------------|
| transitionId | Unique transition identifier |
| productId | Product reference |
| fromState | Previous lifecycle state |
| toState | Target lifecycle state |
| reason | Business rationale for transition |
| requestedBy | Actor requesting the transition |
| approvedBy | Optional approver reference |
| transitionedAt | Transition timestamp |

**Relationships:** belongs to one Product; may reference one ApprovalCase

### ProductReplacementLink

| Property | Description |
|----------|-------------|
| linkId | Unique replacement link identifier |
| discontinuedProductId | Discontinued product reference |
| replacementProductId | Recommended successor product reference |
| reasonCode | Why the replacement was chosen |
| linkedAt | Link creation timestamp |

**Relationships:** links one source Product to one replacement Product

---

## Technical Documentation API — Resources

### Document

| Property | Description |
|----------|-------------|
| documentId | Unique document identifier |
| productId | Product reference |
| documentType | datasheet, manual, compliance-certificate, cad-file |
| title | Display title |
| status | draft, published, retired |
| currentVersionId | Active version reference |
| tags | Search and classification labels |
| createdAt | Initial upload timestamp |
| updatedAt | Last metadata update timestamp |

**Relationships:** belongs to one Product; has one or more DocumentVersions

### DocumentVersion

| Property | Description |
|----------|-------------|
| versionId | Unique version identifier |
| documentId | Parent document reference |
| versionNumber | Sequential version label |
| storageReference | Artifact storage pointer |
| checksum | Content integrity value |
| publishedAt | Version publication timestamp |
| publishedBy | Actor that published the version |

**Relationships:** belongs to one Document

### ProductDocumentLink

| Property | Description |
|----------|-------------|
| linkId | Unique association identifier |
| productId | Product reference |
| documentId | Document reference |
| isPrimary | Whether document is primary for its type |
| linkedAt | Association timestamp |

**Relationships:** associates one Product with one Document

---

## Pricing and Promotions API — Resources

### PriceBookEntry

| Property | Description |
|----------|-------------|
| priceEntryId | Unique pricing entry identifier |
| productId | Product reference |
| currency | ISO currency code |
| basePrice | Current base price |
| effectiveFrom | Start of effective period |
| effectiveTo | Optional end of effective period |
| status | pending, active, superseded |
| lastChangedAt | Last mutation timestamp |

**Relationships:** belongs to one Product; has zero or more VolumeTiers and PromotionWindows

### VolumeTier

| Property | Description |
|----------|-------------|
| tierId | Unique tier identifier |
| priceEntryId | Pricing entry reference |
| minQuantity | Inclusive lower quantity bound |
| maxQuantity | Optional upper quantity bound |
| tierPrice | Effective price for the tier |
| tierOrder | Tier precedence order |

**Relationships:** belongs to one PriceBookEntry

### PromotionWindow

| Property | Description |
|----------|-------------|
| promotionId | Unique promotion identifier |
| productId | Product reference |
| promotionType | percentage, fixed-amount, bundle |
| promotionValue | Value corresponding to type |
| startsAt | Promotion start timestamp |
| endsAt | Promotion end timestamp |
| status | scheduled, active, canceled, completed |
| canceledReason | Optional cancellation reason |

**Relationships:** belongs to one Product

### RepricingJob

| Property | Description |
|----------|-------------|
| repricingJobId | Unique job identifier |
| scopeType | category, product-group, supplier |
| scopeReference | Identifier of repricing scope |
| adjustmentType | increase, decrease, set |
| adjustmentValue | Adjustment magnitude |
| status | queued, running, completed, failed |
| submittedAt | Submission timestamp |
| completedAt | Optional completion timestamp |

**Relationships:** affects many PriceBookEntries; may reference one ApprovalCase

---

## Inventory and Availability API — Resources

### InventoryPosition

| Property | Description |
|----------|-------------|
| inventoryId | Unique inventory record identifier |
| productId | Product reference |
| onHandQuantity | Current stock count |
| reservedQuantity | Quantity already allocated |
| safetyStock | Minimum operational threshold |
| warehouseLocation | Fulfillment location reference |
| lastCountedAt | Last verified count timestamp |

**Relationships:** belongs to one Product; may reference one RestockPlan

### AvailabilityPolicy

| Property | Description |
|----------|-------------|
| policyId | Unique policy identifier |
| productId | Product reference |
| leadTimeDays | Expected lead time |
| backorderEnabled | Whether backorders are allowed |
| availabilityState | available, backordered, suspended, discontinued |
| suspensionReason | Optional reason for suspension |
| updatedAt | Last policy update timestamp |

**Relationships:** belongs to one Product

### RestockPlan

| Property | Description |
|----------|-------------|
| restockPlanId | Unique restock plan identifier |
| productId | Product reference |
| expectedDate | Planned restock date |
| expectedQuantity | Planned incoming quantity |
| supplierReference | Supplier or PO reference |
| status | planned, in-transit, received, delayed |

**Relationships:** belongs to one Product

---

## Category and Faceting API — Resources

### Category

| Property | Description |
|----------|-------------|
| categoryId | Unique category identifier |
| parentCategoryId | Optional parent category reference |
| name | Category display name |
| slug | URL-friendly category key |
| description | Category purpose text |
| sortOrder | Display ordering value |
| status | active, archived |
| updatedAt | Last update timestamp |

**Relationships:** may have one parent Category; has zero or more child Categories; has zero or more CategoryAssignments

### CategoryAssignment

| Property | Description |
|----------|-------------|
| assignmentId | Unique assignment identifier |
| categoryId | Category reference |
| productId | Product reference |
| assignmentType | primary, secondary |
| assignedAt | Assignment timestamp |
| assignedBy | Actor that performed assignment |

**Relationships:** associates one Product to one Category

### FacetDefinition

| Property | Description |
|----------|-------------|
| facetId | Unique facet identifier |
| categoryId | Category reference |
| facetName | Filter display name |
| facetType | enum, range, boolean |
| allowedValues | Optional allowed list |
| unit | Optional measurement unit |
| isFilterable | Whether shown as filter |
| isSortable | Whether usable for sort |

**Relationships:** belongs to one Category

---

## Compatibility Rules API — Resources

### CompatibilityRule

| Property | Description |
|----------|-------------|
| ruleId | Unique rule identifier |
| name | Rule name |
| description | Rule intent and domain meaning |
| componentTypeA | First component type |
| componentTypeB | Second component type |
| constraintExpression | Business rule expression |
| severity | error, warning |
| status | draft, active, inactive |
| effectiveFrom | Rule activation timestamp |
| effectiveTo | Optional deactivation timestamp |

**Relationships:** may reference one or more ComponentGroups; may reference one ApprovalCase

### ComponentGroup

| Property | Description |
|----------|-------------|
| componentGroupId | Unique group identifier |
| name | Group display name |
| description | Group purpose |
| componentType | Supported component type |
| memberProductIds | List of product identifiers in group |
| status | active, archived |
| updatedAt | Last group update timestamp |

**Relationships:** contains many Products; can be referenced by many CompatibilityRules

---

## Catalog Governance API — Resources

### ApprovalCase

| Property | Description |
|----------|-------------|
| approvalCaseId | Unique case identifier |
| changeType | pricing-change, lifecycle-change, rule-change, bulk-import |
| boundarySource | Originating boundary |
| sourceReferenceId | Identifier of proposed change entity |
| riskLevel | low, medium, high, critical |
| status | pending, approved, rejected, expired |
| submittedBy | Actor that submitted case |
| submittedAt | Submission timestamp |
| decidedAt | Optional decision timestamp |

**Relationships:** has one or more ApprovalDecisions; gates one source change request

### ApprovalDecision

| Property | Description |
|----------|-------------|
| decisionId | Unique decision identifier |
| approvalCaseId | Case reference |
| decision | approve, reject |
| reviewerId | Reviewer reference |
| rationale | Decision rationale |
| decidedAt | Decision timestamp |

**Relationships:** belongs to one ApprovalCase

### PublicationGate

| Property | Description |
|----------|-------------|
| gateId | Unique gate identifier |
| approvalCaseId | Case reference |
| gateState | locked, released |
| releasedBy | Optional releaser reference |
| releasedAt | Optional release timestamp |

**Relationships:** belongs to one ApprovalCase

---

## Bulk Ingestion API — Resources

### ImportBatch

| Property | Description |
|----------|-------------|
| importBatchId | Unique batch identifier |
| sourceSystem | Originating system or partner |
| submittedFileReference | File/object reference |
| submissionChecksum | Integrity checksum |
| submittedBy | Actor that submitted batch |
| submittedAt | Submission timestamp |
| status | queued, validating, processing, completed, failed, partial |
| totalItems | Number of submitted records |
| successfulItems | Number of successful records |
| failedItems | Number of failed records |

**Relationships:** has one or more ImportItemResults; may reference one ApprovalCase

### ImportItemResult

| Property | Description |
|----------|-------------|
| itemResultId | Unique item result identifier |
| importBatchId | Parent batch reference |
| sourceItemKey | Source-system idempotency key |
| processingStatus | succeeded, failed, skipped |
| errorCode | Optional processing failure code |
| errorMessage | Optional failure description |
| targetResourceId | Optional created/updated resource identifier |
| processedAt | Processing timestamp |

**Relationships:** belongs to one ImportBatch

### ImportReplayRequest

| Property | Description |
|----------|-------------|
| replayRequestId | Unique replay request identifier |
| importBatchId | Batch reference |
| itemKeys | List of failed item keys to replay |
| requestedBy | Actor requesting replay |
| requestedAt | Replay request timestamp |
| status | queued, running, completed, failed |

**Relationships:** references one ImportBatch and one or more ImportItemResults
