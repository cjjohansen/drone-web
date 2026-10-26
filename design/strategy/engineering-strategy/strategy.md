# Drone Web engineering strategy: build what makes the answers trustworthy, buy the rest

> Status: illustrative example, drafted with an AI agent and reviewed by Christian Johansen (GALAXITECH). Drone Web is fictional; see [README.md](README.md).
> Method: Will Larson, *Crafting Engineering Strategy* (2025): explore, diagnose, refine, policy, operations ([lethain.com/components-of-eng-strategy](https://lethain.com/components-of-eng-strategy/)). Written in that order, presented policy first as Larson suggests for readers ([lethain.com/readable-engineering-strategy-documents](https://lethain.com/readable-engineering-strategy-documents/)).

Drone Web sells drones and mechatronic parts (motors, ESCs, flight controllers, sensors, frames, batteries, FPV gear) to professional integrators, fleet buyers, casual browsers and partner systems. Today it has a design and no running system. This strategy decides what to build, what to buy or rent, and which rules hold the built parts together.

Names in this document are the repository's own: boundaries from the [boundary map](../../catalog-management-v2/addr/align/boundary-map.md) and the [storefront boundaries](../../catalog-storefront/addr/define/boundaries.md), events from the two AsyncAPI contracts. The storefront run and the management run both number their job stories JS1 to JS6 for different stories, so every job story here carries its run: "storefront JS4" is Compatibility Verification, "management JS6" is Compatibility Rules Management.

## The strategy kernel

Richard Rumelt (*Good Strategy Bad Strategy*, 2011) says a strategy has a kernel of three parts. Larson's steps fill the same three parts, with two steps of his own around the diagnosis. Larson cites Rumelt's later book *The Crux* in his [diagnosis chapter](https://lethain.com/diagnosis-for-strategy/); the mapping below is ours.

| Rumelt's kernel | Larson's steps | Drone Web, in one line |
|-----------------|----------------|------------------------|
| Diagnosis | Explore, Diagnose, Refine | A small specialist shop whose edge is trustworthy product data and compatibility answers, with eight write-side boundaries designed, no system built, and data pains caused by unclear ownership. |
| Guiding policy | Policy | Build only what makes compatibility answers and product data trustworthy; buy or rent everything else; connect it all through published contracts and events, never through shared data. |
| Coherent actions | Operations | One end-to-end slice first, contract linting in CI, a weekly contract review that grants dated exceptions, and five numbers that show whether the policies work. |

Rumelt puts action inside the kernel. Larson keeps policy and operations apart and adds exploration before the diagnosis and refinement after it; the extra steps are where most of the evidence below comes from.

---

## 1. Policy

Larson sorts policies into approvals, allocations, direction and guidance ([Policy for strategy](https://lethain.com/policy-for-strategy/)). Each policy below says which kind it is.

### P1. Build, buy or rent by subdomain type (direction)

Build what is Core and differentiating. Buy a product for what is Generic. Rent (run as a managed service) what is commodity. Supporting subdomains are built thin on top of bought or rented parts. The table is the policy; changing a row needs an exception (see Operations).

**Write side** (the eight boundaries of the [boundary map](../../catalog-management-v2/addr/align/boundary-map.md)):

| Boundary | Type | Decision | What we build | What we buy or rent |
|----------|------|----------|---------------|---------------------|
| Compatibility Rules Management | Core | **Build** | The rules engine: CompatibilityRule, component groups, and the check behind storefront JS4 | Nothing beyond hosting |
| Product Lifecycle Management | Supporting, with a Core spec model | **Build** the spec model; **buy or build thin** the rest | The spec model the compatibility rules read and its channel, `product-specifications`; product identity, attributes and lifecycle states (create, activate, discontinue) if not bought | Optionally a product information system for records and lifecycle states, behind an ACL |
| Pricing and Promotions Management | Core | **Build thin** | The PriceBookEntry API, effective-date and overlap rules, the events | Price figures and cost data stay in the system of record the business already uses (see the diagnosis); we do not build a pricing engine |
| Inventory and Availability Management | Core | **Build thin** | The InventoryPosition API and availability states (in stock, backorder, suspended) | Stock counts come from the warehouse and ERP side; we do not build a warehouse system |
| Technical Documentation Management | Supporting | **Build thin** | Document metadata, version chains, product associations | **Rent** file storage (object storage) for datasheets, CAD files and certificates |
| Category and Faceting Management | Supporting | **Build thin** | The category tree and facet definitions | Facet filtering at query time is done by the bought search product |
| Bulk Ingestion | Supporting | **Build thin** | ImportBatch validation, replay and failure handling | **Rent** a managed queue and storage for batches |
| Catalog Governance Workflow | Generic | **Buy** | Only the list of which changes need approval, held in each boundary's API | A workflow or approval product that records ApprovalCase decisions |

**Read side** (the three contexts of the [storefront boundaries](../../catalog-storefront/addr/define/boundaries.md)):

| Context | Decision | What we build | What we buy or rent |
|---------|----------|---------------|---------------------|
| Compatibility API | **Build** | The check, the incompatibility explanations and replacement suggestions | Nothing beyond hosting |
| Catalog API | **Build thin** | The API in the shared style guide, product detail and comparison views | **Buy** a hosted search product for full-text search, facets and autocomplete |
| Partner Catalog API | **Build thin** | The partner projection and bulk endpoints | **Rent** file storage and a CDN for generated feeds |

**Everything around the boundaries:**

| Capability | Decision | Note |
|------------|----------|------|
| Payment and checkout | **Buy / rent** | Not designed in this repository yet. When it is, use a payment provider and do not store card data |
| Hosting and runtime | **Rent** | A managed cloud platform; no servers of our own |
| Event broker | **Rent** | A managed broker that carries the AsyncAPI channels |
| Identity and access | **Rent** | Staff sign-in for the seven management personas, API keys for partner systems |
| Product analytics | **Buy** | Query observations such as "Catalog Searched" go here, not on the event bus (decision D-014) |
| API and event tooling | **Use what is already adopted** | Redocly CLI for OpenAPI (D-021), AsyncAPI CLI for events, EventCatalog for the event catalogue (D-008) |

![Wardley map of the Drone Web build/buy decision: an integrator needs to verify a build, find parts and buy parts. Compatibility rules and product data sit in genesis and custom built and are built; search and the approval workflow are products and are bought; payment, the event broker and cloud hosting are commodities and are rented.](drone-web-build-buy.svg)

### P2. One source of truth for product data (direction)

- Product Lifecycle Management is the only writer of product identity, attributes, specifications and lifecycle state. Every other boundary holds a copy fed by events and never edits it.
- Each fact has exactly one producing boundary and one owner persona, as in the boundary map's ownership table: prices belong to the Pricing Analyst through Pricing and Promotions Management, stock to the Inventory Controller, documents to the Documentation Steward, and so on. Each producer publishes its facts as one stream of integration events ([`design/contracts/`](../../contracts/)); its domain events stay internal.
- The read side owns no product facts. The storefront Catalog API is a read model built from write-side events. Its boundaries document currently says it "owns product data" and publishes `catalog.product.*` events; under this policy those events are produced from the write side (see the diagnosis, point 6).
- Data is checked where it is written, not where it is read: Bulk Ingestion validates every record before it reaches Product Lifecycle Management, and high-risk changes pass the governance gate before the owning boundary publishes them. Issues are found before publication, not by a customer or partner.

### P3. Integrate through events and contracts, never through shared data (direction)

- Boundaries talk to each other only through the integration events in the AsyncAPI contracts ([product facts](../../contracts/), one file per service, which supersede the identifier-only [write side](../../catalog-management-v2/addr/refine/integration-events.yaml) events for consumers; [read side](../../catalog-storefront/addr/refine/integration-events.yaml)) and through their published OpenAPI operations.
- No synchronous calls between boundaries while handling a request. A boundary that needs another's data keeps a local copy built from events (the storefront design already does this for the Compatibility API).
- No shared databases, and no reading another boundary's tables.
- Cross-boundary events are fact events that carry the full state, so consumers can build their copy without calling back (LRN-006).
- One naming convention for events across both runs. Open question OQ-007 is closed before the first event is produced.

### P4. API first, with ADDR (direction)

- Every new capability starts as a job story, goes through ADDR (Align, Define, Design, Refine; [design/addr-ai-prompts.md](../../addr-ai-prompts.md)), and ends as an OpenAPI or AsyncAPI contract before any code is written.
- Contracts follow the shared [style guide](../../style-guide.md): `Idempotency-Key` on retry-prone command POSTs, `If-Match` for optimistic concurrency, `202 Accepted` with a trackable job for long-running commands (D-030).
- A contract is merged only with zero errors and zero warnings from Redocly CLI or AsyncAPI CLI.
- The contract change is reviewed first; code that implements an unreviewed contract is not merged.

### P5. Partners get a product, not our model (direction)

- Partner systems use only the Partner Catalog API (D-015). They never call the storefront Catalog API or receive internal events.
- Partners get a simplified projection of product data, translated at the edge, so internal changes do not break them.
- Changes to the partner contract are versioned, and a breaking change is announced before it ships.

### P6. What AI agents may and may not change (approvals)

Drone Web's design was produced with AI agents in the Ralph Loop, and building it will be too. The rules:

| AI agents **may** | AI agents **may not** |
|--------------------|------------------------|
| Draft ADDR artifacts, OpenAPI and AsyncAPI contracts, event models and code inside one boundary | Change the boundary map or a boundary's Core/Supporting/Generic type |
| Write and run tests, linters and validators | Change a published integration event or the partner contract without a human-approved contract review |
| Propose decisions and learnings in `.ralph/agent/` | Change the approval rules in Catalog Governance Workflow |
| Open pull requests on their own branch | Merge their own pull requests |
| Run against test data | Touch production data, credentials or deployment settings (LRN-001, LRN-002) |

Every agent pull request is reviewed by the owner of the boundary it changes. Decisions live only in `.ralph/agent/decisions.md` (LRN-020), so a human can see what an agent decided and why.

### P7. Where engineering time goes (allocation)

Spend most engineering time on the Core parts we build in full: Compatibility Rules Management and the spec model in Product Lifecycle Management. As a starting point, at most one day in five goes to the thin boundaries, bought products and rented services together. This number is not from the repository; it is a first guess to be checked with the inspection numbers below.

---

## 2. Operations

Larson's [Operations for strategy](https://lethain.com/operations-for-strategy/) lists mechanisms such as review forums, inspection, nudges, documentation, automation and deferment. Drone Web uses these:

### Contract review (approval forum)

- Thirty minutes a week. Attended by the owners of the boundaries whose contracts change that week, and one person for the whole architecture.
- Reviews every change to an OpenAPI or AsyncAPI contract, the boundary map, the build/buy tables in P1, and the partner contract.
- **Exceptions** to any policy are asked for here. An approved exception is recorded as a decision in `.ralph/agent/decisions.md` with the policy it breaks, the reason, and a date when it ends or is reviewed again. No exception is open-ended.
- The goal is to make this meeting unnecessary: as CI checks take over a kind of review, that kind leaves the agenda.

### Automation in CI

- Lint every OpenAPI file with Redocly CLI and every AsyncAPI file with AsyncAPI CLI; fail on warnings (P4).
- Check event contracts for breaking changes against the last published version (P3, P5).
- Check that no service calls another boundary's API while handling a request, and that no service connects to another boundary's database (P3).
- Label agent pull requests and block merging without an owner's review (P6).

### Inspection: five numbers

Looked at monthly in the contract review. Targets are starting points, not taken from the repository.

| Number | Policy it checks | Target |
|--------|------------------|--------|
| Product data issues found before publication, as a share of all issues found | P2 | Rising; most issues caught at ingestion or the governance gate |
| Product facts with more than one writing boundary | P2 | 0 |
| Synchronous cross-boundary calls | P3 | 0 |
| Agent pull requests that needed rework after review | P6 | Falling; a rise means the agent's instructions or skills need fixing |
| Open exceptions past their review date | all | 0 |

### Nudges and documentation

- The pull request template asks: which boundary does this change, which events does it produce or consume, which job story does it serve (with its run, e.g. "management JS3").
- This document, the style guide and the ADDR prompts are the written guidance. Larson doubts documentation alone changes behaviour, so it backs up the review and the CI checks rather than replacing them.

### Deferred decisions

| Decision | Deferred until |
|----------|----------------|
| Payment and checkout design | The first slice runs end to end |
| Webhooks for partners (OQ-005) | A partner asks for push instead of feeds |
| Compatibility rules edited through the admin API or as configuration files (OQ-004) | The Compatibility Engineer has written the first fifty rules |
| Whether Pricing and Inventory stay Core | The first slice runs; see Refine |

### The first slice

The first piece built is the narrowest slice that touches both Core parts (the compatibility rules and the spec model) and the two pivotal events that matter most to customers: a Product Lifecycle Manager creates and activates a product (`product.created`, `product.lifecycle-state-changed`), the Compatibility API updates its local copy from those events, and a Professional Integrator runs a compatibility check (storefront JS4) that uses it. It exercises P1, P2 and P3 for real before anything else is built.

### Reviewing the strategy

Review this strategy when the first slice runs, and after that every quarter or when an inspection number moves the wrong way.

---

## 3. Refine

Larson names three ways to test a strategy before committing to it: strategy testing, systems modeling and Wardley mapping ([Refining strategy](https://lethain.com/refining-eng-strategy/)). Drone Web used two of them.

### Wardley mapping

Larson recommends Wardley maps when the surroundings are changing and the strategy depends on how they change ([Wardley mapping](https://lethain.com/wardley-mapping/)). For Drone Web the question was where each component sits on the evolution axis, because that decides build or buy. The landscape map is in the Architecture for Flow example ([`design/strategy/architecture-for-flow/`](../architecture-for-flow/)); the [small map in this folder](drone-web-build-buy.svg) zooms in on the build/buy decision. What the mapping showed:

- **Compatibility rules sit furthest left.** Knowledge of which motor works with which ESC, at which voltage and current, with which frame and protocol, is specific to the shop's range and not sold as a product. This is where Drone Web differs from any other parts shop, so it is built.
- **Product data is custom, not because storage is new, but because the lifecycle is.** A discontinued product has to reach compatibility checks, search and partner feeds without anyone retyping it (pivotal event 2 in the event storming). That cascade is the shop's own; a bought product information system would still need it built around it.
- **Search, approval workflows, payment, brokers and hosting are products or commodities.** Building them would spend Core time on things the market already does well.
- **The boundary map types Pricing and Promotions and Inventory and Availability as Core, but the map puts them nearer product.** Effective-date pricing and stock positions are what every shop does. What is specific is how they feed compatibility and availability answers. So P1 builds their APIs thin and leaves the figures in the systems of record. This is a disagreement between the map and the boundary map's typing, and it is left as a decision for the owner (see Deferred decisions).

### Strategy testing

Larson's strategy testing starts with the narrowest useful part of a strategy and adjusts it from what happens. For Drone Web that is the first slice in Operations: it tests P1 (build only Core), P2 (one writer) and P3 (events, no calls) on one real flow before the other boundaries are built. If the Compatibility API cannot work from its local copy, P3 is wrong and must change before more is built on it.

Systems modeling was not used: the diagnosis is not about a feedback loop with unclear levers, so a model would add little now.

---

## 4. Diagnose

What the strategy has to deal with, from the repository alone.

1. **There is a design and no system.** The [README](../../../README.md) says there is no runnable application code. Nothing has to be migrated and every build/buy choice is still cheap to make. The designs have not yet met reality: no contract has run against real data.

2. **The write side has eight boundaries, half of them typed Core.** The [boundary map](../../catalog-management-v2/addr/align/boundary-map.md) types four as Core (Product Lifecycle, Pricing and Promotions, Inventory and Availability, Compatibility Rules), three as Supporting (Technical Documentation, Category and Faceting, Bulk Ingestion) and one as Generic (Catalog Governance Workflow), each with one owner persona. Refine contracts exist for all eight (decision D-031). A small shop cannot build half its system as its differentiator; something has to give. Product Lifecycle has since been retyped as Supporting with a Core spec model (see the product event contracts decision in `.ralph/agent/decisions.md`).

3. **The read side has three contexts with different users.** The Catalog API serves the Professional Integrator, Fleet Procurement Buyer and Casual Browser (storefront JS1, JS2, JS3, JS5); the Compatibility API serves storefront JS4; the Partner Catalog API serves the Partner System persona (storefront JS6). They share no synchronous calls and keep local copies built from events.

4. **Compatibility is the moment of truth.** "Compatibility Check Completed" is one of the four pivotal events in the event storming: the build passes or fails. Storefront JS4 exists so integrators "avoid ordering parts that won't work together". Management JS6 keeps the rules "correct and explainable". This is the one capability a general shop does not offer.

5. **Partners are a second channel with their own needs.** The Partner Catalog API was split off because partners consume in bulk, need different SLAs and rate limits, and get a simplified projection (D-007, D-015). "Catalog Feed Generated" is a pivotal event: data leaves Drone Web here. Whether partners also get webhooks is open (OQ-005).

6. **The two runs do not yet agree on events or on who owns product data.** The write-side AsyncAPI contract publishes `product.created`, `product.lifecycle-state-changed`, `price.group-repricing-requested` and `inventory.quantity-updated`. The read-side contract expects `catalog.product.created`, `catalog.product.price-changed` and `catalog.product.availability-changed`, published by the storefront Catalog API, whose boundaries document says it "owns product data". So two places claim to be the source of product facts, and nothing yet turns "repricing requested" into "price changed". Open question OQ-007 (event naming) records part of this. Left alone, it rebuilds the problem in point 7.

7. **The people who maintain product data today lack one source of truth.** The anonymised interviews ([cross-persona summary](../../../Specs/Case/JTBD/personas/cross-persona-summary.md)) report, across all personas: no single source of truth, unclear ownership and accountability, data quality issues, late discovery of issues, manual work, and mismatches between the systems they work in (an ERP and a product data hub). The capabilities they rank critical are data lineage, automated quality checks, a single source of truth and clear ownership. The boundary design answers ownership on paper; the strategy has to keep it true in the running system.

8. **Delivery is AI-assisted, and the agent makes mistakes the tools catch.** The design was produced by AI agents driven by the Ralph Loop, with state, decisions and learnings in `.ralph/`. The learnings log shows what goes wrong: an agent started ADDR without the prompt guide (LRN-003); a validator passed specs that Redocly then flagged with 19 warnings (LRN-013, LRN-017); decisions drifted when they were kept in two files (LRN-020). Each was caught by a validator, a validation step or a human review. AI makes delivery fast; review and linting keep it correct.

---

## 5. Explore

What we looked at before diagnosing, kept generic. Larson's advice is to survey before judging and not to copy what worked elsewhere without checking that it fits ([Exploring for strategy](https://lethain.com/exploring-for-strategy/)).

**Options for the shop as a whole**

| Option | What it gives | Why it does not fit on its own |
|--------|---------------|--------------------------------|
| An all-in-one hosted shop platform with plug-ins | Fast start: catalogue, checkout, payment, hosting in one | Its product model is generic; compatibility rules and lifecycle cascades end up in plug-ins or spreadsheets, which is how data ends up with no owner |
| Headless commerce: buy cart, checkout and payment, build the rest behind APIs | Keeps the differentiating parts in our hands, buys the standard parts | Fits, if "the rest" is kept small. This is the shape P1 takes |
| A product information management (PIM) product for product data | Mature data editing, workflows, imports | Strong option for Supporting data, including Product Lifecycle's records and lifecycle states behind an ACL; the Core spec model and the lifecycle cascade into compatibility and partner feeds still have to be built |
| Build everything | Full control | Spends Core time on search, payment and workflow, which the market sells |

**What comparable shops tend to do**

- Specialist technical retailers (electronics components, industrial parts) compete on parametric search, datasheets and "will this fit" answers, and buy or rent checkout, payment and hosting.
- Search is almost always a bought or hosted search product rather than database full-text search, because facets, typo tolerance and ranking are hard to build well.
- Product feeds to marketplaces and resellers are usually generated files or bulk APIs, with push notifications added only when partners ask.

**Integration styles**

- Synchronous API calls between services: simple, but couples availability and builds a distributed monolith (the storefront design names this pitfall).
- A shared database: fast to start, and the most direct way to get "no single source of truth" and "unclear ownership".
- Events with local copies: more moving parts, but each boundary owns its data and keeps working when another is down. The repository already designs this way (D-005, D-008).

**AI-assisted delivery**

- A common pattern with coding agents is to let them work inside one clear boundary, with written instructions, linters and human review, and to keep shared contracts and cross-cutting rules under human control. The repository's own learnings log points the same way (diagnosis point 8).

---

## Credits

- Will Larson, *Crafting Engineering Strategy* (O'Reilly, 2025). Chapters on [lethain.com](https://lethain.com/components-of-eng-strategy/). The steps and policy and operations categories are his; their application to Drone Web is ours.
- Richard Rumelt, *Good Strategy Bad Strategy* (2011) and *The Crux* (2022), for the strategy kernel.
- James Higginbotham, ADDR (*Principles of Web API Design*), as used throughout this repository.
- Simon Wardley, for Wardley mapping.
