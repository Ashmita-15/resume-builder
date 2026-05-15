import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Briefcase, ChevronLeft, ChevronRight, DownloadIcon,
  EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap,
  Share2Icon, Sparkles, User, Award, Trophy, Globe, Heart, Activity,
  GripVertical, Eye, EyeOff, Save
} from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import CertificationsForm from '../components/CertificationsForm'
import AchievementsForm from '../components/AchievementsForm'
import LanguagesForm from '../components/LanguagesForm'
import VolunteeringForm from '../components/VolunteeringForm'
import ExtracurricularForm from '../components/ExtracurricularForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const defaultSections = [
  { id: 'personal', name: 'Personal Info', icon: User },
  { id: 'summary', name: 'Summary', icon: FileText },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'projects', name: 'Projects', icon: FolderIcon },
  { id: 'skills', name: 'Skills', icon: Sparkles },
  { id: 'certifications', name: 'Certifications', icon: Award },
  { id: 'achievements', name: 'Achievements', icon: Trophy },
  { id: 'languages', name: 'Languages', icon: Globe },
  { id: 'volunteering', name: 'Volunteering', icon: Heart },
  { id: 'extracurricular', name: 'Activities', icon: Activity },
]

const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const { token } = useSelector(state => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '', title: '', personal_info: {}, professional_summary: '',
    experience: [], education: [], project: [], skills: [],
    certifications: [], achievements: [], languages: [],
    volunteering: [], extracurricular: [],
    template: 'classic', accent_color: '#3B82F6', public: false,
    section_order: [], hidden_sections: [],
  })

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  const sections = resumeData.section_order?.length > 0
    ? resumeData.section_order.map(id => defaultSections.find(s => s.id === id)).filter(Boolean)
    : defaultSections

  const visibleSections = sections.filter(s => !(resumeData.hidden_sections || []).includes(s.id))
  const activeSection = visibleSections[activeSectionIndex] || visibleSections[0]

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/get/' + resumeId, { headers: { Authorization: token } })
      if (data.resume) {
        setResumeData({
          ...resumeData,
          ...data.resume,
          certifications: data.resume.certifications || [],
          achievements: data.resume.achievements || [],
          languages: data.resume.languages || [],
          volunteering: data.resume.volunteering || [],
          extracurricular: data.resume.extracurricular || [],
          section_order: data.resume.section_order || [],
          hidden_sections: data.resume.hidden_sections || [],
        })
        document.title = data.resume.title
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => { loadExistingResume() }, [])

  const toggleSectionVisibility = (sectionId) => {
    const hidden = resumeData.hidden_sections || []
    const updated = hidden.includes(sectionId)
      ? hidden.filter(id => id !== sectionId)
      : [...hidden, sectionId]
    setResumeData(prev => ({ ...prev, hidden_sections: updated }))
  }

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify({ public: !resumeData.public }))
      const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } })
      setResumeData({ ...resumeData, public: !resumeData.public })
      toast.success(data.message)
    } catch (error) {
      console.error('Error saving resume:', error)
    }
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0]
    const resumeUrl = frontendUrl + '/view/' + resumeId
    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'My Resume' })
    } else {
      navigator.clipboard.writeText(resumeUrl)
      toast.success('Link copied to clipboard')
    }
  }

  const downloadResume = () => { window.print() }

  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData)
      if (typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image
      }
      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify(updatedResumeData))
      removeBackground && formData.append('removeBackground', 'yes')
      typeof resumeData.personal_info.image === 'object' && formData.append('image', resumeData.personal_info.image)
      const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } })
      setResumeData(prev => ({ ...prev, ...data.resume }))
      toast.success(data.message)
    } catch (error) {
      console.error('Error saving resume:', error)
    }
  }

  const renderForm = () => {
    if (!activeSection) return null
    const formProps = {
      personal: <PersonalInfoForm data={resumeData.personal_info} onChange={d => setResumeData(p => ({ ...p, personal_info: d }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />,
      summary: <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={d => setResumeData(p => ({ ...p, professional_summary: d }))} setResumeData={setResumeData} />,
      experience: <ExperienceForm data={resumeData.experience} onChange={d => setResumeData(p => ({ ...p, experience: d }))} />,
      education: <EducationForm data={resumeData.education} onChange={d => setResumeData(p => ({ ...p, education: d }))} />,
      projects: <ProjectForm data={resumeData.project} onChange={d => setResumeData(p => ({ ...p, project: d }))} />,
      skills: <SkillsForm data={resumeData.skills} onChange={d => setResumeData(p => ({ ...p, skills: d }))} />,
      certifications: <CertificationsForm data={resumeData.certifications} onChange={d => setResumeData(p => ({ ...p, certifications: d }))} />,
      achievements: <AchievementsForm data={resumeData.achievements} onChange={d => setResumeData(p => ({ ...p, achievements: d }))} />,
      languages: <LanguagesForm data={resumeData.languages} onChange={d => setResumeData(p => ({ ...p, languages: d }))} />,
      volunteering: <VolunteeringForm data={resumeData.volunteering} onChange={d => setResumeData(p => ({ ...p, volunteering: d }))} />,
      extracurricular: <ExtracurricularForm data={resumeData.extracurricular} onChange={d => setResumeData(p => ({ ...p, extracurricular: d }))} />,
    }
    return formProps[activeSection.id] || null
  }

  return (
    <div className="-mx-4 lg:-mx-6 -my-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-3">
          <Link to="/app/resumes" className="p-1.5 rounded-md transition-colors" style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-sm font-semibold truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>
            {resumeData.title || 'Untitled Resume'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <TemplateSelector selectedTemplate={resumeData.template} onChange={template => setResumeData(p => ({ ...p, template }))} />
          <ColorPicker selectedColor={resumeData.accent_color} onChange={color => setResumeData(p => ({ ...p, accent_color: color }))} />

          <div className="hidden sm:flex items-center gap-1 ml-2">
            {resumeData.public && (
              <button onClick={handleShare} className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3">
                <Share2Icon size={13} /> Share
              </button>
            )}
            <button onClick={changeResumeVisibility} className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3">
              {resumeData.public ? <EyeIcon size={13} /> : <EyeOffIcon size={13} />}
              {resumeData.public ? 'Public' : 'Private'}
            </button>
            <button onClick={downloadResume} className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3">
              <DownloadIcon size={13} /> Export
            </button>
          </div>

          <button onClick={() => toast.promise(saveResume, { loading: 'Saving...' })}
            className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4">
            <Save size={13} /> Save
          </button>
        </div>
      </div>

      <div className="flex" style={{ height: 'calc(100vh - 112px)' }}>
        {/* Section sidebar */}
        <div className="w-14 lg:w-48 shrink-0 border-r overflow-y-auto py-2" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-secondary)' }}>
          {defaultSections.map((section, index) => {
            const isHidden = (resumeData.hidden_sections || []).includes(section.id)
            const visibleIndex = visibleSections.findIndex(s => s.id === section.id)
            const isActive = activeSection?.id === section.id

            return (
              <div key={section.id} className="flex items-center group">
                <button
                  onClick={() => {
                    if (!isHidden && visibleIndex >= 0) setActiveSectionIndex(visibleIndex)
                  }}
                  className={`flex-1 flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-all relative ${isHidden ? 'opacity-40' : ''}`}
                  style={{
                    color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-subtle)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-tertiary)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  {isActive && (
                    <motion.div layoutId="builderActive" className="absolute left-0 top-0 bottom-0 w-[2px]"
                      style={{ background: 'var(--accent-primary)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                  <section.icon size={15} className="shrink-0" />
                  <span className="hidden lg:block truncate">{section.name}</span>
                </button>
                <button
                  onClick={() => toggleSectionVisibility(section.id)}
                  className="hidden lg:block p-1 mr-1 rounded opacity-0 group-hover:opacity-100 transition-all"
                  style={{ color: 'var(--text-tertiary)' }}
                  title={isHidden ? 'Show section' : 'Hide section'}
                >
                  {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
            )
          })}
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6" style={{ background: 'var(--bg-primary)' }}>
          {/* Progress bar */}
          <div className="w-full h-1 rounded-full mb-5 overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
            <motion.div className="h-full rounded-full" style={{ background: 'var(--gradient-accent)' }}
              animate={{ width: `${((activeSectionIndex + 1) / visibleSections.length) * 100}%` }}
              transition={{ duration: 0.3 }} />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--accent-subtle)', color: 'var(--accent-light)' }}>
                {activeSectionIndex + 1}/{visibleSections.length}
              </span>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {activeSection?.name}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              {activeSectionIndex > 0 && (
                <button onClick={() => setActiveSectionIndex(i => Math.max(i - 1, 0))}
                  className="btn-ghost flex items-center gap-1 text-xs py-1.5 px-2">
                  <ChevronLeft size={14} /> Prev
                </button>
              )}
              {activeSectionIndex < visibleSections.length - 1 && (
                <button onClick={() => setActiveSectionIndex(i => Math.min(i + 1, visibleSections.length - 1))}
                  className="btn-ghost flex items-center gap-1 text-xs py-1.5 px-2">
                  Next <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Form content */}
          <motion.div key={activeSection?.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            {renderForm()}
          </motion.div>

          {/* Mobile preview toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden fixed bottom-6 right-6 btn-primary p-3 rounded-full shadow-lg z-30"
          >
            {showPreview ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        </div>

        {/* Preview pane */}
        <div className={`${showPreview ? 'block' : 'hidden'} lg:block w-[45%] shrink-0 overflow-y-auto border-l`}
          style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-tertiary)' }}>
          <div className="p-4">
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
