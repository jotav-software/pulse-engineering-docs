# Regras de Implementação Técnica (PULSE!)

Documentação de padrões e qualidade exigidos para o desenvolvimento do ecossistema Pulse!.

## 🏗️ Padrões de Arquitetura & Código
- **Clean Architecture:** Manter separação rígida entre camadas (Domain, Application, Infrastructure, Presentation).
- **SOLID Principles:** Interfaces isoladas e classes com responsabilidade única.
- **DTOs Obrigatórios:** Proibido o uso de `any`. Toda entrada e saída de dados deve ter DTOs/Interfaces tipadas.
- **Comentários:** Apenas para regras de negócio complexas ou decisões técnicas obscuras. Sempre objetivos e diretos.

## 🧪 Qualidade & Testes
- **Testes Unitários:** Todo novo Use Case deve nascer com testes unitários (Bun Test).
- **Mocks:** Usar Mocks para isolar o domínio da infraestrutura durante os testes.
- **100% Path Coverage:** Testar caminhos felizes e fluxos de erro (ex: dados inválidos, duplicidade).

## 🛡️ Segurança & Documentação
- **Proteção de Rotas:** Endpoints de negócio devem usar o `authMiddleware` e o `requireRole` (RBAC). Retorno padrão de **401 Unauthorized** para acessos não autenticados.
- **Swagger Automatic:** Toda rota do Elysia deve ter o `detail` preenchido com `summary`, `tags` e schemas de saída documentados.
- **Identidade Unificada:** Uso do **Better-Auth** como fonte da verdade de sessões e usuários.

## 🧱 Workflow de Desenvolvimento
1.  Definir Entidade (Domain).
2.  Definir Repositório/Interface (Domain).
3.  Seguir o [Prisma Workflow](PRISMA-WORKFLOW.md) para atualizar o schema e gerar os tipos.
4.  Implementar Use Case (Application) + Testes Unitários.
5.  Implementar Repositório (Infrastructure).
6.  Criar Controller (Presentation) + Docs Swagger.
7.  Registrar no Servidor Central.
