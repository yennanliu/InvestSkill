# Demos — Real Runs, Real Screenshots

These demos show InvestSkill working on real stocks. Every one was run for real on **2026-10-11**, using SEC filings downloaded with the repo's keyless helpers and the **2026-10-09 NASDAQ close**. Each page goes step by step: the command, a screenshot of the actual output, what to notice in it, and the result. The complete, unedited outputs sit at the bottom of every page, so you can check that nothing was cherry-picked.

> **New here?** Start with the [Live Walkthrough](WALKTHROUGH.md) ([繁體中文](WALKTHROUGH-zh-TW.md)). It runs four skills on Microsoft and explains the method in the most detail.

> **Educational only — not investment advice.** Figures are as of the dates shown and go stale quickly.

---

## Pick a demo

| Demo | Language | What it shows | Skills | Headline result |
|------|----------|---------------|--------|-----------------|
| [**Live Walkthrough — MSFT**](WALKTHROUGH.md) | English · [繁體中文](WALKTHROUGH-zh-TW.md) | The method, step by step: data → evaluate → red team → fact-check → learn | 4 | NEUTRAL · 5.5 · HOLD |
| [**META 10-K Deep Dive**](FULL-DEMO-META.md) | English | Six skills chained over one annual report | 6 | NEUTRAL · 5.6 · HOLD |
| [**NVDA 10-K Deep Dive**](FULL-DEMO-NVDA.md) | English | Read the filing, then fact-check the reading | 2 | BULLISH · 6.8 · HOLD |
| [**AMD 10-K 深度解析**](FULL-DEMO-AMD.md) | 繁體中文 | The same two steps on AMD, in Traditional Chinese | 2 | NEUTRAL · 5.5 · HOLD |
| [**PLTR Full Demo**](FULL-DEMO-PLTR.md) | English | Ten skills across four questions: business, price, market, risk | 10 | NEUTRAL · 4.5 · HOLD (stock-eval) |
| [**RKLB 完整示範**](FULL-DEMO-RKLB.md) | 繁體中文 | The same ten skills on Rocket Lab, in Traditional Chinese | 10 | NEUTRAL · 4.2 · HOLD (stock-eval) |

**Which one should I read?**

- **"How do I use this?"** → the [Live Walkthrough](WALKTHROUGH.md).
- **"I have a 10-K and want to understand it."** → [META](FULL-DEMO-META.md) (many skills on one filing) or [NVDA](FULL-DEMO-NVDA.md) / [AMD](FULL-DEMO-AMD.md) (one deep read, then verify).
- **"I want everything on one stock."** → [PLTR](FULL-DEMO-PLTR.md) or [RKLB](FULL-DEMO-RKLB.md).
- **"I want to see several stocks in one linked report."** → the showcase below.

---

## The showcase — one basket, eight linked pages (繁體中文)

The [**InvestSkill showcase**](https://yennj12.js.org/InvestSkill-test/showcase/index.html) lives in the sibling repo [`InvestSkill-test`](https://github.com/yennanliu/InvestSkill-test). It runs the frameworks on a four-stock basket — MU, SKHY, MRVL and SNDL, which all fell 7.8–9.6% on the same day — from **one data snapshot dated 2026-07-29**, and is written in Traditional Chinese.

| Page | What it shows |
|------|---------------|
| [Hub](https://yennj12.js.org/InvestSkill-test/showcase/index.html) | The question the basket poses, and a map of which framework is used where |
| [MU](https://yennj12.js.org/InvestSkill-test/showcase/mu.html) | A 15-module `full-report`, with `bear-case`, `position-ladder` and `result-validator` |
| [Screener](https://yennj12.js.org/InvestSkill-test/showcase/screener.html) | `stock-screener` with the raw input beside every one of 22 sub-scores |
| [Workflows A–G](https://yennj12.js.org/InvestSkill-test/showcase/workflows.html) | The seven cookbook workflows; two stop at their first gate, which is the right answer |
| [Supply chain](https://yennj12.js.org/InvestSkill-test/showcase/supply-chain.html) | `industry-map` on the HBM value chain |

What to look for: every page quotes the same prices, every score sits beside its input, and three data defects are left in on purpose so `result-validator` has something to catch (one report declines to give a price target).

> **Read the dates.** The showcase was built on InvestSkill **v1.11.0** (27 frameworks) and its figures are as of 2026-07-29 — it shows the method, not current numbers or the current catalogue. To produce the same shape on your own basket, use [`basket-report`](skill-basket-report.html) (Cookbook, Workflow J).

---

## How the demos were made

Every demo follows the same recipe, so you can reproduce any of them.

**1 · Get primary-source data (no API key).**

```bash
export EDGAR_USER_AGENT="Your Name you@example.com"
npm run fetch:edgar -- META --form 10-K     # full filing text → data/filings/META/
npm run fetch:fundamentals -- META          # reported figures → data/fixtures/META.md
# then add the latest close on the pack's `price:` line (the SEC carries no prices)
```

**2 · Run each skill headless, with limited tools.**

| Demo type | Tools allowed | Why |
|-----------|---------------|-----|
| 10-K deep dives (META, NVDA, AMD) | Read files only | The filing is the whole story; no browsing means no figures from memory or stale web pages |
| Full demos (PLTR, RKLB) | Read + web search + web fetch | Price history, Form 4 trades, short interest and transcripts aren't in filings; every web figure must be dated and sourced |

```bash
claude -p "/us-stock-analysis:financial-report-analyst META — use only data/filings/META/META_2026_10-K.txt and data/fixtures/META.md" --allowedTools Read
```

**3 · Check the result with a second skill.** Each demo ends with `fact-check` or `result-validator` run over an earlier output.

**4 · Screenshot real output.** Screenshots are rendered from the saved output text, with omitted lines marked "… (lines omitted for length)". Nothing inside an excerpt is edited.

---

## What the demos have in common

1. **Every output starts with a `Data & Sources` header** — where each number came from, its date, and how far to trust it.
2. **Skills say "unavailable" instead of guessing.** When a figure isn't in the files (or can't be found), the output says so.
3. **Skills disagree, and say why.** On PLTR, `stock-eval` says HOLD, `stock-valuation` says SELL, and `technical-analysis` says BUY on a pullback: three time horizons, three answers, all explained.
4. **They catch data problems.** In the 10-K demos, the analyst corrected the SEC data pack every time: an SG&A line that was really G&A (META), a net-debt line that ignored $52B of securities (NVDA), an FCF figure that included discontinued operations (AMD).
5. **Every call comes with exit conditions.** Each output lists what would flip its signal.

---

## Earlier demos

The previous demos (June–July 2026) were long single-document reports produced from data supplied in the prompt. They have been replaced by these re-runs, which use fresh SEC data, current prices and the current skill set, and show every step. The old versions remain in the [git history](https://github.com/yennanliu/InvestSkill/commits/main/site/content).

---

**Disclaimer:** Educational content only. Not financial advice.
