# Research Bundle

> **This skill has been unified into `full-report`.** Use `full-report` with a `--depth` flag instead:

| Old Usage | New Equivalent |
|-----------|---------------|
| `research-bundle AAPL --quick` | `full-report AAPL --depth quick` |
| `research-bundle AAPL` | `full-report AAPL --depth standard` |
| `research-bundle AAPL` (full) | `full-report AAPL --depth comprehensive` |

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
