#!/usr/bin/env node
'use strict';
/**
 * Docs link-checker. Verifies every relative href/src in the built _site/
 * points to a file that exists. Absolute URLs (http, /root-relative),
 * anchors, mailto:, and data: URIs are skipped.
 *
 * Run after building: node docs/build-site.js && node scripts/check-links.js
 */
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..', '_site');

if (!fs.existsSync(SITE)) {
  console.error('✗ _site/ not found — run `node docs/build-site.js` first.');
  process.exit(1);
}

const htmlFiles = fs.readdirSync(SITE).filter(f => f.endsWith('.html'));
const attrRe = /(?:href|src)="([^"]+)"/g;
const broken = [];
let checked = 0;

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(SITE, file), 'utf8');
  for (const m of html.matchAll(attrRe)) {
    const raw = m[1];
    // Skip absolute URLs, root-relative paths, anchors, mailto, data URIs
    if (/^(https?:)?\/\//.test(raw) || raw.startsWith('/') ||
        raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('data:')) {
      continue;
    }
    const target = raw.split('#')[0].split('?')[0];
    if (!target) continue;
    checked++;
    if (!fs.existsSync(path.join(SITE, target))) {
      broken.push(`${file}  →  ${raw}`);
    }
  }
}

if (broken.length) {
  console.error(`✗ ${broken.length} broken internal link(s) found (of ${checked} checked):\n`);
  broken.forEach(b => console.error(`  ${b}`));
  process.exit(1);
}

console.log(`✓ Link check passed — ${checked} internal links across ${htmlFiles.length} pages, 0 broken.`);
