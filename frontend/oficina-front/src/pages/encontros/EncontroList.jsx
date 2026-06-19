import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import encontroService from '../../services/encontroService'
import api from '../../services/api'
import { formatDate } from '../../utils/formatDate'

export default function EncontroList() {
  const [encontros, setEncontros] = useState([])
  const [oficinas, setOficinas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const { hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      encontroService.findAll(),
      api.get('/oficinas'),
      api.get('/usuarios'),
    ])
      .then(([eRes, oRes, uRes]) => {
        setEncontros(eRes.data)
        setOficinas(oRes.data)
        setUsuarios(uRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const oficinaMap = Object.fromEntries(oficinas.map((o) => [o.id, o]))
  const usuarioMap = Object.fromEntries(usuarios.map((u) => [u.id, u]))

  function getDetalhes(encontro) {
    const oficina = oficinaMap[encontro.oficinaId]
    return {
      oficinaTitulo: oficina?.titulo || '-',
      sala: oficina?.sala || '-',
      professorNome: oficina ? usuarioMap[oficina.professorId]?.nome || '-' : '-',
    }
  }

  const termo = busca.trim().toLowerCase()
  const encontrosFiltrados = termo
    ? encontros.filter((e) => {
        const d = getDetalhes(e)
        return (
          d.oficinaTitulo.toLowerCase().includes(termo) ||
          d.professorNome.toLowerCase().includes(termo) ||
          d.sala.toLowerCase().includes(termo) ||
          formatDate(e.data).includes(termo) ||
          (e.horarioInicio || '').toLowerCase().includes(termo) ||
          (e.horarioFim || '').toLowerCase().includes(termo)
        )
      })
    : encontros

  return (
    <Layout title="Encontros">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Lista de Encontros</h2>
          {hasPermission('CREATE_ENCONTRO') && (
            <button
              onClick={() => navigate('/encontros/novo')}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              + Novo Encontro
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
              placeholder="Buscar por oficina, professor, sala, data..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Carregando...</div>
        ) : encontrosFiltrados.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            {termo ? 'Nenhum resultado encontrado.' : 'Nenhum encontro cadastrado.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Oficina</th>
                <th className="px-6 py-3">Professor</th>
                <th className="px-6 py-3">Sala</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Início</th>
                <th className="px-6 py-3">Fim</th>
                {hasPermission('UPDATE_ENCONTRO') && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {encontrosFiltrados.map((e, i) => {
                const d = getDetalhes(e)
                return (
                  <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-3 font-medium text-gray-800">{d.oficinaTitulo}</td>
                    <td className="px-6 py-3 text-gray-700">{d.professorNome}</td>
                    <td className="px-6 py-3 text-gray-500">{d.sala}</td>
                    <td className="px-6 py-3 text-gray-500">{formatDate(e.data)}</td>
                    <td className="px-6 py-3 text-gray-500">{e.horarioInicio}</td>
                    <td className="px-6 py-3 text-gray-500">{e.horarioFim}</td>
                    {hasPermission('UPDATE_ENCONTRO') && (
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => navigate(`/encontros/${e.id}/editar`)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                        >
                          Editar
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}