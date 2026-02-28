# DATA MAINTAINER

### Profile

| Field | Value |
|-------|-------|
| **Name:** | Agnes Novak |
| **Role:** | Data Maintainer, Scrum master |
| **Unit:** | Infrastructure Inspection Division |

### About Me
A data maintainer working across governance and configuration to harmonize product data across Core ERP and Flight Data Hub. She spends significant time resolving inconsistencies, but low transparency and manual workflows make difficult readiness.

### Usage Patterns
Envisions control center usage as the primary application for reviewing, correcting, and harmonizing product data.

### Top Motivators
Transparency across systems, accuracy & harmonization, automation & governance, reducing manual overviews and rework

### Top Frustrations
Core ERP ↔ Flight Data Hub mismatches, mobile "translation layer" is invisible, manual Excel-based comparisons, no automatic quality checks, too many tools required for basic validation

---

### Main Interview HIGHLIGHTS

- Strong need for **transparency of data flow Core ERP → translation layer → Flight Data Hub** → Control Center.
- Desire for **multi-family comparison** and **multi-filter capabilities**.
- Wants the control center to become the **primary application** for reviewing, correcting, and approving product data.
- Vision: **automatic health checks, warnings, governance, BI-like usage analytics**.
- High manual work today across Core ERP, Excel, Flight Data Hub, visualization tools → wants consolidation.
- Sees control center as **central database for data + 3D/CAD/BIM/media assets**.
- Major business impact: reduce delays (currently "3 months") caused by Flight Data Hub dependencies.

---

### Main PAIN POINTS

#### Data Transparency & Source Confusion
- Cannot understand which data is manual/automated.
- Cannot see where characteristics originate, nor the "translation layer."

#### Core ERP ↔ Flight Data Hub Inconsistencies
- Frequent mismatches between Core ERP data and Flight Data Hub data.
- Errors require multiple rounds with Flight Data Hub to detect which system is wrong.

#### Manual, labor-intensive workflows
- Must overlay large extracted datasets manually to understand gaps.
- Curve data requires multi-step manual extraction and comparison.
- BIM/CAD/visualization views require multiple separate tools and folder searches.

#### Control Center limitations (current version)
- Only one product family visible at a time.
- Missing multi-filtering.
- Some displayed errors are false positives (e.g., drawings "missing").

#### Data versioning issues
- When Flight Data Hub reverts to old versions, data is lost.
- No clear overview of actual state across Core ERP vs. Flight Data Hub.

#### No automation for detecting issues
- No systematic notifications about incorrect, missing, or inconsistent data.

---

### Main NEEDS

| Need |
|------|
| **Full transparency** of data origin, transformations, Core ERP ↔ Flight Data Hub differences, what's missing / broken. |
| **Multi-family / multi-filter analysis** to compare 2–3+ families at once. |
| **Automatic health insights**: gaps, illogical values, missing attributes, version mismatches. |
| **Clear governance & ownership**: who approves, who corrects, who owns data. |
| **Automation of models/drawings** (CAD/BIM/exploded views). |
| **Central source for all data + visual assets.** |
| **Usage analytics** to track external product documentation consumption. |
| **Streamlined corrections** → ability to fix or approve directly in Control Center. |

---

### JOBS TO BE DONE

#### 🔍 Theme: Data Validation & Quality Assurance

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 1 — Data Transparency** | reviewing or harmonizing product data, | to clearly see where each characteristic comes from and how it's transformed, | I can quickly understand mismatches and fix issues without multiple investigation rounds. |
| **JTBD 3 — Data quality checks** | maintaining product data, | the control center to automatically detect missing, inconsistent, or illogical data, | I can correct issues proactively and avoid late-stage product delays. |
| **JTBD 4 — Core ERP ↔ Flight Data Hub alignment** | validating product data, | the control center to show me differences between Core ERP and Flight Data Hub, | I always know which system holds the correct values and where errors originate. |
| **JTBD 7 — Product health overview** | opening the control center, | an immediate overview of product health (completeness, accuracy, changes, gaps), | I know where to focus efforts right away. |

#### 📊 Theme: Comparison & Consistency

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 2 — Multi-family comparison** | harmonizing across product families, | to compare multiple families and their attributes side-by-side, | I can identify gaps, inconsistencies, and opportunities to harmonize data. |

#### ⚙️ Theme: Process & Role Efficiency

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 5 — Automating updates of models and drawings** | a product is updated, | BIM, CAD, and exploded drawings to update automatically, | I don't need to manually recreate or search for new versions in multiple tools. |
| **JTBD 6 — Streamlined corrections** | I detect an issue in control center, | to approve/correct it directly and automatically notify Core ERP or the data maintainer, | corrections flow seamlessly back into the source system. |
| **JTBD 9 — Shared responsibility** | maintaining product data across departments, | clear ownership layers, | maintaining data quality becomes a joint responsibility instead of falling on one team. |

#### 📈 Theme: Insights

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 8 — Usage insights** | evaluating product documentation relevance, | to see how often assets are accessed or downloaded, | I understand customer demand and quality expectations. |
