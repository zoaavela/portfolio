import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const NAMES = ['Alice Dupont', 'Bob Martin', 'Charlie Durand', 'Diana Prince', 'Enzo Rossi']
const EMAILS = ['alice@corp.fr', 'bob.martin@gmail.com', 'charlie@startup.io', 'diana@enterprise.com']
const IPS = ['192.168.1.42', '10.0.0.1', '172.16.254.1', '192.168.0.100']
const IBANS = ['FR7630006000011234567890189', 'DE89370400440532013000', 'GB29NWBK60161331926819']
const PASSWORDS = ['mySecretPass123', 'admin1234!', 'P@ssw0rd99', 'hunter2secret']
const MONGO = ['mongodb+srv://admin:pass@cluster.mongodb.net/prod', 'mongodb://root:secret@localhost:27017']
const JWTS = ['eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.abc123def456']
const STRIPES = ['sk_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXX']

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const pad = (n) => String(n).padStart(2, '0')

function randomDate() {
    const h = Math.floor(Math.random() * 24)
    const m = Math.floor(Math.random() * 60)
    const s = Math.floor(Math.random() * 60)
    return `2024-01-15 ${pad(h)}:${pad(m)}:${pad(s)}`
}

const TEMPLATES = [
    () => `${randomDate()} INFO  user=${pick(NAMES)} connected from ${pick(IPS)}`,
    () => `${randomDate()} DEBUG password=${pick(PASSWORDS)} auth attempt for ${pick(EMAILS)}`,
    () => `${randomDate()} INFO  email: ${pick(EMAILS)} registered successfully`,
    () => `${randomDate()} ERROR stripe_key=${pick(STRIPES)} payment failed`,
    () => `${randomDate()} INFO  IBAN: ${pick(IBANS)} transaction processed`,
    () => `${randomDate()} DEBUG ${pick(MONGO)} connection established`,
    () => `${randomDate()} INFO  JWT: ${pick(JWTS)} issued for ${pick(NAMES)}`,
    () => `${randomDate()} WARN  login attempt from ${pick(IPS)} user=${pick(NAMES)}`,
    () => `${randomDate()} INFO  client=${pick(NAMES)} account created email=${pick(EMAILS)}`,
    () => `${randomDate()} ERROR auth failed password=${pick(PASSWORDS)} ip=${pick(IPS)}`,
]

function generateLog(lines = 12) {
    return Array.from({ length: lines }, () => pick(TEMPLATES)()).join('\n')
}

export default function LogGenerator() {
    const { t } = useLanguage()
    const [log, setLog] = useState(() => generateLog())

    const regenerate = () => setLog(generateLog())

    const download = () => {
        const blob = new Blob([log], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'dirty_log.txt'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div style={{ background: '#0A0A0A', border: '0.5px solid var(--border)', borderRadius: '2px' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '0.5px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3A3A3A' }} />
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3A3A3A' }} />
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3A3A3A' }} />
                    </div>
                    <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'var(--text-ghost)' }}>
                        dirty_log.txt
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={regenerate}
                        className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 transition-colors"
                        style={{ border: '0.5px solid var(--border)', color: 'var(--text-ghost)', cursor: 'pointer', background: 'none' }}
                    >
                        ↺ {t({ FR: 'Aléatoire', EN: 'Regenerate' })}
                    </button>
                    <button
                        onClick={download}
                        className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 transition-colors"
                        style={{ background: '#4CAF82', color: '#0A0A0A', border: 'none', cursor: 'pointer' }}
                    >
                        ⬇ {t({ FR: 'Télécharger', EN: 'Download' })}
                    </button>
                </div>
            </div>

            {/* Log content éditable */}
            <textarea
                value={log}
                onChange={e => setLog(e.target.value)}
                className="w-full font-mono text-xs p-4 resize-none outline-none"
                style={{
                    background: 'transparent',
                    color: '#555',
                    lineHeight: '1.7',
                    height: '280px',
                    borderBottom: '0.5px solid var(--border)',
                }}
                spellCheck={false}
            />

            <div className="px-4 py-2">
                <p className="font-mono text-[9px] tracking-widest uppercase" style={{ color: '#1A1A1A' }}>
                    {t({
                        FR: 'Modifiez le log · téléchargez · glissez dans logCleaner',
                        EN: 'Edit log · download · drag to logCleaner'
                    })}
                </p>
            </div>
        </div>
    )
}