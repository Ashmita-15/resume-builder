import { motion } from 'framer-motion'
import { FileText, ScanSearch, Target, Sparkles, Zap, Shield } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'AI Resume Builder',
    description: 'Create professional, ATS-optimized resumes with intelligent content suggestions and multiple premium templates.',
    color: 'var(--accent-primary)',
  },
  {
    icon: ScanSearch,
    title: 'ATS Score Analyzer',
    description: 'Get detailed ATS compatibility scores, keyword analysis, formatting checks, and actionable improvement suggestions.',
    color: 'var(--warning)',
  },
  {
    icon: Target,
    title: 'Job Match Analysis',
    description: 'Compare your resume against any job description to see match percentage, missing skills, and role compatibility.',
    color: 'var(--success)',
  },
  {
    icon: Sparkles,
    title: 'AI Content Enhancement',
    description: 'Enhance your professional summary, job descriptions, and skills with AI-powered writing assistance.',
    color: 'var(--info)',
  },
  {
    icon: Zap,
    title: 'Real-Time Preview',
    description: 'See changes instantly with live resume preview. Export to PDF with professional formatting.',
    color: 'var(--accent-lighter)',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. JWT authentication protects your account and documents.',
    color: 'var(--accent-light)',
  },
]

const Features = () => {
  return (
    <div id="features" className="py-20 px-6 md:px-16 lg:px-24 xl:px-40 scroll-mt-12" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 text-xs font-medium px-4 py-1.5 rounded-full mb-4"
          style={{ background: 'var(--accent-subtle)', color: 'var(--accent-light)' }}
        >
          <Zap size={12} /> Powerful Features
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          Everything you need to land your dream job
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-base max-w-xl mx-auto"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Our AI-powered platform provides all the tools you need to create outstanding resumes and stand out from the competition.
        </motion.p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="card card-interactive p-6 group"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{ background: `${feature.color}12`, color: feature.color }}
            >
              <feature.icon size={22} />
            </div>
            <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Features
