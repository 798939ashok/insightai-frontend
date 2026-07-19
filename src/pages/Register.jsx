import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import Button from '../components/Button'
import api from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Use at least 8 characters'
    if (form.confirmPassword !== form.password) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    if (!validate()) return

    setLoading(true)
    try {
      await api.post('/api/auth/register', form)
      navigate('/login')
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Could not create account. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-1">Create your account</h1>
      <p className="text-sm text-ink-500 mb-8">Start turning your data into decisions.</p>

      {apiError && (
        <div className="mb-5 px-3 py-2.5 rounded-lg bg-accent-rose/10 border border-accent-rose/20 text-sm text-accent-rose">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">Full name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="your name"
              className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border bg-surface
                focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors
                ${errors.name ? 'border-accent-rose' : 'border-ink-300'}`}
            />
          </div>
          {errors.name && <p className="text-xs text-accent-rose mt-1">{errors.name}</p>}
        </div>

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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
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
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Confirm</label>
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
        </div>

        <Button type="submit" loading={loading} className="w-full mt-2">
          Create account
        </Button>
      </form>

      <p className="text-sm text-ink-500 text-center mt-8">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand hover:text-brand-dark">
          Sign in
        </Link>
      </p>
    </div>
  )
}