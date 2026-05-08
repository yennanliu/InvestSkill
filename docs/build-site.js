'use strict';
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
  .use(markdownItAnchor, { permalink: false });

// ---------------------------------------------------------------------------
// Navigation structure
// ---------------------------------------------------------------------------
const NAV_SECTIONS = [
  {
    title: 'Introduction',
    links: [
      { label: 'Quick Start',     href: 'index.html',    page: 'home' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { label: 'Cookbook',        href: 'cookbook.html',      page: 'cookbook' },
      { label: 'Contributing',    href: 'contributing.html',  page: 'contributing' },
    ],
  },
  {
    title: 'Reference',
    links: [
      { label: 'Changelog',       href: 'changelog.html', page: 'changelog' },
    ],
  },
  {
    title: '中文',
    links: [
      { label: '繁體中文',         href: 'zh-tw.html',         page: 'zh-tw' },
      { label: '操作手冊',         href: 'cookbook-zh-tw.html', page: 'cookbook-zh-tw' },
    ],
  },
];

const RAW_BASE    = 'https://raw.githubusercontent.com/yennanliu/InvestSkill/main';
const GITHUB_BLOB = 'https://github.com/yennanliu/InvestSkill/blob/main';
const SITE_BASE   = 'https://yennj12.js.org/InvestSkill';
const OLD_SITE    = 'https://yennanliu.github.io/InvestSkill';

// .md files that have dedicated HTML pages on the site
const MD_TO_HTML = {
  'README.md':          'index.html',
  'README-zh-TW.md':    'zh-tw.html',
  'COOKBOOK.md':        'cookbook.html',
  'COOKBOOK-zh-TW.md':  'cookbook-zh-tw.html',
  'CONTRIBUTING.md':    'contributing.html',
  'CHANGELOG.md':       'changelog.html',
};

// Assets we actually serve — any other relative link is sent to GitHub
const SERVED = new Set(['index.html','cookbook.html','cookbook-zh-tw.html',
  'contributing.html','changelog.html','zh-tw.html','style.css','main.js']);

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
    key: 'cookbook',
    outFile: 'cookbook.html',
    srcFile: 'COOKBOOK.md',
    title: 'Cookbook',
    subtitle: 'Practical examples and workflows',
  },
  {
    key: 'cookbook-zh-tw',
    outFile: 'cookbook-zh-tw.html',
    srcFile: 'COOKBOOK-zh-TW.md',
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
    title: '繁體中文',
    subtitle: 'Traditional Chinese documentation',
  },
];

// ---------------------------------------------------------------------------
// Template helpers
// ---------------------------------------------------------------------------
function buildNav(currentPage) {
  return NAV_SECTIONS.map(section => {
    const links = section.links.map(link => {
      const active = link.page === currentPage ? ' active' : '';
      return `        <a href="${link.href}" class="nav-link${active}">${link.label}</a>`;
    }).join('\n');
    return `      <div class="nav-section">
        <div class="nav-section-title">${section.title}</div>
${links}
      </div>`;
  }).join('\n');
}

function htmlPage(page, content) {
  const nav = buildNav(page.key);
  const rawUrl = `${RAW_BASE}/${page.srcFile}`;

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title} - InvestSkill</title>
  <meta name="description" content="Professional investment analysis and stock evaluation skills for AI assistants">
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
    <div class="search-box">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <span class="search-placeholder">Search</span>
      <span class="kbd-group"><kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd></span>
    </div>
    <div class="header-actions">
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

<div class="layout">

  <aside class="sidebar" id="sidebar">
    <nav>
${nav}
    </nav>
  </aside>

  <main class="page-content">
    <div class="page-hero">
      <h1>${page.title}</h1>
      <p class="page-desc">${page.subtitle}</p>
      <div class="page-actions">
        <button class="btn" id="copy-md-btn" data-url="${rawUrl}">
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
      </div>
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
  console.log(`✓ ${page.outFile}`);
}

// 404 page (minimal, shares stylesheet)
const html404 = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
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
console.log('\nBuild complete.');
