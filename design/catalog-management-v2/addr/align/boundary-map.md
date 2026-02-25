# Catalog Management v2 — Boundary Map

> **Purpose:** Boundary-first decomposition for Align v2 while Event Storming is temporarily deferred.

## Candidate Subdomains and Ownership

| Subdomain | Type | Owner Persona | Core Aggregate | Why Separate |
|-----------|------|---------------|----------------|--------------|
| Product Lifecycle Management | Core | Product Lifecycle Manager | Product | Owns product master data and lifecycle invariants |
| Technical Documentation Management | Supporting | Documentation Steward | Document | Document versioning and association lifecycle differs from product lifecycle |
| Pricing and Promotions Management | Core | Pricing Analyst | PriceBookEntry | Time-based pricing and discount invariants are distinct |
| Inventory and Availability Management | Core | Inventory Controller | InventoryPosition | Operational update cadence and constraints are independent |
| Category and Faceting Management | Supporting | Taxonomy Manager | Category | Taxonomy invariants and browse semantics are separate concerns |
| Compatibility Rules Management | Core | Compatibility Engineer | CompatibilityRule | Technical compatibility logic evolves independently |
| Catalog Governance Workflow | Generic | Governance Reviewer | ApprovalCase | Approval and publication gates cut across writes but should be centralized |
| Bulk Ingestion | Supporting | Product Lifecycle Manager | ImportBatch | Batch validation/retry/failure semantics differ from interactive edits |

## Boundary Interfaces (High Level)

| Producer Boundary | Consuming Boundary | Contract Type | Example Interface |
|-------------------|--------------------|---------------|-------------------|
| Product Lifecycle Management | Pricing and Promotions Management | Integration event | ProductActivated |
| Product Lifecycle Management | Inventory and Availability Management | Integration event | ProductCreated |
| Product Lifecycle Management | Category and Faceting Management | Integration event | ProductDiscontinued |
| Product Lifecycle Management | Compatibility Rules Management | Integration event | ProductSpecificationUpdated |
| Technical Documentation Management | Product Lifecycle Management | Query/lookup | ListDocumentsByProduct |
| Pricing and Promotions Management | Catalog Governance Workflow | Command + decision | SubmitPricingChangeForApproval |
| Compatibility Rules Management | Catalog Governance Workflow | Command + decision | SubmitRuleChangeForApproval |
| Bulk Ingestion | Product Lifecycle Management | Command dispatch | ApplyImportedProductRecord |

## Ownership and Invariants

- Product lifecycle state transitions are owned only by Product Lifecycle Management.
- Document version chains are owned only by Technical Documentation Management.
- Effective-date and overlap rules for prices/promotions are owned only by Pricing and Promotions Management.
- On-hand quantity and lead-time consistency are owned only by Inventory and Availability Management.
- Category tree acyclicity and facet definition constraints are owned only by Category and Faceting Management.
- Compatibility rule validity and component group semantics are owned only by Compatibility Rules Management.
- Approval and publish policies are owned only by Catalog Governance Workflow.

## Overlap and Gap Checks

### Overlap checks

- Product vs Document: product core attributes stay in Product Lifecycle; file metadata/versioning stays in Documentation.
- Product vs Category: product assignment happens via Category and Faceting, not Product Lifecycle.
- Pricing vs Governance: pricing computes intent; governance authorizes materialization for high-risk changes.

### Gap checks

- Bulk ingestion includes explicit failure handling and replay path (not implicit in JS1 interactive flows).
- Governance path exists for repricing and compatibility rule changes before external visibility.
- Temporary Event Storming deferral is compensated by explicit boundaries and EventModel mapping.
