/**
 * @component EmailChart — bar chart of email volume over the last 7 days.
 * Powered by react-chartjs-2 + Chart.js.
 * @props weekly — { labels: string[], counts: number[] } | null
 */
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const BASE   = 'rgba(124,111,255,';
const OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'var(--bg-card)',
      borderColor: 'var(--border-accent)',
      borderWidth: 1,
      titleColor: 'var(--text-primary)',
      bodyColor: 'var(--text-secondary)',
      padding: 12,
      cornerRadius: 10,
      callbacks: { label: c => ` ${c.parsed.y} emails` },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: 'var(--text-muted)', font: { family: 'Inter', size: 12, weight: '500' } },
    },
    y: {
      grid: { color: 'var(--border)', lineWidth: 1 },
      border: { display: false, dash: [4, 4] },
      ticks: { color: 'var(--text-muted)', font: { family: 'Inter', size: 11 }, stepSize: 5, padding: 8 },
      beginAtZero: true,
    },
  },
  animation: { duration: 900, easing: 'easeOutQuart' },
};

export function EmailChart({ weekly, fill = false }) {

  const { labels, counts } = weekly ?? { labels: [], counts: [] };

  const total = counts.reduce((a, b) => a + b, 0);
  const avg   = counts.length ? (total / counts.length).toFixed(1).replace('.', ',') : '—';

  const data = useMemo(() => ({
    labels,
    datasets: [{
      label: 'Emails',
      data: counts,
      backgroundColor: counts.map((_, i) => `${BASE}${i === counts.length - 1 ? '.95)' : '.28)'}`),
      borderColor:     counts.map((_, i) => `${BASE}${i === counts.length - 1 ? '1)' : '.45)'}`),
      borderWidth: 1.5,
      borderRadius: 8,
      borderSkipped: false,
    }],
  }), [labels, counts]);

  return (
    <section className={`chart-section${fill ? ' chart-section--fill' : ''}`} aria-labelledby="chart-title">
      <p className="section-label">Tendência semanal</p>
      <div className={`chart-card${fill ? ' chart-card--fill' : ''}`}>
        <div className="chart-card__header">
          <div className="chart-card__title-group">
            <h2 className="chart-card__title" id="chart-title">📧 Volume de emails na semana</h2>
            <p className="chart-card__subtitle">
              {weekly ? 'Últimos 7 dias · emails recebidos' : 'Faça login para ver seus dados'}
            </p>
          </div>
          <div className="chart-card__meta">
            <div className="chart-meta-item">
              <div className="chart-meta-item__value">{weekly ? total : '—'}</div>
              <div className="chart-meta-item__label">Total na semana</div>
            </div>
            <div className="chart-meta-divider" aria-hidden="true" />
            <div className="chart-meta-item">
              <div className="chart-meta-item__value" style={{ color: 'var(--accent-teal)' }}>{weekly ? avg : '—'}</div>
              <div className="chart-meta-item__label">Média por dia</div>
            </div>
          </div>
        </div>
        <div className="chart-wrap">
          {weekly
            ? <Bar data={data} options={OPTIONS} />
            : <div className="chart-placeholder">🔐 Faça login para ver o gráfico</div>
          }
        </div>
      </div>
    </section>
  );
}
