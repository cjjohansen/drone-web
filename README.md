# Drone Web: Catalog Storefront API Design

API-first design for a mechatronic product ecommerce platform, built using the ADDR (Align-Define-Design-Refine) methodology.

## What This Is

This repository contains the API design artifacts for a **Catalog Storefront API** — the backbone of a drone and mechatronic components ecommerce platform. No code yet. Just design.

The design follows James Higginbotham's **ADDR process** (from *Principles of Web API Design*), driven by an AI-assisted workflow called the **Ralph Loop**.

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

## ADDR Process

| Phase | Status | Deliverables |
|-------|--------|--------------|
| **Align** | Validated | Personas, job stories, 23 activity steps, Big Picture Event Storming (40 domain events, 4 pivotal events), validation report |
| **Define** | Validated | 3 API boundaries, 14 resources, 19 API operation profiles, sequence diagrams for all 6 job stories, validation report |
| **Design** | Validated | Style guide, high-level API design tables (19 operations across 3 APIs), validation report |
| **Refine** | Validated | OpenAPI 3.1 specs (3 APIs), AsyncAPI 3.0 spec (7 integration events), Postman collections, request/response examples, sequence diagrams |

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

The **[Ralph Loop](https://github.com/anthropics/claude-code/blob/main/plugins/ralph-wiggum/README.md)** is an AI-assisted development workflow that drives this project through ADDR phases. Based on Geoff Huntley's iterative autonomous agent pattern — keep feeding an AI agent a task until the job is done, persisting learnings between iterations. It maintains persistent state across sessions:

- **`.ralph/STATE.md`** — Current phase, what's done, what's next
- **`.ralph/agent/decisions.md`** — Decision log with rationale (D-001 through D-018)
- **`.ralph/agent/learnings.md`** — Mistakes and patterns learned across sessions
- **`.ralph/tasks/addr-process.md`** — Task tracking and progress

The Ralph Loop reads state at session start, follows ADDR prompts for each phase, validates deliverables before committing, and updates state before ending.

## Project Structure

```
drone-web/
├── design/
│   ├── addr-ai-prompts.md                  # ADDR prompt guide (shared, from launchany)
│   ├── style-guide.md                      # Shared API design style guide
│   ├── catalog-storefront/                 # Catalog storefront (read side) - complete ADDR run
│   │   └── addr/
│   │       ├── align/
│   │       ├── define/
│   │       ├── design/
│   │       └── refine/
│   ├── catalog-management/                  # Earlier write-side run (baseline/reference)
│       └── addr/
│           ├── align/                       # populated
│           ├── define/                      # placeholders
│           ├── design/                      # placeholders
│           └── refine/                      # placeholders
│   └── catalog-management-v2/              # Current write-side run
│       ├── addr/
│       │   ├── align/
│       │   ├── define/
│       │   ├── design/
│       │   └── refine/                      # 8 OpenAPI files + AsyncAPI + Postman
│       └── eventmodel/
├── Specs/
│   └── Case/JTBD/                          # Sanitized JTBD corpus and mapping notes
├── .ralph/                                  # Ralph Loop governance workspace
│   ├── STATE.md
│   ├── agent/
│   │   ├── decisions.md
│   │   └── learnings.md
│   ├── specs/
│   │   ├── catalog-storefront.md
│   │   └── jtbd-droneweb.md
│   └── tasks/
│       ├── addr-process.md
│       ├── addr-catalog-management.md
│       ├── addr-catalog-management-v2.md
│       └── jtbd-droneweb.md
├── .cursor/skills/                          # Agent skills
│   ├── addr-2-eventmodel/
│   ├── event-modeling-automation-slice/
│   ├── event-modeling-state-change-slice/
│   ├── event-modeling-state-view-slice/
│   ├── event-storming/
│   ├── event-storming-drawio/
│   ├── legacy-system-2-eventmodel/
│   ├── railway-drawio/
│   └── ralph-loop-governance/
└── CLAUDE.md                                # Project instructions and Ralph integration notes
```

## Current Status

**Active workstream:** JTBD Drone Web anonymization in `.ralph/tasks/jtbd-droneweb.md`.

**Current focus:**
- Mirror and sanitize JTBD source corpus into `Specs/Case/JTBD/` with stable placeholder mappings
- Keep governance/task/spec artifacts in `.ralph/` aligned with active plan and decision logs

**Baseline / reference workstreams:**
- `design/catalog-storefront/addr/`: complete 4-phase ADDR run (Align, Define, Design, Refine)
- `design/catalog-management/addr/`: earlier write-side run kept for historical reference
- `design/catalog-management-v2/addr/`: revised write-side ADDR run with refine contracts and eventmodel artifacts

## Retrospective

This was our first full ADDR pass with AI-assisted design. Some things we'd do differently:

- **Event Storming produced too many observational events.** Roughly half of the 40 domain events are query observations ("Catalog Searched", "Product Details Viewed", "Category Browsed") rather than genuine state changes. In Brandolini's event storming, domain events should represent things that happened that changed state — not "someone read data." These observational events belong in analytics instrumentation, not on the event storming canvas, unless auditing or behavior tracking is a core domain concern (it isn't here).
- **API profiles reflect this.** The Catalog API is entirely read-only, so every operation correctly shows no emitted events. The observational events from event storming don't add design value in the profiles — they'd just pad the column.

**Next step:** Repeat the ADDR process on a domain like Catalog Management, where there are plenty of state-changing events (product creation, updates, discontinuation, pricing changes, category management). That will give the event storming and API profiles more substance to work with and better test the ADDR workflow. See what improves, whether we can move faster, and where the AI-assisted workflow still needs calibration. We're still learning.

## Tools Used

- **ADDR** — Align-Define-Design-Refine methodology by James Higginbotham
- **Ralph Loop** — AI-assisted development workflow for driving ADDR phases
- **Claude Code** — AI pair programmer (Anthropic)
- **Cursor** — AI-native IDE
- **draw.io** — Event Storming diagram authoring
