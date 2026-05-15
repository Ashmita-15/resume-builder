import { motion } from 'framer-motion'
import { Lightbulb, ArrowUpRight } from 'lucide-react'

const impactColors = {
  high: { bg: 'rgba(239,68,68,0.08)', color: 'var(--error)', border: 'rgba(239,68,68,0.15)' },
  medium: { bg: 'rgba(245,158,11,0.08)', color: 'var(--warning)', border: 'rgba(245,158,11,0.15)' },
  low: { bg: 'rgba(59,130,246,0.08)', color: 'var(--info)', border: 'rgba(59,130,246,0.15)' },
}

const RecommendationCards = ({ recommendations = [] }) => {
  if (recommendations.length === 0) return null

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {recommendations.map((rec, i) => {
        const style = impactColors[rec.impact] || impactColors.low
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: style.bg, color: style.color }}>
                  <Lightbulb size={14} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: style.color }}>
                  {rec.area}
                </span>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase"
                style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
              >
                {rec.impact} impact
              </span>
            </div>
            <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
              {rec.action}
            </p>
            <div className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--accent-light)' }}>
              <ArrowUpRight size={12} /> Take action
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default RecommendationCards
