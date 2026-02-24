---
description: Technical analysis of US stocks using charts and indicators
---

# Technical Analysis

Perform technical analysis of US stocks using price action, chart patterns, and technical indicators.

## Chart Pattern Analysis

1. **Trend Identification**
   - Primary trend (uptrend, downtrend, sideways)
   - Trend strength and momentum
   - Support and resistance levels
   - Trendline analysis

2. **Classic Chart Patterns**
   - Head and shoulders, inverse H&S
   - Double/triple tops and bottoms
   - Cup and handle
   - Triangles (ascending, descending, symmetrical)
   - Flags and pennants
   - Wedges and channels

3. **Candlestick Patterns**
   - Reversal patterns (doji, hammer, shooting star, engulfing)
   - Continuation patterns
   - Multi-candle formations

## Technical Indicators

1. **Trend Indicators**
   - Moving averages (SMA, EMA: 20, 50, 200-day)
   - Moving average crossovers
   - MACD (Moving Average Convergence Divergence)
   - ADX (Average Directional Index)

2. **Momentum Indicators**
   - RSI (Relative Strength Index)
   - Stochastic oscillator
   - Williams %R
   - Rate of Change (ROC)

3. **Volume Indicators**
   - Volume trends and patterns
   - On-Balance Volume (OBV)
   - Volume-weighted average price (VWAP)
   - Accumulation/Distribution line

4. **Volatility Indicators**
   - Bollinger Bands
   - Average True Range (ATR)
   - Volatility Index correlation

## Price Levels

- Key support and resistance zones
- Fibonacci retracement levels
- Pivot points
- Round number psychology
- Gap analysis

## Market Context

- Relative strength vs. market indices
- Sector rotation analysis
- Market breadth indicators
- Correlation with related assets

## Chart Visualization Support

When `--chart` flag is used, include chart specifications and data tables:

### 1. Price Chart with Moving Averages
**Chart Type**: Candlestick chart with overlay lines
**Data Table**:
```
Date        Open      High      Low       Close     Volume      SMA_20    SMA_50    SMA_200
2024-01-01  [price]   [price]   [price]   [price]   [volume]    [price]   [price]   [price]
2024-01-02  [price]   [price]   [price]   [price]   [volume]    [price]   [price]   [price]
...
[Last 90 trading days for detailed view]
```

**Visual Specifications**:
- Candlesticks: Green for up days, red for down days
- SMA 20: Blue line (short-term trend)
- SMA 50: Orange line (intermediate trend)
- SMA 200: Purple line (long-term trend)
- Support/resistance: Horizontal dashed lines with labels

### 2. Volume Bars
**Chart Type**: Bar chart (synchronized with price chart)
**Data Table**:
```
Date        Volume      Avg_Volume_20    Above_Avg    Color
2024-01-01  [volume]    [volume]         [Yes/No]     [Green/Red]
2024-01-02  [volume]    [volume]         [Yes/No]     [Green/Red]
...
```

**Visual Specifications**:
- Green bars: Volume on up days
- Red bars: Volume on down days
- Dashed line: 20-day average volume
- Highlight bars exceeding 2x average volume

### 3. RSI Indicator Panel
**Chart Type**: Line chart with overbought/oversold zones
**Data Table**:
```
Date        RSI_14    Overbought_70    Oversold_30    Signal
2024-01-01  [value]   70               30             [Neutral/OB/OS]
2024-01-02  [value]   70               30             [Neutral/OB/OS]
...
```

**Visual Specifications**:
- RSI line: Blue
- Overbought zone (>70): Red shaded area
- Oversold zone (<30): Green shaded area
- Midline (50): Dashed gray line
- Divergence annotations if present

### 4. MACD Indicator Panel
**Chart Type**: Line chart with histogram
**Data Table**:
```
Date        MACD      Signal    Histogram    Crossover
2024-01-01  [value]   [value]   [value]      [None/Bullish/Bearish]
2024-01-02  [value]   [value]   [value]      [None/Bullish/Bearish]
...
```

**Visual Specifications**:
- MACD line: Blue
- Signal line: Red
- Histogram: Green (positive), Red (negative)
- Zero line: Black dashed
- Crossover markers: Arrows or dots

### 5. Bollinger Bands
**Chart Type**: Overlay on price chart
**Data Table**:
```
Date        Price     BB_Upper    BB_Middle    BB_Lower    %B       Bandwidth
2024-01-01  [price]   [price]     [price]      [price]     [value]  [value]
2024-01-02  [price]   [price]     [price]      [price]     [value]  [value]
...
```

**Visual Specifications**:
- Upper band: Red dashed line
- Middle band (20 SMA): Blue solid line
- Lower band: Green dashed line
- Shaded area between bands: Light gray
- Price line: Black candlesticks

### 6. Support & Resistance Levels
**Annotation Overlay**:
```
Level Type       Price      Strength    Touches    Last Test    Notes
Resistance       $[price]   Strong      5          [date]       Historical high
Resistance       $[price]   Medium      3          [date]       Recent rejection
Support          $[price]   Strong      4          [date]       Key accumulation zone
Support          $[price]   Weak        2          [date]       Minor bounce level
Fibonacci 61.8%  $[price]   N/A         -          -            Retracement level
```

### 7. Pattern Recognition Annotations
**Chart Overlays**:
```
Pattern Type              Start Date    End Date      Status        Target        Risk/Reward
Head & Shoulders          2024-01-15    2024-02-10    Confirmed     $[price]      1:3.2
Ascending Triangle        2024-02-01    Current       Forming       $[price]      1:2.5
Flag Pattern             2024-02-05    2024-02-08    Complete      $[price]      1:2.8
```

**Visual Elements**:
- Pattern boundaries: Colored rectangles or polygons
- Trendlines: Dashed connecting lines
- Breakout points: Arrows indicating direction
- Target levels: Horizontal lines with labels

### ASCII Chart Example (Terminal Display)

```
Technical Chart: AAPL (Last 30 Days)

Price ($)
180 ┤                                    ╭─╮
175 ┤                              ╭─────╯ ╰─╮
170 ┤                        ╭─────╯         ╰──╮
165 ┤                  ╭─────╯                  ╰─╮  ← Current: $172.50
160 ┤            ╭─────╯                          ╰──
155 ┤      ╭─────╯                                      SMA 20: $168.23
150 ┤──────╯                                            SMA 50: $165.80
    └──┬─────┬─────┬─────┬─────┬─────┬─────┬──          ══════ Resistance: $178
     1/15  1/22  1/29  2/05  2/12  2/19  2/26          ══════ Support: $155

RSI (14)
 70 ┤                                    ● ← 68 (approaching OB)
 50 ┤                        ●     ●
 30 ┤            ●
    └──┬─────┬─────┬─────┬─────┬─────┬─────┬──

Volume (M)
100M┤                                    █
 75M┤                              █     █
 50M┤            █     █     █     █  █  █  █
 25M┤      █  █  █  █  █  █  █  █  █  █  █  █
    └──┬─────┬─────┬─────┬─────┬─────┬─────┬──

Signals:
↗ Bullish: Price above SMA 20 & 50
● RSI approaching overbought (68) - potential pullback
📊 Volume increasing on up days - healthy uptrend
🎯 Target: $178 (resistance), Stop: $165 (below SMA 50)
```

### Integration with Report Generator

When `--chart` flag is used, output is optimized for `/report-generator`:
- All chart data tables formatted for Chart.js/Plotly
- Color schemes specified for consistent visualization
- Annotations and overlays clearly defined
- Time axis formatting (date range, granularity)
- Y-axis scaling recommendations (log scale for long-term charts)

### Chart Configuration Recommendations

**Timeframe Selection**:
- **Day Trading**: 1-minute to 1-hour candles, last 5-10 days
- **Swing Trading**: 4-hour to daily candles, last 3-6 months
- **Position Trading**: Daily to weekly candles, last 1-3 years

**Indicator Combinations**:
- **Trend Following**: SMA 50/200 + MACD + ADX
- **Mean Reversion**: Bollinger Bands + RSI + Stochastic
- **Momentum**: RSI + MACD + Volume
- **Breakout**: Bollinger Bands + Volume + Pattern Recognition

---

## Multi-Timeframe Analysis (MTF)

### Framework

Analyze 3 timeframes simultaneously — higher timeframe establishes the trend, primary timeframe identifies the setup, lower timeframe refines the entry. Trade only in the direction of the higher timeframe trend.

### Trading Setups by Approach

| Approach          | Higher TF (Trend) | Primary TF (Setup) | Lower TF (Entry) |
|-------------------|--------------------|---------------------|------------------|
| Day Trading       | Weekly             | Daily               | 1-Hour           |
| Swing Trading     | Monthly            | Weekly              | Daily            |
| Position Trading  | Quarterly          | Monthly             | Weekly           |

### MTF Alignment Scoring

| Alignment Score | Interpretation                                                    |
|-----------------|-------------------------------------------------------------------|
| 3/3 Bullish     | Strong long setup — all timeframes confirm uptrend               |
| 3/3 Bearish     | Strong short setup — all timeframes confirm downtrend            |
| 2/3 Aligned     | Moderate setup — primary direction clear, minor conflict         |
| 1/3 Aligned     | Weak/conflicting — avoid new positions, wait for clarity         |
| 0/3 Aligned     | Contradiction across all timeframes — no trade                   |

### MTF Confluence Table

| Timeframe  | Trend Direction | Key Signal          | Support | Resistance | Alignment |
|------------|-----------------|---------------------|---------|------------|-----------|
| Higher TF  |                 |                     |         |            |           |
| Primary TF |                 |                     |         |            |           |
| Lower TF   |                 |                     |         |            |           |
| **Overall**|                 | **Score: X/3**      |         |            |           |

### MTF Integration with `--chart` Flag

When `--chart` is used, MTF analysis adds the following data tables for report generation:

```
MTF Summary Table:
Timeframe   Candle   MA Trend    RSI     MACD       Volume Trend   Signal
Weekly      [data]   [Up/Down]   [val]   [Bull/Bear] [Rising/Fall]  [Bullish/Bearish/Neutral]
Daily       [data]   [Up/Down]   [val]   [Bull/Bear] [Rising/Fall]  [Bullish/Bearish/Neutral]
4-Hour      [data]   [Up/Down]   [val]   [Bull/Bear] [Rising/Fall]  [Bullish/Bearish/Neutral]
Alignment Score: X/3
```

**Rule**: Never take a trade rated 1/3 or lower on MTF alignment. Wait for 2/3 minimum before entry.

---

## Volume Profile Analysis

### Key Concepts

- **Point of Control (POC)**: The price level with the highest volume traded over the selected period. Acts as a magnetic price level — markets frequently return to and consolidate around the POC.
- **Value Area (VA)**: The price range where approximately 70% of total volume was traded. Defines the "fair value zone" as agreed upon by market participants.
- **Value Area High (VAH)**: Upper boundary of the Value Area. Strong resistance when price is approaching from below.
- **Value Area Low (VAL)**: Lower boundary of the Value Area. Strong support when price is approaching from above.
- **Low Volume Node (LVN)**: A price range with minimal volume. Price passes through LVNs quickly — acts as a gap zone.
- **High Volume Node (HVN)**: A price range with dense volume. Price is magnetically attracted and consolidates around HVNs.

### Volume Profile Shapes

| Shape                | Description                                         | Implication                                         |
|----------------------|-----------------------------------------------------|-----------------------------------------------------|
| Normal (Bell Curve)  | Symmetric distribution, clear POC in the middle    | Balanced, range-bound market — fair value accepted  |
| P-Shape              | High volume at top, thin tail at bottom             | Buying tail below = short-covering rally, bullish   |
| b-Shape              | High volume at bottom, thin tail at top             | Selling tail above = distribution/top, bearish      |
| Double Distribution  | Two high-volume nodes with low-volume gap between  | Market in transition — break of LVN is directional  |
| Thin Profile         | Volume evenly spread, no clear POC                  | Trending market — follow the trend, no anchoring    |

### Volume Profile Trading Rules

| Scenario                        | Interpretation                                          | Action                                    |
|---------------------------------|---------------------------------------------------------|-------------------------------------------|
| Price > VAH (above Value Area)  | Bullish — market accepted higher prices, strong trend  | Buy breakouts above VAH with volume       |
| Price < VAL (below Value Area)  | Bearish — market rejected higher prices, breakdown     | Sell breakdowns below VAL with volume     |
| Price at POC                    | High acceptance zone — balanced, range-bound likely    | Fade edges of range; buy VAL, sell VAH    |
| Price enters LVN (thin area)    | Fast move — price moves quickly through low-volume gap | Expect acceleration; don't fade momentum  |
| Price at HVN                    | Magnetic zone — consolidation, range trade likely      | Mean-reversion strategies appropriate     |

### Session vs. Composite Profile

- **Session Profile**: Volume profile for a single trading day or week. Identifies intraday POC, VAH, VAL.
- **Composite Profile**: Aggregated over weeks, months, or custom date range. Identifies major structural levels.
- **Integration rule**: Composite HVNs = major structural support/resistance levels. LVNs = breakout acceleration zones. Session POC = short-term magnet.

---

## Advanced Indicators: Ichimoku Cloud

### Five Components

| Component     | Calculation                                     | Default Period | Purpose                              |
|---------------|-------------------------------------------------|----------------|--------------------------------------|
| Tenkan-sen    | (9-period High + 9-period Low) / 2              | 9 periods      | Short-term trend / momentum line     |
| Kijun-sen     | (26-period High + 26-period Low) / 2            | 26 periods     | Medium-term trend / baseline         |
| Senkou Span A | (Tenkan-sen + Kijun-sen) / 2, plotted 26 ahead | Leading        | Fast cloud boundary                  |
| Senkou Span B | (52-period High + 52-period Low) / 2, plotted 26 ahead | 52 periods | Slow cloud boundary              |
| Chikou Span   | Current close plotted 26 periods back           | Lagging        | Confirms trend vs. historical price  |

The shaded area between Senkou Span A and Senkou Span B is the **Kumo (Cloud)**.

### Bullish Ichimoku Signals

| Signal                    | Condition                                               | Strength |
|---------------------------|---------------------------------------------------------|----------|
| Price above Cloud         | Price above both Span A and Span B                      | Base condition |
| Green Cloud               | Span A > Span B (cloud is green/bullish)                | Trend support |
| TK Cross (Bullish)        | Tenkan-sen crosses above Kijun-sen                      | Medium signal |
| TK Cross above Cloud      | Bullish TK cross while price is above the cloud         | Strong signal |
| Chikou above price        | Chikou Span is above historical price 26 periods ago    | Confirms uptrend |
| All 5 elements aligned    | All conditions bullish simultaneously                   | Strongest signal |

### Bearish Ichimoku Signals

| Signal                    | Condition                                               | Strength |
|---------------------------|---------------------------------------------------------|----------|
| Price below Cloud         | Price below both Span A and Span B                      | Base condition |
| Red Cloud                 | Span B > Span A (cloud is red/bearish)                  | Trend resistance |
| TK Cross (Bearish)        | Tenkan-sen crosses below Kijun-sen                      | Medium signal |
| TK Cross below Cloud      | Bearish TK cross while price is below the cloud         | Strong signal |
| Chikou below price        | Chikou Span is below historical price 26 periods ago    | Confirms downtrend |
| All 5 elements aligned    | All conditions bearish simultaneously                   | Strongest signal |

### Kumo Twist

- A **Kumo Twist** occurs when Senkou Span A and Span B cross — changing the cloud color from green to red (bearish twist) or red to green (bullish twist).
- The cloud is plotted 26 periods ahead, so a Kumo Twist is an early warning signal visible in advance.
- **Thin cloud**: Weak support/resistance — price can break through easily.
- **Thick cloud**: Strong support/resistance — price will struggle to penetrate.

### Ichimoku Signal Strength Matrix

| # Bullish Conditions Met | Signal Grade           | Suggested Bias    |
|--------------------------|------------------------|-------------------|
| 5/5                      | Maximum Bullish        | Strong long bias  |
| 4/5                      | Strong Bullish         | Long bias         |
| 3/5                      | Moderate Bullish       | Lean long         |
| 2/5                      | Mixed / Transitioning  | Neutral           |
| 1/5 or 0/5               | Bearish                | Short bias        |

---

## Options Flow Integration

### Put/Call Ratio Interpretation

The Put/Call ratio measures options market sentiment — the ratio of put volume to call volume on a given day.

| P/C Ratio   | Interpretation                                                    |
|-------------|-------------------------------------------------------------------|
| < 0.6       | Extreme bullishness / complacency — contrarian warning (overbought)|
| 0.6–0.7     | Bullish — call buyers dominating, positive sentiment              |
| 0.7–1.0     | Neutral — balanced activity                                       |
| 1.0–1.3     | Bearish fear — put buyers dominating, defensive hedging           |
| > 1.3       | Extreme fear — potential contrarian buy signal (maximum bearishness)|

**CBOE Total P/C vs. Equity-Only P/C**: Equity-only P/C more directly reflects retail/institutional directional bets (excludes index hedging).

### Unusual Options Activity (UOA) Signals

- **Large block trades**: Single orders of 500+ contracts, especially OTM (out-of-the-money)
- **OTM sweeps**: Aggressive market orders sweeping multiple exchanges at ask — directional conviction
- **Dark pool prints**: Large, off-exchange block prints can signal institutional accumulation/distribution
- **Short-dated OTM calls on takeover candidates**: One of the most reliable pre-announcement signals
- **Key UOA filters**: Volume > 5x open interest, expiry within 30 days, OTM strike, market order execution

### Implied Volatility (IV) vs. Historical Volatility (HV)

| Condition   | Description                                              | Options Strategy Implication        |
|-------------|----------------------------------------------------------|-------------------------------------|
| IV >> HV    | Options are expensive — market pricing elevated moves   | Premium selling opportunity (write options) |
| IV ≈ HV     | Options fairly priced                                    | No directional vol edge             |
| IV << HV    | Options are cheap — market underpricing moves           | Buying options (long vol opportunity)|

- **IV Rank (IVR)**: Current IV relative to its 52-week range. IVR > 50 = elevated; IVR < 25 = depressed.
- **IV Percentile**: % of days in the past year where IV was lower than current. More robust than IV Rank.

### Max Pain Theory

- **Max Pain** = The strike price at which the total value of all outstanding options (puts and calls) would expire worthless — the price that causes maximum loss for option buyers.
- Near expiration, market prices have a tendency to gravitate toward the max pain level (due to dealer hedging flows).
- Most useful in the final 5–7 days before monthly options expiration (OPEX).
- **Application**: If stock is significantly above max pain near OPEX, short-term mean reversion is possible.

### Gamma Exposure (GEX) and Spot Price Impact

- **Gamma** measures how much a dealer's delta changes per $1 move in the underlying.
- **Positive GEX (Dealer Long Gamma)**: Dealers buy into dips and sell into rallies — suppresses volatility, market stays range-bound.
- **Negative GEX (Dealer Short Gamma)**: Dealers sell into dips and buy into rallies — amplifies moves, increases volatility.
- **GEX Flip Level**: The price at which market transitions from positive to negative gamma — crossing this level can accelerate directional moves.
- **Practical rule**: Low realized volatility + tightening range = likely high positive GEX environment. Breakouts become more powerful when negative GEX zone is entered.

> **Note**: This section provides interpretive framework. Actual real-time options flow data, IV readings, and GEX levels must be sourced from the user's options data provider (e.g., Market Chameleon, Unusual Whales, SpotGamma, Thinkorswim).

---

## Output

Provide technical analysis report with:
- Current trend and momentum assessment
- Key chart patterns identified
- Support and resistance levels
- Technical indicator signals
- Volume and volatility analysis
- Entry/exit points and price targets
- Stop-loss recommendations
- Risk/reward ratio for trade setups
- Time horizon (short-term, swing, position trading)
- MTF alignment score and summary table
- Ichimoku Cloud status (price above/below/inside cloud)
- Volume Profile POC, VAH, VAL levels

### Enhanced Output (with --chart flag)
- All standard output sections above
- Chart data tables for price, volume, and indicators
- MTF confluence table with signal direction per timeframe
- ASCII charts for terminal display
- Pattern recognition overlays with annotations
- Support/resistance level visualizations
- Volume Profile data (POC, VA, LVN/HVN zones)
- Technical indicator panels (RSI, MACD, Bollinger Bands, Ichimoku)
- Chart specifications for HTML report generation
- Color-coded signals (bullish/bearish/neutral)

Keep analysis objective and data-driven, avoiding emotional bias.

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
