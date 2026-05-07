import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="border-t border-[#161616] px-7 py-20 md:py-32 flex flex-col gap-16 md:gap-24 bg-[#0D0D0D]">

            {/* HAUT DU FOOTER : Gros texte et Liens */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-16 md:gap-0 max-w-7xl mx-auto w-full">

                {/* Left side: Massive Text */}
                <div className="flex flex-col gap-6">
                    <h2 className="font-bebas text-7xl md:text-9xl text-offwhite tracking-widest leading-[0.85] drop-shadow-lg">
                        LET'S BUILD<br />SOMETHING.
                    </h2>
                    <a href="mailto:hello@enzo.com" className="font-mono text-sm md:text-base tracking-[0.2em] text-[#888] hover:text-offwhite transition-colors w-fit">
                        HELLO@ENZO.COM
                    </a>
                </div>

                {/* Right side: Links */}
                <div className="flex gap-16 md:gap-24 mt-4 md:mt-0">
                    <div className="flex flex-col gap-4">
                        <span className="font-mono text-[10px] tracking-widest uppercase text-[#444] mb-2">Réseaux</span>
                        <a href="#" className="font-mono text-xs tracking-[0.2em] uppercase text-[#888] hover:text-offwhite transition-colors">LinkedIn</a>
                        <a href="#" className="font-mono text-xs tracking-[0.2em] uppercase text-[#888] hover:text-offwhite transition-colors">GitHub</a>
                        <a href="#" className="font-mono text-xs tracking-[0.2em] uppercase text-[#888] hover:text-offwhite transition-colors">Twitter</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="font-mono text-[10px] tracking-widest uppercase text-[#444] mb-2">Navigation</span>
                        <Link to="/projets" className="font-mono text-xs tracking-[0.2em] uppercase text-[#888] hover:text-offwhite transition-colors">Projets</Link>
                        <Link to="/parcours" className="font-mono text-xs tracking-[0.2em] uppercase text-[#888] hover:text-offwhite transition-colors">Parcours</Link>
                        <Link to="/contact" className="font-mono text-xs tracking-[0.2em] uppercase text-[#888] hover:text-offwhite transition-colors">Contact</Link>
                    </div>
                </div>
            </div>

            {/* BAS DU FOOTER : Logo, CV et Copyright */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 pt-10 border-t border-[#161616] max-w-7xl mx-auto w-full">

                <span className="font-bebas text-3xl md:text-4xl text-[#555] tracking-widest hidden md:block">ENZO.</span>

                <a
                    href="/cv_enzo.pdf"
                    download="CV_Enzo.pdf"
                    className="flex items-center gap-3 text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#0D0D0D] bg-offwhite px-8 py-4 hover:bg-[#CCC] transition-all duration-300 w-full md:w-auto justify-center"
                >
                    <span>TÉLÉCHARGER CV</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </a>

                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#333]">
                    © {new Date().getFullYear()} ENZO. TOUS DROITS RÉSERVÉS.
                </span>
            </div>

        </footer>
    )
}