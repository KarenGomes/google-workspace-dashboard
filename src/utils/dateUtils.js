/** @module dateUtils — locale-aware date/time helpers (pt-BR) */

const DAYS_PT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

export const fmt = {
  /** "Sábado, 17 de maio de 2026" */
  fullDate: (d = new Date()) => {
    const s = d.toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  },
  /** "14:32" */
  time: (d = new Date()) =>
    d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' }),
  /** "Seg" … "Dom" */
  weekdayShort: (d = new Date()) => DAYS_PT[d.getDay()],
  /** Unix seconds for start-of-day */
  dayStart: (d = new Date()) =>
    Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 1000),
  /** Unix seconds for end-of-day */
  dayEnd: (d = new Date()) =>
    Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime() / 1000),
  /** ISO string for start-of-day */
  isoStart: (d = new Date()) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString(),
  /** ISO string for end-of-day */
  isoEnd: (d = new Date()) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString(),
};

/** Human-readable countdown: "Em 45 min" | "Em 1h 30min" | "Acontecendo agora" */
export function countdown(targetDate, now = new Date()) {
  const diffMin = Math.round((targetDate - now) / 60000);
  if (diffMin <= 0) return 'Acontecendo agora';
  if (diffMin < 60)  return `Em ${diffMin} min`;
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return `Em ${h}h${m ? ' ' + m + 'min' : ''}`;
}

/** Duration label: "45 min" | "1h 30min" */
export function duration(startDate, endDate) {
  const m = Math.round((endDate - startDate) / 60000);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h}h${m % 60 ? ' ' + (m % 60) + 'min' : ''}`;
}
