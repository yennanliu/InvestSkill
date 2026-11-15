# us-stock-analysis

Structured investment-analysis frameworks for US stocks, ETFs and portfolios — **34 analysis frameworks** (+ 3 aliases, 2 output tools) covering fundamental, technical, valuation, financial-report, forensic-accounting, credit, capital-allocation, ownership, options, risk, tax and position-management analysis. Every framework ends with the same Investment Signal block (signal, 0–10 score, confidence, horizon), so results are comparable across skills.

Part of [InvestSkill](https://github.com/yennanliu/InvestSkill). Full documentation: <https://yennj12.js.org/InvestSkill/>.

## Install

```
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis@invest-skill
```

For local development, point the marketplace at a clone: `/plugin marketplace add /path/to/InvestSkill`.

## Usage examples

```
/us-stock-analysis:stock-eval AAPL
/us-stock-analysis:technical-analysis TSLA
/us-stock-analysis:economics-analysis
/us-stock-analysis:portfolio-review [paste holdings]
/us-stock-analysis:full-report MSFT --depth standard
```

## Skills

| Area | Skills |
|------|--------|
| Core evaluation | `stock-eval`, `stock-valuation`, `technical-analysis`, `competitor-analysis`, `compare`, `bear-case` |
| Filings & earnings | `financial-report-analyst`, `10k-digest`, `forensic-accounting`, `credit-check`, `earnings-call-analysis`, `earnings-preview`, `fact-check` |
| Ownership & flows | `insider-trading`, `institutional-ownership`, `short-interest`, `options-analysis` |
| Market & macro | `economics-analysis`, `sector-analysis`, `industry-map`, `catalyst-calendar`, `etf-analysis` |
| Portfolio & position | `portfolio-review`, `risk-stress-test`, `position-ladder`, `dividend-analysis`, `tax-lens`, `stock-screener`, `thesis-tracker`, `trade-postmortem` |
| Quality & learning | `result-validator`, `learning-coach`, `chart-master`, `full-report` |
| Output tools | `report-generator`, `basket-report` |
| Aliases | `fundamental-analysis` → `stock-eval`, `dcf-valuation` → `stock-valuation`, `research-bundle` → `full-report` |

## What this plugin runs and sends

Nothing. The plugin contains only `SKILL.md` prompt files — no hooks, MCP servers, scripts, or dependencies, and no API key. It does not collect, store, or transmit any data. When the host assistant has web search or fetch tools, the skills ask it to cite primary sources (SEC EDGAR, company IR, FRED); otherwise they work from data you paste in and mark unsourced figures as unverified.

## Disclaimer

Educational analysis only — not financial, investment, or tax advice.

## License

MIT. Contributions welcome — open an issue or pull request on [GitHub](https://github.com/yennanliu/InvestSkill).
