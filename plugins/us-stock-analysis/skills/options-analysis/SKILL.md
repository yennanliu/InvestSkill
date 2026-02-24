---
description: Analyze options Greeks, implied volatility, and strategy selection for US stocks
---

# Options Analysis

Comprehensive analysis of options Greeks, implied volatility dynamics, strategy selection, and risk/reward frameworks for US-listed equity options. Designed to help identify optimal strategies based on market outlook, volatility environment, and underlying stock context.

**Risk Disclaimer**: Options involve significant leverage and can result in the loss of the entire premium paid or, for short options, losses substantially exceeding the initial credit received. This analysis is for educational and informational purposes only and does not constitute financial advice.

## Analysis Framework

### 1. Options Basics and Context

**Core Terminology**
- **Strike price**: The price at which the option holder can buy (call) or sell (put) the underlying stock
- **Expiration date**: The date the option contract expires; American-style options can be exercised at any time before expiration
- **Premium**: The market price of the option contract (cost to buyer, credit received by seller)
- **Contract**: Represents 100 shares of the underlying stock
- **ITM (In-the-Money)**: Call with strike < stock price; Put with strike > stock price — has intrinsic value
- **ATM (At-the-Money)**: Strike approximately equal to current stock price
- **OTM (Out-of-the-Money)**: Call with strike > stock price; Put with strike < stock price — only time value, no intrinsic value

**Intrinsic Value vs. Time Value**
- Premium = Intrinsic Value + Time Value (Extrinsic Value)
- Intrinsic value: how far ITM the option is (cannot be negative)
- Time value: premium above intrinsic value — represents probability of further price movement and time remaining

**When to Use Options vs. Stock**
- **Leverage**: Control 100 shares with a fraction of the capital (calls vs. outright long)
- **Hedging**: Protect existing portfolio positions (protective puts, collars)
- **Income generation**: Sell covered calls or cash-secured puts to generate premium income
- **Volatility plays**: Profit from large moves (straddles) or stability (iron condors) regardless of direction
- **Defined risk**: Spreads cap maximum loss to the debit paid

### 2. The Greeks Analysis

**Delta (Δ) — Directional Sensitivity**

Definition: Change in option price for a $1 move in the underlying stock price.

```
Option Type      Delta Range      Moneyness Context
Call (long)      0 to +1.0        Deep OTM ≈ 0.05, ATM ≈ 0.50, Deep ITM ≈ 0.99
Put (long)       -1.0 to 0        Deep OTM ≈ -0.05, ATM ≈ -0.50, Deep ITM ≈ -0.99
```

- **Delta as probability proxy**: A 70-delta option approximates a 70% probability of expiring ITM (rough heuristic, not precise)
- **Position delta**: Sum of all delta exposure across a portfolio = total directional equivalent shares
- Directional traders: select delta matching conviction (high delta = high directional exposure, lower leverage; low delta = cheaper, more speculative)
- Delta hedging: offset option delta with opposite stock position to create delta-neutral portfolio

**Gamma (Γ) — Rate of Delta Change**

Definition: Rate of change of delta for a $1 move in the underlying.

- Gamma is highest for ATM options and increases dramatically as expiration approaches
- **Long gamma**: Long options positions (long calls or puts) — benefits from large moves in either direction; gamma accelerates gains as stock moves through strike
- **Short gamma**: Short options positions — benefits from stability and small moves; faces accelerating losses on large moves
- **Gamma risk at expiration**: ATM options near expiry have very high gamma — pin risk and rapid delta shifts
- **Gamma scalping**: Dynamically delta-hedging a long gamma position to profit from realized volatility exceeding implied volatility
- Weekly options have the highest gamma, making them both powerful and dangerous near expiry

**Theta (Θ) — Time Decay**

Definition: Daily erosion of an option's value due to the passage of time (always negative for long options, positive for short options).

- Theta represents the "rent" paid to maintain a long options position
- Time decay is not linear — it accelerates as expiration approaches

```
DTE Range        Theta Decay Speed
>90 days         Slow — manageable for long holders
60-90 days       Moderate — beginning to accelerate
30-60 days       Elevated — meaningful daily decay
15-30 days       Fast — significant daily cost
7-15 days        Rapid — theta dominates P&L
<7 days          Extreme — ATM options decay very rapidly
```

- **Theta / premium**: The daily decay as a percentage of the option's premium
- Short options strategies (iron condors, covered calls) benefit from theta; structure positions so that time is your ally
- Rule of thumb: avoid holding long OTM options into the final 21 days unless near a catalyst

**Vega (ν) — Volatility Sensitivity**

Definition: Change in option price for a 1 percentage point change in implied volatility (IV).

- **Long options = long vega**: Long calls and long puts both benefit from IV expansion
- **Short options = short vega**: Short premium strategies benefit from IV contraction (volatility crush)
- Vega is largest for ATM options with 30-60 days to expiration
- Earnings and binary events dramatically increase vega exposure — IV expands before event, then collapses after (volatility crush)

```
IV Change Impact on Long Option:
+5% IV increase on $5.00 option with vega 0.20 = +$1.00 gain
-5% IV decrease (post-earnings crush) = -$1.00 loss
```

- **Vega term structure**: Long-dated options have higher absolute vega — more sensitive to IV changes
- Managing vega: use spreads to reduce net vega exposure (long spread = smaller net vega than long naked option)

**Rho (ρ) — Interest Rate Sensitivity**

Definition: Change in option price for a 1 percentage point change in the risk-free interest rate.

- Calls have positive rho: benefit from interest rate increases (higher rates increase call values)
- Puts have negative rho: decrease in value as interest rates rise
- Rho is typically the least impactful Greek for short-dated options
- More relevant for LEAPS (long-dated options with 1-2 year expirations) in a higher interest rate environment
- In a high-rate environment (rates >4%): rho becomes a meaningful consideration for 6-12 month options strategies

### 3. Implied Volatility (IV) Analysis

**IV vs. Historical Volatility (HV)**
- **IV (Implied Volatility)**: Forward-looking volatility derived from current option prices — reflects market's expectation of future price swings
- **HV (Historical Volatility)**: Realized past volatility measured over 20, 30, or 60 days
- **IV > HV**: Options are expensive relative to recent realized movement — favor selling premium (credit strategies)
- **IV < HV**: Options are cheap relative to recent realized movement — favor buying premium (debit strategies)
- **IV/HV ratio**: >1.2 = meaningfully overpriced, <0.8 = meaningfully underpriced

**IV Rank (IVR)**
```
Formula: IVR = (Current IV - 52-Week Low IV) / (52-Week High IV - 52-Week Low IV) × 100

Example: Current IV 35%, 52-wk Low 20%, 52-wk High 60%
IVR = (35 - 20) / (60 - 20) × 100 = 37.5%

IVR Interpretation:
>70%    Very High — IV near 52-week highs, strongly favor selling premium
50-70%  High — elevated IV, lean toward selling premium
30-50%  Moderate — mixed, direction-dependent strategies
<30%    Low — IV near 52-week lows, favor buying premium or debit spreads
<15%    Very Low — cheapest options of the year, consider long volatility
```

**IV Percentile (IVP)**
- Definition: Percentage of trading days in the past 252 days where IV was lower than the current reading
- IVP 80% = IV is higher today than on 80% of trading days in the past year
- More statistically robust than IVR because IVR can be skewed by a single outlier high or low
- IVP > 50%: favor selling premium | IVP < 30%: favor buying premium

**IV Term Structure**
- **Contango (normal)**: Near-term IV < far-term IV — calm near-term environment, uncertainty longer-dated
- **Backwardation (inverted)**: Near-term IV > far-term IV — acute fear or event in immediate future
- Steep backwardation: market pricing major near-term risk (earnings miss, regulatory event, macro shock)
- Calendar spread opportunity: sell high near-term IV, buy lower far-term IV (take advantage of backwardation)

**IV Skew Analysis**
- **Put skew**: OTM put IV > OTM call IV — standard condition in equity markets (portfolio protection demand)
- **Steep negative skew**: Market pricing significant downside protection — fear elevated, consider selling OTM puts
- **Skew reversal (call skew)**: OTM call IV > OTM put IV — squeeze expectation, binary upside event anticipated
- **Risk reversal metric**: 25-delta put IV minus 25-delta call IV. Higher value = steeper put skew.
- Skew changes directionally: steepening skew = increasing fear, flattening skew = reducing downside concern

**Volatility Crush (Post-Event IV Collapse)**
- IV systematically rises into known binary events: earnings, FDA decisions, investor days, FOMC
- IV collapses immediately after the event as uncertainty resolves — regardless of the price move direction
- Average IV crush on earnings: 30-50% drop in IV on the day following announcement
- Implication: long premium strategies must have a move that exceeds the expected move to profit; short premium strategies profit even if stock moves, as long as within expected range

### 4. Strategy Selector

Select the optimal strategy based on market outlook and IV environment:

**Bullish Strategies**

| Strategy | When to Use | IV Preference | Max Profit | Max Loss |
|----------|------------|---------------|------------|----------|
| Buy Call | Strongly bullish, conviction directional bet | Low IV (IVR <30%) | Unlimited | Premium paid |
| Bull Call Spread | Moderately bullish, reduce cost, cap profit | Any IV | Strike spread minus debit | Debit paid |
| Cash-Secured Put | Bullish/neutral, willing to own stock at lower price | High IV (IVR >50%) | Premium collected | Strike minus premium |
| Covered Call | Bullish/neutral, income on existing position | High IV (IVR >50%) | Premium + upside to strike | Stock cost minus premium |

**Bearish Strategies**

| Strategy | When to Use | IV Preference | Max Profit | Max Loss |
|----------|------------|---------------|------------|----------|
| Buy Put | Strongly bearish, protection or directional bet | Low IV (IVR <30%) | Strike minus premium | Premium paid |
| Bear Put Spread | Moderately bearish, reduce cost, define risk | Any IV | Strike spread minus debit | Debit paid |
| Bear Call Spread | Bearish/neutral, sell premium with defined max loss | High IV (IVR >50%) | Credit received | Strike spread minus credit |

**Neutral and Volatility Strategies**

| Strategy | When to Use | IV Preference | Max Profit | Max Loss |
|----------|------------|---------------|------------|----------|
| Iron Condor | Neutral price, range-bound | High IV (IVR >50%) | Full credit | Wing spread minus credit |
| Iron Butterfly | Neutral, max decay at single price point | High IV (IVR >50%) | Full credit | Wing spread minus credit |
| Short Straddle | Neutral, sell both call and put ATM | Very High IV | Full credit | Unlimited (uncapped) |
| Long Straddle | Expecting large move, unknown direction | Low IV (IVR <20%) | Unlimited | Both premiums paid |
| Long Strangle | Large move expected, OTM for lower cost | Low IV (IVR <20%) | Unlimited | Both premiums paid |

**Strategy Selection Matrix**

```
                        IV High (IVR >50%)       IV Low (IVR <20%)
─────────────────────────────────────────────────────────────────────
Strongly Bullish:       Bull Call Spread          Buy Call
Mildly Bullish:         Cash-Secured Put          Bull Call Spread
Neutral:                Iron Condor               Long Straddle / Strangle
Mildly Bearish:         Bear Call Spread          Bear Put Spread
Strongly Bearish:       Bear Put Spread           Buy Put
High Volatility:        Short Straddle            Long Straddle
Low Conviction:         Iron Condor               Calendar Spread
─────────────────────────────────────────────────────────────────────
```

### 5. Earnings Play Analysis

**IV Crush Dynamics**
- IV rises steadily in the 2-4 weeks before earnings as uncertainty increases
- On the day after earnings announcement, IV collapses 30-50% (volatility crush)
- This crush destroys long premium value even if the stock moves significantly
- Short premium strategies capture this crush but face the binary event risk

**Expected Move Calculation**
```
Expected Move (EM) = ATM Straddle Price / Stock Price × 100

Example: Stock at $100, ATM straddle costs $7.00
Expected Move = 7.0 / 100 × 100 = 7.0%
Market implying 68% probability stock stays within +/-$7 of current price
```

**Historical Earnings Move Analysis**
- Compare actual historical earnings moves vs. expected move at time of earnings
- If stock regularly moves ≥ 1.5x the expected move: favor buying straddle/strangle (breakeven likely exceeded)
- If stock regularly moves < 0.7x the expected move: favor selling premium (iron condor, short strangle)
- Look at last 8 quarterly earnings reactions for statistically meaningful sample

**Earnings Straddle Setup**
- Buy ATM call + ATM put with same strike and expiration just before earnings
- Profit if stock moves more than combined cost of both options (breakeven points = strike ± total premium)
- Risk: theta decay into earnings + IV crush if move is below expected move
- Optimal entry: 7-14 days before earnings (balances theta risk vs. IV run-up capture)

**Defined Risk Earnings Structures**
- **Long strangle**: OTM call + OTM put, cheaper than straddle, requires larger move to profit
- **Broken wing butterfly**: Define maximum risk, profit if stock pins near current level, smaller debit
- **Earnings iron condor**: Sell wings around expected move, profit if stock stays within range

### 6. Risk Management

**Maximum Loss Scenarios by Strategy**
- Long call / Long put: Max loss = premium paid (100% of investment)
- Bull/Bear spread: Max loss = net debit paid
- Iron condor: Max loss = wing width minus total credit received
- Short straddle / strangle: Max loss = theoretically unlimited (capped by stock going to zero for puts)
- Covered call: Max loss = stock cost basis minus premium received (stock declining to zero)

**Position Sizing**
- Long options premium risk: limit to 2-5% of portfolio per trade (entire premium can be lost)
- Short premium (credit) strategies: risk defined by spread width; size to risk 1-3% of portfolio
- Never let a single options position represent more than 10% of total portfolio market value
- For speculative OTM long options: size even smaller (0.5-1%) given low probability of profit

**Delta Hedging for Complex Positions**
- Monitor portfolio delta daily for active options books
- Adjust underlying stock position to maintain target delta exposure (delta-neutral if desired)
- Frequency of hedging: daily for near-expiry positions, weekly for longer-dated positions
- Hedging costs: transaction costs erode gamma scalping profits; only hedge on meaningful delta drift

**Rolling Positions**
- When to roll: option approaching expiration with significant unrealized gain or at risk of assignment
- Rolling out: buy to close current expiration, sell to open further expiration (extends duration)
- Rolling out and up/down: change both expiration and strike
- Roll mechanics: attempt to collect additional credit (for short options) or minimal debit

**Stop-Loss Guidelines**
- Long options (debit): consider closing when position loses 50% of premium paid
- Short options (credit): consider closing when position reaches 2x the credit received (200% of max profit in losses)
- Hard rule: never let a defined-risk spread reach maximum loss without reassessment

**Common Mistakes to Avoid**
- Holding long OTM options to expiration hoping for recovery (usually expires worthless)
- Selling naked short puts or calls without understanding assignment risk
- Ignoring bid/ask spread in illiquid options (wide spread = immediate cost)
- Over-leveraging via too many contracts on speculative OTM options
- Forgetting earnings/ex-dividend dates that create event risk on existing positions

### 7. Options Chain Reading Guide

**Key Chain Columns**
- **Bid / Ask**: Market-maker buy price and sell price — execute near midpoint for better fills
- **Last trade price**: Often stale; use bid/ask midpoint for current value
- **Volume**: Contracts traded today — high volume = active interest, easier to fill
- **Open Interest (OI)**: Total outstanding contracts — high OI = liquidity and tight spreads
- **IV per strike**: Varies by strike (shows skew visually across the chain)
- **Delta, Gamma, Theta, Vega**: Displayed per-contract for each strike

**Bid/Ask Spread Importance**
- Wide bid/ask spread = illiquid options = avoid or expect significant slippage
- Good liquidity threshold: bid/ask spread < 10% of option midprice
- Actively traded tickers (AAPL, SPY, QQQ): penny-wide spreads on ATM options
- Small-cap or low-volume stocks: may have $0.50+ spreads that erode profitability

**Open Interest Accumulation as Price Levels**
- Strikes with very high OI often act as price magnets (max pain theory) near expiration
- Institutional hedging clusters at round number strikes (every $5 or $10 increments)
- Dealer gamma exposure at high-OI strikes: dealers hedge dynamically, creating mechanical buying/selling pressure
- Max pain price: strike at which maximum total options value expires worthless

**Volume vs. OI Interpretation**
- Volume > OI: New positions being opened (not just rolls of existing positions)
- Volume << OI: Trading is closing or rolling existing positions
- Large single print on low-OI strike: new speculative or informed position (unusual activity alert)
- Volume spike with no news: potential informed positioning ahead of catalyst

### 8. Data Sources

**Primary Trading Platforms with Full Greeks**
- **Thinkorswim (TD Ameritrade / Schwab)**: Comprehensive options chain, Greeks, IV analysis, probability cones
- **Interactive Brokers (IBKR)**: Options analytics, volatility trader tools, probability of expiring
- **Tastytrade**: Options-specific platform, IV rank/percentile, theta decay tracking

**Free Analytics Tools**
- **Market Chameleon**: IV rank, IV percentile, term structure, earnings IV history — all free
- **Barchart Options**: Options flow, unusual activity, Greeks by strike (free tier available)
- **Options Profit Calculator (optionsprofitcalculator.com)**: Visual P&L diagrams for strategies (free)
- **Power E*TRADE**: Options analytics and strategy builder

**Options Flow and Unusual Activity**
- **Unusual Whales**: Options flow tracking, dark pool data, unusual activity scanner
- **Flowalgo**: Real-time unusual options activity alerts (premium)
- **Cheddar Flow**: Institutional options flow visualization

**Reference Data**
- **Options Clearing Corporation (OCC)**: Volume and OI data, contract specifications
- **CBOE**: VIX data, volatility indices, SPX/SPY options data

## Input Formats

### Format 1: Greeks Analysis
```
User: /options-analysis AAPL --greeks

Claude analyzes ATM and key strikes across near-term expirations, summarizes Greeks profile
```

### Format 2: Strategy Recommendation
```
User: /options-analysis TSLA --strategy bullish

Claude evaluates current IV environment, selects optimal bullish strategies, provides specific setups
```

### Format 3: Earnings Play Analysis
```
User: /options-analysis NVDA --earnings

Claude computes expected move, reviews historical earnings reactions, recommends earnings strategy
```

### Format 4: IV Analysis
```
User: /options-analysis SPY --iv

Claude provides full IV analysis: IVR, IVP, term structure, skew, HV comparison
```

## Output

Provide a comprehensive options analysis report with the following sections:

### 1. Options Overview
```
Underlying:              [TICKER]
Current Price:           $XXX.XX
ATM Implied Volatility:  XX.X%
IV Rank (IVR):           XX%    (52-wk Range: XX% - XX%)
IV Percentile (IVP):     XX%
Historical Volatility:   XX.X%  (30-day realized)
IV vs. HV:               X.Xx   (Overpriced / Underpriced)
Next Earnings:           [Date] (XX days)
```

### 2. Greeks Summary (ATM Nearest Expiry)
```
Strike:       $XXX       Expiry: [Date]    DTE: XX
─────────────────────────────────────────
Call Greeks:  Delta +X.XX | Gamma X.XX | Theta -$X.XX/day | Vega $X.XX/1%IV
Put Greeks:   Delta -X.XX | Gamma X.XX | Theta -$X.XX/day | Vega $X.XX/1%IV
─────────────────────────────────────────
Expected Move (±1σ to expiry): $X.XX (X.X%)
```

### 3. IV Analysis Summary
- IV vs. HV assessment (are options cheap or expensive?)
- IVR/IVP interpretation with action bias
- Term structure shape (contango vs. backwardation)
- Skew assessment and directional implication
- If near earnings: IV run-up remaining and expected crush magnitude

### 4. Recommended Strategies (Top 2-3)

For each recommended strategy:
- Strategy name and structure (which strikes, which expiry)
- Rationale (why this strategy fits current IV and outlook)
- Max profit / Max loss
- Breakeven price(s)
- Probability of profit (from delta approximation)
- Ideal outcome scenario

### 5. Key Levels for Options
- Strike clustering (high OI strikes = market-recognized levels)
- Support / resistance relevant to spread placement
- Max pain price for nearest monthly expiry

### 6. Entry and Exit Guidelines
- Suggested entry timing (DTE target, IV condition to trigger entry)
- Profit target: close at X% of max profit (e.g., 50% for iron condors, 75% for short spreads)
- Stop-loss trigger
- Adjustment plan if position moves against you

### 7. Upcoming Catalyst Calendar
- Earnings date and expected move (if applicable)
- Ex-dividend date (assignment risk for short calls)
- Any scheduled corporate events (investor day, product launch, FDA decision)

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
