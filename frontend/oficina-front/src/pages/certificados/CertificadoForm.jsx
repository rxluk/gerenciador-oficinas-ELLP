import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import certificadoService from '../../services/certificadoService'

export default function CertificadoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({ nome: '', descricao: '', template: '', requerAssinatura: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      certificadoService.findById(id).then((res) => {
        const c = res.data
        setForm({
          nome: c.nome || '',
          descricao: c.descricao || '',
          template: c.template || '',
          requerAssinatura: c.requerAssinatura || false,
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
      if (isEdit) {
        await certificadoService.update(id, form)
      } else {
        await certificadoService.insert(form)
      }
      navigate('/certificados')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar certificado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title={isEdit ? 'Editar Certificado' : 'Novo Certificado'}>
      <div className="bg-white rounded-xl shadow-sm max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">{isEdit ? 'Editar Certificado' : 'Cadastrar Certificado'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input name="nome" value={form.nome} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
              placeholder="Nome do certificado" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
            <textarea name="descricao" value={form.descricao} onChange={handleChange} required rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none"
              placeholder="Descrição do certificado" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template *</label>
            <textarea name="template" value={form.template} onChange={handleChange} required rows={6}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none font-mono"
              placeholder="Texto do certificado. Ex: Certificamos que {{nome}} concluiu a oficina {{oficina}}..." />
          </div>
          <div className="flex items-center gap-2">
            <input name="requerAssinatura" type="checkbox" checked={form.requerAssinatura} onChange={handleChange}
              className="w-4 h-4 rounded" id="requerAssinatura" />
            <label htmlFor="requerAssinatura" className="text-sm font-medium text-gray-700">Requer assinatura</label>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="px-5 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#1e3a5f' }}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" onClick={() => navigate('/certificados')}
              className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}