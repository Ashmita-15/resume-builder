import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FileText, ArrowRight, X, Menu, ScanSearch, Target, Sparkles } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const Hero = () => {
  const { user } = useSelector(state => state.auth)
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="min-h-screen pb-20 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        {/* Background orbs */}
        <div className="absolute top-32 left-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-[120px] opacity-20" style={{ background: 'var(--accent-primary)' }} />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full blur-[100px] opacity-10" style={{ background: 'var(--accent-lighter)' }} />

        {/* Navbar */}
        <nav className="relative z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
              <FileText size={18} color="#fff" />
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>ResumeAI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <a href="#" className="hover:opacity-80 transition">Home</a>
            <a href="#features" className="hover:opacity-80 transition">Features</a>
            <a href="#testimonials" className="hover:opacity-80 transition">Testimonials</a>
            <a href="#cta" className="hover:opacity-80 transition">Contact</a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <>
                <Link to="/app?state=login" className="btn-ghost text-sm">Sign in</Link>
                <Link to="/app?state=register" className="btn-primary text-sm flex items-center gap-1">
                  Get Started <ArrowRight size={14} />
                </Link>
              </>
            ) : (
              <Link to="/app" className="btn-primary text-sm">Dashboard</Link>
            )}
          </div>

          <button onClick={() => setMenuOpen(true)} className="md:hidden p-2" style={{ color: 'var(--text-primary)' }}>
            <Menu size={22} />
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 text-lg"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
          >
            <a href="#" className="text-white">Home</a>
            <a href="#features" className="text-white">Features</a>
            <a href="#testimonials" className="text-white">Testimonials</a>
            <Link to="/app" className="text-white">Get Started</Link>
            <button onClick={() => setMenuOpen(false)} className="mt-4 p-2.5 rounded-lg bg-white/10 text-white">
              <X size={20} />
            </button>
          </motion.div>
        )}

        {/* Hero Content */}
        <div className="relative flex flex-col items-center text-center px-6 md:px-16 lg:px-24 xl:px-40 mt-20 md:mt-28">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs font-medium px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'var(--accent-subtle)', color: 'var(--accent-light)', border: '1px solid var(--border-accent)' }}
          >
            <Sparkles size={12} /> AI-Powered Career Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            Build resumes that <span className="text-gradient">beat the ATS</span> and land interviews
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl text-base md:text-lg mt-6 mb-8"
            style={{ color: 'var(--text-secondary)' }}
          >
            Create AI-optimized resumes, analyze ATS compatibility scores, and match your profile to job descriptions — all in one platform.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <Link to="/app" className="btn-primary flex items-center gap-2 px-8 py-3 text-base">
              Start Building <ArrowRight size={16} />
            </Link>
            <a href="#features" className="btn-secondary px-6 py-3 text-base">
              Learn More
            </a>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mt-14"
          >
            {[
              { icon: FileText, label: 'Resume Builder' },
              { icon: ScanSearch, label: 'ATS Analyzer' },
              { icon: Target, label: 'Job Matching' },
              { icon: Sparkles, label: 'AI Suggestions' },
            ].map((item, i) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
              >
                <item.icon size={14} style={{ color: 'var(--accent-light)' }} />
                {item.label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Hero
