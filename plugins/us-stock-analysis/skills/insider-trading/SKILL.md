---
description: Track and analyze insider buying/selling activity from SEC Form 4 filings
---

# Insider Trading Analysis

Comprehensive analysis of insider transaction activity to identify investment signals, patterns, and potential red flags from SEC Form 4 filings.

## Analysis Framework

### 1. Transaction Summary (Last 6-12 Months)

Provide overview of insider trading activity:

**Transaction Counts**
- Total transactions: [Number]
- Buys: [Number] ([%] of total)
- Sells: [Number] ([%] of total)
- Exercises/Awards: [Number] (non-market transactions)

**Transaction Volume**
- Total value traded: $[Amount]
- Buy volume: $[Amount]
- Sell volume: $[Amount]
- Net insider sentiment: $[Net Amount] (Buy - Sell)

**Active Period Analysis**
- Most active month: [Month]
- Clustered activity periods: [Dates]
- Quiet periods: [Dates]

### 2. Insider Sentiment Analysis

Calculate and interpret net insider sentiment:

**Net Sentiment Calculation**
```
Net Sentiment = (Buy $ - Sell $) / (Buy $ + Sell $)

Ranges:
+0.5 to +1.0  = Strongly Bullish
+0.2 to +0.5  = Moderately Bullish
-0.2 to +0.2  = Neutral
-0.5 to -0.2  = Moderately Bearish
-1.0 to -0.5  = Strongly Bearish
```

**Sentiment Context**
- Current sentiment vs. historical baseline
- Sentiment trend (improving/deteriorating)
- Significance level (number and size of transactions)
- Comparison to peer company insiders

**Reliability Factors**
- Sample size (number of insiders trading)
- Transaction size relative to holdings
- Timing relative to information events
- Consistency across multiple insiders

### 3. Significant Transactions

Highlight meaningful insider trades:

**Criteria for Significance**
- Transaction size > $1 million
- Position change > 10% of holdings
- Unusual timing (near lows/highs, before announcements)
- CEO or CFO transactions
- Multiple insiders trading in same direction within short period

**For Each Significant Transaction**

| Date | Insider | Position | Transaction | Shares | Value | % of Holdings | Price | Notes |
|------|---------|----------|-------------|--------|-------|---------------|-------|-------|
| [Date] | [Name] | [Title] | Buy/Sell | [#] | $[Amount] | [%] | $[Price] | [Context] |

**Transaction Analysis**
- **Bullish Signals**: Large insider buys, clustered buying, CEO purchases, buying near 52-week lows
- **Bearish Signals**: Large insider sells, clustered selling, executive selling before bad news
- **Neutral Signals**: Small routine sells for diversification, 10b5-1 plan executions

### 4. Insider Categories

Analyze transactions by insider role:

**Executive Officers (CEO, CFO, COO)**
- Highest signal value due to information access
- Large transactions particularly meaningful
- Sales less concerning if part of regular compensation

**Board of Directors**
- Independent directors' purchases carry strong signals
- Less frequent trading but often meaningful
- May have strategic visibility beyond operations

**Major Shareholders (>10% owners)**
- Often have board seats or strategic influence
- Large transactions can move markets
- Sales may be for portfolio rebalancing

**Other Insiders (VPs, Senior Managers)**
- Weaker signal but useful in aggregate
- Clustered activity more meaningful than individual trades
- May indicate operational knowledge

### 5. Transaction Types & SEC Forms

Interpret different transaction codes:

**Form 4 Transaction Codes**
- **P (Purchase)**: Open market buy - BULLISH SIGNAL
- **S (Sale)**: Open market sell - BEARISH SIGNAL (but often routine)
- **M (Exercise)**: Option exercise - Neutral
- **F (Tax Payment)**: Shares surrendered for taxes - Neutral
- **A (Award)**: Stock grant/award - Neutral
- **G (Gift)**: Gift transfer - Neutral
- **D (Disposition)**: Return to company - Neutral

**Form 3 vs. Form 4 vs. Form 5**
- **Form 3**: Initial statement of beneficial ownership (new insider)
- **Form 4**: Changes in ownership (filed within 2 business days)
- **Form 5**: Annual statement of changes (deferred reporting)

**10b5-1 Trading Plans**
- Pre-arranged trading plans to avoid insider trading allegations
- Marked in filings if transaction was under 10b5-1
- Less signal value than discretionary trades
- Look for plan adoption/termination patterns

### 6. Ownership Trends

Track changes in insider ownership percentage:

**Current Ownership Structure**
- Total insider ownership: [%]
- CEO ownership: [%]
- Top 5 insiders combined: [%]

**Ownership Trend (12 months)**
```
Quarter        Total Insider %    Change from Prior
Q4 2024            15.2%            +0.3%
Q3 2024            14.9%            -0.1%
Q2 2024            15.0%            +0.5%
Q1 2024            14.5%            +0.2%
```

**Interpretation**
- **Increasing ownership**: Insiders accumulating = Bullish
- **Stable ownership**: Confidence maintained = Neutral to Bullish
- **Decreasing ownership**: Distribution = Bearish (but check reasons)

**Skin in the Game Assessment**
- High insider ownership (>20%): Strong alignment
- Medium ownership (10-20%): Adequate alignment
- Low ownership (<10%): Weaker alignment
- CEO ownership relative to compensation

### 7. Timing Analysis

Evaluate timing of insider transactions:

**Relative to Stock Price**
- Buying near 52-week lows: Strong bullish signal
- Buying after significant decline: Contrarian confidence
- Selling near 52-week highs: Less bearish (profit-taking)
- Selling before decline: Red flag if not disclosed later

**Relative to Information Events**
- Before earnings release
- Before major announcements (M&A, product launches)
- During blackout periods (should be restricted)
- After significant news (reaction to public information)

**Seasonal Patterns**
- Post-earnings window trading (common)
- Year-end tax-loss selling
- Quarterly option exercise cycles
- Annual equity grant patterns

**Red Flag Timing**
- Trading during supposed blackout periods
- Selling shortly before bad news announcement
- Exercising and immediately selling (vs. holding)
- Rapid succession of sells by multiple insiders

### 8. Pattern Recognition

Identify meaningful patterns in trading activity:

**Bullish Patterns**
- Clustered buying by multiple insiders within 1-2 weeks
- First-time purchases by long-tenured executives
- Buying during period of stock weakness or negative sentiment
- Insiders increasing position size significantly (>25%)
- CEO making largest purchase of tenure

**Bearish Patterns**
- Clustered selling by multiple insiders
- CEO or CFO selling large percentage of holdings
- First-time sells by insiders who previously only bought
- Selling despite stock decline (urgency to exit)
- Executive departures followed by sales

**Neutral Patterns**
- Regular quarterly option exercises and sells
- Small percentage sells for diversification (<5% of holdings)
- Tax payment share forfeitures
- Routine 10b5-1 plan executions
- Gift transfers to family trusts

### 9. Red Flags & Warning Signs

Identify concerning patterns:

**High-Severity Red Flags**
- CEO or CFO selling >50% of holdings
- Clustered selling before earnings miss or guidance cut
- Trading during blackout window
- Late Form 4 filing (>2 days) without explanation
- Pattern of selling before negative news

**Medium-Severity Red Flags**
- Increasing rate of insider selling
- Multiple executives selling simultaneously
- Selling despite recent insider buying by others
- Large sales shortly after option vesting
- Board member resignations followed by sales

**Context Matters**
- Insider selling is common and often benign
- Check for 10b5-1 plans (pre-arranged sales)
- Consider personal circumstances (divorce, estate planning)
- Look at historical patterns for that individual
- Assess whether selling is proportional to holdings

### 10. Data Sources & Research Tools

Reference the following sources for insider trading data:

**Primary Source - SEC EDGAR**
- Form 4 filings: https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=4&company=[TICKER]
- Form 3 filings: Initial beneficial ownership
- Form 5 filings: Annual statements
- File within 2 business days of transaction (Form 4)

**Aggregator Websites**
- **OpenInsider.com**: Free, comprehensive database with filters
  - Cluster analysis tools
  - Screeners for significant transactions
  - Historical data back 10+ years

- **SEC Form 4 Tracker**: Real-time Form 4 monitoring
- **Finviz Insider**: Basic insider data with visualizations
- **GuruFocus Insider**: Premium insider analysis

**Premium Tools**
- **Bloomberg Terminal**: Comprehensive insider data and analytics
- **FactSet**: Insider transaction database
- **S&P Capital IQ**: Detailed ownership and transaction data

**Key Data Points to Extract**
- Insider name and title
- Transaction date and filing date
- Shares bought/sold
- Price per share
- Shares owned after transaction
- Transaction code (P, S, M, etc.)
- Form 4 footnotes (10b5-1 plan indicator)

## Input Formats

### Format 1: Ticker Symbol
```
User: /insider-trading AAPL

Claude retrieves recent Form 4 data from SEC EDGAR and analyzes
```

### Format 2: Specific Time Period
```
User: /insider-trading TSLA --period 2024-Q4

Claude focuses on Q4 2024 insider transactions
```

### Format 3: Custom Data Paste
```
User: /insider-trading --data

[Paste Form 4 data table or CSV from OpenInsider/SEC]

Claude analyzes provided data
```

## Output

Provide comprehensive insider trading analysis report with:

### 1. Executive Summary
- **Overall Insider Sentiment**: Bullish / Neutral / Bearish
- **Confidence Level**: High / Medium / Low
- **Key Takeaways**: 3-5 most important findings
- **Investment Signal**: Buy / Hold / Sell indication
- **Time Period Analyzed**: [Date range]

### 2. Transaction Summary Table
```
Period: Last 6 Months
Total Transactions: [N]
Total Buy Transactions: [N] ($[Amount])
Total Sell Transactions: [N] ($[Amount])
Net Insider Activity: $[Amount]
Net Sentiment Score: [+0.XX or -0.XX]
```

### 3. Significant Transactions (Top 10)
Detailed table with context for each major transaction

### 4. Insider Category Breakdown
Analysis by executive officers, board members, and major shareholders

### 5. Ownership Trend Analysis
Current ownership % and historical trend (4 quarters)

### 6. Timing & Pattern Analysis
- Stock price context during trading periods
- Identified bullish or bearish patterns
- Seasonal or cyclical factors

### 7. Red Flags & Concerns
- List any identified warning signs
- Severity assessment
- Recommended monitoring

### 8. Comparison to Peers
Brief comparison of insider sentiment vs. industry peers (if available)

### 9. Historical Context
- How current activity compares to historical baseline
- Notable changes in behavior
- Track record of insider signals

### 10. Investment Implications
- Overall assessment and confidence level
- Key bullish factors from insider activity
- Key bearish factors or concerns
- Recommended action
- Monitoring plan for future activity

### 11. Data Sources Used
- SEC EDGAR filings referenced
- Date range of analysis
- Number of Form 4 filings reviewed

## Interpretation Guidelines

### When Insider Buying is STRONGLY Bullish
1. Multiple insiders buying in 1-2 week period
2. CEO making unusually large purchase
3. Buying after significant stock decline (>20%)
4. Insiders buying with personal cash (not option exercises)
5. First-time buyers or return to buying after long gap

### When Insider Buying is MODERATELY Bullish
1. Single insider making meaningful purchase
2. Regular accumulation pattern
3. Buying at all-time highs (conviction in further growth)
4. Board member purchases

### When Insider Selling is LESS Concerning
1. 10b5-1 pre-arranged plan sales
2. Small percentage of holdings (<5%)
3. Regular quarterly pattern
4. Diversification after large stock appreciation
5. Tax payments or estate planning

### When Insider Selling is CONCERNING
1. Clustered selling by multiple executives
2. CEO/CFO selling >25% of holdings
3. Selling despite stock decline
4. No 10b5-1 plan indicated
5. Selling shortly before negative news

### Signal Reliability Factors
- **Sample size**: More insiders trading = stronger signal
- **Magnitude**: Larger $ amounts = stronger signal
- **Timing**: Unusual timing = stronger signal
- **Context**: Contrarian trades (buying weakness) = stronger signal
- **Track record**: Historically accurate insiders = stronger signal

## Usage Examples

### Example 1: Basic Analysis
```
User: /insider-trading NVDA

Claude: Analyzes last 6 months of NVDA insider activity, identifies:
- Net bullish sentiment ($15M in buys vs. $2M in sells)
- CEO purchased $5M at $450/share (now $600)
- 4 VPs also bought in same 2-week window
- Signal: Moderately Bullish, Confidence: High
```

### Example 2: Before Earnings
```
User: /insider-trading AAPL --period "before-earnings"

Claude: Analyzes trading in 30-60 days before recent earnings:
- No unusual activity (good sign - no exits before announcement)
- Regular 10b5-1 sales only
- Signal: Neutral (no red flags)
```

### Example 3: Red Flag Detection
```
User: /insider-trading ABC --focus red-flags

Claude: Specifically looks for warning signs:
- CFO sold 60% of holdings last month
- 3 board members resigned and sold within 1 week
- Selling accelerated despite 30% stock decline
- Signal: BEARISH, Confidence: HIGH - Recommend caution
```

## Integration Notes

- Combine with /fundamental-analysis for complete due diligence
- Use /institutional-ownership for full insider + institutional picture
- Feed analysis to /report-generator for visual charts of insider activity
- Best used monthly or after significant insider filing activity
- Particularly valuable when analyzing small-mid cap stocks (insiders have more edge)

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

**Score Guide**: 8.0–10.0 Strongly Bullish | 6.0–7.9 Moderately Bullish | 4.0–5.9 Neutral | 2.0–3.9 Moderately Bearish | 0.0–1.9 Strongly Bearish
**Confidence**: HIGH (strong data, clear signals) | MEDIUM (mixed signals) | LOW (limited data, conflicting signals)
**Horizon**: SHORT-TERM (1 week–3 months) | MEDIUM-TERM (3 months–1 year) | LONG-TERM (1+ years)
