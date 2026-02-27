# InvestSkill Cookbook

Practical examples, setup guide, and core concepts for getting the most out of InvestSkill.

> 📖 [English](COOKBOOK.md) | [繁體中文](COOKBOOK-zh-TW.md)

---

## Table of Contents

1. [Setup Guide](#1-setup-guide)
2. [Core Concepts](#2-core-concepts)
3. [Demo Examples & Sample Output](#3-demo-examples--sample-output)
   - [Stock Evaluation](#31-stock-evaluation)
   - [DCF Valuation](#32-dcf-valuation)
   - [Financial Report Analysis](#33-financial-report-analysis)
   - [Research Bundle](#34-research-bundle)
   - [Technical Analysis](#35-technical-analysis)
4. [Cross-AI Usage](#4-cross-ai-usage)
5. [Tips & Best Practices](#5-tips--best-practices)

---

## 1. Setup Guide

### Prerequisites

- [Claude Code](https://code.claude.com) installed (`npm install -g @anthropic-ai/claude-code`)
- An active Anthropic API key

### Install InvestSkill (2 minutes)

```bash
# Step 1: Open Claude Code
claude

# Step 2: Add the marketplace
/plugin marketplace add yennanliu/InvestSkill

# Step 3: Install the plugin
/plugin install us-stock-analysis@invest-skill

# Step 4: Verify installation
/plugin list
```

You should see `us-stock-analysis` in the list with 18 available skills.

### Quick Test

```bash
# Test with a stock you know
/us-stock-analysis:stock-eval AAPL
```

If you see analysis output with a BULLISH/NEUTRAL/BEARISH signal block, you're ready to go.

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill

# Open Claude Code in the project directory
claude

# Add local marketplace (use your actual path)
/plugin marketplace add /path/to/InvestSkill

# Install from local source
/plugin install us-stock-analysis@invest-skill
```

### Updating to the Latest Version

```bash
# Remove the existing installation
/plugin uninstall us-stock-analysis

# Re-add marketplace (refreshes to latest version)
/plugin marketplace add yennanliu/InvestSkill

# Re-install
/plugin install us-stock-analysis@invest-skill
```

---

## 2. Core Concepts

### What InvestSkill Is

InvestSkill is a collection of **structured analysis prompt frameworks** packaged as a Claude Code plugin. Each skill is a detailed instruction set that tells Claude Code exactly how to analyze a stock, interpret financial data, and present findings in a consistent format.

Think of each skill as a **specialized analyst** you can summon with a command:

| Command | What it does |
|---------|-------------|
| `/stock-eval AAPL` | Holistic evaluation: quality, valuation, moat, risk |
| `/dcf-valuation NVDA` | Rigorous intrinsic value model with 3 scenarios |
| `/stock-valuation MSFT` | Multi-method valuation: DCF + comps + EV multiples |
| `/financial-report-analyst GOOGL 10-K` | Deep-read an annual filing, find red flags |
| `/research-bundle TSLA` | Run all skills in sequence, synthesize into one thesis |

### How Skills Work

Each skill is defined by a `SKILL.md` file containing:

1. **Description** (frontmatter): One-line summary used by the plugin system
2. **Methodology**: Step-by-step analysis framework with tables, scoring, and formulas
3. **Output format**: Standardized sections Claude Code follows
4. **Signal block**: Required at the end of every analysis

```
plugins/us-stock-analysis/skills/
├── stock-eval/SKILL.md
├── dcf-valuation/SKILL.md
├── stock-valuation/SKILL.md        ← new v1.3.0
├── financial-report-analyst/SKILL.md  ← new v1.3.0
└── ... (18 skills total)
```

### The Signal Block

Every InvestSkill analysis ends with a standardized signal block for quick decision-making:

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

**Score guide:**
- 8.0–10.0 → Strongly Bullish
- 6.0–7.9  → Moderately Bullish
- 4.0–5.9  → Neutral
- 2.0–3.9  → Moderately Bearish
- 0.0–1.9  → Strongly Bearish

### Universal Prompts (Cross-AI)

Every skill is also available as a standalone prompt file in the `prompts/` directory. These work with **any AI assistant** — not just Claude Code:

```
prompts/
├── stock-eval.md
├── dcf-valuation.md
├── stock-valuation.md
├── financial-report-analyst.md
└── ... (17 files)
```

Use them by copying the file content into any AI chat as a system prompt.

---

## 3. Demo Examples & Sample Output

> **Note**: The outputs below are representative examples showing the format and depth of analysis. Actual outputs use real-time data and will differ.

### 3.1 Stock Evaluation

**Command:**
```bash
/us-stock-analysis:stock-eval MSFT
```

**Sample Output:**

```
# US Stock Evaluation — MSFT (Microsoft Corporation)

## Company Overview
Microsoft is a diversified technology company with three major segments:
- Intelligent Cloud (Azure, server products): 43% of revenue, highest growth
- Productivity & Business Processes (Office 365, LinkedIn, Dynamics): 32%
- More Personal Computing (Windows, Xbox, Surface): 25%

Dominant moat: Azure platform lock-in, Office 365 subscription stickiness, enterprise
relationships. Switching costs are extremely high across all segments.

## Financial Health

Revenue Growth (5-yr CAGR):  15.8%
Gross Margin:                 70.1%  (expanding: +180 bps YoY)
Operating Margin:             44.6%  (expanding: +120 bps YoY)
FCF Margin:                   37.2%
Net Cash Position:            $27.4B (net cash — fortress balance sheet)

## Valuation Metrics

| Metric       | Current | 1Y Ago | 5Y Avg | Sector Avg |
|--------------|---------|--------|--------|------------|
| P/E (FWD)    | 32.4x   | 28.1x  | 30.2x  | 26.8x      |
| EV/EBITDA    | 24.1x   | 21.5x  | 22.8x  | 18.4x      |
| EV/FCF       | 41.2x   | 37.8x  | 36.5x  | 28.1x      |
| Price/Sales  | 12.8x   | 10.9x  | 11.6x  | 7.2x       |

Premium to sector justified by: superior margin profile, cloud growth trajectory, AI optionality (Copilot, Azure OpenAI).

## Quality Scoring

Piotroski F-Score:    8/9   (Strong — failed only on DTC/shares outstanding)
ROIC:                 28.4%
WACC (estimated):     8.9%
ROIC − WACC Spread:   +1,950 bps  (significant value creation)

## DCF Quick Range

Base Case IV:   $385–$420 per share
Bear Case IV:   $295–$320 per share
Bull Case IV:   $480–$530 per share
Current Price:  $422.14
Margin of Safety (Base): Fairly valued — modest premium to base

## Risk Matrix

| Risk Category     | Level | Key Concern                              |
|-------------------|-------|------------------------------------------|
| Valuation Risk    | MED   | Premium multiple requires continued execution |
| Business/Comp     | LOW   | Durable moat; AWS and Google as cloud peers |
| Financial/Leverage| LOW   | Net cash, investment-grade rating         |
| Regulatory/Legal  | MED   | EU antitrust scrutiny, Activision integration |
| Macro/Sector      | MED   | Enterprise IT spending sensitivity        |

## Investment Thesis
Microsoft's AI-driven product suite (Copilot, Azure OpenAI) positions it to capture
disproportionate value from enterprise AI adoption. Cloud segment (Azure) growing 28%
YoY with improving margins. Valuation is fair-to-slightly-premium, but justified by
quality of business and multi-year AI tailwind.

## Bear Case
Multiple compression if Azure growth decelerates below 20%, or if AI monetization
disappoints vs. current embedded expectations. EU regulatory risk on bundling practices.

╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BULLISH                         ║
║ Confidence:  MEDIUM                          ║
║ Horizon:     LONG-TERM                       ║
║ Score:       7.2 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      BUY                             ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

---

### 3.2 DCF Valuation

**Command:**
```bash
/us-stock-analysis:dcf-valuation NVDA --scenarios
```

**Sample Output (condensed):**

```
# DCF Valuation — NVDA (NVIDIA Corporation)

## Base Metrics (TTM)
Revenue:              $122.0B    FCF:         $60.8B
FCF Margin:           49.8%      Net Cash:    $38.5B
SBC (TTM):            $3.5B      True FCF*:   $57.3B
Shares Outstanding:   24.4B      *SBC-adjusted

## WACC Calculation
Cost of Equity: Rf 4.4% + β 1.72 × ERP 5.5% = 13.9%
Cost of Debt (after-tax): 1.6%
Capital Structure: 99.2% equity / 0.8% debt
WACC: 13.8%

## Scenario Assumptions

| Scenario | Probability | Rev CAGR Y1-5 | Rev CAGR Y6-10 | FCF Margin Y10 | Terminal g |
|----------|-------------|---------------|----------------|----------------|------------|
| Bull     | 20%         | 42%           | 18%            | 48%            | 3.0%       |
| Base     | 60%         | 28%           | 10%            | 40%            | 2.5%       |
| Bear     | 20%         | 12%           | 5%             | 28%            | 1.5%       |

## Intrinsic Value Results

| Scenario | IV per Share | vs. Current ($875) | MoS      |
|----------|--------------|--------------------|----------|
| Bull     | $1,240       | +41.7%             | Discount |
| Base     | $785         | −10.3%             | Premium  |
| Bear     | $320         | −63.4%             | Premium  |
| Weighted | $768         | −12.2%             | Premium  |

TV as % of EV (Base): 68% — within acceptable range

## Sensitivity Table (Base Scenario, $ per share)

              Terminal Growth Rate
WACC     1.5%    2.0%    2.5%    3.0%    3.5%
11.0%    $910    $960   $1,020  $1,090  $1,180
12.0%    $830    $875    $920    $975   $1,040
13.8%    $710    $745    $785    $825    $875  ← Base Case
15.0%    $625    $655    $685    $720    $760
16.0%    $570    $595    $620    $650    $685

## Assessment
At current price of $875, NVDA trades at a 12% premium to base-case IV.
Bull case requires: AI capex cycle sustained for 5+ years, market share maintenance.
Bear case risk: cloud customer digestion, competition from AMD MI300X, custom silicon.
The weighted IV suggests modest overvaluation — position sizing discipline warranted.

╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      NEUTRAL                         ║
║ Confidence:  MEDIUM                          ║
║ Horizon:     LONG-TERM                       ║
║ Score:       5.8 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      HOLD                            ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

---

### 3.3 Financial Report Analysis

**Command:**
```bash
/us-stock-analysis:financial-report-analyst AAPL 10-K --section md&a
```

**Sample Output (condensed):**

```
# Financial Report Analysis — AAPL 10-K (FY2024)

## Document Orientation
Filing Type:    10-K Annual Report (FY ended September 28, 2024)
Auditor:        Ernst & Young LLP — Unqualified Opinion
Filed:          October 25, 2024 (on time)
Restatements:   None

## Financial Health Dashboard
┌──────────────────────────┬──────────────────────────────────────┐
│ Revenue Growth           │ +2.0% YoY ($391.0B)                  │
│ Gross Margin             │ 46.2% (vs. prior 44.1%, +210 bps)    │
│ Operating Margin         │ 31.5% (vs. prior 29.8%, +170 bps)    │
│ FCF Margin               │ 27.8% (conversion: 108%)             │
│ Net Cash                 │ $54.5B (Debt/EBITDA: 0.7x)           │
│ DSO                      │ 26.1 days (vs. 27.8 days prior)      │
│ Management Tone          │ Positive — confident on Services       │
├──────────────────────────┼──────────────────────────────────────┤
│ Filing Quality Score     │ 9.2 / 10                             │
│ Earnings Quality Score   │ 8.8 / 10                             │
│ Balance Sheet Score      │ 9.5 / 10                             │
└──────────────────────────┴──────────────────────────────────────┘

## Key Positives (Bullish Signals)
• Services segment hit $96.2B (+13% YoY) — recurring, high-margin revenue stream growing
  as % of total, structurally improving overall margins
• Gross margin expanded 210 bps YoY — favorable product mix (iPhone Pro uptake, Services)
• FCF conversion >100% — high quality earnings with minimal working capital drag
• DSO improved by 1.7 days — healthy receivables management
• Apple Intelligence (AI) mentioned 47x in MD&A — clear strategic priority with ecosystem lock-in

## Key Negatives / Red Flags
• China revenue declined 8% YoY ($66.9B) — geopolitical and local competition risk (RISK: HIGH)
• iPad and Mac segments both down YoY — hardware upgrade cycle lengthening (RISK: MEDIUM)
• EU Digital Markets Act compliance costs and forced App Store changes — structural margin risk (RISK: MEDIUM)
• SBC at $11.7B (3.0% of revenue) — elevated but manageable (RISK: LOW)

## Risk Factor Changes (vs. Prior 10-K)
NEW Risks Added:
  1. Artificial Intelligence regulation — EU AI Act compliance
  2. Digital Markets Act — third-party app store access in EU

ELEVATED Risks:
  1. China competition — Huawei Mate series recovered significantly; language strengthened
  2. App Store antitrust — new DOJ investigation language added

## Accounting Quality Score
| Criterion                   | Score | Notes                                         |
|-----------------------------|-------|-----------------------------------------------|
| Revenue recognition clarity | 3/3   | Clear, ASC 606 compliant, no changes          |
| Non-GAAP reconciliation     | 3/3   | Minimal non-GAAP usage, clean reconciliation  |
| FCF conversion rate         | 3/3   | 108% — excellent                              |
| Working capital trends      | 3/3   | DSO improving, inventory lean                 |
| Footnote transparency       | 2/3   | China exposure disclosure remains high-level  |
| Auditor opinion             | 3/3   | Clean unqualified opinion                     |
| Related party transactions  | 2/3   | Tim Cook real estate lease (minor)            |
| Total                       | 19/21 | High quality filing                           |

╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BULLISH                         ║
║ Confidence:  HIGH                            ║
║ Horizon:     LONG-TERM                       ║
║ Score:       7.8 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      BUY                             ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

---

### 3.4 Research Bundle

**Command:**
```bash
/us-stock-analysis:research-bundle AMZN
```

**Sample Output (condensed):**

```
# Research Bundle — AMZN (Amazon.com, Inc.)

## Phase 1: Business Quality Assessment
Competitor Analysis: Economic moat = WIDE (score: 8.5/10)
  - AWS: 31% cloud market share, 37% operating margin, high switching costs
  - Prime ecosystem: 200M+ subscribers, flywheel creates structural advantages
  - Advertising: $50B+ segment growing 20%+, highest margin business
Fundamental Analysis: Financial Strength = 7.8/10
  - Revenue: $590B | FCF: $54B (FCF margin: 9.1%, expanding rapidly)
  - Net cash position of $47B provides strategic flexibility

Business Quality Score: 8.1/10 → Excellent

## Phase 2: Valuation Assessment
DCF Base Case IV:    $208/share  |  Current: $224  |  Premium: 7.7%
Stock-eval Comps:    P/E 37x (FWD), EV/EBITDA 21x — peer-aligned
Price Target Range:  $195 (Bear) — $224 (Base) — $275 (Bull)
Valuation Score:     6.2/10  → Fairly Valued with Slight Premium

## Phase 3: Market Signals
Insider:         CEO Andy Jassy: no open market purchases; routine 10b5-1 sales
Institutional:   13F data shows Vanguard/BlackRock accumulating; net inflows Q3
Earnings Call:   Management tone CONFIDENT; AWS acceleration emphasized;
                 guidance specific with revenue +8-10% next quarter
Market Signal Score: 7.5/10 → Positive

## Phase 4: Technical Setup
Price above 50-day and 200-day MA; recent breakout from consolidation
RSI: 58 (neutral momentum, not overbought)
Support: $205 | Resistance: $240
Volume: Accumulation pattern visible
Technical Setup: MODERATE → 6.0/10

## Phase 5: Risk Assessment
Short Float: 1.9% — negligible short interest
Options: Implied Vol at 31% (near 1-year low — complacent market)
Risk Profile: LOW → Score: 8.0/10

## Composite Scorecard

| Component       | Weight | Sub-Score | Contribution |
|-----------------|--------|-----------|--------------|
| Business Quality| 25%    | 8.1       | 2.03         |
| Valuation       | 25%    | 6.2       | 1.55         |
| Market Signals  | 20%    | 7.5       | 1.50         |
| Technical Setup | 15%    | 6.0       | 0.90         |
| Risk Profile    | 15%    | 8.0       | 1.20         |
| COMPOSITE       | 100%   | 7.18/10   |              |

**Interpretation: BUY (most signals positive, fair entry)**

## Investment Thesis
Amazon's AWS recovery (re-accelerating to 19% growth) combined with the highest-margin
advertising business scaling to $50B+ creates a powerful earnings leverage story over
the next 3 years. The retail segment, long a drag, is inflecting toward profitability
as fulfillment optimization matures. AWS operating income alone covers the current
enterprise value at a reasonable multiple.

## Bull Case (3 reasons)
1. AWS re-acceleration to 25%+ growth as AI workloads migrate to cloud
2. Advertising reaching 15%+ operating margins, doubling EPS contribution
3. International retail becoming cash-generative as localization matures

## Bear Case (3 risks)
1. AWS margin compression if AI compute costs outpace revenue growth
2. FTC antitrust action forcing structural changes to Prime/marketplace model
3. Consumer spending slowdown disproportionately hits discretionary ecommerce

## Entry Strategy
Ideal entry: $205–$215 (key support zone on pullback)
Current entry ($224): Acceptable for long-term; wait for better setup if possible
Position sizing: 3–5% of portfolio for high-conviction long-term hold

## Exit Strategy
Bull target: $275 (12-18 months, on AWS acceleration confirmation)
Base target: $250 (12 months)
Stop loss: $195 (below key support, thesis re-evaluation required)

╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BULLISH                         ║
║ Confidence:  MEDIUM                          ║
║ Horizon:     LONG-TERM                       ║
║ Score:       7.2 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      BUY                             ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

---

### 3.5 Technical Analysis

**Command:**
```bash
/us-stock-analysis:technical-analysis TSLA --chart
```

**Sample Output (condensed):**

```
# Technical Analysis — TSLA (Tesla, Inc.)

## Trend Analysis
Primary Trend:    BEARISH (price below 200-day MA)
Secondary Trend:  NEUTRAL (consolidating above 50-day MA)
Short-Term:       BULLISH (price reclaimed 20-day MA, RSI recovering)
MTF Alignment:    MIXED → proceed with caution

## Key Levels
Support 1:  $195 — Strong (tested 4x, accumulation zone)
Support 2:  $175 — Very Strong (multi-year demand level)
Resistance: $240 — Strong (prior breakdown point, now overhead)
Resistance: $265 — Medium (50-week MA)
52W Range:  $138.80 (Low) — $299.29 (High)

## Indicator Signals

| Indicator      | Value    | Signal    | Note                               |
|----------------|----------|-----------|------------------------------------|
| RSI (14)       | 48.2     | NEUTRAL   | Mid-range, recovering from oversold|
| MACD           | −2.1     | NEUTRAL   | Crossover pending, histogram shrinking |
| Bollinger Bands| Mid-band | NEUTRAL   | Price at mid, bandwidth contracting|
| Volume         | Below avg| NEUTRAL   | Declining volume on bounce (weak)  |
| OBV            | Declining| BEARISH   | Distribution pattern visible       |
| Stochastic     | 42       | NEUTRAL   | Mid-range, no clear signal         |

## Pattern Recognition
Potential pattern: Descending triangle (bearish continuation)
Neckline: $195 — break below = target ~$155
Alternative: If $195 holds and $240 breaks, inverse H&S forming (bullish)

## Trade Setup
Conservative entry: $197–$202 (near support on confirmed volume)
Stop loss: $188 (below support — invalidates thesis)
Target 1: $240 (resistance)   Risk/Reward: 1:3.5
Target 2: $265 (extended)     Risk/Reward: 1:6.0
Horizon: Swing trade (4–8 weeks)

╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      NEUTRAL                         ║
║ Confidence:  LOW                             ║
║ Horizon:     SHORT-TERM                      ║
║ Score:       4.5 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      HOLD                            ║
║ Conviction:  WEAK                            ║
╚══════════════════════════════════════════════╝
```

---

## 4. Cross-AI Usage

InvestSkill works with any AI assistant. The `prompts/` directory contains all 17 analysis frameworks as standalone files.

### Gemini CLI

```bash
# GEMINI.md is automatically loaded by Gemini CLI
cd /path/to/InvestSkill
gemini

# Reference a prompt directly
> @prompts/stock-valuation.md Analyze AAPL using all valuation methods

# Paste a 10-K section for analysis
> @prompts/financial-report-analyst.md
> [paste your 10-K text here]
```

### GitHub Copilot

The `.github/copilot-instructions.md` file is automatically loaded as workspace context.

```
# In Copilot Chat (VSCode or github.com)
Analyze NVDA using the stock-valuation framework

# Reference a specific prompt
Use the framework in @workspace /prompts/dcf-valuation.md to value MSFT
```

### Cursor

The `.cursor/rules/invest-skill.mdc` file is auto-applied in Cursor.

```
# Cursor AI Chat
@prompts/fundamental-analysis.md Analyze GOOGL's financial statements

# Or just ask naturally — Cursor knows the frameworks
Run a DCF valuation of AMZN using the InvestSkill methodology
```

### Any AI (ChatGPT, Claude.ai, etc.)

```bash
# 1. Copy the content of any prompt file
cat prompts/stock-eval.md | pbcopy   # macOS

# 2. Paste into any AI chat as a system prompt or at conversation start

# 3. Ask your question
"Analyze AAPL using this framework"
```

---

## 5. Tips & Best Practices

### Getting Better Results

**Be specific about the company and context:**
```bash
# Good
/stock-eval NVDA                    # Clear ticker
/dcf-valuation MSFT --scenarios     # With flag for richer output
/research-bundle AAPL --visual      # Visual output for reports

# Even better — add context
/financial-report-analyst AAPL      # Then paste the actual 10-K text
```

**Use `--visual` for report generation:**
```bash
/fundamental-analysis NVDA --visual
# Then pipe to report generator:
/report-generator --type comprehensive
```

**Chain skills for deeper analysis:**
```bash
# Step 1: Get the fundamentals
/fundamental-analysis MSFT

# Step 2: Value the business
/dcf-valuation MSFT --scenarios

# Step 3: Check competitive position
/competitor-analysis MSFT

# Step 4: Or run everything at once
/research-bundle MSFT
```

### Choosing the Right Skill

| Your Question | Best Skill |
|---------------|-----------|
| "Is this stock cheap or expensive?" | `/dcf-valuation` + `/stock-valuation` |
| "Is this a good business?" | `/stock-eval` + `/competitor-analysis` |
| "What's in this earnings report?" | `/financial-report-analyst` |
| "What are insiders doing?" | `/insider-trading` |
| "Is this dividend safe?" | `/dividend-analysis` |
| "Where is the stock technically?" | `/technical-analysis` |
| "Full deep-dive before I invest" | `/research-bundle` |
| "Is this a squeeze candidate?" | `/short-interest` |

### Interpreting Signal Scores

The 0–10 score is a composite that should be used as **one input**, not a definitive answer:

- **Score 8+**: Strong conviction. Multiple signals aligned. Still requires risk management.
- **Score 6–8**: Moderate conviction. Mostly positive with some concerns. Appropriate for normal position sizing.
- **Score 4–6**: Neutral. Mixed signals. Consider waiting for clarity or reducing position size.
- **Score 2–4**: Bearish lean. More concerns than positives. Avoid new long positions.
- **Score < 2**: Strong bear case. Multiple red flags. Consider avoiding or hedging.

### Using with Real Financial Data

For best results, provide the AI with actual data:

1. **Paste financial statements** from the company's IR page
2. **Attach 10-K/10-Q PDFs** when using the `financial-report-analyst` skill
3. **Provide specific numbers** (revenue, margins, share count) for DCF accuracy
4. **Reference earnings call transcripts** with the `earnings-call-analysis` skill

---

## Disclaimer

InvestSkill provides educational analysis frameworks only. Nothing in this project constitutes financial advice. All outputs are AI-generated analyses based on the methodologies embedded in the skills — they are not guarantees of future performance. Always consult a qualified financial advisor before making investment decisions.
