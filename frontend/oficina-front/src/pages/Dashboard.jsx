import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const cards = [
  { label: 'Alunos', permission: 'READ_ALUNO', endpoint: '/alunos', color: '#1e3a5f' },
  { label: 'Oficinas', permission: 'READ_OFICINA', endpoint: '/oficinas', color: '#243d5c' },
  { label: 'Matrículas', permission: 'READ_MATRICULA', endpoint: '/matriculas', color: '#1a2f4b' },
  { label: 'Encontros', permission: 'READ_ENCONTRO', endpoint: '/encontros', color: '#2d4f73' },
]

export default function Dashboard() {
  const { hasPermission, user } = useAuth()
  const [counts, setCounts] = useState({})

  useEffect(() => {
    cards.forEach(async (card) => {
      if (hasPermission(card.permission)) {
        try {
          const res = await api.get(card.endpoint)
          setCounts((prev) => ({ ...prev, [card.label]: res.data.length }))
        } catch {
          setCounts((prev) => ({ ...prev, [card.label]: '-' }))
        }
      }
    })
  }, [])

  const visibleCards = cards.filter((c) => hasPermission(c.permission))

  return (
    <Layout title="Dashboard">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Bem-vindo, {user?.name || user?.email || 'usuário'} 👋
        </h2>
        <p className="text-gray-400 text-sm mt-0.5">Aqui está um resumo do sistema.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: card.color }}>
              <span className="text-white text-lg font-bold">
                {card.label[0]}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {counts[card.label] ?? '...'}
              </p>
              <p className="text-sm text-gray-400">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {visibleCards.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400 text-sm">
          Nenhum dado disponível para seu perfil.
        </div>
      )}
    </Layout>
  )
}