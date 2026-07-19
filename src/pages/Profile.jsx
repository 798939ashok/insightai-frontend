import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import api from '../services/api'

export default function Profile() {
  const { user, login, token } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.put('/api/users/me', form)
      login(data, token) // refresh cached user info, keep the same token
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save changes.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <div className="bg-surface border border-ink-100 rounded-card shadow-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-brand text-white flex items-center justify-center text-xl font-semibold">
            {form.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-semibold text-ink-900">{form.name}</h3>
            <span className="text-xs font-medium text-brand-dark bg-brand-light px-2 py-0.5 rounded-full capitalize">
              {user?.role || 'employee'}
            </span>
          </div>
        </div>

        {error && <p className="text-sm text-accent-rose mb-4">{error}</p>}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-700 mb-1.5">Full name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-ink-300 bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-700 mb-1.5">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email"
              className="w-full px-3 py-2 text-sm rounded-lg border border-ink-300 bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading}>Save changes</Button>
            {saved && <span className="text-xs text-brand-dark font-medium">Saved</span>}
          </div>
        </form>
      </div>
    </div>
  )
}