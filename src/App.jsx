/**
 * @component App — full-viewport 2-tab dashboard.
 * Tab 1 (Resumo): compact cards + email chart.
 * Tab 2 (Agenda): today's event list.
 */
import { useState } from 'react';
import { useAuth }       from './context/AuthContext';
import { useGmail }      from './hooks/useGmail';
import { useCalendar }   from './hooks/useCalendar';
import { TopBar }        from './components/layout/TopBar';
import { LoginOverlay }  from './components/layout/LoginOverlay';
import { SummaryCard }   from './components/cards/SummaryCard';
import { NextEventCard } from './components/cards/NextEventCard';
import { EmailChart }    from './components/chart/EmailChart';
import { AgendaSection } from './components/agenda/AgendaSection';
import { fmt }           from './utils/dateUtils';

const TABS = [
  { id: 'resumo', icon: '📊', label: 'Resumo' },
  { id: 'agenda', icon: '🗓️', label: 'Agenda' },
];

/* ── Root ─────────────────────────────────────────────────────────────────── */
export default function App() {
  const { user, status, signIn, signOut } = useAuth();
  const [tab, setTab] = useState('resumo');

  if (status !== 'authenticated') {
    return <LoginOverlay onSignIn={signIn} disabled={status === 'initialising'} />;
  }

  return (
    <div className="app-shell">
      <div className="glow-blob glow-blob--1" aria-hidden="true" />
      <div className="glow-blob glow-blob--2" aria-hidden="true" />
      <TopBar user={user} onSignOut={signOut} />
      <TabNav active={tab} onChange={setTab} />
      <TabContent activeTab={tab} />
    </div>
  );
}

/* ── Tab navigation ───────────────────────────────────────────────────────── */
function TabNav({ active, onChange }) {
  return (
    <nav className="tab-nav" role="tablist" aria-label="Seções do dashboard">
      {TABS.map(({ id, icon, label }) => (
        <button
          key={id}
          id={`tab-${id}`}
          role="tab"
          aria-selected={active === id}
          aria-controls={`panel-${id}`}
          className={`tab-nav__btn${active === id ? ' tab-nav__btn--active' : ''}`}
          onClick={() => onChange(id)}
        >
          <span className="tab-nav__icon" aria-hidden="true">{icon}</span>
          <span className="tab-nav__label">{label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ── Tab content ──────────────────────────────────────────────────────────── */
function TabContent({ activeTab }) {
  const { unread, weekly, loading: gmailLoading } = useGmail();
  const { events, loading: calLoading }           = useCalendar();

  const now      = new Date();
  const updated  = `Atualizado às ${fmt.time(now)}`;
  const evList   = events ?? [];
  const nextEv   = evList.find(e => e.start?.dateTime && new Date(e.start.dateTime) > now);
  const meetDesc = events === null
    ? 'Faça login para ver'
    : events.length === 0
      ? 'Nenhuma reunião hoje 🎉'
      : nextEv
        ? `Próxima: ${nextEv.summary} às ${fmt.time(new Date(nextEv.start.dateTime))}`
        : `${events.length} reunião(ões) hoje`;

  return (
    <div className="tab-content">

      {/* ── Aba 1: Resumo — cards compactos + gráfico ─────────────── */}
      <div
        id="panel-resumo" role="tabpanel" aria-labelledby="tab-resumo"
        className={`tab-panel${activeTab === 'resumo' ? ' tab-panel--active' : ''}`}
      >
        <div className="cards-row" role="list">
          <SummaryCard
            icon="📬" variant="purple"
            badge={unread > 0 ? 'Não lidos' : 'Em dia ✅'}
            count={gmailLoading ? null : unread}
            label="Emails não lidos"
            desc={unread === 0 ? 'Caixa de entrada em dia 🎉' : `${unread} na caixa de entrada`}
            updated={updated}
          />
          <SummaryCard
            icon="🗓️" variant="blue"
            badge="Hoje"
            count={calLoading ? null : (events?.length ?? null)}
            label="Reuniões hoje"
            desc={meetDesc}
            updated={updated}
          />
          <NextEventCard events={evList} />
        </div>

        <div className="resumo-chart">
          <EmailChart weekly={weekly} fill />
        </div>

        <div className="strip strip--compact" role="complementary">
          <p className="strip__text">
            <strong>Tudo sincronizado.</strong> {updated}.
          </p>
          <span className="strip__status">
            <span className="strip__status-dot" aria-hidden="true" />
            Dados em tempo real
          </span>
        </div>
      </div>

      {/* ── Aba 2: Agenda ─────────────────────────────────────────── */}
      <div
        id="panel-agenda" role="tabpanel" aria-labelledby="tab-agenda"
        className={`tab-panel tab-panel--scroll${activeTab === 'agenda' ? ' tab-panel--active' : ''}`}
      >
        <AgendaSection events={events} loading={calLoading} />
      </div>

    </div>
  );
}
