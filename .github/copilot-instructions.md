# InvestSkill — GitHub Copilot Setup & Usage Guide

This repository contains 18 professional investment analysis frameworks for US stock markets. When working in this workspace, Copilot automatically loads these analysis methodologies to provide institutional-quality investment analysis.

## Installation & Setup

### Automatic Setup

GitHub Copilot automatically loads this file when you work in the InvestSkill repository. **No manual installation required.**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yennanliu/InvestSkill.git
   cd InvestSkill
   ```

2. **Open in your editor:**
   - **VS Code**: `code .`
   - **JetBrains IDE** (IntelliJ, PyCharm, etc.): Open the folder
   - **GitHub.com Web Editor**: Click `.` key in any GitHub repo view

3. **Open Copilot Chat** (usually `Ctrl+K` or `Cmd+K`)
   - Copilot automatically loads `copilot-instructions.md`
   - You now have access to all 18 analysis frameworks

### Verify Setup

In Copilot Chat, try:
```
Use the stock-valuation framework to analyze Apple (AAPL)
```

If Copilot references the frameworks, setup is complete!

---

## Available Analysis Frameworks (18 Total)

### Core Stock Analysis (6 frameworks)

| Framework | File | Best For |
|-----------|------|----------|
| Stock Evaluation | `prompts/stock-eval.md` | Comprehensive stock quality scoring |
| Stock Valuation | `prompts/stock-valuation.md` | Multi-method valuation (DCF + comps + EV) |
| Fundamental Analysis | `prompts/fundamental-analysis.md` | Deep financial statement dive |
| Technical Analysis | `prompts/technical-analysis.md` | Chart patterns and indicators |
| DCF Valuation | `prompts/dcf-valuation.md` | Intrinsic value modeling |
| Economics Analysis | `prompts/economics-analysis.md` | Macro outlook and recession risk |

### Financial Report Analysis (2 frameworks)

| Framework | File | Best For |
|-----------|------|----------|
| Financial Report Analyst | `prompts/financial-report-analyst.md` | 10-K/10-Q analysis |
| Earnings Call Analysis | `prompts/earnings-call-analysis.md` | Management tone and guidance |

### Market Monitoring (4 frameworks)

| Framework | File | Best For |
|-----------|------|----------|
| Insider Trading | `prompts/insider-trading.md` | Form 4 insider activity tracking |
| Institutional Ownership | `prompts/institutional-ownership.md` | 13F smart money moves |
| Dividend Analysis | `prompts/dividend-analysis.md` | Dividend safety and sustainability |
| Short Interest | `prompts/short-interest.md` | Squeeze potential and bearish thesis |

### Advanced Analysis (4 frameworks)

| Framework | File | Best For |
|-----------|------|----------|
| Competitor Analysis | `prompts/competitor-analysis.md` | Moat and competitive positioning |
| Options Analysis | `prompts/options-analysis.md` | Greeks, strategy selection, earnings plays |
| Portfolio Review | `prompts/portfolio-review.md` | Allocation optimization |
| Sector Analysis | `prompts/sector-analysis.md` | Sector rotation opportunities |

### Full Research Bundle (2 frameworks)

| Framework | File | Best For |
|-----------|------|----------|
| Research Bundle | `prompts/research-bundle.md` | Comprehensive multi-framework analysis |
| (Combined) | (all frameworks) | Complete investment thesis |

---

## Usage Examples

### Natural Language Queries

Copilot understands the frameworks context naturally:

```
# Evaluate a stock
Perform a stock evaluation of Microsoft using the Piotroski F-Score methodology

# Valuation analysis
What's a fair valuation for Apple using DCF, comparable companies, and EV multiples?

# Financial statement analysis
Deep dive into Tesla's balance sheet and cash flow quality

# Market context
What's the current economic outlook? Is recession likely?

# Technical setup
What are the key technical levels for NVDA?

# Combined analysis
Analyze Nvidia from both fundamental and technical perspectives
```

### Explicit Framework References

Reference specific prompt files for precise methodology:

```
# Stock valuation with all methods
Use the framework in prompts/stock-valuation.md to analyze AAPL

# Fundamental deep dive
Apply prompts/fundamental-analysis.md to Microsoft's financials

# Technical analysis
Reference prompts/technical-analysis.md for Tesla chart patterns

# Financial report analysis
Use prompts/financial-report-analyst.md to analyze this 10-K filing: [paste text]

# Earnings transcript analysis
Apply prompts/earnings-call-analysis.md to this earnings call: [paste transcript]
```

### With Financial Data

```
# Paste financial statements
Use the fundamental-analysis framework to analyze these financial statements:
[paste balance sheet, income statement, cash flow]

# Paste SEC filings
Use the financial-report-analyst framework on this 10-Q:
[paste 10-Q text]

# Paste earnings transcript
Analyze this earnings call with the earnings-call-analysis framework:
[paste earnings call transcript]

# Paste portfolio holdings
Review my portfolio allocation using the portfolio-review framework:
AAPL: 30%
MSFT: 25%
NVDA: 20%
JNJ: 15%
TSLA: 10%
```

### Stock Comparison

```
# Compare two stocks
Compare AAPL and MSFT using the stock-valuation framework

# Multiple stocks in one analysis
Analyze AAPL, MSFT, and GOOGL using the research-bundle framework

# Sector comparison
Compare valuations across tech stocks (AAPL, MSFT, NVDA, GOOGL, META)
```

### Specialized Analysis

```
# Dividend safety
Is the JNJ dividend safe? Use the dividend-analysis framework

# Short squeeze
What's the short squeeze potential in GME? Use the short-interest framework

# Options strategy
Find bullish option strategies for AAPL earnings using the options-analysis framework

# Competitive advantage
Does Apple have a defensible moat? Use the competitor-analysis framework

# Insider buying signals
What are insiders buying at Tesla? Use the insider-trading framework

# Smart money tracking
Which institutions are rotating into tech? Use the institutional-ownership framework

# Sector opportunities
Which sectors should I rotate into? Use the sector-analysis framework
```

### Full Research Report

```
# Comprehensive analysis (all frameworks combined)
Provide a complete investment analysis on Apple using the research-bundle framework

# Quick version
Quick analysis on Microsoft using the research-bundle framework

# Multi-stock comparison
Compare AAPL, MSFT, and GOOGL comprehensively using the research-bundle framework
```

### Follow-Up Questions

Copilot remembers the analysis context:

```
# Initial analysis
Perform a DCF valuation of MSFT using the dcf-valuation framework

# Follow-ups work naturally:
What if revenue growth slows to 8%?
How sensitive is the valuation to WACC assumptions?
What's the downside scenario?
What's the margin of safety at current price?
```

---

## Output Format & Standards

Every analysis in this workspace follows this structure:

### 1. Executive Summary
- Clear investment thesis
- Key bullish/bearish drivers
- Time horizon

### 2. Quantitative Analysis
- Specific numbers (not estimates)
- Year-over-year or period comparisons
- Industry/peer benchmarking
- Valuation multiples

### 3. Qualitative Assessment
- Management quality and capital allocation
- Competitive position and economic moat
- Market opportunity and growth drivers
- Risk factors and thesis invalidators

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

### 1. Be Specific with Requests
```
# Vague
Analyze Apple

# Better
Use the stock-valuation framework to analyze Apple (AAPL), assuming 10% revenue growth and 8.5% WACC

# Best
Use prompts/stock-valuation.md to value AAPL with:
- DCF method: 5-year projection, 8.5% WACC, 2.5% terminal growth
- Comparable company multiples (vs MSFT, GOOGL, META)
- EV/EBITDA and P/E analysis
```

### 2. Provide Context Data
```
# More useful to Copilot
Analyze MSFT using fundamental-analysis with:
- Current market price: $450
- Market cap: $3.3T
- Recent P/E ratio: 42x
- Industry average P/E: 28x
```

### 3. Chain Multiple Analyses
```
# Comprehensive approach
1. First: Use stock-eval.md to evaluate NVDA quality
2. Then: Use technical-analysis.md for chart patterns
3. Finally: Use institutional-ownership.md for smart money positioning
```

### 4. Ask Clarifying Questions
```
# After initial analysis, ask:
What would change this from BULLISH to NEUTRAL?
What's the most important assumption in this valuation?
How does this compare to sector peers?
What's the probability of hitting your base case?
```

### 5. Request Alternative Scenarios
```
# Scenario analysis
What's the valuation in the:
1. Bull case: 15% revenue growth
2. Base case: 10% revenue growth
3. Bear case: 5% revenue growth
```

---

## File Structure

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
├── .github/copilot-instructions.md  # This file (auto-loaded)
├── README.md
└── CHANGELOG.md
```

---

## Troubleshooting

### Issue: Copilot not using frameworks

```
# Make sure you're in the InvestSkill repository
# Open Copilot Chat again (Cmd+K or Ctrl+K)
# Try referencing the framework explicitly:

Use the framework in prompts/stock-valuation.md to analyze AAPL
```

### Issue: Need more detailed output

```
# Ask Copilot for more depth:
Analyze AAPL using prompts/fundamental-analysis.md with:
- Detailed balance sheet analysis
- Cash flow quality assessment
- Working capital trends
- Debt maturity schedule
```

### Issue: Want different format

```
# Ask for specific output:
Use the stock-eval framework for MSFT, but format as:
1. Key metrics (table)
2. Quality score with reasoning
3. Bull/bear case bullet points
4. Investment signal
```

---

## Project Overview

- **18 Institutional-Quality Frameworks** — all tested and validated
- **Works with Copilot Chat** — integrated into VS Code and JetBrains IDEs
- **Universal Prompts** — also work with Gemini CLI, Cursor, and any AI tool
- **Educational Focus** — for learning institutional analysis methods
- **Always Updated** — maintained at github.com/yennanliu/InvestSkill

---

## Additional Resources

- **README.md** — Complete setup guide for all platforms (Claude Code, Gemini, Cursor)
- **prompts/** — All 18 analysis framework files
- **plugins/** — Claude Code plugin integration (optional)
- **GitHub Issues** — Report problems or request features

---

## Disclaimer

These analysis frameworks are for **educational purposes only** and do **not** constitute financial advice. Always consult a qualified financial advisor before making investment decisions. Past performance does not guarantee future results.
