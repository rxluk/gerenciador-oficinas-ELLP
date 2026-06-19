import api from './api'

const oficinaService = {
  findAll: () => api.get('/oficinas'),
  findById: (id) => api.get(`/oficinas/${id}`),
  insert: (data) => api.post('/oficinas', data),
  update: (id, data) => api.put(`/oficinas/${id}`, data),
}

export default oficinaService