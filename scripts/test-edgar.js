#!/usr/bin/env node
/**
 * test-edgar.js — offline unit tests for the bring-your-own-data helpers:
 *   scripts/lib/edgar.js, scripts/fetch-edgar.js, scripts/fetch-fundamentals.js
 *
 * No network: every SEC endpoint is served by scripts/lib/edgar-mock-fetch.js.
 * The library is tested in-process; the two CLIs are run for real as
 * subprocesses with the double preloaded (`node -r`), so the actual
 * argument parsing → lookup → download → write path executes and the
 * files on disk are inspected.
 *
 * Run: node scripts/test-edgar.js        (part of `npm test`)
 * KEEP_EDGAR_TEST_DIR=1 keeps the temp directory for inspection.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

// Speed: no pacing, no retry backoff — the double answers instantly.
process.env.EDGAR_REQUEST_INTERVAL_MS = '0';
process.env.EDGAR_RETRY_BACKOFF_MS = '0';

const ROOT = path.resolve(__dirname, '..');
const MOCK = path.join(__dirname, 'lib', 'edgar-mock-fetch.js');
const FETCH_EDGAR = path.join(__dirname, 'fetch-edgar.js');
const FETCH_FUND = path.join(__dirname, 'fetch-fundamentals.js');
const PKG = require(path.join(ROOT, 'package.json'));

let passed = 0, failed = 0;
const failures = [];
/** Record a passing check. */
const pass = m => { process.stdout.write(`  ✅ ${m}\n`); passed++; };
/** Record a failing check. */
const fail = m => { process.stdout.write(`  ❌ ${m}\n`); failed++; failures.push(m); };
/** Print a section heading. */
const section = t => process.stdout.write(`\n━━━ ${t} ${'─'.repeat(Math.max(0, 55 - t.length))}\n`);
/** Assert `cond`, appending the offending value on failure. */
const check = (cond, msg, detail) => (cond ? pass(msg) : fail(`${msg}${detail !== undefined ? ` — got ${JSON.stringify(detail)}` : ''}`));
/** Assert strict equality. */
const eq = (a, b, msg) => check(a === b, msg, a);
/** Assert a string contains `needle`. */
const includes = (s, needle, msg) => check(typeof s === 'string' && s.includes(needle), msg, typeof s === 'string' ? s.slice(0, 200) : s);
/** Assert a string does not contain `needle`. */
const excludes = (s, needle, msg) => check(typeof s === 'string' && !s.includes(needle), msg, needle);

const WORK = fs.mkdtempSync(path.join(os.tmpdir(), 'investskill-edgar-test-'));
const OUT = path.join(WORK, 'filings');
const FIX = path.join(WORK, 'fixtures');
const LOG = path.join(WORK, 'requests.jsonl');
const UA = 'Test Runner test@example.com';

/** Run a CLI with the fetch double preloaded. */
function run(script, args, extraEnv = {}) {
  fs.writeFileSync(LOG, '');
  const r = spawnSync(process.execPath, ['-r', MOCK, script, ...args], {
    encoding: 'utf8',
    env: {
      ...process.env, EDGAR_MOCK: '1', EDGAR_MOCK_LOG: LOG, EDGAR_USER_AGENT: UA,
      // A pinned clock: the "latest year is stale" warning depends on today's date.
      EDGAR_REQUEST_INTERVAL_MS: '0', EDGAR_RETRY_BACKOFF_MS: '0', EDGAR_TODAY: '2026-11-13', ...extraEnv,
    },
    timeout: 60_000,
  });
  const requests = fs.readFileSync(LOG, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  return { status: r.status, stdout: r.stdout || '', stderr: r.stderr || '', requests };
}
/** fetch-edgar.js args pointed at the temp output directory. */
const edgarArgs = extra => ['--out', OUT, ...extra];
/** fetch-fundamentals.js args pointed at the temp fixtures directory. */
const fundArgs = extra => ['--out', FIX, ...extra];

/** Same front-block parser as scripts/eval-skills.js loadFixture, so a generated pack is proven compatible. */
function parseFixture(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const meta = {}; const expect = [];
  for (const line of m[1].split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || t === 'expect:') continue;
    const item = t.match(/^-\s*\{(.*)\}\s*$/);
    if (item) {
      const obj = {};
      for (const kv of item[1].split(/,(?=\s*\w+:)/)) {
        const [k, ...rest] = kv.split(':'); let v = rest.join(':').trim();
        if (/^".*"$/.test(v)) v = v.slice(1, -1).replace(/\\\\/g, '\\');
        else if (/^-?\d+(\.\d+)?$/.test(v)) v = parseFloat(v);
        obj[k.trim()] = v;
      }
      expect.push(obj); continue;
    }
    const kv = t.match(/^([\w-]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = /^-?\d+(\.\d+)?$/.test(kv[2]) ? parseFloat(kv[2]) : kv[2].replace(/\s+#.*$/, '');
  }
  return { meta, expect, body: m[2].trim() };
}

/** Run every section and exit 1 on any failure. */
async function main() {
  process.stdout.write('\n🔬 InvestSkill — EDGAR helper tests (offline, fetch double)\n');

  // ═══════════════════════════════════════════════════════════════════════════
  section('1. Library — scripts/lib/edgar.js (in-process)');
  const mock = require(MOCK);
  mock.install();
  const edgar = require(path.join(__dirname, 'lib', 'edgar.js'));

  check(global.fetch.__edgarMock === true, 'fetch double installed before the library loaded');
  includes(edgar.USER_AGENT, `InvestSkill/${PKG.version}`, 'default User-Agent carries the package version');
  includes(edgar.USER_AGENT, 'EDGAR_USER_AGENT', 'default User-Agent tells the user how to identify themselves');

  // lookupCik
  const aapl = await edgar.lookupCik('aapl');
  eq(aapl && aapl.cik, '0000320193', 'lookupCik: lower-case ticker → zero-padded 10-digit CIK');
  eq(aapl && aapl.title, 'Apple Inc.', 'lookupCik: returns the SEC company title');
  const brk = await edgar.lookupCik('BRK.B');
  eq(brk && brk.cik, '0001067983', 'lookupCik: BRK.B is normalised to BRK-B');
  eq(await edgar.lookupCik('ZZZZ'), null, 'lookupCik: unknown ticker → null');

  // listFilings
  mock.reset();
  const k1 = await edgar.listFilings('0000320193', { form: '10-K', limit: 1 });
  eq(k1.filings.length, 1, 'listFilings: limit 1 → one filing');
  eq(k1.filings[0].filed, '2025-10-31', 'listFilings: newest first');
  eq(k1.filings[0].period, '2025-09-27', 'listFilings: period = reportDate');
  eq(k1.fiscalYearEnd, '0927', 'listFilings: exposes fiscalYearEnd');
  eq(k1.entity, 'Apple Inc.', 'listFilings: exposes the entity name');
  check(!mock.requests.some(r => r.url.includes('submissions-001')), 'listFilings: archive block NOT fetched when "recent" satisfies the request');

  mock.reset();
  const kSince = await edgar.listFilings('0000320193', { form: '10-K', since: '2021-01-01' });
  eq(kSince.filings.length, 4, 'listFilings: since 2021 reaches into the paginated archive (4 annual filings)');
  eq(kSince.filings[kSince.filings.length - 1].filed, '2021-10-29', 'listFilings: oldest archived filing included and sorted last');
  check(mock.requests.some(r => r.url.includes('submissions-001')), 'listFilings: archive block fetched when the window reaches past "recent"');

  const kMore = await edgar.listFilings('0000320193', { form: '10-K', limit: 3 });
  eq(kMore.filings.length, 3, 'listFilings: limit beyond "recent" pulls the archive to satisfy it');

  const q = await edgar.listFilings('0000320193', { form: '10-Q' });
  eq(q.filings.length, 4, 'listFilings: form filter returns only 10-Qs');
  check(q.filings.every(f => f.form === '10-Q'), 'listFilings: no other forms leak through the filter');

  const all = await edgar.listFilings('0000320193', {});
  check(all.filings.length >= 8, 'listFilings: no form → every filing');

  // URLs
  eq(edgar.archiveUrl('0000320193', '0000320193-25-000079', 'aapl-20250927.htm'),
    'https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250927.htm',
    'archiveUrl: strips CIK leading zeros and accession dashes');
  eq(edgar.filingIndexUrl('0000320193', '0000320193-25-000079'),
    'https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/0000320193-25-000079-index.htm',
    'filingIndexUrl: dashed accession in the index filename');

  // companyfacts
  const facts = await edgar.fetchCompanyFacts('0000320193');
  eq(facts && facts.entityName, 'Apple Inc.', 'fetchCompanyFacts: returns the facts payload');
  eq(await edgar.fetchCompanyFacts('0000000999'), null, 'fetchCompanyFacts: 404 → null (ETF / no statements), not an error');

  // retry + errors
  mock.reset();
  const flaky = await edgar.listFilings('0000000500', { form: '10-K' });
  eq(flaky.filings.length, 1, 'request: a 503 is retried and the second attempt succeeds');
  eq(mock.requests.filter(r => r.url.endsWith('CIK0000000500.json')).length, 2, 'request: exactly one retry for the 503');
  let err403 = null;
  try { await edgar.fetchJson('https://www.sec.gov/files/forbidden.json'); } catch (e) { err403 = e; }
  check(err403 instanceof edgar.HttpError && err403.status === 403, 'request: 403 surfaces as HttpError(403) without retry');
  eq(mock.requests.filter(r => r.url.endsWith('forbidden.json')).length, 1, 'request: no retry on 403');
  check(mock.requests.every(r => r.headers['User-Agent'] === edgar.USER_AGENT), 'request: every call carries the User-Agent header');

  // htmlToText
  const text = edgar.htmlToText(mock.filingHtml('aapl-20250927.htm'));
  excludes(text, 'HIDDEN FACTS', 'htmlToText: <ix:header> hidden facts removed');
  excludes(text, 'never in the text', 'htmlToText: <script> removed');
  excludes(text, 'color:red', 'htmlToText: <style> removed');
  excludes(text, 'must not survive', 'htmlToText: comments removed');
  check(!/<[a-z!/?]/i.test(text), 'htmlToText: no tags remain');
  includes(text, 'Total net sales | $ | 416,161 | 391,035', 'htmlToText: table row keeps cells separated by " | "');
  includes(text, 'Net income | 112,010 | 93,736', 'htmlToText: empty cells dropped from a row');
  includes(text, 'Management’s Discussion', 'htmlToText: numeric entity (&#8217;) decoded');
  includes(text, 'AT&T', 'htmlToText: &amp; decoded');
  includes(text, '“others” — see Note 3', 'htmlToText: named and hex entities decoded');
  includes(text, 'Item 7.', 'htmlToText: &nbsp; collapsed to a space');
  check(!/\n{3,}/.test(text), 'htmlToText: no runs of blank lines');
  check(text.endsWith('\n') && !text.endsWith('\n\n'), 'htmlToText: ends with exactly one newline');
  const plain = edgar.htmlToText('just text &amp; nothing else');
  eq(plain, 'just text & nothing else\n', 'htmlToText: plain text passes through');

  // ═══════════════════════════════════════════════════════════════════════════
  section('2. CLI — scripts/fetch-edgar.js (subprocess, fetch double)');
  let r = run(FETCH_EDGAR, []);
  eq(r.status, 1, 'fetch-edgar: no arguments → exit 1');
  includes(r.stdout, 'fetch-edgar.js', 'fetch-edgar: no arguments prints usage');
  r = run(FETCH_EDGAR, ['--help']);
  eq(r.status, 0, 'fetch-edgar: --help → exit 0');

  r = run(FETCH_EDGAR, edgarArgs(['ZZZZ']));
  eq(r.status, 1, 'fetch-edgar: unknown ticker → exit 1');
  includes(r.stderr, 'not found', 'fetch-edgar: unknown ticker names the problem');

  // Default: latest 10-K
  r = run(FETCH_EDGAR, edgarArgs(['aapl']));
  eq(r.status, 0, 'fetch-edgar AAPL: exit 0');
  const base = path.join(OUT, 'AAPL', 'AAPL_2025_10-K');
  check(fs.existsSync(`${base}.htm`), 'fetch-edgar AAPL: .htm saved');
  check(fs.existsSync(`${base}.txt`), 'fetch-edgar AAPL: .txt saved (annual form keyed by filing year)');
  check(fs.existsSync(`${base}.json`), 'fetch-edgar AAPL: .json saved');
  const txt = fs.existsSync(`${base}.txt`) ? fs.readFileSync(`${base}.txt`, 'utf8') : '';
  includes(txt, 'Total net sales | $ | 416,161 | 391,035', 'fetch-edgar AAPL: .txt is the stripped text with legible tables');
  excludes(txt, 'HIDDEN FACTS', 'fetch-edgar AAPL: .txt has no inline-XBRL hidden block');
  const meta = fs.existsSync(`${base}.json`) ? JSON.parse(fs.readFileSync(`${base}.json`, 'utf8')) : {};
  eq(meta.form, '10-K', 'fetch-edgar AAPL: .json form');
  eq(meta.accession, '0000320193-25-000079', 'fetch-edgar AAPL: .json accession');
  eq(meta.period_end, '2025-09-27', 'fetch-edgar AAPL: .json period_end');
  eq(meta.filed, '2025-10-31', 'fetch-edgar AAPL: .json filed');
  eq(meta.document_url, 'https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250927.htm', 'fetch-edgar AAPL: .json document_url');
  eq(meta.cik, '0000320193', 'fetch-edgar AAPL: .json cik');
  check(meta.data_and_sources && meta.data_and_sources['As of'] === '2025-09-27', 'fetch-edgar AAPL: .json carries a ready Data & Sources "As of"');
  includes(meta.data_and_sources && meta.data_and_sources.Retrieval, 'pasted by user', 'fetch-edgar AAPL: Retrieval labelled "pasted by user"');
  includes(meta.data_and_sources && meta.data_and_sources.Source, '0000320193-25-000079', 'fetch-edgar AAPL: Source cites the accession');
  check(r.requests.length > 0 && r.requests.every(x => x.headers['User-Agent'] === UA), 'fetch-edgar: EDGAR_USER_AGENT is sent on every request');
  includes(r.stdout, 'Next: paste', 'fetch-edgar AAPL: tells the user what to do next');

  // Idempotent re-run, then --force
  const before = fs.readFileSync(`${base}.txt`, 'utf8');
  r = run(FETCH_EDGAR, edgarArgs(['AAPL']));
  eq(r.status, 0, 'fetch-edgar re-run: exit 0');
  includes(r.stdout, '⊘', 'fetch-edgar re-run: existing filing skipped');
  check(!r.requests.some(x => x.url.includes('/Archives/')), 'fetch-edgar re-run: the document is not downloaded again');
  eq(fs.readFileSync(`${base}.txt`, 'utf8'), before, 'fetch-edgar re-run: file byte-identical');
  r = run(FETCH_EDGAR, edgarArgs(['AAPL', '--force']));
  check(r.requests.some(x => x.url.includes('/Archives/')), 'fetch-edgar --force: re-downloads');

  // Quarterlies keyed by period, --limit
  r = run(FETCH_EDGAR, edgarArgs(['AAPL', '--form', '10-Q', '--limit', '2']));
  eq(r.status, 0, 'fetch-edgar --form 10-Q --limit 2: exit 0');
  check(fs.existsSync(path.join(OUT, 'AAPL', 'AAPL_2025-06-28_10-Q.txt')), 'fetch-edgar 10-Q: newest quarter keyed by period end');
  check(fs.existsSync(path.join(OUT, 'AAPL', 'AAPL_2025-03-29_10-Q.txt')), 'fetch-edgar 10-Q: second quarter saved');
  check(!fs.existsSync(path.join(OUT, 'AAPL', 'AAPL_2024-12-28_10-Q.txt')), 'fetch-edgar 10-Q: --limit 2 stops at two');

  // Event-driven form keyed by filing date, form name sanitised, quoted form with a space
  r = run(FETCH_EDGAR, edgarArgs(['AAPL', '--form', 'DEF 14A']));
  eq(r.status, 0, 'fetch-edgar --form "DEF 14A": exit 0');
  check(fs.existsSync(path.join(OUT, 'AAPL', 'AAPL_2025-01-10_000005_DEF14A.txt')), 'fetch-edgar DEF 14A: keyed by filing date + accession sequence, form sanitised in the filename');

  // Two 8-Ks filed on the same day must both land on disk (review finding: date-only keys collided)
  r = run(FETCH_EDGAR, edgarArgs(['AAPL', '--form', '8-K', '--limit', '2']));
  eq(r.status, 0, 'fetch-edgar two same-day 8-Ks: exit 0');
  check(fs.existsSync(path.join(OUT, 'AAPL', 'AAPL_2025-07-31_000055_8-K.txt')), 'fetch-edgar same-day 8-Ks: first saved');
  check(fs.existsSync(path.join(OUT, 'AAPL', 'AAPL_2025-07-31_000056_8-K.txt')), 'fetch-edgar same-day 8-Ks: second saved under its own accession — no collision');
  includes(r.stdout, 'Done: 2/2', 'fetch-edgar same-day 8-Ks: both reported');
  excludes(r.stdout, '⊘', 'fetch-edgar same-day 8-Ks: neither was silently skipped as "exists"');

  // --limit validation (review finding: NaN disabled the cap)
  for (const bad of ['abc', '0', '-1', '1.5', '1abc']) {
    r = run(FETCH_EDGAR, edgarArgs(['AAPL', '--limit', bad, '--list']));
    check(r.status === 1 && /positive integer/.test(r.stderr), `fetch-edgar --limit ${bad}: rejected before any request`, r.stderr.trim());
    eq(r.requests.length, 0, `fetch-edgar --limit ${bad}: no network call made`);
  }
  // --limit is honoured together with --fy (review finding: the cap was dropped when filtering)
  r = run(FETCH_EDGAR, edgarArgs(['AAPL', '--form', '10-Q', '--fy', '2025', '--limit', '2', '--list']));
  eq(r.status, 0, 'fetch-edgar --fy + --limit: exit 0');
  includes(r.stdout, '2025-08-01', 'fetch-edgar --fy 2025 --limit 2: newest 2025 10-Q listed');
  includes(r.stdout, '2025-05-02', 'fetch-edgar --fy 2025 --limit 2: second 2025 10-Q listed');
  excludes(r.stdout, '2025-01-31', 'fetch-edgar --fy 2025 --limit 2: third 2025 10-Q cut by the limit');
  r = run(FETCH_EDGAR, edgarArgs(['AAPL', '--form', '10-Q', '--fy', '2025', '--limit', '3', '--list']));
  includes(r.stdout, '2025-01-31', 'fetch-edgar --fy 2025 --limit 3: all three 2025 10-Qs listed');

  // --period
  r = run(FETCH_EDGAR, edgarArgs(['AAPL', '--form', '10-Q', '--period', '2024-06-29']));
  eq(r.status, 0, 'fetch-edgar --period: exit 0');
  check(fs.existsSync(path.join(OUT, 'AAPL', 'AAPL_2024-06-29_10-Q.txt')), 'fetch-edgar --period: picks the filing covering that period end');

  // --fy reaches the archive; --list writes nothing
  const filesBefore = fs.readdirSync(path.join(OUT, 'AAPL')).length;
  r = run(FETCH_EDGAR, edgarArgs(['AAPL', '--form', '10-K', '--fy', '2021', '--list']));
  eq(r.status, 0, 'fetch-edgar --fy 2021 --list: exit 0');
  includes(r.stdout, '2021-10-29  2021-09-25  0000320193-21-000105', 'fetch-edgar --fy 2021: finds the archived filing');
  excludes(r.stdout, '2025-10-31', 'fetch-edgar --fy 2021: other years filtered out');
  eq(fs.readdirSync(path.join(OUT, 'AAPL')).length, filesBefore, 'fetch-edgar --list: writes no files');
  check(!r.requests.some(x => x.url.includes('/Archives/')), 'fetch-edgar --list: downloads nothing');

  // --text-only
  for (const ext of ['txt', 'htm', 'json']) fs.rmSync(path.join(OUT, 'AAPL', `AAPL_2025-07-31_000055_8-K.${ext}`), { force: true });
  r = run(FETCH_EDGAR, edgarArgs(['AAPL', '--form', '8-K', '--text-only']));
  eq(r.status, 0, 'fetch-edgar --text-only: exit 0');
  check(fs.existsSync(path.join(OUT, 'AAPL', 'AAPL_2025-07-31_000055_8-K.txt')), 'fetch-edgar --text-only: .txt saved');
  check(!fs.existsSync(path.join(OUT, 'AAPL', 'AAPL_2025-07-31_000055_8-K.htm')), 'fetch-edgar --text-only: no .htm');

  // Foreign private issuer fallback
  r = run(FETCH_EDGAR, edgarArgs(['TSM']));
  eq(r.status, 0, 'fetch-edgar TSM: exit 0');
  includes(r.stdout, 'using 20-F', 'fetch-edgar TSM: 10-K → 20-F fallback announced');
  check(fs.existsSync(path.join(OUT, 'TSM', 'TSM_2026_20-F.txt')), 'fetch-edgar TSM: 20-F saved, keyed by filing year');
  r = run(FETCH_EDGAR, edgarArgs(['TSM', '--form', '10-Q']));
  eq(r.status, 0, 'fetch-edgar TSM --form 10-Q: no filings is a clean no-op (exit 0)');
  includes(r.stdout, '6-K', 'fetch-edgar TSM --form 10-Q: points at --form 6-K');

  // Ticker normalisation end to end
  r = run(FETCH_EDGAR, edgarArgs(['BRK.B', '--list']));
  eq(r.status, 0, 'fetch-edgar BRK.B: resolves via BRK-B');
  includes(r.stdout, 'BERKSHIRE', 'fetch-edgar BRK.B: right company');

  // Partial failure → exit 1 but the run completes
  r = run(FETCH_EDGAR, edgarArgs(['FLAKY']));
  eq(r.status, 1, 'fetch-edgar FLAKY: a document that 404s → exit 1');
  includes(r.stdout, 'Done: 0/1', 'fetch-edgar FLAKY: reports the partial result');
  includes(r.stderr, 'HTTP 404', 'fetch-edgar FLAKY: names the HTTP error');
  check(!fs.existsSync(path.join(OUT, 'FLAKY', 'FLAKY_2026_10-K.txt')), 'fetch-edgar FLAKY: no half-written .txt');

  // ═══════════════════════════════════════════════════════════════════════════
  section('3. CLI — scripts/fetch-fundamentals.js (subprocess, fetch double)');
  r = run(FETCH_FUND, []);
  eq(r.status, 1, 'fetch-fundamentals: no arguments → exit 1');
  r = run(FETCH_FUND, fundArgs(['ZZZZ']));
  eq(r.status, 1, 'fetch-fundamentals: unknown ticker → exit 1');

  r = run(FETCH_FUND, fundArgs(['AAPL']));
  eq(r.status, 0, 'fetch-fundamentals AAPL: exit 0');
  const packFile = path.join(FIX, 'AAPL.md');
  check(fs.existsSync(packFile), 'fetch-fundamentals AAPL: data/fixtures-style pack written');
  const pack = fs.existsSync(packFile) ? fs.readFileSync(packFile, 'utf8') : '';
  const fx = parseFixture(pack);
  check(fx !== null, 'fetch-fundamentals AAPL: pack has the YAML front block eval-skills.js expects');
  const m2 = (fx && fx.meta) || {};
  eq(m2.ticker, 'AAPL', 'pack: ticker');
  eq(m2.company, 'Apple Inc.', 'pack: company from entityName');
  eq(m2.as_of, '2025-09-27', 'pack: as_of = latest fiscal year end');
  eq(m2.fiscal_year, 'FY2025', 'pack: fiscal_year label');
  eq(m2.source_accession, '0000320193-25-000079', 'pack: source accession');
  eq(m2.price, '', 'pack: price line present but empty (SEC has no quotes) and parser-safe');
  eq(m2.shares_out_m, 14776, 'pack: AAPL FY2025 cover-page common shares rounded to millions');
  eq(m2.revenue_m, 416161, 'pack: revenue_m');
  eq(m2.revenue_prior_m, 391035, 'pack: revenue_prior_m from the prior fiscal year');
  eq(m2.gross_profit_m, 195201, 'pack: gross_profit_m');
  eq(m2.operating_income_m, 133050, 'pack: operating_income_m');
  eq(m2.net_income_m, 112010, 'pack: net_income_m');
  eq(m2.eps, 7.46, 'pack: eps (USD/shares unit)');
  eq(m2.ocf_m, 111482, 'pack: ocf_m');
  eq(m2.capex_m, 12715, 'pack: capex_m');
  eq(m2.fcf_m, 98767, 'pack: fcf_m = ocf − capex');
  eq(m2.cash_m, 35934, 'pack: cash_m');
  eq(m2.total_debt_m, 90678, 'pack: total_debt_m = current + non-current');
  eq(m2.net_debt_m, 54744, 'pack: net_debt_m = debt − cash');
  eq(m2.dividends_paid_m, 15421, 'pack: dividends_paid_m');
  eq(m2.buybacks_m, 90711, 'pack: buybacks_m');
  const ex = (fx && fx.expect) || [];
  check(ex.length >= 4, 'pack: expect list has the arithmetic checks', ex.length);
  const fcfCheck = ex.find(e => /FCF = OCF/.test(e.label));
  check(fcfCheck && fcfCheck.value === 98767 && fcfCheck.unit === 'm', 'pack: FCF expect entry parses with value + unit');
  const growth = ex.find(e => /Revenue growth/.test(e.label));
  check(growth && Math.abs(growth.value - 6.4) < 0.01, 'pack: revenue-growth expect = 6.4%', growth && growth.value);
  const gm = ex.find(e => /Gross margin/.test(e.label));
  check(gm && Math.abs(gm.value - 46.9) < 0.01, 'pack: gross-margin expect = 46.9%', gm && gm.value);
  const body = (fx && fx.body) || '';
  includes(body, '| Revenue | 416,161 | 391,035 |', 'pack body: income statement row, both years');
  includes(body, '| Net income | 112,010 | 93,736 |', 'pack body: FY2024 net income is the ORIGINAL 10-K value, not the mis-scaled comparative');
  includes(body, '| Free cash flow (OCF − capex) | 98,767 | 108,807 |', 'pack body: derived FCF for both years');
  includes(body, '| Total debt | 90,678 | 96,662 |', 'pack body: total debt both years');
  includes(body, 'Retrieval:  pasted by user', 'pack body: Data & Sources header ready to copy');
  includes(body, 'paste the current quote', 'pack body: says the price is missing');
  includes(body, '0000320193-25-000079-index.htm', 'pack body: references the filing index URL');
  includes(body, 'Not tagged for FY2025: interest_expense, goodwill', 'pack body: lists untagged concepts honestly');
  excludes(body, '| Revenue | n/a', 'pack body: no n/a where facts exist');

  // Repeated cover-page facts from another filing are not additional shares.
  r = run(FETCH_FUND, fundArgs(['AAPL', '--stdout']), { EDGAR_MOCK_REPEATED_SHARES: '1' });
  eq(r.status, 0, 'fetch-fundamentals repeated shares: exit 0');
  const repeatedShares = parseFixture(r.stdout);
  eq(repeatedShares && repeatedShares.meta.shares_out_m, 14776, 'pack: repeated filings do not double the shares outstanding');
  includes(repeatedShares && repeatedShares.body, 'cover page of the 10-K filed 2025-10-31', 'pack: share-count label follows the selected original filing');

  // Synthetic compatibility coverage, NOT representative dimensional SEC facts.
  for (const repeated of ['0', '1']) {
    r = run(FETCH_FUND, fundArgs(['MULTI', '--stdout']), { EDGAR_MOCK_REPEATED_SHARES: repeated });
    eq(r.status, 0, `fetch-fundamentals MULTI (repeated=${repeated}): exit 0`);
    const multi = parseFixture(r.stdout);
    eq(multi && multi.meta.shares_out_m, 14800, `pack MULTI (repeated=${repeated}): sums both latest-date classes from one filing only`);
    includes(multi && multi.body, 'cover page of the 10-K filed 2026-02-20, as of 2026-02-10', `pack MULTI (repeated=${repeated}): share-count label follows the selected original filing and latest date`);
  }

  for (const [date, expected] of [['2025-12-30', undefined], ['2025-12-31', 14000], ['2026-01-01', 14000], ['absent', undefined]]) {
    r = run(FETCH_FUND, fundArgs(['MULTI', '--stdout']), { EDGAR_MOCK_SHARE_DATE: date });
    eq(r.status, 0, `share-date boundary ${date}: exit 0`);
    const boundary = parseFixture(r.stdout);
    eq(boundary.meta.shares_out_m, expected, `share-date boundary ${date}: selected fiscal-year floor is inclusive`);
  }

  // Real SEC multi-class response: Berkshire's latest entity-wide DEI instant
  // is 2011-04-29, despite annual revenue from its FY2025 filing. Dimensional
  // current class counts are absent; do not publish the historical count.
  r = run(FETCH_FUND, fundArgs(['BRK-B', '--json']));
  eq(r.status, 0, 'fetch-fundamentals BRK-B stale shares: exit 0');
  const brkPack = parseFixture(fs.readFileSync(path.join(FIX, 'BRK-B.md'), 'utf8'));
  eq(brkPack.meta.as_of, '2025-12-31', 'BRK-B: representative FY2025 reporting period');
  eq(brkPack.meta.shares_out_m, undefined, 'BRK-B: stale shares omitted from machine-readable front block');
  includes(brkPack.body, '| Shares outstanding (n/a) | n/a |', 'BRK-B: stale shares render unavailable');
  includes(brkPack.body, 'no entity-wide cover-page count dated on or after 2025-12-31', 'BRK-B: missing count explanation is period-relative');
  const brkRaw = JSON.parse(fs.readFileSync(path.join(FIX, 'BRK-B.json'), 'utf8'));
  eq(brkRaw.shares_outstanding, null, 'BRK-B: raw JSON shares are null, not zero or stale');

  // --fy: older year via the older revenue tag, no prior year available
  r = run(FETCH_FUND, fundArgs(['AAPL', '--fy', '2023', '--stdout']));
  eq(r.status, 0, 'fetch-fundamentals --fy 2023 --stdout: exit 0');
  check(r.stdout.startsWith('---\n'), 'fetch-fundamentals --stdout: stdout is ONLY the pack (progress goes to stderr), so `--stdout > file` parses', r.stdout.slice(0, 60));
  includes(r.stderr, 'Looking up', 'fetch-fundamentals --stdout: progress lines are on stderr');
  const fx23 = parseFixture(r.stdout);
  eq(fx23 && fx23.meta.as_of, '2023-09-30', 'pack --fy 2023: selects that fiscal year');
  eq(fx23 && fx23.meta.shares_out_m, 14776, 'pack --fy 2023: preserves latest available shares, not historical valuation');
  eq(fx23 && fx23.meta.revenue_m, 383285, 'pack --fy 2023: revenue found under the older "Revenues" tag (concept chain)');
  check(fx23 && fx23.meta.revenue_prior_m === undefined, 'pack --fy 2023: no prior-year key when none is tagged');
  check(!fs.existsSync(path.join(FIX, 'AAPL.md.tmp')) && fs.readFileSync(packFile, 'utf8') === pack, 'pack --stdout: does not overwrite the written pack');
  r = run(FETCH_FUND, fundArgs(['AAPL', '--fy', '1999']));
  eq(r.status, 1, 'fetch-fundamentals --fy 1999: unknown year → exit 1 listing the available ones');
  includes(r.stderr, '2025-09-27', 'fetch-fundamentals --fy 1999: lists available fiscal year ends');

  // --json
  r = run(FETCH_FUND, fundArgs(['AAPL', '--json']));
  const jf = path.join(FIX, 'AAPL.json');
  check(fs.existsSync(jf), 'fetch-fundamentals --json: raw figures written');
  const raw = fs.existsSync(jf) ? JSON.parse(fs.readFileSync(jf, 'utf8')) : {};
  eq(raw.shares_outstanding && raw.shares_outstanding.value, 14776353000, 'fetch-fundamentals --json: AAPL cover-page count in raw shares');
  eq(raw.shares_outstanding && raw.shares_outstanding.asOf, '2025-10-17', 'fetch-fundamentals --json: cover-page date, not fiscal year end');
  eq(raw.current && raw.current.revenue, 416161e6, 'fetch-fundamentals --json: current.revenue in dollars');
  eq(raw.prior && raw.prior.net_income, 93736e6, 'fetch-fundamentals --json: prior.net_income as first reported');

  // LongTermDebt already includes current maturities (review finding: it was added to LongTermDebtCurrent → double count)
  r = run(FETCH_FUND, fundArgs(['LTD']));
  eq(r.status, 0, 'fetch-fundamentals LTD: exit 0');
  const ltd = parseFixture(fs.readFileSync(path.join(FIX, 'LTD.md'), 'utf8'));
  eq(ltd && ltd.meta.total_debt_m, 1000, 'pack LTD: total_debt_m = LongTermDebt as tagged (1,000), current portion NOT added again');
  eq(ltd && ltd.meta.net_debt_m, 900, 'pack LTD: net_debt_m = 1,000 − 100 cash');
  includes(ltd && ltd.body, 'already includes current maturities', 'pack LTD: the note explains which debt tag was used');
  const aaplNote = body.match(/Total debt = ([^;]+);/);
  check(aaplNote && /current \+ non-current/.test(aaplNote[1]), 'pack AAPL: with the Noncurrent tag, total debt = current + non-current', aaplNote && aaplNote[1]);
  check(ltd && !/Short-term borrowings of/.test(ltd.body), 'pack LTD: ShortTermBorrowings equal to the current portion is the same debt — not flagged, not added');

  // Convertible notes tagged only in LongTermDebt (RKLB FY2025: the split saw $2M, the total $152M)
  r = run(FETCH_FUND, fundArgs(['CNV']));
  eq(r.status, 0, 'fetch-fundamentals CNV: exit 0');
  const cnv = parseFixture(fs.readFileSync(path.join(FIX, 'CNV.md'), 'utf8'));
  eq(cnv && cnv.meta.total_debt_m, 152, 'pack CNV: total_debt_m = LongTermDebt (152), not Noncurrent + current (2)');
  eq(cnv && cnv.meta.net_debt_m, -675, 'pack CNV: net_debt_m = 152 − 827 cash (net cash 675, not 825)');
  includes(cnv && cnv.body, '| Long-term debt | 152 |', 'pack CNV: long-term line restated so current + long-term = total');
  includes(cnv && cnv.body, 'often convertible notes', 'pack CNV: a note explains why the tagged total was used');
  // SG&A rebuilt from separate selling + G&A lines; G&A alone is never shown as SG&A
  includes(cnv && cnv.body, '| SG&A | 165 |', 'pack CNV: SG&A = selling & marketing (50) + G&A (115)');
  includes(cnv && cnv.body, 'SG&A = selling & marketing (50M) + G&A (115M)', 'pack CNV: a note says SG&A was rebuilt from two tags');
  includes(ltd && ltd.body, '| G&A (SG&A not tagged) | 300 |', 'pack LTD: G&A-only filer gets a G&A row, not an SG&A figure');
  check(ltd && /\| SG&A \| n\/a \|/.test(ltd.body), 'pack LTD: the SG&A row stays n/a when only G&A is tagged');
  // Operating cash flow and FCF from continuing operations, total disclosed in the notes
  eq(cnv && cnv.meta.ocf_m, -166, 'pack CNV: ocf_m = continuing operations (−166), not the total (−150)');
  eq(cnv && cnv.meta.fcf_m, -322, 'pack CNV: fcf_m = continuing OCF − capex');
  includes(cnv && cnv.body, 'total operating cash flow including discontinued operations was -150M', 'pack CNV: the total OCF is stated in the notes');
  // Net debt also shown net of short-term investments; an all-AFS fallback is labelled
  eq(cnv && cnv.meta.short_term_investments_m, 1013, 'pack CNV: short_term_investments_m falls back to all AFS debt securities');
  eq(cnv && cnv.meta.net_debt_incl_investments_m, -1688, 'pack CNV: net_debt_incl_investments_m = 152 − 827 − 1,013');
  includes(cnv && cnv.body, 'can include non-current holdings', 'pack CNV: the AFS fallback is flagged in the notes');
  eq(m2.net_debt_incl_investments_m, 35981, 'pack AAPL: net debt incl. short-term investments = 90,678 − 35,934 − 18,763');
  includes(body, '| Net debt (cash) incl. short-term investments | 35,981 |', 'pack AAPL: net debt incl. investments row');
  // The share count names the filing it came from
  includes(body, 'cover page of the 10-K filed 2025-10-31, as of 2025-10-17', 'pack AAPL: share count labelled with its filing');
  includes(cnv && cnv.body, 'cover page of the 10-Q filed 2026-08-10 (later than the 10-K), as of 2026-08-05', 'pack CNV: a later 10-Q share count says so');
  // AAPL tags LongTermDebt equal to the split, so the split stays; its commercial paper is flagged, not added
  eq(m2.total_debt_m, 90678, 'pack AAPL: LongTermDebt within 5% of the split → split kept (commercial paper not added)');
  includes(body, 'Commercial paper of 7,979M is tagged but not included in total debt', 'pack AAPL: commercial paper flagged in the notes');
  check(!/long_term_debt_total|commercial_paper|short_borrowings/.test((body.match(/Not tagged for [^\n]*/) || [''])[0]), 'pack AAPL: helper debt facts never listed as "not tagged"');

  // Industry comes from the submissions index (companyfacts has no SIC)
  includes(body, '| Industry (SIC) | 3571 — Electronic Computers |', 'pack AAPL: SIC read from the submissions index');
  // The fetch-edgar hint is pinned to this filing: its --fy is the filing year
  includes(body, 'node scripts/fetch-edgar.js AAPL --form 10-K --fy 2025', 'pack AAPL: full-text hint names the filing year of the 10-K the pack was built from');
  includes(fx23 && fx23.body, 'node scripts/fetch-edgar.js AAPL --form 10-K --fy 2023', 'pack --fy 2023: full-text hint follows the selected year, not the latest');
  // A comparative that disagrees with the first-reported figure is named, never silently swapped in
  includes(body, 'net_income (93,736M first reported, 0M in the comparative)', 'pack AAPL: the mis-scaled FY2024 comparative is flagged in the notes');
  excludes(body, 'per-share lines are the FY2025', 'pack AAPL: no split note when the comparative EPS equals the first-reported one');
  excludes(body, 'Not tagged in the 10-K itself', 'pack AAPL: no other-filing note when the 10-K tagged every line');
  includes(body, "the FY2024 column is the prior year's annual filing", 'pack AAPL: prior column attributed to the prior 10-K');

  // The latest fiscal year is flagged once it is implausibly old; an explicit --fy is not
  excludes(body, 'Possibly out of date', 'pack AAPL: a 13-month-old fiscal year is not flagged stale');
  r = run(FETCH_FUND, fundArgs(['AAPL', '--stdout']), { EDGAR_TODAY: '2027-06-01' });
  includes(r.stdout, 'Possibly out of date', 'pack AAPL 20 months on: the stale latest year is flagged in the pack');
  includes(r.stdout, 'ended 2025-09-27, more than 16 months before this pack was generated (2027-06-01)', 'pack AAPL 20 months on: the warning names both dates');
  includes(r.stderr, 'check EDGAR for a newer filing', 'pack AAPL 20 months on: and on the console');
  r = run(FETCH_FUND, fundArgs(['AAPL', '--fy', '2023', '--stdout']), { EDGAR_TODAY: '2027-06-01' });
  excludes(r.stdout, 'Possibly out of date', 'pack --fy 2023: an explicitly requested old year is not flagged');

  // Stock split + recast: the prior column must share the current year's share basis
  r = run(FETCH_FUND, fundArgs(['SPLT', '--json']));
  eq(r.status, 0, 'fetch-fundamentals SPLT: exit 0');
  const splt = parseFixture(fs.readFileSync(path.join(FIX, 'SPLT.md'), 'utf8'));
  includes(splt.body, '| Diluted EPS | $2.94 | $1.19 |', 'pack SPLT: prior EPS is the split-adjusted comparative, not $11.93 as first reported');
  includes(splt.body, '| Diluted shares (M) | 248 | 251 |', 'pack SPLT: prior diluted shares on the post-split basis, found under the concept the FY2025 10-K switched to');
  includes(splt.body, 'eps_diluted $1.19 (first reported $11.93)', 'pack SPLT: the note keeps the first-reported EPS visible');
  includes(splt.body, 'shares_diluted 251M (first reported 25.1M)', 'pack SPLT: the note keeps the first-reported share count visible');
  includes(splt.body, '| Revenue | 4,000 | 5,000 |', 'pack SPLT: prior revenue stays as first reported');
  includes(splt.body, 'revenue (5,000M first reported, 3,600M in the comparative)', 'pack SPLT: the recast revenue comparative is named');
  check(!splt.expect.some(e => /Revenue growth/.test(e.label)), 'pack SPLT: no revenue-growth expectation when the two filings disagree on the prior year');
  includes(splt.body, 'the revenue-growth check is omitted', 'pack SPLT: and the note says why');
  excludes(splt.body, 'net_income (', 'pack SPLT: a comparative equal to the first-reported value is not listed');
  includes(splt.body, 'goodwill (10-K/A filed 2026-05-01, accession 0000000444-26-000009)', 'pack SPLT: a line tagged only in a later filing is attributed to it');
  includes(splt.body, 'read from a filing made on or before its filing date: operating_income (8-K filed 2026-02-05, accession 0000000444-26-000000)', 'pack SPLT: a line from an earlier 8-K is attributed to it without calling it later or restated');
  check(!/possibly restated:[^\n]*operating_income/.test(splt.body), 'pack SPLT: the earlier 8-K is not in the "later filing" list');
  includes(splt.body, '| Income tax | 160 |', 'pack SPLT: a fact tagged in both an earlier 8-K and the 10-K is read from the 10-K');
  excludes(splt.body, 'income_tax (', 'pack SPLT: and is therefore not listed as missing from the 10-K');
  includes(splt.body, 'except the lines the Notes list as read from another filing', 'pack SPLT: the source statement no longer claims every figure is from the 10-K');
  eq(JSON.parse(fs.readFileSync(path.join(FIX, 'SPLT.json'), 'utf8')).prior.eps_diluted, 1.19, 'fetch-fundamentals SPLT --json: prior EPS is split-adjusted too');

  // Revenue tag drift: the latest fiscal year follows net income, not the last year the old revenue tag carried
  r = run(FETCH_FUND, fundArgs(['DRIFT']));
  eq(r.status, 0, 'fetch-fundamentals DRIFT: exit 0');
  const drift = parseFixture(fs.readFileSync(path.join(FIX, 'DRIFT.md'), 'utf8'));
  eq(drift.meta.as_of, '2025-12-31', 'pack DRIFT: latest year is FY2025 (net income), not FY2023 (the last mapped revenue tag)');
  eq(drift.meta.revenue_m, undefined, 'pack DRIFT: revenue is absent, not carried over from FY2023');
  includes(drift.body, 'Not tagged for FY2025: revenue,', 'pack DRIFT: the missing revenue is listed');
  eq(drift.meta.net_income_m, 90, 'pack DRIFT: net income for the selected year');
  // Short-term borrowings are not inside LongTermDebt: added to it, never subtracted from it
  eq(drift.meta.total_debt_m, 620, 'pack DRIFT: total_debt_m = LongTermDebt (500) + ShortTermBorrowings (120)');
  includes(drift.body, '| Long-term debt | 500 |', 'pack DRIFT: long-term line is the tagged total, not 500 − 120');
  eq(drift.meta.net_debt_m, 570, 'pack DRIFT: net_debt_m = 620 − 50 cash');
  includes(drift.body, 'plus `ShortTermBorrowings` (120M, not part of long-term debt)', 'pack DRIFT: the note says the borrowings were added');
  check(!/Short-term borrowings of/.test(drift.body), 'pack DRIFT: borrowings already in the total are not also flagged as excluded');
  // Small share counts keep their decimals
  eq(drift.meta.shares_out_m, 2.912, 'pack DRIFT: 2,912,345 shares → 2.912M, not rounded to 3');
  includes(drift.body, '| 2.912 M |', 'pack DRIFT: shares-outstanding cell keeps three decimals below 100M');
  includes(drift.body, '| Diluted shares (M) | 2.95 | n/a |', 'pack DRIFT: diluted shares keep decimals too');
  includes(drift.body, '| Industry (SIC) | see filing cover page |', 'pack DRIFT: a failed submissions lookup falls back instead of failing the run');

  // First 10-K: both years from one filing
  r = run(FETCH_FUND, fundArgs(['IPO', '--stdout']));
  eq(r.status, 0, 'fetch-fundamentals IPO: exit 0');
  includes(r.stdout, '| Line | FY2025 | FY2024 |', 'pack IPO: the two columns are not both labelled FY2025');
  includes(r.stdout, 'the FY2024 column is the comparative column of the same filing', 'pack IPO: prior column attributed to the same 10-K');
  excludes(r.stdout, 'for the fiscal year ended 2024-12-31', 'pack IPO: no reference to a prior-year 10-K that does not exist');
  includes(r.stdout, '2. SEC XBRL company facts', 'pack IPO: references stay consecutively numbered');
  includes(r.stdout, '| Industry (SIC) | see filing cover page |', 'pack IPO: a submissions request that fails at the transport level does not stop the pack');
  eq(r.requests.filter(x => x.url.endsWith('/submissions/CIK0000000333.json')).length, 3, 'pack IPO: the failed profile request was retried, then given up on');
  check((parseFixture(r.stdout).expect.find(e => /Revenue growth/.test(e.label)) || {}).value === 28.6, 'pack IPO: revenue growth from the two columns of the one filing');

  // Non-GAAP filers and 404s are clean no-ops
  r = run(FETCH_FUND, fundArgs(['TSM']));
  eq(r.status, 0, 'fetch-fundamentals TSM: IFRS filer → exit 0');
  includes(r.stdout, 'No us-gaap facts', 'fetch-fundamentals TSM: explains why nothing was built');
  check(!fs.existsSync(path.join(FIX, 'TSM.md')), 'fetch-fundamentals TSM: no pack written');
  r = run(FETCH_FUND, fundArgs(['NOFACTS']));
  eq(r.status, 0, 'fetch-fundamentals NOFACTS: companyfacts 404 → exit 0');
  check(!fs.existsSync(path.join(FIX, 'NOFACTS.md')), 'fetch-fundamentals NOFACTS: no pack written');
  check(r.requests.every(x => x.headers['User-Agent'] === UA), 'fetch-fundamentals: EDGAR_USER_AGENT sent on every request');

  // ═══════════════════════════════════════════════════════════════════════════
  section('4. Repository wiring');
  const gitignore = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
  check(/^data\/filings\/$/m.test(gitignore), '.gitignore ignores data/filings/');
  check(/^data\/fixtures\/\*$/m.test(gitignore) && /^!data\/fixtures\/ZEPH\.md$/m.test(gitignore), '.gitignore ignores generated fixtures but keeps ZEPH.md');
  check(!fs.readdirSync(path.join(ROOT, 'data')).some(f => f.toLowerCase().endsWith('.pdf')), 'no PDFs vendored under data/');
  eq(PKG.scripts['fetch:edgar'], 'node scripts/fetch-edgar.js', 'package.json: fetch:edgar alias');
  eq(PKG.scripts['fetch:fundamentals'], 'node scripts/fetch-fundamentals.js', 'package.json: fetch:fundamentals alias');
  check(!/fetch-edgar|fetch-fundamentals/.test(PKG.scripts.test), 'package.json: the network helpers themselves are not in `npm test`');
  includes(PKG.scripts.test, 'test-edgar.js', 'package.json: this offline suite is in `npm test`');
  for (const skill of ['10k-digest', 'financial-report-analyst', 'fact-check']) {
    for (const file of [`plugins/us-stock-analysis/skills/${skill}/SKILL.md`, `prompts/${skill}.md`]) {
      const s = fs.readFileSync(path.join(ROOT, file), 'utf8');
      check(s.includes('data.sec.gov/submissions/CIK##########.json') && s.includes('company_tickers.json'), `${file}: carries the keyless EDGAR recipe`);
    }
  }
  for (const file of ['site/content/DATA-AND-ACCURACY.md', 'site/content/DATA-AND-ACCURACY-zh-TW.md']) {
    const s = fs.readFileSync(path.join(ROOT, file), 'utf8');
    check(s.includes('fetch-edgar.js') && s.includes('fetch-fundamentals.js') && s.includes('companyfacts'), `${file}: documents both helpers and the XBRL endpoint`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  process.stdout.write('\n' + '═'.repeat(60) + '\n  EDGAR HELPER TEST RESULTS\n' + '═'.repeat(60) + '\n');
  process.stdout.write(`  ✅ Passed:   ${passed}\n  ❌ Failed:   ${failed}\n` + '═'.repeat(60) + '\n');
  if (failed) {
    process.stdout.write('\n  Failures:\n' + failures.map(f => `    • ${f}`).join('\n') + '\n\n');
  } else {
    process.stdout.write('\n  🎉 All EDGAR helper tests passed!\n\n');
  }
  if (process.env.KEEP_EDGAR_TEST_DIR) process.stdout.write(`  Test directory kept: ${WORK}\n\n`);
  else fs.rmSync(WORK, { recursive: true, force: true });
  process.exit(failed ? 1 : 0);
}

main().catch(err => { process.stderr.write(`\n💥 test-edgar.js crashed: ${err.stack || err}\n`); process.exit(1); });
