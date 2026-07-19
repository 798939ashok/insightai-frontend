import { Outlet, Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, ArrowLeft, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-canvas">
      <header className="h-16 bg-sidebar flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-accent-violet flex items-center justify-center">
            <ShieldCheck size={17} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-semibold text-white text-sm leading-tight">InsightAI Admin</p>
            <p className="text-xs text-slate-400 leading-tight">Signed in as {user?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-sidebar-hover transition-colors"
          >
            <ArrowLeft size={15} /> Back to workspace
          </Link>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-sidebar-hover transition-colors"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
