# InvestSkill — Gemini CLI Setup & Usage Guide

This project contains professional investment analysis prompt frameworks for US stock markets. When you run Gemini CLI in this directory, all 18 analysis frameworks are automatically available.

## Installation & Setup

### Quick Start

```bash
# Navigate to the InvestSkill directory
cd /path/to/InvestSkill

# Start Gemini CLI (loads GEMINI.md automatically)
gemini
```

**That's it!** Gemini CLI automatically loads `GEMINI.md` and gives you access to all 18 analysis frameworks in the `prompts/` directory.

### Verify Setup

When you first run `gemini`, you should see context about InvestSkill loaded. Then in the chat:

```
> @prompts/stock-valuation.md AAPL

# This should invoke the stock valuation framework
```

---

## Available Analysis Prompts (18 Total)

### Core Stock Analysis (6 skills)

| Analysis Type               | Prompt File                            | Usage Example                              |
|-----------------------------|----------------------------------------|--------------------------------------------|
| Stock Evaluation            | `@prompts/stock-eval.md`               | `Evaluate AAPL using this framework`      |
| Stock Valuation (DCF+)      | `@prompts/stock-valuation.md`          | `Analyze MSFT using all valuation methods` |
| Fundamental Analysis        | `@prompts/fundamental-analysis.md`     | `Deep dive on NVDA fundamentals`           |
| Technical Analysis          | `@prompts/technical-analysis.md`       | `Analyze TSLA chart patterns`              |
| DCF Valuation               | `@prompts/dcf-valuation.md`            | `Build DCF model for GOOGL`                |
| Economics Analysis          | `@prompts/economics-analysis.md`       | `What's the current economic outlook?`     |

### Financial Report Analysis (2 skills)

| Analysis Type               | Prompt File                            | Usage Example                              |
|-----------------------------|----------------------------------------|--------------------------------------------|
| Financial Report Analyst    | `@prompts/financial-report-analyst.md` | `[paste 10-K] Analyze this filing`        |
| Earnings Call Analysis      | `@prompts/earnings-call-analysis.md`   | `[paste transcript] Analyze sentiment`     |

### Market Monitoring (4 skills)

| Analysis Type               | Prompt File                            | Usage Example                              |
|-----------------------------|----------------------------------------|--------------------------------------------|
| Insider Trading             | `@prompts/insider-trading.md`          | `Track insider activity in TSLA`           |
| Institutional Ownership     | `@prompts/institutional-ownership.md`  | `Monitor smart money in META`              |
| Dividend Analysis           | `@prompts/dividend-analysis.md`        | `Is JNJ dividend safe?`                    |
| Short Interest              | `@prompts/short-interest.md`           | `What's the squeeze potential in GME?`     |

### Advanced Analysis (4 skills)

| Analysis Type               | Prompt File                            | Usage Example                              |
|-----------------------------|----------------------------------------|--------------------------------------------|
| Competitor Analysis         | `@prompts/competitor-analysis.md`      | `Analyze AAPL's competitive moat`          |
| Options Analysis            | `@prompts/options-analysis.md`         | `Find earnings play setups in NVDA`        |
| Portfolio Review            | `@prompts/portfolio-review.md`         | `[paste holdings] Review my allocation`    |
| Sector Analysis             | `@prompts/sector-analysis.md`          | `What sectors should rotate into?`         |

### Full Research Bundle (2 skills)

| Analysis Type               | Prompt File                            | Usage Example                              |
|-----------------------------|----------------------------------------|--------------------------------------------|
| Research Bundle             | `@prompts/research-bundle.md`          | `Complete analysis on AAPL`                |
| (All 18 skills combined)    | (chains multiple analyses)             | `Full thesis with all frameworks`          |

---

## Usage Examples

### Basic Single Analysis

```
# Stock evaluation
> @prompts/stock-eval.md Evaluate Apple with Piotroski scoring

# Fundamental analysis
> @prompts/fundamental-analysis.md Deep analysis of Microsoft's financials

# Technical analysis
> @prompts/technical-analysis.md What are the key chart levels for Tesla?

# Economics
> @prompts/economics-analysis.md Is a recession likely in the next 12 months?
```

### Financial Data & Filings

```
# Paste and analyze a 10-K
> @prompts/financial-report-analyst.md
[paste 10-K text here]
Extract key accounting red flags and management quality indicators

# Analyze earnings call transcript
> @prompts/earnings-call-analysis.md
[paste earnings call transcript]
What's the management tone and guidance outlook?

# Upload or paste financial statements
> @prompts/fundamental-analysis.md
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

# Options strategy selection
> @prompts/options-analysis.md Find bullish option setups for AAPL earnings

# Competitive advantage
> @prompts/competitor-analysis.md Does Microsoft have a defensible moat in cloud?

# Insider trading signals
> @prompts/insider-trading.md What are insiders buying at TSLA?

# Smart money tracking
> @prompts/institutional-ownership.md Which institutional investors are buying tech stocks?
```

### Full Research Bundle (Most Complete)

```
# Single command for comprehensive analysis
> @prompts/research-bundle.md Provide complete analysis on Apple (AAPL)

# Quick version (key metrics only)
> @prompts/research-bundle.md Quick analysis of Microsoft

# Comparison mode (multiple stocks)
> @prompts/research-bundle.md Compare AAPL, MSFT, and GOOGL
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
> @prompts/fundamental-analysis.md
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
> @prompts/dcf-valuation.md
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
├── prompts/                    # 18 universal analysis frameworks
│   ├── stock-eval.md
│   ├── stock-valuation.md
│   ├── fundamental-analysis.md
│   ├── technical-analysis.md
│   ├── dcf-valuation.md
│   ├── economics-analysis.md
│   ├── financial-report-analyst.md
│   ├── earnings-call-analysis.md
│   ├── insider-trading.md
│   ├── institutional-ownership.md
│   ├── competitor-analysis.md
│   ├── dividend-analysis.md
│   ├── short-interest.md
│   ├── options-analysis.md
│   ├── portfolio-review.md
│   ├── sector-analysis.md
│   └── research-bundle.md
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
- **prompts/** directory — All 18 analysis frameworks
- **plugins/** — Claude Code plugin configuration (if using Claude Code)
- **GitHub Issues** — Report bugs or suggest improvements

---

## Disclaimer

All analyses are for educational purposes only and do **not** constitute financial advice. Always consult a qualified financial advisor before making investment decisions. Past performance does not guarantee future results.
