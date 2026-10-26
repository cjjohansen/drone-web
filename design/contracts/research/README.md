# Contract options (research)

The options that were compared before drone-web's published product contracts were chosen. They are kept
as a record of the reasoning. None of the files here is a contract; the contracts are in
[`design/contracts/`](../README.md).

| Option | Idea | Files |
| --- | --- | --- |
| A | Full snapshots: Product Lifecycle publishes the whole product, including price and stock it copies from Pricing and Inventory | [`option-a.yaml`](option-a.yaml) |
| B | Thin events plus a query API: owners announce "product X changed, now at version N" and consumers fetch the state over HTTP | [`option-b.yaml`](option-b.yaml), [`option-b-query.openapi.yaml`](option-b-query.openapi.yaml) |
| C | Owner events plus one Product View assembler that joins them and publishes one snapshot for every consumer | [`option-c.yaml`](option-c.yaml) |
| D | **Chosen.** One source-aligned fact stream per owner; each consumer owns its join | [`design/contracts/`](../README.md) |

**Why D won:** A makes Product Lifecycle republish facts it does not own, B pushes synchronous callbacks and
the join into every consumer, and C assumes every consumer wants the same join. D keeps one producer per fact
and lets each consumer build only what it needs, with a shared Product View only once two consumers need the
same rule. The decision is D-037 "Product event contracts: source-aligned fact streams" in
[`.ralph/agent/decisions.md`](../../../.ralph/agent/decisions.md).

Also here:

- [`contract-options.html`](contract-options.html): the comparison page (open it in a browser), with the
  data mesh view, the trade-offs per option and the questions that were open.
- [`data-products-and-lineage.md`](data-products-and-lineage.md): the data mesh analysis behind option D:
  which context produces which product data, the lineage, and where drone-web was silent.

The research uses the channel names of its time (`product.specification-updated`, `price.base-price-set`,
...). The published contracts renamed them; see the tables in [`design/contracts/README.md`](../README.md).
