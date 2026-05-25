const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const DOCS_ROOT = path.join(__dirname, '..');
const DOCS_SECTIONS = [
  { id: 'adr', label: 'ADRs', description: 'Architecture Decision Records' },
  { id: 'architecture', label: 'Arquitetura', description: 'Visão técnica, pagamentos, jobs' },
  { id: 'standards', label: 'Padrões', description: 'API, backend, frontend, testes, segurança' },
  { id: 'product', label: 'Produto', description: 'Specs, políticas, acesso, facial' },
  { id: 'backlog', label: 'Backlog', description: 'Roadmaps e épicos técnicos' },
  { id: 'legal', label: 'Legal', description: 'Contratos, LGPD, fiscal, compliance' },
  { id: 'commercial', label: 'Comercial', description: 'GTM, apresentações, pricing' },
  { id: 'ops', label: 'Ops', description: 'Deploy, variáveis, CDN' },
];

const SECTION_IDS = new Set(DOCS_SECTIONS.map((s) => s.id));
const SKIP_DIRS = new Set(['node_modules', '.git', 'brand', 'prototypes', 'scripts']);

marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
  mangle: false,
});

function resolveDocPath(requestPath) {
  const decoded = decodeURIComponent(requestPath);
  const normalized = path.normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '');
  const absolute = path.join(DOCS_ROOT, normalized);

  if (!absolute.startsWith(DOCS_ROOT)) {
    return null;
  }

  return absolute;
}

function isAllowedDocPath(absolutePath) {
  const relative = path.relative(DOCS_ROOT, absolutePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return false;
  }

  const parts = relative.split(path.sep).filter(Boolean);
  if (parts.length === 0) {
    return true;
  }

  const top = parts[0];
  if (top === 'README.md' || top === 'MIGRATION-LOG.md') {
    return parts.length === 1;
  }

  return SECTION_IDS.has(top);
}

function listDirectory(dirPath, baseHref) {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    return [];
  }

  const entries = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.') && !SKIP_DIRS.has(entry.name))
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name, 'pt-BR');
    });

  return entries.map((entry) => {
    const href = `${baseHref}/${encodeURIComponent(entry.name)}`.replace(/\/+/g, '/');
    return {
      name: entry.name,
      href: entry.isDirectory() ? `${href}/` : href,
      isDirectory: entry.isDirectory(),
      isMarkdown: !entry.isDirectory() && entry.name.endsWith('.md'),
      isHtml: !entry.isDirectory() && entry.name.endsWith('.html'),
    };
  });
}

function buildBreadcrumbs(requestPath) {
  const parts = requestPath.split('/').filter(Boolean);
  const crumbs = [{ label: 'Docs', href: '/docs/' }];
  let current = '';

  for (const part of parts) {
    current += `/${part}`;
    crumbs.push({
      label: part,
      href: `/docs${current}${part.endsWith('.md') || part.endsWith('.html') ? '' : '/'}`,
    });
  }

  return crumbs;
}

function renderPage({ title, bodyHtml, breadcrumbs, sidebar, meta }) {
  const crumbHtml = breadcrumbs
    .map((crumb, index) => {
      if (index === breadcrumbs.length - 1) {
        return `<span>${escapeHtml(crumb.label)}</span>`;
      }
      return `<a href="${crumb.href}">${escapeHtml(crumb.label)}</a>`;
    })
    .join('<span class="sep">/</span>');

  const sidebarHtml = sidebar
    .map(
      (item) =>
        `<a class="nav-item${item.active ? ' active' : ''}" href="${item.href}"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.description)}</span></a>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} · Pulse Docs</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0b0d12;
      --panel: #12151d;
      --panel-2: #171b25;
      --text: #e8ecf4;
      --muted: #9aa3b5;
      --accent: #7c5cff;
      --accent-2: #3dd6c6;
      --border: #252b38;
      --code-bg: #0f131b;
      --link: #9b87ff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: radial-gradient(circle at top, #15192a 0%, var(--bg) 45%);
      color: var(--text);
      line-height: 1.6;
    }
    a { color: var(--link); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      min-height: 100vh;
    }
    .sidebar {
      border-right: 1px solid var(--border);
      background: rgba(18, 21, 29, 0.92);
      padding: 24px 18px;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: auto;
    }
    .brand {
      font-weight: 700;
      letter-spacing: 0.02em;
      margin-bottom: 8px;
      font-size: 1.1rem;
    }
    .brand span { color: var(--accent-2); }
    .subtitle { color: var(--muted); font-size: 0.9rem; margin-bottom: 24px; }
    .nav-item {
      display: block;
      padding: 12px 14px;
      border: 1px solid transparent;
      border-radius: 12px;
      margin-bottom: 8px;
      color: var(--text);
    }
    .nav-item span {
      display: block;
      color: var(--muted);
      font-size: 0.82rem;
      margin-top: 2px;
    }
    .nav-item:hover, .nav-item.active {
      background: var(--panel-2);
      border-color: var(--border);
      text-decoration: none;
    }
    .content {
      padding: 28px 40px 64px;
      max-width: 980px;
    }
    .breadcrumbs {
      color: var(--muted);
      font-size: 0.92rem;
      margin-bottom: 18px;
    }
    .breadcrumbs .sep { margin: 0 8px; opacity: 0.5; }
    .meta {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .pill {
      border: 1px solid var(--border);
      background: var(--panel);
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 0.82rem;
      color: var(--muted);
    }
    .markdown, .index-list {
      background: rgba(18, 21, 29, 0.72);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 28px 32px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    }
    .markdown h1, .markdown h2, .markdown h3, .markdown h4 {
      line-height: 1.25;
      scroll-margin-top: 24px;
    }
    .markdown h1 { font-size: 2rem; margin-top: 0; }
    .markdown h2 {
      margin-top: 2rem;
      padding-bottom: 0.35rem;
      border-bottom: 1px solid var(--border);
    }
    .markdown pre, .markdown code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }
    .markdown code {
      background: var(--code-bg);
      padding: 0.15rem 0.4rem;
      border-radius: 6px;
      font-size: 0.92em;
    }
    .markdown pre {
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      overflow: auto;
    }
    .markdown pre code { background: none; padding: 0; }
    .markdown table {
      width: 100%;
      border-collapse: collapse;
      display: block;
      overflow: auto;
      margin: 1rem 0;
    }
    .markdown th, .markdown td {
      border: 1px solid var(--border);
      padding: 10px 12px;
      text-align: left;
    }
    .markdown th { background: var(--panel-2); }
    .markdown blockquote {
      margin: 1rem 0;
      padding: 0.5rem 1rem;
      border-left: 4px solid var(--accent);
      color: var(--muted);
      background: rgba(124, 92, 255, 0.08);
      border-radius: 0 10px 10px 0;
    }
    .index-list ul { list-style: none; padding: 0; margin: 0; }
    .index-list li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
    }
    .index-list li:last-child { border-bottom: none; }
    .index-list .tag {
      font-size: 0.75rem;
      color: var(--muted);
      border: 1px solid var(--border);
      border-radius: 999px;
      padding: 2px 8px;
      white-space: nowrap;
    }
    @media (max-width: 960px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { position: static; height: auto; border-right: none; border-bottom: 1px solid var(--border); }
      .content { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">Pulse <span>Docs</span></div>
      <div class="subtitle">Documentação de engenharia</div>
      ${sidebarHtml}
    </aside>
    <main class="content">
      <nav class="breadcrumbs">${crumbHtml}</nav>
      ${meta ? `<div class="meta">${meta}</div>` : ''}
      ${bodyHtml}
    </main>
  </div>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSidebar(activeSection) {
  return DOCS_SECTIONS.map((section) => ({
    ...section,
    href: `/docs/${section.id}/`,
    active: section.id === activeSection,
  }));
}

function renderIndexPage() {
  const cards = DOCS_SECTIONS.map((section) => {
    const files = listDirectory(path.join(DOCS_ROOT, section.id), `/docs/${section.id}`);
    return `<li><a href="/docs/${section.id}/"><strong>${escapeHtml(section.label)}</strong></a><span class="tag">${files.length} itens</span></li>`;
  }).join('');

  const readmePath = path.join(DOCS_ROOT, 'README.md');
  let intro = '<p>Documentação central do ecossistema Pulse.</p>';
  if (fs.existsSync(readmePath)) {
    const md = fs.readFileSync(readmePath, 'utf8');
    const excerpt = md.split('\n\n').slice(0, 2).join('\n\n');
    intro = `<div class="markdown">${marked.parse(excerpt)}</div>`;
  }

  const bodyHtml = `${intro}<div class="index-list"><ul>${cards}</ul></div>`;
  return renderPage({
    title: 'Índice',
    bodyHtml,
    breadcrumbs: [{ label: 'Docs', href: '/docs/' }],
    sidebar: buildSidebar(null),
  });
}

function renderDirectoryPage(requestPath, absolutePath) {
  const sectionId = requestPath.split('/').filter(Boolean)[0] || null;
  const entries = listDirectory(absolutePath, `/docs/${requestPath.replace(/\/$/, '')}`);
  const items = entries
    .map((entry) => {
      const tag = entry.isDirectory ? 'pasta' : entry.isMarkdown ? 'markdown' : entry.isHtml ? 'html' : 'arquivo';
      return `<li><a href="${entry.href}">${escapeHtml(entry.name)}</a><span class="tag">${tag}</span></li>`;
    })
    .join('');

  const bodyHtml = `<div class="index-list"><ul>${items || '<li><span class="tag">Pasta vazia</span></li>'}</ul></div>`;
  return renderPage({
    title: path.basename(absolutePath) || 'Docs',
    bodyHtml,
    breadcrumbs: buildBreadcrumbs(requestPath.replace(/\/$/, '')),
    sidebar: buildSidebar(sectionId),
  });
}

function renderMarkdownPage(requestPath, absolutePath) {
  const sectionId = requestPath.split('/').filter(Boolean)[0] || null;
  const markdown = fs.readFileSync(absolutePath, 'utf8');
  const html = marked.parse(markdown);
  const rawHref = `/docs/${requestPath}?format=raw`;
  const meta = `<a class="pill" href="${rawHref}">Ver Markdown bruto</a>`;

  return renderPage({
    title: path.basename(absolutePath, '.md'),
    bodyHtml: `<article class="markdown">${html}</article>`,
    breadcrumbs: buildBreadcrumbs(requestPath),
    sidebar: buildSidebar(sectionId),
    meta,
  });
}

function createDocsRouter() {
  const express = require('express');
  const router = express.Router();

  router.get('/', (_req, res) => {
    res.type('html').send(renderIndexPage());
  });

  router.get('/*', (req, res) => {
    const requestPath = req.params[0] || '';
    const absolutePath = resolveDocPath(requestPath);

    if (!absolutePath || !isAllowedDocPath(absolutePath)) {
      return res.status(404).type('text/plain').send('Documento não encontrado.');
    }

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).type('text/plain').send('Documento não encontrado.');
    }

    const stat = fs.statSync(absolutePath);

    if (stat.isDirectory()) {
      return res.type('html').send(renderDirectoryPage(requestPath, absolutePath));
    }

    if (absolutePath.endsWith('.md')) {
      if (req.query.format === 'raw') {
        return res.type('text/markdown; charset=utf-8').sendFile(absolutePath);
      }
      return res.type('html').send(renderMarkdownPage(requestPath, absolutePath));
    }

    if (absolutePath.endsWith('.html')) {
      return res.sendFile(absolutePath);
    }

    return res.sendFile(absolutePath);
  });

  return router;
}

module.exports = {
  createDocsRouter,
  DOCS_SECTIONS,
};
