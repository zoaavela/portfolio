import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import BigFooter from '../components/BigFooter'

const featuredProjects = [
    {
        id: 1,
        title: "KNOWLEDGE GRAPH",
        category: "DATA ARCHITECTURE",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
    },
    {
        id: 2,
        title: "PREDICTIVE ENGINE",
        category: "MACHINE LEARNING",
        image: "https://images.unsplash.com/photo-1620825937374-87fc7d6aaf09?auto=format&fit=crop&w=1200&q=80"
    },
    {
        id: 3,
        title: "LLM ORCHESTRATION",
        category: "GENERATIVE AI",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80"
    }
]

export default function Home() {
    return (
        <main className="bg-[#0D0D0D] h-[100dvh] w-full text-offwhite font-grotesk overflow-x-hidden overflow-y-auto md:snap-y md:snap-mandatory scroll-smooth">

            {/* SECTION 1 : HERO & NAVIGATION */}
            <section className="min-h-[100dvh] md:h-[100dvh] w-full md:snap-start flex flex-col items-center justify-center py-20 md:py-0 md:pt-14 px-7 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h1 className="font-bebas text-[20vw] md:text-[14vw] leading-[0.8] tracking-widest text-offwhite drop-shadow-lg">
                        ENZO.
                    </h1>
                    <div className="w-px h-12 md:h-16 bg-[#333] mx-auto my-6 md:my-8"></div>
                    <p className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-[#888] uppercase max-w-lg mx-auto leading-relaxed">
                        Data & AI Engineer <br className="md:hidden" />crafting intelligent systems.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="w-full max-w-5xl mx-auto"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <Link to="/projets" className="border border-[#222] flex items-center justify-center h-20 md:h-28 hover:bg-offwhite hover:text-[#0D0D0D] transition-colors group">
                            <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase">Projets</span>
                        </Link>
                        <Link to="/parcours" className="border border-[#222] flex items-center justify-center h-20 md:h-28 hover:bg-offwhite hover:text-[#0D0D0D] transition-colors group">
                            <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase">Parcours</span>
                        </Link>
                        <Link to="/contact" className="border border-[#222] flex items-center justify-center h-20 md:h-28 hover:bg-offwhite hover:text-[#0D0D0D] transition-colors group">
                            <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase">Contact</span>
                        </Link>
                        <div className="border border-[#111] bg-[#0A0A0A] flex flex-col items-center justify-center h-20 md:h-28 cursor-not-allowed relative">
                            <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#333]">Le Lab</span>
                            <span className="font-mono text-[7px] tracking-widest uppercase text-[#444] mt-1 md:mt-2">En construction</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* SECTION 2 : PROJETS PHARES */}
            <section className="min-h-[100dvh] md:h-[100dvh] w-full md:snap-start flex flex-col items-center justify-center py-20 md:py-0 md:pt-14 px-7 relative">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1 }}
                    className="w-full max-w-7xl mx-auto"
                >
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="font-bebas text-3xl md:text-4xl tracking-widest text-[#555]">PROJETS PHARES</h2>
                        <div className="w-px h-6 md:h-8 bg-[#222] mx-auto mt-4 md:mt-6"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 lg:gap-16 max-w-5xl mx-auto">
                        {featuredProjects.map((project, idx) => (
                            <Link to={`/projets`} key={project.id} className="group block">
                                <div className="aspect-[4/3] md:aspect-[4/5] bg-[#111] overflow-hidden relative border border-[#1A1A1A] p-2">
                                    <div className="w-full h-full relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[#0D0D0D]/60 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-6 text-center">
                                    <h3 className="font-bebas text-xl md:text-2xl lg:text-3xl tracking-widest text-offwhite group-hover:text-[#888] transition-colors">{project.title}</h3>
                                    <p className="font-mono text-[8px] md:text-[9px] text-[#555] tracking-[0.2em] uppercase mt-2">{project.category}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* SECTION 3 : FOOTER */}
            <section className="min-h-screen md:h-[100dvh] w-full md:snap-start flex flex-col justify-end">
                <BigFooter />
            </section>

        </main>
    )
}