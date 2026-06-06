import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { lang, t } = useLanguage()

    async function handleLogin(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }
        navigate('/brain')
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#060606',
            color: '#F0EDE8',
            fontFamily: "'Space Grotesk', sans-serif"
        }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: 320, padding: 20 }}
            >
                <h1 style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 48,
                    letterSpacing: '0.04em',
                    lineHeight: 1,
                    marginBottom: 40,
                    textAlign: 'center'
                }}>
                    {t({ FR: 'CONNEXION', EN: 'LOGIN' })}
                </h1>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                        <input
                            type="email"
                            placeholder={t({ FR: 'Email', EN: 'Email' })}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid #333',
                                outline: 'none',
                                padding: '10px 0',
                                color: '#F0EDE8',
                                fontSize: 16,
                                fontFamily: "'Space Grotesk', sans-serif",
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#888'}
                            onBlur={e => e.target.style.borderColor = '#333'}
                        />
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            placeholder={t({ FR: 'Mot de passe', EN: 'Password' })}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid #333',
                                outline: 'none',
                                padding: '10px 0',
                                color: '#F0EDE8',
                                fontSize: 16,
                                fontFamily: "'Space Grotesk', sans-serif",
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#888'}
                            onBlur={e => e.target.style.borderColor = '#333'}
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#D4537E', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        type="submit"
                        style={{
                            marginTop: 10,
                            background: '#F0EDE8',
                            color: '#060606',
                            border: 'none',
                            padding: '14px',
                            fontSize: 14,
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: '0.05em',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {loading ? '...' : t({ FR: 'SE CONNECTER', EN: 'ENTER' })}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}