# ADDR Design Phase — Catalog Management v2

> **Phase:** 3 of 4 (Align -> Define -> **Design** -> Refine)
> **Status:** Draft

## Overview

The Design phase translates the Define phase API profiles into high-level HTTP API designs for write-side catalog administration. This includes method selection, resource path design, success/error status mapping, and command/query request-response shapes.

## Artifacts

| File | Description |
|------|-------------|
| [style-guide.md](../../../style-guide.md) | Shared style guidance extended with write-side conventions (idempotency keys, optimistic concurrency, async command handling) |
| [api-design.md](api-design.md) | High-level API design tables for all 8 write-side boundaries (42 operations) |
| [validation.md](validation.md) | Validation report cross-referencing Define API profiles to Design HTTP mappings |

## Summary

| Boundary | Base Path | Operations | HTTP Methods |
|----------|-----------|------------|--------------|
| Product Lifecycle API | `/product-lifecycle/v1` | 7 | POST (3), PATCH (2), PUT (1), GET (1) |
| Technical Documentation API | `/technical-docs/v1` | 5 | POST (3), PATCH (1), PUT (1) |
| Pricing and Promotions API | `/pricing/v1` | 5 | POST (3), PUT (2) |
| Inventory and Availability API | `/inventory/v1` | 6 | POST (2), PATCH (2), PUT (2) |
| Category and Faceting API | `/taxonomy/v1` | 7 | POST (3), PATCH (1), PUT (2), DELETE (1) |
| Compatibility Rules API | `/compatibility-rules/v1` | 5 | POST (3), PATCH (2) |
| Catalog Governance API | `/catalog-governance/v1` | 4 | POST (3), PUT (1) |
| Bulk Ingestion API | `/bulk-ingestion/v1` | 3 | POST (2), GET (1) |

## Input Artifacts (from Define)

- [API Profiles](../define/api-profiles.md)
- [Resources](../define/resources.md)
- [Boundaries](../define/boundaries.md)
