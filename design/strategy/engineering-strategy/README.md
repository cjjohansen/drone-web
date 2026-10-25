# Engineering strategy for Drone Web

An engineering (IT) strategy for Drone Web, the drone and mechatronic parts shop that this repository designs. It answers one question: **what should Drone Web build, what should it buy or rent, and which rules keep the system it builds coherent?**

- [strategy.md](strategy.md) is the strategy itself.
- [drone-web-build-buy.svg](drone-web-build-buy.svg) is a small Wardley map of the build/buy decision, with its Mermaid source in [drone-web-build-buy.mmd](drone-web-build-buy.mmd).

## The method: Will Larson, *Crafting Engineering Strategy*

The strategy follows the process in Will Larson's book *Crafting Engineering Strategy* (O'Reilly, 2025). Larson publishes the chapters on his blog, and the five steps used here are taken from his own description of them in [Components of engineering strategy](https://lethain.com/components-of-eng-strategy/):

| Step | What it does (paraphrased) | Larson's chapter |
|------|-----------------------------|------------------|
| Explore | Look at how others have solved similar problems before choosing an approach | [Exploring for strategy](https://lethain.com/exploring-for-strategy/) |
| Diagnose | Describe the situation the strategy must deal with, before proposing solutions | [Diagnosis for strategy](https://lethain.com/diagnosis-for-strategy/) |
| Refine | Test the ideas against reality with strategy testing, systems modeling and Wardley mapping | [Refining strategy](https://lethain.com/refining-eng-strategy/), [Wardley mapping](https://lethain.com/wardley-mapping/) |
| Policy | Decide the tradeoffs that turn the diagnosis into a plan | [Policy for strategy](https://lethain.com/policy-for-strategy/) |
| Operations | Set up the mechanisms that make the policies happen in practice | [Operations for strategy](https://lethain.com/operations-for-strategy/) |

The strategy was worked out in that order. It is **presented** policy first, because Larson recommends that order for readers in [Making engineering strategies more readable](https://lethain.com/readable-engineering-strategy-documents/): most readers want to know what the strategy requires, then how it is run, and only some want the reasoning behind it.

Everything in this folder is written in our own words. Larson's text and figures are not reproduced; read his chapters for the method itself. The strategy also shows where his steps line up with Richard Rumelt's strategy kernel (diagnosis, guiding policy, coherent actions) from *Good Strategy Bad Strategy* (2011).

## The company is fictional

Drone Web is a fictional company. The case was anonymised from real interviews, and this strategy uses only what is in this repository: the README, the ADDR runs in `design/`, the anonymised JTBD material in `Specs/Case/JTBD/`, and the Ralph Loop logs in `.ralph/`. The strategy is illustrative: it shows how to craft an engineering strategy from design artifacts, not advice for any real business. Where it needs a number the repository does not give (a time budget, a target), it says so and treats the number as a starting point to be checked.

The strategy was drafted with an AI agent (Claude Code) and reviewed by Christian Johansen (GALAXITECH).

## How it relates to Architecture for Flow

A separate example in [`design/strategy/architecture-for-flow/`](../architecture-for-flow/) applies Susanne Kaiser's Architecture for Flow to the same shop. Its Wardley map is the landscape: the users, their needs and the whole value chain. This strategy works inside that landscape and decides only the build/buy/rent question and the rules around it. The small map here zooms in on that decision and does not replace the landscape map.

## Rendering the map

The map was written in Mermaid `wardley-beta` and rendered with GALAXITECH's Wardley-map renderer, which adds the house conventions (user icon, gold user needs) and checks labels and links for overlaps. In the SVG, a double open ring marks **build**, a filled white ring marks **buy**, and a grey ring marks **rent** (Mermaid's `outsource` mark). Any Mermaid version with `wardley-beta` support also renders the `.mmd` file; the `%%` lines are comments.
