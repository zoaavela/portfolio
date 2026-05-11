import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
    const { t } = useLanguage()
    
    return (
        <footer className="border-t border-[#161616] px-6 py-16 md:px-7 md:py-32 flex flex-col gap-12 md:gap-24 bg-[#0D0D0D]">

            {/* HAUT DU FOOTER : Gros texte et Liens */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-0 max-w-7xl mx-auto w-full">

                {/* Left side: Massive Text */}
                <div className="flex flex-col gap-4 md:gap-6">
                    <h2 className="font-bebas text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-offwhite tracking-widest leading-[0.9] drop-shadow-lg">
                        {t({ FR: "CONSTRUISONS", EN: "LET'S BUILD" })}<br />{t({ FR: "ENSEMBLE.", EN: "SOMETHING." })}
                    </h2>
                    <a href="mailto:enzooabdi@gmail.com" className="font-mono text-[10px] sm:text-xs md:text-base tracking-[0.2em] text-[#888] hover:text-offwhite transition-colors w-fit">
                        ENZOOABDI@GMAIL.COM
                    </a>
                </div>

                {/* Right side: Links */}
                <div className="grid grid-cols-2 gap-10 sm:gap-16 md:gap-24 mt-8 lg:mt-0">
                    <div className="flex flex-col gap-3 md:gap-4">
                        <span className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-[#444] mb-1 md:mb-2">{t({ FR: 'Réseaux', EN: 'Socials' })}</span>
                        <a href="https://www.linkedin.com/in/abdienzo/" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#888] hover:text-offwhite transition-colors">LinkedIn</a>
                        <a href="https://github.com/zoaavela" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#888] hover:text-offwhite transition-colors">GitHub</a>
                    </div>
                    <div className="flex flex-col gap-3 md:gap-4">
                        <span className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-[#444] mb-1 md:mb-2">Navigation</span>
                        <Link to="/projets" className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#888] hover:text-offwhite transition-colors">{t({ FR: 'Projets', EN: 'Projects' })}</Link>
                        {/* <Link to="/parcours" className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#888] hover:text-offwhite transition-colors">{t({ FR: 'Parcours', EN: 'Experience' })}</Link> */}
                        <Link to="/contact" className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#888] hover:text-offwhite transition-colors">Contact</Link>
                    </div>
                </div>
            </div>

            {/* BAS DU FOOTER : Logo, CV et Copyright */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-0 pt-10 border-t border-[#161616] max-w-7xl mx-auto w-full">

                <div className="md:flex-1 hidden md:block">
                    <span className="font-bebas text-3xl md:text-4xl text-[#555] tracking-widest">ENZO.</span>
                </div>

                <div className="flex justify-center md:flex-1">
                    <a
                        href="/CV_Enzo_Abdi.pdf"
                        download="CV_Enzo_Abdi.pdf"
                        className="flex items-center gap-3 text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#0D0D0D] bg-offwhite px-8 py-4 hover:bg-[#CCC] transition-all duration-300 w-full md:w-auto justify-center"
                    >
                        <span>{t({ FR: 'TÉLÉCHARGER CV', EN: 'DOWNLOAD CV' })}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </a>
                </div>

                <div className="md:flex-1 flex justify-center md:justify-end">
                    <span className="font-mono text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-[#333] text-center md:text-right">
                        © {new Date().getFullYear()} ENZO. {t({ FR: 'TOUS DROITS RÉSERVÉS.', EN: 'ALL RIGHTS RESERVED.' })}
                    </span>
                </div>
            </div>

        </footer>
    )
}