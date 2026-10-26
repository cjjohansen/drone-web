# Product event contracts

The event contracts that carry product facts between drone-web's bounded contexts. Each owning context
publishes one stream about its own part of a product. Consumers build what they need from those streams.

The decision behind this folder is "Product event contracts: source-aligned fact streams" in
[`.ralph/agent/decisions.md`](../../.ralph/agent/decisions.md). The options compared before this one was chosen are in
[`research/`](research/README.md).

## Internal and published events

Both kinds are domain events. They differ in who may read them.

- **Internal events** sit on **internal streams**: the events in a context's own event store, one stream per
  aggregate, as in the event models (`Product.Created`, `Product.SpecificationUpdated`). They are private to
  that context. They are not contracts, they may change freely, and no other context ever reads them.
- **Published events** sit on **published streams**: everything in this folder. Each published stream is a
  contract and a data product. In DDD terms the contracts here are the Published Language, and each owning
  context serves them as an Open Host Service. They go to Kafka here, and through the CloudEvents bindings
  they can go to other transports such as AMQP or HTTP webhooks.

A publisher in the owning context (an outbox or a projection) translates internal events into published
events. Data that comes in from outside drone-web (the ERP into Inventory, supplier files into Ingestion) is
**upstream**; it enters through an anticorruption layer and is not a published stream of ours.

Older drone-web docs (the v2 run, the storefront run) say "integration event" for what is now called a
published event.

Example: the internal stream of one Product aggregate records `Product.SpecificationUpdated` (internal). Product
Lifecycle's publisher reads the new state of that product and sends `ProductSpecificationChanged` on the
`product-specifications` published stream, with the full current spec, `specSchemaVersion` and `origin`. A consumer
only ever sees `ProductSpecificationChanged` (published). Product Lifecycle can split, rename or replay its
internal events without breaking anyone.

## Files

One AsyncAPI file per service. A file lists what the service publishes (`send`) and, where relevant, what
it consumes (`receive`).

| File | Service | Publishes | Consumes |
| --- | --- | --- | --- |
| [`product-lifecycle.yaml`](product-lifecycle.yaml) | Product Lifecycle Service | `product-records`, `product-specifications` | |
| [`bulk-ingestion.yaml`](bulk-ingestion.yaml) | Bulk Ingestion Service | `product-imports` | |
| [`category-faceting.yaml`](category-faceting.yaml) | Category and Faceting Service | `product-category-assignments` | |
| [`technical-documentation.yaml`](technical-documentation.yaml) | Technical Documentation Service | `product-documents` | |
| [`pricing.yaml`](pricing.yaml) | Pricing Service | `effective-prices` | |
| [`inventory.yaml`](inventory.yaml) | Inventory Service | `product-availabilities` | |
| [`partner-catalog.yaml`](partner-catalog.yaml) | Partner Catalog Service | `partner-catalog-entries` | `product-records`, `effective-prices`, `product-availabilities` |
| [`catalog-api.yaml`](catalog-api.yaml) | Catalog API | | `product-records`, `product-specifications`, `product-category-assignments`, `product-documents`, `effective-prices`, `product-availabilities` |
| [`compatibility-check.yaml`](compatibility-check.yaml) | Compatibility Check | | `product-specifications`, `product-records` |

Shared files, owned by the platform team under federated governance:

| File | What it is |
| --- | --- |
| [`shared/envelope.yaml`](shared/envelope.yaml) | The CloudEvents envelope: `CloudEventHeaders` and `DerivedCloudEventHeaders`, with drone-web's lineage extensions (`ce_sourceversion`, `ce_derivedfrom`, `ce_approvalcaseid`, `ce_correlationid`) and the OpenTelemetry trace headers. |
| [`shared/kafka-servers.yaml`](shared/kafka-servers.yaml) | The Kafka server definition every service file references. |
| [`shared/common-schemas.yaml`](shared/common-schemas.yaml) | Canonical payload models shared across domains. Today only `Origin`. |

Validate each file with `npx -y @asyncapi/cli@latest validate <file>`, run from this folder so the
relative `$ref`s resolve.

## Who owns which stream

Every producing channel declares its owner in `x-data-product`. Topics are compacted and keyed by `productId`.

| Channel | Message | Owner team | Context | Kind | Type |
| --- | --- | --- | --- | --- | --- |
| `product-records` | `ProductRecordChanged` | Product Data | Product Lifecycle | source-aligned | Supporting |
| `product-specifications` | `ProductSpecificationChanged` | Product Data | Product Lifecycle | source-aligned | **Core** |
| `product-imports` | `ProductImported` | Product Data | Bulk Ingestion | source-aligned | Supporting |
| `product-category-assignments` | `ProductCategoriesAssigned` | Product Data | Category and Faceting | source-aligned | Supporting |
| `product-documents` | `ProductDocumentsPublished` | Product Data | Technical Documentation | source-aligned | Supporting |
| `effective-prices` | `EffectivePriceChanged` | Commercial | Pricing and Promotions | source-aligned | Core |
| `product-availabilities` | `ProductAvailabilityChanged` | Commercial | Inventory and Availability | source-aligned | Core |
| `partner-catalog-entries` | `PartnerCatalogEntryChanged` | Commercial | Partner Catalog | consumer-aligned | (a join) |

## The rules

1. **Owners publish computed facts, not inputs.** Pricing publishes the effective price with the active
   promotion and volume tiers applied. Inventory publishes availability, not raw counts. Each message carries
   the owner's current state for that product, never IDs only.
2. **Approval happens before an owner publishes.** When a change needs Governance approval, the owner waits
   for the decision and only then publishes. The message carries `ce_approvalcaseid`. Consumers never see
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
   approval attributes come from the shared envelope. No service defines its own. Derived products (like the
   partner catalog entries) must set `ce_derivedfrom`.
7. **OpenTelemetry is for runtime only.** `traceparent` shows how a message moved, for debugging. It is never
   read as lineage, because traces are sampled and kept for days. Which product feeds which is recorded in
   EventCatalog at design time, and as OpenLineage run events from the join helper at runtime.
8. **The spec channel is the Core contract.** `product-specifications` is what the compatibility rules read
   (voltage, current, mounting, protocol, weight). Its schema design and versioning get the most care: typed
   fields with units, an explicit `specSchemaVersion`, and a new major version on a parallel channel for a
   breaking change. The rest of Product Lifecycle's channels may follow a bought product hub, translated by an ACL.

## Conventions

1. **Service-centric files.** One AsyncAPI file per service, with what it sends and, where relevant, what it
   receives. Each producing channel names its known consumers in its description.
2. **Consumers define their own channels.** A consumer defines the channel inline (it does not `$ref` the
   producer's channel) and points to a local message under `components/messages`, marked
   `x-eventcatalog-role: client`. The local message `$ref`s the producer's headers and payload.
3. **Channel addresses** are the real topic names: kebab-case, plural nouns, no "events" suffix
   (`effective-prices`). Channel keys and operation ids are lowerCamelCase (`effectivePrices`,
   `sendEffectivePriceChanged`, `receiveEffectivePriceChanged`).
4. **Message names** are PascalCase domain names in the past tense, without an "Event" suffix
   (`EffectivePriceChanged`).
5. **Message types** are reverse-DNS with a major version: `<prefix>.<domain>.<subdomain>.v<major>.<MessageName>`,
   for example `tech.drone-web.catalog.pricing.v1.EffectivePriceChanged` in `ce_type`. `ce_dataschema` follows
   the same versioning (`https://schemas.drone-web.tech/catalog/pricing/v1/EffectivePriceChanged.json`).
6. **Tags.** Each file defines `domain:Catalog`, `subdomain:<Subdomain>`, `service:<ServiceName>` and
   `channel:<ChannelName>` in `info.tags`, each with a description, and applies them to its channels.
7. **Titles** name the business domain and end in "Events" ("Pricing Events"). The protocol is explicit
   (Kafka, in `shared/kafka-servers.yaml` and the channel bindings); messages are `application/json`, UTF-8.
   Messages, channels and the CloudEvents attributes stay transport-neutral; Kafka details live only in
   bindings and the server file.
8. **Shared files** live in `shared/`, and every service file `$ref`s them. Each message states whether its
   model is canonical (shared across domains) or domain-specific (`x-model`).

## What this replaces

The v2 write-side contract,
[`catalog-management-v2/addr/refine/integration-events.yaml`](../catalog-management-v2/addr/refine/integration-events.yaml),
publishes identifier-only events (`product.created`, `product.lifecycle-state-changed`,
`price.group-repricing-requested`, `inventory.quantity-updated`, ...). A consumer cannot build its copy from
those without calling back, and there is no event for a single price change or a spec update.

For consumers, the channels in this folder supersede those events. The Catalog API, the Compatibility Check
and Partner Catalog read the channels here. The v2 file stays as the record of the write-side design run.
The gap is described in
[`strategy/architecture-for-flow/subdomains-and-contexts.md`](../strategy/architecture-for-flow/subdomains-and-contexts.md).
