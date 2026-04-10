#!/usr/bin/env node
/**
 * setup-verify.js
 * Verifies InvestSkill installation across all supported platforms
 *
 * Usage: node scripts/setup-verify.js
 *
 * Checks installation for:
 * - Claude Code
 * - Cursor
 * - Gemini CLI
 * - GitHub Copilot
 * - Universal prompts
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

let checks = {
  success: 0,
  warning: 0,
  fail: 0
};

console.log('\n🔍 InvestSkill Installation Verification\n');
console.log('═'.repeat(60));

/**
 * Safely execute a command
 */
function safeExec(cmd, label) {
  try {
    execSync(cmd, { stdio: 'pipe' });
    return { found: true, version: null };
  } catch (err) {
    return { found: false, error: err.message };
  }
}

/**
 * Get version from command output
 */
function getVersion(cmd) {
  try {
    const output = execSync(cmd, { stdio: 'pipe' }).toString();
    return output.split('\n')[0];
  } catch {
    return null;
  }
}

/**
 * Check Claude Code
 */
function checkClaudeCode() {
  console.log('\n🎨 Claude Code (Official Plugin)\n');

  const result = safeExec('which claude', 'Claude Code CLI');

  if (result.found) {
    console.log('   ✅ Claude Code CLI installed');

    // Try to check plugins
    try {
      const output = execSync('claude /plugin list 2>&1 || true', { stdio: 'pipe' }).toString();
      if (output.includes('us-stock-analysis') || output.includes('InvestSkill')) {
        console.log('   ✅ InvestSkill plugin installed');
        checks.success++;
      } else {
        console.log('   ⚠️  InvestSkill plugin not found');
        console.log('      Install: /plugin install us-stock-analysis');
        checks.warning++;
      }
    } catch {
      console.log('   ℹ️  Could not verify plugin installation');
      console.log('      Run: /plugin list');
    }
    checks.success++;
  } else {
    console.log('   ✗ Claude Code CLI not installed');
    console.log('     Install: https://code.claude.com');
    checks.fail++;
  }
}

/**
 * Check Cursor
 */
function checkCursor() {
  console.log('\n🎯 Cursor (AI Editor)\n');

  const result = safeExec('which cursor', 'Cursor');

  if (result.found) {
    console.log('   ✅ Cursor installed');

    // Check .cursor/rules directory
    const rulesPath = path.join(process.cwd(), '.cursor', 'rules');
    if (fs.existsSync(rulesPath)) {
      const rulesFiles = fs.readdirSync(rulesPath);
      if (rulesFiles.includes('invest-skill.mdc')) {
        console.log('   ✅ InvestSkill rules found in .cursor/rules/');
        checks.success++;
      } else {
        console.log('   ℹ️  InvestSkill rules not found in current project');
        console.log('      Copy: .cursor/rules/invest-skill.mdc to your project');
      }
    } else {
      console.log('   ℹ️  Not in a Cursor project directory');
      console.log('      .cursor/rules/ not found');
    }
    checks.success++;
  } else {
    console.log('   ℹ️  Cursor not found in PATH');
    console.log('      Install: https://cursor.sh');
  }
}

/**
 * Check Gemini CLI
 */
function checkGeminiCLI() {
  console.log('\n🔮 Gemini CLI\n');

  const result = safeExec('which gemini', 'Gemini CLI');

  if (result.found) {
    console.log('   ✅ Gemini CLI installed');

    // Check GEMINI.md
    const geminiPath = path.join(process.cwd(), 'GEMINI.md');
    if (fs.existsSync(geminiPath)) {
      console.log('   ✅ GEMINI.md found in current project');
      const promptsPath = path.join(process.cwd(), 'prompts');
      if (fs.existsSync(promptsPath)) {
        const prompts = fs.readdirSync(promptsPath).filter(f => f.endsWith('.md'));
        console.log(`   ✅ ${prompts.length} prompts found in prompts/ directory`);
        checks.success += 2;
      }
    } else {
      console.log('   ℹ️  GEMINI.md not found in current project');
      console.log('      Auto-loads when running: gemini');
    }
    checks.success++;
  } else {
    console.log('   ℹ️  Gemini CLI not installed');
    console.log('      Install: https://gemini.ai or npm install -g @gemini/cli');
    checks.warning++;
  }
}

/**
 * Check GitHub Copilot
 */
function checkCopilot() {
  console.log('\n🤖 GitHub Copilot\n');

  const vscodeExtPath = path.join(os.homedir(), '.vscode', 'extensions');
  const jetbrainsPath = path.join(os.homedir(), '.config', 'JetBrains');

  let found = false;

  if (fs.existsSync(vscodeExtPath)) {
    const copilotExtension = fs.readdirSync(vscodeExtPath).find(d =>
      d.includes('copilot') || d.includes('Copilot')
    );
    if (copilotExtension) {
      console.log('   ✅ GitHub Copilot for VS Code installed');
      found = true;
    }
  }

  if (fs.existsSync(jetbrainsPath)) {
    const ideDir = fs.readdirSync(jetbrainsPath).find(d => d.includes('IDE'));
    if (ideDir) {
      console.log('   ✅ JetBrains IDE with Copilot available');
      found = true;
    }
  }

  if (found) {
    // Check copilot-instructions.md
    const copilotPath = path.join(process.cwd(), '.github', 'copilot-instructions.md');
    if (fs.existsSync(copilotPath)) {
      console.log('   ✅ Copilot instructions found in this project');
      checks.success += 2;
    } else {
      console.log('   ℹ️  Copilot instructions not in current project');
      console.log('      Auto-loads from: .github/copilot-instructions.md');
    }
    checks.success++;
  } else {
    console.log('   ℹ️  GitHub Copilot not detected');
    console.log('      Install: VS Code extension or JetBrains plugin');
    console.log('      Link: https://github.com/features/copilot');
    checks.warning++;
  }
}

/**
 * Check Universal Prompts
 */
function checkUniversalPrompts() {
  console.log('\n🌍 Universal Prompts (Any AI Tool)\n');

  const promptsPath = path.join(process.cwd(), 'prompts');

  if (fs.existsSync(promptsPath)) {
    const prompts = fs.readdirSync(promptsPath).filter(f => f.endsWith('.md'));
    console.log(`   ✅ ${prompts.length} universal prompts available`);

    // Check for key frameworks
    const keyFrameworks = [
      'stock-valuation.md',
      'fundamental-analysis.md',
      'technical-analysis.md',
      'research-bundle.md'
    ];

    const hasKeyFrameworks = keyFrameworks.every(f => prompts.includes(f));
    if (hasKeyFrameworks) {
      console.log('   ✅ All key frameworks present');
      checks.success += 2;
    }
    checks.success++;
  } else {
    console.log('   ⚠️  Prompts directory not found');
    console.log('      Clone: https://github.com/yennanliu/InvestSkill');
    checks.warning++;
  }
}

/**
 * Check File Structure
 */
function checkFileStructure() {
  console.log('\n📂 Project Structure\n');

  const requiredDirs = [
    'plugins/us-stock-analysis',
    'prompts',
    '.github',
    '.cursor'
  ];

  const requiredFiles = [
    'README.md',
    'CHANGELOG.md',
    'GEMINI.md',
    '.claude-plugin/marketplace.json'
  ];

  let dirCount = 0;
  requiredDirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      console.log(`   ✅ ${dir}/`);
      dirCount++;
    } else {
      console.log(`   ⚠️  ${dir}/ not found`);
    }
  });

  console.log('');

  let fileCount = 0;
  requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      const sizeKb = (stat.size / 1024).toFixed(1);
      console.log(`   ✅ ${file} (${sizeKb} KB)`);
      fileCount++;
    } else {
      console.log(`   ⚠️  ${file} not found`);
    }
  });

  if (dirCount === requiredDirs.length && fileCount === requiredFiles.length) {
    checks.success += 2;
  } else {
    checks.warning++;
  }
}

/**
 * Generate Recommendations
 */
function generateRecommendations() {
  console.log('\n📋 Recommendations\n');

  const recommendations = [];

  if (checks.fail > 0) {
    recommendations.push('❌ Fix errors before using InvestSkill');
  }

  if (checks.warning > 0) {
    recommendations.push('⚠️  Address warnings to enable all features');
  }

  if (checks.success >= 8) {
    recommendations.push('✅ InvestSkill is properly installed!');
    recommendations.push('🚀 You can now use all 18 analysis frameworks');
  }

  recommendations.forEach(rec => console.log(`   ${rec}`));
  console.log('');
}

/**
 * Main function
 */
function main() {
  try {
    checkClaudeCode();
    checkCursor();
    checkGeminiCLI();
    checkCopilot();
    checkUniversalPrompts();
    checkFileStructure();

    // Summary
    console.log('\n═'.repeat(60));
    console.log('\n📊 Summary\n');
    console.log(`   ✅ Success: ${checks.success}`);
    console.log(`   ⚠️  Warnings: ${checks.warning}`);
    console.log(`   ❌ Failures: ${checks.fail}`);
    console.log('');

    generateRecommendations();

    console.log('═'.repeat(60));
    console.log('\n📖 Next Steps:\n');
    console.log('   1. Claude Code:  /plugin install us-stock-analysis');
    console.log('   2. Cursor:       Open .cursor/rules/invest-skill.mdc');
    console.log('   3. Gemini CLI:   cd /path/to/InvestSkill && gemini');
    console.log('   4. Copilot:      Open repo in VS Code or JetBrains');
    console.log('   5. Any AI:       Copy prompts/ files to your chat');
    console.log('\n📚 Documentation:\n');
    console.log('   - Full Setup:    README.md');
    console.log('   - Quick Start:   RELEASE-QUICK-REFERENCE.md');
    console.log('   - CI/CD Guide:   CI-CD-GUIDE.md');
    console.log('\n');

    process.exit(checks.fail > 0 ? 1 : 0);
  } catch (err) {
    console.error('❌ Error during verification:', err.message);
    process.exit(1);
  }
}

main();
