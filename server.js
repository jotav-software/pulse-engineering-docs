const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');
const { createDocsRouter } = require('./lib/docs');

const app = express();
const PORT = process.env.PORT || 8080;
const REPO_ROOT = __dirname;
const BRAND_ROOT = path.join(REPO_ROOT, 'brand');

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

const staticOptions = {
  index: false,
  extensions: ['html'],
};

// Public CDN — logos, icons, patterns for apps
app.use('/assets', express.static(path.join(BRAND_ROOT, 'assets'), staticOptions));

// Protected — HTML kits, tokens.css, brief
app.use('/kit', requireInternalAuth, express.static(path.join(BRAND_ROOT, 'kit'), staticOptions));

app.get('/brand-kit-brief.md', requireInternalAuth, (_req, res) => {
  res.sendFile(path.join(BRAND_ROOT, 'brand-kit-brief.md'));
});

// Protected — engineering docs with Markdown preview
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
    <p>Serviço Railway <code>pulse-brand-assets</code></p>
    <ul>
      <li><a href="/assets/">/assets/</a> — logos e ícones públicos</li>
      <li><a href="/kit/">/kit/</a> — brand kits HTML (auth)</li>
      <li><a href="/docs/">/docs/</a> — documentação de engenharia (auth)</li>
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
