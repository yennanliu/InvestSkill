# InvestSkill

Professional investment analysis and stock evaluation skills for Claude Code.


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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

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



