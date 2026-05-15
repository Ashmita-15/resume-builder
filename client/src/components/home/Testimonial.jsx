import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    content: 'The ATS analyzer helped me understand exactly what was missing from my resume. After making the suggested changes, I started getting callbacks within days.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
  },
  {
    name: 'James Rodriguez',
    role: 'Product Manager at Meta',
    content: 'The job match feature is incredible. It showed me exactly how my skills aligned with the role and what I needed to improve. Landed my dream job!',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
  },
  {
    name: 'Priya Sharma',
    role: 'Data Scientist at Amazon',
    content: 'Best resume builder I have used. The AI suggestions were spot-on, and my ATS score went from 45 to 92 after following the recommendations.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
  },
]

const Testimonial = () => {
  return (
    <div id="testimonials" className="py-20 px-6 md:px-16 lg:px-24 xl:px-40 scroll-mt-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 text-xs font-medium px-4 py-1.5 rounded-full mb-4"
          style={{ background: 'var(--accent-subtle)', color: 'var(--accent-light)' }}
        >
          <Star size={12} /> Trusted by Thousands
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          What our users say
        </motion.h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <Quote size={20} style={{ color: 'var(--accent-subtle)' }} className="mb-3 opacity-50" />
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
              "{t.content}"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
              <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Testimonial
