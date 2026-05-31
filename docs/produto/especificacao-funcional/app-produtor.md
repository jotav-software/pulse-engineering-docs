# App Produtor (mobile)

> Escopo: operação completa da produtora | Público: Dono (`PRODUCER`), Gestor (`PRODUCER_MANAGER`), Staff (`STAFF`) | Plataforma: Expo `app-producer/` | Última revisão: 2026-05-20

## Legenda de status

| Tag | Significado |
| --- | --- |
| `[IMPLEMENTADO]` | Entregue e utilizável em produção ou demo estável |
| `[PARCIAL]` | Fluxo existe com lacunas (inclui UI «em breve») |
| `[PENDENTE]` | Não implementado ou apenas planejado |

Fonte de status: código (`app-producer`, `producer-web`, `app-client`, `client-web`, `backend`) + `docs/RBAC.md` + revisão 2026-05-19.


## 1. Visão geral

Aplicativo móvel para o produtor operar o ciclo do evento: conta, eventos, lotes, participantes, **Access** (check-in), financeiro e equipe. API: **`/api/producer/v1`**.

**Promoter** usa preferencialmente o [App Cliente](./app-client.md). **Pulse Admin** é separado ([pulse-admin.md](./pulse-admin.md)).

### Decisões transversais (resumo)

| Tema | Regra |
| --- | --- |
| Publicação | Readiness mínima + titular **`KYC_APPROVED`** (`ChangeProducerEventStatusUseCase`) |
| Check-in | Facial 1:N / pós-QR; QR via **`qrCodeHash`**; manual exige **`cpfLast3`**; offline [PARCIAL] |
| Financeiro | Somente **Dono** na aba Finance global; Gestor vê por evento |
| Emissão manual | Fluxo auditável separado de venda plataforma |
| Repasse | Job D+1 após término — [payout-policies.md](../regras-negocio/payout-policies.md) |

## 2. Autenticação e acesso

### 2.1 Fluxo de login — [IMPLEMENTADO]

| Etapa | Comportamento |
| --- | --- |
| Login | E-mail + senha → `/api/producer/v1/auth/login` |
| `mustChangePassword` | Redireciona troca obrigatória |
| Termos pendentes | Bloqueia até aceite (`/compliance`) |
| Papéis | Dono, Gestor, Staff entram; `CLIENT` puro não entra |

**Critérios de aceite:** logout; recovery; termos bloqueiam; staff sem onboarding completo de conta titular.

## 3. Módulos / funcionalidades

### 3.1 Acesso & Onboarding — [IMPLEMENTADO]

Status do épico: [IMPLEMENTADO] Implementado — Permitir entrada segura, primeira configuração e bloqueios mínimos por papel.

| Feature | Status | Observação |
| --- | --- | --- |
| Login, logout, esqueci senha | ✅ | Fluxos base já implementados. |
| Primeiro acesso e definição de senha | ✅ | Inclui mustChangePassword para membros convidados. |
| Aceite de termos | ✅ | Bloqueia acesso até aceite. |

### HU 1.1 — Acesso seguro e primeiro acesso — [IMPLEMENTADO] Implementado

**Objetivo:** Permitir login, recuperação de senha, troca obrigatória de senha no primeiro acesso e aceite de termos antes do uso normal do app.

**Origem:** Splash > Login. Se mustChangePassword = true, desvia para troca de senha. Se termos pendentes, desvia para aceite obrigatório. Saída: Dashboard ou fluxo pendente correspondente.

**Permissoes:** Producer e Staff. Promoter usa prioritariamente o app do cliente.

**Telas**

- Splash
- Login
- Esqueci minha senha
- Troca obrigatória de senha
- Aceite de termos

**Campos / componentes**

- Login: e-mail e senha
- Recuperação: e-mail
- Troca obrigatória: nova senha + confirmação
- Aceite de termos: documentos vigentes + checkbox consolidado

**Regras de negócio**

- Usuário CLIENT não entra no app do produtor por esse fluxo.
- Staff pode entrar, mas sem onboarding completo de conta; apenas senha/termos.
- Producer segue para dashboard apenas se conta estiver operacionalmente apta.

**Fluxo principal**

- Usuário informa credenciais.
- Sistema autentica e identifica papel/vínculo.
- Se mustChangePassword = true, força troca.
- Se termos pendentes, força aceite.
- Sistema libera acesso ao app conforme escopo do usuário.

**Exceções / erros**

- Credenciais inválidas.
- Token de recuperação inválido/expirado.
- Senha fora do padrão mínimo.
- Tentativa de acesso sem papel/vínculo elegível.

**Critérios de aceite**

- Login e logout funcionam.
- mustChangePassword redireciona corretamente.
- Termos bloqueiam acesso enquanto pendentes.
- Recovery/reset de senha existe.


### 3.2 Perfil & Configurações — [PARCIAL]

Status do épico: [PARCIAL] Parcial — Administrar dados da conta do produtor, configurações operacionais e equipe.

| Feature | Status | Observação |
| --- | --- | --- |
| Visualizar perfil | ✅ | Perfil consome backend e exibe dados principais. |
| Editar dados da conta | ✅ | Cadastro, endereço e contato integrados. |
| Dados bancários | ✅ | Tela própria integrada ao backend. |
| Configurações operacionais | ✅ | Defaults da conta já persistidos. |
| Gestão de equipe | 🟡 | Backend pronto; UI em refinamento. |

### HU 2.1 — Perfil do produtor e configurações operacionais — [PARCIAL] Parcial

**Objetivo:** Permitir que o Producer Owner visualize e edite dados da conta, dados bancários e preferências operacionais padrão para novos eventos.

**Origem:** Aba Perfil. Subtelas: Dados da conta, Dados bancários, Configurações operacionais.

**Permissoes:** Somente Producer Owner. Staff e Promoter não acessam a gestão completa da conta.

**Telas**

- Perfil (hub)
- Dados da conta
- Dados bancários
- Configurações operacionais

**Campos / componentes**

- Perfil: nome/razão social, CPF/CNPJ, e-mail, telefone, endereço, status da conta
- Dados bancários: chave Pix, titular, documento do titular, dados de conta se aplicável
- Configurações: facial padrão, visibilidade padrão, revisão pré-publicação, notificações operacionais

**Regras de negócio**

- Alterações de defaults não afetam eventos já existentes.
- CPF/CNPJ e tipo de pessoa não devem ser livremente alterados após a criação sem regra controlada.
- Dados sensíveis devem ser mascarados quando apenas visualizados.

**Fluxo principal**

- Usuário entra em Perfil.
- Escolhe a área a editar.
- Sistema valida os campos.
- Persistência ocorre no backend.
- Usuário retorna ao resumo com mensagem de sucesso.

**Exceções / erros**

- E-mail duplicado ou inválido.
- CEP/telefone inválidos.
- Tentativa de alterar campo bloqueado.

**Critérios de aceite**

- Visualização do perfil funciona.
- Edição de dados funciona.
- Tela de dados bancários integrada.
- Configurações operacionais persistidas.

> Observação: A gestão de equipe está detalhada em HU própria dentro deste mesmo épico.


### 3.3 Gestão de Eventos — [IMPLEMENTADO]

Status do épico: [IMPLEMENTADO] Implementado na base / [PARCIAL] refinamentos pontuais — Permitir criar, listar, detalhar, editar e publicar eventos com readiness.

| Feature | Status | Observação |
| --- | --- | --- |
| Criar evento | ✅ | Dados básicos, imagem e localização já funcionando. |
| Listar e filtrar eventos | ✅ | Filtros por status implementados. |
| Detalhe e KPIs do evento | ✅ | Dashboard básico por evento existe. |
| Editar evento | ✅ | Regras DRAFT vs PUBLISHED já consideradas. |
| Publicar com readiness | ✅ | Readiness engine implementada. |
| Despublicar / cancelar | 🟡 | Necessita fechamento de UX e fluxos completos. |

### HU 3.1 — Criar, listar, editar e publicar evento — [IMPLEMENTADO] Base implementada

**Objetivo:** Permitir que o Producer Owner crie um evento em rascunho, edite seus dados básicos, visualize sua carteira de eventos e publique somente quando a prontidão mínima estiver atendida.

**Origem:** Dashboard > Criar Evento; ou Aba Eventos > lista > detalhe > editar/publicar.

**Permissoes:** Producer Owner. Staff apenas leitura restrita do detalhe; Promoter não usa essa jornada no app do produtor.

**Telas**

- Lista de eventos
- Criar evento
- Detalhe do evento
- Editar evento

**Campos / componentes**

- Título, descrição curta/completa, banner, data/hora de início, data/hora de término, local, cidade/estado/endereço, visibility, facialRequired

**Regras de negócio**

- Evento nasce como DRAFT.
- Publicação depende de readiness comercial e operacional mínima.
- Evento cancelado não pode ser republicado no MVP.
- Evento publicado sem lote válido não deve ser colocado à venda.

**Fluxo principal**

- Producer cria e salva evento como rascunho.
- Sistema valida dados básicos.
- Producer segue para oferta comercial.
- Com readiness OK, producer publica.

**Exceções / erros**

- Data inválida ou passada.
- Banner inválido.
- Dados básicos incompletos.
- Tentativa de publicar sem lote válido.

**Critérios de aceite**

- Criar evento.
- Listar e filtrar.
- Detalhe com KPIs básicos.
- Editar.
- Publicar com readiness.
- Refinar despublicar/cancelar com fluxo final.


### 3.4 Oferta Comercial — [IMPLEMENTADO]

Status do épico: [IMPLEMENTADO] base e gestão avançada de lotes no Produtor App | [PARCIAL] Producer Web — Estruturar o que será vendido por lote, preço, quantidade, janela e disponibilidade.

| Feature | Status | Observação |
| --- | --- | --- |
| Criar setor/lote | ✅ | Setor embutido na experiência; modelagem consistente com Sector + TicketBatch. |
| Preço, quantidade e janela | ✅ | Validações base implementadas. |
| Virada básica | ✅ | Já modelada. |
| Readiness comercial | ✅ | Evento só publica com oferta mínima válida. |
| Gestão avançada | ⏳ | Reordenação/duplicação/pausa/encadeamento pendentes. |

### HU 4.1 — Configurar oferta comercial do evento — [IMPLEMENTADO] Base implementada / [PENDENTE] avançados pendentes

**Objetivo:** Permitir que o produtor configure lotes e disponibilidade suficientes para transformar o evento em uma oferta vendável e, em seguida, evolua para uma gestão avançada.

**Origem:** Detalhe do evento > Configurar lotes e ingressos; ou após criar/editar evento via Salvar e continuar.

**Permissoes:** Producer Owner; Staff apenas leitura de disponibilidade e vendidos por lote.

**Telas**

- Gestão de lotes do evento
- Formulário de lote
- Resumo comercial no detalhe do evento
- Configuração avançada de lote (pendente)

**Campos / componentes**

- Setor, nome do lote, tipo de ingresso, preço, quantidade, início/fim de venda, regra de virada, status, próximo lote

**Regras de negócio**

- Quantidade nunca pode ficar abaixo do vendido/reservado.
- Preço não pode ser negativo.
- Lote precisa ter janela válida.
- Evento só fica elegível para publicação quando houver ao menos um lote válido.
- Pausa, duplicação e encadeamento entram no bloco avançado.

**Fluxo principal**

- Producer adiciona lote.
- Sistema valida.
- Oferta comercial passa a compor o readiness do evento.
- No bloco avançado, producer poderá reordenar, duplicar, pausar e encadear lotes.

**Exceções / erros**

- Estoque insuficiente.
- Janela inválida.
- Preço inválido.
- Lote sem setor/nome.
- Criar ciclo de encadeamento (avançado).

**Critérios de aceite**

- Criar lote.
- Preço/quantidade/janela.
- Readiness comercial.
- Reordenar (pendente).
- Duplicar (pendente).
- Pausar/Reativar (pendente).


### 3.5 Dashboard — [IMPLEMENTADO]

Status do épico: [IMPLEMENTADO] Produtor App e Producer Web | [PARCIAL] insights avançados — Dar visão de negócio em tempo real com métricas consolidadas, alertas e insights.

| Feature | Status | Observação |
| --- | --- | --- |
| Cards globais | ⏳ | Receita, tickets vendidos, ocupação média, eventos ativos. |
| Gráfico de vendas | ⏳ | Interativo por período. |
| Eventos próximos | ⏳ | Ordenados por data e risco. |
| Alertas operacionais | ⏳ | Lote acabando, baixa venda, evento sem venda recente. |
| Insights preditivos | ⏳ | Pseudo-IA baseada em ritmo/projeção. |

### HU 5.1 — Dashboard do produtor — [IMPLEMENTADO]

**Objetivo:** Responder rapidamente às perguntas “estou vendendo bem?”, “vou bater meta?” e “preciso fazer algo agora?”.

**Origem:** Login > Dashboard; ou aba Início.

**Permissoes:** Producer Owner vê visão consolidada. Staff vê versão restrita apenas dos eventos vinculados. Promoter tem equivalente comercial no app cliente.

**Telas**

- Dashboard geral
- Filtro de período do gráfico
- Card de evento próximo
- Bloco de alertas
- Bloco de insights

**Campos / componentes**

- Resumo: receita total, ingressos vendidos, ocupação média, eventos ativos
- Gráfico: data, quantidade vendida, receita do dia
- Eventos próximos: data, vendido/total, status de risco
- Alertas: tipo, evento, ação recomendada

**Regras de negócio**

- Métricas precisam bater com listagem, detalhe do evento e financeiro.
- Eventos cancelados não entram no dashboard principal.
- Insights usam projeção simples e não IA real no MVP.

**Fluxo principal**

- Usuário entra no dashboard.
- Vê cards globais.
- Interage com gráfico.
- Navega para evento ou alerta.

**Exceções / erros**

- Sem eventos > mostrar CTA para criar.
- Erro de API > fallback com mensagem amigável.
- Dados inconsistentes > exibir zero sem quebrar a UI.

**Critérios de aceite**

- Endpoint consolidado /dashboard.
- Cards globais.
- Gráfico por período.
- Eventos próximos.
- Alertas operacionais.
- Insights preditivos.


### 3.6 Pedidos & Participantes — [IMPLEMENTADO]

Status do épico: [IMPLEMENTADO] Produtor App e Producer Web (participantes/emissão manual) | [PARCIAL] exportações — Dar controle operacional ao produtor sobre quem comprou, quem vai ao evento e quais ingressos foram emitidos manualmente.

| Feature | Status | Observação |
| --- | --- | --- |
| Lista de participantes | ⏳ | Consulta por evento. |
| Busca manual | ⏳ | Por nome/e-mail/CPF quando aplicável. |
| Emissão manual | ⏳ | Cortesia ou venda direta do produtor. |
| Auditoria de origem do ticket | ⏳ | Separar plataforma x manual x cortesia. |

### HU 6.1 — Pedidos, participantes e emissão manual — [IMPLEMENTADO]

**Objetivo:** Permitir que o produtor/staff autorizado consulte participantes e emita ingressos manualmente, com separação auditável entre venda da plataforma, cortesia e venda direta.

**Origem:** Detalhe do evento > Participantes ou Pedidos. Ação principal adicional: Adicionar participante.

**Permissoes:** Producer e Staff autorizado. Promoter não vê lista completa do evento.

**Telas**

- Lista de participantes
- Busca manual
- Adicionar participante
- Detalhe do ingresso

**Campos / componentes**

- Nome, e-mail, tipo do ingresso, lote, status, origem da emissão, used/no_show/cancelled
- Na emissão manual: tipo de emissão, e-mail com autocomplete, lote, valor cobrado externamente, observação

**Regras de negócio**

- Lista completa é operacional e não comercial.
- Emissão manual sempre consome estoque do lote.
- Cortesia preserva valor cheio + desconto 100%.
- Venda direta não passa pelo gateway, mas gera ticket real com origem auditável.

**Fluxo principal**

- Usuário entra na lista.
- Filtra ou busca participante.
- Opcionalmente emite novo ticket manualmente.
- Ticket aparece na lista e segue regras normais de transferência/check-in.

**Exceções / erros**

- Lote sem disponibilidade.
- Lote pausado/inválido.
- E-mail inválido.
- Permissão insuficiente.
- Falha ao consumir estoque.

**Critérios de aceite**

- Lista e filtros.
- Busca manual.
- Tipo de emissão obrigatório.
- E-mail com autocomplete.
- Emissão manual com consumo real de estoque.
- Ticket manual com origem auditável.


### 3.7 Access (Check-in) — [IMPLEMENTADO]

Status do épico: [IMPLEMENTADO] Produtor App | [PENDENTE] Producer Web (check-in ao vivo) — Executar a entrada do evento por facial, QR e busca manual com contingência offline e bloqueio após o encerramento.

| Feature | Status | Observação |
| --- | --- | --- |
| Tela Access | ⏳ | Lista de eventos operáveis no módulo Access. |
| Scanner QR | ⏳ | Validação rápida e antifraude. |
| Validação facial | ⏳ | Método principal quando habilitado. |
| Busca manual / lista | ⏳ | Fallback operacional. |
| Contingência offline | ⏳ | Persistência local + sincronização posterior. |
| Adaptação por evento encerrado | ⏳ | Bloquear novas entradas e manter consulta/sync. |

### HU 7.1 — Access operacional do evento — [IMPLEMENTADO]

**Objetivo:** Permitir que Producer e Staff vinculado operem a entrada do evento com velocidade, antifraude e resiliência, respeitando a janela operacional do evento.

**Origem:** Aba Access > Lista de eventos > Entrar no evento. Também via atalho a partir do detalhe do evento.

**Permissoes:** Producer e Staff vinculado ao evento. Promoter e Client não acessam.

**Telas**

- Lista de eventos do Access
- Detalhe operacional do evento
- Scanner QR
- Facial
- Busca manual / lista
- Sincronização offline

**Campos / componentes**

- Nome do evento, data/hora, accessStatus, entradas, capacidade, ocupação
- No scanner: payload do QR, resposta de validação, status do ticket
- Na busca: nome, e-mail, CPF quando aplicável, status do ingresso

**Regras de negócio**

- Check-in só é permitido até endDate + tolerância; sem endDate, até startDate + 24h (`canCheckIn`).
- Fora da janela, accessStatus = CLOSED.
- **QR:** scanner envia `ticketHash` = `Ticket.qrCodeHash` (UUID gerado na emissão); não usar número TKT.
- **Facial:** `facial-match` (1:N) quando `facialRequired`; `facial-verify` após QR se flag ativa; galeria `GALLERY_NOT_READY` / `AMBIGUOUS_MATCH` sem auto check-in.
- **Manual:** `POST .../manual-checkin` com `cpfLast3` (3 dígitos do CPF do titular); falha se CPF não cadastrado.
- USED nunca volta; NO_SHOW nunca vira USED.
- Evento CLOSED mantém lista e sincronização, mas bloqueia QR e facial.

**Fluxo principal**

- Usuário entra no módulo Access.
- Escolhe evento.
- Se ONLINE, pode validar por facial/QR ou buscar manualmente.
- Se CLOSED, pode apenas consultar e sincronizar.
- Ingressos ISSUED fora da janela tornam-se NO_SHOW.

**Exceções / erros**

- QR inválido.
- Ingresso já utilizado.
- Evento encerrado.
- Falha de biometria sem fallback.
- Sync com conflito/duplicidade.

**Critérios de aceite**

- Lista do Access com accessStatus.
- Scanner QR.
- Facial.
- Busca manual e lista.
- Sync offline.
- Evento encerrado desabilita QR/facial e mantém consulta/sync.


### 3.8 Financeiro — [IMPLEMENTADO]

Status do épico: [IMPLEMENTADO] Produtor App | [PARCIAL] Producer Web (sem telas de cancelamentos/comissões) — Dar ao produtor transparência total sobre bruto, líquido, retenção, cancelamentos, estornos e quando receberá.

| Feature | Status | Observação |
| --- | --- | --- |
| Resumo financeiro consolidado | ⏳ | Receita, taxas, saldo retido, saldo liberado, saldo repassado. |
| Financeiro por evento | ⏳ | Bruto, ingressos, cancelamentos, estornos e repasse previsto. |
| Cancelamentos e estornos | ⏳ | Visão e impacto financeiro operacional. |
| Repasses e bloqueios | ⏳ | Previsão, histórico, lock reason e processamento. |
| Conciliação e ledger | ⏳ | Separar bruto, taxa plataforma, custo processador e saldo do produtor. |

### HU 8.1 — Painel financeiro do produtor e repasses — [IMPLEMENTADO]

**Objetivo:** Dar ao produtor visão clara do dinheiro que entrou, do que é taxa, do que é líquido e do que ele receberá, sem misturar faturamento bruto com saldo elegível para repasse.

**Origem:** App do produtor > Aba Financeiro. Subentradas: Resumo, Por evento, Cancelamentos/Estornos, Repasses.

**Permissoes:** Somente Producer Owner. Staff e Promoter não acessam financeiro detalhado.

**Telas**

- Resumo financeiro consolidado
- Financeiro por evento
- Cancelamentos e estornos
- Repasses
- Detalhe do repasse

**Campos / componentes**

- Bruto vendido, ingressos pagos, taxa da plataforma, desconto Pix, juros do comprador, custo do processador, líquido do produtor, saldo retido, saldo liberado, saldo repassado, bloqueios, data prevista de repasse

**Regras de negócio**

- Painel deve separar claramente faturamento bruto, receita da plataforma e saldo do produtor.
- Cancelamentos e estornos impactam o saldo do produtor.
- Evento cancelado bloqueia repasse normal.
- Vendas manuais aparecem separadas das vendas pela plataforma.
- Bloqueio manual exige lock_reason visível no painel.

**Fluxo principal**

- Pagamento aprovado registra gross e saldo retido.
- Sistema consolida métricas por evento e total.
- No evento/dia elegível, saldo pode migrar para disponível.
- Operação financeira registra repasse.
- Painel atualiza histórico e status.

**Exceções / erros**

- Divergência de ledger.
- Estorno pendente.
- Evento cancelado.
- Saldo pago sem registro objetivo.

**Critérios de aceite**

- Resumo financeiro consolidado.
- Visão por evento.
- Separação de bruto, taxa, líquido e repasse.
- Visualização de cancelamentos e estornos.
- Histórico de repasses e bloqueios.

> Observação: Recomendação: manter o módulo financeiramente agnóstico ao gateway e preservar ledger próprio da plataforma.


### 3.9 Equipe & RBAC — [PARCIAL]

Status do épico: [PARCIAL] Parcial — Fechar a blindagem de RBAC do ecossistema do produtor e explicitar a experiência comercial do promoter no app cliente.

| Feature | Status | Observação |
| --- | --- | --- |
| Matriz de permissões | 🟡 | Conceitualmente consolidada; falta aplicação completa no front. |
| Staff no app do produtor | 🟡 | Regras definidas; precisa validação visual por tela. |
|  |  |  |

### HU 9.1 — Revisão geral de roles e equivalência comercial do promoter — [PARCIAL] Parcial

**Objetivo:** Definir claramente o papel de Producer, Staff e Promoter, seus apps principais, seus escopos e suas limitações, garantindo equivalência comercial entre app do produtor e app do cliente.

**Origem:** Regras transversais aplicadas em todo o produto. Para o promoter, acesso principal no app do cliente > Perfil/Menu > Minhas Vendas / Área do Promoter.

**Permissoes:** Producer > Staff. Promoter fora do app do produtor como experiência principal. Admin fica como papel futuro.

**Telas**

- Matriz de permissões do app do produtor
- Área do Promoter no app cliente (dependência externa)
- Tela de equipe por escopo global/específico

**Campos / componentes**

- Papel, app principal, escopo por evento, membership, accessStatus comercial, eventos vinculados do promoter

**Regras de negócio**

- Producer usa app do produtor e tem escopo total.
- Staff usa app do produtor e pode fazer tudo que o promoter faz no contexto comercial.
- Promoter usa preferencialmente o app do cliente e só vê sua camada comercial.
- Mudanças de vínculo (global ↔ específico, adição/remover evento) precisam refletir corretamente no app cliente.

**Fluxo principal**

- Backend valida papel, membership, escopo por evento e permissão específica.
- App do produtor esconde/mostra telas conforme papel.
- App do cliente mostra a área do promoter apenas para elegíveis.

**Exceções / erros**

- Promoter vendo evento sem vínculo.
- Staff acessando financeiro.
- Matriz aplicada parcialmente só no front.

**Critérios de aceite**

- Matriz de permissões consolidada.
- Aplicar completamente as restrições no front do app do produtor.
- Área do promoter no app cliente.
- Sync de vínculo promoter-evento.
- 14. Ecossistema — Cliente (App Cliente + Client Web)
- Escopo B2C (comprador e promoter). Referências: [global-business-rules.md](../regras-negocio/global-business-rules.md), [checkout-compliance.md](../regras-negocio/checkout-compliance.md).
- 14.1 Descoberta e vitrine
- Client Web: home, feed e detalhe público do evento [IMPLEMENTADO]. Seleção de lotes na web [IMPLEMENTADO]. Checkout integrado na web [PENDENTE] — CTA direciona para App Cliente. App Cliente: feed, busca, detalhe [IMPLEMENTADO]. MUST: vitrine pública não exige login de produtor.
- 14.2 Checkout, pagamento e carteira (App Cliente)
- MUST: reserva 10 min; máx. 3 tentativas cartão; ingresso só após `PAID`; taxa **10%** por ingresso no código; Pix −5% sobre taxa; cartão até 4x; `PAYMENT_PROVIDER` pagarme|stripe; aceite de `REFUND_POLICY` por sessão antes de Pix/cartão/cortesia. Gate HU06: [checkout-compliance.md](../regras-negocio/checkout-compliance.md).
- 14.3 Ingressos, facial e cancelamento
- Carteira / meus ingressos no App Cliente [IMPLEMENTADO]. Cadastro facial [IMPLEMENTADO] com flags (FACIAL_ENROLLMENT_V2, PULSE_FACE_EXTRACT). MUST: cancelamento pelo comprador até 24h antes do início do evento, ticket não utilizado (GetCancelEligibilityUseCase — alinhar copy do app que ainda cita 48h). QR como fallback operacional [IMPLEMENTADO]. Client Web carteira [PENDENTE].
- 14.4 Área Promoter (App Cliente)
- Rotas /promoter (vendas, comissões) [IMPLEMENTADO] para membership PROMOTER. MUST: Dono e Gestor convidam promoter com conta CLIENT já existente (docs/RBAC.md). Promoter não acessa Produtor App nem Producer Web.
- 14.5 VIP / Membership
- VIP de lote (`isVip` no batch) [IMPLEMENTADO] no comercial. Programa de assinatura / membership recorrente [PENDENTE]: App Cliente tela VIP [PARCIAL] (mock); Producer Web /vip [PARCIAL] («em breve»); sem plano recorrente no schema.
- 15. RBAC unificado (referência docs/RBAC.md)
- Papéis: CLIENT, PRODUCER (Dono), PRODUCER_MANAGER (Gestor), STAFF, PROMOTER, PULSE_ADMIN. Fonte canônica de permissões: docs/RBAC.md (2026-05-19). MUST: permissão validada no backend, nunca só na UI.
- 15.1 Matriz resumida por aplicação
- Produtor App: épicos 5–13. Producer Web produtora: paridade parcial; check-in ao vivo [PENDENTE] (atalhos «Em breve» no dashboard). Client Web: vitrine [IMPLEMENTADO]; auth/checkout B2C [PENDENTE] (hoje usa API produtor — migrar para /api/client/v1). Client App: compra, carteira, promoter [IMPLEMENTADO]. Pulse Admin: [pulse-admin.md](./pulse-admin.md) e [fluxos/admin/](./fluxos/admin/README.md).
- 16. Producer Web — portal da produtora
- Rotas: /dashboard, /events, /finance/*, /team, /settings, onboarding /onboarding/*, /lists. Check-in operacional ao vivo [PENDENTE] (botão «Em breve» em quick-actions). Listas /lists: consulta participantes [PARCIAL]. Financeiro web: repasse e KPIs [IMPLEMENTADO]; cancelamentos/comissões UI [PENDENTE]. Área admin isolada em `/admin/*` — ver [pulse-admin.md](./pulse-admin.md) (não confundir com portal produtor).
- 17. Legado — numeração dos épicos produtor
- Seções 5–13 mantêm HUs do Produtor App. Status atualizados por de/para com código; consulte seções 14–16 para demais plataformas e [pulse-admin.md](./pulse-admin.md) para Pulse Admin.
- 18. Evoluções pós-MVP e backlog estratégico
- Separar o que já existe do backlog. Pulse Admin **core** ([pulse-admin.md](./pulse-admin.md)) está [IMPLEMENTADO]; itens abaixo permanecem pós-MVP salvo indicação em contrário.
- 18.1 Já entregue (não tratar como futuro)
- Pulse Admin: visão, produtoras, financeiro admin (freeze/estornos), compliance/KYC. Promoter no App Cliente. Gestão avançada de lotes no Produtor App. Dashboard e financeiro produtor no App.
- 18.2 Backlog pós-MVP
- Analytics preditivos e precificação automática [PENDENTE]. Check-in ao vivo na Producer Web (paridade com Produtor App) [PENDENTE]. Checkout e carteira no Client Web com /api/client/v1 [PENDENTE]. Membership/VIP recorrente (assinatura) [PENDENTE]. Moderação global de eventos e antifraude admin [PENDENTE]. Operação Access offline com resolução de conflito avançada [PARCIAL]. Exportações em massa (participantes, financeiro) [PENDENTE].
- 19. Observações funcionais e técnicas sobre o módulo financeiro
- Este documento mantém o app do produtor financeiramente agnóstico ao gateway. A escolha do processador (por exemplo, Stripe Connect) deve influenciar a implementação técnica, mas não pode quebrar a explicação de negócio exibida ao produtor.
- O produtor precisa enxergar sempre: bruto vendido, taxa cobrada do comprador, custo do processador, ajustes/estornos, líquido do produtor, saldo retido, saldo disponível e valor efetivamente pago.
- Recomendação: manter ledger próprio da plataforma (producer ledger + platform ledger), independentemente do extrato do gateway.
- Recomendação: separar claramente venda da plataforma, venda manual do produtor e cortesia nos relatórios e no financeiro.
- Recomendação: o repasse deve ser registrado como evento financeiro próprio, com status, data prevista, data realizada e motivo de bloqueio quando houver.
- Antes de implementar o módulo financeiro final, é desejável uma revisão técnica do modelo atual do banco para validar: ledger, payout schedule, bloqueios, chargebacks e relacionamento entre tickets, pedidos e settlements.
- 20. Módulos B2C — mapa de implementação
- Consolidado para decisão bug vs comportamento esperado. Referência: docs/produto/especificacao_funcional_mvp_ingressos.docx.
- Gatilho de liberação: `ReleaseRetainedPayoutsUseCase` — D+1 (24h após término). Legado «10 check-ins» não implementado — [payout-policies.md](../regras-negocio/payout-policies.md).
- 21. Pulse Admin (backoffice)
- Especificação operacional, mapa HU × rota e fluxos em diagrama estão em documentos dedicados — **não duplicar aqui**:
  - [pulse-admin.md](./pulse-admin.md) — HU01–HU06, RBAC, backlog
  - [fluxos/admin/](./fluxos/admin/README.md) — KYC, produtoras, financeiro, estornos, compliance (partes 1–3 cada)
- KYC do titular no App Produtor alimenta a fila admin; matriz de bloqueio: [kyc-blocking-matrix.md](../regras-negocio/kyc-blocking-matrix.md).
- 22. Arquitetura do sistema (visão de alto nível)
- Ecossistema monorepo com backend único (Elysia/Node), banco MySQL (Prisma), quatro frontends e integrações externas.
- Diagrama (texto — compatível Mermaid):
flowchart LR
  subgraph clients [Clientes]
    AC[App Cliente Expo]
    CW[Client Web Next]
  end
  subgraph producers [Produtora]
    AP[Produtor App Expo]
    PW[Producer Web Next]
  end
  subgraph platform [Plataforma]
    API[Backend Elysia]
    DB[(MySQL)]
    PF[pulse-face Python]
  end
  subgraph external [Externos]
    PG[Pagar.me]
    BR[Brevo e-mail]
    BA[Better Auth]
  end
  AC --> API
  CW --> API
  AP --> API
  PW --> API
  API --> DB
  API --> PG
  API --> BR
  API --> BA
  API --> PF
- Superfícies API: /api/client/v1 (B2C canônico), espelho legado na raiz; /api/producer/v1 (portal produtor + operação); /api/admin/v1 (Pulse Admin); /api/auth/* (Better Auth); /api/promoter (comissões).
- 23. Recursos necessários para executar
- Infra mínima: processo Node (backend), MySQL, opcional pulse-face, deploys estáticos/SSR para Producer Web e Client Web, builds EAS para apps.
- 24. Catálogo de endpoints API (consolidado)
- Lista derivada dos controllers Elysia (backend/src). OpenAPI interativo: GET /swagger. Rotas legadas B2C na raiz espelham /api/client/v1 — preferir o prefixo canônico em novos clientes.


## 4. Permissões (RBAC nesta plataforma)

Resumo (detalhe em [RBAC.md](../RBAC.md)):

| Capacidade | Dono | Gestor | Staff |
| --- | --- | --- | --- |
| Tab Início (KPI empresa) | ✅ | ❌ | ❌ |
| Criar/publicar evento | ✅ | ✅ | ❌ |
| Tab Access | ✅ | ✅ | ✅ |
| Tab Finance global | ✅ | ❌ | ❌ |
| Financeiro por evento | ✅ | ✅ | ❌ |
| Convidar Gestor/Staff | ✅ | ❌ | ❌ |
| Convidar Promoter | ✅ | ✅ | ❌ |

## 5. Integrações e dependências

- Backend producer + operation (check-in)
- Câmera / facial / QR offline queue [PARCIAL]
- Repasse: [payout-policies.md](../regras-negocio/payout-policies.md) · [job-repasse.md](../../engenharia/arquitetura/job-repasse.md)
- KYC: [kyc-blocking-matrix.md](../regras-negocio/kyc-blocking-matrix.md)
- Facial: [facial/como-funciona-biometria-facial.md](../biometria/como-funciona-biometria-facial.md)

## 6. Backlog / pendências

| Item | Status |
| --- | --- |
| Insights preditivos dashboard | [PENDENTE] |
| Offline check-in robusto | [PARCIAL] |
| RBAC blindagem UI | [PARCIAL] |
| Despublicar/cancelar evento UX | [PARCIAL] |
| Encadear próximo lote | [CONFIRMAR COM PRODUTO] |

## 7. Referências cruzadas

- [producer-web.md](./producer-web.md) — paridade web
- [app-client.md](./app-client.md) — promoter
- [api-endpoints.md](./api-endpoints.md#3-producer-apiproducerv1)
