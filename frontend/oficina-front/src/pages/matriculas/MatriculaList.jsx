import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import matriculaService from '../../services/matriculaService'
import api from '../../services/api'
import { formatDate } from '../../utils/formatDate'

export default function MatriculaList() {
  const [matriculas, setMatriculas] = useState([])
  const [alunos, setAlunos] = useState([])
  const [oficinas, setOficinas] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const { hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      matriculaService.findAll(),
      api.get('/alunos'),
      api.get('/oficinas'),
    ])
      .then(([mRes, aRes, oRes]) => {
        setMatriculas(mRes.data)
        setAlunos(aRes.data)
        setOficinas(oRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const alunoMap = Object.fromEntries(alunos.map((a) => [a.id, a]))
  const oficinaMap = Object.fromEntries(oficinas.map((o) => [o.id, o]))

  function getDetalhes(m) {
    return {
      alunoNome: alunoMap[m.alunoId]?.nome || '-',
      oficinaTitulo: oficinaMap[m.oficinaId]?.titulo || '-',
    }
  }

  const termo = busca.trim().toLowerCase()
  const matriculasFiltradas = termo
    ? matriculas.filter((m) => {
        const d = getDetalhes(m)
        return (
          d.alunoNome.toLowerCase().includes(termo) ||
          d.oficinaTitulo.toLowerCase().includes(termo) ||
          formatDate(m.dataMatricula).includes(termo)
        )
      })
    : matriculas

  return (
    <Layout title="Matrículas">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Lista de Matrículas</h2>
          {hasPermission('CREATE_MATRICULA') && (
            <button
              onClick={() => navigate('/matriculas/novo')}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              + Nova Matrícula
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
              placeholder="Buscar por aluno, oficina, data..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Carregando...</div>
        ) : matriculasFiltradas.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            {termo ? 'Nenhum resultado encontrado.' : 'Nenhuma matrícula cadastrada.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Matrícula (Oficina)</th>
                <th className="px-6 py-3">Aluno</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Certificado</th>
                {hasPermission('UPDATE_MATRICULA') && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {matriculasFiltradas.map((m, i) => {
                const d = getDetalhes(m)
                return (
                  <tr key={m.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-3 font-medium text-gray-800">{d.oficinaTitulo}</td>
                    <td className="px-6 py-3 text-gray-700">{d.alunoNome}</td>
                    <td className="px-6 py-3 text-gray-500">{formatDate(m.dataMatricula)}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${m.certificadoEmitido ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {m.certificadoEmitido ? 'Emitido' : 'Pendente'}
                      </span>
                    </td>
                    {hasPermission('UPDATE_MATRICULA') && (
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => navigate(`/matriculas/${m.id}/editar`)}
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