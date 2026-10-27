---
name: event-modeling-spec
description: Provides the official Event Modeling Specification JSON Schema for validation of EventModel config.json files
---

# Event Modeling Specification Schema

This skill provides the official JSON Schema for validating EventModel configurations.

## Schema Location

`.kilo/skills/event-modeling-spec/schema.json`

## Usage

Validate your EventModel `config.json` against this schema using ajv:

```bash
npx ajv validate -s .kilo/skills/event-modeling-spec/schema.json -d design/{domain}/eventmodel/config.json
```

## Schema Structure

The schema defines:

- **Slice** - Vertical model slice containing commands, events, read models, automations
- **Element** - Single model element (Command, Event, Read Model, Screen, Automation)
- **Specification** - Behavior specification with given/when/then examples
- **Field** - Typed attribute (String, UUID, DateTime, Boolean, Int, etc.)
- **Dependency** - Link between elements indicating message flow
- **Actor** - User or system interacting with commands

## Source

Official schema from [event-modeling-spec](https://github.com/nebulit/event-modeling-spec) repository, used by Nebulit Event Modeling Tooling.