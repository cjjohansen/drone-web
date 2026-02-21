# Catalog Management — Align Phase

> **Domain:** Catalog Management (write side)
> **Methodology:** ADDR (Align-Define-Design-Refine)
> **Status:** Validated
> **Depends on:** Catalog Storefront Align phase (read side) — `design/catalog-storefront/addr/align/`

## Overview

The Catalog Management domain covers all write operations that feed the Catalog Storefront: product lifecycle, technical documentation, pricing, inventory, category management, and compatibility rules. This is the command side that produces the state-changing events the storefront consumes.

## Deliverables

| File | Description |
|------|-------------|
| [personas.md](personas.md) | 5 personas: Catalog Manager, Pricing Analyst, Inventory Controller, Category Manager, Compatibility Engineer |
| [job-stories.md](job-stories.md) | 6 unifying job stories (JS1–JS6) covering all catalog management capabilities |
| [activity-steps.md](activity-steps.md) | 38 activity steps grouped into activities per job story |
| [event-storming.md](event-storming.md) | Big Picture Event Storming: 36 state-changing domain events, 4 pivotal events, 7 subdomains, 21 integration events |
| [validation.md](validation.md) | Validation report: 2 findings (both applied) |

## Key Numbers

- **5** personas (all write-side roles)
- **6** unifying job stories
- **38** activity steps (after validation: +2 from F-001 and F-002)
- **36** domain events (all genuine state changes — zero observational events)
- **4** pivotal events (Product Discontinued, Import Batch Processed, Promotion Created, Compatibility Rule Created)
- **21** integration events (cross-boundary, consumed by Storefront, Compatibility, and Partner APIs)
- **7** subdomains identified

## Relationship to Storefront

The Catalog Storefront ADDR run designed the read-side APIs. This Catalog Management run designs the write-side that feeds those APIs:

```
Catalog Management (this domain)
    │
    │ publishes integration events
    ▼
┌─────────────────────────────────────────┐
│  Catalog Storefront API (read side)     │
│  Component Compatibility API            │
│  Partner Catalog Syndication API        │
└─────────────────────────────────────────┘
```

The 7 integration events already defined in the Storefront's AsyncAPI spec all originate from commands in this domain. This ADDR run additionally identifies 14 new integration events not previously captured.
