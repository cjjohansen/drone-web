# ADDR Design Phase

> **Phase:** 3 of 4 (Align → Define → **Design** → Refine)
> **Status:** Validated

## Overview

The Design phase translates the Define phase's implementation-agnostic API profiles into concrete HTTP designs — selecting HTTP methods, defining resource paths, specifying request/response shapes, and mapping status codes.

## Artifacts

| File | Description |
|------|-------------|
| [style-guide.md](style-guide.md) | API design style guidelines (RESTful, offset pagination, RFC 9457 errors, RFC 3339 dates) |
| [api-design.md](api-design.md) | High-level API design tables for all 3 boundaries (19 operations) |
| [validation.md](validation.md) | Validation report — all 19 operations cross-referenced against Define profiles and style guide |

## Summary

| Boundary | Base Path | Operations | HTTP Methods |
|----------|-----------|------------|--------------|
| Catalog Storefront API | `/catalog/v1` | 14 | GET (11), POST (3) |
| Component Compatibility API | `/compatibility/v1` | 2 | POST (1), GET (1) |
| Partner Catalog Syndication API | `/partner-catalog/v1` | 3 | GET (1), POST (2) |

## Key Design Decisions

- **D-016:** Search, compare, and batch operations use POST (complex bodies, PII concerns, URL length limits)
- **D-017:** Compatibility checks return 201 Created (creates an addressable resource)
- **D-018:** Product sub-resources (pricing, reviews, docs, etc.) use sub-resource paths for independent caching and access control

## Input Artifacts (from Define)

- [API Profiles](../define/api-profiles.md) — 19 operations with characteristics
- [Resources](../define/resources.md) — 14 resources with properties
- [Boundaries](../define/boundaries.md) — 3 bounded contexts
