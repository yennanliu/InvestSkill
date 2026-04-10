#!/usr/bin/env node
/**
 * publish-gemini.js
 * Publishes Gemini CLI prompts and configuration to Gemini registry
 * Falls back to creating a release artifact if registry is unavailable
 *
 * Environment variables:
 *   - GEMINI_VERSION: Version being released
 *   - GEMINI_REGISTRY_TOKEN: (Optional) API token for Gemini registry
 *   - GEMINI_REGISTRY_URL: (Optional) Gemini registry endpoint
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERSION = process.env.GEMINI_VERSION || 'unknown';
const REGISTRY_TOKEN = process.env.GEMINI_REGISTRY_TOKEN || '';
const REGISTRY_URL = process.env.GEMINI_REGISTRY_URL || 'https://registry.gemini.ai';
const ROOT = path.resolve(__dirname, '..');

/**
 * Read GEMINI.md configuration
 */
function readGeminiConfig() {
  const configPath = path.join(ROOT, 'GEMINI.md');
  if (!fs.existsSync(configPath)) {
    throw new Error(`GEMINI.md not found: ${configPath}`);
  }
  return fs.readFileSync(configPath, 'utf8');
}

/**
 * Collect all prompt files
 */
function collectPrompts() {
  const promptsDir = path.join(ROOT, 'prompts');
  if (!fs.existsSync(promptsDir)) {
    throw new Error(`prompts directory not found: ${promptsDir}`);
  }

  const files = fs.readdirSync(promptsDir).filter(f => f.endsWith('.md'));
  const prompts = {};

  files.forEach(file => {
    const filepath = path.join(promptsDir, file);
    const content = fs.readFileSync(filepath, 'utf8');
    prompts[file.replace('.md', '')] = {
      file: `prompts/${file}`,
      size: content.length,
      lines: content.split('\n').length
    };
  });

  return prompts;
}

/**
 * Create Gemini package metadata
 */
function createGeminiMetadata() {
  const prompts = collectPrompts();

  const metadata = {
    name: 'investskill',
    title: 'InvestSkill — Investment Analysis Framework',
    version: VERSION,
    description: 'Professional investment analysis frameworks for US stock markets. 18 universal prompts for stock evaluation, valuation, fundamental/technical analysis, and portfolio management. Works with Gemini CLI, Claude Code, GitHub Copilot, Cursor, and any AI assistant.',
    author: 'yennanliu',
    repository: 'https://github.com/yennanliu/InvestSkill',
    homepage: 'https://github.com/yennanliu/InvestSkill',
    documentation: 'https://github.com/yennanliu/InvestSkill#gemini-cli',
    license: 'MIT',
    keywords: [
      'investment',
      'stock-analysis',
      'valuation',
      'fundamental-analysis',
      'technical-analysis',
      'portfolio',
      'finance',
      'prompts'
    ],
    gemini: {
      version: '1.0',
      config: 'GEMINI.md',
      type: 'prompt-library',
      prompts: Object.keys(prompts).map(name => ({
        name,
        file: `prompts/${name}.md`,
        type: 'analysis-framework'
      })),
      capabilities: {
        reference: '@prompts/<name>.md',
        fileUpload: true,
        streaming: true
      }
    },
    platforms: {
      gemini: {
        version: VERSION,
        config: 'GEMINI.md',
        prompts: prompts,
        totalPrompts: Object.keys(prompts).length
      },
      claude_code: {
        version: VERSION,
        plugin: 'plugins/us-stock-analysis/.claude-plugin/plugin.json'
      },
      copilot: {
        version: VERSION,
        instructions: '.github/copilot-instructions.md'
      },
      cursor: {
        version: VERSION,
        rules: '.cursor/rules/invest-skill.mdc'
      }
    }
  };

  const distDir = path.join(ROOT, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const metadataPath = path.join(distDir, 'gemini-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
  console.log(`✅ Gemini metadata created: ${metadataPath}`);

  return { metadata, metadataPath };
}

/**
 * Create Gemini CLI package
 */
function createGeminiPackage() {
  const distDir = path.join(ROOT, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Create prompts tarball
  const packageName = `gemini-prompts-${VERSION}.tar.gz`;
  const packagePath = path.join(distDir, packageName);

  try {
    execSync(`tar -czf "${packagePath}" --exclude='.git' --exclude='.github' --exclude='dist' --exclude='plugins' --exclude='.claude' --exclude='node_modules' prompts/ GEMINI.md`, {
      cwd: ROOT
    });
    console.log(`✅ Gemini prompts package created: ${packagePath}`);
    return packagePath;
  } catch (err) {
    console.error(`❌ Failed to create Gemini package: ${err.message}`);
    throw err;
  }
}

/**
 * Publish to Gemini registry (if token available)
 */
function publishToGeminiRegistry(metadata) {
  if (!REGISTRY_TOKEN) {
    console.log('ℹ️  GEMINI_REGISTRY_TOKEN not set — skipping registry publish');
    console.log('   (Prompts available via GEMINI.md in repository)');
    return false;
  }

  console.log('📤 Publishing to Gemini registry...');
  console.log(`   Registry: ${REGISTRY_URL}`);

  // TODO: Implement actual Gemini registry API call
  // This is a placeholder for the actual implementation
  console.log('ℹ️  Gemini registry API integration pending');
  console.log('   (Check Gemini documentation for registry endpoint)');

  return false;
}

/**
 * Create summary document
 */
function createInstallationGuide() {
  const distDir = path.join(ROOT, 'dist');
  const guide = `# InvestSkill v${VERSION} — Installation Guide for Gemini CLI

## Quick Start

\`\`\`bash
# Navigate to InvestSkill directory
cd /path/to/InvestSkill

# Start Gemini CLI (auto-loads GEMINI.md)
gemini

# Use any framework
> @prompts/stock-valuation.md Analyze AAPL
\`\`\`

## All 18 Frameworks

| Framework | Usage |
|-----------|-------|
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

- ✅ 18 professional analysis frameworks
- ✅ Works with any AI model via Gemini CLI
- ✅ File references: \`@prompts/<name>.md\`
- ✅ Paste financial data directly
- ✅ Standardized signal output

## Documentation

- See GEMINI.md for detailed setup and examples
- See README.md for all platform instructions
- Reference any \`prompts/*.md\` file for framework details

## Support

For issues or questions, visit: https://github.com/yennanliu/InvestSkill
`;

  const guidePath = path.join(distDir, 'GEMINI-INSTALLATION.md');
  fs.writeFileSync(guidePath, guide, 'utf8');
  console.log(`✅ Installation guide created: ${guidePath}`);

  return guidePath;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log(`🔧 Publishing Gemini CLI Prompts v${VERSION}`);
    console.log('');

    // Create metadata and packages
    const { metadata } = createGeminiMetadata();
    const packagePath = createGeminiPackage();
    const guidePath = createInstallationGuide();

    console.log('');

    // Try registry publish first
    const registrySuccess = publishToGeminiRegistry(metadata);

    if (registrySuccess) {
      console.log('✅ Gemini prompts published to registry');
    } else {
      console.log('✅ Gemini prompts packaged for GitHub release');
    }

    console.log('');
    console.log('📋 Gemini CLI Installation:');
    console.log('   1. Ensure you have Gemini CLI installed');
    console.log('   2. Navigate to InvestSkill directory: cd /path/to/InvestSkill');
    console.log('   3. Start Gemini CLI: gemini');
    console.log('   4. Use any framework: @prompts/stock-valuation.md AAPL');

  } catch (err) {
    console.error('❌ Error publishing Gemini prompts:', err.message);
    process.exit(1);
  }
}

main();
