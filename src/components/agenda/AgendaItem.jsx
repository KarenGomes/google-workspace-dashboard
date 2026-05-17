/**
 * @component AgendaItem — single event row in the agenda list.
 * @props event — Google Calendar event object, isNext — boolean
 */
import { fmt, duration } from '../../utils/dateUtils';

const COLORS  = ['blue', 'purple', 'teal', 'amber'];
const ICONS   = ['📅','☕','📋','🎯','💡','🔄','📊','🗓️'];

export function AgendaItem({ event, index, isNext }) {
  const sd      = event.start?.dateTime ? new Date(event.start.dateTime) : null;
  const ed      = event.end?.dateTime   ? new Date(event.end.dateTime)   : null;
  const timeStr = sd ? fmt.time(sd) : 'Dia todo';
  const period  = sd ? (sd.getHours() < 12 ? 'manhã' : 'tarde') : '';
  const dur     = sd && ed ? duration(sd, ed) : '';
  const loc     = event.location?.substring(0, 45) ?? (event.hangoutLink ? 'Google Meet' : '');
  const color   = COLORS[index % COLORS.length];
  const icon    = ICONS[index % ICONS.length];

  return (
    <li
      className={`agenda-item agenda-item--${color}${isNext ? ' agenda-item--next' : ''}`}
      id={`agenda-ev-${index}`}
    >
      <div className="agenda-item__time">
        {timeStr}
        <span className="agenda-item__time-period">{period}</span>
      </div>
      <div className="agenda-item__body">
        <div className="agenda-item__icon" aria-hidden="true">{icon}</div>
        <div className="agenda-item__info">
          <div className="agenda-item__name">{event.summary || 'Sem título'}</div>
          <div className="agenda-item__meta">{loc}</div>
        </div>
      </div>
      <div className="agenda-item__right">
        {dur && <span className="agenda-item__duration">⏱ {dur}</span>}
        {isNext && <span className="agenda-item__badge">Próximo</span>}
      </div>
    </li>
  );
}
