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
        { label: 'NVDA 10-K Deep Dive', href: 'full-demo-nvda.html',  page: 'full-demo-nvda' },
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
        { label: 'RKLB 完整示範',      href: 'full-demo-rklb.html',  page: 'full-demo-rklb' },
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
  ['concepts.html', 'concepts-zh-tw.html'],
  ['glossary.html', 'glossary-zh-tw.html'],
  ['choose-a-skill.html', 'choose-a-skill-zh-tw.html'],
  ['use-cases.html', 'use-cases-zh-tw.html'],
  ['data-and-accuracy.html', 'data-and-accuracy-zh-tw.html'],
  ['cookbook.html', 'cookbook-zh-tw.html'],
  // The demo overview (English) pairs with the RKLB full demo (Traditional Chinese).
  ['full-demo.html', 'full-demo-rklb.html'],
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
// of truth (report-generator is an output tool, not an analysis framework).
const PROMPTS_DIR = path.join(__dirname, '..', '..', 'prompts');
const promptFiles = fs.existsSync(PROMPTS_DIR)
  ? fs.readdirSync(PROMPTS_DIR).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, '')).sort()
  : [];
const FRAMEWORK_COUNT = promptFiles.filter(n => n !== 'report-generator').length;

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
  'LEARNING-zh-TW.md':              'learning-zh-tw.html',
  'LEARNING-FOUNDATIONS-zh-TW.md':  'learning-foundations-zh-tw.html',
  'LEARNING-STATEMENTS-zh-TW.md':   'learning-statements-zh-tw.html',
  'LEARNING-QUALITY-zh-TW.md':      'learning-quality-zh-tw.html',
  'LEARNING-VALUATION-zh-TW.md':    'learning-valuation-zh-tw.html',
  'LEARNING-MARKET-zh-TW.md':       'learning-market-zh-tw.html',
  'LEARNING-PORTFOLIO-zh-TW.md':    'learning-portfolio-zh-tw.html',
  'LEARNING-PLAYBOOK-zh-TW.md':     'learning-playbook-zh-tw.html',
  'LEARNING-CASE-AMD-zh-TW.md':     'learning-case-amd-zh-tw.html',
};

// Assets we actually serve — any other relative link is sent to GitHub.
// Per-skill pages (skill-<name>.html) are added dynamically further below.
const SERVED = new Set(['index.html','cookbook.html','cookbook-zh-tw.html',
  'contributing.html','changelog.html','zh-tw.html','style.css','main.js',
  'concepts.html','glossary.html','choose-a-skill.html','use-cases.html',
  'data-and-accuracy.html','skills.html','full-demo.html','full-demo-pltr.html','full-demo-rklb.html','full-demo-nvda.html',
  'concepts-zh-tw.html','glossary-zh-tw.html','choose-a-skill-zh-tw.html',
  'use-cases-zh-tw.html','data-and-accuracy-zh-tw.html',
  'learning.html','learning-foundations.html','learning-statements.html',
  'learning-quality.html','learning-valuation.html','learning-market.html','learning-portfolio.html',
  'learning-playbook.html','learning-case-amd.html',
  'learning-zh-tw.html','learning-foundations-zh-tw.html','learning-statements-zh-tw.html',
  'learning-quality-zh-tw.html','learning-valuation-zh-tw.html','learning-market-zh-tw.html',
  'learning-portfolio-zh-tw.html','learning-playbook-zh-tw.html','learning-case-amd-zh-tw.html']);

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
    subtitle: 'All-skills analysis demos: NVDA 10-K deep dive · PLTR (English) · RKLB (繁體中文)',
  },
  {
    key: 'full-demo-nvda',
    outFile: 'full-demo-nvda.html',
    srcFile: 'site/content/FULL-DEMO-NVDA.md',
    title: 'NVDA 10-K Deep Dive',
    subtitle: 'NVIDIA FY2026 annual report — a financial-report-analyst deep read (English)',
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
// The RKLB demo is fully Traditional Chinese content, so it belongs to the
// zh site even though its filename doesn't carry the -zh-tw suffix.
function langOf(outFile) {
  if (outFile === 'full-demo-rklb.html') return 'zh';
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

function htmlPage(page, content) {
  const lang = langOf(page.outFile);
  const nav = buildNav(lang, page.key);
  const rawUrl = `${RAW_BASE}/${page.srcFile}`;

  const eyebrow  = eyebrowFor(lang, page.key);
  const subnav    = buildSubnav(lang, page.key);
  const langSwitch = buildLangSwitch(lang, page.outFile);

  // The two language homepages get the full marketing hero treatment.
  const isHome    = page.key === 'home' || page.key === 'zh-tw';
  const heroClass = isHome ? ' home-hero' : '';
  const pageContentClass = isHome ? 'page-content home' : 'page-content';

  const L = lang === 'zh'
    ? {
        badge:  `${FRAMEWORK_COUNT} 項分析框架`,
        cta:    '開始使用', ctaHref: '#-快速開始30-秒',
        stats:  [[String(FRAMEWORK_COUNT), '分析框架'], ['MIT', '開源免費'], ['0', '免安裝 · 純提示詞']],
        platLabel: '支援平台',
      }
    : {
        badge:  `${FRAMEWORK_COUNT} analysis frameworks`,
        cta:    'Get Started', ctaHref: '#quick-start',
        stats:  [[String(FRAMEWORK_COUNT), 'Analysis frameworks'], ['MIT', 'Open-source & free'], ['0', 'Runtime — just prompts']],
        platLabel: 'Runs on',
      };
  const PLATFORMS = ['Claude Code', 'Cursor', 'Gemini CLI', 'Copilot', 'ChatGPT'];

  const landingCta = isHome
    ? `<a class="btn btn-primary" href="${L.ctaHref}">${L.cta}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>\n        `
    : '';

  const heroBadge = isHome
    ? `<span class="hero-badge"><span class="hero-badge-dot"></span>${SITE_VERSION ? SITE_VERSION + ' · ' : ''}${L.badge}</span>\n      `
    : '';
  const heroExtras = isHome
    ? `
      <div class="hero-stats">
        ${L.stats.map(([n, lbl]) => `<div class="hero-stat"><span class="hero-stat-num">${n}</span><span class="hero-stat-label">${lbl}</span></div>`).join('\n        ')}
      </div>
      <div class="hero-platforms">
        <span class="hero-plat-label">${L.platLabel}</span>
        ${PLATFORMS.map(p => `<span class="hero-chip">${p}</span>`).join('\n        ')}
      </div>`
    : '';
  const heroOrbs = isHome ? `<span class="hero-orbs" aria-hidden="true"></span>\n      ` : '';

  return `<!DOCTYPE html>
<html lang="${lang === 'zh' ? 'zh-Hant' : 'en'}" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title} - InvestSkill</title>
  <meta name="description" content="Professional investment analysis and stock evaluation skills for AI assistants">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,18..72,400;0,18..72,500;1,18..72,400;1,18..72,500&display=swap">
  <link rel="stylesheet" href="style.css">
</head>
<body>

<header class="site-header">
  <div class="header-inner">
    <button class="icon-btn" id="sidebar-toggle" aria-label="Toggle sidebar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
    <a class="logo" href="index.html">
      <span class="logo-badge">IS</span>
      <span class="logo-text">InvestSkill</span>
    </a>
    ${SITE_VERSION ? `<span class="status-chip"><span class="dot"></span>${SITE_VERSION} · live</span>` : ''}
    <div class="search-box">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <span class="search-placeholder">Search</span>
      <span class="kbd-group"><kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd></span>
    </div>
    <div class="header-actions">
      ${langSwitch}
      <a href="https://github.com/yennanliu/InvestSkill" target="_blank" class="icon-btn" aria-label="GitHub">
        <svg width="19" height="19" viewBox="0 0 16 16" fill="currentColor">
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
      <button class="icon-btn" id="theme-toggle" aria-label="Toggle theme" title="Toggle theme"></button>
    </div>
  </div>
</header>

${subnav}

<div class="layout">

  <aside class="sidebar" id="sidebar">
    <nav>
${nav}
    </nav>
  </aside>

  <main class="${pageContentClass}">
    <div class="page-hero${heroClass}">
      ${heroOrbs}${heroBadge}<p class="page-eyebrow">${eyebrow}</p>
      <h1>${page.title}</h1>
      <p class="page-desc">${page.subtitle}</p>
      <div class="page-actions">
        ${landingCta}<button class="btn" id="copy-md-btn" data-url="${rawUrl}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy Markdown
        </button>
        <a class="btn" href="${rawUrl}" target="_blank">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Open Raw
        </a>
      </div>${heroExtras}
    </div>
    <article class="markdown-body">
${content}
    </article>
  </main>

  <aside class="toc-sidebar" id="toc-sidebar">
    <p class="toc-title">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="15" y2="12"/>
        <line x1="3" y1="18" x2="18" y2="18"/>
      </svg>
      On this page
    </p>
    <ul class="toc-list" id="toc"></ul>
  </aside>

</div>

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
  const raw     = fs.readFileSync(page.srcFile, 'utf8');
  const content = rewriteLinks(md.render(raw));
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

// Display categories for the index, mirroring README. Any skill not listed
// here falls into "Other" so new skills still appear without code changes.
const SKILL_CATEGORIES = [
  { title: 'Core Stock Analysis', skills: ['stock-eval','fundamental-analysis','technical-analysis','dcf-valuation','stock-valuation','economics-analysis'] },
  { title: 'Financial Reports',   skills: ['financial-report-analyst','10k-digest','earnings-call-analysis'] },
  { title: 'Market Monitoring',   skills: ['insider-trading','institutional-ownership','dividend-analysis','short-interest'] },
  { title: 'Advanced Research',   skills: ['competitor-analysis','options-analysis','portfolio-review','sector-analysis','stock-screener','catalyst-calendar','bear-case'] },
  { title: 'Meta & Output',       skills: ['research-bundle','full-report','report-generator','chart-master','result-validator'] },
];

// PROMPTS_DIR / promptFiles / FRAMEWORK_COUNT are computed once near the top.

// Extract a page title and a one-line summary from a prompt's markdown.
function describePrompt(raw) {
  const lines = raw.split('\n');
  const h1 = lines.find(l => /^#\s+/.test(l));
  const title = h1 ? h1.replace(/^#\s+/, '').trim() : '';
  // First non-empty, non-heading paragraph as the summary.
  let summary = '';
  for (let i = (h1 ? lines.indexOf(h1) + 1 : 0); i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t || t.startsWith('#') || t.startsWith('>')) continue;
    summary = t.replace(/\*\*/g, '').replace(/`/g, '');
    break;
  }
  if (summary.length > 180) summary = summary.slice(0, 177).trimEnd() + '…';
  return { title, summary };
}

// Register skill pages as served BEFORE rendering anything that links to them.
const skillMeta = {};
for (const name of promptFiles) {
  SERVED.add(`skill-${name}.html`);
  const raw = fs.readFileSync(path.join(PROMPTS_DIR, `${name}.md`), 'utf8');
  skillMeta[name] = { raw, ...describePrompt(raw) };
}

// Generate one page per skill.
for (const name of promptFiles) {
  const { raw, title } = skillMeta[name];
  // Drop the leading H1 — the page hero already shows the title.
  const body = raw.replace(/^#\s+.*\n/, '');
  const page = {
    key:      'skills',
    outFile:  `skill-${name}.html`,
    srcFile:  `prompts/${name}.md`,
    title:    title || name,
    subtitle: `Framework reference · ${name}`,
  };
  const content = rewriteLinks(md.render(body));
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

// Generate the Skill Reference index (skills.html).
const categorized = new Set(SKILL_CATEGORIES.flatMap(c => c.skills));
const otherSkills = promptFiles.filter(n => !categorized.has(n));
const indexSections = [...SKILL_CATEGORIES];
if (otherSkills.length) indexSections.push({ title: 'Other', skills: otherSkills });

let skillsMd = `# Skill Reference\n\nEvery framework as a browsable page. New here? See [Choose a Skill](choose-a-skill.html) to find the right one for your goal, or [Concepts](concepts.html) for the ideas behind them.\n\n`;
for (const section of indexSections) {
  const present = section.skills.filter(n => skillMeta[n]);
  if (!present.length) continue;
  skillsMd += `## ${section.title}\n\n`;
  for (const name of present) {
    const { summary } = skillMeta[name];
    skillsMd += `- [**${name}**](skill-${name}.html) — ${summary || 'Investment analysis framework.'}\n`;
  }
  skillsMd += `\n`;
}
skillsMd += `\n*Educational frameworks only. Not financial advice.*\n`;

// FRAMEWORK_COUNT (advertised count) is computed once near the top.
const skillsPage = {
  key: 'skills', outFile: 'skills.html', srcFile: 'README.md',
  title: 'Skill Reference', subtitle: `All ${FRAMEWORK_COUNT} frameworks, one page each`,
};
fs.writeFileSync(
  path.join(outDir, 'skills.html'),
  htmlPage(skillsPage, rewriteLinks(md.render(skillsMd)))
);
console.log('✓ skills.html');

// 404 page (minimal, shares stylesheet)
const html404 = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - InvestSkill</title>
  <link rel="stylesheet" href="/InvestSkill/style.css">
</head>
<body style="display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="text-align:center;padding:2rem;">
    <p style="font-size:4rem;font-weight:700;color:var(--accent)">404</p>
    <p style="color:var(--text-muted);margin:1rem 0 2rem">Page not found</p>
    <a class="btn" href="/InvestSkill/" style="display:inline-flex;align-items:center;gap:.5rem;padding:.5rem 1.25rem;border:1px solid var(--border);background:var(--code-bg);color:var(--text);border-radius:6px;text-decoration:none;">Go home</a>
  </div>
</body>
</html>`;
fs.writeFileSync(path.join(outDir, '404.html'), html404);
console.log('✓ 404.html');

// Write the client-side search index.
fs.writeFileSync(path.join(outDir, 'search-index.json'), JSON.stringify(searchIndex));
console.log(`✓ search-index.json (${searchIndex.length} pages)`);
console.log('\nBuild complete.');
