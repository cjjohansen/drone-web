# Catalog Management — Event Storming Canvas

> **Subdomain:** Catalog Management
> **Format:** Big Picture Event Storming (command-focused)
> **Status:** Draft

---

## Reading Guide

- **Domain Events** (orange) — Things that happened, past tense. Every event here is a genuine state change.
- **Commands** (blue) — Actions that trigger events
- **Aggregates** (yellow) — Entities that process commands and emit events
- **Actors** (small yellow) — Who issues the command
- **Policies** (lilac) — "Whenever X happens, then Y" automation rules
- **External Systems** (pink) — Systems outside this domain
- **Pivotal Events** (orange with red border) — Events that mark phase transitions or boundary shifts

---

## Key Difference from Storefront Event Storming

The Catalog Storefront event storming produced many observational events (Catalog Searched, Product Details Viewed) that don't represent state changes. This Catalog Management canvas is **entirely command-driven** — every event represents a genuine state mutation that downstream systems (storefront, compatibility, partner) must react to.

---

## Timeline: Left to Right

### 1. Product Lifecycle Subdomain

```
Actor: Catalog Manager

Command: Create Product
Aggregate: Product
  → Event: Product Created

Command: Update Product Attributes
Aggregate: Product
  → Event: Product Updated

Command: Update Technical Specifications
Aggregate: Product
  → Event: Product Specifications Updated

Command: Discontinue Product
Aggregate: Product
  → Event: Product Discontinued ⭐ PIVOTAL
  Policy: WHENEVER Product Discontinued → Notify Partner Systems
  Policy: WHENEVER Product Discontinued → Update Compatibility Rules
  Policy: WHENEVER Product Discontinued → Flag Active Backorders

Command: Reactivate Product
Aggregate: Product
  → Event: Product Reactivated

Command: Set Replacement Product
Aggregate: Product
  → Event: Replacement Product Linked
```

### 2. Bulk Import Subdomain

```
Actor: Catalog Manager

Command: Submit Bulk Import
Aggregate: Import Job
  → Event: Import Job Submitted
  Policy: WHENEVER Import Job Submitted → Validate Import Data

Command: Process Import Batch
Aggregate: Import Job
  → Event: Import Batch Processed ⭐ PIVOTAL
  Policy: WHENEVER Import Batch Processed → Create/Update Products
  → Event: Import Job Completed
  → Event: Import Job Failed (partial)
```

### 3. Technical Documentation Subdomain

```
Actor: Catalog Manager

Command: Upload Technical Document
Aggregate: Technical Document
  → Event: Document Uploaded

Command: Associate Document with Product
Aggregate: Technical Document
  → Event: Document Associated

Command: Replace Document Version
Aggregate: Technical Document
  → Event: Document Version Replaced

Command: Remove Document
Aggregate: Technical Document
  → Event: Document Removed
```

### 4. Pricing Subdomain

```
Actor: Pricing Analyst

Command: Set Base Price
Aggregate: Product Pricing
  → Event: Base Price Set
  Policy: WHENEVER Base Price Set → Publish Price Change Event

Command: Set Volume Discount Tiers
Aggregate: Product Pricing
  → Event: Volume Tiers Updated

Command: Create Promotional Pricing
Aggregate: Promotion
  → Event: Promotion Created ⭐ PIVOTAL
  Policy: WHENEVER Promotion Created → Schedule Activation
  Policy: WHENEVER Promotion Created → Notify Partner Systems

Command: Cancel Promotion
Aggregate: Promotion
  → Event: Promotion Cancelled

Command: Apply Group Price Adjustment
Aggregate: Price Adjustment
  → Event: Group Price Adjustment Applied
  Policy: WHENEVER Group Price Adjustment Applied → Update Affected Products
```

### 5. Inventory Subdomain

```
Actor: Inventory Controller

Command: Set Stock Quantity
Aggregate: Inventory
  → Event: Stock Level Updated
  Policy: WHENEVER Stock Level Updated (qty = 0) → Flag Out of Stock
  Policy: WHENEVER Stock Level Updated (qty < threshold) → Trigger Low Stock Alert

Command: Set Restock Date
Aggregate: Inventory
  → Event: Restock Date Set

Command: Update Lead Time
Aggregate: Inventory
  → Event: Lead Time Updated

Command: Flag as Backordered
Aggregate: Inventory
  → Event: Product Backordered

Command: Suspend Availability
Aggregate: Inventory
  → Event: Product Availability Suspended
  Policy: WHENEVER Product Availability Suspended → Remove from Storefront Search

Command: Resume Availability
Aggregate: Inventory
  → Event: Product Availability Resumed
  Policy: WHENEVER Product Availability Resumed → Re-index in Storefront Search
```

### 6. Category Management Subdomain

```
Actor: Category Manager

Command: Create Category
Aggregate: Category
  → Event: Category Created

Command: Update Category
Aggregate: Category
  → Event: Category Updated

Command: Move Category
Aggregate: Category
  → Event: Category Moved
  Policy: WHENEVER Category Moved → Rebuild Category Tree Cache

Command: Remove Category
Aggregate: Category
  → Event: Category Removed
  Policy: WHENEVER Category Removed → Reassign Orphaned Products

Command: Assign Product to Category
Aggregate: Product Categorization
  → Event: Product Categorized

Command: Remove Product from Category
Aggregate: Product Categorization
  → Event: Product Uncategorized

Command: Define Category Facets
Aggregate: Category
  → Event: Category Facets Defined
```

### 7. Compatibility Rules Subdomain

```
Actor: Compatibility Engineer

Command: Create Compatibility Rule
Aggregate: Compatibility Rule
  → Event: Compatibility Rule Created ⭐ PIVOTAL
  Policy: WHENEVER Compatibility Rule Created → Rebuild Compatibility Cache

Command: Update Compatibility Rule
Aggregate: Compatibility Rule
  → Event: Compatibility Rule Updated
  Policy: WHENEVER Compatibility Rule Updated → Rebuild Compatibility Cache

Command: Deactivate Compatibility Rule
Aggregate: Compatibility Rule
  → Event: Compatibility Rule Deactivated
  Policy: WHENEVER Compatibility Rule Deactivated → Rebuild Compatibility Cache

Command: Define Component Group
Aggregate: Component Group
  → Event: Component Group Defined

Command: Update Component Group
Aggregate: Component Group
  → Event: Component Group Updated
```

---

## Pivotal Events Summary

| # | Pivotal Event | Why It's Pivotal |
|---|--------------|-----------------|
| 1 | **Product Discontinued** | Cascading cross-boundary impact: storefront must hide/flag the product, compatibility rules may need updating, partner feeds must reflect the change, active backorders need handling. Multiple policies trigger. |
| 2 | **Import Batch Processed** | Bulk creation/update of products triggers a cascade of downstream events (multiple Product Created/Updated). High-volume boundary crossing that affects storefront indexing, compatibility cache, and partner feeds simultaneously. |
| 3 | **Promotion Created** | Creates a time-bounded pricing state that affects storefront display, partner data feeds, and requires scheduled activation/deactivation. Cross-boundary impact with temporal dimension. |
| 4 | **Compatibility Rule Created** | Directly affects the Compatibility API's behavior. New rules change which component combinations pass/fail verification. Requires cache rebuild and may retroactively affect saved configurations. |

---

## Domain Events Summary

| Subdomain | Event Count | Events |
|-----------|-------------|--------|
| Product Lifecycle | 6 | Product Created, Product Updated, Product Specifications Updated, Product Discontinued, Product Reactivated, Replacement Product Linked |
| Bulk Import | 3 | Import Job Submitted, Import Batch Processed, Import Job Completed/Failed |
| Technical Documentation | 4 | Document Uploaded, Document Associated, Document Version Replaced, Document Removed |
| Pricing | 5 | Base Price Set, Volume Tiers Updated, Promotion Created, Promotion Cancelled, Group Price Adjustment Applied |
| Inventory | 6 | Stock Level Updated, Restock Date Set, Lead Time Updated, Product Backordered, Product Availability Suspended, Product Availability Resumed |
| Category Management | 7 | Category Created, Category Updated, Category Moved, Category Removed, Product Categorized, Product Uncategorized, Category Facets Defined |
| Compatibility Rules | 5 | Compatibility Rule Created, Compatibility Rule Updated, Compatibility Rule Deactivated, Component Group Defined, Component Group Updated |
| **Total** | **36** | All state-changing events |

---

## Integration Events (cross-boundary)

These events will be published as integration events for consumption by the Catalog Storefront, Component Compatibility, and Partner Catalog APIs:

| Event | Consumers | Pattern |
|-------|-----------|---------|
| Product Created | Storefront, Compatibility, Partner | Fact event (full state) |
| Product Updated | Storefront, Compatibility, Partner | Fact event (full state) |
| Product Specifications Updated | Storefront, Compatibility | Fact event (specs snapshot) |
| Product Discontinued | Storefront, Compatibility, Partner | Fact event (full state) |
| Product Reactivated | Storefront, Compatibility, Partner | Fact event (full state) |
| Base Price Set | Storefront, Partner | Delta event (price change) |
| Volume Tiers Updated | Storefront, Partner | Delta event (tier change) |
| Promotion Created | Storefront, Partner | Fact event (promotion details) |
| Promotion Cancelled | Storefront, Partner | Delta event (promotion ID) |
| Stock Level Updated | Storefront, Partner | Delta event (availability change) |
| Product Availability Suspended | Storefront, Partner | Delta event (availability change) |
| Product Availability Resumed | Storefront, Partner | Delta event (availability change) |
| Category Created | Storefront | Fact event (category details) |
| Category Updated | Storefront | Fact event (category details) |
| Category Moved | Storefront | Delta event (parent change) |
| Category Removed | Storefront | Delta event (category ID) |
| Product Categorized | Storefront | Delta event (product + category) |
| Product Uncategorized | Storefront | Delta event (product + category) |
| Compatibility Rule Created | Compatibility | Fact event (rule details) |
| Compatibility Rule Updated | Compatibility | Fact event (rule details) |
| Compatibility Rule Deactivated | Compatibility | Delta event (rule ID) |

Per LRN-006: fact events (full state snapshot) are used for cross-boundary integration to enable Event-Carried State Transfer (ECST). Delta events are used where the full snapshot would be excessive or where only the change is meaningful.
