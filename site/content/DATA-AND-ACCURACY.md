# Data, Accuracy & Responsible Use

> The most important page on this site. InvestSkill makes an AI *reason like an analyst* — but it is only as good as the data you feed it and the scrutiny you apply. This page explains where the numbers come from, how to spot when they're wrong, and the limits you must respect.

**On this page:** [How the skills get data](#how-the-skills-get-data) · [Recommended data sources](#recommended-data-sources) · [Bring your own data: the keyless EDGAR path](#bring-your-own-data-the-keyless-edgar-path) · [Spotting hallucinated numbers](#spotting-hallucinated-numbers) · [Validating AI output](#validating-ai-output) · [Limitations & responsible use](#limitations--responsible-use)

---

## How the Skills Get Data

**InvestSkill does not fetch data itself.** There is no runtime, no API, no live feed inside the plugin — every skill is a *prompt* that tells the AI how to reason. The data comes from one of two places:

1. **What you paste in** — 10-K excerpts, earnings transcripts, your holdings, a financials table. This is the most reliable path because *you* control the source.
2. **What the host AI can access** — if your assistant has web/search/tool access (e.g. Claude with web search, a connected data tool), it may retrieve figures itself. This is convenient but **must be verified** — the model may use stale, approximate, or misattributed numbers.

> **Consequence:** if you ask "evaluate AAPL" with no data and no tool access, the model answers from training memory — which is dated and may be wrong. Always anchor the analysis with current, primary-source data.

**This is also why InvestSkill is free and needs no API key.** There is no data feed to subscribe to and no endpoint to authenticate against — you never enter a key, and the frameworks cost nothing to run beyond the AI assistant you already use (including free tiers and offline local models). The trade-off is the one above: *you* are responsible for putting good data in front of the model.

---

## The Data & Sources Header

Because output quality depends entirely on *where the numbers came from*, every analysis should declare its provenance up front. Ask for — and expect — a **Data & Sources** block like this at the top of any report:

```
Data & Sources
  As of:      2026-07-02
  Source:     SEC EDGAR 10-K (FY2025) · company IR · FRED
  Retrieval:  pasted by user   (or: web/tool retrieval · model memory)
  Confidence: HIGH — primary-source, current
```

| Field | What it tells you |
|-------|-------------------|
| **As of** | The date the figures represent — anything stale should be flagged |
| **Source** | The primary document(s) behind the numbers |
| **Retrieval** | How they reached the model: *pasted* (most reliable) → *web/tool* (verify) → *model memory* (least reliable, treat as approximate) |
| **Confidence** | HIGH (primary-source, current) · MEDIUM (mixed/secondary) · LOW (memory or missing data) |

> **Rule of thumb:** if the Retrieval line says "model memory," treat every number as a placeholder until you confirm it against a primary source. Composite reports (`full-report`, `research-bundle`) should always carry this header **and** end with a [`result-validator`](#validating-ai-output) pass.

---

## Recommended Data Sources

| Need | Primary source |
|------|----------------|
| Financial statements, 10-K / 10-Q / 8-K | [SEC EDGAR](https://www.sec.gov/edgar) (free, authoritative) |
| Earnings call transcripts | Company IR site, transcript providers |
| Insider transactions (Form 4) | SEC EDGAR |
| Institutional holdings (13F) | SEC EDGAR |
| Price / volume / technicals | Your brokerage, charting platforms |
| Dividends history | Company IR, dividend trackers |
| Macro indicators | Central bank / statistics-agency releases (e.g. FRED) |

**Best practice:** copy the actual figures into the prompt (or point a tool-enabled assistant at the filing) rather than relying on the model's recall. For filings, `financial-report-analyst` is built to ingest pasted 10-K/10-Q sections directly.

---

## Bring Your Own Data: The Keyless EDGAR Path

"No API key" is a design choice, not a dead end. Everything a filing-based skill needs is published by the SEC for free, without registration. There are three ways to get it in front of the model — pick the first one that fits your setup, and say which one you used in the `Data & Sources` header.

### 1. Let a tool-enabled assistant fetch the filing (`Retrieval: web/tool retrieval`)

`10k-digest`, `financial-report-analyst` and `fact-check` now carry this recipe, so an assistant with web access can follow it on its own:

| Step | URL | What you get |
|------|-----|--------------|
| Ticker → CIK | `https://www.sec.gov/files/company_tickers.json` | the entry whose `ticker` matches (`BRK-B` for `BRK.B`); zero-pad `cik_str` to 10 digits |
| Filings index | `https://data.sec.gov/submissions/CIK##########.json` | `filings.recent.form` · `filingDate` · `reportDate` · `accessionNumber` · `primaryDocument`, aligned by index — take the newest `10-K` / `10-Q` / `8-K` / `DEF 14A` / `4` (Form 4s are filed under the issuer's CIK too) |
| Institutional holdings | the *manager's* CIK, not the company's — or `https://www.sec.gov/edgar/search/#/q=%22<company or CUSIP>%22&forms=13F-HR` | `13F-HR` is filed by the investment manager, so it never appears under the target company; verify a position in the manager's information table by the target's CUSIP |
| The document | `https://www.sec.gov/Archives/edgar/data/<CIK>/<accession without dashes>/<primaryDocument>` | the full filing as HTML; the same folder's `<accession>-index.htm` lists every exhibit |
| Statement facts | `https://data.sec.gov/api/xbrl/companyfacts/CIK##########.json` | every US-GAAP figure the company has tagged, by concept and period — the fastest way to cross-check Item 8 |
| Full-text search | `https://www.sec.gov/edgar/search/#/q=%22<phrase>%22&forms=10-K` | locate a filing by phrase when you don't have the ticker |

Two SEC rules apply to any automated client: send a `User-Agent` that identifies you (`Name email`), and stay under 10 requests per second. Foreign private issuers file `20-F` (annual) and `6-K` (interim) instead of `10-K` / `10-Q`.

### 2. Download it yourself, then paste (`Retrieval: pasted by user`)

If your assistant cannot browse — a local model, a chat UI without tools — the repository ships two **optional, zero-dependency Node scripts** that walk the same path for you. They are not part of the plugin, call no vendor, and need only Node ≥ 18:

```bash
# The filing itself, as HTML + plain text you can paste, plus a .json with the header fields
node scripts/fetch-edgar.js AAPL --form 10-K            # → data/filings/AAPL/AAPL_2025_10-K.txt
node scripts/fetch-edgar.js AAPL --form 10-Q --limit 2  # the last two quarters
node scripts/fetch-edgar.js TSLA --form "DEF 14A"       # proxy statement
node scripts/fetch-edgar.js PLTR --form 4 --limit 10 --list

# A reconciled statement data pack from the XBRL facts (income statement, balance sheet, cash flow,
# current + prior fiscal year, derived FCF / net debt / margins) — same shape as the eval fixture
node scripts/fetch-fundamentals.js AAPL                 # → data/fixtures/AAPL.md
```

Set `EDGAR_USER_AGENT="Your Name your@email"` first — the SEC asks every client to identify itself. Downloads land in `data/filings/` and generated packs in `data/fixtures/`, both git-ignored: they are *your* working data, and real numbers go stale. The XBRL pack deliberately has **no price line** — the SEC publishes no quotes — so add today's price from your broker before asking for P/E, market cap or yield.

### 3. Paste what you already have

A 10-K PDF from the company's IR site, a broker statement, a spreadsheet export: paste the sections, or upload the file where your assistant supports it. Label it `Retrieval: pasted by user`; the skills treat it as a Tier-1 *user-supplied* source and stop verification at your document.

> **What none of these change:** InvestSkill still has no runtime and never sees your data. The recipe and the scripts only shorten the distance between a primary source and the prompt.

---

## Spotting Hallucinated Numbers

AI can state wrong figures *confidently*. Watch for these tells:

- **Suspiciously round or "too clean" numbers** (exactly 15.0% margin, $100.0B revenue).
- **Figures that don't reconcile** — e.g. an EPS that doesn't match the stated net income ÷ share count.
- **Stale prices or market caps** that don't match today's quote.
- **Metrics with no source** when you didn't provide the underlying data.
- **A confidence level that doesn't match the data** — HIGH confidence on a stock you gave zero data for is a red flag in itself.

**Quick reconciliation checks you can do by hand:**

| Check | Does it hold? |
|-------|---------------|
| EPS × shares ≈ Net income | If not, one number is wrong |
| Dividend ÷ price ≈ stated yield | Catches yield errors |
| Operating cash flow − CapEx ≈ FCF | Catches cash-flow fabrication |
| P/E × EPS ≈ price | Catches valuation drift |

If a number fails its own arithmetic, discard the whole section and re-run with explicit data.

---

## Validating AI Output

Two skills do this job, and they answer different questions:

- **`fact-check` — are the inputs true?** It pulls every figure and factual claim out of a report into a ledger, checks each against a primary source (the SEC filing, the IR release, FRED, the issuer's data, or the document you pasted), recomputes every derived number, and hands back a corrected copy with inline citations `[n]` and a References section — plus a Verification Score. Unverifiable claims stay marked `[?]`; nothing is silently changed and no source is ever invented.
- **`result-validator` — is the analysis well built?** Methodology, signal consistency, risk coverage, reasoning transparency — a confidence score for the *reasoning*. Its Data Quality dimension should never exceed what the fact-check score supports.

Run them in that order when the stakes are real: `fact-check` first, then `result-validator`.

```
/fact-check            ← paste the report (and its sources) — get the ledger, the corrected copy, the citations
/result-validator      ← paste the analysis output (or the composite signal block)
```

`result-validator` is a first-class step, not a nicety. Promote it from "tip" to "habit":

**When to run it:** after any high-stakes analysis, *always* after a composite (`research-bundle`, `full-report`), and whenever the signal feels too good.

**What it scores:** data quality, methodology soundness, and signal consistency — returning a confidence score and a list of gaps.

```
/result-validator      ← paste the analysis output (or the composite signal block)
```

**Manual sanity-check checklist** (do this even when you can't run the validator):

- [ ] **Do the numbers reconcile?** (use the table above)
- [ ] **Is the data current?** Check the price/date against today.
- [ ] **Does the signal match the narrative?** A BULLISH box atop a paragraph full of risks is incoherent.
- [ ] **Does confidence match the evidence?** Thin data should mean lower confidence.
- [ ] **Do the sub-signals agree?** In a composite, disagreement should lower confidence and be called out — not averaged away.
- [ ] **Did I provide the data, or did the model invent it?**

---

## Limitations & Responsible Use

**This is educational tooling, not financial advice.** Use it to *structure your own thinking*, not to outsource your decisions.

- **Not financial advice.** No skill knows your goals, taxes, risk tolerance, or time horizon. Output is a framework, not a recommendation.
- **Model-dependent.** The same prompt yields different results across models and versions. Use the most capable model you have and cross-check.
- **No real-time guarantee.** Unless your assistant has live tool access, figures may be stale. Verify against primary sources.
- **Signal blocks are decision *aids*.** They compress a lot of judgment into one box — they don't replace reading the analysis, the filings, and the risks.
- **Primary sources win.** When the AI and a filing disagree, the filing is right.
- **You own the decision.** Consider consulting a licensed financial professional for personal investment decisions.

> **The one rule:** never act on a signal block you haven't reconciled against real data and pressure-tested for the bear case. The frameworks make you faster; they don't make you right.

---

> **See also:** [Concepts → Anatomy of the signal block](concepts.html#anatomy-of-the-signal-block) · [Use Cases → Anti-patterns](use-cases.html#anti-patterns-how-analyses-go-wrong) · [Glossary](glossary.html).

*Educational content only. Not financial advice.*
