import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import frequenciaService from '../../services/frequenciaService'
import api from '../../services/api'
import { formatDate } from '../../utils/formatDate'

export default function FrequenciaList() {
  const [frequencias, setFrequencias] = useState([])
  const [matriculas, setMatriculas] = useState([])
  const [alunos, setAlunos] = useState([])
  const [oficinas, setOficinas] = useState([])
  const [encontros, setEncontros] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const { hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      frequenciaService.findAll(),
      api.get('/matriculas'),
      api.get('/alunos'),
      api.get('/oficinas'),
      api.get('/encontros'),
    ])
      .then(([fRes, mRes, aRes, oRes, eRes]) => {
        setFrequencias(fRes.data)
        setMatriculas(mRes.data)
        setAlunos(aRes.data)
        setOficinas(oRes.data)
        setEncontros(eRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  // Lookups O(1)
  const matriculaMap = Object.fromEntries(matriculas.map((m) => [m.id, m]))
  const alunoMap = Object.fromEntries(alunos.map((a) => [a.id, a]))
  const oficinaMap = Object.fromEntries(oficinas.map((o) => [o.id, o]))
  const encontroMap = Object.fromEntries(encontros.map((e) => [e.id, e]))

  function getDetalhes(freq) {
    const matricula = matriculaMap[freq.matriculaId]
    const aluno = matricula ? alunoMap[matricula.alunoId] : null
    const oficina = matricula ? oficinaMap[matricula.oficinaId] : null
    const encontro = encontroMap[freq.encontroId]
    return {
      alunoNome: aluno?.nome || '-',
      oficinaTitulo: oficina?.titulo || '-',
      encontroData: encontro?.data || null,
      encontroHorario: encontro?.horarioInicio || '-',
    }
  }

  const termo = busca.trim().toLowerCase()
  const frequenciasFiltradas = termo
    ? frequencias.filter((f) => {
        const d = getDetalhes(f)
        return (
          d.alunoNome.toLowerCase().includes(termo) ||
          d.oficinaTitulo.toLowerCase().includes(termo) ||
          formatDate(d.encontroData).includes(termo) ||
          (f.presente ? 'presente' : 'ausente').includes(termo)
        )
      })
    : frequencias

  return (
    <Layout title="Frequências">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Lista de Frequências</h2>
          {hasPermission('CREATE_FREQUENCIA') && (
            <button
              onClick={() => navigate('/frequencias/novo')}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              + Nova Frequência
            </button>
          )}
        </div>

        {/* Barra de busca */}
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
        ) : frequenciasFiltradas.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            {termo ? 'Nenhum resultado encontrado.' : 'Nenhuma frequência registrada.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Aluno</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Horário</th>
                <th className="px-6 py-3">Presença</th>
                <th className="px-6 py-3">Oficina</th>
                {hasPermission('UPDATE_FREQUENCIA') && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {frequenciasFiltradas.map((f, i) => {
                const d = getDetalhes(f)
                return (
                  <tr key={f.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-3 font-medium text-gray-800">{d.alunoNome}</td>
                    <td className="px-6 py-3 text-gray-500">{formatDate(d.encontroData)}</td>
                    <td className="px-6 py-3 text-gray-500">{d.encontroHorario}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${f.presente ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {f.presente ? 'Presente' : 'Ausente'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{d.oficinaTitulo}</td>
                    {hasPermission('UPDATE_FREQUENCIA') && (
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => navigate(`/frequencias/${f.id}/editar`)}
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