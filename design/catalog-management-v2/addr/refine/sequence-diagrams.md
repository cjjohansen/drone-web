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
    participant Agent as Review Agent (LLM)
    participant DIR as Reviewer Directory
    participant EVT as Event Bus

    Manager->>GOV: POST /catalog-governance/v1/approval-cases (requestedChange made from typed values)
    GOV-->>Manager: 201 Created (ApprovalCase, reviewRoute)
    alt low risk, the agent approves
        GOV->>Agent: assess the change
        Agent-->>GOV: verdict approve
        Note over GOV: approval releases the gate (GOV-013)
        GOV->>Reviewer: notice of the agent approval (reviewersToldAt)
    else a person decides (medium after the agent check, high, critical, or escalated)
        Reviewer->>GOV: POST /catalog-governance/v1/approval-cases/{id}/decisions
        GOV->>DIR: reviewer roles of the signed-in person
        DIR-->>GOV: risk levels
        GOV-->>Reviewer: 201 Created (ApprovalDecisionResult) or 403 without the role for the risk level (GOV-012)
        GOV->>EVT: governance.decision-recorded
        Reviewer->>GOV: POST /catalog-governance/v1/approval-cases/{id}/publication-gate-releases
        GOV-->>Reviewer: 201 Created (PublicationGate)
    end
    GOV->>EVT: change released (once per case, both routes)
```

Any person who holds the reviewer role for the case's risk level may decide, not only the assigned
reviewer; the person who asked never decides. The release message is `ChangeReleased` in the JS1
event model (`../../eventmodel/`); this file has no published contract for it yet (drone-web D-039).

## JS1: Change an Active Product (202 Accepted, Applied on Release)

```mermaid
sequenceDiagram
    participant Manager as Product Lifecycle Manager
    participant PL as Product Lifecycle API
    participant GOV as Catalog Governance API
    participant EVT as Event Bus

    Manager->>PL: PATCH /product-lifecycle/v1/products/{productId}/specifications (new values, reason, riskLevel)
    PL->>GOV: open approval case (requestedChange made from the typed values)
    PL-->>Manager: 202 Accepted (Location: approval case, ProductChangeAccepted)
    Note over GOV: review by the agent or a person, then release (JS4)
    GOV->>EVT: change released
    EVT->>PL: change released
    Note over PL: applies the values of the request (PLC-012, drone-web D-042)
    PL->>EVT: ProductSpecificationChanged on product-specifications (drone-web D-037)
    Manager->>GOV: GET /catalog-governance/v1/approval-cases/{approvalCaseId}
    GOV-->>Manager: 200 OK (ApprovalCase: released)
```

The manager sends the new values once. After the release Product Data applies them itself; there
is no second call (drone-web D-042). `PATCH /product-lifecycle/v1/products/{productId}` works in the
same way for the name and short description, and the new name then reaches `product-records`. A
lifecycle change (`POST .../lifecycle-transitions`, also `202 Accepted` with `Location`) takes
effect through `POST .../publications` or `POST .../discontinuations` after the release.

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
