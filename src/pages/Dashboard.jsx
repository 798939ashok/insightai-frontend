import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactECharts from 'echarts-for-react'
import { Loader2, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'
import KPICard from '../components/KPICard'
import api from '../services/api'

export default function Dashboard() {
  const location = useLocation()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        let datasetId = location.state?.datasetId
        if (!datasetId) {
          const { data: latest } = await api.get('/api/upload/latest')
          datasetId = latest.dataset_id
        }
        const { data } = await api.get(`/api/dashboard/${datasetId}`)
        setDashboard(data)
      } catch (err) {
        setError(
          err.response?.status === 404
            ? 'No dataset yet. Upload a CSV or Excel file to see your dashboard.'
            : 'Could not load the dashboard. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [location.state])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-ink-500 gap-2">
        <Loader2 size={18} className="animate-spin" /> Loading dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <UploadCloud size={32} className="text-ink-300" />
        <p className="text-sm text-ink-500 max-w-xs">{error}</p>
        <Link to="/upload/csv" className="text-sm font-medium text-brand hover:text-brand-dark">
          Go to CSV Upload
        </Link>
      </div>
    )
  }

  const columns = dashboard.recent_rows.length ? Object.keys(dashboard.recent_rows[0]).slice(0, 6) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-brand-dark bg-brand-light px-2.5 py-1 rounded-full">
          {dashboard.dataset_type} dataset
        </span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboard.kpis.map((k) => (
          <KPICard key={k.label} label={k.label} value={k.value} delta={k.delta} />
        ))}
      </div>

      {/* Charts */}
      {dashboard.charts.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-4">
          {dashboard.charts.map((c) => (
            <div key={c.title} className="bg-surface border border-ink-100 rounded-card shadow-card p-5">
              <h3 className="text-sm font-semibold text-ink-900 mb-3">{c.title}</h3>
              <ReactECharts option={c.option} style={{ height: 240 }} opts={{ renderer: 'svg' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-ink-100 rounded-card shadow-card p-6 text-sm text-ink-500">
          No charts available — this dataset doesn't have recognizable revenue/category/date columns.
        </div>
      )}

      {/* Recent rows */}
      {columns.length > 0 && (
        <div className="bg-surface border border-ink-100 rounded-card shadow-card">
          <div className="p-5 pb-3">
            <h3 className="text-sm font-semibold text-ink-900">Recent Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-ink-100 text-left text-xs text-ink-500 uppercase tracking-wide">
                  {columns.map((col) => (
                    <th key={col} className="font-medium px-5 py-2 whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dashboard.recent_rows.map((row, i) => (
                  <tr key={i} className="border-t border-ink-100 hover:bg-ink-100/50">
                    {columns.map((col) => (
                      <td key={col} className="px-5 py-2.5 text-ink-900 whitespace-nowrap">{String(row[col])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}