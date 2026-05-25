# Usuários de teste — Pulse

Contas de desenvolvimento com alias Gmail. Todos os OTPs e e-mails transacionais enviados para esses endereços chegam na caixa **`jotav.pulse@gmail.com`**.

## Credenciais padrão

| Campo | Valor |
|--------|--------|
| **Senha** | `Pulse@123!` |
| **Padrão de e-mail** | `jotav.pulse+{apelido}@gmail.com` |

O trecho após o `+` identifica o papel/conta (ex.: `ane-mia` → `jotav.pulse+ane-mia@gmail.com`).

> **Login:** use sempre o e-mail completo da tabela.  
> **OTP:** confira a caixa `jotav.pulse@gmail.com` (o alias aparece no destinatário).

## Primeiro acesso (produtor)

Nos fluxos de **boas-vindas**, **convite gestor/staff** e **esqueci senha**, o portal usa um único caminho:

1. Login → **Primeiro acesso / tenho código** (ou `/first-access` na web)
2. Informar o e-mail → receber código de 6 dígitos (24h convite/welcome; 15 min reset)
3. Inserir código + criar senha em **Redefinir/Criar senha**

Senha temporária na UI só aparece se o envio de e-mail falhar.

Scripts para recriar senha ou renomear contas: `backend/_apenas-git/scripts/setup-test-passwords.ts`, `backend/_apenas-git/scripts/rename-test-emails.ts`, `backend/_apenas-git/scripts/test-email-alias.ts`.

---

## Ross Produções

| Papel | Nome | E-mail | Plataformas |
|--------|------|--------|-------------|
| **Dono (PRODUCER)** | Ross Produções | `jotav.pulse+thales-produtor@gmail.com` | producer-web, app-producer |
| **Gestor (PRODUCER_MANAGER)** | Gestor Ross | `jotav.pulse+gestor-ross@gmail.com` | producer-web, app-producer |
| **Staff (STAFF)** | Jhonatan Vitor | `jotav.pulse+jhonatan-staff@gmail.com` | producer-web, app-producer |
| **Promoter** | Ana Conda | `jotav.pulse+ana-conda@gmail.com` | app-client, client-web |
| **Promoter** | Ane Mia | `jotav.pulse+ane-mia@gmail.com` | app-client, client-web |
| **Promoter (extra)** | Jhonatan Lopes | `jotav.pulse+jhonatan-promoter@gmail.com` | app-client, client-web |

---

## Outros papéis

| Papel | Nome | E-mail | Plataformas |
|--------|------|--------|-------------|
| **Pulse Admin** | Pulse Admin | `jotav.pulse+pulse-admin@gmail.com` | producer-web (`/admin`) |
| **Cliente (CLIENT)** | Joao | `jotav.pulse+joao-cliente@gmail.com` | app-client, client-web |
| **Produtor (seed)** | Rodrigo Produtor | `jotav.pulse+producer1@gmail.com` | producer-web, app-producer |
| **Produtor PJ** | Ana Produções (PJ Completa) | `jotav.pulse+producer3@gmail.com` | producer-web, app-producer |
| **Produtor demo** | Pulse Produtor (demo antecipação) | `jotav.pulse+pulse-produtor-demo@gmail.com` | producer-web, app-producer |
| **Promoter (role PROMOTER)** | Gustavo Ribeiro | `jotav.pulse+promo1@gmail.com` | app-client (produtora Isadora Marín) |
| **Promoter (role PROMOTER)** | Lívia Arantes | `jotav.pulse+promo2@gmail.com` | app-client (produtora Isadora Marín) |

---

## Por plataforma

| Plataforma | Conta sugerida |
|------------|----------------|
| **client-web / app-client** (comprador) | `jotav.pulse+joao-cliente@gmail.com` |
| **app-client** (promoter Ross) | `jotav.pulse+ana-conda@gmail.com` ou `jotav.pulse+ane-mia@gmail.com` |
| **producer-web / app-producer** (titular Ross) | `jotav.pulse+thales-produtor@gmail.com` |
| **producer-web / app-producer** (gestor Ross) | `jotav.pulse+gestor-ross@gmail.com` |
| **producer-web / app-producer** (staff Ross) | `jotav.pulse+jhonatan-staff@gmail.com` |
| **producer-web** (Pulse Admin) | `jotav.pulse+pulse-admin@gmail.com` |

---

## Apelidos (slug) → e-mail

| Apelido | E-mail |
|---------|--------|
| `thales-produtor` | `jotav.pulse+thales-produtor@gmail.com` |
| `gestor-ross` | `jotav.pulse+gestor-ross@gmail.com` |
| `jhonatan-staff` | `jotav.pulse+jhonatan-staff@gmail.com` |
| `ana-conda` | `jotav.pulse+ana-conda@gmail.com` |
| `ane-mia` | `jotav.pulse+ane-mia@gmail.com` |
| `jhonatan-promoter` | `jotav.pulse+jhonatan-promoter@gmail.com` |
| `pulse-admin` | `jotav.pulse+pulse-admin@gmail.com` |
| `joao-cliente` | `jotav.pulse+joao-cliente@gmail.com` |
| `producer1` | `jotav.pulse+producer1@gmail.com` |
| `producer3` | `jotav.pulse+producer3@gmail.com` |
| `pulse-produtor-demo` | `jotav.pulse+pulse-produtor-demo@gmail.com` |
| `promo1` | `jotav.pulse+promo1@gmail.com` |
| `promo2` | `jotav.pulse+promo2@gmail.com` |

---

*Última atualização: 2026-05-19 — ambiente de desenvolvimento local.*
