# Deployment History

This file is auto-updated by the [auto-deploy workflow](.github/workflows/auto-deploy.yml)
each time a new version passes all tests and is published to the marketplaces.

---

## v1.3.0 — 2026-02-27 (manual)

| Field         | Value |
|---------------|-------|
| Version       | `1.3.0` |
| Commit        | `f51245b` |
| Deployed at   | 2026-02-27 (manual release) |
| Skills        | 18 |
| Release       | [GitHub Release](https://github.com/yennanliu/InvestSkill/releases/tag/v1.3.0) |

### Marketplace targets

| Target | Status | Install |
|--------|--------|---------|
| **Claude Code** | ✅ Deployed | `/plugin marketplace add yennanliu/InvestSkill` |
| **Cursor** | ✅ Updated | Copy `.cursor/rules/invest-skill.mdc` to your project |
| **Gemini CLI** | ✅ Updated | Reference `GEMINI.md` / `prompts/` directory |
| **GitHub Copilot** | ✅ Updated | Auto-applied via `.github/copilot-instructions.md` |

### What's in this release
- 2 new skills: `financial-report-analyst`, `stock-valuation`
- Cross-AI compatibility: GEMINI.md, copilot-instructions.md, cursor .mdc
- 17 universal AI-agnostic prompts in `prompts/`
- Comprehensive CI/CD: 4-job test suite, 287 unit tests

---

## v1.2.0 — 2026-02-17 (manual)

| Field         | Value |
|---------------|-------|
| Version       | `1.2.0` |
| Deployed at   | 2026-02-17 |
| Skills        | 16 |

### What's in this release
- 6 new skills added; 3 existing skills deepened
- Standardized INVESTMENT SIGNAL blocks across all skills

---

## v1.1.0 — 2026-02-16 (manual)

| Field         | Value |
|---------------|-------|
| Version       | `1.1.0` |
| Deployed at   | 2026-02-16 |
| Skills        | 10 |

### What's in this release
- Interactive HTML/PDF reports via `report-generator`
- Earnings call analysis, insider trading, institutional ownership skills

---
