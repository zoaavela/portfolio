import { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy loading for pages
const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const Project = lazy(() => import('./pages/Project'))
const Blog = lazy(() => import('./pages/Blog'))
const Contact = lazy(() => import('./pages/Contact'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const BrainPage = lazy(() => import('./pages/BrainPage'))

const PageTransition = ({ children }) => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    )
}

const LoadingFallback = () => (
    <div className="fixed inset-0 bg-[#0D0D0D] flex items-center justify-center z-[100]">
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="font-bebas text-4xl text-offwhite tracking-widest"
        >
            ENZO.
        </motion.span>
    </div>
)

export default function App() {
    const location = useLocation()
    const isBrainRoute = location.pathname.startsWith('/brain')
    const showFooter = !isBrainRoute
        && location.pathname !== '/parcours'
        && location.pathname !== '/contact'
        && location.pathname !== '/'

    useEffect(() => {
        const baseTitle = "enzo."
        const numbers = "0123456789"
        let isGlitching = false

        const interval = setInterval(() => {
            if (!isGlitching && Math.random() > 0.95) {
                isGlitching = true
                let glitchTicks = 0
                const maxTicks = 4 + Math.floor(Math.random() * 4)

                const glitchInterval = setInterval(() => {
                    let currentTitle = ""
                    for (let i = 0; i < baseTitle.length; i++) {
                        if (baseTitle[i] === ".") {
                            currentTitle += "."
                        } else if (Math.random() > 0.5) {
                            currentTitle += numbers[Math.floor(Math.random() * numbers.length)]
                        } else {
                            currentTitle += baseTitle[i]
                        }
                    }
                    document.title = currentTitle

                    glitchTicks++
                    if (glitchTicks >= maxTicks) {
                        clearInterval(glitchInterval)
                        document.title = baseTitle
                        isGlitching = false
                    }
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
                            {/* Routes publiques */}
                            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                            <Route path="/projets" element={<PageTransition><Projects /></PageTransition>} />
                            <Route path="/projets/:id" element={<PageTransition><Project /></PageTransition>} />
                            <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
                            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />

                            {/* Auth */}
                            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />

                            {/* Second cerveau — protégé */}
                            <Route path="/brain" element={
                                <ProtectedRoute>
                                    <PageTransition><BrainPage /></PageTransition>
                                </ProtectedRoute>
                            } />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </AnimatePresence>
                </Suspense>

                <AnimatePresence>
                    {showFooter && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Footer />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AuthProvider>
    )
}