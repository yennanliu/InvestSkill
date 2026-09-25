#!/usr/bin/env node
/**
 * fetch-fundamentals.js — optional, keyless "bring your own data" helper.
 *
 * Builds a data pack (data/fixtures/<TICKER>.md) from the SEC's XBRL
 * companyfacts API: the latest fiscal year's income statement, balance sheet
 * and cash flow as *reported* in the 10-K, plus the prior year for growth. The
 * output is the same shape as data/fixtures/ZEPH.md, so it works both as a
 * paste-in data pack for any skill and as a fixture for scripts/eval-skills.js
 * (`--fixture AAPL`).
 *
 * Why this and not the PDF: the skills consume text and numbers. The XBRL facts
 * are the statements themselves, tagged by the company, with no PDF parsing —
 * and they are keyless. What XBRL cannot give you is the price: the pack leaves
 * a `price:` line for you to fill in from your broker or a quote page, and the
 * market-based checks (P/E, market cap) are only emitted once you do.
 *
 *   node scripts/fetch-fundamentals.js AAPL              # → data/fixtures/AAPL.md
 *   node scripts/fetch-fundamentals.js NVDA --fy 2025    # fiscal year ending in 2025
 *   node scripts/fetch-fundamentals.js MSFT --json       # also dump the extracted figures as JSON
 *   node scripts/fetch-fundamentals.js AAPL --stdout     # print the pack instead of writing it
 *
 * Coverage: US-GAAP filers only. ETFs have no statements; foreign private
 * issuers (TSM, GRAB, …) tag IFRS concepts, which this does not map — both are
 * reported as "no us-gaap facts", not as an error.
 *
 * Not part of the plugin, not run by `npm test`. Generated packs for real
 * tickers are git-ignored (only the fictional ZEPH fixture is committed) because
 * real numbers go stale. Set EDGAR_USER_AGENT="Your Name your@email".
 */
const fs = require('fs');
const path = require('path');
const edgar = require('./lib/edgar');

const ROOT = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const flag = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 && argv[i + 1] !== undefined && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const has = k => argv.includes(`--${k}`);
const VALUE_FLAGS = new Set(['--fy', '--out']);
const positional = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && VALUE_FLAGS.has(argv[i - 1])));

if (has('help') || positional.length === 0) {
  process.stdout.write(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 31).map(l => l.replace(/^ \*\/?\s?/, '')).join('\n') + '\n');
  process.exit(positional.length === 0 && !has('help') ? 1 : 0);
}

const ticker = positional[0].toUpperCase();
const wantFy = flag('fy');
const outDir = path.resolve(ROOT, flag('out', path.join('data', 'fixtures')));

// ── Concept chains (ordered; first concept carrying the period wins) ─────────
// Mirrors the chains proven on real filers in the finance_data project: tags
// drift within a company (Revenues → SalesRevenueNet → RevenueFromContract…),
// so a single tag loses years of history.
const DURATION = {
  revenue: ['RevenueFromContractWithCustomerExcludingAssessedTax', 'RevenueFromContractWithCustomerIncludingAssessedTax', 'Revenues', 'SalesRevenueNet', 'SalesRevenueGoodsNet'],
  cost_of_revenue: ['CostOfRevenue', 'CostOfGoodsAndServicesSold', 'CostOfGoodsSold', 'CostOfServices'],
  gross_profit: ['GrossProfit'],
  rnd_expense: ['ResearchAndDevelopmentExpense', 'ResearchAndDevelopmentExpenseExcludingAcquiredInProcessCost'],
  sga_expense: ['SellingGeneralAndAdministrativeExpense', 'GeneralAndAdministrativeExpense'],
  operating_income: ['OperatingIncomeLoss'],
  interest_expense: ['InterestExpense', 'InterestExpenseNonoperating', 'InterestExpenseDebt'],
  pretax_income: ['IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest', 'IncomeLossFromContinuingOperationsBeforeIncomeTaxesMinorityInterestAndIncomeLossFromEquityMethodInvestments'],
  income_tax: ['IncomeTaxExpenseBenefit'],
  net_income: ['NetIncomeLoss', 'ProfitLoss'],
  eps_diluted: ['EarningsPerShareDiluted', 'EarningsPerShareBasicAndDiluted'],
  shares_diluted: ['WeightedAverageNumberOfDilutedSharesOutstanding', 'WeightedAverageNumberOfSharesOutstandingBasicAndDiluted'],
  dep_amort: ['DepreciationDepletionAndAmortization', 'DepreciationAmortizationAndAccretionNet', 'DepreciationAndAmortization'],
  sbc: ['ShareBasedCompensation', 'AllocatedShareBasedCompensationExpense'],
  ocf: ['NetCashProvidedByUsedInOperatingActivities', 'NetCashProvidedByUsedInOperatingActivitiesContinuingOperations'],
  capex: ['PaymentsToAcquirePropertyPlantAndEquipment', 'PaymentsToAcquireProductiveAssets'],
  dividends_paid: ['PaymentsOfDividendsCommonStock', 'PaymentsOfDividends', 'PaymentsOfOrdinaryDividends'],
  buybacks: ['PaymentsForRepurchaseOfCommonStock'],
};
const INSTANT = {
  cash: ['CashAndCashEquivalentsAtCarryingValue', 'CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents'],
  short_term_investments: ['ShortTermInvestments', 'AvailableForSaleSecuritiesDebtSecuritiesCurrent', 'MarketableSecuritiesCurrent'],
  receivables: ['AccountsReceivableNetCurrent'],
  inventory: ['InventoryNet'],
  ppe_net: ['PropertyPlantAndEquipmentNet'],
  goodwill: ['Goodwill'],
  total_assets: ['Assets'],
  accounts_payable: ['AccountsPayableCurrent'],
  short_term_debt: ['LongTermDebtCurrent', 'DebtCurrent', 'ShortTermBorrowings', 'CommercialPaper'],
  long_term_debt: ['LongTermDebtNoncurrent', 'LongTermDebt'],
  total_liabilities: ['Liabilities'],
  total_equity: ['StockholdersEquity', 'StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest'],
};
const PER_SHARE = new Set(['eps_diluted']);
const SHARE_COUNTS = new Set(['shares_diluted']);
const ANNUAL_FORMS = ['10-K', '10-K/A', '10-KT', '20-F', '40-F'];
const PERIODIC_FORMS = ['10-K', '10-Q', '20-F', '40-F', '6-K', '8-K'];

const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
const isAnnualSpan = p => p.start && p.end && daysBetween(p.start, p.end) >= 350 && daysBetween(p.start, p.end) <= 380;

function unitFor(metric) { return PER_SHARE.has(metric) ? 'USD/shares' : SHARE_COUNTS.has(metric) ? 'shares' : 'USD'; }

/** All points for a metric's concept chain, tagged with their concept. */
function pointsFor(gaap, chain, unit) {
  const out = [];
  for (const concept of chain) {
    const pts = gaap[concept] && gaap[concept].units && gaap[concept].units[unit];
    if (pts) for (const p of pts) out.push({ ...p, concept });
  }
  return out;
}

/**
 * The authoritative point for one period: the filing in which the period *is*
 * the reporting period (closest filing after period end), preferring periodic
 * forms. Later filings repeat the period as a comparative and occasionally
 * mis-scale it, so "latest" is not "best".
 */
function original(points) {
  let best = null, bestScore = -Infinity;
  for (const p of points) {
    const periodic = PERIODIC_FORMS.some(f => (p.form || '').startsWith(f));
    const gap = daysBetween(p.end, p.filed);
    // periodic form first, then filed after the period end, then the smallest gap
    const score = (periodic ? 1e6 : 0) + (gap >= 0 ? 1e5 : 0) - Math.abs(gap);
    if (score > bestScore) { best = p; bestScore = score; }
  }
  return best;
}

function pick(gaap, metric, chain, end, { duration }) {
  const pts = pointsFor(gaap, chain, unitFor(metric)).filter(p => p.end === end && (!duration || isAnnualSpan(p)));
  // Respect chain order: the first concept with a point for this period wins.
  for (const concept of chain) {
    const mine = pts.filter(p => p.concept === concept);
    if (mine.length) return original(mine);
  }
  return null;
}

/** Fiscal-year ends, newest first, from annual revenue (or net income) facts filed on annual forms. */
function fiscalYearEnds(gaap) {
  const ends = new Map(); // end → {form, fy, filed}
  for (const chain of [DURATION.revenue, DURATION.net_income]) {
    for (const p of pointsFor(gaap, chain, 'USD')) {
      if (!isAnnualSpan(p) || !ANNUAL_FORMS.some(f => (p.form || '').startsWith(f))) continue;
      if (!ends.has(p.end) || p.filed < ends.get(p.end).filed) ends.set(p.end, { form: p.form, fy: p.fy, filed: p.filed, accn: p.accn });
    }
    if (ends.size) break;
  }
  return [...ends.entries()].map(([end, m]) => ({ end, ...m })).sort((a, b) => (a.end < b.end ? 1 : -1));
}

const M = v => (v === null || v === undefined ? null : Math.round(v / 1e6));
const fmtM = v => (v === null || v === undefined ? 'n/a' : Math.round(v / 1e6).toLocaleString('en-US'));
const fmtNeg = v => (v === null || v === undefined ? 'n/a' : `(${Math.abs(Math.round(v / 1e6)).toLocaleString('en-US')})`);
const pct = (a, b) => (a !== null && b ? `${((a / b) * 100).toFixed(1)}%` : 'n/a');

async function main() {
  process.stdout.write(`Looking up ${ticker} on SEC EDGAR…\n`);
  const company = await edgar.lookupCik(ticker);
  if (!company) { process.stderr.write(`  ✗ ticker '${ticker}' not found in EDGAR's company list\n`); process.exit(1); }
  process.stdout.write(`  CIK ${company.cik} — ${company.title}\n`);

  const facts = await edgar.fetchCompanyFacts(company.cik);
  const gaap = facts && facts.facts && facts.facts['us-gaap'];
  if (!gaap) {
    process.stdout.write(`  No us-gaap facts for ${ticker} — an ETF, or an IFRS (foreign) filer. Nothing to build.\n`);
    process.exit(0);
  }
  const dei = (facts.facts.dei) || {};
  const entity = facts.entityName || company.title;

  const fys = fiscalYearEnds(gaap);
  if (!fys.length) { process.stderr.write('  ✗ no annual periods found in the XBRL facts\n'); process.exit(1); }
  let idx = 0;
  if (wantFy) {
    idx = fys.findIndex(f => f.end.slice(0, 4) === String(wantFy) || String(f.fy) === String(wantFy));
    if (idx < 0) { process.stderr.write(`  ✗ no fiscal year ending in ${wantFy}; available: ${fys.slice(0, 8).map(f => f.end).join(', ')}\n`); process.exit(1); }
  }
  const cur = fys[idx], prior = fys[idx + 1] || null;
  process.stdout.write(`  Fiscal year: ${cur.end} (${cur.form}, filed ${cur.filed})${prior ? ` · prior ${prior.end}` : ''}\n`);

  const row = end => {
    const r = {};
    for (const [m, chain] of Object.entries(DURATION)) { const p = pick(gaap, m, chain, end, { duration: true }); r[m] = p ? p.val : null; }
    for (const [m, chain] of Object.entries(INSTANT)) { const p = pick(gaap, m, chain, end, { duration: false }); r[m] = p ? p.val : null; }
    if (r.gross_profit === null && r.revenue !== null && r.cost_of_revenue !== null) r.gross_profit = r.revenue - r.cost_of_revenue;
    r.fcf = r.ocf !== null && r.capex !== null ? r.ocf - r.capex : null;
    r.total_debt = r.long_term_debt !== null || r.short_term_debt !== null ? (r.long_term_debt || 0) + (r.short_term_debt || 0) : null;
    r.net_debt = r.total_debt !== null && r.cash !== null ? r.total_debt - r.cash : null;
    return r;
  };
  const c = row(cur.end), p = prior ? row(prior.end) : {};

  // Shares outstanding: the cover-page dei fact, most recent instant.
  let sharesOut = null;
  const so = dei.EntityCommonStockSharesOutstanding && dei.EntityCommonStockSharesOutstanding.units && dei.EntityCommonStockSharesOutstanding.units.shares;
  if (so && so.length) {
    // Several share classes may be tagged for the same date; sum them.
    const latest = so.reduce((a, b) => (a.end > b.end ? a : b)).end;
    sharesOut = { asOf: latest, value: so.filter(x => x.end === latest).reduce((s, x) => s + x.val, 0) };
  }

  const missing = Object.entries(c).filter(([, v]) => v === null).map(([k]) => k);
  const filingUrl = edgar.filingIndexUrl(company.cik, cur.accn);
  const factsUrl = `${edgar.DATA_URL}/api/xbrl/companyfacts/CIK${company.cik}.json`;
  const today = new Date().toISOString().slice(0, 10);
  const fyLabel = `FY${cur.fy || cur.end.slice(0, 4)}`;
  const priorLabel = prior ? `FY${prior.fy || prior.end.slice(0, 4)}` : 'prior';

  // ── front block ────────────────────────────────────────────────────────────
  const front = [];
  front.push(`# Data pack generated by scripts/fetch-fundamentals.js on ${today} from SEC XBRL companyfacts.`);
  front.push(`# Figures are as REPORTED in the ${cur.form} for the fiscal year ended ${cur.end} (accession ${cur.accn}).`);
  front.push(`# Regenerate after the next 10-K; do not commit — real numbers go stale.`);
  front.push(`ticker: ${ticker}`);
  front.push(`company: ${entity}`);
  front.push(`as_of: ${cur.end}`);
  front.push(`fiscal_year: ${fyLabel}`);
  front.push(`source_form: ${cur.form}`);
  front.push(`source_accession: ${cur.accn}`);
  front.push(`currency: USD millions unless stated`);
  front.push(`price:            # ← fill in the current quote (SEC data carries no price); enables the P/E and market-cap checks`);
  if (sharesOut) front.push(`shares_out_m: ${Math.round(sharesOut.value / 1e6)}   # cover-page count as of ${sharesOut.asOf}`);
  const num = (k, v, dp) => { if (v !== null && v !== undefined) front.push(`${k}: ${dp !== undefined ? Number(v).toFixed(dp) : M(v)}`); };
  num('revenue_m', c.revenue); num('revenue_prior_m', p.revenue);
  num('gross_profit_m', c.gross_profit); num('operating_income_m', c.operating_income); num('net_income_m', c.net_income);
  if (c.eps_diluted !== null) front.push(`eps: ${Number(c.eps_diluted).toFixed(2)}`);
  num('ocf_m', c.ocf); num('capex_m', c.capex); num('fcf_m', c.fcf);
  num('cash_m', c.cash); num('total_debt_m', c.total_debt); num('net_debt_m', c.net_debt);
  num('dividends_paid_m', c.dividends_paid); num('buybacks_m', c.buybacks);
  front.push('expect:');
  front.push('  # label | regex the number must appear near | expected value | unit (m = $ millions, x = multiple, pct = percent) | tolerance');
  if (c.fcf !== null) front.push(`  - { label: "FCF = OCF − capex",          near: "free cash flow|\\\\bFCF\\\\b",              value: ${M(c.fcf)},   unit: m,   tol: 0.02 }`);
  if (c.net_debt !== null) front.push(`  - { label: "Net debt = debt − cash",     near: "net debt|net cash",                    value: ${Math.abs(M(c.net_debt))},   unit: m,   tol: 0.02 }`);
  if (c.revenue !== null && p.revenue) front.push(`  - { label: "Revenue growth",             near: "revenue growth|revenue grew|YoY",     value: ${((c.revenue / p.revenue - 1) * 100).toFixed(1)},  unit: pct, tol: 0.05 }`);
  if (c.dividends_paid !== null && c.fcf) front.push(`  - { label: "FCF payout (div ÷ FCF)",     near: "payout",                               value: ${((c.dividends_paid / c.fcf) * 100).toFixed(1)},  unit: pct, tol: 0.08 }`);
  if (c.gross_profit !== null && c.revenue) front.push(`  - { label: "Gross margin",               near: "gross margin",                         value: ${((c.gross_profit / c.revenue) * 100).toFixed(1)},  unit: pct, tol: 0.03 }`);

  // ── body ───────────────────────────────────────────────────────────────────
  const b = [];
  b.push(`# ${entity} (${ticker}) — data pack, fiscal year ended ${cur.end}`);
  b.push('');
  b.push(`> **Source: SEC EDGAR, as reported.** Every figure below is the company's own XBRL-tagged value from its ${cur.form} for the fiscal year ended ${cur.end} (filed ${cur.filed}, accession ${cur.accn}); the ${priorLabel} column is the prior year's annual filing. Retrieved ${today} via the SEC companyfacts API — no vendor, no estimate, no adjustment. Treat this pack as data pasted by the user (\`Retrieval: pasted by user\`). It contains **no market price**: fill in the price and date before computing P/E, market cap, EV or yield, or say they are unavailable.`);
  b.push('');
  b.push('## Data & Sources (copy into the analysis header)');
  b.push('');
  b.push('```');
  b.push('Data & Sources');
  b.push(`  As of:      ${cur.end} (fiscal year end)${sharesOut ? ` · shares as of ${sharesOut.asOf}` : ''}`);
  b.push(`  Source:     SEC EDGAR ${cur.form} ${fyLabel} (accession ${cur.accn}) · XBRL companyfacts`);
  b.push('  Retrieval:  pasted by user (scripts/fetch-fundamentals.js)');
  b.push('  Confidence: HIGH for reported figures · price not included');
  b.push('```');
  b.push('');
  b.push('## Market data');
  b.push('');
  b.push('| Item | Value |');
  b.push('|------|-------|');
  b.push('| Price | *paste the current quote and its date* |');
  b.push(`| Shares outstanding (cover page, ${sharesOut ? sharesOut.asOf : 'n/a'}) | ${sharesOut ? `${(sharesOut.value / 1e6).toLocaleString('en-US', { maximumFractionDigits: 0 })} M` : 'n/a'} |`);
  b.push(`| Diluted weighted-average shares (${fyLabel}) | ${c.shares_diluted !== null ? `${(c.shares_diluted / 1e6).toLocaleString('en-US', { maximumFractionDigits: 0 })} M` : 'n/a'} |`);
  b.push(`| Industry (SIC) | ${facts.sic ? `${facts.sic} — ${facts.sicDescription || ''}` : 'see filing cover page'} |`);
  b.push('');
  b.push(`## Income statement — fiscal years ended ${cur.end}${prior ? ` and ${prior.end}` : ''} ($ M)`);
  b.push('');
  b.push(`| Line | ${fyLabel} | ${priorLabel} |`);
  b.push('|------|------|------|');
  const is = [
    ['Revenue', 'revenue'], ['Cost of revenue', 'cost_of_revenue'], ['Gross profit', 'gross_profit'],
    ['R&D', 'rnd_expense'], ['SG&A', 'sga_expense'], ['Operating income', 'operating_income'],
    ['Interest expense', 'interest_expense'], ['Pre-tax income', 'pretax_income'], ['Income tax', 'income_tax'],
    ['Net income', 'net_income'],
  ];
  for (const [label, k] of is) b.push(`| ${label} | ${fmtM(c[k])} | ${fmtM(p[k])} |`);
  b.push(`| Diluted EPS | ${c.eps_diluted !== null ? `$${Number(c.eps_diluted).toFixed(2)}` : 'n/a'} | ${p.eps_diluted !== null && p.eps_diluted !== undefined ? `$${Number(p.eps_diluted).toFixed(2)}` : 'n/a'} |`);
  b.push(`| Diluted shares (M) | ${c.shares_diluted !== null ? Math.round(c.shares_diluted / 1e6).toLocaleString('en-US') : 'n/a'} | ${p.shares_diluted !== null && p.shares_diluted !== undefined ? Math.round(p.shares_diluted / 1e6).toLocaleString('en-US') : 'n/a'} |`);
  b.push(`| Gross margin | ${pct(c.gross_profit, c.revenue)} | ${pct(p.gross_profit, p.revenue)} |`);
  b.push(`| Operating margin | ${pct(c.operating_income, c.revenue)} | ${pct(p.operating_income, p.revenue)} |`);
  b.push(`| Net margin | ${pct(c.net_income, c.revenue)} | ${pct(p.net_income, p.revenue)} |`);
  b.push('');
  b.push(`## Balance sheet — ${cur.end} ($ M)`);
  b.push('');
  b.push(`| Line | ${cur.end} | ${prior ? prior.end : 'prior'} |`);
  b.push('|------|------|------|');
  const bs = [
    ['Cash & equivalents', 'cash'], ['Short-term investments', 'short_term_investments'], ['Accounts receivable', 'receivables'],
    ['Inventory', 'inventory'], ['PP&E, net', 'ppe_net'], ['Goodwill', 'goodwill'], ['Total assets', 'total_assets'],
    ['Accounts payable', 'accounts_payable'], ['Short-term debt / current portion', 'short_term_debt'], ['Long-term debt', 'long_term_debt'],
    ['Total debt', 'total_debt'], ['Total liabilities', 'total_liabilities'], ["Shareholders' equity", 'total_equity'], ['Net debt (cash)', 'net_debt'],
  ];
  for (const [label, k] of bs) b.push(`| ${label} | ${fmtM(c[k])} | ${fmtM(p[k])} |`);
  b.push('');
  b.push(`## Cash flow — ${fyLabel} ($ M)`);
  b.push('');
  b.push(`| Line | ${fyLabel} | ${priorLabel} |`);
  b.push('|------|------|------|');
  b.push(`| Operating cash flow | ${fmtM(c.ocf)} | ${fmtM(p.ocf)} |`);
  b.push(`| Capital expenditures | ${fmtNeg(c.capex)} | ${fmtNeg(p.capex)} |`);
  b.push(`| Free cash flow (OCF − capex) | ${fmtM(c.fcf)} | ${fmtM(p.fcf)} |`);
  b.push(`| Depreciation & amortization | ${fmtM(c.dep_amort)} | ${fmtM(p.dep_amort)} |`);
  b.push(`| Stock-based compensation | ${fmtM(c.sbc)} | ${fmtM(p.sbc)} |`);
  b.push(`| Dividends paid | ${fmtNeg(c.dividends_paid)} | ${fmtNeg(p.dividends_paid)} |`);
  b.push(`| Share repurchases | ${fmtNeg(c.buybacks)} | ${fmtNeg(p.buybacks)} |`);
  b.push('');
  b.push('## Notes');
  b.push('');
  b.push('- Figures are US-GAAP as tagged by the company; "n/a" means the company did not tag that concept for the period (it may still appear in the filing under a different line).');
  b.push('- Gross profit is the tagged value where available, otherwise revenue − cost of revenue. Total debt = current + non-current debt as tagged; leases are excluded unless the company tags them as debt.');
  b.push('- Derived lines (FCF, net debt, margins) are arithmetic on reported figures, shown so the analysis can be reconciled.');
  if (missing.length) b.push(`- Not tagged for ${fyLabel}: ${missing.join(', ')}.`);
  b.push('');
  b.push('## References');
  b.push('');
  b.push(`1. ${cur.form} for the fiscal year ended ${cur.end}, filed ${cur.filed} — ${filingUrl}`);
  if (prior) b.push(`2. ${prior.form} for the fiscal year ended ${prior.end}, filed ${prior.filed} — ${edgar.filingIndexUrl(company.cik, prior.accn)}`);
  b.push(`${prior ? 3 : 2}. SEC XBRL company facts — ${factsUrl}`);
  b.push(`${prior ? 4 : 3}. Full filing text: \`node scripts/fetch-edgar.js ${ticker} --form ${cur.form.startsWith('20-F') ? '20-F' : '10-K'}\``);

  const pack = `---\n${front.join('\n')}\n---\n\n${b.join('\n')}\n`;

  if (has('stdout')) { process.stdout.write(pack); return; }
  edgar.ensureDir(outDir);
  const file = path.join(outDir, `${ticker}.md`);
  fs.writeFileSync(file, pack);
  process.stdout.write(`  ✓ ${path.relative(ROOT, file)} (${fyLabel}: revenue ${fmtM(c.revenue)} M · net income ${fmtM(c.net_income)} M · FCF ${fmtM(c.fcf)} M)\n`);
  if (has('json')) {
    const jf = path.join(outDir, `${ticker}.json`);
    fs.writeFileSync(jf, JSON.stringify({ ticker, entity, cik: company.cik, fiscal_year_end: cur.end, current: c, prior: p, shares_outstanding: sharesOut, filing: cur }, null, 2) + '\n');
    process.stdout.write(`  ✓ ${path.relative(ROOT, jf)}\n`);
  }
  if (missing.length) process.stdout.write(`  ⚠ not tagged: ${missing.join(', ')}\n`);
  process.stdout.write(`Next: add the current price to \`price:\`, then paste the pack into a skill — or run \`node scripts/eval-skills.js --fixture ${ticker}\`.\n`);
}

main().catch(err => {
  if (err instanceof edgar.HttpError && err.status === 403) {
    process.stderr.write('✗ EDGAR refused the request (HTTP 403). Set EDGAR_USER_AGENT="Your Name your@email".\n');
  } else {
    process.stderr.write(`✗ ${err.message}\n`);
  }
  process.exit(1);
});
