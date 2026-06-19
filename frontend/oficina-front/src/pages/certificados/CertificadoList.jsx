import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import certificadoService from '../../services/certificadoService'

export default function CertificadoList() {
  const [certificados, setCertificados] = useState([])
  const [loading, setLoading] = useState(true)
  const { hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    certificadoService.findAll()
      .then((res) => setCertificados(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Certificados">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Lista de Certificados</h2>
          {hasPermission('CREATE_CERTIFICADO') && (
            <button
              onClick={() => navigate('/certificados/novo')}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              + Novo Certificado
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Carregando...</div>
        ) : certificados.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Nenhum certificado cadastrado.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Descrição</th>
                <th className="px-6 py-3">Assinatura</th>
                {hasPermission('UPDATE_CERTIFICADO') && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {certificados.map((c, i) => (
                <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 font-medium text-gray-800">{c.nome}</td>
                  <td className="px-6 py-3 text-gray-500 max-w-xs truncate">{c.descricao}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.requerAssinatura ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.requerAssinatura ? 'Requer' : 'Não requer'}
                    </span>
                  </td>
                  {hasPermission('UPDATE_CERTIFICADO') && (
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => navigate(`/certificados/${c.id}/editar`)}
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