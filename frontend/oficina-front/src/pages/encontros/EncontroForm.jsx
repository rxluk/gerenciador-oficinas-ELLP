import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import encontroService from '../../services/encontroService'
import api from '../../services/api'

const DIAS_SEMANA = [
  { valor: 0, label: 'Dom' },
  { valor: 1, label: 'Seg' },
  { valor: 2, label: 'Ter' },
  { valor: 3, label: 'Qua' },
  { valor: 4, label: 'Qui' },
  { valor: 5, label: 'Sex' },
  { valor: 6, label: 'Sáb' },
]

export default function EncontroForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [modo, setModo] = useState('unico') // 'unico' | 'massa'

  const [form, setForm] = useState({
    oficinaId: '', data: '', horarioInicio: '', horarioFim: ''
  })

  const [formMassa, setFormMassa] = useState({
    oficinaId: '', dataInicio: '', dataFim: '',
    horarioInicio: '', horarioFim: '', diasSemana: []
  })

  const [oficinas, setOficinas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [preview, setPreview] = useState([])

  useEffect(() => {
    api.get('/oficinas').then((res) => setOficinas(res.data)).catch(() => {})

    if (isEdit) {
      encontroService.findById(id).then((res) => {
        const e = res.data
        setForm({
          oficinaId: e.oficinaId || '',
          data: e.data || '',
          horarioInicio: e.horarioInicio || '',
          horarioFim: e.horarioFim || '',
        })
      })
    }
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleChangeMassa(e) {
    setFormMassa({ ...formMassa, [e.target.name]: e.target.value })
  }

  function toggleDiaSemana(valor) {
    setFormMassa((prev) => ({
      ...prev,
      diasSemana: prev.diasSemana.includes(valor)
        ? prev.diasSemana.filter((d) => d !== valor)
        : [...prev.diasSemana, valor],
    }))
  }

  // Calcula todas as datas dentro do período que caem nos dias da semana selecionados
  function calcularDatas() {
    const { dataInicio, dataFim, diasSemana } = formMassa
    if (!dataInicio || !dataFim || diasSemana.length === 0) return []

    const datas = []
    const atual = new Date(dataInicio + 'T00:00:00')
    const fim = new Date(dataFim + 'T00:00:00')

    while (atual <= fim) {
      if (diasSemana.includes(atual.getDay())) {
        datas.push(atual.toISOString().split('T')[0])
      }
      atual.setDate(atual.getDate() + 1)
    }
    return datas
  }

  useEffect(() => {
    if (modo === 'massa') {
      setPreview(calcularDatas())
    }
  }, [formMassa.dataInicio, formMassa.dataFim, formMassa.diasSemana, modo])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        oficinaId: parseInt(form.oficinaId),
      }
      if (isEdit) {
        await encontroService.update(id, payload)
      } else {
        await encontroService.insert(payload)
      }
      navigate('/encontros')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar encontro.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitMassa(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const datas = calcularDatas()
    if (datas.length === 0) {
      setError('Nenhuma data encontrada para os critérios selecionados.')
      return
    }
    if (!formMassa.oficinaId) {
      setError('Selecione uma oficina.')
      return
    }

    setLoading(true)
    let criados = 0
    try {
      for (const data of datas) {
        await encontroService.insert({
          oficinaId: parseInt(formMassa.oficinaId),
          data,
          horarioInicio: formMassa.horarioInicio,
          horarioFim: formMassa.horarioFim,
        })
        criados++
      }
      setSuccess(`${criados} encontro(s) criado(s) com sucesso!`)
      setTimeout(() => navigate('/encontros'), 1200)
    } catch (err) {
      setError(
        `${err.response?.data?.message || 'Erro ao criar encontros.'} (${criados} de ${datas.length} criados antes do erro)`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title={isEdit ? 'Editar Encontro' : 'Novo Encontro'}>
      <div className="bg-white rounded-xl shadow-sm max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">
            {isEdit ? 'Editar Encontro' : 'Cadastrar Encontro'}
          </h2>

          {!isEdit && (
            <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setModo('unico')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  modo === 'unico' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'
                }`}
              >
                Criar único
              </button>
              <button
                type="button"
                onClick={() => setModo('massa')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  modo === 'massa' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'
                }`}
              >
                Criar em massa
              </button>
            </div>
          )}
        </div>

        {/* MODO ÚNICO (e edição) */}
        {(isEdit || modo === 'unico') && (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Oficina *</label>
                <select name="oficinaId" value={form.oficinaId} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-white">
                  <option value="">Selecione...</option>
                  {oficinas.map((o) => (
                    <option key={o.id} value={o.id}>{o.titulo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                <input name="data" type="date" value={form.data} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Início *</label>
                <input name="horarioInicio" type="time" value={form.horarioInicio} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Fim *</label>
                <input name="horarioFim" type="time" value={form.horarioFim} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="px-5 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#1e3a5f' }}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button type="button" onClick={() => navigate('/encontros')}
                className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* MODO EM MASSA */}
        {!isEdit && modo === 'massa' && (
          <form onSubmit={handleSubmitMassa} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Oficina *</label>
              <select name="oficinaId" value={formMassa.oficinaId} onChange={handleChangeMassa} required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-white">
                <option value="">Selecione...</option>
                {oficinas.map((o) => (
                  <option key={o.id} value={o.id}>{o.titulo}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial *</label>
                <input name="dataInicio" type="date" value={formMassa.dataInicio} onChange={handleChangeMassa} required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Final *</label>
                <input name="dataFim" type="date" value={formMassa.dataFim} onChange={handleChangeMassa} required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dias da Semana *</label>
              <div className="flex flex-wrap gap-2">
                {DIAS_SEMANA.map((dia) => {
                  const selecionado = formMassa.diasSemana.includes(dia.valor)
                  return (
                    <button
                      key={dia.valor}
                      type="button"
                      onClick={() => toggleDiaSemana(dia.valor)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        selecionado
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      style={selecionado ? { backgroundColor: '#1e3a5f' } : {}}
                    >
                      {dia.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Início *</label>
                <input name="horarioInicio" type="time" value={formMassa.horarioInicio} onChange={handleChangeMassa} required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Fim *</label>
                <input name="horarioFim" type="time" value={formMassa.horarioFim} onChange={handleChangeMassa} required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" />
              </div>
            </div>

            {preview.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {preview.length} encontro(s) serão criados:
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {preview.map((d) => {
                    const [y, m, dd] = d.split('-')
                    return `${dd}/${m}/${y}`
                  }).join(' · ')}
                </p>
              </div>
            )}

            {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            {success && <p className="text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg">{success}</p>}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading || preview.length === 0}
                className="px-5 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#1e3a5f' }}>
                {loading ? `Criando... (${preview.length} no total)` : `Criar ${preview.length || ''} Encontro(s)`}
              </button>
              <button type="button" onClick={() => navigate('/encontros')}
                className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  )
}