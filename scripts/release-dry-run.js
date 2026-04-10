#!/usr/bin/env node
/**
 * release-dry-run.js
 * Performs a dry-run of the release process without publishing
 * Shows what would happen without making any changes
 *
 * Usage:
 *   node scripts/release-dry-run.js               # Check current version
 *   node scripts/release-dry-run.js v1.4.1        # Check specific version
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

// Color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Get current version
 */
function getCurrentVersion() {
  const marketplacePath = path.join(ROOT, '.claude-plugin/marketplace.json');
  const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
  return marketplace.metadata.version;
}

/**
 * Get all config versions
 */
function getAllVersions() {
  const marketplace = JSON.parse(fs.readFileSync(path.join(ROOT, '.claude-plugin/marketplace.json'), 'utf8'));
  const plugin = JSON.parse(fs.readFileSync(path.join(ROOT, 'plugins/us-stock-analysis/.claude-plugin/plugin.json'), 'utf8'));

  return {
    marketplace: marketplace.metadata.version,
    plugin: plugin.version,
  };
}

/**
 * Check if version is prerelease
 */
function isPrereleaseVersion(version) {
  return /-(alpha|beta|rc)/.test(version);
}

/**
 * Count skills
 */
function countSkills() {
  const pluginPath = path.join(ROOT, 'plugins/us-stock-analysis/.claude-plugin/plugin.json');
  const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
  return plugin.skills.length;
}

/**
 * Count prompts
 */
function countPrompts() {
  const promptsPath = path.join(ROOT, 'prompts');
  return fs.readdirSync(promptsPath).filter(f => f.endsWith('.md')).length;
}

/**
 * Get release notes from CHANGELOG
 */
function getReleaseNotes(version) {
  try {
    const changelogPath = path.join(ROOT, 'CHANGELOG.md');
    const content = fs.readFileSync(changelogPath, 'utf8');
    
    const versionRegex = new RegExp(`## \\[${version}\\]([\\s\\S]*?)(?=## \\[|$)`);
    const match = content.match(versionRegex);
    
    if (match && match[1]) {
      return match[1].trim();
    }
  } catch (err) {
    return null;
  }
  return null;
}

/**
 * Check git tags
 */
function getExistingTags() {
  try {
    const tags = execSync('git tag -l "v*" --sort=-version:refname', { cwd: ROOT }).toString().trim().split('\n').filter(t => t);
    return tags.slice(0, 5);  // Last 5 tags
  } catch {
    return [];
  }
}

/**
 * Calculate what artifacts would be created
 */
function getArtifactInfo(version) {
  return [
    {
      name: `invest-skill-marketplace-${version}.tar.gz`,
      description: 'Full marketplace (all platforms)',
      size: '~2MB (estimated)',
    },
    {
      name: `us-stock-analysis-${version}.tar.gz`,
      description: 'Claude Code plugin only',
      size: '~1MB (estimated)',
    },
    {
      name: 'checksums.txt',
      description: 'SHA-256 verification file',
      size: '~200B',
    },
  ];
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const targetVersion = args[0] || getCurrentVersion();

  console.log(`\n${colors.bright}${colors.cyan}📋 Release Dry-Run Report${colors.reset}`);
  console.log('═'.repeat(70));

  // Section 1: Current Status
  console.log(`\n${colors.blue}Current Status${colors.reset}`);
  console.log(`  Version:  ${colors.green}${getCurrentVersion()}${colors.reset}`);
  console.log(`  Skills:   ${countSkills()}`);
  console.log(`  Prompts:  ${countPrompts()}`);

  // Section 2: Version Verification
  console.log(`\n${colors.blue}Version Consistency Check${colors.reset}`);
  const versions = getAllVersions();
  const versionMatch = versions.marketplace === versions.plugin;
  
  console.log(`  Marketplace: ${versions.marketplace} ${versionMatch ? colors.green + '✓' + colors.reset : colors.yellow + '⚠' + colors.reset}`);
  console.log(`  Plugin:      ${versions.plugin} ${versionMatch ? colors.green + '✓' + colors.reset : colors.yellow + '⚠' + colors.reset}`);
  
  if (!versionMatch) {
    console.log(`  ${colors.yellow}⚠ Version mismatch detected!${colors.reset}`);
  }

  // Section 3: Target Release Info
  console.log(`\n${colors.blue}Release Preview (v${targetVersion})${colors.reset}`);
  
  const isPrerelease = isPrereleaseVersion(targetVersion);
  console.log(`  Target Version:  ${colors.green}${targetVersion}${colors.reset}`);
  console.log(`  Release Type:    ${isPrerelease ? colors.yellow + 'PRERELEASE' + colors.reset : 'STABLE'}`);
  console.log(`  GitHub Action:   ${colors.cyan}auto-deploy.yml${colors.reset}`);

  // Section 4: Changelog
  const releaseNotes = getReleaseNotes(targetVersion);
  if (releaseNotes) {
    console.log(`\n${colors.blue}Release Notes (from CHANGELOG.md)${colors.reset}`);
    const lines = releaseNotes.split('\n').slice(0, 10);
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`  ${line}`);
      }
    });
    if (releaseNotes.split('\n').length > 10) {
      console.log(`  ...(${releaseNotes.split('\n').length - 10} more lines)`);
    }
  } else {
    console.log(`\n${colors.yellow}⚠ No release notes found for v${targetVersion}${colors.reset}`);
  }

  // Section 5: Artifacts
  console.log(`\n${colors.blue}Artifacts That Would Be Created${colors.reset}`);
  const artifacts = getArtifactInfo(targetVersion);
  artifacts.forEach(artifact => {
    console.log(`  • ${artifact.name}`);
    console.log(`    ${artifact.description} (${artifact.size})`);
  });

  // Section 6: Deployment Targets
  console.log(`\n${colors.blue}Deployment Targets${colors.reset}`);
  console.log(`  ✅ Claude Code Plugin (GitHub Release)`);
  console.log(`  ✅ Cursor IDE Rules (Cursor Registry)`);
  console.log(`  ✅ Gemini CLI (Repository + Package)`);
  console.log(`  ✅ GitHub Copilot (.github/copilot-instructions.md)`);
  console.log(`  ✅ Universal (File-based: prompts/)`);

  // Section 7: Process
  console.log(`\n${colors.blue}Release Process${colors.reset}`);
  console.log(`  1. Test Suite validates all files`);
  console.log(`  2. Version bump detected (v${targetVersion})`);
  console.log(`  3. Pre-deploy validation runs`);
  console.log(`  4. Release packages created (.tar.gz + checksums)`);
  console.log(`  5. GitHub Release published`);
  console.log(`  6. Tag created (v${targetVersion})`);
  console.log(`  7. Cursor rules published`);
  console.log(`  8. Gemini package published`);
  console.log(`  9. Release notes generated`);
  console.log(`  10. Deployment recorded in DEPLOYMENTS.md`);

  // Section 8: Timeline
  console.log(`\n${colors.blue}Recent Releases${colors.reset}`);
  const tags = getExistingTags();
  if (tags.length > 0) {
    tags.forEach(tag => {
      console.log(`  ${tag}`);
    });
  } else {
    console.log(`  (No previous releases)`);
  }

  // Section 9: Next Steps
  console.log(`\n${colors.blue}Next Steps${colors.reset}`);
  console.log(`  To proceed with v${targetVersion}:`);
  console.log(`  `);
  console.log(`    ${colors.cyan}npm run release${colors.reset}           # Interactive release`);
  console.log(`    OR`);
  console.log(`    ${colors.cyan}git tag -a v${targetVersion}${colors.reset}      # Manual tag`);
  console.log(`    ${colors.cyan}git push origin v${targetVersion}${colors.reset}`);

  // Summary
  console.log(`\n${colors.bright}Summary${colors.reset}`);
  console.log(`═`.repeat(70));
  
  if (versionMatch) {
    console.log(`${colors.green}✓${colors.reset} Version consistency: OK`);
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} Version mismatch detected — please fix before release`);
  }
  
  if (releaseNotes) {
    console.log(`${colors.green}✓${colors.reset} Changelog entry: Found`);
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} Changelog entry: Missing — add v${targetVersion} section to CHANGELOG.md`);
  }
  
  console.log(`${colors.green}✓${colors.reset} ${colors.countSkills} skills registered`);
  console.log(`${colors.green}✓${colors.reset} ${countPrompts()} universal prompts available`);

  console.log(`\n${colors.bright}This was a dry-run. No changes were made.${colors.reset}\n`);
}

main();
