# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-02-17

### Added
- New `/report-generator` skill for HTML/PDF report generation with interactive visualizations
  - Standalone HTML reports with embedded Chart.js
  - Professional financial report styling and layout
  - Support for multiple report templates (executive summary, comprehensive, portfolio)
  - PDF export via browser print-to-PDF or command-line tools
  - Interactive charts: line, bar, candlestick, waterfall, and more

- New `/earnings-call-analysis` skill for earnings call transcript analysis
  - Sentiment analysis (bullish/neutral/bearish)
  - Management tone assessment (confidence, transparency, red flags)
  - Key themes extraction and ranking
  - Q&A session insights and analyst concerns
  - Quarter-over-quarter comparison
  - Investment implications and recommendations

- New `/insider-trading` skill for insider transaction tracking
  - SEC Form 4 filing analysis
  - Net insider sentiment calculation
  - Significant transaction identification (>$1M, >10% position change)
  - Ownership trend analysis
  - Timing and pattern recognition
  - Red flag detection for concerning patterns

- New `/institutional-ownership` skill for 13F filings analysis
  - Top institutional holders tracking
  - Quarter-over-quarter position changes (new, increased, decreased, eliminated)
  - Smart money tracking (notable investors like Buffett, Ackman, etc.)
  - Ownership concentration analysis
  - Activist investor monitoring
  - Portfolio weight analysis for high-conviction positions

### Enhanced
- Enhanced `/fundamental-analysis` skill with visualization support
  - Optional `--visual` flag for chart generation
  - Revenue/earnings growth trend charts
  - Profit margin comparison visualizations
  - Balance sheet composition charts
  - Cash flow waterfall diagrams
  - Valuation multiples comparison
  - ASCII charts for terminal display
  - Data tables formatted for report generator integration

- Enhanced `/technical-analysis` skill with chart generation
  - Optional `--chart` flag for visual analysis
  - Candlestick charts with moving averages overlay
  - Volume bar charts with average volume indicator
  - RSI, MACD, and Bollinger Bands indicator panels
  - Support/resistance level annotations
  - Pattern recognition overlays
  - ASCII charts for terminal display
  - Chart specifications for HTML report generation

### Changed
- Updated plugin version from 1.0.0 to 1.1.0
- Enhanced marketplace description to highlight new visualization and data analysis features
- Added new keywords: visualization, reports, insider-trading, institutional-ownership, earnings-calls
- Expanded documentation with report generation workflow and examples
- Updated project structure to include 4 new skill directories

### Documentation
- Added "Report Generation" section to README with workflow examples
- Updated "Available Skills" section with new skills (categorized as core vs. enhanced)
- Added usage examples for all new skills
- Updated Traditional Chinese README (README-zh-TW.md) with all new features
- Marked completed tasks in TODO.md (visualization, reports, fundamental data)
- Updated CHANGELOG.md with comprehensive v1.1.0 release notes

## [1.0.0] - 2026-02-16

### Added
- Initial release of InvestSkill marketplace
- US Stock Analysis plugin with 6 comprehensive skills:
  - Stock Evaluation (`/stock-eval`)
  - Economics Analysis (`/economics-analysis`)
  - Fundamental Analysis (`/fundamental-analysis`)
  - Technical Analysis (`/technical-analysis`)
  - Portfolio Review (`/portfolio-review`)
  - Sector Analysis (`/sector-analysis`)
- MIT License
- Comprehensive documentation

### Plugin Details
- us-stock-analysis v1.0.0
  - Professional-grade US stock market analysis
  - Integration with financial data sources
  - Actionable investment insights

[Unreleased]: https://github.com/yennanliu/InvestSkill/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/yennanliu/InvestSkill/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/yennanliu/InvestSkill/releases/tag/v1.0.0
