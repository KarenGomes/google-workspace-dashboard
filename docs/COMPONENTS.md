# Componentes

> Referência de props para LLMs e agentes.

## Layout

### `<TopBar user onSignOut />`
Barra superior com brand, data atual, ThemeToggle e info do usuário.
- `user` — objeto do perfil Gmail (`{ emailAddress }`) ou `null`
- `onSignOut` — callback chamado ao clicar em "Sair"

### `<LoginOverlay onSignIn disabled />`
Tela de login em fullscreen. Renderizada quando `status !== 'authenticated'`.
- `onSignIn` — callback para disparar o fluxo OAuth
- `disabled` — desativa o botão enquanto os SDKs carregam

## Common

### `<ThemeToggle />`
Botão ☀️/🌙 que chama `toggleTheme()` do `ThemeContext`.
Sem props externas.

## Cards

### `<SummaryCard icon badge count label desc updated variant />`
Card de métrica genérico (agora sem link de ação / CTA para manter um visual limpo).

| Prop | Tipo | Descrição |
|------|------|-----------|
| `icon` | string/emoji | Ícone exibido no header |
| `badge` | string | Label de status (ex: "Não lidos") |
| `count` | number\|null | Número principal; `null` → exibe "—" |
| `label` | string | Título do card |
| `desc` | string | Descrição secundária |
| `updated` | string | Rodapé (ex: "Atualizado às 14:32") |
| `variant` | `'purple'\|'blue'\|'teal'` | Cor do card |

### `<NextEventCard events />`
Card que deriva o próximo evento do array de Calendar events.
- `events` — array de eventos do `useCalendar()`
- Sem lógica de fetch própria; puramente derivado de props

## Chart

### `<EmailChart weekly fill />`
Gráfico de barras com volume semanal de emails.
- `weekly` — `{ labels: string[], counts: number[] }` ou `null`
- `fill` — boolean (default: `false`). Se `true`, expande a altura para ocupar flexivelmente o painel restante (usado na aba Resumo).

## Agenda

### `<AgendaSection events loading />`
Lista completa de eventos do dia.
- `events` — array de Google Calendar events ou `null` (se ainda não autenticado / carregado).
- `loading` — boolean para exibir estado de carregamento.
- Exibe o botão **"Ver mais →"** que abre o modal mensal (`EventsModal`).

### `<AgendaItem event index isNext />`
Item individual da agenda. Puramente presentacional.
- `event` — Google Calendar event object
- `index` — índice para cor e ícone cíclico
- `isNext` — destaca o próximo evento futuro

### `<EventsModal onClose />`
Modal que lista de forma agrupada por dia todos os compromissos do mês corrente do calendário, com botões para navegação mensal anterior/posterior.
- `onClose` — callback disparado para fechar o modal.


## Contexts

### `useAuth()`
```js
const { user, status, signIn, signOut } = useAuth();
// status: 'initialising' | 'ready' | 'loading' | 'authenticated' | 'error'
```

### `useTheme()`
```js
const { theme, toggleTheme } = useTheme();
// theme: 'dark' | 'light'
```

## Hooks

### `useGmail()`
```js
const { unread, weekly, loading, error, refetch } = useGmail();
// unread: number | null
// weekly: { labels: string[], counts: number[] } | null
```

### `useCalendar()`
```js
const { events, loading, error, refetch } = useCalendar();
// events: GoogleCalendarEvent[]
```
