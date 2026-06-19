# Fundamental Analysis

> **This skill has been merged into `stock-eval`.** Use the `stock-eval` prompt for comprehensive fundamental + quality + valuation analysis.

## Quick Reference — Key Ratios

| Ratio | Formula | What It Measures |
|-------|---------|-----------------|
| **P/E** (Price-to-Earnings) | Market Price / EPS | How much investors pay per dollar of earnings; compare to peers and history |
| **P/B** (Price-to-Book) | Market Price / Book Value per Share | Premium over net asset value; useful for financials and asset-heavy businesses |
| **P/S** (Price-to-Sales) | Market Cap / Revenue | Valuation relative to revenue; useful when earnings are negative or depressed |
| **EV/EBITDA** | Enterprise Value / EBITDA | Capital-structure-neutral earnings multiple; standard M&A and cross-sector benchmark |
| **ROE** (Return on Equity) | Net Income / Shareholders' Equity | Profitability relative to equity book value; decompose with DuPont for quality assessment |
| **ROIC** (Return on Invested Capital) | NOPAT / Invested Capital | True economic return on all capital deployed; compare to WACC to assess value creation |
| **Current Ratio** | Current Assets / Current Liabilities | Short-term liquidity; >1.5x generally healthy; <1.0x signals potential liquidity stress |
| **D/E** (Debt-to-Equity) | Total Debt / Shareholders' Equity | Financial leverage; higher ratio = more risk but also more return amplification |

For the full analysis framework — income statement line-item breakdown, working capital cycle, DuPont decomposition, cash conversion cycle, Porter's Five Forces, Piotroski F-Score, DCF, ROIC/WACC, and risk matrix — use `prompts/stock-eval.md`.

---

## Signal Output

End every analysis with:
```
## Thesis Invalidation

After delivering the analysis signal, specify what would reverse it:

**If signal is BULLISH — thesis breaks if:**
- Price closes below the MA200 / key support level identified in this analysis on above-average volume
- revenue growth decelerates below 5% for 2 consecutive quarters AND gross margin contracts >200bps
- Macro regime shift: Fed pivots hawkish unexpectedly, recession probability >60%

**If signal is BEARISH — thesis breaks if:**
- Price closes above key resistance / MA200 level with volume confirmation
- revenue reaccelerates >15% AND margin expansion resumes
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

**Disclaimer:** Educational analysis only. Not financial advice.
