# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.4.0] - 2026-02-27

### Added
- Auto-deploy workflow (`auto-deploy.yml`): triggers after Test Suite passes on main,
  detects version bumps via git tag check, runs pre-deploy validation, publishes
  GitHub Release with .tar.gz artifacts and checksums, records result in DEPLOYMENTS.md
- `scripts/record-deploy.js`: appends structured deployment entry to DEPLOYMENTS.md
  with version, commit SHA, timestamp, release URL, and marketplace targets table
- `DEPLOYMENTS.md`: auto-maintained deployment history file seeded with v1.1.0–v1.3.0

### Improved
- `pr-check.yml`: added version consistency check, INVESTMENT SIGNAL block validation,
  skills registry integrity check, and full unit test run
- `validate.yml`: expanded required files list, stricter version mismatch handling,
  Node.js unit test step
- `.gitignore`: added `!scripts/*.js` exception so test scripts are tracked by git

## [1.3.0] - 2026-02-27

### Added
- New `/financial-report-analyst` skill for analyzing 10-K, 10-Q, annual reports, and earnings press releases
  - 8-phase analysis framework: document orientation, MD&A deep read, financial statements, risk factors, footnotes, management tone, YoY comparison, insider activity
  - Accounting quality score (0-21) with criterion breakdown
  - Red flag detection: risk factor changes, footnote anomalies, segment reporting changes
  - Management tone scoring and credibility tracking (guidance accuracy scorecard)
  - DSO/DIO/AP working capital analysis, FCF conversion rate, SBC dilution assessment
  - Supports: 10-K, 10-Q, 8-K, DEF 14A (proxy), S-1, earnings press releases

- New `/stock-valuation` skill for multi-method stock valuation with football field summary
  - Method 1: DCF with 3 scenarios (Bull 20% / Base 60% / Bear 20%), 10-year projection, sensitivity table
  - Method 2: Comparable Company Analysis (CCA) — 5-8 peers, EV/Revenue, EV/EBITDA, P/E, EV/FCF
  - Method 3: EV/EBITDA multiple valuation (conservative / base / premium)
  - Method 4: P/E multiple with PEG ratio
  - Method 5: Residual Income / Economic Value Added (for financial companies)
  - Football field chart consolidating all methods
  - Probability-weighted composite intrinsic value
  - Risk-adjusted expected return with risk/reward ratio (target: 3:1+)
  - Analyst consensus comparison

- Cross-AI compatibility (v1.3.0)
  - `GEMINI.md` — Project instructions for Gemini CLI with prompt file references
  - `.github/copilot-instructions.md` — GitHub Copilot workspace configuration
  - `.cursor/rules/invest-skill.mdc` — Cursor AI rules with skill discovery
  - `prompts/` directory with 17 universal prompt files (AI-agnostic, work with any LLM)
  - All 18 skills now available as standalone prompts for ChatGPT, Claude.ai, Gemini, and more

### Changed
- Plugin version bumped from 1.2.0 to 1.3.0
- README updated with cross-AI compatibility guide and new skills documentation
- Total skills: 16 → 18

## [1.2.0] - 2026-02-24

### Added
- New `/dividend-analysis` skill for income investing and dividend safety analysis
  - Dividend Safety Score (0-100) with letter grade and sector-specific thresholds
  - Payout ratio analysis (EPS-based and FCF-based) with stress testing
  - Dividend growth metrics: 1/3/5/10yr CAGR, Chowder Rule, Dividend Aristocrats/Kings
  - Yield trap detection with red flag checklist
  - Recession durability analysis (2000-2002, 2008-2009, 2020)
  - DRIP compound growth projections and income portfolio modeling

- New `/short-interest` skill for short squeeze and bearish positioning analysis
  - Short Interest Squeeze Score (0-10 composite) with probability tiers
  - Short float %, Days-to-Cover, and borrow rate tier classification tables
  - Short seller thesis evaluation and counter-thesis analysis
  - FINRA reporting schedule with data lag caveats
  - Options market signal integration (put/call ratio, IV skew, unusual activity)

- New `/options-analysis` skill for options Greeks, IV analysis, and strategy selection
  - Full Greeks analysis: Delta, Gamma, Theta, Vega, Rho with practical usage guidance
  - IV Rank (IVR) and IV Percentile (IVP) interpretation
  - IV term structure and volatility skew analysis
  - Strategy Selector with 6×2 selection matrix (bullish/bearish/neutral × high/low IV)
  - Earnings play analysis: expected move formula, straddle setup, volatility crush dynamics
  - Risk management: position sizing, delta hedging, rolling positions

- New `/research-bundle` meta-skill for comprehensive multi-skill investment research
  - 5-phase research process: Business Foundation → Valuation → Market Signals → Technical → Risk
  - Composite scoring framework with weighted components (Business 25%, Valuation 25%, Signals 20%, Technical 15%, Risk 15%)
  - Conflict resolution rules and consensus override logic
  - Unified investment thesis with bull/bear cases and probability-weighted scenarios
  - Entry/exit strategy and quarterly monitoring plan

- New `/dcf-valuation` skill for intrinsic value modeling
  - 8-step DCF methodology (base metrics → revenue projection → FCF margins → terminal value → WACC → discount → sensitivity → margin of safety)
  - Full WACC calculation (CAPM cost of equity, after-tax cost of debt, capital structure)
  - 5×5 sensitivity table (WACC rows vs. terminal growth rate columns)
  - Three-scenario framework: Bull (20%) / Base (60%) / Bear (20%) with probability-weighted IV
  - Common DCF pitfalls guide (SBC adjustment, TV dominance, cyclicality normalization)

- New `/competitor-analysis` skill for economic moat and competitive positioning
  - Five Sources of Economic Moat (Morningstar framework): network effects, cost advantages, intangibles, switching costs, efficient scale
  - Moat width assessment (Wide/Narrow/None/At Risk) with ROIC signal interpretation
  - Porter's Five Forces deep analysis with individual scores and industry attractiveness composite
  - Competitive benchmarking table (8+ metrics vs. top 3-5 peers)
  - Innovation and disruption positioning (disruptor vs. disrupted)
  - Composite Moat Scorecard (6 weighted components, 0-10 scale)

### Enhanced
- Enhanced `/stock-eval` skill with investment-grade depth (50 → 421 lines)
  - Piotroski F-Score (9-criterion quality scoring system)
  - Earnings Quality Score (accruals ratio, cash conversion, non-recurring items)
  - ROIC / WACC analysis with Economic Value Added (EVA) framework
  - DCF framework with 3-scenario sensitivity table
  - Management quality assessment (guidance accuracy, capital allocation track record)
  - Analyst consensus tracking with estimate revision momentum (ERM)
  - Risk Assessment Matrix (business, financial, valuation, macro)

- Enhanced `/economics-analysis` skill with macro depth (55 → 295 lines)
  - Yield Curve Analysis: 2s10s, 3M10Y, 5s30s spreads; curve shapes and recession lead times
  - Credit Market Indicators: IG/HY OAS spreads, TED Spread, MOVE Index thresholds
  - Global Macro Comparison: US/EU/China/Japan cycle positioning, PMI comparison, central bank divergence
  - Recession Probability Scoring: NY Fed model, Conference Board LEI, Sahm Rule composite

- Enhanced `/technical-analysis` skill with advanced techniques (267 → 493 lines)
  - Multi-Timeframe Analysis (MTF): 3-TF framework, alignment scoring, confluence table
  - Volume Profile Analysis: POC, Value Area (VAH/VAL), LVN/HVN trading rules, profile shapes
  - Ichimoku Cloud: all 5 components, bullish/bearish signal matrix, Kumo twist signals
  - Options Flow Integration: put/call ratio, unusual activity, IV vs. HV, GEX mechanics

### Standardized
- Added unified Investment Signal block to all 16 skills:
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
- Consistent scoring guide (0-10), confidence levels (HIGH/MEDIUM/LOW), and time horizons
- `/report-generator` updated to render signal blocks as styled HTML components

### Changed
- Updated plugin version from 1.1.0 to 1.2.0
- Added 6 new skill directories under `plugins/us-stock-analysis/skills/`
- Updated keywords to include: dcf, options, dividends, short-interest, competitive-analysis, moat, research

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

[Unreleased]: https://github.com/yennanliu/InvestSkill/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/yennanliu/InvestSkill/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/yennanliu/InvestSkill/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/yennanliu/InvestSkill/releases/tag/v1.0.0
