import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import matriculaService from '../../services/matriculaService'

export default function MatriculaList() {
  const [matriculas, setMatriculas] = useState([])
  const [loading, setLoading] = useState(true)
  const { hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    matriculaService.findAll()
      .then((res) => setMatriculas(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Matrículas">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Lista de Matrículas</h2>
          {hasPermission('CREATE_MATRICULA') && (
            <button
              onClick={() => navigate('/matriculas/novo')}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              + Nova Matrícula
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Carregando...</div>
        ) : matriculas.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Nenhuma matrícula cadastrada.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Aluno ID</th>
                <th className="px-6 py-3">Oficina ID</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Certificado</th>
                {hasPermission('UPDATE_MATRICULA') && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {matriculas.map((m, i) => (
                <tr key={m.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 text-gray-500">#{m.alunoId}</td>
                  <td className="px-6 py-3 text-gray-500">#{m.oficinaId}</td>
                  <td className="px-6 py-3 text-gray-800">{m.dataMatricula}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${m.certificadoEmitido ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {m.certificadoEmitido ? 'Emitido' : 'Pendente'}
                    </span>
                  </td>
                  {hasPermission('UPDATE_MATRICULA') && (
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => navigate(`/matriculas/${m.id}/editar`)}
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