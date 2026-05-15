import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanSearch, FileText, Upload, LoaderCircle, ArrowLeft, Clock, ChevronRight } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'
import CircularScore from '../components/ats/CircularScore'
import ScoreBreakdown from '../components/ats/ScoreBreakdown'
import KeywordAnalysis from '../components/ats/KeywordAnalysis'
import SuggestionsList from '../components/ats/SuggestionsList'

const AtsAnalyzer = () => {
  const { token } = useSelector(state => state.auth)
  const [step, setStep] = useState('input') // input | loading | results
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [inputMethod, setInputMethod] = useState('paste') // paste | upload | select
  const [userResumes, setUserResumes] = useState([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [report, setReport] = useState(null)
  const [pastReports, setPastReports] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadUserResumes()
    loadPastReports()
  }, [])

  const loadUserResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })
      setUserResumes(data.resumes || [])
    } catch (e) { /* ignore */ }
  }

  const loadPastReports = async () => {
    try {
      const { data } = await api.get('/api/ats/reports', { headers: { Authorization: token } })
      setPastReports(data.reports || [])
    } catch (e) { /* ignore */ }
  }

  const handleAnalyze = async () => {
    let text = resumeText

    if (inputMethod === 'upload' && resumeFile) {
      try {
        text = await pdfToText(resumeFile)
      } catch {
        toast.error('Failed to parse PDF')
        return
      }
    }

    if (inputMethod === 'select' && selectedResumeId) {
      try {
        const { data } = await api.get(`/api/resumes/get/${selectedResumeId}`, { headers: { Authorization: token } })
        const r = data.resume
        text = `${r.personal_info?.full_name || ''}\n${r.personal_info?.profession || ''}\n${r.professional_summary || ''}\nSkills: ${(r.skills || []).join(', ')}\n`
        r.experience?.forEach(e => { text += `${e.position} at ${e.company}: ${e.description}\n` })
        r.education?.forEach(e => { text += `${e.degree} in ${e.field} from ${e.institution}\n` })
        r.project?.forEach(p => { text += `Project: ${p.name} - ${p.description}\n` })
      } catch {
        toast.error('Failed to load resume')
        return
      }
    }

    if (!text.trim() || !jobDescription.trim()) {
      toast.error('Please provide both resume and job description')
      return
    }

    setIsLoading(true)
    setStep('loading')

    try {
      const { data } = await api.post('/api/ats/analyze', {
        resumeText: text,
        jobDescription,
        resumeId: selectedResumeId || undefined,
      }, { headers: { Authorization: token } })

      setReport(data.report)
      setStep('results')
      loadPastReports()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Analysis failed')
      setStep('input')
    } finally {
      setIsLoading(false)
    }
  }

  const viewPastReport = async (reportId) => {
    try {
      setIsLoading(true)
      const { data } = await api.get(`/api/ats/reports/${reportId}`, { headers: { Authorization: token } })
      setReport(data.report)
      setStep('results')
    } catch {
      toast.error('Failed to load report')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setStep('input')
    setReport(null)
    setResumeText('')
    setJobDescription('')
    setResumeFile(null)
    setSelectedResumeId('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            <ScanSearch size={22} style={{ color: 'var(--accent-light)' }} />
            ATS Score Analyzer
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Check how well your resume passes Applicant Tracking Systems
          </p>
        </div>
        {step === 'results' && (
          <button onClick={resetForm} className="btn-secondary flex items-center gap-2 text-sm">
            <ArrowLeft size={14} /> New Analysis
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* INPUT STATE */}
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Main Input */}
            <div className="lg:col-span-2 space-y-5">
              {/* Resume Input */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Resume</h3>

                {/* Input method tabs */}
                <div className="flex gap-1 p-1 rounded-lg mb-4" style={{ background: 'var(--bg-tertiary)' }}>
                  {[
                    { id: 'paste', label: 'Paste Text' },
                    { id: 'upload', label: 'Upload PDF' },
                    { id: 'select', label: 'Select Resume' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setInputMethod(tab.id)}
                      className="flex-1 py-2 text-xs font-medium rounded-md transition-all"
                      style={{
                        background: inputMethod === tab.id ? 'var(--bg-card)' : 'transparent',
                        color: inputMethod === tab.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
                        boxShadow: inputMethod === tab.id ? 'var(--shadow-sm)' : 'none',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {inputMethod === 'paste' && (
                  <textarea
                    value={resumeText}
                    onChange={e => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    className="w-full h-40 text-sm p-3"
                    style={{ background: 'var(--bg-input)' }}
                  />
                )}

                {inputMethod === 'upload' && (
                  <label className="block cursor-pointer">
                    <div
                      className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl transition-all"
                      style={{ border: '2px dashed var(--border-secondary)', color: resumeFile ? 'var(--accent-light)' : 'var(--text-tertiary)' }}
                    >
                      {resumeFile ? (
                        <p className="text-sm font-medium">{resumeFile.name}</p>
                      ) : (
                        <>
                          <Upload size={28} strokeWidth={1.5} />
                          <p className="text-sm">Drop PDF here or click to browse</p>
                        </>
                      )}
                    </div>
                    <input type="file" accept=".pdf" hidden onChange={e => setResumeFile(e.target.files[0])} />
                  </label>
                )}

                {inputMethod === 'select' && (
                  <select
                    value={selectedResumeId}
                    onChange={e => setSelectedResumeId(e.target.value)}
                    className="w-full py-2.5 text-sm"
                  >
                    <option value="">Select a resume...</option>
                    {userResumes.map(r => (
                      <option key={r._id} value={r._id}>{r.title}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Job Description */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Job Description</h3>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-40 text-sm p-3"
                  style={{ background: 'var(--bg-input)' }}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isLoading ? <LoaderCircle className="animate-spin" size={16} /> : <ScanSearch size={16} />}
                {isLoading ? 'Analyzing...' : 'Analyze ATS Compatibility'}
              </button>
            </div>

            {/* Past Reports Sidebar */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Clock size={14} /> Past Analyses
              </h3>
              {pastReports.length === 0 ? (
                <p className="text-xs text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                  No past analyses yet
                </p>
              ) : (
                <div className="space-y-2">
                  {pastReports.map(r => (
                    <button
                      key={r._id}
                      onClick={() => viewPastReport(r._id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors"
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: r.overallScore >= 70 ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                          color: r.overallScore >= 70 ? 'var(--success)' : 'var(--warning)',
                        }}
                      >
                        <span className="text-sm font-bold">{r.overallScore}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          Score: {r.overallScore}/100
                        </p>
                        <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* LOADING STATE */}
        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'var(--border-primary)', borderTopColor: 'var(--accent-primary)' }} />
              <ScanSearch size={24} className="absolute inset-0 m-auto" style={{ color: 'var(--accent-light)' }} />
            </div>
            <p className="mt-6 font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              Analyzing your resume...
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
              AI is checking ATS compatibility, keywords, and formatting
            </p>
          </motion.div>
        )}

        {/* RESULTS STATE */}
        {step === 'results' && report && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Top row: Score + Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6 flex items-center justify-center">
                <CircularScore score={report.overallScore} label="ATS Compatibility Score" />
              </div>
              <div className="card p-6">
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Score Breakdown
                </h3>
                <ScoreBreakdown scores={report.sectionScores} />
              </div>
            </div>

            {/* Keywords */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                Keyword Analysis
              </h3>
              <KeywordAnalysis matched={report.matchedKeywords} missing={report.missingKeywords} />
            </div>

            {/* Skill Gaps */}
            {report.skillGaps?.length > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Skill Gaps
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.skillGaps.map((gap, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        background: gap.importance === 'high' ? 'rgba(239,68,68,0.1)' : gap.importance === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
                        color: gap.importance === 'high' ? 'var(--error)' : gap.importance === 'medium' ? 'var(--warning)' : 'var(--info)',
                        border: `1px solid ${gap.importance === 'high' ? 'rgba(239,68,68,0.2)' : gap.importance === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)'}`,
                      }}
                    >
                      {gap.skill} • {gap.importance}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                Improvement Suggestions
              </h3>
              <SuggestionsList suggestions={report.suggestions} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AtsAnalyzer
