# Valuation Essentials

> The market shouts a price at you every second. Your real job is quieter: to estimate what a business is actually *worth*, then compare the two. This lesson shows you how professionals turn future cash flows into a value today, when to reach for a quick multiple instead, and why a "margin of safety" is your protection against being wrong.

**What you'll learn**

- The difference between *price* (what the market quotes) and *value* (what the business is worth)
- What "intrinsic value" means and why it comes down to future cash
- How a Discounted Cash Flow (DCF) works, using a small illustrative example
- The common valuation multiples (P/E, PEG, EV/EBITDA, P/S, P/B, FCF yield, dividend yield) and when each misleads
- How comparable company analysis works
- What a margin of safety is and how big it should be
- Which valuation method fits which kind of company

---

## Price vs. value

Every trading day the market puts a *price* on a stock. That price reflects the mood, hopes, and fears of everyone buying and selling right now. It is a fact, but it is not the same as *value*.

**Value** is your own estimate of what the business is worth based on the cash it can generate. Price is what you pay; value is what you get.

The two drift apart constantly. A wonderful company can be a terrible investment if you overpay, and a mediocre company can be a fine investment if the price is low enough.

> **Key idea:** A great company at a terrible price is a bad investment. Valuation is the discipline of not confusing a good business with a good deal.

Think of buying a house. The asking price is set by the seller and the market. But you still work out what *you* think it is worth — based on the rent it could earn, the neighborhood, and repairs needed. If your estimate is well above the asking price, you have found a bargain. If it is below, you walk away no matter how nice the kitchen looks.

## Intrinsic value: a business is worth its future cash

Strip away the noise and a business is worth one thing: **all the cash it will hand back to its owners over its remaining life**, converted into today's money.

Two ideas are baked into that sentence:

1. **Cash, not accounting profit.** Owners ultimately care about free cash flow (FCF) — the cash left after the company pays its bills and reinvests to keep running. `FCF = Operating cash flow − Capital spending`.
2. **Today's money.** A dollar you receive in ten years is worth less than a dollar today, because you could invest today's dollar and grow it. So future cash must be "discounted" back to the present.

*In the plugin:* see [Concepts](concepts.html) for a plain-language walkthrough of "How intrinsic value works."

## Discounted Cash Flow (DCF)

A DCF puts the intrinsic-value idea into a spreadsheet. You forecast a company's future free cash flows, then shrink each one back to today's value and add them up. Three inputs do almost all the work.

### 1. Future free cash flows

You project FCF for, say, the next 5–10 years. This is where your view of the business lives: how fast can it grow, and how profitable will it stay?

### 2. The discount rate (WACC)

The **discount rate** answers "how much less is a future dollar worth to me today?" For a whole company we usually use the **WACC** — the *Weighted Average Cost of Capital* — which blends the return shareholders expect with the after-tax cost of the company's debt. A higher WACC means future cash is worth less today.

`Present value = Future cash ÷ (1 + WACC)^years`

So $110 arriving one year out, discounted at 10%, is worth `110 ÷ 1.10 = $100` today.

### 3. The terminal value

You cannot forecast forever, so after the explicit years you estimate a **terminal value** — a lump sum standing in for all cash beyond the forecast. Surprisingly, this single number is often **60–80% of the entire valuation**. That is worth remembering: most of a DCF's answer comes from cash far in the future, which is exactly the part you know least about.

### A small, illustrative worked example

*This is simplified and illustrative — real DCFs have more years and detail.* Assume a company produces $100 of FCF next year, growing 8% a year for 5 years. We discount at a WACC of 10%, then add a terminal value.

| Year | FCF | Discount factor (10%) | Present value |
|------|-----|----------------------|---------------|
| 1 | $100 | 0.909 | $91 |
| 2 | $108 | 0.826 | $89 |
| 3 | $117 | 0.751 | $88 |
| 4 | $126 | 0.683 | $86 |
| 5 | $136 | 0.621 | $85 |
| **Sum of years 1–5** | | | **$439** |

Now the terminal value. A common shortcut assumes cash grows slowly forever (say 3%) after year 5: `TV = Year-5 FCF × (1 + 3%) ÷ (WACC − 3%) = 136 × 1.03 ÷ (0.10 − 0.03) ≈ $2,001`. Discounted back to today at year 5: `2,001 × 0.621 ≈ $1,243`.

| Component | Value today | Share of total |
|-----------|-------------|----------------|
| Years 1–5 cash flows | $439 | 26% |
| Terminal value | $1,243 | 74% |
| **Total intrinsic value** | **$1,682** | 100% |

If this business had, say, 100 shares, intrinsic value is about **$16.82 per share**. If the market quotes $12, it may be cheap; if it quotes $25, it may be expensive.

Notice the terminal value is 74% of the answer — right in the 60–80% range flagged above.

### A DCF is a model of your assumptions, not a fact

Change the inputs and the answer moves, sometimes a lot. That is a feature, not a flaw — it forces you to be explicit. Two habits keep you honest:

- **Bear / base / bull scenarios.** Run a pessimistic, a middle, and an optimistic set of assumptions instead of pretending you know the future exactly.
- **A sensitivity table.** Show how the value changes as WACC and growth wiggle.

| Value per share | WACC 9% | WACC 10% | WACC 11% |
|-----------------|---------|----------|----------|
| Growth 6% | $18.9 | $16.0 | $13.9 |
| Growth 8% | $20.1 | $16.8 | $14.4 |
| Growth 10% | $21.6 | $17.8 | $15.1 |

> **Key idea:** If a tiny tweak to WACC flips your decision from "buy" to "sell," the estimate isn't robust — treat it as a fuzzy range, not a precise number.

*In the plugin:* the `dcf-valuation` skill builds this out with a full sensitivity table and bear/base/bull cases.

## Relative valuation: multiples

A DCF is thorough but slow. **Multiples** give you a fast read by comparing price to some fundamental. Each is a shortcut with blind spots.

| Multiple | Formula | Good for | Where it misleads |
|----------|---------|----------|-------------------|
| **P/E** (price-to-earnings) | `Price ÷ EPS` | Profitable, stable firms | Useless for loss-makers (no earnings); distorted by one-off items |
| **PEG** | `P/E ÷ growth rate` | Comparing growth stocks | Growth estimates are unreliable; garbage in, garbage out |
| **EV/EBITDA** | `Enterprise value ÷ EBITDA` | Comparing firms with different debt loads | Ignores capital spending; EBITDA flatters heavy-asset firms |
| **P/S** (price-to-sales) | `Price ÷ sales per share` | Early, unprofitable companies | Sales without profit can be worthless; ignores margins |
| **P/B** (price-to-book) | `Price ÷ book value per share` | Banks, insurers, asset-heavy firms | Meaningless for asset-light software; book value can be stale |
| **FCF yield** | `FCF ÷ Market cap` | Cash-generating "cash cows" | Lumpy capital spending distorts a single year |
| **Dividend yield** | `Dividend ÷ Price` | Income-focused, mature firms | A high yield can signal a dividend about to be cut |

Two clarifications worth knowing:

- **Trailing vs. forward P/E.** *Trailing* uses the last 12 months of actual earnings; *forward* uses analysts' next-12-months estimate. Forward looks cheaper for growing firms but relies on forecasts that may be wrong.
- **Why EV includes debt.** *Enterprise value (EV)* = market cap + debt − cash. It measures the cost to buy the *whole business*, including paying off its debt. That is why EV multiples let you compare a debt-free company with a debt-laden one fairly, while P/E cannot.

> **Key idea:** A multiple is only meaningful next to something — the company's own history, its peers, or the market. "P/E of 20" tells you nothing alone.

## Comparable company analysis

"Comps" value a company by looking at what the market pays for similar businesses. If peer companies trade at 15× earnings and your company earns $5 per share, a comps estimate is roughly `15 × $5 = $75`.

The whole method rests on one word: *comparable*. A slow-growing utility and a fast-growing software firm are not comparable even if both are "tech-adjacent." Pick peers with genuinely similar growth, margins, risk, and business model — otherwise you are comparing apples to tractors.

*In the plugin:* the `stock-valuation` skill runs multiple methods — DCF, comparables, EV multiples, and residual income — and **triangulates** them, because no single method is right on its own.

## Margin of safety

You will never estimate value perfectly. The **margin of safety** is the buffer between the price you pay and your value estimate — it protects you when your assumptions turn out too optimistic.

If you think a stock is worth $100 and you buy at $70, your margin of safety is 30%. If the business does a bit worse than you hoped, you still may not lose money.

How big a margin should you demand? It scales with your uncertainty:

| Confidence in your estimate | Suggested margin of safety |
|-----------------------------|----------------------------|
| High — stable, predictable business | ~20% |
| Medium — some cyclicality or competition | ~30% |
| Low — early-stage, fast-changing, hard to forecast | 40%+ |

> **Key idea:** The margin of safety turns "I might be wrong" from a fear into a plan. The less sure you are, the cheaper you should insist on buying.

## Which method fits which situation

No single tool works everywhere. Match the method to the company.

| Company type | Best-fit approach | Why |
|--------------|-------------------|-----|
| Stable "cash cow" | DCF and FCF yield | Predictable cash makes discounting reliable |
| Cyclical (autos, chemicals, miners) | Normalized multiples | Use mid-cycle earnings, not peak or trough, so P/E isn't fooled |
| Early-stage growth | TAM + comparables + scenario DCF | Little profit yet, so size the opportunity (*TAM = total addressable market*) and run scenarios |
| Asset-heavy / financials (banks, insurers, REITs) | P/B | Value tracks the balance sheet more than a single year's earnings |

In practice, professionals rarely rely on one method. They triangulate — a DCF plus a comps check plus a sanity check on FCF yield — and worry when the methods strongly disagree.

## Key takeaways

- **Price is quoted; value is estimated.** Your edge is buying when your value estimate sits well above the price.
- **Intrinsic value is future cash, discounted to today** — a DCF just formalizes that, and its terminal value usually dominates the answer.
- **A DCF is a model of your assumptions.** Use bear/base/bull scenarios and a sensitivity table; distrust any value that flips with a small WACC tweak.
- **Multiples are fast but blind** — each (P/E, EV/EBITDA, P/B, FCF yield…) has a situation where it misleads. Compare against peers or history, never in isolation.
- **Demand a margin of safety**, and make it bigger when you are less certain.

---

> **Next / Related** — Previous lesson: [Judging Business Quality](learning-quality.html). Next lesson: [Reading the Market](learning-market.html). See also the [Concepts](concepts.html) guide ("How intrinsic value works" and margin of safety), the [Glossary](glossary.html), and the full [Learning](learning.html) overview.

*Educational content only. Not financial advice.*
