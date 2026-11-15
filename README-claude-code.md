# InvestSkill for Claude Code

Professional investment analysis plugin for Claude Code: 34 analysis frameworks as native slash commands, plus 3 aliases and 2 output tools, `report-generator` and `basket-report` (39 skills in all).

**For other platforms**, see [README.md](README.md).

---

## Quick Start

### Install — plugin marketplace

```bash
claude
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis@invest-skill
/plugin list        # should list us-stock-analysis
```

Commands are namespaced: `/us-stock-analysis:<skill>`.

### Install — one command (project skills)

```bash
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a claude
```

Installs every skill into `.claude/skills/` (add `-g` for `~/.claude/skills/`), so `/<skill>` commands work immediately. Pick one install method per project — with both, every skill appears twice.

### First analysis

```bash
/us-stock-analysis:stock-eval AAPL                  # quality, value and risk in one pass
/us-stock-analysis:stock-valuation MSFT             # DCF + comps + EV multiples
/us-stock-analysis:full-report GOOGL --depth quick  # several modules → HTML report in output/
```

---

## All 39 Skills

The examples below use the marketplace prefix; with `install.sh` drop `us-stock-analysis:`.

### Core Stock Analysis (5)
```bash
/us-stock-analysis:stock-eval AAPL               # Piotroski F-Score, ROIC, quality rating, go/no-go
/us-stock-analysis:technical-analysis TSLA       # MA chart, patterns, RSI/MACD, entry/target/stop
/us-stock-analysis:stock-valuation NVDA          # DCF, comparables, EV multiples, residual income
/us-stock-analysis:economics-analysis            # Macro indicators, recession probability
/us-stock-analysis:compare AAPL MSFT GOOGL       # 2–5 stocks head to head, then the pick
```

### Financial Reports (5)
```bash
/us-stock-analysis:financial-report-analyst AAPL 10-K    # 10-K/10-Q findings and red flags
/us-stock-analysis:10k-digest NVDA FY2024 --lang zh-TW   # Structured digest document (EN or 繁中)
/us-stock-analysis:earnings-call-analysis AAPL           # Transcript tone and guidance [paste transcript]
/us-stock-analysis:forensic-accounting XYZ               # Earnings-quality forensics, Manipulation Risk Score
/us-stock-analysis:credit-check XYZ                      # Debt maturity wall, coverage, Credit Health Score
```

### Market Monitoring (4)
```bash
/us-stock-analysis:insider-trading TSLA          # Form 4 insider activity
/us-stock-analysis:institutional-ownership META  # 13F institutional flows
/us-stock-analysis:dividend-analysis JNJ         # Payout safety, capital allocation
/us-stock-analysis:short-interest GME            # Short ratio, squeeze potential
```

### Advanced Research (15)
```bash
/us-stock-analysis:competitor-analysis AAPL      # Moat, Porter's Five Forces
/us-stock-analysis:industry-map "AI compute"     # Supply/value-chain graph, chokepoints
/us-stock-analysis:options-analysis AAPL         # Greeks, IV, strategy selection
/us-stock-analysis:portfolio-review              # Allocation and rebalancing [paste holdings]
/us-stock-analysis:sector-analysis               # Sector rotation
/us-stock-analysis:stock-screener AAPL,MSFT,NVDA,AMD   # Multi-ticker ranking
/us-stock-analysis:catalyst-calendar NVDA        # 90-day event calendar
/us-stock-analysis:bear-case TSLA                # Short-seller red-team
/us-stock-analysis:position-ladder NVDA          # Staged entry, trim/re-add cycle
/us-stock-analysis:thesis-tracker AAPL           # Write a thesis; --update re-checks it
/us-stock-analysis:etf-analysis VOO              # ETF due diligence, ETF Fitness Score
/us-stock-analysis:earnings-preview AAPL         # Before-earnings scenario grid
/us-stock-analysis:tax-lens                      # US tax mechanics (--non-us for foreign investors)
/us-stock-analysis:risk-stress-test              # Scenario replay, VaR/CVaR, Risk Budget Score
/us-stock-analysis:trade-postmortem              # Review closed trades: process vs. outcome
```

### Meta & Output (5 + 1 output tool)
```bash
/us-stock-analysis:full-report AAPL --depth standard  # Configurable multi-module HTML report
/us-stock-analysis:chart-master                  # Mermaid / ASCII / Chart.js charts
/us-stock-analysis:result-validator              # Score an analysis for data quality and consistency
/us-stock-analysis:fact-check                    # Verify every claim against a primary source
/us-stock-analysis:learning-coach                # Explain any output like a mentor
/us-stock-analysis:report-generator              # Output tool: analysis → HTML/PDF
```

### Aliases (3, not counted as frameworks)

| Alias | Redirects to |
|-------|--------------|
| `fundamental-analysis` | `stock-eval` |
| `dcf-valuation` | `stock-valuation` |
| `research-bundle` | `full-report` (`--depth quick / standard / comprehensive`) |

The aliases still run so old commands keep working, but use the target skill for new work.

---

## Workflows

**Complete due diligence**
```bash
/us-stock-analysis:stock-eval AAPL
/us-stock-analysis:stock-valuation AAPL --methods all
/us-stock-analysis:competitor-analysis AAPL
/us-stock-analysis:bear-case AAPL
/us-stock-analysis:thesis-tracker AAPL
```

**One command**
```bash
/us-stock-analysis:full-report AAPL --depth comprehensive
```

**Earnings season**
```bash
/us-stock-analysis:earnings-preview TICKER          # before the print
/us-stock-analysis:earnings-call-analysis TICKER    # after [paste transcript]
/us-stock-analysis:thesis-tracker TICKER --update   # is the thesis still intact?
```

**Comparing stocks**
```bash
/us-stock-analysis:compare AAPL MSFT GOOGL         # 2–5 names, one pick
/us-stock-analysis:stock-screener AAPL,MSFT,GOOGL,AMZN,META,NVDA   # rank a longer list
```

**Report export**
```bash
/us-stock-analysis:stock-eval AAPL
/us-stock-analysis:report-generator                # then open the HTML → Print → Save as PDF
```

More recipes for every skill: the [Cookbook](https://yennj12.js.org/InvestSkill/cookbook.html).

---

## Output Format

Every analysis opens with a **Data & Sources** header (as-of date, source, retrieval path, confidence) and ends with the standard Investment Signal block:

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

## Troubleshooting

**Plugin not appearing?** Restart Claude Code, then check `/plugin list`. If it's still missing, `/plugin marketplace remove invest-skill`, re-add with `/plugin marketplace add yennanliu/InvestSkill`, and install `us-stock-analysis@invest-skill` again.

**Updating:** `/plugin marketplace update invest-skill`. For `install.sh` installs, re-run the install command.

**Which version am I on?** `/plugin list` shows it; the latest release and its changes are in [CHANGELOG.md](CHANGELOG.md).

**Data:** InvestSkill fetches nothing itself. With web access Claude Code follows the skills' primary-source recipes; without it, paste filings, transcripts or holdings. See [Data & Accuracy](site/content/DATA-AND-ACCURACY.md).

More answers in the [FAQ](FAQ.md).

---

## Model Support

Works with whichever model your Claude Code session runs (`/model` shows and switches it). Multi-module runs such as `full-report --depth comprehensive` benefit most from the most capable model available to you.

---

## More

- [README.md](README.md) — all platforms
- [PLATFORM-COMPATIBILITY.md](PLATFORM-COMPATIBILITY.md) — feature matrix
- [Cookbook](https://yennj12.js.org/InvestSkill/cookbook.html) — examples and walkthroughs
- [CHANGELOG.md](CHANGELOG.md) — what's new in each version
- Issues: https://github.com/yennanliu/InvestSkill/issues · Discussions: https://github.com/yennanliu/InvestSkill/discussions

---

**Educational analysis only — not financial advice.** Consult a qualified advisor, do your own research, and verify the analysis independently.
