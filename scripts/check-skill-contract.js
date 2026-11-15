#!/usr/bin/env node
/**
 * check-skill-contract.js — lint every skill for the InvestSkill output contract.
 *
 * Run: node scripts/check-skill-contract.js [--quiet] [--json]
 *
 * For each skill directory, both forms (SKILL.md and prompts/<name>.md) must:
 *   1. define the Data Verification gate      (## … Data Verification)
 *   2. define the Data & Sources header       (As of · Source · Retrieval · Confidence)
 *   3. define a Thesis Invalidation section
 *   4. carry the standard Investment Signal block
 *   5. carry the "Not financial advice" disclaimer
 *   6. define the machine-readable JSON footer that follows the box
 *      ({"investskill": "1", "skill": …, "signal": …, "score": …, …})
 *   7. define Traditional Chinese output (`--lang zh-TW`) that keeps the
 *      Data & Sources labels, the box and the JSON footer in English
 *   8. keep the signal block's code fence to the box alone — no heading inside
 *      it (a fence opened too early once swallowed Thesis Invalidation in 19 skills)
 *
 * Exemptions live in scripts/lib/skill-registry.js (CONTRACT_EXEMPT): output
 * tools render other skills' results, aliases are redirect stubs, and meta
 * skills audit another analysis instead of market data.
 *
 * Exit code 1 on any failure — wired into `npm test`.
 */
const fs = require('fs');
const path = require('path');
const reg = require('./lib/skill-registry');
const sb = require('./lib/signal-block');

const args = process.argv.slice(2);
const QUIET = args.includes('--quiet');
const JSON_OUT = args.includes('--json');

const CHECKS = [
  { key: 'dataVerification',   label: 'Data Verification gate',   test: sb.hasDataVerification },
  { key: 'dataSources',        label: 'Data & Sources header',    test: sb.hasDataSourcesTemplate },
  { key: 'thesisInvalidation', label: 'Thesis Invalidation',      test: sb.hasThesisInvalidation },
  { key: 'signalBlock',        label: 'Investment Signal block',  test: sb.hasSignalBlockTemplate },
  { key: 'disclaimer',         label: 'disclaimer',               test: sb.hasDisclaimer },
  { key: 'langZhTw',           label: '--lang zh-TW output section', test: sb.hasLangZhTw },
  { key: 'jsonFooter',         label: 'JSON footer template',     test: sb.hasJsonFooterTemplate },
  { key: 'signalFence',        label: 'signal fence holding only the box (no heading inside it)', test: sb.signalFenceIsClean },
];

const results = [];
let failed = 0, passed = 0, exempt = 0;

for (const skill of reg.listSkillDirs()) {
  const forms = [
    { form: 'SKILL.md', file: path.join(reg.SKILLS_DIR, skill, 'SKILL.md') },
    { form: 'prompt',   file: path.join(reg.PROMPTS_DIR, `${skill}.md`) },
  ];
  for (const { form, file } of forms) {
    if (!fs.existsSync(file)) {
      if (form === 'prompt' && reg.RENDER_ONLY.includes(skill)) continue;
      results.push({ skill, form, check: 'file', ok: false, msg: 'missing' });
      failed++;
      continue;
    }
    const text = fs.readFileSync(file, 'utf8');
    for (const c of CHECKS) {
      if (reg.CONTRACT_EXEMPT[c.key].includes(skill)) { exempt++; continue; }
      const ok = c.test(text);
      results.push({ skill, form, check: c.key, ok, msg: c.label });
      ok ? passed++ : failed++;
    }
  }
}

if (JSON_OUT) {
  process.stdout.write(JSON.stringify({ passed, failed, exempt, results }, null, 2) + '\n');
} else {
  process.stdout.write(`\n━━━ Skill Contract Check ${'─'.repeat(34)}\n`);
  const bySkill = new Map();
  for (const r of results) {
    if (!bySkill.has(r.skill)) bySkill.set(r.skill, []);
    bySkill.get(r.skill).push(r);
  }
  for (const [skill, rs] of bySkill) {
    const bad = rs.filter(r => !r.ok);
    if (bad.length === 0) {
      if (!QUIET) process.stdout.write(`  ✅ ${skill} — contract complete (${rs.length} checks)\n`);
    } else {
      for (const r of bad) process.stdout.write(`  ❌ ${skill} (${r.form}) — missing ${r.msg}\n`);
    }
  }
  const kinds = `${reg.OUTPUT_TOOLS.length} output tools · ${reg.ALIAS_SKILLS.length} aliases · ${reg.META_SKILLS.length} meta`;
  process.stdout.write(`\n  ${passed} checks passed, ${failed} failed, ${exempt} exempt (${kinds})\n`);
  process.stdout.write(`  Frameworks advertised: ${reg.frameworkCount()} of ${reg.listSkillDirs().length} skills\n\n`);
}
process.exitCode = failed ? 1 : 0;   // not process.exit(): a piped --json report larger than 64 KB would be cut off
