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

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  buildTOC();
  setupScrollSpy();
  setupCopyButton();
  setupSidebar();
});
