# 10-K Report Digest

## ⚠️ Data Verification — Do This Before Any Analysis

Before running the digest, confirm the filing details:

1. **Identify the filing** — confirm ticker, fiscal year-end, and exact 10-K filing date from SEC EDGAR.
2. **State your source** — note where the document came from (e.g., "SEC EDGAR, FY2024 10-K filed 2025-02-05") at the top of the output.
3. **Flag incomplete data** — if only partial sections are available, list what is missing before proceeding.

> ⚠️ **Source unavailable.** If the full 10-K cannot be retrieved, display this warning and proceed only with the sections provided.

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

---

Produce a clean, structured markdown document that distills a company's 10-K annual report into an abstract, per-section summaries, a digest of key metrics, and full source references. Designed for quick comprehension — not trading signals. Output language is selectable: English or Traditional Chinese (繁體中文).

## 🔎 Retrieving the Filing — the Keyless EDGAR Path

This skill fetches nothing by itself. When the user gives only a ticker, obtain the 10-K in one of three ways and record which one in the `Data & Sources` header:

**A. The host can fetch URLs** → `Retrieval: web/tool retrieval`. Every step is free and needs no API key:

1. **Ticker → CIK** — `https://www.sec.gov/files/company_tickers.json`: find the entry whose `ticker` matches (write `BRK-B` for `BRK.B`) and zero-pad its `cik_str` to 10 digits.
2. **Filings index** — `https://data.sec.gov/submissions/CIK##########.json`: inside `filings.recent` the arrays `form`, `filingDate`, `reportDate`, `accessionNumber` and `primaryDocument` are aligned by index. Take the newest row whose `form` is `10-K` (foreign private issuers file `20-F` instead; a `10-K/A` is an amendment). The top-level `fiscalYearEnd` is `MMDD`.
3. **The document** — `https://www.sec.gov/Archives/edgar/data/<CIK without leading zeros>/<accessionNumber without dashes>/<primaryDocument>`: the complete filing as HTML (inline XBRL). The filing's index page is the same folder plus `<accessionNumber>-index.htm`; cite that URL and the accession number in the References.
4. **Structured statement data (optional)** — `https://data.sec.gov/api/xbrl/companyfacts/CIK##########.json`: every US-GAAP fact the company has tagged, by concept and period. Use it to confirm the figures read from Item 8.
5. **Full-text search (optional)** — `https://www.sec.gov/edgar/search/#/q=%22<phrase>%22&forms=10-K` when a filing has to be located by phrase rather than ticker.

Send a `User-Agent` header that identifies the requester (the SEC requires it, e.g. `Name email@example.com`) and stay under 10 requests per second. Never substitute a summary site for the filing itself.

**B. The host cannot fetch** → `Retrieval: pasted by user`. Ask the user to paste the sections needed — or, if they have the InvestSkill repository, to run

```
node scripts/fetch-edgar.js <TICKER> --form 10-K        # → data/filings/<TICKER>/*.txt + .json (accession, dates, URL)
node scripts/fetch-fundamentals.js <TICKER>             # → data/fixtures/<TICKER>.md — reconciled statements from the XBRL facts
```

and paste the result. Both helpers are optional, keyless, and live outside the plugin.

**C. Neither** → show the ⚠️ *Source unavailable* warning, set `Retrieval: model memory` and `Confidence: LOW`, and digest only what the user provided.

---

## How to Use

```
# Analyze by ticker (retrieves the latest 10-K via the EDGAR path above, or asks you to paste it)
10k-digest AAPL

# Paste 10-K text directly
10k-digest [paste 10-K sections here]

# Specify fiscal year
10k-digest MSFT FY2024

# Output in Traditional Chinese
10k-digest NVDA --lang zh-TW

# Save output to file
10k-digest GOOGL --output googl-10k-digest.md
```

---

## Output Document Structure

The skill produces a single markdown document with the following sections in order.

---

### 1. Cover Block

```
# [Company Name] ([TICKER]) — 10-K Digest
**Fiscal Year:** [FY20XX ending MM/DD/YYYY]
**Filed:** [Filing date]
**Source:** SEC EDGAR — [Direct URL to filing]
**Prepared:** [Today's date]
**Language:** English | 繁體中文
```

---

### 2. Abstract

A 3–5 sentence executive summary of the entire 10-K. Cover:
- What the company does (core business in one sentence)
- Year-over-year financial performance headline (revenue, profit, FCF)
- The single most important strategic development disclosed in this filing
- The most material risk disclosed
- Overall filing tone (transparent / cautious / optimistic)

---

### 3. Section Summaries

Summarize each major 10-K section. For each section, write 2–4 sentences capturing the substance — not just restating headings.

#### 3.1 Business Overview (Item 1)
- Core products/services and revenue model
- Key markets and customer segments
- Significant changes to business described in this filing (new products, acquisitions, divestitures)

#### 3.2 Risk Factors (Item 1A)
- Total number of risk factors disclosed
- Top 3 risks by disclosure prominence (listed first, given most space, or new this year)
- Any risks added or removed vs. prior filing (state "N/A if prior not available")
- One-line assessment: are risks standard boilerplate or specific and material?

#### 3.3 Selected Financial Data / Properties (Items 1B–2)
- Key quantitative highlights from Selected Financial Data if present
- Material properties or facilities disclosed

#### 3.4 Management's Discussion & Analysis — MD&A (Item 7)
- Revenue: total and YoY growth; organic vs. inorganic split if stated
- Gross margin and operating margin trend
- Management's stated explanation for performance changes
- Forward-looking statements: what management guided or projected
- Liquidity summary: cash position, debt level, upcoming maturities

#### 3.5 Financial Statements (Items 8)
- Revenue, net income, EPS (GAAP) — current year vs. prior year
- Operating cash flow and free cash flow (OCF minus capex)
- Total assets, total debt, shareholders' equity
- Auditor name and opinion type (unqualified / qualified / adverse)
- Any restatements or material changes in accounting policy noted

#### 3.6 Quantitative Disclosures about Market Risk (Item 7A)
- Primary market risks disclosed (interest rate, FX, commodity)
- Sensitivity disclosures if provided (e.g., "1% rate rise = $X impact")

#### 3.7 Controls and Procedures (Item 9A)
- Management's conclusion on effectiveness of internal controls
- Any material weaknesses or significant deficiencies disclosed

#### 3.8 Legal Proceedings (Item 3)
- Active material litigation or regulatory matters
- Estimated financial exposure if disclosed

#### 3.9 Executive Compensation & Governance (Items 10–13, from Proxy if incorporated)
- CEO/CFO compensation summary
- Board composition notes (independence, tenure)
- Any significant governance changes

---

### 4. Key Metrics Table

Provide a concise metrics table drawn directly from the financial statements. Use exact figures from the filing; do not estimate.

```
| Metric                    | Current FY      | Prior FY        | YoY Change |
|---------------------------|-----------------|-----------------|------------|
| Revenue                   | $X.XX B         | $X.XX B         | +X.X%      |
| Gross Profit              | $X.XX B         | $X.XX B         | +X.X%      |
| Gross Margin %            | XX.X%           | XX.X%           | +X bps     |
| Operating Income          | $X.XX B         | $X.XX B         |            |
| Operating Margin %        | XX.X%           | XX.X%           |            |
| Net Income (GAAP)         | $X.XX B         | $X.XX B         |            |
| EPS Diluted (GAAP)        | $X.XX           | $X.XX           |            |
| Operating Cash Flow       | $X.XX B         | $X.XX B         |            |
| Capital Expenditures      | $X.XX B         | $X.XX B         |            |
| Free Cash Flow            | $X.XX B         | $X.XX B         |            |
| Cash & Equivalents        | $X.XX B         | $X.XX B         |            |
| Total Debt                | $X.XX B         | $X.XX B         |            |
| Net Debt / (Net Cash)     | $X.XX B         | $X.XX B         |            |
| Shares Outstanding (dil.) | X.XX B          | X.XX B          |            |
```

Note below the table: data source (filing section and page number if available).

---

### 5. Highlights & Concerns

Two short lists that give the reader the "so what" without leaving the digest. Draw every item directly from the filing and cite the source Item.

**Highlights** — up to 5 of the strongest positives disclosed this year (e.g., record revenue, margin expansion, new products/segments, strong FCF conversion, new buyback authorization, market-share gains). Format: `- **[Headline]** — [one sentence] *(Item X)*`

**Concerns** — up to 5 of the most material negatives or warning signs (e.g., decelerating growth, margin compression, rising leverage, customer/supplier concentration, new risk factors, active litigation, going-concern language). Format: `- **[Headline]** — [one sentence] *(Item X)*`

---

### 6. Management Outlook & Forward Guidance

Capture every forward-looking commitment made in the filing. Present as a table.

```
| Guidance Item              | What Management Said                | Time Horizon | Source     |
|----------------------------|-------------------------------------|--------------|------------|
| Revenue growth             | [target / range / directional]      | [FY / multi] | Item 7     |
| Margin target              | [gross / operating target]          | [horizon]    | Item 7     |
| Capex / capacity           | [planned spend or expansion]        | [horizon]    | Item 7     |
| Capital allocation         | [dividend / buyback / debt / M&A]   | [horizon]    | Item 7/8   |
| Strategic priorities       | [product roadmap, new markets]      | [horizon]    | Item 1/7   |
```

Only include rows the filing actually addresses. If the 10-K gives no explicit guidance (common — 10-Ks are backward-looking), state that and summarize any qualitative forward statements instead.

---

### 7. Prior-Year Promise Tracker

An accountability audit: take the forward-looking statements, targets, and stated priorities from **last year's** 10-K (Item 7 MD&A) and score whether they materialized in this year's results. This is the single most differentiating part of the digest — it measures management credibility over time.

```
| Prior-Year Commitment (FY[N-1] 10-K)   | FY[N] Actual Result          | Verdict     | Notes            |
|-----------------------------------------|------------------------------|-------------|------------------|
| [what management said they would do]    | [what actually happened]     | ✅ Delivered | [brief context]  |
| [e.g., "expand operating margin"]       | [e.g., "margin +120 bps"]    | 🟡 Partial  | [brief context]  |
| [e.g., "launch product X in H2"]        | [e.g., "slipped to next FY"] | ❌ Missed    | [brief context]  |
```

Verdict legend: ✅ Delivered · 🟡 Partial · ❌ Missed · ⏳ Too early to judge.

Close with a one-line **Management Credibility read**: e.g., "4/5 prior commitments delivered — high follow-through." If the prior-year 10-K is unavailable, state `N/A — prior filing not retrieved` and skip the table.

---

### 8. Bull vs. Bear Synthesis

A lightweight face-off built strictly from evidence in this filing — not a full valuation call (defer to `bear-case`, `stock-eval`, and `stock-valuation` for that).

**Bull case** — 3–4 strongest points from this filing supporting the stock.

**Bear case** — 3–4 strongest points from this filing arguing against it.

**Net read** — one sentence weighing the two, consistent with the Investment Signal below.

---

### 9. Notable Disclosures

Bullet list of up to 8 items that are worth investor attention but don't fit neatly into section summaries:
- New segment or business unit disclosures
- Changes in accounting estimates or policies
- Related party transactions
- Auditor changes
- Going concern language (if any)
- New share repurchase authorizations or dividend changes
- Material acquisitions or divestitures announced
- Specific named customers or suppliers with concentration risk

---

### 10. Source References

List all sources cited in this digest. Format:

```
## References

1. **SEC EDGAR Filing** — [Company] 10-K, FY[XXXX]
   URL: https://www.sec.gov/cgi-bin/browse-edgar?...
   Filed: [Date] | Accession No.: [XXXXXXXXXX-XX-XXXXXX]

2. **Item 1 — Business** (pp. X–X of filing)
3. **Item 1A — Risk Factors** (pp. X–X of filing)
4. **Item 7 — MD&A** (pp. X–X of filing)
5. **Item 8 — Financial Statements** (pp. X–X of filing)
6. **Item 9A — Controls and Procedures** (pp. X–X of filing)
7. **Exhibit 13 / Annual Report to Shareholders** (if incorporated by reference)
8. [Any additional sources used, e.g. earnings press release, investor presentation]
```

If page numbers are unavailable (e.g., pasted text), reference by Item number and section heading.

---

## Language Mode

When `--lang zh-TW` is specified, output the **entire document** in Traditional Chinese (繁體中文), including:
- All section headings translated
- All narrative summaries written in Traditional Chinese
- All tables with Chinese column headers
- Cover block language field: `語言：繁體中文`
- Keep ticker symbols, financial figures, and SEC item numbers in their original form

Suggested Traditional Chinese headings for the interpretation sections: 亮點與隱憂 (Highlights & Concerns), 管理層展望 (Management Outlook & Forward Guidance), 上年度承諾兌現 (Prior-Year Promise Tracker), 多空對決 (Bull vs. Bear Synthesis).

English mode is the default when no `--lang` flag is given.

---

## File Output

When `--output <filename>` is specified:
- Save the digest as a markdown file at the specified path
- If no path separator is present, save in the current directory
- Confirm the file path after saving: `✓ Digest saved to: <path>`
- Default filename if `--output` flag is present without a name: `<TICKER>-10k-digest.md`

---

## Thesis Invalidation

After delivering the digest, note what would make this document stale:

**Re-run this digest when:**
- [ ] Company files next 10-K or 10-K/A amendment
- [ ] Material 8-K filed disclosing a restatement or auditor change
- [ ] 12 months have elapsed since the filing date

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
