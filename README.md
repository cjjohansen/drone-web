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

![Event Storming — Big Picture](design/addr/align/event-storming.svg)

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
├── design/addr/
│   ├── addr-ai-prompts.md              # ADDR prompt guide (from launchany)
│   ├── align/                          # Align phase deliverables
│   │   ├── README.md                   # Align phase overview
│   │   ├── personas.md                 # 4 personas with job story mapping
│   │   ├── job-stories.md              # 6 unifying job stories
│   │   ├── activity-steps.md           # 23 activity steps
│   │   ├── event-storming.md           # Big Picture Event Storming (40 events)
│   │   ├── event-storming.drawio       # Interactive diagram (draw.io)
│   │   ├── event-storming.svg          # SVG export of the diagram
│   │   ├── big-picture-event-storming.drawio  # Reference layout (hand-crafted)
│   │   └── validation.md              # Align phase validation report
│   ├── define/                         # Define phase deliverables
│   │   ├── README.md                   # Define phase overview
│   │   ├── boundaries.md               # 3 API boundaries with DDD rationale
│   │   ├── resources.md                # 14 resources with properties
│   │   ├── api-profiles.md             # 19 operations with events/characteristics
│   │   ├── sequence-diagrams.md        # Mermaid diagrams for all 6 job stories
│   │   └── validation.md              # Define phase validation report
│   ├── design/                         # Design phase deliverables
│   │   ├── README.md                   # Design phase overview
│   │   ├── style-guide.md              # API design style guide
│   │   ├── api-design.md               # High-level API design tables (3 APIs, 19 ops)
│   │   └── validation.md              # Design phase validation report
│   └── refine/                         # Refine phase deliverables
│       ├── README.md                   # Refine phase overview
│       ├── catalog-storefront-api.yaml # OpenAPI 3.1 — Catalog Storefront API
│       ├── component-compatibility-api.yaml  # OpenAPI 3.1 — Compatibility API
│       ├── partner-catalog-api.yaml    # OpenAPI 3.1 — Partner Catalog API
│       ├── integration-events.yaml     # AsyncAPI 3.0 — 7 integration events
│       ├── api-examples.md             # Request/response examples for all 6 job stories
│       ├── sequence-diagrams.md        # Mermaid diagrams with HTTP methods/status codes
│       ├── validation.md              # Refine phase validation report
│       └── postman/                    # Postman collections
│           ├── catalog-storefront-api.postman_collection.json
│           ├── component-compatibility-api.postman_collection.json
│           └── partner-catalog-api.postman_collection.json
├── Documentation/                      # Reference materials
│   └── AI_Assisted_API_Design_Dec_2025_LaunchAny.01 1.pdf
├── .ralph/                             # Ralph Loop workspace
│   ├── STATE.md                        # Session handoff state
│   ├── agent/decisions.md              # Decision log (D-001 – D-018)
│   ├── agent/learnings.md              # Persistent learnings
│   ├── specs/catalog-storefront.md     # Product spec
│   └── tasks/addr-process.md           # Task tracking
├── .cursor/skills/                     # Cursor agent skills
│   ├── event-storming/SKILL.md         # Event Storming domain knowledge
│   └── event-storming-drawio/          # draw.io generation skill
│       ├── SKILL.md
│       └── _drawio-engine.js           # Reusable Node.js engine
└── CLAUDE.md                           # Project instructions for Claude Code
```

## Current Status

**Phase:** All 4 ADDR phases complete (Align, Define, Design, Refine).

**Completed:**
- Align: Personas, job stories, activity steps, event storming, validation
- Define: API boundaries, resources, operation profiles, sequence diagrams, validation
- Design: Style guide, high-level API design tables, validation
- Refine: OpenAPI 3.1 specs, AsyncAPI 3.0 spec, Postman collections, examples, validation

## Tools Used

- **ADDR** — Align-Define-Design-Refine methodology by James Higginbotham
- **Ralph Loop** — AI-assisted development workflow for driving ADDR phases
- **Claude Code** — AI pair programmer (Anthropic)
- **Cursor** — AI-native IDE
- **draw.io** — Event Storming diagram authoring
