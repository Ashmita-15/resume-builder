import { Plus, Trash2, FolderIcon, Github, ExternalLink, X } from 'lucide-react'
import { useState } from 'react'

const ProjectForm = ({ data, onChange }) => {

  const addProject = () => {
    onChange([...data, { name: '', type: '', description: '', github_link: '', live_link: '', tech_stack: [] }])
  }

  const removeProject = (index) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateProject = (index, field, value) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const addTechTag = (index, tag) => {
    if (!tag.trim()) return
    const updated = [...data]
    const existing = updated[index].tech_stack || []
    if (!existing.includes(tag.trim())) {
      updated[index] = { ...updated[index], tech_stack: [...existing, tag.trim()] }
      onChange(updated)
    }
  }

  const removeTechTag = (projIndex, tagIndex) => {
    const updated = [...data]
    updated[projIndex] = {
      ...updated[projIndex],
      tech_stack: updated[projIndex].tech_stack.filter((_, i) => i !== tagIndex),
    }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <FolderIcon size={16} style={{ color: 'var(--accent-light)' }} />
          Projects
        </h3>
        <button onClick={addProject} className="btn-ghost flex items-center gap-1 text-xs" style={{ color: 'var(--accent-light)' }}>
          <Plus size={14} /> Add Project
        </button>
      </div>

      <div className="space-y-4">
        {data.map((project, index) => (
          <div key={index} className="p-4 rounded-lg space-y-3 relative" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
            <button onClick={() => removeProject(index)} className="absolute top-3 right-3 p-1 rounded transition-colors" style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--error)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>
              <Trash2 size={14} />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <input value={project.name || ''} onChange={e => updateProject(index, 'name', e.target.value)} type="text" placeholder="Project Name" className="text-sm px-3 py-2" />
              <input value={project.type || ''} onChange={e => updateProject(index, 'type', e.target.value)} type="text" placeholder="Project Type" className="text-sm px-3 py-2" />
            </div>

            <textarea rows={3} value={project.description || ''} onChange={e => updateProject(index, 'description', e.target.value)} placeholder="Describe your project..." className="w-full text-sm px-3 py-2" />

            {/* Links */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-primary)' }}>
                <Github size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={project.github_link || ''} onChange={e => updateProject(index, 'github_link', e.target.value)} type="text" placeholder="GitHub URL" className="flex-1 text-sm bg-transparent border-none p-0 focus:ring-0" style={{ background: 'transparent' }} />
              </div>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-primary)' }}>
                <ExternalLink size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={project.live_link || ''} onChange={e => updateProject(index, 'live_link', e.target.value)} type="text" placeholder="Live URL" className="flex-1 text-sm bg-transparent border-none p-0 focus:ring-0" style={{ background: 'transparent' }} />
              </div>
            </div>

            {/* Tech Stack Tags */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(project.tech_stack || []).map((tag, tagIndex) => (
                  <span key={tagIndex} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                    style={{ background: 'var(--accent-subtle)', color: 'var(--accent-light)' }}>
                    {tag}
                    <button onClick={() => removeTechTag(index, tagIndex)} className="hover:opacity-70">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <TechInput onAdd={(tag) => addTechTag(index, tag)} />
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <p className="text-xs text-center py-6" style={{ color: 'var(--text-tertiary)' }}>No projects added yet</p>
      )}
    </div>
  )
}

const TechInput = ({ onAdd }) => {
  const [value, setValue] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      onAdd(value)
      setValue('')
    }
  }

  return (
    <input
      type="text"
      placeholder="Add tech (press Enter)"
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className="text-sm px-3 py-1.5 w-full"
    />
  )
}

export default ProjectForm
