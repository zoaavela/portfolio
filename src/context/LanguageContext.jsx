import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        // Essayer de récupérer la langue sauvegardée ou utiliser FR par défaut
        const saved = localStorage.getItem('portfolio_lang')
        return saved || 'FR'
    })

    useEffect(() => {
        localStorage.setItem('portfolio_lang', lang)
    }, [lang])

    const toggleLang = () => setLang(prev => (prev === 'FR' ? 'EN' : 'FR'))

    const t = (translations) => {
        if (typeof translations === 'string') return translations
        if (!translations) return ''
        return translations[lang] || translations['FR'] || ''
    }

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
