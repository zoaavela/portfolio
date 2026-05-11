import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { getProjectById } from '../data/projects'
import { useLanguage } from '../context/LanguageContext'

// Lazy load heavy components
const PythonTerminal = lazy(() => import('../components/PythonTerminal'))
const JavaTerminal = lazy(() => import('../components/JavaTerminal'))
const LogCleanerDemo = lazy(() => import('../components/LogCleanerDemo'))
const LogGenerator = lazy(() => import('../components/LogGenerator'))

const TerminalLoading = () => (
    <div className="w-full h-[300px] flex items-center justify-center bg-[#0A0A0A] border border-[#1A1A1A]">
        <div className="font-mono text-[10px] text-[#333] animate-pulse uppercase tracking-widest">
            Initializing Environment...
        </div>
    </div>
)

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.76, 0, 0.24, 1] }
})

export default function Project() {
    const { id } = useParams()
    const project = getProjectById(id)
    const { t, lang } = useLanguage()

    if (!project) {
        return (
            <main className="pt-14 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-ghost)' }}>
                        404
                    </p>
                    <Link to="/projets" className="font-bebas text-4xl mt-4 block" style={{ color: 'var(--text-primary)' }}>
                        {t({ FR: 'RETOUR', EN: 'BACK' })}
                    </Link>
                </div>
            </main>
        )
    }

    const stack = project.tech_stack?.display || [
        ...(project.tech_stack?.frontend || []),
        ...(project.tech_stack?.backend || []),
    ].slice(0, 6)

    const accentColor = project.accent || '#F0EDE8'

    return (
        <main className="min-h-screen pb-40 font-grotesk" style={{ background: '#0D0D0D', color: '#F0EDE8' }}>

            {/* ── HEADER ── */}
            <header className="pt-32 pb-24 px-7">
                <div className="max-w-6xl mx-auto">
                    <motion.div {...fadeUp(0)}>
                        <Link
                            to="/projets"
                            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase mb-16 text-[#555] hover:text-[#f0ede8] transition-colors"
                        >
                            <span>←</span>
                            <span>{t({ FR: 'Retour au portfolio', EN: 'Back to portfolio' })}</span>
                        </Link>
                    </motion.div>

                    <motion.h1
                        {...fadeUp(0.1)}
                        className="font-bebas leading-[0.8] tracking-tighter mb-12 text-offwhite"
                        style={{ fontSize: 'clamp(80px, 15vw, 180px)' }}
                    >
                        {t(project.meta?.title)}
                    </motion.h1>

                    <div className="max-w-4xl">
                        <motion.p {...fadeUp(0.2)} className="text-3xl md:text-5xl leading-[1.05] tracking-tight font-medium text-offwhite mb-20">
                            {t(project.meta?.pitch)}
                        </motion.p>
                    </div>

                    {/* Quick Info Grid */}
                    <motion.div {...fadeUp(0.25)} className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 py-12 border-y border-[#1A1A1A]">
                        <div>
                            <span className="block font-mono text-[9px] uppercase tracking-[0.2em] mb-3 text-[#444]">{t({ FR: 'Rôle', EN: 'Role' })}</span>
                            <span className="text-sm uppercase tracking-wider font-medium text-[#888]">{t(project.meta?.role)?.split(' / ')[0]}</span>
                        </div>
                        <div>
                            <span className="block font-mono text-[9px] uppercase tracking-[0.2em] mb-3 text-[#444]">{t({ FR: 'Contexte', EN: 'Context' })}</span>
                            <span className="text-sm uppercase tracking-wider font-medium text-[#888]">{t(project.meta?.category || project.meta?.subtitle)}</span>
                        </div>
                        <div>
                            <span className="block font-mono text-[9px] uppercase tracking-[0.2em] mb-3 text-[#444]">{t({ FR: 'Période', EN: 'Period' })}</span>
                            <span className="text-sm uppercase tracking-wider font-medium text-[#888]">{t(project.meta?.period)}</span>
                        </div>
                        <div>
                            <span className="block font-mono text-[9px] uppercase tracking-[0.2em] mb-3 text-[#444]">Stack</span>
                            <span className="text-sm uppercase tracking-wider font-medium text-[#888]">
                                {stack.slice(0, 3).map(s => t(s)).join(' / ')}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* ── NARRATIVE ── */}
            <section className="px-7 py-24">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                        <div className="md:col-span-12 lg:col-span-3">
                            <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.15em] text-[#333] mb-8">{t({ FR: "L'APPROCHE", EN: 'THE APPROACH' })}</h2>
                        </div>
                        <div className="md:col-span-12 lg:col-span-9 max-w-3xl">
                            <div className="text-xl md:text-2xl leading-[1.6] text-[#999] space-y-12">
                                {t(project.description?.long)
                                    ? t(project.description.long).split('\n\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))
                                    : <p>{t({ FR: 'Aucune description détaillée disponible.', EN: 'No detailed description available.' })}</p>
                                }
                            </div>

                            {project.description?.data_source && (
                                <div className="mt-20 p-8 border-l border-[#222] bg-[#0A0A0A]">
                                    <span className="block font-mono text-[9px] uppercase tracking-[0.2em] mb-4 text-[#444]">{t({ FR: 'Notes Techniques', EN: 'Technical Notes' })}</span>
                                    <p className="text-sm leading-relaxed text-[#555]">{t(project.description.data_source)}</p>
                                    {project.description?.data_note && (
                                        <p className="text-xs mt-4 text-[#444] italic leading-relaxed">{t(project.description.data_note)}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── DÉMONSTRATION ── */}
            {project.id === 'passwordgenerator' ? (
                <section className="px-7 py-24 border-y border-[#1A1A1A] bg-[#090909]">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-end mb-12">
                            <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.15em] text-[#333]">{t({ FR: 'DÉMONSTRATION', EN: 'DEMONSTRATION' })}</h2>
                            {project.links?.repository && (
                                <a
                                    href={project.links.repository}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#444] hover:text-offwhite border-b border-transparent hover:border-offwhite pb-1 transition-all"
                                >
                                    Source GitHub ↗
                                </a>
                            )}
                        </div>
                        <Suspense fallback={<TerminalLoading />}>
                            <PythonTerminal />
                        </Suspense>
                    </div>
                </section>
            ) : project.id === 'javabanking' ? (
                <section className="px-7 py-24 border-y border-[#1A1A1A] bg-[#090909]">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-end mb-12">
                            <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.15em] text-[#333]">{t({ FR: 'DÉMONSTRATION', EN: 'DEMONSTRATION' })}</h2>
                            {project.links?.repository && (
                                <a
                                    href={project.links.repository}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#444] hover:text-offwhite border-b border-transparent hover:border-offwhite pb-1 transition-all"
                                >
                                    Source GitHub ↗
                                </a>
                            )}
                        </div>
                        <Suspense fallback={<TerminalLoading />}>
                            <JavaTerminal />
                        </Suspense>
                    </div>
                </section>
            ) : project.id === 'logcleaner' ? (
                <section className="px-7 py-24 border-y border-[#1A1A1A] bg-[#090909]">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-end mb-12">
                            <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.15em] text-[#333]">{t({ FR: 'DÉMONSTRATION', EN: 'DEMONSTRATION' })}</h2>
                            <a href={project.links?.repository} target="_blank" rel="noreferrer"
                                className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#444] hover:text-offwhite border-b border-transparent hover:border-offwhite pb-1 transition-all">
                                Source GitHub ↗
                            </a>
                        </div>
                        <Suspense fallback={<TerminalLoading />}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                <div>
                                    <p className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{ color: '#333' }}>
                                        01 — {t({ FR: 'Générez un log sale', EN: 'Generate a dirty log' })}
                                    </p>
                                    <LogGenerator />
                                </div>
                                <div>
                                    <p className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{ color: '#333' }}>
                                        02 — {t({ FR: 'Glissez-le ici pour le nettoyer', EN: 'Drop it here to clean it' })}
                                    </p>
                                    <LogCleanerDemo />
                                </div>
                            </div>
                        </Suspense>
                    </div>
                </section>

            ) : project.links?.demo && (
                <section className="px-7 py-24 border-y border-[#1A1A1A] bg-[#090909]">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-wrap justify-between items-end mb-12 gap-8">
                            <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.15em] text-[#333]">{t({ FR: 'DÉMONSTRATION', EN: 'DEMONSTRATION' })}</h2>
                            <div className="flex gap-10">
                                <a
                                    href={project.links.demo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] font-mono uppercase tracking-[0.2em] border-b border-[#222] hover:border-offwhite pb-1 font-bold transition-all"
                                >
                                    {t({ FR: 'Déploiement Web', EN: 'Web Deployment' })} ↗
                                </a>
                                {project.links?.repository && (
                                    <a
                                        href={project.links.repository}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#444] hover:text-offwhite border-b border-transparent hover:border-offwhite pb-1 transition-all"
                                    >
                                        Source GitHub ↗
                                    </a>
                                )}
                            </div>
                        </div>
                        <motion.div
                            {...fadeUp(0.1)}
                            className="w-full overflow-hidden bg-black"
                            style={{ border: '1px solid #1A1A1A', height: '680px' }}
                        >
                            <iframe
                                src={project.links.demo}
                                title={t(project.meta?.title)}
                                className="w-full h-full opacity-80 hover:opacity-100 transition-opacity duration-700"
                                style={{ border: 'none' }}
                                loading="lazy"
                            />
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ── MODULES ── */}
            {project.modules?.length > 0 && (
                <section className="px-7 py-32 border-b border-[#1A1A1A]">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.15em] text-[#333] mb-16">{t({ FR: 'SYSTÈME & MODULES', EN: 'SYSTEM & MODULES' })}</h2>
                        <div className="space-y-20">
                            {project.modules.map((mod, i) => (
                                <div key={mod.id || i} className="border-b border-[#111] pb-12 last:border-0">
                                    <div className="flex items-center gap-6 mb-6">
                                        <span className="font-mono text-[9px] text-[#222]">0{i + 1}</span>
                                        <h3 className="text-2xl font-medium tracking-tight text-[#BBB]">{t(mod.name)}</h3>
                                    </div>
                                    <p className="text-base leading-relaxed text-[#666] mb-6 max-w-xl">{t(mod.description)}</p>
                                    {mod.granularity && (
                                        <div className="flex flex-wrap gap-2">
                                            {mod.granularity.map((g, j) => (
                                                <span key={j} className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 border border-[#1a1a1a] text-[#444]">{t(g)}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── DÉFIS ── */}
            {project.challenges?.length > 0 && (
                <section className="px-7 py-32 border-b border-[#1A1A1A]">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.15em] text-[#333] mb-16">{t({ FR: 'DÉFIS & RÉSOLUTIONS', EN: 'CHALLENGES & RESOLUTIONS' })}</h2>
                        <div className="space-y-16">
                            {project.challenges.map((c, i) => (
                                <div key={i} className="bg-[#090909] p-8 border border-[#151515]">
                                    <div className="flex gap-6 mb-6">
                                        <span className="font-bebas text-3xl text-[#1a1a1a]">{String(i + 1).padStart(2, '0')}</span>
                                        <h3 className="text-xl font-medium tracking-tight text-[#999]">{t(c.title)}</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-sm leading-relaxed text-[#555] italic">"{t(c.description)}"</p>
                                        <p className="text-sm leading-relaxed text-[#888] pl-6 border-l border-[#222]">{t(c.resolution)}</p>
                                        {c.lesson && (
                                            <p className="text-xs mt-2 leading-relaxed pl-6" style={{ color: accentColor }}>
                                                → {t(c.lesson)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── RÉSULTATS ── */}
            {project.results_and_impact && (
                <section className="px-7 py-32">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                            <div className="lg:col-span-3">
                                <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.15em] text-[#333]">{t({ FR: 'RÉSULTATS', EN: 'RESULTS' })}</h2>
                            </div>
                            <div className="lg:col-span-9">
                                <p className="text-2xl md:text-3xl leading-relaxed text-[#BBB] mb-20 max-w-3xl">
                                    {t(project.results_and_impact.summary)}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
                                    {project.results_and_impact.key_learnings?.map((l, i) => (
                                        <div key={i} className="flex gap-6 text-base items-start py-6 border-b border-[#151515] last:border-0 md:last:border-b">
                                            <span className="font-mono text-[9px] text-[#333] mt-2">/{i + 1}</span>
                                            <span className="text-[#666] leading-relaxed">{t(l)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── FOOTER ── */}
            <footer className="mt-40 pt-20 px-7 border-t border-[#1A1A1A]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-16 md:gap-0 pb-32">
                    <div>
                        <span className="block font-mono text-[9px] uppercase tracking-widest mb-6 text-[#222]">Navigation</span>
                        <Link to="/projets" className="font-bebas text-4xl md:text-5xl text-[#333] hover:text-offwhite transition-colors">
                            {t({ FR: 'Retour aux projets', EN: 'Back to projects' })}
                        </Link>
                    </div>
                    <div className="text-left md:text-right">
                        <span className="block font-mono text-[9px] uppercase tracking-widest mb-6 text-[#222]">{t({ FR: 'Projet Suivant', EN: 'Next Project' })}</span>
                        <Link
                            to="/projets"
                            className="font-bebas text-6xl md:text-8xl lg:text-9xl text-[#555] hover:text-offwhite group flex items-center gap-6 md:gap-10 tracking-tighter leading-none transition-colors"
                        >
                            {t({ FR: 'PROJET', EN: 'PROJECT' })} <span className="group-hover:translate-x-6 transition-transform inline-block">→</span>
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    )
}