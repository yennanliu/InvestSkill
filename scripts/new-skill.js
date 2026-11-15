#!/usr/bin/env node
/**
 * new-skill.js — scaffold a new InvestSkill skill and wire it into every
 * place the 12-step process in ADDING-NEW-SKILLS.md touches.
 *
 * Usage:
 *   node scripts/new-skill.js <kebab-name> --category <core|reports|monitoring|advanced|meta> \
 *        --title "Human Title" --desc "One-line description" \
 *        [--zh-title "中文名"] [--desc-zh "一句話中文摘要"] [--goal "I want to …"] [--goal-zh "我想要…"] \
 *        [--example "Usage example"] [--no-test]
 *
 * What it does:
 *   1. plugins/us-stock-analysis/skills/<name>/SKILL.md   — from a template that already
 *      contains the full contract (Data Verification · Data & Sources · Thesis Invalidation ·
 *      Investment Signal block · disclaimer), so check-skill-contract.js passes from minute one
 *   2. prompts/<name>.md                                    — generated via sync-prompts.js
 *   3. site/build/build-site.js  SKILL_CATEGORIES           — added to the chosen category
 *   4. site/content/CHOOSE-A-SKILL(.md|-zh-TW.md)           — a "goal → skill" row (both languages)
 *   5. README.md / README-zh-TW.md                          — framework-table row / category cell
 *   6. GEMINI.md · .cursor/rules/invest-skill.mdc · .github/copilot-instructions.md
 *                                                           — table row + directory-tree line
 *   7. CHANGELOG.md                                         — a line under [Unreleased] › Added
 *   8. site/content/SKILL-SUMMARIES-zh-TW.json              — Chinese title (--zh-title) + a TODO summary for skills-zh-tw.html
 *   8. runs check-skill-contract.js + test-skills.js unless --no-test
 *
 * It does NOT write the analysis itself — open SKILL.md and replace every
 * `TODO` — and it does not bump versions or touch COOKBOOK counts (those are
 * derived / release-time). Framework counts across the docs are enforced by
 * `npm test`; the script prints what is left to do.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const reg = require('./lib/skill-registry');

const ROOT = reg.ROOT;
const argv = process.argv.slice(2);
const name = argv.find(a => !a.startsWith('--'));
const flag = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const has = k => argv.includes(`--${k}`);

const CATEGORIES = {
  core:       { site: 'Core Stock Analysis', readme: 'Core Stock Analysis', zh: '核心分析',     crossai: 'Core Stock Analysis' },
  reports:    { site: 'Financial Reports',   readme: 'Financial Reports',   zh: '財務報告',     crossai: 'Financial Report Analysis' },
  monitoring: { site: 'Market Monitoring',   readme: 'Market Monitoring',   zh: '市場監控',     crossai: 'Market Monitoring' },
  advanced:   { site: 'Advanced Research',   readme: 'Advanced Research',   zh: '進階分析',     crossai: 'Advanced Analysis' },
  meta:       { site: 'Meta & Output',       readme: 'Meta & Output',       zh: '元技能與輸出', crossai: 'Meta-Analysis & Visualization' },
};

const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\&-]/g, '\\$&');

function die(msg) { process.stderr.write(`\n  ✗ ${msg}\n\n`); process.exit(1); }

if (!name || has('help')) {
  process.stdout.write(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^\/\*\*|^ \* ?/gm, '') + '\n');
  process.exit(name ? 0 : 1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) die(`"${name}" is not kebab-case`);
const category = flag('category');
if (!CATEGORIES[category]) die(`--category must be one of ${Object.keys(CATEGORIES).join('|')}`);
const cat = CATEGORIES[category];
const title = flag('title', name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '));
const desc = flag('desc', `TODO — one-line description of ${title}`);
const zhTitle = flag('zh-title', title);
const goal = flag('goal', `TODO — the goal ${title} serves`);
const goalZh = flag('goal-zh', `TODO — ${zhTitle} 對應的目標`);
const example = flag('example', `Run ${title} for AAPL`);

const skillDir = path.join(reg.SKILLS_DIR, name);
if (fs.existsSync(skillDir)) die(`skill "${name}" already exists`);

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(ROOT, f), s);
const done = [];
const todo = [];

// ── 1. SKILL.md from the contract template ─────────────────────────────────
const template = `---
description: ${desc}
---

# ${title}

## ⚠️ Data Verification — Do This Before Any Analysis

Before running any analysis, always retrieve the latest market data for the ticker:

1. **Fetch current price** — use web search or ask the user for the live price, 52-week range, and market cap. Never assume a price from training data.
2. **Confirm key figures** — TODO: the specific figures this skill needs (which filing or data series, which period), each with its date.
3. **State your data source** — fill in the \`Data & Sources\` header (next section) so the origin, as-of date, retrieval path, and confidence of every figure are explicit at the top of the output.
4. **Flag stale data explicitly** — if live data is unavailable, display this warning before proceeding:

> ⚠️ **Live data unavailable.** The following analysis uses training-data estimates which may be significantly out of date. Verify all prices and metrics before making any decisions.

Never silently substitute training-data estimates for current prices. When in doubt, ask the user to paste the latest quote.

---

## 📋 Data & Sources Header — Open Every Output With It

The first thing in the output is this provenance block, filled in — never left as placeholders. It is the standard documented on the [Data & Accuracy](https://yennanliu.github.io/InvestSkill/data-and-accuracy.html) page and the first thing \`result-validator\` looks for:

\`\`\`
Data & Sources
  As of:      <date the figures represent, e.g. 2026-06-30>
  Source:     <primary docs — SEC EDGAR 10-K/10-Q, company IR, FRED, exchange data …>
  Retrieval:  <pasted by user | web/tool retrieval | model memory>
  Confidence: <HIGH | MEDIUM | LOW>
\`\`\`

- \`Retrieval: model memory\` must be paired with \`Confidence: LOW\` — memory is a placeholder until confirmed against a primary source.
- Mixed sources: list each with its own as-of date rather than blending them.
- Sources disagree on the same figure (a closing price, a deal term): prefer the primary source (SEC filing, company release, exchange data) over an aggregator, then the most recent dated one. Show both values with their sources and dates, say which you used and why, and never average them.
- Data the user pasted is reported as \`pasted by user\`; do not upgrade its confidence beyond what the user's own source supports.

---

## 🌐 Output Language — \`--lang zh-TW\`

English is the default. With \`--lang zh-TW\` — or when the user writes in Traditional Chinese and asks for a Chinese answer — write the whole analysis in Traditional Chinese (繁體中文, Taiwan usage), keeping it machine-checkable:

- **Translate** every heading, narrative paragraph, table header and bullet. Give each metric's English name in brackets the first time it appears — 自由現金流（Free Cash Flow, FCF） — so the reader can match it to the glossary and to English analyses.
- **Keep in English** tickers, figures and units, SEC form and item names (10-K Item 7, Form 4), the four \`Data & Sources\` field labels (\`As of\`, \`Source\`, \`Retrieval\`, \`Confidence\` — the Retrieval value may be written in Chinese, e.g. 使用者提供), and the Investment Signal box and JSON footer exactly as specified — field names and the BULLISH / NEUTRAL / BEARISH, HIGH / MEDIUM / LOW, BUY / HOLD / SELL, STRONG / MODERATE / WEAK values. Tools parse them.
- Title the invalidation section **論點失效條件（Thesis Invalidation）**, and close with the disclaimer in Chinese: **免責聲明：** 僅供教育用途，非投資建議。
- Use Taiwan financial terms: 殖利率、本益比、營業利益率、自由現金流、聯準會、選擇權、買權／賣權、除息日、預扣稅.

---

## Overview

TODO — two or three paragraphs: the question this skill answers, why none of the existing frameworks answers it, and which skills it pairs with (\`stock-eval\`, \`bear-case\`, …).

---

## 1. Inputs

| Input | Required | Default if unstated |
|-------|----------|---------------------|
| Ticker | ✅ | — |
| TODO | | |

---

## 2. Framework

### Phase 1 — TODO

TODO — what to compute, the thresholds that make a reading good or bad, and how it feeds the score.

### Phase 2 — TODO

TODO

### Phase 3 — Scoring

**${title} Score (0–10)** — the headline number:

| Component | Weight | 10 looks like | 0 looks like |
|-----------|--------|---------------|--------------|
| TODO | 40% | | |
| TODO | 30% | | |
| TODO | 30% | | |

---

## 3. Output Format

1. **Data & Sources** header (above)
2. **Executive Summary** — three sentences: what, so what, now what
3. TODO — the tables and sections in order
4. **Thesis Invalidation** — what would reverse the call (below)
5. **Investment Signal Block** — the standard box (below)

---

## Example

\`\`\`
User: ${example}

The assistant TODO — describe the output the user gets.
\`\`\`

---

## Notes

- TODO — limits, edge cases, and the skills to run before and after this one.

## Thesis Invalidation

After delivering the analysis signal, specify what would reverse it:

**If signal is BULLISH — thesis breaks if:**
- TODO — a price / fundamental / macro trigger specific to this framework
- TODO
- TODO

**If signal is BEARISH — thesis breaks if:**
- TODO
- TODO
- TODO

**Re-run this analysis when:**
- [ ] Next earnings release
- [ ] Price moves ±15% from current level
- [ ] 60 days have elapsed
- [ ] Material news event (acquisition, leadership change, regulatory decision)

## Standard Signal Output

All analysis concludes with this standardized block:

In the output, the box below is followed immediately by this machine-readable footer — the same values as the box, filled in (no placeholders, no comments), so tools can read the result without parsing the box:

\`\`\`json
{"investskill": "1", "skill": "${name}", "ticker": "<TICKER, or null for a portfolio / market-wide view>", "as_of": "<YYYY-MM-DD from Data & Sources>", "signal": "<BULLISH | NEUTRAL | BEARISH>", "confidence": "<HIGH | MEDIUM | LOW>", "horizon": "<SHORT-TERM | MEDIUM-TERM | LONG-TERM>", "score": 0.0, "action": "<BUY | HOLD | SELL>", "conviction": "<STRONG | MODERATE | WEAK>", "retrieval": "<pasted by user | web/tool retrieval | model memory>", "sources": ["<each primary source, dated>"]}
\`\`\`

\`\`\`
╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BULLISH / NEUTRAL / BEARISH     ║
║ Confidence:  HIGH / MEDIUM / LOW             ║
║ Horizon:     SHORT / MEDIUM / LONG-TERM      ║
║ Score:       X.X / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      BUY / HOLD / SELL               ║
║ Conviction:  STRONG / MODERATE / WEAK        ║
╚══════════════════════════════════════════════╝
\`\`\`

Score Guide: 8.0–10.0 Strongly Bullish | 6.0–7.9 Moderately Bullish | 4.0–5.9 Neutral | 2.0–3.9 Moderately Bearish | 0.0–1.9 Strongly Bearish
Confidence: HIGH (strong data, clear signals) | MEDIUM (mixed signals) | LOW (limited data, conflicting signals)
Horizon: SHORT-TERM (1 week–3 months) | MEDIUM-TERM (3 months–1 year) | LONG-TERM (1+ years)

**Disclaimer:** Educational analysis only. Not financial advice.
`;
fs.mkdirSync(skillDir, { recursive: true });
fs.writeFileSync(path.join(skillDir, 'SKILL.md'), template);
done.push(`plugins/us-stock-analysis/skills/${name}/SKILL.md (template — replace every TODO)`);

// ── 2. prompt ─────────────────────────────────────────────────────────────────
execFileSync(process.execPath, [path.join(__dirname, 'sync-prompts.js'), name], { stdio: 'ignore' });
done.push(`prompts/${name}.md (generated)`);

// ── helpers ───────────────────────────────────────────────────────────────────
function appendTableRow(text, headingRe, row, label) {
  const lines = text.split('\n');
  const h = lines.findIndex(l => headingRe.test(l));
  if (h < 0) { todo.push(`${label}: heading ${headingRe} not found — add the row by hand: ${row}`); return text; }
  let i = h + 1;
  while (i < lines.length && !lines[i].startsWith('|')) { if (/^#{1,3}\s/.test(lines[i])) break; i++; }
  if (!lines[i] || !lines[i].startsWith('|')) { todo.push(`${label}: no table under ${headingRe}`); return text; }
  while (i + 1 < lines.length && lines[i + 1].startsWith('|')) i++;
  lines.splice(i + 1, 0, row);
  return lines.join('\n');
}
function bumpHeadingCount(text, headingRe) {
  return text.replace(headingRe, m => m.replace(/\((\d+)/, (_, n) => `(${parseInt(n, 10) + 1}`));
}
function insertTreeLine(text, label) {
  const line = `│   ├── ${name}.md`;
  if (!text.includes('└── report-generator.md')) { todo.push(`${label}: directory tree not found`); return text; }
  return text.replace(/^(\s*│?\s*)└── report-generator\.md/m, `$1├── ${name}.md\n$1└── report-generator.md`)
    .replace(line, line); // no-op; keeps intent explicit
}
function edit(file, fn) {
  const before = read(file);
  const after = fn(before);
  if (after !== before) { write(file, after); done.push(file); }
  else todo.push(`${file}: nothing changed — wire "${name}" in by hand`);
}

// ── 3. site categories ────────────────────────────────────────────────────────
edit('site/build/build-site.js', t => {
  const re = new RegExp(`(\\{ title: '${escapeRegExp(cat.site)}',\\s*skills: \\[)([^\\]]*)(\\])`);
  return t.replace(re, (_, a, b, c) => `${a}${b.trimEnd()}${b.trim() ? ',' : ''}'${name}'${c}`);
});

// ── 4. Choose-a-Skill (both languages) ───────────────────────────────────────
edit('site/content/CHOOSE-A-SKILL.md', t =>
  appendTableRow(t, /^## Start From Your Goal/, `| ${goal} | \`${name}\` | — |`, 'CHOOSE-A-SKILL.md'));
edit('site/content/CHOOSE-A-SKILL-zh-TW.md', t =>
  appendTableRow(t, /^## 從你的目標出發/, `| ${goalZh} | \`${name}\` | — |`, 'CHOOSE-A-SKILL-zh-TW.md'));

// ── 5. READMEs ────────────────────────────────────────────────────────────────
edit('README.md', t =>
  appendTableRow(t, new RegExp(`^### ${escapeRegExp(cat.readme)}\\s*$`), `| \`${name}\` | ${desc} |`, 'README.md'));
edit('README-zh-TW.md', t => {
  // "(5)" or, for the meta row, "(5 + 1 輸出工具)" — only the leading count is bumped.
  const re = new RegExp(`^(\\| \\*\\*${escapeRegExp(cat.zh)}\\*\\* \\()(\\d+)([^)]*\\) \\| )([^|]*?)(\\s*\\|)`, 'm');
  if (!re.test(t)) { todo.push(`README-zh-TW.md: category row "${cat.zh}" not found`); return t; }
  return t.replace(re, (_, a, n, b, cell, tail) => `${a}${parseInt(n, 10) + 1}${b}${cell.trimEnd()} · **${name}**${tail}`);
});

// ── 6. cross-AI configs ───────────────────────────────────────────────────────
const crossHeading = new RegExp(`^### ${escapeRegExp(cat.crossai)} \\(\\d+ (?:skills|frameworks)[^)]*\\)`, 'm');
edit('GEMINI.md', t => insertTreeLine(bumpHeadingCount(
  appendTableRow(t, crossHeading, `| ${title} | \`@prompts/${name}.md\` | \`${example}\` |`, 'GEMINI.md'), crossHeading), 'GEMINI.md'));
edit('.cursor/rules/invest-skill.mdc', t => insertTreeLine(bumpHeadingCount(
  appendTableRow(t, crossHeading, `| ${title} | \`@prompts/${name}.md\` | ${desc} |`, 'invest-skill.mdc'), crossHeading), 'invest-skill.mdc'));
edit('.github/copilot-instructions.md', t => insertTreeLine(bumpHeadingCount(
  appendTableRow(t, crossHeading, `| ${title} | \`prompts/${name}.md\` | ${desc} |`, 'copilot-instructions.md'), crossHeading), 'copilot-instructions.md'));

// ── 7. CHANGELOG ──────────────────────────────────────────────────────────────
edit('CHANGELOG.md', t => {
  const entry = `- **\`${name}\`** — ${desc}. New analysis framework.\n`;
  const m = t.match(/## \[Unreleased\]\s*\n(?:\s*\n)?### Added\s*\n/);
  if (m) { const at = m.index + m[0].length; return t.slice(0, at) + entry + t.slice(at); }
  // Right after a release [Unreleased] is empty — open its ### Added block.
  const u = t.match(/## \[Unreleased\][^\n]*\n\s*/);
  if (!u) { todo.push('CHANGELOG.md: no "## [Unreleased]" section'); return t; }
  const at = u.index + u[0].length;
  return t.slice(0, at) + `### Added\n${entry}\n` + t.slice(at);
});

// ── 8. zh Skill Reference entry ───────────────────────────────────────────────
edit('site/content/SKILL-SUMMARIES-zh-TW.json', t => {
  const j = JSON.parse(t);
  j.skills[name] = { title: zhTitle, summary: flag('desc-zh', `TODO — ${zhTitle}的一句話中文摘要`) };
  j.skills = Object.fromEntries(Object.entries(j.skills).sort(([a], [b]) => a.localeCompare(b)));
  return `${JSON.stringify(j, null, 2)}\n`;
});

// ── 9. tests ──────────────────────────────────────────────────────────────────
process.stdout.write(`\n━━━ new-skill: ${name} ${'─'.repeat(Math.max(0, 44 - name.length))}\n`);
done.forEach(d => process.stdout.write(`  ✅ ${d}\n`));
todo.forEach(d => process.stdout.write(`  ⚠️  ${d}\n`));
process.stdout.write(`\n  Frameworks now advertised: ${reg.frameworkCount()} (${reg.listSkillDirs().length} skills)\n`);
process.stdout.write(`\n  Next:\n`);
process.stdout.write(`   1. Write the analysis — replace every TODO in skills/${name}/SKILL.md\n`);
process.stdout.write(`   2. node scripts/sync-prompts.js ${name}        # regenerate the universal prompt\n`);
process.stdout.write(`   3. Update the skill counts in site/content/COOKBOOK(.md|-zh-TW.md) ("N available skills")\n`);
process.stdout.write(`   4. npm run prompt:budgets -- --add-missing    # record the new prompts' size budget (tests/prompt-budgets.json)\n`);
process.stdout.write(`   5. npm test && npm run build:site             # counts, contract, category placement\n\n`);

if (!has('no-test')) {
  try {
    execFileSync(process.execPath, [path.join(__dirname, 'check-skill-contract.js'), '--quiet'], { stdio: 'inherit' });
  } catch (e) { process.exit(1); }
}
