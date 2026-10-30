# How buyers find the right drone: buyer journey and job stories

> **Status: research input, not ADDR output.** This report is input for a future ADDR Align run of the Ordering
> domain. It is not an Align, Define, Design or Refine artifact. The personas and job stories below are drafts for
> that Align run to accept, change or drop.
>
> Research: how buyers find the right drone. Written 2026-10-28. Updated 2026-10-29 with
> CJ's answers to the open questions (see "CJ's answers (2026-10-29)").
> Label key: [web] = taken from a cited source. [inference] = my own reasoning. [CJ] = a decision from CJ's answers.

## Recommendation

1. Add four buyer personas to the Ordering Align run. The storefront personas do not cover them (see "Gap").
2. Sell to the EU only. Use EU class rules (C0 to C6) as the only legal model. [CJ E1a] Other markets are later.
3. Give drones and parts equal weight, on two separate paths. [CJ E2c] Drones go through the guided finder (OB1).
   Parts go through a saved build (OB6).
4. Build the guided "find the right drone" flow as a read-only layer on the existing catalog (JS1 to JS5). Do not
   make it a new write model. "Ask drone-web" (a planned agent that answers customers' questions) is one entry into this flow (OB1). [CJ E6a]
5. Make four steps state-changing in v1: saved shortlist, saved build, contact request, order. Everything before them
   reads only. The quote flow (OB7) is later; v1 uses a contact form. [CJ E5a]
6. Treat legal class (C0 to C4) and radio/video compatibility as first-class filters, not text in descriptions.
7. Keep guided selling and a configurator separate. The finder narrows; the configurator validates (JS4 already exists).

## Existing ADDR work (read first)

- Storefront personas: Professional Integrator, Casual Browser, Fleet Procurement Buyer, Partner System
  (`design/catalog-storefront/addr/align/personas.md`).
- Storefront job stories JS1 Discovery, JS2 Evaluation, JS3 Comparison, JS4 Compatibility, JS5 Browsing, JS6 Partner
  access (`design/catalog-storefront/addr/align/job-stories.md`).
- Ordering has only an event model (`design/ordering/eventmodel/README.md`): BrowseDrones, PlaceOrder, PayForOrder,
  ListMyOrders, TrackOrder, shipping and delivery notices. It has no saved build, wish list, quote or returns.
- Gap [inference]: no persona covers a hobbyist FPV pilot, a camera-drone buyer or a farmer or small business that
  buys one drone for a job. "Casual Browser" has "limited technical knowledge" and no goal to own and fly a drone.
  "Professional Integrator" buys components in volume. Neither buys one finished drone for a task.

## Buyer segments and jobs

Segments below are [inference] built from the sources in this report. The source for each criterion is cited.

| Segment | Core job | Buys | Main worry |
| --- | --- | --- | --- |
| First-time hobbyist | "Get in the air without breaking it or the law" | Ready-to-fly kit or small camera drone | Wrong kit, crashes, rules |
| FPV pilot (new or upgrading) | "Build or upgrade a quad that works with my radio and goggles" | Frame, motors, ESC, flight controller, battery, or BNF drone | Part and protocol compatibility |
| Camera creator | "Get good footage under the legal limits I can accept" | Camera drone, spare batteries | Sensor, flight time, class, registration |
| Professional or farmer (single unit) | "Do a field job reliably, with training and repair" | Spray, survey or inspection drone | Support, payload, parts, compliance |
| Fleet buyer | Already in storefront personas | - | - |

## Decision criteria

- Where it flies. Indoors suits a 65 to 85 mm tiny whoop. Outdoors suits a 3 to 5 inch quad. [web: [Unmanned Tech
  Shop](https://www.unmannedtechshop.co.uk/blogs/knowledge-base/how-to-choose-your-first-fpv-drone-kit)]
- Budget. That guide gives GBP 200 to 300 for entry analog kits and says to keep GBP 50 to 100 for spares. It is one
  UK retailer's view; treat the numbers as examples.
- Kit type. RTF includes a radio. BNF and PNP do not and need a compatible transmitter. [web: same source]
- Radio protocol. ELRS radios work with most DIY drones; some budget kits use brand-locked protocols and connectors.
  [web: same source] That guide does not cover goggle or battery compatibility. Unchecked.
- Camera drones. Sensor size matters more than megapixels. Flight-time claims are still-air figures; one guide
  subtracts about 10 % for wind. Obstacle-avoidance coverage varies by model. [web: retailer and affiliate guides,
  e.g. [Jessops](https://jessops.com/c/advice/bg/drone-buying-guide); vendor-sourced, verify specs. I read only
  search summaries of these guides.]
- Agricultural. Tank capacity against weight, application rate, farm size and crop, total cost of ownership,
  supplier training, parts availability, user-serviceable repairs. [web: [Agri Spray
  Drones](https://shop.agrispraydrones.com/blogs/news/what-you-should-consider-when-buying-a-spray-drone); a
  seller's own guide]
- Legal class. See next section.

### EU class and subcategory (primary: German authority page)

[web: [uas-operations.bund.de, open
category](https://uas-operations.bund.de/homepage/en/information/categorizing-drone-operations/open-category/)]

| Subcategory | Class | Mass | Pilot needs |
| --- | --- | --- | --- |
| A1 | C0 or private build | under 250 g | none (certificate only if a sensor captures personal data) |
| A1 | C1 | under 900 g | EU certificate of competency |
| A2 | C2 | under 4 kg | remote pilot certificate (in addition to A1/A3) |
| A3 | C2, C3, C4, private build | under 25 kg | certificate of competency; 150 m from built-up areas |

- C5 and C6 exist for the specific category (STS-01, STS-02). C5: under 10 kg, visual line of sight. C6: under 25 kg,
  beyond visual line of sight. [web: [Barcelona Drone Center](https://www.barcelonadronecenter.com/blog/2023/07/24/drone-class-marking/),
  a secondary blog.] A 2026 article says the C6 class may be rewritten
  ([DroneXL](https://dronexl.co/2026/06/22/dji-matrice-4d-c6-standalone-bvlos/)). Unchecked.
- Legacy drones without a class mark, placed on the market before 2024-01-01, may still fly in A1 (under 250 g) and
  A3. [web: same German page]
- Implication [inference]: the shop needs a class mark and mass on every finished drone. An EU buyer filters
  by "what can I fly without an exam". The shop sells to the EU only [CJ E1a], so EU class rules are the only legal
  model in v1. UK and US rules differ and are out of scope.
- I could not read the EASA pages (HTTP 404). The class data rests on a national authority page plus blogs. Check
  against Regulations (EU) 2019/945 and 2019/947 before it goes in a data model.

## Where buyers get stuck, and what makes them buy

Stuck points. [web unless marked]
- Unknown filter terms. Baymard found 62 % of sites use unclear industry-specific filter labels, and users skip or
  misuse them. [Baymard](https://baymard.com/blog/explain-industry-specific-filters)
- Missing filters for displayed specs: 38 % of sites. Baymard also advises comparison tools in the list for
  spec-heavy categories. [Baymard](https://baymard.com/research/ecommerce-product-lists) (from search summary)
- Choice overload in large catalogs. [Excentos, a vendor](https://www.excentos.com/en/manage-complex-b2b-product-portfolios-with-guided-selling)
- Compatibility: brand-locked radios and connectors (Unmanned Tech Shop, above).
- Rules: which class, which certificate, registration. [inference from the class table]
- After-sale: parts, repair and training for professional buyers (Agri Spray Drones, above).

Buy triggers [inference, weakly sourced]: a clear "this works with what I own" answer; a legal answer ("no exam
needed"); a complete kit with spares; named support. I found no primary data on conversion drivers. Unchecked.

Evidence quality: mostly vendor and retailer blogs. Baymard is the one research source, and its statistics are
cross-industry, not drone-specific.

## Guided "find the right drone" flow

Guided selling asks questions and offers answer options so the shopper can define the need. Wikipedia says such
tools can give better access to the range than filters or free-text search for complex products. [web:
[Wikipedia](https://en.wikipedia.org/wiki/Guided_selling)] Vendor material says the same; I saw no effect size.

Entry points [CJ E6a]: the finder start page, and "Ask drone-web". "Ask drone-web" is one
entry into OB1. It starts the same flow and fills in the answers it can.

Proposed flow [inference]:
1. Intent: first drone / FPV / camera / work / parts for a build. "Parts for a build" leaves the finder and opens the
   saved-build path (OB6). The finder is for drones. [CJ E2c]
2. Where and who: indoor or outdoor; EU country; pilot certificate held (drives class filter). The shop sells to the
   EU only. [CJ E1a]
3. Budget and what I already own (radio, goggles, battery type). This sets the compatibility filter.
4. Result: 3 to 5 ranked drones or kits with a reason for each ("RTF, C0, works indoors"). Counts per filter and
   plain-language hints on each term (Baymard).
5. Compare (JS3), then save to a shortlist, send a contact request, or order. A quote flow replaces the contact
   request later. [CJ E5a]
Escape hatch: the same filters stay available as normal faceted filters; the wizard only sets them.

## Read versus state-changing

| Step | Changes state? | Where it lives |
| --- | --- | --- |
| Answer the finder, browse, compare, evaluate | No (may keep a session answer set) | Storefront |
| Save shortlist or wish list | Yes. Guests save on their device; signing in keeps it across devices. [CJ E3a] | New: Ordering or a Buyer-profile context |
| Save a build (parts list with compatibility result) | Yes | Ordering. It reads the compatibility rules that Catalog publishes (JS4 rules). [CJ E4a] |
| Send a contact request (fleet, professional) | Yes, in v1. [CJ E5a] | New; a contact form |
| Ask for a quote (fleet, professional) | Yes; has a lifecycle | Later. [CJ E5a] |
| Place and pay for order, track | Yes | Existing event model |
| Ownership record (what I own, for later compatibility) | Yes | New; optional |

Saved build ownership [CJ E4a]: Ordering owns the saved build. This fits the event model rule that Ordering reads other
contexts only through published streams (P3). Catalog must publish the compatibility rules as a stream, and Ordering
reads them. [inference from `design/ordering/eventmodel/README.md`]

Guest shortlist [CJ E3a]: a device-only shortlist needs no customer id. Keeping it across devices needs the
signed-in customer, which the event model lists as a gap. [inference]

## Proposed personas (names for Align)

- Hobby Starter
- FPV Builder
- Camera Creator
- Field Operator (professional or farmer; one to a few units)

Existing Fleet Procurement Buyer and Professional Integrator stay. In v1 they use the contact form; the quote path
(OB7) comes later. [CJ E5a]

## Draft job stories (storefront format; IDs prefixed OB to avoid clashes)

**OB1: Guided Recommendation**
WHEN I do not know which drone suits what I want to do,
I WANT TO answer a few plain questions about use, place, budget and gear,
SO I CAN see a short list of drones that fit and why.

Entry points: the finder start page and "Ask drone-web". [CJ E6a]

**OB2: Legal Fit**
WHEN I plan to fly in the EU without more training than I have,
I WANT TO filter by class, mass and the certificate each drone needs,
SO I CAN buy a drone I am allowed to fly.

**OB3: Works With My Gear**
WHEN I already own a radio, goggles or batteries,
I WANT TO tell the shop what I have and see only drones and parts that work with it,
SO I CAN avoid buying something that will not connect.

**OB4: Starter Kit Completeness**
WHEN I am buying my first drone,
I WANT TO see what the kit includes and what I must still buy (radio, goggles, batteries, spares),
SO I CAN know the full cost before I order.

**OB5: Save for Later**
WHEN I am not ready to buy,
I WANT TO save a shortlist and return to it,
SO I CAN decide later without searching again.

A guest saves the shortlist on the device. Signing in keeps it across devices. [CJ E3a]

**OB6: Save a Build**
WHEN I pick parts for a quad,
I WANT TO save the parts list with its compatibility result and order it as one purchase,
SO I CAN get all the parts that fit together.

This is the main path for parts, equal to the finder for drones. [CJ E2c] Ordering owns the saved build and reads the
compatibility rules that Catalog publishes. [CJ E4a]

**OB7: Request a Quote (later)**
WHEN I buy for a business, farm or program and need a price for a number of units,
I WANT TO ask for a quote with my requirements and get a priced answer I can approve,
SO I CAN buy through my normal approval process.

Not in v1. In v1 a contact form takes these requests. The quote flow with a lifecycle comes later. [CJ E5a]

**OB8: Support Confidence**
WHEN I buy a drone for work,
I WANT TO see training, spare parts and repair options before I order,
SO I CAN trust it will stay in service.

**OB9: Understand a Term**
WHEN a filter or spec uses a word I do not know,
I WANT TO read a short explanation in place,
SO I CAN choose without leaving the shop.

OB1 to OB4, OB8 and OB9 refine storefront JS1, JS2 and JS4 on the read side. OB5 and OB6 are new write-side stories
for v1. OB7 is a write-side story for later; the v1 contact form stands in for it. [inference, scope from CJ E5a]

## CJ's answers (2026-10-29)

These answers replace the open questions of the first draft. Each answer has an ID (E1a to E6a) that the text above
cites.

| ID | Question | Answer |
| --- | --- | --- |
| E1a | Which markets does the shop sell to? | EU only. EU class rules (C0 to C6) are the only legal model. |
| E2c | Drones, parts, or both as equal lines? | Both count equally, on separate paths: the finder for drones, a saved build for parts. |
| E3a | Do guests save shortlists, or must they sign in? | Guests save a shortlist on their device. Signing in keeps it across devices. |
| E4a | Does Ordering or Catalog own the saved build? | Ordering owns the saved build. It reads the compatibility rules that Catalog publishes. |
| E5a | Quote flow now, or a contact form first? | A contact form in v1. A quote flow comes later. |
| E6a | Where does "Ask drone-web" fit? | It is one entry into OB1. |

Follow-up research: a primary check of the EU 2019/945 and 2019/947 class marks for the catalog data model, and a
forum and review study of drone buyer questions (r/fpv, r/dji).

## Unchecked and how to check

- EASA primary text and C5/C6 status: read Regulations (EU) 2019/945 and 2019/947 on EUR-Lex.
- Goggle, video-system and battery compatibility rules for FPV: read ExpressLRS, DJI and Walksnail docs.
- Buy triggers and conversion: interview 5 buyers per segment, or read the shop's analytics once live.
- Baymard guided-selling findings: not found; the search returned only vendor material.
- Forum and review sources (the research brief listed them): not covered. Cheapest check: sample r/fpv and r/dji threads
  for "what should I buy" questions and code the follow-up questions.
- Licence: web pages read for facts only; no text copied.
