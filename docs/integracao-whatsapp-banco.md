# Preparacao para API e banco

A UI continua usando `DataContext` e mocks. A pasta `src/integrations` define o contrato que uma implementacao HTTP podera substituir sem alterar as features.

## O que deve ser persistido

- `clients`: identidade, telefone normalizado, aniversario e tags.
- `services`: nome, categoria, duracao em minutos, preco em centavos e ativo.
- `appointments`: cliente, servico, data/hora solicitadas, origem, status, valor e auditoria.
- `appointment_status_history`: cada transicao, ator, motivo, data/hora e requestId.
- `agenda_blocks`: bloqueios da manicure, independentes de cliente e agendamento.
- `payments`: agendamento, valor em centavos, status, forma e timestamps.
- `whatsapp_messages`: mensagem, template, variaveis, provider message id, status de entrega e erro.
- `outbox_events`: eventos para envio assincrono e retentativas idempotentes.

IDs devem ser gerados no backend. O frontend deve tratar os IDs como opacos e nunca usar `Date.now()` como identificador definitivo quando a API estiver ativa.

## Fluxo de agendamento via WhatsApp

1. O webhook recebe uma solicitacao e cria `appointments.status = AGUARDANDO`.
2. A manicure escolhe `CONFIRMADO`, `REAGENDAMENTO_SUGERIDO` ou `CANCELADO`.
3. Cada decisao gera um registro em `appointment_status_history` e um evento de outbox.
4. O worker chama a API do WhatsApp usando um template aprovado e salva o resultado do envio.
5. Confirmacao, reagendamento e negativa so devem ser considerados entregues quando houver retorno do provider.

Negativas devem conter `reason` e nao devem excluir o registro original. O motivo e dado operacional e pode ser enviado para a cliente.

## Fluxo de atendimento e pagamento

- `CONFIRMADO` -> `REALIZADO` quando a manicure conclui o atendimento.
- O checkout grava/atualiza `payments` e vincula o pagamento ao agendamento.
- `PENDENTE` permite cobranca posterior sem criar outro atendimento.
- `RECEBIDO` exige forma de pagamento e deve atualizar o CRM, faturamento e retorno enviado pelo bot.

## Contrato HTTP sugerido

- `POST /v1/webhooks/whatsapp` recebe mensagens do provider.
- `GET /v1/appointments?from=&to=` carrega agenda.
- `POST /v1/appointments` cria agendamento manual.
- `POST /v1/appointments/:id/status` aplica uma transicao com ator e motivo.
- `GET /v1/agenda-blocks?from=&to=` e `POST/PATCH/DELETE /v1/agenda-blocks/:id` gerenciam bloqueios.
- `PATCH /v1/payments/:id` atualiza pagamento.
- `GET /v1/whatsapp/messages/:appointmentId` consulta entrega.

Todos os comandos devem aceitar `Idempotency-Key`; respostas devem retornar `requestId` para rastreabilidade.
