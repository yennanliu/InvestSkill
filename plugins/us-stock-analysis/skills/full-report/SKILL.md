---
description: Run InvestSkill analysis modules on a stock at configurable depth and compile a professional HTML report saved to the output/ directory
---

# Full Report — Comprehensive Stock Analysis Orchestrator

Orchestrate InvestSkill analysis modules on one ticker at your chosen depth, synthesize findings into a unified investment thesis with composite scoring, and produce a standalone professional HTML report with interactive Chart.js visualizations.

## Depth Flags

Select how many modules to run with `--depth`:

| Flag | Modules | Best For |
|------|---------|----------|
| `--depth quick` | 5 core modules | Rapid screen, time-constrained due diligence |
| `--depth standard` | 10 modules | Balanced research before initiating a position |
| `--depth comprehensive` | All 15 modules | Full pre-commitment due diligence (default) |

---

## Module Sets by Depth

### Quick (5 modules)

| # | Module | Focus |
|---|--------|-------|
| 1 | `stock-eval` | Company overview, competitive position, relative valuation |
| 2 | `technical-analysis` | MA, RSI, MACD, volume, support/resistance |
| 3 | `dcf-valuation` | DCF intrinsic value, bear/base/bull scenarios |
| 4 | `insider-trading` | SEC Form 4 patterns, net insider sentiment |
| 5 | `earnings-call-analysis` | Management tone, guidance quality, key themes |

### Standard (10 modules — Quick + 5 more)

| # | Module | Focus |
|---|--------|-------|
| 6 | `institutional-ownership` | 13F holdings, smart money flows |
| 7 | `competitor-analysis` | Moat, market share, Porter's Five Forces |
| 8 | `sector-analysis` | Sector rotation, relative strength |
| 9 | `options-analysis` | IV, Put/Call ratio, max pain, strategies |
| 10 | `short-interest` | Short ratio, squeeze risk, days-to-cover |

### Comprehensive (15 modules — Standard + 5 more)

| # | Module | Focus |
|---|--------|-------|
| 11 | `fundamental-analysis` | Income statement, balance sheet, cash flow |
| 12 | `stock-valuation` | P/E, P/S, EV/EBITDA, peer multiples |
| 13 | `economics-analysis` | Macro environment, rate sensitivity |
| 14 | `financial-report-analyst` | 10-K/10-Q deep dive, risk factors |
| 15 | `dividend-analysis` | Yield, payout ratio, sustainability |

---

## Research Process (5 Phases)

Modules are grouped into phases regardless of depth. Earlier phases inform later-phase assumptions.

### Phase 1 — Business & Competitive Foundation

Establish qualitative and quantitative foundation before attempting valuation.

- **stock-eval** — Company overview, competitive position, relative valuation vs. peers
- **competitor-analysis** *(standard+)* — Moat depth, Porter's Five Forces, pricing power
- **fundamental-analysis** *(comprehensive)* — Income statement, balance sheet, cash flow quality

Output: **Business Quality Score (0–10)**
Score reflects durability of competitive advantages, financial health, and consistency of returns.

### Phase 2 — Valuation

Determine intrinsic and relative worth of the business.

- **dcf-valuation** — Intrinsic value with Bull/Base/Bear scenarios
- **stock-valuation** *(comprehensive)* — P/E, EV/EBITDA, P/S, P/FCF peer multiples

Output: **Valuation Score (0–10)** — 10 = deep discount to intrinsic value; 5 = fair value; 0 = extreme overvaluation.

### Phase 3 — Market Signals

Understand what sophisticated market participants are signaling.

- **insider-trading** — SEC Form 4 patterns, net insider sentiment
- **institutional-ownership** *(standard+)* — Smart money 13F changes, concentration
- **earnings-call-analysis** — Management tone, guidance quality, forward signals

Output: **Market Signal Score (0–10)** — High = insider buying + institutional accumulation + positive management tone.

### Phase 4 — Technical Timing

Identify current technical setup to optimize entry timing.

- **technical-analysis** — Trend structure, support/resistance, volume, momentum
- **sector-analysis** *(standard+)* — Sector rotation, relative strength vs. benchmark

Output: **Technical Setup Score (0–10)** — Strong (8–10), Moderate (4–7), Weak (0–3).

### Phase 5 — Risk Assessment

Quantify downside risks and positioning pressure.

- **short-interest** *(standard+)* — Short positioning, days-to-cover, squeeze risk
- **options-analysis** *(standard+)* — Implied volatility, put/call ratios, options flow
- **economics-analysis** *(comprehensive)* — Macro environment, rate sensitivity
- **financial-report-analyst** *(comprehensive)* — 10-K/10-Q risk factors

Output: **Risk Profile Score (0–10)** — Inverse of risk: Low risk = high score (8–10), High risk = low score (0–3).

---

## Composite Scoring Framework

```
Full Report Score = Weighted Composite

Component                Weight    Sub-Score (0-10)
─────────────────────────────────────────────────────
Business Quality          25%      [Phase 1 modules]
Valuation                 25%      [Phase 2 modules]
Market Signals            20%      [Phase 3 modules]
Technical Setup           15%      [Phase 4 modules]
Risk Profile              15%      [Phase 5 modules]
─────────────────────────────────────────────────────
COMPOSITE SCORE          100%      X.X / 10

Composite Interpretation:
8.0–10.0  → Strong Buy   (all signals aligned)
6.5–7.9   → Buy          (most signals positive)
5.0–6.4   → Hold/Watch   (mixed signals)
3.5–4.9   → Underweight  (mostly negative signals)
0.0–3.4   → Sell/Avoid   (strong negative signals)
```

Sub-score derivation:
- Business Quality: average of moat score (competitor-analysis) + financial strength (fundamental-analysis / stock-eval)
- Valuation: 10 = deep discount to intrinsic value; 5 = at fair value; 0 = extreme overvaluation
- Market Signals: weighted average of insider, institutional, and earnings call scores
- Technical Setup: Strong=8–10, Moderate=4–7, Weak=0–3
- Risk Profile: inverse of risk — Low risk = 8–10, High risk = 0–3

When running quick or standard depth, scores for missing modules default to neutral (5.0) and are flagged as "not assessed" in the scorecard.

---

## Conflict Resolution

When signals conflict across modules, apply these rules:

- **Fundamental overrides technical**: Business quality and intrinsic value take precedence over short-term price action.
- **Consensus overrides outlier**: When 4 of 5 phases agree on direction, document the outlier but do not let it dominate the composite score.
- **Document all conflicts explicitly**: Never suppress conflicting signals. Present the full bull and bear case and explain how the weighting resolves the conflict.
- **Flag unresolvable conflicts**: When signals are deeply contradictory (e.g., strong fundamentals + extreme overvaluation + heavy insider selling), flag as "Conflicted — Monitor Only" until resolution.

---

## Investment Thesis Narrative

Every full-report output must include a narrative investment thesis structured as:

1. **Investment Thesis** (2–3 paragraphs): What does the company do, why is it a compelling or poor investment now, and what is the key insight driving the thesis?
2. **Bull Case** (3–5 quantifiable reasons with supporting evidence from phase outputs)
3. **Bear Case** (3–5 specific risks with probability assessment and potential intrinsic value impact)
4. **Composite Score Card** (visual table with all component scores, weighted scores, and interpretation)
5. **Valuation Summary** (intrinsic value per share, current price, margin of safety, upside/downside % per scenario)
6. **Entry Strategy** (technical setup description, ideal entry range, position sizing: Aggressive 5–7% / Moderate 2–4% / Starter 1–2%)
7. **Exit Strategy** (base/bull/bear price targets, stop-loss level, time horizon)
8. **Monitoring Plan** (key metrics to track quarterly, thesis-changing events, early warning signals, next catalyst dates)

---

## HTML Report Structure

The output file is a standalone HTML document (no external dependencies except CDN Chart.js):

- **Cover page** — ticker, price, date, depth flag used, overall composite score, recommendation
- **Sidebar TOC** — sticky navigation linking to each section
- **Analysis sections** — one per executed module plus final synthesis
- **Interactive charts** — MA overlay, RSI, MACD, volume, composite score radar, phase score bar
- **Composite Score Card** — weighted multi-factor scorecard with color coding
- **Signal block** — standardized investment signal at report end

### Design Principles

- Clean, minimal design — white background, navy accents, Inter/system font
- Data-dense tables with clear visual hierarchy
- Color coding: green = bullish, amber = neutral, red = bearish
- Print-friendly (no fixed sidebars when printing)
- Self-contained: one `.html` file, no local assets

---

## Usage

```
/full-report AAPL
/full-report NVDA --depth quick
/full-report MSFT --depth standard
/full-report TSLA --depth comprehensive --lang zh-TW
/full-report AMZN --output ~/Desktop/
```

**Arguments:**
- `<TICKER>` — required, any US-listed stock
- `--depth` — `quick` | `standard` | `comprehensive` (default: `comprehensive`)
- `--lang` — output language, default `en`, supports `zh-TW`, `zh-CN`, `ja`
- `--output` — custom save path, default `output/`

---

## Output File Naming

```
output/<TICKER>_report_<YYYY-MM-DD>.html
```

Example: `output/AAPL_report_2025-06-19.html`

---

## Workflow

1. Parse `--depth` flag and determine which modules to run
2. Gather all available data for `<TICKER>` (financials, price, filings, macro)
3. Execute modules in phase order; each phase's output informs the next
4. Compute composite weighted score (0–10) using framework above
5. Build investment thesis narrative with bull/bear case
6. Render complete HTML with all sections, charts, and scorecard
7. Write file to output path and confirm location

---

## Data Verification

Before rendering the final report, verify:
- All executed modules returned scores (not blank)
- Scores are within 0–10 range
- Weighted composite arithmetic is correct (weights sum to 100%)
- Missing modules for quick/standard depth are flagged as "not assessed"
- No data older than 90 days used without explicit warning

---

## Output Format

End with the standard signal block after the final synthesis section:

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

**Disclaimer:** Educational analysis only. Not financial advice.
