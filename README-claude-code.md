# InvestSkill for Claude Code

Professional investment analysis plugin for Claude Code. 18 analysis frameworks for comprehensive stock market evaluation.

**For multi-platform setup**, see [README.md](README.md)

---

## Quick Start

### Installation

```bash
# Open Claude Code
claude

# Add marketplace
/plugin marketplace add yennanliu/InvestSkill

# Install plugin
/plugin install us-stock-analysis

# Verify installation
/plugin list
```

### First Analysis

```bash
# Evaluate a stock
/us-stock-analysis:stock-eval AAPL

# Get valuation
/us-stock-analysis:stock-valuation MSFT

# Full analysis
/us-stock-analysis:research-bundle GOOGL
```

---

## All 18 Skills

### Core Analysis (6)
```bash
/us-stock-analysis:stock-eval AAPL              # Piotroski F-Score, quality metrics
/us-stock-analysis:fundamental-analysis MSFT   # Financial statement analysis
/us-stock-analysis:technical-analysis TSLA     # Chart patterns, indicators
/us-stock-analysis:economics-analysis           # Macro indicators
/us-stock-analysis:dcf-valuation GOOGL         # Intrinsic value model
/us-stock-analysis:stock-valuation NVDA       # DCF + comps + EV multiples
```

### Financial Reports (2)
```bash
/us-stock-analysis:financial-report-analyst AAPL 10-K    # 10-K/10-Q analysis
/us-stock-analysis:earnings-call-analysis AAPL           # Earnings transcript analysis
```

### Market Monitoring (4)
```bash
/us-stock-analysis:insider-trading TSLA                   # Form 4 insider activity
/us-stock-analysis:institutional-ownership META          # 13F institutional tracking
/us-stock-analysis:dividend-analysis JNJ                 # Dividend safety
/us-stock-analysis:short-interest GME                    # Short squeeze potential
```

### Advanced Analysis (4)
```bash
/us-stock-analysis:competitor-analysis AAPL              # Economic moat analysis
/us-stock-analysis:options-analysis AAPL                 # Options strategy selection
/us-stock-analysis:portfolio-review                      # Portfolio optimization
/us-stock-analysis:sector-analysis                       # Sector rotation
```

### Comprehensive Research (2)
```bash
/us-stock-analysis:research-bundle AAPL                  # All frameworks combined
/us-stock-analysis:report-generator                      # HTML/PDF reports
```

---

## Usage Examples

### Basic Stock Analysis
```bash
# Quick evaluation
/us-stock-analysis:stock-eval AAPL

# Detailed fundamentals
/us-stock-analysis:fundamental-analysis MSFT --visual

# Technical chart analysis
/us-stock-analysis:technical-analysis TSLA --chart

# Valuation analysis
/us-stock-analysis:stock-valuation NVDA
```

### Financial Data Analysis
```bash
# Analyze 10-K filing (paste or paste text)
/us-stock-analysis:financial-report-analyst AAPL 10-K

# Analyze earnings call transcript
/us-stock-analysis:earnings-call-analysis AAPL
# [paste transcript text]

# Review portfolio
/us-stock-analysis:portfolio-review
# [paste your holdings]
```

### Advanced Analysis
```bash
# DCF valuation with scenarios
/us-stock-analysis:dcf-valuation MSFT --scenarios

# Insider trading analysis
/us-stock-analysis:insider-trading TSLA

# Dividend safety
/us-stock-analysis:dividend-analysis JNJ

# Short squeeze potential
/us-stock-analysis:short-interest GME

# Competitive moat
/us-stock-analysis:competitor-analysis AAPL
```

### Comprehensive Research
```bash
# Full multi-framework analysis
/us-stock-analysis:research-bundle AAPL

# Quick version
/us-stock-analysis:research-bundle MSFT --quick

# Compare multiple stocks
/us-stock-analysis:research-bundle AAPL,MSFT,GOOGL --compare
```

### Report Generation
```bash
# Step 1: Generate analysis with visualization
/us-stock-analysis:fundamental-analysis AAPL --visual

# Step 2: Generate HTML report
/us-stock-analysis:report-generator

# Step 3: Export to PDF
# Open generated HTML → Print → Save as PDF
```

---

## Features

✅ **18 Professional Analysis Frameworks**
- Comprehensive stock evaluation
- Multi-method valuation (DCF, comparable companies, EV multiples)
- Deep fundamental analysis
- Technical chart pattern recognition
- Economic context analysis
- Portfolio optimization

✅ **Financial Data Processing**
- 10-K/10-Q analysis
- Earnings call sentiment analysis
- Insider trading tracking
- Institutional ownership monitoring

✅ **Advanced Analysis**
- Dividend safety scoring
- Short squeeze potential
- Options strategy selection
- Competitive moat analysis
- Sector rotation analysis

✅ **Report Generation**
- HTML reports with charts
- PDF export (via browser print)
- Professional formatting
- Interactive visualizations

✅ **Standardized Output**
- All analyses include INVESTMENT SIGNAL block
- Confidence levels (HIGH/MEDIUM/LOW)
- Time horizon (SHORT/MEDIUM/LONG-TERM)
- Actionable recommendations (BUY/HOLD/SELL)

---

## Installation & Troubleshooting

### Installation Issues

**Plugin not appearing?**
```bash
# Refresh plugin list
/plugin list

# Try re-adding marketplace
/plugin marketplace remove yennanliu/InvestSkill
/plugin marketplace add yennanliu/InvestSkill
```

**Can't run skills?**
```bash
# Verify installation
/plugin list

# Should show: us-stock-analysis v1.4.0 (or latest)
```

### Data Requirements

Skills work best with:
- ✅ Stock ticker symbols (AAPL, MSFT, etc.)
- ✅ Current market data (fetched automatically)
- ✅ SEC filing data (10-K, 10-Q text)
- ✅ Earnings call transcripts
- ✅ Your portfolio holdings

### Output Quality

**For best results:**
1. Use valid stock tickers (check if publicly traded)
2. Provide recent financial data when pasting
3. Include full context for specialized analyses
4. Ask follow-up questions for deeper dives

---

## Advanced Usage

### Custom Parameters

Some skills support parameters:

```bash
# Fundamental analysis with visualization
/us-stock-analysis:fundamental-analysis AAPL --visual

# Technical analysis with chart generation
/us-stock-analysis:technical-analysis TSLA --chart

# DCF with scenario analysis
/us-stock-analysis:dcf-valuation MSFT --scenarios

# Research bundle quick version
/us-stock-analysis:research-bundle AAPL --quick
```

### Multi-Skill Workflows

**Complete due diligence:**
```bash
# 1. Stock quality evaluation
/us-stock-analysis:stock-eval AAPL

# 2. Fundamental analysis
/us-stock-analysis:fundamental-analysis AAPL --visual

# 3. Technical analysis
/us-stock-analysis:technical-analysis AAPL --chart

# 4. Valuation
/us-stock-analysis:stock-valuation AAPL

# 5. Competitive position
/us-stock-analysis:competitor-analysis AAPL

# 6. Generate report
/us-stock-analysis:report-generator
```

**Quick analysis:**
```bash
# Single command comprehensive analysis
/us-stock-analysis:research-bundle AAPL
```

### Batch Analysis

**Compare multiple stocks:**
```bash
# Research multiple stocks
/us-stock-analysis:research-bundle AAPL,MSFT,GOOGL --compare
```

**Portfolio analysis:**
```bash
# Review entire portfolio
/us-stock-analysis:portfolio-review
# AAPL: 30%
# MSFT: 25%
# NVDA: 20%
# JNJ: 15%
# TSLA: 10%
```

---

## Output Format

All analyses include:

### 1. Executive Summary
- Key findings
- Investment thesis
- Primary drivers (bullish/bearish)

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

## Model Support

Works with all Claude Code supported models:
- Claude Opus 4.6 (most capable)
- Claude Sonnet 4.6 (balanced)
- Claude Haiku 4.5 (fastest)

**Recommendation**: Use Sonnet 4.6 for best balance of quality and speed.

---

## Updates & Versions

**Current Version**: v1.4.0

Latest features:
- ✅ 18 professional analysis skills
- ✅ Multi-platform support
- ✅ Report generation
- ✅ Cross-AI compatibility

**Check for updates:**
```bash
/plugin marketplace view yennanliu/InvestSkill
```

---

## Documentation

### Claude Code Specific
- This file (README-claude-code.md)

### All Platforms
- [README.md](README.md) — Complete setup for all 5 platforms
- [PLATFORM-COMPATIBILITY.md](PLATFORM-COMPATIBILITY.md) — Feature matrix
- [CI-CD-GUIDE.md](CI-CD-GUIDE.md) — Release automation

### Other Resources
- [COOKBOOK.md](COOKBOOK.md) — Examples and walkthroughs
- [CHANGELOG.md](CHANGELOG.md) — What's new in each version
- [LICENSE](LICENSE) — MIT License

---

## Support & Feedback

### Report Issues
- GitHub Issues: https://github.com/yennanliu/InvestSkill/issues
- GitHub Discussions: https://github.com/yennanliu/InvestSkill/discussions

### Suggestions
We welcome feature requests! Open an issue with:
- What analysis would be helpful
- Why you need it
- Example use case

### Known Limitations
- Requires internet connection for market data
- Stock prices reflect last available market data
- Not real-time (use financial websites for live data)
- Educational analysis only (not financial advice)

---

## Legal Disclaimer

This plugin provides **educational analysis only** and does **NOT constitute financial advice**. 

Always:
- ✅ Consult qualified financial advisors
- ✅ Do your own research (DYOR)
- ✅ Verify analysis independently
- ✅ Consider your risk tolerance

Past performance does not guarantee future results.

---

## More Information

For complete documentation covering all platforms (Cursor, Gemini, Copilot, Universal), see:

📖 **[README.md](README.md)**
