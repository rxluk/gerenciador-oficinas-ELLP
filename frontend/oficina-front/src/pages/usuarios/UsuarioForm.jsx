import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import usuarioService from '../../services/usuarioService'
import roleService from '../../services/roleService'

export default function UsuarioForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({ nome: '', email: '', senha: '', ativo: true })
  const [roles, setRoles] = useState([])
  const [usuarioRoles, setUsuarioRoles] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([]) // usado só na criação
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    roleService.findAll().then((res) => setRoles(res.data)).catch(() => {})

    if (isEdit) {
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
    }
  }, [id])

  function handleChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  function toggleSelectedRole(roleId) {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) {
        const payload = {
          nome: form.nome || null,
          email: form.email || null,
          senha: form.senha || null,
          ativo: form.ativo,
        }
        await usuarioService.update(id, payload)
      } else {
        // 1ª chamada: cria o usuário
        await usuarioService.register({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
        })

        // Busca o usuário recém-criado pelo email para pegar o ID
        const res = await usuarioService.findAll()
        const novoUsuario = res.data.find((u) => u.email === form.email)

        // 2ª chamada: atribui as roles selecionadas
        if (novoUsuario && selectedRoles.length > 0) {
          await Promise.all(
            selectedRoles.map((roleId) => usuarioService.addRole(novoUsuario.id, roleId))
          )
        }
      }
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
    <Layout title={isEdit ? 'Editar Usuário' : 'Novo Usuário'}>
      <div className="max-w-2xl space-y-4">
        {/* Dados */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">{isEdit ? 'Dados do Usuário' : 'Cadastrar Usuário'}</h2>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome {!isEdit && '*'}</label>
                <input name="nome" value={form.nome} onChange={handleChange} required={!isEdit}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                  placeholder="Nome completo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email {!isEdit && '*'}</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required={!isEdit}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                  placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEdit ? 'Nova Senha' : 'Senha *'}
                </label>
                <input name="senha" type="password" value={form.senha} onChange={handleChange}
                  required={!isEdit} minLength={isEdit ? undefined : 6}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                  placeholder={isEdit ? 'Deixe em branco para não alterar' : 'Mínimo 6 caracteres'} />
              </div>
              {isEdit && (
                <div className="flex items-center gap-2 mt-6">
                  <input name="ativo" type="checkbox" checked={form.ativo} onChange={handleChange}
                    className="w-4 h-4 rounded" id="ativo" />
                  <label htmlFor="ativo" className="text-sm font-medium text-gray-700">Usuário ativo</label>
                </div>
              )}
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
            <h2 className="font-semibold text-gray-700">
              {isEdit ? 'Roles do Usuário' : 'Atribuir Roles'}
            </h2>
          </div>
          <div className="px-6 py-4 space-y-2">
            {roles.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhuma role disponível.</p>
            ) : isEdit ? (
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
            ) : (
              // Modo criação: apenas seleciona, sem chamar API ainda
              roles.map((role) => {
                const selecionado = selectedRoles.includes(role.id)
                return (
                  <label key={role.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer">
                    <span className="text-sm text-gray-700">{role.nome}</span>
                    <input
                      type="checkbox"
                      checked={selecionado}
                      onChange={() => toggleSelectedRole(role.id)}
                      className="w-4 h-4 rounded"
                    />
                  </label>
                )
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}