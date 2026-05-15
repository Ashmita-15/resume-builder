import { useEffect, lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Login from './pages/Login'
import { useDispatch } from 'react-redux'
import api from './configs/api'
import { login, setLoading } from './app/features/authSlice'
import { Toaster } from 'react-hot-toast'
import ChatBot from './components/ChatBot'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const MyResumes = lazy(() => import('./pages/MyResumes'))
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'))
const Preview = lazy(() => import('./pages/Preview'))
const AtsAnalyzer = lazy(() => import('./pages/AtsAnalyzer'))
const JobMatchAnalyzer = lazy(() => import('./pages/JobMatchAnalyzer'))
const Settings = lazy(() => import('./pages/Settings'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
  </div>
)

const App = () => {
  const dispatch = useDispatch()

  const getUserData = async () => {
    const token = localStorage.getItem('token')
    try {
      if (token) {
        const { data } = await api.get('/api/users/data', { headers: { Authorization: token } })
        if (data.user) {
          dispatch(login({ token, user: data.user }))
        }
        dispatch(setLoading(false))
      } else {
        dispatch(setLoading(false))
      }
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.message)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
          },
        }}
      />
      <ChatBot />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='app' element={<Layout />}>
          <Route index element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path='resumes' element={<Suspense fallback={<PageLoader />}><MyResumes /></Suspense>} />
          <Route path='builder/:resumeId' element={<Suspense fallback={<PageLoader />}><ResumeBuilder /></Suspense>} />
          <Route path='ats-analyzer' element={<Suspense fallback={<PageLoader />}><AtsAnalyzer /></Suspense>} />
          <Route path='job-match' element={<Suspense fallback={<PageLoader />}><JobMatchAnalyzer /></Suspense>} />
          <Route path='settings' element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
        </Route>

        <Route path='view/:resumeId' element={<Suspense fallback={<PageLoader />}><Preview /></Suspense>} />
      </Routes>
    </>
  )
}

export default App
