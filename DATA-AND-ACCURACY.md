# Data, Accuracy & Responsible Use

> The most important page on this site. InvestSkill makes an AI *reason like an analyst* — but it is only as good as the data you feed it and the scrutiny you apply. This page explains where the numbers come from, how to spot when they're wrong, and the limits you must respect.

**On this page:** [How the skills get data](#how-the-skills-get-data) · [Recommended data sources](#recommended-data-sources) · [Spotting hallucinated numbers](#spotting-hallucinated-numbers) · [Validating AI output](#validating-ai-output) · [Limitations & responsible use](#limitations--responsible-use)

---

## How the Skills Get Data

**InvestSkill does not fetch data itself.** There is no runtime, no API, no live feed inside the plugin — every skill is a *prompt* that tells the AI how to reason. The data comes from one of two places:

1. **What you paste in** — 10-K excerpts, earnings transcripts, your holdings, a financials table. This is the most reliable path because *you* control the source.
2. **What the host AI can access** — if your assistant has web/search/tool access (e.g. Claude with web search, a connected data tool), it may retrieve figures itself. This is convenient but **must be verified** — the model may use stale, approximate, or misattributed numbers.

> **Consequence:** if you ask "evaluate AAPL" with no data and no tool access, the model answers from training memory — which is dated and may be wrong. Always anchor the analysis with current, primary-source data.

---

## Recommended Data Sources

| Need | Primary source |
|------|----------------|
| Financial statements, 10-K / 10-Q / 8-K | [SEC EDGAR](https://www.sec.gov/edgar) (free, authoritative) |
| Earnings call transcripts | Company IR site, transcript providers |
| Insider transactions (Form 4) | SEC EDGAR |
| Institutional holdings (13F) | SEC EDGAR |
| Price / volume / technicals | Your brokerage, charting platforms |
| Dividends history | Company IR, dividend trackers |
| Macro indicators | Central bank / statistics-agency releases (e.g. FRED) |

**Best practice:** copy the actual figures into the prompt (or point a tool-enabled assistant at the filing) rather than relying on the model's recall. For filings, `financial-report-analyst` is built to ingest pasted 10-K/10-Q sections directly.

---

## Spotting Hallucinated Numbers

AI can state wrong figures *confidently*. Watch for these tells:

- **Suspiciously round or "too clean" numbers** (exactly 15.0% margin, $100.0B revenue).
- **Figures that don't reconcile** — e.g. an EPS that doesn't match the stated net income ÷ share count.
- **Stale prices or market caps** that don't match today's quote.
- **Metrics with no source** when you didn't provide the underlying data.
- **A confidence level that doesn't match the data** — HIGH confidence on a stock you gave zero data for is a red flag in itself.

**Quick reconciliation checks you can do by hand:**

| Check | Does it hold? |
|-------|---------------|
| EPS × shares ≈ Net income | If not, one number is wrong |
| Dividend ÷ price ≈ stated yield | Catches yield errors |
| Operating cash flow − CapEx ≈ FCF | Catches cash-flow fabrication |
| P/E × EPS ≈ price | Catches valuation drift |

If a number fails its own arithmetic, discard the whole section and re-run with explicit data.

---

## Validating AI Output

`result-validator` is a first-class step, not a nicety. Promote it from "tip" to "habit":

**When to run it:** after any high-stakes analysis, *always* after a composite (`research-bundle`, `full-report`), and whenever the signal feels too good.

**What it scores:** data quality, methodology soundness, and signal consistency — returning a confidence score and a list of gaps.

```
/result-validator      ← paste the analysis output (or the composite signal block)
```

**Manual sanity-check checklist** (do this even when you can't run the validator):

- [ ] **Do the numbers reconcile?** (use the table above)
- [ ] **Is the data current?** Check the price/date against today.
- [ ] **Does the signal match the narrative?** A BULLISH box atop a paragraph full of risks is incoherent.
- [ ] **Does confidence match the evidence?** Thin data should mean lower confidence.
- [ ] **Do the sub-signals agree?** In a composite, disagreement should lower confidence and be called out — not averaged away.
- [ ] **Did I provide the data, or did the model invent it?**

---

## Limitations & Responsible Use

**This is educational tooling, not financial advice.** Use it to *structure your own thinking*, not to outsource your decisions.

- **Not financial advice.** No skill knows your goals, taxes, risk tolerance, or time horizon. Output is a framework, not a recommendation.
- **Model-dependent.** The same prompt yields different results across models and versions. Use the most capable model you have and cross-check.
- **No real-time guarantee.** Unless your assistant has live tool access, figures may be stale. Verify against primary sources.
- **Signal blocks are decision *aids*.** They compress a lot of judgment into one box — they don't replace reading the analysis, the filings, and the risks.
- **Primary sources win.** When the AI and a filing disagree, the filing is right.
- **You own the decision.** Consider consulting a licensed financial professional for personal investment decisions.

> **The one rule:** never act on a signal block you haven't reconciled against real data and pressure-tested for the bear case. The frameworks make you faster; they don't make you right.

---

> **See also:** [Concepts → Anatomy of the signal block](concepts.html#anatomy-of-the-signal-block) · [Use Cases → Anti-patterns](use-cases.html#anti-patterns-how-analyses-go-wrong) · [Glossary](glossary.html).

*Educational content only. Not financial advice.*
