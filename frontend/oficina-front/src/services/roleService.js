import api from './api'

const roleService = {
  findAll: () => api.get('/roles'),
  findById: (id) => api.get(`/roles/${id}`),
  insert: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  findPermissions: (id) => api.get(`/roles/${id}/permissions`),
  addPermission: (id, permissionId) => api.post(`/roles/${id}/permissions/${permissionId}`),
  removePermission: (id, permissionId) => api.delete(`/roles/${id}/permissions/${permissionId}`),
}

export default roleService