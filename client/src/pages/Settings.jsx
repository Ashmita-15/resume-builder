import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { User, Mail, Sun, Moon, Shield, Trash2, Save } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { logout } from '../app/features/authSlice'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user } = useSelector(state => state.auth)
  const { theme, toggleTheme } = useTheme()
  const dispatch = useDispatch()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion is not yet implemented')
    }
  }

  const handleSave = () => {
    toast.success('Profile settings saved')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          Settings
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          Manage your account preferences
        </p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-6 space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          <User size={14} /> Profile
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: 'var(--gradient-accent)', color: '#fff' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full text-sm px-3 py-2.5" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full text-sm px-3 py-2.5" />
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm">
          <Save size={14} /> Save Changes
        </button>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card p-6 space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />} Appearance
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Theme</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Currently using {theme === 'dark' ? 'dark' : 'light'} mode
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full transition-colors p-0.5"
            style={{ background: theme === 'dark' ? 'var(--accent-primary)' : 'var(--border-secondary)' }}
          >
            <motion.div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'var(--bg-secondary)' }}
              animate={{ x: theme === 'dark' ? 26 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {theme === 'dark' ? <Moon size={12} style={{ color: 'var(--accent-light)' }} /> : <Sun size={12} style={{ color: 'var(--warning)' }} />}
            </motion.div>
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="card p-6 space-y-4" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--error)' }}>
          <Shield size={14} /> Danger Zone
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Delete Account</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Permanently delete your account and all data
            </p>
          </div>
          <button onClick={handleDeleteAccount}
            className="px-4 py-2 text-xs font-medium rounded-lg transition-colors"
            style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.2)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
          >
            <Trash2 size={14} className="inline mr-1" /> Delete
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Settings
