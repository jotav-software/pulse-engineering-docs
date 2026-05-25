const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');
const { createDocsRouter } = require('./lib/docs');

const app = express();
const PORT = process.env.PORT || 8080;
const REPO_ROOT = __dirname;
const MARCA_ROOT = path.join(REPO_ROOT, 'marca');

const kitUser = process.env.BRAND_KIT_USER;
const kitPassword = process.env.BRAND_KIT_PASSWORD;
const authConfigured = Boolean(kitUser && kitPassword);
const pulseApiUrl = process.env.PULSE_API_URL?.replace(/\/$/, '');

const kitAuth = basicAuth({
  users: authConfigured ? { [kitUser]: kitPassword } : {},
  challenge: true,
  realm: 'Pulse Internal Docs',
  unauthorizedResponse: () => 'Autenticação necessária para documentação interna.',
});

/** Prefix redirects for legacy CDN doc paths (301). Longest match first. */
const DOC_REDIRECTS = [
  ['/docs/product/policies', '/docs/produto/regras-negocio'],
  ['/docs/product/access', '/docs/produto/acesso'],
  ['/docs/product/facial', '/docs/produto/biometria'],
  ['/docs/product/dev', '/docs/produto/qa'],
  ['/docs/product/especificacao-funcional', '/docs/produto/especificacao-funcional'],
  ['/docs/legal/politicas', '/docs/juridico/politicas-publicas'],
  ['/docs/legal/compliance', '/docs/juridico/conformidade'],
  ['/docs/commercial/gtm', '/docs/comercial/lancamento'],
  ['/docs/adr', '/docs/engenharia/decisoes'],
  ['/docs/architecture', '/docs/engenharia/arquitetura'],
  ['/docs/standards', '/docs/engenharia/padroes'],
  ['/docs/backlog', '/docs/engenharia/backlog'],
  ['/docs/product', '/docs/produto'],
  ['/docs/legal', '/docs/juridico'],
  ['/docs/commercial', '/docs/comercial'],
  ['/docs/ops', '/docs/operacoes'],
];

async function validateAdminBearer(req) {
  if (!pulseApiUrl) return false;

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return false;

  try {
    const response = await fetch(`${pulseApiUrl}/api/admin/v1/auth/me`, {
      headers: { Authorization: authHeader },
    });

    if (!response.ok) return false;

    const payload = await response.json();
    return payload?.success === true && payload?.data?.role === 'PULSE_ADMIN';
  } catch (error) {
    console.warn('Falha ao validar Bearer admin:', error.message);
    return false;
  }
}

function requireInternalAuth(req, res, next) {
  validateAdminBearer(req)
    .then((isAdmin) => {
      if (isAdmin) return next();

      if (!authConfigured) {
        return res
          .status(503)
          .type('text/plain')
          .send(
            'Documentação interna indisponível: configure BRAND_KIT_USER/BRAND_KIT_PASSWORD ou PULSE_API_URL com Bearer admin.',
          );
      }

      return kitAuth(req, res, next);
    })
    .catch(next);
}

function legacyDocsRedirect(req, res, next) {
  const pathname = req.originalUrl.split('?')[0];
  for (const [from, to] of DOC_REDIRECTS) {
    if (pathname === from || pathname.startsWith(`${from}/`)) {
      const suffix = pathname.slice(from.length);
      const query = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
      return res.redirect(301, `${to}${suffix}${query}`);
    }
  }
  return next();
}

const staticOptions = {
  index: false,
  extensions: ['html'],
};

// Public CDN — logos, icons, patterns for apps
app.use('/assets', express.static(path.join(MARCA_ROOT, 'assets'), staticOptions));

// Protected — HTML kits, tokens.css, brief
app.use('/kit', requireInternalAuth, express.static(path.join(MARCA_ROOT, 'kits'), staticOptions));

app.get('/brand-kit-brief.md', requireInternalAuth, (_req, res) => {
  res.sendFile(path.join(MARCA_ROOT, 'brand-kit-brief.md'));
});

// Legacy doc path redirects, then protected docs
app.use('/docs', legacyDocsRedirect);
app.use('/docs', requireInternalAuth, createDocsRouter());

app.get('/', (_req, res) => {
  res
    .status(200)
    .type('html')
    .send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Pulse CDN & Docs</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0b0d12; color: #e8ecf4; margin: 0; padding: 48px; }
    main { max-width: 720px; margin: 0 auto; }
    h1 { margin-bottom: 0.25rem; }
    p { color: #9aa3b5; }
    ul { line-height: 1.8; }
    a { color: #9b87ff; }
    code { background: #171b25; padding: 2px 6px; border-radius: 6px; }
  </style>
</head>
<body>
  <main>
    <h1>Pulse CDN & Docs</h1>
    <p>Serviço Railway <code>pulse-brand-assets</code> (docs + marca)</p>
    <ul>
      <li><a href="/assets/">/assets/</a> — logos e ícones públicos</li>
      <li><a href="/kit/">/kit/</a> — brand kits HTML (auth)</li>
      <li><a href="/docs/">/docs/</a> — documentação interna (auth)</li>
    </ul>
  </main>
</body>
</html>`);
});

app.use((_req, res) => {
  res.status(404).type('text/plain').send('Not found');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `Pulse CDN listening on 0.0.0.0:${PORT} (basic auth: ${authConfigured ? 'on' : 'off'}, admin bearer: ${pulseApiUrl ? pulseApiUrl : 'off'})`,
  );
});
