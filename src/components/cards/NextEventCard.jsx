/**
 * @component NextEventCard
 * @props events — today's Calendar events array
 * Shows the next upcoming event with countdown. Derived from Calendar data.
 */
import { useMemo } from 'react';
import { fmt, countdown } from '../../utils/dateUtils';

export function NextEventCard({ events = [] }) {
  const now  = new Date();
  const next = useMemo(
    () => events.find(e => e.start?.dateTime && new Date(e.start.dateTime) > now),
    [events]
  );

  if (!events.length && events !== null) {
    return <Card time="—" title="Faça login para ver" sub="—" badge="Em breve" />;
  }
  if (!next) {
    return <Card time="✔️" title="Todos os eventos passaram" sub="Até amanhã!" badge="Encerrado" />;
  }

  const start   = new Date(next.start.dateTime);
  const timeStr = fmt.time(start);
  const count   = countdown(start, now);

  return <Card time={timeStr} title={next.summary || 'Sem título'} sub={count} badge="Em breve" />;
}

function Card({ time, title, sub, badge }) {
  return (
    <article className="card card--teal" role="listitem" id="card-proximo">
      <div className="card__header">
        <div className="card__icon-wrap" aria-hidden="true">⏰</div>
        <span className="card__badge">{badge}</span>
      </div>
      <div className="card__number" style={{ fontSize: '1.8rem' }}>{time}</div>
      <h2 className="card__label">Próximo compromisso</h2>
      <p className="card__desc">{title}</p>
      <div className="card__footer">
        <span className="card__trend">{sub}</span>
        <span className="card__cta">Ver agenda →</span>
      </div>
    </article>
  );
}
