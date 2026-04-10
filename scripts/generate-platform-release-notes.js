#!/usr/bin/env node
/**
 * generate-platform-release-notes.js
 * Generates platform-specific release notes with availability table
 * Called by auto-deploy.yml during GitHub Release creation
 *
 * Usage:
 *   RELEASE_VERSION=1.4.0 node scripts/generate-platform-release-notes.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RELEASE_VERSION = process.env.RELEASE_VERSION || 'Unknown';

/**
 * Platform availability data structure
 * Maps platform names to installation methods and status
 */
const PLATFORMS = {
  'Claude Code': {
    status: '✅ Available',
    install: '/plugin install us-stock-analysis',
    docs: 'README-claude-code.md',
    marketplace: 'Claude Code Plugin Marketplace',
  },
  'Cursor IDE': {
    status: '✅ Available',
    install: 'Auto-loads from `.cursor/rules/invest-skill.mdc`',
    docs: 'README-cursor.md',
    registry: 'Cursor Rules Registry',
  },
  'Gemini CLI': {
    status: '✅ Available',
    install: 'Auto-loads from `GEMINI.md` (project directory)',
    docs: 'README-gemini.md',
    registry: 'Prompt library in repository',
  },
  'GitHub Copilot': {
    status: '✅ Available',
    install: 'Auto-loads from `.github/copilot-instructions.md`',
    docs: 'README.md',
    registry: 'VS Code / JetBrains',
  },
  'Universal (ChatGPT, Claude.ai, etc)': {
    status: '✅ Available',
    install: 'Copy prompts from `prompts/` directory',
    docs: 'README.md',
    registry: 'File-based (`prompts/*.md`)',
  },
};

/**
 * Extract release notes from CHANGELOG.md
 */
function extractReleaseNotes() {
  try {
    const changelogPath = path.join(ROOT, 'CHANGELOG.md');
    const content = fs.readFileSync(changelogPath, 'utf8');

    // Find the section for this version
    const versionRegex = new RegExp(`## \\[${RELEASE_VERSION}\\]([\\s\\S]*?)(?=## \\[|$)`);
    const match = content.match(versionRegex);

    if (match && match[1]) {
      return match[1].trim();
    }

    return null;
  } catch (err) {
    console.error('Error reading CHANGELOG.md:', err.message);
    return null;
  }
}

/**
 * Generate platform availability table
 */
function generatePlatformTable() {
  let table = '## Platform Availability\n\n';
  table += '| Platform | Status | Installation | Documentation |\n';
  table += '|----------|--------|---------------|----------------|\n';

  Object.entries(PLATFORMS).forEach(([platform, info]) => {
    const installCmd = info.install.includes('`') ? info.install : `\`${info.install}\``;
    const docLink = `[${info.docs}](${info.docs})`;
    table += `| ${platform} | ${info.status} | ${installCmd} | ${docLink} |\n`;
  });

  table += '\n';
  return table;
}

/**
 * Generate download badges and checksums section
 */
function generateDownloadSection() {
  let section = '## Download & Verify\n\n';
  section += 'All releases include checksums for verification:\n\n';
  section += '```bash\n';
  section += '# Download artifacts\n';
  section += `tar xzf invest-skill-marketplace-${RELEASE_VERSION}.tar.gz\n\n`;
  section += '# Verify checksums\n';
  section += 'sha256sum -c checksums.txt\n';
  section += '```\n\n';
  section += '**Artifacts:**\n';
  section += `- \`invest-skill-marketplace-${RELEASE_VERSION}.tar.gz\` — Full marketplace (all platforms)\n`;
  section += `- \`us-stock-analysis-${RELEASE_VERSION}.tar.gz\` — Claude Code plugin only\n`;
  section += '- \`checksums.txt\` — SHA-256 verification file\n\n';
  return section;
}

/**
 * Generate feature highlights from release notes
 */
function generateHighlights(notes) {
  if (!notes) return '';

  let highlights = '## What\'s New\n\n';

  // Extract Added section
  const addedMatch = notes.match(/### Added\n([\s\S]*?)(?=###|$)/);
  if (addedMatch && addedMatch[1]) {
    highlights += '**✨ New Features:**\n';
    highlights += addedMatch[1].trim() + '\n\n';
  }

  // Extract Fixed section
  const fixedMatch = notes.match(/### Fixed\n([\s\S]*?)(?=###|$)/);
  if (fixedMatch && fixedMatch[1]) {
    highlights += '**🐛 Fixes:**\n';
    highlights += fixedMatch[1].trim() + '\n\n';
  }

  // Extract Changed section
  const changedMatch = notes.match(/### Changed\n([\s\S]*?)(?=###|$)/);
  if (changedMatch && changedMatch[1]) {
    highlights += '**🔧 Improvements:**\n';
    highlights += changedMatch[1].trim() + '\n\n';
  }

  return highlights;
}

/**
 * Generate quick start section
 */
function generateQuickStart() {
  let section = '## Quick Start\n\n';
  section += '### Claude Code\n```bash\n';
  section += '/plugin install us-stock-analysis\n';
  section += '/us-stock-analysis:stock-eval AAPL\n';
  section += '```\n\n';

  section += '### Cursor\n';
  section += 'Rules auto-load in Cursor AI Chat (Cmd+K):\n';
  section += '```\n';
  section += '@prompts/stock-eval.md Evaluate Apple (AAPL)\n';
  section += '```\n\n';

  section += '### Gemini CLI\n';
  section += 'In project directory:\n';
  section += '```bash\n';
  section += 'gemini\n';
  section += '> @prompts/stock-eval.md Evaluate Apple (AAPL)\n';
  section += '```\n\n';

  return section;
}

/**
 * Main function
 */
function main() {
  console.log('📋 Generating platform release notes...\n');

  const releaseNotes = extractReleaseNotes();

  if (!releaseNotes) {
    console.warn(`⚠️  No release notes found for v${RELEASE_VERSION} in CHANGELOG.md`);
    console.log('   Proceeding with minimal body.\n');
  }

  // Build the full release body
  let body = `## InvestSkill v${RELEASE_VERSION}\n\n`;
  body += '**18 Professional Investment Analysis Frameworks**\n\n';

  // Add highlights if we have them
  if (releaseNotes) {
    body += generateHighlights(releaseNotes);
  }

  // Add quick start
  body += generateQuickStart();

  // Add platform table
  body += generatePlatformTable();

  // Add download section
  body += generateDownloadSection();

  // Add full changelog
  if (releaseNotes) {
    body += '## Full Changelog\n\n';
    body += releaseNotes;
  }

  // Add resources footer
  body += '\n---\n\n';
  body += '## Documentation & Resources\n\n';
  body += '- 📖 [Complete README](README.md) — All platforms setup guide\n';
  body += '- 📊 [Platform Compatibility](PLATFORM-COMPATIBILITY.md) — Feature comparison\n';
  body += '- 📚 [Cookbook](COOKBOOK.md) — Examples and walkthroughs\n';
  body += '- 🔧 [CI/CD Guide](CI-CD-GUIDE.md) — Automated release pipeline\n';
  body += '- 💡 [16 Investment Frameworks](prompts/) — Universal prompt files\n\n';

  body += '## Support\n\n';
  body += '- 🐛 [Report Issues](https://github.com/yennanliu/InvestSkill/issues)\n';
  body += '- 💬 [Discussions](https://github.com/yennanliu/InvestSkill/discussions)\n';
  body += '- 📧 Feedback: [GitHub Issues](https://github.com/yennanliu/InvestSkill/issues/new)\n\n';

  body += '---\n\n';
  body += '**Legal:** This toolkit provides educational analysis only and does NOT constitute financial advice. Always consult qualified financial advisors and do your own research.\n';

  // Write to file for use in GitHub Release
  const outputPath = path.join(ROOT, 'RELEASE_NOTES.md');
  fs.writeFileSync(outputPath, body, 'utf8');

  console.log(`✅ Platform release notes generated: ${outputPath}`);
  console.log(`\n📝 Preview:\n`);
  console.log(body.substring(0, 500) + '\n...\n');
  console.log(`\n✨ Total length: ${body.length} characters`);
}

main();
