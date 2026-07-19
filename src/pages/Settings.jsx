import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${checked ? 'bg-brand' : 'bg-ink-300'}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [emailAlerts, setEmailAlertsState] = useState(() => localStorage.getItem('insightai_email_alerts') !== 'false')
  const [autoRefresh, setAutoRefreshState] = useState(() => localStorage.getItem('insightai_auto_refresh') !== 'false')
  const setEmailAlerts = (v) => { setEmailAlertsState(v); localStorage.setItem('insightai_email_alerts', String(v)) }
  const setAutoRefresh = (v) => { setAutoRefreshState(v); localStorage.setItem('insightai_auto_refresh', String(v)) }
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('insightai_dark_mode') === 'true')
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const toggleDarkMode = (value) => {
    setDarkMode(value)
    document.documentElement.classList.toggle('dark', value)
    localStorage.setItem('insightai_dark_mode', String(value))
  }

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    try {
      await api.delete('/api/users/me')
      logout()
      navigate('/')
    } catch {
      setDeleting(false)
    }
  }

  const rows = [
    { label: 'Email alerts', desc: 'Get notified when a scheduled report finishes.', state: emailAlerts, set: setEmailAlerts },
    { label: 'Auto-refresh dashboards', desc: 'Live-connected dashboards refresh every 5 minutes.', state: autoRefresh, set: setAutoRefresh },
    { label: 'Dark mode', desc: 'Switch the interface to a dark theme.', state: darkMode, set: toggleDarkMode },
  ]

  return (
    <div className="max-w-lg space-y-6">
      <div className="bg-surface border border-ink-100 rounded-card shadow-card divide-y divide-ink-100">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-ink-900">{r.label}</p>
              <p className="text-xs text-ink-500 mt-0.5">{r.desc}</p>
            </div>
            <Toggle checked={r.state} onChange={r.set} />
          </div>
        ))}
      </div>

      <div className="bg-surface border border-ink-100 rounded-card shadow-card p-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-1">Session</h3>
        <p className="text-xs text-ink-500 mb-4">Sign out of InsightAI on this device.</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => { logout(); navigate('/') }}
        >
          Log out
        </Button>
      </div>

      <div className="bg-surface border border-ink-100 rounded-card shadow-card p-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-1">Danger zone</h3>
        <p className="text-xs text-ink-500 mb-4">Permanently delete your account and all associated data.</p>
        <Button variant="danger" size="sm" loading={deleting} onClick={handleDeleteAccount}>
          {confirmDelete ? 'Click again to confirm' : 'Delete account'}
        </Button>
      </div>
    </div>
  )
}