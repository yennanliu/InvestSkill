---
description: Discounted Cash Flow (DCF) intrinsic value modeling with sensitivity analysis
---

# DCF Valuation

Build a rigorous Discounted Cash Flow (DCF) model to estimate intrinsic value for US stocks, with full sensitivity analysis and three-scenario probability weighting.

## Overview

DCF is the gold standard for intrinsic value estimation. It answers the fundamental question: **"What is this business worth based on the future cash flows it will generate?"** Unlike relative valuation, which tells you how a stock is priced compared to peers, DCF tells you what the business is actually worth in absolute terms — independent of market sentiment or peer group pricing.

DCF requires disciplined assumptions. Small changes in growth rate, margin, or discount rate assumptions compound significantly over a 10-year horizon. This skill enforces three-scenario modeling (Bull/Base/Bear) and a sensitivity table so assumptions are never presented as point estimates. Garbage-in assumptions produce garbage-out valuations — be conservative, be explicit, and always check terminal value as a percentage of total enterprise value.

---

## Step-by-Step DCF Methodology

### Step 1: Establish Base Metrics

Collect and document the current baseline before projecting forward:

- **Trailing Twelve Months (TTM) Free Cash Flow** = Operating Cash Flow − Capital Expenditures
- **Revenue base** (TTM revenue and most recent full fiscal year)
- **FCF margin** (TTM FCF / TTM Revenue × 100%)
- **Shares outstanding** (diluted, for per-share calculation — include unvested RSUs and options for SBC adjustment)
- **Net debt** = Total Debt − Cash & Cash Equivalents (negative net debt = net cash position)
- **Stock-Based Compensation (SBC)** — identify as a real dilutive cost; subtract from FCF if not already excluded
- **Effective tax rate** (TTM basis, normalize for one-time tax events)

### Step 2: Revenue Growth Projection (Years 1–10)

Use multiple anchors to triangulate a defensible growth assumption:

- **Segment approach**: Project each revenue segment separately when possible (e.g., services vs. hardware, cloud vs. on-prem, international vs. domestic)
- **Historical growth analysis**: 3yr, 5yr, and 10yr revenue CAGR as a baseline anchor
- **Analyst consensus estimates**: Use sell-side consensus for years 1–3 as a cross-check
- **Management guidance**: Forward revenue guidance and long-term targets from earnings calls and investor days
- **Industry growth rate**: Use as a ceiling anchor (a company cannot sustainably grow faster than its industry forever)
- **Growth tapering**: Apply higher growth in years 1–5, decelerating in years 6–10 toward the terminal growth rate
- **Three scenarios**:
  - **Bull Case**: Favorable macro, market share gains, margin expansion
  - **Base Case**: Historical trend continuation, modest improvement
  - **Bear Case**: Competitive pressure, margin compression, macro headwinds

### Step 3: FCF Margin Assumptions

Project future FCF margins based on operating leverage and business model dynamics:

- **Historical FCF margin trend** (expanding, stable, or compressing — identify the driver)
- **Operating leverage potential**: As revenue scales, what fixed costs are being leveraged? (R&D, G&A, sales infrastructure)
- **Capex intensity** (% of revenue): Is capex increasing (scaling infrastructure) or decreasing (mature asset base)?
- **Working capital changes**: Is the company a working capital consumer or generator? (subscription businesses often generate WC)
- **Normalize for one-time items**: Strip out litigation settlements, asset sale gains, restructuring charges
- **SBC adjustment**: Subtract SBC from reported operating cash flow to get true economic FCF

### Step 4: Terminal Value Calculation

Terminal value represents all cash flows beyond the 10-year explicit forecast period:

- **Terminal growth rate (g)**: Typically 2–3% (anchored to nominal GDP growth). Never set g > WACC — this implies infinite value
- **Gordon Growth Model (preferred)**:
  ```
  TV = FCF₁₀ × (1 + g) / (WACC − g)
  ```
- **Exit Multiple Method (alternative)**:
  ```
  TV = FCFₙ × (EV / FCF exit multiple)
  ```
  Use industry-appropriate EV/FCF multiples from comparable mature companies
- **Terminal value as % of Enterprise Value**: If TV > 80% of total EV, the model is highly sensitive to terminal assumptions. Flag this explicitly and widen the sensitivity range

### Step 5: WACC Calculation

WACC is the discount rate — the required return that reflects the risk of the business:

**Cost of Equity (CAPM)**:
```
Ke = Rf + β × (Rm − Rf)
```
- Rf = Risk-free rate (current 10-year US Treasury yield)
- β = Stock beta (5-year monthly, from market data; adjust for leverage if using unlevered beta)
- Rm − Rf = Equity risk premium (use Damodaran's current ERP estimate, historically 5–6%)
- Size premium: Add 0.5–2% for small/mid-cap companies with less liquidity

**Cost of Debt**:
```
Kd = (Interest Expense / Total Debt) × (1 − Effective Tax Rate)
```
- Use effective interest rate from most recent 10-K, not stated coupon rates
- Adjust for new debt issuance if capital structure has materially changed

**Capital Structure Weights**:
- E/V = Equity Market Cap / (Equity Market Cap + Total Debt)
- D/V = Total Debt / (Equity Market Cap + Total Debt)
- Use market value weights, not book value weights

**WACC Formula**:
```
WACC = Ke × (E/V) + Kd × (D/V)
```

**Typical WACC Ranges by Risk Profile**:
```
Risk Profile         WACC Range    Company Examples
─────────────────────────────────────────────────────
Low risk (utility)   6–8%          Regulated utilities, large cap staples
Medium risk          8–11%         Large cap tech, established growth
High risk            11–15%        Small cap, emerging market, cyclical
Very high risk       15–20%+       Early-stage, distressed, pre-revenue
```

### Step 6: Discount the Cash Flows

Apply the discount rate to derive present values:

```
PV of Year n FCF = FCFₙ / (1 + WACC)ⁿ

PV of Terminal Value = TV / (1 + WACC)¹⁰

Enterprise Value = Σ PV(FCF years 1–10) + PV(Terminal Value)

Equity Value = Enterprise Value − Net Debt
  (add back net cash if company has net cash position)

Intrinsic Value per Share = Equity Value / Diluted Shares Outstanding
```

**10-Year Cash Flow Projection Table**:
```
Year    Revenue ($M)    FCF Margin %    FCF ($M)    Discount Factor    PV of FCF ($M)
1       [value]         [%]             [value]     1/(1+WACC)¹        [value]
2       [value]         [%]             [value]     1/(1+WACC)²        [value]
3       [value]         [%]             [value]     1/(1+WACC)³        [value]
4       [value]         [%]             [value]     1/(1+WACC)⁴        [value]
5       [value]         [%]             [value]     1/(1+WACC)⁵        [value]
6       [value]         [%]             [value]     1/(1+WACC)⁶        [value]
7       [value]         [%]             [value]     1/(1+WACC)⁷        [value]
8       [value]         [%]             [value]     1/(1+WACC)⁸        [value]
9       [value]         [%]             [value]     1/(1+WACC)⁹        [value]
10      [value]         [%]             [value]     1/(1+WACC)¹⁰       [value]
─────────────────────────────────────────────────────────────────────────────────
Sum of PV (FCF)                                                         [value]
Terminal Value (PV)                                                     [value]
Enterprise Value                                                        [value]
Less: Net Debt                                                          [value]
Equity Value                                                            [value]
Shares Outstanding                                                      [value]
Intrinsic Value per Share                                               $[value]
```

### Step 7: Sensitivity Analysis

Always provide a 5×5 sensitivity table showing intrinsic value at different WACC and terminal growth rate combinations:

```
Sensitivity Table — Intrinsic Value per Share ($)

              Terminal Growth Rate
WACC     1.0%    1.5%    2.0%    2.5%    3.0%
6.0%     $xxx    $xxx    $xxx    $xxx    $xxx
7.0%     $xxx    $xxx    $xxx    $xxx    $xxx
8.0%     $xxx    $xxx    $xxx    $xxx    $xxx  ← Base Case
9.0%     $xxx    $xxx    $xxx    $xxx    $xxx
10.0%    $xxx    $xxx    $xxx    $xxx    $xxx

[*] Shaded cell = Base Case assumption
```

Interpretation guide:
- If the entire table shows a margin of safety vs. current price → high confidence in undervaluation
- If only a few cells show margin of safety → valuation depends critically on specific assumptions
- If no cells show margin of safety → stock is expensive under all reasonable scenarios

### Step 8: Margin of Safety Assessment

Compare intrinsic value to current market price with margin of safety framing:

```
Margin of Safety = (Intrinsic Value − Market Price) / Intrinsic Value × 100%

Upside Potential = (Intrinsic Value − Market Price) / Market Price × 100%
```

**Assessment Scale**:
```
Margin of Safety    Assessment
>30% discount       Compelling value — strong margin of safety
10–30% discount     Fair value — reasonable entry for long-term investors
0–10% discount      Fairly priced — limited margin of safety
10–30% premium      Slightly expensive — requires strong growth conviction
>30% premium        Expensive — significant growth must materialize to justify price
>50% premium        Very expensive — priced for perfection; high risk
```

Recommended minimum margin of safety:
- Value investors: 20–30%
- Growth investors: 10–15% (higher growth justifies smaller margin of safety)
- Speculative positions: No minimum, but document assumptions clearly

---

## Common DCF Pitfalls

1. **Garbage in, garbage out**: Extrapolating recent high-growth rates too far into the future. Be conservative, especially in years 6–10.
2. **Terminal value dominance**: If TV > 70% of enterprise value, the model is more speculation than analysis. Stress-test terminal assumptions aggressively.
3. **WACC too low**: Using a WACC below the risk-free rate, or ignoring size/liquidity premiums for smaller companies, artificially inflates intrinsic value.
4. **Ignoring cyclicality**: Using peak FCF margins as the base for a cyclical business. Always normalize FCF through a full business cycle.
5. **Ignoring stock-based compensation**: SBC is a real, dilutive cost. Subtract it from operating cash flow when calculating true economic FCF.
6. **Single scenario thinking**: Presenting only a base case. Always run Bull, Base, and Bear scenarios with explicit assumption differences.
7. **Hidden working capital and capex changes**: Rapidly growing companies often consume significant working capital. Ensure this drag is reflected in FCF projections, not hidden in operating cash flow.
8. **Currency and geographic mix**: For international businesses, project by geography and apply appropriate discount rates by region.

---

## DCF vs. Relative Valuation

**When DCF is most reliable**:
- Stable, mature businesses with predictable, consistent FCF
- Asset-light businesses with high FCF conversion (e.g., software, consumer brands)
- Companies with 10+ years of FCF generation history
- Businesses where future cash flows are reasonably bounded (regulated utilities, subscription SaaS)

**When DCF is less reliable (use relative valuation instead)**:
- Early-stage growth companies with no positive FCF yet — value lies in future optionality
- Highly cyclical businesses where normalizing FCF requires significant judgment
- Financial companies (banks, insurance, REITs) — use Price/Book, Price/Earnings, or dividend discount models instead
- Companies with lumpy or unpredictable capex cycles
- Turnaround situations where the path to profitability is uncertain

---

## Three-Scenario Framework

Always present three scenarios with explicit assumption differences:

```
Scenario    Probability    Revenue CAGR (Y1-5)    FCF Margin (Y5)    WACC    Terminal g
Bull         20%           [higher growth]         [higher margin]    [lower]  [2.5%]
Base         60%           [consensus growth]      [stable margin]    [base]   [2.0%]
Bear         20%           [lower growth]          [compressed]       [higher] [1.5%]

Intrinsic Value:
  Bull Case IV:    $[value]
  Base Case IV:    $[value]
  Bear Case IV:    $[value]

Probability-Weighted IV = (20% × Bull IV) + (60% × Base IV) + (20% × Bear IV) = $[value]
```

The probability-weighted IV is the primary output used for investment decision-making.

---

## Input Formats

```
# Auto-calculate using available financial data
/dcf-valuation AAPL

# With custom assumption overrides
/dcf-valuation MSFT --growth 12% --wacc 9% --terminal 2.5%

# Full three-scenario analysis
/dcf-valuation NVDA --scenarios

# Visual output optimized for /report-generator
/dcf-valuation GOOGL --visual

# Quick single-scenario estimate
/dcf-valuation AMZN --quick
```

---

## Visualization Support

When `--visual` flag is used, include chart data tables for report generation:

### FCF Projection Chart
**Chart Type**: Bar chart with line overlay (FCF bars, Revenue Growth line)
```
Year    Revenue ($M)    FCF ($M)    FCF Margin %
1       [value]         [value]     [%]
2       [value]         [value]     [%]
...
10      [value]         [value]     [%]
```

### Scenario Comparison Chart
**Chart Type**: Grouped bar chart
```
Scenario    Intrinsic Value    Current Price    Upside %
Bull        $[value]           $[value]         [%]
Base        $[value]           $[value]         [%]
Bear        $[value]           $[value]         [%]
Weighted    $[value]           $[value]         [%]
```

### Sensitivity Heat Map
**Chart Type**: Color-coded 5×5 table (green = undervalued, red = overvalued vs. current price)

---

## Output

Complete DCF report including:
1. Base Metrics (TTM FCF, margins, shares outstanding, net debt)
2. Assumption Summary (growth rates by year, margin assumptions, WACC components, terminal rate)
3. Projected Cash Flows table (10-year projection for Bull/Base/Bear)
4. WACC Calculation breakdown (Ke, Kd, weights, final WACC)
5. Enterprise and Equity Value derivation (all components shown)
6. Intrinsic Value per Share (all 3 scenarios + probability-weighted)
7. Sensitivity table (5×5 grid — WACC vs. terminal growth rate)
8. Margin of Safety assessment (vs. current price, vs. analyst consensus)
9. Comparison to current analyst consensus price targets
10. Key risks to DCF assumptions (what could make the model wrong)

### Enhanced Output (with --visual flag)
- All standard sections above
- FCF projection bar chart data
- Scenario comparison grouped bar chart data
- Sensitivity heat map color-coded table
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
