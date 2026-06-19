import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import oficinaService from '../../services/oficinaService'
import { formatDate } from '../../utils/formatDate'

export default function OficinaList() {
  const [oficinas, setOficinas] = useState([])
  const [loading, setLoading] = useState(true)
  const { hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    oficinaService.findAll()
      .then((res) => setOficinas(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Oficinas">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Lista de Oficinas</h2>
          {hasPermission('CREATE_OFICINA') && (
            <button
              onClick={() => navigate('/oficinas/novo')}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              + Nova Oficina
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Carregando...</div>
        ) : oficinas.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Nenhuma oficina cadastrada.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Sala</th>
                <th className="px-6 py-3">Início</th>
                <th className="px-6 py-3">Fim</th>
                {hasPermission('UPDATE_OFICINA') && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {oficinas.map((oficina, i) => (
                <tr key={oficina.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 font-medium text-gray-800">{oficina.titulo}</td>
                  <td className="px-6 py-3 text-gray-500">{oficina.sala}</td>
                  <td className="px-6 py-3 text-gray-500">{formatDate(oficina.dataInicio)}</td>
                  <td className="px-6 py-3 text-gray-500">{formatDate(oficina.dataFim)}</td>
                  {hasPermission('UPDATE_OFICINA') && (
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => navigate(`/oficinas/${oficina.id}/editar`)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                      >
                        Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}