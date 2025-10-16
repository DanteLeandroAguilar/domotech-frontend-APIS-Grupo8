import api from '../axios';

export const productsAPI = {
  // GET /api/products/catalog - Catálogo público con paginación
  getCatalog: async (page = 0, size = 12) => {
    const response = await api.get('/api/products/catalog', {
      params: { page, size }
    });
    return response;
  },

  // GET /api/products/{id} - Detalle de producto
  getById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response;
  },

  // GET /api/products/search - Búsqueda de productos
  search: async (term, page = 0, size = 12) => {
    const response = await api.get('/api/products/search', {
      params: { term, page, size }
    });
    return response;
  },

  // GET /api/products/category/{categoryId} - Productos por categoría
  getByCategory: async (categoryId, page = 0, size = 12) => {
    const response = await api.get(`/api/products/category/${categoryId}`, {
      params: { page, size }
    });
    return response;
  },

  // GET /api/products/filter - Filtros unificados
  filter: async ({
    categoryId,
    brand,
    minPrice,
    maxPrice,
    searchTerm,
    compatibility,
    connectionType,
    withStock,
    withDiscount,
    page = 0,
    size = 20,
    sortBy = 'name',
    sortDirection = 'asc'
  } = {}) => {
    const params = {};
    
    // Solo agregar parámetros que tienen valor
    if (categoryId !== undefined && categoryId !== null) params.categoryId = categoryId;
    if (brand) params.brand = brand;
    if (minPrice !== undefined && minPrice !== null) params.minPrice = minPrice;
    if (maxPrice !== undefined && maxPrice !== null) params.maxPrice = maxPrice;
    if (searchTerm) params.searchTerm = searchTerm;
    if (compatibility) params.compatibility = compatibility;
    if (connectionType) params.connectionType = connectionType;
    if (withStock !== undefined && withStock !== null) params.withStock = withStock;
    if (withDiscount !== undefined && withDiscount !== null) params.withDiscount = withDiscount;
    
    // Siempre agregar paginación y ordenamiento
    params.page = page;
    params.size = size;
    params.sortBy = sortBy;
    params.sortDirection = sortDirection;
    
    const response = await api.get('/api/products/filter', { params });
    return response;
  },

  // GET /api/products/{id}/stock/{quantity} - Verificar stock
  checkStock: async (id, quantity) => {
    const response = await api.get(`/api/products/${id}/stock/${quantity}`);
    return response;
  },

  // --- ENDPOINTS SOLO PARA VENDEDORES (SELLER) ---

  // POST /api/products - Crear producto
  create: async (productData) => {
    const response = await api.post('/api/products', productData);
    return response;
  },

  // PUT /api/products/{id} - Actualizar producto
  update: async (id, productData) => {
    const response = await api.put(`/api/products/${id}`, productData);
    return response;
  },

  // PATCH /api/products/{id}/stock - Actualizar stock
  updateStock: async (id, stockData) => {
    const response = await api.patch(`/api/products/${id}/stock`, stockData);
    return response;
  },

  // PATCH /api/products/{id}/discount - Aplicar descuento
  applyDiscount: async (id, discountData) => {
    const response = await api.patch(`/api/products/${id}/discount`, discountData);
    return response;
  },

  // DELETE /api/products/{id}/discount - Quitar descuento
  removeDiscount: async (id) => {
    const response = await api.delete(`/api/products/${id}/discount`);
    return response;
  },

  // DELETE /api/products/{id} - Eliminar producto
  delete: async (id) => {
    const response = await api.delete(`/api/products/${id}`);
    return response;
  },

  // GET /api/products - Lista completa (admin)
  getAll: async (page = 0, size = 20) => {
    const response = await api.get('/api/products', {
      params: { page, size }
    });
    return response;
  },
};