# Dashboard — Por onde começo hoje?

**🚀 [Acesse o projeto em produção aqui!](https://karengomes.github.io/google-workspace-dashboard/)**

> ✨ **Quer testar o software usando o seu e-mail?**
> Como a aplicação utiliza a API do Google em fase de verificação, eu preciso autorizar o seu e-mail para que você possa fazer login. Vai ser um prazer enorme liberar o seu acesso para você ver o projeto funcionando com os seus próprios dados!
> **Entre em contato comigo:** [karen.gomes12023@gmail.com](mailto:karen.gomes12023@gmail.com)

## 🎥 Demonstração
<br>
<video src="https://github.com/user-attachments/assets/9efcad05-6967-44b5-b7dc-aeffa065b36e" autoplay loop muted playsinline width="100%"></video>
---

Dashboard responsivo de início de dia que exibe emails não lidos, reuniões do dia e tendências em tempo real via Google APIs.

## Stack

- **React 18** + **Vite 5** — SPA client-side
- **Chart.js** + **react-chartjs-2** — gráfico de volume semanal de emails
- **Google Identity Services (GSI)** — autenticação OAuth client-side
- **Gmail API v1** + **Google Calendar API v3** — dados reais

---

## Pré-requisitos

- Node.js ≥ 18
- Conta Google com acesso ao [Google Cloud Console](https://console.cloud.google.com)

---

## Como rodar

### 1. Clone e instale dependências

```bash
git clone <url-do-repo>
cd projeto-dashboard
npm install
```

### 2. Configure o `.env`

```bash
cp .env.example .env
```

O arquivo já vem com o Client ID de desenvolvimento. Para usar seu próprio:

```env
VITE_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
```

### 3. Autorize a origem no Google Cloud Console

No [Cloud Console → APIs → Credenciais](https://console.cloud.google.com/apis/credentials), adicione em **Authorized JavaScript origins**:

```
http://localhost:8000
```

### 4. Inicie o servidor

```bash
npm run dev
```

Acesse **http://localhost:8000**, clique em **Entrar com Google** e autorize os escopos de leitura.

---

## Scripts

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (HMR) |
| `npm run build` | Build de produção em `/dist` |
| `npm run preview` | Preview do build de produção |

---

## Estrutura resumida

```
src/
├── context/      # AuthContext · ThemeContext
├── hooks/        # useGmail · useCalendar
├── services/     # googleAuth · gmailService · calendarService
├── components/   # layout/ · cards/ · chart/ · agenda/
└── utils/        # logger · dateUtils
docs/
├── ARCHITECTURE.md      # Decisões técnicas e fluxo de dados
├── API_INTEGRATION.md   # Referência das APIs Google
└── COMPONENTS.md        # Props e assinaturas de hooks
```

---

## Funcionalidades

- 🔐 Login com Google (OAuth, somente leitura)
- 📬 Emails não lidos na caixa de entrada
- 🗓️ Reuniões do dia e próximo compromisso com contagem regressiva
- 📊 Gráfico de volume de emails dos últimos 7 dias
- 🌙 / ☀️ Modo escuro e claro (persiste no localStorage)
- 📋 Agenda completa do dia com horário e duração
