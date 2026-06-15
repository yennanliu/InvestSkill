# Financial Glossary

> Plain-English definitions for every metric the InvestSkill frameworks emit. Each entry gives the formula, a rough "good vs. bad" range, and which skill surfaces it. Ranges are rules of thumb, not absolute rules — context (industry, growth stage, rates) always matters.

**Jump to:** [A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [I](#i) · [M](#m) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [W](#w) · [Y](#y)

---

## A

### Altman Z-Score
Bankruptcy-risk score combining five weighted ratios (working capital, retained earnings, EBIT, equity, sales — all relative to assets).
- **Good / bad:** > 3.0 safe · 1.8–3.0 grey zone · < 1.8 distress.
- **Surfaced by:** `financial-report-analyst`, `result-validator`.

### Alpha
Return earned *above* what the market (or a benchmark) would predict for a given level of risk. Positive alpha = skill or edge; zero alpha = you just matched the market.
- **Surfaced by:** `portfolio-review`.

### Asset Turnover
How efficiently a company converts assets into revenue. `Revenue ÷ Total Assets`.
- **Good / bad:** higher is better, but it's industry-specific (retail runs high, utilities low).
- **Surfaced by:** `fundamental-analysis`.

---

## B

### Beta (β)
How much a stock moves relative to the market. β = 1 moves with the market; β > 1 is more volatile; β < 1 is calmer; negative β moves opposite.
- **Good / bad:** not good or bad — it sizes *risk*. High beta amplifies both gains and losses.
- **Surfaced by:** `dcf-valuation` (feeds WACC), `technical-analysis`, `portfolio-review`.

### Book Value
Net assets on the balance sheet: `Total Assets − Total Liabilities`. The accounting "breakup" value of equity.
- **Surfaced by:** `stock-valuation`, `fundamental-analysis`.

### Burn Rate
How fast a company spends cash in excess of revenue, usually for pre-profit firms. Paired with **runway** (months of cash left).
- **Good / bad:** lower burn + longer runway is safer. Negative free cash flow with short runway is a red flag.
- **Surfaced by:** `financial-report-analyst`.

---

## C

### CAGR (Compound Annual Growth Rate)
The smoothed annual growth rate over a multi-year period. `(End ÷ Start)^(1/years) − 1`.
- **Surfaced by:** `dividend-analysis`, `fundamental-analysis`.

### Current Ratio
Short-term liquidity: `Current Assets ÷ Current Liabilities`. Can the company cover the next 12 months of bills?
- **Good / bad:** > 1.5 comfortable · 1.0–1.5 adequate · < 1.0 potential strain.
- **Surfaced by:** `fundamental-analysis`, `financial-report-analyst`.

---

## D

### Days-to-Cover (Short Interest Ratio)
Days of normal trading volume it would take short sellers to buy back (cover) all shorted shares. `Shares Short ÷ Average Daily Volume`.
- **Good / bad:** higher = more squeeze fuel. > 5 days is notable; > 10 is high.
- **Surfaced by:** `short-interest`.

### DCF (Discounted Cash Flow)
Valuation method that projects future free cash flows and discounts them back to today's value using a discount rate (WACC). The output is an **intrinsic value** per share.
- **Surfaced by:** `dcf-valuation`, `stock-valuation`. See [Concepts → How intrinsic value works](concepts.html#how-intrinsic-value-works).

### Debt-to-Equity (D/E)
Leverage: `Total Debt ÷ Shareholders' Equity`. How much the company funds itself with debt vs. owner capital.
- **Good / bad:** < 1.0 conservative · 1.0–2.0 moderate · > 2.0 leveraged (industry-dependent — banks and utilities run high).
- **Surfaced by:** `fundamental-analysis`, `dividend-analysis`.

### Dividend Coverage Ratio
How many times earnings (or free cash flow) cover the dividend. `EPS ÷ Dividend per Share`, or the FCF version.
- **Good / bad:** > 2x healthy · 1.5–2x adequate · < 1.2x fragile.
- **Surfaced by:** `dividend-analysis`.

### Dividend Payout Ratio
Share of earnings paid out as dividends. `Dividends ÷ Net Income`.
- **Good / bad:** < 60% generally sustainable · 60–80% watch · > 100% paying more than it earns (yield-trap warning).
- **Surfaced by:** `dividend-analysis`.

### Dividend Yield
Annual dividend as a percent of price. `Annual Dividend ÷ Price`.
- **Good / bad:** a very high yield (e.g., > 7%) is often a *warning*, not a gift — the market may expect a cut. See [yield trap](#yield-trap).
- **Surfaced by:** `dividend-analysis`.

---

## E

### EBITDA
Earnings Before Interest, Taxes, Depreciation & Amortization — a proxy for operating cash generation that strips out capital structure and accounting choices.
- **Caution:** ignores real capital costs; "EBITDA is not cash flow."
- **Surfaced by:** `stock-valuation`, `fundamental-analysis`.

### EPS (Earnings Per Share)
Net income attributable to each share. `Net Income ÷ Shares Outstanding`. "Diluted EPS" includes options/convertibles.
- **Surfaced by:** nearly every fundamental skill.

### EV (Enterprise Value)
The whole-company price a buyer pays: `Market Cap + Total Debt − Cash`. Used instead of market cap so debt-heavy and cash-rich firms compare fairly.
- **Surfaced by:** `stock-valuation`.

### EV/EBITDA
Enterprise value relative to operating earnings — a capital-structure-neutral valuation multiple.
- **Good / bad:** < 10x often cheap · 10–15x fair · > 15x rich (sector-dependent).
- **Surfaced by:** `stock-valuation`.

---

## F

### FCF (Free Cash Flow)
Cash left after operating expenses *and* capital spending. `Operating Cash Flow − CapEx`. The cash an owner could actually take out.
- **Good / bad:** consistently positive and growing is the gold standard. Negative FCF needs a growth story to justify it.
- **Surfaced by:** `dcf-valuation`, `fundamental-analysis`, `dividend-analysis`.

### FCF Yield
Free cash flow relative to market cap. `FCF ÷ Market Cap`. The cash-return version of an earnings yield.
- **Good / bad:** > 5% attractive · 3–5% fair · < 3% expensive.
- **Surfaced by:** `stock-valuation`.

---

## G

### Gross Margin
Profit after the direct cost of goods. `(Revenue − COGS) ÷ Revenue`. A first read on pricing power.
- **Good / bad:** higher and stable signals a moat; falling margins signal competition.
- **Surfaced by:** `fundamental-analysis`, `competitor-analysis`.

### Greeks (Options)
Sensitivities of an option's price: **Delta** (vs. underlying price), **Gamma** (rate of delta change), **Theta** (time decay), **Vega** (vs. volatility), **Rho** (vs. interest rates).
- **Surfaced by:** `options-analysis`.

---

## I

### Implied Volatility (IV)
The market's expected future volatility, baked into option prices. Higher IV = pricier options = bigger expected swings.
- **Surfaced by:** `options-analysis`.

### IV Rank / IV Percentile
Where current implied volatility sits versus its own past year (0–100). Tells you if options are "expensive" or "cheap" relative to their own history.
- **Good / bad:** high IV rank favors *selling* premium; low favors *buying* it.
- **Surfaced by:** `options-analysis`.

### Interest Coverage Ratio
How easily operating earnings pay interest. `EBIT ÷ Interest Expense`.
- **Good / bad:** > 5x safe · 2–5x adequate · < 1.5x danger.
- **Surfaced by:** `financial-report-analyst`, `dividend-analysis`.

---

## M

### Margin of Safety
The discount between a stock's price and its estimated intrinsic value. The buffer that protects you if your estimate is wrong.
- **Good / bad:** value investors often want 20–40%+ before buying.
- **Surfaced by:** `dcf-valuation`, `stock-eval`. See [Concepts → Margin of safety](concepts.html#margin-of-safety--position-sizing).

### Moat
A durable competitive advantage that protects long-term profits — brand, network effects, switching costs, scale, or patents.
- **Good / bad:** wide > narrow > none. Shows up as persistently high ROIC and stable margins.
- **Surfaced by:** `competitor-analysis`, `stock-eval`. See [Concepts → Reading a moat](concepts.html#reading-a-moat).

---

## P

### P/B (Price-to-Book)
Price relative to accounting net worth. `Price ÷ Book Value per Share`.
- **Good / bad:** most useful for asset-heavy/financial firms; < 1.0 can mean cheap *or* troubled.
- **Surfaced by:** `stock-valuation`.

### P/E (Price-to-Earnings)
Price per dollar of earnings. `Price ÷ EPS`. The most-quoted multiple; compare to the company's own history and peers, not in isolation.
- **Good / bad:** there is no universal "good" P/E — a 40x grower can be cheaper than a 10x decliner. Pair with growth (see PEG).
- **Surfaced by:** `stock-valuation`, `stock-eval`.

### P/S (Price-to-Sales)
Price per dollar of revenue. `Market Cap ÷ Revenue`. Useful for unprofitable or early-stage firms where P/E is meaningless.
- **Surfaced by:** `stock-valuation`.

### PEG Ratio
P/E adjusted for growth. `P/E ÷ Earnings Growth Rate (%)`. Puts fast and slow growers on the same footing.
- **Good / bad:** ~1.0 fairly priced · < 1.0 potentially cheap · > 2.0 expensive.
- **Surfaced by:** `stock-valuation`, `stock-eval`.

### Piotroski F-Score
A 0–9 checklist of fundamental health across profitability, leverage/liquidity, and operating efficiency. Each "yes" scores a point.
- **Good / bad:** 7–9 strong · 4–6 middling · 0–3 weak.
- **Surfaced by:** `stock-eval`, `fundamental-analysis`.

### Porter's Five Forces
A framework rating industry attractiveness across five pressures: competitive rivalry, supplier power, buyer power, threat of substitutes, threat of new entrants.
- **Surfaced by:** `competitor-analysis`.

---

## Q

### Quick Ratio (Acid Test)
Stricter liquidity than current ratio — excludes inventory. `(Current Assets − Inventory) ÷ Current Liabilities`.
- **Good / bad:** > 1.0 comfortable.
- **Surfaced by:** `fundamental-analysis`.

---

## R

### Residual Income
Earnings above the cost of the equity capital used to produce them. Value is created only when returns exceed the cost of capital.
- **Surfaced by:** `stock-valuation`.

### ROA (Return on Assets)
Profit per dollar of assets. `Net Income ÷ Total Assets`. How well management uses the asset base.
- **Good / bad:** > 5% solid (industry-dependent).
- **Surfaced by:** `fundamental-analysis`.

### ROE (Return on Equity)
Profit per dollar of shareholder equity. `Net Income ÷ Equity`. Watch for ROE inflated by heavy debt.
- **Good / bad:** > 15% strong · 10–15% decent · < 10% weak.
- **Surfaced by:** `fundamental-analysis`, `stock-eval`.

### ROIC (Return on Invested Capital)
The cleanest profitability measure: returns on *all* capital (debt + equity) put to work. `NOPAT ÷ Invested Capital`. Compare to WACC — value is created only when **ROIC > WACC**.
- **Good / bad:** > 15% excellent · 10–15% good · below WACC = destroying value.
- **Surfaced by:** `stock-eval`, `fundamental-analysis`, `competitor-analysis`.

---

## S

### Sharpe Ratio
Risk-adjusted return: excess return per unit of volatility. `(Return − Risk-free Rate) ÷ Std Dev`.
- **Good / bad:** > 1 good · > 2 very good · < 1 weak.
- **Surfaced by:** `portfolio-review`.

### Short Float (Short Interest %)
Percent of freely tradable shares sold short. `Shares Short ÷ Float`.
- **Good / bad:** > 10% elevated · > 20% high (crowded short, squeeze potential).
- **Surfaced by:** `short-interest`.

### Support & Resistance
Price levels where buying (support) or selling (resistance) has historically clustered. Breaks of these levels are technical signals.
- **Surfaced by:** `technical-analysis`.

---

## T

### Terminal Value
In a DCF, the value of all cash flows *beyond* the explicit forecast period — often 60–80% of the total. Highly sensitive to the assumed perpetual growth rate.
- **Surfaced by:** `dcf-valuation`. See [Concepts → How intrinsic value works](concepts.html#how-intrinsic-value-works).

---

## W

### WACC (Weighted Average Cost of Capital)
The blended required return on a company's debt and equity — the discount rate in a DCF. `(E/V × Cost of Equity) + (D/V × Cost of Debt × (1−tax))`.
- **Good / bad:** not good/bad — it's the hurdle. A small WACC change swings intrinsic value a lot.
- **Surfaced by:** `dcf-valuation`.

---

## Y

### Yield Trap
A stock with a tempting dividend yield that is unsustainable — the market has priced in a coming cut. Spotted via payout ratio > 100%, falling FCF, or rising debt.
- **Surfaced by:** `dividend-analysis`. See [Use Cases → The dividend investor](use-cases.html#the-dividend--income-investor).

---

> **See also:** [Concepts](concepts.html) for the mental models behind these metrics · [Choose a Skill](choose-a-skill.html) to find the right framework · [Data & Accuracy](data-and-accuracy.html) for how to trust the numbers.

*Educational reference only. Not financial advice.*
