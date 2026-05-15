const Title = ({ title, description }) => {
  return (
    <div className="text-center my-6">
      <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        {title}
      </h2>
      {description && (
        <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: 'var(--text-tertiary)' }}>
          {description}
        </p>
      )}
    </div>
  )
}

export default Title
