# JTBD Drone Web Copy

This folder contains JTBD Drone Web copies of files from the source corpus.

## Policy

- Keep source files untouched in their source location.
- Preserve file/folder parity in `Specs/Case/JTBD/`.
- Replace source-specific identifiers with mapped target terms.
- Target-domain wording is allowed (including drone-domain terms).

## Canonical Placeholder Tokens

- `source-persona-name`
- `source-organization-name`
- `source-system-name`
- `source-business-unit-name`
- `source-portfolio-name`

## Approved Mapping Dictionary

### Personal names

| Source | Replacement |
|---|---|
| `source-persona-name-1` | `Elena Kovacs` |
| `source-persona-name-2` | `Jonas Varga` |
| `source-persona-name-3` | `Mira Petrovic` |
| `source-persona-name-4` | `Nadia Rahman` |
| `source-persona-name-5` | `Tomasz Zielinski` |
| `source-persona-name-6` | `Markus Neumann` |
| `source-persona-name-7` | `Wei Chen` |
| `source-persona-name-8` | `Agnes Novak` |
| `source-persona-name-9` | `Martin Kova` |

### Organization and systems

| Source concept | Replacement |
|---|---|
| `source-organization-name` | `AeroDynamics Corp` |
| `source-delivery-partner` | `Delivery Partner` |
| `source-system-name-erp` | `Core ERP` |
| `source-system-name-pim` | `Flight Data Hub` |
| `source-system-name-syndication` | `Channel Syndication Platform` |
| `source-system-name-warehouse` | `Analytics Warehouse` |
| `source-system-name-docrepo` | `Document Repository` |
| `source-system-name-bi` | `BI Dashboard` |

### Business units and portfolios

| Source concept | Replacement |
|---|---|
| `source-business-unit-name-1` | `Enterprise Mission Platforms` |
| `source-business-unit-name-2` | `Infrastructure Inspection Division` |
| `source-business-unit-name-3` | `Airframe Portfolio Management` |
| `source-portfolio-name-1` | `Falcon Enterprise Series` |
| `source-portfolio-name-2` | `Hawk Compact Series` |
| `source-portfolio-name-3` | `Sentinel Response Portfolio` |

## Validation Rules

- Every source markdown file must have a mirrored target markdown file.
- Run residual scans for source-case identifiers after updates.
- Keep mapping stable across all files (no alternate replacements for same source concept).

