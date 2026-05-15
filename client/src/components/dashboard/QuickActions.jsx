import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plus, Upload, ScanSearch, Target } from 'lucide-react'

const actions = [
  {
    label: 'Create Resume',
    description: 'Start from scratch',
    icon: Plus,
    path: '/app/resumes',
    color: 'var(--accent-primary)',
  },
  {
    label: 'Upload Resume',
    description: 'Import existing PDF',
    icon: Upload,
    path: '/app/resumes',
    color: 'var(--info)',
  },
  {
    label: 'ATS Check',
    description: 'Analyze compatibility',
    icon: ScanSearch,
    path: '/app/ats-analyzer',
    color: 'var(--warning)',
  },
  {
    label: 'Job Match',
    description: 'Compare with job',
    icon: Target,
    path: '/app/job-match',
    color: 'var(--success)',
  },
]

const QuickActions = () => {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          onClick={() => navigate(action.path)}
          className="card card-interactive p-4 flex flex-col items-center gap-2.5 text-center group"
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
            style={{ background: `${action.color}12`, color: action.color }}
          >
            <action.icon size={20} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {action.label}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              {action.description}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

export default QuickActions
