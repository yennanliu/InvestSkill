# InvestSkill

Professional investment analysis and stock evaluation skills for Claude Code.

> 📖 [English](README.md) | **[繁體中文版 (Traditional Chinese)](https://yennj12.js.org/InvestSkill/zh-tw.html)**

[![Deploy](https://github.com/yennanliu/InvestSkill/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/yennanliu/InvestSkill/actions/workflows/deploy-pages.yml)
[![Validate](https://github.com/yennanliu/InvestSkill/actions/workflows/validate.yml/badge.svg)](https://github.com/yennanliu/InvestSkill/actions/workflows/validate.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Website](https://img.shields.io/badge/website-live-success)](https://yennanliu.github.io/InvestSkill/)

📚 **[View Documentation Website](https://yennanliu.github.io/InvestSkill/)**

## Quick Links

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

InvestSkill is a comprehensive Claude Code plugin marketplace that provides professional-grade skills for US stock market analysis, including fundamental analysis, technical analysis, economic assessment, and portfolio management.

## Features

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
- **Standardized Signals**: All 16 skills output a unified BULLISH/NEUTRAL/BEARISH signal block

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

## Structure

```
InvestSkill/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace configuration
├── plugins/
│   └── us-stock-analysis/
│       ├── .claude-plugin/
│       │   └── plugin.json       # Plugin manifest
│       ├── skills/
│       │   ├── stock-eval/
│       │   │   └── SKILL.md
│       │   ├── economics-analysis/
│       │   │   └── SKILL.md
│       │   ├── fundamental-analysis/
│       │   │   └── SKILL.md      # Enhanced with visualization support
│       │   ├── technical-analysis/
│       │   │   └── SKILL.md      # Enhanced with chart generation
│       │   ├── portfolio-review/
│       │   │   └── SKILL.md
│       │   ├── sector-analysis/
│       │   │   └── SKILL.md
│       │   ├── report-generator/
│       │   │   └── SKILL.md      # New: Generate HTML/PDF reports
│       │   ├── earnings-call-analysis/
│       │   │   └── SKILL.md      # New: Earnings call analysis
│       │   ├── insider-trading/
│       │   │   └── SKILL.md      # New: Insider transaction tracking
│       │   ├── institutional-ownership/
│       │   │   └── SKILL.md      # New: 13F filings analysis
│       │   ├── dividend-analysis/
│       │   │   └── SKILL.md      # New v1.2.0: Dividend safety and income analysis
│       │   ├── short-interest/
│       │   │   └── SKILL.md      # New v1.2.0: Short squeeze and bearish positioning
│       │   ├── options-analysis/
│       │   │   └── SKILL.md      # New v1.2.0: Greeks, IV, and strategy selection
│       │   ├── research-bundle/
│       │   │   └── SKILL.md      # New v1.2.0: Multi-skill research orchestration
│       │   ├── dcf-valuation/
│       │   │   └── SKILL.md      # New v1.2.0: DCF intrinsic value modeling
│       │   └── competitor-analysis/
│       │       └── SKILL.md      # New v1.2.0: Moat and competitive positioning
│       └── README.md
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



