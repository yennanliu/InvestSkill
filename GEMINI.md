# InvestSkill — Gemini CLI Setup & Usage Guide

This project contains professional investment analysis prompt frameworks for US stock markets. When you run Gemini CLI in this directory, all 34 analysis frameworks are automatically available.

## Installation & Setup

### Quick Start

```bash
# Navigate to the InvestSkill directory
cd /path/to/InvestSkill

# Start Gemini CLI (loads GEMINI.md automatically)
gemini
```

**That's it!** Gemini CLI automatically loads `GEMINI.md` and gives you access to all 34 analysis frameworks in the `prompts/` directory.

### Verify Setup

When you first run `gemini`, you should see context about InvestSkill loaded. Then in the chat:

```
> @prompts/stock-valuation.md AAPL

# This should invoke the stock valuation framework
```

---

## Available Analysis Prompts (34 frameworks + 3 aliases + 2 output tools)

### Core Stock Analysis (5 skills)

| Analysis Type               | Prompt File                            | Usage Example                              |
|-----------------------------|----------------------------------------|--------------------------------------------|
| Stock Evaluation            | `@prompts/stock-eval.md`               | `Evaluate AAPL using this framework`      |
| Stock Valuation (DCF+)      | `@prompts/stock-valuation.md`          | `Analyze MSFT using all valuation methods` |
| Technical Analysis          | `@prompts/technical-analysis.md`       | `Analyze TSLA chart patterns`              |
| Economics Analysis          | `@prompts/economics-analysis.md`       | `What's the current economic outlook?`     |
| Head-to-Head Compare | `@prompts/compare.md` | `Compare AMD vs NVDA vs AVGO` |

### Financial Report Analysis (5 skills)

| Analysis Type               | Prompt File                            | Usage Example                              |
|-----------------------------|----------------------------------------|--------------------------------------------|
| Financial Report Analyst    | `@prompts/financial-report-analyst.md` | `[paste 10-K] Analyze this filing`        |
| 10-K Report Digest          | `@prompts/10k-digest.md`               | `NVDA FY2024 --lang zh-TW` (EN or 繁中)   |
| Earnings Call Analysis      | `@prompts/earnings-call-analysis.md`   | `[paste transcript] Analyze sentiment`     |
| Forensic Accounting | `@prompts/forensic-accounting.md` | `Run a forensic accounting check on SMCI` |
| Credit Check | `@prompts/credit-check.md` | `Credit check on Carvana` |

### Market Monitoring (4 skills)

| Analysis Type               | Prompt File                            | Usage Example                              |
|-----------------------------|----------------------------------------|--------------------------------------------|
| Insider Trading             | `@prompts/insider-trading.md`          | `Track insider activity in TSLA`           |
| Institutional Ownership     | `@prompts/institutional-ownership.md`  | `Monitor smart money in META`              |
| Dividend Analysis           | `@prompts/dividend-analysis.md`        | `Is JNJ dividend safe?`                    |
| Short Interest              | `@prompts/short-interest.md`           | `What's the squeeze potential in GME?`     |

### Advanced Analysis (15 skills)

| Analysis Type               | Prompt File                            | Usage Example                              |
|-----------------------------|----------------------------------------|--------------------------------------------|
| Competitor Analysis         | `@prompts/competitor-analysis.md`      | `Analyze AAPL's competitive moat`          |
| Industry Map                | `@prompts/industry-map.md`             | `Map the AI compute supply chain`          |
| Options Analysis            | `@prompts/options-analysis.md`         | `Find earnings play setups in NVDA`        |
| Portfolio Review            | `@prompts/portfolio-review.md`         | `[paste holdings] Review my allocation`    |
| Sector Analysis             | `@prompts/sector-analysis.md`          | `What sectors should rotate into?`         |
| Stock Screener              | `@prompts/stock-screener.md`           | `Rank NVDA, AMD, AVGO across all factors`  |
| Catalyst Calendar           | `@prompts/catalyst-calendar.md`        | `What catalysts are coming for TSLA?`      |
| Bear Case                   | `@prompts/bear-case.md`                | `Build the bear case against TSLA`         |
| Position Ladder             | `@prompts/position-ladder.md`          | `I hold 20 AVGO at $128, now $122 — plan`  |
| Thesis Tracker | `@prompts/thesis-tracker.md` | `Open a thesis file for NVDA` |
| ETF Analysis | `@prompts/etf-analysis.md` | `Is VOO or SPYM the better core holding?` |
| Earnings Preview | `@prompts/earnings-preview.md` | `NVDA reports on Aug 27 — what is priced in?` |
| Tax Lens | `@prompts/tax-lens.md` | `I sold AVGO at a loss and want to rebuy — wash sale?` |
| Risk Stress Test | `@prompts/risk-stress-test.md` | `Stress-test this portfolio against 2008 and 2022` |
| Trade Post-Mortem | `@prompts/trade-postmortem.md` | `Post-mortem my closed NVDA trade` |

### Full Report (1 skills)

| Analysis Type               | Prompt File                            | Usage Example                              |
|-----------------------------|----------------------------------------|--------------------------------------------|
| Full Report (HTML)          | `@prompts/full-report.md`              | `Generate full interactive report for NVDA`|

### Meta-Analysis & Visualization (4 skills + 2 output tools)

| Analysis Type               | Prompt File                            | Usage Example                              |
|-----------------------------|----------------------------------------|--------------------------------------------|
| Result Validator            | `@prompts/result-validator.md`         | `[paste analysis] Score confidence`        |
| Chart Master                | `@prompts/chart-master.md`             | `[paste data] Generate revenue chart`      |
| Report Generator (output tool) | `@prompts/report-generator.md`         | `[paste analysis] Export as HTML report`   |
| Learning Coach | `@prompts/learning-coach.md` | `[paste a stock-eval output] Explain this to me` |
| Fact Check | `@prompts/fact-check.md` | `[paste a report] Verify every number and add sources` |
| Basket Report (output tool) | `@prompts/basket-report.md` | `Basket report on MU MRVL SNDL — why did they fall together?` |

### Aliases (3 redirects — installed, not counted as frameworks)

These stubs remain so old references keep working; each points at the framework that absorbed it.

| Analysis Type               | Prompt File                            | Redirects to                               |
|-----------------------------|----------------------------------------|--------------------------------------------|
| Fundamental Analysis        | `@prompts/fundamental-analysis.md`     | `@prompts/stock-eval.md`                   |
| DCF Valuation               | `@prompts/dcf-valuation.md`            | `@prompts/stock-valuation.md`              |
| Research Bundle             | `@prompts/research-bundle.md`          | `@prompts/full-report.md`                  |


---

## Usage Examples

### Verify a Report Before You Trust It

```text
# Claim-level fact-check with citations — paste the report and its sources
> @prompts/fact-check.md [paste the report + the 10-K excerpt / IR release] Verify every number and add sources

# Then score the reasoning
> @prompts/result-validator.md [paste the corrected report and the fact-check ledger] Score confidence
```

### Basic Single Analysis

```
# Stock evaluation
> @prompts/stock-eval.md Evaluate Apple with Piotroski scoring

# Fundamental analysis
> @prompts/stock-eval.md Deep analysis of Microsoft's financials

# Technical analysis
> @prompts/technical-analysis.md What are the key chart levels for Tesla?

# Economics
> @prompts/economics-analysis.md Is a recession likely in the next 12 months?
```

### Financial Data & Filings

```
# Paste and analyze a 10-K for investment signals
> @prompts/financial-report-analyst.md
[paste 10-K text here]
Extract key accounting red flags and management quality indicators

# Generate a structured 10-K digest document (English or Traditional Chinese)
> @prompts/10k-digest.md
AAPL FY2024 --lang zh-TW --output aapl-10k-digest.md

# Analyze earnings call transcript
> @prompts/earnings-call-analysis.md
[paste earnings call transcript]
What's the management tone and guidance outlook?

# Upload or paste financial statements
> @prompts/stock-eval.md
[paste balance sheet and income statement]
Analyze debt levels and cash flow quality
```

### Stock Comparison & Multiple Analyses

```
# Compare two stocks
> @prompts/stock-valuation.md Compare AAPL vs MSFT valuations

# Multiple frameworks on one stock
> I need:
> 1. @prompts/stock-eval.md for NVDA
> 2. @prompts/technical-analysis.md for NVDA
> 3. @prompts/institutional-ownership.md for NVDA

# Portfolio review
> @prompts/portfolio-review.md Here's my holdings:
AAPL: 30%
MSFT: 25%
NVDA: 20%
JNJ: 15%
TSLA: 10%
> Is my allocation optimal?
```

### Specialized Analysis

```
# Is this dividend safe?
> @prompts/dividend-analysis.md JNJ dividend analysis

# Short squeeze potential
> @prompts/short-interest.md Is GME a short squeeze candidate?

# Bear case / counterevidence
> @prompts/bear-case.md Argue why TSLA is a bad hold and give a downside target

# Position plan for an existing holding
> @prompts/position-ladder.md I hold 20 AVGO at $128, now $122 — build a 60–100 share ladder plan

# Options strategy selection
> @prompts/options-analysis.md Find bullish option setups for AAPL earnings

# Competitive advantage
> @prompts/competitor-analysis.md Does Microsoft have a defensible moat in cloud?

# Insider trading signals
> @prompts/insider-trading.md What are insiders buying at TSLA?

# Smart money tracking
> @prompts/institutional-ownership.md Which institutional investors are buying tech stocks?
```

### Export as Professional HTML Report

```
# After any analysis, export to a styled HTML/PDF report
> @prompts/report-generator.md
[paste analysis output]
Generate an HTML report for AAPL

# Specify report type
> @prompts/report-generator.md
[paste fundamental-analysis output]
Executive summary report, HTML format

# Full report → HTML report
> @prompts/full-report.md Complete analysis on NVDA
> @prompts/report-generator.md Convert the above into a professional HTML report
```

### Full Report (Most Complete)

```
# Single command for comprehensive analysis
> @prompts/full-report.md Provide complete analysis on Apple (AAPL)

# Quick version (key metrics only)
> @prompts/full-report.md Quick analysis of Microsoft

# Comparison mode (multiple stocks)
> @prompts/full-report.md Compare AAPL, MSFT, and GOOGL
```

---

## Output Format & Standards

Every analysis follows this output structure:

### 1. Executive Summary
- Key findings and investment thesis
- Primary bullish or bearish drivers

### 2. Quantitative Analysis
- Specific numbers and metrics
- Year-over-year or period comparisons
- Industry/peer benchmarking

### 3. Qualitative Assessment
- Management quality
- Competitive position
- Market opportunity

### 4. Standardized Signal Block

All analyses end with this format:

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

---

## Tips for Best Results

### 1. Use File References
```
# Good: explicit file reference
> @prompts/stock-valuation.md Analyze AAPL

# Also works: natural language (Gemini understands the context)
> What's a good valuation for Apple?
```

### 2. Paste Financial Data Directly
```
# Paste balance sheet, income statement, or SEC filings
> @prompts/stock-eval.md
[paste your financial statements]

# Gemini will extract and analyze the data
```

### 3. Combine Multiple Analyses
```
# Run multiple frameworks on the same stock
> First: @prompts/stock-eval.md for NVDA
> Then: @prompts/technical-analysis.md for NVDA
> Finally: @prompts/institutional-ownership.md for NVDA
```

### 4. Provide Context
```
# More specific = better results
> @prompts/stock-valuation.md
> Stock: MSFT
> Time horizon: 5 years
> Target market growth: 15% CAGR
> Assume WACC of 8.5%
```

### 5. Ask Follow-Up Questions
```
# Gemini remembers the conversation context
> @prompts/stock-valuation.md Value AAPL

# Then follow up:
> What if iPhone sales growth slows to 5%?
> How sensitive is the valuation to margin assumptions?
> What's the downside scenario?
```

---

## Project Structure

```
InvestSkill/
├── prompts/                    # 34 analysis frameworks (+ 3 aliases, 2 output tools)
│   ├── stock-eval.md
│   ├── stock-valuation.md
│   ├── fundamental-analysis.md
│   ├── technical-analysis.md
│   ├── dcf-valuation.md
│   ├── economics-analysis.md
│   ├── financial-report-analyst.md
│   ├── 10k-digest.md
│   ├── earnings-call-analysis.md
│   ├── insider-trading.md
│   ├── institutional-ownership.md
│   ├── competitor-analysis.md
│   ├── dividend-analysis.md
│   ├── short-interest.md
│   ├── options-analysis.md
│   ├── portfolio-review.md
│   ├── sector-analysis.md
│   ├── bear-case.md
│   ├── position-ladder.md
│   ├── research-bundle.md
│   ├── result-validator.md
│   ├── chart-master.md
│   ├── thesis-tracker.md
│   ├── etf-analysis.md
│   ├── earnings-preview.md
│   ├── tax-lens.md
│   ├── risk-stress-test.md
│   ├── learning-coach.md
│   ├── fact-check.md
│   ├── trade-postmortem.md
│   ├── forensic-accounting.md
│   ├── credit-check.md
│   ├── compare.md
│   ├── basket-report.md
│   └── report-generator.md     # HTML/PDF report design system
├── plugins/                    # Claude Code plugin (optional)
│   └── us-stock-analysis/
├── GEMINI.md                   # This file
├── README.md
└── CHANGELOG.md
```

---

## Troubleshooting

### Issue: Prompts not loading
```
# Make sure you're in the correct directory
pwd  # should be /path/to/InvestSkill

# Try starting Gemini again
gemini

# Reference the file with full path
@prompts/stock-valuation.md
```

### Issue: Need more detail
```
# Be specific with your request
@prompts/stock-valuation.md Analyze AAPL with:
- 3-year DCF projection
- Comparable company multiples
- Sensitivity analysis
```

### Issue: Want different output format
```
# Ask Gemini to reformat
@prompts/stock-valuation.md Analyze AAPL, then format as:
1. Executive summary (1 paragraph)
2. Key metrics (table)
3. Investment signal
```

---

## Additional Resources

- **README.md** — Complete project overview and all platforms
- **prompts/** directory — All 34 analysis frameworks
- **plugins/** — Claude Code plugin configuration (if using Claude Code)
- **GitHub Issues** — Report bugs or suggest improvements

---

## Disclaimer

All analyses are for educational purposes only and do **not** constitute financial advice. Always consult a qualified financial advisor before making investment decisions. Past performance does not guarantee future results.
