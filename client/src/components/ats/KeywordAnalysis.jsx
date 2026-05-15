import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const KeywordAnalysis = ({ matched = [], missing = [] }) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Matched Keywords */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
            <Check size={12} style={{ color: 'var(--success)' }} />
          </div>
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Matched Keywords
          </h4>
          <span className="badge badge-success ml-auto">{matched.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {matched.map((keyword, i) => (
            <motion.span
              key={keyword}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                background: 'rgba(34,197,94,0.1)',
                color: 'var(--success)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              {keyword}
            </motion.span>
          ))}
          {matched.length === 0 && (
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No matched keywords found</p>
          )}
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
            <X size={12} style={{ color: 'var(--error)' }} />
          </div>
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Missing Keywords
          </h4>
          <span className="badge badge-error ml-auto">{missing.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {missing.map((keyword, i) => (
            <motion.span
              key={keyword}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                background: 'rgba(239,68,68,0.1)',
                color: 'var(--error)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              {keyword}
            </motion.span>
          ))}
          {missing.length === 0 && (
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No missing keywords — great coverage!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default KeywordAnalysis
