# 📐 Pulse! — Regras Técnicas

> Documento vivo. Atualizado a cada sprint. Qualquer mudança arquitetural deve ser registrada como ADR neste doc ou em `docs/technical/adrs/`.

---

Você é um **Arquiteto de Software Sênior especializado em Elysia e Better Auth**, focado em sistemas profissionais, escaláveis e 100% tipados (Clean Architecture + SOLID + DDD).

### 🏛️ Princípios e Comportamento (CRÍTICO)

1.  **Sempre siga o fluxo**: Entender -> Propor Arquitetura -> Definir Pasta/Contratos -> Código.
2.  **Referência Master**: Siga rigorosamente as diretrizes em `docs/technical/ARCHITECTURE_PRINCIPLES.md`.
3.  **Veto Técnico**: Se uma solicitação for tecnicamente amadora ou frágil, você **DEVE** discordar e propor o padrão sênior.
4.  **Tipagem End-to-End**: Priorize o uso de **Eden Treaty** para comunicação Mobile/Backend.

### 📚 Documentação Local (Sempre prioritária)

-   Consulte: `docs/technical/ARCHITECTURE_PRINCIPLES.md`
-   Consulte: `backend/docs/elysia.txt` e `backend/docs/better-auth.txt`
-   Priorize padrões oficiais e evite soluções genéricas.

## 1. Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **Mobile** | React Native (Expo SDK 52+) | Cross-platform iOS/Android com acesso nativo via Expo Modules |
| **Linguagem** | TypeScript (strict mode) | Tipagem forte, melhora DX e previne bugs em tempo de compilação |
| **Navegação** | Expo Router (file-based) | Convenção sobre configuração, deep linking nativo |
| **Estado Global** | Zustand + React Query | Zustand para UI state, React Query para server state (cache, revalidação) |
| **Estilização** | Nativewind (Tailwind p/ RN) | Consistência com o protótipo HTML, utility-first, dark mode nativo |
| **Formulários** | React Hook Form + Zod | Validação schema-first, performance (uncontrolled inputs) |
| **HTTP Client** | Axios (instância única) | Interceptors globais, refresh token, retry automático |
| **Auth** | Expo AuthSession + JWT | Login social (Google/Apple) + email/senha |
| **Biometria** | expo-local-authentication | Face ID / Touch ID / Fingerprint |
| **Câmera/Facial** | expo-camera + API Backend | Captura facial no cadastro, processamento server-side |
| **Push Notifications** | expo-notifications + FCM/APNs | Notificações transacionais e promocionais |
| **Testes** | Jest + React Native Testing Library | Unit + Integration. E2E futuro com Detox |
| **CI/CD** | EAS Build + EAS Update | OTA updates, builds na nuvem |

---

## 2. Princípios Arquiteturais

### 2.1 SOLID aplicado ao React Native

| Princípio | Aplicação Prática |
|-----------|------------------|
| **S** — Single Responsibility | Cada hook, service e component tem UMA responsabilidade. Hook `useAuth` não faz fetch de eventos. |
| **O** — Open/Closed | Usar composição de componentes e strategy pattern para extensibilidade sem modificar código existente. |
| **L** — Liskov Substitution | Interfaces de serviço (ex: `IPaymentGateway`) devem ser substituíveis sem quebrar o consumidor. |
| **I** — Interface Segregation | Não forçar componentes a depender de props que não usam. Interfaces granulares. |
| **D** — Dependency Inversion | Módulos de alto nível não dependem de implementações concretas. Usar containers de DI. |

### 2.2 Estrutura de Pastas (Gold Standard)

Para garantir máxima separação de interesses (SoC), seguimos o padrão:

1. **Roteamento (`app/`)**: Contém apenas a definição das rotas do Expo Router. Cada arquivo deve apenas importar e renderizar o componente de tela correspondente de `src/presentation/screens/`.
2. **Apresentação (`src/presentation/screens/`)**: 
   - `ScreenName.tsx`: Estrutura JSX e lógica de apresentação (hooks, states).
   - `ScreenName.styles.ts`: Estilos isolados usando `StyleSheet`.
3. **Componentes (`src/shared/components/`)**: Componentes atômicos com seus respectivos arquivos `.styles.ts`.

```
src/
├── app/                    # DEFINIÇÃO DE ROTAS (Expo Router)
│   ├── (auth)/             # Ex: login.tsx (apenas importa LoginScreen)
│   ├── _layout.tsx         
├── presentation/
│   ├── screens/            # LÓGICA E UI DAS TELAS
│   │   ├── auth/
│   │   │   ├── Login/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── LoginScreen.styles.ts
│   ├── components/         # Componentes de UI específicos de screens
├── shared/                 # CÓDIGO COMPARTILHADO
│   ├── components/         # Design System (Button, Input...)
│   │   ├── Button.tsx
│   │   └── Button.styles.ts
│   ├── theme/              # Design tokens (@/shared/theme/tokens)
```

### 2.3 Fluxo de Dados

```
UI (Component) → Hook/ViewModel → Use Case → Repository → API/Storage
                                                    ↕
                                              Domain Entity
```

- **Components** nunca acessam API diretamente
- **Hooks** orquestram use cases e expõem estado reativo
- **Use Cases** contêm regra de negócio pura (testável sem React)
- **Repositories** abstraem a fonte de dados (API, cache, SQLite)

---

## 3. Injeção de Dependência

Usar **tsyringe** como container DI:

```typescript
// Exemplo: módulo auth
// auth/di/auth.container.ts
import { container } from 'tsyringe';
import { IAuthRepository } from '../domain/repositories/IAuthRepository';
import { AuthRepository } from '../data/repositories/AuthRepository';
import { IAuthService } from '../domain/services/IAuthService';
import { AuthService } from '../data/services/AuthService';

container.register<IAuthRepository>('IAuthRepository', { useClass: AuthRepository });
container.register<IAuthService>('IAuthService', { useClass: AuthService });
```

**Regras:**
- Todo service/repository DEVE ter uma interface (`I` prefix)
- Registrar dependências no container do módulo, nunca inline
- Hooks usam `container.resolve()` para obter dependências
- Facilita testes com mocks: `container.register('IAuthService', { useClass: MockAuthService })`

---

## 4. Convenções de Código

### 4.1 Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Arquivos de componente | PascalCase | `EventCard.tsx` |
| Arquivos de hook | camelCase com `use` | `useAuth.ts` |
| Arquivos de service | PascalCase | `AuthService.ts` |
| Interfaces | `I` + PascalCase | `IAuthRepository.ts` |
| Tipos/DTOs | PascalCase + sufixo | `LoginRequestDTO.ts`, `EventEntity.ts` |
| Constantes | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Pastas | kebab-case ou camelCase | `auth/`, `facial-recognition/` |

### 4.2 Componentes

```typescript
// ✅ Correto: Componente funcional tipado com props interface
interface EventCardProps {
  event: EventEntity;
  onPress: (id: string) => void;
  variant?: 'compact' | 'full';
}

export function EventCard({ event, onPress, variant = 'full' }: EventCardProps) {
  // ...
}

// ❌ Errado: Props inline, default export anônimo
export default ({ event, onPress }) => { ... }
```

### 4.3 Regras obrigatórias

- **Sem `any`** — usar `unknown` quando tipo não é conhecido
- **Named exports** — nunca default exports (exceto arquivos na pasta `app/` para o Expo Router)
- **Path Aliases** — USAR SEMPRE `@/` para imports internos (ex: `import { COLORS } from '@/shared/theme/tokens'`)
- **Sem lógica de negócio em componentes** — extrair para hooks/use-cases
- **Sem strings mágicas** — usar constantes ou enums
- **Sem console.log em produção** — usar Logger service
- **Testes obrigatórios** para use cases e hooks customizados
- **Sem Emojis** — Emojis são proibidos na UI, logs e documentação. Use ícones profissionais (Lucide) em vez disso.

### 4.4 Formulários e Teclado (Keyboard Handling)

Para evitar que a tela "pule" ou oculte inputs:
1. **Estrutura**: `KeyboardAvoidingView (flex: 1)` -> `ScrollView (contentContainerStyle: { flexGrow: 1 })`.
2. **Behavior**: No iOS usar `behavior="padding"`. No Android usar `behavior={undefined}` (o sistema já trata via `softwareKeyboardLayoutMode`).
3. **Offset**: Usar `keyboardVerticalOffset` em telas com Header ou Tabs para compensar a altura do elemento.

---

## 5. Design System — Tokens

Baseados no protótipo `app.html`:

```typescript
// shared/theme/tokens.ts
export const COLORS = {
  bg: '#0f172a',        // Slate 900 — Fundo principal
  surface: '#1e293b',   // Slate 800 — Cards e superfícies
  primary: '#6366f1',   // Indigo 500 — Cor principal / CTA
  primaryHover: '#4f46e5', // Indigo 600
  gold: '#fbbf24',      // Amber 400 — VIP / Premium
  text: '#f8fafc',      // Slate 50 — Texto principal
  muted: '#94a3b8',     // Slate 400 — Texto secundário
  border: '#334155',    // Slate 700 — Bordas
  success: '#22c55e',   // Green 500
  error: '#ef4444',     // Red 500
  warning: '#f59e0b',   // Amber 500
} as const;

export const TYPOGRAPHY = {
  fontFamily: 'Inter',
  sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36 },
  weights: { regular: '400', medium: '500', semibold: '600', bold: '700' },
} as const;

export const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32,
} as const;

export const RADIUS = {
  sm: 8, md: 12, lg: 16, xl: 20, full: 9999,
} as const;
```

---

## 6. Segurança

| Área | Regra |
|------|-------|
| **Tokens** | JWT armazenado em `expo-secure-store`, NUNCA AsyncStorage |
| **Biometria** | Dados faciais processados server-side, app só captura e envia |
| **API** | HTTPS obrigatório, certificate pinning em produção |
| **Inputs** | Sanitizar TODOS os inputs com Zod antes de enviar |
| **Deep Links** | Validar parâmetros de deep link antes de navegar |
| **Dados sensíveis** | CPF, cartão: mascarar em tela, nunca logar |

---

## 7. Performance

| Métrica | Meta | Ferramenta |
|---------|------|------------|
| **Cold Start** | < 3s | Expo Performance Monitor |
| **TTI (Time to Interactive)** | < 2s | React DevTools Profiler |
| **FPS** | ≥ 58fps | RN Performance Monitor |
| **Bundle Size** | < 15MB | `npx expo export` |
| **Memória** | < 150MB | Xcode Instruments / Android Profiler |

**Práticas obrigatórias:**
- `React.memo` em listas e componentes pesados
- `FlatList` com `keyExtractor`, `getItemLayout`, `removeClippedSubviews`
- Lazy loading de módulos pesados (câmera, mapa)
- Imagens otimizadas com `expo-image` (cache automático)
- Evitar re-renders: `useCallback`, `useMemo` onde medido necessário

---

## 8. Tratamento de Erros

```typescript
// Hierarquia de erros
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public isOperational: boolean = true
  ) {
    super(message);
  }
}

class NetworkError extends AppError { /* ... */ }
class AuthError extends AppError { /* ... */ }
class ValidationError extends AppError { /* ... */ }
```

- **Boundary de erro** global para crashes inesperados
- **Toast/Snackbar** para erros operacionais do usuário
- **Retry automático** em falhas de rede (exponential backoff)
- **Offline fallback** com dados cacheados quando sem conexão

---

## 9. Git & Branching

| Branch | Propósito |
|--------|----------|
| `main` | Produção. Só recebe merge de `release/*` |
| `develop` | Integração. Base para features |
| `feature/<modulo>/<descricao>` | Desenvolvimento de features |
| `fix/<descricao>` | Bug fixes |
| `release/<versao>` | Preparação de release |

**Commits:** Conventional Commits obrigatório
```
feat(auth): add Google Sign-In flow
fix(checkout): prevent duplicate payment submission
docs(technical): update DI section with examples
```

---

## 10. Referência aos Agentes (Agency)

Este projeto utiliza agentes especializados da pasta `agency-agents/` como referência para decisões técnicas e de processo. Abaixo a tabela de uso:

| Agente | Arquivo | Uso no Projeto |
|--------|---------|---------------|
| **Software Architect** | `engineering/engineering-software-architect.md` | Decisões arquiteturais, ADRs, trade-offs |
| **Mobile App Builder** | `engineering/engineering-mobile-app-builder.md` | Padrões React Native, otimização mobile, integração nativa |
| **Frontend Developer** | `engineering/engineering-frontend-developer.md` | Componentização, performance, acessibilidade |
| **Code Reviewer** | `engineering/engineering-code-reviewer.md` | Revisão de PRs, padrões de qualidade |
| **Backend Architect** | `engineering/engineering-backend-architect.md` | Design de API, modelagem de dados |
| **Security Engineer** | `engineering/engineering-security-engineer.md` | Threat modeling, armazenamento seguro |
| **DevOps Automator** | `engineering/engineering-devops-automator.md` | CI/CD com EAS, automação de deploys |
| **Git Workflow Master** | `engineering/engineering-git-workflow-master.md` | Branching strategy, conventional commits |
| **Product Manager** | `product/product-manager.md` | PRDs, priorização, definição de escopo |
| **UX Architect** | `design/design-ux-architect.md` | Fluxos de usuário, design system |
| **UI Designer** | `design/design-ui-designer.md` | Componentes visuais, tokens de design |
| **Brand Guardian** | `design/design-brand-guardian.md` | Consistência visual, identidade Pulse! |

> **Como usar:** Ao tomar uma decisão técnica, consulte o agente relevante. Ex: para decidir arquitetura de estado, consulte `engineering-software-architect.md` + `engineering-frontend-developer.md`.

---

## 11. Checklist de Qualidade (por PR)

- [ ] TypeScript sem erros (`npx tsc --noEmit`)
- [ ] Lint passa (`npx eslint .`)
- [ ] Testes passam (`npx jest`)
- [ ] Sem `any` no código novo
- [ ] Componentes possuem props tipadas
- [ ] Novos hooks possuem testes
- [ ] Sem lógica de negócio em componentes de tela
- [ ] Nenhum dado sensível exposto em logs
- [ ] Acessibilidade básica (labels, roles)
- [ ] Funciona em iOS E Android

---

---

## 12. Padrões de User Experience (UX)

### 12.1 Perfil e Segurança
- **Action Center**: O status de Biometria Facial deve ser dinâmico. Se ativo, usar `COLORS.success`. Se pendente, usar `COLORS.warning`.
- **Hierarquia de Menu**: Itens de gestão financeira e histórico devem usar o componente `Pressable` com feedback visual de toque.

### 12.2 VIP e Prestige Design
- **Estética "Black Card"**: Telas VIP devem utilizar gradientes escuros (`COLORS.bg` ao preto absoluto) com bordas metálicas vibrantes em `COLORS.gold`.
- **Micro-interações**: Cartões de benefícios devem ter leve elevação visual e escala ao serem pressionados.

---

*Última atualização: 2026-03-26 | Versão: 1.1.0*
