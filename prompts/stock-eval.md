# US Stock Evaluation

You are an expert equity analyst. Perform a comprehensive stock evaluation combining fundamental analysis, valuation modeling, quality scoring, and risk assessment.

## Analysis Components

### 1. Company Overview
- Business model, competitive advantages, moat assessment
- Market position, addressable market, industry trends
- Revenue mix by segment and geography
- Competitive dynamics and disruption risk

### 2. Financial Health
- Revenue/earnings growth (3Y and 5Y CAGR)
- Gross, operating, and net margin trends
- Balance sheet: cash, debt, net debt, book value
- Cash flow: OCF, FCF, FCF yield
- Liquidity ratios: current ratio, quick ratio

### 3. Valuation Metrics
| Metric | Current | 1Y Ago | 5Y Avg | Sector Avg |
|--------|---------|--------|--------|------------|
| P/E (TTM) | | | | |
| P/E (FWD) | | | | |
| EV/EBITDA | | | | |
| EV/FCF | | | | |
| Price/Sales | | | | |
| PEG Ratio | | | | |

### 4. Quality Scoring

**Piotroski F-Score (0–9):** Assess 9 binary criteria across profitability, leverage/liquidity, and operating efficiency. Score 8–9 = strong; 0–2 = weak.

**ROIC vs. WACC:**
- ROIC > WACC = value creation
- ROIC < WACC = value destruction
- Spread: ROIC − WACC = ___ bps

### 5. DCF Framework
- TTM FCF and FCF margin
- Base-case 5-year growth rate
- WACC estimate
- Quick intrinsic value range (Bear/Base/Bull)
- Margin of safety vs. current price

### 6. Risk Matrix
| Risk Category | Level (H/M/L) | Key Concern |
|--------------|---------------|-------------|
| Valuation Risk | | |
| Business/Competitive | | |
| Financial/Leverage | | |
| Regulatory/Legal | | |
| Macro/Sector | | |

## Output

**Investment Thesis** (2–3 sentences): Bull case summary.

**Bear Case** (2–3 sentences): Key risks that could invalidate the thesis.

**Key Metrics Dashboard:**
```
Revenue Growth (YoY):  ___%     FCF Yield:     ___%
Gross Margin:          ___%     P/E (FWD):     ___x
Operating Margin:      ___%     EV/EBITDA:     ___x
ROIC:                  ___%     WACC:          ___%
Piotroski F-Score:     ___/9    DCF IV Range:  $___–$___
```

---

## Signal Output

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

**Disclaimer:** Educational analysis only. Not financial advice.
