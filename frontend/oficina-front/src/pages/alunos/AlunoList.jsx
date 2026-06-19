import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import alunoService from '../../services/alunoService'

export default function AlunoList() {
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const { hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    alunoService.findAll()
      .then((res) => setAlunos(res.data))
      .finally(() => setLoading(false))
  }, [])

  const termo = busca.trim().toLowerCase()
  const alunosFiltrados = termo
    ? alunos.filter((a) =>
        a.nome.toLowerCase().includes(termo) ||
        (a.email || '').toLowerCase().includes(termo) ||
        (a.telefone || '').toLowerCase().includes(termo) ||
        (a.serie || '').toLowerCase().includes(termo)
      )
    : alunos

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

        <div className="px-6 py-3 border-b border-gray-100">
          <div className="relative max-w-sm">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, email, telefone, série..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Carregando...</div>
        ) : alunosFiltrados.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            {termo ? 'Nenhum resultado encontrado.' : 'Nenhum aluno cadastrado.'}
          </div>
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
              {alunosFiltrados.map((aluno, i) => (
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