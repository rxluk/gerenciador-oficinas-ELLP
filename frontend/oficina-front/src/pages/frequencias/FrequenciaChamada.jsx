import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import frequenciaService from '../../services/frequenciaService'
import api from '../../services/api'
import { formatDate } from '../../utils/formatDate'

export default function FrequenciaChamada() {
  const navigate = useNavigate()

  const [oficinas, setOficinas] = useState([])
  const [encontros, setEncontros] = useState([])
  const [matriculas, setMatriculas] = useState([])
  const [alunos, setAlunos] = useState([])
  const [frequenciasExistentes, setFrequenciasExistentes] = useState([])

  const [oficinaId, setOficinaId] = useState('')
  const [encontroId, setEncontroId] = useState('')
  const [presencas, setPresencas] = useState({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get('/oficinas').then((res) => setOficinas(res.data)).catch(() => {})
    api.get('/alunos').then((res) => setAlunos(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setEncontroId('')
    setPresencas({})
    if (!oficinaId) {
      setEncontros([])
      setMatriculas([])
      return
    }
    api.get(`/encontros/oficina/${oficinaId}`).then((res) => setEncontros(res.data)).catch(() => {})
    api.get(`/matriculas/oficina/${oficinaId}`).then((res) => setMatriculas(res.data)).catch(() => {})
  }, [oficinaId])

  useEffect(() => {
    setPresencas({})
    if (!encontroId) {
      setFrequenciasExistentes([])
      return
    }
    frequenciaService.findByEncontro(encontroId).then((res) => {
      setFrequenciasExistentes(res.data)
      const estadoInicial = {}
      res.data.forEach((f) => {
        estadoInicial[f.matriculaId] = f.presente
      })
      setPresencas((prev) => ({ ...prev, ...estadoInicial }))
    }).catch(() => {})
  }, [encontroId])

  const alunoMap = Object.fromEntries(alunos.map((a) => [a.id, a]))

  // Lista de alunos da turma, ordenada alfabeticamente
  const alunosDaTurma = matriculas
    .map((m) => ({ matricula: m, aluno: alunoMap[m.alunoId] }))
    .filter((item) => item.aluno)
    .sort((a, b) => a.aluno.nome.localeCompare(b.aluno.nome))

  function togglePresenca(matriculaId) {
    setPresencas((prev) => ({ ...prev, [matriculaId]: !prev[matriculaId] }))
  }

  function jaTemRegistro(matriculaId) {
    return frequenciasExistentes.some((f) => f.matriculaId === matriculaId)
  }

  function getFrequenciaId(matriculaId) {
    return frequenciasExistentes.find((f) => f.matriculaId === matriculaId)?.id
  }

  async function handleSalvar() {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      for (const { matricula } of alunosDaTurma) {
        const presente = presencas[matricula.id] ?? false
        const payload = {
          matriculaId: matricula.id,
          encontroId: parseInt(encontroId),
          presente,
        }
        if (jaTemRegistro(matricula.id)) {
          await frequenciaService.update(getFrequenciaId(matricula.id), payload)
        } else {
          await frequenciaService.insert(payload)
        }
      }
      setSuccess('Chamada salva com sucesso!')
      setTimeout(() => navigate('/frequencias'), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar a chamada.')
    } finally {
      setLoading(false)
    }
  }

  const encontroSelecionado = encontros.find((e) => e.id === parseInt(encontroId))

  return (
    <Layout title="Registrar Chamada">
      <div className="max-w-2xl space-y-4">
        {/* Seleção de Oficina e Encontro */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">Selecione a Turma e o Encontro</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Oficina *</label>
              <select value={oficinaId} onChange={(e) => setOficinaId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-white">
                <option value="">Selecione...</option>
                {oficinas.map((o) => (
                  <option key={o.id} value={o.id}>{o.titulo}</option>
                ))}
              </select>
            </div>

            {oficinaId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Encontro (Dia/Horário) *</label>
                <select value={encontroId} onChange={(e) => setEncontroId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-white">
                  <option value="">Selecione...</option>
                  {encontros.map((e) => (
                    <option key={e.id} value={e.id}>
                      {formatDate(e.data)} — {e.horarioInicio}
                    </option>
                  ))}
                </select>
                {encontros.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">Nenhum encontro cadastrado para esta oficina.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lista de chamada */}
        {encontroId && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-700">
                Lista de Chamada — {encontroSelecionado && formatDate(encontroSelecionado.data)}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{alunosDaTurma.length} aluno(s) matriculado(s)</p>
            </div>

            {alunosDaTurma.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm">
                Nenhum aluno matriculado nesta oficina.
              </div>
            ) : (
              <div className="px-6 py-2">
                {alunosDaTurma.map(({ matricula, aluno }, i) => {
                  const presente = presencas[matricula.id] ?? false
                  return (
                    <div
                      key={matricula.id}
                      className={`flex items-center justify-between py-3 ${i !== alunosDaTurma.length - 1 ? 'border-b border-gray-50' : ''}`}
                    >
                      <span className="text-sm text-gray-700">{aluno.nome}</span>
                      <button
                        type="button"
                        onClick={() => togglePresenca(matricula.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          presente
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        {presente ? 'Presente' : 'Ausente'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 mx-6 mb-4 rounded-lg">{error}</p>}
            {success && <p className="text-green-600 text-sm bg-green-50 px-3 py-2 mx-6 mb-4 rounded-lg">{success}</p>}

            <div className="flex gap-3 px-6 pb-5 pt-2">
              <button
                type="button"
                onClick={handleSalvar}
                disabled={loading || alunosDaTurma.length === 0}
                className="px-5 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#1e3a5f' }}
              >
                {loading ? 'Salvando...' : 'Salvar Chamada'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/frequencias')}
                className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}