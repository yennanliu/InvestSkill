'use strict';

const prefersReducedMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Theme toggle ──────────────────────────────────────────────────────────────
// The initial theme is applied by an inline <head> script (stored preference,
// else the OS setting) so there is no flash; this just wires the button.
function setupTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('is-theme', next); } catch { /* private mode */ }
  });
  // Follow the OS while the visitor has not chosen explicitly.
  if (window.matchMedia) {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      let stored = null;
      try { stored = localStorage.getItem('is-theme'); } catch { /* ignore */ }
      if (!stored) document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });
  }
}

// ── Table of Contents ─────────────────────────────────────────────────────────
function buildTOC() {
  const article = document.querySelector('.markdown-body');
  const toc     = document.getElementById('toc');
  const sidebar = document.getElementById('toc-sidebar');
  if (!article || !toc) return;

  const headings = Array.from(article.querySelectorAll('h2, h3')).filter(h => h.id);
  if (headings.length < 2) {
    if (sidebar) sidebar.style.display = 'none';
    return;
  }
  headings.forEach(h => {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent.replace(/\s*#\s*$/, '').replace(/\s+\d+$/, '').trim();
    a.className = 'toc-link' + (h.tagName === 'H3' ? ' h3' : '');
    li.appendChild(a);
    toc.appendChild(li);
  });
}

// ── Scroll spy ────────────────────────────────────────────────────────────────
function setupScrollSpy() {
  const headings = Array.from(document.querySelectorAll('.markdown-body h2, .markdown-body h3')).filter(h => h.id);
  if (!headings.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.toc-link[href="#${CSS.escape(entry.target.id)}"]`);
      if (active) {
        active.classList.add('active');
        active.scrollIntoView({ block: 'nearest' });
      }
    });
  }, { rootMargin: '-110px 0px -75% 0px', threshold: 0 });
  headings.forEach(h => observer.observe(h));
}

// ── Clipboard helper ──────────────────────────────────────────────────────────
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try {
    if (!document.execCommand('copy')) throw new Error('copy command rejected');
  } finally {
    ta.remove();
  }
}
function flash(btn, okText, restore, cls = 'done') {
  const original = restore !== undefined ? restore : btn.innerHTML;
  btn.textContent = okText;
  btn.classList.add(cls);
  setTimeout(() => { btn.innerHTML = original; btn.classList.remove(cls); }, 1800);
}

// ── Copy Markdown (page hero) ─────────────────────────────────────────────────
function setupCopyButton() {
  const btn = document.getElementById('copy-md-btn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const original = btn.innerHTML;
    try {
      let text;
      if (btn.dataset.url) {
        const res = await fetch(btn.dataset.url);
        if (!res.ok) throw new Error('fetch failed');
        text = await res.text();
      } else {
        text = document.querySelector('.markdown-body')?.innerText || '';
      }
      await copyText(text);
      flash(btn, 'Copied!', original);
    } catch {
      flash(btn, 'Failed', original, 'failed');
    }
  });
}

// ── Copy buttons on code blocks + "run this skill" rows ──────────────────────
function setupCodeCopy() {
  const targets = document.querySelectorAll('.markdown-body pre, .copyable');
  targets.forEach(el => {
    if (el.querySelector('.code-copy')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.setAttribute('aria-label', 'Copy to clipboard');
    btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    btn.addEventListener('click', async e => {
      e.preventDefault();
      const code = el.matches('pre') ? (el.querySelector('code') || el) : el;
      const text = Array.from(code.childNodes).filter(n => !(n.nodeType === 1 && n.classList.contains('code-copy'))).map(n => n.textContent).join('');
      const original = btn.innerHTML;
      try { await copyText(text.trim()); flash(btn, 'Copied', original); }
      catch { flash(btn, 'Failed', original, 'failed'); }
    });
    el.appendChild(btn);
  });
}

// ── Install picker ────────────────────────────────────────────────────────────
function setupInstaller() {
  const installer = document.querySelector('.installer');
  if (!installer) return;
  const tabs   = Array.from(installer.querySelectorAll('.install-tab'));
  const panels = Array.from(installer.querySelectorAll('.install-panel'));

  function select(id) {
    tabs.forEach(t => {
      const on = t.dataset.installTab === id;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
    });
    panels.forEach(p => p.classList.toggle('active', p.dataset.installPanel === id));
    try { localStorage.setItem('is-agent', id); } catch { /* ignore */ }
  }
  tabs.forEach(t => t.addEventListener('click', () => select(t.dataset.installTab)));

  let stored = null;
  try { stored = localStorage.getItem('is-agent'); } catch { /* ignore */ }
  if (stored && tabs.some(t => t.dataset.installTab === stored)) select(stored);

  installer.querySelectorAll('.install-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const cmd = btn.closest('.install-panel')?.querySelector('.install-cmd code')?.textContent || '';
      const original = btn.textContent;
      try { await copyText(cmd); flash(btn, btn.dataset.copiedLabel || 'Copied', original); }
      catch { flash(btn, 'Failed', original, 'failed'); }
    });
  });
}

// ── Mobile sidebar ────────────────────────────────────────────────────────────
function setupSidebar() {
  const toggle   = document.getElementById('sidebar-toggle');
  const sidebar  = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (!toggle || !sidebar) return;

  const set = open => {
    sidebar.classList.toggle('open', open);
    backdrop?.classList.toggle('show', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', e => { e.stopPropagation(); set(!sidebar.classList.contains('open')); });
  backdrop?.addEventListener('click', () => set(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });

  // Keep the active link in view inside a long sidebar.
  const active = sidebar.querySelector('.nav-link.active');
  if (active) {
    const top = active.offsetTop - sidebar.clientHeight / 2;
    if (top > 0) sidebar.scrollTop = top;
  }
}

// ── Reading progress + back-to-top ───────────────────────────────────────────
function setupScrollUI() {
  const bar = document.getElementById('progress');
  const top = document.getElementById('back-top');
  let ticking = false;
  const update = () => {
    ticking = false;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const y = window.scrollY || doc.scrollTop;
    if (bar) bar.style.width = max > 0 ? `${Math.min(100, (y / max) * 100)}%` : '0';
    if (top) top.hidden = y < 600;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
  top?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));
}

// ── Scroll-reveal for landing cards ──────────────────────────────────────────
function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  items.forEach(el => io.observe(el));
}

// ── Skill Reference filter ────────────────────────────────────────────────────
function setupSkillFilter() {
  const input = document.querySelector('.skill-search');
  const chips = Array.from(document.querySelectorAll('.filter-chip'));
  const groups = Array.from(document.querySelectorAll('.skill-group'));
  const empty = document.querySelector('.skill-empty');
  if (!input || !groups.length) return;

  let cat = 'all';
  function apply() {
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    groups.forEach(g => {
      const inCat = cat === 'all' || g.dataset.cat === cat;
      let shown = 0;
      g.querySelectorAll('.skill-card').forEach(card => {
        const hit = inCat && (!q || (card.dataset.text || '').includes(q));
        card.hidden = !hit;
        if (hit) shown++;
      });
      g.hidden = shown === 0;
      visible += shown;
    });
    if (empty) empty.hidden = visible > 0;
  }
  input.addEventListener('input', apply);
  chips.forEach(c => c.addEventListener('click', () => {
    cat = c.dataset.cat;
    chips.forEach(x => x.classList.toggle('active', x === c));
    apply();
  }));

  // Deep link: skills.html#core-stock-analysis pre-selects that category chip.
  const hash = decodeURIComponent(location.hash.slice(1));
  const chip = hash && chips.find(c => c.dataset.cat === hash);
  if (chip) chip.click();
  // "/" focuses the filter, like GitHub.
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement?.tagName || '')) { e.preventDefault(); input.focus(); }
  });
}

// ── Search (⌘K) ───────────────────────────────────────────────────────────────
function setupSearch() {
  const trigger = document.querySelector('.search-box');
  if (!trigger) return;
  const pageLang = document.documentElement.lang === 'zh-Hant' ? 'zh' : 'en';

  let index = null;
  let modal = null;
  let cursor = 0;

  async function loadIndex() {
    if (index) return index;
    try {
      const res = await fetch('search-index.json');
      index = res.ok ? await res.json() : [];
    } catch { index = []; }
    return index;
  }

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function highlight(text, q) {
    if (!q) return esc(text);
    const i = text.toLowerCase().indexOf(q);
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }
  function snippet(text, q) {
    if (!text) return '';
    const i = text.toLowerCase().indexOf(q);
    if (i < 0) return esc(text.slice(0, 120)) + '…';
    const start = Math.max(0, i - 40);
    return (start > 0 ? '…' : '') + highlight(text.slice(start, start + 140).trim(), q) + '…';
  }

  function search(q) {
    const query = q.toLowerCase().trim();
    if (!query) return [];
    return (index || [])
      .map(it => {
        const title = (it.title || '').toLowerCase();
        const text  = (it.text || '').toLowerCase();
        let score = 0;
        if (title === query) score += 100;
        if (title.startsWith(query)) score += 40;
        if (title.includes(query)) score += 25;
        if ((it.section || '').toLowerCase().includes(query)) score += 8;
        if (text.includes(query)) score += 3;
        if (score > 0 && it.lang === pageLang) score += 2;
        return { it, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }

  function render(list, q, resultsEl) {
    cursor = 0;
    if (!q.trim()) { resultsEl.innerHTML = '<li class="search-hint">Type to search every page — skills, lessons, glossary, demos…</li>'; return; }
    if (!list.length) { resultsEl.innerHTML = '<li class="search-hint">No results</li>'; return; }
    const query = q.toLowerCase().trim();
    resultsEl.innerHTML = list.map(({ it }, idx) =>
      `<li><a class="search-result${idx === 0 ? ' active' : ''}" href="${esc(it.url)}">
        <span class="search-result-title">${highlight(it.title, query)}</span>
        <span class="search-result-section">${esc(it.section || '')}</span>
        <span class="search-result-snippet">${snippet(it.text, query)}</span>
      </a></li>`).join('');
  }

  function move(delta, resultsEl) {
    const items = Array.from(resultsEl.querySelectorAll('.search-result'));
    if (!items.length) return;
    items[cursor]?.classList.remove('active');
    cursor = (cursor + delta + items.length) % items.length;
    items[cursor].classList.add('active');
    items[cursor].scrollIntoView({ block: 'nearest' });
  }

  async function open() {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
      <div class="search-panel" role="dialog" aria-modal="true" aria-label="Search">
        <div class="search-head">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input class="search-input" type="text" placeholder="Search InvestSkill…" autocomplete="off" spellcheck="false" aria-label="Search">
          <kbd class="kbd">esc</kbd>
        </div>
        <ul class="search-results"></ul>
        <div class="search-foot"><span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> navigate</span><span><kbd class="kbd">↵</kbd> open</span></div>
      </div>`;
    document.body.appendChild(modal);
    const input = modal.querySelector('.search-input');
    const resultsEl = modal.querySelector('.search-results');
    render([], '', resultsEl);
    loadIndex().then(() => { if (input.value) render(search(input.value), input.value, resultsEl); });

    input.addEventListener('input', () => render(search(input.value), input.value, resultsEl));
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1, resultsEl); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1, resultsEl); }
      else if (e.key === 'Enter') {
        const active = resultsEl.querySelector('.search-result.active') || resultsEl.querySelector('.search-result');
        if (active) window.location.href = active.getAttribute('href');
      }
    });
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    setTimeout(() => input.focus(), 0);
  }
  function close(restoreFocus = false) {
    if (!modal) return;
    modal.remove(); modal = null;
    if (restoreFocus) trigger.focus();
  }

  trigger.addEventListener('click', open);
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); modal ? close(true) : open(); }
    if (e.key === 'Escape' && modal) close(true);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  buildTOC();
  setupScrollSpy();
  setupCopyButton();
  setupCodeCopy();
  setupInstaller();
  setupSidebar();
  setupScrollUI();
  setupReveal();
  setupSkillFilter();
  setupSearch();
});
