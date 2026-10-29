# Catalog management: the life of a product (JS1)

An event model of one write-side flow from the catalog-management-v2 ADDR run. A Product Lifecycle
Manager drafts a product. Catalog Governance reviews the request and releases it. The manager
publishes the product, changes it while it is sold, and later discontinues and replaces it. The
discontinuation goes through the same review.

| File | What it is |
| --- | --- |
| [`product-lifecycle.kairos.yml`](product-lifecycle.kairos.yml) | The model, in [Kairos](https://github.com/cjjohansen/event-model-factory/tree/main/dsl/kairos) v0. Its header holds the flow in words and the ADDR sources. |
| [`product-lifecycle.kairos.intent.yml`](product-lifecycle.kairos.intent.yml) | The intention sidecar: `to-be`, target `prototype`. |
| [`product-lifecycle.board.html`](product-lifecycle.board.html) | The rendered board: one self-contained HTML page. Open it in a browser. |
| [`product-lifecycle.kairos.last-check.json`](product-lifecycle.kairos.last-check.json) | The validator's receipt: version, time, model hash, target and counts. |

The other files in this folder (`config.json` with 78 slices, its backups, `high-level-analysis.json`)
are the earlier generated Event Model Studio export. This model used them as input and does not
replace them.

## The flow

16 slices in five chapters, with 57 given/when/then scenarios (58 examples: one outline runs twice), in two contexts:
Product Data (the Product Lifecycle Service, D-037) and Catalog Governance (D-029). They talk only
through published messages: `LifecycleChangeForReview` one way, `ChangeReleased` and
`ChangeRejected` the other way.

| Chapter | Slice | Pattern | ADDR source (`../addr/`) | config.json slice |
| --- | --- | --- | --- | --- |
| Draft | `DraftProduct` | command | JS1 "Submit new product"; `createProduct()` | 1 |
| Draft | `RecordSpecifications` | command | JS1 "Add technical specifications"; `updateProductSpecifications()` | 3 |
| Draft | `FindProductsToManage` | query | JS1 "Search products for management"; `searchProductsForManagement()` | 2, 4, 6, 8, 10, 12 |
| Review | `RequestLifecycleChange` | command | JS1 "Set initial lifecycle state", "Mark product as discontinued"; `setProductLifecycleState()` | 5 |
| Review | `OpenApprovalCase` | translation | `submitApprovalCase(changeType=lifecycle-change)` | 67 |
| Review | `ReviewApprovalCases` | query | Catalog Governance API, ApprovalCase resource | 68, 70, 72, 74 |
| Review | `AssignReviewer` | command | `assignApprovalReviewer()` | 69 |
| Review | `ApproveChange` | command | `recordApprovalDecision(approve)` | 71 |
| Review | `RejectChange` | command | `recordApprovalDecision(reject)` | 71 |
| Review | `ReleaseChange` | command | `releasePublicationGate()` | 73 |
| Publish | `ClearLifecycleChange` | translation | sequence diagram JS1: release, then lifecycle change | (none) |
| Publish | `RecordRefusedLifecycleChange` | translation | ApprovalCase status `rejected` | (none) |
| Publish | `PublishProduct` | command | sequence diagram JS1: `setProductLifecycleState(active)` | 5 |
| Change | `ReviseProductDetails` | command | JS1 "Update product core attributes"; `updateProductAttributes()` | 7 |
| Retire | `DiscontinueProduct` | command | JS1 "Mark product as discontinued"; `discontinueProduct()` | 9 |
| Retire | `LinkReplacementProduct` | command | JS1 "Link replacement product"; `linkReplacementProduct()` | 11 |

The `ProductsUnderManagement` view also feeds the published stream `product-records`
(`ProductRecordChanged`, `design/contracts/product-lifecycle.yaml`). The ordering model
(`design/ordering/eventmodel/`) reads that stream.

Not in this flow: JS1 bulk ingestion (Bulk Ingestion API). It is a flow of its own.

## Rules

| Rule | Title | Status |
| --- | --- | --- |
| PLC-001 | A SKU belongs to one product only | active (`createProduct()` 409) |
| PLC-002 | The lowest supply voltage is not above the highest | proposed |
| PLC-003 | A product goes live only with its identity and specifications recorded | active (boundary invariant 1) |
| PLC-004 | A product moves only from draft to active and from active to discontinued | proposed |
| PLC-005 | A discontinued product does not return to active | active (boundary invariant 3) |
| PLC-006 | A product has at most one lifecycle request in review | proposed |
| PLC-007 | A lifecycle change takes effect only after Governance released it | active (Governance invariant 1, D-037) |
| PLC-008 | Only a discontinued product gets a replacement | active (`linkReplacementProduct()`) |
| GOV-001 | An approval case is decided once | active (Governance invariant 2) |
| GOV-002 | A change is released only after it is approved | active (Governance invariant 1) |
| GOV-003 | A publication gate is released once | proposed |

## Where the model departs from ADDR (proposed)

- The manager asks Product Data for the lifecycle change, and Product Data sends the request to
  Governance. In the ADDR sequence diagram the manager calls Governance directly. The change keeps
  the product rules (PLC-003 to PLC-006) inside Product Data (`define/boundaries.md`, section D).
- `pending-approval` is not a lifecycle state. A product in review keeps its state and shows the
  review in a separate `review` column, because a product in review for discontinuation is still
  active and still sold.
- `sourceReferenceId` is a `uuid` (the product id), not a free `string` as in the OpenAPI file.

## Open questions for CJ

1. Must a reviewer be assigned before a decision? May the manager who asked also approve (four eyes)?
2. Who sets the risk level: the manager, or a Governance policy? Does a low risk skip review?
3. Do spec changes and detail changes on an active product need review? D-037 calls
   `product-specifications` the Core contract.
4. May a discontinued product's details or specs still change?
5. Does `product-records` carry drafts? D-037 says consumers never see unapproved facts. The
   contract enum includes `draft`.
6. Should the release itself make the product active (an automation), or does the manager publish it?
   The model follows the sequence diagram: the manager publishes it.
7. ADDR has both `setProductLifecycleState(discontinued)` and `discontinueProduct()`. The model
   uses the first for the request and the second for the effect. Is that the intent?
8. Must the replacement product exist and be active? The model cannot check it yet (see below).
9. What is the "explicit reactivation policy" of boundary invariant 3?
10. When does an approval case become `expired` (`define/boundaries.md`)? `define/resources.md` and
    the OpenAPI file list other statuses.

## Validate and render

With [event-model-factory](https://github.com/cjjohansen/event-model-factory) checked out next to this
repo and `npm ci` run in `dsl/kairos/tools`:

```bash
node ../event-model-factory/dsl/kairos/tools/validate.mjs --receipt design/catalog-management-v2/eventmodel/product-lifecycle.kairos.yml
node ../event-model-factory/dsl/kairos/tools/render.mjs design/catalog-management-v2/eventmodel/product-lifecycle.kairos.yml
```

At event-model-factory 7927a4e the validator reports 0 errors, 0 warnings and 2 info. Both info
findings are M5 on the translations `ClearLifecycleChange` and `RecordRefusedLifecycleChange`. A
product id from Governance cannot prove that the product row exists. Each translation has a test
that ignores a message for an unknown product (emf-m9a.67: views ignore updates for rows they do
not have).

## What Kairos cannot say yet

- A decision cannot load a second thing of the same kind under another field name. The replacement
  in `LinkReplacementProduct` is a product, but the command names it `replacementProductId`. K27
  rejects a `given` event for it, so the model does not check that the replacement exists.
- The signed-in user as the source of a value (emf-bzu.31). `decidedBy` and `releasedBy` are screen
  fields with a description.
