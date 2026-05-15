import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

const CallToAction = () => {
  return (
    <div id="cta" className="py-20 px-6 md:px-16 lg:px-24 xl:px-40" style={{ background: 'var(--bg-secondary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center p-10 md:p-14 rounded-2xl relative overflow-hidden"
        style={{ background: 'var(--gradient-accent)' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20" style={{ background: '#fff' }} />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-4 py-1.5 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
            <Sparkles size={12} /> Start for Free
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to accelerate your career?
          </h2>
          <p className="text-white/70 text-base mb-8 max-w-md mx-auto">
            Join thousands of professionals using AI-powered tools to build better resumes and land dream jobs.
          </p>

          <Link to="/app" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{ background: '#fff', color: 'var(--accent-primary)' }}>
            Get Started Free <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default CallToAction
