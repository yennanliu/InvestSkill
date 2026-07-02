# The Professional's Playbook

> The first six lessons gave you the tools. This one shows a professional using **all of them on a single stock** — from first idea to a written trading plan you actually track. We'll walk one company end to end: how a disciplined investor plans the work, runs the analysis, decides, sizes the position, writes entry and exit rules, and monitors the thesis over time. **Every number here is illustrative and rounded for teaching — it is not current data and not a recommendation.**

**What you'll learn**

- The repeatable **loop** a professional runs on every idea
- How to turn "I like this company" into a written **thesis** and a research plan
- How the quality → statements → valuation → market lenses combine into **one decision**
- How to **size** a position and write an entry/exit **trading plan**
- How to **track** a thesis and know when it's broken
- How the same process adapts to a very different kind of stock

---

## The professional's loop

Amateurs buy on a tip and then watch the price. Professionals run a **process** — the same loop every time — so the decision is repeatable, reviewable, and improvable.

| # | Stage | The question | Lesson | InvestSkill |
|---|-------|--------------|--------|-------------|
| 1 | **Idea** | Is this worth my time? | 1 | `stock-screener` |
| 2 | **Thesis** | In one sentence, why would this make money? | 1, 3 | — |
| 3 | **Research plan** | What must be true for the thesis to work? | all | — |
| 4 | **Analyze** | Is it a good business, cheaply priced, at a decent time? | 2–5 | `stock-eval`, `fundamental-analysis`, `dcf-valuation`, `technical-analysis` |
| 5 | **Decide & size** | Buy? Hold? How much? | 4, 6 | `result-validator`, `portfolio-review` |
| 6 | **Trading plan** | At what price do I buy, add, trim, and exit? | 4, 6 | — |
| 7 | **Monitor** | Is the thesis still on track? | 5, 6 | `earnings-call-analysis`, `catalyst-calendar` |
| 8 | **Review / sell** | What changed, and what do I do about it? | 6 | `portfolio-review` |

> **Key idea:** the goal isn't to be right once — it's to run a process you can repeat and audit. A written plan turns investing from a bet into a craft. Being *wrong* with a plan teaches you something; being *right* without one teaches you nothing.

Let's run the loop on a real company.

---

## Step 0 · Meet the example

Our example is **Apple (AAPL)** — a business almost everyone understands, which makes the *method* easy to see. To keep the focus on process, assume our data pull returns these **rounded, illustrative** figures (again: for teaching, not live data):

| Snapshot (illustrative) | Value |
|-------------------------|-------|
| Share price | ~$200 |
| Shares outstanding | ~15.0 B |
| Market cap | ~$3.0 T |
| Revenue (TTM) | ~$390 B |
| Gross margin | ~46% |
| Operating margin | ~30% |
| Net income | ~$95 B |
| Free cash flow (FCF) | ~$100 B |
| Buybacks / dividends | ~$80 B / ~$15 B per year |
| Net cash position | positive (more cash than debt) |
| P/E | ~32× |

That's the raw material. The job now is to turn it into a decision.

---

## Step 1 · Write the thesis *first*

Before opening a spreadsheet, a professional writes the thesis in one sentence — it forces clarity and gives you something to *disprove* later.

> **Thesis:** *Apple is a wide-moat cash machine whose services growth and relentless buybacks compound per-share value — and I want to own it if I can buy at a price that leaves a margin of safety.*

Then the two-sided version, because a thesis you can't argue against is a hope, not a thesis:

| Bull case | Bear case |
|-----------|-----------|
| Ecosystem lock-in + brand → durable pricing power | Hardware growth is mature; upgrade cycles lengthen |
| Services (high-margin, recurring) keeps growing | Regulatory risk to App Store / default-search deal |
| Huge FCF funds buybacks that shrink the share count | Valuation is rich — priced for perfection |

*In the plugin:* `stock-eval` produces a fast quality/value/growth read to sanity-check a thesis before you invest hours; `competitor-analysis` pressure-tests the moat.

---

## Step 2 · The research plan

The thesis implies a checklist of things that **must be true**. Write them as questions, then assign each to a lesson and a skill. This is your research plan — you're done when every box is answered.

| Must be true | How to check | Lesson | Skill |
|--------------|--------------|--------|-------|
| It's a genuinely high-quality business | ROIC ≫ WACC, fat stable margins | [3](learning-quality.html) | `fundamental-analysis` |
| The numbers are clean and cash-backed | FCF ≈ or > net income, healthy balance sheet | [2](learning-statements.html) | `financial-report-analyst` |
| The moat is real, not marketing | Persistent returns, resilient share | [3](learning-quality.html) | `competitor-analysis` |
| I know what it's worth | DCF + multiples → fair-value range | [4](learning-valuation.html) | `dcf-valuation`, `stock-valuation` |
| The timing/sentiment isn't a trap | Trend, positioning, upcoming catalysts | [5](learning-market.html) | `technical-analysis`, `catalyst-calendar` |
| It fits my portfolio | Sizing, concentration, correlation | [6](learning-portfolio.html) | `portfolio-review` |

---

## Step 3 · Is it a good business? (quality)

Run the [quality lens](learning-quality.html). With our illustrative numbers:

- **Returns on capital:** ROIC comfortably above any reasonable WACC (~8–9%) — the hallmark of a value-*creating* business.
- **Margins:** ~46% gross, ~30% operating, and *stable* — a moat tell (see [Lesson 3](learning-quality.html)).
- **Moat:** switching costs (ecosystem) + intangibles (brand). Verify it in the numbers: margins and share hold up over years, not just in the pitch.
- **Capital allocation:** ~$80 B/yr of buybacks below-or-around intrinsic value shrinks the share count, lifting EPS even if net income is flat.

**Verdict:** high quality. This clears the highest bar. But quality is only half the question — a wonderful business at a terrible price is still a bad investment.

---

## Step 4 · Do the statements back it up?

Quick pass with the [statements lens](learning-statements.html): revenue ~$390 B, **FCF ~$100 B ≥ net income ~$95 B** (profits are cash-backed, not accounting mirages), and a **net-cash** balance sheet (low financial risk). No red flags in this illustrative snapshot — receivables and inventory aren't ballooning ahead of sales.

> **Key idea:** you're not re-auditing the company — you're checking that the *quality story is confirmed by cash*, and hunting for anything that would break the thesis. Clean statements raise **confidence**; messy ones lower it.

---

## Step 5 · What's it worth? (valuation)

Now the hard part. Two methods, then triangulate — exactly the [valuation lens](learning-valuation.html).

### A quick scenario DCF (illustrative)

Start from FCF ≈ $100 B, discount at WACC ≈ 8.5%, terminal growth ≈ 3%, and vary the 10-year growth assumption:

| Scenario | FCF growth (yr 1–10) | Implied fair value / share |
|----------|----------------------|----------------------------|
| **Bear** | ~3% | ~$150 |
| **Base** | ~6% | ~$185 |
| **Bull** | ~9% | ~$230 |

### Multiples cross-check

P/E ~32× sits **above** the ~20–25× the business has historically commanded. On a multiples basis it looks full.

### Put it together

- **Fair-value range:** roughly **$150–230**, base case **~$185**.
- **Price today:** ~$200 — *above* the base case.
- **Margin of safety:** negative at $200. A value-minded investor wants to buy ~15–25% *below* fair value, i.e. **≤ ~$155–160**.

> **Key idea:** great company, full price. This is the most common professional outcome — and the discipline is to **wait**, not to rationalize. The trading plan (next) is how you profit from patience instead of fighting it.

---

## Step 6 · Read the market (timing & confirmation)

Valuation says *what*; the [market lens](learning-market.html) helps with *when* and whether the crowd is set up against you.

- **Trend:** price above the 200-day average = long-term uptrend; don't short a quality compounder just because it's expensive.
- **Positioning:** check insider activity (`insider-trading`) and institutional flows (`institutional-ownership`) — heavy insider *selling* or funds trimming would lower confidence.
- **Catalysts:** the next earnings call and any product/regulatory events (`catalyst-calendar`, `earnings-call-analysis`) can create the pullback you're waiting for.

---

## Step 7 · Decide & size

Roll it up into a decision summary — the same axes as InvestSkill's signal block (decoded in [Concepts](concepts.html)):

| Field | Read | Why |
|-------|------|-----|
| **Signal** | Bullish (business) | Quality + moat are strong |
| **Confidence** | High | Clean, cash-backed numbers |
| **Horizon** | Long-term (3–5 yr) | Compounding thesis |
| **Action** | **Buy on weakness / Hold** | Price above fair value *today* |
| **Conviction** | Moderate | Thin margin of safety at $200 |

**Position size.** Conviction and risk set size — not excitement. House rules for this example:

- Full target position: **5%** of the portfolio (a core, not a punt).
- Never let one name exceed **8%** (concentration cap, [Lesson 6](learning-portfolio.html)).
- Because the margin of safety is thin, **start small and scale in on weakness** rather than buying 5% at $200.

*In the plugin:* run `result-validator` on the analysis to score data quality and signal consistency before committing; `portfolio-review` checks the position against your existing holdings.

---

## Step 8 · The trading plan (write it down)

This is what separates a professional from a hopeful. Decide the rules **before** emotion is involved, and write them where you'll see them.

| Rule | Level | Logic |
|------|-------|-------|
| **Starter buy** | ≤ $175 | ~1.5% position; near/under base fair value |
| **Add #1** | ~$160 | +1.5%; ~15% below fair value |
| **Add #2** | ~$145 | +2.0% to full 5%; deep margin of safety |
| **Trim** | > $230 | Above bull fair value, or if position > 8% |
| **Time horizon** | 3–5 years | Compounding thesis, not a trade |
| **Hard stop?** | None on price | For a quality long-term hold, sell on *thesis*, not on quotes — see triggers below |

> **Key idea:** a scale-in ladder means you don't need to be right about the bottom. If it never pulls back, you own a small starter and missed nothing you were entitled to; if it falls, your average cost improves and your margin of safety widens.

### The trade ticket

A one-line record for every entry keeps you honest:

```
2026-07-02 · AAPL · BUY 8 sh @ $172 · thesis: moat + buybacks · target FV $185 · size now 1.5%
```

---

## Step 9 · Track the thesis

A position isn't "set and forget." A professional keeps a short **monitoring dashboard** and reviews it on a schedule.

**Review cadence:** every earnings report (quarterly) + on any major news.

**What to watch (the KPIs the thesis depends on):**

| Watch | Thesis stays intact if… |
|-------|-------------------------|
| Gross margin | Holds ~46%+ (pricing power intact) |
| Services growth | Still growing double digits (recurring, high-margin) |
| Buyback pace | Share count keeps falling |
| ROIC | Stays well above WACC |
| Balance sheet | Remains net-cash |

**Thesis-invalidation triggers — sell/reassess if:**

- Gross margin structurally breaks below, say, ~40% (moat eroding).
- Services growth stalls (the growth leg of the thesis is gone).
- Buybacks are halted and cash is redeployed into value-destructive M&A.
- A regulatory ruling permanently impairs the App Store or search economics.
- The original one-sentence thesis is no longer true.

> **Key idea:** decide your sell triggers *while you're calm and objective* — at purchase — not in the middle of a 20% drawdown when you'll rationalize anything.

### A monitoring journal entry (illustrative)

```
Q3 review · AAPL
  Gross margin 46.2% ✓   Services +12% ✓   Buybacks on pace ✓
  Price $210 (above base FV) → no adds; hold
  Thesis intact. Next check: next earnings + any App Store ruling.
```

---

## Step 10 · The sell discipline

Professionals sell for **four** reasons — and "the price went up/down" is not one of them by itself:

1. **The thesis broke** — an invalidation trigger fired. Sell regardless of price.
2. **A materially better opportunity** exists — capital is finite.
3. **Extreme overvaluation** — price far exceeds even the bull case (trim/exit).
4. **Position/risk management** — it grew past your concentration cap, so trim back to target.

> **Key idea:** "It's up 40%" is not a reason to sell a compounder; "the moat is cracking" is. Selling winners early and holding losers hoping to "get back to even" is the single most common self-inflicted wound — anchor to the *thesis*, not to your cost basis.

---

## A different playbook: a pre-profit growth stock

The **loop never changes**, but the emphasis does. For a young, unprofitable company (think a `RKLB`-style name):

| Stage | Mature compounder (AAPL) | Pre-profit growth |
|-------|--------------------------|-------------------|
| Quality | ROIC, margins | Gross-margin *trend*, unit economics, TAM |
| Statements | FCF vs. net income | Cash **runway** and burn rate |
| Valuation | DCF + P/E | Scenario DCF + P/S vs. peers; wide ranges |
| Sizing | Core 5% | Smaller (e.g. ≤2%) — higher uncertainty |
| Trading plan | Scale in on weakness | Same, but wider bands; expect volatility |
| Triggers | Margin/services | Runway shrinking, growth decelerating |

The point: same disciplined loop, dialed to the risk. See a **real, full end-to-end run** across every skill in the [Demo](full-demo.html).

---

## Key takeaways

- Run the **same loop every time**: idea → thesis → plan → analyze → decide → trading plan → monitor → review. Repeatable beats brilliant.
- **Write the thesis and the sell triggers first**, while you're objective. Judge the position against them later.
- A **great business at a full price is a "wait," not a "buy."** The margin of safety is your edge.
- A **trading plan** (scale-in ladder + trim/exit rules) lets patience pay instead of guessing the bottom.
- **Track a short KPI dashboard** on a schedule; sell on a broken thesis, not on the quote.

---

> **Next / Related:** back to the [Learning Hub](learning.html) · revisit [Valuation](learning-valuation.html) and [Portfolio & Risk](learning-portfolio.html) · then [Choose a Skill](choose-a-skill.html) to run this on a ticker, or watch a full run in the [Demo](full-demo.html).

*Educational content only. Not financial advice. All figures are illustrative and rounded for teaching — not current data.*
