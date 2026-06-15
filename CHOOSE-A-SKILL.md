# Choose a Skill

> 21 frameworks is a lot. This page maps your *goal* to the right skill — and clears up the overlaps people ask about most. New here? Start with `stock-eval`; it touches quality, value, and risk in one pass.

---

## Start From Your Goal

| I want to… | Use | Then maybe |
|------------|-----|-----------|
| Screen a stock fast (go / no-go) | `stock-eval` | `result-validator` |
| Understand the *business* in depth | `fundamental-analysis` | `competitor-analysis` |
| Know if it's *cheap or expensive* | `stock-valuation` | `dcf-valuation` |
| Get a rigorous *intrinsic value* | `dcf-valuation` | `stock-valuation` |
| Read a 10-K / 10-Q for red flags | `financial-report-analyst` | `earnings-call-analysis` |
| Judge an earnings call | `earnings-call-analysis` | `options-analysis` |
| Check if a *dividend is safe* | `dividend-analysis` | `portfolio-review` |
| *Time an entry / exit* | `technical-analysis` | `chart-master` |
| Assess the *competitive moat* | `competitor-analysis` | `fundamental-analysis` |
| See where *smart money* is moving | `institutional-ownership` | `insider-trading` |
| Track *insider* buying/selling | `insider-trading` | `short-interest` |
| Gauge *short-squeeze* potential | `short-interest` | `technical-analysis` |
| Pick an *options* strategy | `options-analysis` | `technical-analysis` |
| Read the *macro* environment | `economics-analysis` | `sector-analysis` |
| Find *sector rotation* opportunities | `sector-analysis` | `stock-eval` |
| Review my *whole portfolio* | `portfolio-review` | `dividend-analysis` |
| Build *one full investment thesis* | `research-bundle` | `result-validator` |
| Export a *polished HTML report* | `full-report` | `report-generator` |
| Make *charts* for a report | `chart-master` | `report-generator` |
| *Sanity-check* any analysis | `result-validator` | — |

---

## Decision Tree

```
What's your starting point?

├─ "I have a ticker, tell me if it's worth a look"
│     └─ stock-eval  ──(promising?)──► research-bundle ──► result-validator
│
├─ "I want to know what it's worth"
│     ├─ one rigorous model ........... dcf-valuation
│     └─ cross-check several methods .. stock-valuation
│
├─ "I'm in earnings season"
│     └─ fundamental-analysis (baseline)
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
└─ "I want the whole package, exported"
      └─ full-report  (runs everything, saves an HTML file)
```

---

## Skill Comparisons (the overlaps people ask about)

### `stock-eval` vs. `fundamental-analysis` vs. `stock-valuation`
These three overlap the most. The difference is **depth and purpose**:

| Skill | Best for | Depth | Output |
|-------|----------|-------|--------|
| `stock-eval` | A fast, holistic *go/no-go* | Broad, shallow | Quality + value + moat + risk in one signal |
| `fundamental-analysis` | *Understanding the business* | Deep on financials | Income statement, balance sheet, cash flow deep-dive |
| `stock-valuation` | *Is the price right?* | Deep on valuation | P/E · P/S · EV/EBITDA · DCF · residual income, side by side |

**Rule of thumb:** `stock-eval` first to decide *whether* to dig; then `fundamental-analysis` (the business) and `stock-valuation` (the price) for the *why*.

### `dcf-valuation` vs. `stock-valuation`
- **`dcf-valuation`** — one method done rigorously: projected cash flows, WACC, bear/base/bull, sensitivity table. Use when you want a defensible *intrinsic value* and to see how fragile it is.
- **`stock-valuation`** — *many* methods at once (DCF + comps + EV multiples + residual income), triangulated into a range. Use when you want a "football field" of what the stock is worth from several angles.

A single DCF can be precisely wrong. Triangulating with `stock-valuation` is how you stress-test it.

### `research-bundle` vs. `full-report`
- **`research-bundle`** — chains the analysis skills and synthesizes them into one thesis **in the chat**. Interactive, conversational, fast to iterate.
- **`full-report`** — runs all modules and **saves a standalone HTML file** to `output/` (hero header, interactive charts, football-field valuation, composite signal). Best when you want something to share, archive, or print.

Same engine, different *delivery*: read-in-chat vs. export-and-share.

### Fundamental vs. Technical — when to use which
| | Fundamental (`fundamental-analysis`, `stock-eval`, `*-valuation`) | Technical (`technical-analysis`, `chart-master`) |
|---|---|---|
| Answers | *What* to own and *whether* it's worth it | *When* to enter/exit |
| Horizon | Months to years | Days to months |
| Inputs | Financial statements, filings | Price, volume, indicators |
| Use together? | Yes — fundamentals pick the name, technicals time the trade |

They're not rivals. The [swing-trade journey](use-cases.html) uses both: fundamentals to choose, technicals to time.

---

> **Next:** [Use Cases](use-cases.html) shows these chains end-to-end · [Concepts](concepts.html) explains the metrics · [Data & Accuracy](data-and-accuracy.html) on trusting the output.

*Educational content only. Not financial advice.*
