import DatasetUploadCard from '../components/DatasetUploadCard'

export default function CSVUpload() {
  return (
    <div>
      <p className="text-sm text-ink-500 mb-6 max-w-2xl">
        Upload a CSV file. InsightAI detects the dataset type (Sales, HR, Finance, Inventory...)
        and generates KPIs and charts automatically.
      </p>
      <DatasetUploadCard accept=".csv" extensionLabel="CSV" endpoint="/api/upload/csv" fileType="csv" />
    </div>
  )
}