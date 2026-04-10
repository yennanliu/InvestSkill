# InvestSkill for Gemini CLI

Professional investment analysis prompts for Gemini CLI. 18 universal frameworks for comprehensive stock market evaluation.

**For multi-platform setup**, see [README.md](README.md)

---

## Quick Start

### Installation

Gemini CLI automatically loads `GEMINI.md` when you run it in the project directory.

```bash
# Navigate to InvestSkill
cd /path/to/InvestSkill

# Start Gemini CLI
gemini

# GEMINI.md auto-loaded!
```

### First Analysis

In Gemini CLI:

```
> @prompts/stock-eval.md Evaluate Apple (AAPL)
```

Or reference directly:

```
> @prompts/stock-valuation.md What's a fair valuation for Microsoft?
```

---

## All 18 Frameworks

### Core Analysis (6)
```
@prompts/stock-eval.md                  # Stock evaluation with quality scoring
@prompts/stock-valuation.md             # Multi-method valuation (DCF + comps + EV)
@prompts/fundamental-analysis.md        # Financial statement analysis
@prompts/technical-analysis.md          # Chart patterns and indicators
@prompts/dcf-valuation.md              # DCF intrinsic value model
@prompts/economics-analysis.md          # Macro indicators and recession risk
```

### Financial Reports (2)
```
@prompts/financial-report-analyst.md    # 10-K, 10-Q, annual report analysis
@prompts/earnings-call-analysis.md      # Earnings call sentiment and themes
```

### Market Monitoring (4)
```
@prompts/insider-trading.md             # SEC Form 4 insider activity
@prompts/institutional-ownership.md     # 13F institutional holdings tracking
@prompts/dividend-analysis.md           # Dividend safety and yield analysis
@prompts/short-interest.md              # Short squeeze potential
```

### Advanced Analysis (4)
```
@prompts/competitor-analysis.md         # Economic moat and Porter's Five Forces
@prompts/options-analysis.md            # Options strategy selection
@prompts/portfolio-review.md            # Portfolio allocation and optimization
@prompts/sector-analysis.md             # Sector rotation opportunities
```

### Comprehensive Research (2)
```
@prompts/research-bundle.md             # All frameworks combined
```

---

## Usage Examples

### Basic Stock Analysis

```
# Stock evaluation
> @prompts/stock-eval.md Evaluate Apple (AAPL) using Piotroski F-Score

# Valuation analysis
> @prompts/stock-valuation.md What's a fair valuation for Microsoft?

# Fundamental deep dive
> @prompts/fundamental-analysis.md Deep analysis of NVIDIA's financials

# Technical setup
> @prompts/technical-analysis.md What are Tesla's key technical levels?

# Economic context
> @prompts/economics-analysis.md Is a recession likely in the next 12 months?
```

### Financial Data Analysis

**Analyze 10-K filing:**
```
> @prompts/financial-report-analyst.md
[paste 10-K text here]

Extract key accounting red flags and management quality indicators
```

**Analyze earnings transcript:**
```
> @prompts/earnings-call-analysis.md
[paste earnings call transcript]

What's the management tone and guidance outlook?
```

**Review portfolio:**
```
> @prompts/portfolio-review.md
AAPL: 30%
MSFT: 25%
NVDA: 20%
JNJ: 15%
TSLA: 10%

Is my allocation optimal?
```

### Stock Comparison

```
# Compare valuations
> @prompts/stock-valuation.md Compare AAPL vs MSFT valuations

# Compare fundamentals
> @prompts/fundamental-analysis.md Compare AAPL and MSFT balance sheets

# Multi-stock research
> @prompts/research-bundle.md Provide comprehensive analysis and comparison:
- AAPL
- MSFT
- GOOGL
```

### Specialized Analysis

```
# Dividend safety
> @prompts/dividend-analysis.md Is the JNJ dividend safe?

# Short squeeze
> @prompts/short-interest.md What's the short squeeze potential in GME?

# Options strategy
> @prompts/options-analysis.md Find bullish option strategies for AAPL earnings

# Competitive moat
> @prompts/competitor-analysis.md Does Apple have a defensible moat?

# Insider activity
> @prompts/insider-trading.md What are insiders buying at Tesla?

# Smart money tracking
> @prompts/institutional-ownership.md Which institutions are rotating into tech?

# Sector opportunities
> @prompts/sector-analysis.md Which sectors should I rotate into?
```

### Full Research Bundle

```
# Complete analysis (all frameworks)
> @prompts/research-bundle.md Provide complete analysis on Apple (AAPL)

# Quick version
> @prompts/research-bundle.md Quick analysis of Microsoft (MSFT)

# Multi-stock comparison
> @prompts/research-bundle.md Compare AAPL, MSFT, and GOOGL comprehensively
```

---

## Features

✅ **18 Professional Analysis Frameworks**
- Universal prompts (AI-agnostic)
- No Gemini-specific syntax needed
- Works with any AI model via Gemini CLI

✅ **File Reference Support**
- Use `@prompts/<name>.md` syntax
- Auto-loads from project directory
- Supports all 18 analysis types

✅ **Financial Data Integration**
- Paste SEC filings (10-K, 10-Q)
- Paste earnings transcripts
- Paste financial statements
- Reference documents inline

✅ **Session Memory**
- Gemini CLI remembers conversation context
- Ask follow-up questions naturally
- Multi-turn analysis chains

✅ **Model Agnostic**
- Works with all Gemini models
- Works with any Claude model
- Works with any AI accessible via Gemini CLI

---

## Installation & Troubleshooting

### Verify Installation

Check Gemini CLI is installed:
```bash
gemini --version
```

Check InvestSkill is accessible:
```bash
ls GEMINI.md     # Should exist
ls prompts/      # Should have 18 files
```

### Common Issues

**Prompts not found:**
```bash
# Make sure you're in InvestSkill directory
pwd  # Should end with InvestSkill

# Verify prompts/ directory
ls prompts/ | wc -l  # Should show 17 (report-generator excluded)

# Start fresh
gemini
```

**@prompts/ references not working:**
```bash
# Verify file path
ls prompts/stock-valuation.md  # Should exist

# Check GEMINI.md exists
ls GEMINI.md

# Restart Gemini
gemini
```

**Gemini CLI not installed:**
```bash
# Install via npm
npm install -g @google/gemini-cli

# Or check official docs
# https://gemini.ai
```

---

## Advanced Usage

### Multi-Framework Analysis

Run multiple analyses in sequence:

```
> @prompts/stock-eval.md for NVDA

> @prompts/technical-analysis.md for NVDA  

> @prompts/institutional-ownership.md for NVDA

Synthesize findings into consolidated investment view
```

### Scenario Analysis

Ask follow-up questions within conversation:

```
> @prompts/dcf-valuation.md Build a DCF model for Microsoft

Follow-up questions (in same session):
> What if revenue growth slows to 8%?
> How sensitive is valuation to WACC?
> What's the downside case?
> What's the bull/bear range?
```

### Custom Analysis Chains

Build complete due diligence workflow:

```
> @prompts/stock-eval.md Quality evaluation for AAPL

> @prompts/fundamental-analysis.md Financial analysis for AAPL

> @prompts/technical-analysis.md Technical setup for AAPL

> @prompts/stock-valuation.md Valuation for AAPL

> @prompts/competitor-analysis.md Competitive moat for AAPL

Provide integrated investment thesis
```

### Batch Analysis

Analyze multiple companies:

```
> @prompts/research-bundle.md Analyze and compare:
AAPL
MSFT
GOOGL
NVDA

Focus on valuation and competitive positioning
```

---

## Output Format

All analyses include:

### 1. Executive Summary
- Key findings and thesis
- Primary drivers (bullish/bearish)
- Time horizon

### 2. Quantitative Analysis
- Specific metrics and numbers
- Year-over-year comparisons
- Industry benchmarking
- Valuation multiples

### 3. Qualitative Assessment
- Management quality
- Competitive positioning
- Market opportunity
- Risk factors

### 4. Investment Signal Block
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

## Tips & Best Practices

### 1. Use File References
```
# Most reliable
> @prompts/stock-valuation.md Analyze AAPL

# Also works (natural language)
> What's the valuation for Apple?
```

### 2. Provide Context Data
```
> @prompts/dcf-valuation.md
Analyze MSFT assuming:
- Revenue growth: 10% CAGR
- WACC: 8.5%
- Terminal growth: 2.5%
- Current price: $450/share
```

### 3. Paste Financial Data
```
> @prompts/fundamental-analysis.md
[paste balance sheet and income statement]

Analyze financial quality and trends
```

### 4. Chain Multiple Analyses
```
# Start first analysis
> @prompts/stock-eval.md Evaluate NVDA quality

# Add follow-up
> Then @prompts/technical-analysis.md for NVDA chart patterns

# Add more
> Also @prompts/institutional-ownership.md for smart money positioning
```

### 5. Ask Follow-Up Questions
Gemini CLI remembers conversation context:

```
> @prompts/stock-valuation.md Value Microsoft

> What if cloud revenue growth slows?
> How sensitive is valuation to margin assumptions?
> What's the downside scenario?
```

---

## CLI Tips

### Navigation
```bash
# See available prompts
ls prompts/

# View a specific prompt
cat prompts/stock-valuation.md

# Check line count
wc -l prompts/*.md
```

### Piping to Other Tools
```bash
# Save analysis to file
# In Gemini: > @prompts/stock-eval.md AAPL
# Then: copy output to file.txt

# Search output
# grep "BULLISH" output.txt
```

---

## Documentation

### Gemini Specific
- This file (README-gemini.md)
- [GEMINI.md](GEMINI.md) — Project instructions

### All Platforms
- [README.md](README.md) — Complete setup for all 5 platforms
- [PLATFORM-COMPATIBILITY.md](PLATFORM-COMPATIBILITY.md) — Feature comparison
- [CI-CD-GUIDE.md](CI-CD-GUIDE.md) — Release automation

### Examples & Learning
- [COOKBOOK.md](COOKBOOK.md) — Walkthroughs and examples
- [CHANGELOG.md](CHANGELOG.md) — Feature updates
- `prompts/` — Individual framework files

---

## Support & Feedback

### Report Issues
- GitHub Issues: https://github.com/yennanliu/InvestSkill/issues
- GitHub Discussions: https://github.com/yennanliu/InvestSkill/discussions

### Feature Requests
Open an issue with:
- What analysis would help
- Your use case
- Example scenario

### Troubleshooting

**Gemini not responding:**
- Check internet connection
- Verify Gemini CLI is running
- Try simpler prompt first

**Prompts too long:**
- Use specific sections
- Break into multiple queries
- Check token limits

---

## Legal Disclaimer

This toolkit provides **educational analysis only** and does **NOT constitute financial advice**.

Always:
- ✅ Consult qualified financial advisors
- ✅ Do your own research (DYOR)
- ✅ Verify analysis independently
- ✅ Consider your risk tolerance

Past performance does not guarantee future results.

---

## More Information

For complete documentation covering all platforms (Claude Code, Cursor, Copilot, Universal), see:

📖 **[README.md](README.md)**
