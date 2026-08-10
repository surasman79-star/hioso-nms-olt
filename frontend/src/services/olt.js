import api from './api'

const oltService = {
  getAll: () => api.get('/olt'),
  getById: (id) => api.get(`/olt/${id}`),
  create: (data) => api.post('/olt', data),
  update: (id, data) => api.put(`/olt/${id}`, data),
  delete: (id) => api.delete(`/olt/${id}`),
}

export default oltService