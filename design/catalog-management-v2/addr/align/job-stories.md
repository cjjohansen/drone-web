# Catalog Management v2 — Unifying Job Stories

> **Domain:** Catalog Management (write side)
> **Phase:** ADDR — Align
> **Status:** Draft

---

## JS1: Product Lifecycle Management

**WHEN** new mechatronic products need onboarding or existing products require lifecycle changes,  
**I WANT TO** create, revise, approve, and transition product master records safely,  
**SO I CAN** keep catalog core data reliable and storefront-facing information trustworthy.

**Primary Boundary:** Product Lifecycle Management  
**Primary Aggregate:** Product

## JS2: Technical Documentation Management

**WHEN** product documentation is added, revised, or retired,  
**I WANT TO** manage document versions, metadata, and product associations,  
**SO I CAN** ensure technical artifacts remain authoritative and traceable.

**Primary Boundary:** Technical Documentation Management  
**Primary Aggregate:** Document

## JS3: Pricing and Promotions Management

**WHEN** pricing strategy changes across products or product groups,  
**I WANT TO** apply base prices, discount tiers, promotions, and controlled repricing,  
**SO I CAN** execute commercial policy with effective-date precision and auditability.

**Primary Boundary:** Pricing and Promotions Management  
**Primary Aggregate:** PriceBookEntry

## JS4: Inventory and Availability Management

**WHEN** stock and supply conditions change,  
**I WANT TO** update inventory posture, lead times, and availability state,  
**SO I CAN** present accurate fulfillment expectations to downstream consumers.

**Primary Boundary:** Inventory and Availability Management  
**Primary Aggregate:** InventoryPosition

## JS5: Category and Faceting Management

**WHEN** catalog navigation structures need refinement,  
**I WANT TO** manage category hierarchy, product assignments, and facets,  
**SO I CAN** keep browse and filtering experiences coherent.

**Primary Boundary:** Category and Faceting Management  
**Primary Aggregate:** Category

## JS6: Compatibility Rules Management

**WHEN** technical compatibility knowledge evolves,  
**I WANT TO** define and govern compatibility rules and component groups,  
**SO I CAN** ensure compatibility outcomes remain correct and explainable.

**Primary Boundary:** Compatibility Rules Management  
**Primary Aggregate:** CompatibilityRule

---

## Job Story to Boundary Summary

| Job Story | Boundary Owner | Aggregate |
|-----------|----------------|-----------|
| JS1 | Product Lifecycle Management | Product |
| JS2 | Technical Documentation Management | Document |
| JS3 | Pricing and Promotions Management | PriceBookEntry |
| JS4 | Inventory and Availability Management | InventoryPosition |
| JS5 | Category and Faceting Management | Category |
| JS6 | Compatibility Rules Management | CompatibilityRule |
