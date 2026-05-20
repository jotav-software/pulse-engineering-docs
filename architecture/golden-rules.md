# 🏆 Regras de Ouro da Arquitetura Pulse!

Este documento define as diretrizes inegociáveis para o desenvolvimento do ecossistema Pulse! (Backend, App Client e App Producer). Seguir estas regras garante a escalabilidade, segurança e estabilidade do sistema.

---

## 1. Segregação de Contexto (Namespace)
**Regra:** Endpoints para Clientes e Produtores devem ser isolados na camada de apresentação.
- **Como:** **`/api/client/v1/...`** (canônico B2C) e **`/api/producer/v1/...`** (B2B). Rotas B2C na **raiz** (`/events`, `/auth`, …) permanecem como **espelho legado** até todos os clientes migrarem — não remova sem janela de deprecação.
- **Por que:** Evita que alterações em funcionalidades de gestão (Produtor) quebrem acidentalmente a experiência de compra (Cliente); produção atual depende do espelho na raiz.

## 2. Estabilidade de Contrato (Type-Safety)
**Regra:** Nenhuma alteração de esquema de resposta ou entrada pode ser feita sem validação técnica.
- **Como:** Uso obrigatório de `t.Object` (Elysia/Zod) para validar I/O.
- **Por que:** Garante que o App Mobile (Client/Producer) não quebre em runtime por falta de campos ou tipos incorretos.

## 3. Segurança: RBAC Mandatório
**Regra:** Todo endpoint que não seja público deve validar explicitamente o papel (`role`) do usuário.
- **Como:** Middlewares de autorização que verificam `role === 'producer'` ou `role === 'client'`.
- **Por que:** Impede que um usuário mal-intencionado use um token válido para acessar dados sensíveis de outras personas.

## 4. Domínio como Fonte da Verdade
**Regra:** Toda regra de negócio (cálculos de taxas, validação de transferência, estorno) deve residir nos **Use Cases**.
- **Como:** Controllers são burros: eles apenas recebem o input, chamam o Use Case e retornam o output.
- **Por que:** Facilita testes unitários e garante que a lógica seja a mesma, independente de quem a chama.

## 5. Integridade do "Gasto Duplo" (Atomicidade)
**Regra:** Processos que envolvem movimentação de ativos (ingressos/dinheiro) devem ser **Atômicos**.
- **Como:** Uso obrigatório de `Prisma.$transaction` em transferências e check-outs.
- **Por que:** Evita bugs críticos onde um ingresso é transferido mas o original não é desativado (Cadeia de Custódia).

## 6. Performance: Índices e Queries
**Regra:** Toda nova query complexa deve ser acompanhada de uma análise de índices.
- **Como:** Índices para `status`, `userId`, `eventId` e campos de busca.
- **Por que:** Garante sub-200ms de resposta mesmo com alto volume de dados (ex: eventos de grande porte).

## 7. Mensagens de Erro Humanizadas
**Regra:** Erros de negócio devem ter códigos únicos e mensagens claras.
- **Como:** Retornar `{ "code": "TICKET_ALREADY_TRANSFERRED", "message": "Este ingresso já foi transferido." }`.
- **Por que:** Permite que o App Mobile trate o erro e mostre um feedback amigável ao usuário final.

## 8. Monorepo-Ready, Local-First
**Regra:** As pastas `backend/`, `app-client/` e `app-producer/` são repositórios Git independentes, mas devem ser tratadas como uma suite unificada de produtos.
- **Como:** Manter caminhos relativos consistentes e documentação de integração clara.
- **Por que:** Facilita a manutenção por diferentes equipes sem perder a visão do todo.

## 9. Testes de Regressão Críticos
**Regra:** Toda funcionalidade core (Auth, Ticket Transfer, Checkout) deve ter cobertura de testes de integração.
- **Como:** Testes automatizados simulando fluxos reais de ponta a ponta.
- **Por que:** Dá confiança para refatorar o código sem medo de quebrar o fluxo principal de receita.

## 10. Design de Experiência (UX) Premium
**Regra:** O backend deve suportar a experiência "luxury".
- **Como:** Suporte a Webhooks para notificações em tempo real, suporte a imagens otimizadas e metadados ricos.
- **Por que:** O Pulse! não é apenas uma tiqueteira, é uma plataforma de experiência.

---
**Assinado:** Equipe de Engenharia Pulse! (Architect, Security, Mobile, Developer, Writer)
