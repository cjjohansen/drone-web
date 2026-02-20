# Catalog Storefront — API Request/Response Examples

> **Phase:** ADDR — Refine
> **Format:** HTTP + cURL examples for each job story

---

## JS1: Product Discovery

### Search the catalog

```http
POST /catalog/v1/products/search HTTP/1.1
Host: api.droneparts.com
Content-Type: application/json
X-API-Key: your-api-key

{
  "query": "brushless motor 2207",
  "filters": {
    "categoryId": "cat-motors-brushless",
    "specifications": {
      "kvRating": { "min": 1700, "max": 2500 },
      "voltage": "4S-6S"
    },
    "priceRange": { "min": 15, "max": 50 }
  },
  "sort": "price",
  "offset": 0,
  "limit": 20
}
```

```bash
curl -X POST https://api.droneparts.com/catalog/v1/products/search \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "query": "brushless motor 2207",
    "filters": {
      "categoryId": "cat-motors-brushless",
      "specifications": { "kvRating": { "min": 1700, "max": 2500 } },
      "priceRange": { "min": 15, "max": 50 }
    },
    "sort": "price",
    "offset": 0,
    "limit": 20
  }'
```

**Response: 200 OK**
```json
{
  "totalResults": 47,
  "products": [
    {
      "productId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
      "name": "EMAX ECO II 2207 1900KV",
      "shortDescription": "High-efficiency brushless motor for 5\" freestyle builds",
      "brand": "EMAX",
      "pricing": { "basePrice": 18.99, "currency": "USD" },
      "availability": { "status": "in-stock", "quantityAvailable": 342 },
      "images": ["https://cdn.droneparts.com/img/d290f1ee-6c54-4b01-90e6-d701748f0851-thumb.jpg"]
    },
    {
      "productId": "a23f6c7d-8e9b-4a12-b345-6789abcdef01",
      "name": "T-Motor Velox V2 2207 1950KV",
      "shortDescription": "Premium racing motor with titanium shaft",
      "brand": "T-Motor",
      "pricing": { "basePrice": 24.99, "currency": "USD" },
      "availability": { "status": "in-stock", "quantityAvailable": 156 },
      "images": ["https://cdn.droneparts.com/img/a23f6c7d-8e9b-4a12-b345-6789abcdef01-thumb.jpg"]
    }
  ],
  "offset": 0,
  "limit": 20
}
```

### Get autocomplete suggestions

```http
POST /catalog/v1/products/autocomplete HTTP/1.1
Host: api.droneparts.com
Content-Type: application/json
X-API-Key: your-api-key

{ "query": "brus", "limit": 5 }
```

**Response: 200 OK**
```json
{
  "suggestedTerms": ["brushless motor", "brushless ESC", "brushed motor"],
  "suggestedCategories": [
    { "categoryId": "cat-motors-brushless", "name": "Brushless Motors" }
  ],
  "suggestedProducts": [
    { "productId": "d290f1ee-6c54-4b01-90e6-d701748f0851", "name": "EMAX ECO II 2207 1900KV" }
  ]
}
```

---

## JS2: Product Evaluation

### Get product details

```http
GET /catalog/v1/products/d290f1ee-6c54-4b01-90e6-d701748f0851 HTTP/1.1
Host: api.droneparts.com
X-API-Key: your-api-key
```

```bash
curl https://api.droneparts.com/catalog/v1/products/d290f1ee-6c54-4b01-90e6-d701748f0851 \
  -H "X-API-Key: your-api-key"
```

**Response: 200 OK**
```json
{
  "productId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "name": "EMAX ECO II 2207 1900KV",
  "description": "The EMAX ECO II series delivers high efficiency and smooth power delivery for 5-inch freestyle and racing quads.",
  "brand": "EMAX",
  "sku": "EMAX-ECO2-2207-1900",
  "status": "active",
  "specifications": {
    "motorSize": "2207",
    "kvRating": 1900,
    "weight": "31.6g",
    "shaftDiameter": "5mm",
    "voltage": "4S-6S",
    "maxThrust": "1580g"
  },
  "categories": ["cat-motors-brushless"],
  "pricing": {
    "basePrice": 18.99,
    "currency": "USD",
    "volumeDiscounts": [
      { "minQuantity": 10, "price": 16.99 },
      { "minQuantity": 50, "price": 14.99 }
    ]
  },
  "availability": {
    "status": "in-stock",
    "quantityAvailable": 342
  },
  "createdDate": "2025-06-15T10:00:00Z",
  "updatedDate": "2026-01-20T14:30:00Z"
}
```

### Get technical documents

```http
GET /catalog/v1/products/d290f1ee-6c54-4b01-90e6-d701748f0851/documents?type=datasheet HTTP/1.1
Host: api.droneparts.com
X-API-Key: your-api-key
```

**Response: 200 OK**
```json
[
  {
    "documentId": "c2345678-d9ae-4f01-b123-456789abcdef",
    "title": "EMAX ECO II 2207 Datasheet",
    "type": "datasheet",
    "format": "PDF",
    "url": "https://cdn.droneparts.com/docs/emax-eco2-2207-datasheet.pdf",
    "fileSize": 245760
  }
]
```

### Get product reviews

```http
GET /catalog/v1/products/d290f1ee-6c54-4b01-90e6-d701748f0851/reviews?sort=rating&offset=0&limit=5 HTTP/1.1
Host: api.droneparts.com
X-API-Key: your-api-key
```

**Response: 200 OK**
```json
{
  "totalResults": 23,
  "averageRating": 4.6,
  "reviews": [
    {
      "reviewId": "a1234567-b89c-4def-a012-3456789abcde",
      "rating": 5,
      "title": "Excellent motor for freestyle",
      "body": "Smooth power delivery, great build quality. Running on 6S with Gemfan 51466.",
      "author": "FPV_Builder_Pro",
      "verifiedPurchase": true,
      "createdDate": "2026-01-15T09:30:00Z"
    }
  ],
  "offset": 0,
  "limit": 5
}
```

### Get compatible products

```http
GET /catalog/v1/products/d290f1ee-6c54-4b01-90e6-d701748f0851/compatible?offset=0&limit=5 HTTP/1.1
Host: api.droneparts.com
X-API-Key: your-api-key
```

**Response: 200 OK**
```json
{
  "totalResults": 12,
  "products": [
    {
      "productId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "name": "T-Motor F45A 4-in-1 ESC",
      "shortDescription": "45A BLHeli_32 ESC, supports 4S-6S",
      "brand": "T-Motor",
      "pricing": { "basePrice": 42.99, "currency": "USD" },
      "availability": { "status": "in-stock", "quantityAvailable": 89 }
    }
  ],
  "offset": 0,
  "limit": 5
}
```

---

## JS3: Product Comparison

### Compare products side by side

```http
POST /catalog/v1/products/compare HTTP/1.1
Host: api.droneparts.com
Content-Type: application/json
X-API-Key: your-api-key

{ "productIds": ["d290f1ee-6c54-4b01-90e6-d701748f0851", "a23f6c7d-8e9b-4a12-b345-6789abcdef01", "b34a7d8e-9f0c-4b23-8456-789abcdef012"] }
```

```bash
curl -X POST https://api.droneparts.com/catalog/v1/products/compare \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{ "productIds": ["d290f1ee-6c54-4b01-90e6-d701748f0851", "a23f6c7d-8e9b-4a12-b345-6789abcdef01", "b34a7d8e-9f0c-4b23-8456-789abcdef012"] }'
```

**Response: 200 OK**
```json
{
  "products": [
    { "productId": "d290f1ee-6c54-4b01-90e6-d701748f0851", "name": "EMAX ECO II 2207 1900KV" },
    { "productId": "a23f6c7d-8e9b-4a12-b345-6789abcdef01", "name": "T-Motor Velox V2 2207 1950KV" },
    { "productId": "b34a7d8e-9f0c-4b23-8456-789abcdef012", "name": "iFlight XING2 2207 1855KV" }
  ],
  "sharedSpecifications": {
    "motorSize": { "d290f1ee-6c54-4b01-90e6-d701748f0851": "2207", "a23f6c7d-8e9b-4a12-b345-6789abcdef01": "2207", "b34a7d8e-9f0c-4b23-8456-789abcdef012": "2207" },
    "motorType": { "d290f1ee-6c54-4b01-90e6-d701748f0851": "brushless", "a23f6c7d-8e9b-4a12-b345-6789abcdef01": "brushless", "b34a7d8e-9f0c-4b23-8456-789abcdef012": "brushless" }
  },
  "differingSpecifications": {
    "kvRating": { "d290f1ee-6c54-4b01-90e6-d701748f0851": 1900, "a23f6c7d-8e9b-4a12-b345-6789abcdef01": 1950, "b34a7d8e-9f0c-4b23-8456-789abcdef012": 1855 },
    "weight": { "d290f1ee-6c54-4b01-90e6-d701748f0851": "31.6g", "a23f6c7d-8e9b-4a12-b345-6789abcdef01": "30.2g", "b34a7d8e-9f0c-4b23-8456-789abcdef012": "32.1g" },
    "maxThrust": { "d290f1ee-6c54-4b01-90e6-d701748f0851": "1580g", "a23f6c7d-8e9b-4a12-b345-6789abcdef01": "1620g", "b34a7d8e-9f0c-4b23-8456-789abcdef012": "1550g" },
    "basePrice": { "d290f1ee-6c54-4b01-90e6-d701748f0851": 18.99, "a23f6c7d-8e9b-4a12-b345-6789abcdef01": 24.99, "b34a7d8e-9f0c-4b23-8456-789abcdef012": 21.99 }
  }
}
```

---

## JS4: Compatibility Verification

### Check component compatibility

```http
POST /compatibility/v1/checks HTTP/1.1
Host: api.droneparts.com
Content-Type: application/json
X-API-Key: your-api-key

{ "productIds": ["d290f1ee-6c54-4b01-90e6-d701748f0851", "f47ac10b-58cc-4372-a567-0e02b2c3d479", "7c9e6679-7425-40de-944b-e07fc1f90ae7", "c3d4e5f6-a7b8-4c9d-ae1f-2a3b4c5d6e7f"] }
```

```bash
curl -X POST https://api.droneparts.com/compatibility/v1/checks \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{ "productIds": ["d290f1ee-6c54-4b01-90e6-d701748f0851", "f47ac10b-58cc-4372-a567-0e02b2c3d479", "7c9e6679-7425-40de-944b-e07fc1f90ae7", "c3d4e5f6-a7b8-4c9d-ae1f-2a3b4c5d6e7f"] }'
```

**Response: 201 Created**
```json
{
  "checkId": "550e8400-e29b-41d4-a716-446655440000",
  "components": ["d290f1ee-6c54-4b01-90e6-d701748f0851", "f47ac10b-58cc-4372-a567-0e02b2c3d479", "7c9e6679-7425-40de-944b-e07fc1f90ae7", "c3d4e5f6-a7b8-4c9d-ae1f-2a3b4c5d6e7f"],
  "status": "fail",
  "incompatibilities": [
    {
      "componentA": "d290f1ee-6c54-4b01-90e6-d701748f0851",
      "componentB": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "rule": "Motor voltage range (4S-6S) exceeds ESC maximum (4S)",
      "type": "voltage-mismatch",
      "severity": "error"
    }
  ],
  "checkedDate": "2026-02-15T14:30:00Z"
}
```

### Get compatible replacements

```http
GET /compatibility/v1/checks/550e8400-e29b-41d4-a716-446655440000/replacements/7c9e6679-7425-40de-944b-e07fc1f90ae7 HTTP/1.1
Host: api.droneparts.com
X-API-Key: your-api-key
```

**Response: 200 OK**
```json
[
  {
    "productId": "8daf8890-8536-41ef-a55c-f18ad2a01bf8",
    "name": "T-Motor F45A 4-in-1 ESC (6S)",
    "brand": "T-Motor",
    "specifications": { "maxVoltage": "6S", "continuousCurrent": "45A" },
    "pricing": { "basePrice": 42.99, "currency": "USD" }
  },
  {
    "productId": "9eb09901-9647-42f0-b66d-a29be3b12ca9",
    "name": "Holybro Tekko32 F4 50A (6S)",
    "brand": "Holybro",
    "specifications": { "maxVoltage": "6S", "continuousCurrent": "50A" },
    "pricing": { "basePrice": 49.99, "currency": "USD" }
  }
]
```

---

## JS5: Catalog Browsing

### Get category tree

```http
GET /catalog/v1/categories HTTP/1.1
Host: api.droneparts.com
X-API-Key: your-api-key
```

**Response: 200 OK**
```json
[
  {
    "categoryId": "cat-motors",
    "name": "Motors",
    "description": "Drone motors — brushless and brushed",
    "childCategories": [
      { "categoryId": "cat-motors-brushless", "name": "Brushless Motors" },
      { "categoryId": "cat-motors-brushed", "name": "Brushed Motors" }
    ],
    "productCount": 156,
    "sortOrder": 1
  },
  {
    "categoryId": "cat-escs",
    "name": "ESCs",
    "description": "Electronic speed controllers",
    "childCategories": [
      { "categoryId": "cat-escs-4in1", "name": "4-in-1 ESCs" },
      { "categoryId": "cat-escs-single", "name": "Single ESCs" }
    ],
    "productCount": 89,
    "sortOrder": 2
  }
]
```

### Get category facets

```http
GET /catalog/v1/categories/cat-motors-brushless/facets HTTP/1.1
Host: api.droneparts.com
X-API-Key: your-api-key
```

**Response: 200 OK**
```json
[
  { "name": "kvRating", "type": "range", "range": { "min": 1400, "max": 2700 } },
  { "name": "shaftDiameter", "type": "enum", "values": ["1.5mm", "3mm", "5mm"] },
  { "name": "voltage", "type": "enum", "values": ["3S", "4S", "4S-6S", "6S"] }
]
```

### Get category products

```http
GET /catalog/v1/categories/cat-motors-brushless/products?sort=price&offset=0&limit=10 HTTP/1.1
Host: api.droneparts.com
X-API-Key: your-api-key
```

**Response: 200 OK**
```json
{
  "totalResults": 78,
  "products": [
    {
      "productId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
      "name": "EMAX ECO II 2207 1900KV",
      "shortDescription": "High-efficiency brushless motor for 5\" freestyle builds",
      "brand": "EMAX",
      "pricing": { "basePrice": 18.99, "currency": "USD" },
      "availability": { "status": "in-stock", "quantityAvailable": 342 }
    }
  ],
  "offset": 0,
  "limit": 10
}
```

---

## JS6: Partner Catalog Access

### Get catalog feed

```http
GET /partner-catalog/v1/feed?lastUpdatedSince=2026-02-01T00:00:00Z&offset=0&limit=100 HTTP/1.1
Host: api.droneparts.com
X-API-Key: partner-api-key
```

```bash
curl "https://api.droneparts.com/partner-catalog/v1/feed?lastUpdatedSince=2026-02-01T00:00:00Z&limit=100" \
  -H "X-API-Key: partner-api-key"
```

**Response: 200 OK**
```json
{
  "feedId": "feed-20260215-001",
  "generatedDate": "2026-02-15T15:00:00Z",
  "productCount": 2,
  "products": [
    {
      "productId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
      "name": "EMAX ECO II 2207 1900KV",
      "brand": "EMAX",
      "sku": "EMAX-ECO2-2207-1900",
      "specifications": { "motorSize": "2207", "kvRating": 1900, "weight": "31.6g" },
      "categories": ["Brushless Motors"],
      "pricing": { "basePrice": 18.99, "currency": "USD" },
      "availability": { "status": "in-stock", "quantityAvailable": 342 },
      "updatedDate": "2026-01-20T14:30:00Z"
    }
  ],
  "offset": 0,
  "limit": 100
}
```

### Check batch availability

```http
POST /partner-catalog/v1/availability HTTP/1.1
Host: api.droneparts.com
Content-Type: application/json
X-API-Key: partner-api-key

{ "productIds": ["d290f1ee-6c54-4b01-90e6-d701748f0851", "f47ac10b-58cc-4372-a567-0e02b2c3d479", "7c9e6679-7425-40de-944b-e07fc1f90ae7"] }
```

**Response: 200 OK**
```json
[
  { "productId": "d290f1ee-6c54-4b01-90e6-d701748f0851", "status": "in-stock", "quantityAvailable": 342, "estimatedRestockDate": null },
  { "productId": "f47ac10b-58cc-4372-a567-0e02b2c3d479", "status": "in-stock", "quantityAvailable": 89, "estimatedRestockDate": null },
  { "productId": "7c9e6679-7425-40de-944b-e07fc1f90ae7", "status": "backorder", "quantityAvailable": 0, "estimatedRestockDate": "2026-03-01T00:00:00Z" }
]
```

### Get batch pricing

```http
POST /partner-catalog/v1/pricing HTTP/1.1
Host: api.droneparts.com
Content-Type: application/json
X-API-Key: partner-api-key

{ "productIds": ["d290f1ee-6c54-4b01-90e6-d701748f0851", "f47ac10b-58cc-4372-a567-0e02b2c3d479"] }
```

**Response: 200 OK**
```json
[
  {
    "productId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "basePrice": 18.99,
    "volumeDiscounts": [
      { "minQuantity": 10, "price": 16.99 },
      { "minQuantity": 50, "price": 14.99 }
    ],
    "activePromotions": [],
    "currency": "USD"
  },
  {
    "productId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "basePrice": 42.99,
    "volumeDiscounts": [{ "minQuantity": 5, "price": 39.99 }],
    "activePromotions": [],
    "currency": "USD"
  }
]
```

---

## Error Example

### Product not found

```http
GET /catalog/v1/products/prod-nonexistent HTTP/1.1
Host: api.droneparts.com
X-API-Key: your-api-key
```

**Response: 404 Not Found**
```json
{
  "type": "https://api.droneparts.com/problems/not-found",
  "title": "Product Not Found",
  "status": 404,
  "detail": "Product with ID 'prod-nonexistent' does not exist.",
  "instance": "/catalog/v1/products/prod-nonexistent"
}
```
