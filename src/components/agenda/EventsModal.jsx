/**
 * @component EventsModal
 * @description Modal with a full month event listing, grouped by day.
 * Allows month navigation (prev/next). Fetches from Calendar API on open/navigation.
 * @props onClose — callback to close modal
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createLogger } from '../../utils/logger';
import { fetchMonthEvents } from '../../services/calendarService';
import { fmt, duration } from '../../utils/dateUtils';

const log = createLogger('EventsModal');

const MONTHS_PT = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

export function EventsModal({ onClose }) {
  const now          = new Date();
  const [year,  setYear]   = useState(now.getFullYear());
  const [month, setMonth]  = useState(now.getMonth());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef(null);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* Focus trap */
  useEffect(() => { dialogRef.current?.focus(); }, []);

  /* Fetch when month/year changes */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMonthEvents(year, month);
      setEvents(data);
      log.info(`${data.length} events loaded for ${MONTHS_PT[month]}/${year}`);
    } catch (err) {
      log.error('fetchMonthEvents failed', err);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { load(); }, [load]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  /* Group events by day label */
  const grouped = groupByDay(events);

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal__header">
          <div className="modal__nav">
            <button className="modal__nav-btn" onClick={prevMonth} aria-label="Mês anterior">‹</button>
            <h2 className="modal__title" id="modal-title">
              {MONTHS_PT[month]} {year}
            </h2>
            <button className="modal__nav-btn" onClick={nextMonth} aria-label="Próximo mês">›</button>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        {/* Body */}
        <div className="modal__body">
          {loading && (
            <p className="modal__empty">⏳ Carregando eventos...</p>
          )}
          {!loading && events.length === 0 && (
            <p className="modal__empty">🎉 Nenhum evento em {MONTHS_PT[month]}</p>
          )}
          {!loading && grouped.map(({ dayLabel, items }) => (
            <div key={dayLabel} className="modal__day-group">
              <p className="modal__day-label">{dayLabel}</p>
              <ul className="modal__event-list">
                {items.map((ev, i) => (
                  <EventRow key={ev.id ?? i} event={ev} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventRow({ event }) {
  const sd  = event.start?.dateTime ? new Date(event.start.dateTime) : null;
  const ed  = event.end?.dateTime   ? new Date(event.end.dateTime)   : null;
  const time = sd ? fmt.time(sd) : 'Dia todo';
  const dur  = sd && ed ? duration(sd, ed) : '';
  const loc  = event.location?.substring(0, 50) ?? (event.hangoutLink ? 'Google Meet' : '');

  return (
    <li className="modal__event">
      <span className="modal__event-time">{time}</span>
      <div className="modal__event-info">
        <span className="modal__event-name">{event.summary || 'Sem título'}</span>
        {loc && <span className="modal__event-meta">{loc}</span>}
      </div>
      {dur && <span className="modal__event-dur">{dur}</span>}
    </li>
  );
}

/** Groups sorted events by formatted day string */
function groupByDay(events) {
  const map = new Map();
  for (const ev of events) {
    const d   = ev.start?.dateTime ? new Date(ev.start.dateTime) : new Date(ev.start?.date);
    const key = d.toLocaleDateString('pt-BR', { weekday:'short', day:'numeric', month:'short' });
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(ev);
  }
  return Array.from(map.entries()).map(([dayLabel, items]) => ({ dayLabel, items }));
}
