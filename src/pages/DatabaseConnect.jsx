import { useState } from 'react'
import { Database, Loader2, CheckCircle2, Table2 } from 'lucide-react'
import ReactECharts from 'echarts-for-react'
import Button from '../components/Button'
import KPICard from '../components/KPICard'
import api from '../services/api'

const initialForm = { host: '', port: '3306', database: '', username: '', password: '' }
const STORAGE_KEY = 'insightai_db_connection'

function loadSavedForm() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return { ...initialForm, ...saved, password: '' } // never persist the password
  } catch {
    return initialForm
  }
}

export default function DatabaseConnect() {
  const [form, setForm] = useState(loadSavedForm)
  const [status, setStatus] = useState('idle') // idle | connecting | connected | error
  const [errorMsg, setErrorMsg] = useState('')
  const [tables, setTables] = useState([])
  const [selectedTables, setSelectedTables] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleConnect = async (e) => {
    e.preventDefault()
    setStatus('connecting')
    setErrorMsg('')
    try {
      const { data } = await api.post('/api/database/connect', form)
      setTables(data.tables || [])
      setStatus('connected')
      const { password, ...toSave } = form
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.response?.data?.detail || 'Could not connect. Check your credentials and try again.')
    }
  }

  const toggleTable = (t) => {
    setSelectedTables((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  const handleGenerateDashboard = async () => {
    setGenerating(true)
    setGenError('')
    setDashboard(null)
    try {
      const { data } = await api.post('/api/database/dashboard', { ...form, tables: selectedTables })
      setDashboard(data)
    } catch (err) {
      setGenError(err.response?.data?.detail || 'Could not generate dashboard from the selected table(s).')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-surface border border-ink-100 rounded-card shadow-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Database size={18} className="text-brand" />
          <h3 className="text-sm font-semibold text-ink-900">Connect to MySQL</h3>
        </div>

        <form onSubmit={handleConnect} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-ink-700 mb-1.5">Host</label>
              <input required value={form.host} onChange={handleChange('host')} placeholder="localhost"
                className="w-full px-3 py-2 text-sm rounded-lg border border-ink-300 bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1.5">Port</label>
              <input required value={form.port} onChange={handleChange('port')} placeholder="3306"
                className="w-full px-3 py-2 text-sm rounded-lg border border-ink-300 bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-700 mb-1.5">Database name</label>
            <input required value={form.database} onChange={handleChange('database')} placeholder="business_db"
              className="w-full px-3 py-2 text-sm rounded-lg border border-ink-300 bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1.5">Username</label>
              <input required value={form.username} onChange={handleChange('username')} placeholder="root"
                className="w-full px-3 py-2 text-sm rounded-lg border border-ink-300 bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1.5">Password</label>
              <input required type="password" value={form.password} onChange={handleChange('password')} placeholder="••••••••"
                className="w-full px-3 py-2 text-sm rounded-lg border border-ink-300 bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
            </div>
          </div>

          {errorMsg && <p className="text-sm text-accent-rose">{errorMsg}</p>}

          <Button type="submit" loading={status === 'connecting'} className="w-full mt-1">
            {status === 'connected' ? 'Reconnect' : 'Connect'}
          </Button>
        </form>
        <p className="text-xs text-ink-500 mt-4">
          Credentials are sent directly to your backend and never stored in the browser.
        </p>
        {loadSavedForm().host && (
          <button
            type="button"
            onClick={() => { localStorage.removeItem(STORAGE_KEY); setForm(initialForm); setTables([]); setStatus('idle') }}
            className="text-xs text-accent-rose hover:underline mt-2"
          >
            Forget this connection
          </button>
        )}
      </div>

      <div className="bg-surface border border-ink-100 rounded-card shadow-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Table2 size={18} className="text-ink-700" />
          <h3 className="text-sm font-semibold text-ink-900">Tables</h3>
        </div>

        {status === 'idle' && (
          <p className="text-sm text-ink-500">Connect to a database to see available tables here.</p>
        )}
        {status === 'connecting' && (
          <div className="flex items-center gap-2 text-sm text-ink-500 py-6 justify-center">
            <Loader2 size={16} className="animate-spin" /> Connecting...
          </div>
        )}
        {status === 'connected' && tables.length === 0 && (
          <p className="text-sm text-ink-500">Connected, but no tables were found in this database.</p>
        )}
        {status === 'connected' && tables.length > 0 && (
          <>
            <div className="flex items-center gap-2 text-brand-dark mb-4 text-sm">
              <CheckCircle2 size={15} /> Connected successfully
            </div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto scrollbar-thin mb-4">
              {tables.map((t) => (
                <label key={t} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-ink-100 cursor-pointer text-sm">
                  <input type="checkbox" checked={selectedTables.includes(t)} onChange={() => toggleTable(t)}
                    className="rounded border-ink-300 text-brand focus:ring-brand/30" />
                  <span className="text-ink-900 font-mono text-xs">{t}</span>
                </label>
              ))}
            </div>
            <Button
              onClick={handleGenerateDashboard}
              disabled={selectedTables.length === 0}
              loading={generating}
              className="w-full"
            >
              Generate dashboard from {selectedTables.length || ''} table{selectedTables.length === 1 ? '' : 's'}
            </Button>
            {genError && <p className="text-sm text-accent-rose mt-2">{genError}</p>}
          </>
        )}
      </div>
    </div>

    {dashboard && (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-ink-900">Generated Dashboard</h3>
          <span className="text-xs font-medium text-brand-dark bg-brand-light px-2 py-0.5 rounded-full">
            {dashboard.dataset_type}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {dashboard.kpis.map((k) => (
            <KPICard key={k.label} label={k.label} value={k.value} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {dashboard.charts.map((c) => (
            <div key={c.title} className="bg-surface border border-ink-100 rounded-card shadow-card p-5">
              <h4 className="text-sm font-semibold text-ink-900 mb-3">{c.title}</h4>
              <ReactECharts option={c.option} style={{ height: 220 }} opts={{ renderer: 'svg' }} />
            </div>
          ))}
        </div>
      </div>
    )}
    </div>
  )
}