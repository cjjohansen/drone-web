# Refine Phase — Validation Report

> **Phase:** ADDR — Refine
> **Date:** 2026-02-15 (updated 2026-02-20)
> **Status:** Validated

---

## Validation Approach

1. **Schema validation** — OpenAPI specs validated with `swagger-cli validate` (initial) and `@redocly/cli lint` (re-validation), AsyncAPI spec validated with `@asyncapi/cli validate`
2. **Operation coverage** — Cross-referenced all 19 Define phase operations against OpenAPI specs
3. **Example consistency** — Verified examples use consistent product IDs and data across specs and documentation
4. **Style guide compliance** — Verified all specs follow the Design phase style guide

## Schema Validation Results

### Initial Validation (2026-02-15)

| Spec | Tool | Result |
|------|------|--------|
| catalog-storefront-api.yaml | swagger-cli validate | Valid |
| component-compatibility-api.yaml | swagger-cli validate | Valid |
| partner-catalog-api.yaml | swagger-cli validate | Valid |
| integration-events.yaml | @asyncapi/cli validate | Valid (info: recommends AsyncAPI 3.1.0) |

### Re-validation with Redocly CLI (2026-02-20)

Initial Redocly lint found 19 warnings in the catalog-storefront-api.yaml (other specs had similar issues):

| Category | Count | Resolution |
|----------|-------|------------|
| Example values don't match `format: uuid` | 15 | Replaced all example IDs with valid UUID v4 values (D-019) |
| Missing `productId` in nested examples | 2 | Added required `productId` to pricing, availability, review, document examples (D-020) |
| Missing `license` in info | 1 | Added `license: { name: Proprietary }` to all 3 specs (D-020) |
| Missing 4xx response on getCategoryTree | 1 | Added `400` response reference (D-020) |

After fixes, all 3 OpenAPI specs pass Redocly lint with **zero warnings**.

| Spec | Tool | Result |
|------|------|--------|
| catalog-storefront-api.yaml | redocly lint | Valid, 0 warnings |
| component-compatibility-api.yaml | redocly lint | Valid, 0 warnings |
| partner-catalog-api.yaml | redocly lint | Valid, 0 warnings |

### UUID Mapping Reference

Example IDs across all specs use consistent UUID v4 values. System-generated identifiers use UUIDs; admin-curated identifiers remain human-readable strings.

| Entity | Example ID | UUID | Notes |
|--------|-----------|------|-------|
| Product (EMAX ECO II) | prod-001 | `d290f1ee-6c54-4b01-90e6-d701748f0851` | Primary example product |
| Product (T-Motor Velox) | prod-002 | `a23f6c7d-8e9b-4a12-b345-6789abcdef01` | Comparison candidate |
| Product (iFlight XING2) | prod-003 | `b34a7d8e-9f0c-4b23-8456-789abcdef012` | Comparison candidate |
| Product (T-Motor ESC) | prod-010 | `f47ac10b-58cc-4372-a567-0e02b2c3d479` | Compatible ESC |
| Product (4S ESC) | prod-020 | `7c9e6679-7425-40de-944b-e07fc1f90ae7` | Incompatible ESC |
| Product (6S ESC replacement) | prod-021 | `8daf8890-8536-41ef-a55c-f18ad2a01bf8` | Replacement suggestion |
| Product (Holybro ESC) | prod-022 | `9eb09901-9647-42f0-b66d-a29be3b12ca9` | Replacement suggestion |
| Product (component) | prod-030 | `c3d4e5f6-a7b8-4c9d-ae1f-2a3b4c5d6e7f` | Build component |
| Product (discontinued) | prod-099 | `e5f6a7b8-c9d0-4e1f-ba3b-4c5d6e7f8a9b` | Discontinued product |
| Compatibility Check 1 | chk-001 | `550e8400-e29b-41d4-a716-446655440000` | Failing check |
| Compatibility Check 2 | chk-002 | `660f9511-f30c-42e5-b827-557766551111` | Passing check |
| Review | rev-001 | `a1234567-b89c-4def-a012-3456789abcde` | Product review |
| Document (datasheet) | doc-001 | `c2345678-d9ae-4f01-b123-456789abcdef` | PDF datasheet |
| Document (CAD) | doc-002 | `d3456789-e0bf-4a12-8234-56789abcdef0` | STEP CAD model |
| Events | evt-001–007 | `1a2b3c4d-...` through `7a8b9c0d-...` | Integration events |

**Not changed (plain strings):**
- `categoryId` — Admin-curated slugs: `cat-motors-brushless`, `cat-escs-4in1`, etc.
- `feedId` — Composite timestamp: `feed-20260215-001`

### Files Updated

| File | Replacements | Notes |
|------|-------------|-------|
| catalog-storefront-api.yaml | 37 | + license, productId fixes, 400 response |
| component-compatibility-api.yaml | 16 | + license |
| partner-catalog-api.yaml | 14 | + license |
| integration-events.yaml | 12 | AsyncAPI event examples |
| api-examples.md | 72 | cURL and HTTP examples |
| catalog-storefront-api.postman_collection.json | 4 | Variables and body |
| component-compatibility-api.postman_collection.json | 6 | Variables and body |
| partner-catalog-api.postman_collection.json | 5 | Variables and body |
| sequence-diagrams.md | 0 | Readability note added; abbreviated IDs kept |

## Operation Coverage

All 19 operations from the Define phase are present in the OpenAPI specs:

- Catalog API: 14/14 operations
- Compatibility API: 2/2 operations
- Partner Catalog API: 3/3 operations

## Integration Event Coverage

All 7 integration events from the Define phase boundaries are documented in the AsyncAPI spec:

- Product.Created, Product.Updated, Product.Discontinued (consumed by Compatibility + Partner)
- Product.PriceChanged, Product.AvailabilityChanged (consumed by Partner only)
- Category.Created, Category.Updated (future extensibility)

## Findings

All findings from the Redocly re-validation have been resolved. Zero warnings remain across all 3 OpenAPI specs.
