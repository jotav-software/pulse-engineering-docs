# Pulse! — Brand Kit Brief
> Documento consolidado para Claude Design / agências criativas.
> Inclui posicionamento renovado, paleta, tipografia, logotipo e direção visual para todas as frentes do produto.

---

## 1. O que é o Pulse!

**Pulse! é a primeira plataforma brasileira de ingressos com acesso facial.**
Ela une venda de ingressos, check-in biométrico instantâneo e gestão financeira avançada num único ecossistema.

> Tagline principal: **"Seu rosto é o ingresso. O fim das filas."**
> Tagline secundária: **"O fim das filas e dos chargebacks."**

### Problema que resolve
- Filas quilométricas no evento
- Fraude, revenda e chargebacks
- Produtores sem visibilidade financeira real
- Fluxo de caixa travado pós-evento

### Proposta de valor por público

**Para o Produtor (B2B):**
> "Controle total. Fraude Zero."
Gestão de eventos, bilheteria inteligente, check-in facial operacional, dashboard financeiro transparente e antecipação de recebíveis por score histórico.

**Para o Comprador (B2C):**
> "Compre o ingresso. Cadastre o rosto. Entre sem fila."
Compra em menos de 1 minuto, entrada via biometria, sem depender de bateria ou internet na portaria.

---

## 2. Paleta de Cores

### Cores Principais

| Nome | Hex | Uso |
|---|---|---|
| **Pulse Purple** | `#7b2cbf` | Cor primária da marca, botões principais, destaques |
| **Pulse Dark** | `#5a189a` | Hover, gradiente escuro, estado pressionado |
| **Pulse Light** | `#f3e8ff` | Fundos suaves, chips, tags |
| **Pulse Accent (Cyan/Teal)** | `#00f5d4` | Acento neon, CTAs secundários, gráficos live |
| **Pulse VIP (Amber)** | `#f59e0b` | Tier VIP, membership, selo premium |

### Cores de Suporte

| Nome | Hex | Uso |
|---|---|---|
| **Pulse Sidebar** | `#0f172a` | Fundo de sidebar / modo escuro / app icon |
| **Pulse BG** | `#f8fafc` | Background de páginas claras |
| **Branco** | `#ffffff` | Cards, inputs, superfícies |
| **Cinza texto** | `#374151` | Corpo de texto principal |

### Gradiente Assinatura
```
linear-gradient(90deg, #e0aaff → #00f5d4)
```
*(Lavanda → Teal — usado em hero sections, logotipo tratado, CTAs de destaque)*

### Modo Escuro (App Producer / App Icon)
- Background: `#0f172a` (near-black navy)
- Logo: branco puro
- Subtítulo/label: `#94a3b8` (slate 400)

---

## 3. Tipografia

### Hierarquia

| Nível | Fonte | Peso | Uso |
|---|---|---|---|
| Display / Hero | **Outfit** | 700, 800 | Headlines de landing page, títulos de seção grandes |
| UI / Corpo | **Inter** | 300–800 | Todo o produto (painel, app, web) |
| Marca / Logotipo | **Italic bold condensed** | 800 | Tratamento do wordmark "PULSE!" |

### Direção tipográfica
- O wordmark **PULSE!** sempre em itálico, bold, tracking apertado (`letter-spacing: -0.04em`)
- A exclamação `!` recebe a cor Pulse Purple (`#7b2cbf`) quando o wordmark está em preto/dark
- O sufixo **PRO** (painel do produtor) é tratado em caixa alta, peso 600, num chip cinza arredondado ao lado do wordmark
- Headlines de produto: Outfit 800 para impacto emocional
- Interface: Inter regular/medium, sem serifa, clara e funcional

---

## 4. Logotipo

### Fonte canônica
**Caminho:** `pulse-engineering-docs/brand/assets/`

Vetores preferidos (web e apps):
| Variante | Arquivo |
|---|---|
| Horizontal (cor via CSS) | `assets/svg/logo-horizontal.svg` |
| Horizontal branco (fundo escuro) | `assets/svg/logo-horizontal-white.svg` |
| Mark / ícone | `assets/svg/logo-mark.svg` |
| Empilhado (splash/login) | `assets/svg/logo-stacked.svg` |

Exportações PNG (Canva, redes, app stores):
| Variante | Arquivo |
|---|---|
| Logo vertical roxo | `assets/01-logo/pulse-logo-vertical-roxo.png` |
| Wordmark branco | `assets/03-wordmark/pulse-wordmark-branco.png` |
| App icon (cliente) | `assets/06-app-icon-preenchido/pulse-app-icon-1024.png` |

### Sincronização para repos de código
```bash
cd pulse-engineering-docs && ./scripts/sync-brand-assets.sh
```

Copia SVGs e PNGs essenciais para `landing-page`, `client-web`, `producer-web`, `app-client` e `app-producer`.

### App Icon (produtor)
**Caminho:** `app-producer/assets/images/app-icon-pulse-produtor.svg`
- 1024×1024px, fundo `#0f172a`, logo branca, label "PRODUTOR"
- PNG dedicado: `app-icon-pulse-produtor.png` (não incluído no kit genérico)

### Instruções de uso
- Sempre respeitar área de respiro mínima equivalente à altura da letra "P"
- Não distorcer proporções
- Em fundos escuros: usar versão branca
- Em fundos claros: usar versão roxa ou preta
- O chip "PRO" nunca substitui o wordmark — é sempre complementar

---

## 5. As Três Frentes do Produto

### 5.1 Painel do Produtor — Pulse! PRO
**Plataforma:** Web (desktop-first) + App mobile
**Persona:** Produtor de eventos, promoter, equipe de operações
**Tom:** Profissional, confiante, direto. "Você está no controle."
**Direção visual:**
- Interface clara, fundo `#f8fafc`, cards brancos com bordas suaves
- Sidebar escura (`#0f172a`) com ícones e navegação vertical
- Acento roxo (`#7b2cbf`) em botões, badges e gráficos
- Dados financeiros com destaque: verde para disponível, âmbar para retido, roxo para antecipado
- Tipografia: Inter, hierarquia clara, números financeiros em fonte mono ou tabular

**Headlines de produto:**
- "Controle total. Fraude Zero."
- "Seus dados conversam com você."
- "Seu histórico vira limite." *(antecipação de recebíveis por score)*

---

### 5.2 App / Web do Cliente Final
**Plataforma:** App mobile (primário) + Web
**Persona:** Jovem adulto, frequentador de eventos, tech-friendly
**Tom:** Empolgante, rápido, inclusivo. "A festa começa aqui."
**Direção visual:**
- Dark mode predominante, vibrante
- Gradiente lavanda→teal como linguagem visual de destaque
- Cards de evento com imagem de capa grande, ticket-style
- Animações fluidas, sensação de velocidade (check-in em segundos)
- Tipografia: Outfit para headlines emocionais, Inter para UI

**Headlines de produto:**
- "Seu rosto é o ingresso. O fim das filas."
- "Compre. Cadastre. Entre. Menos de 1 minuto."
- "A experiência VIP que começa antes mesmo de entrar."

---

### 5.3 Landing Page Institucional / Comercial
**Público:** Produtores em prospecção, investidores, imprensa
**Tom:** Visionário, inovador, brasileiro. "O futuro dos grandes eventos."
**Direção visual:**
- Dark hero com gradiente de fundo (deep purple → black)
- Elementos neon/glow no acento teal
- Seção clara para benefícios e provas sociais (depoimento Ross Produções)
- Números e métricas grandes para impacto ("Zero chargebacks", "10s por pessoa")
- Logotipo em branco no hero, roxo nas seções claras

**Headlines:**
- "Por que o Pulse é o futuro dos grandes eventos?"
- "A primeira plataforma que une venda, check-in facial e gestão de portaria."
- "Dê adeus às filas quilométricas. Blinde seu caixa contra fraudes."

---

## 6. Voz e Tom da Marca

### Adjetivos da marca
Inteligente · Confiante · Rápido · Seguro · Brasileiro · Inovador

### O que a marca NÃO é
- Não é burocrática
- Não é corporativa fria
- Não é genérica (sem personalidade de ticketeira tradicional)

### Frases-chave do universo de marca
- "Fila Zero"
- "Fraude Zero"
- "Seu rosto é o ingresso"
- "Antecipação inteligente"
- "Score de produtor"
- "Controle total"
- "Menos de 1 minuto"

---

## 7. Direção Visual Renovada (Recomendações)

### O que manter
✅ Roxo `#7b2cbf` como cor primária — diferenciado e memorável no mercado de eventos BR
✅ Acento teal/cyan `#00f5d4` — cria contraste energético com o roxo
✅ Wordmark em itálico bold — sugere velocidade e movimento (consistente com "Pulse")
✅ Sidebar escura no painel — padrão pro de dashboards operacionais
✅ Amber para VIP — ouro sem clichê

### O que aprimorar
🔧 **Gradiente mais sofisticado:** Evoluir o gradiente lavanda→teal para versões com maior profundidade — adicionar um ponto intermediário de `#9d4edd` (violeta médio)
🔧 **Espaçamento e respiro:** Aumentar padding em cards e seções — o produto tem dado "cheio demais" em algumas telas
🔧 **Ícones:** Estabelecer um estilo único — recomendado Lucide Icons (já em uso no código) como sistema oficial
🔧 **Modo escuro consistente:** App producer e web devem compartilhar o mesmo dark token system
🔧 **Diferenciação PRO vs Consumer:** O painel do produtor deve parecer uma ferramenta séria (mais sóbrio, dados em evidência); o app do cliente deve ser mais festivo e visual

### Sistema de superfícies
```
Light mode:
  Background: #f8fafc
  Surface: #ffffff
  Border: #e5e7eb
  Text primary: #111827
  Text secondary: #6b7280

Dark mode:
  Background: #0f172a
  Surface: #1e293b
  Border: #334155
  Text primary: #f8fafc
  Text secondary: #94a3b8
```

---

## 8. Assets para Claude Design

### Logo a usar
📁 Vetor: `pulse-engineering-docs/brand/assets/svg/logo-horizontal.svg`
📁 PNG vertical: `pulse-engineering-docs/brand/assets/01-logo/pulse-logo-vertical-roxo.png`

### Referência de app icon
📁 Arquivo: `/pulse/app-producer/assets/images/app-icon-pulse-produtor.svg`
*(SVG limpo e vetorial — útil para favicon, app store icon, mockups)*

---

## 9. O que pedir ao Claude Design

Com base neste brief, solicite:

1. **Sistema de identidade visual** — logotipo em variantes (roxo, branco, preto, horizontal, ícone), guia de cores, tipografia
2. **Folder comercial** — 4–6 páginas: hero institucional, problema/solução, produto (produtor + cliente), prova social, CTA de contato
3. **Apresentação comercial (pitch deck)** — 10–12 slides: problema, solução, produto, diferenciais, modelo de negócio, tração, equipe, próximos passos
4. **UI Kit / Style Guide** — componentes principais (botão, input, card de evento, badge de status, KPI card)
5. **Mockups de telas** — Login PRO, Dashboard do produtor, App do cliente (tela de evento + compra)
6. **Assets de marketing** — Stories/Posts para Instagram, banner de landing page hero

---

*Gerado em: 2026-05-11 — Pulse! workspace `/Users/jhonatanlopes/workspace/pulse`*
