const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--border-secondary)', borderTopColor: 'var(--accent-primary)' }} />
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Loading...</p>
      </div>
    </div>
  )
}

export default Loader
