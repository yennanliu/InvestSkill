#!/usr/bin/env node
/**
 * test-site.js — unit tests for the site's language switcher (part of `npm test`).
 *
 *   1. site/build/lang-pairs.js in-process: langOf, the pair table, and
 *      switchTargets — a page with a twin links to it, a page without one goes
 *      to its parent index in the other language, never the home page unless it
 *      has no parent
 *   2. the rendered switcher on every page of a real build: two options, the
 *      current language links to the page itself and carries aria-current, the
 *      other target exists in the build and equals switchTargets
 *
 *   3. the recorded demo on both landing pages: video + poster exist, chapters ascend
 *
 * By default section 2 builds the site into a temp dir (SITE_OUT_DIR, ~0.3 s).
 * `--site <dir>` checks an existing build instead — CI's site job passes the
 * `_site/` it is about to link-check.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const reg = require('./lib/skill-registry');
const lp = require('../site/build/lang-pairs');

const ROOT = reg.ROOT;
let passed = 0, failed = 0;
const failures = [];
const check = (cond, msg, detail) => {
  if (cond) { passed++; process.stdout.write(`  ✅ ${msg}\n`); }
  else { failed++; failures.push(msg); process.stdout.write(`  ❌ ${msg}${detail !== undefined ? ` — got ${JSON.stringify(detail)}` : ''}\n`); }
};
const section = t => process.stdout.write(`\n━━━ ${t} ${'─'.repeat(Math.max(0, 55 - t.length))}\n`);

// ════════════════════════════════════════════════════════════════════════════
section('1. site/build/lang-pairs.js');
{
  const { langOf, switchTargets: t, LANG_PAIRS, LANG_PARENTS, EN_TO_ZH, ZH_TO_EN } = lp;

  // langOf
  check(langOf('index.html') === 'en' && langOf('faq.html') === 'en', 'langOf: plain filenames are English');
  check(langOf('zh-tw.html') === 'zh' && langOf('faq-zh-tw.html') === 'zh', 'langOf: zh-tw.html and *-zh-tw.html are Chinese');
  check(langOf('full-demo-rklb.html') === 'zh' && langOf('full-demo-amd.html') === 'zh', 'langOf: the zh-content demos are Chinese despite no suffix');
  check(langOf('skill-stock-eval.html') === 'en', 'langOf: skill pages are English');

  // The pair table
  const ens = LANG_PAIRS.map(([en]) => en), zhs = LANG_PAIRS.map(([, zh]) => zh);
  check(new Set(ens).size === ens.length && new Set(zhs).size === zhs.length, 'LANG_PAIRS is one-to-one (no page paired twice)');
  const crossed = LANG_PAIRS.filter(([en, zh]) => langOf(en) !== 'en' || langOf(zh) !== 'zh');
  check(crossed.length === 0, 'every pair is English ⇄ Chinese per langOf', crossed);
  check(Object.keys(EN_TO_ZH).length === LANG_PAIRS.length && Object.keys(ZH_TO_EN).length === LANG_PAIRS.length, 'EN_TO_ZH / ZH_TO_EN cover every pair');

  // switchTargets on paired pages
  const roundTrip = LANG_PAIRS.filter(([en, zh]) => {
    const a = t(en), b = t(zh);
    return a.en !== en || a.zh !== zh || b.en !== en || b.zh !== zh;
  });
  check(roundTrip.length === 0, `every pair (${LANG_PAIRS.length}) switches to its twin both ways and to itself in its own language`, roundTrip);
  check(t('index.html').zh === 'zh-tw.html' && t('zh-tw.html').en === 'index.html', 'home ⇄ home');
  check(t('full-demo-amd.html').en === 'full-demo-nvda.html', 'a zh-content demo maps to its English pair');

  // switchTargets on unpaired pages — the fix
  const skillPages = reg.listPromptNames().map(n => `skill-${n}.html`);
  const strays = skillPages.filter(f => t(f).zh !== 'skills-zh-tw.html' || t(f).en !== f);
  check(skillPages.length > 0 && strays.length === 0, `every skill-<name>.html (${skillPages.length}) switches to the zh Skill Reference, not the zh home`, strays);
  check(t('full-demo-meta.html').zh === 'full-demo-zh-tw.html', 'an English-only demo switches to the zh demo overview');
  check(t('skill-.html').zh === 'zh-tw.html', 'the parent patterns need a name (skill-.html is not a skill page)');
  check(t('changelog.html').zh === 'zh-tw.html' && t('contributing.html').zh === 'zh-tw.html', 'a page with neither twin nor parent lands on the zh home');
  check(t('unknown-zh-tw.html').en === 'index.html', 'an unpaired zh page lands on the English home');
  const orphanParents = LANG_PARENTS.map(([, parent]) => parent).filter(p => !EN_TO_ZH[p]);
  check(orphanParents.length === 0, 'every fallback parent has a zh twin', orphanParents);
  const shadowed = LANG_PAIRS.filter(([en]) => LANG_PARENTS.some(([re]) => re.test(en)) && t(en).zh !== EN_TO_ZH[en]);
  check(shadowed.length === 0, 'a real twin wins over the parent fallback (full-demo-pltr → full-demo-rklb)', shadowed);
}

// ════════════════════════════════════════════════════════════════════════════
section('2. Rendered switcher on every built page');
{
  const i = process.argv.indexOf('--site');
  if (i > -1 && (!process.argv[i + 1] || process.argv[i + 1].startsWith('--'))) {
    process.stderr.write('usage: node scripts/test-site.js [--site <built-site-dir>]\n');
    process.exit(2);
  }
  let site = i > -1 ? path.resolve(process.argv[i + 1]) : null;
  let tmp = null;
  if (!site) {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'investskill-site-'));
    site = tmp;
    const res = spawnSync(process.execPath, [path.join(ROOT, 'site', 'build', 'build-site.js')],
      { cwd: ROOT, encoding: 'utf8', env: { ...process.env, SITE_OUT_DIR: tmp } });
    check(res.status === 0, 'the site builds into a temp dir', res.stderr.slice(0, 300));
  }
  try {
    const pages = fs.existsSync(site) ? fs.readdirSync(site).filter(f => f.endsWith('.html')) : [];
    check(pages.length > 0, `built pages found in ${tmp ? 'the temp build' : path.relative(ROOT, site) || site}`, pages.length);
    const bad = [];
    let withSwitcher = 0;
    for (const f of pages) {
      const html = fs.readFileSync(path.join(site, f), 'utf8');
      const opts = [...html.matchAll(/<a href="([^"]*)" class="lang-opt( active)?"([^>]*)>/g)]
        .map(m => ({ href: m[1], active: !!m[2], current: /aria-current="true"/.test(m[3]), hreflang: (m[3].match(/hreflang="([^"]*)"/) || [])[1] }));
      if (f === '404.html') continue;  // the only page built without a switcher
      if (!opts.length) { bad.push(`${f}: no language switcher`); continue; }
      withSwitcher++;
      const want = lp.switchTargets(f), lang = lp.langOf(f);
      const [en, zh] = opts;
      const problems = [];
      if (opts.length !== 2) problems.push(`${opts.length} options`);
      else {
        if (en.hreflang !== 'en' || zh.hreflang !== 'zh-Hant') problems.push('hreflang');
        if (en.href !== want.en || zh.href !== want.zh) problems.push(`targets ${en.href} / ${zh.href}`);
        const cur = lang === 'en' ? en : zh, other = lang === 'en' ? zh : en;
        if (cur.href !== f || !cur.active || !cur.current) problems.push('current language not marked');
        if (other.active || other.current) problems.push('other language marked current');
        if (!fs.existsSync(path.join(site, other.href))) problems.push(`target ${other.href} not built`);
      }
      if (problems.length) bad.push(`${f}: ${problems.join(', ')}`);
    }
    check(withSwitcher > 0, `${withSwitcher} pages carry the switcher`);
    check(bad.length === 0, 'every switcher: two options, targets = switchTargets, current language aria-current, other target exists', bad.slice(0, 10));
    const toHome = pages.filter(f => f.startsWith('skill-')).filter(f => {
      const html = fs.readFileSync(path.join(site, f), 'utf8');
      return html.includes('<a href="zh-tw.html" class="lang-opt"');
    });
    check(toHome.length === 0, 'no skill page sends 文A to the zh home', toHome);

    // The recorded run on both landing pages: files exist, chapters are in order.
    for (const home of ['index.html', 'zh-tw.html']) {
      const html = fs.existsSync(path.join(site, home)) ? fs.readFileSync(path.join(site, home), 'utf8') : '';
      const src = (html.match(/<source src="([^"]+\.mp4)"/) || [])[1];
      const poster = (html.match(/<video[^>]*poster="([^"]+)"/) || [])[1];
      check(!!src && !!poster && fs.existsSync(path.join(site, src)) && fs.existsSync(path.join(site, poster)),
        `${home}: the demo video and its poster are in the build`, { src, poster });
      const ts = [...html.matchAll(/class="watch-chapter" data-t="(\d+)"/g)].map(m => Number(m[1]));
      check(ts.length >= 2 && ts[0] === 0 && ts.every((t, i) => i === 0 || t > ts[i - 1]),
        `${home}: demo chapters start at 0 and ascend`, ts);
    }
  } finally {
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  }
}

process.stdout.write('\n' + '═'.repeat(60) + '\n  SITE TEST RESULTS\n' + '═'.repeat(60) + '\n');
process.stdout.write(`  ✅ Passed:   ${passed}\n  ❌ Failed:   ${failed}\n` + '═'.repeat(60) + '\n');
if (failed) process.stdout.write('\n  Failures:\n' + failures.map(f => `    • ${f}`).join('\n') + '\n\n');
process.exit(failed ? 1 : 0);
