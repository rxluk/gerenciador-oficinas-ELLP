import api from './api'

const frequenciaService = {
  findAll: () => api.get('/frequencias'),
  findById: (id) => api.get(`/frequencias/${id}`),
  findByMatricula: (matriculaId) => api.get(`/frequencias/matricula/${matriculaId}`),
  findByEncontro: (encontroId) => api.get(`/frequencias/encontro/${encontroId}`),
  insert: (data) => api.post('/frequencias', data),
  update: (id, data) => api.put(`/frequencias/${id}`, data),
}

export default frequenciaService