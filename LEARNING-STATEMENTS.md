# Reading Financial Statements

> Every company tells its story in three financial statements. This lesson teaches you to read them the way an investor does — what each one answers, how the numbers connect, and where the honest signal (and the warning signs) hide. No accounting degree required.

**What you'll learn**

- The three core statements and the single question each one answers
- How to walk down an income statement line by line, and what the three margins tell you
- How the balance sheet snapshots what a company owns, owes, and is worth
- Why cash flow — especially free cash flow — is often more honest than profit
- How the three statements lock together, and where to find them (10-K and 10-Q filings)
- The most common red flags that separate real earnings from flattering accounting

---

## The three statements, at a glance

Think of a company as a shop you part-own. You'd want to know three different things: *Did it make money this year? What does it own and owe right now? And did real cash actually come in?* Each statement answers one of those.

| Statement | The question it answers | Time frame | Analogy |
|-----------|------------------------|-----------|---------|
| **Income statement** | Was the business *profitable* over a period? | A span (quarter/year) | A video of the season |
| **Balance sheet** | What is the *financial position* right now? | A single moment | A photo taken on one day |
| **Cash flow statement** | Where did *cash actually move*? | A span (quarter/year) | Your bank statement |

> **Key idea:** The income statement can show a profit while the bank account shrinks. That's not a contradiction — it's the whole reason you read all three together.

*In the plugin:* the `financial-report-analyst` skill extracts investment insights from a 10-K or 10-Q; `10k-digest` produces a structured digest of a full annual report; `fundamental-analysis` turns these statements into ratios; and `earnings-call-analysis` reads management's spoken commentary alongside the numbers.

---

## The income statement: profitability over a period

The income statement (also called the P&L, for profit and loss) starts with sales at the top and subtracts costs step by step until you reach profit at the bottom — which is why revenue is called the "top line" and net income the "bottom line."

### Line by line

| Line | What it means |
|------|---------------|
| **Revenue** (sales) | Money earned from selling the product or service |
| − **COGS** (cost of goods sold) | Direct cost of making what was sold |
| = **Gross profit** | What's left to cover everything else |
| − **Operating expenses** (SG&A, R&D) | Running the business: selling, admin, research |
| = **Operating income (EBIT)** | Profit from core operations, before financing and tax |
| − **Interest & taxes** | Cost of debt, then the government's cut |
| = **Net income** | The bottom line — profit that belongs to shareholders |
| ÷ shares | = **EPS** (earnings per share) |

Two abbreviations to keep: **COGS** = the direct cost of the goods sold; **SG&A** = selling, general & administrative expenses (overhead like salaries, marketing, rent); **R&D** = research and development; **EBIT** = earnings before interest and taxes.

### The three margins

A margin is just a profit line divided by revenue — it turns dollars into a comparable percentage, so a corner store and a giant can be judged on the same scale.

| Margin | Formula | What it tells you |
|--------|---------|-------------------|
| **Gross margin** | `Gross profit ÷ Revenue` | Pricing power and product economics |
| **Operating margin** | `EBIT ÷ Revenue` | Efficiency of the core business |
| **Net margin** | `Net income ÷ Revenue` | What finally reaches shareholders |

### A tiny worked example (illustrative, round numbers)

| Line | Amount |
|------|-------:|
| Revenue | $1,000 |
| − COGS | $600 |
| **Gross profit** | **$400** |
| − SG&A and R&D | $250 |
| **Operating income (EBIT)** | **$150** |
| − Interest & taxes | $50 |
| **Net income** | **$100** |

Here gross margin = 400 ÷ 1,000 = **40%**, operating margin = 150 ÷ 1,000 = **15%**, and net margin = 100 ÷ 1,000 = **10%**. If this company has 50 shares outstanding, EPS = 100 ÷ 50 = **$2.00**.

> **Key idea:** Rising margins usually mean pricing power or scale; falling margins mean competition, cost inflation, or a weakening business. The *trend* matters more than any single year.

---

## The balance sheet: financial position at a moment

The balance sheet is a photo of what the company owns and owes on one specific day. It always obeys one equation:

`Assets = Liabilities + Equity`

In plain terms: everything the company owns was paid for either with borrowed money (liabilities) or owners' money (equity). The two sides must balance — hence the name.

### Current vs. non-current

- **Current** items convert to (or come due in) cash within a year: cash, receivables (money customers owe you), inventory; and on the other side, bills and short-term debt.
- **Non-current** items are longer-lived: factories and equipment, long-term debt, intangibles.

Two quantities investors watch:

- **Working capital** = `Current assets − Current liabilities`. It's the short-term cushion — can the company cover the next year's obligations with the next year's cash?
- **Shareholders' equity** (also **book value**) = `Assets − Liabilities`. It's the accounting net worth — what would theoretically remain for owners if the company sold everything and paid off all debt.

**Debt** deserves its own look: modest debt can boost returns, but too much makes a company fragile when sales dip or interest rates rise. You'll judge it against earnings and cash flow, not in isolation.

> **Key idea:** The income statement shows the season's performance; the balance sheet shows the accumulated result of every season that came before.

---

## The cash flow statement: where cash actually moved

Profit is an opinion; cash is a fact. The cash flow statement strips away accounting judgment and tracks real money moving in and out, in three buckets:

| Section | What it captures | Sign you want |
|---------|-----------------|---------------|
| **CFO** — Operations | Cash from running the core business | Positive and growing |
| **CFI** — Investing | Cash spent on/from assets, incl. **capex** | Usually negative (investing to grow) |
| **CFF** — Financing | Cash from/to lenders and shareholders (debt, dividends, buybacks) | Depends on the strategy |

**Capex** (capital expenditure) is spending on long-lived assets — factories, servers, equipment. It sits inside CFI.

### Free cash flow — the number that's hard to fake

`Free cash flow (FCF) = CFO − capex`

FCF is the cash left over after the business pays to keep itself running *and* invests to stay competitive. It's the money truly available to pay down debt, pay dividends, buy back shares, or reinvest. Because it's built from actual cash movements — not accounting estimates — it's much harder to dress up than net income.

> **Key idea:** A company can report rising net income for years while FCF stays flat or negative. When profit and cash diverge, trust the cash — and ask *why* they diverge.

---

## Accrual vs. cash accounting: why profit ≠ cash

Companies keep their books on an **accrual** basis: they record revenue when it's *earned* and costs when they're *incurred* — not when cash changes hands. If you ship $100 of goods in December but the customer pays in January, December's income statement shows the $100 sale even though no cash arrived yet.

Accrual accounting gives a truer picture of economic activity in a period. But it also opens a gap between reported profit and real cash — and that gap is both a source of **insight** (it reveals timing) and a source of **manipulation risk** (aggressive firms can book revenue early or push costs out to flatter profit).

That's exactly why the cash flow statement exists: it reconciles the accrual profit back to actual cash.

---

## How the three statements connect

The statements are not three separate reports — they're three views of one system, and they tie together:

- **Net income** (bottom of the income statement) flows *into equity* on the balance sheet (as retained earnings) and *starts* the cash flow statement (the top line of CFO).
- **Capex** (a cash outflow in CFI) *adds an asset* to the balance sheet, which then depreciates over time — and that depreciation shows up as an expense back on the income statement.
- Cash generated across CFO + CFI + CFF changes the **cash** balance you see on the balance sheet.

> **Key idea:** If someone hands you just one statement, you're seeing one angle of a three-dimensional object. Real analysis triangulates all three.

---

## Where to find them: 10-K and 10-Q

US-listed companies file these statements with the SEC (the Securities and Exchange Commission, the US market regulator):

| Filing | Frequency | Depth |
|--------|-----------|-------|
| **10-K** | Annual | Full, audited, with detailed footnotes and risk factors |
| **10-Q** | Quarterly | Lighter, unaudited, three per year (the 4th quarter rolls into the 10-K) |

Don't skip the **footnotes**. That's where the accounting choices, debt terms, lease obligations, one-off items, and pending lawsuits are disclosed — often the most revealing part of the whole document.

*In the plugin:* point `10k-digest` at an annual report to get a section-by-section summary with key metrics, or use `financial-report-analyst` to pull actionable insights from a 10-K or 10-Q directly.

---

## Common red flags

Once you can read the three statements together, patterns of trouble stand out:

| Red flag | Why it worries an investor |
|----------|---------------------------|
| Revenue rising but **FCF shrinking** | Growth isn't turning into real cash |
| **Receivables growing faster than sales** | Sales may be booked before cash is collected — or customers can't pay |
| **Inventory piling up** vs. sales | Product isn't selling; write-downs may be coming |
| Profit propped up by **one-off items** | A gain from selling a building isn't repeatable earnings |
| **Debt ballooning** with flat earnings | Rising fragility; interest will eat future profit |

None of these is a verdict by itself — each is a *question to investigate* in the footnotes and the cash flow statement. `fundamental-analysis` computes the ratios that surface these patterns quickly.

---

## Key takeaways

- Three statements, three questions: income = *profitable?*, balance sheet = *position now?*, cash flow = *did cash really move?*
- Walk the income statement top to bottom; the three margins (gross, operating, net) turn dollars into comparable percentages.
- The balance sheet always balances: `Assets = Liabilities + Equity`; watch working capital and debt.
- `Free cash flow = CFO − capex` is often more honest than net income — when they diverge, trust the cash and ask why.
- Read the 10-K and 10-Q footnotes, and treat red flags as questions to investigate, not automatic verdicts.

---

> **Next / Related** — Previous: [Investing Foundations](learning-foundations.html). Next: [Judging Business Quality](learning-quality.html). See also the [Glossary](glossary.html) and [Concepts & Mental Models](concepts.html) for definitions and the thinking behind the numbers, or browse all [Learning lessons](learning.html).

*Educational content only. Not financial advice.*
