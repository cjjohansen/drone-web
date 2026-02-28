# Catalog Management v2 — Personas

> **Domain:** Catalog Management (write side)
> **Phase:** ADDR — Align
> **Status:** Draft

---

## Product Lifecycle Manager

**Description:** Owns product master data and lifecycle transitions for mechatronic products, including creation, core attribute maintenance, and discontinuation policy execution.

**Goals:** Ensure product records are complete, accurate, and lifecycle-safe before storefront exposure.

**Primary Job Stories:** JS1

---

## Documentation Steward

**Description:** Owns technical document intake, metadata quality, version history, and product-document association.

**Goals:** Keep datasheets, compliance certificates, CAD files, and manuals authoritative and current.

**Primary Job Stories:** JS2

---

## Pricing Analyst

**Description:** Owns pricing policy execution including base prices, volume tiers, promotions, and bulk repricing.

**Goals:** Apply pricing strategy with effective-date control and auditability.

**Primary Job Stories:** JS3

---

## Inventory Controller

**Description:** Owns stock and availability maintenance including restock timing, lead times, backorder posture, and temporary suspensions.

**Goals:** Keep availability truthful and operationally actionable.

**Primary Job Stories:** JS4

---

## Taxonomy Manager

**Description:** Owns category hierarchy, product-category assignments, and facet definitions for storefront navigation.

**Goals:** Maintain coherent browse structures and filter quality.

**Primary Job Stories:** JS5

---

## Compatibility Engineer

**Description:** Owns component compatibility rules and component group definitions used by compatibility checks.

**Goals:** Keep compatibility outcomes correct as products/specs evolve.

**Primary Job Stories:** JS6

---

## Governance Reviewer

**Description:** Owns approval and publication gates for high-risk writes (for example, major repricing, discontinuations, and rule changes).

**Goals:** Enforce policy and change control before write-side effects become externally visible.

**Primary Job Stories:** JS1, JS3, JS6

---

## Persona-Job Story Matrix

| Persona | JS1 | JS2 | JS3 | JS4 | JS5 | JS6 |
|---------|-----|-----|-----|-----|-----|-----|
| Product Lifecycle Manager | x | | | | | |
| Documentation Steward | | x | | | | |
| Pricing Analyst | | | x | | | |
| Inventory Controller | | | | x | | |
| Taxonomy Manager | | | | | x | |
| Compatibility Engineer | | | | | | x |
| Governance Reviewer | x | | x | | | x |
