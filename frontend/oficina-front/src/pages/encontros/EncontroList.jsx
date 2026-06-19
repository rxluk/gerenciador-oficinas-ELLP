import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import encontroService from '../../services/encontroService'

export default function EncontroList() {
  const [encontros, setEncontros] = useState([])
  const [loading, setLoading] = useState(true)
  const { hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    encontroService.findAll()
      .then((res) => setEncontros(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Encontros">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Lista de Encontros</h2>
          {hasPermission('CREATE_ENCONTRO') && (
            <button
              onClick={() => navigate('/encontros/novo')}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              + Novo Encontro
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Carregando...</div>
        ) : encontros.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Nenhum encontro cadastrado.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Oficina ID</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Início</th>
                <th className="px-6 py-3">Fim</th>
                {hasPermission('UPDATE_ENCONTRO') && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {encontros.map((e, i) => (
                <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 text-gray-500">#{e.oficinaId}</td>
                  <td className="px-6 py-3 font-medium text-gray-800">{e.data}</td>
                  <td className="px-6 py-3 text-gray-500">{e.horarioInicio}</td>
                  <td className="px-6 py-3 text-gray-500">{e.horarioFim}</td>
                  {hasPermission('UPDATE_ENCONTRO') && (
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => navigate(`/encontros/${e.id}/editar`)}
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