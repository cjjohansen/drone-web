# Order rules for selling drones and drone parts to EU buyers

Research: realistic order rules for selling drones in the EU. Date: 2026-10-29.
Research, not legal advice. A lawyer must review before launch.

## Recommendation

1. Drop ORD-003 for good. No EU law limits a consumer order to 1 to 5 drones. I found no shop practice that matches it.
2. Real limits on quantity come from four other places: stock, fraud control (shop practice), carrier dangerous-goods limits per parcel, and export or sanctions checks. None gives a fixed "1 to 5" rule. Model each as its own rule.
3. Model these as hard rules: delivery country on a sell list; price and total include VAT of the delivery country; the product carries the data the law needs (class label, CE mark); the 14-day withdrawal right; payment capture at shipment (Denmark).
4. Treat age 16, operator registration and remote ID as information the shop gives, not as order blocks. The buyer flies and registers. The shop must not sell a drone without the right label and papers.
5. The model uses USD and a US address. An EU shop needs EUR, VAT-inclusive prices and an EU delivery address check. Mission Control should raise this with CJ.

## A. Drone regulation (EU 2019/945 and 2019/947)

Hard law:

- Class limits (checked, EASA open-category page): C0 under 250 g; C1 under 900 g; C2 under 4 kg; C3 and C4 under 25 kg.
  https://www.easa.europa.eu/en/domains/drones-air-mobility/operating-drone/open-category-low-risk-civil-drones
- A distributor (the shop) must check before it sells: CE marking, class label where required, the manufacturer's instructions and information notice, and that manufacturer and importer did their duties. Instructions must be in a language the buyer understands. A distributor who sells under its own brand, or changes the product, becomes the manufacturer. A non-conforming product must not be sold. Sources: EASA FAQ 135905 (points to Articles 8 and 9 of 2019/945) https://www.easa.europa.eu/en/faq/135905 ; summary https://eudroneport.com/blog/obligations-uas-distributors-eu/ ; UK retained copy of Article 9 https://regulatorylibrary.caa.co.uk/2019-945/Content/Regs/Article%209%20-%20Obligations%20of%20distributors.htm (UK text; I did not read the EU article on EUR-Lex).
- A drone meant for the open category must carry a class label. A drone without a label may be supplied only if it clearly targets buyers who fly in the specific category (EASA FAQ 135905).
- Operator registration (the buyer): required for C1 to C4. For C0 it is required only if the drone has a camera or sensor and is not a toy (EASA page).
- Minimum age of remote pilot: 16; none for a C0 toy. A Member State may lower it (EASA page footnote: to 12 on its own territory). EASA FAQ 116466: no minimum for C0 in A1, for a private-built drone under 250 g, or under direct supervision. Denmark's own age rule: unchecked.
- Remote ID: open-category drones need a remote identification system, with limited exceptions (EASA page). The page lists no classes or dates. From memory, unchecked: direct remote ID is built into labelled C1 to C3 drones; C0 has none; drones placed on the market before 1 January 2024 are treated as legacy.
- Privately built drones are outside 2019/945. Motors, ESCs, flight controllers and frames sold as parts are not a drone under 2019/945 (my reading, unchecked). Whether a BNF or ARF kit counts as a complete UAS: unchecked.

Shop practice:

- Show class label (or "no class") and weight on the product page.
- Link the buyer to the national authority for registration and training.
- Do not check registration or age at order time. The law puts those duties on the operator at flight time, and a shop cannot verify them.

## B. Lithium batteries: transport

- UN3480 is lithium-ion batteries alone. UN3481 is lithium-ion batteries packed with or contained in equipment. Source (secondary): https://www.parcelparcel.com/nl_EN/shipping-lithium-batteries/
- Air, IATA: cells up to 20 Wh and batteries up to 100 Wh are Section II, with packages up to 5 kg. Standalone batteries ship at no more than 30% state of charge. Larger batteries are Section I with full dangerous-goods paperwork. Sources: secondary summaries (FAA and ICAO charts from search; they are 2018 and 2022 dated, and the current IATA DGR was not read).
- Size example (my calculation, nominal 3.7 V per cell): a 6S 1300 mAh pack is about 29 Wh. A 6S 5000 mAh pack for an X500-class drone is about 111 Wh and so is Section I.
- Road in the EU: ADR applies. Small-quantity exemptions (special provision 188) exist. I did not read the ADR text.
- Carriers: DHL Express does not accept UN3480 batteries on road transport to or from ADR states (DHL guide https://mydhlplus.dhl.com/content/dam/downloads/global/en/lithium-batteries/dhl_express_lithium_battery_guide.pdf.coredownload.pdf). UPS needs pre-approval for standalone lithium-ion by air (2022 secondary source https://www.shipsaving.com/blog/how-to-ship-batteries). Carrier rules change. Check each carrier contract.
- The limit is per parcel (weight, Wh), not per drone.
- Shop practice (from my knowledge, unchecked): ground carriers only; EU only; separate parcel for batteries; show Wh and shipping limits on the product page.

Model effect: the warehouse and carrier own the packing rule. Ordering needs a product flag "is or contains a lithium battery" and the delivery-country rule.

## C. Batteries as products (unchecked)

Batteries Regulation (EU) 2023/1542 and WEEE Directive 2012/19/EU put producer duties (labelling, take-back, registration per country) on whoever first places the goods on the EU market. I did not read them. This is a business rule outside the ordering model.

## D. Consumer law

I could not open EUR-Lex (empty page). I used the Your Europe summary and my memory.

Checked (https://europa.eu/youreurope/citizens/consumers/shopping/returns/index_en.htm):
- 14 days to withdraw from an online purchase, no reason needed. For goods the period starts at delivery.
- The buyer pays the return cost unless the seller did not say so before the sale. The seller pays for defective goods.
- Exceptions include made-to-order or personalised goods and perishable goods.

From memory, unchecked (Directive 2011/83/EU and 2019/771):
- Refund within 14 days of the withdrawal notice; the seller may wait for the goods or proof of return (Art 13).
- No withdrawal for sealed goods not fit to return for health or hygiene reasons once unsealed (Art 16). Do not assume batteries or electronics are excluded.
- Pre-contract information (Art 6) and an order button that states the order obliges payment (Art 8(2)). This affects the PayForOrder screen.
- Delivery within 30 days unless agreed (Art 18).
- 2-year legal guarantee for consumer goods (Directive 2019/771). A shop cannot cut it. A maker's commercial warranty is extra.
- A business buyer has no withdrawal right and no consumer guarantee. The model has "Professional Integrator" and "Casual Browser" actors. The shop must record which one buys.

Denmark, payment timing (checked, secondary):
- A Danish shop may take the money when it ships, not at purchase. Basis: the buyer pays when the seller delivers, and good marketing practice. The Consumer Ombudsman said so in March 2024. Prepayment is allowed only if clearly agreed (terms alone are not enough) and objectively justified, for example made-to-order goods. Source: https://www.danskerhverv.dk/presse-og-nyheder/nyheder/2024/december/hvornar-ma-du-trakke-pengene-for-forbrugernes-kob/ . I did not find the statute paragraph. Other Member States: unchecked.
- Effect: authorise at order, capture when the warehouse reports `ParcelDispatched`. The model has `PaymentCaptured` make `OrderPaid` and needs a new authorise-then-capture step.

## E. VAT and OSS

Checked (https://vat-one-stop-shop.ec.europa.eu/one-stop-shop_en):
- Under EUR 10,000 net per year of EU-wide distance sales to consumers, the shop may charge its home VAT. Above it, VAT is due in the Member State where transport ends, at that rate.
- Union OSS returns are quarterly through the home Member State.

From memory, unchecked: goods from outside the EU use import VAT and IOSS for consignments up to EUR 150; a business with a valid EU VAT number gets reverse charge; consumer prices must include VAT (Directive 98/6/EC).

## F. Radio equipment, CE and product safety

- Radio equipment (video transmitters, radio links, drones) follows the Radio Equipment Directive 2014/53/EU and needs the CE mark and a declaration of conformity. Evidence: a vendor declaration citing RED and EN 300 440 (https://www.arrma-rc.com/on/demandware.static/-/Sites-horizon-us-Library/default/pdf/docs/Declaration%20of%20Conformity-SPMVT025_Spektrum%2025mW%205.8GHz%20Video%20Transmitter.pdf). The distributor duty to check CE: RED Art 10, from memory, unchecked.
- Power limits: general unlicensed use in the EU is 25 mW on 5.8 GHz and 10 mW on 2.4 GHz for video transmitters (TBS notice, secondary: https://www.kopterworx.com/tbs-rookie-5g8-200mw.html). US-market gear at 600 mW to 1 W is not EU-compliant by default. Sell the EU variant. Sub-band detail: unchecked.
- Unchecked: RED cybersecurity act 2022/30 (from 1 August 2025); General Product Safety Regulation (EU) 2023/988.

## G. Export control and sanctions

- Dual-use Regulation (EU) 2021/821, Annex I, entry 9A012: complete UAVs with range over 300 km, or a 500 kg payload over 300 km (secondary: https://www.thetradehub.eu/de/customs/export-control/annex-i/9a012 ; not checked against the Official Journal). Hobby drones normally fall below. Parts such as high-grade IMUs or thermal cameras may be listed under other entries: unchecked. Export outside the EU of listed items needs a licence.
- Russia and Belarus: Article 12g of Regulation 833/2014 requires a contract clause that bans re-export to Russia when you sell goods in Annexes XI, XX, XXXV or the common high priority list (Annex XL) to any non-partner country. It applies from 20 March 2024. Partner countries in Annex VIII are exempt. Sources: https://vedderprice.com/eu-sanctions-no-russia-no-belarus-clauses ; https://ec.europa.eu/commission/presscorner/api/files/document/print/en/ip_24_963/IP_24_963_EN.pdf . Whether motors, ESCs, FCs or batteries are in Annex XL: unchecked.
- Companies that supply drone parts to Russia sit on Annex IV of Regulation 833/2014 (13th and 15th packages). Screening buyers against EU sanctions lists: from memory, unchecked.

Model effect: a delivery-country allow-list (EU or EEA only at launch) removes most of this section: no export licence, no customs, no no-Russia clause. Keep a sanctions screen of the customer name.

## Per-order limits real shops use (shop practice, unchecked)

I found no primary source. The cheapest check is to read the terms of three real drone or FPV shops.
- A per-customer limit on one product when stock is short or on a launch offer. A stock and promotion rule, set per product.
- Manual review of high-value, new-account or mismatched-country orders: fraud control, a review not a rejection.
- Large business orders go to a quote. A choice, not law.
- Carrier limits per parcel (section B). The warehouse splits shipments.

## Is there any real basis for an order quantity limit?

No law sets a number of drones a consumer may buy. EU drone law regulates the product and the flight, not the count bought. Real bases exist for rules that are not "1 to 5":
1. Stock: quantity at most what the warehouse holds. Ordering has no stock signal today.
2. Fraud: a value or quantity threshold that triggers a review. A configurable policy, not a command error.
3. Dual-use and sanctions: the trigger is the buyer and the destination, not the number.
4. Carrier limits: split the shipment, do not reject the order.
5. Validity: whole number, 1 or more. A high technical cap is a sanity limit only.

Recommendation: replace ORD-003 with "quantity is 1 or more and within available stock", once a stock signal exists. Until then, use "1 or more" with a technical cap.

## Candidate rules for the ordering model

Types: hard = law; policy = shop choice.

| Id | Rule | Basis | Type | Where |
| --- | --- | --- | --- | --- |
| ORD-003 (replace) | Quantity is 1 or more and within stock | Validity, stock | policy | PlaceOrder |
| new | Delivery country is on the sell list (EU or EEA) | Export control, sanctions, VAT scope | policy, legal reason | PlaceOrder: add country |
| new | Customer is not on a sanctions list | EU sanctions | hard (unchecked) | before payment |
| new | Product record carries class label, weight, CE mark, battery flag; the screens show them | 2019/945 distributor duty, RED | hard | ProductData stream, BrowseDrones |
| new | A product without a required label or CE mark is not orderable | 2019/945, RED | hard | extends ORD-001 |
| new | Radio product is the EU variant | RED | hard | ProductData |
| new | Totals include VAT of the delivery country; business with valid VAT number gets reverse charge | VAT Directive, OSS | hard | OrderPlaced: country, vatRate, vatAmount |
| new | Order records consumer or business | Directive 2011/83 | hard | OrderPlaced: customerType |
| new | Customer sees withdrawal right, return cost, delivery time and an "order with obligation to pay" button | Directive 2011/83 Art 6, 8 | hard (unchecked) | PayForOrder screen |
| new | Consumer can withdraw within 14 days of delivery and gets a refund | Directive 2011/83 | hard | new slices after OrderDelivered |
| new | Danish consumer is charged at shipment | Consumer Ombudsman 2024 | hard in Denmark | PayForOrder, payment flow |
| new | Warranty claim for 2 years | Directive 2019/771 | hard (unchecked) | later slice |
| new | Parcel with a lithium battery goes with an accepting carrier; shop splits shipments | ADR, IATA, carrier | hard plus carrier policy | Warehouse (outside system); product flag |
| ORD-004 | An order is paid once | payment control | policy | keep |

Not order rules: age 16, registration, remote ID, geo-awareness. They fall on the buyer. The shop informs.

## Problems in the repo

- `design/ordering/research/buyer-journey.md` does not exist in drone-web (the folder `design/ordering/research/` did not exist). I could not read it.
- The model examples use USD and a Seattle address.
- The model has no VAT, country, customer type or authorise-then-capture step.

## Unchecked, with the cheapest check

- Exact articles of 2019/945, 2019/947, 2011/83, 2019/771: EUR-Lex gave my tools an empty page. Open them in a browser.
- Remote ID per class and dates; geo-awareness: 2019/945 Article 4 and Annex, and Regulation 2020/1058.
- Denmark: pilot age and registration detail: Trafikstyrelsen.
- ADR SP 188, current IATA DGR, current carrier rules (DHL, UPS, PostNord): carrier guides.
- Whether BNF and ARF kits are complete UAS: ask the authority.
- Regulation 2023/1542, WEEE, GPSR, RED cybersecurity act.
- Annex I entries beyond 9A012; Annex XL content with HS codes.
- Danish payment-timing statute: retsinformation.dk.
- Real shop practice on quantity and fraud limits.
- Licences: I used public law texts and web pages for facts only. I copied no long text.
