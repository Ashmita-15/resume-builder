import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const MatchPercentageMeter = ({ percentage = 0, size = 200, strokeWidth = 14 }) => {
  const [animated, setAnimated] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  // Show 75% of circle (270 degrees)
  const arcLength = circumference * 0.75
  const offset = arcLength - (animated / 100) * arcLength

  const getColor = (p) => {
    if (p >= 80) return '#22c55e'
    if (p >= 60) return '#f59e0b'
    if (p >= 40) return '#f97316'
    return '#ef4444'
  }

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(percentage), 300)
    return () => clearTimeout(timer)
  }, [percentage])

  const color = getColor(animated)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(135deg)' }}>
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-primary)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Score arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-bold"
            style={{ color, fontFamily: 'var(--font-display)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
          >
            {animated}%
          </motion.span>
          <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
            Match Score
          </span>
        </div>
      </div>
    </div>
  )
}

export default MatchPercentageMeter
