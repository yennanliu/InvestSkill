#!/usr/bin/env node
'use strict';
/**
 * Docs link-checker. Verifies every relative href/src/poster in the built _site/
 * points to a file that exists, and that every #fragment — on another page
 * (page.html#x) or the same page (#x) — matches an id on the target page.
 * Absolute URLs (http, /root-relative), mailto:, and data: URIs are skipped.
 * The on-page "#" (back to top) and the JS-built TOC are not fragments to check.
 *
 * Run after building: node site/build/build-site.js && node scripts/check-links.js
 */
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..', '_site');

if (!fs.existsSync(SITE)) {
  console.error('✗ _site/ not found — run `node site/build/build-site.js` first.');
  process.exit(1);
}

const htmlFiles = fs.readdirSync(SITE).filter(f => f.endsWith('.html'));
const attrRe = /(?:href|src|poster)="([^"]+)"/g;
const broken = [];
let checked = 0, fragments = 0;

// ids per page, built lazily (anchors are percent-encoded in hrefs; ids are not)
const idCache = new Map();
function idsOf(file) {
  if (!idCache.has(file)) {
    const html = fs.readFileSync(path.join(SITE, file), 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])));
  }
  return idCache.get(file);
}
const decode = s => { try { return decodeURIComponent(s); } catch { return s; } };

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(SITE, file), 'utf8');
  for (const m of html.matchAll(attrRe)) {
    const raw = m[1];
    // Skip absolute URLs, root-relative paths, anchors, mailto, data URIs
    if (/^(https?:)?\/\//.test(raw) || raw.startsWith('/') ||
        raw.startsWith('mailto:') || raw.startsWith('data:') || raw === '#') {
      continue;
    }
    const [pathPart, frag] = raw.split('#');
    const target = pathPart.split('?')[0];
    if (target) {
      checked++;
      if (!fs.existsSync(path.join(SITE, target))) { broken.push(`${file}  →  ${raw}`); continue; }
    }
    if (frag && (!target || target.endsWith('.html'))) {
      fragments++;
      if (!idsOf(target || file).has(decode(frag))) broken.push(`${file}  →  ${raw}  (no id="${decode(frag)}")`);
    }
  }
}

if (broken.length) {
  console.error(`✗ ${broken.length} broken internal link(s) found (of ${checked} checked):\n`);
  broken.forEach(b => console.error(`  ${b}`));
  process.exit(1);
}

console.log(`✓ Link check passed — ${checked} internal links and ${fragments} anchors across ${htmlFiles.length} pages, 0 broken.`);
