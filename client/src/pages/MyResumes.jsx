import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, UploadCloud, FilePenLine, Trash2, Pencil, X,
  LoaderCircle, Search, Grid3X3, List
} from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const MyResumes = () => {
  const { token } = useSelector(state => state.auth)
  const navigate = useNavigate()

  const [allResumes, setAllResumes] = useState([])
  const [filteredResumes, setFilteredResumes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')

  const colors = ['var(--accent-primary)', 'var(--info)', 'var(--warning)', 'var(--success)', 'var(--accent-light)']

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })
      setAllResumes(data.resumes || [])
      setFilteredResumes(data.resumes || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    loadAllResumes()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredResumes(allResumes.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    } else {
      setFilteredResumes(allResumes)
    }
  }, [searchQuery, allResumes])

  const createResume = async (event) => {
    event.preventDefault()
    try {
      const { data } = await api.post('/api/resumes/create', { title }, { headers: { Authorization: token } })
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadResume = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const resumeText = await pdfToText(resume)
      const { data } = await api.post('/api/ai/upload-resume', { title, resumeText }, { headers: { Authorization: token } })
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    setIsLoading(false)
  }

  const editTitle = async (event) => {
    event.preventDefault()
    try {
      const { data } = await api.put(`/api/resumes/update`, { resumeId: editResumeId, resumeData: { title } }, { headers: { Authorization: token } })
      setAllResumes(allResumes.map(r => r._id === editResumeId ? { ...r, title } : r))
      setTitle('')
      setEditResumeId('')
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const deleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return
    try {
      const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, { headers: { Authorization: token } })
      setAllResumes(allResumes.filter(r => r._id !== resumeId))
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const Modal = ({ show, onClose, children }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="card w-full max-w-md p-6 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-md transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            My Resumes
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {allResumes.length} resume{allResumes.length !== 1 ? 's' : ''} total
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 sm:flex-initial sm:w-48" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
            <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 p-0"
              style={{ color: 'var(--text-primary)', background: 'transparent' }}
            />
          </div>

          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 transition-colors"
              style={{ background: viewMode === 'grid' ? 'var(--accent-subtle)' : 'var(--bg-tertiary)', color: viewMode === 'grid' ? 'var(--accent-light)' : 'var(--text-tertiary)' }}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="p-2 transition-colors"
              style={{ background: viewMode === 'list' ? 'var(--accent-subtle)' : 'var(--bg-tertiary)', color: viewMode === 'list' ? 'var(--accent-light)' : 'var(--text-tertiary)' }}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowCreateResume(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> New Resume
        </button>
        <button
          onClick={() => setShowUploadResume(true)}
          className="btn-secondary flex items-center gap-2"
        >
          <UploadCloud size={16} /> Upload PDF
        </button>
      </div>

      {/* Resumes Grid/List */}
      {pageLoading ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-2"}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={viewMode === 'grid' ? "h-44 rounded-xl animate-shimmer" : "h-16 rounded-lg animate-shimmer"} />
          ))}
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="card p-12 text-center">
          <FilePenLine size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            {searchQuery ? 'No resumes match your search' : 'No resumes yet'}
          </p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
            {searchQuery ? 'Try a different search term' : 'Create your first resume to get started'}
          </p>
          {!searchQuery && (
            <button onClick={() => setShowCreateResume(true)} className="btn-primary">
              Create Resume
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredResumes.map((r, index) => {
            const color = colors[index % colors.length]
            return (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <button
                  onClick={() => navigate(`/app/builder/${r._id}`)}
                  className="card card-interactive w-full h-44 flex flex-col items-center justify-center gap-3 p-4 text-center group relative"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: `${color}15`, color }}
                  >
                    <FilePenLine size={22} />
                  </div>
                  <p className="text-sm font-medium truncate w-full px-2" style={{ color: 'var(--text-primary)' }}>
                    {r.title}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(r.updatedAt).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div
                    onClick={e => e.stopPropagation()}
                    className="absolute top-2 right-2 hidden group-hover:flex items-center gap-0.5"
                  >
                    <button
                      onClick={() => { setEditResumeId(r._id); setTitle(r.title) }}
                      className="p-1.5 rounded-md transition-colors"
                      style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-subtle)'; e.currentTarget.style.color = 'var(--accent-light)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteResume(r._id)}
                      className="p-1.5 rounded-md transition-colors"
                      style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = 'var(--error)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredResumes.map((r, index) => {
            const color = colors[index % colors.length]
            return (
              <motion.button
                key={r._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => navigate(`/app/builder/${r._id}`)}
                className="card w-full flex items-center gap-4 p-4 text-left group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${color}15`, color }}
                >
                  <FilePenLine size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{r.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Updated {new Date(r.updatedAt).toLocaleDateString()} · {r.template} template
                  </p>
                </div>
                <div onClick={e => e.stopPropagation()} className="hidden group-hover:flex items-center gap-1">
                  <button onClick={() => { setEditResumeId(r._id); setTitle(r.title) }} className="p-2 rounded-md transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteResume(r._id)} className="p-2 rounded-md transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Create Resume Modal */}
      <Modal show={showCreateResume} onClose={() => { setShowCreateResume(false); setTitle('') }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          Create New Resume
        </h2>
        <form onSubmit={createResume}>
          <input
            onChange={e => setTitle(e.target.value)}
            value={title}
            type="text"
            placeholder="Resume title..."
            className="w-full px-4 py-2.5 mb-4 text-sm"
            required
          />
          <button type="submit" className="btn-primary w-full py-2.5">
            Create Resume
          </button>
        </form>
      </Modal>

      {/* Upload Resume Modal */}
      <Modal show={showUploadResume} onClose={() => { setShowUploadResume(false); setTitle(''); setResume(null) }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          Upload Resume
        </h2>
        <form onSubmit={uploadResume}>
          <input
            onChange={e => setTitle(e.target.value)}
            value={title}
            type="text"
            placeholder="Resume title..."
            className="w-full px-4 py-2.5 mb-4 text-sm"
            required
          />
          <label htmlFor="resume-upload" className="block">
            <div
              className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl cursor-pointer transition-all"
              style={{
                border: '2px dashed var(--border-secondary)',
                color: resume ? 'var(--accent-light)' : 'var(--text-tertiary)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-secondary)'}
            >
              {resume ? (
                <p className="text-sm font-medium">{resume.name}</p>
              ) : (
                <>
                  <UploadCloud size={32} strokeWidth={1.5} />
                  <p className="text-sm">Drop your PDF here or click to browse</p>
                </>
              )}
            </div>
          </label>
          <input type="file" id="resume-upload" accept=".pdf" hidden onChange={e => setResume(e.target.files[0])} />
          <button
            type="submit"
            disabled={isLoading || !resume}
            className="btn-primary w-full py-2.5 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading && <LoaderCircle className="animate-spin" size={16} />}
            {isLoading ? 'Processing...' : 'Upload & Parse'}
          </button>
        </form>
      </Modal>

      {/* Edit Title Modal */}
      <Modal show={!!editResumeId} onClose={() => { setEditResumeId(''); setTitle('') }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          Edit Resume Title
        </h2>
        <form onSubmit={editTitle}>
          <input
            onChange={e => setTitle(e.target.value)}
            value={title}
            type="text"
            placeholder="Resume title..."
            className="w-full px-4 py-2.5 mb-4 text-sm"
            required
          />
          <button type="submit" className="btn-primary w-full py-2.5">
            Update Title
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default MyResumes
