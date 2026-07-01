# Reading the Market

> Valuation tells you *what* to buy; this lesson helps with *when*, and with confirming or challenging your thesis. You'll learn to read four kinds of market signals — price action, smart-money positioning, events, and the macro backdrop — always as clues about probability and positioning, never as certainty.

**What you'll learn**

- The basics of technical analysis: trend, support/resistance, moving averages, RSI, MACD, and volume
- How to read "smart money": insider buying, institutional 13F moves, short interest, and options signals
- How earnings calls and forward catalysts can move a stock
- How the macro regime (rates, inflation, the cycle) favors different sectors and styles
- Why no single signal is decisive — and why agreement across signals raises confidence

---

## First, a framing

Everything in earlier lessons answered *what* is a good business at a fair price. Market signals answer a different question: *what is the crowd doing, and when might the market agree with my thesis?*

> **Key idea:** Market signals are about **probability and positioning**, not certainty. A great chart on a bad business is a trap; a strong business at a great valuation with the market signals lining up is a higher-confidence setup. Signals tilt the odds — they don't guarantee outcomes.

Read this lesson as a toolkit for *timing and confirmation*, layered on top of fundamentals and valuation.

---

## 1. Technical analysis basics

**Technical analysis** studies price and volume history to judge the *balance of supply and demand* — where buyers and sellers are likely to act. It says nothing about whether a business is good; it's about behavior and timing.

### Trend: up, down, or sideways

The single most important read is the **trend** — the general direction of price over time.

| Trend | What price does | Rough interpretation |
|-------|-----------------|----------------------|
| **Uptrend** | Higher highs and higher lows | Buyers in control |
| **Downtrend** | Lower highs and lower lows | Sellers in control |
| **Sideways (range)** | Bounces between a floor and ceiling | No clear winner; consolidation |

> **Key idea:** "The trend is your friend." Trading *with* the prevailing trend puts the odds on your side; fighting it is harder.

### Support and resistance

- **Support** — a price level where buying tends to appear and halt a decline (a "floor").
- **Resistance** — a level where selling tends to appear and cap a rise (a "ceiling").

Think of them as memory: prices where lots of trading happened before, so buyers and sellers react again. When price finally *breaks through* resistance on strong volume, that old ceiling often becomes the new floor.

### Moving averages (50-day and 200-day)

A **moving average (MA)** smooths price by averaging the last N days, so you see the trend without the daily noise. Two are widely watched:

- The **50-day MA** tracks the medium-term trend.
- The **200-day MA** tracks the long-term trend.

When the shorter average crosses the longer one, traders take note:

| Signal | What happens | Common reading |
|--------|--------------|----------------|
| **Golden cross** | 50-day crosses *above* 200-day | Bullish; momentum turning up |
| **Death cross** | 50-day crosses *below* 200-day | Bearish; momentum turning down |

These are lagging signals — they confirm a turn after it has begun, rather than predicting it.

### Momentum oscillators: RSI and MACD

**Momentum** measures how fast price is moving. Two common gauges:

- **RSI (Relative Strength Index)** runs from 0 to 100. As a rule of thumb, above ~70 is **overbought** (risen fast, may be due for a pause), below ~30 is **oversold** (fallen fast, may be due for a bounce). In a strong trend, though, RSI can stay "overbought" for a long time — it's a caution flag, not a sell button.
- **MACD (Moving Average Convergence Divergence)** compares two moving averages to show whether momentum is building or fading. When its line crosses above its signal line, momentum is turning up; below, turning down.

### Volume confirms

**Volume** — the number of shares traded — tells you *how much conviction* is behind a move. A breakout on heavy volume is more trustworthy than one on thin volume, which may fizzle.

> **Key idea:** Technicals describe *probabilities and timing*, not intrinsic value. A chart can tell you the crowd is buying; it cannot tell you the business is worth the price. Use it alongside fundamentals, never instead of them.

*In the plugin:* the `technical-analysis` skill reads trend, support/resistance, and indicators; the `chart-master` skill draws the visuals (MA lines, RSI/MACD, volume, candlesticks).

---

## 2. Sentiment and smart-money positioning

Beyond the chart, you can watch what informed players are *actually doing* with their money. These signals reveal positioning and sentiment.

### Insider trading (SEC Form 4)

Company insiders — executives and directors — must report their trades to the SEC on **Form 4** within two business days. This is public.

- **Insider buying** is the stronger signal. Insiders sell for many reasons (taxes, a house, diversification), but they generally *buy* for only one: they think the stock is cheap.
- **Insider selling** is noisier and often routine, so read it with more caution.

> **Key idea:** A cluster of insiders buying with their own cash — especially after a price drop — is a meaningful vote of confidence.

*In the plugin:* the `insider-trading` skill parses Form 4 filings and flags notable buying or selling.

### Institutional ownership (13F filings)

Large investment funds (over $100M) must disclose their holdings quarterly on a **13F filing**. This lets you track what big, well-resourced "smart money" is adding to or trimming from their portfolios.

The signal is in the *change*: a respected fund building a new position, or several institutions accumulating a stock, suggests conviction. Note the ~45-day reporting lag — 13F data shows where the money *was*, not where it is today.

*In the plugin:* the `institutional-ownership` skill tracks 13F changes to spot accumulation and distribution.

### Short interest and the squeeze

**Short interest** is the number of shares that traders have sold short — borrowed and sold, betting the price will fall. High short interest means many are bearish.

But it cuts both ways. If a heavily-shorted stock starts rising, short sellers must buy back shares to cut losses, and their buying pushes the price *higher still* — a **short squeeze**. A useful gauge is **days-to-cover**: short interest divided by average daily volume, estimating how long it would take shorts to buy back. Higher = more squeeze fuel.

*In the plugin:* the `short-interest` skill measures bearish positioning and squeeze potential.

### Options signals

The **options** market — contracts to buy (**calls**) or sell (**puts**) a stock at a set price — reveals expectations and hedging.

- **Implied volatility (IV)** is the market's expectation of how much a stock will move, baked into option prices. High IV means big moves are expected (often around earnings); it makes options expensive.
- **Put/call ratio** compares put volume to call volume. A high ratio (lots of puts) signals fear or hedging; a low ratio signals optimism. Extremes can be *contrarian* — everyone bearish sometimes marks a bottom.
- **The Greeks** in one line: they measure an option's sensitivity — *delta* to the stock's price, *theta* to time decay, *vega* to volatility. They tell you what drives an option's value.

*In the plugin:* the `options-analysis` skill reads IV, the put/call ratio, and the Greeks.

| Signal | Bullish read | Bearish read |
|--------|--------------|--------------|
| Insider trades (Form 4) | Cluster of buying | Heavy, unusual selling |
| Institutional 13F | Funds accumulating | Funds trimming |
| Short interest | Squeeze setup if price turns up | Rising short interest, price falling |
| Put/call ratio | Low (optimism) — or extreme high (contrarian bottom) | High (fear) in a weak tape |

---

## 3. Events and catalysts

Stocks often move in jumps around *events*. Knowing the calendar helps you anticipate volatility and check your thesis.

### Earnings calls

Every quarter, a company reports results and management holds an **earnings call**. Three things move the stock:

- **Surprises** — results above or below what analysts expected. Beating on revenue and profit usually helps; missing usually hurts.
- **Guidance** — management's forecast for coming quarters. Often this matters *more* than the reported numbers, because markets look forward.
- **Tone** — the language and confidence of management. Hesitation, hedging, or defensiveness on the call can undercut good numbers.

*In the plugin:* the `earnings-call-analysis` skill reads a transcript for sentiment, key themes, and management tone.

### Forward catalysts

A **catalyst** is a known upcoming event that could move the stock: a product launch, a drug approval or trial result, a major contract, an index inclusion, or a macro data release (a "print") like a jobs or inflation report. Mapping these ahead of time tells you when volatility — and opportunity or risk — is likely to cluster.

> **Key idea:** Catalysts don't tell you *which way* a stock will move, but they tell you *when* it's likely to move a lot. That's valuable for sizing and timing.

*In the plugin:* the `catalyst-calendar` skill builds a forward calendar of events and their expected impact.

---

## 4. Macro and sectors (top-down)

Individual stocks swim in a bigger current: the **macro regime** — the state of interest rates, inflation, and the economic cycle. Reading it top-down tells you which *styles* and *sectors* have the wind at their back.

### The key macro dials

- **Interest rates** — set largely by the central bank. Higher rates make borrowing costlier and make safe bonds more attractive versus stocks, which tends to pressure prices — especially for **long-duration** growth stocks (whose value depends on profits far in the future).
- **The yield curve** — a plot of bond yields across maturities. Normally longer bonds yield more. When it **inverts** (short yields exceed long), it has historically been a warning sign for recession.
- **Inflation** — rising prices. High inflation often pushes the central bank to raise rates, squeezing valuations.
- **Leading indicators** — data that tends to move *before* the economy, like new orders, building permits, or jobless claims, hinting at where the cycle is headed.

### How regimes favor different sectors

Different parts of the economy do better at different points in the cycle. Roughly:

| Regime | What's happening | Tends to favor |
|--------|------------------|----------------|
| **Early cycle** | Recovery, rates low, growth accelerating | **Cyclicals** — consumer discretionary, industrials, financials |
| **Late cycle** | Growth slowing, rates high | **Defensives** — utilities, staples, healthcare |
| **Rising rates** | Tightening policy | Pressures long-duration **growth** and rate-sensitive sectors (real estate, utilities) |

**Sector rotation** is the tendency of money to flow from one group to another as the regime shifts — for example, out of high-growth tech and into defensives as rates rise and the cycle matures.

*In the plugin:* the `economics-analysis` skill reads the regime (rates, inflation, indicators); the `sector-analysis` skill maps that regime to the sectors likely to lead. See [Concepts](concepts.html) on "Macro regimes" for the bigger picture.

### Illustrative example

Suppose (hypothetically) the central bank is raising rates to fight 5% inflation, and the yield curve has just inverted. Top-down, you'd expect long-duration growth stocks to face a headwind and defensives to hold up better. That doesn't mean *sell everything* — it means you'd demand a higher margin of safety on richly-valued growth names and weight the macro against your thesis. Numbers here are round and hypothetical.

---

## Putting the signals together

No single signal is decisive. Each one — a golden cross, a cluster of insider buys, a beat-and-raise, a friendly macro regime — nudges the odds. The strongest reads come when they *agree*.

> **Key idea:** Confidence should rise when fundamentals, valuation, and market signals point the same way — and drop when they conflict. A cheap, high-quality business with insiders buying and the sector in favor is a much higher-confidence idea than any one of those alone.

When signals disagree — say, great fundamentals but a broken chart and a hostile macro — that's not a reason to ignore the conflict; it's a reason to *lower your confidence*, size smaller, or wait. This is exactly the logic behind InvestSkill's signal blocks and its emphasis on *confidence*. See [Concepts](concepts.html) for how the plugin combines signals into a single, honest read.

---

## Key takeaways

- Market signals are about **probability, timing, and positioning** — not certainty, and never a substitute for valuing the business.
- Technicals (trend, support/resistance, MAs, RSI, MACD, volume) describe crowd behavior; use them to confirm timing, not to judge worth.
- Smart-money signals — insider buying (stronger than selling), 13F accumulation, short-squeeze setups, options IV and put/call — reveal how informed players are positioned.
- Events (earnings calls) and forward catalysts tell you *when* a stock is likely to move a lot; the macro regime tells you which sectors and styles have the wind at their back.
- Confidence is highest when fundamentals, valuation, and market signals agree — and should fall when they conflict.

---

> **Next / Related:** You've completed Lesson 5 of 6. Previous: [Valuation Essentials](learning-valuation.html). Next: [Portfolio & Risk](learning-portfolio.html). See also the [Glossary](glossary.html) and [Concepts](concepts.html) for definitions, and the [Learning hub](learning.html) for all lessons.

*Educational content only. Not financial advice.*
