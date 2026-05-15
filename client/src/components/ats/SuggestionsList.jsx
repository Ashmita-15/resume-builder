import { motion } from 'framer-motion'
import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react'

const priorityConfig = {
  high: { icon: AlertTriangle, color: 'var(--error)', bg: 'rgba(239,68,68,0.1)' },
  medium: { icon: AlertCircle, color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)' },
  low: { icon: Info, color: 'var(--info)', bg: 'rgba(59,130,246,0.1)' },
}

const SuggestionsList = ({ suggestions = [] }) => {
  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
        <p className="text-sm">No suggestions — your resume looks great!</p>
      </div>
    )
  }

  // Sort by priority
  const sorted = [...suggestions].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return (order[a.priority] || 2) - (order[b.priority] || 2)
  })

  return (
    <div className="space-y-2">
      {sorted.map((suggestion, index) => {
        const config = priorityConfig[suggestion.priority] || priorityConfig.low
        const Icon = config.icon

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-lg transition-colors"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: config.bg, color: config.color }}
            >
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: config.color }}>
                  {suggestion.category}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-medium uppercase"
                  style={{ background: config.bg, color: config.color }}
                >
                  {suggestion.priority}
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {suggestion.message}
              </p>
            </div>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} className="shrink-0 mt-1" />
          </motion.div>
        )
      })}
    </div>
  )
}

export default SuggestionsList
