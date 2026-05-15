import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import Loader from '../components/Loader'
import { ArrowLeft } from 'lucide-react'
import api from '../configs/api'

const Preview = () => {
  const { resumeId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null)

  const loadResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/public/' + resumeId)
      setResumeData(data.resume)
    } catch (error) {
      console.log(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadResume() }, [])

  return resumeData ? (
    <div style={{ background: 'var(--bg-tertiary)' }}>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes="py-4 bg-white" />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? <Loader /> : (
        <div className="flex flex-col items-center justify-center h-screen" style={{ background: 'var(--bg-primary)' }}>
          <p className="text-4xl font-bold" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>Resume not found</p>
          <a href="/" className="btn-primary flex items-center gap-2 mt-6">
            <ArrowLeft size={16} /> Go to home page
          </a>
        </div>
      )}
    </div>
  )
}

export default Preview
