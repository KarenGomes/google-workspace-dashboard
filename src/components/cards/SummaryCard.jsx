/**
 * @component SummaryCard
 * @props icon, badge, count, label, desc, updated, variant ('purple'|'blue'|'teal')
 * Renders a stat card. When count is null, shows skeleton dash.
 */
export function SummaryCard({ icon, badge, count, label, desc, updated, variant = 'purple' }) {
  return (
    <article className={`card card--${variant}`} role="listitem">
      <div className="card__header">
        <div className="card__icon-wrap" aria-hidden="true">{icon}</div>
        <span className="card__badge">{badge}</span>
      </div>
      <div className="card__number" aria-label={`${count ?? '—'} ${label}`}>
        {count ?? '—'}
      </div>
      <h2 className="card__label">{label}</h2>
      <p className="card__desc">{desc ?? 'Faça login para ver'}</p>
      <div className="card__footer">
        <span className="card__trend">{updated ?? '—'}</span>
      </div>
    </article>
  );
}

