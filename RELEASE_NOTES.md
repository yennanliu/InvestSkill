## InvestSkill v1.4.0

**18 Professional Investment Analysis Frameworks**

## What's New

**✨ New Features:**
- Auto-deploy workflow (`auto-deploy.yml`): triggers after Test Suite passes on main,
  detects version bumps via git tag check, runs pre-deploy validation, publishes
  GitHub Release with .tar.gz artifacts and checksums, records result in DEPLOYMENTS.md
- `scripts/record-deploy.js`: appends structured deployment entry to DEPLOYMENTS.md
  with version, commit SHA, timestamp, release URL, and marketplace targets table
- `DEPLOYMENTS.md`: auto-maintained deployment history file seeded with v1.1.0–v1.3.0

## Quick Start

### Claude Code
```bash
/plugin install us-stock-analysis
/us-stock-analysis:stock-eval AAPL
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
| Claude Code | ✅ Available | `/plugin install us-stock-analysis` | [README-claude-code.md](README-claude-code.md) |
| Cursor IDE | ✅ Available | Auto-loads from `.cursor/rules/invest-skill.mdc` | [README-cursor.md](README-cursor.md) |
| Gemini CLI | ✅ Available | Auto-loads from `GEMINI.md` (project directory) | [README-gemini.md](README-gemini.md) |
| GitHub Copilot | ✅ Available | Auto-loads from `.github/copilot-instructions.md` | [README.md](README.md) |
| Universal (ChatGPT, Claude.ai, etc) | ✅ Available | Copy prompts from `prompts/` directory | [README.md](README.md) |

## Download & Verify

All releases include checksums for verification:

```bash
# Download artifacts
tar xzf invest-skill-marketplace-1.4.0.tar.gz

# Verify checksums
sha256sum -c checksums.txt
```

**Artifacts:**
- `invest-skill-marketplace-1.4.0.tar.gz` — Full marketplace (all platforms)
- `us-stock-analysis-1.4.0.tar.gz` — Claude Code plugin only
- `checksums.txt` — SHA-256 verification file

## Full Changelog

- 2026-02-27

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
---

## Documentation & Resources

- 📖 [Complete README](README.md) — All platforms setup guide
- 📊 [Platform Compatibility](PLATFORM-COMPATIBILITY.md) — Feature comparison
- 📚 [Cookbook](COOKBOOK.md) — Examples and walkthroughs
- 🔧 [CI/CD Guide](CI-CD-GUIDE.md) — Automated release pipeline
- 💡 [16 Investment Frameworks](prompts/) — Universal prompt files

## Support

- 🐛 [Report Issues](https://github.com/yennanliu/InvestSkill/issues)
- 💬 [Discussions](https://github.com/yennanliu/InvestSkill/discussions)
- 📧 Feedback: [GitHub Issues](https://github.com/yennanliu/InvestSkill/issues/new)

---

**Legal:** This toolkit provides educational analysis only and does NOT constitute financial advice. Always consult qualified financial advisors and do your own research.
