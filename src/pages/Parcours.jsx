import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const milestonesData = {
    FR: [
        {
            year: '2018',
            title: 'DÉBUT DES ÉTUDES',
            desc: "Entrée en école d'ingénieur. Plongée dans les mathématiques appliquées, l'algorithmique et les fondements de l'informatique.",
            image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219ed?auto=format&fit=crop&w=800&q=80'
        },
        {
            year: '2020',
            title: 'PREMIERS PAS DATA',
            desc: "Découverte de l'écosystème Big Data lors d'un premier stage. Création de pipelines ETL et initiation au Machine Learning.",
            image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80'
        },
        {
            year: '2022',
            title: 'MASTER IA & DATA',
            desc: 'Obtention du diplôme avec mention. Spécialisation en Intelligence Artificielle et thèse sur les modèles de langage (NLP).',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
        },
        {
            year: '2023',
            title: 'DATA ENGINEER',
            desc: "Premier poste structurant. Déploiement d'architectures cloud robustes et industrialisation de modèles prédictifs.",
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
        },
        {
            year: '2024',
            title: 'CONSULTANT SENIOR',
            desc: "Lancement en tant qu'indépendant. Accompagnement de startups et grands comptes sur leur stratégie et implémentation IA.",
            image: 'https://images.unsplash.com/photo-1524169358666-eb3c8c4cedf3?auto=format&fit=crop&w=800&q=80'
        }
    ],
    EN: [
        {
            year: '2018',
            title: 'STUDIES BEGIN',
            desc: "Entered engineering school. Immersed in applied mathematics, algorithms, and computer science fundamentals.",
            image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219ed?auto=format&fit=crop&w=800&q=80'
        },
        {
            year: '2020',
            title: 'FIRST STEPS IN DATA',
            desc: "Discovered the Big Data ecosystem during a first internship. Created ETL pipelines and was initiated into Machine Learning.",
            image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80'
        },
        {
            year: '2022',
            title: 'MASTER IN AI & DATA',
            desc: 'Graduated with honors. Specialized in Artificial Intelligence with a thesis on Large Language Models (NLP).',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
        },
        {
            year: '2023',
            title: 'DATA ENGINEER',
            desc: "First key professional role. Deployed robust cloud architectures and industrialized predictive models.",
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
        },
        {
            year: '2024',
            title: 'SENIOR CONSULTANT',
            desc: "Launched as a freelancer. Supporting startups and major accounts with their AI strategy and implementation.",
            image: 'https://images.unsplash.com/photo-1524169358666-eb3c8c4cedf3?auto=format&fit=crop&w=800&q=80'
        }
    ]
}

export default function Parcours() {
    const { lang, t } = useLanguage()
    const milestones = milestonesData[lang]
    
    const targetRef = useRef(null)
    const carouselRef = useRef(null)
    const [carouselWidth, setCarouselWidth] = useState(0)
    // État pour savoir si on est sur mobile ou desktop
    const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true)

    useEffect(() => {
        const updateWidth = () => {
            const isDesk = window.innerWidth >= 768
            setIsDesktop(isDesk)

            if (carouselRef.current && isDesk) {
                setCarouselWidth(carouselRef.current.scrollWidth - window.innerWidth)
            }
        }

        setTimeout(updateWidth, 100)
        window.addEventListener('resize', updateWidth)
        return () => window.removeEventListener('resize', updateWidth)
    }, [lang]) // Re-calculate on lang change

    const { scrollYProgress } = useScroll({
        target: targetRef,
    })

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 250,
        damping: 30,
        restDelta: 0.001
    })

    const opacityTitleDesktop = useTransform(smoothProgress, [0, 0.05], [1, 0])

    // Le défilement ne s'applique qu'en mode Desktop
    const x = useTransform(smoothProgress, (p) => isDesktop ? `${p * -carouselWidth}px` : "0px")

    return (
        <main className="bg-[#0D0D0D] font-grotesk text-offwhite min-h-screen">
            <div ref={targetRef} className="md:h-[400vh] relative">
                <div className="md:sticky md:top-0 md:h-screen flex flex-col md:flex-row md:items-center md:overflow-hidden relative">
                    <motion.div
                        style={{ opacity: isDesktop ? opacityTitleDesktop : 1 }}
                        className="md:absolute left-7 md:left-14 top-24 z-10 pointer-events-none mt-24 md:mt-0 mb-12 md:mb-0 px-7 md:px-0"
                    >
                        <h1 className="font-bebas text-6xl md:text-8xl text-offwhite tracking-widest leading-none drop-shadow-lg">
                            {t({ FR: 'MON', EN: 'MY' })}<br className="hidden md:block" /> {t({ FR: 'PARCOURS.', EN: 'EXPERIENCE.' })}
                        </h1>
                        <p className="mt-4 font-mono text-[10px] text-[#555] tracking-[0.2em] uppercase max-w-[200px] hidden md:block">
                            {t({ FR: 'Scrollez pour avancer dans le temps', EN: 'Scroll to move through time' })}
                        </p>
                    </motion.div>

                    <motion.div
                        ref={carouselRef}
                        style={{ x }}
                        className="flex flex-col md:flex-row md:items-center w-full md:w-[max-content] md:pt-16 pb-24 md:pb-0 px-7 md:px-0 gap-16 md:gap-0"
                    >
                        <div className="hidden md:block w-[40vw] shrink-0"></div>

                        {milestones.map((milestone, idx) => (
                            <div key={idx} className="w-full md:w-[450px] shrink-0 flex flex-col gap-4 md:gap-6 relative group md:mr-32">
                                {idx !== milestones.length - 1 && (
                                    <div className="absolute top-[44px] left-[220px] right-[-180px] h-px bg-[#222] z-0 hidden md:block"></div>
                                )}
                                {idx !== milestones.length - 1 && (
                                    <div className="absolute top-[80px] bottom-[-80px] left-[20px] w-px bg-[#222] z-0 md:hidden block"></div>
                                )}

                                <div className="font-bebas text-5xl md:text-8xl text-[#222] relative z-10 transition-colors duration-500 group-hover:text-[#F0EDE8] bg-[#0D0D0D] w-max pr-4 md:pr-0">
                                    {milestone.year}
                                </div>

                                <div className="relative aspect-[16/9] overflow-hidden bg-[#111] border border-[#1A1A1A] p-2 md:p-3 z-10 ml-0 md:ml-0">
                                    <div className="w-full h-full relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[#0D0D0D]/60 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                                        <img
                                            src={milestone.image}
                                            alt={milestone.title}
                                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="absolute top-0 right-0 p-3 md:p-4 z-20">
                                        <span className="font-mono text-[9px] text-[#0D0D0D] bg-[#F0EDE8] px-2 py-1 tracking-widest">
                                            0{idx + 1}
                                        </span>
                                    </div>
                                </div>

                                <div className="z-10 bg-[#0D0D0D] py-2 md:py-0">
                                    <h3 className="font-bebas text-2xl md:text-2xl tracking-wide text-[#F0EDE8] mb-2 transition-colors duration-300">
                                        {milestone.title}
                                    </h3>
                                    <p className="text-[12px] md:text-[14px] text-[#666] leading-relaxed font-grotesk group-hover:text-[#999] transition-colors duration-300">
                                        {milestone.desc}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div className="hidden md:block w-[15vw] shrink-0"></div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}