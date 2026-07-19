import DatasetUploadCard from '../components/DatasetUploadCard'

export default function ExcelUpload() {
  return (
    <div>
      <p className="text-sm text-ink-500 mb-6 max-w-2xl">
        Upload an Excel workbook (.xlsx). InsightAI reads the first sheet, detects the
        dataset type, and generates KPIs and charts automatically.
      </p>
      <DatasetUploadCard accept=".xlsx,.xls" extensionLabel="Excel (.xlsx)" endpoint="/api/upload/excel" fileType="excel" />
    </div>
  )
}