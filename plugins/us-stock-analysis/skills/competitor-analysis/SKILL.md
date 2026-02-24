---
description: Deep competitive moat analysis, market position assessment, and industry dynamics
---

# Competitor Analysis

Conduct deep competitive moat analysis to assess whether a company has a durable competitive advantage, how wide that moat is, and what the competitive dynamics of its industry mean for long-term investment returns.

## Overview

Competitive analysis answers the fundamental question: **"Does this company have a durable competitive advantage, and how wide is its moat?"** This directly determines the appropriate valuation premium or discount vs. the sector.

A company with a wide, widening moat deserves a premium P/E and P/FCF multiple because its excess returns on capital are durable. A company with no moat, or a narrowing moat, should trade at or below sector multiples regardless of near-term earnings momentum. Understanding the moat is the single most important determinant of a stock's long-term investment return — more important than any individual quarterly earnings figure.

This skill provides a structured, repeatable framework for moat identification, industry attractiveness scoring, competitive benchmarking, and innovation positioning. Output feeds directly into `/dcf-valuation` (to set appropriate WACC and terminal growth rate) and `/fundamental-analysis` (to contextualize ROIC and margin trends).

---

## 1. Moat Identification Framework

### Five Sources of Economic Moat (Morningstar Framework)

**1. Network Effects**
Value increases with each additional user or participant in the platform or network.
- Examples: Visa, Mastercard (payment networks), Meta (social graph), Airbnb (marketplace), Microsoft 365 (collaboration network)
- Test: Does adding users benefit existing users? Does the network become more valuable as it scales?
- Signs of network effects: Organic user growth with low CAC, high retention as network grows, winner-take-most dynamics

**2. Cost Advantages**
Structural ability to produce goods or services at lower cost than competitors.
- Sources: Scale advantages (fixed cost leverage), process innovation (proprietary manufacturing), geographic advantage (proximity to inputs), unique asset access (mining rights, owned infrastructure)
- Examples: Costco (buying scale + lean operations), Amazon (logistics scale), Nucor (mini-mill process innovation)
- Test: Can competitors replicate this cost structure at competitive cost? What would it cost to build?

**3. Intangible Assets**
Brands, patents, regulatory licenses, or proprietary data that competitors cannot easily copy.
- Brand: Can the company charge a premium price based on brand perception alone? (Apple, LVMH, Coca-Cola)
- Patents: How many years of exclusivity remain? Is the IP portfolio broad or narrow?
- Regulatory licenses: Are licenses scarce, non-transferable, or expensive to obtain? (broadcast licenses, pharmaceutical approvals, financial licenses)
- Proprietary data: Is the data asset self-reinforcing and competitively irreplicable?
- Test: Can the company charge premium prices, or does the intangible give exclusive market access?

**4. Switching Costs**
High cost — financial, operational, or psychological — for customers to change providers.
- Financial switching costs: Contractual lock-in, migration costs, retraining costs
- Operational switching costs: Deep workflow integration, data portability limitations
- Psychological switching costs: Brand loyalty, habit formation, trust
- Examples: Oracle (ERP deeply embedded in operations), Salesforce (CRM data and workflow integration), Adobe (creative suite skill investment)
- Test: What % of customers have churned in the last 3 years? How long is the average customer tenure?

**5. Efficient Scale**
Company operates in a market that can profitably support only one or a few competitors, creating natural oligopoly or monopoly dynamics.
- Examples: Waste Management (regional landfills), utility companies, specialty chemicals with natural regional monopolies
- Test: Would a new entrant earn below-cost returns given the existing market structure? Is the total addressable market too small to profitably split further?

### Moat Width Assessment

```
Moat Width    Definition                                 ROIC Signal
──────────────────────────────────────────────────────────────────────
Wide Moat     Clear, sustainable advantage 20+ years     ROIC consistently and
              Structural barriers that are durable        significantly > WACC
              Premium P/E valuation appropriate

Narrow Moat   Some advantages, 10–20 year durability      ROIC modestly > WACC
              Barriers exist but can be overcome           Slight premium warranted
              with sufficient capital or time

No Moat       No sustainable competitive advantage         ROIC ≈ WACC or below
              Commodity-like pricing dynamics              In-line sector valuation
              New entrants can replicate economics

Moat at Risk  Previously existing moat is eroding          ROIC declining toward
              Structural disruption underway                or below WACC
              Discount valuation warranted
```

**Moat Trend** (most important forward-looking question):
- **Widening**: Competitive advantages are strengthening, market share is growing, ROIC is increasing
- **Stable**: Moat is intact but not materially widening; returns on capital are consistent
- **Narrowing**: Competitive pressure, disruption, or commoditization is compressing the moat

---

## 2. Porter's Five Forces Deep Analysis

### Force 1: Competitive Rivalry (Intensity within industry)

How intensely do existing competitors compete for market share?

- Number and size distribution of competitors (fragmented vs. concentrated)
- Industry growth rate (slow-growth industries intensify rivalry; fast-growing markets reduce it)
- Product differentiation level (commodity products = intense price competition)
- Exit barriers (high exit barriers trap capacity in the market, intensifying rivalry)
- Fixed cost intensity (high fixed costs create pressure to fill capacity at any price)

**Rivalry Intensity**: Low / Moderate / High / Extreme

### Force 2: Threat of New Entrants

How easily can new competitors enter the market?

- Capital requirements for market entry (low capital = easier entry)
- Economies of scale advantages for incumbents
- Network effect barriers (winner-take-most dynamics deter entry)
- Regulatory and licensing barriers (FDA approvals, financial licenses, environmental permits)
- Brand and customer loyalty barriers (how long would it take to build credibility?)
- Access to distribution channels
- Incumbent cost advantages independent of scale (patents, proprietary processes)

**Entry Threat**: Low / Moderate / High

### Force 3: Bargaining Power of Suppliers

How much leverage do input suppliers have over the company?

- Supplier concentration vs. buyer concentration (few suppliers, many buyers = high supplier power)
- Uniqueness and criticality of the supplied product or service
- Cost of switching suppliers (sole-source vs. multi-source supply chains)
- Supplier forward integration threat (can suppliers bypass the company and sell direct?)
- Importance of the company to the supplier's revenue (are you a large or small customer?)

**Supplier Power**: Low / Moderate / High

### Force 4: Bargaining Power of Buyers (Customers)

How much leverage do customers have to negotiate price or terms?

- Customer concentration (what % of revenue comes from the top 10 customers?)
- Price sensitivity of customers (is the purchase a major budget item or negligible?)
- Switching costs for customers (low switching costs = high buyer power)
- Buyer backward integration threat (can customers build this capability in-house?)
- Availability of information (informed buyers negotiate better)
- Volume buying leverage (large customers extract better terms)

**Buyer Power**: Low / Moderate / High

### Force 5: Threat of Substitutes

What alternatives exist outside the direct competitive set?

- Availability of substitute products or services (different product, same customer job-to-be-done)
- Price-performance improvement rate of substitutes (is the substitute improving faster than the incumbent?)
- Customer propensity to substitute (how much switching actually happens?)
- Relative price of substitutes (cheap substitute + acceptable quality = high threat)
- Example: Streaming vs. cable TV; cloud computing vs. on-premise hardware; electric vehicles vs. internal combustion

**Substitute Threat**: Low / Moderate / High

### Five Forces Summary Score

Score each force 1–5, where 5 = most favorable for the company being analyzed:

```
Force                      Score (1-5)    Assessment
─────────────────────────────────────────────────────────────────
Competitive Rivalry         [1-5]         [description of key dynamics]
New Entrant Threat          [1-5]         [key barriers or lack thereof]
Supplier Power              [1-5]         [key supplier dynamics]
Buyer Power                 [1-5]         [customer concentration, switching costs]
Substitute Threat           [1-5]         [main substitutes and their threat level]
─────────────────────────────────────────────────────────────────
Industry Attractiveness Score:    [X.X / 5]

Score Interpretation:
4.5–5.0  Extremely attractive industry (structural advantages strong)
3.5–4.4  Attractive industry (mostly favorable dynamics)
2.5–3.4  Average industry (mixed dynamics)
1.5–2.4  Unattractive industry (structural headwinds)
1.0–1.4  Highly unattractive (commodity, intense competition, low returns)
```

---

## 3. Market Share Analysis

Understand whether the company is gaining, maintaining, or losing ground in its market:

- **Current market share %** and 3-year trend (gaining / stable / losing)
- **Market share concentration** (Herfindahl-Hirschman Index — HHI — of the industry)
  - HHI > 2,500: Highly concentrated (oligopoly/monopoly dynamics)
  - HHI 1,500–2,500: Moderately concentrated
  - HHI < 1,500: Fragmented (competitive)
- **Market share growth mechanics**: Organic capture vs. M&A-driven share; price-led vs. volume-led
- **Geographic market share variations**: May be dominant in home market, subscale internationally, or vice versa
- **Segment market share**: Company may have commanding share in a high-value niche while being subscale in commodity segments
- **Share gain velocity**: Rate of change matters as much as absolute level. A company gaining 0.5% share annually in a large market is a powerful signal.

---

## 4. Competitive Benchmarking

Compare the company vs. its top 3–5 direct competitors across key financial and operational metrics:

```
Metric                [Company]   [Comp 1]   [Comp 2]   [Comp 3]   Industry Avg
───────────────────────────────────────────────────────────────────────────────────
Revenue Growth (3yr)  [%]         [%]        [%]        [%]        [%]
Gross Margin          [%]         [%]        [%]        [%]        [%]
Operating Margin      [%]         [%]        [%]        [%]        [%]
Net Margin            [%]         [%]        [%]        [%]        [%]
ROIC                  [%]         [%]        [%]        [%]        [%]
ROE                   [%]         [%]        [%]        [%]        [%]
Revenue per Employee  [$k]        [$k]       [$k]       [$k]       [$k]
Customer Retention    [%]         [%]        [%]        [%]        [%]
R&D as % Revenue      [%]         [%]        [%]        [%]        [%]
Gross Profit per $R&D [ratio]     [ratio]    [ratio]    [ratio]    [ratio]
NPS Score             [score]     [score]    [score]    [score]    [score]
Market Share %        [%]         [%]        [%]        [%]        —
```

**Interpretation**: Highlight where the company leads, lags, or matches the peer set. ROIC > industry average consistently = moat evidence. Gross margin premium = pricing power or cost advantage. Higher revenue per employee = efficiency advantage.

---

## 5. Innovation & Disruption Assessment

Evaluate whether the company is positioned as a disruptor or a potential target of disruption:

- **R&D investment level and productivity**:
  - R&D as % of revenue (spending level)
  - Patents filed per $1M R&D (output efficiency)
  - Time-to-market for new product launches vs. peers
- **Product roadmap visibility**: Does management articulate a clear multi-year innovation roadmap with specific milestones?
- **Technology platform assessment**: Is the core technology platform modern (cloud-native, API-first, modular) or legacy (monolithic, on-premise, technical debt-laden)?
- **Disruption positioning**: Is this company the disruptor or the disrupted?
  - Disruptor indicators: Taking share from incumbents, serving underserved segments, improving price-performance faster than industry
  - Disrupted indicators: Losing share to newer platforms, customers migrating to substitutes, pricing power declining
- **Adjacent market opportunities**: What is the total addressable market (TAM) expansion potential? Can the moat extend into adjacent categories?
- **AI/software/platform disruption threat**: Is the industry undergoing a platform shift that could rapidly alter competitive dynamics? (e.g., AI replacing workflow software, direct-to-consumer bypass of distributors)

---

## 6. Management Quality in Competitive Context

Assess whether management is executing effectively in the competitive environment:

- **Capital allocation track record**: Has management invested capital at returns above WACC? What is the M&A track record (value-creative or value-destructive)?
- **Competitive response speed**: How quickly does management respond to competitive threats? (pricing changes, product updates, strategic pivots)
- **Innovation culture indicators**: Employee Glassdoor ratings vs. competitors; pace of product launches; engineering talent density (LinkedIn data); Blind/levels.fyi compensation vs. peers
- **CEO competitive vision**: How does the CEO discuss competition in earnings calls? Dismissive, realistic, or strategically insightful?
- **Track record vs. stated strategy**: Has management delivered on prior competitive strategy commitments? Or does strategy change frequently without execution?

---

## 7. Pricing Power Analysis

Quantify the company's ability to raise prices without losing customers:

- **Premium vs. discount pricing**: Does the company price above, at, or below competitors? What is the quantified price premium?
- **Price increase history**: Has the company raised prices in the last 5 years? Did volume decline, remain stable, or grow despite price increases? (volume stability after price increases = strong pricing power)
- **Customer willingness-to-pay research**: NPS scores, customer satisfaction surveys, retention data, and churn analysis provide indirect evidence of willingness to pay
- **Gross margin expansion/compression trend**: Expanding gross margins while growing revenue = pricing power. Compressing gross margins under competitive pressure = pricing power erosion.
- **Price elasticity indicators**: For consumer businesses, track promotional intensity. Excessive discounting = inability to hold price. For B2B, track deal cycle length and discount rates.

---

## 8. Moat Score Composite

```
Moat Scorecard:
Component                    Weight    Score (0-10)    Notes
──────────────────────────────────────────────────────────────────────
Moat Source Strength           25%      [0-10]         [which of 5 sources are present]
Moat Durability (years)        20%      [0-10]         [wide/narrow/none, estimated longevity]
Competitive Position           20%      [0-10]         [gaining/stable/losing vs. peers]
Industry Attractiveness        15%      [0-10]         [Five Forces score converted to 0-10]
Pricing Power                  10%      [0-10]         [premium pricing, margin trend]
Innovation Positioning         10%      [0-10]         [disruptor/neutral/disrupted]
──────────────────────────────────────────────────────────────────────
Composite Moat Score:         100%      X.X / 10

Moat Assessment:
8–10: Wide Moat (significant valuation premium justified; durable excess returns)
6–8:  Narrow Moat (modest premium warranted; monitor for narrowing)
4–6:  No Clear Moat (in-line with sector valuation; commodity-like returns)
0–4:  Moat at Risk (valuation discount warranted; sell consideration)
```

**Scoring Reference**:
- Moat Source Strength: 9–10 = 3+ strong, reinforcing moat sources; 7–8 = 2 clear sources; 5–6 = 1 credible source; 3–4 = partial/debatable source; 0–2 = no identifiable moat
- Moat Durability: 9–10 = 20+ year visibility; 7–8 = 15+ years; 5–6 = 10 years; 3–4 = 5 years; 0–2 = structural disruption underway
- Industry Attractiveness: Derived from Five Forces score (0–5 scale) × 2 to convert to 0–10

---

## 9. Competitive Intelligence Sources

Use these primary and secondary research sources to build the competitive picture:

**Regulatory and Financial Filings**:
- SEC 10-K "Business" and "Competition" sections — required disclosure of competitive dynamics
- SEC 10-K "Risk Factors" — management's own description of competitive threats
- DEF 14A (proxy statement) — executive compensation tied to competitive metrics
- Competitor 10-K filings — cross-reference to understand industry dynamics

**Management and Qualitative Sources**:
- Earnings call transcripts — frequency and language around competitors signals competitive intensity
- Investor Day presentations — long-term competitive strategy and management conviction
- Glassdoor and LinkedIn — employee satisfaction vs. competitors, talent flow analysis

**Customer and Market Research**:
- G2 / Capterra / TrustRadius — B2B software competitive ratings and reviews
- Yelp / Google Reviews — consumer business competitive positioning
- JD Power — automotive and consumer product competitive rankings
- NPS benchmarks by industry (Bain & Company publishes)

**Technology and Innovation Intelligence**:
- Google Patents / USPTO — patent portfolio analysis and competitive IP positioning
- Job postings analysis (LinkedIn, Indeed) — what skills a company is hiring for signals its strategic direction
- GitHub (for software companies) — open-source activity and developer ecosystem strength
- AlternativeTo / ProductHunt — consumer product competitive landscape mapping

**Industry Research**:
- Gartner Magic Quadrant and Critical Capabilities reports
- Forrester Wave reports
- IDC market share data
- Trade publications specific to the industry vertical

---

## 10. Input Formats

```
# Single company analysis
/competitor-analysis AAPL

# With specific sector context for more targeted analysis
/competitor-analysis MSFT --sector "cloud computing"

# With specified peer group for benchmarking
/competitor-analysis NVDA --peers AMD,INTC,QCOM

# Moat analysis only (faster, focused output)
/competitor-analysis GOOGL --moat-only

# Full analysis with visual output for /report-generator
/competitor-analysis AMZN --visual
```

---

## 11. Visualization Support

When `--visual` flag is used, include chart data tables for report generation:

### Porter's Five Forces Radar Chart
**Chart Type**: Radar/spider chart
```
Force                   Score (1-5)
Competitive Rivalry     [value]
New Entrant Threat      [value]
Supplier Power          [value]
Buyer Power             [value]
Substitute Threat       [value]
```

### Competitive Benchmarking Chart
**Chart Type**: Grouped bar chart
```
Metric          [Company]   [Comp 1]   [Comp 2]   [Comp 3]   Industry Avg
Gross Margin    [%]         [%]        [%]        [%]        [%]
ROIC            [%]         [%]        [%]        [%]        [%]
Revenue Growth  [%]         [%]        [%]        [%]        [%]
```

### Moat Score Components Bar Chart
**Chart Type**: Horizontal bar chart with weighted scores
```
Component               Weighted Score
Moat Source Strength    [value × 0.25]
Moat Durability         [value × 0.20]
Competitive Position    [value × 0.20]
Industry Attractiveness [value × 0.15]
Pricing Power           [value × 0.10]
Innovation Positioning  [value × 0.10]
─────────────────────────────────────
Composite Moat Score:   [X.X / 10]
```

---

## Output

Provide a comprehensive competitive analysis report with:
- Executive Summary (moat assessment, competitive position, trend — 3 sentences)
- Moat Identification (sources present, width, trend, durability estimate)
- Porter's Five Forces Analysis with individual force scores and industry attractiveness score
- Market Share Analysis and 3-year trend
- Competitive Benchmarking table vs. top 3–5 peers
- Innovation & Disruption Assessment
- Pricing Power Analysis
- Management Competitive Quality
- Composite Moat Score Card
- Investment Implications (how moat assessment affects valuation, key competitive risks, bull/bear case for competitive position)

### Enhanced Output (with --visual flag)
- All standard sections above
- Porter's Five Forces radar chart data
- Competitive benchmarking grouped bar chart data
- Moat score components horizontal bar chart data
- Chart specifications for HTML report generation via `/report-generator`

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
