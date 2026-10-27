---
name: legacy-system-2-eventmodel
description: Analyze legacy system architectures and produce Event Modeling slice models in JSON format. Transforms system descriptions into business-focused Event Models with commands, events, read models, screens, and automations. Use when the user asks to model a legacy system, create event models, generate Event Sourcing slices, or convert system behavior into Event Modeling JSON.
---

# Legacy System to Event Model

Analyze legacy system architectures and produce structured Event Sourcing slice models in JSON format following the [Event Modeling](https://eventmodeling.org/) methodology.

## Workflow

### Step 1: Check for existing analysis

Read `high-level-analysis.json` if it exists — use it as the starting point and skip to Step 3.

### Step 2: Identify high-level use cases

Analyze the system to extract all use cases. Ask the user whether to produce:
- **High-level analysis** — complete flow, no fields, no specifications
- **Detailed flow** — specific use case with fields, examples, and Given/When/Then specs

### Step 3: Analyze and categorize operations

| System Operation | Slice Type |
|-----------------|------------|
| Write/mutation operations | `STATE_CHANGE` |
| Read/query operations | `STATE_VIEW` |
| Background/automated tasks | `AUTOMATION` |
| External system calls | `STATE_CHANGE` (for now) |

### Step 4: Build the model

For each slice, follow the element rules below. Write output to `config.json` (append `-$counter` if file exists).

### Step 5: Save high-level analysis

Write `high-level-analysis.json` automatically after completing a high-level analysis (don't ask permission).

## Slice Types

### STATE_CHANGE
- **Purpose:** User action changes system state
- **Required:** 1 Command + 1 Event
- **Optional:** 1 Screen (only if previous slice was `STATE_VIEW`)
- **Flow:** User → Command → Event → State change

### STATE_VIEW
- **Purpose:** Present current state to users
- **Required:** 1 Read Model
- **Optional:** 1 Screen (only if previous slice was `STATE_CHANGE`)
- **Flow:** Events → Read Model → Display

### AUTOMATION
- **Purpose:** Background process triggered by events
- **Required:** 1 Processor + 1 Command + 1+ Events
- **Rule:** Never connects directly to Events; requires intermediate `STATE_VIEW` slice
- **Flow:** Event → Processor → Command → Event

## Element Naming

| Type | Convention | Examples |
|------|-----------|----------|
| Command | Action verbs | Add Item, Submit Order, Cancel Booking |
| Event | Past tense | Item Added, Order Submitted, Booking Cancelled |
| Read Model | Descriptive nouns | Cart Items, Customer Profile, Order History |
| Screen | UI-focused nouns | Add Item Form, Cart Display, Order Summary |
| Processor | Process descriptions | Payment Processor, Notification Sender |

Use **business terminology only**. No technical suffixes, database terms, or infrastructure details.

## Dependencies

### Valid patterns

```
Screen(OUTBOUND)   → Command(INBOUND)
Command(OUTBOUND)  → Event(INBOUND)
Event(OUTBOUND)    → ReadModel(INBOUND)
ReadModel(OUTBOUND)→ Screen(INBOUND)
```

### Rules
- All dependencies must reference existing elements
- No circular dependencies
- Every element needs at least one dependency

## Specifications (Given/When/Then)

Capture **business rules**, not simple validations like "must be a number."

| Slice Type | Pattern |
|-----------|---------|
| STATE_CHANGE | GIVEN Event(s), WHEN Command, THEN Event(s) |
| STATE_VIEW | GIVEN Event(s), THEN ReadModel(s) |
| AUTOMATION | GIVEN Event, WHEN Processor, THEN Command, THEN Event |

Source from unit tests and code comments when analyzing existing systems.

## Code References

Put code references in the `description` field of each element — fully qualified class names, modules, or packages.

## JSON Schema

For the complete output schema, see [schema.json](schema.json).

### Quick reference — Slice structure

```json
{
  "slices": [{
    "id": "unique_id",
    "status": "Created",
    "index": 1,
    "title": "Business-focused name",
    "context": "Slice purpose",
    "sliceType": "STATE_CHANGE|STATE_VIEW|AUTOMATION",
    "commands": [],
    "events": [],
    "readmodels": [],
    "screens": [],
    "screenImages": [],
    "processors": [],
    "tables": [],
    "specifications": [],
    "actors": [{ "name": "Actor", "authzRequired": false }],
    "aggregates": ["AggregateName"]
  }]
}
```

### Field types

`String`, `Boolean`, `Double`, `Decimal`, `Long`, `Custom`, `Date`, `DateTime`, `UUID`, `Int`

List fields use `"cardinality": "List"`.

## Validation Checklist

Before outputting JSON, verify:

- [ ] Each slice has correct element count and types
- [ ] All dependencies reference existing elements
- [ ] Both STATE_CHANGE and STATE_VIEW slices exist for complete flows
- [ ] Fields are business-relevant with appropriate types
- [ ] Names use business terminology
- [ ] JSON is valid and parseable
- [ ] No circular dependencies
- [ ] Specifications capture business rules
- [ ] Aggregates are consistent
- [ ] Code references in `description` fields
