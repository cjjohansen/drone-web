# Agent Skills Specification

> Reference copy from [agentskills.io/specification](https://agentskills.io/specification)

## Directory Structure

A skill is a directory containing at minimum a `SKILL.md` file:

```
skill-name/
└── SKILL.md          # Required
```

Optional directories: `scripts/`, `references/`, `assets/`

## SKILL.md Format

### Frontmatter (required)

```yaml
---
name: skill-name
description: A description of what this skill does and when to use it.
---
```

With optional fields:

```yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents.
license: Apache-2.0
metadata:
  author: example-org
  version: "1.0"
---
```

| Field | Required | Constraints |
|-------|----------|-------------|
| `name` | Yes | Max 64 chars. Lowercase letters, numbers, hyphens only. Must not start/end with hyphen. Must match parent directory name. |
| `description` | Yes | Max 1024 chars. Non-empty. Describes what the skill does and when to use it. |
| `license` | No | License name or reference to a bundled license file. |
| `compatibility` | No | Max 500 chars. Environment requirements (product, packages, network). |
| `metadata` | No | Arbitrary key-value mapping for additional metadata. |
| `allowed-tools` | No | Space-delimited list of pre-approved tools. (Experimental) |

### Name Rules

- 1-64 characters
- Unicode lowercase alphanumeric and hyphens only (`a-z`, `0-9`, `-`)
- Must not start or end with `-`
- Must not contain consecutive hyphens (`--`)
- Must match the parent directory name

### Description Best Practices

- Write in third person
- Be specific and include trigger terms
- Include both WHAT (capabilities) and WHEN (trigger scenarios)

Good: `"Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction."`

Bad: `"Helps with PDFs."`

### Body Content

Markdown body after frontmatter contains skill instructions. No format restrictions. Recommended sections:

- Step-by-step instructions
- Examples of inputs and outputs
- Common edge cases

## Progressive Disclosure

Skills are loaded in stages for efficient context use:

1. **Metadata** (~100 tokens): `name` and `description` loaded at startup for all skills
2. **Instructions** (< 5000 tokens recommended): Full `SKILL.md` body loaded when skill is activated
3. **Resources** (as needed): Files in `scripts/`, `references/`, `assets/` loaded only when required

Keep main `SKILL.md` under **500 lines**. Move detailed reference material to separate files.

## File References

Use relative paths from the skill root:

```markdown
See [the reference guide](references/REFERENCE.md) for details.
Run: scripts/extract.py
```

Keep file references **one level deep** from SKILL.md. Avoid deeply nested reference chains.

## Key Authoring Principles

1. **Concise is key** — the agent is smart; only add context it doesn't already have
2. **Under 500 lines** for SKILL.md
3. **Progressive disclosure** — essentials in SKILL.md, details in reference files
4. **Appropriate freedom** — match specificity to task fragility

## Common Patterns

- **Template pattern**: Provide output format templates
- **Examples pattern**: Show concrete input/output pairs
- **Workflow pattern**: Break into clear steps with checklists
- **Conditional workflow**: Guide through decision points
- **Feedback loop**: Validate after each step

## Anti-Patterns

- Windows-style paths (`scripts\helper.py`) — use forward slashes
- Too many options without a clear default
- Time-sensitive information
- Inconsistent terminology
- Vague skill names (`helper`, `utils`)

## Validation

Use the [skills-ref](https://github.com/agentskills/agentskills/tree/main/skills-ref) library:

```bash
skills-ref validate ./my-skill
```
