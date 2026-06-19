import api from './api'

const usuarioService = {
  findAll: () => api.get('/usuarios'),
  findById: (id) => api.get(`/usuarios/${id}`),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  register: (data) => api.post('/auth/register', data),
  findRoles: (id) => api.get(`/usuarios/${id}/roles`),
  addRole: (id, roleId) => api.post(`/usuarios/${id}/roles/${roleId}`),
  removeRole: (id, roleId) => api.delete(`/usuarios/${id}/roles/${roleId}`),
}

export default usuarioService