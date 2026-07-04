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
4. [Practical Workflows](#4-practical-workflows)
5. [Cross-AI Usage](#5-cross-ai-usage)
6. [Tips & Best Practices](#6-tips--best-practices)

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

You should see `us-stock-analysis` in the list with 21 available skills.

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
└── ... (21 skills total)
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

## 4. Practical Workflows

Real-world investor scenarios showing how to combine multiple skills.

---

### Workflow A — Pre-Earnings Deep Dive

**Scenario:** Earnings are in 3 days. You want to know if the setup is worth holding through.

```bash
# Step 1: Check analyst expectations vs. historical beats
/us-stock-analysis:earnings-call-analysis AAPL Q3-2024
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

```bash
# Step 1: Quality check first — cheap can stay cheap if the business is bad
/us-stock-analysis:stock-eval INTC
# Look for: Piotroski F-score, ROIC vs. WACC, moat assessment

# Step 2: Understand why it's cheap
/us-stock-analysis:competitor-analysis INTC
# Look for: market share trends, moat erosion, competitive threats

# Step 3: Read the last annual report for red flags
/us-stock-analysis:financial-report-analyst INTC 10-K
# Look for: risk factor changes, management tone, accounting quality

# Step 4: Build the valuation with appropriate discount
/us-stock-analysis:dcf-valuation INTC --scenarios
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

```bash
# Step 1: Screen for short squeeze potential
/us-stock-analysis:short-interest GME
# Look for: short float > 20%, days-to-cover > 5, borrow rate rising

# Step 2: Confirm with technicals
/us-stock-analysis:technical-analysis GME
# Look for: price above 20-day MA, RSI recovering from oversold, volume surge

# Step 3: Options setup for defined risk
/us-stock-analysis:options-analysis GME
# Look for: call skew, low-cost entry strikes, OI building above current price

# Step 4: Visualize the setup
/us-stock-analysis:chart-master GME --type price-volume
# Look for: breakout pattern, volume confirmation

# Trade structure: long call or call spread to cap risk to premium paid
# Exit: price target (resistance) or time stop (2-4 weeks max for swing)
```

---

### Workflow E — Full Investment Memo (1-command)

**Scenario:** You want a complete investment memo for a stock before a significant position.

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

## 5. Cross-AI Usage

InvestSkill works with any AI assistant. The `prompts/` directory contains all 24 analysis frameworks as standalone files.

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
