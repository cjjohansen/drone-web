# Product Control Center Personas - Complete Summary

---

## 1. DATA MAINTAINER

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

---

## 2. industry taxonomy SPECIALIST

### Profile

| Field | Value |
|-------|-------|
| **Name:** | Wei Chen |
| **Role:** | Taxonomy Specialist |

### About Me
An industry taxonomy specialist responsible for connecting AeroDynamics Corp product data to the industry taxonomy standard standard and delivering industry taxonomy data to external online portals. He works on industry taxonomy data setup, transformation, and delivery using Core ERP-sourced data, neutral data models, and mapping layers, but is not responsible for the raw source data itself.

### Usage Patterns
Prefers being notified by the control center when an action is needed. Uses industry taxonomy dashboards and reports **regularly** to monitor data completeness and delivery results.

### Top Motivators
Clear visibility into industry taxonomy data completeness, ability to identify exactly where data issues occur in the data chain, faster issue resolution, step-by-step transparency of data transformations, automatic notifications when completeness drops below target, stronger data governance at source

### Top Frustrations
No visibility into where errors occur in the data chain, need to manually investigate every transformation step, errors only visible at final output, complex and long data flows, source data quality issues making industry taxonomy mapping harder, unclear responsibility when data is missing

---

### Main Interview HIGHLIGHTS

- Deep involvement in **industry taxonomy standard data transformation and delivery**.
- Works across a **long, multi-step data pipeline** (Core ERP → Analytics Warehouse → neutral model → industry taxonomy mapping → XML → CSV → BI Dashboard).
- Has built **custom dashboards** to compensate for lack of visibility in the current setup.
- Primary value expectation from the control center is **end-to-end transparency** of data processing steps.
- Strong focus on **data completeness, data quality, and traceability**.
- Sees clear potential for **automation, notifications, and AI support**, especially in governance and mapping.

---

### Main PAIN POINTS

- **No visibility into where errors occur** in the data chain.
- Must manually investigate **every step** when data is missing.
- Errors can originate in multiple places:
  - Core ERP extraction
  - Neutral model
  - Mapping layer
- Data issues are only visible at the **final output**, not earlier.
- Complex workaround needed to make data consumable (XML → CSV → BI Dashboard).
- Source data quality issues make mapping significantly harder.

---

### Main NEEDS

| Need |
|------|
| Clear, step-by-step **data lineage and status visibility**. |
| Ability to see **which transformation step failed**. |
| Clear indication of **who is responsible** for fixing an issue. |
| **industry taxonomy-specific control center views** (not mixed with other topics). |
| Filters by **industry taxonomy class / product group**. |
| Data completeness tracking with **configurable targets**. |
| Automatic **notifications** when completeness drops below target. |
| Historical view of data completeness trends. |
| Customizable control center views per user. |
| Stronger **data governance at source**, ideally supported by automation or AI. |

---

### JOBS TO BE DONE

#### 🔍 Theme: Data Validation & Quality Assurance

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 1 — Data issue diagnosis** | industry taxonomy data is missing or incorrect at the endpoint, | to immediately see which step in the data chain caused the issue, | I don't have to manually investigate every transformation layer. |
| **JTBD 3 — Data completeness monitoring** | managing industry taxonomy data quality, | to see current and historical completeness levels per class or product, | I can detect drops and trends early. |
| **JTBD 6 — Simplified data governance** | working with complex mappings, | better-governed source data, ideally supported by AI, | mapping and maintenance effort is reduced. |

#### ⚙️ Theme: Process & Role Efficiency

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 2 — Ownership clarity** | a data issue occurs, | to know who is responsible for fixing it, | time is not lost contacting the wrong team. |
| **JTBD 4 — Proactive alerting** | data completeness falls below a defined target, | to receive an automatic notification, | issues are addressed before they escalate. |
| **JTBD 5 — Focused views per role** | different users access the control center, | each of them to see only the data relevant to their responsibility, | the control center supports efficient decision-making. |

---

## 3. GLOBAL PRODUCT MANAGER (Tomasz Zielinski - Falcon Enterprise Series)

### Profile

| Field | Value |
|-------|-------|
| **Name:** | Tomasz Zielinski |
| **Role:** | Global product manager - Falcon Enterprise Series |
| **Unit:** | Enterprise Mission Platforms |

### About Me
A global product manager responsible for delivering correct, consistent product data to customers across regions. He works across Core ERP, Flight Data Hub, and Channel Syndication Platform, but manual corrections, translation issues, and unclear ownership make it hard to deliver accurate data before launch.

### Usage Patterns
Monthly or bi-monthly, mainly to track how customers display AeroDynamics Corp data, check correctness of exported data, validate harmonization of attributes and translations.

### Top Motivators
Delivering correct product data to customers before launch, reducing manual corrections, ensuring products appear consistently on all customer platforms, improving speed to market & customer adoption

### Top Frustrations
Translation errors from Core ERP → Flight Data Hub, many inconsistent attribute definitions across product groups, no visibility of end-to-end data flow, dependence on Flight Data Hub for Channel Syndication Platform delivery, broken image/document delivery for unpublished products

---

### Main Interview HIGHLIGHTS

- Major friction in delivering e-commerce product data through Channel Syndication Platform due to **Flight Data Hub dependencies**.
- Serious **translation inconsistencies** between Core ERP and Flight Data Hub.
- Lack of **harmonized** attribute definitions across product groups and regions.
- No end-to-end visibility of the product data flow, **unclear ownership**.
- Lots of **manual work correcting Flight Data Hub outputs** and preparing data for customers.
- Desire for the control center to act as a:
  - a **harmonization hub**,
  - a **transparency/traceability layer**,
  - and potentially the **data source for Channel Syndication Platform**.
- Long-term wish: control center showing **how customers display AeroDynamics Corp data** on their websites.

---

### Main PAIN POINTS

- **No harmonized attributes** → many ways to define the same attribute.
- **Flight Data Hub translation errors** → double translations, conflicting information.
- **Channel Syndication Platform dependency on "live" Flight Data Hub data** → cannot supply customers with pre-launch data (staging system used as a workaround)
- **Huge manual correction workload** for data quality.
- **Lack of ownership and visibility** of end-to-end product data flow.
- **Delivery of images / documents is broken** (URL links fail before go-live as they point to the live website, and the products are not yet published in Flight Data Hub).
- **Limited visibility into how customers actually use AeroDynamics Corp data.**

---

### Main NEEDS

| Need |
|------|
| **Harmonized**, consistent **global attribute definitions**. |
| **Transparent end-to-end data flow** from Core ERP → Flight Data Hub → Channel Syndication Platform → customer systems. |
| Control Center (or a way) to **deliver data to customers for non published products**. |
| **Automatic correction/prevention** of translation inconsistencies. |
| **Unified place to handle all product-related files** (images, documents, 3D models). |
| Ability to **monitor** how customers display AeroDynamics Corp data. |
| Tools that **reduce manual effort** in review and correction. |
| **Feedback loop** from market on missing/incorrect data. |

---

### JOBS TO BE DONE

#### 🔍 Theme: Data Validation & Quality Assurance

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 1 — Ensure correct data delivery** | launching or maintaining products, | to ensure customers receive correct, consistent, harmonized product data across all channels, | my products are displayed properly and customers can transact easily. |
| **JTBD 3 — Eliminate translation inconsistencies** | managing attributes across regions, | translations and definitions to be consistent across Core ERP, Flight Data Hub, and export systems, | I avoid manual corrections and reduce conflicting information. |
| **JTBD 5 — Gain visibility across the data chain** | working with product data, | visibility into where each attribute comes from, how it is mapped, and where it is used, | I can understand and troubleshoot issues quickly. |
| **JTBD 7 — Deliver product documentation and media reliably** | providing full product content, | to deliver images, documentation, and 3D files reliably, | customers always access complete product content before and after launch. |

#### 📊 Theme: Comparison & Consistency

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 4 — Harmonize attributes across product groups** | defining product attributes, | a single harmonized structure that avoids multiple versions of the same attribute, | Flight Data Hub and customers always receive the right attribute values. |

#### ⚙️ Theme: Process & Role Efficiency

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 2 — Prepare and deliver data before launch** | preparing for product launches, | to deliver product data to customers months in advance, | they can list, promote, and sell products at launch time. |

#### 📈 Theme: Insights

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 6 — Monitor customer data usage** | ensuring product data quality externally, | to see how customers display our data, | I can detect missing or incorrect product listings and address them. |

---

## 4. GLOBAL PRODUCT MANAGER (Markus Neumann - Hawk Compact Series)

### Profile

| Field | Value |
|-------|-------|
| **Name:** | Markus Neumann |
| **Role:** | Global product manager - Hawk Compact Series |

### About Me
A global product manager with end-to-end responsibility for compact drone platform products, working across sales, marketing, pricing, supply chain, production, and product development. He relies on product, pricing, sales, and supply chain data to make strategic and tactical decisions, but is frequently slowed down by fragmented tools, unclear data ownership, and limited visibility into causes behind performance deviations.

### Usage Patterns
Monthly or quarterly for portfolio and product performance review, with situational usage when issues arise or decisions span sales, production, supply chain, and finance.

### Top Motivators
Clear overview of key business and product signals, ability to understand causes and consequences behind performance deviations, early-warning signals for emerging issues, cross-functional and cross-system transparency, confident prioritisation of initiatives across products and markets

### Top Frustrations
Data scattered across many systems and reports, complex and unintuitive tools, heavy manual filtering and Excel work, lack of transparency into root causes (e.g. lead times), unclear data ownership and governance, slow global coordination loops

---

### Main Interview HIGHLIGHTS

- End-to-end product manager with broad business responsibility.
- Heavy reliance on product, pricing, sales, and supply chain data.
- Frustration with fragmented tools and unclear ownership.
- Needs insight into **causes and consequences**, not just metrics.
- Operates on strategic and tactical time horizons, not daily monitoring.
- Sees high value in cross-functional, cross-system transparency.

---

### Main PAIN POINTS

- Data scattered across many systems and reports.
- Tools are complex, unintuitive, and frequently changing.
- Heavy manual filtering and Excel work.
- Lack of transparency into root causes (e.g. lead times).
- Unclear ownership for maintaining product data.
- Global collaboration causes long delays.
- Risk of acting too late due to missing insights.

---

### Main NEEDS

| Need |
|------|
| **Single point of access** to **product** and **business data**. |
| Flexible, **intuitive** exploration of data. |
| Ability to combine **technical** and **commercial** data. |
| **Root-cause visibility**, not just KPIs. |
| **Scenario comparison** and **consequence** awareness. |
| Early-warning signals for **emerging issues**. |
| Clear data **ownership** and **governance**. |

---

### JOBS TO BE DONE

#### ⚙️ Theme: Process & Role Efficiency

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 4 — Cross-functional alignment** | decisions span sales, production, supply chain, and finance, | shared, consistent data and transparency, | discussions are fact-based. |
| **JTBD 5 — Reducing dependency on others** | I need information that currently requires contacting multiple teams, | enough transparency to answer basic questions myself, | small clarifications don't turn into long global coordination loops. |
| **JTBD 6 — Trusting and governing the data** | I rely on product data for decisions, | clear ownership, governance, and confidence in data correctness, | missing or wrong data does not undermine decisions. |

#### 📈 Theme: Insights

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 1 — Decision support** | I oversee multiple products across markets and lifecycle stages, | a clear overview of key signals (sales, margins, quality, lead times), | I can quickly decide what deserves attention and what does not. |
| **JTBD 2 — Root-cause understanding** | performance deviates from targets (e.g., margins, lead times, delivery), | to see the main reasons behind the deviation, | I can act on causes rather than just observe KPIs. |
| **JTBD 3 — Prioritisation** | many potential initiatives compete for attention, | early signals and comparable insights across products and markets, | I know what to prioritize. |

---

## 5. PRODUCT SPECIALIST (Jonas Varga - Infrastructure Inspection Division)

### Profile

| Field | Value |
|-------|-------|
| **Name:** | Jonas Varga |
| **Role:** | Product specialist |
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

### Main Interview HIGHLIGHTS

- Miscommunication is the biggest recurring issue.
- Validation and checking data (documentation, I&O, publication status) is the primary control center value.
- AeroDynamics Corp checking is slow and cumbersome — control center can make checks easier.
- Wants visibility on whether updates actually reached the right products.
- Rarely needs to use the control center unless something changes.
- Interested in change-tracking (color map) for unexpected modifications.
- AI powered check to detect anomalies in data would be useful.
- Uses Adobe Analytics daily to understand user search behavior; finds this very valuable.

---

### Main PAIN POINTS

#### Miscommunication across PD, GBC, and other stakeholders
- Leads to rework, delays, and he "gets pulled in every time."
- People not following established processes when making changes.

#### Poor visibility into changes
- Changes (e.g., curves) made without his team being informed.
- Only discovered after some time — creates "a hell of a mess."

#### Slow and inefficient tools for checking product data
- AeroDynamics Corp slow, complex, not good for broad checks.
- Caps CMS outdated and not easy for validation.

#### Role/accountability issues
- "Everyone is accountable → no one is accountable."
- Missing clear product management ownership.

---

### Main NEEDS

| Need |
|------|
| **Verify data quickly** after updates, without navigating slow systems. |
| **Full overview** of all required documentation elements. |
| **Know when something has changed**, preferably through awareness and process adherence, not only tooling. |
| **PD to be able to do more themselves**, reducing dependency and miscommunication. |
| **Faster, more reliable validation workflows.** |
| **Avoid being pulled into coordination issues.** |

---

### JOBS TO BE DONE

#### 🔍 Theme: Data Validation & Quality Assurance

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 1 — Validate product data after updates** | we update product data (e.g., I&O manuals, documentation packages...), | to quickly check whether the updates reached all intended products, | we avoid discovering issues only when customers complain. |
| **JTBD 2 — Perform broad product data checks efficiently** | I need to verify documentation or data for many products, | a fast tool that gives me an overview, | I don't have to navigate sluggish systems like AeroDynamics Corp. |
| **JTBD 5 — Confirm product has correct public-facing data before launch** | launching new products, | to ensure all data is correct, relevant, and in a format AeroDynamics Corp can use, | customers can identify the right product and get proper documentation. |
| **JTBD 6 — AI empowered data optimisation** | I'm responsible for validating and improving product data, | AI to surface unusual values, missing elements, and deviations from expected patterns, | I can focus my time on resolving issues rather than searching for them. |

#### 👁️ Theme: Change Awareness & Control

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 3 — Identify unexpected changes** | colleagues make changes to data without following processes, | to see immediately what changed, | I can address issues before they create a mess. |

#### ⚙️ Theme: Process & Role Efficiency

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 4 — Reduce dependency on others during validation** | product data needs to be validated, | PD to be able to do more themselves, | there are fewer handovers and fewer communication failures. |

---

## 6. PRODUCT SPECIALIST (Mira Petrovic - Sentinel Response Portfolio)

### Profile

| Field | Value |
|-------|-------|
| **Name:** | Mira Petrovic |
| **Role:** | Product Specialist – Sentinel Response Portfolio |
| **Unit:** | Airframe Portfolio Management |

### About Me
A product specialist responsible for ensuring that customer-visible product information is correct, consistent, and ready for market release. She works across global and local teams and depends on timely data availability, but often encounters unclear responsibilities, inconsistent processes, and slow validation steps, which lead to delays and repeated rework.

### Usage Patterns
Most often during pre-release phases, phase out and general updates.

### Top Motivators
Accuracy, consistency, immediate visibility, clear ownership

### Top Frustrations
Unclear processes, waiting for Flight Data Hub uploads, inconsistent terminology, lack of transparency

---

### Main Interview HIGHLIGHTS

- Very strong focus on **quality of customer-visible data** (text, curves, specifications).
- Control Center seen as a major opportunity for **transparency + completeness checking**.
- Wants control center to provide **immediate visibility** after Core ERP creation — no waiting for Flight Data Hub team.
- High appreciation for ability to **compare products, find missing data quickly, and view across countries**.
- Clear insight that **process ownership and documentation are unclear today**.
- Repeated emphasis on **intuitive, simple UI and consistent terminology**.

---

### Main PAIN POINTS

- **Lack of transparency**: cannot see who owns what; unclear responsibilities.
- **Unclear or undocumented processes**: much knowledge in people's heads.
- **Waiting times**: dependent on Flight Data Hub team uploading to sandbox.
- **Manual and inconsistent data creation** (text formatting rules, naming conventions).
- **Errors across local/global sites** with no clear owner to fix them.
- **Difficult Flight Data Hub documentation**: hard to read, from Flight Data Hub perspective only.
- **Translation inconsistencies + missing process for updates**.
- **Hard for newcomers** to understand process, roles, responsibilities.

---

### Main NEEDS

| Need |
|------|
| A **clear, simple overview** of product readiness and missing data. |
| **Immediate visibility of data** after Core ERP creation—independent of Flight Data Hub team. |
| Ability to **see how product data appears globally and locally**. |
| **One place** to understand and trigger who should fix data issues. |
| **Guidelines and consistent rules** for text, naming, specs. |
| **Comparison capabilities** across product generations and families. |
| Improved **process documentation** and transparency of responsibilities. |
| **Translation management support** with correct terminology. |

---

### JOBS TO BE DONE

#### 🔍 Theme: Data Validation & Quality Assurance

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 1 — Identify Missing or Incorrect Data Early** | preparing a product release, | to instantly see which data elements are missing or inconsistent, | I can fix issues early without waiting for the Flight Data Hub sandbox or manual updates. |
| **JTBD 2 — Ensure Customer-Visible Data Quality** | validating product data, | a clear view of exactly how text, curves, specifications, and images will appear to customers across all regions, | I can ensure the highest quality and avoid any visible mistakes. |
| **JTBD 5 — View Product Data Across Countries** | reviewing global product availability, | to see how each product number appears on international and local sites, | I can ensure consistency and quality across all markets. |
| **JTBD 7 — Visibility of changes/updates to Flight Data Hub** | I make changes or new updates to products, | know when updates are visible in Flight Data Hub, | I do now waste time checking in Flight Data Hub. |

#### 📊 Theme: Comparison & Consistency

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 3 — Compare Product Versions and Attributes** | releasing updated or new products, | to compare specifications and attributes with previous versions or similar families, | I can easily spot differences and ensure consistency. |
| **JTBD 6 — Maintain Consistent Terminology and Translations** | preparing customer-facing text, | to ensure correct terminology and translations, | all markets display coherent and professional product information. |

#### ⚙️ Theme: Process & Role Efficiency

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 4 — Navigate Ownership and Trigger Corrections** | I identify an issue in product data, | to immediately see who is responsible and trigger the correct workflow, | I don't waste time searching for the right person or raising misrouted tickets. |

---

## 7. PRODUCT SPECIALIST (Nadia Rahman - Enterprise Mission Platforms)

### Profile

| Field | Value |
|-------|-------|
| **Name:** | Nadia Rahman |
| **Role:** | Product Specialist |
| **Unit:** | Enterprise Mission Platforms |

### About Me
A product specialist for enterprise drone platform products, responsible for approving how products are presented in Flight Data Hub. She defines which characteristics are required per product, ensures specifications, curves, drawings, and engineering data are correct, and approves all data before it is made available to customers and sales teams.

### Usage Patterns
Mostly during **product launches**, **product updates**, and **variant creation**; relies on **notifications and alerts** rather than daily or continuous control center monitoring.

### Top Motivators
Ensuring customer-facing data in Flight Data Hub is correct and up to date, preventing incorrect or inconsistent data from reaching customers and sales, automated detection and notifications instead of manual monitoring, governed and validated characteristics, clean and up-to-date documents visible to customers, strong online product presentation

### Top Frustrations
Incorrect data caused by manual Core ERP input, manual work during release gaps (TP4 vs Flight Data Hub availability), lack of automatic alerts when data becomes outdated or incomplete, too many outdated or duplicate documents visible to customers, inconsistent data entry due to ungoverned fields, limited time to manually monitor products, manual rework during updates and market releases

---

### Main Interview HIGHLIGHTS

- Strong preference for **single-source, automated data flow** from Core ERP to Flight Data Hub.
- High awareness of customer impact when data or documentation is inconsistent.
- Frequent product updates and variants increase data maintenance complexity.
- Clear interest in **automation, validation, and notifications** rather than manual monitoring.
- Sees control center value mainly in **oversight, alerts, and prioritization**, not daily usage.

---

### Main PAIN POINTS

- Incorrect data caused by manual Core ERP input.
- Manual work during release gaps (TP4 vs Flight Data Hub availability).
- Lack of automatic alerts when data becomes outdated or incomplete.
- Too many outdated or duplicate documents visible to customers.
- Missing governed/validated fields leading to inconsistent data entry.
- Limited time to manually monitor control center across many products.
- Complexity of global vs local (country/language/legislation) requirements.

---

### Main NEEDS

| Need |
|------|
| **Automated detection** of missing, outdated, or inconsistent data. |
| **Governed and validated characteristics** to prevent wrong inputs. |
| Clear **completeness indicators** (e.g. % ready per product). |
| **Notification-driven workflow** instead of manual checks. |
| Better **synchronization across Core ERP, Flight Data Hub, online channels, and price lists**. |
| Cleaner **document lifecycle management** (only latest versions visible). |
| Support for **country-specific variants**, images, and front covers. |
| **Role and product specific** control center views and sessions. |

---

### JOBS TO BE DONE

#### 🔍 Theme: Data Validation & Quality Assurance

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 1 — Data completeness awareness** | managing multiple products, | to see a clear completeness status per product, | I know whether my data is ready without manually checking everything. |
| **JTBD 3 — Error prevention at source** | entering or updating data in Core ERP, | governed and validated fields, | incorrect or inconsistent data cannot be entered in the first place. |
| **JTBD 5 — Customer-facing data excellence** | customers and sales teams use Flight Data Hub, | them to see only the most relevant, updated, and correct content, | AeroDynamics Corp products are easier to understand and choose. |

#### ⚙️ Theme: Process & Role Efficiency

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 2 — Proactive data quality control** | product characteristics change or become outdated, | to be automatically notified, | I can correct issues before customers or sales teams are affected. |
| **JTBD 4 — Release and variant management** | launching or updating products across markets, | data to be prepared once and released at different times, | I avoid rework and inconsistencies. |
| **JTBD 6 — Exception-driven control center usage** | I am busy with commercial and launch activities, | the control center to alert me only when action is needed, | I don't have to spend time monitoring it manually. |

---

## 8. WHOLESALE REPRESENTATIVE

### Profile

| Field | Value |
|-------|-------|
| **Name:** | Elena Kovacs |
| **Role:** | Channel Representative (Pricing & Conditions Coordinator) |

### About Me
A wholesale representative responsible for delivering complete, country-specific product data packages to customers. She aggregates data from many internal systems and teams and pushes it to customers via Channel Syndication Platform. Missing data, poor quality, and unclear ownership force her to constantly chase people, slowing launches and directly impacting sales.

### Usage Patterns
At minimum **once per month**, and more often during **product launches or sales policy changes**.

### Top Motivators
Having complete data available to share, one place to find everything, speed & simplicity, transparency and availability of product data, automated data delivery to customers/channel partners, improving ability to sell products via channel partners

### Top Frustrations
Missing data across systems, poor data quality, unclear roles and responsibilities for data ownership, no single source of truth, slow and manual launch processes, constant justification of why customer data is needed, competitors outperforming digitally

---

### Main Interview HIGHLIGHTS

- They maintain **73+ data fields per country** and must gather info from Core ERP, Flight Data Hub, PIM Platform, Excel, Document Repository, BI Dashboard.
- Massive pain around **missing data**, **poor quality**, **broken links**, **low-quality media**, and **regulatory certificates**.
- **No ownership**: unclear roles, unclear data responsibility, no top-down launch communication.
- They spend huge time **chasing people**, often needing to justify why data is required.
- Desire for **one single place** to view, validate, and collect all data.
- High business impact: poor data reduces the ability to sell products, especially via channel partners.
- Strong wish for control center features: **scorecards, red flags, responsibility mapping, API to customers, data lifecycle (including EOL)**.
- AI desired for text quality checks.

---

### Main PAIN POINTS

- **Data missing** (quantity problem) across many systems.
- **Poor data quality** (nonsensical descriptions, broken links, low-quality pictures).
- **Unclear roles & responsibilities** for who owns which data.
- **Need to chase 300+ potential product owners**; difficult to identify correct person.
- **No single source of truth** → must check Core ERP, Flight Data Hub, PIM Platform manually.
- **Phase-out data disappears**, but channel partners still need it.
- **Slow, manual processes for launches** — must send multiple reminders.
- **Justification fatigue** — constantly explaining why customers need data.
- **Competitors outperform digitally**, impacting sales.

---

### Main NEEDS

| Need |
|------|
| **One platform aggregating all product data** from all systems. |
| **Automated detection** of missing or incorrect data. |
| Clear mapping of **responsible person for each data field**. |
| A **control center scorecard** (A–F, needle, red flags). |
| **API for customers to consume data directly**. |
| Ability to manage data for **entire product lifecycle**, including end-of-life products. |
| **High-quality media & certificate information**. |
| **Faster, simpler processes** that remove manual chasing. |
| **AI for validating text quality**. |

---

### JOBS TO BE DONE

#### 🔍 Theme: Data Validation & Quality Assurance

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 1 — Multi-source data visibility** | preparing customer data packages, | to access all product information from all systems in one place, | I don't need to search across Core ERP, Flight Data Hub, PIM Platform, Excel, and Document Repository. |
| **JTBD 3 — Automated data quality assurance** | preparing product information for customers, | the control center to flag broken links, poor-quality images, invalid certificates, or nonsensical text, | I can provide correct, meaningful, high-quality data. |
| **JTBD 8 — Text clarity validation (AI)** | product text is entered, | AI to validate whether the sentence makes sense, | incorrect or unclear descriptions are not provided to customers. |
| **JTBD 9 — Performance overview** | opening the control center, | to immediately see a scorecard of data completeness & quality by division and part number, | I know where issues exist and where to act first. |

#### ⚙️ Theme: Process & Role Efficiency

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 2 — Data completeness control** | verifying data for a country, | to immediately see which required fields are missing and who is responsible, | I can resolve gaps quickly without chasing many people. |
| **JTBD 4 — Role clarity & workflow triggering** | missing data is identified, | the control center to automatically notify the responsible owner, | I do not have to justify requests or manually follow up. |
| **JTBD 5 — Support product launches (top-down)** | new products are launched, | to receive complete PN lists and data proactively in the control center, | I don't need to request information repeatedly. |
| **JTBD 6 — Lifecycle data management** | products reach end-of-life, | the control center to maintain all product information, | partner ERPs and traders can still rely on accurate data. |

#### 🌐 Theme: External Data Delivery

| JTBD | When | I want | So that |
|------|------|--------|---------|
| **JTBD 7 — Customer data delivery** | customers require product data, | them to retrieve it automatically through an API, | I no longer need to manually produce Excel exports. |

---

## Cross-Persona Summary

### Common Pain Points Across All Personas

| Pain Point | Affected Roles |
|------------|----------------|
| **No transparency / visibility** into data flow and transformations | All |
| **Core ERP ↔ Flight Data Hub mismatches and inconsistencies** | Data Maintainer, Taxonomy Specialist, Global PM, Product Specialists |
| **Manual, labor-intensive workflows** | All |
| **Unclear ownership and accountability** | All |
| **Slow, complex tools** | Product Specialists, Data Maintainer, Channel Rep |
| **Data quality issues** (missing, incorrect, inconsistent) | All |
| **Translation and terminology inconsistencies** | Global PM, Product Specialists |
| **Late discovery of issues** | Product Specialists, Data Maintainer |
| **No single source of truth** | Data Maintainer, Global PM, Channel Rep |
| **Dependency on Flight Data Hub / other teams** | Product Specialists, Global PM |

---

### JTBD Themes Frequency

| Theme | Personas Using |
|-------|----------------|
| 🔍 **Data Validation & Quality Assurance** | All 8 personas |
| ⚙️ **Process & Role Efficiency** | All 8 personas |
| 📊 **Comparison & Consistency** | Data Maintainer, Global PM (Tomasz Zielinski), Product Specialist (Mira Petrovic) |
| 👁️ **Change Awareness & Control** | Product Specialist (Jonas Varga) |
| 📈 **Insights** | Data Maintainer, Global PM (both), Channel Rep |
| 🌐 **External Data Delivery** | Channel Rep |

---

### Priority Control Center Capabilities (Derived from All Personas)

| Capability | Priority | Supporting Personas |
|------------|----------|---------------------|
| Data transparency / lineage visualization | 🔴 Critical | All |
| Automated data quality checks | 🔴 Critical | All |
| Multi-system data aggregation (single source of truth) | 🔴 Critical | Data Maintainer, Channel Rep, Global PM |
| Clear ownership & responsibility mapping | 🔴 Critical | All |
| Proactive notifications / alerts | 🟠 High | Taxonomy Specialist, Product Specialists, Channel Rep |
| Multi-family / multi-product comparison | 🟠 High | Data Maintainer, Product Specialists |
| Change tracking / audit trail | 🟠 High | Product Specialists, Data Maintainer |
| AI-powered anomaly detection | 🟡 Medium | Product Specialist (Jonas Varga), Channel Rep |
| Completeness scorecards / dashboards | 🟠 High | Taxonomy Specialist, Channel Rep, Product Specialists |
| API for external data delivery | 🟡 Medium | Channel Rep |
| Translation management | 🟡 Medium | Global PM (Tomasz Zielinski), Product Specialist (Mira Petrovic) |
| Document lifecycle management | 🟡 Medium | Product Specialist (Nadia Rahman), Channel Rep |