# Deployment History

This file is auto-updated by the [auto-deploy workflow](.github/workflows/auto-deploy.yml)
each time a new version passes all tests and is published to the marketplaces.

---

## v1.6.0 — 2026-04-29 03:13 UTC

| Field         | Value |
|---------------|-------|
| Version       | `1.6.0` |
| Commit        | `fd9734b` |
| Deployed at   | 2026-04-29 03:13 UTC |
| Skills        | 18 |
| Release       | [GitHub Release](https://github.com/yennanliu/InvestSkill/releases/tag/v1.6.0) |
| CI run        | [Actions run](https://github.com/yennanliu/InvestSkill/actions/runs/25089062041) |

### Multi-Platform Deployment

| Platform | Status | Access | Docs |
|----------|--------|--------|------|
| **Claude Code** | ✅ Published | `/plugin install us-stock-analysis` | [Plugin Guide](CI-CD-GUIDE.md#1-claude-code-plugin-marketplace) |
| **Cursor** | ✅ Published | Auto-loads from `.cursor/rules/` | [Cursor Guide](CI-CD-GUIDE.md#2-cursor-rules-publishing) |
| **Gemini CLI** | ✅ Published | `@prompts/stock-valuation.md` | [Gemini Guide](CI-CD-GUIDE.md#3-gemini-cli-prompts) |
| **GitHub Copilot** | ✅ Published | Auto-loads in VS Code/JetBrains | [Copilot Guide](CI-CD-GUIDE.md#4-github-copilot) |
| **Universal Prompts** | ✅ Available | Copy from `prompts/` directory | [Universal Guide](CI-CD-GUIDE.md#5-universal-prompts-any-ai-tool) |

### Release Artifacts

| Artifact | Purpose |
|----------|---------|
| `invest-skill-marketplace-1.6.0.tar.gz` | Full marketplace package |
| `us-stock-analysis-1.6.0.tar.gz` | Claude Code plugin only |
| `cursor-rules-1.6.0.mdc` | Cursor rules file |
| `gemini-prompts-1.6.0.tar.gz` | Gemini CLI prompts |
| `checksums.txt` | SHA256 checksums |
| `*-RELEASE-NOTES.md` | Platform-specific guides |

---

## v1.5.0 — 2026-04-28 00:50 UTC

| Field         | Value |
|---------------|-------|
| Version       | `1.5.0` |
| Commit        | `711fca8` |
| Deployed at   | 2026-04-28 00:50 UTC |
| Skills        | 18 |
| Release       | [GitHub Release](https://github.com/yennanliu/InvestSkill/releases/tag/v1.5.0) |
| CI run        | [Actions run](https://github.com/yennanliu/InvestSkill/actions/runs/25027728785) |

### Multi-Platform Deployment

| Platform | Status | Access | Docs |
|----------|--------|--------|------|
| **Claude Code** | ✅ Published | `/plugin install us-stock-analysis` | [Plugin Guide](CI-CD-GUIDE.md#1-claude-code-plugin-marketplace) |
| **Cursor** | ✅ Published | Auto-loads from `.cursor/rules/` | [Cursor Guide](CI-CD-GUIDE.md#2-cursor-rules-publishing) |
| **Gemini CLI** | ✅ Published | `@prompts/stock-valuation.md` | [Gemini Guide](CI-CD-GUIDE.md#3-gemini-cli-prompts) |
| **GitHub Copilot** | ✅ Published | Auto-loads in VS Code/JetBrains | [Copilot Guide](CI-CD-GUIDE.md#4-github-copilot) |
| **Universal Prompts** | ✅ Available | Copy from `prompts/` directory | [Universal Guide](CI-CD-GUIDE.md#5-universal-prompts-any-ai-tool) |

### Release Artifacts

| Artifact | Purpose |
|----------|---------|
| `invest-skill-marketplace-1.5.0.tar.gz` | Full marketplace package |
| `us-stock-analysis-1.5.0.tar.gz` | Claude Code plugin only |
| `cursor-rules-1.5.0.mdc` | Cursor rules file |
| `gemini-prompts-1.5.0.tar.gz` | Gemini CLI prompts |
| `checksums.txt` | SHA256 checksums |
| `*-RELEASE-NOTES.md` | Platform-specific guides |

---

## v1.4.0 — 2026-02-27 02:09 UTC

| Field         | Value |
|---------------|-------|
| Version       | `1.4.0` |
| Commit        | `8903101` |
| Deployed at   | 2026-02-27 02:09 UTC |
| Skills        | 18 |
| Release       | [GitHub Release](https://github.com/yennanliu/InvestSkill/releases/tag/v1.4.0) |
| CI run        | [Actions run](https://github.com/yennanliu/InvestSkill/actions/runs/22469756692) |

### Marketplace targets

| Target | Status | Install |
|--------|--------|---------|
| **Claude Code** | ✅ Deployed | `/plugin marketplace add yennanliu/InvestSkill` |
| **Cursor** | ✅ Updated | Copy `.cursor/rules/invest-skill.mdc` to your project |
| **Gemini CLI** | ✅ Updated | Reference `GEMINI.md` / `prompts/` directory |
| **GitHub Copilot** | ✅ Updated | Auto-applied via `.github/copilot-instructions.md` |

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
