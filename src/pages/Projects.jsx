const mainProjects = [
    { id: '01', type: 'main', height: 'h-[320px]', title: 'VISION', stack: 'React · Symfony · Chart.js', bg: 'bg-[linear-gradient(160deg,#1A1A2E,#0D0D0D)]' },
    { id: '02', type: 'main', height: 'h-[320px]', title: 'TIBET', stack: 'React · Three.js · Blender', bg: 'bg-[linear-gradient(160deg,#1A2E1A,#0D0D0D)]' },
    { id: '03', type: 'main', height: 'h-[320px]', title: 'ETL ARCHI', stack: 'Spark · dbt · Airflow', bg: 'bg-[linear-gradient(160deg,#2E1A1A,#0D0D0D)]' },
];

const secondaryProjects = [
    // Column 1 (220 + 150 + 180 = 550)
    { id: '04', type: 'secondary', height: 'h-[220px]', title: 'SCRAPING TOOL', stack: 'Python · BS4', bg: 'bg-[linear-gradient(135deg,#1A1A1A,#0D0D0D)]' },
    { id: '05', type: 'secondary', height: 'h-[150px]', title: 'NLP CLASSIFIER', stack: 'BERT · HuggingFace', bg: 'bg-[linear-gradient(135deg,#111111,#0D0D0D)]' },
    { id: '06', type: 'secondary', height: 'h-[180px]', title: 'API REST', stack: 'FastAPI · Docker', bg: 'bg-[linear-gradient(135deg,#1A1A1A,#0D0D0D)]' },
    
    // Column 2 (150 + 220 + 180 = 550)
    { id: '07', type: 'secondary', height: 'h-[150px]', title: 'DATA VIZ ART', stack: 'D3.js · Observable', bg: 'bg-[linear-gradient(135deg,#111111,#0D0D0D)]' },
    { id: '08', type: 'secondary', height: 'h-[220px]', title: 'SQL OPTIMIZER', stack: 'PostgreSQL · dbt', bg: 'bg-[linear-gradient(135deg,#1A1A1A,#0D0D0D)]' },
    { id: '09', type: 'secondary', height: 'h-[180px]', title: 'DASHBOARD BI', stack: 'Power BI · DAX', bg: 'bg-[linear-gradient(135deg,#111111,#0D0D0D)]' },
    
    // Column 3 (180 + 150 + 220 = 550)
    { id: '10', type: 'secondary', height: 'h-[180px]', title: 'DATA WAREHOUSE', stack: 'Snowflake · SQL', bg: 'bg-[linear-gradient(135deg,#1A1A1A,#0D0D0D)]' },
    { id: '11', type: 'secondary', height: 'h-[150px]', title: 'RECOMMENDER', stack: 'Python · Scikit-Learn', bg: 'bg-[linear-gradient(135deg,#1A1A1A,#0D0D0D)]' },
    { id: '12', type: 'secondary', height: 'h-[220px]', title: 'MLOPS PIPELINE', stack: 'MLflow · Kubernetes', bg: 'bg-[linear-gradient(135deg,#1A1A1A,#0D0D0D)]' },
];

function SectionDivider({ title }) {
    return (
        <div className="flex items-center gap-4 mb-6 mt-16 first:mt-0">
            <span className="font-mono text-[10px] text-[#555] tracking-[0.2em] uppercase whitespace-nowrap">{title}</span>
            <div className="h-[1px] flex-grow bg-[#161616]"></div>
        </div>
    )
}

function ProjectCard({ p, className = '' }) {
    return (
        <div 
            className={`group break-inside-avoid bg-[#111] border ${p.type === 'main' ? 'border-[#202020]' : 'border-[#1A1A1A]'} cursor-pointer relative overflow-hidden block w-full ${p.height} ${className}`}
        >
            {/* Image / Gradient Hover */}
            <div className={`absolute inset-0 z-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 ${p.bg}`}></div>
            
            {/* Glass Overlay */}
            <div className="absolute inset-0 z-0 bg-[#0D0D0D]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            
            {/* Arrow */}
            <span className="absolute top-4 right-4 text-[14px] text-[#1A1A1A] transition-all duration-200 z-20 group-hover:text-offwhite group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
                ↗
            </span>
            
            {/* Content */}
            <div className="p-5 flex flex-col justify-end h-full relative z-10">
                <div className="font-mono text-[9px] text-[#232323] tracking-[0.12em] mb-2 transition-colors duration-200 group-hover:text-[#444]">
                    {p.id}{p.type === 'main' ? ' · Principal' : ''}
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
}

export default function Projects() {
    return (
        <main className="pt-24 px-7 pb-12 min-h-screen bg-[#0D0D0D] font-grotesk">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="font-bebas text-5xl text-offwhite tracking-widest mb-4">PROJETS</h1>
                </div>

                <SectionDivider title="Data et IA" />

                {/* 3 Main Projects in a Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-[6px]">
                    {mainProjects.map((p) => (
                        <ProjectCard key={p.id} p={p} />
                    ))}
                </div>

                <SectionDivider title="Autres projets" />

                {/* 9 Secondary Projects in Perfect Rectangle Masonry */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[6px]">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-[6px]">
                        {secondaryProjects.slice(0, 3).map(p => <ProjectCard key={p.id} p={p} />)}
                    </div>
                    {/* Column 2 */}
                    <div className="flex flex-col gap-[6px]">
                        {secondaryProjects.slice(3, 6).map(p => <ProjectCard key={p.id} p={p} />)}
                    </div>
                    {/* Column 3 */}
                    <div className="flex flex-col gap-[6px]">
                        {secondaryProjects.slice(6, 9).map(p => <ProjectCard key={p.id} p={p} />)}
                    </div>
                </div>
            </div>
        </main>
    )
}