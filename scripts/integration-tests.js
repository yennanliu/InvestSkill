#!/usr/bin/env node
/**
 * integration-tests.js
 * Comprehensive integration tests for publishing
 * Validates that all platform artifacts and configurations are correct
 *
 * Usage:
 *   node scripts/integration-tests.js              # Test current state
 *   node scripts/integration-tests.js --verbose    # Detailed output
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const VERBOSE = process.argv.includes('--verbose');

// Test tracking
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;
const failures = [];

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

/**
 * Test helper
 */
function test(name, fn) {
  testsRun++;
  try {
    fn();
    console.log(`${colors.green}✓${colors.reset} ${name}`);
    testsPassed++;
  } catch (err) {
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    if (VERBOSE) {
      console.log(`  ${err.message}`);
    }
    failures.push({ name, error: err.message });
    testsFailed++;
  }
}

/**
 * Test: Cursor rules format is valid
 */
function testCursorRulesFormat() {
  test('Cursor rules file exists', () => {
    const rulesPath = path.join(ROOT, '.cursor/rules/invest-skill.mdc');
    if (!fs.existsSync(rulesPath)) throw new Error('File not found: .cursor/rules/invest-skill.mdc');
  });

  test('Cursor rules file is not empty', () => {
    const rulesPath = path.join(ROOT, '.cursor/rules/invest-skill.mdc');
    const content = fs.readFileSync(rulesPath, 'utf8');
    if (content.length < 100) throw new Error('Rules file too small (< 100 bytes)');
  });

  test('Cursor rules contains framework references', () => {
    const rulesPath = path.join(ROOT, '.cursor/rules/invest-skill.mdc');
    const content = fs.readFileSync(rulesPath, 'utf8');
    if (!content.includes('@prompts/')) throw new Error('No @prompts/ references found');
    const matches = content.match(/@prompts\/[\w-]+\.md/g) || [];
    if (matches.length < 15) throw new Error(`Only ${matches.length} prompts referenced (expected 17+)`);
  });

  test('Cursor rules has no syntax errors', () => {
    const rulesPath = path.join(ROOT, '.cursor/rules/invest-skill.mdc');
    const content = fs.readFileSync(rulesPath, 'utf8');
    // Check for unclosed brackets
    const openBrackets = (content.match(/\[/g) || []).length;
    const closeBrackets = (content.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      throw new Error(`Bracket mismatch: ${openBrackets} open, ${closeBrackets} close`);
    }
  });
}

/**
 * Test: Gemini prompts load correctly
 */
function testGeminiPromptsLoad() {
  test('GEMINI.md exists', () => {
    const geminiPath = path.join(ROOT, 'GEMINI.md');
    if (!fs.existsSync(geminiPath)) throw new Error('GEMINI.md not found');
  });

  test('GEMINI.md contains prompt references', () => {
    const geminiPath = path.join(ROOT, 'GEMINI.md');
    const content = fs.readFileSync(geminiPath, 'utf8');
    if (!content.includes('@prompts/')) throw new Error('No @prompts/ references in GEMINI.md');
  });

  test('All referenced prompts exist', () => {
    const geminiPath = path.join(ROOT, 'GEMINI.md');
    const content = fs.readFileSync(geminiPath, 'utf8');
    const matches = content.match(/@prompts\/([\w-]+)\.md/g) || [];
    
    matches.forEach(match => {
      const filename = match.replace('@prompts/', '');
      const filePath = path.join(ROOT, 'prompts', filename);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Prompt file not found: ${filename}`);
      }
    });
  });

  test('Prompts are valid markdown', () => {
    const promptsDir = path.join(ROOT, 'prompts');
    const prompts = fs.readdirSync(promptsDir).filter(f => f.endsWith('.md'));
    
    prompts.forEach(prompt => {
      const filePath = path.join(promptsDir, prompt);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for signal block
      if (!content.includes('INVESTMENT SIGNAL')) {
        throw new Error(`${prompt}: Missing INVESTMENT SIGNAL block`);
      }
      
      // Check it's not empty
      if (content.length < 200) {
        throw new Error(`${prompt}: File too small`);
      }
    });
  });
}

/**
 * Test: All platform artifacts
 */
function testPlatformArtifacts() {
  test('Plugin manifest exists', () => {
    const pluginPath = path.join(ROOT, 'plugins/us-stock-analysis/.claude-plugin/plugin.json');
    if (!fs.existsSync(pluginPath)) throw new Error('plugin.json not found');
    
    const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
    if (!plugin.version) throw new Error('No version in plugin.json');
    if (!Array.isArray(plugin.skills)) throw new Error('No skills array in plugin.json');
  });

  test('Marketplace manifest exists', () => {
    const marketplacePath = path.join(ROOT, '.claude-plugin/marketplace.json');
    if (!fs.existsSync(marketplacePath)) throw new Error('marketplace.json not found');
    
    const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
    if (!marketplace.metadata.version) throw new Error('No version in marketplace.json');
  });

  test('Copilot instructions exist', () => {
    const copilotPath = path.join(ROOT, '.github/copilot-instructions.md');
    if (!fs.existsSync(copilotPath)) throw new Error('.github/copilot-instructions.md not found');
    
    const content = fs.readFileSync(copilotPath, 'utf8');
    if (content.length < 100) throw new Error('Copilot instructions too small');
  });

  test('README files exist for all platforms', () => {
    const readmes = [
      'README.md',
      'README-claude-code.md',
      'README-cursor.md',
      'README-gemini.md',
    ];
    
    readmes.forEach(readme => {
      const readmePath = path.join(ROOT, readme);
      if (!fs.existsSync(readmePath)) throw new Error(`Missing: ${readme}`);
    });
  });
}

/**
 * Test: Version consistency
 */
function testVersionConsistency() {
  test('Version consistency across configs', () => {
    const pluginPath = path.join(ROOT, 'plugins/us-stock-analysis/.claude-plugin/plugin.json');
    const marketplacePath = path.join(ROOT, '.claude-plugin/marketplace.json');
    
    const pluginVersion = JSON.parse(fs.readFileSync(pluginPath, 'utf8')).version;
    const marketplaceVersion = JSON.parse(fs.readFileSync(marketplacePath, 'utf8')).metadata.version;
    
    if (pluginVersion !== marketplaceVersion) {
      throw new Error(`Version mismatch: plugin ${pluginVersion} vs marketplace ${marketplaceVersion}`);
    }
  });

  test('Valid semantic version format', () => {
    const pluginPath = path.join(ROOT, 'plugins/us-stock-analysis/.claude-plugin/plugin.json');
    const version = JSON.parse(fs.readFileSync(pluginPath, 'utf8')).version;
    
    if (!/^\d+\.\d+\.\d+/.test(version)) {
      throw new Error(`Invalid version format: ${version}`);
    }
  });
}

/**
 * Test: Checksums validate
 */
function testChecksumValidation() {
  test('Checksum file format is valid', () => {
    try {
      // This would validate checksums if artifacts were present
      // For now, just check the checksum format
      const distPath = path.join(ROOT, 'dist');
      if (fs.existsSync(distPath)) {
        const checksumPath = path.join(distPath, 'checksums.txt');
        if (fs.existsSync(checksumPath)) {
          const content = fs.readFileSync(checksumPath, 'utf8');
          // Each line should have: hash  filename
          const lines = content.split('\n').filter(l => l.trim());
          lines.forEach(line => {
            if (!line.match(/^[a-f0-9]+\s+.+/)) {
              throw new Error(`Invalid checksum format: ${line}`);
            }
          });
        }
      }
    } catch (err) {
      throw err;
    }
  });
}

/**
 * Test: No duplicate skills
 */
function testNoDuplicateSkills() {
  test('No duplicate skills in registry', () => {
    const pluginPath = path.join(ROOT, 'plugins/us-stock-analysis/.claude-plugin/plugin.json');
    const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
    
    const skills = plugin.skills;
    const uniqueSkills = new Set(skills);
    
    if (skills.length !== uniqueSkills.size) {
      throw new Error(`Duplicate skills detected (${skills.length} total, ${uniqueSkills.size} unique)`);
    }
  });

  test('All registered skills have SKILL.md', () => {
    const pluginPath = path.join(ROOT, 'plugins/us-stock-analysis/.claude-plugin/plugin.json');
    const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
    
    plugin.skills.forEach(skill => {
      const skillPath = path.join(ROOT, `plugins/us-stock-analysis/skills/${skill}/SKILL.md`);
      if (!fs.existsSync(skillPath)) {
        throw new Error(`Missing SKILL.md for ${skill}`);
      }
    });
  });

  test('All prompts have corresponding skills', () => {
    const promptsDir = path.join(ROOT, 'prompts');
    const prompts = fs.readdirSync(promptsDir).filter(f => f.endsWith('.md'));
    const pluginPath = path.join(ROOT, 'plugins/us-stock-analysis/.claude-plugin/plugin.json');
    const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
    
    const skillNames = plugin.skills;
    const promptNames = prompts.map(p => p.replace('.md', ''));
    
    // report-generator is excluded from prompts (it's a tool, not an analysis framework)
    const promptsExcluded = ['report-generator'];
    
    promptNames.forEach(prompt => {
      if (!promptsExcluded.includes(prompt) && !skillNames.includes(prompt)) {
        throw new Error(`Prompt ${prompt}.md has no corresponding skill`);
      }
    });
  });
}

/**
 * Test: Documentation completeness
 */
function testDocumentation() {
  test('CHANGELOG.md exists and has entries', () => {
    const changelogPath = path.join(ROOT, 'CHANGELOG.md');
    if (!fs.existsSync(changelogPath)) throw new Error('CHANGELOG.md not found');
    
    const content = fs.readFileSync(changelogPath, 'utf8');
    if (!content.includes('## [')) throw new Error('No version entries in CHANGELOG.md');
  });

  test('ADDING-NEW-SKILLS.md exists', () => {
    const guidePath = path.join(ROOT, 'ADDING-NEW-SKILLS.md');
    if (!fs.existsSync(guidePath)) throw new Error('ADDING-NEW-SKILLS.md not found');
  });

  test('FAQ.md exists', () => {
    const faqPath = path.join(ROOT, 'FAQ.md');
    if (!fs.existsSync(faqPath)) throw new Error('FAQ.md not found');
  });

  test('DEPLOYMENT-STATUS.md exists', () => {
    const statusPath = path.join(ROOT, 'DEPLOYMENT-STATUS.md');
    if (!fs.existsSync(statusPath)) throw new Error('DEPLOYMENT-STATUS.md not found');
  });
}

/**
 * Main function
 */
function main() {
  console.log(`\n${colors.blue}Running Integration Tests${colors.reset}\n`);

  // Test groups
  console.log(`${colors.blue}## Cursor Rules${colors.reset}`);
  testCursorRulesFormat();

  console.log(`\n${colors.blue}## Gemini Prompts${colors.reset}`);
  testGeminiPromptsLoad();

  console.log(`\n${colors.blue}## Platform Artifacts${colors.reset}`);
  testPlatformArtifacts();

  console.log(`\n${colors.blue}## Version Consistency${colors.reset}`);
  testVersionConsistency();

  console.log(`\n${colors.blue}## Checksums${colors.reset}`);
  testChecksumValidation();

  console.log(`\n${colors.blue}## Skill Registry${colors.reset}`);
  testNoDuplicateSkills();

  console.log(`\n${colors.blue}## Documentation${colors.reset}`);
  testDocumentation();

  // Summary
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`Tests: ${testsPassed} passed, ${testsFailed} failed, ${testsRun} total`);
  
  if (testsFailed === 0) {
    console.log(`${colors.green}✓ All integration tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ ${testsFailed} test(s) failed${colors.reset}\n`);
    if (failures.length > 0 && !VERBOSE) {
      console.log('Failed tests:');
      failures.forEach(f => {
        console.log(`  - ${f.name}`);
      });
      console.log('\nRun with --verbose for details\n');
    }
    process.exit(1);
  }
}

main();
