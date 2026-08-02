# Trade Setup — Entry Suitability & Horizon-Aware Strategy

## ⚠️ Data Verification — Do This Before Any Analysis

Before running any analysis, always retrieve the latest market data for the ticker:

1. **Fetch current price** — use live quote tools or ask the user for the live price, 52-week range, and market cap. Never assume a price from training data.
2. **Confirm key figures** — recent revenue/EPS growth, PE/PB, and the TA stack below as applicable.
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
5. Entry suitability (hard gates → soft score)  
6. Strategy **or** explicit NO_TRADE — with **horizon recommended from the analysis** (`SWING` 波段 / `POSITION` 中長線 / `BOTH` / `NONE`)

---

## How This Differs From Neighbors

| Skill | Job |
|-------|-----|
| `technical-analysis` | Deep TA narrative (Ichimoku, Fib, MTF charts) |
| `stock-eval` / `fundamental-analysis` | Business quality & valuation depth |
| `position-ladder` | You already own it — rung / ceiling / trim cycle |
| **`trade-setup`** | Go / no-go **now**, with swing vs position recommendation |

---

## Phase 0 — Pull Live Inputs

Required:

- Last price, session date, average volume  
- Daily OHLCV (≥150 bars preferred; 250 ideal) and weekly (≥52 bars)  
- SMA 5/10/20/50/100/200, MACD(12,26,9), RSI(14), KDJ(9,3,3), Bollinger(20,2), ATR(14), ADX(14) with +DI/−DI  

Optional (skip without inventing):

- PE, PB, revenue YoY, EPS/profit YoY  
- Main-force / capital flow (often thin outside HK)  

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

Scan roughly the **last 5–20 daily bars** (not 150 days of cherry-picking).

Bullish examples: Hammer, Bullish Engulfing, Morning Star, Piercing, Three White Soldiers, Bullish Harami.  
Bearish examples: Shooting Star, Hanging Man, Bearish Engulfing, Evening Star, Dark Cloud, Three Black Crows, Bearish Harami.  
Neutral: Doji / Spinning Top (mention, low score weight).

**Do not** score classic chart patterns (H&S, triangles, double tops) inside the candlestick weight — if noted, label them as **structure / chart patterns**, separate from candle score.

If none: write `近期未出現明顯高勝率形態`.

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

## Phase 5 — Entry Suitability

### Hard gates (fail → NO_TRADE / 不宜進場 or 觀望)

1. **Liquidity data present** — must have usable volume history.  
2. **No STRONG_DOWN + aggressive long** — do not output a trend-long strategy in `STRONG_DOWN`. Mean-reversion bounce ideas may be discussed only as **watch**, not as a filled strategy block.  
3. **Minimum R/R to T1 ≥ 1.5** — if a provisional long plan cannot clear 1.5, force NO_TRADE.

### Soft score (−2…+2 per dimension, then weighted)

**Trending regimes** (`STRONG_*` / `WEAK_*`): emphasize MA, MACD, ADX; de-emphasize RSI/KDJ.  
**RANGE:** emphasize RSI, KDJ, Bollinger, candles; de-emphasize ADX.

Suggested weights (trending): MA 20%, MACD 15%, ADX 15%, RSI 8%, KDJ 7%, Boll 8%, Candle 12%, Fund 10%, Capital 5%.  
Suggested weights (range): MA 10%, MACD 10%, ADX 5%, RSI 15%, KDJ 12%, Boll 15%, Candle 15%, Fund 10%, Capital 8%.

If capital flow is missing, set its weight to 0 and redistribute to MA/MACD — **do not** punish the name for a missing HK-style flow feed.

**Entry label:**

| Soft score | Label |
|------------|-------|
| ≥ +0.8 and gates pass | 適合試倉 |
| +0.3 to +0.7 and gates pass | 輕倉試探 |
| −0.3 to +0.2 or weak gates | 觀望 |
| ≤ −0.3 or hard fail | 不宜進場 |

Map soft (−2…+2) to Score 0–10 for the signal block: `score_10 = clamp((soft+2)/4*10, 0, 10)`.

---

## Phase 6 — Strategy & Horizon Recommendation

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

- Batch 1 / Batch 2 prices or zones + % of planned size  
- Stop (structure or ~1.5×ATR below; never above entry for a long) — prefer the **tightest** valid stop below entry among 20D low / Bollinger lower / 1.5×ATR  
- T1 / T2 — size T1 so provisional R/R to T1 is at least **1.5** (floor also 1.5×ATR)  
- R/R to T1  
- Position-size hint from volatility (high vol → smaller size; vol does **not** veto alone)  
- Confirm / invalidate checklists  
- Tie tactics to horizon (`SWING` = tighter stop / faster T1; `POSITION` = wider structure stop / larger core share of size)

### If NO_TRADE

List why (gates / score / R/R) and **re-evaluate triggers** (e.g. weekly bias flips bullish, ADX≥20 with +DI>-DI, pullback candle at support, R/R improves to ≥1.5). No fake entry ticket.

---

## Output Template

```markdown
**[TICKER] [Name]** | Close **P** (YYYY-MM-DD) | Regime: **R** | Entry: **label** | Horizon: **SWING/POSITION/BOTH/NONE**

### 1. Fundamentals (lite)
...

### 2. Technical stack
...

### 3. Candlesticks (recent window)
...

### 4. Trend strength
...

### 5. Entry suitability
Hard gates table + soft score breakdown + label

### 6. Strategy & horizon
[plan or NO_TRADE + watch list]

### Thesis Invalidation
- Price level / event that voids the setup
- Re-run checklist
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


