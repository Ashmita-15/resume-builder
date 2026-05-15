import { FileText } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="py-10 px-6 md:px-16 lg:px-24 xl:px-40 border-t" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
            <FileText size={16} color="#fff" />
          </div>
          <span className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>ResumeAI</span>
        </div>

        <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          <a href="#" className="hover:opacity-80 transition">Privacy</a>
          <a href="#" className="hover:opacity-80 transition">Terms</a>
          <a href="#" className="hover:opacity-80 transition">Support</a>
        </div>

        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} ResumeAI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
