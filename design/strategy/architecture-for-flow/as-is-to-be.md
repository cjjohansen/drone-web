# As-is to to-be

Step 4 of the [Architecture for Flow example](README.md). Susanne Kaiser's Architecture for Flow Canvas
(<https://susannekaiser.net/articles>) assesses the current system and designs the target across the same
three lenses used here: the landscape, the bounded contexts and the teams. This is a short version in that
spirit, not her layout.

## As-is

| Lens | Where Drone Web is today |
| --- | --- |
| Landscape | The [map](wardley-map.svg) exists only as design. Nothing is built or bought yet. The open buy decisions are on record as hotspots: search technology (Event Storming hotspot 2), partner authentication (hotspot 7), whether partners get webhooks (OQ-005). |
| Constraint | Product data. Every interviewed role names unclear ownership, poor data quality and no single source of truth (`Specs/Case/JTBD/personas/cross-persona-summary.md`). Every user need on the map depends on it. |
| Contexts | Eleven API boundaries designed in two separate ADDR runs (3 read-side, 8 write-side). The two event contracts don't fit: the storefront expects full `catalog.product.*` snapshots, v2 publishes identifier-only events, and two events the read side needs (a single price change, a specification update) have no publisher. |
| Teams | One: every OpenAPI file names the "Drone Web API Team". Boundaries are drawn, but nothing in the organisation holds them. |
| Decision log | OQ-004 ("should compatibility rules be managed via admin API or config files?") is still open, though the v2 run answered it with the Compatibility Rules API. |

## To-be

| Lens | Target |
| --- | --- |
| Landscape | Build and invest in compatibility (genesis). Buy the search index, the approval workflow and the event broker. Move the product data hub towards a bought product and keep the specification model custom. Make bulk ingestion a shared platform service. |
| Constraint | Product data has one owning team, a published language every read side can build from, and an owner for each field. |
| Contexts | Eight bounded contexts with one owner each (see [subdomains-and-contexts.md](subdomains-and-contexts.md)); Compatibility treated as one context with a read API and a write API; one published language for catalog facts. |
| Teams | Four stream-aligned teams (Build Verification, Product Data, Discovery, Commercial), one platform team (Catalog Platform), and an optional time-boxed enabling team for data quality (see [team-design.md](team-design.md)). |

## First moves

1. **Reconcile the event contracts.** Decide whether the write side publishes facts (full snapshots) or
   thin notifications plus a component that assembles the `catalog.*` snapshot, and name its owner. Add the
   missing specification-updated and price-changed events. Nothing on the read side can be built until this
   is settled.
2. **Settle the Core typing.** Confirm whether Pricing and Inventory differentiate Drone Web for fleet buyers
   (then build them) or are supporting (then keep them thin or buy). This decides how much the Commercial team
   builds.
3. **Stand up Build Verification and Product Data first.** One is the core, the other is the constraint. Start
   them in a time-boxed collaboration on the specification attributes the compatibility rules need.
4. **Make the buy decisions.** Search index, approval workflow product, managed event broker. Each removes work
   that does not differentiate the shop.
5. **Put owners in the contracts.** Replace "Drone Web API Team" in each OpenAPI and AsyncAPI file with the
   owning team, so ownership is visible where consumers look.
6. **Close OQ-004** in the decision log, pointing at the Compatibility Rules API.
7. **Map again.** After the first moves, redraw the map with the teams as users of the Catalog Platform, as
   Kaiser does for platform teams, and check that the platform's components really are product or commodity.
