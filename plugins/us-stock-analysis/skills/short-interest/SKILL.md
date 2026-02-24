---
description: Analyze short interest, short squeeze potential, and bearish positioning signals
---

# Short Interest Analysis

Comprehensive analysis of short selling activity, squeeze potential, cost-of-borrow dynamics, and bearish positioning signals for US-listed stocks. Combines FINRA short interest data, options market signals, and technical context to assess directional risk.

## Analysis Framework

### 1. Short Interest Overview

Measure the current level and trend of bearish positioning:

**Core Short Interest Metrics**
- **Short interest (shares)**: Total number of shares sold short and not yet covered or closed
- **Short float %**: Short shares / Total float (shares available for public trading)
- **Short interest as % of shares outstanding**: Short shares / Total shares outstanding (includes locked-up insider shares)
- Float % is the more actionable metric — tighter supply amplifies squeeze dynamics

**Short Float % Thresholds**
```
Short Float %     Interpretation
<2%               Negligible — minimal bearish conviction
2-5%              Low — modest skepticism or hedging
5-10%             Moderate — meaningful bearish positioning
10-20%            Elevated — significant short thesis in market
20-30%            High — heavy bearish conviction, squeeze potential
>30%              Extreme — high risk environment (squeeze OR fundamental collapse)
```

**Days to Cover (Short Interest Ratio)**
- Formula: Short interest (shares) / Average daily trading volume
- Represents: how many trading days it would take all shorts to cover at normal volume
- Also called: Short Interest Ratio (SIR)

```
DTC Range         Interpretation
<1 day            Very low — shorts can exit quickly
1-3 days          Low — manageable exit risk for shorts
3-5 days          Moderate — some covering friction
5-10 days         Elevated — meaningful covering difficulty
>10 days          High — forced covering creates significant price pressure
>20 days          Extreme — structural squeeze conditions present
```

**Change in Short Interest Trend**
- Compare last 4 reporting periods (approximately 2 months)
- Increasing short interest: bears building positions, growing conviction against stock
- Decreasing short interest: short covering, thesis deterioration, or squeeze in progress
- Spike in short interest: new negative catalyst or activist short report
- Rapid decline in short interest: covering rally in progress, thesis proved wrong

### 2. Short Squeeze Potential Assessment

**Squeeze Score (0-10 Composite)**

Assign points based on the following conditions:
- Short float > 20%: +3 points (high short interest is the core prerequisite)
- Days to Cover > 10: +2 points (exit difficulty creates forced buying)
- Recent positive catalyst (earnings beat, product launch, partnership, FDA approval): +2 points
- Strong price momentum (price above 50-day moving average): +1 point
- Limited share supply (small float < 50 million shares): +1 point
- High borrow rate (annualized cost > 5%): +1 point (shorts paying carrying cost = time pressure)

```
Squeeze Score     Probability Assessment
0-2               Low — insufficient conditions for meaningful squeeze
3-4               Moderate — partial conditions met, monitor for catalysts
5-6               High — most conditions met, squeeze possible on catalyst
7-8               Very High — strong squeeze setup, catalyst likely to trigger
9-10              Extreme — textbook squeeze conditions, high probability event
```

**Three Requirements for High-Probability Squeeze**

All three must be present simultaneously:
1. **High short interest**: Float% > 15% AND DTC > 7 days (supply-demand imbalance)
2. **Catalyst or forced covering trigger**: positive news, options expiration forcing hedging, index inclusion, or institutional accumulation
3. **Limited downside floor**: fundamental support (valuation floor, asset value) or strong technical support level that prevents shorts from adding

**Historical Squeeze Pattern Reference**
- GameStop (GME) January 2021: 140% short float + retail coordination + options gamma cascade
- Volkswagen (VW) October 2008: Porsche cornered supply, DTC extreme, short float near 13% of total shares outstanding
- Common precursors: borrow rate spikes sharply before price spike, DTC > 10 sustained for weeks, options call OI builds in OTM strikes
- Key lesson: squeezes are self-reinforcing — covering buying creates price increase which triggers more covering

### 3. Borrow Rate and Cost of Short

**Borrow Rate Tiers**
```
Annualized Rate    Classification    Interpretation
<1%               General Collateral  Easy to borrow — no friction on shorts
1-5%              Easy to Borrow      Low cost, ample supply available
5-15%             Hard to Borrow      Elevated cost, supply becoming scarce
15-30%            Very Hard           Significant carry cost, time pressure on shorts
>30%              Extreme / Recall    Near impossible to maintain at sustainable cost
```

**Borrow Rate Impact Analysis**
- At 20% annualized borrow rate: a short position costs shorts approximately 20 cents per $1 of position per year
- High borrow rates create urgency to cover — especially if stock trades sideways or up
- Borrow availability changes: easy to borrow → hard to borrow transition signals supply tightening
- **Recall risk**: Prime brokers can recall shares on loan with short notice, forcing mandatory covering
- Borrow rate spike (rapid increase in 1-2 weeks) is a leading indicator of pending squeeze

**Implications of Borrow Dynamics**
- High borrow cost + high short interest = unstable equilibrium
- Time works against short sellers in high-borrow-rate environments
- Tracking borrow rate trend over 30-60 days is more valuable than single-point reading

### 4. Bearish Thesis Evaluation

Understand why short sellers are positioned against the company:

**Common Short Thesis Categories**
- **Accounting concerns**: Revenue recognition irregularities, off-balance-sheet liabilities, undisclosed related-party transactions (Hindenburg Research, Muddy Waters Research methodologies)
- **Business model deterioration**: Loss of competitive advantage, customer churn, unit economics breakdown
- **Competition threats**: New entrant disrupting market, margin compression from rivals
- **Regulatory or legal risk**: Pending investigations, product liability, antitrust exposure
- **Valuation excess**: Momentum short — stock priced for perfection with no margin of safety (SPAC shorts, meme stocks)
- **Structural decline**: Industry secular headwinds, obsolescence risk, debt spiral

**Short Seller Credibility Assessment**
- Known activist short sellers (Hindenburg, Citron, Muddy Waters, Gotham City): publish detailed reports, track record publicly known
- Hedge fund shorts (13F disclosures): disclosed quarterly, often fundamental/valuation-based
- Anonymous internet posts: low credibility, but sometimes contain legitimate leads
- Evaluate track record: success rate of prior short thesis for identified short seller

**Counterarguments to Short Thesis**
- What data would disprove the bearish case?
- Has management addressed the concerns publicly?
- Are there independent analysts or auditors refuting the claims?
- Is there a fundamental value floor (book value, sum-of-parts) that limits downside?
- Has the stock already priced in the worst-case scenario?

### 5. Options Market Signal Integration

Read options positioning as a forward-looking indicator of expected moves:

**Put/Call Ratio Analysis**
- Put/Call open interest ratio > 1.5: heavy hedging or speculative bearish bet
- Put/Call volume ratio spike: institutional protection buying (precedes downside)
- Call/Put ratio spike: aggressive bullish buying or short hedge activity
- Compare current ratio vs. 30/60/90-day average to identify anomalies

**Implied Volatility Skew**
- **Negative skew (normal for stocks)**: OTM put IV > OTM call IV — market pricing asymmetric downside
- **Skew steepening**: increasing fear of downside, shorts adding OTM put protection
- **Skew flattening or reversal**: call buying exceeds put buying — squeeze setup or bullish catalyst anticipated
- Track 25-delta put IV minus 25-delta call IV as skew measure

**Large Options Activity Signals**
- Large OTM put purchases (protective hedges from longs or speculative shorts)
- Heavy OTM call buying near key resistance: anticipation of short squeeze catalyst
- Gamma exposure at strikes: dealer hedging requirements create mechanical price pressure at specific levels
- Unusual options activity 1-5 days before price move: informed positioning

### 6. Technical Analysis of Short Positions

**Short Seller Cost Basis Estimation**
- Average price of shares shorted (based on short interest trend vs. stock price timeline)
- Are shorts currently at a profit (stock below average short price) or a loss (stock above)?
- Underwater shorts = trapped shorts = higher squeeze probability as losses mount

**Key Price Levels for Short Positioning**
- Resistance zones where shorts typically initiate positions
- Prior failed breakout levels (shorts cluster above failed resistance)
- 52-week high: shorts often add above if they believe stock is overvalued
- Volume-weighted average price of recent short interest build

**Short Covering Patterns in Price Action**
- Sharp V-reversal on elevated volume with no obvious news: forced covering
- Gap-up openings held and extended: short sellers unable to lean on stock
- Failure to break below support despite negative sentiment: shorts losing control
- Morning spike followed by day-long grind higher: staggered covering through session

**Support Levels Affecting Covering Triggers**
- Key technical support: breakdown below = shorts add, hold = shorts must cover
- 200-day moving average: institutional reference level where shorts reconsider
- Prior consolidation zones: base building = shorts squeezed out on breakout

### 7. Reporting Schedule and Data Lag

**FINRA Short Interest Reporting Calendar**
- Short interest is reported as of the 15th and last business day of each month
- Data published approximately 4-5 business days after the settlement date
- Result: up to a 2-week data lag between actual positioning and publicly available data
- Critical caveat: short interest data reflects past positioning, not current

**Exchange-Reported Short Interest**
- NYSE and NASDAQ publish their own short interest data on similar schedules
- Cross-reference exchange data with FINRA for completeness
- Real-time short volume (vs. short interest) available daily from FINRA and exchanges

**Using Short Volume Data for Fresher Signal**
- Daily short volume (available same day via FINRA Rule 4560): not equal to short interest
- Short volume / total volume ratio: measures daily bearish activity direction
- Short volume ratio > 50% sustained over multiple days: active selling pressure
- Limitation: covers only on-exchange transactions, misses OTC activity

### 8. Risk Considerations

**Risks for Short Sellers**
- Unlimited loss potential: no cap on how high a stock can rise
- Borrow recall: prime broker can force position closure on short notice
- Dividend obligation: short sellers must pay dividends to the shares they borrowed
- Regulatory restrictions: short sale restriction (SSR) rule triggers when stock falls 10% in a day, restricting short sales
- Crowded short: many shorts in same name = all exit simultaneously on negative news = violent squeeze

**Risks for Long Traders Playing Squeeze**
- Crowded momentum trade: late entrants face no new buyers once squeeze exhausts
- Fundamental deterioration: short thesis may be correct — stock declines post-squeeze
- Entry timing risk: squeezes can reverse violently once covering is complete
- Borrow constraints: difficulty exiting short at target because all brokers pulling borrow simultaneously
- Regulatory risk: market manipulation scrutiny for coordinated squeeze activity

**Position Sizing Guidelines**
- Short squeeze plays: high risk/high reward, size accordingly (1-3% of portfolio maximum)
- Risk is binary: squeeze fully materializes or fundamental thesis plays out
- Define exit criteria before entry — both upside target and stop-loss level

### 9. Data Sources

**Short Interest Data**
- **FINRA Short Interest Data**: finra.org/investors/short-sale-volume-data (official, free, twice-monthly)
- **NYSE Short Interest Reports**: NYSE-listed stocks, semi-monthly
- **NASDAQ Short Interest Reports**: NASDAQ-listed stocks, semi-monthly
- **Shortvolume.com**: Free daily short volume data by ticker

**Screeners and Analytics**
- **Finviz**: Short float % in stock screener (sortable, free)
- **Market Chameleon**: Short interest trend charts, borrow rate tracking
- **Iborrowdesk.com**: Free near-real-time borrow rate data from Interactive Brokers and TD Ameritrade

**Premium Short Data**
- **S3 Partners**: Professional-grade short analytics, real-time borrow rates, predictive short interest
- **Interactive Brokers Stock Loan Availability**: Borrow rate and availability for account holders
- **Bloomberg Terminal**: SRFD function for comprehensive short interest data

## Input Formats

### Format 1: Single Stock Analysis
```
User: /short-interest GME

Claude retrieves current short float, DTC, borrow rate, and computes Squeeze Score
```

### Format 2: Squeeze Potential Scan
```
User: /short-interest --scan squeeze-potential

Claude screens for stocks meeting high Squeeze Score criteria (short float >20%, DTC >10, catalyst present)
```

### Format 3: Sector Short Analysis
```
User: /short-interest --sector technology

Claude identifies most shorted technology stocks and evaluates comparative squeeze potential
```

## Output

Provide a comprehensive short interest analysis report with the following sections:

### 1. Short Interest Summary
```
Ticker:                  [TICKER]
Short Float %:           XX.X%       (Threshold: >20% = High)
Short Interest (shares): XX,XXX,XXX
Days to Cover (DTC):     X.X days    (Threshold: >10 = Elevated)
Borrow Rate:             X.X%        (Classification: Easy/Hard/Extreme)
Short Interest Trend:    Increasing / Stable / Decreasing
Last Reporting Date:     [Date]      (Note: ~2-week lag)
```

### 2. Squeeze Score Breakdown
```
Component                     Condition          Points
Short float > 20%             YES / NO           X/3
DTC > 10 days                 YES / NO           X/2
Recent positive catalyst       YES / NO           X/2
Price above 50-day MA         YES / NO           X/1
Float < 50M shares            YES / NO           X/1
Borrow rate > 5%              YES / NO           X/1
                              TOTAL SCORE:       X/10

Squeeze Probability: Low / Moderate / High / Very High / Extreme
```

### 3. Short Thesis Summary
- Primary bear thesis (1-3 sentence summary of why shorts are positioned here)
- Source of short thesis (activist report, valuation, fundamental deterioration)
- Short seller credibility assessment

### 4. Counter-Thesis
- Key arguments that could prove shorts wrong
- Fundamental floor (book value, earnings power)
- Upcoming catalysts that could force covering

### 5. Options Market Context
- Put/Call ratio vs. 30-day average
- IV skew assessment (steep put skew vs. flat)
- Any unusual options activity flagged

### 6. Technical Setup
- Is stock above or below 50/200-day moving average?
- Key support and resistance levels
- Is price action consistent with squeeze initiation or continued decline?

### 7. Risk/Reward Assessment
- For long (squeeze play): upside target, stop-loss, probability-weighted expected return
- For short (bearish thesis): downside target, covering trigger, maximum loss scenario

### 8. Monitoring Triggers
- Short interest change threshold that would upgrade or downgrade squeeze probability
- Catalyst calendar (earnings date, product event, regulatory decision)
- Borrow rate level that signals imminent covering pressure
- Price level that would technically confirm squeeze initiation

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
