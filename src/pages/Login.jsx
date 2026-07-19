import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    if (!validate()) return

    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/login', form)
      login(data.user, data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-1">Welcome back</h1>
      <p className="text-sm text-ink-500 mb-8">Sign in to continue to your workspace.</p>

      {apiError && (
        <div className="mb-5 px-3 py-2.5 rounded-lg bg-accent-rose/10 border border-accent-rose/20 text-sm text-accent-rose">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@company.com"
              className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border bg-surface
                focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors
                ${errors.email ? 'border-accent-rose' : 'border-ink-300'}`}
            />
          </div>
          {errors.email && <p className="text-xs text-accent-rose mt-1">{errors.email}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-ink-700">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-brand hover:text-brand-dark">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className={`w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border bg-surface
                focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors
                ${errors.password ? 'border-accent-rose' : 'border-ink-300'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-accent-rose mt-1">{errors.password}</p>}
        </div>

        <Button type="submit" loading={loading} className="w-full mt-2">
          Sign in
        </Button>
      </form>

      <p className="text-sm text-ink-500 text-center mt-8">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-brand hover:text-brand-dark">
          Create one
        </Link>
      </p>
    </div>
  )
}