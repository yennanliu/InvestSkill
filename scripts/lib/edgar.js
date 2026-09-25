/**
 * edgar.js — shared, zero-dependency SEC EDGAR plumbing for the optional
 * "bring your own data" helpers (scripts/fetch-edgar.js, scripts/fetch-fundamentals.js).
 *
 * This is deliberately NOT part of the plugin: InvestSkill's skills are prompts
 * and fetch nothing themselves. These helpers exist so a user *without* a
 * tool-enabled assistant can still put a primary-source filing in front of the
 * model by pasting what they produce. Nothing here is wired into `npm test`.
 *
 * SEC fair-access rules (https://www.sec.gov/os/accessing-edgar-data):
 *   • declare a User-Agent that identifies you (set EDGAR_USER_AGENT to
 *     "Your Name your@email" — the default identifies the project only)
 *   • stay under 10 requests/second — every request here is paced
 *
 * Endpoints (all keyless):
 *   ticker → CIK        https://www.sec.gov/files/company_tickers.json
 *   filings index       https://data.sec.gov/submissions/CIK##########.json
 *   a filing's document https://www.sec.gov/Archives/edgar/data/<cik>/<accession-no-dashes>/<primaryDocument>
 *   XBRL statement data https://data.sec.gov/api/xbrl/companyfacts/CIK##########.json
 *
 * Requires Node ≥ 18 (global fetch).
 */
const fs = require('fs');
const path = require('path');

const PKG = require(path.join(__dirname, '..', '..', 'package.json'));

const SEC_URL = 'https://www.sec.gov';
const DATA_URL = 'https://data.sec.gov';
const USER_AGENT = process.env.EDGAR_USER_AGENT
  || `InvestSkill/${PKG.version} (+https://github.com/yennanliu/InvestSkill; set EDGAR_USER_AGENT to identify yourself)`;

// SEC allows 10 req/s; 150 ms between requests keeps a comfortable margin.
// The env overrides exist for the offline test suite (scripts/test-edgar.js),
// which runs against a fetch double and has no reason to wait.
const REQUEST_INTERVAL_MS = process.env.EDGAR_REQUEST_INTERVAL_MS !== undefined ? Number(process.env.EDGAR_REQUEST_INTERVAL_MS) : 150;
const RETRY_BACKOFF_MS = process.env.EDGAR_RETRY_BACKOFF_MS !== undefined ? Number(process.env.EDGAR_RETRY_BACKOFF_MS) : 1000;
let lastRequestAt = 0;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function paced() {
  const wait = lastRequestAt + REQUEST_INTERVAL_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
}

class HttpError extends Error {
  constructor(status, url) { super(`HTTP ${status} for ${url}`); this.status = status; this.url = url; }
}

async function request(url, { retries = 2 } = {}) {
  if (typeof fetch !== 'function') throw new Error('Node ≥ 18 is required (global fetch not available)');
  for (let attempt = 0; ; attempt++) {
    await paced();
    let res;
    try {
      res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, 'Accept-Encoding': 'gzip, deflate' } });
    } catch (err) {
      if (attempt >= retries) throw err;
      await sleep(RETRY_BACKOFF_MS * (attempt + 1));
      continue;
    }
    if (res.ok) return res;
    // 429 / 5xx are worth a retry; 4xx (esp. 403 = bad User-Agent, 404) are not.
    if ((res.status === 429 || res.status >= 500) && attempt < retries) { await sleep(RETRY_BACKOFF_MS * 1.5 * (attempt + 1)); continue; }
    throw new HttpError(res.status, url);
  }
}

async function fetchJson(url) { return (await request(url)).json(); }
async function fetchText(url) { return (await request(url)).text(); }

// ── Ticker → CIK ─────────────────────────────────────────────────────────────
/** Resolve a ticker to its zero-padded 10-digit CIK, plus the SEC's company title. */
async function lookupCik(ticker) {
  const normalized = ticker.toUpperCase().replace(/\./g, '-'); // BRK.B → BRK-B
  const table = await fetchJson(`${SEC_URL}/files/company_tickers.json`);
  for (const entry of Object.values(table)) {
    if (String(entry.ticker).toUpperCase() === normalized) {
      return { cik: String(entry.cik_str).padStart(10, '0'), title: entry.title, ticker: normalized };
    }
  }
  return null;
}

// ── Filings index ────────────────────────────────────────────────────────────
/** Columnar submissions block → array of row objects. */
function rowsFromBlock(block) {
  const forms = block.form || [];
  const out = [];
  for (let i = 0; i < forms.length; i++) {
    out.push({
      form: forms[i],
      filed: block.filingDate[i],
      period: (block.reportDate && block.reportDate[i]) || block.filingDate[i],
      accession: block.accessionNumber[i],
      primaryDocument: block.primaryDocument[i],
      description: (block.primaryDocDescription && block.primaryDocDescription[i]) || '',
    });
  }
  return out;
}

/**
 * List filings of one form type, newest first.
 * @param {string} cik  zero-padded CIK
 * @param {object} opts { form: '10-K', since: 'YYYY-MM-DD' (optional), limit (optional) }
 * The "recent" block holds ~1000 filings; high-volume filers page older ones
 * into archive files, which are fetched only when `since` reaches past "recent".
 */
async function listFilings(cik, { form, since, limit } = {}) {
  const sub = await fetchJson(`${DATA_URL}/submissions/CIK${cik}.json`);
  const match = r => (!form || r.form === form) && (!since || r.filed >= since);
  let rows = rowsFromBlock(sub.filings.recent).filter(match);

  const recentDates = (sub.filings.recent.filingDate || []).filter(Boolean);
  const oldestRecent = recentDates.length ? recentDates.reduce((a, b) => (a < b ? a : b)) : null;
  const needOlder = since && oldestRecent && oldestRecent > since;
  const needMore = limit && rows.length < limit;
  if ((needOlder || needMore) && Array.isArray(sub.filings.files)) {
    for (const extra of sub.filings.files) {
      const block = await fetchJson(`${DATA_URL}/submissions/${extra.name}`);
      rows = rows.concat(rowsFromBlock(block).filter(match));
      if (!needOlder && limit && rows.length >= limit) break;
    }
  }
  rows.sort((a, b) => (a.filed < b.filed ? 1 : a.filed > b.filed ? -1 : 0));
  return {
    entity: sub.name,
    fiscalYearEnd: sub.fiscalYearEnd, // "MMDD"
    sic: sub.sic, sicDescription: sub.sicDescription,
    filings: limit ? rows.slice(0, limit) : rows,
  };
}

/** Public URL of a document inside a filing. */
function archiveUrl(cik, accession, doc) {
  return `${SEC_URL}/Archives/edgar/data/${parseInt(cik, 10)}/${accession.replace(/-/g, '')}/${doc}`;
}

/** Human-readable EDGAR index page for a filing. */
function filingIndexUrl(cik, accession) {
  return `${SEC_URL}/Archives/edgar/data/${parseInt(cik, 10)}/${accession.replace(/-/g, '')}/${accession}-index.htm`;
}

// ── XBRL company facts ───────────────────────────────────────────────────────
/** Every XBRL fact the company has ever tagged. Returns null on 404 (ETFs, some foreign filers). */
async function fetchCompanyFacts(cik) {
  try {
    return await fetchJson(`${DATA_URL}/api/xbrl/companyfacts/CIK${cik}.json`);
  } catch (err) {
    if (err instanceof HttpError && err.status === 404) return null;
    throw err;
  }
}

// ── HTML → text ──────────────────────────────────────────────────────────────
const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', bull: '•', hellip: '…', copy: '©', reg: '®', trade: '™', sect: '§', para: '¶', middot: '·', times: '×', deg: '°', cent: '¢', pound: '£', euro: '€', yen: '¥' };

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, n) => (NAMED_ENTITIES[n.toLowerCase()] !== undefined ? NAMED_ENTITIES[n.toLowerCase()] : m));
}

/**
 * Strip an EDGAR HTML / inline-XBRL document down to readable text.
 * Tables keep a " | " between cells and one row per line, so financial
 * statements remain legible when pasted into a prompt.
 */
function htmlToText(html) {
  let s = html;
  // Inline XBRL hides a large block of machine-only facts in <ix:header>.
  s = s.replace(/<ix:header[\s\S]*?<\/ix:header>/gi, '');
  s = s.replace(/<(script|style|head|title)\b[\s\S]*?<\/\1>/gi, '');
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/(td|th)>/gi, ' | ');
  s = s.replace(/<\/(tr)>/gi, '\n');
  s = s.replace(/<\/(p|div|li|h[1-6]|table|section|article|blockquote|pre)>/gi, '\n');
  s = s.replace(/<(p|div|li|h[1-6]|table|tr|section|article|blockquote|pre|hr)\b[^>]*>/gi, '\n');
  s = s.replace(/<[^>]+>/g, '');
  s = decodeEntities(s);
  s = s.replace(/ /g, ' ');
  // Tidy table rows: drop leading/trailing separators and empty cells.
  s = s.split('\n').map(line => {
    let l = line.replace(/[ \t]+/g, ' ').trim();
    if (l.includes('|')) {
      l = l.split('|').map(c => c.trim()).filter(Boolean).join(' | ');
    }
    return l;
  }).join('\n');
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim() + '\n';
}

// ── Filesystem helpers ───────────────────────────────────────────────────────
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); return dir; }

function writeFileIfChanged(file, content) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return false;
  fs.writeFileSync(file, content);
  return true;
}

module.exports = {
  SEC_URL, DATA_URL, USER_AGENT, HttpError,
  fetchJson, fetchText, lookupCik, listFilings, archiveUrl, filingIndexUrl,
  fetchCompanyFacts, htmlToText, decodeEntities, ensureDir, writeFileIfChanged, sleep,
};
