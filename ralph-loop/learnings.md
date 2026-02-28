# Cross-Plan Learnings

Distilled reusable patterns across plans.

## Process and Governance

- **LRN-003, LRN-005, LRN-007, LRN-022**: Follow ADDR prompts; validate each phase; when Event Storming is deferred, require explicit replacement artifacts and validation.
- **LRN-020, LRN-021, LRN-026**: Keep one active plan cursor; decisions in one source; keep governance notes sanitized.
- **LRN-019**: Preserve earlier runs as baselines when redesigning with new assumptions.

## Spec and Tooling Quality

- **LRN-013, LRN-017**: Redocly lint catches quality gaps that schema-only validators miss.
- **LRN-014, LRN-015, LRN-016**: Prefer high-reputation Context7 references for authoring implementation details.
- **LRN-009..LRN-012, LRN-018**: Use reusable engines and fail-fast geometry validation for generated diagrams.

## EventModel and Integration

- **LRN-006**: Favor fact-event modeling for cross-boundary ECST where appropriate.
- **LRN-023, LRN-024**: Use ADDR artifacts as source-of-truth and split `STATE_CHANGE`/`STATE_VIEW` for better tool interoperability.

## Transformation Work

- **LRN-025**: Mapping quality matters; replacements should remain domain-credible and consistent.

## Source of Detailed Entries

- Detailed original entries remain in: `.ralph/agent/learnings.md`
