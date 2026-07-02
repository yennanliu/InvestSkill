# Portfolio & Risk

> This lesson pulls everything together. You'll learn why a portfolio is more than a pile of stocks, the different kinds of risk you can and can't diversify away, how to size positions and rebalance, how to judge return against the risk you took, and how to build a repeatable process that keeps emotion out of the driver's seat.

**What you'll learn**

- Why diversification tames company-specific risk but never erases market risk
- The main types of risk — and which InvestSkill skill flags each one
- How asset allocation and correlation smooth the ride toward your goals
- Position sizing, concentration limits, and rebalancing as mechanical discipline
- How to measure *risk-adjusted* return: volatility, drawdown, Sharpe, alpha vs. beta
- Why dollar-cost averaging tames timing risk — and the behavioral traps to disarm
- A simple pre-trade checklist and how the signal block supports the final decision

---

## A portfolio is not a pile of stocks

Owning ten stocks is not the same as owning a portfolio. A **portfolio** is a deliberately assembled set of holdings whose *combined* behavior matters more than any single name. The magic — and the limit — is **diversification**: spreading money across investments so that one blow-up can't ruin you.

Here's the key distinction. Total risk has two parts:

- **Idiosyncratic risk** (company-specific) — a failed product, an accounting scandal, a factory fire. This is *diversifiable*. Own enough unrelated businesses and one company's disaster is a small dent, not a catastrophe.
- **Market risk** (systematic) — recessions, interest-rate shocks, wars, pandemics. This hits almost everything at once and *cannot* be diversified away. A well-diversified portfolio can still fall hard in a downturn.

> **Key idea:** Diversification removes the risk you aren't paid to take (company-specific), leaving the risk you are paid to take (market). It smooths the ride; it does not make you crash-proof.

The practical lesson: don't expect diversification to protect you in a broad bear market — that's what cash, bonds, and a long time horizon are for.

---

## The types of risk (recap)

Different risks need different defenses. Here's a working map, and which skill helps surface each.

| Risk type | What it is | Main defense | Skill that flags it |
|---|---|---|---|
| **Market / systematic** | Whole-market moves (recessions, rate shocks) | Asset allocation, time horizon, cash buffer | `economics-analysis`, `portfolio-review` |
| **Idiosyncratic** | One company's specific trouble | Diversify across unrelated names | `portfolio-review`, `fundamental-analysis` |
| **Liquidity** | Can't sell quickly without moving the price | Favor liquid names; size illiquid ones small | `technical-analysis` (volume), `portfolio-review` |
| **Concentration** | Too much in one name, sector, or theme | Position caps, sector limits | `portfolio-review` |
| **Interest-rate sensitivity** | Value falls when rates rise (bonds, long-duration growth) | Mix durations; balance rate-sensitive holdings | `economics-analysis` |

*Duration = how sensitive a bond's (or a long-dated growth stock's) price is to changes in interest rates.*

---

## Asset allocation

**Asset allocation** is how you split money across broad asset classes — mainly **stocks** (growth, higher risk), **bonds** (income, steadier), and **cash** (safety, dry powder). It is the single biggest driver of how bumpy your journey feels, and it flows from two things: your **goal** and your **time horizon** (how long until you need the money).

| Time horizon | Typical tilt | Why |
|---|---|---|
| Short (0–3 yrs) | Mostly cash / short bonds | No time to recover from a drop |
| Medium (3–10 yrs) | Balanced stocks + bonds | Growth with a cushion |
| Long (10+ yrs) | Mostly stocks | Time smooths volatility; growth compounds |

### Correlation: the reason to mix

**Correlation** measures whether two assets move together. It runs from **+1** (move in lockstep) through **0** (unrelated) to **−1** (move opposite). Combining assets with *low or negative* correlation is what smooths a portfolio: when one zigs, the other zags, so the combined path is calmer than either alone.

> **Key idea:** Diversification's power comes from *low correlation*, not from the sheer number of holdings. Ten tech stocks that all move together are barely more diversified than one.

---

## Position sizing and concentration limits

How much you put in each holding should be driven by **conviction and risk**, not by excitement. A stock you're thrilled about is not automatically one you should bet the farm on.

A common discipline is a **concentration cap** — a maximum weight for any single name (often **5–10%**). The point is survivability: if one thesis is dead wrong, the cap ensures it dents you rather than ruins you.

> **Key idea:** Size positions so that being wrong is survivable. The first job of position sizing isn't to maximize the upside — it's to guarantee you're still in the game after a mistake.

### A small illustration (illustrative, rounded)

Say you cap any single stock at **8%** of a **$100,000** portfolio — a max of **$8,000** per name. One holding falls **50%**:

| | Uncapped bet | Capped at 8% |
|---|---|---|
| Amount in the name | $30,000 | $8,000 |
| Loss on a 50% drop | −$15,000 | −$4,000 |
| Hit to total portfolio | −15% | −4% |

Same bad outcome for the company; a very different outcome for you. The cap turned a portfolio-defining loss into an annoyance.

*In the plugin:* the `portfolio-review` skill checks allocation, concentration, and risk across your holdings and flags any name or sector that's carrying too much weight.

---

## Rebalancing

Over time, winners grow into a bigger slice of your portfolio and laggards shrink — so your allocation drifts away from your targets, often into more risk than you intended. **Rebalancing** is the periodic act of trimming what's grown too big and topping up what's shrunk, back to your target weights.

Its quiet superpower: it enforces **"buy low, sell high" mechanically**, without you having to feel brave. You sell a little of what's expensive (the winners) and buy a little of what's cheap (the laggards) — the opposite of what emotion wants you to do.

A simple rule of thumb: rebalance on a schedule (e.g. once or twice a year) *or* when a holding drifts more than a set threshold (e.g. 5 percentage points) from target — whichever comes first.

---

## Risk-adjusted return

A 20% return earned by white-knuckle gambling is not as good as a 20% return earned calmly. **Risk-adjusted return** asks: *how much return did you get for the risk you took?*

| Measure | Plain-English meaning |
|---|---|
| **Volatility** | How much returns bounce around (standard deviation). Higher = a wilder ride. |
| **Maximum drawdown** | The worst peak-to-trough fall. Answers "how bad did it get?" — and tests whether you'd have held on. |
| **Sharpe ratio** | Return earned per unit of risk: `Sharpe = (return − risk-free rate) ÷ volatility`. Higher is better. |

*Risk-free rate = what you'd earn with no risk, usually short-term government bonds.*

### Alpha vs. beta

- **Beta** measures how much a holding moves relative to the market. Beta of 1 moves with the market; 1.5 amplifies it; 0.5 dampens it. Beta is the return you get simply for *riding* the market.
- **Alpha** is the return *above* what beta alone would explain — the value added (or destroyed) by the specific picks. Positive alpha means you beat the market for the risk you took.

> **Key idea:** Beating the market by simply taking more risk (high beta) is not skill. Real edge shows up as **alpha** — returns you earned *beyond* what the risk you took would predict.

---

## Dollar-cost averaging

**Dollar-cost averaging (DCA)** means investing a fixed amount on a regular schedule — say $500 every month — regardless of price. When prices are high, your fixed sum buys fewer shares; when they're low, it buys more. Over time your average cost is smoothed, and you sidestep the impossible game of timing the market.

DCA's real gift is behavioral: it turns investing into a boring, automatic habit, which starves the two emotions that wreck returns — the fear that stops you buying in downturns and the greed that piles in at tops.

> **Key idea:** DCA doesn't maximize returns in every scenario; it minimizes *regret and timing risk*. A steady habit you actually stick to beats a brilliant plan you abandon in a panic.

---

## Behavioral pitfalls (and their antidotes)

Most investing damage is self-inflicted. Naming the trap is the first step to disarming it.

| Pitfall | What it does | One-line antidote |
|---|---|---|
| **Loss aversion** | Losses hurt ~2× more than equal gains feel good, so you hold losers too long | Judge each holding on its future, not your purchase price |
| **Recency bias** | You assume the recent trend continues forever | Zoom out to long-run history and full cycles |
| **Herding** | You follow the crowd into (or out of) whatever's popular | Write your thesis *before* checking what others think |
| **Anchoring** | You fixate on an irrelevant number (like what you paid) | Re-underwrite from today's facts, ignoring old anchors |
| **Confirmation bias** | You seek only evidence that you're right | Actively hunt for the strongest bear case |
| **Overconfidence** | You overrate your own accuracy and bet too big | Size positions modestly; keep a decision journal |

---

## Building a repeatable process

The antidote to emotion is a **process** — a checklist you run every time, so decisions are consistent and reviewable rather than moods.

### A simple pre-trade checklist

1. **Thesis** — In one or two sentences, why will this make money?
2. **Quality** — Is the underlying business good? (returns on capital, moat, balance sheet — see [Judging Business Quality](learning-quality.html))
3. **Valuation / margin of safety** — Is the price sensible versus intrinsic value, with room for error? (see [Valuation Essentials](learning-valuation.html))
4. **Position size** — How much, given conviction and the concentration cap?
5. **What would prove me wrong** — Name the **thesis-invalidation triggers** up front: the specific facts (a metric breaks, a moat cracks, guidance is cut) that mean you exit, no matter how you feel at the time.

Then **review periodically** — revisit each holding on a schedule to check the thesis still holds, not just the price chart.

> **Key idea:** Deciding your exit conditions *before* you buy — while you're calm and objective — is the single most powerful defense against selling in panic or clinging in denial.

---

## How the signal block supports the decision

Every InvestSkill analysis ends in a standardized **signal block** that turns the work into a decision. It reports **direction** (bullish / neutral / bearish), **confidence** (how strong the evidence is), **horizon** (over what time frame), **action** (what to consider doing), and **conviction** (how much the analysis backs it). For the full anatomy, see [Concepts](concepts.html), "Anatomy of the signal block."

Use it as an *input*, not an oracle. A single skill sees one slice of the picture; when several analyses feed a composite view, always sanity-check them against each other and against your own checklist.

*In the plugin:* `stock-screener` ranks a list of candidates so you start from the most promising; `result-validator` scores confidence and consistency across data quality, method, and signals before you act; and `portfolio-review` checks how a new position fits your overall allocation, concentration, and risk.

---

## Key takeaways

- Diversification removes company-specific risk but never market risk — a diversified portfolio can still fall in a downturn.
- Its power comes from *low correlation* and sound asset allocation, matched to your goal and time horizon, not the sheer count of holdings.
- Size positions by conviction and risk, cap any single name so a bad thesis can't sink you, and rebalance to enforce buy-low/sell-high mechanically.
- Judge return *against the risk taken* — Sharpe, drawdown, and alpha (skill) versus beta (just riding the market).
- DCA and a written pre-trade checklist with thesis-invalidation triggers tame timing risk and behavioral traps.
- Use the signal block as a decision input and sanity-check composites with `result-validator` and `portfolio-review`.

---

> **Next / Related:** Previous lesson — [Reading the Market](learning-market.html). Next, see it all come together in the capstone: [**The Professional's Playbook**](learning-playbook.html) runs this whole process on a real stock. Or head back to the [Learning hub](learning.html), then [Choose a Skill](choose-a-skill.html) to put it to work. See also [Concepts](concepts.html) and the [Glossary](glossary.html).

*Educational content only. Not financial advice.*
