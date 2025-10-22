import api from '../axios';

export const ordersAPI = {
  // POST /orders/confirm - Confirmar orden (convertir carrito en orden)
  confirm: async () => {
    const response = await api.post('/orders/confirm');
    return response;
  },

  // GET /orders/me - Obtener órdenes del usuario autenticado
  getMyOrders: async () => {
    const response = await api.get('/orders/me');
    console.log("ORDERS RESPONSE", response);
    return response;
  },

  // GET /orders - Obtener todas las órdenes con filtros (solo SELLER)
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response;
  },
};