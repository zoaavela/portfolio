import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
    { label: 'PROJETS', href: '/projets' },
    { label: 'PARCOURS', href: '/parcours' },
    { label: 'BLOG', href: '/blog' },
    { label: 'CONTACT', href: '/contact' },
]

export default function Navbar() {
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [lang, setLang] = useState('FR')
    const [theme, setTheme] = useState('dark')

    // Fermeture automatique du menu au changement de page
    // Cela garantit que le menu reste opaque jusqu'à ce que la nouvelle page soit chargée
    useEffect(() => {
        setOpen(false)
    }, [location.pathname])

    const toggleLang = () => setLang(lang === 'FR' ? 'EN' : 'FR')
    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-7 h-14 border-b border-[#161616] bg-[#0D0D0D]">
                <Link to="/" className="font-bebas text-xl text-offwhite tracking-widest">
                    ENZO.
                </Link>

                <div className="flex items-center gap-5 md:gap-7">
                    {/* Bouton Langue */}
                    <button
                        onClick={toggleLang}
                        className="font-mono text-[10px] tracking-[0.2em] text-[#666] hover:text-offwhite transition-colors"
                    >
                        {lang === 'FR' ? 'FR/EN' : 'EN/FR'}
                    </button>

                    {/* Ligne séparatrice subtile */}
                    <div className="w-px h-3 bg-[#222]"></div>

                    {/* Bouton Thème */}
                    <button
                        onClick={toggleTheme}
                        className="text-[#666] hover:text-offwhite transition-colors"
                    >
                        {theme === 'dark' ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        )}
                    </button>

                    <div className="w-px h-3 bg-[#222] hidden md:block"></div>

                    {/* Bouton Menu */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="text-offwhite hover:text-[#888] transition-colors ml-1 flex items-center gap-2 group"
                    >
                        <span className="font-mono text-[10px] tracking-widest uppercase hidden md:block">
                            {open ? 'FERMER' : 'MENU'}
                        </span>
                        {open ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <line x1="3" y1="9" x2="21" y2="9" />
                                <line x1="3" y1="15" x2="15" y2="15" className="group-hover:x2-21 transition-all duration-300" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="fixed inset-0 z-40 bg-[#0D0D0D] flex flex-col justify-center px-7"
                    >
                        {links.map((link, i) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 + 0.05, duration: 0.5 }}
                                className="border-b border-[#111] first:border-t py-2 flex justify-center group cursor-pointer"
                            >
                                <Link
                                    to={link.href}
                                    className="font-bebas text-[82px] leading-none tracking-wider text-[#161616] group-hover:text-offwhite group-hover:tracking-[0.10em] transition-all duration-200"
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}