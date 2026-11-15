# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                    # Run all unit tests (skill/structure + install script)
npm run test:skills         # Skill/structure tests only (270+ checks)
npm run test:install        # install.sh tests (static checks + sandboxed runs)
npm run validate            # Validate prompt file contents and format
npm run pre-release         # Full pre-release check: pre-release-check + validate + test
npm run verify              # Verify local setup is correct
npm run release:dry-run     # Preview release without making changes
npm run release             # Cut a release from main: bump 3 manifests, stamp CHANGELOG, commit, tag, push
npm run test:tooling        # Release library, release workflow, new-skill.js smoke test (part of npm test)
npm run test:site           # Site language switcher: lang-pairs.js + the rendered 文A menu on every page (part of npm test)
npm run check:zh            # EN ⇄ zh-TW site-content parity (part of npm test)
npm run integration-tests   # Run integration tests
npm run test:llm-io         # Offline output-contract, prompt and eval-harness checks (part of npm test)
npm run prompt:diff         # What this branch changed in the prompts (tokens, description, contract)
npm run prompt:budgets      # Rewrite tests/prompt-budgets.json after an intended prompt-size change
npm run eval:claude -- --skills stock-eval   # Live eval through the Claude API (needs ANTHROPIC_API_KEY + the SDK)
```

Validate JSON manifests manually:
```bash
jq empty plugins/us-stock-analysis/.claude-plugin/plugin.json
jq empty .claude-plugin/marketplace.json
```

## Architecture

InvestSkill is a **prompt-engineering plugin**, not traditional software. There is no application runtime — the "skills" are structured markdown frameworks that guide AI assistants through investment analysis workflows.

### Skill Distribution Model

Each skill lives in two forms simultaneously:

1. **`plugins/us-stock-analysis/skills/<name>/SKILL.md`** — Claude Code form, includes YAML frontmatter (`---\ndescription: ...\n---`) and uses slash command syntax
2. **`prompts/<name>.md`** — Universal form, identical content but with frontmatter stripped, AI-agnostic (no slash commands)

These two files must stay in sync. The `prompts/` version is what Cursor, Gemini CLI, GitHub Copilot, and ChatGPT users access.

### Platform Config Files

| File | Platform |
|------|----------|
| `plugins/us-stock-analysis/.claude-plugin/plugin.json` | Claude Code plugin manifest |
| `.claude-plugin/marketplace.json` | Claude marketplace listing |
| `.cursor/rules/invest-skill.mdc` | Cursor IDE auto-loading rules |
| `.github/copilot-instructions.md` | GitHub Copilot auto-loading |
| `GEMINI.md` | Gemini CLI auto-loading |

### Signal Block Requirement

Every SKILL.md and every `prompts/*.md` must close with the standardized Investment Signal section: the box-drawn block (UTF-8 box-drawing characters), followed only by the Score Guide / Confidence / Horizon lines, an optional one-paragraph mapping note, and the `**Disclaimer:**` line. Nothing else may follow the block. The box's code fence holds the box alone — no heading inside it. Just above the box fence, every skill also defines the **JSON footer** the model emits right after the box (```` ```json {"investskill": "1", "skill": …, "signal": …, "score": …} ```` — same values as the box, parsed by `parseJsonFooter` in `scripts/lib/signal-block.js`; optional on outputs, but it must agree with the box when present). `check-skill-contract.js` validates the block, the footer template and the clean fence; `test-llm-io.js` validates the closing order. Every framework also carries the shared **🌐 Output Language — `--lang zh-TW`** section (everything in Traditional Chinese except the Data & Sources labels, the box and the footer); the contract check requires it.

## Adding a New Skill (12-step process)

See `ADDING-NEW-SKILLS.md` for the full walkthrough. Key steps:

1. Create `plugins/us-stock-analysis/skills/<name>/SKILL.md` with frontmatter
2. Create `prompts/<name>.md` — same content, no frontmatter, no platform-specific syntax
3. Skills are auto-discovered from the `skills/` directory — no changes needed in `plugin.json`
4. Bump version in **all three**: `plugin.json`, `.claude-plugin/marketplace.json` (both `metadata.version` and the plugin entry), and `package.json` (must match — see Version Consistency Rule)
5. Update `.cursor/rules/invest-skill.mdc`, `.github/copilot-instructions.md`, `GEMINI.md` (table row + example + directory tree)
6. Update `README.md` and platform-specific `README-*.md` files (framework table row + count)
7. **Update the site** (both English and Traditional Chinese — see Site Update Rule)
8. Add entry to `CHANGELOG.md`
9. Run `npm run pre-release` (pre-release-check + validate + `npm test`) to confirm all tests pass
10. Run `npm run build:site` to confirm the site builds and the new skill lands in the right category

## Site Update Rule

The public site (`site/`) is generated by `site/build/build-site.js` and deployed by CI — the `_site/` output is gitignored, so you commit **source**, not built HTML. **Whenever a skill is added, renamed, or removed, update the site in the same change:**

1. **`site/build/build-site.js` → `SKILL_CATEGORIES`** — add the skill to the correct category so it appears in the right group on `skills.html` (an unlisted skill still renders, but falls into a generic "Other" bucket). Keep these categories mirroring the README's framework table.
2. **`site/content/CHOOSE-A-SKILL.md` and `CHOOSE-A-SKILL-zh-TW.md`** — add a "goal → skill" row so users can discover it (both languages).
3. **`site/content/COOKBOOK.md` and `COOKBOOK-zh-TW.md`** — update the framework count and, if the skill warrants it, add a usage recipe (both languages).
4. Per-skill reference pages (`skill-<name>.html`) are auto-generated from `prompts/<name>.md` — no manual page needed.
5. Run `npm run build:site` and confirm: `All N frameworks` shows the new count, `skill-<name>.html` is generated, and the skill is not stranded under "Other".

Always update **both** the English and Traditional Chinese (`-zh-TW`) variants of any site content file you touch.

## QA Report Retention Rule

The daily site review (`npm run review` / `.github/workflows/site-review.yml`) runs the full `npm test`, the site build and the link check. In CI it runs with `--only-on-change`: the report always goes to the job summary, but `qa/site_review_YYYYMMDD.md` is written (and committed) only when the result differs from the newest report in `qa/` — green days with nothing new add no commit. **Only the last 5 reports are kept** — `scripts/site-review.js` prunes older ones (`RETENTION_DAYS`), and the workflow stages `qa/` with `git add -A` so those deletions land in the same commit. `qa/PROJECT-REVIEW.md` is the hand-written qualitative review and is never pruned.

## Install Script Rule

`install.sh` is the one-command curl installer (`curl -fsSL .../install.sh | bash -s -- -a <agent>`). It is tested by `scripts/test-install.js` (`npm run test:install`) and by `.github/workflows/install-script.yml`.

When you touch `install.sh`:

1. **Adding or renaming an agent** means four places, or the tests fail: the `AGENTS` list in `install.sh`, its branch in the per-agent `case` block, its row in `list_agents()`, and the matching entry in `INSTALL_TARGETS` in `site/build/build-site.js` (id + advertised `path`). The parity checks in `scripts/test-install.js` compare all of these.
2. **Keep it shellcheck-clean** at `--severity=warning` (`shellcheck --severity=warning --shell=bash install.sh`) — CI fails otherwise.
3. **Never overwrite a user's file.** Existing instruction files are appended to inside the `MARK_BEGIN`/`MARK_END` block, and a second run must leave the tree byte-identical. Both properties are asserted.
4. `rm -rf` may only ever target the script's own `mktemp -d` directory (`$TMP`). Enforced by both the test suite and the lint job.
5. The tests run `install.sh` for real in a sandbox with a `curl` test double serving a tarball built from the working tree — no network, but the actual download → extract → copy → wire path executes. `KEEP_INSTALL_TEST_DIR=1` keeps the sandbox for inspection.

Documented curl commands in `README*.md` and `site/content/COOKBOOK*.md` are checked too: the URL must be the `raw.githubusercontent.com/yennanliu/InvestSkill/<ref>/install.sh` form and every `-a AGENT` must be a supported agent.

## Bring-Your-Own-Data Helpers Rule

InvestSkill has **no runtime**: the skills fetch nothing. Two optional, zero-dependency Node scripts exist so a user without a tool-enabled assistant can still paste a primary source — `scripts/fetch-edgar.js` (an EDGAR filing → `data/filings/<TICKER>/` as `.htm`, stripped `.txt`, and a `.json` of header fields) and `scripts/fetch-fundamentals.js` (SEC XBRL companyfacts → `data/fixtures/<TICKER>.md`, same shape as the ZEPH eval fixture). Shared plumbing is `scripts/lib/edgar.js`.

- They stay **outside the plugin**, and `npm test` never runs them against the SEC (they need the network) — only their offline suite below; `npm run fetch:edgar` / `fetch:fundamentals` are the only user-facing wiring. Do not add data fetching to any SKILL.md — the skills carry the *recipe* (URLs a tool-enabled host can follow) in `10k-digest`, `financial-report-analyst`, and `fact-check`, and the Data & Accuracy page documents it.
- **Never commit filings or generated real-ticker packs.** `data/filings/` and `data/fixtures/*` (except the fictional `ZEPH.md`) are ignored via `.gitignore`; real numbers go stale and PDFs bloat a markdown plugin.
- Save text, not PDFs — the skills consume text. No Playwright / headless-browser dependency.
- Honour SEC fair access: an identifying `User-Agent` (`EDGAR_USER_AGENT` env) and paced requests (`edgar.js` enforces the interval).
- **Tests:** `scripts/test-edgar.js` (`npm run test:edgar`, part of `npm test`, so it runs in `ci.yml`) covers the library in-process and runs both CLIs as subprocesses against the fetch double `scripts/lib/edgar-mock-fetch.js` — no network. Add a route to the double when you add an endpoint; keep the synthetic AAPL facts equal to the real FY2025 figures so the pack stays sanity-checkable. When you change what the helpers fetch, also run them once against a real ticker.

## LLM Eval Rule

Prompts are the product, so CI checks both what goes into a model and what must come out. `.github/workflows/llm-eval.yml` runs on every PR that touches a skill, a prompt, a cross-AI system-prompt file, or the eval machinery:

1. **Offline (always, also in `npm test`)** — `scripts/test-llm-io.js`:
   - **Real outputs:** `tests/llm-golden/*.md` are unedited model outputs from the demo runs. Each must get the verdict in `manifest.json` from `scripts/lib/signal-block.js`, the same parser that grades live runs. When a real run exposes a parser gap, add it as a case.
   - **Broken outputs:** mutations of a real output (no signal box, score↔signal mismatch, model memory at HIGH confidence, missing disclaimer, …) must fail with the expected reason.
   - **Prompts:** every skill/prompt closes with the standard six-field signal block (this caught `catalyst-calendar` and `stock-screener`), followed only by the guide lines, at most one note paragraph and the Disclaimer; skill descriptions stay ≤ 1024 chars; the cross-AI system prompts reference every skill; every prompt has an entry in `tests/prompt-budgets.json` and stays within 25% of it. If a prompt grows on purpose, run `npm run prompt:budgets` and commit the change so the reviewer sees it; for a new skill, `npm run prompt:budgets -- --add-missing` adds its entries without resetting the others.
   - **Eval harness and runner:** the ZEPH fixture, assembled eval prompts, the arithmetic scorer, `scripts/claude-complete.js --dry-run`, and `prompt-diff --select`.
2. **Prompt diff** — `scripts/prompt-diff.js` writes changed prompts, token deltas, description changes and contract status to the job summary.
3. **Live eval** — the changed single-ticker skills (max 4; the eval defaults if only the eval machinery changed) run through Claude on the fictional ZEPH pack via `scripts/claude-complete.js`, scored by `scripts/eval-skills.js`; any hard contract failure fails the job. It needs the `ANTHROPIC_API_KEY` repository secret, which is exposed to the eval step only, and is **skipped, not failed**, without it (fork PRs). It defaults to `claude-opus-5-5` at `medium` effort; `workflow_dispatch` takes `skills`, `all` and `model`.

Skill-specific output rules live in `signal-block.js` (e.g. `fact-check`'s Score is the Verification Score, so it is checked against its own confidence and failed-verification rules instead of the Score Guide). The Anthropic SDK is installed with `npm install --no-save` in CI only. The plugin itself still has no runtime dependency.

## Version Consistency Rule

All three version fields must match at all times:
- `plugins/us-stock-analysis/.claude-plugin/plugin.json` → `"version"`
- `.claude-plugin/marketplace.json` → `"metadata.version"` (and the plugin entry's `version`)
- `package.json` → `"version"`

Verify with: `jq '.version' plugins/us-stock-analysis/.claude-plugin/plugin.json && jq '.metadata.version' .claude-plugin/marketplace.json && jq '.version' package.json`

This is enforced by the consistency checks in `npm test`.

## Release Timing Rule

Choosing the version number and *when* to cut the release both matter — don't tag prematurely.

**Which number to bump (SemVer):**
- **MINOR** (`1.8.x → 1.9.0`) — a new skill/framework, or a meaningful new capability. (Adding `bear-case` and `position-ladder` were minor bumps.)
- **PATCH** (`1.9.0 → 1.9.1`) — fixes, doc/site tweaks, prompt refinements with no new skill.
- **MAJOR** (`1.x → 2.0.0`) — breaking changes to skill names, output contracts, or the plugin layout.

**When to stamp the date and tag:**
- The `## [X.Y.Z] - YYYY-MM-DD` heading in `CHANGELOG.md` must carry the **actual release date**, not the day you started the work. If the ship date is uncertain, keep the changes under `## [Unreleased]` and let the release step stamp the date when the release is actually cut.
- The git tag `vX.Y.Z` is created by `npm run release` (`release-interactive.js`, logic in `scripts/lib/release.js`): on a clean `main` equal to `origin/main` it runs `npm run pre-release`, writes the version into all three manifests, turns `## [Unreleased]` into `## [X.Y.Z] - <today>`, commits `chore(release): vX.Y.Z`, tags, and pushes after a confirmation. Pushing the tag triggers `release.yml` — **the only workflow that tags or publishes** (it re-runs `npm test` and checks the tag against every manifest first). **Create the tag at release time — do not tag ahead of merge.** Preview first with `npm run release:dry-run`.
- Feature work lands on a branch → PR → merge to `main`; the tag/release is cut from `main` once merged. Feature branches add their entries under `## [Unreleased]` and leave the version alone; `npm run release` bumps it and stamps the date when the release is cut (the tests check that CHANGELOG.md has a section for the manifest version).
- Batch small changes: prefer one clean `1.9.0` release over tagging every intermediate commit. Cut the release when the set of changes is coherent and green (`npm run pre-release` passes).

## Framework Count Rule

The **advertised framework count** = number of skills in `plugins/us-stock-analysis/skills/` **minus output tools** (`report-generator`, `basket-report`) **minus alias/redirect stubs** (`fundamental-analysis`, `dcf-valuation`, `research-bundle`). It is currently **34 analysis frameworks** (39 skill directories − 2 output tools − 3 aliases). The classification lives in one place — `scripts/lib/skill-registry.js` (`OUTPUT_TOOLS`, `RENDER_ONLY`, `ALIAS_SKILLS`, `META_SKILLS`; `basket-report` is an output tool that still honours the full output contract, `report-generator` is render-only and exempt) — and is imported by `test-skills.js`, `test-install.js`, `check-skill-contract.js`, and `site/build/build-site.js`. The alias and output-tool lists are mirrored in `install.sh`'s `case` block (the install tests check parity).

- Keep this number consistent across `README.md`, `README-zh-TW.md`, `site/content/CHOOSE-A-SKILL(-zh-TW).md`, `site/content/COOKBOOK(-zh-TW).md`, and `plugin.json`'s description.
- `site/build/build-site.js` derives it automatically (`FRAMEWORK_COUNT`) — never hardcode a count there.
- Enforced by the consistency checks in `npm test` (stale totals like 18/21 will fail):
  - **Test 11** checks the six site-facing `COUNT_DOCS` for "N frameworks" claims.
  - **Test 13** checks the cross-AI configs (`GEMINI.md`, `.cursor/rules/invest-skill.mdc`, `.github/copilot-instructions.md`) — every prompt must be referenced (a new skill can't be silently omitted from a platform), and every "N frameworks" claim must equal the advertised count. It also checks the COOKBOOK plugin-list skill counts equal the skill-directory count.

## Current State

- **Version**: 1.14.0 (plugin.json = marketplace.json = package.json)
- **Skills**: 39 directories in `plugins/us-stock-analysis/skills/` (auto-discovered)
- **Advertised frameworks**: 34 analysis frameworks (39 − 2 output tools − 3 aliases)
- **Prompts**: 39 universal files in `prompts/` — **generated** from SKILL.md by `scripts/sync-prompts.js` (never hand-edit them; `--check` runs in `npm test`)
- **Node**: ≥18.0.0 required
