import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    async function handleLogin() {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return setError(error.message)
        navigate('/brain')
    }

    return (
        <div style={{ maxWidth: 360, margin: '10vh auto', padding: '0 1rem' }}>
            <h1>Accès</h1>
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: 10 }} />
            <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: 10 }} />
            {error && <p style={{ color: 'red', fontSize: 13 }}>{error}</p>}
            <button onClick={handleLogin} style={{ width: '100%' }}>Se connecter</button>
        </div>
    )
}