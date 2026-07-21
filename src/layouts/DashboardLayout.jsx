import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/upload/csv': 'CSV Upload',
  '/upload/excel': 'Excel Upload',
  '/database': 'Database Connection',
  '/assistant': 'AI Assistant',
  '/reports': 'Reports',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/admin': 'Admin',
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] || 'InsightAI'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
        }
            
