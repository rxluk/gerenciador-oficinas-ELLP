import api from './api'

const matriculaService = {
  findAll: () => api.get('/matriculas'),
  findById: (id) => api.get(`/matriculas/${id}`),
  findByAluno: (alunoId) => api.get(`/matriculas/aluno/${alunoId}`),
  findByOficina: (oficinaId) => api.get(`/matriculas/oficina/${oficinaId}`),
  insert: (data) => api.post('/matriculas', data),
  update: (id, data) => api.put(`/matriculas/${id}`, data),
}

export default matriculaService