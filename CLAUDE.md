# Drone Web — Project Instructions

## Ralph Loop Integration

**CRITICAL: At the start of every session, you MUST read these files in order:**

1. `.ralph/STATE.md` — Current phase, what's done, what's next, key context
2. `.ralph/agent/learnings.md` — Mistakes to avoid, patterns to follow
3. `.ralph/agent/decisions.md` — Decisions made so far with rationale
4. `.ralph/tasks/addr-process.md` — Task tracking and progress

**Before ending a session or when significant progress is made, UPDATE `.ralph/STATE.md`.**

When making decisions, record them in `.ralph/agent/decisions.md` following the existing format.
When learning from mistakes, record them in `.ralph/agent/learnings.md` following the existing format.

## ADDR Process

This project uses the ADDR (Align-Define-Design-Refine) API design methodology by James Higginbotham.

- **Prompts guide:** `design/addr-ai-prompts.md` — follow these prompts for each phase
- **Design artifacts:** `design/{domain}/addr/{phase}/` — Align, Define, Design, Refine deliverables per domain
- **Domain:** Mechatronic product ecommerce (drones, motors, ESCs, flight controllers, sensors, frames, batteries, FPV gear)

## Git

- Remote: `origin` → GitHub (`cjjohansen/drone-web`)
- Push requires token auth via `GITHUB_PERSONAL_ACCESS_TOKEN` env var
- Commit and push after each completed ADDR phase
