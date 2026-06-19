---
description: Comprehensive stock research by chaining multiple analysis skills into a unified investment thesis — now unified into full-report
---

# Research Bundle

> **This skill has been unified into `full-report`.** Use `/us-stock-analysis:full-report` with a `--depth` flag instead:

| Old Usage | New Equivalent |
|-----------|---------------|
| `/research-bundle AAPL --quick` | `/us-stock-analysis:full-report AAPL --depth quick` |
| `/research-bundle AAPL` | `/us-stock-analysis:full-report AAPL --depth standard` |
| `/research-bundle AAPL` (full) | `/us-stock-analysis:full-report AAPL --depth comprehensive` |

The `full-report` skill absorbs everything research-bundle provided: the 5-phase framework, composite scoring weights, investment thesis narrative, conflict resolution rules, entry/exit strategy, and monitoring plan — plus HTML report output and configurable depth.

---

## Composite Scoring Weights (Quick Reference)

```
Component                Weight    Sub-Score (0-10)
─────────────────────────────────────────────────────
Business Quality          25%      [competitor + fundamental]
Valuation                 25%      [DCF + relative valuation]
Market Signals            20%      [insider + institutional + earnings]
Technical Setup           15%      [technical analysis timing]
Risk Profile              15%      [short interest + options signals]
─────────────────────────────────────────────────────
COMPOSITE SCORE          100%      X.X / 10

8.0–10.0  → Strong Buy   |  6.5–7.9  → Buy
5.0–6.4   → Hold/Watch   |  3.5–4.9  → Underweight
0.0–3.4   → Sell/Avoid
```

---

## 5-Phase Research Framework (reference)

The original research-bundle framework — now executed automatically by `full-report`:

**Phase 1 — Business Foundation** (competitor-analysis, sector-analysis)
Assess economic moat width (Wide/Narrow/None), Porter's Five Forces, market share trajectory, and sector rotation positioning. Score: business quality 0–10.

**Phase 2 — Valuation** (dcf-valuation, stock-valuation)
DCF intrinsic value across 3 scenarios + comparable company multiples (EV/EBITDA, P/E, P/S). Probability-weighted composite IV. Upside/downside to fair value.

**Phase 3 — Market Signals** (insider-trading, institutional-ownership, earnings-call-analysis)
Net insider sentiment (Form 4 last 90 days), institutional accumulation/distribution (13F delta), management tone and guidance delta from last earnings call.

**Phase 4 — Technical Setup** (technical-analysis)
MA stack (30/60/90/200/365d), RSI, MACD, Ichimoku, multi-timeframe confluence. Entry price, target, stop-loss, R:R ratio. Timing signal for position entry.

**Phase 5 — Risk & Options** (short-interest, options-analysis, economics-analysis)
Short squeeze score, IV rank, put/call ratio skew, macro regime (yield curve, recession probability). Risk-adjusted position sizing.

## Conflict Resolution Rules

When skills disagree, apply these priority overrides:
- Technical **SELL** + Fundamental **BUY** → **HOLD** (wait for technical confirmation)
- Insider **BUY** + Short Interest extreme (>20%) → **CAUTION** (investigate divergence)
- DCF **undervalued 30%+** + Technical **BULLISH** → **STRONG BUY** (conviction upgrade)
- Macro **recession >60%** → override all bullish signals → **REDUCE/AVOID**
- 3+ skills unanimous → allow confidence upgrade (MEDIUM → HIGH)

---

## Depth Modes in full-report

- **`--depth quick`** (5 modules): stock-eval, technical-analysis, dcf-valuation, insider-trading, earnings-call-analysis
- **`--depth standard`** (10 modules): adds institutional-ownership, competitor-analysis, sector-analysis, options-analysis, short-interest
- **`--depth comprehensive`** (15 modules): adds fundamental-analysis, stock-valuation, economics-analysis, financial-report-analyst, dividend-analysis

---

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

**Disclaimer:** Educational analysis only. Not financial advice.
