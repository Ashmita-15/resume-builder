import { motion } from 'framer-motion'

const StatsCard = ({ icon: Icon, label, value, trend, trendUp, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-interactive p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, color: color }}
        >
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{
              background: trendUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: trendUp ? 'var(--success)' : 'var(--error)',
            }}
          >
            {trendUp ? '↑' : '↓'} {trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          {value}
        </p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </p>
      </div>
    </motion.div>
  )
}

export default StatsCard
