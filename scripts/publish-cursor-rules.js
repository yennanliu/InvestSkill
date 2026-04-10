#!/usr/bin/env node
/**
 * publish-cursor-rules.js
 * Publishes Cursor rules to the Cursor registry (if credentials available)
 * Falls back to creating a release artifact if registry is unavailable
 *
 * Environment variables:
 *   - CURSOR_VERSION: Version being released
 *   - CURSOR_REGISTRY_TOKEN: (Optional) API token for Cursor registry
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const VERSION = process.env.CURSOR_VERSION || 'unknown';
const REGISTRY_TOKEN = process.env.CURSOR_REGISTRY_TOKEN || '';
const ROOT = path.resolve(__dirname, '..');

/**
 * Read the Cursor rules file
 */
function readCursorRules() {
  const rulesPath = path.join(ROOT, '.cursor', 'rules', 'invest-skill.mdc');
  if (!fs.existsSync(rulesPath)) {
    throw new Error(`Cursor rules file not found: ${rulesPath}`);
  }
  return fs.readFileSync(rulesPath, 'utf8');
}

/**
 * Create a Cursor rules release package
 */
function createCursorPackage() {
  const distDir = path.join(ROOT, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const rulesContent = readCursorRules();
  const packagePath = path.join(distDir, `cursor-rules-${VERSION}.mdc`);

  fs.writeFileSync(packagePath, rulesContent, 'utf8');
  console.log(`✅ Cursor rules package created: ${packagePath}`);

  return packagePath;
}

/**
 * Create metadata for Cursor registry
 */
function createCursorMetadata() {
  const metadata = {
    name: 'investskill',
    title: 'InvestSkill — Investment Analysis Rules',
    version: VERSION,
    description: 'Professional investment analysis rules for US stock markets. 18 analysis frameworks for stock evaluation, valuation, fundamental/technical analysis, and portfolio management.',
    author: 'yennanliu',
    repository: 'https://github.com/yennanliu/InvestSkill',
    homepage: 'https://github.com/yennanliu/InvestSkill',
    license: 'MIT',
    keywords: [
      'investment',
      'stock-analysis',
      'valuation',
      'fundamental-analysis',
      'technical-analysis',
      'portfolio',
      'finance'
    ],
    rules: {
      file: '.cursor/rules/invest-skill.mdc',
      globs: ['**/*.md', 'prompts/**', 'plugins/**'],
      alwaysApply: true
    },
    platforms: {
      cursor: {
        version: VERSION,
        file: `.cursor/rules/invest-skill.mdc`,
        capabilities: [
          'stock-eval',
          'stock-valuation',
          'fundamental-analysis',
          'technical-analysis',
          'dcf-valuation',
          'economics-analysis',
          'financial-report-analyst',
          'earnings-call-analysis',
          'insider-trading',
          'institutional-ownership',
          'competitor-analysis',
          'dividend-analysis',
          'short-interest',
          'options-analysis',
          'portfolio-review',
          'sector-analysis',
          'research-bundle'
        ]
      }
    }
  };

  const distDir = path.join(ROOT, 'dist');
  const metadataPath = path.join(distDir, 'cursor-rules-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
  console.log(`✅ Cursor metadata created: ${metadataPath}`);

  return metadataPath;
}

/**
 * Publish to Cursor registry (if token available)
 */
function publishToCursorRegistry() {
  if (!REGISTRY_TOKEN) {
    console.log('ℹ️  CURSOR_REGISTRY_TOKEN not set — skipping registry publish');
    console.log('   (Cursor rules will be loaded from repository)');
    return false;
  }

  console.log('📤 Publishing to Cursor registry...');

  // TODO: Implement actual Cursor registry API call
  // This is a placeholder for the actual implementation
  console.log('ℹ️  Cursor registry API integration pending');
  console.log('   (Check Cursor documentation for registry endpoint)');

  return false;
}

/**
 * Create GitHub release artifact for Cursor
 */
function createGitHubArtifact() {
  const rulesPath = createCursorPackage();
  const metadataPath = createCursorMetadata();

  console.log('');
  console.log('📦 Cursor release artifacts:');
  console.log(`   - ${path.basename(rulesPath)}`);
  console.log(`   - ${path.basename(metadataPath)}`);
  console.log('');
  console.log('📋 Installation for users:');
  console.log('   1. Download cursor-rules-' + VERSION + '.mdc from release');
  console.log('   2. Place in your project: .cursor/rules/invest-skill.mdc');
  console.log('   3. Cursor auto-loads the rules');
  console.log('');

  return true;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log(`🔧 Publishing Cursor Rules v${VERSION}`);
    console.log('');

    // Try registry publish first
    const registrySuccess = publishToCursorRegistry();

    // Always create GitHub artifact
    const artifactSuccess = createGitHubArtifact();

    if (registrySuccess) {
      console.log('✅ Cursor rules published to registry');
    } else {
      console.log('✅ Cursor rules packaged for GitHub release');
    }

  } catch (err) {
    console.error('❌ Error publishing Cursor rules:', err.message);
    process.exit(1);
  }
}

main();
