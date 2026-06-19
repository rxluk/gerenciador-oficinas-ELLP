import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

function decodeJWT(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [permissions, setPermissions] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      const decoded = decodeJWT(token)
      if (decoded) {
        setPermissions(decoded.permissions || [])
        setUser({ email: decoded.sub, ...decoded })
      } else {
        logout()
      }
    }
    setLoading(false)
  }, [token])

  function login(newToken) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    const decoded = decodeJWT(newToken)
    if (decoded) {
      setPermissions(decoded.permissions || [])
      setUser({ email: decoded.sub, ...decoded })
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setPermissions([])
    setUser(null)
  }

  const hasPermission = (p) => permissions.includes(p)
  const hasAnyPermission = (list) => list.some((p) => permissions.includes(p))

  return (
    <AuthContext.Provider value={{ token, user, permissions, login, logout, hasPermission, hasAnyPermission, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}