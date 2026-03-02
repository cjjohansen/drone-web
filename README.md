# Drone Web: AI Assisted Software Design with ADDR and Event Modeling

API-first design with ADDR and Event Modeling for a mechatronic product ecommerce platform, guided by Ralph Loop governance.

Inspired by Martin Dilger's Event Modeling and Ralph Loop work:
https://github.com/dilgerma/node-apps-with-eventsourcing-and-ralph-loop

## What This Is

This repository contains API design and event-modeling artifacts for a drone/mechatronic ecommerce platform.

- ADDR artifacts for read-side and write-side API design
- EventModel outputs derived from ADDR artifacts
- Supporting domain documentation used as source/reference material

There is no runnable application code in this repo. (Yet)

The design follows [James Higginbotham's **ADDR process**](https://github.com/launchany/addr-ai-prompts) (from *Principles of Web API Design*), driven by an AI-assisted workflow called the **Ralph Loop**.

## The Domain

Drones and mechatronic components: motors, ESCs, flight controllers, sensors, frames, batteries, FPV gear, and complete systems.

**4 Personas:**

| Persona | Role | Primary Stories |
|---------|------|-----------------|
| Professional Integrator | Engineer building commercial drone systems (surveying, agriculture, inspection) | JS1–JS4 |
| Fleet Procurement Buyer | Program manager purchasing at fleet scale (defense, enterprise, government) | JS1–JS5 |
| Casual Browser | Newcomer exploring without a specific project | JS1, JS2, JS5 |
| Partner System | External system consuming catalog data programmatically | JS6 |

**6 Job Stories:**

| ID | Story | Summary |
|----|-------|---------|
| JS1 | Product Discovery | Search and filter by technical specs |
| JS2 | Product Evaluation | Review details, docs, and related products |
| JS3 | Product Comparison | Compare specs side by side |
| JS4 | Compatibility Verification | Verify components work together (voltage, current, physical fit, protocol) |
| JS5 | Catalog Browsing | Browse structured category hierarchy |
| JS6 | Partner Catalog Access | Retrieve catalog data in bulk for partner systems |

## ADDR Workstreams

| Workstream | Scope | Status | Notes |
|------------|-------|--------|-------|
| Catalog Storefront | Read-side APIs | Complete | Align, Define, Design, and Refine all validated |
| Catalog Management (v1) | Initial write-side pass | Baseline/Reference | Historical run kept for comparison and traceability |
| Catalog Management (v2) | Revised write-side APIs | Complete | Align, Define, Design, and Refine validated (8 OpenAPI specs + AsyncAPI + Postman) |

## Event Storming

Big Picture Event Storming following Alberto Brandolini's methodology — 40 domain events organized across 7 subdomains with 4 pivotal events marking boundary shifts.

![Event Storming — Big Picture](design/catalog-storefront/addr/align/event-storming.svg)

### Pivotal Events

| # | Pivotal Event | Why It's Pivotal |
|---|---------------|-----------------|
| 1 | **Product Added to Catalog** | Everything starts here. Triggers search indexing, compatibility cache updates, partner feed updates. |
| 2 | **Product Discontinued** | Cascading impact across all three bounded contexts. |
| 3 | **Compatibility Check Completed** | The moment of truth for a build. Pass or fail determines the next step. |
| 4 | **Catalog Feed Generated** | Data leaves our domain and enters partner systems. |

## API Boundaries

Three bounded contexts identified using DDD principles. No synchronous cross-boundary calls — integration is fully async via integration events (a curated subset of internal domain events published for cross-boundary consumption).

| Boundary | Responsibility | Job Stories |
|----------|---------------|-------------|
| **Catalog API** | Search, browse, filter, product details, categories, pricing, availability, reviews, documents | JS1, JS2, JS3, JS5 |
| **Compatibility API** | Validate multi-component builds, identify incompatibilities, suggest replacements | JS4 |
| **Partner Catalog API** | Bulk catalog feeds, batch availability, batch pricing for partner systems | JS6 |

**Integration model:** Catalog API publishes integration events (Product.Created, Product.Updated, Product.Discontinued, Product.PriceChanged, Product.AvailabilityChanged). Compatibility and Partner APIs consume these to maintain local caches. No synchronous cross-boundary calls during operations. Internal domain events (e.g., Catalog Searched, Product Details Viewed) stay within their bounded context.

## Ralph Loop

The **[Ralph Loop](https://github.com/anthropics/claude-code/blob/main/plugins/ralph-wiggum/README.md)** is an AI-assisted workflow used in this repo to run design/documentation tasks with persistent handoff state and decision logging.

It maintains persistent state across sessions:

- **`.ralph/STATE.md`** — Single active plan, current status, and next actions
- **`.ralph/agent/decisions.md`** — Decision log with rationale (active and baseline workstreams)
- **`.ralph/agent/learnings.md`** — Mistakes and patterns learned across sessions
- **`.ralph/tasks/`** — Task trackers per workstream (ADDR and JTBD)

Current active plan is tracked in `.ralph/STATE.md`; ADDR and Event Modeling artifacts remain the primary repository baseline.

## Project Structure

```text
drone-web/
├── design/
│   ├── addr-ai-prompts.md
│   ├── style-guide.md
│   ├── catalog-storefront/addr/        # read-side ADDR run (complete)
│   ├── catalog-management/addr/         # write-side v1 baseline
│   └── catalog-management-v2/           # write-side v2 run (complete)
│       ├── addr/                        # Align/Define/Design/Refine artifacts
│       └── eventmodel/                  # derived EventModel config/analysis outputs
├── Specs/Case/JTBD/                     # supporting case docs and mapping references
├── .ralph/
│   ├── STATE.md
│   ├── agent/
│   │   ├── decisions.md
│   │   └── learnings.md
│   ├── specs/
│   └── tasks/
├── .cursor/skills/
└── README.md
```

## Current Status

**Primary baseline:** ADDR and Event Modeling artifacts for Catalog Storefront and Catalog Management v2.

**Completed baselines:**
- Catalog Storefront ADDR (all 4 phases validated)
- Catalog Management v2 ADDR (all 4 phases validated)
- Catalog Management v2 refine packaging (8 boundary OpenAPI 3.1 specs, AsyncAPI 3.0 integration contract, consolidated Postman collection)
- Supporting case corpus mirrored into `Specs/Case/JTBD/` with deterministic mapping policy and residual identifier scans

## Retrospective

This was our first full ADDR pass with AI-assisted design. Some things we'd do differently:

- **Event Storming produced too many observational events.** Roughly half of the 40 domain events are query observations ("Catalog Searched", "Product Details Viewed", "Category Browsed") rather than genuine state changes. In Brandolini's event storming, domain events should represent things that happened that changed state — not "someone read data." These observational events belong in analytics instrumentation, not on the event storming canvas, unless auditing or behavior tracking is a core domain concern (it isn't here).
- **API profiles reflect this.** The Catalog API is entirely read-only, so every operation correctly shows no emitted events. The observational events from event storming don't add design value in the profiles — they'd just pad the column.

**Next step:** Continue refinement and validation for ADDR-aligned Event Modeling outputs, and evolve follow-on domain workstreams.

## Tools Used

- **ADDR** — Align-Define-Design-Refine methodology by [James Higginbotham](https://github.com/launchany/addr-ai-prompts)
- **Event Modeling Vertical Slice Patterns** — Martin Dilger-inspired skill files:
  [state-change-slice](.cursor/skills/event-modeling-state-change-slice/SKILL.md),
  [state-view-slice](.cursor/skills/event-modeling-state-view-slice/SKILL.md),
  [automation-slice](.cursor/skills/event-modeling-automation-slice/SKILL.md);
  reference repo: [dilgerma/node-apps-with-eventsourcing-and-ralph-loop](https://github.com/dilgerma/node-apps-with-eventsourcing-and-ralph-loop)
- **Ralph Loop** — AI-assisted development workflow for driving ADDR phases
- **Claude Code** — AI pair programmer (Anthropic)
- **Cursor** — AI-native IDE
- **draw.io** — Event Storming diagram authoring

