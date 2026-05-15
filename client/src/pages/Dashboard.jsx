import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, ScanSearch, Target, Sparkles, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import api from '../configs/api'
import StatsCard from '../components/dashboard/StatsCard'
import QuickActions from '../components/dashboard/QuickActions'
import ActivityTimeline from '../components/dashboard/ActivityTimeline'

const Dashboard = () => {
  const { user, token } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const [stats, setStats] = useState({ resumes: 0, avgAts: 0, bestMatch: 0, suggestions: 0 })
  const [recentResumes, setRecentResumes] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  const loadDashboardData = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })
      const resumes = data.resumes || []
      setRecentResumes(resumes.slice(-4).reverse())
      setStats(prev => ({ ...prev, resumes: resumes.length }))

      // Build activities from resumes
      const acts = resumes.slice(-6).reverse().map(r => ({
        type: 'edit',
        title: `Updated "${r.title}"`,
        time: new Date(r.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      }))
      setActivities(acts)

      // Try loading dashboard stats
      try {
        const statsRes = await api.get('/api/dashboard/stats', { headers: { Authorization: token } })
        if (statsRes.data) {
          setStats(prev => ({
            ...prev,
            avgAts: statsRes.data.avgAtsScore || 0,
            bestMatch: statsRes.data.bestMatchScore || 0,
            suggestions: statsRes.data.suggestionsCount || 0,
          }))
        }
      } catch {
        // Dashboard stats endpoint may not exist yet
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const formatGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          {formatGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Here's what's happening with your career tools today.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={FileText} label="Total Resumes" value={stats.resumes} color="var(--accent-primary)" />
        <StatsCard icon={ScanSearch} label="Avg ATS Score" value={stats.avgAts ? `${stats.avgAts}%` : '—'} trend={stats.avgAts ? 12 : undefined} trendUp={true} color="var(--warning)" />
        <StatsCard icon={Target} label="Best Match" value={stats.bestMatch ? `${stats.bestMatch}%` : '—'} color="var(--success)" />
        <StatsCard icon={Sparkles} label="AI Suggestions" value={stats.suggestions || '—'} color="var(--info)" />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          <TrendingUp size={14} /> Quick Actions
        </h3>
        <QuickActions />
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Resumes */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <FileText size={14} /> Recent Resumes
            </h3>
            <button
              onClick={() => navigate('/app/resumes')}
              className="text-xs font-medium flex items-center gap-1 transition-colors"
              style={{ color: 'var(--accent-light)' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 rounded-lg animate-shimmer" />
              ))}
            </div>
          ) : recentResumes.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={40} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No resumes yet. Create your first one!</p>
              <button
                onClick={() => navigate('/app/resumes')}
                className="btn-primary mt-4 text-sm"
              >
                Create Resume
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentResumes.map((resume, index) => (
                <motion.button
                  key={resume._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/app/builder/${resume._id}`)}
                  className="w-full flex items-center gap-4 p-3 rounded-lg transition-all text-left"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--accent-subtle)', color: 'var(--accent-light)' }}
                  >
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{resume.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      Updated {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="badge badge-accent text-xs">{resume.template}</span>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <Clock size={14} /> Recent Activity
          </h3>
          <ActivityTimeline activities={activities} />
        </div>
      </div>

      {/* AI Insights Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6 relative overflow-hidden"
        style={{ background: 'var(--gradient-accent)' }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: 'var(--accent-lighter)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} color="#fff" />
            <h3 className="text-white font-semibold text-sm">AI Career Insights</h3>
          </div>
          <p className="text-white/80 text-sm max-w-xl">
            Run an ATS analysis on your resume to get personalized improvement suggestions, or match it against a job description to see how well you fit.
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate('/app/ats-analyzer')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              Run ATS Check
            </button>
            <button
              onClick={() => navigate('/app/job-match')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              Match Job
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
