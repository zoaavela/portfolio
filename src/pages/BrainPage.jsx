import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthProvider'


const THEMES = {
    brainhub: { color: [100, 185, 255], hex: '#5BA8F0', label: 'BrainHub' },
    portfolio: { color: [45, 215, 155], hex: '#3DC795', label: 'Portfolio' },
    locked1: { color: [80, 80, 80], hex: '#555555', label: 'Indisponible' },
    locked2: { color: [80, 80, 80], hex: '#555555', label: 'Indisponible' },
}
const DEFAULT_COLOR = [210, 240, 255]
const ORDER = ['brainhub', 'portfolio', 'locked1', 'locked2']

const ICONS = {
    brainhub: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></>,
    portfolio: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
    locked1: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    locked2: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
}

export default function BrainPage() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const sceneRef = useRef(null)
    const canvasRef = useRef(null)
    const nodeRefs = useRef([])

    const anim = useRef({
        cx: 0, cy: 0, orbitR: 150, circle: 64, dpr: 1,
        t: 0, orbitAngle: 0,
        cur: [...DEFAULT_COLOR], target: [...DEFAULT_COLOR],
        linkOp: [0, 0, 0, 0], hoveredIdx: -1,
        pos: [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
        raf: 0,
    })

    useEffect(() => {
        const lerp = (a, b, s) => a + (b - a) * s

        function setup() {
            const scene = sceneRef.current
            if (!scene) return
            const sw = scene.offsetWidth, sh = scene.offsetHeight
            const minDim = Math.min(Math.min(sw, sh), 600)
            const a = anim.current
            a.cx = sw / 2; a.cy = sh / 2
            a.orbitR = Math.round(minDim * 0.33)
            a.circle = Math.round(minDim * 0.135)
            a.dpr = window.devicePixelRatio || 1

            const bg = canvasRef.current
            bg.width = sw * a.dpr; bg.height = sh * a.dpr
            bg.style.width = sw + 'px'; bg.style.height = sh + 'px'
            bg.getContext('2d').setTransform(a.dpr, 0, 0, a.dpr, 0, 0)

            const labelSize = Math.max(9, Math.round(minDim * 0.025))
            const iconSize = Math.round(a.circle * 0.4)
            nodeRefs.current.forEach(node => {
                if (!node) return
                const nc = node.querySelector('.node-circle')
                nc.style.width = a.circle + 'px'; nc.style.height = a.circle + 'px'
                const svg = nc.querySelector('svg')
                svg.setAttribute('width', iconSize); svg.setAttribute('height', iconSize)
                node.querySelector('.node-label').style.fontSize = labelSize + 'px'
            })
        }

        function positionNodes() {
            const a = anim.current
            a.orbitAngle += 0.0020
            ORDER.forEach((_, i) => {
                const ang = a.orbitAngle + i * (Math.PI / 2)
                a.pos[i].x = Math.cos(ang) * a.orbitR
                a.pos[i].y = Math.sin(ang) * a.orbitR
                const node = nodeRefs.current[i]
                if (node) node.style.transform = `translate(calc(${a.pos[i].x}px - 50%), calc(${a.pos[i].y}px - 50%))`
            })
        }

        function drawScene() {
            const a = anim.current
            const bg = canvasRef.current
            if (!bg) return
            const ctx = bg.getContext('2d')
            const sw = bg.width / a.dpr, sh = bg.height / a.dpr
            ctx.clearRect(0, 0, sw, sh)
            const cx = a.cx, cy = a.cy
            const [r, g, b] = a.cur.map(Math.round)

            ORDER.forEach((_, i) => {
                const target = (i === a.hoveredIdx) ? 1 : 0
                a.linkOp[i] = lerp(a.linkOp[i], target, 0.12)
                const alpha = 0.08 + 0.47 * a.linkOp[i]
                const cr = Math.round(lerp(r, 255, a.linkOp[i]))
                const cg = Math.round(lerp(g, 255, a.linkOp[i]))
                const cb = Math.round(lerp(b, 255, a.linkOp[i]))
                ctx.beginPath()
                ctx.moveTo(cx, cy)
                ctx.lineTo(cx + a.pos[i].x, cy + a.pos[i].y)
                ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`
                ctx.lineWidth = 0.5 + a.linkOp[i] * 0.5
                ctx.stroke()
            })

            const minDim = Math.min(Math.min(sw, sh), 600)
            const pulse = 1 + Math.sin(a.t * 0.035) * 0.035 + Math.sin(a.t * 0.06) * 0.018
            const rad = minDim * 0.10 * pulse

            const gg = ctx.createRadialGradient(cx, cy, rad * 0.4, cx, cy, rad * 3.2)
            gg.addColorStop(0, `rgba(${r},${g},${b},0.10)`)
            gg.addColorStop(1, `rgba(0,0,0,0)`)
            ctx.beginPath(); ctx.arc(cx, cy, rad * 3.2, 0, Math.PI * 2); ctx.fillStyle = gg; ctx.fill()

            const g1 = ctx.createRadialGradient(cx, cy - rad * 0.15, 0, cx, cy, rad)
            g1.addColorStop(0, `rgba(${r},${g},${b},1)`)
            g1.addColorStop(0.4, `rgba(${r},${g},${b},0.82)`)
            g1.addColorStop(0.7, `rgba(${Math.round(r * 0.55)},${Math.round(g * 0.65)},${Math.round(b * 0.85)},0.4)`)
            g1.addColorStop(1, `rgba(0,0,0,0)`)
            ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fillStyle = g1; ctx.fill()

            const g3 = ctx.createRadialGradient(cx, cy - rad * 0.4, rad * 0.05, cx, cy, rad)
            g3.addColorStop(0, `rgba(255,255,255,0.6)`)
            g3.addColorStop(0.35, `rgba(255,255,255,0.06)`)
            g3.addColorStop(1, `rgba(255,255,255,0)`)
            ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fillStyle = g3; ctx.fill()

            a.t++
        }

        function loop() {
            const a = anim.current
            a.cur[0] = lerp(a.cur[0], a.target[0], 0.045)
            a.cur[1] = lerp(a.cur[1], a.target[1], 0.045)
            a.cur[2] = lerp(a.cur[2], a.target[2], 0.045)
            positionNodes()
            drawScene()
            a.raf = requestAnimationFrame(loop)
        }

        setup()
        loop()

        let rt
        const onResize = () => { clearTimeout(rt); rt = setTimeout(setup, 120) }
        window.addEventListener('resize', onResize)
        return () => {
            cancelAnimationFrame(anim.current.raf)
            window.removeEventListener('resize', onResize)
            clearTimeout(rt)
        }
    }, [])

    function onHover(i, theme) {
        anim.current.target = theme ? [...THEMES[theme].color] : [...DEFAULT_COLOR]
        anim.current.hoveredIdx = theme ? i : -1
    }

    return (
        <div ref={sceneRef} style={styles.scene}>
            <canvas ref={canvasRef} style={styles.canvas} />

            <div style={styles.topbar}>
                <span style={styles.brand}>axiome</span>
                <button onClick={() => navigate('/')} style={styles.logout} title="Retour à l'accueil">↩</button>
            </div>

            {ORDER.map((theme, i) => (
                <div
                    key={theme}
                    ref={el => (nodeRefs.current[i] = el)}
                    data-t={theme}
                    className="brain-node"
                    style={styles.node}
                    onMouseEnter={() => { if (!theme.startsWith('locked')) onHover(i, theme) }}
                    onMouseLeave={() => { if (!theme.startsWith('locked')) onHover(i, null) }}
                    onClick={() => {
                        if (theme === 'brainhub') navigate('/brain/notes')
                        else if (theme === 'portfolio') navigate('/projets')
                    }}
                >
                    <div className="node-circle" style={styles.nodeCircle}>
                        <svg viewBox="0 0 24 24" width="22" height="22" strokeWidth="1.5" style={{ fill: 'none', stroke: '#555', transition: 'stroke .5s' }}>
                            {ICONS[theme]}
                        </svg>
                    </div>
                    <span className="node-label" style={styles.nodeLabel}>{THEMES[theme].label}</span>
                </div>
            ))}


            <style>{`
        .brain-node { cursor: pointer; }
        .brain-node:hover .node-circle { transform: scale(1.12); }
        .node-circle { transition: border-color .5s, background .5s, box-shadow .5s, transform .35s; }
        .node-label { transition: color .5s; }
        
        .brain-node[data-t="brainhub"]:hover .node-circle { border-color:#5BA8F088; background:rgba(5,17,31,.8); box-shadow:0 0 28px -6px #5BA8F066; }
        .brain-node[data-t="brainhub"]:hover .node-circle svg { stroke:#5BA8F0; }
        .brain-node[data-t="brainhub"]:hover .node-label { color:#5BA8F0; }
        
        .brain-node[data-t="portfolio"]:hover .node-circle { border-color:#3DC79588; background:rgba(4,26,16,.8); box-shadow:0 0 28px -6px #3DC79566; }
        .brain-node[data-t="portfolio"]:hover .node-circle svg { stroke:#3DC795; }
        .brain-node[data-t="portfolio"]:hover .node-label { color:#3DC795; }
        
        .brain-node[data-t^="locked"] { cursor: not-allowed; opacity: 0.5; }
        .brain-node[data-t^="locked"]:hover .node-circle { transform: none; border-color: #555; background: rgba(13,13,13,.7); box-shadow: none; }
        .brain-node[data-t^="locked"]:hover .node-circle svg { stroke: #555; }
        .brain-node[data-t^="locked"]:hover .node-label { color: #333; }
      `}</style>
        </div>
    )
}

const styles = {
    scene: { position: 'relative', width: '100%', height: '100vh', background: '#060606', overflow: 'hidden' },
    canvas: { position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' },
    topbar: { position: 'absolute', top: 18, left: 22, right: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 20 },
    brand: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#333', letterSpacing: '.15em' },
    logout: { background: 'transparent', border: '1px solid #1e1e1e', borderRadius: 6, width: 30, height: 30, cursor: 'pointer', color: '#444', fontSize: 13 },
    node: { position: 'absolute', top: '50%', left: '50%', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, willChange: 'transform' },
    nodeCircle: { borderRadius: '50%', background: 'rgba(13,13,13,.7)', border: '1px solid #1e1e1e', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    nodeLabel: { fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.16em', textTransform: 'uppercase', color: '#333', fontWeight: 500 },
}