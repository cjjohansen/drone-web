# Catalog Storefront — API Design Style Guide

> **Phase:** ADDR — Design
> **Status:** Draft

---

## 1. General API Principles

- Design APIs to be intuitive, consistent, and interoperable within an open ecosystem.
- Follow RESTful principles — each API is a well-defined resource with appropriate HTTP methods.
- Default response format is JSON, adhering to RFC 8259 standards.

## 2. URL and Resource Design

- **Base path structure:** `{business-domain}/{v#}/{resource-type}/{id}`
- URLs must be human-readable, avoid application-specific names, and use hyphen-delimited business domains.
- Major version (`v#`) must be included and follow a whole-number format (e.g., `/v1/`).
- Resources should be nouns in plural form (except singletons) and use UUIDs as identifiers.

### Examples

```
GET  /catalog/v1/products/{productId}
GET  /catalog/v1/categories/{categoryId}
POST /compatibility/v1/checks
GET  /partner-catalog/v1/feed
```

## 3. HTTP Methods and Functional Resources

| Method | Usage |
|--------|-------|
| `GET` | Retrieve resources |
| `POST` | Create resources or execute commands (functional endpoints) |
| `PATCH` | Partially update a resource |
| `PUT` | Full resource replacement (limited usage) |
| `DELETE` | Remove a resource — returns `204 No Content` (no response body) |

- **Functional endpoints** (e.g., `/products/search`, `/checks/validate`) must be invoked with `POST`.
- Do not use `$` prefix for function names.

## 4. Query Parameters and Filtering

- Use `lowerCamelCase` for query parameters.
- Filters must support:
  - **AND** conditions for multiple parameters.
  - **OR** conditions using comma-separated values.
- Reserved functional parameters start with `_` (e.g., `_include`).
- Sorting uses `sort` parameter: `GET /v1/products?sort=price`

## 5. Pagination (Offset-based)

- Use `offset` to specify the starting position (zero-based index).
- Use `limit` to define the number of instances to fetch.
- Default values defined in the API specification.
- Example: `GET /catalog/v1/products?offset=20&limit=10&sort=price`

## 6. Response Handling and Status Codes

| Code | Usage |
|------|-------|
| `200 OK` | Successful retrieval |
| `201 Created` | New resource created — response must contain the full resource representation |
| `204 No Content` | Successful DELETE |
| `400 Bad Request` | Invalid request |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Business validation failure |
| `422 Unprocessable Entity` | Semantically invalid request |
| `500 Internal Server Error` | Unexpected issues |

- `POST`, `PUT`, and `PATCH` responses must include the full resource representation (not a success message).
- JSON responses must avoid envelope-wrapping (e.g., `{"status": "success", "data": {...}}` is not allowed).

## 7. Data Formatting and Serialization

- Dates follow RFC 3339 (e.g., `2026-02-15T14:30:00Z`).
- Use ISO 8601 for durations and intervals.
- 64-bit integers exceeding JavaScript limits must be returned as strings.
- Collections must be JSON arrays with each item containing a `resourceId`.

## 8. Error Handling

- Use **RFC 9457 Problem Details** format for all error responses.

```json
{
  "type": "https://api.droneparts.com/problems/not-found",
  "title": "Product Not Found",
  "status": 404,
  "detail": "Product with ID 'abc-123' does not exist.",
  "instance": "/catalog/v1/products/abc-123"
}
```

## 9. Security

- Do not pass sensitive data via query parameters — use `POST` for searches involving PII.
- Support OAuth 2.0 and API keys for authentication.
- Implement CORS with appropriate access controls.
