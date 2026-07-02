# Use Cases & Journeys

> The [Cookbook](cookbook.html) shows individual skills and their output. This page shows *people with goals* chaining skills end-to-end — including a worked case where the analysis **changed the conclusion**, and the common ways analyses go wrong. Commands use Claude Code slash syntax; on other platforms, reference the matching `prompts/*.md` file instead.

**Journeys:** [Dividend investor](#the-dividend--income-investor) · [First-time investor](#the-first-time-investor) · [Earnings-season trader](#the-earnings-season-trader) · [Macro allocator](#the-macro--top-down-allocator) · [The skeptic](#the-skeptic--risk-manager) · [Worked case study](#worked-case-study-when-analysis-changes-the-answer) · [Anti-patterns](#anti-patterns-how-analyses-go-wrong)

---

## The Dividend / Income Investor

**Goal:** build a portfolio that pays reliable, growing income — without walking into a [yield trap](glossary.html#yield-trap).

```
/dividend-analysis JNJ      ← safety score, payout ratio, coverage, growth streak
/dividend-analysis KO
/dividend-analysis O
/portfolio-review           ← paste candidates; check concentration & blended yield
```

**What to look for:** [payout ratio](glossary.html#dividend-payout-ratio) under ~60%, [coverage](glossary.html#dividend-coverage-ratio) > 2x, positive [FCF](glossary.html#fcf-free-cash-flow), and a multi-year growth streak. A 9% yield with a 110% payout ratio is a *warning*, not a bargain — the market is pricing in a cut.

**Decision rule:** target a blended portfolio yield of ~3%+ with an average safety score above 7.5, and no single holding over ~10%.

---

## The First-Time Investor

**Goal:** "I have some cash and want to evaluate my first stock without pretending I'm a pro."

```
/stock-eval AAPL            ← one screen: quality, value, moat, risk
```

Then **don't just read the score — decode it.** Hit an unfamiliar term ([Piotroski F-Score](glossary.html#piotroski-f-score)? [ROIC](glossary.html#roic-return-on-invested-capital)?) → open the [Glossary](glossary.html). Want the intuition → [Concepts](concepts.html). Then sanity-check before trusting it:

```
/result-validator           ← paste the stock-eval output; get a confidence score
```

**Mindset:** the signal block is a *starting point*, not a verdict. A "BUY / MODERATE" with **LOW confidence** means "interesting, but the data is thin — learn more before acting." Start small, size positions you can afford to be wrong on, and read [margin of safety](concepts.html#margin-of-safety--position-sizing).

---

## The Earnings-Season Trader

**Goal:** have a plan *before* the call, react with discipline *after* it.

```
# Before earnings
/fundamental-analysis NVDA          ← baseline: what does "good" look like this quarter?
/options-analysis NVDA --earnings   ← what move is the market pricing in (IV)?

# After the call
/earnings-call-analysis NVDA        ← paste transcript: tone, guidance delta, hidden risks
/technical-analysis NVDA            ← did price confirm or fade the reaction?
```

**What to look for:** the gap between *guidance* and *expectations*, language shifts versus prior quarters, and whether realized volatility justified the [implied volatility](glossary.html#implied-volatility-iv) you paid for. The edge is in the *delta*, not the headline number.

---

## The Macro / Top-Down Allocator

**Goal:** position by reading the macro weather, then drill down to a name.

```
/economics-analysis                 ← regime: yield curve, Fed stance, leading indicators
/sector-analysis                    ← which sectors lead in this regime? relative strength
/stock-eval JPM                     ← best-in-class name within the favored sector
/portfolio-review                   ← does adding it reduce or add rate sensitivity?
```

**What to look for:** the [macro regime](concepts.html#macro-regimes) sets the tilt — rising rates favor financials and value; easing favors growth and rate-sensitive yield. Pick the sector *then* the stock, and check the portfolio-level effect before you add risk.

---

## The Skeptic / Risk Manager

**Goal:** actively hunt for reasons *not* to buy — the most underrated discipline in investing.

```
/financial-report-analyst TSLA 10-K   ← accounting red flags, one-offs, footnote risks
/insider-trading TSLA                  ← are insiders selling into strength?
/short-interest TSLA                   ← is smart money positioned against it?
/result-validator                      ← does the bull case survive scrutiny?
```

**What to look for:** disagreement between signals. Bullish fundamentals + heavy insider selling + rising short interest is a contradiction worth resolving *before* you commit. The goal isn't to be negative — it's to make the bull case earn it.

---

## Worked Case Study: When Analysis Changes the Answer

A short, illustrative walkthrough (hypothetical ticker **"XYZ"**) showing how a thesis should *evolve* as evidence accumulates — not lock in at step one.

| Step | Skill | Finding | Running signal |
|------|-------|---------|----------------|
| 1 | `stock-eval` | High ROIC, clean Piotroski 8/9, reasonable P/E | **BULLISH** · MED conf |
| 2 | `stock-valuation` | DCF + comps say ~15% undervalued | **BULLISH** · stronger |
| 3 | `financial-report-analyst` | 10-K reveals revenue increasingly from one customer + a large receivable build | Confidence **drops** |
| 4 | `insider-trading` | Two officers sold large blocks last month | Signal weakens to **NEUTRAL** |
| 5 | `result-validator` | Flags the customer-concentration + insider conflict; confidence **LOW** | **HOLD**, not BUY |

**Lesson:** steps 1–2 looked like a clean buy. The *judgment* came from steps 3–5, where the filing and insider data introduced risks the headline metrics hid. The final call — **HOLD pending the next 10-Q** — is the *output of the disagreement*, exactly what a composite [signal block](concepts.html#anatomy-of-the-signal-block) is designed to surface. A high score with low confidence is a "look closer," not a "go."

---

## Anti-Patterns: How Analyses Go Wrong

| Anti-pattern | Why it bites | The fix |
|--------------|--------------|---------|
| **Trusting a single DCF point estimate** | Tiny WACC/terminal-growth changes swing it wildly | Read the **bear/base/bull range** and sensitivity table, not the single number |
| **Ignoring the Confidence field** | A bullish *score* with LOW confidence is a guess | Treat low confidence as "gather more data," not "go" |
| **Using stale or guessed data** | The AI reasons over whatever you give it | Paste current, primary-source financials; see [Data & Accuracy](data-and-accuracy.html) |
| **Mistaking a yield trap for income** | A 10% yield often signals a coming cut | Check [payout ratio](glossary.html#dividend-payout-ratio) and FCF, not just yield |
| **Anchoring on one signal block** | One skill sees one slice | Run `research-bundle` / cross-check with `result-validator` |
| **Confusing confidence with conviction** | They're different axes | See the [signal-block anatomy](concepts.html#anatomy-of-the-signal-block) |
| **Skipping validation on composites** | Disagreeing sub-signals get averaged away | Always `result-validator` a `full-report` / `research-bundle` |

---

> **Next:** [Choose a Skill](choose-a-skill.html) to build your own chain · [Concepts](concepts.html) for the reasoning · [Data & Accuracy](data-and-accuracy.html) before you act.

*Educational content only. Not financial advice. Tickers used illustratively, not as recommendations.*
