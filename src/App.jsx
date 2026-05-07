import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Project from './pages/Project'
import Parcours from './pages/Parcours'
import Blog from './pages/Blog'
import Contact from './pages/Contact'

export default function App() {
    const location = useLocation()
    // On cache le footer global sur l'accueil car il sera intégré dans le scroll-snap
    const showFooter = location.pathname !== '/parcours' && location.pathname !== '/contact' && location.pathname !== '/'

    // Effet "Glitch" pour le titre de l'onglet du navigateur
    useEffect(() => {
        const baseTitle = "enzo."
        const numbers = "0123456789"
        let isGlitching = false

        const interval = setInterval(() => {
            // 5% de chance de déclencher un glitch toutes les 100ms (soit environ 1 glitch toutes les 2s)
            if (!isGlitching && Math.random() > 0.95) {
                isGlitching = true
                let glitchTicks = 0
                const maxTicks = 4 + Math.floor(Math.random() * 4) // 4 à 8 rafraîchissements pendant le glitch

                const glitchInterval = setInterval(() => {
                    let currentTitle = ""
                    for (let i = 0; i < baseTitle.length; i++) {
                        // On ne touche pas au point final, et 50% de chance de transformer une lettre en chiffre
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
                    // Fin du glitch, on restaure le titre original
                    if (glitchTicks >= maxTicks) {
                        clearInterval(glitchInterval)
                        document.title = baseTitle
                        isGlitching = false
                    }
                }, 60) // Vitesse du scintillement (60ms)
            }
        }, 100) // Vérification toutes les 100ms

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-[#0D0D0D]">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projets" element={<Projects />} />
                <Route path="/projets/:id" element={<Project />} />
                <Route path="/parcours" element={<Parcours />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
            {showFooter && <Footer />}
        </div>
    )
}