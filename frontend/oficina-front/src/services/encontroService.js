import api from './api'

const encontroService = {
  findAll: () => api.get('/encontros'),
  findById: (id) => api.get(`/encontros/${id}`),
  findByOficina: (oficinaId) => api.get(`/encontros/oficina/${oficinaId}`),
  insert: (data) => api.post('/encontros', data),
  update: (id, data) => api.put(`/encontros/${id}`, data),
}

export default encontroService