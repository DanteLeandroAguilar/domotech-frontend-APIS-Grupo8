 
import api from '../axios';

export const productsAPI = {
  // GET /api/products/catalog - Catálogo público con paginación
  getCatalog: async (page = 0, size = 12) => {
    const response = await api.get('/api/products/catalog', {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/products/{id} - Detalle de producto
  getById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  // GET /api/products/search - Búsqueda de productos
  search: async (name, page = 0, size = 12) => {
    const response = await api.get('/api/products/search', {
      params: { name, page, size }
    });
    return response.data;
  },

  // GET /api/products/category/{categoryId} - Productos por categoría
  getByCategory: async (categoryId, page = 0, size = 12) => {
    const response = await api.get(`/api/products/category/${categoryId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/products/filter - Filtros unificados
  filter: async (filters, page = 0, size = 12) => {
    const response = await api.get('/api/products/filter', {
      params: { ...filters, page, size }
    });
    return response.data;
  },

  // GET /api/products/{id}/stock/{quantity} - Verificar stock
  checkStock: async (id, quantity) => {
    const response = await api.get(`/api/products/${id}/stock/${quantity}`);
    return response.data;
  },

  // --- ENDPOINTS SOLO PARA VENDEDORES (SELLER) ---

  // POST /api/products - Crear producto
  create: async (productData) => {
    const response = await api.post('/api/products', productData);
    return response.data;
  },

  // PUT /api/products/{id} - Actualizar producto
  update: async (id, productData) => {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  },

  // PATCH /api/products/{id}/stock - Actualizar stock
  updateStock: async (id, stockData) => {
    const response = await api.patch(`/api/products/${id}/stock`, stockData);
    return response.data;
  },

  // PATCH /api/products/{id}/discount - Aplicar descuento
  applyDiscount: async (id, discountData) => {
    const response = await api.patch(`/api/products/${id}/discount`, discountData);
    return response.data;
  },

  // DELETE /api/products/{id}/discount - Quitar descuento
  removeDiscount: async (id) => {
    const response = await api.delete(`/api/products/${id}/discount`);
    return response.data;
  },

  // DELETE /api/products/{id} - Eliminar producto
  delete: async (id) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },

  // GET /api/products - Lista completa (admin)
  getAll: async (page = 0, size = 20) => {
    const response = await api.get('/api/products', {
      params: { page, size }
    });
    return response.data;
  },
};