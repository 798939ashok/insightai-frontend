import { useState } from 'react'
import { Search, Bell, ChevronDown, ShieldCheck, Menu } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const SEARCH_ROUTES = [
  { keywords: ['dashboard', 'kpi', 'chart', 'revenue'], path: '/dashboard' },
  { keywords: ['csv', 'upload csv'], path: '/upload/csv' },
  { keywords: ['excel', 'xlsx'], path: '/upload/excel' },
  { keywords: ['database', 'mysql', 'sql'], path: '/database' },
  { keywords: ['assistant', 'ai', 'chat', 'ask'], path: '/assistant' },
  { keywords: ['report', 'pdf', 'export'], path: '/reports' },
  { keywords: ['profile', 'account'], path: '/profile' },
  { keywords: ['settings', 'dark mode', 'preferences'], path: '/settings' },
]

const NOTIFICATIONS = [
  { id: 1, text: 'Welcome to InsightAI — upload a dataset to get started.' },
]

export default function Topbar({ title, onMenuClick = () => {} }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchHint, setSearchHint] = useState('')

  const handleSearch = (e) => {
    if (e.key !== 'Enter' || !query.trim()) return
    const q = query.toLowerCase()
    const match = SEARCH_ROUTES.find((r) => r.keywords.some((kw) => q.includes(kw)))
    if (match) {
      navigate(match.path)
      setQuery('')
      setSearchHint('')
    } else {
      setSearchHint('No matching page — try "dashboard", "reports", "AI assistant"...')
      setTimeout(() => setSearchHint(''), 2500)
    }
  }

  return (
    <header className="h-16 bg-surface border-b border-ink-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-ink-100 transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-ink-700" />
        </button>
        <h1 className="text-lg font-semibold text-ink-900 truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search: dashboard, reports, AI assistant..."
            className="w-64 pl-9 pr-3 py-1.5 text-sm bg-ink-100 rounded-lg border border-transparent
              focus:bg-surface focus:border-brand focus:outline-none transition-colors"
          />
          {searchHint && (
            <p className="absolute top-full mt-1 left-0 text-xs text-accent-rose bg-surface border border-ink-100 rounded-lg px-2 py-1 shadow-popover whitespace-nowrap">
              {searchHint}
            </p>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-2 rounded-lg hover:bg-ink-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-ink-700" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent-rose" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-surface border border-ink-100 rounded-card shadow-popover z-20 py-2">
              <p className="px-3 pb-2 text-xs font-semibold text-ink-500 uppercase tracking-wide border-b border-ink-100">
                Notifications
              </p>
              {NOTIFICATIONS.map((n) => (
                <p key={n.id} className="px-3 py-2.5 text-sm text-ink-700 hover:bg-ink-100">{n.text}</p>
              ))}
            </div>
          )}
        </div>

        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs font-medium text-accent-violet bg-accent-violet/10 hover:bg-accent-violet/20 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <ShieldCheck size={13} /> Admin panel
          </Link>
        )}

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-ink-100 transition-colors">
          <div className="h-8 w-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm font-medium text-ink-900 hidden md:block">{user?.name || 'User'}</span>
          <ChevronDown size={14} className="text-ink-500 hidden md:block" />
        </button>
      </div>
    </header>
  )
}
