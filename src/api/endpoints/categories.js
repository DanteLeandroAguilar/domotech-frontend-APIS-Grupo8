 
import api from '../axios';

export const categoriesAPI = {
  // GET /categories - Obtener todas las categorías
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // GET /categories/{id} - Obtener categoría por ID
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // POST /categories - Crear categoría (solo SELLER)
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // PUT /categories/{id} - Actualizar categoría (solo SELLER)
  update: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // DELETE /categories/{id} - Eliminar categoría (solo SELLER)
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};