# Catalog Storefront — Personas

> **Subdomain:** Catalog Storefront
> **Phase:** ADDR — Align
> **Status:** Draft

---

## Professional Integrator

**Description:** An engineer or technician at a company that builds commercial drone systems — surveying, agriculture, inspection, delivery.

**Goals:** Source reliable, certified components at volume pricing. Needs datasheets, compliance certificates, and guaranteed compatibility for production builds.

**Context:** Deep technical knowledge. Searches by exact specs and part numbers. Needs technical documents for procurement and certification. May purchase in bulk.

**Primary Job Stories:** JS1, JS2, JS3, JS4

---

## Casual Browser

**Description:** Someone exploring the catalog without a specific project — a newcomer to drones, a gift buyer, or someone researching the hobby.

**Goals:** Understand what's available, discover product categories, get a sense of pricing and options.

**Context:** Limited technical knowledge. Relies on category browsing, product descriptions, reviews, and recommendations rather than spec-based search.

**Primary Job Stories:** JS1, JS2, JS5

---

## Fleet Procurement Buyer

**Description:** A procurement officer or program manager at a government agency, defense organization, or large enterprise purchasing drones and components at fleet scale — hundreds to thousands of units for surveillance, search & rescue, infrastructure inspection, agriculture, or defense operations.

**Goals:** Evaluate products against program requirements and compliance standards. Compare options across technical specs, certifications, and volume pricing. Verify compatibility across standardized fleet configurations. Access datasheets and compliance certificates for procurement documentation.

**Context:** Operates within formal procurement processes with approval workflows. Needs volume pricing, lead times, and availability guarantees. Requires compliance documentation (military standards, aviation regulations, export controls). Often evaluates complete system configurations rather than individual components. May involve multiple stakeholders reviewing the same products.

**Primary Job Stories:** JS1, JS2, JS3, JS4, JS5

---

## Partner System

**Description:** An external system (marketplace, price comparison site, affiliate, reseller platform) that consumes catalog data programmatically.

**Goals:** Retrieve current product information, pricing, and availability to display or process in its own system. Keep data synchronized with the catalog.

**Context:** Machine-to-machine interaction. Needs bulk data access, batch queries, and reliable update mechanisms. No human browsing involved.

**Primary Job Stories:** JS6

---

## Persona–Job Story Matrix

| Persona | JS1 | JS2 | JS3 | JS4 | JS5 | JS6 |
|---------|-----|-----|-----|-----|-----|-----|
| Professional Integrator | x | x | x | x | x | |
| Fleet Procurement Buyer | x | x | x | x | x | |
| Casual Browser | x | x | | | x | |
| Partner System | | | | | | x |
