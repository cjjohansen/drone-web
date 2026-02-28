# AGENTS

This file defines high-level behavior for agents working in `ralph-loop/`.

## Core Principles

- Keep one active plan cursor at a time (`plans/plan-*/state.md`).
- Record architectural and cross-plan decisions in `ralph-loop/decisions.md`.
- Record distilled patterns and pitfalls in `ralph-loop/learnings.md`.
- Keep plan execution details in each plan folder:
  - `state.md` (cursor/current status)
  - `implementation-plan.md` (what to do)
  - `logs.md` (what happened)

## Traceability

- Preserve links to legacy `.ralph/*` documents during transition.
- Do not delete historical notes unless explicitly requested.

## Update Rules

- If a decision impacts multiple plans, write it to `ralph-loop/decisions.md`.
- If a learning is broadly reusable, write it to `ralph-loop/learnings.md`.
- If an item is plan-local, keep it in `plans/plan-*/logs.md`.
