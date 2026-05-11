import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import BigFooter from '../components/BigFooter'
import { useLanguage } from '../context/LanguageContext'

export default function Home() {
    const { t } = useLanguage()
    const containerRef = useRef(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY })
        window.addEventListener('mousemove', handleMouse)
        return () => window.removeEventListener('mousemove', handleMouse)
    }, [])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const featuredProjects = [
        {
            id: 'vision',
            title: t({ FR: "Vision", EN: "Vision" }),
            category: t({ FR: "Data Viz", EN: "Data Viz" }),
            num: "01",
            locked: false
        },
        {
            id: 'predictive',
            title: t({ FR: "Prédiction", EN: "Predictive" }),
            category: t({ FR: "Moteur ML", EN: "ML Engine" }),
            num: "02",
            locked: true
        },
        {
            id: 'llm',
            title: t({ FR: "Orchestra", EN: "Orchestra" }),
            category: t({ FR: "IA Générative", EN: "Gen AI" }),
            num: "03",
            locked: true
        }
    ]

    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

    return (
        <main ref={containerRef} className="bg-[#0D0D0D] w-full text-offwhite font-grotesk overflow-x-hidden selection:bg-offwhite selection:text-[#0D0D0D]">

            {/* --- SECTION 1 : PERSPECTIVE GRID HERO --- */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">

                <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ perspective: '1000px' }}>
                    <motion.div
                        animate={{
                            rotateX: 60 + (mousePos.y - window.innerHeight / 2) * 0.01,
                            rotateY: (mousePos.x - window.innerWidth / 2) * 0.01
                        }}
                        className="absolute inset-0 flex items-center justify-center translate-y-1/4"
                    >
                        <div className="w-[200vw] h-[200vw] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
                    </motion.div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>

                <motion.div
                    style={{ opacity, scale }}
                    className="relative z-10 flex flex-col items-center text-center"
                >
                    <h1 className="font-bebas text-[18vw] md:text-[14vw] leading-none tracking-tighter text-offwhite drop-shadow-2xl">
                        ENZO ABDI<span className="text-[#333]">.</span>
                    </h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-16 flex flex-col items-center"
                    >
                        <p className="font-mono text-[10px] tracking-[0.2em] text-[#444] uppercase max-w-xs leading-relaxed mb-12">
                            {t({
                                FR: 'Bâtir le futur de l\'intelligence par l\'ingénierie de données.',
                                EN: 'Building the future of intelligence through data engineering.'
                            })}
                        </p>

                        <div className="flex gap-12">
                            <Link to="/projets" className="group flex flex-col items-center">
                                <span className="font-bebas text-3xl tracking-widest text-[#666] group-hover:text-offwhite transition-colors">{t({ FR: 'PROJETS', EN: 'PROJECTS' })}</span>
                                <div className="w-2 h-2 rounded-full bg-[#222] group-hover:bg-offwhite transition-all duration-300 mt-2"></div>
                            </Link>
                            <div className="flex flex-col items-center opacity-30 grayscale cursor-not-allowed">
                                <span className="font-bebas text-3xl tracking-widest text-[#333] transition-colors">{t({ FR: 'PARCOURS', EN: 'EXPERIENCE' })}</span>
                                <div className="w-2 h-2 rounded-full bg-[#111] mt-2"></div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="absolute bottom-12 w-1 h-24 bg-gradient-to-b from-[#111] to-transparent"></div>
            </section>

            {/* --- SECTION 2 : SELECTED WORK --- */}
            <section className="py-40 px-7 md:px-14 border-t border-[#111]">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-32 flex items-baseline gap-6">
                        <h2 className="font-bebas text-6xl md:text-8xl tracking-tighter text-offwhite uppercase">
                            {t({ FR: 'TRAVAUX', EN: 'WORKS' })}
                        </h2>
                        <div className="flex-grow h-px bg-[#111]"></div>
                        <p className="font-mono text-[9px] tracking-widest text-[#333] uppercase">01 — 03</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        {featuredProjects.map((p) => (
                            <Link
                                key={p.id}
                                to={p.locked ? "#" : "/projets"}
                                className={`group flex flex-col md:flex-row md:items-end justify-between py-16 border-b border-[#111] transition-all duration-700 ${p.locked ? 'opacity-50 cursor-not-allowed pointer-events-none grayscale' : 'hover:border-offwhite'}`}
                            >
                                <div className="flex items-baseline gap-10">
                                    <span className="font-mono text-[10px] text-[#222] transition-colors">{p.num}</span>
                                    <h3 className={`font-bebas text-6xl md:text-[10vw] leading-[0.8] transition-all duration-700 uppercase ${p.locked ? 'text-[#1A1A1A]' : 'text-[#1A1A1A] group-hover:text-offwhite'}`}>
                                        {p.locked ? t({ FR: 'À VENIR', EN: 'COMING SOON' }) : p.title}
                                    </h3>
                                </div>
                                <div className="mt-8 md:mt-0 flex flex-col items-end">
                                    <p className="font-mono text-[10px] tracking-[0.3em] text-[#333] uppercase mb-4">
                                        {p.locked ? p.category : p.category}
                                    </p>
                                    <div className={`w-0 h-px bg-offwhite transition-all duration-700 ${!p.locked && 'group-hover:w-full'}`}></div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-32">
                        <Link to="/projets" className="group font-mono text-[10px] tracking-[0.4em] text-[#444] hover:text-offwhite transition-colors uppercase flex items-center gap-2 w-fit">
                            <span>{t({ FR: 'Explorer tous les projets', EN: 'Explore all projects' })}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- SECTION 3 : THE LAB --- */}
            <section className="pt-60 pb-80 px-7 bg-[#E5E5E5] text-[#0D0D0D] opacity-50 grayscale transition-all duration-700">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <p className="font-mono text-[10px] tracking-[0.5em] uppercase text-[#777] mb-8">
                        {t({ FR: 'EXPÉRIMENTATIONS', EN: 'EXPERIMENTATIONS' })}
                    </p>
                    <h2 className="font-bebas text-7xl md:text-[10vw] leading-none tracking-tighter mb-16 opacity-30">
                        THE LAB<span className="text-[#999]">.</span>
                    </h2>
                    <p className="font-grotesk text-xl md:text-2xl leading-relaxed max-w-2xl mb-24 text-[#555]">
                        {t({
                            FR: 'Un espace dédié à la recherche en IA générative, à l\'analyse de données massives et à la création d\'outils innovants.',
                            EN: 'A space dedicated to generative AI research, massive data analysis, and the creation of innovative tools.'
                        })}
                    </p>
                    <div className="group relative px-16 py-8 border border-[#0D0D0D] overflow-hidden opacity-30 cursor-not-allowed">
                        <span className="relative z-10 font-bebas text-3xl tracking-[0.2em] transition-colors">
                            {t({ FR: 'À VENIR', EN: 'COMING SOON' })}
                        </span>
                    </div>
                </div>
            </section>

            <BigFooter />

        </main>
    )
}