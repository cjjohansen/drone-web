# Catalog Management v2 — Activities and Activity Steps

| Job Story | Activity | Activity Step | Boundary Owner | Command Intent | Expected State Change | Downstream Read-Side Impact |
|-----------|----------|---------------|----------------|----------------|-----------------------|-----------------------------|
| **JS1** | Product Search | Search products for management | Product Lifecycle Management | Query products for write workflow | None (state view) | Admin list supports edit selection |
| JS1 | Create Product | Submit new product | Product Lifecycle Management | Create Product | Product record created | Product can flow into storefront projections |
| JS1 | Create Product | Add technical specifications | Product Lifecycle Management | Update Product Specifications | Specification set updated | Compatibility and details views can refresh |
| JS1 | Lifecycle Control | Set initial lifecycle state | Product Lifecycle Management | Set Product Lifecycle State | Draft/pending/active transition | Controls storefront visibility |
| JS1 | Update Product | Update product core attributes | Product Lifecycle Management | Update Product Attributes | Product details changed | Search/details projections update |
| JS1 | Discontinue Product | Mark product as discontinued | Product Lifecycle Management | Discontinue Product | Product lifecycle becomes discontinued | Storefront availability and replacement hints update |
| JS1 | Discontinue Product | Link replacement product | Product Lifecycle Management | Link Replacement Product | Successor relation created | Product detail replacement section updates |
| JS1 | Bulk Ingestion | Submit bulk import | Bulk Ingestion | Submit Import Batch | Import batch created | Import status dashboard updates |
| JS1 | Bulk Ingestion | Review import results | Bulk Ingestion | Generate Import Results | Import result state updated | Failed/succeeded records visible for remediation |
| **JS2** | Upload Document | Submit technical document | Technical Documentation Management | Upload Document | New document artifact stored | Document list on product details can update |
| JS2 | Upload Document | Associate document with product | Technical Documentation Management | Associate Document To Product | Product-document link created | Product documents projection updates |
| JS2 | Manage Documents | Update document metadata | Technical Documentation Management | Update Document Metadata | Metadata fields changed | Document search and display labels refresh |
| JS2 | Manage Documents | Replace document version | Technical Documentation Management | Publish Document Version | Version chain extended | Latest-version display changes |
| JS2 | Manage Documents | Retire obsolete document | Technical Documentation Management | Retire Document | Document status moved to retired | Consumer sees historical or hidden document |
| **JS3** | Base Pricing | Set base price | Pricing and Promotions Management | Set Base Price | Base price updated | Product pricing projection refreshes |
| JS3 | Base Pricing | Set volume discount tiers | Pricing and Promotions Management | Set Volume Discount Tiers | Tier schedule updated | Fleet pricing views update |
| JS3 | Promotions | Create promotion window | Pricing and Promotions Management | Start Promotion | Promotion active period created | Promotional badge/price projection updates |
| JS3 | Promotions | Cancel promotion | Pricing and Promotions Management | Cancel Promotion | Promotion terminated | Pricing reverts in projections |
| JS3 | Group Repricing | Apply group repricing | Pricing and Promotions Management | Apply Price Adjustment | Multiple product prices updated | Broad pricing projection refresh |
| **JS4** | Inventory Review | Review inventory status | Inventory and Availability Management | Query Inventory Status | None (state view) | Admin restock queue visibility |
| JS4 | Stock Update | Set stock quantity | Inventory and Availability Management | Update Stock Quantity | On-hand quantity changed | Availability projections update |
| JS4 | Stock Update | Set restock date | Inventory and Availability Management | Set Restock Date | Restock ETA changed | Delivery expectation projection updates |
| JS4 | Availability | Update lead time | Inventory and Availability Management | Update Lead Time | Lead time value changed | ETA/availability display updates |
| JS4 | Availability | Flag backordered | Inventory and Availability Management | Set Backorder State | Availability posture changed | Backorder messaging updates |
| JS4 | Availability | Suspend availability | Inventory and Availability Management | Suspend Product Availability | Temporary unavailable state set | Product purchasability projection updates |
| **JS5** | Category Management | Create category | Category and Faceting Management | Create Category | Category node created | Category tree projection updates |
| JS5 | Category Management | Update category metadata | Category and Faceting Management | Update Category | Category properties changed | Navigation labels/order update |
| JS5 | Category Management | Move category in hierarchy | Category and Faceting Management | Move Category | Parent/position changed | Browse paths and breadcrumbs update |
| JS5 | Category Management | Remove category | Category and Faceting Management | Retire Category | Category archived/removed | Product reclassification required |
| JS5 | Product Assignment | Assign product to category | Category and Faceting Management | Assign Product To Category | Product-category relation created | Category listings update |
| JS5 | Product Assignment | Remove product from category | Category and Faceting Management | Remove Product From Category | Product-category relation removed | Category listings update |
| JS5 | Facets | Define category facets | Category and Faceting Management | Define Category Facets | Facet configuration changed | Filter options update |
| **JS6** | Compatibility Rules | Create compatibility rule | Compatibility Rules Management | Create Compatibility Rule | Rule created | Compatibility outcomes can change |
| JS6 | Compatibility Rules | Update compatibility rule | Compatibility Rules Management | Update Compatibility Rule | Rule definition changed | Compatibility outcomes can change |
| JS6 | Compatibility Rules | Deactivate compatibility rule | Compatibility Rules Management | Deactivate Compatibility Rule | Rule status changed | Rule no longer applied in checks |
| JS6 | Component Groups | Define component group | Compatibility Rules Management | Create Component Group | Group created | Validation scope for checks expands |
| JS6 | Component Groups | Update component group | Compatibility Rules Management | Update Component Group | Group membership changed | Compatibility matrix recalculates |
