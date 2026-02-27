# InvestSkill

Professional investment analysis and stock evaluation skills — works with Claude Code, Gemini CLI, GitHub Copilot, Cursor, and any AI assistant.

> 📖 [English](README.md) | **[繁體中文版 (Traditional Chinese)](https://yennj12.js.org/InvestSkill/zh-tw.html)**

[![Deploy](https://github.com/yennanliu/InvestSkill/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/yennanliu/InvestSkill/actions/workflows/deploy-pages.yml)
[![Validate](https://github.com/yennanliu/InvestSkill/actions/workflows/validate.yml/badge.svg)](https://github.com/yennanliu/InvestSkill/actions/workflows/validate.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Website](https://img.shields.io/badge/website-live-success)](https://yennanliu.github.io/InvestSkill/)

📚 **[View Documentation Website](https://yennanliu.github.io/InvestSkill/)**

## Quick Links

- 📖 **[Cookbook — Demo Examples, Setup & Core Concepts](https://yennanliu.github.io/InvestSkill/cookbook.html)**
- 📝 **[Blog Post: InvestSkill - Claude Code Financial Analysis Plugin](https://yennj12.js.org/yennj12_blog_V4/posts/investskill-claude-code-financial-analysis-plugin/)**
- 📊 **[Example Output: Comprehensive Analysis Report (PLTR)](https://github.com/yennanliu/finance_data/blob/main/claude_code/pltr/comprehensive_analysis_report.md)**
- 📊 **[More Output: Finance data](https://github.com/yennanliu/finance_data/tree/main/claude_code)**

- 
## Install

```bash

claude

# add to marketplace
/plugin marketplace add yennanliu/InvestSkill


# install
/plugin install us-stock-analysis


# check installed list

/plugin list

# test
- /us-stock-analysis:fundamental-analysis AAPL # - For fundamental analysis
- /us-stock-analysis:technical-analysis AAPL # - For technical analysis
- /us-stock-analysis:economics-analysis # - For economic context
```


- Local dev

```bash

claude

# Add local marketplace
/plugin marketplace add /Users/yennanliu/InvestSkill

# Install plugin
/plugin install us-stock-analysis@invest-skill
```

## Overview

InvestSkill is a comprehensive investment analysis toolkit providing professional-grade frameworks for US stock market analysis. It works natively as a Claude Code plugin and also as universal prompts compatible with Gemini CLI, GitHub Copilot, Cursor, and any AI assistant.

## Features

- **Financial Report Analyst**: Extract insights from 10-K/10-Q/annual reports — accounting quality, MD&A analysis, risk factor changes, red flag detection (New in v1.3.0)
- **Multi-Method Stock Valuation**: DCF + comparable company analysis + EV/EBITDA + P/E + residual income, with football field summary (New in v1.3.0)
- **Stock Evaluation**: Comprehensive analysis with Piotroski F-Score, ROIC/WACC, DCF framework, and risk matrix
- **Economics Analysis**: US macro indicators with yield curve, credit spreads, and recession probability scoring
- **Fundamental Analysis**: Deep-dive financial statement analysis with visualizations
- **Technical Analysis**: Chart patterns, multi-timeframe analysis, Volume Profile, and Ichimoku Cloud
- **Portfolio Review**: Performance analysis and optimization
- **Sector Analysis**: Sector rotation and market positioning
- **Interactive Reports**: Generate HTML/PDF reports with visualizations and signal blocks
- **Earnings Call Analysis**: Analyze earnings call transcripts for sentiment and insights
- **Insider Trading Tracking**: Monitor insider buying/selling activity from SEC filings
- **Institutional Ownership**: Track smart money moves from 13F filings
- **Dividend Analysis**: Dividend safety scoring, yield trap detection, and income projections
- **Short Interest Analysis**: Squeeze scoring, borrow rates, bearish thesis evaluation
- **Options Analysis**: Greeks, IV analysis, strategy selector, and earnings plays
- **Research Bundle**: Full multi-skill analysis chained into a unified investment thesis
- **DCF Valuation**: Intrinsic value modeling with sensitivity tables and margin of safety
- **Competitor Analysis**: Economic moat scoring, Porter's Five Forces, competitive benchmarking
- **Standardized Signals**: All 18 skills output a unified BULLISH/NEUTRAL/BEARISH signal block
- **Cross-AI Compatible**: Universal prompts work with any AI assistant (see `prompts/` directory)

## Installation

### For Users

Add the marketplace and install the plugin:

```bash
# Add marketplace from GitHub
/plugin marketplace add yennanliu/InvestSkill

# Install the plugin
/plugin install us-stock-analysis@invest-skill
```

### For Local Development

```bash
# Add local marketplace
/plugin marketplace add /Users/yennanliu/InvestSkill

# Install plugin
/plugin install us-stock-analysis@invest-skill
```

## Available Skills

### Core Analysis Skills
- `/stock-eval` - Evaluate US stocks with Piotroski F-Score, ROIC/WACC, DCF framework, and risk matrix
- `/economics-analysis` - Analyze US economic indicators, yield curve, credit spreads, and recession probability
- `/fundamental-analysis` - Deep fundamental analysis using financials (with `--visual` flag)
- `/technical-analysis` - Technical chart analysis with MTF, Volume Profile, Ichimoku (with `--chart` flag)
- `/portfolio-review` - Portfolio performance and optimization review
- `/sector-analysis` - US market sector analysis and rotation

### Enhanced Data Analysis (New in v1.1.0)
- `/report-generator` - Generate professional HTML/PDF reports with interactive charts and signal blocks
- `/earnings-call-analysis` - Analyze earnings call transcripts for sentiment, themes, and management tone
- `/insider-trading` - Track insider buying/selling activity from SEC Form 4 filings
- `/institutional-ownership` - Monitor institutional holdings changes from 13F filings

### Advanced Analysis Skills (New in v1.2.0)
- `/dividend-analysis` - Dividend safety scoring, Chowder Rule, yield trap detection, income projections
- `/short-interest` - Short squeeze scoring, borrow rates, bearish thesis evaluation
- `/options-analysis` - Greeks analysis, IV rank, strategy selector, earnings play setup
- `/research-bundle` - Full multi-skill research chained into a unified investment thesis with composite score
- `/dcf-valuation` - Intrinsic value DCF model with 3-scenario sensitivity table and margin of safety
- `/competitor-analysis` - Economic moat scoring, Porter's Five Forces, competitive benchmarking

### New Skills (v1.3.0)
- `/financial-report-analyst` - Analyze 10-K/10-Q/annual reports: accounting quality scoring, MD&A deep read, risk factor change detection, management tone analysis, footnote red flags
- `/stock-valuation` - Multi-method valuation: DCF + comparable company analysis (CCA) + EV/EBITDA + P/E + residual income, with football field summary and risk-adjusted expected return

## Usage Examples

### Core Analysis
```bash
# Evaluate a specific stock
/stock-eval AAPL

# Get economic outlook
/economics-analysis

# Deep dive into fundamentals
/fundamental-analysis MSFT

# Deep dive with visualizations
/fundamental-analysis NVDA --visual

# Technical chart analysis
/technical-analysis TSLA

# Technical analysis with chart generation
/technical-analysis GOOGL --chart

# Review portfolio
/portfolio-review [paste your holdings]

# Analyze sectors
/sector-analysis
```

### Enhanced Data Analysis (v1.1.0)
```bash
# Generate HTML/PDF report with visualizations
/report-generator --type comprehensive --data [paste analysis results]

# Analyze earnings call transcript
/earnings-call-analysis AAPL [paste transcript or provide URL]

# Track insider trading activity
/insider-trading TSLA

# Monitor institutional ownership changes
/institutional-ownership MSFT

# Track specific institutional investors
/institutional-ownership META --smart-money
```

### Advanced Analysis (v1.2.0)
```bash
# Dividend safety and income analysis
/dividend-analysis JNJ
/dividend-analysis --portfolio [list of tickers]

# Short squeeze potential
/short-interest GME
/short-interest --scan squeeze-potential

# Options strategy selection
/options-analysis AAPL --strategy bullish
/options-analysis NVDA --earnings
/options-analysis TSLA --iv

# Comprehensive research bundle (chains all skills)
/research-bundle AAPL
/research-bundle NVDA --quick
/research-bundle AAPL,MSFT,GOOGL --compare

# DCF intrinsic value model
/dcf-valuation MSFT
/dcf-valuation NVDA --scenarios
/dcf-valuation GOOGL --visual

# Competitive moat analysis
/competitor-analysis AAPL
/competitor-analysis NVDA --peers AMD,INTC,QCOM
/competitor-analysis GOOGL --moat-only
```

### Report Generation Workflow
```bash
# Step 1: Run fundamental analysis with visualization
/fundamental-analysis AAPL --visual

# Step 2: Generate HTML report from the analysis
/report-generator --type comprehensive

# Step 3: Open HTML file in browser and export to PDF
# The report includes interactive charts and can be printed to PDF
```

### New Analysis Skills (v1.3.0)
```bash
# Analyze a 10-K or 10-Q filing
/financial-report-analyst AAPL 10-K
/financial-report-analyst MSFT 10-Q --section risk-factors
/financial-report-analyst NVDA 10-K --full

# Multi-method stock valuation (DCF + comps + EV multiples)
/stock-valuation AAPL
/stock-valuation MSFT --methods dcf,cca,ev-ebitda
/stock-valuation NVDA --full --visual
/stock-valuation GOOGL --quick
```

## Cross-AI Compatibility

InvestSkill v1.3.0 introduces universal prompt files that work with **any AI assistant** — not just Claude Code.

### Universal Prompts (`prompts/` directory)

All 18 analysis frameworks are available as standalone markdown prompts in the `prompts/` directory. Use them with any AI tool:

```
prompts/
├── financial-report-analyst.md   # 10-K/10-Q analysis
├── stock-valuation.md            # Multi-method valuation
├── stock-eval.md                 # Comprehensive evaluation
├── fundamental-analysis.md       # Financial statement analysis
├── technical-analysis.md         # Chart and indicator analysis
├── dcf-valuation.md              # DCF intrinsic value model
├── economics-analysis.md         # US macro analysis
├── earnings-call-analysis.md     # Transcript analysis
├── insider-trading.md            # Form 4 analysis
├── institutional-ownership.md    # 13F analysis
├── competitor-analysis.md        # Moat and competitive analysis
├── dividend-analysis.md          # Dividend safety analysis
├── short-interest.md             # Short squeeze analysis
├── options-analysis.md           # Greeks and strategy
├── portfolio-review.md           # Portfolio analysis
├── sector-analysis.md            # Sector rotation
└── research-bundle.md            # Full chained analysis
```

### Using with Gemini CLI

```bash
# Gemini CLI reads GEMINI.md automatically for project context
gemini

# Reference a prompt file directly
> @prompts/stock-valuation.md Analyze NVDA using all valuation methods

# Financial report analysis
> @prompts/financial-report-analyst.md [paste your 10-K text here]
```

### Using with GitHub Copilot

The `.github/copilot-instructions.md` file configures Copilot with InvestSkill's analysis frameworks. Open a chat and ask:

```
# In Copilot Chat
Analyze AAPL using the stock-valuation framework

# Reference a prompt file
Use the framework in prompts/fundamental-analysis.md to analyze MSFT
```

### Using with Cursor

The `.cursor/rules/invest-skill.mdc` file is automatically loaded by Cursor. Use the AI chat:

```
# Cursor AI Chat
@prompts/financial-report-analyst.md Analyze this 10-Q section: [paste text]

# Or just ask naturally — Cursor knows the frameworks
Perform a DCF valuation of NVDA using the InvestSkill methodology
```

### Using with Any AI Assistant (ChatGPT, Claude.ai, etc.)

Copy the content of any `prompts/*.md` file and paste it as a system prompt or at the start of your conversation:

```
# Copy prompts/stock-valuation.md content
# Paste into any AI chat, then:
"Analyze AAPL using the framework above"
```

## Structure

```
InvestSkill/
├── .claude-plugin/
│   └── marketplace.json              # Marketplace configuration
├── .cursor/
│   └── rules/
│       └── invest-skill.mdc          # Cursor AI rules (v1.3.0)
├── .github/
│   └── copilot-instructions.md       # GitHub Copilot workspace config (v1.3.0)
├── prompts/                           # Universal prompts — work with any AI (v1.3.0)
│   ├── financial-report-analyst.md
│   ├── stock-valuation.md
│   ├── stock-eval.md
│   ├── fundamental-analysis.md
│   ├── technical-analysis.md
│   ├── dcf-valuation.md
│   ├── economics-analysis.md
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
├── plugins/
│   └── us-stock-analysis/
│       ├── .claude-plugin/
│       │   └── plugin.json           # Plugin manifest
│       ├── skills/
│       │   ├── stock-eval/
│       │   │   └── SKILL.md
│       │   ├── economics-analysis/
│       │   │   └── SKILL.md
│       │   ├── fundamental-analysis/
│       │   │   └── SKILL.md
│       │   ├── technical-analysis/
│       │   │   └── SKILL.md
│       │   ├── portfolio-review/
│       │   │   └── SKILL.md
│       │   ├── sector-analysis/
│       │   │   └── SKILL.md
│       │   ├── report-generator/
│       │   │   └── SKILL.md
│       │   ├── earnings-call-analysis/
│       │   │   └── SKILL.md
│       │   ├── insider-trading/
│       │   │   └── SKILL.md
│       │   ├── institutional-ownership/
│       │   │   └── SKILL.md
│       │   ├── dividend-analysis/
│       │   │   └── SKILL.md
│       │   ├── short-interest/
│       │   │   └── SKILL.md
│       │   ├── options-analysis/
│       │   │   └── SKILL.md
│       │   ├── research-bundle/
│       │   │   └── SKILL.md
│       │   ├── dcf-valuation/
│       │   │   └── SKILL.md
│       │   ├── competitor-analysis/
│       │   │   └── SKILL.md
│       │   ├── financial-report-analyst/
│       │   │   └── SKILL.md          # New v1.3.0: 10-K/10-Q report analysis
│       │   └── stock-valuation/
│       │       └── SKILL.md          # New v1.3.0: Multi-method valuation
│       └── README.md
├── GEMINI.md                          # Gemini CLI project instructions (v1.3.0)
├── LICENSE
└── README.md
```

## Report Generation

InvestSkill v1.1.0 introduces professional report generation capabilities with interactive visualizations.

### Features

- **HTML Reports**: Standalone HTML files with embedded Chart.js visualizations
- **PDF Export**: Print-to-PDF support via browser or command-line tools
- **Interactive Charts**: Line charts, bar charts, candlestick charts, and more
- **Professional Styling**: Financial report-grade formatting and layout
- **Mobile Responsive**: Works on desktop and mobile devices

### Workflow

1. **Run Analysis with Visualization**
   ```bash
   /fundamental-analysis AAPL --visual
   ```
   This generates analysis with chart data tables

2. **Generate HTML Report**
   ```bash
   /report-generator --type comprehensive
   ```
   Creates `investment-report-AAPL-20260217-143022.html`

3. **Export to PDF**
   - **Browser**: Open HTML → Print → Save as PDF
   - **Command Line**: `wkhtmltopdf report.html report.pdf`
   - **Node.js**: Use Playwright or Puppeteer

### Report Templates

- **Executive Summary**: 1-2 pages, key metrics and charts
- **Comprehensive Analysis**: 5-10 pages, full detailed analysis
- **Portfolio Review**: Multi-stock comparison and allocation

### Visualization Types

- Revenue/earnings growth trends (line charts)
- Profit margin comparisons (line charts)
- Balance sheet composition (stacked bar charts)
- Cash flow waterfalls (waterfall charts)
- Valuation multiples (grouped bar charts)
- Price charts with indicators (candlestick + overlays)
- Volume analysis (bar charts)
- Technical indicators (RSI, MACD panels)

## CI/CD & Automation

This project includes comprehensive GitHub Actions workflows for quality assurance and automated releases.

### Automated Workflows

**Validation (`validate.yml`)**
- Runs on every push and PR to main/develop branches
- Validates JSON structure (marketplace.json, plugin.json)
- Checks required files and fields
- Validates SKILL.md frontmatter
- Ensures version consistency across files

**PR Checks (`pr-check.yml`)**
- Quick validation on pull requests
- JSON syntax checking
- Required fields validation
- SKILL.md file linting

**Auto Release (`release.yml`)**
- Triggers on version tags (v*)
- Creates distribution packages (.tar.gz)
- Generates SHA256 checksums
- Creates GitHub releases with artifacts
- Extracts release notes from CHANGELOG.md

**Auto Labeling (`label-pr.yml`)**
- Automatically labels PRs based on changed files
- Adds size labels (small/medium/large)
- Helps with PR organization and review

**First-Time Contributor Greetings (`greetings.yml`)**
- Welcomes new contributors
- Provides helpful information for first-time issues/PRs

### Creating a Release

To create a new release:

1. Update version numbers:
   ```bash
   # Update plugins/us-stock-analysis/.claude-plugin/plugin.json
   # Update .claude-plugin/marketplace.json
   ```

2. Update CHANGELOG.md:
   ```markdown
   ## [1.1.0] - 2026-02-16
   ### Added
   - New feature description
   ```

3. Commit changes:
   ```bash
   git add .
   git commit -m "chore: bump version to 1.1.0"
   git push origin main
   ```

4. Create and push tag:
   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```

5. GitHub Actions will automatically:
   - Validate the plugin structure
   - Create distribution packages
   - Generate release notes
   - Publish the release with artifacts

### Validation Badges

Add these badges to show build status (update username/repo):

```markdown
![Validate](https://github.com/yennanliu/InvestSkill/actions/workflows/validate.yml/badge.svg)
![Release](https://github.com/yennanliu/InvestSkill/actions/workflows/release.yml/badge.svg)
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for detailed information.

**Quick Start:**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:
- Adding new skills
- Creating plugins
- Testing changes
- Commit message format
- Version numbering

## Publishing

To share this marketplace with others:

1. Push to GitHub:
```bash
git add .
git commit -m "Initial plugin marketplace setup"
git push origin main
```

2. Users can then add your marketplace:
```bash
/plugin marketplace add yennanliu/InvestSkill
```

## Roadmap

- [x] ~~Add options analysis skill~~ (v1.2.0)
- [x] ~~Add DCF valuation skill~~ (v1.2.0)
- [x] ~~Add dividend analysis skill~~ (v1.2.0)
- [x] ~~Add competitor/moat analysis~~ (v1.2.0)
- [x] ~~Add financial report analyst (10-K/10-Q)~~ (v1.3.0)
- [x] ~~Add multi-method stock valuation~~ (v1.3.0)
- [x] ~~Cross-AI compatibility (Gemini CLI, Copilot, Cursor)~~ (v1.3.0)
- [ ] Add crypto analysis skill
- [ ] Add earnings calendar integration
- [ ] Add news sentiment analysis
- [ ] Add risk management calculator (VaR, stress testing)
- [ ] Add backtesting capabilities
- [ ] Add international market skills (EU, Asia)
- [ ] Add real-time data API integrations

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Disclaimer

This plugin provides educational analysis and is not financial advice. Always consult with qualified financial advisors before making investment decisions. Past performance does not guarantee future results.

## Resources

- [Claude Code Documentation](https://code.claude.com/docs/)
- [Plugin Development Guide](https://code.claude.com/docs/plugins)
- [Marketplace Guide](https://code.claude.com/docs/plugin-marketplaces)

## Support

For issues, questions, or suggestions, please open an issue on GitHub.



