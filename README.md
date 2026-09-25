<div align="center">

# InvestSkill

**Professional investment analysis frameworks for US stocks — works on every AI platform**

**No API keys · No subscriptions · 100% free**

[![Cost: $0](https://img.shields.io/badge/cost-%240%20%C2%B7%20no%20API%20keys-22c55e?style=flat-square)](#no-api-keys-no-cost)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/yennanliu/InvestSkill?style=flat-square&color=gold)](https://github.com/yennanliu/InvestSkill/stargazers)
[![Release](https://img.shields.io/github/v/release/yennanliu/InvestSkill?style=flat-square&color=22c55e)](https://github.com/yennanliu/InvestSkill/releases)
[![Tests](https://img.shields.io/github/actions/workflow/status/yennanliu/InvestSkill/test.yml?style=flat-square&label=tests)](https://github.com/yennanliu/InvestSkill/actions)

[Documentation](https://yennanliu.github.io/InvestSkill/) · [Learn Investing](https://yennanliu.github.io/InvestSkill/learning.html) · [Cookbook](https://yennanliu.github.io/InvestSkill/cookbook.html) · [繁體中文](README-zh-TW.md)

</div>

---

## What is InvestSkill?

InvestSkill is a collection of **30 structured analysis frameworks** that turn any AI assistant into an institutional-quality investment analyst. There is no runtime — every skill is a prompt that works in Claude Code, Cursor, Gemini CLI, GitHub Copilot, ChatGPT, or any other LLM.

**Nothing to sign up for, nothing to pay for.** No API key, no data-vendor subscription, no billing setup — you bring the AI assistant you already use (a free tier or a local model works too) and InvestSkill is just markdown. See [No API keys, no cost](#no-api-keys-no-cost).

```
Ask your AI:  "Evaluate AAPL using the stock-eval framework"
Get back:     Piotroski score · ROIC · moat rating · buy/hold/sell signal
```

<div class="home-card">
  <span class="home-card-icon">🎓</span>
  <div class="home-card-body">
    <div class="home-card-title">New to investing? Start with the Learning guide</div>
    <p>A thirteen-lesson field guide, in plain English and Traditional Chinese: Part I teaches the concepts behind every skill — reading a balance sheet, valuing a business, holding a portfolio — and Part II the practical foundations: accounts and orders, an ETF core, taxes (including for non-US investors), earnings season, and the psychology that protects the plan. No finance degree required.</p>
    <p><a class="home-card-cta" href="https://yennanliu.github.io/InvestSkill/learning.html">Start learning →</a></p>
  </div>
</div>

---

## Quick Start

**One command, any AI agent** — [pick yours on the website](https://yennj12.js.org/InvestSkill/#install):

```bash
# Claude Code
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a claude

# Swap the agent: cursor · copilot · gemini · codex · opencode · any
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a cursor
```

The installer copies every framework into `.investskill/prompts/` and wires up your agent's own entry point — nothing else runs on your machine:

| `-a` | Agent | Wires up |
|------|-------|----------|
| `claude` | Claude Code | `.claude/skills/<skill>/SKILL.md` (slash commands) |
| `cursor` | Cursor | `.cursor/rules/investskill.mdc` |
| `copilot` | GitHub Copilot | `.github/copilot-instructions.md` |
| `gemini` | Gemini CLI | `GEMINI.md` |
| `codex` | Codex | `AGENTS.md` |
| `opencode` | OpenCode | `AGENTS.md` |
| `any` | ChatGPT, Claude.ai, Ollama, … | `.investskill/prompts/` only — paste and go |

Add `-g` to install for your user instead of one project, `-d DIR` to target another directory, or `-h` for all options. Existing instruction files are appended to, never overwritten, and re-running is a no-op. Read it first if you'd rather not pipe to `bash`: [install.sh](install.sh).

**Claude Code via the plugin marketplace** — full slash-command support:
```bash
claude
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis
/us-stock-analysis:stock-eval AAPL
```

**Or clone the repo** — every framework in `prompts/`, use it anywhere:
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

> Full platform guides: [Claude Code](README-claude-code.md) · [Cursor](README-cursor.md) · [Gemini CLI](README-gemini.md) · [Ollama](README-ollama.md)

---

## No API Keys, No Cost

InvestSkill is **completely free to use** — there is nothing to buy, register, or configure.

| | |
|---|---|
| **API keys** | **None.** No OpenAI / Anthropic / Alpha Vantage / Polygon key. The plugin never calls an endpoint — there is no code to call one with. |
| **Subscriptions** | **None.** No paid tier, no seats, no usage metering, no account. |
| **Market-data fees** | **None.** No Bloomberg, no paid data feed. The AI reads public filings and free sources — or you paste the numbers in yourself. |
| **Install / runtime** | **None.** Every skill is a plain markdown prompt. Nothing runs on your machine, so nothing phones home. |
| **License** | **MIT.** Free to use, fork, and modify — for personal or commercial work. |

**The only thing you need is an AI assistant you already have.** That can be a paid plan (Claude Code, Cursor, Copilot), a free tier (ChatGPT, Gemini, Claude.ai), or a fully offline local model via [Ollama](README-ollama.md) — in which case the total cost of running every framework is literally zero.

> Because there's no API, there's also no telemetry: InvestSkill never sees your tickers, your holdings, or your analysis. See [Data & Accuracy](site/content/DATA-AND-ACCURACY.md) for where the numbers actually come from.

**Bring your own data.** The filing skills (`10k-digest`, `financial-report-analyst`, `fact-check`) carry a keyless SEC EDGAR recipe a tool-enabled assistant can follow by itself. If yours can't browse, two optional zero-dependency scripts fetch the primary source for you to paste — `node scripts/fetch-edgar.js AAPL --form 10-K` saves the filing as text, `node scripts/fetch-fundamentals.js AAPL` builds a reconciled statement pack from the SEC's XBRL facts. Neither is part of the plugin. Details on the [Data & Accuracy](site/content/DATA-AND-ACCURACY.md#bring-your-own-data-the-keyless-edgar-path) page.

---

## The 30 Frameworks

### Core Stock Analysis

| Skill | What it produces |
|-------|-----------------|
| `stock-eval` | Piotroski F-Score, ROIC, quality rating, go/no-go signal |
| `technical-analysis` | MA chart (30/60/90/200/365d) with trade entry/target/stop, chart patterns, RSI/MACD, MTF alignment, Ichimoku |
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
| `industry-map` | Supply/value-chain graph (upstream→downstream), chokepoints, margin-pool migration, second-order ideas |
| `options-analysis` | Greeks, IV rank, earnings play strategy selection |
| `portfolio-review` | Allocation health, concentration risk scoring, correlation analysis, tax-loss harvesting, rebalancing plan |
| `sector-analysis` | Sector rotation signals, valuation tables, seasonality calendar, momentum scoring |
| `stock-screener` | Multi-ticker ranking across valuation, quality, momentum, sentiment, and growth; leaderboard + top picks + avoid list |
| `catalyst-calendar` | Forward-looking 90-day event calendar: earnings, macro events, catalysts, impact scoring, event-driven strategies |
| `bear-case` | Deliberate short-seller red-team: bear thesis, accounting red flags, downside target, thesis-killers (counterevidence for any bull thesis) |
| `position-ladder` | Staged entry ladder + trim/re-add cycle for a single holding: share-count floor/ceiling, blended cost basis, wash-sale flags, total-return-vs-buy-and-hold check, thesis-break gate |
| `thesis-tracker` | Write, save, and re-check an investment thesis — KPIs with thresholds, invalidation triggers, catalysts, a pre-mortem, and a decision log; `--update` re-reads the saved file against new data and returns INTACT / WEAKENED / BROKEN |
| `etf-analysis` | ETF / index-fund due diligence — expense ratio vs. category, tracking difference, liquidity, holdings concentration and tilt, overlap with your other positions, distribution and capital-gains history, structure warnings, and an ETF-vs-top-holdings comparison, scored as an ETF Fitness Score 0–10 |
| `earnings-preview` | The before-earnings skill — consensus vs. whisper, 8-quarter beat rate and post-print move distribution, options-implied vs. realized move, what the current price already assumes, the KPIs to watch, and a three-scenario grid (beat-and-raise / beat-and-lower / miss) with expected reaction and a position rule for each |
| `tax-lens` | US tax mechanics for a position or portfolio — short- vs. long-term treatment, wash-sale window check, qualified-dividend holding-period test, lot selection (specific-ID vs. FIFO), tax-loss-harvesting pairs, account placement, estimated annual tax drag — plus a --non-us module (W-8BEN, dividend withholding and treaty rates, capital-gains treatment, US estate-tax exposure, UCITS alternatives). Educational only, never tax advice |
| `risk-stress-test` | Portfolio and position risk report — beta-weighted exposure, historical scenario replay (2008, March 2020, 2022 rate shock, 2025 tariff shock), parametric VaR / CVaR at 95 / 99 %, max-drawdown estimate, correlation-spike scenario, rate / USD / oil sensitivity, liquidity (days to exit at 20 % of ADV), and a Risk Budget Score 0–10 |

### Meta & Output

| Skill | What it produces |
|-------|-----------------|
| `full-report` | Runs all 15 modules and saves a standalone HTML report |
| `report-generator` | Converts any analysis into a professional HTML/PDF report |
| `chart-master` | Mermaid · ASCII · Chart.js visualizations from financial data |
| `result-validator` | Scores any analysis on data quality, methodology, and signal consistency |
| `learning-coach` | Explains any InvestSkill output like a mentor — every metric in plain words, why it matters, its good / bad range, and the lesson that teaches it — then asks 3–5 Socratic questions and "what would change your mind?". --level beginner / intermediate, --lang zh-TW, and a --quiz mode that drills a Learning lesson |
| `fact-check` | Claim-level verification of any report or data set — extract every figure and factual claim, check each against a primary source (SEC filing, company IR, FRED, exchange data, or the user's own document), recompute derived numbers, mark ✅ verified / ⚠️ mismatch / ❓ unverifiable, and re-issue the report with inline citations and a References section; Verification Score 0–10 |

### Aliases (redirects)

Three earlier skills were absorbed into larger ones. They are still installed so old references keep working, but they are aliases, not frameworks, and are not counted above.

| Alias | Redirects to |
|-------|--------------|
| `fundamental-analysis` | `stock-eval` (statement-level deep dive is a section of it) |
| `dcf-valuation` | `stock-valuation` (DCF is Method 1 of its multi-method model) |
| `research-bundle` | `full-report` (use `--depth quick / standard / comprehensive`) |

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
/stock-valuation AAPL --methods all
/competitor-analysis AAPL
/financial-report-analyst AAPL 10-K
→ Full investment thesis in one session
```

**Earnings season playbook**
```
/stock-eval TICKER                    ← pre-earnings baseline
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
| **Claude Code** | Marketplace install | 34 native slash commands (30 frameworks + 3 aliases + 1 output tool) |
| **Cursor IDE** | Clone repo, open folder | Auto-loads `.cursor/rules/` |
| **Gemini CLI** | Clone repo, `cd` into it | Auto-loads `GEMINI.md` |
| **GitHub Copilot** | Clone repo, open in VS Code | Auto-loads `.github/copilot-instructions.md` |
| **Ollama (local models)** | Clone repo, run a local model | Offline open-source models, no API key — [guide](README-ollama.md) |
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
| [Skill Reference](https://yennanliu.github.io/InvestSkill/skills.html) | All 30 frameworks, one browsable page each |
| [Claude Code Guide](README-claude-code.md) | Plugin install + all slash commands |
| [Cursor Guide](README-cursor.md) | Auto-loading rules + `@prompts/` usage |
| [Gemini CLI Guide](README-gemini.md) | File references + multi-framework chains |
| [Ollama Guide](README-ollama.md) | Local open-source models, offline & no API key |
| [Adding Skills](ADDING-NEW-SKILLS.md) | 12-step contributor walkthrough |
| [FAQ](FAQ.md) | 50+ answers covering all platforms |
| [Changelog](CHANGELOG.md) | Version history |

---

## Contributing

See [ADDING-NEW-SKILLS.md](ADDING-NEW-SKILLS.md) for the full process. The short version:

1. `node scripts/new-skill.js <name> --category <core|reports|monitoring|advanced|meta> --title "…" --desc "…"` — scaffolds `SKILL.md` with the full output contract and wires the skill into the site, READMEs, cross-AI configs, and CHANGELOG
2. Write the analysis in `plugins/us-stock-analysis/skills/<name>/SKILL.md`, then `node scripts/sync-prompts.js <name>` — `prompts/<name>.md` is generated from it (skills are auto-discovered; no `plugin.json` change)
3. Run `npm test` — structure, prompt sync, skill contract, counts, and install script must all pass

[Open an issue](https://github.com/yennanliu/InvestSkill/issues) to report bugs · [Start a discussion](https://github.com/yennanliu/InvestSkill/discussions) to propose features.

---

**Version:** 1.11.0 · **Frameworks:** 30 analysis frameworks (+ 3 aliases, 1 output tool) · **Skills:** 34 · **Platforms:** 7 · **License:** MIT · **Tests:** all passing

---

<div align="center">

*For educational and research purposes only. Not financial advice.*  
*Always consult a qualified financial advisor before making investment decisions.*

</div>
