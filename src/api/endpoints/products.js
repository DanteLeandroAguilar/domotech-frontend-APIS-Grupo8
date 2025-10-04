 
import { 
  getCatalog, 
  getProductById, 
  searchProducts, 
  getProductsByCategory, 
  simulateApiDelay 
} from '../../data/mockData';

export const productsAPI = {
  // GET /api/products/catalog - Catálogo público con paginación
  getCatalog: async (page = 0, size = 12) => {
    await simulateApiDelay();
    return getCatalog(page, size);
  },

  // GET /api/products/{id} - Detalle de producto
  getById: async (id) => {
    await simulateApiDelay();
    const product = getProductById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  },

  // GET /api/products/search - Búsqueda de productos
  search: async (name, page = 0, size = 12) => {
    await simulateApiDelay();
    return searchProducts(name, page, size);
  },

  // GET /api/products/category/{categoryId} - Productos por categoría
  getByCategory: async (categoryId, page = 0, size = 12) => {
    await simulateApiDelay();
    return getProductsByCategory(categoryId, page, size);
  },

  // GET /api/products/filter - Filtros unificados
  filter: async (filters, page = 0, size = 12) => {
    await simulateApiDelay();
    // Por simplicidad, implementamos filtros básicos
    let filteredProducts = [...getCatalog(0, 1000).content];
    
    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter(p => p.category.id === parseInt(filters.categoryId));
    }
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(p => 
        p.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }
    
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filteredProducts.slice(startIndex, endIndex);
    
    return {
      content,
      totalElements: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / size),
      page,
      size
    };
  },

  // GET /api/products/{id}/stock/{quantity} - Verificar stock
  checkStock: async (id, quantity) => {
    await simulateApiDelay();
    const product = getProductById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return {
      available: product.stock >= quantity,
      stock: product.stock,
      requested: quantity
    };
  },

  // --- ENDPOINTS SOLO PARA VENDEDORES (SELLER) ---

  // POST /api/products - Crear producto
  create: async (productData) => {
    await simulateApiDelay();
    // Simular creación de producto
    const newProduct = {
      productId: Date.now(), // ID temporal
      ...productData,
      active: true,
      stock: productData.stock || 0
    };
    return newProduct;
  },

  // PUT /api/products/{id} - Actualizar producto
  update: async (id, productData) => {
    await simulateApiDelay();
    const product = getProductById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return { ...product, ...productData };
  },

  // PATCH /api/products/{id}/stock - Actualizar stock
  updateStock: async (id, stockData) => {
    await simulateApiDelay();
    const product = getProductById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return { ...product, stock: stockData.stock };
  },

  // PATCH /api/products/{id}/discount - Aplicar descuento
  applyDiscount: async (id, discountData) => {
    await simulateApiDelay();
    const product = getProductById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return { ...product, discount: discountData.discount };
  },

  // DELETE /api/products/{id}/discount - Quitar descuento
  removeDiscount: async (id) => {
    await simulateApiDelay();
    const product = getProductById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return { ...product, discount: 0 };
  },

  // DELETE /api/products/{id} - Eliminar producto
  delete: async (id) => {
    await simulateApiDelay();
    const product = getProductById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return { message: 'Producto eliminado correctamente' };
  },

  // GET /api/products - Lista completa (admin)
  getAll: async (page = 0, size = 20) => {
    await simulateApiDelay();
    return getCatalog(page, size);
  },
};