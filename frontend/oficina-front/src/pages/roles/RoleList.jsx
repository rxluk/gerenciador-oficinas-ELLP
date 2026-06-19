import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import roleService from '../../services/roleService'

export default function RoleList() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const { hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    roleService.findAll()
      .then((res) => setRoles(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Roles">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Lista de Roles</h2>
          {hasPermission('CREATE_ROLE') && (
            <button
              onClick={() => navigate('/roles/novo')}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              + Nova Role
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Carregando...</div>
        ) : roles.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Nenhuma role cadastrada.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Nome</th>
                {hasPermission('UPDATE_ROLE') && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {roles.map((role, i) => (
                <tr key={role.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 font-medium text-gray-800">{role.nome}</td>
                  {hasPermission('UPDATE_ROLE') && (
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => navigate(`/roles/${role.id}/editar`)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                      >
                        Editar / Permissões
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}