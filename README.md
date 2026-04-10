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

## Platform-Specific Guides

Choose your platform for detailed setup and usage instructions:

- 🔌 **[Claude Code Plugin Guide](README-claude-code.md)** — Installation, skills reference, advanced workflows
- 🎯 **[Cursor IDE Rules Guide](README-cursor.md)** — Auto-loading rules, @prompts/ references, natural language queries
- 💬 **[Gemini CLI Guide](README-gemini.md)** — Project-directory auto-loading, @prompts/ file references, session memory
- 🤖 **[GitHub Copilot Guide](README.md#github-copilot)** — Auto-loading configuration, natural language support
- 📚 **[Universal Access](README.md#any-ai-assistant)** — Works with ChatGPT, Claude.ai, Anthropic Console, etc.

**Status Dashboard**: [Deployment Status](DEPLOYMENT-STATUS.md) — Platform availability, version sync, release history

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

### Verify Installation

After installation, verify everything is working:

```bash
# Check all platforms
node scripts/setup-verify.js
```

This script checks:
- ✅ Claude Code plugin installation
- ✅ Cursor rules setup
- ✅ Gemini CLI availability
- ✅ GitHub Copilot configuration
- ✅ Universal prompts availability
- ✅ Project file structure

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

---

## Installation for Different AI Platforms

### Claude Code (Official Plugin Marketplace)

**Installation:**
```bash
# Open Claude Code
claude

# Add marketplace
/plugin marketplace add yennanliu/InvestSkill

# Install plugin
/plugin install us-stock-analysis

# List installed plugins
/plugin list
```

**Usage:**
```bash
# All 18 skills available as slash commands
/us-stock-analysis:stock-eval AAPL
/us-stock-analysis:fundamental-analysis NVDA --visual
/us-stock-analysis:technical-analysis TSLA --chart
/us-stock-analysis:research-bundle MSFT --full
/us-stock-analysis:financial-report-analyst AAPL 10-K
/us-stock-analysis:stock-valuation GOOGL --methods dcf,cca,ev-ebitda
```

---

### Gemini CLI

**Installation:**

Gemini CLI automatically loads `GEMINI.md` when you enter the project directory — **no manual installation needed**.

```bash
# Navigate to InvestSkill directory
cd /path/to/InvestSkill

# Start Gemini CLI
gemini

# You now have access to all 18 analysis prompts via the prompts/ directory
```

**Usage:**

Reference prompt files directly in the chat:

```bash
# Stock valuation analysis
> @prompts/stock-valuation.md Analyze AAPL using all valuation methods

# Financial report analysis with 10-K text
> @prompts/financial-report-analyst.md [paste 10-K text here]

# Fundamental analysis for a specific stock
> @prompts/fundamental-analysis.md Deep dive on NVDA

# Economic analysis
> @prompts/economics-analysis.md What's the current economic outlook?

# Full research bundle
> @prompts/research-bundle.md Complete analysis on MSFT

# Multiple analyses in one query
> @prompts/stock-eval.md @prompts/technical-analysis.md Analyze TSLA holistically
```

**Key Points:**
- The `@prompts/` file reference loads the entire analysis framework
- You can paste financial data, transcripts, or 10-K text directly
- Gemini CLI displays the GEMINI.md file automatically when first loaded
- All 18 analysis frameworks are available in the `prompts/` directory

---

### GitHub Copilot

**Installation:**

GitHub Copilot automatically loads `.github/copilot-instructions.md` when you work in this repository — **no manual installation needed**.

```bash
# Clone or open the repository in any editor with GitHub Copilot
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill

# Open in VS Code, JetBrains IDE, or GitHub.com editor
# GitHub Copilot will automatically load copilot-instructions.md
```

**Usage:**

Open Copilot Chat and ask naturally or reference prompt files:

```
# Natural language queries (Copilot uses the instructions context)
Perform a fundamental analysis of Apple stock.

Do a DCF valuation for Microsoft using the stock-valuation framework.

# Reference prompt files explicitly
Use the framework in prompts/financial-report-analyst.md to analyze this 10-Q [paste text]

# Combine analysis requests
First use stock-eval.md to evaluate NVDA, then use technical-analysis.md for chart patterns

# Request specific analysis types
Run an insider-trading analysis on Tesla using prompts/insider-trading.md

# Multiple stocks comparison
Compare AAPL and MSFT using the portfolio-review framework

# Technical analysis with chart patterns
Analyze the technical setup of NVDA using prompts/technical-analysis.md
```

**Key Points:**
- Copilot automatically understands InvestSkill frameworks when working in this repository
- Reference `prompts/<name>.md` to explicitly invoke a framework
- You can paste financial statements, transcripts, or SEC filings directly
- The `.github/copilot-instructions.md` file is automatically loaded

---

### Cursor

**Installation:**

Cursor automatically loads `.cursor/rules/invest-skill.mdc` when you open this repository — **no manual installation needed**.

```bash
# Clone or open the repository in Cursor
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill

# Open Cursor in this directory
cursor .

# Cursor will automatically load the investment analysis rules
```

**Usage:**

Open Cursor's AI chat and ask naturally or reference prompt files:

```
# Direct references to prompt files
@prompts/stock-valuation.md Analyze AAPL using all valuation methods

@prompts/financial-report-analyst.md Extract key insights from this 10-K [paste text]

@prompts/dcf-valuation.md Build a DCF model for Microsoft

# Natural language queries (Cursor applies the rules context)
Do a comprehensive evaluation of NVDA stock

Analyze the technical chart patterns for Tesla

# Combine multiple analysis types
First analyze fundamentals, then do technical analysis on MSFT using the prompts

# Financial report analysis with uploaded documents
@prompts/financial-report-analyst.md Analyze this annual report PDF [file reference]

# Portfolio analysis
@prompts/portfolio-review.md Review my portfolio allocation
```

**Key Points:**
- Cursor rules are automatically loaded from `.cursor/rules/invest-skill.mdc`
- All 18 analysis frameworks are available in the `prompts/` directory
- You can use `@prompts/` references to explicitly invoke a framework
- You can paste or upload financial documents for analysis

---

### Any AI Assistant (ChatGPT, Claude.ai, Anthropic Console, etc.)

**Installation:**

No installation needed — copy and paste the prompt content directly.

**Usage:**

1. **Copy a prompt file from `prompts/` directory**
   - Example: Open `prompts/stock-valuation.md` in your text editor
   
2. **Paste the content into your AI chat as the system message or context**

3. **Ask your analysis question:**

```
# Paste prompts/stock-valuation.md content, then ask:
Analyze Apple (AAPL) using the framework above

# Paste prompts/financial-report-analyst.md, then:
Analyze this 10-K filing: [paste 10-K text]

# Paste prompts/fundamental-analysis.md, then:
Deep dive on Microsoft's fundamentals

# Multiple prompts: paste several, then ask:
Provide a complete analysis combining stock-eval, technical-analysis, and economics-analysis frameworks
```

**Quick Copy Command (macOS):**
```bash
# Copy a prompt file to clipboard
cat prompts/stock-valuation.md | pbcopy

# Then paste into ChatGPT, Claude.ai, etc.
```

**Quick Copy Command (Linux):**
```bash
# Copy a prompt file to clipboard
cat prompts/stock-valuation.md | xclip -selection clipboard
```

**Key Points:**
- All 18 analysis frameworks work with any AI model
- No API key or special setup required
- Best for ad-hoc analysis without persistent setup

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

## CI/CD & Multi-Platform Automation

This project includes comprehensive GitHub Actions workflows for quality assurance and automated releases to all supported AI platforms.

### Multi-Platform Release System

InvestSkill automatically releases to **5 AI platforms** simultaneously:

| Platform | Trigger | Method |
|----------|---------|--------|
| **Claude Code** | Version change | GitHub Release + marketplace.json |
| **Cursor** | Version change | Rules publishing script |
| **Gemini CLI** | Version change | Prompts packaging script |
| **GitHub Copilot** | Every commit | Auto-loaded from .github/ |
| **Universal Prompts** | Version change | GitHub Release artifacts |

**See [CI-CD-GUIDE.md](CI-CD-GUIDE.md) for complete documentation.**

### Automated Workflows

**Validation (`validate.yml`)**
- Runs on every push and PR to main/develop branches
- Validates JSON structure (marketplace.json, plugin.json)
- Checks required files and fields
- Validates SKILL.md frontmatter
- Ensures version consistency across files
- Runs unit tests for all 18 skills

**Test Suite (`test.yml`)**
- Comprehensive testing on every commit
- Validates all 18 analysis frameworks
- Checks output format standards
- Verifies signal block formatting

**Auto Deploy (`auto-deploy.yml`)** ⭐ **NEW**
- Triggers after successful test suite on main
- Detects version changes automatically
- Publishes to all 5 platforms simultaneously
- Generates platform-specific release notes
- Records deployment in DEPLOYMENTS.md
- Creates GitHub release with multi-platform artifacts

**Deployment Recording**
- Auto-updates DEPLOYMENTS.md after each release
- Shows platform-by-platform status
- Links to GitHub release and CI runs
- Tracks deployment history over time

**Auto Labeling (`label-pr.yml`)**
- Automatically labels PRs based on changed files
- Adds size labels (small/medium/large)
- Helps with PR organization and review

**First-Time Contributor Greetings (`greetings.yml`)**
- Welcomes new contributors
- Provides helpful information for first-time issues/PRs

### Creating a Release

To create a new release to all platforms:

1. Update version numbers:
   ```bash
   # .claude-plugin/marketplace.json
   "version": "X.Y.Z"
   
   # plugins/us-stock-analysis/.claude-plugin/plugin.json
   "version": "X.Y.Z"
   ```

2. Update CHANGELOG.md:
   ```markdown
   ## [X.Y.Z] - YYYY-MM-DD
   ### Added
   - New feature description
   ### Changed
   - Change description
   ### Fixed
   - Bug fix description
   ```

3. Commit and push:
   ```bash
   git add .claude-plugin/marketplace.json plugins/us-stock-analysis/.claude-plugin/plugin.json CHANGELOG.md
   git commit -m "chore: bump version to X.Y.Z"
   git push origin main
   ```

4. GitHub Actions automatically:
   - Detects version change
   - Validates everything
   - Tests all 18 skills
   - Publishes to Claude Code marketplace
   - Publishes Cursor rules
   - Publishes Gemini CLI prompts
   - Updates GitHub Copilot instructions
   - Generates platform-specific release notes
   - Creates GitHub release with artifacts
   - Records deployment in DEPLOYMENTS.md

**No manual release tag needed** — version change detection is automatic!

### Deployment Artifacts

After each release, the following files are available in GitHub Releases:

```
dist/
├── invest-skill-marketplace-X.Y.Z.tar.gz      # Full marketplace
├── us-stock-analysis-X.Y.Z.tar.gz             # Claude Code plugin
├── cursor-rules-X.Y.Z.mdc                     # Cursor rules
├── gemini-prompts-X.Y.Z.tar.gz                # Gemini CLI prompts
├── checksums.txt                              # SHA256 checksums
├── CLAUDE-CODE-RELEASE-NOTES.md               # Claude Code guide
├── CURSOR-RELEASE-NOTES.md                    # Cursor guide
├── GEMINI-RELEASE-NOTES.md                    # Gemini guide
├── COPILOT-RELEASE-NOTES.md                   # Copilot guide
└── UNIVERSAL-RELEASE-NOTES.md                 # Universal guide
```

### Platform-Specific Registry Integration (Optional)

To enable direct registry publishing (instead of GitHub artifacts):

1. Add GitHub Secrets for registry credentials:
   ```
   CURSOR_REGISTRY_TOKEN=<your-token>
   GEMINI_REGISTRY_TOKEN=<your-token>
   GEMINI_REGISTRY_URL=<registry-endpoint>
   ```

2. CI/CD will automatically publish to registries

Without these credentials, the system publishes to GitHub Releases and instructions guide users to copy files manually.

### Viewing Deployment History

See [DEPLOYMENTS.md](DEPLOYMENTS.md) for a complete record of all releases, including:
- Version numbers
- Deployment timestamps
- Commit SHAs
- Skill counts
- Links to releases and CI runs
- Platform-by-platform status

### CI/CD Debugging

**View workflow logs**: https://github.com/yennanliu/InvestSkill/actions

**Common workflow files**:
- `.github/workflows/validate.yml` — Structure validation
- `.github/workflows/test.yml` — Unit tests
- `.github/workflows/auto-deploy.yml` — Release automation
- `.github/workflows/deploy-pages.yml` — Website deployment

### Release Checklist

Before bumping version:
- [ ] All features complete and tested
- [ ] CHANGELOG.md updated
- [ ] Documentation updated
- [ ] No uncommitted changes
- [ ] Tests passing locally

### Validation Badges

Add these badges to show build status:

```markdown
![Validate](https://github.com/yennanliu/InvestSkill/actions/workflows/validate.yml/badge.svg)
![Test](https://github.com/yennanliu/InvestSkill/actions/workflows/test.yml/badge.svg)
![Deploy](https://github.com/yennanliu/InvestSkill/actions/workflows/auto-deploy.yml/badge.svg)
```

### More Information

For comprehensive CI/CD documentation, see [CI-CD-GUIDE.md](CI-CD-GUIDE.md).

## Quality Assurance & Validation

InvestSkill includes comprehensive validation and testing tools:

### Pre-Release Validation

Before bumping version numbers, run:

```bash
# Validate everything before release
node scripts/pre-release-check.js
```

Checks:
- ✅ All 18 skills registered in plugin.json
- ✅ Prompts synchronized with skills
- ✅ Required documentation files exist
- ✅ Version consistency across files
- ✅ SKILL.md frontmatter validity
- ✅ Signal block templates present
- ✅ CHANGELOG entries exist
- ✅ JSON file syntax
- ✅ Git status clean
- ✅ Prompts directory structure

### Prompt Validation

Validate all prompts for quality and consistency:

```bash
# Validate all prompts
node scripts/validate-prompts.js
```

Checks:
- ✅ Signal block templates present
- ✅ No platform-specific syntax
- ✅ Token count estimates
- ✅ Required sections present
- ✅ Formatting consistency
- ✅ Synchronization with SKILL.md files

### Installation Verification

Verify InvestSkill installation across all platforms:

```bash
# Check installation for all platforms
node scripts/setup-verify.js
```

Verifies:
- ✅ Claude Code plugin
- ✅ Cursor rules
- ✅ Gemini CLI
- ✅ GitHub Copilot
- ✅ Universal prompts
- ✅ File structure

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

## Documentation & Guides

### Core Documentation
- **[README.md](README.md)** — This file (complete overview)
- **[CHANGELOG.md](CHANGELOG.md)** — Version history and updates
- **[PLATFORM-COMPATIBILITY.md](PLATFORM-COMPATIBILITY.md)** — Platform comparison and requirements
- **[CI-CD-GUIDE.md](CI-CD-GUIDE.md)** — Multi-platform CI/CD automation
- **[RELEASE-QUICK-REFERENCE.md](RELEASE-QUICK-REFERENCE.md)** — Fast release guide
- **[DEPLOYMENTS.md](DEPLOYMENTS.md)** — Deployment history log

### Platform-Specific Guides
- **[GEMINI.md](GEMINI.md)** — Gemini CLI setup and usage
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** — GitHub Copilot guide
- **[.cursor/rules/invest-skill.mdc](.cursor/rules/invest-skill.mdc)** — Cursor rules

### Validation & Verification
```bash
# Pre-release validation checklist
node scripts/pre-release-check.js

# Validate all prompts
node scripts/validate-prompts.js

# Verify installation
node scripts/setup-verify.js
```

## Resources

- [Claude Code Documentation](https://code.claude.com/docs/)
- [Plugin Development Guide](https://code.claude.com/docs/plugins)
- [Marketplace Guide](https://code.claude.com/docs/plugin-marketplaces)
- [Cursor Rules Guide](https://cursor.sh/docs/rules)
- [Gemini CLI Documentation](https://gemini.ai/docs)
- [GitHub Copilot Configuration](https://docs.github.com/en/copilot)

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

### Quick Help Commands
```bash
# Verify installation
npm run verify

# Pre-release validation
npm run pre-release-check

# Validate prompts
npm run validate-prompts

# Available npm scripts
npm run
```



