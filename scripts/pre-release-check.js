#!/usr/bin/env node
/**
 * pre-release-check.js
 * Comprehensive pre-release validation
 * Run before bumping version to catch issues early
 *
 * Usage: node scripts/pre-release-check.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let errors = 0;
let warnings = 0;

console.log('🔍 Running pre-release validation checks...\n');

/**
 * ─────────────────────────────────────────────────────────────────
 * 1. CHECK: All 18 skills registered in plugin.json
 * ─────────────────────────────────────────────────────────────────
 */
function checkSkillsRegistry() {
  console.log('📋 Checking skill registry...');

  const pluginJsonPath = path.join(ROOT, 'plugins/us-stock-analysis/.claude-plugin/plugin.json');
  const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
  const registeredSkills = pluginJson.skills || [];

  const skillsDir = path.join(ROOT, 'plugins/us-stock-analysis/skills');
  const actualSkills = fs.readdirSync(skillsDir).filter(f => {
    return fs.statSync(path.join(skillsDir, f)).isDirectory();
  });

  console.log(`   Registered: ${registeredSkills.length} skills`);
  console.log(`   Actual: ${actualSkills.length} skills`);

  // Check for missing registrations
  actualSkills.forEach(skill => {
    if (!registeredSkills.includes(skill)) {
      console.log(`   ✗ MISSING: "${skill}" in plugin.json`);
      errors++;
    }
  });

  // Check for orphaned registrations
  registeredSkills.forEach(skill => {
    if (!actualSkills.includes(skill)) {
      console.log(`   ✗ ORPHANED: "${skill}" registered but directory missing`);
      errors++;
    }
  });

  if (actualSkills.length !== 18) {
    console.log(`   ⚠️  WARNING: Expected 18 skills, found ${actualSkills.length}`);
    warnings++;
  } else {
    console.log('   ✅ All 18 skills registered correctly');
  }
  console.log('');
}

/**
 * ─────────────────────────────────────────────────────────────────
 * 2. CHECK: All prompts/ files match SKILL.md files
 * ─────────────────────────────────────────────────────────────────
 */
function checkPromptsSync() {
  console.log('📝 Checking prompts synchronization...');

  const promptsDir = path.join(ROOT, 'prompts');
  const skillsDir = path.join(ROOT, 'plugins/us-stock-analysis/skills');

  const promptFiles = fs.readdirSync(promptsDir).filter(f => f.endsWith('.md'));
  const skillDirs = fs.readdirSync(skillsDir).filter(f => {
    return fs.statSync(path.join(skillsDir, f)).isDirectory();
  });

  // Check each skill has a corresponding prompt
  skillDirs.forEach(skill => {
    const promptFile = `${skill}.md`;
    if (!promptFiles.includes(promptFile)) {
      console.log(`   ✗ MISSING: prompts/${promptFile} for skill ${skill}`);
      errors++;
    }
  });

  // Check each prompt has a corresponding skill
  promptFiles.forEach(promptFile => {
    const skillName = promptFile.replace('.md', '');
    if (!skillDirs.includes(skillName)) {
      console.log(`   ✗ ORPHANED: prompts/${promptFile} has no corresponding skill`);
      errors++;
    }
  });

  if (promptFiles.length === skillDirs.length && errors === 0) {
    console.log(`   ✅ All ${promptFiles.length} prompts synchronized with skills`);
  }
  console.log('');
}

/**
 * ─────────────────────────────────────────────────────────────────
 * 3. CHECK: All required documentation files exist
 * ─────────────────────────────────────────────────────────────────
 */
function checkRequiredDocs() {
  console.log('📚 Checking required documentation...');

  const requiredFiles = [
    'README.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'LICENSE',
    'GEMINI.md',
    '.github/copilot-instructions.md',
    '.cursor/rules/invest-skill.mdc',
    'plugins/us-stock-analysis/.claude-plugin/plugin.json',
    '.claude-plugin/marketplace.json'
  ];

  let missing = 0;
  requiredFiles.forEach(file => {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) {
      console.log(`   ✗ MISSING: ${file}`);
      errors++;
      missing++;
    }
  });

  if (missing === 0) {
    console.log(`   ✅ All ${requiredFiles.length} required files exist`);
  }
  console.log('');
}

/**
 * ─────────────────────────────────────────────────────────────────
 * 4. CHECK: Version consistency across all files
 * ─────────────────────────────────────────────────────────────────
 */
function checkVersionConsistency() {
  console.log('🔢 Checking version consistency...');

  const marketplaceJson = JSON.parse(
    fs.readFileSync(path.join(ROOT, '.claude-plugin/marketplace.json'), 'utf8')
  );
  const pluginJson = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'plugins/us-stock-analysis/.claude-plugin/plugin.json'), 'utf8')
  );

  const marketplaceVersion = marketplaceJson.metadata.version;
  const pluginVersion = pluginJson.version;

  console.log(`   Marketplace version: ${marketplaceVersion}`);
  console.log(`   Plugin version: ${pluginVersion}`);

  if (marketplaceVersion !== pluginVersion) {
    console.log(`   ✗ VERSION MISMATCH!`);
    errors++;
  } else {
    console.log('   ✅ Versions match');
  }
  console.log('');
}

/**
 * ─────────────────────────────────────────────────────────────────
 * 5. CHECK: SKILL.md files have proper frontmatter
 * ─────────────────────────────────────────────────────────────────
 */
function checkSkillFrontmatter() {
  console.log('🏷️  Checking SKILL.md frontmatter...');

  const skillsDir = path.join(ROOT, 'plugins/us-stock-analysis/skills');
  const skills = fs.readdirSync(skillsDir).filter(f => {
    return fs.statSync(path.join(skillsDir, f)).isDirectory();
  });

  let missingFrontmatter = 0;
  skills.forEach(skill => {
    const skillMdPath = path.join(skillsDir, skill, 'SKILL.md');
    const content = fs.readFileSync(skillMdPath, 'utf8');

    if (!content.includes('---')) {
      console.log(`   ✗ ${skill}: missing frontmatter delimiter`);
      errors++;
      missingFrontmatter++;
    } else if (!content.includes('description:')) {
      console.log(`   ✗ ${skill}: missing description field`);
      errors++;
      missingFrontmatter++;
    }
  });

  if (missingFrontmatter === 0) {
    console.log(`   ✅ All ${skills.length} SKILL.md files have valid frontmatter`);
  }
  console.log('');
}

/**
 * ─────────────────────────────────────────────────────────────────
 * 6. CHECK: All SKILL.md files have signal block template
 * ─────────────────────────────────────────────────────────────────
 */
function checkSignalBlocks() {
  console.log('🚦 Checking signal block templates...');

  const skillsDir = path.join(ROOT, 'plugins/us-stock-analysis/skills');
  const skills = fs.readdirSync(skillsDir).filter(f => {
    return fs.statSync(path.join(skillsDir, f)).isDirectory();
  });

  let missingSignal = 0;
  skills.forEach(skill => {
    const skillMdPath = path.join(skillsDir, skill, 'SKILL.md');
    const content = fs.readFileSync(skillMdPath, 'utf8');

    if (!content.includes('INVESTMENT SIGNAL') && !content.includes('SIGNAL')) {
      console.log(`   ⚠️  ${skill}: no signal block template found`);
      warnings++;
      missingSignal++;
    }
  });

  if (missingSignal === 0) {
    console.log(`   ✅ All ${skills.length} SKILL.md files have signal blocks`);
  }
  console.log('');
}

/**
 * ─────────────────────────────────────────────────────────────────
 * 7. CHECK: CHANGELOG.md has entry for current version
 * ─────────────────────────────────────────────────────────────────
 */
function checkChangelog() {
  console.log('📝 Checking CHANGELOG.md...');

  const changelogPath = path.join(ROOT, 'CHANGELOG.md');
  const changelogContent = fs.readFileSync(changelogPath, 'utf8');

  const marketplaceJson = JSON.parse(
    fs.readFileSync(path.join(ROOT, '.claude-plugin/marketplace.json'), 'utf8')
  );
  const currentVersion = marketplaceJson.metadata.version;

  if (!changelogContent.includes(`## [${currentVersion}]`)) {
    console.log(`   ✗ No CHANGELOG entry found for v${currentVersion}`);
    console.log(`   ℹ️  Add: ## [${currentVersion}] - YYYY-MM-DD`);
    warnings++;
  } else {
    console.log(`   ✅ CHANGELOG.md has entry for v${currentVersion}`);
  }
  console.log('');
}

/**
 * ─────────────────────────────────────────────────────────────────
 * 8. CHECK: JSON file validity
 * ─────────────────────────────────────────────────────────────────
 */
function checkJsonFiles() {
  console.log('🔧 Checking JSON files...');

  const jsonFiles = [
    '.claude-plugin/marketplace.json',
    'plugins/us-stock-analysis/.claude-plugin/plugin.json'
  ];

  let invalidCount = 0;
  jsonFiles.forEach(file => {
    try {
      const filePath = path.join(ROOT, file);
      JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`   ✅ ${file}`);
    } catch (err) {
      console.log(`   ✗ ${file}: ${err.message}`);
      errors++;
      invalidCount++;
    }
  });

  console.log('');
}

/**
 * ─────────────────────────────────────────────────────────────────
 * 9. CHECK: No uncommitted changes
 * ─────────────────────────────────────────────────────────────────
 */
function checkGitStatus() {
  console.log('📦 Checking git status...');

  const { execSync } = require('child_process');
  try {
    const status = execSync('git status --porcelain', { cwd: ROOT }).toString();
    if (status.trim().length > 0) {
      console.log('   ⚠️  WARNING: Uncommitted changes detected:');
      status.split('\n').filter(l => l.length > 0).slice(0, 5).forEach(line => {
        console.log(`   ${line}`);
      });
      warnings++;
    } else {
      console.log('   ✅ No uncommitted changes');
    }
  } catch (err) {
    console.log('   ℹ️  Not a git repository (skipping)');
  }
  console.log('');
}

/**
 * ─────────────────────────────────────────────────────────────────
 * 10. CHECK: Prompts directory exists and has files
 * ─────────────────────────────────────────────────────────────────
 */
function checkPromptsDirectory() {
  console.log('📂 Checking prompts directory...');

  const promptsDir = path.join(ROOT, 'prompts');
  if (!fs.existsSync(promptsDir)) {
    console.log('   ✗ prompts/ directory missing!');
    errors++;
    return;
  }

  const promptFiles = fs.readdirSync(promptsDir).filter(f => f.endsWith('.md'));
  console.log(`   ✅ prompts/ directory has ${promptFiles.length} files`);
  console.log('');
}

/**
 * ─────────────────────────────────────────────────────────────────
 * Main function
 * ─────────────────────────────────────────────────────────────────
 */
function main() {
  try {
    checkSkillsRegistry();
    checkPromptsSync();
    checkRequiredDocs();
    checkVersionConsistency();
    checkSkillFrontmatter();
    checkSignalBlocks();
    checkChangelog();
    checkJsonFiles();
    checkGitStatus();
    checkPromptsDirectory();

    // Summary
    console.log('═'.repeat(50));
    if (errors === 0 && warnings === 0) {
      console.log('✅ All checks passed! Ready to release.');
      console.log('═'.repeat(50));
      process.exit(0);
    } else {
      console.log(`⚠️  Summary:`);
      if (errors > 0) console.log(`   ❌ ${errors} error(s)`);
      if (warnings > 0) console.log(`   ⚠️  ${warnings} warning(s)`);
      console.log('═'.repeat(50));
      process.exit(errors > 0 ? 1 : 0);
    }
  } catch (err) {
    console.error('❌ Error during validation:', err.message);
    process.exit(1);
  }
}

main();
