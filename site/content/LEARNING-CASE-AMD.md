# Case Study: AMD

> [The Professional's Playbook](learning-playbook.html) taught the loop on a mature compounder (Apple). Here we run the **same 10-step process, start to finish, on a very different stock: Advanced Micro Devices (AMD)** — a cyclical, high-growth semiconductor name at the center of the AI trade. Watch how the identical process leads to a completely different decision, position size, and trading plan. **All company facts are real; every financial figure is illustrative and rounded for teaching — not current data, and not a recommendation.**

**What you'll learn**

- How to apply the playbook loop to a **cyclical growth** stock, not a steady compounder
- Why AMD's moat, valuation, and risk profile demand a different **position size** and plan
- How a weaker software moat (vs. NVIDIA) and heavy cyclicality change the **thesis**
- What KPIs and **invalidation triggers** actually matter for an AI-semiconductor bet
- How the same disciplined loop protects you when uncertainty is high

> If you haven't read it yet, start with the [Playbook](learning-playbook.html) — this page assumes its 10 steps.

---

## Step 0 · Meet the company

**AMD** designs CPUs and GPUs. It runs four segments and sits in two competitive fights at once:

| Segment | What it is | Competes with |
|---------|-----------|---------------|
| **Data Center** | Server CPUs (EPYC) + AI GPUs (Instinct MI300) | Intel (CPU), **NVIDIA** (AI GPU) |
| **Client** | Ryzen PC/laptop chips | Intel |
| **Gaming** | Console + Radeon graphics | NVIDIA, consoles |
| **Embedded** | FPGAs/adaptive chips (from the Xilinx deal) | Broad |

The whole thesis today rests on one thing: **Data Center**, where AI accelerators are the prize NVIDIA dominates. Assume our data pull returns these **rounded, illustrative** figures:

| Snapshot (illustrative) | Value |
|-------------------------|-------|
| Share price | ~$135 |
| Shares outstanding | ~1.62 B |
| Market cap | ~$220 B |
| Revenue (TTM) | ~$25 B |
| GAAP gross margin | ~50% |
| GAAP operating margin | ~5–7% (depressed by ~$3 B/yr Xilinx amortization) |
| Non-GAAP operating margin | ~20%+ |
| Net income (GAAP) | ~$1.6 B (EPS thin) |
| Free cash flow (FCF) | ~$3–4 B |
| Balance sheet | net cash (low debt) |
| Forward P/E | ~35–45× |

> **Key idea:** already this looks nothing like Apple. Thin GAAP earnings, a giant valuation on *future* profits, and a business whose fortunes swing with a semiconductor cycle. The process is the same; the dials will move a lot.

---

## Step 1 · Write the thesis first

> **Thesis:** *AMD is the credible #2 in AI data-center compute; if it takes even a modest slice of a fast-growing AI accelerator market while continuing to win server CPU share from Intel, Data Center revenue and margins expand enough to grow into — and past — today's rich valuation.*

The two-sided view — and the bear case here is *strong*, which is itself information:

| Bull case | Bear case |
|-----------|-----------|
| AI accelerator TAM is huge and growing; a #2 can win a lot | NVIDIA's **CUDA** software ecosystem is a deep moat; AMD's ROCm is behind |
| EPYC keeps taking server CPU share from Intel | Semis are **cyclical**; Client/Gaming can slump hard |
| Xilinx (Embedded) adds higher-margin, stickier revenue | Valuation already prices in AI success — little margin for error |
| Net-cash balance sheet funds R&D through cycles | Customer concentration; hyperscalers also build their own chips |

*In the plugin:* `stock-eval` gives the fast quality/value/growth read; `competitor-analysis` is essential here to grade the moat honestly against NVIDIA and Intel.

---

## Step 2 · The research plan

| Must be true | How to check | Lesson | Skill |
|--------------|--------------|--------|-------|
| Data Center is really inflecting | Segment revenue growth, MI300 ramp vs. guidance | [2](learning-statements.html) | `financial-report-analyst` |
| The AI-GPU moat gap is closing, not widening | ROCm adoption, design wins, gross-margin trend | [3](learning-quality.html) | `competitor-analysis` |
| Profits are turning into cash | FCF vs. GAAP net income; effect of amortization | [2](learning-statements.html) | `fundamental-analysis` |
| I can bound what it's worth | Scenario DCF + peer multiples (NVDA/INTC) | [4](learning-valuation.html) | `dcf-valuation`, `stock-valuation` |
| The setup isn't a crowded trap | Momentum, options IV, positioning, earnings dates | [5](learning-market.html) | `technical-analysis`, `options-analysis`, `catalyst-calendar` |
| It fits my risk budget | Small, staged sizing for a volatile name | [6](learning-portfolio.html) | `portfolio-review` |

---

## Step 3 · Is it a good business? (quality)

Run the [quality lens](learning-quality.html) — and grade honestly:

- **Returns on capital:** ROIC is **modest and below Apple's**, and depressed further by Xilinx-deal amortization. It clears WACC in good years but this is *not* a 50%-ROIC machine. Cyclical.
- **Margins:** ~50% GAAP gross margin is respectable and the *trend* (mix shift toward Data Center + Embedded) is the key tell — rising margin = the thesis working.
- **Moat — the crux:** x86 CPUs are a durable **duopoly** (real moat vs. Intel). But in AI GPUs, NVIDIA's **CUDA** software ecosystem is the moat, and it's wide. AMD's edge is price/performance and being the credible alternative — a **narrower, contested** moat than Apple's ecosystem lock-in.
- **Capital allocation:** R&D-first (correct for a technology race); buybacks are modest and partly offset stock-based comp rather than shrinking the count like Apple's.

**Verdict:** a good, improving business — but **more cyclical, lower-return, and narrower-moat** than the Apple case. Quality is a *pass with caveats*, not a slam dunk.

---

## Step 4 · Do the statements back it up?

[Statements lens](learning-statements.html). The headline subtlety: **GAAP earnings look tiny, but that's largely non-cash amortization** from the Xilinx acquisition. FCF (~$3–4 B) is far above GAAP net income (~$1.6 B) — so the business generates more cash than the income statement suggests.

- Watch **segment disclosure**: Data Center revenue and operating income are where the thesis lives; Client/Gaming can mask or flatter the total.
- Balance sheet is **net cash** — low financial risk, which matters for surviving a semi downturn.
- Red-flag check: is inventory building faster than sales (a classic semi-cycle warning)? In our snapshot, no — but it's the first thing to re-check each quarter.

> **Key idea:** for AMD, "read the statements" means *read the segments*, and separate **cash reality (FCF)** from **GAAP optics (amortization)**. Miss that and you'll think a cash-generative business is barely profitable.

---

## Step 5 · What's it worth? (valuation)

This is the hard part, because the value is dominated by **assumptions about the AI ramp**. Scenario DCF from FCF ≈ $3.5 B, WACC ≈ 10% (higher than Apple — more risk), terminal growth ≈ 3%, varying the Data-Center-led growth:

| Scenario | Rev/FCF growth (yr 1–10) | Implied fair value / share |
|----------|--------------------------|----------------------------|
| **Bear** (AI stalls, share war) | ~8% | ~$90 |
| **Base** (steady DC gains) | ~18% | ~$140 |
| **Bull** (AMD wins real AI share) | ~28% | ~$210 |

**Multiples cross-check:** forward P/E ~35–45× is high in absolute terms but *below* NVIDIA — the market prices AMD as the plausible #2. P/S and EV/EBITDA tell the same story: priced for growth.

**Put it together:**

- **Fair-value range:** a very wide **~$90–210**, base **~$140**.
- **Price today:** ~$135 — right around the base case.
- **Margin of safety:** thin, and the *range itself is enormous* — the honest read is "the outcome depends on execution I can't yet confirm."

> **Key idea:** a ±60% fair-value range isn't a failure of analysis — it's the truthful picture of a bet on an uncertain ramp. The correct response isn't false precision; it's a **smaller position and a scale-in plan** (Steps 7–8) that pays you to be patient.

---

## Step 6 · Read the market (timing & confirmation)

[Market lens](learning-market.html) — AMD is a high-beta, heavily-traded AI name, so sentiment matters:

- **Trend / momentum:** AI names trend hard in both directions; a price far above the 200-day average signals crowded optimism — don't chase spikes.
- **Options:** implied volatility is typically **high** around earnings (`options-analysis`) — the market expects big moves, and premium is expensive.
- **Positioning:** check institutional flows (`institutional-ownership`) and insider activity (`insider-trading`); heavy retail/momentum ownership can amplify drawdowns.
- **Catalysts:** quarterly earnings, MI300 revenue guidance, and hyperscaler order news are the needle-movers (`catalyst-calendar`, `earnings-call-analysis`). These create both the risk and the pullback you want to buy.

---

## Step 7 · Decide & size

Decision summary (same axes as the [signal block](concepts.html)):

| Field | Read | Why |
|-------|------|-----|
| **Signal** | Bullish (growth) | Real AI/server tailwind and share gains |
| **Confidence** | **Medium** | Cyclical, execution-dependent, moat contested |
| **Horizon** | Long-term (3–5 yr) | The AI ramp is a multi-year story |
| **Action** | **Buy a starter, scale in on weakness** | Near base fair value; huge outcome range |
| **Conviction** | Moderate | Wide range + narrower moat than a core holding |

**Position size — this is where AMD and Apple diverge most.** Because uncertainty and volatility are high, treat AMD like the *pre-profit growth* dial from the Playbook:

- Target size: **≤ 3%** of the portfolio (a satellite, not a core).
- Hard cap: **≤ 4%**, and never average down past the plan.
- Expect **±30–40% swings** and size so that a bad quarter can't force a panic sale.

*In the plugin:* run `result-validator` — for a name this execution-dependent, a low data-quality or signal-consistency score should shrink the position further.

---

## Step 8 · The trading plan

Wider bands than Apple, smaller size, written down in advance:

| Rule | Level | Logic |
|------|-------|-------|
| **Starter buy** | ≤ $130 | ~1% position; near/under base fair value |
| **Add #1** | ~$110 | +1%; ~20% below base FV |
| **Add #2** | ~$90 | +1% to full 3%; bear-case zone = deep margin of safety |
| **Trim** | > $200 | Approaching bull FV, or if position > 4% |
| **Time horizon** | 3–5 years | Multi-year AI/CPU-share thesis |
| **Hard price stop?** | None | Sell on broken thesis, not on volatility (see triggers) |

> **Key idea:** the ladder is *wider and smaller* than Apple's on purpose. High volatility means bigger pullbacks are normal, so you leave room to add — and you keep each tranche small enough that a wrong thesis costs you a scratch, not a scar.

### The trade ticket

```
2026-07-02 · AMD · BUY 15 sh @ $128 · thesis: DC/AI ramp + EPYC share · base FV $140 · size now 1.0%
```

---

## Step 9 · Track the thesis

**Review cadence:** every earnings report + on major AI/customer news.

**KPIs the thesis depends on:**

| Watch | Thesis stays intact if… |
|-------|-------------------------|
| Data Center revenue growth | Still accelerating YoY |
| MI300 / AI GPU revenue | Meeting or beating guidance |
| Gross-margin trend | Rising (mix shift working) |
| Server CPU share vs. Intel | EPYC share still climbing |
| Guidance & backlog | Management raising, not trimming |

**Thesis-invalidation triggers — sell/reassess if:**

- Data Center growth **decelerates sharply** or guidance is cut.
- The MI300/AI ramp **misses guidance** for two-plus quarters.
- Gross margin **stalls or falls** (pricing pressure from NVIDIA / mix reversing).
- NVIDIA **extends** its software lead and customers standardize on CUDA (moat gap widening, not closing).
- The original one-sentence thesis is no longer true.

### A monitoring journal entry (illustrative)

```
Q3 review · AMD
  Data Center +80% YoY ✓   MI300 rev above guide ✓   Gross margin 51% (↑) ✓
  EPYC server share +2pts vs Intel ✓
  Price $150 (above base FV) → no adds; hold starter + Add #1
  Thesis intact and strengthening. Next check: next earnings + MI300 guidance.
```

---

## Step 10 · The sell discipline

Same four reasons as the Playbook — for AMD, #1 (thesis broken) is the one to pre-commit hardest, because the AI narrative can turn fast:

1. **Thesis broke** — a trigger above fired (e.g., DC growth stalls, moat gap widens). Sell regardless of price.
2. **A better opportunity** — capital is finite; a satellite earns its slot.
3. **Extreme overvaluation** — price runs far past the bull case; trim.
4. **Risk management** — it grew past the 4% cap; trim to target.

> **Key idea:** for a hot AI name, the danger isn't buying — it's *falling in love* and letting a satellite bet balloon into a core position it never earned. The written cap and triggers are what save you from your own euphoria.

---

## AMD vs. Apple: same loop, different dials

| | Apple (Playbook) | AMD (this case) |
|---|-----------------|-----------------|
| Business | Mature compounder | Cyclical growth |
| Moat | Wide (ecosystem) | Mixed — CPU duopoly, contested AI-GPU |
| Quality | Very high ROIC | Modest, cyclical ROIC |
| Valuation range | Fairly tight | Very wide (±60%) |
| Decision | Wait for a better price | Small starter + scale in |
| Size | Core (~5%) | Satellite (≤3%) |
| Trading plan | Tighter ladder | Wider, smaller ladder |
| Sell trigger focus | Moat/services | DC ramp + margin trend |

> **The lesson:** the process never changed — thesis, plan, analysis, decision, trading plan, tracking. What changed was **how you turned the dials** for a riskier, less certain business. That's the whole point of having a process.

---

## Key takeaways

- The **same 10-step loop** works on a volatile AI-semi name as on a steady compounder — you just adjust size, bands, and triggers to the risk.
- For AMD, "quality" is a **pass with caveats**: real CPU duopoly, but a **contested** AI-GPU moat vs. NVIDIA's CUDA.
- Separate **cash (FCF) from GAAP optics** (Xilinx amortization) or you'll misjudge profitability.
- A **wide fair-value range** is honest — answer it with a **small position and a scale-in plan**, not false precision.
- Pre-commit the **invalidation triggers** (Data Center growth, MI300 ramp, margin trend) so a turning AI narrative can't make you rationalize.

---

> **Next / Related:** re-read [The Professional's Playbook](learning-playbook.html) for the loop, or [Valuation](learning-valuation.html) and [Portfolio & Risk](learning-portfolio.html) for the mechanics. Back to the [Learning Hub](learning.html). Then [Choose a Skill](choose-a-skill.html) to run this on AMD yourself, or watch a full multi-skill run in the [Demo](full-demo.html).

*Educational content only. Not financial advice. Company facts are real; all figures are illustrative and rounded for teaching — not current data.*
