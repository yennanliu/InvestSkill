# InvestSkill for Cursor

Professional investment analysis rules for Cursor IDE: 34 analysis frameworks as universal prompts, plus 3 aliases and 2 output tools (`report-generator`, `basket-report`).

**For other platforms**, see [README.md](README.md).

---

## Quick Start

### Install — one command

Run this in the project where you want the frameworks:

```bash
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a cursor
```

It writes `.cursor/rules/investskill.mdc` (auto-loaded by Cursor) and copies every framework into `.investskill/prompts/`. If a rule file already exists it is appended to, never overwritten; re-running is a no-op. Add `-g` to install for your user instead of one project.

### Or work inside a clone of the repo

```bash
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill
cursor .
```

The repo ships its own `.cursor/rules/invest-skill.mdc`, and the prompts are in `prompts/` — use `@prompts/<name>.md` instead of `@.investskill/prompts/<name>.md` in the examples below.

### First analysis

In Cursor's AI chat:

```
@.investskill/prompts/stock-eval.md Evaluate Apple (AAPL)
```

Or just ask — the rule tells Cursor the frameworks exist:

```
Run the bear-case framework on Tesla
```

---

## All Frameworks

### Core Stock Analysis (5)
| Framework | Usage |
|-----------|-------|
| Stock Evaluation | `@.investskill/prompts/stock-eval.md AAPL` |
| Technical Analysis | `@.investskill/prompts/technical-analysis.md TSLA` |
| Stock Valuation | `@.investskill/prompts/stock-valuation.md MSFT` |
| Economics Analysis | `@.investskill/prompts/economics-analysis.md` |
| Head-to-Head Compare | `@.investskill/prompts/compare.md AAPL MSFT GOOGL` |

### Financial Reports (5)
| Framework | Usage |
|-----------|-------|
| Financial Report Analyst | `@.investskill/prompts/financial-report-analyst.md AAPL 10-K` |
| 10-K Digest | `@.investskill/prompts/10k-digest.md AAPL FY2024 --lang zh-TW` |
| Earnings Call Analysis | `@.investskill/prompts/earnings-call-analysis.md AAPL` + transcript |
| Forensic Accounting | `@.investskill/prompts/forensic-accounting.md XYZ` |
| Credit Check | `@.investskill/prompts/credit-check.md XYZ` |

### Market Monitoring (4)
| Framework | Usage |
|-----------|-------|
| Insider Trading | `@.investskill/prompts/insider-trading.md TSLA` |
| Institutional Ownership | `@.investskill/prompts/institutional-ownership.md META` |
| Dividend Analysis | `@.investskill/prompts/dividend-analysis.md JNJ` |
| Short Interest | `@.investskill/prompts/short-interest.md GME` |

### Advanced Research (15)
| Framework | Usage |
|-----------|-------|
| Competitor Analysis | `@.investskill/prompts/competitor-analysis.md AAPL` |
| Industry Map | `@.investskill/prompts/industry-map.md "AI compute"` |
| Options Analysis | `@.investskill/prompts/options-analysis.md AAPL` |
| Portfolio Review | `@.investskill/prompts/portfolio-review.md` + holdings |
| Sector Analysis | `@.investskill/prompts/sector-analysis.md` |
| Stock Screener | `@.investskill/prompts/stock-screener.md AAPL,MSFT,NVDA,AMD` |
| Catalyst Calendar | `@.investskill/prompts/catalyst-calendar.md NVDA` |
| Bear Case | `@.investskill/prompts/bear-case.md TSLA` |
| Position Ladder | `@.investskill/prompts/position-ladder.md NVDA` |
| Thesis Tracker | `@.investskill/prompts/thesis-tracker.md AAPL` |
| ETF Analysis | `@.investskill/prompts/etf-analysis.md VOO` |
| Earnings Preview | `@.investskill/prompts/earnings-preview.md AAPL` |
| Tax Lens | `@.investskill/prompts/tax-lens.md` + position or portfolio |
| Risk Stress Test | `@.investskill/prompts/risk-stress-test.md` + holdings |
| Trade Post-Mortem | `@.investskill/prompts/trade-postmortem.md` + closed trade(s) |

### Meta & Output (5 + 2 output tools)
| Framework | Usage |
|-----------|-------|
| Full Report | `@.investskill/prompts/full-report.md AAPL --depth standard` |
| Chart Master | `@.investskill/prompts/chart-master.md` + data |
| Result Validator | `@.investskill/prompts/result-validator.md` + an analysis |
| Fact-Check | `@.investskill/prompts/fact-check.md` + a report |
| Learning Coach | `@.investskill/prompts/learning-coach.md` + an analysis |
| Report Generator (output tool) | `@.investskill/prompts/report-generator.md` + an analysis |
| Basket Report (output tool) | `@.investskill/prompts/basket-report.md MU MRVL SNDL` |

### Aliases (3, not counted as frameworks)
`fundamental-analysis` → `stock-eval` · `dcf-valuation` → `stock-valuation` · `research-bundle` → `full-report`. They still work, but use the target skill for new work.

---

## Usage Examples

**Paste your own data** (the most accurate way to work):
```
@.investskill/prompts/financial-report-analyst.md
[paste 10-Q or annual report text]
Extract red flags and management quality indicators
```

**Compare stocks:**
```
@.investskill/prompts/compare.md AAPL MSFT GOOGL — which one, and why?
```

**Review a portfolio:**
```
@.investskill/prompts/portfolio-review.md Review my portfolio:
AAPL 30% · MSFT 25% · NVDA 20% · JNJ 15% · TSLA 10%
```

**Chain frameworks in one chat:**
```
1. @.investskill/prompts/stock-eval.md for NVDA
2. @.investskill/prompts/technical-analysis.md for NVDA
3. @.investskill/prompts/bear-case.md for NVDA
Synthesize into one investment view.
```

**Follow up on assumptions** — Cursor keeps the conversation context:
```
@.investskill/prompts/stock-valuation.md Value Microsoft
→ What if revenue growth slows to 8%? How sensitive is the value to WACC?
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

**Rules not loading?**
1. Check the rule file exists: `.cursor/rules/investskill.mdc` (installer) or `.cursor/rules/invest-skill.mdc` (repo clone).
2. Make sure Cursor has that folder open as the workspace root.
3. Restart Cursor.
4. Ask "What InvestSkill frameworks are available?" — Cursor should list them.

**`@` references not resolving?** After `install.sh` the prompts live in `.investskill/prompts/`, not `prompts/`. File names use hyphens (`stock-eval.md`).

**Updating:** re-run the install command; it refreshes `.investskill/prompts/`.

More answers in the [FAQ](FAQ.md).

---

## More

- [README.md](README.md) — all platforms
- [PLATFORM-COMPATIBILITY.md](PLATFORM-COMPATIBILITY.md) — feature matrix
- [Cookbook](https://yennj12.js.org/InvestSkill/cookbook.html) — walkthroughs and examples
- [CHANGELOG.md](CHANGELOG.md) — what's new in each version
- Issues: https://github.com/yennanliu/InvestSkill/issues · Discussions: https://github.com/yennanliu/InvestSkill/discussions

---

**Educational analysis only — not financial advice.** Consult a qualified advisor, do your own research, and verify the analysis independently.
