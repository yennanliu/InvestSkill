# InvestSkill — Project Review & Improvement Ideas

*Review date: 2026-07-02 · Reviewed at v1.8.1 · 24 skills / 24 prompts / 327 passing tests*

A structured review of the InvestSkill project with prioritized, actionable improvement ideas. Findings are grounded in the current codebase; each carries a rough effort/impact estimate and, where useful, file references.

---

## 1. Executive summary

InvestSkill is a **mature, well-organized prompt-engineering plugin**. The dual-form distribution (Claude Code `SKILL.md` + universal `prompts/*.md`), the standardized signal block, the multi-platform config story, and a 327-test suite are all above the bar for a project of this kind. The documentation site is now polished and bilingual.

The biggest opportunities are **not** new features — they are **consistency, trust, and discoverability**:

1. **Numeric drift.** The framework count is stated as **18, 21, 22, 23, and 24** in different files, and `package.json` is three minor versions behind the manifests. This is the single most visible quality issue.
2. **Trust & data provenance.** The skills' output quality depends entirely on the data the host LLM can reach, yet there's no built-in, machine-checkable way to know whether an analysis used real or hallucinated numbers.
3. **Discoverability.** The docs site's search box is decorative (not wired up), and the Traditional Chinese site covers only 15 of 23 pages.

Fixing #1 is a half-day quick win; #2 and #3 are where the product can most differentiate.

---

## 2. What's working well (keep doing)

- **Two-form skill distribution** with a test that keeps `SKILL.md` and `prompts/*.md` in sync — genuinely hard to maintain by hand, well-solved here.
- **Standardized signal block** — a strong, teachable through-line across every skill and now the Learning curriculum.
- **Test discipline** — 327 structural/format tests, `validate`, `pre-release`, and integration tests wired into CI.
- **Docs site** — data-generated from the same markdown sources, language-aware nav, warm/clean design, and a bilingual 8-lesson Learning curriculum.
- **Educational framing & disclaimers** — consistent "not financial advice" posture reduces real-world risk.

---

## 3. Findings & improvement ideas

Grouped by theme. Severity: 🔴 correctness/trust · 🟠 quality · 🟡 nice-to-have.

### A. Correctness & consistency (mostly quick wins)

| # | Finding | Evidence | Fix | Effort |
|---|---------|----------|-----|--------|
| A1 🔴 | **Framework count is inconsistent** — stated as 18/21/22/23/24 | `README.md:20,69` (23) · `docs/build-site.js:880` (21) · `README-zh-TW.md:22,318` (18) · `CLAUDE.md:74` (22 prompts) · actual = 24 | Define **one source of truth** (derive from `plugins/.../skills/` count at build time) and interpolate everywhere. Decide the canonical "advertised" number (some counts exclude meta skills like `full-report`/`research-bundle`/`report-generator`) and document the rule. | S |
| A2 🔴 | **`package.json` version drift** — 1.4.0 vs manifests' 1.8.1 | `package.json` vs `plugin.json`/`marketplace.json` | Add `package.json` to the version-consistency rule (`CLAUDE.md §Version Consistency`) and to `pre-release-check.js`. | S |
| A3 🟠 | **`CLAUDE.md` "Current State" is stale** | Says "22 prompts (research-bundle is meta-only, no standalone prompt)" but `prompts/research-bundle.md` **and** `full-report.md` both exist → 24 | Update, and better: generate the "Current State" block from the filesystem in a script so it can't drift. | S |
| A4 🟠 | **`research-bundle` vs `full-report` overlap** — the skill description says research-bundle is "now unified into full-report," yet both ship as separate skills+prompts | skill/prompt lists | Either fully deprecate `research-bundle` (leave a stub that points to `full-report`) or clarify the distinct role of each. Ambiguity here confuses skill selection. | M |

> **Recommendation:** ship A1–A3 as a single "consistency" PR. It's the highest impact-to-effort work in the project and directly affects credibility.

### B. Testing & CI

| # | Finding | Fix | Effort |
|---|---------|-----|--------|
| B1 🟠 | Tests validate **structure/format** but not **cross-file counts** | Add a test asserting `skills == prompts == advertised count` across README(s), `build-site.js`, and manifests. This alone prevents A1 from recurring. | S |
| B2 🟠 | **No link-checker for the docs site** — broken internal links only caught by manual grep | Add a CI step that builds `_site/` and fails on any `href` to a missing local file (the exact grep used in review, formalized). | S |
| B3 🟡 | **No content/prose linting** on skills/prompts | Add a light markdown-lint + a check for required sections (H1, signal block, disclaimer) beyond what exists, and a spell/terminology check for the bilingual glossary terms. | M |
| B4 🟡 | **No snapshot of rendered output** | Consider a tiny golden-file test that renders one skill through `markdown-it` and diffs, catching accidental template regressions. | M |

### C. Content & product (differentiation)

| # | Finding | Fix | Effort |
|---|---------|-----|--------|
| C1 🔴 | **Data provenance is invisible.** Output quality depends on what the host LLM can fetch, but a reader can't tell real data from a plausible hallucination. | Standardize a **"Data & Sources" header** in every analysis (as-of date, source, retrieval method, and a confidence flag). `result-validator` already scores this — promote it from optional to a required footer on composite reports, and teach the pattern in `DATA-AND-ACCURACY.md`. | M |
| C2 🟠 | **No live-data path** (top of `TODO.md`). | Rather than bundling API keys, document a **"bring-your-own-tool" recipe**: how to point each skill at an MCP data server / web fetch / uploaded filing, with a worked example. Positions the limitation as a feature (model-agnostic). | M |
| C3 🟠 | **Learning curriculum has no self-check.** | Add short **"Check yourself"** prompts or a mini-quiz at the end of each lesson, and a one-page **printable cheat-sheet / checklist** capstone (the Playbook's pre-trade checklist is a natural seed). | M |
| C4 🟡 | Skills are strong individually but **chaining is under-documented** for non–Claude-Code users. | Expand `COOKBOOK` with copy-paste multi-skill pipelines for Cursor/Gemini/ChatGPT (the plugin auto-chains; universal users must do it manually). | S |
| C5 🟡 | TODO backlog (VaR, factor analysis, pairs trading, crypto) is large and unprioritized. | Convert `TODO.md` into GitHub Issues with labels/milestones; keep `TODO.md` as a curated top-5. | S |

### D. Docs site & UX

| # | Finding | Evidence | Fix | Effort |
|---|---------|----------|-----|--------|
| D1 🟠 | **Search is non-functional** — the ⌘K box is decorative | `docs/main.js` has no search handler | Wire client-side search with a prebuilt static index (e.g. a small JSON index generated at build + a lightweight in-page matcher, or Pagefind). High perceived-quality win. | M |
| D2 🟠 | **zh-TW site covers 15 of 23 pages** — no Chinese Skill Reference, per-skill pages, Changelog, or Contributing | built `_site` counts | Decide the zh scope explicitly; at minimum generate a zh **Skill Reference index** (skill bodies can stay English with a zh wrapper) so the language switch never dead-ends to English-only. | M |
| D3 🟡 | **Large demo files** (`FULL-DEMO-PLTR.md` 290 KB, `RKLB` 197 KB) ship in-repo and build into single HTML pages | `ls -S` | Fine for now; if they grow, consider collapsible sections or splitting, and lazy-loading images. | S |
| D4 🟡 | Theme toggle exists but **light is the only "designed" theme** post-redesign; dark is retained but less tuned. | Spot-check dark mode on the new Learning pages / tables and fix any low-contrast spots. | S |

### E. Developer experience & maintainability

| # | Finding | Fix | Effort |
|---|---------|-----|--------|
| E1 🟠 | **Counts/labels hardcoded in many places** (root cause of A1) | Centralize site/config constants (version, counts, categories) in one JSON consumed by `build-site.js`, README generators, and manifests. | M |
| E2 🟡 | `ADDING-NEW-SKILLS.md` is a **12-step manual checklist** — error-prone | Add a `scripts/new-skill.js` scaffolder that creates both files, updates categories, and runs validate. | M |
| E3 🟡 | Many top-level `.md` docs (30+) with some overlap (CI-CD-GUIDE, CI-CD-FIXES-SUMMARY, DEPLOYMENT-STATUS, DEPLOYMENTS…) | Consolidate/retire historical status docs into `docs/` or an archive; keep the root lean. | S |

---

## 4. Prioritized roadmap

| Priority | Theme | Items | Why now |
|----------|-------|-------|---------|
| **P0 — this week** | Consistency | A1, A2, A3, B1 | Credibility; half-day of work; stops recurrence |
| **P1 — this month** | Trust & discoverability | C1, D1, B2, A4 | Directly improves the reader's ability to trust and find analysis |
| **P2 — next** | Depth & scale | C2, C3, D2, E1, E2 | Differentiation and maintainability once the foundation is tight |
| **Backlog** | New skills | TODO items via C5 | Prioritize against real user demand |

---

## 5. Quick-wins checklist (P0)

- [ ] Pick the canonical framework count and its rule; interpolate it (don't hardcode) in README, README-zh-TW, `build-site.js` (`skills.html` subtitle), and the home card.
- [ ] Bump `package.json` to `1.8.1`; add it to the version-consistency rule + `pre-release-check.js`.
- [ ] Refresh `CLAUDE.md` "Current State" (24 prompts; clarify research-bundle/full-report).
- [ ] Add a test: `skills === prompts === advertised count` across all surfaces.
- [ ] Add a docs link-check step to CI.

---

*This review covers structure, consistency, testing, content, docs/UX, and DX. It intentionally favors high-leverage consistency and trust work over new features — the foundation is strong, and tightening it will pay off faster than adding skills.*
