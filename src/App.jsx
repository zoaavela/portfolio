import { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'

const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const Project = lazy(() => import('./pages/Project'))
const Blog = lazy(() => import('./pages/Blog'))
const Contact = lazy(() => import('./pages/Contact'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const BrainPage = lazy(() => import('./pages/BrainPage'))   // hub orbe
const BrainHub = lazy(() => import('./pages/BrainHub'))    // toutes les notes

const PageTransition = ({ children }) => {
    useEffect(() => { window.scrollTo(0, 0) }, [])
    return (
        <motion.div initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(4px)' }} transition={{ duration: 0.4, ease: 'easeInOut' }}>
            {children}
        </motion.div>
    )
}

const LoadingFallback = () => (
    <div className="fixed inset-0 bg-[#0D0D0D] flex items-center justify-center z-[100]">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="font-bebas text-4xl text-offwhite tracking-widest">
            ENZO.
        </motion.span>
    </div>
)

export default function App() {
    const location = useLocation()
    const isBrainRoute = location.pathname.startsWith('/brain')
    const showFooter = !isBrainRoute && location.pathname !== '/parcours' && location.pathname !== '/contact' && location.pathname !== '/'

    useEffect(() => {
        const baseTitle = 'enzo.'
        const numbers = '0123456789'
        let isGlitching = false
        const interval = setInterval(() => {
            if (!isGlitching && Math.random() > 0.95) {
                isGlitching = true
                let ticks = 0
                const max = 4 + Math.floor(Math.random() * 4)
                const gi = setInterval(() => {
                    document.title = baseTitle.split('').map(c => c === '.' ? '.' : Math.random() > 0.5 ? numbers[Math.floor(Math.random() * 10)] : c).join('')
                    if (++ticks >= max) { clearInterval(gi); document.title = baseTitle; isGlitching = false }
                }, 60)
            }
        }, 100)
        return () => clearInterval(interval)
    }, [])

    return (
        <AuthProvider>
            <div className="min-h-screen bg-[#0D0D0D]">
                {!isBrainRoute && <Navbar />}

                <Suspense fallback={<LoadingFallback />}>
                    <AnimatePresence mode="wait" initial={false}>
                        <Routes location={location} key={location.pathname}>
                            {/* Public */}
                            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                            <Route path="/projets" element={<PageTransition><Projects /></PageTransition>} />
                            <Route path="/projets/:id" element={<PageTransition><Project /></PageTransition>} />
                            <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
                            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />

                            {/* Auth */}
                            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />

                            {/* Brain — protégé */}
                            <Route path="/brain" element={
                                <ProtectedRoute><PageTransition><BrainPage /></PageTransition></ProtectedRoute>
                            } />
                            <Route path="/brain/notes" element={
                                <ProtectedRoute><PageTransition><BrainHub /></PageTransition></ProtectedRoute>
                            } />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </AnimatePresence>
                </Suspense>

                <AnimatePresence>
                    {showFooter && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                            <Footer />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AuthProvider>
    )
}