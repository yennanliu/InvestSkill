---
description: End-to-end trade setup from a ticker — fundamentals lite, fixed TA stack, candlesticks, trend-strength regime, capital-flow review, entry gates, and a strategy that recommends SWING vs POSITION (中長線) from the analysis itself
---
# Trade Setup — Entry Suitability & Horizon-Aware Strategy

## ⚠️ Data Verification — Do This Before Any Analysis

Before running any analysis, always retrieve the latest market data for the ticker:

1. **Fetch current price** — use live quote tools or ask the user for the live price, 52-week range, and market cap. Never assume a price from training data.
2. **Confirm key figures** — recent revenue/EPS growth, PE/PB, the TA stack below, and capital-flow / main-force data when the feed provides it.
3. **State your data source** — note where the numbers came from (e.g., "Longbridge / Yahoo Finance, 2026-07-30") at the top of the output.
4. **Flag stale data explicitly** — if live data is unavailable, display this warning before proceeding:

> ⚠️ **Live data unavailable.** The following analysis uses training-data estimates which may be significantly out of date. Verify all prices and metrics before making any decisions.

Never silently substitute training-data estimates for current prices. When in doubt, ask the user to paste the latest quote and OHLCV.

---

## Overview

Answer: **"Given this ticker now, is there a trade — and should it be a swing or a medium/long-term position?"**

This framework is the **execution gate** between research (`stock-eval`, `fundamental-analysis`, `technical-analysis`) and position management (`position-ladder`). It is **not** a full 10-K, not a portfolio allocator, and not an options picker.

**Input:** ticker only (optional: risk preference). Do **not** ask the user to hand-fill MA/RSI/flow tables.

**Output (always, in order):**

1. Fundamentals lite  
2. Fixed technical indicator stack  
3. Candlestick pattern recognition (recent window only)  
4. Trend-strength regime  
5. **Capital-flow review** (main-force vs price — modes A/B/C/D; state 缺數 if unavailable)  
6. Entry suitability (hard gates → soft score)  
7. Strategy **or** explicit NO_TRADE — with **horizon recommended from the analysis** (`SWING` 波段 / `POSITION` 中長線 / `BOTH` / `NONE`)

---

## How This Differs From Neighbors

| Skill | Job |
|-------|-----|
| `technical-analysis` | Deep TA narrative (Ichimoku, Fib, MTF charts) |
| `stock-eval` / `fundamental-analysis` | Business quality & valuation depth |
| `position-ladder` | You already own it — rung / ceiling / trim cycle |
| **`trade-setup`** | Go / no-go **now**, with capital-flow review + swing vs position recommendation |

---

## Phase 0 — Pull Live Inputs

Required:

- Last price, session date, average volume  
- Daily OHLCV (≥150 bars preferred; 250 ideal) and weekly (≥52 bars)  
- SMA 5/10/20/50/100/200, MACD(12,26,9), RSI(14), KDJ(9,3,3), Bollinger(20,2), ATR(14), ADX(14) with +DI/−DI  

Required to *attempt* (may still be 缺數 — never invent):

- PE, PB, revenue YoY, EPS/profit YoY when available — prefer `financial-report --latest` (`operating_revenue.yoy` / `eps.yoy`; decimals like `0.36` = 36%). An empty `financial-statement` does **not** mean growth is missing.  
- **Capital flow** — order-size distribution (super/large/medium/small) and/or main-force net inflow; prefer a live broker feed (e.g. Longbridge `capital` + `capital --flow`). For `--flow`, use the **last** series point, never the sum. Coverage is often richer for HK; US may be thin.

If a field is missing, write **缺數** and continue; never fabricate.

---

## Phase 1 — Fundamentals Lite

Keep this short (not a full `fundamental-analysis` pass):

- 2–4 sentence business snapshot  
- Table: PE / PB / revenue YoY / EPS YoY when available  
- Soft score contribution only (see weights). Growth collapse (e.g. revenue YoY ≪ 0) can **soft-penalize** but is not a sole hard veto unless solvency is clearly broken (state assumption).

---

## Phase 2 — Fixed Technical Stack

Compute and report:

| Block | Rules of thumb |
|-------|----------------|
| MA stack | Full bull stack (price>MA5>…>MA200) = strong trend; price<MA5<MA10<MA20 = short bear stack; else mixed |
| MACD | Zero-line context + hist expanding/contracting |
| RSI(14) | Interpret **through regime** (below) — do not blindly fade RSI>70 in a strong uptrend |
| KDJ | Extreme J / low-zone gold cross matter more in RANGE; less in STRONG_UP |
| Bollinger | Midline side + upper/lower tag; bandwidth narrow = compression |
| ATR% | ATR14/price×100 — used for stops and **position size**, not as a veto |

---

## Phase 3 — Candlestick Patterns (Recent Window Only)

Scan strictly the **last ~20 daily bars** (the scoring script hard-filters by bar index — stale patterns from months ago must never reach the report or score).

Bullish examples: Hammer, Bullish Engulfing, Morning Star, Piercing, Three White Soldiers, Bullish Harami.  
Bearish examples: Shooting Star, Hanging Man, Bearish Engulfing, Evening Star, Dark Cloud, Three Black Crows, Bearish Harami.  
Neutral: Doji / Spinning Top (mention, low score weight).

**Volume:** patterns tagged 縮量 / light volume get **half weight** in the candle soft score; strategy confirm language should prefer 放量 before adding size.

**Volume trend (separate `volume` soft dimension):** up-day vs down-day volume over the last 20 bars (`updown_vol_ratio20`; ≥1.3 = accumulation lean, ≤0.75 = distribution lean) and last-bar volume vs 20D average (`vol_vs_avg20`; ≥1.3× on an up close adds, on a down close subtracts).

If none: write `近期（20根K內）未出現明顯高勝率形態`.

### Phase 3b — Chart Structures (separate soft dimension)

Computed by `detect_chart_patterns` on ~120 daily bars (pivot highs/lows). **Never merge into the candle weight.**

| Pattern | Notes |
|---------|--------|
| Double Top / Double Bottom | Twin peaks/troughs + neckline; confirmed on break |
| Head & Shoulders / Inverse | 3 pivots + neckline; confirmed on break |
| Ascending / Descending / Symmetrical Triangle | Converging pivot slopes; confirmed on breakout |
| Bull / Bear Flag | Sharp pole + tight consolidation; confirmed on breakout |

Report `chart_patterns_recent` with `status` (`forming`/`confirmed`) and `neckline` when present. Soft dimension `structure` (~5–6% weight): prefer confirmed; forming is half-weighted in the script. If empty: `未偵測到圖形結構`.

---

## Phase 4 — Trend Strength Regime

Map to exactly one regime:

| Regime | Guide |
|--------|--------|
| `STRONG_UP` | ADX≥25, +DI>-DI, MA bias bullish |
| `WEAK_UP` | ADX≥20, +DI>-DI, or softer bull stack |
| `RANGE` | ADX soft / mixed MAs |
| `WEAK_DOWN` | ADX≥20, -DI>+DI |
| `STRONG_DOWN` | ADX≥25, -DI>+DI, MA bearish |

Cross-check weekly MA bias: if weekly clearly contradicts daily, soften toward `RANGE` or the weaker directional label. State ADX, +DI, -DI, and weekly note explicitly.

---

## Phase 5 — Capital-Flow Review（資金流）

**Always produce this section** in two layers: **5a Longbridge (primary)** + **5b Futu anomaly (optional supplement)**.

### 5a. Longbridge / primary feed（驅動模式與 soft score）

Prefer live capital / main-force data (`capital` snapshot + `capital --flow` when available). If unavailable, write `資金流缺數` and set the capital soft-weight to 0 (do **not** punish the name for a missing feed).

What to report:

1. **Main-force net** — prefer 超大單+大單（或 feed 的主力淨額）；label unit as `萬` / `報價幣原值` (infer vs day turnover) and report `|淨額|/成交額`. If the unit stays ambiguous, present **both readings side by side** (raw-currency vs 萬) — never print a bare `未知`  
2. **Distribution skew** — super / large / medium / small in vs out when the snapshot provides it  
2b. **History trend** — keep a rolling per-symbol capital history (last ~10 runs) and report the 3–5 day main-net direction (improving / distributing / mixed). On the first record, state that the mode reflects a **single-day snapshot** only  
3. **Price vs flow mode** (required label):

| Mode | Condition | Read |
|------|-----------|------|
| **A** | Price up + main inflow | Healthy advance — follow bias |
| **B** | Price up + main outflow | Distribution risk — caution on chase |
| **C** | Price down + main inflow | Accumulation on weakness |
| **D** | Price down + main outflow | Capitulation / avoid fresh longs |
| **IN / OUT / FLAT** | Flow clear but price flat / mixed | State neutrally |

4. **Anomaly note** (optional) — e.g. \|main net\| ≳ 10% of day turnover → call out as 顯著異動  
5. **One-line action implication** — 跟進 / 警惕出貨 / 吸籌 / 迴避  

Modes **B** and **D** must appear as a **資金面警告** in Phase 6–7 even if the TA soft score is constructive. Capital flow alone is not a hard veto when data is missing; when data *exists* and shows B/D, tighten conviction and size language.

### 5b. Futu capital anomaly（附加，可跳過）

If a Futu OpenD / `futu-capital-anomaly` path is available, pull a **~7-day** capital anomaly check (funds distribution / funds flow / brokers as available) and append under 5b:

- 資金分佈與買賣經紀商：異常內容或「無異常」  
- 資金流向：異常內容或「無異常」  
- If OpenD unavailable, no permission, or script fails → write `Futu 異動：跳過（原因）` and continue — **do not invent**

**Hard rule:** Futu must **not** rewrite the Longbridge A/B/C/D mode or the capital soft score. When `lb_futu_conflict.conflict=true` (directional clash, e.g. LB mode A/C but Futu shows 特大單淨流出), auto-**soften** conviction / position-size language only — never flip the mode. Report must flag **資金面分歧**. Futu「大小單分歧」alone (large in / small out) is a note, not an automatic LB↔Futu conflict when directions align.

---

## Phase 6 — Entry Suitability

### Hard gates (fail → NO_TRADE / 不宜進場 or 觀望)

1. **Liquidity data present** — must have usable volume history.  
2. **No STRONG_DOWN + aggressive long** — do not output a trend-long strategy in `STRONG_DOWN`. Mean-reversion bounce ideas may be discussed only as **watch**, not as a filled strategy block.  
3. **Minimum R/R to T1 ≥ 1.5** — if a provisional long plan cannot clear 1.5, force NO_TRADE.

### Soft score (−2…+2 per dimension, then weighted)

**Trending regimes** (`STRONG_*` / `WEAK_*`): emphasize MA, MACD, ADX; de-emphasize RSI/KDJ.  
**RANGE:** emphasize RSI, KDJ, Bollinger, candles; de-emphasize ADX.

Suggested weights (trending): MA 16%, MACD 14%, ADX 14%, RSI 8%, KDJ 6%, Boll 8%, Candle 9%, Structure 5%, Volume 6%, Fund 9%, Capital 5%.  
Suggested weights (range): MA 10%, MACD 9%, ADX 5%, RSI 13%, KDJ 10%, Boll 13%, Candle 11%, Structure 6%, Volume 6%, Fund 9%, Capital 8%.

**Contribution breakdown (required):** report each dimension's contribution (= score × weight) and call out the **top 3 positive** and **top 3 negative** drivers in one line each, so the reader sees exactly what pushed the final score.

Capital soft scores (guide): mode A ≈ +1.5, C ≈ +1.2, IN ≈ +0.8, FLAT ≈ 0, OUT ≈ −0.8, B/D ≈ −1.5.

If capital flow is missing, set its weight to 0 and redistribute to MA/MACD — **do not** punish the name for a missing flow feed. Still keep Phase 5 in the report as `缺數`.

**Entry label:**

| Soft score | Label |
|------------|-------|
| ≥ +0.8 and gates pass | 適合試倉 |
| +0.3 to +0.7 and gates pass | 輕倉試探 |
| −0.3 to +0.2 or weak gates | 觀望 |
| ≤ −0.3 or hard fail | 不宜進場 |

Map soft (−2…+2) to Score 0–10 for the signal block: `score_10 = clamp((soft+2)/4*10, 0, 10)`.

---

## Phase 7 — Strategy & Horizon Recommendation

### Horizon is **derived**, not assumed

Score swing vs position cues, then pick `primary`:

| Cue | Favors |
|-----|--------|
| Daily ADX usable + ATR% elevated + RANGE or short-momentum setup | **SWING** 波段（數日–數週） |
| Price > SMA200 + weekly bullish bias + weekly ADX supportive + non-collapsing fundamentals | **POSITION** 中長線（數週–數月） |
| Both stacks fire | **BOTH** — swing starter size, add to core if weekly confirms |
| Gates fail / soft < +0.3 | **NONE** |

State the winning label and 2–4 bullet reasons. Do **not** ask the user to pre-commit to a horizon before the analysis.

### If TRADE

Output:

- Entry batches whose **% always sum to 100%**: `SWING` → 40/60; `POSITION` / `BOTH` → 30/40/30 (third batch for deeper pullback / weekly confirm)  
- Stop (structure or ~1.5×ATR below; never above entry for a long) — prefer the **tightest** valid stop below entry among 20D low / Bollinger lower / 1.5×ATR  
- T1 / T2 — size T1 so provisional R/R to T1 is at least **1.5** (floor also 1.5×ATR)  
- R/R to T1  
- Position-size hint from volatility (high vol → smaller size; vol does **not** veto alone); further reduce one tier if LB/Futu capital conflict  
- Confirm / invalidate checklists — include capital-flow conditions (e.g. confirm: not stuck in mode B/D; invalidate: sustained heavy main outflow); prefer 放量 before adding  
- Tie tactics to horizon (`SWING` = tighter stop / faster T1; `POSITION` = wider structure stop / larger core share of size)

### If NO_TRADE

List why (gates / score / R/R) and **re-evaluate triggers with concrete price levels from this run's data** (e.g. "reclaim SMA20 ≈ 82.50", "hold the 20D low ≈ 74.10 with a volume bullish candle", "ADX from 17.8 up through 20 with +DI>-DI") — never abstract boilerplate. No fake entry ticket.

### Key levels & chart (both TRADE and NO_TRADE)

- **Key levels table**: top ~3 support and ~3 resistance clusters with price, **distance % from close**, and what composes each cluster (MAs / BB / 20D high-low / 52W levels).
- **Chart**: when tooling allows, render a daily-candle chart (last ~120 bars) with SMA20/50/200, support/resistance lines, pattern necklines, and entry/stop/T1/T2 marks, and embed it in the report.

### Confidence (derived, not vibes)

Signal-block Confidence is derived from: data completeness (capital / fundamentals / supplemental feed present?), |soft score| magnitude, LB↔Futu conflict, and hard-gate status. Missing feeds or a flow conflict cap it at MEDIUM/LOW; state the reason (e.g. `LOW — capital flow missing + |soft| < 0.5`).

---

## Output Template

```markdown
**[TICKER] [Name]** | Close **P** (YYYY-MM-DD) | Regime: **R** | Entry: **label** | Horizon: **SWING/POSITION/BOTH/NONE** | Flow: **A/B/C/D or 缺數**

### 1. Fundamentals (lite)
...

### 2. Technical stack
...

### 3. Candlesticks (recent window)
...

### 3b. Chart structures
`chart_patterns_recent` — H&S / double top-bottom / triangle / flag with forming|confirmed + neckline; separate `structure` soft dimension (never fold into candle)

### 4. Trend strength
...

### 5. Capital-flow review
**5a** Longbridge: main-force net + **unit** (dual reading if ambiguous) + `|淨|/成交額` + distribution + mode A/B/C/D + **history trend** + anomaly + one-line read (or 缺數)  
**5b** Futu anomaly (optional): ~7d 資金分佈／流向／經紀商 — 異常或無異常或跳過；不得改寫 5a 模式分；衝突則標資金面分歧並降 conviction／倉位

### 6. Entry suitability
Hard gates table + **contribution breakdown** (all dims incl. capital + structure + volume, score × weight) + top positive/negative drivers + label + 資金面警告 if B/D or LB/Futu conflict

### 6b. Key levels
Supports/resistances with distance % + composition; chart embed when available

### 7. Strategy & horizon
[plan with batches summing to 100%, or NO_TRADE + watch list with concrete price levels; capital confirm/invalidate]

### Thesis Invalidation
- Price level / event that voids the setup
- Capital-flow flip (e.g. into sustained mode D)
- Re-run checklist

### Legend (always append)
Flow modes A/B/C/D one-liner · soft-score → score_10 mapping · entry-label thresholds · forming vs confirmed
```

Always end with:

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

Horizon field mapping: SWING→SHORT, POSITION→LONG-TERM, BOTH→MEDIUM, NONE→SHORT (with Action HOLD).

Score Guide: 8.0–10.0 Strongly Bullish | 6.0–7.9 Moderately Bullish | 4.0–5.9 Neutral | 2.0–3.9 Moderately Bearish | 0.0–1.9 Strongly Bearish  
Confidence: HIGH (gates clear, |soft| large) | MEDIUM | LOW (missing data or conflict)  
Horizon: SHORT-TERM (swing days–weeks) | MEDIUM-TERM (both / bridge) | LONG-TERM (position weeks–months)

---

## Disclaimer

Educational only — not investment advice. Technical and fundamental screens have inherent limits; past patterns do not guarantee future results.
