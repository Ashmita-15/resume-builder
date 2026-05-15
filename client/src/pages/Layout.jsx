import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import Loader from '../components/Loader'
import Login from './Login'

const Layout = () => {
  const { user, loading } = useSelector(state => state.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return <Loader />
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
