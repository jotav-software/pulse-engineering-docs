# Matriz de Papéis e Permissões Pulse! (HU 3)

Este documento define a autoridade e as fronteiras de cada papel no ecossistema. Qualquer implementação de código deve seguir rigorosamente estas definições.

## 1. Definição de Fronteiras (Apps)

| Papel | App Principal | Pode acessar App Produtor? | Foco de Experiência |
| :--- | :--- | :--- | :--- |
| **CLIENT** | Cliente | ❌ Não | Compra e uso de ingressos. |
| **PRODUCER**| Produtor | ✅ Sim | Gestão estratégica, financeira e de equipe. |
| **STAFF** | Produtor | ✅ Sim | Operação de campo (Check-in) e Vendas (Promoter). |
| **PROMOTER**| Cliente | ❌ Não | Performance comercial e links de indicação. |
| **ADMIN** | Admin Web | ✅ Sim (Futuro) | Governança global da plataforma. |

---

## 2. Hierarquia e Escopo de Atuação

### **PRODUCER (Dono da Organização)**
- **Escopo**: Organização (Org).
- **Herança**: Possui todas as permissões de Staff e Promoter.
- **Acesso**: Vê todos os eventos da sua organização.
- **Financeiro**: Acesso total a extratos, saques e dados bancários.

### **STAFF (Operador de Organização/Evento)**
- **Escopo**: Evento Vinculado (`EventStaff`).
- **Herança**: Possui todas as permissões de Promoter.
- **Diferencial**: Pode realizar Check-in (Validação Facial/QR) e ver métricas operacionais.
- **Limitação**: Não vê dados financeiros sensíveis do produtor (extrato global, saques).

### **PROMOTER (Divulgador Comercial)**
- **Escopo**: Comercial do Evento.
- **App**: **100% Client App**.
- **Ação**: Gerar links (`ref`), visualizar histórico de vendas e performance própria.
- **Limitação**: Nenhuma ação operacional (check-in) ou administrativa.

---

## 3. Implementação Técnica (RBAC)

Para garantir flexibilidade, a verificação de permissão deve seguir a ordem:

1.  **Global Role** (`User.role`): Define o papel "primário" do usuário.
    - Se for `ADMIN` ou `PRODUCER`, possui flags de acesso administrativo.
2.  **Org Membership** (`ProducerMembership`): Define se o usuário pertence ao time de uma organização específica.
3.  **Event Context** (`EventStaff`): Define o papel temporário em um evento específico.

### Regra de Login (Gatekeeper)
```typescript
if (app === 'PRODUCER') {
  const isAllowed = user.role === 'ADMIN' || 
                   user.role === 'PRODUCER' || 
                   user.role === 'STAFF';
  
  if (!isAllowed) throw new ForbiddenError("Acesso restrito ao App Produtor");
}
```

---

## 4. Segurança de Onboarding (`must_change_password`)

- Todo usuário convidado (Staff/Promoter) terá `must_change_password: true`.
- O Middleware de Autenticação deve bloquear qualquer UseCase operacional se essa flag estiver ativa.
- **Exceção única**: Rota de `UpdatePassword`.

---

## 5. Próximos Passos de Modelagem

- [ ] Ajustar `EventStaff` para usar Enum ou amarrar consistentemente com `Role`.
- [ ] Implementar `ContextMiddleware` no backend para resolver a "Role Ativa" baseado no `eventId` da request.
- [ ] Criar Guard no Client App para exibir "Área do Produtor" apenas para roles permitidas.
