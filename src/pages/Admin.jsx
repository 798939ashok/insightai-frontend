import { useState, useEffect } from 'react'
import { ShieldCheck, UserX, UserCheck, Trash2, Loader2, Users, UserCog, ShieldAlert } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

const roleBadge = {
  admin: 'text-accent-violet bg-accent-violet/10',
  manager: 'text-accent-blue bg-accent-blue/10',
  employee: 'text-brand-dark bg-brand-light',
}

export default function Admin() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/admin/users')
      setUsers(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const handleSuspend = async (id) => {
    setBusyId(id)
    try {
      const { data } = await api.put(`/api/admin/users/${id}/suspend`)
      setUsers((prev) => prev.map((u) => (u.id === id ? data : u)))
    } catch (err) {
      setError(err.response?.data?.detail || 'Action failed.')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (id) => {
    setBusyId(id)
    try {
      await api.delete(`/api/admin/users/${id}`)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      setError(err.response?.data?.detail || 'Delete failed.')
    } finally {
      setBusyId(null)
    }
  }

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
        <ShieldCheck size={32} className="text-ink-300" />
        <p className="text-sm text-ink-500">Admin access required to view this page.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <p className="text-sm text-ink-500">Manage InsightAI user accounts, roles, and access.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'text-brand-dark bg-brand-light' },
          { label: 'Active', value: users.filter((u) => u.is_active).length, icon: UserCheck, color: 'text-accent-blue bg-accent-blue/10' },
          { label: 'Suspended', value: users.filter((u) => !u.is_active).length, icon: UserX, color: 'text-accent-rose bg-accent-rose/10' },
          { label: 'Admins', value: users.filter((u) => u.role === 'admin').length, icon: ShieldAlert, color: 'text-accent-violet bg-accent-violet/10' },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-ink-100 rounded-card shadow-card p-4">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
              <s.icon size={16} />
            </div>
            <p className="text-xs text-ink-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-xl font-bold text-ink-900 font-mono">{loading ? '—' : s.value}</p>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-accent-rose">{error}</p>}

      <div>
        <h3 className="text-sm font-semibold text-ink-900 mb-3">All Users</h3>
        <div className="bg-surface border border-ink-100 rounded-card shadow-card divide-y divide-ink-100">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-ink-500">
            <Loader2 size={16} className="animate-spin" /> Loading users...
          </div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink-900 truncate">
                  {u.name} {u.id === currentUser.id && <span className="text-xs text-ink-500 font-normal">(you)</span>}
                </p>
                <p className="text-xs text-ink-500 truncate">{u.email}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${roleBadge[u.role]}`}>{u.role}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${u.is_active ? 'text-brand-dark bg-brand-light' : 'text-accent-rose bg-accent-rose/10'}`}>
                  {u.is_active ? 'Active' : 'Suspended'}
                </span>
              </div>

              {u.id !== currentUser.id && (
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleSuspend(u.id)}
                    disabled={busyId === u.id}
                    className="text-xs font-medium text-ink-700 hover:text-brand flex items-center gap-1 disabled:opacity-40"
                  >
                    {u.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
                    {u.is_active ? 'Suspend' : 'Reactivate'}
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    disabled={busyId === u.id}
                    className="text-xs font-medium text-accent-rose hover:text-red-700 flex items-center gap-1 disabled:opacity-40"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  )
}