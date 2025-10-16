import api from '../axios';

export const cartAPI = {
  // GET /carts/me - Obtener carrito del usuario autenticado
  getMyCart: async () => {
    const response = await api.get('/carts/me');
    return response;
  },

  // PATCH /carts/update-product - Actualizar cantidad de producto en carrito
  updateProductAmount: async (productId, amount) => {
    const response = await api.patch(`/carts/update-product?idProduct=${productId}&amount=${amount}`);
    return response;
  },

  // GET /carts - Obtener todos los carritos (solo SELLER)
  getAll: async (params = {}) => {
    const response = await api.get('/carts', { params });
    return response;
  },
};