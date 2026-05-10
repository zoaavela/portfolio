import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import { useLanguage } from '../context/LanguageContext'

// --- COMPONENTS ---

function SectionDivider({ title }) {
    return (
        <div className="flex items-center gap-4 mb-6 mt-16 first:mt-0">
            <span className="font-mono text-[10px] text-[#555] tracking-[0.2em] uppercase whitespace-nowrap">{title}</span>
            <div className="h-[1px] flex-grow bg-[#161616]"></div>
        </div>
    )
}

function ProjectCard({ p, lang, className = '' }) {
    const isClickable = projects.some(proj => proj.id === p.id)

    const CardContent = (
        <div
            className={`group break-inside-avoid bg-[#111] border ${p.type === 'main' ? 'border-[#202020]' : 'border-[#1A1A1A]'} ${isClickable ? 'cursor-pointer' : 'cursor-default'} relative overflow-hidden block w-full ${p.height} ${className}`}
        >
            {/* Image / Gradient Hover */}
            <div className={`absolute inset-0 z-0 opacity-0 transition-opacity duration-300 ease-in-out ${isClickable ? 'group-hover:opacity-100' : ''} ${p.bg}`}></div>

            {/* Glass Overlay */}
            <div className="absolute inset-0 z-0 bg-[#0D0D0D]/60 opacity-0 transition-opacity duration-300 ${isClickable ? 'group-hover:opacity-100' : ''}"></div>

            {/* Arrow */}
            {isClickable && (
                <span className="absolute top-4 right-4 text-[14px] text-[#1A1A1A] transition-all duration-200 z-20 group-hover:text-offwhite group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
                    ↗
                </span>
            )}

            {/* Content */}
            <div className="p-5 flex flex-col justify-end h-full relative z-10">
                <div className="font-mono text-[9px] text-[#232323] tracking-[0.12em] mb-2 transition-colors duration-200 group-hover:text-[#444]">
                    {p.id.toUpperCase()}{p.type === 'main' && isClickable ? (lang === 'FR' ? ' · Principal' : ' · Main') : ''}
                </div>
                <div className={`font-bebas tracking-[0.04em] leading-none transition-colors duration-200 group-hover:text-offwhite ${p.type === 'main' ? 'text-[36px] text-[#383838]' : 'text-[24px] text-[#2A2A2A]'}`}>
                    {p.title}
                </div>
                <div className="text-[10px] text-[#1E1E1E] mt-1.5 tracking-[0.06em] uppercase transition-colors duration-200 group-hover:text-[#555]">
                    {p.stack}
                </div>
            </div>
        </div>
    )

    if (isClickable) {
        return <Link to={`/projets/${p.id}`}>{CardContent}</Link>
    }

    return CardContent
}

export default function Projects() {
    const { t, lang } = useLanguage()

    // Only Vision is a "Main" project for now
    const visionProject = projects.find(p => p.id === 'vision')

    const mainProjects = [
        // 1. Vision
        ...(visionProject ? [{
            id: visionProject.id,
            type: 'main',
            height: 'h-[320px]',
            title: visionProject.meta.title.toUpperCase(),
            stack: visionProject.tech_stack?.frontend?.slice(0, 3).join(' · '),
            bg: 'bg-[linear-gradient(160deg,#1A1A2E,#0D0D0D)]'
        }] : []),
        // 2. Placeholder 1
        { id: 'placeholder-1', type: 'main', height: 'h-[320px]', title: t({ FR: 'À VENIR', EN: 'COMING SOON' }), stack: 'Data Engineering', bg: 'bg-[#111]' },
        // 3. Placeholder 2
        { id: 'placeholder-2', type: 'main', height: 'h-[320px]', title: t({ FR: 'À VENIR', EN: 'COMING SOON' }), stack: 'Machine Learning', bg: 'bg-[#111]' },
    ].slice(0, 3)

    // All other projects go to secondary
    const otherProjectsFromData = projects
        .filter(p => p.id !== 'vision')
        .map(p => ({
            id: p.id,
            title: p.meta.title.toUpperCase(),
            stack: p.tech_stack?.display?.[0] || p.tech_stack?.frontend?.[0] || p.tech_stack?.backend?.[0] || t({ FR: 'Projet Web', EN: 'Web Project' }),
            isPlaceholder: false
        }))

    // Fill up the 9 slots for the secondary grid
    const secondaryProjects = Array.from({ length: 9 }).map((_, i) => {
        const realProject = otherProjectsFromData[i]

        // Staggered height pattern to create "nested bricks" effect
        const columnPatterns = [
            ['h-[220px]', 'h-[150px]', 'h-[180px]'], // Col 1
            ['h-[150px]', 'h-[220px]', 'h-[180px]'], // Col 2
            ['h-[180px]', 'h-[150px]', 'h-[220px]'], // Col 3
        ]
        const colIndex = Math.floor(i / 3)
        const rowIndex = i % 3
        const height = columnPatterns[colIndex][rowIndex]

        if (realProject) {
            return {
                ...realProject,
                type: 'secondary',
                height,
                bg: 'bg-[linear-gradient(135deg,#1A1A1A,#0D0D0D)]'
            }
        }

        // Placeholders
        const placeholders = [
            { title: 'SQL OPTIMIZER', stack: 'PostgreSQL · dbt' },
            { title: 'DASHBOARD BI', stack: 'Power BI · DAX' },
            { title: 'DATA WAREHOUSE', stack: 'Snowflake · SQL' },
            { title: 'RECOMMENDER', stack: 'Python · Scikit-Learn' },
            { title: 'MLOPS PIPELINE', stack: 'MLflow · Kubernetes' },
        ]
        const ph = placeholders[i - otherProjectsFromData.length] || placeholders[0]

        return {
            id: `placeholder-s-${i}`,
            type: 'secondary',
            height,
            title: ph.title,
            stack: ph.stack,
            bg: 'bg-[#111]',
            isPlaceholder: true
        }
    })

    return (
        <main className="pt-24 px-7 pb-12 min-h-screen bg-[#0D0D0D] font-grotesk">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="font-bebas text-5xl text-offwhite tracking-widest mb-4">
                        {t({ FR: 'PROJETS', EN: 'PROJECTS' })}
                    </h1>
                </div>

                <SectionDivider title={t({ FR: "Data et IA", EN: "Data and AI" })} />

                {/* 3 Main Projects in a Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-[6px]">
                    {mainProjects.map((p) => (
                        <ProjectCard key={p.id} p={p} lang={lang} />
                    ))}
                </div>

                <SectionDivider title={t({ FR: "Autres projets", EN: "Other projects" })} />

                {/* 9 Secondary Projects in Perfect Rectangle Masonry */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[6px]">
                    <div className="flex flex-col gap-[6px]">
                        {secondaryProjects.slice(0, 3).map(p => <ProjectCard key={p.id} p={p} lang={lang} />)}
                    </div>
                    <div className="flex flex-col gap-[6px]">
                        {secondaryProjects.slice(3, 6).map(p => <ProjectCard key={p.id} p={p} lang={lang} />)}
                    </div>
                    <div className="flex flex-col gap-[6px]">
                        {secondaryProjects.slice(6, 9).map(p => <ProjectCard key={p.id} p={p} lang={lang} />)}
                    </div>
                </div>
            </div>
        </main>
    )
}