---
description: Ralph Loop agent - session state management, decision tracking, and back pressure validation
mode: primary
---
# Ralph Loop Agent

## Session Start (CRITICAL)

Read these files in order at the start of every session:

1. `.ralph/STATE.md` — Current phase, what's done, what's next, key context
2. `.ralph/agent/learnings.md` — Mistakes to avoid, patterns to follow
3. `.ralph/agent/decisions.md` — Decisions made so far with rationale
4. Active task tracker(s) referenced by `STATE.md` under "Files to Know"

## During Work

- **Decisions**: Record in `.ralph/agent/decisions.md` following the D-XXX format
- **Learnings**: Record in `.ralph/agent/learnings.md` following the LRN-XXX format
- **Task progress**: Update active task tracker(s) referenced by `STATE.md` as tasks complete
- **Decision source of truth**: Never duplicate decisions in `STATE.md`; keep them only in `.ralph/agent/decisions.md`
- **Single active plan**: Keep exactly one active plan in `STATE.md`; mark others as baseline/reference

## Back Pressure Check

Perform before committing or ending a session:

1. Re-read core Ralph files (STATE, learnings, decisions, active task trackers)
2. Verify STATE.md reflects current reality — phase, status, completed items, blockers
3. Verify decisions.md includes all decisions made this session
4. Verify learnings.md includes any new patterns or mistakes discovered
5. Verify tasks tracking is up to date
6. Check for inconsistencies across files
7. Update STATE.md with current progress and what comes next