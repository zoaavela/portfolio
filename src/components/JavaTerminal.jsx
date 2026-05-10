import { useState, useRef, useEffect } from 'react'

class CompteBancaire {
    constructor(nom, solde, numero) {
        this.nom = nom
        this.solde = solde
        this.numero = numero
    }
    getSolde() { return `Solde de ${this.nom} : ${this.solde.toFixed(2)} €` }
    affiche() { return `${this.nom} | N° ${this.numero} | ${this.solde.toFixed(2)} €` }
    deposer(montant) {
        if (montant > 0) { this.solde += montant; return { ok: true, msg: `+${montant.toFixed(2)} € déposés. Nouveau solde : ${this.solde.toFixed(2)} €` } }
        return { ok: false, msg: `Montant invalide.` }
    }
    retirer(montant) {
        if (montant > 0 && montant <= this.solde) { this.solde -= montant; return { ok: true, msg: `−${montant.toFixed(2)} € retirés. Nouveau solde : ${this.solde.toFixed(2)} €` } }
        if (montant > this.solde) return { ok: false, msg: `Solde insuffisant. (Solde : ${this.solde.toFixed(2)} €)` }
        return { ok: false, msg: `Montant invalide.` }
    }
    virement(dest, montant) {
        if (montant > 0 && montant <= this.solde) {
            this.solde -= montant; dest.solde += montant
            return { ok: true, msg: [`Virement de ${montant.toFixed(2)} € vers ${dest.nom}.`, this.getSolde(), dest.getSolde()] }
        }
        if (montant > this.solde) return { ok: false, msg: [`Solde insuffisant.`] }
        return { ok: false, msg: [`Montant invalide.`] }
    }
}

const STEPS = {
    ACCUEIL: 'accueil',
    CREATE_NOM: 'create_nom',
    CREATE_SOLDE: 'create_solde',
    CONNECT: 'connect',
    MENU: 'menu',
    DEPOT_MONTANT: 'depot_montant',
    RETRAIT_MONTANT: 'retrait_montant',
    VIREMENT_DEST: 'virement_dest',
    VIREMENT_MONTANT: 'virement_montant',
}

let compteurNumero = 1000

const L = (text, color = '#F0EDE8') => ({ text, color })
const SEP = () => L('─'.repeat(40), '#1A1A1A')
const BLANK = () => L('', '')

export default function JavaTerminal() {
    const [comptes, setComptes] = useState({})
    const [compteActif, setCompteActif] = useState(null)
    const [step, setStep] = useState(STEPS.ACCUEIL)
    const [temp, setTemp] = useState({})
    const [lines, setLines] = useState(accueilLines())
    const [input, setInput] = useState('')
    const [placeholder, setPlaceholder] = useState('1 ou 2...')
    const containerRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [lines])

    function accueilLines() {
        return [
            L('CompteBancaire.java', '#333'),
            SEP(),
            BLANK(),
            L('  Bienvenue dans la simulation bancaire.', '#888'),
            BLANK(),
            L('  [1] Créer un compte', '#F0EDE8'),
            L('  [2] Se connecter à un compte existant', '#F0EDE8'),
            BLANK(),
            L('  Entrez 1 ou 2.', '#444'),
        ]
    }

    function menuLines(compte) {
        return [
            SEP(),
            L(`  Connecté : ${compte.nom}`, '#4CAF82'),
            L(`  N° ${compte.numero} | Solde : ${compte.solde.toFixed(2)} €`, '#888'),
            SEP(),
            BLANK(),
            L('  [1] Voir le solde', '#F0EDE8'),
            L('  [2] Déposer de l\'argent', '#F0EDE8'),
            L('  [3] Retirer de l\'argent', '#F0EDE8'),
            L('  [4] Faire un virement', '#F0EDE8'),
            L('  [5] Voir tous les comptes', '#F0EDE8'),
            L('  [6] Déconnexion', '#F0EDE8'),
            BLANK(),
            L('  Entrez un numéro.', '#444'),
        ]
    }

    const add = (newLines) => {
        setLines(prev => [...prev, ...newLines])
    }

    const handle = (raw) => {
        const val = raw.trim()
        if (!val) return

        if (step === STEPS.ACCUEIL) {
            if (val === '1') {
                add([
                    L(`  > ${val}`, '#555'),
                    BLANK(),
                    L('  — Création de compte —', '#888'),
                    L('  Quel est votre nom ?', '#F0EDE8'),
                ])
                setStep(STEPS.CREATE_NOM)
                setPlaceholder('Votre nom...')

            } else if (val === '2') {
                const list = Object.values(comptes)
                if (list.length === 0) {
                    add([
                        L(`  > ${val}`, '#555'),
                        BLANK(),
                        L('  Aucun compte existant. Créez-en un d\'abord.', '#E05555'),
                        BLANK(),
                        L('  [1] Créer un compte', '#F0EDE8'),
                    ])
                    setPlaceholder('1...')
                } else {
                    add([
                        L(`  > ${val}`, '#555'),
                        BLANK(),
                        L('  — Comptes disponibles —', '#888'),
                        ...list.map(c => L(`  N° ${c.numero} → ${c.nom}`, '#F0EDE8')),
                        BLANK(),
                        L('  Entrez votre numéro de compte.', '#444'),
                    ])
                    setStep(STEPS.CONNECT)
                    setPlaceholder('Numéro de compte...')
                }
            } else {
                add([L(`  > ${val}`, '#555'), L('  Entrez 1 ou 2.', '#E05555')])
            }
            return
        }

        if (step === STEPS.CONNECT) {
            const c = comptes[val]
            if (!c) {
                add([
                    L(`  > ${val}`, '#555'),
                    L(`  Compte N° ${val} introuvable.`, '#E05555'),
                    L('  Réessayez.', '#444'),
                ])
            } else {
                setCompteActif(c)
                add([L(`  > ${val}`, '#555'), ...menuLines(c)])
                setStep(STEPS.MENU)
                setPlaceholder('1, 2, 3, 4, 5 ou 6...')
            }
            return
        }

        if (step === STEPS.CREATE_NOM) {
            setTemp({ nom: val })
            add([
                L(`  > ${val}`, '#555'),
                BLANK(),
                L(`  Bonjour ${val} !`, '#4CAF82'),
                L('  Solde initial ? (en €)', '#F0EDE8'),
            ])
            setStep(STEPS.CREATE_SOLDE)
            setPlaceholder('Ex: 500')
            return
        }

        if (step === STEPS.CREATE_SOLDE) {
            const solde = parseFloat(val.replace(',', '.'))
            if (isNaN(solde) || solde < 0) {
                add([L(`  > ${val}`, '#555'), L('  Montant invalide. Entrez un nombre positif.', '#E05555')])
                return
            }
            compteurNumero++
            const numero = String(compteurNumero)
            const c = new CompteBancaire(temp.nom, solde, numero)
            const updated = { ...comptes, [numero]: c }
            setComptes(updated)
            setCompteActif(c)
            add([
                L(`  > ${val}`, '#555'),
                BLANK(),
                L('  ✓ Compte créé avec succès !', '#4CAF82'),
                L(`  Votre numéro de compte : ${numero}`, '#888'),
                L('  Conservez-le pour vous reconnecter.', '#555'),
                ...menuLines(c),
            ])
            setStep(STEPS.MENU)
            setPlaceholder('1, 2, 3, 4, 5 ou 6...')
            return
        }

        if (step === STEPS.MENU) {
            if (val === '1') {
                add([
                    L(`  > ${val}`, '#555'),
                    BLANK(),
                    L(`  ${compteActif.getSolde()}`, '#4CAF82'),
                    ...menuLines(compteActif),
                ])

            } else if (val === '2') {
                add([
                    L(`  > ${val}`, '#555'),
                    BLANK(),
                    L('  Montant à déposer ? (en €)', '#F0EDE8'),
                ])
                setStep(STEPS.DEPOT_MONTANT)
                setPlaceholder('Ex: 200')

            } else if (val === '3') {
                add([
                    L(`  > ${val}`, '#555'),
                    BLANK(),
                    L('  Montant à retirer ? (en €)', '#F0EDE8'),
                ])
                setStep(STEPS.RETRAIT_MONTANT)
                setPlaceholder('Ex: 50')

            } else if (val === '4') {
                const autres = Object.values(comptes).filter(c => c.numero !== compteActif.numero)
                if (autres.length === 0) {
                    add([
                        L(`  > ${val}`, '#555'),
                        BLANK(),
                        L('  Aucun autre compte disponible.', '#E05555'),
                        ...menuLines(compteActif),
                    ])
                } else {
                    add([
                        L(`  > ${val}`, '#555'),
                        BLANK(),
                        L('  — Comptes disponibles —', '#888'),
                        ...autres.map(c => L(`  N° ${c.numero} → ${c.nom}`, '#F0EDE8')),
                        BLANK(),
                        L('  Numéro du compte destinataire ?', '#F0EDE8'),
                    ])
                    setStep(STEPS.VIREMENT_DEST)
                    setPlaceholder('Numéro de compte...')
                }

            } else if (val === '5') {
                const list = Object.values(comptes)
                add([
                    L(`  > ${val}`, '#555'),
                    BLANK(),
                    L('  — Tous les comptes —', '#888'),
                    ...list.map(c => L(`  ${c.affiche()}`, '#F0EDE8')),
                    ...menuLines(compteActif),
                ])

            } else if (val === '6') {
                setCompteActif(null)
                setLines([
                    L(`  > ${val}`, '#555'),
                    BLANK(),
                    L('  Déconnecté.', '#888'),
                    BLANK(),
                    ...accueilLines(),
                ])
                setStep(STEPS.ACCUEIL)
                setPlaceholder('1 ou 2...')

            } else {
                add([
                    L(`  > ${val}`, '#555'),
                    L('  Entrez un chiffre entre 1 et 6.', '#E05555'),
                    ...menuLines(compteActif),
                ])
            }
            return
        }

        if (step === STEPS.DEPOT_MONTANT) {
            const montant = parseFloat(val.replace(',', '.'))
            if (isNaN(montant) || montant <= 0) {
                add([L(`  > ${val}`, '#555'), L('  Montant invalide.', '#E05555')])
                return
            }
            const result = compteActif.deposer(montant)
            setComptes({ ...comptes })
            add([
                L(`  > ${val}`, '#555'),
                BLANK(),
                L(`  ${result.msg}`, result.ok ? '#4CAF82' : '#E05555'),
                ...menuLines(compteActif),
            ])
            setStep(STEPS.MENU)
            setPlaceholder('1, 2, 3, 4, 5 ou 6...')
            return
        }

        if (step === STEPS.RETRAIT_MONTANT) {
            const montant = parseFloat(val.replace(',', '.'))
            if (isNaN(montant) || montant <= 0) {
                add([L(`  > ${val}`, '#555'), L('  Montant invalide.', '#E05555')])
                return
            }
            const result = compteActif.retirer(montant)
            setComptes({ ...comptes })
            add([
                L(`  > ${val}`, '#555'),
                BLANK(),
                L(`  ${result.msg}`, result.ok ? '#4CAF82' : '#E05555'),
                ...menuLines(compteActif),
            ])
            setStep(STEPS.MENU)
            setPlaceholder('1, 2, 3, 4, 5 ou 6...')
            return
        }

        if (step === STEPS.VIREMENT_DEST) {
            const dest = comptes[val]
            if (!dest || dest.numero === compteActif.numero) {
                add([L(`  > ${val}`, '#555'), L(`  Compte N° ${val} invalide.`, '#E05555')])
                return
            }
            setTemp({ dest })
            add([
                L(`  > ${val}`, '#555'),
                L(`  Vers : ${dest.nom}`, '#888'),
                L('  Montant à virer ? (en €)', '#F0EDE8'),
            ])
            setStep(STEPS.VIREMENT_MONTANT)
            setPlaceholder('Ex: 100')
            return
        }

        if (step === STEPS.VIREMENT_MONTANT) {
            const montant = parseFloat(val.replace(',', '.'))
            if (isNaN(montant) || montant <= 0) {
                add([L(`  > ${val}`, '#555'), L('  Montant invalide.', '#E05555')])
                return
            }
            const result = compteActif.virement(temp.dest, montant)
            setComptes({ ...comptes })
            add([
                L(`  > ${val}`, '#555'),
                BLANK(),
                ...result.msg.map(m => L(`  ${m}`, result.ok ? '#4CAF82' : '#E05555')),
                ...menuLines(compteActif),
            ])
            setStep(STEPS.MENU)
            setPlaceholder('1, 2, 3, 4, 5 ou 6...')
            return
        }
    }

    const handleKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (input.trim()) {
                handle(input.trim())
                setInput('')
            }
        }
    }

    const reset = () => {
        compteurNumero = 1000
        setComptes({})
        setCompteActif(null)
        setTemp({})
        setLines(accueilLines())
        setStep(STEPS.ACCUEIL)
        setPlaceholder('1 ou 2...')
        setInput('')
    }

    return (
        <div
            className="w-full font-mono text-sm"
            style={{ background: '#0A0A0A', border: '0.5px solid var(--border)', borderRadius: '2px' }}
            onClick={() => inputRef.current?.focus()}
        >
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '0.5px solid var(--border)' }}>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3A3A3A' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3A3A3A' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3A3A3A' }} />
                </div>
                <span className="text-[9px] tracking-widest uppercase ml-2" style={{ color: 'var(--text-ghost)' }}>
                    CompteBancaire.java
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); reset() }}
                    className="ml-auto text-[9px] tracking-widest uppercase px-2 py-1 transition-colors"
                    style={{ border: '0.5px solid var(--border)', color: 'var(--text-ghost)', cursor: 'pointer' }}
                >
                    ↺ Reset
                </button>
            </div>

            <div
                ref={containerRef}
                className="p-4 overflow-y-auto flex flex-col gap-0.5"
                style={{ minHeight: '260px', maxHeight: '420px' }}
            >
                {lines.map((line, i) => (
                    <p key={i} style={{ color: line.color, whiteSpace: 'pre' }}>{line.text}</p>
                ))}
            </div>

            <div className="flex items-center gap-3 px-4 py-3" style={{ borderTop: '0.5px solid var(--border)' }}>
                <span style={{ color: 'var(--text-ghost)' }}>›</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: '#F0EDE8', caretColor: '#F0EDE8' }}
                    autoFocus
                />
            </div>
        </div>
    )
}