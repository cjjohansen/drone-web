# Product Specialist Persona

---

## Profile

| Field | Value |
|-------|-------|
| **Name:** | Jonas Varga |
| **Role:** | Product Specialist |
| **Unit:** | Infrastructure Inspection Division |

### About Me

A senior product specialist responsible for ensuring product data correctness and documentation before and after updates. He struggles with slow systems, miscommunication, and limited visibility into changes — causing rework and delays.

### Usage Patterns

Infrequently but relies on it heavily during validation peaks.

### Top Motivators
Clear visibility, correctness, speed, avoiding rework

### Top Frustrations
Miscommunication, slow systems, late discovery of issues

---

## Main Interview HIGHLIGHTS

- Miscommunication is the biggest recurring issue.
- Validation and checking data (documentation, I&O, publication status) is the primary control center value.
- AeroDynamics Corp checking is slow and cumbersome — control center can make checks easier.
- Wants visibility on whether updates actually reached the right products.
- Rarely needs to use the control center unless something changes.
- Interested in change-tracking (color map) for unexpected modifications.
- AI powered check to detect anomalies in data would be useful.
- Uses Adobe Analytics daily to understand user search behavior; finds this very valuable.

---

## Main PAIN POINTS

### 1. Miscommunication across PD, GBC, and other stakeholders
- Leads to rework, delays, and he "gets pulled in every time."
- People not following established processes when making changes.

### 2. Poor visibility into changes
- Changes (e.g., curves) made without his team being informed.
- Only discovered after some time — creates "a hell of a mess."

### 3. Slow and inefficient tools for checking product data
- AeroDynamics Corp slow, complex, not good for broad checks.
- Caps CMS outdated and not easy for validation.

### 4. Role/accountability issues
- "Everyone is accountable → no one is accountable."
- Missing clear product management ownership.

---

## Main NEEDS

| Need | Description |
|------|-------------|
| **Verify data quickly** | Need to verify data quickly after updates, without navigating slow systems. |
| **Full overview** | Need full overview of all required documentation elements. |
| **Change awareness** | Need to know when something has changed, preferably through awareness and process adherence, not only tooling. |
| **Self-service for PD** | Need PD to be able to do more themselves, reducing dependency and miscommunication. |
| **Reliable validation** | Need faster, more reliable validation workflows. |
| **Avoid coordination overhead** | Need to avoid being pulled into coordination issues. |

---

## JOBS TO BE DONE

### 🔍 Theme: Data Validation & Quality Assurance

#### JTBD 1 — Validate product data after updates
| Element | Description |
|---------|-------------|
| **When** | we update product data (e.g., I&O manuals, documentation packages...), |
| **I want** | to quickly check whether the updates reached all intended products, |
| **so that** | we avoid discovering issues only when customers complain. |

#### JTBD 2 — Perform broad product data checks efficiently
| Element | Description |
|---------|-------------|
| **When** | I need to verify documentation or data for many products, |
| **I want** | a fast tool that gives me an overview, |
| **so that** | I don't have to navigate sluggish systems like AeroDynamics Corp. |

#### JTBD 5 — Confirm product has correct public-facing data before launch
| Element | Description |
|---------|-------------|
| **When** | launching new products, |
| **I want** | to ensure all data is correct, relevant, and in a format AeroDynamics Corp can use, |
| **so that** | customers can identify the right product and get proper documentation. |

#### JTBD 6 — AI empowered data optimisation
| Element | Description |
|---------|-------------|
| **When** | I'm responsible for validating and improving product data, |
| **I want** | AI to surface unusual values, missing elements, and deviations from expected patterns, |
| **so that** | I can focus my time on resolving issues rather than searching for them. |

---

### 👁️ Theme: Change Awareness & Control

#### JTBD 3 — Identify unexpected changes
| Element | Description |
|---------|-------------|
| **When** | colleagues make changes to data without following processes, |
| **I want** | to see immediately what changed, |
| **so that** | I can address issues before they create a mess. |

---

### ⚙️ Theme: Process & Role Efficiency

#### JTBD 4 — Reduce dependency on others during validation
| Element | Description |
|---------|-------------|
| **When** | product data needs to be validated, |
| **I want** | PD to be able to do more themselves, |
| **so that** | there are fewer handovers and fewer communication failures. |

---

## Summary: Needs → Jobs Mapping

```
Main NEEDS                                          JOBS TO BE DONE
─────────────────────────────────────────────────────────────────────────────
Verify data quickly ──────────────────────────────► JTBD 1, JTBD 2
Full overview ────────────────────────────────────► JTBD 2, JTBD 5
Know when something changed ──────────────────────► JTBD 3
PD self-service ──────────────────────────────────► JTBD 4
Faster validation workflows ──────────────────────► JTBD 1, JTBD 2, JTBD 6
Avoid coordination issues ────────────────────────► JTBD 4
```

---

## Key Control Center Features Implied

| Feature | Supports JTBD |
|---------|---------------|
| Quick data validation dashboard | 1, 2 |
| Documentation completeness checker | 2, 5 |
| Change tracking / color-coded diff view | 3 |
| AI-powered anomaly detection | 6 |
| Self-service tools for PD teams | 4 |
| Pre-launch checklist / readiness view | 5 |