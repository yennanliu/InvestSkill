# InvestSkill Multi-Platform CI/CD Guide

This document explains how the automated CI/CD system releases InvestSkill to all supported AI platforms.

## Overview

The CI/CD pipeline automatically:
1. **Validates** code quality and structure
2. **Tests** all 18 analysis frameworks
3. **Detects** version changes
4. **Publishes** to multiple platforms
5. **Records** deployment history




### Supported Platforms

✅ **Claude Code** — Official plugin marketplace  
✅ **Cursor** — Rules registry (.cursor/rules)  
✅ **Gemini CLI** — Prompt library (GEMINI.md + prompts/)  
✅ **GitHub Copilot** — Workspace instructions (.github/copilot-instructions.md)  
✅ **Any AI Tool** — Universal prompts (prompts/ directory)  

---

## Workflow Architecture

### 1. Validation Pipeline (Always Runs)

**File**: `.github/workflows/validate.yml`  
**Triggers**: Push to main/develop, Pull Requests

Checks:
- ✅ JSON syntax (marketplace.json, plugin.json)
- ✅ Required files exist
- ✅ Plugin structure is valid
- ✅ SKILL.md frontmatter is correct
- ✅ Version consistency across files
- ✅ Unit tests pass

### 2. Test Suite (Always Runs)

**File**: `.github/workflows/test.yml`  
**Triggers**: Every push and PR

Tests:
- ✅ All 18 skills are registered
- ✅ Prompt files are valid
- ✅ Output formats match standards
- ✅ Signal blocks are properly formatted

### 3. Auto-Deploy Workflow (On Version Change)

**File**: `.github/workflows/auto-deploy.yml`  
**Triggers**: After successful test suite on main branch

Detects version changes in `.claude-plugin/marketplace.json` and automatically:

1. **Detect version** — Checks if marketplace version changed
2. **Validate** — Runs final validation before publishing
3. **Build packages** — Creates distribution artifacts
4. **Publish** — Releases to all platforms
5. **Record** — Updates DEPLOYMENTS.md

---

## Release Process

### Trigger a Release

1. **Bump version** in marketplace and plugin files:

```bash
# Edit .claude-plugin/marketplace.json
# Change: "version": "X.Y.Z"

# Edit plugins/us-stock-analysis/.claude-plugin/plugin.json
# Change: "version": "X.Y.Z"
```

2. **Update CHANGELOG.md**:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- Feature description

### Changed
- Change description

### Fixed
- Bug fix description
```

3. **Commit changes**:

```bash
git add .claude-plugin/marketplace.json plugins/us-stock-analysis/.claude-plugin/plugin.json CHANGELOG.md
git commit -m "chore: bump version to X.Y.Z"
git push origin main
```

4. **GitHub Actions detects version change** and automatically:
   - Validates everything
   - Publishes to all platforms
   - Updates DEPLOYMENTS.md
   - Creates GitHub release with artifacts

### Example Release

```bash
# Version: 1.4.0
# Updated: marketplace.json, plugin.json, CHANGELOG.md

$ git push origin main

# Auto-deploy.yml triggers after tests pass:
# ✅ Version change detected: 1.3.0 → 1.4.0
# ✅ Pre-deployment validation passed
# ✅ Built release packages
# ✅ Published to Claude Code marketplace
# ✅ Published Cursor rules
# ✅ Published Gemini CLI prompts
# ✅ Generated platform-specific release notes
# ✅ Recorded deployment in DEPLOYMENTS.md
```

---

## Platform-Specific Publishing

### 1. Claude Code Plugin Marketplace

**What happens**:
- GitHub Release created with artifacts
- `dist/invest-skill-marketplace-X.Y.Z.tar.gz` uploaded
- `dist/us-stock-analysis-X.Y.Z.tar.gz` uploaded
- SHA256 checksums generated

**Installation**:
```bash
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis
```

**Script**: Built-in via GitHub Actions  
**Triggered by**: Version change detection

---

### 2. Cursor Rules Publishing

**What happens**:
- `.cursor/rules/invest-skill.mdc` packaged as `cursor-rules-X.Y.Z.mdc`
- Metadata JSON created: `cursor-rules-metadata.json`
- Artifacts included in GitHub release

**Installation**:
```bash
# Auto-loaded if in InvestSkill repository
cd InvestSkill && cursor .

# Or manually: copy .cursor/rules/invest-skill.mdc to your project
```

**Script**: `scripts/publish-cursor-rules.js`  
**Triggered by**: `auto-deploy.yml` after successful tests

**Registry Integration** (Future):
- Set `CURSOR_REGISTRY_TOKEN` environment variable
- Rules will publish to Cursor registry automatically
- Currently falls back to GitHub release artifacts

---

### 3. Gemini CLI Prompts

**What happens**:
- All prompts (`prompts/*.md`) packaged as `gemini-prompts-X.Y.Z.tar.gz`
- GEMINI.md configuration included
- Metadata JSON created: `gemini-metadata.json`
- Installation guide: `GEMINI-INSTALLATION.md`

**Installation**:
```bash
cd /path/to/InvestSkill
gemini
> @prompts/stock-valuation.md Analyze AAPL
```

**Script**: `scripts/publish-gemini.js`  
**Triggered by**: `auto-deploy.yml` after successful tests

**Registry Integration** (Future):
- Set `GEMINI_REGISTRY_TOKEN` environment variable
- Set `GEMINI_REGISTRY_URL` (optional)
- Prompts will publish to Gemini registry
- Currently falls back to GitHub release artifacts

---

### 4. GitHub Copilot

**What happens**:
- `.github/copilot-instructions.md` updated in repository
- Copilot auto-loads instructions when repository is opened
- Release notes include Copilot setup

**Installation**:
```bash
# Clone repository
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill

# Open in VS Code or JetBrains IDE
code .
# or
# Right-click folder → Open with IntelliJ IDEA

# Open Copilot Chat (Cmd+K)
# Copilot auto-loads instructions
```

**What's automated**:
- No publishing step needed (lives in repository)
- Auto-updates on every commit

---

### 5. Universal Prompts (Any AI Tool)

**What happens**:
- All prompts packaged as standalone files
- Users can copy/paste into any AI chat
- Released as artifacts in GitHub release

**Installation**:
```bash
# Copy prompt file to clipboard
cat prompts/stock-valuation.md | pbcopy

# Paste into ChatGPT, Claude.ai, etc.
# Ask: "Analyze AAPL using the framework above"
```

**What's automated**:
- Included in GitHub release as source files

---

## Platform Release Notes

The system automatically generates platform-specific release notes:

| File | Platform | Purpose |
|------|----------|---------|
| CLAUDE-CODE-RELEASE-NOTES.md | Claude Code | Installation & usage for plugin |
| CURSOR-RELEASE-NOTES.md | Cursor | Installation & usage for rules |
| GEMINI-RELEASE-NOTES.md | Gemini CLI | Installation & usage for prompts |
| COPILOT-RELEASE-NOTES.md | Copilot | Installation & usage for workspace |
| UNIVERSAL-RELEASE-NOTES.md | Any AI | Installation & usage for prompts |

**Generated by**: `scripts/generate-platform-release-notes.js`  
**Location**: `dist/` directory  
**Included in**: GitHub release artifacts

---

## Deployment History

**File**: `DEPLOYMENTS.md`

Auto-updated after each successful release. Shows:
- Version number
- Deployment timestamp
- Commit SHA
- Number of skills
- Links to GitHub release and CI run
- Status for each platform

```markdown
## v1.4.0 — 2026-02-27 15:30 UTC

| Field | Value |
|-------|-------|
| Version | `1.4.0` |
| Commit | `a1b2c3d` |
| Deployed at | 2026-02-27 15:30 UTC |
| Skills | 18 |
| Release | [GitHub Release](https://...) |

### Marketplace targets

| Target | Status | Install |
|--------|--------|---------|
| **Claude Code** | ✅ Deployed | `/plugin install us-stock-analysis` |
| **Cursor** | ✅ Updated | Copy `.cursor/rules/invest-skill.mdc` |
| **Gemini CLI** | ✅ Updated | Reference `GEMINI.md` |
| **GitHub Copilot** | ✅ Updated | Auto-applied |
```

---

## Environment Variables (For Registry Publishing)

Add these to GitHub Secrets to enable direct registry publishing:

```
# Cursor Registry (Optional)
CURSOR_REGISTRY_TOKEN=<your-cursor-registry-token>

# Gemini Registry (Optional)
GEMINI_REGISTRY_TOKEN=<your-gemini-registry-token>
GEMINI_REGISTRY_URL=https://registry.gemini.ai (optional)
```

Without these variables, the system falls back to GitHub release artifacts, which still works perfectly.

---

## Debugging the CI/CD

### View Workflow Logs

1. Go to: https://github.com/yennanliu/InvestSkill/actions
2. Click on a workflow run
3. View logs for each step

### Common Issues

#### Version not detected

```bash
# Make sure versions match across files:
jq '.metadata.version' .claude-plugin/marketplace.json
jq '.version' plugins/us-stock-analysis/.claude-plugin/plugin.json

# They must be identical
```

#### Validation failed

```bash
# Run local validation:
node scripts/test-skills.js

# Check JSON:
jq empty .claude-plugin/marketplace.json
jq empty plugins/us-stock-analysis/.claude-plugin/plugin.json
```

#### Release artifacts not created

```bash
# Check dist/ directory exists
mkdir -p dist

# Verify tar commands work locally
tar -czf dist/test.tar.gz .
```

---

## Extending the CI/CD

### Add a New Platform

1. Create a new script: `scripts/publish-<platform>.js`
2. Add platform-specific publishing logic
3. Update `.github/workflows/auto-deploy.yml`:
   ```yaml
   - name: Publish to <Platform>
     run: node scripts/publish-<platform>.js
     env:
       PLATFORM_VERSION: ${{ env.VERSION }}
   ```
4. Update record-deploy.js to include new platform
5. Add platform-specific release notes generation

### Add a New Validation Check

1. Update `.github/workflows/validate.yml`
2. Add new check step with validation logic
3. Exit with error code if validation fails

### Add a New Test Suite

1. Create test file: `scripts/test-<feature>.js`
2. Add to `.github/workflows/test.yml`
3. Run on every commit

---

## Release Checklist

Before bumping version:

- [ ] All features complete and tested
- [ ] CHANGELOG.md updated with details
- [ ] README.md updated if needed
- [ ] All platform docs updated (GEMINI.md, etc.)
- [ ] No uncommitted changes
- [ ] Tests passing locally

When bumping version:

- [ ] Update `.claude-plugin/marketplace.json`
- [ ] Update `plugins/us-stock-analysis/.claude-plugin/plugin.json`
- [ ] Update CHANGELOG.md
- [ ] Commit changes to main
- [ ] Wait for auto-deploy to complete
- [ ] Verify GitHub release created
- [ ] Verify DEPLOYMENTS.md updated

---

## Support

For CI/CD issues or questions:

1. Check workflow logs: https://github.com/yennanliu/InvestSkill/actions
2. Open an issue: https://github.com/yennanliu/InvestSkill/issues
3. Check CHANGELOG.md for recent updates

---

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Claude Code Plugin Development](https://code.claude.com/docs/plugins)
- [Cursor Rules Guide](https://cursor.sh/docs/rules)
- [Gemini CLI Documentation](https://gemini.ai/docs)
- [GitHub Copilot Configuration](https://docs.github.com/en/copilot/managing-copilot/configure-personal-settings)
