import api from '../axios';

export const categoriesAPI = {
  // GET /categories - Obtener todas las categorías
  getAll: async () => {
    const response = await api.get('/categories');
    return response;
  },

  // GET /categories/{id} - Obtener categoría por ID
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response;
  },

  // POST /categories - Crear categoría (solo SELLER)
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response;
  },

  // PUT /categories/{id} - Actualizar categoría (solo SELLER)
  update: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response;
  },

  // DELETE /categories/{id} - Eliminar categoría (solo SELLER)
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response;
  },
};