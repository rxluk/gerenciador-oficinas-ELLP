import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import usuarioService from '../../services/usuarioService'
import roleService from '../../services/roleService'

export default function UsuarioForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({ nome: '', email: '', senha: '', ativo: true })
  const [roles, setRoles] = useState([])
  const [usuarioRoles, setUsuarioRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    roleService.findAll().then((res) => setRoles(res.data)).catch(() => {})

    usuarioService.findById(id).then((res) => {
      const u = res.data
      setForm({
        nome: u.nome || '',
        email: u.email || '',
        senha: '',
        ativo: u.ativo ?? true,
      })
    })

    usuarioService.findRoles(id).then((res) => {
      setUsuarioRoles(res.data.map((r) => r.id))
    }).catch(() => {})
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
        nome: form.nome || null,
        email: form.email || null,
        senha: form.senha || null,
        ativo: form.ativo,
      }
      await usuarioService.update(id, payload)
      navigate('/usuarios')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar usuário.')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleRole(roleId) {
    const tem = usuarioRoles.includes(roleId)
    try {
      if (tem) {
        await usuarioService.removeRole(id, roleId)
        setUsuarioRoles(usuarioRoles.filter((r) => r !== roleId))
      } else {
        await usuarioService.addRole(id, roleId)
        setUsuarioRoles([...usuarioRoles, roleId])
      }
    } catch {
      setError('Erro ao atualizar roles do usuário.')
    }
  }

  return (
    <Layout title="Editar Usuário">
      <div className="max-w-2xl space-y-4">
        {/* Dados */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">Dados do Usuário</h2>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input name="nome" value={form.nome} onChange={handleChange}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                <input name="senha" type="password" value={form.senha} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                  placeholder="Deixe em branco para não alterar" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input name="ativo" type="checkbox" checked={form.ativo} onChange={handleChange}
                  className="w-4 h-4 rounded" id="ativo" />
                <label htmlFor="ativo" className="text-sm font-medium text-gray-700">Usuário ativo</label>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="px-5 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#1e3a5f' }}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button type="button" onClick={() => navigate('/usuarios')}
                className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Roles */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">Roles do Usuário</h2>
          </div>
          <div className="px-6 py-4 space-y-2">
            {roles.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhuma role disponível.</p>
            ) : (
              roles.map((role) => {
                const ativo = usuarioRoles.includes(role.id)
                return (
                  <div key={role.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-700">{role.nome}</span>
                    <button
                      onClick={() => handleToggleRole(role.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        ativo
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {ativo ? 'Remover' : 'Adicionar'}
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}