import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, FileText, X, CheckCircle2, Loader2, Database } from 'lucide-react'
import Button from './Button'
import api from '../services/api'

/**
 * Shared upload widget for CSV and Excel flows.
 * Handles drag-and-drop, validation, upload, and dataset-type detection display.
 */
export default function DatasetUploadCard({ accept, extensionLabel, endpoint, fileType }) {
  const navigate = useNavigate()
  const [existingDataset, setExistingDataset] = useState(null)

  useEffect(() => {
    // Show a reminder of the last uploaded dataset of THIS type, since this
    // widget's own upload state resets every time the page is (re)visited.
    api.get('/api/upload/latest', { params: { file_type: fileType } })
      .then(({ data }) => setExistingDataset(data))
      .catch(() => setExistingDataset(null))
  }, [fileType])
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [detected, setDetected] = useState(null)
  const inputRef = useRef(null)

  const validateAndSetFile = (f) => {
    if (!f) return
    const validExt = accept.split(',').some((ext) => f.name.toLowerCase().endsWith(ext.trim()))
    if (!validExt) {
      setErrorMsg(`Please upload a ${extensionLabel} file.`)
      return
    }
    setErrorMsg('')
    setFile(f)
    setStatus('idle')
    setDetected(null)
  }

  const handleUpload = async () => {
    if (!file) return
    setStatus('uploading')
    const formData = new FormData()
    formData.append('file', file)
    try {
      setStatus('analyzing')
      const { data } = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setDetected(data)
      setExistingDataset(data)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.response?.data?.detail || 'Upload failed. Please try again.')
    }
  }

  return (
    <div className="max-w-2xl">
      {existingDataset && !file && (
        <div className="flex items-center justify-between bg-brand-light/40 border border-brand/20 rounded-card px-4 py-3 mb-4">
          <div className="flex items-center gap-2.5 text-sm">
            <Database size={15} className="text-brand-dark shrink-0" />
            <span className="text-ink-700">
              Last dataset: <span className="font-medium text-ink-900">{existingDataset.filename}</span>
              {' '}({existingDataset.dataset_type})
            </span>
          </div>
          <button
            onClick={() => navigate('/dashboard', { state: { datasetId: existingDataset.dataset_id } })}
            className="text-xs font-medium text-brand hover:text-brand-dark shrink-0"
          >
            View dashboard →
          </button>
        </div>
      )}
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); validateAndSetFile(e.dataTransfer.files?.[0]) }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-card p-12 text-center cursor-pointer transition-colors
            ${dragOver ? 'border-brand bg-brand-light/30' : 'border-ink-300 bg-surface hover:border-brand/50'}`}
        >
          <UploadCloud size={32} className="mx-auto text-ink-500 mb-3" />
          <p className="text-sm font-medium text-ink-900 mb-1">Drag and drop your {extensionLabel} file here</p>
          <p className="text-xs text-ink-500 mb-4">or click to browse — max 25MB</p>
          <input ref={inputRef} type="file" accept={accept} className="hidden"
            onChange={(e) => validateAndSetFile(e.target.files?.[0])} />
        </div>
      ) : (
        <div className="bg-surface border border-ink-100 rounded-card shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-brand-light flex items-center justify-center">
                <FileText size={18} className="text-brand-dark" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-900">{file.name}</p>
                <p className="text-xs text-ink-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            {status === 'idle' && (
              <button onClick={() => setFile(null)} className="p-1.5 rounded-lg hover:bg-ink-100" aria-label="Remove file">
                <X size={16} className="text-ink-500" />
              </button>
            )}
          </div>

          {status === 'idle' && <Button onClick={handleUpload} className="w-full">Analyze dataset</Button>}

          {(status === 'uploading' || status === 'analyzing') && (
            <div className="flex items-center justify-center gap-2 py-3 text-sm text-ink-500">
              <Loader2 size={16} className="animate-spin" />
              {status === 'uploading' ? 'Uploading...' : 'Detecting dataset type and generating dashboard...'}
            </div>
          )}

          {status === 'done' && detected && (
            <div className="mt-2 pt-4 border-t border-ink-100">
              <div className="flex items-center gap-2 text-brand-dark mb-3">
                <CheckCircle2 size={16} />
                <span className="text-sm font-medium">Detected as {detected.dataset_type} dataset</span>
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/dashboard', { state: { datasetId: detected.dataset_id } })}
              >
                View dashboard
              </Button>
            </div>
          )}
        </div>
      )}

      {errorMsg && <p className="text-sm text-accent-rose mt-3">{errorMsg}</p>}
    </div>
  )
}