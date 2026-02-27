---
description: Analyze company financial reports (10-K, 10-Q, annual reports) and extract actionable investment insights
---

# Financial Report Analyst

Extract deep investment insights from official company financial filings and reports — 10-K annual reports, 10-Q quarterly reports, earnings press releases, proxy statements (DEF 14A), and investor presentations. Combines quantitative financial analysis with qualitative assessment of management tone, strategy, and risk disclosure.

## Overview

Official filings are the primary source of truth for company analysis. Unlike financial data terminals (which aggregate selected metrics), the actual 10-K and 10-Q contain management's own words, full footnote disclosures, legal risk factors, and accounting policy choices that are invisible in summary data feeds. This skill teaches you to read between the lines of official documents and convert dense regulatory language into actionable investment insights.

---

## How to Use

Provide the report in one of these ways:

```
# Paste report text directly
/financial-report-analyst [paste 10-K or 10-Q sections]

# Reference a specific ticker for the most recent filing
/financial-report-analyst AAPL 10-K

# Analyze a specific section
/financial-report-analyst MSFT 10-Q --section risk-factors

# Full deep-dive analysis
/financial-report-analyst NVDA 10-K --full

# Comparative: compare current vs prior period filing
/financial-report-analyst GOOGL --compare-prior
```

---

## Step-by-Step Analysis Framework

### Phase 1: Document Orientation

Before diving into numbers, understand what kind of document this is and what period it covers:

- **Filing Type**: 10-K (annual), 10-Q (quarterly), 8-K (material event), DEF 14A (proxy), S-1 (IPO)
- **Fiscal Period**: Year-end or quarter-end date, fiscal year convention
- **Auditor**: External auditor name and audit opinion type (unqualified, qualified, adverse, disclaimer)
- **Auditor Change**: Any change in auditor is a major red flag — investigate immediately
- **Filing Date**: Note if filed late (extension requests = warning signal)
- **Restatements**: Any prior period restatements disclosed in current filing

---

### Phase 2: Management Discussion & Analysis (MD&A) Deep Read

The MD&A is management's own narrative explanation of results. Read it critically — management has incentives to highlight positives and minimize negatives.

**2.1 Revenue Analysis**

Extract and analyze from MD&A:

```
Revenue Breakdown Table:
Segment/Product Line    Current Period    Prior Period    YoY Change %    Commentary
─────────────────────────────────────────────────────────────────────────────────────
[Segment 1]
[Segment 2]
[Geographic: Americas]
[Geographic: EMEA]
[Geographic: APAC]
─────────────────────────────────────────────────────────────────────────────────────
Total Revenue
```

Key questions to answer from MD&A:
- What does management cite as the primary growth drivers? Are these sustainable or one-time?
- Is growth organic (volume/price) or inorganic (acquisitions)? Separate these explicitly.
- What is the mix shift between high-margin and low-margin products/services?
- Is management guiding to acceleration or deceleration? Are they vague or specific?
- What is the backlog, remaining performance obligations (RPO), or deferred revenue trend?

**2.2 Margin Analysis**

```
Margin Trend Table:
Metric              Current Period    Prior Period    QoQ or YoY    Explanation from MD&A
──────────────────────────────────────────────────────────────────────────────────────
Gross Margin %
Operating Margin %
Net Margin %
Adjusted EBITDA %   (if disclosed)
FCF Margin %        (Operating CF - Capex)
──────────────────────────────────────────────────────────────────────────────────────
```

Red flags in margin discussion:
- Non-GAAP exclusions growing faster than GAAP expenses (SBC, restructuring)
- Gross margin compression attributed to "product mix" without specifics
- COGS increases described only in absolute terms, not as % of revenue
- Operating leverage claims not reflected in actual operating margin expansion

**2.3 Liquidity and Capital Resources**

From the Liquidity section of MD&A, extract:
- Cash and equivalents position (end of period)
- Revolving credit facility (drawn / undrawn capacity)
- Upcoming debt maturities (12-month and 3-year look-ahead)
- Operating cash flow generated in period
- Free cash flow (OCF minus capex)
- Capital allocation priorities stated by management
- Share repurchase authorization remaining
- Dividend policy changes

**2.4 Forward-Looking Statements Analysis**

Catalog management's specific guidance language:

```
Guidance Item         Specific Language Used        Strength (Specific/Vague/Hedged)
────────────────────────────────────────────────────────────────────────────────────
Revenue Guidance
Margin Guidance
Capex Guidance
Hiring/Headcount
Product Launch Timing
────────────────────────────────────────────────────────────────────────────────────
```

Flag: When management shifts from specific numerical guidance to directional language ("we expect continued growth"), this is a meaningful signal of reduced confidence.

---

### Phase 3: Financial Statement Deep Dive

**3.1 Income Statement Quality Assessment**

```
Line Item Analysis:
                    Current    Prior    Change    Quality Note
Revenue             $          $        %
COGS                $          $        %
Gross Profit        $          %GP
R&D                 $          %Rev
S&M                 $          %Rev
G&A                 $          %Rev
Operating Income    $          %OM
Interest Expense    $          $
Tax Rate            %          %
Net Income (GAAP)   $
EPS (GAAP)          $
Non-GAAP EPS        $         Reconciliation items: ___
```

Quality checks:
- **Revenue recognition policy**: Has it changed? Check footnotes for ASC 606 adoption details
- **Channel stuffing signals**: Receivables growing faster than revenue (days sales outstanding expanding)
- **Deferred revenue**: Growing (positive — customers paying ahead) or shrinking (negative)
- **Tax rate**: Unusually low tax rate often driven by one-time benefits; normalize for comparison

**3.2 Balance Sheet Analysis**

```
Balance Sheet Health Check:
Asset Quality:
  Cash & Equivalents:         $___  (% of total assets)
  Accounts Receivable:        $___  DSO: ___ days  (vs. prior: ___)
  Inventory:                  $___  DIO: ___ days  (vs. prior: ___)
  Goodwill & Intangibles:     $___  (% of total assets) — impairment risk?
  Other Long-Term Assets:     $___

Liability Structure:
  Short-Term Debt:            $___  (due within 12 months)
  Long-Term Debt:             $___
  Total Debt:                 $___
  Net Debt/(Cash):            $___
  Interest Coverage Ratio:    ___x  (EBIT / Interest Expense)
  Debt/EBITDA:                ___x

Equity Quality:
  Retained Earnings Trend:    Growing / Declining / Negative
  Treasury Stock:             $___  (buyback history)
  AOCI:                       $___  (pension obligations, FX hedges)
```

Balance sheet red flags:
- Goodwill > 30% of total assets without clear acquisition rationale
- Accounts receivable growing 2x+ faster than revenue (aggressive recognition)
- Inventory build in a demand-softening environment
- Off-balance sheet operating lease obligations (check footnotes — ASC 842)
- Underfunded pension liabilities buried in AOCI

**3.3 Cash Flow Statement — The Truth Teller**

The cash flow statement is the hardest to manipulate. Always reconcile GAAP net income to operating cash flow:

```
Cash Flow Quality Analysis:
Operating Cash Flow:          $___
Less: Capex:                  $___
Free Cash Flow:               $___  FCF Margin: __%
FCF Conversion Rate:          ___   (FCF / Net Income — should be >80% for quality businesses)

Working Capital Changes:
  AR Change (use/source):     $___
  Inventory Change:           $___
  AP Change:                  $___
  Deferred Revenue Change:    $___
  Net Working Capital Impact: $___

SBC Add-Back:                 $___  (% of Revenue — >5% is dilutive)
D&A Add-Back:                 $___  (% of Revenue — maintenance capex proxy)
```

Cash flow quality flags:
- FCF significantly below net income (earnings quality problem)
- Large working capital builds consuming cash (inventory/AR growth)
- SBC >5% of revenue — real dilution not reflected in GAAP net income
- Capex below depreciation for multiple years (under-investment in assets)

---

### Phase 4: Risk Factors Analysis

The Risk Factors section (Item 1A in 10-K) is legally required to disclose material risks. Read for:

**4.1 New vs. Removed Risk Factors**

Compare current filing's risk factors against the prior period:

```
Risk Factor Changes:
NEW Risks Added (first appearance):
  1. [Risk title] — [Category: Business/Regulatory/Macro/Competition/Cyber/Legal]
  2. ...

REMOVED Risks (previously disclosed, now gone):
  1. [What was removed] — [Why might this be significant?]

ELEVATED Risks (same risk, but expanded disclosure or moved higher in list):
  1. [Risk title] — [What changed in the language]
```

Risk categories to flag as highest priority:
- **Regulatory/Legal**: New government investigations, pending litigation, regulatory changes
- **Customer Concentration**: Single customer >10% of revenue disclosed
- **Technology/Competition**: Specific competitor named as existential threat
- **Going Concern**: Doubt about ability to continue as a going concern (immediate red flag)
- **Debt Covenant**: Risk of violating debt covenants disclosed
- **Cybersecurity**: New material cyber incident disclosures (Item 1.05 of 8-K)

**4.2 Litigation and Legal Proceedings**

From footnotes and Item 3 (Legal Proceedings):
- Active lawsuits with >$X million exposure
- SEC or DOJ investigations
- Tax disputes and uncertain tax positions
- Environmental liabilities
- Patent litigation (key for tech and pharma)

---

### Phase 5: Accounting Policy and Footnote Analysis

Footnotes contain what management would prefer investors not to focus on.

**5.1 Critical Accounting Estimates**

Management must disclose "critical accounting estimates" — areas where judgment most affects reported results:

```
Critical Estimate Review:
  Revenue Recognition:   [Policy and any changes]
  Goodwill Impairment:   [Testing methodology, headroom]
  Stock-Based Comp:      [Fair value models, assumptions]
  Deferred Tax Assets:   [Valuation allowance — any new allowances = warning]
  Contingent Liabilities: [What is and isn't accrued]
  Pension/OPEB:          [Return assumption, discount rate]
```

**5.2 Related Party Transactions**

Any transactions between the company and executives, board members, or major shareholders. These require heightened scrutiny for potential conflicts of interest.

**5.3 Segment Reporting**

When companies add or remove reporting segments, investigate:
- Was a previously disclosed segment merged with another? (Often hides underperformance)
- Were goodwill allocations shifted between segments? (Can delay impairment)
- New segment disclosures can reveal previously hidden growth drivers

---

### Phase 6: Management Tone and Language Analysis

Apply natural language analysis to management's own words:

**6.1 Tone Scoring**

Rate management's tone across key sections:

```
Tone Assessment:
Section              Tone Score (1=Very Negative → 5=Very Positive)    Key Language
──────────────────────────────────────────────────────────────────────────────────
MD&A Overview
Revenue Discussion
Margin Discussion
Guidance Language
Risk Factors Framing
CEO Letter (if present)
──────────────────────────────────────────────────────────────────────────────────
Overall Tone:        [Score] / 5
Change vs. Prior:    More Positive / Same / More Negative
```

**6.2 Hedging Language Flags**

Flag specific hedging phrases that indicate uncertainty:
- "We believe" / "we expect" / "we anticipate" — standard forward-looking
- "We cannot assure" / "there can be no assurance" — heightened uncertainty
- "Significant uncertainty" / "material uncertainty" — near-crisis language
- Passive voice for negative news ("challenges were experienced") vs. active voice for positives
- Increasing use of "headwinds," "challenging environment," "softness"

**6.3 Management Credibility Tracking**

```
Guidance Accuracy Scorecard (prior 4 quarters):
Period    Revenue Guidance    Actual    Beat/Miss    Margin Guidance    Actual    Beat/Miss
Q-4
Q-3
Q-2
Q-1
──────────────────────────────────────────────────────────────────────────────────────────
Batting Average: ___  Beat Rate: ___  Avg. Miss: ___
```

---

### Phase 7: Year-over-Year Comparison (for Quarterly Reports)

For 10-Q analysis, compare against the same quarter prior year AND the sequential prior quarter:

```
YoY and Sequential Comparison:
Metric          Current Q    Prior Q (seq)    Prior Year Q    YoY %    QoQ %
Revenue
Gross Margin
Operating Income
EPS (GAAP)
FCF
```

Identify if trends are:
- Accelerating (sequential improvement + YoY beats)
- Stable (sequential flat, YoY in-line)
- Decelerating (sequential miss, YoY still positive)
- Deteriorating (both sequential and YoY misses)

---

### Phase 8: Insider Activity (from Proxy/Form 4 Data)

Cross-reference with available SEC Form 4 data around the filing date:
- CEO/CFO buying on the open market (strong signal — insiders rarely buy for tax purposes)
- Bulk insider selling at prices below historical averages (negative signal)
- New 10b5-1 plan adoptions (scheduled selling — less informative than open market)
- Executive departures disclosed in proxy or 8-K (CFO exits especially significant)

---

## Output Format

### Executive Summary (1-2 paragraphs)

High-level verdict on the filing quality and key takeaways for investors. Address: Is this a better or worse filing than prior periods? What is the single most important thing an investor should take away?

### Financial Health Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  FINANCIAL REPORT ANALYSIS — [TICKER] [Filing Type] [Period]   │
├────────────────────────┬────────────────────────────────────────┤
│ Revenue Growth         │ [%] YoY   [Organic vs. Acquired]       │
│ Gross Margin           │ [%]  (vs. prior: [%]  Δ [bps])         │
│ Operating Margin       │ [%]  (vs. prior: [%]  Δ [bps])         │
│ FCF Margin             │ [%]  (FCF Conversion: [%])              │
│ Net Debt / (Cash)      │ $[M]  (Debt/EBITDA: [x])               │
│ DSO                    │ [days]  (vs. prior: [days])             │
│ Management Tone        │ [Positive / Neutral / Cautious]         │
├────────────────────────┼────────────────────────────────────────┤
│ Filing Quality Score   │ [Score] / 10                           │
│ Earnings Quality Score │ [Score] / 10                           │
│ Balance Sheet Score    │ [Score] / 10                           │
└────────────────────────┴────────────────────────────────────────┘
```

### Key Insights (Bulleted)

**Positives (Bullish Signals):**
- [Specific insight with page/section reference from filing]

**Negatives (Bearish Signals):**
- [Specific insight with page/section reference from filing]

**Neutral / Watch Items:**
- [Items requiring monitoring but not yet actionable]

### Red Flags and Anomalies

| # | Red Flag | Severity | Where Found | Implication |
|---|----------|----------|-------------|-------------|
| 1 | | HIGH/MED/LOW | | |

### Accounting Quality Score

| Criterion | Score (0–3) | Notes |
|-----------|-------------|-------|
| Revenue recognition clarity | | |
| Non-GAAP reconciliation quality | | |
| FCF conversion rate | | |
| Working capital trends | | |
| Footnote transparency | | |
| Auditor opinion | | |
| Related party transactions | | |
| **Total** | **/21** | |

Score guide: 18–21 = High quality | 12–17 = Average | <12 = Scrutinize further

---

## Input Formats Accepted

```bash
# Paste raw text from 10-K or 10-Q sections
/financial-report-analyst [paste filing text]

# Analyze specific section of a recent filing
/financial-report-analyst AAPL 10-K --section md&a
/financial-report-analyst MSFT 10-Q --section risk-factors
/financial-report-analyst NVDA 10-K --section cash-flow

# Full report analysis (all sections)
/financial-report-analyst GOOGL 10-K --full

# Compare current vs prior filing
/financial-report-analyst META 10-K --compare-prior

# Quick earnings press release analysis
/financial-report-analyst AMZN --press-release [paste text]

# Proxy statement analysis
/financial-report-analyst TSLA --proxy
```

---

## Standard Signal Output

All analysis concludes with this standardized block:

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

Score Guide: 8.0–10.0 Strongly Bullish | 6.0–7.9 Moderately Bullish | 4.0–5.9 Neutral | 2.0–3.9 Moderately Bearish | 0.0–1.9 Strongly Bearish
Confidence: HIGH (strong data, clear signals) | MEDIUM (mixed signals) | LOW (limited data, conflicting signals)
Horizon: SHORT-TERM (1 week–3 months) | MEDIUM-TERM (3 months–1 year) | LONG-TERM (1+ years)
