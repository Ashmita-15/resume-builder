import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Upload, LoaderCircle, ArrowLeft, Clock, ChevronRight, Briefcase, GraduationCap, UserCheck } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'
import MatchPercentageMeter from '../components/jobmatch/MatchPercentageMeter'
import SkillMatchCards from '../components/jobmatch/SkillMatchCards'
import RecommendationCards from '../components/jobmatch/RecommendationCards'

const JobMatchAnalyzer = () => {
  const { token } = useSelector(state => state.auth)
  const [step, setStep] = useState('input')
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [inputMethod, setInputMethod] = useState('paste')
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
    } catch { /* ignore */ }
  }

  const loadPastReports = async () => {
    try {
      const { data } = await api.get('/api/job-match/reports', { headers: { Authorization: token } })
      setPastReports(data.reports || [])
    } catch { /* ignore */ }
  }

  const handleAnalyze = async () => {
    let text = resumeText

    if (inputMethod === 'upload' && resumeFile) {
      try { text = await pdfToText(resumeFile) } catch { toast.error('Failed to parse PDF'); return }
    }

    if (inputMethod === 'select' && selectedResumeId) {
      try {
        const { data } = await api.get(`/api/resumes/get/${selectedResumeId}`, { headers: { Authorization: token } })
        const r = data.resume
        text = `${r.personal_info?.full_name || ''}\n${r.personal_info?.profession || ''}\n${r.professional_summary || ''}\nSkills: ${(r.skills || []).join(', ')}\n`
        r.experience?.forEach(e => { text += `${e.position} at ${e.company}: ${e.description}\n` })
        r.education?.forEach(e => { text += `${e.degree} in ${e.field} from ${e.institution}\n` })
        r.project?.forEach(p => { text += `Project: ${p.name} - ${p.description}\n` })
      } catch { toast.error('Failed to load resume'); return }
    }

    if (!text.trim() || !jobDescription.trim()) {
      toast.error('Please provide both resume and job description')
      return
    }

    setIsLoading(true)
    setStep('loading')

    try {
      const { data } = await api.post('/api/job-match/analyze', {
        resumeText: text, jobDescription, jobTitle, company,
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
      const { data } = await api.get(`/api/job-match/reports/${reportId}`, { headers: { Authorization: token } })
      setReport(data.report)
      setStep('results')
    } catch { toast.error('Failed to load report') }
    finally { setIsLoading(false) }
  }

  const resetForm = () => {
    setStep('input'); setReport(null); setResumeText(''); setJobDescription('')
    setJobTitle(''); setCompany(''); setResumeFile(null); setSelectedResumeId('')
  }

  const CompatibilityCard = ({ icon: Icon, label, score, analysis }) => (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: score >= 70 ? 'rgba(34,197,94,0.1)' : score >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', color: score >= 70 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--error)' }}>
          <Icon size={16} />
        </div>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</span>
        <span className="text-sm font-bold ml-auto" style={{ color: score >= 70 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--error)' }}>
          {score}%
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{analysis}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            <Target size={22} style={{ color: 'var(--success)' }} />
            Job Match Analyzer
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            See how well your resume matches a specific job description
          </p>
        </div>
        {step === 'results' && (
          <button onClick={resetForm} className="btn-secondary flex items-center gap-2 text-sm">
            <ArrowLeft size={14} /> New Match
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* INPUT STATE */}
        {step === 'input' && (
          <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-5">
              {/* Resume Input */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Resume</h3>
                <div className="flex gap-1 p-1 rounded-lg mb-4" style={{ background: 'var(--bg-tertiary)' }}>
                  {[
                    { id: 'paste', label: 'Paste Text' },
                    { id: 'upload', label: 'Upload PDF' },
                    { id: 'select', label: 'Select Resume' },
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setInputMethod(tab.id)}
                      className="flex-1 py-2 text-xs font-medium rounded-md transition-all"
                      style={{ background: inputMethod === tab.id ? 'var(--bg-card)' : 'transparent', color: inputMethod === tab.id ? 'var(--text-primary)' : 'var(--text-tertiary)', boxShadow: inputMethod === tab.id ? 'var(--shadow-sm)' : 'none' }}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {inputMethod === 'paste' && (
                  <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume text here..." className="w-full h-36 text-sm p-3" />
                )}
                {inputMethod === 'upload' && (
                  <label className="block cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl transition-all" style={{ border: '2px dashed var(--border-secondary)', color: resumeFile ? 'var(--accent-light)' : 'var(--text-tertiary)' }}>
                      {resumeFile ? <p className="text-sm font-medium">{resumeFile.name}</p> : <><Upload size={28} strokeWidth={1.5} /><p className="text-sm">Drop PDF here</p></>}
                    </div>
                    <input type="file" accept=".pdf" hidden onChange={e => setResumeFile(e.target.files[0])} />
                  </label>
                )}
                {inputMethod === 'select' && (
                  <select value={selectedResumeId} onChange={e => setSelectedResumeId(e.target.value)} className="w-full py-2.5 text-sm">
                    <option value="">Select a resume...</option>
                    {userResumes.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
                  </select>
                )}
              </div>

              {/* Job Details */}
              <div className="card p-5 space-y-4">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Job Details</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="Job title (optional)" className="text-sm px-3 py-2.5" />
                  <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company name (optional)" className="text-sm px-3 py-2.5" />
                </div>
                <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the full job description here..." className="w-full h-36 text-sm p-3" />
              </div>

              <button onClick={handleAnalyze} disabled={isLoading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                {isLoading ? <LoaderCircle className="animate-spin" size={16} /> : <Target size={16} />}
                {isLoading ? 'Analyzing...' : 'Analyze Job Match'}
              </button>
            </div>

            {/* Past Reports */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Clock size={14} /> Past Matches
              </h3>
              {pastReports.length === 0 ? (
                <p className="text-xs text-center py-8" style={{ color: 'var(--text-tertiary)' }}>No past matches yet</p>
              ) : (
                <div className="space-y-2">
                  {pastReports.map(r => (
                    <button key={r._id} onClick={() => viewPastReport(r._id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors"
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: r.matchPercentage >= 70 ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: r.matchPercentage >= 70 ? 'var(--success)' : 'var(--warning)' }}>
                        <span className="text-sm font-bold">{r.matchPercentage}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {r.jobTitle || 'Job Match'}
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
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'var(--border-primary)', borderTopColor: 'var(--success)' }} />
              <Target size={24} className="absolute inset-0 m-auto" style={{ color: 'var(--success)' }} />
            </div>
            <p className="mt-6 font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Analyzing job match...</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>AI is comparing your skills, experience, and qualifications</p>
          </motion.div>
        )}

        {/* RESULTS STATE */}
        {step === 'results' && report && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-6">

            {/* Match meter + compatibility cards */}
            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-5 card p-6 flex flex-col items-center justify-center">
                <MatchPercentageMeter percentage={report.matchPercentage} />
                {(report.jobTitle || report.company) && (
                  <p className="text-sm mt-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
                    {report.jobTitle}{report.company ? ` at ${report.company}` : ''}
                  </p>
                )}
              </div>
              <div className="md:col-span-7 space-y-3">
                <CompatibilityCard icon={UserCheck} label="Role Compatibility" score={report.roleCompatibility?.score || 0} analysis={report.roleCompatibility?.analysis || ''} />
                <CompatibilityCard icon={Briefcase} label="Experience Match" score={report.experienceMatch?.score || 0} analysis={report.experienceMatch?.analysis || ''} />
                <CompatibilityCard icon={GraduationCap} label="Education Match" score={report.educationMatch?.score || 0} analysis={report.educationMatch?.analysis || ''} />
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Skill Analysis</h3>
              <SkillMatchCards matchingSkills={report.matchingSkills} missingSkills={report.missingSkills} />
            </div>

            {/* Keyword Overlap */}
            {report.keywordOverlap && (
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Keyword Overlap</h3>
                  <span className="text-sm font-bold" style={{ color: report.keywordOverlap.percentage >= 60 ? 'var(--success)' : 'var(--warning)' }}>
                    {report.keywordOverlap.percentage}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden mb-4" style={{ background: 'var(--bg-tertiary)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: report.keywordOverlap.percentage >= 60 ? 'var(--success)' : 'var(--warning)' }}
                    initial={{ width: 0 }} animate={{ width: `${report.keywordOverlap.percentage}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--success)' }}>Matched ({report.keywordOverlap.matched?.length || 0})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {report.keywordOverlap.matched?.map((kw, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)' }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--error)' }}>Missing ({report.keywordOverlap.missing?.length || 0})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {report.keywordOverlap.missing?.map((kw, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)' }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {report.recommendations?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>AI Recommendations</h3>
                <RecommendationCards recommendations={report.recommendations} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default JobMatchAnalyzer
