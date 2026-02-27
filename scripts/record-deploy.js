#!/usr/bin/env node
/**
 * record-deploy.js
 * Appends a deployment entry to DEPLOYMENTS.md.
 * Called by auto-deploy.yml after a successful GitHub Release.
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'DEPLOYMENTS.md');

// ── Read env vars (set by the workflow) ──────────────────────────────────────
const version   = process.env.DEPLOY_VERSION    || 'unknown';
const sha       = process.env.DEPLOY_SHA        || 'unknown';
const rawTs     = process.env.DEPLOY_TIMESTAMP  || new Date().toISOString();
const releaseUrl= process.env.RELEASE_URL       || '';
const runUrl    = process.env.WORKFLOW_RUN_URL  || '';
const skills    = parseInt(process.env.SKILL_COUNT || '18', 10);

// Normalise timestamp to YYYY-MM-DD HH:MM UTC
function fmtDate(iso) {
  try {
    const d = new Date(iso);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())} ` +
           `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
  } catch { return iso; }
}

const timestamp = fmtDate(rawTs);

// ── Build the new entry ──────────────────────────────────────────────────────
const releaseLink = releaseUrl
  ? `[GitHub Release](${releaseUrl})`
  : 'GitHub Release (URL unavailable)';

const runLink = runUrl
  ? `[Actions run](${runUrl})`
  : '';

const entry = `
## v${version} — ${timestamp}

| Field         | Value |
|---------------|-------|
| Version       | \`${version}\` |
| Commit        | \`${sha}\` |
| Deployed at   | ${timestamp} |
| Skills        | ${skills} |
| Release       | ${releaseLink} |
| CI run        | ${runLink} |

### Marketplace targets

| Target | Status | Install |
|--------|--------|---------|
| **Claude Code** | ✅ Deployed | \`/plugin marketplace add yennanliu/InvestSkill\` |
| **Cursor** | ✅ Updated | Copy \`.cursor/rules/invest-skill.mdc\` to your project |
| **Gemini CLI** | ✅ Updated | Reference \`GEMINI.md\` / \`prompts/\` directory |
| **GitHub Copilot** | ✅ Updated | Auto-applied via \`.github/copilot-instructions.md\` |

---
`;

// ── Write to DEPLOYMENTS.md ──────────────────────────────────────────────────
let existing = '';
if (fs.existsSync(FILE)) {
  existing = fs.readFileSync(FILE, 'utf8');
} else {
  // Create header on first run
  existing = `# Deployment History

This file is auto-updated by the [auto-deploy workflow](.github/workflows/auto-deploy.yml)
each time a new version passes all tests and is published to the marketplaces.

---
`;
}

// Insert new entry after the header block (before the first "## v" entry)
const insertPoint = existing.indexOf('\n## v');
if (insertPoint === -1) {
  // No prior entries — append after the header separator
  fs.writeFileSync(FILE, existing + entry, 'utf8');
} else {
  // Prepend new entry before existing entries so newest is at the top
  const before = existing.slice(0, insertPoint);
  const after  = existing.slice(insertPoint);
  fs.writeFileSync(FILE, before + entry + after, 'utf8');
}

console.log(`✅ Deployment record written: v${version} @ ${timestamp}`);
