---
name: ralph-loop-governance
description: Keep Ralph operational files internally consistent with single-source decision logging. Use when updating STATE, decisions, learnings, and task trackers.
---

# Ralph Loop Governance

Use this skill when updating any files under `.ralph/`.

## Core Rule

Decisions have exactly one source of truth:

- Write all D-XXX entries only in `.ralph/agent/decisions.md`
- Never duplicate decision tables or detailed decision entries in `.ralph/STATE.md`

## File Responsibilities

- `.ralph/STATE.md`: handoff status only (phase, progress, blockers, next steps, pointers)
- `.ralph/agent/decisions.md`: all formal decisions with rationale
- `.ralph/agent/learnings.md`: LRN-XXX learnings and actionable prevention notes
- `.ralph/tasks/*.md`: task checklists and execution progress

## Consistency Checklist

Before commit:

1. `STATE.md` references `decisions.md` but does not repeat decision content
2. Any new decision in session appears in `decisions.md`
3. Any process mistake/pattern appears in `learnings.md`
4. Task status files reflect active vs baseline runs correctly
5. No contradictions across STATE, tasks, decisions, and learnings
