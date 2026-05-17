# Integrações de API Google

## Autenticação — Token Flow (client-side)

O projeto usa **Google Identity Services (GSI)** com o fluxo de token implícito:
- Nenhum backend necessário
- Token de acesso expira em 1h (sem refresh automático)
- Escopo: somente leitura

### Scopes solicitados

```
https://www.googleapis.com/auth/gmail.readonly
https://www.googleapis.com/auth/calendar.readonly
```

### Ciclo de vida do token

```
initGapi() + initGsi()  →  createTokenClient()
                         →  requestAccessToken({ prompt:'consent' })
                         →  callback(resp) → resp.access_token
                         →  gapi.client usa o token automaticamente
```

---

## Gmail API v1

Arquivo: `src/services/gmailService.js`

### fetchProfile()
`GET /gmail/v1/users/me/profile`
Retorna: `{ emailAddress, messagesTotal, messagesUnread, ... }`

### fetchInboxLabel()
`GET /gmail/v1/users/me/labels/INBOX`
Retorna: `{ messagesUnread, messagesTotal, ... }`
> Preferido para contagem de não lidos (mais eficiente que listar mensagens)

### fetchWeeklyStats()
Faz 7 chamadas paralelas com `Promise.allSettled`:
`GET /gmail/v1/users/me/messages?q=after:{unix}&before:{unix}&maxResults=1`
Usa `resultSizeEstimate` como contagem aproximada por dia.

> ⚠️ `resultSizeEstimate` é uma estimativa. Para contagem exata, use paginação completa (mais lento).

---

## Calendar API v3

Arquivo: `src/services/calendarService.js`

### fetchTodayEvents()
`GET /calendar/v3/calendars/primary/events`
Parâmetros:
- `timeMin`: ISO start of today
- `timeMax`: ISO start of tomorrow
- `singleEvents: true` — expande eventos recorrentes
- `orderBy: 'startTime'`

Retorna array de Event objects. Campos relevantes:
- `event.summary` — título
- `event.start.dateTime` — horário de início (ISO 8601)
- `event.end.dateTime` — horário de fim
- `event.start.date` — para eventos de dia inteiro
- `event.location` — local
- `event.hangoutLink` — link Google Meet

---

## Erros comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `popup_closed_by_user` | Usuário fechou o popup | Re-habilitar botão de login |
| `access_denied` | Permissão negada | Mostrar mensagem e re-exibir login |
| `401 Unauthorized` | Token expirado (1h) | Chamar `requestAccessToken` novamente |
| `403 Forbidden` | Scope insuficiente | Verificar scopes em `googleAuth.js` |
| `origin not allowed` | Origem não registrada no Cloud Console | Adicionar `http://localhost:8000` nas origens autorizadas |
