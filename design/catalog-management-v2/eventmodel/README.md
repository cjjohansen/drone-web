# Catalog management: the life of a product (JS1)

An event model of one write-side flow from the catalog-management-v2 ADDR run. A Product Lifecycle
Manager drafts a product and asks for it to go live. Catalog Governance reviews the request and
releases it. The manager publishes the product. While the product is sold, every change to it
(specifications, details, discontinuation) goes through the same review. Who decides depends on
the risk: a review agent (an LLM) for low risk, the agent and a person for medium risk, a person
alone for high risk. Any person with the reviewer role for that risk may decide. An agent approval
releases the change by itself, and the reviewers are told. A change of specifications or details
carries its new values, and only those values can be applied. A case that nobody decides expires.

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
`galaxitech-website-498`); they are not entries in either decision log. CJ's later answers to the
open questions of PR #26 (typed values, agent release, deciding by role) are drone-web D-039.

## The flow

27 slices in five chapters, with 135 given/when/then scenarios (143 examples: five outlines run
2, 5, 2, 2 and 2 times), in three contexts: Product Data (the Product Lifecycle Service, drone-web
D-037), Catalog Governance (drone-web D-029) and the review agent (`ReviewAgent`, outside the
model). They talk only through published messages: `ChangeForReview` from Product Data to
Governance; `ChangeReleased`, `ChangeRejected` and `ChangeExpired` back; `ChangeAssessed` from the
review agent to Governance. Three ports reach systems outside the model: the review agent
(`ChangeReviewAgent`), the reviewer directory (`ReviewerDirectory`, who holds which reviewer role)
and the notice sender (`ReviewerNotifier`).

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
| Review | `TellReviewersOfAgentApproval` | automation | drone-web D-039: the reviewers are told of an agent approval | (none) |
| Review | `AssignReviewer` | command | `assignApprovalReviewer()` | 69 |
| Review | `ApproveChange` | command | `recordApprovalDecision(approve)` | 71 |
| Review | `RejectChange` | command | `recordApprovalDecision(reject)` | 71 |
| Review | `ReleaseChange` | command | `releasePublicationGate()` | 73 |
| Review | `AnnounceRelease` | automation | drone-web D-039: one release message for both ways to release | (none) |
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
| `details-change` (name, short description) | low | `agent` | The review agent approves, and its approval releases the change. If it escalates, a person decides. |
| `specification-change` | medium | `agent-then-person` | The agent checks, then a person confirms or rejects. |
| `lifecycle-change` (go live, discontinue) | high | `person` | A person decides. |
| (none in this flow) | critical | `person` | A person decides. |

The manager states a risk level on the request. Governance keeps it when it is higher than the
policy level, and raises it to the policy level when it is lower (GOV-004, CJ D2a).

**Who decides.** A case gets an assigned reviewer before a person decides it (GOV-006). Any
person who holds the reviewer role for the case's risk level may then approve or reject it, not
only the assigned reviewer; the manager who asked never reviews, approves or rejects it (GOV-007, GOV-012, drone-web D-039).
Catalog Governance has one reviewer role per risk level, and a person may hold several. The roles
come from the reviewer directory, a port to a system outside the model
(`ReviewerDirectory.ReviewerRoles`); `ApproveChange` and `RejectChange` read the roles of the
person who decides as an external value and record them on the decision (`deciderRiskLevels`).
This needs no organisation model inside the showcase, so the fallback to "only the assigned
reviewer" was not needed.

**Who releases.** A reviewer releases the gate of a change a person approved (`ReleaseChange`).
An agent approval releases the gate by itself (GOV-013): `ChangeApprovedByAgent` is the approval
and the release in one fact, and `ReleaseChange` refuses that case (`GateAlreadyReleased`).
`TellReviewersOfAgentApproval` then sends a notice to the low-risk reviewers through
`ReviewerNotifier.SendAgentApprovalNotice` and records `ReviewersToldOfAgentApproval`; the
`ApprovalCaseDetailPage` shows when they were told (`reviewersToldAt`). A reviewer who disagrees
asks for a new change; a released change is not taken back.

Both ways to release end in one message. `AnnounceRelease` works through `ReleasesToAnnounce` (a
row per case; released by a reviewer or by the agent) and records `ChangeReleaseAnnounced`, from
which Catalog Governance publishes `ChangeReleased`. Kairos lets only one slice record an event
(K13) and a message come from only one event, so the two releases meet in this slice.

**Typed values.** A specification or details change carries its new values as typed fields on
`ProductChangeRequested`: `newMinVoltage`, `newMaxVoltage`, `newMaxCurrent`, `newMounting` and
`newWeight`, or `newName` and `newShortDescription`. A lifecycle change carries `targetState`.
Product Data writes `requestedChange`, the text the reviewer and the agent read, from those values
(old to new). After the release, `RecordSpecifications` and `ReviseProductDetails` accept only the
values of the released request (`ValuesDifferFromTheApprovedOnes`, PLC-012). Catalog Governance
stays the same for every change type: it approves the text, and Product Data holds the values the
text was made from.

**The LLM decision.** `AskAgentForReview` sends each low- and medium-risk case to the review agent
once, through the one-way port `ChangeReviewAgent.AssessChange`. The agent answers later with the
message `ReviewAgent.ChangeAssessed` (verdict and findings). Three translation slices read that
message, and each turns the answers it is for into one typed command: `ApproveAsAgent`,
`RecommendAsAgent` or `EscalateToPerson`. The decision behind each command checks the verdict
against the case's risk level, so the LLM cannot approve more than the policy allows. A verdict
other than `approve` goes to a person (GOV-011, proposed). The kairos-author skill (event-model-factory
0d92369) has no guidance on LLM decisions; this shape follows the spec's rule that a value from
outside enters only through a translation (spec section 9.4).

## Views

Each entity that the events are about has a list view and a detail view (drone-web D-038). The
detail view is a single view keyed by its list. Its page is the entity's task menu: the command
screens that act on the entity start from it, and no field on the page is edited directly.

| Entity | List view (screen) | Detail view (screen) | Tasks on the detail page |
| --- | --- | --- | --- |
| Product (`productId`) | `ProductsUnderManagement` (`ProductAdminList`) | `ProductDetails` (`ProductDetailPage`) | `SpecificationsForm`, `ProductChangeForm`, `PublishProductForm`, `ProductDetailsForm`, `DiscontinueProductForm`, `ReplacementForm` |
| Approval case (`approvalCaseId`) | `ApprovalCases` (`ApprovalCaseList`) | `ApprovalCaseDetails` (`ApprovalCaseDetailPage`) | `AssignReviewerForm`, `ApproveForm`, `RejectForm`, `ReleaseForm` |

Two more list views are not shown to a person: `ProductRecords` (the `product-records` stream)
and the to-do lists of the four automations (`CasesForTheAgent`, `AgentApprovalsToReport`,
`ReleasesToAnnounce`, `UndecidedCases`).

The events carry three more tags. None of them is an entity of its own:

- `sku` is a field of the product.
- `replacementProductId` and `sourceReferenceId` are product ids.
- The publication gate has no id. Each approval case has one gate, and `PublicationGateReleased`
  and `ChangeApprovedByAgent` carry only the `approvalCaseId`. The gate therefore shows as the `gate` field (locked or
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
| PLC-012 | A specification or details change carries its new values, and only those values are applied | active (drone-web D-039) |
| GOV-001 | An approval case is decided once | active (Governance invariant 2) |
| GOV-002 | A change is released only after it is approved | active (Governance invariant 1) |
| GOV-003 | A publication gate is released once | proposed |
| GOV-004 | The Governance policy sets the lowest risk level of a case; the requester cannot lower it | active (CJ D2a) |
| GOV-005 | The policy levels: details-change low, specification-change medium, lifecycle-change high | proposed (the exact table) |
| GOV-006 | A person decides a case only after a reviewer is assigned to it | active (CJ D1a) |
| GOV-007 | The manager who asked for a change does not review, approve or reject it | active (CJ D1a, four eyes) |
| GOV-008 | The agent alone approves only a low-risk change; a person confirms a medium-risk change and decides a high- or critical-risk change | active (CJ D2a, D3b) |
| GOV-009 | An approval case that nobody decides within the review period expires | active (CJ D10b) |
| GOV-010 | The review period is 14 days | proposed (the number N) |
| GOV-011 | A verdict other than approve sends the case to a person | proposed |
| GOV-012 | Any person who holds the reviewer role for the case's risk level may decide it | active (drone-web D-039; replaces "only the assigned reviewer approves it") |
| GOV-013 | The agent's approval of a low-risk change releases its publication gate, and the reviewers are told | active (drone-web D-039) |

## CJ's answers (2026-10-29)

| Question | Answer | Where in the model |
| --- | --- | --- |
| D1 Reviewer and four eyes | D1a: a reviewer is assigned before a decision; the requester may not approve. Who else may decide: see the later answer below. | GOV-006, GOV-007, GOV-012 |
| D2 Risk level | D2a: a Governance policy sets the risk level from the change type; the requester cannot lower it. | GOV-004, GOV-005, `OpenApprovalCase` |
| D3 Review of spec and detail changes | D3b: every change on an active product goes through review. Low: the agent approves. Medium: the agent checks, a person confirms. High or critical: a person decides with four eyes. | PLC-009, GOV-008, the agent slices |
| D4 Discontinued product | D4a: details may change; specifications are frozen. | PLC-010 |
| D5 Drafts on `product-records` | D5a: no drafts. `draft` is removed from `lifecycleState` in `design/contracts/product-lifecycle.yaml`. | `FeedProductRecords` |
| D6 Who publishes after the release | D6a: the manager (unchanged). | `PublishProduct` |
| D7 Two lifecycle operations | D7a: keep both. `setProductLifecycleState()` is the request and answers `202 Accepted` with the approval case; `discontinueProduct()` is the effect after the release. The ADDR files say so now. | `RequestProductChange`, `DiscontinueProduct` |
| D8 Replacement product | D8a: it must exist and be active. | PLC-011 (proposed, not checked) |
| D9 Reactivation | D9a: none; draft a new product. | PLC-005 |
| D10 Case expiry | D10b: a case expires after N days without a decision, through a timed automation. N is 14 (proposed). Case statuses are now `pending`, `approved`, `rejected`, `released`, `expired` in `define/boundaries.md`, `define/resources.md` and the OpenAPI file. | `ExpireUndecidedCase`, GOV-009, GOV-010 |

## CJ's answers to the PR #26 questions (2026-10-29, drone-web D-039)

| Question | Answer | Where in the model |
| --- | --- | --- |
| Typed values on the request | Yes: the request carries the typed values, and the applied values must equal the approved ones. | `ProductChangeRequested` (`targetState`, `new...` fields), PLC-012, `RequestProductChange`, `RecordSpecifications`, `ReviseProductDetails` |
| Agent approval and the gate | Yes: an agent approval releases the gate by itself, and a person is told. | GOV-013, `ApproveAsAgent`, `TellReviewersOfAgentApproval`, `AnnounceRelease`, `ReleaseChange` |
| GOV-012 | Only the assigned reviewer is too rigid: any person with the reviewer role for the case's risk level may decide. Fall back to the assigned reviewer only if this is too complex. | GOV-012, `ReviewerDirectory`, `ApproveChange`, `RejectChange`; no fallback needed |

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
  one request slice serves the three types. The specification or detail values are typed fields
  of the request (PLC-012); after the release the manager applies them in `RecordSpecifications`
  or `ReviseProductDetails`, which accept only those values.
- The request carries `targetState` and typed new values; ADDR's `setProductLifecycleState()`
  has only `targetState` and `reason`. The ADDR operations for a reviewed specification or details
  change are open (`galaxitech-website-k93`).
- An agent approval releases the gate without `releasePublicationGate()`, and the reviewer roles
  per risk level come from a reviewer directory that ADDR does not name (drone-web D-039).

## Open questions for CJ

Questions 1 and 2 of PR #26 are answered (drone-web D-039, above). Two remain:

1. Do `updateProductSpecifications()` and `updateProductAttributes()` also answer `202 Accepted`
   on an active product (CJ D3b)? The ADDR files still give `200 OK` (`galaxitech-website-k93`).
2. The OpenAPI `riskLevel` enum has no `critical`; `define/resources.md` has it
   (`galaxitech-website-bhr`, in progress).

## Validate and render

With [event-model-factory](https://github.com/cjjohansen/event-model-factory) checked out next to this
repo and `npm ci` run in `dsl/kairos/tools`:

```bash
node ../event-model-factory/dsl/kairos/tools/validate.mjs --receipt design/catalog-management-v2/eventmodel/product-lifecycle.kairos.yml
node ../event-model-factory/dsl/kairos/tools/render.mjs design/catalog-management-v2/eventmodel/product-lifecycle.kairos.yml
```

At event-model-factory fd3a2ac the validator reports 0 errors, 0 warnings and 9 info (27 slices,
135 tests, 22 events, 9 views, target prototype). The factory warnings of earlier versions (F9 on
`RequestProductChange`, F30 on the three agent translations, at 7927a4e) are not reported at
0d92369 or fd3a2ac.

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
  alone (test `LeavesAHighRiskCaseToAPerson`) until a decision or the expiry removes them. In the
  same way `ReleasesToAnnounce` holds every case from its submission, and `AnnounceRelease`
  leaves a case alone while its gate is locked (test `LeavesALockedGateAlone`).
- Two facts that lead to one message. A published message comes from one event, and each event
  from one slice (K13). A release by a reviewer and a release by the agent's approval are two
  facts from two decisions, so the model needs the extra automation `AnnounceRelease` to give
  Product Data one `ChangeReleased`.
- A conditional rule on typed values. Kairos has no type for "these fields are required when
  `changeType` is X". The `new...` fields of the request are optional, and PLC-012 with the error
  `NewValuesMissing` says which ones a change type needs.
- A task menu. Kairos has no link from a detail view or its screen to the command screens that
  start from it. A `lookup` points only at a list view (K7). The model names the tasks in the
  description of `ShowProductDetails` and `ShowApprovalCaseDetails`, and each command screen says
  that its id comes from the detail page. The menu belongs in a Tessera file
  (`galaxitech-website-sa8`).
- The signed-in user as the source of a value (emf-bzu.31). `requestedBy`, `decidedBy` and
  `releasedBy` are screen fields with a description. The reviewer roles of the signed-in person
  come from the reviewer directory port, not from the sign-in.
