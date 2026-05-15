import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const strengthColors = {
  strong: { bg: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: 'rgba(34,197,94,0.2)' },
  moderate: { bg: 'rgba(245,158,11,0.1)', color: 'var(--warning)', border: 'rgba(245,158,11,0.2)' },
  basic: { bg: 'rgba(59,130,246,0.1)', color: 'var(--info)', border: 'rgba(59,130,246,0.2)' },
}

const importanceColors = {
  critical: { bg: 'rgba(239,68,68,0.1)', color: 'var(--error)', border: 'rgba(239,68,68,0.2)' },
  important: { bg: 'rgba(245,158,11,0.1)', color: 'var(--warning)', border: 'rgba(245,158,11,0.2)' },
  'nice-to-have': { bg: 'rgba(59,130,246,0.1)', color: 'var(--info)', border: 'rgba(59,130,246,0.2)' },
}

const SkillMatchCards = ({ matchingSkills = [], missingSkills = [] }) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Matching Skills */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
            <Check size={14} style={{ color: 'var(--success)' }} />
          </div>
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Matching Skills
          </h4>
          <span className="badge badge-success ml-auto">{matchingSkills.length}</span>
        </div>
        <div className="space-y-2">
          {matchingSkills.map((s, i) => {
            const style = strengthColors[s.strength] || strengthColors.basic
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between p-2.5 rounded-lg"
                style={{ background: style.bg, border: `1px solid ${style.border}` }}
              >
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.skill}</span>
                <span className="text-[11px] font-medium uppercase" style={{ color: style.color }}>{s.strength}</span>
              </motion.div>
            )
          })}
          {matchingSkills.length === 0 && (
            <p className="text-xs text-center py-4" style={{ color: 'var(--text-tertiary)' }}>No matching skills found</p>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
            <X size={14} style={{ color: 'var(--error)' }} />
          </div>
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Missing Skills
          </h4>
          <span className="badge badge-error ml-auto">{missingSkills.length}</span>
        </div>
        <div className="space-y-2">
          {missingSkills.map((s, i) => {
            const style = importanceColors[s.importance] || importanceColors['nice-to-have']
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-2.5 rounded-lg"
                style={{ background: style.bg, border: `1px solid ${style.border}` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.skill}</span>
                  <span className="text-[11px] font-medium uppercase" style={{ color: style.color }}>{s.importance}</span>
                </div>
                {s.suggestion && (
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{s.suggestion}</p>
                )}
              </motion.div>
            )
          })}
          {missingSkills.length === 0 && (
            <p className="text-xs text-center py-4" style={{ color: 'var(--text-tertiary)' }}>No missing skills — perfect match!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SkillMatchCards
