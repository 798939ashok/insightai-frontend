import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('insightai_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // On mount, check for an existing session token.
    // Real validation happens against the backend in Phase 2.
    const savedUser = localStorage.getItem('insightai_user')
    if (savedUser) setUser(JSON.parse(savedUser))
    setLoading(false)
  }, [])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('insightai_token', jwtToken)
    localStorage.setItem('insightai_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('insightai_token')
    localStorage.removeItem('insightai_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
