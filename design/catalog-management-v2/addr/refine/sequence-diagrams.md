# Catalog Management v2 — Sequence Diagrams

## JS1/JS2: Create Product and Attach Documentation

```mermaid
sequenceDiagram
    participant Manager as Product Lifecycle Manager
    participant PL as Product Lifecycle API
    participant TD as Technical Docs API
    participant EVT as Event Bus

    Manager->>PL: POST /product-lifecycle/v1/products
    PL-->>Manager: 201 Created (Product)
    PL->>EVT: product.created

    Manager->>TD: POST /technical-docs/v1/documents
    TD-->>Manager: 201 Created (Document)
    Manager->>TD: PUT /technical-docs/v1/products/{productId}/documents/{documentId}
    TD-->>Manager: 200 OK (ProductDocumentLink)
```

## JS3: Repricing Flow (Async)

```mermaid
sequenceDiagram
    participant Analyst as Pricing Analyst
    participant PR as Pricing API
    participant EVT as Event Bus
    participant Worker as Repricing Worker

    Analyst->>PR: POST /pricing/v1/repricing-jobs
    PR-->>Analyst: 202 Accepted (RepricingJob: queued)
    PR->>EVT: price.group-repricing-requested
    Worker->>PR: Internal processing updates
```

## JS4: Approval Case and Publication Gate

```mermaid
sequenceDiagram
    participant Manager as Product Lifecycle Manager
    participant GOV as Catalog Governance API
    participant Reviewer as Governance Reviewer
    participant EVT as Event Bus

    Manager->>GOV: POST /catalog-governance/v1/approval-cases
    GOV-->>Manager: 201 Created (ApprovalCase)
    Reviewer->>GOV: POST /catalog-governance/v1/approval-cases/{id}/decisions
    GOV-->>Reviewer: 201 Created (ApprovalDecisionResult)
    GOV->>EVT: governance.decision-recorded
    Reviewer->>GOV: POST /catalog-governance/v1/approval-cases/{id}/publication-gate-releases
    GOV-->>Reviewer: 201 Created (PublicationGate)
```

## JS5: Taxonomy and Facet Management

```mermaid
sequenceDiagram
    participant Tax as Taxonomy Manager
    participant TAX as Taxonomy API
    participant EVT as Event Bus

    Tax->>TAX: POST /taxonomy/v1/categories
    TAX-->>Tax: 201 Created (Category)
    Tax->>TAX: PUT /taxonomy/v1/categories/{id}/facets
    TAX-->>Tax: 200 OK ({ categoryId, facets })
    TAX->>EVT: category.facets-defined
```

## JS6: Bulk Ingestion and Replay

```mermaid
sequenceDiagram
    participant Manager as Product Lifecycle Manager
    participant BI as Bulk Ingestion API
    participant EVT as Event Bus
    participant Worker as Import Worker

    Manager->>BI: POST /bulk-ingestion/v1/import-batches
    BI-->>Manager: 202 Accepted (ImportBatch: queued)
    BI->>EVT: import-batch.submitted
    Worker->>BI: Internal item processing
    Manager->>BI: GET /bulk-ingestion/v1/import-batches/{id}/results
    BI-->>Manager: 200 OK (ImportBatchResults)
    Manager->>BI: POST /bulk-ingestion/v1/import-batches/{id}/replay-requests
    BI-->>Manager: 202 Accepted (ImportReplayRequest: queued)
    BI->>EVT: import-batch.replay-requested
```
