/**
 * edgar-mock-fetch.js — an offline test double for the SEC EDGAR endpoints
 * that scripts/lib/edgar.js talks to. Used only by scripts/test-edgar.js.
 *
 * Two ways in:
 *   • in-process:  require('./edgar-mock-fetch').install()   — then require edgar.js
 *   • subprocess:  node -r scripts/lib/edgar-mock-fetch.js scripts/fetch-edgar.js …
 *                  with EDGAR_MOCK=1 in the environment (auto-installs on preload)
 *
 * Every request is appended as a JSON line to $EDGAR_MOCK_LOG (if set) so the
 * tests can assert on URLs and headers (User-Agent), and to the in-memory
 * `requests` array for in-process use.
 *
 * The universe is synthetic and deliberately small:
 *   AAPL    (CIK 320193)  — full 10-K / 10-Q / 8-K / DEF 14A history, an archive
 *                          block with a 2021 10-K, complete US-GAAP facts for
 *                          FY2025 / FY2024 (+ a FY2023 under an older revenue tag,
 *                          and a mis-scaled comparative to test "as first reported")
 *   BRK-B   (CIK 1067983) — ticker-normalisation case (BRK.B → BRK-B)
 *   TSM     (CIK 1046179) — foreign private issuer: 20-F / 6-K only, IFRS facts
 *   NOFACTS (CIK 999)     — has filings, but companyfacts returns 404
 *   FLAKY   (CIK 500)     — submissions 503 on the first call, then 200; its
 *                          10-K document is a 404
 *   LTD     (CIK 777)     — tags LongTermDebt (includes current maturities) +
 *                          LongTermDebtCurrent, no Noncurrent tag: the
 *                          double-counting trap for total debt
 * The numbers for AAPL are the FY2025 figures as reported, so a reader can
 * sanity-check the pack the generator produces against the real 10-K.
 */
const fs = require('fs');

const SEC = 'https://www.sec.gov';
const DATA = 'https://data.sec.gov';

// ── helpers ──────────────────────────────────────────────────────────────────
/** Millions -> dollars, the unit XBRL reports monetary facts in. */
const M = n => Math.round(n * 1e6);
/** A minimal fetch Response double: `ok`, `status`, `json()`, `text()`. */
function response(status, body, type = 'json') {
  const text = type === 'json' ? JSON.stringify(body) : String(body);
  return {
    ok: status >= 200 && status < 300, status,
    async json() { return JSON.parse(text); },
    async text() { return text; },
  };
}
/** Columnar submissions block from row objects. */
function block(rows) {
  const b = { form: [], filingDate: [], reportDate: [], accessionNumber: [], primaryDocument: [], primaryDocDescription: [] };
  for (const r of rows) {
    b.form.push(r.form); b.filingDate.push(r.filed); b.reportDate.push(r.period || '');
    b.accessionNumber.push(r.accn); b.primaryDocument.push(r.doc); b.primaryDocDescription.push(r.desc || r.form);
  }
  return b;
}
/** A duration fact. */
const dur = (start, end, val, form, filed, accn, fy, fp = 'FY') => ({ start, end, val, form, filed, accn, fy, fp, frame: undefined });
/** An instant fact. */
const inst = (end, val, form, filed, accn, fy, fp = 'FY') => ({ end, val, form, filed, accn, fy, fp });
/** Wrap points as a USD-unit concept entry. */
const usd = pts => ({ units: { USD: pts } });

// ── AAPL ─────────────────────────────────────────────────────────────────────
const AAPL = {
  cik: '0000320193', name: 'Apple Inc.',
  recent: [
    { form: '10-K', filed: '2025-10-31', period: '2025-09-27', accn: '0000320193-25-000079', doc: 'aapl-20250927.htm' },
    { form: '10-Q', filed: '2025-08-01', period: '2025-06-28', accn: '0000320193-25-000057', doc: 'aapl-20250628.htm' },
    { form: '8-K', filed: '2025-07-31', period: '2025-07-31', accn: '0000320193-25-000055', doc: 'aapl-20250731.htm' },
    // A second 8-K on the same day (earnings release + a separate Item 5.02): the two must not collide on disk.
    { form: '8-K', filed: '2025-07-31', period: '2025-07-31', accn: '0000320193-25-000056', doc: 'aapl-20250731-2.htm' },
    { form: '10-Q', filed: '2025-05-02', period: '2025-03-29', accn: '0000320193-25-000031', doc: 'aapl-20250329.htm' },
    { form: '10-Q', filed: '2025-01-31', period: '2024-12-28', accn: '0000320193-25-000008', doc: 'aapl-20241228.htm' },
    { form: 'DEF 14A', filed: '2025-01-10', period: '2025-02-25', accn: '0000320193-25-000005', doc: 'aapl-def14a.htm' },
    { form: '10-K', filed: '2024-11-01', period: '2024-09-28', accn: '0000320193-24-000123', doc: 'aapl-20240928.htm' },
    { form: '10-Q', filed: '2024-08-02', period: '2024-06-29', accn: '0000320193-24-000081', doc: 'aapl-20240629.htm' },
  ],
  archive: [
    { form: '10-K', filed: '2023-11-03', period: '2023-09-30', accn: '0000320193-23-000106', doc: 'aapl-20230930.htm' },
    { form: '10-K', filed: '2021-10-29', period: '2021-09-25', accn: '0000320193-21-000105', doc: 'aapl-20210925.htm' },
  ],
};
const K25 = ['10-K', '2025-10-31', '0000320193-25-000079', 2025];
const K24 = ['10-K', '2024-11-01', '0000320193-24-000123', 2024];
const K23 = ['10-K', '2023-11-03', '0000320193-23-000106', 2023];
const FY25 = ['2024-09-29', '2025-09-27'], FY24 = ['2023-10-01', '2024-09-28'], FY23 = ['2022-09-25', '2023-09-30'];
/** One fiscal-year duration point from a [start, end] span and a filing tuple. */
const yr = (span, val, k) => dur(span[0], span[1], val, ...k);
/** FY2025 and FY2024 values as reported, plus the FY2024 comparative repeated in the FY2025 10-K. */
const two = (v25, v24) => [yr(FY25, M(v25), K25), yr(FY24, M(v24), K24), yr(FY24, M(v24), K25)]; // FY24 original + its comparative in the FY25 10-K
/** Instant equivalent of `two`: both balance-sheet dates plus the repeated comparative. */
const twoInst = (v25, v24) => [inst(FY25[1], M(v25), ...K25), inst(FY24[1], M(v24), ...K24), inst(FY24[1], M(v24), ...K25)];

const AAPL_FACTS = {
  cik: 320193, entityName: 'Apple Inc.',
  facts: {
    dei: {
      EntityCommonStockSharesOutstanding: { units: { shares: [
        { end: '2025-10-17', val: 14_000_000_000, form: '10-K', filed: '2025-10-31', accn: '0000320193-25-000079', fy: 2025, fp: 'FY' },
        { end: '2025-10-17', val: 800_000_000, form: '10-K', filed: '2025-10-31', accn: '0000320193-25-000079', fy: 2025, fp: 'FY' }, // second class, same date → summed
        { end: '2024-10-18', val: 15_115_823_000, form: '10-K', filed: '2024-11-01', accn: '0000320193-24-000123', fy: 2024, fp: 'FY' },
      ] } },
    },
    'us-gaap': {
      // Current tag: FY2025 + FY2024 (+ a quarterly point that must be ignored)
      RevenueFromContractWithCustomerExcludingAssessedTax: usd([
        ...two(416161, 391035),
        dur('2025-03-30', '2025-06-28', M(94036), '10-Q', '2025-08-01', '0000320193-25-000057', 2025, 'Q3'),
      ]),
      // Older tag only: FY2023 — exercises the concept chain
      Revenues: usd([yr(FY23, M(383285), K23)]),
      CostOfGoodsAndServicesSold: usd(two(220960, 210352)),
      GrossProfit: usd(two(195201, 180683)),
      ResearchAndDevelopmentExpense: usd(two(34550, 31370)),
      SellingGeneralAndAdministrativeExpense: usd(two(27601, 26097)),
      OperatingIncomeLoss: usd(two(133050, 123216)),
      IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest: usd(two(132729, 123485)),
      IncomeTaxExpenseBenefit: usd(two(20719, 29749)),
      // FY2024 net income: the original 10-K says 93,736 M; the FY2025 10-K's comparative column
      // is mis-scaled (93,736 — dropped the millions). "As first reported" must pick the original.
      NetIncomeLoss: usd([yr(FY25, M(112010), K25), yr(FY24, M(93736), K24), yr(FY24, 93736, K25), yr(FY23, M(96995), K23)]),
      EarningsPerShareDiluted: { units: { 'USD/shares': [yr(FY25, 7.46, K25), yr(FY24, 6.08, K24), yr(FY24, 6.08, K25)] } },
      WeightedAverageNumberOfDilutedSharesOutstanding: { units: { shares: [yr(FY25, M(15005), K25), yr(FY24, M(15408), K24)] } },
      DepreciationDepletionAndAmortization: usd(two(11698, 11445)),
      ShareBasedCompensation: usd(two(12863, 11688)),
      NetCashProvidedByUsedInOperatingActivities: usd(two(111482, 118254)),
      PaymentsToAcquirePropertyPlantAndEquipment: usd(two(12715, 9447)),
      PaymentsOfDividends: usd(two(15421, 15234)),
      PaymentsForRepurchaseOfCommonStock: usd(two(90711, 94949)),
      CashAndCashEquivalentsAtCarryingValue: usd(twoInst(35934, 29943)),
      MarketableSecuritiesCurrent: usd(twoInst(18763, 35228)),
      AccountsReceivableNetCurrent: usd(twoInst(39777, 33410)),
      InventoryNet: usd(twoInst(5718, 7286)),
      PropertyPlantAndEquipmentNet: usd(twoInst(49834, 45680)),
      Assets: usd(twoInst(359241, 364980)),
      AccountsPayableCurrent: usd(twoInst(69860, 68960)),
      LongTermDebtCurrent: usd(twoInst(12350, 10912)),
      LongTermDebtNoncurrent: usd(twoInst(78328, 85750)),
      Liabilities: usd(twoInst(285508, 308030)),
      StockholdersEquity: usd(twoInst(73733, 56950)),
    },
  },
};

// ── Other companies ──────────────────────────────────────────────────────────
const TSM = {
  cik: '0001046179', name: 'TAIWAN SEMICONDUCTOR MANUFACTURING CO LTD',
  recent: [
    { form: '6-K', filed: '2026-07-10', period: '2026-06-30', accn: '0001628280-26-031111', doc: 'tsm-6k-202607.htm' },
    { form: '20-F', filed: '2026-04-16', period: '2025-12-31', accn: '0001628280-26-025362', doc: 'tsm-20251231.htm' },
    { form: '20-F', filed: '2025-04-17', period: '2024-12-31', accn: '0001628280-25-019988', doc: 'tsm-20241231.htm' },
  ],
};
const TSM_FACTS = { cik: 1046179, entityName: TSM.name, facts: { dei: {}, 'ifrs-full': { Revenue: usd([dur('2025-01-01', '2025-12-31', 1, '20-F', '2026-04-16', '0001628280-26-025362', 2025)]) } } };
const BRKB = { cik: '0001067983', name: 'BERKSHIRE HATHAWAY INC', recent: [{ form: '10-K', filed: '2026-02-23', period: '2025-12-31', accn: '0001067983-26-000010', doc: 'brka-20251231.htm' }] };
const NOFACTS = { cik: '0000000999', name: 'NO FACTS CORP', recent: [{ form: '10-K', filed: '2026-03-02', period: '2025-12-31', accn: '0000000999-26-000001', doc: 'nofacts-20251231.htm' }] };
const FLAKY = { cik: '0000000500', name: 'FLAKY HOLDINGS', recent: [{ form: '10-K', filed: '2026-03-02', period: '2025-12-31', accn: '0000000500-26-000001', doc: 'missing.htm' }] };
// LTD tags us-gaap:LongTermDebt (which already includes current maturities) plus
// LongTermDebtCurrent, and no LongTermDebtNoncurrent — the case where naively
// adding current + long-term double-counts the current portion.
const LTD = { cik: '0000000777', name: 'LEVERAGED TEST CORP', recent: [{ form: '10-K', filed: '2026-02-20', period: '2025-12-31', accn: '0000000777-26-000004', doc: 'ltd-20251231.htm' }] };
const LTD_K = ['10-K', '2026-02-20', '0000000777-26-000004', 2025];
const LTD_FACTS = {
  cik: 777, entityName: 'Leveraged Test Corp',
  facts: {
    dei: { EntityCommonStockSharesOutstanding: { units: { shares: [{ end: '2026-02-10', val: 50_000_000, form: '10-K', filed: '2026-02-20', accn: '0000000777-26-000004', fy: 2025, fp: 'FY' }] } } },
    'us-gaap': {
      Revenues: usd([dur('2025-01-01', '2025-12-31', M(5000), ...LTD_K)]),
      NetIncomeLoss: usd([dur('2025-01-01', '2025-12-31', M(400), ...LTD_K)]),
      LongTermDebt: usd([inst('2025-12-31', M(1000), ...LTD_K)]),
      LongTermDebtCurrent: usd([inst('2025-12-31', M(200), ...LTD_K)]),
      CashAndCashEquivalentsAtCarryingValue: usd([inst('2025-12-31', M(100), ...LTD_K)]),
    },
  },
};

const TICKERS = {
  0: { cik_str: 320193, ticker: 'AAPL', title: 'Apple Inc.' },
  1: { cik_str: 1067983, ticker: 'BRK-B', title: 'BERKSHIRE HATHAWAY INC' },
  2: { cik_str: 1046179, ticker: 'TSM', title: 'TAIWAN SEMICONDUCTOR MANUFACTURING CO LTD' },
  3: { cik_str: 999, ticker: 'NOFACTS', title: 'NO FACTS CORP' },
  4: { cik_str: 500, ticker: 'FLAKY', title: 'FLAKY HOLDINGS' },
  5: { cik_str: 777, ticker: 'LTD', title: 'LEVERAGED TEST CORP' },
};

/** A `data.sec.gov/submissions/CIK...json` payload for a synthetic company. */
function submissions(c, extra = {}) {
  return {
    cik: String(parseInt(c.cik, 10)), name: c.name, fiscalYearEnd: extra.fiscalYearEnd || '1231',
    sic: '3571', sicDescription: 'Electronic Computers',
    filings: { recent: block(c.recent), files: extra.files || [] },
  };
}

/** The HTML every Archives document URL serves — inline-XBRL-flavoured, with the traps htmlToText must handle. */
function filingHtml(doc) {
  return `<?xml version="1.0"?><html xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"><head><title>${doc}</title>
<style>.x{color:red}</style><script>alert("never in the text")</script></head><body>
<div style="display:none"><ix:header><ix:hidden>HIDDEN FACTS 999999</ix:hidden></ix:header></div>
<!-- a comment that must not survive -->
<p>UNITED STATES SECURITIES AND EXCHANGE COMMISSION</p>
<p>FORM 10-K &mdash; ${doc}</p>
<p>Item&nbsp;7. Management&#8217;s Discussion and Analysis</p>
<p>Partners include AT&amp;T and &ldquo;others&rdquo; &#x2014; see Note 3.</p>
<table>
<tr><th>Line</th><th></th><th>2025</th><th>2024</th></tr>
<tr><td>Total net sales</td><td>$</td><td>416,161</td><td>391,035</td></tr>
<tr><td>Net income</td><td></td><td>112,010</td><td>93,736</td></tr>
</table>
<p>Item 8. Financial Statements</p>
</body></html>`;
}

// ── router ───────────────────────────────────────────────────────────────────
const state = { flakyCalls: 0 };
const requests = [];

/** Map a request URL to its canned response; unknown URLs get a 404. */
function route(url) {
  if (url === `${SEC}/files/company_tickers.json`) return response(200, TICKERS);
  if (url === `${SEC}/files/forbidden.json`) return response(403, 'Forbidden', 'text');

  if (url === `${DATA}/submissions/CIK0000320193.json`) return response(200, submissions(AAPL, { fiscalYearEnd: '0927', files: [{ name: 'CIK0000320193-submissions-001.json', filingFrom: '2020-01-01', filingTo: '2023-12-31' }] }));
  if (url === `${DATA}/submissions/CIK0000320193-submissions-001.json`) return response(200, block(AAPL.archive));
  if (url === `${DATA}/submissions/CIK0001046179.json`) return response(200, submissions(TSM));
  if (url === `${DATA}/submissions/CIK0001067983.json`) return response(200, submissions(BRKB));
  if (url === `${DATA}/submissions/CIK0000000999.json`) return response(200, submissions(NOFACTS));
  if (url === `${DATA}/submissions/CIK0000000500.json`) {
    state.flakyCalls++;
    return state.flakyCalls === 1 ? response(503, 'Service Unavailable', 'text') : response(200, submissions(FLAKY));
  }

  if (url === `${DATA}/submissions/CIK0000000777.json`) return response(200, submissions(LTD));
  if (url === `${DATA}/api/xbrl/companyfacts/CIK0000320193.json`) return response(200, AAPL_FACTS);
  if (url === `${DATA}/api/xbrl/companyfacts/CIK0000000777.json`) return response(200, LTD_FACTS);
  if (url === `${DATA}/api/xbrl/companyfacts/CIK0001046179.json`) return response(200, TSM_FACTS);
  if (url === `${DATA}/api/xbrl/companyfacts/CIK0000000999.json`) return response(404, 'Not Found', 'text');

  const m = url.match(/^https:\/\/www\.sec\.gov\/Archives\/edgar\/data\/(\d+)\/(\d+)\/([^/]+)$/);
  if (m) {
    if (m[3] === 'missing.htm') return response(404, 'Not Found', 'text');
    return response(200, filingHtml(m[3]), 'text');
  }
  return response(404, `no mock route for ${url}`, 'text');
}

/** Replace `global.fetch` with the double; every call is recorded (and appended to $EDGAR_MOCK_LOG). */
function install() {
  global.fetch = async function mockFetch(url, opts = {}) {
    const entry = { url: String(url), headers: opts.headers || {} };
    requests.push(entry);
    if (process.env.EDGAR_MOCK_LOG) fs.appendFileSync(process.env.EDGAR_MOCK_LOG, JSON.stringify(entry) + '\n');
    return route(String(url));
  };
  global.fetch.__edgarMock = true;
  return global.fetch;
}

/** Clear recorded requests and per-process state (the FLAKY first-call 503). */
function reset() { state.flakyCalls = 0; requests.length = 0; }

if (process.env.EDGAR_MOCK === '1') install();

module.exports = { install, reset, requests, route, filingHtml, AAPL, AAPL_FACTS, TSM, TICKERS, SEC, DATA };
