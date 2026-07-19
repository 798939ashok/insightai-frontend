import { Outlet, Link } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left: form panel */}
      <div className="w-full lg:w-[440px] flex flex-col justify-center px-8 sm:px-12 py-12 bg-surface">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="h-8 w-8 rounded-md bg-brand flex items-center justify-center">
            <BarChart3 size={17} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-ink-900 text-lg tracking-tight">InsightAI</span>
        </Link>
        <Outlet />
      </div>

      {/* Right: brand panel with data-viz motif, hidden on mobile */}
      <div className="hidden lg:flex flex-1 bg-sidebar relative overflow-hidden items-center justify-center p-16">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative z-10 max-w-md">
          <p className="text-brand text-sm font-mono font-medium tracking-wide mb-3">// LIVE INSIGHTS</p>
          <h2 className="text-white text-3xl font-bold leading-tight mb-4">
            Every dataset has a story. Ask it questions.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Upload a spreadsheet or connect your database — InsightAI builds the dashboard
            and answers your business questions in plain language.
          </p>
        </div>
      </div>
    </div>
  )
}