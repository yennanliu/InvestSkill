'use strict';

// ── Theme toggle ──────────────────────────────────────────────────────────────
const ICONS = { dark: '☀', light: '☾' };
const DEFAULT_THEME = 'light';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = ICONS[theme] || '☀';
}

function setupTheme() {
  const stored = localStorage.getItem('is-theme') || DEFAULT_THEME;
  applyTheme(stored);

  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('is-theme', next);
    applyTheme(next);
  });
}

// ── Table of Contents ─────────────────────────────────────────────────────────
function buildTOC() {
  const article = document.querySelector('.markdown-body');
  const toc     = document.getElementById('toc');
  const sidebar = document.getElementById('toc-sidebar');
  if (!article || !toc) return;

  const headings = Array.from(article.querySelectorAll('h2, h3'));
  if (headings.length < 2) {
    if (sidebar) sidebar.style.display = 'none';
    return;
  }

  headings.forEach(h => {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href      = '#' + h.id;
    a.textContent = h.textContent.replace(/\s*#\s*$/, '').trim();
    a.className = 'toc-link' + (h.tagName === 'H3' ? ' h3' : '');
    li.appendChild(a);
    toc.appendChild(li);
  });
}

// ── Scroll spy ────────────────────────────────────────────────────────────────
function setupScrollSpy() {
  const links    = () => document.querySelectorAll('.toc-link');
  const headings = Array.from(document.querySelectorAll('.markdown-body h2, .markdown-body h3'));
  if (headings.length === 0) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links().forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    });
  }, { rootMargin: '-72px 0px -80% 0px', threshold: 0 });

  headings.forEach(h => observer.observe(h));
}

// ── Copy Markdown ─────────────────────────────────────────────────────────────
function setupCopyButton() {
  const btn = document.getElementById('copy-md-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const url  = btn.dataset.url;
    const original = btn.innerHTML;
    try {
      let text;
      if (url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error('fetch failed');
        text = await res.text();
      } else {
        text = document.querySelector('.markdown-body')?.innerText || '';
      }
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied!';
    } catch {
      btn.textContent = 'Failed';
    }
    setTimeout(() => { btn.innerHTML = original; }, 2000);
  });
}

// ── Mobile sidebar ────────────────────────────────────────────────────────────
function setupSidebar() {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

// ── Search ──────────────────────────────────────────────────────────────────
function setupSearch() {
  const trigger = document.querySelector('.search-box');
  if (!trigger) return;

  let index = null;
  let modal = null;

  async function loadIndex() {
    if (index) return index;
    try {
      const res = await fetch('search-index.json');
      index = res.ok ? await res.json() : [];
    } catch { index = []; }
    return index;
  }

  function snippet(text, q) {
    if (!text) return '';
    const i = text.toLowerCase().indexOf(q);
    if (i < 0) return text.slice(0, 120) + '…';
    const start = Math.max(0, i - 40);
    return (start > 0 ? '…' : '') + text.slice(start, start + 130).trim() + '…';
  }

  function search(q) {
    const query = q.toLowerCase().trim();
    if (!query) return [];
    return (index || [])
      .map(it => {
        const title = (it.title || '').toLowerCase();
        const text = (it.text || '').toLowerCase();
        let score = 0;
        if (title === query) score += 100;
        if (title.includes(query)) score += 25;
        if ((it.section || '').toLowerCase().includes(query)) score += 8;
        if (text.includes(query)) score += 3;
        return { it, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }

  function render(list, q, resultsEl) {
    if (!q.trim()) { resultsEl.innerHTML = '<li class="search-hint">Type to search all pages…</li>'; return; }
    if (!list.length) { resultsEl.innerHTML = '<li class="search-hint">No results</li>'; return; }
    resultsEl.innerHTML = list.map(({ it }, idx) =>
      `<li><a class="search-result${idx === 0 ? ' active' : ''}" href="${it.url}">
        <span class="search-result-title">${it.title}</span>
        <span class="search-result-section">${it.section || ''}</span>
        <span class="search-result-snippet">${snippet(it.text, q.toLowerCase().trim())}</span>
      </a></li>`).join('');
  }

  async function open() {
    await loadIndex();
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
      <div class="search-panel" role="dialog" aria-modal="true">
        <input class="search-input" type="text" placeholder="Search InvestSkill…" autocomplete="off" spellcheck="false" aria-label="Search">
        <ul class="search-results"></ul>
      </div>`;
    document.body.appendChild(modal);
    const input = modal.querySelector('.search-input');
    const resultsEl = modal.querySelector('.search-results');
    render([], '', resultsEl);

    input.addEventListener('input', () => render(search(input.value), input.value, resultsEl));
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const first = resultsEl.querySelector('.search-result');
        if (first) window.location.href = first.getAttribute('href');
      }
    });
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    setTimeout(() => input.focus(), 0);
  }

  function close() { if (modal) { modal.remove(); modal = null; } }

  trigger.addEventListener('click', open);
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
    if (e.key === 'Escape') close();
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  buildTOC();
  setupScrollSpy();
  setupCopyButton();
  setupSidebar();
  setupSearch();
});
