import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthProvider'
import NotifPanel from '../components/NotifPanel'

// ── Catégories ────────────────────────────────────────────────────────────────
const CATS = [
    { id: 'all', label: 'Tout', color: '#ffffff' },
    { id: 'data', label: 'Data', color: '#378ADD' },
    { id: 'web', label: 'Web', color: '#D4537E' },
    { id: 'reseau', label: 'Réseau', color: '#1D9E75' },
    { id: 'ideas', label: 'Ideas', color: '#EF9F27' },
    { id: 'ml', label: 'ML', color: '#8B5CF6' },
]

const CAT_ICONS = {
    data: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".8"><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6" /><path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" /></svg>,
    web: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".8"><polyline points="8 6 3 12 8 18" /><polyline points="16 6 21 12 16 18" /></svg>,
    reseau: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".8"><circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path d="M7 6h10M6.8 7.2 10.5 16M17.2 7.2 13.5 16" /></svg>,
    ideas: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".8"><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3Z" /></svg>,
    ml: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".8"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></svg>,
    default: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
}

function timeAgo(d) {
    const s = (Date.now() - new Date(d)) / 1000
    if (s < 60) return 'à l\'instant'
    if (s < 3600) return `${Math.floor(s / 60)}min`
    if (s < 86400) return `${Math.floor(s / 3600)}h`
    if (s < 604800) return `${Math.floor(s / 86400)}j`
    return `${Math.floor(s / 604800)}sem`
}
const wc = t => t ? t.split(/\s+/).filter(Boolean).length : 0

// ── Frontmatter parser ────────────────────────────────────────────────────────
function parseFrontmatter(raw) {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/m)
    if (!match) return { meta: {}, content: raw }
    const yamlStr = match[1]
    const content = match[2].trim()
    const meta = {}
    yamlStr.split('\n').forEach(line => {
        const colonIdx = line.indexOf(':')
        if (colonIdx === -1) return
        const key = line.slice(0, colonIdx).trim()
        const val = line.slice(colonIdx + 1).trim()
        if (val.startsWith('[') && val.endsWith(']')) {
            meta[key] = val.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''))
        } else {
            meta[key] = val.replace(/^["']|["']$/g, '')
        }
    })
    return { meta, content }
}

// ── Markdown renderer ─────────────────────────────────────────────────────────
function inlineRender(text) {
    return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} style={{ color: 'rgba(255,255,255,.9)', fontWeight: 600 }}>{p.slice(2, -2)}</strong>
        if (p.startsWith('*') && p.endsWith('*')) return <em key={i} style={{ color: 'rgba(255,255,255,.6)' }}>{p.slice(1, -1)}</em>
        if (p.startsWith('`') && p.endsWith('`')) return <code key={i} style={{ background: 'rgba(255,255,255,.08)', borderRadius: 5, padding: '1px 6px', fontSize: 13, color: 'rgba(255,255,255,.75)', fontFamily: 'JetBrains Mono, monospace' }}>{p.slice(1, -1)}</code>
        return p
    })
}

function MD({ content, color }) {
    const lines = (content || '').split('\n')
    const els = []; let i = 0
    while (i < lines.length) {
        const l = lines[i]
        if (l.startsWith('```')) {
            const lang = l.slice(3).trim()
            const code = []; i++
            while (i < lines.length && !lines[i].startsWith('```')) { code.push(lines[i]); i++ }
            els.push(
                <div key={i} style={{ margin: '16px 0', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)' }}>
                    {lang && <div style={{ padding: '6px 14px', background: 'rgba(255,255,255,.04)', fontSize: 10, color: color || 'rgba(255,255,255,.35)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.08em', borderBottom: '1px solid rgba(255,255,255,.06)' }}>{lang}</div>}
                    <pre style={{ background: '#0d0d0d', padding: '14px 16px', overflowX: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                        <code style={{ color: 'rgba(255,255,255,.75)' }}>{code.join('\n')}</code>
                    </pre>
                </div>
            )
            i++; continue
        }
        if (l.startsWith('| ')) {
            const rows = []
            while (i < lines.length && lines[i].startsWith('|')) {
                if (!lines[i].match(/^\|[-\s|]+\|$/)) rows.push(lines[i].split('|').filter(Boolean).map(c => c.trim()))
                i++
            }
            els.push(
                <div key={i} style={{ margin: '16px 0', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,.07)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
                        {rows.map((row, ri) => (
                            <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,.06)', background: ri === 0 ? 'rgba(255,255,255,.04)' : 'transparent' }}>
                                {row.map((cell, ci) => (
                                    <td key={ci} style={{ padding: '9px 14px', fontSize: 13, color: ri === 0 ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.5)', fontWeight: ri === 0 ? 600 : 400 }}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </table>
                </div>
            )
            continue
        }
        if (l.startsWith('### ')) { els.push(<h3 key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', margin: '22px 0 6px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{l.slice(4)}</h3>); i++; continue }
        if (l.startsWith('## ')) { els.push(<h2 key={i} style={{ fontSize: 18, color: 'rgba(255,255,255,.85)', margin: '28px 0 8px', fontWeight: 700, fontFamily: 'Inter, sans-serif', letterSpacing: '-.01em' }}>{l.slice(3)}</h2>); i++; continue }
        if (l.startsWith('# ')) { els.push(<h1 key={i} style={{ fontSize: 24, color: '#fff', margin: '32px 0 10px', fontWeight: 700, fontFamily: 'Inter, sans-serif', letterSpacing: '-.02em' }}>{l.slice(2)}</h1>); i++; continue }
        if (l.startsWith('- ')) {
            const items = []
            while (i < lines.length && lines[i].startsWith('- ')) {
                items.push(<li key={i} style={{ margin: '5px 0', color: 'rgba(255,255,255,.55)', fontSize: 14, lineHeight: 1.6 }}>{inlineRender(lines[i].slice(2))}</li>)
                i++
            }
            els.push(<ul key={`ul${i}`} style={{ paddingLeft: 20, margin: '10px 0', borderLeft: `2px solid ${color || 'rgba(255,255,255,.08)'}` }}>{items}</ul>)
            continue
        }
        if (l.trim() === '') { els.push(<div key={i} style={{ height: 8 }} />); i++; continue }
        els.push(<p key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,.55)', lineHeight: 1.85, margin: '4px 0', fontFamily: 'Inter, sans-serif' }}>{inlineRender(l)}</p>)
        i++
    }
    return <div>{els}</div>
}

// ── Note Card ─────────────────────────────────────────────────────────────────

function NoteCard({ note, isActive, onClick }) {
    const [hov, setHov] = useState(false)
    const cat = CATS.find(c => note.tags?.includes(c.id) && c.id !== 'all') || CATS[1]
    const color = note.meta?.color || cat.color
    const ytId = note.meta?.video?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1]

    // Extraire premier code block du contenu
    const codeMatch = note.content?.match(/```(?:\w+)?\n([\s\S]*?)```/)
    const firstCode = codeMatch?.[1]

    // Preview texte (hors code)
    const preview = note.content?.replace(/```[\s\S]*?```/g, '').replace(/^#+.*/gm, '').replace(/[*`|]/g, '').replace(/\n+/g, ' ').trim().slice(0, 70)

    return (
        <motion.div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            whileHover={{ y: -6, scale: 1.012 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            style={{ background: '#111', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', marginBottom: 12, border: `1px solid ${isActive ? `${color}44` : hov ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.07)'}`, boxShadow: isActive ? `0 0 0 1px ${color}33, 0 32px 64px rgba(0,0,0,.5)` : hov ? `0 32px 64px rgba(0,0,0,.6), 0 0 0 1px ${color}22` : 'none', transition: 'all .3s' }}>

            {/* ── Hero ── */}
            <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                {/* bg gradient */}
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${color}18 0%, #0a0a0a 65%)` }} />
                {/* grid dots */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${color}20 1px, transparent 1px)`, backgroundSize: '20px 20px', opacity: .7 }} />
                {/* glow */}
                <div style={{ position: 'absolute', top: -20, left: -20, width: 180, height: 180, background: `radial-gradient(circle, ${color}28, transparent 65%)` }} />
                {/* tag */}
                <div style={{ position: 'absolute', top: 16, left: 16, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600, letterSpacing: '.1em', padding: '4px 10px', borderRadius: 20, background: `${color}22`, color, border: `1px solid ${color}33` }}>
                    {cat.label.toUpperCase()} {note.tags?.filter(t => !CATS.map(c => c.id).includes(t))[0]?.toUpperCase() || ''}
                </div>
                {/* level badge */}
                {note.meta?.level && (
                    <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, fontWeight: 600, color: color, background: `${color}18`, border: `1px solid ${color}28`, borderRadius: 20, padding: '3px 9px' }}>
                        {note.meta.level}
                    </div>
                )}
                {/* title */}
                <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: '#fff', lineHeight: .92, letterSpacing: '.02em', marginBottom: 5 }}>
                        {(note.meta?.title || note.title)?.toUpperCase().replace(' ', '\n') || 'SANS TITRE'}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)', lineHeight: 1.45 }}>
                        {preview?.slice(0, 55)}
                    </div>
                </div>
            </div>


            {/* ── footer ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,.05)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 600, color, letterSpacing: '.08em' }}>{cat.label.toUpperCase()}</span>
                {note.meta?.level && <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.4)', fontWeight: 500 }}>{note.meta.level}</span>}
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,.2)' }}>{timeAgo(note.updated_at)}</span>
            </div>
        </motion.div>
    )
}

// ── Note Reader (sidebar droite) ──────────────────────────────────────────────
function NoteReader({ note, onClose, onSave, onDelete }) {
    const [editing, setEditing] = useState(false)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [saving, setSaving] = useState(false)

    const cat = CATS.find(c => note.tags?.includes(c.id) && c.id !== 'all') || CATS[1]
    const color = note.meta?.color || cat.color
    const ytId = note.meta?.video?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1]

    useEffect(() => {
        const raw = `---\n${Object.entries(note.meta || {}).map(([k, v]) => Array.isArray(v) ? `${k}: [${v.join(', ')}]` : `${k}: ${v}`).join('\n')}\n---\n${note.content || ''}`
        setTitle(note.meta?.title || note.title || ''); setContent(raw); setTags(note.tags?.filter(t => !CATS.map(c => c.id).includes(t)).join(', ') || '')
        setEditing(false)
    }, [note?.id])

    useEffect(() => {
        const fn = e => { if ((e.ctrlKey || e.metaKey) && e.key === 's' && editing) { e.preventDefault(); handleSave() } }
        window.addEventListener('keydown', fn); return () => window.removeEventListener('keydown', fn)
    }, [editing, title, content, tags])

    async function handleSave() {
        setSaving(true)
        const { meta, content: parsedContent } = parseFrontmatter(content)
        
        let finalTitle = title
        if (meta.title && meta.title !== note.meta?.title) {
            finalTitle = meta.title
        }
        delete meta.title

        const catTags = note.tags?.filter(t => CATS.map(c => c.id).includes(t)) || []
        const finalTags = [...new Set([...catTags, ...(meta.tags || []), ...tags.split(',').map(t => t.trim()).filter(Boolean)])]
        await onSave({ title: finalTitle, content: parsedContent, tags: finalTags, meta })
        setSaving(false); setEditing(false)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0d0d0d', overflow: 'hidden' }}>
            {/* topbar */}
            <div style={{ height: 48, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${color}12, transparent 60%)`, pointerEvents: 'none' }} />
                <button onClick={onClose} style={{ background: 'rgba(255,255,255,.07)', border: 'none', borderRadius: 20, padding: '5px 12px', fontSize: 11, color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', position: 'relative', zIndex: 1 }}>←</button>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, position: 'relative', zIndex: 1 }}>
                    {editing
                        ? <><button onClick={() => setEditing(false)} style={{ background: 'rgba(255,255,255,.07)', border: 'none', borderRadius: 20, padding: '5px 12px', fontSize: 11, color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Annuler</button>
                            <button onClick={handleSave} disabled={saving} style={{ background: color, border: 'none', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: '#000', fontWeight: 600, cursor: 'pointer', opacity: saving ? .6 : 1, fontFamily: 'Inter, sans-serif' }}>{saving ? '···' : 'Sauvegarder'}</button></>
                        : <><button onClick={() => setEditing(true)} style={{ background: 'rgba(255,255,255,.07)', border: 'none', borderRadius: 20, padding: '5px 12px', fontSize: 11, color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Modifier</button>
                            <button onClick={onDelete} style={{ background: 'rgba(255,255,255,.05)', border: 'none', borderRadius: 20, padding: '5px 10px', fontSize: 11, color: 'rgba(255,100,100,.7)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>×</button></>
                    }
                </div>
            </div>

            {/* contenu scrollable */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 40px' }}>
                {editing ? (
                    <>
                        <input value={title} onChange={e => setTitle(e.target.value)}
                            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 20, fontWeight: 700, color: '#fff', width: '100%', marginBottom: 8, fontFamily: 'Inter, sans-serif', letterSpacing: '-.02em', borderBottom: `1px solid ${color}33`, paddingBottom: 8, caretColor: color }} placeholder="Titre" />
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.15)', marginBottom: 10, letterSpacing: '.06em' }}>Frontmatter YAML + markdown · ⌘S pour sauvegarder</div>
                        <textarea value={content} onChange={e => setContent(e.target.value)} autoFocus
                            style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: `1px solid rgba(255,255,255,.07)`, borderRadius: 10, outline: 'none', resize: 'none', color: 'rgba(255,255,255,.7)', fontSize: 12, lineHeight: 1.8, minHeight: 400, fontFamily: 'JetBrains Mono, monospace', padding: '12px 14px', caretColor: color }} />
                    </>
                ) : (
                    <>
                        {/* badges */}
                        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 10, color, background: `${color}18`, borderRadius: 6, padding: '2px 8px', fontWeight: 600, border: `1px solid ${color}25` }}>{cat.label}</span>
                            {note.meta?.level && <span style={{ fontSize: 10, color: color, background: `${color}12`, borderRadius: 6, padding: '2px 8px', border: `1px solid ${color}20` }}>{note.meta.level}</span>}
                            {note.meta?.readTime && <span style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', background: 'rgba(255,255,255,.05)', borderRadius: 6, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 3 }}><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>{note.meta.readTime}min</span>}
                            {note.tags?.filter(t => !CATS.map(c => c.id).includes(t)).map(tag => (
                                <span key={tag} style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', background: 'rgba(255,255,255,.05)', borderRadius: 6, padding: '2px 8px' }}>{tag}</span>
                            ))}
                        </div>

                        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-.02em', lineHeight: 1.15, fontFamily: 'Inter, sans-serif' }}>{note.meta?.title || note.title || 'Sans titre'}</h1>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', marginBottom: 20 }}>{timeAgo(note.updated_at)} · {wc(note.content)} mots</div>

                        {/* vidéo miniature */}
                        {note.meta?.video && (() => {
                            const vId = note.meta.video.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1]
                            if (!vId) return null
                            return (
                                <div onClick={() => window.open(note.meta.video, '_blank')} style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,.07)', cursor: 'pointer', position: 'relative' }}>
                                    <img src={`https://img.youtube.com/vi/${vId}/hqdefault.jpg`} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block', filter: 'brightness(.6)' }} />
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,0,0,.7)', border: '1px solid rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="m8 6 12 6-12 6V6z" /></svg>
                                        </div>
                                    </div>
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 10px', background: 'linear-gradient(transparent,rgba(0,0,0,.8))', fontSize: 10, color: 'rgba(255,255,255,.6)' }}>Vidéo liée · clic pour ouvrir</div>
                                </div>
                            )
                        })()}

                        {/* formule */}
                        {note.meta?.formula && (
                            <div style={{ marginBottom: 20, background: 'rgba(0,0,0,.3)', border: `1px solid ${color}22`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, color, marginBottom: 4 }}>{note.meta.formula}</div>
                                {note.meta.formulaDesc && <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>{note.meta.formulaDesc}</div>}
                            </div>
                        )}

                        <div style={{ height: 1, background: `${color}20`, marginBottom: 20 }} />
                        <MD content={note.content} color={color} />
                    </>
                )}
            </div>
        </div>
    )
}

// ── AI Sidebar (gauche) ───────────────────────────────────────────────────────
function AISidebar({ context, onClose }) {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

    async function send() {
        if (!input.trim() || loading) return
        const userMsg = { role: 'user', content: input }
        const next = [...messages, userMsg]
        setMessages(next); setInput(''); setLoading(true)
        try {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514', max_tokens: 1000,
                    system: `Tu es un assistant expert data, dev web, tech. Réponds concis et précis.${context ? ` Contexte : ${context.slice(0, 400)}` : ''}`,
                    messages: next
                }),
            })
            const data = await res.json()
            setMessages(m => [...m, { role: 'assistant', content: data.content?.[0]?.text ?? 'Erreur.' }])
        } catch { setMessages(m => [...m, { role: 'assistant', content: 'Erreur de connexion.' }]) }
        setLoading(false)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0a0a0a' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <motion.div animate={{ opacity: [.3, 1, .3] }} transition={{ duration: 2.5, repeat: Infinity }}
                        style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,.5)' }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,.8)', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>IA</span>
                </div>
                <button onClick={onClose} style={{ background: 'rgba(255,255,255,.07)', border: 'none', borderRadius: 20, padding: '4px 10px', fontSize: 11, color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.length === 0 && <p style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>Pose une question sur le contenu de la note ou sur data / dev...</p>}
                {messages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '90%', fontSize: 12, lineHeight: 1.75, fontFamily: 'Inter, sans-serif', padding: '8px 12px', background: m.role === 'user' ? 'rgba(255,255,255,.08)' : 'transparent', color: m.role === 'user' ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.55)', borderRadius: m.role === 'user' ? 12 : 0, whiteSpace: 'pre-wrap' }}>{m.content}</div>
                    </div>
                ))}
                {loading && <div style={{ display: 'flex', gap: 4 }}>{[0, 1, 2].map(i => <motion.div key={i} animate={{ opacity: [.2, 1, .2] }} transition={{ duration: 1, repeat: Infinity, delay: i * .2 }} style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,.4)' }} />)}</div>}
                <div ref={bottomRef} />
            </div>
            <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', gap: 7, flexShrink: 0 }}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                    placeholder="Ask anything..."
                    style={{ flex: 1, background: 'rgba(255,255,255,.06)', border: 'none', borderRadius: 20, padding: '8px 12px', color: 'rgba(255,255,255,.85)', fontSize: 12, outline: 'none', fontFamily: 'Inter, sans-serif' }} />
                <button onClick={send} disabled={loading} style={{ background: loading ? 'rgba(255,255,255,.06)' : '#fff', color: loading ? 'rgba(255,255,255,.2)' : '#000', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}>↑</button>
            </div>
        </div>
    )
}



// ── Main ──────────────────────────────────────────────────────────────────────
export default function BrainHub() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [activeNote, setActiveNote] = useState(null)
    const [aiOpen, setAiOpen] = useState(false)
    const [newMode, setNewMode] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newCat, setNewCat] = useState('data')

    useEffect(() => { load() }, [])

    async function load() {
        const { data } = await supabase.from('notes').select('*').order('updated_at', { ascending: false })
        setNotes(data ?? [])
        setLoading(false)
    }

    const catCounts = CATS.reduce((acc, c) => {
        acc[c.id] = c.id === 'all' ? notes.length : notes.filter(n => n.tags?.includes(c.id)).length
        return acc
    }, {})

    const filtered = notes.filter(n => {
        const matchCat = filter === 'all' || n.tags?.includes(filter)
        const q = search.toLowerCase()
        const matchSearch = !q || n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)
        return matchCat && matchSearch
    })

    const activeColor = CATS.find(c => c.id === filter)?.color || '#fff'

    async function createNote() {
        if (!newTitle.trim()) return
        const { data } = await supabase.from('notes').insert({ user_id: user.id, title: newTitle, content: '', tags: [newCat], meta: {} }).select().single()
        if (data) { setNotes(n => [data, ...n]); setActiveNote(data); setNewMode(false); setNewTitle('') }
    }

    async function saveNote(updates) {
        if (!activeNote) return
        const { data } = await supabase.from('notes').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', activeNote.id).select().single()
        if (data) { setNotes(n => n.map(x => x.id === data.id ? data : x)); setActiveNote(data) }
    }

    async function deleteNote() {
        if (!activeNote || !window.confirm('Supprimer cette note ?')) return
        await supabase.from('notes').delete().eq('id', activeNote.id)
        setNotes(n => n.filter(x => x.id !== activeNote.id)); setActiveNote(null)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a0a', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:3px;}
        textarea,input{font-family:Inter,sans-serif!important;}
        textarea::placeholder,input::placeholder{color:rgba(255,255,255,.2)!important;}
      `}</style>

            {/* top glow */}
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 140, background: `radial-gradient(ellipse at 50% -30%, ${activeColor}10, transparent 70%)`, pointerEvents: 'none', zIndex: 0, transition: 'background .5s' }} />

            {/* ── Topbar ── */}
            <div style={{ height: 50, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,.06)', position: 'relative', zIndex: 10 }}>
                <div onClick={() => navigate('/brain')} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <motion.div 
                        animate={{ 
                            backgroundColor: ['#5BA8F0', '#3DC795', '#E87BA0', '#8B5CF6', '#5BA8F0'],
                            boxShadow: [
                                '0 0 12px rgba(91,168,240,0.7)', 
                                '0 0 12px rgba(61,199,149,0.7)', 
                                '0 0 12px rgba(232,123,160,0.7)', 
                                '0 0 12px rgba(139,92,246,0.7)', 
                                '0 0 12px rgba(91,168,240,0.7)'
                            ] 
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        style={{ width: 10, height: 10, borderRadius: '50%', padding: 0, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#fff', fontWeight: 700, letterSpacing: '-.01em' }}>axiome.</span>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.2)' }}>{loading ? '...' : `${filtered.length} note${filtered.length !== 1 ? 's' : ''}`}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.05)', borderRadius: 20, padding: '5px 13px' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
                            style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: 'rgba(255,255,255,.7)', width: 140 }} />
                    </div>
                    <button onClick={() => setNewMode(true)} style={{ background: '#fff', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 11, color: '#0a0a0a', cursor: 'pointer', fontWeight: 600 }}>+ Note</button>
                    <NotifPanel />
                    <button onClick={logout} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: '6px 12px', fontSize: 11, color: 'rgba(255,255,255,.5)', cursor: 'pointer' }} title="Déconnexion">🚪</button>
                </div>
            </div>

            {/* ── Filters — tabs option B ── */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0, padding: '0 20px', overflowX: 'auto', position: 'relative', zIndex: 10 }}>
                {CATS.map(cat => (
                    <button key={cat.id} onClick={() => setFilter(cat.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px', cursor: 'pointer', position: 'relative', background: 'transparent', border: 'none', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
                        <span style={{ fontSize: 12, color: filter === cat.id ? '#fff' : 'rgba(255,255,255,.35)', fontWeight: filter === cat.id ? 600 : 400, transition: 'color .2s' }}>{cat.label}</span>
                        <span style={{ fontSize: 10, color: filter === cat.id ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.18)', transition: 'color .2s' }}>{loading ? '...' : (catCounts[cat.id] || 0)}</span>
                        {filter === cat.id && (
                            <motion.div layoutId="filter-line"
                                style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, borderRadius: '2px 2px 0 0', background: cat.color }} />
                        )}
                    </button>
                ))}
            </div>

            {/* ── Body (IA gauche + masonry + note droite) ── */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', zIndex: 1 }}>

                {/* ── AI sidebar gauche ── */}
                <AnimatePresence>
                    {aiOpen && (
                        <motion.div initial={{ width: 0 }} animate={{ width: 300 }} exit={{ width: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                            style={{ borderRight: '1px solid rgba(255,255,255,.06)', overflow: 'hidden', flexShrink: 0 }}>
                            <div style={{ width: 300, height: '100%' }}>
                                <AISidebar context={activeNote?.content} onClose={() => setAiOpen(false)} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Grid cards ── */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 80px', display: 'grid', gridTemplateColumns: activeNote ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12, alignItems: 'start', alignContent: 'start' }}>

                    {/* new note inline */}
                    <AnimatePresence>
                        {newMode && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                style={{ background: 'rgba(255,255,255,.04)', borderRadius: 16, padding: '16px', border: '1px solid rgba(255,255,255,.08)', gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') createNote(); if (e.key === 'Escape') setNewMode(false) }}
                                    placeholder="Titre de la note..."
                                    style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 15, color: '#fff', fontWeight: 600 }} />
                                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                    {CATS.filter(c => c.id !== 'all').map(c => (
                                        <button key={c.id} onClick={() => setNewCat(c.id)}
                                            style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer', fontFamily: 'Inter, sans-serif', border: `1px solid ${newCat === c.id ? c.color : 'rgba(255,255,255,.1)'}`, background: newCat === c.id ? `${c.color}20` : 'transparent', color: newCat === c.id ? c.color : 'rgba(255,255,255,.4)', transition: 'all .2s' }}>
                                            {c.label}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={createNote} style={{ background: '#fff', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 11, color: '#0a0a0a', cursor: 'pointer', fontWeight: 600 }}>Créer</button>
                                    <button onClick={() => setNewMode(false)} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: '6px 12px', fontSize: 11, color: 'rgba(255,255,255,.5)', cursor: 'pointer' }}>Annuler</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {filtered.map(note => (
                        <div key={note.id}>
                            <NoteCard note={note} isActive={activeNote?.id === note.id} onClick={() => setActiveNote(n => n?.id === note.id ? null : note)} />
                        </div>
                    ))}

                    {loading ? (
                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [.2, 1, .2] }} transition={{ delay: 0.2, duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,.3)' }} />
                        </div>
                    ) : filtered.length === 0 && !newMode && (
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, paddingTop: 60 }}>
                            <p style={{ color: 'rgba(255,255,255,.2)', fontSize: 14 }}>Aucune note{filter !== 'all' ? ` en ${CATS.find(c => c.id === filter)?.label}` : ''}</p>
                            <button onClick={() => setNewMode(true)} style={{ background: '#fff', border: 'none', borderRadius: 20, padding: '8px 18px', fontSize: 12, color: '#0a0a0a', cursor: 'pointer', fontWeight: 600 }}>+ Créer une note</button>
                        </div>
                    )}

                    {!loading && !newMode && filtered.length > 0 && (
                        <div>
                            <motion.div onClick={() => setNewMode(true)} whileHover={{ scale: 1.02 }}
                                style={{ borderRadius: 18, border: '1px dashed rgba(255,255,255,.07)', cursor: 'pointer', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.2)' }}>+ nouvelle note</span>
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* ── Note reader droite ── */}
                <AnimatePresence>
                    {activeNote && (
                        <motion.div key={activeNote.id}
                            initial={{ width: 0, opacity: 0 }} animate={{ width: 600, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                            style={{ borderLeft: 'none', overflow: 'hidden', flexShrink: 0, display: 'flex' }}>
                            <div style={{ flex: 1, height: '100%', borderLeft: '1px solid rgba(255,255,255,.06)', overflow: 'hidden' }}>
                                <NoteReader note={activeNote} onClose={() => setActiveNote(null)} onSave={saveNote} onDelete={deleteNote} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Bottom left — IA ── */}
            <motion.div 
                animate={{ x: aiOpen ? 300 : 0 }} 
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                style={{ position: 'absolute', bottom: 18, left: 18, zIndex: 30, display: 'flex', gap: 8, alignItems: 'center' }}>
                <motion.button onClick={() => setAiOpen(o => !o)} whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}
                    style={{ width: 42, height: 42, borderRadius: '50%', background: aiOpen ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.06)', border: `1px solid ${aiOpen ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.1)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={aiOpen ? "rgba(255,255,255,.8)" : "none"} stroke="rgba(255,255,255,.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    </svg>
                </motion.button>
            </motion.div>
        </div>
    )
}