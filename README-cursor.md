# InvestSkill for Cursor

Professional investment analysis rules for Cursor IDE. 18 universal prompts for comprehensive stock market evaluation.

**For multi-platform setup**, see [README.md](README.md)

---

## Quick Start

### Installation

Cursor automatically loads rules from `.cursor/rules/` directory.

```bash
# Clone repository
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill

# Open in Cursor
cursor .

# Open AI Chat (Cmd+K)
# Rules auto-loaded!
```

### First Analysis

In Cursor AI Chat:

```
@prompts/stock-eval.md Evaluate Apple (AAPL) stock
```

Or just ask naturally:

```
Analyze Apple stock using Piotroski F-Score
```

---

## All 18 Frameworks

### Core Analysis (6)
| Framework | Usage |
|-----------|-------|
| Stock Evaluation | `@prompts/stock-eval.md AAPL` |
| Stock Valuation | `@prompts/stock-valuation.md MSFT` |
| Fundamental Analysis | `@prompts/fundamental-analysis.md NVDA` |
| Technical Analysis | `@prompts/technical-analysis.md TSLA` |
| DCF Valuation | `@prompts/dcf-valuation.md GOOGL` |
| Economics Analysis | `@prompts/economics-analysis.md` |

### Financial Reports (2)
| Framework | Usage |
|-----------|-------|
| Financial Report Analyst | `@prompts/financial-report-analyst.md` |
| Earnings Call Analysis | `@prompts/earnings-call-analysis.md AAPL` |

### Market Monitoring (4)
| Framework | Usage |
|-----------|-------|
| Insider Trading | `@prompts/insider-trading.md TSLA` |
| Institutional Ownership | `@prompts/institutional-ownership.md META` |
| Dividend Analysis | `@prompts/dividend-analysis.md JNJ` |
| Short Interest | `@prompts/short-interest.md GME` |

### Advanced Analysis (4)
| Framework | Usage |
|-----------|-------|
| Competitor Analysis | `@prompts/competitor-analysis.md AAPL` |
| Options Analysis | `@prompts/options-analysis.md AAPL` |
| Portfolio Review | `@prompts/portfolio-review.md` |
| Sector Analysis | `@prompts/sector-analysis.md` |

### Comprehensive Research (2)
| Framework | Usage |
|-----------|-------|
| Research Bundle | `@prompts/research-bundle.md AAPL` |
| (All frameworks combined) | Multi-framework analysis |

---

## Usage Examples

### Using File References

**File reference syntax:**
```
@prompts/<name>.md <your-query>
```

**Examples:**
```
@prompts/stock-eval.md Evaluate Microsoft (MSFT) quality and profitability

@prompts/stock-valuation.md What's a fair price for Apple stock?

@prompts/fundamental-analysis.md Deep dive into NVIDIA's financial health

@prompts/technical-analysis.md Analyze Tesla's chart patterns and key levels

@prompts/dcf-valuation.md Build a DCF model for Google with 5-year projection
```

### Using Natural Language

Cursor understands the frameworks context, so you can ask naturally:

```
Perform a stock evaluation of Apple using Piotroski F-Score

What's the intrinsic value of Microsoft using DCF analysis?

Analyze the competitive moat of NVIDIA

Is the Berkshire Hathaway dividend safe?

What's the short squeeze potential in GameStop?

Should I buy or sell Tesla at current levels?
```

### With Pasted Data

**Paste financial statements:**
```
@prompts/fundamental-analysis.md
[paste balance sheet, income statement, cash flow]

Analyze the financial quality and key trends
```

**Paste SEC filings:**
```
@prompts/financial-report-analyst.md
[paste 10-Q or annual report text]

Extract red flags and management quality indicators
```

**Paste earnings transcripts:**
```
@prompts/earnings-call-analysis.md
[paste earnings call transcript]

What's the management tone and guidance outlook?
```

### Stock Comparison

```
@prompts/stock-valuation.md Compare AAPL vs MSFT valuations

@prompts/fundamental-analysis.md Compare AAPL and MSFT balance sheets

@prompts/research-bundle.md Comprehensive comparison of AAPL, MSFT, and GOOGL
```

### Portfolio Analysis

```
@prompts/portfolio-review.md Review my portfolio:
AAPL: 30%
MSFT: 25%
NVDA: 20%
JNJ: 15%
TSLA: 10%

Is my allocation optimal?
```

---

## Features

✅ **18 Professional Analysis Frameworks**
- Automatically loaded into Cursor AI
- Work across all Cursor capabilities
- No additional setup required

✅ **File Reference Support**
- Use `@prompts/<name>.md` to invoke frameworks
- Cursor highlights available files
- Intellisense support

✅ **Natural Language Understanding**
- Cursor applies rules context automatically
- Ask questions naturally
- Framework context used behind the scenes

✅ **Data Integration**
- Paste financial statements
- Upload or paste SEC filings
- Reference documents directly

✅ **Project-Wide Context**
- Rules loaded for entire workspace
- Same frameworks across all files
- Persistent settings

---

## Installation & Troubleshooting

### Verify Rules Loaded

Check that Cursor loaded rules by asking:
```
What analysis frameworks are available?
```

Cursor should mention the 18 frameworks and `.cursor/rules/invest-skill.mdc`.

### Rule File Check

Verify rule file exists:
```
.cursor/rules/invest-skill.mdc
```

If missing:
```bash
# Copy from repo
cp .cursor/rules/invest-skill.mdc /your/project/.cursor/rules/
```

### Clear Cache (if needed)

```bash
# Restart Cursor
cmd+q  (or close application)

# Reopen project
cursor .
```

### IDE Support

Works with:
- ✅ Cursor (all versions)
- ✅ VS Code with Cursor extension
- ✅ JetBrains IDEs with Cursor plugin

---

## Advanced Usage

### Multi-Framework Analysis

Combine frameworks in one query:

```
1. First, use stock-eval.md to evaluate NVDA quality
2. Then, use technical-analysis.md for chart patterns
3. Finally, use institutional-ownership.md for smart money positioning

Provide a holistic investment view.
```

### Scenario Analysis

Ask follow-up questions within same chat:

```
Initial: @prompts/dcf-valuation.md Value Microsoft

Follow-ups (in same conversation):
- What if revenue growth slows to 8%?
- How sensitive is valuation to WACC assumptions?
- What's the downside scenario?
- What's the margin of safety at current price?
```

### Custom Analysis Chains

Build your own workflow:

```
1. Evaluate quality: @prompts/stock-eval.md
2. Analyze fundamentals: @prompts/fundamental-analysis.md
3. Technical setup: @prompts/technical-analysis.md
4. Valuation: @prompts/stock-valuation.md
5. Competitive position: @prompts/competitor-analysis.md
6. Risk assessment: Generate custom risk analysis

Synthesize findings into investment thesis
```

---

## Output Format

All analyses include:

### 1. Executive Summary
- Key findings and thesis
- Primary drivers (bullish/bearish)
- Time horizon

### 2. Quantitative Analysis
- Specific metrics and numbers
- Year-over-year comparisons
- Industry benchmarking
- Valuation multiples

### 3. Qualitative Assessment
- Management quality
- Competitive positioning
- Market opportunity
- Risk factors

### 4. Investment Signal Block
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

## Tips & Best Practices

### 1. Be Specific
```
# Vague
Analyze Apple

# Better
@prompts/stock-valuation.md Analyze Apple (AAPL)

# Best
@prompts/stock-valuation.md Value AAPL with:
- Revenue growth: 8% CAGR
- WACC: 8.5%
- Terminal growth: 2.5%
```

### 2. Provide Context
```
Analyze MSFT assuming:
- Current price: $450
- Current P/E: 42x
- Industry average P/E: 28x
```

### 3. Chain Analyses
```
# Run multiple frameworks
1. @prompts/fundamental-analysis.md for NVDA
2. @prompts/technical-analysis.md for NVDA
3. @prompts/institutional-ownership.md for NVDA

Provide consolidated view
```

### 4. Ask Follow-Ups
Cursor remembers conversation context:
```
Initial: @prompts/stock-valuation.md Value Microsoft

Follow-ups:
- What if margins compress?
- How important is cloud growth?
- What's the bull/bear range?
```

### 5. Paste Raw Data
```
@prompts/fundamental-analysis.md
[paste financial data]

Analyze trends and quality
```

---

## IDE Integration

### Keyboard Shortcuts

- **Cmd+K** - Open Cursor AI Chat
- **Cmd+Shift+L** - Create new chat
- **Cmd+Option+K** - Quick reference

### File Exploration

In Cursor, you can explore:
- `.cursor/rules/invest-skill.mdc` — Rule definitions
- `prompts/` — All 18 framework files
- `PLATFORM-COMPATIBILITY.md` — Feature comparison

---

## Documentation

### Cursor Specific
- This file (README-cursor.md)
- [.cursor/rules/invest-skill.mdc](.cursor/rules/invest-skill.mdc)

### All Platforms
- [README.md](README.md) — Complete setup for all 5 platforms
- [PLATFORM-COMPATIBILITY.md](PLATFORM-COMPATIBILITY.md) — Feature comparison
- [CI-CD-GUIDE.md](CI-CD-GUIDE.md) — Release automation

### Examples & Learning
- [COOKBOOK.md](COOKBOOK.md) — Walkthroughs and examples
- [CHANGELOG.md](CHANGELOG.md) — Feature updates
- `prompts/` — Individual framework files

---

## Support & Feedback

### Report Issues
- GitHub Issues: https://github.com/yennanliu/InvestSkill/issues
- GitHub Discussions: https://github.com/yennanliu/InvestSkill/discussions

### Feature Requests
Open an issue with:
- What analysis would help
- Your use case
- Example scenario

### Troubleshooting

**Rules not loading:**
- Verify `.cursor/rules/invest-skill.mdc` exists
- Restart Cursor
- Check that rules file is not empty

**Cursor not understanding requests:**
- Be more specific with file references
- Provide more context/data
- Ask in separate messages

---

## Legal Disclaimer

This plugin provides **educational analysis only** and does **NOT constitute financial advice**.

Always:
- ✅ Consult qualified financial advisors
- ✅ Do your own research (DYOR)
- ✅ Verify analysis independently
- ✅ Consider your risk tolerance

Past performance does not guarantee future results.

---

## More Information

For complete documentation covering all platforms (Claude Code, Gemini, Copilot, Universal), see:

📖 **[README.md](README.md)**
