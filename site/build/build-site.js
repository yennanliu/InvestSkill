'use strict';
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

// GitHub-compatible heading slugs: lowercase, strip punctuation (keep letters,
// numbers, spaces, hyphens — including Unicode), then map each space to a hyphen
// 1:1 (no collapsing — "A & B" → "a--b", matching GitHub and the Cookbook TOC).
function githubSlug(s) {
  return String(s).trim().toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-');
}

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
  .use(markdownItAnchor, { permalink: false, slugify: githubSlug });

// ---------------------------------------------------------------------------
// Navigation structure
// ---------------------------------------------------------------------------
// Language-aware navigation. English pages render the `en` sidebar/tabs;
// Traditional Chinese pages render the `zh` ones. The header language
// switcher moves between a page and its counterpart in the other language.
const NAV = {
  en: [
    {
      title: 'Introduction',
      links: [
        { label: 'Quick Start',     href: 'index.html',    page: 'home' },
      ],
    },
    {
      title: 'Learning',
      links: [
        { label: 'Learning Hub',              href: 'learning.html',             page: 'learning' },
        { label: '1 · Investing Foundations', href: 'learning-foundations.html', page: 'learning-foundations' },
        { label: '2 · Financial Statements',  href: 'learning-statements.html',  page: 'learning-statements' },
        { label: '3 · Business Quality',      href: 'learning-quality.html',     page: 'learning-quality' },
        { label: '4 · Valuation Essentials',  href: 'learning-valuation.html',   page: 'learning-valuation' },
        { label: '5 · Reading the Market',    href: 'learning-market.html',      page: 'learning-market' },
        { label: '6 · Portfolio & Risk',      href: 'learning-portfolio.html',   page: 'learning-portfolio' },
        { label: "7 · The Pro's Playbook",    href: 'learning-playbook.html',    page: 'learning-playbook' },
        { label: '8 · Case Study: AMD',       href: 'learning-case-amd.html',    page: 'learning-case-amd' },
        { label: '9 · Before Your First Trade', href: 'learning-setup.html', page: 'learning-setup' },
        { label: '10 · ETFs & Index Investing', href: 'learning-etfs.html', page: 'learning-etfs' },
        { label: '11 · Taxes & Account Types', href: 'learning-taxes.html', page: 'learning-taxes' },
        { label: '12 · Earnings Season, Explained', href: 'learning-earnings.html', page: 'learning-earnings' },
        { label: '13 · Psychology & Process', href: 'learning-psychology.html', page: 'learning-psychology' },
        { label: 'Case Study: When the Answer Is No', href: 'learning-case-pass.html', page: 'learning-case-pass' },
      ],
    },
    {
      title: 'Learn',
      links: [
        { label: 'Concepts',        href: 'concepts.html',      page: 'concepts' },
        { label: 'Glossary',        href: 'glossary.html',      page: 'glossary' },
        { label: 'Choose a Skill',  href: 'choose-a-skill.html', page: 'choose-a-skill' },
        { label: 'Use Cases',       href: 'use-cases.html',     page: 'use-cases' },
      ],
    },
    {
      title: 'Guides',
      links: [
        { label: 'Cookbook',        href: 'cookbook.html',      page: 'cookbook' },
        { label: 'Skill Reference', href: 'skills.html',        page: 'skills' },
        { label: 'Contributing',    href: 'contributing.html',  page: 'contributing' },
      ],
    },
    {
      title: 'Demo',
      links: [
        { label: 'Demo Overview',       href: 'full-demo.html',       page: 'full-demo' },
        { label: 'META 10-K Deep Dive', href: 'full-demo-meta.html',  page: 'full-demo-meta' },
        { label: 'NVDA 10-K Deep Dive', href: 'full-demo-nvda.html',  page: 'full-demo-nvda' },
        { label: 'AMD 10-K (繁體中文)', href: 'full-demo-amd.html',   page: 'full-demo-amd' },
        { label: 'PLTR (English)',      href: 'full-demo-pltr.html',  page: 'full-demo-pltr' },
        { label: 'RKLB (繁體中文)',     href: 'full-demo-rklb.html',  page: 'full-demo-rklb' },
      ],
    },
    {
      title: 'Trust',
      links: [
        { label: 'Data & Accuracy', href: 'data-and-accuracy.html', page: 'data-and-accuracy' },
      ],
    },
    {
      title: 'Reference',
      links: [
        { label: 'Changelog',       href: 'changelog.html', page: 'changelog' },
      ],
    },
  ],
  zh: [
    {
      title: '介紹',
      links: [
        { label: '快速開始',        href: 'zh-tw.html',         page: 'zh-tw' },
      ],
    },
    {
      title: '學習',
      links: [
        { label: '學習中心',         href: 'learning-zh-tw.html',             page: 'learning-zh-tw' },
        { label: '1 · 投資基礎',      href: 'learning-foundations-zh-tw.html', page: 'learning-foundations-zh-tw' },
        { label: '2 · 讀懂財務報表',  href: 'learning-statements-zh-tw.html',  page: 'learning-statements-zh-tw' },
        { label: '3 · 判斷企業品質',  href: 'learning-quality-zh-tw.html',     page: 'learning-quality-zh-tw' },
        { label: '4 · 估值入門',      href: 'learning-valuation-zh-tw.html',   page: 'learning-valuation-zh-tw' },
        { label: '5 · 解讀市場訊號',  href: 'learning-market-zh-tw.html',      page: 'learning-market-zh-tw' },
        { label: '6 · 投資組合與風險', href: 'learning-portfolio-zh-tw.html',  page: 'learning-portfolio-zh-tw' },
        { label: '7 · 實戰劇本',       href: 'learning-playbook-zh-tw.html',   page: 'learning-playbook-zh-tw' },
        { label: '8 · 案例研究：AMD',  href: 'learning-case-amd-zh-tw.html',   page: 'learning-case-amd-zh-tw' },
        { label: '9 · 第一筆交易之前', href: 'learning-setup-zh-tw.html', page: 'learning-setup-zh-tw' },
        { label: '10 · ETF 與指數投資', href: 'learning-etfs-zh-tw.html', page: 'learning-etfs-zh-tw' },
        { label: '11 · 稅與帳戶類型', href: 'learning-taxes-zh-tw.html', page: 'learning-taxes-zh-tw' },
        { label: '12 · 財報季解析', href: 'learning-earnings-zh-tw.html', page: 'learning-earnings-zh-tw' },
        { label: '13 · 心理與流程', href: 'learning-psychology-zh-tw.html', page: 'learning-psychology-zh-tw' },
        { label: '案例研究：當答案是「不」', href: 'learning-case-pass-zh-tw.html', page: 'learning-case-pass-zh-tw' },
      ],
    },
    {
      title: '學習資源',
      links: [
        { label: '概念',             href: 'concepts-zh-tw.html',      page: 'concepts-zh-tw' },
        { label: '術語表',           href: 'glossary-zh-tw.html',      page: 'glossary-zh-tw' },
        { label: '選擇技能',         href: 'choose-a-skill-zh-tw.html', page: 'choose-a-skill-zh-tw' },
        { label: '使用情境',         href: 'use-cases-zh-tw.html',      page: 'use-cases-zh-tw' },
      ],
    },
    {
      title: '指南',
      links: [
        { label: '操作手冊',         href: 'cookbook-zh-tw.html',      page: 'cookbook-zh-tw' },
      ],
    },
    {
      title: '示範',
      links: [
        { label: 'AMD 10-K 深度解析',  href: 'full-demo-amd.html',   page: 'full-demo-amd' },
        { label: 'RKLB 完整示範',      href: 'full-demo-rklb.html',  page: 'full-demo-rklb' },
        { label: 'META 10-K（英文）',  href: 'full-demo-meta.html',  page: 'full-demo-meta' },
        { label: 'NVDA 10-K（英文）',  href: 'full-demo-nvda.html',  page: 'full-demo-nvda' },
        { label: '示範總覽（英文）',   href: 'full-demo.html',       page: 'full-demo' },
        { label: 'PLTR（英文）',       href: 'full-demo-pltr.html',  page: 'full-demo-pltr' },
      ],
    },
    {
      title: '信任',
      links: [
        { label: '資料與準確性',     href: 'data-and-accuracy-zh-tw.html', page: 'data-and-accuracy-zh-tw' },
      ],
    },
  ],
};

// Pairs of English ⇄ Traditional Chinese counterparts (by output filename).
const LANG_PAIRS = [
  ['index.html', 'zh-tw.html'],
  ['learning.html', 'learning-zh-tw.html'],
  ['learning-foundations.html', 'learning-foundations-zh-tw.html'],
  ['learning-statements.html', 'learning-statements-zh-tw.html'],
  ['learning-quality.html', 'learning-quality-zh-tw.html'],
  ['learning-valuation.html', 'learning-valuation-zh-tw.html'],
  ['learning-market.html', 'learning-market-zh-tw.html'],
  ['learning-portfolio.html', 'learning-portfolio-zh-tw.html'],
  ['learning-playbook.html', 'learning-playbook-zh-tw.html'],
  ['learning-case-amd.html', 'learning-case-amd-zh-tw.html'],
  ['learning-setup.html', 'learning-setup-zh-tw.html'],
  ['learning-etfs.html', 'learning-etfs-zh-tw.html'],
  ['learning-taxes.html', 'learning-taxes-zh-tw.html'],
  ['learning-earnings.html', 'learning-earnings-zh-tw.html'],
  ['learning-psychology.html', 'learning-psychology-zh-tw.html'],
  ['learning-case-pass.html', 'learning-case-pass-zh-tw.html'],
  ['concepts.html', 'concepts-zh-tw.html'],
  ['glossary.html', 'glossary-zh-tw.html'],
  ['choose-a-skill.html', 'choose-a-skill-zh-tw.html'],
  ['use-cases.html', 'use-cases-zh-tw.html'],
  ['data-and-accuracy.html', 'data-and-accuracy-zh-tw.html'],
  ['cookbook.html', 'cookbook-zh-tw.html'],
  // The demo overview (English) pairs with the RKLB full demo (Traditional Chinese).
  ['full-demo.html', 'full-demo-rklb.html'],
  // The two 10-K deep dives pair across languages: NVDA (English) ⇄ AMD (Traditional Chinese).
  ['full-demo-nvda.html', 'full-demo-amd.html'],
];
const EN_TO_ZH = Object.fromEntries(LANG_PAIRS);
const ZH_TO_EN = Object.fromEntries(LANG_PAIRS.map(([en, zh]) => [zh, en]));

const RAW_BASE    = 'https://raw.githubusercontent.com/yennanliu/InvestSkill/main';
const GITHUB_BLOB = 'https://github.com/yennanliu/InvestSkill/blob/main';

// Read the current plugin version for the header status chip.
let SITE_VERSION = '';
try {
  const pj = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', '..', 'plugins', 'us-stock-analysis', '.claude-plugin', 'plugin.json'), 'utf8'));
  SITE_VERSION = pj.version ? `v${pj.version}` : '';
} catch { /* version chip is optional */ }
const SITE_BASE   = 'https://yennj12.js.org/InvestSkill';
const OLD_SITE    = 'https://yennanliu.github.io/InvestSkill';

// Prompt inventory + advertised framework count, derived once so the landing
// hero, the Skill Reference index, and everything else share a single source
// of truth. Which skills are output tools or alias/redirect stubs (and so not
// counted as frameworks) is defined in scripts/lib/skill-registry.js.
const skillRegistry = require('../../scripts/lib/skill-registry');
const PROMPTS_DIR = path.join(__dirname, '..', '..', 'prompts');
const promptFiles = fs.existsSync(PROMPTS_DIR)
  ? fs.readdirSync(PROMPTS_DIR).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, '')).sort()
  : [];
const FRAMEWORK_COUNT = skillRegistry.frameworkCount(promptFiles);
const ALIAS_COUNT = promptFiles.filter(n => skillRegistry.ALIAS_SKILLS.includes(n)).length;

// .md files that have dedicated HTML pages on the site
const MD_TO_HTML = {
  'README.md':          'index.html',
  'README-zh-TW.md':    'zh-tw.html',
  'COOKBOOK.md':        'cookbook.html',
  'COOKBOOK-zh-TW.md':  'cookbook-zh-tw.html',
  'CONTRIBUTING.md':    'contributing.html',
  'CHANGELOG.md':       'changelog.html',
  'CONCEPTS.md':        'concepts.html',
  'GLOSSARY.md':        'glossary.html',
  'CHOOSE-A-SKILL.md':  'choose-a-skill.html',
  'USE-CASES.md':       'use-cases.html',
  'DATA-AND-ACCURACY.md': 'data-and-accuracy.html',
  'FULL-DEMO.md':         'full-demo.html',
  'FULL-DEMO-PLTR.md':   'full-demo-pltr.html',
  'FULL-DEMO-RKLB.md':   'full-demo-rklb.html',
  'FULL-DEMO-NVDA.md':   'full-demo-nvda.html',
  'FULL-DEMO-AMD.md':    'full-demo-amd.html',
  'FULL-DEMO-META.md':   'full-demo-meta.html',
  'CONCEPTS-zh-TW.md':       'concepts-zh-tw.html',
  'GLOSSARY-zh-TW.md':       'glossary-zh-tw.html',
  'CHOOSE-A-SKILL-zh-TW.md': 'choose-a-skill-zh-tw.html',
  'USE-CASES-zh-TW.md':      'use-cases-zh-tw.html',
  'DATA-AND-ACCURACY-zh-TW.md': 'data-and-accuracy-zh-tw.html',
  'LEARNING.md':                'learning.html',
  'LEARNING-FOUNDATIONS.md':    'learning-foundations.html',
  'LEARNING-STATEMENTS.md':     'learning-statements.html',
  'LEARNING-QUALITY.md':        'learning-quality.html',
  'LEARNING-VALUATION.md':      'learning-valuation.html',
  'LEARNING-MARKET.md':         'learning-market.html',
  'LEARNING-PORTFOLIO.md':      'learning-portfolio.html',
  'LEARNING-PLAYBOOK.md':       'learning-playbook.html',
  'LEARNING-CASE-AMD.md':       'learning-case-amd.html',
  'LEARNING-SETUP.md': 'learning-setup.html',
  'LEARNING-ETFS.md': 'learning-etfs.html',
  'LEARNING-TAXES.md': 'learning-taxes.html',
  'LEARNING-EARNINGS.md': 'learning-earnings.html',
  'LEARNING-PSYCHOLOGY.md': 'learning-psychology.html',
  'LEARNING-CASE-PASS.md': 'learning-case-pass.html',
  'LEARNING-zh-TW.md':              'learning-zh-tw.html',
  'LEARNING-FOUNDATIONS-zh-TW.md':  'learning-foundations-zh-tw.html',
  'LEARNING-STATEMENTS-zh-TW.md':   'learning-statements-zh-tw.html',
  'LEARNING-QUALITY-zh-TW.md':      'learning-quality-zh-tw.html',
  'LEARNING-VALUATION-zh-TW.md':    'learning-valuation-zh-tw.html',
  'LEARNING-MARKET-zh-TW.md':       'learning-market-zh-tw.html',
  'LEARNING-PORTFOLIO-zh-TW.md':    'learning-portfolio-zh-tw.html',
  'LEARNING-PLAYBOOK-zh-TW.md':     'learning-playbook-zh-tw.html',
  'LEARNING-CASE-AMD-zh-TW.md':     'learning-case-amd-zh-tw.html',
  'LEARNING-SETUP-zh-TW.md': 'learning-setup-zh-tw.html',
  'LEARNING-ETFS-zh-TW.md': 'learning-etfs-zh-tw.html',
  'LEARNING-TAXES-zh-TW.md': 'learning-taxes-zh-tw.html',
  'LEARNING-EARNINGS-zh-TW.md': 'learning-earnings-zh-tw.html',
  'LEARNING-PSYCHOLOGY-zh-TW.md': 'learning-psychology-zh-tw.html',
  'LEARNING-CASE-PASS-zh-TW.md': 'learning-case-pass-zh-tw.html',
};

// Assets we actually serve — any other relative link is sent to GitHub.
// Per-skill pages (skill-<name>.html) are added dynamically further below.
const SERVED = new Set(['index.html','cookbook.html','cookbook-zh-tw.html',
  'contributing.html','changelog.html','zh-tw.html','style.css','main.js',
  'concepts.html','glossary.html','choose-a-skill.html','use-cases.html',
  'data-and-accuracy.html','skills.html','full-demo.html','full-demo-pltr.html','full-demo-rklb.html','full-demo-nvda.html','full-demo-amd.html','full-demo-meta.html',
  'concepts-zh-tw.html','glossary-zh-tw.html','choose-a-skill-zh-tw.html',
  'use-cases-zh-tw.html','data-and-accuracy-zh-tw.html',
  'learning.html','learning-foundations.html','learning-statements.html',
  'learning-quality.html','learning-valuation.html','learning-market.html','learning-portfolio.html',
  'learning-playbook.html','learning-case-amd.html',
  'learning-setup.html','learning-etfs.html','learning-taxes.html','learning-earnings.html','learning-psychology.html','learning-case-pass.html',
  'learning-zh-tw.html','learning-foundations-zh-tw.html','learning-statements-zh-tw.html',
  'learning-quality-zh-tw.html','learning-valuation-zh-tw.html','learning-market-zh-tw.html',
  'learning-portfolio-zh-tw.html','learning-playbook-zh-tw.html','learning-case-amd-zh-tw.html',
  'learning-setup-zh-tw.html','learning-etfs-zh-tw.html','learning-taxes-zh-tw.html','learning-earnings-zh-tw.html','learning-psychology-zh-tw.html','learning-case-pass-zh-tw.html']);

// Rewrite links in rendered HTML:
//  - relative paths for served assets  → leave alone
//  - .md paths with an HTML equivalent → local .html
//  - everything else (LICENSE, *.md w/o page, …) → GitHub blob (new tab)
//  - old site domain → new custom domain
function rewriteLinks(html) {
  html = html.replace(/href="([^"]+)"/g, (match, href) => {
    // Leave absolute URLs and pure anchor links untouched
    if (/^https?:\/\//.test(href) || href.startsWith('#')) return match;

    const [filePart, anchor] = href.split('#');
    const basename  = path.basename(filePart);
    const anchorStr = anchor ? '#' + anchor : '';

    // Assets we serve — leave as-is
    if (SERVED.has(basename)) return match;

    // .md → local HTML if we have a page for it
    if (MD_TO_HTML[basename]) {
      return `href="${MD_TO_HTML[basename]}${anchorStr}"`;
    }

    // Everything else (LICENSE, unbuilt .md files, etc.) → GitHub blob
    return `href="${GITHUB_BLOB}/${basename}" target="_blank" rel="noopener noreferrer"`;
  });

  // Replace old GitHub Pages domain with new custom domain
  html = html.replace(new RegExp(OLD_SITE.replace(/\./g, '\\.'), 'g'), SITE_BASE);
  return html;
}

// ---------------------------------------------------------------------------
// Skill categories + per-skill metadata (used by the landing page, the Skill
// Reference grid, and the per-skill pages)
// ---------------------------------------------------------------------------
// Display categories for the index, mirroring README. Any skill not listed
// here falls into "Other" so new skills still appear without code changes.
const SKILL_CATEGORIES = [
  { title: 'Core Stock Analysis', skills: ['stock-eval','technical-analysis','stock-valuation','economics-analysis'] },
  { title: 'Financial Reports',   skills: ['financial-report-analyst','10k-digest','earnings-call-analysis'] },
  { title: 'Market Monitoring',   skills: ['insider-trading','institutional-ownership','dividend-analysis','short-interest'] },
  { title: 'Advanced Research',   skills: ['competitor-analysis','industry-map','options-analysis','portfolio-review','sector-analysis','stock-screener','catalyst-calendar','bear-case','position-ladder','thesis-tracker','etf-analysis','earnings-preview','tax-lens','risk-stress-test'] },
  { title: 'Meta & Output',       skills: ['full-report','report-generator','chart-master','result-validator','learning-coach','fact-check'] },
  // Redirect stubs kept for backwards compatibility — installed, but not counted as frameworks.
  { title: 'Aliases (redirects)', skills: ['fundamental-analysis','dcf-valuation','research-bundle'] },
];

// Extract a page title and a one-line summary from a prompt's markdown.
function describePrompt(raw, name) {
  const lines = raw.split('\n');
  const h1 = lines.find(l => /^#\s+/.test(l));
  const title = h1 ? h1.replace(/^#\s+/, '').trim() : '';
  // Prefer the SKILL.md frontmatter description — it is the one-line summary
  // the author wrote. Fall back to the first prose paragraph of the prompt,
  // skipping the contract boilerplate (Data Verification / Data & Sources),
  // tables, lists, fences, and blockquotes.
  let summary = '';
  if (name) {
    const skillFile = path.join(__dirname, '..', '..', 'plugins', 'us-stock-analysis', 'skills', name, 'SKILL.md');
    if (fs.existsSync(skillFile)) {
      const m = fs.readFileSync(skillFile, 'utf8').match(/^---\n[\s\S]*?^description:\s*(.+)$[\s\S]*?^---/m);
      if (m) summary = m[1].trim().replace(/^(["'])(.*)\1$/, '$2');
    }
    // Aliases: the redirect note ("This skill has been merged into …") says it best.
    if (skillRegistry.ALIAS_SKILLS.includes(name)) {
      const q = lines.find(l => /^>\s*\*\*This skill has been/.test(l));
      if (q) summary = q.replace(/^>\s*/, '');
    }
  }
  if (!summary) {
    let inFence = false;
    for (let i = (h1 ? lines.indexOf(h1) + 1 : 0); i < lines.length; i++) {
      const t = lines[i].trim();
      if (t.startsWith('```')) { inFence = !inFence; continue; }
      if (inFence || !t || /^[#>|\-*\d]/.test(t) || /^(Before running any analysis|The first thing in the output|Never silently)/.test(t)) continue;
      summary = t;
      break;
    }
  }
  summary = summary.replace(/\*\*/g, '').replace(/`/g, '');
  if (summary.length > 180) summary = summary.slice(0, 177).trimEnd() + '…';
  return { title, summary };
}

// Register skill pages as served BEFORE rendering anything that links to them.
const skillMeta = {};
for (const name of promptFiles) {
  SERVED.add(`skill-${name}.html`);
  const raw = fs.readFileSync(path.join(PROMPTS_DIR, `${name}.md`), 'utf8');
  skillMeta[name] = { raw, ...describePrompt(raw, name) };
}


// Presentation metadata per category (icon, accent slot, blurbs). Kept apart
// from SKILL_CATEGORIES so that array stays a plain title + skills list
// (scripts/new-skill.js and test-skills.js parse it by shape).
const CATEGORY_META = {
  'Core Stock Analysis': {
    slug: 'core-stock-analysis', color: 1,
    icon: '<path d="M3 3v18h18"/><path d="m7 15 4-6 4 3 5-8"/>',
    zh: '核心股票分析',
    blurb: { en: 'Fundamentals, technicals, valuation and macro — the four pillars behind any stock call.',
             zh: '基本面、技術面、估值與總經——任何一檔股票判斷背後的四大支柱。' },
  },
  'Financial Reports': {
    slug: 'financial-reports', color: 2,
    icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>',
    zh: '財務報告',
    blurb: { en: 'Deep-read 10-Ks, 10-Qs and earnings calls — structured digests with sourced references.',
             zh: '深度閱讀 10-K、10-Q 與法說會——附來源引用的結構化摘要。' },
  },
  'Market Monitoring': {
    slug: 'market-monitoring', color: 3,
    icon: '<circle cx="12" cy="12" r="3"/><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/>',
    zh: '市場監控',
    blurb: { en: 'Follow the smart money — insider Form 4s, 13F holdings, short interest and capital returns.',
             zh: '跟蹤聰明錢——內部人 Form 4、13F 持股、空單餘額與資本回饋。' },
  },
  'Advanced Research': {
    slug: 'advanced-research', color: 4,
    icon: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/>',
    zh: '進階研究',
    blurb: { en: 'Moats, industry maps, options, screening, risk, tax, position sizing and thesis tracking.',
             zh: '護城河、產業鏈、選擇權、篩選、風險、稅務、部位規劃與論點追蹤。' },
  },
  'Meta & Output': {
    slug: 'meta--output', color: 5,
    icon: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12h8M8 8h8M8 16h5"/>',
    zh: '整合與輸出',
    blurb: { en: 'Chain skills into a full report, chart it, validate it, fact-check it, and learn from it.',
             zh: '把多個技能串成完整報告、繪圖、驗證、事實查核，並從中學習。' },
  },
  'Aliases (redirects)': {
    slug: 'aliases-redirects', color: 6, hidden: true,
    icon: '<polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    zh: '別名（轉向）',
    blurb: { en: 'Kept for backwards compatibility — each redirects to the skill that absorbed it.',
             zh: '為了向後相容而保留——每個都轉向吸收它的技能。' },
  },
};
const categoryOf = (name) => (SKILL_CATEGORIES.find(c => c.skills.includes(name)) || { title: 'Other' }).title;

// ---------------------------------------------------------------------------
// Page config: title, subtitle, source file, raw URL
// ---------------------------------------------------------------------------
const PAGES = [
  {
    key: 'home',
    outFile: 'index.html',
    srcFile: 'README.md',
    title: 'Quick Start',
    subtitle: 'Getting Started with InvestSkill',
  },
  {
    key: 'learning',
    outFile: 'learning.html',
    srcFile: 'site/content/LEARNING.md',
    title: 'Learning',
    subtitle: "An investor's field guide — from first principles to the metrics behind every skill",
  },
  {
    key: 'learning-foundations',
    outFile: 'learning-foundations.html',
    srcFile: 'site/content/LEARNING-FOUNDATIONS.md',
    title: 'Investing Foundations',
    subtitle: 'Lesson 1 · Shares, markets, risk vs. return, and compounding',
  },
  {
    key: 'learning-statements',
    outFile: 'learning-statements.html',
    srcFile: 'site/content/LEARNING-STATEMENTS.md',
    title: 'Reading Financial Statements',
    subtitle: 'Lesson 2 · Income statement, balance sheet, and cash flow',
  },
  {
    key: 'learning-quality',
    outFile: 'learning-quality.html',
    srcFile: 'site/content/LEARNING-QUALITY.md',
    title: 'Judging Business Quality',
    subtitle: 'Lesson 3 · Returns on capital, margins, moats, and capital allocation',
  },
  {
    key: 'learning-valuation',
    outFile: 'learning-valuation.html',
    srcFile: 'site/content/LEARNING-VALUATION.md',
    title: 'Valuation Essentials',
    subtitle: 'Lesson 4 · Price vs. value, DCF, multiples, and margin of safety',
  },
  {
    key: 'learning-market',
    outFile: 'learning-market.html',
    srcFile: 'site/content/LEARNING-MARKET.md',
    title: 'Reading the Market',
    subtitle: 'Lesson 5 · Technicals, positioning signals, and the macro backdrop',
  },
  {
    key: 'learning-portfolio',
    outFile: 'learning-portfolio.html',
    srcFile: 'site/content/LEARNING-PORTFOLIO.md',
    title: 'Portfolio & Risk',
    subtitle: 'Lesson 6 · Allocation, sizing, rebalancing, and behavioral pitfalls',
  },
  {
    key: 'learning-playbook',
    outFile: 'learning-playbook.html',
    srcFile: 'site/content/LEARNING-PLAYBOOK.md',
    title: "The Professional's Playbook",
    subtitle: 'Lesson 7 · A worked end-to-end case study — plan, analysis, trading plan, and tracking',
  },
  {
    key: 'learning-case-amd',
    outFile: 'learning-case-amd.html',
    srcFile: 'site/content/LEARNING-CASE-AMD.md',
    title: 'Case Study: AMD',
    subtitle: 'Lesson 8 · The playbook run end-to-end on AMD — a cyclical AI-semiconductor name',
  },
  {
    key: 'learning-setup',
    outFile: 'learning-setup.html',
    srcFile: 'site/content/LEARNING-SETUP.md',
    title: 'Before Your First Trade',
    subtitle: 'Lesson 9 · Goals, risk capacity, the one-page IPS, accounts, brokers, order types, T+1',
  },
  {
    key: 'learning-etfs',
    outFile: 'learning-etfs.html',
    srcFile: 'site/content/LEARNING-ETFS.md',
    title: 'ETFs & Index Investing',
    subtitle: 'Lesson 10 · Expense ratio, tracking difference, liquidity, what you own, overlap, structure warnings',
  },
  {
    key: 'learning-taxes',
    outFile: 'learning-taxes.html',
    srcFile: 'site/content/LEARNING-TAXES.md',
    title: 'Taxes & Account Types',
    subtitle: 'Lesson 11 · What you actually keep — US rules, and a full section for non-US investors',
  },
  {
    key: 'learning-earnings',
    outFile: 'learning-earnings.html',
    srcFile: 'site/content/LEARNING-EARNINGS.md',
    title: 'Earnings Season, Explained',
    subtitle: 'Lesson 12 · The cycle, consensus and guidance, beat-and-drop, the implied move, what not to do',
  },
  {
    key: 'learning-psychology',
    outFile: 'learning-psychology.html',
    srcFile: 'site/content/LEARNING-PSYCHOLOGY.md',
    title: 'Psychology & Process',
    subtitle: 'Lesson 13 · Process vs. outcome, the biases and their antidotes, pre-mortems, journals, sell rules',
  },
  {
    key: 'learning-case-pass',
    outFile: 'learning-case-pass.html',
    srcFile: 'site/content/LEARNING-CASE-PASS.md',
    title: 'Case Study: When the Answer Is No',
    subtitle: 'Capstone · The professional loop ending in a pass — PFE (value trap) and UPST (no trade)',
  },
  {
    key: 'learning-zh-tw',
    outFile: 'learning-zh-tw.html',
    srcFile: 'site/content/LEARNING-zh-TW.md',
    title: '學習中心',
    subtitle: '投資人的實戰指南——從第一原理到每項技能背後的指標',
  },
  {
    key: 'learning-foundations-zh-tw',
    outFile: 'learning-foundations-zh-tw.html',
    srcFile: 'site/content/LEARNING-FOUNDATIONS-zh-TW.md',
    title: '投資基礎',
    subtitle: '第 1 課 · 股票、市場、風險 vs. 報酬與複利',
  },
  {
    key: 'learning-statements-zh-tw',
    outFile: 'learning-statements-zh-tw.html',
    srcFile: 'site/content/LEARNING-STATEMENTS-zh-TW.md',
    title: '讀懂財務報表',
    subtitle: '第 2 課 · 損益表、資產負債表與現金流量表',
  },
  {
    key: 'learning-quality-zh-tw',
    outFile: 'learning-quality-zh-tw.html',
    srcFile: 'site/content/LEARNING-QUALITY-zh-TW.md',
    title: '判斷企業品質',
    subtitle: '第 3 課 · 資本報酬、利潤率、護城河與資本配置',
  },
  {
    key: 'learning-valuation-zh-tw',
    outFile: 'learning-valuation-zh-tw.html',
    srcFile: 'site/content/LEARNING-VALUATION-zh-TW.md',
    title: '估值入門',
    subtitle: '第 4 課 · 價格 vs. 價值、DCF、乘數與安全邊際',
  },
  {
    key: 'learning-market-zh-tw',
    outFile: 'learning-market-zh-tw.html',
    srcFile: 'site/content/LEARNING-MARKET-zh-TW.md',
    title: '解讀市場訊號',
    subtitle: '第 5 課 · 技術面、籌碼訊號與總經環境',
  },
  {
    key: 'learning-portfolio-zh-tw',
    outFile: 'learning-portfolio-zh-tw.html',
    srcFile: 'site/content/LEARNING-PORTFOLIO-zh-TW.md',
    title: '投資組合與風險',
    subtitle: '第 6 課 · 資產配置、部位大小、再平衡與行為陷阱',
  },
  {
    key: 'learning-playbook-zh-tw',
    outFile: 'learning-playbook-zh-tw.html',
    srcFile: 'site/content/LEARNING-PLAYBOOK-zh-TW.md',
    title: '專業投資人的實戰劇本',
    subtitle: '第 7 課 · 完整端到端案例——計畫、分析、交易計畫與追蹤',
  },
  {
    key: 'learning-case-amd-zh-tw',
    outFile: 'learning-case-amd-zh-tw.html',
    srcFile: 'site/content/LEARNING-CASE-AMD-zh-TW.md',
    title: '案例研究：AMD',
    subtitle: '第 8 課 · 把劇本完整跑在 AMD 上——一檔週期性 AI 半導體股',
  },
  {
    key: 'learning-setup-zh-tw',
    outFile: 'learning-setup-zh-tw.html',
    srcFile: 'site/content/LEARNING-SETUP-zh-TW.md',
    title: '第一筆交易之前',
    subtitle: '第 9 課 · 目標、風險能力、一頁 IPS、帳戶、券商、下單類型、T+1',
  },
  {
    key: 'learning-etfs-zh-tw',
    outFile: 'learning-etfs-zh-tw.html',
    srcFile: 'site/content/LEARNING-ETFS-zh-TW.md',
    title: 'ETF 與指數投資',
    subtitle: '第 10 課 · 費用率、追蹤差異、流動性、實際持有什麼、重疊、結構警示',
  },
  {
    key: 'learning-taxes-zh-tw',
    outFile: 'learning-taxes-zh-tw.html',
    srcFile: 'site/content/LEARNING-TAXES-zh-TW.md',
    title: '稅與帳戶類型',
    subtitle: '第 11 課 · 你實際留下多少——美國規則，以及給非美國投資人的完整章節',
  },
  {
    key: 'learning-earnings-zh-tw',
    outFile: 'learning-earnings-zh-tw.html',
    srcFile: 'site/content/LEARNING-EARNINGS-zh-TW.md',
    title: '財報季解析',
    subtitle: '第 12 課 · 週期、共識與指引、超預期卻下跌、隱含波動、不該做的事',
  },
  {
    key: 'learning-psychology-zh-tw',
    outFile: 'learning-psychology-zh-tw.html',
    srcFile: 'site/content/LEARNING-PSYCHOLOGY-zh-TW.md',
    title: '心理與流程',
    subtitle: '第 13 課 · 程序 vs. 結果、偏誤與解方、事前驗屍、日誌、賣出規則',
  },
  {
    key: 'learning-case-pass-zh-tw',
    outFile: 'learning-case-pass-zh-tw.html',
    srcFile: 'site/content/LEARNING-CASE-PASS-zh-TW.md',
    title: '案例研究：當答案是「不」',
    subtitle: '總整理 · 專業流程以「放棄」收尾——PFE（價值陷阱）與 UPST（不交易）',
  },
  {
    key: 'concepts',
    outFile: 'concepts.html',
    srcFile: 'site/content/CONCEPTS.md',
    title: 'Concepts',
    subtitle: 'The mental models behind the metrics',
  },
  {
    key: 'glossary',
    outFile: 'glossary.html',
    srcFile: 'site/content/GLOSSARY.md',
    title: 'Glossary',
    subtitle: 'Plain-English definitions for every metric',
  },
  {
    key: 'choose-a-skill',
    outFile: 'choose-a-skill.html',
    srcFile: 'site/content/CHOOSE-A-SKILL.md',
    title: 'Choose a Skill',
    subtitle: 'Map your goal to the right framework',
  },
  {
    key: 'use-cases',
    outFile: 'use-cases.html',
    srcFile: 'site/content/USE-CASES.md',
    title: 'Use Cases',
    subtitle: 'End-to-end journeys by investor type',
  },
  {
    key: 'data-and-accuracy',
    outFile: 'data-and-accuracy.html',
    srcFile: 'site/content/DATA-AND-ACCURACY.md',
    title: 'Data & Accuracy',
    subtitle: 'Where the numbers come from and how to trust them',
  },
  {
    key: 'full-demo',
    outFile: 'full-demo.html',
    srcFile: 'site/content/FULL-DEMO.md',
    title: 'Demo Overview',
    subtitle: 'All-skills analysis demos: META & NVDA 10-K deep dives · PLTR (English) · AMD & RKLB (繁體中文)',
  },
  {
    key: 'full-demo-meta',
    outFile: 'full-demo-meta.html',
    srcFile: 'site/content/FULL-DEMO-META.md',
    title: 'META 10-K Deep Dive',
    subtitle: 'Meta Platforms FY2025 annual report — a nine-skill walkthrough of one filing (English)',
  },
  {
    key: 'full-demo-nvda',
    outFile: 'full-demo-nvda.html',
    srcFile: 'site/content/FULL-DEMO-NVDA.md',
    title: 'NVDA 10-K Deep Dive',
    subtitle: 'NVIDIA FY2026 annual report — a financial-report-analyst deep read (English)',
  },
  {
    key: 'full-demo-amd',
    outFile: 'full-demo-amd.html',
    srcFile: 'site/content/FULL-DEMO-AMD.md',
    title: 'AMD 10-K 深度解析',
    subtitle: 'Advanced Micro Devices FY2025 年報 — financial-report-analyst 深度解讀（繁體中文）',
  },
  {
    key: 'full-demo-pltr',
    outFile: 'full-demo-pltr.html',
    srcFile: 'site/content/FULL-DEMO-PLTR.md',
    title: 'PLTR Full Demo',
    subtitle: 'All 15 InvestSkill analyses — Palantir Technologies (English)',
  },
  {
    key: 'full-demo-rklb',
    outFile: 'full-demo-rklb.html',
    srcFile: 'site/content/FULL-DEMO-RKLB.md',
    title: 'RKLB 完整示範',
    subtitle: 'Rocket Lab USA — 全部 15 項技能分析（繁體中文）',
  },
  {
    key: 'cookbook',
    outFile: 'cookbook.html',
    srcFile: 'site/content/COOKBOOK.md',
    title: 'Cookbook',
    subtitle: 'Practical examples and workflows',
  },
  {
    key: 'cookbook-zh-tw',
    outFile: 'cookbook-zh-tw.html',
    srcFile: 'site/content/COOKBOOK-zh-TW.md',
    title: '操作手冊',
    subtitle: '實用範例與工作流程',
  },
  {
    key: 'contributing',
    outFile: 'contributing.html',
    srcFile: 'CONTRIBUTING.md',
    title: 'Contributing',
    subtitle: 'How to contribute to InvestSkill',
  },
  {
    key: 'changelog',
    outFile: 'changelog.html',
    srcFile: 'CHANGELOG.md',
    title: 'Changelog',
    subtitle: 'Release history and changes',
  },
  {
    key: 'zh-tw',
    outFile: 'zh-tw.html',
    srcFile: 'README-zh-TW.md',
    title: '快速開始',
    subtitle: 'InvestSkill 入門指南——讓任何 AI 成為你的美股分析師',
  },
  {
    key: 'concepts-zh-tw',
    outFile: 'concepts-zh-tw.html',
    srcFile: 'site/content/CONCEPTS-zh-TW.md',
    title: '概念與思維模型',
    subtitle: '指標背後的思維模型',
  },
  {
    key: 'glossary-zh-tw',
    outFile: 'glossary-zh-tw.html',
    srcFile: 'site/content/GLOSSARY-zh-TW.md',
    title: '財務術語表',
    subtitle: '每個指標的白話定義',
  },
  {
    key: 'choose-a-skill-zh-tw',
    outFile: 'choose-a-skill-zh-tw.html',
    srcFile: 'site/content/CHOOSE-A-SKILL-zh-TW.md',
    title: '選擇技能',
    subtitle: '把你的目標對應到合適的框架',
  },
  {
    key: 'use-cases-zh-tw',
    outFile: 'use-cases-zh-tw.html',
    srcFile: 'site/content/USE-CASES-zh-TW.md',
    title: '使用情境與旅程',
    subtitle: '依投資人類型的端到端旅程',
  },
  {
    key: 'data-and-accuracy-zh-tw',
    outFile: 'data-and-accuracy-zh-tw.html',
    srcFile: 'site/content/DATA-AND-ACCURACY-zh-TW.md',
    title: '資料與準確性',
    subtitle: '數字從何而來，以及如何信任它們',
  },
];

// ---------------------------------------------------------------------------
// Template helpers
// ---------------------------------------------------------------------------
// Small feather-style icon per nav section (icon-led sidebar, CrewAI-style).
const SECTION_ICONS = {
  'Introduction': '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  'Learning':     '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 2 2.7 3 6 3s6-1 6-3v-5"/>',
  'Learn':        '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  'Guides':       '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/>',
  'Demo':         '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
  'Trust':        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'Reference':    '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  // Traditional Chinese section titles
  '介紹':          '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  '學習':          '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 2 2.7 3 6 3s6-1 6-3v-5"/>',
  '學習資源':      '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  '指南':          '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/>',
  '示範':          '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
  '信任':          '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
};

function navIcon(sectionTitle) {
  const paths = SECTION_ICONS[sectionTitle] || '<circle cx="12" cy="12" r="9"/>';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

// Language of a page, derived from its output filename.
// These demos are fully Traditional Chinese content, so they belong to the
// zh site even though their filenames don't carry the -zh-tw suffix.
const ZH_CONTENT_DEMOS = new Set(['full-demo-rklb.html', 'full-demo-amd.html']);
function langOf(outFile) {
  if (ZH_CONTENT_DEMOS.has(outFile)) return 'zh';
  return (outFile === 'zh-tw.html' || outFile.endsWith('-zh-tw.html')) ? 'zh' : 'en';
}

function buildNav(lang, currentPage) {
  return NAV[lang].map(section => {
    const icon = navIcon(section.title);
    const links = section.links.map(link => {
      const active = link.page === currentPage ? ' active' : '';
      return `        <a href="${link.href}" class="nav-link${active}">${icon}<span>${link.label}</span></a>`;
    }).join('\n');
    return `      <div class="nav-section">
        <div class="nav-section-title">${section.title}</div>
${links}
      </div>`;
  }).join('\n');
}

// The nav section a page belongs to (English skill pages live under Guides).
function sectionOf(lang, pageKey) {
  if (pageKey === 'skills') return 'Guides';
  for (const section of NAV[lang]) {
    if (section.links.some(l => l.page === pageKey)) return section.title;
  }
  return NAV[lang][0].title;
}

// Eyebrow label above the page title = the nav section the page lives in.
function eyebrowFor(lang, pageKey) {
  if (pageKey === 'skills') return 'Skill Reference';
  return sectionOf(lang, pageKey);
}

// Horizontal sub-nav tabs (below the header), per language.
const TABS = {
  en: [
    { label: 'Home',       section: 'Introduction', href: 'index.html' },
    { label: 'Learning',   section: 'Learning',     href: 'learning.html' },
    { label: 'Learn',      section: 'Learn',        href: 'concepts.html' },
    { label: 'Guides',     section: 'Guides',       href: 'cookbook.html' },
    { label: 'Skills',     section: 'Guides',       href: 'skills.html' },
    { label: 'Demos',      section: 'Demo',         href: 'full-demo.html' },
    { label: 'Trust',      section: 'Trust',        href: 'data-and-accuracy.html' },
    { label: 'Changelog',  section: 'Reference',    href: 'changelog.html' },
  ],
  zh: [
    { label: '首頁',       section: '介紹',         href: 'zh-tw.html' },
    { label: '學習',       section: '學習',         href: 'learning-zh-tw.html' },
    { label: '學習資源',   section: '學習資源',     href: 'concepts-zh-tw.html' },
    { label: '指南',       section: '指南',         href: 'cookbook-zh-tw.html' },
    { label: '示範',       section: '示範',         href: 'full-demo-rklb.html' },
    { label: '信任',       section: '信任',         href: 'data-and-accuracy-zh-tw.html' },
  ],
};

const TAB_ICONS = {
  'Home':      '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  'Learning':  '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 2 2.7 3 6 3s6-1 6-3v-5"/>',
  'Learn':     '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  'Guides':    '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/>',
  'Skills':    '<path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L3 18v3h3l6.1-6.1a4 4 0 0 0 5.6-5.6l-2.9 2.9-2-2z"/>',
  'Demos':     '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
  'Trust':     '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'Changelog': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  '首頁':       '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  '學習':       '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 2 2.7 3 6 3s6-1 6-3v-5"/>',
  '學習資源':   '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  '指南':       '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/>',
  '示範':       '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
  '信任':       '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
};

function buildSubnav(lang, currentPage) {
  const activeSection = sectionOf(lang, currentPage);
  const tabs = TABS[lang].map(tab => {
    // "Skills" tab is active only on skill pages; "Guides" for other Guides pages.
    let active = false;
    if (tab.label === 'Skills')        active = currentPage === 'skills';
    else if (tab.section === 'Guides') active = activeSection === 'Guides' && currentPage !== 'skills';
    else                               active = tab.section === activeSection;
    const icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${TAB_ICONS[tab.label] || ''}</svg>`;
    return `      <a href="${tab.href}" class="subnav-tab${active ? ' active' : ''}">${icon}<span>${tab.label}</span></a>`;
  }).join('\n');
  return `<nav class="subnav">
    <div class="subnav-inner">
${tabs}
    </div>
  </nav>`;
}

// Header language switcher: links to this page's counterpart in each language.
function buildLangSwitch(lang, outFile) {
  const enHref = lang === 'en' ? outFile : (ZH_TO_EN[outFile] || 'index.html');
  const zhHref = lang === 'zh' ? outFile : (EN_TO_ZH[outFile] || 'zh-tw.html');
  const opt = (href, label, code) =>
    `<a href="${href}" class="lang-opt${lang === code ? ' active' : ''}">${label}</a>`;
  return `<details class="lang-menu">
      <summary class="icon-btn" aria-label="Language" title="Language">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
      </summary>
      <div class="lang-menu-panel">
        ${opt(enHref, 'English', 'en')}
        ${opt(zhHref, '繁體中文', 'zh')}
      </div>
    </details>`;
}

// ---------------------------------------------------------------------------
// Install picker (landing pages)
// ---------------------------------------------------------------------------
// One curl command per AI agent, mirroring `install.sh -a <agent>`. Keep this
// list in sync with the AGENTS list in install.sh.
const INSTALL_URL = `https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh`;
const INSTALL_TARGETS = [
  {
    id: 'claude', label: 'Claude Code', icon: '🟣', path: '.claude/skills/',
    then: '/stock-eval AAPL',
    note: {
      en: 'Installs all skills as Claude Code skills — slash commands work out of the box.',
      zh: '將所有技能安裝為 Claude Code skills——斜線指令立即可用。',
    },
  },
  {
    id: 'cursor', label: 'Cursor', icon: '⚡', path: '.cursor/rules/investskill.mdc',
    then: '@.investskill/prompts/stock-eval.md Evaluate Apple',
    note: {
      en: 'Adds a Cursor rule that points the agent at the frameworks.',
      zh: '新增一條 Cursor rule，讓 AI 知道去哪裡讀框架。',
    },
  },
  {
    id: 'copilot', label: 'GitHub Copilot', icon: '🐙', path: '.github/copilot-instructions.md',
    then: '#file:.investskill/prompts/stock-eval.md Evaluate Apple',
    note: {
      en: 'Appends an instructions block — your existing file is preserved.',
      zh: '在指令檔尾端附加一段區塊——原有內容不會被覆蓋。',
    },
  },
  {
    id: 'gemini', label: 'Gemini CLI', icon: '✨', path: 'GEMINI.md',
    then: '@.investskill/prompts/stock-eval.md Evaluate Apple',
    note: {
      en: 'Gemini CLI loads GEMINI.md automatically on start.',
      zh: 'Gemini CLI 啟動時會自動載入 GEMINI.md。',
    },
  },
  {
    id: 'codex', label: 'Codex', icon: '🧠', path: 'AGENTS.md',
    then: 'Evaluate AAPL using the stock-eval framework',
    note: {
      en: 'Uses the AGENTS.md convention — read by Codex on every run.',
      zh: '採用 AGENTS.md 慣例——Codex 每次執行都會讀取。',
    },
  },
  {
    id: 'opencode', label: 'OpenCode', icon: '◨', path: 'AGENTS.md',
    then: 'Evaluate AAPL using the stock-eval framework',
    note: {
      en: 'Same AGENTS.md block — works with any agent that reads it.',
      zh: '同樣是 AGENTS.md 區塊——任何讀取它的 agent 都適用。',
    },
  },
  {
    id: 'any', label: 'Any LLM', icon: '📋', path: '.investskill/prompts/',
    then: 'cat .investskill/prompts/stock-eval.md',
    note: {
      en: 'Just the markdown — paste a framework into ChatGPT, Claude.ai, or a local model.',
      zh: '只安裝 markdown——複製任一框架貼到 ChatGPT、Claude.ai 或本地模型。',
    },
  },
];

function buildInstaller(lang) {
  const T = lang === 'zh'
    ? { eyebrow: '安裝', title: '一行指令，裝進任何 AI 代理',
        desc: `選擇你的 AI 工具，複製指令執行即可。安裝腳本會把 ${FRAMEWORK_COUNT} 個框架放進專案，並幫你接上該工具的設定檔。`,
        copy: '複製', copied: '已複製', then: '接著輸入', script: '檢視安裝腳本' }
    : { eyebrow: 'Install', title: 'One command for any AI agent',
        desc: `Pick your tool, copy the command, run it. The script drops the ${FRAMEWORK_COUNT} frameworks into your project and wires up that tool's config file.`,
        copy: 'Copy', copied: 'Copied', then: 'Then run', script: 'Read the install script' };

  const tabs = INSTALL_TARGETS.map((t, i) =>
    `<button class="install-tab${i === 0 ? ' active' : ''}" data-install-tab="${t.id}" type="button" role="tab" aria-selected="${i === 0}">
          <span class="install-tab-icon" aria-hidden="true">${t.icon}</span>${t.label}
        </button>`).join('\n        ');

  const panels = INSTALL_TARGETS.map((t, i) => {
    const cmd = `curl -fsSL ${INSTALL_URL} | bash -s -- -a ${t.id}`;
    return `<div class="install-panel${i === 0 ? ' active' : ''}" data-install-panel="${t.id}" role="tabpanel">
          <div class="install-panel-head">
            <span class="install-panel-title">${t.label}</span>
            <code class="install-path">${t.path}</code>
            <button class="install-copy" type="button" data-copied-label="${T.copied}">${T.copy}</button>
          </div>
          <pre class="install-cmd"><code>${cmd}</code></pre>
          <p class="install-note">${t.note[lang]}</p>
          <p class="install-then"><span class="install-then-label">${T.then}</span><code>${t.then}</code></p>
        </div>`;
  }).join('\n        ');

  return `
    <section class="installer" id="install">
      <div class="install-head">
        <p class="install-eyebrow">${T.eyebrow}</p>
        <h2>${T.title}</h2>
        <p class="install-desc">${T.desc}</p>
      </div>
      <div class="install-tabs" role="tablist">
        ${tabs}
      </div>
      <div class="install-panels">
        ${panels}
      </div>
      <p class="install-foot">
        <a href="${GITHUB_BLOB}/install.sh" target="_blank" rel="noopener noreferrer">${T.script}</a>
      </p>
    </section>
`;
}

// ---------------------------------------------------------------------------
// Shared UI strings
// ---------------------------------------------------------------------------
const UI = {
  en: {
    onThisPage: 'On this page', copyMd: 'Copy Markdown', openRaw: 'Open Raw',
    prev: 'Previous', next: 'Next', backTop: 'Back to top',
    footerTag: 'Structured investment-analysis frameworks for any AI assistant. Just markdown — no API keys, no runtime.',
    footerCols: [
      { title: 'Learn',   links: [['Learning Hub','learning.html'],['Concepts','concepts.html'],['Glossary','glossary.html'],['Choose a Skill','choose-a-skill.html'],['Use Cases','use-cases.html']] },
      { title: 'Guides',  links: [['Quick Start','index.html'],['Cookbook','cookbook.html'],['Skill Reference','skills.html'],['Demos','full-demo.html'],['Data & Accuracy','data-and-accuracy.html']] },
      { title: 'Project', links: [['GitHub','https://github.com/yennanliu/InvestSkill'],['Changelog','changelog.html'],['Contributing','contributing.html'],['Issues','https://github.com/yennanliu/InvestSkill/issues'],['MIT License','https://github.com/yennanliu/InvestSkill/blob/main/LICENSE']] },
    ],
    disclaimer: 'Educational frameworks only — not financial advice.',
    readme: 'From the README',
    runTitle: 'Run this skill', runIn: 'Claude Code', runOther: 'Cursor / Gemini CLI', runAny: 'Any LLM',
    related: 'More in',
    filterPlaceholder: 'Filter frameworks — try valuation, 13F, tax…', filterAll: 'All', noMatch: 'No framework matches that filter.',
  },
  zh: {
    onThisPage: '本頁內容', copyMd: '複製 Markdown', openRaw: '開啟原始檔',
    prev: '上一頁', next: '下一頁', backTop: '回到頂部',
    footerTag: '給任何 AI 助理的結構化投資分析框架。純 markdown——沒有 API 金鑰、沒有執行環境。',
    footerCols: [
      { title: '學習',   links: [['學習中心','learning-zh-tw.html'],['概念','concepts-zh-tw.html'],['術語表','glossary-zh-tw.html'],['選擇技能','choose-a-skill-zh-tw.html'],['使用情境','use-cases-zh-tw.html']] },
      { title: '指南',   links: [['快速開始','zh-tw.html'],['操作手冊','cookbook-zh-tw.html'],['技能參考（英文）','skills.html'],['示範','full-demo-rklb.html'],['資料與準確性','data-and-accuracy-zh-tw.html']] },
      { title: '專案',   links: [['GitHub','https://github.com/yennanliu/InvestSkill'],['更新紀錄（英文）','changelog.html'],['參與貢獻（英文）','contributing.html'],['回報問題','https://github.com/yennanliu/InvestSkill/issues'],['MIT 授權','https://github.com/yennanliu/InvestSkill/blob/main/LICENSE']] },
    ],
    disclaimer: '僅供教育用途的框架——不構成投資建議。',
    readme: '完整說明（README）',
    runTitle: '執行這個技能', runIn: 'Claude Code', runOther: 'Cursor / Gemini CLI', runAny: '任何 LLM',
    related: '同類技能',
    filterPlaceholder: '篩選框架', filterAll: '全部', noMatch: '沒有符合的框架。',
  },
};

const svg = (paths, size = 16) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ARROW_R = '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>';
const ARROW_L = '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>';
const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Wrap tables so wide ones scroll horizontally instead of breaking the layout.
function wrapTables(html) {
  return html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
}

// Landing pages render the README body below the marketing sections; the
// centred badge header at the top of the README duplicates the hero, so drop it.
function stripReadmeHeader(raw) {
  return raw.replace(/^<div align="center">[\s\S]*?<\/div>\s*\n(?:---\s*\n)?/, '');
}

// ---------------------------------------------------------------------------
// Landing page sections (home + zh homepage)
// ---------------------------------------------------------------------------
const LANDING = {
  en: {
    headline: 'Turn any AI into your <em>stock analyst</em>.',
    lead: `${FRAMEWORK_COUNT} structured analysis frameworks — fundamentals, valuation, filings, positioning, risk — that any AI assistant can run. Just markdown. No API keys, no fees, no runtime.`,
    ctaPrimary: 'Get started', ctaSecondary: 'Browse frameworks', ctaLearn: 'Start learning',
    stats: [[String(FRAMEWORK_COUNT), 'Analysis frameworks'], ['$0', 'No API keys · no fees'], ['MIT', 'Open source'], ['2', 'Languages · EN / 繁中']],
    platLabel: 'Runs on',
    howEyebrow: 'How it works', howTitle: 'Three steps to a signal',
    steps: [
      { t: 'Install', d: 'One curl command drops every framework into your project and wires up your agent’s own config file.', c: 'curl -fsSL …/install.sh | bash -s -- -a claude' },
      { t: 'Ask', d: 'Name a ticker and a framework in plain language, or use the slash command in Claude Code.', c: '/stock-eval AAPL' },
      { t: 'Read the signal', d: 'Every framework closes with the same INVESTMENT SIGNAL block — score 0–10, confidence, horizon, action.', c: 'Score 7.8 / 10 · BUY · HIGH' },
    ],
    catEyebrow: `${FRAMEWORK_COUNT} frameworks`, catTitle: 'Every angle of a stock, one skill each', catLink: 'Browse the full reference',
    learnEyebrow: 'Learn', learnTitle: 'New to investing? Start here.',
    learnLead: 'An eight-lesson field guide to the ideas behind every skill — from reading a balance sheet to holding a portfolio. Plain English, no finance degree required.',
    learnCta: 'Open the Learning Hub', lesson: 'Lesson',
    demoEyebrow: 'Demos', demoTitle: 'See real output before you install', demoLink: 'All demos',
    trustEyebrow: 'Trust', trustTitle: 'Built to be checked, not believed',
    trust: [
      { t: 'No API keys, no telemetry', d: 'Nothing runs on your machine and nothing phones home. InvestSkill never sees your tickers or holdings.' },
      { t: 'Sources on every number', d: 'Each analysis opens with a Data & Sources header, and fact-check re-verifies every claim against a primary source.' },
      { t: 'Educational, not advice', d: 'Frameworks teach a repeatable process. Read Data & Accuracy for where the numbers come from and how far to trust them.' },
    ],
    trustLink: 'Read Data & Accuracy',
    termTitle: 'claude · ~/portfolio',
  },
  zh: {
    headline: '讓任何 AI 成為你的<em>美股分析師</em>。',
    lead: `${FRAMEWORK_COUNT} 個結構化分析框架——基本面、估值、財報、籌碼、風險——任何 AI 助理都能執行。純 markdown，沒有 API 金鑰、沒有費用、沒有執行環境。`,
    ctaPrimary: '開始使用', ctaSecondary: '瀏覽框架', ctaLearn: '開始學習',
    stats: [[String(FRAMEWORK_COUNT), '分析框架'], ['$0', '零 API 金鑰 · 零費用'], ['MIT', '開源授權'], ['2', '語言 · 英文 / 繁中']],
    platLabel: '支援平台',
    howEyebrow: '運作方式', howTitle: '三步得到一個訊號',
    steps: [
      { t: '安裝', d: '一行 curl 指令把全部框架放進專案，並接上你 AI 工具自己的設定檔。', c: 'curl -fsSL …/install.sh | bash -s -- -a claude' },
      { t: '提問', d: '用自然語言說出股票代號與框架名稱，或在 Claude Code 使用斜線指令。', c: '/stock-eval AAPL' },
      { t: '讀訊號', d: '每個框架都以相同的 INVESTMENT SIGNAL 區塊收尾——0–10 分、信心度、期間、行動。', c: 'Score 7.8 / 10 · BUY · HIGH' },
    ],
    catEyebrow: `${FRAMEWORK_COUNT} 個框架`, catTitle: '一檔股票的每個切面，各由一個技能負責', catLink: '瀏覽完整技能參考',
    learnEyebrow: '學習', learnTitle: '投資新手？從這裡開始。',
    learnLead: '八堂課的實戰指南，講解每個技能背後的觀念——從讀懂資產負債表到管理投資組合。白話解說，不需要金融背景。',
    learnCta: '前往學習中心', lesson: '第',
    demoEyebrow: '示範', demoTitle: '安裝前先看真實輸出', demoLink: '全部示範',
    trustEyebrow: '信任', trustTitle: '設計來被驗證，而不是被相信',
    trust: [
      { t: '沒有 API 金鑰、沒有遙測', d: '你的機器上不執行任何程式，也不會回傳任何資料。InvestSkill 永遠看不到你的股票或持倉。' },
      { t: '每個數字都有來源', d: '每份分析都以「資料與來源」標頭開場，fact-check 技能會把每項主張對照第一手來源重新驗證。' },
      { t: '教育用途，不是投資建議', d: '框架教的是可重複的流程。請閱讀「資料與準確性」了解數字從何而來、能信到什麼程度。' },
    ],
    trustLink: '閱讀資料與準確性',
    termTitle: 'claude · ~/portfolio',
  },
};

const PLATFORMS = ['Claude Code', 'Cursor', 'Gemini CLI', 'Copilot', 'Codex', 'ChatGPT', 'Ollama'];

// Box-drawn INVESTMENT SIGNAL block with computed padding (mirrors the skills'
// closing block). Values are wrapped in <b> after padding so widths stay exact.
function signalBox(rows, width = 38) {
  const line = (l, r) => `║ ${l}${r}${' '.repeat(Math.max(0, width - 2 - l.length - r.length))} ║`;
  const out = ['╔' + '═'.repeat(width) + '╗', '║' + 'INVESTMENT SIGNAL'.padStart((width + 17) / 2).padEnd(width) + '║', '╠' + '═'.repeat(width) + '╣'];
  for (const row of rows) {
    if (!row) { out.push('╠' + '═'.repeat(width) + '╣'); continue; }
    const [k, v] = row;
    out.push(line(k.padEnd(13), v).replace(v + ' ', '<b>' + v + '</b> '));
  }
  out.push('╚' + '═'.repeat(width) + '╝');
  return out.join('\n');
}

// Animated terminal mock in the hero — each line fades in with a stagger.
function buildTerminal(lang) {
  const T = LANDING[lang];
  const lines = [
    ['cmd',  '/stock-eval AAPL'],
    ['dim',  lang === 'zh' ? '→ 讀取 10-K · 8 季財務 · Form 4 申報 …' : '→ Reading 10-K · 8 quarters · Form 4 filings …'],
    ['kv',   'Piotroski F-Score   <b>7 / 9</b>'],
    ['kv',   'ROIC (TTM)          <b>56.4%</b>'],
    ['kv',   'Moat                <b>Wide</b>  <i>brand · ecosystem lock-in</i>'],
    ['kv',   'DCF fair value      <b>$212</b>  <i>vs. $189 spot</i>'],
    ['box',  signalBox([
      ['Signal:', 'BULLISH'], ['Confidence:', 'HIGH'], ['Horizon:', 'LONG-TERM'], ['Score:', '7.8 / 10'],
      null, ['Action:', 'BUY'], ['Conviction:', 'STRONG'],
    ])],
  ];
  const body = lines.map(([kind, text], i) => {
    const prompt = kind === 'cmd' ? '<span class="term-prompt">❯</span> ' : '';
    return `<span class="term-line term-${kind}" style="--i:${i}">${prompt}${text}</span>`;
  }).join('\n');
  return `<div class="term" aria-hidden="true">
        <div class="term-bar"><span></span><span></span><span></span><span class="term-title">${T.termTitle}</span></div>
        <pre class="term-body">${body}</pre>
      </div>`;
}

function buildLandingHero(lang) {
  const T = LANDING[lang];
  const badge = `${SITE_VERSION ? SITE_VERSION + ' · ' : ''}${lang === 'zh' ? `${FRAMEWORK_COUNT} 項分析框架` : `${FRAMEWORK_COUNT} analysis frameworks`}`;
  return `
    <section class="landing-hero" id="top">
      <span class="hero-orbs" aria-hidden="true"></span>
      <div class="landing-hero-copy">
        <span class="hero-badge"><span class="hero-badge-dot"></span>${badge}</span>
        <h1>${T.headline}</h1>
        <p class="hero-lead">${T.lead}</p>
        <div class="hero-ctas">
          <a class="btn btn-primary btn-lg" href="#install">${T.ctaPrimary} ${svg(ARROW_R, 15)}</a>
          <a class="btn btn-lg" href="skills.html">${T.ctaSecondary}</a>
          <a class="btn btn-ghost btn-lg" href="${lang === 'zh' ? 'learning-zh-tw.html' : 'learning.html'}">${T.ctaLearn}</a>
        </div>
        <div class="hero-platforms">
          <span class="hero-plat-label">${T.platLabel}</span>
          ${PLATFORMS.map(p => `<span class="hero-chip">${p}</span>`).join('\n          ')}
        </div>
      </div>
      <div class="landing-hero-visual">
        ${buildTerminal(lang)}
      </div>
      <div class="hero-stats">
        ${T.stats.map(([n, lbl]) => `<div class="hero-stat"><span class="hero-stat-num">${n}</span><span class="hero-stat-label">${lbl}</span></div>`).join('\n        ')}
      </div>
    </section>`;
}

function sectionHead(eyebrow, title, link) {
  return `<div class="section-head">
        <div><p class="section-eyebrow">${eyebrow}</p><h2>${title}</h2></div>
        ${link ? `<a class="section-link" href="${link.href}">${link.label} ${svg(ARROW_R, 14)}</a>` : ''}
      </div>`;
}

function buildLandingSections(lang) {
  const T = LANDING[lang];
  const zh = lang === 'zh';

  const steps = T.steps.map((s, i) => `<li class="step reveal">
          <span class="step-num">${i + 1}</span>
          <h3>${s.t}</h3>
          <p>${s.d}</p>
          <code class="step-code">${escapeHtml(s.c)}</code>
        </li>`).join('\n        ');
  const how = `
    <section class="landing-section" id="how-it-works">
      ${sectionHead(T.howEyebrow, T.howTitle)}
      <ol class="steps">
        ${steps}
      </ol>
    </section>`;

  const cards = SKILL_CATEGORIES.filter(c => !(CATEGORY_META[c.title] || {}).hidden).map(c => {
    const m = CATEGORY_META[c.title] || { slug: githubSlug(c.title), color: 6, icon: '<circle cx="12" cy="12" r="9"/>', blurb: {} };
    const present = c.skills.filter(n => skillMeta[n]);
    const shown = present.slice(0, 5);
    const more = present.length - shown.length;
    return `<div class="cat-card reveal" style="--c: var(--cat-${m.color})">
          <div class="cat-card-head">
            <span class="cat-icon">${svg(m.icon, 20)}</span>
            <span class="cat-count">${present.length}</span>
          </div>
          <h3><a href="skills.html#${m.slug}">${zh && m.zh ? m.zh : c.title}</a></h3>
          <p>${m.blurb[lang] || ''}</p>
          <div class="cat-chips">
            ${shown.map(n => `<a class="chip" href="skill-${n}.html">${n}</a>`).join('\n            ')}
            ${more > 0 ? `<a class="chip chip-more" href="skills.html#${m.slug}">+${more}</a>` : ''}
          </div>
        </div>`;
  }).join('\n        ');
  const cats = `
    <section class="landing-section" id="frameworks">
      ${sectionHead(T.catEyebrow, T.catTitle, { href: 'skills.html', label: T.catLink })}
      <div class="cat-grid">
        ${cards}
      </div>
    </section>`;

  const learnSection = NAV[lang].find(s => s.title === (zh ? '學習' : 'Learning'));
  const lessons = learnSection.links.slice(1);
  const lessonCards = lessons.map((l, i) => {
    const label = l.label.replace(/^\d+\s*·\s*/, '');
    return `<a class="lesson-card reveal" href="${l.href}" style="--i:${i}">
          <span class="lesson-num">${zh ? `${T.lesson} ${i + 1} 課` : `${T.lesson} ${i + 1}`}</span>
          <span class="lesson-title">${label}</span>
          ${svg(ARROW_R, 14)}
        </a>`;
  }).join('\n        ');
  const learn = `
    <section class="landing-section" id="learn">
      ${sectionHead(T.learnEyebrow, T.learnTitle, { href: learnSection.links[0].href, label: T.learnCta })}
      <p class="section-lead">${T.learnLead}</p>
      <div class="lesson-track">
        ${lessonCards}
      </div>
    </section>`;

  const demoSection = NAV[lang].find(s => s.title === (zh ? '示範' : 'Demo'));
  const demoLinks = demoSection.links.filter(l => l.page !== 'full-demo');
  const demoCards = demoLinks.map(l => {
    const p = PAGES.find(pg => pg.key === l.page) || {};
    const ticker = (l.label.match(/\b[A-Z]{3,5}\b/) || [''])[0];
    return `<a class="demo-card reveal" href="${l.href}">
          <span class="demo-ticker">${ticker}</span>
          <span class="demo-title">${l.label}</span>
          <span class="demo-sub">${p.subtitle || ''}</span>
        </a>`;
  }).join('\n        ');
  const demos = `
    <section class="landing-section" id="demos">
      ${sectionHead(T.demoEyebrow, T.demoTitle, { href: 'full-demo.html', label: T.demoLink })}
      <div class="demo-grid">
        ${demoCards}
      </div>
    </section>`;

  const trustIcons = [
    '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>',
    '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 2 2.7 3 6 3s6-1 6-3v-5"/>',
  ];
  const trustCards = T.trust.map((t, i) => `<div class="trust-card reveal">
          <span class="trust-icon">${svg(trustIcons[i], 18)}</span>
          <h3>${t.t}</h3><p>${t.d}</p>
        </div>`).join('\n        ');
  const trust = `
    <section class="landing-section" id="trust">
      ${sectionHead(T.trustEyebrow, T.trustTitle, { href: zh ? 'data-and-accuracy-zh-tw.html' : 'data-and-accuracy.html', label: T.trustLink })}
      <div class="trust-grid">
        ${trustCards}
      </div>
    </section>`;

  return how + buildInstaller(lang) + cats + learn + demos + trust;
}

// ---------------------------------------------------------------------------
// Footer, pager, per-skill extras
// ---------------------------------------------------------------------------
function buildFooter(lang) {
  const U = UI[lang];
  const cols = U.footerCols.map(c => `<div class="footer-col">
        <p class="footer-col-title">${c.title}</p>
        ${c.links.map(([label, href]) => {
          const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
          return `<a href="${href}"${ext}>${label}</a>`;
        }).join('\n        ')}
      </div>`).join('\n      ');
  return `
    <footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo" href="${lang === 'zh' ? 'zh-tw.html' : 'index.html'}"><span class="logo-badge">IS</span><span class="logo-text">InvestSkill</span></a>
          <p>${U.footerTag}</p>
          ${SITE_VERSION ? `<span class="status-chip"><span class="dot"></span>${SITE_VERSION}</span>` : ''}
        </div>
        ${cols}
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getUTCFullYear()} InvestSkill · MIT</span>
        <span>${U.disclaimer}</span>
        <span class="footer-langs"><a href="index.html">English</a> · <a href="zh-tw.html">繁體中文</a></span>
      </div>
    </footer>`;
}

// Flattened nav order per language, for previous / next links.
const NAV_FLAT = { en: NAV.en.flatMap(s => s.links), zh: NAV.zh.flatMap(s => s.links) };
function buildPager(lang, items, currentHref) {
  const U = UI[lang];
  const i = items.findIndex(l => l.href === currentHref);
  if (i < 0) return '';
  const prev = items[i - 1], next = items[i + 1];
  if (!prev && !next) return '';
  const cell = (item, dir) => item
    ? `<a class="pager-link pager-${dir}" href="${item.href}">
          <span class="pager-dir">${dir === 'prev' ? svg(ARROW_L, 14) + ' ' + U.prev : U.next + ' ' + svg(ARROW_R, 14)}</span>
          <span class="pager-title">${item.label}</span>
        </a>`
    : '<span></span>';
  return `
    <nav class="pager" aria-label="Pagination">
        ${cell(prev, 'prev')}
        ${cell(next, 'next')}
    </nav>`;
}

// Ordered skill list (category order) used for skill-page prev/next.
const SKILL_ORDER = SKILL_CATEGORIES.flatMap(c => c.skills).filter(n => skillMeta[n])
  .concat(promptFiles.filter(n => !SKILL_CATEGORIES.some(c => c.skills.includes(n))));

function buildSkillExtras(name) {
  const U = UI.en;
  const cat = categoryOf(name);
  const m = CATEGORY_META[cat] || { slug: githubSlug(cat), color: 6 };
  const isAlias = skillRegistry.ALIAS_SKILLS.includes(name);
  const siblings = (SKILL_CATEGORIES.find(c => c.title === cat) || { skills: [] }).skills
    .filter(n => n !== name && skillMeta[n]).slice(0, 8);
  const run = isAlias ? '' : `
    <div class="run-box" style="--c: var(--cat-${m.color})">
      <p class="run-title">${svg('<polygon points="5 3 19 12 5 21 5 3"/>', 14)} ${U.runTitle}</p>
      <div class="run-row"><span class="run-label">${U.runIn}</span><code class="copyable">/us-stock-analysis:${name} AAPL</code></div>
      <div class="run-row"><span class="run-label">${U.runOther}</span><code class="copyable">@prompts/${name}.md Evaluate AAPL</code></div>
      <div class="run-row"><span class="run-label">${U.runAny}</span><code class="copyable">Evaluate AAPL using the ${name} framework</code></div>
    </div>`;
  const related = siblings.length ? `
    <div class="related">
      <span class="related-label">${U.related} <a href="skills.html#${m.slug}">${cat}</a></span>
      ${siblings.map(n => `<a class="chip" href="skill-${n}.html">${n}</a>`).join('\n      ')}
    </div>` : '';
  return run + related;
}

// ---------------------------------------------------------------------------
// Skill Reference index — filterable card grid
// ---------------------------------------------------------------------------
function buildSkillsIndex() {
  const U = UI.en;
  const categorized = new Set(SKILL_CATEGORIES.flatMap(c => c.skills));
  const otherSkills = promptFiles.filter(n => !categorized.has(n));
  const sections = [...SKILL_CATEGORIES];
  if (otherSkills.length) sections.push({ title: 'Other', skills: otherSkills });

  const present = sections.map(s => ({ ...s, skills: s.skills.filter(n => skillMeta[n]) })).filter(s => s.skills.length);
  const total = present.reduce((n, s) => n + s.skills.length, 0);

  const chips = [`<button type="button" class="filter-chip active" data-cat="all">${U.filterAll} <span>${total}</span></button>`]
    .concat(present.map(s => {
      const m = CATEGORY_META[s.title] || { slug: githubSlug(s.title), color: 6 };
      return `<button type="button" class="filter-chip" data-cat="${m.slug}" style="--c: var(--cat-${m.color})">${s.title} <span>${s.skills.length}</span></button>`;
    })).join('\n        ');

  const groups = present.map(s => {
    const m = CATEGORY_META[s.title] || { slug: githubSlug(s.title), color: 6, blurb: {} };
    const cards = s.skills.map(n => {
      const { title, summary } = skillMeta[n];
      const isAlias = skillRegistry.ALIAS_SKILLS.includes(n);
      const haystack = `${n} ${title} ${summary}`.toLowerCase();
      return `<a class="skill-card${isAlias ? ' is-alias' : ''}" href="skill-${n}.html" data-cat="${m.slug}" data-text="${escapeHtml(haystack)}" style="--c: var(--cat-${m.color})">
            <span class="skill-card-name">${n}</span>
            <span class="skill-card-title">${escapeHtml(title || n)}</span>
            <span class="skill-card-desc">${escapeHtml(summary || 'Investment analysis framework.')}</span>
            <span class="skill-card-foot">${isAlias ? 'redirect' : `/${n} AAPL`} ${svg(ARROW_R, 13)}</span>
          </a>`;
    }).join('\n          ');
    return `<section class="skill-group" data-cat="${m.slug}">
        <h2 id="${m.slug}">${s.title} <span class="group-count">${s.skills.length}</span></h2>
        ${m.blurb && m.blurb.en ? `<p class="group-blurb">${m.blurb.en}</p>` : ''}
        <div class="skill-grid">
          ${cards}
        </div>
      </section>`;
  }).join('\n      ');

  const html = `
      <p class="lead">Every framework as a browsable page — ${FRAMEWORK_COUNT} analysis frameworks, plus ${ALIAS_COUNT} aliases that redirect to the skill that absorbed them. New here? See <a href="choose-a-skill.html">Choose a Skill</a> to find the right one for your goal, or <a href="concepts.html">Concepts</a> for the ideas behind them.</p>
      <div class="skill-filter" role="search">
        <label class="skill-search-wrap">
          ${svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>', 15)}
          <input type="search" class="skill-search" placeholder="${escapeHtml(U.filterPlaceholder)}" aria-label="Filter frameworks">
        </label>
        <div class="filter-chips">
        ${chips}
        </div>
      </div>
      ${groups}
      <p class="skill-empty" hidden>${U.noMatch}</p>
      <p class="fineprint"><em>Educational frameworks only. Not financial advice.</em></p>`;
  const text = present.flatMap(s => s.skills.map(n => `${n} ${skillMeta[n].summary}`)).join(' ');
  return { html, text };
}

function htmlPage(page, content) {
  const lang = langOf(page.outFile);
  const U = UI[lang];
  const nav = buildNav(lang, page.key);
  const rawUrl = `${RAW_BASE}/${page.srcFile}`;

  const eyebrow    = page.eyebrow || eyebrowFor(lang, page.key);
  const subnav     = buildSubnav(lang, page.key);
  const langSwitch = buildLangSwitch(lang, page.outFile);

  // The two language homepages get the full landing treatment.
  const isHome = page.key === 'home' || page.key === 'zh-tw';
  const pageContentClass = isHome ? 'page-content home' : 'page-content';
  const isSkill = page.outFile.startsWith('skill-');

  const docTitle = isHome
    ? (lang === 'zh' ? 'InvestSkill — 讓任何 AI 成為你的美股分析師' : 'InvestSkill — Turn any AI into your stock analyst')
    : `${page.title} · InvestSkill`;
  const description = isHome ? LANDING[lang].lead.replace(/<[^>]+>/g, '') : (page.subtitle || 'Professional investment analysis frameworks for AI assistants');

  const pageHero = isHome ? buildLandingHero(lang) : `
    <div class="page-hero${isSkill ? ' skill-hero' : ''}">
      <p class="page-eyebrow">${eyebrow}</p>
      <h1>${page.title}</h1>
      <p class="page-desc">${page.subtitle}</p>
      <div class="page-actions">
        <button class="btn" id="copy-md-btn" data-url="${rawUrl}">
          ${svg('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>', 13)}
          ${U.copyMd}
        </button>
        <a class="btn" href="${rawUrl}" target="_blank" rel="noopener noreferrer">
          ${svg('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>', 13)}
          ${U.openRaw}
        </a>
      </div>
    </div>`;

  const landing    = isHome ? buildLandingSections(lang) : '';
  const extras     = page.extras || '';
  const readmeHead = isHome ? `<div class="readme-divider" id="readme"><span>${U.readme}</span></div>` : '';
  const pager      = page.pager !== undefined ? page.pager : buildPager(lang, NAV_FLAT[lang], page.outFile);
  const footer     = buildFooter(lang);

  return `<!DOCTYPE html>
<html lang="${lang === 'zh' ? 'zh-Hant' : 'en'}" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(docTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#fbfaf9" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0b0e14" media="(prefers-color-scheme: dark)">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="InvestSkill">
  <meta property="og:title" content="${escapeHtml(docTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${SITE_BASE}/${page.outFile}">
  <link rel="canonical" href="${SITE_BASE}/${page.outFile}">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23e8664e'/%3E%3Cpath d='M8 22l5-7 4 4 7-10' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
  <script>(function(){try{var t=localStorage.getItem('is-theme');if(!t&&window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)t='dark';if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,18..72,400;0,18..72,500;0,18..72,600;1,18..72,400;1,18..72,500&display=swap">
  <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="progress" id="progress" aria-hidden="true"></div>

<header class="site-header">
  <div class="header-inner">
    <button class="icon-btn" id="sidebar-toggle" aria-label="Toggle sidebar" aria-expanded="false">
      ${svg('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>', 18)}
    </button>
    <a class="logo" href="${lang === 'zh' ? 'zh-tw.html' : 'index.html'}">
      <span class="logo-badge">IS</span>
      <span class="logo-text">InvestSkill</span>
    </a>
    ${SITE_VERSION ? `<a class="status-chip" href="changelog.html"><span class="dot"></span>${SITE_VERSION}</a>` : ''}
    <button class="search-box" type="button" aria-label="Search">
      ${svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>', 15)}
      <span class="search-placeholder">${lang === 'zh' ? '搜尋文件…' : 'Search docs…'}</span>
      <span class="kbd-group"><kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd></span>
    </button>
    <div class="header-actions">
      ${langSwitch}
      <a href="https://github.com/yennanliu/InvestSkill" target="_blank" rel="noopener noreferrer" class="icon-btn" aria-label="GitHub">
        <svg width="19" height="19" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
            -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
            .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
            -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
            .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
            .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
            0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8
            c0-4.42-3.58-8-8-8z"/>
        </svg>
      </a>
      <button class="icon-btn" id="theme-toggle" aria-label="Toggle theme" title="Toggle theme">
        <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
      </button>
    </div>
  </div>
</header>

${subnav}

<div class="layout">

  <div class="sidebar-backdrop" id="sidebar-backdrop"></div>
  <aside class="sidebar" id="sidebar">
    <nav>
${nav}
    </nav>
  </aside>

  <main class="${pageContentClass}">
${pageHero}
${landing}${extras}
${readmeHead}
    <article class="markdown-body">
${content}
    </article>
${pager}
${footer}
  </main>

  <aside class="toc-sidebar" id="toc-sidebar">
    <p class="toc-title">
      ${svg('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>', 13)}
      ${U.onThisPage}
    </p>
    <ul class="toc-list" id="toc"></ul>
  </aside>

</div>

<button class="back-top" id="back-top" aria-label="${U.backTop}" hidden>${svg('<polyline points="18 15 12 9 6 15"/>', 16)}</button>

<script src="main.js"></script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Build all pages
// ---------------------------------------------------------------------------
const outDir = '_site';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Copy static assets
fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(outDir, 'style.css'));
fs.copyFileSync(path.join(__dirname, 'main.js'),   path.join(outDir, 'main.js'));
console.log('✓ Copied style.css and main.js');

// Client-side search index (built as pages render).
const searchIndex = [];
const toText = (html) => html
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 1600);

// Generate pages
for (const page of PAGES) {
  if (!fs.existsSync(page.srcFile)) {
    console.log(`  skip ${page.srcFile} (not found)`);
    continue;
  }
  let raw = fs.readFileSync(page.srcFile, 'utf8');
  if (page.key === 'home' || page.key === 'zh-tw') raw = stripReadmeHeader(raw);
  const content = wrapTables(rewriteLinks(md.render(raw)));
  const html    = htmlPage(page, content);
  fs.writeFileSync(path.join(outDir, page.outFile), html);
  searchIndex.push({
    title: page.title,
    url: page.outFile,
    lang: langOf(page.outFile),
    section: eyebrowFor(langOf(page.outFile), page.key),
    text: toText(content),
  });
  console.log(`✓ ${page.outFile}`);
}

// ---------------------------------------------------------------------------
// Per-skill reference pages (generated from prompts/*.md) + Skill Reference index
// ---------------------------------------------------------------------------

// Generate one page per skill.
for (const name of promptFiles) {
  const { raw, title, summary } = skillMeta[name];
  // Drop the leading H1 — the page hero already shows the title.
  const body = raw.replace(/^#\s+.*\n/, '');
  const cat = categoryOf(name);
  const idx = SKILL_ORDER.indexOf(name);
  const asLink = n => n ? { href: `skill-${n}.html`, label: skillMeta[n].title || n } : null;
  const pagerItems = [asLink(SKILL_ORDER[idx - 1]), { href: `skill-${name}.html`, label: title || name }, asLink(SKILL_ORDER[idx + 1])].filter(Boolean);
  const page = {
    key:      'skills',
    outFile:  `skill-${name}.html`,
    srcFile:  `prompts/${name}.md`,
    title:    title || name,
    subtitle: summary || `Framework reference · ${name}`,
    eyebrow:  `Skill Reference · ${cat}`,
    extras:   buildSkillExtras(name),
    pager:    buildPager('en', pagerItems, `skill-${name}.html`),
  };
  const content = wrapTables(rewriteLinks(md.render(body)));
  fs.writeFileSync(path.join(outDir, page.outFile), htmlPage(page, content));
  searchIndex.push({
    title: page.title,
    url: page.outFile,
    lang: 'en',
    section: 'Skill Reference',
    text: toText(content),
  });
}
console.log(`✓ ${promptFiles.length} per-skill reference pages`);

// Generate the Skill Reference index (skills.html) — a filterable card grid.
const skillsIndex = buildSkillsIndex();
const skillsPage = {
  key: 'skills', outFile: 'skills.html', srcFile: 'README.md',
  title: 'Skill Reference', subtitle: `All ${FRAMEWORK_COUNT} frameworks (+ ${ALIAS_COUNT} aliases), one page each`,
};
fs.writeFileSync(path.join(outDir, 'skills.html'), htmlPage(skillsPage, skillsIndex.html));
searchIndex.push({ title: 'Skill Reference', url: 'skills.html', lang: 'en', section: 'Skill Reference', text: skillsIndex.text.slice(0, 1600) });
console.log('✓ skills.html');

// 404 page (minimal, shares stylesheet)
const html404 = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 · InvestSkill</title>
  <script>(function(){try{var t=localStorage.getItem('is-theme');if(!t&&window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)t='dark';if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
  <link rel="stylesheet" href="/InvestSkill/style.css">
</head>
<body class="page-404">
  <div class="card-404">
    <p class="num-404">404</p>
    <p>That page doesn't exist — but the frameworks do.</p>
    <div class="page-actions"><a class="btn btn-primary" href="/InvestSkill/">Go home</a><a class="btn" href="/InvestSkill/skills.html">Skill Reference</a></div>
  </div>
</body>
</html>`;
fs.writeFileSync(path.join(outDir, '404.html'), html404);
console.log('✓ 404.html');

// Write the client-side search index.
fs.writeFileSync(path.join(outDir, 'search-index.json'), JSON.stringify(searchIndex));
console.log(`✓ search-index.json (${searchIndex.length} pages)`);
console.log('\nBuild complete.');
