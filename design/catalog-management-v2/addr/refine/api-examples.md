# Catalog Management v2 — API Examples

## 1) Product Lifecycle — Create Product

```http
POST /product-lifecycle/v1/products HTTP/1.1
Host: api.droneparts.com
Content-Type: application/json
X-API-Key: <api-key>

{
  "sku": "TMOTOR-VELOX-V2306-1750KV",
  "name": "T-Motor Velox V2306 1750KV",
  "brand": "T-Motor",
  "baselineSpecifications": {
    "kvRating": 1750,
    "motorSize": "2306"
  }
}
```

## 2) Technical Docs — Publish Document Version

```bash
curl -X POST "https://api.droneparts.com/technical-docs/v1/documents/58ef5af0-0f9a-43cd-9d0a-f6f23752d11f/versions" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Idempotency-Key: docs-ver-20260226-001" \
  -d '{
    "storageReference": "s3://catalog-docs/tmotor/v2306/v3.pdf",
    "checksum": "sha256:3f2d89c2f95f5f4a2f1d",
    "versionNotes": "Updated torque chart and dimensions"
  }'
```

## 3) Pricing — Queue Repricing Job (Async)

```http
POST /pricing/v1/repricing-jobs HTTP/1.1
Host: api.droneparts.com
Content-Type: application/json
Idempotency-Key: repricing-20260226-001
X-API-Key: <api-key>

{
  "scopeType": "category",
  "scopeReference": "motors-brushless",
  "adjustmentType": "percentage",
  "adjustmentValue": -7.5
}
```

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{
  "repricingJobId": "9a78f8ea-5fd3-4fe9-b5e4-9adf8c96e115",
  "status": "queued"
}
```

## 4) Inventory — Update Quantity

```bash
curl -X PUT "https://api.droneparts.com/inventory/v1/inventory-positions/5b745f26-e4d1-4f0f-ae5d-8f95e25d2f8f/quantity" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -H 'If-Match: "v12"' \
  -d '{
    "onHandQuantity": 460,
    "reason": "Cycle count correction"
  }'
```

## 5) Taxonomy — Define Facets

```http
PUT /taxonomy/v1/categories/motors-brushless/facets HTTP/1.1
Host: api.droneparts.com
Content-Type: application/json
X-API-Key: <api-key>

{
  "facets": [
    { "facetKey": "kvRating", "displayName": "KV Rating", "dataType": "number" },
    { "facetKey": "motorSize", "displayName": "Motor Size", "dataType": "string" }
  ]
}
```

## 6) Compatibility Rules — Create Rule

```http
POST /compatibility-rules/v1/compatibility-rules HTTP/1.1
Host: api.droneparts.com
Content-Type: application/json
Idempotency-Key: compat-rule-20260226-001
X-API-Key: <api-key>

{
  "expression": "motor.maxVoltage <= esc.maxVoltage",
  "severity": "error",
  "componentTypes": ["motor", "esc"]
}
```

## 7) Governance — Record Decision

```http
POST /catalog-governance/v1/approval-cases/03724352-c0cd-4fa7-ac65-bddf8df0474d/decisions HTTP/1.1
Host: api.droneparts.com
Content-Type: application/json
Idempotency-Key: gov-decision-20260226-001
X-API-Key: <api-key>

{
  "decision": "approved",
  "rationale": "Risk controls validated and rollback path documented"
}
```

## 8) Bulk Ingestion — Replay Failed Items

```bash
curl -X POST "https://api.droneparts.com/bulk-ingestion/v1/import-batches/ca23dc58-7e65-4f89-81f3-2828ac8df4d0/replay-requests" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Idempotency-Key: replay-20260226-001" \
  -d '{
    "itemKeys": ["row-19", "row-44", "row-45"]
  }'
```
