---
description: Comprehensive stock research by chaining multiple analysis skills into a unified investment thesis
---

# Research Bundle

Run a complete, structured research process for a single stock by systematically applying multiple InvestSkill analysis modules and synthesizing them into a unified investment thesis with a composite score.

## Overview

`/research-bundle` is a meta-skill that orchestrates all other InvestSkill analysis modules in a defined sequence. Rather than running individual skills in isolation, this skill chains them together so that earlier-phase outputs inform later-phase assumptions. The result is a single, comprehensive investment thesis document with a composite score, clearly presented bull and bear cases, and actionable entry/exit strategy.

Use this skill when you need final due diligence before initiating or sizing a position, or when you want a structured, repeatable research process across multiple stocks.

---

## Research Process (Phases)

### Phase 1: Business & Competitive Foundation

Establish the qualitative and quantitative foundation for the investment thesis before attempting valuation.

- Run: `/competitor-analysis [TICKER]` — Understand moat, competitive position, industry dynamics, Porter's Five Forces, and pricing power
- Run: `/fundamental-analysis [TICKER]` — Deep financial statement analysis covering income statement, balance sheet, cash flow, and business quality metrics
- Output: **Business Quality Assessment (1–10 score)**
  - Score reflects durability of competitive advantages, financial health, and consistency of returns

### Phase 2: Valuation

Determine what the business is worth using both intrinsic and relative methods.

- Run: `/dcf-valuation [TICKER]` — Intrinsic value estimate using discounted cash flow modeling with three scenarios (Bull/Base/Bear)
- Run: `/stock-eval [TICKER]` — Relative valuation vs. peers using P/E, EV/EBITDA, P/S, P/FCF, and sector benchmarks
- Output: **Valuation Assessment (premium/discount to intrinsic value %)**
  - Combines DCF intrinsic value and relative valuation into a single price target range

### Phase 3: Market Signals

Understand what sophisticated market participants are doing with the stock.

- Run: `/insider-trading [TICKER]` — Insider sentiment, transaction patterns, and Form 4 analysis
- Run: `/institutional-ownership [TICKER]` — Smart money positioning, 13F changes, concentration, and flow trends
- Run: `/earnings-call-analysis [TICKER]` — Management tone, guidance quality, language analysis, and forward signals
- Output: **Market Signal Score (1–10)**
  - High score = strong insider buying, institutional accumulation, and positive management tone

### Phase 4: Technical Timing

Identify the current technical setup to optimize entry timing relative to the fundamental thesis.

- Run: `/technical-analysis [TICKER] --chart` — Entry timing, trend structure, support/resistance, volume patterns, and momentum indicators
- Output: **Technical Setup Quality (Strong / Moderate / Weak)**
  - Strong = price in uptrend, near support, momentum positive
  - Weak = downtrend, extended from support, negative momentum

### Phase 5: Risk Assessment

Quantify downside risks and understand positioning pressure.

- Run: `/short-interest [TICKER]` — Short positioning, days-to-cover, short squeeze potential, and bearish thesis signals
- Optional: `/options-analysis [TICKER]` — Options market signals including implied volatility, put/call ratios, and options flow
- Output: **Risk Profile (Low / Medium / High)**
  - High short interest + high IV + concentrated bearish options flow = High risk profile

---

## Composite Scoring Framework

```
Research Bundle Score = Weighted Composite

Component                Weight    Sub-Score (0-10)
─────────────────────────────────────────────────────
Business Quality          25%      [score from competitor + fundamental]
Valuation                 25%      [score from DCF + stock-eval]
Market Signals            20%      [insider + institutional + earnings]
Technical Setup           15%      [technical analysis timing]
Risk Profile              15%      [short interest + options signals]
─────────────────────────────────────────────────────
COMPOSITE SCORE          100%      X.X / 10

Composite Interpretation:
8.0–10.0  → Strong Buy (all signals aligned)
6.5–7.9   → Buy (most signals positive)
5.0–6.4   → Hold/Watchlist (mixed signals)
3.5–4.9   → Underweight (mostly negative signals)
0.0–3.4   → Sell/Avoid (strong negative signals)
```

Sub-score derivation:
- Business Quality (0–10): Average of `/competitor-analysis` moat score and `/fundamental-analysis` financial strength score
- Valuation (0–10): 10 = deep discount to intrinsic value; 5 = at fair value; 0 = extremely overvalued
- Market Signals (0–10): Weighted average of insider, institutional, and earnings call scores
- Technical Setup (0–10): Qualitative conversion — Strong=8–10, Moderate=4–7, Weak=0–3
- Risk Profile (0–10): Inverse of risk — Low risk = high score (8–10), High risk = low score (0–3)

---

## Conflict Resolution

When signals conflict across skills, apply these rules:

- **Fundamental overrides technical**: Business quality and intrinsic value take precedence over short-term price action. A great business at fair value with weak technicals is still a good investment.
- **Consensus overrides outlier**: When 4 of 5 skills agree on direction, do not let the single outlier dominate the composite score. Document the outlier and its reasoning.
- **Document all conflicts explicitly**: Never hide conflicting signals. Present the full bull and bear case and explain how the weighting resolves the conflict.
- **Flag unresolvable conflicts**: When signals are deeply contradictory (e.g., strong fundamentals + extreme overvaluation + heavy insider selling), flag the position as "Conflicted — Monitor Only" and do not assign a composite buy/sell recommendation until resolution.

---

## Report Structure

The unified output produced by `/research-bundle` includes:

1. **Investment Thesis** (2–3 paragraphs): What does the company do, why is it a compelling or poor investment at this specific time, and what is the key insight driving the thesis?

2. **Bull Case** (3–5 specific, quantifiable reasons to buy with supporting evidence from the phase outputs)

3. **Bear Case** (3–5 specific risks with probability assessment and potential impact on intrinsic value)

4. **Composite Score Card** (visual table with all component scores, sub-score methodology, and interpretation)

5. **Valuation Summary** (intrinsic value per share, current price, margin of safety, upside/downside % for each scenario)

6. **Entry Strategy** (current technical setup description, ideal entry price range, recommended position sizing based on conviction level)

7. **Exit Strategy** (price targets for base/bull/bear case scenarios, stop loss level, time horizon for thesis to play out)

8. **Monitoring Plan** (what to watch quarterly — key metrics to track, events that would change the thesis, early warning signals for thesis degradation)

9. **Standard Signal Output block**

---

## Usage Modes

```
# Full bundle — runs all 5 phases sequentially
/research-bundle AAPL

# Partial bundle — skip specific phases
/research-bundle TSLA --skip technical
/research-bundle MSFT --skip options

# Quick bundle — condensed 1-page summary with composite score only
/research-bundle NVDA --quick

# Comparison mode — side-by-side analysis of multiple tickers
/research-bundle AAPL,MSFT,GOOGL --compare

# With visual output — optimized for /report-generator HTML export
/research-bundle AMZN --visual
```

---

## Visualization Support

When `--visual` flag is used, include chart data tables for report generation:

### Composite Score Radar Chart
**Chart Type**: Radar/spider chart
**Data Table**:
```
Component           Score (0-10)
Business Quality    [value]
Valuation           [value]
Market Signals      [value]
Technical Setup     [value]
Risk Profile        [value]
```

### Phase Score Summary Bar Chart
**Chart Type**: Horizontal bar chart
```
Phase                    Score    Interpretation
Business Quality         [X.X]    [Excellent/Good/Fair/Weak]
Valuation                [X.X]    [Deep Value/Fair Value/Expensive]
Market Signals           [X.X]    [Bullish/Neutral/Bearish]
Technical Setup          [X.X]    [Strong/Moderate/Weak]
Risk Profile             [X.X]    [Low/Medium/High Risk]
─────────────────────────────────────────────────
Composite                [X.X]    [Strong Buy/Buy/Hold/Sell]
```

---

## Integration Notes

- Each phase feeds into the next: competitive position analysis informs DCF growth assumptions; valuation determines position sizing in the entry strategy
- Best used for **final due diligence** before position initiation, not for screening
- **Revisit quarterly** or after major news/earnings events using `--quick` mode to check thesis integrity
- Output is optimized for `/report-generator` for full HTML export with charts
- When comparing multiple tickers with `--compare`, the output produces a side-by-side composite score table ranked by total score

---

## Output

Provide a unified research bundle report with:
- Phase-by-phase analysis summaries
- Composite score card with all component scores
- Full investment thesis with bull and bear case
- Valuation summary with margin of safety
- Entry and exit strategy with price targets
- Monitoring plan with key metrics

### Enhanced Output (with --visual flag)
- All standard sections above
- Radar chart data for composite score visualization
- Bar chart data for phase score summary
- Chart specifications for HTML report generation via `/report-generator`

## Standard Signal Output

All analysis concludes with this standardized block:

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

Score Guide: 8.0–10.0 Strongly Bullish | 6.0–7.9 Moderately Bullish | 4.0–5.9 Neutral | 2.0–3.9 Moderately Bearish | 0.0–1.9 Strongly Bearish
Confidence: HIGH (strong data, clear signals) | MEDIUM (mixed signals) | LOW (limited data, conflicting signals)
Horizon: SHORT-TERM (1 week–3 months) | MEDIUM-TERM (3 months–1 year) | LONG-TERM (1+ years)
