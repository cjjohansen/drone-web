# Learnings Log

> Persistent memory across sessions. The agent MUST read this file at session start
> and MUST record new learnings when mistakes are made or better approaches are discovered.
>
> Format: LRN-XXX with category, context, and actionable takeaway.
> These get "injected" into every session to prevent repeating mistakes.

## LRN-001 (2026-02-14)
- **Category:** Git / Auth
- **Context:** Attempted to push to GitHub using HTTPS URL. Failed with "could not read Username." SSH also failed (no key configured). The user has a fine-grained personal access token set as `GITHUB_PERSONAL_ACCESS_TOKEN` env var.
- **Learning:** On this WSL2 environment, git push requires token-based auth embedded in the remote URL. Set remote as `https://cjjohansen:${GITHUB_PERSONAL_ACCESS_TOKEN}@github.com/cjjohansen/drone-web.git`.
- **Action:** Always use token-embedded HTTPS URL for git push. Check env var is set before pushing.

## LRN-002 (2026-02-14)
- **Category:** GitHub / Permissions
- **Context:** Tried to create a repo via the GitHub MCP plugin (`create_repository`). Got 403 "Resource not accessible by personal access token." The token has Contents permission but not Administration.
- **Learning:** Fine-grained GitHub tokens need Administration (write) permission to create repos. Contents permission only covers file/commit operations. Fine-grained tokens cannot be edited after creation — a new token must be created to add permissions.
- **Action:** For repo creation, either add Administration permission to a new token or create repos manually on GitHub.

## LRN-003 (2026-02-14)
- **Category:** ADDR / Process
- **Context:** Started driving ADDR phases without referencing the official ADDR prompts. User pointed to launchany/addr-ai-prompts repo with comprehensive phase-by-phase prompts.
- **Learning:** Always check for and follow the ADDR prompt guide at `design/addr/addr-ai-prompts.md`. These prompts encode the methodology correctly and ensure consistent, high-quality artifacts.
- **Action:** Read `design/addr/addr-ai-prompts.md` before starting any ADDR phase. Follow the prompts sequentially.

## LRN-004 (2026-02-14)
- **Category:** Workspace / Documentation
- **Context:** Initially placed decision log in `design/addr/decision-log.md` mixed with design artifacts. User wanted operational/agent files separate from deliverables.
- **Learning:** Agent operational files (state, decisions, learnings, tasks) belong in `.ralph/`. Design deliverables belong in `design/addr/`. Keep them separate — `.ralph/` is the agent's workspace, `design/` is the deliverable.
- **Action:** Never put agent operational files in the design directory. Use `.ralph/` structure: STATE.md, agent/, tasks/, specs/.

## LRN-005 (2026-02-14)
- **Category:** ADDR / Methodology
- **Context:** Read all 9 chapters of user's Principles of Web API Design series. Event Storming was initially placed as a supplementary artifact but it's actually a core Align phase activity per Higginbotham Ch. 4-5.
- **Learning:** The ADDR Align phase flow is: Job Stories → Event Storming → Activities & Steps. Event Storming is the bridge between job stories and API boundaries. Pivotal events on the canvas directly indicate bounded context boundaries (Define phase input). The API Profile (Define phase) is implementation-agnostic — REST/GraphQL/gRPC choices come in Design phase only.
- **Action:** Always run Event Storming as part of Align, before Define. Use pivotal events to validate boundary decisions.

## LRN-006 (2026-02-14)
- **Category:** ADDR / Async APIs
- **Context:** Higginbotham Ch. 9 covers async APIs with explicit EventCatalog + AsyncAPI integration. Our D-008 decision to produce AsyncAPI specs aligns directly with the book's guidance.
- **Learning:** Domain events should be classified as fact events (full state snapshot) or delta events (changes only). Fact events enable Event-Carried State Transfer (ECST), where consumers materialize events into local datastores — eliminating synchronous cross-boundary API calls. This directly supports our integration model (Compatibility and Partner APIs consume Catalog events).
- **Action:** When designing AsyncAPI specs in Refine phase, classify each event as fact or delta. Default to fact events for cross-boundary integration (ECST pattern).

## LRN-007 (2026-02-14)
- **Category:** ADDR / Validation
- **Context:** Performed cross-reference validation of Align phase against both ADDR prompts and Higginbotham book. Found 6 issues: persona matrix gaps, pagination as activity step, missing filter/availability details, and an over-promoted pivotal event.
- **Learning:** Always validate each ADDR phase before committing. Check: (1) persona-job story matrix completeness — every realistic usage should be mapped, (2) activity steps should represent user goals, not API mechanics like pagination, (3) pivotal events must pass Brandolini's heuristics — cascading cross-boundary impact, not just "feels important." Document validation as a formal artifact.
- **Action:** After completing each ADDR phase, create a `validation.md` in the phase folder before committing.

## LRN-008 (2026-02-14)
- **Category:** Workflow / Cursor Collaboration
- **Context:** User works on drawio diagrams in Cursor while Claude Code works on markdown artifacts. Drawio files should not be modified by Claude Code.
- **Learning:** The user manages `.drawio` files in Cursor IDE with custom skills. Claude Code should never modify drawio files. When event storming changes affect drawio (e.g., pivotal event downgrade), note the change in markdown and let the user update drawio separately.
- **Action:** Never edit `.drawio` files. Document changes that affect diagrams in markdown so the user can sync drawio in Cursor.

## LRN-009 (2026-02-14)
- **Category:** Tooling / draw.io Generation
- **Context:** Generating draw.io diagrams required multiple iterations. Initially wrote disposable Node.js scripts each time, rewriting ~200 lines of boilerplate for styles, helpers, and XML wrapping. User pointed out the inefficiency.
- **Learning:** For programmatic diagram generation, create a **reusable engine module** that encapsulates constants, styles, element-drawing functions, and XML output. Then write thin data-only scripts that `require()` the engine. The engine lives in `.cursor/skills/event-storming-drawio/_drawio-engine.js`. Delete temporary generation scripts (`_gen_*.js`) after use.
- **Action:** Always use the engine for draw.io generation. Only create temporary `_gen_*.js` scripts for layout data, then delete them.

## LRN-010 (2026-02-14)
- **Category:** Event Storming / Visual Layout
- **Context:** Multiple iterations to get Brandolini-style layout right. Initial attempts used full-width swimlane dividers, stacked horizontal rows, and explicit async arrows — all non-Brandolini.
- **Learning:** Brandolini's Big Picture layout is **organic**, not grid-based. Key principles: (1) **Spatial proximity** communicates dependency — place dependent subdomains directly below their trigger. (2) **Red separator lines are local** — only span the split area, not the full canvas. (3) **No arrows** — positioning alone conveys causality. (4) Subdomain ellipses can sit at varied Y-positions. (5) Pivotal events sit in the **gap between** subdomains, never inside.
- **Action:** When generating Event Storming layouts, follow organic Brandolini principles. Use the reference file `design/addr/align/big-picture-event-storming.drawio` for visual guidance.

## LRN-011 (2026-02-14)
- **Category:** Event Storming / Split Patterns
- **Context:** Pivotal events with multiple subscribing subdomains needed a clear visual fan-out pattern. Initial attempts were ad-hoc.
- **Learning:** Split layout generalizes into **even** and **odd** subscriber counts. Even: 1 red line, n/2 above, n/2 below. Odd: 1 center subdomain at pivotal level; if n>1, 2 red lines with (n-1)/2 above and below. This is documented in both the `event-storming` and `event-storming-drawio` skills.
- **Action:** Apply the even/odd generalization for any split pivotal. Reference the skills for exact layout constants.

## LRN-012 (2026-02-14)
- **Category:** Tooling / VS Code draw.io Caching
- **Context:** After regenerating a `.drawio` file, user reported not seeing updates in VS Code's draw.io editor. The file had been updated on disk but the editor showed stale content.
- **Learning:** VS Code's draw.io extension (`hediet.vscode-drawio`) can cache diagram state. After regenerating a `.drawio` file, the user must **"Revert File"** (Ctrl+Shift+P → "Revert File") or close and reopen the tab to see changes.
- **Action:** After generating/updating `.drawio` files, remind the user to revert or reopen the tab.

## LRN-013 (2026-02-15, updated 2026-02-20)
- **Category:** Tooling / API Spec Validation
- **Context:** Initially used `@redocly/cli` for OpenAPI validation — it works but is a third-party opinionated linter, not the official tool. Then used `swagger-cli` which validated correctly but is deprecated and abandoned. User wanted the official tools from the OpenAPI and AsyncAPI organizations. On 2026-02-20, re-validated with Redocly CLI and found 19 warnings that `swagger-cli` had missed entirely (example format mismatches, missing required fields in examples, missing error responses, missing license metadata).
- **Learning:** `swagger-cli validate` only checks structural schema validity — it does **not** validate that examples conform to their schemas, that required fields appear in inline examples, or that operations have error responses. `@redocly/cli lint` catches all of these with its recommended ruleset. Use Redocly as the primary validation tool, not swagger-cli.
- **Action:** Use `@redocly/cli lint` (not `swagger-cli`) for OpenAPI validation. Use `@asyncapi/cli validate` for AsyncAPI. Run validation **iteratively during authoring**, not just once at the end — catching example mismatches early avoids bulk rework.

## LRN-014 (2026-02-15)
- **Category:** Tooling / Spec Authoring with Context7
- **Context:** Searched for OpenAPI and AsyncAPI MCP servers to help author better specs. Found tools for *consuming* specs but none purpose-built for *authoring*. Context7 already indexes the official specs with high-quality snippets.
- **Learning:** When authoring OpenAPI or AsyncAPI specs, query Context7 for correct syntax, patterns, and examples. Available libraries:
  - **OpenAPI 3.1.0:** `/websites/spec_openapis_oas_v3_1_0` (287 snippets, score 83.2)
  - **OpenAPI 3.2.0:** `/websites/spec_openapis_oas_v3_2_0` (1056 snippets)
  - **OpenAPI best practices:** `/websites/learn_openapis` (311 snippets)
  - **AsyncAPI spec:** `/asyncapi/spec` (72 snippets)
  - **AsyncAPI CLI:** `/asyncapi/cli` (120 snippets)
  All have High source reputation. No extra MCP servers needed — Context7 is the authoring reference.
- **Action:** Before writing or revising any OpenAPI/AsyncAPI spec, query the relevant Context7 library for the specific construct (e.g., "webhook callback object", "channel bindings for Kafka"). This ensures specs follow the latest official patterns rather than relying on stale training data.

## LRN-015 (2026-02-15)
- **Category:** Tooling / Context7 Quality & Trust
- **Context:** Investigated how Context7 calculates its Benchmark Score and Source Reputation metrics.
- **Learning:** Context7 scores are **empirically tested**, not self-reported. Process: (1) 80+ real coding questions run through Claude Haiku simulating actual developer sessions, (2) Claude Sonnet evaluates helpfulness/relevance on a 1-10 scale, (3) aggregate becomes the 0-100 benchmark score. Source Reputation (High/Medium/Low) reflects authority of the source. Premium jury models (Claude Opus, Gemini Pro) periodically re-score and adjust weights. This means Context7 is a reliable, tested reference — prefer it over web searches for library documentation when a high-scoring library is available.
- **Action:** When choosing between Context7 libraries for the same topic, prioritize by: (1) Source Reputation = High, (2) higher Benchmark Score, (3) higher snippet count for broader coverage. Trust scores >= 75 as strong references.

## LRN-016 (2026-02-15)
- **Category:** Tooling / Context7 Libraries for Implementation
- **Context:** Checked Context7 availability for EventCatalog, Astro, and React Flow — all key technologies for the drone-web project's implementation phase.
- **Learning:** Context7 has excellent coverage for our implementation stack:
  - **EventCatalog:** `/websites/eventcatalog_dev` (2,271 snippets, High rep, score 74.5) — event-driven architecture documentation tool. EventCatalog is Astro-based, supports domains, services, messages, schemas, diagrams, and AI integration. Aligns with our ADDR async API documentation needs (D-008 decision).
  - **Astro:** `/websites/astro_build_en` (17,075 snippets, High rep, score 84.4) — modern web framework with islands architecture. Massive snippet coverage. Also available: v6-specific at `/websites/v6_astro_build_en` (5,423 snippets, score 82.8).
  - **React Flow:** `/websites/reactflow_dev` (1,113 snippets, High rep, score 79.2) — customizable React component for node-based editors and diagrams. Could power interactive architecture visualizations, event flow diagrams, or pipeline editors.
- **Action:** Query these Context7 libraries when building with EventCatalog, Astro, or React Flow. Use the docs-site libraries (higher snippet count) over source-code libraries for implementation guidance.

## LRN-017 (2026-02-20)
- **Category:** API Design / Examples
- **Context:** OpenAPI specs declared `format: uuid` on ID fields but used human-readable example values like `"prod-001"`. `swagger-cli validate` passed clean. Redocly caught 15+ warnings for example/schema mismatch, plus missing required fields in nested examples.
- **Learning:** When declaring a `format` constraint (uuid, date-time, uri, email, etc.), examples **must** use values that conform to that format. Decide the ID format strategy (UUID vs slug vs composite) **before** writing examples, not after. Also: nested/inline examples must include all `required` properties from the referenced schema — it's easy to omit fields like `productId` on sub-resources when the ID feels implied by context.
- **Action:** At the start of Refine phase, establish an ID format convention (which entities get UUIDs, which get slugs) and create a mapping table. Reference the table when writing all examples. Run `redocly lint` after each spec file is written, not just at the end.
