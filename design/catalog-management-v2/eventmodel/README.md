# Catalog management: the life of a product (JS1)

An event model of one write-side flow from the catalog-management-v2 ADDR run. A Product Lifecycle
Manager drafts a product and asks for it to go live. Catalog Governance reviews the request and
releases it. The manager publishes the product. While the product is sold, every change to it
(specifications, details, discontinuation) goes through the same review. Who decides depends on
the risk: a review agent (an LLM) for low risk, the agent and a person for medium risk, a person
alone for high risk. A case that nobody decides expires.

| File | What it is |
| --- | --- |
| [`product-lifecycle.kairos.yml`](product-lifecycle.kairos.yml) | The model, in [Kairos](https://github.com/cjjohansen/event-model-factory/tree/main/dsl/kairos) v0. Its header holds the flow in words and the ADDR sources. |
| [`product-lifecycle.kairos.intent.yml`](product-lifecycle.kairos.intent.yml) | The intention sidecar: `to-be`, target `prototype`. |
| [`product-lifecycle.board.html`](product-lifecycle.board.html) | The rendered board: one self-contained HTML page. Open it in a browser. |
| [`product-lifecycle.kairos.last-check.json`](product-lifecycle.kairos.last-check.json) | The validator's receipt: version, time, model hash, target and counts. |

The other files in this folder (`config.json` with 78 slices, its backups, `high-level-analysis.json`)
are the earlier generated Event Model Studio export. This model used them as input and does not
replace them.

**Decision numbers.** This repo (`.ralph/agent/decisions.md`) and the galaxitech-website repo
(`DECISIONS.md`) number their decisions separately, and both have a D-037 and a D-038. This
folder therefore always names the repo: "drone-web D-037", "galaxitech-website D-038". CJ's
answers to the open questions of this model are "CJ D1a" to "CJ D10b" (2026-10-29, bead
`galaxitech-website-498`); they are not entries in either decision log.

## The flow

25 slices in five chapters, with 121 given/when/then scenarios (126 examples: two outlines run 2 and 5 times),
in three contexts: Product Data (the Product Lifecycle Service, drone-web D-037), Catalog
Governance (drone-web D-029) and the review agent (`ReviewAgent`, outside the model). They talk
only through published messages: `ChangeForReview` from Product Data to Governance; `ChangeReleased`,
`ChangeRejected` and `ChangeExpired` back; `ChangeAssessed` from the review agent to Governance.

| Chapter | Slice | Pattern | ADDR source (`../addr/`) | config.json slice |
| --- | --- | --- | --- | --- |
| Draft | `DraftProduct` | command | JS1 "Submit new product"; `createProduct()` | 1 |
| Draft | `RecordSpecifications` | command | JS1 "Add technical specifications"; `updateProductSpecifications()` | 3 |
| Draft | `FindProductsToManage` | query | JS1 "Search products for management"; `searchProductsForManagement()` | 2, 4, 6, 8, 10, 12 |
| Draft | `ShowProductDetails` | query | JS1 activity steps "Search/details projections update" and "Product detail replacement section updates"; no read operation in `api-design.md` (drone-web D-038) | (none) |
| Review | `RequestProductChange` | command | JS1 "Set initial lifecycle state", "Mark product as discontinued"; `setProductLifecycleState()` (`202 Accepted`) | 5 |
| Review | `OpenApprovalCase` | translation | `submitApprovalCase(changeType, riskLevel)` | 67 |
| Review | `ReviewApprovalCases` | query | Catalog Governance API, ApprovalCase resource | 68, 70, 72, 74 |
| Review | `ShowApprovalCaseDetails` | query | ApprovalCase and PublicationGate resources; no read operation in `api-design.md` (drone-web D-038) | (none) |
| Review | `AskAgentForReview` | automation | CJ D2a, D3b: the review agent | (none) |
| Review | `ApproveAsAgent` | translation | CJ D2a, D3b: low risk, the agent approves | (none) |
| Review | `RecommendAsAgent` | translation | CJ D2a, D3b: medium risk, the agent checks | (none) |
| Review | `EscalateToPerson` | translation | CJ D2a, D3b: the agent hands the case to a person | (none) |
| Review | `AssignReviewer` | command | `assignApprovalReviewer()` | 69 |
| Review | `ApproveChange` | command | `recordApprovalDecision(approve)` | 71 |
| Review | `RejectChange` | command | `recordApprovalDecision(reject)` | 71 |
| Review | `ReleaseChange` | command | `releasePublicationGate()` | 73 |
| Review | `ExpireUndecidedCase` | automation | ApprovalCase status `expired`; CJ D10b | (none) |
| Publish | `ClearProductChange` | translation | sequence diagram JS1: release, then lifecycle change | (none) |
| Publish | `RecordRefusedProductChange` | translation | ApprovalCase status `rejected` | (none) |
| Publish | `RecordExpiredProductChange` | translation | ApprovalCase status `expired` | (none) |
| Publish | `PublishProduct` | command | sequence diagram JS1: the effect of `setProductLifecycleState(active)` | 5 |
| Publish | `FeedProductRecords` | query | `design/contracts/product-lifecycle.yaml`, `product-records` | (none) |
| Change | `ReviseProductDetails` | command | JS1 "Update product core attributes"; `updateProductAttributes()` | 7 |
| Retire | `DiscontinueProduct` | command | JS1 "Mark product as discontinued"; `discontinueProduct()`, the effect after the release | 9 |
| Retire | `LinkReplacementProduct` | command | JS1 "Link replacement product"; `linkReplacementProduct()` | 11 |

The `ProductRecords` view feeds the published stream `product-records` (`ProductRecordChanged`,
`design/contracts/product-lifecycle.yaml`). A row appears only when the product goes live, so the
stream carries no drafts (CJ D5a). The ordering model (`design/ordering/eventmodel/`) reads that
stream.

## How a change is reviewed

A change request has a change type. The Governance policy gives each type a risk level, and the
risk level gives the route (GOV-004, GOV-005, GOV-008):

| Change type | Policy risk level (proposed) | Route | Who decides |
| --- | --- | --- | --- |
| `details-change` (name, short description) | low | `agent` | The review agent approves. If it escalates, a person decides. |
| `specification-change` | medium | `agent-then-person` | The agent checks, then a person confirms or rejects. |
| `lifecycle-change` (go live, discontinue) | high | `person` | A person decides. |
| (none in this flow) | critical | `person` | A person decides. |

The manager states a risk level on the request. Governance keeps it when it is higher than the
policy level, and raises it to the policy level when it is lower (GOV-004, CJ D2a). A person who
decides must be the assigned reviewer, and never the manager who asked (GOV-006, GOV-007, CJ D1a).
An agent approval releases nothing by itself: a reviewer still releases the gate (`ReleaseChange`).

**The LLM decision.** `AskAgentForReview` sends each low- and medium-risk case to the review agent
once, through the one-way port `ChangeReviewAgent.AssessChange`. The agent answers later with the
message `ReviewAgent.ChangeAssessed` (verdict and findings). Three translation slices read that
message, and each turns the answers it is for into one typed command: `ApproveAsAgent`,
`RecommendAsAgent` or `EscalateToPerson`. The decision behind each command checks the verdict
against the case's risk level, so the LLM cannot approve more than the policy allows. A verdict
other than `approve` goes to a person (GOV-011, proposed). The event-model-factory clone used here
(7927a4e) has no kairos-author guidance on LLM decisions; this shape follows the spec's rule that a
value from outside enters only through a translation (spec section 9.4).

## Views

Each entity that the events are about has a list view and a detail view (drone-web D-038). The
detail view is a single view keyed by its list. Its page is the entity's task menu: the command
screens that act on the entity start from it, and no field on the page is edited directly.

| Entity | List view (screen) | Detail view (screen) | Tasks on the detail page |
| --- | --- | --- | --- |
| Product (`productId`) | `ProductsUnderManagement` (`ProductAdminList`) | `ProductDetails` (`ProductDetailPage`) | `SpecificationsForm`, `ProductChangeForm`, `PublishProductForm`, `ProductDetailsForm`, `DiscontinueProductForm`, `ReplacementForm` |
| Approval case (`approvalCaseId`) | `ApprovalCases` (`ApprovalCaseList`) | `ApprovalCaseDetails` (`ApprovalCaseDetailPage`) | `AssignReviewerForm`, `ApproveForm`, `RejectForm`, `ReleaseForm` |

Two more list views are not shown to a person: `ProductRecords` (the `product-records` stream)
and the to-do lists of the two automations (`CasesForTheAgent`, `UndecidedCases`).

The events carry three more tags. None of them is an entity of its own:

- `sku` is a field of the product.
- `replacementProductId` and `sourceReferenceId` are product ids.
- The publication gate has no id. Each approval case has one gate, and `PublicationGateReleased`
  carries only the `approvalCaseId`. The gate therefore shows as the `gate` field (locked or
  released) of `ApprovalCaseDetails`, and it has no list or detail view of its own.

Not in this flow: JS1 bulk ingestion (Bulk Ingestion API). It is a flow of its own.

## Rules

| Rule | Title | Status |
| --- | --- | --- |
| PLC-001 | A SKU belongs to one product only | active (`createProduct()` 409) |
| PLC-002 | The lowest supply voltage is not above the highest | proposed |
| PLC-003 | A product goes live only with its identity and specifications recorded | active (boundary invariant 1) |
| PLC-004 | A product moves only from draft to active and from active to discontinued | proposed |
| PLC-005 | A discontinued product does not return to active | active (boundary invariant 3, CJ D9a) |
| PLC-006 | A product has at most one change request in review | proposed |
| PLC-007 | A lifecycle change takes effect only after Governance released it | active (Governance invariant 1, drone-web D-037, galaxitech-website D-038) |
| PLC-008 | Only a discontinued product gets a replacement | active (`linkReplacementProduct()`) |
| PLC-009 | A change of specifications or details on an active product takes effect only after Governance released it | active (CJ D3b) |
| PLC-010 | A discontinued product keeps its specifications; its details may still change | active (CJ D4a) |
| PLC-011 | The replacement product exists and is active | proposed (CJ D8a; not checked, see below) |
| GOV-001 | An approval case is decided once | active (Governance invariant 2) |
| GOV-002 | A change is released only after it is approved | active (Governance invariant 1) |
| GOV-003 | A publication gate is released once | proposed |
| GOV-004 | The Governance policy sets the lowest risk level of a case; the requester cannot lower it | active (CJ D2a) |
| GOV-005 | The policy levels: details-change low, specification-change medium, lifecycle-change high | proposed (the exact table) |
| GOV-006 | A person decides a case only after a reviewer is assigned to it | active (CJ D1a) |
| GOV-007 | The manager who asked for a change does not review or approve it | active (CJ D1a, four eyes) |
| GOV-008 | The agent alone approves only a low-risk change; a person confirms a medium-risk change and decides a high- or critical-risk change | active (CJ D2a, D3b) |
| GOV-009 | An approval case that nobody decides within the review period expires | active (CJ D10b) |
| GOV-010 | The review period is 14 days | proposed (the number N) |
| GOV-011 | A verdict other than approve sends the case to a person | proposed |
| GOV-012 | Only the reviewer assigned to a case approves it | proposed (our reading of CJ D1a) |

## CJ's answers (2026-10-29)

| Question | Answer | Where in the model |
| --- | --- | --- |
| D1 Reviewer and four eyes | D1a: a reviewer is assigned before a decision; the requester may not approve. | GOV-006, GOV-007, GOV-012 (proposed: only the assigned reviewer approves) |
| D2 Risk level | D2a: a Governance policy sets the risk level from the change type; the requester cannot lower it. | GOV-004, GOV-005, `OpenApprovalCase` |
| D3 Review of spec and detail changes | D3b: every change on an active product goes through review. Low: the agent approves. Medium: the agent checks, a person confirms. High or critical: a person decides with four eyes. | PLC-009, GOV-008, the agent slices |
| D4 Discontinued product | D4a: details may change; specifications are frozen. | PLC-010 |
| D5 Drafts on `product-records` | D5a: no drafts. `draft` is removed from `lifecycleState` in `design/contracts/product-lifecycle.yaml`. | `FeedProductRecords` |
| D6 Who publishes after the release | D6a: the manager (unchanged). | `PublishProduct` |
| D7 Two lifecycle operations | D7a: keep both. `setProductLifecycleState()` is the request and answers `202 Accepted` with the approval case; `discontinueProduct()` is the effect after the release. The ADDR files say so now. | `RequestProductChange`, `DiscontinueProduct` |
| D8 Replacement product | D8a: it must exist and be active. | PLC-011 (proposed, not checked) |
| D9 Reactivation | D9a: none; draft a new product. | PLC-005 |
| D10 Case expiry | D10b: a case expires after N days without a decision, through a timed automation. N is 14 (proposed). Case statuses are now `pending`, `approved`, `rejected`, `released`, `expired` in `define/boundaries.md`, `define/resources.md` and the OpenAPI file. | `ExpireUndecidedCase`, GOV-009, GOV-010 |

## Where the model departs from ADDR (proposed)

- The manager asks Product Data for the change, and Product Data sends the request to
  Governance. In the ADDR sequence diagram the manager calls Governance directly. The change keeps
  the product rules (PLC-003 to PLC-006, PLC-009, PLC-010) inside Product Data
  (`define/boundaries.md`, section D).
- `pending-approval` is not a lifecycle state. A product in review keeps its state and shows the
  review in a separate `review` column, because a product in review for discontinuation is still
  active and still sold.
- `sourceReferenceId` is a `uuid` (the product id), not a free `string` as in the OpenAPI file.
- One request event (`ProductChangeRequested`) carries all three change types. Kairos lets only
  one event create the approval case's rows (K14), and one event comes from one slice (K13), so
  one request slice serves the three types. The specification or detail values are in
  `requestedChange` as words; after the release the manager enters them in
  `RecordSpecifications` or `ReviseProductDetails`.

## Open questions for CJ

1. A reviewer approves `requestedChange` as words. Should the request carry the typed values, so
   that the applied values must equal the approved ones?
2. Should an agent approval of a low-risk change also release the gate by itself? Now a reviewer
   releases it.
3. Do `updateProductSpecifications()` and `updateProductAttributes()` also answer `202 Accepted`
   on an active product (CJ D3b)? The ADDR files still give `200 OK`.
4. The OpenAPI `riskLevel` enum has no `critical`; `define/resources.md` has it.

## Validate and render

With [event-model-factory](https://github.com/cjjohansen/event-model-factory) checked out next to this
repo and `npm ci` run in `dsl/kairos/tools`:

```bash
node ../event-model-factory/dsl/kairos/tools/validate.mjs --receipt design/catalog-management-v2/eventmodel/product-lifecycle.kairos.yml
node ../event-model-factory/dsl/kairos/tools/render.mjs design/catalog-management-v2/eventmodel/product-lifecycle.kairos.yml
```

At event-model-factory 7927a4e the validator reports 0 errors, 4 warnings and 9 info (25 slices,
121 tests, 7 views, target prototype). All four warnings are from the factory stage: they say what
the prototype factory cannot generate yet, not what is wrong in the model.

- F9 on `RequestProductChange`: its scenarios give 7 event types, and the factory folds up to 6.
  Each of the 7 is needed: the draft, the specifications (PLC-003), the request, the refusal and
  the expiry (both close a request, PLC-006), the publication and the discontinuation (PLC-004,
  PLC-005, PLC-010).
- F30 on `ApproveAsAgent`, `RecommendAsAgent` and `EscalateToPerson`: the agent's answer comes from
  a context outside the model, over a broker, and the factory has no broker binding yet (emf-bzu.14).

The info findings are K33 (three pairs of events with almost the same fields; each pair is two
different facts) and M5 on the six translations (a message from another context cannot prove
that the row exists). Each translation has a test that ignores a message for an unknown product or
case (emf-m9a.67: views ignore updates for rows they do not have).

## What Kairos cannot say yet

- A decision cannot load a second thing of the same kind under another field name. The replacement
  in `LinkReplacementProduct` is a product, but the command names it `replacementProductId`. K27
  rejects a `given` event for it, so the model does not check PLC-011 (`galaxitech-website-k1x`).
- One slice, one command. CJ's example of a typed command, "ApproveChange or EscalateChange", is
  one choice between commands. Kairos gives each slice one command, so the agent's answer goes to
  three translation slices on the same message, each with its own command and a test that it
  ignores the other answers.
- A conditional create. A view row is made by an event, not by an event with a value. The agent's
  to-do list (`CasesForTheAgent`) therefore also holds high-risk cases; the automation leaves them
  alone (test `LeavesAHighRiskCaseToAPerson`) until a decision or the expiry removes them.
- A task menu. Kairos has no link from a detail view or its screen to the command screens that
  start from it. A `lookup` points only at a list view (K7). The model names the tasks in the
  description of `ShowProductDetails` and `ShowApprovalCaseDetails`, and each command screen says
  that its id comes from the detail page. The menu belongs in a Tessera file
  (`galaxitech-website-sa8`).
- The signed-in user as the source of a value (emf-bzu.31). `requestedBy`, `decidedBy` and
  `releasedBy` are screen fields with a description.
