import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import encontroService from '../../services/encontroService'
import api from '../../services/api'

export default function EncontroForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    oficinaId: '', data: '', horarioInicio: '', horarioFim: ''
  })
  const [oficinas, setOficinas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/oficinas').then((res) => setOficinas(res.data)).catch(() => {})

    if (isEdit) {
      encontroService.findById(id).then((res) => {
        const e = res.data
        setForm({
          oficinaId: e.oficinaId || '',
          data: e.data || '',
          horarioInicio: e.horarioInicio || '',
          horarioFim: e.horarioFim || '',
        })
      })
    }
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        oficinaId: parseInt(form.oficinaId),
      }
      if (isEdit) {
        await encontroService.update(id, payload)
      } else {
        await encontroService.insert(payload)
      }
      navigate('/encontros')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar encontro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title={isEdit ? 'Editar Encontro' : 'Novo Encontro'}>
      <div className="bg-white rounded-xl shadow-sm max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">{isEdit ? 'Editar Encontro' : 'Cadastrar Encontro'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
              <input name="data" type="date" value={form.data} onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Início *</label>
              <input name="horarioInicio" type="time" value={form.horarioInicio} onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Fim *</label>
              <input name="horarioFim" type="time" value={form.horarioFim} onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="px-5 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#1e3a5f' }}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" onClick={() => navigate('/encontros')}
              className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}