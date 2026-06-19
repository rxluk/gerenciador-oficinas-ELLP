import api from './api'

const certificadoService = {
  findAll: () => api.get('/certificados'),
  findById: (id) => api.get(`/certificados/${id}`),
  insert: (data) => api.post('/certificados', data),
  update: (id, data) => api.put(`/certificados/${id}`, data),
}

export default certificadoService