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

### JS1: Reviewed change with typed values (drone-web D-039)

A change on an active product carries its new values as typed fields. Governance approves the text
made from them, and Product Data applies only those values after the release. The JS1 event model
(`../../eventmodel/`) holds the rules: PLC-012 (typed values), GOV-012 (decide by reviewer role) and
GOV-013 (an agent approval releases the gate). The operation that requests a specification or details
change on an active product is open (200 or 202 is still to be decided).

```mermaid
sequenceDiagram
    actor PLM as ProductLifecycleManager
    actor Reviewer as GovernanceReviewer
    participant ProductApi as ProductLifecycleAPI
    participant GovApi as CatalogGovernanceAPI
    participant Agent as ReviewAgent
    participant Directory as ReviewerDirectory

    PLM->>ProductApi: request change(productId, specification-change, all new values, reason)
    Note over ProductApi: refuses a request without all its new values (NewValuesMissing)
    ProductApi->>GovApi: submitApprovalCase(changeType, sourceReferenceId, riskLevel, requestedChange)
    GovApi-->>ProductApi: approvalCaseId, status=pending, reviewRoute

    alt low risk
        GovApi->>Agent: assess(requestedChange)
        Agent-->>GovApi: verdict=approve
        Note over GovApi: approval releases the gate (GOV-013)
        GovApi->>Reviewer: notice of the agent approval
    else medium (after the agent check), high or critical risk, or escalated by the agent
        Reviewer->>GovApi: recordApprovalDecision(approvalCaseId, approve)
        GovApi->>Directory: reviewer roles of the person
        Directory-->>GovApi: risk levels
        GovApi-->>Reviewer: status=approved (any holder of the role for the risk level, never the requester)
        Reviewer->>GovApi: releasePublicationGate(approvalCaseId)
        GovApi-->>Reviewer: gateState=released
    end

    GovApi-->>ProductApi: change released (once, both routes)
    PLM->>ProductApi: updateProductSpecifications(productId, specs)
    ProductApi-->>PLM: applied, or conflict when the values differ from the approved ones (ValuesDifferFromTheApprovedOnes)
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
