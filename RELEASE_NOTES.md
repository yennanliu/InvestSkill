## InvestSkill v1.12.0

**30 Professional Investment Analysis Frameworks** · 34 skills · 7 platforms · no API keys, no runtime, no telemetry

Released 2026-09-25. The largest release since 1.0: six new frameworks plus the `fact-check` meta framework, an enforced output contract on every skill, Learning track Part II, a redesigned docs site, a one-command installer for any AI agent, and a keyless SEC EDGAR data path for users whose assistant cannot browse.

## What's New

**🧭 Six new analysis frameworks + `fact-check`** (advertised count 26 → **30**, with `fundamental-analysis` / `dcf-valuation` / `research-bundle` now counted as aliases):
- `thesis-tracker` — write, save, and re-check an investment thesis; `--update` returns **INTACT / WEAKENED / BROKEN**
- `etf-analysis` — ETF / index-fund due diligence with an ETF Fitness Score 0–10
- `earnings-preview` — the *before*-earnings skill: consensus vs. whisper, implied vs. realized move, three-scenario grid with position rules
- `tax-lens` — holding periods, wash sales, lot selection, harvesting, account placement; `--non-us` module (W-8BEN, withholding, estate tax, UCITS). Educational only
- `risk-stress-test` — beta-weighted exposure, scenario replay (2008 · 2020 · 2022 · 2025), VaR / CVaR, liquidity; Risk Budget Score 0–10
- `learning-coach` — explains any InvestSkill output like a mentor; `--quiz <lesson>` drills a Learning lesson
- `fact-check` — claim-level verification against primary sources, recomputation, and a corrected report with inline citations; Verification Score 0–10 feeds `result-validator`

**📋 Output contract enforced on every analysis skill** — the `Data & Sources` header (As of · Source · Retrieval · Confidence), the Data Verification gate, and a Thesis Invalidation section are now present in all 30 frameworks and checked by `scripts/check-skill-contract.js` in `npm test`.

**🔎 Bring your own data — the keyless SEC EDGAR path**
- `10k-digest`, `financial-report-analyst`, and `fact-check` carry a retrieval recipe a tool-enabled assistant can follow on its own: ticker → CIK → `data.sec.gov` submissions index → filing document → XBRL company facts, with the SEC's User-Agent and rate rules
- Two optional, zero-dependency helpers for assistants that cannot browse: `node scripts/fetch-edgar.js AAPL --form 10-K` saves a filing as pasteable text; `node scripts/fetch-fundamentals.js AAPL` builds a reconciled statement pack from the XBRL facts. Outside the plugin; covered by a 194-check offline suite in CI
- New **Bring Your Own Data** section on the Data & Accuracy page (EN + 繁體中文)

**⚡ One-command install for any AI agent**
```bash
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a claude   # or cursor · copilot · gemini · codex · opencode · any
```
Existing instruction files are appended to, never overwritten; re-running is a no-op. 116 install checks run in CI, including live sandboxed installs.

**🎓 Learning track Part II** — Lessons 9–13 (Before Your First Trade · ETFs & Index Investing · Taxes & Account Types incl. a non-US section · Earnings Season · Psychology & Process), a "When the Answer Is No" case study, self-check quizzes, and a glossary grown to 76 terms.

**🎨 Site redesign** — real landing pages (EN + zh-TW) with an animated terminal demo, a filterable Skill Reference grid, per-skill run boxes, dark mode, keyboard search, and an install picker. New META 10-K deep-dive demo and seven live Cookbook workflow runs.

**🛠️ Tooling** — `scripts/sync-prompts.js` (prompts are now generated from `SKILL.md`), `scripts/new-skill.js` scaffolder, `scripts/eval-skills.js` opt-in behavioural eval, shared `signal-block.js` / `skill-registry.js` libraries, and a roadmap with progress tracking.

## Quick Start

### Claude Code
```bash
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis
/us-stock-analysis:stock-eval AAPL
```

### Any agent via the installer
```bash
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a cursor
```

### Cursor
Rules auto-load in Cursor AI Chat (Cmd+K):
```
@prompts/stock-eval.md Evaluate Apple (AAPL)
```

### Gemini CLI
In project directory:
```bash
gemini
> @prompts/stock-eval.md Evaluate Apple (AAPL)
```

## Platform Availability

| Platform | Status | Installation | Documentation |
|----------|--------|---------------|----------------|
| Claude Code | ✅ Available | `/plugin install us-stock-analysis` or `install.sh -a claude` | [README-claude-code.md](README-claude-code.md) |
| Cursor IDE | ✅ Available | Auto-loads from `.cursor/rules/invest-skill.mdc` or `install.sh -a cursor` | [README-cursor.md](README-cursor.md) |
| Gemini CLI | ✅ Available | Auto-loads from `GEMINI.md` or `install.sh -a gemini` | [README-gemini.md](README-gemini.md) |
| GitHub Copilot | ✅ Available | Auto-loads from `.github/copilot-instructions.md` or `install.sh -a copilot` | [README.md](README.md) |
| Codex / OpenCode | ✅ Available | `install.sh -a codex` / `-a opencode` (writes `AGENTS.md`) | [README.md](README.md) |
| Universal (ChatGPT, Claude.ai, Ollama, …) | ✅ Available | `install.sh -a any` or copy prompts from `prompts/` | [README-ollama.md](README-ollama.md) |

## Download & Verify

All releases include checksums for verification:

```bash
# Download artifacts
tar xzf invest-skill-marketplace-1.12.0.tar.gz

# Verify checksums
sha256sum -c checksums.txt
```

**Artifacts:**
- `invest-skill-marketplace-1.12.0.tar.gz` — Full marketplace (all platforms)
- `us-stock-analysis-1.12.0.tar.gz` — Claude Code plugin only
- `checksums.txt` — SHA-256 verification file

## Full Changelog

See [CHANGELOG.md → 1.12.0](CHANGELOG.md#1120---2026-09-25) for every entry, including the review-driven fixes to the EDGAR helpers (filename collisions for same-day filings, `LongTermDebt` double counting, `--limit` validation, 13F-HR routed by manager rather than issuer).

**Upgrade notes**
- No breaking changes. Skill names, the signal block, and the plugin layout are unchanged.
- `fundamental-analysis`, `dcf-valuation`, and `research-bundle` still work but are aliases; prefer `stock-eval`, `stock-valuation`, and `full-report`.
- The EDGAR helpers need Node ≥ 18 and, per SEC fair-access rules, `EDGAR_USER_AGENT="Your Name your@email"`.
- Two stale, unreferenced 10-K PDFs were removed from `data/`; `fetch-edgar.js` reproduces either as text on demand.

---

## Documentation & Resources

- 📖 [Complete README](README.md) — All platforms setup guide
- 🌐 [Documentation site](https://yennanliu.github.io/InvestSkill/) — Skill Reference, Learning track, Cookbook, Data & Accuracy
- 📊 [Platform Compatibility](PLATFORM-COMPATIBILITY.md) — Feature comparison
- 📚 [Cookbook](site/content/COOKBOOK.md) — Examples and walkthroughs
- 🔧 [CI/CD Guide](CI-CD-GUIDE.md) — Automated release pipeline
- 💡 [30 Investment Frameworks](prompts/) — Universal prompt files

## Support

- 🐛 [Report Issues](https://github.com/yennanliu/InvestSkill/issues)
- 💬 [Discussions](https://github.com/yennanliu/InvestSkill/discussions)
- 📧 Feedback: [GitHub Issues](https://github.com/yennanliu/InvestSkill/issues/new)

---

**Legal:** This toolkit provides educational analysis only and does NOT constitute financial advice. Always consult qualified financial advisors and do your own research.
