# 💳 Fluxos de Checkout Pulse! (v1.0)

Este documento detalha o funcionamento técnico dos fluxos de compra, falha, expiração e cancelamento, garantindo a conformidade com as regras de negócio 15.1 a 15.5.

## 15.1 Fluxo de Compra com Pix
| Etapa | Responsável | Ação Técnica |
| :--- | :--- | :--- |
| 1. Seleção | App Client | Envia `items` (batchId, quantity) para o backend. |
| 2. Reserva | Backend (Initialize) | Cria `CheckoutSession` e reserva estoque por 10 min. |
| 3. Escolha | App Client | Seleciona `PIX`. |
| 4. Apresentação | Backend (Calculate) | Aplica desconto de 5% sobre taxas e gera QR Code / Copia e Cola. |
| 5. Pagamento | Gateway (Pagar.me) | Processa a transação e notifica via Webhook. |
| 6. Confirmação | Backend (Confirm) | Valida pagamento, atualiza `Transaction` para `PAID` e emite os `Tickets`. |
| 7. Financeiro | Backend (Balance) | Registra o valor líquido no saldo retido do produtor. |
| 8. Entrega | App Client | Redireciona para `PaymentSuccessScreen` e libera botão Ver Ingressos. |

## 15.2 Fluxo de Compra com Cartão
*   **Regra de Parcelamento:** Até 4x com juros para o comprador (Regra 13.6).
*   **Segurança:** Dados sensíveis são tokenizados no frontend; o backend recebe apenas o `card_token`.
*   **Aprovação:** Segue o mesmo fluxo de emissão (Etapas 6 a 8) do Pix.

## 15.3 Fluxo de Falha e Nova Tentativa (Regra 13.6)
*   **Limite de Tentativas:** O sistema permite até 3 falhas por `CheckoutSession`.
*   **Registro:** Cada erro do gateway incrementa `attemptsCount` na `Transaction`.
*   **Bloqueio:** Ao atingir 3 falhas, o backend marca o `CheckoutSession.status` como `FAILED`, impedindo novas chamadas de cálculo ou pagamento para aquele pedido.

## 15.4 Fluxo de Expiração (Regra 13.4)
*   **Ciclo de Vida:** 10 minutos de reserva garantida.
*   **Trigger:** O cron job de limpeza ou a validação de UseCase checa `now() > expiresAt`.
*   **Reversão:** O estoque reservado (incrementado em `quantitySold`) é subtraído e volta ao lote disponível para outros usuários.

## 15.5 Fluxo de Cancelamento pelo Cliente (Regra 13.12)
| Validação | Regra | Ação em caso de FALHA |
| :--- | :--- | :--- |
| **Janela de Tempo** | Mais de 24h para o início do evento. | Exibe "Bloqueio: Menos de 24h restando". |
| **Status de Uso** | `isUsed` deve ser `false`. | Exibe "Bloqueio: Ingresso já utilizado". |
| **Método Pix** | Se pago via Pix. | Altera status para `REFUND_PENDING` (Análise Manual). |
| **Método Cartão** | Se pago via Cartão. | Altera status para `CANCELED` (Estorno Automático/Análise). |

---
**Nota:** O saldo do produtor só é liberado para saque após a realização do evento (D+X conforme contrato), garantindo liquidez para eventuais cancelamentos (Regra CDC).
