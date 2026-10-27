---
description: Generate EventModel artifacts from ADDR phase deliverables
agent: ralph-loop
---
Generate EventModel artifacts from the ADDR design outputs in `design/{domain}/addr/`.

1. Read the ADDR artifacts in order:
   - `align/job-stories.md`
   - `align/activity-steps.md`
   - `align/boundary-map.md` (if present)
   - `align/eventmodel-mapping.md` (if present)
   - `define/api-profiles.md`
   - `design/api-design.md`
   - `refine/*-api.yaml` (all boundary OpenAPI specs)

2. Build operation inventory per bounded context:
   - STATE_CHANGE: POST/PUT/PATCH/DELETE operations that mutate state
   - STATE_VIEW: GET operations and safe POST query endpoints
   - AUTOMATION: async/background processing, replay, batch processors

3. Generate EventModel slices and write to `design/{domain}/eventmodel/`:
   - `high-level-analysis.json`
   - `config.json`

Use $ARGUMENTS for the domain name or path.