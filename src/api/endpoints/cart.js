import { mockCart, mockProducts, simulateApiDelay } from '../../data/mockData';

// Simular carrito en memoria
let cartData = { ...mockCart };

export const cartAPI = {
  // GET /carts/me - Obtener carrito del usuario autenticado
  getMyCart: async () => {
    await simulateApiDelay();
    return cartData;
  },

  // PATCH /carts/update-product - Actualizar cantidad de producto en carrito
  updateProductAmount: async (productId, amount) => {
    await simulateApiDelay();
    
    const product = mockProducts.find(p => p.productId === parseInt(productId));
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const existingItemIndex = cartData.items.findIndex(item => item.productId === parseInt(productId));
    
    if (amount <= 0) {
      // Eliminar producto del carrito
      if (existingItemIndex !== -1) {
        cartData.items.splice(existingItemIndex, 1);
      }
    } else {
      if (existingItemIndex !== -1) {
        // Actualizar cantidad existente
        cartData.items[existingItemIndex].amount = amount;
      } else {
        // Agregar nuevo producto al carrito
        cartData.items.push({
          productId: parseInt(productId),
          name: product.name,
          price: product.price - product.discount,
          amount: amount,
          image: product.principalImage?.url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
        });
      }
    }

    // Recalcular totales
    cartData.itemCount = cartData.items.reduce((total, item) => total + item.amount, 0);
    cartData.total = cartData.items.reduce((total, item) => total + (item.price * item.amount), 0);

    return cartData;
  },

  // GET /carts - Obtener todos los carritos (solo SELLER)
  getAll: async (params = {}) => {
    await simulateApiDelay();
    return {
      content: [cartData],
      totalElements: 1,
      totalPages: 1,
      page: 0,
      size: 20
    };
  },
}; 
