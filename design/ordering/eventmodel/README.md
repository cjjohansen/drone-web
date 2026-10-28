# Ordering: order a drone and follow the delivery

An event model of one mobile flow: a customer orders a drone on a phone, pays for it, follows the
order, and gets a push notification when it ships and when it is delivered.

| File | What it is |
| --- | --- |
| [`order-and-track.kairos.yml`](order-and-track.kairos.yml) | The model, in [Kairos](https://github.com/cjjohansen/event-model-factory/tree/main/dsl/kairos) v0. Its header holds the flow in words. |
| [`order-and-track.board.html`](order-and-track.board.html) | The rendered board: one self-contained HTML page. Open it in a browser. |
| [`order-and-track.kairos.last-check.json`](order-and-track.kairos.last-check.json) | The validator's receipt: version, time, model hash, target and counts. |

## The flow

13 slices in three chapters, with 42 given/when/then scenarios:

| Chapter | Slices |
| --- | --- |
| Know what we sell | `DescribeProduct` and `PriceProduct` keep Ordering's own copy of product records and effective prices from the published streams in [`design/contracts/`](../../contracts/); `BrowseDrones` lists them |
| Order and pay | `PlaceOrder` (three fields), `PayForOrder` (one button; the bought payment provider takes the card), the provider's webhooks (`RecordCapturedPayment`, `RecordDeclinedPayment`), and `ListMyOrders` |
| Ship and deliver | The warehouse and the carrier report the parcel (`RecordShipment`, `RecordDelivery`); `NotifyOrderShipped` and `NotifyOrderDelivered` send the push notifications; `TrackOrder` shows one order's status |

Ordering is a new bounded context. It follows the engineering strategy: payment is bought and card data
never reaches Drone Web (P1), and Ordering reads other contexts only through their published streams (P3).
No ADDR run covers Ordering yet (P4).

## Validate and render

With [event-model-factory](https://github.com/cjjohansen/event-model-factory) checked out next to this
repo and `npm ci` run in `dsl/kairos/tools`:

```bash
node ../event-model-factory/dsl/kairos/tools/validate.mjs --receipt design/ordering/eventmodel/order-and-track.kairos.yml
node ../event-model-factory/dsl/kairos/tools/render.mjs design/ordering/eventmodel/order-and-track.kairos.yml
```

The model has no intention sidecar yet, so the validator checks it as `to-be` at the default target
`prototype`. It reports 0 errors and 6 warnings. All six are F30: the prototype factory cannot yet
generate a translation that listens to a foreign context's broker messages (emf-bzu.14). They are
factory limits, not modelling errors.

## What Kairos cannot say yet

- Commands made offline and sent later (emf-a17). Noted in `PlaceOrder`'s description.
- The signed-in customer as the source of `customerId`, and "my orders" filtering (emf-a9t, emf-bzu.31).
