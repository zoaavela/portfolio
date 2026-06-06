import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthProvider'

const ICONS = {
    access: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
    ),
    note: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
    ),
    ideas: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF9F27" strokeWidth="1.5">
            <path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3Z" />
        </svg>
    ),
}

const ICON_BG = { access: '#0a1f12', note: '#0d1320', ideas: '#1a0e03' }

function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000
    if (diff < 60) return 'à l\'instant'
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`
    return `il y a ${Math.floor(diff / 86400)}j`
}

export default function NotifPanel() {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [notifs, setNotifs] = useState([])
    const panelRef = useRef(null)

    const unread = notifs.filter(n => !n.read).length

    useEffect(() => {
        fetchNotifs()
        const channel = supabase
            .channel('notifications')
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public', table: 'notifications',
                filter: `user_id=eq.${user?.id}`,
            }, payload => {
                setNotifs(prev => [{ ...payload.new, read: false }, ...prev])
            })
            .subscribe()
        return () => supabase.removeChannel(channel)
    }, [user?.id])

    async function fetchNotifs() {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20)
        if (data) setNotifs(data)
    }

    async function markAllRead() {
        const ids = notifs.filter(n => !n.read).map(n => n.id)
        if (!ids.length) return
        await supabase.from('notifications').update({ read: true }).in('id', ids)
        setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    }

    async function respondAccess(notif, accept) {
        if (notif.ref_id) {
            await supabase.from('access_requests')
                .update({ status: accept ? 'approved' : 'denied' })
                .eq('id', notif.ref_id)
        }
        await dismissNotif(notif.id)
    }

    async function dismissNotif(id) {
        await supabase.from('notifications').update({ read: true }).eq('id', id)
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        setTimeout(() => setNotifs(prev => prev.filter(n => n.id !== id)), 300)
    }

    useEffect(() => {
        function onClickOut(e) {
            if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
        }
        if (open) document.addEventListener('mousedown', onClickOut)
        return () => document.removeEventListener('mousedown', onClickOut)
    }, [open])

    return (
        <div ref={panelRef} style={s.wrap}>
            {/* panel — s'ouvre vers le haut */}
            <div style={{
                ...s.panel,
                transform: open ? 'scale(1) translateY(0)' : 'scale(.96) translateY(-6px)',
                opacity: open ? 1 : 0,
                pointerEvents: open ? 'all' : 'none',
                zIndex: 100,
            }}>
                <div style={s.header}>
                    <span style={s.title}>Notifications</span>
                    {unread > 0 && (
                        <button onClick={markAllRead} style={s.markAll}>tout marquer lu</button>
                    )}
                </div>
                <div style={s.list}>
                    {notifs.length === 0 && (
                        <div style={s.empty}>aucune notification</div>
                    )}
                    {notifs.map(notif => (
                        <div key={notif.id} style={{
                            ...s.row,
                            background: notif.read ? 'transparent' : 'rgba(255,255,255,.015)',
                        }}>
                            {!notif.read && <div style={s.unreadDot} />}
                            <div style={{ ...s.iconWrap, background: ICON_BG[notif.type] || ICON_BG.note }}>
                                {ICONS[notif.type] || ICONS.note}
                            </div>
                            <div style={s.body}>
                                <div style={s.msg} dangerouslySetInnerHTML={{ __html: notif.message }} />
                                <div style={s.time}>{timeAgo(notif.created_at)}</div>
                                {notif.type === 'access' && !notif.read && (
                                    <div style={{ display: 'flex', gap: 5, marginTop: 7 }}>
                                        <button onClick={() => respondAccess(notif, true)} style={{ ...s.nb, ...s.nbA }}>accepter</button>
                                        <button onClick={() => respondAccess(notif, false)} style={{ ...s.nb, ...s.nbD }}>refuser</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* bouton cloche */}
            <div style={s.btnRow}>
                <button
                    onClick={() => { setOpen(o => !o); if (!open) markAllRead() }}
                    style={{
                        position: 'relative', width: 42, height: 42, borderRadius: '50%',
                        background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', backdropFilter: 'blur(12px)', transition: 'border-color .2s',
                    }}
                    title="Notifications"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="rgba(255,255,255,.7)" strokeWidth="1.5">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {unread > 0 && <div style={s.badge}>{unread > 9 ? '9+' : unread}</div>}
                </button>
            </div>
        </div>
    )
}

const s = {
    wrap: {
        position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
    },
    panel: {
        position: 'absolute', top: '100%', right: 0, marginTop: 12,
        width: 300, background: '#0d0d0d', border: '1px solid #1e1e1e',
        borderRadius: 12, overflow: 'hidden',
        transition: 'transform .2s cubic-bezier(.4,0,.2,1), opacity .2s',
        transformOrigin: 'top right',
        boxShadow: '0 8px 32px rgba(0,0,0,.5)',
    },
    header: {
        padding: '12px 16px 10px', borderBottom: '1px solid #161616',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    title: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#555', letterSpacing: '.1em' },
    markAll: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#333', background: 'none', border: 'none', cursor: 'pointer' },
    list: { maxHeight: 300, overflowY: 'auto' },
    empty: { padding: '20px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#222', textAlign: 'center' },
    row: { padding: '11px 16px 11px 20px', borderBottom: '1px solid #111', display: 'flex', gap: 10, alignItems: 'flex-start', position: 'relative', transition: 'background .15s' },
    unreadDot: { position: 'absolute', left: 7, top: '50%', transform: 'translateY(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#e24b4a' },
    iconWrap: { width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
    body: { flex: 1, minWidth: 0 },
    msg: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#555', lineHeight: 1.55, marginBottom: 3 },
    time: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#2a2a2a' },
    nb: { border: 'none', borderRadius: 5, padding: '3px 10px', fontSize: 9, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" },
    nbA: { background: '#0a1f12', color: '#1D9E75', border: '1px solid #0f3020' },
    nbD: { background: '#1a0d0d', color: '#5a2222', border: '1px solid #2a1010' },
    btnRow: { display: 'flex', alignItems: 'center', gap: 8 },
    hint: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#e24b4a', letterSpacing: '.04em', animation: 'fadeIn .3s ease' },
    btn: {
        position: 'relative', width: 36, height: 36, borderRadius: '50%',
        background: '#0d0d0d', border: '1px solid',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'border-color .2s',
    },
    badge: {
        position: 'absolute', top: -2, right: -2, minWidth: 14, height: 14,
        borderRadius: 7, background: '#e24b4a', border: '2px solid #060606',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#fff', fontWeight: 700, padding: '0 2px',
    },
}