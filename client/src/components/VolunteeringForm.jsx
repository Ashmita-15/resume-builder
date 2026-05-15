import { Plus, Trash2, Heart } from 'lucide-react'

const VolunteeringForm = ({ data = [], onChange }) => {
  const addEntry = () => onChange([...data, { organization: '', role: '', start_date: '', end_date: '', description: '' }])
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
          <Heart size={16} style={{ color: 'var(--accent-light)' }} />
          Volunteering
        </h3>
        <button onClick={addEntry} className="btn-ghost flex items-center gap-1 text-xs" style={{ color: 'var(--accent-light)' }}>
          <Plus size={14} /> Add
        </button>
      </div>

      {data.map((vol, index) => (
        <div key={index} className="p-4 rounded-lg space-y-3 relative" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
          <button onClick={() => removeEntry(index)} className="absolute top-3 right-3 p-1 rounded transition-colors" style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--error)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>
            <Trash2 size={14} />
          </button>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Organization" value={vol.organization || ''} onChange={e => updateEntry(index, 'organization', e.target.value)} className="text-sm px-3 py-2" />
            <input type="text" placeholder="Role" value={vol.role || ''} onChange={e => updateEntry(index, 'role', e.target.value)} className="text-sm px-3 py-2" />
            <input type="text" placeholder="Start date" value={vol.start_date || ''} onChange={e => updateEntry(index, 'start_date', e.target.value)} className="text-sm px-3 py-2" />
            <input type="text" placeholder="End date" value={vol.end_date || ''} onChange={e => updateEntry(index, 'end_date', e.target.value)} className="text-sm px-3 py-2" />
          </div>
          <textarea placeholder="Description" value={vol.description || ''} onChange={e => updateEntry(index, 'description', e.target.value)} className="w-full text-sm px-3 py-2 h-16" />
        </div>
      ))}

      {data.length === 0 && (
        <p className="text-xs text-center py-6" style={{ color: 'var(--text-tertiary)' }}>No volunteering experience added yet</p>
      )}
    </div>
  )
}

export default VolunteeringForm
