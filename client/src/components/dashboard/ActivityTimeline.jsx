import { motion } from 'framer-motion'
import { FileText, ScanSearch, Target, Edit3, Trash2, Upload } from 'lucide-react'

const iconMap = {
  create: FileText,
  edit: Edit3,
  delete: Trash2,
  ats: ScanSearch,
  match: Target,
  upload: Upload,
}

const colorMap = {
  create: 'var(--accent-primary)',
  edit: 'var(--info)',
  delete: 'var(--error)',
  ats: 'var(--warning)',
  match: 'var(--success)',
  upload: 'var(--accent-light)',
}

const ActivityTimeline = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
        <p className="text-sm">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, index) => {
        const Icon = iconMap[activity.type] || FileText
        const color = colorMap[activity.type] || 'var(--accent-primary)'

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-lg transition-colors"
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: `${color}15`, color: color }}
            >
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {activity.title}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                {activity.time}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ActivityTimeline
