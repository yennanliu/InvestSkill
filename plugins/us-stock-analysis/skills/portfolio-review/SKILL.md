---
description: Review and analyze investment portfolio performance and allocation
---

# Portfolio Review

Comprehensive portfolio analysis and optimization recommendations.

## Phase 1 — Portfolio Snapshot

Start with a high-level summary before diving into details:
- Total portfolio value and cash position
- Number of holdings and average position size
- Date range of analysis
- Investor profile: risk tolerance (conservative / moderate / aggressive), time horizon, income vs. growth objective

## Phase 2 — Performance Analysis

1. **Absolute Returns**
   - YTD, 1Y, 3Y, 5Y total return
   - Compare against relevant benchmarks (S&P 500, Russell 2000, custom blended benchmark)
   - Annualized return vs. benchmark — outperformance or underperformance in basis points

2. **Risk-Adjusted Returns**
   - Sharpe ratio (excess return per unit of total risk)
   - Sortino ratio (penalizes only downside volatility)
   - Calmar ratio (annualized return / max drawdown)
   - Information ratio vs. benchmark

3. **Drawdown Analysis**
   - Maximum drawdown: peak-to-trough magnitude and duration
   - Recovery period after each significant drawdown
   - Drawdown frequency over the analysis window
   - Compare portfolio drawdown vs. benchmark during market stress periods

4. **Volatility Metrics**
   - Annualized standard deviation of returns
   - Beta vs. S&P 500 (market sensitivity)
   - Tracking error vs. benchmark
   - Upside capture / downside capture ratios

## Phase 3 — Asset Allocation Review

1. **Current Allocation Breakdown**
   - Asset class weights: equities, fixed income, cash, REITs, commodities, alternatives
   - Equity sub-breakdown: US large cap, US small/mid cap, international developed, emerging markets
   - Compare current weights to target/policy weights — flag deviations > 5%

2. **Geographic Diversification**
   - US vs. international exposure (%)
   - Country concentration risk — any single country > 20%?
   - Currency exposure and hedging status

3. **Sector and Industry Weights**
   - GICS sector breakdown vs. S&P 500 sector weights
   - Overweight / underweight sectors and the investment thesis behind each
   - Cyclical vs. defensive balance relative to current macro environment

4. **Market Cap Distribution**
   - Large cap / mid cap / small cap split
   - Growth vs. value tilt (P/E, P/B relative to benchmark)
   - Quality factor exposure (ROE, balance sheet strength)

## Phase 4 — Holdings Review

1. **Individual Position Analysis**
   - Position size as % of portfolio — flag any > 10% single-stock concentration
   - Contribution to total return (winners vs. laggards)
   - Unrealized gain/loss and holding period (tax impact)

2. **Position Sizing Discipline**
   - Largest 5 positions — are sizes justified by conviction and risk/reward?
   - Smallest positions — are they too small to be meaningful?
   - Kelly criterion or volatility-scaled sizing check

3. **Overlap and Redundancy**
   - Identify pairs of holdings with > 0.7 correlation
   - ETF overlap analysis — holdings duplicated across ETFs
   - Factor overlap: are multiple positions expressing the same single bet?

4. **Cost Efficiency**
   - Weighted average expense ratio for ETF/fund holdings
   - Estimated annual trading cost drag
   - Tax lot optimization — identify specific lots to sell for tax efficiency

## Phase 5 — Optimization Recommendations

1. **Rebalancing Actions**
   - List all positions with > 2% drift from target weight
   - Priority order: largest drift first
   - Tax-aware rebalancing: prioritize tax-loss harvesting in taxable accounts
   - Proposed trades: ticker, action (buy/sell/trim), target weight, estimated proceeds

2. **Diversification Improvements**
   - Specific gaps to fill (e.g., no international exposure, no inflation hedge)
   - Correlation-reduction swaps: replace redundant holdings with uncorrelated alternatives
   - Alternative asset candidates if appropriate (gold, TIPS, REITs, private credit proxies)

3. **Underperformer Review**
   - For each position underperforming benchmark by > 10% over 1Y:
     - Is the original thesis intact?
     - Has fundamentals deteriorated or is this a temporary setback?
     - Hold / average down / exit decision with rationale

4. **Upgrade Candidates**
   - Positions to add based on current conviction and valuation
   - New opportunities that fit the portfolio's existing factor tilts
   - Cost reduction opportunities (replace active fund with cheaper ETF equivalent)

## Output Format

Deliver the review as a structured report with these sections:
1. Executive Summary (3–5 bullet points: biggest strengths and risks)
2. Performance Scorecard (table: metric | portfolio | benchmark | delta)
3. Allocation Heat Map (sector/geography breakdown in table form)
4. Holdings Table (position | weight | 1Y return | status: hold/trim/exit)
5. Action List (prioritized, with expected portfolio impact)
6. Implementation Roadmap (immediate / 30-day / 90-day actions)

Focus on actionable insights aligned with the investor's stated objectives and risk tolerance. Flag any positions or allocations that conflict with the investor profile.

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

**Score Guide**: 8.0–10.0 Strongly Bullish | 6.0–7.9 Moderately Bullish | 4.0–5.9 Neutral | 2.0–3.9 Moderately Bearish | 0.0–1.9 Strongly Bearish
**Confidence**: HIGH (strong data, clear signals) | MEDIUM (mixed signals) | LOW (limited data, conflicting signals)
**Horizon**: SHORT-TERM (1 week–3 months) | MEDIUM-TERM (3 months–1 year) | LONG-TERM (1+ years)
