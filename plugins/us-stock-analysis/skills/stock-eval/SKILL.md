---
description: Evaluate US stocks with comprehensive fundamental and valuation analysis
---

# US Stock Evaluation

Perform comprehensive stock evaluation combining fundamental analysis, valuation modeling, quality scoring, and risk assessment to produce investment-grade conclusions.

## Analysis Components

### 1. Company Overview

- Business model and competitive advantages (moat assessment)
- Market position, addressable market size, and industry trends
- Revenue mix by segment and geographic exposure
- Key products, services, and customer concentration
- Competitive dynamics and threat of disruption

### 2. Financial Health

- Revenue and earnings growth trends (3-year and 5-year CAGR)
- Profit margins: gross margin, operating margin, net margin
- Margin trends: expanding, stable, or compressing
- Balance sheet strength: cash, total debt, net debt, book value
- Liquidity: current ratio, quick ratio, cash conversion cycle
- Cash flow analysis: operating cash flow, free cash flow, FCF yield
- Capital expenditure requirements (maintenance vs. growth capex)
- Working capital management efficiency

### 3. Valuation Metrics

| Metric          | Current | 1-Year Ago | 5-Year Avg | Sector Avg |
|-----------------|---------|------------|------------|------------|
| P/E (TTM)       |         |            |            |            |
| P/E (Forward)   |         |            |            |            |
| PEG Ratio       |         |            |            |            |
| Price/Book      |         |            |            |            |
| Price/Sales     |         |            |            |            |
| EV/EBITDA       |         |            |            |            |
| EV/FCF          |         |            |            |            |
| Dividend Yield  |         |            |            |            |
| Payout Ratio    |         |            |            |            |

### 4. Key Ratios

| Ratio                  | Current | Industry Avg | Assessment |
|------------------------|---------|--------------|------------|
| Return on Equity (ROE) |         |              |            |
| Return on Assets (ROA) |         |              |            |
| Return on Inv. Capital |         |              |            |
| Gross Margin           |         |              |            |
| Operating Margin       |         |              |            |
| Net Margin             |         |              |            |
| Current Ratio          |         |              |            |
| Quick Ratio            |         |              |            |
| Debt-to-Equity         |         |              |            |
| Interest Coverage      |         |              |            |
| Asset Turnover         |         |              |            |

### 5. Peer Comparison

- Direct peer comparison within industry on key valuation multiples
- Historical valuation trends vs. own 5-year history
- Sector performance context and relative positioning
- Market share trends vs. competitors

---

## Quality Scoring Framework

### Piotroski F-Score (0–9)

The Piotroski F-Score measures financial strength and operating improvement across 9 binary criteria. Each criterion scores 1 (pass) or 0 (fail). Score of 8–9 is strong; 0–2 is weak.

**Profitability Signals (4 criteria):**

| # | Criterion | Formula | Pass Condition | Score |
|---|-----------|---------|----------------|-------|
| 1 | ROA > 0 | Net Income / Total Assets | Positive ROA in current year | 0 or 1 |
| 2 | Operating Cash Flow > 0 | CFO from cash flow statement | Positive CFO | 0 or 1 |
| 3 | Change in ROA | ROA(t) − ROA(t-1) | ROA improved year-over-year | 0 or 1 |
| 4 | Accruals (quality) | CFO / Total Assets > ROA | Cash earnings exceed reported earnings | 0 or 1 |

**Leverage, Liquidity & Source of Funds (3 criteria):**

| # | Criterion | Formula | Pass Condition | Score |
|---|-----------|---------|----------------|-------|
| 5 | Change in Leverage | Long-term Debt / Avg Assets | Leverage decreased YoY | 0 or 1 |
| 6 | Change in Liquidity | Current Ratio(t) vs (t-1) | Current ratio improved YoY | 0 or 1 |
| 7 | No New Shares Issued | Diluted shares outstanding | No new equity issuance in past year | 0 or 1 |

**Operating Efficiency (2 criteria):**

| # | Criterion | Formula | Pass Condition | Score |
|---|-----------|---------|----------------|-------|
| 8 | Change in Gross Margin | Gross Margin(t) vs (t-1) | Gross margin expanded YoY | 0 or 1 |
| 9 | Change in Asset Turnover | Revenue / Total Assets | Asset turnover improved YoY | 0 or 1 |

**F-Score Interpretation:**
- **8–9**: Strong financial position — high-quality candidate
- **5–7**: Average quality — neutral
- **0–2**: Weak financial position — high risk of deterioration

### Earnings Quality Score

- **Accruals Ratio**: (Net Income − CFO) / Average Total Assets. Low or negative accruals indicate high earnings quality (cash-backed profits).
- **Cash Conversion Rate**: CFO / Net Income. Ratio consistently above 1.0x is positive. Below 0.7x signals potential earnings inflation.
- **Non-Recurring Items**: Identify and strip out restructuring charges, asset write-downs, gains on asset sales, and one-time tax benefits from normalized earnings.
- **Revenue Recognition Risk**: Assess channel stuffing, bill-and-hold arrangements, and aggressive deferred revenue recognition.

---

## ROIC / WACC Analysis

### ROIC Calculation

**ROIC = NOPAT / Invested Capital**

- **NOPAT** (Net Operating Profit After Tax) = EBIT × (1 − effective tax rate)
- **Invested Capital** = Total Equity + Total Debt − Cash and Cash Equivalents
- Alternatively: Invested Capital = Net PP&E + Net Working Capital + Goodwill + Other Long-term Operating Assets

| Component                | Value |
|--------------------------|-------|
| EBIT                     |       |
| Effective Tax Rate       |       |
| NOPAT                    |       |
| Total Equity             |       |
| Total Debt               |       |
| Less: Cash               |       |
| Invested Capital         |       |
| **ROIC**                 |       |

### WACC Calculation

**WACC = (E/V) × Re + (D/V) × Rd × (1 − T)**

- **Cost of Equity (Re)** via CAPM: Re = Rf + β × (Rm − Rf)
  - Rf: Risk-free rate (current 10-year Treasury yield)
  - β: Stock beta (5-year monthly vs. S&P 500)
  - (Rm − Rf): Equity risk premium (historical ~5–6%)
- **Cost of Debt (Rd)**: Weighted average interest rate on outstanding debt
- **Capital Structure Weights**: E/V = market cap / (market cap + total debt), D/V = total debt / (market cap + total debt)
- **Tax Shield**: Multiply Rd by (1 − marginal tax rate) to reflect interest deductibility

| Component              | Value |
|------------------------|-------|
| Risk-Free Rate (Rf)    |       |
| Beta (β)               |       |
| Equity Risk Premium    |       |
| Cost of Equity (Re)    |       |
| Pre-Tax Cost of Debt   |       |
| Tax Rate               |       |
| After-Tax Cost of Debt |       |
| Equity Weight (E/V)    |       |
| Debt Weight (D/V)      |       |
| **WACC**               |       |

### Economic Value Added (EVA)

**EVA = (ROIC − WACC) × Invested Capital**

- **ROIC > WACC**: Company is creating economic value — every dollar invested earns more than its cost. Strong positive signal.
- **ROIC = WACC**: Company is breaking even economically — no value creation or destruction.
- **ROIC < WACC**: Company is destroying shareholder value — capital is deployed below its opportunity cost. Significant warning sign.

ROIC vs. WACC spread trend (expanding = improving value creation, compressing = deteriorating):

| Year    | ROIC | WACC | Spread | EVA |
|---------|------|------|--------|-----|
| Current |      |      |        |     |
| -1 Year |      |      |        |     |
| -2 Year |      |      |        |     |
| -3 Year |      |      |        |     |

---

## DCF Framework

### Step-by-Step DCF Methodology

**Step 1 — Project Free Cash Flow (Years 1–10)**
- Start with current year base FCF = Operating Cash Flow − Maintenance Capex
- Apply revenue growth rate assumptions (differentiate Phase 1: high growth, Phase 2: fade to stable)
- Apply operating margin assumptions (expanding/stable/compressing)
- Deduct taxes and changes in net working capital
- FCF = NOPAT + D&A − Change in Working Capital − Capex

**Step 2 — Terminal Value Calculation**
- Gordon Growth Model: TV = FCF(Year 10) × (1 + g) / (WACC − g)
- Exit Multiple Method: TV = EBITDA(Year 10) × Terminal EV/EBITDA multiple
- Terminal growth rate (g): typically 2–3% (in line with long-run nominal GDP growth)
- Cross-check both methods for reasonableness

**Step 3 — Discount to Present Value**
- Discount each year's FCF: PV(FCFt) = FCFt / (1 + WACC)^t
- Discount terminal value: PV(TV) = TV / (1 + WACC)^10
- Enterprise Value = Sum of all discounted FCFs + PV(Terminal Value)
- Equity Value = Enterprise Value − Net Debt
- Intrinsic Value Per Share = Equity Value / Diluted Shares Outstanding

### Key Assumptions

| Assumption             | Base Case | Bull Case | Bear Case |
|------------------------|-----------|-----------|-----------|
| Revenue Growth Yr 1–5  |           |           |           |
| Revenue Growth Yr 6–10 |           |           |           |
| Operating Margin       |           |           |           |
| Tax Rate               |           |           |           |
| Capex (% Revenue)      |           |           |           |
| WACC                   |           |           |           |
| Terminal Growth Rate   |           |           |           |
| Terminal EV/EBITDA     |           |           |           |

### Sensitivity Table

Intrinsic value per share at various WACC and terminal growth rate combinations:

| WACC \ Terminal Growth | 1.5%  | 2.0%  | 2.5%  | 3.0%  | 3.5%  |
|------------------------|-------|-------|-------|-------|-------|
| 7%                     |       |       |       |       |       |
| 8%                     |       |       |       |       |       |
| 9%                     |       |       |       |       |       |
| 10%                    |       |       |       |       |       |
| 11%                    |       |       |       |       |       |

### Margin of Safety Assessment

- **Intrinsic Value (Base Case)**:
- **Current Market Price**:
- **Premium / (Discount) to Intrinsic Value**:
- **Margin of Safety**: (Intrinsic Value − Market Price) / Intrinsic Value × 100%
  - > 30% discount: Significant margin of safety — compelling value
  - 10–30% discount: Moderate margin of safety — attractive
  - 0–10% discount: Limited margin of safety — fairly valued
  - Trading at premium: No margin of safety — risk of capital loss if assumptions miss

---

## Management Quality Assessment

### Capital Allocation Track Record

- **ROIC Trend**: Is management generating returns above cost of capital consistently? Review 5-year ROIC history.
- **Acquisition History**: Evaluate past M&A for value creation. Did acquired assets earn above WACC? Were goodwill impairments taken post-acquisition?
- **Buyback Timing**: Did management repurchase shares below intrinsic value? Assess buyback price vs. subsequent performance.
- **Dividend Policy**: Sustainable payout ratio? Dividend growth track record. Balance between dividends, buybacks, and reinvestment.
- **Capex Discipline**: Differentiate growth capex vs. maintenance capex. Asset-light vs. capital-intensive business assessment.

### Guidance Accuracy History (Last 8 Quarters)

| Quarter  | EPS Guidance | EPS Actual | Beat/Miss | Revenue Guidance | Revenue Actual | Beat/Miss |
|----------|-------------|------------|-----------|------------------|----------------|-----------|
| Q1       |             |            |           |                  |                |           |
| Q2       |             |            |           |                  |                |           |
| Q3       |             |            |           |                  |                |           |
| Q4       |             |            |           |                  |                |           |
| Q5       |             |            |           |                  |                |           |
| Q6       |             |            |           |                  |                |           |
| Q7       |             |            |           |                  |                |           |
| Q8       |             |            |           |                  |                |           |
| **Rate** |             |            | X/8       |                  |                | X/8       |

- Beat rate above 75% (6+/8) is strong. Below 50% suggests overpromising or deteriorating visibility.
- Assess guidance conservatism (sandbagging tendency) vs. optimism bias.

### Insider Ownership Alignment

- **CEO ownership** (% of shares outstanding): > 3% meaningful, > 10% highly aligned
- **Board ownership**: Independent directors with meaningful personal stakes indicate alignment
- **Recent insider transactions**: Open-market buys are strongly positive; sells can be routine diversification
- **Insider buy/sell ratio** over past 12 months
- **10b5-1 plan activity**: Scheduled plan sales are less informative than discretionary transactions

### Compensation Structure

- **Pay-for-performance alignment**: Are bonuses and equity vesting tied to ROIC, FCF, and total shareholder return (TSR)?
- **Long-term equity grants**: Stock option or RSU vesting periods (3+ years preferred)
- **CEO pay ratio**: Context for compensation relative to company size and peers
- **Say-on-pay vote**: Shareholder approval percentage in most recent proxy vote
- **Excessive compensation red flags**: Guaranteed bonuses, repriced options, change-of-control severance packages

---

## Analyst Consensus Tracking

### Current Consensus Summary

| Metric               | Value |
|----------------------|-------|
| Buy Ratings          | X (X%) |
| Hold Ratings         | X (X%) |
| Sell Ratings         | X (X%) |
| Mean Price Target    |       |
| High Price Target    |       |
| Low Price Target     |       |
| Current Price        |       |
| Upside to Mean Target|       |
| # of Analysts        |       |

**Consensus interpretation:**
- >70% Buy with >20% upside to mean target: Strong consensus support
- Mixed ratings with tight price target range: Consensus uncertainty
- >30% Sell ratings or mean target below current price: Consensus cautious

### Estimate Revision Trend

Track the direction of earnings estimate changes over time:

| Period       | EPS Estimate (Current FY) | Change vs. 30 Days Ago | Change vs. 90 Days Ago |
|--------------|--------------------------|------------------------|------------------------|
| Current FY   |                          |                        |                        |
| Next FY      |                          |                        |                        |
| Revenue (FY) |                          |                        |                        |

- **Estimates rising**: Positive revision momentum — analysts upgrading expectations
- **Estimates falling**: Negative revision momentum — earnings risk, watch for guidance cuts
- **Stable estimates**: Predictable business with low estimate volatility

### Earnings Estimate Revision Momentum (ERM Signal)

- ERM = (Number of upward revisions − Number of downward revisions) / Total revisions over 30 days
- **ERM > +0.3**: Strong positive momentum — bullish signal
- **ERM −0.3 to +0.3**: Neutral
- **ERM < −0.3**: Negative momentum — bearish signal
- Most reliable when combined with price momentum confirmation

---

## Risk Assessment Matrix

### Business Risk

| Risk Factor        | Level (L/M/H) | Notes |
|--------------------|---------------|-------|
| Industry cyclicality |             |       |
| Competitive intensity |            |       |
| Disruption threat  |               |       |
| Customer concentration |           |       |
| Supplier concentration |           |       |
| Regulatory exposure |              |       |
| ESG / litigation   |               |       |

### Financial Risk

| Risk Factor        | Level (L/M/H) | Notes |
|--------------------|---------------|-------|
| Leverage (Net Debt/EBITDA) |       |       |
| Liquidity (Current Ratio) |        |       |
| Refinancing risk (near-term maturities) |  | |
| Covenant compliance |              |       |
| Pension obligations |              |       |
| Off-balance-sheet items |          |       |

**Leverage thresholds (Net Debt/EBITDA):**
- < 1.0x: Conservative, strong balance sheet
- 1.0–2.5x: Moderate, manageable
- 2.5–4.0x: Elevated, monitor closely
- > 4.0x: High financial risk, limited flexibility

### Valuation Risk

| Scenario                  | Implied Multiple | Notes |
|---------------------------|-----------------|-------|
| Bull case intrinsic value  |                |       |
| Base case intrinsic value  |                |       |
| Bear case intrinsic value  |                |       |
| Current market price       |                |       |
| Premium to bear case       |                |       |

- **Multiple compression scenario**: If sector re-rates to lower multiples (e.g., in rising rate environment), what is the downside?
- **Earnings miss scenario**: What happens to price if EPS misses by 10%? By 20%?
- **Sentiment shift risk**: High-multiple, high-expectation stocks carry disproportionate downside on minor guidance cuts.

### Macro Risk

| Factor              | Impact Level | Current Exposure |
|---------------------|-------------|-----------------|
| Interest rate sensitivity |       |                 |
| USD/FX exposure     |             |                 |
| Commodity cost exposure |         |                 |
| Tariff / trade risk |             |                 |
| Geopolitical exposure |           |                 |
| Regulatory / antitrust |          |                 |

---

## Output Format

Provide clear, actionable insights structured as follows:

1. **Investment Thesis Summary** (2–3 sentences capturing the core bull or bear case)
2. **Valuation Assessment**: Undervalued / Fairly Valued / Overvalued, with DCF and multiple-based support
3. **Quality Score**: Piotroski F-Score, Earnings Quality, ROIC vs. WACC verdict
4. **Management Assessment**: Capital allocator quality, guidance credibility, ownership alignment
5. **Analyst Consensus**: Current ratings, price target vs. market, estimate revision direction
6. **Key Risks**: Top 3 risks that could invalidate the thesis
7. **Price Targets**: Bull / Base / Bear case with probability weighting
8. **Recommended Entry Zone**: Based on margin of safety and technical support levels

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
