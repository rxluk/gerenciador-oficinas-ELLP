import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import usuarioService from '../../services/usuarioService'

export default function UsuarioList() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const { hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    usuarioService.findAll()
      .then((res) => setUsuarios(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Usuários">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Lista de Usuários</h2>
          {hasPermission('CREATE_USUARIO') && (
            <button
              onClick={() => navigate('/usuarios/novo')}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              + Novo Usuário
            </button>
          )}
        </div>
        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Carregando...</div>
        ) : usuarios.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Nenhum usuário cadastrado.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Status</th>
                {hasPermission('UPDATE_USUARIO') && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 font-medium text-gray-800">{u.nome || '-'}</td>
                  <td className="px-6 py-3 text-gray-500">{u.email}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  {hasPermission('UPDATE_USUARIO') && (
                    <td className="px-6 py-3 text-right flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/usuarios/${u.id}/editar`)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                      >
                        Editar
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