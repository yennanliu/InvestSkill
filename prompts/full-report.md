# Full Report — Comprehensive Stock Analysis Orchestrator

Orchestrate InvestSkill analysis modules on one ticker at your chosen depth, synthesize findings into a unified investment thesis with composite scoring, and produce a standalone professional HTML report with interactive Chart.js visualizations.

## Data Verification

**Open the report with a `Data & Sources` header** (see [Data & Accuracy](https://yennanliu.github.io/InvestSkill/data-and-accuracy.html)) so provenance is explicit:

```
Data & Sources
  As of:      <date the figures represent>
  Source:     <primary docs — SEC EDGAR 10-K/10-Q, company IR, FRED, …>
  Retrieval:  <pasted by user | web/tool retrieval | model memory>
  Confidence: <HIGH | MEDIUM | LOW>
```

Before rendering the final report, verify:
- The `Data & Sources` header is present and the Retrieval/Confidence are honest (flag "model memory" as LOW)
- **One snapshot:** every module ran from the same data, gathered once in Workflow step 2 — one price, one share count and one as-of date for the whole report. A module that quotes a different price for the ticker than the cover page is a defect; fix it at the source, do not average
- All executed modules returned scores (not blank)
- Scores are within 0–10 range
- Weighted composite arithmetic is correct (weights sum to 100%)
- Missing modules for quick/standard depth are flagged as "not assessed" and the re-weighted component weights are shown
- No data older than 90 days used without explicit warning

**Then run `fact-check` on the composite** (every figure the modules produced, verified against the filing and market data, with citations), **and hand `result-validator` two separate things**: the *corrected composite* as the analysis to validate (so its "Original Score" is the investment score, not the Verification Score), and the fact-check *ledger and Verification Score* as evidence for its Data Quality dimension. Include both scores in the report footer, labelled — a composite thesis should never ship without this verification-and-validation pass.

---


## 🌐 Output Language — `--lang zh-TW`

English is the default. With `--lang zh-TW` — or when the user writes in Traditional Chinese and asks for a Chinese answer — write the whole analysis in Traditional Chinese (繁體中文, Taiwan usage), keeping it machine-checkable:

- **Translate** every heading, narrative paragraph, table header and bullet. Give each metric's English name in brackets the first time it appears — 自由現金流（Free Cash Flow, FCF） — so the reader can match it to the glossary and to English analyses.
- **Keep in English** tickers, figures and units, SEC form and item names (10-K Item 7, Form 4), the four `Data & Sources` field labels (`As of`, `Source`, `Retrieval`, `Confidence` — the Retrieval value may be written in Chinese, e.g. 使用者提供), and the Investment Signal box and JSON footer exactly as specified — field names and the BULLISH / NEUTRAL / BEARISH, HIGH / MEDIUM / LOW, BUY / HOLD / SELL, STRONG / MODERATE / WEAK values. Tools parse them.
- Title the invalidation section **論點失效條件（Thesis Invalidation）**, and close with the disclaimer in Chinese: **免責聲明：** 僅供教育用途，非投資建議。
- Use Taiwan financial terms: 殖利率、本益比、營業利益率、自由現金流、聯準會、選擇權、買權／賣權、除息日、預扣稅.

---

## Depth Flags

Select how many modules to run with `--depth`, and drop any with `--skip`:

| Flag | Modules | Best For |
|------|---------|----------|
| `--depth quick` | 5 modules — one per scored component | Rapid screen, time-constrained due diligence |
| `--depth standard` | 10 modules | Balanced research before initiating a position |
| `--depth comprehensive` | **Every framework that applies to one stock** — 20 analysis modules + 5 that build the plan, the charts, the verification and the saved thesis (default) | Full pre-commitment due diligence |
| `--skip a,b,…` | Removes the named modules at any depth (e.g. `--skip options-analysis,short-interest` for a stock without listed options). Skipped modules are listed as "skipped by request" and their component is re-weighted (below) | Cost control, or a module that does not apply |

---

## Module Sets by Depth

### Quick (5 modules — every scored component covered once)

| # | Module | Component | Focus |
|---|--------|-----------|-------|
| 1 | `stock-eval` | Business Quality | Company overview, financial strength, relative valuation |
| 2 | `stock-valuation` | Valuation | DCF intrinsic value (bear/base/bull), P/E, EV/EBITDA, peer multiples |
| 3 | `insider-trading` | Market Signals | SEC Form 4 patterns, net insider sentiment |
| 4 | `technical-analysis` | Technical Setup | MA, RSI, MACD, volume, support/resistance |
| 5 | `bear-case` | Risk Profile | Short-seller red-team, Thesis-Killers, downside target |

### Standard (10 modules — Quick + 5 more)

| # | Module | Component | Focus |
|---|--------|-----------|-------|
| 6 | `competitor-analysis` | Business Quality | Moat, market share, Porter's Five Forces |
| 7 | `financial-report-analyst` | Business Quality | 10-K/10-Q statement quality, red flags, risk factors |
| 8 | `earnings-call-analysis` | Market Signals | Management tone, guidance quality, key themes |
| 9 | `institutional-ownership` | Market Signals | 13F holdings, smart-money flows |
| 10 | `catalyst-calendar` | Risk Profile | Dated events in the next 90 days and their expected impact |

### Comprehensive (every framework that applies to one stock — Standard + 15 more)

| # | Module | Component | Focus |
|---|--------|-----------|-------|
| 11 | `10k-digest` | *(input)* | Structured digest of the latest 10-K; `financial-report-analyst` reads it and the report's appendix cites it |
| 12 | `industry-map` | Business Quality | Position in the value chain, chokepoints, margin pools |
| 13 | `dividend-analysis` | Business Quality | Capital allocation: dividends, buybacks, FCF deployment, M&A, debt management |
| 14 | `earnings-preview` | Market Signals | Consensus vs. whisper, implied move, three-scenario grid — **only if the next report is within 45 days**; otherwise listed as "not applicable this quarter" |
| 15 | `sector-analysis` | Technical Setup | Sector rotation, relative strength vs. benchmark |
| 16 | `short-interest` | Risk Profile | Short ratio, days to cover, squeeze risk |
| 17 | `options-analysis` | Risk Profile | IV and IV rank, put/call, what the options market prices in |
| 18 | `economics-analysis` | Risk Profile | Macro regime and rate sensitivity |
| 19 | `forensic-accounting` | Risk Profile | Beneish, Altman, accruals, cash conversion — earnings quality |
| 20 | `credit-check` | Risk Profile | Maturity wall, coverage, refinancing cost — skipped automatically for banks and insurers |
| 21 | `position-ladder` | *(plan)* | The Entry Strategy: rungs, share-count floor and ceiling, thesis-break exit |
| 22 | `chart-master` | *(charts)* | The report's MA / RSI / MACD / volume / scorecard charts |
| 23 | `fact-check` | *(verification)* | Every figure checked against the filing and market data, with citations |
| 24 | `result-validator` | *(verification)* | Confidence across data quality, methodology and signal consistency |
| 25 | `thesis-tracker` | *(saved thesis)* | Writes `output/thesis/<TICKER>.md` from the composite so `--update` can re-check it later |

Modules in *(italics)* produce inputs, the plan, the charts or the verification; they do not get a weight in the composite.

**Frameworks that do not apply to a single-stock report** (run them on their own):
- `etf-analysis` — if the ticker is an ETF, stop and run it instead of this report
- `portfolio-review`, `risk-stress-test`, `tax-lens` — they need the user's holdings or lots
- `stock-screener`, `compare` — they rank or weigh several tickers
- `trade-postmortem` — it reviews a closed trade
- `learning-coach` — run it on the finished report to have every metric explained

---

## Research Process (5 Phases)

Modules are grouped into phases regardless of depth; each phase's sub-score is the component of the same name. Earlier phases inform later-phase assumptions.

### Phase 1 — Business & Competitive Foundation → Business Quality

- **stock-eval** — Company overview, financial strength, relative valuation vs. peers
- **competitor-analysis** *(standard+)* — Moat depth, Porter's Five Forces, pricing power
- **financial-report-analyst** *(standard+)* — Statement quality and red flags; at comprehensive depth it reads the **10k-digest** first
- **industry-map** *(comprehensive)* — Where the company sits in its value chain and who holds the pricing power
- **dividend-analysis** *(comprehensive)* — Capital allocation: dividend and buyback sustainability, FCF deployment, M&A record, debt management

### Phase 2 — Valuation → Valuation

- **stock-valuation** — DCF intrinsic value with Bull/Base/Bear scenarios, plus P/E, EV/EBITDA, P/S, P/FCF peer multiples. At comprehensive depth, the `bear-case` downside target sets the Bear scenario

10 = deep discount to intrinsic value; 5 = fair value; 0 = extreme overvaluation.

### Phase 3 — Market Signals → Market Signals

- **insider-trading** — SEC Form 4 patterns, net insider sentiment
- **earnings-call-analysis** *(standard+)* — Management tone, guidance quality, forward signals
- **institutional-ownership** *(standard+)* — Smart-money 13F changes, concentration
- **earnings-preview** *(comprehensive, report within 45 days)* — What the price already assumes going into the print

### Phase 4 — Technical Timing → Technical Setup

- **technical-analysis** — Trend structure, support/resistance, volume, momentum
- **sector-analysis** *(comprehensive)* — Sector rotation, relative strength vs. benchmark

### Phase 5 — Risk Assessment → Risk Profile

- **bear-case** — Short-seller red-team: Thesis-Killers and a downside target. Its Thesis-Killers become the Bear Case section of the thesis narrative, and the Thesis Invalidation checks whether they are refuted
- **catalyst-calendar** *(standard+)* — Dated events in the next 90 days; high-impact binary events lower the Risk Profile, and the dates populate "next catalyst dates" in the Monitoring Plan
- **short-interest**, **options-analysis**, **economics-analysis** *(comprehensive)* — Positioning pressure, what the options market prices in, macro and rate sensitivity
- **forensic-accounting**, **credit-check** *(comprehensive)* — Can the earnings be trusted, and can the balance sheet carry the plan

### After the phases (comprehensive)

- **position-ladder** writes the Entry Strategy; **chart-master** draws the charts; **fact-check** then **result-validator** verify the composite (see Data Verification above); **thesis-tracker** saves the thesis, its KPIs and the invalidation triggers to `output/thesis/<TICKER>.md`.

---

## Composite Scoring Framework

```
Full Report Score = Weighted Composite

Component                Weight    Sub-Score (0-10)
─────────────────────────────────────────────────────
Business Quality          25%      [Phase 1 modules that ran]
Valuation                 25%      [Phase 2]
Market Signals            20%      [Phase 3 modules that ran]
Technical Setup           15%      [Phase 4 modules that ran]
Risk Profile              15%      [Phase 5 modules that ran]
─────────────────────────────────────────────────────
COMPOSITE SCORE          100%      X.X / 10

Composite Interpretation (the standard Score Guide — the box at the end uses the same bands):
8.0–10.0  → Strongly Bullish    (all signals aligned)
6.0–7.9   → Moderately Bullish  (most signals positive)
4.0–5.9   → Neutral             (mixed signals)
2.0–3.9   → Moderately Bearish  (mostly negative signals)
0.0–1.9   → Strongly Bearish    (strong negative signals)
```

The composite *is* the box Score, so the box Signal follows from it: ≥ 6.0 BULLISH, 4.0–5.9 NEUTRAL, < 4.0 BEARISH. Action and Conviction are a judgement on top (a 6.2 can be BULLISH / HOLD / WEAK when the valuation is stretched), but never contradict the Signal.

Sub-score derivation — **a sub-score is the plain average of the box Scores of the modules in its component that ran.** Every module's box Score is already oriented so that higher is better for a holder: `bear-case` reports `min(10 − Bear Case Strength, 6.5)`, `forensic-accounting` reports `10 − Manipulation Risk Score`, `credit-check` reports its Credit Health Score, and `catalyst-calendar`, `short-interest`, `options-analysis` and `economics-analysis` score the setup for a holder. No module is inverted a second time here.

**Missing modules are never scored as 5.0.** Quick depth covers each component once, so all five weights apply. If `--skip` (or "not applicable", e.g. `earnings-preview` outside the 45-day window, `credit-check` for a bank) removes every module of a component, drop that component and re-weight the rest proportionally — e.g. without Market Signals: Business Quality 31.25% · Valuation 31.25% · Technical Setup 18.75% · Risk Profile 18.75%. The scorecard lists every module as run / skipped by request / not applicable and states the weights actually used.

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
full-report AAPL
full-report NVDA --depth quick
full-report MSFT --depth standard
full-report TSLA --depth comprehensive --lang zh-TW
full-report JPM --skip credit-check,options-analysis
full-report AMZN --output ~/Desktop/
```

**Arguments:**
- `<TICKER>` — required, any US-listed stock
- `--depth` — `quick` | `standard` | `comprehensive` (default: `comprehensive`)
- `--skip` — comma-separated module names to leave out at any depth; the scorecard re-weights (see Composite Scoring)
- `--lang` — output language, default `en`, supports `zh-TW`
- `--output` — custom save path, default `output/`

---

## Output File Naming

```
output/<TICKER>_report_<YYYY-MM-DD>.html
```

Example: `output/AAPL_report_2026-10-24.html`

---

## Workflow

1. Parse `--depth` and `--skip`; determine which modules run, and mark the not-applicable ones (ETF ticker → stop and suggest `etf-analysis`; bank/insurer → no `credit-check`; next report > 45 days away → no `earnings-preview`)
2. Gather all available data for `<TICKER>` (financials, price, filings, macro) **once, as one snapshot with one as-of date**; every module in the next step reads that snapshot instead of fetching its own, and a figure that is missing from it is reported as missing, not looked up again mid-run
3. Execute modules in phase order; each phase's output informs the next
4. Compute composite weighted score (0–10) using framework above, re-weighting for any component with no module
5. Build investment thesis narrative with bull/bear case
6. At comprehensive depth: Entry Strategy from `position-ladder`, charts from `chart-master`, then `fact-check` → `result-validator` on the composite
7. Render complete HTML with all sections, charts, and scorecard
8. Write the file to the output path, save the thesis with `thesis-tracker` (comprehensive), and confirm both locations

---

---

## Thesis Invalidation

The composite thesis is only as good as its weakest well-weighted module. After the final synthesis, state what would reverse the composite call:

**If the composite is BULLISH — thesis breaks if:**
- Any module weighted ≥ 15% flips from BULLISH to BEARISH at the next re-run (name the module and the metric that would flip it)
- The `bear-case` module's Thesis-Killers are *not* refuted — a bull composite that cannot answer its own red-team is not bullish, it is unexamined
- Price rises far enough that the valuation modules' fair-value range is exceeded while the fundamental modules are unchanged (multiple expansion doing all the work)

**If the composite is BEARISH — thesis breaks if:**
- The specific deterioration that drove the low-scoring modules reverses (margins re-expand, guidance is raised, insider selling stops)
- Valuation falls below the bear-case downside target with fundamentals stable (the bad news is priced)
- Two or more independent modules (e.g. `insider-trading` + `institutional-ownership`) turn positive together

**Re-run this report when:**
- [ ] Next earnings release (every module's inputs change)
- [ ] Price moves ±15% from the level in the `Data & Sources` header
- [ ] Any single module's signal flips
- [ ] 90 days have elapsed

---

## Output Format

End with the standard signal block after the final synthesis section:

In the output, the box below is followed immediately by this machine-readable footer — the same values as the box, filled in (no placeholders, no comments), so tools can read the result without parsing the box:

```json
{"investskill": "1", "skill": "full-report", "ticker": "<TICKER, or null for a portfolio / market-wide view>", "as_of": "<YYYY-MM-DD from Data & Sources>", "signal": "<BULLISH | NEUTRAL | BEARISH>", "confidence": "<HIGH | MEDIUM | LOW>", "horizon": "<SHORT-TERM | MEDIUM-TERM | LONG-TERM>", "score": 0.0, "action": "<BUY | HOLD | SELL>", "conviction": "<STRONG | MODERATE | WEAK>", "retrieval": "<pasted by user | web/tool retrieval | model memory>", "sources": ["<each primary source, dated>"]}
```

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
