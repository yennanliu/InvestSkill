#!/usr/bin/env node
/**
 * generate-platform-release-notes.js
 * Generates platform-specific release notes for all supported AI platforms
 *
 * Environment variables:
 *   - RELEASE_VERSION: Version being released
 */

const fs = require('fs');
const path = require('path');

const VERSION = process.env.RELEASE_VERSION || 'unknown';
const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');

if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

/**
 * Generate Claude Code platform notes
 */
function generateClaudeCodeNotes() {
  const notes = `# 🚀 InvestSkill v${VERSION} — Claude Code Plugin

## Installation

\`\`\`bash
# Add marketplace
/plugin marketplace add yennanliu/InvestSkill

# Install plugin
/plugin install us-stock-analysis

# Verify installation
/plugin list
\`\`\`

## Quick Start

\`\`\`bash
# Evaluate a stock
/us-stock-analysis:stock-eval AAPL

# Stock valuation with all methods
/us-stock-analysis:stock-valuation MSFT

# Deep fundamental analysis
/us-stock-analysis:fundamental-analysis NVDA --visual

# Technical analysis with charts
/us-stock-analysis:technical-analysis TSLA --chart

# Full research bundle
/us-stock-analysis:research-bundle GOOGL
\`\`\`

## All 18 Skills

### Core Analysis (6)
- \`stock-eval\` — Piotroski F-Score, quality metrics
- \`stock-valuation\` — DCF + comparable companies + EV multiples
- \`fundamental-analysis\` — Financial statement deep dive
- \`technical-analysis\` — Chart patterns and indicators
- \`dcf-valuation\` — Intrinsic value modeling
- \`economics-analysis\` — Macro indicators and recession risk

### Financial Reports (2)
- \`financial-report-analyst\` — 10-K, 10-Q, annual reports
- \`earnings-call-analysis\` — Management tone and guidance

### Market Monitoring (4)
- \`insider-trading\` — Form 4 insider activity
- \`institutional-ownership\` — 13F smart money moves
- \`dividend-analysis\` — Dividend safety and yield traps
- \`short-interest\` — Short squeeze scoring

### Advanced Analysis (4)
- \`competitor-analysis\` — Economic moats and Porter's Five Forces
- \`options-analysis\` — Greeks, IV rank, strategy selection
- \`portfolio-review\` — Allocation optimization
- \`sector-analysis\` — Sector rotation opportunities

### Full Research (2)
- \`research-bundle\` — All frameworks combined

## What's New in v${VERSION}

See CHANGELOG.md for detailed updates.

## Platform Support

✅ Claude Code — Native plugin support
✅ Cursor — Rules (.cursor/rules/invest-skill.mdc)
✅ Gemini CLI — Prompts (GEMINI.md + prompts/)
✅ GitHub Copilot — Instructions (.github/copilot-instructions.md)
✅ Any AI Tool — Universal prompts (prompts/ directory)

## Documentation

- [Full README](https://github.com/yennanliu/InvestSkill)
- [Installation Guide](https://github.com/yennanliu/InvestSkill#install)
- [Usage Examples](https://github.com/yennanliu/InvestSkill#usage-examples)
- [Cross-AI Compatibility](https://github.com/yennanliu/InvestSkill#cross-ai-compatibility)

## Support

For issues or feature requests: https://github.com/yennanliu/InvestSkill/issues
`;

  const path_file = path.join(DIST_DIR, 'CLAUDE-CODE-RELEASE-NOTES.md');
  fs.writeFileSync(path_file, notes, 'utf8');
  console.log(`✅ Claude Code release notes: ${path_file}`);
}

/**
 * Generate Cursor platform notes
 */
function generateCursorNotes() {
  const notes = `# 🎯 InvestSkill v${VERSION} — Cursor Rules

## Installation

### Automatic (Recommended)

Cursor automatically loads rules from \`.cursor/rules/invest-skill.mdc\` when you open the repository.

\`\`\`bash
# Clone and open
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill
cursor .

# Open AI Chat (Cmd+K)
# Cursor rules are automatically loaded
\`\`\`

### Manual Installation

1. Download \`cursor-rules-${VERSION}.mdc\` from the release
2. Place in your project: \`.cursor/rules/invest-skill.mdc\`
3. Open Cursor AI Chat (Cmd+K)
4. Rules are automatically applied

## Quick Start

In Cursor AI Chat:

\`\`\`
@prompts/stock-valuation.md Analyze Apple (AAPL)

@prompts/fundamental-analysis.md Deep dive on Microsoft

@prompts/technical-analysis.md What are TSLA's key chart levels?

@prompts/research-bundle.md Complete analysis on NVDA
\`\`\`

## All 18 Frameworks

Available in the \`prompts/\` directory:

- stock-eval.md
- stock-valuation.md
- fundamental-analysis.md
- technical-analysis.md
- dcf-valuation.md
- economics-analysis.md
- financial-report-analyst.md
- earnings-call-analysis.md
- insider-trading.md
- institutional-ownership.md
- competitor-analysis.md
- dividend-analysis.md
- short-interest.md
- options-analysis.md
- portfolio-review.md
- sector-analysis.md
- research-bundle.md

## Features

✅ 18 professional analysis frameworks
✅ Auto-loading from .cursor/rules directory
✅ File references with @prompts/<name>
✅ Paste financial data directly
✅ Standardized INVESTMENT SIGNAL output

## Documentation

See .cursor/rules/invest-skill.mdc for full setup and examples.

## Support

For issues: https://github.com/yennanliu/InvestSkill/issues
`;

  const path_file = path.join(DIST_DIR, 'CURSOR-RELEASE-NOTES.md');
  fs.writeFileSync(path_file, notes, 'utf8');
  console.log(`✅ Cursor release notes: ${path_file}`);
}

/**
 * Generate Gemini platform notes
 */
function generateGeminiNotes() {
  const notes = `# 🔮 InvestSkill v${VERSION} — Gemini CLI Prompts

## Installation

\`\`\`bash
# Navigate to InvestSkill directory
cd /path/to/InvestSkill

# Start Gemini CLI (auto-loads GEMINI.md)
gemini

# Use any framework
> @prompts/stock-valuation.md Analyze AAPL using all valuation methods
\`\`\`

## Quick Start

In Gemini CLI:

\`\`\`
# Stock analysis
> @prompts/stock-eval.md Evaluate Apple with Piotroski scoring

# Valuation
> @prompts/stock-valuation.md Value Microsoft

# Financial reports
> @prompts/financial-report-analyst.md [paste 10-K]

# Full research
> @prompts/research-bundle.md Complete analysis on NVDA
\`\`\`

## All 18 Prompts

| Framework | Command |
|-----------|---------|
| Stock Evaluation | \`@prompts/stock-eval.md AAPL\` |
| Stock Valuation | \`@prompts/stock-valuation.md MSFT\` |
| Fundamental Analysis | \`@prompts/fundamental-analysis.md NVDA\` |
| Technical Analysis | \`@prompts/technical-analysis.md TSLA\` |
| DCF Valuation | \`@prompts/dcf-valuation.md GOOGL\` |
| Economics Analysis | \`@prompts/economics-analysis.md\` |
| Financial Report Analyst | \`@prompts/financial-report-analyst.md\` |
| Earnings Call Analysis | \`@prompts/earnings-call-analysis.md AAPL\` |
| Insider Trading | \`@prompts/insider-trading.md TSLA\` |
| Institutional Ownership | \`@prompts/institutional-ownership.md META\` |
| Competitor Analysis | \`@prompts/competitor-analysis.md AAPL\` |
| Dividend Analysis | \`@prompts/dividend-analysis.md JNJ\` |
| Short Interest | \`@prompts/short-interest.md GME\` |
| Options Analysis | \`@prompts/options-analysis.md AAPL\` |
| Portfolio Review | \`@prompts/portfolio-review.md\` |
| Sector Analysis | \`@prompts/sector-analysis.md\` |
| Research Bundle | \`@prompts/research-bundle.md AAPL\` |

## Features

✅ 18 universal AI-agnostic prompts
✅ File references with @prompts/<name>.md
✅ Paste financial data directly
✅ Works with any AI model
✅ Standardized INVESTMENT SIGNAL output

## Package Contents

\`gemini-prompts-${VERSION}.tar.gz\` includes:

- \`prompts/\` — All 18 analysis frameworks
- \`GEMINI.md\` — Complete setup and usage guide
- \`.cursor/rules/invest-skill.mdc\` — Cursor rules
- \`.github/copilot-instructions.md\` — Copilot setup

## Documentation

See GEMINI.md for detailed setup and examples.

## Support

For issues: https://github.com/yennanliu/InvestSkill/issues
`;

  const path_file = path.join(DIST_DIR, 'GEMINI-RELEASE-NOTES.md');
  fs.writeFileSync(path_file, notes, 'utf8');
  console.log(`✅ Gemini CLI release notes: ${path_file}`);
}

/**
 * Generate Copilot platform notes
 */
function generateCopilotNotes() {
  const notes = `# 🤖 InvestSkill v${VERSION} — GitHub Copilot

## Installation

Copilot automatically loads \`.github/copilot-instructions.md\` when you work in this repository.

\`\`\`bash
# Clone and open in VS Code or JetBrains IDE
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill

# VS Code
code .

# JetBrains IDE (IntelliJ, PyCharm, etc.)
# Open folder in IDE

# GitHub.com Web Editor
# Press . key in GitHub repo
\`\`\`

## Quick Start

Open Copilot Chat and ask:

\`\`\`
# Natural language queries
Perform a stock evaluation of Apple using Piotroski scoring

What's a fair valuation for Microsoft?

Deep dive into Tesla's balance sheet

# Explicit framework references
Use prompts/stock-valuation.md to analyze AAPL

Apply prompts/fundamental-analysis.md to MSFT financials
\`\`\`

## All 18 Frameworks

Copilot understands all frameworks in the \`prompts/\` directory:

- stock-eval.md — Comprehensive evaluation
- stock-valuation.md — Multi-method valuation
- fundamental-analysis.md — Financial statement analysis
- technical-analysis.md — Chart pattern analysis
- dcf-valuation.md — Intrinsic value model
- economics-analysis.md — Macro analysis
- financial-report-analyst.md — 10-K/10-Q analysis
- earnings-call-analysis.md — Earnings transcript analysis
- insider-trading.md — Insider activity tracking
- institutional-ownership.md — Smart money tracking
- competitor-analysis.md — Competitive moat analysis
- dividend-analysis.md — Dividend safety
- short-interest.md — Short squeeze potential
- options-analysis.md — Options strategy selection
- portfolio-review.md — Portfolio optimization
- sector-analysis.md — Sector rotation
- research-bundle.md — Full multi-framework analysis

## Features

✅ 18 professional analysis frameworks
✅ Auto-loaded in VS Code and JetBrains
✅ Works with all major IDEs
✅ Paste financial data or documents
✅ Standardized INVESTMENT SIGNAL output

## Documentation

See .github/copilot-instructions.md for detailed setup and examples.

## Support

For issues: https://github.com/yennanliu/InvestSkill/issues
`;

  const path_file = path.join(DIST_DIR, 'COPILOT-RELEASE-NOTES.md');
  fs.writeFileSync(path_file, notes, 'utf8');
  console.log(`✅ Copilot release notes: ${path_file}`);
}

/**
 * Generate universal notes
 */
function generateUniversalNotes() {
  const notes = `# 🌍 InvestSkill v${VERSION} — Universal Prompts

For use with any AI assistant: ChatGPT, Claude.ai, Anthropic Console, etc.

## Quick Start

1. Copy any prompt from \`prompts/\` directory
2. Paste into your AI chat
3. Ask your analysis question

\`\`\`bash
# Example: Copy to clipboard
cat prompts/stock-valuation.md | pbcopy

# Then paste into ChatGPT and ask:
# "Analyze Apple (AAPL) using the framework above"
\`\`\`

## All 18 Prompts

All prompts are AI-agnostic and work with any model:

- stock-eval.md — Stock evaluation with quality scoring
- stock-valuation.md — Multi-method valuation (DCF + comps + EV)
- fundamental-analysis.md — Financial statement analysis
- technical-analysis.md — Chart patterns and indicators
- dcf-valuation.md — DCF intrinsic value model
- economics-analysis.md — Macro analysis
- financial-report-analyst.md — 10-K/10-Q analysis
- earnings-call-analysis.md — Earnings transcript analysis
- insider-trading.md — Insider activity analysis
- institutional-ownership.md — Institutional tracking
- competitor-analysis.md — Competitive moat analysis
- dividend-analysis.md — Dividend safety scoring
- short-interest.md — Short squeeze analysis
- options-analysis.md — Options strategy selection
- portfolio-review.md — Portfolio optimization
- sector-analysis.md — Sector rotation analysis
- research-bundle.md — Full multi-framework analysis

## Features

✅ 18 professional analysis frameworks
✅ Works with any AI model
✅ No API keys or special setup required
✅ Paste financial data directly
✅ Standardized INVESTMENT SIGNAL output

## Documentation

See README.md for complete platform guide.

## Support

For issues: https://github.com/yennanliu/InvestSkill/issues
`;

  const path_file = path.join(DIST_DIR, 'UNIVERSAL-RELEASE-NOTES.md');
  fs.writeFileSync(path_file, notes, 'utf8');
  console.log(`✅ Universal release notes: ${path_file}`);
}

/**
 * Main function
 */
function main() {
  try {
    console.log(`📋 Generating platform release notes for v${VERSION}`);
    console.log('');

    generateClaudeCodeNotes();
    generateCursorNotes();
    generateGeminiNotes();
    generateCopilotNotes();
    generateUniversalNotes();

    console.log('');
    console.log('✅ All platform release notes generated');
    console.log('');
    console.log('📂 Generated files in dist/:');
    const files = fs.readdirSync(DIST_DIR).filter(f => f.includes('RELEASE-NOTES') || f.includes('INSTALLATION'));
    files.forEach(f => console.log(`   - ${f}`));

  } catch (err) {
    console.error('❌ Error generating release notes:', err.message);
    process.exit(1);
  }
}

main();
