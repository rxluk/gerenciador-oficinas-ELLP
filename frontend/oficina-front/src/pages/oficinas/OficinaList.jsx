import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import oficinaService from '../../services/oficinaService'
import api from '../../services/api'
import { formatDate } from '../../utils/formatDate'

export default function OficinaList() {
  const [oficinas, setOficinas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const { hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      oficinaService.findAll(),
      api.get('/usuarios'),
    ])
      .then(([oRes, uRes]) => {
        setOficinas(oRes.data)
        setUsuarios(uRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const professorMap = Object.fromEntries(usuarios.map((u) => [u.id, u]))

  function getProfessorNome(oficina) {
    return professorMap[oficina.professorId]?.nome || '-'
  }

  const termo = busca.trim().toLowerCase()
  const oficinasFiltradas = termo
    ? oficinas.filter((o) => {
        const professorNome = getProfessorNome(o)
        return (
          o.titulo.toLowerCase().includes(termo) ||
          professorNome.toLowerCase().includes(termo) ||
          (o.sala || '').toLowerCase().includes(termo) ||
          formatDate(o.dataInicio).includes(termo) ||
          formatDate(o.dataFim).includes(termo)
        )
      })
    : oficinas

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

        <div className="px-6 py-3 border-b border-gray-100">
          <div className="relative max-w-sm">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por título, professor, sala, data..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Carregando...</div>
        ) : oficinasFiltradas.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            {termo ? 'Nenhum resultado encontrado.' : 'Nenhuma oficina cadastrada.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Professor</th>
                <th className="px-6 py-3">Sala</th>
                <th className="px-6 py-3">Início</th>
                <th className="px-6 py-3">Fim</th>
                {hasPermission('UPDATE_OFICINA') && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {oficinasFiltradas.map((oficina, i) => (
                <tr key={oficina.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 font-medium text-gray-800">{oficina.titulo}</td>
                  <td className="px-6 py-3 text-gray-700">{getProfessorNome(oficina)}</td>
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