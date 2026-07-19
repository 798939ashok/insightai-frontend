import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, CheckCircle2 } from 'lucide-react'
import Button from '../components/Button'
import api from '../services/api'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Use at least 8 characters'
    if (form.confirmPassword !== form.password) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    if (!token) {
      setApiError('This reset link is missing its token. Please request a new one.')
      return
    }
    if (!validate()) return

    setLoading(true)
    try {
      await api.post('/api/auth/reset-password', { token, ...form })
      setDone(true)
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Could not reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 size={40} className="text-brand mx-auto mb-4" />
        <h1 className="text-xl font-bold text-ink-900 mb-2">Password updated</h1>
        <p className="text-sm text-ink-500 mb-6">You can now sign in with your new password.</p>
        <Button onClick={() => navigate('/login')} className="w-full">Sign in</Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-1">Set a new password</h1>
      <p className="text-sm text-ink-500 mb-8">Choose a new password for your account.</p>

      {apiError && (
        <div className="mb-5 px-3 py-2.5 rounded-lg bg-accent-rose/10 border border-accent-rose/20 text-sm text-accent-rose">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">New password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border bg-surface
                focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors
                ${errors.password ? 'border-accent-rose' : 'border-ink-300'}`}
            />
          </div>
          {errors.password && <p className="text-xs text-accent-rose mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">Confirm password</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="••••••••"
            className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-surface
              focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors
              ${errors.confirmPassword ? 'border-accent-rose' : 'border-ink-300'}`}
          />
          {errors.confirmPassword && <p className="text-xs text-accent-rose mt-1">{errors.confirmPassword}</p>}
        </div>

        <Button type="submit" loading={loading} className="w-full mt-2">
          Reset password
        </Button>
      </form>

      <p className="text-sm text-ink-500 text-center mt-8">
        <Link to="/login" className="font-medium text-brand hover:text-brand-dark">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
