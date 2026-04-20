# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                    # Run unit tests (270+ skill/structure tests)
npm run validate            # Validate prompt file contents and format
npm run pre-release         # Full pre-release check: pre-release-check + validate + test
npm run verify              # Verify local setup is correct
npm run release:dry-run     # Preview release without making changes
npm run integration-tests   # Run integration tests
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

Every SKILL.md and every `prompts/*.md` must end with a standardized Investment Signal Block using box-drawing characters (UTF-8). Tests validate this.

## Adding a New Skill (12-step process)

See `ADDING-NEW-SKILLS.md` for the full walkthrough. Key steps:

1. Create `plugins/us-stock-analysis/skills/<name>/SKILL.md` with frontmatter
2. Create `prompts/<name>.md` — same content, no frontmatter, no platform-specific syntax
3. Add skill name to `skills` array in `plugins/us-stock-analysis/.claude-plugin/plugin.json`
4. Bump version in both `plugin.json` and `.claude-plugin/marketplace.json` (must match)
5. Update `.cursor/rules/invest-skill.mdc`, `.github/copilot-instructions.md`, `GEMINI.md`
6. Update `README.md` and platform-specific `README-*.md` files
7. Add entry to `CHANGELOG.md`
8. Run `npm test` to confirm 270+ tests pass

## Version Consistency Rule

Both manifest files must have the same version at all times:
- `plugins/us-stock-analysis/.claude-plugin/plugin.json` → `"version"`
- `.claude-plugin/marketplace.json` → `"metadata.version"`

Verify with: `jq '.version' plugins/us-stock-analysis/.claude-plugin/plugin.json && jq '.metadata.version' .claude-plugin/marketplace.json`

## Current State

- **Version**: 1.4.0
- **Skills**: 18 (listed in `plugin.json`)
- **Prompts**: 17 universal files in `prompts/` (research-bundle is meta-only, has no standalone prompt)
- **Node**: ≥18.0.0 required
