# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **`fact-check`** — new meta framework: claim-level verification of any report or data set. Pulls **every figure and factual claim** into a ledger (type · period · signal-driving?), checks each against a **primary source** (SEC filing with Item/Note/page, IR release, FRED, issuer data, or the user's pasted document — model memory is never a source), **recomputes every derived figure** from verified inputs with the arithmetic shown, and assigns a verdict: ✅ verified · ⚠️ mismatch (source value, delta, likely cause — fiscal-year, TTM vs. FY, GAAP vs. adjusted, basic vs. diluted, units, stale price) · ❓ unverifiable (never presented as false) · 🔁 recomputed · 🕒 stale. Checks the report's own consistency (numbers vs. narrative, signal vs. score band, whether its `Data & Sources` header overstates what was verifiable, fabricated or unopenable citations). Re-issues the report as a **corrected copy with inline `[n]` citations and a References section** (originals struck through, `[?]` on unverifiable claims, `[unsupported]` on qualitative claims without evidence). Modes: Verify (default), `--cite-only`, `--recompute`, `--diff`. **Verification Score 0–10** with hard caps (signal-driving mismatch > 5% → ≤ 4.0; > 50% unverifiable → ≤ 5.0; header overstated → ≤ 6.0; any fabricated citation → 0). The signal block mirrors the verified report's own signal with Confidence capped by the score. Wired in: `result-validator` Data Quality is now capped by the fact-check score and points to it; `full-report` runs `fact-check` before `result-validator`; the Data & Accuracy pages (EN + zh-TW) describe the two-step "verify inputs, then validate reasoning" habit; Choose-a-Skill gains a `fact-check` vs. `result-validator` comparison (both languages); Cookbook Workflow E adds the step. Advertised count 29 → **30 frameworks**; 34 skills.
- **Five new analysis frameworks — the rest of the roadmap's Tier 1 (§3.1), scaffolded with `scripts/new-skill.js`.** Advertised count 24 → **29 frameworks** (+ 3 aliases, 1 output tool); 33 skills in total. Each carries the full output contract (Data Verification · `Data & Sources` header · Thesis Invalidation · signal block · disclaimer) and is wired into the site (`skills.html`, both Choose-a-Skill pages), both READMEs, the three cross-AI configs, and Cookbook Workflow I (both languages).
  - **`etf-analysis`** — ETF / index-fund due diligence. Nine phases with concrete thresholds: expense ratio vs. category bands; tracking *difference* vs. tracking *error* (with a tracking-gap flag); AUM / ADV / spread / premium tiers and closure risk; top-10 weight, holdings count, sector / factor / country / currency tilt vs. the index the user thinks they are buying; **overlap by weight with the user's other holdings** (min-weight arithmetic, redundant / partial / complementary verdict, labelled as a lower bound when only top-10 data is available); distribution composition and capital-gains-distribution history (in-kind redemption explained); a structure-warning table (leveraged / inverse daily reset, synthetic, ETN credit risk, single-stock, commodity K-1, hedged, covered-call, active); 2–3 peers and an "ETF vs. buying the top 5 holdings directly" comparison; a UCITS / withholding note for non-US holders pointing to `tax-lens --non-us`. **ETF Fitness Score 0–10** with hard caps for leveraged / inverse / single-stock funds held long-term, ETNs, and > 60% overlap.
  - **`earnings-preview`** — the *before*-earnings skill (`earnings-call-analysis` is post-call; `catalyst-calendar` only lists the date). Expectation stack (prior guide, consensus, 90-day revision direction, a labelled whisper range and gap); an 8-quarter beat / miss vs. next-day-move table that surfaces "beat and drop" patterns; options-implied move (straddle ÷ price) vs. the realized median — is the event over- or under-priced; **what is priced in** via a light reverse-DCF (implied forward growth at the current multiple vs. consensus); the company's KPIs and the one number that decides the reaction; a four-row scenario grid (beat & raise / beat & lower / miss / in line) with probabilities, expected reaction, and a **position rule decided before the print**, tied to `position-ladder` and `thesis-tracker`; a "what not to do" list. **Earnings Setup Score 0–10** defined as holder asymmetry — explicitly *not* "buy before earnings".
  - **`tax-lens`** — what the investor actually keeps. Trade / Position / Portfolio modes: holding-period character with a "wait N days" table (tax saved vs. the price fall that erases it); a 61-day **wash-sale timeline** across all accounts including DRIP and IRA repurchases; the qualified-dividend 60-of-121-day test and after-tax yield; lot selection (specific-ID vs. FIFO vs. HIFO) with the tax under each; tax-loss-harvesting pairs with non-identical replacements and the basis-reset warning; account-placement table; an annual **tax-drag** formula. **`--non-us` module** for non-resident aliens: W-8BEN validity, 30% statutory withholding vs. treaty rate (and the no-treaty case — Taiwan, Hong Kong, Singapore), capital gains generally not US-taxed with the 183-day condition and the ECI / FIRPTA exceptions stated, **US estate-tax exposure above the $60,000 exemption**, and a US-ETF vs. Irish-UCITS comparison table with the after-withholding arithmetic. Hard not-tax-advice gate opens and closes every output; Confidence capped at MEDIUM when bracket, residency, or lot dates were assumed. **Tax Efficiency Score 0–10** — rates the plan, never the security.
  - **`risk-stress-test`** — portfolio / position risk report. Per-position weight × β table, net beta and dollar-beta to SPY; **historical scenario replay** (2008 GFC, March 2020, 2022 rate shock, 2025 tariff shock) via each holding's own history or a β / sector proxy marked as such, index magnitudes labelled approximate; parametric VaR and CVaR at 95 / 99% for 1 day and 1 month with the formulas and constants shown and the normal-tail caveat ("trust the replay if they disagree by > 2×"); portfolio σ under normal vs. crisis (ρ → 0.85) correlations and the diversification-benefit gap; rate / USD / oil factor sensitivities; days-to-exit at 20% of ADV with illiquidity flags; a "smallest changes to get inside budget" section handing tax cost to `tax-lens` and execution to `position-ladder`. **Risk Budget Score 0–10** (≥ 7 within budget → BULLISH; < 4 → BEARISH). Honest about what an LLM cannot compute from memory — the inputs to paste (β, σ, ADV, weights) are listed up front.
  - **`learning-coach`** — the bridge between the tool half and the Learning half of the project. **Explain** mode: reproduces the pasted analysis's `Data & Sources` header (or writes a LOW-confidence substitute and teaches why it matters), checks the three contract pieces, then one *explanation card* per signal-driving metric (plain words · why it matters · generic and sector range · in this case · Learning lesson + Glossary link), a "how the pieces connect" paragraph, a *common misreadings* list, and a 3–5 rung Socratic ladder ending in "what would change your mind?" tied to the analysis's own Thesis Invalidation. **`--quiz <lesson>`**: five questions on one Learning lesson (2 recall · 1 calculation with a tiny worked data set · 2 judgment), answers hidden under an Answers heading. `--level beginner | intermediate`, `--lang zh-TW`. Never re-scores: the signal block mirrors the analysed output.
- **`thesis-tracker`** — new analysis framework (#6 on the [improvement roadmap](doc/IMPROVEMENT-ROADMAP.md)). Turns an analysis into a contract with your future self: a falsifiable one-paragraph thesis, 3–5 KPIs with thresholds, invalidation triggers imported from the other skills' Thesis Invalidation sections and `bear-case`'s Thesis-Killers, a catalyst list, a pre-mortem, and a decision log, saved to `output/thesis/<TICKER>.md`. `--update` re-reads the file against new data and returns **INTACT / WEAKENED / BROKEN** with the specific line that changed; `--review` lists every thesis file and flags overdue checks; `--close` records the exit for a later post-mortem. Scored by a Thesis Health Score (0–10) mapped onto the standard signal block. Wired into the site (Advanced Research), both Choose-a-Skill pages, Cookbook Workflow H (both languages), READMEs, and the cross-AI configs. Fills Playbook steps 1, 9, and 10, which had no skill behind them.

- **Skill contract enforced on every analysis skill** (roadmap #2). Each of the 24 analysis frameworks — in both `SKILL.md` and `prompts/*.md` — now carries the three pieces the site promises: the **`Data & Sources` header** (As of · Source · Retrieval · Confidence, the block documented on the Data & Accuracy page; previously only `full-report` had it), the **Data Verification gate**, and a **Thesis Invalidation** section (added to `full-report`, `portfolio-review`, and `stock-screener`, each written for that skill's kind of output). `result-validator` now checks for the header first and caps Data Quality when it is missing. Enforced by the new `scripts/check-skill-contract.js` in `npm test`; output tools, aliases, and meta skills are exempt via `scripts/lib/skill-registry.js`.

- **`scripts/sync-prompts.js`** (roadmap #9, §6.1) — `prompts/<name>.md` is now **generated** from `SKILL.md` (frontmatter stripped; `/us-stock-analysis:x` → `x`; `/x` → `x`; "Claude analyzes …" → "The assistant analyzes …"). `--check` runs in `npm test` and fails on drift; `--diff` shows it. All 28 prompts were regenerated: the hand-condensed versions of 15 prompts (some at a quarter of the SKILL.md length) are replaced by the full text, so every platform now gets the same framework.

- **`scripts/new-skill.js <name> --category … --title … --desc …`** (roadmap #9, §6.2) — scaffolds a skill from a template that already contains the full contract and wires it into the site's `SKILL_CATEGORIES`, both `CHOOSE-A-SKILL` pages, both READMEs, the three cross-AI configs (table row + directory tree), and this changelog. `thesis-tracker` was built with it.

- **`scripts/eval-skills.js`** (roadmap #10, §6.4) — opt-in behavioural eval. With `EVAL_CMD` set to any command that reads a prompt on stdin (`claude -p`, `ollama run …`), it runs each skill against a fixed data pack and checks the *output*: signal block present and filled, enum values valid, Score consistent with Signal, `Data & Sources` header complete and honest (`Retrieval: pasted by user` for a fixture; `model memory` must be LOW), disclaimer present — plus advisory arithmetic checks (FCF = OCF − capex, net debt, P/E, growth, payout) against the fixture's `expect:` list. `--dry-run` writes the prompts for manual or `claude plugin eval` runs; `--from-dir` scores saved completions. Writes `qa/eval_YYYYMMDD.md`. Fixture: `data/fixtures/ZEPH.md`, a fictional company so the numbers never go stale and cannot be recalled from memory.

- **`scripts/lib/signal-block.js`** (§6.11) — one shared parser for the signal block and the `Data & Sources` header, used by the contract check and the eval harness. **`scripts/lib/skill-registry.js`** — the single source of truth for which skills are output tools, aliases, or meta skills; imported by `test-skills.js`, `test-install.js`, `check-skill-contract.js`, and `site/build/build-site.js`.

- **Roadmap progress tracking** — `doc/IMPROVEMENT-ROADMAP(.md|-zh-TW.md)` gained a §0 status table for the ten headline items and a Status column on the scripts table; `TODO.md` is now a curated top-5 that links to it.

### Changed
- **Site redesign** (`site/build/`). The two landing pages (EN + zh-TW) are now real landing pages instead of a rendered README: a two-column hero with a serif headline, an animated terminal mock that plays a `/stock-eval AAPL` run ending in the INVESTMENT SIGNAL block, a stat strip, a three-step "How it works", the install picker, **framework-category cards** generated from `SKILL_CATEGORIES` (so new skills appear automatically), an eight-lesson Learning track, demo cards, and a Trust section — the README body still renders below a divider so every existing `index.html#…` anchor keeps working. **Skill Reference** (`skills.html`) is a filterable card grid (text filter + category chips, `#category` deep links pre-select a chip, `/` focuses the filter). **Per-skill pages** gain a category eyebrow, the SKILL.md description as subtitle, a "Run this skill" box with copyable invocations for Claude Code / Cursor & Gemini / any LLM, related-skill chips, and previous / next navigation in category order. Site-wide: a bilingual footer, previous / next pager on every page, copy buttons on code blocks, a reading-progress bar and back-to-top button, glass header, dark mode that follows `prefers-color-scheme` with no flash (inline theme script), keyboard-navigable search with highlighted matches, a mobile sidebar backdrop, horizontally scrolling tables, per-page `<title>` / description / Open Graph / canonical tags, an SVG favicon, and a redesigned 404. No content files changed; `npm test` and `scripts/check-links.js` pass unchanged.
- **`fundamental-analysis`, `dcf-valuation`, and `research-bundle` are reclassified as aliases** (roadmap #3, §4.2 option b). They remain installed and keep working as redirects, but are no longer counted or listed as frameworks. The advertised count is now **24 analysis frameworks (+ 3 aliases, 1 output tool)** across `README*.md`, the site (own "Aliases (redirects)" category on `skills.html`, `Skill Reference` subtitle), both Choose-a-Skill pages (rows and comparisons now point at `stock-eval` / `stock-valuation` / `full-report`), both Cookbooks, `GEMINI.md`, the Cursor rules, the Copilot instructions, `plugin.json`, `marketplace.json`, `install.sh`'s reported count, and `CLAUDE.md`. Test 14 asserts each alias states its redirect target and sits in the Aliases category.

- **Stale numbers fixed everywhere the roadmap's §7 found them** (roadmap #1): `README.md` "23 native slash commands" → 28; the Contributing section no longer tells you to edit a `plugin.json` skills array; hard-coded test counts ("288+", "294+") dropped in favour of "all passing"; `FAQ.md` and `PLATFORM-COMPATIBILITY.md` "18 skills" → 28 skills / 24 frameworks; `CONTRIBUTING.md` no longer links a non-existent issue template; `CI-CD-GUIDE.md` "18 skills" wording removed. `HIGH-IMPACT-IMPROVEMENTS.md`, `CI-CD-FIXES-SUMMARY.md`, `DEPLOYMENT-STATUS.md`, and the old `TODO.md` moved to `doc/archive/`.

- **Tests** — `npm test` now runs four suites: `test-skills.js`, `check-skill-contract.js`, `sync-prompts.js --check`, and `test-install.js`. `test-skills.js`: the framework-count check derives its expected value from `skill-registry.js`, ignores parenthesised category sub-counts like "(10 frameworks)", covers `FAQ.md` / `PLATFORM-COMPATIBILITY.md` / `CONTRIBUTING.md` (§6.9) and "N skills" claims; new Test 14 for aliases. `test-install.js` expects the installer to report the alias-aware count. `integration-tests.js` checks `TODO.md` links the roadmap instead of requiring the archived `DEPLOYMENT-STATUS.md`.

- `ADDING-NEW-SKILLS.md` — documents the `new-skill.js` fast path, the generated-prompt rule, the enforced contract, and the auto-discovery of skills (the plugin.json skills-array step was stale). `report-generator` SKILL.md now contains the signal-format section that previously existed only in its prompt, and its HTML template no longer brands the report "Claude Investment Analysis".
- **`install.sh` — one-command install for any AI agent.** `curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a <agent>` copies every framework into `.investskill/prompts/` and wires up that agent's own entry point: `claude` → `.claude/skills/<skill>/SKILL.md` (slash commands), `cursor` → `.cursor/rules/investskill.mdc`, `copilot` → `.github/copilot-instructions.md`, `gemini` → `GEMINI.md`, `codex` / `opencode` → `AGENTS.md`, and `any` → the prompts alone for ChatGPT, Claude.ai, or a local model. Existing instruction files are **appended to inside a marked block, never overwritten**, and a second run is a no-op. Flags: `-a` agent, `-d DIR` target directory, `-g` user-level install (`$HOME`), `-r REF` branch/tag, `-l` list targets, `-h` help. No runtime and no dependencies beyond `curl` and `tar`.

- **Tests + CI for `install.sh`.** `scripts/test-install.js` (`npm run test:install`, also part of `npm test`) — 116 checks in two layers: static checks on the script (bash shebang, `set -euo pipefail`, executable bit, `bash -n`, `rm -rf` confined to its own `mktemp` dir, every `AGENTS` entry handled in the wiring `case` and documented by `-l`) plus parity checks against `INSTALL_TARGETS` in `site/build/build-site.js` and against every documented `curl` command in the READMEs and Cookbooks. On top of that it *runs* `install.sh` in throwaway sandboxes with a `curl` test double that serves a tarball built from the working tree — offline, but the real download → extract → copy → wire path — asserting: all 27 prompts land in `.investskill/prompts/`, the reported count excludes `report-generator`, each agent writes its own entry point (`.claude/skills/*/SKILL.md`, `.cursor/rules/investskill.mdc`, `.github/copilot-instructions.md`, `GEMINI.md`, `AGENTS.md`), `-a any` writes prompts only, an existing instructions file is appended to and never overwritten, a second run is byte-identical with exactly one marker block, `-g`/`-d`/`-r`/`-l`/`-h` behave, unknown agents and flags fail loudly, and a failed download or a bad archive leaves the project clean. New workflow `.github/workflows/install-script.yml`: shellcheck + `bash -n` lint, the test suite on Linux and macOS (BSD `tar`/`sed`) and on the Node 18 engines floor, and a live `curl … | bash` install of the commit under test for all seven agents including an idempotent re-run.

- **Site — install picker on both landing pages** (`#install`, English + 繁體中文): agent tabs (Claude Code · Cursor · GitHub Copilot · Gemini CLI · Codex · OpenCode · Any LLM), the matching `curl` command with a copy button, the file each target writes, and the first command to run afterwards. The visitor's chosen agent is remembered between visits, and the landing "Get Started" CTA now scrolls here. Built by `buildInstaller()` in `site/build/build-site.js` — keep its `INSTALL_TARGETS` list in sync with the `AGENTS` list in `install.sh`.

- Install instructions for the curl path added to `README.md`, `README-zh-TW.md`, the per-platform guides (`README-claude-code.md`, `README-cursor.md`, `README-gemini.md`, `README-ollama.md`), and both Cookbooks (`site/content/COOKBOOK.md`, `COOKBOOK-zh-TW.md`).

- Site demo — **META 10-K Deep Dive** (`site/content/FULL-DEMO-META.md` → `full-demo-meta.html`), the reference example for *"analyze a financial report with the skills in this plugin."* Unlike the NVDA/AMD demos (one skill run end-to-end), this one **chains nine skills over a single 138-page PDF** — Meta Platforms' FY2025 Form 10-K, filed 2026-01-28 — in the order `10k-digest` → `financial-report-analyst` → `fundamental-analysis` → `chart-master` → `bear-case` → `stock-valuation`/`dcf-valuation` → `catalyst-calendar` → `position-ladder` → `result-validator`. Every figure is quoted verbatim and cited to an Item/Note and printed page. Demonstrated techniques include: **diffing two consecutive filings** to surface strategy shifts in management's own language ("superintelligence" 0 → 9 mentions, "metaverse" 18 → 9); a **prior-year promise tracker** scoring FY2024's guidance against FY2025 actuals (capex guided $60–65B, delivered $72.2B); **normalizing a one-off tax charge** (the $15.93B OBBBA valuation allowance turns a −3% net income year into +24% adjusted EPS growth); **off-balance-sheet forensics** on the unconsolidated Louisiana data-centre VIE (Note 5 — $45.95B maximum exposure to loss, $28B residual value guarantee, a new critical audit matter) plus $103.8B of not-yet-commenced leases and $131.0B of contractual commitments against $148.8B of recognized liabilities; a **three-scenario DCF** whose base case reproduces the filing's own year-end close of $660.09 to within 0.3%; and an honest **data-gap disclosure** for the five chart exhibits that do not render in the source PDF, reconstructed from text and reconciled. Ends with a `result-validator` confidence audit (82/100) that names where the analysis is most likely to be wrong. Wired into both language navs and the Demo Overview page. No new skill — framework count unchanged at 26.

- Cookbook — **seven live workflow runs (§3.12–3.18)** added to the demo section of `COOKBOOK.md` and `COOKBOOK-zh-TW.md`. Each of Workflows A–G from §4 is executed end-to-end against a real US-listed stock using live market data (run date 2026-07-27, prices as of the 2026-07-24 close), with per-step output, the arithmetic behind each conclusion, a signal block, and cited sources: **A** pre-earnings deep dive on AAPL (into the 30 Jul print — implied move ±5.38%, price 0.6% off the 52-week high → trim); **B** value screen on PFE (7.01% yield costs 103.4% of free cash flow against $17–18B of contractual LOE → value trap); **C** dividend sleeve JNJ/ABBV/PG (ABBV's 336% *accounting* payout is 61.2% on *cash* — plus a 2.52% blended yield and 67% healthcare concentration); **D** swing setup on UPST (31.44% of float short, but 0 of 3 technical confirmations and 1.17:1 reward/risk → **no trade**); **E** full memo on NVDA (reverse DCF: today's $4.97T EV requires ~35% year-1 FCF growth at a 12% WACC); **F** sector rotation in the July 2026 regime (Fed on hold at 3.50–3.75%, core CPI 2.6%, curve +78 bp — XOM's macro call is already in estimates at 12.58× forward, JPM's is not); **G** position ladder on AVGO (5 rungs anchored on the 200-day MA and 1-ATR spacing, wash-sale window flagged, and the trim leg shown to cost $1,300 in a rally).

- Site — explicit "no API keys, completely free" messaging: a new **No API Keys, No Cost** section on both homepages (English + 繁體中文) covering API keys, subscriptions, market-data fees, runtime, and license; a `$0 · no API keys` cost badge; a `$0 / No API keys · no fees` hero stat on the landing pages; and a matching note on the Data & Accuracy pages explaining why no key is needed.

### Changed
- Cookbook §4 — recipe tickers refreshed so the worked examples stay accurate: Workflow B now uses `PFE` (Intel no longer screens as a value candidate), Workflow D uses `UPST`, and Workflow A cites `Q2-2026`. Each workflow now links to its live run in §3.
- `scripts/site-review.js` — daily QA reports in `qa/` are now capped at a 5-day retention window (`RETENTION_DAYS`); older `site_review_YYYYMMDD.md` files are pruned on each run. `PROJECT-REVIEW.md` is untouched.
- `install.sh` — the framework count is now computed with a glob instead of `ls | grep` (shellcheck SC2010); output is unchanged.
- `.github/workflows/site-review.yml` — stages `qa/` with `git add -A` so pruned reports are committed as deletions alongside the new report. Pruned the existing 19-report backlog down to the last 5 days.

## [1.11.0] - 2026-07-27

### Added
- `position-ladder` — new skill: plan and manage a **single position across its life**, the execution layer the catalog was missing. Sets a share-count band (floor / ceiling) from the most restrictive of the concentration, capital, and loss-tolerance caps; builds a staged **entry ladder** (volatility-scaled / fixed-% / support-based / fixed-$ spacing, with equal-share, equal-dollar, or pyramid sizing) and computes capital at full fill, blended average cost, and the drawdown the plan expects to sit through; models the **trim / re-add cycle** that sells the highest-cost lots above blended average cost and buys them back below it, oscillating inside the band. Includes the parts retail versions of this strategy omit: **lot-accounting** (specific-ID vs. broker-default FIFO), **wash-sale flagging** with the 30-day window and the IRA-repurchase trap, holding-period effects, a mandatory **total-return-vs-buy-and-hold** reality check across three price paths (so a lower average cost is never mistaken for a profit), an **underfill** mitigation for names that never pull back, a **thesis-break gate** with a do-not-ladder list (leveraged ETFs, binary-event names, solvency cases), and a 0–10 **Ladder Suitability Score**. Complements `portfolio-review` (which works *across* holdings) by working *inside* one. Brings the advertised framework count to 26.

## [1.10.1] - 2026-07-22

### Enhanced
- `10k-digest` — added four interpretation sections to the digest output: **Highlights & Concerns** (dedicated positives/negatives lists), **Management Outlook & Forward Guidance** (forward-looking commitments table), **Prior-Year Promise Tracker** (accountability audit scoring last year's 10-K guidance against this year's actuals, with a management-credibility read), and **Bull vs. Bear Synthesis** (lightweight filing-sourced face-off). Added suggested Traditional Chinese headings for the new sections. No new skill — framework count unchanged at 25.

## [1.10.0] - 2026-07-12

### Added
- `industry-map` — new skill: map an industry's supply / value chain as a directed graph, from raw inputs upstream down to the end user. Provides a bird's-eye view of a business: builds the chain as a Mermaid flowchart (with ASCII fallback) plus a chain-map table, locates a given ticker's position (upstream / midstream / downstream) and its up/downstream dependencies, scores each layer for bottleneck/chokepoint power (the durable "toll collectors"), maps where the profit pool sits today and where it is likely to migrate next, flags concentration & supply-chain risk, and generates second-order investment ideas per layer (core / picks-and-shovels / avoid). Complements `competitor-analysis` (one company's moat, horizontal) and `sector-analysis` (GICS rotation) by mapping a theme vertically, across sectors. Brings the advertised framework count to 25.

## [1.9.0] - 2026-07-05

### Added
- `bear-case` — new skill: a deliberate short-seller red-team that constructs the strongest possible bear thesis for a stock (why NOT to hold). Covers valuation stretch, deteriorating fundamentals, accounting/earnings-quality red flags, competitive & secular threats, management & capital allocation, downside catalysts with timelines, a quantified bear price target, and a mandatory "Thesis-Killers" section listing what would prove the bear wrong. Produces a 0–10 Bear Case Strength Score and is intended to surface counterevidence for any bullish thesis (pair with `stock-eval` for a balanced view). Brings the advertised framework count to 24.

## [1.8.1] - 2026-06-23

### Added
- `10k-digest` — new skill: deep-read a 10-K annual report and output a structured markdown digest document. Includes abstract, section-by-section summaries (Items 1–13), key metrics table, notable disclosures, and full source references. Supports `--lang zh-TW` for Traditional Chinese output and `--output <file>.md` to save the digest as a markdown file.

## [1.8.0] - 2026-06-19

### Merged (reduced redundancy)
- `dcf-valuation` merged into `stock-valuation` — stock-valuation is now the superset with deep DCF + multi-method valuation; dcf-valuation becomes a thin redirect
- `fundamental-analysis` merged into `stock-eval` — stock-eval absorbs deep financial statement analysis; fundamental-analysis becomes a thin redirect
- `research-bundle` unified into `full-report` — full-report now supports --depth quick/standard/comprehensive flags; research-bundle becomes a thin redirect

### Enhanced
- `sector-analysis` — expanded from 121 to 300+ lines: sector valuation tables, seasonality calendar, correlation matrix, momentum scoring, peer benchmarking, sector-specific risks
- `portfolio-review` — expanded: concentration risk scoring, correlation/diversification analysis, tax-loss harvesting framework, factor exposure, rebalancing decision framework, drawdown/risk budget
- `dividend-analysis` — expanded to Capital Allocation Analysis: buyback analysis, M&A capital allocation, debt management, FCF deployment scorecard, capital allocation quality score

### New Skills
- `stock-screener` — ranks/screens multiple tickers across valuation, quality, momentum, sentiment, and growth dimensions; outputs ranked leaderboard + top picks + avoid list
- `catalyst-calendar` — forward-looking 90-day event calendar: earnings, macro events, company-specific catalysts, impact scoring, event-driven strategy suggestions

### Added
- Thesis Invalidation section added to all 16 single-ticker skills — specifies price levels and events that would reverse the signal, plus a re-analysis monitoring checklist

## [1.7.0] - 2026-06-19

### Enhanced
- `technical-analysis` skill — added MA Chart Analysis section: mandatory 30/60/90/200/365-day SMA position table with ASCII trend chart, MA stack signal (BULLISH/BEARISH/MIXED), crossover event detection, and a structured MA-Based Trade Recommendation block (entry price / target / stop-loss / R:R ratio / horizon)

### Added
- Data verification gate added to all 16 single-ticker skills — every skill now opens with a mandatory `⚠️ Data Verification` section requiring live price lookup, explicit stale-data warning, and data-source citation before any analysis proceeds
- `FULL-DEMO-PLTR.md` — complete all-15-skills demo for Palantir Technologies in English (275K chars), covering technical, fundamental, stock-eval, economics, sector, insider-trading, institutional-ownership, short-interest, earnings-call, chart-master, DCF, stock-valuation, options, dividend, competitor analysis + master synthesis
- `FULL-DEMO-RKLB.md` — complete all-15-skills demo for Rocket Lab USA in Traditional Chinese (106K chars), fully verified against live market data ($107.24, 52-wk $27.84–$151, Q1 2026 EPS Beat +58%)
- Project site: new **Demo** nav section with three pages — Demo Overview, PLTR Full Demo (English), RKLB 完整示範 (繁體中文)

## [1.6.0] - 2026-04-29

### Added
- `full-report` skill — orchestrates all 15 analysis modules on a ticker and saves a single professional HTML report to `output/`
- Enhanced `chart-master` skill with MA overlay, Price+Volume dual-panel, Return Histogram, RSI, MACD, and Support/Resistance charts
- Consistent Chart.js color palette and style guidelines in chart-master

## [1.5.0] - 2026-04-28

### Added
- New `/result-validator` skill: meta-analysis agent that audits any InvestSkill output across five dimensions (data quality, methodology soundness, signal consistency, risk coverage, reasoning transparency) and produces a 0–100 confidence score with tier rating (Very High / High / Medium / Low / Very Low) plus adjusted signal block
- New `/chart-master` skill: visualization agent that generates financial charts in Mermaid (primary), ASCII (fallback), and HTML/Chart.js (rich/interactive); supports bar, line, pie, horizontal comparison, fair-value range, and multi-factor signal dashboard chart types; works across Claude Code, Gemini, Cursor, and GitHub Copilot
- Both skills available as universal `prompts/result-validator.md` and `prompts/chart-master.md` for AI-agnostic platforms

## [1.4.0] - 2026-02-27

### Added
- Auto-deploy workflow (`auto-deploy.yml`): triggers after Test Suite passes on main,
  detects version bumps via git tag check, runs pre-deploy validation, publishes
  GitHub Release with .tar.gz artifacts and checksums, records result in DEPLOYMENTS.md
- `scripts/record-deploy.js`: appends structured deployment entry to DEPLOYMENTS.md
  with version, commit SHA, timestamp, release URL, and marketplace targets table
- `DEPLOYMENTS.md`: auto-maintained deployment history file seeded with v1.1.0–v1.3.0

### Improved
- `pr-check.yml`: added version consistency check, INVESTMENT SIGNAL block validation,
  skills registry integrity check, and full unit test run
- `validate.yml`: expanded required files list, stricter version mismatch handling,
  Node.js unit test step
- `.gitignore`: added `!scripts/*.js` exception so test scripts are tracked by git

## [1.3.0] - 2026-02-27

### Added
- New `/financial-report-analyst` skill for analyzing 10-K, 10-Q, annual reports, and earnings press releases
  - 8-phase analysis framework: document orientation, MD&A deep read, financial statements, risk factors, footnotes, management tone, YoY comparison, insider activity
  - Accounting quality score (0-21) with criterion breakdown
  - Red flag detection: risk factor changes, footnote anomalies, segment reporting changes
  - Management tone scoring and credibility tracking (guidance accuracy scorecard)
  - DSO/DIO/AP working capital analysis, FCF conversion rate, SBC dilution assessment
  - Supports: 10-K, 10-Q, 8-K, DEF 14A (proxy), S-1, earnings press releases

- New `/stock-valuation` skill for multi-method stock valuation with football field summary
  - Method 1: DCF with 3 scenarios (Bull 20% / Base 60% / Bear 20%), 10-year projection, sensitivity table
  - Method 2: Comparable Company Analysis (CCA) — 5-8 peers, EV/Revenue, EV/EBITDA, P/E, EV/FCF
  - Method 3: EV/EBITDA multiple valuation (conservative / base / premium)
  - Method 4: P/E multiple with PEG ratio
  - Method 5: Residual Income / Economic Value Added (for financial companies)
  - Football field chart consolidating all methods
  - Probability-weighted composite intrinsic value
  - Risk-adjusted expected return with risk/reward ratio (target: 3:1+)
  - Analyst consensus comparison

- Cross-AI compatibility (v1.3.0)
  - `GEMINI.md` — Project instructions for Gemini CLI with prompt file references
  - `.github/copilot-instructions.md` — GitHub Copilot workspace configuration
  - `.cursor/rules/invest-skill.mdc` — Cursor AI rules with skill discovery
  - `prompts/` directory with 17 universal prompt files (AI-agnostic, work with any LLM)
  - All 18 skills now available as standalone prompts for ChatGPT, Claude.ai, Gemini, and more

### Changed
- Plugin version bumped from 1.2.0 to 1.3.0
- README updated with cross-AI compatibility guide and new skills documentation
- Total skills: 16 → 18

## [1.2.0] - 2026-02-24

### Added
- New `/dividend-analysis` skill for income investing and dividend safety analysis
  - Dividend Safety Score (0-100) with letter grade and sector-specific thresholds
  - Payout ratio analysis (EPS-based and FCF-based) with stress testing
  - Dividend growth metrics: 1/3/5/10yr CAGR, Chowder Rule, Dividend Aristocrats/Kings
  - Yield trap detection with red flag checklist
  - Recession durability analysis (2000-2002, 2008-2009, 2020)
  - DRIP compound growth projections and income portfolio modeling

- New `/short-interest` skill for short squeeze and bearish positioning analysis
  - Short Interest Squeeze Score (0-10 composite) with probability tiers
  - Short float %, Days-to-Cover, and borrow rate tier classification tables
  - Short seller thesis evaluation and counter-thesis analysis
  - FINRA reporting schedule with data lag caveats
  - Options market signal integration (put/call ratio, IV skew, unusual activity)

- New `/options-analysis` skill for options Greeks, IV analysis, and strategy selection
  - Full Greeks analysis: Delta, Gamma, Theta, Vega, Rho with practical usage guidance
  - IV Rank (IVR) and IV Percentile (IVP) interpretation
  - IV term structure and volatility skew analysis
  - Strategy Selector with 6×2 selection matrix (bullish/bearish/neutral × high/low IV)
  - Earnings play analysis: expected move formula, straddle setup, volatility crush dynamics
  - Risk management: position sizing, delta hedging, rolling positions

- New `/research-bundle` meta-skill for comprehensive multi-skill investment research
  - 5-phase research process: Business Foundation → Valuation → Market Signals → Technical → Risk
  - Composite scoring framework with weighted components (Business 25%, Valuation 25%, Signals 20%, Technical 15%, Risk 15%)
  - Conflict resolution rules and consensus override logic
  - Unified investment thesis with bull/bear cases and probability-weighted scenarios
  - Entry/exit strategy and quarterly monitoring plan

- New `/dcf-valuation` skill for intrinsic value modeling
  - 8-step DCF methodology (base metrics → revenue projection → FCF margins → terminal value → WACC → discount → sensitivity → margin of safety)
  - Full WACC calculation (CAPM cost of equity, after-tax cost of debt, capital structure)
  - 5×5 sensitivity table (WACC rows vs. terminal growth rate columns)
  - Three-scenario framework: Bull (20%) / Base (60%) / Bear (20%) with probability-weighted IV
  - Common DCF pitfalls guide (SBC adjustment, TV dominance, cyclicality normalization)

- New `/competitor-analysis` skill for economic moat and competitive positioning
  - Five Sources of Economic Moat (Morningstar framework): network effects, cost advantages, intangibles, switching costs, efficient scale
  - Moat width assessment (Wide/Narrow/None/At Risk) with ROIC signal interpretation
  - Porter's Five Forces deep analysis with individual scores and industry attractiveness composite
  - Competitive benchmarking table (8+ metrics vs. top 3-5 peers)
  - Innovation and disruption positioning (disruptor vs. disrupted)
  - Composite Moat Scorecard (6 weighted components, 0-10 scale)

### Enhanced
- Enhanced `/stock-eval` skill with investment-grade depth (50 → 421 lines)
  - Piotroski F-Score (9-criterion quality scoring system)
  - Earnings Quality Score (accruals ratio, cash conversion, non-recurring items)
  - ROIC / WACC analysis with Economic Value Added (EVA) framework
  - DCF framework with 3-scenario sensitivity table
  - Management quality assessment (guidance accuracy, capital allocation track record)
  - Analyst consensus tracking with estimate revision momentum (ERM)
  - Risk Assessment Matrix (business, financial, valuation, macro)

- Enhanced `/economics-analysis` skill with macro depth (55 → 295 lines)
  - Yield Curve Analysis: 2s10s, 3M10Y, 5s30s spreads; curve shapes and recession lead times
  - Credit Market Indicators: IG/HY OAS spreads, TED Spread, MOVE Index thresholds
  - Global Macro Comparison: US/EU/China/Japan cycle positioning, PMI comparison, central bank divergence
  - Recession Probability Scoring: NY Fed model, Conference Board LEI, Sahm Rule composite

- Enhanced `/technical-analysis` skill with advanced techniques (267 → 493 lines)
  - Multi-Timeframe Analysis (MTF): 3-TF framework, alignment scoring, confluence table
  - Volume Profile Analysis: POC, Value Area (VAH/VAL), LVN/HVN trading rules, profile shapes
  - Ichimoku Cloud: all 5 components, bullish/bearish signal matrix, Kumo twist signals
  - Options Flow Integration: put/call ratio, unusual activity, IV vs. HV, GEX mechanics

### Standardized
- Added unified Investment Signal block to all 16 skills:
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
- Consistent scoring guide (0-10), confidence levels (HIGH/MEDIUM/LOW), and time horizons
- `/report-generator` updated to render signal blocks as styled HTML components

### Changed
- Updated plugin version from 1.1.0 to 1.2.0
- Added 6 new skill directories under `plugins/us-stock-analysis/skills/`
- Updated keywords to include: dcf, options, dividends, short-interest, competitive-analysis, moat, research

## [1.1.0] - 2026-02-17

### Added
- New `/report-generator` skill for HTML/PDF report generation with interactive visualizations
  - Standalone HTML reports with embedded Chart.js
  - Professional financial report styling and layout
  - Support for multiple report templates (executive summary, comprehensive, portfolio)
  - PDF export via browser print-to-PDF or command-line tools
  - Interactive charts: line, bar, candlestick, waterfall, and more

- New `/earnings-call-analysis` skill for earnings call transcript analysis
  - Sentiment analysis (bullish/neutral/bearish)
  - Management tone assessment (confidence, transparency, red flags)
  - Key themes extraction and ranking
  - Q&A session insights and analyst concerns
  - Quarter-over-quarter comparison
  - Investment implications and recommendations

- New `/insider-trading` skill for insider transaction tracking
  - SEC Form 4 filing analysis
  - Net insider sentiment calculation
  - Significant transaction identification (>$1M, >10% position change)
  - Ownership trend analysis
  - Timing and pattern recognition
  - Red flag detection for concerning patterns

- New `/institutional-ownership` skill for 13F filings analysis
  - Top institutional holders tracking
  - Quarter-over-quarter position changes (new, increased, decreased, eliminated)
  - Smart money tracking (notable investors like Buffett, Ackman, etc.)
  - Ownership concentration analysis
  - Activist investor monitoring
  - Portfolio weight analysis for high-conviction positions

### Enhanced
- Enhanced `/fundamental-analysis` skill with visualization support
  - Optional `--visual` flag for chart generation
  - Revenue/earnings growth trend charts
  - Profit margin comparison visualizations
  - Balance sheet composition charts
  - Cash flow waterfall diagrams
  - Valuation multiples comparison
  - ASCII charts for terminal display
  - Data tables formatted for report generator integration

- Enhanced `/technical-analysis` skill with chart generation
  - Optional `--chart` flag for visual analysis
  - Candlestick charts with moving averages overlay
  - Volume bar charts with average volume indicator
  - RSI, MACD, and Bollinger Bands indicator panels
  - Support/resistance level annotations
  - Pattern recognition overlays
  - ASCII charts for terminal display
  - Chart specifications for HTML report generation

### Changed
- Updated plugin version from 1.0.0 to 1.1.0
- Enhanced marketplace description to highlight new visualization and data analysis features
- Added new keywords: visualization, reports, insider-trading, institutional-ownership, earnings-calls
- Expanded documentation with report generation workflow and examples
- Updated project structure to include 4 new skill directories

### Documentation
- Added "Report Generation" section to README with workflow examples
- Updated "Available Skills" section with new skills (categorized as core vs. enhanced)
- Added usage examples for all new skills
- Updated Traditional Chinese README (README-zh-TW.md) with all new features
- Marked completed tasks in TODO.md (visualization, reports, fundamental data)
- Updated CHANGELOG.md with comprehensive v1.1.0 release notes

## [1.0.0] - 2026-02-16

### Added
- Initial release of InvestSkill marketplace
- US Stock Analysis plugin with 6 comprehensive skills:
  - Stock Evaluation (`/stock-eval`)
  - Economics Analysis (`/economics-analysis`)
  - Fundamental Analysis (`/fundamental-analysis`)
  - Technical Analysis (`/technical-analysis`)
  - Portfolio Review (`/portfolio-review`)
  - Sector Analysis (`/sector-analysis`)
- MIT License
- Comprehensive documentation

### Plugin Details
- us-stock-analysis v1.0.0
  - Professional-grade US stock market analysis
  - Integration with financial data sources
  - Actionable investment insights

[Unreleased]: https://github.com/yennanliu/InvestSkill/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/yennanliu/InvestSkill/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/yennanliu/InvestSkill/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/yennanliu/InvestSkill/releases/tag/v1.0.0
