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
/** Value of `--<k>` from argv, or `d` when absent. */
const flag = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 && argv[i + 1] !== undefined && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
/** True when the boolean flag `--<k>` is present. */
const has = k => argv.includes(`--${k}`);
const VALUE_FLAGS = new Set(['--fy', '--out']);
/**
 * Progress output. With --stdout the pack itself is the only thing on stdout, so
 * progress goes to stderr and `--stdout > file` yields a parseable fixture.
 */
const log = s => (has('stdout') ? process.stderr : process.stdout).write(s);
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
  sga_expense: ['SellingGeneralAndAdministrativeExpense'],
  // When SG&A isn't tagged as one line it is rebuilt from these two (META, MSFT tag
  // marketing and G&A separately); G&A alone is never presented as SG&A.
  selling_expense: ['SellingAndMarketingExpense', 'SellingExpense'],
  ga_expense: ['GeneralAndAdministrativeExpense'],
  operating_income: ['OperatingIncomeLoss'],
  interest_expense: ['InterestExpense', 'InterestExpenseNonoperating', 'InterestExpenseDebt'],
  pretax_income: ['IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest', 'IncomeLossFromContinuingOperationsBeforeIncomeTaxesMinorityInterestAndIncomeLossFromEquityMethodInvestments'],
  income_tax: ['IncomeTaxExpenseBenefit'],
  net_income: ['NetIncomeLoss', 'ProfitLoss'],
  eps_diluted: ['EarningsPerShareDiluted', 'EarningsPerShareBasicAndDiluted'],
  shares_diluted: ['WeightedAverageNumberOfDilutedSharesOutstanding', 'WeightedAverageNumberOfSharesOutstandingBasicAndDiluted'],
  dep_amort: ['DepreciationDepletionAndAmortization', 'DepreciationAmortizationAndAccretionNet', 'DepreciationAndAmortization'],
  sbc: ['ShareBasedCompensation', 'AllocatedShareBasedCompensationExpense'],
  // Continuing operations first, so FCF excludes cash from businesses being sold
  // (AMD FY2025: 6,493 continuing vs 7,709 total). ocf_total is kept for the note.
  ocf: ['NetCashProvidedByUsedInOperatingActivitiesContinuingOperations', 'NetCashProvidedByUsedInOperatingActivities'],
  ocf_total: ['NetCashProvidedByUsedInOperatingActivities'],
  capex: ['PaymentsToAcquirePropertyPlantAndEquipment', 'PaymentsToAcquireProductiveAssets'],
  dividends_paid: ['PaymentsOfDividendsCommonStock', 'PaymentsOfDividends', 'PaymentsOfOrdinaryDividends'],
  buybacks: ['PaymentsForRepurchaseOfCommonStock'],
};
const INSTANT = {
  cash: ['CashAndCashEquivalentsAtCarryingValue', 'CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents'],
  // Last resort: all available-for-sale debt securities (NVDA tags nothing narrower);
  // the Notes say so, since that total can include non-current holdings.
  short_term_investments: ['ShortTermInvestments', 'AvailableForSaleSecuritiesDebtSecuritiesCurrent', 'MarketableSecuritiesCurrent', 'AvailableForSaleSecuritiesDebtSecurities'],
  receivables: ['AccountsReceivableNetCurrent'],
  inventory: ['InventoryNet'],
  ppe_net: ['PropertyPlantAndEquipmentNet'],
  goodwill: ['Goodwill'],
  total_assets: ['Assets'],
  accounts_payable: ['AccountsPayableCurrent'],
  short_term_debt: ['LongTermDebtCurrent', 'DebtCurrent', 'ShortTermBorrowings', 'CommercialPaper', 'ConvertibleNotesPayableCurrent', 'ConvertibleDebtCurrent'],
  long_term_debt: ['LongTermDebtNoncurrent', 'ConvertibleDebtNoncurrent'],
  // Total debt including current maturities. Some filers tag part of their debt
  // only here — RKLB's convertible notes sit in LongTermDebt ($152M) while
  // LongTermDebtNoncurrent carries just a $2M term loan — so it is read
  // alongside the current/non-current split, not as a fallback after it.
  long_term_debt_total: ['LongTermDebt', 'ConvertibleNotesPayable'],
  // Read only to flag borrowings that are tagged but not in total debt (AAPL's
  // commercial paper). Not added: filers also tag the same amount as
  // LongTermDebtCurrent *and* ShortTermBorrowings (AMD), which would double count.
  short_borrowings: ['ShortTermBorrowings'],
  commercial_paper: ['CommercialPaper'],
  total_liabilities: ['Liabilities'],
  total_equity: ['StockholdersEquity', 'StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest'],
};
// Short-term borrowings the `short_term_debt` chain can land on that are NOT
// current maturities of long-term debt, so `LongTermDebt` does not contain them.
const OUTSIDE_LONG_TERM_DEBT = new Set(['ShortTermBorrowings', 'CommercialPaper']);
const PER_SHARE = new Set(['eps_diluted']);
const SHARE_COUNTS = new Set(['shares_diluted']);
const ANNUAL_FORMS = ['10-K', '10-K/A', '10-KT', '20-F', '40-F'];
const PERIODIC_FORMS = ['10-K', '10-Q', '20-F', '40-F', '6-K', '8-K'];

/** Whole days from ISO date `a` to ISO date `b`. */
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
/** True when a duration fact covers one fiscal year (350 to 380 days). */
const isAnnualSpan = p => p.start && p.end && daysBetween(p.start, p.end) >= 350 && daysBetween(p.start, p.end) <= 380;

/** XBRL unit key a metric is reported in: USD, USD/shares (per-share), or shares (counts). */
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

/**
 * The reported value of `metric` for the period ending `end`. When the period's own
 * annual filing (`accn`) tags any concept in the chain, its figure is used — the pack
 * says its numbers are that filing's, and an earnings 8-K filed a few days earlier
 * would otherwise win on proximity. Failing that, the first concept in the chain that
 * has a point for the period wins, and within it the original filing.
 * Duration metrics are restricted to one-year spans; instants match on `end` alone.
 * @returns {object|null} the fact point, or null when the company never tagged it
 */
function pick(gaap, metric, chain, end, { duration, accn }) {
  const pts = pointsFor(gaap, chain, unitFor(metric)).filter(p => p.end === end && (!duration || isAnnualSpan(p)));
  for (const concept of chain) {
    const own = pts.find(p => p.concept === concept && p.accn === accn);
    if (own) return own;
  }
  // Respect chain order: the first concept with a point for this period wins.
  for (const concept of chain) {
    const mine = pts.filter(p => p.concept === concept);
    if (mine.length) return original(mine);
  }
  return null;
}

/**
 * What the filing `accn` itself reports for the period ending `end` — i.e. its
 * comparative column when `end` is an earlier year — or null. `concepts` is tried
 * in order and the first one the filing tags for that period wins.
 */
function inFiling(gaap, metric, concepts, end, accn, duration) {
  const pts = pointsFor(gaap, concepts, unitFor(metric)).filter(p => p.end === end && p.accn === accn && (!duration || isAnnualSpan(p)));
  for (const concept of concepts) {
    const hit = pts.find(p => p.concept === concept);
    if (hit) return hit.val;
  }
  return null;
}

/**
 * Fiscal-year ends, newest first, from annual revenue AND net income facts filed on
 * annual forms. Both are read: a filer that moves its revenue to a tag outside the
 * chain would otherwise be stuck on the last year the old tag carried.
 */
function fiscalYearEnds(gaap) {
  const ends = new Map(); // end → {form, fy, filed}
  for (const chain of [DURATION.revenue, DURATION.net_income]) {
    for (const p of pointsFor(gaap, chain, 'USD')) {
      if (!isAnnualSpan(p) || !ANNUAL_FORMS.some(f => (p.form || '').startsWith(f))) continue;
      if (!ends.has(p.end) || p.filed < ends.get(p.end).filed) ends.set(p.end, { form: p.form, fy: p.fy, filed: p.filed, accn: p.accn });
    }
  }
  return [...ends.entries()].map(([end, m]) => ({ end, ...m })).sort((a, b) => (a.end < b.end ? 1 : -1));
}

/**
 * Total debt from the tagged facts, and a note saying how it was built.
 * Two routes: the current + non-current split, and the `LongTermDebt` total
 * (which already includes current maturities, so the current portion is never
 * added to it). When both exist and the total is more than 5% larger, the split
 * missed debt tagged only in the total (convertible notes, typically) and the
 * total wins; otherwise the split is kept. `long_term_debt` is restated so the
 * table's current + long-term lines still sum to the total.
 * The "current" line can instead be short-term borrowings or commercial paper
 * (the chain falls through to them when no current maturities are tagged). Those
 * are never part of `LongTermDebt`, so they are added to it, not subtracted from it.
 * @returns {{total_debt: number|null, long_term_debt: number|null, total_debt_note: string, debt_notes: string[]}}
 */
function totalDebt(r, concept) {
  const cur = r.short_term_debt, nonCur = r.long_term_debt, tagged = r.long_term_debt_total;
  // Current maturities sit inside LongTermDebt; short-term borrowings do not.
  const isBorrowing = OUTSIDE_LONG_TERM_DEBT.has(concept.short_term_debt);
  const inside = isBorrowing ? 0 : (cur || 0), outside = isBorrowing ? (cur || 0) : 0;
  const split = nonCur !== null ? nonCur + inside : null; // long-term debt incl. current maturities
  const plus = outside ? ` plus \`${concept.short_term_debt}\` (${fmtM(outside)}M, not part of long-term debt)` : '';
  const notes = [];
  let total = null, longTerm = nonCur, how;
  if (split !== null && tagged !== null && tagged > split * 1.05) {
    total = tagged + outside; longTerm = tagged - inside;
    how = `tagged \`${concept.long_term_debt_total}\` (already includes current maturities)${plus}, used because it exceeds current + non-current as tagged`;
    notes.push(`Total debt uses \`${concept.long_term_debt_total}\` (${fmtM(tagged)}M) rather than \`${concept.long_term_debt}\` + current (${fmtM(split)}M): the gap is debt tagged only in the total, often convertible notes. Check the debt note in the filing.`);
  } else if (split !== null) {
    total = split + outside; how = 'current + non-current debt as tagged';
  } else if (tagged !== null) {
    total = tagged + outside; longTerm = tagged - inside;
    how = `tagged \`${concept.long_term_debt_total}\` (already includes current maturities)${plus}${plus ? '' : ', used as is'}`;
  } else if (cur !== null) {
    total = cur; how = 'current debt only (no long-term debt tagged)';
  } else {
    how = 'no debt tagged';
  }
  for (const [k, label] of [['commercial_paper', 'Commercial paper'], ['short_borrowings', 'Short-term borrowings']]) {
    if (r[k] !== null && r[k] !== undefined && r[k] !== cur) notes.push(`${label} of ${fmtM(r[k])}M is tagged but not included in total debt; add it if the analysis needs gross borrowings.`);
  }
  return { total_debt: total, long_term_debt: longTerm, total_debt_note: how, debt_notes: notes };
}

/**
 * Where the share count comes from. EDGAR's companyfacts carries the cover-page count
 * when tagged for the entire entity. The newest is often a later 10-Q, so the
 * label names the filing rather than implying it is the annual report's cover.
 */
function sharesLabel(so, fy) {
  const later = so.filed > fy.filed ? ` (later than the ${fy.form})` : '';
  return `cover page of the ${so.form} filed ${so.filed}${later}, as of ${so.asOf}`;
}

/** Dollars -> whole millions (null passes through). */
const M = v => (v === null || v === undefined ? null : Math.round(v / 1e6));
/** Dollars -> "1,234" millions for a table cell, or "n/a". */
const fmtM = v => (v === null || v === undefined ? 'n/a' : Math.round(v / 1e6).toLocaleString('en-US'));
/** Dollars -> "(1,234)" millions for an outflow cell, or "n/a". */
const fmtNeg = v => (v === null || v === undefined ? 'n/a' : `(${Math.abs(Math.round(v / 1e6)).toLocaleString('en-US')})`);
/**
 * Share count -> millions. Whole millions from 100M up; three decimals below, so a
 * company with 2.9M shares is not rounded to 3 (or one with 0.4M to 0).
 */
const sharesM = v => (v >= 1e8 ? Math.round(v / 1e6) : Number((v / 1e6).toFixed(3)));
/** Share count -> "1,234" / "2.912" millions for a table cell, or "n/a". */
const fmtShares = v => (v === null || v === undefined ? 'n/a' : (v / 1e6).toLocaleString('en-US', { maximumFractionDigits: v >= 1e8 ? 0 : 3 }));
/** `a / b` as a "12.3%" string, or "n/a" when either side is missing. */
const pct = (a, b) => (a !== null && b ? `${((a / b) * 100).toFixed(1)}%` : 'n/a');

/**
 * CLI entry: resolve the ticker, fetch its XBRL company facts, pick the fiscal year
 * (latest or `--fy`), extract current and prior-year statements, derive FCF / debt /
 * margins, and write the ZEPH-shaped data pack (or print it with `--stdout`).
 * Non-GAAP filers and 404s exit 0 with an explanation; unknown tickers exit 1.
 */
async function main() {
  log(`Looking up ${ticker} on SEC EDGAR…\n`);
  const company = await edgar.lookupCik(ticker);
  if (!company) { process.stderr.write(`  ✗ ticker '${ticker}' not found in EDGAR's company list\n`); process.exit(1); }
  log(`  CIK ${company.cik} — ${company.title}\n`);

  const facts = await edgar.fetchCompanyFacts(company.cik);
  const gaap = facts && facts.facts && facts.facts['us-gaap'];
  if (!gaap) {
    log(`  No us-gaap facts for ${ticker} — an ETF, or an IFRS (foreign) filer. Nothing to build.\n`);
    process.exit(0);
  }
  const dei = (facts.facts.dei) || {};
  const entity = facts.entityName || company.title;
  // SIC lives in the submissions index, not in companyfacts.
  const profile = await edgar.fetchCompanyProfile(company.cik);

  const fys = fiscalYearEnds(gaap);
  if (!fys.length) { process.stderr.write('  ✗ no annual periods found in the XBRL facts\n'); process.exit(1); }
  let idx = 0;
  if (wantFy) {
    idx = fys.findIndex(f => f.end.slice(0, 4) === String(wantFy) || String(f.fy) === String(wantFy));
    if (idx < 0) { process.stderr.write(`  ✗ no fiscal year ending in ${wantFy}; available: ${fys.slice(0, 8).map(f => f.end).join(', ')}\n`); process.exit(1); }
  }
  const cur = fys[idx], prior = fys[idx + 1] || null;
  log(`  Fiscal year: ${cur.end} (${cur.form}, filed ${cur.filed})${prior ? ` · prior ${prior.end}` : ''}\n`);
  const today = edgar.today();
  // The next 10-K is due within ~15 months of a fiscal year end; past 16, the "latest" year is suspect.
  const stale = !wantFy && daysBetween(cur.end, today) > 485;
  if (stale) log(`  ⚠ latest annual period ended ${cur.end} — more than 16 months ago; check EDGAR for a newer filing\n`);

  const sources = {}; // period end → metric → the fact point it was read from
  const row = ({ end, accn }) => {
    const r = {}, concept = {}, src = sources[end] = {};
    for (const [m, chain] of Object.entries(DURATION)) { const p = pick(gaap, m, chain, end, { duration: true, accn }); r[m] = p ? p.val : null; concept[m] = p ? p.concept : null; src[m] = p; }
    for (const [m, chain] of Object.entries(INSTANT)) { const p = pick(gaap, m, chain, end, { duration: false, accn }); r[m] = p ? p.val : null; concept[m] = p ? p.concept : null; src[m] = p; }
    if (r.gross_profit === null && r.revenue !== null && r.cost_of_revenue !== null) r.gross_profit = r.revenue - r.cost_of_revenue;
    r.fcf = r.ocf !== null && r.capex !== null ? r.ocf - r.capex : null;
    r.notes = [];
    if (r.sga_expense === null && r.selling_expense !== null && r.ga_expense !== null) {
      r.sga_expense = r.selling_expense + r.ga_expense;
      r.notes.push(`SG&A = selling & marketing (${fmtM(r.selling_expense)}M) + G&A (${fmtM(r.ga_expense)}M), tagged as separate lines.`);
    } else if (r.sga_expense === null && r.ga_expense !== null) {
      r.notes.push('SG&A is not tagged as one line and no selling or marketing expense is tagged, so only G&A is shown; selling costs may sit elsewhere in operating expenses.');
    }
    if (concept.ocf === 'NetCashProvidedByUsedInOperatingActivitiesContinuingOperations' && r.ocf_total !== null && r.ocf_total !== r.ocf) {
      r.notes.push(`Operating cash flow and FCF are from continuing operations (${fmtM(r.ocf)}M); total operating cash flow including discontinued operations was ${fmtM(r.ocf_total)}M.`);
    }
    if (concept.short_term_investments === 'AvailableForSaleSecuritiesDebtSecurities') {
      r.notes.push('Short-term investments = all available-for-sale debt securities (no narrower tag); this can include non-current holdings.');
    }
    Object.assign(r, totalDebt(r, concept));
    r.net_debt = r.total_debt !== null && r.cash !== null ? r.total_debt - r.cash : null;
    // Most analyses count marketable securities as cash; give that view too.
    r.net_debt_incl_sti = r.net_debt !== null && r.short_term_investments !== null ? r.net_debt - r.short_term_investments : null;
    return r;
  };
  const c = row(cur), p = prior ? row(prior) : {};

  // Shares outstanding: the cover-page dei fact, most recent instant.
  let sharesOut = null;
  const so = dei.EntityCommonStockSharesOutstanding && dei.EntityCommonStockSharesOutstanding.units && dei.EntityCommonStockSharesOutstanding.units.shares;
  // A cover-page instant predating this reporting period cannot supply its
  // outstanding shares. companyfacts omits dimensional share-class facts, so
  // its latest available point can be years older than the selected annual data.
  const currentShares = (so || []).filter(x => x.end >= cur.end);
  if (currentShares.length) {
    // Sum same-date facts within one filing; other filings can repeat them.
    const latest = currentShares.reduce((a, b) => (a.end > b.end ? a : b)).end;
    const pts = currentShares.filter(x => x.end === latest);
    const filing = original(pts);
    const selected = pts.filter(x => x.accn === filing.accn);
    sharesOut = { asOf: latest, value: selected.reduce((s, x) => s + x.val, 0), form: filing.form, filed: filing.filed };
  }

  // Helper facts read only to build or annotate total debt aren't line items.
  const HELPERS = new Set(['long_term_debt_total', 'short_borrowings', 'commercial_paper', 'selling_expense', 'ga_expense', 'ocf_total', 'net_debt_incl_sti']);
  const missing = Object.entries(c).filter(([k, v]) => v === null && !HELPERS.has(k)).map(([k]) => k);
  const filingUrl = edgar.filingIndexUrl(company.cik, cur.accn);
  const factsUrl = `${edgar.DATA_URL}/api/xbrl/companyfacts/CIK${company.cik}.json`;
  const fyLabel = `FY${cur.fy || cur.end.slice(0, 4)}`;
  // A first 10-K carries both years, so the prior year's `fy` is the current one's: don't label both columns alike.
  const priorSame = !!prior && prior.accn === cur.accn;
  let priorLabel = prior ? `FY${prior.fy || prior.end.slice(0, 4)}` : 'prior';
  if (prior && priorLabel === fyLabel) priorLabel = `FY${cur.fy ? Number(cur.fy) - 1 : prior.end.slice(0, 4)}`;

  // Prior year vs. the current filing's comparative column. The prior year is read as
  // first reported (a later comparative is occasionally mis-scaled), but per-share and
  // share-count lines must share one share basis with the current year, so after a split
  // they come from the comparative column. Other lines that differ are named, not replaced.
  const restated = [], recast = [];
  if (prior && !priorSame) {
    for (const [m, chain] of [...Object.entries(DURATION), ...Object.entries(INSTANT)]) {
      const first = sources[prior.end][m];
      if (!first || HELPERS.has(m)) continue;
      const perShareLine = PER_SHARE.has(m) || SHARE_COUNTS.has(m);
      // Per-share lines: any concept in the chain, since a filer can switch tags between
      // filings (EarningsPerShareDiluted → …BasicAndDiluted) and the chain's concepts are
      // interchangeable there. Monetary lines: the same concept only — a different revenue
      // or debt tag can be a different amount, which is not a restatement.
      const concepts = perShareLine ? [first.concept, ...chain.filter(x => x !== first.concept)] : [first.concept];
      const now = inFiling(gaap, m, concepts, prior.end, cur.accn, m in DURATION);
      if (now === null || now === first.val) continue;
      if (perShareLine) { restated.push({ m, first: first.val, now }); p[m] = now; }
      else if (Math.abs(now - first.val) > Math.abs(first.val) * 0.005) recast.push({ m, first: first.val, now });
    }
  }
  const revenueRecast = recast.some(x => x.m === 'revenue');
  // Current-year lines the annual filing itself did not tag, split by filing date: a
  // later filing may have restated the figure; an earlier one (an earnings 8-K) has not.
  const elsewhere = Object.entries(sources[cur.end]).filter(([m, s]) => s && s.accn !== cur.accn && !HELPERS.has(m)).map(([m, s]) => ({ m, ...s }));
  const late = elsewhere.filter(x => x.filed > cur.filed), early = elsewhere.filter(x => x.filed <= cur.filed);

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
  front.push('# price: fill in the current quote and its date — SEC data carries no price; it enables the P/E and market-cap checks');
  front.push('price:');
  // Comments go on their own line: the eval-skills.js front-block parser keeps a
  // trailing "# …" numeric value as a string.
  if (sharesOut) { front.push(`# shares_out_m: ${sharesLabel(sharesOut, cur)}`); front.push(`shares_out_m: ${sharesM(sharesOut.value)}`); }
  const num = (k, v, dp) => { if (v !== null && v !== undefined) front.push(`${k}: ${dp !== undefined ? Number(v).toFixed(dp) : M(v)}`); };
  num('revenue_m', c.revenue); num('revenue_prior_m', p.revenue);
  num('gross_profit_m', c.gross_profit); num('operating_income_m', c.operating_income); num('net_income_m', c.net_income);
  if (c.eps_diluted !== null) front.push(`eps: ${Number(c.eps_diluted).toFixed(2)}`);
  num('ocf_m', c.ocf); num('capex_m', c.capex); num('fcf_m', c.fcf);
  num('cash_m', c.cash); num('total_debt_m', c.total_debt); num('net_debt_m', c.net_debt);
  num('short_term_investments_m', c.short_term_investments); num('net_debt_incl_investments_m', c.net_debt_incl_sti);
  num('dividends_paid_m', c.dividends_paid); num('buybacks_m', c.buybacks);
  front.push('expect:');
  front.push('  # label | regex the number must appear near | expected value | unit (m = $ millions, x = multiple, pct = percent) | tolerance');
  if (c.fcf !== null) front.push(`  - { label: "FCF = OCF − capex",          near: "free cash flow|\\\\bFCF\\\\b",              value: ${M(c.fcf)},   unit: m,   tol: 0.02 }`);
  if (c.net_debt !== null) front.push(`  - { label: "Net debt = debt − cash",     near: "net debt|net cash",                    value: ${Math.abs(M(c.net_debt))},   unit: m,   tol: 0.02 }`);
  if (c.revenue !== null && p.revenue && !revenueRecast) front.push(`  - { label: "Revenue growth",             near: "revenue growth|revenue grew|YoY",     value: ${((c.revenue / p.revenue - 1) * 100).toFixed(1)},  unit: pct, tol: 0.05 }`);
  if (c.dividends_paid !== null && c.fcf) front.push(`  - { label: "FCF payout (div ÷ FCF)",     near: "payout",                               value: ${((c.dividends_paid / c.fcf) * 100).toFixed(1)},  unit: pct, tol: 0.08 }`);
  if (c.gross_profit !== null && c.revenue) front.push(`  - { label: "Gross margin",               near: "gross margin",                         value: ${((c.gross_profit / c.revenue) * 100).toFixed(1)},  unit: pct, tol: 0.03 }`);

  // ── body ───────────────────────────────────────────────────────────────────
  const b = [];
  b.push(`# ${entity} (${ticker}) — data pack, fiscal year ended ${cur.end}`);
  b.push('');
  b.push(`> **Source: SEC EDGAR, as reported.** Every figure below is the company's own XBRL-tagged value from its ${cur.form} for the fiscal year ended ${cur.end} (filed ${cur.filed}, accession ${cur.accn})${elsewhere.length ? ', except the lines the Notes list as read from another filing' : ''}; the ${priorLabel} column is ${priorSame ? 'the comparative column of the same filing' : "the prior year's annual filing"}. Retrieved ${today} via the SEC companyfacts API — no vendor, no estimate, no adjustment. Treat this pack as data pasted by the user (\`Retrieval: pasted by user\`). It contains **no market price**: fill in the price and date before computing P/E, market cap, EV or yield, or say they are unavailable.`);
  b.push('');
  if (stale) {
    b.push(`> **Possibly out of date.** The latest annual period in SEC companyfacts ended ${cur.end}, more than 16 months before this pack was generated (${today}). The company may have stopped filing, be late, or tag its statements under concepts this helper does not read. Check EDGAR for a newer annual report before relying on these figures.`);
    b.push('');
  }
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
  b.push(`| Shares outstanding (${sharesOut ? sharesLabel(sharesOut, cur) : 'n/a'}) | ${sharesOut ? `${fmtShares(sharesOut.value)} M` : 'n/a'} |`);
  b.push(`| Diluted weighted-average shares (${fyLabel}) | ${c.shares_diluted !== null ? `${fmtShares(c.shares_diluted)} M` : 'n/a'} |`);
  b.push(`| Industry (SIC) | ${profile && profile.sic ? `${profile.sic}${profile.sicDescription ? ` — ${profile.sicDescription}` : ''}` : 'see filing cover page'} |`);
  b.push('');
  if (!sharesOut) {
    b.push(`> Shares outstanding unavailable: no entity-wide cover-page count dated on or after ${cur.end} in SEC companyfacts. Check the filing's share classes and their economic rights before computing market cap; do not substitute weighted-average diluted shares.`);
    b.push('');
  }
  b.push(`## Income statement — fiscal years ended ${cur.end}${prior ? ` and ${prior.end}` : ''} ($ M)`);
  b.push('');
  b.push(`| Line | ${fyLabel} | ${priorLabel} |`);
  b.push('|------|------|------|');
  const is = [
    ['Revenue', 'revenue'], ['Cost of revenue', 'cost_of_revenue'], ['Gross profit', 'gross_profit'],
    ['R&D', 'rnd_expense'], ['SG&A', 'sga_expense'],
    ...(c.sga_expense === null && c.ga_expense !== null ? [['G&A (SG&A not tagged)', 'ga_expense']] : []),
    ['Operating income', 'operating_income'],
    ['Interest expense', 'interest_expense'], ['Pre-tax income', 'pretax_income'], ['Income tax', 'income_tax'],
    ['Net income', 'net_income'],
  ];
  for (const [label, k] of is) b.push(`| ${label} | ${fmtM(c[k])} | ${fmtM(p[k])} |`);
  b.push(`| Diluted EPS | ${c.eps_diluted !== null ? `$${Number(c.eps_diluted).toFixed(2)}` : 'n/a'} | ${p.eps_diluted !== null && p.eps_diluted !== undefined ? `$${Number(p.eps_diluted).toFixed(2)}` : 'n/a'} |`);
  b.push(`| Diluted shares (M) | ${fmtShares(c.shares_diluted)} | ${fmtShares(p.shares_diluted)} |`);
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
    ['Net debt (cash) incl. short-term investments', 'net_debt_incl_sti'],
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
  b.push('- Figures are US-GAAP as tagged by the company; "n/a" means no usable fact is available here for the period (the filing may report it under another tag or a dimensional context omitted by companyfacts).');
  b.push(`- Gross profit is the tagged value where available, otherwise revenue − cost of revenue. Total debt = ${c.total_debt_note}; leases are excluded unless the company tags them as debt.`);
  for (const n of c.debt_notes) b.push(`- ${n}`);
  for (const n of c.notes) b.push(`- ${n}`);
  const perShare = (m, v) => (PER_SHARE.has(m) ? `$${Number(v).toFixed(2)}` : `${fmtShares(v)}M`);
  if (restated.length) b.push(`- ${priorLabel} per-share lines are the ${fyLabel} ${cur.form}'s comparative column, not the figures first reported — restated, typically for a stock split, so both years share one share basis: ${restated.map(x => `${x.m} ${perShare(x.m, x.now)} (first reported ${perShare(x.m, x.first)})`).join(', ')}.`);
  if (recast.length) b.push(`- ${priorLabel} figures are as first reported. The ${fyLabel} ${cur.form}'s comparative column differs for: ${recast.map(x => `${x.m} (${fmtM(x.first)}M first reported, ${fmtM(x.now)}M in the comparative)`).join(', ')} — a recast (discontinued operations, an accounting change) or a tagging error. Check the filing before computing year-over-year change${revenueRecast ? '; the revenue-growth check is omitted for that reason' : ''}.`);
  const cite = x => `${x.m} (${x.form} filed ${x.filed}, accession ${x.accn})`;
  if (late.length) b.push(`- Not tagged in the ${cur.form} itself, so read from a later filing and possibly restated: ${late.map(cite).join(', ')}.`);
  if (early.length) b.push(`- Not tagged in the ${cur.form} itself, so read from a filing made on or before its filing date: ${early.map(cite).join(', ')}.`);
  b.push('- Derived lines (FCF, net debt, margins) are arithmetic on reported figures, shown so the analysis can be reconciled.');
  if (missing.length) b.push(`- Not tagged for ${fyLabel}: ${missing.join(', ')}.`);
  b.push('');
  b.push('## References');
  b.push('');
  b.push(`1. ${cur.form} for the fiscal year ended ${cur.end}, filed ${cur.filed} — ${filingUrl}`);
  const refs = [];
  if (prior && !priorSame) refs.push(`${prior.form} for the fiscal year ended ${prior.end}, filed ${prior.filed} — ${edgar.filingIndexUrl(company.cik, prior.accn)}`);
  refs.push(`SEC XBRL company facts — ${factsUrl}`);
  // fetch-edgar's --fy is the FILING year, so pin the hint to the year this filing was filed.
  refs.push(`Full filing text: \`node scripts/fetch-edgar.js ${ticker} --form ${cur.form.startsWith('20-F') ? '20-F' : '10-K'} --fy ${cur.filed.slice(0, 4)}\``);
  refs.forEach((x, i) => b.push(`${i + 2}. ${x}`));

  const pack = `---\n${front.join('\n')}\n---\n\n${b.join('\n')}\n`;

  if (has('stdout')) { process.stdout.write(pack); return; }
  edgar.ensureDir(outDir);
  const file = path.join(outDir, `${ticker}.md`);
  fs.writeFileSync(file, pack);
  log(`  ✓ ${path.relative(ROOT, file)} (${fyLabel}: revenue ${fmtM(c.revenue)} M · net income ${fmtM(c.net_income)} M · FCF ${fmtM(c.fcf)} M)\n`);
  if (has('json')) {
    const jf = path.join(outDir, `${ticker}.json`);
    fs.writeFileSync(jf, JSON.stringify({ ticker, entity, cik: company.cik, fiscal_year_end: cur.end, current: c, prior: p, shares_outstanding: sharesOut, filing: cur }, null, 2) + '\n');
    log(`  ✓ ${path.relative(ROOT, jf)}\n`);
  }
  if (missing.length) log(`  ⚠ not tagged: ${missing.join(', ')}\n`);
  log(`Next: add the current price to \`price:\`, then paste the pack into a skill — or run \`node scripts/eval-skills.js --fixture ${ticker}\`.\n`);
}

main().catch(err => {
  if (err instanceof edgar.HttpError && err.status === 403) {
    process.stderr.write('✗ EDGAR refused the request (HTTP 403). Set EDGAR_USER_AGENT="Your Name your@email".\n');
  } else {
    process.stderr.write(`✗ ${err.message}\n`);
  }
  process.exit(1);
});
