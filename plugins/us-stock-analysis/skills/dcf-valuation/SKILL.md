---
description: Discounted Cash Flow (DCF) intrinsic value modeling with sensitivity analysis
---

# DCF Valuation

> **This skill has been merged into `stock-valuation`.** Use `/us-stock-analysis:stock-valuation` for comprehensive valuation including full DCF modeling, WACC decomposition, 3-scenario sensitivity analysis, and comparable company analysis.

---

## Quick DCF Reference

### WACC Formula and Components

```
WACC = Ke × (E/V) + Kd × (D/V)

Where:
  Ke  = Cost of Equity  = Rf + β × (Rm − Rf) + Size Premium
  Kd  = After-Tax Cost of Debt  = (Interest Expense / Total Debt) × (1 − Tax Rate)
  E/V = Equity Weight  = Equity Market Cap / (Equity Market Cap + Total Debt)
  D/V = Debt Weight    = Total Debt / (Equity Market Cap + Total Debt)

Typical WACC Ranges by Risk Profile:
Risk Profile         WACC Range    Examples
─────────────────────────────────────────────────────
Low risk (utility)   6–8%          Regulated utilities, large cap staples
Medium risk          8–11%         Large cap tech, established growth
High risk            11–15%        Small cap, emerging market, cyclical
Very high risk       15–20%+       Early-stage, distressed, pre-revenue
```

### Three-Scenario Names and Default Probabilities

```
Scenario    Probability    Narrative
Bull         20%           Market share gains, margin expansion, favorable macro
Base         60%           Historical trend continuation, guidance-aligned
Bear         20%           Competitive pressure, margin compression, macro headwinds

Probability-Weighted IV = (20% × Bull IV) + (60% × Base IV) + (20% × Bear IV)
```

### 5×5 Sensitivity Table Template

```
Sensitivity Table — Intrinsic Value per Share ($)
              Terminal Growth Rate
WACC     1.0%    1.5%    2.0%    2.5%    3.0%
6.0%     $xxx    $xxx    $xxx    $xxx    $xxx
7.0%     $xxx    $xxx    $xxx    $xxx    $xxx
8.0%     $xxx    $xxx    $xxx    $xxx    $xxx  ← Base Case
9.0%     $xxx    $xxx    $xxx    $xxx    $xxx
10.0%    $xxx    $xxx    $xxx    $xxx    $xxx
```

### Terminal Value Formula

```
Gordon Growth Model:  TV = FCF₁₀ × (1 + g) / (WACC − g)
Exit Multiple Method: TV = FCFₙ × (EV / FCF exit multiple)

Rule: Never set g > WACC. Flag if TV > 80% of total Enterprise Value.
```

---

## Standard Signal Output

All analysis concludes with this standardized block:

```
## Thesis Invalidation

After delivering the analysis signal, specify what would reverse it:

**If signal is BULLISH — thesis breaks if:**
- Price closes below the MA200 / key support level identified in this analysis on above-average volume
- FCF turns negative for 2 consecutive quarters OR WACC rises >200bps unexpectedly
- Macro regime shift: Fed pivots hawkish unexpectedly, recession probability >60%

**If signal is BEARISH — thesis breaks if:**
- Price closes above key resistance / MA200 level with volume confirmation
- FCF growth accelerates >20% above model assumptions OR interest rates fall >100bps
- Fundamental improvement: surprise earnings beat >20% with guidance raise

**Re-run this analysis when:**
- [ ] Next earnings release
- [ ] Price moves ±15% from current level
- [ ] 60 days have elapsed
- [ ] Material news event (acquisition, leadership change, regulatory decision)

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
