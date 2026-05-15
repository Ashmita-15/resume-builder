import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, User2Icon, ArrowRight, Sparkles, FileText, ScanSearch, Target } from 'lucide-react'
import api from '../configs/api'
import { login } from '../app/features/authSlice'
import toast from 'react-hot-toast'
import { useTheme } from '../context/ThemeContext'

const Login = () => {
  const dispatch = useDispatch()
  const { theme } = useTheme()

  const query = new URLSearchParams(window.location.search)
  const urlState = query.get('state')

  const [state, setState] = useState(urlState || 'login')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    try {
      setLoading(true)
      const { data } = await api.post(`/api/users/${state}`, formData)
      if (data.success) {
        dispatch(login(data))
        localStorage.setItem('token', data.token)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const features = [
    { icon: FileText, label: 'AI Resume Builder', desc: 'Create professional resumes in minutes' },
    { icon: ScanSearch, label: 'ATS Score Analyzer', desc: 'Check compatibility with tracking systems' },
    { icon: Target, label: 'Job Match Analysis', desc: 'See how well you fit any job opening' },
  ]

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12" style={{ background: 'var(--gradient-accent)' }}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ background: '#fff' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-[100px] opacity-10" style={{ background: '#fff' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
              <FileText size={20} color="#fff" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>ResumeAI</span>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Land your dream job with AI-powered career tools
          </h1>
          <p className="text-white/70 text-lg mb-10 max-w-md">
            Build professional resumes, analyze ATS compatibility, and match your profile to job descriptions.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20 shrink-0">
                  <feature.icon size={18} color="#fff" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{feature.label}</p>
                  <p className="text-white/60 text-xs">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs">© 2024 ResumeAI. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
              <FileText size={18} color="#fff" />
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>ResumeAI</span>
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            {state === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-tertiary)' }}>
            {state === 'login' ? 'Sign in to continue to your dashboard' : 'Get started with your free account'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {state !== 'login' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                  <div className="flex items-center gap-2 rounded-lg px-3" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-primary)' }}>
                    <User2Icon size={15} style={{ color: 'var(--text-tertiary)' }} />
                    <input type="text" name="name" placeholder="John Doe" className="flex-1 py-2.5 text-sm bg-transparent border-none focus:ring-0 p-0" style={{ background: 'transparent' }}
                      value={formData.name} onChange={handleChange} required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <div className="flex items-center gap-2 rounded-lg px-3" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-primary)' }}>
                <Mail size={15} style={{ color: 'var(--text-tertiary)' }} />
                <input type="email" name="email" placeholder="you@example.com" className="flex-1 py-2.5 text-sm bg-transparent border-none focus:ring-0 p-0" style={{ background: 'transparent' }}
                  value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="flex items-center gap-2 rounded-lg px-3" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-primary)' }}>
                <Lock size={15} style={{ color: 'var(--text-tertiary)' }} />
                <input type="password" name="password" placeholder="••••••••" className="flex-1 py-2.5 text-sm bg-transparent border-none focus:ring-0 p-0" style={{ background: 'transparent' }}
                  value={formData.password} onChange={handleChange} required />
              </div>
            </div>

            {state === 'login' && (
              <div className="text-right">
                <button type="button" className="text-xs font-medium" style={{ color: 'var(--accent-light)' }}>
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
            >
              {loading ? 'Please wait...' : state === 'login' ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-tertiary)' }}>
            {state === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => setState(prev => prev === 'login' ? 'register' : 'login')}
              className="ml-1 font-medium"
              style={{ color: 'var(--accent-light)' }}
            >
              {state === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login