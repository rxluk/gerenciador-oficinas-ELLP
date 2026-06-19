import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import frequenciaService from '../../services/frequenciaService'
import api from '../../services/api'
import { formatDate } from '../../utils/formatDate'

export default function FrequenciaForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [presente, setPresente] = useState(false)
  const [alunoNome, setAlunoNome] = useState('')
  const [oficinaTitulo, setOficinaTitulo] = useState('')
  const [encontroData, setEncontroData] = useState(null)
  const [encontroHorario, setEncontroHorario] = useState('')
  const [matriculaId, setMatriculaId] = useState(null)
  const [encontroId, setEncontroId] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const fRes = await frequenciaService.findById(id)
        const f = fRes.data
        setPresente(f.presente)
        setMatriculaId(f.matriculaId)
        setEncontroId(f.encontroId)

        const [mRes, eRes] = await Promise.all([
          api.get(`/matriculas/${f.matriculaId}`),
          api.get(`/encontros/${f.encontroId}`),
        ])

        const [aRes, oRes] = await Promise.all([
          api.get(`/alunos/${mRes.data.alunoId}`),
          api.get(`/oficinas/${mRes.data.oficinaId}`),
        ])

        setAlunoNome(aRes.data.nome)
        setOficinaTitulo(oRes.data.titulo)
        setEncontroData(eRes.data.data)
        setEncontroHorario(eRes.data.horarioInicio)
      } catch {
        setError('Erro ao carregar dados da frequência.')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await frequenciaService.update(id, {
        matriculaId,
        encontroId,
        presente,
      })
      navigate('/frequencias')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar frequência.')
    } finally {
      setLoading(false)
    }
  }

  if (carregando) {
    return (
      <Layout title="Editar Frequência">
        <div className="bg-white rounded-xl shadow-sm max-w-md p-10 text-center text-gray-400 text-sm">
          Carregando...
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Editar Frequência">
      <div className="bg-white rounded-xl shadow-sm max-w-md">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Editar Frequência</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Aluno</p>
            <p className="text-sm font-medium text-gray-800">{alunoNome}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Oficina</p>
            <p className="text-sm text-gray-700">{oficinaTitulo}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Dia</p>
              <p className="text-sm text-gray-700">{formatDate(encontroData)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Horário</p>
              <p className="text-sm text-gray-700">{encontroHorario}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Presença</p>
            <button
              type="button"
              onClick={() => setPresente(!presente)}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                presente
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              {presente ? 'Presente' : 'Ausente'}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="px-5 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#1e3a5f' }}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" onClick={() => navigate('/frequencias')}
              className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}