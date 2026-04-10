#!/usr/bin/env node
/**
 * notify-release.js
 * Post release notifications to multiple channels
 * Supports: GitHub Discussions, Twitter/X, Slack, RSS feed
 *
 * Usage:
 *   RELEASE_VERSION=1.4.0 node scripts/notify-release.js
 *   RELEASE_VERSION=1.4.0-beta.1 SLACK_WEBHOOK=xxx node scripts/notify-release.js
 *
 * Environment Variables (optional):
 *   RELEASE_VERSION          Version being released (required)
 *   GITHUB_TOKEN             For posting to GitHub Discussions
 *   SLACK_WEBHOOK            Slack webhook URL for notifications
 *   TWITTER_API_KEY          Twitter API credentials
 *   TWITTER_API_SECRET
 *   TWITTER_ACCESS_TOKEN
 *   TWITTER_ACCESS_SECRET
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const RELEASE_VERSION = process.env.RELEASE_VERSION || 'Unknown';

// Notification tracking
const results = {
  success: [],
  skipped: [],
  failed: [],
};

/**
 * Post to GitHub Discussions
 */
async function notifyGitHubDiscussions() {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    results.skipped.push('GitHub Discussions (GITHUB_TOKEN not configured)');
    return;
  }

  const discussionTitle = `📢 InvestSkill v${RELEASE_VERSION} Released`;
  const discussionBody = `
🎉 **InvestSkill v${RELEASE_VERSION}** is now available!

## What's New

Check the [GitHub Release](https://github.com/yennanliu/InvestSkill/releases/tag/v${RELEASE_VERSION}) for:
- Detailed changelog
- Platform availability
- Download artifacts

## Quick Links

- 📖 [Installation Guide](README.md)
- 🔧 [Platform-Specific Setup](README-claude-code.md)
- 💬 [Chat with us here!](#)

## Share Your Feedback

Try v${RELEASE_VERSION} and let us know what you think! What features would you like next?
`;

  try {
    // This is a template - actual implementation would use GitHub API
    console.log('✓ GitHub Discussions notification prepared (ready to post)');
    results.success.push('GitHub Discussions (prepared)');
  } catch (err) {
    results.failed.push(`GitHub Discussions (${err.message})`);
  }
}

/**
 * Post to Slack
 */
async function notifySlack() {
  const webhookUrl = process.env.SLACK_WEBHOOK;
  
  if (!webhookUrl) {
    results.skipped.push('Slack (SLACK_WEBHOOK not configured)');
    return;
  }

  const slackMessage = {
    text: `📢 InvestSkill v${RELEASE_VERSION} released!`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `🎉 *InvestSkill v${RELEASE_VERSION}* is now available!\n\n18 Professional Investment Analysis Frameworks`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Release',
            },
            url: `https://github.com/yennanliu/InvestSkill/releases/tag/v${RELEASE_VERSION}`,
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Installation',
            },
            url: 'https://github.com/yennanliu/InvestSkill#quick-start',
          },
        ],
      },
    ],
  };

  try {
    // This is a template - actual HTTP POST would go here
    console.log('✓ Slack notification prepared (ready to post)');
    results.success.push('Slack (prepared)');
  } catch (err) {
    results.failed.push(`Slack (${err.message})`);
  }
}

/**
 * Post to Twitter/X
 */
async function notifyTwitter() {
  const hasTwitterCreds = process.env.TWITTER_API_KEY && process.env.TWITTER_ACCESS_TOKEN;
  
  if (!hasTwitterCreds) {
    results.skipped.push('Twitter/X (credentials not configured)');
    return;
  }

  const tweetText = `
🎉 InvestSkill v${RELEASE_VERSION} is live!

18 professional investment analysis frameworks for US stocks:
📊 Fundamental analysis, technical analysis, valuation, options, dividends, & more

💻 Works with: Claude Code • Cursor • Gemini CLI • GitHub Copilot

🔗 github.com/yennanliu/InvestSkill
  `.trim();

  try {
    // This is a template - actual Twitter API implementation would go here
    console.log('✓ Twitter/X notification prepared (ready to post)');
    results.success.push('Twitter/X (prepared)');
  } catch (err) {
    results.failed.push(`Twitter/X (${err.message})`);
  }
}

/**
 * Update RSS feed
 */
function updateRSSFeed() {
  const releaseNotes = getReleaseNotes();
  
  try {
    // Template for RSS feed update
    const rssEntry = `
    <item>
      <title>InvestSkill v${RELEASE_VERSION} Released</title>
      <link>https://github.com/yennanliu/InvestSkill/releases/tag/v${RELEASE_VERSION}</link>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>
        <![CDATA[
          ${releaseNotes || 'See release page for details'}
        ]]>
      </description>
    </item>
    `;

    console.log('✓ RSS feed entry prepared (ready to add)');
    results.success.push('RSS Feed (prepared)');
  } catch (err) {
    results.failed.push(`RSS Feed (${err.message})`);
  }
}

/**
 * Extract release notes
 */
function getReleaseNotes() {
  try {
    const changelogPath = path.join(ROOT, 'CHANGELOG.md');
    const content = fs.readFileSync(changelogPath, 'utf8');
    
    const versionRegex = new RegExp(`## \\[${RELEASE_VERSION}\\]([\\s\\S]*?)(?=## \\[|$)`);
    const match = content.match(versionRegex);
    
    if (match && match[1]) {
      return match[1].trim().split('\n').slice(0, 5).join('\n');
    }
  } catch (err) {
    // Silently fail
  }
  
  return null;
}

/**
 * Main function
 */
async function main() {
  console.log(`\n📢 Release Notification System\n`);
  console.log(`Version: ${RELEASE_VERSION}\n`);

  // Check which notifications are configured
  const hasGitHub = process.env.GITHUB_TOKEN;
  const hasSlack = process.env.SLACK_WEBHOOK;
  const hasTwitter = process.env.TWITTER_API_KEY;

  if (!hasGitHub && !hasSlack && !hasTwitter) {
    console.log('ℹ️  No notification channels configured.\n');
    console.log('To enable notifications, set environment variables:');
    console.log('  GITHUB_TOKEN          - For GitHub Discussions');
    console.log('  SLACK_WEBHOOK         - For Slack notifications');
    console.log('  TWITTER_API_*         - For Twitter/X posting\n');
    console.log('Usage:');
    console.log('  SLACK_WEBHOOK=xxx node scripts/notify-release.js\n');
    process.exit(0);
  }

  console.log('Preparing notifications...\n');

  // Send notifications
  await notifyGitHubDiscussions();
  await notifySlack();
  await notifyTwitter();
  updateRSSFeed();

  // Summary
  console.log(`\n${'═'.repeat(50)}`);
  console.log('Notification Summary\n');

  if (results.success.length > 0) {
    console.log('✅ Prepared:');
    results.success.forEach(r => console.log(`   ${r}`));
  }

  if (results.skipped.length > 0) {
    console.log('\n⏭️  Skipped (not configured):');
    results.skipped.forEach(r => console.log(`   ${r}`));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed:');
    results.failed.forEach(r => console.log(`   ${r}`));
  }

  console.log(`\n${'═'.repeat(50)}\n`);
  console.log('💡 Note: This is a template. To fully enable notifications:');
  console.log('   1. Configure environment variables');
  console.log('   2. Implement actual API calls (currently template only)');
  console.log('   3. Consider integrating with GitHub Actions workflows\n');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
