import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import roleService from '../../services/roleService'
import api from '../../services/api'

export default function RoleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({ nome: '' })
  const [permissions, setPermissions] = useState([])
  const [rolePermissions, setRolePermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/permissions').then((res) => setPermissions(res.data)).catch(() => {})

    if (isEdit) {
      roleService.findById(id).then((res) => {
        setForm({ nome: res.data.nome || '' })
      })
      roleService.findPermissions(id).then((res) => {
        setRolePermissions(res.data.map((p) => p.id))
      }).catch(() => {})
    }
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) {
        await roleService.update(id, form)
      } else {
        await roleService.insert(form)
      }
      navigate('/roles')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar role.')
    } finally {
      setLoading(false)
    }
  }

  async function handleTogglePermission(permissionId) {
    const tem = rolePermissions.includes(permissionId)
    try {
      if (tem) {
        await roleService.removePermission(id, permissionId)
        setRolePermissions(rolePermissions.filter((p) => p !== permissionId))
      } else {
        await roleService.addPermission(id, permissionId)
        setRolePermissions([...rolePermissions, permissionId])
      }
    } catch {
      setError('Erro ao atualizar permissões da role.')
    }
  }

  return (
    <Layout title={isEdit ? 'Editar Role' : 'Nova Role'}>
      <div className="max-w-2xl space-y-4">
        {/* Dados */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">{isEdit ? 'Editar Role' : 'Cadastrar Role'}</h2>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input name="nome" value={form.nome} onChange={(e) => setForm({ nome: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                placeholder="Ex: ADMIN" />
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="px-5 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#1e3a5f' }}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button type="button" onClick={() => navigate('/roles')}
                className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Permissões — só aparece no modo edição */}
        {isEdit && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-700">Permissões da Role</h2>
            </div>
            <div className="px-6 py-4 space-y-1">
              {permissions.length === 0 ? (
                <p className="text-sm text-gray-400">Nenhuma permissão disponível.</p>
              ) : (
                permissions.map((perm) => {
                  const ativo = rolePermissions.includes(perm.id)
                  return (
                    <div key={perm.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700 font-mono">{perm.nome}</span>
                      <button
                        onClick={() => handleTogglePermission(perm.id)}
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
        )}
      </div>
    </Layout>
  )
}