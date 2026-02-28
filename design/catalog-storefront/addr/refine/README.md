# ADDR Refine Phase

> **Phase:** 4 of 4 (Align → Define → Design → **Refine**)
> **Status:** Validated

## Overview

The Refine phase produces implementation-ready artifacts: OpenAPI specs, AsyncAPI specs for integration events, request/response examples, sequence diagrams with HTTP semantics, and Postman collections.

## Artifacts

### OpenAPI 3.1 Specifications

| File | API | Operations |
|------|-----|------------|
| [catalog-storefront-api.yaml](catalog-storefront-api.yaml) | Catalog Storefront API | 14 operations |
| [component-compatibility-api.yaml](component-compatibility-api.yaml) | Component Compatibility API | 2 operations |
| [partner-catalog-api.yaml](partner-catalog-api.yaml) | Partner Catalog Syndication API | 3 operations |

All specs validated with `swagger-cli validate`.

### AsyncAPI 3.0 Specification

| File | Description |
|------|-------------|
| [integration-events.yaml](integration-events.yaml) | 7 integration events published by Catalog API for cross-boundary consumption |

Validated with `@asyncapi/cli validate`.

### Documentation

| File | Description |
|------|-------------|
| [api-examples.md](api-examples.md) | HTTP + cURL request/response examples for all 6 job stories |
| [sequence-diagrams.md](sequence-diagrams.md) | Mermaid sequence diagrams with HTTP methods and status codes |

### Postman Collections

| File | API |
|------|-----|
| [postman/catalog-storefront-api.postman_collection.json](postman/catalog-storefront-api.postman_collection.json) | Catalog Storefront API |
| [postman/component-compatibility-api.postman_collection.json](postman/component-compatibility-api.postman_collection.json) | Component Compatibility API |
| [postman/partner-catalog-api.postman_collection.json](postman/partner-catalog-api.postman_collection.json) | Partner Catalog Syndication API |

## Integration Events

7 integration events published by the Catalog API — a curated subset of internal domain events projected for cross-boundary consumption:

| Channel | Event | Consumers |
|---------|-------|-----------|
| catalog.product.created | ProductCreated | Compatibility API, Partner Catalog API |
| catalog.product.updated | ProductUpdated | Compatibility API, Partner Catalog API |
| catalog.product.discontinued | ProductDiscontinued | Compatibility API, Partner Catalog API |
| catalog.product.price-changed | ProductPriceChanged | Partner Catalog API |
| catalog.product.availability-changed | ProductAvailabilityChanged | Partner Catalog API |
| catalog.category.created | CategoryCreated | (future extensibility) |
| catalog.category.updated | CategoryUpdated | (future extensibility) |

## Validation

- OpenAPI specs: `npx swagger-cli validate <file>.yaml` — all 3 pass
- AsyncAPI spec: `npx @asyncapi/cli validate <file>.yaml` — passes (info: recommends 3.1.0)
- All examples consistent with spec schemas
- All 19 operations covered across the 3 OpenAPI specs
