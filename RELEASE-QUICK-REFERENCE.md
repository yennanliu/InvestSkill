# InvestSkill Release Quick Reference

Fast-track guide for releasing new versions to all platforms.

## 30-Second Release

```bash
# 1. Update version (two files)
# .claude-plugin/marketplace.json → "version": "X.Y.Z"
# plugins/us-stock-analysis/.claude-plugin/plugin.json → "version": "X.Y.Z"

# 2. Update CHANGELOG.md
# Add section: ## [X.Y.Z] - YYYY-MM-DD

# 3. Commit
git add .claude-plugin/marketplace.json plugins/us-stock-analysis/.claude-plugin/plugin.json CHANGELOG.md
git commit -m "chore: bump version to X.Y.Z"
git push origin main

# ✅ Done! Auto-deploy handles everything else
```

## What Gets Released

| Platform | Method | Status |
|----------|--------|--------|
| Claude Code | GitHub Release | ✅ Auto-published |
| Cursor | Rules packaging | ✅ Auto-published |
| Gemini CLI | Prompts packaging | ✅ Auto-published |
| Copilot | Repository (.github/) | ✅ Auto-published |
| Universal | GitHub artifacts | ✅ Auto-published |

## Release Steps Checklist

### Before Release
- [ ] All features implemented and tested
- [ ] CHANGELOG.md written with details
- [ ] README.md updated if needed
- [ ] Documentation (GEMINI.md, etc.) updated
- [ ] Tests passing: `npm test`
- [ ] No uncommitted changes: `git status`

### During Release
- [ ] Update `marketplace.json` version
- [ ] Update `plugin.json` version  
- [ ] Update `CHANGELOG.md`
- [ ] Commit changes
- [ ] Push to main branch

### After Release (Automatic)
- [ ] ✅ Tests run automatically
- [ ] ✅ Version change detected
- [ ] ✅ Release artifacts created
- [ ] ✅ Published to all 5 platforms
- [ ] ✅ DEPLOYMENTS.md updated
- [ ] ✅ Release notes generated

## Verify Release

**Check GitHub Actions**:
1. Visit: https://github.com/yennanliu/InvestSkill/actions
2. Click latest "Auto Deploy" workflow
3. Wait for all jobs to complete (green checkmarks)

**Check Release**:
1. Visit: https://github.com/yennanliu/InvestSkill/releases
2. Latest release should be: `InvestSkill vX.Y.Z`
3. Artifacts should include:
   - `invest-skill-marketplace-X.Y.Z.tar.gz`
   - `us-stock-analysis-X.Y.Z.tar.gz`
   - `cursor-rules-X.Y.Z.mdc`
   - `gemini-prompts-X.Y.Z.tar.gz`
   - Platform release notes

**Check Deployment Record**:
1. Visit: [DEPLOYMENTS.md](DEPLOYMENTS.md)
2. Latest entry should be v**X.Y.Z**
3. All platforms should show ✅

## Common Version Numbers

- **X.Y.0** — Major version (new skills, breaking changes)
- **X.0.Z** — Minor version (new features)
- **0.0.Z** — Patch version (bug fixes, documentation)

Examples:
- `1.3.0` — Minor release (new documentation, multi-platform support)
- `1.2.1` — Patch release (bug fix)
- `2.0.0` — Major release (major new features or breaking changes)

## Semantic Versioning

Follow [Semantic Versioning](https://semver.org/):

- **Major** (1.0.0 → 2.0.0): Breaking changes
  - Removing skills
  - Changing output format significantly
  - Major architecture changes

- **Minor** (1.0.0 → 1.1.0): New features
  - Adding new skills
  - New analysis frameworks
  - New platform support

- **Patch** (1.0.0 → 1.0.1): Bug fixes
  - Documentation fixes
  - Small improvements
  - Performance improvements

## Version Consistency Check

Before pushing:

```bash
# Verify versions match
jq '.metadata.version' .claude-plugin/marketplace.json
jq '.version' plugins/us-stock-analysis/.claude-plugin/plugin.json

# They must be identical!
```

## Rollback (If Needed)

```bash
# Delete the last tag
git tag -d vX.Y.Z
git push origin :refs/tags/vX.Y.Z

# Revert version bumps
git revert HEAD

# Or reset to previous commit
git reset --hard HEAD~1
git push origin main
```

## Release Notification

After release completes, notify:

1. **GitHub Issues** — Link to release in pinned issue
2. **GitHub Discussions** — Post release announcement
3. **Social Media** — Tweet/share the release

Template:
```
🚀 InvestSkill vX.Y.Z released!

✨ What's new:
- Feature 1
- Feature 2
- Bug fix 1

📦 Available on:
✅ Claude Code
✅ Cursor
✅ Gemini CLI
✅ GitHub Copilot
✅ Universal prompts

📖 See release notes: [link]
```

## Troubleshooting

**Q: Version not detected?**
```bash
# Verify version consistency
jq '.metadata.version' .claude-plugin/marketplace.json
jq '.version' plugins/us-stock-analysis/.claude-plugin/plugin.json
```

**Q: Tests failing?**
```bash
# Run locally
npm test
node scripts/test-skills.js
```

**Q: Artifacts not created?**
```bash
# Check GitHub Actions logs:
# https://github.com/yennanliu/InvestSkill/actions
```

**Q: Deployment record missing?**
```bash
# Manual update:
node scripts/record-deploy.js
```

## Script Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/test-skills.js` | Unit tests | `node scripts/test-skills.js` |
| `scripts/publish-cursor-rules.js` | Cursor publishing | Auto (in CI) |
| `scripts/publish-gemini.js` | Gemini publishing | Auto (in CI) |
| `scripts/generate-platform-release-notes.js` | Release notes | Auto (in CI) |
| `scripts/record-deploy.js` | Deployment record | Auto (in CI) |

## Advanced: Enable Registry Publishing

To publish directly to platform registries:

```bash
# Add GitHub Secrets:
CURSOR_REGISTRY_TOKEN=<token>
GEMINI_REGISTRY_TOKEN=<token>
GEMINI_REGISTRY_URL=<url>

# Then releases publish to registries automatically
```

See [CI-CD-GUIDE.md](CI-CD-GUIDE.md) for details.

## Need Help?

1. **Read** [CI-CD-GUIDE.md](CI-CD-GUIDE.md) for complete documentation
2. **Check** GitHub Actions logs
3. **Review** workflow files in `.github/workflows/`
4. **Open** an issue on GitHub

---

**Quick Links**:
- 📖 [Full CI/CD Guide](CI-CD-GUIDE.md)
- 🚀 [Releases Page](https://github.com/yennanliu/InvestSkill/releases)
- 📊 [Deployment History](DEPLOYMENTS.md)
- ⚙️ [GitHub Actions](https://github.com/yennanliu/InvestSkill/actions)
