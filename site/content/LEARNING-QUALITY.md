# Judging Business Quality

> This lesson teaches you how to tell a genuinely great business from a merely popular one. You'll learn to read profitability, returns on capital, margins, economic moats, growth quality, balance-sheet health, and how management spends the cash — the traits that separate durable compounders from value traps.

**What you'll learn**

- Why a business only creates value when its returns beat its cost of capital (ROIC > WACC)
- How ROE, ROA, and the DuPont breakdown reveal *how* a company earns its returns
- What gross, operating, and net margins each tell you — and why margin stability signals quality
- The five durable sources of an economic moat, and how to verify a moat in the numbers
- How to tell value-creating growth from value-destroying growth
- How to gauge balance-sheet health with leverage, coverage, and composite scores (Altman Z, Piotroski F)
- Why capital allocation is one of the strongest quality signals of all

---

## What "quality" actually means

Price tells you what a stock costs. Quality tells you what you're buying. A high-quality business earns strong returns on the money invested in it, defends those returns against competitors, and is run by managers who spend cash wisely. Quality is one of three lenses InvestSkill uses to size up a stock — the others are **value** (is it cheap?) and **growth** (is it expanding?).

> **Key idea:** A great business isn't the one growing fastest or trading cheapest — it's the one that turns each dollar of invested capital into the most durable profit.

*In the plugin:* the `stock-eval` skill blends quality, value, and growth into a single score, while `fundamental-analysis` computes the underlying ratios. For the mental model behind the three lenses, see [Concepts](concepts.html).

---

## Profitability and returns on capital

Profit alone doesn't tell you much — a company that earns $1 billion using $100 billion of capital is mediocre; one that earns $1 billion using $5 billion is exceptional. **Returns on capital** measure profit *relative to the money tied up in the business.*

### ROIC vs. WACC — the single most important test

**ROIC (Return on Invested Capital)** measures the after-tax operating profit a company earns for every dollar of capital (debt + equity) invested in operations:

`ROIC = After-tax operating profit (NOPAT) ÷ Invested capital`

**WACC (Weighted Average Cost of Capital)** is what that capital *costs* — the blended return lenders and shareholders require for funding the business.

The rule is simple and powerful:

> **Key idea:** A business creates value only when **ROIC > WACC**. If ROIC is below WACC, every dollar of growth actually destroys value — the company is earning less than the capital costs.

| ROIC vs. WACC | What it means |
|---|---|
| ROIC well above WACC (e.g. 20% vs. 8%) | Value-creating; growth compounds wealth |
| ROIC ≈ WACC | Growth is neutral — running to stand still |
| ROIC below WACC | Value-destroying; growth burns shareholder money |

A company that sustains ROIC above WACC for years almost always has a moat protecting it (more on that below).

### ROE and ROA

Two related measures look at returns from the shareholder's and the total-asset angle:

- **ROE (Return on Equity)** = `Net income ÷ Shareholders' equity` — the return on the owners' stake.
- **ROA (Return on Assets)** = `Net income ÷ Total assets` — how efficiently the whole asset base generates profit.

ROE can be flattered by debt (borrowing amplifies returns to equity), so always read it alongside ROA and leverage. A high ROE with low ROA usually means a lot of borrowing is doing the heavy lifting.

### DuPont: how a company earns its return

The **DuPont breakdown** splits ROE into three drivers, so you can see *where* the return comes from:

`ROE = Net margin × Asset turnover × Financial leverage`

- **Net margin** — profit per dollar of sales (pricing power / efficiency)
- **Asset turnover** — sales per dollar of assets (how hard assets work)
- **Financial leverage** — assets per dollar of equity (how much debt is used)

Two firms can post the same 20% ROE for very different reasons — a luxury brand via fat margins, a discount retailer via rapid turnover. A firm relying mostly on leverage for its ROE is riskier than one earning it through margins or turnover.

---

## Margins: gross, operating, net

Margins show what fraction of each sales dollar survives after different layers of cost. Reading all three tells a story.

| Margin | Formula | What it tells you |
|---|---|---|
| Gross margin | `(Revenue − COGS) ÷ Revenue` | Pricing power and product economics before overhead |
| Operating margin | `Operating income ÷ Revenue` | Profitability after running the business (R&D, sales, admin) |
| Net margin | `Net income ÷ Revenue` | What's left for owners after interest and taxes |

*COGS = cost of goods sold, the direct cost of what you sell.*

A wide **gross margin** hints at pricing power — customers pay more than it costs to make the product. **Operating margin** shows whether that advantage survives the cost of actually running the company. The gap between gross and operating margin reveals how heavy the overhead is.

> **Key idea:** Stable or *rising* margins over several years are a strong quality tell — they suggest the company can raise prices or cut costs without losing customers. Margins that steadily erode signal competition eating the advantage away.

---

## Economic moats

An **economic moat** is a durable structural advantage that protects a company's high returns from competition — like a moat around a castle. The concept, popularized by Warren Buffett, is what lets ROIC stay above WACC for years instead of being competed away.

### The five durable sources of a moat

| Moat source | How it works | Example pattern |
|---|---|---|
| **Network effects** | Each new user makes the product more valuable to others | Marketplaces, payment networks, social platforms |
| **Switching costs** | Leaving is costly, risky, or a hassle | Enterprise software, banks, medical systems |
| **Cost advantage** | Structurally cheaper to produce than rivals | Scale manufacturers, low-cost resource owners |
| **Intangibles / brand** | Patents, licenses, or a brand that commands a price premium | Luxury goods, pharma patents, regulated licenses |
| **Efficient scale** | A market only big enough to profitably serve a few players | Pipelines, regional utilities, niche infrastructure |

### Verify the moat in the numbers, not the marketing

Every company *claims* a moat. Don't take the word for it — a real moat leaves fingerprints in the financials:

- **Persistently high ROIC above WACC** — the clearest signal a moat exists and is holding.
- **Stable or rising gross margins** — pricing power that competition hasn't eroded.
- **Resilient market share** — the company keeps its customers through cycles and price wars.

If a company boasts a moat but its ROIC is sliding toward WACC and margins are shrinking, the moat is narrowing — regardless of the story management tells.

### Porter's Five Forces — a structured lens

To judge how *defensible* an industry is, Michael Porter's **Five Forces** framework asks five questions:

1. **Rivalry** — how intense is competition among existing players?
2. **New entrants** — how easily can newcomers enter?
3. **Substitutes** — could a different product replace this one?
4. **Buyer power** — can customers push prices down?
5. **Supplier power** — can suppliers push costs up?

An attractive, moat-friendly industry has weak forces on all five fronts: low rivalry, high entry barriers, few substitutes, and little bargaining power on either side.

*In the plugin:* the `competitor-analysis` skill rates a company's moat and competitive position using Porter's Five Forces.

---

## Growth quality

Not all growth is good. What matters is whether growth earns *more* than the capital it consumes.

### Organic vs. acquired growth

- **Organic growth** comes from selling more of your own products — usually higher quality, more repeatable, and more profitable.
- **Acquired growth** comes from buying other companies. It can work, but it often masks a stalling core, adds debt, and destroys value when the buyer overpays. Watch for rising revenue paired with lots of acquisitions and shrinking returns on capital.

### Reinvestment runway and value-creating growth

The best businesses have a long **reinvestment runway** — many opportunities to redeploy profits at high returns. Growth is only worth having when the new capital earns above its cost:

> **Key idea:** Growth at ROIC above WACC compounds wealth. Growth at ROIC below WACC destroys it. A slower-growing company earning 25% on capital can be worth far more than a fast grower earning 5%.

---

## Balance-sheet health

A quality business can survive bad years. Leverage is the main thing that turns a rough patch into a crisis.

| Metric | Formula | Rough read |
|---|---|---|
| Debt-to-equity | `Total debt ÷ Shareholders' equity` | Lower is safer; varies a lot by industry |
| Net debt / EBITDA | `(Debt − cash) ÷ EBITDA` | Below ~2× is comfortable; above ~4× is stretched |
| Interest coverage | `EBIT ÷ Interest expense` | Above ~5× is healthy; below ~2× is fragile |
| Current ratio | `Current assets ÷ Current liabilities` | Above 1 means short-term bills are covered |

*EBITDA = earnings before interest, taxes, depreciation, and amortization. EBIT = earnings before interest and taxes.*

### Composite scores: Altman Z and Piotroski F

Two well-known scores bundle several signals into one number.

- **Altman Z-Score** combines five ratios (working capital, retained earnings, EBIT, market value of equity, and sales — all relative to assets) into a bankruptcy-risk gauge. Rough bands: **above ~3.0 = safe, 1.8–3.0 = grey zone, below ~1.8 = distress risk.**
- **Piotroski F-Score** adds up **9 pass/fail checks** across profitability, leverage/liquidity, and operating efficiency, scoring **0–9**. Rough bands: **7–9 = strong financial health, 0–2 = weak.**

These are screening aids, not verdicts — use them to flag names for deeper work, not to decide alone.

*In the plugin:* `fundamental-analysis` computes these ratios and composite scores as part of its quality assessment.

---

## Capital allocation

Once a business generates **free cash flow (FCF)** — cash left after running and maintaining the business — management must decide what to do with it. Those decisions compound over decades, which is why capital allocation is a core quality signal.

There are five main uses of cash:

| Use of cash | When it creates value |
|---|---|
| **Reinvest in the business** | When internal projects earn ROIC above WACC — the best option |
| **Pay dividends** | Returns cash to owners when reinvestment options are limited |
| **Buy back shares** | Value-creating **only** when the stock trades below intrinsic value; destructive above it |
| **Pay down debt** | Reduces risk and interest cost, especially when leverage is high |
| **Acquisitions (M&A)** | Only when the price paid is below the value acquired |

> **Key idea:** Buybacks are not automatically good. Repurchasing overpriced stock destroys value just as surely as an overpriced acquisition. Great allocators buy back shares when they're cheap and hold off when they're dear.

*In the plugin:* the `dividend-analysis` skill judges capital allocation and how a company deploys its free cash flow across dividends, buybacks, debt, and M&A.

---

## A small worked example (illustrative)

Two companies, same $10M net income. Numbers are illustrative and rounded.

| | Company A | Company B |
|---|---|---|
| Net income | $10M | $10M |
| Invested capital | $50M | $200M |
| ROIC | 20% | 5% |
| WACC | 8% | 8% |
| Gross margin trend | Rising | Falling |
| Net debt / EBITDA | 1.0× | 4.5× |
| Buybacks | Below intrinsic value | Above intrinsic value |

Both earn the same profit, but **Company A** creates value (ROIC 20% > WACC 8%), has widening margins, a light balance sheet, and disciplined buybacks. **Company B** destroys value on every growth dollar (ROIC 5% < WACC 8%), faces eroding margins, carries heavy debt, and overpays for its own stock. Company A is the quality business — even before you look at price.

---

## Key takeaways

- Quality is about returns on capital, not the size of profits — a business creates value only when **ROIC > WACC**.
- Use the DuPont breakdown to see *how* returns are earned (margin, turnover, leverage) and read ROE alongside ROA.
- Stable or rising margins and a moat verified in the numbers — persistent high ROIC, resilient share — beat any moat story from management.
- Growth is only valuable when it earns above the cost of capital; prefer organic growth with a long reinvestment runway.
- Check balance-sheet health with leverage and coverage ratios, and use Altman Z and Piotroski F as screening flags.
- Capital allocation — especially buying back stock only when it's cheap — is one of the clearest quality signals.

---

> **Next / Related:** Previous lesson — [Reading Financial Statements](learning-statements.html). Next lesson — [Valuation Essentials](learning-valuation.html). See also the [Concepts](concepts.html) mental model, the [Glossary](glossary.html), and the [Learning overview](learning.html).

*Educational content only. Not financial advice.*
