import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import ReactECharts from 'echarts-for-react'

/**
 * Dense KPI card in the Power BI / Excel style:
 * label -> big tabular number -> delta badge -> sparkline trend.
 */
export default function KPICard({ label, value, delta, sparkline = [], accent = 'brand' }) {
  const isPositive = delta >= 0
  const accentHex = {
    brand: '#0D9488',
    blue: '#2563EB',
    amber: '#D97706',
    rose: '#E11D48',
  }[accent]

  const sparkOption = {
    grid: { top: 4, bottom: 4, left: 0, right: 0 },
    xAxis: { type: 'category', show: false, data: sparkline.map((_, i) => i) },
    yAxis: { type: 'value', show: false },
    series: [
      {
        data: sparkline,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: accentHex },
        areaStyle: { color: accentHex, opacity: 0.08 },
      },
    ],
    tooltip: { show: false },
  }

  return (
    <div className="bg-surface border border-ink-100 rounded-card shadow-card hover:shadow-card-hover transition-shadow duration-150 p-4">
      <div className="flex items-start justify-between mb-1">
        <span className="text-xs font-medium text-ink-500 uppercase tracking-wide">{label}</span>
        {delta !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded ${
              isPositive ? 'text-brand-dark bg-brand-light' : 'text-accent-rose bg-accent-rose/10'
            }`}
          >
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="text-tabular-lg font-bold text-ink-900 tabular-nums font-mono">{value}</div>
      {sparkline.length > 0 && (
        <div className="h-8 mt-2 -mx-1">
          <ReactECharts option={sparkOption} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
        </div>
      )}
    </div>
  )
}
