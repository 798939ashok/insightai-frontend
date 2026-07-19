import { useState } from 'react'
import { FileText, FileSpreadsheet, Image, Download, Loader2 } from 'lucide-react'
import Button from '../components/Button'
import api from '../services/api'

const reportTypes = [
  { icon: FileText, label: 'PDF Report', desc: 'Full dashboard with KPIs and charts, formatted for sharing.', format: 'pdf' },
  { icon: FileSpreadsheet, label: 'Excel Export', desc: 'Raw and aggregated data tables in .xlsx format.', format: 'excel' },
]

export default function Reports() {
  const [loadingFormat, setLoadingFormat] = useState(null)
  const [error, setError] = useState('')

  const handleExport = async (format) => {
    setError('')
    setLoadingFormat(format)
    try {
      // Reports are generated from the most recently uploaded dataset.
      const { data: latest } = await api.get('/api/upload/latest')
      const response = await api.get(`/api/reports/${latest.dataset_id}/${format}`, { responseType: 'blob' })

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = format === 'pdf' ? 'InsightAI_Report.pdf' : 'InsightAI_Export.xlsx'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      setError(
        err.response?.status === 404
          ? 'Upload a CSV or Excel file first — reports are generated from your latest dataset.'
          : 'Export failed. Please try again.'
      )
    } finally {
      setLoadingFormat(null)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h3 className="text-sm font-semibold text-ink-900 mb-4">Generate a new report</h3>
        {error && <p className="text-sm text-accent-rose mb-4">{error}</p>}
        <div className="grid sm:grid-cols-2 gap-4">
          {reportTypes.map(({ icon: Icon, label, desc, format }) => (
            <div key={format} className="bg-surface border border-ink-100 rounded-card shadow-card p-5 flex flex-col">
              <div className="h-9 w-9 rounded-lg bg-brand-light flex items-center justify-center mb-3">
                <Icon size={17} className="text-brand-dark" />
              </div>
              <h4 className="text-sm font-semibold text-ink-900 mb-1">{label}</h4>
              <p className="text-xs text-ink-500 leading-relaxed mb-4 flex-1">{desc}</p>
              <Button
                variant="secondary"
                size="sm"
                icon={loadingFormat === format ? undefined : Download}
                loading={loadingFormat === format}
                onClick={() => handleExport(format)}
              >
                Export
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}