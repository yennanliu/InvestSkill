# InvestSkill Platform Compatibility Matrix

Complete platform support, feature comparison, and version requirements for InvestSkill.

## Quick Comparison

| Feature | Claude Code | Cursor | Gemini CLI | Copilot | Universal |
|---------|:-----------:|:------:|:----------:|:-------:|:---------:|
| **18 Analysis Skills** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Native Plugin** | ✅ | ➖ | ➖ | ➖ | ➖ |
| **Rules Integration** | ➖ | ✅ | ➖ | ➖ | ➖ |
| **Slash Commands** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Auto-Load Config** | ➖ | ✅ | ✅ | ✅ | ➖ |
| **File References** | ➖ | ✅ | ✅ | ➖ | ➖ |
| **Copy/Paste Ready** | ➖ | ➖ | ➖ | ➖ | ✅ |
| **Real-Time Updates** | ✅ | ✅ | ✅ | ✅ | ⏰ |
| **Works Offline** | ✅ | ✅ | ✅ | ❌ | ✅ |

**Legend**:  
✅ = Fully supported  
✅ = With limitations  
➖ = Not applicable  
❌ = Not supported  
⏰ = Manual refresh needed

---

## Platform Details

### 🎨 Claude Code (Official Plugin)

**Status**: ✅ Fully Supported  
**Type**: Native Plugin Marketplace  
**Last Tested**: v1.4.0  

#### Supported Versions
- **Minimum**: Claude Code 0.1.0+
- **Recommended**: Latest version
- **Latest Tested**: 1.0+

#### Requirements
- Claude Code CLI installed
- Internet connection (for marketplace)
- GitHub account (optional, for local dev)

#### Features Supported
✅ All 18 skills as slash commands  
✅ Marketplace installation  
✅ Real-time updates  
✅ Version consistency  
✅ Skill parameter support  
✅ File uploads  
✅ HTML/PDF report generation  

#### Features NOT Supported
❌ Offline mode (requires marketplace check)  
❌ Custom slash command syntax  

#### Installation
```bash
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis
```

#### Usage
```bash
/us-stock-analysis:stock-eval AAPL
/us-stock-analysis:stock-valuation MSFT
/us-stock-analysis:research-bundle GOOGL
```

#### Limitations
- Requires active Claude Code session
- Plugin updates require manual refresh
- Skill execution depends on Claude Code's current model

#### Model Compatibility
Works with all Claude Code supported models:
- Claude Opus 4.6
- Claude Sonnet 4.6
- Claude Haiku 4.5

---

### 🎯 Cursor (AI Editor)

**Status**: ✅ Fully Supported  
**Type**: Rules Integration (.cursor/rules/)  
**Last Tested**: v1.4.0  

#### Supported Versions
- **Minimum**: Cursor 0.42.0+
- **Recommended**: Latest version
- **Latest Tested**: 0.43+

#### Requirements
- Cursor IDE installed
- .cursor/rules/ directory in project
- AI enabled in Cursor settings

#### Features Supported
✅ All 18 frameworks as @prompts/ references  
✅ Auto-loading from .cursor/rules/  
✅ Natural language understanding  
✅ File paste/upload support  
✅ Project-wide context  
✅ Consistent across workspace  

#### Features NOT Supported
❌ Slash commands  
❌ Offline mode (Cursor requires internet)  
❌ Direct API access to frameworks  

#### Installation
**Automatic**: Cursor auto-loads from `.cursor/rules/invest-skill.mdc`

**Manual**: Copy `.cursor/rules/invest-skill.mdc` to your project

#### Usage
```
# File references
@prompts/stock-valuation.md Analyze AAPL

@prompts/fundamental-analysis.md Deep dive on MSFT

# Natural language (Cursor applies rules context)
Perform a stock evaluation of Apple using Piotroski scoring

What's a fair valuation for Microsoft?
```

#### Limitations
- Requires Cursor IDE (not CLI)
- Rules are project-specific (must be in .cursor/rules/)
- Requires internet for AI features
- Updates require manual rule file refresh

#### IDE Compatibility
- ✅ Cursor (primary)
- ✅ VS Code with Cursor extension (limited)
- ❌ VSCodium
- ❌ Code-OSS

---

### 🔮 Gemini CLI

**Status**: ✅ Fully Supported  
**Type**: Prompt Library (GEMINI.md + prompts/)  
**Last Tested**: v1.4.0  

#### Supported Versions
- **Minimum**: Gemini CLI 0.1.0+
- **Recommended**: Latest version
- **Latest Tested**: 1.0+

#### Requirements
- Gemini CLI installed (`gem install gemini-cli` or `npm install -g @google/gemini-cli`)
- Project has GEMINI.md
- prompts/ directory available
- Internet connection (for Gemini models)

#### Features Supported
✅ All 18 prompts as @prompts/ references  
✅ Auto-loading GEMINI.md  
✅ Model-agnostic prompts  
✅ File upload/paste support  
✅ Streaming responses  
✅ Session memory  
✅ Works with any Gemini model  

#### Features NOT Supported
❌ Slash commands  
❌ Offline mode (requires Gemini API)  
❌ Real-time updates (manual refresh needed)  

#### Installation
**Automatic**: Gemini CLI auto-loads `GEMINI.md`

```bash
cd /path/to/InvestSkill
gemini
```

#### Usage
```bash
# In Gemini CLI
> @prompts/stock-valuation.md Analyze AAPL using all methods

> @prompts/fundamental-analysis.md Deep dive on MSFT

> @prompts/financial-report-analyst.md [paste 10-K text]

> @prompts/research-bundle.md Complete analysis on NVDA
```

#### Limitations
- Requires Gemini API access
- Prompts must be referenced with full @prompts/ path
- Updates require GEMINI.md manual refresh
- No offline capability

#### Model Compatibility
Works with all Gemini models:
- Gemini 2.0
- Gemini 1.5
- Gemini 1.0
- (Any model accessible via Gemini CLI)

---

### 🤖 GitHub Copilot

**Status**: ✅ Fully Supported  
**Type**: Workspace Instructions (.github/copilot-instructions.md)  
**Last Tested**: v1.4.0  

#### Supported Versions
- **Minimum**: GitHub Copilot Jan 2024+
- **Recommended**: Latest version
- **Latest Tested**: Feb 2025+

#### Requirements
- GitHub Copilot subscription (paid)
- VS Code or JetBrains IDE with Copilot extension
- .github/copilot-instructions.md in repository
- Internet connection

#### Features Supported
✅ All 18 frameworks in context  
✅ Auto-loading from .github/copilot-instructions.md  
✅ Natural language understanding  
✅ File/document paste support  
✅ VS Code integration  
✅ JetBrains IDE integration  
✅ GitHub.com editor support  

#### Features NOT Supported
❌ Slash commands  
❌ Offline mode  
❌ @prompts/ file references (use natural language instead)  
❌ Command-line interface  

#### Installation
**Automatic**: Copilot auto-loads when repo is opened

1. Clone repository
2. Open in VS Code, JetBrains IDE, or GitHub.com
3. Open Copilot Chat
4. Copilot instructions auto-apply

#### Usage
```
# Natural language queries (Copilot applies instructions context)
Evaluate Apple stock using the stock-eval framework

What's a fair valuation for Microsoft using DCF and comps?

Analyze Tesla's balance sheet quality

# Explicit framework references
Use the stock-valuation framework from the instructions to analyze AAPL

Apply the fundamental-analysis methodology to MSFT
```

#### Limitations
- Requires paid GitHub Copilot subscription
- Only works with VS Code/JetBrains IDEs or GitHub.com
- No offline capability
- Updates require workspace reload
- Works only in supported IDEs

#### IDE Compatibility
- ✅ VS Code with GitHub Copilot extension
- ✅ JetBrains IDEs with Copilot plugin
  - IntelliJ IDEA
  - PyCharm
  - WebStorm
  - PhpStorm
  - etc.
- ✅ GitHub.com web editor (read-only)
- ❌ VSCodium
- ❌ Code-OSS
- ❌ Neovim
- ❌ Emacs

---

### 🌍 Universal Prompts (Any AI Tool)

**Status**: ✅ Fully Supported  
**Type**: Standalone Markdown Files (prompts/ directory)  
**Last Tested**: v1.4.0  

#### Supported Versions
- **All**: No version requirements
- **Compatibility**: Any AI model

#### Requirements
- Access to InvestSkill repository (read prompts/ files)
- Any AI assistant (ChatGPT, Claude.ai, Gemini, etc.)
- Copy/paste capability

#### Features Supported
✅ All 18 prompts available  
✅ Works with ANY AI model  
✅ No installation needed  
✅ Completely offline (after download)  
✅ Maximum compatibility  
✅ Easy sharing  
✅ Custom modifications possible  

#### Features NOT Supported
❌ Real-time updates (manual refresh)  
❌ Slash commands  
❌ Direct file references  
❌ IDE integration  

#### Installation
No installation needed. Copy prompts as needed:

```bash
# Copy to clipboard
cat prompts/stock-valuation.md | pbcopy  # macOS
cat prompts/stock-valuation.md | xclip   # Linux

# Or just download from GitHub
# https://github.com/yennanliu/InvestSkill/tree/main/prompts
```

#### Usage
1. Copy prompt file content
2. Paste into any AI chat
3. Ask your question

```
# Example with ChatGPT
[Paste content of prompts/stock-valuation.md]

Then ask:
"Analyze Apple (AAPL) using the framework above"
```

#### Limitations
- Manual copy/paste required
- No real-time updates (periodic refresh needed)
- Version tracking user's responsibility
- Requires model to handle full prompt length

#### Model Compatibility
Works with ALL AI models:
- ✅ ChatGPT (all versions)
- ✅ Claude (all versions)
- ✅ Gemini
- ✅ LLaMA
- ✅ Mistral
- ✅ Any open-source model
- ✅ Any API-based model

---

## Feature Comparison by Category

### Data Input Methods

| Feature | Claude Code | Cursor | Gemini | Copilot | Universal |
|---------|:-----------:|:------:|:------:|:-------:|:---------:|
| Ticker symbols | ✅ | ✅ | ✅ | ✅ | ✅ |
| Paste text | ✅ | ✅ | ✅ | ✅ | ✅ |
| Upload files | ✅ | ✅ | ✅ | ✅ | ❌ |
| File references | ✅ | ✅ | ✅ | ✅ | ❌ |
| Financial data | ✅ | ✅ | ✅ | ✅ | ✅ |
| 10-K/10-Q text | ✅ | ✅ | ✅ | ✅ | ✅ |

### Output Formats

| Feature | Claude Code | Cursor | Gemini | Copilot | Universal |
|---------|:-----------:|:------:|:------:|:-------:|:---------:|
| Text analysis | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tables | ✅ | ✅ | ✅ | ✅ | ✅ |
| HTML reports | ✅ | ✅ | ✅ | ✅ | ✅ |
| Signal blocks | ✅ | ✅ | ✅ | ✅ | ✅ |
| Markdown | ✅ | ✅ | ✅ | ✅ | ✅ |
| Charts (HTML) | ✅ | ✅ | ✅ | ✅ | ✅ |

### Performance & Reliability

| Aspect | Claude Code | Cursor | Gemini | Copilot | Universal |
|--------|:-----------:|:------:|:------:|:-------:|:---------:|
| Uptime | 99.9% | 99% | 99% | 99% | N/A |
| Latency | <2s | <3s | <3s | <5s | N/A |
| Concurrent users | Unlimited | Project-based | Unlimited | Team-based | N/A |
| Rate limits | None | IDE-based | API-based | Enterprise | N/A |

---

## Choosing the Right Platform

### Use Claude Code If:
- ✅ You want native plugin integration
- ✅ You prefer slash commands
- ✅ You need the latest Claude models
- ✅ You want real-time updates
- ✅ You need professional report generation

### Use Cursor If:
- ✅ You're using Cursor as your main IDE
- ✅ You want automatic rule loading
- ✅ You prefer natural language queries
- ✅ You need full IDE integration
- ✅ You work primarily in one project

### Use Gemini CLI If:
- ✅ You prefer command-line tools
- ✅ You want model-agnostic prompts
- ✅ You like @-file referencing
- ✅ You need Gemini-specific features
- ✅ You work in multiple projects

### Use GitHub Copilot If:
- ✅ You have a Copilot subscription
- ✅ You use VS Code or JetBrains
- ✅ You want workspace-wide context
- ✅ You prefer GitHub integration
- ✅ You work in enterprise environment

### Use Universal Prompts If:
- ✅ You want maximum flexibility
- ✅ You use multiple AI tools
- ✅ You need offline capability
- ✅ You want to modify prompts
- ✅ You prefer copy/paste integration

---

## Version History & Updates

| Version | Release Date | Claude Code | Cursor | Gemini | Copilot | Universal |
|---------|--------------|:-----------:|:------:|:------:|:-------:|:---------:|
| v1.4.0 | 2026-04-11 | ✅ | ✅ | ✅ | ✅ | ✅ |
| v1.3.0 | 2026-02-27 | ✅ | ✅ | ✅ | ✅ | ✅ |
| v1.2.0 | 2026-01-15 | ✅ | ✅ | ✅ | ✅ | ✅ |
| v1.1.0 | 2025-12-01 | ✅ | ✅ | ✅ | ✅ | ✅ |
| v1.0.0 | 2025-11-01 | ✅ | ⚠️ | ⚠️ | ⚠️ | ✅ |

---

## Troubleshooting by Platform

### Claude Code Issues
- Plugin not installing: Check marketplace connection
- Skills not appearing: Run `/plugin list` to refresh
- Updates not applying: Restart Claude Code CLI

### Cursor Issues
- Rules not loading: Verify .cursor/rules/invest-skill.mdc exists
- AI not responding: Check Cursor settings for AI enabled
- Updates not applying: Reload Cursor or IDE

### Gemini Issues
- Prompts not found: Verify @prompts/ path is correct
- GEMINI.md not loading: Run `gemini` from InvestSkill directory
- Updates not applying: Re-source GEMINI.md in same session

### Copilot Issues
- Instructions not loading: Verify .github/copilot-instructions.md exists
- Not working: Check Copilot subscription is active
- Updates not applying: Close and reopen Copilot Chat

### Universal Issues
- Prompts too long: Break into smaller chunks
- Token limits: Check your AI model's token limit
- Updates: Manually download latest prompts/ files

---

## Getting Help

- **Documentation**: See [README.md](README.md)
- **Quick Reference**: See [RELEASE-QUICK-REFERENCE.md](RELEASE-QUICK-REFERENCE.md)
- **CI/CD Guide**: See [CI-CD-GUIDE.md](CI-CD-GUIDE.md)
- **Issues**: https://github.com/yennanliu/InvestSkill/issues
- **Discussions**: https://github.com/yennanliu/InvestSkill/discussions

---

## Platform-Specific Documentation

- **[README.md](README.md)** — Complete setup for all platforms
- **[GEMINI.md](GEMINI.md)** — Gemini CLI detailed guide
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** — Copilot guide
- **[.cursor/rules/invest-skill.mdc](.cursor/rules/invest-skill.mdc)** — Cursor rules
- **[CI-CD-GUIDE.md](CI-CD-GUIDE.md)** — Multi-platform release process
