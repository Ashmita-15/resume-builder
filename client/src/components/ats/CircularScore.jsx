import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

const CircularScore = ({ score = 0, size = 180, strokeWidth = 12, label = 'ATS Score' }) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  const getColor = (s) => {
    if (s >= 80) return 'var(--success)'
    if (s >= 60) return 'var(--warning)'
    return 'var(--error)'
  }

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-primary)"
            strokeWidth={strokeWidth}
          />
          {/* Score arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(animatedScore)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold"
            style={{ color: getColor(animatedScore), fontFamily: 'var(--font-display)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {animatedScore}
          </motion.span>
          <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
            out of 100
          </span>
        </div>
      </div>
      <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</p>
    </div>
  )
}

export default CircularScore
