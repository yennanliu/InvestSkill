#!/usr/bin/env node
/**
 * fetch-edgar.js — optional, keyless "bring your own data" helper.
 *
 * Downloads a company's SEC filing from EDGAR and saves it as HTML *and* as
 * stripped plain text you can paste into a skill (10k-digest,
 * financial-report-analyst, fact-check, …). No API key, no dependencies beyond
 * Node ≥ 18. It is NOT part of the plugin and NOT run by `npm test`: the skills
 * remain prompts that fetch nothing themselves — this just puts a primary
 * source in front of you when your assistant has no web access.
 *
 *   node scripts/fetch-edgar.js AAPL                    # latest 10-K → data/filings/AAPL/
 *   node scripts/fetch-edgar.js AAPL --form 10-Q        # latest 10-Q
 *   node scripts/fetch-edgar.js MSFT --form 10-K --fy 2024
 *   node scripts/fetch-edgar.js NVDA --form 8-K --limit 3
 *   node scripts/fetch-edgar.js TSLA --form "DEF 14A"   # proxy statement
 *   node scripts/fetch-edgar.js PLTR --form 4 --limit 10 --list   # just list, no download
 *   node scripts/fetch-edgar.js TSM                     # 10-K missing → falls back to 20-F
 *
 * Options:
 *   --form F        SEC form (default 10-K). 10-K falls back to 20-F for foreign private issuers.
 *   --fy YYYY       for annual forms: the filing whose *filing year* is YYYY (AAPL FY2024 10-K is filed 2024-11)
 *   --period DATE   the filing covering period end DATE (YYYY-MM-DD), e.g. a specific 10-Q
 *   --limit N       how many most-recent filings (default 1; also caps --fy / --period matches)
 *   --since DATE    only filings filed on/after DATE
 *   --out DIR       output root (default data/filings)
 *   --list          print matching filings and exit
 *   --text-only     skip saving the .htm copy
 *   --force         re-download even if the files exist
 *
 * Output per filing: <TICKER>_<key>_<FORM>.htm, .txt (stripped text) and .json
 * (accession, dates, URLs — paste it into the Data & Sources header). `key` is
 * the filing year for annual forms, the period end for 10-Q, and the filing date
 * plus the accession sequence for event-driven forms (8-K, Form 4, DEF 14A) and
 * 6-K, several of which can share one date or period.
 *
 * data/filings/ is git-ignored: downloaded filings are your working data, not
 * repository content.
 *
 * Set EDGAR_USER_AGENT="Your Name your@email" — the SEC asks every automated
 * client to identify itself (https://www.sec.gov/os/accessing-edgar-data).
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
const VALUE_FLAGS = new Set(['--form', '--fy', '--period', '--limit', '--since', '--out']);
const positional = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && VALUE_FLAGS.has(argv[i - 1])));

if (has('help') || positional.length === 0) {
  process.stdout.write(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 40).map(l => l.replace(/^ \*\/?\s?/, '')).join('\n') + '\n');
  process.exit(positional.length === 0 && !has('help') ? 1 : 0);
}

const ticker = positional[0].toUpperCase();
const form = flag('form', '10-K').toUpperCase();
const fy = flag('fy');
const period = flag('period');
// `--limit` must be a positive integer. Number() (not parseInt) so "1abc" and
// "1.5" are rejected instead of silently becoming 1 — a NaN here would disable
// the cap entirely and download every matching filing.
const limitRaw = flag('limit', '1');
const limit = Number(limitRaw);
if (!(Number.isInteger(limit) && limit >= 1)) {
  process.stderr.write(`  ✗ --limit must be a positive integer (got "${limitRaw}")\n`);
  process.exit(1);
}
// A filing year implies a lower bound, which also makes listFilings reach into
// the paginated archive blocks for high-volume filers when it has to.
const since = flag('since', fy ? `${fy}-01-01` : undefined);
const outRoot = path.resolve(ROOT, flag('out', path.join('data', 'filings')));
const LIST = has('list'), TEXT_ONLY = has('text-only'), FORCE = has('force');

const ANNUAL_FORMS = new Set(['10-K', '10-K/A', '20-F', '40-F', '10-KT']);
const PERIODIC_FORMS = new Set(['10-Q', '10-Q/A', '10-QT', '6-K']);

/**
 * The stable part of a saved filing's filename: filing year for annual forms
 * (one per year); period end for 10-Q (three a year, one per period); for
 * everything else the filing date plus the accession sequence number, because
 * several 8-Ks or Form 4s can be filed on one day and a foreign issuer files
 * several 6-Ks for one period — a date alone would make them overwrite (or,
 * with the skip-if-exists check, silently drop) each other.
 */
function fileKey(f) {
  if (ANNUAL_FORMS.has(f.form)) return f.filed.slice(0, 4);
  if (PERIODIC_FORMS.has(f.form) && f.form !== '6-K') return f.period;
  return `${f.filed}_${f.accession.replace(/-/g, '').slice(-6)}`;
}
/** Form name safe for a filename (`DEF 14A` -> `DEF14A`). */
const safeForm = f => f.replace(/[^A-Za-z0-9-]+/g, '');

/**
 * CLI entry: resolve the ticker, list matching filings (with the 10-K -> 20-F fallback),
 * optionally just print them, otherwise download each primary document and write
 * `.htm`, stripped `.txt` and `.json` metadata. Exits 1 on an unknown ticker or a partial download.
 */
async function main() {
  process.stdout.write(`Looking up ${ticker} on SEC EDGAR…\n`);
  const company = await edgar.lookupCik(ticker);
  if (!company) { process.stderr.write(`  ✗ ticker '${ticker}' not found in EDGAR's company list\n`); process.exit(1); }
  process.stdout.write(`  CIK ${company.cik} — ${company.title}\n`);

  // With --fy / --period the lookup is uncapped so the filter sees every candidate;
  // the requested --limit is then applied to what survives the filter.
  const lookupLimit = fy || period ? undefined : limit;
  let { entity, fiscalYearEnd, filings } = await edgar.listFilings(company.cik, { form, since, limit: lookupLimit });
  let usedForm = form;
  if (!filings.length && form === '10-K') {
    const alt = await edgar.listFilings(company.cik, { form: '20-F', since, limit: lookupLimit });
    if (alt.filings.length) { process.stdout.write('  No 10-K found; foreign private issuer — using 20-F\n'); filings = alt.filings; usedForm = '20-F'; }
  }
  if (fy) filings = filings.filter(f => f.filed.slice(0, 4) === String(fy));
  if (period) filings = filings.filter(f => f.period === period);
  filings = filings.slice(0, limit);

  if (!filings.length) {
    process.stdout.write(`  No ${usedForm} filings match${fy ? ` filing year ${fy}` : ''}${period ? ` period ${period}` : ''}${since ? ` since ${since}` : ''}.\n`);
    if (form === '10-Q') process.stdout.write('  (foreign private issuers file 6-K instead — try --form 6-K)\n');
    process.exit(0);
  }

  process.stdout.write(`  Fiscal year end: ${fiscalYearEnd ? `${fiscalYearEnd.slice(0, 2)}/${fiscalYearEnd.slice(2)}` : 'n/a'} · ${filings.length} ${usedForm} filing(s)\n\n`);

  if (LIST) {
    process.stdout.write('  filed       period      accession              document\n');
    for (const f of filings) process.stdout.write(`  ${f.filed}  ${f.period}  ${f.accession}  ${f.primaryDocument}\n`);
    return;
  }

  const dir = edgar.ensureDir(path.join(outRoot, ticker));
  let ok = 0;
  for (const [i, f] of filings.entries()) {
    const base = path.join(dir, `${ticker}_${fileKey(f)}_${safeForm(f.form)}`);
    const url = edgar.archiveUrl(company.cik, f.accession, f.primaryDocument);
    process.stdout.write(`[${i + 1}/${filings.length}] ${f.form} · period ${f.period} · filed ${f.filed}\n  ${url}\n`);
    if (!FORCE && fs.existsSync(`${base}.txt`)) { process.stdout.write(`  ⊘ ${path.relative(ROOT, base)}.txt exists — skipping (use --force)\n\n`); ok++; continue; }
    try {
      const html = await edgar.fetchText(url);
      const isHtml = /<\s*(html|body|div|p|table)\b/i.test(html.slice(0, 20000));
      const text = isHtml ? edgar.htmlToText(html) : html;
      if (!TEXT_ONLY && isHtml) fs.writeFileSync(`${base}.htm`, html);
      fs.writeFileSync(`${base}.txt`, text);
      const meta = {
        ticker, entity: entity || company.title, cik: company.cik, form: f.form,
        period_end: f.period, filed: f.filed, accession: f.accession,
        document_url: url, index_url: edgar.filingIndexUrl(company.cik, f.accession),
        retrieved: new Date().toISOString().slice(0, 10),
        data_and_sources: {
          'As of': f.period,
          Source: `SEC EDGAR ${f.form} (${entity || company.title}), filed ${f.filed}, accession ${f.accession}`,
          Retrieval: 'pasted by user (downloaded with scripts/fetch-edgar.js)',
          Confidence: 'HIGH',
        },
      };
      fs.writeFileSync(`${base}.json`, JSON.stringify(meta, null, 2) + '\n');
      const kb = n => `${(n / 1024).toFixed(0)} KB`;
      process.stdout.write(`  ✓ ${path.relative(ROOT, base)}.txt (${kb(text.length)})${!TEXT_ONLY && isHtml ? ` · .htm (${kb(html.length)})` : ''} · .json\n\n`);
      ok++;
    } catch (err) {
      process.stderr.write(`  ✗ ${err.message}\n\n`);
    }
  }
  process.stdout.write(`Done: ${ok}/${filings.length} filing(s) in ${path.relative(ROOT, dir)}/\n`);
  if (ok) process.stdout.write('Next: paste the .txt (or the sections you need) into a skill, and copy the .json fields into its Data & Sources header.\n');
  if (ok !== filings.length) process.exit(1);
}

main().catch(err => {
  if (err instanceof edgar.HttpError && err.status === 403) {
    process.stderr.write('✗ EDGAR refused the request (HTTP 403). The SEC requires a User-Agent that identifies you:\n  EDGAR_USER_AGENT="Your Name your@email" node scripts/fetch-edgar.js …\n');
  } else {
    process.stderr.write(`✗ ${err.message}\n`);
  }
  process.exit(1);
});
