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
      EDGAR_REQUEST_INTERVAL_MS: '0', EDGAR_RETRY_BACKOFF_MS: '0', ...extraEnv,
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
  check(fs.existsSync(path.join(OUT, 'AAPL', 'AAPL_2025-01-10_DEF14A.txt')), 'fetch-edgar DEF 14A: keyed by filing date, form sanitised in the filename');

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
  r = run(FETCH_EDGAR, edgarArgs(['AAPL', '--form', '8-K', '--text-only']));
  eq(r.status, 0, 'fetch-edgar --text-only: exit 0');
  check(fs.existsSync(path.join(OUT, 'AAPL', 'AAPL_2025-07-31_8-K.txt')), 'fetch-edgar --text-only: .txt saved');
  check(!fs.existsSync(path.join(OUT, 'AAPL', 'AAPL_2025-07-31_8-K.htm')), 'fetch-edgar --text-only: no .htm');

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
  eq(m2.shares_out_m, 14800, 'pack: shares_out_m sums share classes tagged on the same date');
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

  // --fy: older year via the older revenue tag, no prior year available
  r = run(FETCH_FUND, fundArgs(['AAPL', '--fy', '2023', '--stdout']));
  eq(r.status, 0, 'fetch-fundamentals --fy 2023 --stdout: exit 0');
  const fx23 = parseFixture(r.stdout.slice(r.stdout.indexOf('---\n')));
  eq(fx23 && fx23.meta.as_of, '2023-09-30', 'pack --fy 2023: selects that fiscal year');
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
  eq(raw.current && raw.current.revenue, 416161e6, 'fetch-fundamentals --json: current.revenue in dollars');
  eq(raw.prior && raw.prior.net_income, 93736e6, 'fetch-fundamentals --json: prior.net_income as first reported');

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
