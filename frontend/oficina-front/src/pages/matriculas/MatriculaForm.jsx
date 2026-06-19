import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import matriculaService from '../../services/matriculaService'
import api from '../../services/api'

export default function MatriculaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    alunoId: '', oficinaId: '', dataMatricula: '', certificadoEmitido: false
  })
  const [alunos, setAlunos] = useState([])
  const [oficinas, setOficinas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/alunos').then((res) => setAlunos(res.data)).catch(() => {})
    api.get('/oficinas').then((res) => setOficinas(res.data)).catch(() => {})

    if (isEdit) {
      matriculaService.findById(id).then((res) => {
        const m = res.data
        setForm({
          alunoId: m.alunoId || '',
          oficinaId: m.oficinaId || '',
          dataMatricula: m.dataMatricula || '',
          certificadoEmitido: m.certificadoEmitido || false,
        })
      })
    }
  }, [id])

  function handleChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        alunoId: parseInt(form.alunoId),
        oficinaId: parseInt(form.oficinaId),
      }
      if (isEdit) {
        await matriculaService.update(id, payload)
      } else {
        await matriculaService.insert(payload)
      }
      navigate('/matriculas')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar matrícula.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title={isEdit ? 'Editar Matrícula' : 'Nova Matrícula'}>
      <div className="bg-white rounded-xl shadow-sm max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">{isEdit ? 'Editar Matrícula' : 'Cadastrar Matrícula'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aluno *</label>
              <select name="alunoId" value={form.alunoId} onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-white">
                <option value="">Selecione...</option>
                {alunos.map((a) => (
                  <option key={a.id} value={a.id}>{a.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Oficina *</label>
              <select name="oficinaId" value={form.oficinaId} onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-white">
                <option value="">Selecione...</option>
                {oficinas.map((o) => (
                  <option key={o.id} value={o.id}>{o.titulo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Matrícula *</label>
              <input name="dataMatricula" type="date" value={form.dataMatricula} onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input name="certificadoEmitido" type="checkbox" checked={form.certificadoEmitido} onChange={handleChange}
                className="w-4 h-4 rounded" id="certificadoEmitido" />
              <label htmlFor="certificadoEmitido" className="text-sm font-medium text-gray-700">Certificado emitido</label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="px-5 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#1e3a5f' }}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" onClick={() => navigate('/matriculas')}
              className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}