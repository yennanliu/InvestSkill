# Adding a New Skill to InvestSkill

Comprehensive guide for contributing a new analysis skill to the InvestSkill project.

---

## Table of Contents

1. [Understanding Skills](#understanding-skills)
2. [File Structure](#file-structure)
3. [Step-by-Step Walkthrough](#step-by-step-walkthrough)
4. [Testing Your Skill](#testing-your-skill)
5. [Platform Sync Checklist](#platform-sync-checklist)
6. [Review Process](#review-process)

---

## Understanding Skills

An InvestSkill **skill** is a reusable investment analysis framework available across multiple platforms:

- **Claude Code Plugin**: `/skill-name` command with parameters
- **Cursor IDE**: `@prompts/skill-name.md` file reference in rules
- **Gemini CLI**: `@prompts/skill-name.md` file reference in GEMINI.md
- **GitHub Copilot**: Context-loaded from `.github/copilot-instructions.md`
- **Universal**: Copy-paste from `prompts/skill-name.md`

### Skill Categories

| Category | Count | Purpose | Examples |
|----------|-------|---------|----------|
| Core Analysis | 6 | Fundamental evaluation | stock-eval, fundamental-analysis |
| Financial Reports | 2 | Document analysis | financial-report-analyst, earnings-call-analysis |
| Market Monitoring | 4 | Activity tracking | insider-trading, dividend-analysis |
| Advanced Analysis | 4 | Specialized evaluation | options-analysis, competitor-analysis |
| Meta-Skills | 2 | Multi-skill orchestration | research-bundle, report-generator |

---

## File Structure

When adding a new skill named `my-analysis`, create these files:

```
InvestSkill/
├── plugins/us-stock-analysis/skills/my-analysis/
│   ├── SKILL.md                  ← Claude Code skill definition
│   └── ...                         ← Any supporting files
├── prompts/
│   └── my-analysis.md             ← Universal prompt (copy of SKILL.md minus frontmatter)
├── plugins/us-stock-analysis/.claude-plugin/
│   └── plugin.json                ← Register skill here
├── .cursor/rules/
│   └── invest-skill.mdc           ← Update with new skill reference
├── .github/
│   └── copilot-instructions.md    ← Update with new skill
├── GEMINI.md                      ← Update with new skill
├── README.md                      ← Update features list
├── README-*.md                    ← Update platform-specific guides
└── CHANGELOG.md                   ← Record the addition
```

---

## Step-by-Step Walkthrough

### Step 1: Create Skill Directory

```bash
mkdir -p plugins/us-stock-analysis/skills/my-analysis
cd plugins/us-stock-analysis/skills/my-analysis
```

### Step 2: Create SKILL.md File

Create `SKILL.md` with this structure:

```markdown
---
description: Brief one-line description of the skill
---

# My Analysis Skill

## Overview
[2-3 sentences explaining what this skill does and when to use it]

## Framework

### Phase 1: [Phase Name]
[Describe the first analysis phase]

### Phase 2: [Phase Name]
[Describe the second phase]

## Inputs Required

- **Stock Ticker**: AAPL, MSFT, etc.
- **Optional Data**: [Any additional data needed]

## Output Format

All analyses include:

1. **Executive Summary** — Key findings (2-3 sentences)
2. **Quantitative Analysis** — Specific metrics and numbers
3. **Qualitative Assessment** — Market dynamics, competitive factors
4. **Investment Signal Block** — Standard signal box

### Investment Signal Block

```
╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BULLISH / NEUTRAL / BEARISH     ║
║ Confidence:  HIGH / MEDIUM / LOW             ║
║ Horizon:     SHORT / MEDIUM / LONG-TERM      ║
║ Score:       X.X / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      BUY / HOLD / SELL               ║
║ Conviction:  STRONG / MODERATE / WEAK        ║
╚══════════════════════════════════════════════╝
```

## Example

> Analyze Apple (AAPL) using the [skill name] framework

[Provide a realistic example output matching the signal block format]

## Notes

- [Any important caveats or assumptions]
- [Limitations of the framework]
- [When to use vs. when to use other skills]

---

**Framework Version**: 1.0  
**Last Updated**: [Date]  
**Status**: Active
```

### Step 3: Create prompts/my-analysis.md

Copy the content from `SKILL.md` but **remove the frontmatter** (the `---` section):

```bash
cat plugins/us-stock-analysis/skills/my-analysis/SKILL.md | tail -n +5 > prompts/my-analysis.md
```

Or manually copy and remove lines 1-3 (the YAML frontmatter).

**Important**: The `prompts/` version must be AI-agnostic:
- ✅ Use `prompts/` file references for Cursor/Gemini
- ✅ Use natural language descriptions
- ❌ No Claude Code slash commands
- ❌ No platform-specific syntax

### Step 4: Register in plugin.json

Edit `plugins/us-stock-analysis/.claude-plugin/plugin.json`:

```json
{
  "skills": [
    "stock-eval",
    "fundamental-analysis",
    ...
    "my-analysis"  ← Add in alphabetical order
  ]
}
```

Update version number:
```json
{
  "version": "1.5.0"  ← Bump version
}
```

### Step 5: Update marketplace.json

Edit `.claude-plugin/marketplace.json`:

```json
{
  "metadata": {
    "version": "1.5.0"  ← Bump to match plugin.json
  }
}
```

### Step 6: Update .cursor/rules/invest-skill.mdc

Add a reference to the new skill in the rules file. Find the section listing all 18 frameworks and add:

```
@prompts/my-analysis.md for My Analysis Skill — [brief description]
```

### Step 7: Update .github/copilot-instructions.md

Add the skill to the framework list:

```markdown
## Available Frameworks

### [Category Name] (N)
- My Analysis Skill (`@prompts/my-analysis.md`) — [description]
```

### Step 8: Update GEMINI.md

Add to the appropriate section:

```markdown
@prompts/my-analysis.md for My Analysis Skill — [brief description]
```

### Step 9: Update README.md

1. Add to features list
2. Add skill to appropriate section
3. Add usage example
4. Update skill count from 18 to 19

### Step 10: Update Platform-Specific README Files

Update each of these:
- `README-claude-code.md` — Add `/my-analysis` command and example
- `README-cursor.md` — Add to skill table
- `README-gemini.md` — Add to framework list

### Step 11: Update CHANGELOG.md

Add to the `[Unreleased]` section:

```markdown
## [Unreleased]

### Added
- New `/my-analysis` skill for [description]
  - [Key feature 1]
  - [Key feature 2]
  - [Key feature 3]
```

### Step 12: Commit Changes

```bash
git add -A
git commit -m "feat: add my-analysis skill for [description]

- New SKILL.md with [key features]
- Universal prompt: prompts/my-analysis.md
- Registered in all platforms: Claude Code, Cursor, Gemini, Copilot
- Platform docs updated: README*.md

Total skills: 18 → 19"
```

---

## Testing Your Skill

### 1. Run Unit Tests

```bash
npm test
```

Expected output:
```
✅ Passed: 270+ tests
```

### 2. Verify File Structure

```bash
# Check SKILL.md exists
ls plugins/us-stock-analysis/skills/my-analysis/SKILL.md

# Check prompts/ sync
ls prompts/my-analysis.md

# Check frontmatter removed from prompts version
head -1 prompts/my-analysis.md  # Should NOT start with ---
```

### 3. Validate JSON Manifests

```bash
jq empty plugins/us-stock-analysis/.claude-plugin/plugin.json
jq empty .claude-plugin/marketplace.json
echo "✅ JSON valid"
```

### 4. Test Signal Block Format

The SKILL.md must include a properly formatted signal block at the end:

```bash
grep -A 10 "INVESTMENT SIGNAL" plugins/us-stock-analysis/skills/my-analysis/SKILL.md
```

### 5. Test Across Platforms (Manual)

**Claude Code:**
```bash
claude
/plugin list | grep my-analysis
/us-stock-analysis:my-analysis AAPL
```

**Cursor:**
```bash
cursor .
# In AI Chat:
@prompts/my-analysis.md Analyze AAPL
```

**Gemini CLI:**
```bash
cd /path/to/InvestSkill
gemini
> @prompts/my-analysis.md Analyze AAPL
```

---

## Platform Sync Checklist

Use this checklist to ensure your skill is available across all platforms:

```
Claude Code Plugin
  ☐ Registered in plugins/us-stock-analysis/.claude-plugin/plugin.json
  ☐ SKILL.md file created with frontmatter
  ☐ Tested with /us-stock-analysis:my-analysis
  ☐ Appears in /plugin list

Cursor IDE Rules
  ☐ Added to .cursor/rules/invest-skill.mdc
  ☐ Referenced with @prompts/my-analysis.md
  ☐ Tested in Cursor AI Chat (Cmd+K)

Gemini CLI
  ☐ Added to GEMINI.md
  ☐ Referenced with @prompts/my-analysis.md
  ☐ prompts/my-analysis.md exists (no frontmatter)
  ☐ Tested with > @prompts/my-analysis.md

GitHub Copilot
  ☐ Added to .github/copilot-instructions.md
  ☐ Works in VS Code / JetBrains

Universal Access
  ☐ prompts/my-analysis.md created (AI-agnostic)
  ☐ No slash commands or platform-specific syntax
  ☐ Compatible with ChatGPT, Claude.ai, etc.

Documentation
  ☐ README.md updated
  ☐ README-claude-code.md updated
  ☐ README-cursor.md updated
  ☐ README-gemini.md updated
  ☐ CHANGELOG.md updated

Quality
  ☐ Frontmatter in SKILL.md only (not in prompts/)
  ☐ Signal block at end of both files
  ☐ npm test passes (270+ tests)
  ☐ No JSON validation errors
```

---

## Review Process

### Before Submitting PR

1. **Run pre-release validation**:
   ```bash
   npm run pre-release
   ```

2. **Check test coverage**:
   ```bash
   npm test 2>&1 | tail -20
   ```

3. **Verify version bumps**:
   ```bash
   jq '.version' plugins/us-stock-analysis/.claude-plugin/plugin.json
   jq '.metadata.version' .claude-plugin/marketplace.json
   # Both should match (e.g., 1.5.0)
   ```

4. **Test locally across platforms** (if possible)

5. **Lint markdown**:
   ```bash
   # Check for common markdown issues
   grep -r "^---" prompts/my-analysis.md  # Should be empty
   ```

### PR Checklist

When submitting your PR, include:

- [ ] New skill file: `plugins/us-stock-analysis/skills/my-analysis/SKILL.md`
- [ ] Universal prompt: `prompts/my-analysis.md` (no frontmatter)
- [ ] Registration: Updated `plugin.json`, `marketplace.json`
- [ ] Platform sync: Updated `.cursor/`, `.github/`, `GEMINI.md`
- [ ] Documentation: Updated all README files
- [ ] Changelog: Added to `CHANGELOG.md`
- [ ] Tests pass: `npm test` shows 270+ passed
- [ ] No JSON errors: `npm run validate` passes
- [ ] Version bumped: Both manifest files updated

### Merge Criteria

Your PR will be merged when:

✅ All tests pass  
✅ Platform sync complete (5/5 platforms)  
✅ Documentation updated (all guides)  
✅ Changelog entry added  
✅ Version consistency verified  

---

## Common Patterns

### Pattern 1: Valuation Skills

Skills that estimate stock fair value:

```markdown
## Output Format

1. **Valuation Summary** — Fair value range ($X - $Y)
2. **Methodology** — How the range was calculated
3. **Scenarios** — Bull/Base/Bear cases
4. **Sensitivity Analysis** — How sensitive to key assumptions
5. **Margin of Safety** — Discount to fair value at current price
6. **Investment Signal Block** — BUY/HOLD/SELL recommendation
```

### Pattern 2: Quality Assessment Skills

Skills that evaluate company fundamentals:

```markdown
## Scoring Framework

- **Metric A**: 0-30 points
- **Metric B**: 0-30 points
- **Metric C**: 0-40 points
- **Total**: 0-100 with letter grade (A/B/C/D/F)

## Risk Factors

[List the top risks to the investment thesis]
```

### Pattern 3: Technical/Market Monitoring Skills

Skills that analyze charts, insider activity, or market signals:

```markdown
## Key Indicators

1. **Indicator A** — What it means, how to interpret
2. **Indicator B** — What it means, how to interpret
3. **Indicator C** — What it means, how to interpret

## Signal Interpretation

- **Green flags**: When to be bullish
- **Red flags**: When to be bearish
- **Neutral**: When the signal is unclear
```

---

## Troubleshooting

### "npm test" fails after adding skill

**Problem**: Tests fail with "skill not registered" or similar

**Solution**:
1. Verify `plugin.json` has your skill name
2. Verify SKILL.md file exists
3. Verify frontmatter is present in SKILL.md (not in prompts/)
4. Run: `jq '.skills' plugins/us-stock-analysis/.claude-plugin/plugin.json | grep my-analysis`

### Signal block not rendering in GitHub/Cursor

**Problem**: Signal block appears broken in some platforms

**Solution**:
1. Ensure it's the last section of SKILL.md and prompts/*.md
2. Verify box-drawing characters are UTF-8 encoded
3. Test in raw text editor (not markdown preview)

### Prompts file has frontmatter

**Problem**: `prompts/my-analysis.md` starts with `---`

**Solution**:
```bash
# Remove lines 1-3 (the YAML frontmatter)
tail -n +4 plugins/us-stock-analysis/skills/my-analysis/SKILL.md > prompts/my-analysis.md
```

### Skill not available in Cursor/Gemini

**Problem**: `@prompts/my-analysis.md` not recognized

**Solution**:
1. Verify `prompts/my-analysis.md` exists
2. Verify added to `.cursor/rules/invest-skill.mdc`
3. Verify added to `GEMINI.md`
4. Restart IDE/CLI
5. Check file permissions: `chmod 644 prompts/my-analysis.md`

---

## Example: Real Skill Addition

See the v1.3.0 release for a real-world example:

- **Stock Valuation Skill**: PR adding `/stock-valuation`
  - Multi-method valuation (DCF, CCA, EV/EBITDA, P/E, residual income)
  - Football field summary
  - Risk-adjusted expected return
  - Registered across all 5 platforms

Review the commit to see all the changes needed:

```bash
git log --oneline | grep "stock-valuation"
# Find the commit and run: git show <commit-hash>
```

---

## Support

Need help?

- 📖 [Check PLATFORM-COMPATIBILITY.md](PLATFORM-COMPATIBILITY.md) for platform-specific details
- 💬 [Open a GitHub Discussion](https://github.com/yennanliu/InvestSkill/discussions)
- 🐛 [File an issue](https://github.com/yennanliu/InvestSkill/issues)

---

**Last Updated**: 2026-04-11  
**Total Skills**: 18 (example walkthrough would make it 19)  
**Next Review**: When adding new skill
