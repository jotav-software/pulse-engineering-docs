# Fluxos funcionais

Diagramas em [Mermaid](https://mermaid.js.org/) — renderizam no GitHub e em IDEs com suporte.

## App Produtor (mobile)

| Documento | Conteúdo |
|-----------|----------|
| [Login e primeiro acesso](login-e-primeiro-acesso/) | Imagem de referência do fluxo épico 1 (PNG). |
| [Criação de evento — parte 1](criacao-de-evento/parte-1-entrada-e-navegacao.md) | Navegação até abrir a tela de criar evento. |
| [Criação de evento — parte 2](criacao-de-evento/parte-2-formulario-e-validacao.md) | Validações do formulário antes de enviar. |
| [Criação de evento — parte 3](criacao-de-evento/parte-3-persistencia-e-comercial.md) | Gravação do rascunho, bifurcação e tela comercial. |

## Pulse Admin (Producer Web `/admin/*`)

Especificação resumida: [pulse-admin.md](../pulse-admin.md) · Índice dos fluxos: [admin/](admin/README.md)

**Mock HTML:** [admin-dashboard-mock.html](../../../../producer-web/_apenas-git/prototipos/admin/admin-dashboard-mock.html) (repo `producer-web`) · Catálogo: [_apenas-git/prototipos/README.md](../../../../_apenas-git/prototipos/README.md)

| Fluxo | Partes |
|-------|--------|
| [KYC — aprovação](admin/kyc-aprovacao/) | Entrada → revisão → `KYC_APPROVED` |
| [Produtoras](admin/produtoras/) | Listagem → formulário → persistência |
| [Financeiro — repasse](admin/financeiro-repasse/) | Abas/KPIs → freeze/unfreeze → export CSV |
| [Estornos](admin/estornos/) | Listagem/wizard → validate → gateway |
| [Compliance — documentos legais](admin/compliance-termos/) | Cards → publicar → `forceAcceptance` → logs/exportação |

## Lockfiles: Bun vs `package-lock.json`

O repositório mantém **`bun.lock`** e, em alguns momentos, também **`package-lock.json`**.

- **Bun** deve ser a fonte de verdade quando o time instala com `bun install` e o CI/EAS segue o mesmo.
- **`package-lock.json`** só faz sentido se alguém (ou pipeline antigo) ainda usar **`npm ci` / npm install**. Dois lockfiles paralelos aumentam drift e conflitos: versões diferentes podem ser resolvidas de formas distintas.

**Recomendação pragmática:** padronizar em **só Bun** — versionar apenas `bun.lock`, remover `package-lock.json` do repositório e listar em `.gitignore`; **antes**, confirmar no EAS/host de build qual comando roda (`bun`, `yarn`, `npm`). O `eas.json` não fixa gerenciador; o que vale é o que o servidor de build executa.

Nada foi removido automaticamente deste trabalho para não quebrar quem usa npm hoje.
