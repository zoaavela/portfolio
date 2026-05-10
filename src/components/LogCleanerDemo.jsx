import { useState, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'

const PATTERNS = {
    identite: /(?:name|user|client|customer|patient)\s*[:=]\s*['"]?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)['"]?/gi,
    adresse: /\d+(?:[\s,]+(?:rue|av|ave|bd|boulevard|allée|route|chemin)\s+[A-ZÀ-ÿa-z\s'-]+(?:\s+\d{5})?)/gi,
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    iban: /\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g,
    AWS_ACCESS_KEY: /AKIA[0-9A-Z]{16}/g,
    GITHUB_TOKEN: /ghp_[0-9a-zA-Z]{36}/g,
    GOOGLE_API: /AIza[0-9A-Za-z\-_]{35}/g,
    STRIPE_KEY: /sk_live_[0-9a-zA-Z]{24}/g,
    JWT_TOKEN: /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g,
    MONGO_URI: /mongodb(?:\+srv)?:\/\/[^\s'"]+/g,
    POSTGRES_URI: /postgres(?:ql)?:\/\/[^\s'"]+/g,
    password: /(?:password|passwd|pass|pwd)\s*[:=]\s*['"]?([^'"\s]{4,100})['"]?/gi,
    carte_bancaire: /\b(?:\d[ -]*?){13,16}\b/g,
    telephone: /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/g,
    ipv4: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
}

export default function LogCleanerDemo() {
    const { t } = useLanguage()
    const [state, setState] = useState('idle') // idle | dragging | cleaning | done
    const [filename, setFilename] = useState('')
    const [result, setResult] = useState(null)
    const dropRef = useRef(null)

    function cleanlog(text) {
        let cleaned = text
        let detections = []
        for (const [label, pattern] of Object.entries(PATTERNS)) {
            const matches = [...cleaned.matchAll(pattern)]
            if (matches.length > 0) {
                detections.push({ label, count: matches.length })
                cleaned = cleaned.replace(pattern, `[${label.toUpperCase()} ${t({ FR: 'MASQUÉ', EN: 'HIDDEN' })}]`)
            }
        }
        return { cleaned, detections }
    }

    const processFile = (file) => {
        if (!file) return
        setFilename(file.name)
        setState('cleaning')
        const reader = new FileReader()
        reader.onload = (e) => {
            setTimeout(() => {
                const { cleaned, detections } = cleanlog(e.target.result)
                setResult({ cleaned, detections })
                setState('done')
            }, 600)
        }
        reader.readAsText(file)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setState('idle')
        const file = e.dataTransfer.files[0]
        if (file) processFile(file)
    }

    const handleDragOver = (e) => { e.preventDefault(); setState('dragging') }
    const handleDragLeave = () => setState('idle')

    const handleFileInput = (e) => {
        const file = e.target.files[0]
        if (file) processFile(file)
    }

    const downloadCleaned = () => {
        if (!result) return
        const blob = new Blob([result.cleaned], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `CLEANED_${filename}`
        a.click()
        URL.revokeObjectURL(url)
    }

    const reset = () => {
        setState('idle')
        setFilename('')
        setResult(null)
    }

    return (
        <div
            style={{
                background: '#0A0A0A',
                border: '0.5px solid var(--border)',
                borderRadius: '2px',
                fontFamily: 'monospace',
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '0.5px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3A3A3A' }} />
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3A3A3A' }} />
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3A3A3A' }} />
                    </div>
                    <span className="text-[9px] tracking-widest uppercase" style={{ color: 'var(--text-ghost)' }}>
                        logCleaner v1.0
                    </span>
                </div>
                {result && (
                    <button
                        onClick={reset}
                        className="text-[9px] tracking-widest uppercase px-2 py-1"
                        style={{ border: '0.5px solid var(--border)', color: 'var(--text-ghost)', cursor: 'pointer', background: 'none' }}
                    >
                        ↺ {t({ FR: 'Réinitialiser', EN: 'Reset' })}
                    </button>
                )}
            </div>

            <div className="p-6 flex flex-col gap-4">

                {/* Zone de drop */}
                {state !== 'done' && (
                    <div
                        ref={dropRef}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => document.getElementById('file-input').click()}
                        className="flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
                        style={{
                            height: '160px',
                            border: `0.5px dashed ${state === 'dragging' ? '#4CAF82' : '#2A2A2A'}`,
                            background: state === 'dragging' ? 'rgba(76,175,130,0.05)' : 'transparent',
                        }}
                    >
                        {state === 'cleaning' ? (
                            <>
                                <div
                                    className="w-6 h-6 rounded-full border border-t-transparent animate-spin"
                                    style={{ borderColor: '#4CAF82', borderTopColor: 'transparent' }}
                                />
                                <p className="text-[10px] tracking-widest uppercase" style={{ color: '#4CAF82' }}>
                                    {t({ FR: 'Nettoyage en cours...', EN: 'Cleaning in progress...' })}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-2xl">🧹</p>
                                <p className="text-[11px]" style={{ color: state === 'dragging' ? '#4CAF82' : '#333' }}>
                                    {state === 'dragging' ? t({ FR: 'Déposez le fichier', EN: 'Drop the file' }) : t({ FR: 'Déposez votre log ici', EN: 'Drop your log here' })}
                                </p>
                                <p className="text-[9px] tracking-widest uppercase" style={{ color: '#1A1A1A' }}>
                                    .txt · .log · .json · .csv · .xml
                                </p>
                            </>
                        )}
                        <input
                            id="file-input"
                            type="file"
                            accept=".txt,.log,.json,.csv,.xml"
                            className="hidden"
                            onChange={handleFileInput}
                        />
                    </div>
                )}

                {/* Résultat */}
                {state === 'done' && result && (
                    <>
                        {/* Détections */}
                        <div style={{ border: '0.5px solid var(--border)', padding: '16px' }}>
                            <p className="text-[9px] tracking-widest uppercase mb-3" style={{ color: '#333' }}>
                                {filename} — {result.detections.length} {t({ FR: 'type', EN: 'type' })}{result.detections.length > 1 ? 's' : ''} {t({ FR: 'détecté', EN: 'detected' })}{result.detections.length > 1 ? 's' : ''}
                            </p>
                            {result.detections.length === 0 ? (
                                <p className="text-[11px]" style={{ color: '#555' }}>{t({ FR: 'Aucune donnée sensible détectée.', EN: 'No sensitive data detected.' })}</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {result.detections.map((d, i) => (
                                        <span
                                            key={i}
                                            className="text-[9px] tracking-widest uppercase px-2 py-1"
                                            style={{ background: 'rgba(76,175,130,0.08)', border: '0.5px solid #4CAF82', color: '#4CAF82' }}
                                        >
                                            {d.label} × {d.count}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Preview log nettoyé */}
                        <div style={{ border: '0.5px solid var(--border)' }}>
                            <div className="px-4 py-2" style={{ borderBottom: '0.5px solid var(--border)' }}>
                                <p className="text-[9px] tracking-widest uppercase" style={{ color: '#333' }}>{t({ FR: 'Aperçu nettoyé', EN: 'Cleaned preview' })}</p>
                            </div>
                            <div className="p-4 overflow-y-auto" style={{ maxHeight: '200px' }}>
                                {result.cleaned.split('\n').slice(0, 30).map((line, i) => (
                                    <p
                                        key={i}
                                        className="text-xs leading-relaxed"
                                        style={{
                                            color: (line.includes('MASQUÉ') || line.includes('HIDDEN')) ? '#E8845A' : '#444',
                                            whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Bouton download */}
                        <button
                            onClick={downloadCleaned}
                            className="w-full py-3 text-[10px] tracking-widest uppercase transition-colors"
                            style={{ background: '#4CAF82', color: '#0A0A0A', border: 'none', cursor: 'pointer' }}
                        >
                            ⬇ {t({ FR: 'Télécharger le fichier nettoyé', EN: 'Download cleaned file' })}
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}