import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, permission, anyOf }) {
  const { token, hasPermission, hasAnyPermission, loading } = useAuth()

  if (loading) return null
  if (!token) return <Navigate to="/login" replace />
  if (permission && !hasPermission(permission)) return <Navigate to="/acesso-negado" replace />
  if (anyOf && !hasAnyPermission(anyOf)) return <Navigate to="/acesso-negado" replace />

  return children
}