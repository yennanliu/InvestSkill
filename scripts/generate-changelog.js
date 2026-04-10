#!/usr/bin/env node
/**
 * generate-changelog.js
 * Generates changelog entries from git history
 * Classifies commits as Added/Fixed/Changed/etc based on commit message prefix
 *
 * Usage:
 *   node scripts/generate-changelog.js                    # Since last tag
 *   node scripts/generate-changelog.js v1.3.0             # Since specific version
 *   node scripts/generate-changelog.js v1.3.0 HEAD        # Custom range
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

/**
 * Get the last tag (version)
 */
function getLastTag() {
  try {
    const tags = execSync('git tag -l "v*" --sort=-version:refname', { cwd: ROOT }).toString().trim().split('\n');
    return tags[0];
  } catch {
    return null;
  }
}

/**
 * Classify commit based on message prefix
 */
function classifyCommit(message) {
  const msg = message.toLowerCase();

  if (msg.startsWith('feat:') || msg.startsWith('feature:')) {
    return 'Added';
  } else if (msg.startsWith('fix:') || msg.startsWith('bugfix:')) {
    return 'Fixed';
  } else if (msg.startsWith('refactor:') || msg.startsWith('perf:')) {
    return 'Changed';
  } else if (msg.startsWith('docs:') || msg.startsWith('doc:')) {
    return 'Documentation';
  } else if (msg.startsWith('style:') || msg.startsWith('format:')) {
    return 'Style';
  } else if (msg.startsWith('test:') || msg.startsWith('tests:')) {
    return 'Tests';
  } else if (msg.startsWith('chore:')) {
    return 'Chores';
  } else if (msg.startsWith('ci:')) {
    return 'CI/CD';
  } else if (msg.includes('skill') || msg.includes('framework')) {
    return 'Skills';
  } else {
    return 'Other';
  }
}

/**
 * Get git log between two commits
 */
function getGitLog(fromRef, toRef = 'HEAD') {
  try {
    const range = fromRef ? `${fromRef}..${toRef}` : toRef;
    const log = execSync(`git log ${range} --pretty=format:"%h %s"`, { cwd: ROOT }).toString().trim();
    return log.split('\n').filter(line => line.length > 0);
  } catch (err) {
    console.error('Error getting git log:', err.message);
    return [];
  }
}

/**
 * Parse commit hash and message
 */
function parseCommit(line) {
  const match = line.match(/^([a-f0-9]{7})\s+(.+)$/);
  if (!match) return null;
  return {
    hash: match[1],
    message: match[2]
  };
}

/**
 * Generate changelog section from commits
 */
function generateChangelog(commits) {
  const categories = {
    'Added': [],
    'Fixed': [],
    'Changed': [],
    'Documentation': [],
    'Skills': [],
    'CI/CD': [],
    'Tests': [],
    'Style': [],
    'Chores': [],
    'Other': []
  };

  commits.forEach(line => {
    const commit = parseCommit(line);
    if (!commit) return;

    const category = classifyCommit(commit.message);
    const cleanMessage = commit.message
      .replace(/^(feat|feature|fix|bugfix|refactor|perf|docs|doc|style|format|test|tests|chore|ci):\s*/i, '')
      .replace(/\[skip ci\]/i, '')
      .trim();

    if (cleanMessage) {
      categories[category].push({
        message: cleanMessage,
        hash: commit.hash
      });
    }
  });

  let output = '';

  Object.entries(categories).forEach(([category, items]) => {
    if (items.length === 0) return;

    output += `### ${category}\n\n`;
    items.forEach(item => {
      output += `- ${item.message} ([${item.hash}](https://github.com/yennanliu/InvestSkill/commit/${item.hash}))\n`;
    });
    output += '\n';
  });

  return output;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  let fromRef = args[0];
  let toRef = args[1] || 'HEAD';

  // If no fromRef, use last tag
  if (!fromRef) {
    fromRef = getLastTag();
    if (!fromRef) {
      console.log('No git tags found. Using entire history.');
      fromRef = null;
    }
  }

  console.log('📝 Generating changelog...\n');

  if (fromRef) {
    console.log(`Range: ${fromRef}..${toRef}`);
  } else {
    console.log(`Range: All commits to ${toRef}`);
  }
  console.log('');

  const commits = getGitLog(fromRef, toRef);

  if (commits.length === 0) {
    console.log('No commits found in range.');
    process.exit(0);
  }

  console.log(`Found ${commits.length} commit(s)\n`);

  const changelog = generateChangelog(commits);

  console.log('═'.repeat(60));
  console.log('');
  console.log(changelog);
  console.log('═'.repeat(60));

  // Also save to a file
  const outputPath = path.join(ROOT, 'CHANGELOG.generated.md');
  const versionMatch = fromRef?.match(/v([\d.]+)/);
  const version = versionMatch ? versionMatch[1] : 'X.Y.Z';
  const today = new Date().toISOString().split('T')[0];

  const fullChangelog = `## [${version}] - ${today}\n\n${changelog}`;

  fs.writeFileSync(outputPath, fullChangelog, 'utf8');
  console.log(`\n✅ Generated changelog saved to: ${outputPath}`);
  console.log('\nTip: Copy the content above to CHANGELOG.md under appropriate version');
}

main();
