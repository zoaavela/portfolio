import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [session, setSession] = useState(undefined)

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(data.session))
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
        return () => subscription.unsubscribe()
    }, [])

    const logout = () => supabase.auth.signOut()

    return (
        <AuthContext.Provider value={{ session, user: session?.user ?? null, logout }}>
            {session !== undefined && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)