import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
    const { t } = useLanguage()
    
    return (
        <footer className="border-t border-[#161616] px-7 py-6 flex flex-col md:flex-row gap-6 md:gap-0 items-center justify-between">
            <span className="font-bebas text-lg text-offwhite tracking-widest">ENZO.</span>
            
            <div className="flex items-center gap-5 md:gap-7">
                {/* Bouton de téléchargement de CV */}
                <a 
                    href="/cv_enzo.pdf" 
                    download="CV_Enzo.pdf"
                    className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-offwhite border border-[#333] px-4 py-2 hover:bg-offwhite hover:text-[#0D0D0D] transition-all duration-300"
                >
                    <span>CV</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </a>

                {/* Liens sociaux */}
                <a href="https://www.linkedin.com/in/abdienzo/" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-widest uppercase text-[#555] hover:text-offwhite transition-colors">LinkedIn</a>
                <a href="https://github.com/zoaavela" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-widest uppercase text-[#555] hover:text-offwhite transition-colors">GitHub</a>
                <a href="mailto:enzooabdi@gmail.com" className="text-[10px] tracking-widest uppercase text-[#555] hover:text-offwhite transition-colors">{t({ FR: 'Mail', EN: 'Email' })}</a>
            </div>
        </footer>
    )
}