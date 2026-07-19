import { Link } from 'react-router-dom'
import { BarChart3, ArrowRight, UploadCloud, Database, MessageSquare, Check } from 'lucide-react'
import ReactECharts from 'echarts-for-react'

const demoChartOption = {
  grid: { top: 20, right: 12, bottom: 24, left: 36 },
  xAxis: {
    type: 'category',
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    axisLine: { lineStyle: { color: '#CBD5E1' } },
    axisLabel: { color: '#64748B', fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#F1F5F9' } },
    axisLabel: { color: '#64748B', fontSize: 11 },
  },
  series: [
    {
      data: [42, 58, 51, 67, 74, 89],
      type: 'bar',
      barWidth: '48%',
      itemStyle: { color: '#0D9488', borderRadius: [4, 4, 0, 0] },
    },
  ],
  tooltip: { trigger: 'axis' },
}

const steps = [
  { icon: UploadCloud, title: 'Upload or connect', desc: 'CSV, Excel, or a live MySQL database — InsightAI reads the schema automatically.' },
  { icon: BarChart3, title: 'Auto-generated dashboard', desc: 'KPIs, trends, and category breakdowns appear in seconds, no configuration needed.' },
  { icon: MessageSquare, title: 'Ask in plain language', desc: '"Which product had the highest sales in May?" — get an answer grounded in your data.' },
]

export default function Landing() {
  return (
    <div className="bg-canvas min-h-screen">
      {/* Nav */}
      <nav className="h-16 flex items-center justify-between px-6 sm:px-10 border-b border-ink-100 bg-surface/80 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-brand flex items-center justify-center">
            <BarChart3 size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-ink-900 tracking-tight">InsightAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-ink-700 hover:text-ink-900 px-3 py-2">
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium text-white bg-brand hover:bg-brand-dark px-4 py-2 rounded-lg transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero: thesis = a real question turning into a real chart, live */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-brand-dark bg-brand-light px-2.5 py-1 rounded-full mb-5">
            AI-POWERED BUSINESS INTELLIGENCE
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-ink-900 leading-[1.1] tracking-tight mb-5">
            Your spreadsheets, <br /> asked and answered.
          </h1>
          <p className="text-base text-ink-500 leading-relaxed mb-8 max-w-md">
            Upload a CSV, connect a database, or drop in an Excel file. InsightAI builds
            the dashboard and lets you interrogate your own data in plain language —
            grounded in real numbers, never invented.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-brand hover:bg-brand-dark px-5 py-3 rounded-lg transition-colors"
            >
              Start free <ArrowRight size={15} />
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-ink-700 hover:text-ink-900 px-5 py-3 rounded-lg border border-ink-300 hover:bg-ink-100 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Live demo card: query -> chart, the actual product thesis */}
        <div className="bg-surface border border-ink-100 rounded-card shadow-popover p-5">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-ink-100">
            <div className="h-7 w-7 rounded-full bg-brand-light flex items-center justify-center">
              <MessageSquare size={13} className="text-brand-dark" />
            </div>
            <p className="text-sm text-ink-700 font-mono">"Show monthly sales trend"</p>
          </div>
          <ReactECharts option={demoChartOption} style={{ height: 200 }} opts={{ renderer: 'svg' }} />
          <p className="text-xs text-ink-500 mt-3 font-mono">
            Revenue climbed 32% from Jan to Jun, led by a strong May–Jun push.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16 border-t border-ink-100">
        <h2 className="text-2xl font-bold text-ink-900 mb-2">Three steps to insight</h2>
        <p className="text-sm text-ink-500 mb-10">No pipelines to configure. No queries to write.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="bg-surface border border-ink-100 rounded-card p-5 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-brand-light flex items-center justify-center">
                  <Icon size={16} className="text-brand-dark" />
                </div>
                <span className="text-xs font-mono text-ink-500">0{i + 1}</span>
              </div>
              <h3 className="font-semibold text-ink-900 mb-1.5">{title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16 border-t border-ink-100">
        <div className="grid sm:grid-cols-3 gap-6 text-sm text-ink-700">
          {['Answers grounded only in your uploaded data', 'JWT-secured, role-based access', 'Export to PDF and Excel in one click'].map((t) => (
            <div key={t} className="flex items-start gap-2">
              <Check size={16} className="text-brand mt-0.5 shrink-0" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink-100 py-8 text-center text-xs text-ink-500">
        © 2026 InsightAI — Final Year Project
      </footer>
    </div>
  )
}