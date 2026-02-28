# Catalog Management — Personas

> **Subdomain:** Catalog Management
> **Phase:** ADDR — Align
> **Status:** Draft

---

## Catalog Manager

**Description:** A product specialist responsible for the catalog lifecycle — adding new mechatronic products, maintaining specifications, managing technical documentation, and handling discontinuations. Domain expert in drones, motors, ESCs, flight controllers, and related components.

**Goals:** Keep the catalog accurate, complete, and current. Ensure every product has full specifications, documentation, and correct categorization before it becomes visible to customers.

**Context:** Works daily in the catalog system. Coordinates with suppliers for spec sheets and compliance documents. May onboard dozens of products per week. Needs bulk operations and efficient workflows. Must handle both individual product updates and batch imports from supplier feeds.

**Primary Job Stories:** JS1, JS2

---

## Pricing Analyst

**Description:** A commercial team member responsible for pricing strategy — base prices, volume discount tiers, time-limited promotions, and competitive adjustments across the catalog.

**Goals:** Implement pricing strategy that balances competitiveness with margin targets. Manage volume discount tiers for fleet procurement buyers. Schedule promotional pricing with defined start/end dates.

**Context:** Works with market data and competitor pricing. Needs to adjust prices across product groups (e.g., all brushless motors). Changes must be auditable and support effective dates (not immediate-only). Coordinates with sales team on fleet pricing tiers.

**Primary Job Stories:** JS3

---

## Inventory Controller

**Description:** A supply chain team member responsible for product availability — stock levels, restock schedules, supplier lead times, and backorder management.

**Goals:** Keep availability data accurate so customers see realistic stock status and lead times. Coordinate restocking to minimize stockouts. Manage supplier lead time changes and discontinuation transitions.

**Context:** Interfaces with warehouse management and supplier systems. Updates may come from manual entry or automated feeds. Needs to flag low-stock situations and update lead times when supply chain conditions change. Handles the operational side of product discontinuation (clearing remaining stock, managing backorders).

**Primary Job Stories:** JS4

---

## Category Manager

**Description:** A merchandising team member who organizes the product taxonomy — the category hierarchy, facet definitions, and product-to-category assignments that shape the browsing experience.

**Goals:** Maintain a well-organized, intuitive category structure that helps customers discover products. Add new categories as the product range expands. Ensure products are correctly categorized with appropriate facets.

**Context:** Thinks about information architecture and customer navigation patterns. Works closely with the Catalog Manager on new product categorization. May reorganize categories seasonally or when new product lines are introduced. Changes affect the storefront browsing experience immediately.

**Primary Job Stories:** JS5

---

## Compatibility Engineer

**Description:** A technical specialist who defines and maintains the compatibility rules that determine which mechatronic components work together — voltage ranges, current limits, physical dimensions, protocol compatibility, and mounting standards.

**Goals:** Ensure the compatibility verification system provides accurate pass/fail results and meaningful replacement suggestions. Keep rules current as new products are added and specifications evolve.

**Context:** Deep technical knowledge of mechatronic systems. Defines rules like "this ESC supports 3S-6S LiPo, so it's compatible with batteries in that voltage range" or "this motor's shaft diameter must match the propeller adapter." Rules may be simple (range checks) or complex (multi-factor compatibility matrices). New products require compatibility rule assessment before going live.

**Primary Job Stories:** JS6

---

## Persona–Job Story Matrix

| Persona | JS1 | JS2 | JS3 | JS4 | JS5 | JS6 |
|---------|-----|-----|-----|-----|-----|-----|
| Catalog Manager | x | x | | | x | |
| Pricing Analyst | | | x | | | |
| Inventory Controller | | | | x | | |
| Category Manager | | | | | x | |
| Compatibility Engineer | x | | | | | x |
