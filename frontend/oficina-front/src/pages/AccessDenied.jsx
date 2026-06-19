import { useNavigate } from 'react-router-dom'

export default function AccessDenied() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f4f6f9' }}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Acesso Negado</h1>
        <p className="text-gray-500 mb-6 text-sm">Você não tem permissão para acessar esta página.</p>
        <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 rounded-lg text-white text-sm" style={{ backgroundColor: '#1e3a5f' }}>
          Voltar ao início
        </button>
      </div>
    </div>
  )
}