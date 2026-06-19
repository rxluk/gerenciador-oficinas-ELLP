import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import alunoService from '../../services/alunoService'

export default function AlunoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    nome: '', idade: '', serie: '', telefone: '', email: '', endereco: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      alunoService.findById(id).then((res) => {
        const a = res.data
        setForm({
          nome: a.nome || '',
          idade: a.idade || '',
          serie: a.serie || '',
          telefone: a.telefone || '',
          email: a.email || '',
          endereco: a.endereco || '',
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
        idade: form.idade ? parseInt(form.idade) : null,
      }
      if (isEdit) {
        await alunoService.update(id, payload)
      } else {
        await alunoService.insert(payload)
      }
      navigate('/alunos')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar aluno.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title={isEdit ? 'Editar Aluno' : 'Novo Aluno'}>
      <div className="bg-white rounded-xl shadow-sm max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">{isEdit ? 'Editar Aluno' : 'Cadastrar Aluno'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input name="nome" value={form.nome} onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                placeholder="Nome completo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                placeholder="email@exemplo.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                name="telefone"
                value={form.telefone}
                onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, '').slice(0, 11)
                    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`
                    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`
                    else if (v.length > 0) v = `(${v}`
                    setForm({ ...form, telefone: v })
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Série</label>
              <input name="serie" value={form.serie} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                placeholder="Ex: 6º ano" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
              <input name="idade" type="number" value={form.idade} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                placeholder="Ex: 12" min="1" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <input name="endereco" value={form.endereco} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                placeholder="Rua, número, bairro..." />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="px-5 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#1e3a5f' }}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" onClick={() => navigate('/alunos')}
              className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}