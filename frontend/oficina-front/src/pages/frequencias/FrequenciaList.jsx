import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import frequenciaService from '../../services/frequenciaService'

export default function FrequenciaList() {
  const [frequencias, setFrequencias] = useState([])
  const [loading, setLoading] = useState(true)
  const { hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    frequenciaService.findAll()
      .then((res) => setFrequencias(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Frequências">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Lista de Frequências</h2>
          {hasPermission('CREATE_FREQUENCIA') && (
            <button
              onClick={() => navigate('/frequencias/novo')}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              + Nova Frequência
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Carregando...</div>
        ) : frequencias.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Nenhuma frequência registrada.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Matrícula ID</th>
                <th className="px-6 py-3">Encontro ID</th>
                <th className="px-6 py-3">Presença</th>
                {hasPermission('UPDATE_FREQUENCIA') && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {frequencias.map((f, i) => (
                <tr key={f.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 text-gray-500">#{f.matriculaId}</td>
                  <td className="px-6 py-3 text-gray-500">#{f.encontroId}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${f.presente ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {f.presente ? 'Presente' : 'Ausente'}
                    </span>
                  </td>
                  {hasPermission('UPDATE_FREQUENCIA') && (
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => navigate(`/frequencias/${f.id}/editar`)}
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