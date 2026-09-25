# InvestSkill — Improvement Roadmap

*Review date: 2026-09-23 · Reviewed at v1.11.0 · 27 skill directories / 26 advertised frameworks · 389 tests passing · 69 built site pages · **Progress tracked in §0** (last updated 2026-09-24, PR #27)*

> **Scope.** A product review of InvestSkill from two angles: as an **investment tool** for US-stock investors, and as a **way to learn finance**. It proposes new LLM skills, enhancements to existing skills, website content, and missing scripts, and lists the consistency issues found along the way. Recommendations only — no skill, prompt, or site page was changed in this PR.
>
> 繁體中文版：[IMPROVEMENT-ROADMAP-zh-TW.md](IMPROVEMENT-ROADMAP-zh-TW.md)
>
> This document complements the two earlier reviews — [qa/PROJECT-REVIEW.md](../qa/PROJECT-REVIEW.md) (2026-07-02, structure & consistency) and [SITE-ENRICHMENT-REVIEW.md](SITE-ENRICHMENT-REVIEW.md) (2026-06-15, site content). Most of their P0/P1 items have shipped (glossary, concepts, skill picker, per-skill pages, search, link checker, count tests, Learning curriculum). This one picks up where they left off.

---

## 0. Progress

Status of the ten headline recommendations in §2. Update this table in the PR that ships each item.

| # | Recommendation | Status | Shipped in | Notes |
|---|----------------|--------|------------|-------|
| 1 | Fix stale counts & retire historical docs (§7) | ✅ Done | [PR #26](https://github.com/yennanliu/InvestSkill/pull/26) | Every §7 row fixed; `COUNT_DOCS` extended to FAQ / PLATFORM-COMPATIBILITY / CONTRIBUTING and "N skills" claims (§6.9); four docs moved to `doc/archive/`; `TODO.md` is now a curated top-5 |
| 2 | Enforce the skill contract with a test (§4.1, §6.3) | ✅ Done | [PR #26](https://github.com/yennanliu/InvestSkill/pull/26) | `Data & Sources` header 24/24 · Data Verification 24/24 · Thesis Invalidation 24/24 (all analysis skills; output tool, aliases, meta exempt). `scripts/check-skill-contract.js` in `npm test`. `--lang zh-TW` and the JSON footer remain open → `TODO.md` #5 |
| 3 | Reclassify the 3 redirect skills as aliases; honest count (§4.2) | ✅ Done | [PR #26](https://github.com/yennanliu/InvestSkill/pull/26) | Option (b): **24 frameworks + 3 aliases + 1 output tool**. Single source of truth `scripts/lib/skill-registry.js`, imported by tests, installer tests, and the site build; own "Aliases" category on `skills.html` |
| 4 | `etf-analysis` (§3.1) | ✅ Done | [PR #27](https://github.com/yennanliu/InvestSkill/pull/27) | ETF Fitness Score; cost, tracking difference, liquidity, concentration/tilt, overlap with the user's holdings, distribution history, structure warnings, ETF-vs-top-5 comparison, UCITS note |
| 5 | `earnings-preview` (§3.1) | ✅ Done | [PR #27](https://github.com/yennanliu/InvestSkill/pull/27) | Consensus vs. whisper, 8-quarter beat/move table, implied vs. realized move, what's priced in, KPIs, three-scenario grid with position rules; Earnings Setup Score |
| 6 | `thesis-tracker` (§3.1) | ✅ Done | [PR #26](https://github.com/yennanliu/InvestSkill/pull/26) | Open / `--update` / `--review` / `--close` modes, saved-file contract, INTACT / WEAKENED / BROKEN rules, Thesis Health Score; scaffolded with `new-skill.js` |
| 7 | `tax-lens` (§3.1) | ✅ Done | [PR #27](https://github.com/yennanliu/InvestSkill/pull/27) | Trade / Position / Portfolio modes + `--non-us` (W-8BEN, withholding & treaty, capital-gains treatment with exceptions, $60k estate exemption, UCITS comparison); hard not-tax-advice gate; Tax Efficiency Score |
| 8 | `learning-coach` (§3.1) | ✅ Done | [PR #27](https://github.com/yennanliu/InvestSkill/pull/27) | Explain / `--quiz` modes, `--level`, `--lang zh-TW`; explanation cards, Socratic ladder, common misreadings; mirrors the analysed signal |
| 9 | `scripts/sync-prompts.js` + `scripts/new-skill.js` (§6.1, §6.2) | ✅ Done | [PR #26](https://github.com/yennanliu/InvestSkill/pull/26) | Prompts are now **generated** from SKILL.md (`--check` in `npm test`); the scaffolder wires a skill into 11 files. Note: regeneration replaced the hand-condensed prompts with the full SKILL.md text |
| 10 | `scripts/eval-skills.js` (§6.4) | ✅ Done | [PR #26](https://github.com/yennanliu/InvestSkill/pull/26) | Opt-in via `EVAL_CMD`; fixture `data/fixtures/ZEPH.md` (fictional company); hard checks via the shared parser `scripts/lib/signal-block.js` (§6.11), arithmetic checks advisory; writes `qa/eval_YYYYMMDD.md` |

Also shipped alongside: §6.9 (extend `COUNT_DOCS`), §6.11 (`scripts/lib/signal-block.js`), the `result-validator` contract check from §4.4 (PR #26); `risk-stress-test` — the sixth Tier 1 skill, not in the top 10 — in [PR #27](https://github.com/yennanliu/InvestSkill/pull/27). **All six Tier 1 skills (§3.1) are shipped.** Added outside the roadmap: `fact-check` — claim-level verification with citations, the missing half of the trust story next to `result-validator` — in [PR #28](https://github.com/yennanliu/InvestSkill/pull/28); the Learning track's Part II (Lessons 9–13, the "No" case study, +32 glossary terms) in [PR #29](https://github.com/yennanliu/InvestSkill/pull/29) after the [Learning gap review](LEARNING-GAP-REVIEW.md). Still open from the P0/P1 rows of §8: §4.3 (`full-report` runs every framework), `--lang zh-TW` everywhere, the JSON footer, the zh Skill Reference index (§5.6).

---

## 1. Where the project stands

| Area | State | Assessment |
|------|-------|------------|
| Skills | 27 directories, 26 advertised (`report-generator` excluded) | Broad single-stock coverage; **zero coverage of ETFs, taxes, or pre-earnings** |
| Skill contract | Signal block in 27/27 · Data Verification gate in 22/27 · Thesis Invalidation in 21/27 · **standardized Data & Sources header (as-of · source · retrieval · confidence) in 1/27** (11 have a looser "data sources" note) · `--lang zh-TW` in 2/27 | The site promises provenance on every analysis; the skills mostly don't deliver it, and no test enforces it |
| Redirect skills | `fundamental-analysis` (66 lines), `dcf-valuation` (108), `research-bundle` (93, marked deprecated) | Counted and listed as full frameworks in README, site categories, and `full-report` |
| `full-report` | 15 modules at `--depth comprehensive` | Skips 6 frameworks added since v1.8 (`10k-digest`, `bear-case`, `industry-map`, `catalyst-calendar`, `position-ladder`, `stock-screener`); 2 of its 15 modules are redirects |
| Learning site | 8 lessons + Concepts, Glossary (44 terms), Choose-a-Skill, Use Cases, Data & Accuracy, 5 demos — bilingual | Excellent foundation. Missing: ETFs, taxes, earnings-season mechanics, a **losing/pass** case study, self-check quizzes, a non-US-investor guide |
| Tests & scripts | 389 structural checks, install-script sandbox, link checker, daily site review | Everything tested is *structure*. Nothing tests whether a prompt actually produces the contract when run |
| Docs hygiene | README, FAQ, PLATFORM-COMPATIBILITY still carry "18 skills", "23 slash commands", "288+/294+ tests" | Count tests cover the six site-facing docs only |

**Strengths to keep.** Dual-form distribution (SKILL.md + universal prompt) with parity tests; the standardized signal block; a bilingual, first-principles Learning track that most tools of this kind lack; the honest "no runtime, no API key, you own the data" posture; and demos that show *judgment*, not just format (META 10-K, PFE value trap, UPST no-trade).

**The gap in one paragraph.** InvestSkill is a deep single-stock research desk with a strong teaching layer bolted to it. What it lacks is the rest of a real investor's workflow: the ETF core most portfolios are built on, the tax layer that decides what you actually keep, the *before*-earnings view, a place to write down and track a thesis, and a way to learn from closed trades. On the trust side, the site's promise that every analysis states its data provenance is not yet enforced in the skills. And the tooling tests structure, never behaviour.

---

## 2. Top 10 recommendations

| # | Recommendation | Type | Effort | Why it matters |
|---|----------------|------|--------|----------------|
| 1 | **Fix stale counts & retire historical docs** (§7) | Consistency | S | Credibility. Highest impact per hour in the repo |
| 2 | **Enforce the skill contract**: Data & Sources header + Data Verification + Thesis Invalidation in every analysis skill, with a test (§4.1, §6.3) | Trust | M | The site already promises it; only 1/27 skills deliver it |
| 3 | **Reclassify the 3 redirect skills** as aliases or restore them as real frameworks; advertise an honest count (§4.2) | Trust | S–M | 3 of 26 "frameworks" are stubs |
| 4 | **`etf-analysis`** — ETF / index-fund due diligence (§3.1) | New skill | M | The single largest blind spot for a US-retail audience |
| 5 | **`earnings-preview`** — the *before*-earnings skill (§3.1) | New skill | M | `earnings-call-analysis` is post-call; `catalyst-calendar` only lists the date |
| 6 | **`thesis-tracker`** — write, save, and re-check a thesis (§3.1) | New skill | M | Playbook steps 1, 9, 10 have no skill behind them |
| 7 | **`tax-lens`** — US tax mechanics + a non-US-investor module (§3.1) | New skill | M | Taxes decide what you keep; W-8BEN/withholding is essential for the zh-TW audience |
| 8 | **`learning-coach`** — explains any InvestSkill output line by line and quizzes the user (§3.1) | New skill | S–M | Bridges the tool half and the learning half of the project |
| 9 | **`scripts/sync-prompts.js` + `scripts/new-skill.js`** — generate `prompts/*.md` from SKILL.md and scaffold new skills (§6.1, §6.2) | Tooling | M | Removes the hand-sync that the 12-step process depends on |
| 10 | **`scripts/eval-skills.js`** — opt-in behavioural eval on fixed fixtures (§6.4) | Tooling | L | Today nothing verifies a prompt *works*; only that it is shaped right |

Suggested release mapping: #1–#3 → **1.11.1** (patch) · #4–#8 → **1.12.0 → 1.14.0** (one or two skills per minor) · #9–#10 land alongside as tooling.

---

## 3. New LLM skills

Effort: **S** < 1 day · **M** 1–3 days · **L** 1+ week (includes both file forms, both site languages, tests, demo).

### 3.1 Tier 1 — fills a real gap in the investor workflow

| Skill | What it produces | Inputs | Pairs with | Effort |
|-------|------------------|--------|-----------|--------|
| `etf-analysis` | **ETF Fitness Score 0–10**: expense ratio vs. category, tracking difference, AUM / ADV / bid-ask, top-10 weight & holdings concentration, sector/factor/country tilt, **overlap % with the user's other holdings**, distribution yield & capital-gains-distribution history, structure warnings (leveraged, inverse, synthetic, ETN), "ETF vs. buying the top 5 stocks" comparison | Ticker(s), optional current holdings | `portfolio-review`, `sector-analysis`, `stock-screener` | M |
| `earnings-preview` | Consensus revenue/EPS/guidance and the **whisper gap**; last-8-quarter beat rate and post-print move distribution; options-implied move vs. realized; **what's priced in** (implied growth at current price); KPIs to watch; 3-scenario grid (beat-and-raise / beat-and-lower / miss) with expected reaction and position-management rule | Ticker, earnings date, optional transcript of prior quarter | `earnings-call-analysis` (after), `options-analysis`, `catalyst-calendar` | M |
| `thesis-tracker` | A saved thesis file `output/thesis/<TICKER>.md`: one-paragraph thesis, 3–5 **KPIs with thresholds**, invalidation triggers (imported from each skill's Thesis Invalidation section), catalyst list, pre-mortem, decision log. `--update` re-reads it against new data and returns **INTACT / WEAKENED / BROKEN** with the specific line that changed | Ticker + prior analyses, or an existing thesis file | every single-ticker skill; `position-ladder`, `bear-case` | M |
| `tax-lens` | US tax mechanics for a position or portfolio: short- vs. long-term treatment, **wash-sale window check**, qualified vs. ordinary dividends (holding-period test), tax-lot selection (specific-ID vs. FIFO), tax-loss-harvesting pairs, account placement (taxable vs. IRA/401k), estimated annual tax drag. **`--non-us` module**: W-8BEN, 30 % dividend withholding (or treaty rate), US capital gains generally not taxed for non-resident aliens (the fewer-than-183-days rule; effectively connected income and other exceptions apply), US estate-tax exposure on US-situs assets above the NRA exemption, Irish-domiciled UCITS alternatives. Hard "not tax advice — confirm with a professional" gate | Holdings with lots/dates, or a proposed trade | `position-ladder`, `portfolio-review`, `dividend-analysis`, `etf-analysis` | M |
| `risk-stress-test` | Portfolio / position risk report: beta-weighted exposure, **historical scenario replay** (2008 GFC, Mar-2020, 2022 rate shock, 2025 tariff shock), parametric VaR / CVaR at 95/99 %, max-drawdown estimate, correlation-spike scenario, rate / USD / oil sensitivity, liquidity (days to exit at 20 % ADV). Risk Budget Score 0–10 | Holdings + weights | `portfolio-review`, `economics-analysis`, `position-ladder` | M |
| `learning-coach` | Takes **any InvestSkill output** and explains it as a mentor would: each metric in plain words, why it matters, the good/bad range, the lesson that teaches it; then 3–5 Socratic questions and a "what would change your mind?" prompt. `--level beginner/intermediate` · `--lang zh-TW` · `--quiz` mode drills a Learning lesson | Pasted analysis, or a lesson name | `result-validator`, the whole Learning track | S–M |

### 3.2 Tier 2 — depth for experienced users

| Skill | What it produces | Pairs with | Effort |
|-------|------------------|-----------|--------|
| `forensic-accounting` | Standard earnings-quality models the catalog names but never computes: **Beneish M-Score**, Altman Z, Sloan accrual ratio, cash-flow-vs-earnings divergence, capitalized-cost and revenue-recognition checks, auditor changes / critical audit matters, related-party flags. Manipulation Risk Score | `financial-report-analyst`, `bear-case` | M |
| `proxy-governance` | DEF 14A read: pay-for-performance alignment, SBC dilution vs. buyback offset, board independence & tenure, dual-class / control provisions, related-party transactions, say-on-pay history. Governance Score 0–10 | `financial-report-analyst`, `insider-trading` | M |
| `trade-postmortem` | Review of a closed trade or a year of trades: **process vs. outcome** matrix (good decision / bad outcome …), plan adherence, biases detected (anchoring, disposition effect, FOMO), what the pre-trade skills would have said, one-line lesson for the journal | `thesis-tracker`, `position-ladder` | S–M |
| `investment-policy` | An Investment Policy Statement for a beginner: goals, horizon, risk *capacity* vs. *tolerance*, target allocation with bands, contribution & rebalancing rules, "what I will not do" list. `portfolio-review` then grades a portfolio against it | `portfolio-review`, `etf-analysis` | S–M |
| `ipo-analysis` | S-1 / 424B read: business & unit economics, use of proceeds, dual-class, lock-up expiry date, insider selling in the offering, comps at the IPO range, first-day-pop base rates. IPO Quality Score | `financial-report-analyst`, `catalyst-calendar` | M |
| `pair-trade` | Relative-value setup for two names: correlation & cointegration proxy, spread z-score, hedge ratio (beta- or dollar-neutral), fundamental reason the spread should close, invalidation. Long-standing `TODO.md` item | `competitor-analysis`, `technical-analysis` | M |

### 3.3 Sketches for the top proposals

**`etf-analysis` — output skeleton**

```
Data & Sources · as of · issuer factsheet · fund prospectus · retrieval · confidence

1. Fund card          ticker · issuer · index tracked · inception · AUM · expense ratio · structure
2. Cost & tracking    expense ratio vs. category median · 1/3/5-yr tracking difference · spread · ADV
3. What you own       top-10 weight · #holdings · sector / country / factor tilt · concentration flag
4. Overlap            % overlap with user's other holdings (by weight) · duplicated names
5. Distributions      trailing yield · qualified % · capital-gains distributions (last 5 yrs) · tax note
6. Structure risks    leveraged / inverse / synthetic / ETN / single-stock → daily-reset warning
7. Alternatives       2–3 cheaper or better-tracking peers · "vs. top-5 stocks directly" table
8. ETF Fitness Score  0–10 with sub-scores → signal block
```

**`earnings-preview` — the scenario grid**

| Scenario | Probability | Trigger | Expected move | Pre-positioning |
|----------|-------------|---------|---------------|-----------------|
| Beat & raise | — | Rev > consensus + guide up | + implied move or more | hold / add rung |
| Beat & lower | — | EPS beat, guidance cut | flat to − | trim into strength |
| Miss | — | Rev or EPS < consensus | − implied move or more | respect stop |

Plus: "what's priced in" (implied FCF growth at the current price, borrowed from the reverse-DCF idea in §4.4), the 8-quarter beat/move table, and IV vs. realized so the reader can tell whether the options market is over- or under-pricing the event.

**`thesis-tracker` — the saved file's contract**

```
# Thesis · <TICKER> · opened YYYY-MM-DD · status INTACT | WEAKENED | BROKEN
Thesis (1 paragraph) · Why now · Horizon
KPIs        | metric | threshold | last value | date | ✓/✗
Triggers    | if <event/price> → <action>        (imported from Thesis Invalidation sections)
Catalysts   | date | event | expected impact
Pre-mortem  | "It is 12 months later and this lost 40 % because…"
Decision log| date | action | price | reason | skill that informed it
```

**`tax-lens --non-us` — why it belongs here.** A large share of this project's readers use the Traditional Chinese site. For a non-US investor buying US stocks, the tax layer differs completely from what US-centric content teaches: dividends are withheld at source, capital gains are generally not taxed by the US, estate-tax exposure starts far lower than for US persons, and the usual fix (Irish-domiciled UCITS ETFs) is not a US-listed product at all. No existing skill or lesson mentions any of this except one line in `dividend-analysis`.

**`learning-coach` — the bridge.** Every lesson says "here is the idea"; every skill says "here is the number". Nothing today sits between them. This skill is cheap to write (it mostly points at the Glossary and Learning pages) and gives the project a genuine teaching loop: run a skill → run the coach → answer its questions → re-run the skill with better inputs.

---

## 4. Enhancements to existing skills

### 4.1 Make the contract real (all analysis skills)

- **Data & Sources header** in every single- and multi-ticker skill, matching the block already documented on the Data & Accuracy page (as-of · source · retrieval · confidence). Today only `full-report` carries the full header; 11 skills have a looser "data sources" line without the as-of / retrieval / confidence fields; 15 have nothing.
- **Data Verification gate** added to the 5 skills that lack it; **Thesis Invalidation** added to the 6 that lack it (meta/output skills may be allow-listed).
- **`--lang zh-TW`** on every skill, not just `10k-digest` and `full-report`. A shared "Bilingual output" paragraph can be appended to each SKILL.md and prompt.
- A **machine-readable footer** (a fenced `json` block with signal, confidence, score, as-of, sources) after the signal block so the eval harness (§6.4), `result-validator`, and a future site "paste your output" checker can parse results without regex on box-drawing characters.

### 4.2 Be honest about the redirect skills

`fundamental-analysis`, `dcf-valuation`, and `research-bundle` are stubs that point elsewhere yet are listed as full frameworks in README, `SKILL_CATEGORIES`, `CHOOSE-A-SKILL`, and `full-report`'s module table. Pick one:

- **(a) Restore** — give each a genuinely distinct job (e.g. `dcf-valuation` becomes the *reverse* DCF / expectations tool; `fundamental-analysis` becomes the statement-only deep dive without valuation), or
- **(b) Reclassify** — move them to an "Aliases" category, advertise **23 frameworks + 3 aliases**, and update the framework-count rule and tests accordingly.

Option (b) is a half-day; option (a) is a minor release. Either is better than counting them.

### 4.3 `full-report` — make "comprehensive" comprehensive

Add the six missing frameworks (`bear-case` is the most important omission — a full report with no red-team), swap the two redirect modules for their targets, and re-tier: quick 5 · standard 10 · comprehensive **all**. Add `--skip <skill>` for cost control.

### 4.4 Targeted upgrades

| Skill | Add | Why |
|-------|-----|-----|
| `stock-valuation` | `--reverse` mode: solve for the growth / margin the current price implies | Used in Cookbook Workflow E and the META demo, but not a skill feature |
| `stock-screener` | Named presets (`--preset piotroski`, `dividend-aristocrats`, `magic-formula`, `rule-of-40`, `net-net`), sector-neutral ranking, ETF tickers accepted | Screens beginners actually ask for; today every screen is bespoke |
| `portfolio-review` | Broker-CSV column map (Schwab, Fidelity, IBKR, Firstrade) and an IPS comparison section | Users paste exports; the skill gives no format guidance |
| `catalyst-calendar` | Ex-dividend dates, lock-up expiries, monthly / quarterly options expiration, S&P and Russell reconstitution dates | Has FOMC and index eligibility; misses the events that move single names |
| `result-validator` | Check for the Data & Sources header and the JSON footer; emit its own JSON verdict | Turns it into the CI-side oracle for §6.4 |
| `economics-analysis` | A one-line **regime classification** (early / mid / late / recession) consumed by `sector-analysis` and `risk-stress-test` | The pieces exist (yield curve, LEI, NY-Fed probability); the verdict is not standardized |
| `technical-analysis` | Relative strength vs. SPY and sector ETF; a "trend + volume + RS" checklist score | The Cookbook's UPST run needed 3 confirmations; make the checklist explicit |
| `dividend-analysis` | Withholding-tax-adjusted yield line for non-US holders | One line, big relevance for the zh-TW audience |

---

## 5. Website content (learning-finance angle)

### 5.1 New Learning lessons

| # | Lesson | Covers | Related skills |
|---|--------|--------|----------------|
| 9 | **ETFs & Index Investing** | What an ETF is, expense ratio and tracking difference, core-satellite, overlap, when a single stock beats an ETF | `etf-analysis`, `portfolio-review` |
| 10 | **Taxes & Account Types** | Short vs. long-term, wash sale, qualified dividends, TLH, taxable vs. IRA/401k; **a non-US-investor section** (W-8BEN, withholding, estate tax, UCITS) | `tax-lens`, `position-ladder` |
| 11 | **Earnings Season, Explained** | The quarterly cycle, consensus and guidance, "beat and drop", implied move, how to read a press release and an 8-K | `earnings-preview`, `earnings-call-analysis` |
| 12 | **Psychology & Process** | Deeper than Lesson 6's section: disposition effect, anchoring, FOMO, pre-mortems, checklists, journaling, process vs. outcome | `trade-postmortem`, `thesis-tracker` |

> **Status (2026-09-24, [PR #29](https://github.com/yennanliu/InvestSkill/pull/29)):** Lessons 9 (ETFs), 10 (Taxes, with the non-US section), 11 (Earnings Season) and 12 (Psychology) shipped — numbered **10–13** on the site because a *Before Your First Trade* lesson (accounts, brokers, order types, IPS) was added as Lesson 9. Macro & Fed and Options lessons remain open. See [LEARNING-GAP-REVIEW.md](LEARNING-GAP-REVIEW.md).
| 13 | **Macro & the Fed Cycle** | Rates, yield curve, inflation, the dollar, how regimes rotate sectors | `economics-analysis`, `sector-analysis` |
| 14 | **Options for Stock Investors** | Covered calls, protective puts, what IV tells a stockholder, why not to sell naked | `options-analysis` |

### 5.2 Case studies

- **A losing or "pass" case.** Both Learning capstones (Apple, AMD) end in a buy. Add a bilingual case where the loop ends in **no** — the Cookbook already has two candidates (PFE value trap, UPST no-trade) that only exist in English inside §3. ✅ *Shipped in PR #29 as* Case Study: When the Answer Is No.
- **A thesis-break case.** Buy → KPI breaks → sell discipline actually executed, with the `thesis-tracker` file shown before and after.
- **An ETF-core portfolio for a first $10k**, using `investment-policy` → `etf-analysis` → `portfolio-review`.

### 5.3 Glossary gaps (44 → ~70 terms)

> **Status:** 44 → 76 terms in PR #29 (the ETF, tax, earnings, risk, and psychology terms below plus order types, T+1, IPS). Still missing: Beneish M-Score, accrual ratio, SBC, GAAP vs. non-GAAP, Form 4 / 13F / 8-K, yield curve, VIX, put/call ratio, ATR, MACD, goodwill, operating leverage, reverse DCF, Rule of 40, lock-up, dual-class.

Terms the skills emit today with no entry in either language: Beneish M-Score · accrual ratio · stock-based compensation (SBC) · GAAP vs. non-GAAP · wash sale · ex-dividend date · qualified dividend · Form 4 · 13F · 8-K · yield curve / inversion · VIX · put/call ratio · ATR · MACD · drawdown / max drawdown · Sortino ratio · goodwill & impairment · operating leverage (DOL) · reverse DCF · Rule of 40 · guidance · consensus · expense ratio · tracking difference · W-8BEN / withholding tax · lock-up · dual-class. Script §6.5 keeps this list from regrowing.

### 5.4 Reference & trust pages

- **Non-US Investor Guide** (bilingual) — brokers, W-8BEN, withholding, FX, estate tax, UCITS alternatives. Likely the most-read page for the zh-TW audience.
- **Bring Your Own Data** — the "C2" item still open from July. **Partly shipped:** the Data & Accuracy page now has a *Bring Your Own Data: The Keyless EDGAR Path* section (assistant fetches via the `data.sec.gov` recipe · download-and-paste with `fetch-edgar.js` / `fetch-fundamentals.js` · paste what you have), and `10k-digest`, `financial-report-analyst` and `fact-check` carry the retrieval recipe inline. Still open: MCP data-server and broker-CSV recipes. The two stray 10-K PDFs in `data/` were removed — the helper reproduces them as text on demand.
- **FAQ on the site** — 50+ answers exist in `FAQ.md` but the site has no FAQ page in either language; it also still says "18 skills".
- **Skill comparisons** to add to Choose-a-Skill: `bear-case` vs. `result-validator` · `catalyst-calendar` vs. `earnings-preview` · `position-ladder` vs. `portfolio-review` · `etf-analysis` vs. `stock-eval`.
- **Self-check quizzes** at the end of each lesson and a **printable one-page cheat sheet** (both still open from the June review).

### 5.5 Interactive, zero-runtime tools

Static client-side JavaScript keeps the "nothing runs, nothing phones home" promise while making the Learning track hands-on:

- **Calculators**: compounding, DCF sensitivity (WACC × terminal growth grid), position size / risk-per-trade, dividend withholding impact, ETF overlap (paste two holding lists).
- **Prompt builder**: pick skill → ticker → flags → copy-ready prompt. Universal (ChatGPT / Gemini / local-model) users assemble prompts by hand today.
- **Paste-your-output checker**: parses a signal block and Data & Sources header and flags missing fields. Teaches the contract by using it.
- **Lesson progress** (localStorage) with estimated reading time per lesson.
- **"As-of" banner** on every demo page, driven by the date in the source file, so readers see how old the prices are.

### 5.6 Traditional Chinese parity

- The zh nav has no **Skill Reference** index (open item D2 from July); generate a zh index page even if skill bodies stay English.
- Per-skill pages could render the `--lang zh-TW` output block once §4.1 lands.
- Script §6.6 keeps EN and zh-TW files from drifting.

---

## 6. Missing scripts & tooling

| # | Script | Purpose | Effort | Status |
|---|--------|---------|--------|--------|
| 6.1 | `scripts/sync-prompts.js` | **Generate** `prompts/<name>.md` from `SKILL.md`: strip frontmatter, rewrite `/us-stock-analysis:x` → `x`, apply an allow-list of platform phrases. `--check` mode for CI. Today sync is verified only by file existence and a 0.3×–2× token ratio | M | ✅ PR #26 |
| 6.2 | `scripts/new-skill.js <name>` | Scaffold both files from a template that already contains the contract sections, add the skill to `SKILL_CATEGORIES`, insert placeholder rows in both `CHOOSE-A-SKILL` files, add a CHANGELOG Unreleased line, then run the tests. Collapses the 12-step manual process | M | ✅ PR #26 |
| 6.3 | `scripts/check-skill-contract.js` | Lint every analysis skill for: Data Verification gate, Data & Sources header, Thesis Invalidation, signal block, disclaimer, `--lang` paragraph, JSON footer. Allow-list for meta/output skills. Wire into `npm test` | S | ✅ PR #26 |
| 6.4 | `scripts/eval-skills.js` | **Opt-in behavioural eval** (`EVAL_CMD` env, e.g. `claude -p`). Fixtures in `data/fixtures/<TICKER>.md` with pasted financials; run each skill; assert the JSON footer parses, Data & Sources is present, and arithmetic reconciles (FCF = OCF − capex, signal ↔ score band). Write `qa/eval_YYYYMMDD.md`. Consider `claude plugin eval` as the runner | L | ✅ PR #26 |
| 6.5 | `scripts/check-glossary-coverage.js` | Extract metric terms from skills (a curated regex list); every term must have an entry in both `GLOSSARY.md` and `GLOSSARY-zh-TW.md` | S | ⬜ |
| 6.6 | `scripts/check-zh-parity.js` | Every `site/content/X.md` has `X-zh-TW.md`; heading counts within tolerance; warn when EN was modified after zh (git log) | S | ⬜ |
| 6.7 | `scripts/check-demo-freshness.js` | Parse as-of dates in demos and Cookbook live runs; warn past 90 days; feed the §5.5 banner | S | ⬜ |
| 6.8 | `scripts/fetch-edgar.js <TICKER> [10-K\|10-Q\|8-K\|DEF14A\|4]` | Keyless helper: resolve CIK, download the latest filing into `data/`, honouring SEC's User-Agent and rate rules. Optional, outside the plugin — a concrete "bring your own data" path | M | ✅ Shipped as `fetch-edgar.js` (HTML + stripped text + `.json` header fields, not PDFs) plus `fetch-fundamentals.js` (XBRL companyfacts → `data/fixtures/<TICKER>.md` data pack) on `scripts/lib/edgar.js`; the helpers themselves are optional commands never run by `npm test`, while their offline suite `scripts/test-edgar.js` is; outputs ignored by git |
| 6.9 | Extend `COUNT_DOCS` | Add `FAQ.md`, `PLATFORM-COMPATIBILITY.md`, `CONTRIBUTING.md`, and the README test-count lines — or archive the stale docs (§7) | S | ✅ PR #26 |
| 6.10 | `scripts/build-cheatsheet.js` | Render the printable cheat sheet from the Glossary and signal-score bands so it never drifts | S | ⬜ |
| 6.11 | `scripts/lib/signal-block.js` | One shared parser for the signal block / JSON footer used by 6.3, 6.4, `site-review.js`, and the site checker | S | ✅ PR #26 |
| 6.12 | `scripts/gen-current-state.js` | Regenerate the "Current State" block in `CLAUDE.md` from the filesystem (open item A3) | S | ⬜ |

---

## 7. Consistency issues found during this review

All verified against the working tree at v1.11.0. **All rows below were fixed in [PR #26](https://github.com/yennanliu/InvestSkill/pull/26).**

| File | Line | Says | Should say |
|------|------|------|------------|
| `README.md` | 234 | "23 native slash commands" | 27 (or 26 frameworks) |
| `README.md` | 281 | "Add to `plugin.json` skills array" | Skills are auto-discovered; no `plugin.json` change |
| `README.md` | 282, 288 | "288+ tests", "294+ passing" | 389 today — derive it, or drop the number |
| `README-zh-TW.md` | 402 | "294+ 個" | same |
| `FAQ.md` | 139–146 | "18 skills" ×4 | 26 frameworks / 27 skills |
| `PLATFORM-COMPATIBILITY.md` | 48 | "All 18 skills" | same |
| `CONTRIBUTING.md` | 17 | links `issues/new?template=bug_report.md` | No `.github/ISSUE_TEMPLATE/` exists — add templates or drop the parameter |
| `HIGH-IMPACT-IMPROVEMENTS.md`, `CI-CD-FIXES-SUMMARY.md`, `DEPLOYMENT-STATUS.md`, `TODO.md` | — | Historical (Feb–Apr 2026, "18 skills", TODO last updated 2026-02-24) | Move to `doc/archive/`; turn `TODO.md` into a curated top-5 that links here |
| `full-report` SKILL.md / prompt | module table | 15 modules, 2 of them redirects | See §4.3 |
| Site Data & Accuracy page vs. skills | — | "every analysis should declare its provenance" | Only `1/27` skills contain the header — see §4.1 |

---

## 8. Prioritized roadmap

| Priority | Theme | Items | Release |
|----------|-------|-------|---------|
| **P0 — this week** | Credibility | §7 fixes · extend `COUNT_DOCS` (6.9) · reclassify redirects (§4.2 option b) · `check-skill-contract.js` (6.3) | 1.11.1 |
| **P1 — this month** | Contract & tooling | Data & Sources + gates + `--lang` on all skills (§4.1) · `full-report` all modules (§4.3) · `sync-prompts.js` (6.1) · `new-skill.js` (6.2) · zh Skill Reference (§5.6) | 1.11.2 or fold into 1.12.0 |
| **P2 — next quarter** | Investor workflow | `etf-analysis` + Lesson 9 · `earnings-preview` + Lesson 11 · `thesis-tracker` · `tax-lens` + Lesson 10 + Non-US Investor Guide · `learning-coach` · glossary +25 · losing/pass case study | 1.12.0 – 1.14.0 |
| **P3 — after** | Depth | `risk-stress-test` · `forensic-accounting` · `proxy-governance` · `trade-postmortem` · `investment-policy` · calculators & prompt builder · `eval-skills.js` (6.4) | 1.15.0+ |
| **Backlog** | | `ipo-analysis` · `pair-trade` · Lessons 12–14 · quizzes & cheat sheet | as demand shows |

---

## 9. Deliberately not proposed

- **Live-data API integration, broker APIs, alerts, scheduling** (top of `TODO.md`). They contradict the project's strongest promise — no runtime, no keys, no telemetry. The "Bring Your Own Data" page and the optional EDGAR helper give the same benefit without changing what InvestSkill is.
- **Crypto, forex, international markets.** The name is *US* stock analysis; the Learning track, glossary, and tax content all assume it. Broadening dilutes the teaching before the US story is finished (ETFs, taxes, earnings).
- **ML price prediction / backtesting engines / statistical arbitrage.** Not a prompt-engineering deliverable; an LLM cannot compute these reliably, and shipping them as prompts would undermine the Data & Accuracy posture.
- **Changing the signal block.** It is the one contract every skill, test, demo, and lesson shares. Provenance and machine-readability go *next to* it (§4.1), not inside it.

---

*Recommendations only. Educational project — not financial or tax advice.*
