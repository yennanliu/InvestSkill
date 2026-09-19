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
   - [Portfolio Review](#36-portfolio-review)
   - [Earnings Call Analysis](#37-earnings-call-analysis)
   - [Dividend Analysis](#38-dividend-analysis)
   - [Chart Master](#39-chart-master)
   - [Full Report](#310-full-report)
   - [Result Validator](#311-result-validator)
   - [Workflow A live run — Pre-Earnings Deep Dive (AAPL)](#312-workflow-a--pre-earnings-deep-dive-live-run-aapl)
   - [Workflow B live run — Value Stock Screening (PFE)](#313-workflow-b--value-stock-screening-live-run-pfe)
   - [Workflow C live run — Dividend Portfolio (JNJ/ABBV/PG)](#314-workflow-c--dividend-portfolio-construction-live-run-jnj--abbv--pg)
   - [Workflow D live run — Swing Trade Setup (UPST)](#315-workflow-d--swing-trade-setup-live-run-upst)
   - [Workflow E live run — Full Investment Memo (NVDA)](#316-workflow-e--full-investment-memo-live-run-nvda)
   - [Workflow F live run — Sector Rotation (XOM/JPM)](#317-workflow-f--macro-driven-sector-rotation-live-run-july-2026-regime)
   - [Workflow G live run — Position Ladder (AVGO)](#318-workflow-g--manage-a-position-you-already-own-live-run-avgo)
4. [Practical Workflows](#4-practical-workflows)
5. [Cross-AI Usage](#5-cross-ai-usage)
6. [Tips & Best Practices](#6-tips--best-practices)

---

## 1. Setup Guide

### Prerequisites

- [Claude Code](https://code.claude.com) installed (`npm install -g @anthropic-ai/claude-code`)
- An active Anthropic API key

### Install with one command (any agent)

The installer copies the frameworks into `.investskill/prompts/` and wires up your agent's own entry point:

```bash
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a claude
# swap the agent: cursor | copilot | gemini | codex | opencode | any
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -l   # list every target
```

Add `-g` for a user-level install, `-d DIR` to target another directory, `-h` for all options.

### Install InvestSkill via the plugin marketplace (2 minutes)

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

You should see `us-stock-analysis` in the list with 28 available skills.

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
| `/portfolio-review` | Analyze allocation, performance, and rebalancing needs |
| `/earnings-call-analysis AMZN` | Parse tone, guidance, and key themes from earnings calls |
| `/dividend-analysis JNJ` | Check dividend safety, growth, and sustainability |
| `/chart-master AAPL` | Generate financial charts in Mermaid, ASCII, or HTML |
| `/full-report MSFT` | Orchestrate all 15 modules into one HTML report |
| `/result-validator` | Audit any analysis output and produce a confidence score |

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
├── stock-valuation/SKILL.md
├── financial-report-analyst/SKILL.md
├── chart-master/SKILL.md           ← v1.6.0
├── full-report/SKILL.md            ← v1.6.0
└── ... (28 skills total)
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
├── chart-master.md
├── full-report.md
└── ... (21 files)
```

Use them by copying the file content into any AI chat as a system prompt.

---

## 3. Demo Examples & Sample Output

> **Note**: **3.1–3.11** are representative examples showing the format and depth of analysis — actual outputs use real-time data and will differ.
> **3.12–3.18** are different: they are real workflow runs against real tickers with live data, dated and sourced.

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

Premium to sector justified by: superior margin profile, cloud growth trajectory,
AI optionality (Copilot, Azure OpenAI).

## Quality Scoring

Piotroski F-Score:    8/9   (Strong — failed only on DTC/shares outstanding)
ROIC:                 28.4%
WACC (estimated):     8.9%
ROIC − WACC Spread:   +1,950 bps  (significant value creation)

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

## Sensitivity Table (Base Scenario, $ per share)

              Terminal Growth Rate
WACC     1.5%    2.0%    2.5%    3.0%    3.5%
11.0%    $910    $960   $1,020  $1,090  $1,180
12.0%    $830    $875    $920    $975   $1,040
13.8%    $710    $745    $785    $825    $875  ← Base Case
15.0%    $625    $655    $685    $720    $760

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
│ FCF Margin               │ 27.8% (conversion: 108%)             │
│ Filing Quality Score     │ 9.2 / 10                             │
└──────────────────────────┴──────────────────────────────────────┘

## Key Red Flags
• China revenue declined 8% YoY — geopolitical and local competition risk (RISK: HIGH)
• EU Digital Markets Act compliance costs — structural margin risk (RISK: MEDIUM)

## Accounting Quality Score: 19/21 — High quality filing

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

## Composite Scorecard

| Component       | Weight | Sub-Score | Contribution |
|-----------------|--------|-----------|--------------|
| Business Quality| 25%    | 8.1       | 2.03         |
| Valuation       | 25%    | 6.2       | 1.55         |
| Market Signals  | 20%    | 7.5       | 1.50         |
| Technical Setup | 15%    | 6.0       | 0.90         |
| Risk Profile    | 15%    | 8.0       | 1.20         |
| COMPOSITE       | 100%   | 7.18/10   |              |

## Investment Thesis
Amazon's AWS recovery (re-accelerating to 19% growth) combined with the highest-margin
advertising business scaling to $50B+ creates a powerful earnings leverage story over
the next 3 years.

## Entry / Exit Strategy
Ideal entry: $205–$215 (key support zone on pullback)
Bull target: $275 | Base target: $250 | Stop loss: $195

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
MTF Alignment:    MIXED → proceed with caution

## Key Levels
Support 1:  $195 — Strong (tested 4x, accumulation zone)
Resistance: $240 — Strong (prior breakdown point, now overhead)

## Indicator Signals

| Indicator      | Value    | Signal    |
|----------------|----------|-----------|
| RSI (14)       | 48.2     | NEUTRAL   |
| MACD           | −2.1     | NEUTRAL   |
| OBV            | Declining| BEARISH   |

## Trade Setup
Entry: $197–$202 | Stop: $188 | Target 1: $240 (R/R: 1:3.5)

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

### 3.6 Portfolio Review

**Command:**
```bash
/us-stock-analysis:portfolio-review
# Then paste your holdings as a list:
# AAPL 18%, MSFT 15%, NVDA 12%, AMZN 10%, GOOGL 8%, BRK.B 7%, ...
```

**Sample Output (condensed):**

```
# Portfolio Review — Tech-Heavy Growth Portfolio (12 holdings)

## Executive Summary
✅ Strong long-term performance: +22.1% vs. S&P 500 +18.4% (3Y annualized)
⚠️  Concentration risk: Top 3 positions = 45% of portfolio (max recommended: 30%)
⚠️  Zero international exposure — significant geographic blind spot
⚠️  No dividend/income component — purely growth-oriented

## Performance Scorecard

| Metric             | Portfolio | S&P 500 | Delta  |
|--------------------|-----------|---------|--------|
| YTD Return         | +14.2%    | +11.8%  | +2.4%  |
| 1Y Return          | +28.6%    | +22.1%  | +6.5%  |
| 3Y Annualized      | +22.1%    | +18.4%  | +3.7%  |
| Sharpe Ratio       | 1.42      | 1.18    | +0.24  |
| Max Drawdown       | −28.4%    | −19.4%  | −9.0%  |
| Beta               | 1.35      | 1.00    | +0.35  |

## Asset Allocation vs. Target

| Sector       | Current | Target | Action       |
|--------------|---------|--------|--------------|
| Technology   | 68%     | 40%    | TRIM −28%    |
| Consumer Disc| 14%     | 15%    | HOLD         |
| Comm. Services| 10%   | 10%    | HOLD         |
| Healthcare   | 0%      | 10%    | ADD +10%     |
| Financials   | 0%      | 10%    | ADD +10%     |
| International| 0%      | 15%    | ADD +15%     |
| Cash         | 8%      | 5%     | DEPLOY −3%   |

## Holdings Review (Top 5)

| Ticker | Weight | 1Y Return | Status  | Note                          |
|--------|--------|-----------|---------|-------------------------------|
| AAPL   | 18%    | +12.4%    | TRIM    | Overweight; reduce to 10%     |
| MSFT   | 15%    | +31.2%    | HOLD    | Core position, justified      |
| NVDA   | 12%    | +89.4%    | TRIM    | Elevated after run; take 5%   |
| AMZN   | 10%    | +28.1%    | HOLD    | AWS recovery thesis intact    |
| GOOGL  | 8%     | +18.6%    | HOLD    | AI monetization optionality   |

## Priority Action List

1. Trim AAPL from 18% → 10% (tax-loss pair with any unrealized losses)
2. Trim NVDA from 12% → 7% (lock in gains, reduce concentration)
3. Initiate VTI/VXUS for international diversification (~15%)
4. Add healthcare exposure via XLV or individual name (~10%)
5. Deploy 3% cash into financials (JPM or XLF) given rate environment

╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      NEUTRAL                         ║
║ Confidence:  HIGH                            ║
║ Horizon:     MEDIUM-TERM                     ║
║ Score:       5.5 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      HOLD (rebalance needed)         ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

---

### 3.7 Earnings Call Analysis

**Command:**
```bash
/us-stock-analysis:earnings-call-analysis META Q4-2024
# Then paste the earnings call transcript
```

**Sample Output (condensed):**

```
# Earnings Call Analysis — META (Meta Platforms) Q4 2024

## Sentiment Dashboard
Overall Tone:         POSITIVE (score: 7.8/10)
Management Confidence: HIGH
Guidance Quality:     SPECIFIC (quantitative targets given)
Analyst Reception:    NEUTRAL-TO-POSITIVE (no hostile questioning)

## Key Themes (by frequency)

| Theme               | Mentions | Sentiment  | Implication                          |
|---------------------|----------|------------|--------------------------------------|
| AI infrastructure   | 34       | Very Bullish| Massive capex commitment ($60-65B)   |
| Reels monetization  | 18       | Bullish    | Engagement → revenue conversion      |
| Llama adoption      | 14       | Bullish    | Developer ecosystem building         |
| Reality Labs losses | 9        | Cautious   | $5B+ annual losses continue          |
| Regulatory risks    | 7        | Neutral    | EU DMA, FTC mentioned briefly        |

## Guidance Analysis

| Metric          | Q1 2025 Guide  | Consensus Est. | Beat/Miss |
|-----------------|----------------|----------------|-----------|
| Revenue         | $36.5–$39.0B   | $38.2B         | In-line    |
| Capex           | $60–65B (FY)   | $52B           | ABOVE      |
| DAU Growth      | "continued growth" | +4%         | Vague      |

⚠️  Capex guide $8-13B above consensus — markets may react negatively short-term
    but signals long-term AI infrastructure investment conviction.

## Language Shift vs. Prior Quarter
INCREASED mentions: "AI", "infrastructure", "efficiency" (+22 mentions combined)
DECREASED mentions: "metaverse", "VR" (−14 mentions) — strategic pivot confirmed
NEW language: "superintelligence", "AGI timeline" — CEO tone more ambitious

## Management Credibility Check
Prior guidance accuracy:
  Q3 Revenue Guide: $38.5–$41.0B → Actual: $40.6B ✅ (beat midpoint)
  Capex Guide (FY24): $37–40B → Actual: $38.0B ✅ (on target)
Credibility Score: 8.5/10 — Highly reliable guidance history

╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BULLISH                         ║
║ Confidence:  MEDIUM                          ║
║ Horizon:     LONG-TERM                       ║
║ Score:       7.0 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      BUY                             ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

---

### 3.8 Dividend Analysis

**Command:**
```bash
/us-stock-analysis:dividend-analysis JNJ
```

**Sample Output (condensed):**

```
# Dividend Analysis — JNJ (Johnson & Johnson)

## Dividend Profile
Current Yield:          3.1%
Annual Dividend:        $4.96/share
Consecutive Years:      62 years (Dividend King)
5Y Dividend CAGR:       5.8%
Next Ex-Dividend Date:  Approx. Feb 18 (quarterly)

## Safety Scorecard

| Factor                     | Value    | Assessment    |
|----------------------------|----------|---------------|
| Payout Ratio (EPS)         | 44.2%    | SAFE (< 60%)  |
| Payout Ratio (FCF)         | 38.8%    | VERY SAFE     |
| Dividend / Net Income      | 44%      | Comfortable   |
| Debt/EBITDA                | 1.2x     | Low leverage  |
| Interest Coverage          | 18.4x    | Very strong   |
| FCF Growth (3Y CAGR)       | +7.2%    | Healthy       |

Dividend Safety Score: 9.1/10 — VERY SAFE

## Growth Trajectory

Year    Dividend    YoY Growth
2020    $4.04       +5.7%
2021    $4.24       +5.0%
2022    $4.52       +6.6%
2023    $4.76       +5.3%
2024    $4.96       +4.2%
2025E   $5.20E      +4.8%E (projected)

## Risk Factors
• Litigation overhang: talc baby powder settlements — ongoing but ring-fenced
• MedTech segment growth slowing (orthopedics competition from Stryker)
• Spinoff of Kenvue (consumer health) reduces revenue diversification

## Peer Comparison (Dividend Yield vs. Safety)

| Company | Yield | Safety Score | 5Y DGR |
|---------|-------|--------------|--------|
| JNJ     | 3.1%  | 9.1/10       | 5.8%   |
| ABT     | 2.1%  | 8.4/10       | 7.2%   |
| MDT     | 3.5%  | 7.8/10       | 4.1%   |
| PFE     | 6.8%  | 5.2/10       | 2.8%   |

JNJ offers the best safety-to-yield balance in healthcare.

╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BULLISH                         ║
║ Confidence:  HIGH                            ║
║ Horizon:     LONG-TERM                       ║
║ Score:       7.5 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      BUY                             ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

---

### 3.9 Chart Master

**Command:**
```bash
/us-stock-analysis:chart-master AAPL --type price-volume
```

**Sample Output:**

```
# Chart Master — AAPL Price + Volume (6-Month)

## Mermaid Chart (primary — renders in Claude Code, GitHub, Notion)

xychart-beta
  title "AAPL — 6-Month Price & Volume"
  x-axis ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]
  y-axis "Price (USD)" 160 --> 240
  bar  [145, 138, 152, 168, 181, 175, 195]
  line [162, 155, 171, 184, 196, 188, 212]

## ASCII Chart (fallback — works in any terminal or plain text output)

AAPL — 6M Price (Aug–Feb)
240 |                                              *
220 |                                        *   * *
200 |                              *       *
180 |                    *   *   *
160 |          *   * * *
140 |  * * * *
    +------------------------------------------
     Aug Sep Oct Nov Dec Jan Feb

Volume Bars:
HIGH  ████████████░░░░░░░░████████░░░░░░░░████████
      Aug        Sep       Oct        Nov       Feb
NOTE: ████ = above avg volume | ░░░░ = below avg

## Key Chart Observations
• Breakout above $195 resistance on above-average volume (Feb) — bullish confirmation
• Price crossed above 50-day MA in January — trend reversal signal
• Volume contraction during Oct–Nov pullback — healthy consolidation, not distribution
• Support zone: $178–$182 (tested twice, held both times)

## HTML Chart (interactive — paste into browser or export to report)
<!-- Chart.js snippet — opens in any browser -->
<canvas id="aaplChart"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
new Chart(document.getElementById('aaplChart'), {
  type: 'bar',
  data: {
    labels: ['Aug','Sep','Oct','Nov','Dec','Jan','Feb'],
    datasets: [
      { type: 'line', label: 'Price', data: [162,155,171,184,196,188,212],
        borderColor: '#3b82f6', tension: 0.3, yAxisID: 'y' },
      { type: 'bar', label: 'Volume (M)', data: [82,65,91,55,78,105,112],
        backgroundColor: 'rgba(99,102,241,0.4)', yAxisID: 'y1' }
    ]
  }
});
</script>

╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BULLISH                         ║
║ Confidence:  MEDIUM                          ║
║ Horizon:     SHORT-TERM                      ║
║ Score:       6.8 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      BUY                             ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

**Other chart types you can request:**
```bash
/chart-master NVDA --type fair-value-range      # Bull/base/bear valuation bands
/chart-master MSFT --type multi-factor-signal   # Radar chart of 6 signal dimensions
/chart-master AMZN --type revenue-breakdown     # Bar chart of segment revenue
/chart-master TSLA --type rsi-macd             # Technical indicator dual-panel
```

---

### 3.10 Full Report

**Command:**
```bash
/us-stock-analysis:full-report MSFT
```

**What it does:**

The `full-report` skill orchestrates 15 analysis modules sequentially and saves a single professional HTML report to `output/MSFT-full-report.html`.

```
# Full Report — MSFT (Microsoft Corporation)

Orchestrating analysis modules...

  ✅  1/15 — Stock Evaluation         (business quality, moat)
  ✅  2/15 — Fundamental Analysis     (income statement, balance sheet, FCF)
  ✅  3/15 — DCF Valuation            (3-scenario intrinsic value)
  ✅  4/15 — Stock Valuation          (comps, EV multiples, football field)
  ✅  5/15 — Competitor Analysis      (moat vs. peers: GOOGL, AMZN, CRM)
  ✅  6/15 — Technical Analysis       (trend, key levels, indicators)
  ✅  7/15 — Earnings Call Analysis   (last 2 quarters, tone delta)
  ✅  8/15 — Insider Trading          (Form 4 activity, 6 months)
  ✅  9/15 — Institutional Ownership  (13F changes, smart money)
  ✅ 10/15 — Short Interest           (days-to-cover, squeeze risk)
  ✅ 11/15 — Options Analysis         (implied vol, put/call, unusual activity)
  ✅ 12/15 — Dividend Analysis        (yield, safety, growth)
  ✅ 13/15 — Economics Analysis       (macro tailwinds/headwinds)
  ✅ 14/15 — Portfolio Impact         (how MSFT fits a typical portfolio)
  ✅ 15/15 — Chart Master             (price, valuation range, factor radar)

Report saved to: output/MSFT-full-report.html
Open: open output/MSFT-full-report.html

## Report Contents
- Interactive Chart.js visualizations (price + volume, fair-value range)
- Tabbed layout: Summary | Fundamentals | Valuation | Technicals | Risk
- Printable PDF-ready styling
- Signal blocks for each module + composite signal

## Composite Signal
Across 15 modules: 9 BULLISH | 5 NEUTRAL | 1 BEARISH
Weighted composite score: 7.1/10

╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BULLISH                         ║
║ Confidence:  HIGH                            ║
║ Horizon:     LONG-TERM                       ║
║ Score:       7.1 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      BUY                             ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

---

### 3.11 Result Validator

**Command:**
```bash
/us-stock-analysis:result-validator
# Then paste any InvestSkill analysis output for auditing
```

**Use case:** Run this after any analysis to get a second opinion on whether the output is reliable.

**Sample Output:**

```
# Result Validator — Auditing: NVDA DCF Valuation

## Audit Dimensions

| Dimension              | Score | Notes                                              |
|------------------------|-------|----------------------------------------------------|
| Data Quality           | 7/10  | Revenue/FCF sourced, WACC assumptions need cite    |
| Methodology Soundness  | 8/10  | Standard 2-stage DCF, SBC adjustment done          |
| Signal Consistency     | 6/10  | DCF says HOLD but narrative skews bullish — gap    |
| Risk Coverage          | 7/10  | Downside scenarios present; tail risk underweighted|
| Reasoning Transparency | 8/10  | Sensitivity table provided, terminal value % shown |

## Issues Found

⚠️  SIGNAL INCONSISTENCY: Score is 5.8/10 (Neutral/Hold) but analysis prose
    contains predominantly bullish language. Recommendation may be biased upward.

⚠️  DATA GAP: WACC beta of 1.72 is not sourced — 30-day beta vs. 5-year beta
    could shift IV by ±$80/share. Verify input.

⚠️  RISK UNDERWEIGHT: Custom silicon risk from hyperscalers (Google TPU, Amazon
    Trainium) mentioned briefly but not quantified in bear case. Bear IV may be
    optimistic at $320.

## Adjustments Recommended
• Revise Action from HOLD to HOLD-with-caution (given signal-narrative gap)
• Re-run DCF with 5-year average beta (1.45) as sensitivity check
• Add hyperscaler chip risk scenario to bear case

## Confidence Score

╔═══════════════════════════════════════╗
║         CONFIDENCE ASSESSMENT         ║
╠═══════════════════════════════════════╣
║ Raw Score:      5.8 / 10              ║
║ Adjusted Score: 5.2 / 10             ║
║ Tier:           MEDIUM                ║
║ Reliability:    Use with caution      ║
╠═══════════════════════════════════════╣
║ Recommendation: Re-verify WACC input  ║
║                 before acting         ║
╚═══════════════════════════════════════╝
```

---

### Live workflow runs (3.12 – 3.18)

The demos in 3.1–3.11 above show *format*. The seven that follow are *real runs*: each
workflow in [Section 4](#4-practical-workflows) executed end-to-end against a real
US-listed stock, with the actual numbers the skills returned.

> **Run date: 27 July 2026.** Prices and fundamentals are as of the 24 July 2026 close
> unless noted. Sources are listed per run. **These numbers are stale the moment you read
> them** — re-run the commands yourself to get current data. The point of these demos is
> the *reasoning chain*, not the price.
>
> Note that several runs end in **"don't trade"** or **"the cheap thing is cheap for a
> reason."** That is the system working. A workflow that always finds a buy is a workflow
> you cannot trust.

---

### 3.12 Workflow A — Pre-Earnings Deep Dive (live run: AAPL)

**Setup:** Apple reports FQ3-2026 on **Thursday 30 July 2026, after the close** — three days
out. You hold shares. Hold through the print, or reduce?

**Commands run:**

```bash
/us-stock-analysis:earnings-call-analysis AAPL Q2-2026
/us-stock-analysis:options-analysis AAPL
/us-stock-analysis:insider-trading AAPL
/us-stock-analysis:technical-analysis AAPL
```

**Step 1 — Earnings call analysis (last quarter, reported 30 Apr 2026)**

```
Quarter:            FQ2-2026 (reported 2026-04-30)
Revenue:            $111.2B — double-digit growth in every geography and every category
EPS:                $2.01 vs. $1.94 consensus  (beat by 3.6%)
iPhone:             $57.0B, +22% YoY — "most popular lineup in company history"
Services:           $31.0B — all-time high
Mac / iPad / Wearables:  $8.4B / $6.91B / $7.9B

Management tone:    Confident. Cook: "demand was off the charts" — the constraint was
                    described as SUPPLY, not demand.
Guidance given:     June-quarter revenue +14% to +17% YoY, against ~+9.5% consensus.
Governance event:   CEO transition announced — John Ternus becomes CEO 1 Sep 2026.

⚠️  The bar was raised BY MANAGEMENT. Guidance above consensus means the beat is
    already the base case. Consensus for FQ3: EPS $1.89 (+20.4%), revenue $108.89B (+15.8%).
```

**Step 2 — Options analysis (expected move into the print)**

```
Spot:                       $333.02
Options-implied move:       ±5.38%  (±$16.61) on the earnings-week straddle
Implied range post-print:   $316.41 – $349.63
Implied 1-day move vs.
  14-day ATR ($8.26):       2.0× normal daily range priced in

Reading: the straddle is not cheap. Buying premium into the print requires a move
LARGER than 5.38% just to break even. Sellers of premium are compensated for
event risk — but the tail is a supply-constrained miss.
```

**Step 3 — Insider trading (SEC Form 4, last ~120 days)**

```
2026-04-01  RSU settlement: 131,576 sh vested to CEO; 66,627 sh withheld @ ~$255.63 (tax)
2026-04-02  Timothy Cook (CEO)    SELL   64,949 sh @ $251.25–$256.00   ≈ $16.5M
                                          → Rule 10b5-1 plan adopted 2024-05-24
                                          → post-sale direct holding: 3,280,418 sh
2026-04-23  Kevan Parekh (CFO)    SELL    1,534 sh @ $275.00           ≈ $0.42M
                                          → Rule 10b5-1 plan adopted 2025-11-21
                                          → post-sale direct holding: 13,366 sh

Open-market PURCHASES by insiders: none.

Reading: NEUTRAL, not bearish. Both sales are pre-scheduled 10b5-1 dispositions tied
to vesting, adopted 11 and 8 months before execution — they carry no information about
the quarter. But note the absence on the other side: nobody is buying at $333 either.
```

**Step 4 — Technical analysis**

```
Price:              $333.02   (day range $321.62–$334.37, closed +3.53%)
52-week range:      $201.50 – $334.99    → price is 0.6% below the 52-week HIGH
Moving averages:    20d $314.39 | 50d $306.23 | 100d $285.10 | 200d $275.98
                    → above ALL four; +20.7% above the 200-day
RSI (14):           65.23 — strong, not yet overbought (<70)
ATR (14):           $8.26  (2.48% of price)
Analyst marker:     Morgan Stanley PT raised to $364 from $360 (Overweight), 3 days ago

Reading: an uptrend in good health, but with zero cushion. Entering the print at the
52-week high means there is no nearby support to fall back on — the first real level
is the 20-day at $314.39, which is 5.6% down, i.e. inside the implied move.
```

**The decision matrix from Workflow A, filled in:**

| Input | Workflow A's bullish case | What AAPL actually showed | Score |
|---|---|---|---|
| Earnings tone history | Positive tone, beats | Beat + guided *above* consensus | Bullish, but bar is raised |
| Implied volatility | Low IV rank | ±5.38% ≈ 2.0× normal daily range | Rich |
| Insider activity | Insider buying | 10b5-1 sales only, no buys | Neutral |
| Technical position | At support | 0.6% below the 52-week high | At resistance |

**Conclusion:** two of four inputs point the wrong way, and both of them are about
*price*, not *business*. The business is fine; the setup is not. Apple would have to beat
its own raised guidance to hold $333. The asymmetric action is to **hold the core and
reduce the trading portion** — or, if you want to stay fully long, use the expensive
options to your advantage by selling a covered call above the implied range (>$350)
rather than buying protection at inflated IV.

```
╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      NEUTRAL                         ║
║ Confidence:  MEDIUM                          ║
║ Horizon:     SHORT-TERM                      ║
║ Score:       5.4 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      HOLD (trim trading position)    ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

**Sources:** [stockanalysis.com/stocks/aapl](https://stockanalysis.com/stocks/aapl/statistics/) ·
[Barchart AAPL technicals](https://www.barchart.com/stocks/quotes/AAPL/technical-analysis) ·
[Barchart expected move](https://www.barchart.com/stocks/quotes/aapl/expected-move) ·
[Apple FQ2-2026 call coverage](https://www.macrumors.com/2026/04/30/apple-q2-2026-earnings-call/) ·
SEC Form 4 filings

---

### 3.13 Workflow B — Value Stock Screening (live run: PFE)

**Setup:** Pfizer trades at **8.59× forward earnings** with a **7.01% dividend yield**,
against a healthcare-sector average of ~18.2× forward. That is either a gift or a warning.
Workflow B exists to tell the two apart.

**Commands run:**

```bash
/us-stock-analysis:stock-eval PFE
/us-stock-analysis:competitor-analysis PFE
/us-stock-analysis:financial-report-analyst PFE 10-K
/us-stock-analysis:dcf-valuation PFE --scenarios
/us-stock-analysis:result-validator
```

**Step 1 — Stock evaluation (quality first, price second)**

```
Price / Market cap:     $24.54 / $139.86B      Enterprise value: $191.51B
Valuation:              P/E TTM 18.72 | Fwd P/E 8.59 | P/B 1.55 | P/S 2.21
                        EV/EBITDA 13.22 | EV/FCF 20.20
Income (TTM):           Revenue $63.32B | Net income $7.49B | FCF $9.48B
Margins:                Gross 74.80% | Operating 29.87% | Net 11.83%
Returns:                ROIC 12.72% | ROE 8.31%
Balance sheet:          Debt $64.73B | Cash $13.08B → NET DEBT $51.65B
                        Net debt / TTM FCF = 5.4× — that is a long rope
Beta (5Y):              0.31 | 52-week change: −3.23%

QUALITY VERDICT: passes the first gate. ROIC 12.7% exceeds any reasonable WACC for a
0.31-beta pharma (~7%). This is a profitable business, not a broken one.
The problem is not quality. The problem is DIRECTION.
```

**Step 2 — Competitor / moat analysis**

```
The moat in pharma is a patent, and patents expire on a schedule you can read.

LOSS-OF-EXCLUSIVITY WAVE, 2026–2028
  Eliquis     EU patent expiry May 2026     ~$6–7B/yr of PFE revenue + royalties
  Ibrance     cliff by 2028
  Xtandi      cliff by 2028
  Xeljanz     cliff by 2028
  Prevnar     cliff by 2028
  ─────────────────────────────────────────────────────────────────────
  Cumulative annual revenue erosion: $17–18B  =  ~28% of TTM revenue

COMPANY GUIDANCE:  FY2026 revenue $59.5B – $62.5B, vs. FY2025 $62.6B  → DECLINING
OFFSET ATTEMPT:    $10B Metsera acquisition. MET-097i, a monthly GLP-1, Phase 3.
                   Targeted market entry: 2028.

PEER CHECK (forward P/E)
  PFE  8.59×   ← cheapest, largest cliff
  BMY  ~9×     ← also cheap, also a cliff (Revlimid erosion)
  MRK  ~?      ← Keytruda cliff pending
  LLY  premium ← GLP-1 franchise, no near-term cliff
  Healthcare sector average: 18.2×

Reading: the entire low-multiple cohort in pharma shares one trait — a visible
patent cliff. The market is not mispricing Pfizer; it is DISCOUNTING a known
future revenue decline. That is a different thing.
```

**Step 3 — Filing read: the number that decides it**

The recipe says "look for red flags." Here is the one that matters, and it is arithmetic,
not judgement:

```
DIVIDEND COVERAGE CHECK

  Dividend yield         7.01%
  × Market cap           $139.86B
  = Annual dividend cost  $9.80B

  TTM free cash flow      $9.48B
  ────────────────────────────────
  FCF payout ratio        103.4%    ← paying out MORE than it earns in cash
  EPS payout ratio        130.9%

  FCF coverage            0.97×  (needs to be >1.0× before you can call it safe)

The 7% yield is not being funded by the business. It is being funded by the balance
sheet — on top of $51.65B of net debt — while revenue is guided DOWN and the
replacement pipeline does not commercialise until 2028.
```

**Step 4 — DCF with appropriately conservative assumptions**

```
INPUTS
  Base FCF (TTM)        $9.48B
  Net debt              $51.65B      Shares outstanding  5.699B
  Cost of equity (CAPM) 4.69% risk-free + 0.31 beta × 4.5% ERP  =  6.08%
  WACC                  6.08% equity (68%) + 4.25% after-tax debt (32%)  =  5.50%
  Model                 10-year explicit forecast, then terminal growth

SCENARIOS (10-yr free-cash-flow path)
  Bear   LOE unoffset:   −8%/yr for 3 yrs, then flat        terminal g 0.0%
  Base   LOE to 2028:    −5%/yr for 3 yrs, then +2%/yr      terminal g 1.0%
  Bull   Metsera lands:  −5%/yr for 3 yrs, then +4%/yr      terminal g 1.5%

FAIR VALUE PER SHARE, BY DISCOUNT RATE
              WACC 5.50%      6.50%       7.50%
              (CAPM-implied)  (+100bp)    (+200bp)
  Bear          $14.81        $11.18       $8.52
  Base          $23.97        $17.93      $13.75
  Bull          $30.91        $22.75      $17.31

  Spot: $24.54

Reading: at the discount rate PFE's own 0.31 beta implies — 5.50% — the base case
prints $23.97 against a $24.54 spot. The market has already done this maths, to
within 2%. You are not being paid to take the pipeline risk; you are being asked
to take it for free.

⚠️  And note how fragile that fair value is. The ENTIRE base case depends on a
    5.50% WACC. Add 100 bp and it falls to $17.93 — 27% below spot. A 0.31 beta
    is what a stable, defensive cash-flow stream earns; a company guiding revenue
    DOWN through a $17–18B patent cliff may not deserve to keep it.
```

**Step 5 — Result validator**

```
Data Quality           8/10   Prices, FCF, guidance all sourced and dated
Methodology            7/10   The 5.50% WACC is the swing factor — sensitivity shown
Signal Consistency     9/10   Every module points the same way; no narrative/number gap
Risk Coverage          8/10   LOE quantified in dollars, not adjectives
Transparency           8/10   Payout arithmetic shown, not asserted

⚠️  KEY SENSITIVITY: the base case assumes Metsera reaches market in 2028. Slip it
    two years and the path falls toward the bear case ($14.81 at the same WACC),
    because the LOE erosion is contractual and the offset is not.
```

**Conclusion — value trap, or value?** Run the recipe's own checklist:

| Value-trap signal | Genuine-value signal | PFE |
|---|---|---|
| ROIC < WACC | ROIC > WACC | ✅ Genuine — 12.7% vs ~7% |
| Moat eroding | Short-term headwind only | ❌ Trap — contractual, $17–18B, 2026–2028 |
| FCF declining | FCF improving | ❌ Trap — payout already 103% of FCF |
| Defensive management tone | Confident tone | ⚠️ Mixed — guidance is a managed decline |

Two hard trap signals, one clean pass. **This is a cheap stock, not an undervalued one.**
The 7% yield is the compensation for a revenue cliff you can read the dates of, and it is
not currently covered by cash flow. The buy case only opens if Metsera de-risks — which is
a *pipeline* bet, not a *value* bet, and should be sized like one.

```
╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BEARISH                         ║
║ Confidence:  MEDIUM                          ║
║ Horizon:     MEDIUM-TERM                     ║
║ Score:       3.6 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      AVOID                           ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

**Sources:** [stockanalysis.com/stocks/pfe](https://stockanalysis.com/stocks/pfe/statistics/) ·
[Pfizer patent cliff analysis](https://parolaanalytics.com/parolanews/pfizer-patent-cliff/) ·
[Pfizer FY2026 guidance](https://www.pharmaceutical-technology.com/news/pfizer-fy-2025-2026-profit-forecast-guidance/) ·
[Pharma valuation comparison](https://nai500.com/blog/2026/07/undervalued-pharma-dividend-plays-pfe-boasts-7-1-forward-yield-bmy-delivers-4-3/)

---

### 3.14 Workflow C — Dividend Portfolio Construction (live run: JNJ / ABBV / PG)

**Setup:** three dividend-aristocrat candidates, equal weight. Which are core holdings,
which are satellites, and does the resulting portfolio actually hit an income target?

**Commands run:**

```bash
/us-stock-analysis:dividend-analysis JNJ
/us-stock-analysis:dividend-analysis ABBV
/us-stock-analysis:dividend-analysis PG
/us-stock-analysis:portfolio-review
```

**Steps 1–3 — Dividend analysis, side by side**

| | **JNJ** | **ABBV** | **PG** |
|---|---|---|---|
| Price | $263.40 | $259.36 | $147.41 |
| Market cap | $634.77B | $458.24B | $343.26B |
| Dividend / share (annual) | $5.36 | $6.92 | $4.23 |
| **Yield** | **2.03%** | **2.67%** | **2.87%** |
| Consecutive years of growth | **64** | 54 | **70** |
| Latest 1Y dividend growth | 3.94% | 5.56% | 3.97% |
| **Payout ratio (reported, EPS)** | 61.2% | **336.4%** ⚠️ | 63.7% |
| FCF (TTM) | $22.24B | $19.98B | $15.03B |
| Annual dividend cost | $12.89B | $12.24B | $9.85B |
| **Payout ratio (free cash flow)** | **57.9%** | **61.2%** | **65.5%** |
| FCF coverage | 1.73× | 1.63× | 1.53× |
| ROIC | 19.92% | 14.41% | 22.06% |
| Net debt | $28.28B | $63.52B | $24.72B |
| Beta (5Y) | 0.23 | 0.28 | 0.38 |
| Forward P/E | 21.70 | 17.53 | 21.50 |

**The one thing this run teaches:** AbbVie's reported payout ratio is **336%**, which on a
screener looks like a dividend about to be cut. It is not. Run it against cash instead of
accounting earnings and the payout is **61.2%** — the *safest-looking* number of the three
after JNJ. The gap is acquired-IPR&D and intangible amortisation crushing GAAP net income
($3.60B) while operating cash flow ($21.22B) is untouched.

> **Rule of thumb the skill applies:** for any acquisitive pharma, an EPS payout ratio is
> noise. Cash pays dividends, not net income. Always compute
> `dividend cost ÷ free cash flow` yourself — it is two numbers.

**Step 4 — Portfolio review of the resulting sleeve**

```
Equal-weight (33.3% each) three-stock dividend sleeve

  Blended yield:            2.52%
  Weighted FCF payout:      61.5%   → healthy; all three cover 1.5×+
  Weighted beta:            0.30    → very defensive
  Sector exposure:          Healthcare 66.7%  |  Consumer Staples 33.3%

⚠️  TWO PROBLEMS, BOTH STRUCTURAL:

  1. INCOME SHORTFALL. The recipe targets 3%+ portfolio yield. This sleeve
     delivers 2.52%. Every one of these names has re-rated — you are buying
     high-quality dividend growth at 21.7×, 17.5× and 21.5× forward, and the
     yield has compressed accordingly.

  2. SECTOR CONCENTRATION. Two thirds in healthcare. JNJ and ABBV are exposed
     to the same policy risk (US drug pricing), the same LOE dynamic, and the
     same patent-litigation cycle. This is one bet wearing two tickers.

  SUGGESTED REPAIR (not executed — this is a diagnosis, not an order):
     - Cut healthcare to ≤40% by trimming one of JNJ/ABBV
     - Add a higher-yielding, lower-correlation sleeve (utilities, midstream,
       or an energy name — see Workflow F, where Energy is +22.38% YTD) to
       lift blended yield toward 3%
```

**Classification, per the recipe's own template:**

| Ticker | Yield | FCF payout | 1Y growth | Streak | Decision |
|---|---|---|---|---|---|
| JNJ | 2.03% | 57.9% | 3.94% | 64 yrs | **Core** — best coverage, lowest beta, AAA-tier balance sheet |
| PG | 2.87% | 65.5% | 3.97% | 70 yrs | **Core** — highest yield of the three, highest ROIC |
| ABBV | 2.67% | 61.2% | 5.56% | 54 yrs | **Satellite** — best dividend growth, but $63.5B net debt and healthcare overlap with JNJ |

```
╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      NEUTRAL                         ║
║ Confidence:  HIGH                            ║
║ Horizon:     LONG-TERM                       ║
║ Score:       5.8 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      HOLD (diversify before adding)  ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

Dividend *safety* scores well; the *portfolio* does not clear its own income and
diversification targets. Three good companies do not automatically make a good sleeve.

**Sources:** [JNJ](https://stockanalysis.com/stocks/jnj/dividend/) ·
[ABBV](https://stockanalysis.com/stocks/abbv/dividend/) ·
[PG](https://stockanalysis.com/stocks/pg/dividend/) (stockanalysis.com dividend & statistics pages)

---

### 3.15 Workflow D — Swing Trade Setup (live run: UPST)

**Setup:** Upstart has **31.44% of its float sold short** and **6.02 days to cover** — one of
the most heavily shorted liquid names on the US market. Textbook squeeze ingredients.
Does the rest of the workflow confirm?

**Commands run:**

```bash
/us-stock-analysis:short-interest UPST      # step 1 — ran
/us-stock-analysis:technical-analysis UPST  # step 2 — ran, and FAILED the gate

# Steps 3 and 4 were NOT run. Workflow D gates the trade on step 2, and step 2
# came back with 0 of 3 confirmations. Pricing options and drawing a chart for a
# setup that has already been rejected is wasted work — and reading them anyway
# is how a rejected setup talks its way back into the book.
# /us-stock-analysis:options-analysis UPST
# /us-stock-analysis:chart-master UPST --type price-volume
```

**Step 1 — Short interest: the ingredients are real**

```
Price / Market cap:     $26.93 / $2.58B     Enterprise value: $4.08B
Shares sold short:      25.84M
Short % of shares out:  27.00%
Short % of FLOAT:       31.44%      ← recipe threshold is >20%. Clears easily.
Days to cover:          6.02        ← recipe threshold is >5. Clears.
Beta (5Y):              2.27

WHY THE SHORTS ARE THERE (the part a screener won't tell you):
  Revenue (TTM)         $1.17B
  Net income (TTM)      $49.40M      → thin, and P/E 65.06 on it
  FREE CASH FLOW (TTM)  −$270.63M    ← burning cash
  Cash                  $474.66M
  Total debt            $1.98B       ← 4.2× cash, against negative FCF
  Next earnings         4 Aug 2026, after close

This is not a crowded short against a healthy business. It is a solvency-adjacent
short against a cash-burning lender with $1.98B of debt. High short interest is a
FUEL measure, not a THESIS.
```

**Step 2 — Technical analysis: every confirmation fails**

```
Price:              $26.93
Moving averages:    20d $31.81 | 50d $31.23 | 100d $30.06 | 200d $36.63
                    → BELOW ALL FOUR.  −26.5% below the 200-day.
52-week change:     −67.99%
RSI (14):           32.01 — oversold, but oversold in a downtrend is not a signal
ATR (14):           $1.84 (6.85% of price) — very high

Recipe asked for:   price above the 20-day MA  ❌ (15.3% below it)
                    RSI recovering from oversold ❌ (still falling into it)
                    volume surge  ❌ (no confirming expansion)

0 of 3 technical confirmations present.
```

**Stopping here — and the risk / reward that confirms it**

The remaining two commands were skipped on purpose (see above). Before discarding
the idea, the setup was priced anyway, to check that the gate was not being
over-strict:

```
Entry (spot)                 $26.93
Stop  (2 × ATR below)        $23.25      risk  −13.7%
Target (reclaim 50-day MA)   $31.23      reward +16.0%
────────────────────────────────────────────────────────
Reward : Risk                1.17 : 1

A swing trade needs 2:1 minimum to survive a sub-50% hit rate. At 1.17:1 you need
to be right ~46% of the time just to break even — against a 2.27-beta stock that
reports earnings in 8 days.
```

**Conclusion: NO TRADE.** This is the most useful outcome in the whole cookbook. The
squeeze *ingredients* are present and eye-catching; the *setup* is absent. Workflow D is
sequenced deliberately — short interest first, technicals second — precisely so that a
striking short-interest number cannot walk you into a falling knife on its own.

**What would change the answer:** a reclaim of the $31.2–31.8 zone (50-day and 20-day
MAs, which are converging) on expanding volume, ideally as a post-earnings gap up on
4 Aug. That would flip risk/reward — buying the *reclaim* at ~$31.5 with a stop under
$29 targets the 200-day at $36.63 for roughly 2:1. Waiting costs 17% of upside and
removes the entire thesis-free portion of the risk.

```
╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BEARISH                         ║
║ Confidence:  MEDIUM                          ║
║ Horizon:     SHORT-TERM                      ║
║ Score:       3.2 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      NO TRADE (wait for reclaim)     ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

**Sources:** [stockanalysis.com/stocks/upst](https://stockanalysis.com/stocks/upst/statistics/) ·
[Barchart UPST technicals](https://www.barchart.com/stocks/quotes/UPST/technical-analysis)

---

### 3.16 Workflow E — Full Investment Memo (live run: NVDA)

**Setup:** one command, one memo, before committing significant capital to a $5 trillion
company. The interesting question at this size is not "is NVIDIA a good business" — it
obviously is — but **what has to be true for the price to make sense.**

**Commands run:**

```bash
/us-stock-analysis:full-report NVDA
/us-stock-analysis:result-validator
```

**Composite output (abridged from `output/NVDA-full-report.html`)**

```
NVIDIA Corporation (NVDA) — Full Report, 27 Jul 2026

MARKET
  Price                 $206.84  (−0.92% on the day)
  Market cap            $5.01T
  Enterprise value      $4.97T   (debt $12.81B − cash $53.17B)
  52-week change        +21.12%
  50d MA / 200d MA      $209.18 / $192.91   → below 50d, +7.2% above 200d
  Beta (5Y)             2.21
  Short interest        1.34% of shares out — nobody is positioned against it
  Next earnings         26 Aug 2026, after close

BUSINESS QUALITY — this is the easy part
  Revenue (TTM)         $253.49B
  Net income (TTM)      $159.61B
  Free cash flow (TTM)  $119.08B
  Gross margin          74.15%
  Operating margin      64.02%      ← a 64% operating margin at $253B of revenue
  ROIC                  104.67%
  ROE                   114.29%

VALUATION
  P/E (TTM)             31.68      ← cheaper than the multiple headlines imply
  P/S                   19.76
  EV/EBITDA             30.02
  EV/FCF                41.73
  FCF yield             2.38%
```

**The module that decides it — reverse DCF**

Rather than guess a growth rate and produce a target, the DCF module was run backwards:
*what growth does today's price already require?*

```
REVERSE DCF — solving for the growth the market is paying for

  Enterprise value to justify   $4,970B
  Starting FCF                  $119.08B
  Model                         10-year fade to 3% terminal growth
  Cost of equity (CAPM)         4.69% risk-free + 2.21 beta × 4.5% ERP = 14.63%

  At WACC 12.0%  →  required Year-1 FCF growth:  34.8%  (fading to 3% by year 10)
  At WACC 14.4%  →  required Year-1 FCF growth:  42.7%  (fading to 3% by year 10)

  Cross-check at WACC 12%:
     Year-1 growth 25%  →  implied EV $3.38T   (32% BELOW today's price)
     Year-1 growth 35%  →  implied EV $5.01T   (≈ today's price)
```

**Interpretation.** At a 12% discount rate the market requires NVIDIA to grow free cash
flow **~35% next year and to keep compounding on a decade-long glide path down to 3%**.
That is not an absurd number for this company — it has done far more — but it is not a
margin of safety either. Drop the assumption to a still-excellent 25% and the stock is
worth about a third less. Use the CAPM-consistent 14.6% cost of equity that its own 2.21
beta implies, and the required growth rises above 42%.

**Result validator on the composite**

```
Data Quality           8/10   All inputs sourced and dated; forward P/E unavailable
Methodology            9/10   Reverse DCF avoids the target-price circularity trap
Signal Consistency     7/10   Quality metrics scream BUY; valuation says PRICED
Risk Coverage          6/10   Customer concentration (hyperscaler capex) and
                              custom-silicon competition not quantified in dollars
Transparency           9/10   Discount-rate sensitivity shown explicitly

⚠️  The single largest unmodelled risk is that ~35% FCF growth is underwritten by a
    handful of hyperscaler capex budgets. That is not diversified demand — it is
    four customers' board decisions. Model it before sizing.
```

**Conclusion:** an exceptional business at a price that already assumes it stays
exceptional. Nothing here says sell; nothing here offers a discount either. The honest
action is a **staged entry rather than a lump sum** — which is exactly what Workflow G
below is for.

```
╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      NEUTRAL                         ║
║ Confidence:  MEDIUM                          ║
║ Horizon:     LONG-TERM                       ║
║ Score:       6.1 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      HOLD / accumulate on weakness   ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

**Sources:** [stockanalysis.com/stocks/nvda](https://stockanalysis.com/stocks/nvda/statistics/) ·
[US Treasury yields, 24 Jul 2026](https://tradingeconomics.com/united-states/government-bond-yield)

---

### 3.17 Workflow F — Macro-Driven Sector Rotation (live run: July 2026 regime)

**Setup:** the FOMC meets **28–29 July 2026**. Oil is above $100. Which sectors does the
current regime actually favour, and is the trade already crowded?

**Commands run:**

```bash
/us-stock-analysis:economics-analysis
/us-stock-analysis:sector-analysis
/us-stock-analysis:stock-eval XOM
/us-stock-analysis:stock-eval JPM
/us-stock-analysis:portfolio-review
```

**Step 1 — Economics analysis: reading the regime**

```
POLICY
  Fed funds target        3.50% – 3.75%
  July 28–29 FOMC         Hold expected; optionality to tighten preserved
  Probability of a HIKE
  later in 2026           38%  (was 12% one week earlier)
  What moved it           Crude above $100/bbl on Middle East supply disruption

INFLATION (June 2026 CPI, released 14 Jul)
  Headline                +3.5% YoY   |  −0.4% MoM SA
  Core (ex food/energy)   +2.6% YoY   |   0.0% MoM SA
  → Core is nearly at target. Headline is not. The entire gap is ENERGY.

RATES (24 Jul 2026)
  3M 3.90% | 1Y 4.12% | 2Y 4.34% | 5Y 4.44% | 10Y 4.69% | 30Y 5.16%
  10Y − 3M  +78 bp        10Y − 2Y  +34 bp
  → Upward-sloping and steepening. No recession signal from the curve.

REGIME CALL: late-cycle, positive real rates, energy-driven headline inflation,
a steepening curve, and a central bank on hold with a hawkish tail risk.
That combination has a specific historical signature: it favours ENERGY and
rate-levered FINANCIALS, and penalises long-duration Consumer Discretionary.
```

**Step 2 — Sector analysis: what the market has already done**

```
S&P 500 sector performance, YTD through July 2026     (index YTD: +9.5% at mid-year)

  Technology              +34.68%   ████████████████████
  Capital Goods           +32.38%   ██████████████████
  Energy                  +22.38%   █████████████
  Transportation          +18.53%   ███████████
  Utilities               +12.72%   ███████
  Basic Materials         +11.76%   ███████
  Healthcare              +11.62%   ███████
  Consumer Non-Cyclical   +11.58%   ███████
  Financial                +5.90%   ███
  Conglomerates            +5.73%   ███
  Retail                   +5.15%   ███
  Consumer Discretionary   +0.75%   ▌
  Services                 −3.08%   (negative)

Reading: Energy at +22.38% confirms the macro call — and warns that it is
partly consensus already. Financials at +5.90% have NOT re-rated despite a
steepening curve. That divergence is the actual opportunity in this screen.
```

**Step 3 — Stock-level check inside the two favoured sectors**

| | **XOM** (Energy) | **JPM** (Financials) |
|---|---|---|
| Price | $156.94 | $353.21 |
| Market cap | $650.43B | $938.90B |
| P/E (TTM) | 26.43 | 15.16 |
| **Forward P/E** | **12.58** | **14.70** |
| P/B | 2.56 | 2.66 (P/TBV 3.15) |
| Revenue (TTM) | $326.01B | $186.33B |
| Net income (TTM) | $25.31B | $63.63B |
| ROIC / ROE | 7.30% / 9.87% | — / **17.79%** |
| FCF (TTM) | $18.79B | n/a (bank) |
| Dividend yield | 2.63% (payout 68.7%) | 1.70% (payout 25.8%) |
| Beta (5Y) | 0.16 | 0.98 |
| 52-week change | **+42.76%** | +19.02% |
| Price vs. 200d MA | **+13.7%** | **+13.7%** |
| Next earnings | 31 Jul 2026, pre-market | reported 14 Jul 2026 |

```
THE TELL IS IN XOM's FORWARD MULTIPLE

  P/E collapses from 26.43 (TTM) to 12.58 (forward).
  Implied forward net income = $650.43B ÷ 12.58 = $51.7B
  vs. TTM net income of $25.31B
  → consensus is modelling +104% earnings growth.

  That is the $100 oil price already fully capitalised into estimates. Buying XOM
  here is not a bet on the macro call being RIGHT — the macro call is in the
  numbers. It is a bet on oil staying above $100, which is a geopolitical
  bet, not a valuation one. XOM already +42.76% over 12 months.

JPM IS THE CLEANER EXPRESSION

  15.16× trailing / 14.70× forward — barely any earnings acceleration priced in.
  ROE 17.79% against a 2.66× P/B implies a ~9.2% cost of equity (Gordon, g=4%) —
  reasonable, not stretched.
  Earnings yield 6.60% vs. the 10-year at 4.69% → a +191 bp spread.
  Payout ratio only 25.75%, so the dividend has room even if rates fall.
  Sector +5.90% YTD: the re-rating has NOT happened yet.
```

**Step 4 — Portfolio impact**

```
Adding a 5% XOM + 5% JPM sleeve to a tech-heavy portfolio:

  ✅ Weighted beta falls (XOM beta 0.16 is a genuine diversifier)
  ✅ Adds positive correlation to the energy-inflation shock that is currently
     the market's main tail risk — this is an inflation HEDGE, not just a trade
  ✅ Raises blended dividend yield
  ⚠️  BOTH names sit +13.7% above their 200-day MA. Neither is at support.
      Stage the entries (see Workflow G) rather than buying the full weight.

PREFERENCE: overweight JPM over XOM. The macro thesis supports both, but only
one of them still has the thesis available at a price that hasn't discounted it.
```

```
╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BULLISH (Financials)            ║
║ Confidence:  MEDIUM                          ║
║ Horizon:     MEDIUM-TERM                     ║
║ Score:       6.8 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      BUY JPM (staged) / HOLD XOM     ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

**Sources:** [FOMC / rate expectations](https://www.forbes.com/sites/investor-hub/article/fed-meeting-tracker-interest-rate-strategy/) ·
[June 2026 CPI, BLS](https://www.bls.gov/news.release/cpi.nr0.htm) ·
[Treasury yield curve, 24 Jul 2026](https://streetstats.finance/rates/treasuries/) ·
[YTD sector performance](https://csimarket.com/markets/markets_glance.php?days=ytd) ·
[XOM](https://stockanalysis.com/stocks/xom/statistics/) · [JPM](https://stockanalysis.com/stocks/jpm/statistics/)

---

### 3.18 Workflow G — Manage a Position You Already Own (live run: AVGO)

**Setup:** you hold **20 shares of Broadcom at an average cost of $420**, bought near the
highs. It now trades at **$381.92** — you are down 9.1%. You want a plan, not a hunch.
Target position size: 60–100 shares.

**Commands run:**

```bash
/us-stock-analysis:stock-eval AVGO
/us-stock-analysis:bear-case AVGO
/us-stock-analysis:technical-analysis AVGO
/us-stock-analysis:portfolio-review
/us-stock-analysis:position-ladder AVGO — hold 20 @ $420, now $381.92, target 60-100 shares
```

**Step 1 — Is the thesis intact? (If not, this is an exit, not a ladder.)**

```
STOCK-EVAL
  Price / Market cap    $381.92 / $1.82T
  Revenue (TTM)         $75.47B      Net income $29.32B      FCF $32.76B
  Gross margin          76.28%       Operating margin 44.17%
  ROIC                  24.22%
  Debt / Cash           $64.91B / $19.63B  → net debt $45.28B (1.4× TTM FCF)
  P/E TTM 63.56  |  Forward P/E 24.23  |  EV/FCF 56.84
  Dividend yield        0.68%        Next earnings 3 Sep 2026

BEAR-CASE (the red team)
  • EV/FCF 56.84 against a 24.22% ROIC — priced for the AI cycle to persist
  • Net debt $45.28B is the residue of the VMware deal; software integration risk
    is not finished
  • Custom-ASIC revenue is concentrated in a small number of hyperscaler customers
  • Trailing P/E 63.56 vs. forward 24.23 means the entire valuation case rests on
    forward estimates being delivered

WHAT ACTUALLY HAPPENED SINCE PURCHASE (checked against news, not price)
  • Samsung–Broadcom MOU, ~$200B, memory + foundry, five-year AI programme
    through 2030                                            [1 day ago]
  • Apple custom-silicon supply agreement, ~$30B, US-made   [18 days ago]
  • Standard Chartered infrastructure win                   [10 days ago]

VERDICT: the thesis has STRENGTHENED, not broken. Two very large multi-year design
wins landed after the position was opened. The 9.1% drawdown is price, not news.
→ A ladder is appropriate. This is the gate the skill checks first, and it passes.
```

**Step 2 — Technicals: where the rungs go**

```
Price                 $381.92   (day range $378.75 – $389.27, −2.69%)
52-week range         $281.61 – $495.00      → 22.8% below the 52-week high
Moving averages       20d $381.40 | 50d $399.35 | 100d $381.20 | 200d $364.93
RSI (14)              47.83 — neutral. Not oversold; no bounce to chase.
ATR (14)              $16.21 (4.25% of price)

STRUCTURE: price is sitting exactly on the 20-day/100-day cluster ($381.2–381.4),
below the 50-day, and 4.7% above the 200-day. ATR of $16.21 sets rung spacing —
rungs closer than ~1 ATR just fill on noise.
```

**Step 3 — Ceiling from portfolio concentration, not conviction**

```
PORTFOLIO-REVIEW
  Max single-position weight (policy)     8%
  At $381.92, the 8% cap converts to a different share ceiling for every
  portfolio size — so the ceiling is a function of YOUR account, not of AVGO:

    Portfolio     8% cap      Shares affordable    Binding ceiling
    ─────────────────────────────────────────────────────────────────
    $400K         $32,000            83            83  ← policy binds
    $477.4K       $38,192           100           100  ← policy binds exactly
    $600K         $48,000           125           100  ← target band binds

  The 100-share plan below therefore REQUIRES a portfolio of at least $477.4K
  (= 100 × $381.92 ÷ 0.08). On a smaller account the policy sets a lower
  ceiling and the ladder must be rebuilt to that number — the deepest rungs
  get dropped, not squeezed in.

  This run assumes a $500K portfolio → 8% = $40,000 → 104 shares affordable,
  so the binding ceiling is the 100-share top of the target band.
  Conviction does not get a vote in either case.
```

**Step 4 — The ladder**

```
ENTRY LADDER — AVGO, rungs anchored on real levels, spaced ≈1 ATR ($16.21)

Rung  Price     Shares  Cum sh  Cum cost   Avg cost   Anchor
────────────────────────────────────────────────────────────────────────────────
 (0)  $420.00      20      20   $ 8,400.00  $420.00   existing position
  1   $381.92      15      35   $14,128.80  $403.68   spot / 20d + 100d MA cluster
  2   $365.00      15      50   $19,603.80  $392.08   200-day MA ($364.93)
  3   $348.00      20      70   $26,563.80  $379.48   200d − 1 ATR
  4   $330.00      15      85   $31,513.80  $370.75   round number, −1 ATR again
  5   $310.00      15     100   $36,163.80  $361.64   deep rung; 10% above 52w low

FLOOR / CEILING
  Share floor (never sell below):   20   (the original position — thesis intact)
  Share ceiling (portfolio policy): 100
  New capital required at full fill: $27,763.80
  Average cost at full fill:        $361.64  (down 13.9% from $420.00)

TRIM / RE-ADD CYCLE
  Trim trigger:   +12% above the running average cost
  Re-add trigger: back to the rung below
  Worked example: at 100 shares / $361.64 avg, trim 20 @ $430 → $8,600 proceeds,
                  80 shares retained, realised gain $1,367 on the trimmed lot.

WASH-SALE CHECK
  ⚠️  Rungs 1–5 all purchase within 30 days of each other. If you later sell ANY
      lot at a loss, every purchase inside the ±30-day window around that sale
      disallows the loss and rolls it into basis. With five rungs inside one
      quarter, a tax-loss harvest is effectively unavailable until 31 days after
      the final rung fills. Plan the harvest, or plan the ladder — not both.
```

**Step 5 — The honesty check (this is the part people skip)**

```
TOTAL RETURN: LADDER-WITH-TRIM vs. NO-TRIM

  Assume the ladder fills to 100 shares @ $361.64 average, you trim 20 @ $430,
  and the stock then runs to the 52-week high of $495.00.

    Trim, then hold 80:   80 × $495.00 + 20 × $430.00  =  $48,200
    No trim, hold 100:   100 × $495.00                 =  $49,500
    ─────────────────────────────────────────────────────────────
    COST OF THE TRIM:                                     −$1,300

  Your average cost looked better. Your account was $1,300 worse off.
```

> **A lower average cost is not a profit.** Averaging down improves a *ratio*; it does
> not create a *return*. In a strong rally the trim leg actively costs money, and the
> skill reports that in dollars rather than hiding it behind a nicer-looking cost basis.
> Run the ladder because it manages the risk of being wrong about timing — not because
> the average-cost number feels good.

**Thesis-break exit gate** — the ladder is void, and you sell rather than add, if any of
these become true:

```
□  Samsung or Apple design win is cancelled, materially reduced, or delayed past 2027
□  Custom-ASIC revenue growth turns negative in two consecutive quarters
□  Gross margin falls below 70% (from 76.28%) — signals pricing power loss
□  Net debt / FCF exceeds 2.5× (from 1.4×) without an accretive acquisition
□  Price closes below $281.61 (the 52-week low) — the market knows something you don't
```

```
╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BULLISH                         ║
║ Confidence:  MEDIUM                          ║
║ Horizon:     LONG-TERM                       ║
║ Score:       7.1 / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      BUY (staged, 5 rungs)           ║
║ Conviction:  MODERATE                        ║
╚══════════════════════════════════════════════╝
```

*Ladder Suitability Score: 7.1 — this rates how appropriate staged accumulation is right
now, not how attractive the stock is in absolute terms.*

**Sources:** [stockanalysis.com/stocks/avgo](https://stockanalysis.com/stocks/avgo/statistics/) ·
[Barchart AVGO technicals](https://www.barchart.com/stocks/quotes/AVGO/technical-analysis) ·
Samsung/Apple design-win coverage via stockanalysis.com news feed, 24 Jul 2026

---

### What the seven runs have in common

| Workflow | Ticker | Outcome | The reason it landed there |
|---|---|---|---|
| A — Pre-earnings | AAPL | **Trim, don't add** | Business strong; price at the 52-week high with a 5.38% implied move |
| B — Value screen | PFE | **Value trap** | 7% yield costs 103% of free cash flow; $17–18B of contractual LOE |
| C — Dividend sleeve | JNJ/ABBV/PG | **Diversify first** | Safety fine, but 2.52% yield and 67% healthcare |
| D — Swing trade | UPST | **No trade** | 31% float short, but 0 of 3 technical confirmations and 1.17:1 R:R |
| E — Full memo | NVDA | **Stage in** | Great business; price already requires ~35% FCF growth |
| F — Sector rotation | XOM / JPM | **Prefer JPM** | Energy's macro call is already in estimates; Financials' is not |
| G — Position ladder | AVGO | **Ladder, 5 rungs** | Thesis strengthened on news; drawdown is price, not information |

Three of the seven end in "no" or "not yet." Two more end in "yes, but smaller and slower
than you wanted." That distribution is the product working correctly — the value of a
framework is that it disagrees with you sometimes.

---

## 4. Practical Workflows

Real-world investor scenarios showing how to combine multiple skills.

---

### Workflow A — Pre-Earnings Deep Dive

**Scenario:** Earnings are in 3 days. You want to know if the setup is worth holding through.

> ▶ See this run live on AAPL: [3.12](#312-workflow-a--pre-earnings-deep-dive-live-run-aapl)

```bash
# Step 1: Check analyst expectations vs. historical beats
/us-stock-analysis:earnings-call-analysis AAPL Q2-2026
# Look for: guidance accuracy track record, tone shift, beats/misses

# Step 2: Scan options market for implied move
/us-stock-analysis:options-analysis AAPL
# Look for: implied volatility rank, straddle price, unusual put/call activity

# Step 3: Check insider activity before lockout
/us-stock-analysis:insider-trading AAPL
# Look for: any CEO/CFO purchases or unusual sales in past 60 days

# Step 4: Technical setup — is the stock at a good risk/reward level?
/us-stock-analysis:technical-analysis AAPL
# Look for: proximity to support/resistance, whether it's overbought into earnings

# Decision matrix:
# - Positive earnings tone history + low IV rank + insider buys + at support = Hold through
# - Negative tone shift + high IV rank + insider sales + at resistance = Reduce before
```

---

### Workflow B — Value Stock Screening

**Scenario:** You found a stock that looks cheap on P/E. Is it a value trap or a genuine opportunity?

> ▶ See this run live on PFE: [3.13](#313-workflow-b--value-stock-screening-live-run-pfe)

```bash
# Step 1: Quality check first — cheap can stay cheap if the business is bad
/us-stock-analysis:stock-eval PFE
# Look for: Piotroski F-score, ROIC vs. WACC, moat assessment

# Step 2: Understand why it's cheap
/us-stock-analysis:competitor-analysis PFE
# Look for: market share trends, moat erosion, competitive threats

# Step 3: Read the last annual report for red flags
/us-stock-analysis:financial-report-analyst PFE 10-K
# Look for: risk factor changes, management tone, accounting quality

# Step 4: Build the valuation with appropriate discount
/us-stock-analysis:dcf-valuation PFE --scenarios
# Use conservative assumptions — if it's still cheap, that's interesting

# Step 5: Validate the output
/us-stock-analysis:result-validator
# Paste the DCF output — check if assumptions are defensible

# Value trap signals: ROIC < WACC, moat eroding, FCF declining, management tone defensive
# Genuine value signals: ROIC > WACC, short-term headwind, improving FCF, insider buying
```

---

### Workflow C — Dividend Portfolio Construction

**Scenario:** Building a dividend income portfolio and evaluating 3 candidates.

> ▶ See this run live on JNJ / ABBV / PG: [3.14](#314-workflow-c--dividend-portfolio-construction-live-run-jnj--abbv--pg)

```bash
# Evaluate each candidate for dividend safety and growth
/us-stock-analysis:dividend-analysis JNJ
/us-stock-analysis:dividend-analysis ABBV
/us-stock-analysis:dividend-analysis PG

# For each: note Safety Score, 5Y DGR, Payout Ratio, and Yield
# Build a comparison table:
# Ticker | Yield | Safety | 5Y DGR | Payout Ratio | Decision
# JNJ    | 3.1%  | 9.1    | 5.8%   | 38%          | Core
# ABBV   | 4.2%  | 7.2    | 8.1%   | 52%          | Satellite
# PG     | 2.5%  | 9.4    | 5.2%   | 61%          | Core

# Check portfolio-level impact
/us-stock-analysis:portfolio-review
# Add the 3 positions and see how they affect overall yield and sector balance

# Tip: Target portfolio yield of 3%+ with average Safety Score > 7.5
```

---

### Workflow D — Swing Trade Setup

**Scenario:** Looking for a short-term technical trade with defined risk.

> ▶ See this run live on UPST — and note that it ends in *no trade*: [3.15](#315-workflow-d--swing-trade-setup-live-run-upst)

```bash
# Step 1: Screen for short squeeze potential
/us-stock-analysis:short-interest UPST
# Look for: short float > 20%, days-to-cover > 5, borrow rate rising

# Step 2: Confirm with technicals
/us-stock-analysis:technical-analysis UPST
# Look for: price above 20-day MA, RSI recovering from oversold, volume surge

# Step 3: Options setup for defined risk
/us-stock-analysis:options-analysis UPST
# Look for: call skew, low-cost entry strikes, OI building above current price

# Step 4: Visualize the setup
/us-stock-analysis:chart-master UPST --type price-volume
# Look for: breakout pattern, volume confirmation

# Trade structure: long call or call spread to cap risk to premium paid
# Exit: price target (resistance) or time stop (2-4 weeks max for swing)
```

---

### Workflow E — Full Investment Memo (1-command)

**Scenario:** You want a complete investment memo for a stock before a significant position.

> ▶ See this run live on NVDA: [3.16](#316-workflow-e--full-investment-memo-live-run-nvda)

```bash
# One command — produces a full HTML report with all 15 analysis modules
/us-stock-analysis:full-report NVDA

# Opens as: output/NVDA-full-report.html
# Includes: all signal blocks, interactive charts, football field valuation,
#           sector comparison, risk matrix, entry/exit strategy

# After reading, validate the composite output:
/us-stock-analysis:result-validator
# Paste the composite signal block — get a confidence score and any gaps flagged
```

---

### Workflow F — Macro-Driven Sector Rotation

**Scenario:** Rates are rising and you want to understand which sectors benefit.

> ▶ See this run live on the July 2026 regime (XOM vs JPM): [3.17](#317-workflow-f--macro-driven-sector-rotation-live-run-july-2026-regime)

```bash
# Step 1: Understand current macro regime
/us-stock-analysis:economics-analysis
# Look for: yield curve shape, Fed language, leading indicators, inflation trend

# Step 2: Identify which sectors historically outperform in this environment
/us-stock-analysis:sector-analysis
# Look for: rate-sensitive vs. rate-beneficiary sectors, relative strength

# Step 3: Pick a stock within the favored sector
/us-stock-analysis:stock-eval JPM       # Financials benefit from higher rates
/us-stock-analysis:stock-eval XOM       # Energy benefits from inflation regime

# Step 4: Check the portfolio impact of the rotation
/us-stock-analysis:portfolio-review
# Paste current holdings — see if adding JPM/XOM reduces rate sensitivity
```

---

### Workflow G — Manage a Position You Already Own

**Scenario:** You bought a stock at $128, it's now $122, and you want a plan instead of a hunch.

> ▶ See this run live on AVGO: [3.18](#318-workflow-g--manage-a-position-you-already-own-live-run-avgo)

```bash
# Step 1: Is the thesis still intact? (If not, this is an exit, not a ladder.)
/us-stock-analysis:stock-eval AVGO
/us-stock-analysis:bear-case AVGO
# Look for: has anything been falsified, or is this just price weakness?

# Step 2: Get real support levels to anchor the rungs on
/us-stock-analysis:technical-analysis AVGO
# Look for: the support table and ATR — these set rung spacing and depth

# Step 3: Set the ceiling from portfolio concentration, not from conviction
/us-stock-analysis:portfolio-review
# Paste holdings — how many shares can this position hold at max?

# Step 4: Build the plan
/us-stock-analysis:position-ladder AVGO — hold 20 @ $128, now $122, target 60-100 shares

```bash
/us-stock-analysis:trade-setup AAPL
# ticker-only: entry gates + recommends SWING vs POSITION
```
# Returns: rung table, capital at full fill, trim/re-add cycle, wash-sale flags,
#          and the total-return-vs-buy-and-hold check
```

**Read the output honestly:** a lower average cost is not a profit. Check the
total-return comparison — in a strong rally the trim leg *costs* you money, and the
plan says so in dollars.

---

## 5. Cross-AI Usage

InvestSkill works with any AI assistant. The `prompts/` directory contains all 27 analysis frameworks as standalone files.

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

# Generate a chart
> @prompts/chart-master.md Create a fair-value range chart for NVDA
```

### GitHub Copilot

The `.github/copilot-instructions.md` file is automatically loaded as workspace context.

```
# In Copilot Chat (VSCode or github.com)
Analyze NVDA using the stock-valuation framework

# Reference a specific prompt
Use the framework in @workspace /prompts/dcf-valuation.md to value MSFT

# Portfolio review
Use @workspace /prompts/portfolio-review.md to evaluate this portfolio: [paste holdings]
```

### Cursor

The `.cursor/rules/invest-skill.mdc` file is auto-applied in Cursor.

```
# Cursor AI Chat
@prompts/fundamental-analysis.md Analyze GOOGL's financial statements

# Or just ask naturally — Cursor knows the frameworks
Run a DCF valuation of AMZN using the InvestSkill methodology

# Full report
@prompts/full-report.md Generate a complete investment report for TSLA
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

## 6. Tips & Best Practices

### Getting Better Results

**Be specific about the company and context:**
```bash
# Good
/stock-eval NVDA                    # Clear ticker
/dcf-valuation MSFT --scenarios     # With flag for richer output

# Even better — add context
/financial-report-analyst AAPL      # Then paste the actual 10-K text
/earnings-call-analysis META        # Then paste the transcript
```

**Chain skills for deeper analysis:**
```bash
# Step 1: Get the fundamentals
/fundamental-analysis MSFT

# Step 2: Value the business
/dcf-valuation MSFT --scenarios

# Step 3: Check competitive position
/competitor-analysis MSFT

# Step 4: Validate the output
/result-validator    # paste the analysis — catch gaps before acting

# Step 5: Or run everything at once
/research-bundle MSFT
# Or generate a full HTML report:
/full-report MSFT
```

### Choosing the Right Skill

| Your Question | Best Skill |
|---------------|-----------|
| "Is this stock cheap or expensive?" | `/dcf-valuation` + `/stock-valuation` |
| "Is this a good business?" | `/stock-eval` + `/competitor-analysis` |
| "How does this whole industry work, and who profits?" | `/industry-map` |
| "What's in this earnings report?" | `/financial-report-analyst` |
| "What did management say on the call?" | `/earnings-call-analysis` |
| "What are insiders doing?" | `/insider-trading` |
| "Is this dividend safe?" | `/dividend-analysis` |
| "Where is the stock technically?" | `/technical-analysis` |
| "Full deep-dive before I invest" | `/research-bundle` or `/full-report` |
| "Is this a squeeze candidate?" | `/short-interest` |
| "Is my portfolio balanced?" | `/portfolio-review` |
| "Can I trust this analysis?" | `/result-validator` |
| "I need a chart for my report" | `/chart-master` |

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
5. **Give your holdings list** when running `portfolio-review`

### Validating AI-Generated Analysis

AI analyses can contain plausible-sounding but incorrect assumptions. Best practices:

- Always run `/result-validator` after a DCF or complex valuation
- Cross-check key numbers (revenue, margins) against the company's actual filings
- Treat a HIGH confidence score as "worth acting on with normal sizing" — not a guarantee
- When scores are 4–6 (Neutral), the AI is genuinely uncertain — match your conviction to that

---

## Disclaimer

InvestSkill provides educational analysis frameworks only. Nothing in this project constitutes financial advice. All outputs are AI-generated analyses based on the methodologies embedded in the skills — they are not guarantees of future performance. Always consult a qualified financial advisor before making investment decisions.
