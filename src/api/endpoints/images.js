import api from '../axios';

export const imagesAPI = {
  // POST /api/productos/{productId}/images - Subir imagen (solo SELLER)
  upload: async (productId, formData) => {
    const response = await api.post(`/api/productos/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // GET /api/productos/{productId}/images - Obtener todas las imágenes del producto
  getByProduct: async (productId) => {
    const response = await api.get(`/api/productos/${productId}/images`);
    return response;
  },

  // GET /api/productos/{productId}/images/principal - Obtener imagen principal
  getPrincipal: async (productId) => {
    const response = await api.get(`/api/productos/${productId}/images/principal`);
    return response;
  },

  // GET /api/images/{imageId}/download - URL para visualizar imagen
  getImageUrl: (imageId) => {
    return `${import.meta.env.VITE_API_URL}/api/images/${imageId}/download`;
  },

  // PUT /api/images/{imageId}/principal - Marcar como principal (solo SELLER)
  markAsPrincipal: async (imageId) => {
    const response = await api.put(`/api/images/${imageId}/principal`);
    return response;
  },

  // DELETE /api/images/{imageId} - Eliminar imagen (solo SELLER)
  delete: async (imageId) => {
    const response = await api.delete(`/api/images/${imageId}`);
    return response;
  },
};