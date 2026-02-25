# Catalog Management v2 — Sequence Diagrams

> **Phase:** ADDR — Define
> **Status:** Draft

---

## JS1: Product Lifecycle Management

```mermaid
sequenceDiagram
    actor PLM as ProductLifecycleManager
    participant ProductApi as ProductLifecycleAPI
    participant BulkApi as BulkIngestionAPI
    participant GovApi as CatalogGovernanceAPI

    PLM->>ProductApi: searchProductsForManagement(query, filters)
    ProductApi-->>PLM: product summaries

    PLM->>ProductApi: createProduct(product data)
    ProductApi-->>PLM: productId, lifecycleState=draft

    PLM->>ProductApi: updateProductSpecifications(productId, specs)
    ProductApi-->>PLM: updated specification summary

    PLM->>GovApi: submitApprovalCase(changeType=lifecycle-change, sourceReferenceId=productId)
    GovApi-->>PLM: approvalCaseId, status=pending

    PLM->>GovApi: recordApprovalDecision(approvalCaseId, approve)
    GovApi-->>PLM: status=approved

    PLM->>GovApi: releasePublicationGate(approvalCaseId)
    GovApi-->>PLM: gateState=released

    PLM->>ProductApi: setProductLifecycleState(productId, targetState=active)
    ProductApi-->>PLM: lifecycle transition result

    PLM->>ProductApi: discontinueProduct(productId, reason)
    ProductApi-->>PLM: lifecycleState=discontinued

    PLM->>ProductApi: linkReplacementProduct(discontinuedProductId, replacementProductId)
    ProductApi-->>PLM: replacement link summary

    PLM->>BulkApi: submitImportBatch(source, payloadRef)
    BulkApi-->>PLM: importBatchId, status=queued

    PLM->>BulkApi: getImportBatchResults(importBatchId)
    BulkApi-->>PLM: item-level results
```

## JS2: Technical Documentation Management

```mermaid
sequenceDiagram
    actor DocSteward as DocumentationSteward
    participant DocApi as TechnicalDocumentationAPI

    DocSteward->>DocApi: uploadDocument(productId, document metadata, artifactRef)
    DocApi-->>DocSteward: documentId, versionId

    DocSteward->>DocApi: associateDocumentToProduct(productId, documentId)
    DocApi-->>DocSteward: association summary

    DocSteward->>DocApi: updateDocumentMetadata(documentId, metadata)
    DocApi-->>DocSteward: updated metadata summary

    DocSteward->>DocApi: publishDocumentVersion(documentId, artifactRef, notes)
    DocApi-->>DocSteward: new version summary

    DocSteward->>DocApi: retireDocument(documentId, reason)
    DocApi-->>DocSteward: status=retired
```

## JS3: Pricing and Promotions Management

```mermaid
sequenceDiagram
    actor Pricing as PricingAnalyst
    participant PriceApi as PricingAndPromotionsAPI
    participant GovApi as CatalogGovernanceAPI

    Pricing->>PriceApi: setBasePrice(productId, basePrice, effectivePeriod)
    PriceApi-->>Pricing: active price entry summary

    Pricing->>PriceApi: setVolumeDiscountTiers(productId, tiers)
    PriceApi-->>Pricing: accepted tier summary

    Pricing->>GovApi: submitApprovalCase(changeType=pricing-change, sourceReferenceId=productId)
    GovApi-->>Pricing: approvalCaseId, status=pending

    Pricing->>GovApi: recordApprovalDecision(approvalCaseId, approve)
    GovApi-->>Pricing: status=approved

    Pricing->>GovApi: releasePublicationGate(approvalCaseId)
    GovApi-->>Pricing: gateState=released

    Pricing->>PriceApi: startPromotion(scope, promotionValue, startsAt, endsAt)
    PriceApi-->>Pricing: promotion summary

    Pricing->>PriceApi: applyPriceAdjustment(scope, adjustmentType, adjustmentValue)
    PriceApi-->>Pricing: repricingJobId, status=queued

    Pricing->>PriceApi: cancelPromotion(promotionId, reason)
    PriceApi-->>Pricing: status=canceled
```

## JS4: Inventory and Availability Management

```mermaid
sequenceDiagram
    actor Inventory as InventoryController
    participant InventoryApi as InventoryAndAvailabilityAPI

    Inventory->>InventoryApi: queryInventoryStatus(filters)
    InventoryApi-->>Inventory: inventory status summaries

    Inventory->>InventoryApi: updateStockQuantity(productId, location, quantity)
    InventoryApi-->>Inventory: updated inventory snapshot

    Inventory->>InventoryApi: setRestockDate(productId, expectedDate, expectedQuantity)
    InventoryApi-->>Inventory: restock plan summary

    Inventory->>InventoryApi: updateLeadTime(productId, leadTimeDays)
    InventoryApi-->>Inventory: updated availability policy

    Inventory->>InventoryApi: setBackorderState(productId, backorderEnabled, reason)
    InventoryApi-->>Inventory: backorder posture summary

    Inventory->>InventoryApi: suspendProductAvailability(productId, reason)
    InventoryApi-->>Inventory: availabilityState=suspended
```

## JS5: Category and Faceting Management

```mermaid
sequenceDiagram
    actor Taxonomy as TaxonomyManager
    participant CategoryApi as CategoryAndFacetingAPI

    Taxonomy->>CategoryApi: createCategory(parentCategoryId, name, slug)
    CategoryApi-->>Taxonomy: category summary

    Taxonomy->>CategoryApi: updateCategory(categoryId, metadata)
    CategoryApi-->>Taxonomy: updated category summary

    Taxonomy->>CategoryApi: moveCategory(categoryId, newParentCategoryId, position)
    CategoryApi-->>Taxonomy: hierarchy placement summary

    Taxonomy->>CategoryApi: assignProductToCategory(categoryId, productId, assignmentType)
    CategoryApi-->>Taxonomy: assignment summary

    Taxonomy->>CategoryApi: removeProductFromCategory(categoryId, productId)
    CategoryApi-->>Taxonomy: removal confirmation

    Taxonomy->>CategoryApi: defineCategoryFacets(categoryId, facetDefinitions)
    CategoryApi-->>Taxonomy: facet configuration summary
```

## JS6: Compatibility Rules Management

```mermaid
sequenceDiagram
    actor CompatEng as CompatibilityEngineer
    participant CompatApi as CompatibilityRulesAPI
    participant GovApi as CatalogGovernanceAPI

    CompatEng->>CompatApi: createCompatibilityRule(ruleDefinition)
    CompatApi-->>CompatEng: rule summary

    CompatEng->>CompatApi: updateCompatibilityRule(ruleId, updatedDefinition)
    CompatApi-->>CompatEng: updated rule summary

    CompatEng->>CompatApi: createComponentGroup(group metadata, members)
    CompatApi-->>CompatEng: group summary

    CompatEng->>CompatApi: updateComponentGroup(componentGroupId, memberChanges)
    CompatApi-->>CompatEng: updated group summary

    CompatEng->>GovApi: submitApprovalCase(changeType=rule-change, sourceReferenceId=ruleId)
    GovApi-->>CompatEng: approvalCaseId, status=pending

    CompatEng->>GovApi: recordApprovalDecision(approvalCaseId, approve)
    GovApi-->>CompatEng: status=approved

    CompatEng->>GovApi: releasePublicationGate(approvalCaseId)
    GovApi-->>CompatEng: gateState=released

    CompatEng->>CompatApi: deactivateCompatibilityRule(ruleId, reason)
    CompatApi-->>CompatEng: status=inactive
```
