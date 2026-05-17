/**
 * @component AgendaSection — full day agenda from Calendar events.
 * @props events — array | null (null = not yet fetched), loading — boolean
 * Shows "Ver mais" button that opens EventsModal with full month listing.
 */
import { useMemo, useState } from 'react';
import { AgendaItem }   from './AgendaItem';
import { EventsModal }  from './EventsModal';

export function AgendaSection({ events, loading }) {
  const [modalOpen, setModalOpen] = useState(false);
  const now = new Date();

  let foundNext = false;
  const items = useMemo(() => (events ?? []).map((ev, i) => {
    const isNext = !foundNext && ev.start?.dateTime && new Date(ev.start.dateTime) > now;
    if (isNext) foundNext = true;
    return { ev, i, isNext };
  }), [events]);

  /* Distinguish: null = not fetched yet, [] = fetched but empty */
  const notFetched  = events === null && !loading;
  const emptyDay    = events !== null && events.length === 0 && !loading;

  return (
    <>
      <section className="agenda-section" aria-labelledby="agenda-title">
        <p className="section-label">Agenda de hoje</p>
        <div className="agenda-card">
          <div className="agenda-card__header">
            <h2 className="agenda-card__title" id="agenda-title">🗓️ Compromissos do dia</h2>
            <div className="agenda-card__header-right">
              <span className="agenda-card__count">
                {loading ? '…' : events !== null ? `${events.length} evento${events.length !== 1 ? 's' : ''}` : '—'}
              </span>
              {events !== null && (
                <button
                  className="agenda-card__more-btn"
                  onClick={() => setModalOpen(true)}
                  aria-label="Ver todos os eventos do mês"
                >
                  Ver mais →
                </button>
              )}
            </div>
          </div>

          <ol className="agenda-list" id="agenda-list">
            {loading && (
              <li className="agenda-empty">⏳ Carregando compromissos...</li>
            )}
            {notFetched && (
              <li className="agenda-empty">🔐 Faça login para ver seus compromissos</li>
            )}
            {emptyDay && (
              <li className="agenda-empty">✅ Sem compromissos para hoje</li>
            )}
            {!loading && items.map(({ ev, i, isNext }) => (
              <AgendaItem key={ev.id ?? i} event={ev} index={i} isNext={isNext} />
            ))}
          </ol>
        </div>
      </section>

      {modalOpen && <EventsModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
