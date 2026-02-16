# Contributing to InvestSkill

Thank you for your interest in contributing to InvestSkill! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- Clear and descriptive title
- Detailed steps to reproduce the issue
- Expected behavior vs actual behavior
- Claude Code version and OS information
- Screenshots if applicable

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- Clear and descriptive title
- Detailed description of the proposed functionality
- Rationale for why this enhancement would be useful
- Examples of how it would work

### Adding New Skills

We welcome new skills that align with investment analysis and financial markets. To add a new skill:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/new-skill-name`)
3. Add your skill under `plugins/us-stock-analysis/skills/your-skill-name/`
4. Create a `SKILL.md` file with proper frontmatter
5. Update `README.md` to list the new skill
6. Update `CHANGELOG.md`
7. Submit a pull request

#### Skill Requirements

Each skill must:
- Have a clear, descriptive name (kebab-case)
- Include a `SKILL.md` file with YAML frontmatter containing a description
- Provide professional-grade, actionable analysis
- Include clear documentation of what the skill does
- Align with the investment/finance theme

Example SKILL.md structure:
```markdown
---
description: Brief description of what this skill does
---

# Skill Name

Detailed description and instructions for the skill.

## Analysis Components

1. Component 1
2. Component 2

## Output Format

Description of expected output format.
```

### Creating New Plugins

To add a completely new plugin to the marketplace:

1. Create a new directory under `plugins/your-plugin-name/`
2. Add `.claude-plugin/plugin.json` with metadata:
   ```json
   {
     "name": "your-plugin-name",
     "description": "Plugin description",
     "version": "1.0.0",
     "author": {
       "name": "Your Name"
     },
     "homepage": "https://github.com/yennanliu/InvestSkill",
     "license": "MIT",
     "keywords": ["keyword1", "keyword2"]
   }
   ```
3. Create `skills/` directory with at least one skill
4. Update `.claude-plugin/marketplace.json` to include your plugin
5. Add documentation in plugin's `README.md`
6. Update root `CHANGELOG.md`

## Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR-USERNAME/InvestSkill.git
cd InvestSkill
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Changes

- Follow existing code style and structure
- Keep changes focused on a single issue
- Write clear, descriptive commit messages

### 4. Test Your Changes

```bash
# Test locally by installing the plugin
claude

# Add local marketplace
/plugin marketplace add /path/to/InvestSkill

# Install and test your changes
/plugin install us-stock-analysis@invest-skill

# Test the skills
/your-skill-name argument
```

### 5. Validate JSON Files

```bash
# Validate marketplace.json
jq empty .claude-plugin/marketplace.json

# Validate plugin.json
jq empty plugins/us-stock-analysis/.claude-plugin/plugin.json
```

### 6. Update Documentation

- Update `README.md` if adding new features
- Update `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/) format
- Update skill documentation as needed

### 7. Commit and Push

```bash
git add .
git commit -m "feat: add new stock screening skill"
git push origin feature/your-feature-name
```

### 8. Create Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Fill out the PR template completely
- Wait for CI checks to pass
- Respond to review feedback

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting, missing semicolons, etc.
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add options analysis skill
fix: correct P/E ratio calculation in stock-eval
docs: update installation instructions
```

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible changes
- **MINOR** version for new features (backwards compatible)
- **PATCH** version for bug fixes

When updating versions:
1. Update version in `plugin.json`
2. Update version in `marketplace.json`
3. Add entry to `CHANGELOG.md`

## Pull Request Process

1. Ensure all CI checks pass (validation, JSON linting)
2. Update documentation as necessary
3. Add or update tests if applicable
4. Get approval from at least one maintainer
5. Maintainers will merge once approved

## Style Guidelines

### JSON Files
- Use 2 spaces for indentation
- Include all required fields
- Keep descriptions clear and concise

### Markdown Files
- Use headers consistently (# for title, ## for sections)
- Include code blocks with appropriate language tags
- Keep line length reasonable (< 120 characters when possible)

### Skills
- Use professional, objective tone
- Provide actionable insights
- Include clear analysis structure
- Add relevant disclaimers for financial content

## Financial Content Guidelines

All financial analysis skills must include appropriate disclaimers:

```markdown
## Disclaimer

This analysis is for educational purposes only and does not constitute financial advice.
Always consult with qualified financial advisors before making investment decisions.
```

## Testing

Before submitting:

1. Install the plugin locally
2. Test all affected skills
3. Verify JSON files are valid
4. Check that documentation is accurate
5. Ensure no breaking changes (or document them)

## Questions?

- Open an issue for questions about contributing
- Check existing issues and discussions
- Review the main README.md for project overview

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- CHANGELOG.md for feature additions

Thank you for contributing to InvestSkill! 🚀
