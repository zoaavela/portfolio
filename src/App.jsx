import { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Lazy loading for pages
const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const Project = lazy(() => import('./pages/Project'))
const Blog = lazy(() => import('./pages/Blog'))
const Contact = lazy(() => import('./pages/Contact'))

// Transition "Directe" : On ne voit jamais l'ancienne page sortir
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
    const showFooter = location.pathname !== '/parcours' && location.pathname !== '/contact' && location.pathname !== '/'

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
        <div className="min-h-screen bg-[#0D0D0D]">
            <Navbar />
            <Suspense fallback={<LoadingFallback />}>
                <AnimatePresence mode="wait" initial={false}>
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                        <Route path="/projets" element={<PageTransition><Projects /></PageTransition>} />
                        <Route path="/projets/:id" element={<PageTransition><Project /></PageTransition>} />
                        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
                        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
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
    )
}

