import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, UploadCloud, FileSpreadsheet, Database,
  MessageSquare, FileText, User, Settings, BarChart3, ShieldCheck,
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

export default function Sidebar() {
  const { user } = useAuth()
  return (
    <aside className="w-60 shrink-0 bg-sidebar h-screen sticky top-0 flex flex-col text-slate-300">
      {/* Logo */}
      <Link to="/" className="h-16 flex items-center gap-2 px-5 border-b border-white/5 hover:bg-sidebar-hover transition-colors">
        <div className="h-7 w-7 rounded-md bg-brand flex items-center justify-center">
          <BarChart3 size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-white tracking-tight">InsightAI</span>
      </Link>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Workspace
        </p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
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
  )
}
