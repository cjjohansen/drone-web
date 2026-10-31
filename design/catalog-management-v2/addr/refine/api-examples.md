# Catalog Management v2 — API Examples

## 1) Product Lifecycle — Create Product

```http
POST /product-lifecycle/v1/products HTTP/1.1
Host: api.example.com
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

## 1b) Product Lifecycle — Change the Specifications of an Active Product (202 Accepted)

On an active product every change goes through Catalog Governance review (drone-web D-041). The
manager sends the new values once, with a `reason` and a `riskLevel`.

```http
PATCH /product-lifecycle/v1/products/6a1f3c2e-4b5d-4e8f-9a0b-1c2d3e4f5a61/specifications HTTP/1.1
Host: api.example.com
Content-Type: application/json
If-Match: "7"
X-API-Key: <api-key>

{
  "maxCurrent": 38.0,
  "reason": "Supplier corrected the datasheet (rev C)",
  "riskLevel": "medium"
}
```

```http
HTTP/1.1 202 Accepted
Location: https://api.example.com/catalog-governance/v1/approval-cases/5c0e8b4a-2d1f-4a3b-9c6d-7e8f9a0b1c22
Retry-After: 30
Content-Type: application/json

{
  "approvalCaseId": "5c0e8b4a-2d1f-4a3b-9c6d-7e8f9a0b1c22",
  "changeType": "specification-change",
  "status": "pending",
  "requestedChange": "maxCurrent 41.5 A to 38.0 A",
  "product": {
    "productId": "6a1f3c2e-4b5d-4e8f-9a0b-1c2d3e4f5a61",
    "sku": "TMOTOR-VELOX-V2306-1750KV",
    "name": "T-Motor Velox V2306 1750KV",
    "brand": "T-Motor",
    "lifecycleState": "active"
  },
  "links": {
    "approvalCase": { "href": "https://api.example.com/catalog-governance/v1/approval-cases/5c0e8b4a-2d1f-4a3b-9c6d-7e8f9a0b1c22", "method": "GET" },
    "product": { "href": "https://api.example.com/product-lifecycle/v1/products/6a1f3c2e-4b5d-4e8f-9a0b-1c2d3e4f5a61", "method": "GET" }
  }
}
```

The client reads the approval case at `Location` (`getApprovalCase()`) until its status is
`released`, `rejected` or `expired`:

```http
GET /catalog-governance/v1/approval-cases/5c0e8b4a-2d1f-4a3b-9c6d-7e8f9a0b1c22 HTTP/1.1
Host: api.example.com
X-API-Key: <api-key>
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "approvalCaseId": "5c0e8b4a-2d1f-4a3b-9c6d-7e8f9a0b1c22",
  "changeType": "specification-change",
  "sourceReferenceId": "6a1f3c2e-4b5d-4e8f-9a0b-1c2d3e4f5a61",
  "riskLevel": "medium",
  "status": "released",
  "requestedChange": "maxCurrent 41.5 A to 38.0 A",
  "reviewRoute": "agent-then-person",
  "decidedBy": "Lena Holm",
  "gate": "released",
  "releasedBy": "Lena Holm"
}
```

There is no second call. After the release Product Data applies the values of the request itself
(drone-web D-042): the product then shows `maxCurrent` 38.0, and the product-specifications stream
carries `ProductSpecificationChanged` (drone-web D-037). `PATCH /product-lifecycle/v1/products/{productId}`
(`updateProductAttributes()`) works in the same way for the name and short description.

## 1c) Product Lifecycle — Request Activation, Then Publish

```http
POST /product-lifecycle/v1/products/6a1f3c2e-4b5d-4e8f-9a0b-1c2d3e4f5a61/lifecycle-transitions HTTP/1.1
Host: api.example.com
Content-Type: application/json
Idempotency-Key: lifecycle-20261102-001
X-API-Key: <api-key>

{
  "targetState": "active",
  "reason": "Launch with the 5-inch freestyle range"
}
```

```http
HTTP/1.1 202 Accepted
Location: https://api.example.com/catalog-governance/v1/approval-cases/03724352-c0cd-4fa7-ac65-bddf8df0474d
Content-Type: application/json

{
  "approvalCaseId": "03724352-c0cd-4fa7-ac65-bddf8df0474d",
  "status": "pending",
  "product": {
    "productId": "6a1f3c2e-4b5d-4e8f-9a0b-1c2d3e4f5a61",
    "sku": "TMOTOR-VELOX-V2306-1750KV",
    "name": "T-Motor Velox V2306 1750KV",
    "brand": "T-Motor",
    "lifecycleState": "draft"
  },
  "links": {
    "approvalCase": { "href": "https://api.example.com/catalog-governance/v1/approval-cases/03724352-c0cd-4fa7-ac65-bddf8df0474d", "method": "GET" }
  }
}
```

When the approval case is `released`, the manager publishes the product (`publishProduct()`, CJ D6a):

```http
POST /product-lifecycle/v1/products/6a1f3c2e-4b5d-4e8f-9a0b-1c2d3e4f5a61/publications HTTP/1.1
Host: api.example.com
Idempotency-Key: publish-20261103-001
X-API-Key: <api-key>
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "transitionId": "1e2d3c4b-5a69-4788-9a0b-c1d2e3f4a5b6",
  "product": {
    "productId": "6a1f3c2e-4b5d-4e8f-9a0b-1c2d3e4f5a61",
    "sku": "TMOTOR-VELOX-V2306-1750KV",
    "name": "T-Motor Velox V2306 1750KV",
    "brand": "T-Motor",
    "lifecycleState": "active"
  }
}
```

Without a released activation the answer is `409 Conflict` (not-cleared-for-release, PLC-007).

## 2) Technical Docs — Publish Document Version

```bash
curl -X POST "https://api.example.com/technical-docs/v1/documents/58ef5af0-0f9a-43cd-9d0a-f6f23752d11f/versions" \
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
Host: api.example.com
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
curl -X PUT "https://api.example.com/inventory/v1/inventory-positions/5b745f26-e4d1-4f0f-ae5d-8f95e25d2f8f/quantity" \
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
Host: api.example.com
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
Host: api.example.com
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
Host: api.example.com
Content-Type: application/json
Idempotency-Key: gov-decision-20260226-001
X-API-Key: <api-key>

{
  "decision": "approved",
  "rationale": "Risk controls validated and rollback path documented"
}
```

Response. The person who decides need not be the assigned reviewer: any holder of the reviewer role
for the case's risk level may decide. The roles come from the reviewer directory (drone-web D-039).

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "approvalCaseId": "03724352-c0cd-4fa7-ac65-bddf8df0474d",
  "decisionId": "5b0e7c4a-2d1f-4e6b-9a3c-8f7d6e5c4b3a",
  "status": "approved",
  "decidedBy": "Omar Vik",
  "deciderRiskLevels": ["high", "critical"],
  "decidedAt": "2026-11-02T14:30:00Z"
}
```

A person without the reviewer role for the risk level gets `403 Forbidden`
(`application/problem+json`, no-reviewer-role-for-the-risk).

## 8) Bulk Ingestion — Replay Failed Items

```bash
curl -X POST "https://api.example.com/bulk-ingestion/v1/import-batches/ca23dc58-7e65-4f89-81f3-2828ac8df4d0/replay-requests" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Idempotency-Key: replay-20260226-001" \
  -d '{
    "itemKeys": ["row-19", "row-44", "row-45"]
  }'
```
