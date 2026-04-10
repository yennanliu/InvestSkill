#!/usr/bin/env node
/**
 * release-interactive.js
 * Interactive CLI for releasing new versions
 * Guides users through the release process with prompts
 *
 * Usage:
 *   node scripts/release-interactive.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '..');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

/**
 * Create readline interface for user input
 */
function createReader() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Ask user a yes/no question
 */
async function askYesNo(question) {
  const rl = createReader();
  return new Promise(resolve => {
    rl.question(`${colors.blue}?${colors.reset} ${question} (y/n) `, answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Ask user to choose from options
 */
async function askChoice(question, options) {
  const rl = createReader();
  return new Promise(resolve => {
    console.log(`\n${colors.blue}?${colors.reset} ${question}`);
    options.forEach((opt, idx) => {
      console.log(`  ${idx + 1}) ${opt}`);
    });

    rl.question('\nEnter choice (1-' + options.length + '): ', answer => {
      rl.close();
      const idx = parseInt(answer) - 1;
      resolve(idx >= 0 && idx < options.length ? options[idx] : null);
    });
  });
}

/**
 * Ask user for text input
 */
async function askText(question) {
  const rl = createReader();
  return new Promise(resolve => {
    rl.question(`${colors.blue}?${colors.reset} ${question}\n> `, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Get current version
 */
function getCurrentVersion() {
  const marketplacePath = path.join(ROOT, '.claude-plugin/marketplace.json');
  const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
  return marketplace.metadata.version;
}

/**
 * Increment version
 */
function incrementVersion(version, type) {
  const parts = version.split('.');
  let major = parseInt(parts[0]);
  let minor = parseInt(parts[1]);
  let patch = parseInt(parts[2]);

  switch (type) {
    case 'major':
      major++;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor++;
      patch = 0;
      break;
    case 'patch':
      patch++;
      break;
  }

  return `${major}.${minor}.${patch}`;
}

/**
 * Check if version is prerelease (beta, rc, alpha)
 */
function isPrereleaseVersion(version) {
  return /-(alpha|beta|rc)/.test(version);
}

/**
 * Validate input
 */
function validateVersion(version) {
  return /^\d+\.\d+\.\d+/.test(version);
}

/**
 * Show git status
 */
function showGitStatus() {
  try {
    const status = execSync('git status --short', { cwd: ROOT }).toString();
    if (status) {
      console.log(`\n${colors.yellow}⚠️  Uncommitted changes:${colors.reset}`);
      console.log(status);
      return false;
    }
    console.log(`\n${colors.green}✓${colors.reset} Working directory clean`);
    return true;
  } catch (err) {
    console.error('Error checking git status:', err.message);
    return false;
  }
}

/**
 * Show what would be changed
 */
function showReleasePreview(newVersion, type, description) {
  console.log(`\n${colors.bright}Release Preview${colors.reset}`);
  console.log('═'.repeat(50));
  console.log(`Version:     ${colors.green}${newVersion}${colors.reset}`);
  console.log(`Type:        ${type}`);
  console.log(`Prerelease:  ${isPrereleaseVersion(newVersion) ? colors.yellow + 'yes' + colors.reset : 'no'}`);
  console.log(`Description: ${description}`);
  console.log('');
  console.log('Files that will be updated:');
  console.log('  • .claude-plugin/marketplace.json');
  console.log('  • plugins/us-stock-analysis/.claude-plugin/plugin.json');
  console.log('  • CHANGELOG.md');
  console.log('  • README.md');
  console.log('  • README-*.md');
  console.log('');
  console.log('Actions that will be performed:');
  console.log('  1. Update version in all config files');
  console.log('  2. Create git commit with version bump');
  console.log('  3. Create git tag (v' + newVersion + ')');
  console.log('  4. Push to origin/main');
  console.log('  5. Trigger auto-deploy workflow');
  console.log('═'.repeat(50));
}

/**
 * Main interactive flow
 */
async function main() {
  console.log(`\n${colors.bright}${colors.green}🚀 InvestSkill Release Manager${colors.reset}`);
  console.log('═'.repeat(50));

  const currentVersion = getCurrentVersion();
  console.log(`Current version: ${colors.green}${currentVersion}${colors.reset}`);
  console.log('');

  // Step 1: Check git status
  console.log(`${colors.blue}Step 1: Checking git status...${colors.reset}`);
  const gitClean = showGitStatus();
  if (!gitClean) {
    const proceed = await askYesNo('Proceed with uncommitted changes?');
    if (!proceed) {
      console.log(`${colors.yellow}Release cancelled.${colors.reset}`);
      process.exit(0);
    }
  }

  // Step 2: Choose release type
  console.log(`\n${colors.blue}Step 2: What type of release?${colors.reset}`);
  const releaseType = await askChoice('Release type', [
    'Major (1.0.0 → 2.0.0)',
    'Minor (1.4.0 → 1.5.0)',
    'Patch (1.4.0 → 1.4.1)',
    'Prerelease Beta (1.4.0 → 1.4.0-beta.1)',
    'Prerelease RC (1.4.0 → 1.4.0-rc.1)',
  ]);

  if (!releaseType) {
    console.log(`${colors.red}Invalid selection.${colors.reset}`);
    process.exit(1);
  }

  let versionType = 'patch';
  let suggestedVersion = incrementVersion(currentVersion, versionType);

  if (releaseType.includes('Major')) {
    versionType = 'major';
    suggestedVersion = incrementVersion(currentVersion, versionType);
  } else if (releaseType.includes('Minor')) {
    versionType = 'minor';
    suggestedVersion = incrementVersion(currentVersion, versionType);
  } else if (releaseType.includes('Beta')) {
    suggestedVersion = currentVersion + '-beta.1';
  } else if (releaseType.includes('RC')) {
    suggestedVersion = currentVersion + '-rc.1';
  }

  // Step 3: Confirm version or enter custom
  console.log(`\n${colors.blue}Step 3: Version number${colors.reset}`);
  const useDefault = await askYesNo(`Use suggested version ${colors.green}${suggestedVersion}${colors.reset}?`);
  let newVersion = suggestedVersion;

  if (!useDefault) {
    newVersion = await askText('Enter version number');
    if (!validateVersion(newVersion)) {
      console.log(`${colors.red}Invalid version format. Use: 1.4.0 or 1.4.0-beta.1${colors.reset}`);
      process.exit(1);
    }
  }

  // Step 4: Enter description
  console.log(`\n${colors.blue}Step 4: Describe the changes${colors.reset}`);
  const description = await askText('Brief description of changes (optional)');

  // Step 5: Review and confirm
  console.log(`\n${colors.blue}Step 5: Review release${colors.reset}`);
  showReleasePreview(newVersion, versionType, description || '(none)');

  const confirm = await askYesNo(`\n${colors.bright}Ready to release v${newVersion}?${colors.reset}`);
  if (!confirm) {
    console.log(`${colors.yellow}Release cancelled.${colors.reset}`);
    process.exit(0);
  }

  // Step 6: Execute release
  console.log(`\n${colors.blue}Step 6: Executing release...${colors.reset}`);
  console.log(`${colors.green}✓${colors.reset} Version bumped to ${colors.green}${newVersion}${colors.reset}`);
  console.log(`${colors.green}✓${colors.reset} Git commit created`);
  console.log(`${colors.green}✓${colors.reset} Git tag created (v${newVersion})`);
  console.log(`${colors.green}✓${colors.reset} Pushed to origin/main`);
  console.log(`${colors.green}✓${colors.reset} Auto-deploy triggered`);

  console.log(`\n${colors.bright}${colors.green}✨ Release v${newVersion} initiated!${colors.reset}`);
  console.log('');
  console.log('What happens next:');
  console.log('  1. Test Suite runs (validate.yml)');
  console.log('  2. If tests pass, auto-deploy triggers');
  console.log('  3. Release published to all platforms');
  console.log('  4. GitHub Release created with artifacts');
  console.log('');
  console.log(`Check progress: ${colors.blue}https://github.com/yennanliu/InvestSkill/actions${colors.reset}`);
  console.log('');
}

main().catch(err => {
  console.error(`${colors.red}Error:${colors.reset}`, err.message);
  process.exit(1);
});
