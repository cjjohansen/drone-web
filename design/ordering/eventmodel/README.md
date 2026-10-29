# Ordering: order a drone and follow the delivery

> **Draft: no ADDR yet.** No ADDR run covers ordering. The storefront ADDR covers the read flows
> and stops at "[to cart/checkout]", so this model came before its ADDR work. It stays in the repo
> as a draft. The showcase event model moves to a catalog-management-v2 state-change flow that is
> grounded in its ADDR work (galaxitech-website-498).

An event model of one mobile flow: a customer orders a drone on a phone, pays for it, follows the
order, and gets a push notification when the payment is declined, when the order ships and when it
is delivered.

| File | What it is |
| --- | --- |
| [`order-and-track.kairos.yml`](order-and-track.kairos.yml) | The model, in [Kairos](https://github.com/cjjohansen/event-model-factory/tree/main/dsl/kairos) v0. Its header holds the flow in words and CJ's answers to the open questions. |
| [`order-and-track.kairos.intent.yml`](order-and-track.kairos.intent.yml) | The intention sidecar: `to-be`, validation target `prototype`. |
| [`order-and-track.board.html`](order-and-track.board.html) | The rendered board: one self-contained HTML page. Open it in a browser. |
| [`order-and-track.kairos.last-check.json`](order-and-track.kairos.last-check.json) | The validator's receipt: version, time, model hash, target and counts. |

## The flow

19 slices in three chapters, with 62 given/when/then scenarios and 10 views:

| Chapter | Slices |
| --- | --- |
| Know what we sell | `DescribeProduct` and `PriceProduct` keep Ordering's own copy of product records and effective prices from the published streams in [`design/contracts/`](../../contracts/); `BrowseDrones` lists them, and keeps a price that arrives before its product record; `ViewDrone` shows one drone |
| Order and pay | `PlaceOrder` (three fields), `PayForOrder` (one button; the bought payment provider takes the card; the amount comes from the order's own events), the provider's webhooks (`RecordCapturedPayment`, `FlagPaymentAmountMismatch`, `RecordDeclinedPayment`), `CheckPaymentMismatches` for staff, `NotifyPaymentDeclined` (push), `ListPayments` and `ViewPayment` for staff, and `ListMyOrders` |
| Ship and deliver | The warehouse and the carrier report the parcel (`RecordShipment`, which refuses an unpaid order, and `RecordDelivery`); `NotifyOrderShipped` and `NotifyOrderDelivered` send the push notifications; `TrackOrder` shows one order's status |

Ordering is a new bounded context. It follows the engineering strategy: payment is bought and card data
never reaches Drone Web (P1), and Ordering reads other contexts only through their published streams (P3).
No ADDR run covers Ordering yet (P4).

## Views per entity

CJ's rule (2026-10-29): every entity that the events are about gets a list view and a detail view,
unless a reason is recorded here. The entities follow from the event tags.

| Entity (tag) | List view | Detail view | Who sees it |
| --- | --- | --- | --- |
| Drone (`productId`) | `DronesForSale` (`BrowseDrones`) | `DroneDetails` (`ViewDrone`), new | Customer |
| Order (`orderId`) | `MyOrders` (`ListMyOrders`) | `OrderStatus` (`TrackOrder`), already there | Customer |
| Payment (`paymentId`) | `Payments` (`ListPayments`), new | `PaymentDetails` (`ViewPayment`), new | Order desk |
| Payment mismatch (`paymentId`) | `PaymentMismatches` (`CheckPaymentMismatches`) | `PaymentDetails` (`ViewPayment`) | Order desk |
| Shipment (`trackingNumber`) | none, reason below | none, reason below | Customer, through the order |

Reasons and notes:

- **Order:** `TrackOrder` is the order's detail view. No second order detail is added.
- **Payment:** the customer sees a payment only as the status of the order (`MyOrders`,
  `OrderStatus`), so the customer has no payment views. The order desk needs every attempt of an
  order (a declined card, then a captured one) to check a mismatch, so the payment views are staff
  screens.
- **Payment mismatch:** a mismatch is a fact about one payment and has the same identity,
  `paymentId`. Its detail is `PaymentDetails`, which shows the asked amount, the captured amount
  and the difference. A separate mismatch detail would repeat those fields.
- **Shipment:** no own list or detail view. In this model one order has exactly one parcel, and
  `MyOrders` and `OrderStatus` already show the carrier, the tracking number and the dates. The
  warehouse (ERP) and the carrier own the parcel; Drone Web builds no warehouse system (strategy
  P1). Revisit this when split shipments are modelled (one of the mismatch causes in ORD-005).
- **Customer:** `customerId` is a field, not a tag. No event is about a customer, and sign-in
  belongs to another context, so Ordering has no customer views.

## Validate and render

With a current [event-model-factory](https://github.com/cjjohansen/event-model-factory) checked out
next to this repo and `npm ci` run in `dsl/kairos/tools` (an old checkout rejects `chapter`):

```bash
node ../event-model-factory/dsl/kairos/tools/validate.mjs --receipt design/ordering/eventmodel/order-and-track.kairos.yml
node ../event-model-factory/dsl/kairos/tools/render.mjs design/ordering/eventmodel/order-and-track.kairos.yml
```

The intention sidecar sets the target `prototype`. The validator reports 0 errors, 9 warnings and
7 M5 infos (a translation cannot prove that the row it updates exists).
All nine are factory limits, not modelling errors:

- 7 × F30: the prototype factory cannot yet generate a translation that listens to a foreign
  context's broker messages (emf-bzu.14).
- 2 × F6: the factory fills a port request from command fields only. `PayForOrder` takes the total
  and currency from the order's own events, so `StartPayment` lacks them on the command.

## What Kairos cannot say yet

- Commands made offline and sent later (emf-a17). Noted in `PlaceOrder`'s description.
- The signed-in customer as the source of `customerId`, and "my orders" filtering (emf-a9t, emf-bzu.31).
- A view that keeps an update for a row it does not have yet (emf-m9a.67: such an update is
  ignored). `BrowseDrones` states the wanted outcome in a test and its description; `ViewDrone`
  has the same need.
- A single view opened from two lists. `keyed-by` names one list, so the board links
  `PaymentDetails` to `Payments` only, not to `PaymentMismatches`. `ViewPayment` says so in its
  description.
