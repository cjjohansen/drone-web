# Team design

Step 3 of the [Architecture for Flow example](README.md). The bounded contexts from
[subdomains-and-contexts.md](subdomains-and-contexts.md) become units of ownership, and Team Topologies
(Skelton and Pais) gives the team types and interaction modes. Following Susanne Kaiser: one owning team per
bounded context, a team may own more than one, and the limit is the team's cognitive load.

## Streams of change

The streams come from the user needs on the [map](wardley-map.svg), plus one internal stream the interviews
make impossible to ignore.

| Stream | Users | Job stories |
| --- | --- | --- |
| Find a part | Professional Integrator, Fleet Procurement Buyer, Casual Browser | storefront JS1, JS2, JS3, JS5 |
| Verify a build | Professional Integrator, Fleet Procurement Buyer; Compatibility Engineer behind it | storefront JS4, management JS6 |
| Catalog feed | Partner System | storefront JS6 |
| Get a product ready to sell | Product Lifecycle Manager, Documentation Steward, Taxonomy Manager | management JS1, JS2, JS5 |
| Set commercial terms | Pricing Analyst, Inventory Controller | management JS3, JS4 |

## Teams

| Team | Type | Owns (bounded contexts and APIs) | Why this shape |
| --- | --- | --- | --- |
| **Build Verification** | Stream-aligned | Compatibility: Compatibility API and Compatibility Rules API | The core subdomain. One team owns the rule model and the check that evaluates it, so a new rule type ships without a handover |
| **Product Data** | Stream-aligned | Product Data: Product Lifecycle, Technical Documentation, Category and Faceting APIs; publishes the catalog product facts | Owns the constraint on the map. The internal users are the ones who report unclear ownership |
| **Discovery** | Stream-aligned | Catalog: Catalog API, the search index integration | Interactive buyer experience, conformist to the published facts, buys its search engine |
| **Commercial** | Stream-aligned | Pricing, Inventory, Partner Catalog: Pricing and Promotions API, Inventory and Availability API, Partner Catalog API | Partner feeds are mostly batch pricing and batch availability, and change on the same price and availability events |
| **Catalog Platform** | Platform | Ingestion (Bulk Ingestion API), Governance (Catalog Governance API, on a bought workflow product), the event broker, the AsyncAPI contract catalogue (D-008) | Every stream-aligned team publishes or consumes events, imports in batches, and routes high-risk changes through approval. Built once, offered as a service |
| **Data Quality** (optional) | Enabling | nothing; time-boxed | Helps the stream-aligned teams take on data ownership: field-level owners, automated quality checks, lineage. Leaves when the teams can do it themselves |

**Complicated-subsystem?** Kaiser's guidance is to add one only when a part needs knowledge a stream-aligned
team can't reasonably hold. The rule evaluation (voltage, current rating, physical fit, protocol, weight and
thrust) might qualify if it needs electrical and mechanical engineers. The default here is to keep it inside
Build Verification, because it is also the core user-facing stream and splitting it adds a handover on the
most important path. Split out a complicated-subsystem team only if the engineering knowledge becomes the
bottleneck.

## Cognitive load

| Team | Load | What keeps it manageable |
| --- | --- | --- |
| Build Verification | High (domain), low (scope) | Two APIs on one model; specs arrive through an anticorruption layer, so the team never learns the product data model in full |
| Product Data | High | Three APIs, three aggregates, three user personas, and the published language that everyone consumes. Bulk ingestion and approval are taken off its plate by the platform. Watch this team first |
| Discovery | Medium | Read-only; search is bought; no write-side invariants |
| Commercial | Medium | Two write APIs with effective-date and stock invariants, one read projection. The ERP sits behind an anticorruption layer |
| Catalog Platform | Medium | Mostly bought components (broker, workflow product); the custom part is ingestion replay and the contract catalogue |

## Interaction modes

| From | To | Mode | For what |
| --- | --- | --- | --- |
| Product Data | Build Verification | **Collaboration**, time-boxed | Agree which specification attributes the rules need, and add the missing specification-updated event. Then switch to consuming events |
| Product Data, Commercial | Discovery, Build Verification, Commercial (Partner Catalog) | X-as-a-service (published events) | The catalog facts, prices and availability, through the AsyncAPI contracts |
| All stream-aligned teams | Catalog Platform | **X-as-a-service** | Event publishing, bulk import, approval workflow |
| Data Quality | Product Data, then Commercial | **Facilitating** | Field ownership, quality checks, lineage |

Collaboration is expensive, so it is time-boxed and has an exit: once the specification contract is stable,
the two teams stop meeting about it and talk through the events.

## Conway check

Conway's law: a system ends up mirroring the communication structure of the organisation that builds it. So
the question is whether the API boundaries the design draws match the team boundaries that will maintain them.

**Today they don't, because there is only one team.** All eleven OpenAPI files and the v2 AsyncAPI file name
the same owner: `contact: Drone Web API Team`. The boundaries are drawn on paper, but nothing in the
organisation holds them in place.

**The evidence is already in the repo.** One team wrote the storefront run expecting `catalog.product.*` fact
events from a Catalog API, then wrote the v2 run publishing thin, identifier-only events from eight other
boundaries. The mismatch went unnoticed (see the gap in [subdomains-and-contexts.md](subdomains-and-contexts.md)).
With separate teams, the Discovery team would have rejected the v2 contract at its first integration test.

**With the teams above, the check passes.** Every API has exactly one owning team, every cross-team
dependency is an event in an AsyncAPI file, and the only synchronous lookup across contexts on the write side
(`ListDocumentsByProduct`, documentation to product lifecycle) stays inside the Product Data team.

| API | Owning team | Talks to other teams through |
| --- | --- | --- |
| Catalog API | Discovery | consumes catalog product facts |
| Compatibility API, Compatibility Rules API | Build Verification | consumes specification events; submits rule changes to Governance |
| Partner Catalog API | Commercial | consumes product, price, availability events |
| Product Lifecycle, Technical Documentation, Category and Faceting APIs | Product Data | publishes catalog product facts; receives import commands |
| Pricing and Promotions, Inventory and Availability APIs | Commercial | publishes price and availability events; submits repricing to Governance |
| Bulk Ingestion API, Catalog Governance API | Catalog Platform | dispatches `ApplyImportedProductRecord`; publishes `governance.decision-recorded` |

**What breaks if one team owns everything.** The JTBD interviews describe that world
([`cross-persona-summary.md`](../../../Specs/Case/JTBD/personas/cross-persona-summary.md)):

- "Unclear ownership and accountability" is a pain point for every interviewed role, and "clear ownership and
  responsibility mapping" is a critical capability for all of them. One team owning everything means the
  answer to "who fixes this field?" is always "the team", which is no answer.
- One product specialist put it as "everyone is accountable, so no one is accountable"; a wholesale
  representative has to chase more than 300 potential product owners to complete a data package
  (`all-personas.md`). A single platform team becomes the one inbox for every data question.
- "Late discovery of issues" and "no transparency into data flow" follow when contracts are internal to one
  team: nobody outside it can see a broken event until a storefront page shows wrong data.
- Change slows for everyone: a pricing change, a new compatibility rule type and a new partner feed field
  queue behind each other in one backlog, even though the design made them independent (D-027, D-029).

The team design is the organisational half of the bounded contexts. Without it, the eleven boundaries are
eleven folders.
