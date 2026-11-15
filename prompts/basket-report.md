# Basket Report

## ⚠️ Data Verification — Do This Before Any Analysis

Before running any analysis, always retrieve the latest market data for every ticker in the basket:

1. **Fetch current price** — use web search or ask the user for the live price, 52-week range, and market cap. Never assume a price from training data.
2. **Confirm key figures** — for **every** ticker, on the **same as-of date**: price, market cap, the last four fiscal years and five quarters of statements, shares outstanding, consensus estimates and the next earnings date. Gather them **once**, save them as the basket snapshot (Phase 1), and run every module from that snapshot — a basket in which two pages quote different prices for the same stock has failed before any analysis starts.
3. **State your data source** — fill in the `Data & Sources` header (next section) so the origin, as-of date, retrieval path, and confidence of every figure are explicit at the top of the output.
4. **Flag stale data explicitly** — if live data is unavailable, display this warning before proceeding:

> ⚠️ **Live data unavailable.** The following analysis uses training-data estimates which may be significantly out of date. Verify all prices and metrics before making any decisions.

Never silently substitute training-data estimates for current prices. When in doubt, ask the user to paste the latest quote.

---

## 📋 Data & Sources Header — Open Every Output With It

The first thing in the output is this provenance block, filled in — never left as placeholders. It is the standard documented on the [Data & Accuracy](https://yennanliu.github.io/InvestSkill/data-and-accuracy.html) page and the first thing `result-validator` looks for:

```
Data & Sources
  As of:      <date the figures represent, e.g. 2026-06-30>
  Source:     <primary docs — SEC EDGAR 10-K/10-Q, company IR, FRED, exchange data …>
  Retrieval:  <pasted by user | web/tool retrieval | model memory>
  Confidence: <HIGH | MEDIUM | LOW>
```

- `Retrieval: model memory` must be paired with `Confidence: LOW` — memory is a placeholder until confirmed against a primary source.
- Mixed sources: list each with its own as-of date rather than blending them.
- Sources disagree on the same figure (a closing price, a deal term): prefer the primary source (SEC filing, company release, exchange data) over an aggregator, then the most recent dated one. Show both values with their sources and dates, say which you used and why, and never average them.
- Data the user pasted is reported as `pasted by user`; do not upgrade its confidence beyond what the user's own source supports.

---

## 🌐 Output Language — `--lang zh-TW`

English is the default. With `--lang zh-TW` — or when the user writes in Traditional Chinese and asks for a Chinese answer — write the whole analysis in Traditional Chinese (繁體中文, Taiwan usage), keeping it machine-checkable:

- **Translate** every heading, narrative paragraph, table header and bullet. Give each metric's English name in brackets the first time it appears — 自由現金流（Free Cash Flow, FCF） — so the reader can match it to the glossary and to English analyses.
- **Keep in English** tickers, figures and units, SEC form and item names (10-K Item 7, Form 4), the four `Data & Sources` field labels (`As of`, `Source`, `Retrieval`, `Confidence` — the Retrieval value may be written in Chinese, e.g. 使用者提供), and the Investment Signal box and JSON footer exactly as specified — field names and the BULLISH / NEUTRAL / BEARISH, HIGH / MEDIUM / LOW, BUY / HOLD / SELL, STRONG / MODERATE / WEAK values. Tools parse them.
- Title the invalidation section **論點失效條件（Thesis Invalidation）**, and close with the disclaimer in Chinese: **免責聲明：** 僅供教育用途，非投資建議。
- Use Taiwan financial terms: 殖利率、本益比、營業利益率、自由現金流、聯準會、選擇權、買權／賣權、除息日、預扣稅.

---

## Overview

`full-report` answers "tell me everything about this one stock". `compare` answers "which of these should I own?" and ends in one Markdown table. Neither produces what a person researching a small group of names actually wants to keep: **one deliverable in which every stock has its own report, every report quotes the same prices, and a front page says what the group has in common and which one to pick.** Running `full-report` four times gives four files written on four sets of assumptions, with nothing joining them.

**This skill is an orchestrator, not a new analysis.** It runs existing frameworks over a basket of 2–5 tickers from one shared data snapshot and assembles the results into a small linked site: a hub page, one report per ticker, and a value-chain page when the names share one. It adds no scoring of its own — every number on the hub comes from `compare` or from a per-ticker `full-report`, and the closing signal is the pick's.

| Skill | Question it answers | Output |
|-------|---------------------|--------|
| `stock-screener` | Which of these 20–50 names deserve a closer look? | One ranked table |
| `compare` | Which of these 2–5 should I own, and why? | One table and an argued pick (Markdown) |
| `full-report` | What is the whole picture on this one stock? | One HTML report |
| **`basket-report`** | **What is the whole picture on these 2–5 stocks, together?** | **A hub page + one report per ticker, linked, on one snapshot** |

**It is the most expensive skill in the plugin.** At the default depth it runs 10 modules per ticker, so a four-stock basket is 40 module runs before the hub. Say so before starting, and offer `--depth quick` (5 per ticker) when the user has not asked for depth.

---

## 1. Inputs

| Input | Required | Default if unstated |
|-------|----------|---------------------|
| Tickers | ✅ 2–5 | One ticker → stop and suggest `full-report`. More than five → run `stock-screener` first, carry its top five forward, and keep its leaderboard as an appendix on the hub. An ETF in the list → analyse it with `etf-analysis` separately; it is not a basket member |
| The question | recommended | If the user gives none, propose one from the data (see Phase 2) and state that it was proposed |
| `--depth` | optional | `standard` (10 modules per ticker). `quick` (5) is allowed. `comprehensive` is **not** offered here — run `full-report --depth comprehensive` on the pick afterwards |
| `--skip a,b,…` | optional | Passed to every per-ticker `full-report`; the same modules are skipped for every ticker so the reports stay comparable |
| Objective and horizon | optional | Passed to `compare` (default: total return over 3–5 years, LONG-TERM) |
| Existing holdings | optional | Passed to `compare` for the diversification check |
| `--lang` | optional | `en`; `zh-TW` supported (section above) |
| `--output` | optional | `output/` |

---

## 2. Framework

### The five rules

These hold for every phase. They are what separates a basket report from several reports stapled together.

1. **One snapshot, one as-of date.** All data for all tickers is gathered once, before any analysis, and saved. Every module of every report reads that snapshot and nothing else. No module re-fetches a price mid-run: two pages that quote different prices for the same stock are a defect, whichever is newer.
2. **Show the input beside the score.** Every score on the hub and in each scorecard appears with the raw value it came from and the weight applied (`EV/EBIT 18× → 6.9`, `Valuation 6.9 × 25% = 1.73`). A score without its input cannot be checked.
3. **Missing is not neutral.** A metric, module or dimension that cannot be computed for one ticker is written as **not assessed**, with the reason, and the weights that were actually used are shown. It is never filled with 5.0, and never copied from another ticker.
4. **Defects stay visible.** When the data has a problem — statements in one currency and the price in another, a listing too recent for moving averages, a vendor field that disagrees with the filing — keep the raw value, flag it where it appears, and list it in the hub's defect ledger. Do not silently repair it and do not drop the ticker.
5. **A refusal is a result.** If a ticker's data cannot support a valuation or a target, its report says so and gives none. If `compare` finds the group not comparable, the hub says so and ranks within subgroups. If no ticker is attractive, the pick is "none of these". Each of these is a finished basket report.

### Phase 1 — The snapshot

Gather, for every ticker on the **same as-of date**: price, 52-week range and market cap; the last four fiscal years and five quarters of income statement, balance sheet and cash flow; shares outstanding; consensus estimates and the next earnings date; insider transactions and top institutional holders; short interest; one year of price history. Record the source and retrieval path of each group of figures.

Save it as `snapshot.md` in the output folder, one section per ticker, before any analysis. From here on the snapshot is the only input. If a figure is missing for one ticker, write `missing — <reason>` in its place rather than leaving the row out.

Then open the output with one `Data & Sources` header for the whole basket. If a ticker's figures could only be obtained for a different date, list it on its own line with that date, and cap the basket's Confidence at MEDIUM.

### Phase 2 — The question

A basket needs a reason to be a basket. State it in one sentence at the top of the hub, as a question the reports then answer: *"Three memory names fell together on one day — is this the cycle turning, or a liquidity event?"* Use the user's question if they gave one. Otherwise propose the question the snapshot itself raises — a shared move, a shared driver, a valuation spread between similar businesses — and label it as proposed.

Also state, in one line each, **why each ticker is in the basket**: its role (the pure play, the supplier, the incumbent, the control).

### Phase 3 — One report per ticker

For each ticker run `full-report` at the chosen depth, with the snapshot as its data and the same `--skip` list for all. Follow its phase order — business quality, then valuation, then market signals, technical setup and risk — because earlier phases feed later ones.

**Finish and save each ticker's report before starting the next.** A basket does not fit in working memory; the saved file is the hand-off. Each report keeps `full-report`'s own contract: its `Data & Sources` header (identical to the basket's), its scorecard, its Thesis Invalidation, its own signal box and JSON footer.

### Phase 4 — The comparison and the pick

Run `compare` on the basket, taking its inputs from the snapshot and its moat, reverse-DCF and catalyst inputs from the Phase 3 reports. It supplies the head-to-head table, the argued pick, the flip condition, the diversification answer and the "same business, different price" check.

Two rankings now exist: `compare`'s composite (absolute anchors, seven dimensions) and each ticker's `full-report` composite (its own modules). Show both on the hub, labelled. **If they disagree on the order of the top two by more than 0.5, say so, explain which dimension causes it, and argue the pick on the user's objective** — do not quietly report one.

### Phase 5 — The value chain (when there is one)

If two or more tickers sit in the same supply or value chain, run `industry-map` once for that chain and mark each basket member's position, the chokepoints and the margin pools. If the tickers share no chain, write "no shared value chain — `industry-map` not applicable" on the hub and skip the page.

### Phase 6 — Audit before assembly

1. Run `result-validator` on each per-ticker composite. A report scoring LOW carries that warning at the top of its page and beside its row on the hub.
2. Check the basket for agreement: each ticker's price, market cap and as-of date are identical on every page that quotes them; every figure repeated between a ticker's report and the hub matches; the hub's composite for each ticker equals the one in that ticker's scorecard. Fix a disagreement at its source and re-render; do not edit one page to match another.
3. Write the **defect ledger** (Rule 4): each data problem found, the ticker, the pages affected, and what was done about it.

### Phase 7 — The hub and the signal

Assemble the hub page last, from the saved reports. Then close with the signal block. **The box expresses the view on the pick, on an absolute basis:**

- The pick is the one argued in Phase 4.
- The Score is **the pick's `full-report` composite** from Phase 3, so it equals the Score in the pick's own report.
- Conviction cannot be STRONG when the two rankings disagreed in Phase 4, or when the pick's `result-validator` confidence is LOW.
- If the pick is "none of these", the box reports the highest composite in the basket with `Action: HOLD` or `SELL` by the Score Guide, and the line above the box says so.

---

## 3. Output Format

Files, all in one folder so the links between them are relative:

```
output/basket_<slug>_<YYYY-MM-DD>/
├── index.html        # the hub
├── <ticker>.html     # one per ticker, from full-report
├── chain.html        # industry-map, only if Phase 5 ran
└── snapshot.md       # the shared data every page was built from
```

`<slug>` is the tickers in lower case joined by hyphens (`mu-mrvl-sndl`). Every page is a standalone HTML file that links to the others with relative paths and carries the same navigation: hub · each ticker · chain.

The hub, in order:

1. **Data & Sources** header for the basket
2. **The question** — one sentence, and whether the user or the skill posed it (Phase 2)
3. **The basket** — a row per ticker: role, price, composite, signal, `result-validator` confidence, link to its report
4. **The answer** — three sentences: the pick, the deciding dimension, the flip condition
5. **Head-to-head table** — from `compare`, every cell `raw → sub-score`, with both composites per ticker (Phase 4)
6. **What they share** — the common driver, pairwise correlation, and the own-one / own-both answer
7. **Value chain** — a summary and link, or "not applicable" (Phase 5)
8. **Coverage** — which modules ran for every ticker, which were skipped by request, which were not assessed and why
9. **Defect ledger** (Phase 6)
10. **How this was built** — the snapshot date, the depth, the module count, and the order of the phases
11. **Thesis Invalidation** and the **Investment Signal block** — the line just above the box names the pick: *"Signal for the pick: ZEPH"*

In chat, reply with the hub's sections 1–4, the list of files written, and the signal block — not the full reports.

---

## Example

```
User: Basket report on ZEPH QRTZ MNTL — which software name do I keep for five years?

[ZEPH is the plugin's fictional ticker; QRTZ and MNTL are hypothetical peers invented for
this example. All figures are illustrative.]

Before starting: 3 tickers × 10 modules = 30 module runs at standard depth, plus compare
and the hub. (--depth quick would be 15.) Proceeding at standard.

Snapshot saved: output/basket_zeph-qrtz-mntl_2026-11-14/snapshot.md — all three as of the
2026-11-13 close, pasted by the user. MNTL short interest: missing — not in the pasted data.

Question (yours): which of three profitable software companies to hold for five years.
Roles: ZEPH — the cheap one · QRTZ — the best business · MNTL — the fastest grower.

Reports written: zeph.html (composite 6.8) · qrtz.html (6.4) · mntl.html (5.7 — short-interest
not assessed, Risk Profile re-weighted across the modules that ran).

Pick: ZEPH. compare ranks ZEPH 7.0 / QRTZ 6.3 / MNTL 5.9; the full-report composites agree
on the order. Deciding dimension: valuation (EV/EBIT 18× → 6.9 against QRTZ 29× → 3.4) at
near-equal quality. Flip: QRTZ at the price where its composite reaches 7.0, or ZEPH's top
customer above 25% of revenue. ZEPH/QRTZ weekly correlation 0.83 → own one, not both.

Value chain: all three sell to enterprise IT budgets but none supplies another — no shared
chain, industry-map not applicable.

Defect ledger: 1 — MNTL reports stock compensation outside "adjusted" EBIT; all three are
shown after SBC, MNTL's adjusted figure kept beside it and flagged on mntl.html.

Signal for the pick: ZEPH — Score 6.8 (its full-report composite) → BULLISH, MODERATE,
LONG-TERM, Confidence MEDIUM (user-pasted data, one field missing).
Files: index.html, zeph.html, qrtz.html, mntl.html, snapshot.md
```

---

## Notes

- **Two to five tickers.** Fewer is a `full-report`; more stops being a report anyone reads. Use `stock-screener` to get down to five.
- **Standard depth is the ceiling.** The basket's job is breadth on one snapshot. Depth belongs to the pick: follow with `full-report --depth comprehensive`, then `thesis-tracker`.
- **Skip the same modules for every ticker.** A basket in which one report has `options-analysis` and another does not is not comparing like with like. A module that cannot run for one ticker is "not assessed" there, not skipped everywhere.
- **The snapshot is a file the user can read.** Offer it; a reader who doubts a number should be able to find where it came from.
- **This skill fetches nothing by itself.** As everywhere in InvestSkill, the data comes from the user or from the host assistant's own tools; the rule here is only that it is gathered once.
- **Before:** `stock-screener` to shortlist. **After:** `full-report --depth comprehensive` and `bear-case` on the pick; `thesis-tracker` to save it; `position-ladder` for sizing; `risk-stress-test` if more than one is owned.

## Thesis Invalidation

After delivering the analysis signal, specify what would reverse it:

**If signal is BULLISH (the pick is a buy) — thesis breaks if:**
- The flip condition on the hub is met — the runner-up reaches its flip price, or the pick's deciding KPI crosses the stated level
- The pick's own report breaks: any trigger in that ticker's `full-report` Thesis Invalidation fires
- An item in the defect ledger turns out to explain the pick's advantage (the cheap stock was cheap because of the data problem, not despite it)

**If signal is BEARISH (none of the basket is attractive) — thesis breaks if:**
- The shared driver named under "What they share" turns favourable in reported numbers, not forecasts
- A basket-wide price decline lifts the best valuation sub-score by 3 or more points with business quality unchanged
- A "not assessed" module that was holding a composite down can now be run and scores above 6.0

**Re-run this analysis when:**
- [ ] Next earnings release of any ticker in the basket (take a new snapshot for all of them, not just that one)
- [ ] Price moves ±15% from the snapshot level for any ticker
- [ ] 60 days have elapsed
- [ ] Material news event (acquisition, leadership change, regulatory decision)

## Standard Signal Output

The box expresses **the view on the pick only** (Phase 7). Name the pick in the line directly above the box (*"Signal for the pick: <TICKER>"*); each other ticker's signal is in its own report and in the hub's basket table.

All analysis concludes with this standardized block:

In the output, the box below is followed immediately by this machine-readable footer — the same values as the box, filled in (no placeholders, no comments), so tools can read the result without parsing the box:

```json
{"investskill": "1", "skill": "basket-report", "ticker": "<TICKER, or null for a portfolio / market-wide view>", "as_of": "<YYYY-MM-DD from Data & Sources>", "signal": "<BULLISH | NEUTRAL | BEARISH>", "confidence": "<HIGH | MEDIUM | LOW>", "horizon": "<SHORT-TERM | MEDIUM-TERM | LONG-TERM>", "score": 0.0, "action": "<BUY | HOLD | SELL>", "conviction": "<STRONG | MODERATE | WEAK>", "retrieval": "<pasted by user | web/tool retrieval | model memory>", "sources": ["<each primary source, dated>"]}
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

**Note:** The Score in the box is the pick's `full-report` composite, so it equals the Score in that ticker's own report; `compare`'s composites are shown beside it in the head-to-head table.

**Disclaimer:** Educational analysis only. Not financial advice.
