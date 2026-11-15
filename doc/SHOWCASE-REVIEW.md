# InvestSkill Showcase — How It Was Made, and Whether It Should Become a Skill

> **Scope:** A review of the Traditional Chinese showcase in the sibling repo [`yennanliu/InvestSkill-test`](https://github.com/yennanliu/InvestSkill-test) ([live](https://yennj12.js.org/InvestSkill-test/showcase/index.html)) — what it is, how it was generated, the mindset behind it, the process as a reusable recipe — and an evaluation of whether InvestSkill should gain a skill that produces this kind of output.
> **Date:** 2026-11-15 · reviewed against InvestSkill-test `0984b6e` and InvestSkill v1.14.1
> **Nature:** Review and recommendation only. No skill, prompt or site file is changed by this document.

---

## 1. Summary

- The showcase is **eight linked report pages** that run the framework catalogue on one four-stock basket (MU, SKHY, MRVL, SNDL) from **one data snapshot** dated 2026-07-29.
- It was **authored once in a Claude session** and then turned into a **deterministic Python generator** (about 6,100 lines, standard library only) whose output CI compares byte for byte with the committed HTML. No model runs at build time.
- Its strength is the mindset, not the tooling: one shared snapshot, every score shown beside its raw input, data defects left visible, and workflows that are allowed to stop and say "no setup".
- **Recommendation: do not add a "showcase" skill now.** What makes the showcase trustworthy is a runtime and a committed real-ticker dataset, and InvestSkill deliberately has neither. Link to it from the site, lift its rules into the existing prompts, and revisit a narrower `basket-report` orchestrator only if users ask for a multi-ticker deliverable (§6).

---

## 2. What the showcase is

| Page | Framework(s) shown | Angle |
|---|---|---|
| `index.html` (hub) | coverage map | Why four unrelated tickers fell 7.8–9.6% on the same day; one central valuation question; where each framework is used |
| `screener.html` | `stock-screener`, `sector-analysis`, `economics-analysis`, `result-validator` | Five dimensions, 22 sub-factors, the raw input beside every score, every exclusion named |
| `mu.html` | `full-report` (15 modules) + `bear-case`, `position-ladder`, `catalyst-calendar`, `result-validator` | Flagship: $820.53 prices an 80.4% operating margin held for ever at 15× |
| `skhy.html` | `result-validator` | Data-integrity audit; the report declines to give a target (47/100, LOW) |
| `mrvl.html` | valuation modules | GAAP vs. non-GAAP gap; three valuation methods disagree by an order of magnitude |
| `sndl.html` | value screen | Value trap: 0.30× book, and book value is shrinking 7.1% a year |
| `workflows.html` | cookbook workflows A–G | Seven chained workflows; C and D stop at their first gate |
| `supply-chain.html` | `industry-map` | HBM value chain: 11 layers, 3 chokepoints, 4 second-order ideas |

The basket is a design choice: three memory/AI semiconductor names that tell three different stories, plus SNDL as a control with nothing to do with AI. One real event (the shared gap-down on 2026-07-28) gives the hub a question to answer rather than a list of reports to index.

---

## 3. How it was generated

The repo history shows three steps, all co-authored with Claude:

| Date | Commit | What happened |
|---|---|---|
| 2026-07-29 | `10db869` | **Authoring.** Eight HTML pages (+5,572 lines) written from a single `yfinance` snapshot. The generator lived outside the repo. The commit records 29 of 30 headline claims machine-checked against the source data, and two corrections found on the way (SNDL's `bookValue` field 27% below the filed balance sheet; MRVL's EV/EBITDA recomputed to 58.3×). |
| 2026-07-29 | `593efa1` | **Reproducibility.** The generator moved into `scripts/showcase/` with the snapshot committed as a fixture. New `site.yml` CI: the committed HTML must equal a fresh render, two renders must be byte-identical, and every page must pass a structural / link / accessibility check. 125 tests added. |
| 2026-08-05 | `58a33f1` | **Design pass.** Motion layered on top of complete pages (the final state is what a reader without JavaScript sees), plus SVG pipeline and phase charts. The workflow-usage table became derived from the workflow definitions, which exposed a "15 modules" claim that listed only 14. |

### The build pipeline

```
fixtures/snapshot.json   one yfinance pull per ticker (450 KB): quote, 4 fiscal years and 5 quarters
        │                of statements, holders, Form 4, option chain, estimates, ^GSPC / ^SOX
        ▼
derive.py                Piotroski, ROIC vs. WACC, three-scenario DCF, 22 screener sub-factors,
        │                max pain, composite score — recomputed on every build, never stored
        ▼
context.py               shared facts (gaps, drawdowns, cyclical normalisation, insider totals),
        │                formatters, the Data & Sources header, the CJK-aware signal box
        ▼
prose.py                 the per-ticker narrative: tagline, thesis, bull and bear points
        │
        ▼
page_*.py + viz.py + shell.py    five page templates, hand-written SVG charts, one CSS/JS shell
        │
        ▼
build.py [--check]       writes docs/showcase/*.html, or diffs a fresh render against it
```

Three properties follow from this shape:

1. **No model at build time.** The LLM's work is frozen in `prose.py` and the page templates. The build is a pure function of the snapshot, so it needs no API key and no network.
2. **No derived-values file.** Metrics are recomputed from the snapshot on each build so they cannot drift from the data they cite.
3. **Self-contained pages.** No CDN, no chart library, no external script — every chart is inline SVG with a data table behind it.

---

## 4. The mindset

These are the ideas worth copying, in rough order of value.

1. **One snapshot, one as-of date.** Every page reads the same file, so no two reports can quote different prices for the same stock.
2. **Show the derivation, not just the score.** Each of the 22 screener sub-factors appears with its raw input; the composite shows weight × sub-score arithmetic; DCF shows its sensitivity grid.
3. **Never back-fill a missing value with a neutral 5.0.** A dimension that cannot be scored is labelled "not assessed" and the weights are shown re-normalised.
4. **Leave defects in and let the validator catch them.** KRW statements against a USD ADR, 13 days of price history, and a vendor field that disagrees with the filing are kept and flagged. A showcase with cleaned data would give `result-validator` nothing to do.
5. **A refusal is a valid result.** Workflows C (dividend portfolio) and D (swing long) stop at their first gate; SKHY gets no price target. The pages present these as the framework working.
6. **Start from a question.** The hub asks whether $820 is 5.3× forward earnings or 16.6× average earnings, and every page is positioned against that.
7. **Generated means generated.** Hand-editing the HTML is pointless because CI reverts it; the only way to change a page is to change the generator.
8. **Decoration is never load-bearing.** Animation only replaces content with the same content; print, reduced-motion and no-JS readers see the finished page.

---

## 5. The process, as a recipe

For anyone repeating this on another basket:

1. **Pick the basket for contrast** — one theme, different positions in it, and one deliberate outlier.
2. **Take one snapshot** and commit it. Fix the as-of date as a constant.
3. **Compute first, write second.** Put every metric in code before any narrative exists.
4. **Run the frameworks in dependency order** (business quality → valuation → market signals → technical → risk); beta and capital structure feed WACC, which feeds the DCF, which feeds the entry zone.
5. **Write the narrative against the computed figures**, then machine-check the headline claims.
6. **Audit before publishing** — `result-validator` on every composite, with the confidence score at the top of the page when it is low.
7. **Gate it in CI** — render equals committed, render is deterministic, links and structure are valid.

---

## 6. Limits of the current showcase

Found while reading the generator; none of these is visible from the pages.

- **The narrative figures are not computed.** `prose.py` holds about 430 dollar figures as plain text and has almost no interpolation. The tables and charts are derived from the snapshot; the sentences are not, and no test compares the two. The "every figure is recomputed" claim holds for the data layer only. The 29-of-30 check was run once, at authoring time.
- **The hub overstates the automation.** It says all four generation steps run in GitHub Actions with no human involvement. The scheduled workflows in that repo produce the Markdown reports under `output/`; the showcase was authored in a session and CI only verifies it.
- **It is pinned to v1.11.0.** It covers 27 frameworks. Eleven current skills do not appear on any page: `compare`, `credit-check`, `earnings-preview`, `etf-analysis`, `fact-check`, `forensic-accounting`, `learning-coach`, `risk-stress-test`, `tax-lens`, `thesis-tracker`, `trade-postmortem`. `full-report` is shown at 15 modules; it now runs 25 at comprehensive depth.
- **The data source is a vendor feed.** `yfinance` is convenient, and the showcase itself found one of its fields 27% off the filing. InvestSkill's own guidance points to primary sources (EDGAR, company IR, FRED).
- **Traditional Chinese only**, and the snapshot is now three and a half months old.
- **InvestSkill does not link to it.** There is no reference to the showcase anywhere in this repo or on its site.

---

## 7. Should InvestSkill add a skill like this?

### What "such a skill" could mean

| Option | What it is | Verdict |
|---|---|---|
| **A. `showcase` as an analysis framework** | A prompt that takes a basket and writes the hub, screener, per-ticker reports, workflows and chain map | **No** |
| **B. Port the generator** | Bring `scripts/showcase/` and a snapshot into this repo | **No** |
| **C. `basket-report` orchestrator** | An output-class skill (like `report-generator`) that chains `stock-screener` → `compare` → `full-report` per ticker → `industry-map` into one linked HTML deliverable | **Not yet** |
| **D. Adopt the practices, link the showcase** | No new skill | **Yes, now** |

### Why not A or B

- **The valuable part is not promptable.** The showcase earns trust through byte-identical rebuilds and a CI diff. A prompt cannot promise either; a model asked to "generate a showcase" would produce pages that look the same and carry none of the guarantees.
- **It conflicts with two standing rules.** InvestSkill has no runtime and no data fetching in any skill, and it never commits real-ticker data (`data/fixtures/` holds only the fictional ZEPH pack). Option B breaks both, and adds a Python toolchain to a zero-dependency Node repo.
- **It is not an analysis.** It produces no signal of its own, so it would be an output tool that does not count toward the 34 frameworks while still costing the full new-skill process: both languages, three platform configs, site pages, prompt budgets and the contract checks.
- **The cost per run is very high.** Four tickers at comprehensive depth is 100 module runs before the hub, screener and workflows. That does not fit in one context window, so the skill would have to instruct the model to save and reload intermediate files — which is already what `full-report` does for one ticker.
- **Most of it already exists.** `full-report` covers the single-ticker HTML report, `compare` and `stock-screener` cover the basket ranking, `industry-map` covers the chain, and `report-generator` covers HTML output.

### The real gap, and option C

One thing has no home today: **a multi-ticker deliverable**. `compare` and `stock-screener` end in Markdown, and `full-report` takes one ticker. A user who wants "these four names, one linked report" has to assemble it by hand.

If that demand shows up, the right shape is a small orchestrator, not a showcase:

- capped at 2–5 tickers and `standard` depth per ticker;
- one shared `Data & Sources` header and as-of date for the whole basket;
- a hub page that states the question, the ranking from `compare`, and links to each per-ticker report;
- classified in `OUTPUT_TOOLS` in `scripts/lib/skill-registry.js`, so the advertised count stays at 34.

It is worth building only after evidence that people want it, since it would be the most expensive skill in the plugin to run and to evaluate, and the live eval harness is built for single-ticker skills on the ZEPH pack.

### Recommended now (option D)

1. **Link the showcase from the site's demo section**, English and 繁體中文, labelled with its snapshot date and framework version.
2. **Lift the rules into the existing prompts** where they are missing. `full-report` already re-weights unscored modules instead of using a neutral value; it does not yet say that every module in one run must share a single as-of snapshot. Check `stock-screener` and `compare` for "raw input beside every score", and the cookbook workflows for "a gate that stops the workflow is a result".
3. **Fix the showcase in its own repo**: derive the narrative figures from the snapshot (or test them against it), correct the automation claim on the hub, and refresh it to the current 34 frameworks and the 25-module `full-report`.
4. **Keep the showcase where it is.** A sibling repo with its own runtime and committed data is the correct home for it; that separation is why InvestSkill can stay a prompt-only plugin.

---

## 8. Sources

- Generator and history: `scripts/showcase/` and commits `10db869`, `593efa1`, `58a33f1` in [`yennanliu/InvestSkill-test`](https://github.com/yennanliu/InvestSkill-test)
- Pages: [hub](https://yennj12.js.org/InvestSkill-test/showcase/index.html) · [MU](https://yennj12.js.org/InvestSkill-test/showcase/mu.html) · [landing section](https://yennj12.js.org/InvestSkill-test/#showcase)
- Verified for this review: `python scripts/showcase/build.py --check` passes on `0984b6e` (all 8 pages match); the coverage gap in §6 is a text search of the eight pages for each of the 38 skill names
