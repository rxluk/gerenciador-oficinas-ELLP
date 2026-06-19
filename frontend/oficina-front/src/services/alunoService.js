import api from './api'

const alunoService = {
  findAll: () => api.get('/alunos'),
  findById: (id) => api.get(`/alunos/${id}`),
  insert: (data) => api.post('/alunos', data),
  update: (id, data) => api.put(`/alunos/${id}`, data),
}

export default alunoService