import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, CheckCircle2 } from 'lucide-react'
import Button from '../components/Button'
import api from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.post('/api/auth/forgot-password', { email })
      setSent(true)
    } catch {
      // Avoid leaking whether an account exists — show success regardless
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 size={40} className="text-brand mx-auto mb-4" />
        <h1 className="text-xl font-bold text-ink-900 mb-2">Check your inbox</h1>
        <p className="text-sm text-ink-500 mb-6">
          If an account exists for <span className="font-medium text-ink-700">{email}</span>, a reset link is on its way.
        </p>
        <Link to="/login" className="text-sm font-medium text-brand hover:text-brand-dark">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-1">Reset your password</h1>
      <p className="text-sm text-ink-500 mb-8">Enter your email and we'll send a reset link.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border bg-white
                focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors
                ${error ? 'border-accent-rose' : 'border-ink-300'}`}
            />
          </div>
          {error && <p className="text-xs text-accent-rose mt-1">{error}</p>}
        </div>

        <Button type="submit" loading={loading} className="w-full mt-2">
          Send reset link
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
