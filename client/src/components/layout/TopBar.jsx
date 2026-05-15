import { Menu, Bell, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const routeTitles = {
  '/app': 'Dashboard',
  '/app/resumes': 'My Resumes',
  '/app/ats-analyzer': 'ATS Analyzer',
  '/app/job-match': 'Job Match',
  '/app/settings': 'Settings',
}

const TopBar = ({ onMenuClick }) => {
  const location = useLocation()
  const { user } = useSelector(state => state.auth)

  const getTitle = () => {
    if (location.pathname.includes('/app/builder/')) return 'Resume Builder'
    return routeTitles[location.pathname] || 'Dashboard'
  }

  return (
    <header
      className="sticky top-0 z-20 border-b backdrop-blur-xl"
      style={{
        borderColor: 'var(--border-primary)',
        background: 'var(--glass-bg)',
      }}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {getTitle()}
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
            <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search..."
              className="w-40 text-sm bg-transparent border-none outline-none focus:ring-0 p-0"
              style={{ color: 'var(--text-primary)', background: 'transparent' }}
            />
          </div>

          {/* Notifications */}
          <button
            className="p-2 rounded-lg relative transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--accent-light)' }} />
          </button>

          {/* User avatar - mobile */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold lg:hidden"
            style={{ background: 'var(--gradient-accent)', color: '#fff' }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar
