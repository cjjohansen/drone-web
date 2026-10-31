# Catalog Management v2 — API Profiles

> **Phase:** ADDR — Define
> **Status:** Draft

---

## Product Lifecycle API

**Name:** Product Lifecycle API  
**Description:** Manages product master records and lifecycle transitions for write-side catalog administration.

| Operation Name | Description | Participants | Resource(s) | Emitted Events | Operation Characteristics | Operation Details |
|----------------|-------------|--------------|-------------|----------------|--------------------------|-------------------|
| searchProductsForManagement() | Query products for admin workflows | Product Lifecycle Manager, Governance Reviewer | Product | — | safe, sync | Request: query text, lifecycle filters, offset, limit. Response: product summaries for selection |
| createProduct() | Create a new product master record | Product Lifecycle Manager | Product | Product.Created | unsafe, sync | Request: identity, naming, baseline specifications. Response: created product summary and productId |
| updateProductSpecifications() | Update technical specification set | Product Lifecycle Manager | Product | Product.SpecificationUpdated | idempotent, sync on a draft; async (approval) on an active product | Request: productId, specification attributes; on an active product also reason and risk level. Response on a draft: updated specification summary. On an active product the request is a specification change request with all new values (drone-web D-039): `202 Accepted` with a link to the pending approval case and the unchanged product (drone-web D-041). After the release Product Data applies those values itself; the manager makes no second call (drone-web D-042). Conflict when a change is already in review or the product is discontinued |
| setProductLifecycleState() | Request a lifecycle transition; Catalog Governance reviews it before it takes effect | Product Lifecycle Manager, Governance Reviewer | Product, ProductLifecycleTransition, ApprovalCase | Product.LifecycleStateChanged (after the release) | unsafe, async (approval) | Request: productId, target state (typed: `active` or `discontinued`; only this state is applied after the release), reason. Response: `202 Accepted` with a link (`Location`) to the pending approval case and the unchanged product; the state changes only after Governance released the change, through publishProduct() or discontinueProduct() |
| updateProductAttributes() | Update non-spec core attributes | Product Lifecycle Manager | Product | Product.AttributesUpdated | idempotent, sync on a draft or a discontinued product; async (approval) on an active product | Request: productId, changed attributes; on an active product also reason and risk level. Response on a draft or a discontinued product: updated product summary. On an active product the request is a details change request with the new name and short description (drone-web D-039): `202 Accepted` with a link to the pending approval case and the unchanged product (drone-web D-041). After the release Product Data applies those values itself; the manager makes no second call (drone-web D-042). Conflict when a change is already in review |
| publishProduct() | Apply an activation that Catalog Governance released (the effect of a setProductLifecycleState() request for `active`) | Product Lifecycle Manager | Product, ProductLifecycleTransition | Product.Published | unsafe, sync | Request: productId. Response: lifecycle state and effective timestamp. Conflict when no released activation waits for the product |
| discontinueProduct() | Apply a discontinuation that Catalog Governance released (the effect of a setProductLifecycleState() request for `discontinued`) | Product Lifecycle Manager, Governance Reviewer | Product, ProductLifecycleTransition | Product.Discontinued | unsafe, sync | Request: productId, discontinuation reason. Response: lifecycle state and effective timestamp. Conflict when no released discontinuation waits for the product |
| linkReplacementProduct() | Link successor product for discontinued item | Product Lifecycle Manager | ProductReplacementLink | Product.ReplacementLinked | idempotent, sync | Request: discontinued productId, replacement productId, reasonCode. Response: replacement link summary |

---

## Technical Documentation API

**Name:** Technical Documentation API  
**Description:** Manages technical document upload, versioning, metadata quality, and product associations.

| Operation Name | Description | Participants | Resource(s) | Emitted Events | Operation Characteristics | Operation Details |
|----------------|-------------|--------------|-------------|----------------|--------------------------|-------------------|
| uploadDocument() | Upload technical document artifact | Documentation Steward | Document, DocumentVersion | Document.Uploaded | unsafe, sync | Request: productId, document type, title, artifact reference. Response: documentId and initial version metadata |
| associateDocumentToProduct() | Link document to product record | Documentation Steward | ProductDocumentLink | Product.DocumentAssociated | idempotent, sync | Request: productId, documentId, primary flag. Response: association summary |
| updateDocumentMetadata() | Update searchable/document metadata | Documentation Steward | Document | Document.MetadataUpdated | idempotent, sync | Request: documentId, metadata attributes/tags. Response: updated metadata summary |
| publishDocumentVersion() | Publish a new document version | Documentation Steward | DocumentVersion | Document.VersionPublished | unsafe, sync | Request: documentId, artifact reference, version notes. Response: new version summary |
| retireDocument() | Retire obsolete document | Documentation Steward, Governance Reviewer | Document | Document.Retired | unsafe, sync | Request: documentId, retirement reason. Response: document status and retirement timestamp |

---

## Pricing and Promotions API

**Name:** Pricing and Promotions API  
**Description:** Applies pricing policy, discount tiers, promotion windows, and scoped repricing.

| Operation Name | Description | Participants | Resource(s) | Emitted Events | Operation Characteristics | Operation Details |
|----------------|-------------|--------------|-------------|----------------|--------------------------|-------------------|
| setBasePrice() | Set or replace base product price | Pricing Analyst | PriceBookEntry | Price.BaseSet | idempotent, sync | Request: productId, base price, currency, effective period. Response: active price entry summary |
| setVolumeDiscountTiers() | Configure quantity discount tiers | Pricing Analyst | VolumeTier, PriceBookEntry | Price.VolumeTiersUpdated | idempotent, sync | Request: productId, tier list. Response: accepted tiers and effective range |
| startPromotion() | Start promotion window | Pricing Analyst, Governance Reviewer | PromotionWindow | Promotion.Started | unsafe, sync | Request: productId/scope, promotion type/value, time window. Response: promotion summary |
| cancelPromotion() | Cancel active or scheduled promotion | Pricing Analyst, Governance Reviewer | PromotionWindow | Promotion.Canceled | unsafe, sync | Request: promotionId, cancellation reason. Response: updated promotion status |
| applyPriceAdjustment() | Apply scoped repricing across products | Pricing Analyst, Governance Reviewer | RepricingJob | Price.GroupRepricingRequested | unsafe, async | Request: scope, adjustment type/value. Response: repricingJobId and queued status |

---

## Inventory and Availability API

**Name:** Inventory and Availability API  
**Description:** Maintains stock posture and fulfillment-facing availability settings.

| Operation Name | Description | Participants | Resource(s) | Emitted Events | Operation Characteristics | Operation Details |
|----------------|-------------|--------------|-------------|----------------|--------------------------|-------------------|
| queryInventoryStatus() | Query inventory posture for admin review | Inventory Controller | InventoryPosition | — | safe, sync | Request: product filter, location filter, status filter. Response: inventory status summaries |
| updateStockQuantity() | Set on-hand quantity | Inventory Controller | InventoryPosition | Inventory.QuantityUpdated | idempotent, sync | Request: productId, location, new quantity, reason. Response: updated inventory snapshot |
| setRestockDate() | Set expected restock date and quantity | Inventory Controller | RestockPlan | Inventory.RestockDateSet | idempotent, sync | Request: productId, expected date, expected quantity. Response: restock plan summary |
| updateLeadTime() | Update expected lead-time value | Inventory Controller | AvailabilityPolicy | Inventory.LeadTimeUpdated | idempotent, sync | Request: productId, lead-time days. Response: updated availability policy |
| setBackorderState() | Enable or disable backorder posture | Inventory Controller | AvailabilityPolicy | Inventory.BackorderStateChanged | idempotent, sync | Request: productId, backorder flag, reason. Response: updated backorder posture |
| suspendProductAvailability() | Suspend temporary purchasability | Inventory Controller, Governance Reviewer | AvailabilityPolicy | Inventory.AvailabilitySuspended | unsafe, sync | Request: productId, suspension reason. Response: suspension state summary |

---

## Category and Faceting API

**Name:** Category and Faceting API  
**Description:** Maintains taxonomy hierarchy, product assignments, and facet model controls.

| Operation Name | Description | Participants | Resource(s) | Emitted Events | Operation Characteristics | Operation Details |
|----------------|-------------|--------------|-------------|----------------|--------------------------|-------------------|
| createCategory() | Create category node | Taxonomy Manager | Category | Category.Created | unsafe, sync | Request: parent category (optional), name, slug, sort order. Response: created category summary |
| updateCategory() | Update category metadata | Taxonomy Manager | Category | Category.Updated | idempotent, sync | Request: categoryId, updated metadata. Response: updated category summary |
| moveCategory() | Move category to new hierarchy position | Taxonomy Manager | Category | Category.Moved | unsafe, sync | Request: categoryId, new parent, new position. Response: updated hierarchy placement |
| retireCategory() | Archive/remove category from active tree | Taxonomy Manager, Governance Reviewer | Category | Category.Retired | unsafe, sync | Request: categoryId, retirement reason. Response: retired category status |
| assignProductToCategory() | Assign product to category | Taxonomy Manager | CategoryAssignment | Category.ProductAssigned | idempotent, sync | Request: categoryId, productId, assignment type. Response: assignment summary |
| removeProductFromCategory() | Remove product-category assignment | Taxonomy Manager | CategoryAssignment | Category.ProductRemoved | idempotent, sync | Request: categoryId, productId. Response: removal confirmation |
| defineCategoryFacets() | Set category facet configuration | Taxonomy Manager | FacetDefinition | Category.FacetsDefined | idempotent, sync | Request: categoryId, facet definitions. Response: facet configuration summary |

---

## Compatibility Rules API

**Name:** Compatibility Rules API  
**Description:** Governs compatibility rules and component grouping used by compatibility checks.

| Operation Name | Description | Participants | Resource(s) | Emitted Events | Operation Characteristics | Operation Details |
|----------------|-------------|--------------|-------------|----------------|--------------------------|-------------------|
| createCompatibilityRule() | Create new compatibility rule | Compatibility Engineer, Governance Reviewer | CompatibilityRule | CompatibilityRule.Created | unsafe, sync | Request: rule definition, component types, severity. Response: created rule summary |
| updateCompatibilityRule() | Update existing compatibility rule | Compatibility Engineer, Governance Reviewer | CompatibilityRule | CompatibilityRule.Updated | idempotent, sync | Request: ruleId, changed definition fields. Response: updated rule summary |
| deactivateCompatibilityRule() | Deactivate rule from active use | Compatibility Engineer, Governance Reviewer | CompatibilityRule | CompatibilityRule.Deactivated | idempotent, sync | Request: ruleId, deactivation reason. Response: updated rule status |
| createComponentGroup() | Create component grouping baseline | Compatibility Engineer | ComponentGroup | ComponentGroup.Created | unsafe, sync | Request: group metadata and initial members. Response: created group summary |
| updateComponentGroup() | Update component group membership | Compatibility Engineer | ComponentGroup | ComponentGroup.Updated | idempotent, sync | Request: componentGroupId, member changes. Response: updated group summary |

---

## Catalog Governance API

**Name:** Catalog Governance API  
**Description:** Manages approval cases and release gates for high-risk catalog mutations.

| Operation Name | Description | Participants | Resource(s) | Emitted Events | Operation Characteristics | Operation Details |
|----------------|-------------|--------------|-------------|----------------|--------------------------|-------------------|
| submitApprovalCase() | Submit high-risk change for review | Product Lifecycle Manager, Pricing Analyst, Compatibility Engineer | ApprovalCase | Governance.ApprovalCaseSubmitted | unsafe, sync | Request: change type, source reference, risk level, rationale, requested change (the text the reviewer reads, made by the owning boundary from the typed values of its change request). Response: approvalCaseId and pending status |
| getApprovalCase() | Read the status of one approval case; the link a 202 Accepted change request points to (drone-web D-041) | Product Lifecycle Manager, Governance Reviewer | ApprovalCase | — | safe, sync | Request: approvalCaseId. Response: the approval case with its status (pending, approved, rejected, released or expired) |
| assignApprovalReviewer() | Assign reviewer to approval case | Governance Reviewer | ApprovalCase | Governance.ReviewerAssigned | idempotent, sync | Request: approvalCaseId, reviewerId. Response: assignment summary |
| recordApprovalDecision() | Approve or reject proposed change. Any person who holds the reviewer role for the case's risk level may decide, not only the assigned reviewer; never the person who asked (drone-web D-039, GOV-012) | Governance Reviewer | ApprovalDecision, ApprovalCase | Governance.DecisionRecorded | unsafe, sync | Request: approvalCaseId, decision, rationale. The decider's reviewer roles come from the reviewer directory. Response: case status summary with decidedBy and the decider's risk levels. Forbidden when the person has no reviewer role for the risk level or asked for the change |
| releasePublicationGate() | Release a change a person approved for publication. An agent approval of a low-risk change releases the gate by itself and tells the reviewers (drone-web D-039, GOV-013) | Governance Reviewer | PublicationGate | Governance.PublicationGateReleased | unsafe, sync | Request: approvalCaseId. Response: gate release confirmation. Conflict when the case is not approved or the gate is already released |

Each release, by a reviewer or by an agent approval, is announced once to the owning boundary (the published message `ChangeReleased` of the JS1 event model, `design/catalog-management-v2/eventmodel/`). The review agent's verdicts and the notice to the reviewers are messages and port calls, not operations of this API.

---

## Bulk Ingestion API

**Name:** Bulk Ingestion API  
**Description:** Processes asynchronous bulk import workflows with item-level results and replay.

| Operation Name | Description | Participants | Resource(s) | Emitted Events | Operation Characteristics | Operation Details |
|----------------|-------------|--------------|-------------|----------------|--------------------------|-------------------|
| submitImportBatch() | Submit import batch for processing | Product Lifecycle Manager | ImportBatch | ImportBatch.Submitted | unsafe, async, bulk import | Request: source info, batch payload reference/checksum. Response: importBatchId and queued status |
| getImportBatchResults() | Retrieve processing outcomes for batch | Product Lifecycle Manager | ImportBatch, ImportItemResult | — | safe, sync | Request: importBatchId, optional status filters. Response: batch status and item results |
| replayFailedImportItems() | Replay failed subset of import items | Product Lifecycle Manager | ImportReplayRequest, ImportItemResult | ImportBatch.ReplayRequested | idempotent, async, bulk import | Request: importBatchId, list of failed source item keys. Response: replayRequestId and queued status |
