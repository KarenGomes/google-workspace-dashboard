# Arquitetura do Dashboard

> Documento de contexto para LLMs e agentes que modificarão este código.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| UI     | React 18 + Vite 5 |
| Estilo | CSS puro com custom properties (sem Tailwind) |
| Gráfico | Chart.js 4 + react-chartjs-2 |
| Auth   | Google Identity Services (GSI) token flow |
| APIs   | Gmail REST API v1 · Google Calendar API v3 |

## Por que Vite + React e não Next.js?

O projeto é 100% client-side (SPA):
- Sem rotas múltiplas
- Sem SSR/SSG necessário
- Google OAuth usa apenas origens JavaScript autorizadas (não funciona com server-side)
- Next.js adicionaria complexidade sem benefício

## Estrutura de diretórios

```
src/
├── main.jsx               # Entry point React
├── App.jsx                # Root: roteamento auth → LoginOverlay | Dashboard
├── context/
│   ├── AuthContext.jsx    # Estado de auth: idle→ready→authenticated
│   └── ThemeContext.jsx   # dark|light com localStorage + data-theme
├── hooks/
│   ├── useGmail.js        # Fetch unread + weekly stats; reage ao AuthContext
│   └── useCalendar.js     # Fetch eventos de hoje; reage ao AuthContext
├── services/
│   ├── googleAuth.js      # Carrega scripts GSI/GAPI, gerencia tokens
│   ├── gmailService.js    # Wrappers Gmail API
│   └── calendarService.js # Wrappers Calendar API
├── components/
│   ├── common/ThemeToggle.jsx
│   ├── layout/TopBar.jsx · LoginOverlay.jsx
│   ├── cards/SummaryCard.jsx · NextEventCard.jsx
│   ├── chart/EmailChart.jsx
│   └── agenda/AgendaSection.jsx · AgendaItem.jsx · EventsModal.jsx
├── utils/
│   ├── logger.js          # createLogger(module) → { info, warn, error, debug }
│   └── dateUtils.js       # fmt.* helpers + countdown() + duration()
└── styles/
    └── index.css          # Design tokens dark/light + layout de abas responsivo
```

## Fluxo de dados

```
AuthContext (status: initialising → ready → authenticated)
    ↓ status === 'authenticated'
useGmail()          useCalendar()
    ↓                    ↓
gmailService.js    calendarService.js
    ↓                    ↓
window.gapi.client.gmail  window.gapi.client.calendar
```

## Navegação por Abas & Layout Responsivo

O dashboard foi projetado sob o conceito **Full-Viewport (SPA compacta)**, eliminando scrollbars globais na página de desktop para concentrar as ações de forma limpa e visível de imediato.

### Sistema de Abas (2-Tab View)
1. **Resumo (`#panel-resumo`)**:
   - Linha de cards compactos superiores (`.cards-row`): Emails Não Lidos, Reuniões do Dia e Próximo Evento (com countdown).
   - Gráfico de Tendência Semanal (`EmailChart`) que flexibiliza verticalmente para ocupar toda a metade inferior da tela.
   - Status strip compacto fixado no rodapé.
2. **Agenda (`#panel-agenda`)**:
   - Listagem completa dos compromissos (`AgendaSection`).
   - Botão **"Ver mais →"** que dispara o `EventsModal` para navegação mensal.
   - Scroll restrito e interno ao container (`overflow-y: auto`), mantendo o shell de abas fixo.

### Arquitetura de Responsividade (Mobile First / Adaptativa)
- **Desktop (> 768px)**:
  - `html, body, #root` com altura fixa em `100%` e `overflow: hidden`.
  - `.app-shell` em flex-column com altura `100vh`. Os elementos preenchem proporcionalmente as dimensões da tela.
- **Mobile & Tablet (≤ 768px)**:
  - Desbloqueio do fluxo de scroll global: `html, body` mudam para `height: auto; overflow: auto;`.
  - `.cards-row` muda de `repeat(3, 1fr)` para `1fr` empilhado verticalmente.
  - A tab panel ativa passa a fluir de forma contínua, permitindo ao usuário rolar confortavelmente na vertical para visualizar cards empilhados, gráfico e rodapé.
  - O topo do app (`TopBar` e `tab-nav`) adota padrões flex-wrap compactos.

## Temas

O tema é controlado pelo atributo `data-theme` no elemento `<html>`:
- `dark` (padrão) → variáveis em `:root`
- `light` → variáveis em `[data-theme="light"]`
- Persistido em `localStorage`

Para adicionar um novo token de cor, edite **apenas** `src/styles/index.css`.

## Logger

Cada módulo cria seu próprio logger:
```js
const log = createLogger('NomeDoModulo');
log.info('algo aconteceu');
log.debug('detalhe', objeto);
log.error('falhou', err);
```
Logs aparecem apenas em `import.meta.env.DEV`. Erros sempre aparecem.

## Adicionando uma nova fonte de dados

1. Crie `src/services/novoServico.js`
2. Crie `src/hooks/useNovoDado.js` (siga o padrão de `useGmail.js`)
3. Adicione o scope OAuth necessário em `src/services/googleAuth.js` (array `SCOPES`)
4. Consuma o hook em `App.jsx`
5. Adicione na aba correspondente do layout.

## Credenciais

- **Client ID**: `568935543374-0lkkro7cd2aqtd789mvq9c9e71eiud82.apps.googleusercontent.com`
- Origem autorizada necessária: `http://localhost:8000`

> ⚠️ Nunca comite tokens de acesso ou refresh tokens. O Client ID é público por design.

