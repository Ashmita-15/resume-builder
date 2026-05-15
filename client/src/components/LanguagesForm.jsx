import { Plus, Trash2, Globe } from 'lucide-react'

const proficiencyLevels = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic']

const LanguagesForm = ({ data = [], onChange }) => {
  const addEntry = () => onChange([...data, { name: '', proficiency: 'Intermediate' }])
  const removeEntry = (index) => onChange(data.filter((_, i) => i !== index))
  const updateEntry = (index, field, value) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Globe size={16} style={{ color: 'var(--accent-light)' }} />
          Languages
        </h3>
        <button onClick={addEntry} className="btn-ghost flex items-center gap-1 text-xs" style={{ color: 'var(--accent-light)' }}>
          <Plus size={14} /> Add
        </button>
      </div>

      {data.map((lang, index) => (
        <div key={index} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
          <input type="text" placeholder="Language" value={lang.name || ''} onChange={e => updateEntry(index, 'name', e.target.value)} className="flex-1 text-sm px-3 py-2" />
          <select value={lang.proficiency || 'Intermediate'} onChange={e => updateEntry(index, 'proficiency', e.target.value)} className="text-sm px-3 py-2">
            {proficiencyLevels.map(level => <option key={level} value={level}>{level}</option>)}
          </select>
          <button onClick={() => removeEntry(index)} className="p-1.5 rounded transition-colors shrink-0" style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--error)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {data.length === 0 && (
        <p className="text-xs text-center py-6" style={{ color: 'var(--text-tertiary)' }}>No languages added yet</p>
      )}
    </div>
  )
}

export default LanguagesForm
