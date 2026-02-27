# InvestSkill — Gemini CLI Instructions

This project contains professional investment analysis prompt frameworks for US stock markets. Use the prompts in the `prompts/` directory as detailed instructions for any analysis task.

## Available Analysis Prompts

Reference the corresponding file in `prompts/` when performing each type of analysis:

| Analysis Type               | Prompt File                                    | Usage                                      |
|-----------------------------|------------------------------------------------|--------------------------------------------|
| Stock Evaluation            | `prompts/stock-eval.md`                        | `@prompts/stock-eval.md AAPL`              |
| Financial Report Analysis   | `prompts/financial-report-analyst.md`          | `@prompts/financial-report-analyst.md`     |
| Stock Valuation (DCF+)      | `prompts/stock-valuation.md`                   | `@prompts/stock-valuation.md MSFT`         |
| Fundamental Analysis        | `prompts/fundamental-analysis.md`              | `@prompts/fundamental-analysis.md NVDA`    |
| Technical Analysis          | `prompts/technical-analysis.md`                | `@prompts/technical-analysis.md TSLA`      |
| DCF Valuation               | `prompts/dcf-valuation.md`                     | `@prompts/dcf-valuation.md GOOGL`          |
| Economics Analysis          | `prompts/economics-analysis.md`                | `@prompts/economics-analysis.md`           |
| Earnings Call Analysis      | `prompts/earnings-call-analysis.md`            | `@prompts/earnings-call-analysis.md AAPL`  |
| Insider Trading             | `prompts/insider-trading.md`                   | `@prompts/insider-trading.md TSLA`         |
| Institutional Ownership     | `prompts/institutional-ownership.md`           | `@prompts/institutional-ownership.md META` |
| Competitor Analysis         | `prompts/competitor-analysis.md`               | `@prompts/competitor-analysis.md AAPL`     |
| Dividend Analysis           | `prompts/dividend-analysis.md`                 | `@prompts/dividend-analysis.md JNJ`        |
| Short Interest              | `prompts/short-interest.md`                    | `@prompts/short-interest.md GME`           |
| Options Analysis            | `prompts/options-analysis.md`                  | `@prompts/options-analysis.md AAPL`        |
| Portfolio Review            | `prompts/portfolio-review.md`                  | `@prompts/portfolio-review.md`             |
| Sector Analysis             | `prompts/sector-analysis.md`                   | `@prompts/sector-analysis.md`              |
| Research Bundle             | `prompts/research-bundle.md`                   | `@prompts/research-bundle.md AAPL`         |

## Quick Start (Gemini CLI)

```bash
# Start Gemini CLI in this project directory
gemini

# Analyze a stock using a prompt file
> @prompts/stock-valuation.md Analyze AAPL using all valuation methods

# Analyze an uploaded financial report
> @prompts/financial-report-analyst.md [paste 10-K text here]

# Full research bundle
> @prompts/research-bundle.md Run a complete analysis on NVDA
```

## Analysis Standards

All analyses in this project follow these conventions:

1. **Signal Output**: Every analysis ends with a BULLISH / NEUTRAL / BEARISH signal block
2. **Confidence Level**: HIGH / MEDIUM / LOW based on data quality
3. **Time Horizon**: SHORT-TERM / MEDIUM-TERM / LONG-TERM
4. **Score**: 0.0–10.0 scale (8+ = Strongly Bullish, 4–6 = Neutral, <2 = Strongly Bearish)

## Disclaimer

All analyses are for educational purposes only and do not constitute financial advice. Always consult a qualified financial advisor before making investment decisions.
