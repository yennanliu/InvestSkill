---
description: Claim-level verification of any report or data set — extract every figure and factual claim, check each against a primary source (SEC filing, company IR, FRED, exchange data, or the user's own document), recompute derived numbers, mark ✅ verified / ⚠️ mismatch / ❓ unverifiable, and re-issue the report with inline citations and a References section; Verification Score 0–10
---

# Fact Check — Verify the Numbers, Cite the Sources

## ⚠️ Data Verification — Do This Before Any Analysis

Before verifying anything, establish what data each claim actually needs:

1. **Fetch current price only where a claim needs it** — market claims (price, market cap, yield, multiples "today") are checked against a live quote for the report's as-of date and today's; use web search or ask the user. Reported figures, historical comparisons, and `--recompute` runs need **no** live quote — do not request one, and do not let its absence block them. Never assume a price from training data.
2. **Confirm key figures** — for this skill the "key figures" are the *sources themselves*: the filing (10-K / 10-Q / 8-K / proxy / Form 4 / 13F), the IR release, the FRED series, the exchange or issuer data, or the document the user pasted. Retrieve or request them before judging a single claim. A claim checked against memory is not checked.
3. **State your data source** — fill in the `Data & Sources` header (next section) so the origin, as-of date, retrieval path, and confidence of every figure are explicit at the top of the output.
4. **Flag stale data explicitly** — if a live quote is needed for a market claim and unavailable, display this warning before proceeding, and mark those claims `❓` or `🕒` rather than guessing:

> ⚠️ **Live data unavailable.** The following analysis uses training-data estimates which may be significantly out of date. Verify all prices and metrics before making any decisions.

The warning describes the *inputs actually used*: when every claim was checked against user-supplied documents, say so instead of implying training-data estimates were involved. Never silently substitute training-data estimates for current prices. When in doubt, ask the user to paste the latest quote.

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
- Data the user pasted is reported as `pasted by user`; do not upgrade its confidence beyond what the user's own source supports.

For this skill the header describes the **sources used to verify**, not the report being verified — the report's own header is quoted and judged in Phase 5.

---

## Overview

Every InvestSkill analysis opens with a `Data & Sources` header, and `result-validator` scores whether sources are "cited or identifiable". Neither answers the question a careful reader actually has: **is this specific number true, and where exactly does it come from?** A report can carry an honest header, a tidy methodology, and a consistent signal — and still be built on a revenue figure from the wrong fiscal year, a margin computed on non-GAAP earnings, or a share count that was stale when the model wrote it.

This skill closes that gap at the level of the individual claim. It takes any report — an InvestSkill output, a broker note, a spreadsheet, a paragraph from a forum post — pulls out **every figure and factual assertion**, checks each one against a **primary source**, **recomputes** every derived number from verified inputs, and hands back three things: a claim ledger with a verdict per claim (✅ verified · ⚠️ mismatch · ❓ unverifiable · 🔁 recomputed · 🕒 stale), a **corrected copy of the report with inline citations and a References section**, and a **Verification Score 0–10** that `result-validator` can consume as the evidence behind its Data Quality dimension.

**Division of labour.** `result-validator` asks *is this analysis well built?* (methodology, consistency, risk coverage, transparency). `fact-check` asks *are the inputs true?* Run this one first when the stakes are real; the validator's score means little if the numbers underneath it are wrong. `learning-coach` then explains the result to a beginner.

**What it is not.** It does not re-run the analysis, form its own view on the stock, or change the report's signal. It never invents a source to make a claim look verified: an unverifiable claim stays `❓`, and a claim that cannot be traced is more honestly left uncited than given a plausible-looking reference. Fabricating a citation is the one failure mode that makes this skill worse than useless — it is a hard-cap-to-zero offence in the score.

---

## 1. Modes

| Mode | Invocation | What it does |
|------|------------|--------------|
| **Verify** (default) | paste the report (+ sources, or permission to retrieve them) | Full ledger, recomputation, consistency check, corrected report with citations, Verification Score |
| **Cite** | `--cite-only` + the report + its sources | Attach inline citations and a References section to figures the sources confirm; no recomputation, no score beyond coverage — for a report you already trust but need to make traceable |
| **Recompute** | `--recompute` + the report | Only the arithmetic: rebuild every derived figure from the reported inputs and flag disagreements — fast, needs no external source |
| **Diff** | `--diff` + two versions of a report or two data sets | Which figures changed, by how much, and whether the change is a restatement, a period roll, or an error |

If a source cannot be retrieved in the environment, the skill says which claims that blocks and asks the user to paste the document — it never fills the gap from memory.

## 2. Inputs

| Input | Required | Default if unstated |
|-------|----------|---------------------|
| The report or data to check (pasted, or a file) | ✅ | — |
| Sources: pasted filing text / IR release / data table, URLs, or permission to retrieve | ✅ for Verify and Cite | ask; without sources every claim is `❓` and the score is capped |
| Ticker and fiscal calendar (FY end month) | recommended | infer from the report; state it — half of all "mismatches" are fiscal-year confusions |
| Tolerance for market data (price, market cap) | optional | ±1% and same trading day |
| Which claims are **signal-driving** (the 3–5 numbers the report's conclusion rests on) | optional | infer from the report's own signal box and thesis; state the choice |
| Output form: corrected copy vs. annotated diff | optional | corrected copy with strike-through of originals |

---

## 3. Framework

### Phase 1 — Extract every claim into a ledger

Read the report once and list **every** checkable statement — not just the headline numbers. One row per claim:

| # | Claim (as written) | Value · unit · period | Type | Signal-driving? | Where in report |
|---|--------------------|-----------------------|------|-----------------|-----------------|
| 1 | "Revenue grew 20% to $6.12B in FY2026" | $6,120M · FY2026 · +20% YoY | reported (filing) | ✅ | §2 Financial Health |
| 2 | "FCF of $930M" | $930M · FY2026 | derived (OCF − capex) | ✅ | §2 |
| 3 | "trades at 24× forward earnings" | 24.2× · as of ? | market × estimate | ✅ | §3 Valuation |
| 4 | "CFO bought $1.2M of stock in May" | $1.2M · 2026-05 | fact (Form 4) | — | §5 Insider |
| 5 | "top customer is 18% of revenue" | 18% · FY2026 | reported (10-K risk factors) | — | §1 |

**Claim types** decide which source can verify them: *reported* (a figure stated in a filing or release), *derived* (computed from reported figures — must be recomputed, not just matched), *market* (price, market cap, yield — needs an as-of date), *estimate* (consensus, guidance — needs the source and date of the estimate), *macro* (rates, CPI — FRED / BLS series and vintage), *fact* (an event: a filing, a transaction, an appointment), *qualitative* (a characterization — "dominant", "improving" — checked for whether the cited evidence supports it, never marked verified on its own).

Mark the **signal-driving** claims. They carry more weight in the score and a mismatch on one of them changes the report's standing.

### Phase 2 — Source hierarchy

Only a source the reader could open verifies a claim. Rank what you use, and record the tier in the ledger:

| Tier | Sources | Verifies |
|------|---------|----------|
| **1 — Primary** | SEC EDGAR filings (10-K, 10-Q, 8-K, DEF 14A, Form 4, 13F, S-1), the company's own IR release or presentation, FRED / BLS / BEA series, the exchange's or ETF issuer's published data, IRS publications, the fund prospectus / factsheet | reported figures, facts, macro, fund data |
| **1 — User-supplied** | The document the user pasted (a filing excerpt, a broker statement, a data export) | its own figures — labelled `user-supplied` so the reader knows verification stops at the user's document |
| **2 — Secondary** | Reputable financial data vendors and press explicitly quoting a primary document, consensus aggregators for estimates | market data and estimates, with the vendor and date recorded; a reported figure verified only at Tier 2 is marked `✅ (secondary)` |
| **3 — Not a source** | Model memory, forum posts, uncited summaries, a second AI output | nothing — a claim matched only against these stays `❓` |

Prefer the most specific location: Item and Note number, statement line, table, page. "The 10-K" is a document, not a citation.

**Retrieving a Tier-1 source without an API key.** When the user grants permission to retrieve and the host can fetch URLs, go straight to SEC EDGAR rather than a summary site: resolve the CIK from `https://www.sec.gov/files/company_tickers.json` (zero-pad `cik_str` to 10 digits); list filings from `https://data.sec.gov/submissions/CIK##########.json`, where `filings.recent.form` / `filingDate` / `reportDate` / `accessionNumber` / `primaryDocument` line up by index (`10-K`, `10-Q`, `8-K`, `DEF 14A`, `4` for insider transactions, `13F-HR` for institutional holdings, `20-F` / `6-K` for foreign issuers); open the document at `https://www.sec.gov/Archives/edgar/data/<CIK without leading zeros>/<accession without dashes>/<primaryDocument>`; and cross-check statement figures against the tagged facts at `https://data.sec.gov/api/xbrl/companyfacts/CIK##########.json`. Send an identifying `User-Agent` and stay under 10 requests per second. Record `Retrieval: web/tool retrieval`, the accession number and the filing date. If the host cannot fetch, ask the user to paste the document — or to run `node scripts/fetch-edgar.js <TICKER> --form 10-K` / `node scripts/fetch-fundamentals.js <TICKER>` from the InvestSkill repository and paste the output (`Retrieval: pasted by user`). A source that could not be retrieved leaves its claims `❓`; it is never filled from memory.

### Phase 3 — Verify each claim

For each ledger row, locate the figure in the source, compare, and assign one verdict:

| Verdict | Meaning | Rule |
|---------|---------|------|
| ✅ **VERIFIED** | The source states the figure | Reported figures: exact, or rounding within 0.5%. Market data: same trading day and within the stated tolerance. Percentages: within 0.1 pp. Record source · location · as-of |
| ⚠️ **MISMATCH** | The source states a different figure | Record the source value, the delta (absolute and %), and the **likely cause** — the usual suspects: wrong fiscal year or quarter; TTM vs. fiscal year; GAAP vs. adjusted; basic vs. diluted shares; a restated prior period; a currency or unit slip (thousands vs. millions); a stale price |
| ❓ **UNVERIFIABLE** | No Tier 1–2 source available | Say what source would settle it. This is *not* "false" — never let the corrected report read as if the claim were disproven |
| 🔁 **RECOMPUTED** | A derived figure rebuilt from verified inputs | Show the arithmetic (Phase 4); mark `agrees` or `disagrees (report X, recomputed Y)` |
| 🕒 **STALE** | Verified, but the as-of date is older than the report implies or than 90 days | Verified figure, wrong vintage — give the current value alongside |

A qualitative claim is judged only on whether the evidence the report cites for it holds; it is never `✅` on its own.

### Phase 4 — Recompute every derived figure

Never accept a derived number by matching it to a secondary source that may have made the same mistake. Rebuild it from verified inputs and show the work:

```
Free cash flow      = OCF − capex                          1,240 − 310            = 930   ✓ report 930
Gross margin        = gross profit ÷ revenue               3,550 ÷ 6,120          = 58.0% ✓ report 58%
Revenue growth      = rev / prior rev − 1                  6,120 ÷ 5,100 − 1      = 20.0% ✓
Net debt            = total debt − cash                    800 − 1,650            = −850  (net cash) ✓
Market cap          = price × shares outstanding           48.20 × 412            = 19,858   (shares outstanding at the price date — not the diluted count used for EPS)
Enterprise value    = market cap + debt − cash             19,858 + 800 − 1,650   = 19,008
P/E (trailing)      = price ÷ diluted EPS                  48.20 ÷ 1.99           = 24.2× ✓ report "24× forward" ✗ — trailing, not forward
FCF yield           = FCF ÷ market cap                     930 ÷ 19,858           = 4.7%
Payout (FCF basis)  = dividends paid ÷ FCF                 165 ÷ 930              = 17.7%
```

Standard checks: FCF, margins, growth rates, per-share figures (which share count?), P/E · P/S · EV/EBITDA · P/FCF (trailing vs. forward, and whose estimate), net debt and EV, payout and yield, ROE / ROIC (state the denominator), any score or weighted composite in the report (do the weights sum to 100%? does the weighted sum match?). Where the report's definition is ambiguous, say so rather than picking one silently.

### Phase 5 — Consistency and honesty of the report itself

- **Numbers vs. narrative** — does the text say what the tables say? ("margins expanding" next to a table where they fell)
- **Internal contradictions** — the same figure quoted two ways in two sections.
- **Signal vs. score** — the signal box's Score must sit in the band its Signal implies (≥ 6.0 BULLISH · 4.0–5.9 NEUTRAL · < 4.0 BEARISH); a mismatch is a red flag, not a rounding issue.
- **The report's `Data & Sources` header vs. what was verifiable** — a header claiming `Retrieval: web/tool retrieval · Confidence: HIGH` over a report whose figures cannot be traced is itself a finding. Quote the header and state whether the verification supports it.
- **Fabricated or unopenable citations** in the report — a reference that does not exist, or a page/Item that does not contain the figure, is the most serious finding this skill can make. Say so plainly.

### Phase 6 — Re-issue the report with citations

Produce the corrected copy (or the diff, if asked):

- Every `✅` figure gets an inline citation `[n]`; every `🔁 agrees` figure gets the citation of its inputs plus `(recomputed)`.
- Every `⚠️` figure is corrected **in place**, with the original struck through: ~~$5.9B~~ **$6.12B** [1] — and a one-line note on the cause. Never silently change a number.
- Every `❓` figure is marked `[?]` and left as written. Every `🕒` figure keeps its citation and gains `(as of <date>; current: <value> [m])`.
- Qualitative claims whose evidence failed are marked `[unsupported]`.
- A **References** section closes the report:

```
## References
[1] Zephyr Robotics Inc., Form 10-K for FY ended 2026-03-31 — Item 8, Consolidated Statements of Operations, p. 54 (SEC EDGAR, accession 0000000000-26-000000; retrieved 2026-06-30)
[2] Same filing — Item 8, Consolidated Statements of Cash Flows, p. 58
[3] Zephyr Robotics Q4 FY2026 earnings release, 2026-05-14 — segment table (company IR)
[4] Form 4, filed 2026-05-19 — CFO open-market purchase (SEC EDGAR)
[5] User-supplied: price and shares outstanding as of 2026-06-30 close (pasted by user; not independently verified)
```

Each reference names the document, the exact location, the as-of or filing date, and how it was retrieved. If the environment cannot produce a URL or accession number, say so rather than inventing one.

### Phase 7 — Verification Score (0–10)

The headline number measures **how much of the report is demonstrably true**, not whether the report's conclusion is right.

| Component | Weight | 10 looks like | 0 looks like |
|-----------|--------|---------------|--------------|
| Coverage | 30% | ≥ 95% of claims `✅` or `🔁 agrees` | < 40% |
| Signal-driving accuracy | 30% | Every signal-driving claim verified within tolerance | A signal-driving claim off by > 5% or from the wrong period |
| Recomputation | 15% | Every derived figure agrees | Derived figures disagree or cannot be rebuilt from the report's own inputs |
| Source quality | 15% | All Tier 1, specific locations | Mostly secondary or user-supplied only |
| Freshness | 10% | Every as-of date matches the report's claim and is < 90 days old for market data | Stale figures presented as current |

**Hard caps** (state any that fires): a signal-driving `⚠️` **or `🔁 disagrees`** with delta > 5% → **max 4.0** · more than half the claims `❓` → **max 5.0** · the report's own `Data & Sources` header overstates its retrieval or confidence → **max 6.0** · **any fabricated or unopenable citation found in the report → 0.0**. Always print a `Caps fired:` line under the score (`none`, or the list) so a capped 4.0 is never mistaken for an earned 4.0 — **a report whose score was capped by a signal-driving mismatch is a failed verification regardless of the number.**

Map onto the standard bands: **≥ 6.0** the report's inputs are sound (BULLISH on the *report*) · **4.0–5.9** usable with the listed corrections (NEUTRAL) · **< 4.0** do not rely on it — re-run the analysis with verified inputs (BEARISH). Hand the score and the ledger to `result-validator`, whose Data Quality dimension should not exceed what this score supports.

---

## 4. Output Format

1. `Data & Sources` header — the sources *used to verify*, with retrieval path
2. **Verification summary** — one line: `N claims · V verified · R recomputed (r agree) · M mismatch · U unverifiable · S stale · Verification Score X.X · Caps fired: none | <list>`
3. **Signal-driving claims first** — the 3–5 that matter, each with verdict, source, and delta
4. **Claim ledger** — the full table from Phase 1 with verdict, source tier, location, as-of
5. **Mismatches in detail** — original · source value · delta · likely cause · what the corrected figure does to the report's conclusion
6. **Recomputation table** — Phase 4, arithmetic shown
7. **Report consistency findings** — Phase 5, including the judgment on the report's own header
8. **Corrected report with citations** (or `--diff` output) and the **References** section
9. **Thesis Invalidation** — what would change these verdicts (below)
10. **Investment Signal block** — mirrors the report's signal with the verification verdict attached (below)

---

## Example

```
User: [pastes a stock-eval output on ZEPH that concludes BULLISH 7.4 / 10] Verify every number
      and add sources. Here is the FY2026 10-K excerpt and the Q4 release. [pasted]

The assistant lists 23 claims, flags 5 as signal-driving (revenue growth, gross margin, FCF,
net cash, forward P/E). Verifies 17 against the 10-K and the release with Item/statement/page
locations; recomputes 6 derived figures — all agree except one: the report's "24× forward P/E"
is 48.20 ÷ 1.99, i.e. the *trailing* multiple on FY2026 diluted EPS; no forward estimate is
cited, so the claim becomes ⚠️ MISMATCH (label) with the corrected wording "24.2× trailing";
consensus forward EPS would be needed for the forward figure → ❓ until supplied. Two claims
are 🕒 STALE: the price and market cap are from a date 40 days before the report. One
qualitative claim ("dominant share of warehouse robotics") cites no evidence → [unsupported].
The report's own header said "Retrieval: web/tool retrieval · Confidence: HIGH"; 17/23 verified
supports MEDIUM, so that is noted. No fabricated citations. Verification Score 6.8 — the report's
inputs are sound; the signal stands with the valuation sentence corrected. Emits the corrected
report with [1]–[9] inline and a References section, and hands the ledger to result-validator.
```

---

## Notes

- **Run it before `result-validator`, not instead of it.** This skill checks the inputs; the validator checks the reasoning built on them. The validator's Data Quality score should never exceed what the Verification Score supports.
- **Every InvestSkill report is a candidate**, but so is anything else the user brings — a broker note, a newsletter, a spreadsheet, a screenshot transcribed to text. The ledger discipline is the same.
- **Unverifiable is not false.** The corrected copy must never read as if a `❓` claim were refuted. The honest output for a claim without a source is the claim, unchanged, with `[?]`.
- **Fiscal calendars cause most false mismatches.** Establish the fiscal year end and the period each table covers before comparing anything.
- **Do not fabricate a reference to fill a gap.** No accession number, page, or URL that was not actually seen. If the environment cannot retrieve, ask the user to paste.
- **Pairs with**: `result-validator` (consumes the score), `learning-coach` (explains the ledger to a beginner), `10k-digest` and `financial-report-analyst` (produce well-cited inputs in the first place), `full-report` (run this on the composite before shipping it), `thesis-tracker` (verify the KPI values before recording them at a check).

## Thesis Invalidation

After delivering the analysis signal, specify what would reverse it:

**If signal is BULLISH (the report's inputs verified) — the verdicts break if:**
- A new filing restates a figure the report relied on (an 8-K or an amended 10-K/A) — every `✅` on that figure becomes `🕒` until re-checked
- A signal-driving figure that was verified at Tier 2 (secondary) is later contradicted by the primary document
- The market-data as-of dates pass 90 days — verified prices become stale prices, and the valuation claims built on them lose their `✅`

**If signal is BEARISH (the report's inputs did not verify) — the verdicts break if:**
- The user supplies the source that turns the `❓` claims into `✅` — the ledger is re-run, not amended by hand
- A mismatch is traced to a period or definition difference the report actually disclosed elsewhere (then it is a labelling issue, not a wrong number — downgrade to a note)
- The report is re-issued by its author with the corrected figures, in which case fact-check the new version, not the old

**Re-run this analysis when:**
- [ ] The company files its next 10-Q / 10-K, or any 8-K restating prior figures
- [ ] The report is edited or re-generated
- [ ] 90 days pass on any market-data claim
- [ ] Before the report is shared, published, or used to size a position
- [ ] `result-validator` scores Data Quality above what the ledger supports

## Standard Signal Output

This skill does **not** form a view on the stock. `Score` is always the **Verification Score**, and `Confidence` is capped at the tier it supports (≥ 8.0 HIGH · 6.0–7.9 MEDIUM · < 6.0 LOW). The other fields depend on the outcome:

- **Verification passed** (Score ≥ 4.0 **and no signal-driving cap fired** — `Caps fired: none`, or only the coverage / header caps): Signal, Horizon, Action, and Conviction **mirror the verified report's own**, and a line under the box states `Mirrors the report's signal — quoted, not re-derived`. If a signal-driving claim mismatched by more than 5%, add `Signal not supported at stated confidence — re-run the analysis with verified inputs`.
- **Verification failed** (Score < 4.0, **or** the signal-driving mismatch cap fired — even if the capped score reads exactly 4.0 — or a fabricated citation → 0): the box does **not** carry the report's Signal or Action forward — an unsupported BUY must not survive into the verification result. Fill `Signal: NEUTRAL · Action: HOLD · Conviction: WEAK · Confidence: LOW`, and under the box write `Verification failed — the report's own signal (BULLISH / BUY, quoted) is not supported by its inputs; do not act on it`.
- For a report with no signal block, fill Signal / Action / Conviction with `n/a`.

All analysis concludes with this standardized block:

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

**Note:** The Score above is the Verification Score — *how much of the report is demonstrably true* — mapped onto the standard scale for cross-skill comparability. When verification passes, Signal, Horizon, Action, and Conviction are the verified report's own, quoted unchanged; when it fails, they are replaced by NEUTRAL / HOLD / WEAK so that no unsupported call is carried forward.

**Disclaimer:** Educational analysis only. Not financial advice. Verification is limited to the sources available at run time; an unverifiable claim is neither confirmed nor refuted.
