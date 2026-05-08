import { motion } from 'framer-motion'

export default function Contact() {
    // Fonction pour auto-agrandir la zone de texte selon son contenu
    const handleTextareaInput = (e) => {
        e.target.style.height = 'auto'
        e.target.style.height = `${e.target.scrollHeight}px`
    }

    return (
        <main className="bg-[#0D0D0D] font-grotesk text-offwhite min-h-[100dvh] md:h-[100dvh] w-full flex flex-col pt-24 md:pt-24 px-6 md:px-14 pb-12 md:pb-14 overflow-y-auto md:overflow-hidden relative">
            <div className="flex-1 flex flex-col md:flex-row gap-10 md:gap-24 max-w-7xl w-full mx-auto justify-center md:items-center mt-4 md:mt-0">

                {/* Left Side: Typography */}
                <div className="flex flex-col justify-end md:justify-center md:flex-1 h-auto pb-2 md:pb-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="font-bebas text-7xl md:text-[10vw] text-offwhite tracking-widest leading-[0.85] drop-shadow-lg mb-4 md:mb-8">
                            LET'S<br />TALK.
                        </h1>
                        <p className="font-mono text-[10px] md:text-sm text-[#666] tracking-widest uppercase max-w-md leading-relaxed hidden md:block">
                            Open for freelance opportunities, collaborations, or just a coffee chat.
                        </p>

                        <div className="mt-2 md:mt-12 flex flex-col gap-2 md:gap-4">
                            <a href="mailto:enzooabdi@gmail.com" className="font-bebas text-3xl md:text-5xl text-[#555] hover:text-offwhite transition-colors w-fit">
                                ENZOOABDI@GMAIL.COM
                            </a>
                            <div className="flex gap-6 mt-2 md:mt-4">
                                <a href="https://www.linkedin.com/in/abdienzo/" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] tracking-widest uppercase text-[#555] hover:text-offwhite transition-colors">LinkedIn</a>
                                <a href="https://github.com/zoaavela" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] tracking-widest uppercase text-[#555] hover:text-offwhite transition-colors">GitHub</a>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="flex-1 flex flex-col justify-start md:justify-center h-auto"
                >
                    <form className="flex flex-col gap-6 md:gap-8 w-full max-w-md mx-auto md:mx-0">
                        <div className="flex flex-col gap-1 md:gap-2 group">
                            <label className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-[#555] group-focus-within:text-offwhite transition-colors">Name</label>
                            <input
                                type="text"
                                className="bg-transparent border-b border-[#222] text-offwhite pb-1 md:pb-2 focus:outline-none focus:border-offwhite transition-colors font-grotesk text-base md:text-lg w-full rounded-none"
                                placeholder="Your name"
                            />
                        </div>
                        <div className="flex flex-col gap-1 md:gap-2 group">
                            <label className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-[#555] group-focus-within:text-offwhite transition-colors">Email</label>
                            <input
                                type="email"
                                className="bg-transparent border-b border-[#222] text-offwhite pb-1 md:pb-2 focus:outline-none focus:border-offwhite transition-colors font-grotesk text-base md:text-lg w-full rounded-none"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div className="flex flex-col gap-1 md:gap-2 group">
                            <label className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-[#555] group-focus-within:text-offwhite transition-colors">Message</label>
                            <textarea
                                rows="1"
                                onInput={handleTextareaInput}
                                className="bg-transparent border-b border-[#222] text-offwhite pb-1 md:pb-2 focus:outline-none focus:border-offwhite transition-colors font-grotesk text-base md:text-lg resize-none w-full min-h-[40px] md:min-h-[50px] max-h-[150px] md:max-h-[250px] overflow-y-auto rounded-none"
                                placeholder="How can I help you?"
                            ></textarea>
                        </div>
                        <button
                            type="button"
                            className="mt-4 md:mt-4 border border-[#333] py-4 font-mono text-[10px] tracking-[0.2em] uppercase text-offwhite hover:bg-offwhite hover:text-[#0D0D0D] transition-all duration-300 w-full md:w-max px-12"
                        >
                            SEND MESSAGE
                        </button>
                    </form>
                </motion.div>
            </div>
        </main>
    )
}
