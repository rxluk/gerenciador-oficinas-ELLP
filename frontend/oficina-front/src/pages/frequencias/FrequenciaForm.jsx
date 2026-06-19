import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import frequenciaService from '../../services/frequenciaService'
import api from '../../services/api'

export default function FrequenciaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    matriculaId: '', encontroId: '', presente: false
  })
  const [matriculas, setMatriculas] = useState([])
  const [encontros, setEncontros] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/matriculas').then((res) => setMatriculas(res.data)).catch(() => {})
    api.get('/encontros').then((res) => setEncontros(res.data)).catch(() => {})

    if (isEdit) {
      frequenciaService.findById(id).then((res) => {
        const f = res.data
        setForm({
          matriculaId: f.matriculaId || '',
          encontroId: f.encontroId || '',
          presente: f.presente || false,
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
        matriculaId: parseInt(form.matriculaId),
        encontroId: parseInt(form.encontroId),
      }
      if (isEdit) {
        await frequenciaService.update(id, payload)
      } else {
        await frequenciaService.insert(payload)
      }
      navigate('/frequencias')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar frequência.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title={isEdit ? 'Editar Frequência' : 'Nova Frequência'}>
      <div className="bg-white rounded-xl shadow-sm max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">{isEdit ? 'Editar Frequência' : 'Registrar Frequência'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula *</label>
              <select name="matriculaId" value={form.matriculaId} onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-white">
                <option value="">Selecione...</option>
                {matriculas.map((m) => (
                  <option key={m.id} value={m.id}>Matrícula #{m.id} — Aluno #{m.alunoId}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Encontro *</label>
              <select name="encontroId" value={form.encontroId} onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-white">
                <option value="">Selecione...</option>
                {encontros.map((e) => (
                  <option key={e.id} value={e.id}>Encontro #{e.id} — {e.data}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input name="presente" type="checkbox" checked={form.presente} onChange={handleChange}
                className="w-4 h-4 rounded" id="presente" />
              <label htmlFor="presente" className="text-sm font-medium text-gray-700">Presente</label>
            </div>
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