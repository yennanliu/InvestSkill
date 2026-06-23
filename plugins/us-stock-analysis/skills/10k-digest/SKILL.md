---
description: Deep-read a 10-K annual report and output a structured markdown digest — abstract, section summaries, key metrics, and sourced references. Output in English or Traditional Chinese.
---

# 10-K Report Digest

## ⚠️ Data Verification — Do This Before Any Analysis

Before running the digest, confirm the filing details:

1. **Identify the filing** — confirm ticker, fiscal year-end, and exact 10-K filing date from SEC EDGAR.
2. **State your source** — note where the document came from (e.g., "SEC EDGAR, FY2024 10-K filed 2025-02-05") at the top of the output.
3. **Flag incomplete data** — if only partial sections are available, list what is missing before proceeding.

> ⚠️ **Source unavailable.** If the full 10-K cannot be retrieved, display this warning and proceed only with the sections provided.

---

Produce a clean, structured markdown document that distills a company's 10-K annual report into an abstract, per-section summaries, a digest of key metrics, and full source references. Designed for quick comprehension — not trading signals. Output language is selectable: English or Traditional Chinese (繁體中文).

## How to Use

```
# Analyze by ticker (fetches latest 10-K)
/10k-digest AAPL

# Paste 10-K text directly
/10k-digest [paste 10-K sections here]

# Specify fiscal year
/10k-digest MSFT FY2024

# Output in Traditional Chinese
/10k-digest NVDA --lang zh-TW

# Save output to file
/10k-digest GOOGL --output googl-10k-digest.md
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

### 5. Notable Disclosures

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

### 6. Source References

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
