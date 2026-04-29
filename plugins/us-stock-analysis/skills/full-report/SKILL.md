---
description: Run all InvestSkill analysis modules on a stock and compile a single professional HTML report saved to the output/ directory
---

# Full Report — Comprehensive Stock Analysis

Orchestrate every InvestSkill analysis module on one ticker and produce a standalone, professional HTML report with interactive Chart.js visualizations.

## What This Skill Does

1. Runs all 15 analytical modules in sequence on the requested ticker
2. Collects findings into a unified data model
3. Renders a single self-contained HTML file with interactive charts
4. Saves to `output/<TICKER>_report_<YYYY-MM-DD>.html`

## Modules Executed (in order)

| # | Module | Focus |
|---|--------|-------|
| 1 | `stock-eval` | Company overview, competitive position |
| 2 | `fundamental-analysis` | Income statement, balance sheet, cash flow |
| 3 | `technical-analysis` | MA, RSI, MACD, volume, support/resistance |
| 4 | `dcf-valuation` | DCF intrinsic value, bear/base/bull scenarios |
| 5 | `stock-valuation` | P/E, P/S, EV/EBITDA, peer multiples |
| 6 | `competitor-analysis` | Moat, market share, Porter's Five Forces |
| 7 | `sector-analysis` | Sector rotation, relative strength |
| 8 | `economics-analysis` | Macro environment, rate sensitivity |
| 9 | `insider-trading` | SEC Form 4 patterns, net sentiment |
| 10 | `institutional-ownership` | 13F holdings, smart money flows |
| 11 | `earnings-call-analysis` | Management tone, guidance, key themes |
| 12 | `financial-report-analyst` | 10-K/10-Q deep dive, risk factors |
| 13 | `dividend-analysis` | Yield, payout ratio, sustainability |
| 14 | `short-interest` | Short ratio, squeeze risk, days-to-cover |
| 15 | `options-analysis` | IV, Put/Call ratio, max pain, strategies |

## HTML Report Structure

The output file is a standalone HTML document (no external dependencies except CDN Chart.js) with:

- **Cover page** — ticker, price, date, overall score, recommendation
- **Sidebar TOC** — sticky navigation linking to each section
- **16 analysis sections** — one per module plus a final synthesis
- **Interactive charts** — MA overlay, RSI, MACD, volume, histograms, radar
- **Signal block** — standardized investment signal at the end of each section
- **Final verdict** — weighted multi-factor scorecard + bull/bear summary

## Design Principles

- Clean, minimal design — white background, navy accents, Inter/system font
- Data-dense tables with clear visual hierarchy
- Color coding: green = bullish, amber = neutral, red = bearish
- Print-friendly (no fixed sidebars when printing)
- Self-contained: one `.html` file, no local assets

## Usage

```
/full-report AAPL
/full-report NVDA --lang zh-TW
/full-report TSLA --output ~/Desktop/
```

**Arguments:**
- `<TICKER>` — required, any US-listed stock
- `--lang` — output language, default `en`, supports `zh-TW`, `zh-CN`, `ja`
- `--output` — custom save path, default `output/`

## Output File Naming

```
output/<TICKER>_report_<YYYY-MM-DD>.html
```

Example: `output/AAPL_report_2025-04-29.html`

## Workflow

1. Gather all available data for `<TICKER>` (financials, price, filings, macro)
2. Run each module and collect key findings and scores
3. Compute weighted overall score (0–10)
4. Render complete HTML with all sections and charts
5. Write file to output path and confirm location

---

## Output Format

End with the standard signal block after the final synthesis section:

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
