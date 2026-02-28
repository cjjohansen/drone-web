# ADDR Refine Phase — Catalog Management v2

> **Phase:** 4 of 4 (Align -> Define -> Design -> **Refine**)  
> **Status:** Validated

## Overview

Refine converts the write-side design into implementation-ready artifacts for 8 admin APIs, event contracts, and usage documentation.

## OpenAPI 3.1 Specifications

| File | API | Operations |
|------|-----|------------|
| [product-lifecycle-api.yaml](product-lifecycle-api.yaml) | Product Lifecycle API | 7 |
| [technical-docs-api.yaml](technical-docs-api.yaml) | Technical Documentation API | 5 |
| [pricing-promotions-api.yaml](pricing-promotions-api.yaml) | Pricing and Promotions API | 5 |
| [inventory-availability-api.yaml](inventory-availability-api.yaml) | Inventory and Availability API | 6 |
| [taxonomy-api.yaml](taxonomy-api.yaml) | Category and Faceting API | 7 |
| [compatibility-rules-api.yaml](compatibility-rules-api.yaml) | Compatibility Rules API | 5 |
| [catalog-governance-api.yaml](catalog-governance-api.yaml) | Catalog Governance API | 4 |
| [bulk-ingestion-api.yaml](bulk-ingestion-api.yaml) | Bulk Ingestion API | 3 |

## AsyncAPI 3.0 Specification

| File | Description |
|------|-------------|
| [integration-events.yaml](integration-events.yaml) | Integration events emitted by command-side operations |

## Usage Artifacts

| File | Description |
|------|-------------|
| [api-examples.md](api-examples.md) | Representative HTTP + cURL request/response examples |
| [sequence-diagrams.md](sequence-diagrams.md) | Mermaid interaction flows with HTTP semantics |
| [postman/catalog-management-admin-apis.postman_collection.json](postman/catalog-management-admin-apis.postman_collection.json) | Postman collection with one folder per boundary |
| [validation.md](validation.md) | Validation report for OpenAPI/AsyncAPI and coverage checks |

## Post-ADDR EventModel Outputs

| File | Description |
|------|-------------|
| [../../eventmodel/config.json](../../eventmodel/config.json) | Event Modeling slice configuration |
| [../../eventmodel/high-level-analysis.json](../../eventmodel/high-level-analysis.json) | High-level EventModel use case analysis |
