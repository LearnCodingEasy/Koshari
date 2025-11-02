import api from './api'

// API Methods
export default {
  allCategory: () => api.get('products/category/'),
  singleCategory: (id) => api.get(`products/category/${id}/`),
  createCategory: (data) => api.post('products/category/', data),
  updateCategory: (id, data) => api.put(`products/category/${id}/`, data),
  deleteCategory: (id) => api.delete(`products/category/${id}/`),
  toggleActive: (id) => api.post(`products/category/${id}/toggle_active/`),
}
