import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, UploadCloud, FileSpreadsheet, Database,
  MessageSquare, FileText, User, Settings, BarChart3, ShieldCheck, X,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload/csv', label: 'CSV Upload', icon: UploadCloud },
  { to: '/upload/excel', label: 'Excel Upload', icon: FileSpreadsheet },
  { to: '/database', label: 'Database', icon: Database },
  { to: '/assistant', label: 'AI Assistant', icon: MessageSquare },
  { to: '/reports', label: 'Reports', icon: FileText },
]

const bottomItems = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open = false, onClose = () => {} }) {
  const { user } = useAuth()

  return (
    <>
      {/* Mobile overlay — click to close the drawer */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          w-60 shrink-0 bg-sidebar h-screen flex flex-col text-slate-300
          fixed md:sticky top-0 left-0 z-40 md:z-0
          transition-transform duration-200 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between gap-2 px-5 border-b border-white/5">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            onClick={onClose}
          >
            <div className="h-7 w-7 rounded-md bg-brand flex items-center justify-center">
              <BarChart3 size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-white tracking-tight">InsightAI</span>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg hover:bg-sidebar-hover text-slate-400"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Workspace
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-active text-white'
                    : 'text-slate-400 hover:bg-sidebar-hover hover:text-slate-200'
                }`
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="px-3 py-4 border-t border-white/5 space-y-0.5">
          {bottomItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-active text-white'
                    : 'text-slate-400 hover:bg-sidebar-hover hover:text-slate-200'
                }`
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  )
}
