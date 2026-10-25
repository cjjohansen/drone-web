# Product event contracts

The event contracts that carry product facts between drone-web's bounded contexts. Each owning context
publishes one stream about its own part of a product. Consumers build what they need from those streams.

The decision behind this folder is "Product event contracts: source-aligned fact streams" in
[`.ralph/agent/decisions.md`](../../.ralph/agent/decisions.md).

## Files

| File | What it is | Owner |
| --- | --- | --- |
| [`envelope.yaml`](envelope.yaml) | The shared event envelope: CloudEvents 1.0 in Kafka binary mode, with drone-web's lineage extensions (`ce_sourceversion`, `ce_derivedfrom`, `ce_approvalcaseid`, `ce_correlationid`) and the OpenTelemetry trace headers. | Platform team, under federated governance |
| [`product-facts.asyncapi.yaml`](product-facts.asyncapi.yaml) | One channel per data product. Defines only each product's payload; the headers come from `envelope.yaml` by `$ref`. | Each channel's owner (table below) |

Validate both with `npx -y @asyncapi/cli@latest validate <file>`. Run it from this folder, so the
relative `$ref` to `envelope.yaml` resolves.

## Who owns which stream

Every channel declares its owner in `x-data-product`. Topics are compacted and keyed by `productId`.

| Stream | Owner team | Context | Kind | Type |
| --- | --- | --- | --- | --- |
| `product.record` | Product Data | Product Lifecycle | source-aligned | Supporting |
| `product.specification` | Product Data | Product Lifecycle | source-aligned | **Core** |
| `product.imported` | Product Data | Bulk Ingestion | source-aligned | Supporting |
| `category.product-assignment` | Product Data | Category and Faceting | source-aligned | Supporting |
| `document.product-documents` | Product Data | Technical Documentation | source-aligned | Supporting |
| `price.effective-price` | Commercial | Pricing and Promotions | source-aligned | Core |
| `inventory.availability` | Commercial | Inventory and Availability | source-aligned | Core |
| `partner.catalog-feed` | Commercial | Partner Catalog | consumer-aligned | (a join) |

## The rules

1. **Owners publish computed facts, not inputs.** Pricing publishes the effective price with the active
   promotion and volume tiers applied. Inventory publishes availability, not raw counts. Each event carries
   the owner's current state for that product, never IDs only.
2. **Approval happens before an owner publishes.** When a change needs Governance approval, the owner waits
   for the decision and only then publishes. The event carries `ce_approvalcaseid`. Consumers never see
   unapproved facts and never apply approval rules themselves.
3. **Consumers own their joins.** A consumer that needs price, stock and product data together builds that
   join itself. Rules that cross domains (for example, when a product counts as sellable) stay with the
   consumer. The merge mechanics (key, highest `ce_sourceversion` wins, out-of-order arrival, discontinued
   products) come from one shared platform helper.
4. **Two consumers, one rule: promote it.** When two consumers need the same cross-domain rule, the join
   becomes a shared Product View with a named owner. Until then there is no shared view.
5. **Origin goes in the payload.** Product Data is a curated copy of the ERP and the supplier files, not the
   true source. Where a value came from (`origin`: source system, import batch, item key) is domain
   information that curators and buyers see, so it is a field of the payload.
6. **Technical provenance goes in the envelope.** `ce_source`, `ce_sourceversion`, `ce_derivedfrom` and the
   approval attributes are headers from the shared envelope. No product defines its own. Derived products
   (like the partner feed) must set `ce_derivedfrom`.
7. **OpenTelemetry is for runtime only.** `traceparent` shows how a message moved, for debugging. It is never
   read as lineage, because traces are sampled and kept for days. Which product feeds which is recorded in
   EventCatalog at design time, and as OpenLineage run events from the join helper at runtime.
8. **The spec stream is the Core contract.** `product.specification` is what the compatibility rules read
   (voltage, current, mounting, protocol, weight). Its schema design and versioning get the most care: typed
   fields with units, an explicit `specSchemaVersion`, and a new major version on a parallel topic for a
   breaking change. The rest of `product.*` may follow a bought product hub, translated by an ACL.

## What this replaces

The v2 write-side contract,
[`catalog-management-v2/addr/refine/integration-events.yaml`](../catalog-management-v2/addr/refine/integration-events.yaml),
publishes identifier-only events (`product.created`, `product.lifecycle-state-changed`,
`price.group-repricing-requested`, `inventory.quantity-updated`, ...). A consumer cannot build its copy from
those without calling back, and there is no event for a single price change or a spec update.

For consumers, the streams in this folder supersede those events. Catalog, Compatibility and Partner Catalog
read the fact streams here. The v2 file stays as the record of the write-side design run; its events can
remain internal to the owning contexts. The gap is described in
[`strategy/architecture-for-flow/subdomains-and-contexts.md`](../strategy/architecture-for-flow/subdomains-and-contexts.md).
