# Fluxos — Pulse Admin

Diagramas em [Mermaid](https://mermaid.js.org/) — mesmo padrão dos [fluxos do App Produtor](../README.md).

**Especificação canônica:** [pulse-admin.md](../../pulse-admin.md) (HU01–HU06) · **Mock visual:** [admin-dashboard-mock.html](../../../../producer-web/_apenas-git/prototipos/admin/admin-dashboard-mock.html) · **Índice global de mocks:** [_apenas-git/prototipos/README.md](../../../../_apenas-git/prototipos/README.md)

| Fluxo | HU | Status geral |
| --- | --- | --- |
| [KYC — aprovação documental](kyc-aprovacao/) | HU02 (subfluxo) | [IMPLEMENTADO] |
| [Produtoras — onboarding e detalhe](produtoras/) | HU02, HU02b | [IMPLEMENTADO] |
| [Financeiro — repasses e freeze](financeiro-repasse/) | HU04, HU04b | [IMPLEMENTADO] |
| [Estornos — central admin](estornos/) | HU05, HU05b | [IMPLEMENTADO] / antifraude [PARCIAL] |
| [Compliance — termos legais](compliance-termos/) | HU06 | [IMPLEMENTADO] |

**Fora desta pasta (resumo em pulse-admin.md):** autenticação 2FA (HU01), visão checkout 24h (HU03), moderação global de evento (`POST /events/:id/suspend`).
