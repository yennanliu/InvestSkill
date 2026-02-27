---
description: Multi-method stock valuation using DCF, comparable company analysis, EV multiples, and residual income models
---

# Stock Valuation

Derive a rigorous intrinsic value estimate using multiple independent valuation methodologies, then triangulate to a single probability-weighted target price. Never rely on a single method — cross-validation across DCF, comparable company analysis (CCA), EV/EBITDA, and residual income models builds conviction and exposes assumption fragility.

## Overview

Valuation is an art grounded in financial science. Each method has strengths and weaknesses depending on the business type, stage of maturity, and data availability. This skill applies four to five valuation methods, then reconciles them into a football field chart to show the implied value range. Wherever there is consensus across methods, conviction is high. Where methods diverge significantly, that gap tells you something important about market expectations.

---

## When to Use Each Method

```
Valuation Method          Best For                           Avoid For
────────────────────────────────────────────────────────────────────────────────────
DCF (Free Cash Flow)      Mature, FCF-positive businesses    Pre-revenue, banks, REITs
Comparable Company (CCA)  Any publicly traded company        No good public comps
EV/EBITDA Multiple        Capital-intensive industrials      Asset-light, high-SBC tech
Price/Earnings (P/E)      Stable earnings businesses         Negative earnings
Price/Sales (P/S)         Revenue-stage growth companies     Mature high-margin businesses
EV/Revenue                High-growth, low-margin SaaS       Mature, cyclical businesses
Residual Income (RI)      Financial companies, book-value    Asset-light businesses
Dividend Discount (DDM)   Dividend-paying value stocks       Growth stocks, no dividend
Asset-Based NAV           Real estate, holding companies     Operating businesses
────────────────────────────────────────────────────────────────────────────────────
```

---

## Method 1: Discounted Cash Flow (DCF)

### Step 1: Base Financial Metrics

Collect trailing twelve months (TTM) data:

```
Base Metrics:
  Revenue (TTM):                    $___M
  Operating Cash Flow (TTM):        $___M
  Capital Expenditures (TTM):       $___M
  Free Cash Flow (TTM):             $___M  (OCF - Capex)
  FCF Margin (TTM):                 ___%
  Stock-Based Compensation (TTM):   $___M
  True Economic FCF (SBC-adjusted): $___M
  Diluted Shares Outstanding:       ___M
  Net Debt / (Net Cash):            $___M
  Effective Tax Rate:               ___%
```

### Step 2: Three-Scenario Projections (10-Year)

```
Scenario Assumptions:
                        Bull        Base        Bear
Probability:            20%         60%         20%
Revenue CAGR Y1-5:      ___%        ___%        ___%
Revenue CAGR Y6-10:     ___%        ___%        ___%
FCF Margin Y5:          ___%        ___%        ___%
FCF Margin Y10:         ___%        ___%        ___%
WACC:                   ___%        ___%        ___%
Terminal Growth Rate:   ___%        ___%        ___%
```

### Step 3: WACC Calculation

```
Cost of Equity (CAPM):
  Risk-Free Rate (10Y Treasury):  ___%
  Beta (5-year monthly):          ___
  Equity Risk Premium:            ___%
  Size Premium (if applicable):   ___%
  Cost of Equity:                 ___% = Rf + β × ERP + Size

Cost of Debt:
  Interest Expense (TTM):         $___M
  Total Debt:                     $___M
  Effective Interest Rate:        ___%
  Tax Rate:                       ___%
  After-Tax Cost of Debt:         ___%

Capital Structure:
  Equity Market Cap:              $___M
  Total Debt:                     $___M
  E/V (Equity Weight):            ___%
  D/V (Debt Weight):              ___%

WACC = Ke × (E/V) + Kd × (D/V) = ___%
```

### Step 4: DCF Valuation Table

```
10-Year FCF Projection (Base Case):
Year    Revenue ($M)    FCF Margin%    FCF ($M)    Discount Factor    PV of FCF ($M)
1       ___             ___%           ___         ___                ___
2       ___             ___%           ___         ___                ___
3       ___             ___%           ___         ___                ___
4       ___             ___%           ___         ___                ___
5       ___             ___%           ___         ___                ___
6       ___             ___%           ___         ___                ___
7       ___             ___%           ___         ___                ___
8       ___             ___%           ___         ___                ___
9       ___             ___%           ___         ___                ___
10      ___             ___%           ___         ___                ___
────────────────────────────────────────────────────────────────────────────────────
Sum of PV (FCF 1-10):                                                ___
Terminal Value = FCF10 × (1+g) / (WACC-g):                          ___
PV of Terminal Value:                                                ___
Enterprise Value:                                                    ___
Less: Net Debt:                                                      ___
Equity Value:                                                        ___
Diluted Shares:                                                      ___M
DCF Intrinsic Value per Share:                                       $___
TV as % of EV (flag if >75%):                                        ___%
```

### Step 5: Sensitivity Table

```
Intrinsic Value per Share — WACC vs. Terminal Growth Rate
              Terminal Growth Rate
WACC     1.0%     1.5%     2.0%     2.5%     3.0%
6.0%     $___     $___     $___     $___     $___
7.0%     $___     $___     $___     $___     $___
8.0%     $___     $___     $___     $___     $___   ← Base Case
9.0%     $___     $___     $___     $___     $___
10.0%    $___     $___     $___     $___     $___
```

---

## Method 2: Comparable Company Analysis (CCA)

Select 5–8 comparable public companies based on:
- Same industry and sub-industry
- Similar business model (SaaS vs. perpetual license, etc.)
- Similar growth profile (high-growth vs. mature)
- Similar size (market cap within 0.5–2.0x range preferred)

### Comparable Company Table

```
Comparable Company Multiples:
Company    Mkt Cap    EV/Rev    EV/EBITDA    P/E (FWD)    P/FCF    EV/FCF    Rev Growth%    EBITDA Mg%
Target     ___        ___       ___          ___          ___      ___       ___%           ___%
Peer 1     ___        ___       ___          ___          ___      ___       ___%           ___%
Peer 2     ___        ___       ___          ___          ___      ___       ___%           ___%
Peer 3     ___        ___       ___          ___          ___      ___       ___%           ___%
Peer 4     ___        ___       ___          ___          ___      ___       ___%           ___%
Peer 5     ___        ___       ___          ___          ___      ___       ___%           ___%
───────────────────────────────────────────────────────────────────────────────────────────────────
Peer Mean  ___        ___       ___          ___          ___      ___       ___%           ___%
Peer Median___        ___       ___          ___          ___      ___       ___%           ___%
```

### CCA Implied Value

Apply peer median multiples to the target's metrics:

```
CCA Valuation:
Metric          Target Value    Peer Median Multiple    Implied EV/Share    Weight
EV/Revenue      $___M Rev       ___x                    $___                25%
EV/EBITDA       $___M EBITDA    ___x                    $___                25%
P/E (Forward)   $___  EPS       ___x                    $___                25%
EV/FCF          $___M FCF       ___x                    $___                25%
────────────────────────────────────────────────────────────────────────────────────
CCA Weighted Average Implied Price:                      $___
Premium/Discount Applied (for size, quality):            ±___%
CCA Adjusted Implied Price:                              $___
```

**Premium/Discount Adjustment Factors:**
- Apply a +10–20% premium if the target has: superior growth, higher margins, stronger balance sheet
- Apply a -10–25% discount if: smaller/less liquid, weaker fundamentals, regulatory overhang

---

## Method 3: EV/EBITDA Multiple Valuation

Simple multiple-based valuation used primarily as a sanity check:

```
EV/EBITDA Valuation:
  TTM EBITDA:                    $___M
  Forward EBITDA (NTM):          $___M
  Historical EV/EBITDA Average:  ___x  (5-year own history)
  Peer Median EV/EBITDA:         ___x
  Sector Median EV/EBITDA:       ___x

  Conservative Multiple (peer discount): ___x
  Base Multiple (peer median):           ___x
  Premium Multiple (peer premium):       ___x

  Conservative Implied EV:       $___M  → Per Share: $___
  Base Implied EV:               $___M  → Per Share: $___
  Premium Implied EV:            $___M  → Per Share: $___

  Net Debt/(Cash):               $___M
  Shares Outstanding:            ___M
```

---

## Method 4: Price/Earnings (P/E) Valuation

For companies with stable, growing earnings:

```
P/E Valuation:
  TTM GAAP EPS:                  $___
  NTM Consensus EPS:             $___
  2-Year Forward EPS:            $___

  Historical P/E Average (5yr):  ___x
  Peer Median P/E (NTM):         ___x
  S&P 500 P/E (NTM):             ___x   [for context]

  PEG Ratio (NTM P/E / Growth):  ___    [<1.0 = undervalued, >2.0 = expensive]

  Conservative P/E (10% discount to peer): ___x → Implied Price: $___
  Base P/E (peer median):                  ___x → Implied Price: $___
  Premium P/E (10% premium to peer):       ___x → Implied Price: $___
```

---

## Method 5: Residual Income / Economic Value Added

For financial companies or businesses where book value is meaningful:

```
Residual Income Model:
  Book Value per Share (current):        $___
  Cost of Equity (Ke):                   ___%
  Expected ROE (avg next 5 years):       ___%
  Residual Income (ROE - Ke) × BV:       $___

  Justified P/B = 1 + (ROE - Ke) / (Ke - g)
                = 1 + (___ - ___) / (___ - ___)
                = ___x

  Book Value per Share:                  $___
  Justified P/B:                         ___x
  Residual Income Implied Price:         $___
```

---

## Football Field Summary — Valuation Range

Present all methods together in a football field chart:

```
Football Field Valuation Summary — [TICKER]
Current Market Price: $___

Method                      Bear (Low)    Base (Mid)    Bull (High)    Confidence
────────────────────────────────────────────────────────────────────────────────────
DCF — Bear/Base/Bull         $___          $___          $___           HIGH/MED/LOW
CCA — Peer Multiples         $___          $___          $___           HIGH/MED/LOW
EV/EBITDA Multiple           $___          $___          $___           HIGH/MED/LOW
P/E Multiple                 $___          $___          $___           HIGH/MED/LOW
Residual Income (if used)    $___          $___          $___           HIGH/MED/LOW
52-Week Range                $___          ─────────     $___           [Market]
Analyst Consensus            $___          $___          $___           [Street]
────────────────────────────────────────────────────────────────────────────────────
COMPOSITE INTRINSIC VALUE    $___          $___          $___

Visual Football Field:
$[low] |────────[bear range]────|────────[base range]────|────────[bull range]────| $[high]
                                              ▲
                                       Current Price $___
```

### Composite Valuation Calculation

```
Method Weighting (adjust based on applicable methods):
  DCF Valuation:              ___% weight    Implied: $___
  CCA (Comps):                ___% weight    Implied: $___
  EV/EBITDA Multiple:         ___% weight    Implied: $___
  P/E Multiple:               ___% weight    Implied: $___
  Residual Income:            ___% weight    Implied: $___
  ─────────────────────────────────────────────────────────
  Composite Weighted IV:                     $___
  Current Market Price:                      $___
  Margin of Safety:                          ___%  (discount to IV)
  Upside/Downside Potential:                 ___%
```

---

## Margin of Safety Framework

```
Margin of Safety = (Intrinsic Value − Market Price) / Intrinsic Value × 100%

Assessment:
>30% discount to IV    → Compelling value — strong margin of safety
10–30% discount        → Fair value — reasonable entry
0–10% discount         → Fairly priced — limited margin of safety
10–30% premium         → Slightly expensive — requires growth conviction
>30% premium           → Expensive — priced for perfection
>50% premium           → Very expensive — significant risk of multiple compression

Investor Type Minimums:
  Deep Value:       25–35% margin of safety required
  GARP:             10–20% margin of safety
  Growth:           0–10% (or slight premium for high-quality growth)
  Momentum:         Not applicable
```

---

## Risk-Adjusted Expected Return

Calculate the expected return across scenarios:

```
Expected Return Analysis:
Scenario    Probability    Price Target    Return vs. Current    Expected Return
────────────────────────────────────────────────────────────────────────────────
Bull         ___%           $___           +___%                 ___% contribution
Base         ___%           $___           +/-___%               ___% contribution
Bear         ___%           $___           -___%                 ___% contribution
────────────────────────────────────────────────────────────────────────────────
Probability-Weighted Expected Return:                            ___%

Risk/Reward Ratio:  [Bull upside] / [Bear downside] = ___x
(Good investments typically offer 3:1 or better risk/reward)
```

---

## Analyst Consensus vs. Intrinsic Value

```
Street vs. Model Comparison:
  Analyst Consensus Target (Mean):    $___
  Analyst Consensus Target (High):    $___
  Analyst Consensus Target (Low):     $___
  # Analysts covering:                ___
  Buy / Hold / Sell ratings:          ___ / ___ / ___

  Our Composite IV:                   $___
  vs. Consensus Mean:                 ___% [premium/discount]

  Interpretation:
  - Model > Consensus: Market may be underestimating growth/margin potential
  - Model < Consensus: Street may be pricing in too-optimistic assumptions
  - Large divergence: Investigate the key assumption difference
```

---

## Input Formats

```bash
# Auto-calculate from public financial data
/stock-valuation AAPL

# Specify methods to use
/stock-valuation MSFT --methods dcf,cca,ev-ebitda

# Full multi-method analysis with visual output
/stock-valuation NVDA --full --visual

# Quick single-method valuation
/stock-valuation GOOGL --method dcf --quick

# Custom assumption overrides
/stock-valuation AMZN --growth 15% --wacc 9% --terminal 2.5%

# Compare multiple stocks
/stock-valuation AAPL,MSFT,GOOGL --compare

# With peer set specification
/stock-valuation META --peers SNAP,PINS,TWTR,RDDT
```

---

## Output Summary

Complete valuation report including:

1. **Business Summary**: One-paragraph description of the business model and competitive position
2. **Method Selection Rationale**: Why each method was selected or excluded
3. **DCF Analysis**: Full 10-year projections, WACC calculation, sensitivity table (3 scenarios)
4. **Comparable Company Analysis**: Peer table with multiples and implied values
5. **Multiple-Based Valuations**: EV/EBITDA, P/E, P/FCF implied ranges
6. **Football Field Chart**: Visual range of all methods
7. **Composite Intrinsic Value**: Weighted average across all methods
8. **Margin of Safety Assessment**: Discount/premium to current price
9. **Risk-Adjusted Expected Return**: Scenario-weighted expected return calculation
10. **Key Valuation Risks**: What assumptions could most materially change the outcome
11. **Analyst Consensus Comparison**: How model compares to Street consensus

---

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
