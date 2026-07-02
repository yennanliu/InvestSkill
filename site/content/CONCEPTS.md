# Concepts & Mental Models

> The *why* behind the numbers. InvestSkill's frameworks compute metrics for you — this page explains the thinking those metrics serve, so the output becomes a decision instead of a dashboard. New to investing? Read top to bottom. Want a single term defined? Use the [Glossary](glossary.html).

**On this page:** [The three lenses](#quality-vs-value-vs-growth) · [How intrinsic value works](#how-intrinsic-value-works) · [Reading a moat](#reading-a-moat) · [Margin of safety & position sizing](#margin-of-safety--position-sizing) · [Types of risk](#types-of-risk) · [Macro regimes](#macro-regimes) · [Anatomy of the signal block](#anatomy-of-the-signal-block)

---

## Quality vs. Value vs. Growth

Almost every investment thesis is some blend of three lenses. InvestSkill doesn't pick one for you — it scores all three so you can decide which matters for your goal.

| Lens | The question it asks | Key metrics | Skills |
|------|---------------------|-------------|--------|
| **Quality** | Is this a *good business*? | ROIC, ROE, margins, [Piotroski F-Score](glossary.html#piotroski-f-score), debt | `stock-eval`, `fundamental-analysis` |
| **Value** | Is it *cheaply priced*? | P/E, EV/EBITDA, FCF yield, intrinsic value vs. price | `stock-valuation`, `dcf-valuation` |
| **Growth** | Is it *getting bigger*? | Revenue/EPS CAGR, TAM, reinvestment runway | `fundamental-analysis`, `competitor-analysis` |

**The trap each lens hides:**
- Chasing *quality* alone → overpaying for a great company (a wonderful business at a terrible price is a bad investment).
- Chasing *value* alone → value traps (cheap because it deserves to be).
- Chasing *growth* alone → paying for a future that may never arrive.

The strongest theses score well on at least two lenses. `stock-eval` is the fastest way to see all three at once.

---

## How Intrinsic Value Works

A company is worth the cash it will hand its owners over its life, discounted back to today. That's the whole idea behind a [DCF](glossary.html#dcf-discounted-cash-flow). Three inputs dominate the answer:

1. **Future free cash flows** — what the business actually generates. Garbage forecast in, garbage value out.
2. **The discount rate ([WACC](glossary.html#wacc-weighted-average-cost-of-capital))** — a dollar in 10 years is worth less than a dollar today. A higher discount rate (riskier company, higher rates) shrinks the value.
3. **The [terminal value](glossary.html#terminal-value)** — everything beyond the forecast window, often **60–80% of the total**. Tiny changes in the assumed perpetual growth rate swing the answer wildly.

> **The single most important takeaway:** a DCF is a *model of your assumptions*, not a fact. That's why `dcf-valuation` always shows **bear / base / bull** scenarios and a **sensitivity table** — the *range* is the insight, not the point estimate. If a small WACC tweak flips your buy to a sell, your "intrinsic value" isn't robust.

---

## Reading a Moat

A [moat](glossary.html#moat) is a structural reason a company can keep earning high returns without competitors copying it away. The five durable sources:

| Moat source | What it looks like | Example pattern |
|-------------|-------------------|-----------------|
| **Network effects** | Each user makes the product better for the next | Marketplaces, social platforms |
| **Switching costs** | Painful or risky to leave | Enterprise software, banking |
| **Cost advantage** | Structurally cheaper to produce | Scale leaders, low-cost resources |
| **Intangibles** | Brand, patents, licenses | Luxury, pharma, regulated niches |
| **Efficient scale** | Market only supports a few players | Pipelines, rails |

**How to verify a moat in the numbers** (not the marketing): persistently high [ROIC](glossary.html#roic-return-on-invested-capital) (well above [WACC](glossary.html#wacc-weighted-average-cost-of-capital)) over many years, **stable or rising [gross margins](glossary.html#gross-margin)**, and resilient market share. A moat that's real shows up as profits competitors *can't* erode. `competitor-analysis` rates this with [Porter's Five Forces](glossary.html#porters-five-forces); `stock-eval` folds it into the quality score.

---

## Margin of Safety & Position Sizing

Estimates are wrong. The [margin of safety](glossary.html#margin-of-safety) is the gap between price and your intrinsic-value estimate — your protection against being wrong.

- **Buy:** when price sits meaningfully below intrinsic value (value investors often want **20–40%+**). The bigger the uncertainty, the bigger the margin you should demand.
- **Size:** conviction and risk set position size, not excitement. A common discipline is to cap any single name (e.g. ≤ 5–10% of the portfolio) so one bad thesis can't sink you — exactly the concentration risk `portfolio-review` flags.

> A great analysis with no margin of safety is just an expensive opinion. A signal block tells you *direction and conviction*; margin of safety tells you whether the *price* lets you act on it.

---

## Types of Risk

"Risk" isn't one thing. Knowing which kind you're holding tells you which skill to reach for.

| Risk | What it is | Where it shows up |
|------|-----------|-------------------|
| **Market (systematic)** | The whole market falls | [Beta](glossary.html#beta-β), `economics-analysis` |
| **Idiosyncratic** | This company stumbles | `fundamental-analysis`, `financial-report-analyst` |
| **Liquidity** | Can't exit without moving the price | `short-interest`, low-volume names |
| **Concentration** | Too much in one name/sector | `portfolio-review` |
| **Rate sensitivity** | Hurt by rising interest rates | `economics-analysis`, `dividend-analysis`, long-duration growth |

Diversification reduces *idiosyncratic* risk but not *market* risk — that's why a portfolio can be well-diversified and still fall in a downturn.

---

## Macro Regimes

Top-down investors read the macro weather before picking stocks, because the same company behaves differently across regimes.

- **Rising rates / tightening** → pressure on long-duration growth and rate-sensitive sectors (utilities, REITs); favors value, financials, cash-rich firms.
- **Falling rates / easing** → tailwind for growth and rate-sensitive yield plays.
- **Late cycle / slowing** → defensives (staples, healthcare) tend to hold up.
- **Early cycle / recovery** → cyclicals (industrials, discretionary) tend to lead.

The yield curve, Fed language, and leading indicators are the tells. `economics-analysis` reads the regime; `sector-analysis` maps it to which sectors should lead; then `stock-eval` picks the name. See the [macro allocator journey](use-cases.html#the-macro--top-down-allocator).

---

## Anatomy of the Signal Block

Every InvestSkill analysis ends in the same box. It looks simple, but each line is a *different axis* — people conflate them constantly.

```
╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BULLISH / NEUTRAL / BEARISH     ║
║ Confidence:  HIGH / MEDIUM / LOW             ║
║ Horizon:     SHORT / MEDIUM / LONG-TERM      ║
║ Score:       X.X / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      BUY / HOLD / SELL               ║
║ Conviction:  STRONG / MODERATE / WEAK        ║
╚══════════════════════════════════════════════╝
```

| Field | What it answers | What it is **not** |
|-------|-----------------|--------------------|
| **Signal** | Which *direction* does the evidence point? | Not a price target |
| **Confidence** | How *complete and clean* is the data behind it? | Not how bullish — you can be highly confident in a *bearish* call |
| **Horizon** | Over what *timeframe* does the thesis play out? | Not how long to hold no matter what |
| **Score (0–10)** | A single blended read of the above | Not a probability |
| **Action** | The decision the signal implies | Not advice — it's a default you should pressure-test |
| **Conviction** | How strongly the analysis *commits* to the action | Distinct from confidence: you can be confident in the data yet weak in conviction if the margin of safety is thin |

**Score bands:**

| Score | Reading |
|-------|---------|
| 8.0–10.0 | Strongly Bullish |
| 6.0–7.9 | Moderately Bullish |
| 4.0–5.9 | Neutral |
| 2.0–3.9 | Moderately Bearish |
| 0.0–1.9 | Strongly Bearish |

**What moves a score up or down:** improving ROIC/margins, widening moat, cheap valuation, and clean data push it up; deteriorating fundamentals, stretched valuation, red flags in filings, insider selling, and missing/stale data push it down (and also lower **Confidence**).

**Composite blocks.** `research-bundle` and `full-report` don't invent a new score — they **roll up the sub-signals** from each skill. When the underlying signals disagree (e.g. bullish fundamentals but bearish technicals and insider selling), the composite **Confidence drops** and the discrepancy is called out. A high score with *low* confidence means "the case looks good but the evidence is thin — dig deeper." Always run [`result-validator`](data-and-accuracy.html#validating-ai-output) on a composite before acting.

> **Read the block as a sentence:** "Over a **[Horizon]**, the evidence is **[Signal]** with **[Confidence]** confidence (**[Score]**), implying **[Action]** at **[Conviction]** conviction." If those six don't form a coherent sentence, the analysis is internally inconsistent — a finding in itself.

---

> **Next:** [Choose a Skill](choose-a-skill.html) to put these concepts to work · [Use Cases](use-cases.html) for full worked journeys · [Glossary](glossary.html) for any term.

*Educational content only. Not financial advice.*
