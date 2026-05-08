import { useEffect, useRef, useState } from 'react'

const PYTHON_CODE = `
import secrets
import string

def gen_password(length):
    allCharacters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(secrets.choice(allCharacters) for i in range(length))
    return password

def puissance(password_final):
    score = 0
    if len(password_final) >= 12: score += 1
    if any(c.isdigit() for c in password_final): score += 1
    if any(c.isupper() for c in password_final): score += 1
    if any(c in string.punctuation for c in password_final): score += 1
    blocs = score * 5
    barre = "█" * blocs + "░" * (20 - blocs)
    return barre, score

def run(length_str):
    if not length_str.isdigit():
        return "Un nombre est requis !"
    length = int(length_str)
    if length < 8:
        return "La longueur du mot de passe demandée est trop courte."
    password_final = gen_password(length)
    ma_barre, mon_score = puissance(password_final)
    return f"Mot de passe : {password_final}\\nSécurité     : [{ma_barre}] {mon_score}/4"
`

export default function PythonTerminal() {
    const [lines, setLines] = useState([
        { type: 'system', text: 'Python 3.11 · Pyodide · password_generator.py' },
        { type: 'output', text: 'Entrez la longueur du mot de passe :' },
    ])
    const [input, setValue] = useState('')
    const [ready, setReady] = useState(false)
    const [loading, setLoading] = useState(true)
    const pyodideRef = useRef(null)
    const inputRef = useRef(null)
    const scrollRef = useRef(null)

    // Charge Pyodide
    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'
        script.onload = async () => {
            const pyodide = await window.loadPyodide()
            await pyodide.runPythonAsync(PYTHON_CODE)
            pyodideRef.current = pyodide
            setReady(true)
            setLoading(false)
        }
        document.head.appendChild(script)
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [lines])

    const pushLine = (type, text) => {
        setLines(prev => [...prev, { type, text }])
    }

    const run = async () => {
        if (!ready || !input.trim()) return
        const val = input.trim()
        setValue('')
        pushLine('input', `$ ${val}`)
        try {
            const result = await pyodideRef.current.runPythonAsync(
                `run("${val}")`
            )
            pushLine('output', result)
        } catch (e) {
            pushLine('error', e.message)
        }
        pushLine('output', 'Entrez la longueur du mot de passe :')
    }

    const handleKey = (e) => {
        if (e.key === 'Enter') run()
    }

    return (
        <div
            className="w-full font-mono text-sm"
            style={{
                background: '#0A0A0A',
                border: '0.5px solid var(--border)',
                borderRadius: '2px',
            }}
            onClick={() => inputRef.current?.focus()}
        >
            {/* Header terminal */}
            <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ borderBottom: '0.5px solid var(--border)' }}
            >
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3A3A3A' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3A3A3A' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3A3A3A' }} />
                </div>
                <span
                    className="text-[9px] tracking-widest uppercase ml-2"
                    style={{ color: 'var(--text-ghost)' }}
                >
                    password_generator.py
                </span>
                {loading && (
                    <span className="text-[9px] tracking-widest uppercase ml-auto" style={{ color: 'var(--text-ghost)' }}>
                        Chargement Python...
                    </span>
                )}
            </div>

            {/* Output */}
            <div
                ref={scrollRef}
                className="p-4 min-h-[200px] max-h-[340px] overflow-y-auto flex flex-col gap-1 scroll-smooth"
            >
                {lines.map((line, i) => (
                    <div key={i}>
                        {line.type === 'system' && (
                            <p className="text-[10px] tracking-widest" style={{ color: '#2E2E2E' }}>
                                {line.text}
                            </p>
                        )}
                        {line.type === 'output' && (
                            <p style={{ color: '#888', whiteSpace: 'pre' }}>{line.text}</p>
                        )}
                        {line.type === 'input' && (
                            <p style={{ color: '#F0EDE8' }}>{line.text}</p>
                        )}
                        {line.type === 'error' && (
                            <p style={{ color: '#E05555' }}>{line.text}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Input */}
            <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: '0.5px solid var(--border)' }}
            >
                <span style={{ color: 'var(--text-ghost)' }}>$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={handleKey}
                    disabled={!ready}
                    placeholder={loading ? 'Chargement...' : 'Entrez un nombre...'}
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: '#F0EDE8', caretColor: '#F0EDE8' }}
                />
                <button
                    onClick={run}
                    disabled={!ready}
                    className="text-[9px] tracking-widest uppercase px-3 py-1.5 transition-colors"
                    style={{
                        border: '0.5px solid var(--border)',
                        color: ready ? '#F0EDE8' : 'var(--text-ghost)',
                        cursor: ready ? 'pointer' : 'default'
                    }}
                >
                    Entrée
                </button>
            </div>
        </div>
    )
}