<div align="center">

# InvestSkill

**Professional investment analysis frameworks for US stocks — works on every AI platform**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/yennanliu/InvestSkill?style=flat-square&color=gold)](https://github.com/yennanliu/InvestSkill/stargazers)
[![Release](https://img.shields.io/github/v/release/yennanliu/InvestSkill?style=flat-square&color=22c55e)](https://github.com/yennanliu/InvestSkill/releases)
[![Tests](https://img.shields.io/github/actions/workflow/status/yennanliu/InvestSkill/test.yml?style=flat-square&label=tests)](https://github.com/yennanliu/InvestSkill/actions)

[Documentation](https://yennanliu.github.io/InvestSkill/) · [Learn Investing](https://yennanliu.github.io/InvestSkill/learning.html) · [Cookbook](https://yennanliu.github.io/InvestSkill/cookbook.html) · [繁體中文](README-zh-TW.md)

</div>

---

## What is InvestSkill?

InvestSkill is a collection of **23 structured analysis frameworks** that turn any AI assistant into an institutional-quality investment analyst. There is no runtime — every skill is a prompt that works in Claude Code, Cursor, Gemini CLI, GitHub Copilot, ChatGPT, or any other LLM.

```
Ask your AI:  "Evaluate AAPL using the stock-eval framework"
Get back:     Piotroski score · ROIC · moat rating · buy/hold/sell signal
```

<div class="home-card">
  <span class="home-card-icon">🎓</span>
  <div class="home-card-body">
    <div class="home-card-title">New to investing? Start with the Learning guide</div>
    <p>A six-lesson field guide to the concepts behind every skill — from reading a balance sheet to valuing a business to holding a portfolio — in plain English and Traditional Chinese. No finance degree required.</p>
    <p><a class="home-card-cta" href="https://yennanliu.github.io/InvestSkill/learning.html">Start learning →</a></p>
  </div>
</div>

---

## Quick Start

**Claude Code** — recommended, full slash-command support:
```bash
claude
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis
/us-stock-analysis:stock-eval AAPL
```

**Cursor / Copilot / Gemini CLI** — clone once, use everywhere:
```bash
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill

# Cursor
cursor .
# → @prompts/stock-eval.md Evaluate Apple

# Gemini CLI
gemini
# → @prompts/stock-eval.md Evaluate Apple

# Any LLM — paste the prompt file directly
cat prompts/stock-eval.md | pbcopy
```

> Full platform guides: [Claude Code](README-claude-code.md) · [Cursor](README-cursor.md) · [Gemini CLI](README-gemini.md)

---

## The 23 Frameworks

### Core Stock Analysis

| Skill | What it produces |
|-------|-----------------|
| `stock-eval` | Piotroski F-Score, ROIC, quality rating, go/no-go signal |
| `fundamental-analysis` | Income statement, balance sheet, cash flow deep dive |
| `technical-analysis` | MA chart (30/60/90/200/365d) with trade entry/target/stop, chart patterns, RSI/MACD, MTF alignment, Ichimoku |
| `dcf-valuation` | DCF intrinsic value, WACC sensitivity, bear/base/bull scenarios |
| `stock-valuation` | P/E · P/S · EV/EBITDA · comparable company multiples |
| `economics-analysis` | Macro indicators, recession probability, rate sensitivity |

### Financial Reports

| Skill | What it produces |
|-------|-----------------|
| `financial-report-analyst` | 10-K / 10-Q key findings, red flags, accounting quality |
| `10k-digest` | Structured markdown digest — abstract, section summaries, metrics table, refs (EN / 繁中) |
| `earnings-call-analysis` | Management tone, guidance delta, hidden risks |

### Market Monitoring

| Skill | What it produces |
|-------|-----------------|
| `insider-trading` | SEC Form 4 patterns, net buy/sell sentiment |
| `institutional-ownership` | 13F holdings changes, smart money flows |
| `dividend-analysis` | Payout safety score, yield trap detection |
| `short-interest` | Short ratio, days-to-cover, squeeze probability |

### Advanced Research

| Skill | What it produces |
|-------|-----------------|
| `competitor-analysis` | Moat score, Porter's Five Forces, market share |
| `options-analysis` | Greeks, IV rank, earnings play strategy selection |
| `portfolio-review` | Allocation health, concentration risk scoring, correlation analysis, tax-loss harvesting, rebalancing plan |
| `sector-analysis` | Sector rotation signals, valuation tables, seasonality calendar, momentum scoring |
| `stock-screener` | Multi-ticker ranking across valuation, quality, momentum, sentiment, and growth; leaderboard + top picks + avoid list |
| `catalyst-calendar` | Forward-looking 90-day event calendar: earnings, macro events, catalysts, impact scoring, event-driven strategies |

### Meta & Output

| Skill | What it produces |
|-------|-----------------|
| `research-bundle` | Chains all frameworks into one unified investment thesis |
| `full-report` | Runs all 15 modules and saves a standalone HTML report |
| `report-generator` | Converts any analysis into a professional HTML/PDF report |
| `chart-master` | Mermaid · ASCII · Chart.js visualizations from financial data |
| `result-validator` | Scores any analysis on data quality, methodology, and signal consistency |

---

## Example Workflows

**5-minute stock screen**
```
/stock-eval NVDA
/stock-eval AMD
→ Piotroski scores + quality rating for quick go/no-go
```

**Complete due diligence**
```
/stock-eval AAPL
/fundamental-analysis AAPL
/stock-valuation AAPL --methods all
/competitor-analysis AAPL
/financial-report-analyst AAPL 10-K
→ Full investment thesis in one session
```

**Earnings season playbook**
```
/fundamental-analysis TICKER          ← pre-earnings baseline
/earnings-call-analysis TICKER        ← post-earnings [paste transcript]
/options-analysis TICKER --earnings   ← vol expectations + strategy
→ Complete earnings thesis
```

**Export a professional report**
```
/full-report AAPL
→ Saves output/AAPL_report_2026-05-12.html
   (hero header · metric cards · interactive Chart.js · signal block)
```

---

## Output Format

Every skill ends with a standardized **Investment Signal Block**:

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

HTML reports render this as a styled dark panel with a score progress bar, ghost watermark text, and a teal/sky gradient accent — see [report-generator](prompts/report-generator.md) for the full design system.

---

## Platform Support

| Platform | Setup | How it works |
|----------|-------|-------------|
| **Claude Code** | Marketplace install | 23 native slash commands |
| **Cursor IDE** | Clone repo, open folder | Auto-loads `.cursor/rules/` |
| **Gemini CLI** | Clone repo, `cd` into it | Auto-loads `GEMINI.md` |
| **GitHub Copilot** | Clone repo, open in VS Code | Auto-loads `.github/copilot-instructions.md` |
| **ChatGPT / Claude.ai** | Paste any `prompts/*.md` file | Works in any chat interface |
| **Any other LLM** | Reference or paste prompt files | Platform-agnostic markdown |

---

## Learn the Frameworks

New to investing, or unsure which skill to reach for? Start here:

| Guide | What it gives you |
|-------|-------------------|
| [Concepts](site/content/CONCEPTS.md) | The mental models behind the metrics — quality vs. value vs. growth, intrinsic value, moats, risk, and the signal block |
| [Glossary](site/content/GLOSSARY.md) | Plain-English definitions, formulas, and good/bad ranges for every metric the skills emit |
| [Choose a Skill](site/content/CHOOSE-A-SKILL.md) | Map your goal to the right framework, plus comparisons of the ones that overlap |
| [Use Cases](site/content/USE-CASES.md) | End-to-end journeys by investor type — income, first-timer, earnings, macro, skeptic |
| [Data & Accuracy](site/content/DATA-AND-ACCURACY.md) | Where the numbers come from, how to spot hallucinations, and how to validate output |

---

## Documentation

| Resource | Description |
|----------|-------------|
| [Live Docs Site](https://yennanliu.github.io/InvestSkill/) | Full documentation with dark-theme UI |
| [Cookbook](https://yennanliu.github.io/InvestSkill/cookbook.html) | Walkthrough examples and use cases |
| [Skill Reference](https://yennanliu.github.io/InvestSkill/skills.html) | All 23 frameworks, one browsable page each |
| [Claude Code Guide](README-claude-code.md) | Plugin install + all slash commands |
| [Cursor Guide](README-cursor.md) | Auto-loading rules + `@prompts/` usage |
| [Gemini CLI Guide](README-gemini.md) | File references + multi-framework chains |
| [Adding Skills](ADDING-NEW-SKILLS.md) | 12-step contributor walkthrough |
| [FAQ](FAQ.md) | 50+ answers covering all platforms |
| [Changelog](CHANGELOG.md) | Version history |

---

## Contributing

See [ADDING-NEW-SKILLS.md](ADDING-NEW-SKILLS.md) for the full process. The short version:

1. Create `plugins/us-stock-analysis/skills/<name>/SKILL.md` with YAML frontmatter
2. Create `prompts/<name>.md` — same content, no frontmatter, AI-agnostic syntax
3. Add to `plugin.json` skills array and bump version in both manifest files
4. Run `npm test` — all 288+ tests must pass

[Open an issue](https://github.com/yennanliu/InvestSkill/issues) to report bugs · [Start a discussion](https://github.com/yennanliu/InvestSkill/discussions) to propose features.

---

**Version:** 1.8.0 · **Skills:** 23 · **Platforms:** 6 · **License:** MIT · **Tests:** 294+ passing

---

<div align="center">

*For educational and research purposes only. Not financial advice.*  
*Always consult a qualified financial advisor before making investment decisions.*

</div>
