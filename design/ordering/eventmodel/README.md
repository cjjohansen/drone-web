# Ordering: order a drone and follow the delivery

> **Draft: no ADDR yet.** No ADDR run covers ordering. The storefront ADDR covers the read flows
> and stops at "[to cart/checkout]", so this model came before its ADDR work. It stays in the repo
> as a draft. The showcase event model moves to a catalog-management-v2 state-change flow that is
> grounded in its ADDR work.

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

20 slices in three chapters, with 67 given/when/then scenarios and 11 views:

| Chapter | Slices |
| --- | --- |
| Know what we sell | `DescribeProduct` and `PriceProduct` keep Ordering's own copy of product records and effective prices from the published streams in [`design/contracts/`](../../contracts/); `BrowseDrones` lists them, and keeps a price that arrives before its product record; `ViewDrone` shows one drone |
| Order and pay | `PlaceOrder` (three fields), `PayForOrder` (one button; the bought payment provider takes the card; the amount comes from the order's own events), the provider's webhooks (`RecordCapturedPayment`, `FlagPaymentAmountMismatch`, `RecordDeclinedPayment`), `CheckPaymentMismatches` for staff, `NotifyPaymentDeclined` (push), `ListPayments` and `ViewPayment` for staff, and `ListMyOrders` |
| Ship and deliver | `ReleasePaidOrder` sends a paid order to the warehouse, and holds it when the captured amount is less than the order total (ORD-007, proposed); the warehouse and the carrier report the parcel (`RecordShipment`, which refuses an order that was not released to the warehouse: unpaid or held, and `RecordDelivery`); `NotifyOrderShipped` and `NotifyOrderDelivered` send the push notifications; `TrackOrder` shows one order's status |

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
  context's broker messages.
- 2 × F6: the factory fills a port request from command fields only. `PayForOrder` takes the total
  and currency from the order's own events, so `StartPayment` lacks them on the command. CJ keeps
  `PayForOrder` as it is (2026-10-29). The 2 F6 warnings stay until event-model-factory lets a port
  request take values from the events the decision loads. Then CJ revisits where `PayForOrder`
  takes its amount.

## Open questions

- **Mismatch rows never leave the staff list.** No slice lets a person mark a row of
  `PaymentMismatches` as checked. This stays open until ordering has ADDR (CJ, 2026-10-29).
- **Refund of an overpayment.** An overpaid order ships (ORD-007). How and when Ordering refunds
  the surplus is open.
- **Nothing releases a held order.** An underpaid order stays on the to-do list
  `PaidOrdersToRelease`. No slice lets the customer pay the rest or cancel the order.
- **ORD-004 blocks a second payment for a held order.** A held order has `OrderPaid`, so
  `PayForOrder` refuses a payment for the rest (`OrderAlreadyPaid`). If a held order must take a
  second payment, ORD-004 must change. This is not modelled.
- **The customer sees "paid" for a held order.** `MyOrders` and `OrderStatus` read `OrderPaid`,
  so a held, underpaid order shows the status `paid`. Should a held order show its own status?
  This is not modelled.

Decided on 2026-10-29: a mismatched payment goes to the warehouse only when the captured amount
is at least the order total. `ReleasePaidOrder` holds an underpaid order and releases an overpaid
one (rule ORD-007, `status: proposed`, because ordering has no ADDR yet). `PaidOrder` is now
published from `OrderReleasedToWarehouse`, not from `OrderPaid`. `RecordShipment` (ORD-006)
refuses a shipment for an order without `OrderReleasedToWarehouse`, so a held order cannot ship.
CJ confirmed this wider ORD-006 on 2026-10-29.

Example data is EU only (CJ, E1a, 2026-10-29): addresses in Germany and the Netherlands, prices
in EUR.

## What Kairos cannot say yet

- Commands made offline and sent later. Noted in `PlaceOrder`'s description.
- The signed-in customer as the source of `customerId`, and "my orders" filtering.
- A view that keeps an update for a row it does not have yet (Kairos v0 ignores such an
  update). `BrowseDrones` states the wanted outcome in a test and its description; `ViewDrone`
  has the same need.
- A single view opened from two lists. `keyed-by` names one list, so the board links
  `PaymentDetails` to `Payments` only, not to `PaymentMismatches`. `ViewPayment` says so in its
  description.
