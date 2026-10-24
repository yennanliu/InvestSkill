# InvestSkill — Full Project Scan (2026-10)

*Scan date: 2026-10-24 · Scanned at v1.13.0 (`main` @ 9925f72) · 34 skill directories / 30 advertised frameworks · 91 built site pages*

> **Scope.** A complete read-only scan of the repository: the 34 skills (and their generated prompts), every script and workflow, the test suites, the root docs, and the built site. It lists **bugs to fix**, **things to improve**, and **features to add**, each with evidence and a suggested fix. Recommendations only — no skill, prompt, script, or site page is changed in this PR.
>
> **Status (2026-10-24, after [#43](https://github.com/yennanliu/InvestSkill/pull/43) and [#44](https://github.com/yennanliu/InvestSkill/pull/44)).** Every bug in §2 is fixed and all seven batches in §5 have shipped. Item-by-item: ✅ fixed · ◐ partly · ⬜ pending, marked on every row below; §8 lists what is still open. Rows keep the evidence as found at v1.13.0, so the line numbers point at the old code.
>
> 繁體中文版：[PROJECT-SCAN-2026-10-zh-TW.md](PROJECT-SCAN-2026-10-zh-TW.md)
>
> **Relationship to earlier reviews.** This picks up after [IMPROVEMENT-ROADMAP.md](IMPROVEMENT-ROADMAP.md) (2026-09-23), whose ten headline items are all shipped (§0 there). Items that roadmap already proposed and that are still open are listed in §6 with their current status rather than re-argued. Everything else here is new.

---

## 0. How the scan was done

| What | How | Result |
|------|-----|--------|
| Unit tests | `npm test` | ✅ green in 3.8 s — test-skills 517/0 · skill contract 306/0 (34 exempt) · sync-prompts clean · test-llm-io 285/0 · test-edgar 217/0 · test-install 116/0 |
| Prompt validation | `npm run validate` | ✅ passes, but with **88 warnings**: every prompt is flagged "Missing sections: Instructions/Overview, Key Components" (`scripts/validate-prompts.js:94-95`), so the warnings carry no signal |
| Site | `npm run build:site` + `check-links` | ✅ 91 pages, 6,409 internal links, 0 broken (fragments are not checked — see B12) |
| Plugin manifests | `claude plugin validate` on the plugin and marketplace | ✅ pass; one warning: **no plugin icon** (`ICON_MISSING`) |
| Other npm scripts | `release:dry-run`, `integration-tests`, `release` | ❌ see A2–A4 |
| Content | Every SKILL.md, site content page, and root doc read; claims checked against the files | Findings below cite `file:line` |
| GitHub | Open issues and recent PRs | 10 open issues, several stale (see C1) |

Severity: 🔴 bug / wrong output · 🟠 quality or trust · 🟡 nice-to-have. Effort: **S** < half a day · **M** 1–2 days · **L** more. Status: ✅ fixed · ◐ partly · ⬜ pending.

---

## 1. Executive summary

The project is in good shape where it is tested: the offline suite is green, prompts are generated from SKILL.md, the output contract is graded against real model outputs, and the site has no broken links. The problems are in the places **no test reaches**:

1. **A template bug in 19 skills.** The `## Thesis Invalidation` section sits *inside* the signal-block code fence, so the model is shown the invalidation rules as literal text in the box template (A1). The contract checker counts the heading and passes it.
2. **The release tooling is broken.** `npm run release` only prints success messages and changes nothing; `release:dry-run` and `integration-tests` crash on a `plugin.json` `skills` array that no longer exists; and `auto-deploy.yml` can tag a release as soon as a version bump merges, contrary to the Release Timing Rule (A2–A5).
3. **`full-report` doesn't match its own contract.** Its score bands disagree with the shared parser, so a composite of 6.2 is "Hold" in the prompt but BULLISH to `signal-block.js`; `dividend-analysis` runs but never reaches the composite; and quick depth pins missing modules at 5.0 (A6–A8).
4. **The docs outside the count tests have drifted.** The platform guides linked from README still say "18 frameworks" and "v1.4.0"; FAQ, SECURITY, and PLATFORM-COMPATIBILITY say v1.4.0 is current (B17–B18).
5. **The site is hard to find and to search.** No `sitemap.xml`, `robots.txt`, Open Graph tags, or `hreflang`; and the search index keeps only the first 1,600 characters of each page, so most of the Cookbook and Glossary is unsearchable (B22–B23).

None of these needs a new feature. A focused "correctness" PR (§5, batch 1) fixes the first three; the rest are S–M each.

---

## 2. Bugs — fix first (🔴)

| # | Bug | Evidence | Fix | Effort |
|---|-----|----------|-----|--------|
| A1 ✅ | **Thesis Invalidation is inside the signal-block fence in 19 skills.** The fence opens right after "All analysis concludes with this standardized block:" and `## Thesis Invalidation` plus its trigger list are rendered as part of the code block. Also in every generated prompt and every skill page on the site | `stock-eval/SKILL.md:609-610`, `bear-case:194-195`, `stock-valuation:604-605`, `technical-analysis:616-617`, `financial-report-analyst:508-509`, `dcf-valuation:72-73`, `fundamental-analysis:30-31`; same pattern in chart-master, competitor-analysis, dividend-analysis, earnings-call-analysis, economics-analysis, industry-map, insider-trading, institutional-ownership, options-analysis, position-ladder, sector-analysis, short-interest | Move the opening fence to the line before `╔`; add a check to `check-skill-contract.js` that fails when a `##` heading appears inside a fenced block | S |
| A2 ✅ | **`npm run release` is a no-op.** Step 6 prints "✓ Version bumped / commit / tag / pushed" with no file writes or git calls | `scripts/release-interactive.js:258-263` | Implement it (bump the three manifests, stamp the CHANGELOG date, commit, tag) or delete it and document the manual steps in CLAUDE.md | M |
| A3 ✅ | **`npm run release:dry-run` crashes** on `plugin.skills.length` — `plugin.json` has no `skills` array since auto-discovery | `scripts/release-dry-run.js:63` | Use `listSkillDirs()` from `scripts/lib/skill-registry.js` | S |
| A4 ✅ | **`npm run integration-tests` fails 4 of 22 checks**, same root cause; it also excludes `report-generator` from prompts although `prompts/report-generator.md` exists | `scripts/integration-tests.js:148,244,256,270,274` | Same as A3; take exemptions from the registry | S |
| A5 ✅ | **Two release paths, one of them premature.** `auto-deploy.yml` tags and publishes when a version bump lands on `main` and tests pass — but CLAUDE.md lets feature branches bump the version. Both of its checkouts take branch HEAD, not `workflow_run.head_sha`, so a later commit can be tagged. `release.yml` builds a second, different release on tag push | `auto-deploy.yml:33,112,162-166`; `release.yml` | Keep one path: tag-triggered `release.yml` (tag created by a working `npm run release`). Retire auto-deploy or make it check out `head_sha` and only run on tags | M |
| A6 ✅ | **`full-report` score bands contradict the shared parser.** Buy starts at 6.5 and Hold is 5.0–6.4, but `signal-block.js` maps any score ≥ 6.0 to BULLISH, so a 6.2 composite fails a live eval | `full-report/SKILL.md:127-136`; `scripts/lib/signal-block.js:59` | Adopt the standard 6.0 / 4.0 cut-offs, or teach the parser a `full-report` rule (as for `fact-check`) | S |
| A7 ✅ | **`dividend-analysis` is an orphan in `full-report`** — listed as a module, but in no phase and no sub-score, so its output never reaches the composite | `full-report/SKILL.md:51` | Put it under Capital Allocation in a phase and a sub-score | S |
| A8 ✅ | **Quick depth pins missing sub-scores at 5.0**, so 15% of the composite (Risk Profile) is a constant and the moat default is averaged in | `full-report/SKILL.md:140` | Re-weight over the modules that actually ran and print which were skipped | S |
| A9 ✅ | **`site-review.js` reports 33 advertised frameworks** — it hardcodes `OUTPUT_TOOLS` and ignores aliases; the real count is 30. Every daily QA report since the aliases were reclassified is wrong | `scripts/site-review.js:52-53,103`; `qa/site_review_20261023.md` | Use `frameworkCount()` from the registry | S |
| A10 ✅ | **zh-TW Cookbook: a stray code fence swallows §3.10.** A ` ```bash ` opened inside the block starting at line 648 makes the signal box render as a paragraph and turns the "### 3.10 完整報告" heading into code; its TOC link is dead | `site/content/COOKBOOK-zh-TW.md:648,679,701` | Close the fence; add a balanced-fence lint (B12) | S |
| A11 ✅ | **Factual errors in skills** | `short-interest:160` says hedge-fund shorts are disclosed in 13F (13F covers longs only) · `portfolio-review:196,219` frames the wash-sale rule as "held > 30 days" (it is about repurchases within 30 days either side of the sale) · `tax-lens:264-273` worked example: a lot bought 2025-08-14 is called long-term for a sale around July 2026 · `economics-analysis:297` still says the Sahm rule has not triggered (it did in August 2024) · `thesis-tracker:60,155,267` sends closed files to `trade-postmortem`, which does not exist | Correct each; have `portfolio-review` defer tax mechanics to `tax-lens`; mark `trade-postmortem` as planned or ship it (§4.1) | S |
| A12 ✅ | **CI checks that check nothing.** `pr-check.yml` "Check skills registry integrity" and `check-plugin-install.sh:33` iterate `.skills[]`, which doesn't exist, so they always pass | `.github/workflows/pr-check.yml`; `scripts/check-plugin-install.sh:33` | Delete them (the registry tests in `npm test` already cover this) | S |
| A13 ✅ | **A fresh clone can't run `build:site`.** `build-site.js` requires `markdown-it` / `markdown-it-anchor`, but `package.json` declares no dependencies and `package-lock.json` is empty; CI installs them ad hoc with **three different version pins** (`markdown-it-anchor` `^8.6.7` in deploy/site-review, `^9.0.1` in `test.yml`) | `site/build/build-site.js:4-5`; `deploy-pages.yml:34`; `site-review.yml:30`; `test.yml:64-65` | Add both as `devDependencies`, commit the lockfile, use `npm ci` + npm cache in CI | S |

---

## 3. Things to improve (🟠 / 🟡)

### 3.1 Skills — contract and consistency

| # | Finding | Evidence | Fix | Effort |
|---|---------|----------|-----|--------|
| B1 🟠 ✅ | **Score scales disagree across skills.** `bear-case` says "a stronger bear case means a lower score" but never gives the conversion; `result-validator` uses five confidence tiers and a /100 scale and never maps to Signal/Score; `report-generator` and `research-bundle` omit the Confidence/Horizon guide lines; the Score Guide is bold in 5 skills, plain elsewhere | `bear-case:190,231`; `result-validator:113-118,153`; `report-generator:853`; `research-bundle:91` | State `Score = 10 − Strength` in bear-case; add a mapping table to result-validator; normalise the guide lines (and let the contract test enforce them) | S |
| B2 🟠 ✅ | **`Data & Sources` misplaced** in `full-report` (at :232, after Workflow, though it says "open the report with" it) and `portfolio-review` (Data Verification at :411) | as cited | Move both to the top, as in the other 28 skills | S |
| B3 🟡 ✅ | **Boilerplate Data Verification step 2** ("recent earnings, revenue, P/E, P/S…") in 17 skills where it doesn't fit — `chart-master`, `stock-screener` ("for the ticker") | `stock-screener:9` | Write a skill-specific step, as `economics-analysis` and `sector-analysis` already do | S |
| B4 🟠 ✅ | **Overlaps that route users wrongly.** `stock-eval` and `stock-valuation` each contain a full DCF with *different* terminal-value methods and never reference each other; `dcf-valuation` / `fundamental-analysis` descriptions don't say "alias"; live skills still point to aliases; `portfolio-review` duplicates VaR, stress tests and tax-loss harvesting without pointing to `risk-stress-test` / `tax-lens`; one-way pointers (10k-digest ↛ financial-report-analyst, earnings-call ↛ earnings-preview, result-validator ↛ fact-check) | `stock-eval:395` vs `stock-valuation:435`; `competitor-analysis:49`; `position-ladder:59,376`; `report-generator:725`; `portfolio-review:196-219,337,362` | `stock-eval` defers intrinsic value to `stock-valuation`; prefix alias descriptions with "Alias of …"; replace alias references; add reciprocal "use X instead when…" lines; add a test that no live skill references an alias | M |
| B5 🟡 ✅ | **Stale dated content.** 2025 tariff-shock window still "to be confirmed" (`risk-stress-test:99`, now known: SPX ≈ 2025-02-19 → 2025-04-08, ≈ −19%); Hindenburg (closed Jan 2025) cited as active (`short-interest:159`); 10b5-1 notes predate the 2023 cooling-off rules; a 2020–2024 year table (`stock-eval:214`); `full-report` example dated 2025-06-19; small slips (`bear-case:180` "pillars 1–7" of 6; `result-validator:25,65` cap and a macro-tailwind bias against bearish theses; two transaction-cost formulas in `portfolio-review:207,291`) | as cited | One "dated-content sweep" PR; add a yearly reminder to the release checklist | S |
| B6 🟡 ✅ | **`learning-coach`'s metric→lesson map stops at Lesson 8**, though quiz mode lists Part II lessons | `learning-coach:64,121-132` | Add Lessons 9–13 to the map | S |
| B7 🟡 ⬜ | **Prompt size outliers.** `report-generator` (≈ 9.8k tokens, 856 lines, mostly CSS) is the biggest prompt for the least analysis; `result-validator` (2.3k) and `full-report` (4.5k) are thin for what they promise | `tests/prompt-budgets.json` | Move the report template to an asset the skill references; flesh out the validator's verdict and the orchestrator's phase rules | M |
| B8 🟡 ✅ | **`full-report` advertises `zh-CN` and `ja`**, which no module supports | `full-report:205` | Drop them until they work | S |

### 3.2 Scripts, tests, and CI

| # | Finding | Evidence | Fix | Effort |
|---|---------|----------|-----|--------|
| B9 🟠 ✅ | **Hardcoded skill lists and counts in tooling** instead of the registry: "18" in `notify-release.js:145`, `publish-cursor-rules.js:57`, `publish-gemini.js:223`, `record-deploy.js:20`; `auto-deploy.yml:197` passes `SKILL_COUNT: toJSON(24)` (so every `DEPLOYMENTS.md` entry since v1.9 says 24); `setup-verify.js:217-219` treats aliases as key frameworks; `pre-release-check.js:69` | as cited | Import `frameworkCount()` / `ALIAS_SKILLS` / `OUTPUT_TOOLS` everywhere; a grep test that bans bare `['report-generator']` outside the registry | S |
| B10 🟠 ✅ | **Three overlapping PR workflows** (`test.yml`, `pr-check.yml`, `validate.yml`) each run `test-skills.js` and `test-edgar.js` and repeat jq/frontmatter/version checks in bash — yet **none runs `npm test`**, so `test-llm-io` runs only on `llm-eval.yml`'s path filter. `install-test.yml` overlaps `install-script.yml` and has no PR `paths`. `test.yml`'s build-test job overwrites `package.json` with a heredoc, renders a legacy page set and asserts `'1.3.0'` | `test.yml:30,38,57-163`; `pr-check.yml:182,185`; `validate.yml:153,156` | One `ci.yml`: `npm ci` → `npm test` → `build:site` → `check-links`, with `concurrency` and `permissions: contents: read`. Keep `install-script.yml` and `llm-eval.yml` as specialised jobs | M |
| B11 🟠 ✅ | **Daily QA commits flood history.** 114 of 279 commits on `main` are "daily site review"; the report embeds the date, so a commit lands even when nothing changed; it runs only `test-skills.js`, not the full suite | `git log`; `scripts/site-review.js:74,91` | Write the report to the job summary / an artifact and commit only when the status changes (or on failure); run `npm test` | S |
| B12 🟡 ✅ | **Test gaps.** Link check ignores `#fragments` (291 fragment links, 1 broken = A10); no test that every framework appears in `CHOOSE-A-SKILL(-zh-TW).md` — `10k-digest` and `stock-screener` are missing from both; nothing tests `build:site` output, zh-TW parity, external links, `new-skill.js`, or the release scripts; Test 14 parses `build-site.js` source with a regex | `scripts/check-links.js`; `test-skills.js:684` | Check anchors and balanced fences; assert CHOOSE-A-SKILL coverage; export `SKILL_CATEGORIES` and `require` it; add a smoke test that runs `new-skill.js` in a temp dir | M |
| B13 🟡 ✅ | **Dead or placeholder scripts.** `generate-changelog.js` (unwired); `publish-cursor-rules.js` / `publish-gemini.js` (TODO placeholders targeting an invented `registry.gemini.ai`, run with `continue-on-error`, output never uploaded); `notify-release.js` (manual only); `validate-prompts.js` warnings that fire on every prompt | as cited | Delete or move to `scripts/archive/`; make `validate-prompts.js` check the sections prompts really have | S |
| B14 🟡 ✅ | **Small script robustness.** `new-skill.js` escapes only `&` in category regexes (`:258,270,278`) and runs `execSync` on an unquoted path (`:307`); `sync-prompts.js` silently ignores an unknown skill name (`:61`) and `--check` never flags an orphan prompt | as cited | Shared `escapeRegExp`; `execFileSync`; error on unknown names; diff prompt names vs. skill dirs | S |
| B15 🟡 ⬜ | **No lint / format / type-check.** No eslint, prettier, `.editorconfig`, `.nvmrc`, or `// @ts-check`; shellcheck only in CI; colour/pass/fail helpers duplicated across 7 scripts. `engines` still allows Node 18 (EOL), tested only by the install job | `package.json`; `install-script.yml:75` | Add `.editorconfig` + `.nvmrc` + `// @ts-check` on `scripts/lib/*`; a shared `scripts/lib/report.js`; raise `engines` to ≥ 20 | M |
| B16 🟡 ◐ | **Workflow hygiene.** No top-level `permissions:` in 4 workflows; `concurrency` only in 2; `softprops/action-gh-release@v1` (v2 is current); actions pinned to tags, not SHAs; `install-script.yml` push `paths` omit `scripts/lib/**` | as cited | Fold into B10 | S |

### 3.3 Docs

| # | Finding | Evidence | Fix | Effort |
|---|---------|----------|-----|--------|
| B17 🔴 ✅ | **Platform guides linked from README have stale counts**: "18 frameworks" (`README-claude-code.md:3,50`, `README-cursor.md:51`), "21 frameworks" (`README-gemini.md:49`), and `README-claude-code.md:87` still recommends the deprecated `research-bundle` | as cited | Fix, and add these files to `COUNT_DOCS` in `test-skills.js` | S |
| B18 🟠 ✅ | **"Current version v1.4.0"** in `FAQ.md:37,167,293,307`, `README-claude-code.md:227,365`, `SECURITY.md:86-98,221` (support table), `PLATFORM-COMPATIBILITY.md:35,87,148,214,292,476-480` | as cited | Say "latest" or read the version from `plugin.json`; update SECURITY's support table; add a version-claim check | S |
| B19 🟠 ✅ | **Release and contributor docs out of date.** `RELEASE-QUICK-REFERENCE.md` bumps "two files" (not three) and never mentions `npm run release`; `ADDING-NEW-SKILLS.md` says skills are auto-discovered (:172) but its checklists still say "Registered in plugin.json" (:321,397), "270+ tests" (:356), and it never mentions `new-skill.js` (nor does CONTRIBUTING); `CI-CD-GUIDE.md:181,256-260` points to files that don't exist; `DEPLOYMENTS.md` has no v1.13.0 entry | as cited | Make the skill checklist "run `node scripts/new-skill.js`"; rewrite the release guide from the CLAUDE.md rules once A2/A5 land | S |
| B20 🟡 ◐ | **Root-doc sprawl.** ≈ 2,600 lines across `README-claude-code` / `-cursor` / `-gemini` / `-ollama`, `PLATFORM-COMPATIBILITY`, and `FAQ` repeat install and usage and are the stalest files; release info is split across `RELEASE_NOTES`, `CHANGELOG`, `RELEASE-QUICK-REFERENCE`, `DEPLOYMENTS`; `.github/ENABLE_PAGES_NOW.md` / `SETUP_PAGES.md` are one-time notes | file sizes | One platform guide driven by `install.sh`'s agent list; keep CHANGELOG + generated DEPLOYMENTS; archive the rest to `doc/archive/` | M |
| B21 🟡 ✅ | **README inconsistencies.** Quick Start leads with `install.sh` but the Platform Support table says "Clone repo" (`README.md:250-253`); FAQ "50+ answers" (43 counted); "dark-theme UI" (site defaults to light/system); two site URLs in use (`yennanliu.github.io/InvestSkill` 119× vs canonical `yennj12.js.org`); `README-zh-TW.md:204-239` keeps a v1.8–v1.13 history the EN README dropped | as cited | Align; standardise on the canonical URL | S |

### 3.4 Site

| # | Finding | Evidence | Fix | Effort |
|---|---------|----------|-----|--------|
| B22 🟠 ✅ | **No SEO plumbing**: no `sitemap.xml`, no `robots.txt`, 0/90 pages with `og:image`, `twitter:card`, or `hreflang` alternates — though the language toggle already knows every EN↔zh pair | built `_site/` | Emit all of them from `build-site.js`; one default OG image | S |
| B23 🟠 ✅ | **Search sees only the first 1,600 characters of each page.** "Sortino" (in the Glossary) returns no hits; most of the 138 KB Cookbook is unsearchable | `site/build/build-site.js:1679` | Index per heading section (title + anchor + text), which also lets results deep-link | M |
| B24 🟠 ✅ | **Accessibility.** Light-mode link/accent `#e8664e` on `#faf8f5` is 3.08:1, white on accent buttons 3.26:1, `--text-dim` 2.56:1 (AA needs 4.5:1); 53 pages have two `<h1>`; no skip link | `site/build/style.css`; built pages | Darker link token (`--accent-ink`), demote the markdown H1, add a skip link | S |
| B25 🟡 ✅ | **Page weight.** `full-demo-rklb.html` 274 KB with 1.5 MB of images loaded up front; none of 58 `<img>` have `loading="lazy"` or dimensions | built `_site/` | Lazy-load and size images in the renderer | S |
| B26 🟡 ◐ | **zh-TW gaps and drift.** No zh Skill Reference index (nav says `技能參考（英文）`, `build-site.js:1108`); skill pages, changelog, contributing, 404 are EN-only; zh Cookbook lacks six EN sections (WACC Calculation, Sensitivity Table, Document Orientation, Investment Thesis, Indicator Signals, Risk Factors); demo files AMD/RKLB are Chinese but lack the `-zh-TW` suffix (cross-ticker pairing at `build-site.js:184-188`) | as cited | `skills-zh-tw.html` with zh categories; port the six sections; a `check-zh-parity.js` (roadmap §6.6) | M |
| B27 🟡 ✅ | **FAQ isn't on the site**; 404 page is EN-only with no search | `FAQ.md`; `404.html` | Build FAQ into both languages (after B18 refresh); bilingual 404 with search | S |

### 3.5 Repository and community

| # | Finding | Fix | Effort |
|---|---------|-----|--------|
| C1 🟡 ◐ | **Open issues need triage.** #5 (plugin fails to load: frontmatter missing `name:`) no longer reproduces — `claude plugin validate` passes — but has only a bot reply; #6–#10 are one-word ticker requests ("AAPL", "NVDA", "Mram"); #2 "TODO 1"; #24 is a third-party promotion; #11 "submit to community marketplace" is still open and the validator reports **no plugin icon** | Comment on and close #5 (optionally add `name:` to frontmatter defensively); close #2, #6–#10 with a pointer to the docs; decide on #24; for #11 add `.claude-plugin/icon.png` (512–2048 px) and submit. Add issue templates (bug / skill request / question) so ticker-only issues get redirected | S |
| C2 🟡 ✅ | **Marketplace descriptions predate the newer skills** — neither `plugin.json` nor `marketplace.json` mentions ETF, tax, earnings preview, thesis tracking, risk stress test, or fact-check, the features that most distinguish the plugin now | Refresh both descriptions and `keywords` | S |

---

## 4. Features to add

### 4.1 New skills

Tier 2 from the roadmap (§3.2 there) is still the right list; this scan adds evidence for priority and five gaps the roadmap doesn't cover.

| Skill | Why now | Status / evidence | Effort |
|-------|---------|-------------------|--------|
| ✅ **`trade-postmortem`** | `thesis-tracker` already sends closed files to it — a dangling reference today (A11) | Roadmap Tier 2 · referenced, not built | M |
| ✅ **`forensic-accounting`** | No Altman Z, Beneish M, accruals ratio, or SBC-adjusted FCF anywhere except a mention in `bear-case` | Roadmap Tier 2 | M |
| ✅ **`compare`** (2–5 tickers head-to-head) | The most common retail question ("X or Y?") has no skill; `stock-screener` ranks but doesn't argue the pair | **New** | M |
| ✅ **`credit-check`** (solvency) | Debt maturity wall, interest coverage trend, ratings, covenants, refinancing risk at current rates — nowhere in the catalogue | **New** | M |
| ✅ **Sector KPI packs** (`--sector bank / insurer / reit / biotech / saas`) | Generic metrics mislead here: bank CET1 / NIM, insurer combined ratio (absent everywhere), REIT AFFO, biotech pipeline / cash runway, SaaS NRR / Rule of 40. Best as a flag on `stock-eval` / `financial-report-analyst` rather than five skills | **New** | M |
| ⬜ **`special-situations`** | Spin-offs, merger arbitrage spread, tender offers, rights issues | **New** | M |
| ⬜ **`watchlist`** | A multi-thesis monitor across saved `thesis-tracker` files: which are WEAKENED, what catalysts land this week | **New** — builds on thesis-tracker's saved-file contract | M |
| ⬜ `proxy-governance`, `ipo-analysis`, `pair-trade`, `investment-policy` | As in the roadmap | Roadmap Tier 2 | M each |

### 4.2 Enhancements to existing skills

| Enhancement | Evidence | Effort |
|-------------|----------|--------|
| ✅ **`full-report --depth comprehensive` runs every framework** — add `earnings-preview`, `industry-map`, `10k-digest`, `chart-master`, `position-ladder`, and save the thesis via `thesis-tracker`; make `fact-check` / `result-validator` real modules rather than prose; add `--skip <skill>` (still missing) | Comprehensive runs 15/30 (`full-report:250`) · roadmap §4.3, TODO #1 | M |
| ✅ **`--lang zh-TW` on every framework** — only 3/30 support it (`10k-digest`, `full-report`, `learning-coach`). A shared "Bilingual output" paragraph via the `new-skill.js` template + a contract check | TODO #2 | M |
| ✅ **Machine-readable JSON footer** after the box (signal, score, confidence, horizon, as-of, sources) — none exists; it would let `eval-skills.js`, `result-validator`, and `watchlist` parse results without box-drawing regex | TODO #2 | M |
| ⬜ `stock-valuation --reverse` (reverse DCF: what growth the price implies) | Roadmap §4.4, not started | S |
| ⬜ `stock-screener` presets (quality-value, GARP, dividend growth, momentum) | Roadmap §4.4, not started | S |
| ⬜ `portfolio-review` broker CSV import (Schwab / Fidelity / IBKR column maps) | Roadmap §4.4, not started | S |
| ⬜ `catalyst-calendar`: ex-dividend and monthly options-expiry dates | Partial (lock-ups :174, index inclusion :169) | S |
| ⬜ `economics-analysis`: one standard regime verdict (expansion / slowdown / contraction / recovery) other skills can cite | Partial (:193) | S |
| ⬜ `technical-analysis`: relative strength vs. sector ETF and SPY | Generic line only (:99) | S |
| ⬜ `dividend-analysis`: withholding-tax line for non-US holders | Only ADRs mentioned (:259) | S |
| ✅ `result-validator`: Signal/Score mapping + JSON verdict | B1, roadmap §4.4 | S |

### 4.3 Site and learning

| Feature | Status | Effort |
|---------|--------|--------|
| ✅ Lessons **Macro & the Fed Cycle** and **Options for Stock Investors** | Open (roadmap §5.1, TODO #3) | M each |
| ✅ Self-check quizzes for Lessons 1–8 (Part II already has them) and the **printable cheat sheet** | Open (§5.4) | M |
| ✅ **Non-US Investor Guide** page (brokers, FX, W-8BEN, account opening) | Open (§5.4, TODO #4) | M |
| ✅ Glossary 76 → ~95: the 18 terms on §5.3's list (Beneish, accruals, SBC, non-GAAP, Form 4, 13F, 8-K, yield curve, VIX, put/call, ATR, MACD, goodwill, operating leverage, reverse DCF, Rule of 40, lock-up, dual-class) plus covered call, CPI, Fed funds | Open — still 76 | S |
| ⬜ Case studies: a **thesis-break** case and the **$10k ETF core** case | Open (§5.2) | M |
| ⬜ **Interactive zero-runtime tools**: a prompt builder (pick skill + flags → copy command), a margin-of-safety / reverse-DCF calculator | Open (§5.5) | M |
| ⬜ **"As-of" banners** on every demo page (data date, skill version) | **New** — demos are dated 2026-10-11 and will age | S |
| ◐ **Section-level search** with deep links (B23) and search on the 404 page | **New** | M |
| ✅ zh Skill Reference index + zh category headings on skill pages (B26) | Open (§5.6) | M |

### 4.4 Tooling

| Feature | Why | Effort |
|---------|-----|--------|
| ✅ **A working `npm run release`** (A2) | The Release Timing Rule depends on it | M |
| ✅ **`check-zh-parity.js`** — heading-count and section-name diff for every EN/zh pair | Would have caught the Cookbook drift (B26) and the swallowed heading (A10) | S |
| ✅ **Fence / heading lint** for SKILL.md and site content | Would have caught A1 and A10 | S |
| ⬜ **Scheduled live eval** (weekly, all single-ticker skills, cost-capped) writing a trend table of contract pass rate per skill | Today the live eval runs only for changed skills; model updates can regress untouched ones silently | M |
| ⬜ **Generated "Current State"** block for CLAUDE.md (version, counts) | Removes the last hand-maintained counts | S |

---

## 5. Prioritised plan — suggested PR batches

| Batch | Contents | Effort | Why this order |
|-------|----------|--------|----------------|
| **1 · Correctness** | A1 (fence fix in 19 skills + lint), A6–A8 (`full-report` bands, dividend module, re-weighting), A11 (factual fixes), A10 (zh Cookbook fence), A9 (site-review count) | M | Wrong output reaches users and models today |
| **2 · Release & CI** | A2–A5, A12, A13, B9–B11, B16: one release path, one CI workflow running `npm test`, registry everywhere, real dependencies, quiet QA commits | M | Unblocks the next release; removes checks that lie |
| **3 · Docs refresh** | B17–B21 + extend `COUNT_DOCS` and add a version-claim check; C1 issue triage; C2 descriptions; plugin icon | S–M | Credibility; cheap |
| **4 · Site** | B22–B25, B27 | M | Discoverability and accessibility |
| **5 · Contract features** | `--lang zh-TW` everywhere, JSON footer, B1–B4 consistency, `full-report` comprehensive + `--skip` | M–L | The two open TODO items; the JSON footer enables `watchlist` and better evals |
| **6 · New skills** | `trade-postmortem` → `forensic-accounting` → `compare` → `credit-check` → sector packs | L | Highest user-value additions; start with the one already referenced |
| **7 · Learning** | §4.3 lessons, quizzes, cheat sheet, non-US guide, glossary, zh parity | L | Ongoing |

Batches 1–3 are a patch release (`1.13.1`); batch 5 or the first new skill is the next minor (`1.14.0`).

---

## 6. Status of open roadmap items

| Roadmap item | At the scan (v1.13.0) | Now |
|--------------|-----------------------|-----|
| §4.3 `full-report` runs every framework, `--skip` | 15/30 frameworks; no `--skip` | ✅ #44 — quick 5 · standard 10 · comprehensive 25 (every framework that applies to one stock), `--skip` |
| §4.1 `--lang zh-TW` on every skill | 3/30 | ✅ #44 — all 34 frameworks, enforced by the contract check |
| §4.1 JSON footer | none | ✅ #43 — every skill, parsed and checked against the box |
| §4.4 targeted upgrades | mostly open | ◐ `result-validator` contract checks and signal mapping done (#43); `--reverse`, screener presets, broker CSV, catalyst dates, regime verdict, relative strength, withholding line still open |
| §5.1 Macro & Fed, Options lessons | open | ✅ #43 — Lessons 14 and 15, EN + zh-TW |
| §5.3 glossary gaps | 76 terms | ✅ #44 — 124 terms in both languages |
| §5.4 cheat sheet, non-US guide | open | ✅ cheat sheet #43 · Non-US Investor Guide #44 |
| §5.5 interactive tools | open | ⬜ open |
| §5.6 zh Skill Reference index | open | ✅ #44 — `skills-zh-tw.html` |
| §6.6 zh parity checker | open | ✅ #43 — `check-zh-parity.js` in `npm test` |
| §3.2 Tier 2 skills | none shipped | ◐ `forensic-accounting`, `trade-postmortem` shipped (#43); `proxy-governance`, `investment-policy`, `ipo-analysis`, `pair-trade` open |

---

## 7. Deliberately not proposed

The roadmap's §9 still holds: no live-data or broker APIs inside the skills, no crypto/forex, no ML price prediction, no change to the signal block's six fields. This scan also does **not** propose analytics on the site — "nothing phones home" is part of the product; if usage data is ever wanted it should be cookieless and stated on the Data & Accuracy page.

---

## 8. Progress

Updated 2026-10-24, after [#43](https://github.com/yennanliu/InvestSkill/pull/43) (batches 1–7) and [#44](https://github.com/yennanliu/InvestSkill/pull/44) (the roadmap's P0–P2 items that overlapped batches 5 and 7) were merged.

### 8.1 By batch

| Batch | Status | PR | What shipped |
|-------|--------|----|--------------|
| 1 · Correctness | ✅ | #43 | A1 (19 skills + a contract check that the box fence holds only the box), A6–A8, A9, A10, A11; also B5, B6, B8 |
| 2 · Release & CI | ✅ | #43 | A2 (`scripts/lib/release.js`), A3–A5 (`release.yml` is the only release path), A12, A13, B9–B14; `ci.yml` replaces four workflows; anchor checks, fence lint, Choose-a-Skill coverage, `new-skill.js` smoke test |
| 3 · Docs refresh | ✅ | #43 | B17–B19, B21; wider `COUNT_DOCS` and a stale-"current version" test; C2; plugin icon; issue templates |
| 4 · Site | ✅ | #43 | B22–B25, B27 |
| 5 · Contract features | ✅ | #43, #44 | JSON footer + parser; B1–B4; `--lang zh-TW` on every framework; `full-report` comprehensive + `--skip` |
| 6 · New skills | ✅ | #43 | `trade-postmortem`, `forensic-accounting`, `compare`, `credit-check`, `--sector` KPI packs — 34 frameworks |
| 7 · Learning | ✅ | #43, #44 | Lessons 14–15, Check-yourself for Lessons 1–8, cheat sheet, zh Cookbook parity; glossary 76 → 124, Non-US Investor Guide, zh Skill Reference |

### 8.2 Still pending

| Item | What is left | Where it is tracked |
|------|--------------|---------------------|
| B7 | Move `report-generator`'s HTML/CSS template out of the prompt; flesh out `result-validator` and `full-report` further | `TODO.md` #5 |
| B15 | eslint, `// @ts-check` on `scripts/lib/`, `.editorconfig` / `.nvmrc`, `engines` ≥ 20 | `TODO.md` #5 |
| B16 | Actions are still pinned to tags, not SHAs | — |
| B20 | Platform guides were refreshed, not merged into one guide driven by `install.sh` | — |
| B26 | `FULL-DEMO-AMD.md` / `FULL-DEMO-RKLB.md` keep their names (the parity check knows the cross-ticker pairs); skill pages stay English by design | — |
| C1 | Maintainer action: comment on and close #5 (no longer reproduces), #2, #6–#10; decide #24; submit the listing for #11 ([onboarding guide](ANTHROPIC-DIRECTORY-ONBOARDING.md)) | GitHub issues |
| §4.1 | `special-situations`, `watchlist`, `proxy-governance`, `ipo-analysis`, `pair-trade`, `investment-policy` | `TODO.md` #1 |
| §4.2 | `stock-valuation --reverse`, screener presets, broker CSV, catalyst ex-div / options-expiry dates, one regime verdict, relative strength, non-US withholding line | `TODO.md` #3 |
| §4.3 | Thesis-break and $10k ETF case studies, interactive zero-runtime tools, "as-of" banners on demos, search on the 404 page | `TODO.md` #2, #4 |
| §4.4 | Scheduled live eval with a pass-rate trend; generated "Current State" block in CLAUDE.md | `TODO.md` #4 |
