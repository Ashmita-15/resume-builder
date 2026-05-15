import { motion } from 'framer-motion'

const sections = [
  { key: 'formatting', label: 'Formatting' },
  { key: 'keywords', label: 'Keywords' },
  { key: 'readability', label: 'Readability' },
  { key: 'grammar', label: 'Grammar' },
  { key: 'structure', label: 'Structure' },
  { key: 'quantification', label: 'Quantification' },
]

const getBarColor = (score) => {
  if (score >= 80) return 'var(--success)'
  if (score >= 60) return 'var(--warning)'
  return 'var(--error)'
}

const ScoreBreakdown = ({ scores = {} }) => {
  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const score = scores[section.key] || 0
        return (
          <div key={section.key}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {section.label}
              </span>
              <span className="text-sm font-bold" style={{ color: getBarColor(score) }}>
                {score}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: getBarColor(score) }}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ScoreBreakdown
