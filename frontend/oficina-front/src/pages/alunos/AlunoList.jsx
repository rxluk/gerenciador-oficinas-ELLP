import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import alunoService from '../../services/alunoService'

export default function AlunoList() {
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(true)
  const { hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    alunoService.findAll()
      .then((res) => setAlunos(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Alunos">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Lista de Alunos</h2>
          {hasPermission('CREATE_ALUNO') && (
            <button
              onClick={() => navigate('/alunos/novo')}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              + Novo Aluno
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Carregando...</div>
        ) : alunos.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Nenhum aluno cadastrado.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Telefone</th>
                <th className="px-6 py-3">Série</th>
                <th className="px-6 py-3">Idade</th>
                {hasPermission('UPDATE_ALUNO') && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno, i) => (
                <tr key={aluno.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 font-medium text-gray-800">{aluno.nome}</td>
                  <td className="px-6 py-3 text-gray-500">{aluno.email || '-'}</td>
                  <td className="px-6 py-3 text-gray-500">{aluno.telefone || '-'}</td>
                  <td className="px-6 py-3 text-gray-500">{aluno.serie || '-'}</td>
                  <td className="px-6 py-3 text-gray-500">{aluno.idade || '-'}</td>
                  {hasPermission('UPDATE_ALUNO') && (
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => navigate(`/alunos/${aluno.id}/editar`)}
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