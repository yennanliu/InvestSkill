# Choose a Skill

> 34 frameworks is a lot. This page maps your *goal* to the right skill — and clears up the overlaps people ask about most. New here? Start with `stock-eval`; it touches quality, value, and risk in one pass.

---

## Start From Your Goal

| I want to… | Use | Then maybe |
|------------|-----|-----------|
| Screen a stock fast (go / no-go) | `stock-eval` | `result-validator` |
| Understand the *business* in depth | `stock-eval` (its statement-level sections) | `financial-report-analyst` |
| Know if it's *cheap or expensive* | `stock-valuation` | `bear-case` |
| Get a rigorous *intrinsic value* | `stock-valuation` (its DCF method + sensitivity table) | `result-validator` |
| Read a 10-K / 10-Q for red flags | `financial-report-analyst` | `earnings-call-analysis` |
| Get a *structured summary* of a 10-K, section by section (EN or 繁中) | `10k-digest` | `financial-report-analyst` |
| Check whether the *reported earnings can be trusted* | `forensic-accounting` | `financial-report-analyst` |
| Know if the company can *pay its debts and refinance* | `credit-check` | `dividend-analysis` |
| Judge an earnings call | `earnings-call-analysis` | `options-analysis` |
| See the *dated events* that could move a stock over the next 90 days | `catalyst-calendar` | `thesis-tracker` |
| Check if a *dividend is safe* | `dividend-analysis` | `portfolio-review` |
| *Time an entry / exit* | `technical-analysis` | `chart-master` |
| Assess the *competitive moat* | `competitor-analysis` | `industry-map` |
| Map an *industry's supply chain* (upstream→downstream) | `industry-map` | `competitor-analysis` |
| See where *smart money* is moving | `institutional-ownership` | `insider-trading` |
| Track *insider* buying/selling | `insider-trading` | `short-interest` |
| Gauge *short-squeeze* potential | `short-interest` | `technical-analysis` |
| Stress-test a *bull thesis* (the downside case) | `bear-case` | `stock-eval` |
| Plan *how to build a position* (or manage one I'm underwater on) | `position-ladder` | `technical-analysis` |
| Write down *why I own it* and re-check that thesis later | `thesis-tracker` | `bear-case` |
| Pick an *options* strategy | `options-analysis` | `technical-analysis` |
| Read the *macro* environment | `economics-analysis` | `sector-analysis` |
| Find *sector rotation* opportunities | `sector-analysis` | `stock-eval` |
| *Pick between* two to five stocks, side by side | `compare` | `bear-case` |
| *Rank a longer list* of tickers to find the best candidates | `stock-screener` | `compare` |
| Review my *whole portfolio* | `portfolio-review` | `dividend-analysis` |
| Build *one full investment thesis* | `full-report` | `result-validator` |
| Export a *polished HTML report* | `full-report` | `report-generator` |
| Make *charts* for a report | `chart-master` | `report-generator` |
| *Fact-check* a report's numbers against primary sources and add citations | `fact-check` | `result-validator` |
| *Sanity-check* any analysis | `result-validator` | `fact-check` |
| Vet an *ETF or index fund* (cost, tracking, what I actually own, overlap) | `etf-analysis` | — |
| Prepare for an *upcoming earnings print* (what's priced in, what to watch) | `earnings-preview` | — |
| See the *tax consequences* of a trade or a portfolio (US, or as a non-US investor) | `tax-lens` | — |
| Know how much my *portfolio could lose* in a bad regime | `risk-stress-test` | — |
| *Understand* an analysis I just got (and learn the concepts behind it) | `learning-coach` | — |
| *Learn from a closed trade* (process vs. outcome) | `trade-postmortem` | `thesis-tracker` |
| I want one linked report on a small basket of stocks, not four separate ones | `basket-report` | — |

---

## Decision Tree

```
What's your starting point?

├─ "I have a ticker, tell me if it's worth a look"
│     └─ stock-eval  ──(promising?)──► full-report ──► result-validator
│
├─ "I want to know what it's worth"
│     └─ stock-valuation  (DCF + comps + EV multiples + residual income, triangulated)
│
├─ "I'm in earnings season"
│     └─ stock-eval (baseline)
│           └─ earnings-call-analysis (post-call)
│                 └─ options-analysis (vol + strategy)
│
├─ "I'm thinking top-down / macro"
│     └─ economics-analysis ──► sector-analysis ──► stock-eval
│
├─ "I care about income"
│     └─ dividend-analysis ──► portfolio-review
│
├─ "I'm trading a setup"
│     └─ short-interest ──► technical-analysis ──► options-analysis ──► chart-master
│
├─ "I already own it — how do I build / manage the position?"
│     └─ stock-eval (thesis still good?) ──► technical-analysis (support levels)
│           └─ position-ladder (rungs, share-count band, trim/re-add cycle)
│                 └─ thesis-tracker (write the thesis down; --update re-checks it)
│
└─ "I want the whole package, exported"
      └─ full-report  (runs everything, saves an HTML file)
```

---

## Skill Comparisons (the overlaps people ask about)

### `stock-eval` vs. `stock-valuation`
These two overlap the most. The difference is **depth and purpose**:

| Skill | Best for | Depth | Output |
|-------|----------|-------|--------|
| `stock-eval` | A fast, holistic *go/no-go* — and, in its deep-dive sections, *understanding the business* | Broad first, then statement-level | Quality + value + moat + risk in one signal; income statement, balance sheet, cash flow breakdown on demand |
| `stock-valuation` | *Is the price right?* | Deep on valuation | P/E · P/S · EV/EBITDA · DCF (with sensitivity table) · residual income, side by side |

**Rule of thumb:** `stock-eval` first to decide *whether* to dig; then `stock-valuation` for *what it's worth*. A single DCF can be precisely wrong — `stock-valuation` triangulates it against the other methods so you can see how fragile the intrinsic value is.

### `position-ladder` vs. `thesis-tracker`
- **`position-ladder`** — *how* to build or manage a position: rungs, share-count floor/ceiling, trim/re-add cycle, wash-sale flags. It has a thesis-break gate, but it does not remember the thesis.
- **`thesis-tracker`** — *why* you own it, written down as KPIs with thresholds and invalidation triggers, saved to a file. `--update` re-checks the file against new data and returns INTACT / WEAKENED / BROKEN.

Use them together: `thesis-tracker` says whether adding is still allowed; `position-ladder` says at what price and how much.

### `catalyst-calendar` vs. `thesis-tracker`
`catalyst-calendar` lists the dated events that could move a stock over the next 90 days. `thesis-tracker` imports those dates and asks a narrower question after each one: *did the event confirm or weaken the reason I hold this?*

### `fact-check` vs. `result-validator`
- **`fact-check`** — *are the numbers true?* Every figure and claim in a report is checked against a primary source (filing, IR release, FRED, your pasted document), derived figures are recomputed, and the report is re-issued with inline citations and a References section. Verification Score 0–10.
- **`result-validator`** — *is the analysis well built?* Methodology, signal consistency, risk coverage, and reasoning transparency, scored 0–100.

Run `fact-check` first when the stakes are real — a well-built analysis on wrong inputs is still wrong. The validator's Data Quality score is capped by the fact-check result.

### Aliases — `fundamental-analysis`, `dcf-valuation`, `research-bundle`
These three still work but are **redirects**, not separate frameworks, and are not counted in the 34:

| Alias | Now lives in | Why it merged |
|-------|--------------|---------------|
| `fundamental-analysis` | `stock-eval` | Statement-level analysis without valuation kept producing half a verdict |
| `dcf-valuation` | `stock-valuation` | A DCF on its own is precisely wrong; it is now Method 1 of a triangulated model |
| `research-bundle` | `full-report` | Same engine; `full-report --depth quick / standard / comprehensive` covers the chat-only bundle and adds the saved HTML file |

### Fundamental vs. Technical — when to use which
| | Fundamental (`stock-eval`, `stock-valuation`, `financial-report-analyst`) | Technical (`technical-analysis`, `chart-master`) |
|---|---|---|
| Answers | *What* to own and *whether* it's worth it | *When* to enter/exit |
| Horizon | Months to years | Days to months |
| Inputs | Financial statements, filings | Price, volume, indicators |
| Use together? | Yes — fundamentals pick the name, technicals time the trade |

They're not rivals. The [swing-trade journey](use-cases.html) uses both: fundamentals to choose, technicals to time.

---

> **Next:** [Use Cases](use-cases.html) shows these chains end-to-end · [Concepts](concepts.html) explains the metrics · [Data & Accuracy](data-and-accuracy.html) on trusting the output.

*Educational content only. Not financial advice.*
