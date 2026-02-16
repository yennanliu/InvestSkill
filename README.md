# InvestSkill

Professional investment analysis and stock evaluation skills for Claude Code.

[![Deploy](https://github.com/yennanliu/InvestSkill/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/yennanliu/InvestSkill/actions/workflows/deploy-pages.yml)
[![Validate](https://github.com/yennanliu/InvestSkill/actions/workflows/validate.yml/badge.svg)](https://github.com/yennanliu/InvestSkill/actions/workflows/validate.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Website](https://img.shields.io/badge/website-live-success)](https://yennanliu.github.io/InvestSkill/)

📚 **[View Documentation Website](https://yennanliu.github.io/InvestSkill/)**


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
/plugin marketplace add /Users/jerryliu/InvestSkill

# Install plugin
/plugin install us-stock-analysis@invest-skill
```

## Overview

InvestSkill is a comprehensive Claude Code plugin marketplace that provides professional-grade skills for US stock market analysis, including fundamental analysis, technical analysis, economic assessment, and portfolio management.

## Features

- **Stock Evaluation**: Comprehensive fundamental and valuation analysis
- **Economics Analysis**: US economic indicators and market implications
- **Fundamental Analysis**: Deep-dive financial statement analysis
- **Technical Analysis**: Chart patterns and technical indicators
- **Portfolio Review**: Performance analysis and optimization
- **Sector Analysis**: Sector rotation and market positioning

## Installation

### For Users

Add the marketplace and install the plugin:

```bash
# Add marketplace from GitHub
/plugin marketplace add jerryliu/InvestSkill

# Install the plugin
/plugin install us-stock-analysis@invest-skill
```

### For Local Development

```bash
# Add local marketplace
/plugin marketplace add /Users/jerryliu/InvestSkill

# Install plugin
/plugin install us-stock-analysis@invest-skill
```

## Available Skills

- `/stock-eval` - Evaluate US stocks with comprehensive analysis
- `/economics-analysis` - Analyze US economic indicators
- `/fundamental-analysis` - Deep fundamental analysis using financials
- `/technical-analysis` - Technical chart and indicator analysis
- `/portfolio-review` - Portfolio performance and optimization review
- `/sector-analysis` - US market sector analysis and rotation

## Usage Examples

```bash
# Evaluate a specific stock
/stock-eval AAPL

# Get economic outlook
/economics-analysis

# Deep dive into fundamentals
/fundamental-analysis MSFT

# Technical chart analysis
/technical-analysis TSLA

# Review portfolio
/portfolio-review [paste your holdings]

# Analyze sectors
/sector-analysis
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
│       │   │   └── SKILL.md
│       │   ├── technical-analysis/
│       │   │   └── SKILL.md
│       │   ├── portfolio-review/
│       │   │   └── SKILL.md
│       │   └── sector-analysis/
│       │       └── SKILL.md
│       └── README.md
├── LICENSE
└── README.md
```

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
/plugin marketplace add jerryliu/InvestSkill
```

## Roadmap

- [ ] Add options analysis skill
- [ ] Add crypto analysis skill
- [ ] Add earnings calendar integration
- [ ] Add news sentiment analysis
- [ ] Add risk management calculator
- [ ] Add backtesting capabilities

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



