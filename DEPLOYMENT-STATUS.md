# Deployment Status Dashboard

**Last Updated**: 2026-04-11  
**Current Version**: 1.4.0

---

## Platform Release Status

| Platform | Version | Released | Status | Registry | Install Method |
|----------|---------|----------|--------|----------|-----------------|
| **Claude Code** | 1.4.0 | 2026-02-27 | ✅ Published | Claude Code Marketplace | `/plugin install us-stock-analysis` |
| **Cursor IDE** | 1.4.0 | 2026-02-27 | ✅ Active | Cursor Rules Registry | Auto-loads `.cursor/rules/invest-skill.mdc` |
| **Gemini CLI** | 1.4.0 | 2026-02-27 | ✅ Active | Repository (GEMINI.md) | Auto-loads in project directory |
| **GitHub Copilot** | 1.4.0 | 2026-02-27 | ✅ Active | VS Code / JetBrains | Auto-loads `.github/copilot-instructions.md` |
| **Universal** | 1.4.0 | 2026-02-27 | ✅ Available | File-based (prompts/) | Copy from `prompts/*.md` |

---

## Version Synchronization

### Sync Status ✅

```
┌─────────────────────────────────────────────────┐
│  ALL PLATFORMS SYNCHRONIZED AT v1.4.0          │
│                                                 │
│  ✅ Marketplace Config: 1.4.0                  │
│  ✅ Plugin Manifest: 1.4.0                     │
│  ✅ Claude Code: 1.4.0                         │
│  ✅ Cursor Rules: 1.4.0                        │
│  ✅ Gemini Config: 1.4.0                       │
│  ✅ Copilot Instructions: 1.4.0                │
│  ✅ Universal Prompts: 1.4.0 (17 frameworks)   │
└─────────────────────────────────────────────────┘
```

### Version Mismatch Alerts

✅ **No mismatches detected**

All platform-specific configuration files reference version 1.4.0:
- `.claude-plugin/marketplace.json`
- `plugins/us-stock-analysis/.claude-plugin/plugin.json`
- `.cursor/rules/invest-skill.mdc`
- `GEMINI.md`
- `.github/copilot-instructions.md`
- `README*.md` (all platform-specific guides)

---

## Registry Sync Status

### Primary Registries

| Registry | Platform | Status | Last Sync | Notes |
|----------|----------|--------|-----------|-------|
| Claude Code Marketplace | Claude Code | ✅ Synced | 2026-02-27 | GitHub Release artifacts available |
| Cursor Rules Registry | Cursor IDE | ✅ Synced | 2026-02-27 | `.cursor/rules/invest-skill.mdc` published |
| Gemini CLI Package | Gemini CLI | ✅ Available | 2026-02-27 | GEMINI.md + prompts/ in repository |
| VS Code Extensions | GitHub Copilot | ✅ Active | 2026-02-27 | `.github/copilot-instructions.md` |
| Repository | Universal (All) | ✅ Published | 2026-02-27 | All files in GitHub repository |

---

## Deployment Artifacts

### v1.4.0 Release Artifacts

**Release Date**: 2026-02-27  
**Commit**: 5326a0c  
**Skills**: 18 analysis frameworks  

#### Available Artifacts

```
dist/invest-skill-marketplace-1.4.0.tar.gz    (Full marketplace)
dist/us-stock-analysis-1.4.0.tar.gz           (Claude Code plugin)
dist/checksums.txt                             (SHA-256 verification)
```

#### Download & Verification

```bash
# Using GitHub CLI
gh release download v1.4.0 -R yennanliu/InvestSkill

# Verify checksums
sha256sum -c checksums.txt
```

---

## Skills & Features

### Current Feature Set (v1.4.0)

✅ **18 Professional Analysis Skills**
- 6 Core Analysis frameworks
- 2 Financial Reports frameworks
- 4 Market Monitoring frameworks
- 4 Advanced Analysis frameworks
- 2 Comprehensive Research frameworks

✅ **Universal Prompts**
- 17 AI-agnostic prompt files in `prompts/` directory
- Compatible with: ChatGPT, Claude.ai, Gemini, Copilot, and more

✅ **Cross-Platform Support**
- Claude Code plugin
- Cursor IDE rules
- Gemini CLI prompts
- GitHub Copilot instructions
- Universal file-based access

---

## Update Frequency & Maintenance

### Release Schedule

- **Major versions**: As needed (feature additions, significant improvements)
- **Minor versions**: Every 2-4 weeks (incremental improvements, new skills)
- **Patch versions**: As needed (bug fixes, security updates)

### Latest Release Timeline

| Version | Released | Platforms | Skills |
|---------|----------|-----------|--------|
| 1.4.0 | 2026-02-27 | 5 | 18 |
| 1.3.0 | 2026-02-27 | 4 | 18 |
| 1.2.0 | 2026-02-24 | 4 | 16 |
| 1.1.0 | 2026-02-22 | 3 | 10 |
| 1.0.0 | 2026-02-20 | 1 | 6 |

### CI/CD Pipeline Status

✅ **All Workflows Passing**

```
├─ test.yml (Test Suite)
│  └─ Status: ✅ PASSING (270 tests)
├─ validate.yml (Structure Validation)
│  └─ Status: ✅ PASSING (10/10 checks)
├─ auto-deploy.yml (Release Automation)
│  └─ Status: ✅ ACTIVE (triggers on version bump)
└─ pr-check.yml (Pull Request Validation)
   └─ Status: ✅ ACTIVE (validation on PRs)
```

---

## Deployment Logs

### Last Deployment (v1.4.0)

**Date**: 2026-02-27  
**Trigger**: Version bump (marketplace.json v1.4.0)  
**Status**: ✅ SUCCESS  

**Steps Completed**:
1. ✅ Detect version change (v1.4.0)
2. ✅ Pre-deploy validation
   - JSON manifests valid
   - Unit tests passed (270/270)
   - Skills registry verified (18/18)
3. ✅ Build release packages
   - invest-skill-marketplace-1.4.0.tar.gz
   - us-stock-analysis-1.4.0.tar.gz
   - checksums.txt
4. ✅ Extract changelog (v1.4.0 notes)
5. ✅ Create git tag (v1.4.0)
6. ✅ Publish GitHub Release
7. ✅ Publish Cursor Rules
8. ✅ Publish Gemini CLI Package
9. ✅ Generate Platform Release Notes
10. ✅ Record deployment (DEPLOYMENTS.md)

---

## Health Check Summary

### Automated Checks

| Check | Status | Last Run | Details |
|-------|--------|----------|---------|
| Version Consistency | ✅ PASS | 2026-04-11 | All configs synced to 1.4.0 |
| Skill Registry | ✅ PASS | 2026-04-11 | 18/18 skills registered |
| Prompts Sync | ✅ PASS | 2026-04-11 | 17 prompts present |
| Documentation | ✅ PASS | 2026-04-11 | All platform docs updated |
| Signal Blocks | ✅ PASS | 2026-04-11 | All frameworks have signal blocks |
| Changelog | ✅ PASS | 2026-04-11 | v1.4.0 entry present |

### Test Coverage

```
Unit Tests:       270 passed, 0 failed ✅
JSON Validation:  12 files valid ✅
Manifest Check:   2 manifests verified ✅
Skills Count:     18 total registered ✅
Prompts Count:    17 universal files ✅
```

---

## Platform Availability Details

### Claude Code Plugin
- **Status**: ✅ Published to Claude Code Marketplace
- **Version**: 1.4.0
- **Install**: `/plugin install us-stock-analysis`
- **Skills**: 18 total + 1 report generator (19 total tools)
- **Last Update**: 2026-02-27
- **Docs**: [README-claude-code.md](README-claude-code.md)

### Cursor IDE Rules
- **Status**: ✅ Auto-loads from repository
- **Version**: 1.4.0 
- **File**: `.cursor/rules/invest-skill.mdc`
- **Features**: Natural language support, @prompts/ file references
- **Last Update**: 2026-02-27
- **Docs**: [README-cursor.md](README-cursor.md)

### Gemini CLI Prompts
- **Status**: ✅ Available via GEMINI.md
- **Version**: 1.4.0
- **Files**: GEMINI.md + 17 prompts/
- **Features**: Session memory, follow-up questions, multi-framework chains
- **Last Update**: 2026-02-27
- **Docs**: [README-gemini.md](README-gemini.md)

### GitHub Copilot Integration
- **Status**: ✅ Auto-loads in VS Code / JetBrains
- **Version**: 1.4.0
- **File**: `.github/copilot-instructions.md`
- **Features**: Workspace-wide framework context
- **Last Update**: 2026-02-27
- **Docs**: [README.md](README.md)

### Universal Access
- **Status**: ✅ File-based (ChatGPT, Claude.ai, Gemini, etc.)
- **Version**: 1.4.0
- **Location**: `prompts/` directory (17 framework files)
- **Features**: Copy-paste ready, AI-agnostic format
- **Last Update**: 2026-02-27
- **Docs**: [README.md](README.md)

---

## Troubleshooting

### Version Not Updated Everywhere?

**Check**:
```bash
# Verify marketplace version
jq '.metadata.version' .claude-plugin/marketplace.json

# Verify plugin version
jq '.version' plugins/us-stock-analysis/.claude-plugin/plugin.json

# Verify README versions
grep -n "v1.4.0" README*.md
```

**Fix**: Run pre-release validation
```bash
npm run pre-release
```

### Skills Not Available in Platform X?

**Check**:
1. Verify version is 1.4.0 or higher
2. Verify platform configuration file exists
3. Restart IDE/CLI

**Platform Check Commands**:
```bash
# Claude Code
/plugin list | grep us-stock-analysis

# Cursor
cat .cursor/rules/invest-skill.mdc | head -20

# Gemini
cat GEMINI.md | head -20

# Copilot
cat .github/copilot-instructions.md | head -20
```

---

## Support & Feedback

- 📖 **Documentation**: [README.md](README.md), platform-specific guides
- 🐛 **Issues**: [GitHub Issues](https://github.com/yennanliu/InvestSkill/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yennanliu/InvestSkill/discussions)
- 📧 **Contact**: Open an issue or discussion

---

**Last Verified**: 2026-04-11  
**Next Scheduled Check**: Continuous (automated CI/CD)  
**Status**: ✅ ALL SYSTEMS OPERATIONAL
