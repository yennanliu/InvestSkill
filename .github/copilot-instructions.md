# InvestSkill — GitHub Copilot Workspace Instructions

This repository contains professional investment analysis prompt frameworks for US stock markets. When answering questions or generating analysis in this workspace, apply the methodologies defined in the `prompts/` directory.

## Project Context

InvestSkill provides structured, institutional-quality analysis frameworks covering:
- Fundamental and technical stock analysis
- Multi-method stock valuation (DCF, comparable companies, EV multiples)
- Company financial report analysis (10-K, 10-Q, annual reports)
- Economic and sector analysis
- Portfolio management
- Options, dividends, insider trading, and institutional ownership tracking

## Analysis Frameworks Available

When a user asks for investment analysis, reference the relevant prompt in `prompts/`:

### Core Analysis
- `prompts/stock-eval.md` — Comprehensive stock evaluation with quality scoring
- `prompts/stock-valuation.md` — Multi-method valuation: DCF + comparable company analysis + EV multiples
- `prompts/financial-report-analyst.md` — Extract insights from 10-K/10-Q/annual reports
- `prompts/fundamental-analysis.md` — Deep fundamental financial statement analysis
- `prompts/technical-analysis.md` — Chart patterns, indicators, multi-timeframe analysis
- `prompts/dcf-valuation.md` — Rigorous DCF with 3-scenario sensitivity analysis

### Enhanced Analysis
- `prompts/economics-analysis.md` — US macro indicators, yield curve, recession probability
- `prompts/earnings-call-analysis.md` — Earnings transcript sentiment and theme analysis
- `prompts/insider-trading.md` — SEC Form 4 insider transaction analysis
- `prompts/institutional-ownership.md` — 13F institutional holdings tracking
- `prompts/competitor-analysis.md` — Competitive moat and Porter's Five Forces

### Specialty Analysis
- `prompts/dividend-analysis.md` — Dividend safety, Chowder Rule, yield trap detection
- `prompts/short-interest.md` — Short squeeze scoring and bearish thesis evaluation
- `prompts/options-analysis.md` — Greeks, IV rank, strategy selection
- `prompts/portfolio-review.md` — Portfolio performance and allocation review
- `prompts/sector-analysis.md` — Sector rotation and market positioning
- `prompts/research-bundle.md` — Full multi-skill chained analysis

## Output Standards

All analyses must end with a standardized signal block:

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

## Code and File Conventions

- All skill definitions are in `plugins/us-stock-analysis/skills/<skill-name>/SKILL.md`
- Universal prompts (usable by any AI tool) are in `prompts/<skill-name>.md`
- Plugin manifest: `plugins/us-stock-analysis/.claude-plugin/plugin.json`
- Marketplace config: `.claude-plugin/marketplace.json`

## Disclaimer

This repository provides educational analysis frameworks only. Nothing here constitutes financial advice.
